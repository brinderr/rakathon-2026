// What the coordinator did in the app – data she added (e.g. ECOG from a phone call), conflicts she resolved, the
// doctor's confirmation and every message sent or received. Shared by all sections: the overview, the queue and the
// documents read the same state. Kept in this browser (localStorage) so the demo survives a reload. Owner: matej.
import { useSyncExternalStore } from 'react';

export type EventKind =
  | 'telefonat' | 'overeno' | 'potvrzeno' | 'vyzadano' | 'sms' | 'email' | 'odeslano' | 'doruceno' | 'precteno' | 'poznamka';

/** One line of the coordination record: who did what and when (simulated date of the case, real time of day). */
export interface CaseEvent { at: string; who: string; kind: EventKind; text: string; field?: string; docId?: string }
export interface Added { value: string; source: string; at: string; who: string }
export interface Resolution { note: string; at: string; who: string }

export interface CaseState {
  /** field key → value added by the coordinator */
  added: Record<string, Added>;
  /** to-do / finding key → how it was resolved */
  resolved: Record<string, Resolution>;
  /** the handover confirmed by a doctor */
  confirmed?: { by: string; at: string };
  /** the coordination record, oldest first */
  events: CaseEvent[];
}

const KEY = 'ekoordinace:case:';
const empty = (): CaseState => ({ added: {}, resolved: {}, events: [] });
const cache = new Map<string, CaseState>();
const listeners = new Set<() => void>();

function read(caseId: string): CaseState {
  const hit = cache.get(caseId);
  if (hit) return hit;
  let state = empty();
  try {
    const raw = window.localStorage.getItem(KEY + caseId);
    if (raw) state = { ...empty(), ...JSON.parse(raw) };
  } catch { /* private mode or blocked storage: start empty */ }
  cache.set(caseId, state);
  return state;
}

function write(caseId: string, next: CaseState) {
  cache.set(caseId, next);
  try { window.localStorage.setItem(KEY + caseId, JSON.stringify(next)); } catch { /* keep it in memory only */ }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

/** Current state of one case; re-renders when anything changes it. */
export function useCase(caseId: string): CaseState {
  return useSyncExternalStore(subscribe, () => read(caseId), () => read(caseId));
}

export function updateCase(caseId: string, fn: (s: CaseState) => CaseState) {
  write(caseId, fn(read(caseId)));
}

/** "2026-10-19T10:12" – the simulated day of the case with the real time of day. */
export function stamp(day: string): string {
  const now = new Date();
  return `${day}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

export function addEvent(caseId: string, day: string, e: Omit<CaseEvent, 'at'>) {
  updateCase(caseId, (s) => ({ ...s, events: [...s.events, { ...e, at: stamp(day) }] }));
}

/** "Obnovit demo": forget everything done in this browser. */
export function resetCase(caseId: string) {
  try { window.localStorage.removeItem(KEY + caseId); } catch { /* nothing stored */ }
  write(caseId, empty());
}
