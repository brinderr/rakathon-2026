// App frame: narrow icon rail on the left, top bar (brand, quick search, coordinator), page content, disclaimer footer.
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { useNav, type Route } from '../nav';
import { CASES } from '../data/cases';
import { DEMO_TODAY, type Case } from '../types';
import { Avatar, CASE_STATUS_LABEL, CASE_STATUS_TONE, Icon, Pill, type IconName } from './ui';
import './Shell.css';

type Section = 'queue' | 'intake' | 'mdt';

const NAV: { id: Section; label: string; icon: IconName; title: string }[] = [
  { id: 'queue', label: 'Prípady', icon: 'cases', title: 'Fronta prípadov' },
  { id: 'intake', label: 'Žiadanka', icon: 'inbox', title: 'Nová žiadanka od praktika' },
  { id: 'mdt', label: 'Konzíliá', icon: 'users', title: 'Podklad pre najbližšie konzílium' },
];

function sectionOf(page: Route['page']): Section {
  if (page === 'intake') return 'intake';
  if (page === 'mdt' || page === 'gp') return 'mdt';
  return 'queue';
}

/** Case with the nearest upcoming MDT (falls back to the first case). */
function nextMdtCaseId(): string {
  const upcoming = CASES
    .filter((c) => c.mdtDate && c.mdtDate >= DEMO_TODAY && c.status !== 'closed')
    .sort((a, b) => a.mdtDate!.localeCompare(b.mdtDate!));
  return (upcoming[0] ?? CASES[0])?.id ?? '';
}

export const COORDINATOR = { name: 'Klára', role: 'koordinátorka' };

/* Accent-insensitive, case-insensitive match: "proch" finds "Procházková". */
const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function QuickSearch({ onOpen }: { onOpen: (c: Case) => void }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(0);
  const wrapRef = useRef<HTMLLabelElement>(null);
  const hits = useMemo(() => {
    const needle = fold(q.trim());
    if (!needle) return [];
    return CASES.filter((c) => fold(`${c.patient.firstName} ${c.patient.lastName} ${c.diagnosisShort} ${c.koc}`).includes(needle)).slice(0, 5);
  }, [q]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => { if (!wrapRef.current?.contains(e.target as Node)) setOpen(false); };
    window.addEventListener('mousedown', onDown);
    return () => window.removeEventListener('mousedown', onDown);
  }, []);

  const pick = (c: Case) => { onOpen(c); setQ(''); setOpen(false); };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') { setOpen(false); (e.target as HTMLInputElement).blur(); return; }
    if (!hits.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor((i) => (i + 1) % hits.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setCursor((i) => (i - 1 + hits.length) % hits.length); }
    else if (e.key === 'Enter') { e.preventDefault(); pick(hits[Math.min(cursor, hits.length - 1)]); }
  };

  return (
    <label className="search" aria-label="Vyhľadávanie" ref={wrapRef}>
      <Icon name="search" size={18} />
      <input type="search" placeholder="Hľadať pacienta" autoComplete="off" value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); setCursor(0); }} onFocus={() => setOpen(true)} onKeyDown={onKey} />
      {open && q.trim() && (
        <div className="search__menu" role="listbox">
          {hits.length === 0 ? (
            <div className="search__empty">Nikto taký vo fronte nie je.</div>
          ) : hits.map((c, i) => (
            <button type="button" key={c.id} role="option" aria-selected={i === cursor}
              className={`search__hit ${i === cursor ? 'search__hit--on' : ''}`} onMouseEnter={() => setCursor(i)} onClick={() => pick(c)}>
              <Avatar name={`${c.patient.firstName} ${c.patient.lastName}`} size={30} />
              <span className="search__hit-text">
                <span className="search__hit-name">{c.patient.firstName} {c.patient.lastName}</span>
                <span className="search__hit-sub">{c.patient.age} r. · {c.diagnosisShort}</span>
              </span>
              <Pill tone={CASE_STATUS_TONE[c.status]} size="sm">{CASE_STATUS_LABEL[c.status]}</Pill>
            </button>
          ))}
        </div>
      )}
    </label>
  );
}

export default function Shell({ children }: { children: ReactNode }) {
  const { route, go } = useNav();
  const active = sectionOf(route.page);

  const open = (id: Section) => {
    if (id === 'queue') go({ page: 'queue' });
    else if (id === 'intake') go({ page: 'intake' });
    else go({ page: 'mdt', caseId: nextMdtCaseId() });
  };

  return (
    <div className="shell">
      <aside className="rail" aria-label="Hlavná navigácia">
        {NAV.map((n) => (
          <button key={n.id} type="button" title={n.title} aria-current={active === n.id ? 'page' : undefined}
            className={`rail__btn ${active === n.id ? 'rail__btn--active' : ''}`} onClick={() => open(n.id)}>
            <Icon name={n.icon} size={22} />
            <span>{n.label}</span>
          </button>
        ))}
      </aside>

      <div className="shell__main">
        <header className="topbar">
          <button type="button" className="brand" onClick={() => go({ page: 'queue' })} title="Na úvod">
            <span className="brand__mark"><Icon name="link" size={16} /></span>
            <span className="brand__name">Koordinátor</span>
          </button>

          <QuickSearch onOpen={(c) => go({ page: 'case', caseId: c.id })} />

          <div className="topbar__right">
            <div className="me">
              <div className="me__text">
                <div className="me__name">{COORDINATOR.name}</div>
                <div className="me__role">{COORDINATOR.role}</div>
              </div>
              <Avatar name={COORDINATOR.name} size={38} />
            </div>
          </div>
        </header>

        <main className="content">{children}</main>

        <footer className="foot">Prototyp · fiktívne dáta · nie je zdravotnícka pomôcka</footer>
      </div>
    </div>
  );
}
