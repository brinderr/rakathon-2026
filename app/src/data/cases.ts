// Demo data for the KOC coordinator app. EVERYTHING IS FICTIONAL (VZP assignment, Rakathon 2026).
// UI language: Czech. Quotes (Citation.quote) are verbatim excerpts of the report texts and are never translated.
//
// Pravidla:
// - Každý citát (Citation.quote) je DOSLOVNÝ úryvek z textu zprávy. Texty zpráv 01–13 jsou
//   v public/data/source.json, zápis z MDT je tam jako šablona „MDT zaver“ (docId 'MDT'). Hlídá to `npm run verify`.
// - Chybějící je označeno (status 'missing'), nic se nedomýšlí. Rozpor = obě verze vedle sebe.
// - ECOG se v demu nedoplňuje žádnou vymyšlenou zprávou: koordinátorka zapíše telefonát (CALL_NOTES níže je jen
//   předvyplněný návrh jejího textu, jasně označený jako její vstup, nikdy jako lékařská zpráva).
// - PathStep.state = stav k DEMO_TODAY (19. 10. 2026). PathStep.history, Case.log, Case.exams
//   a Case.docs obsahují celý příběh až do 27. 10. – UI je filtruje podle data „stav k“
//   (pomůcky stepStateAsOf, fieldsAsOf, docsAsOf níže).
// - Case.fields = podklad k 21. 10. 2026 (den MDT). Pozdější hodnoty (váha 63 kg ze zprávy 12)
//   jsou v LATER_VALUES a fieldsAsOf je použije až od data jejich doručení.
// - Žádné skóre naléhavosti ani doporučení léčby. Fronta se řadí jen podle termínů.
// - Druhý plný případ Josef Novák (plíce) je Maťovo strojové vytěžení: src/data/pacient2.gen.ts.
//   Naměřená čísla přesnosti: src/data/eval.gen.ts (EVAL_SUMMARY). Obojí generuje
//   `node scripts/build-pacient2.mjs` z public/data/extracted-*.json a eval-*.json – ručně neupravovat.

import type {
  Case,
  Citation,
  Exam,
  HandoverField,
  ISODate,
  LabRow,
  LogEntry,
  Medication,
  PathStep,
  SourceDoc,
  StepState,
} from '../types';
import { NOVAK, NOVAK_AI } from './pacient2.gen.ts';
import type { CaseAi, FieldOrigin } from './pacient2.gen.ts';

export { EVAL_SUMMARY } from './eval.gen.ts';
export type { EvalCaseResult, EvalSummary, EvalTrap } from './eval.gen.ts';
export type { CaseAi, FieldOrigin };

const cite = (docId: string, quote: string): Citation => ({ docId, quote });

// ---------------------------------------------------------------------------------------------
// „Zapsat telefonát“ – předvyplněný návrh poznámky koordinátorky k chybějícímu poli.
// NENÍ to zpráva ani citát: je to její vlastní zápis, v demu ho zapíše prezentující (může cokoli změnit).
// Hodnota do pole se bere z toho, co koordinátorka zadá; zdroj = „telefonát · zapsala koordinátorka · datum“.
// Jméno lékařky je ze zadání (členka MDT „MUDr. Lenka Marková – klinická onkologie“, šablona „MDT zaver“).
// Hodnota (např. ECOG) se NEPŘEDVYPLŇUJE – určuje ji lékař, zapíše ji člověk podle skutečného hovoru;
// okno „Zapsat telefonát“ bez hodnoty neuloží (kritici 05, 12).
// ---------------------------------------------------------------------------------------------
export interface CallNoteDraft {
  date: ISODate;    // datum telefonátu (koordinátorka může změnit)
  with: string;     // s kým
  note: string;     // text poznámky = citát v poli (vstup koordinátorky, neověřuje se proti zprávám)
  value: string;    // co se zapíše do pole – v návrhu prázdné, dopíše člověk
}
export const CALL_NOTES: Record<string, Record<string, CallNoteDraft>> = {
  alena: {
    performance: {
      date: '2026-10-19',
      with: 'MUDr. Lenka Marková (onkologická ambulance KOC)',
      note: 'Telefonát 19. 10. 2026 s MUDr. Lenkou Markovou:',
      value: '',
    },
  },
};

// ---------------------------------------------------------------------------------------------
// ALENA PROCHÁZKOVÁ – plný případ (demo 'full')
// ---------------------------------------------------------------------------------------------

const ALENA_DOCS: SourceDoc[] = [
  { id: '01', title: 'Kardiologie – kontrola', place: 'Kardiologická ambulance Jesenice', kind: 'report', examDate: '2026-07-20', receivedAt: '2026-10-06', channel: 'e-mail' },
  { id: '02', title: 'Laboratoř – krev a moč', place: 'Laboratoř LabJih', kind: 'result', examDate: '2026-09-01', receivedAt: '2026-10-03', channel: 'eZpráva' },
  { id: '03', title: 'RTG plic', place: 'Radiologické centrum Modřany', kind: 'result', examDate: '2026-09-03', receivedAt: '2026-10-06', channel: 'papier' },
  { id: '04', title: 'Praktický lékař – epikríza', place: 'Ordinace praktického lékaře, Dolní Břežany', kind: 'report', examDate: '2026-09-04', receivedAt: '2026-10-05', channel: 'e-mail' },
  { id: '05', title: 'Gastroenterologie – vstupní vyšetření', place: 'Poliklinika Jižní – gastroenterologie', kind: 'report', examDate: '2026-09-15', receivedAt: '2026-10-05', channel: 'eZpráva' },
  { id: '06', title: 'Ultrazvuk břicha', place: 'Poliklinika Jižní – radiologie', kind: 'result', examDate: '2026-09-29', receivedAt: '2026-10-05', channel: 'eZpráva' },
  { id: '07', title: 'Žádost praktického lékaře o převzetí do KOC', place: 'Ordinace praktického lékaře, Dolní Břežany', kind: 'request', examDate: '2026-10-02', receivedAt: '2026-10-02', channel: 'eZpráva' },
  { id: '08', title: 'CT břicha a hrudníku', place: 'KOC 1 · Nemocnice Severní – radiologie', kind: 'result', examDate: '2026-10-08', receivedAt: '2026-10-08', channel: 'ePACS' },
  { id: '09', title: 'Biopsie EUS-FNB – protokol', place: 'KOC 2 · Nemocnice Lipová – endoskopie', kind: 'report', examDate: '2026-10-12', receivedAt: '2026-10-12', channel: 'NIS' },
  { id: '10', title: 'Laboratoř – kontrolní odběry', place: 'KOC 2 · Nemocnice Lipová – laboratoř', kind: 'result', examDate: '2026-10-15', receivedAt: '2026-10-15', channel: 'NIS' },
  { id: '11', title: 'Histologie – výsledek biopsie', place: 'KOC 2 · Nemocnice Lipová – patologie', kind: 'result', examDate: '2026-10-19', receivedAt: '2026-10-19', channel: 'NIS' },
  { id: '12', title: 'Algeziologie – léčba bolesti', place: 'KOC 1 · Nemocnice Severní – centrum léčby bolesti', kind: 'report', examDate: '2026-10-26', receivedAt: '2026-10-26', channel: 'eZpráva' },
  { id: '13', title: 'Klinický psycholog', place: 'KOC 2 · Nemocnice Lipová – psychoonkologie', kind: 'report', examDate: '2026-10-27', receivedAt: '2026-10-27', channel: 'NIS' },
  // Zápis z jednání MDT (vzor „MDT zaver“ ze zadání) – zdroj pro závěr praktickému lékaři.
  { id: 'MDT', title: 'Zápis z jednání MDT', place: 'KOC 2 · Nemocnice Lipová – MDT pro nádory GIT', kind: 'report', examDate: '2026-10-21', receivedAt: '2026-10-21', channel: 'NIS' },
];

// Popisy 20 polí podle šablony VZP „Handover_obsah“ (česky, pro laika).
const ALENA_FIELDS: HandoverField[] = [
  // --- Pacient (nacionále) ---
  {
    key: 'firstName', label: 'Jméno', group: 'Pacient', value: 'Alena', status: 'confirmed',
    citations: [cite('07', 'Pacientka: Alena Procházková')], sourceDate: '2026-10-02',
  },
  {
    key: 'lastName', label: 'Příjmení', group: 'Pacient', value: 'Procházková', status: 'confirmed',
    citations: [cite('07', 'Pacientka: Alena Procházková')], sourceDate: '2026-10-02',
  },
  {
    key: 'age', label: 'Věk', group: 'Pacient', value: '63 let', status: 'confirmed',
    citations: [cite('07', 'Datum narození: 22. 7. 1963 (63 let)')], sourceDate: '2026-10-02',
    note: 'Narozena 22. 7. 1963.',
  },
  {
    key: 'sex', label: 'Pohlaví', group: 'Pacient', value: 'žena', status: 'proposed',
    citations: [cite('07', '63letá pacientka sledovaná v naší ordinaci.'), cite('07', 'Rodné číslo: 635722/1013')],
    sourceDate: '2026-10-02',
    note: 'Ve zprávách není uvedeno jako samostatný údaj. Odvozeno ze slova „pacientka“ a z rodného čísla (měsíc +50 = žena). Prosím potvrďte.',
  },
  {
    key: 'insurer', label: 'Zdravotní pojišťovna', group: 'Pacient',
    value: '211 · Zdravotní pojišťovna ministerstva vnitra ČR', status: 'confirmed',
    citations: [cite('07', 'Zdravotní pojišťovna: 211')], sourceDate: '2026-10-02',
    note: 'Pozor: není to VZP, ale ZP MV ČR (211). Pokud má souhrn dostat i revizní lékař, šel by pojišťovně 211.',
  },
  // --- Kontakty ---
  {
    key: 'patientContact', label: 'Kontakt na pacienta', group: 'Kontakty', value: '+420 777 000 541', status: 'confirmed',
    citations: [cite('07', 'Telefon: +420 777 000 541')], sourceDate: '2026-10-02',
    note: 'E-mail pacientky v žádné zprávě není.',
  },
  {
    key: 'contactPerson', label: 'Kontaktní osoba a telefon', group: 'Kontakty',
    value: 'Petra Horká (dcera), +420 777 000 542', status: 'confirmed',
    citations: [
      cite('07', 'Kontaktní osoba: Petra Horká (dcera), tel. +420 777 000 542'),
      cite('07', 'Souhlasí se sdílením informací s dcerou.'),
    ],
    sourceDate: '2026-10-02',
    note: 'Pacientka souhlasí se sdílením informací s dcerou.',
  },
  // --- Diagnóza ---
  {
    key: 'diagnosis', label: 'Diagnóza', group: 'Diagnóza',
    value: 'C25.0 – nádor hlavy pankreatu; histologie: duktální adenokarcinom (G2–G3)', status: 'proposed',
    citations: [
      cite('07', 'Suspektní diagnóza: C25.0 – suspektní tumor hlavy pankreatu, cholestatický syndrom'),
      cite('08', 'Tumor hlavy pankreatu 35 mm s venózním postižením VMS se zúžením lumen a s kontaktem s AMS.'),
      cite('11', 'Duktální adenokarcinom pankreatu, středně až málo diferencovaný (G2–G3), s perineurální invazí.'),
    ],
    sourceDate: '2026-10-19',
    note: 'Kód C25.0 uvedl praktický lékař jako podezření. Histologie nádor potvrzuje. Konečnou diagnózu potvrdí MDT.',
  },
  {
    key: 'epicrisis', label: 'Epikríza (stručný souhrn nemoci)', group: 'Diagnóza',
    value: 'Od poloviny srpna 2026 bolesti břicha, na přelomu srpna a září teploty a tmavší moč. Ultrazvuk 29. 9. ukázal ložisko v hlavě pankreatu podezřelé z nádoru. Termín CT praktický lékař nezajistil.',
    status: 'proposed',
    citations: [
      cite('07', 'Od poloviny srpna 2026 bolesti břicha v epigastriu a pravém podžebří'),
      cite('07', 'na přelomu srpna a září intermitentní teploty se zimnicí a tmavší moč'),
      cite('07', 'UZ provedené 29. 9. 2026 prokázalo ložisko hlavy pankreatu suspektní z malignity.'),
      cite('07', 'Termín CT se nám v dostupných pracovištích nepodařilo zajistit.'),
    ],
    sourceDate: '2026-10-02',
    note: 'Zkráceno z epikrízy praktického lékaře (zpráva 07). Prosím zkontrolujte se zdrojem.',
  },
  {
    key: 'mdtQuestion', label: 'Požadavek / otázka na MDT', group: 'Diagnóza',
    value: 'Dokončit diagnostiku (CT břicha, histologie) a stanovit další postup. Praktický lékař žádá urgentní řešení.',
    status: 'confirmed',
    citations: [
      cite('07', 'Žádám o převzetí pacientky do péče KOC k dokončení diagnostiky (CT břicha, histologická verifikace) a stanovení dalšího postupu v rámci MDT.'),
      cite('07', 'Vzhledem k progresi obtíží a nezajištěnému termínu CT prosím o urgentní řešení.'),
    ],
    sourceDate: '2026-10-02',
  },
  // --- Anamnéza ---
  {
    key: 'comorbidities', label: 'Komorbidity (přidružené nemoci)', group: 'Anamnéza',
    value: 'Paroxysmální fibrilace síní (od 2021, na antikoagulaci), vysoký krevní tlak, vysoký cholesterol, po odstranění dělohy (2010).',
    status: 'confirmed',
    citations: [
      cite('07', 'paroxysmální fibrilace síní od r. 2021 na antikoagulaci'),
      cite('07', 'arteriální hypertenze, hypercholesterolémie, st. p. hysterektomii pro myomy (2010)'),
      cite('01', 'Stabilní stav, sinusový rytmus, bez recidivy fibrilace síní.'),
      cite('07', 'v r. 2019 po úmrtí manžela přechodně depresivní ladění, neléčena'),
    ],
    sourceDate: '2026-10-02',
    note: 'Kardiolog 20. 7. 2026: stabilní stav, bez návratu fibrilace. V roce 2019 přechodně depresivní ladění, neléčeno.',
  },
  {
    key: 'medication', label: 'Léková anamnéza (užívané léky)', group: 'Anamnéza',
    value: 'apixaban 5 mg 1-0-1, bisoprolol 5 mg 1-0-0, perindopril 4 mg 1-0-0, rosuvastatin 10 mg 0-0-1, paracetamol 500 mg při bolesti (max. 4× denně)',
    status: 'conflict',
    citations: [
      cite('07', 'FA: apixaban 5 mg 1-0-1, bisoprolol 5 mg 1-0-0, perindopril 4 mg 1-0-0, rosuvastatin 10 mg 0-0-1, paracetamol 500 mg při bolesti max. 4× denně'),
      cite('01', 'vysadit apixaban 48 hodin předem, bez nutnosti překlenovací léčby'),
      cite('09', 'Při nekomplikovaném průběhu apixaban znovu od 21. 10. 2026 ráno.'),
    ],
    sourceDate: '2026-10-12',
    note: 'Pokyn kardiologa: před výkonem s vysokým rizikem krvácení vysadit apixaban 48 hodin předem. Protokol biopsie: znovu nasadit od 21. 10. ráno.',
    conflict: {
      a: { value: 'Biopsie byla 12. 10. 2026', citation: cite('09', 'Datum výkonu: 12. 10. 2026') },
      b: { value: 'Poslední dávka apixabanu 18. 10. 2026 večer', citation: cite('09', 'Apixaban vysazen 48 h před výkonem (poslední dávka 18. 10. 2026 večer).') },
      explain: 'Tentýž protokol uvádí výkon 12. 10. a poslední dávku apixabanu až 18. 10., tedy 6 dní po výkonu. Jedno z dat je chybné. Kdy pacientka lék skutečně vysadila, je třeba ověřit – rozhodne lékař.',
    },
  },
  {
    key: 'allergies', label: 'Alergie', group: 'Anamnéza', value: 'Alergie neguje', status: 'confirmed',
    citations: [cite('07', 'AA: neguje\nAbusus: nekuřačka, alkohol abstinentka')], sourceDate: '2026-10-02',
    note: 'Nekuřačka, alkohol nepije.',
  },
  // --- Stav ---
  {
    key: 'performance', label: 'Stav výkonnosti (ECOG)', group: 'Stav', value: '', status: 'missing',
    citations: [],
    note: 'V žádné zprávě není ECOG ani Karnofského skóre. Slovo „soběstačná“ v žádosti praktického lékaře není skóre, proto je nedomýšlíme.',
    request: {
      to: 'MUDr. Lenka Marková, onkologická ambulance KOC 2',
      channel: 'NIS',
      draft: 'Dobrý den, paní doktorko,\npřipravuji podklad pro MDT 21. 10. 2026 pro pacientku Alenu Procházkovou (nar. 22. 7. 1963). V dostupných zprávách chybí stav výkonnosti (ECOG nebo Karnofského skóre). Mohla byste ho prosím doplnit do 20. 10.?\nDěkuji,\nBc. Lucie Dvořáková, koordinátorka KOC 2',
    },
  },
  {
    key: 'weightHeight', label: 'Váha a výška', group: 'Stav',
    value: '65 kg (15. 9. 2026) · 165 cm (20. 7. 2026)', status: 'confirmed',
    citations: [
      cite('05', 'Hmotnost 65 kg.'),
      cite('05', 'úbytek hmotnosti 4 kg za poslední měsíc (z 69 na 65 kg)'),
      cite('01', 'Výška 165 cm, hmotnost 69 kg.'),
    ],
    sourceDate: '2026-09-15',
    note: 'Úbytek 4 kg za měsíc (z 69 na 65 kg). Váha je z 15. 9., novější měření zatím není.',
  },
  {
    key: 'symptoms', label: 'Příznaky nemoci a jejich počátek', group: 'Stav',
    value: 'Od poloviny srpna bolesti v nadbřišku a pod pravým žebrem; nyní bolest vystřeluje do zad, horší po jídle a v noci. Nechutenství, hubnutí, tmavší moč, 1. 9. nažloutlé bělmo očí. Teploty od září neměla.',
    status: 'confirmed',
    citations: [
      cite('07', 'Od poloviny srpna 2026 bolesti břicha v epigastriu a pravém podžebří'),
      cite('07', 'bolesti v epigastriu s propagací do zad přetrvávají, zhoršují se po jídle a v noci'),
      cite('07', 'Nechutenství, pokračující úbytek hmotnosti, moč nadále tmavší.'),
      cite('07', 'Při vyšetření 1. 9. 2026 febrilní (38,1 °C), se subikterem sklér.'),
      cite('07', 'Teploty od září neměla.'),
    ],
    sourceDate: '2026-10-02',
    note: 'Na paracetamolu jen částečná úleva. Soběstačná, nyní v pracovní neschopnosti.',
  },
  // --- Vyšetření ---
  {
    key: 'exams', label: 'Provedená vyšetření', group: 'Vyšetrenia',
    value: 'Kardiologie 20. 7. · RTG plic 3. 9. · gastroenterolog 15. 9. · ultrazvuk břicha 29. 9. · CT břicha a hrudníku 8. 10. (KOC 1) · biopsie EUS-FNB 12. 10. (KOC 2)',
    status: 'confirmed',
    citations: [
      cite('03', 'Bez známek zánětlivých změn plic.'),
      cite('06', 'Ložisková léze hlavy pankreatu suspektní z malignity s mírnou dilatací žlučových cest.'),
      cite('08', 'Tumor hlavy pankreatu 35 mm s venózním postižením VMS se zúžením lumen a s kontaktem s AMS.'),
      cite('08', 'Bez známek vzdálených metastáz.'),
      cite('09', 'Výkon: endosonografie s biopsií ložiska hlavy pankreatu (EUS-FNB)'),
    ],
    sourceDate: '2026-10-12',
    note: 'Datum, místo a typ každého vyšetření jsou v části Vyšetření, plné znění po kliknutí v originálu zprávy. Velikost ložiska se liší podle metody (UZ 34 × 30 mm, CT 35 × 31 mm, EUS 33 × 29 mm).',
  },
  // --- Laboratoř ---
  {
    key: 'labs', label: 'Laboratorní výsledky včetně onkomarkerů', group: 'Laboratórium',
    value: '15. 10.: CA 19-9 312 kU/l (norma do 37), CA 125 48 kU/l (do 35), CEA 4,1 µg/l v normě. Bilirubin 23 µmol/l, hemoglobin 118 g/l.',
    status: 'confirmed',
    citations: [
      cite('10', 'CA 19-9\n312 H\nkU/l\n< 37'),
      cite('10', 'CA 125\n48 H\nkU/l\n< 35'),
      cite('10', 'CEA\n4,1\nµg/l\n< 5,0'),
      cite('10', 'Bilirubin celkový\n23 H\nµmol/l'),
      cite('10', 'Hemoglobin\n118 L\ng/l'),
    ],
    sourceDate: '2026-10-15',
    note: 'Dva odběry: 1. 9. (LabJih, přes praktického lékaře) a 15. 10. (KOC 2). Nádorové markery jen 15. 10. Celá tabulka je v části Laboratoř.',
  },
  // --- Histologie ---
  {
    key: 'histology', label: 'Histologie', group: 'Histológia',
    value: 'Duktální adenokarcinom pankreatu, G2–G3, s perineurální invazí', status: 'conflict',
    citations: [
      cite('11', 'Duktální adenokarcinom pankreatu, středně až málo diferencovaný (G2–G3), s perineurální invazí.'),
      cite('11', 'CK7 pozitivní, CK19 pozitivní, CK20 negativní, CDX2 negativní, SMAD4 exprese zachována.'),
      cite('09', 'Výsledek histologie do 3 pracovních dnů.'),
    ],
    sourceDate: '2026-10-19',
    note: 'Výsledek byl slíben do 3 pracovních dnů (do 15. 10.), přišel 19. 10.',
    conflict: {
      a: { value: 'Odběr vzorku 20. 10. 2026', citation: cite('11', 'EUS-FNB 22G (odběr 20. 10. 2026)') },
      b: { value: 'Zpráva vydána 19. 10. 2026', citation: cite('11', 'Datum vydání: 19. 10. 2026') },
      explain: 'Zpráva je vydána den před uvedeným odběrem. Biopsie podle protokolu proběhla 12. 10. Jedno z dat je chybné – ověřte s patologií, že výsledek patří k tomuto vzorku.',
    },
  },
  // --- Jiné ---
  {
    key: 'other', label: 'Jiná důležitá sdělení a přání pacienta', group: 'Iné',
    value: 'Pacientka ví o podezření na nádor a souhlasí se sdílením informací s dcerou. Je velmi úzkostná a špatně spí – praktický lékař prosí o psychologickou podporu. Žije sama, dcera bydlí v téže obci.',
    status: 'confirmed',
    citations: [
      cite('07', 'Pacientka je o podezření na nádorové onemocnění informována.'),
      cite('07', 'Souhlasí se sdílením informací s dcerou.'),
      cite('07', 'Psychicky pacientka velmi úzkostná, špatně spí.'),
      cite('07', 'Vzhledem k výrazné úzkosti pacientky prosím o zvážení psychologické podpory.'),
      cite('07', 'SA: vdova, žije sama, dcera bydlí v téže obci'),
      cite('07', 'Upozorňuji na antikoagulační léčbu apixabanem – před invazivními výkony nutné vysazení dle doporučení kardiologa.'),
    ],
    sourceDate: '2026-10-02',
    note: 'Praktický lékař upozorňuje na léčbu apixabanem před výkony.',
  },
];

/** Hodnoty, které přišly až později (po MDT). fieldsAsOf je použije od data `from`. */
export interface LaterValue {
  key: string;
  from: ISODate;            // receivedAt zprávy, která hodnotu přinesla
  value: string;
  citations: Citation[];
  sourceDate: ISODate;
  note?: string;
}
export const LATER_VALUES: Record<string, LaterValue[]> = {
  alena: [
    {
      key: 'weightHeight', from: '2026-10-26',
      value: '63 kg (26. 10. 2026) · 165 cm (20. 7. 2026)',
      citations: [cite('12', 'Hmotnost 63 kg.'), cite('01', 'Výška 165 cm, hmotnost 69 kg.')],
      sourceDate: '2026-10-26',
      note: 'Váha 63 kg je ze zprávy algeziologa z 26. 10. – po MDT. K 21. 10. platilo 65 kg (15. 9.).',
    },
    {
      // Algeziolog 26. 10. nasadil novou léčbu bolesti (zpráva 12) – pole Léky od toho dne ukazuje novou verzi.
      key: 'medication', from: '2026-10-26',
      value: 'apixaban 5 mg 1-0-1, bisoprolol 5 mg 1-0-0, perindopril 4 mg 1-0-0, rosuvastatin 10 mg 0-0-1 (zpráva 07) · od 26. 10. léčba bolesti (zpráva 12): tramadol 100 mg 1-0-1, metamizol 500 mg 1-1-1, paracetamol 500 mg při průlomové bolesti nejvýše 3× denně, metoklopramid 10 mg při nevolnosti, laktulóza 15 ml 1× denně',
      citations: [
        cite('07', 'FA: apixaban 5 mg 1-0-1, bisoprolol 5 mg 1-0-0, perindopril 4 mg 1-0-0, rosuvastatin 10 mg 0-0-1, paracetamol 500 mg při bolesti max. 4× denně'),
        cite('12', 'tramadol tbl. ret. 100 mg 1-0-1'),
        cite('12', 'metamizol 500 mg 1-1-1'),
        cite('12', 'paracetamol 500 mg při průlomové bolesti, max. 3× denně'),
        cite('12', 'metoklopramid 10 mg při nauzee, max. 3× denně'),
        cite('12', 'laktulóza sirup 15 ml 1× denně jako prevence obstipace'),
        cite('12', 'Upozornění: tramadol zvyšuje riziko serotoninového syndromu v kombinaci s antidepresivy (SSRI, SNRI).'),
        cite('01', 'vysadit apixaban 48 hodin předem, bez nutnosti překlenovací léčby'),
        cite('09', 'Při nekomplikovaném průběhu apixaban znovu od 21. 10. 2026 ráno.'),
      ],
      sourceDate: '2026-10-26',
      note: 'Změna 26. 10. (algeziolog, zpráva 12): nová léčba bolesti, paracetamol už nejvýše 3× denně (dříve 4×). Algeziolog upozorňuje: tramadol spolu s antidepresivy (SSRI, SNRI) zvyšuje riziko serotoninového syndromu.',
    },
    {
      key: 'other', from: '2026-10-27',
      value: 'Pacientka si přeje, aby informace o léčbě dostávala i dcera a aby se mohla účastnit důležitých rozhovorů. Výrazná úzkost a depresivní nálada – psycholog doporučuje pokračovat v podpůrné psychoterapii 1× týdně.',
      citations: [
        cite('13', 'Pacientka si přeje, aby informace o léčbě byly sdělovány i dceři a aby se dcera mohla účastnit důležitých rozhovorů.'),
        cite('07', 'Souhlasí se sdílením informací s dcerou.'),
        cite('13', 'Nálada depresivní, výrazná anxieta, afekt labilní.'),
        cite('13', 'Pokračování podpůrné psychoterapie 1× týdně v psychoonkologické ambulanci.'),
      ],
      sourceDate: '2026-10-27',
    },
  ],
  novak: [
    {
      key: 'weightHeight', from: '2026-10-27',
      value: '73 kg (27. 10. 2026) · výška 176 cm',
      citations: [cite('N-10', 'Výška 176 cm, hmotnost 73 kg, BMI 23,6.')],
      sourceDate: '2026-10-27',
      note: 'Váha 73 kg je ze zprávy nutriční ambulance z 27. 10. – po MDT. K 22. 10. platilo 76 kg (7. 10.).',
    },
  ],
};

/**
 * Upozornění, která nesmí zapadnout v řádcích podkladu: pás v hlavičce případu (QA R5 #1, #9).
 * Jen fakta ze zpráv, každé s doslovným citátem, žádné doporučení léčby. `from` = doručení zprávy, která ho přináší.
 * `label` = kdo upozorňuje a odkud („Upozornění lékaře (zpráva 07)“) – nic vlastními slovy, obsah je citát (kritici 09).
 * kind 'forward' = varování lékařů, které je třeba poslat dál (karta na Přehledu + koncept zprávy, odeslání v prototypu).
 */
export interface CaseAlert {
  id: string;
  from: ISODate;
  kind: 'safety' | 'forward';
  label: string;
  citations: Citation[];
  /** kind 'forward': to whom the warning goes, once the report naming the recipient (`needsDocId`) has arrived. */
  forward?: { button: string; to: string; channel: SourceDoc['channel']; needsDocId?: string; beforeNote?: string };
}
export const ALERTS: Record<string, CaseAlert[]> = {
  alena: [
    {
      id: 'apixaban', from: '2026-10-02', kind: 'safety', label: 'Upozornění lékaře (zpráva 07)',
      citations: [cite('07', 'Upozorňuji na antikoagulační léčbu apixabanem – před invazivními výkony nutné vysazení dle doporučení kardiologa.')],
    },
    {
      id: 'tramadol', from: '2026-10-26', kind: 'forward', label: 'Upozornění algeziologa (zpráva 12)',
      citations: [
        cite('12', 'Upozornění: tramadol zvyšuje riziko serotoninového syndromu v kombinaci s antidepresivy (SSRI, SNRI).'),
        cite('13', 'Pacientka užívá tramadol – při volbě antidepresiva zohlednit riziko serotoninového syndromu.'),
        cite('13', 'Psychiatrické vyšetření k zvážení farmakoterapie – objednána na 3. 11. 2026'),
      ],
      forward: {
        button: 'Připravit zprávu pro psychiatrii a praktického lékaře',
        to: 'Psychiatrická ambulance KOC 2 · Nemocnice Lipová · kopie: MUDr. Tomáš Řezníček (praktický lékař)',
        channel: 'NIS', needsDocId: '13',
        beforeNote: 'Zpráva 12 šla podle textu v kopii i praktickému lékaři.',
      },
    },
  ],
  novak: [
    {
      id: 'contrast', from: '2026-10-07', kind: 'safety', label: 'Alergie na jodovou kontrastní látku (jiná zpráva uvádí „neguje“)',
      citations: [
        cite('N-05', 'Doporučeno zapsat do dokumentace alergii na jodovou kontrastní látku'),
        cite('N-08', 'Poznámka: CT část bez jodové kontrastní látky (alergie na jodovou kontrastní látku v anamnéze)'),
      ],
    },
    {
      id: 'rc', from: '2026-10-07', kind: 'safety', label: 'Laboratoř N-04 má jiné rodné číslo – nepoužívat, dokud se neověří',
      citations: [cite('N-04', 'RČ 660314/1234'), cite('N-09', 'Rodné číslo: 660314/1243')],
    },
  ],
};

const h = (state: StepState, date: ISODate) => ({ state, date });

const ALENA_STEPS: PathStep[] = [
  {
    id: 'ct', title: 'CT břicha a hrudníku (pankreatický protokol)', place: 'KOC 1 · Nemocnice Severní',
    owner: 'radiologie KOC 1', due: '2026-10-08', state: 'delivered',
    history: [h('requested', '2026-10-02'), h('ordered', '2026-10-05'), h('done', '2026-10-08'), h('delivered', '2026-10-08')],
    resultDocId: '08',
  },
  {
    id: 'biopsy', title: 'Biopsie pod endosonografií (EUS-FNB)', place: 'KOC 2 · Nemocnice Lipová – endoskopie',
    owner: 'endoskopie KOC 2', due: '2026-10-12', state: 'delivered',
    history: [h('requested', '2026-10-08'), h('ordered', '2026-10-08'), h('done', '2026-10-12'), h('delivered', '2026-10-12')],
    resultDocId: '09',
  },
  {
    id: 'labs', title: 'Kontrolní odběry a nádorové markery', place: 'KOC 2 · Nemocnice Lipová – laboratoř',
    owner: 'laboratoř KOC 2', due: '2026-10-15', state: 'delivered',
    history: [h('requested', '2026-10-12'), h('ordered', '2026-10-12'), h('done', '2026-10-15'), h('delivered', '2026-10-15')],
    resultDocId: '10',
  },
  {
    // Slíbeno „do 3 pracovních dnů“ od 12. 10. (pondělí) = 15. 10.; doručeno 19. 10. → 4 dny po termínu.
    id: 'histology', title: 'Histologie (výsledek biopsie)', place: 'KOC 2 · Nemocnice Lipová – patologie',
    owner: 'patologie KOC 2', due: '2026-10-15', state: 'delivered',
    history: [h('requested', '2026-10-12'), h('ordered', '2026-10-12'), h('done', '2026-10-19'), h('delivered', '2026-10-19')],
    resultDocId: '11',
  },
  {
    id: 'mdt', title: 'MDT (multidisciplinární tým) pro nádory GIT', place: 'KOC 2 · Nemocnice Lipová',
    owner: 'já (koordinátorka) – podklad', due: '2026-10-21', state: 'ordered',
    history: [h('requested', '2026-10-08'), h('ordered', '2026-10-09'), h('done', '2026-10-21'), h('delivered', '2026-10-21')],
    resultDocId: 'MDT',
  },
  {
    id: 'pain', title: 'Algeziolog (léčba bolesti)', place: 'KOC 1 · Nemocnice Severní – centrum léčby bolesti',
    owner: 'centrum léčby bolesti KOC 1', due: '2026-10-26', state: 'ordered',
    history: [h('requested', '2026-10-08'), h('ordered', '2026-10-13'), h('done', '2026-10-26'), h('delivered', '2026-10-26')],
    resultDocId: '12',
  },
  {
    id: 'psych', title: 'Klinický psycholog', place: 'KOC 2 · Nemocnice Lipová – psychoonkologie',
    owner: 'psychoonkologie KOC 2', due: '2026-10-27', state: 'ordered',
    history: [h('requested', '2026-10-02'), h('ordered', '2026-10-14'), h('done', '2026-10-27'), h('delivered', '2026-10-27')],
    resultDocId: '13',
  },
];

const LAB_JIH = 'LabJih (odběr přes praktického lékaře)';
const LAB_KOC = 'Laboratoř KOC 2 · Nemocnice Lipová';
const r02 = (test: string, value: string, unit: string, ref?: string, flag?: 'H' | 'L'): LabRow =>
  ({ test, value, unit, ref, flag, date: '2026-09-01', lab: LAB_JIH, docId: '02' });
const r10 = (test: string, value: string, unit: string, ref?: string, flag?: 'H' | 'L'): LabRow =>
  ({ test, value, unit, ref, flag, date: '2026-10-15', lab: LAB_KOC, docId: '10' });

// Hodnoty jsou přepsány přesně (hlídá verify), názvy vyšetření jsou jako ve zprávách (česky).
const ALENA_LABS: LabRow[] = [
  // 15. 10. 2026 – KOC 2 (před MDT; nádorové markery nahoře)
  r10('CA 19-9', '312', 'kU/l', '< 37', 'H'),
  r10('CA 125', '48', 'kU/l', '< 35', 'H'),
  r10('CEA', '4,1', 'µg/l', '< 5,0'),
  r10('Leukocyty', '8,9', '10⁹/l', '4,0–10,0'),
  r10('Erytrocyty', '3,98', '10¹²/l', '3,80–5,20'),
  r10('Hemoglobin', '118', 'g/l', '120–160', 'L'),
  r10('Hematokrit', '0,35', '', '0,35–0,47'),
  r10('MCV', '88', 'fl', '82–98'),
  r10('Trombocyty', '312', '10⁹/l', '150–400'),
  r10('Neutrofily', '68', '%', '45–70'),
  r10('Lymfocyty', '22', '%', '20–45'),
  r10('Sodík', '137', 'mmol/l', '136–145'),
  r10('Draslík', '4,1', 'mmol/l', '3,5–5,1'),
  r10('Vápník', '2,31', 'mmol/l', '2,15–2,55'),
  r10('Urea', '4,6', 'mmol/l', '2,8–8,1'),
  r10('Kreatinin', '74', 'µmol/l', '45–84'),
  r10('eGFR (CKD-EPI)', '1,25', 'ml/s/1,73 m²', '> 1,0'),
  r10('Glukóza', '6,2', 'mmol/l', '3,9–5,6', 'H'),
  r10('Bilirubin celkový', '23', 'µmol/l', '2–17', 'H'),
  r10('Bilirubin konjugovaný', '6', 'µmol/l', '0–5', 'H'),
  r10('ALT', '1,62', 'µkat/l', '0,10–0,60', 'H'),
  r10('AST', '1,20', 'µkat/l', '0,10–0,60', 'H'),
  r10('GGT', '5,00', 'µkat/l', '0,10–0,70', 'H'),
  r10('ALP', '3,40', 'µkat/l', '0,58–1,75', 'H'),
  r10('Celková bílkovina', '66', 'g/l', '64–83'),
  r10('Albumin', '36', 'g/l', '35–52'),
  r10('CRP', '18', 'mg/l', '0–5', 'H'),
  // 1. 9. 2026 – LabJih (přes praktického lékaře)
  r02('Leukocyty', '12,8', '10⁹/l', '4,0–10,0', 'H'),
  r02('Erytrocyty', '4,21', '10¹²/l', '3,80–5,20'),
  r02('Hemoglobin', '124', 'g/l', '120–160'),
  r02('Hematokrit', '0,37', '', '0,35–0,47'),
  r02('Trombocyty', '298', '10⁹/l', '150–400'),
  r02('Neutrofily', '82', '%', '45–70', 'H'),
  r02('Lymfocyty', '12', '%', '20–45', 'L'),
  r02('Sodík', '136', 'mmol/l', '136–145'),
  r02('Draslík', '4,0', 'mmol/l', '3,5–5,1'),
  r02('Chloridy', '99', 'mmol/l', '98–107'),
  r02('Urea', '5,1', 'mmol/l', '2,8–8,1'),
  r02('Kreatinin', '78', 'µmol/l', '45–84'),
  r02('Glukóza', '6,4', 'mmol/l', '3,9–5,6', 'H'),
  r02('Bilirubin celkový', '38', 'µmol/l', '2–17', 'H'),
  r02('ALT', '1,92', 'µkat/l', '0,10–0,60', 'H'),
  r02('AST', '1,45', 'µkat/l', '0,10–0,60', 'H'),
  r02('GGT', '4,20', 'µkat/l', '0,10–0,70', 'H'),
  r02('ALP', '3,10', 'µkat/l', '0,58–1,75', 'H'),
  r02('Amyláza', '1,10', 'µkat/l', '0,47–1,67'),
  r02('Lipáza', '0,85', 'µkat/l', '0,22–1,00'),
  r02('CRP', '86', 'mg/l', '0–5', 'H'),
  r02('Moč – bilirubin', '++', '', 'neg.', 'H'),
  r02('Moč – bílkovina', '+', '', 'neg.', 'H'),
  r02('Moč – krev', '+', '', 'neg.', 'H'),
  r02('Moč – leukocyty', '++', '', 'neg.', 'H'),
  r02('Sediment – leukocyty', '65', '/µl', '0–10', 'H'),
  r02('Moč – kultivace', 'Escherichia coli 10⁴ CFU/ml', '', 'hraniční nález'),
];

const ALENA_MEDS: Medication[] = [
  {
    name: 'apixaban', dose: '5 mg · 1-0-1 (ráno a večer)',
    note: 'Před výkonem s vysokým rizikem krvácení vysadit 48 h předem (pokyn kardiologa).',
    citation: cite('07', 'apixaban 5 mg 1-0-1'),
  },
  { name: 'bisoprolol', dose: '5 mg · 1-0-0 (ráno)', citation: cite('07', 'bisoprolol 5 mg 1-0-0') },
  { name: 'perindopril', dose: '4 mg · 1-0-0 (ráno)', citation: cite('07', 'perindopril 4 mg 1-0-0') },
  { name: 'rosuvastatin', dose: '10 mg · 0-0-1 (večer)', citation: cite('07', 'rosuvastatin 10 mg 0-0-1') },
  {
    name: 'paracetamol', dose: '500 mg při bolesti, nejvýše 4× denně',
    note: 'Podle praktického lékaře jen částečná úleva.',
    citation: cite('07', 'paracetamol 500 mg při bolesti max. 4× denně'),
  },
  // Zpráva 12 (algeziolog, 26. 10.) – po MDT; MedsCard je ukáže až od data doručení.
  {
    name: 'tramadol', dose: '100 mg retard · 1-0-1 (od 26. 10.)',
    note: 'Algeziolog upozorňuje: s antidepresivy (SSRI, SNRI) vyšší riziko serotoninového syndromu.',
    citation: cite('12', 'tramadol tbl. ret. 100 mg 1-0-1'),
  },
  { name: 'metamizol', dose: '500 mg · 1-1-1 (od 26. 10.)', citation: cite('12', 'metamizol 500 mg 1-1-1') },
  {
    name: 'paracetamol', dose: '500 mg při průlomové bolesti, nejvýše 3× denně (od 26. 10.)',
    note: 'Změna oproti zprávě 07 (tam nejvýše 4× denně).',
    citation: cite('12', 'paracetamol 500 mg při průlomové bolesti, max. 3× denně'),
  },
  { name: 'metoklopramid', dose: '10 mg při nevolnosti, nejvýše 3× denně (od 26. 10.)', citation: cite('12', 'metoklopramid 10 mg při nauzee, max. 3× denně') },
  { name: 'laktulóza', dose: 'sirup 15 ml · 1× denně (od 26. 10.)', citation: cite('12', 'laktulóza sirup 15 ml 1× denně jako prevence obstipace') },
];

const ALENA_EXAMS: Exam[] = [
  { date: '2026-07-20', place: 'Kardiologická ambulance Jesenice', type: 'Kardiologická kontrola', summary: 'Stabilní stav, sinusový rytmus, bez návratu fibrilace síní. Ejekční frakce levé komory 60 %. Před výkonem s vysokým rizikem krvácení vysadit apixaban 48 hodin předem.', docId: '01' },
  { date: '2026-09-01', place: 'Ordinace praktického lékaře, Dolní Břežany', type: 'Vyšetření u praktického lékaře', summary: 'Teploty, bolesti v nadbřišku, nažloutlé bělmo. Podezření na infekci močových nebo žlučových cest, cholestáza. Léčba ciprofloxacinem 7 dní, odeslána ke gastroenterologovi.', docId: '04' },
  { date: '2026-09-03', place: 'Radiologické centrum Modřany', type: 'RTG plic', summary: 'Bez známek zánětu plic. Přiměřený nález na srdci a plicích.', docId: '03' },
  { date: '2026-09-15', place: 'Poliklinika Jižní – gastroenterologie', type: 'Gastroenterologické vyšetření', summary: 'Cholestáza, bolesti v nadbřišku vystřelující do zad, úbytek 4 kg za měsíc. Doporučen ultrazvuk břicha, podle výsledku CT nebo EUS.', docId: '05' },
  { date: '2026-09-29', place: 'Poliklinika Jižní – radiologie', type: 'Ultrazvuk břicha', summary: 'Ložisko v hlavě pankreatu 34 × 30 mm podezřelé z nádoru, mírně rozšířené žlučové cesty. Doporučeno CT podle pankreatického protokolu, případně EUS.', docId: '06' },
  { date: '2026-10-08', place: 'KOC 1 · Nemocnice Severní – radiologie', type: 'CT břicha a hrudníku (pankreatický protokol)', summary: 'Nádor hlavy pankreatu 35 mm, postihuje žílu VMS se zúžením a dotýká se tepny AMS. Podezřelá uzlina u pankreatu. Bez známek vzdálených metastáz.', docId: '08' },
  { date: '2026-10-12', place: 'KOC 2 · Nemocnice Lipová – endoskopie', type: 'Biopsie pod endosonografií (EUS-FNB)', summary: 'Ložisko 33 × 29 mm, 3 vpichy, vzorky odeslány na histologii, bez komplikací. Výsledek histologie do 3 pracovních dnů.', docId: '09' },
  { date: '2026-10-19', place: 'KOC 2 · Nemocnice Lipová – patologie', type: 'Histologie', summary: 'Duktální adenokarcinom pankreatu, středně až málo diferencovaný (G2–G3), s perineurální invazí.', docId: '11' },
  { date: '2026-10-26', place: 'KOC 1 · Nemocnice Severní – centrum léčby bolesti', type: 'Algeziologické vyšetření', summary: 'Bolest v klidu 6/10, po jídle a v noci 8/10, paracetamol nestačí. Nasazena nová léčba bolesti, kontrola za 14 dní. Váha 63 kg.', docId: '12' },
  { date: '2026-10-27', place: 'KOC 2 · Nemocnice Lipová – psychoonkologie', type: 'Klinický psycholog', summary: 'Smíšená úzkostně-depresivní porucha v reakci na nemoc. Psychiatrie objednána na 3. 11., psychoterapie jednou týdně. Pacientka si přeje, aby informace dostávala i dcera.', docId: '13' },
];

const ALENA_LOG: LogEntry[] = [
  { date: '2026-10-02', time: '08:40', action: 'Převzata žádost praktického lékaře', detail: 'Přes eZprávu přišla epikríza MUDr. Řezníčka (zpráva 07). Založen případ, počítají se dny od přijetí žádosti.', billable: true },
  { date: '2026-10-02', time: '08:55', action: 'Potvrzení přijetí praktickému lékaři', detail: 'Potvrzení se seznamem toho, co chybí: výsledky vyšetření, ECOG, váha, e-mail.', billable: true },
  { date: '2026-10-02', time: '09:30', action: 'Vyžádány zprávy 01–06', detail: 'Kardiologie Jesenice, LabJih, RC Modřany, praktický lékař (epikríza ze 4. 9.), Poliklinika Jižní (gastroenterologie, ultrazvuk).', billable: true },
  { date: '2026-10-02', time: '10:10', action: 'Vyžádáno CT v KOC 1', detail: 'V KOC 2 nebyl volný termín. Žádost o CT břicha a hrudníku podle pankreatického protokolu do Nemocnice Severní.', billable: true },
  { date: '2026-10-02', time: '10:30', action: 'Vyžádán klinický psycholog', detail: 'Na prosbu praktického lékaře o psychologickou podporu (zpráva 07).', billable: true },
  { date: '2026-10-03', action: 'Doručeno: laboratoř LabJih (02)', detail: 'Přišlo přes eZprávu.', billable: false },
  { date: '2026-10-05', time: '09:15', action: 'Objednáno CT v KOC 1 na 8. 10.', detail: 'Termín potvrdila radiologie KOC 1. Pacientce oznámen telefonicky.', billable: true },
  { date: '2026-10-05', time: '11:00', action: 'Doručeno: zprávy 04, 05, 06', detail: 'Epikríza praktického lékaře e-mailem, gastroenterolog a ultrazvuk přes eZprávu.', billable: false },
  { date: '2026-10-05', time: '14:20', action: 'Urgence: kardiologie Jesenice', detail: 'Telefonát – zpráva z 20. 7. ještě nepřišla.', billable: true },
  { date: '2026-10-06', action: 'Doručeno: zprávy 01 a 03', detail: 'Kardiologie e-mailem, RTG plic poštou (naskenováno).', billable: false },
  { date: '2026-10-08', time: '13:00', action: 'Doručeno: CT z KOC 1 (08)', detail: 'Snímky i popis přes ePACS.', billable: false },
  { date: '2026-10-08', time: '14:00', action: 'Objednána biopsie EUS-FNB na 12. 10.', detail: 'Endoskopie KOC 2. Pacientce oznámen termín a příprava podle pokynů lékaře.', billable: true },
  { date: '2026-10-08', time: '14:30', action: 'Vyžádán algeziolog', detail: 'Bolesti navzdory paracetamolu (zpráva 07).', billable: true },
  { date: '2026-10-09', time: '10:00', action: 'Případ zařazen na MDT 21. 10.', detail: 'MDT pro nádory GIT, KOC 2 · Nemocnice Lipová.', billable: true },
  { date: '2026-10-12', time: '13:30', action: 'Biopsie provedena (09)', detail: 'Protokol v NIS. Histologie slíbena do 3 pracovních dnů, tedy do 15. 10. Objednány kontrolní odběry na 15. 10.', billable: true },
  { date: '2026-10-13', time: '09:40', action: 'Objednán algeziolog na 26. 10.', detail: 'Centrum léčby bolesti, KOC 1 · Nemocnice Severní.', billable: true },
  { date: '2026-10-14', time: '11:10', action: 'Objednán klinický psycholog na 27. 10.', detail: 'Psychoonkologická ambulance KOC 2.', billable: true },
  { date: '2026-10-15', action: 'Doručeno: kontrolní odběry (10)', detail: 'Včetně nádorových markerů CA 19-9, CEA a CA 125.', billable: false },
  { date: '2026-10-16', time: '09:00', action: 'Urgence: histologie po termínu', detail: 'Výsledek měl přijít do 15. 10. Telefonát na Ústav patologie KOC 2.', billable: true },
  { date: '2026-10-19', time: '12:40', action: 'Doručena histologie (11) – 4 dny po termínu', detail: 'Rozpor v datech: vydáno 19. 10., odběr uveden 20. 10. Posláno patologii k ověření.', billable: true },
  { date: '2026-10-21', time: '14:00', action: 'MDT proběhlo', detail: 'Zápis z jednání MDT uložen do případu.', billable: true },
  { date: '2026-10-21', time: '16:40', action: 'Závěr odeslán praktickému lékaři', detail: 'eZpráva, zapečetěno nemocnicí; doručeno 16:41.', billable: true },
  { date: '2026-10-21', time: '16:45', action: 'Souhrn pro revizního lékaře ZP MV ČR (211)', detail: 'Diagnóza, rozhodnutí MDT, plánovaná léčba.', billable: true },
  { date: '2026-10-22', time: '08:15', action: 'Praktický lékař potvrdil doručení závěru', detail: 'Doručenka.', billable: false },
  { date: '2026-10-26', action: 'Doručeno: algeziolog (12)', detail: 'Přišlo přes eZprávu.', billable: false },
  { date: '2026-10-27', action: 'Doručeno: klinický psycholog (13)', detail: 'Zápis v NIS.', billable: false },
];

const ALENA: Case = {
  id: 'alena',
  demo: 'full',
  patient: {
    firstName: 'Alena', lastName: 'Procházková', age: 63, sex: 'žena',
    insurerCode: '211', insurerName: 'Zdravotní pojišťovna ministerstva vnitra ČR',
    phone: '+420 777 000 541',
    contact: { name: 'Petra Horká', relation: 'dcera', phone: '+420 777 000 542' },
  },
  // E-mail praktického lékaře v podkladech není (záměrně bez `email`).
  referringGp: {
    name: 'MUDr. Tomáš Řezníček',
    practice: 'Praktický lékař pro dospělé, Na Návsi 3, 252 41 Dolní Břežany',
    phone: '+420 311 000 287',
  },
  diagnosisShort: 'nádor hlavy pankreatu (C25.0)',
  koc: 'KOC 2 · Nemocnice Lipová',
  mdtDate: '2026-10-21',
  receivedAt: '2026-10-02',
  status: 'active',
  // Text obsahuje popis chybějícího pole (Stav výkonnosti (ECOG)) – obrazovky podle toho poznají, že jde o toto pole.
  nextStep: { text: 'Doplnit stav výkonnosti (ECOG) do podkladu pro MDT', owner: 'já (koordinátorka)', due: '2026-10-20', mine: true },
  clockTargetDays: 33, // vyžaduje typ Case; v UI se cílová lhůta neukazuje, jen „den X od přijetí žádosti“
  fields: ALENA_FIELDS,
  steps: ALENA_STEPS,
  labs: ALENA_LABS,
  meds: ALENA_MEDS,
  exams: ALENA_EXAMS,
  docs: ALENA_DOCS,
  log: ALENA_LOG,
  precheck: {
    findings: [
      { text: 'Chybí výsledky 5 vyšetření, která žádost vyjmenovává (kardiolog 20. 7., laboratoř 1. 9., RTG 3. 9., gastroenterolog 15. 9., ultrazvuk 29. 9.). Podle žádosti jsou na jednotlivých pracovištích.', severity: 'missing' },
      { text: 'Chybí stav výkonnosti pacientky (ECOG nebo Karnofského skóre).', severity: 'missing' },
      { text: 'Chybí aktuální váha a výška – v žádosti je jen „pokračující úbytek hmotnosti“.', severity: 'missing' },
      { text: 'E-mail pacientky není uveden (na vědomí, není to chyba).', severity: 'info' },
      { text: 'E-mail praktického lékaře není uveden, je jen telefon (na vědomí – závěr jde přes eZprávu).', severity: 'info' },
      { text: 'Telefon pacientky a kontakt na dceru jsou uvedeny. Pacientka souhlasí se sdílením informací s dcerou.', severity: 'info' },
      { text: 'Termín CT se praktickému lékaři nepodařilo zajistit – žádá urgentní řešení.', severity: 'info' },
      { text: 'Pacientka užívá apixaban – praktický lékař upozorňuje na vysazení před výkony podle kardiologa.', severity: 'info' },
      { text: 'Pojišťovna 211 (ZP MV ČR), nikoli VZP.', severity: 'info' },
    ],
  },
  gpReport: {
    question: 'Žádám o převzetí pacientky do péče KOC k dokončení diagnostiky (CT břicha, histologická verifikace) a stanovení dalšího postupu v rámci MDT.',
    answer: 'Biopsie potvrdila nádor hlavy pankreatu (duktální adenokarcinom, G2–G3). Na CT nádor zasahuje do cév, je podezřelá regionální uzlina, bez známek vzdálených metastáz. MDT ho hodnotí jako hraničně resekabilní (hraničně operovatelný) a doporučuje nejprve chemoterapii, potom nové CT a opětovné posouzení operace.',
    forYou: [
      'MDT doporučuje nejprve chemoterapii (neoadjuvantní). Další krok: termín na onkologickém konziliu 4. 11. 2026 v 10:30 (MUDr. Kalous). Před zahájením léčby MDT žádá stanovit ECOG, doplnit krevní testy a CA 19-9 a posoudit žlučové cesty. Termíny zařídí koordinátorka KOC, Bc. Lucie Dvořáková.',
      'Apixaban: pacientka ho nemá vysazovat sama. Postup před každým výkonem určí lékař, který výkon provádí.',
      'Co sledovat: horečka, zimnice, přibývající žloutenka nebo zhoršení celkového stavu – pak neodkladné vyšetření. Drenáž žlučových cest zatím ve zprávách není.',
      'Bolest, výživa, psychika: MDT doporučuje nutriční podporu, úpravu léčby bolesti a psychoonkologickou podporu. Vaši prosbu o psychologa jsme vyřídili – termín 27. 10.',
    ],
    citations: [
      cite('07', 'Žádám o převzetí pacientky do péče KOC k dokončení diagnostiky (CT břicha, histologická verifikace) a stanovení dalšího postupu v rámci MDT.'),
      cite('MDT', '63letá pacientka s histologicky potvrzeným duktálním adenokarcinomem hlavy pankreatu G2–G3.'),
      cite('MDT', 'přítomna suspektní regionální uzlina, bez známek vzdálených metastáz'),
      cite('MDT', 'Nález je hodnocen jako hraničně resekabilní.'),
      cite('MDT', 'S ohledem na cévní postižení MDT doporučuje neoadjuvantní systémovou chemoterapii a následné restagingové vyšetření se znovuposouzením možnosti chirurgické resekce.'),
      cite('MDT', '1. Neoadjuvantní chemoterapie: termín na onkologické konzilium 4.11.2026 10:30, MUDr. Kalous'),
      cite('MDT', '2. Před zahájením léčby: stanovit ECOG, doplnit aktuální krevní obraz, jaterní a renální parametry, ionty a CA 19-9'),
      cite('MDT', 'Bc. Lucie Dvořáková – koordinátorka KOC'),
      cite('MDT', 'postup s apixabanem před invazivními výkony určit individuálně s provádějícím lékařem'),
      cite('MDT', 'Léčbu samostatně nevysazovat.'),
      cite('MDT', 'Při horečce, zimnici, progresi ikteru nebo zhoršení celkového stavu neodkladně lékařské vyšetření.'),
      cite('MDT', 'V dostupných zprávách není doložena biliární drenáž.'),
      cite('MDT', 'Nutriční intervence pro váhový úbytek a nechutenství; zhodnocení bolesti a úprava analgetické léčby.'),
      cite('MDT', 'Nabídnout psychoonkologickou podporu vzhledem k výrazné úzkosti.'),
      cite('07', 'Vzhledem k výrazné úzkosti pacientky prosím o zvážení psychologické podpory.'),
    ],
  },
  reviewer: {
    insurerCode: '211',
    insurerName: 'Zdravotní pojišťovna ministerstva vnitra ČR',
    note: 'Pacientka není pojištěnkou VZP. Prezentace VZP chce, aby informaci dostal i revizní lékař; u této pacientky by to byl revizní lékař ZP MV ČR (211). Kanál v ČR nemáme ověřený, odeslání je v prototypu jen naznačeno.',
  },
};

// ---------------------------------------------------------------------------------------------
// Lehké fiktivní případy do fronty (demo 'light'). Vymyšlené jen pro demo, jiná jména a diagnózy.
// ---------------------------------------------------------------------------------------------

const KUCERA: Case = {
  id: 'kucera',
  demo: 'light',
  patient: {
    firstName: 'Jaroslav', lastName: 'Kučera', age: 67, sex: 'muž',
    insurerCode: '111', insurerName: 'Všeobecná zdravotní pojišťovna ČR', phone: '+420 777 000 611',
  },
  referringGp: { name: 'MUDr. Jana Sedláčková', practice: 'Praktický lékař pro dospělé, Říčany', phone: '+420 311 000 611' },
  diagnosisShort: 'podezření na nádor plic',
  koc: 'KOC 2 · Nemocnice Lipová',
  // Žádost ještě není převzata: bez termínu MDT a bez vyžádaných kroků.
  receivedAt: '2026-10-19',
  status: 'new',
  nextStep: { text: 'Převzít žádost praktického lékaře a vyžádat CT hrudníku a břicha', owner: 'já (koordinátorka)', due: '2026-10-19', mine: true },
  clockTargetDays: 33, // vyžaduje typ Case; v UI se neukazuje
  fields: [],
  steps: [],
  labs: [],
  meds: [],
  exams: [],
  docs: [
    {
      id: 'K-01', title: 'Žádost praktického lékaře o převzetí do KOC', place: 'Praktický lékař, Říčany', kind: 'request',
      examDate: '2026-10-19', receivedAt: '2026-10-19', channel: 'e-mail',
      text: [
        'FIKTIVNÍ PACIENT – ukázková data pro frontu, Rakathon 2026',
        'Ordinace praktického lékaře, Říčany (fiktivní)',
        'MUDr. Jana Sedláčková',
        'Žádost o převzetí do péče KOC',
        'Pacient: Jaroslav Kučera, 67 let',
        'Zdravotní pojišťovna: 111',
        'Telefon: +420 777 000 611',
        'Suspektní diagnóza: C34.1 – suspektní tumor horního laloku pravé plíce',
        'RTG hrudníku 14. 10. 2026: okrouhlé ložisko v pravém horním laloku 28 mm.',
        'Žádám o dovyšetření (CT hrudníku a břicha) a projednání v MDT.',
        'V Říčanech dne 19. 10. 2026',
      ].join('\n'),
    },
  ],
  log: [
    { date: '2026-10-19', time: '07:50', action: 'Nová žádost praktického lékaře', detail: 'Přišla e-mailem, čeká na převzetí.', billable: false },
  ],
};

const POSPISILOVA: Case = {
  id: 'pospisilova',
  demo: 'light',
  patient: {
    firstName: 'Zdeňka', lastName: 'Pospíšilová', age: 58, sex: 'žena',
    insurerCode: '201', insurerName: 'Vojenská zdravotní pojišťovna ČR', phone: '+420 777 000 621',
  },
  referringGp: { name: 'MUDr. Karel Novotný', practice: 'Praktický lékař pro dospělé, Benešov', phone: '+420 311 000 621' },
  diagnosisShort: 'podezření na nádor tlustého střeva',
  koc: 'KOC 2 · Nemocnice Lipová',
  receivedAt: '2026-10-09',
  status: 'active',
  // Ilustrační eskalace ve frontě (QA R1 #8): histologie slíbená do 2 pracovních dnů (16. 10.) k 19. 10. nepřišla.
  nextStep: { text: 'Urgovat histologii z kolonoskopie (měla přijít do 16. 10.)', owner: 'já (koordinátorka)', due: '2026-10-19', mine: true },
  clockTargetDays: 33, // vyžaduje typ Case; v UI se neukazuje
  fields: [],
  steps: [
    {
      id: 'colonoscopy', title: 'Kolonoskopie s biopsií', place: 'KOC 2 · Nemocnice Lipová – endoskopie',
      owner: 'endoskopie KOC 2', due: '2026-10-14', state: 'delivered',
      history: [h('requested', '2026-10-09'), h('ordered', '2026-10-12'), h('done', '2026-10-14'), h('delivered', '2026-10-14')],
      resultDocId: 'P-02',
    },
    {
      id: 'histology', title: 'Histologie z kolonoskopie', place: 'KOC 2 · Nemocnice Lipová – patologie',
      owner: 'patologie KOC 2', due: '2026-10-16', state: 'ordered',
      history: [h('requested', '2026-10-14'), h('ordered', '2026-10-14')],
    },
    {
      id: 'ct', title: 'CT hrudníku a břicha', place: 'KOC 1 · Nemocnice Severní',
      owner: 'radiologie KOC 1', due: '2026-10-23', state: 'ordered',
      history: [h('requested', '2026-10-14'), h('ordered', '2026-10-15')],
    },
  ],
  labs: [],
  meds: [],
  exams: [],
  docs: [
    {
      id: 'P-01', title: 'Žádost praktického lékaře o převzetí do KOC', place: 'Praktický lékař, Benešov', kind: 'request',
      examDate: '2026-10-09', receivedAt: '2026-10-09', channel: 'eZpráva',
      text: [
        'FIKTIVNÍ PACIENTKA – ukázková data pro frontu, Rakathon 2026',
        'Ordinace praktického lékaře, Benešov (fiktivní)',
        'MUDr. Karel Novotný',
        'Žádost o převzetí do péče KOC',
        'Pacientka: Zdeňka Pospíšilová, 58 let',
        'Zdravotní pojišťovna: 201',
        'Telefon: +420 777 000 621',
        'Suspektní diagnóza: C18.7 – suspektní tumor sigmoidea',
        'Pozitivní test na okultní krvácení, změna vyprazdňování 2 měsíce.',
        'Žádám o kolonoskopii s biopsií, stagingové CT a projednání v MDT.',
        'V Benešově dne 9. 10. 2026',
      ].join('\n'),
    },
    {
      id: 'P-02', title: 'Kolonoskopie s biopsií', place: 'KOC 2 · Nemocnice Lipová – endoskopie', kind: 'report',
      examDate: '2026-10-14', receivedAt: '2026-10-14', channel: 'NIS',
      text: [
        'FIKTIVNÍ PACIENTKA – ukázková data pro frontu, Rakathon 2026',
        'KOC Nemocnice Lipová (fiktivní), endoskopické pracoviště',
        'Kolonoskopie s biopsií, 14. 10. 2026',
        'Pacientka: Zdeňka Pospíšilová',
        'V sigmoideu exofytický útvar zužující lumen, odebrány vzorky k histologii.',
        'Výsledek histologie do 2 pracovních dnů.',
        'Závěr: suspektní karcinom sigmoidea. Doporučeno CT hrudníku a břicha.',
      ].join('\n'),
    },
  ],
  log: [
    { date: '2026-10-09', time: '10:20', action: 'Převzata žádost praktického lékaře', detail: 'Přišla přes eZprávu. Potvrzení přijetí odesláno.', billable: true },
    { date: '2026-10-12', time: '08:30', action: 'Objednána kolonoskopie na 14. 10.', detail: 'Endoskopie KOC 2.', billable: true },
    { date: '2026-10-14', action: 'Doručeno: kolonoskopie (P-02)', detail: 'Histologie slíbena do 2 pracovních dnů, tedy do 16. 10.', billable: false },
    { date: '2026-10-15', time: '09:00', action: 'Objednáno CT v KOC 1 na 23. 10.', detail: 'V KOC 2 nebyl dřívější termín.', billable: true },
  ],
};

const KRALOVA: Case = {
  id: 'kralova',
  demo: 'light',
  patient: {
    firstName: 'Eva', lastName: 'Králová', age: 52, sex: 'žena',
    insurerCode: '207', insurerName: 'Oborová zdravotní pojišťovna zaměstnanců bank, pojišťoven a stavebnictví', phone: '+420 777 000 631',
  },
  referringGp: { name: 'MUDr. Petra Šťastná', practice: 'Mamologická ambulance, Kolín', phone: '+420 311 000 631' },
  diagnosisShort: 'podezření na nádor prsu',
  koc: 'KOC 2 · Nemocnice Lipová',
  mdtDate: '2026-11-02',
  receivedAt: '2026-10-05',
  status: 'postponed',
  nextStep: { text: 'Biopsie přesunuta na žádost pacientky na 26. 10.', owner: 'pacientka', due: '2026-10-26', mine: false },
  clockTargetDays: 33, // vyžaduje typ Case; v UI se neukazuje
  fields: [],
  steps: [
    {
      id: 'biopsy', title: 'Biopsie prsu pod ultrazvukem', place: 'KOC 2 · Nemocnice Lipová – mamologie',
      owner: 'pacientka (přesun termínu)', due: '2026-10-26', state: 'ordered',
      history: [h('requested', '2026-10-05'), h('ordered', '2026-10-07')],
    },
  ],
  labs: [],
  meds: [],
  exams: [],
  docs: [
    {
      id: 'R-01', title: 'Žádost o převzetí do KOC', place: 'Mamologická ambulance, Kolín', kind: 'request',
      examDate: '2026-10-05', receivedAt: '2026-10-05', channel: 'e-mail',
      text: [
        'FIKTIVNÍ PACIENTKA – ukázková data pro frontu, Rakathon 2026',
        'Mamologická ambulance Kolín (fiktivní)',
        'MUDr. Petra Šťastná',
        'Žádost o převzetí do péče KOC',
        'Pacientka: Eva Králová, 52 let',
        'Zdravotní pojišťovna: 207',
        'Telefon: +420 777 000 631',
        'Suspektní diagnóza: C50.4 – suspektní tumor levého prsu',
        'Mamografie a UZ prsů 1. 10. 2026: ložisko 16 mm v horním zevním kvadrantu levého prsu.',
        'Žádám o biopsii pod UZ a projednání v MDT.',
        'V Kolíně dne 5. 10. 2026',
      ].join('\n'),
    },
  ],
  log: [
    { date: '2026-10-05', time: '13:00', action: 'Převzata žádost', detail: 'Přišla e-mailem. Potvrzení přijetí odesláno.', billable: true },
    { date: '2026-10-07', time: '10:45', action: 'Objednána biopsie na 14. 10.', detail: 'Mamologie KOC 2.', billable: true },
    { date: '2026-10-12', time: '15:30', action: 'Biopsie přesunuta na 26. 10.', detail: 'Pacientka telefonicky požádala o pozdější termín z rodinných důvodů.', billable: true },
  ],
};

// Alena musí zůstat PRVNÍ (fullCase()/findCase() berou první případ s demo 'full').
export const CASES: Case[] = [ALENA, NOVAK, KUCERA, POSPISILOVA, KRALOVA];

/**
 * Původ údajů případu: Alena = ručně připravené a ověřené týmem (kontrolní sada; na obrazovce se odznak neukazuje);
 * Josef Novák = strojové vytěžení (pravidla + jazykový model, předpočítané), každé pole jen navržené – potvrzuje člověk.
 * fieldOrigin říká, kdo navrhl hodnotu pole ('rules' | 'ai' | 'manual').
 */
export const CASE_AI: Record<string, CaseAi> = {
  alena: {
    label: 'ručně ověřeno', mode: 'manual', evalFile: 'data/eval-alena.json',
    fieldOrigin: Object.fromEntries(ALENA_FIELDS.map((f) => [f.key, 'manual' as FieldOrigin])),
  },
  novak: NOVAK_AI,
};

// Dopředná kompatibilita s QA R4 (b1): pokud types.ts dostane Case.ai a HandoverField.origin, hodnoty už jsou v datech.
for (const c of CASES) {
  const ai = CASE_AI[c.id];
  if (!ai) continue;
  const { fieldOrigin, ...meta } = ai;
  Object.assign(c, { ai: meta });
  for (const f of c.fields) if (fieldOrigin?.[f.key]) Object.assign(f, { origin: fieldOrigin[f.key] });
}

// ---------------------------------------------------------------------------------------------
// Pomůcky pro „stav k datu“ (čisté funkce, bez Reactu)
// ---------------------------------------------------------------------------------------------

export function getCase(id: string): Case | undefined {
  return CASES.find((c) => c.id === id);
}

/** Dokumenty, které měla koordinátorka k datu asOf (podle receivedAt). */
export function docsAsOf(c: Case, asOf: ISODate): SourceDoc[] {
  return c.docs.filter((d) => d.receivedAt <= asOf);
}

/** Stav kroku k datu (poslední záznam historie s datem ≤ asOf); null = ještě nevyžádáno. */
export function stepStateAsOf(step: PathStep, asOf: ISODate): StepState | null {
  let s: StepState | null = null;
  for (const e of step.history) if (e.date <= asOf) s = e.state;
  return s;
}

const DAY = 86_400_000;
const days = (from: ISODate, to: ISODate) => Math.round((Date.parse(to) - Date.parse(from)) / DAY);

/** O kolik dní krok k datu asOf zpožďuje (0 = v termínu). Doručený krok = zpoždění při doručení. */
export function stepDelayDays(step: PathStep, asOf: ISODate): number {
  const delivered = step.history.find((e) => e.state === 'delivered' && e.date <= asOf);
  return Math.max(0, days(step.due, delivered ? delivered.date : asOf));
}

const SENTENCE_END = /[.!?]\s+(?=[A-ZÁÄČĎÉĚÍĹĽŇÓÔŔŘŠŤÚŮÝŽ])/g;
/** Removes the sentence that contains `token` ("Dříve: 78 kg (3. 9. 2026). Novější hodnota 73 kg …" → "Dříve: 78 kg (3. 9. 2026)."). */
function dropSentenceWith(note: string, token: string): string {
  const i = token ? note.indexOf(token) : -1;
  if (i < 0) return note;
  const before = [...note.slice(0, i).matchAll(SENTENCE_END)].pop();
  const start = before ? before.index! + 1 : 0;
  const after = [...note.slice(i).matchAll(SENTENCE_END)][0];
  const end = after ? i + after.index! + 1 : note.length;
  return `${note.slice(0, start)} ${note.slice(end)}`.replace(/\s+/g, ' ').trim();
}

/**
 * Podklad k datu asOf: použije pozdější hodnoty (LATER_VALUES), skryje citáty ze zpráv,
 * které ještě nepřišly, a pole bez doručeného zdroje označí jako chybějící.
 */
export function fieldsAsOf(c: Case, asOf: ISODate): HandoverField[] {
  const doc = new Map(c.docs.map((d) => [d.id, d]));
  const known = (x: Citation) => (doc.get(x.docId)?.receivedAt ?? '9999-12-31') <= asOf;
  const later = LATER_VALUES[c.id] ?? [];
  return c.fields.map((f0) => {
    let f: HandoverField = f0;
    for (const lv of later) {
      if (lv.key === f.key && lv.from <= asOf) {
        f = { ...f, value: lv.value, citations: lv.citations, sourceDate: lv.sourceDate, note: lv.note ?? f.note };
      } else if (lv.key === f.key && f.note) {
        // a later value is not known yet: drop the sentence of the note that already names it (QA R5 #11)
        f = { ...f, note: dropSentenceWith(f.note, lv.value.split(/\s[(·]/)[0].trim()) || undefined };
      }
    }
    if (f.status === 'missing') return f;
    const citations = f.citations.filter(known);
    if (f.conflict && !(known(f.conflict.a.citation) && known(f.conflict.b.citation))) {
      f = { ...f, status: 'confirmed', conflict: undefined };
    }
    if (citations.length === 0) {
      return { ...f, value: '', status: 'missing', citations: [], conflict: undefined, sourceDate: undefined, note: 'K tomuto datu ještě nepřišla zpráva, ze které se údaj bere.' };
    }
    const sourceDate = citations.map((x) => doc.get(x.docId)?.examDate ?? '').sort().pop();
    return { ...f, citations, sourceDate: sourceDate || f.sourceDate };
  });
}
