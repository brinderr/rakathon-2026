#!/usr/bin/env node
// npm run eval:plain
//
// Text without headings: referrals written as running sentences. The letters and their expected values in
// eval/bez-nadpisu/ were written by an agent with no access to the rules (blind). For each letter the engine runs
// (rules only, as in the browser) with the plain-text patterns off (before) and on (after) and we count:
//   read = fields with a value and a verified quote, correct = matches the expected value (or is missing when the
//   letter does not contain it), invented = a date/number/phone in a value that is not in the letter.
// Writes eval/vysledok-bez-nadpisu.json and public/data/bez-nadpisu.json (headline for the UI).
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractHandover } from '../src/ai/extract.ts';
import { fold } from '../src/ai/text.ts';

const APP = resolve(dirname(fileURLToPath(import.meta.url)), '..');
// sets of blind letters; the first run of each set is frozen in eval/vysledok-<set>-slepe.json and never overwritten
const SETS = ['bez-nadpisu', 'bez-nadpisu-2'].filter((s) => existsSync(join(APP, 'eval', s, 'gold.json')));
const KEY = { insurance: 'insurer', bodyMeasures: 'weightHeight' };
const norm = (s) => fold(String(s)).toLocaleLowerCase('cs').replace(/\s+/g, ' ').trim();

const DATE_RE = /(?<!\d)(\d{1,2})\.\s?(\d{1,2})\.\s?(\d{4})(?!\d)/g;
const iso = (d, m, y) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
/** Dates, phone numbers and other numbers of a value that do not occur in the letter (the letter's own date is allowed). */
function ungrounded(value, text, docDate) {
  const dates = new Set([...fold(text).matchAll(DATE_RE)].map((m) => iso(m[1], m[2], m[3])));
  dates.add(docDate);
  const out = [];
  let rest = fold(value).replace(DATE_RE, (m, d, mo, y) => { if (!dates.has(iso(d, mo, y))) out.push(m); return ' '; });
  const flat = fold(text).replace(/\s/g, '');
  rest = rest.replace(/\+?\d{3}(?:\s?\d{3}){2,3}/g, (m) => { if (!flat.includes(m.replace(/\s/g, ''))) out.push(m); return ' '; });
  const t = fold(text).replace(/(\d)\.(\d)/g, '$1,$2');
  for (const m of rest.replace(/(\d)\.(\d)/g, '$1,$2').matchAll(/\d+(?:,\d+)?/g)) {
    if (!new RegExp(`(?<![\\d,])${m[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\d]|,\\d)`).test(t)) out.push(m[0]);
  }
  return out;
}

if (!SETS.length) {
  console.log('Slepé žádanky zatím nejsou (eval/bez-nadpisu/gold.json) – není co měřit.');
  process.exit(0);
}

async function run(dir, letter, plainText) {
  const text = readFileSync(join(dir, letter.file), 'utf8');
  const r = await extractHandover({ caseId: letter.file, docs: [{ id: '01', date: letter.date, text }], asOf: '2026-10-31', plainText });
  const rows = [];
  for (const [gk, exp] of Object.entries(letter.expected)) {
    const key = KEY[gk] ?? gk;
    const f = r.fields.find((x) => x.key === key);
    const shown = !!f && f.status !== 'missing' && !!f.value && f.citations.length > 0;
    const must = exp.mustContain ?? [];
    let correct;
    if (!exp.present) correct = !shown;
    else if (!shown) correct = false;
    else if (key === 'sex') correct = norm(f.value) === norm(must[0] ?? '');
    else correct = must.every((m) => norm(f.value).includes(norm(m)));
    const bad = shown ? ungrounded(f.value, text, letter.date) : [];
    rows.push({ key, present: !!exp.present, shown, correct, value: shown ? f.value : '', expected: must, ungrounded: bad, note: f?.note });
  }
  return { rows, read: rows.filter((x) => x.shown).length, correct: rows.filter((x) => x.correct).length, wrongFill: rows.filter((x) => !x.present && x.shown).length, invented: rows.reduce((n, x) => n + x.ungrounded.length, 0), notice: r.meta.plainText?.notice };
}

const sets = [];
for (const set of SETS) {
const dir = join(APP, 'eval', set);
const gold = JSON.parse(readFileSync(join(dir, 'gold.json'), 'utf8'));
const letters = [];
console.log(`== ${set} (${gold.author})`);
for (const l of gold.letters) {
  if (!existsSync(join(dir, l.file))) throw new Error(`Chybí ${l.file}`);
  const before = await run(dir, l, false);
  const after = await run(dir, l, true);
  letters.push({ file: l.file, total: after.rows.length, before: { read: before.read, correct: before.correct, invented: before.invented }, after: { read: after.read, correct: after.correct, wrongFill: after.wrongFill, invented: after.invented }, notice: after.notice, fields: after.rows });
  console.log(`${l.file}: přečteno ${before.read} → ${after.read} z ${after.rows.length} · správně ${before.correct} → ${after.correct} · vymyšlené ${after.invented}${after.wrongFill ? ` · vyplněno, co v textu není: ${after.wrongFill}` : ''}`);
  for (const x of after.rows.filter((r) => !r.correct)) console.log(`   ✗ ${x.key}: ${x.shown ? `„${x.value.slice(0, 90)}“` : 'nepřečteno'}${x.present ? ` (čekáno: ${x.expected.join(', ')})` : ' (v textu není)'}`);
  for (const x of after.rows.filter((r) => r.ungrounded.length)) console.log(`   ! ${x.key}: bez opory v textu ${x.ungrounded.join(', ')}`);
}

const sum = (k, part) => letters.reduce((n, l) => n + l[part][k], 0);
const total = letters.reduce((n, l) => n + l.total, 0);
const summary = { letters: letters.length, total, readBefore: sum('read', 'before'), read: sum('read', 'after'), correctBefore: sum('correct', 'before'), correct: sum('correct', 'after'), invented: sum('invented', 'after'), wrongFill: sum('wrongFill', 'after') };
const frozen = join(APP, 'eval', `vysledok-${set}-slepe.json`);
const firstRun = !existsSync(frozen);
const result = { set, author: gold.author, generatedAt: new Date().toISOString(), summary, letters };
writeFileSync(join(APP, 'eval', `vysledok-${set}.json`), JSON.stringify(result, null, 2) + '\n');
if (firstRun) writeFileSync(frozen, JSON.stringify({ ...result, note: 'První běh na této sadě – před jakoukoli úpravou pravidel podle ní. Tento soubor se už nepřepisuje.' }, null, 2) + '\n');
const blind = JSON.parse(readFileSync(frozen, 'utf8')).summary;
const line = firstRun || blind.read === summary.read
  ? `${set}: naslepo přečteno ${summary.read} z ${total}, správně ${summary.correct} z ${total}, vymyšlené ${summary.invented}`
  : `${set}: naslepo přečteno ${blind.read} z ${total} (správně ${blind.correct}), po úpravě pravidel ${summary.read} z ${total} (správně ${summary.correct}) – to už slepé není; vymyšlené ${summary.invented}`;
console.log(line);
sets.push({ set, author: gold.author, blind, current: summary, line, letters: letters.map((l) => ({ file: l.file, before: l.before, after: l.after, notice: l.notice })) });
}

const headline = `Text bez nadpisů (žádanky od agenta bez přístupu k pravidlům, před úpravou motoru četl ${sets.reduce((n, x) => n + x.current.readBefore, 0)} z ${sets.reduce((n, x) => n + x.current.total, 0)}): ${sets.map((x) => x.line.replace(/^bez-nadpisu(-2)?: /, (m, two) => (two ? 'sada 2 – ' : 'sada 1 – '))).join(' · ')}`;
console.log(`\n${headline}`);
writeFileSync(join(APP, 'public/data/bez-nadpisu.json'), JSON.stringify({ generatedAt: new Date().toISOString(), command: 'npm run eval:plain', headline, sets }, null, 2) + '\n');
console.log('Uloženo: app/eval/vysledok-<sada>.json, app/public/data/bez-nadpisu.json');
