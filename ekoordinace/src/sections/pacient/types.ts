// Shape of src/data/alena.json (written by scripts/build-case.mjs).
export type Status = 'done' | 'now' | 'waiting';

export interface DocRef { id: string; date: string; title: string; place: string; code: string; ref: string; what?: string; isNew?: boolean }
export interface Person { role: string; name: string; phone?: string; note?: string }
/** `ref` = how the coordinator calls the report ("protokol biopsie 12. 10."), not the dataset number. */
export interface Quote { docId: string; ref?: string; quote: string }

export interface Todo {
  field: string;
  kind: string; // "chybí" | "rozpor"
  title: string;
  why: string;
  quotes: Quote[];
  contacts: Person[];
  /** the engine's draft of a request for what is missing (e.g. ECOG, a histology addendum) */
  request?: { to: string; channel: string; draft: string };
}

export interface Step {
  id: string;
  label: string; // short, for the stepper
  title: string; // full, for the panel
  status: Status;
  short: string; // date or count under the label
  date?: string;
  due?: string;
  summary?: string;
  request?: Quote; // what the GP asks for, verbatim from the referral
  docs?: DocRef[];
  todo?: Todo[];
}

/** One of the 20 items of Handover_obsah as shown in "Údaje pro konzilium". */
export interface Field {
  key: string; label: string; group: string; value: string;
  /** nalezeno | neúplné | chybí | rozpor; after the coordinator dealt with it: doplněno | ověřeno */
  status: string;
  issue: string;
  quotes: Quote[];
  /** when something is missing or does not add up: what to do, whom to call, the sentences behind it */
  todo?: { title: string; contacts: Person[]; quotes: Quote[] };
  /** what the coordinator wrote down about it (src/sections/pacient/live.ts) */
  note?: string;
}

/** Everything eKoordinace shows about one patient (src/case/buildCase.ts; precomputed for Alena in src/data/alena.json). */
export interface CaseData {
  generatedFrom: string;
  today: string;
  /** date of the MDT, '' when not planned yet */
  mdtDate: string;
  patient: {
    name: string; initials: string; sex: string; born: string; age: string;
    insurer: { code: string; short: string; name: string };
    diagnosis: { code: string; text: string; source: string; docId: string };
    phone?: string;
    contactPerson: Person | null;
    gp: Person;
  };
  stats: { fields: number; ready: number; missing: number; conflicts: number };
  fields: Field[];
  news: { id: string; what: string; dept: string }[];
  documents: Record<string, DocRef & { text: string }>;
  afterMdt: DocRef[];
  steps: Step[];
}
