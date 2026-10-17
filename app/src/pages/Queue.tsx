// Fronta prípadov: greeting + ranný prehľad (one sentence derived from CASES + the session), life filters,
// patient cards sorted ONLY by deadline (never by health data), and a right column with the coordinator's
// balance (derived from data, no invented numbers) and the measured accuracy of the AI extraction.
import { useMemo, useState, type ReactNode } from 'react';
import { CASES } from '../data/cases';
import { DEMO_TODAY, type Case, type CaseStatus, type ISODate } from '../types';
import { useNav } from '../nav';
import { EMPTY_SESSION, isDecided, isPending, isResolved, useSessions, type CaseSession } from '../components/session';
import { EvalCard, type EvalRow } from '../components/EvalCard';
import { useAllCaseSessions } from '../components/case/caseSession';
import { EMPTY_PROFILE, mergeSessions } from '../components/docs/useCaseSessionSafe';
import {
  Avatar, Button, Card, CASE_STATUS_LABEL, CASE_STATUS_TONE, Icon, Pill, Stat, Tooltip,
  addDays, daysBetween, fmtDate, fmtDateLong, fmtDue, parseISO, plural, pluralWord,
} from '../components/ui';
import { COORDINATOR } from '../components/Shell';
import './Queue.css';

const TODAY: ISODate = DEMO_TODAY;
const FULL_CASE: Case = CASES.find((c) => c.demo === 'full') ?? CASES[0];

const CLOCK_HINT =
  'Hodiny cesty: dni od prijatia žiadanky oproti cieľovej lehote. Cieľ 33 dní = dánsky vzor pre pankreas ' +
  '(6 dní do prvej návštevy + 27 dní do rozhodnutia, Sundhedsdatastyrelsen). Zahraničný vzor, nie česká norma: ' +
  'ČR záväzné lehoty nemá, MZ uvádza len cieľ „ideálne do 2 týždňov“ pre rýchlo postupujúce nádory.';
const CLOCK_HINT_OTHER = 'Dni od prijatia žiadanky. Cieľovú lehotu (dánsky vzor) máme len pre pankreas, pri tejto diagnóze ju appka nenastavuje.';
const isPancreas = (c: Case) => /pankrea|C25/i.test(c.diagnosisShort);

/** Measured accuracy of the AI extraction (numbers are read at runtime from public/data/eval-*.json). */
const EVAL_ROWS: EvalRow[] = [
  { file: 'data/eval-alena.json', name: `${FULL_CASE.patient.firstName} ${FULL_CASE.patient.lastName[0]}.`, sub: FULL_CASE.diagnosisShort },
  ...(() => {
    const second = CASES.find((c) => c.id === 'novak');
    return [{
      file: 'data/eval-pacient-2.json',
      name: second ? `${second.patient.firstName} ${second.patient.lastName[0]}.` : 'Druhý fiktívny pacient',
      sub: second ? second.diagnosisShort : 'zatiaľ nie je vo fronte',
    }];
  })(),
];

type FilterId = 'all' | 'mine' | 'others' | 'late' | 'mdtWeek';
const FILTERS: { id: FilterId; label: string }[] = [
  { id: 'all', label: 'Všetky' },
  { id: 'mine', label: 'Čaká na mňa' },
  { id: 'others', label: 'Čaká na iných' },
  { id: 'late', label: 'Mešká' },
  { id: 'mdtWeek', label: 'Konzílium tento týždeň' },
];

/* ---------------------------------------------------------------------------
   A case + what happened to it in this session (closed, ECOG answered, …). */
interface Row { c: Case; s: CaseSession; status: CaseStatus; open: boolean; next: Case['nextStep'] }

/** "Ďalší krok" after this session's actions (same rule as the case screen): once the missing field named in the
 *  next step is requested, the request's addressee is on the move; once it is answered, the next open item follows. */
function effectiveNext(c: Case, s: CaseSession): Case['nextStep'] {
  const ns = c.nextStep;
  // the KOC doctor confirmed the handover: it is no longer "incomplete" – what is left goes to the MDT (QA R5 #3)
  if (s.mdtConfirmedAt && c.mdtDate) {
    const conflicts = c.fields.filter((f) => f.status === 'conflict' && !isDecided(s.overrides[f.key], TODAY)).length;
    return {
      text: `Podklad potvrdil ${s.mdtConfirmedBy ?? 'lekár KOC'}${conflicts ? ` · ${conflicts} ${pluralWord(conflicts, 'rozpor nechaný', 'rozpory nechané', 'rozporov nechaných')} konzíliu` : ''}`,
      owner: 'konzílium', mine: false, due: c.mdtDate,
    };
  }
  if (c.status === 'new' && s.acceptedAt) {
    const rest = ns.text.replace(/^Prevziať žiadosť praktika( a )?/i, '').trim();
    return { ...ns, text: rest ? rest.charAt(0).toUpperCase() + rest.slice(1) : 'Zaradiť prípad na konzílium' };
  }
  const ref = c.fields.find((f) => f.status === 'missing' && ns.text.toLowerCase().includes(f.label.toLowerCase()));
  if (!ref) return ns;
  const ov = s.overrides[ref.key];
  if (ov?.kind === 'pending') return { text: `Čakáme na odpoveď: ${ref.label}`, owner: ov.to, due: ns.due, mine: false };
  if (!isResolved(ov, TODAY)) return ns;
  const proposed = c.fields.filter((f) => f.status === 'proposed' && s.overrides[f.key]?.kind !== 'confirmed').length;
  const conflicts = c.fields.filter((f) => f.status === 'conflict' && !isDecided(s.overrides[f.key], TODAY)).length;
  const missing = c.fields.filter((f) => f.status === 'missing' && !isResolved(s.overrides[f.key], TODAY)).length;
  const parts = [
    proposed ? `${proposed} ${pluralWord(proposed, 'návrh', 'návrhy', 'návrhov')}` : '',
    conflicts ? `${conflicts} ${pluralWord(conflicts, 'rozpor', 'rozpory', 'rozporov')}` : '',
    missing ? `${missing} ${pluralWord(missing, 'chýbajúce pole', 'chýbajúce polia', 'chýbajúcich polí')}` : '',
  ].filter(Boolean);
  if (parts.length) {
    const list = parts.length > 1 ? `${parts.slice(0, -1).join(', ')} a ${parts[parts.length - 1]}` : parts[0];
    return { text: `Skontrolovať ${list}${c.mdtDate ? ' pred konzíliom' : ''}`, owner: 'ja (koordinátor)', mine: true, due: c.mdtDate ? addDays(c.mdtDate, -1) : ns.due };
  }
  if (c.mdtDate) return { text: `Podklad je kompletný · konzílium ${fmtDate(c.mdtDate)}`, owner: 'konzílium', mine: false, due: c.mdtDate };
  return ns;
}

function rowOf(c: Case, s: CaseSession): Row {
  const status: CaseStatus = s.closedAt ? 'closed' : c.status === 'new' && s.acceptedAt ? 'active' : c.status;
  return { c, s, status, open: status !== 'closed', next: effectiveNext(c, s) };
}

/* Derived helpers: purely administrative (deadlines, owners), no health data. */
function overdueSteps(r: Row) {
  return r.open ? r.c.steps.filter((s) => s.state !== 'delivered' && s.due < TODAY) : [];
}
/** Days the case is late: the worst of the next step and any open step past its date. */
function lateDays(r: Row): number {
  if (!r.open) return 0;
  const dues = [r.next.due, ...overdueSteps(r).map((s) => s.due)];
  return Math.max(0, ...dues.map((d) => daysBetween(d, TODAY)));
}
function weekRange(today: ISODate): [ISODate, ISODate] {
  const monOffset = (parseISO(today).getUTCDay() + 6) % 7;
  const start = addDays(today, -monOffset);
  return [start, addDays(start, 6)];
}
const [WEEK_START, WEEK_END] = weekRange(TODAY);
function mdtThisWeek(c: Case): boolean {
  return !!c.mdtDate && c.mdtDate >= WEEK_START && c.mdtDate <= WEEK_END;
}
function mineToday(r: Row): boolean {
  return r.open && r.next.mine && r.next.due <= TODAY;
}
function matches(r: Row, f: FilterId): boolean {
  switch (f) {
    case 'all': return true;
    case 'mine': return r.open && r.next.mine;
    case 'others': return r.open && !r.next.mine;
    case 'late': return lateDays(r) > 0;
    case 'mdtWeek': return mdtThisWeek(r.c);
  }
}
/** "Výkonnostný stav (ECOG)" → "ECOG"; "Telefón pacientky" → "telefón pacientky". */
function shortField(label: string): string {
  const m = label.match(/\(([^)]+)\)/);
  if (m) return m[1];
  return /^[A-ZÁ-Ž][a-zá-ž]/.test(label) ? label.charAt(0).toLowerCase() + label.slice(1) : label;
}
/** "Prevziať žiadosť praktika a vyžiadať CT…" → "prevziať žiadosť praktika" (first clause, lower-case). */
function shortStep(text: string): string {
  const first = text.split(/\s+(?:a|do|na|pred|v)\s+|[,;:(]/)[0].trim();
  const t = first.length > 40 ? `${first.slice(0, 38).trim()}…` : first;
  return t.charAt(0).toLowerCase() + t.slice(1);
}
/** What is still open in the handover for the MDT (missing / requested / conflicts), after this session's actions. */
function handoverIssues(r: Row): string[] {
  const missing = r.c.fields.filter((f) => f.status === 'missing' && !isResolved(r.s.overrides[f.key], TODAY));
  const pending = missing.filter((f) => isPending(r.s.overrides[f.key]));
  const stillMissing = missing.filter((f) => !isPending(r.s.overrides[f.key]));
  const conflicts = r.c.fields.filter((f) => f.status === 'conflict' && !isDecided(r.s.overrides[f.key], TODAY)).length;
  const out: string[] = [];
  if (stillMissing.length) out.push(`chýba ${stillMissing.map((f) => shortField(f.label)).join(', ')}`);
  if (pending.length) out.push(`${pending.map((f) => shortField(f.label)).join(', ')} vyžiadané, čaká na odpoveď`);
  if (conflicts) out.push(plural(conflicts, 'rozpor', 'rozpory', 'rozporov'));
  return out;
}
/** A handover counts as complete when the KOC doctor confirmed it or nothing is open in it. */
const handoverDone = (r: Row) => !!r.s.mdtConfirmedAt || handoverIssues(r).length === 0;

/** The morning overview: one line per topic, every patient name opens the case (QA R5 #15). Administrative only. */
function briefing(rows: Row[], open: (c: Case) => void): ReactNode[] {
  const lines: ReactNode[] = [];
  const who = (r: Row) => (
    <button type="button" className="brief__who" onClick={() => open(r.c)}>{r.c.patient.lastName}</button>
  );
  const list = <T,>(items: T[], render: (x: T) => ReactNode, sep = ', ') =>
    items.map((x, i) => <span key={i}>{i > 0 && sep}{render(x)}</span>);

  const mine = rows.filter(mineToday);
  lines.push(mine.length
    ? <><b>Na mne {mine.some((r) => r.next.due < TODAY) ? 'dnes alebo skôr' : 'dnes'}:</b> {list(mine, (r) => <>{who(r)} – {shortStep(r.next.text)}</>)}</>
    : <><b>Na mne dnes:</b> nič s termínom</>);

  const chase = rows.flatMap((r) => {
    const steps = overdueSteps(r).map((s) => ({ r, text: `${shortStep(s.title)} mešká ${plural(daysBetween(s.due, TODAY), 'deň', 'dni', 'dní')}` }));
    if (!steps.length && r.open && !r.next.mine && r.next.due < TODAY) {
      steps.push({ r, text: `${shortStep(r.next.text)} mešká ${plural(daysBetween(r.next.due, TODAY), 'deň', 'dni', 'dní')}` });
    }
    return steps;
  });
  lines.push(chase.length
    ? <><b>Urgovať:</b> {list(chase, (x) => <>{who(x.r)} – {x.text}</>, '; ')}</>
    : <><b>Urgovať:</b> nikoho</>);

  for (const r of rows.filter((x) => x.open && mdtThisWeek(x.c))) {
    const issues = handoverIssues(r);
    lines.push(r.s.mdtConfirmedAt
      ? <><b>Konzílium {fmtDate(r.c.mdtDate)}:</b> {who(r)} – podklad potvrdil {r.s.mdtConfirmedBy ?? 'lekár KOC'}{issues.length ? ` · nechané konzíliu: ${issues.join(' · ')}` : ''}</>
      : issues.length
        ? <><b>Konzílium {fmtDate(r.c.mdtDate)}:</b> {who(r)} – neúplný podklad: {issues.join(' · ')}</>
        : <><b>Konzílium {fmtDate(r.c.mdtDate)}:</b> {who(r)} – podklad je kompletný</>);
  }

  const fresh = rows.filter((r) => r.status === 'new');
  if (fresh.length > 0) lines.push(<><b>{fresh.length === 1 ? 'Nová žiadanka' : 'Nové žiadanky'}:</b> {list(fresh, who)}</>);

  return lines;
}

/* ---------------------------------------------------------------- Page */
export default function Queue() {
  const { go } = useNav();
  const { sessions } = useSessions();
  const profiles = useAllCaseSessions(); // what the coordinator did on the case screens (ECOG answered, conflicts verified…)
  const [filter, setFilter] = useState<FilterId>('all');

  const rows = useMemo(
    () => CASES.map((c) => rowOf(c, mergeSessions(sessions[c.id] ?? EMPTY_SESSION, profiles[c.id] ?? EMPTY_PROFILE))),
    [sessions, profiles],
  );
  const counts = useMemo(
    () => Object.fromEntries(FILTERS.map((f) => [f.id, rows.filter((r) => matches(r, f.id)).length])) as Record<FilterId, number>,
    [rows],
  );
  // Order: open cases by deadline of the next step, then by MDT date; closed cases last. Never by health data.
  const visible = useMemo(
    () => rows.filter((r) => matches(r, filter)).sort(
      (a, b) => Number(!a.open) - Number(!b.open)
        || a.next.due.localeCompare(b.next.due)
        || (a.c.mdtDate ?? '9999').localeCompare(b.c.mdtDate ?? '9999'),
    ),
    [rows, filter],
  );
  const brief = useMemo(() => briefing(rows, (c) => go({ page: 'case', caseId: c.id })), [rows, go]);
  const lightCount = CASES.filter((c) => c.demo === 'light').length;
  const otherFull = CASES.filter((c) => c.demo === 'full' && c.id !== FULL_CASE.id);

  return (
    <div className="queue">
      <section className="queue__main">
        <header className="queue__head">
          <div>
            <h1>Dobré ráno, {COORDINATOR.name}.</h1>
            <div className="queue__date">{fmtDateLong(TODAY)}</div>
          </div>
          <Button variant="ghost" icon="inbox" onClick={() => go({ page: 'intake' })} title="Prepne do pohľadu praktika: takto posiela žiadanku do KOC (bez účtu)">Pohľad praktika: nová žiadanka</Button>
        </header>

        <div className="brief" aria-label="Ranný prehľad">
          <span className="brief__icon"><Icon name="sun" size={18} /></span>
          <div>
            <div className="kicker">Ranný prehľad</div>
            <ul className="brief__list">
              {brief.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </div>
        </div>

        <div className="filters" role="group" aria-label="Filtre">
          {FILTERS.map((f) => (
            <button key={f.id} type="button" className={`filter ${filter === f.id ? 'filter--active' : ''}`}
              aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
              {f.label}<span className="filter__n">{counts[f.id]}</span>
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <Card className="empty">
            <span className="empty__ico"><Icon name="check" size={22} /></span>
            <div className="empty__t">Tu je prázdno</div>
            <div className="empty__s">{filter === 'late' ? 'Nič nemešká.' : 'V tomto pohľade nie je žiadny prípad.'}</div>
            <Button variant="ghost" size="sm" onClick={() => setFilter('all')}>Zobraziť všetky</Button>
          </Card>
        ) : (
          <div className="cards">
            {visible.map((r) => <CaseCard key={r.c.id} r={r} onOpen={() => go({ page: 'case', caseId: r.c.id })} />)}
          </div>
        )}
        <p className="queue__note">
          {FULL_CASE.patient.firstName} {FULL_CASE.patient.lastName} = prípad zo zadania VZP.
          {otherFull.length > 0 && <> {otherFull.map((c) => `${c.patient.firstName} ${c.patient.lastName}`).join(', ')} = druhý fiktívny pacient (strojové vyťaženie, každý údaj potvrdí človek).</>}
          {lightCount > 0 && <> {lightCount === 1 ? 'Ďalší prípad je ilustračný' : `Ďalšie ${lightCount} prípady sú ilustračné`} (čip „ukážka“).</>}
          {' '}Poradie len podľa termínov, nikdy podľa zdravotných údajov.
        </p>
      </section>

      <Balance rows={rows} />
    </div>
  );
}

/* ------------------------------------------------------------ Case card */
function CaseCard({ r, onOpen }: { r: Row; onOpen: () => void }) {
  const { c, status, open } = r;
  const name = `${c.patient.firstName} ${c.patient.lastName}`;
  const late = lateDays(r);
  const day = Math.max(0, daysBetween(c.receivedAt, TODAY));
  const pct = Math.min(100, Math.round((day / Math.max(1, c.clockTargetDays)) * 100));
  const pancreas = isPancreas(c);

  return (
    <Card className="pcard" onClick={onOpen} ariaLabel={`Otvoriť prípad ${name}`}>
      <div className="pcard__top">
        <span className="pcard__tags">
          <Pill tone={CASE_STATUS_TONE[status]} size="sm" dot>{CASE_STATUS_LABEL[status]}</Pill>
          {c.demo === 'light' && <Pill size="sm" className="pcard__demo">ukážka</Pill>}
        </span>
        {late > 0 && <Pill tone="coral" size="sm">mešká {plural(late, 'deň', 'dni', 'dní')}</Pill>}
      </div>

      <div className="pcard__who">
        <Avatar name={name} size={56} ring />
        <div>
          <div className="pcard__name">{name}</div>
          <div className="pcard__dx">{c.patient.age} r. · {c.diagnosisShort}</div>
        </div>
      </div>

      <div className="pcard__next">
        <Icon name={open ? 'arrow-right' : 'check'} size={14} />
        <span>{open ? r.next.text : `Prípad uzavretý ${fmtDate(r.s.closedAt)} · záver doručený`}</span>
      </div>

      <div className="clock">
        <div className={`clock__bar ${open && !pancreas ? 'clock__bar--none' : ''}`}>
          {(pancreas || !open) && (
            <div className={`clock__fill ${!open ? 'clock__fill--done' : day > c.clockTargetDays ? 'clock__fill--late' : ''}`} style={{ width: `${!open ? 100 : pct}%` }} />
          )}
        </div>
        <div className="clock__text">
          <span>{!open
            ? `uzavreté za ${plural(Math.max(0, daysBetween(c.receivedAt, r.s.closedAt ?? TODAY)), 'deň', 'dni', 'dní')}`
            : pancreas ? <>deň <b>{day}</b> z {c.clockTargetDays}</> : <>deň <b>{day}</b> od prijatia žiadosti</>}</span>
          <Tooltip text={pancreas ? CLOCK_HINT : CLOCK_HINT_OTHER}>
            <span className="clock__hint"><Icon name="info" size={14} /> {pancreas ? 'cieľ' : 'bez cieľa'}</span>
          </Tooltip>
        </div>
      </div>

      <div className="pcard__cols">
        <div>
          <div className="col__k">Konzílium</div>
          <div className="col__v">{fmtDate(c.mdtDate)}</div>
        </div>
        <div>
          <div className="col__k">Na ťahu</div>
          <div className={`col__v ${open && r.next.mine ? 'col__v--mine' : ''}`} title={r.next.owner}>
            {!open ? '–' : r.next.mine ? 'ja' : r.next.owner}
          </div>
        </div>
        <div>
          <div className="col__k">Termín</div>
          <div className={`col__v ${late > 0 ? 'col__v--late' : ''}`}>{!open ? '–' : fmtDue(r.next.due, TODAY)}</div>
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------------------------- Balance (from data) */
/** Coordinator's balance derived only from administrative data in CASES + this session; nothing invented. */
/* The headline is closed loops, never money or the number of interventions (QA R5 #8, CONTRACT „gamifikácia“). */
function Balance({ rows }: { rows: Row[] }) {
  const onMe = rows.filter(mineToday).length;
  const onOthers = rows.filter((r) => r.open && !r.next.mine).length;
  const closedThisWeek = rows.filter((r) => !r.open && (r.s.closedAt ?? '') >= WEEK_START).length;
  const mdtRows = rows.filter((r) => mdtThisWeek(r.c));
  const complete = mdtRows.filter(handoverDone).length;

  return (
    <aside className="side" aria-label="Moja bilancia">
      <div className="kicker side__title">Moja bilancia</div>
      <Card className="wk">
        <Stat pastel={2} value={closedThisWeek}
          label={`${pluralWord(closedThisWeek, 'slučka uzavretá', 'slučky uzavreté', 'slučiek uzavretých')} tento týždeň`}
          hint="záver konzília doručený praktikovi a potvrdený" />
        <div className="wk__row"><span>Podklady na konzílium tento týždeň kompletné</span><strong>{complete}/{mdtRows.length}</strong></div>
        <div className="wk__row"><span>S termínom dnes (na mne)</span><strong>{onMe}</strong></div>
        <div className="wk__row"><span>Čaká na iných</span><strong>{onOthers}</strong></div>
      </Card>
      <p className="side__note">Len administratívne kroky z dát prípadov, nikdy zdravotné údaje. Dni so zásahom (podklad pre výkon 51887) sú v zázname každého prípadu.</p>

      <EvalCard rows={EVAL_ROWS} variant="compact" />
      <p className="side__note">Strojové vyťaženie správ porovnané s ručne overenou zlatou sadou (npm run eval).</p>
    </aside>
  );
}
