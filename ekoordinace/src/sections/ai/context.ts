// What the AI assistant knows: a plain-text snapshot of everything in the app – every patient with the 20 items for
// the MDT, open points, the journey, the podklad and the conclusion, the coordination record, and every report with
// its date, workplace, when it was added and its text. Pseudonymized before it leaves the browser (birth numbers,
// phones, e-mails, addresses, names → tokens); `restore` maps the tokens back in the answer. Owner: matej.
import { Pseudonymizer } from '../../../../app/src/ai/pseudo.ts';
import type { CaseState } from '../../state/caseStore';
import type { StoredPatient } from '../../state/patients';
import { czDate } from '../../ui/format';
import type { CaseData } from '../pacient/types';

const OPEN = ['chybí', 'neúplné', 'rozpor'];
const STEP = { done: 'hotovo', now: 'teď na řadě', waiting: 'čeká' } as const;
const at = (iso: string) => `${czDate(iso.slice(0, 10))}${iso.length > 10 ? ` ${iso.slice(11, 16)}` : ''}`;

export interface Snapshot { text: string; apply: (s: string) => string; restore: (s: string) => string }

export function snapshot(cases: { id: string; label: string; data: CaseData | null; state: CaseState }[], stored: StoredPatient[], today: string): Snapshot {
  const ps = new Pseudonymizer();
  const out: string[] = [
    `Simulovaný dnešní den: ${czDate(today)}. Koordinátorka: Bc. Lucie Dvořáková, KOC Nemocnice Lipová.`,
    `Pacientů v aplikaci: ${cases.length}.`,
  ];
  for (const c of cases) {
    const d = c.data;
    if (!d) { out.push('', `## Pacient ${c.label} – zprávy se ještě zpracovávají`); continue; }
    const p = d.patient;
    ps.addName(p.name, 'PACIENT');
    const last = p.name.split(/\s+/).pop() ?? '';
    if (last.length > 3) ps.addName(last, 'PACIENT');
    if (p.contactPerson) ps.addName(p.contactPerson.name, 'KONTAKT');
    const sp = stored.find((s) => s.id === c.id);
    const st = c.state;
    const c2 = st.conclusion;
    out.push('', `## Pacient ${p.name}`);
    out.push(sp ? `Přidán do aplikace ${czDate(sp.created)}.` : 'Demo pacientka ze zadání VZP.');
    out.push(`Narozen(a) ${p.born || '?'} (${p.age || '?'}), pojišťovna ${p.insurer.code || '?'} ${p.insurer.name}, diagnóza ${p.diagnosis.code} ${p.diagnosis.text}${p.diagnosis.source ? ` (${p.diagnosis.source})` : ''}.`);
    out.push(`Konzilium: ${d.mdtDate ? czDate(d.mdtDate) : 'termín nestanoven'}. Praktický lékař: ${p.gp.name}${p.gp.phone ? `, tel. ${p.gp.phone}` : ''}.`);
    out.push(`Cesta: ${d.steps.map((s) => `${s.label} – ${STEP[s.status]}${s.short ? ` (${s.short})` : ''}`).join('; ')}.`);
    out.push(`Podklad pro konzilium: ${st.confirmed ? `potvrdil(a) ${st.confirmed.by} ${at(st.confirmed.at)}` : 'zatím nepotvrzen'}. Závěr praktikovi: ${c2?.sent ? `odeslán ${at(c2.sent.at)}${c2.delivered ? `, doručen ${at(c2.delivered)}` : ''}${c2.read ? `, přečten ${at(c2.read)}` : ''}` : 'neodeslán'}.`);
    const open = d.fields.filter((f) => f.todo && OPEN.includes(f.status));
    out.push(`Otevřené body před konziliem (${open.length}):${open.length ? '' : ' žádné'}`);
    for (const f of open) out.push(`- ${f.todo!.title} [${f.status}] – ${f.issue} Kontakt: ${f.todo!.contacts.map((x) => `${x.role} ${x.name}${x.phone ? ` ${x.phone}` : ''}`).join(', ')}`);
    out.push('Údaje pro konzilium (20 položek):');
    for (const f of d.fields) out.push(`- ${f.label}: ${f.value ? f.value.replace(/\n/g, ' / ') : '(v dokumentaci není)'} [${f.status}]${f.note ? ` – ${f.note}` : ''}`);
    if (st.events.length) {
      out.push('Záznam koordinace:');
      for (const e of st.events) out.push(`- ${at(e.at)} ${e.who}: ${e.kind} – ${e.text}`);
    }
    const docs = Object.values(d.documents).sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
    out.push(`Zprávy (${docs.length}):`);
    for (const doc of docs) {
      const meta = sp?.docs.find((x) => x.id === doc.id);
      out.push(`### ${doc.ref} · datum zprávy ${czDate(doc.date)} · ${doc.title} · ${doc.place}${meta?.added ? ` · nahráno do aplikace ${at(meta.added)}` : sp ? '' : ' · součást demo dat'}${meta?.source === 'ocr' ? ' · přečteno z obrázku (OCR)' : ''}`);
      out.push(doc.text.slice(0, 5000));
    }
    if (d.afterMdt?.length) out.push(`Zprávy po konziliu (jen co, kde a kdy): ${d.afterMdt.map((x) => `${x.ref} – ${x.place}`).join('; ')}`);
  }
  const text = ps.apply(out.join('\n').replace(/ /g, ' '));
  return { text, apply: (s) => ps.apply(s), restore: (s) => ps.restore(s) };
}
