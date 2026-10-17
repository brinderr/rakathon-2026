// The conclusion of the MDT for the GP (owner: matej): what the MDT decided and recommended (the doctors' words), the
// letter sent to the GP and its delivery receipt – odesláno → doručeno → přečteno, urgence while unread. With it, the
// summary for the revízní lékař of the patient's insurer goes automatically (VZP slide 11): doručeno → vzato na vědomí,
// or he asks the coordinator to complete something and she answers. Kept in the case state (state/caseStore), so it
// survives a reload and the journey can show the step as done.
import alenaMdt from '../data/alena-mdt-zaver.json';
import { ME, stamp, updateCase } from './caseStore';
import { DEMO_ID } from './patients';

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
  /** the summary for the revízní lékař of the patient's insurer, sent with the letter */
  rl?: Revizni;
}

export interface Revizni {
  /** "Revizní lékař ZPMV ČR" */
  to: string;
  sent: string;
  delivered?: string;
  /** "vzato na vědomí" */
  ack?: string;
  /** he asks the coordinator to complete something, she answers */
  ask?: { at: string; text: string };
  reply?: { at: string; text: string };
  /** what the simulated revízní lékař will ask for (an item left without checking), decided when sent */
  pending?: string;
}

export const emptyConclusion = (): Conclusion => ({ zaver: '', doporuceni: '', next: '' });

/** Before the first edit: the MDT record of the demo case (VZP sample), otherwise empty. */
export function initialConclusion(id: string, female: boolean): Conclusion {
  if (id === DEMO_ID) return { zaver: alenaMdt.zaver, doporuceni: alenaMdt.doporuceni, next: alenaMdt.next };
  return { ...emptyConclusion(), next: `${female ? 'Pacientku' : 'Pacienta'} o plánu informuje koordinátorka KOC.` };
}

type Text = Partial<Pick<Conclusion, 'zaver' | 'doporuceni' | 'next'>>;

/** Edit the conclusion; `base` is what the tab shows before the first edit (e.g. the MDT record of the demo case). */
export function editConclusion(caseId: string, base: Conclusion, patch: Text) {
  updateCase(caseId, (s) => ({ ...s, conclusion: { ...(s.conclusion ?? base), ...patch } }));
}

// the simulated secure messages: delivered after a few seconds, then read (GP) or answered (revízní lékař); one
// track of timers per case and addressee, free again once its last step ran
const timers = new Map<string, number[]>();
function cancel(caseId: string) {
  for (const key of [`${caseId}:gp`, `${caseId}:rl`]) {
    (timers.get(key) ?? []).forEach((t) => window.clearTimeout(t));
    timers.delete(key);
  }
}
function run(key: string, steps: [number, () => void][]) {
  if (timers.has(key) || !steps.length) return;
  timers.set(key, steps.map(([ms, fn], i) => window.setTimeout(() => { if (i === steps.length - 1) timers.delete(key); fn(); }, ms)));
}

/** Sends the letter to the GP and, when the insurer is known, the summary to its revízní lékař (`rl.ask`: what he will ask for). */
export function sendConclusion(caseId: string, day: string, base: Conclusion, text: string, to: string, rl?: { to: string; ask?: string }) {
  cancel(caseId);
  const at = stamp(day);
  updateCase(caseId, (s) => {
    // a request he already had answered is not asked again when the letter is sent once more
    const answered = s.conclusion?.rl?.reply ? s.conclusion.rl.ask?.text : undefined;
    const pending = rl?.ask && rl.ask !== answered ? rl.ask : undefined;
    return {
      ...s,
      conclusion: {
        ...(s.conclusion ?? base), sent: { at, text, to }, delivered: undefined, read: undefined, urged: [],
        rl: rl ? { to: rl.to, sent: at, ...(pending ? { pending } : {}) } : undefined,
      },
      events: [
        ...s.events,
        { at, who: ME, kind: 'odeslano', text: `Závěr konzilia odeslán zabezpečenou zprávou – ${to}` },
        ...(rl ? [{ at, who: ME, kind: 'odeslano' as const, text: `Souhrn pro revizního lékaře odeslán automaticky se závěrem – ${rl.to}` }] : []),
      ],
    };
  });
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

/** The revízní lékař changes his part of the conclusion; nothing happens when the summary was not sent. */
function updateRl(caseId: string, day: string, fn: (rl: Revizni, at: string) => { rl: Revizni; who: string; kind: 'doruceno' | 'precteno' | 'email'; text: string } | null) {
  const at = stamp(day);
  updateCase(caseId, (s) => {
    const rl = s.conclusion?.rl;
    const next = rl && fn(rl, at);
    if (!s.conclusion || !next) return s;
    return { ...s, conclusion: { ...s.conclusion, rl: next.rl }, events: [...s.events, { at, who: next.who, kind: next.kind, text: next.text }] };
  });
}

const rlDelivered = (caseId: string, day: string) => updateRl(caseId, day, (rl, at) => (rl.delivered ? null
  : { rl: { ...rl, delivered: at }, who: rl.to, kind: 'doruceno', text: 'Souhrn pro revizního lékaře doručen' }));
const rlAsk = (caseId: string, day: string) => updateRl(caseId, day, (rl, at) => (!rl.pending || rl.ask ? null
  : { rl: { ...rl, ask: { at, text: rl.pending } }, who: rl.to, kind: 'email', text: `Žádá doplnění: ${rl.pending}` }));
const rlAck = (caseId: string, day: string) => updateRl(caseId, day, (rl, at) => (rl.ack ? null
  : { rl: { ...rl, ack: at }, who: rl.to, kind: 'precteno', text: rl.reply ? 'Doplnění přijato, vzato na vědomí' : 'Souhrn vzat na vědomí' }));

/** The coordinator answers what the revízní lékař asked for. */
export function replyRevizni(caseId: string, day: string, text: string) {
  updateRl(caseId, day, (rl, at) => (!rl.ask || rl.reply ? null
    : { rl: { ...rl, reply: { at, text } }, who: ME, kind: 'email', text: `Odpověď reviznímu lékaři (${rl.to}): ${text}` }));
}

/** Runs the simulated delivery, reading and answers of a sent conclusion (again after a reload). */
export function simulateReceipt(caseId: string, day: string, c: Conclusion | undefined) {
  if (!c?.sent) return;
  if (!c.read) {
    run(`${caseId}:gp`, [
      ...(c.delivered ? [] : [[2000, () => markDelivered(caseId, day)] as [number, () => void]]),
      [c.delivered ? 6000 : 8000, () => markRead(caseId, day)],
    ]);
  }
  const rl = c.rl;
  // nothing to simulate once he took note, or while he waits for the coordinator's answer
  if (!rl || rl.ack || (rl.ask && !rl.reply)) return;
  const steps: [number, () => void][] = rl.delivered ? [] : [[3000, () => rlDelivered(caseId, day)]];
  const after = rl.delivered ? 0 : 3000;
  if (rl.reply) steps.push([after + 4000, () => rlAck(caseId, day)]);
  else steps.push([after + 6000, () => (rl.pending ? rlAsk(caseId, day) : rlAck(caseId, day))]);
  run(`${caseId}:rl`, steps);
}
