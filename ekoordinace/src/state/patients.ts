// The coordinator's patients: Alena (the demo case, precomputed) and patients added in the app with their reports.
// Added patients live in this browser (localStorage); their case is built from the reports in the browser with the
// shared engine (src/case/buildCase.ts). One empty patient is there from the start, to try adding reports. Owner: matej.
import { useEffect, useState, useSyncExternalStore } from 'react';
import { buildCase } from '../case/buildCase';
import type { Report } from '../case/buildCase';
import novak from '../../../app/data-pacient-2/source-pacient-2.json';
import alena from '../data/alena.json';
import type { CaseData } from '../sections/pacient/types';

/** The simulated "today" of the demo (the VZP case is set in October 2026). */
export const SIM_TODAY = alena.today;

/** An added report; `source` = how its text was read ('ocr' = recognized from a picture, to be checked). */
export interface StoredReport extends Report {
  source?: 'docx' | 'text' | 'rtf' | 'pdf' | 'ocr';
  /** when the coordinator added it to the app (ISO time) – the AI assistant can answer "kdy přišla …" */
  added?: string;
}
export interface StoredPatient { id: string; label: string; created: string; mdtDate: string; docs: StoredReport[] }

export const DEMO_ID = 'alena';
const demo = alena as unknown as CaseData;
const KEY = 'ekoordinace:patients';
// a second fictional patient (lung cancer, our test set 2) so the overview has more than one case; reports known by today
const NOVAK: StoredPatient = {
  id: 'josef-novak', label: 'Josef Novák', created: SIM_TODAY, mdtDate: novak.mdtDate,
  docs: novak.documents.filter((d) => d.date <= SIM_TODAY).map((d) => ({ id: d.id, date: d.date, title: d.file.replace(/\.txt$/, ''), text: d.text })),
};
const SEED: StoredPatient[] = [NOVAK, { id: 'novy-pacient', label: 'Nový pacient', created: SIM_TODAY, mdtDate: '', docs: [] }];

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

interface Source { docs: Report[]; today: string; mdt: string; label: string }

/** What a patient's case is built from (null = the precomputed demo case, or a patient that does not exist). */
function sourceOf(id: string, stored: StoredPatient | null, mdtOfDemo: string): Source | null {
  if (id === DEMO_ID) return mdtOfDemo === DEMO_MDT ? null : { docs: demoDocs, today: SIM_TODAY, mdt: mdtOfDemo, label: demo.patient.name };
  return stored ? { docs: stored.docs, today: todayOf(stored), mdt: stored.mdtDate, label: stored.label } : null;
}
const keyOf = (src: Source | null) => (src ? JSON.stringify([src.label, src.mdt, src.docs.map((d) => [d.id, d.date, d.text.length])]) : '');
const cached = (id: string, src: Source | null): CaseData | null =>
  id === DEMO_ID && !src ? demo : built.get(id)?.key === keyOf(src) ? built.get(id)!.data : null;
const build = (id: string, src: Source) => buildCase({ caseId: id, docs: src.docs, today: src.today, mdtDate: src.mdt, label: src.label })
  .then((d) => { built.set(id, { key: keyOf(src), data: d }); return d; });

/** The case of one patient (null while its reports are being processed). */
export function useCaseOf(id: string): { data: CaseData | null; stored: StoredPatient | null; missing: boolean } {
  const stored = useStoredPatients().find((p) => p.id === id) ?? null;
  const mdtOfDemo = useSyncExternalStore(subscribe, readDemoMdt, readDemoMdt);
  const source = sourceOf(id, stored, mdtOfDemo);
  const key = keyOf(source);
  const [data, setData] = useState<CaseData | null>(() => cached(id, source));
  useEffect(() => {
    const hit = cached(id, source);
    if (hit || !source) { setData(hit); return; }
    let alive = true;
    void build(id, source).then((d) => { if (alive) setData(d); });
    return () => { alive = false; };
    // the key covers everything the case is built from
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, key]);
  return { data, stored, missing: id !== DEMO_ID && !stored };
}

/** Every patient's case – the demo and the added ones (data null while being built). For the overview and the MDTs. */
export function useAllCases(): { id: string; label: string; data: CaseData | null }[] {
  const stored = useStoredPatients();
  const mdtOfDemo = useSyncExternalStore(subscribe, readDemoMdt, readDemoMdt);
  const [, rerender] = useState(0);
  const all = [
    { id: DEMO_ID, label: demo.patient.name, src: sourceOf(DEMO_ID, null, mdtOfDemo) },
    ...stored.map((p) => ({ id: p.id, label: p.label, src: sourceOf(p.id, p, mdtOfDemo) })),
  ];
  const keys = all.map((x) => `${x.id}:${keyOf(x.src)}`).join('|');
  useEffect(() => {
    let alive = true;
    for (const x of all) if (x.src && !cached(x.id, x.src)) void build(x.id, x.src).then(() => { if (alive) rerender((n) => n + 1); });
    return () => { alive = false; };
    // the keys cover everything the cases are built from
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys]);
  return all.map((x) => ({ id: x.id, label: x.label, data: cached(x.id, x.src) }));
}

export const demoCase = demo;
