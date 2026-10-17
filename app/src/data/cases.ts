// Demo dáta pre aplikáciu koordinátora KOC. VŠETKO JE FIKTÍVNE (zadanie VZP, Rakathon 2026).
//
// Pravidlá:
// - Každý citát (Citation.quote) je DOSLOVNÝ úryvok z textu správy. Texty správ 01–13 sú
//   v public/data/source.json, zápis z konzília je tam ako šablóna „MDT zaver“ (docId 'MDT'),
//   fiktívna doplnková správa 14 (ECOG) je nižšie v EXTRA_DOCS. Overuje to `npm run verify`.
// - Chýbajúce je označené (status 'missing'), nič sa nedomýšľa. Rozpor = obe verzie vedľa seba.
// - PathStep.state = stav k DEMO_TODAY (19. 10. 2026). PathStep.history, Case.log, Case.exams
//   a Case.docs obsahujú celý príbeh až do 27. 10. – UI ich filtruje podľa dátumu „stav k“
//   (pomôcky stepStateAsOf, fieldsAsOf, docsAsOf nižšie).
// - Case.fields = podklad k 21. 10. 2026 (deň konzília). Neskoršie hodnoty (váha 63 kg zo správy 12)
//   sú v LATER_VALUES a fieldsAsOf ich použije až od dátumu ich doručenia.
// - Žiadne skóre naliehavosti ani odporúčanie liečby. Fronta sa radí len podľa termínov.
// - Druhý plný prípad Josef Novák (pľúca) je Maťovo strojové vyťaženie: src/data/pacient2.gen.ts.
//   Namerané čísla presnosti: src/data/eval.gen.ts (EVAL_SUMMARY). Obe generuje
//   `node scripts/build-pacient2.mjs` z public/data/extracted-*.json a eval-*.json – ručne neupravovať.

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
// Fiktívna doplnková správa pre demo „doplnenie naživo“ (vyžiadam ECOG → príde odpoveď → pole zozelenie).
// NIE JE súčasťou podkladov zadania. public/data/source.json sa nemení.
// ---------------------------------------------------------------------------------------------
export const EXTRA_DOCS: Record<string, string> = {
  '14': [
    'FIKTÍVNA DOPLNKOVÁ SPRÁVA PRE DEMO – nie je súčasťou podkladov zadania Rakathon 2026',
    'KOC Nemocnice Lipová (fiktivní)',
    'Onkologická ambulance',
    'Nemocniční 15, 140 00 Praha 4',
    'Doplnění údaje na žádost koordinátorky KOC',
    'Pacientka: Alena Procházková, RČ 635722/1013, ZP 211',
    'Datum: 19. 10. 2026',
    'STAV VÝKONNOSTI',
    'Stav výkonnosti: ECOG 1 (omezena při fyzicky náročné činnosti, chodící, schopna lehké práce).',
    'V Praze dne 19. 10. 2026',
    'MUDr. Lenka Marková',
    'onkologická ambulance KOC',
  ].join('\n'),
};

// ---------------------------------------------------------------------------------------------
// ALENA PROCHÁZKOVÁ – plný prípad (demo 'full')
// ---------------------------------------------------------------------------------------------

const ALENA_DOCS: SourceDoc[] = [
  { id: '01', title: 'Kardiológia – kontrola', place: 'Kardiologická ambulancia Jesenice', kind: 'report', examDate: '2026-07-20', receivedAt: '2026-10-06', channel: 'e-mail' },
  { id: '02', title: 'Laboratórium – krv a moč', place: 'Laboratórium LabJih', kind: 'result', examDate: '2026-09-01', receivedAt: '2026-10-03', channel: 'eZpráva' },
  { id: '03', title: 'RTG hrudníka', place: 'Radiologické centrum Modřany', kind: 'result', examDate: '2026-09-03', receivedAt: '2026-10-06', channel: 'papier' },
  { id: '04', title: 'Praktický lekár – epikríza', place: 'Ordinácia praktického lekára, Dolní Břežany', kind: 'report', examDate: '2026-09-04', receivedAt: '2026-10-05', channel: 'e-mail' },
  { id: '05', title: 'Gastroenterológia – vstupné vyšetrenie', place: 'Poliklinika Jižní – gastroenterológia', kind: 'report', examDate: '2026-09-15', receivedAt: '2026-10-05', channel: 'eZpráva' },
  { id: '06', title: 'Ultrazvuk brucha', place: 'Poliklinika Jižní – rádiológia', kind: 'result', examDate: '2026-09-29', receivedAt: '2026-10-05', channel: 'eZpráva' },
  { id: '07', title: 'Žiadosť praktika o prevzatie do KOC', place: 'Ordinácia praktického lekára, Dolní Břežany', kind: 'request', examDate: '2026-10-02', receivedAt: '2026-10-02', channel: 'eZpráva' },
  { id: '08', title: 'CT brucha a hrudníka', place: 'KOC 1 · Nemocnica Severní – rádiológia', kind: 'result', examDate: '2026-10-08', receivedAt: '2026-10-08', channel: 'ePACS' },
  { id: '09', title: 'Biopsia EUS-FNB – protokol', place: 'KOC 2 · Nemocnica Lipová – endoskopia', kind: 'report', examDate: '2026-10-12', receivedAt: '2026-10-12', channel: 'NIS' },
  { id: '10', title: 'Laboratórium – kontrolné odbery', place: 'KOC 2 · Nemocnica Lipová – laboratórium', kind: 'result', examDate: '2026-10-15', receivedAt: '2026-10-15', channel: 'NIS' },
  { id: '11', title: 'Histológia – výsledok biopsie', place: 'KOC 2 · Nemocnica Lipová – patológia', kind: 'result', examDate: '2026-10-19', receivedAt: '2026-10-19', channel: 'NIS' },
  { id: '12', title: 'Algeziológia – liečba bolesti', place: 'KOC 1 · Nemocnica Severní – centrum liečby bolesti', kind: 'report', examDate: '2026-10-26', receivedAt: '2026-10-26', channel: 'eZpráva' },
  { id: '13', title: 'Klinický psychológ', place: 'KOC 2 · Nemocnica Lipová – psychoonkológia', kind: 'report', examDate: '2026-10-27', receivedAt: '2026-10-27', channel: 'NIS' },
  // Fiktívna odpoveď na žiadosť o ECOG (len pre demo, text v EXTRA_DOCS). Príde až po „Vyžiadať“ → „Simulovať odpoveď“
  // (UI ju do toho skrýva: je to resolvedBy poľa performance). Dátum = DEMO_TODAY, rovnako ako v texte správy.
  { id: '14', title: 'Doplnenie ECOG (fiktívna správa pre demo)', place: 'KOC 2 · Nemocnica Lipová – onkologická ambulancia', kind: 'report', examDate: '2026-10-19', receivedAt: '2026-10-19', channel: 'NIS', text: EXTRA_DOCS['14'] },
  // Zápis z konzília (vzor „MDT zaver“ zo zadania) – zdroj pre záver praktikovi.
  { id: 'MDT', title: 'Zápis z konzília (MDT)', place: 'KOC 2 · Nemocnica Lipová – MDT pre nádory GIT', kind: 'report', examDate: '2026-10-21', receivedAt: '2026-10-21', channel: 'NIS' },
];

const ALENA_FIELDS: HandoverField[] = [
  // --- Pacient ---
  {
    key: 'firstName', label: 'Meno', group: 'Pacient', value: 'Alena', status: 'confirmed',
    citations: [cite('07', 'Pacientka: Alena Procházková')], sourceDate: '2026-10-02',
  },
  {
    key: 'lastName', label: 'Priezvisko', group: 'Pacient', value: 'Procházková', status: 'confirmed',
    citations: [cite('07', 'Pacientka: Alena Procházková')], sourceDate: '2026-10-02',
  },
  {
    key: 'age', label: 'Vek', group: 'Pacient', value: '63 rokov', status: 'confirmed',
    citations: [cite('07', 'Datum narození: 22. 7. 1963 (63 let)')], sourceDate: '2026-10-02',
    note: 'Narodená 22. 7. 1963.',
  },
  {
    key: 'sex', label: 'Pohlavie', group: 'Pacient', value: 'žena', status: 'proposed',
    citations: [cite('07', '63letá pacientka sledovaná v naší ordinaci.'), cite('07', 'Rodné číslo: 635722/1013')],
    sourceDate: '2026-10-02',
    note: 'V správach nie je ako samostatný údaj. Odvodené zo slova „pacientka“ a z rodného čísla (mesiac +50 = žena). Prosím, potvrďte.',
  },
  {
    key: 'insurer', label: 'Zdravotná poisťovňa', group: 'Pacient',
    value: '211 · Zdravotní pojišťovna ministerstva vnitra ČR', status: 'confirmed',
    citations: [cite('07', 'Zdravotní pojišťovna: 211')], sourceDate: '2026-10-02',
    note: 'Pozor: nie je to VZP, ale ZP MV ČR (211). Ak má súhrn dostať aj revízny lekár (chce to prezentácia VZP), išiel by poisťovni 211.',
  },
  // --- Kontakty ---
  {
    key: 'patientContact', label: 'Kontakt na pacientku', group: 'Kontakty', value: '+420 777 000 541', status: 'confirmed',
    citations: [cite('07', 'Telefon: +420 777 000 541')], sourceDate: '2026-10-02',
    note: 'E-mail pacientky v žiadnej správe nie je.',
  },
  {
    key: 'contactPerson', label: 'Kontaktná osoba', group: 'Kontakty',
    value: 'Petra Horká (dcéra), +420 777 000 542', status: 'confirmed',
    citations: [
      cite('07', 'Kontaktní osoba: Petra Horká (dcera), tel. +420 777 000 542'),
      cite('07', 'Souhlasí se sdílením informací s dcerou.'),
    ],
    sourceDate: '2026-10-02',
    note: 'Pacientka súhlasí so zdieľaním informácií s dcérou.',
  },
  // --- Diagnóza ---
  {
    key: 'diagnosis', label: 'Diagnóza', group: 'Diagnóza',
    value: 'C25.0 – nádor hlavy pankreasu; histológia: duktálny adenokarcinóm (G2–G3)', status: 'proposed',
    citations: [
      cite('07', 'Suspektní diagnóza: C25.0 – suspektní tumor hlavy pankreatu, cholestatický syndrom'),
      cite('08', 'Tumor hlavy pankreatu 35 mm s venózním postižením VMS se zúžením lumen a s kontaktem s AMS.'),
      cite('11', 'Duktální adenokarcinom pankreatu, středně až málo diferencovaný (G2–G3), s perineurální invazí.'),
    ],
    sourceDate: '2026-10-19',
    note: 'Kód C25.0 uviedol praktik ako podozrenie. Histológia nádor potvrdzuje. Konečnú diagnózu potvrdí konzílium.',
  },
  {
    key: 'epicrisis', label: 'Priebeh ochorenia v skratke', group: 'Diagnóza',
    value: 'Od polovice augusta 2026 bolesti brucha, koncom augusta teploty a tmavý moč. Ultrazvuk 29. 9. ukázal ložisko v hlave pankreasu podozrivé z nádoru. Termín CT praktik nezabezpečil.',
    status: 'proposed',
    citations: [
      cite('07', 'Od poloviny srpna 2026 bolesti břicha v epigastriu a pravém podžebří'),
      cite('07', 'na přelomu srpna a září intermitentní teploty se zimnicí a tmavší moč'),
      cite('07', 'UZ provedené 29. 9. 2026 prokázalo ložisko hlavy pankreatu suspektní z malignity.'),
      cite('07', 'Termín CT se nám v dostupných pracovištích nepodařilo zajistit.'),
    ],
    sourceDate: '2026-10-02',
    note: 'Skrátené z epikrízy praktika (správa 07). Prosím, skontrolujte so zdrojom.',
  },
  {
    key: 'mdtQuestion', label: 'Otázka pre konzílium', group: 'Diagnóza',
    value: 'Dokončiť diagnostiku (CT brucha, histológia) a určiť ďalší postup. Praktik žiada urgentné riešenie.',
    status: 'confirmed',
    citations: [
      cite('07', 'Žádám o převzetí pacientky do péče KOC k dokončení diagnostiky (CT břicha, histologická verifikace) a stanovení dalšího postupu v rámci MDT.'),
      cite('07', 'Vzhledem k progresi obtíží a nezajištěnému termínu CT prosím o urgentní řešení.'),
    ],
    sourceDate: '2026-10-02',
  },
  // --- Anamnéza ---
  {
    key: 'comorbidities', label: 'Pridružené ochorenia', group: 'Anamnéza',
    value: 'Paroxyzmálna fibrilácia predsiení (od 2021, na antikoagulácii), vysoký krvný tlak, vysoký cholesterol, po odstránení maternice (2010).',
    status: 'confirmed',
    citations: [
      cite('07', 'paroxysmální fibrilace síní od r. 2021 na antikoagulaci'),
      cite('07', 'arteriální hypertenze, hypercholesterolémie, st. p. hysterektomii pro myomy (2010)'),
      cite('01', 'Stabilní stav, sinusový rytmus, bez recidivy fibrilace síní.'),
      cite('07', 'v r. 2019 po úmrtí manžela přechodně depresivní ladění, neléčena'),
    ],
    sourceDate: '2026-10-02',
    note: 'Kardiológ 20. 7. 2026: stabilný stav, bez návratu fibrilácie. V roku 2019 prechodne depresívne ladenie, neliečené.',
  },
  {
    key: 'medication', label: 'Lieky, ktoré užíva', group: 'Anamnéza',
    value: 'apixaban 5 mg 1-0-1, bisoprolol 5 mg 1-0-0, perindopril 4 mg 1-0-0, rosuvastatin 10 mg 0-0-1, paracetamol 500 mg pri bolesti (max. 4× denne)',
    status: 'conflict',
    citations: [
      cite('07', 'FA: apixaban 5 mg 1-0-1, bisoprolol 5 mg 1-0-0, perindopril 4 mg 1-0-0, rosuvastatin 10 mg 0-0-1, paracetamol 500 mg při bolesti max. 4× denně'),
      cite('01', 'vysadit apixaban 48 hodin předem, bez nutnosti překlenovací léčby'),
      cite('09', 'Při nekomplikovaném průběhu apixaban znovu od 21. 10. 2026 ráno.'),
    ],
    sourceDate: '2026-10-12',
    note: 'Pokyn kardiológa: pred výkonom s vysokým rizikom krvácania vysadiť apixaban 48 hodín vopred. Protokol biopsie: znovu nasadiť od 21. 10. ráno.',
    conflict: {
      a: { value: 'Biopsia bola 12. 10. 2026', citation: cite('09', 'Datum výkonu: 12. 10. 2026') },
      b: { value: 'Posledná dávka apixabanu 18. 10. 2026 večer', citation: cite('09', 'Apixaban vysazen 48 h před výkonem (poslední dávka 18. 10. 2026 večer).') },
      explain: 'Ten istý protokol uvádza výkon 12. 10. a poslednú dávku apixabanu až 18. 10., teda 6 dní po výkone. Jeden z dátumov je chybný. Kedy pacientka liek naozaj vysadila, treba overiť – rozhodne lekár.',
    },
  },
  {
    key: 'allergies', label: 'Alergie', group: 'Anamnéza', value: 'Alergie neguje', status: 'confirmed',
    citations: [cite('07', 'AA: neguje\nAbusus: nekuřačka, alkohol abstinentka')], sourceDate: '2026-10-02',
    note: 'Nefajčiarka, alkohol nepije.',
  },
  // --- Stav ---
  {
    key: 'performance', label: 'Výkonnostný stav (ECOG)', group: 'Stav', value: '', status: 'missing',
    citations: [],
    note: 'V žiadnej správe nie je ECOG ani Karnofského skóre. Slovo „sebestačná“ v žiadosti praktika nie je skóre, preto ho nedomýšľame.',
    request: {
      to: 'MUDr. Lenka Marková, onkologická ambulancia KOC 2',
      channel: 'NIS',
      draft: 'Dobrý deň, pani doktorka,\npripravujem podklad na konzílium 21. 10. 2026 pre pacientku Alenu Procházkovú (nar. 22. 7. 1963). V dostupných správach chýba výkonnostný stav (ECOG alebo Karnofského skóre). Mohli by ste ho, prosím, doplniť do 20. 10.?\nĎakujem,\nBc. Lucie Dvořáková, koordinátorka KOC 2',
    },
    resolvedBy: { docId: '14', value: 'ECOG 1', citation: cite('14', 'Stav výkonnosti: ECOG 1') },
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
    note: 'Úbytok 4 kg za mesiac (zo 69 na 65 kg). Váha je z 15. 9., novšie meranie zatiaľ nie je.',
  },
  {
    key: 'symptoms', label: 'Príznaky a ich začiatok', group: 'Stav',
    value: 'Od polovice augusta bolesti v nadbrušku a pod pravým rebrom; teraz bolesť vystreľuje do chrbta, horšia po jedle a v noci. Nechutenstvo, chudnutie, tmavý moč, 1. 9. žltkasté bielka očí. Teploty od septembra nemala.',
    status: 'confirmed',
    citations: [
      cite('07', 'Od poloviny srpna 2026 bolesti břicha v epigastriu a pravém podžebří'),
      cite('07', 'bolesti v epigastriu s propagací do zad přetrvávají, zhoršují se po jídle a v noci'),
      cite('07', 'Nechutenství, pokračující úbytek hmotnosti, moč nadále tmavší.'),
      cite('07', 'Při vyšetření 1. 9. 2026 febrilní (38,1 °C), se subikterem sklér.'),
      cite('07', 'Teploty od září neměla.'),
    ],
    sourceDate: '2026-10-02',
    note: 'Na paracetamole len čiastočná úľava. Sebestačná, t. č. práceneschopná.',
  },
  // --- Vyšetrenia ---
  {
    key: 'exams', label: 'Vykonané vyšetrenia', group: 'Vyšetrenia',
    value: 'Kardiológia 20. 7. · RTG hrudníka 3. 9. · gastroenterológ 15. 9. · ultrazvuk brucha 29. 9. · CT brucha a hrudníka 8. 10. (KOC 1) · biopsia EUS-FNB 12. 10. (KOC 2)',
    status: 'confirmed',
    citations: [
      cite('03', 'Bez známek zánětlivých změn plic.'),
      cite('06', 'Ložisková léze hlavy pankreatu suspektní z malignity s mírnou dilatací žlučových cest.'),
      cite('08', 'Tumor hlavy pankreatu 35 mm s venózním postižením VMS se zúžením lumen a s kontaktem s AMS.'),
      cite('08', 'Bez známek vzdálených metastáz.'),
      cite('09', 'Výkon: endosonografie s biopsií ložiska hlavy pankreatu (EUS-FNB)'),
    ],
    sourceDate: '2026-10-12',
    note: 'Dátum, miesto a typ každého vyšetrenia sú v časti Vyšetrenia, plné znenie po kliknutí v origináli správy. Veľkosť ložiska sa líši podľa metódy (UZ 34 × 30 mm, CT 35 × 31 mm, EUS 33 × 29 mm).',
  },
  // --- Laboratórium ---
  {
    key: 'labs', label: 'Laboratórium a nádorové markery', group: 'Laboratórium',
    value: '15. 10.: CA 19-9 312 kU/l (norma do 37), CA 125 48 kU/l (do 35), CEA 4,1 µg/l v norme. Bilirubín 23 µmol/l, hemoglobín 118 g/l.',
    status: 'confirmed',
    citations: [
      cite('10', 'CA 19-9\n312 H\nkU/l\n< 37'),
      cite('10', 'CA 125\n48 H\nkU/l\n< 35'),
      cite('10', 'CEA\n4,1\nµg/l\n< 5,0'),
      cite('10', 'Bilirubin celkový\n23 H\nµmol/l'),
      cite('10', 'Hemoglobin\n118 L\ng/l'),
    ],
    sourceDate: '2026-10-15',
    note: 'Dva odbery: 1. 9. (LabJih, cez praktika) a 15. 10. (KOC 2). Nádorové markery len 15. 10. Celá tabuľka je v časti Laboratórium.',
  },
  // --- Histológia ---
  {
    key: 'histology', label: 'Histológia (výsledok biopsie)', group: 'Histológia',
    value: 'Duktálny adenokarcinóm pankreasu, G2–G3, s perineurálnou inváziou', status: 'conflict',
    citations: [
      cite('11', 'Duktální adenokarcinom pankreatu, středně až málo diferencovaný (G2–G3), s perineurální invazí.'),
      cite('11', 'CK7 pozitivní, CK19 pozitivní, CK20 negativní, CDX2 negativní, SMAD4 exprese zachována.'),
      cite('09', 'Výsledek histologie do 3 pracovních dnů.'),
    ],
    sourceDate: '2026-10-19',
    note: 'Výsledok bol sľúbený do 3 pracovných dní (do 15. 10.), prišiel 19. 10.',
    conflict: {
      a: { value: 'Odber vzorky 20. 10. 2026', citation: cite('11', 'EUS-FNB 22G (odběr 20. 10. 2026)') },
      b: { value: 'Správa vydaná 19. 10. 2026', citation: cite('11', 'Datum vydání: 19. 10. 2026') },
      explain: 'Správa je vydaná deň pred uvedeným odberom. Biopsia podľa protokolu prebehla 12. 10. Jeden z dátumov je chybný – overte s patológiou, že výsledok patrí k tejto vzorke.',
    },
  },
  // --- Iné ---
  {
    key: 'other', label: 'Iné dôležité a želania pacientky', group: 'Iné',
    value: 'Pacientka vie o podozrení na nádor a súhlasí so zdieľaním informácií s dcérou. Je veľmi úzkostná a zle spí – praktik prosí o psychologickú podporu. Žije sama, dcéra býva v tej istej obci.',
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
    note: 'Praktik upozorňuje na liečbu apixabanom pred výkonmi.',
  },
];

/** Hodnoty, ktoré prišli až neskôr (po konzíliu). fieldsAsOf ich použije od dátumu `from`. */
export interface LaterValue {
  key: string;
  from: ISODate;            // receivedAt správy, ktorá hodnotu priniesla
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
      note: 'Váha 63 kg je zo správy algeziológa z 26. 10. – po konzíliu. K 21. 10. platilo 65 kg (15. 9.).',
    },
    {
      // Algeziológ 26. 10. nasadil novú liečbu bolesti (správa 12) – pole Lieky od toho dňa ukazuje novú verziu.
      key: 'medication', from: '2026-10-26',
      value: 'apixaban 5 mg 1-0-1, bisoprolol 5 mg 1-0-0, perindopril 4 mg 1-0-0, rosuvastatin 10 mg 0-0-1 (správa 07) · od 26. 10. liečba bolesti (správa 12): tramadol 100 mg 1-0-1, metamizol 500 mg 1-1-1, paracetamol 500 mg pri prielomovej bolesti najviac 3× denne, metoklopramid 10 mg pri nevoľnosti, laktulóza 15 ml 1× denne',
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
      note: 'Zmena 26. 10. (algeziológ, správa 12): nová liečba bolesti, paracetamol už najviac 3× denne (predtým 4×). Algeziológ upozorňuje: tramadol spolu s antidepresívami (SSRI, SNRI) zvyšuje riziko serotonínového syndrómu.',
    },
    {
      key: 'other', from: '2026-10-27',
      value: 'Pacientka si želá, aby informácie o liečbe dostávala aj dcéra a aby sa mohla zúčastniť dôležitých rozhovorov. Výrazná úzkosť a depresívna nálada – psychológ odporúča pokračovať v podpornej psychoterapii 1× týždenne.',
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
      note: 'Váha 73 kg je zo správy nutričnej ambulancie z 27. 10. – po konzíliu. K 22. 10. platilo 76 kg (7. 10.).',
    },
  ],
};

/**
 * Upozornenia, ktoré nesmú zapadnúť v riadkoch podkladu: pás v hlavičke prípadu (QA R5 #1, #9).
 * Len fakty zo správ, každé s doslovným citátom, žiadne odporúčanie liečby. `from` = doručenie správy, ktorá ho prináša.
 * kind 'forward' = varovanie lekárov, ktoré treba posunúť ďalej (karta na Prehľade + koncept správy, odoslanie simulované).
 */
export interface CaseAlert {
  id: string;
  from: ISODate;
  kind: 'safety' | 'forward';
  label: string;
  citations: Citation[];
  /** kind 'forward': to whom the warning goes (simulated), once the report naming the recipient (`needsDocId`) has arrived. */
  forward?: { button: string; to: string; channel: SourceDoc['channel']; needsDocId?: string; beforeNote?: string };
}
export const ALERTS: Record<string, CaseAlert[]> = {
  alena: [
    {
      id: 'apixaban', from: '2026-10-02', kind: 'safety', label: 'Antikoagulácia – apixaban',
      citations: [cite('07', 'Upozorňuji na antikoagulační léčbu apixabanem – před invazivními výkony nutné vysazení dle doporučení kardiologa.')],
    },
    {
      id: 'tramadol', from: '2026-10-26', kind: 'forward', label: 'Tramadol + antidepresíva: riziko serotonínového syndrómu',
      citations: [
        cite('12', 'Upozornění: tramadol zvyšuje riziko serotoninového syndromu v kombinaci s antidepresivy (SSRI, SNRI).'),
        cite('13', 'Pacientka užívá tramadol – při volbě antidepresiva zohlednit riziko serotoninového syndromu.'),
        cite('13', 'Psychiatrické vyšetření k zvážení farmakoterapie – objednána na 3. 11. 2026'),
      ],
      forward: {
        button: 'Pripraviť správu pre psychiatriu a praktika',
        to: 'Psychiatrická ambulancia KOC 2 · Nemocnica Lipová · kópia: MUDr. Tomáš Řezníček (praktik)',
        channel: 'NIS', needsDocId: '13',
        beforeNote: 'Správa 12 išla podľa textu v kópii aj praktikovi.',
      },
    },
  ],
  novak: [
    {
      id: 'contrast', from: '2026-10-07', kind: 'safety', label: 'Alergia na jódovú kontrastnú látku (iná správa uvádza „neguje“)',
      citations: [
        cite('N-05', 'Doporučeno zapsat do dokumentace alergii na jodovou kontrastní látku'),
        cite('N-08', 'Poznámka: CT část bez jodové kontrastní látky (alergie na jodovou kontrastní látku v anamnéze)'),
      ],
    },
    {
      id: 'rc', from: '2026-10-07', kind: 'safety', label: 'Laboratórium N-04 má iné rodné číslo – nepoužívať, kým sa neoverí',
      citations: [cite('N-04', 'RČ 660314/1234'), cite('N-09', 'Rodné číslo: 660314/1243')],
    },
  ],
};

const h = (state: StepState, date: ISODate) => ({ state, date });

const ALENA_STEPS: PathStep[] = [
  {
    id: 'ct', title: 'CT brucha a hrudníka (pankreatický protokol)', place: 'KOC 1 · Nemocnica Severní',
    owner: 'rádiológia KOC 1', due: '2026-10-08', state: 'delivered',
    history: [h('requested', '2026-10-02'), h('ordered', '2026-10-05'), h('done', '2026-10-08'), h('delivered', '2026-10-08')],
    resultDocId: '08',
  },
  {
    id: 'biopsy', title: 'Biopsia pod endosonografiou (EUS-FNB)', place: 'KOC 2 · Nemocnica Lipová – endoskopia',
    owner: 'endoskopia KOC 2', due: '2026-10-12', state: 'delivered',
    history: [h('requested', '2026-10-08'), h('ordered', '2026-10-08'), h('done', '2026-10-12'), h('delivered', '2026-10-12')],
    resultDocId: '09',
  },
  {
    id: 'labs', title: 'Kontrolné odbery a nádorové markery', place: 'KOC 2 · Nemocnica Lipová – laboratórium',
    owner: 'laboratórium KOC 2', due: '2026-10-15', state: 'delivered',
    history: [h('requested', '2026-10-12'), h('ordered', '2026-10-12'), h('done', '2026-10-15'), h('delivered', '2026-10-15')],
    resultDocId: '10',
  },
  {
    // Sľúbené „do 3 pracovních dnů“ od 12. 10. (pondelok) = 15. 10.; doručené 19. 10. → 4 dni po termíne.
    id: 'histology', title: 'Histológia (výsledok biopsie)', place: 'KOC 2 · Nemocnica Lipová – patológia',
    owner: 'patológia KOC 2', due: '2026-10-15', state: 'delivered',
    history: [h('requested', '2026-10-12'), h('ordered', '2026-10-12'), h('done', '2026-10-19'), h('delivered', '2026-10-19')],
    resultDocId: '11',
  },
  {
    id: 'mdt', title: 'Konzílium (MDT) pre nádory GIT', place: 'KOC 2 · Nemocnica Lipová',
    owner: 'ja (koordinátor) – podklad', due: '2026-10-21', state: 'ordered',
    history: [h('requested', '2026-10-08'), h('ordered', '2026-10-09'), h('done', '2026-10-21'), h('delivered', '2026-10-21')],
    resultDocId: 'MDT',
  },
  {
    id: 'pain', title: 'Algeziológ (liečba bolesti)', place: 'KOC 1 · Nemocnica Severní – centrum liečby bolesti',
    owner: 'centrum liečby bolesti KOC 1', due: '2026-10-26', state: 'ordered',
    history: [h('requested', '2026-10-08'), h('ordered', '2026-10-13'), h('done', '2026-10-26'), h('delivered', '2026-10-26')],
    resultDocId: '12',
  },
  {
    id: 'psych', title: 'Klinický psychológ', place: 'KOC 2 · Nemocnica Lipová – psychoonkológia',
    owner: 'psychoonkológia KOC 2', due: '2026-10-27', state: 'ordered',
    history: [h('requested', '2026-10-02'), h('ordered', '2026-10-14'), h('done', '2026-10-27'), h('delivered', '2026-10-27')],
    resultDocId: '13',
  },
];

const LAB_JIH = 'LabJih (odber cez praktika)';
const LAB_KOC = 'Laboratórium KOC 2 · Nemocnica Lipová';
const r02 = (test: string, value: string, unit: string, ref?: string, flag?: 'H' | 'L'): LabRow =>
  ({ test, value, unit, ref, flag, date: '2026-09-01', lab: LAB_JIH, docId: '02' });
const r10 = (test: string, value: string, unit: string, ref?: string, flag?: 'H' | 'L'): LabRow =>
  ({ test, value, unit, ref, flag, date: '2026-10-15', lab: LAB_KOC, docId: '10' });

const ALENA_LABS: LabRow[] = [
  // 15. 10. 2026 – KOC 2 (pred konzíliom; nádorové markery hore)
  r10('CA 19-9', '312', 'kU/l', '< 37', 'H'),
  r10('CA 125', '48', 'kU/l', '< 35', 'H'),
  r10('CEA', '4,1', 'µg/l', '< 5,0'),
  r10('Leukocyty', '8,9', '10⁹/l', '4,0–10,0'),
  r10('Erytrocyty', '3,98', '10¹²/l', '3,80–5,20'),
  r10('Hemoglobín', '118', 'g/l', '120–160', 'L'),
  r10('Hematokrit', '0,35', '', '0,35–0,47'),
  r10('MCV', '88', 'fl', '82–98'),
  r10('Trombocyty', '312', '10⁹/l', '150–400'),
  r10('Neutrofily', '68', '%', '45–70'),
  r10('Lymfocyty', '22', '%', '20–45'),
  r10('Sodík', '137', 'mmol/l', '136–145'),
  r10('Draslík', '4,1', 'mmol/l', '3,5–5,1'),
  r10('Vápnik', '2,31', 'mmol/l', '2,15–2,55'),
  r10('Urea', '4,6', 'mmol/l', '2,8–8,1'),
  r10('Kreatinín', '74', 'µmol/l', '45–84'),
  r10('eGFR (CKD-EPI)', '1,25', 'ml/s/1,73 m²', '> 1,0'),
  r10('Glukóza', '6,2', 'mmol/l', '3,9–5,6', 'H'),
  r10('Bilirubín celkový', '23', 'µmol/l', '2–17', 'H'),
  r10('Bilirubín konjugovaný', '6', 'µmol/l', '0–5', 'H'),
  r10('ALT', '1,62', 'µkat/l', '0,10–0,60', 'H'),
  r10('AST', '1,20', 'µkat/l', '0,10–0,60', 'H'),
  r10('GGT', '5,00', 'µkat/l', '0,10–0,70', 'H'),
  r10('ALP', '3,40', 'µkat/l', '0,58–1,75', 'H'),
  r10('Celková bielkovina', '66', 'g/l', '64–83'),
  r10('Albumín', '36', 'g/l', '35–52'),
  r10('CRP', '18', 'mg/l', '0–5', 'H'),
  // 1. 9. 2026 – LabJih (cez praktika)
  r02('Leukocyty', '12,8', '10⁹/l', '4,0–10,0', 'H'),
  r02('Erytrocyty', '4,21', '10¹²/l', '3,80–5,20'),
  r02('Hemoglobín', '124', 'g/l', '120–160'),
  r02('Hematokrit', '0,37', '', '0,35–0,47'),
  r02('Trombocyty', '298', '10⁹/l', '150–400'),
  r02('Neutrofily', '82', '%', '45–70', 'H'),
  r02('Lymfocyty', '12', '%', '20–45', 'L'),
  r02('Sodík', '136', 'mmol/l', '136–145'),
  r02('Draslík', '4,0', 'mmol/l', '3,5–5,1'),
  r02('Chloridy', '99', 'mmol/l', '98–107'),
  r02('Urea', '5,1', 'mmol/l', '2,8–8,1'),
  r02('Kreatinín', '78', 'µmol/l', '45–84'),
  r02('Glukóza', '6,4', 'mmol/l', '3,9–5,6', 'H'),
  r02('Bilirubín celkový', '38', 'µmol/l', '2–17', 'H'),
  r02('ALT', '1,92', 'µkat/l', '0,10–0,60', 'H'),
  r02('AST', '1,45', 'µkat/l', '0,10–0,60', 'H'),
  r02('GGT', '4,20', 'µkat/l', '0,10–0,70', 'H'),
  r02('ALP', '3,10', 'µkat/l', '0,58–1,75', 'H'),
  r02('Amyláza', '1,10', 'µkat/l', '0,47–1,67'),
  r02('Lipáza', '0,85', 'µkat/l', '0,22–1,00'),
  r02('CRP', '86', 'mg/l', '0–5', 'H'),
  r02('Moč – bilirubín', '++', '', 'neg.', 'H'),
  r02('Moč – bielkovina', '+', '', 'neg.', 'H'),
  r02('Moč – krv', '+', '', 'neg.', 'H'),
  r02('Moč – leukocyty', '++', '', 'neg.', 'H'),
  r02('Sediment – leukocyty', '65', '/µl', '0–10', 'H'),
  r02('Moč – kultivácia', 'Escherichia coli 10⁴ CFU/ml', '', 'hraničný nález'),
];

const ALENA_MEDS: Medication[] = [
  {
    name: 'apixaban', dose: '5 mg · 1-0-1 (ráno a večer)',
    note: 'Pred výkonom s vysokým rizikom krvácania vysadiť 48 h vopred (pokyn kardiológa).',
    citation: cite('07', 'apixaban 5 mg 1-0-1'),
  },
  { name: 'bisoprolol', dose: '5 mg · 1-0-0 (ráno)', citation: cite('07', 'bisoprolol 5 mg 1-0-0') },
  { name: 'perindopril', dose: '4 mg · 1-0-0 (ráno)', citation: cite('07', 'perindopril 4 mg 1-0-0') },
  { name: 'rosuvastatin', dose: '10 mg · 0-0-1 (večer)', citation: cite('07', 'rosuvastatin 10 mg 0-0-1') },
  {
    name: 'paracetamol', dose: '500 mg pri bolesti, najviac 4× denne',
    note: 'Podľa praktika len čiastočná úľava.',
    citation: cite('07', 'paracetamol 500 mg při bolesti max. 4× denně'),
  },
  // Správa 12 (algeziológ, 26. 10.) – po konzíliu; MedsCard ich ukáže až od dátumu doručenia.
  {
    name: 'tramadol', dose: '100 mg retard · 1-0-1 (od 26. 10.)',
    note: 'Algeziológ upozorňuje: s antidepresívami (SSRI, SNRI) vyššie riziko serotonínového syndrómu.',
    citation: cite('12', 'tramadol tbl. ret. 100 mg 1-0-1'),
  },
  { name: 'metamizol', dose: '500 mg · 1-1-1 (od 26. 10.)', citation: cite('12', 'metamizol 500 mg 1-1-1') },
  {
    name: 'paracetamol', dose: '500 mg pri prielomovej bolesti, najviac 3× denne (od 26. 10.)',
    note: 'Zmena oproti správe 07 (tam najviac 4× denne).',
    citation: cite('12', 'paracetamol 500 mg při průlomové bolesti, max. 3× denně'),
  },
  { name: 'metoklopramid', dose: '10 mg pri nevoľnosti, najviac 3× denne (od 26. 10.)', citation: cite('12', 'metoklopramid 10 mg při nauzee, max. 3× denně') },
  { name: 'laktulóza', dose: 'sirup 15 ml · 1× denne (od 26. 10.)', citation: cite('12', 'laktulóza sirup 15 ml 1× denně jako prevence obstipace') },
];

const ALENA_EXAMS: Exam[] = [
  { date: '2026-07-20', place: 'Kardiologická ambulancia Jesenice', type: 'Kardiologická kontrola', summary: 'Stabilný stav, sínusový rytmus, bez návratu fibrilácie predsiení. Ejekčná frakcia ľavej komory 60 %. Pred výkonom s vysokým rizikom krvácania vysadiť apixaban 48 hodín vopred.', docId: '01' },
  { date: '2026-09-01', place: 'Ordinácia praktického lekára, Dolní Břežany', type: 'Vyšetrenie u praktického lekára', summary: 'Teploty, bolesti v nadbrušku, žltkasté bielka. Podozrenie na infekciu močových alebo žlčových ciest, cholestáza. Liečba ciprofloxacínom 7 dní, odoslaná ku gastroenterológovi.', docId: '04' },
  { date: '2026-09-03', place: 'Radiologické centrum Modřany', type: 'RTG hrudníka', summary: 'Bez známok zápalu pľúc. Primeraný nález na srdci a pľúcach.', docId: '03' },
  { date: '2026-09-15', place: 'Poliklinika Jižní – gastroenterológia', type: 'Gastroenterologické vyšetrenie', summary: 'Cholestáza, bolesti v nadbrušku vystreľujúce do chrbta, úbytok 4 kg za mesiac. Odporučený ultrazvuk brucha, podľa výsledku CT alebo EUS.', docId: '05' },
  { date: '2026-09-29', place: 'Poliklinika Jižní – rádiológia', type: 'Ultrazvuk brucha', summary: 'Ložisko v hlave pankreasu 34 × 30 mm podozrivé z nádoru, mierne rozšírené žlčové cesty. Odporučené CT podľa pankreatického protokolu, prípadne EUS.', docId: '06' },
  { date: '2026-10-08', place: 'KOC 1 · Nemocnica Severní – rádiológia', type: 'CT brucha a hrudníka (pankreatický protokol)', summary: 'Nádor hlavy pankreasu 35 mm, postihuje žilu VMS so zúžením a dotýka sa tepny AMS. Podozrivá uzlina pri pankrease. Bez známok vzdialených metastáz.', docId: '08' },
  { date: '2026-10-12', place: 'KOC 2 · Nemocnica Lipová – endoskopia', type: 'Biopsia pod endosonografiou (EUS-FNB)', summary: 'Ložisko 33 × 29 mm, 3 vpichy, vzorky odoslané na histológiu, bez komplikácií. Výsledok histológie do 3 pracovných dní.', docId: '09' },
  { date: '2026-10-19', place: 'KOC 2 · Nemocnica Lipová – patológia', type: 'Histológia', summary: 'Duktálny adenokarcinóm pankreasu, stredne až málo diferencovaný (G2–G3), s perineurálnou inváziou.', docId: '11' },
  { date: '2026-10-26', place: 'KOC 1 · Nemocnica Severní – centrum liečby bolesti', type: 'Algeziologické vyšetrenie', summary: 'Bolesť v pokoji 6/10, po jedle a v noci 8/10, paracetamol nestačí. Nasadená nová liečba bolesti, kontrola o 14 dní. Váha 63 kg.', docId: '12' },
  { date: '2026-10-27', place: 'KOC 2 · Nemocnica Lipová – psychoonkológia', type: 'Klinický psychológ', summary: 'Zmiešaná úzkostno-depresívna porucha v reakcii na ochorenie. Psychiatria objednaná na 3. 11., psychoterapia raz týždenne. Pacientka si želá, aby informácie dostávala aj dcéra.', docId: '13' },
];

const ALENA_LOG: LogEntry[] = [
  { date: '2026-10-02', time: '08:40', action: 'Prevzatá žiadosť praktika', detail: 'Cez eZprávu prišla epikríza MUDr. Řezníčka (správa 07). Založený prípad, spustené hodiny cesty.', billable: true },
  { date: '2026-10-02', time: '08:55', action: 'Potvrdenie prijatia praktikovi', detail: 'Potvrdenie so zoznamom toho, čo chýba: výsledky vyšetrení, ECOG, váha, e-mail.', billable: true },
  { date: '2026-10-02', time: '09:30', action: 'Vyžiadané správy 01–06', detail: 'Kardiológia Jesenice, LabJih, RC Modřany, praktik (epikríza zo 4. 9.), Poliklinika Jižní (gastroenterológia, ultrazvuk).', billable: true },
  { date: '2026-10-02', time: '10:10', action: 'Vyžiadané CT v KOC 1', detail: 'V KOC 2 nebol voľný termín. Žiadosť o CT brucha a hrudníka podľa pankreatického protokolu do Nemocnice Severní.', billable: true },
  { date: '2026-10-02', time: '10:30', action: 'Vyžiadaný klinický psychológ', detail: 'Na prosbu praktika o psychologickú podporu (správa 07).', billable: true },
  { date: '2026-10-03', action: 'Doručené: laboratórium LabJih (02)', detail: 'Prišlo cez eZprávu.', billable: false },
  { date: '2026-10-05', time: '09:15', action: 'Objednané CT v KOC 1 na 8. 10.', detail: 'Termín potvrdila rádiológia KOC 1. Pacientke oznámený telefonicky.', billable: true },
  { date: '2026-10-05', time: '11:00', action: 'Doručené: správy 04, 05, 06', detail: 'Epikríza praktika e-mailom, gastroenterológ a ultrazvuk cez eZprávu.', billable: false },
  { date: '2026-10-05', time: '14:20', action: 'Urgencia: kardiológia Jesenice', detail: 'Telefonát – správa z 20. 7. ešte neprišla.', billable: true },
  { date: '2026-10-06', action: 'Doručené: správy 01 a 03', detail: 'Kardiológia e-mailom, RTG hrudníka poštou (naskenované).', billable: false },
  { date: '2026-10-08', time: '13:00', action: 'Doručené: CT z KOC 1 (08)', detail: 'Snímky aj popis cez ePACS.', billable: false },
  { date: '2026-10-08', time: '14:00', action: 'Objednaná biopsia EUS-FNB na 12. 10.', detail: 'Endoskopia KOC 2. Pacientke oznámený termín a príprava podľa pokynov lekára.', billable: true },
  { date: '2026-10-08', time: '14:30', action: 'Vyžiadaný algeziológ', detail: 'Bolesti napriek paracetamolu (správa 07).', billable: true },
  { date: '2026-10-09', time: '10:00', action: 'Prípad zaradený na konzílium 21. 10.', detail: 'MDT pre nádory GIT, KOC 2 · Nemocnica Lipová.', billable: true },
  { date: '2026-10-12', time: '13:30', action: 'Biopsia vykonaná (09)', detail: 'Protokol v NIS. Histológia sľúbená do 3 pracovných dní, teda do 15. 10. Objednané kontrolné odbery na 15. 10.', billable: true },
  { date: '2026-10-13', time: '09:40', action: 'Objednaný algeziológ na 26. 10.', detail: 'Centrum liečby bolesti, KOC 1 · Nemocnica Severní.', billable: true },
  { date: '2026-10-14', time: '11:10', action: 'Objednaný klinický psychológ na 27. 10.', detail: 'Psychoonkologická ambulancia KOC 2.', billable: true },
  { date: '2026-10-15', action: 'Doručené: kontrolné odbery (10)', detail: 'Vrátane nádorových markerov CA 19-9, CEA a CA 125.', billable: false },
  { date: '2026-10-16', time: '09:00', action: 'Urgencia: histológia po termíne', detail: 'Výsledok mal prísť do 15. 10. Telefonát na Ústav patológie KOC 2.', billable: true },
  { date: '2026-10-19', time: '12:40', action: 'Doručená histológia (11) – 4 dni po termíne', detail: 'Rozpor v dátumoch: vydané 19. 10., odber uvedený 20. 10. Poslané patológii na overenie.', billable: true },
  { date: '2026-10-21', time: '14:00', action: 'Konzílium prebehlo', detail: 'Zápis z konzília uložený do prípadu.', billable: true },
  { date: '2026-10-21', time: '16:40', action: 'Záver odoslaný praktikovi', detail: 'eZpráva, zapečatené nemocnicou; doručené 16:41 (v prototype simulované).', billable: true },
  { date: '2026-10-21', time: '16:45', action: 'Súhrn pre revízneho lekára ZP MV ČR (211)', detail: 'Diagnóza, rozhodnutie konzília, plánovaná liečba (v prototype simulované).', billable: true },
  { date: '2026-10-22', time: '08:15', action: 'Praktik potvrdil doručenie záveru', detail: 'Doručenka (v prototype simulované).', billable: false },
  { date: '2026-10-26', action: 'Doručené: algeziológ (12)', detail: 'Prišlo cez eZprávu.', billable: false },
  { date: '2026-10-27', action: 'Doručené: klinický psychológ (13)', detail: 'Zápis v NIS.', billable: false },
];

const ALENA: Case = {
  id: 'alena',
  demo: 'full',
  patient: {
    firstName: 'Alena', lastName: 'Procházková', age: 63, sex: 'žena',
    insurerCode: '211', insurerName: 'Zdravotní pojišťovna ministerstva vnitra ČR',
    phone: '+420 777 000 541',
    contact: { name: 'Petra Horká', relation: 'dcéra', phone: '+420 777 000 542' },
  },
  // E-mail praktika v podkladoch nie je (zámerne bez `email`).
  referringGp: {
    name: 'MUDr. Tomáš Řezníček',
    practice: 'Praktický lekár pre dospelých, Na Návsi 3, 252 41 Dolní Břežany',
    phone: '+420 311 000 287',
  },
  diagnosisShort: 'nádor hlavy pankreasu (C25.0)',
  koc: 'KOC 2 · Nemocnica Lipová',
  mdtDate: '2026-10-21',
  receivedAt: '2026-10-02',
  status: 'active',
  nextStep: { text: 'Doplniť výkonnostný stav (ECOG) do podkladu na konzílium', owner: 'ja (koordinátor)', due: '2026-10-20', mine: true },
  clockTargetDays: 33, // dánsky vzor pre pankreas: 6 dní do prvej návštevy + 27 dní vyšetrovanie
  fields: ALENA_FIELDS,
  steps: ALENA_STEPS,
  labs: ALENA_LABS,
  meds: ALENA_MEDS,
  exams: ALENA_EXAMS,
  docs: ALENA_DOCS,
  log: ALENA_LOG,
  precheck: {
    findings: [
      { text: 'Chýbajú výsledky 5 vyšetrení, ktoré žiadosť vymenúva (kardiológ 20. 7., laboratórium 1. 9., RTG 3. 9., gastroenterológ 15. 9., ultrazvuk 29. 9.). Podľa žiadosti sú na jednotlivých pracoviskách.', severity: 'missing' },
      { text: 'Chýba výkonnostný stav pacientky (ECOG alebo Karnofského skóre).', severity: 'missing' },
      { text: 'Chýba aktuálna váha a výška – v žiadosti je len „pokračujúci úbytok hmotnosti“.', severity: 'missing' },
      { text: 'E-mail pacientky nie je uvedený (na vedomie, nie je to chyba).', severity: 'info' },
      { text: 'E-mail praktika nie je uvedený, je len telefón (na vedomie – záver ide cez eZprávu).', severity: 'info' },
      { text: 'Telefón pacientky a kontakt na dcéru sú uvedené. Pacientka súhlasí so zdieľaním informácií s dcérou.', severity: 'info' },
      { text: 'Termín CT sa praktikovi nepodarilo zabezpečiť – žiada urgentné riešenie.', severity: 'info' },
      { text: 'Pacientka užíva apixaban – praktik upozorňuje na vysadenie pred výkonmi podľa kardiológa.', severity: 'info' },
      { text: 'Poisťovňa 211 (ZP MV ČR), nie VZP.', severity: 'info' },
    ],
  },
  gpReport: {
    question: 'Žádám o převzetí pacientky do péče KOC k dokončení diagnostiky (CT břicha, histologická verifikace) a stanovení dalšího postupu v rámci MDT.',
    answer: 'Biopsia potvrdila nádor hlavy pankreasu (duktálny adenokarcinóm, G2–G3). Na CT nádor zasahuje do ciev, je podozrivá regionálna uzlina, bez známok vzdialených metastáz. Konzílium ho hodnotí ako hranične resekabilný (hranične operovateľný) a odporúča najprv chemoterapiu, potom nové CT a opätovné posúdenie operácie.',
    forYou: [
      'Konzílium odporúča najprv chemoterapiu (neoadjuvantnú). Ďalší krok: termín na onkologickom konzíliu 4. 11. 2026 o 10:30 (MUDr. Kalous). Pred začiatkom liečby konzílium žiada určiť ECOG, doplniť krvné testy a CA 19-9 a posúdiť žlčové cesty. Termíny zariadi koordinátorka KOC, Bc. Lucie Dvořáková.',
      'Apixaban: pacientka ho nemá vysadzovať sama. Postup pred každým výkonom určí lekár, ktorý výkon robí.',
      'Čo sledovať: horúčka, zimnica, pribúdajúca žltačka alebo zhoršenie celkového stavu – vtedy neodkladné vyšetrenie. Drenáž žlčových ciest zatiaľ v správach nie je.',
      'Bolesť, výživa, psychika: konzílium odporúča nutričnú podporu, úpravu liečby bolesti a psychoonkologickú podporu. Vašu prosbu o psychológa sme vybavili – termín 27. 10.',
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
    note: 'Pacientka nie je poistenkyňa VZP. Prezentácia VZP chce, aby informáciu dostal aj revízny lekár; pri tejto pacientke by to bol revízny lekár ZP MV ČR (211). Kanál v ČR nemáme overený, odoslanie je v prototype simulované.',
  },
};

// ---------------------------------------------------------------------------------------------
// Ľahké fiktívne prípady do fronty (demo 'light'). Vymyslené len pre demo, iné mená a diagnózy.
// ---------------------------------------------------------------------------------------------

const KUCERA: Case = {
  id: 'kucera',
  demo: 'light',
  patient: {
    firstName: 'Jaroslav', lastName: 'Kučera', age: 67, sex: 'muž',
    insurerCode: '111', insurerName: 'Všeobecná zdravotní pojišťovna ČR', phone: '+420 777 000 611',
  },
  referringGp: { name: 'MUDr. Jana Sedláčková', practice: 'Praktický lekár pre dospelých, Říčany', phone: '+420 311 000 611' },
  diagnosisShort: 'podozrenie na nádor pľúc',
  koc: 'KOC 2 · Nemocnica Lipová',
  // Žiadosť ešte nie je prevzatá: bez termínu konzília a bez vyžiadaných krokov.
  receivedAt: '2026-10-19',
  status: 'new',
  nextStep: { text: 'Prevziať žiadosť praktika a vyžiadať CT hrudníka a brucha', owner: 'ja (koordinátor)', due: '2026-10-19', mine: true },
  clockTargetDays: 33, // predvolená lehota (dánsky vzor); v praxi sa nastaví podľa diagnózy
  fields: [],
  steps: [],
  labs: [],
  meds: [],
  exams: [],
  docs: [
    {
      id: 'K-01', title: 'Žiadosť praktika o prevzatie do KOC', place: 'Praktický lekár, Říčany', kind: 'request',
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
    { date: '2026-10-19', time: '07:50', action: 'Nová žiadosť praktika', detail: 'Prišla e-mailom, čaká na prevzatie.', billable: false },
  ],
};

const POSPISILOVA: Case = {
  id: 'pospisilova',
  demo: 'light',
  patient: {
    firstName: 'Zdeňka', lastName: 'Pospíšilová', age: 58, sex: 'žena',
    insurerCode: '201', insurerName: 'Vojenská zdravotní pojišťovna ČR', phone: '+420 777 000 621',
  },
  referringGp: { name: 'MUDr. Karel Novotný', practice: 'Praktický lekár pre dospelých, Benešov', phone: '+420 311 000 621' },
  diagnosisShort: 'podozrenie na nádor hrubého čreva',
  koc: 'KOC 2 · Nemocnica Lipová',
  receivedAt: '2026-10-09',
  status: 'active',
  // Ilustračná eskalácia vo fronte (QA R1 #8): histológia sľúbená do 2 pracovných dní (16. 10.) k 19. 10. neprišla.
  nextStep: { text: 'Urgovať histológiu z kolonoskopie (mala prísť do 16. 10.)', owner: 'ja (koordinátor)', due: '2026-10-19', mine: true },
  clockTargetDays: 33, // predvolená lehota (dánsky vzor); v praxi sa nastaví podľa diagnózy
  fields: [],
  steps: [
    {
      id: 'colonoscopy', title: 'Kolonoskopia s biopsiou', place: 'KOC 2 · Nemocnica Lipová – endoskopia',
      owner: 'endoskopia KOC 2', due: '2026-10-14', state: 'delivered',
      history: [h('requested', '2026-10-09'), h('ordered', '2026-10-12'), h('done', '2026-10-14'), h('delivered', '2026-10-14')],
      resultDocId: 'P-02',
    },
    {
      id: 'histology', title: 'Histológia z kolonoskopie', place: 'KOC 2 · Nemocnica Lipová – patológia',
      owner: 'patológia KOC 2', due: '2026-10-16', state: 'ordered',
      history: [h('requested', '2026-10-14'), h('ordered', '2026-10-14')],
    },
    {
      id: 'ct', title: 'CT hrudníka a brucha', place: 'KOC 1 · Nemocnica Severní',
      owner: 'rádiológia KOC 1', due: '2026-10-23', state: 'ordered',
      history: [h('requested', '2026-10-14'), h('ordered', '2026-10-15')],
    },
  ],
  labs: [],
  meds: [],
  exams: [],
  docs: [
    {
      id: 'P-01', title: 'Žiadosť praktika o prevzatie do KOC', place: 'Praktický lekár, Benešov', kind: 'request',
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
      id: 'P-02', title: 'Kolonoskopia s biopsiou', place: 'KOC 2 · Nemocnica Lipová – endoskopia', kind: 'report',
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
    { date: '2026-10-09', time: '10:20', action: 'Prevzatá žiadosť praktika', detail: 'Prišla cez eZprávu. Potvrdenie prijatia odoslané.', billable: true },
    { date: '2026-10-12', time: '08:30', action: 'Objednaná kolonoskopia na 14. 10.', detail: 'Endoskopia KOC 2.', billable: true },
    { date: '2026-10-14', action: 'Doručené: kolonoskopia (P-02)', detail: 'Histológia sľúbená do 2 pracovných dní, teda do 16. 10.', billable: false },
    { date: '2026-10-15', time: '09:00', action: 'Objednané CT v KOC 1 na 23. 10.', detail: 'V KOC 2 nebol skorší termín.', billable: true },
  ],
};

const KRALOVA: Case = {
  id: 'kralova',
  demo: 'light',
  patient: {
    firstName: 'Eva', lastName: 'Králová', age: 52, sex: 'žena',
    insurerCode: '207', insurerName: 'Oborová zdravotní pojišťovna zaměstnanců bank, pojišťoven a stavebnictví', phone: '+420 777 000 631',
  },
  referringGp: { name: 'MUDr. Petra Šťastná', practice: 'Mamologická ambulancia, Kolín', phone: '+420 311 000 631' },
  diagnosisShort: 'podozrenie na nádor prsníka',
  koc: 'KOC 2 · Nemocnica Lipová',
  mdtDate: '2026-11-02',
  receivedAt: '2026-10-05',
  status: 'postponed',
  nextStep: { text: 'Biopsia presunutá na žiadosť pacientky na 26. 10.', owner: 'pacientka', due: '2026-10-26', mine: false },
  clockTargetDays: 33, // predvolená lehota (dánsky vzor); v praxi sa nastaví podľa diagnózy
  fields: [],
  steps: [
    {
      id: 'biopsy', title: 'Biopsia prsníka pod ultrazvukom', place: 'KOC 2 · Nemocnica Lipová – mamológia',
      owner: 'pacientka (presun termínu)', due: '2026-10-26', state: 'ordered',
      history: [h('requested', '2026-10-05'), h('ordered', '2026-10-07')],
    },
  ],
  labs: [],
  meds: [],
  exams: [],
  docs: [
    {
      id: 'R-01', title: 'Žiadosť o prevzatie do KOC', place: 'Mamologická ambulancia, Kolín', kind: 'request',
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
    { date: '2026-10-05', time: '13:00', action: 'Prevzatá žiadosť', detail: 'Prišla e-mailom. Potvrdenie prijatia odoslané.', billable: true },
    { date: '2026-10-07', time: '10:45', action: 'Objednaná biopsia na 14. 10.', detail: 'Mamológia KOC 2.', billable: true },
    { date: '2026-10-12', time: '15:30', action: 'Biopsia presunutá na 26. 10.', detail: 'Pacientka telefonicky požiadala o neskorší termín z rodinných dôvodov.', billable: true },
  ],
};

// Alena musí ostať PRVÁ (fullCase()/findCase() berú prvý prípad s demo 'full').
export const CASES: Case[] = [ALENA, NOVAK, KUCERA, POSPISILOVA, KRALOVA];

/**
 * Pôvod údajov prípadu: Alena = ručne pripravené a overené tímom; Josef Novák = strojové vyťaženie
 * (pravidlá + jazykový model, predpočítané), každé pole len navrhnuté – potvrdzuje človek.
 * fieldOrigin hovorí, kto navrhol hodnotu poľa ('rules' | 'ai' | 'manual').
 */
export const CASE_AI: Record<string, CaseAi> = {
  alena: {
    label: 'ručne overené', mode: 'manual', evalFile: 'data/eval-alena.json',
    fieldOrigin: Object.fromEntries(ALENA_FIELDS.map((f) => [f.key, 'manual' as FieldOrigin])),
  },
  novak: NOVAK_AI,
};

// Dopredná kompatibilita s QA R4 (b1): ak types.ts dostane Case.ai a HandoverField.origin, hodnoty už sú v dátach.
for (const c of CASES) {
  const ai = CASE_AI[c.id];
  if (!ai) continue;
  const { fieldOrigin, ...meta } = ai;
  Object.assign(c, { ai: meta });
  for (const f of c.fields) if (fieldOrigin?.[f.key]) Object.assign(f, { origin: fieldOrigin[f.key] });
}

// ---------------------------------------------------------------------------------------------
// Pomôcky pre „stav k dátumu“ (čisté funkcie, bez Reactu)
// ---------------------------------------------------------------------------------------------

export function getCase(id: string): Case | undefined {
  return CASES.find((c) => c.id === id);
}

/** Dokumenty, ktoré mal koordinátor k dátumu asOf (podľa receivedAt). */
export function docsAsOf(c: Case, asOf: ISODate): SourceDoc[] {
  return c.docs.filter((d) => d.receivedAt <= asOf);
}

/** Stav kroku k dátumu (posledný záznam histórie s dátumom ≤ asOf); null = ešte nevyžiadané. */
export function stepStateAsOf(step: PathStep, asOf: ISODate): StepState | null {
  let s: StepState | null = null;
  for (const e of step.history) if (e.date <= asOf) s = e.state;
  return s;
}

const DAY = 86_400_000;
const days = (from: ISODate, to: ISODate) => Math.round((Date.parse(to) - Date.parse(from)) / DAY);

/** O koľko dní krok mešká k dátumu asOf (0 = v termíne). Doručený krok = meškanie pri doručení. */
export function stepDelayDays(step: PathStep, asOf: ISODate): number {
  const delivered = step.history.find((e) => e.state === 'delivered' && e.date <= asOf);
  return Math.max(0, days(step.due, delivered ? delivered.date : asOf));
}

const SENTENCE_END = /[.!?]\s+(?=[A-ZÁÄČĎÉÍĹĽŇÓÔŔŠŤÚÝŽ])/g;
/** Removes the sentence that contains `token` ("Skôr: 78 kg (3. 9. 2026). Novšia hodnota 73 kg …" → "Skôr: 78 kg (3. 9. 2026)."). */
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
 * Podklad k dátumu asOf: použije neskoršie hodnoty (LATER_VALUES), skryje citáty zo správ,
 * ktoré ešte neprišli, a pole bez doručeného zdroja označí ako chýbajúce.
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
      return { ...f, value: '', status: 'missing', citations: [], conflict: undefined, sourceDate: undefined, note: 'K tomuto dátumu ešte neprišla správa, z ktorej sa údaj berie.' };
    }
    const sourceDate = citations.map((x) => doc.get(x.docId)?.examDate ?? '').sort().pop();
    return { ...f, citations, sourceDate: sourceDate || f.sourceDate };
  });
}
