// GENEROVANÉ: node scripts/build-pacient2.mjs – NEUPRAVOVAŤ RUČNE.
// Namerané čísla z public/data/eval-alena.json, public/data/eval-pacient-2.json a public/data/vysledok-test-halucinacii.json. Žiadne čísla napevno.

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

export const EVAL_SUMMARY: EvalSummary = {
 "cases": [
  {
   "caseId": "alena",
   "evalCaseId": "alena",
   "patient": "Alena P.",
   "topic": "pankreas",
   "file": "data/eval-alena.json",
   "measuredAt": "2026-10-17T03:40:32.470Z",
   "extraction": {
    "mode": "rules+llm",
    "model": "náhradní model bez Azure klíče – odpověď z Claude Code na přesně tento prompt (cílově Azure OpenAI v EU)",
    "generatedAt": "2026-10-17T03:40:32.289Z",
    "promptVersion": "handover-v1"
   },
   "appShows": "manual",
   "inSync": true,
   "fieldsCorrect": 20,
   "fieldsTotal": 20,
   "trapsCaught": 17,
   "trapsTotal": 17,
   "inventedValues": 0,
   "fieldsWithoutVerifiedCitation": 0,
   "citationsVerified": 73,
   "citationsTotal": 73,
   "goldIntegrity": true,
   "headline": "Kontrolní sada: 20/20 položek správně · 17/17 pastí zachyceno · 0 vymyšlených hodnot · 73/73 citací doslova ve zprávách",
   "traps": [
    {
     "id": "ecog-missing",
     "title": "Chýba výkonnostný stav (ECOG/Karnofsky)",
     "caught": true
    },
    {
     "id": "apixaban-impossible-date",
     "title": "Nemožný dátum poslednej dávky apixabanu (správa 09)",
     "caught": true
    },
    {
     "id": "histology-issued-before-sampling",
     "title": "Histológia „vydaná“ pred „odberom“ (správa 11)",
     "caught": true
    },
    {
     "id": "weight-63-after-mdt",
     "title": "Váha 63 kg vznikla až po konzíliu (správa 12)",
     "caught": true
    },
    {
     "id": "patient-email-missing",
     "title": "Chýba e-mail pacientky",
     "caught": true
    },
    {
     "id": "gp-email-missing",
     "title": "Chýba e-mail odosielajúceho lekára",
     "caught": true
    },
    {
     "id": "all-tumor-markers",
     "title": "Všetky onkomarkery, nielen zvýšené",
     "caught": true
    },
    {
     "id": "post-mdt-reports-excluded",
     "title": "Správy 12 a 13 sú až po konzíliu",
     "caught": true
    },
    {
     "id": "insurer-211-not-vzp",
     "title": "Poisťovňa 211, nie VZP",
     "caught": true
    },
    {
     "id": "planned-control-without-report",
     "title": "Plánovaná kontrola 9. 9. bez správy",
     "caught": true
    },
    {
     "id": "results-not-attached",
     "title": "Žiadanka neobsahuje výsledky, len kde sú",
     "caught": true
    },
    {
     "id": "medication-latest-list",
     "title": "Najnovší zoznam liekov (aj paracetamol)",
     "caught": true
    },
    {
     "id": "tumor-size-not-a-conflict",
     "title": "Rôzne rozmery nádoru nie sú rozpor",
     "caught": true
    },
    {
     "id": "mdt-question-general",
     "title": "Otázka na konzílium je všeobecná",
     "caught": true
    },
    {
     "id": "anticoagulation-before-procedure",
     "title": "Antikoagulácia pred invazívnym výkonom",
     "caught": true
    },
    {
     "id": "daughter-consent-before-mdt",
     "title": "Súhlas so zdieľaním s dcérou je už v žiadanke",
     "caught": true
    },
    {
     "id": "ct-from-other-koc",
     "title": "CT z iného KOC sa nestratí",
     "caught": true
    }
   ]
  },
  {
   "caseId": "novak",
   "evalCaseId": "pacient-2",
   "patient": "Josef N.",
   "topic": "plíce",
   "file": "data/eval-pacient-2.json",
   "measuredAt": "2026-10-17T03:40:32.873Z",
   "extraction": {
    "mode": "rules+llm",
    "model": "náhradní model bez Azure klíče – odpověď z Claude Code na přesně tento prompt (cílově Azure OpenAI v EU)",
    "generatedAt": "2026-10-17T03:40:32.718Z",
    "promptVersion": "handover-v1"
   },
   "appShows": "this-extraction",
   "inSync": true,
   "fieldsCorrect": 20,
   "fieldsTotal": 20,
   "trapsCaught": 13,
   "trapsTotal": 13,
   "inventedValues": 0,
   "fieldsWithoutVerifiedCitation": 0,
   "citationsVerified": 49,
   "citationsTotal": 49,
   "goldIntegrity": true,
   "headline": "Kontrolní sada: 20/20 položek správně · 13/13 pastí zachyceno · 0 vymyšlených hodnot · 49/49 citací doslova ve zprávách",
   "traps": [
    {
     "id": "side-conflict",
     "title": "Strana nádoru: bronchoskopia píše ľavý lalok, ostatné pravý",
     "caught": true
    },
    {
     "id": "allergy-lost-in-referral",
     "title": "Alergia na kontrastnú látku sa v žiadanke stratila",
     "caught": true
    },
    {
     "id": "birth-number-mismatch",
     "title": "Laboratórium má iné rodné číslo",
     "caught": true
    },
    {
     "id": "predictive-markers-pending",
     "title": "Prediktívne markery (EGFR, ALK, ROS1, PD-L1) neprišli",
     "caught": true
    },
    {
     "id": "weight-73-after-mdt",
     "title": "Váha 73 kg je až po konzíliu (správa 10)",
     "caught": true
    },
    {
     "id": "all-tumor-markers",
     "title": "Všetky onkomarkery, aj normálny NSE",
     "caught": true
    },
    {
     "id": "no-false-alarm-email",
     "title": "Bez falošného poplachu: e-maily sú uvedené",
     "caught": true
    },
    {
     "id": "no-false-alarm-ecog",
     "title": "Bez falošného poplachu: ECOG je v správe pneumológa",
     "caught": true
    },
    {
     "id": "no-false-alarm-planned-lab",
     "title": "Bez falošného poplachu: plánovaný odber nie je nemožný dátum",
     "caught": true
    },
    {
     "id": "mdt-question-specific",
     "title": "Otázka na konzílium je konkrétna",
     "caught": true
    },
    {
     "id": "insurer-vzp",
     "title": "Poisťovňa 111 = VZP",
     "caught": true
    },
    {
     "id": "post-mdt-report-excluded",
     "title": "Nutričná správa (27. 10.) je až po konzíliu",
     "caught": true
    },
    {
     "id": "pet-from-other-koc",
     "title": "PET/CT z iného KOC sa nestratí",
     "caught": true
    }
   ]
  }
 ],
 "total": {
  "cases": 2,
  "fieldsCorrect": 40,
  "fieldsTotal": 40,
  "trapsCaught": 30,
  "trapsTotal": 30,
  "inventedValues": 0,
  "fieldsWithoutVerifiedCitation": 0,
  "citationsVerified": 122,
  "citationsTotal": 122,
  "allGoldIntact": true,
  "allInSync": true
 },
 "hallucinationTest": {
  "file": "public/data/vysledok-test-halucinacii.json",
  "what": "Test poistky: úmyselne chybná AI odpoveď (eval/llm-fixtures/halucinujuci-model-alena.json) prešla celým vyťažením.",
  "generatedAt": "2026-10-17T00:01:38+00:00",
  "aiProposals": 5,
  "accepted": 1,
  "rejected": 4,
  "after": {
   "fieldsCorrect": 20,
   "fieldsTotal": 20,
   "inventedValues": 0
  },
  "fields": [
   {
    "field": "diagnosis",
    "label": "Diagnóza",
    "aiValue": "Duktální adenokarcinom hlavy pankreatu, stadium T3N1M0 (C25.0).",
    "accepted": false,
    "reason": "AI návrh zamietnutý: čísla bez opory v citáte: 1, 0, 25,0 – použitý text priamo zo správy"
   },
   {
    "field": "epicrisis",
    "label": "Průběh onemocnění ve zkratce",
    "aiValue": "63letá pacientka se 3 měsíce trvajícími bolestmi břicha a úbytkem hmotnosti 8 kg.",
    "accepted": false,
    "reason": "AI návrh zamietnutý: čísla bez opory v citáte: 3, 8 – použitý text priamo zo správy"
   },
   {
    "field": "mdtQuestion",
    "label": "Otázka pro konzilium",
    "aiValue": "Převzetí do péče KOC k dokončení diagnostiky (CT břicha, histologická verifikace) a stanovení dalšího postupu v rámci MDT.",
    "accepted": true,
    "reason": "prijaté – citát aj čísla overené"
   },
   {
    "field": "symptoms",
    "label": "Příznaky a jejich začátek",
    "aiValue": "Klidová bolest NRS 6/10, průlomová bolest po jídle a v noci NRS 8/10.",
    "accepted": false,
    "reason": "AI návrh zamietnutý: žiadny overený citát – použitý text priamo zo správy"
   },
   {
    "field": "other",
    "label": "Jiná důležitá sdělení a přání pacientky",
    "aiValue": "Pacientka si nepřeje chemoterapii a žádá paliativní péči.",
    "accepted": false,
    "reason": "AI návrh zamietnutý: žiadny overený citát – použitý text priamo zo správy"
   }
  ]
 },
 "caveats": [
  "Zlaté sady a pravidlá písal ten istý tím. Pravidlá sme po prvom behu na pacientovi 2 zovšeobecnili (predtým 18/20 polí, 6/13 pascí). Ďalší pacient by mal prísť naslepo od niekoho iného.",
  "Bez kľúča k Azure OpenAI v pracovnom prostredí odpovedal na presne tú istú pseudonymizovanú požiadavku náhradný model (vidno v poli model); s kľúčom v app/.env stačí spustiť npm run extract a odpoveď sa nahrá nanovo."
 ],
 "sources": {
  "public/data/extracted-pacient-2.json": "2026-10-17T03:40:32.718Z",
  "public/data/eval-alena.json": "2026-10-17T03:40:32.470Z",
  "public/data/extracted-alena.json": "2026-10-17T03:40:32.289Z",
  "public/data/eval-pacient-2.json": "2026-10-17T03:40:32.873Z",
  "public/data/vysledok-test-halucinacii.json": "2026-10-17T00:01:38+00:00"
 }
};
