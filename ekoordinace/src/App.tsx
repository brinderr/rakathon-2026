// eKoordinace – the shell shared by all sections: side menu, top bar and the section picked by the address
// (#/pacienti, #/konzilia, …). Sections live in src/sections/<name>/ and are listed in src/sections.tsx, so two people
// can build two sections at once without touching each other's files.
import { useEffect, useMemo, useState } from 'react';
import { DEFAULT_SECTION, SECTIONS } from './sections';
import { useLiveCases } from './sections/pacient/live';
import { AskAi } from './sections/ai/AskAi';
import { Search } from './sections/pacient/Search';
import { itemsOf } from './sections/prehled/Fronta';
import { Icon } from './ui/Icon';
import { Mark } from './ui/Mark';

const SOON = 'Připravujeme';
/** The bell: what is on the coordinator now across patients – the same number as "Na tahu jste vy" in Přehled. */
function useOpenTasks(): number {
  return useLiveCases().reduce((n, x) => n + (x.data ? itemsOf(x.id, x.data, x.state).mine.length : 0), 0);
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
  // the window title says where she is (a patient page sets its own, with the tab and the name)
  useEffect(() => { if (!(section.id === 'pacienti' && path.length)) document.title = `${section.label} · eKoordinace`; }, [section.id, section.label, path.length]);

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
        </div>
      </aside>
      <div className="content">
        <header className="topbar">
          <Search />
          <div className="top-actions">
            <AskAi />
            <a className="icon-btn" href="#/prehled" aria-label={`Na tahu jste vy (${openTasks})`} title={`Na tahu jste vy (${openTasks})`}>
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
