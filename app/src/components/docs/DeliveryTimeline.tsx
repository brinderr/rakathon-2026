import { IconCheck, IconClock } from './DocIcons';
import './docs.css';

export interface DeliveryStep { label: string; detail?: string; time?: string }

interface Props {
  steps: DeliveryStep[];
  /** index of the last reached step; -1 = nothing yet; steps.length-1 = all done */
  reached: number;
  /** true while the next step is "in flight" (pulsing dot) */
  inFlight?: boolean;
}

/** Horizontal delivery receipt: odoslané → doručené → potvrdené. Clearly simulated by the caller. */
export function DeliveryTimeline({ steps, reached, inFlight }: Props) {
  return (
    <ol className="dtl" aria-label="Doručenka">
      {steps.map((s, i) => {
        const done = i <= reached;
        const now = !done && inFlight && i === reached + 1;
        const cls = done ? 'dtl__step--done' : now ? 'dtl__step--now' : 'dtl__step--todo';
        return (
          <li key={s.label} className={`dtl__step ${cls}`}>
            {i < steps.length - 1 && <span className={`dtl__line ${i < reached ? 'dtl__line--on' : ''}`} />}
            <span className="dtl__dot">{done ? <IconCheck size={15} /> : <IconClock size={14} />}</span>
            <div className="dtl__label">{s.label}</div>
            {s.detail && <div className="dtl__detail">{s.detail}</div>}
            {done && s.time && <div className="dtl__time">{s.time}</div>}
          </li>
        );
      })}
    </ol>
  );
}
