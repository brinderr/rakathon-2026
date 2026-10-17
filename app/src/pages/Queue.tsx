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
const FEE_51887_CZK = 250; // vyhl. 432/2025 Sb., bod 8.5: 250 Kč za uznaný výkon, najviac 1× denne na pacienta

const CLOCK_HINT =
  'Hodiny cesty: dni od prijatia žiadanky oproti cieľovej lehote. Cieľ 33 dní = dánsky vzor pre pankreas ' +
  '(6 dní do prvej návštevy + 27 dní do rozhodnutia, Sundhedsdatastyrelsen). Zahraničný vzor, nie česká norma: ' +
  'ČR záväzné lehoty nemá, MZ uvádza len cieľ „ideálne do 2 týždňov“ pre rýchlo postupujúce nádory.';
const CLOCK_HINT_OTHER = ' Pri tejto diagnóze je v deme nastavený ten istý cieľ (ukážka).';
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
  if (c.mdtDate) return { text: `Podklad je kompletný · konzílium ${fmtDate(c.mdtDate)}`, owner: `MDT · ${c.koc}`, mine: false, due: c.mdtDate };
  return ns;
}

function rowOf(c: Case, s: CaseSession): Row {
  const status: CaseStatus = s.closedAt ? 'closed' : c.status;
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
/** Days with a coordinator intervention up to today (podklad pre výkon 51887): unique dates of billable log entries. */
function billableDays(r: Row): number {
  const dates = new Set([...r.c.log, ...r.s.sessionLog].filter((e) => e.billable && e.date <= TODAY).map((e) => e.date));
  return dates.size;
}

/** One administrative sentence for the morning: what is on me today, whom to chase, which MDT lacks data, new referrals. */
function briefing(rows: Row[]): ReactNode[] {
  const parts: ReactNode[] = [];

  const mine = rows.filter(mineToday);
  if (mine.length) {
    const anyEarlier = mine.some((r) => r.next.due < TODAY);
    const who = mine.length === 1
      ? `${mine[0].c.patient.lastName} – ${shortStep(mine[0].next.text)}`
      : mine.map((r) => r.c.patient.lastName).join(', ');
    parts.push(
      <><b>{mine.length}</b> {pluralWord(mine.length, 'úloha', 'úlohy', 'úloh')} na mne s termínom {anyEarlier ? 'dnes alebo skôr' : 'dnes'} ({who})</>,
    );
  } else {
    parts.push(<>na mne dnes nič s termínom</>);
  }

  const chase = rows.flatMap((r) => {
    const steps = overdueSteps(r).map((s) => `${r.c.patient.lastName}: ${shortStep(s.title)} mešká ${plural(daysBetween(s.due, TODAY), 'deň', 'dni', 'dní')}`);
    if (!steps.length && r.open && !r.next.mine && r.next.due < TODAY) {
      steps.push(`${r.c.patient.lastName}: ${shortStep(r.next.text)} mešká ${plural(daysBetween(r.next.due, TODAY), 'deň', 'dni', 'dní')}`);
    }
    return steps;
  });
  parts.push(chase.length ? <>urgovať <b>{chase.length}</b> ({chase.join('; ')})</> : <>urgovať: nikoho</>);

  for (const r of rows.filter((x) => x.open && mdtThisWeek(x.c))) {
    const issues = handoverIssues(r);
    parts.push(issues.length
      ? <>konzílium <b>{fmtDate(r.c.mdtDate)}</b> má neúplný podklad ({r.c.patient.lastName}: {issues.join(' · ')})</>
      : <>konzílium <b>{fmtDate(r.c.mdtDate)}</b> má kompletný podklad ({r.c.patient.lastName})</>);
  }

  const fresh = rows.filter((r) => r.status === 'new').length;
  if (fresh > 0) parts.push(<><b>{fresh}</b> {pluralWord(fresh, 'nová žiadanka', 'nové žiadanky', 'nových žiadaniek')}</>);

  return parts;
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
  const brief = useMemo(() => briefing(rows), [rows]);
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
          <Button icon="inbox" onClick={() => go({ page: 'intake' })} title="Takto praktik posiela žiadanku do KOC (bez účtu)">Pohľad praktika: nová žiadanka</Button>
        </header>

        <div className="brief" aria-label="Ranný prehľad">
          <span className="brief__icon"><Icon name="sun" size={18} /></span>
          <div>
            <div className="kicker">Ranný prehľad</div>
            <p className="brief__text">
              Dnes:{' '}
              {brief.map((p, i) => (
                <span key={i}>{i > 0 && <span className="brief__sep">·</span>}{p}</span>
              ))}
            </p>
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
          {otherFull.length > 0 && <> {otherFull.map((c) => `${c.patient.firstName} ${c.patient.lastName}`).join(', ')} = ďalší fiktívny pacient z kontrolnej sady.</>}
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
        <div className="clock__bar">
          <div className={`clock__fill ${!open ? 'clock__fill--done' : day > c.clockTargetDays ? 'clock__fill--late' : ''}`} style={{ width: `${!open ? 100 : pct}%` }} />
        </div>
        <div className="clock__text">
          <span>{!open ? `uzavreté za ${plural(Math.max(0, daysBetween(c.receivedAt, r.s.closedAt ?? TODAY)), 'deň', 'dni', 'dní')}` : <>deň <b>{day}</b> z {c.clockTargetDays}</>}</span>
          <Tooltip text={CLOCK_HINT + (pancreas ? '' : CLOCK_HINT_OTHER)}>
            <span className="clock__hint"><Icon name="info" size={14} /> {pancreas ? 'cieľ' : 'cieľ · ukážka'}</span>
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
function Balance({ rows }: { rows: Row[] }) {
  const full = rows.find((r) => r.c.id === FULL_CASE.id) ?? rows[0];
  const onMe = rows.filter(mineToday).length;
  const onOthers = rows.filter((r) => r.open && !r.next.mine).length;
  const closedThisWeek = rows.filter((r) => !r.open && (r.s.closedAt ?? '') >= WEEK_START).length;
  const days = full ? billableDays(full) : 0;
  const clockDay = full ? Math.max(0, daysBetween(full.c.receivedAt, TODAY)) : 0;

  return (
    <aside className="side" aria-label="Moja bilancia">
      <div className="kicker side__title">Moja bilancia</div>
      <Card className="wk">
        {full && (
          <Stat pastel={2} value={days}
            label={`${pluralWord(days, 'deň so zásahom', 'dni so zásahom', 'dní so zásahom')} · ${full.c.patient.lastName} · podklad pre výkon 51887`}
            hint={`${(days * FEE_51887_CZK).toLocaleString('sk-SK')} Kč, ak poisťovňa výkon uzná · deň ${clockDay} z ${full.c.clockTargetDays} cesty`} />
        )}
        <div className="wk__row"><span>Na mne dnes</span><strong>{onMe}</strong></div>
        <div className="wk__row"><span>Čaká na iných</span><strong>{onOthers}</strong></div>
        <div className="wk__row"><span>Prípady uzavreté tento týždeň (záver doručený)</span><strong>{closedThisWeek}</strong></div>
      </Card>
      <p className="side__note">Len administratívne kroky z dát prípadov, nikdy zdravotné údaje.</p>

      <EvalCard rows={EVAL_ROWS} variant="compact" />
      <p className="side__note">Strojové vyťaženie správ porovnané s ručne overenou kontrolnou sadou (npm run eval).</p>
    </aside>
  );
}
