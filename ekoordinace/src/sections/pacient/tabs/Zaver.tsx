// Tab "Závěr" (owner: Matej) – after the MDT: what the MDT decided and recommended (the doctors' words, written into the
// letter), the letter for the GP built from the case (addressee, patient, diagnosis with its source, MDT date), copy,
// print / PDF, and sending it as a secure message with a delivery receipt: odesláno → doručeno → přečteno, urgence while
// unread, "Odeslat znovu" when the text changed. Once delivered, the journey step "Závěr praktikovi" is done (live.ts).
// With the letter, the structured summary goes automatically to the revízní lékař of the patient's own insurer (VZP slide
// 11); when he asks to complete something, the answer is written here.
import { useEffect, useState } from 'react';
import { ME, useCase } from '../../../state/caseStore';
import { editConclusion, initialConclusion, markRead, replyRevizni, sendConclusion, simulateReceipt, urge } from '../../../state/zaver';
import type { Conclusion, Revizni } from '../../../state/zaver';
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

/** The revízní lékař of the patient's own insurer (Alena: ZP 211, not VZP); '' when the reports name no insurer. */
const rlOf = (p: CaseData['patient']) => (p.insurer.code ? `Revizní lékař ${p.insurer.short || `ZP ${p.insurer.code}`}` : '');

/** What the insurer needs to judge the treatment; an item among these left without checking, he asks for. */
const RL_NEEDS: Record<string, string> = { diagnosis: 'diagnózu', histology: 'histologii (výsledek biopsie)', performance: 'výkonnostní stav (ECOG)' };
function rlAskOf(data: CaseData): string | undefined {
  const f = data.fields.find((x) => RL_NEEDS[x.key] && x.status === 'ponecháno');
  return f && `Pro posouzení úhrady léčby doplňte prosím ${RL_NEEDS[f.key]} – v souhrnu je bez ověření.`;
}

/** The summary for the revízní lékař: the facts he judges the treatment by, sorted into fixed rows. */
function rlRows(data: CaseData, c: Conclusion): [string, string][] {
  const p = data.patient;
  const value = (key: string) => {
    const f = data.fields.find((x) => x.key === key);
    if (f?.status === 'ponecháno') return `bez ověření${f.note ? ` – ${f.note.replace(/^Ponecháno bez ověření: /, '').replace(/\s*\(\d{1,2}:\d{2}\)$/, '')}` : ''}`;
    return f?.value.replace(/\s*\n+\s*/g, ' · ').trim() || '–';
  };
  return [
    ['Adresát', `Revizní lékař, ${p.insurer.name || p.insurer.short} (${p.insurer.code})`],
    [p.sex === 'žena' ? 'Pojištěnka' : 'Pojištěnec', [p.name, p.born && `nar. ${p.born}`].filter(Boolean).join(', ')],
    ['Diagnóza', [p.diagnosis.code, p.diagnosis.text].filter(Boolean).join(' ') || '–'],
    ['Histologie', value('histology')],
    ['Výkonnostní stav', value('performance')],
    ['Konzilium', `${data.mdtDate ? czDate(data.mdtDate) : 'termín nestanoven'} · ${KOC}`],
    ['Rozhodnutí konzilia', c.zaver.trim() || '–'],
    ['Plánovaná léčba', c.doporuceni.trim() || '–'],
    ['Kontakt', `${ME}, koordinátorka ${KOC}`],
  ];
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

/** Odesláno 11:02 → Doručeno 11:02 → Vzato na vědomí 11:08 (or: Žádá doplnění → Odpovězeno → Vzato na vědomí) */
function RlReceipt({ to, rl }: { to: string; rl?: Revizni }) {
  if (!rl) return <p className="zaver-state muted"><Icon name="file" size={15} />{to} – souhrn odejde automaticky se závěrem</p>;
  const steps = [
    { label: 'Odesláno', at: rl.sent },
    { label: 'Doručeno', at: rl.delivered },
    ...(rl.ask ? [{ label: 'Žádá doplnění', at: rl.ask.at, warn: !rl.reply }, { label: 'Odpovězeno', at: rl.reply?.at }] : []),
    { label: 'Vzato na vědomí', at: rl.ack },
  ];
  return (
    <div className="zaver-state">
      <span className="zaver-to"><Icon name="file" size={15} />{to}</span>
      <ol className="receipt" aria-label="Doručenka revizního lékaře">
        {steps.map((s) => (
          <li key={s.label} className={s.at ? ('warn' in s && s.warn ? 'warn' : 'on') : ''}>
            <Icon name={s.at ? ('warn' in s && s.warn ? 'alert' : 'check') : 'clock'} size={14} />{s.label}{s.at && <span className="mono">{time(s.at)}</span>}
          </li>
        ))}
      </ol>
    </div>
  );
}

/** He asked for something: the coordinator writes what she found out and it goes back to him. */
function RlAsk({ rl, onReply }: { rl: Revizni & { ask: { at: string; text: string } }; onReply: (text: string) => void }) {
  const [text, setText] = useState('');
  return (
    <section className="card rl-ask" aria-label="Dotaz revizního lékaře">
      <p className="rl-ask-head"><Icon name="alert" size={16} /><b>{rl.to} žádá doplnění</b><span className="muted">{time(rl.ask.at)}</span></p>
      <p className="rl-ask-text">{rl.ask.text}</p>
      <textarea value={text} rows={2} placeholder="Co jste zjistila a odkud" aria-label="Odpověď reviznímu lékaři" onChange={(e) => setText(e.target.value)} />
      <div className="form-actions">
        <button type="button" className="btn-primary" disabled={!text.trim()} onClick={() => onReply(text.trim())}><Icon name="mail" size={16} />Odeslat odpověď</button>
      </div>
    </section>
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
  const base = initialConclusion(id, female);
  const c = st.conclusion ?? base;
  const text = letter(data, c);
  const sent = c.sent;
  const changed = Boolean(sent && sent.text !== text);
  const ready = Boolean(c.zaver.trim() || c.doporuceni.trim());
  const set = (patch: Partial<Conclusion>) => editConclusion(id, base, patch);
  const rlTo = rlOf(p);
  const rl = sent ? c.rl : undefined;
  const rows = rlRows(data, c);
  const rlText = ['Souhrn pro revizního lékaře', ...rows.map(([k, v]) => `${k}: ${v}`)].join('\n');

  // the simulated delivery and reading go on after a reload
  useEffect(() => { simulateReceipt(id, data.today, st.conclusion); }, [id, data.today, st.conclusion]);

  const insurer = p.insurer.code ? <>ZP {p.insurer.code}{p.insurer.short && <span className="soft"> ({p.insurer.short})</span>}</> : null;
  return (
    <div className="zaver">
      <section className="card zaver-bar" aria-label="Odeslání praktikovi">
        <div className="zaver-receipts">
          <Receipt c={c} />
          {rlTo && <RlReceipt to={rlTo} rl={rl} />}
        </div>
        <div className="form-actions">
          {!st.confirmed && !sent ? (
            <>
              <button type="button" className="btn-primary" disabled title="Zamčeno – nejdřív potvrďte podklad"><Icon name="lock" size={16} />Odeslat praktikovi</button>
              <p className="zaver-gate">Zamčeno – nejdřív potvrďte podklad.<a href={`#/pacienti/${id}/podklad`}>Otevřít podklad</a></p>
            </>
          ) : (!sent || changed) && (
            <button type="button" className="btn-primary" disabled={!ready} title={ready ? undefined : 'Doplňte závěr nebo doporučení MDT'}
              onClick={() => sendConclusion(id, data.today, base, text, p.gp.name, rlTo ? { to: rlTo, ask: rlAskOf(data) } : undefined)}>
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

      {rl?.ask && !rl.reply && <RlAsk rl={rl as Revizni & { ask: { at: string; text: string } }} onReply={(t) => replyRevizni(id, data.today, t)} />}

      <article className="card zaver-paper" aria-label="Závěr konzilia pro praktického lékaře">
        {data.mdtDate && data.today < data.mdtDate && (
          <p className="zaver-sample"><b>Ukázka</b> · konzilium proběhne {czDate(data.mdtDate)} – takto pak závěr dostane praktik.</p>
        )}
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

      {rlTo && (
        <section className="card rl-paper" aria-label="Souhrn pro revizního lékaře">
          <header className="rl-head">
            <div>
              <p className="muted">Odejde automaticky se závěrem praktikovi</p>
              <h2>Souhrn pro revizního lékaře</h2>
            </div>
            <CopyLetter text={rlText} />
          </header>
          <dl className="zaver-meta rl-meta">
            {rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{nb(v)}</dd></div>)}
          </dl>
          {rl?.reply && <p className="rl-reply"><b>Odpověď {time(rl.reply.at)}:</b> {rl.reply.text}</p>}
        </section>
      )}
    </div>
  );
}
