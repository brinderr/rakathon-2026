// Shared data contract for the coordinator app. Every screen reads ONLY these types.
// Data for the demo lives in src/data/cases.ts (export const CASES: Case[]) and the raw
// report texts in public/data/source.json (loaded via src/data/source.ts).

export type ISODate = string; // "2026-10-21"

/** One of the 13 fictional reports of Alena (or reports of the extra demo patients). */
export interface SourceDoc {
  id: string;            // "01" … "13"
  title: string;         // "Kardiológia – kontrola"
  place: string;         // "Kardiologická ambulancia Jesenice"
  kind: 'report' | 'result' | 'request';
  examDate: ISODate;     // date the exam/report happened
  receivedAt: ISODate;   // date the coordinator received it (drives the "stav k dátumu" slider)
  channel: 'e-mail' | 'eZpráva' | 'ePACS' | 'telefón' | 'NIS' | 'papier' | 'formulár';
  text?: string;         // filled at runtime from public/data/source.json for Alena
}

/** A verbatim quote that MUST exist character-for-character in SourceDoc.text. */
export interface Citation { docId: string; quote: string }

export type FieldStatus = 'confirmed' | 'proposed' | 'missing' | 'conflict';
export type FieldGroup = 'Pacient' | 'Kontakty' | 'Diagnóza' | 'Anamnéza' | 'Stav' | 'Vyšetrenia' | 'Laboratórium' | 'Histológia' | 'Iné';

/** One of the 20 items of the VZP template "Handover_obsah". */
export interface HandoverField {
  key: string;
  label: string;          // Slovak label for laymen, e.g. "Výkonnostný stav (ECOG)"
  group: FieldGroup;
  value: string;          // short display value ("" when missing)
  status: FieldStatus;
  citations: Citation[];  // empty only when status === 'missing'
  sourceDate?: ISODate;   // date of the newest source used (for the as-of slider)
  note?: string;          // plain-language explanation shown under the value
  conflict?: {            // when status === 'conflict': both versions side by side, a human decides
    a: { value: string; citation: Citation };
    b: { value: string; citation: Citation };
    explain: string;
  };
  request?: { to: string; channel: SourceDoc['channel']; draft: string }; // when missing: prepared request
  resolvedBy?: { docId: string; value: string; citation: Citation };       // demo: the answer that turns it green
}

export type StepState = 'requested' | 'ordered' | 'done' | 'delivered';
export interface PathStep {
  id: string;
  title: string;          // "CT brucha a hrudníka"
  place: string;          // "KOC 1 · Nemocnica Severní"
  owner: string;          // who is on the move now ("rádiológia KOC 1", "ja (koordinátor)")
  due: ISODate;
  state: StepState;
  history: { state: StepState; date: ISODate }[];
  resultDocId?: string;
}

export interface LabRow { test: string; value: string; unit: string; ref?: string; flag?: 'H' | 'L'; date: ISODate; lab: string; docId: string }
export interface Medication { name: string; dose: string; note?: string; citation: Citation }
export interface Exam { date: ISODate; place: string; type: string; summary: string; docId: string }
export interface LogEntry { date: ISODate; time?: string; action: string; detail: string; billable: boolean } // billable = day with a coordinator intervention (výkon 51887)

export type CaseStatus = 'new' | 'active' | 'waiting' | 'postponed' | 'closed';
export interface Case {
  id: string;
  demo: 'full' | 'light';           // 'full' = Alena with all data; 'light' = queue filler
  patient: {
    firstName: string; lastName: string; age: number; sex: 'žena' | 'muž';
    insurerCode: string; insurerName: string; phone?: string;
    contact?: { name: string; relation: string; phone?: string };
  };
  referringGp: { name: string; practice: string; phone?: string; email?: string };
  diagnosisShort: string;           // "podozrenie na nádor hlavy pankreasu"
  koc: string;                      // "KOC 2 · Nemocnica Lipová"
  mdtDate?: ISODate;
  receivedAt: ISODate;              // referral received = clock start (Danish model)
  status: CaseStatus;
  nextStep: { text: string; owner: string; due: ISODate; mine: boolean };
  clockTargetDays: number;          // e.g. 33 (Danish pancreas pathway: 6 days to first visit + 27 to decision)
  fields: HandoverField[];
  steps: PathStep[];
  labs: LabRow[];
  meds: Medication[];
  exams: Exam[];
  docs: SourceDoc[];
  log: LogEntry[];
  precheck?: { findings: { text: string; severity: 'missing' | 'info' }[] }; // referral check before sending
  gpReport?: {                      // after MDT: conclusion for the GP
    question: string;               // GP's original question (citation-backed)
    answer: string;                 // MDT conclusion in plain words
    forYou: string[];               // "Čo to znamená pre vás, pán doktor"
    citations: Citation[];
  };
  reviewer?: { insurerCode: string; insurerName: string; note: string }; // routing to the right revízny lekár
}

/** Fixed demo "today" so the demo is deterministic. */
export const DEMO_TODAY: ISODate = '2026-10-19';
