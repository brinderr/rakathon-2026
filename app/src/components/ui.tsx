// Shared UI primitives for the coordinator app. No dependencies; icons are inline SVG (2px stroke).
// Also exports small Slovak date helpers and label maps so every screen speaks the same language.
import type { ButtonHTMLAttributes, CSSProperties, KeyboardEvent, ReactNode } from 'react';
import type { CaseStatus, FieldStatus, ISODate, StepState } from '../types';
import './ui.css';

export type Tone = 'neutral' | 'accent' | 'mint' | 'amber' | 'coral' | 'orange' | 'sky';

/* ------------------------------------------------------------------ dates */
const DAY_MS = 86_400_000;
const WEEKDAYS = ['nedeľa', 'pondelok', 'utorok', 'streda', 'štvrtok', 'piatok', 'sobota'];

export function parseISO(iso: ISODate): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}
/** "21. 10." or "21. 10. 2026" */
export function fmtDate(iso?: ISODate, withYear = false): string {
  if (!iso) return '–';
  const d = parseISO(iso);
  const base = `${d.getUTCDate()}. ${d.getUTCMonth() + 1}.`;
  return withYear ? `${base} ${d.getUTCFullYear()}` : base;
}
/** "pondelok 19. 10. 2026" */
export function fmtDateLong(iso: ISODate): string {
  return `${WEEKDAYS[parseISO(iso).getUTCDay()]} ${fmtDate(iso, true)}`;
}
/** Whole days from `from` to `to` (positive when `to` is later). */
export function daysBetween(from: ISODate, to: ISODate): number {
  return Math.round((parseISO(to).getTime() - parseISO(from).getTime()) / DAY_MS);
}
export function addDays(iso: ISODate, n: number): ISODate {
  return new Date(parseISO(iso).getTime() + n * DAY_MS).toISOString().slice(0, 10);
}
/** Slovak plural word: pluralWord(3, 'deň', 'dni', 'dní') → "dni" */
export function pluralWord(n: number, one: string, few: string, many: string): string {
  const a = Math.abs(n);
  return a === 1 ? one : a >= 2 && a <= 4 ? few : many;
}
/** Slovak plural with the number: plural(3, 'deň', 'dni', 'dní') → "3 dni" */
export function plural(n: number, one: string, few: string, many: string): string {
  return `${n} ${pluralWord(n, one, few, many)}`;
}
/** "dnes" / "zajtra" / "včera" / "21. 10." relative to `today`. */
export function fmtDue(iso: ISODate, today: ISODate): string {
  const diff = daysBetween(today, iso);
  if (diff === 0) return 'dnes';
  if (diff === 1) return 'zajtra';
  if (diff === -1) return 'včera';
  return fmtDate(iso);
}

/* ----------------------------------------------------------------- labels */
export const CASE_STATUS_LABEL: Record<CaseStatus, string> = {
  new: 'nový', active: 'aktívny', waiting: 'čaká', postponed: 'odložený', closed: 'uzavretý',
};
export const CASE_STATUS_TONE: Record<CaseStatus, Tone> = {
  new: 'sky', active: 'accent', waiting: 'amber', postponed: 'neutral', closed: 'mint',
};
export const STEP_STATE_LABEL: Record<StepState, string> = {
  requested: 'vyžiadané', ordered: 'objednané', done: 'vykonané', delivered: 'výsledok doručený',
};
export const FIELD_STATUS_LABEL: Record<FieldStatus, string> = {
  confirmed: 'potvrdené', proposed: 'návrh', missing: 'chýba', conflict: 'rozpor',
};
export const FIELD_STATUS_TONE: Record<FieldStatus, Tone> = {
  confirmed: 'mint', proposed: 'amber', missing: 'coral', conflict: 'orange',
};

/* ------------------------------------------------------------------- Icon */
export type IconName =
  | 'cases' | 'inbox' | 'users' | 'search' | 'bell' | 'check' | 'clock' | 'calendar' | 'alert'
  | 'user' | 'phone' | 'mail' | 'file' | 'arrow-right' | 'arrow-left' | 'chevron-right'
  | 'chevron-down' | 'plus' | 'x' | 'print' | 'send' | 'flag' | 'info' | 'copy' | 'external'
  | 'activity' | 'sun' | 'target' | 'route' | 'shield' | 'link' | 'history' | 'eye' | 'edit'
  | 'download' | 'message' | 'hospital' | 'lab' | 'pill' | 'sparkle';

const ICONS: Record<IconName, ReactNode> = {
  cases: <><path d="M12 2 2 7l10 5 10-5-10-5z" /><path d="m2 17 10 5 10-5" /><path d="m2 12 10 5 10-5" /></>,
  inbox: <><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
  search: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>,
  bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></>,
  check: <path d="M20 6 9 17l-5-5" />,
  clock: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
  alert: <><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4M12 17h.01" /></>,
  user: <><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
  phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />,
  mail: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></>,
  file: <><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /></>,
  'arrow-right': <path d="M5 12h14M12 5l7 7-7 7" />,
  'arrow-left': <path d="M19 12H5M12 19l-7-7 7-7" />,
  'chevron-right': <path d="m9 18 6-6-6-6" />,
  'chevron-down': <path d="m6 9 6 6 6-6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  x: <path d="M18 6 6 18M6 6l12 12" />,
  print: <><path d="M6 9V2h12v7" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></>,
  send: <><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>,
  flag: <><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><path d="M4 22v-7" /></>,
  info: <><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></>,
  copy: <><rect x="8" y="8" width="14" height="14" rx="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></>,
  external: <><path d="M15 3h6v6M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></>,
  activity: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></>,
  target: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>,
  route: <><circle cx="6" cy="19" r="3" /><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" /><circle cx="18" cy="5" r="3" /></>,
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  link: <><path d="M9 17H7A5 5 0 0 1 7 7h2" /><path d="M15 7h2a5 5 0 1 1 0 10h-2" /><path d="M8 12h8" /></>,
  history: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l3 2" /></>,
  eye: <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></>,
  edit: <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />,
  download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5M12 15V3" /></>,
  message: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  hospital: <><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22v-4h6v4M12 6v4M10 8h4" /></>,
  lab: <><path d="M9 3h6" /><path d="M10 3v6l-5.5 9A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-3L14 9V3" /></>,
  pill: <><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" /><path d="m8.5 8.5 7 7" /></>,
  sparkle: <><path d="M12 3v4M12 17v4M3 12h4M17 12h4" /><path d="M12 8a4 4 0 0 0 4 4 4 4 0 0 0-4 4 4 4 0 0 0-4-4 4 4 0 0 0 4-4z" /></>,
};

export function Icon({ name, size = 20, strokeWidth = 2, className = '' }: {
  name: IconName; size?: number; strokeWidth?: number; className?: string;
}) {
  return (
    <svg className={`icon ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

/* ------------------------------------------------------------------- Card */
export function Card({ children, className = '', onClick, pastel, style, ariaLabel }: {
  children: ReactNode; className?: string; onClick?: () => void; pastel?: 1 | 2 | 3; style?: CSSProperties; ariaLabel?: string;
}) {
  const cls = ['card', pastel ? `card--pastel-${pastel}` : '', onClick ? 'card--click' : '', className].filter(Boolean).join(' ');
  if (!onClick) return <div className={cls} style={style}>{children}</div>;
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); }
  };
  return (
    <div className={cls} style={style} role="button" tabIndex={0} aria-label={ariaLabel} onClick={onClick} onKeyDown={onKey}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------- Pill */
export function Pill({ tone = 'neutral', size = 'md', dot = false, className = '', children }: {
  tone?: Tone; size?: 'md' | 'sm'; dot?: boolean; className?: string; children: ReactNode;
}) {
  return (
    <span className={`pill pill--${tone} ${size === 'sm' ? 'pill--sm' : ''} ${className}`}>
      {dot && <StatusDot tone={tone} />}
      {children}
    </span>
  );
}

/* -------------------------------------------------------------- StatusDot */
export function StatusDot({ tone = 'neutral', pulse = false, label }: { tone?: Tone; pulse?: boolean; label?: string }) {
  const d = <span className={`dot dot--${tone} ${pulse ? 'dot--pulse' : ''}`} aria-hidden="true" />;
  return label ? <span className="dot-label">{d}{label}</span> : d;
}

/* ----------------------------------------------------------------- Button */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost'; size?: 'md' | 'sm'; icon?: IconName; iconRight?: IconName;
}
export function Button({ variant = 'primary', size = 'md', icon, iconRight, className = '', children, type = 'button', ...rest }: ButtonProps) {
  return (
    <button type={type} className={`btn btn--${variant} ${size === 'sm' ? 'btn--sm' : ''} ${className}`} {...rest}>
      {icon && <Icon name={icon} size={size === 'sm' ? 16 : 18} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size === 'sm' ? 16 : 18} />}
    </button>
  );
}

/* ------------------------------------------------------------------- Ring */
export function Ring({ value, max, size = 96, stroke = 8, tone = 'accent', children }: {
  value: number; max: number; size?: number; stroke?: number; tone?: Tone; children?: ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;
  return (
    <div className="ring" style={{ width: size, height: size }} role="img" aria-label={`${value} z ${max}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle className="ring__track" cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} fill="none" />
        <circle className={`ring__bar ring__bar--${tone}`} cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={c * (1 - pct)} />
      </svg>
      <div className="ring__center">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------- Stat */
export function Stat({ value, label, hint, pastel, size = 'md', className = '' }: {
  value: ReactNode; label: string; hint?: ReactNode; pastel?: 1 | 2 | 3; size?: 'md' | 'lg'; className?: string;
}) {
  return (
    <div className={`stat ${pastel ? `stat--pastel stat--pastel-${pastel}` : ''} ${size === 'lg' ? 'stat--lg' : ''} ${className}`}>
      <div className="stat__value">{value}</div>
      <div className="stat__label">{label}</div>
      {hint && <div className="stat__hint">{hint}</div>}
    </div>
  );
}

/* ----------------------------------------------------------------- Avatar */
const PALETTE = [
  { bg: '#EEE6FB', fg: '#5B46B5' }, { bg: '#DFF5EC', fg: '#1E7F5F' }, { bg: '#FCE4EC', fg: '#B23A5F' },
  { bg: '#FDF0DC', fg: '#A6621A' }, { bg: '#E3EEFD', fg: '#2B5FB8' }, { bg: '#F4E8FB', fg: '#7E3FA8' },
];
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((p) => p[0]!.toUpperCase()).join('') || '?';
}
export function Avatar({ name, size = 40, ring = false, className = '' }: { name: string; size?: number; ring?: boolean; className?: string }) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const p = PALETTE[h % PALETTE.length];
  return (
    <span className={`avatar ${ring ? 'avatar--ring' : ''} ${className}`} title={name}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38), background: p.bg, color: p.fg }}>
      {initials(name)}
    </span>
  );
}

/* ------------------------------------------------------------------- Tabs */
export function Tabs<T extends string>({ items, value, onChange, className = '' }: {
  items: { id: T; label: string; count?: number }[]; value: T; onChange: (id: T) => void; className?: string;
}) {
  return (
    <div className={`tabs ${className}`} role="tablist">
      {items.map((t) => (
        <button key={t.id} type="button" role="tab" aria-selected={t.id === value}
          className={`tab ${t.id === value ? 'tab--active' : ''}`} onClick={() => onChange(t.id)}>
          {t.label}
          {t.count !== undefined && <span className="tab__count">{t.count}</span>}
        </button>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- Tooltip */
export function Tooltip({ text, children, side = 'top', className = '' }: {
  text: ReactNode; children: ReactNode; side?: 'top' | 'bottom'; className?: string;
}) {
  return (
    <span className={`tip ${className}`} tabIndex={0}>
      {children}
      <span className={`tip__bubble tip__bubble--${side}`} role="tooltip">{text}</span>
    </span>
  );
}
