// Tab "Závěr" (owner: Matej) – after the MDT: what the MDT decided and recommended (the doctors' words, written into the
// letter), the letter for the GP built from the case (addressee, patient, diagnosis with its source, MDT date), copy,
// print / PDF, and sending it as a secure message with a delivery receipt: odesláno → doručeno → přečteno, urgence while
// unread, "Odeslat znovu" when the text changed. Once delivered, the journey step "Závěr praktikovi" is done (live.ts).
import { useEffect, useState } from 'react';
import alenaMdt from '../../../data/alena-mdt-zaver.json';
import { ME, useCase } from '../../../state/caseStore';
import { DEMO_ID } from '../../../state/patients';
import { editConclusion, emptyConclusion, markRead, sendConclusion, simulateReceipt, urge } from '../../../state/zaver';
import type { Conclusion } from '../../../state/zaver';
import { copyText } from '../../../ui/clipboard';
import { Icon } from '../../../ui/Icon';
import { czDate, nb, telHref } from '../../../ui/format';
import { useCaseData } from '../caseContext';
import type { OpenDoc } from '../Journey';
import type { CaseData } from '../types';
import '../zaver.css';

const KOC = 'KOC Nemocnice Lipová';
const time = (at: string) => at.slice(11);
/** "MUDr. Tomáš Řezníček, praktický lékař" (without a doubled role when the reports name no GP) */
const gpName = (name: string) => (/praktick/i.test(name) ? name : `${name}, praktický lékař`);

/** What the tab shows before the first edit: the MDT record of the demo case, otherwise empty. */
function initial(id: string, female: boolean): Conclusion {
  if (id === DEMO_ID) return { zaver: alenaMdt.zaver, doporuceni: alenaMdt.doporuceni, next: alenaMdt.next };
  return { ...emptyConclusion(), next: `${female ? 'Pacientku' : 'Pacienta'} o plánu informuje koordinátorka KOC.` };
}

/** The letter as plain text – what is copied and sent. */
function letter(data: CaseData, c: Conclusion): string {
  const p = data.patient;
  const female = p.sex === 'žena';
  const insurer = p.insurer.code ? `ZP ${p.insurer.code}${p.insurer.short ? ` (${p.insurer.short})` : ''}` : '';
  return [
    `${KOC} – Komplexní onkologické centrum`,
    'Závěr konzilia pro praktického lékaře',
    '',
    `Adresát: ${gpName(p.gp.name)}${p.gp.phone ? `, tel. ${p.gp.phone}` : ''}`,
    `${female ? 'Pacientka' : 'Pacient'}: ${[p.name, p.born && `nar. ${p.born}`, insurer].filter(Boolean).join(', ')}`,
    `Diagnóza: ${[p.diagnosis.code, p.diagnosis.text].filter(Boolean).join(' ') || '–'}`,
    `Konzilium (MDT): ${data.mdtDate ? czDate(data.mdtDate) : 'termín nestanoven'}`,
    '',
    'Závěr MDT:',
    c.zaver.trim() || '–',
    '',
    'Doporučení MDT:',
    c.doporuceni.trim() || '–',
    '',
    `Další postup: ${c.next.trim() || '–'}`,
    '',
    `Vyřizuje: ${ME}, koordinátorka ${KOC}`,
  ].join('\n').replace(/ /g, ' ');
}

function CopyLetter({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button type="button" className={`copy-btn${done ? ' done' : ''}`}
      onClick={async () => { if (await copyText(text)) { setDone(true); window.setTimeout(() => setDone(false), 1500); } }}>
      <Icon name={done ? 'check' : 'copy'} size={15} />{done ? 'Zkopírováno' : 'Kopírovat'}
    </button>
  );
}

/** Odesláno 11:02 → Doručeno 11:02 → Přečteno 11:05 */
function Receipt({ c }: { c: Conclusion }) {
  if (!c.sent) return <p className="zaver-state muted">Neodesláno</p>;
  const steps = [
    { label: 'Odesláno', at: c.sent.at },
    { label: 'Doručeno', at: c.delivered },
    { label: 'Přečteno', at: c.read },
  ];
  return (
    <div className="zaver-state">
      <span className="zaver-to"><Icon name="mail" size={15} />{c.sent.to}</span>
      <ol className="receipt" aria-label="Doručenka">
        {steps.map((s) => (
          <li key={s.label} className={s.at ? 'on' : ''}>
            <Icon name={s.at ? 'check' : 'clock'} size={14} />{s.label}{s.at && <span className="mono">{time(s.at)}</span>}
          </li>
        ))}
      </ol>
      {(c.urged?.length ?? 0) > 0 && <span className="muted">urgováno {c.urged!.map(time).join(', ')}</span>}
    </div>
  );
}

function Part({ title, value, placeholder, rows, onChange }: { title: string; value: string; placeholder: string; rows: number; onChange: (v: string) => void }) {
  return (
    <section className="zaver-part">
      <h3>{title}</h3>
      <textarea value={value} rows={rows} placeholder={placeholder} aria-label={title} onChange={(e) => onChange(e.target.value)} />
      <p className="print-only">{value || '–'}</p>
    </section>
  );
}

export function Zaver({ openDoc }: { openDoc: OpenDoc }) {
  const { id, data } = useCaseData();
  const st = useCase(id);
  const p = data.patient;
  const female = p.sex === 'žena';
  const base = initial(id, female);
  const c = st.conclusion ?? base;
  const text = letter(data, c);
  const sent = c.sent;
  const changed = Boolean(sent && sent.text !== text);
  const ready = Boolean(c.zaver.trim() || c.doporuceni.trim());
  const set = (patch: Partial<Conclusion>) => editConclusion(id, base, patch);

  // the simulated delivery and reading go on after a reload
  useEffect(() => { simulateReceipt(id, data.today, st.conclusion); }, [id, data.today, st.conclusion]);

  const insurer = p.insurer.code ? <>ZP {p.insurer.code}{p.insurer.short && <span className="soft"> ({p.insurer.short})</span>}</> : null;
  return (
    <div className="zaver">
      <section className="card zaver-bar" aria-label="Odeslání praktikovi">
        <Receipt c={c} />
        <div className="form-actions">
          {(!sent || changed) && (
            <button type="button" className="btn-primary" disabled={!ready} title={ready ? undefined : 'Doplňte závěr nebo doporučení MDT'}
              onClick={() => sendConclusion(id, data.today, base, text, p.gp.name)}>
              <Icon name="mail" size={16} />{sent ? 'Odeslat znovu' : 'Odeslat praktikovi'}
            </button>
          )}
          {sent && !changed && !c.read && (
            <>
              <button type="button" className="btn-ghost" onClick={() => urge(id, data.today)}>Urgovat</button>
              <button type="button" className="btn-ghost" onClick={() => markRead(id, data.today)}>Označit jako přečtené</button>
            </>
          )}
          <CopyLetter text={text} />
          <button type="button" className="btn-ghost" onClick={() => window.print()}><Icon name="download" size={16} />Tisk / PDF</button>
        </div>
        {changed && <p className="zaver-changed">Text se od odeslání změnil.</p>}
      </section>

      <article className="card zaver-paper" aria-label="Závěr konzilia pro praktického lékaře">
        <header className="zaver-head">
          <p className="muted">{KOC} – Komplexní onkologické centrum</p>
          <h2>Závěr konzilia pro praktického lékaře</h2>
        </header>
        <dl className="zaver-meta">
          <div>
            <dt>Adresát</dt>
            <dd>{gpName(p.gp.name)}{p.gp.phone && <> · <a href={telHref(p.gp.phone)}>{p.gp.phone}</a></>}</dd>
          </div>
          <div>
            <dt>{female ? 'Pacientka' : 'Pacient'}</dt>
            <dd>{p.name}{p.born && <>, nar. {nb(p.born)}</>}{insurer && <> · {insurer}</>}</dd>
          </div>
          <div>
            <dt>Diagnóza</dt>
            <dd>
              {p.diagnosis.code || p.diagnosis.text ? <><span className="code">{p.diagnosis.code}</span> {p.diagnosis.text}</> : '–'}
              {p.diagnosis.docId && p.diagnosis.source && (
                <> <button type="button" className="src-link" onClick={() => openDoc(p.diagnosis.docId)}>{nb(p.diagnosis.source)}</button></>
              )}
            </dd>
          </div>
          <div>
            <dt>Konzilium</dt>
            <dd>{data.mdtDate ? czDate(data.mdtDate) : 'termín nestanoven'}</dd>
          </div>
        </dl>
        <Part title="Závěr MDT" value={c.zaver} rows={6} placeholder="Závěr z jednání MDT, jak ho zapsali lékaři" onChange={(v) => set({ zaver: v })} />
        <Part title="Doporučení MDT" value={c.doporuceni} rows={8} placeholder="Léčba, další vyšetření, termíny" onChange={(v) => set({ doporuceni: v })} />
        <Part title="Další postup" value={c.next} rows={2} placeholder={`Kdo a kdy kontaktuje ${female ? 'pacientku' : 'pacienta'}`} onChange={(v) => set({ next: v })} />
        <p className="zaver-sign">Vyřizuje: {ME}, koordinátorka {KOC}</p>
      </article>
    </div>
  );
}
