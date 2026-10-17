// Section "Pacienti" (owner: Matej). #/pacienti = the list of patients (the demo case, added patients, "Nový pacient");
// #/pacienti/<id>/<tab> = one patient: header with the key facts and tabs. "Přehled" shows the tiles and the journey as
// a compact stepper (done steps small, the current step with what is still needed and whom to call); the other tabs
// live in ./tabs/, one file per tab with its owner (see README). Every report opens for reading. Added patients get
// their reports here (Word or text) and the case is built from them in the browser (src/case/buildCase.ts).
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useCase } from '../../state/caseStore';
import { DEMO_ID, setMdtDate, useCaseOf } from '../../state/patients';
import type { StoredPatient } from '../../state/patients';
import { DocViewer } from '../../ui/DocViewer';
import { Icon } from '../../ui/Icon';
import { czDate, daysBetween, inDays, nb } from '../../ui/format';
import { AddReports } from './AddReports';
import { CaseCtx } from './caseContext';
import { Compose, ComposeCtx, useCompose } from './Compose';
import type { ComposeRequest } from './Compose';
import { History } from './History';
import { Journey } from './Journey';
import type { OpenDoc } from './Journey';
import { liveCase, openPoints } from './live';
import { PatientsList } from './PatientsList';
import { PhoneContacts } from './PhoneContacts';
import { Plan } from './tabs/Plan';
import { Podklad } from './tabs/Podklad';
import { Udaje } from './tabs/Udaje';
import { Zaver } from './tabs/Zaver';
import { Zpravy } from './tabs/Zpravy';
import type { CaseData, Person } from './types';
import './pacient.css';

// tabs of the case – #/pacienti/<id>/<tab>; one file per tab in ./tabs/ (owners in README)
const TABS = [
  { id: 'prehled', label: 'Souhrn' },
  { id: 'zpravy', label: 'Zprávy', Tab: Zpravy },
  { id: 'udaje', label: 'Údaje pro konzilium', Tab: Udaje },
  { id: 'plan', label: 'Plán cesty', Tab: Plan },
  { id: 'podklad', label: 'Podklad', Tab: Podklad },
  { id: 'zaver', label: 'Závěr', Tab: Zaver },
];

/** The date of the MDT – it changes, so it is a field the coordinator edits right in the header. */
function MdtDate({ id, data }: { id: string; data: CaseData }) {
  // shown as text – changing it moves every deadline, so it opens only on purpose
  const [editing, setEditing] = useState(false);
  const days = data.mdtDate ? daysBetween(data.today, data.mdtDate) : null;
  return (
    <>
      {editing || !data.mdtDate
        ? <input type="date" className="fact-date" value={data.mdtDate} aria-label="Termín konzilia" autoFocus={editing}
            onChange={(e) => setMdtDate(id, e.target.value)} onBlur={() => setEditing(false)} />
        : <>{czDate(data.mdtDate)} <button type="button" className="fact-change" onClick={() => setEditing(true)}>změnit</button></>}
      <span className="soft">{days !== null ? ` · ${inDays(days)}` : ' · nenaplánováno'}</span>
    </>
  );
}

function PatientHead({ id, data }: { id: string; data: CaseData }) {
  const compose = useCompose();
  const p = data.patient;
  const female = p.sex === 'žena';
  // whom the coordinator calls about this patient: the patient, the contact person, the GP (numbers from the reports)
  const people: Person[] = [
    { role: female ? 'Pacientka' : 'Pacient', name: p.name, ...(p.phone ? { phone: p.phone } : {}) },
    ...(p.contactPerson ? [p.contactPerson] : []),
    p.gp,
  ];
  const facts = [
    p.born && { label: female ? 'Narozena' : 'Narozen', body: <>{nb(p.born)}{p.age && <span className="soft"> · {p.age}</span>}</> },
    p.insurer.code && { label: 'Pojišťovna', title: p.insurer.name, body: <>{p.insurer.short} <span className="code">{p.insurer.code}</span></> },
    (p.diagnosis.code || p.diagnosis.text) && { label: 'Diagnóza', title: p.diagnosis.source && `Podle: ${p.diagnosis.source}`, body: <><span className="code">{p.diagnosis.code}</span> {p.diagnosis.text}</> },
  ].filter(Boolean) as { label: string; title?: string; body: ReactNode }[];
  const mdt = { label: 'Konzilium', body: <MdtDate id={id} data={data} /> };
  return (
    <div className="patient-head">
      <span className="avatar big" aria-hidden="true">{p.initials}</span>
      <h1>{p.name}</h1>
      <dl className="facts">
        {facts.length ? facts.map((f) => <div key={f.label}><dt>{f.label}</dt><dd title={f.title || undefined}>{f.body}</dd></div>)
          : <div><dt>Údaje</dt><dd className="soft">zatím žádné – přidejte zprávy</dd></div>}
        <div><dt>{mdt.label}</dt><dd>{mdt.body}</dd></div>
      </dl>
      <div className="head-actions">
        {people.some((x) => x.phone) && <PhoneContacts people={people} />}
        <button type="button" className="btn-ghost head-btn" onClick={() => compose({ mode: 'request' })}><Icon name="note" size={17} /><span>Vyžádat zprávu</span></button>
        <button type="button" className="btn-ghost head-btn" onClick={() => compose({ mode: 'message' })}><Icon name="message" size={17} /><span>Napsat praktikovi</span></button>
      </div>
    </div>
  );
}

function CaseView({ id, data: built, stored, path }: { id: string; data: CaseData; stored: StoredPatient | null; path: string[] }) {
  // the reports plus what the coordinator filled in or checked – every tab sees the same
  const st = useCase(id);
  const data = useMemo(() => liveCase(built, st), [built, st]);
  const steps = data.steps;
  const nowStep = steps.find((s) => s.status === 'now') ?? steps[0];
  const [selected, setSelected] = useState(nowStep.id);
  const [reading, setReading] = useState<{ id: string; marks: string[] } | null>(null);
  const journeyRef = useRef<HTMLElement | null>(null);
  const s = data.stats;
  const news = data.news[0];
  // the same number as in the list, the overview and the MDTs
  const openTasks = openPoints(data, st);
  const todoStep = steps.find((x) => x.todo?.length)?.id ?? nowStep.id;
  const openDoc: OpenDoc = useCallback((docId, marks = []) => setReading({ id: docId, marks }), []);
  const [writing, setWriting] = useState<ComposeRequest | null>(null);

  const show = useCallback((stepId: string) => {
    setSelected(stepId);
    journeyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    journeyRef.current?.focus({ preventScroll: true });
  }, []);

  // when reports are added the current step can move on – follow it
  useEffect(() => { setSelected(nowStep.id); }, [nowStep.id]);

  // #/pacienti/<id>/ukoly (the bell) opens the to-dos; the address is then reset so the bell works again
  useEffect(() => {
    if (path[0] !== 'ukoly') return;
    show(nowStep.id);
    window.history.replaceState(null, '', `#/pacienti/${id}`);
  }, [path, show, id, nowStep.id]);

  const tab = TABS.find((t) => t.id === path[0]) ?? TABS[0];
  const Tab = tab.Tab;
  useEffect(() => { document.title = `${tab.label} · ${data.patient.name} · eKoordinace`; }, [tab.label, data.patient.name]);
  // #/pacienti/<id>/zpravy/<report> (from the search) opens that report
  useEffect(() => { if (path[0] === 'zpravy' && path[1] && data.documents[path[1]]) setReading({ id: path[1], marks: [] }); }, [path, data.documents]);
  const empty = Object.keys(data.documents).length === 0;

  return (
    <CaseCtx.Provider value={{ id, data, focus: path[0] === 'udaje' ? path[1] : undefined }}>
    <ComposeCtx.Provider value={setWriting}>
      <nav className="crumbs" aria-label="Drobečková navigace">
        <a href="#/pacienti">Pacienti</a><Icon name="right" size={14} /><a href={`#/pacienti/${id}`}>{data.patient.name}</a><Icon name="right" size={14} /><span className="crumb-now">{tab.label}</span>
      </nav>

      <PatientHead id={id} data={data} />

      <div className="tabs-row">
        <div className="tabs" role="tablist" aria-label="Části případu">
          {TABS.map((t) => (
            <a key={t.id} role="tab" aria-selected={t.id === tab.id} className={`tab${t.id === tab.id ? ' on' : ''}`} href={`#/pacienti/${id}/${t.id}`}>{t.label}</a>
          ))}
        </div>
      </div>

      {Tab ? <Tab openDoc={openDoc} /> : (<>
        {stored && empty && <AddReports patient={stored} first />}
        <section className="card stats three" aria-label="Hlavní údaje">
          <a className="stat stat-link" href={`#/pacienti/${id}/udaje`}><span className="stat-icon"><Icon name="fields" /></span><span><small>Údaje pro konzilium</small><b>{s.ready} z {s.fields}</b><em>připraveno k potvrzení</em></span></a>
          <button type="button" className="stat stat-link" onClick={() => show(todoStep)}>
            <span className="stat-icon red"><Icon name="alert" /></span>
            <span><small>K vyřešení</small><b>{openTasks}</b><em>{openTasks ? `${s.missing} chybí · ${s.conflicts} ${s.conflicts === 1 ? 'rozpor' : s.conflicts < 5 ? 'rozpory' : 'rozporů'}` : 'vše vyřešeno'}</em></span>
          </button>
          {news ? (
            <button type="button" className="stat stat-link" onClick={() => openDoc(news.id)}>
              <span className="stat-icon"><Icon name="file" /></span>
              <span><small>Dnes nové</small><b>{news.what}</b><em>{news.dept}</em></span>
            </button>
          ) : (
            <div className="stat"><span className="stat-icon"><Icon name="file" /></span><span><small>Dnes nové</small><b>Nic</b><em>žádná nová zpráva</em></span></div>
          )}
        </section>

        <Journey
          steps={steps}
          selected={steps.some((x) => x.id === selected) ? selected : nowStep.id}
          onSelect={setSelected}
          onOpenDoc={openDoc}
          today={data.today}
          female={data.patient.sex === 'žena'}
          cardRef={journeyRef}
        />

        <History />

        {stored && !empty && <AddReports patient={stored} />}
      </>)}

      <DocViewer doc={reading ? data.documents[reading.id] ?? null : null} marks={reading?.marks ?? []} onClose={() => setReading(null)} />
      <Compose req={writing} onClose={() => setWriting(null)} />
    </ComposeCtx.Provider>
    </CaseCtx.Provider>
  );
}

function PatientCase({ id, path }: { id: string; path: string[] }) {
  const { data, stored, missing } = useCaseOf(id);
  if (missing) {
    return (
      <section className="card notice">
        <h2>Pacient nenalezen</h2>
        <p className="muted">V tomto prohlížeči takový pacient není. <a href="#/pacienti">Zpět na pacienty</a></p>
      </section>
    );
  }
  if (!data) return <section className="card notice"><p className="muted">Zpracovávám zprávy…</p></section>;
  return <CaseView id={id} data={data} stored={stored} path={path} />;
}

/** #/pacienti → list, #/pacienti/<id>/… → one patient (old links #/pacienti/<tab> open the demo case). */
export function PatientPage({ path }: { path: string[] }) {
  if (!path[0]) return <PatientsList />;
  if (TABS.some((t) => t.id === path[0]) || path[0] === 'ukoly') return <PatientCase id={DEMO_ID} path={path} />;
  return <PatientCase id={path[0]} path={path.slice(1)} />;
}
