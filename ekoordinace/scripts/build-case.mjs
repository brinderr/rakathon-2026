#!/usr/bin/env node
// npm run data  (node --experimental-strip-types scripts/build-case.mjs)
//
// Computes the patient overview for eKoordinace from the fictional reports with the shared engine (app/src/ai, rules
// only) and writes src/data/alena.json. The journey follows the verbs of the VZP assignment (Zadani_ulohy):
// převzít → vyžádat a shromáždit → koordinovat → připravit podklad pro MDT → uzavřít smyčku. "Vytěžit" is what the app
// does for the coordinator, not a step of the patient's journey, so it has no step of its own.
// Every number, name, date and phone comes from the engine output or the report text; only the wording of the to-do
// titles is chosen here, per type of finding.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractHandover } from '../../app/src/ai/extract.ts';
import { FIELD_SPECS } from '../../app/src/ai/fields.ts';
import * as R from '../../app/src/ai/rules.ts';
import { czDate } from '../../app/src/ai/text.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const TODAY = '2026-10-19';
const MDT = '2026-10-21';
const DUE = '2026-10-20'; // the podklad goes out to the MDT members the day before
const source = JSON.parse(readFileSync(join(ROOT, '../app/public/data/source.json'), 'utf8'));
const docs = source.documents.map((d) => ({ id: d.id, date: d.date, title: d.file, text: d.text }));
const known = docs.filter((d) => d.date <= TODAY);
const r = await extractHandover({ caseId: 'alena', docs, asOf: MDT, generatedAt: `${TODAY}T08:00:00Z` });
const field = (k) => r.fields.find((f) => f.key === k);
const label = (k) => FIELD_SPECS.find((s) => s.key === k)?.label ?? k;

const dayMonth = (iso) => { const [, m, d] = iso.split('-').map(Number); return `${d}. ${m}.`; };
const span = (a, b) => (a.slice(0, 7) === b.slice(0, 7) ? `${Number(a.slice(8))}.–${dayMonth(b)}` : `${dayMonth(a)} – ${dayMonth(b)}`);
const reports = (n) => `${n} ${n === 1 ? 'zpráva' : n >= 2 && n <= 4 ? 'zprávy' : 'zpráv'}`;
const from = (n) => (n < 10 && [2, 3, 4, 6, 7].includes(n) ? 'ze' : 'z'); // ze dvou, z pěti
const sentences = (t) => t.split(/(?<=[.!?])\s+(?=\p{Lu})/u);
const phoneOf = (s) => s.match(/\+?\d{3}[\s\d]{6,}\d/)?.[0];
const unit = (d) => { const [place, dept = place] = R.facility(d).split(' – '); return { place, dept: dept.split(',')[0] }; };
const what = (d) => {
  const kind = R.docKind(d);
  const title = R.docTitle(d);
  if (kind === 'imaging') return title.split(/\s/)[0];
  if (kind === 'procedure' && /FNB|FNA|biops/i.test(title)) return 'Biopsie';
  if (kind === 'lab') return 'Kontrolní odběry';
  if (kind === 'histology') return 'Histologie';
  return title;
};
const doc = (d) => ({ id: d.id, date: d.date, title: R.docTitle(d), place: R.facility(d), ...(d.date === TODAY ? { isNew: true } : {}) });
/** Who signed the report: the last line that starts with a medical title ("MUDr. Martin Svoboda"). */
const signer = (d) => d.text.split('\n').map((l) => l.trim()).findLast((l) => /^(?:MUDr|MDDr|doc|prof)\.\s/.test(l)) ?? '';

const referral = known.filter((d) => R.docKind(d) === 'referral').sort((a, b) => b.date.localeCompare(a.date))[0];
const earlier = known.filter((d) => d.date <= referral.date && d.id !== referral.id);
const later = known.filter((d) => d.date > referral.date);
const fresh = known.filter((d) => d.date === TODAY);

// ---------- patient ----------
const female = field('sex').value === 'žena';
const name = `${field('firstName').value} ${field('lastName').value}`;
const INSURER_SHORT = { 111: 'VZP ČR', 201: 'VoZP ČR', 205: 'ČPZP', 207: 'OZP', 209: 'ZPŠ', 211: 'ZPMV ČR', 213: 'RBP' };
const insurer = field('insurer').value;
// diagnosis: the code from the referral, the type of tumour verbatim from the pathologist once the histology is in
const histologyDoc = known.filter((d) => R.docKind(d) === 'histology').sort((a, b) => b.date.localeCompare(a.date))[0];
const dxCode = field('diagnosis').value.match(/^[A-Z]\d{2}(?:\.\d{1,2})?/)?.[0] ?? '';
const diagnosis = histologyDoc && field('histology').value
  ? { code: dxCode, text: field('histology').value.split(/,|\s·\s|\.\s/)[0], source: `histologie ${dayMonth(histologyDoc.date)}`, docId: histologyDoc.id }
  : { code: dxCode, text: field('diagnosis').value.replace(/^[A-Z]\d{2}(?:\.\d{1,2})?\s*[–-]\s*/, '').replace(/\s*\(podezření[\s\S]*$/, ''), source: `podezření, žádanka ${dayMonth(referral.date)}`, docId: referral.id };

// ---------- people the coordinator calls ----------
const gp = r.referringGp ?? { name: 'praktický lékař' };
const GP = { role: 'Praktický lékař', name: gp.name, ...(gp.phone ? { phone: gp.phone } : {}) };
const PATIENT = { role: female ? 'Pacientka' : 'Pacient', name, phone: phoneOf(field('patientContact').value) };
const cp = field('contactPerson').value.match(/^(.+?)\s*\(([^)]+)\)/);
const RELATIVE = cp && {
  role: cp[2].charAt(0).toUpperCase() + cp[2].slice(1),
  name: cp[1],
  phone: phoneOf(field('contactPerson').value),
  ...(new RegExp(`Souhlasí se sdílením informací s ${cp[2].slice(0, 3)}`, 'i').test(referral.text) ? { note: `souhlas se sdílením informací (zpráva ${referral.id})` } : {}),
};
const contactsFor = (f) => {
  if (f.fieldKey === 'patientContact') return [PATIENT, RELATIVE].filter(Boolean);
  const d = docs.find((x) => x.id === f.citations[0]?.docId);
  if (!d || d.id === referral.id) return [GP];
  const phone = phoneOf(d.text.split(/^Pacient(?:ka)?:/m)[0].match(/Tel[^\n]*/i)?.[0] ?? '');
  return [{ role: unit(d).dept, name: signer(d), ...(phone ? { phone } : {}) }];
};

// ---------- what the coordinator still has to do before the MDT ----------
const drugs = field('medication').value.split(/,\s*/).map((m) => m.split(/\s/)[0].toLowerCase()).filter(Boolean);
const titleFor = (f) => {
  const quoted = f.citations.map((c) => c.quote).join(' ').toLowerCase();
  if (f.fieldKey === 'performance' && f.severity === 'missing') return 'Doplnit výkonnostní stav (ECOG)';
  if (f.fieldKey === 'patientContact' && /e-mail/i.test(f.text)) return `Zjistit e-mail ${female ? 'pacientky' : 'pacienta'}`;
  const drug = f.fieldKey === 'medication' && /vysazen/.test(quoted) && drugs.find((m) => quoted.includes(m));
  if (drug) return `Ověřit, kdy byl vysazen ${drug}`;
  if (f.fieldKey === 'histology' && /odběr/.test(quoted)) return 'Ověřit datum odběru vzorku na histologii';
  const l = label(f.fieldKey);
  return `${f.severity === 'missing' ? 'Doplnit' : 'Ověřit'} ${l.charAt(0).toLowerCase()}${l.slice(1)}`;
};
// the engine's reason without its instruction ("ověřte s …") – the title and the contact already say that
const whyFor = (f) => sentences(f.text.replace(/\s*\(MDT_zapis\)/g, '').replace(/\bpacienta\b/g, female ? 'pacientky' : 'pacienta'))
  .filter((s) => !/ověřte/i.test(s)).join(' ');
const FIRST = ['performance', 'medication', 'histology'];
const priority = (t) => { const i = FIRST.indexOf(t.field); return i < 0 ? FIRST.length : i; };
const todo = r.findings
  .filter((f) => (f.severity === 'missing' || f.severity === 'conflict') && f.fieldKey)
  .map((f) => ({
    field: f.fieldKey,
    kind: f.severity === 'missing' ? 'chybí' : 'rozpor',
    title: titleFor(f),
    why: whyFor(f),
    quotes: [...new Map(f.citations.map((c) => [c.quote, { docId: c.docId, quote: c.quote }])).values()],
    contacts: contactsFor(f),
  }))
  .sort((a, b) => priority(a) - priority(b));
const open = new Set(todo.map((t) => t.field));

const data = {
  generatedFrom: 'app/src/ai (pravidla) · app/public/data/source.json · npm run data',
  today: TODAY,
  mdtDate: MDT,
  patient: {
    name,
    initials: `${field('firstName').value[0]}${field('lastName').value[0]}`,
    sex: field('sex').value,
    born: (field('age').value.match(/nar\. ([^)]+)/) ?? [])[1] ?? '',
    age: field('age').value.replace(/\s*\(.*\)$/, ''),
    insurer: { code: insurer, short: INSURER_SHORT[insurer] ?? `ZP ${insurer}`, name: R.insurerName(insurer) ?? '' },
    diagnosis,
    phone: PATIENT.phone,
    contactPerson: RELATIVE,
    gp: GP,
  },
  stats: {
    fields: r.meta.stats.fields,
    ready: r.fields.filter((f) => f.value && f.status !== 'missing' && f.status !== 'conflict' && !open.has(f.key)).length,
    missing: todo.filter((t) => t.kind === 'chybí').length,
    conflicts: todo.filter((t) => t.kind === 'rozpor').length,
  },
  news: fresh.map((d) => ({ id: d.id, what: what(d), dept: unit(d).dept })),
  steps: [
    {
      id: 'prevzit', label: 'Žádost od praktika', title: 'Převzít žádost od praktika', status: 'done',
      date: referral.date, short: dayMonth(referral.date),
      summary: `Žádanka přišla ${czDate(referral.date)} · ${gp.name}, praktický lékař.`,
      docs: [doc(referral)],
    },
    {
      id: 'shromazdit', label: 'Předchozí zprávy', title: 'Vyžádat a shromáždit předchozí zprávy', status: 'done',
      short: reports(earlier.length),
      summary: `${reports(earlier.length)} ${from(new Set(earlier.map((d) => unit(d).place)).size)} ${new Set(earlier.map((d) => unit(d).place)).size} pracovišť je na jednom místě.`,
      docs: earlier.map(doc),
    },
    {
      id: 'koordinovat', label: 'Vyšetření', title: 'Koordinovat vyšetření', status: 'done',
      date: later[later.length - 1].date, short: span(later[0].date, later[later.length - 1].date),
      docs: later.map((d) => ({ ...doc(d), what: what(d) })),
    },
    {
      id: 'podklad', label: 'Podklad pro konzilium', title: `Připravit podklad pro konzilium ${czDate(MDT)}`, status: 'now',
      due: DUE, short: `do ${dayMonth(DUE)}`,
      todo,
    },
    {
      id: 'uzavrit', label: 'Závěr praktikovi', title: 'Poslat závěr praktikovi a doložit doručení', status: 'waiting',
      short: `po ${dayMonth(MDT)}`,
      summary: `Po konziliu ${czDate(MDT)} dostane závěr ${gp.name}.`,
    },
  ],
};
writeFileSync(join(ROOT, 'src/data/alena.json'), JSON.stringify(data, null, 2) + '\n');
console.log(`src/data/alena.json: ${data.steps.length} kroků, teď: ${data.steps.find((x) => x.status === 'now').title} (${todo.length} úkoly), dnes nové: ${data.news.map((n) => n.what).join(', ') || '–'}`);
