// Root: owns the route + "stav k dátumu" (asOf) and renders Shell with the page for the route.
// The route is mirrored in the URL hash (#case/alena, #case/alena/podklad, #mdt/alena, #gp/alena, #intake)
// so a screen can be opened directly and the browser back button works.
import { useCallback, useEffect, useMemo, useState } from 'react';
import { NavContext, type Nav, type Route } from './nav';
import { DEMO_TODAY } from './types';
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

  useEffect(() => {
    const sync = () => setRoute(hashToRoute(window.location.hash));
    window.addEventListener('popstate', sync);
    window.addEventListener('hashchange', sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener('hashchange', sync);
    };
  }, []);

  const go = useCallback((r: Route) => {
    setRoute(r);
    const hash = routeToHash(r);
    const current = window.location.hash || '#';
    if (hash !== current) {
      const url = hash === '#' ? window.location.pathname + window.location.search : hash;
      window.history.pushState(null, '', url);
    }
    window.scrollTo({ top: 0 });
  }, []);

  const nav = useMemo<Nav>(() => ({ route, go, asOf, setAsOf }), [route, go, asOf]);

  return (
    <NavContext.Provider value={nav}>
      <Shell>
        <div className="page-enter" key={screenKey(route)}>
          <Page route={route} />
        </div>
      </Shell>
    </NavContext.Provider>
  );
}
