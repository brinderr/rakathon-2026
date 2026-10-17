// What the coordinator did in the app – data she added (e.g. ECOG from a phone call), conflicts she resolved, the
// doctor's confirmation and every message sent or received. Shared by all sections: the overview, the queue and the
// documents read the same state. Kept in this browser (localStorage) so the demo survives a reload. Owner: matej.
import { useSyncExternalStore } from 'react';
import type { Conclusion } from './zaver';

export type EventKind =
  | 'telefonat' | 'overeno' | 'potvrzeno' | 'vyzadano' | 'sms' | 'email' | 'odeslano' | 'doruceno' | 'precteno' | 'poznamka';

/** One line of the coordination record: who did what and when (simulated date of the case, real time of day). */
export interface CaseEvent { at: string; who: string; kind: EventKind; text: string; field?: string; docId?: string }
export interface Added { value: string; source: string; at: string; who: string }
export interface Resolution { note: string; at: string; who: string; with?: string }
/** An item the coordinator leaves as it is (e.g. no time before the MDT) – it goes into the podklad marked as unverified. */
export interface Waiver { reason: string; at: string; who: string }

export interface CaseState {
  /** field key → value added by the coordinator */
  added: Record<string, Added>;
  /** to-do / finding key → how it was resolved */
  resolved: Record<string, Resolution>;
  /** field key → left as it is, with the reason */
  waived: Record<string, Waiver>;
  /** the handover confirmed by a doctor */
  confirmed?: { by: string; at: string };
  /** the conclusion of the MDT for the GP and its delivery receipt (state/zaver.ts) */
  conclusion?: Conclusion;
  /** the coordination record, oldest first */
  events: CaseEvent[];
}

const KEY = 'ekoordinace:case:';
const empty = (): CaseState => ({ added: {}, resolved: {}, waived: {}, events: [] });
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

let version = 0;

function write(caseId: string, next: CaseState) {
  version++;
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

/** The state of any case, for views across patients; re-renders when any case changes. */
export function useCaseStates(): (caseId: string) => CaseState {
  useSyncExternalStore(subscribe, () => version, () => version);
  return read;
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

/** The coordinator using the app (shown in the side menu). */
export const ME = 'Bc. Lucie Dvořáková';

/** A value the coordinator found out (e.g. ECOG from the GP on the phone): it fills a missing field. */
export function addValue(caseId: string, day: string, field: string, value: string, from: string) {
  const at = stamp(day);
  updateCase(caseId, (s) => ({
    ...s,
    added: { ...s.added, [field]: { value, source: `telefonát – ${from}`, at, who: ME } },
    confirmed: undefined, // a change after the doctor's confirmation needs a new one
    events: [...s.events, { at, who: ME, kind: 'telefonat', text: `${from}: ${value}`, field }],
  }));
}

/** A conflict the coordinator checked with the workplace: what she found out and with whom. */
export function resolveField(caseId: string, day: string, field: string, note: string, withWhom: string) {
  const at = stamp(day);
  updateCase(caseId, (s) => ({
    ...s,
    resolved: { ...s.resolved, [field]: { note, at, who: ME, with: withWhom } },
    confirmed: undefined,
    events: [...s.events, { at, who: ME, kind: 'overeno', text: `${withWhom}: ${note}`, field }],
  }));
}

/** Undo an added value or a check (both kept in the record as a note). */
export function undoField(caseId: string, day: string, field: string) {
  updateCase(caseId, (s) => {
    const added = { ...s.added };
    const resolved = { ...s.resolved };
    const waived = { ...s.waived };
    delete added[field];
    delete resolved[field];
    delete waived[field];
    return { ...s, added, resolved, waived, confirmed: undefined, events: [...s.events, { at: stamp(day), who: ME, kind: 'poznamka', text: 'zápis vrácen', field }] };
  });
}

/** Has the coordinator already dealt with this field? */
export function isSettled(s: CaseState, field: string): boolean {
  return Boolean(s.added[field] || s.resolved[field] || s.waived?.[field]);
}

/** The doctor confirms the podklad for the MDT (any later change of the data cancels it). */
export function confirmCase(caseId: string, day: string, by: string) {
  const at = stamp(day);
  updateCase(caseId, (s) => ({ ...s, confirmed: { by, at }, events: [...s.events, { at, who: by, kind: 'potvrzeno', text: 'podklad pro konzilium potvrzen' }] }));
}

export function unconfirmCase(caseId: string, day: string) {
  updateCase(caseId, (s) => ({ ...s, confirmed: undefined, events: [...s.events, { at: stamp(day), who: ME, kind: 'poznamka', text: 'potvrzení podkladu zrušeno' }] }));
}

/** Why an item is left as it is – one click; she can also write her own reason. */
export const WAIVE_REASONS = ['Nestihne se do konzilia', 'Výsledek dodá pracoviště později', 'Pro konzilium není podstatné'];

/** Leave an item as it is (no time before the MDT, the result comes later …); the podklad shows it as unverified. */
export function waiveField(caseId: string, day: string, field: string, reason: string) {
  const at = stamp(day);
  updateCase(caseId, (s) => ({
    ...s,
    waived: { ...s.waived, [field]: { reason, at, who: ME } },
    confirmed: undefined,
    events: [...s.events, { at, who: ME, kind: 'poznamka', text: `ponecháno bez ověření: ${reason}`, field }],
  }));
}
