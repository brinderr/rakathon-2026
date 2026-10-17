// Tab "Údaje pro konzilium" (owner: Matej) – the handover: the 20 items of the VZP template Handover_obsah, grouped like
// the template. Every value shows where it comes from (a click opens the report with the sentence highlighted) and can
// be copied ("výstup v kopírovatelných částech", slide 8). When something is missing or does not add up, the row says
// what to do and whom to call, and the coordinator writes down what she found out – the case updates everywhere.
import { useEffect, useState } from 'react';
import { addValue, resolveField, undoField } from '../../../state/caseStore';
import { copyText } from '../../../ui/clipboard';
import { Icon } from '../../../ui/Icon';
import { nb, telHref } from '../../../ui/format';
import { useCaseData } from '../caseContext';
import type { OpenDoc } from '../Journey';
import type { Field } from '../types';
import '../udaje.css';

const STATUS: Record<string, { label: string; cls: string }> = {
  nalezeno: { label: 'Nalezeno', cls: 'ok' },
  'doplněno': { label: 'Doplněno', cls: 'ok' },
  'ověřeno': { label: 'Ověřeno', cls: 'ok' },
  'neúplné': { label: 'Neúplné', cls: 'miss' },
  'chybí': { label: 'Chybí', cls: 'miss' },
  rozpor: { label: 'Rozpor', cls: 'conf' },
};

// hint for what the coordinator writes down, per item
const PLACEHOLDER: Record<string, string> = {
  performance: 'např. ECOG 1 – soběstačná, zvládá lehkou práci',
  patientContact: 'např. alena.prochazkova@email.cz',
  medication: 'např. apixaban vysazen 10. 10. večer, v protokolu je překlep',
  histology: 'např. odběr byl 12. 10., v nálezu je chybné datum',
};

function CopyButton({ text, label, caption = 'Kopírovat' }: { text: string; label: string; caption?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button" className={`copy-btn${done ? ' done' : ''}`} aria-label={`Kopírovat: ${label}`}
      onClick={async () => { if (await copyText(text)) { setDone(true); window.setTimeout(() => setDone(false), 1500); } }}
    >
      <Icon name={done ? 'check' : 'copy'} size={15} />{done ? 'Zkopírováno' : caption}
    </button>
  );
}

/** What to do about a missing or conflicting item: what is wrong, the sentences behind it, whom to call, and a form
 *  for what the coordinator found out. */
function ToDo({ f, openDoc, start }: { f: Field; openDoc: OpenDoc; start: boolean }) {
  const { id, data } = useCaseData();
  const todo = f.todo!;
  const conflict = f.status === 'rozpor';
  const people = todo.contacts.map((c) => `${c.name}${c.role ? ` (${c.role.toLowerCase()})` : ''}`);
  const [open, setOpen] = useState(start);
  const [who, setWho] = useState(people[0] ?? 'jiné pracoviště');
  const [text, setText] = useState('');
  const save = () => {
    if (!text.trim()) return;
    if (conflict) resolveField(id, data.today, f.key, text.trim(), who);
    else addValue(id, data.today, f.key, text.trim(), who);
  };
  const docs = [...new Map(todo.quotes.map((q) => [q.docId, q.ref ?? q.docId])).entries()];
  return (
    <div className={`todo-box ${conflict ? 'conf' : 'miss'}`}>
      {f.issue && <p className="todo-why">{nb(f.issue)}</p>}
      {todo.quotes.length > 0 && (
        <div className="todo-quotes">
          {todo.quotes.map((q) => <blockquote key={q.quote}>„{nb(q.quote)}“</blockquote>)}
          {docs.map(([docId, ref]) => (
            <button key={docId} type="button" className="src-link" onClick={() => openDoc(docId, todo.quotes.filter((q) => q.docId === docId).map((q) => q.quote))}>
              <Icon name="file" size={13} />Ukázat ve zprávě: {nb(ref)}
            </button>
          ))}
        </div>
      )}
      <p className="todo-do"><b>Co udělat:</b> {nb(todo.title)}</p>
      {todo.contacts.length > 0 && (
        <ul className="todo-people" aria-label="Koho kontaktovat">
          {todo.contacts.map((c) => (
            <li key={`${c.role}${c.name}`}>
              <span><small>{c.role}</small>{c.name}</span>
              {c.phone ? <a href={telHref(c.phone)}><Icon name="phone" size={14} />{c.phone}</a> : <span className="muted">telefon ve zprávách není</span>}
            </li>
          ))}
        </ul>
      )}
      {open ? (
        <form className="todo-form" onSubmit={(e) => { e.preventDefault(); save(); }}>
          <label>{conflict ? 'S kým jste to ověřila' : 'Od koho'}
            <select value={who} onChange={(e) => setWho(e.target.value)}>
              {people.map((p) => <option key={p}>{p}</option>)}
              <option>jiné pracoviště</option>
            </select>
          </label>
          <label>{conflict ? 'Co jste zjistila' : 'Zjištěná hodnota'}
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder={PLACEHOLDER[f.key] ?? ''} autoFocus={start} />
          </label>
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={!text.trim()}><Icon name="check" size={16} />Uložit</button>
            <button type="button" className="btn-ghost" onClick={() => setOpen(false)}>Zrušit</button>
          </div>
        </form>
      ) : (
        <div className="form-actions">
          <button type="button" className="btn-primary" onClick={() => setOpen(true)}>
            <Icon name={conflict ? 'check' : 'plus'} size={16} />{conflict ? 'Zapsat ověření' : 'Doplnit údaj'}
          </button>
        </div>
      )}
    </div>
  );
}

/** What gets copied: the value, and for a checked conflict also what the coordinator found out. */
const copyOf = (f: Field) => (f.status === 'ověřeno' && f.note ? `${f.value}\n${f.note}` : f.value);

function Row({ f, openDoc }: { f: Field; openDoc: OpenDoc }) {
  const { id, data, focus } = useCaseData();
  const [full, setFull] = useState(false);
  const long = f.value.length > 220 || f.value.split('\n').length > 3;
  const st = STATUS[f.status] ?? STATUS.nalezeno;
  const sources = [...new Map(f.quotes.map((q) => [q.docId, q.ref ?? q.docId])).entries()];
  const open = f.todo && (f.status === 'chybí' || f.status === 'neúplné' || f.status === 'rozpor');
  return (
    <li className={`field ${st.cls}${focus === f.key ? ' focus' : ''}`} id={`field-${f.key}`}>
      <div className="field-label">
        <b>{f.label}</b>
        <span className={`chip ${st.cls}`}>{st.label}</span>
      </div>
      <div className="field-body">
        {f.value
          ? <p className={`field-value${long && !full ? ' clamp' : ''}`}>{nb(f.value)}</p>
          : <p className="field-value empty">V dokumentaci není.</p>}
        {long && <button type="button" className="link" onClick={() => setFull(!full)}>{full ? 'Zobrazit méně' : 'Zobrazit celé'}<Icon name={full ? 'up' : 'down'} size={14} /></button>}
        {open && <ToDo f={f} openDoc={openDoc} start={focus === f.key} />}
        {f.note && (
          <p className="field-done">
            <Icon name="check" size={14} /><span>{nb(f.note)}</span>
            <button type="button" className="src-link" onClick={() => undoField(id, data.today, f.key)}>Vrátit</button>
          </p>
        )}
        {sources.length > 0 && (
          <p className="field-src">
            Zdroj:{' '}
            {sources.map(([docId, ref], i) => (
              <span key={docId}>
                {i > 0 && ' · '}
                <button type="button" className="src-link" onClick={() => openDoc(docId, f.quotes.filter((q) => q.docId === docId).map((q) => q.quote))}>{nb(ref)}</button>
              </span>
            ))}
          </p>
        )}
      </div>
      <div className="field-actions">{f.value && <CopyButton text={copyOf(f)} label={f.label} />}</div>
    </li>
  );
}

// what the coordinator wants to see first: what is done, what is missing, what does not add up
const KINDS = [
  { id: 'vse', label: 'Vše', match: () => true },
  { id: 'ok', label: 'Hotovo', match: (f: Field) => f.status === 'nalezeno' || f.status === 'doplněno' || f.status === 'ověřeno' },
  { id: 'miss', label: 'Chybí', match: (f: Field) => f.status === 'chybí' || f.status === 'neúplné' },
  { id: 'conf', label: 'Rozpor', match: (f: Field) => f.status === 'rozpor' },
] as const;

export function Udaje({ openDoc }: { openDoc: OpenDoc }) {
  const { data, focus } = useCaseData();
  const fields = data.fields;
  const groups = [...new Set(fields.map((f) => f.group))];
  const [show, setShow] = useState<(typeof KINDS)[number]['id']>('vse');
  const n = Object.fromEntries(KINDS.map((k) => [k.id, fields.filter(k.match).length])) as Record<string, number>;
  const kind = KINDS.find((k) => k.id === show) ?? KINDS[0];
  const visible = fields.filter(kind.match);
  const all = fields.map((f) => `${f.label}: ${f.value ? copyOf(f) : '– chybí –'}`).join('\n');
  // #/pacienti/<id>/udaje/<item> (from a to-do in the overview): scroll to the item, its form is open
  useEffect(() => {
    if (focus) document.getElementById(`field-${focus}`)?.scrollIntoView({ block: 'center' });
  }, [focus]);
  return (
    <div className="udaje">
      <section className="card udaje-head">
        <div className="udaje-title">
          <h2>Údaje pro konzilium</h2>
          <CopyButton text={all} label="všechny údaje" caption="Kopírovat vše" />
        </div>
        <div className="udaje-filter" role="group" aria-label="Zobrazit">
          {KINDS.map((k) => (
            <button key={k.id} type="button" className={`filter ${k.id}${show === k.id ? ' on' : ''}`} aria-pressed={show === k.id} onClick={() => setShow(k.id)}>
              {k.label} <b>{n[k.id]}</b>
            </button>
          ))}
        </div>
      </section>
      {visible.length === 0 && <section className="card notice"><p className="muted">Nic takového – vše je vyřešeno.</p></section>}
      {groups.filter((g) => visible.some((f) => f.group === g)).map((g) => (
        <section className="card field-group" key={g} aria-label={g}>
          <h3>{g}</h3>
          <ol className="fields">{visible.filter((f) => f.group === g).map((f) => <Row f={f} openDoc={openDoc} key={f.key} />)}</ol>
        </section>
      ))}
    </div>
  );
}
