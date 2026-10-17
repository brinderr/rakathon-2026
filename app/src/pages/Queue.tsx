// Fronta případů: pozdrav + ranní přehled (odvozený z CASES a z dema), filtry, karty pacientů seřazené
// JEN podle termínů (nikdy podle zdravotních údajů) a malý pravý panel „Dnes“ (jen administrativní počty,
// žádné peníze, žádná vymyšlená čísla).
import { useMemo, useState, type ReactNode } from 'react';
import { CASES } from '../data/cases';
import { DEMO_TODAY, type Case, type CaseStatus, type ISODate } from '../types';
import { useNav } from '../nav';
import { EMPTY_SESSION, isDecided, isPending, isResolved, useSessions, type CaseSession } from '../components/session';
import { useAllCaseSessions } from '../components/case/caseSession';
import { EMPTY_PROFILE, mergeSessions } from '../components/docs/useCaseSessionSafe';
import {
  Avatar, Button, Card, CASE_STATUS_LABEL, CASE_STATUS_TONE, Icon, Pill, Tooltip,
  addDays, daysBetween, fmtDate, fmtDateLong, fmtDue, parseISO, plural, pluralWord,
} from '../components/ui';
import { COORDINATOR } from '../components/Shell';
import './Queue.css';

const TODAY: ISODate = DEMO_TODAY;
const FULL_CASE: Case = CASES.find((c) => c.demo === 'full') ?? CASES[0];

type FilterId = 'all' | 'mine' | 'others' | 'late' | 'mdtWeek';
const FILTERS: { id: FilterId; label: string }[] = [
  { id: 'all', label: 'Všechny' },
  { id: 'mine', label: 'Čeká na mě' },
  { id: 'others', label: 'Čeká na jiné' },
  { id: 'late', label: 'Má zpoždění' },
  { id: 'mdtWeek', label: 'Konzilium tento týden' },
];

/* ---------------------------------------------------------------------------
   A case + what happened to it in this session (closed, ECOG answered, …). */
interface Row { c: Case; s: CaseSession; status: CaseStatus; open: boolean; next: Case['nextStep'] }

/** "Další krok" after this session's actions (same rule as the case screen): once the missing field named in the
 *  next step is requested, the request's addressee is on the move; once it is answered, the next open item follows. */
function effectiveNext(c: Case, s: CaseSession): Case['nextStep'] {
  const ns = c.nextStep;
  // the KOC doctor confirmed the handover: it is no longer "incomplete" – what is left goes to the MDT (QA R5 #3)
  if (s.mdtConfirmedAt && c.mdtDate) {
    const conflicts = c.fields.filter((f) => f.status === 'conflict' && !isDecided(s.overrides[f.key], TODAY)).length;
    return {
      text: `Podklad potvrdil ${s.mdtConfirmedBy ?? 'lékař KOC'}${conflicts ? ` · ${conflicts} ${pluralWord(conflicts, 'rozpor ponechán', 'rozpory ponechány', 'rozporů ponecháno')} konziliu` : ''}`,
      owner: 'konzilium', mine: false, due: c.mdtDate,
    };
  }
  if (c.status === 'new' && s.acceptedAt) {
    const rest = ns.text.replace(/^(?:Prevziať|Převzít) (?:žiadosť|žádost) praktika( a )?/i, '').trim();
    return { ...ns, text: rest ? rest.charAt(0).toUpperCase() + rest.slice(1) : 'Zařadit případ na konzilium' };
  }
  const ref = c.fields.find((f) => f.status === 'missing' && ns.text.toLowerCase().includes(f.label.toLowerCase()));
  if (!ref) return ns;
  const ov = s.overrides[ref.key];
  if (ov?.kind === 'pending') return { text: `Čekáme na odpověď: ${ref.label}`, owner: ov.to, due: ns.due, mine: false };
  if (!isResolved(ov, TODAY)) return ns;
  const proposed = c.fields.filter((f) => f.status === 'proposed' && s.overrides[f.key]?.kind !== 'confirmed').length;
  const conflicts = c.fields.filter((f) => f.status === 'conflict' && !isDecided(s.overrides[f.key], TODAY)).length;
  const missing = c.fields.filter((f) => f.status === 'missing' && !isResolved(s.overrides[f.key], TODAY)).length;
  const parts = [
    proposed ? `${proposed} ${pluralWord(proposed, 'návrh', 'návrhy', 'návrhů')}` : '',
    conflicts ? `${conflicts} ${pluralWord(conflicts, 'rozpor', 'rozpory', 'rozporů')}` : '',
    missing ? `${missing} ${pluralWord(missing, 'chybějící pole', 'chybějící pole', 'chybějících polí')}` : '',
  ].filter(Boolean);
  if (parts.length) {
    const list = parts.length > 1 ? `${parts.slice(0, -1).join(', ')} a ${parts[parts.length - 1]}` : parts[0];
    return { text: `Zkontrolovat ${list}${c.mdtDate ? ' před konziliem' : ''}`, owner: 'já (koordinátorka)', mine: true, due: c.mdtDate ? addDays(c.mdtDate, -1) : ns.due };
  }
  if (c.mdtDate) return { text: `Podklad je kompletní · konzilium ${fmtDate(c.mdtDate)}`, owner: 'konzilium', mine: false, due: c.mdtDate };
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
/** "Stav výkonnosti (ECOG)" → "ECOG"; "Telefon pacientky" → "telefon pacientky". */
function shortField(label: string): string {
  const m = label.match(/\(([^)]+)\)/);
  if (m) return m[1];
  return /^[A-ZÁ-Ž][a-zá-ž]/.test(label) ? label.charAt(0).toLowerCase() + label.slice(1) : label;
}
/** "Převzít žádost praktika a vyžádat CT…" → "převzít žádost praktika" (first clause, lower-case). */
function shortStep(text: string): string {
  const first = text.split(/\s+(?:a|do|na|pred|před|v)\s+|[,;:(]/)[0].trim();
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
  if (stillMissing.length) out.push(`chybí ${stillMissing.map((f) => shortField(f.label)).join(', ')}`);
  if (pending.length) out.push(`${pending.map((f) => shortField(f.label)).join(', ')} vyžádáno, čeká na odpověď`);
  if (conflicts) out.push(plural(conflicts, 'rozpor', 'rozpory', 'rozporů'));
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
    ? <><b>Na mně {mine.some((r) => r.next.due < TODAY) ? 'dnes nebo dříve' : 'dnes'}:</b> {list(mine, (r) => <>{who(r)} – {shortStep(r.next.text)}</>)}</>
    : <><b>Na mně dnes:</b> nic s termínem</>);

  const chase = rows.flatMap((r) => {
    const steps = overdueSteps(r).map((s) => ({ r, text: `${shortStep(s.title)} má zpoždění ${plural(daysBetween(s.due, TODAY), 'den', 'dny', 'dní')}` }));
    if (!steps.length && r.open && !r.next.mine && r.next.due < TODAY) {
      steps.push({ r, text: `${shortStep(r.next.text)} má zpoždění ${plural(daysBetween(r.next.due, TODAY), 'den', 'dny', 'dní')}` });
    }
    return steps;
  });
  lines.push(chase.length
    ? <><b>Urgovat:</b> {list(chase, (x) => <>{who(x.r)} – {x.text}</>, '; ')}</>
    : <><b>Urgovat:</b> nikoho</>);

  for (const r of rows.filter((x) => x.open && mdtThisWeek(x.c))) {
    const issues = handoverIssues(r);
    lines.push(r.s.mdtConfirmedAt
      ? <><b>Konzilium {fmtDate(r.c.mdtDate)}:</b> {who(r)} – podklad potvrdil {r.s.mdtConfirmedBy ?? 'lékař KOC'}{issues.length ? ` · ponecháno konziliu: ${issues.join(' · ')}` : ''}</>
      : issues.length
        ? <><b>Konzilium {fmtDate(r.c.mdtDate)}:</b> {who(r)} – neúplný podklad: {issues.join(' · ')}</>
        : <><b>Konzilium {fmtDate(r.c.mdtDate)}:</b> {who(r)} – podklad je kompletní</>);
  }

  const fresh = rows.filter((r) => r.status === 'new');
  if (fresh.length > 0) lines.push(<><b>{fresh.length === 1 ? 'Nová žádanka' : 'Nové žádanky'}:</b> {list(fresh, who)}</>);

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
          <Button variant="ghost" icon="inbox" onClick={() => go({ page: 'intake' })} title="Přepne do pohledu praktika: takto posílá žádanku do KOC (bez účtu)">Pohled praktika: nová žádanka</Button>
        </header>

        <div className="brief" aria-label="Ranní přehled">
          <span className="brief__icon"><Icon name="sun" size={18} /></span>
          <div>
            <div className="kicker">Ranní přehled</div>
            <ul className="brief__list">
              {brief.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </div>
        </div>

        <div className="filters" role="group" aria-label="Filtry">
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
            <div className="empty__t">Tady je prázdno</div>
            <div className="empty__s">{filter === 'late' ? 'Nic nemá zpoždění.' : 'V tomto pohledu není žádný případ.'}</div>
            <Button variant="ghost" size="sm" onClick={() => setFilter('all')}>Zobrazit všechny</Button>
          </Card>
        ) : (
          <div className="cards">
            {visible.map((r) => <CaseCard key={r.c.id} r={r} onOpen={() => go({ page: 'case', caseId: r.c.id })} />)}
          </div>
        )}
        <p className="queue__note">
          {FULL_CASE.patient.firstName} {FULL_CASE.patient.lastName} = případ ze zadání VZP.
          {otherFull.length > 0 && <> {otherFull.map((c) => `${c.patient.firstName} ${c.patient.lastName}`).join(', ')} = druhý fiktivní pacient (strojové vytěžení, každý údaj potvrdí člověk).</>}
          {lightCount > 0 && <> {lightCount === 1 ? 'Další případ je ilustrační' : `Další ${lightCount} případy jsou ilustrační`} (štítek „ukázka“).</>}
          {' '}Pořadí jen podle termínů, nikdy podle zdravotních údajů.
        </p>
      </section>

      <TodayPanel rows={rows} />
    </div>
  );
}

/* ------------------------------------------------------------ Case card */
function CaseCard({ r, onOpen }: { r: Row; onOpen: () => void }) {
  const { c, status, open } = r;
  const name = `${c.patient.firstName} ${c.patient.lastName}`;
  const late = lateDays(r);
  const day = Math.max(0, daysBetween(c.receivedAt, TODAY));

  return (
    <Card className="pcard" onClick={onOpen} ariaLabel={`Otevřít případ ${name}`}>
      <div className="pcard__top">
        <span className="pcard__tags">
          <Pill tone={CASE_STATUS_TONE[status]} size="sm" dot>{CASE_STATUS_LABEL[status]}</Pill>
          {c.demo === 'light' && <Pill size="sm" className="pcard__demo">ukázka</Pill>}
        </span>
        {late > 0 && <Pill tone="coral" size="sm">zpoždění {plural(late, 'den', 'dny', 'dní')}</Pill>}
      </div>

      <div className="pcard__who">
        <Avatar name={name} size={56} ring />
        <div>
          <div className="pcard__name">{name}</div>
          <div className="pcard__dx">{c.patient.age} let · {c.diagnosisShort}</div>
        </div>
      </div>

      <div className="pcard__next">
        <Icon name={open ? 'arrow-right' : 'check'} size={14} />
        <span>{open ? r.next.text : `Případ uzavřen ${fmtDate(r.s.closedAt)} · závěr doručen`}</span>
      </div>

      {/* days since the referral arrived – a plain count, no target and no foreign benchmark */}
      <div className="clock">
        <div className={`clock__bar ${open ? 'clock__bar--none' : ''}`}>
          {!open && <div className="clock__fill clock__fill--done" style={{ width: '100%' }} />}
        </div>
        <div className="clock__text">
          <span>{!open
            ? `uzavřeno za ${plural(Math.max(0, daysBetween(c.receivedAt, r.s.closedAt ?? TODAY)), 'den', 'dny', 'dní')}`
            : <>den <b>{day}</b> od přijetí žádosti</>}</span>
          <Tooltip text={`Žádost praktika přijata ${fmtDate(c.receivedAt, true)}. Počítá se každý kalendářní den od přijetí.`}>
            <span className="clock__hint"><Icon name="info" size={14} /> od {fmtDate(c.receivedAt)}</span>
          </Tooltip>
        </div>
      </div>

      <div className="pcard__cols">
        <div>
          <div className="col__k">Konzilium</div>
          <div className="col__v">{fmtDate(c.mdtDate)}</div>
        </div>
        <div>
          <div className="col__k">Na tahu</div>
          <div className={`col__v ${open && r.next.mine ? 'col__v--mine' : ''}`} title={r.next.owner}>
            {!open ? '–' : r.next.mine ? 'já' : r.next.owner}
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

/* ------------------------------------------------- Today (from data) */
/** Small administrative panel derived only from CASES + this session: who is on the move, nothing about money. */
function TodayPanel({ rows }: { rows: Row[] }) {
  const onMe = rows.filter(mineToday).length;
  const onOthers = rows.filter((r) => r.open && !r.next.mine).length;
  const mdtRows = rows.filter((r) => mdtThisWeek(r.c));
  const complete = mdtRows.filter(handoverDone).length;

  return (
    <aside className="side" aria-label="Dnes">
      <div className="kicker side__title">Dnes</div>
      <Card className="wk">
        <div className="wk__row"><span>Na mně dnes</span><strong>{onMe}</strong></div>
        <div className="wk__row"><span>Čeká na jiné</span><strong>{onOthers}</strong></div>
        <div className="wk__row"><span>Konzilia tento týden<br /><small className="wk__sub">podklad kompletní {complete} z {mdtRows.length}</small></span><strong>{mdtRows.length}</strong></div>
      </Card>
      <p className="side__note">Jen administrativní kroky z dat případů, nikdy zdravotní údaje. Dny se zásahem jsou v záznamu každého případu.</p>
    </aside>
  );
}
