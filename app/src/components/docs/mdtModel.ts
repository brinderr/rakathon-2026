// Builds the printable "Podklad pre konzílium" strictly along the VZP template MDT_zapis.
// Every value carries its verbatim source (footnote); anything unknown by the MDT date is MISSING.
import type { Case, HandoverField, ISODate, SourceDoc } from '../../types';
import { DEMO_TODAY } from '../../types';
import type { FieldOverride } from '../case/caseUtils';
import { stepStateAt } from '../case/caseUtils';
import { docById, docKnownAt, findField, fmtDate, MISSING, plain, resolveField } from './docUtils';
import type { Resolved } from './docUtils';

/* ---------- Template parsing (text of templates.MDT_zapis from source.json) ---------- */

export interface TemplateItem { group?: string; label: string }
export interface TemplateSection { no: string; title: string; items: TemplateItem[] }
export interface Template { title: string; sections: TemplateSection[] }

export function parseTemplate(text: string): Template {
  const lines = text.split('\n').map(s => s.trim()).filter(Boolean);
  const title = lines[0] ?? 'Zápis k jednání multidisciplinárního týmu (MDT)';
  const sections: TemplateSection[] = [];
  let cur: TemplateSection | null = null;
  let group: string | undefined;
  for (const ln of lines.slice(1)) {
    const m = ln.match(/^(\d+)\s+(.+)$/);
    if (m) { cur = { no: m[1], title: m[2], items: [] }; sections.push(cur); group = undefined; continue; }
    if (!cur) continue;
    if (ln.endsWith(':')) { group = ln.slice(0, -1); continue; }
    cur.items.push({ group, label: ln });
  }
  return { title, sections };
}

/** Members of the MDT from the sample "MDT zaver" (lines between ČLENOVÉ MDT and DIAGNÓZA). */
export function parseMembers(zaver: string): string[] {
  const lines = zaver.split('\n').map(s => s.trim());
  const a = lines.findIndex(l => /^ČLENOVÉ MDT/i.test(l));
  const b = lines.findIndex((l, i) => i > a && /^DIAGN[ÓO]ZA/i.test(l));
  if (a < 0 || b < 0) return [];
  return lines.slice(a + 1, b).filter(Boolean);
}
/** "Případ prezentoval: MUDr. Martin Svoboda, …" → "MUDr. Martin Svoboda" */
export function parsePresenter(zaver: string): string | undefined {
  const m = zaver.match(/Případ prezentoval:\s*([^,\n]+)/i);
  return m?.[1]?.trim();
}

/* ---------- Document model ---------- */

export interface Footnote { n: number; key: string; docId?: string; title: string; place?: string; date?: string; quote?: string }
export interface Val extends Resolved { n?: number; prefix?: string }
export interface Line { label: string; values: Val[] }
export interface Group { heading?: string; lines: Line[] }
export interface Section {
  no: string; title: string;
  groups: Group[];
  table?: { head: string[]; rows: Val[][] };
  list?: Val[];
  placeholder?: string;
}
export interface MdtModel {
  title: string;
  mdtDate?: ISODate;
  asOf: ISODate;
  sections: Section[];
  notes: Footnote[];
  omittedDocs: SourceDoc[];
  stats: {
    values: number; cited: number; missing: number; conflicts: number; missingLabels: string[];
    /** fields of the handover still waiting for a human check (the doctor cannot confirm before they are checked) */
    proposed: number;
    /** footnotes: verbatim quotes vs. a reference to the whole report vs. taken from the VZP sample */
    quoted: number; refs: number; template: number;
  };
}

const TEMPLATE_SOURCE = 'Vzor VZP „MDT zaver“';

/** Demo state of the case screen (request sent / answer arrived / conflict verified / proposal confirmed). */
export type DemoOverride = FieldOverride;
export interface MdtOptions {
  /** Date the document is built for; defaults to the MDT date (never later than it). */
  asOf?: ISODate;
  /** Overrides from the case screen, by field key. Applied only when dated on or before `asOf`. */
  overrides?: Record<string, DemoOverride>;
}

/** Applies the demo overrides to the fields: answer arrived → value + citation; conflict verified / proposal
 *  confirmed by a human → value and citations stay, the conflict closes and the note says who decided. */
export function applyOverrides(fields: HandoverField[], overrides: Record<string, DemoOverride> | undefined, asOf: ISODate): HandoverField[] {
  if (!overrides) return fields;
  return fields.map(f => {
    const ov = overrides[f.key];
    if (!ov || ov.kind === 'pending' || ov.date > asOf) return f;
    if (ov.kind === 'resolved') return { ...f, status: 'confirmed', value: ov.value, citations: [ov.citation], sourceDate: ov.date, note: ov.note, conflict: undefined };
    if (ov.kind === 'decided') {
      const chosen = f.conflict?.[ov.which];
      const note = chosen ? `${ov.note} · platí ${ov.which.toUpperCase()}: ${chosen.value} (správa ${chosen.citation.docId})` : ov.note;
      return { ...f, status: f.status === 'conflict' ? 'confirmed' : f.status, conflict: undefined, note };
    }
    if (f.status !== 'proposed') return f;
    return { ...f, status: 'confirmed', note: f.note ? `${ov.note} · ${f.note}` : ov.note };
  });
}

/**
 * @param texts raw report texts by docId (from public/data/source.json) – used only to quote
 *              administrative lines (address, phone) verbatim from the referral.
 */
export function buildMdtModel(c: Case, tpl: Template, members: string[], texts: Record<string, string> = {}, opts: MdtOptions = {}): MdtModel {
  const mdt: ISODate | undefined = c.mdtDate;
  const wanted = opts.asOf ?? mdt ?? DEMO_TODAY;
  const asOf: ISODate = mdt && wanted > mdt ? mdt : wanted;
  const fields = applyOverrides(c.fields, opts.overrides, asOf);
  const notes: Footnote[] = [];

  const note = (key: string, make: () => Omit<Footnote, 'n' | 'key'>): number => {
    const found = notes.find(n => n.key === key);
    if (found) return found.n;
    const n = notes.length + 1;
    notes.push({ n, key, ...make() });
    return n;
  };
  const docTitle = (id: string) => {
    const d = docById(c, id);
    if (!d) return `Správa ${id}`;
    return /^\d+$/.test(d.id) ? `Správa ${d.id} · ${d.title}` : d.title;
  };
  const val = (r: Resolved, extra?: { prefix?: string; source?: string }): Val => {
    const v: Val = { ...r, prefix: extra?.prefix };
    if (r.missing) return v;
    if (r.docId) {
      const d = docById(c, r.docId);
      v.n = note(`${r.docId}|${r.quote ?? ''}`, () => ({
        docId: r.docId, title: docTitle(r.docId!), place: d?.place, date: fmtDate(d?.examDate), quote: r.quote,
      }));
    } else if (extra?.source) {
      v.n = note(`src|${extra.source}`, () => ({ title: extra.source! }));
    }
    return v;
  };
  const field = (...patterns: RegExp[]) => findField(fields, ...patterns);
  const res = (...patterns: RegExp[]) => resolveField(c, field(...patterns), asOf);
  const reqDoc = c.docs.find(d => d.kind === 'request');
  /** Verbatim line from the referral text, e.g. /^Bydliště:\s*(.+)$/m → value = group 1, quote = whole match. */
  const quoteFrom = (re: RegExp): Resolved | undefined => {
    if (!reqDoc) return undefined;
    const text = reqDoc.text ?? texts[reqDoc.id] ?? '';
    const m = text.match(re);
    return m ? { text: (m[1] ?? m[0]).trim(), docId: reqDoc.id, quote: m[0].trim(), missing: false } : undefined;
  };

  /* --- section 1: základní údaje --- */
  const nameField = field(/^(name|fullName|firstName|lastName|meno|jmeno)$/i, /meno|jm[ée]no|priezv|př[ií]jm|nacion/i);
  const fullName = `${c.patient.firstName} ${c.patient.lastName}`;
  const nameVal = (): Val => { const r = resolveField(c, nameField, asOf); return val(r.missing ? plain(fullName) : { ...r, text: fullName }); };
  const insurerVal = (): Val => {
    const r = res(/poist|pojiš|pojis|insur/i);
    const text = `${c.patient.insurerCode} – ${c.patient.insurerName}`;
    return val(r.missing ? plain(text) : { ...r, text });
  };
  const patientPhone = (): Val[] => {
    const ph = res(/telef|phone|kontakt na pac|^contact$/i);
    const phone = ph.missing ? (quoteFrom(/^Telefon:\s*(.+)$/m) ?? (c.patient.phone ? plain(c.patient.phone) : ph)) : ph;
    // one field "tel. … · e-mail …" (machine extraction): split it, never print the e-mail twice
    if (!phone.missing && /e-?mail/i.test(phone.text)) {
      const [p, e = ''] = phone.text.split(/\s*·?\s*e-?mail:?\s*/i);
      return [val({ ...phone, text: p.replace(/^tel\.?:?\s*/i, '').trim() }, { prefix: 'tel.' }), val({ ...phone, text: e.trim() }, { prefix: 'e-mail' })];
    }
    const em = res(/e-?mail/i);
    const email = em.missing ? (quoteFrom(/^E-?mail:\s*(.+)$/mi) ?? em) : em;
    return [val({ ...phone, text: phone.text.replace(/^tel\.?:?\s*/i, '') }, { prefix: 'tel.' }), val(email, { prefix: 'e-mail' })];
  };
  const address = (): Val[] => {
    const r = res(/adres|bydl/i);
    return [val(r.missing ? (quoteFrom(/^(?:Bydliště|Adresa|Bydlisko):\s*(.+)$/m) ?? r) : r)];
  };
  const weightHeight = (): Val[] => {
    const w = field(/v[áa]h|hmotn|weight/i);
    const h = field(/v[ýy]š|height/i);
    if (w && h === w) return [val(resolveField(c, w, asOf))]; // one combined field "Váha a výška"
    const out = [val(resolveField(c, w, asOf), { prefix: 'váha' })];
    if (h) out.push(val(resolveField(c, h, asOf), { prefix: 'výška' }));
    else out.push(val({ text: MISSING, missing: true }, { prefix: 'výška' }));
    return out;
  };
  const gpName = (): Val => {
    const r = res(/prakt|referuj|odosiel|odesíl|^gp$|registruj/i);
    const text = `${c.referringGp.name}, ${c.referringGp.practice}`;
    if (!r.missing) return val({ ...r, text });
    // the whole referral is the GP's document – cite it without a quote
    return val(reqDoc ? { text, docId: reqDoc.id, missing: false } : plain(text));
  };
  const gpContact = (): Val[] => {
    const phoneQ = quoteFrom(/Tel\.?:\s*(\+?[\d ]+\d)/);
    const phone: Resolved = phoneQ ?? (c.referringGp.phone ? { text: c.referringGp.phone, docId: reqDoc?.id, missing: false } : { text: MISSING, missing: true });
    const email: Resolved = c.referringGp.email ? { text: c.referringGp.email, docId: reqDoc?.id, missing: false } : { text: MISSING, missing: true };
    return [val(phone, { prefix: 'tel.' }), val(email, { prefix: 'e-mail' })];
  };

  const valuesFor = (group: string | undefined, label: string): Val[] => {
    const l = label.toLowerCase();
    const g = (group ?? '').toLowerCase();
    const isGp = /refer|l[ée]ka[řr]/.test(g);
    if (l.startsWith('datum')) return [mdt ? { ...plain(fmtDate(mdt)), note: 'termín konzília' } : { text: MISSING, missing: true }];
    if (l.startsWith('jm') || l.startsWith('meno')) return [isGp ? gpName() : nameVal()];
    if (l.startsWith('poji') || l.startsWith('pois')) return [insurerVal()];
    if (l.startsWith('telefon')) return isGp ? gpContact() : patientPhone();
    if (l.startsWith('adres')) return address();
    if (l.startsWith('váh') || l.startsWith('vah')) return weightHeight();
    if (l.startsWith('název') || l.startsWith('nazov')) {
      const f = fields.find(x => /diagn/i.test(x.key + ' ' + x.label) && !/k[óo]d|mkn|icd/i.test(x.key + ' ' + x.label));
      return [val(resolveField(c, f, asOf))];
    }
    if (l.startsWith('kód') || l.startsWith('kod')) {
      const f = field(/mkn|icd|k[óo]d/i);
      if (f) return [val(resolveField(c, f, asOf))];
      const dg = fields.find(x => /diagn/i.test(x.key + ' ' + x.label));
      const r = resolveField(c, dg, asOf);
      const m = r.missing ? null : r.text.match(/\b[A-Z]\d{2}(?:\.\d)?\b/);
      // the code is only read out of the diagnosis – a conflict about e.g. the lung lobe is not about the code (QA R5 #14)
      return [val(m ? { ...r, text: m[0], conflict: undefined } : { text: MISSING, missing: true })];
    }
    return [val({ text: MISSING, missing: true })];
  };

  /* --- section 5: table of exams, labs, histology (footnotes are numbered after sorting, so they follow reading order) --- */
  const known = (docId?: string, fallback?: ISODate) => { const d = docKnownAt(c, docId) ?? fallback ?? ''; return d <= asOf; };
  type Row = { iso: ISODate; cells: [string, string, Resolved] };
  const buildRows = (): Val[][] => {
    const rows: Row[] = [];
    for (const e of c.exams) {
      if (!known(e.docId, e.date)) continue;
      rows.push({ iso: e.date, cells: [fmtDate(e.date), `${e.type} · ${e.place}`, { text: e.summary, docId: e.docId, missing: false }] });
    }
    const labGroups = new Map<string, typeof c.labs>();
    for (const r of c.labs) {
      const k = `${r.date}|${r.lab}|${r.docId}`;
      if (!labGroups.has(k)) labGroups.set(k, []);
      labGroups.get(k)!.push(r);
    }
    for (const [, g] of labGroups) {
      const first = g[0];
      if (!known(first.docId, first.date)) continue;
      const already = rows.some(r => r.cells[2].docId === first.docId && /labor/i.test(r.cells[1]));
      if (already) continue;
      const show = g.filter(r => r.flag || /\bCA\s?\d|CEA|marker/i.test(r.test));
      const rest = g.length - show.length;
      const text = show.map(r => `${r.test} ${r.value}${r.unit ? ` ${r.unit}` : ''}${r.flag ? ` (${r.flag})` : ''}`).join(', ')
        + (rest > 0 ? `${show.length ? '; ' : ''}ďalších ${rest} hodnôt bez označenia H/L (celá tabuľka v prípade)` : '');
      rows.push({ iso: first.date, cells: [fmtDate(first.date), `Laboratórium · ${first.lab}`, { text, docId: first.docId, missing: false }] });
    }
    const histo = res(/histol/i);
    if (!histo.missing) {
      const row = rows.find(r => r.cells[2].docId === histo.docId);
      if (row) { if (histo.conflict) row.cells[2] = { ...row.cells[2], conflict: histo.conflict }; }
      else {
        const d = docById(c, histo.docId);
        rows.push({ iso: d?.examDate ?? asOf, cells: [fmtDate(d?.examDate), `Histológia · ${d?.place ?? ''}`, histo] });
      }
    }
    rows.sort((a, b) => a.iso.localeCompare(b.iso));
    return rows.map(r => [plain(r.cells[0]), plain(r.cells[1]), val(r.cells[2])]);
  };

  /* --- assemble sections exactly in template order --- */
  const sections: Section[] = tpl.sections.map(ts => {
    const t = ts.title.toLowerCase();
    const sec: Section = { no: ts.no, title: ts.title, groups: [] };

    if (/člen|clen/.test(t)) {
      sec.list = members.map(m => val(plain(m), { source: `${TEMPLATE_SOURCE} · zloženie tímu pre nádory GIT` }));
      if (!members.length) sec.placeholder = 'Zloženie tímu doplní KOC.';
      return sec;
    }
    if (/komorb/.test(t)) {
      const fa = field(/liek|l[ée]kov|medik|^fa$|\(fa\)/i);
      const faVal = fa ? val(resolveField(c, fa, asOf))
        : c.meds.length ? val({ text: c.meds.map(m => `${m.name} ${m.dose}`).join(', '), docId: c.meds[0].citation.docId, quote: c.meds[0].citation.quote, missing: false })
          : val({ text: MISSING, missing: true });
      sec.groups.push({ lines: [
        { label: 'Komorbidity', values: [val(res(/[ck]omorb|pridru|přidru/i, /^oa$|osobn[áa] anamn|\(oa\)/i))] },
        { label: 'Léková anamnéza', values: [faVal] },
        { label: 'Alergie', values: [val(res(/alerg|^aa$|\(aa\)/i))] },
      ] });
      // wishes of the patient (consent to share with the daughter, anxiety, request for a psychologist) – QA R5 #7
      const wishes = field(/^other$/i, /želani|iné dôležité/i);
      if (wishes) sec.groups.push({ heading: 'Doplnené nad rámec šablóny', lines: [{ label: 'Želania a sociálne', values: [val(resolveField(c, wishes, asOf))] }] });
      return sec;
    }
    if (/výsledk|vysledk/.test(t)) {
      sec.table = { head: ts.items.map(i => i.label), rows: buildRows() };
      sec.groups.push({ lines: [
        { label: 'Celkový stav', values: [val(res(/sympt|pr[íi]zn/i))] },
        { label: 'Stav výkonnosti (ECOG)', values: [val(res(/ecog|v[ýy]konn|karnof|performance/i))] },
      ] });
      // an announced addendum that has not arrived is missing, not "0 nie je v dokumentácii" (QA R5 #3: EGFR, ALK, ROS1, PD-L1)
      const addenda = c.steps.filter(st => /dodatok/i.test(st.title) && stepStateAt(st, asOf) !== null && stepStateAt(st, asOf) !== 'delivered');
      if (addenda.length) {
        sec.groups.push({ heading: 'Avizované, ešte neprišlo', lines: addenda.map(st => ({ label: st.title, values: [{ text: MISSING, missing: true, note: 'avizovaný, neprišiel' }] })) });
      }
      return sec;
    }
    if (/závěr|zaver|doporuč|doporuc/.test(t)) {
      sec.placeholder = mdt ? `Doplní konzílium na jednaní ${fmtDate(mdt)}.` : 'Doplní konzílium na jednaní (termín ešte nie je určený).';
      return sec;
    }
    // generic: items with optional groups (section 1 + 3)
    let cur: Group | null = null;
    for (const it of ts.items) {
      if (!cur || cur.heading !== it.group) { cur = { heading: it.group, lines: [] }; sec.groups.push(cur); }
      cur.lines.push({ label: it.label, values: valuesFor(it.group, it.label) });
    }
    // the GP's question goes to the MDT word for word, at the top of the diagnosis (QA R5 #7)
    if (/diagn/.test(t)) {
      const q = field(/^mdtQuestion$/i, /otázk/i);
      const r = resolveField(c, q, asOf);
      if (q && !r.missing) {
        sec.groups.unshift({ heading: 'Otázka praktika pre konzílium · doplnené nad rámec šablóny', lines: [{ label: 'Otázka', values: [val({ ...r, text: r.quote ?? r.text })] }] });
      }
    }
    return sec;
  });

  /* --- stats --- */
  let values = 0, cited = 0, missing = 0, conflicts = 0;
  const missingLabels: string[] = [];
  const SK_HEADING: Record<string, string> = { 'pacient': 'pacient', 'referující lékař': 'odosielajúci lekár' };
  const skHeading = (h: string) => SK_HEADING[h.toLowerCase()] ?? h.toLowerCase();
  const count = (v: Val, label?: string) => {
    values++;
    if (v.n) cited++;
    if (v.conflict) conflicts++;
    if (v.missing) { missing++; if (label) missingLabels.push(label); }
  };
  for (const s of sections) {
    s.groups.forEach(g => g.lines.forEach(l => l.values.forEach(v => count(v, `${v.prefix ?? l.label}${g.heading && !/šablón|neprišlo/i.test(g.heading) ? ` (${skHeading(g.heading)})` : ''}`))));
    s.table?.rows.forEach(r => count(r[2]));
  }
  // Reports received after the MDT date are never part of the handover (no foretelling of what will arrive).
  const omittedDocs = c.docs.filter(d => (d.receivedAt ?? d.examDate) > (mdt ?? asOf));

  const proposed = fields.filter(f => f.status === 'proposed' && resolveField(c, f, asOf).missing === false).length;
  const quoted = notes.filter(n => n.quote).length;
  const refs = notes.filter(n => !n.quote && n.docId).length;
  const template = notes.length - quoted - refs;
  return { title: tpl.title, mdtDate: mdt, asOf, sections, notes, omittedDocs, stats: { values, cited, missing, conflicts, missingLabels, proposed, quoted, refs, template } };
}

/* ---------- plain text (for "Kopírovať sekciu" and the clipboard) ---------- */

const valText = (v: Val) => `${v.prefix ? v.prefix + ' ' : ''}${v.text}${v.n ? ` [${v.n}]` : ''}`;

export function sectionText(s: Section): string {
  const out: string[] = [`${s.no} ${s.title}`];
  for (const g of s.groups) {
    if (g.heading) out.push(`${g.heading}:`);
    for (const l of g.lines) out.push(`${l.label}: ${l.values.map(valText).join(' · ')}`);
  }
  if (s.table) {
    out.push(s.table.head.join('\t'));
    for (const r of s.table.rows) out.push(r.map(valText).join('\t'));
  }
  if (s.list) for (const v of s.list) out.push(`- ${valText(v)}`);
  if (s.placeholder) out.push(s.placeholder);
  return out.join('\n');
}

/** Footnotes grouped by report (one header per source, the numbered quotes under it). */
export interface NoteGroup { key: string; title: string; place?: string; date?: string; notes: Footnote[] }
export function groupNotes(notes: Footnote[]): NoteGroup[] {
  const groups: NoteGroup[] = [];
  for (const n of notes) {
    const key = n.docId ?? `src|${n.title}`;
    let g = groups.find(x => x.key === key);
    if (!g) { g = { key, title: n.title, place: n.place, date: n.date, notes: [] }; groups.push(g); }
    g.notes.push(n);
  }
  return groups;
}

export function notesText(notes: Footnote[]): string {
  const out = ['Zdroje'];
  for (const g of groupNotes(notes)) {
    out.push(`${g.title}${g.place ? ` · ${g.place}` : ''}${g.date ? ` · ${g.date}` : ''}`);
    for (const n of g.notes) out.push(`  [${n.n}] ${n.quote ? `„${n.quote}“` : n.docId ? 'zhrnutie správy (bez doslovného citátu)' : 'prevzaté zo vzoru'}`);
  }
  return out.join('\n');
}

export function documentText(m: MdtModel): string {
  return [m.title, `${m.mdtDate ? `Konzílium ${fmtDate(m.mdtDate)} · ` : ''}údaje známe k ${fmtDate(m.asOf)}`, '', ...m.sections.map(sectionText).flatMap(s => [s, '']), notesText(m.notes)].join('\n');
}
