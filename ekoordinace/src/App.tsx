// eKoordinace – the shell shared by all sections: side menu, top bar and the section picked by the address
// (#/pacienti, #/konzilia, …). Sections live in src/sections/<name>/ and are listed in src/sections.tsx, so two people
// can build two sections at once without touching each other's files.
import { useEffect, useMemo, useState } from 'react';
import { DEFAULT_SECTION, SECTIONS } from './sections';
import { useLiveCases } from './sections/pacient/live';
import { Search } from './sections/pacient/Search';
import { SIM_TODAY } from './state/patients';
import { czDate } from './ui/format';
import { Icon } from './ui/Icon';
import { Mark } from './ui/Mark';

const SOON = 'Připravujeme';
/** The bell: open to-dos of all patients, without those the coordinator already dealt with; opens the overview. */
function useOpenTasks(): number {
  return useLiveCases().reduce((n, x) => n + (x.data?.steps.find((s) => s.status === 'now')?.todo?.length ?? 0), 0);
}

function readRoute(): string[] {
  return window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
}

function useRoute(): string[] {
  const [route, setRoute] = useState(readRoute);
  useEffect(() => {
    const onChange = () => setRoute(readRoute());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

export function App() {
  const route = useRoute();
  const openTasks = useOpenTasks();
  const section = SECTIONS.find((s) => s.id === route[0] && s.render) ?? SECTIONS.find((s) => s.id === DEFAULT_SECTION)!;
  // a new array only when the address changes, so a section can react to it (e.g. #/pacienti/ukoly)
  const path = useMemo(() => (route[0] === section.id ? route.slice(1) : []), [route, section.id]);

  return (
    <div className="frame">
      <aside className="side">
        <div className="side-brand"><span className="side-mark"><Mark size={34} /></span><span className="wordmark"><b>e</b>Koordinace</span></div>
        <nav className="side-nav" aria-label="Hlavní navigace">
          {SECTIONS.filter((s) => !s.hidden).map((s) => (s.render ? (
            <a key={s.id} className={`nav-item${s.id === section.id ? ' on' : ''}`} href={`#/${s.id}`} aria-current={s.id === section.id ? 'page' : undefined}>
              <Icon name={s.icon} />{s.label}
            </a>
          ) : (
            <span key={s.id} className="nav-item off" title={SOON}><Icon name={s.icon} />{s.label}</span>
          )))}
        </nav>
        <div className="side-user">
          <span className="avatar">LD</span>
          <span className="side-user-text"><b>Bc. Lucie Dvořáková</b><small>Koordinátorka · KOC Nemocnice Lipová</small></span>
          <Icon name="up" size={18} />
        </div>
      </aside>
      <div className="content">
        <header className="topbar">
          <Search />
          <div className="top-actions">
            {/* the VZP case happens before the MDT of 21. 10. 2026 – the app plays the day its last report arrives */}
            <span className="sim-day" title="Případ z výzvy VZP: poslední zpráva před konziliem přišla 19. 10. 2026, konzilium je 21. 10. Aplikace proto simuluje tento den – všechny lhůty („za 2 dny“) se počítají od něj.">
              <Icon name="calendar" size={16} /><span>Simulovaný den</span> <b>{czDate(SIM_TODAY)}</b>
            </span>
            <a className="icon-btn" href="#/prehled" aria-label={`Co je potřeba udělat (${openTasks})`}>
              <Icon name="bell" />{openTasks > 0 && <span className="badge">{openTasks}</span>}
            </a>
          </div>
        </header>
        <main className="page">
          {section.render?.(path)}
          <footer className="foot">Prototyp pro výzvu VZP · Rakathon 2026 · fiktivní data · nejde o oficiální produkt VZP</footer>
        </main>
      </div>
    </div>
  );
}
