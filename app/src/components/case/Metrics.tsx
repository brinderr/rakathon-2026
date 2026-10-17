import type { Case } from '../../types';
import { DK_DECISION_DAYS, DK_FIRST_VISIT_DAYS, clockDay, daysWord, fmtDate, plural } from './caseUtils';
import type { Counts } from './caseUtils';
import type { EvalInfo } from './EvalCard';
import { Ring } from './ui';
import { IcArrow } from './icons';

export function Metrics({ c, counts, asOf, stepsDone, stepsTotal, flash, evalInfo, evalOpen, onEval }:
  { c: Case; counts: Counts; asOf: string; stepsDone: number; stepsTotal: number; flash?: boolean;
    evalInfo?: EvalInfo | null; evalOpen?: boolean; onEval?: () => void }) {
  const day = clockDay(c, asOf);
  const target = c.clockTargetDays || DK_FIRST_VISIT_DAYS + DK_DECISION_DAYS;
  const over = day > target;
  const pct = Math.min(1, day / target);
  const firstPct = DK_FIRST_VISIT_DAYS / target;
  const pancreas = /pankrea|C25/i.test(c.diagnosisShort);
  const issues: string[] = [];
  if (counts.missing) issues.push(`${counts.missing} ${plural(counts.missing, 'chýba', 'chýbajú', 'chýba')}`);
  if (counts.conflict) issues.push(`${counts.conflict} ${plural(counts.conflict, 'rozpor', 'rozpory', 'rozporov')}`);
  if (counts.pending) issues.push(`${counts.pending} ${plural(counts.pending, 'čaká', 'čakajú', 'čaká')} na odpoveď`);
  if (counts.proposed) issues.push(`${counts.proposed} ${plural(counts.proposed, 'návrh', 'návrhy', 'návrhov')} na kontrolu`);
  if (counts.future) issues.push(`${counts.future} k dátumu ${plural(counts.future, 'neznáme', 'neznáme', 'neznámych')}`);
  const started = counts.total > 0;
  const showEval = !!evalInfo && counts.noSource === 0;

  return (
    <div className="cs-metrics">
      <div className={`cs-metric cs-metric-1 ${flash ? 'is-flash' : ''}`}>
        <div className="cs-metric-row">
          <Ring value={counts.confirmed} max={counts.total} size={62} stroke={7} color="var(--mint)">
            <span className="cs-ring-pct">{started ? Math.round((counts.confirmed / counts.total) * 100) : 0}%</span>
          </Ring>
          <div>
            <div className="cs-metric-big">{started ? counts.confirmed : '–'}<span className="cs-metric-of">{started ? `/${counts.total}` : ''}</span></div>
            <div className="cs-metric-label">Úplnosť podkladu</div>
          </div>
        </div>
        <div className="cs-metric-foot">{!started ? 'podklad sa ešte nezačal – čakáme na správy' : issues.length ? issues.join(' · ') : 'všetky polia potvrdené'}</div>
      </div>

      {pancreas ? (
        <div className={`cs-metric cs-metric-2 ${over ? 'is-over' : ''}`}>
          <div className="cs-metric-big">deň {day}<span className="cs-metric-of"> z {target}</span></div>
          <div className="cs-metric-label">Hodiny cesty</div>
          <div className="cs-clock" aria-hidden="true">
            <div className="cs-clock-seg cs-clock-seg-a" style={{ width: `${firstPct * 100}%` }} />
            <div className="cs-clock-seg cs-clock-seg-b" style={{ left: `${firstPct * 100}%`, width: `${(1 - firstPct) * 100}%` }} />
            <div className="cs-clock-fill" style={{ width: `${pct * 100}%` }} />
            <div className="cs-clock-now" style={{ left: `${pct * 100}%` }} />
          </div>
          <div className="cs-metric-foot">
            {over ? `${day - target} ${daysWord(day - target)} po lehote · ` : ''}
            dánsky vzor pre pankreas: {DK_FIRST_VISIT_DAYS} + {DK_DECISION_DAYS} dní · zahraničný vzor, nie česká norma
          </div>
        </div>
      ) : (
        // the Danish target exists only for pancreas – other diagnoses show the plain day count (QA R5 #4)
        <div className="cs-metric cs-metric-2">
          <div className="cs-metric-big">deň {day}</div>
          <div className="cs-metric-label">Hodiny cesty</div>
          <div className="cs-metric-foot">od prijatia žiadosti {fmtDate(c.receivedAt)} · cieľovú lehotu pre túto diagnózu v deme nenastavujeme</div>
        </div>
      )}

      <div className="cs-metric cs-metric-3">
        <div className="cs-metric-big">{stepsDone}<span className="cs-metric-of">/{stepsTotal}</span></div>
        <div className="cs-metric-label">Kroky s doručeným výsledkom</div>
        <div className="cs-steps-mini" aria-hidden="true">
          {Array.from({ length: stepsTotal }).map((_, i) => <span key={i} className={i < stepsDone ? 'is-done' : ''} />)}
        </div>
        <div className="cs-metric-foot">vyžiadané → objednané → vykonané → výsledok</div>
      </div>

      {showEval && evalInfo ? (
        <button type="button" className={`cs-metric cs-metric-4 is-eval ${evalOpen ? 'is-open' : ''}`} onClick={onEval}
          title="Namerané na 2 fiktívnych pacientoch (zlatá sada 20 polí + pasce); pravidlá sme ladili na tých istých dátach. Klik ukáže, ako sme merali.">
          <div className="cs-metric-big">{evalInfo.fieldsCorrect}<span className="cs-metric-of">/{evalInfo.fieldsTotal}</span></div>
          <div className="cs-metric-label">polí správne · strojové vyťaženie</div>
          <div className="cs-metric-sub">{evalInfo.trapsCaught}/{evalInfo.trapsTotal} pascí · {evalInfo.inventedValues} vymyslených · {evalInfo.citationsVerified}/{evalInfo.citationsTotal} citátov doslova</div>
          <div className="cs-metric-foot cs-metric-more">{evalOpen ? 'skryť meranie' : 'ako sme merali'} <IcArrow size={12} /></div>
        </button>
      ) : (
        <div className={`cs-metric cs-metric-4 ${counts.noSource ? 'is-bad' : ''}`}>
          <div className="cs-metric-big">{counts.noSource}</div>
          <div className="cs-metric-label">{counts.noSource === 1 ? 'údaj bez zdroja' : counts.noSource >= 2 && counts.noSource <= 4 ? 'údaje bez zdroja' : 'údajov bez zdroja'}</div>
          <div className="cs-metric-foot">každý údaj má doslovný citát zo správy</div>
        </div>
      )}
    </div>
  );
}
