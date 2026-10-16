// App frame: narrow icon rail on the left, top bar (brand, search, coordinator), page content, disclaimer footer.
import type { ReactNode } from 'react';
import { useNav, type Route } from '../nav';
import { CASES } from '../data/cases';
import { DEMO_TODAY } from '../types';
import { Avatar, Icon, type IconName } from './ui';
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

          <label className="search" aria-label="Vyhľadávanie">
            <Icon name="search" size={18} />
            <input type="search" placeholder="Hľadať pacienta alebo prípad" autoComplete="off" />
          </label>

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
