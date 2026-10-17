// Messages the coordinator sends from a case: a request for a missing report or result, a question about a conflict,
// a note to the GP, an SMS to the patient. Sending is simulated – every message becomes a line of the coordination
// record (state/caseStore) with the recipient, the channel and the text. Owner: matej.
import { ME, stamp, updateCase } from './caseStore';
import type { CaseEvent, CaseState } from './caseStore';

export type Channel = 'zabezpečená zpráva' | 'e-mail' | 'SMS';

/** A sent message as kept in the record: an ordinary event plus to whom, how and what. */
export interface MessageEvent extends CaseEvent { to: string; channel: Channel; subject: string; body: string }

export function isMessage(e: CaseEvent): e is MessageEvent {
  return 'channel' in e && 'body' in e;
}

export function sendMessage(
  caseId: string, day: string,
  m: { to: string; channel: Channel; subject: string; body: string; field?: string; request: boolean },
) {
  const event: MessageEvent = {
    at: stamp(day), who: ME, kind: m.request ? 'vyzadano' : m.channel === 'SMS' ? 'sms' : 'email',
    text: `${m.to}: ${m.subject || m.body.split('\n')[0]}`, to: m.to, channel: m.channel, subject: m.subject, body: m.body,
    ...(m.field ? { field: m.field } : {}),
  };
  updateCase(caseId, (s) => ({ ...s, events: [...s.events, event] }));
}

/** The last message sent about an item – shown at its to-do until the answer is written down. */
export function lastMessage(s: CaseState, field: string): MessageEvent | undefined {
  return s.events.filter((e): e is MessageEvent => e.field === field && isMessage(e)).at(-1);
}
