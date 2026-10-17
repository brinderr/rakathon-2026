// Writing from the case (owner: Matej): "Vyžádat zprávu" – a missing report or result, drafted from the open to-do –,
// a question about something that does not add up, or a free message to the GP. The recipients are the people known
// in the case; the text is a draft she can change. Sending is simulated and goes into the coordination record.
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ME } from '../../state/caseStore';
import { sendMessage } from '../../state/messages';
import type { Channel } from '../../state/messages';
import { Icon } from '../../ui/Icon';
import { czDate } from '../../ui/format';
import { useCaseData } from './caseContext';
import type { CaseData, Person, Todo } from './types';
import './compose.css';

/** What to write: about one to-do (the key of its item), or a free message (to the GP). */
export interface ComposeRequest { mode: 'request' | 'message'; field?: string }

/** Opens the dialog from anywhere in the case – the header, the to-dos in the overview and in Údaje. */
export const ComposeCtx = createContext<(r: ComposeRequest) => void>(() => {});
export const useCompose = () => useContext(ComposeCtx);

const SIGNATURE = `${ME}\nkoordinátorka KOC Nemocnice Lipová`;
const FREE = '';

interface Recipient extends Person { email?: string; lay: boolean }

/** Everybody she can write to: the GP, the doctors and workplaces behind the to-dos, the patient, the contact person. */
function recipientsOf(data: CaseData, todos: Todo[]): Recipient[] {
  const p = data.patient;
  const email = data.fields.find((f) => f.key === 'patientContact')?.value.match(/[\w.+-]+@[\w-]+\.[\w.-]*\w/)?.[0];
  const lay = new Set([p.name, p.contactPerson?.name ?? '']);
  const people: Person[] = [
    p.gp,
    ...todos.flatMap((t) => t.contacts),
    { role: p.sex === 'žena' ? 'Pacientka' : 'Pacient', name: p.name, ...(p.phone ? { phone: p.phone } : {}) },
    ...(p.contactPerson ? [p.contactPerson] : []),
  ];
  const all = people.filter((x) => x.name).map((x): Recipient => ({ ...x, lay: lay.has(x.name), ...(x.name === p.name && email ? { email } : {}) }));
  return [...new Map(all.map((x) => [x.name, x])).values()];
}

/** Doctors and workplaces get a secure message; the patient and the family an SMS or an e-mail. */
function channelsOf(r: Recipient | undefined): Channel[] {
  const out: Channel[] = [];
  if (!r) return out;
  if (!r.lay) out.push('zabezpečená zpráva');
  else if (r.phone) out.push('SMS');
  if (r.email) out.push('e-mail');
  return out;
}

/** The reason in a letter: the explanation without the instructions meant for the coordinator. */
const reasonOf = (t: Todo) => t.why.split(/(?<=[.!?])\s+/).filter((s) => !/^Ověř|[–-] vyžádat/i.test(s)).join(' ');

function draftOf(data: CaseData, t: Todo | undefined, r: Recipient | undefined, request: boolean): { subject: string; body: string } {
  const p = data.patient;
  const of = p.sex === 'žena' ? 'pacientky' : 'pacienta';
  const who = `${p.name}${p.born ? `, nar. ${p.born}` : ''}`;
  const mdt = data.mdtDate ? ` ${czDate(data.mdtDate)}` : '';
  if (r?.lay) {
    const ask = t?.field === 'patientContact' ? `Před konziliem${mdt} prosíme o Váš e-mail – stačí odpovědět na tuto zprávu.`
      : 'Prosíme o zavolání zpět.';
    return { subject: 'KOC Nemocnice Lipová', body: `Dobrý den, tady koordinační centrum KOC Nemocnice Lipová. ${ask}\nDěkujeme, ${ME.replace(/^Bc\.\s*/, '')}` };
  }
  if (!t) {
    return request
      ? { subject: `Žádost o zaslání zprávy – ${p.name}`, body: `Dobrý den,\n\nprosíme o zaslání zprávy ${of} ${who}${mdt ? ` před konziliem${mdt}` : ''}: \n\nDěkujeme.\n\n${SIGNATURE}` }
      : { subject: `${p.sex === 'žena' ? 'Pacientka' : 'Pacient'} ${p.name}`, body: `Dobrý den,\n\npíšeme ohledně ${of} ${who}.\n\n\n\nS pozdravem\n${SIGNATURE}` };
  }
  if (t.request?.draft) {
    const body = t.request.draft
      .replace(/^Dobrý den,\s*/, 'Dobrý den,\n\n')
      .replace(p.name, who)
      .replace(/\s*Děkujeme, koordinátor KOC\.?\s*$/, `\n\nDěkujeme.\n\n${SIGNATURE}`);
    return { subject: `Žádost o doplnění před konziliem – ${p.name}`, body };
  }
  if (t.kind === 'rozpor') {
    return {
      subject: `Dotaz před konziliem – ${p.name}`,
      body: `Dobrý den,\n\npřipravujeme podklady ke konziliu${mdt} – ${who}. V dokumentaci se rozcházejí údaje.\n${reasonOf(t)}\n\nProsíme o potvrzení, který údaj platí.\n\nDěkujeme.\n\n${SIGNATURE}`,
    };
  }
  return {
    subject: `Žádost o doplnění před konziliem – ${p.name}`,
    body: `Dobrý den,\n\npřipravujeme podklady ke konziliu${mdt} – ${who}.\n${reasonOf(t)}\n\nProsíme o doplnění.\n\nDěkujeme.\n\n${SIGNATURE}`,
  };
}

export function Compose({ req, onClose }: { req: ComposeRequest | null; onClose: () => void }) {
  const { id, data } = useCaseData();
  const ref = useRef<HTMLDialogElement | null>(null);
  const todos = useMemo(() => data.steps.flatMap((s) => s.todo ?? []), [data]);
  const people = useMemo(() => recipientsOf(data, todos), [data, todos]);
  const [about, setAbout] = useState(FREE);
  const [to, setTo] = useState('');
  const [channel, setChannel] = useState<Channel>('zabezpečená zpráva');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const request = req?.mode === 'request';

  /** A fresh draft for what she picked: the to-do (its first contact unless she chose someone) and the recipient. */
  const fill = (field: string, name?: string) => {
    const t = todos.find((x) => x.field === field);
    const r = people.find((x) => x.name === name) ?? people.find((x) => x.name === t?.contacts[0]?.name) ?? people[0];
    const d = draftOf(data, t, r, request);
    setAbout(field);
    setTo(r?.name ?? '');
    setChannel(channelsOf(r)[0] ?? 'zabezpečená zpráva');
    setSubject(d.subject);
    setBody(d.body);
  };

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (req) {
      fill(req.mode === 'request' ? req.field ?? todos[0]?.field ?? FREE : FREE, req.mode === 'message' ? data.patient.gp.name : undefined);
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) dialog.close();
    // a new draft only when the dialog opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [req]);

  const t = todos.find((x) => x.field === about);
  const channels = channelsOf(people.find((x) => x.name === to));
  const title = t ? (t.kind === 'rozpor' ? 'Napsat dotaz' : 'Vyžádat doplnění') : request ? 'Vyžádat zprávu' : 'Napsat zprávu';
  const send = () => {
    if (!to || !channels.length || !body.trim()) return;
    sendMessage(id, data.today, {
      to, channel, subject: channel === 'SMS' ? '' : subject.trim(), body: body.trim(), request: Boolean(t), ...(t ? { field: t.field } : {}),
    });
    onClose();
  };

  return (
    <dialog ref={ref} className="compose" aria-labelledby="compose-title" onClose={onClose}>
      {req && (
        <form className="compose-form" onSubmit={(e) => { e.preventDefault(); send(); }}>
          <div className="compose-bar">
            <h2 id="compose-title">{title}</h2>
            <button type="button" className="viewer-close" aria-label="Zavřít" onClick={onClose}><Icon name="close" size={18} /></button>
          </div>
          <div className="compose-body">
            {todos.length > 0 && (
              <label>Týká se
                <select value={about} onChange={(e) => fill(e.target.value)}>
                  {todos.map((x) => <option key={x.field} value={x.field}>{x.title}</option>)}
                  <option value={FREE}>Jiná zpráva</option>
                </select>
              </label>
            )}
            <div className="compose-row">
              <label>Komu
                <select value={to} onChange={(e) => fill(about, e.target.value)}>
                  {people.map((x) => <option key={x.name} value={x.name}>{x.name}{x.role ? ` – ${x.role.toLowerCase()}` : ''}</option>)}
                </select>
              </label>
              <label>Jak
                <select value={channel} onChange={(e) => setChannel(e.target.value as Channel)} disabled={!channels.length}>
                  {channels.length ? channels.map((c) => <option key={c}>{c}</option>) : <option>kontakt chybí</option>}
                </select>
              </label>
            </div>
            {channel !== 'SMS' && <label>Předmět<input value={subject} onChange={(e) => setSubject(e.target.value)} /></label>}
            <label>Text<textarea value={body} onChange={(e) => setBody(e.target.value)} rows={channel === 'SMS' ? 4 : 11} /></label>
          </div>
          <div className="compose-actions form-actions">
            <button type="submit" className="btn-primary" disabled={!channels.length || !body.trim()}><Icon name="mail" size={16} />Odeslat</button>
            <button type="button" className="btn-ghost" onClick={onClose}>Zrušit</button>
          </div>
        </form>
      )}
    </dialog>
  );
}
