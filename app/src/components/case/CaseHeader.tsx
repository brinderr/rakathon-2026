import type { Case, SourceDoc } from '../../types';
import { SK_CASE_STATUS, fmtDate, initials } from './caseUtils';
import { Btn, Pill } from './ui';
import { IcCalendar, IcMail, IcPerson, IcPhone, IcPin, IcPrint, IcReply } from './icons';

export function CaseHeader({ c, referral, onMdt, onGp }:
  { c: Case; referral?: SourceDoc; onMdt: () => void; onGp: () => void }) {
  const p = c.patient;
  const statusTone = c.status === 'closed' ? 'neutral' : c.status === 'waiting' || c.status === 'postponed' ? 'amber' : c.status === 'new' ? 'sky' : 'mint';
  return (
    <header className="cs-header">
      <div className="cs-avatar" aria-hidden="true">{initials(p.firstName, p.lastName)}</div>
      <div className="cs-header-main">
        <div className="cs-header-top">
          <h1 className="cs-name">{p.firstName} {p.lastName}</h1>
          <Pill tone={statusTone}>{SK_CASE_STATUS[c.status]}</Pill>
        </div>
        <div className="cs-meta">
          <span>{p.age} r.</span>
          <span className="cs-dot" />
          <span>{p.sex}</span>
          <span className="cs-dot" />
          <span title="Zdravotná poisťovňa">{p.insurerCode} · {p.insurerName}</span>
          {p.phone && (<><span className="cs-dot" /><span><IcPhone size={14} /> {p.phone}</span></>)}
        </div>
        <div className="cs-meta cs-meta-2">
          <span><IcPin size={14} /> {c.koc}</span>
          {c.mdtDate && (<><span className="cs-dot" /><span><IcCalendar size={14} /> konzílium {fmtDate(c.mdtDate)}</span></>)}
          <span className="cs-dot" />
          <span><IcMail size={14} /> prijaté {referral ? `cez ${referral.channel} ` : ''}{fmtDate(c.receivedAt)}</span>
        </div>
        <div className="cs-meta cs-meta-2">
          <span title={c.referringGp.practice}><IcPerson size={14} /> praktik {c.referringGp.name}{c.referringGp.phone ? ` · ${c.referringGp.phone}` : ''}{c.referringGp.email ? ` · ${c.referringGp.email}` : ''}</span>
        </div>
        <div className="cs-dx">{c.diagnosisShort}</div>
      </div>
      <div className="cs-header-actions">
        <Btn variant="primary" icon={<IcPrint size={16} />} onClick={onMdt}>Podklad pre konzílium</Btn>
        <Btn variant="secondary" icon={<IcReply size={16} />} onClick={onGp}>Záver pre praktika</Btn>
      </div>
    </header>
  );
}
