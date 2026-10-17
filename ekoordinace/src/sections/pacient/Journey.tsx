// The patient journey as a compact stepper: one small node per step (done = check), the step that is on now in red.
// Below it a panel for the selected step – by default the current one with its to-dos and whom to call; a done step
// shows the reports behind it.
import { useState } from 'react';
import type { KeyboardEvent, RefObject } from 'react';
import { Icon } from '../../ui/Icon';
import { czDate, daysBetween, inDays, nb, telHref } from '../../ui/format';
import type { DocRef, Step, Todo } from './types';

const STATUS_SR = { done: 'hotovo', now: 'teď na řadě', waiting: 'čeká' } as const;

function eyebrow(step: Step): string {
  if (step.status === 'now') return 'Teď na řadě';
  if (step.status === 'waiting') return 'Čeká';
  return step.date ? `Hotovo · ${czDate(step.date)}` : 'Hotovo';
}

function TodoItem({ t }: { t: Todo }) {
  const [open, setOpen] = useState(false);
  const miss = t.kind === 'chybí';
  const docIds = [...new Set(t.quotes.map((q) => q.docId))];
  return (
    <li className="todo-item">
      <span className={`todo-icon ${miss ? 'miss' : 'conf'}`} title={miss ? 'Chybí údaj' : 'Rozpor mezi údaji'}>
        <Icon name={miss ? 'fields' : 'alert'} size={16} />
      </span>
      <div className="todo-main">
        <p className="todo-title"><span className="sr">{miss ? 'Chybí: ' : 'Rozpor: '}</span>{nb(t.title)}</p>
        <p className="todo-why">{nb(t.why)}</p>
        {t.quotes.length > 0 && (
          <button type="button" className="link" aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? 'Skrýt citaci' : `Citace ze zprávy ${docIds.join(', ')}`}<Icon name={open ? 'up' : 'down'} size={14} />
          </button>
        )}
        {open && (
          <div className="quotes">
            {t.quotes.map((q) => (
              <blockquote className="quote" key={q.quote}>„{nb(q.quote)}“<cite>zpráva {q.docId}</cite></blockquote>
            ))}
          </div>
        )}
      </div>
      <div className="todo-who" aria-label="Koho kontaktovat">
        {t.contacts.map((c) => (
          <p className="who" key={`${c.role}-${c.name}`}>
            <small>{c.role}</small>
            <b>{c.name}</b>
            {c.phone && <a href={telHref(c.phone)}><Icon name="phone" size={14} />{c.phone}</a>}
            {c.note && <em>{c.note}</em>}
          </p>
        ))}
      </div>
    </li>
  );
}

function DocList({ docs }: { docs: DocRef[] }) {
  return (
    <ul className="docs">
      {docs.map((d) => (
        <li key={d.id}>
          <span className="mono">{czDate(d.date)}</span>
          <span className="doc-text">{d.what && <b>{d.what} · </b>}{d.title}<em>{d.place}</em></span>
          <span className="doc-id">{d.isNew && <span className="chip new">dnes</span>}<span className="mono">zpráva {d.id}</span></span>
        </li>
      ))}
    </ul>
  );
}

function StepPanel({ step, today }: { step: Step; today: string }) {
  return (
    <div className={`panel ${step.status}`} role="tabpanel" id="step-panel" aria-labelledby={`tab-${step.id}`}>
      <div className="panel-head">
        <div>
          <p className="eyebrow">{eyebrow(step)}</p>
          <h3>{nb(step.title)}</h3>
        </div>
        {step.status === 'now' && step.due && (
          <p className="panel-meta"><Icon name="clock" size={16} />Úkol pro vás · do {czDate(step.due)} ({inDays(daysBetween(today, step.due))})</p>
        )}
      </div>
      {step.summary && <p className="panel-summary">{nb(step.summary)}</p>}
      {step.todo && step.todo.length > 0 && <ol className="todo">{step.todo.map((t) => <TodoItem t={t} key={t.title} />)}</ol>}
      {step.docs && step.docs.length > 0 && <DocList docs={step.docs} />}
    </div>
  );
}

interface JourneyProps {
  steps: Step[];
  selected: string;
  onSelect: (id: string) => void;
  today: string;
  female: boolean;
  cardRef: RefObject<HTMLElement | null>;
}

export function Journey({ steps, selected, onSelect, today, female, cardRef }: JourneyProps) {
  const current = steps.find((s) => s.id === selected) ?? steps[0];

  // arrow keys move between the steps (tabs pattern)
  const onKey = (e: KeyboardEvent<HTMLOListElement>) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const i = steps.findIndex((s) => s.id === current.id);
    const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : steps.length - 1;
    const next = steps[(i + step) % steps.length];
    onSelect(next.id);
    document.getElementById(`tab-${next.id}`)?.focus();
    e.preventDefault();
  };

  return (
    <section className="card journey" ref={cardRef} tabIndex={-1} aria-labelledby="journey-title">
      <div className="card-head"><h2 id="journey-title">Cesta {female ? 'pacientky' : 'pacienta'}</h2></div>
      <ol className="stepper" role="tablist" aria-label="Kroky cesty" onKeyDown={onKey}>
        {steps.map((s, i) => {
          const isSel = s.id === current.id;
          return (
            <li key={s.id} className={`st ${s.status}${isSel ? ' sel' : ''}`} role="presentation">
              <button
                type="button" role="tab" id={`tab-${s.id}`} aria-selected={isSel} aria-controls="step-panel"
                tabIndex={isSel ? 0 : -1} onClick={() => onSelect(s.id)}
              >
                <span className="st-node">{s.status === 'done' ? <Icon name="check" size={16} /> : i + 1}</span>
                <span className="st-label">{s.label}</span>
                <span className="st-short">{nb(s.short)}<span className="sr"> · {STATUS_SR[s.status]}</span></span>
              </button>
            </li>
          );
        })}
      </ol>
      <StepPanel step={current} today={today} />
    </section>
  );
}
