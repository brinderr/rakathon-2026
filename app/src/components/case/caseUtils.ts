// Helpers for the case / patient profile screen: Czech labels, dates, "as of" logic,
// tolerant normalizers for the data module (coded against CONTRACT.md + types.ts).
import type {
  Case, Citation, FieldGroup, FieldStatus, HandoverField, ISODate, LogEntry, PathStep, SourceDoc, StepState,
} from '../../types';
import { DEMO_TODAY } from '../../types';

/* ---------- labels (Czech, for laymen) ---------- */
export const SK_STATUS: Record<FieldStatus, string> = {
  confirmed: 'potvrzeno', proposed: 'návrh', missing: 'chybí', conflict: 'rozpor',
};
export const SK_STEP: Record<StepState, string> = {
  requested: 'vyžádáno', ordered: 'objednáno', done: 'provedeno', delivered: 'výsledek',
};
export const STEP_ORDER: StepState[] = ['requested', 'ordered', 'done', 'delivered'];
export const SK_CASE_STATUS: Record<Case['status'], string> = {
  new: 'nový', active: 'aktivní', waiting: 'čeká', postponed: 'odložený', closed: 'uzavřený',
};
export const SK_KIND: Record<SourceDoc['kind'], string> = {
  report: 'zpráva', result: 'výsledek', request: 'žádost',
};
/** The group names of HandoverField are fixed by src/types.ts (Slovak union); the screen shows them in Czech. */
export const GROUP_LABEL: Record<FieldGroup, string> = {
  Pacient: 'Pacient', Kontakty: 'Kontakty', Diagnóza: 'Diagnóza', Anamnéza: 'Anamnéza', Stav: 'Stav',
  Vyšetrenia: 'Vyšetření', Laboratórium: 'Laboratoř', Histológia: 'Histologie', Iné: 'Jiné',
};
export const groupLabel = (g: string): string => (GROUP_LABEL as Record<string, string>)[g] ?? g;

/* ---------- the coordinator's own records (phone call) ---------- */
/** Documents whose id starts with this prefix are the coordinator's own notes (a phone call), never a medical report. */
export const CALL_DOC_PREFIX = 'T-';
export const isCallDoc = (docId?: string): boolean => !!docId && docId.startsWith(CALL_DOC_PREFIX);

/* ---------- dates ---------- */
export function parseISO(iso: ISODate): Date {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return new Date(Date.UTC(y, (m || 1) - 1, d || 1, 12));
}
export function toISO(d: Date): ISODate {
  return d.toISOString().slice(0, 10);
}
export function fmtDate(iso?: ISODate): string {
  if (!iso) return '';
  const d = parseISO(iso);
  return `${d.getUTCDate()}. ${d.getUTCMonth() + 1}. ${d.getUTCFullYear()}`;
}
export function fmtShort(iso?: ISODate): string {
  if (!iso) return '';
  const d = parseISO(iso);
  return `${d.getUTCDate()}. ${d.getUTCMonth() + 1}.`;
}
export function daysBetween(a: ISODate, b: ISODate): number {
  return Math.round((parseISO(b).getTime() - parseISO(a).getTime()) / 86_400_000);
}
export function addDays(iso: ISODate, n: number): ISODate {
  const d = parseISO(iso);
  d.setUTCDate(d.getUTCDate() + n);
  return toISO(d);
}
/** Czech: 1 den, 2–4 dny, 5+ dní. */
export function daysWord(n: number): string {
  const a = Math.abs(n);
  if (a === 1) return 'den';
  if (a >= 2 && a <= 4) return 'dny';
  return 'dní';
}
// Times of demo actions are deterministic (demoClock.ts), never the real clock of the computer.

/* ---------- misc ---------- */
export function initials(first: string, last: string): string {
  return `${(first || '?')[0]}${(last || '?')[0]}`.toUpperCase();
}
export function docLabel(id: string): string {
  return isCallDoc(id) ? 'záznam koordinátorky' : `zpráva ${id}`;
}
export function plural(n: number, one: string, few: string, many: string): string {
  if (n === 1) return one;
  if (n >= 2 && n <= 4) return few;
  return many;
}

/* ---------- tolerant normalizers for the data module ---------- */
function isObj(x: unknown): x is Record<string, unknown> {
  return !!x && typeof x === 'object';
}

/** Accepts: SourceDoc[] | {documents:[...]} | Record<id, string | {text}> | Map → Record<id, text>. */
export function normalizeSources(raw: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (!raw) return out;
  if (raw instanceof Map) {
    for (const [k, v] of raw.entries()) {
      if (typeof v === 'string') out[String(k)] = v;
      else if (isObj(v) && typeof v.text === 'string') out[String(k)] = v.text;
    }
    return out;
  }
  if (Array.isArray(raw)) {
    for (const d of raw) if (isObj(d) && d.id != null && typeof d.text === 'string') out[String(d.id)] = d.text;
    return out;
  }
  if (isObj(raw)) {
    if (Array.isArray(raw.documents)) return normalizeSources(raw.documents);
    if (Array.isArray(raw.docs)) return normalizeSources(raw.docs);
    for (const [k, v] of Object.entries(raw)) {
      if (typeof v === 'string') out[k] = v;
      else if (isObj(v) && typeof v.text === 'string') out[k] = v.text;
    }
  }
  return out;
}

/** Accepts SourceDoc[] | Record<id, SourceDoc | string> → SourceDoc[] (with text when present). */
export function normalizeDocs(raw: unknown): SourceDoc[] {
  if (!raw) return [];
  const list: SourceDoc[] = [];
  const push = (id: string, v: unknown) => {
    if (typeof v === 'string') {
      list.push({ id, title: 'Doplněná zpráva', place: '', kind: 'report', examDate: DEMO_TODAY, receivedAt: DEMO_TODAY, channel: 'e-mail', text: v });
    } else if (isObj(v)) {
      list.push({
        id: String(v.id ?? id),
        title: String(v.title ?? 'Doplněná zpráva'),
        place: String(v.place ?? ''),
        kind: (v.kind as SourceDoc['kind']) ?? 'report',
        examDate: String(v.examDate ?? v.date ?? DEMO_TODAY),
        receivedAt: String(v.receivedAt ?? v.examDate ?? v.date ?? DEMO_TODAY),
        channel: (v.channel as SourceDoc['channel']) ?? 'e-mail',
        text: typeof v.text === 'string' ? v.text : undefined,
      });
    }
  };
  if (raw instanceof Map) { for (const [k, v] of raw.entries()) push(String(k), v); return list; }
  if (Array.isArray(raw)) { raw.forEach((v, i) => push(String(isObj(v) && v.id != null ? v.id : i), v)); return list; }
  if (isObj(raw)) {
    if (Array.isArray(raw.documents)) return normalizeDocs(raw.documents);
    for (const [k, v] of Object.entries(raw)) push(k, v);
  }
  return list;
}

/* ---------- quotes ---------- */
export function splitHighlight(text: string, quote: string): { before: string; match: string; after: string } | null {
  if (!text || !quote) return null;
  let i = text.indexOf(quote);
  if (i < 0) {
    // tolerate whitespace differences
    const norm = (s: string) => s.replace(/\s+/g, ' ').trim();
    const nt = norm(text), nq = norm(quote);
    const j = nt.indexOf(nq);
    if (j < 0) return null;
    // map back approximately by searching the first 24 chars of the quote
    const head = quote.trim().slice(0, 24);
    i = text.indexOf(head);
    if (i < 0) return null;
    return { before: text.slice(0, i), match: text.slice(i, i + quote.length), after: text.slice(i + quote.length) };
  }
  return { before: text.slice(0, i), match: text.slice(i, i + quote.length), after: text.slice(i + quote.length) };
}

/** A quote used as a stand-in value for the as-of view ("Hmotnost 65 kg." → "Hmotnost 65 kg"). */
export function quoteAsValue(q: string): string {
  return q.trim().replace(/[.;]$/, '');
}

/* ---------- grammar helpers ---------- */
/** "pacientka / pacientku / pacientky" vs "pacient / pacienta / pacienta" – so no screen hard-codes the female form. */
export function patientWords(sex: Case['patient']['sex']): { nom: string; acc: string; gen: string } {
  return sex === 'muž' ? { nom: 'pacient', acc: 'pacienta', gen: 'pacienta' } : { nom: 'pacientka', acc: 'pacientku', gen: 'pacientky' };
}

/** Who produced the field's text (optional `origin` on HandoverField, added by the data/AI side; tolerant read). */
export type FieldOrigin = 'manual' | 'rules' | 'ai';
export function fieldOrigin(f: HandoverField): FieldOrigin | undefined {
  const o = (f as HandoverField & { origin?: unknown }).origin;
  return o === 'manual' || o === 'rules' || o === 'ai' ? o : undefined;
}

/* ---------- "as of" logic ---------- */
export type EffStatus = FieldStatus | 'pending' | 'future';

/** Demo actions of the coordinator on a field. A decision/confirmation never changes the field's value or citations.
 *  'resolved' with via 'call' = the coordinator wrote down a phone call herself („Zapsat telefonát“): the citation is her
 *  note (document id with CALL_DOC_PREFIX), clearly marked as her record, never as a medical report. */
export type FieldOverride =
  | { kind: 'pending'; to: string; channel: string; sentAt: ISODate; reason: 'missing' | 'conflict' }
  | { kind: 'resolved'; value: string; citation: Citation; docId: string; date: ISODate; note: string; via?: 'report' | 'call'; by?: string }
  | { kind: 'decided'; which: 'a' | 'b'; by: string; date: ISODate; note: string }   // conflict verified by a human
  | { kind: 'confirmed'; date: ISODate; note: string };                              // proposal checked against the source

export const isCallOverride = (ov?: FieldOverride): boolean => ov?.kind === 'resolved' && (ov.via === 'call' || isCallDoc(ov.docId));

export interface EffField {
  field: HandoverField;
  index: number;              // 1-based position in the 20-item template
  status: EffStatus;
  value: string;
  citations: Citation[];
  sourceDate?: ISODate;
  note?: string;
  asOfNote?: string;          // explanation when an older source was used for the chosen date
  override?: FieldOverride;
}

export function docDate(d: SourceDoc): ISODate {
  return d.receivedAt || d.examDate;
}

export function effectiveField(
  f: HandoverField, index: number, ov: FieldOverride | undefined, asOf: ISODate, docsById: Record<string, SourceDoc>,
): EffField {
  const base: EffField = {
    field: f, index, status: f.status, value: f.value, citations: f.citations, sourceDate: f.sourceDate, note: f.note, override: ov,
  };
  if (ov?.kind === 'pending') {
    // a conflict stays visible (both versions) while the clarification is on its way; the panel shows the pending box
    if (ov.reason === 'conflict') return base;
    return { ...base, status: 'pending', value: '', citations: [] };
  }
  if (ov?.kind === 'resolved') {
    if (ov.date > asOf) return { ...base, status: 'future', value: '', citations: [], sourceDate: ov.date };
    return { ...base, status: 'confirmed', value: ov.value, citations: [ov.citation], sourceDate: ov.date, note: ov.note };
  }
  let out = base;
  if (f.sourceDate && f.sourceDate > asOf) {
    // newest citation whose document was already received by asOf
    const older = f.citations
      .map((c) => ({ c, d: docsById[c.docId] }))
      .filter((x) => x.d && docDate(x.d) <= asOf)
      .sort((a, b) => (docDate(b.d) > docDate(a.d) ? 1 : -1));
    if (older.length) {
      const { c, d } = older[0];
      out = {
        ...base, status: f.status === 'missing' ? 'missing' : 'confirmed', value: quoteAsValue(c.quote), citations: [c],
        sourceDate: docDate(d), asOfNote: `k ${fmtDate(asOf)} podle zprávy ${c.docId} (${fmtShort(d.examDate)})`,
      };
    } else {
      out = { ...base, status: 'future', value: '', citations: [] };
    }
  }
  // a human verified the conflict / confirmed the proposal: value and citations stay, only the status and the note change
  if ((ov?.kind === 'decided' || ov?.kind === 'confirmed') && ov.date <= asOf && (out.status === 'conflict' || out.status === 'proposed')) {
    return { ...out, status: 'confirmed', note: out.note ? `${ov.note} · ${out.note}` : ov.note };
  }
  return out;
}

export function stepStateAt(step: PathStep, asOf: ISODate): StepState | null {
  if (!step.history || step.history.length === 0) return step.state;
  const seen = step.history.filter((h) => h.date <= asOf).sort((a, b) => (a.date < b.date ? -1 : 1));
  if (!seen.length) return null;
  // the furthest state reached so far (history should be monotonic, but be safe)
  let best: StepState = seen[0].state;
  for (const h of seen) if (STEP_ORDER.indexOf(h.state) > STEP_ORDER.indexOf(best)) best = h.state;
  return best;
}

export function stepLateDays(step: PathStep, state: StepState | null, asOf: ISODate): number {
  if (!state || state === 'delivered') return 0;
  const n = daysBetween(step.due, asOf);
  return n > 0 ? n : 0;
}

export function visibleLog(log: LogEntry[], asOf: ISODate): LogEntry[] {
  return log.filter((e) => e.date <= asOf).sort((a, b) => (a.date === b.date ? (a.time || '').localeCompare(b.time || '') : a.date < b.date ? -1 : 1));
}

/* ---------- days since the referral was received (no foreign target in the UI) ---------- */
export function clockDay(c: Case, asOf: ISODate): number {
  return Math.max(0, daysBetween(c.receivedAt, asOf));
}

/* ---------- labels for effective statuses ---------- */
export const STATUS_LABEL: Record<EffStatus, string> = {
  confirmed: 'potvrzeno', proposed: 'návrh', missing: 'chybí', conflict: 'rozpor', pending: 'čeká na odpověď', future: 'zatím neznámé',
};

/* ---------- counts for the metrics / legend ---------- */
export interface Counts { confirmed: number; proposed: number; missing: number; conflict: number; pending: number; future: number; noSource: number; total: number }

export function countFields(fields: EffField[]): Counts {
  const c: Counts = { confirmed: 0, proposed: 0, missing: 0, conflict: 0, pending: 0, future: 0, noSource: 0, total: fields.length };
  for (const f of fields) {
    c[f.status] += 1;
    if (f.status !== 'missing' && f.status !== 'future' && f.status !== 'pending' && f.citations.length === 0) c.noSource += 1;
  }
  return c;
}
