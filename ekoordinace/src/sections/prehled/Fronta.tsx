// Section "Přehled" (owner: Matej) – the coordinator's start of the day across all patients: what is on her now and
// until when, what waits for someone else (requests, the doctor's confirmation, the GP reading the conclusion), the next
// MDT and today's new reports. Only what she acts on – each line opens the patient where the work is.
import { lastMessage } from '../../state/messages';
import type { CaseState } from '../../state/caseStore';
import { Icon } from '../../ui/Icon';
import { czDate, daysBetween, inDays, nb } from '../../ui/format';
import { useLiveCases } from '../pacient/live';
import type { CaseData } from '../pacient/types';
import './fronta.css';

const OPEN = ['chybí', 'neúplné', 'rozpor'];
const WEEKDAY = ['neděle', 'pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota'];
const dayBefore = (iso: string) => { const d = new Date(`${iso}T12:00:00`); d.setDate(d.getDate() - 1); return d.toISOString().slice(0, 10); };
const plural = (n: number, one: string, few: string, many: string) => `${n} ${n === 1 ? one : n < 5 ? few : many}`;

interface Item { id: string; name: string; initials: string; what: string; detail?: string; due?: string; href: string; today: string }

/** What a case needs now: from the coordinator ("mine") or from someone else ("theirs"). */
export function itemsOf(id: string, data: CaseData, st: CaseState): { mine: Item[]; theirs: Item[] } {
  const p = data.patient;
  const base = { id, name: p.name, initials: p.initials, today: data.today };
  const mine: Item[] = [];
  const theirs: Item[] = [];
  const open = data.fields.filter((f) => f.todo && OPEN.includes(f.status));
  const empty = Object.keys(data.documents).length === 0;
  const mdt = data.mdtDate;
  const past = mdt && mdt < data.today;
  const c = st.conclusion;
  if (empty) {
    mine.push({ ...base, what: 'Přidat zprávy', href: `#/pacienti/${id}` });
    return { mine, theirs };
  }
  if (!mdt) mine.push({ ...base, what: 'Stanovit termín konzilia', detail: 'termín se zadává v hlavičce pacienta', href: `#/pacienti/${id}` });
  if (!st.confirmed && open.length) {
    mine.push({
      ...base, what: `Vyřešit ${plural(open.length, 'bod', 'body', 'bodů')} před konziliem`,
      detail: open.slice(0, 3).map((f) => f.todo!.title).join(' · ') + (open.length > 3 ? ' …' : ''),
      ...(mdt ? { due: dayBefore(mdt) } : {}), href: `#/pacienti/${id}/podklad`,
    });
    // requests she sent that are not answered yet
    for (const f of open) {
      const m = lastMessage(st, f.key);
      if (m && m.kind === 'vyzadano') theirs.push({ ...base, what: `${m.to} – ${f.todo!.title}`, detail: `vyžádáno ${czDate(m.at.slice(0, 10))} ${m.at.slice(11)} · čeká na odpověď`, href: `#/pacienti/${id}/udaje/${f.key}` });
    }
  }
  if (!st.confirmed && !open.length && mdt) {
    theirs.push({ ...base, what: 'Lékař – potvrzení podkladu pro konzilium', detail: 'vše vyřešeno, čeká na potvrzení', due: dayBefore(mdt), href: `#/pacienti/${id}/podklad` });
  }
  if (past && !c?.sent) mine.push({ ...base, what: 'Odeslat závěr konzilia praktikovi', detail: `konzilium proběhlo ${czDate(mdt)}`, href: `#/pacienti/${id}/zaver` });
  if (c?.sent && !c.read) {
    theirs.push({ ...base, what: `${p.gp.name} – přečíst závěr konzilia`, detail: `${c.delivered ? 'doručeno' : 'odesláno'} ${c.sent.at.slice(11)} · zatím nepřečteno`, href: `#/pacienti/${id}/zaver` });
  }
  return { mine, theirs };
}

function Due({ due, today }: { due?: string; today: string }) {
  if (!due) return null;
  const n = daysBetween(today, due);
  const cls = n < 0 ? 'miss' : n <= 1 ? 'conf' : '';
  return <span className={`chip ${cls}`}>{n < 0 ? 'po termínu' : `do ${czDate(due)} · ${inDays(n)}`}</span>;
}

function List({ items, empty }: { items: Item[]; empty: string }) {
  if (!items.length) return <p className="muted ov-empty">{empty}</p>;
  return (
    <ul className="ov-list">
      {items.map((x, i) => (
        <li key={`${x.id}${x.what}${i}`}>
          <a href={x.href}>
            <span className="avatar">{x.initials}</span>
            <span className="ov-main">
              <b>{nb(x.what)}</b>
              <small>{x.name}{x.detail && <> · {nb(x.detail)}</>}</small>
            </span>
            <Due due={x.due} today={x.today} />
            <Icon name="right" size={16} />
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Fronta() {
  const cases = useLiveCases();
  const ready = cases.filter((x): x is typeof x & { data: CaseData } => Boolean(x.data));
  const busy = cases.length - ready.length;
  const today = ready[0]?.data.today ?? '';
  const all = ready.map((x) => itemsOf(x.id, x.data, x.state));
  // most urgent first: a deadline before none, earlier before later
  const byDue = (a: Item, b: Item) => (a.due ?? '9999').localeCompare(b.due ?? '9999');
  const mine = all.flatMap((x) => x.mine).sort(byDue);
  const theirs = all.flatMap((x) => x.theirs).sort(byDue);
  // the next MDT and how ready its podklady are
  const upcoming = ready.filter((x) => x.data.mdtDate && x.data.mdtDate >= today).sort((a, b) => a.data.mdtDate.localeCompare(b.data.mdtDate));
  const next = upcoming[0]?.data.mdtDate;
  const atNext = upcoming.filter((x) => x.data.mdtDate === next);
  const confirmedAtNext = atNext.filter((x) => x.state.confirmed).length;
  const news = ready.flatMap((x) => x.data.news.map((n) => ({ ...n, pid: x.id, name: x.data.patient.name })));
  const weekday = today ? WEEKDAY[new Date(`${today}T12:00:00`).getDay()] : '';

  return (
    <div className="overview">
      <div className="list-head">
        <div>
          <h1>Přehled</h1>
          {today && <p className="muted">{weekday} {nb(czDate(today))}{busy > 0 && ` · zpracovávám zprávy (${busy})`}</p>}
        </div>
      </div>

      <section className="card stats three" aria-label="Souhrn">
        <a className="stat stat-link" href="#ov-mine">
          <span className="stat-icon red"><Icon name="alert" /></span>
          <span><small>Na tahu jste vy</small><b>{mine.length}</b><em>{mine.length ? `u ${plural(new Set(mine.map((x) => x.id)).size, 'pacienta', 'pacientů', 'pacientů')}` : 'nic nečeká'}</em></span>
        </a>
        <a className="stat stat-link" href="#ov-theirs">
          <span className="stat-icon"><Icon name="clock" /></span>
          <span><small>Čeká na ostatní</small><b>{theirs.length}</b><em>{theirs.length ? 'odpovědi, potvrzení, přečtení' : 'nic'}</em></span>
        </a>
        <a className="stat stat-link" href="#/konzilia">
          <span className="stat-icon"><Icon name="calendar" /></span>
          <span>
            <small>Nejbližší konzilium</small>
            <b>{next ? nb(czDate(next)) : '—'}</b>
            <em>{next ? `${inDays(daysBetween(today, next))} · podklady ${confirmedAtNext} z ${atNext.length} potvrzeno` : 'žádné naplánované'}</em>
          </span>
        </a>
      </section>

      <section className="card ov-card" id="ov-mine" aria-label="Na tahu jste vy">
        <h2>Na tahu jste vy</h2>
        <List items={mine} empty="Nic nečeká – všechny podklady jsou vyřešené." />
      </section>

      <section className="card ov-card" id="ov-theirs" aria-label="Čeká na ostatní">
        <h2>Čeká na ostatní</h2>
        <List items={theirs} empty="Na nikoho nečekáte." />
      </section>

      {news.length > 0 && (
        <section className="card ov-card" aria-label="Dnes nové zprávy">
          <h2>Dnes nové zprávy</h2>
          <ul className="ov-list">
            {news.map((n) => (
              <li key={`${n.pid}${n.id}`}>
                <a href={`#/pacienti/${n.pid}`}>
                  <span className="stat-icon"><Icon name="file" size={18} /></span>
                  <span className="ov-main"><b>{n.what}</b><small>{n.name} · {n.dept}</small></span>
                  <Icon name="right" size={16} />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
