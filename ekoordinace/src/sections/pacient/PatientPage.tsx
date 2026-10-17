// Section "Pacienti" (owner: Matej) – one patient's case: header with the key facts, tiles, and the journey as a
// compact stepper. Done steps stay small; the step that is on now opens below the stepper with what is still needed
// and whom to call. Every report opens for reading. Only the "Přehled" tab works so far; greyed items come next.
// Data: src/data/alena.json, computed from the fictional reports by the shared engine (npm run data).
import { useCallback, useEffect, useRef, useState } from 'react';
import data from '../../data/alena.json';
import { DocViewer } from '../../ui/DocViewer';
import type { DocText } from '../../ui/DocViewer';
import { Icon } from '../../ui/Icon';
import { czDate, daysBetween, inDays, nb } from '../../ui/format';
import { Journey } from './Journey';
import type { OpenDoc } from './Journey';
import { PhoneContacts } from './PhoneContacts';
import type { Person, Step } from './types';
import './pacient.css';

const SOON = 'Připravujeme v dalším kroku';
const steps = data.steps as Step[];
const documents = data.documents as Record<string, DocText>;
const nowStep = steps.find((s) => s.status === 'now') ?? steps[0];

/** Number of open to-dos, for the bell in the top bar. */
export const openTasks = nowStep.todo?.length ?? 0;

// whom the coordinator calls about this patient: the patient, the contact person, the GP (numbers from the reports)
const phonePeople: Person[] = [
  { role: data.patient.sex === 'žena' ? 'Pacientka' : 'Pacient', name: data.patient.name, phone: data.patient.phone },
  ...(data.patient.contactPerson ? [data.patient.contactPerson] : []),
  data.patient.gp,
];

function PatientHead() {
  const p = data.patient;
  const female = p.sex === 'žena';
  return (
    <div className="patient-head">
      <span className="avatar big" aria-hidden="true">{p.initials}</span>
      <h1>{p.name}</h1>
      <dl className="facts">
        <div><dt>{female ? 'Narozena' : 'Narozen'}</dt><dd>{nb(p.born)}<span className="soft"> · {p.age}</span></dd></div>
        <div><dt>Pojišťovna</dt><dd title={p.insurer.name}>{p.insurer.short} <span className="code">{p.insurer.code}</span></dd></div>
        <div><dt>Diagnóza</dt><dd title={`Podle: ${p.diagnosis.source} (zpráva ${p.diagnosis.docId})`}><span className="code">{p.diagnosis.code}</span> {p.diagnosis.text}</dd></div>
      </dl>
      <div className="head-actions">
        <PhoneContacts people={phonePeople} />
        <button type="button" className="round-btn" disabled title={`Vyžádat zprávu – ${SOON.toLowerCase()}`} aria-label="Vyžádat zprávu"><Icon name="note" size={18} /></button>
        <button type="button" className="round-btn" disabled title={`Napsat praktikovi – ${SOON.toLowerCase()}`} aria-label="Napsat praktikovi"><Icon name="message" size={18} /></button>
      </div>
    </div>
  );
}

export function PatientPage({ path }: { path: string[] }) {
  const [selected, setSelected] = useState(nowStep.id);
  const [reading, setReading] = useState<{ id: string; marks: string[] } | null>(null);
  const journeyRef = useRef<HTMLElement | null>(null);
  const s = data.stats;
  const news = data.news[0];
  const openDoc: OpenDoc = useCallback((id, marks = []) => setReading({ id, marks }), []);
  const days = daysBetween(data.today, data.mdtDate);

  const show = useCallback((id: string) => {
    setSelected(id);
    journeyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    journeyRef.current?.focus({ preventScroll: true });
  }, []);

  // #/pacienti/ukoly (the bell) opens the to-dos; the address is then reset so the bell works again
  useEffect(() => {
    if (path[0] !== 'ukoly') return;
    show(nowStep.id);
    window.history.replaceState(null, '', '#/pacienti');
  }, [path, show]);

  return (
    <>
      <nav className="crumbs" aria-label="Drobečková navigace">
        <span>Pacienti</span><Icon name="right" size={14} /><span className="crumb-now">{data.patient.name}</span>
      </nav>

      <PatientHead />

      <div className="tabs-row">
        <div className="tabs" role="tablist" aria-label="Části případu">
          <button type="button" role="tab" aria-selected="true" className="tab on">Přehled</button>
          {['Zprávy', 'Údaje pro konzilium', 'Podklad', 'Závěr'].map((t) => (
            <button type="button" role="tab" aria-selected="false" className="tab" disabled title={SOON} key={t}>{t}</button>
          ))}
        </div>
      </div>

      <section className="card stats" aria-label="Hlavní údaje">
        <div className="stat"><span className="stat-icon"><Icon name="calendar" /></span><span><small>Konzilium</small><b>{czDate(data.mdtDate)}</b><em>{inDays(days)}</em></span></div>
        <div className="stat"><span className="stat-icon"><Icon name="fields" /></span><span><small>Údaje pro konzilium</small><b>{s.ready} z {s.fields}</b><em>připraveno k potvrzení</em></span></div>
        <button type="button" className="stat stat-link" onClick={() => show(nowStep.id)}>
          <span className="stat-icon red"><Icon name="alert" /></span>
          <span><small>K vyřešení</small><b>{openTasks}</b><em>{s.missing} chybí · {s.conflicts} {s.conflicts === 1 ? 'rozpor' : s.conflicts < 5 ? 'rozpory' : 'rozporů'}</em></span>
        </button>
        {news ? (
          <button type="button" className="stat stat-link" onClick={() => openDoc(news.id)}>
            <span className="stat-icon"><Icon name="file" /></span>
            <span><small>Dnes nové</small><b>{news.what}</b><em>zpráva {news.id} · {news.dept}</em></span>
          </button>
        ) : (
          <div className="stat"><span className="stat-icon"><Icon name="file" /></span><span><small>Dnes nové</small><b>Nic</b><em>žádná nová zpráva</em></span></div>
        )}
      </section>

      <Journey
        steps={steps}
        selected={selected}
        onSelect={setSelected}
        onOpenDoc={openDoc}
        today={data.today}
        female={data.patient.sex === 'žena'}
        cardRef={journeyRef}
      />

      <DocViewer doc={reading ? documents[reading.id] ?? null : null} marks={reading?.marks ?? []} onClose={() => setReading(null)} />
    </>
  );
}
