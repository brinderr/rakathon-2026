import type { Case, Citation, SourceDoc } from '../../types';
import { SK_CASE_STATUS, fmtDate, fmtShort, initials } from './caseUtils';
import { Btn, Pill, SourceChip } from './ui';
import { IcAlert, IcCalendar, IcCheck, IcMail, IcPerson, IcPhone, IcPin, IcPlay, IcPrint, IcReply } from './icons';

/** A safety fact from the reports shown under the name (QA R5 #9): label + verbatim sources, no advice. */
export interface HeaderAlert { id: string; label: string; citations: Citation[] }

/** Optional `ai` block on Case (added by the data side for machine-extracted cases); read tolerantly.
 *  A case prepared by the team by hand gets NO badge – the manual version is only the control set. */
interface AiMeta { label?: string; mode?: string; model?: string | null; generatedAt?: string }

export function CaseHeader({ c, referral, asOf, closedAt, reopened, accepted, alerts = [], onMdt, onGp, onAccept, onOpenDoc, onLive }:
  { c: Case; referral?: SourceDoc; asOf: string; closedAt?: string; reopened?: SourceDoc; accepted?: boolean; alerts?: HeaderAlert[];
    onMdt: () => void; onGp: () => void; onAccept?: () => void; onOpenDoc?: (docId: string, quote?: string) => void;
    /** „Zpracovat naživo“: the extractor reads this patient's reports in the browser (only cases with report texts). */
    onLive?: () => void }) {
  const p = c.patient;
  // closed in this demo session – unless a report arrived after the closing (then it is open again, QA R5 #1)
  const base: Case['status'] = c.status === 'new' && accepted ? 'active' : c.status;
  const status: Case['status'] = closedAt && closedAt <= asOf && !reopened ? 'closed' : base;
  const isNew = status === 'new';
  const noMdt = !c.mdtDate; // not yet on an MDT: there is no handover to print and no conclusion to send
  const statusTone = status === 'closed' ? 'neutral' : status === 'waiting' || status === 'postponed' ? 'amber' : status === 'new' ? 'sky' : 'mint';
  const ai = (c as Case & { ai?: AiMeta }).ai;
  const machine = !!ai?.mode && ai.mode !== 'manual';
  const aiTip = `Vytěženo ${ai?.generatedAt ? fmtDate(ai.generatedAt.slice(0, 10)) : 'strojově'} · pravidla + jazykový model · každý citát ověřil program · čeká na potvrzení člověkem${ai?.model ? ` · model: ${ai.model}` : ''}`;
  const sender = /prakt/i.test(c.referringGp.practice) ? 'praktický lékař' : 'odesílající lékař';
  const histo = c.steps.find((s) => s.id === 'histology' || /histol/i.test(s.title));
  const histoAt = histo?.history.find((h) => h.state === 'delivered' && h.date <= asOf)?.date;
  const beforeMdt = !!c.mdtDate && asOf < c.mdtDate;
  return (
    <header className="cs-header">
      <div className="cs-avatar" aria-hidden="true">{initials(p.firstName, p.lastName)}</div>
      <div className="cs-header-main">
        <div className="cs-header-top">
          <h1 className="cs-name">{p.firstName} {p.lastName}</h1>
          <Pill tone={statusTone}>{SK_CASE_STATUS[status]}</Pill>
          {reopened && <Pill tone="coral">znovu otevřený · zpráva {reopened.id} po uzavření</Pill>}
          {c.demo === 'light' && <span title="Ilustrační případ do fronty – není ze zadání VZP, údaje jsou vymyšlené."><Pill tone="neutral">ukázka · ilustrační případ</Pill></span>}
          {machine && (
            <span className="cs-ai-badge" title={aiTip}><Pill tone="amber">{ai?.label ?? 'AI výstup (předpočítaný)'}</Pill></span>
          )}
        </div>
        <div className="cs-meta">
          <span>{p.age} let</span>
          <span>{p.sex}</span>
          <span title={p.insurerName}>ZP {p.insurerCode} · {p.insurerName}</span>
          {p.phone && <span><IcPhone size={14} /> {p.phone}</span>}
        </div>
        <div className="cs-meta cs-meta-2">
          <span><IcPin size={14} /> {c.koc}</span>
          {c.mdtDate && <span><IcCalendar size={14} /> MDT {fmtDate(c.mdtDate)}</span>}
          <span><IcMail size={14} /> přijato {referral ? `přes ${referral.channel} ` : ''}{fmtDate(c.receivedAt)}</span>
          <span title={c.referringGp.practice}><IcPerson size={14} /> {sender} {c.referringGp.name}{c.referringGp.phone ? ` · ${c.referringGp.phone}` : ''}</span>
        </div>
        <div className="cs-dx">
          {c.diagnosisShort}
          {histoAt && <span className="cs-dx-sub"> · histologie {fmtShort(histoAt)}</span>}
          {beforeMdt && c.fields.length > 0 && <span className="cs-dx-sub"> · diagnózu potvrdí MDT</span>}
        </div>
        {alerts.length > 0 && (
          <div className="cs-safety" role="note" aria-label="Upozornění ze zpráv">
            <span className="cs-safety-k"><IcAlert size={14} /> Pozor</span>
            {alerts.map((a) => (
              <span key={a.id} className="cs-safety-item">
                {a.label}
                {a.citations.filter((ci, i, all) => all.findIndex((x) => x.docId === ci.docId) === i).map((ci) => (
                  <SourceChip key={ci.docId} docId={ci.docId} onClick={() => onOpenDoc?.(ci.docId, ci.quote)} />
                ))}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="cs-header-actions">
        {isNew ? (
          <>
            <Btn variant="primary" icon={<IcCheck size={16} />} onClick={onAccept} title="Převezme žádost do KOC: zápis do záznamu, případ bude aktivní">Převzít žádost</Btn>
            <Btn variant="secondary" icon={<IcPrint size={16} />} disabled title="Podklad se připraví po zařazení na MDT">Podklad · po zařazení na MDT</Btn>
          </>
        ) : noMdt ? (
          <Btn variant="secondary" icon={<IcPrint size={16} />} disabled title="Podklad se připraví po zařazení na MDT">Podklad · po zařazení na MDT</Btn>
        ) : (
          <>
            <Btn variant="primary" icon={<IcPrint size={16} />} onClick={onMdt}>Podklad pro MDT</Btn>
            <Btn variant="secondary" icon={<IcReply size={16} />} onClick={onGp}>{beforeMdt ? `Závěr pro praktického lékaře · po ${fmtShort(c.mdtDate)}` : 'Závěr pro praktického lékaře'}</Btn>
          </>
        )}
        {onLive && (
          <Btn variant="secondary" icon={<IcPlay size={16} />} onClick={onLive}
            title="Motor znovu přečte všechny zprávy tohoto případu přímo v prohlížeči a ukáže, jak se podklad plní">Zpracovat naživo</Btn>
        )}
      </div>
    </header>
  );
}
