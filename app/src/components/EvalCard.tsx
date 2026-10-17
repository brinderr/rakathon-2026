// Karta „Kontrola přesnosti“: čísla JEN z public/data/eval-*.json (měření strojového vytěžení na kontrolní sadě).
// Žádné číslo není v kódu napevno. Bez souboru nebo bez celistvé zlaté sady se řádek nezobrazí.
// Volitelná část „Test pojistky“ čte public/data/vysledok-test-halucinacii.json (pokud je zkopírován z eval/).
// Na frontě se karta už nezobrazuje (rozhodnutí kapitána 17. 10.); zůstává pro záložku Podklad / pitch.
import { useEffect, useState, type ReactNode } from 'react';
import { Card, Icon, Pill, pluralWord } from './ui';
import { EVAL_CAVEAT, halluLine } from './case/EvalCard';
import './EvalCard.css';

interface EvalSummary {
  fieldsCorrect: number; fieldsTotal: number; trapsCaught: number; trapsTotal: number; inventedValues: number;
  citationsVerified: number; citationsTotal: number; fieldsWithoutVerifiedCitation: number; goldIntegrity: boolean;
}
interface EvalJson {
  caseId?: string;
  generatedAt: string;
  extraction: { mode: 'rules' | 'rules+llm'; model: string | null; generatedAt: string };
  summary: EvalSummary;
  traps: { id: string; title: string; why: string; caught: boolean }[];
}
interface GuardJson {
  what: string; generatedAt: string; aiProposals: number; accepted: number; rejected: number;
  evalSummary?: { inventedValues?: number };
  fields: { field: string; aiValue: string; accepted: boolean; reason: string }[];
}

const cache = new Map<string, Promise<unknown>>();
function loadJson<T>(file: string): Promise<T | null> {
  if (!cache.has(file)) {
    cache.set(file, fetch(`${import.meta.env.BASE_URL}${file}`)
      .then((r) => (r.ok ? (r.json() as Promise<unknown>) : null))
      .catch(() => null));
  }
  return cache.get(file)! as Promise<T | null>;
}
function useJson<T>(file: string | undefined): T | null {
  const [v, setV] = useState<T | null>(null);
  useEffect(() => {
    if (!file) return;
    let on = true;
    loadJson<T>(file).then((j) => { if (on) setV(j); });
    return () => { on = false; };
  }, [file]);
  return v;
}

function modeLabel(e: EvalJson['extraction']): string {
  if (e.mode === 'rules') return 'pravidla, bez jazykového modelu';
  if (/náhrada/i.test(e.model ?? '')) return 'pravidla + jazykový model · odpověď vygeneroval Claude na přesně tentýž pseudonymizovaný prompt (v provozu Azure OpenAI EU)';
  return `pravidla + jazykový model${e.model ? ` · ${e.model}` : ''}`;
}
function fmtStamp(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`;
}

export interface EvalRow { name: string; sub?: string; file: string; expectGeneratedAt?: string }

function Row({ row, full, onLoaded }: { row: EvalRow; full: boolean; onLoaded: (ev: EvalJson | null) => void }) {
  const ev = useJson<EvalJson>(row.file);
  useEffect(() => { onLoaded(ev); }, [ev, onLoaded]);
  if (!ev || ev.summary?.goldIntegrity !== true) return null;             // nikdy záložní čísla
  const s = ev.summary;
  const stale = !!row.expectGeneratedAt && ev.extraction.generatedAt !== row.expectGeneratedAt;
  return (
    <div className="ev-row">
      <div className="ev-who">{row.name}{row.sub && <span className="ev-sub"> · {row.sub}</span>}</div>
      {stale ? (
        <div className="ev-stale">Měření patří k jiné verzi vytěžení – spustit npm run eval.</div>
      ) : (
        <>
          <div className="ev-nums">
            <span><b>{s.fieldsCorrect}/{s.fieldsTotal}</b> polí správně</span>
            <span><b>{s.trapsCaught}/{s.trapsTotal}</b> {full ? 'pastí zachyceno' : 'pastí'}</span>
            <span><b>{s.inventedValues}</b> {full ? pluralWord(s.inventedValues, 'vymyšlená hodnota', 'vymyšlené hodnoty', 'vymyšlených hodnot') : 'vymyšlených'}</span>
            <span><b>{s.citationsVerified}/{s.citationsTotal}</b> {full ? 'citátů doslova ve zprávách' : 'citátů doslova'}</span>
          </div>
          {full && ev.traps?.length > 0 && (
            <details className="ev-traps">
              <summary>Které pasti ({ev.traps.length})</summary>
              <ul>
                {ev.traps.map((t) => (
                  <li key={t.id} title={t.why} className={t.caught ? 'is-ok' : 'is-bad'}>
                    <Icon name={t.caught ? 'check' : 'x'} size={14} /> {t.title}
                  </li>
                ))}
              </ul>
            </details>
          )}
        </>
      )}
    </div>
  );
}

function Guard({ full }: { full: boolean }) {
  const g = useJson<GuardJson>('data/vysledok-test-halucinacii.json');
  if (!g || !g.aiProposals) return null;
  const line = <>{halluLine({ proposals: g.aiProposals, accepted: g.accepted, rejected: g.rejected, invented: g.evalSummary?.inventedValues })}</>;
  if (!full) return <div className="ev-guard">{line}</div>;
  return (
    <details className="ev-traps ev-guard">
      <summary>{line}</summary>
      <ul>
        {g.fields.map((f) => (
          <li key={f.field} className={f.accepted ? 'is-ok' : 'is-bad'}>
            <Icon name={f.accepted ? 'check' : 'x'} size={14} />
            <span><span className={f.accepted ? '' : 'ev-strike'}>{f.aiValue}</span><br /><small>{f.reason}</small></span>
          </li>
        ))}
      </ul>
    </details>
  );
}

/**
 * rows: která měření ukázat. variant 'compact' / 'full' (záložka Podklad: i seznam pastí a test pojistky).
 * manual: na obrazovce je ručně ověřená verze, měří se strojové vytěžení týchž zpráv (Alena).
 */
export function EvalCard({ rows, variant = 'compact', manual, title = 'Kontrola přesnosti' }: {
  rows: EvalRow[]; variant?: 'compact' | 'full'; manual?: boolean; title?: string;
}) {
  const [loaded, setLoaded] = useState<Record<string, EvalJson | null>>({});
  const full = variant === 'full';
  const evs = rows.map((r) => loaded[r.file]).filter((e): e is EvalJson => !!e && e.summary?.goldIntegrity === true);
  const first = evs[0];
  const foot: ReactNode = first
    ? <>Vytěžení: {modeLabel(first.extraction)}{first.generatedAt ? ` · ${fmtStamp(first.generatedAt)}` : ''}. Citáty ověřuje program, ne AI.</>
    : null;

  return (
    <Card className={`ev-card ${full ? 'ev-card--full' : ''}`} ariaLabel={title}>
      <div className="ev-head">
        <h3>{title}</h3>
        {evs.length > 0 && <Pill tone="mint" size="sm">naměřeno</Pill>}
      </div>
      {manual && <p className="ev-note">Měří se strojové vytěžení týchž zpráv, ne ručně ověřená verze na této obrazovce.</p>}
      <p className="ev-note">2 fiktivní pacienti, zlatá sada 20 polí + pasti.{EVAL_CAVEAT ? ` ${EVAL_CAVEAT}` : ''}</p>
      {rows.map((r) => (
        <Row key={r.file} row={r} full={full} onLoaded={(ev) => setLoaded((m) => (m[r.file] === ev ? m : { ...m, [r.file]: ev }))} />
      ))}
      {evs.length === 0 && <p className="ev-note">Měření se načítá (public/data/eval-*.json).</p>}
      <Guard full={full} />
      {foot && <p className="ev-foot">{foot}</p>}
    </Card>
  );
}
