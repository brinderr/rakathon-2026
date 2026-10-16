import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { PathStep, StepState } from '../../types';
import { SK_STEP, STEP_ORDER, daysWord, fmtShort, stepLateDays, stepStateAt } from './caseUtils';
import { SourceChip } from './ui';
import { IcAlert, IcCheck, IcPerson, IcPin } from './icons';

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

export function StepCard({ step, asOf, col, onOpenDoc }: { step: PathStep; asOf: string; col: number; onOpenDoc: (docId: string) => void }) {
  const state = stepStateAt(step, asOf);
  const late = stepLateDays(step, state, asOf);
  const future = state === null;
  const done = state === 'delivered';
  return (
    <div className={`cs-step ${late ? 'is-late' : ''} ${future ? 'is-future' : ''} ${done ? 'is-done' : ''}`} data-col={col}>
      <div className="cs-step-top">
        <div className="cs-step-title">{step.title}</div>
        {done && <span className="cs-step-ok"><IcCheck size={14} /></span>}
        {late > 0 && <span className="cs-step-late"><IcAlert size={13} /> mešká {late} {daysWord(late)}</span>}
      </div>
      <div className="cs-step-place"><IcPin size={13} /> {step.place}</div>
      <Segments state={state} />
      <div className="cs-step-foot">
        <span className="cs-step-owner"><IcPerson size={13} /> {future ? 'ešte nevzniklo' : `na ťahu: ${step.owner}`}</span>
        <span className={`cs-step-due ${late ? 'is-late' : ''}`}>do {fmtShort(step.due)}</span>
      </div>
      {step.resultDocId && done && (
        <div className="cs-step-result">výsledok: <SourceChip docId={step.resultDocId} onClick={() => onOpenDoc(step.resultDocId!)} /></div>
      )}
    </div>
  );
}

export function Journey({ steps, asOf, mdtDate, onOpenDoc }: { steps: PathStep[]; asOf: string; mdtDate?: string; onOpenDoc: (docId: string) => void }) {
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
            {col.steps.map((s) => <StepCard key={s.id} step={s} asOf={asOf} col={ci} onOpenDoc={onOpenDoc} />)}
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
        return (
          <button type="button" key={s.id} className={`cs-strip-item ${st === 'delivered' ? 'is-done' : ''} ${late ? 'is-late' : ''} ${st === null ? 'is-future' : ''}`} onClick={onMore} title={`${s.title} · ${st ? SK_STEP[st] : 'ešte nevzniklo'} · do ${fmtShort(s.due)}`}>
            <span className="cs-strip-n">{i + 1}</span>
            <span className="cs-strip-t">{s.title}</span>
            <span className="cs-strip-s">{late ? `mešká ${late} ${daysWord(late)}` : st ? SK_STEP[st] : 'ešte nie'}</span>
          </button>
        );
      })}
    </div>
  );
}
