// Fronta prípadov: greeting + ranný prehľad (one sentence derived from CASES), life filters, patient cards
// sorted ONLY by deadline (never by health data), and a discreet gamification panel on the right.
import { useMemo, useState, type ReactNode } from 'react';
import { CASES } from '../data/cases';
import { DEMO_TODAY, type Case, type ISODate } from '../types';
import { useNav } from '../nav';
import {
  Avatar, Button, Card, CASE_STATUS_LABEL, CASE_STATUS_TONE, Icon, Pill, Ring, Stat, Tooltip,
  addDays, daysBetween, fmtDate, fmtDateLong, fmtDue, parseISO, plural, pluralWord,
} from '../components/ui';
import { COORDINATOR } from '../components/Shell';
import './Queue.css';

const TODAY: ISODate = DEMO_TODAY;

/** Demo values for the gamification panel. Marked "ukážka" in the UI; counted from administrative
 *  steps only (closed loops, complete handovers), never from health data. */
const DEMO_GAMIFICATION = {
  doneToday: 3, goalToday: 5, loopsClosedThisWeek: 6, completeOnTimeStreak: 4, avgDaysToComplete: 5.2,
};

const CLOCK_HINT =
  'Hodiny cesty: dni od prijatia žiadanky oproti cieľovej lehote. Cieľ 33 dní = dánske lehoty pre pankreas ' +
  '(6 dní do prvej návštevy + 27 dní do rozhodnutia). Zahraničný vzor, ČR lehoty nemá.';

type FilterId = 'all' | 'mine' | 'others' | 'late' | 'mdtWeek';
const FILTERS: { id: FilterId; label: string }[] = [
  { id: 'all', label: 'Všetky' },
  { id: 'mine', label: 'Čaká na mňa' },
  { id: 'others', label: 'Čaká na iných' },
  { id: 'late', label: 'Mešká' },
  { id: 'mdtWeek', label: 'Konzílium tento týždeň' },
];

/* ---------------------------------------------------------------------------
   Derived helpers: purely administrative (deadlines, owners), no health data. */
function isOpen(c: Case): boolean {
  return c.status !== 'closed';
}
function overdueSteps(c: Case) {
  return isOpen(c) ? c.steps.filter((s) => s.state !== 'delivered' && s.due < TODAY) : [];
}
/** Days the case is late: the worst of the next step and any open step past its date. */
function lateDays(c: Case): number {
  if (!isOpen(c)) return 0;
  const dues = [c.nextStep.due, ...overdueSteps(c).map((s) => s.due)];
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
function matches(c: Case, f: FilterId): boolean {
  switch (f) {
    case 'all': return true;
    case 'mine': return isOpen(c) && c.nextStep.mine;
    case 'others': return isOpen(c) && !c.nextStep.mine;
    case 'late': return lateDays(c) > 0;
    case 'mdtWeek': return mdtThisWeek(c);
  }
}
/** "Výkonnostný stav (ECOG)" → "ECOG"; "Telefón pacientky" → "telefón pacientky". */
function shortField(label: string): string {
  const m = label.match(/\(([^)]+)\)/);
  if (m) return m[1];
  return /^[A-ZÁ-Ž][a-zá-ž]/.test(label) ? label.charAt(0).toLowerCase() + label.slice(1) : label;
}

/** One administrative sentence for the morning: what to chase, which MDT lacks data, how many new referrals. */
function briefing(cases: Case[]): ReactNode[] {
  const parts: ReactNode[] = [];

  const toChase = cases.reduce((n, c) => n + Math.max(overdueSteps(c).length, lateDays(c) > 0 ? 1 : 0), 0);
  parts.push(toChase > 0 ? <>urgovať <b>{toChase}</b></> : <>nič neurguje</>);

  const mdt = cases.filter((c) => isOpen(c) && mdtThisWeek(c));
  const incomplete = mdt
    .map((c) => ({ c, missing: c.fields.filter((f) => f.status === 'missing') }))
    .filter((x) => x.missing.length > 0);
  for (const { c, missing } of incomplete) {
    parts.push(
      <>konzílium <b>{fmtDate(c.mdtDate)}</b> má neúplný podklad ({c.patient.lastName}: chýba {missing.map((f) => shortField(f.label)).join(', ')})</>,
    );
  }
  if (mdt.length > 0 && incomplete.length === 0) parts.push(<>konzílium {fmtDate(mdt[0].mdtDate)} má kompletný podklad</>);

  const fresh = cases.filter((c) => c.status === 'new').length;
  if (fresh > 0) parts.push(<><b>{fresh}</b> {pluralWord(fresh, 'nová žiadanka', 'nové žiadanky', 'nových žiadaniek')}</>);

  return parts;
}

/* ---------------------------------------------------------------- Page */
export default function Queue() {
  const { go } = useNav();
  const [filter, setFilter] = useState<FilterId>('all');

  const counts = useMemo(() => Object.fromEntries(FILTERS.map((f) => [f.id, CASES.filter((c) => matches(c, f.id)).length])) as Record<FilterId, number>, []);
  // Order: open cases by deadline of the next step, then by MDT date; closed cases last. Never by health data.
  const visible = useMemo(
    () => CASES.filter((c) => matches(c, filter)).sort(
      (a, b) => Number(!isOpen(a)) - Number(!isOpen(b))
        || a.nextStep.due.localeCompare(b.nextStep.due)
        || (a.mdtDate ?? '9999').localeCompare(b.mdtDate ?? '9999'),
    ),
    [filter],
  );
  const brief = useMemo(() => briefing(CASES), []);

  return (
    <div className="queue">
      <section className="queue__main">
        <header className="queue__head">
          <div>
            <h1>Dobré ráno, {COORDINATOR.name}.</h1>
            <div className="queue__date">{fmtDateLong(TODAY)}</div>
          </div>
          <Button icon="plus" onClick={() => go({ page: 'intake' })}>Nová žiadanka</Button>
        </header>

        <div className="brief" aria-label="Ranný prehľad">
          <span className="brief__icon"><Icon name="sun" size={18} /></span>
          <div>
            <div className="brief__kicker">Ranný prehľad</div>
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
          <Card className="empty">V tomto pohľade nie je žiadny prípad.</Card>
        ) : (
          <div className="cards">
            {visible.map((c) => <CaseCard key={c.id} c={c} onOpen={() => go({ page: 'case', caseId: c.id })} />)}
          </div>
        )}
        <p className="queue__note">Poradie len podľa termínov, nikdy podľa zdravotných údajov.</p>
      </section>

      <Gamification />
    </div>
  );
}

/* ------------------------------------------------------------ Case card */
function CaseCard({ c, onOpen }: { c: Case; onOpen: () => void }) {
  const name = `${c.patient.firstName} ${c.patient.lastName}`;
  const late = lateDays(c);
  const day = Math.max(0, daysBetween(c.receivedAt, TODAY));
  const closed = !isOpen(c);
  const pct = Math.min(100, Math.round((day / Math.max(1, c.clockTargetDays)) * 100));

  return (
    <Card className="pcard" onClick={onOpen} ariaLabel={`Otvoriť prípad ${name}`}>
      <div className="pcard__top">
        <Pill tone={CASE_STATUS_TONE[c.status]} size="sm" dot>{CASE_STATUS_LABEL[c.status]}</Pill>
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
        <Icon name="arrow-right" size={14} />
        <span title={c.nextStep.text}>{c.nextStep.text}</span>
      </div>

      <div className="clock">
        <div className="clock__bar">
          <div className={`clock__fill ${closed ? 'clock__fill--done' : day > c.clockTargetDays ? 'clock__fill--late' : ''}`} style={{ width: `${closed ? 100 : pct}%` }} />
        </div>
        <div className="clock__text">
          <span>{closed ? `uzavreté za ${plural(day, 'deň', 'dni', 'dní')}` : <>deň <b>{day}</b> z {c.clockTargetDays}</>}</span>
          <Tooltip text={CLOCK_HINT}><span className="clock__hint"><Icon name="info" size={14} /> cieľ</span></Tooltip>
        </div>
      </div>

      <div className="pcard__cols">
        <div>
          <div className="col__k">Konzílium</div>
          <div className="col__v">{fmtDate(c.mdtDate)}</div>
        </div>
        <div>
          <div className="col__k">Na ťahu</div>
          <div className={`col__v ${c.nextStep.mine ? 'col__v--mine' : ''}`} title={c.nextStep.owner}>
            {closed ? '–' : c.nextStep.mine ? 'ja' : c.nextStep.owner}
          </div>
        </div>
        <div>
          <div className="col__k">Termín</div>
          <div className={`col__v ${late > 0 ? 'col__v--late' : ''}`}>{closed ? '–' : fmtDue(c.nextStep.due, TODAY)}</div>
        </div>
      </div>
    </Card>
  );
}

/* ---------------------------------------------------------- Gamification */
function Gamification() {
  const g = DEMO_GAMIFICATION;
  const left = Math.max(0, g.goalToday - g.doneToday);
  return (
    <aside className="side" aria-label="Moja bilancia">
      <div className="side__title">Moja bilancia</div>

      <Card className="goal">
        <Ring value={g.doneToday} max={g.goalToday} size={88} stroke={9}>
          <span className="goal__num">{g.doneToday}<small>/{g.goalToday}</small></span>
        </Ring>
        <div className="goal__text">
          <div className="goal__row"><h3>Dnešný cieľ</h3><Pill size="sm">ukážka</Pill></div>
          <p>{left === 0 ? 'Všetky úlohy dňa sú hotové.' : `${plural(left, 'úloha ostáva', 'úlohy ostávajú', 'úloh ostáva')} do konca dňa.`}</p>
        </div>
      </Card>

      <Card className="wk">
        <div className="wk__head"><h3>Tento týždeň</h3><Pill size="sm">ukážka</Pill></div>
        <Stat pastel={2} value={g.loopsClosedThisWeek} label="slučiek uzavretých (žiadanka → podklad → záver doručený)" />
        <div className="wk__row">
          <span>Podklady kompletné načas v rade</span>
          <strong>{g.completeOnTimeStreak}</strong>
        </div>
        <div className="wk__row">
          <span>Priemer dní do kompletného podkladu</span>
          <strong>{g.avgDaysToComplete.toLocaleString('sk-SK')}</strong>
        </div>
      </Card>

      <p className="side__note">
        Počíta sa len z administratívnych krokov (uzavreté slučky, včasné podklady), nikdy zo zdravotných údajov.
      </p>
    </aside>
  );
}
