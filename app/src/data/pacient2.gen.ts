// GENEROVANÉ: node scripts/build-pacient2.mjs – NEUPRAVOVAŤ RUČNE. FIKTÍVNY PACIENT (testovacie dáta).
// Zdroj: public/data/extracted-pacient-2.json (2026-10-17T03:40:32.718Z, rules+llm) + data-pacient-2/source-pacient-2.json.
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

export const NOVAK_AI: CaseAi = {
 "label": "AI výstup (předpočítaný)",
 "mode": "rules+llm",
 "model": "náhradní model bez Azure klíče – odpověď z Claude Code na přesně tento prompt (cílově Azure OpenAI v EU)",
 "generatedAt": "2026-10-17T03:40:32.718Z",
 "evalFile": "data/eval-pacient-2.json",
 "fieldOrigin": {
  "firstName": "rules",
  "lastName": "rules",
  "age": "rules",
  "sex": "rules",
  "insurer": "rules",
  "patientContact": "rules",
  "contactPerson": "rules",
  "diagnosis": "ai",
  "epicrisis": "ai",
  "mdtQuestion": "ai",
  "comorbidities": "rules",
  "medication": "rules",
  "allergies": "rules",
  "performance": "rules",
  "weightHeight": "rules",
  "symptoms": "ai",
  "exams": "rules",
  "labs": "rules",
  "histology": "rules",
  "other": "ai"
 }
};

export const NOVAK: Case = {
 "id": "novak",
 "demo": "full",
 "patient": {
  "firstName": "Josef",
  "lastName": "Novák",
  "age": 60,
  "sex": "muž",
  "insurerCode": "111",
  "insurerName": "Všeobecná zdravotní pojišťovna ČR",
  "phone": "+420 603 000 118",
  "contact": {
   "name": "Marie Nováková",
   "relation": "manželka",
   "phone": "+420 603 000 119"
  }
 },
 "referringGp": {
  "name": "MUDr. Karel Veselý",
  "practice": "Plicní ambulance, Nemocnice Podhájí",
  "phone": "+420 317 000 450",
  "email": "plicni.ambulance@example.com"
 },
 "diagnosisShort": "adenokarcinom plic (C34.1)",
 "koc": "KOC 2 · Nemocnice Lipová",
 "mdtDate": "2026-10-22",
 "receivedAt": "2026-10-07",
 "status": "active",
 "nextStep": {
  "text": "Zkontrolovat návrh podkladu od AI: 3 rozpory, chybí dodatek k histologii (EGFR, ALK, ROS1, PD-L1)",
  "owner": "já (koordinátorka)",
  "due": "2026-10-21",
  "mine": true
 },
 "clockTargetDays": 33,
 "fields": [
  {
   "key": "firstName",
   "label": "Jméno",
   "group": "Pacient",
   "value": "Josef",
   "status": "proposed",
   "citations": [
    {
     "docId": "N-09",
     "quote": "Pacient: Josef Novák"
    }
   ]
  },
  {
   "key": "lastName",
   "label": "Příjmení",
   "group": "Pacient",
   "value": "Novák",
   "status": "proposed",
   "citations": [
    {
     "docId": "N-09",
     "quote": "Pacient: Josef Novák"
    }
   ]
  },
  {
   "key": "age",
   "label": "Věk",
   "group": "Pacient",
   "value": "60 let (nar. 14. 3. 1966)",
   "status": "proposed",
   "citations": [
    {
     "docId": "N-09",
     "quote": "Datum narození: 14. 3. 1966 (60 let)"
    }
   ]
  },
  {
   "key": "sex",
   "label": "Pohlaví",
   "group": "Pacient",
   "value": "muž",
   "status": "proposed",
   "citations": [
    {
     "docId": "N-09",
     "quote": "60letý kuřák"
    }
   ],
   "note": "Podle označení „60letý kuřák“ ve zprávě."
  },
  {
   "key": "insurer",
   "label": "Zdravotní pojišťovna",
   "group": "Pacient",
   "value": "111",
   "status": "proposed",
   "citations": [
    {
     "docId": "N-09",
     "quote": "Zdravotní pojišťovna: 111"
    }
   ],
   "note": "111 = Všeobecná zdravotní pojišťovna ČR (VZP)."
  },
  {
   "key": "patientContact",
   "label": "Kontakt na pacienta",
   "group": "Kontakty",
   "value": "tel. +420 603 000 118 · e-mail josef.novak@example.com",
   "status": "proposed",
   "citations": [
    {
     "docId": "N-09",
     "quote": "Telefon: +420 603 000 118"
    },
    {
     "docId": "N-09",
     "quote": "E-mail: josef.novak@example.com"
    }
   ]
  },
  {
   "key": "contactPerson",
   "label": "Kontaktní osoba a telefon",
   "group": "Kontakty",
   "value": "Marie Nováková (manželka), tel. +420 603 000 119",
   "status": "proposed",
   "citations": [
    {
     "docId": "N-09",
     "quote": "Kontaktní osoba: Marie Nováková (manželka), tel. +420 603 000 119"
    }
   ]
  },
  {
   "key": "diagnosis",
   "label": "Diagnóza",
   "group": "Diagnóza",
   "value": "C34.1 – adenokarcinom horního laloku plíce (TTF-1 pozitivní), uzliny 10R a 4R pozitivní",
   "status": "conflict",
   "citations": [
    {
     "docId": "N-09",
     "quote": "Diagnóza: C34.1 – adenokarcinom pravého horního laloku plíce, uzliny 10R a 4R pozitivní"
    },
    {
     "docId": "N-07",
     "quote": "Adenokarcinom plic (TTF-1 pozitivní), metastázy v uzlinách 4R a 10R."
    }
   ],
   "note": "Strana tumoru se ve zprávách liší, rozhodne člověk. Výsledek prediktivního vyšetření (dodatek k bioptickému nálezu) mezi zprávami chybí.",
   "conflict": {
    "a": {
     "value": "adenokarcinom pravého horního laloku plíce",
     "citation": {
      "docId": "N-09",
      "quote": "Diagnóza: C34.1 – adenokarcinom pravého horního laloku plíce, uzliny 10R a 4R pozitivní"
     }
    },
    "b": {
     "value": "tumor v levém horním laloku",
     "citation": {
      "docId": "N-06",
      "quote": "Endobronchiální tumor v levém horním laloku, odebrány biopsie z tumoru a EBUS-TBNA uzlin 4R a 10R."
     }
    },
    "explain": "Protokol bronchoskopie uvádí tumor v levém horním laloku, kdežto epikríza i popisy RTG, CT a PET/CT uvádějí pravý horní lalok."
   }
  },
  {
   "key": "epicrisis",
   "label": "Epikríza (stručný souhrn nemoci)",
   "group": "Diagnóza",
   "value": "60letý kuřák (40 balíčkoroků) s 6 týdnů trvajícím kašlem, hemoptýzou a úbytkem hmotnosti 3 kg. CT 10. 9. 2026: tumor pravého horního laloku 42 × 35 mm, suspektní uzliny 10R a 4R. EBUS-TBNA 17. 9. 2026: adenokarcinom plic s metastázami v uzlinách 4R a 10R. PET/CT 1. 10. 2026 bez vzdálených metastáz.",
   "status": "proposed",
   "citations": [
    {
     "docId": "N-09",
     "quote": "60letý kuřák (40 balíčkoroků) s 6 týdnů trvajícím kašlem, hemoptýzou a úbytkem hmotnosti 3 kg vyšetřen praktickou lékařkou 24. 8. 2026."
    },
    {
     "docId": "N-09",
     "quote": "CT hrudníku 10. 9. 2026 popisuje tumor pravého horního laloku 42 × 35 mm a suspektní uzliny 10R a 4R."
    },
    {
     "docId": "N-09",
     "quote": "Bronchoskopie s EBUS-TBNA 17. 9. 2026 na KOC Nemocnice Lipová, histologicky adenokarcinom plic s metastázami v uzlinách 4R a 10R."
    },
    {
     "docId": "N-09",
     "quote": "PET/CT 1. 10. 2026 bez známek vzdálených metastáz."
    }
   ],
   "note": "Souhrn podle epikrízy odesílajícího lékaře; protokol bronchoskopie uvádí levý horní lalok – viz konflikt u diagnózy."
  },
  {
   "key": "mdtQuestion",
   "label": "Požadavek / otázka na MDT",
   "group": "Diagnóza",
   "value": "Převzetí do péče KOC a projednání v MDT: posouzení resekability tumoru vs. konkomitantní chemoradioterapie vzhledem k postižení uzliny 4R.",
   "status": "proposed",
   "citations": [
    {
     "docId": "N-09",
     "quote": "Žádám o převzetí do péče KOC a projednání v MDT: posouzení resekability tumoru vs. konkomitantní chemoradioterapie vzhledem k postižení uzliny 4R."
    }
   ]
  },
  {
   "key": "comorbidities",
   "label": "Komorbidity (přidružené nemoci)",
   "group": "Anamnéza",
   "value": "diabetes mellitus 2. typu na PAD, arteriální hypertenze, dyslipidémie",
   "status": "proposed",
   "citations": [
    {
     "docId": "N-09",
     "quote": "OA: diabetes mellitus 2. typu na PAD, arteriální hypertenze, dyslipidémie"
    }
   ],
   "sourceDate": "2026-10-07"
  },
  {
   "key": "medication",
   "label": "Léková anamnéza (užívané léky)",
   "group": "Anamnéza",
   "value": "metformin 1000 mg 1-0-1, amlodipin 5 mg 1-0-0, atorvastatin 20 mg 0-0-1",
   "status": "proposed",
   "citations": [
    {
     "docId": "N-09",
     "quote": "FA: metformin 1000 mg 1-0-1, amlodipin 5 mg 1-0-0, atorvastatin 20 mg 0-0-1"
    }
   ],
   "sourceDate": "2026-10-07"
  },
  {
   "key": "allergies",
   "label": "Alergie",
   "group": "Anamnéza",
   "value": "alergie na jodovou kontrastní látku (10. 9. 2026)",
   "status": "conflict",
   "citations": [
    {
     "docId": "N-05",
     "quote": "Doporučeno zapsat do dokumentace alergii na jodovou kontrastní látku"
    },
    {
     "docId": "N-08",
     "quote": "Poznámka: CT část bez jodové kontrastní látky (alergie na jodovou kontrastní látku v anamnéze)"
    }
   ],
   "sourceDate": "2026-09-10",
   "conflict": {
    "a": {
     "value": "AA: neguje",
     "citation": {
      "docId": "N-09",
      "quote": "AA: neguje"
     }
    },
    "b": {
     "value": "alergie na jodovou kontrastní látku",
     "citation": {
      "docId": "N-05",
      "quote": "Doporučeno zapsat do dokumentace alergii na jodovou kontrastní látku"
     }
    },
    "explain": "Zpráva 09 (7. 10. 2026) uvádí „AA: neguje“, ale zpráva 05 z 10. 9. 2026 zaznamenala: alergie na jodovou kontrastní látku. Ověřit před dalším vyšetřením nebo léčbou – novější zpráva alergii nepřevzala."
   }
  },
  {
   "key": "performance",
   "label": "Stav výkonnosti (ECOG)",
   "group": "Stav",
   "value": "Výkonnostní stav ECOG 1.",
   "status": "proposed",
   "citations": [
    {
     "docId": "N-03",
     "quote": "Výkonnostní stav ECOG 1."
    }
   ],
   "sourceDate": "2026-09-03"
  },
  {
   "key": "weightHeight",
   "label": "Váha a výška",
   "group": "Stav",
   "value": "76 kg (7. 10. 2026) · výška 176 cm (3. 9. 2026)",
   "status": "proposed",
   "citations": [
    {
     "docId": "N-09",
     "quote": "Váha 76 kg"
    },
    {
     "docId": "N-03",
     "quote": "Výška 176 cm"
    },
    {
     "docId": "N-03",
     "quote": "hmotnost 78 kg"
    }
   ],
   "sourceDate": "2026-10-07",
   "note": "Dříve: 78 kg (3. 9. 2026). Novější hodnota 73 kg (zpráva 10, 27. 10. 2026) vznikla až po 22. 10. 2026, proto do podkladu nepatří."
  },
  {
   "key": "symptoms",
   "label": "Příznaky nemoci a jejich počátek",
   "group": "Stav",
   "value": "Suchý dráždivý kašel asi 6 týdnů (vyšetřen praktickou lékařkou 24. 8. 2026), poslední týden 2× drobná příměs krve ve sputu, mírná námahová dušnost, bez teplot; za 2 měsíce zhubl asi 3 kg. Nyní kašel přetrvává, hemoptýza naposledy před týdnem, námahová dušnost do 2 pater, váha 76 kg, nadále ubývá.",
   "status": "proposed",
   "citations": [
    {
     "docId": "N-01",
     "quote": "Asi 6 týdnů suchý dráždivý kašel, poslední týden 2× drobná příměs krve ve sputu."
    },
    {
     "docId": "N-01",
     "quote": "Mírná námahová dušnost (2 patra), bez teplot. Za 2 měsíce zhubl asi 3 kg bez diety."
    },
    {
     "docId": "N-09",
     "quote": "60letý kuřák (40 balíčkoroků) s 6 týdnů trvajícím kašlem, hemoptýzou a úbytkem hmotnosti 3 kg vyšetřen praktickou lékařkou 24. 8. 2026."
    },
    {
     "docId": "N-09",
     "quote": "Nyní kašel přetrvává, hemoptýza naposledy před týdnem, námahová dušnost do 2 pater. Váha 76 kg, nadále ubývá."
    }
   ],
   "note": "Přesné datum počátku příznaků ve zprávách chybí, uvedena je jen doba trvání kašle."
  },
  {
   "key": "exams",
   "label": "Provedená vyšetření",
   "group": "Vyšetrenia",
   "value": "26. 8. 2026 · RTG hrudníku PA · Nemocnice Podhájí – Radiologické oddělení – Opacita v pravém horním plicním poli suspektní z tumoru, rozšířený pravý hilus. Doporučeno CT hrudníku s k. l.\n3. 9. 2026 · vstupní vyšetření · Nemocnice Podhájí – Plicní ambulance – Suspektní tumor pravého horního laloku plíce u kuřáka 40 balíčkoroků. Výkonnostní stav ECOG 1.\n10. 9. 2026 · CT hrudníku a horního břicha s k. l. · Nemocnice Podhájí – Radiologické oddělení – Tumor pravého horního laloku 42 × 35 mm, suspektní metastatické uzliny 10R a 4R. Bez známek vzdálených metastáz v rozsahu vyšetření.\n17. 9. 2026 · bronchoskopie s EBUS-TBNA · KOC Nemocnice Lipová – Bronchologické pracoviště, Klinika pneumologie – Endobronchiální tumor v levém horním laloku, odebrány biopsie z tumoru a EBUS-TBNA uzlin 4R a 10R. Materiál odeslán k histologickému vyšetření. EBUS: uzlina 4R 13 × 10 mm a uzlina 10R 15 × 11 mm, z každé 3 vpichy jehlou 22G.\n1. 10. 2026 · PET/CT (18F-FDG) celotělové · KOC Nemocnice Severní – Oddělení nukleární medicíny – Metabolicky aktivní tumor pravého horního laloku s postižením uzlin 10R a 4R, bez známek vzdálených metastáz.",
   "status": "proposed",
   "citations": [
    {
     "docId": "N-02",
     "quote": "Opacita v pravém horním plicním poli suspektní z tumoru, rozšířený pravý hilus. Doporučeno CT hrudníku s k. l."
    },
    {
     "docId": "N-03",
     "quote": "Suspektní tumor pravého horního laloku plíce u kuřáka 40 balíčkoroků. Výkonnostní stav ECOG 1."
    },
    {
     "docId": "N-05",
     "quote": "Tumor pravého horního laloku 42 × 35 mm, suspektní metastatické uzliny 10R a 4R. Bez známek vzdálených metastáz v rozsahu vyšetření."
    },
    {
     "docId": "N-06",
     "quote": "Endobronchiální tumor v levém horním laloku, odebrány biopsie z tumoru a EBUS-TBNA uzlin 4R a 10R. Materiál odeslán k histologickému vyšetření."
    },
    {
     "docId": "N-06",
     "quote": "EBUS: uzlina 4R 13 × 10 mm a uzlina 10R 15 × 11 mm, z každé 3 vpichy jehlou 22G."
    },
    {
     "docId": "N-08",
     "quote": "Metabolicky aktivní tumor pravého horního laloku s postižením uzlin 10R a 4R, bez známek vzdálených metastáz."
    }
   ],
   "sourceDate": "2026-10-01",
   "note": "Plné znění výsledku je v původní zprávě (klik na citaci)."
  },
  {
   "key": "labs",
   "label": "Laboratorní výsledky včetně onkomarkerů",
   "group": "Laboratórium",
   "value": "8. 9. 2026 (Laboratoř LabPodhájí s.r.o.): nádorové markery: CEA 8,2 µg/l ↑, CYFRA 21-1 6,4 µg/l ↑, NSE 14,1 µg/l; mimo normu: Hemoglobin 128 g/l ↓, Glukóza 8,4 mmol/l ↑, CRP 12 mg/l ↑",
   "status": "conflict",
   "citations": [
    {
     "docId": "N-04",
     "quote": "CEA\n8,2 H"
    },
    {
     "docId": "N-04",
     "quote": "CYFRA 21-1\n6,4 H"
    },
    {
     "docId": "N-04",
     "quote": "NSE\n14,1"
    },
    {
     "docId": "N-04",
     "quote": "Hemoglobin\n128 L"
    },
    {
     "docId": "N-04",
     "quote": "Glukóza\n8,4 H"
    },
    {
     "docId": "N-04",
     "quote": "CRP\n12 H"
    }
   ],
   "sourceDate": "2026-09-08",
   "note": "Uvedeny všechny nádorové markery (CEA, CYFRA 21-1, NSE), nejen zvýšené.",
   "conflict": {
    "a": {
     "value": "Rodné číslo: 660314/1243",
     "citation": {
      "docId": "N-09",
      "quote": "Rodné číslo: 660314/1243"
     }
    },
    "b": {
     "value": "RČ 660314/1234",
     "citation": {
      "docId": "N-04",
      "quote": "RČ 660314/1234"
     }
    },
    "explain": "Zpráva 04 (Výsledky laboratorního vyšetření, 8. 9. 2026) má jiné rodné číslo (660314/1234) než ostatní zprávy (660314/1243). Ověřte, zda patří tomuto pacientovi – do té doby její údaje nepoužívat jako fakt."
   }
  },
  {
   "key": "histology",
   "label": "Histologie",
   "group": "Histológia",
   "value": "Adenokarcinom plic (TTF-1 pozitivní), metastázy v uzlinách 4R a 10R. · vydáno 23. 9. 2026",
   "status": "proposed",
   "citations": [
    {
     "docId": "N-07",
     "quote": "Adenokarcinom plic (TTF-1 pozitivní), metastázy v uzlinách 4R a 10R."
    },
    {
     "docId": "N-07",
     "quote": "Datum vydání: 23. 9. 2026"
    }
   ],
   "sourceDate": "2026-09-23",
   "note": "Chybí avizovaný dodatek (EGFR, ALK, ROS1, PD-L1).",
   "request": {
    "to": "KOC Nemocnice Lipová – Ústav patologie",
    "channel": "e-mail",
    "draft": "Dobrý den, před konziliem 22. 10. 2026 prosíme o zaslání dodatku (EGFR, ALK, ROS1, PD-L1) k vyšetření B-2026/14388 – Josef Novák. Děkujeme, koordinátor KOC."
   }
  },
  {
   "key": "other",
   "label": "Jiná důležitá sdělení a přání pacienta",
   "group": "Iné",
   "value": "Pacient je o diagnóze informován a přeje si, aby informace o léčbě dostávala i manželka. Kontaktní osoba: Marie Nováková (manželka), tel. +420 603 000 119.",
   "status": "proposed",
   "citations": [
    {
     "docId": "N-09",
     "quote": "Pacient je o diagnóze informován a přeje si, aby informace o léčbě dostávala i manželka."
    },
    {
     "docId": "N-09",
     "quote": "Kontaktní osoba: Marie Nováková (manželka), tel. +420 603 000 119"
    }
   ],
   "note": "Upozornění: zprávy z CT a PET/CT uvádějí alergii na jodovou kontrastní látku (kopřivka po iomeprolu), epikríza odesílajícího lékaře uvádí „AA: neguje“ – rozpor k ověření. Laboratorní zpráva je vedena na jiné rodné číslo než ostatní zprávy – ověřit, zda patří pacientovi."
  }
 ],
 "steps": [
  {
   "id": "rtg",
   "title": "RTG hrudníku",
   "place": "Nemocnice Podhájí – radiologie",
   "owner": "radiologie Nemocnice Podhájí",
   "due": "2026-08-26",
   "state": "delivered",
   "history": [
    {
     "state": "done",
     "date": "2026-08-26"
    },
    {
     "state": "delivered",
     "date": "2026-08-26"
    }
   ],
   "resultDocId": "N-02"
  },
  {
   "id": "ct",
   "title": "CT hrudníku a horního břicha",
   "place": "Nemocnice Podhájí – radiologie",
   "owner": "radiologie Nemocnice Podhájí",
   "due": "2026-09-10",
   "state": "delivered",
   "history": [
    {
     "state": "done",
     "date": "2026-09-10"
    },
    {
     "state": "delivered",
     "date": "2026-09-10"
    }
   ],
   "resultDocId": "N-05"
  },
  {
   "id": "bronch",
   "title": "Bronchoskopie s EBUS-TBNA",
   "place": "KOC 2 · Nemocnice Lipová – bronchologie",
   "owner": "bronchologie KOC 2",
   "due": "2026-09-17",
   "state": "delivered",
   "history": [
    {
     "state": "done",
     "date": "2026-09-17"
    },
    {
     "state": "delivered",
     "date": "2026-09-17"
    }
   ],
   "resultDocId": "N-06"
  },
  {
   "id": "histology",
   "title": "Histologie (výsledek biopsie)",
   "place": "KOC 2 · Nemocnice Lipová – patologie",
   "owner": "patologie KOC 2",
   "due": "2026-09-23",
   "state": "delivered",
   "history": [
    {
     "state": "done",
     "date": "2026-09-17"
    },
    {
     "state": "delivered",
     "date": "2026-09-23"
    }
   ],
   "resultDocId": "N-07"
  },
  {
   "id": "pet",
   "title": "PET/CT celotělové",
   "place": "KOC 1 · Nemocnice Severní – nukleární medicína",
   "owner": "nukleární medicína KOC 1",
   "due": "2026-10-01",
   "state": "delivered",
   "history": [
    {
     "state": "done",
     "date": "2026-10-01"
    },
    {
     "state": "delivered",
     "date": "2026-10-01"
    }
   ],
   "resultDocId": "N-08"
  },
  {
   "id": "markers",
   "title": "Dodatek k histologii: EGFR, ALK, ROS1, PD-L1",
   "place": "KOC 2 · Nemocnice Lipová – patologie",
   "owner": "patologie KOC 2",
   "due": "2026-10-21",
   "state": "ordered",
   "history": [
    {
     "state": "ordered",
     "date": "2026-09-23"
    }
   ]
  },
  {
   "id": "mdt",
   "title": "MDT (multidisciplinární tým)",
   "place": "KOC 2 · Nemocnice Lipová",
   "owner": "já (koordinátorka) – podklad",
   "due": "2026-10-22",
   "state": "ordered",
   "history": [
    {
     "state": "ordered",
     "date": "2026-10-07"
    }
   ]
  }
 ],
 "labs": [
  {
   "test": "Leukocyty",
   "value": "9,6",
   "unit": "10⁹/l",
   "ref": "4,0–10,0",
   "date": "2026-09-08",
   "lab": "Laboratoř LabPodhájí s.r.o.",
   "docId": "N-04"
  },
  {
   "test": "Hemoglobin",
   "value": "128",
   "unit": "g/l",
   "ref": "135–175",
   "flag": "L",
   "date": "2026-09-08",
   "lab": "Laboratoř LabPodhájí s.r.o.",
   "docId": "N-04"
  },
  {
   "test": "Trombocyty",
   "value": "352",
   "unit": "10⁹/l",
   "ref": "150–400",
   "date": "2026-09-08",
   "lab": "Laboratoř LabPodhájí s.r.o.",
   "docId": "N-04"
  },
  {
   "test": "INR",
   "value": "1,0",
   "unit": "1",
   "ref": "0,8–1,2",
   "date": "2026-09-08",
   "lab": "Laboratoř LabPodhájí s.r.o.",
   "docId": "N-04"
  },
  {
   "test": "Kreatinin",
   "value": "96",
   "unit": "µmol/l",
   "ref": "62–106",
   "date": "2026-09-08",
   "lab": "Laboratoř LabPodhájí s.r.o.",
   "docId": "N-04"
  },
  {
   "test": "Glukóza",
   "value": "8,4",
   "unit": "mmol/l",
   "ref": "3,9–5,6",
   "flag": "H",
   "date": "2026-09-08",
   "lab": "Laboratoř LabPodhájí s.r.o.",
   "docId": "N-04"
  },
  {
   "test": "ALT",
   "value": "0,52",
   "unit": "µkat/l",
   "ref": "0,10–0,85",
   "date": "2026-09-08",
   "lab": "Laboratoř LabPodhájí s.r.o.",
   "docId": "N-04"
  },
  {
   "test": "Vápník",
   "value": "2,38",
   "unit": "mmol/l",
   "ref": "2,15–2,55",
   "date": "2026-09-08",
   "lab": "Laboratoř LabPodhájí s.r.o.",
   "docId": "N-04"
  },
  {
   "test": "CRP",
   "value": "12",
   "unit": "mg/l",
   "ref": "0–5",
   "flag": "H",
   "date": "2026-09-08",
   "lab": "Laboratoř LabPodhájí s.r.o.",
   "docId": "N-04"
  },
  {
   "test": "CEA",
   "value": "8,2",
   "unit": "µg/l",
   "ref": "< 5,0",
   "flag": "H",
   "date": "2026-09-08",
   "lab": "Laboratoř LabPodhájí s.r.o.",
   "docId": "N-04"
  },
  {
   "test": "CYFRA 21-1",
   "value": "6,4",
   "unit": "µg/l",
   "ref": "< 3,3",
   "flag": "H",
   "date": "2026-09-08",
   "lab": "Laboratoř LabPodhájí s.r.o.",
   "docId": "N-04"
  },
  {
   "test": "NSE",
   "value": "14,1",
   "unit": "µg/l",
   "ref": "< 16,3",
   "date": "2026-09-08",
   "lab": "Laboratoř LabPodhájí s.r.o.",
   "docId": "N-04"
  }
 ],
 "meds": [
  {
   "name": "metformin",
   "dose": "1000 mg 1-0-1",
   "citation": {
    "docId": "N-09",
    "quote": "metformin 1000 mg 1-0-1"
   }
  },
  {
   "name": "amlodipin",
   "dose": "5 mg 1-0-0",
   "citation": {
    "docId": "N-09",
    "quote": "amlodipin 5 mg 1-0-0"
   }
  },
  {
   "name": "atorvastatin",
   "dose": "20 mg 0-0-1",
   "citation": {
    "docId": "N-09",
    "quote": "atorvastatin 20 mg 0-0-1"
   }
  }
 ],
 "exams": [
  {
   "date": "2026-08-26",
   "place": "Nemocnice Podhájí – Radiologické oddělení",
   "type": "RTG hrudníku PA",
   "summary": "Opacita v pravém horním plicním poli suspektní z tumoru, rozšířený pravý hilus. Doporučeno CT hrudníku s k. l.",
   "docId": "N-02"
  },
  {
   "date": "2026-09-03",
   "place": "Nemocnice Podhájí – Plicní ambulance",
   "type": "vstupní vyšetření",
   "summary": "Suspektní tumor pravého horního laloku plíce u kuřáka 40 balíčkoroků. Výkonnostní stav ECOG 1.",
   "docId": "N-03"
  },
  {
   "date": "2026-09-10",
   "place": "Nemocnice Podhájí – Radiologické oddělení",
   "type": "CT hrudníku a horního břicha s k. l.",
   "summary": "Tumor pravého horního laloku 42 × 35 mm, suspektní metastatické uzliny 10R a 4R. Bez známek vzdálených metastáz v rozsahu vyšetření.",
   "docId": "N-05"
  },
  {
   "date": "2026-09-17",
   "place": "KOC Nemocnice Lipová – Bronchologické pracoviště, Klinika pneumologie",
   "type": "bronchoskopie s EBUS-TBNA",
   "summary": "Endobronchiální tumor v levém horním laloku, odebrány biopsie z tumoru a EBUS-TBNA uzlin 4R a 10R. Materiál odeslán k histologickému vyšetření. EBUS: uzlina 4R 13 × 10 mm a uzlina 10R 15 × 11 mm, z každé 3 vpichy jehlou 22G.",
   "docId": "N-06"
  },
  {
   "date": "2026-10-01",
   "place": "KOC Nemocnice Severní – Oddělení nukleární medicíny",
   "type": "PET/CT (18F-FDG) celotělové",
   "summary": "Metabolicky aktivní tumor pravého horního laloku s postižením uzlin 10R a 4R, bez známek vzdálených metastáz.",
   "docId": "N-08"
  }
 ],
 "docs": [
  {
   "id": "N-01",
   "title": "Praktická lékařka – žádost o vyšetření u pneumologa",
   "place": "Ordinace praktického lékaře, Benešov",
   "kind": "report",
   "examDate": "2026-08-24",
   "receivedAt": "2026-10-07",
   "channel": "e-mail",
   "text": "FIKTIVNÍ PACIENT – testovací data pro Rakathon 2026\nOrdinace praktického lékaře pro dospělé\nMUDr. Hana Benešová\nTáborská 12, 256 01 Benešov\nŽádost o vyšetření v plicní ambulanci\nDatum: 24. 8. 2026\nPacient: Josef Novák\nRodné číslo: 660314/1243\nBydliště: Lipová 8, 256 01 Benešov\nZdravotní pojišťovna: 111\nTelefon: +420 603 000 118\nNYNÍ\nAsi 6 týdnů suchý dráždivý kašel, poslední týden 2× drobná příměs krve ve sputu. Mírná námahová dušnost (2 patra), bez teplot. Za 2 měsíce zhubl asi 3 kg bez diety.\nObjektivně TK 138/84 mmHg, TF 84/min, SpO₂ 95 %. Poslechově oslabené dýchání vpravo nahoře, jinak čisté.\nANAMNÉZA\nOA: diabetes mellitus 2. typu na PAD, arteriální hypertenze, dyslipidémie\nFA: metformin 1000 mg 1-0-1, amlodipin 5 mg 1-0-0, atorvastatin 20 mg 0-0-1\nAA: neguje\nAbusus: kuřák od 18 let, 20 cigaret denně (40 balíčkoroků), alkohol příležitostně\nPA: zedník\nZÁVĚR\nKašel s hemoptýzou u silného kuřáka, úbytek hmotnosti – nutno vyloučit nádor plic.\nDOPORUČENÍ\n1. RTG hrudníku – objednán na 26. 8. 2026, Radiologické oddělení Nemocnice Podhájí.\n2. Vyšetření v plicní ambulanci – objednán na 3. 9. 2026, MUDr. Karel Veselý.\nV Benešově dne 24. 8. 2026\nMUDr. Hana Benešová\npraktický lékař"
  },
  {
   "id": "N-02",
   "title": "RTG hrudníku",
   "place": "Nemocnice Podhájí – radiologie",
   "kind": "result",
   "examDate": "2026-08-26",
   "receivedAt": "2026-10-07",
   "channel": "e-mail",
   "text": "FIKTIVNÍ PACIENT – testovací data pro Rakathon 2026\nNemocnice Podhájí (fiktivní)\nRadiologické oddělení\nNemocniční 40, 256 01 Benešov\nVýsledek vyšetření – RTG hrudníku PA\nPacient: Josef Novák, RČ 660314/1243, ZP 111\nIndikující lékař: MUDr. Hana Benešová, praktický lékař\nDatum vyšetření: 26. 8. 2026\nKlinická otázka: kašel, hemoptýza, kuřák – vyloučit tumor\nPOPIS\nV pravém horním plicním poli neostře ohraničená opacita velikosti asi 40 mm, pravý hilus rozšířen. Levá plíce bez ložiskových změn. Bránice hladká, kostofrenické úhly volné. Srdeční stín nezvětšen.\nZÁVĚR\nOpacita v pravém horním plicním poli suspektní z tumoru, rozšířený pravý hilus. Doporučeno CT hrudníku s k. l.\nDatum: 26. 8. 2026\nMUDr. Ondřej Malina\nradiolog"
  },
  {
   "id": "N-03",
   "title": "Pneumolog – vstupní vyšetření",
   "place": "Nemocnice Podhájí – plicní ambulance",
   "kind": "report",
   "examDate": "2026-09-03",
   "receivedAt": "2026-10-07",
   "channel": "e-mail",
   "text": "FIKTIVNÍ PACIENT – testovací data pro Rakathon 2026\nNemocnice Podhájí (fiktivní)\nPlicní ambulance – MUDr. Karel Veselý\nNemocniční 40, 256 01 Benešov\nAmbulantní zpráva – vstupní vyšetření\nDatum: 3. 9. 2026\nPacient: Josef Novák\nRodné číslo: 660314/1243\nBydliště: Lipová 8, 256 01 Benešov\nZdravotní pojišťovna: 111\nOdesílající lékař: MUDr. Hana Benešová, praktický lékař\nSUBJEKTIVNĚ\nKašel 7 týdnů, opakovaně drobná hemoptýza, námahová dušnost. Úbytek hmotnosti 3 kg za 2 měsíce. Bolesti na hrudi neguje.\nOBJEKTIVNĚ\nVýška 176 cm, hmotnost 78 kg. SpO₂ 95 %. Oslabené dýchání vpravo nahoře, bez vedlejších fenoménů.\nSpirometrie: FEV1 2,6 l (82 % n. h.), FVC 3,5 l (88 % n. h.), FEV1/FVC 0,74.\nZÁVĚR\nSuspektní tumor pravého horního laloku plíce u kuřáka 40 balíčkoroků. Výkonnostní stav ECOG 1.\nDOPORUČENÍ\n1. CT hrudníku a horního břicha s k. l. – objednáno na 10. 9. 2026.\n2. Laboratoř včetně nádorových markerů a koagulace – odběr 8. 9. 2026.\n3. Bronchoskopie s EBUS-TBNA na KOC Nemocnice Lipová – dle výsledku CT.\n4. Ukončit kouření, nabídnuta odvykací terapie.\nV Benešově dne 3. 9. 2026\nMUDr. Karel Veselý\npneumolog\nKopie: MUDr. Hana Benešová, praktický lékař"
  },
  {
   "id": "N-04",
   "title": "Laboratoř a nádorové markery",
   "place": "Laboratoř LabPodhájí s.r.o.",
   "kind": "result",
   "examDate": "2026-09-08",
   "receivedAt": "2026-10-07",
   "channel": "e-mail",
   "text": "FIKTIVNÍ PACIENT – testovací data pro Rakathon 2026\nLaboratoř LabPodhájí s.r.o. (fiktivní)\nKlinická biochemie a hematologie\nNemocniční 40, 256 01 Benešov\nVýsledky laboratorního vyšetření\nPacient: Josef Novák, RČ 660314/1234, ZP 111\nIndikující lékař: MUDr. Karel Veselý, pneumolog\nOdběr: 8. 9. 2026 7:30\nKREVNÍ OBRAZ\nVyšetření\nVýsledek\nJednotky\nRef. meze\nLeukocyty\n9,6\n10⁹/l\n4,0–10,0\nHemoglobin\n128 L\ng/l\n135–175\nTrombocyty\n352\n10⁹/l\n150–400\nKOAGULACE\nVyšetření\nVýsledek\nJednotky\nRef. meze\nINR\n1,0\n1\n0,8–1,2\nBIOCHEMIE\nVyšetření\nVýsledek\nJednotky\nRef. meze\nKreatinin\n96\nµmol/l\n62–106\nGlukóza\n8,4 H\nmmol/l\n3,9–5,6\nALT\n0,52\nµkat/l\n0,10–0,85\nVápník\n2,38\nmmol/l\n2,15–2,55\nCRP\n12 H\nmg/l\n0–5\nNÁDOROVÉ MARKERY\nVyšetření\nVýsledek\nJednotky\nRef. meze\nCEA\n8,2 H\nµg/l\n< 5,0\nCYFRA 21-1\n6,4 H\nµg/l\n< 3,3\nNSE\n14,1\nµg/l\n< 16,3\nVydáno: 8. 9. 2026\nIng. Pavel Dušek\nodborný pracovník laboratoře"
  },
  {
   "id": "N-05",
   "title": "CT hrudníku a horního břicha",
   "place": "Nemocnice Podhájí – radiologie",
   "kind": "result",
   "examDate": "2026-09-10",
   "receivedAt": "2026-10-07",
   "channel": "e-mail",
   "text": "FIKTIVNÍ PACIENT – testovací data pro Rakathon 2026\nNemocnice Podhájí (fiktivní)\nRadiologické oddělení\nNemocniční 40, 256 01 Benešov\nVýsledek vyšetření – CT hrudníku a horního břicha s k. l.\nPacient: Josef Novák, RČ 660314/1243, ZP 111\nIndikující lékař: MUDr. Karel Veselý, pneumolog\nDatum vyšetření: 10. 9. 2026\nPOPIS\nV pravém horním laloku (segmenty S1–S2) solidní tumor s nepravidelnými okraji 42 × 35 mm, přiléhá k viscerální pleuře, bez invaze do hrudní stěny. Tumor zužuje segmentový bronchus B1. Hilové uzliny vpravo (stanice 10R) 15 mm, pravostranná paratracheální uzlina (4R) 12 mm. Ostatní mediastinální uzliny nezvětšeny. Levá plíce bez ložisek. Bez fluidothoraxu. Játra, nadledviny a skelet v rozsahu vyšetření bez ložiskových změn.\nKOMPLIKACE\nPo aplikaci jodové kontrastní látky (iomeprol) generalizovaná kopřivka, podán bisulepin i.v., stav do 30 minut odezněl. Doporučeno zapsat do dokumentace alergii na jodovou kontrastní látku.\nZÁVĚR\nTumor pravého horního laloku 42 × 35 mm, suspektní metastatické uzliny 10R a 4R. Bez známek vzdálených metastáz v rozsahu vyšetření.\nDatum: 10. 9. 2026\nMUDr. Ondřej Malina\nradiolog"
  },
  {
   "id": "N-06",
   "title": "Bronchoskopie s EBUS-TBNA – protokol",
   "place": "KOC 2 · Nemocnice Lipová – bronchologie",
   "kind": "report",
   "examDate": "2026-09-17",
   "receivedAt": "2026-10-07",
   "channel": "e-mail",
   "text": "FIKTIVNÍ PACIENT – testovací data pro Rakathon 2026\nKOC Nemocnice Lipová (fiktivní)\nBronchologické pracoviště, Klinika pneumologie\nNemocniční 15, 140 00 Praha 4\nProtokol o výkonu – bronchoskopie s EBUS-TBNA\nPacient: Josef Novák, RČ 660314/1243, ZP 111\nDatum výkonu: 17. 9. 2026\nVýkon: flexibilní bronchoskopie, klešťová biopsie tumoru, EBUS-TBNA uzlin 4R a 10R\nIndikace: tumor levého horního laloku, staging mediastina\nPŘÍPRAVA\nNalačno od půlnoci. Koagulace v normě. Informovaný souhlas podepsán.\nPOPIS VÝKONU\nV lokální anestezii a analgosedaci zaveden bronchoskop. V ústí segmentového bronchu B1 exofytický tumor zužující lumen asi o 50 %, odebrány 4 klešťové biopsie. EBUS: uzlina 4R 13 × 10 mm a uzlina 10R 15 × 11 mm, z každé 3 vpichy jehlou 22G. Krvácení minimální, bez komplikací.\nZÁVĚR\nEndobronchiální tumor v levém horním laloku, odebrány biopsie z tumoru a EBUS-TBNA uzlin 4R a 10R. Materiál odeslán k histologickému vyšetření.\nV Praze dne 17. 9. 2026\nMUDr. Petra Králová\npneumolog, bronchoskopista"
  },
  {
   "id": "N-07",
   "title": "Histologie – bioptický nález",
   "place": "KOC 2 · Nemocnice Lipová – patologie",
   "kind": "result",
   "examDate": "2026-09-23",
   "receivedAt": "2026-10-07",
   "channel": "e-mail",
   "text": "FIKTIVNÍ PACIENT – testovací data pro Rakathon 2026\nKOC Nemocnice Lipová (fiktivní)\nÚstav patologie\nNemocniční 15, 140 00 Praha 4\nBioptický nález\nPacient: Josef Novák, RČ 660314/1243, ZP 111\nČíslo vyšetření: B-2026/14388\nMateriál: 1) endobronchiální biopsie B1, 2) EBUS-TBNA uzlina 4R, 3) EBUS-TBNA uzlina 10R (odběr 17. 9. 2026)\nOdesílající: MUDr. Petra Králová, bronchologické pracoviště KOC\nDatum vydání: 23. 9. 2026\nMIKROSKOPICKY\n1) Infiltrace adenokarcinomem s acinárním a solidním uspořádáním. 2) Metastáza adenokarcinomu. 3) Metastáza adenokarcinomu.\nImunohistochemicky: TTF-1 pozitivní, napsin A pozitivní, p40 negativní.\nZÁVĚR\nAdenokarcinom plic (TTF-1 pozitivní), metastázy v uzlinách 4R a 10R.\nPrediktivní vyšetření (EGFR, ALK, ROS1, PD-L1) probíhá – výsledek bude doplněn dodatkem.\nDatum: 23. 9. 2026\nMUDr. Radek Pokorný, Ph.D.\npatolog"
  },
  {
   "id": "N-08",
   "title": "PET/CT celotělové",
   "place": "KOC 1 · Nemocnice Severní – nukleární medicína",
   "kind": "result",
   "examDate": "2026-10-01",
   "receivedAt": "2026-10-07",
   "channel": "e-mail",
   "text": "FIKTIVNÍ PACIENT – testovací data pro Rakathon 2026\nKOC Nemocnice Severní (fiktivní)\nOddělení nukleární medicíny\nSeverní 1200, 180 00 Praha 8\nVýsledek vyšetření – PET/CT (18F-FDG) celotělové\nPacient: Josef Novák, RČ 660314/1243, ZP 111\nIndikující lékař: MUDr. Karel Veselý, pneumolog\nDatum vyšetření: 1. 10. 2026\nPoznámka: CT část bez jodové kontrastní látky (alergie na jodovou kontrastní látku v anamnéze).\nPOPIS\nHypermetabolický tumor pravého horního laloku 43 × 36 mm, SUVmax 12,4. Hypermetabolické uzliny 10R (SUVmax 6,1) a 4R (SUVmax 5,3). Ostatní mediastinální uzliny bez zvýšené akumulace. Játra, nadledviny a skelet bez patologické akumulace.\nZÁVĚR\nMetabolicky aktivní tumor pravého horního laloku s postižením uzlin 10R a 4R, bez známek vzdálených metastáz.\nDatum: 1. 10. 2026\nMUDr. Jana Horáková\nnukleární medicína"
  },
  {
   "id": "N-09",
   "title": "Žádost pneumologa o převzetí do KOC (epikríza)",
   "place": "Nemocnice Podhájí – plicní ambulance",
   "kind": "request",
   "examDate": "2026-10-07",
   "receivedAt": "2026-10-07",
   "channel": "e-mail",
   "text": "FIKTIVNÍ PACIENT – testovací data pro Rakathon 2026\nNemocnice Podhájí (fiktivní)\nPlicní ambulance – MUDr. Karel Veselý\nNemocniční 40, 256 01 Benešov\nTel.: +420 317 000 450, e-mail: plicni.ambulance@example.com\nEpikríza a žádost o převzetí do péče KOC\nAdresát: Komplexní onkologické centrum Nemocnice Lipová – koordinátor KOC\nPacient: Josef Novák\nRodné číslo: 660314/1243\nBydliště: Lipová 8, 256 01 Benešov\nZdravotní pojišťovna: 111\nDatum narození: 14. 3. 1966 (60 let)\nTelefon: +420 603 000 118\nE-mail: josef.novak@example.com\nKontaktní osoba: Marie Nováková (manželka), tel. +420 603 000 119\nEPIKRÍZA\n60letý kuřák (40 balíčkoroků) s 6 týdnů trvajícím kašlem, hemoptýzou a úbytkem hmotnosti 3 kg vyšetřen praktickou lékařkou 24. 8. 2026. RTG hrudníku 26. 8. 2026 prokázalo opacitu v pravém horním plicním poli. CT hrudníku 10. 9. 2026 popisuje tumor pravého horního laloku 42 × 35 mm a suspektní uzliny 10R a 4R. Bronchoskopie s EBUS-TBNA 17. 9. 2026 na KOC Nemocnice Lipová, histologicky adenokarcinom plic s metastázami v uzlinách 4R a 10R. PET/CT 1. 10. 2026 bez známek vzdálených metastáz.\nNyní kašel přetrvává, hemoptýza naposledy před týdnem, námahová dušnost do 2 pater. Váha 76 kg, nadále ubývá. Pacient je soběstačný, pracuje omezeně.\nANAMNÉZA\nOA: diabetes mellitus 2. typu na PAD, arteriální hypertenze, dyslipidémie\nFA: metformin 1000 mg 1-0-1, amlodipin 5 mg 1-0-0, atorvastatin 20 mg 0-0-1\nAA: neguje\nAbusus: kuřák 40 balíčkoroků, od 3. 9. 2026 nekouří\nSA: ženatý, žije s manželkou v rodinném domě\nPA: zedník, t. č. v pracovní neschopnosti\nPŘILOŽENÉ VÝSLEDKY\nRTG hrudníku 26. 8. 2026, laboratoř 8. 9. 2026, CT hrudníku 10. 9. 2026, bronchoskopie 17. 9. 2026, histologie 23. 9. 2026, PET/CT 1. 10. 2026 – v příloze.\nŽÁDOST\nDiagnóza: C34.1 – adenokarcinom pravého horního laloku plíce, uzliny 10R a 4R pozitivní\nŽádám o převzetí do péče KOC a projednání v MDT: posouzení resekability tumoru vs. konkomitantní chemoradioterapie vzhledem k postižení uzliny 4R.\nPacient je o diagnóze informován a přeje si, aby informace o léčbě dostávala i manželka.\nDěkuji za spolupráci.\nV Benešově dne 7. 10. 2026\nMUDr. Karel Veselý\npneumolog"
  },
  {
   "id": "N-10",
   "title": "Nutriční ambulance – screening",
   "place": "KOC 2 · Nemocnice Lipová – nutriční ambulance",
   "kind": "report",
   "examDate": "2026-10-27",
   "receivedAt": "2026-10-27",
   "channel": "NIS",
   "text": "FIKTIVNÍ PACIENT – testovací data pro Rakathon 2026\nKOC Nemocnice Lipová (fiktivní)\nNutriční ambulance\nNemocniční 15, 140 00 Praha 4\nAmbulantní zpráva – nutriční screening\nDatum: 27. 10. 2026\nPacient: Josef Novák\nRodné číslo: 660314/1243\nZdravotní pojišťovna: 111\nOdesílající lékař: MUDr. Lenka Marková, onkologická ambulance KOC\nOBJEKTIVNĚ\nVýška 176 cm, hmotnost 73 kg, BMI 23,6. Úbytek 5 kg za 2 měsíce.\nZÁVĚR\nRiziko malnutrice (NRS 2002: 3 body).\nDOPORUČENÍ\n1. Sipping 2× denně po 300 kcal.\n2. Kontrola za 4 týdny.\nV Praze dne 27. 10. 2026\nBc. Tereza Malá\nnutriční terapeut"
  }
 ],
 "log": [
  {
   "date": "2026-10-07",
   "action": "Převzata žádost pneumologa o převzetí do KOC",
   "detail": "Zpráva N-09 s výsledky v příloze (RTG, laboratoř, CT, bronchoskopie, histologie, PET/CT). Založen případ, počítají se dny od přijetí žádosti.",
   "billable": true
  },
  {
   "date": "2026-10-07",
   "action": "Podklad předvyplněn strojově",
   "detail": "20 polí · 49/49 citátů doslova · 3 rozpory · v demu předpočítáno, čeká na kontrolu člověkem.",
   "billable": false
  }
 ],
 "precheck": {
  "findings": [
   {
    "text": "Žádanka neuvádí výkonnostní stav – je ve zprávě 03: „Výkonnostní stav ECOG 1.“.",
    "severity": "info"
   }
  ]
 },
 "reviewer": {
  "insurerCode": "111",
  "insurerName": "Všeobecná zdravotní pojišťovna ČR",
  "note": "Pacient je pojištěncem VZP (111). Pokud má souhrn dostat i revizní lékař (chce to prezentace VZP), šel by reviznímu lékaři VZP. Kanál v ČR nemáme ověřený, odeslání je v prototypu jen naznačeno."
 }
};
