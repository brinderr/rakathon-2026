// The coordinator's patients (#/pacienti, owner: Matej): the demo case, patients added in the app and "Nový pacient".
// A row shows what is on now, until when and how much is left; a click opens the patient.
import { useMemo, useState } from 'react';
import { useCase } from '../../state/caseStore';
import { DEMO_ID, SIM_TODAY, addPatient, removePatient, useCaseOf, useStoredPatients } from '../../state/patients';
import { Icon } from '../../ui/Icon';
import { czDate } from '../../ui/format';
import { liveCase } from './live';

function Row({ id, removable }: { id: string; removable: boolean }) {
  const { data: built } = useCaseOf(id);
  // as the case is now: what the coordinator dealt with is not counted any more
  const st = useCase(id);
  const data = useMemo(() => (built ? liveCase(built, st) : null), [built, st]);
  if (!data) return <li className="pt-row"><span className="pt-busy muted">Zpracovávám zprávy…</span></li>;
  const now = data.steps.find((s) => s.status === 'now');
  const empty = Object.keys(data.documents).length === 0;
  const todo = now?.todo?.length ?? 0;
  const p = data.patient;
  return (
    <li className="pt-row">
      <a className="pt-link" href={`#/pacienti/${id}`}>
        <span className="avatar">{p.initials}</span>
        <span className="pt-main">
          <b>{p.name}</b>
          <small>{[p.born && `nar. ${p.born}`, [p.diagnosis.code, p.diagnosis.text].filter(Boolean).join(' ')].filter(Boolean).join(' · ') || 'zatím bez zpráv'}</small>
        </span>
        <span className="pt-step">
          <small>{empty ? 'Stav' : 'Teď na řadě'}</small>
          <b>{empty ? 'Nový – přidejte zprávy' : now?.label ?? 'Uzavřeno'}</b>
          {now?.due && <small>do {czDate(now.due)}</small>}
        </span>
        <span className="pt-mdt"><small>Konzilium</small><b>{data.mdtDate ? czDate(data.mdtDate) : '—'}</b></span>
        <span className="pt-todo">
          {empty ? <span className="chip new">nový</span> : todo > 0 ? <span className="chip miss">{todo} k vyřešení</span> : <span className="chip ok">bez úkolů</span>}
        </span>
      </a>
      {removable && (
        <button
          type="button" className="pt-remove" title="Odstranit pacienta" aria-label={`Odstranit pacienta ${p.name}`}
          onClick={() => { if (window.confirm(`Odstranit pacienta ${p.name} z tohoto prohlížeče?`)) removePatient(id); }}
        >
          <Icon name="close" size={16} />
        </button>
      )}
    </li>
  );
}

function NewPatient({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState('');
  const [mdt, setMdt] = useState('');
  return (
    <form
      className="card new-pt"
      onSubmit={(e) => { e.preventDefault(); const id = addPatient(name, mdt); onDone(); window.location.hash = `#/pacienti/${id}`; }}
    >
      <h2>Nový pacient</h2>
      <div className="new-pt-fields">
        <label>Jméno a příjmení <span className="muted">(nepovinné, doplní se ze zpráv)</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="např. Jan Novák" autoFocus />
        </label>
        <label>Termín konzilia <span className="muted">(nepovinné)</span>
          <input type="date" value={mdt} min={SIM_TODAY} onChange={(e) => setMdt(e.target.value)} />
        </label>
      </div>
      <div className="form-actions">
        <button type="submit" className="btn-primary">Založit a přidat zprávy</button>
        <button type="button" className="btn-ghost" onClick={onDone}>Zrušit</button>
      </div>
    </form>
  );
}

export function PatientsList() {
  const stored = useStoredPatients();
  const [adding, setAdding] = useState(false);
  const n = stored.length + 1;
  return (
    <>
      <div className="list-head">
        <div>
          <h1>Pacienti</h1>
          <p className="muted">{n} {n === 1 ? 'pacient' : n < 5 ? 'pacienti' : 'pacientů'} · kliknutím otevřete</p>
        </div>
        {!adding && <button type="button" className="btn-primary" onClick={() => setAdding(true)}><Icon name="plus" size={18} />Nový pacient</button>}
      </div>
      {adding && <NewPatient onDone={() => setAdding(false)} />}
      <section className="card pt-card" aria-label="Seznam pacientů">
        <ul className="pt-list">
          <Row id={DEMO_ID} removable={false} />
          {stored.map((p) => <Row key={p.id} id={p.id} removable />)}
        </ul>
      </section>
    </>
  );
}
