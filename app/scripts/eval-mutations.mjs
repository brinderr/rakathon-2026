#!/usr/bin/env node
// npm run eval:mutations
//
// "Zkuste to rozbít": a juror edits a report in the app and the engine must react sensibly – a new conflict,
// a conflict that disappears, or "chybí" – and never invent anything. Each mutation below changes the fictional
// reports, runs the engine (rules only, exactly as in the browser) and checks the expected reaction plus invariants:
// every citation verbatim in the (edited) report, every number/date of a value present in a cited report.
// Writes eval/vysledok-mutace.json and public/data/mutace.json (ready-made edits the UI can offer as buttons).
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractHandover } from '../src/ai/extract.ts';
import { fold, isVerbatim } from '../src/ai/text.ts';

const APP = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const load = (p) => JSON.parse(readFileSync(join(APP, p), 'utf8'));
const CASES = {
  alena: { source: load('public/data/source.json'), asOf: '2026-10-21' },
  'pacient-2': { source: load('data-pacient-2/source-pacient-2.json'), asOf: '2026-10-22' },
};

/** Edit = replace text in one report (or in all reports with docId "*"), or delete a report. */
function apply(docs, edits) {
  let out = docs.map((d) => ({ ...d }));
  for (const e of edits) {
    if (e.delete) { out = out.filter((d) => d.id !== e.delete); continue; }
    let hit = 0;
    out = out.map((d) => {
      if (e.docId !== '*' && d.id !== e.docId) return d;
      if (!d.text.includes(e.find)) return d;
      hit++;
      return { ...d, text: d.text.split(e.find).join(e.replace) };
    });
    if (!hit) throw new Error(`Úprava se nepoužila: „${e.find}“ ve zprávě ${e.docId}`);
  }
  return out;
}

const field = (r, key) => r.fields.find((f) => f.key === key);
const finding = (r, id) => r.findings.find((f) => f.id === id);
const filled = (r) => r.fields.filter((f) => f.status !== 'missing').length;

// ---------- the mutations (labels in Czech: they are shown in the UI) ----------
const MUTATIONS = [
  {
    case: 'alena', id: 'zakladni-stav', label: 'Beze změny (výchozí stav)', edits: [],
    expect: [
      ['19/20 položek vyplněno', (r) => filled(r) === 19],
      ['chybí ECOG', (r) => field(r, 'performance').status === 'missing'],
      ['rozpor apixaban (zpráva 09)', (r) => !!finding(r, 'date-conflict-09')],
      ['rozpor histologie (zpráva 11)', (r) => !!finding(r, 'date-conflict-11')],
    ],
  },
  {
    case: 'alena', id: 'jine-rc', label: 'Jiné rodné číslo v laboratorní zprávě 10', ui: true,
    edits: [{ docId: '10', find: 'RČ 635722/1013', replace: 'RČ 635722/1031' }],
    expect: [
      ['nový rozpor: jiné rodné číslo ve zprávě 10', (r) => !!finding(r, 'rc-mismatch-10')],
      ['laboratoř označena jako rozpor', (r) => field(r, 'labs').status === 'conflict'],
      ['rozpor cituje obě zprávy', (r) => { const c = field(r, 'labs').conflict; return !!c && c.b.citation.docId === '10' && c.a.citation.docId !== '10'; }],
    ],
  },
  {
    case: 'alena', id: 'oprava-apixabanu', label: 'Oprava data poslední dávky apixabanu na 10. 10. (zpráva 09)', ui: true,
    edits: [{ docId: '09', find: 'poslední dávka 18. 10. 2026', replace: 'poslední dávka 10. 10. 2026' }],
    expect: [
      ['rozpor apixabanu zmizel', (r) => !finding(r, 'date-conflict-09')],
      ['léky už nejsou v rozporu', (r) => field(r, 'medication').status !== 'conflict'],
      ['rozpor histologie zůstal', (r) => !!finding(r, 'date-conflict-11')],
    ],
  },
  {
    case: 'alena', id: 'doplneny-ecog', label: 'Doplněný „ECOG 1“ v žádance praktika (zpráva 07)', ui: true,
    edits: [{ docId: '07', find: 'Soběstačná, v práci', replace: 'Soběstačná, ECOG 1, v práci' }],
    expect: [
      ['výkonnostní stav vyplněn', (r) => field(r, 'performance').status !== 'missing' && /ECOG 1/.test(field(r, 'performance').value)],
      ['20/20 položek vyplněno', (r) => filled(r) === 20],
      ['žádné „chybí ECOG“', (r) => !r.findings.some((f) => f.id === 'ecog-missing')],
    ],
  },
  {
    case: 'alena', id: 'smazana-histologie', label: 'Smazaná zpráva 11 (histologie)', ui: true,
    edits: [{ delete: '11' }],
    expect: [
      ['histologie chybí', (r) => field(r, 'histology').status === 'missing'],
      ['rozpor histologie zmizel', (r) => !finding(r, 'date-conflict-11')],
      ['diagnóza si nevymyslela adenokarcinom', (r) => !/adenokarcinom/i.test(field(r, 'diagnosis').value)],
    ],
  },
  {
    case: 'alena', id: 'lokalizace-kauda', label: 'Ve zprávě CT (08) „kaudy“ místo „hlavy“ slinivky', ui: true,
    edits: [{ docId: '08', find: 'Tumor hlavy pankreatu 35 mm', replace: 'Tumor kaudy pankreatu 35 mm' }],
    expect: [
      ['nový rozpor lokalizace', (r) => !!finding(r, 'location-conflict')],
      ['rozpor cituje zprávu 08', (r) => (finding(r, 'location-conflict')?.citations ?? []).some((c) => c.docId === '08')],
    ],
  },
  {
    case: 'alena', id: 'nadpis-jmeno', label: 'Nadpis „Jméno a příjmení:“ místo „Pacientka:“ ve všech zprávách',
    edits: [{ docId: '*', find: 'Pacientka:', replace: 'Jméno a příjmení:' }],
    expect: [
      ['jméno a příjmení nalezeno', (r) => field(r, 'firstName').value === 'Alena' && field(r, 'lastName').value === 'Procházková'],
      ['pohlaví z textu („63letá pacientka“)', (r) => field(r, 'sex').value === 'žena'],
      ['věk a pojišťovna zůstaly', (r) => /63/.test(field(r, 'age').value) && field(r, 'insurer').value === '211'],
      ['žádné pole navíc nechybí', (r) => filled(r) === 19],
    ],
  },
  {
    case: 'alena', id: 'nadpis-pacient', label: 'Nadpis „Pacient:“ místo „Pacientka:“ ve všech zprávách',
    edits: [{ docId: '*', find: 'Pacientka:', replace: 'Pacient:' }],
    expect: [
      ['jméno nalezeno', (r) => field(r, 'lastName').value === 'Procházková'],
      ['pohlaví zůstalo žena (obecné „Pacient:“ nepřebije „pacientka“)', (r) => field(r, 'sex').value === 'žena' && field(r, 'sex').status !== 'conflict'],
      ['žádné pole navíc nechybí', (r) => filled(r) === 19],
    ],
  },
  {
    case: 'alena', id: 'prijmeni-velkymi', label: 'Příjmení velkými písmeny a první („PROCHÁZKOVÁ Alena“, zpráva 07)',
    edits: [{ docId: '07', find: 'Pacientka: Alena Procházková', replace: 'Pacientka: PROCHÁZKOVÁ Alena' }],
    expect: [['jméno a příjmení správně rozděleno', (r) => field(r, 'firstName').value === 'Alena' && field(r, 'lastName').value === 'PROCHÁZKOVÁ']],
  },
  {
    case: 'alena', id: 'bez-veku', label: 'Smazaný věk i datum narození',
    edits: [
      { docId: '*', find: 'Datum narození: 22. 7. 1963 (63 let)\n', replace: '' },
      { docId: '*', find: '63letá pacientka', replace: 'Pacientka' },
    ],
    expect: [['věk chybí (nepočítá se z rodného čísla)', (r) => field(r, 'age').status === 'missing' && !field(r, 'age').value]],
  },
  {
    case: 'alena', id: 'bez-kontaktni-osoby', label: 'Smazaná kontaktní osoba',
    edits: [{ docId: '*', find: 'Kontaktní osoba: Petra Horká (dcera), tel. +420 777 000 542\n', replace: '' }],
    expect: [['kontaktní osoba chybí', (r) => field(r, 'contactPerson').status === 'missing']],
  },
  {
    case: 'pacient-2', id: 'novak-strana-opravena', label: 'Novák: bronchoskopie opravena na pravou stranu (zpráva 06)',
    edits: [
      { docId: '06', find: 'tumor levého horního laloku', replace: 'tumor pravého horního laloku' },
      { docId: '06', find: 'tumor v levém horním laloku', replace: 'tumor v pravém horním laloku' },
    ],
    expect: [['rozpor strany zmizel', (r) => !finding(r, 'side-conflict')]],
  },
  {
    case: 'pacient-2', id: 'novak-rc-opraveno', label: 'Novák: opravené rodné číslo v laboratoři (zpráva 04)',
    edits: [{ docId: '04', find: 'RČ 660314/1234', replace: 'RČ 660314/1243' }],
    expect: [['rozpor rodného čísla zmizel', (r) => !r.findings.some((f) => f.id.startsWith('rc-mismatch'))]],
  },
];

// ---------- invariants: nothing invented ----------
const DATE_RE = /(?<!\d)(\d{1,2})\.\s?(\d{1,2})\.\s?(\d{4})(?!\d)/g;
const decimalComma = (s) => fold(s).replace(/(\d)\.(\d)/g, '$1,$2');
function ungrounded(value, texts) {
  const bad = [];
  let rest = fold(value);
  rest = rest.replace(DATE_RE, (m, d, mo, y) => {
    const ok = texts.some((t) => [...fold(t).matchAll(DATE_RE)].some((x) => +x[1] === +d && +x[2] === +mo && x[3] === y));
    if (!ok) bad.push(m);
    return ' ';
  });
  rest = rest.replace(/\+?\d{3}(?:\s?\d{3}){2,3}/g, (m) => { if (!texts.some((t) => t.replace(/\s/g, '').includes(m.replace(/\s/g, '')))) bad.push(m); return ' '; });
  for (const m of rest.matchAll(/\d+(?:[.,]\d+)?/g)) {
    const re = new RegExp(`(?<![\\d,.])${decimalComma(m[0]).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?!\\d|[,.]\\d)`);
    if (!texts.some((t) => re.test(decimalComma(t)))) bad.push(m[0]);
  }
  return bad;
}
function invariants(r, docs) {
  const byId = Object.fromEntries(docs.map((d) => [d.id, d]));
  const problems = [];
  for (const f of r.fields) {
    const cites = [...f.citations, ...(f.conflict ? [f.conflict.a.citation, f.conflict.b.citation] : [])];
    for (const c of cites) if (!byId[c.docId] || !isVerbatim(byId[c.docId].text, c.quote)) problems.push(`${f.key}: citace není doslova ve zprávě ${c.docId}`);
    if (f.status === 'missing' && f.value) problems.push(`${f.key}: „chybí“, ale má hodnotu`);
    const texts = [...new Set(f.citations.map((c) => c.docId))].map((id) => byId[id]?.text ?? '');
    if (f.value && texts.length) for (const b of ungrounded(f.value, texts)) problems.push(`${f.key}: „${b}“ není v citované zprávě`);
  }
  return problems;
}

// ---------- run ----------
const results = [];
for (const m of MUTATIONS) {
  const c = CASES[m.case];
  const docs = apply(c.source.documents.map((d) => ({ id: d.id, date: d.date, title: d.file, text: d.text })), m.edits);
  const t0 = performance.now();
  const r = await extractHandover({ caseId: m.case, docs, asOf: c.asOf });
  const ms = Math.round(performance.now() - t0);
  const checks = m.expect.map(([label, fn]) => ({ label, ok: !!fn(r) }));
  const inv = invariants(r, docs);
  results.push({ case: m.case, id: m.id, label: m.label, ok: checks.every((x) => x.ok) && !inv.length, ms, checks, invariants: inv, filled: `${filled(r)}/20` });
}

// eval catches a planted wrong output (ECOG 1, 63 kg, invented e-mail, fake quote, report 13)
{
  const ex = JSON.parse(readFileSync(join(APP, 'public/data/extracted-alena.json'), 'utf8'));
  const f = Object.fromEntries(ex.fields.map((x) => [x.key, x]));
  Object.assign(f.performance, { status: 'proposed', value: 'ECOG 1', citations: [{ docId: '07', quote: 'Soběstačná' }] });
  Object.assign(f.weightHeight, { value: '63 kg · výška 165 cm', citations: [{ docId: '12', quote: 'Hmotnost 63 kg.' }] });
  f.patientContact.value = 'tel. +420 777 000 541 · e-mail alena.prochazkova@example.com';
  f.diagnosis.citations = [{ docId: '07', quote: 'Suspektní diagnóza: karcinom pankreatu s metastázami do jater' }];
  f.other.citations.push({ docId: '13', quote: 'Pacientka si přeje, aby informace o léčbě byly sdělovány i dceři' });
  const dir = mkdtempSync(join(tmpdir(), 'eval-mut-'));
  writeFileSync(join(dir, 'bad.json'), JSON.stringify(ex));
  execFileSync(process.execPath, ['--experimental-strip-types', '--no-warnings', join(APP, 'scripts/eval.mjs'), '--extracted', join(dir, 'bad.json'), '--out', join(dir, 'ev.json')], { stdio: 'ignore' });
  const ev = JSON.parse(readFileSync(join(dir, 'ev.json'), 'utf8'));
  const checks = [
    { label: 'eval nedá 20/20', ok: ev.summary.fieldsCorrect < 20 },
    { label: 'eval najde vymyšlený ECOG a e-mail', ok: ev.invented.some((x) => x.where === 'performance') && ev.invented.some((x) => /e-mail/.test(x.reason)) },
    { label: 'eval najde citace mimo zprávy a po konziliu', ok: ev.badCitations.length >= 3 },
  ];
  results.push({ case: 'alena', id: 'eval-chyti-podvrh', label: 'Eval chytí podstrčený chybný výstup', ok: checks.every((x) => x.ok), ms: 0, checks, invariants: [], filled: `${ev.summary.fieldsCorrect}/20 správně` });
}

const passed = results.filter((x) => x.ok).length;
const report = { generatedAt: new Date().toISOString(), headline: `Zkuste to rozbít: ${passed}/${results.length} úprav otestováno bez chyby, 0 vymyšlených hodnot`, results };
writeFileSync(join(APP, 'eval/vysledok-mutace.json'), JSON.stringify(report, null, 2) + '\n');
// ready-made edits for the UI ("Zkuste to rozbít" buttons): only Alena, only the ones marked ui
const ui = MUTATIONS.filter((m) => m.ui).map((m) => ({ id: m.id, label: m.label, edits: m.edits, expect: m.expect.map(([label]) => label) }));
writeFileSync(join(APP, 'public/data/mutace.json'), JSON.stringify({ caseId: 'alena', mutations: ui }, null, 2) + '\n');

for (const x of results) {
  console.log(`${x.ok ? '✓' : '✗'} [${x.case}] ${x.label} (${x.filled}${x.ms ? `, ${x.ms} ms` : ''})`);
  for (const c of x.checks.filter((c) => !c.ok)) console.log(`    ✗ ${c.label}`);
  for (const p of x.invariants) console.log(`    ✗ ${p}`);
}
console.log(`\n${report.headline}\nUloženo: app/eval/vysledok-mutace.json, app/public/data/mutace.json`);
if (passed !== results.length) process.exitCode = 1;
