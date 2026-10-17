// CORDIN – layout after the user's reference: sidebar, top bar, patient header with tabs, a row of key facts,
// the patient journey on the left and "what is needed now" on the right. Sharper corners and VZP colours.
// Step 1 of the rebuild: only the "Přehled" tab works; greyed items are filled in the next steps.
// Data: src/data/alena.json, computed from the fictional reports by the shared engine (npm run data).
import { useRef, useState } from 'react';
import data from './data/alena.json';
import { Icon } from './Icon';
import { Mark } from './Mark';

type Status = 'done' | 'now' | 'waiting';
interface DocRef { id: string; date: string; title: string; place: string; what?: string }
interface Todo { field: string; kind: string; title: string; detail: string; sources: string[] }
interface Step {
  id: string; title: string; status: Status; who: string; summary: string;
  date?: string; due?: string; sources?: string[]; docs?: DocRef[]; todo?: Todo[];
}

const STATUS: Record<Status, string> = { done: 'Hotovo', now: 'Teď', waiting: 'Čeká' };
const SOON = 'Připravujeme v dalším kroku';

const NBSP = '\u00a0';

function czDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d}.${NBSP}${m}.${NBSP}${y}`;
}

/** Keep Czech dates on one line ("21. 10. 2026" never breaks after "21."). */
function nb(text: string): string {
  return text.replace(/(\d{1,2})\. (\d{1,2})\. (\d{4})/g, `$1.${NBSP}$2.${NBSP}$3`).replace(/(\d{1,2})\. (\d{1,2})\.(?!\s?\d)/g, `$1.${NBSP}$2.`);
}

function daysBetween(a: string, b: string): number {
  return Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000);
}

function Sidebar() {
  return (
    <aside className="side">
      <div className="side-brand"><span className="side-mark"><Mark size={34} /></span><span>CORDIN</span></div>
      <nav className="side-nav" aria-label="Hlavní navigace">
        <span className="nav-item off" title={SOON}><Icon name="grid" />Přehled</span>
        <a className="nav-item on" href="#" aria-current="page"><Icon name="user" />Pacienti</a>
        <span className="nav-item off" title={SOON}><Icon name="calendar" />Konzilia</span>
      </nav>
      <div className="side-user">
        <span className="avatar">LD</span>
        <span className="side-user-text"><b>Bc. Lucie Dvořáková</b><small>Koordinátorka · KOC Nemocnice Lipová</small></span>
        <Icon name="up" size={18} />
      </div>
    </aside>
  );
}

function StepItem({ step, n, open, onToggle }: { step: Step; n: number; open: boolean; onToggle: () => void }) {
  const docs = step.docs ?? [];
  const head = (
    <>
      <span className="step-num">{step.status === 'done' ? <Icon name="check" size={16} /> : n}</span>
      <span className="step-body">
        <span className="step-title">{nb(step.title)}</span>
        <span className="step-summary">{nb(step.summary)}</span>
      </span>
      <span className={`chip ${step.status}`}>{STATUS[step.status]}</span>
    </>
  );
  return (
    <li className={`step ${step.status}`}>
      {docs.length > 0 ? (
        <button type="button" className="step-head" aria-expanded={open} onClick={onToggle}>{head}</button>
      ) : (
        <div className="step-head">{head}</div>
      )}
      {open && docs.length > 0 && (
        <ul className="step-docs">
          {docs.map((d) => (
            <li key={d.id}>
              <span className="mono">{czDate(d.date)}</span>
              <span className="doc-text">{d.what && <b>{d.what} · </b>}{d.title}<em>{d.place}</em></span>
              <span className="mono">zpráva {d.id}</span>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function NowCard({ step, n, total, cardRef }: { step: Step; n: number; total: number; cardRef: React.RefObject<HTMLElement | null> }) {
  const [open, setOpen] = useState<string | null>(step.todo?.[0]?.title ?? null);
  const angle = (n / total) * 360;
  return (
    <section className="card now-card" ref={cardRef} tabIndex={-1} aria-labelledby="now-title">
      <p className="eyebrow">Teď na řadě</p>
      <h2 id="now-title">{nb(step.title)}</h2>
      <p className="now-meta"><Icon name="clock" size={16} />Na tahu {step.who}{step.due && <> · do <b>{czDate(step.due)}</b></>}</p>
      <div className="ring" style={{ background: `conic-gradient(var(--red) ${angle}deg, var(--red-100) 0)` }} aria-label={`Krok ${n} ze ${total}`}>
        <span><span className="ring-num"><b>{n}</b>/{total}</span><small>krok</small></span>
      </div>
      <p className="now-summary">{nb(step.summary)}</p>
      <ul className="todo">
        {(step.todo ?? []).map((t) => {
          const isOpen = open === t.title;
          return (
            <li key={t.title}>
              <button type="button" className="todo-row" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : t.title)}>
                <span className={`todo-icon ${t.kind === 'chybí' ? 'miss' : 'conf'}`}><Icon name={t.kind === 'chybí' ? 'fields' : 'alert'} size={16} /></span>
                <span className="todo-title">{t.title}</span>
                <span className={`chip ${t.kind === 'chybí' ? 'miss' : 'conf'}`}>{t.kind === 'chybí' ? 'Chybí' : 'Rozpor'}</span>
              </button>
              {isOpen && (
                <div className="todo-detail">
                  <p>{nb(t.detail)}</p>
                  {t.sources.length > 0 && <span className="mono">zpráva {t.sources.join(', ')}</span>}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function App() {
  const steps = data.steps as Step[];
  const nowIndex = steps.findIndex((s) => s.status === 'now');
  const now = steps[nowIndex];
  const [open, setOpen] = useState<string | null>(null);
  const nowRef = useRef<HTMLElement | null>(null);
  const p = data.patient;
  const f = p.facts;
  const todoCount = now?.todo?.length ?? 0;
  const days = daysBetween(data.today, data.mdtDate);

  const goToNow = () => {
    nowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    nowRef.current?.focus({ preventScroll: true });
  };

  return (
    <div className="frame">
      <Sidebar />
      <div className="content">
        <header className="topbar">
          <label className="search" title={SOON}>
            <Icon name="search" size={18} />
            <input type="search" placeholder="Hledat pacienta nebo zprávu" disabled aria-label="Hledat" />
          </label>
          <div className="top-actions">
            <button type="button" className="icon-btn" disabled title={SOON} aria-label="Zprávy"><Icon name="mail" /></button>
            <button type="button" className="icon-btn" onClick={goToNow} aria-label={`Co je potřeba udělat (${todoCount})`}>
              <Icon name="bell" />{todoCount > 0 && <span className="badge">{todoCount}</span>}
            </button>
          </div>
        </header>

        <main className="page">
          <nav className="crumbs" aria-label="Drobečková navigace">
            <span>Pacienti</span><Icon name="right" size={14} /><span className="crumb-now">{p.name} (nar. {p.born})</span>
          </nav>

          <div className="patient-head">
            <span className="avatar big">{p.initials}</span>
            <div className="patient-id">
              <h1>{p.name}</h1>
              <p>{p.age} · ZP {p.insurer} · {p.suspicion}</p>
            </div>
            <div className="head-actions">
              <button type="button" className="round-btn" disabled title={`Zapsat telefonát – ${SOON.toLowerCase()}`} aria-label="Zapsat telefonát"><Icon name="phone" size={18} /></button>
              <button type="button" className="round-btn" disabled title={`Vyžádat zprávu – ${SOON.toLowerCase()}`} aria-label="Vyžádat zprávu"><Icon name="note" size={18} /></button>
              <button type="button" className="round-btn" disabled title={`Napsat praktikovi – ${SOON.toLowerCase()}`} aria-label="Napsat praktikovi"><Icon name="message" size={18} /></button>
            </div>
          </div>

          <div className="tabs-row">
            <div className="tabs" role="tablist" aria-label="Části případu">
              <button type="button" role="tab" aria-selected="true" className="tab on">Přehled</button>
              {['Zprávy', 'Údaje pro konzilium', 'Podklad', 'Závěr'].map((t) => (
                <button type="button" role="tab" aria-selected="false" className="tab" disabled title={SOON} key={t}>{t}</button>
              ))}
            </div>
          </div>

          <div className="asof">
            <span>Stav k: <b>{czDate(data.today)}</b></span>
            <button type="button" className="btn-outline" disabled title={SOON}><Icon name="download" size={18} />Stáhnout podklad</button>
          </div>

          <section className="card stats" aria-label="Hlavní údaje">
            <div className="stat"><span className="stat-icon"><Icon name="calendar" /></span><span><small>Konzilium</small><b>{czDate(data.mdtDate)}</b><em>za {days} dny</em></span></div>
            <div className="stat"><span className="stat-icon"><Icon name="file" /></span><span><small>Zprávy</small><b>{f.reports}</b><em>ze {f.places} pracovišť</em></span></div>
            <div className="stat"><span className="stat-icon"><Icon name="fields" /></span><span><small>Údaje pro konzilium</small><b>{f.found} z {f.fields}</b><em>u každého věta ze zprávy</em></span></div>
            <button type="button" className="stat stat-link" onClick={goToNow}><span className="stat-icon red"><Icon name="alert" /></span><span><small>K vyřešení</small><b>{todoCount}</b><em>{f.missing} chybí · {f.conflicts} rozpory</em></span></button>
          </section>

          <div className="grid">
            <section className="card journey" aria-labelledby="journey-title">
              <div className="card-head">
                <h2 id="journey-title">Cesta pacientky</h2>
                <span className="muted">6 kroků ze zadání VZP · teď krok {nowIndex + 1}</span>
              </div>
              <ol className="steps">
                {steps.map((s, i) => (
                  <StepItem key={s.id} step={s} n={i + 1} open={open === s.id} onToggle={() => setOpen(open === s.id ? null : s.id)} />
                ))}
              </ol>
            </section>
            {now && <NowCard step={now} n={nowIndex + 1} total={steps.length} cardRef={nowRef} />}
          </div>

          <footer className="foot">Prototyp pro výzvu VZP · Rakathon 2026 · fiktivní data · nejde o oficiální produkt VZP</footer>
        </main>
      </div>
    </div>
  );
}
