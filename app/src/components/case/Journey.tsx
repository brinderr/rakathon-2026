import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { PathStep, StepState } from '../../types';
import { SK_STEP, STEP_ORDER, daysBetween, daysWord, fmtShort, stepLateDays, stepStateAt } from './caseUtils';
import { Btn, SourceChip } from './ui';
import { IcAlert, IcCheck, IcPerson, IcPin, IcSend } from './icons';

interface Col { name: string; steps: PathStep[] }

function buildColumns(steps: PathStep[], mdtDate?: string): Col[] {
  const sorted = [...steps].sort((a, b) => (a.due < b.due ? -1 : a.due > b.due ? 1 : 0));
  if (!mdtDate) return [{ name: 'Kroky cesty', steps: sorted }];
  const isMdt = (s: PathStep) => /konz[ií]li/i.test(s.title) || /mdt/i.test(s.title) || /mdt|konzilium|mdt/i.test(s.id);
  const before = sorted.filter((s) => !isMdt(s) && s.due <= mdtDate);
  const mdt = sorted.filter(isMdt);
  const after = sorted.filter((s) => !isMdt(s) && s.due > mdtDate);
  const cols: Col[] = [];
  if (before.length) cols.push({ name: 'Diagnostika pred konzíliom', steps: before });
  if (mdt.length) cols.push({ name: 'Konzílium', steps: mdt });
  if (after.length) cols.push({ name: 'Po konzíliu', steps: after });
  return cols;
}

/** When the result was delivered (by asOf) and how many days after the promised date. */
export function deliveryInfo(step: PathStep, asOf: string): { at?: string; late: number } {
  const at = step.history.find((h) => h.state === 'delivered' && h.date <= asOf)?.date;
  return { at, late: at ? Math.max(0, daysBetween(step.due, at)) : 0 };
}

function Segments({ state }: { state: StepState | null }) {
  const idx = state ? STEP_ORDER.indexOf(state) : -1;
  return (
    <div className="cs-segs" aria-label={state ? `stav: ${SK_STEP[state]}` : 'ešte nevzniklo'}>
      {STEP_ORDER.map((s, i) => (
        <span key={s} className={`cs-seg ${i <= idx ? 'is-on' : ''} ${i === idx ? 'is-cur' : ''}`} title={SK_STEP[s]}>
          <span className="cs-seg-bar" /><span className="cs-seg-l">{SK_STEP[s]}</span>
        </span>
      ))}
    </div>
  );
}

export function StepCard({ step, asOf, col, urgedAt, onOpenDoc, onUrge }:
  { step: PathStep; asOf: string; col: number; urgedAt?: string; onOpenDoc: (docId: string) => void; onUrge?: (step: PathStep) => void }) {
  const state = stepStateAt(step, asOf);
  const late = stepLateDays(step, state, asOf);
  const future = state === null;
  const done = state === 'delivered';
  const dl = deliveryInfo(step, asOf);
  const lateDone = done ? dl.late : 0;
  return (
    <div className={`cs-step ${late ? 'is-late' : ''} ${future ? 'is-future' : ''} ${done ? 'is-done' : ''} ${lateDone ? 'is-latedone' : ''}`} data-col={col}>
      <div className="cs-step-top">
        <div className="cs-step-title">{step.title}</div>
        {done && !lateDone && <span className="cs-step-ok"><IcCheck size={14} /></span>}
        {late > 0 && <span className="cs-step-late"><IcAlert size={13} /> mešká {late} {daysWord(late)}</span>}
        {lateDone > 0 && <span className="cs-step-late is-after"><IcCheck size={13} /> {lateDone} {daysWord(lateDone)} po termíne</span>}
      </div>
      <div className="cs-step-place"><IcPin size={13} /> {step.place}</div>
      <Segments state={state} />
      <div className="cs-step-foot">
        <span className="cs-step-owner"><IcPerson size={13} /> {future ? 'ešte nevzniklo' : `na ťahu: ${step.owner}`}</span>
        <span className={`cs-step-due ${late ? 'is-late' : ''}`}>do {fmtShort(step.due)}</span>
      </div>
      {done && (
        <div className="cs-step-result">
          výsledok {dl.at ? fmtShort(dl.at) : ''}
          {step.resultDocId && <> · <SourceChip docId={step.resultDocId} onClick={() => onOpenDoc(step.resultDocId!)} /></>}
          {lateDone > 0 && <span className="cs-step-after"> · {lateDone} {daysWord(lateDone)} po termíne{urgedAt ? ` · urgované ${fmtShort(urgedAt)}` : ''}</span>}
        </div>
      )}
      {!done && urgedAt && urgedAt <= asOf && <div className="cs-step-result cs-step-after">urgované {fmtShort(urgedAt)}</div>}
      {late > 0 && onUrge && (
        <div className="cs-step-urge">
          <Btn size="sm" variant="secondary" icon={<IcSend size={14} />} onClick={() => onUrge(step)} title={`Urgovať: ${step.place}`}>
            {urgedAt && urgedAt <= asOf ? 'Urgovať znova' : 'Urgovať'}
          </Btn>
        </div>
      )}
    </div>
  );
}

export function Journey({ steps, asOf, mdtDate, urgedAt, onOpenDoc, onUrge }:
  { steps: PathStep[]; asOf: string; mdtDate?: string; urgedAt?: Record<string, string>; onOpenDoc: (docId: string) => void; onUrge?: (step: PathStep) => void }) {
  const cols = useMemo(() => buildColumns(steps, mdtDate), [steps, mdtDate]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [paths, setPaths] = useState<string[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const compute = () => {
      const rect = wrap.getBoundingClientRect();
      const byCol: Record<number, DOMRect[]> = {};
      wrap.querySelectorAll<HTMLElement>('[data-col]').forEach((el) => {
        const i = Number(el.dataset.col);
        (byCol[i] ||= []).push(el.getBoundingClientRect());
      });
      const out: string[] = [];
      for (let i = 0; i < cols.length - 1; i++) {
        for (const f of byCol[i] || []) {
          for (const t of byCol[i + 1] || []) {
            const fx = f.right - rect.left, fy = f.top + f.height / 2 - rect.top;
            const tx = t.left - rect.left, ty = t.top + t.height / 2 - rect.top;
            const mx = (fx + tx) / 2;
            out.push(`M${fx},${fy} C${mx},${fy} ${mx},${ty} ${tx},${ty}`);
          }
        }
      }
      setPaths(out);
      setSize({ w: rect.width, h: rect.height });
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [cols, asOf]);

  if (!steps.length) return <div className="cs-empty">Cesta zatiaľ nemá kroky.</div>;
  return (
    <div className="cs-journey" ref={wrapRef}>
      <svg className="cs-journey-lines" width={size.w} height={size.h} aria-hidden="true">
        {paths.map((d, i) => <path key={i} d={d} />)}
      </svg>
      {cols.map((col, ci) => (
        <div className="cs-col" key={col.name}>
          <div className="cs-col-name">{col.name}<span>{col.steps.length}</span></div>
          <div className="cs-col-cards">
            {col.steps.map((s) => <StepCard key={s.id} step={s} asOf={asOf} col={ci} urgedAt={urgedAt?.[s.id]} onOpenDoc={onOpenDoc} onUrge={onUrge} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Compact strip for the overview tab: one chip per step with its state dot. */
export function StepsStrip({ steps, asOf, onMore }: { steps: PathStep[]; asOf: string; onMore: () => void }) {
  const sorted = [...steps].sort((a, b) => (a.due < b.due ? -1 : 1));
  return (
    <div className="cs-strip">
      {sorted.map((s, i) => {
        const st = stepStateAt(s, asOf);
        const late = stepLateDays(s, st, asOf);
        const lateDone = st === 'delivered' ? deliveryInfo(s, asOf).late : 0;
        const label = late ? `mešká ${late} ${daysWord(late)}` : lateDone ? `výsledok · ${lateDone} ${daysWord(lateDone)} po termíne` : st ? SK_STEP[st] : 'ešte nie';
        return (
          <button type="button" key={s.id} className={`cs-strip-item ${st === 'delivered' ? 'is-done' : ''} ${late ? 'is-late' : ''} ${lateDone ? 'is-latedone' : ''} ${st === null ? 'is-future' : ''}`} onClick={onMore} title={`${s.title} · ${st ? SK_STEP[st] : 'ešte nevzniklo'} · do ${fmtShort(s.due)}`}>
            <span className="cs-strip-n">{i + 1}</span>
            <span className="cs-strip-t">{s.title}</span>
            <span className="cs-strip-s">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
