// Deterministic times for actions done during the demo. The real clock would show 11:xx at the rehearsal
// and would not belong to the demo day (DEMO_TODAY = 19. 10. 2026). Each demo day has its own sequence:
// the first action is at 09:05 – or 2–4 minutes after the last entry already in the record for that day –
// and every further action comes 2–4 minutes later. Module-level, like the case session store.
import type { ISODate, LogEntry } from '../../types';

const START_MIN = 9 * 60 + 5;              // 09:05
const STEPS_MIN = [3, 2, 4, 3, 2, 4, 3];   // minutes between two actions (fixed pattern, never random)
const lastByDay = new Map<ISODate, { min: number; n: number }>();

function toMin(t?: string): number | undefined {
  const m = t?.match(/^(\d{1,2}):(\d{2})$/);
  return m ? Number(m[1]) * 60 + Number(m[2]) : undefined;
}
function fmtMin(min: number): string {
  const m = ((min % (24 * 60)) + 24 * 60) % (24 * 60);
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

/** „Začať demo odznova“: the next action of every day starts again at its first slot. */
export function resetDemoClock(): void {
  lastByDay.clear();
}

/** Latest time already in the record on `date` (fixed entries without a time do not count). */
export function lastTimeOn(log: LogEntry[], date: ISODate): string | undefined {
  const times = log.filter((e) => e.date === date && e.time).map((e) => e.time as string).sort();
  return times[times.length - 1];
}

/** Next demo time on `date`: later than the previous demo action that day and later than `notBefore` (HH:MM). */
export function nextDemoTime(date: ISODate, notBefore?: string): string {
  const prev = lastByDay.get(date);
  const n = prev ? prev.n + 1 : 0;
  const step = STEPS_MIN[n % STEPS_MIN.length];
  let min = prev ? prev.min + step : START_MIN;
  const floor = toMin(notBefore);
  if (floor !== undefined && min <= floor) min = floor + step;
  lastByDay.set(date, { min, n });
  return fmtMin(min);
}
