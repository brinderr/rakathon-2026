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

// the date of the MDT is a field the coordinator can change; for the demo case it is kept apart (its reports are fixed)
const DEMO_MDT = demo.mdtDate;
const MDT_KEY = 'ekoordinace:mdt:';
let demoMdt: string | null = null;
function readDemoMdt(): string {
  if (demoMdt === null) {
    try { demoMdt = window.localStorage.getItem(MDT_KEY + DEMO_ID) ?? DEMO_MDT; } catch { demoMdt = DEMO_MDT; }
  }
  return demoMdt;
}
const demoDocs: Report[] = Object.values(demo.documents).map((d) => ({ id: d.id, date: d.date, title: d.title, text: d.text }));

/** Change the date of the MDT of a patient; the case is rebuilt (only what was known by then goes into the podklad). */
export function setMdtDate(id: string, date: string) {
  if (id !== DEMO_ID) { updatePatient(id, (p) => ({ ...p, mdtDate: date })); return; }
  demoMdt = date;
  try { window.localStorage.setItem(MDT_KEY + DEMO_ID, date); } catch { /* keep in memory only */ }
  listeners.forEach((l) => l());
}

const built = new Map<string, { key: string; data: CaseData }>();

/** The case of one patient (null while its reports are being processed). */
export function useCaseOf(id: string): { data: CaseData | null; stored: StoredPatient | null; missing: boolean } {
  const stored = useStoredPatients().find((p) => p.id === id) ?? null;
  const mdtOfDemo = useSyncExternalStore(subscribe, readDemoMdt, readDemoMdt);
  const source = id === DEMO_ID
    ? (mdtOfDemo === DEMO_MDT ? null : { docs: demoDocs, today: SIM_TODAY, mdt: mdtOfDemo, label: demo.patient.name })
    : stored ? { docs: stored.docs, today: todayOf(stored), mdt: stored.mdtDate, label: stored.label } : null;
  const key = source ? JSON.stringify([source.label, source.mdt, source.docs.map((d) => [d.id, d.date, d.text.length])]) : '';
  const ready = (): CaseData | null => (id === DEMO_ID && !source ? demo : built.get(id)?.key === key ? built.get(id)!.data : null);
  const [data, setData] = useState<CaseData | null>(ready);
  useEffect(() => {
    const hit = ready();
    if (hit || !source) { setData(hit); return; }
    let alive = true;
    buildCase({ caseId: id, docs: source.docs, today: source.today, mdtDate: source.mdt, label: source.label })
      .then((d) => { built.set(id, { key, data: d }); if (alive) setData(d); });
    return () => { alive = false; };
    // the key covers everything the case is built from
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, key]);
  return { data, stored, missing: id !== DEMO_ID && !stored };
}

export const demoCase = demo;
