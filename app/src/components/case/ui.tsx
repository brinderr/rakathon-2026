// Small presentational primitives used only inside the case screen (self-contained so the
// screen does not depend on another agent's component API).
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import type { EffStatus } from './caseUtils';
import { STATUS_LABEL, docLabel, isCallDoc } from './caseUtils';
import { IcPhone } from './icons';

export function Ring({ value, max, size = 64, stroke = 7, color = 'var(--mint)', track = 'rgba(17,24,39,.08)', children }:
  { value: number; max: number; size?: number; stroke?: number; color?: string; track?: string; children?: ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;
  return (
    <span className="cs-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - pct)} transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset .9s cubic-bezier(.2,.8,.2,1)' }} />
      </svg>
      {children && <span className="cs-ring-inner">{children}</span>}
    </span>
  );
}


export function StatusPill({ status, label }: { status: EffStatus; label?: string }) {
  return (
    <span className={`cs-pill cs-pill-${status}`}>
      <span className="cs-pill-dot" />
      {label ?? STATUS_LABEL[status]}
    </span>
  );
}

export function Pill({ tone = 'neutral', children, style }: { tone?: 'neutral' | 'mint' | 'amber' | 'coral' | 'sky' | 'accent' | 'orange'; children: ReactNode; style?: CSSProperties }) {
  return <span className={`cs-tag cs-tag-${tone}`} style={style}>{children}</span>;
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; size?: 'sm' | 'md'; icon?: ReactNode };
export function Btn({ variant = 'secondary', size = 'md', icon, children, className = '', ...rest }: BtnProps) {
  return (
    <button type="button" className={`cs-btn cs-btn-${variant} cs-btn-${size} ${className}`} {...rest}>
      {icon && <span className="cs-btn-ic">{icon}</span>}
      {children}
    </button>
  );
}

export function Card({ title, aside, children, className = '', pad = true, id }:
  { title?: ReactNode; aside?: ReactNode; children: ReactNode; className?: string; pad?: boolean; id?: string }) {
  return (
    <section className={`cs-card ${pad ? 'cs-card-pad' : ''} ${className}`} id={id}>
      {(title || aside) && (
        <header className="cs-card-head">
          {title && <h3 className="cs-card-title">{title}</h3>}
          {aside && <div className="cs-card-aside">{aside}</div>}
        </header>
      )}
      {children}
    </section>
  );
}

/** Link to the original: a report („zpráva 07“) or, for the coordinator's own phone note (id T-…), her record –
 *  drawn differently so nobody mistakes it for a medical report. */
export function SourceChip({ docId, onClick, active }: { docId: string; onClick?: () => void; active?: boolean }) {
  const call = isCallDoc(docId);
  return (
    <button type="button" className={`cs-src ${active ? 'is-active' : ''} ${call ? 'is-call' : ''}`} onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      title={call ? 'Otevřít záznam koordinátorky (telefonát) – není to lékařská zpráva' : `Otevřít originál zprávy ${docId}`}>
      {call && <IcPhone size={12} />}
      {docLabel(docId)}
    </button>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="cs-empty">{children}</div>;
}
