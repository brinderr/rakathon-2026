// Karta „Kontrola presnosti“: čísla LEN z public/data/eval-*.json (meranie Maťovho vyťaženia na kontrolnej sade).
// Žiadne číslo nie je v kóde napevno. Bez súboru alebo bez celistvej zlatej sady sa riadok nezobrazí.
// Voliteľná časť „Test poistky“ číta public/data/vysledok-test-halucinacii.json (ak je skopírovaný z eval/).
import { useEffect, useState, type ReactNode } from 'react';
import { Card, Icon, Pill, pluralWord } from './ui';
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
  if (e.mode === 'rules') return 'pravidlá, bez jazykového modelu';
  if (/náhrada/i.test(e.model ?? '')) return 'pravidlá + jazykový model · odpoveď AI predpočítaná náhradným modelom, bez Azure kľúča';
  return `pravidlá + jazykový model${e.model ? ` · ${e.model}` : ''}`;
}
function fmtStamp(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`;
}

export interface EvalRow { name: string; sub?: string; file: string; expectGeneratedAt?: string }

function Row({ row, full, onLoaded }: { row: EvalRow; full: boolean; onLoaded: (ev: EvalJson | null) => void }) {
  const ev = useJson<EvalJson>(row.file);
  useEffect(() => { onLoaded(ev); }, [ev, onLoaded]);
  if (!ev || ev.summary?.goldIntegrity !== true) return null;             // nikdy záložné čísla
  const s = ev.summary;
  const stale = !!row.expectGeneratedAt && ev.extraction.generatedAt !== row.expectGeneratedAt;
  return (
    <div className="ev-row">
      <div className="ev-who">{row.name}{row.sub && <span className="ev-sub"> · {row.sub}</span>}</div>
      {stale ? (
        <div className="ev-stale">Meranie patrí k inej verzii vyťaženia – spustiť npm run eval.</div>
      ) : (
        <>
          <div className="ev-nums">
            <span><b>{s.fieldsCorrect}/{s.fieldsTotal}</b> polí správne</span>
            <span><b>{s.trapsCaught}/{s.trapsTotal}</b> {full ? 'pascí zachytených' : 'pascí'}</span>
            <span><b>{s.inventedValues}</b> {full ? pluralWord(s.inventedValues, 'vymyslená hodnota', 'vymyslené hodnoty', 'vymyslených hodnôt') : 'vymyslených'}</span>
            <span><b>{s.citationsVerified}/{s.citationsTotal}</b> {full ? 'citátov doslova v správach' : 'citátov doslova'}</span>
          </div>
          {full && ev.traps?.length > 0 && (
            <details className="ev-traps">
              <summary>Ktoré pasce ({ev.traps.length})</summary>
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
  const line = (
    <>Test poistky: úmyselne chybná odpoveď AI · <b>{g.rejected} z {g.aiProposals}</b> návrhov program zamietol, {g.accepted} {pluralWord(g.accepted, 'prijal', 'prijal', 'prijal')}</>
  );
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
 * rows: ktoré merania ukázať. variant 'compact' (fronta) / 'full' (záložka Podklad: aj zoznam pascí a test poistky).
 * manual: na obrazovke je ručne overená verzia, meria sa strojové vyťaženie tých istých správ (Alena).
 */
export function EvalCard({ rows, variant = 'compact', manual, title = 'Kontrola presnosti' }: {
  rows: EvalRow[]; variant?: 'compact' | 'full'; manual?: boolean; title?: string;
}) {
  const [loaded, setLoaded] = useState<Record<string, EvalJson | null>>({});
  const full = variant === 'full';
  const evs = rows.map((r) => loaded[r.file]).filter((e): e is EvalJson => !!e && e.summary?.goldIntegrity === true);
  const first = evs[0];
  const foot: ReactNode = first
    ? <>Vyťaženie: {modeLabel(first.extraction)}{first.generatedAt ? ` · ${fmtStamp(first.generatedAt)}` : ''}. Citáty overuje program, nie AI.</>
    : null;

  return (
    <Card className={`ev-card ${full ? 'ev-card--full' : ''}`} ariaLabel={title}>
      <div className="ev-head">
        <h3>{title}</h3>
        {evs.length > 0 && <Pill tone="mint" size="sm">namerané</Pill>}
      </div>
      {manual && <p className="ev-note">Meria sa strojové vyťaženie tých istých správ, nie ručne overená verzia na tejto obrazovke.</p>}
      {rows.map((r) => (
        <Row key={r.file} row={r} full={full} onLoaded={(ev) => setLoaded((m) => (m[r.file] === ev ? m : { ...m, [r.file]: ev }))} />
      ))}
      {evs.length === 0 && <p className="ev-note">Meranie sa načítava (public/data/eval-*.json).</p>}
      <Guard full={full} />
      {foot && <p className="ev-foot">{foot}</p>}
    </Card>
  );
}
