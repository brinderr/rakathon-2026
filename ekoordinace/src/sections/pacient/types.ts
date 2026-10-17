// Shape of src/data/alena.json (written by scripts/build-case.mjs).
export type Status = 'done' | 'now' | 'waiting';

export interface DocRef { id: string; date: string; title: string; place: string; code: string; what?: string; isNew?: boolean }
export interface Person { role: string; name: string; phone?: string; note?: string }
export interface Quote { docId: string; quote: string }

export interface Todo {
  field: string;
  kind: string; // "chybí" | "rozpor"
  title: string;
  why: string;
  quotes: Quote[];
  contacts: Person[];
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
