#!/usr/bin/env node
// npm run data  (node --experimental-strip-types scripts/build-case.mjs)
//
// Computes the patient journey for CORDIN from the fictional reports with the shared engine (app/src/ai, rules only)
// and writes src/data/alena.json. The six steps are the six verbs of the VZP assignment (Zadani_ulohy):
// převzít → vyžádat a shromáždit → vytěžit → koordinovat → připravit podklad pro MDT → uzavřít smyčku.
// Every number and line here comes from the engine output or the report headers, nothing is typed in by hand.
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
const source = JSON.parse(readFileSync(join(ROOT, '../app/public/data/source.json'), 'utf8'));
const docs = source.documents.map((d) => ({ id: d.id, date: d.date, title: d.file, text: d.text }));
const known = docs.filter((d) => d.date <= TODAY);
const r = await extractHandover({ caseId: 'alena', docs, asOf: MDT, generatedAt: `${TODAY}T08:00:00Z` });
const field = (k) => r.fields.find((f) => f.key === k);
const label = (k) => FIELD_SPECS.find((s) => s.key === k)?.label ?? k;
const doc = (d) => ({ id: d.id, date: d.date, title: R.docTitle(d), place: R.facility(d) });

const referral = known.filter((d) => R.docKind(d) === 'referral').sort((a, b) => b.date.localeCompare(a.date))[0];
const afterReferral = known.filter((d) => d.date > referral.date);
const STEP_NAME = { imaging: 'CT', procedure: 'Biopsie', lab: 'Kontrolní odběry', histology: 'Histologie' };
const coordinated = afterReferral.map((d) => ({ ...doc(d), what: STEP_NAME[R.docKind(d)] ?? R.docTitle(d) }));

// what the coordinator still has to do before the MDT: missing fields and conflicts found by the engine
const FIRST = ['performance', 'medication', 'histology'];
const priority = (t) => { const i = FIRST.indexOf(t.field); return i < 0 ? FIRST.length : i; };
const todo = r.findings
  .filter((f) => (f.severity === 'missing' || f.severity === 'conflict') && f.fieldKey)
  .map((f) => ({
    field: f.fieldKey,
    kind: f.severity === 'missing' ? 'chybí' : 'rozpor',
    title: `${f.severity === 'missing' ? 'Doplnit' : 'Ověřit'}: ${label(f.fieldKey)}`,
    detail: f.text,
    sources: [...new Set(f.citations.map((c) => c.docId))],
  }))
  .sort((a, b) => priority(a) - priority(b));

const s = r.meta.stats;
const data = {
  generatedFrom: 'app/src/ai (pravidla) · app/public/data/source.json · npm run data',
  today: TODAY,
  mdtDate: MDT,
  patient: {
    name: `${field('firstName').value} ${field('lastName').value}`,
    initials: `${field('firstName').value[0]}${field('lastName').value[0]}`,
    born: (field('age').value.match(/nar\. ([^)]+)/) ?? [])[1] ?? '',
    sex: field('sex').value,
    facts: { places: new Set(known.map((d) => R.facility(d).split(' – ')[0])).size, reports: known.length, fields: r.meta.stats.fields, found: r.meta.stats.withValue, missing: r.meta.stats.missing, conflicts: r.meta.stats.conflicts },
    age: field('age').value.replace(/\s*\(.*\)$/, ''),
    insurer: field('insurer').value,
    suspicion: field('diagnosis').value.replace(/\s*\(podezření.*$/, ''),
  },
  steps: [
    {
      id: 'prevzit', title: 'Převzít žádost od praktika', status: 'done', date: referral.date, who: 'praktický lékař → koordinátorka',
      summary: `Žádanka přišla ${czDate(referral.date)} · ${r.referringGp?.name ?? 'praktický lékař'}, praktický lékař.`,
      sources: [referral.id],
    },
    {
      id: 'shromazdit', title: 'Vyžádat a shromáždit zprávy', status: 'done', date: known[known.length - 1].date, who: 'pracoviště → koordinátorka',
      summary: `${known.length} zpráv na jednom místě (${czDate(known[0].date)} – ${czDate(known[known.length - 1].date)}).`,
      docs: known.map(doc),
    },
    {
      id: 'vytezit', title: 'Vytěžit údaje pro konzilium', status: 'done', date: TODAY, who: 'CORDIN',
      summary: `${s.withValue} z ${s.fields} údajů nalezeno, u každého věta ze zprávy · ${s.missing} chybí · ${s.conflicts} rozpory.`,
    },
    {
      id: 'koordinovat', title: 'Koordinovat vyšetření', status: 'done', date: coordinated[coordinated.length - 1]?.date, who: 'koordinátorka',
      summary: `Hotovo: ${coordinated.map((c, i) => (i && !/^\p{Lu}{2}/u.test(c.what) ? c.what.toLowerCase() : c.what)).join(', ')}.`,
      docs: coordinated,
    },
    {
      id: 'podklad', title: `Připravit podklad pro konzilium ${czDate(MDT)}`, status: 'now', due: '2026-10-20', who: 'koordinátorka',
      summary: `Před konziliem ${todo.length === 1 ? 'zbývá 1 věc' : todo.length < 5 ? `zbývají ${todo.length} věci` : `zbývá ${todo.length} věcí`}.`,
      todo,
    },
    {
      id: 'uzavrit', title: 'Poslat závěr praktikovi a doložit doručení', status: 'waiting', date: MDT, who: 'konzilium → koordinátorka',
      summary: `Po konziliu ${czDate(MDT)} dostane závěr ${r.referringGp?.name ?? 'praktický lékař'}.`,
    },
  ],
};
writeFileSync(join(ROOT, 'src/data/alena.json'), JSON.stringify(data, null, 2) + '\n');
console.log(`src/data/alena.json: ${data.steps.length} kroků, teď: ${data.steps.find((x) => x.status === 'now').title} (${todo.length} úkoly)`);
