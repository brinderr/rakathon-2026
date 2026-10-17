// The case as it is now: what the reports say plus what the coordinator found out (state/caseStore). An item she filled
// in or checked counts as ready and its to-do leaves the journey, the counts and the bell. Every tab reads this.
import { isSettled, useCaseStates } from '../../state/caseStore';
import { useAllCases } from '../../state/patients';
import type { CaseState } from '../../state/caseStore';
import type { CaseData, Field } from './types';

const time = (at: string) => at.slice(11);
const dm = (day: string) => `${Number(day.slice(8))}. ${Number(day.slice(5, 7))}.`;

function liveField(f: Field, st: CaseState): Field {
  const added = st.added[f.key];
  if (added) {
    // a missing item gets the value; an incomplete one keeps what the reports say and gets the addition below it
    const value = !f.value ? added.value
      : f.key === 'patientContact' && /e-mail neuveden/.test(f.value) ? f.value.replace(/e-mail neuveden/, `e-mail ${added.value}`)
        : `${f.value}\n${added.value}`;
    return { ...f, value, status: 'doplněno', note: `Doplněno: ${added.source}, ${time(added.at)}` };
  }
  const res = st.resolved[f.key];
  if (res) return { ...f, status: 'ověřeno', note: `Ověřeno${res.with ? ` – ${res.with}` : ''}: ${res.note} (${time(res.at)})` };
  const w = st.waived?.[f.key];
  if (w) return { ...f, status: 'ponecháno', note: `Ponecháno bez ověření: ${w.reason} (${time(w.at)})` };
  return f;
}

export function liveCase(data: CaseData, st: CaseState): CaseData {
  const open = (key: string) => !isSettled(st, key);
  const confirmed = st.confirmed;
  const sent = st.conclusion?.sent;
  const steps = data.steps.map((s) => {
    // the GP has the conclusion of the MDT (delivery receipt): the journey is closed
    const c = st.conclusion;
    if (s.id === 'uzavrit' && sent && c?.delivered) {
      return {
        ...s, status: 'done' as const, date: c.delivered.slice(0, 10), short: dm(c.delivered.slice(0, 10)),
        title: `Závěr konzilia doručen – ${sent.to}`,
        summary: `Odesláno ${time(sent.at)} · doručeno ${time(c.delivered)}${c.read ? ` · přečteno ${time(c.read)}` : ' · zatím nepřečteno'}.`,
      };
    }
    // the doctor confirmed the podklad: that step is done, the conclusion for the GP is next
    if (confirmed && s.id === 'podklad') {
      const day = confirmed.at.slice(0, 10);
      return { ...s, status: 'done' as const, date: day, title: `Podklad pro konzilium potvrdil(a) ${confirmed.by}`, short: `${Number(day.slice(8))}. ${Number(day.slice(5, 7))}.`, todo: [] };
    }
    if (confirmed && s.id === 'uzavrit' && s.status === 'waiting') return { ...s, status: 'now' as const };
    if (!s.todo?.length) return s;
    const todo = s.todo.filter((t) => open(t.field));
    return todo.length ? { ...s, todo } : { ...s, todo, summary: 'Vše doplněno a ověřeno.' };
  });
  const todo = steps.flatMap((s) => s.todo ?? []);
  // filled in or checked counts as ready; an item left as it is does not
  const fixed = data.fields.filter((f) => f.todo && (st.added[f.key] || st.resolved[f.key])).length;
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

/** Every patient as the case is now (reports + what the coordinator did) – for the overview and the MDT sessions. */
export function useLiveCases(): { id: string; label: string; data: CaseData | null; state: CaseState }[] {
  const all = useAllCases();
  const stateOf = useCaseStates();
  return all.map((x) => { const state = stateOf(x.id); return { ...x, state, data: x.data ? liveCase(x.data, state) : null }; });
}
