// The coordinator's patients: Alena (the demo case, precomputed) and patients added in the app with their reports.
// Added patients live in this browser (localStorage); their case is built from the reports in the browser with the
// shared engine (src/case/buildCase.ts). One empty patient is there from the start, to try adding reports. Owner: matej.
import { useEffect, useState, useSyncExternalStore } from 'react';
import { buildCase } from '../case/buildCase';
import type { Report } from '../case/buildCase';
import alena from '../data/alena.json';
import type { CaseData } from '../sections/pacient/types';

/** The simulated "today" of the demo (the VZP case is set in October 2026). */
export const SIM_TODAY = alena.today;

export interface StoredPatient { id: string; label: string; created: string; mdtDate: string; docs: Report[] }

export const DEMO_ID = 'alena';
const demo = alena as unknown as CaseData;
const KEY = 'ekoordinace:patients';
const SEED: StoredPatient[] = [{ id: 'novy-pacient', label: 'Nový pacient', created: SIM_TODAY, mdtDate: '', docs: [] }];

let cache: StoredPatient[] | null = null;
const listeners = new Set<() => void>();

function read(): StoredPatient[] {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    cache = raw ? (JSON.parse(raw) as StoredPatient[]) : SEED;
  } catch {
    cache = SEED;
  }
  return cache;
}

function write(next: StoredPatient[]) {
  cache = next;
  try { window.localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* keep in memory only */ }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) { listeners.add(l); return () => { listeners.delete(l); }; }

/** Patients added in the app (the demo patient is not in this list). */
export function useStoredPatients(): StoredPatient[] {
  return useSyncExternalStore(subscribe, read, read);
}

export function addPatient(label: string, mdtDate: string): string {
  const base = label.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'pacient';
  let id = base;
  for (let i = 2; read().some((p) => p.id === id) || id === DEMO_ID; i++) id = `${base}-${i}`;
  write([...read(), { id, label: label.trim() || 'Nový pacient', created: SIM_TODAY, mdtDate, docs: [] }]);
  return id;
}

export function updatePatient(id: string, fn: (p: StoredPatient) => StoredPatient) {
  write(read().map((p) => (p.id === id ? fn(p) : p)));
}

export function removePatient(id: string) {
  write(read().filter((p) => p.id !== id));
}

/** Next free report id for a patient ("01", "02", …). */
export function nextDocId(p: StoredPatient): string {
  const used = new Set(p.docs.map((d) => d.id));
  let n = p.docs.length + 1;
  while (used.has(String(n).padStart(2, '0'))) n++;
  return String(n).padStart(2, '0');
}

/** The day an added patient is looked at: the demo day, or the newest report if it is later. */
function todayOf(p: StoredPatient): string {
  return p.docs.reduce((d, x) => (x.date > d ? x.date : d), SIM_TODAY);
}

const built = new Map<string, { key: string; data: CaseData }>();

/** The case of one patient: the demo case at once, an added patient built from its reports (null while building). */
export function useCaseOf(id: string): { data: CaseData | null; stored: StoredPatient | null; missing: boolean } {
  const stored = useStoredPatients().find((p) => p.id === id) ?? null;
  const key = stored ? JSON.stringify([stored.label, stored.mdtDate, stored.docs.map((d) => [d.id, d.date, d.text.length])]) : '';
  const [data, setData] = useState<CaseData | null>(() => (id === DEMO_ID ? demo : built.get(id)?.key === key ? built.get(id)!.data : null));
  useEffect(() => {
    if (id === DEMO_ID) { setData(demo); return; }
    if (!stored) { setData(null); return; }
    const hit = built.get(id);
    if (hit?.key === key) { setData(hit.data); return; }
    let alive = true;
    buildCase({ caseId: id, docs: stored.docs, today: todayOf(stored), mdtDate: stored.mdtDate, label: stored.label })
      .then((d) => { built.set(id, { key, data: d }); if (alive) setData(d); });
    return () => { alive = false; };
  }, [id, key, stored]);
  return { data, stored, missing: id !== DEMO_ID && !stored };
}

export const demoCase = demo;
