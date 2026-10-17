// "Záznam koordinace" (owner: Matej): everything done in the case, newest first – calls, checks, requests and
// messages, the doctor's confirmation, sending and delivery. Collapsed to its last line; hidden until something happened.
import { useState } from 'react';
import { useCase } from '../../state/caseStore';
import { isMessage } from '../../state/messages';
import { Icon } from '../../ui/Icon';
import { nb } from '../../ui/format';
import { useCaseData } from './caseContext';
import './compose.css';

const KIND: Record<string, string> = {
  telefonat: 'Telefonát', overeno: 'Ověřeno', potvrzeno: 'Potvrzeno', vyzadano: 'Vyžádáno', sms: 'SMS', email: 'Zpráva',
  odeslano: 'Odesláno', doruceno: 'Doručeno', precteno: 'Přečteno', poznamka: 'Poznámka',
};
const when = (at: string) => `${Number(at.slice(8, 10))}. ${Number(at.slice(5, 7))}. ${at.slice(11)}`;

export function History() {
  const { id, data } = useCaseData();
  const st = useCase(id);
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState<string | null>(null);
  if (!st.events.length) return null;
  const events = st.events.map((e, i) => ({ e, key: `${i}` })).reverse();
  const item = (key?: string) => (key ? data.fields.find((f) => f.key === key)?.label : undefined);
  const line = (e: (typeof events)[number]['e']) => (isMessage(e) ? `${e.to} · ${e.channel}${e.subject ? ` · ${e.subject}` : ''}` : e.text);
  const last = events[0].e;
  return (
    <section className="card history" aria-label="Záznam koordinace">
      <button type="button" className="history-head" aria-expanded={open} onClick={() => setOpen(!open)}>
        <h2>Záznam koordinace</h2>
        <span className="history-count">{events.length}</span>
        {!open && <span className="history-last">{when(last.at)} · {KIND[last.kind] ?? last.kind} · {line(last)}</span>}
        <Icon name={open ? 'up' : 'down'} size={16} />
      </button>
      {open && (
        <ol className="history-list">
          {events.map(({ e, key }) => (
            <li key={key}>
              <time>{when(e.at)}</time>
              <span className={`history-kind k-${e.kind}`}>{KIND[e.kind] ?? e.kind}</span>
              <div className="history-text">
                <p>{nb(line(e))}{item(e.field) && <span className="muted"> · {item(e.field)}</span>}</p>
                {isMessage(e) && (
                  <button type="button" className="src-link" aria-expanded={shown === key} onClick={() => setShown(shown === key ? null : key)}>
                    {shown === key ? 'Skrýt text' : 'Zobrazit text'}
                  </button>
                )}
                {isMessage(e) && shown === key && <p className="history-body">{e.body}</p>}
                <small className="muted">{e.who}</small>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
