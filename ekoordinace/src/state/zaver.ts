// The conclusion of the MDT for the GP (owner: matej): what the MDT decided and recommended (the doctors' words), the
// letter sent to the GP and its delivery receipt – odesláno → doručeno → přečteno, urgence while unread. Kept in the
// case state (state/caseStore), so it survives a reload and the journey can show the step as done.
import { ME, stamp, updateCase } from './caseStore';

export interface Conclusion {
  /** "Závěr MDT" and "Doporučení MDT" from the MDT record */
  zaver: string;
  doporuceni: string;
  /** who contacts the patient next */
  next: string;
  /** the letter as it was sent – tells whether it changed afterwards */
  sent?: { at: string; text: string; to: string };
  delivered?: string;
  read?: string;
  urged?: string[];
}

export const emptyConclusion = (): Conclusion => ({ zaver: '', doporuceni: '', next: '' });

type Text = Partial<Pick<Conclusion, 'zaver' | 'doporuceni' | 'next'>>;

/** Edit the conclusion; `base` is what the tab shows before the first edit (e.g. the MDT record of the demo case). */
export function editConclusion(caseId: string, base: Conclusion, patch: Text) {
  updateCase(caseId, (s) => ({ ...s, conclusion: { ...(s.conclusion ?? base), ...patch } }));
}

// the simulated secure message: delivered after ~2 s, read a few seconds later (timers per case)
const timers = new Map<string, number[]>();
function cancel(caseId: string) {
  (timers.get(caseId) ?? []).forEach((t) => window.clearTimeout(t));
  timers.delete(caseId);
}

export function sendConclusion(caseId: string, day: string, base: Conclusion, text: string, to: string) {
  cancel(caseId);
  const at = stamp(day);
  updateCase(caseId, (s) => ({
    ...s,
    conclusion: { ...(s.conclusion ?? base), sent: { at, text, to }, delivered: undefined, read: undefined, urged: [] },
    events: [...s.events, { at, who: ME, kind: 'odeslano', text: `Závěr konzilia odeslán zabezpečenou zprávou – ${to}` }],
  }));
}

export function markDelivered(caseId: string, day: string) {
  const at = stamp(day);
  updateCase(caseId, (s) => (!s.conclusion?.sent || s.conclusion.delivered ? s : {
    ...s,
    conclusion: { ...s.conclusion, delivered: at },
    events: [...s.events, { at, who: s.conclusion.sent.to, kind: 'doruceno', text: 'Závěr konzilia doručen' }],
  }));
}

export function markRead(caseId: string, day: string) {
  const at = stamp(day);
  updateCase(caseId, (s) => (!s.conclusion?.sent || s.conclusion.read ? s : {
    ...s,
    conclusion: { ...s.conclusion, delivered: s.conclusion.delivered ?? at, read: at },
    events: [...s.events, { at, who: s.conclusion.sent.to, kind: 'precteno', text: 'Závěr konzilia přečten' }],
  }));
}

export function urge(caseId: string, day: string) {
  const at = stamp(day);
  updateCase(caseId, (s) => (!s.conclusion?.sent ? s : {
    ...s,
    conclusion: { ...s.conclusion, urged: [...(s.conclusion.urged ?? []), at] },
    events: [...s.events, { at, who: ME, kind: 'email', text: `Urgence: prosba o potvrzení přečtení závěru – ${s.conclusion.sent.to}` }],
  }));
}

/** Runs the simulated delivery and reading of a sent conclusion (again after a reload). */
export function simulateReceipt(caseId: string, day: string, c: Conclusion | undefined) {
  if (!c?.sent || c.read || timers.has(caseId)) return;
  const t: number[] = [];
  if (!c.delivered) t.push(window.setTimeout(() => markDelivered(caseId, day), 2000));
  t.push(window.setTimeout(() => { timers.delete(caseId); markRead(caseId, day); }, c.delivered ? 6000 : 8000));
  timers.set(caseId, t);
}
