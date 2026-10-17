// Demo state of a case that must survive leaving the screen (requests sent, answers arrived, conflicts verified,
// proposals confirmed, the coordinator's log of this session). Module-level store, no library.
// Other screens may read it: getCaseSession(id) / useCaseSession(id) / applySession(c, fieldsAsOf(c, asOf), asOf).
import { useSyncExternalStore } from 'react';
import type { Case, HandoverField, ISODate, LogEntry, SourceDoc } from '../../types';
import type { EffField, FieldOverride } from './caseUtils';
import { effectiveField } from './caseUtils';

export interface CaseSession {
  overrides: Record<string, FieldOverride>;
  arrived: SourceDoc[];      // the coordinator's own records written during the demo (phone notes, id T-…) – never medical reports
  log: LogEntry[];           // coordinator actions done in this session
  closedAt?: ISODate;        // set by the screen that closes the case (optional)
  acceptedAt?: ISODate;      // a new referral taken over by the coordinator („Prevziať žiadosť“)
}

const EMPTY: CaseSession = { overrides: {}, arrived: [], log: [] };
const store = new Map<string, CaseSession>();
const listeners = new Set<() => void>();
let version = 0;
let snapshot: { v: number; all: Record<string, CaseSession> } = { v: 0, all: {} };

export function getCaseSession(caseId: string): CaseSession {
  return store.get(caseId) ?? EMPTY;
}
export function updateCaseSession(caseId: string, fn: (s: CaseSession) => CaseSession): void {
  store.set(caseId, fn(getCaseSession(caseId)));
  version += 1;
  for (const l of listeners) l();
}
export function resetCaseSession(caseId: string): void {
  store.delete(caseId);
  version += 1;
  for (const l of listeners) l();
}
/** „Začať demo odznova“: forgets every demo action of every case. */
export function resetAllCaseSessions(): void {
  store.clear();
  version += 1;
  for (const l of listeners) l();
}
export function subscribeCaseSession(l: () => void): () => void {
  listeners.add(l);
  return () => { listeners.delete(l); };
}
/** All case sessions at once (stable object until something changes) – for the queue. */
export function getAllCaseSessions(): Record<string, CaseSession> {
  if (snapshot.v !== version) snapshot = { v: version, all: Object.fromEntries(store) };
  return snapshot.all;
}
export function useAllCaseSessions(): Record<string, CaseSession> {
  return useSyncExternalStore(subscribeCaseSession, getAllCaseSessions, getAllCaseSessions);
}
export function useCaseSession(caseId: string): CaseSession {
  return useSyncExternalStore(subscribeCaseSession, () => getCaseSession(caseId), () => getCaseSession(caseId));
}

/** Fields of a case with this session applied (for MdtDoc / Queue). `baseFields` = fieldsAsOf(c, asOf) from src/data/cases. */
export function applySession(c: Case, baseFields: HandoverField[], asOf: ISODate): EffField[] {
  const s = getCaseSession(c.id);
  const docsById: Record<string, SourceDoc> = {};
  for (const d of c.docs) docsById[d.id] = d;
  for (const d of s.arrived) docsById[d.id] = d;
  return baseFields.map((f, i) => effectiveField(f, i + 1, s.overrides[f.key], asOf, docsById));
}
