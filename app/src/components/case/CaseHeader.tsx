import type { Case, Citation, SourceDoc } from '../../types';
import { SK_CASE_STATUS, fmtDate, fmtShort, initials } from './caseUtils';
import { Btn, Pill, SourceChip } from './ui';
import { IcAlert, IcCalendar, IcCheck, IcMail, IcPerson, IcPhone, IcPin, IcPrint, IcReply } from './icons';

/** A safety fact from the reports shown under the name (QA R5 #9): label + verbatim sources, no advice. */
export interface HeaderAlert { id: string; label: string; citations: Citation[] }

/** Optional `ai` block on Case (added by the data side for machine-extracted cases); read tolerantly. */
interface AiMeta { label?: string; mode?: string; model?: string | null; generatedAt?: string }
const MANUAL_LABEL = 'ručne overené tímom';

export function CaseHeader({ c, referral, asOf, closedAt, reopened, accepted, alerts = [], onMdt, onGp, onAccept, onOpenDoc }:
  { c: Case; referral?: SourceDoc; asOf: string; closedAt?: string; reopened?: SourceDoc; accepted?: boolean; alerts?: HeaderAlert[];
    onMdt: () => void; onGp: () => void; onAccept?: () => void; onOpenDoc?: (docId: string, quote?: string) => void }) {
  const p = c.patient;
  // closed in this demo session – unless a report arrived after the closing (then it is open again, QA R5 #1)
  const base: Case['status'] = c.status === 'new' && accepted ? 'active' : c.status;
  const status: Case['status'] = closedAt && closedAt <= asOf && !reopened ? 'closed' : base;
  const isNew = status === 'new';
  const noMdt = !c.mdtDate; // not yet on an MDT: there is no handover to print and no conclusion to send
  const statusTone = status === 'closed' ? 'neutral' : status === 'waiting' || status === 'postponed' ? 'amber' : status === 'new' ? 'sky' : 'mint';
  const ai = (c as Case & { ai?: AiMeta }).ai;
  const machine = !!ai?.mode && ai.mode !== 'manual';
  const aiTip = machine
    ? `Vyťažené ${ai?.generatedAt ? fmtDate(ai.generatedAt.slice(0, 10)) : 'strojovo'} · pravidlá + jazykový model · každý citát overil program · čaká na potvrdenie človekom${ai?.model ? ` · model: ${ai.model}` : ''}`
    : 'Údaje tohto prípadu pripravil a skontroloval tím ručne. Každý citát overil program – doslova sa nachádza v správe. Strojové (AI) vyťaženie tých istých správ je zmerané zvlášť (dlaždica „polí správne“ → „ako sme merali“).';
  const sender = /prakt/i.test(c.referringGp.practice) ? 'praktik' : 'odosielajúci lekár';
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
          {reopened && <Pill tone="coral">znovu otvorený · správa {reopened.id} po uzavretí</Pill>}
          {c.demo === 'light' && <span title="Ilustračný prípad do fronty – nie je zo zadania VZP, údaje sú vymyslené."><Pill tone="neutral">ukážka · ilustračný prípad</Pill></span>}
          {(c.fields.length > 0 || ai) && (
            <span className="cs-ai-badge" title={aiTip}><Pill tone={machine ? 'amber' : 'sky'}>{machine ? (ai?.label ?? 'AI výstup (predpočítaný)') : MANUAL_LABEL}</Pill></span>
          )}
        </div>
        <div className="cs-meta">
          <span>{p.age} r.</span>
          <span>{p.sex}</span>
          <span title={p.insurerName}>ZP {p.insurerCode} · {p.insurerName}</span>
          {p.phone && <span><IcPhone size={14} /> {p.phone}</span>}
        </div>
        <div className="cs-meta cs-meta-2">
          <span><IcPin size={14} /> {c.koc}</span>
          {c.mdtDate && <span><IcCalendar size={14} /> konzílium {fmtDate(c.mdtDate)}</span>}
          <span><IcMail size={14} /> prijaté {referral ? `cez ${referral.channel} ` : ''}{fmtDate(c.receivedAt)}</span>
          <span title={c.referringGp.practice}><IcPerson size={14} /> {sender} {c.referringGp.name}{c.referringGp.phone ? ` · ${c.referringGp.phone}` : ''}</span>
        </div>
        <div className="cs-dx">
          {c.diagnosisShort}
          {histoAt && <span className="cs-dx-sub"> · histológia {fmtShort(histoAt)}</span>}
          {beforeMdt && c.fields.length > 0 && <span className="cs-dx-sub"> · diagnózu potvrdí konzílium</span>}
        </div>
        {alerts.length > 0 && (
          <div className="cs-safety" role="note" aria-label="Upozornenia zo správ">
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
            <Btn variant="primary" icon={<IcCheck size={16} />} onClick={onAccept} title="Prevezme žiadosť do KOC: zápis do záznamu, prípad bude aktívny">Prevziať žiadosť</Btn>
            <Btn variant="secondary" icon={<IcPrint size={16} />} disabled title="Podklad sa pripraví po zaradení na konzílium">Podklad · po zaradení na konzílium</Btn>
          </>
        ) : noMdt ? (
          <Btn variant="secondary" icon={<IcPrint size={16} />} disabled title="Podklad sa pripraví po zaradení na konzílium">Podklad · po zaradení na konzílium</Btn>
        ) : (
          <>
            <Btn variant="primary" icon={<IcPrint size={16} />} onClick={onMdt}>Podklad pre konzílium</Btn>
            <Btn variant="secondary" icon={<IcReply size={16} />} onClick={onGp}>{beforeMdt ? `Záver pre praktika · po ${fmtShort(c.mdtDate)}` : 'Záver pre praktika'}</Btn>
          </>
        )}
      </div>
    </header>
  );
}
