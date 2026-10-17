#!/usr/bin/env node
// npm run eval -- [--case alena|pacient-2|pacient-3] [--extracted <file>] [--out <file>] [--label "Slepý test"]
//
// Compares the extractor output (public/data/extracted-<case>.json) with the hand-made gold set (eval/gold-<case>.json)
// and re-checks everything against the original reports, independently of the extractor's own statistics:
//   X/20 fields correct · Y traps caught · fields without a verified citation · invented values.
// "Invented value" = a date, number, phone or e-mail in a value that does not occur in the cited report,
// or a value filled in where the gold set says the reports contain nothing.
// Writes public/data/eval-<case>.json; its Czech "headline" is meant for the UI ("Kontrolní sada: …" / "Slepý test: …").
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fold, isVerbatim } from '../src/ai/text.ts';
import { FIELD_SPECS } from '../src/ai/fields.ts';

const APP = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const CASES = {
  alena: { gold: 'eval/gold-alena.json', extracted: 'public/data/extracted-alena.json', out: 'public/data/eval-alena.json' },
  'pacient-2': { gold: 'eval/gold-pacient-2.json', extracted: 'public/data/extracted-pacient-2.json', out: 'public/data/eval-pacient-2.json' },
  // blind test: patient and gold set written by an agent that never saw the rules
  'pacient-3': { gold: 'data-pacient-3/gold-pacient-3.json', extracted: 'public/data/extracted-pacient-3.json', out: 'public/data/eval-pacient-3.json' },
};

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const readJson = (p) => JSON.parse(readFileSync(resolve(APP, p), 'utf8'));
const norm = (s) => fold(String(s ?? '')).toLocaleLowerCase('cs');
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const clip = (s, n = 90) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

/**
 * Case-insensitive containment that ignores dash/quote/space variants. Acronyms (CT, EUS, C25) and numbers match as whole
 * tokens, so "48" does not match "1948", "CT" does not match "ductus" and "8. 10. 2026" does not match "18. 10. 2026".
 */
function has(text, needle) {
  const n = norm(needle);
  if (!n) return false;
  const acronym = /\p{Lu}/u.test(needle) && !/\p{Ll}/u.test(needle);
  const pre = acronym ? '(?<![\\p{L}\\p{N}])' : /^\p{N}/u.test(n) ? '(?<!\\p{N})' : '';
  const post = acronym ? '(?![\\p{L}\\p{N}])' : /\p{N}$/u.test(n) ? '(?!\\p{N})' : '';
  return new RegExp(pre + esc(n) + post, 'u').test(norm(text));
}

// ---------- extraction helpers ----------

const fieldText = (f) => [f?.value, f?.conflict?.a?.value, f?.conflict?.b?.value].filter(Boolean).join(' · ');
const conflictCites = (f) => (f?.conflict ? [f.conflict.a?.citation, f.conflict.b?.citation].filter(Boolean) : []);
const allCites = (f) => [...(f?.citations ?? []), ...conflictCites(f)];

// ---------- invented-value detection ----------

const DATE_RE = /(?<!\d)(\d{1,2})\.\s?(\d{1,2})\.\s?(\d{4})(?!\d)/g;
const PHONE_RE = /\+?\d{3}(?:\s?\d{3}){2,3}/g;
const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.-]+/g;
const NUM_RE = /\d+(?:[.,]\d+)?/g;
const iso = (d, m, y) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

function datesIn(text) {
  return new Set([...fold(text).matchAll(DATE_RE)].map((m) => iso(m[1], m[2], m[3])));
}

function tokens(value) {
  const out = [];
  let rest = fold(value);
  rest = rest.replace(EMAIL_RE, (m) => { out.push({ kind: 'e-mail', raw: m }); return ' '; });
  rest = rest.replace(DATE_RE, (m, d, mo, y) => { out.push({ kind: 'dátum', raw: m, iso: iso(d, mo, y) }); return ' '; });
  rest = rest.replace(PHONE_RE, (m) => { out.push({ kind: 'telefón', raw: m }); return ' '; });
  for (const m of rest.matchAll(NUM_RE)) out.push({ kind: 'číslo', raw: m[0] });
  return out;
}

const decimalComma = (s) => fold(s).replace(/(\d)\.(\d)/g, '$1,$2');

function grounded(tok, texts) {
  switch (tok.kind) {
    case 'dátum': return texts.some((t) => datesIn(t).has(tok.iso));
    case 'telefón': { const p = tok.raw.replace(/\s/g, ''); return texts.some((t) => t.replace(/\s/g, '').includes(p)); }
    case 'e-mail': return texts.some((t) => t.toLowerCase().includes(tok.raw.toLowerCase()));
    default: {
      const re = new RegExp(`(?<![\\d,.])${esc(decimalComma(tok.raw))}(?!\\d|[,.]\\d)`);
      return texts.some((t) => re.test(decimalComma(t)));
    }
  }
}

// ---------- main ----------

const caseId = arg('case', 'alena');
const cfg = CASES[caseId];
if (!cfg) { console.error(`Neznámy prípad ${caseId}`); process.exit(1); }
const gold = readJson(cfg.gold);
const extractedPath = arg('extracted', cfg.extracted);
if (!existsSync(resolve(APP, extractedPath))) {
  console.error(`Chýba ${extractedPath} – spusti najprv: npm run extract -- --case ${caseId}`);
  process.exit(1);
}
const ex = readJson(extractedPath);
const source = readJson(gold.source);
const asOf = gold.asOf;
const docs = Object.fromEntries(source.documents.map((d) => [d.id, d]));
const included = new Set(source.documents.filter((d) => d.date <= asOf).map((d) => d.id));
const excluded = new Set(source.documents.filter((d) => d.date > asOf).map((d) => d.id));
const fieldsByKey = Object.fromEntries((ex.fields ?? []).map((f) => [f.key, f]));
const okCite = (c) => !!c && included.has(c.docId) && isVerbatim(docs[c.docId]?.text ?? '', c.quote ?? '');

// 1) gold integrity – every evidence quote must be verbatim in its report
const goldProblems = [];
for (const item of [...gold.fields, ...gold.traps]) {
  for (const e of item.evidence ?? []) {
    if (!docs[e.docId] || !isVerbatim(docs[e.docId].text, e.quote)) goldProblems.push(`${item.key ?? item.id}: „${e.quote}“ nie je doslova v správe ${e.docId}`);
  }
}

// 2) citations – re-verified against the original text
let citationsTotal = 0;
let citationsVerified = 0;
const badCitations = [];
for (const f of ex.fields ?? []) {
  for (const c of allCites(f)) {
    citationsTotal++;
    if (okCite(c)) citationsVerified++;
    else badCitations.push({ field: f.key, docId: c.docId, quote: clip(c.quote ?? '', 120), reason: excluded.has(c.docId) ? 'správa po dátume konzília' : 'citát nie je doslova v správe' });
  }
}
const uncited = (ex.fields ?? [])
  .filter((f) => f.status !== 'missing' && fieldText(f).trim() && !allCites(f).some(okCite))
  .map((f) => f.key);

// 3) fields vs gold
const fieldResults = gold.fields.map((g) => {
  const f = fieldsByKey[g.key];
  const label = FIELD_SPECS.find((s) => s.key === g.key)?.label ?? g.key;
  const problems = [];
  if (!f) return { key: g.key, label, ok: false, status: null, problems: ['pole chýba vo výstupe'] };
  const text = fieldText(f);
  const verified = allCites(f).filter(okCite);
  if (g.expect === 'missing') {
    if (f.status !== 'missing') problems.push(`má byť „chýba“, je „${f.status}“`);
    if ((f.value ?? '').trim()) problems.push(`hodnota má byť prázdna, je „${clip(f.value)}“`);
  } else {
    if (f.status === 'missing' || !text.trim()) problems.push('chýba hodnota');
    else {
      if (!verified.length) problems.push('bez overeného citátu');
      for (const group of g.accept ?? []) if (!group.some((a) => has(text, a))) problems.push(`chýba: ${group.join(' / ')}`);
      if (g.citeDocs && !verified.some((c) => g.citeDocs.includes(c.docId))) problems.push(`chýba citát zo správy ${g.citeDocs.join(' alebo ')}`);
    }
  }
  for (const r of g.reject ?? []) if (has(text, r)) problems.push(`nesmie obsahovať „${r}“`);
  for (const r of g.rejectRegex ?? []) if (new RegExp(r, 'iu').test(text)) problems.push(`nesmie obsahovať vzor ${r}`);
  const late = [...new Set(allCites(f).filter((c) => excluded.has(c.docId)).map((c) => c.docId))];
  if (late.length) problems.push(`cituje správu po konzíliu: ${late.join(', ')}`);
  return { key: g.key, label, ok: problems.length === 0, status: f.status, problems };
});

// 4) traps
const messages = [
  ...(ex.findings ?? []).map((x) => x.text),
  ...(ex.precheck?.findings ?? []).map((x) => x.text),
  ...(ex.fields ?? []).flatMap((f) => [f.note, f.conflict?.explain]),
].filter(Boolean);
const flags = [
  ...(ex.fields ?? []).filter((f) => f.conflict).map((f) => ({
    docIds: conflictCites(f).map((c) => c.docId),
    text: [f.conflict.a?.value, f.conflict.a?.citation?.quote, f.conflict.b?.value, f.conflict.b?.citation?.quote, f.conflict.explain].join(' '),
  })),
  ...(ex.findings ?? []).filter((x) => x.citations?.length).map((x) => ({
    docIds: x.citations.map((c) => c.docId),
    text: [x.text, ...x.citations.map((c) => c.quote)].join(' '),
  })),
];
const everyCitation = [
  ...(ex.fields ?? []).flatMap(allCites),
  ...(ex.findings ?? []).filter((x) => x.severity !== 'info').flatMap((x) => x.citations ?? []),
];

const CHECKS = {
  fieldStatus: (c) => fieldsByKey[c.field]?.status === c.status,
  fieldNotStatus: (c) => !!fieldsByKey[c.field] && fieldsByKey[c.field].status !== c.status,
  valueContains: (c) => c.all.every((s) => has(fieldText(fieldsByKey[c.field]), s)),
  valueNotContains: (c) => !!fieldsByKey[c.field] && !c.any.some((s) => has(fieldText(fieldsByKey[c.field]), s)),
  valueNotMatches: (c) => !!fieldsByKey[c.field] && !new RegExp(c.regex, 'iu').test(fieldText(fieldsByKey[c.field])),
  valuesNotContain: (c) => (ex.fields ?? []).every((f) => !c.any.some((s) => has(fieldText(f), s))),
  noteMatches: (c) => new RegExp(c.regex, 'iu').test(fieldsByKey[c.field]?.note ?? ''),
  citesDoc: (c) => (fieldsByKey[c.field]?.citations ?? []).some((x) => x.docId === c.docId && okCite(x)),
  noCitationFromDocs: (c) => everyCitation.every((x) => !c.docs.includes(x.docId)),
  messageMatches: (c) => messages.some((m) => c.all.every((r) => new RegExp(r, 'iu').test(m))),
  noMessageMatches: (c) => !messages.some((m) => c.all.every((r) => new RegExp(r, 'iu').test(m))),
  noteNotMatches: (c) => !!fieldsByKey[c.field] && !new RegExp(c.regex, 'iu').test(fieldsByKey[c.field].note ?? ''),
  textMatches: (c) => [...(c.messages ? messages : []), ...c.fields.map((k) => fieldText(fieldsByKey[k]))]
    .some((m) => c.all.every((r) => new RegExp(r, 'iu').test(m))),
  flagged: (c) => flags.some((fl) => fl.docIds.includes(c.docId) && c.all.every((s) => has(fl.text, s))),
};
const runCheck = (c) => (c.type === 'any' ? c.checks.some(runCheck) : (CHECKS[c.type]?.(c) ?? false));
const trapResults = gold.traps.map((t) => ({ id: t.id, title: t.title, why: t.why, caught: t.checks.every(runCheck) }));

// 5) invented values
const invented = [];
const goldMissing = new Set(gold.fields.filter((g) => g.expect === 'missing').map((g) => g.key));
const textsOf = (ids) => [...new Set(ids)].filter((id) => included.has(id)).map((id) => docs[id].text);
for (const f of ex.fields ?? []) {
  if (goldMissing.has(f.key) && (f.value ?? '').trim()) invented.push({ where: f.key, value: clip(f.value), reason: 'doplnená hodnota, ktorá v správach nie je' });
  const verified = (f.citations ?? []).filter(okCite).map((c) => c.docId);
  const pool = verified.length ? textsOf(verified) : textsOf([...included]);
  for (const tok of tokens(f.value ?? '')) {
    if (!grounded(tok, pool)) invented.push({ where: f.key, value: tok.raw, reason: `${tok.kind} nie je v citovanej správe` });
  }
  for (const side of ['a', 'b']) {
    const s = f.conflict?.[side];
    if (!s) continue;
    for (const tok of tokens(s.value ?? '')) {
      if (!grounded(tok, textsOf([s.citation?.docId]))) invented.push({ where: `${f.key} (rozpor ${side})`, value: tok.raw, reason: `${tok.kind} nie je v citovanej správe` });
    }
  }
}
for (const r of ex.labs ?? []) {
  const pool = textsOf([r.docId]);
  if (!pool.length) { invented.push({ where: `labs ${r.test}`, value: r.value, reason: 'správa neexistuje alebo je po konzíliu' }); continue; }
  // "Moč – Leukocyty": the specimen comes from the section heading (MOČ – SEDIMENT), so each part is checked separately
  if (!r.test.split(/\s[–-]\s/).every((part) => norm(pool[0]).includes(norm(part)))) invented.push({ where: `labs ${r.test}`, value: r.test, reason: 'názov vyšetrenia nie je v správe' });
  for (const tok of [...tokens(r.value ?? ''), ...tokens(r.date ? r.date.split('-').reverse().map(Number).join('. ') : '')]) {
    if (!grounded(tok, pool)) invented.push({ where: `labs ${r.test}`, value: tok.raw, reason: `${tok.kind} nie je v správe ${r.docId}` });
  }
}
for (const m of ex.meds ?? []) {
  const pool = textsOf([m.citation?.docId]);
  if (!okCite(m.citation)) { invented.push({ where: `meds ${m.name}`, value: m.name, reason: 'liek bez overeného citátu' }); continue; }
  if (!norm(pool[0]).includes(norm(m.name))) invented.push({ where: `meds ${m.name}`, value: m.name, reason: 'liek nie je v správe' });
  for (const tok of tokens(m.dose ?? '')) if (!grounded(tok, pool)) invented.push({ where: `meds ${m.name}`, value: tok.raw, reason: `${tok.kind} nie je v správe` });
}
for (const e of ex.exams ?? []) {
  const pool = textsOf([e.docId]);
  if (!pool.length) { invented.push({ where: `exams ${e.type}`, value: e.date, reason: 'správa neexistuje alebo je po konzíliu' }); continue; }
  const d = e.date ? e.date.split('-').reverse().map(Number).join('. ') : '';
  for (const tok of [...tokens(d), ...tokens(e.summary ?? '')]) {
    if (!grounded(tok, pool)) invented.push({ where: `exams ${e.type}`, value: tok.raw, reason: `${tok.kind} nie je v správe ${e.docId}` });
  }
}

// 6) report
const fieldsCorrect = fieldResults.filter((r) => r.ok).length;
const trapsCaught = trapResults.filter((t) => t.caught).length;
const summary = {
  fieldsCorrect,
  fieldsTotal: fieldResults.length,
  trapsCaught,
  trapsTotal: trapResults.length,
  fieldsWithoutVerifiedCitation: uncited.length,
  inventedValues: invented.length,
  citationsVerified,
  citationsTotal,
  goldIntegrity: goldProblems.length === 0,
};
const label = arg('label', /slep/i.test(gold.author ?? '') ? 'Slepý test' : 'Kontrolní sada');
const headline = `${label}: ${fieldsCorrect}/${fieldResults.length} položek správně · ${trapsCaught}/${trapResults.length} pastí zachyceno · ${invented.length} vymyšlených hodnot · ${citationsVerified}/${citationsTotal} citací doslova ve zprávách`;
const report = {
  caseId,
  label,
  generatedAt: new Date().toISOString(),
  asOf,
  gold: cfg.gold,
  extraction: { file: extractedPath, mode: ex.meta?.mode, model: ex.meta?.model ?? null, generatedAt: ex.meta?.generatedAt, promptVersion: ex.meta?.promptVersion },
  headline,
  summary,
  fields: fieldResults,
  traps: trapResults,
  invented,
  uncited,
  badCitations,
  goldProblems,
};
const out = resolve(APP, arg('out', cfg.out));
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(report, null, 2) + '\n');

console.log(`Kontrolná sada ${caseId} (stav k ${asOf}) · výstup: ${extractedPath} · režim ${ex.meta?.mode ?? '?'}${ex.meta?.model ? ` (${ex.meta.model})` : ''}`);
if (goldProblems.length) { console.log(`! Zlatá sada nie je overená v textoch:`); goldProblems.forEach((p) => console.log(`  ! ${p}`)); }
console.log(`Polia: ${fieldsCorrect}/${fieldResults.length} správne`);
fieldResults.filter((r) => !r.ok).forEach((r) => console.log(`  ✗ ${r.key}: ${r.problems.join('; ')}`));
console.log(`Pasce: ${trapsCaught}/${trapResults.length} zachytené`);
trapResults.filter((t) => !t.caught).forEach((t) => console.log(`  ✗ ${t.id}: ${t.title}`));
console.log(`Polia bez overeného citátu: ${uncited.length}${uncited.length ? ` (${uncited.join(', ')})` : ''}`);
console.log(`Vymyslené hodnoty: ${invented.length}`);
invented.slice(0, 20).forEach((x) => console.log(`  ✗ ${x.where}: „${x.value}“ – ${x.reason}`));
console.log(`Citáty: ${citationsVerified}/${citationsTotal} doslova v správach${badCitations.length ? ` (${badCitations.length} zlých)` : ''}`);
console.log(`Uložené: ${out.replace(APP + '/', 'app/')}`);
if (goldProblems.length) process.exitCode = 2;
