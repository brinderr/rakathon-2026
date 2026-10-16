// The 20 items of the VZP template "Handover_obsah" (Rakathon 2026, Cesta pacienta bez ztráty informací).
// Keys and labels are the same as in the demo data (src/data/cases.ts), so that UI, AI output and the accuracy
// eval line up. Labels are written for a female patient (Alena); extract.ts switches them for a male patient.
import type { FieldGroup } from '../types.ts';

export interface FieldSpec {
  key: string;
  label: string;       // Slovak label for laymen
  group: FieldGroup;
  template: string;    // wording in the VZP template (Czech), for traceability
  hint: string;        // what the extractor should look for (used in the LLM prompt)
}

export const FIELD_SPECS: FieldSpec[] = [
  { key: 'firstName', label: 'Meno', group: 'Pacient', template: 'jméno',
    hint: 'Křestní jméno pacienta, jak je uvedeno v hlavičce zprávy.' },
  { key: 'lastName', label: 'Priezvisko', group: 'Pacient', template: 'příjmení',
    hint: 'Příjmení pacienta, jak je uvedeno v hlavičce zprávy.' },
  { key: 'age', label: 'Vek', group: 'Pacient', template: 'věk',
    hint: 'Věk výslovně uvedený ve zprávě (např. „63 let“), případně datum narození. Nedopočítávat z rodného čísla.' },
  { key: 'sex', label: 'Pohlavie', group: 'Pacient', template: 'pohlaví',
    hint: 'Pohlaví podle výslovného označení ve zprávě (např. „Pacientka“, „63letá pacientka“).' },
  { key: 'insurer', label: 'Zdravotná poisťovňa', group: 'Pacient', template: 'číslo zdravotní pojišťovny',
    hint: 'Kód zdravotní pojišťovny (např. „Zdravotní pojišťovna: 211“).' },
  { key: 'patientContact', label: 'Kontakt na pacientku', group: 'Kontakty', template: 'kontakt na pacienta',
    hint: 'Telefon a e-mail pacienta. Co chybí (např. e-mail), označit.' },
  { key: 'contactPerson', label: 'Kontaktná osoba', group: 'Kontakty', template: 'kontaktní osoba + tel. číslo',
    hint: 'Kontaktní osoba (vztah k pacientovi) a její telefon.' },
  { key: 'diagnosis', label: 'Diagnóza', group: 'Diagnóza', template: 'Diagnóza',
    hint: 'Pracovní nebo potvrzená onkologická diagnóza s kódem MKN-10, jen pokud je uvedena.' },
  { key: 'epicrisis', label: 'Priebeh ochorenia v skratke', group: 'Diagnóza', template: 'Epikríza (stručný souhrn nemoci)',
    hint: 'Stručný souhrn průběhu nemoci podle epikrízy odesílajícího lékaře.' },
  { key: 'mdtQuestion', label: 'Otázka pre konzílium', group: 'Diagnóza', template: 'Požadavek/otázka na MDT',
    hint: 'Co odesílající lékař od KOC/MDT žádá. Pokud je otázka obecná, uvést to v poznámce.' },
  { key: 'comorbidities', label: 'Pridružené ochorenia', group: 'Anamnéza', template: 'Komorbidity (OA)',
    hint: 'Osobní anamnéza: přidružená onemocnění a prodělané operace.' },
  { key: 'medication', label: 'Lieky, ktoré užíva', group: 'Anamnéza', template: 'Léková anamnéza (FA)',
    hint: 'Léky s dávkováním přesně podle zprávy. Nedopočítávat, dokdy se užívají.' },
  { key: 'allergies', label: 'Alergie', group: 'Anamnéza', template: 'Alergie (AA)',
    hint: 'Alergická anamnéza (i „neguje“ je údaj).' },
  { key: 'performance', label: 'Výkonnostný stav (ECOG)', group: 'Stav', template: 'Stav výkonnosti (PS/Karnofského skóre)',
    hint: 'Pouze výslovně uvedené skóre ECOG/PS/WHO nebo Karnofsky. Slovní popis (např. „soběstačná“) NENÍ skóre – pak pole chybí.' },
  { key: 'weightHeight', label: 'Váha a výška', group: 'Stav', template: 'Váha a výška pacienta',
    hint: 'Hmotnost a výška vždy s datem a zdrojem; poslední hodnota známá k datu MDT.' },
  { key: 'symptoms', label: 'Príznaky a ich začiatok', group: 'Stav', template: 'Symptomy (příznaky) nemoci a jejich počátek',
    hint: 'Příznaky a kdy začaly.' },
  { key: 'exams', label: 'Vykonané vyšetrenia', group: 'Vyšetrenia', template: 'Provedená vyšetření (datum, místo, typ, popis výsledků v plném znění)',
    hint: 'Každé vyšetření: datum, místo, typ a závěr/popis výsledku.' },
  { key: 'labs', label: 'Laboratórium a nádorové markery', group: 'Laboratórium', template: 'Laboratorní výsledky včetně onkomarkerů (TM)',
    hint: 'Laboratorní výsledky s datem odběru; všechny nádorové markery, ne výběr.' },
  { key: 'histology', label: 'Histológia (výsledok biopsie)', group: 'Histológia', template: 'Histologie (pokud již existuje)',
    hint: 'Závěr bioptického nálezu, datum vydání a datum odběru materiálu.' },
  { key: 'other', label: 'Iné dôležité a želania pacientky', group: 'Iné', template: 'Jiná důležitá sdělení včetně přání pacienta',
    hint: 'Souhlas se sdílením informací, přání pacienta, upozornění (antikoagulace, úzkost apod.).' },
];

export const FIELD_KEYS = FIELD_SPECS.map((f) => f.key);

export function fieldSpec(key: string): FieldSpec | undefined {
  return FIELD_SPECS.find((f) => f.key === key);
}
