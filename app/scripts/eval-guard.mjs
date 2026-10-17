#!/usr/bin/env node
// npm run eval:guard
//
// Tests of the guards that check AI proposals, on Alena's reports. Starting point = the stored AI answer
// (eval/llm-cache, the one used in the app), in which we change one thing per field:
//   A. opposite meaning, the 5 sentences of critic 06 ("souhlasí" → "nesouhlasí", "s perineurální invazí" → "bez …", …)
//   B. more tricky variants, including ones the guard is known NOT to catch (antonyms without a negation word)
//   C. harmless rewording that keeps the meaning – must be accepted (false alarms)
// A and B run with the negation guard on and off (honest before/after). Then the deliberately hallucinating answer
// (eval/llm-fixtures/halucinujuci-model-alena.json) goes through the whole extraction and the eval.
// Writes eval/vysledok-opacny-vyznam.json, eval/vysledok-test-halucinacii.json and public/data/pojistka.json (for the UI).
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { extractHandover } from '../src/ai/extract.ts';

const APP = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const load = (p) => JSON.parse(readFileSync(join(APP, p), 'utf8'));
const source = load('public/data/source.json');
const docs = source.documents.map((d) => ({ id: d.id, date: d.date, title: d.file, text: d.text }));
const ASOF = '2026-10-21';
const GOOD = JSON.parse(load('eval/llm-cache/4234a107c7884be5.json').text);
const GOOD_NOVAK = load('eval/llm-cache/f4dc2cba7d5cf0d0.json');
const sourceNovak = load('data-pacient-2/source-pacient-2.json');

const A = [
  { id: 'souhlas', field: 'other', find: 'souhlasí se sdílením informací s dcerou', replace: 'nesouhlasí se sdílením informací s dcerou', what: '„Souhlasí se sdílením informací s dcerou“ → „nesouhlasí“' },
  { id: 'uz-vyloucilo', field: 'epicrisis', find: 'UZ 29. 9. 2026: ložisko hlavy pankreatu suspektní z malignity', replace: 'UZ 29. 9. 2026 vyloučilo ložisko hlavy pankreatu', what: '„UZ prokázalo ložisko“ → „UZ vyloučilo ložisko“' },
  { id: 'perineuralni', field: 'diagnosis', find: 's perineurální invazí', replace: 'bez perineurální invaze', what: '„s perineurální invazí“ → „bez perineurální invaze“' },
  { id: 'teploty', field: 'symptoms', append: ' Teploty přetrvávají.', cite: [{ docId: '07', quote: 'Teploty od září neměla.' }], what: '„Teploty od září neměla“ → „teploty přetrvávají“' },
  { id: 'ct-zajisteno', field: 'mdtQuestion', find: 'nezajištěnému termínu CT', replace: 'zajištěnému termínu CT', what: '„nezajištěnému termínu CT“ → „zajištěnému termínu CT“ (5. věta doplněná stejným způsobem)' },
];
const B = [
  { id: 'teploty-od-zari', field: 'symptoms', append: ' Teploty od září přetrvávají.', cite: [{ docId: '07', quote: 'Teploty od září neměla.' }], what: '„Teploty od září neměla“ → „Teploty od září přetrvávají“' },
  { id: 'nekuracka', field: 'other', append: ' Kuřačka.', cite: [{ docId: '07', quote: 'Abusus: nekuřačka, alkohol abstinentka' }], what: '„nekuřačka“ → „kuřačka“' },
  { id: 'murphy', field: 'symptoms', append: ' Murphyho znamení pozitivní.', cite: [{ docId: '04', quote: 'Murphyho znamení negativní' }], what: '„Murphyho znamení negativní“ → „pozitivní“' },
  { id: 'uzkostna', field: 'other', find: 'Velmi úzkostná, špatně spí', replace: 'Psychicky klidná, spí dobře', what: '„velmi úzkostná, špatně spí“ → „klidná, spí dobře“ (opak bez záporu – víme, že nechytí)' },
  { id: 'afebrilni', field: 'epicrisis', find: 'poté afebrilní', replace: 'poté febrilní', what: '„poté afebrilní“ → „poté febrilní“ (zápor předponou a- – víme, že nechytí)' },
];
const C = [
  { id: 'poradi-souhlas', field: 'other', find: 'souhlasí se sdílením informací s dcerou', replace: 'se sdílením informací s dcerou souhlasí', what: 'jiný slovosled, stejný význam' },
  { id: 'poradi-ubytek', field: 'symptoms', find: 'úbytek hmotnosti 4 kg za poslední měsíc', replace: 'za poslední měsíc úbytek hmotnosti 4 kg', what: 'jiný slovosled, stejný význam' },
  { id: 'termin-ct', field: 'epicrisis', find: 'CT se nepodařilo zajistit', replace: 'Termín CT se nepodařilo zajistit', what: 'zápor zůstal, přidané slovo' },
  { id: 'bez-teplot', field: 'symptoms', append: ' Od září bez teplot.', cite: [{ docId: '07', quote: 'Teploty od září neměla.' }], what: 'zápor jinými slovy („neměla“ → „bez teplot“)' },
  { id: 'apixaban', field: 'other', find: 'bez nutnosti překlenovací léčby', replace: 'překlenovací léčba není nutná', what: 'zápor jinými slovy („bez nutnosti“ → „není nutná“)' },
  { id: 'afebrilni-05', field: 'epicrisis', find: 'léčena ciprofloxacinem, poté afebrilní', replace: 'po ciprofloxacinu afebrilní', cite: [{ docId: '05', quote: 'Po ciprofloxacinu afebrilní od 4. 9.' }], what: 'jiná citovaná zpráva, stejný význam' },
  { id: 'vyzaruji', field: 'symptoms', find: 'Bolesti s propagací do zad, horší po jídle a v noci', replace: 'Bolesti vyzařují do zad, zhoršují se po jídle a v noci', what: 'jiná slova, stejný význam' },
  { id: 'nespi', field: 'other', find: 'Velmi úzkostná, špatně spí', replace: 'Velmi úzkostná, nespí dobře', what: 'zápor jinými slovy („špatně spí“ → „nespí dobře“)' },
];

/** Stored AI answer with one field changed. */
function variant(c) {
  const answer = structuredClone(GOOD);
  const f = answer.fields.find((x) => x.key === c.field);
  if (c.find) {
    if (!f.value.includes(c.find)) throw new Error(`Varianta ${c.id}: „${c.find}“ v poli ${c.field} není`);
    f.value = f.value.split(c.find).join(c.replace);
  }
  if (c.append) f.value += c.append;
  if (c.cite) f.citations.push(...c.cite);
  return { answer, value: f.value };
}

async function run(answer, negationGuard, d = docs, asOf = ASOF, caseId = 'alena') {
  const complete = async () => ({ text: typeof answer === 'string' ? answer : JSON.stringify(answer), model: 'test pojistky' });
  return extractHandover({ caseId, docs: d, asOf, complete, negationGuard, generatedAt: '2026-10-17T00:00:00Z' });
}

async function check(c, negationGuard) {
  const { answer, value } = variant(c);
  const r = await run(answer, negationGuard);
  const prov = r.provenance[c.field];
  const accepted = prov.extractor === 'llm';
  const reason = accepted ? 'přijato' : (prov.llmNote ?? '').replace(/^AI návrh zamítnut: /, '').replace(/ – použit text přímo ze zprávy$/, '');
  return { accepted, reason, value, shown: r.fields.find((x) => x.key === c.field)?.value ?? '' };
}

const rows = [];
for (const [group, list] of [['A', A], ['B', B], ['C', C]]) {
  for (const c of list) {
    const off = await check(c, false);
    const on = await check(c, true);
    rows.push({ group, id: c.id, field: c.field, what: c.what, aiValue: on.value, withoutGuard: off.accepted ? 'přijato' : `zamítnuto (${off.reason})`, accepted: on.accepted, reason: on.reason, negation: !on.accepted && /opačný význam/.test(on.reason) });
  }
}

// the stored answers themselves (Alena + Novák) must pass completely
const goodAlena = await run(GOOD, true);
const goodNovak = await run(GOOD_NOVAK.text, true, sourceNovak.documents.map((d) => ({ id: d.id, date: d.date, title: d.file, text: d.text })), sourceNovak.mdtDate, 'pacient-2');
const goodTotal = goodAlena.meta.stats.llmFieldsAccepted + goodAlena.meta.stats.llmFieldsRejected + goodNovak.meta.stats.llmFieldsAccepted + goodNovak.meta.stats.llmFieldsRejected;
const goodAccepted = goodAlena.meta.stats.llmFieldsAccepted + goodNovak.meta.stats.llmFieldsAccepted;

const caught = (g) => rows.filter((r) => r.group === g && !r.accepted).length;
const caughtOff = (g) => rows.filter((r) => r.group === g && r.withoutGuard !== 'přijato').length;
const n = (g) => rows.filter((r) => r.group === g).length;
const falseAlarms = rows.filter((r) => r.group === 'C' && !r.accepted).length + (goodTotal - goodAccepted);
const harmlessTotal = n('C') + goodTotal;

const headline = `Pojistka proti opačnému významu: zachyceno ${caught('A')} z ${n('A')} vět kritika 06 (bez ní ${caughtOff('A')} z ${n('A')}) · další záludné varianty ${caught('B')} z ${n('B')} · falešné poplachy ${falseAlarms} z ${harmlessTotal} správných návrhů`;

for (const r of rows) console.log(`${r.accepted ? (r.group === 'C' ? '✓' : '✗') : (r.group === 'C' ? '✗' : '✓')} [${r.group}] ${r.what}: ${r.accepted ? 'přijato' : `zamítnuto – ${r.reason}`}`);
console.log(`Uložené AI odpovědi (Alena + Novák): ${goodAccepted}/${goodTotal} polí přijato`);
console.log(`\n${headline}`);

const out = {
  what: 'Test pojistky proti opačnému významu (podle NegEx, Chapman 2001): uložená AI odpověď k Aleně, v každém poli změněn jeden význam. Skupina A = 5 vět kritika 06 (4 popsal doslova, 5. doplněna stejným způsobem), B = další záludné varianty včetně těch, které pojistka nechytí, C = neškodné přeformulování (musí projít).',
  command: 'npm run eval:guard',
  generatedAt: new Date().toISOString(),
  headline,
  summary: {
    criticCaught: caught('A'), criticTotal: n('A'), criticCaughtWithoutGuard: caughtOff('A'),
    extraCaught: caught('B'), extraTotal: n('B'),
    falseAlarms, harmlessTotal, storedAnswersAccepted: goodAccepted, storedAnswersTotal: goodTotal,
  },
  limits: [
    'Pojistka hlídá zápor (ne-, bez, vyloučil, neprokázal, negativní, žádný, neguje). Opak jiným slovem („úzkostná“ × „klidná“) ani zápor předponou a- („afebrilní“) nechytí – význam vět proto dál potvrzuje člověk.',
    'Varianty i pojistku jsme psali sami a pojistku jsme na nich ladili (časová slova, dělení vět) – není to slepý test ani klinická validace.',
  ],
  cases: rows,
};
writeFileSync(join(APP, 'eval/vysledok-opacny-vyznam.json'), JSON.stringify(out, null, 2) + '\n');

// ---- hallucinating model through the whole extraction + eval ----
const fixture = load('eval/llm-fixtures/halucinujuci-model-alena.json');
const halu = await run(fixture.answer, true);
const dir = mkdtempSync(join(tmpdir(), 'guard-'));
writeFileSync(join(dir, 'halu.json'), JSON.stringify(halu, null, 2));
execFileSync(process.execPath, ['--experimental-strip-types', '--no-warnings', join(APP, 'scripts/eval.mjs'), '--extracted', join(dir, 'halu.json'), '--out', join(dir, 'ev.json')], { stdio: 'ignore' });
const ev = JSON.parse(readFileSync(join(dir, 'ev.json'), 'utf8'));
const haluFields = fixture.answer.fields.map((f) => {
  const prov = halu.provenance[f.key];
  const accepted = prov.extractor === 'llm';
  return {
    field: f.key, aiValue: f.value, accepted,
    reason: accepted ? 'přijato – citace i čísla ověřeny' : (prov.llmNote ?? ''),
    rejectedQuotes: prov.rejected ?? [],
    shownValue: halu.fields.find((x) => x.key === f.key)?.value ?? '',
  };
});
const haluOut = {
  what: 'Test pojistky: záměrně chybná odpověď AI (eval/llm-fixtures/halucinujuci-model-alena.json – vymyšlené stadium, čísla, citace ze zprávy po konziliu, vymyšlené přání) prošla celým vytěžením.',
  command: 'npm run eval:guard',
  generatedAt: new Date().toISOString(),
  aiProposals: haluFields.length,
  accepted: haluFields.filter((f) => f.accepted).length,
  rejected: haluFields.filter((f) => !f.accepted).length,
  evalHeadline: ev.headline,
  evalSummary: ev.summary,
  fields: haluFields,
};
writeFileSync(join(APP, 'eval/vysledok-test-halucinacii.json'), JSON.stringify(haluOut, null, 2) + '\n');
const haluHeadline = `Záměrně chybná AI: zamítnuto ${haluOut.rejected} z ${haluOut.aiProposals} návrhů, přijat ${haluOut.accepted} správný · podklad poté ${ev.summary.fieldsCorrect}/${ev.summary.fieldsTotal}`;
console.log(haluHeadline);

writeFileSync(join(APP, 'public/data/pojistka.json'), JSON.stringify({
  generatedAt: out.generatedAt,
  headline, hallucinationHeadline: haluHeadline, summary: out.summary, limits: out.limits,
  cases: rows.map((r) => ({ group: r.group, field: r.field, what: r.what, accepted: r.accepted, reason: r.reason, withoutGuard: r.withoutGuard })),
}, null, 2) + '\n');
console.log('Uloženo: app/eval/vysledok-opacny-vyznam.json, app/eval/vysledok-test-halucinacii.json, app/public/data/pojistka.json');
