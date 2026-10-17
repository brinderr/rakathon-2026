// Root: owns the route, the "stav k dátumu" (asOf) and the per-case demo session (what the coordinator
// did in this session), and renders Shell with the page for the route.
// The route is mirrored in the URL hash (#case/alena, #case/alena/podklad, #mdt/alena, #gp/alena, #intake)
// so a screen can be opened directly and the browser back button works.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NavContext, type Nav, type Route } from './nav';
import { DEMO_TODAY } from './types';
import { EMPTY_SESSION, SessionContext, type CaseSession, type SessionPatch, type SessionStore } from './components/session';
import Shell from './components/Shell';
import Queue from './pages/Queue';
import CaseView from './pages/CaseView';
import Intake from './pages/Intake';
import MdtDoc from './pages/MdtDoc';
import GpReport from './pages/GpReport';

type CaseTab = NonNullable<Extract<Route, { page: 'case' }>['tab']>;
const TABS: CaseTab[] = ['prehlad', 'podklad', 'kroky', 'dokumenty', 'zaznam'];

function routeToHash(r: Route): string {
  switch (r.page) {
    case 'queue':
      return '#';
    case 'intake':
      return '#intake';
    case 'case':
      return `#case/${r.caseId}${r.tab && r.tab !== 'prehlad' ? `/${r.tab}` : ''}`;
    case 'mdt':
      return `#mdt/${r.caseId}`;
    case 'gp':
      return `#gp/${r.caseId}`;
  }
}

function hashToRoute(hash: string): Route {
  const [page, caseId, tab] = hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
  if (page === 'intake') return { page: 'intake' };
  if (caseId && (page === 'mdt' || page === 'gp')) return { page, caseId };
  if (caseId && page === 'case') {
    return TABS.includes(tab as CaseTab) ? { page: 'case', caseId, tab: tab as CaseTab } : { page: 'case', caseId };
  }
  return { page: 'queue' };
}

const caseIdOf = (r: Route): string | undefined => ('caseId' in r ? r.caseId : undefined);

function Page({ route }: { route: Route }) {
  switch (route.page) {
    case 'queue':
      return <Queue />;
    case 'case':
      return <CaseView key={route.caseId} />;
    case 'intake':
      return <Intake />;
    case 'mdt':
      return <MdtDoc key={route.caseId} />;
    case 'gp':
      return <GpReport key={route.caseId} />;
  }
}

/** Key of the screen (not the tab): a new screen fades in, switching tabs inside a case does not. */
function screenKey(r: Route): string {
  return r.page === 'queue' || r.page === 'intake' ? r.page : `${r.page}/${r.caseId}`;
}

export default function App() {
  const [route, setRoute] = useState<Route>(() => hashToRoute(window.location.hash));
  const [asOf, setAsOf] = useState<string>(DEMO_TODAY);
  const [sessions, setSessions] = useState<Record<string, CaseSession>>({});
  const routeRef = useRef(route);

  /** Applies a route; the "stav k dátumu" slider is per patient, so it returns to today when the patient changes (R3 B11). */
  const apply = useCallback((r: Route) => {
    if (caseIdOf(routeRef.current) !== caseIdOf(r)) setAsOf(DEMO_TODAY);
    routeRef.current = r;
    setRoute(r);
  }, []);

  useEffect(() => {
    const sync = () => apply(hashToRoute(window.location.hash));
    window.addEventListener('popstate', sync);
    window.addEventListener('hashchange', sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener('hashchange', sync);
    };
  }, [apply]);

  const go = useCallback((r: Route) => {
    apply(r);
    const hash = routeToHash(r);
    const current = window.location.hash || '#';
    if (hash !== current) {
      const url = hash === '#' ? window.location.pathname + window.location.search : hash;
      window.history.pushState(null, '', url);
    }
    window.scrollTo({ top: 0 });
  }, [apply]);

  const nav = useMemo<Nav>(() => ({ route, go, asOf, setAsOf }), [route, go, asOf]);

  const store = useMemo<SessionStore>(() => ({
    sessions,
    get: (id) => sessions[id] ?? EMPTY_SESSION,
    update: (id, patch: SessionPatch) => setSessions((all) => {
      const cur = all[id] ?? EMPTY_SESSION;
      const p = typeof patch === 'function' ? patch(cur) : patch;
      return { ...all, [id]: { ...cur, ...p } };
    }),
    reset: (id) => setSessions((all) => {
      if (!(id in all)) return all;
      const next = { ...all };
      delete next[id];
      return next;
    }),
    resetAll: () => setSessions({}),
  }), [sessions]);

  return (
    <NavContext.Provider value={nav}>
      <SessionContext.Provider value={store}>
        <Shell>
          <div className="page-enter" key={screenKey(route)}>
            <Page route={route} />
          </div>
        </Shell>
      </SessionContext.Provider>
    </NavContext.Provider>
  );
}
