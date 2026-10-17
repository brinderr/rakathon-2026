// Helpers shared by the document screens. Pure functions over the Case contract (src/types.ts).
import type { Case, HandoverField, ISODate, SourceDoc } from '../../types';
import { CASES } from '../../data/cases';

/** "2026-10-21" → "21. 10. 2026" */
export function fmtDate(iso?: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return `${d}. ${m}. ${y}`;
}

/** Current clock time "HH:MM" (log entries added during the demo). */
export function nowTime(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function addDays(iso: ISODate, days: number): ISODate {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Adds working days (Mon–Fri), e.g. the 2-working-day limit for the GP conclusion. */
export function addBusinessDays(iso: ISODate, days: number): ISODate {
  let cur = iso; let left = days;
  while (left > 0) {
    cur = addDays(cur, 1);
    const wd = new Date(`${cur}T12:00:00`).getDay();
    if (wd !== 0 && wd !== 6) left--;
  }
  return cur;
}

export function findCase(caseId?: string): Case | undefined {
  return CASES.find(c => c.id === caseId) ?? CASES.find(c => c.demo === 'full') ?? CASES[0];
}
export function fullCase(): Case | undefined {
  return CASES.find(c => c.demo === 'full') ?? CASES[0];
}

export function docById(c: Case, id?: string): SourceDoc | undefined {
  return id ? c.docs.find(d => d.id === id) : undefined;
}

/** Date from which a document counts as "known": when the coordinator received it. */
export function docKnownAt(c: Case, id?: string): ISODate | undefined {
  const d = docById(c, id);
  return d?.receivedAt ?? d?.examDate;
}

/** First field whose key or label matches one of the patterns (patterns in order of preference). */
export function findField(fields: HandoverField[], ...patterns: RegExp[]): HandoverField | undefined {
  for (const p of patterns) {
    const f = fields.find(x => p.test(x.key) || p.test(x.label));
    if (f) return f;
  }
  return undefined;
}

/** Fictional, deterministic case number, e.g. KOC2-2026-0107. */
export function caseNumber(c: Case): string {
  const year = c.receivedAt.slice(0, 4);
  const kocNo = (c.koc.match(/\d+/) ?? ['2'])[0];
  const seq = c.docs.find(d => d.kind === 'request')?.id ?? c.id.slice(0, 2);
  return `KOC${kocNo}-${year}-01${seq.padStart(2, '0')}`;
}

/** Distinct days with a coordinator intervention (basis for výkon 51887, billed by the hospital). */
export function billableDays(c: Case): ISODate[] {
  return Array.from(new Set(c.log.filter(l => l.billable).map(l => l.date))).sort();
}

export const PROTO_NOTE = 'Prototyp · fiktívne dáta · nie je zdravotnícka pomôcka';

/** A value ready for display in a document, with its verbatim source. */
export interface Resolved {
  text: string;
  docId?: string;
  quote?: string;
  missing: boolean;
  note?: string;
  conflict?: HandoverField['conflict'];
}

export const MISSING = 'nie je v dokumentácii';

/**
 * Resolves a handover field to the value known at `asOf`.
 * - missing / empty → MISSING
 * - newest source after `asOf` → falls back to an older verbatim quote (the quote becomes the value)
 */
export function resolveField(c: Case, f: HandoverField | undefined, asOf: ISODate): Resolved {
  if (!f || f.status === 'missing' || !f.value) return { text: MISSING, missing: true };
  const okCites = f.citations.filter(ci => { const d = docKnownAt(c, ci.docId); return !d || d <= asOf; });
  const newest = f.sourceDate ?? '';
  if (!newest || newest <= asOf) {
    const ci = okCites[0] ?? f.citations[0];
    return { text: f.value, docId: ci?.docId, quote: ci?.quote, missing: false, conflict: f.conflict };
  }
  if (okCites.length) {
    const ci = okCites[0];
    return { text: ci.quote, docId: ci.docId, quote: ci.quote, missing: false, note: `stav k ${fmtDate(asOf)}` };
  }
  return { text: MISSING, missing: true };
}

export function plain(text: string, docId?: string): Resolved {
  return { text, docId, missing: false };
}

export function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  return Promise.reject(new Error('clipboard unavailable'));
}
