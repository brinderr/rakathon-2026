// Section "Konzilia" (owner: Matej) – the MDT sessions: patients grouped by the date of their MDT, nearest first, each
// with the question for the MDT and the state of the podklad (open points → ready → confirmed). A session prints as the
// programme of the MDT. Past sessions show whether the conclusion reached the GP; patients without a date are listed.
import { useEffect, useState } from 'react';
import type { CaseState } from '../../state/caseStore';
import { SIM_TODAY } from '../../state/patients';
import { Icon } from '../../ui/Icon';
import { czDate, daysBetween, inDays, nb } from '../../ui/format';
import { useLiveCases } from '../pacient/live';
import type { CaseData } from '../pacient/types';
import './konzilia.css';

interface Case { id: string; label: string; data: CaseData; state: CaseState }

const WEEKDAY = ['neděle', 'pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota'];
const weekday = (iso: string) => WEEKDAY[new Date(`${iso}T12:00:00`).getDay()];
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const time = (at: string) => `${czDate(at.slice(0, 10))} ${at.slice(11)}`;
const patients = (n: number) => `${n} ${n === 1 ? 'pacient' : n < 5 ? 'pacienti' : 'pacientů'}`;

/** The podklad as the Podklad tab sees it: open points first, then ready for the doctor, then confirmed. */
function podklad(c: Case): { label: string; cls: string; detail?: string } {
  if (c.state.confirmed) return { label: 'Potvrzeno – PDF', cls: 'ok', detail: `${c.state.confirmed.by}, ${time(c.state.confirmed.at)}` };
  const open = c.data.fields.filter((f) => f.todo && ['chybí', 'neúplné', 'rozpor'].includes(f.status)).length;
  if (open) return { label: `${open} ${open === 1 ? 'bod' : open < 5 ? 'body' : 'bodů'} k vyřešení`, cls: 'miss' };
  return { label: 'Připraveno k potvrzení', cls: 'conf' };
}

/** After the MDT: did the conclusion reach the GP (the delivery receipt of the Závěr tab)? */
function conclusion(c: Case): { label: string; cls: string } {
  const z = c.state.conclusion;
  if (z?.read) return { label: `Závěr přečten ${time(z.read)}`, cls: 'ok' };
  if (z?.delivered) return { label: `Závěr doručen ${time(z.delivered)}`, cls: 'ok' };
  if (z?.sent) return { label: `Závěr odeslán ${time(z.sent.at)}`, cls: 'conf' };
  return { label: 'Závěr neodeslán', cls: 'miss' };
}

function Question({ text }: { text: string }) {
  const [full, setFull] = useState(false);
  if (!text) return <p className="kz-q kz-empty">Otázka pro konzilium chybí</p>;
  const long = text.length > 160;
  return (
    <p className="kz-q">
      <span className={long && !full ? 'kz-q-short' : undefined}>{nb(text)}</span>
      {long && <button type="button" className="kz-more no-print" onClick={() => setFull(!full)}>{full ? 'méně' : 'celé'}</button>}
    </p>
  );
}

function CaseRow({ c, past }: { c: Case; past: boolean }) {
  const p = c.data.patient;
  const st = podklad(c);
  const z = past ? conclusion(c) : null;
  return (
    <li className="kz-case">
      <div className="kz-who">
        <a href={`#/pacienti/${c.id}`}><b>{p.name}</b></a>
        {p.born && <small>nar. {nb(p.born)}</small>}
      </div>
      <div className="kz-main">
        <p className="kz-dx">{p.diagnosis.code && <span className="code">{p.diagnosis.code}</span>}{p.diagnosis.text || 'Diagnóza zatím chybí'}</p>
        <Question text={c.data.fields.find((f) => f.key === 'mdtQuestion')?.value ?? ''} />
      </div>
      <div className="kz-state">
        <span className={`chip ${st.cls}`}>{st.label}</span>
        {st.detail && <small>{st.detail}</small>}
        {z && <span className={`chip ${z.cls}`}>{z.label}</span>}
        <span className="kz-links no-print">
          <a href={`#/pacienti/${c.id}/podklad`}>Podklad</a>
          <a href={`#/pacienti/${c.id}/udaje`}>Údaje</a>
          {past && <a href={`#/pacienti/${c.id}/zaver`}>Závěr</a>}
        </span>
      </div>
    </li>
  );
}

function Session({ date, cases, past, printing, onPrint }: { date: string; cases: Case[]; past: boolean; printing: boolean; onPrint: () => void }) {
  const days = daysBetween(SIM_TODAY, date);
  const confirmed = cases.filter((c) => c.state.confirmed).length;
  return (
    <section className={`card kz-session${past ? ' past' : ''}${printing ? ' kz-print' : ''}`} aria-label={`Konzilium ${czDate(date)}`}>
      <header className="kz-head">
        <div>
          <p className="kz-print-only">Program multidisciplinárního konzilia · KOC Nemocnice Lipová</p>
          <h2>{cap(weekday(date))} {czDate(date)}</h2>
          <p className="kz-sub">
            {past ? 'proběhlo' : inDays(days)} · {patients(cases.length)}
            {!past && <> · <b className={confirmed === cases.length ? 'ok' : ''}>{confirmed} z {cases.length} {cases.length === 1 ? 'podkladu' : 'podkladů'} potvrzeno</b></>}
          </p>
        </div>
        <button type="button" className="btn-ghost no-print" onClick={onPrint}><Icon name="download" size={16} />Program konzilia</button>
      </header>
      <ol className="kz-list">{cases.map((c) => <CaseRow key={c.id} c={c} past={past} />)}</ol>
    </section>
  );
}

export function Konzilia() {
  const all = useLiveCases();
  const [printing, setPrinting] = useState<string | null>(null);
  const ready = all.filter((x): x is Case => x.data !== null);
  const loading = all.length - ready.length;

  // print one session: mark it, then open the print dialog (the PDF is named after the session)
  useEffect(() => {
    if (!printing) return;
    const title = document.title;
    document.title = `Program konzilia ${czDate(printing).replace(/\s/g, ' ')}`;
    const done = () => { document.title = title; setPrinting(null); };
    window.addEventListener('afterprint', done, { once: true });
    window.print();
    return () => window.removeEventListener('afterprint', done);
  }, [printing]);

  const dated = new Map<string, Case[]>();
  for (const c of ready) if (c.data.mdtDate) dated.set(c.data.mdtDate, [...(dated.get(c.data.mdtDate) ?? []), c]);
  const dates = [...dated.keys()];
  const upcoming = dates.filter((d) => d >= SIM_TODAY).sort();
  const past = dates.filter((d) => d < SIM_TODAY).sort().reverse();
  const undated = ready.filter((c) => !c.data.mdtDate);
  const byName = (a: Case, b: Case) => a.data.patient.name.localeCompare(b.data.patient.name, 'cs');

  return (
    <div className="konzilia">
      <nav className="crumbs" aria-label="Drobečková navigace"><span className="crumb-now">Konzilia</span></nav>
      <div className="list-head kz-page-head">
        <div>
          <h1>Konzilia</h1>
          <p className="muted">{upcoming.length ? `Nejbližší ${czDate(upcoming[0])} · ${inDays(daysBetween(SIM_TODAY, upcoming[0]))}` : 'Žádné naplánované konzilium'}</p>
        </div>
      </div>
      {loading > 0 && <p className="muted kz-loading">Zpracovávám zprávy pacientů…</p>}

      {upcoming.map((d) => (
        <Session key={d} date={d} cases={dated.get(d)!.sort(byName)} past={false} printing={printing === d} onPrint={() => setPrinting(d)} />
      ))}
      {!upcoming.length && ready.length > 0 && (
        <section className="card kz-empty-card"><p className="muted">Žádné naplánované konzilium. Termín se zadává v hlavičce pacienta.</p></section>
      )}

      {undated.length > 0 && (
        <section className="card kz-nodate" aria-label="Bez termínu konzilia">
          <h2>Bez termínu konzilia</h2>
          <ul>
            {undated.sort(byName).map((c) => (
              <li key={c.id}>
                <a href={`#/pacienti/${c.id}`}><b>{c.data.patient.name}</b></a>
                <span className="muted">{Object.keys(c.data.documents).length ? (c.data.patient.diagnosis.code || 'bez diagnózy') : 'zatím bez zpráv'}</span>
                <a className="kz-set" href={`#/pacienti/${c.id}`}>Zadat termín<Icon name="right" size={14} /></a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {past.length > 0 && <h2 className="kz-past-head">Proběhlá konzilia</h2>}
      {past.map((d) => (
        <Session key={d} date={d} cases={dated.get(d)!.sort(byName)} past printing={printing === d} onPrint={() => setPrinting(d)} />
      ))}
    </div>
  );
}
