// Browser adapter around the extractor (src/ai/extract.ts → extractHandover). Rules only: no server, no key,
// no network call. Measures how long one run takes and compares two runs (what changed after a new report or an edit).
import { extractHandover, type ExtractionResult } from '../../ai/extract.ts';
import type { Finding } from '../../ai/rules.ts';
import type { HandoverField, ISODate } from '../../types';
import { cz } from './cesky';
import { fieldLabel } from './liveData';

export type { ExtractionResult, Finding };

export interface EngineDoc { id: string; date: ISODate; title?: string; text: string }

export interface EngineRun {
  result: ExtractionResult;
  ms: number;          // duration of extractHandover in the browser
  n: number;           // run number since the screen opened
  docCount: number;
}

export async function runEngine(caseId: string, docs: EngineDoc[], asOf: ISODate): Promise<{ result: ExtractionResult; ms: number }> {
  const t0 = performance.now();
  const result = await extractHandover({ caseId, docs, asOf });
  return { result, ms: performance.now() - t0 };
}

/** A value is shown only with at least one verified citation (rule of the project). */
export function hasShownValue(f: HandoverField): boolean {
  return f.status !== 'missing' && !!f.value && f.citations.length > 0;
}

export function filledCount(r: ExtractionResult): number {
  return r.fields.filter(hasShownValue).length;
}

export type ShownStatus = 'confirmed' | 'proposed' | 'missing' | 'conflict';

export function shownStatus(f: HandoverField, confirmed: Record<string, string>): ShownStatus {
  if (!hasShownValue(f)) return 'missing';
  if (f.status === 'conflict') return 'conflict';
  return confirmed[f.key] === f.value ? 'confirmed' : 'proposed';
}

export const STATUS_CZ: Record<ShownStatus, string> = {
  confirmed: 'potvrzeno', proposed: 'návrh', missing: 'chybí', conflict: 'rozpor',
};
export const STATUS_TONE: Record<ShownStatus, 'mint' | 'amber' | 'coral' | 'orange'> = {
  confirmed: 'mint', proposed: 'amber', missing: 'coral', conflict: 'orange',
};

export const SEVERITY_CZ: Record<Finding['severity'], string> = { conflict: 'rozpor', missing: 'chybí', info: 'upozornění' };
export const SEVERITY_TONE: Record<Finding['severity'], 'orange' | 'coral' | 'sky'> = { conflict: 'orange', missing: 'coral', info: 'sky' };
const SEVERITY_ORDER: Record<Finding['severity'], number> = { conflict: 0, missing: 1, info: 2 };

export function sortFindings(fs: Finding[]): Finding[] {
  return [...fs].sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] || a.id.localeCompare(b.id));
}

/** Short Czech heading of a finding (the full sentence comes from the extractor). */
export function findingTitle(f: Finding, female: boolean): string {
  const id = f.id;
  const doc = (prefix: string) => id.slice(prefix.length);
  if (id.startsWith('date-conflict-')) return `Nemožné datum ve zprávě ${doc('date-conflict-')}`;
  if (id.startsWith('rc-mismatch-')) return `Jiné rodné číslo ve zprávě ${doc('rc-mismatch-')}`;
  if (id.startsWith('pending-')) return `Avizovaný dodatek nepřišel (zpráva ${doc('pending-')})`;
  if (id.startsWith('planned-')) return 'Plánovaná kontrola bez zprávy';
  switch (id) {
    case 'side-conflict': return 'Nesouhlasí strana nálezu';
    case 'location-conflict': return 'Nesouhlasí umístění nálezu';
    case 'allergy-conflict': return 'Alergie se v novější zprávě ztratila';
    case 'after-mdt': return 'Zprávy po datu konzilia';
    case 'ecog-missing': return 'Chybí stav výkonnosti (ECOG)';
    case 'patient-email-missing': return female ? 'Chybí e-mail pacientky' : 'Chybí e-mail pacienta';
    case 'gp-email-missing': return 'Chybí e-mail odesílajícího lékaře';
    case 'results-not-attached': return 'Žádanka nemá výsledky vyšetření';
    case 'emails-missing': return 'Chybí e-maily';
    default: return SEVERITY_CZ[f.severity];
  }
}

export interface FieldChange { key: string; label: string; from: ShownStatus; to: ShownStatus; valueChanged: boolean }
export interface RunDiff { fields: FieldChange[]; added: Finding[]; removed: Finding[]; filledFrom: number; filledTo: number }

export function diffRuns(prev: ExtractionResult | null, cur: ExtractionResult, female: boolean, confirmed: Record<string, string>): RunDiff | null {
  if (!prev) return null;
  const before = new Map(prev.fields.map((f) => [f.key, f]));
  const fields: FieldChange[] = [];
  for (const f of cur.fields) {
    const p = before.get(f.key);
    if (!p) continue;
    const from = shownStatus(p, confirmed);
    const to = shownStatus(f, confirmed);
    const valueChanged = hasShownValue(f) && hasShownValue(p) && cz(p.value) !== cz(f.value);
    if (from !== to || valueChanged) fields.push({ key: f.key, label: fieldLabel(f.key, female, f.label), from, to, valueChanged });
  }
  const prevIds = new Set(prev.findings.map((f) => f.id));
  const curIds = new Set(cur.findings.map((f) => f.id));
  return {
    fields,
    added: sortFindings(cur.findings.filter((f) => !prevIds.has(f.id))),
    removed: sortFindings(prev.findings.filter((f) => !curIds.has(f.id))),
    filledFrom: filledCount(prev),
    filledTo: filledCount(cur),
  };
}

/** First date written in a text ("20. 10. 2026" → "2026-10-20"), used for the date of a phone note. */
export function firstDate(text: string): ISODate | null {
  const m = text.match(/\b(\d{1,2})\.\s?(\d{1,2})\.\s?(\d{4})\b/);
  if (!m) return null;
  const d = Number(m[1]); const mo = Number(m[2]);
  if (d < 1 || d > 31 || mo < 1 || mo > 12) return null;
  return `${m[3]}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

/** Ranges of all quotes in a text (merged), for highlighting the original report. */
export function quoteRanges(text: string, quotes: string[]): [number, number][] {
  const out: [number, number][] = [];
  for (const q of quotes) {
    if (!q) continue;
    let at = text.indexOf(q);
    while (at >= 0) { out.push([at, at + q.length]); at = text.indexOf(q, at + q.length); }
  }
  out.sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [];
  for (const r of out) {
    const last = merged[merged.length - 1];
    if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
    else merged.push([r[0], r[1]]);
  }
  return merged;
}
