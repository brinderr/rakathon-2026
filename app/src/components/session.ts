// Demo state of the coordinator's session, per case. It lives in App (provider) so that it survives
// navigation between screens: a request sent, an answer that arrived, a conflict decided, log entries
// added, the handover confirmed and the case closed are visible in the case, in the MDT handover,
// in the GP conclusion AND in the queue (R1 #1, R3 B4/B6).
//
// Usage in a page:   const [session, patch] = useCaseSession(c.id);
//                    patch((s) => ({ overrides: { ...s.overrides, [key]: ov } }));
import { createContext, useCallback, useContext } from 'react';
import type { ISODate, LogEntry, SourceDoc } from '../types';
import type { FieldOverride } from './case/caseUtils';

export interface CaseSession {
  overrides: Record<string, FieldOverride>;  // per field key: request sent / answer arrived / conflict decided
  arrived: SourceDoc[];                      // documents that "arrived" in this session (e.g. report 14)
  sessionLog: LogEntry[];                    // log entries added in this session
  mdtConfirmedAt?: ISODate;                  // handover confirmed by the KOC doctor (simulation)
  mdtConfirmedBy?: string;                   // who confirmed it (presenter from the MDT record, or „lékař KOC“)
  acceptedAt?: ISODate;                      // a new referral taken over („Převzít žádost“)
  closedAt?: ISODate;                        // conclusion delivered to the GP and the case closed
}

export const EMPTY_SESSION: CaseSession = { overrides: {}, arrived: [], sessionLog: [] };

export type SessionPatch = Partial<CaseSession> | ((s: CaseSession) => Partial<CaseSession>);

export interface SessionStore {
  sessions: Record<string, CaseSession>;
  get: (caseId: string) => CaseSession;
  update: (caseId: string, patch: SessionPatch) => void;
  reset: (caseId: string) => void;
  /** Forgets the demo actions of every case („Začít znovu“). */
  resetAll: () => void;
}

export const SessionContext = createContext<SessionStore | null>(null);

export function useSessions(): SessionStore {
  const s = useContext(SessionContext);
  if (!s) throw new Error('useSessions outside SessionContext');
  return s;
}

/** Session of one case + a patch function (object or updater). */
export function useCaseSession(caseId: string): [CaseSession, (patch: SessionPatch) => void] {
  const store = useSessions();
  const patch = useCallback((p: SessionPatch) => store.update(caseId, p), [store, caseId]);
  return [store.get(caseId), patch];
}

/* ---- small derived helpers (used by the queue; pages may use them too) ---- */

/** A missing field counts as answered once a "resolved" override is dated on or before `asOf`. */
export function isResolved(ov: FieldOverride | undefined, asOf: ISODate): boolean {
  return ov?.kind === 'resolved' && ov.date <= asOf;
}
export function isPending(ov: FieldOverride | undefined): boolean {
  return ov?.kind === 'pending';
}
export function isDecided(ov: FieldOverride | undefined, asOf: ISODate): boolean {
  return ov?.kind === 'decided' && ov.date <= asOf;
}
