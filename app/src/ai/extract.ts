// Handover extractor: rules + (optional) LLM, with every quote verified against the original reports.
// Output: HandoverField[] in the shape of src/types.ts, plus findings ("pasce"), referral pre-check, labs, exams, meds.
//
// Pipeline
//   1. as-of filter: only reports dated on or before the MDT date are used (later ones are listed as excluded)
//   2. rules: header, contacts, weight/height, lab tables, exam conclusions, histology, allergies, medications
//   3. LLM (optional): drafts the free-text fields on pseudonymized text; each quote is located in the report,
//      numbers in the value must appear in the verified quotes, otherwise the proposal is rejected → rule fallback
//   4. trap detectors: impossible dates, missing ECOG/e-mails, planned controls without a report, post-MDT reports
//   5. final pass: every citation must be verbatim in its report; counts go to meta.stats
import type { Citation, Exam, HandoverField, ISODate, LabRow, Medication } from '../types.ts';
import { FIELD_SPECS, type FieldSpec } from './fields.ts';
import { parseJsonAnswer, requestHash, type Complete } from './llm.ts';
import * as N from './narrative.ts';
import { buildRequest, PROMPT_VERSION } from './prompt.ts';
import { Pseudonymizer } from './pseudo.ts';
import * as R from './rules.ts';
import { czDate, fold, isVerbatim, locateQuote, numbersIn } from './text.ts';

/** Free-text fields drafted by the LLM (the rest is read by rules). */
export const LLM_KEYS = ['diagnosis', 'epicrisis', 'mdtQuestion', 'symptoms', 'otherNotes'];

export interface ExtractOptions {
  caseId: string;
  docs: R.Doc[];
  asOf: ISODate;                // MDT date: nothing newer may enter the handover
  complete?: Complete;          // LLM; when absent the extractor runs rules only
  llmKeys?: string[];
  generatedAt?: string;
  log?: (msg: string) => void;
}

export interface Provenance {
  extractor: 'rules' | 'llm';
  checkedQuotes: number;
  verifiedQuotes: number;
  rejected: { docId: string; quote: string; reason: string }[];
  llmNote?: string;             // why an LLM proposal was not used
  support?: number;             // share of value words found in the verified quotes (LLM fields)
}

export interface ExtractionResult {
  meta: {
    caseId: string;
    asOf: ISODate;
    generatedAt: string;
    promptVersion: string;
    mode: 'rules' | 'rules+llm';
    model?: string;
    requestHash?: string;
    llmError?: string;
    docsUsed: string[];
    docsExcluded: { id: string; date: ISODate; reason: string }[];
    stats: {
      fields: number; withValue: number; missing: number; conflicts: number;
      citations: number; citationsVerified: number; fieldsWithoutVerifiedCitation: number;
      llmFieldsAccepted: number; llmFieldsRejected: number;
    };
  };
  fields: HandoverField[];
  provenance: Record<string, Provenance>;
  findings: R.Finding[];
  precheck: { findings: { text: string; severity: 'missing' | 'info' }[] };
  labs: LabRow[];
  exams: Exam[];
  meds: Medication[];
  referringGp?: { name: string; phone?: string; email?: string; citations: Citation[] };
}

interface Draft extends R.RuleField { prov: Provenance }

function draft(rule: R.RuleField, extractor: 'rules' | 'llm' = 'rules'): Draft {
  return { ...rule, prov: { extractor, checkedQuotes: rule.citations.length, verifiedQuotes: rule.citations.length, rejected: [] } };
}

function padId(id: unknown): string {
  const s = String(id ?? '').trim().replace(/^Zpráva\s*/i, '');
  return /^\d$/.test(s) ? `0${s}` : s;
}

function words(s: string): string[] {
  return fold(s).toLocaleLowerCase('cs').split(/[^a-záčďéěíňóřšťúůýž0-9]+/i).filter((w) => w.length >= 5);
}

interface RawCitation { docId: string; quote: string }

function rawCitations(x: unknown): RawCitation[] {
  if (!Array.isArray(x)) return [];
  return x.flatMap((c) => {
    const o = c as { docId?: unknown; quote?: unknown };
    return typeof o?.quote === 'string' ? [{ docId: padId(o.docId), quote: o.quote }] : [];
  });
}

/** Check one LLM proposal. Returns a verified draft or the reason for rejection. */
function verifyLlmField(
  raw: Record<string, unknown>, docsById: Map<string, R.Doc>, excludedIds: Set<string>, pseudo: Pseudonymizer,
): { ok: Draft } | { reason: string; rejected: Provenance['rejected'] } {
  const status = raw.status === 'missing' || raw.status === 'conflict' ? raw.status : 'proposed';
  const value = pseudo.restore(typeof raw.value === 'string' ? raw.value : '').trim();
  const note = typeof raw.note === 'string' && raw.note.trim() ? pseudo.restore(raw.note.trim()) : undefined;
  const rejected: Provenance['rejected'] = [];

  const check = (c: RawCitation): Citation | null => {
    const quote = pseudo.restore(c.quote);
    if (excludedIds.has(c.docId)) { rejected.push({ docId: c.docId, quote, reason: 'správa je po dátume konzília' }); return null; }
    const doc = docsById.get(c.docId);
    if (!doc) { rejected.push({ docId: c.docId, quote, reason: 'neznáma správa' }); return null; }
    if (/…|\.\.\./.test(quote)) { rejected.push({ docId: c.docId, quote, reason: 'citát s vynechávkou' }); return null; }
    const exact = locateQuote(doc.text, quote);
    if (!exact) { rejected.push({ docId: c.docId, quote, reason: 'citát sa v správe nenašiel' }); return null; }
    return { docId: c.docId, quote: exact };
  };

  const raws = rawCitations(raw.citations);
  const citations = raws.map(check).filter((c): c is Citation => c !== null);
  const prov: Provenance = { extractor: 'llm', checkedQuotes: raws.length, verifiedQuotes: citations.length, rejected };

  if (status === 'missing') {
    if (value) return { reason: 'stav „chýba“, ale s hodnotou', rejected };
    return { ok: { value: '', citations: [], status: 'missing', note, prov } };
  }
  if (!value) return { reason: 'prázdna hodnota', rejected };
  if (!citations.length) return { reason: 'žiadny overený citát', rejected };

  const quoteText = citations.map((c) => c.quote).join(' ');
  const quoteNums = new Set(numbersIn(quoteText));
  const unsupported = numbersIn(value).filter((n) => !quoteNums.has(n));
  if (unsupported.length) return { reason: `čísla bez opory v citáte: ${[...new Set(unsupported)].join(', ')}`, rejected };

  const vw = words(value);
  const qw = new Set(words(quoteText));
  const support = vw.length ? vw.filter((w) => qw.has(w)).length / vw.length : 1;
  prov.support = Math.round(support * 100) / 100;
  if (support < 0.5) return { reason: `text má slabú oporu v citátoch (${Math.round(support * 100)} %)`, rejected };

  let conflict: R.RuleField['conflict'];
  if (status === 'conflict' && raw.conflict && typeof raw.conflict === 'object') {
    const c = raw.conflict as { a?: { value?: unknown; citation?: unknown }; b?: { value?: unknown; citation?: unknown }; explain?: unknown };
    const ca = c.a?.citation ? check({ docId: padId((c.a.citation as RawCitation).docId), quote: String((c.a.citation as RawCitation).quote ?? '') }) : null;
    const cb = c.b?.citation ? check({ docId: padId((c.b.citation as RawCitation).docId), quote: String((c.b.citation as RawCitation).quote ?? '') }) : null;
    if (ca && cb) {
      conflict = {
        a: { value: pseudo.restore(String(c.a?.value ?? ca.quote)), citation: ca },
        b: { value: pseudo.restore(String(c.b?.value ?? cb.quote)), citation: cb },
        explain: pseudo.restore(String(c.explain ?? 'Dve správy uvádzajú rôzne údaje.')),
      };
    }
  }
  return { ok: { value, citations, status: conflict ? 'conflict' : 'proposed', note, conflict, prov } };
}

export async function extractHandover(opts: ExtractOptions): Promise<ExtractionResult> {
  const log = opts.log ?? (() => {});
  const asOf = opts.asOf;
  const all = [...opts.docs].sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
  const included = all.filter((d) => d.date <= asOf);
  const excluded = all.filter((d) => d.date > asOf);
  const docsById = new Map(included.map((d) => [d.id, d]));
  const findings: R.Finding[] = [];

  // ---- 2. rules ----
  const id = R.identity(included);
  const patientLabel = id ? `${id.firstName.value} ${id.lastName.value}` : 'pacient';
  const contact = R.contacts(included);
  findings.push(...contact.findings);
  const ps = R.performanceStatus(included, patientLabel, asOf);
  if (ps.finding) findings.push(ps.finding);
  const med = R.medications(included);
  const lab = R.labsField(included);
  const ex = R.examsField(included);

  const drafts: Record<string, Draft> = {
    firstName: draft(id?.firstName ?? { value: '', citations: [], status: 'missing', note: 'Meno nie je uvedené.' }),
    lastName: draft(id?.lastName ?? { value: '', citations: [], status: 'missing', note: 'Priezvisko nie je uvedené.' }),
    age: draft(id?.age ?? { value: '', citations: [], status: 'missing' }),
    sex: draft(id?.sex ?? { value: '', citations: [], status: 'missing' }),
    insurer: draft(id?.insurer ?? { value: '', citations: [], status: 'missing' }),
    patientContact: draft(contact.patientContact),
    contactPerson: draft(contact.contactPerson),
    diagnosis: draft(N.diagnosisFallback(included)),
    epicrisis: draft(N.epicrisisFallback(included)),
    mdtQuestion: draft(N.mdtQuestionFallback(included)),
    comorbidities: draft(R.comorbidities(included)),
    medications: draft(med.field),
    allergies: draft(R.allergies(included)),
    performanceStatus: draft(ps.field),
    weightHeight: draft(R.weightHeight(included, excluded, asOf)),
    symptoms: draft(N.symptomsFallback(included)),
    exams: draft(ex.field),
    labs: draft(lab.field),
    histology: draft(R.histologyField(included)),
    otherNotes: draft(N.otherNotesFallback(included)),
  };

  // ---- 3. LLM ----
  let model: string | undefined;
  let hash: string | undefined;
  let llmError: string | undefined;
  let accepted = 0;
  let rejectedCount = 0;
  const llmKeys = opts.llmKeys ?? LLM_KEYS;
  if (opts.complete && llmKeys.length) {
    const pseudo = new Pseudonymizer();
    if (id) pseudo.addName(patientLabel, 'PACIENT');
    const cpName = contact.contactPerson.value.match(/^([A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ][a-záčďéěíňóřšťúůýž]+ [A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ][a-záčďéěíňóřšťúůýž]+)/);
    if (cpName) pseudo.addName(cpName[1], 'KONTAKT');
    const specs = llmKeys.map((k) => FIELD_SPECS.find((s) => s.key === k)).filter((s): s is FieldSpec => !!s);
    const req = buildRequest(included.map((d) => ({ id: d.id, date: d.date, text: pseudo.apply(d.text) })), specs, asOf);
    hash = await requestHash(req);
    try {
      log(`LLM: posielam ${included.length} pseudonymizovaných správ (${specs.length} polí), kľúč požiadavky ${hash}`);
      const res = await opts.complete(req);
      model = res.model;
      const parsed = parseJsonAnswer(res.text) as { fields?: unknown };
      const list = Array.isArray(parsed.fields) ? (parsed.fields as Record<string, unknown>[]) : [];
      const excludedIds = new Set(excluded.map((d) => d.id));
      for (const key of llmKeys) {
        const raw = list.find((f) => f?.key === key);
        if (!raw) { drafts[key].prov.llmNote = 'AI pole nevrátila – použité pravidlá'; rejectedCount++; continue; }
        const v = verifyLlmField(raw, docsById, excludedIds, pseudo);
        if ('ok' in v) {
          // LLM says "missing" but rules found verified text → keep the verified text
          if (v.ok.status === 'missing' && drafts[key].citations.length) {
            drafts[key].prov.llmNote = 'AI označila ako chýbajúce, pravidlá našli overený text – ponechaný text';
            rejectedCount++;
          } else { drafts[key] = v.ok; accepted++; }
        } else {
          drafts[key].prov.llmNote = `AI návrh zamietnutý: ${v.reason} – použitý text priamo zo správy`;
          drafts[key].prov.rejected = v.rejected;
          rejectedCount++;
        }
      }
    } catch (e) {
      llmError = e instanceof Error ? e.message : String(e);
      log(`LLM nedostupné (${llmError}) – pokračujem len s pravidlami`);
    }
  }

  // ---- 4. trap detectors ----
  for (const c of R.impossibleDates(included)) {
    const histo = R.docKind(c.doc) === 'histology';
    const target = histo ? 'histology' : /(dávk|vysaz)/i.test(c.event.quote) ? 'medications' : undefined;
    const line = c.doc.text.split(/\r?\n/).find((l) => l.includes(c.event.quote))?.trim() ?? c.event.quote;
    const a: Citation = { docId: c.doc.id, quote: locateQuote(c.doc.text, line) ?? c.event.quote };
    const b: Citation = { docId: c.doc.id, quote: c.issued.quote };
    let explain: string;
    if (histo) {
      const proc = included.find((d) => R.docKind(d) === 'procedure' && d.date <= c.issued.iso);
      explain = `Materiál má dátum odberu ${czDate(c.event.iso)}, ale správa bola vydaná ${czDate(c.issued.iso)}${proc ? ` a biopsia prebehla ${czDate(proc.date)} (správa ${proc.id})` : ''}. Pravdepodobne preklep – overte s patológiou.`;
    } else if (target === 'medications') {
      explain = `Posledná dávka je zapísaná na ${czDate(c.event.iso)}, teda po dátume výkonu ${czDate(c.issued.iso)}. Dátum je nemožný – overte s pracoviskom, kedy bol liek naozaj vysadený.`;
    } else {
      explain = `Udalosť z ${czDate(c.event.iso)} je zapísaná v správe vydanej ${czDate(c.issued.iso)} – dátum je nemožný.`;
    }
    findings.push({ id: `date-conflict-${c.doc.id}`, severity: 'conflict', fieldKey: target, text: explain, citations: [a, b] });
    if (target && !drafts[target].conflict) {
      drafts[target].status = 'conflict';
      drafts[target].conflict = { a: { value: c.event.quote, citation: a }, b: { value: c.issued.quote, citation: b }, explain };
    }
  }
  findings.push(...R.plannedButMissing(included, asOf));
  if (excluded.length) {
    findings.push({
      id: 'after-mdt', severity: 'info',
      text: `Správy ${excluded.map((d) => d.id).join(', ')} vznikli po ${czDate(asOf)} – do podkladu pre konzílium nepatria (zadanie VZP: len to, čo bolo známe k dátumu konzília).`,
      citations: [],
    });
  }
  const gp = R.referringDoctor(included);
  if (gp) findings.push(...gp.findings);
  const referral = included.filter((d) => R.docKind(d) === 'referral').sort((a, b) => b.date.localeCompare(a.date))[0];
  const pre = referral ? R.referralPrecheck(referral) : [];
  for (const f of pre) if (f.severity === 'missing' && !findings.some((x) => x.id === f.id)) findings.push(f);

  // ---- 5. final verification and assembly ----
  const fields: HandoverField[] = [];
  let citationsTotal = 0;
  let citationsVerified = 0;
  let noCitation = 0;
  for (const spec of FIELD_SPECS) {
    const d = drafts[spec.key];
    const keep = (c: Citation) => { citationsTotal++; const doc = docsById.get(c.docId); const ok = !!doc && isVerbatim(doc.text, c.quote); if (ok) citationsVerified++; return ok; };
    const citations = d.citations.filter(keep);
    let conflict = d.conflict;
    if (conflict && !(keep(conflict.a.citation) && keep(conflict.b.citation))) conflict = undefined;
    let status: HandoverField['status'] = d.status ?? 'proposed';
    if (status === 'conflict' && !conflict) status = 'proposed';
    let note = d.note;
    if (status !== 'missing' && d.value && !citations.length) {
      noCitation++;
      note = [note, 'Bez overeného citátu – nezobrazovať ako fakt, overiť ručne.'].filter(Boolean).join(' ');
    }
    fields.push({
      key: spec.key, label: spec.label, group: spec.group,
      value: status === 'missing' ? '' : d.value,
      status, citations: status === 'missing' ? [] : citations,
      sourceDate: d.sourceDate, note, conflict, request: d.request,
    });
  }

  const provenance: Record<string, Provenance> = {};
  for (const spec of FIELD_SPECS) provenance[spec.key] = drafts[spec.key].prov;

  const uniq = new Map<string, R.Finding>();
  for (const f of findings) if (!uniq.has(f.id)) uniq.set(f.id, f);

  return {
    meta: {
      caseId: opts.caseId,
      asOf,
      generatedAt: opts.generatedAt ?? new Date().toISOString(),
      promptVersion: PROMPT_VERSION,
      mode: opts.complete && !llmError ? 'rules+llm' : 'rules',
      model, requestHash: hash, llmError,
      docsUsed: included.map((d) => d.id),
      docsExcluded: excluded.map((d) => ({ id: d.id, date: d.date, reason: `po dátume konzília ${czDate(asOf)}` })),
      stats: {
        fields: fields.length,
        withValue: fields.filter((f) => f.status !== 'missing').length,
        missing: fields.filter((f) => f.status === 'missing').length,
        conflicts: fields.filter((f) => f.status === 'conflict').length,
        citations: citationsTotal, citationsVerified, fieldsWithoutVerifiedCitation: noCitation,
        llmFieldsAccepted: accepted, llmFieldsRejected: rejectedCount,
      },
    },
    fields,
    provenance,
    findings: [...uniq.values()],
    precheck: { findings: pre.map((f) => ({ text: f.text, severity: f.severity === 'info' ? 'info' : 'missing' })) },
    labs: lab.labs,
    exams: ex.exams,
    meds: med.meds,
    referringGp: gp ? { name: gp.name, phone: gp.phone, email: gp.email, citations: gp.citations } : undefined,
  };
}
