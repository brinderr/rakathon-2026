#!/usr/bin/env node
// node scripts/build-pacient2.mjs && npm run verify
//
// Z Maťových výstupov vygeneruje dva TS súbory pre appku (NEUPRAVOVAŤ ich ručne):
//   src/data/pacient2.gen.ts – druhý fiktívny pacient Josef Novák (pľúca) ako plnohodnotný Case
//                              (vstup: public/data/extracted-pacient-2.json + data-pacient-2/source-pacient-2.json)
//   src/data/eval.gen.ts     – EVAL_SUMMARY: namerané čísla z public/data/eval-*.json (+ test poistky)
//
// Pravidlá:
// - Žiadne čísla napevno: všetko sa číta zo súborov. Keď Maťo prepočíta extract/eval, spusti tento skript znova
//   (npm run verify inak skončí chybou „generované dáta nesedia“).
// - ID správ Josefa majú prefix N- (ako K-01, P-01, R-01), inak by sa pri ňom zobrazili texty správ Aleny.
// - Názov nemocnice v Benešove je nahradený fiktívnym (QA R2 #3: „Máchova 400, Benešov“ je adresa skutočnej
//   nemocnice). Nahrádza sa rovnako v textoch aj v citátoch, takže citáty ostávajú doslovné (stráži verify).
// - Predpoklady prototypu (dátum prijatia, kanál, termín ďalšieho kroku) sú označené „predpoklad“.
// - Jazyk UI je čeština: názvy správ, pracovísk, krokov, záznamu a popisy 20 polí (CZ_LABEL podľa Handover_obsah)
//   sú tu po česky. Hodnoty, poznámky a vysvetlenia rozporov prichádzajú z Maťovho motora (src/ai/*); ich vlastné
//   vety (mimo citátov „…“) prevedie do češtiny ten istý prevodník ako obrazovka „Zpracování naživo“
//   (src/components/live/cesky.ts). Citáty sa nemenia. Český text motora prejde bez zmeny.

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cz } from '../src/components/live/cesky.ts';

const APP = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const rd = (p) => JSON.parse(readFileSync(join(APP, p), 'utf8'));
const die = (msg) => { console.error('✗ ' + msg); process.exit(1); };

// ------------------------------------------------------------------ fiktívne názvy namiesto skutočného pracoviska
const SANITIZE = [
  ['Laboratoř Benešov s.r.o.', 'Laboratoř LabPodhájí s.r.o.'],
  ['Nemocnice Benešov', 'Nemocnice Podhájí'],
  ['Máchova 400', 'Nemocniční 40'],
];
const sanitize = (s) => SANITIZE.reduce((t, [a, b]) => t.split(a).join(b), s);
const deep = (v) => (typeof v === 'string' ? sanitize(v)
  : Array.isArray(v) ? v.map(deep)
  : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, deep(x)]))
  : v);

// ------------------------------------------------------------------ vstupy
const EXTRACTED = 'public/data/extracted-pacient-2.json';
const SOURCE = 'data-pacient-2/source-pacient-2.json';
const ex = rd(EXTRACTED);
const src = rd(SOURCE);
const text = Object.fromEntries(src.documents.map((d) => [d.id, sanitize(d.text)]));
const need = (id, s) => { if (!text[id]?.includes(s)) die(`správa ${id} neobsahuje „${s}“ – skontroluj údaje pacienta v build-pacient2.mjs`); return s; };

const pid = (id) => `N-${id}`;
const cit = (c) => ({ docId: pid(c.docId), quote: c.quote });
const RECEIVED = '2026-10-07'; // dátum žiadosti 09; prílohy 02, 04–08 sú v nej vymenované. 01 a 03: predpoklad (v zozname príloh nie sú)
const MDT = src.mdtDate;       // 2026-10-22
const DUE = '2026-10-21';      // predpoklad prototypu: termín = deň pred konzíliom

// ------------------------------------------------------------------ správy
const META = { // [název, pracoviště, druh] podle hlavičky zprávy; 'request' má jen 09 (appka ji bere jako žádanku do KOC)
  '01': ['Praktická lékařka – žádost o vyšetření u pneumologa', 'Ordinace praktického lékaře, Benešov', 'report'],
  '02': ['RTG hrudníku', 'Nemocnice Podhájí – radiologie', 'result'],
  '03': ['Pneumolog – vstupní vyšetření', 'Nemocnice Podhájí – plicní ambulance', 'report'],
  '04': ['Laboratoř a nádorové markery', 'Laboratoř LabPodhájí s.r.o.', 'result'],
  '05': ['CT hrudníku a horního břicha', 'Nemocnice Podhájí – radiologie', 'result'],
  '06': ['Bronchoskopie s EBUS-TBNA – protokol', 'KOC 2 · Nemocnice Lipová – bronchologie', 'report'],
  '07': ['Histologie – bioptický nález', 'KOC 2 · Nemocnice Lipová – patologie', 'result'],
  '08': ['PET/CT celotělové', 'KOC 1 · Nemocnice Severní – nukleární medicína', 'result'],
  '09': ['Žádost pneumologa o převzetí do KOC (epikríza)', 'Nemocnice Podhájí – plicní ambulance', 'request'],
  '10': ['Nutriční ambulance – screening', 'KOC 2 · Nemocnice Lipová – nutriční ambulance', 'report'],
};
// Popisy 20 polí podle šablony VZP „Handover_obsah“ (česky) – stejné jako u Aleny (src/data/cases.ts), klíče jsou pevné.
const CZ_LABEL = {
  firstName: 'Jméno', lastName: 'Příjmení', age: 'Věk', sex: 'Pohlaví', insurer: 'Zdravotní pojišťovna',
  patientContact: 'Kontakt na pacienta', contactPerson: 'Kontaktní osoba a telefon',
  diagnosis: 'Diagnóza', epicrisis: 'Epikríza (stručný souhrn nemoci)', mdtQuestion: 'Požadavek / otázka na MDT',
  comorbidities: 'Komorbidity (přidružené nemoci)', medication: 'Léková anamnéza (užívané léky)', allergies: 'Alergie',
  performance: 'Stav výkonnosti (ECOG)', weightHeight: 'Váha a výška', symptoms: 'Příznaky nemoci a jejich počátek',
  exams: 'Provedená vyšetření', labs: 'Laboratorní výsledky včetně onkomarkerů', histology: 'Histologie',
  other: 'Jiná důležitá sdělení a přání pacienta',
};
const docs = src.documents.map((d) => {
  if (!META[d.id]) die(`správa ${d.id} nemá metadáta v META`);
  const [title, place, kind] = META[d.id];
  return {
    id: pid(d.id), title, place, kind, examDate: d.date,
    receivedAt: d.date > RECEIVED ? d.date : RECEIVED,
    channel: d.id === '10' ? 'NIS' : 'e-mail', // predpoklad: 09 má e-mail v hlavičke a prílohy; 10 je interná správa KOC
    text: text[d.id],
  };
});

// ------------------------------------------------------------------ polia podkladu (presne výstup vyťaženia, len s prefixom ID)
const origin = {};
const fields = ex.fields.map((f) => {
  origin[f.key] = ex.provenance?.[f.key]?.extractor === 'llm' ? 'ai' : 'rules';
  const out = { ...f, label: CZ_LABEL[f.key] ?? f.label, value: cz(f.value), citations: f.citations.map(cit) };
  if (f.note) out.note = cz(f.note);
  if (f.conflict) {
    out.conflict = {
      a: { ...f.conflict.a, value: cz(f.conflict.a.value), citation: cit(f.conflict.a.citation) },
      b: { ...f.conflict.b, value: cz(f.conflict.b.value), citation: cit(f.conflict.b.citation) },
      explain: cz(f.conflict.explain),
    };
  }
  return out;
});
if (fields.length !== 20) die(`vyťaženie má ${fields.length} polí, čakám 20`);

// ------------------------------------------------------------------ cesta pacienta
const h = (state, date) => ({ state, date });
const exam = (id, title, place, owner, done, delivered, doc) =>
  ({ id, title, place, owner, due: delivered, state: 'delivered', history: [h('done', done), h('delivered', delivered)], resultDocId: pid(doc) });
const steps = [
  exam('rtg', 'RTG hrudníku', 'Nemocnice Podhájí – radiologie', 'radiologie Nemocnice Podhájí', '2026-08-26', '2026-08-26', '02'),
  exam('ct', 'CT hrudníku a horního břicha', 'Nemocnice Podhájí – radiologie', 'radiologie Nemocnice Podhájí', '2026-09-10', '2026-09-10', '05'),
  exam('bronch', 'Bronchoskopie s EBUS-TBNA', 'KOC 2 · Nemocnice Lipová – bronchologie', 'bronchologie KOC 2', '2026-09-17', '2026-09-17', '06'),
  exam('histology', 'Histologie (výsledek biopsie)', 'KOC 2 · Nemocnice Lipová – patologie', 'patologie KOC 2', '2026-09-17', '2026-09-23', '07'),
  exam('pet', 'PET/CT celotělové', 'KOC 1 · Nemocnice Severní – nukleární medicína', 'nukleární medicína KOC 1', '2026-10-01', '2026-10-01', '08'),
  { // zpráva 07: „Prediktivní vyšetření (EGFR, ALK, ROS1, PD-L1) probíhá“ – termín je předpoklad (den před MDT)
    // POZOR: components/docs/mdtModel.ts hledá tento krok podle /dodatok/i – po přechodu na češtinu tam patří /dodat[eo]k/i.
    id: 'markers', title: 'Dodatek k histologii: EGFR, ALK, ROS1, PD-L1', place: 'KOC 2 · Nemocnice Lipová – patologie',
    owner: 'patologie KOC 2', due: DUE, state: 'ordered', history: [h('ordered', '2026-09-23')],
  },
  { // předpoklad: datum zařazení na MDT neznáme, použito datum přijetí žádosti
    id: 'mdt', title: 'MDT (multidisciplinární tým)', place: 'KOC 2 · Nemocnice Lipová', owner: 'já (koordinátorka) – podklad', due: MDT,
    state: 'ordered', history: [h('ordered', RECEIVED)],
  },
];

// ------------------------------------------------------------------ prípad
const conflicts = fields.filter((f) => f.status === 'conflict').length;
const pendingAddenda = (ex.findings ?? []).filter((x) => x.severity === 'missing').length;
const plural = (n, one, few, many) => (n === 1 ? one : n >= 2 && n <= 4 ? few : many);
const nextText = [
  `${conflicts} ${plural(conflicts, 'rozpor', 'rozpory', 'rozporů')}`,
  pendingAddenda ? 'chybí dodatek k histologii (EGFR, ALK, ROS1, PD-L1)' : '',
].filter(Boolean).join(', ');

const NOVAK = deep({
  id: 'novak',
  demo: 'full',
  patient: {
    firstName: 'Josef', lastName: 'Novák', age: 60, sex: 'muž',
    insurerCode: '111', insurerName: 'Všeobecná zdravotní pojišťovna ČR',
    phone: need('09', '+420 603 000 118'),
    contact: { name: 'Marie Nováková', relation: 'manželka', phone: need('09', '+420 603 000 119') },
  },
  referringGp: {
    name: ex.referringGp.name, practice: 'Plicní ambulance, Nemocnice Podhájí',
    phone: ex.referringGp.phone, email: ex.referringGp.email,
  },
  diagnosisShort: 'adenokarcinom plic (C34.1)', // bez strany – strana je v rozporu (06 vs. ostatní zprávy)
  koc: 'KOC 2 · Nemocnice Lipová',
  mdtDate: MDT,
  receivedAt: RECEIVED,
  status: 'active',
  nextStep: { text: `Zkontrolovat návrh podkladu od AI: ${nextText}`, owner: 'já (koordinátorka)', due: DUE, mine: true },
  clockTargetDays: 33, // vyžaduje typ Case; v UI se cílová lhůta neukazuje (jen „den X od přijetí žádosti“)
  fields,
  steps,
  labs: ex.labs.map((r) => ({ ...r, docId: pid(r.docId) })),
  meds: ex.meds.map((m) => ({ ...m, citation: cit(m.citation) })),
  exams: ex.exams.map((e) => ({ ...e, docId: pid(e.docId) })),
  docs,
  log: [
    {
      date: RECEIVED, action: 'Převzata žádost pneumologa o převzetí do KOC',
      detail: `Zpráva ${pid('09')} s výsledky v příloze (RTG, laboratoř, CT, bronchoskopie, histologie, PET/CT). Založen případ, počítají se dny od přijetí žádosti.`,
      billable: true,
    },
    {
      date: RECEIVED, action: 'Podklad předvyplněn strojově',
      detail: `${fields.length} polí · ${ex.meta.stats.citationsVerified}/${ex.meta.stats.citations} citátů doslova · ${conflicts} ${plural(conflicts, 'rozpor', 'rozpory', 'rozporů')} · v demu předpočítáno, čeká na kontrolu člověkem.`,
      billable: false,
    },
  ],
  precheck: ex.precheck,
  reviewer: {
    insurerCode: '111', insurerName: 'Všeobecná zdravotní pojišťovna ČR',
    note: 'Pacient je pojištěncem VZP (111). Pokud má souhrn dostat i revizní lékař (chce to prezentace VZP), šel by reviznímu lékaři VZP. Kanál v ČR nemáme ověřený, odeslání je v prototypu jen naznačeno.',
  },
});

/** Popis modelu z motora (po slovensky) → česky pro tooltip v hlavičce prípadu. */
const czModel = (m) => (m ? m
  .replace('náhrada bez Azure kľúča – odpoveď z Claude Code na presne tento prompt (ostrý režim: Azure OpenAI EU)',
    'náhrada bez klíče k Azure – odpověď z Claude Code na přesně tento prompt (ostrý režim: Azure OpenAI EU)') : null);

const NOVAK_AI = {
  label: 'AI výstup (předpočítaný)',
  mode: ex.meta.mode,
  model: czModel(ex.meta.model ?? null),
  generatedAt: ex.meta.generatedAt,
  evalFile: 'data/eval-pacient-2.json',
  fieldOrigin: origin,
};

// ------------------------------------------------------------------ meranie (EVAL_SUMMARY)
const EVALS = [
  { file: 'public/data/eval-alena.json', extracted: 'public/data/extracted-alena.json', caseId: 'alena', patient: 'Alena P.', topic: 'pankreas', appShows: 'manual' },
  { file: 'public/data/eval-pacient-2.json', extracted: EXTRACTED, caseId: 'novak', patient: 'Josef N.', topic: 'plíce', appShows: 'this-extraction' },
];
const sources = { [EXTRACTED]: ex.meta.generatedAt };
const cases = EVALS.map((e) => {
  const ev = rd(e.file);
  const xt = rd(e.extracted);
  sources[e.file] = ev.generatedAt;
  sources[e.extracted] = xt.meta.generatedAt;
  const s = ev.summary;
  return {
    caseId: e.caseId, evalCaseId: ev.caseId, patient: e.patient, topic: e.topic,
    file: e.file.replace(/^public\//, ''),
    measuredAt: ev.generatedAt,
    extraction: { mode: ev.extraction.mode, model: ev.extraction.model ?? null, generatedAt: ev.extraction.generatedAt, promptVersion: ev.extraction.promptVersion ?? null },
    appShows: e.appShows,
    inSync: ev.extraction.generatedAt === xt.meta.generatedAt,
    fieldsCorrect: s.fieldsCorrect, fieldsTotal: s.fieldsTotal,
    trapsCaught: s.trapsCaught, trapsTotal: s.trapsTotal,
    inventedValues: s.inventedValues, fieldsWithoutVerifiedCitation: s.fieldsWithoutVerifiedCitation,
    citationsVerified: s.citationsVerified, citationsTotal: s.citationsTotal,
    goldIntegrity: s.goldIntegrity === true,
    headline: ev.headline,
    traps: ev.traps.map((t) => ({ id: t.id, title: t.title, caught: t.caught === true })),
  };
});
const sum = (k) => cases.reduce((n, c) => n + c[k], 0);
const total = {
  cases: cases.length,
  fieldsCorrect: sum('fieldsCorrect'), fieldsTotal: sum('fieldsTotal'),
  trapsCaught: sum('trapsCaught'), trapsTotal: sum('trapsTotal'),
  inventedValues: sum('inventedValues'), fieldsWithoutVerifiedCitation: sum('fieldsWithoutVerifiedCitation'),
  citationsVerified: sum('citationsVerified'), citationsTotal: sum('citationsTotal'),
  allGoldIntact: cases.every((c) => c.goldIntegrity),
  allInSync: cases.every((c) => c.inSync),
};

// Test poistky (úmyselne chybná AI odpoveď). Kópia v public/data má prednosť pred eval/.
const HALU = ['public/data/vysledok-test-halucinacii.json', 'eval/vysledok-test-halucinacii.json'].find((p) => existsSync(join(APP, p)));
let hallucinationTest = null;
if (HALU) {
  const t = rd(HALU);
  sources[HALU] = t.generatedAt;
  const labels = Object.fromEntries(rd('public/data/extracted-alena.json').fields.map((f) => [f.key, f.label]));
  hallucinationTest = {
    file: HALU,
    what: t.what,
    generatedAt: t.generatedAt,
    aiProposals: t.aiProposals, accepted: t.accepted, rejected: t.rejected,
    // čísla podkladu PO teste (z toho istého behu, nie z aktuálneho evalu)
    after: { fieldsCorrect: t.evalSummary.fieldsCorrect, fieldsTotal: t.evalSummary.fieldsTotal, inventedValues: t.evalSummary.inventedValues },
    fields: t.fields.map((f) => ({ field: f.field, label: labels[f.field] ?? f.field, aiValue: f.aiValue, accepted: f.accepted === true, reason: f.reason })),
  };
}

// „Poctivo“ z eval/README.md (doslova, bez markdownu)
const readme = readFileSync(join(APP, 'eval/README.md'), 'utf8');
const caveats = (readme.split(/^## Poctivo\s*$/m)[1] ?? '').split(/\n(?=## )/)[0]
  .split('\n').filter((l) => l.startsWith('- ')).map((l) => l.slice(2).replace(/\*\*|`/g, '').trim());

const EVAL_SUMMARY = deep({ cases, total, hallucinationTest, caveats, sources });

// ------------------------------------------------------------------ zápis
const json = (v) => JSON.stringify(v, null, 1);
writeFileSync(join(APP, 'src/data/pacient2.gen.ts'), `// GENEROVANÉ: node scripts/build-pacient2.mjs – NEUPRAVOVAŤ RUČNE. FIKTÍVNY PACIENT (testovacie dáta).
// Zdroj: ${EXTRACTED} (${ex.meta.generatedAt}, ${ex.meta.mode}) + ${SOURCE}.
// ID správ majú prefix N-. Názov nemocnice v Benešove je nahradený fiktívnym (Nemocnice Podhájí).
import type { Case } from '../types';

export type FieldOrigin = 'manual' | 'rules' | 'ai';
export interface CaseAi {
  label: 'ručně ověřeno' | 'AI výstup (předpočítaný)';
  mode: 'manual' | 'rules' | 'rules+llm';
  model?: string | null;
  generatedAt?: string;
  /** Meranie presnosti pre tento prípad, relatívne k BASE_URL (napr. 'data/eval-pacient-2.json'). */
  evalFile?: string;
  /** Kto navrhol hodnotu poľa: pravidlá, jazykový model (AI) alebo tím ručne. */
  fieldOrigin?: Record<string, FieldOrigin>;
}

export const NOVAK_AI: CaseAi = ${json(NOVAK_AI)};

export const NOVAK: Case = ${json(NOVAK)};
`);

writeFileSync(join(APP, 'src/data/eval.gen.ts'), `// GENEROVANÉ: node scripts/build-pacient2.mjs – NEUPRAVOVAŤ RUČNE.
// Namerané čísla z ${EVALS.map((e) => e.file).join(', ')}${HALU ? ` a ${HALU}` : ''}. Žiadne čísla napevno.

export interface EvalTrap { id: string; title: string; caught: boolean }
export interface EvalCaseResult {
  /** ID prípadu v appke ('alena', 'novak'). */
  caseId: string;
  /** ID v meraní ('alena', 'pacient-2'). */
  evalCaseId: string;
  patient: string;
  topic: string;
  /** Súbor s meraním, relatívne k BASE_URL. */
  file: string;
  measuredAt: string;
  extraction: { mode: string; model: string | null; generatedAt: string; promptVersion: string | null };
  /** 'manual' = appka ukazuje ručne overenú verziu, meria sa strojové vyťaženie tých istých správ.
   *  'this-extraction' = appka ukazuje presne toto vyťaženie. */
  appShows: 'manual' | 'this-extraction';
  /** Meranie patrí k aktuálnemu súboru vyťaženia (extracted-*.json). */
  inSync: boolean;
  fieldsCorrect: number; fieldsTotal: number;
  trapsCaught: number; trapsTotal: number;
  inventedValues: number; fieldsWithoutVerifiedCitation: number;
  citationsVerified: number; citationsTotal: number;
  /** Zlatá sada je celistvá (každý jej dôkaz je doslova v správe). Ak false, čísla nezobrazovať. */
  goldIntegrity: boolean;
  /** Veta z merania doslova. */
  headline: string;
  traps: EvalTrap[];
}
export interface EvalSummary {
  cases: EvalCaseResult[];
  total: {
    cases: number; fieldsCorrect: number; fieldsTotal: number; trapsCaught: number; trapsTotal: number;
    inventedValues: number; fieldsWithoutVerifiedCitation: number; citationsVerified: number; citationsTotal: number;
    allGoldIntact: boolean; allInSync: boolean;
  };
  /** Test poistky: úmyselne chybná AI odpoveď (Alena). Čísla „after“ sú z behu testu, nie z aktuálneho merania. */
  hallucinationTest: null | {
    file: string; what: string; generatedAt: string;
    aiProposals: number; accepted: number; rejected: number;
    after: { fieldsCorrect: number; fieldsTotal: number; inventedValues: number };
    fields: { field: string; label: string; aiValue: string; accepted: boolean; reason: string }[];
  };
  /** „Poctivo“ z eval/README.md – povedať pri otázke na metodiku. */
  caveats: string[];
  /** Súbor → generatedAt; npm run verify podľa toho stráži, že čísla sedia so súbormi. */
  sources: Record<string, string>;
}

export const EVAL_SUMMARY: EvalSummary = ${json(EVAL_SUMMARY)};
`);

console.log(`pacient2.gen.ts: Josef Novák · ${fields.length} polí (${conflicts} rozpory) · ${docs.length} správ · ${steps.length} krokov · ${NOVAK.labs.length} lab · ${NOVAK.meds.length} lieky`);
console.log(`eval.gen.ts: ${cases.map((c) => `${c.caseId} ${c.fieldsCorrect}/${c.fieldsTotal} polí, ${c.trapsCaught}/${c.trapsTotal} pascí, ${c.inventedValues} vymyslených, ${c.citationsVerified}/${c.citationsTotal} citátov${c.inSync ? '' : ' (NESEDÍ s extracted!)'}`).join(' · ')}`);
if (hallucinationTest) console.log(`test poistky: ${hallucinationTest.rejected}/${hallucinationTest.aiProposals} AI návrhov zamietnutých (${HALU})`);
