// Builds the printable „Podklad pro konzilium“ strictly along the VZP template MDT_zapis.
// Every value is the VERBATIM sentence of the report (Czech, as written by the doctor) with a footnote;
// the app never paraphrases. Anything unknown by the MDT date is MISSING („není v dokumentaci“).
import type { Case, HandoverField, ISODate, SourceDoc } from '../../types';
import { DEMO_TODAY } from '../../types';
import type { FieldOverride } from '../case/caseUtils';
import { stepStateAt } from '../case/caseUtils';
import { docById, docKnownAt, findField, fmtDate, MISSING, plain } from './docUtils';
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

export interface Footnote {
  n: number; key: string; docId?: string; title: string; place?: string; date?: string; quote?: string;
  /** the value in the document IS this quote (no need to repeat it under the line) */
  verbatim?: boolean;
}
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
      const note = chosen ? `${ov.note} · platí ${ov.which.toUpperCase()}: „${chosen.citation.quote}“ (zpráva ${chosen.citation.docId})` : ov.note;
      return { ...f, status: f.status === 'conflict' ? 'confirmed' : f.status, conflict: undefined, note };
    }
    if (f.status !== 'proposed') return f;
    return { ...f, status: 'confirmed', note: f.note ? `${ov.note} · ${f.note}` : ov.note };
  });
}

/** A verbatim quote as a one-line value: line breaks inside the quote become " / " (or a space in table-like quotes). */
const oneLine = (q: string, sep = ' / ') => q.replace(/\s*\n\s*/g, sep).replace(/\s+/g, ' ').trim();
/** „Telefon: +420 …“ → „+420 …“ for the administrative lines whose label the template already prints
 *  (the footnote keeps the whole quote; the shown text is then not marked verbatim). */
const LABEL_RE = /^(?:Telefon|Tel\.?|E-?mail|Bydliště|Adresa|Bydlisko):\s*/i;
const stripLabel = (r: Resolved): Resolved => (LABEL_RE.test(r.text) ? { ...r, text: r.text.replace(LABEL_RE, '').trim(), verbatim: false } : r);

/**
 * Values of a handover field for the document: one value per verbatim quote known at `asOf`
 * (the doctor's own sentence, never a paraphrase). Missing / nothing known yet → one MISSING value.
 * Flags (conflict, proposal, note) sit on the first value of the line.
 */
export function verbatimValues(c: Case, f: HandoverField | undefined, asOf: ISODate): Resolved[] {
  if (!f || f.status === 'missing' || !f.value) return [{ text: MISSING, missing: true }];
  const known = f.citations.filter(ci => { const d = docKnownAt(c, ci.docId); return !d || d <= asOf; });
  const flags = { proposed: f.status === 'proposed', ai: (f as HandoverField & { origin?: string }).origin === 'ai' };
  const newest = f.sourceDate ?? '';
  if (!known.length) {
    // no quote usable at this date: the value itself is a summary (cite nothing older than the date)
    if (!newest || newest <= asOf) return [{ text: f.value, missing: false, conflict: f.conflict, ...flags }];
    return [{ text: MISSING, missing: true }];
  }
  const laterNote = newest && newest > asOf ? `stav k ${fmtDate(asOf)}` : undefined;
  return known.map((ci, i) => ({
    text: oneLine(ci.quote), docId: ci.docId, quote: ci.quote, missing: false, verbatim: true,
    ...(i === 0 ? { conflict: f.conflict, note: laterNote, ...flags } : {}),
  }));
}

/** The verbatim „ZÁVĚR“ paragraph of a report (the doctor's own conclusion), if the report has one. */
export function conclusionOf(text: string | undefined): string | undefined {
  if (!text) return undefined;
  const lines = text.split('\n');
  const inline = text.match(/^Závěr:\s*(.+)$/m);
  const start = lines.findIndex(l => /^ZÁVĚR\b/.test(l.trim()));
  if (start < 0) return inline?.[1]?.trim();
  const out: string[] = [];
  for (const raw of lines.slice(start + 1)) {
    const l = raw.trim();
    if (!l) continue;
    if (/^[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ ,\-–/()]{4,}$/.test(l)) break;          // next heading
    if (/^(Datum|Vydáno|V \S.* dne |MUDr\.|Ing\.|doc\.|prof\.)/.test(l)) break; // signature block
    out.push(l);
  }
  return out.length ? out.join(' ') : inline?.[1]?.trim();
}

/** The report's own title line, e.g. „Výsledek vyšetření – RTG hrudníku PA“ (first lines of the text). */
export function titleLineOf(text: string | undefined): string | undefined {
  if (!text) return undefined;
  return text.split('\n').slice(0, 8).map(s => s.trim())
    .find(l => /^(Výsledek vyšetření|Výsledky laborator|Ambulantní zpráva|Protokol o výkonu|Bioptický nález|Epikríza|Propouštěcí zpráva|Lékařská zpráva|Zpráva z vyšetření)/i.test(l));
}

/**
 * @param texts raw report texts by docId (from public/data/source.json) – used to quote administrative
 *              lines (address, phone) and the reports' own conclusions verbatim.
 */
export function buildMdtModel(c: Case, tpl: Template, members: string[], texts: Record<string, string> = {}, opts: MdtOptions = {}): MdtModel {
  const mdt: ISODate | undefined = c.mdtDate;
  const wanted = opts.asOf ?? mdt ?? DEMO_TODAY;
  const asOf: ISODate = mdt && wanted > mdt ? mdt : wanted;
  const fields = applyOverrides(c.fields, opts.overrides, asOf);
  const notes: Footnote[] = [];
  const textOf = (id?: string) => (id ? (docById(c, id)?.text ?? texts[id]) : undefined);

  const note = (key: string, verbatim: boolean, make: () => Omit<Footnote, 'n' | 'key' | 'verbatim'>): number => {
    const found = notes.find(n => n.key === key);
    if (found) { if (!verbatim) found.verbatim = false; return found.n; }
    const n = notes.length + 1;
    notes.push({ n, key, verbatim, ...make() });
    return n;
  };
  const docTitle = (id: string) => {
    const d = docById(c, id);
    if (!d) return `Zpráva ${id}`;
    return /^\d+$/.test(d.id) ? `Zpráva ${d.id} · ${d.title}` : d.title;
  };
  const val = (r: Resolved, extra?: { prefix?: string; source?: string }): Val => {
    const v: Val = { ...r, prefix: extra?.prefix };
    if (r.missing) return v;
    if (r.docId) {
      const d = docById(c, r.docId);
      v.n = note(`${r.docId}|${r.quote ?? ''}`, !!r.verbatim, () => ({
        docId: r.docId, title: docTitle(r.docId!), place: d?.place, date: fmtDate(d?.examDate), quote: r.quote,
      }));
    } else if (extra?.source) {
      v.n = note(`src|${extra.source}`, false, () => ({ title: extra.source! }));
    }
    return v;
  };
  const vals = (rs: Resolved[], extra?: { prefix?: string }): Val[] => rs.map(r => val(r, extra));
  const field = (...patterns: RegExp[]) => findField(fields, ...patterns);
  const res = (...patterns: RegExp[]) => verbatimValues(c, field(...patterns), asOf);
  const reqDoc = c.docs.find(d => d.kind === 'request');
  /** Verbatim line from the referral text, e.g. /^Bydliště:\s*(.+)$/m → value = group 1, quote = whole match. */
  const quoteFrom = (re: RegExp, whole = false): Resolved | undefined => {
    if (!reqDoc) return undefined;
    const text = reqDoc.text ?? texts[reqDoc.id] ?? '';
    const m = text.match(re);
    if (!m) return undefined;
    const quote = m[0].trim();
    return { text: whole ? quote : (m[1] ?? m[0]).trim(), docId: reqDoc.id, quote, missing: false, verbatim: whole };
  };

  /* --- section 1: základní údaje --- */
  const nameField = field(/^(name|fullName|firstName|lastName|meno|jmeno)$/i, /meno|jm[ée]no|priezv|př[ií]jm|nacion/i);
  const fullName = `${c.patient.firstName} ${c.patient.lastName}`;
  const nameVal = (): Val => {
    const ci = nameField?.citations.find(x => { const d = docKnownAt(c, x.docId); return !d || d <= asOf; });
    return val(ci ? { text: fullName, docId: ci.docId, quote: ci.quote, missing: false } : plain(fullName));
  };
  const insurerVal = (): Val => {
    const f = field(/poist|pojiš|pojis|insur/i);
    const ci = f?.citations.find(x => { const d = docKnownAt(c, x.docId); return !d || d <= asOf; });
    const text = `${c.patient.insurerCode} – ${c.patient.insurerName}`;
    return val(ci ? { text, docId: ci.docId, quote: ci.quote, missing: false } : plain(text));
  };
  const patientPhone = (): Val[] => {
    const ph = res(/telef|phone|kontakt na pac|^contact$/i).map(stripLabel);
    const phone = ph[0].missing ? [quoteFrom(/^Telefon:\s*(.+)$/m) ?? (c.patient.phone ? plain(c.patient.phone) : ph[0])] : ph;
    const em = res(/e-?mail/i).map(stripLabel);
    const email = em[0].missing ? [quoteFrom(/^E-?mail:\s*(.+)$/mi) ?? em[0]] : em;
    // one field may carry both the phone and the e-mail (machine extraction): label each value by what it is, never twice
    const isMail = (r: Resolved) => !r.missing && /@|e-?mail/i.test(r.text);
    const phoneHasMail = phone.some(isMail);
    const out = phone.map(r => val(r, { prefix: isMail(r) ? 'e-mail' : 'tel.' }));
    return phoneHasMail ? out : [...out, ...email.map(r => val(r, { prefix: 'e-mail' }))];
  };
  const address = (): Val[] => {
    const r = res(/adres|bydl/i).map(stripLabel);
    return r[0].missing ? [val(quoteFrom(/^(?:Bydliště|Adresa|Bydlisko):\s*(.+)$/m) ?? r[0])] : vals(r);
  };
  const weightHeight = (): Val[] => {
    const w = field(/v[áa]h|hmotn|weight/i);
    const h = field(/v[ýy]š|height/i);
    if (w && h === w) return vals(verbatimValues(c, w, asOf)); // one combined field "Váha a výška"
    const out = vals(verbatimValues(c, w, asOf), { prefix: 'váha' });
    if (h) out.push(...vals(verbatimValues(c, h, asOf), { prefix: 'výška' }));
    else out.push(val({ text: MISSING, missing: true }, { prefix: 'výška' }));
    return out;
  };
  const gpName = (): Val => {
    // the referral is signed by the GP: name + his own line "praktický lékař, …" quoted verbatim
    const line = quoteFrom(/^praktick[ýa] l[ée]ka[řr],?\s.+$/mi, true);
    if (line) return val({ ...line, text: `${c.referringGp.name}, ${line.text}` });
    const text = `${c.referringGp.name}, ${c.referringGp.practice}`;
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
    if (l.startsWith('datum')) return [mdt ? { ...plain(fmtDate(mdt)), note: 'termín konzilia' } : { text: MISSING, missing: true }];
    if (l.startsWith('jm') || l.startsWith('meno')) return [isGp ? gpName() : nameVal()];
    if (l.startsWith('poji') || l.startsWith('pois')) return [insurerVal()];
    if (l.startsWith('telefon')) return isGp ? gpContact() : patientPhone();
    if (l.startsWith('adres')) return address();
    if (l.startsWith('váh') || l.startsWith('vah')) return weightHeight();
    if (l.startsWith('název') || l.startsWith('nazov')) {
      const f = fields.find(x => /diagn/i.test(x.key + ' ' + x.label) && !/k[óo]d|mkn|icd/i.test(x.key + ' ' + x.label));
      return vals(verbatimValues(c, f, asOf));
    }
    if (l.startsWith('kód') || l.startsWith('kod')) {
      const f = field(/mkn|icd|k[óo]d/i);
      if (f) return vals(verbatimValues(c, f, asOf));
      const dg = fields.find(x => /diagn/i.test(x.key + ' ' + x.label));
      // the code is only read out of the diagnosis quotes – a conflict about e.g. the lung lobe is not about the code (QA R5 #14)
      for (const r of verbatimValues(c, dg, asOf)) {
        const m = r.missing ? null : r.text.match(/\b[A-Z]\d{2}(?:\.\d)?\b/);
        if (m) return [val({ ...r, text: m[0], conflict: undefined, verbatim: false })];
      }
      return [val({ text: MISSING, missing: true })];
    }
    return [val({ text: MISSING, missing: true })];
  };

  /* --- section 5: table of exams, labs, histology (footnotes are numbered after sorting, so they follow reading order) --- */
  const known = (docId?: string, fallback?: ISODate) => { const d = docKnownAt(c, docId) ?? fallback ?? ''; return d <= asOf; };
  const examsField = field(/^exams$/i, /vyšetr|vysetr/i);
  const labsField = field(/^labs$/i, /labor/i);
  const quotesOf = (f: HandoverField | undefined, docId: string) => (f?.citations ?? []).filter(ci => ci.docId === docId);
  type Row = { iso: ISODate; cells: [string, string, Resolved] };
  const buildRows = (): Val[][] => {
    const rows: Row[] = [];
    for (const e of c.exams) {
      if (!known(e.docId, e.date)) continue;
      const text = textOf(e.docId);
      const what = titleLineOf(text) ?? e.type;
      // result = the report's own „ZÁVĚR“ verbatim; else a verbatim quote of the handover; else the summary (reference only)
      const concl = conclusionOf(text);
      const q = quotesOf(examsField, e.docId)[0];
      const result: Resolved = concl
        ? { text: concl, docId: e.docId, quote: concl, missing: false, verbatim: true }
        : q ? { text: oneLine(q.quote), docId: e.docId, quote: q.quote, missing: false, verbatim: true }
          : { text: e.summary, docId: e.docId, missing: false };
      rows.push({ iso: e.date, cells: [fmtDate(e.date), `${what} · ${e.place}`, result] });
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
      const text = textOf(first.docId);
      const what = titleLineOf(text) ?? 'Laboratoř';
      const qs = quotesOf(labsField, first.docId);
      if (qs.length) {
        // verbatim rows of the lab report (name, value, unit, reference range) as quoted in the handover
        const rest = g.length - qs.length;
        const cell: Resolved = {
          text: qs.map(q => oneLine(q.quote, ' ')).join('; ') + (rest > 0 ? `; dalších ${rest} hodnot v celé tabulce (v případu)` : ''),
          docId: first.docId, quote: qs[0].quote, missing: false,
        };
        rows.push({ iso: first.date, cells: [fmtDate(first.date), `${what} · ${first.lab}`, cell] });
        continue;
      }
      const show = g.filter(r => r.flag || /\bCA\s?\d|CEA|marker/i.test(r.test));
      const rest = g.length - show.length;
      const t = show.map(r => `${r.test} ${r.value}${r.unit ? ` ${r.unit}` : ''}${r.flag ? ` (${r.flag})` : ''}`).join(', ')
        + (rest > 0 ? `${show.length ? '; ' : ''}dalších ${rest} hodnot bez označení H/L (celá tabulka v případu)` : '');
      rows.push({ iso: first.date, cells: [fmtDate(first.date), `${what} · ${first.lab}`, { text: t, docId: first.docId, missing: false }] });
    }
    const histo = res(/histol/i);
    if (!histo[0].missing) {
      const row = rows.find(r => r.cells[2].docId === histo[0].docId);
      if (row) { if (histo[0].conflict) row.cells[2] = { ...row.cells[2], conflict: histo[0].conflict }; }
      else {
        const d = docById(c, histo[0].docId);
        rows.push({ iso: d?.examDate ?? asOf, cells: [fmtDate(d?.examDate), `Histologie · ${d?.place ?? ''}`, { ...histo[0], text: histo.map(h => h.text).join(' · ') }] });
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
      sec.list = members.map(m => val(plain(m), { source: `${TEMPLATE_SOURCE} · složení týmu pro nádory GIT` }));
      if (!members.length) sec.placeholder = 'Složení týmu doplní KOC.';
      return sec;
    }
    if (/komorb/.test(t)) {
      const fa = field(/liek|l[ée]kov|medik|^fa$|\(fa\)/i);
      const faVals = fa ? vals(verbatimValues(c, fa, asOf))
        : c.meds.length ? [val({ text: oneLine(c.meds[0].citation.quote), docId: c.meds[0].citation.docId, quote: c.meds[0].citation.quote, missing: false, verbatim: true })]
          : [val({ text: MISSING, missing: true })];
      sec.groups.push({ lines: [
        { label: 'Komorbidity', values: vals(res(/[ck]omorb|pridru|přidru/i, /^oa$|osobn[áa] anamn|\(oa\)/i)) },
        { label: 'Léková anamnéza', values: faVals },
        { label: 'Alergie', values: vals(res(/alerg|^aa$|\(aa\)/i)) },
      ] });
      // wishes of the patient (consent to share with the daughter, anxiety, request for a psychologist) – QA R5 #7
      const wishes = field(/^other$/i, /želani|přání|iné dôležité|jiná důležitá/i);
      if (wishes) sec.groups.push({ heading: 'Doplněno nad rámec šablony', lines: [{ label: 'Přání pacienta a sociální situace', values: vals(verbatimValues(c, wishes, asOf)) }] });
      return sec;
    }
    if (/výsledk|vysledk/.test(t)) {
      sec.table = { head: ts.items.map(i => i.label), rows: buildRows() };
      sec.groups.push({ lines: [
        { label: 'Celkový stav', values: vals(res(/sympt|pr[íi]zn/i)) },
        { label: 'Stav výkonnosti (ECOG)', values: vals(res(/ecog|v[ýy]konn|karnof|performance/i)) },
      ] });
      // an announced addendum that has not arrived is missing, not "0 není v dokumentaci" (QA R5 #3: EGFR, ALK, ROS1, PD-L1)
      const addenda = c.steps.filter(st => /dodatok|dodatek/i.test(st.title) && stepStateAt(st, asOf) !== null && stepStateAt(st, asOf) !== 'delivered');
      if (addenda.length) {
        sec.groups.push({ heading: 'Avizováno, ještě nedorazilo', lines: addenda.map(st => ({ label: st.title, values: [{ text: MISSING, missing: true, note: 'avizováno, nedorazilo' }] })) });
      }
      return sec;
    }
    if (/závěr|zaver|doporuč|doporuc/.test(t)) {
      sec.placeholder = mdt ? `Doplní konzilium na jednání ${fmtDate(mdt)}.` : 'Doplní konzilium na jednání (termín ještě není určen).';
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
      const r = verbatimValues(c, q, asOf);
      if (q && !r[0].missing) {
        sec.groups.unshift({ heading: 'Otázka praktika pro konzilium · doplněno nad rámec šablony', lines: [{ label: 'Otázka', values: vals(r) }] });
      }
    }
    return sec;
  });

  /* --- stats --- */
  let values = 0, cited = 0, missing = 0, conflicts = 0;
  const missingLabels: string[] = [];
  const count = (v: Val, label?: string) => {
    values++;
    if (v.n) cited++;
    if (v.conflict) conflicts++;
    if (v.missing) { missing++; if (label) missingLabels.push(label); }
  };
  for (const s of sections) {
    s.groups.forEach(g => g.lines.forEach(l => l.values.forEach(v => count(v, `${v.prefix ?? l.label}${g.heading && !/šablon|nedorazilo/i.test(g.heading) ? ` (${g.heading.toLowerCase()})` : ''}`))));
    s.table?.rows.forEach(r => count(r[2]));
  }
  // Reports received after the MDT date are never part of the handover (no foretelling of what will arrive).
  const omittedDocs = c.docs.filter(d => (d.receivedAt ?? d.examDate) > (mdt ?? asOf));

  const proposed = fields.filter(f => f.status === 'proposed' && verbatimValues(c, f, asOf)[0].missing === false).length;
  const quoted = notes.filter(n => n.quote).length;
  const refs = notes.filter(n => !n.quote && n.docId).length;
  const template = notes.length - quoted - refs;
  return { title: tpl.title, mdtDate: mdt, asOf, sections, notes, omittedDocs, stats: { values, cited, missing, conflicts, missingLabels, proposed, quoted, refs, template } };
}

/* ---------- plain text (for „Kopírovat sekci“ and the clipboard) ---------- */

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
    for (const n of g.notes) out.push(`  [${n.n}] ${n.quote ? (n.verbatim ? 'doslovně ze zprávy (věta je uvedena v podkladu)' : `„${oneLine(n.quote, ' ')}“`) : n.docId ? 'shrnutí zprávy (bez doslovného citátu)' : 'převzato ze vzoru'}`);
  }
  return out.join('\n');
}

export function documentText(m: MdtModel): string {
  return [m.title, `${m.mdtDate ? `Konzilium ${fmtDate(m.mdtDate)} · ` : ''}údaje známé k ${fmtDate(m.asOf)}`, '', ...m.sections.map(sectionText).flatMap(s => [s, '']), notesText(m.notes)].join('\n');
}
