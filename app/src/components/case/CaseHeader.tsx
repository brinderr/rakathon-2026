import type { Case, SourceDoc } from '../../types';
import { SK_CASE_STATUS, fmtDate, fmtShort, initials } from './caseUtils';
import { Btn, Pill } from './ui';
import { IcCalendar, IcMail, IcPerson, IcPhone, IcPin, IcPrint, IcReply } from './icons';

/** Optional `ai` block on Case (added by the data side for machine-extracted cases); read tolerantly. */
interface AiMeta { label?: string; mode?: string; model?: string | null; generatedAt?: string }
const MANUAL_LABEL = 'ručne overené tímom';

export function CaseHeader({ c, referral, asOf, closedAt, onMdt, onGp }:
  { c: Case; referral?: SourceDoc; asOf: string; closedAt?: string; onMdt: () => void; onGp: () => void }) {
  const p = c.patient;
  const status: Case['status'] = closedAt && closedAt <= asOf ? 'closed' : c.status; // closed in this demo session
  const statusTone = status === 'closed' ? 'neutral' : status === 'waiting' || status === 'postponed' ? 'amber' : status === 'new' ? 'sky' : 'mint';
  const ai = (c as Case & { ai?: AiMeta }).ai;
  const machine = !!ai?.mode && ai.mode !== 'manual';
  const aiTip = machine
    ? `Vyťažené ${ai?.generatedAt ? fmtDate(ai.generatedAt.slice(0, 10)) : 'strojovo'} · pravidlá + jazykový model · každý citát overil program · čaká na potvrdenie človekom${ai?.model ? ` · model: ${ai.model}` : ''}`
    : 'Údaje tohto prípadu pripravil a skontroloval tím ručne. Každý citát overil program – doslova sa nachádza v správe. Strojové (AI) vyťaženie tých istých správ je zmerané zvlášť v karte „Na kontrolnej sade“.';
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
      </div>
      <div className="cs-header-actions">
        <Btn variant="primary" icon={<IcPrint size={16} />} onClick={onMdt}>Podklad pre konzílium</Btn>
        <Btn variant="secondary" icon={<IcReply size={16} />} onClick={onGp}>{beforeMdt ? `Záver pre praktika · po ${fmtShort(c.mdtDate)}` : 'Záver pre praktika'}</Btn>
      </div>
    </header>
  );
}
