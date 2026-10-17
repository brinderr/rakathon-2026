// Four tiles on the overview: handover completeness, days since the referral was received (no foreign target
// in the UI), steps with a delivered result, values without a source. No accuracy card here (that is a
// measurement of the extraction engine, not of this patient).
import type { Case } from '../../types';
import { clockDay, fmtDate, plural } from './caseUtils';
import type { Counts } from './caseUtils';
import { Ring } from './ui';

export function Metrics({ c, counts, asOf, stepsDone, stepsTotal, flash }:
  { c: Case; counts: Counts; asOf: string; stepsDone: number; stepsTotal: number; flash?: boolean }) {
  const day = clockDay(c, asOf);
  const issues: string[] = [];
  if (counts.missing) issues.push(`${counts.missing} ${plural(counts.missing, 'chybí', 'chybí', 'chybí')}`);
  if (counts.conflict) issues.push(`${counts.conflict} ${plural(counts.conflict, 'rozpor', 'rozpory', 'rozporů')}`);
  if (counts.pending) issues.push(`${counts.pending} ${plural(counts.pending, 'čeká', 'čekají', 'čeká')} na odpověď`);
  if (counts.proposed) issues.push(`${counts.proposed} ${plural(counts.proposed, 'návrh', 'návrhy', 'návrhů')} ke kontrole`);
  if (counts.future) issues.push(`${counts.future} k datu ${plural(counts.future, 'neznámé', 'neznámé', 'neznámých')}`);
  const started = counts.total > 0;

  return (
    <div className="cs-metrics">
      <div className={`cs-metric cs-metric-1 ${flash ? 'is-flash' : ''}`}>
        <div className="cs-metric-row">
          <Ring value={counts.confirmed} max={counts.total} size={62} stroke={7} color="var(--mint)">
            <span className="cs-ring-pct">{started ? Math.round((counts.confirmed / counts.total) * 100) : 0}%</span>
          </Ring>
          <div>
            <div className="cs-metric-big">{started ? counts.confirmed : '–'}<span className="cs-metric-of">{started ? `/${counts.total}` : ''}</span></div>
            <div className="cs-metric-label">Úplnost podkladu</div>
          </div>
        </div>
        <div className="cs-metric-foot">{!started ? 'podklad ještě nezačal – čekáme na zprávy' : issues.length ? issues.join(' · ') : 'všechna pole potvrzena'}</div>
      </div>

      <div className="cs-metric cs-metric-2">
        <div className="cs-metric-big">den {day}</div>
        <div className="cs-metric-label">od přijetí žádosti</div>
        <div className="cs-metric-foot">žádost přijata {fmtDate(c.receivedAt)}{c.mdtDate ? ` · MDT ${fmtDate(c.mdtDate)}` : ''}</div>
      </div>

      <div className="cs-metric cs-metric-3">
        <div className="cs-metric-big">{stepsDone}<span className="cs-metric-of">/{stepsTotal}</span></div>
        <div className="cs-metric-label">Kroky s doručeným výsledkem</div>
        <div className="cs-steps-mini" aria-hidden="true">
          {Array.from({ length: stepsTotal }).map((_, i) => <span key={i} className={i < stepsDone ? 'is-done' : ''} />)}
        </div>
        <div className="cs-metric-foot">vyžádáno → objednáno → provedeno → výsledek</div>
      </div>

      <div className={`cs-metric cs-metric-4 ${counts.noSource ? 'is-bad' : ''}`}>
        <div className="cs-metric-big">{counts.noSource}</div>
        <div className="cs-metric-label">{counts.noSource === 1 ? 'údaj bez zdroje' : counts.noSource >= 2 && counts.noSource <= 4 ? 'údaje bez zdroje' : 'údajů bez zdroje'}</div>
        <div className="cs-metric-foot">každý údaj má doslovný citát ze zprávy, nebo záznam koordinátorky</div>
      </div>
    </div>
  );
}
