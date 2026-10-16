// Tiny state router (no dependency). Pages call useNav().go({ page: 'case', caseId: 'alena' }).
import { createContext, useContext } from 'react';

export type Route =
  | { page: 'queue' }
  | { page: 'case'; caseId: string; tab?: 'prehlad' | 'podklad' | 'kroky' | 'dokumenty' | 'zaznam' }
  | { page: 'intake' }                 // GP side: referral pre-check before sending
  | { page: 'mdt'; caseId: string }     // printable MDT handover (VZP template MDT_zapis)
  | { page: 'gp'; caseId: string };     // MDT conclusion for the GP + delivery receipt + revízny lekár

export interface Nav { route: Route; go: (r: Route) => void; asOf: string; setAsOf: (d: string) => void }
export const NavContext = createContext<Nav | null>(null);
export function useNav(): Nav {
  const n = useContext(NavContext);
  if (!n) throw new Error('useNav outside NavContext');
  return n;
}
