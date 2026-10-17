// The case as it is now: what the reports say plus what the coordinator found out (state/caseStore). An item she filled
// in or checked counts as ready and its to-do leaves the journey, the counts and the bell. Every tab reads this.
import { isSettled } from '../../state/caseStore';
import type { CaseState } from '../../state/caseStore';
import type { CaseData, Field } from './types';

const time = (at: string) => at.slice(11);

function liveField(f: Field, st: CaseState): Field {
  const added = st.added[f.key];
  if (added) {
    const value = f.key === 'patientContact' && f.value ? f.value.replace(/e-mail neuveden/, `e-mail ${added.value}`) : added.value;
    return { ...f, value, status: 'doplněno', note: `Doplněno: ${added.source}, ${time(added.at)}` };
  }
  const res = st.resolved[f.key];
  if (res) return { ...f, status: 'ověřeno', note: `Ověřeno${res.with ? ` – ${res.with}` : ''}: ${res.note} (${time(res.at)})` };
  return f;
}

export function liveCase(data: CaseData, st: CaseState): CaseData {
  const open = (key: string) => !isSettled(st, key);
  const steps = data.steps.map((s) => {
    if (!s.todo?.length) return s;
    const todo = s.todo.filter((t) => open(t.field));
    return todo.length ? { ...s, todo } : { ...s, todo, summary: 'Vše doplněno a ověřeno.' };
  });
  const todo = steps.flatMap((s) => s.todo ?? []);
  const fixed = data.fields.filter((f) => f.todo && !open(f.key)).length;
  return {
    ...data,
    steps,
    fields: data.fields.map((f) => (open(f.key) ? f : liveField(f, st))),
    stats: {
      ...data.stats,
      ready: data.stats.ready + fixed,
      missing: todo.filter((t) => t.kind === 'chybí').length,
      conflicts: todo.filter((t) => t.kind === 'rozpor').length,
    },
  };
}
