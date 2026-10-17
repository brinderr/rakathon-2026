// The document screens read the coordinator's demo session (ECOG answer arrived, conflicts verified, case closed)
// from BOTH places it may live in – the React context provided by App (src/components/session.ts) and the
// module store of the case screen (src/components/case/caseSession.ts) – and never crash when one is missing.
// Writes go to both, so the queue (context) and the case record (module store) stay in step.
import { useCallback, useContext, useMemo, useSyncExternalStore } from 'react';
import type { ISODate, LogEntry } from '../../types';
import { EMPTY_SESSION, SessionContext } from '../session';
import type { CaseSession } from '../session';
import { getCaseSession, subscribeCaseSession, updateCaseSession } from '../case/caseSession';
import type { CaseSession as ProfileSession } from '../case/caseSession';

const EMPTY_PROFILE: ProfileSession = { overrides: {}, arrived: [], log: [] };

export interface DocSessionActions {
  /** Appends a coordinator action to the record (both stores). */
  addLog: (entry: LogEntry) => void;
  /** Marks the handover as confirmed by the KOC physician (simulation). */
  confirmMdt: (date: ISODate, by?: string) => void;
  /** Marks the case as closed (conclusion delivered). */
  close: (date: ISODate) => void;
}

/** One view of a case's demo session: the App context (queue, documents) merged with the case screen's store. */
export function mergeSessions(fromCtx: CaseSession, profile: ProfileSession): CaseSession {
  return {
    overrides: { ...fromCtx.overrides, ...profile.overrides },
    arrived: [...fromCtx.arrived, ...profile.arrived.filter(d => !fromCtx.arrived.some(a => a.id === d.id))],
    sessionLog: [...fromCtx.sessionLog, ...profile.log.filter(l => !fromCtx.sessionLog.includes(l))],
    mdtConfirmedAt: fromCtx.mdtConfirmedAt,
    mdtConfirmedBy: fromCtx.mdtConfirmedBy,
    closedAt: fromCtx.closedAt ?? profile.closedAt,
    acceptedAt: fromCtx.acceptedAt ?? profile.acceptedAt,
  };
}
export { EMPTY_PROFILE };

export function useCaseSessionSafe(caseId: string | undefined): [CaseSession, DocSessionActions] {
  const ctx = useContext(SessionContext);
  const profile = useSyncExternalStore(
    subscribeCaseSession,
    () => (caseId ? getCaseSession(caseId) : EMPTY_PROFILE),
    () => (caseId ? getCaseSession(caseId) : EMPTY_PROFILE),
  );
  const fromCtx = ctx && caseId ? ctx.get(caseId) : EMPTY_SESSION;

  const session = useMemo<CaseSession>(() => mergeSessions(fromCtx, profile), [fromCtx, profile]);

  const addLog = useCallback((entry: LogEntry) => {
    if (!caseId) return;
    updateCaseSession(caseId, s => ({ ...s, log: [...s.log, entry] }));
    ctx?.update(caseId, s => ({ sessionLog: [...s.sessionLog, entry] }));
  }, [ctx, caseId]);
  const confirmMdt = useCallback((date: ISODate, by?: string) => {
    if (!caseId) return;
    ctx?.update(caseId, { mdtConfirmedAt: date, mdtConfirmedBy: by });
  }, [ctx, caseId]);
  const close = useCallback((date: ISODate) => {
    if (!caseId) return;
    updateCaseSession(caseId, s => ({ ...s, closedAt: date }));
    ctx?.update(caseId, { closedAt: date });
  }, [ctx, caseId]);

  return [session, { addLog, confirmMdt, close }];
}
