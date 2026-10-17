// Karta „Na kontrolnej sade“ – numbers come ONLY from measured data: `EVAL_SUMMARY` exported by a module in
// src/data (optional, read through import.meta.glob) or, when that is missing, from public/data/eval-<case>.json.
// No fallback numbers anywhere: without data the card (and the metric tile) is hidden.
import { useEffect, useMemo, useState } from 'react';
import { EVAL_SUMMARY } from '../../data/cases';
import { fmtDate } from './caseUtils';

/** The honest note from the measurement itself (eval/README → EVAL_SUMMARY.caveats): rules were tuned on these patients. */
export const EVAL_CAVEAT: string | undefined = EVAL_SUMMARY?.caveats?.[0];
import { Card, Pill } from './ui';
import { IcAlert, IcCheck } from './icons';

export interface EvalInfo {
  fieldsCorrect: number; fieldsTotal: number;
  trapsCaught: number; trapsTotal: number;
  inventedValues: number;
  citationsVerified: number; citationsTotal: number;
  traps: { id: string; title: string; why?: string; caught: boolean }[];
  mode?: string; model?: string | null;
  generatedAt?: string;            // of the measurement
  extractionGeneratedAt?: string;  // of the extraction that was measured
  headline?: string;
}

/* ---------- tolerant reader ---------- */
function isObj(x: unknown): x is Record<string, unknown> { return !!x && typeof x === 'object'; }
const num = (x: unknown): number | undefined => (typeof x === 'number' && Number.isFinite(x) ? x : undefined);
const str = (x: unknown): string | undefined => (typeof x === 'string' ? x : undefined);

/** Accepts the eval JSON ({summary, traps, extraction, …}), a flat summary, a record keyed by case id or an array of either. */
export function toEvalInfo(raw: unknown, caseId: string): EvalInfo | null {
  if (!raw) return null;
  if (Array.isArray(raw)) {
    const hit = raw.find((r) => isObj(r) && (r.caseId === caseId || r.id === caseId || r.case === caseId)) ?? (raw.length === 1 ? raw[0] : undefined);
    return hit ? toEvalInfo(hit, caseId) : null;
  }
  if (!isObj(raw)) return null;
  // generated module (src/data/eval.gen.ts): { cases: [{ caseId, evalCaseId, fieldsCorrect, … }] }
  if (Array.isArray(raw.cases)) {
    const hit = raw.cases.find((r) => isObj(r) && (r.caseId === caseId || r.evalCaseId === caseId));
    return hit ? toEvalInfo({ ...(hit as Record<string, unknown>), caseId }, caseId) : null;
  }
  const summary = isObj(raw.summary) ? raw.summary : num(raw.fieldsTotal) !== undefined ? raw : undefined;
  if (!summary) {
    const byId = raw[caseId];
    return byId !== undefined ? toEvalInfo(byId, caseId) : null;
  }
  const own = str(raw.caseId) ?? str(raw.id);
  if (own && own !== caseId && !(caseId === 'novak' && own === 'pacient-2')) return null;
  if (summary.goldIntegrity === false) return null; // the gold set was tampered with – no numbers
  const fieldsCorrect = num(summary.fieldsCorrect), fieldsTotal = num(summary.fieldsTotal);
  const trapsCaught = num(summary.trapsCaught), trapsTotal = num(summary.trapsTotal);
  const inventedValues = num(summary.inventedValues);
  const citationsVerified = num(summary.citationsVerified), citationsTotal = num(summary.citationsTotal);
  if ([fieldsCorrect, fieldsTotal, trapsCaught, trapsTotal, inventedValues, citationsVerified, citationsTotal].some((x) => x === undefined)) return null;
  const trapsRaw = Array.isArray(raw.traps) ? raw.traps : Array.isArray(summary.traps) ? summary.traps : [];
  const traps = trapsRaw.filter(isObj).map((t, i) => ({
    id: str(t.id) ?? String(i), title: str(t.title) ?? str(t.name) ?? `pasca ${i + 1}`, why: str(t.why), caught: t.caught === true,
  }));
  const ex = isObj(raw.extraction) ? raw.extraction : undefined;
  return {
    fieldsCorrect: fieldsCorrect!, fieldsTotal: fieldsTotal!, trapsCaught: trapsCaught!, trapsTotal: trapsTotal!,
    inventedValues: inventedValues!, citationsVerified: citationsVerified!, citationsTotal: citationsTotal!, traps,
    mode: str(ex?.mode) ?? str(raw.mode), model: ex ? (str(ex.model) ?? null) : str(raw.model) ?? null,
    generatedAt: str(raw.generatedAt) ?? str(raw.measuredAt), extractionGeneratedAt: str(ex?.generatedAt) ?? str(raw.extractionGeneratedAt),
    headline: str(raw.headline),
  };
}

/* ---------- sources ---------- */
// Optional module from the data agent: any src/data/*.ts that exports EVAL_SUMMARY.
const dataModules = import.meta.glob<Record<string, unknown>>('../../data/*.ts', { eager: true });
function fromDataModule(caseId: string): EvalInfo | null {
  for (const m of Object.values(dataModules)) {
    const v = isObj(m) ? m.EVAL_SUMMARY : undefined;
    if (v !== undefined) {
      const info = toEvalInfo(v, caseId);
      if (info) return info;
    }
  }
  return null;
}

const jsonCache = new Map<string, Promise<unknown>>();
function loadJson(file: string): Promise<unknown> {
  if (!jsonCache.has(file)) {
    jsonCache.set(file, fetch(`${import.meta.env.BASE_URL}${file}`)
      .then((r) => (r.ok ? (r.json() as Promise<unknown>) : null))
      .catch(() => null));
  }
  return jsonCache.get(file)!;
}

/** undefined = still loading, null = no measurement for this case. */
export function useEvalInfo(caseId: string, file?: string): EvalInfo | null | undefined {
  const fromModule = useMemo(() => fromDataModule(caseId), [caseId]);
  const [fetched, setFetched] = useState<EvalInfo | null | undefined>(undefined);
  useEffect(() => {
    if (fromModule) return;
    let on = true;
    loadJson(file ?? `data/eval-${caseId}.json`).then((j) => { if (on) setFetched(toEvalInfo(j, caseId)); });
    return () => { on = false; };
  }, [caseId, file, fromModule]);
  return fromModule ?? fetched;
}

export interface HalluTest { proposals: number; accepted: number; rejected: number; invented?: number; generatedAt?: string }
/** Test „poistky“: deliberately wrong AI answer (public/data/vysledok-test-halucinacii.json, copied from eval/). Hidden when missing. */
export function useHalluTest(): HalluTest | null | undefined {
  const [v, setV] = useState<HalluTest | null | undefined>(undefined);
  useEffect(() => {
    let on = true;
    loadJson('data/vysledok-test-halucinacii.json').then((j) => {
      if (!on) return;
      if (!isObj(j)) { setV(null); return; }
      const proposals = num(j.aiProposals), accepted = num(j.accepted), rejected = num(j.rejected);
      if (proposals === undefined || accepted === undefined || rejected === undefined) { setV(null); return; }
      const es = isObj(j.evalSummary) ? j.evalSummary : undefined;
      setV({ proposals, accepted, rejected, invented: es ? num(es.inventedValues) : undefined, generatedAt: str(j.generatedAt) });
    });
    return () => { on = false; };
  }, []);
  return v;
}

/* ---------- labels ---------- */
const pl = (n: number, one: string, few: string, many: string) => (n === 1 ? one : n >= 2 && n <= 4 ? few : many);
/** One wording of the guard test for the queue and the case (QA R5 #5): what was rejected, what was accepted and why. */
export function halluLine(h: { proposals: number; accepted: number; rejected: number; invented?: number }): string {
  return `Test poistky: úmyselne chybný model navrhol ${h.proposals} ${pl(h.proposals, 'hodnotu', 'hodnoty', 'hodnôt')}. `
    + `${h.rejected} ${pl(h.rejected, 'vymyslenú', 'vymyslené', 'vymyslených')} (čísla bez opory v správe) program zamietol`
    + (h.accepted ? `, ${h.accepted} ${pl(h.accepted, 'pravdivú', 'pravdivé', 'pravdivých')} (citát aj čísla sedia) prijal` : '')
    + (h.invented !== undefined ? ` → v podklade ${h.invented} ${pl(h.invented, 'vymyslená hodnota', 'vymyslené hodnoty', 'vymyslených hodnôt')}.` : '.');
}
export function evalLine(e: EvalInfo): string {
  return `${e.fieldsCorrect}/${e.fieldsTotal} polí správne · ${e.trapsCaught}/${e.trapsTotal} pascí zachytených · ${e.inventedValues} ${pl(e.inventedValues, 'vymyslená hodnota', 'vymyslené hodnoty', 'vymyslených hodnôt')}`;
}
export function modeLabel(e: EvalInfo): string {
  if (e.mode === 'rules') return 'pravidlá, bez jazykového modelu';
  if (e.mode === 'rules+llm' || e.mode === 'llm') {
    return /náhrad/i.test(e.model ?? '') ? 'pravidlá + jazykový model · odpoveď vygeneroval Claude na presne ten istý pseudonymizovaný prompt (v prevádzke Azure OpenAI EU)' : `pravidlá + jazykový model${e.model ? ` · ${e.model}` : ''}`;
  }
  return e.mode ?? '';
}
const dateOf = (iso?: string) => (iso ? fmtDate(iso.slice(0, 10)) : '');

/* ---------- card ---------- */
export function EvalCard({ info, docsCount, manual = true }: { info: EvalInfo; docsCount?: number; manual?: boolean }) {
  const hallu = useHalluTest();
  const [open, setOpen] = useState(false);
  return (
    <Card className="cs-eval" title="Meranie na 2 fiktívnych pacientoch" aside={
      <span className="cs-eval-aside"><Pill tone="mint"><IcCheck size={13} /> namerané</Pill>{info.generatedAt && <span className="cs-hint">{dateOf(info.generatedAt)}</span>}</span>
    }>
      <div className="cs-eval-stats">
        <div className="cs-eval-stat"><strong>{info.fieldsCorrect}<span>/{info.fieldsTotal}</span></strong><em>polí správne</em></div>
        <div className="cs-eval-stat"><strong>{info.trapsCaught}<span>/{info.trapsTotal}</span></strong><em>pascí zachytených</em></div>
        <div className="cs-eval-stat"><strong>{info.inventedValues}</strong><em>{pl(info.inventedValues, 'vymyslená hodnota', 'vymyslené hodnoty', 'vymyslených hodnôt')}</em></div>
        <div className="cs-eval-stat"><strong>{info.citationsVerified}<span>/{info.citationsTotal}</span></strong><em>citátov doslova v správach</em></div>
      </div>
      <p className="cs-eval-note">
        Meria sa strojové vyťaženie {docsCount ? `tých istých ${docsCount} správ` : 'tých istých správ'} oproti ručne overenej zlatej sade
        ({modeLabel(info) || 'predpočítané'}). Citáty overuje program, nie AI.
        {manual ? ' Na obrazovke je ručne overená verzia podkladu.' : ''}
      </p>
      {EVAL_CAVEAT && <p className="cs-eval-note cs-eval-caveat"><strong>Poctivo:</strong> {EVAL_CAVEAT}</p>}
      {hallu && (
        <div className="cs-eval-hallu">
          <IcAlert size={15} />
          <span>{halluLine(hallu)}</span>
        </div>
      )}
      {info.traps.length > 0 && (
        <div className="cs-eval-traps">
          <button type="button" className="cs-eval-toggle" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
            {open ? 'Skryť pasce' : `Ktoré pasce? (${info.traps.length})`}
          </button>
          {open && (
            <ul>
              {info.traps.map((t) => (
                <li key={t.id} className={t.caught ? 'is-ok' : 'is-bad'} title={t.why}>
                  {t.caught ? <IcCheck size={14} /> : <IcAlert size={14} />}<span>{t.title}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Card>
  );
}
