// Builds what eKoordinace shows about one patient from his reports with the shared engine (app/src/ai, rules only).
// Used in the browser for patients added in the app, and by scripts/build-case.mjs for the precomputed demo case.
// The journey follows the verbs of the VZP assignment (Zadani_ulohy): převzít → vyžádat a shromáždit → koordinovat →
// připravit podklad pro MDT → uzavřít smyčku. Every number, name, date and phone comes from the engine output or the
// report text; only the wording of the to-do titles is chosen here, per type of finding.
import { extractHandover } from '../../../app/src/ai/extract.ts';
import { FIELD_SPECS } from '../../../app/src/ai/fields.ts';
import * as R from '../../../app/src/ai/rules.ts';
import { czDate } from '../../../app/src/ai/text.ts';
import type { CaseData, DocRef, Field, Person, Quote, Status, Step, Todo } from '../sections/pacient/types.ts';

export type Report = R.Doc;

export interface BuildInput {
  caseId: string;
  docs: Report[];
  /** the day the coordinator looks at the case */
  today: string;
  /** date of the MDT; nothing newer enters the handover ('' or missing = not planned yet) */
  mdtDate?: string;
  /** name shown until the reports say it */
  label?: string;
}

const dayMonth = (iso: string) => { const [, m, d] = iso.split('-').map(Number); return `${d}. ${m}.`; };
const dayBefore = (iso: string) => new Date(Date.parse(`${iso}T12:00:00Z`) - 86_400_000).toISOString().slice(0, 10);
const span = (a: string, b: string) => (a === b ? dayMonth(a) : a.slice(0, 7) === b.slice(0, 7) ? `${Number(a.slice(8))}.–${dayMonth(b)}` : `${dayMonth(a)} – ${dayMonth(b)}`);
const reports = (n: number) => `${n} ${n === 1 ? 'zpráva' : n >= 2 && n <= 4 ? 'zprávy' : 'zpráv'}`;
const sentences = (t: string) => t.split(/(?<=[.!?])\s+(?=\p{Lu})/u);
const phoneOf = (s: string) => s.match(/\+?\d{3}[\s\d]{6,}\d/)?.[0];
const unit = (d: Report) => { const [place, dept = place] = R.facility(d).split(' – '); return { place, dept: dept.split(',')[0] }; };
const byDate = (a: Report, b: Report) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id);
const what = (d: Report) => {
  const kind = R.docKind(d);
  const title = R.docTitle(d);
  if (kind === 'imaging') return title.split(/\s/)[0];
  if (kind === 'procedure' && /FNB|FNA|biops/i.test(title)) return 'Biopsie';
  if (kind === 'lab') return 'Kontrolní odběry';
  if (kind === 'histology') return 'Histologie';
  return title;
};
// short type label on the document icon, like a file type ("ŽÁD", "CT", "LAB", "HIS")
const CODE: Record<string, string> = { referral: 'ŽÁD', lab: 'LAB', histology: 'HIS', clinic: 'AMB' };
const codeOf = (d: Report) => {
  const kind = R.docKind(d);
  if (kind === 'imaging' || kind === 'procedure') return R.docTitle(d).split(/[\s-]/)[0].toUpperCase().slice(0, 3);
  return CODE[kind] ?? 'DOC';
};
/** Who signed the report: the last line that starts with a medical title ("MUDr. Martin Svoboda"). */
const signer = (d: Report) => d.text.split('\n').map((l) => l.trim()).findLast((l) => /^(?:MUDr|MDDr|doc|prof|Ing|Mgr|Bc)\.\s/.test(l)) ?? '';
const INSURER_SHORT: Record<string, string> = { 111: 'VZP ČR', 201: 'VoZP ČR', 205: 'ČPZP', 207: 'OZP', 209: 'ZPŠ', 211: 'ZPMV ČR', 213: 'RBP' };
const FIRST = ['performance', 'medication', 'histology'];

export async function buildCase(input: BuildInput): Promise<CaseData> {
  const { caseId, docs, today } = input;
  const mdt = input.mdtDate ?? '';
  const due = mdt ? dayBefore(mdt) : '';
  const known = docs.filter((d) => d.date <= today).sort(byDate);
  const r = await extractHandover({ caseId, docs, asOf: mdt || '9999-12-31', generatedAt: `${today}T08:00:00Z` });
  const field = (k: string) => r.fields.find((f) => f.key === k) ?? { key: k, value: '', status: 'missing', citations: [], note: '' };
  const label = (k: string) => FIELD_SPECS.find((s) => s.key === k)?.label ?? k;

  const referral = known.filter((d) => R.docKind(d) === 'referral').sort((a, b) => b.date.localeCompare(a.date))[0];
  const refDate = referral?.date ?? '';
  // how a coordinator calls a report ("žádanka praktika", "protokol biopsie") – dataset numbers mean nothing to her
  const labelOf = (d: Report) => {
    const kind = R.docKind(d);
    const title = R.docTitle(d);
    if (kind === 'referral') return /převzetí|KOC/i.test(title) ? 'žádanka praktika' : 'epikríza praktika';
    if (kind === 'histology') return 'histologie';
    if (kind === 'procedure') {
      if (/FNB|FNA|biops/i.test(title)) return 'protokol biopsie';
      const head = `${title}\n${d.text.split('\n').slice(0, 8).join('\n')}`;
      const scope = head.match(/gastroskop|koloskop|bronchoskop|endosonograf|\bEUS\b/i)?.[0].toLowerCase();
      return scope ? ({ endosonograf: 'EUS', eus: 'EUS' } as Record<string, string>)[scope] ?? `${scope}ie` : 'protokol výkonu';
    }
    if (kind === 'lab') return refDate && d.date > refDate ? 'kontrolní odběry' : 'laboratoř';
    if (kind === 'imaging') return title.split(/\s+/).slice(0, 2).join(' ').replace(/,$/, '');
    if (/léčby bolesti|algeziolog/i.test(R.facility(d) + title)) return 'algeziologie';
    const spec = R.facility(d).match(/(\p{L}+?)ická ambulance/iu);
    const other = R.facility(d).match(/(\p{L}+)\s+ambulance/iu);
    return spec ? `${spec[1].toLowerCase()}ie` : other ? `${other[1].toLowerCase()} ambulance` : 'zpráva';
  };
  const refOf = (d: Report) => `${labelOf(d)} ${dayMonth(d.date)}`;
  const refById = (id: string) => { const d = docs.find((x) => x.id === id); return d ? refOf(d) : id; };
  const doc = (d: Report): DocRef => ({ id: d.id, date: d.date, title: R.docTitle(d), place: R.facility(d), code: codeOf(d), ref: refOf(d), ...(d.date === today ? { isNew: true } : {}) });
  const quotesOf = (cs: { docId: string; quote: string }[]): Quote[] =>
    [...new Map(cs.map((c) => [c.quote, { docId: c.docId, ref: refById(c.docId), quote: c.quote }])).values()];

  const earlier = referral ? known.filter((d) => d.date <= referral.date && d.id !== referral.id) : known;
  const later = referral ? known.filter((d) => d.date > referral.date) : [];
  const fresh = known.filter((d) => d.date === today);
  // what the GP asks for, verbatim from the referral
  const request = referral ? field('mdtQuestion').citations.filter((c) => c.docId === referral.id).map((c) => c.quote).join(' ') : '';

  // ---------- patient ----------
  const female = field('sex').value === 'žena';
  const first = field('firstName').value;
  const last = field('lastName').value;
  const name = first && last ? `${first} ${last}` : input.label || 'Nový pacient';
  const insurer = field('insurer').value;
  // diagnosis: the code from the referral, the type of tumour verbatim from the pathologist once the histology is in
  const histologyDoc = known.filter((d) => R.docKind(d) === 'histology').sort((a, b) => b.date.localeCompare(a.date))[0];
  const dxValue = field('diagnosis').value;
  const dxCode = dxValue.match(/^[A-Z]\d{2}(?:\.\d{1,2})?/)?.[0] ?? '';
  const diagnosis = histologyDoc && field('histology').value
    ? { code: dxCode, text: field('histology').value.split(/,|\s·\s|\.\s/)[0], source: `histologie ${dayMonth(histologyDoc.date)}`, docId: histologyDoc.id }
    : { code: dxCode, text: dxValue.replace(/^[A-Z]\d{2}(?:\.\d{1,2})?\s*[–-]\s*/, '').replace(/\s*\(podezření[\s\S]*$/, ''), source: referral ? `podezření, žádanka ${dayMonth(referral.date)}` : '', docId: referral?.id ?? '' };

  // ---------- people the coordinator calls ----------
  const gp = r.referringGp ?? { name: 'praktický lékař' as string, phone: undefined as string | undefined };
  const GP: Person = { role: 'Praktický lékař', name: gp.name, ...(gp.phone ? { phone: gp.phone } : {}) };
  const PATIENT: Person = { role: female ? 'Pacientka' : 'Pacient', name, ...(phoneOf(field('patientContact').value) ? { phone: phoneOf(field('patientContact').value) } : {}) };
  const cp = field('contactPerson').value.match(/^(.+?)\s*\(([^)]+)\)/);
  const relative: Person | null = cp ? {
    role: cp[2].charAt(0).toUpperCase() + cp[2].slice(1),
    name: cp[1],
    ...(phoneOf(field('contactPerson').value) ? { phone: phoneOf(field('contactPerson').value) } : {}),
    ...(referral && new RegExp(`Souhlasí se sdílením informací s ${cp[2].slice(0, 3)}`, 'i').test(referral.text) ? { note: `souhlas se sdílením informací (${refOf(referral)})` } : {}),
  } : null;
  const personOf = (d: Report): Person => {
    if (d.id === referral?.id) return GP;
    const phone = phoneOf(d.text.split(/^Pacient(?:ka)?:/m)[0].match(/Tel[^\n]*/i)?.[0] ?? '');
    const name = signer(d);
    return { role: name ? unit(d).dept : 'Pracoviště', name: name || unit(d).place, ...(phone ? { phone } : {}) };
  };
  // whom to call: the authors of the reports behind the finding (both sides of a conflict), else the GP
  const contactsFor = (f: R.Finding): Person[] => {
    if (f.fieldKey === 'patientContact') return relative ? [PATIENT, relative] : [PATIENT];
    const people = [...new Set(f.citations.map((c) => c.docId))]
      .map((id) => docs.find((x) => x.id === id)).filter((d): d is Report => Boolean(d)).map(personOf);
    const unique = [...new Map(people.map((x) => [x.name, x])).values()];
    return unique.length ? unique : [GP];
  };

  // ---------- what the coordinator still has to do before the MDT ----------
  const drugs = field('medication').value.split(/,\s*/).map((m) => m.split(/\s/)[0].toLowerCase()).filter(Boolean);
  const titleFor = (f: R.Finding) => {
    const quoted = f.citations.map((c) => c.quote).join(' ').toLowerCase();
    if (f.fieldKey === 'performance' && f.severity === 'missing') return 'Doplnit výkonnostní stav (ECOG)';
    if (f.fieldKey === 'patientContact' && /e-mail/i.test(f.text)) return `Zjistit e-mail ${female ? 'pacientky' : 'pacienta'}`;
    const who = female ? 'pacientka' : 'pacient';
    if (f.id.startsWith('medication-change')) {
      const stopped = f.citations[1]?.quote.match(/(\p{L}+)\s+(?:trvale|definitivně)\s+vysazen/iu)?.[1];
      if (stopped) return `Ověřit, zda ${who} ještě užívá ${stopped.toLowerCase()}`;
    }
    const drug = f.id.startsWith('date-conflict') && f.fieldKey === 'medication' && /vysazen/.test(quoted) && drugs.find((m) => quoted.includes(m));
    if (drug) return `Ověřit, kdy byl vysazen ${drug}`;
    if (f.fieldKey === 'histology' && /odběr/.test(quoted)) return 'Ověřit datum odběru vzorku na histologii';
    if (f.id.startsWith('pending')) {
      const items = f.text.match(/avizuje doplnění: ([^.]+)\./)?.[1];
      return f.fieldKey === 'histology' ? `Vyžádat dodatek k histologii${items ? ` (${items})` : ''}` : `Vyžádat avizovaný výsledek${items ? ` (${items})` : ''}`;
    }
    if (f.id === 'allergy-conflict') {
      const found = f.text.match(/zaznamenala: ([^.]+)\./)?.[1];
      return found ? `Ověřit alergii: ${found}` : 'Ověřit alergie';
    }
    if (f.id === 'staging-conflict') return 'Ověřit M-stadium – vzdálené metastázy nejsou vyloučeny';
    if (f.id.startsWith('rc-mismatch')) {
      const d = docs.find((x) => x.id === f.citations[1]?.docId);
      return `Ověřit, zda ${d ? refOf(d) : 'zpráva'} patří ${female ? 'pacientce' : 'pacientovi'} (jiné rodné číslo)`;
    }
    if (f.id === 'side-conflict') return 'Ověřit stranu nálezu';
    if (f.id === 'location-conflict') return 'Ověřit lokalizaci nálezu';
    if (f.id.startsWith('recommended')) {
      const exam = f.text.match(/doporučuje doplnit (.+?) –/)?.[1];
      if (exam) return `Zajistit doporučené vyšetření: ${exam}`;
    }
    const l = label(f.fieldKey ?? '');
    return `${f.severity === 'missing' ? 'Doplnit' : 'Ověřit'}: ${l.charAt(0).toLowerCase()}${l.slice(1)}`;
  };
  // "Zpráva 06 (28. 9. 2026)" → "Žádanka praktika 28. 9."; in other cases, where the name cannot be declined,
  // "podle zprávy 05 (CT …, 21. 9. 2026)" → "podle zprávy „CT hrudníku 21. 9.“"
  const DATED = String.raw`(?:\s*\([^()]*\d{1,2}\. ?\d{1,2}\. ?\d{4}\)|\s+z\s+\d{1,2}\. ?\d{1,2}\. ?\d{4})?`;
  const humanRefs = (t: string) => t
    .replace(/\(zpráva (\d{2})\)/g, (_, id: string) => `(${refById(id)})`)
    .replace(new RegExp(String.raw`(^|[.!?]\s+)Zpráva (\d{2})${DATED}`, 'g'), (_, pre: string, id: string) => { const x = refById(id); return pre + x.charAt(0).toUpperCase() + x.slice(1); })
    .replace(new RegExp(String.raw`\bzpráva (\d{2})${DATED}( zaznamenala)?`, 'g'), (_, id: string, verb?: string) => `${refById(id)}${verb ? ' uvádí' : ''}`)
    .replace(new RegExp(String.raw`\b(zprávy|zprávě|zprávu) (\d{2})${DATED}`, 'g'), (_, w: string, id: string) => `${w} „${refById(id)}“`);
  // the engine's reason without its instruction ("ověřte s …") – the title and the contact already say that
  const whyFor = (f: R.Finding) => sentences(humanRefs(f.text.replace(/\s*\(MDT_zapis\)/g, '').replace(/\bpacienta\b/g, female ? 'pacientky' : 'pacienta')))
    .filter((x) => !/ověřte/i.test(x)).join(' ');
  const priority = (t: Todo) => { const i = FIRST.indexOf(t.field); return i < 0 ? FIRST.length : i; };
  // the engine's draft of a request for what is missing (ECOG, a histology addendum …), for "Vyžádat"
  const draftOf = (key?: string) => (key ? r.fields.find((x) => x.key === key)?.request : undefined);
  const todo: Todo[] = known.length === 0 ? [] : r.findings
    .filter((f) => (f.severity === 'missing' || f.severity === 'conflict') && f.fieldKey)
    .map((f) => ({
      field: f.fieldKey ?? '',
      kind: f.severity === 'missing' ? 'chybí' : 'rozpor',
      title: titleFor(f),
      why: whyFor(f),
      quotes: quotesOf(f.citations),
      contacts: contactsFor(f),
      ...(draftOf(f.fieldKey) ? { request: draftOf(f.fieldKey)! } : {}),
    }))
    .sort((a, b) => priority(a) - priority(b));
  const open = new Set(todo.map((t) => t.field));

  // the 20 items of Handover_obsah, grouped like the template, each with its sentences from the reports
  const GROUP: Record<string, string> = {
    Pacient: female ? 'Nacionále pacientky' : 'Nacionále pacienta', Kontakty: 'Kontakty',
    Diagnóza: 'Diagnóza a otázka pro konzilium', Anamnéza: 'Anamnéza', Stav: female ? 'Stav pacientky' : 'Stav pacienta',
    Vyšetrenia: 'Vyšetření a výsledky', Laboratórium: 'Vyšetření a výsledky', Histológia: 'Vyšetření a výsledky', Iné: 'Jiná sdělení',
  };
  const fields: Field[] = r.fields.map((f) => {
    const spec = FIELD_SPECS.find((x) => x.key === f.key);
    const issue = todo.find((t) => t.field === f.key);
    const status = issue ? (issue.kind === 'rozpor' ? 'rozpor' : f.value ? 'neúplné' : 'chybí') : f.value ? 'nalezeno' : 'chybí';
    return {
      key: f.key, label: label(f.key), group: GROUP[spec?.group ?? ''] ?? 'Jiná sdělení', value: f.value, status,
      issue: issue?.why ?? (f.value ? '' : humanRefs(f.note ?? '')),
      quotes: quotesOf(f.citations ?? []),
      ...(issue ? { todo: { title: issue.title, contacts: issue.contacts, quotes: issue.quotes } } : {}),
    };
  });

  // ---------- the journey: the first step that is not done is "now" ----------
  const lastLater = later[later.length - 1];
  const draft: (Omit<Step, 'status'> & { done: boolean })[] = [
    referral ? {
      id: 'prevzit', label: 'Žádost od praktika', title: 'Praktický lékař požádal o převzetí do péče KOC', done: true,
      date: referral.date, short: dayMonth(referral.date),
      ...(request ? { request: { docId: referral.id, ref: refOf(referral), quote: request } } : {}),
      docs: [doc(referral)],
    } : {
      id: 'prevzit', label: 'Žádost od praktika', title: 'Přijmout žádanku od praktika', done: false, short: 'chybí',
      summary: known.length ? 'Mezi zprávami není žádanka praktika o převzetí do péče KOC.' : 'Zatím žádné zprávy. Přidejte žádanku praktika a další zprávy.',
    },
    {
      id: 'shromazdit', label: 'Předchozí zprávy', title: earlier.length ? 'Předchozí zprávy shromážděny' : 'Vyžádat a shromáždit předchozí zprávy',
      done: Boolean(referral) && earlier.length > 0, short: earlier.length ? reports(earlier.length) : '–',
      ...(earlier.length ? { docs: earlier.map(doc) } : { summary: 'Zatím žádné předchozí zprávy.' }),
    },
    {
      id: 'koordinovat', label: 'Vyšetření', title: later.length ? 'Vyšetření proběhla' : 'Koordinovat vyšetření',
      done: later.length > 0, ...(lastLater ? { date: lastLater.date } : {}), short: later.length ? span(later[0].date, lastLater.date) : '–',
      ...(later.length ? { docs: later.map((d) => ({ ...doc(d), what: what(d) })) } : { summary: 'Zatím žádné výsledky vyšetření v KOC.' }),
    },
    {
      id: 'podklad', label: 'Podklad pro konzilium', title: mdt ? `Připravit podklad pro konzilium ${czDate(mdt)}` : 'Připravit podklad pro konzilium',
      done: false, ...(due ? { due } : {}), short: due ? `do ${dayMonth(due)}` : 'termín nestanoven', todo,
    },
    {
      id: 'uzavrit', label: 'Závěr praktikovi', title: 'Poslat závěr praktikovi a doložit doručení', done: false,
      short: mdt ? `po ${dayMonth(mdt)}` : '–',
      summary: mdt ? `Po konziliu ${czDate(mdt)} dostane závěr ${gp.name}.` : `Po konziliu dostane závěr ${gp.name}.`,
    },
  ];
  const nowAt = draft.findIndex((s) => !s.done);
  const steps: Step[] = draft.map(({ done, ...s }, i) => ({ ...s, status: (done ? 'done' : i === nowAt ? 'now' : 'waiting') as Status }));

  const data: CaseData = {
    generatedFrom: 'app/src/ai (pravidla) · eKoordinace',
    today,
    mdtDate: mdt,
    patient: {
      name,
      initials: first && last ? `${first[0]}${last[0]}` : name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase(),
      sex: field('sex').value,
      born: (field('age').value.match(/nar\. ([^)]+)/) ?? [])[1] ?? '',
      age: field('age').value.replace(/\s*\(.*\)$/, ''),
      insurer: { code: insurer, short: insurer ? INSURER_SHORT[insurer] ?? `ZP ${insurer}` : '', name: R.insurerName(insurer) ?? '' },
      diagnosis,
      ...(PATIENT.phone ? { phone: PATIENT.phone } : {}),
      contactPerson: relative,
      gp: GP,
    },
    stats: {
      fields: r.meta.stats.fields,
      ready: r.fields.filter((f) => f.value && f.status !== 'missing' && f.status !== 'conflict' && !open.has(f.key)).length,
      missing: todo.filter((t) => t.kind === 'chybí').length,
      conflicts: todo.filter((t) => t.kind === 'rozpor').length,
    },
    fields,
    news: fresh.map((d) => ({ id: d.id, what: what(d), dept: unit(d).dept })),
    // full text of every report known on the day, for the reader
    documents: Object.fromEntries(known.map((d) => [d.id, { ...doc(d), text: d.text }])),
    // reports written after the MDT: only what/where/when, never part of the podklad
    afterMdt: mdt ? docs.filter((d) => d.date > mdt).sort(byDate).map((d) => ({ ...doc(d), what: what(d) })) : [],
    steps,
  };
  return mdt ? data : undated(data);
}

/** Without an MDT date the engine looks at the reports "as of the end of time" (31. 12. 9999) – that day must not
 *  show in any text: "K 31. 12. 9999 v dokumentaci není" → "Zatím v dokumentaci není", "před konziliem 31. 12. 9999" →
 *  "před konziliem". */
function undated(data: CaseData): CaseData {
  const DAY = String.raw`31\.\s12\.\s9999`;
  const json = JSON.stringify(data)
    .replace(new RegExp(String.raw`\bK ${DAY} v dokumentaci není`, 'g'), 'Zatím v dokumentaci není')
    .replace(new RegExp(String.raw`do konzilia ${DAY} v dokumentaci není`, 'g'), 'zatím v dokumentaci není')
    .replace(new RegExp(String.raw`\s?(?:k datu |po datu )?(?:konzilia |konziliem )?${DAY}`, 'g'), (m) => (/konzili/.test(m) ? m.replace(new RegExp(String.raw`\s?${DAY}`), '') : ''));
  return JSON.parse(json) as CaseData;
}
