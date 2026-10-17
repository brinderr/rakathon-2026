// Tab "Podklad" (owner: Matej) – the podklad for the MDT along the VZP template MDT_zapis (1 Základní údaje … 7 Doporučení
// MDT). Values come from the case as it is now (the reports plus what the coordinator filled in or checked), each with
// the report it comes from; what is still open is listed first. A doctor of the KOC confirms it; it prints or saves as
// PDF in the browser's print dialog (the print style shows the document only).
import { useState } from 'react';
import type { ReactNode } from 'react';
import { ME, WAIVE_REASONS, confirmCase, unconfirmCase, useCase, waiveField } from '../../../state/caseStore';
import { editConclusion, initialConclusion } from '../../../state/zaver';
import { copyText } from '../../../ui/clipboard';
import { Icon } from '../../../ui/Icon';
import { czDate, nb } from '../../../ui/format';
import { useCaseData } from '../caseContext';
import type { OpenDoc } from '../Journey';
import type { CaseData, Field, Quote } from '../types';
import '../podklad.css';

/** The oncologist of the KOC who confirms the podklad (the doctor of the VZP sample). */
const DOCTOR = 'MUDr. Lenka Marková';

const FLAG: Record<string, { label: string; cls: string }> = {
  rozpor: { label: 'rozpor – neověřeno', cls: 'conf' },
  'neúplné': { label: 'neúplné', cls: 'miss' },
  'chybí': { label: 'chybí', cls: 'miss' },
  'doplněno': { label: 'doplněno', cls: 'ok' },
  'ověřeno': { label: 'ověřeno', cls: 'ok' },
  'ponecháno': { label: 'ponecháno – neověřeno', cls: 'conf' },
};

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const time = (at: string) => `${czDate(at.slice(0, 10))} ${at.slice(11)}`;

function Sources({ quotes, openDoc }: { quotes: Quote[]; openDoc: OpenDoc }) {
  const docs = [...new Map(quotes.map((q) => [q.docId, q.ref ?? q.docId])).entries()];
  if (!docs.length) return null;
  return (
    <span className="pk-src">
      {docs.map(([id, ref]) => (
        <button key={id} type="button" onClick={() => openDoc(id, quotes.filter((q) => q.docId === id).map((q) => q.quote))}>{nb(ref)}</button>
      ))}
    </span>
  );
}

function Row({ label, f, value, quotes, openDoc }: { label: string; f?: Field; value?: ReactNode; quotes?: Quote[]; openDoc: OpenDoc }) {
  const shown = value ?? (f?.value ? nb(f.value) : null);
  const flag = f ? FLAG[f.status] : undefined;
  return (
    <div className="pk-row">
      <dt>{label}</dt>
      <dd>
        {shown ? <span className="pk-value">{shown}</span> : <span className="pk-empty">není v dokumentaci</span>}
        {flag && <span className={`pk-flag ${flag.cls}`}>{flag.label}</span>}
        {f?.note && <span className="pk-note">{nb(f.note)}</span>}
        <Sources quotes={quotes ?? f?.quotes ?? []} openDoc={openDoc} />
      </dd>
    </div>
  );
}

interface ExamRow { date: string; what: string; place: string; result: string; docId?: string }

/** Part 5 – results of the exams so far: imaging and procedures, labs, histology, oldest first. */
function examRows(data: CaseData): ExamRow[] {
  const docs = Object.values(data.documents);
  const field = (k: string) => data.fields.find((f) => f.key === k)?.value ?? '';
  const name = (ref: string) => cap(ref.replace(/\s+\d{1,2}\.\s*\d{1,2}\.$/, ''));
  // czDate() keeps the parts of a date together with no-break spaces; the engine's text has plain ones
  const sameDay = (iso: string, text: string) => czDate(iso).replace(/\s+/g, ' ') === text.replace(/\s+/g, ' ');
  const rows: ExamRow[] = [];
  for (const line of field('exams').split('\n').filter(Boolean)) {
    const [date = '', title = '', ...rest] = line.split(' · ');
    const tail = rest.join(' · ');
    const d = docs.find((x) => sameDay(x.date, date) && x.title === title);
    const result = d && tail.startsWith(`${d.place} – `) ? tail.slice(d.place.length + 3) : tail.replace(/^[^–]*–\s*/, '');
    rows.push({ date: d?.date ?? '', what: d ? name(d.ref) : cap(title), place: d?.place ?? '', result, docId: d?.id });
  }
  for (const line of field('labs').split('\n').filter(Boolean)) {
    const m = line.match(/^(\d{1,2}\. \d{1,2}\. \d{4}) \(([^)]*)\):\s*([\s\S]*)$/);
    if (!m) continue;
    const d = docs.find((x) => sameDay(x.date, m[1]) && x.code === 'LAB');
    rows.push({ date: d?.date ?? '', what: 'Laboratoř', place: m[2], result: m[3], docId: d?.id });
  }
  const histology = field('histology');
  if (histology) {
    const d = docs.filter((x) => x.code === 'HIS').sort((a, b) => b.date.localeCompare(a.date))[0];
    rows.push({ date: d?.date ?? '', what: 'Histologie', place: d?.place ?? '', result: histology.replace(/\s·\svydáno.*$/, ''), docId: d?.id });
  }
  return rows.sort((a, b) => a.date.localeCompare(b.date));
}

/** The podklad as plain text, to paste into the hospital system. */
function plain(data: CaseData, address: string, rows: ExamRow[]): string {
  const p = data.patient;
  const v = (k: string) => data.fields.find((f) => f.key === k)?.value || 'není v dokumentaci';
  return [
    'Zápis k jednání multidisciplinárního týmu (MDT)',
    '1 Základní údaje',
    `Datum MDT: ${data.mdtDate ? czDate(data.mdtDate) : 'není stanoveno'}`,
    `Pacient: ${p.name}${p.born ? `, nar. ${p.born}` : ''}`,
    `Pojišťovna: ${p.insurer.code ? `${p.insurer.code} – ${p.insurer.name}` : 'není v dokumentaci'}`,
    `Telefon, email: ${v('patientContact')}`,
    `Adresa: ${address || 'není v dokumentaci'}`,
    `Váha, výška: ${v('weightHeight')}`,
    `Výkonnostní stav (ECOG): ${v('performance')}`,
    `Referující lékař: ${p.gp.name}${p.gp.phone ? `, tel. ${p.gp.phone}` : ''}`,
    '2 Členové MDT', '',
    '3 Diagnóza',
    `Název diagnózy: ${p.diagnosis.text || 'není v dokumentaci'}`,
    `Kód diagnózy (MKN-10): ${p.diagnosis.code || 'není v dokumentaci'}`,
    `Histologie: ${v('histology')}`,
    `Otázka pro konzilium: ${v('mdtQuestion')}`,
    '4 Komorbidity', v('comorbidities'), `Léky: ${v('medication')}`, `Alergie: ${v('allergies')}`,
    '5 Výsledky stávajících vyšetření',
    ...rows.map((r) => `${r.date ? czDate(r.date) : ''} | ${r.what}${r.place ? ` (${r.place})` : ''} | ${r.result}`),
    '6 Závěr MDT', '', '7 Doporučení MDT', '',
  ].join('\n');
}

export function Podklad({ openDoc }: { openDoc: OpenDoc }) {
  const { id, data } = useCaseData();
  const st = useCase(id);
  const [copied, setCopied] = useState(false);
  const [waiving, setWaiving] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const p = data.patient;
  const f = (k: string) => data.fields.find((x) => x.key === k);
  // what is still open, from the items themselves (stays visible after the doctor confirmed)
  const open = data.fields.filter((x) => x.todo && ['chybí', 'neúplné', 'rozpor'].includes(x.status)).map((x) => ({ key: x.key, title: x.todo!.title, docs: x.todo!.quotes.map((q) => q.docId) }));
  const doubtful = new Set(open.flatMap((t) => t.docs));
  const left = data.fields.filter((x) => x.status === 'ponecháno').length;
  const waive = (key: string, why: string) => { waiveField(id, data.today, key, why); setWaiving(null); setReason(''); };
  const confirmed = st.confirmed;
  // parts 6 and 7 are written at the MDT (after the podklad was confirmed); the Závěr for the GP takes them over
  const base = initialConclusion(id, p.sex === 'žena');
  const mdt = st.conclusion ?? base;

  // address and the GP's e-mail are in the referral; the MDT_zapis asks for both
  const referral = data.steps.find((s) => s.id === 'prevzit')?.docs?.[0];
  const refText = referral ? data.documents[referral.id]?.text ?? '' : '';
  const addressLine = refText.match(/^Bydliště:\s*(.+)$/m);
  const address = addressLine?.[1].trim() ?? '';
  const gpMail = refText.split(/^Pacient(?:ka)?:/m)[0].match(/[\w.+-]+@[\w-]+\.[\w.-]*\w/)?.[0];
  const refQuote = (q?: string): Quote[] => (referral && q ? [{ docId: referral.id, ref: referral.ref, quote: q }] : []);
  const rows = examRows(data);
  const fileName = `Podklad MDT – ${p.name}${data.mdtDate ? ` – ${czDate(data.mdtDate).replace(/\s/g, ' ')}` : ''}`;
  // the browser saves the PDF under the page title
  const printPdf = () => {
    const title = document.title;
    document.title = fileName;
    window.addEventListener('afterprint', () => { document.title = title; }, { once: true });
    window.print();
  };
  const sameName = (k: string) => f(k)?.quotes ?? [];

  return (
    <div className="podklad">
      {/* 1 everything resolved → 2 confirmed → 3 the podklad is generated (PDF for the MDT, text for the hospital system) */}
      {open.length > 0 ? (
        <section className="card pk-gate" aria-label="Před potvrzením">
          <h3><Icon name="alert" size={18} />Nejdřív vyřešte {open.length} {open.length === 1 ? 'bod' : open.length < 5 ? 'body' : 'bodů'}</h3>
          <ul>
            {open.map((t) => (
              <li key={t.key}>
                <div className="pk-gate-row">
                  <span>{nb(t.title)}</span>
                  <span className="pk-gate-act">
                    <a href={`#/pacienti/${id}/udaje/${t.key}`}>Vyřešit<Icon name="right" size={14} /></a>
                    <button type="button" aria-expanded={waiving === t.key} onClick={() => { setWaiving(waiving === t.key ? null : t.key); setReason(''); }}>Ponechat</button>
                  </span>
                </div>
                {waiving === t.key && (
                  <form className="pk-waive" onSubmit={(e) => { e.preventDefault(); if (reason.trim()) waive(t.key, reason.trim()); }}>
                    <span className="pk-waive-q">Proč to necháte být? V podkladu bude označeno jako neověřené.</span>
                    {WAIVE_REASONS.map((r) => <button key={r} type="button" className="chip-btn" onClick={() => waive(t.key, r)}>{r}</button>)}
                    <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Jiný důvod…" aria-label="Jiný důvod" />
                    <button type="submit" className="btn-ghost" disabled={!reason.trim()}>Ponechat</button>
                  </form>
                )}
              </li>
            ))}
          </ul>
          <div className="pk-locked">
            <button type="button" className="btn-primary" disabled><Icon name="lock" size={16} />Potvrdit a vygenerovat PDF</button>
            <span>Zamčeno, dokud nejsou všechny body vyřešené nebo ponechané.</span>
          </div>
        </section>
      ) : !confirmed ? (
        <section className="card pk-gate ready" aria-label="Potvrzení">
          <h3><Icon name="check" size={18} />Vše vyřešeno – zkontrolujte podklad a potvrďte</h3>
          {left > 0 && <p className="pk-left">Ponecháno bez ověření: {left} – v podkladu je to označené.</p>}
          <div className="pk-locked">
            <button type="button" className="btn-primary" onClick={() => confirmCase(id, data.today, DOCTOR)}><Icon name="check" size={16} />Potvrdit a vygenerovat PDF</button>
            <span>Potvrzuje {DOCTOR}</span>
          </div>
        </section>
      ) : (
        <section className="card pk-out" aria-label="Vygenerovaný podklad">
          <span className="pk-file"><Icon name="file" size={22} /></span>
          <div className="pk-out-main">
            <b>{fileName}.pdf</b>
            <small>Potvrdil(a) {confirmed.by} · {time(confirmed.at)}</small>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-primary" onClick={printPdf}><Icon name="download" size={16} />Stáhnout PDF</button>
            <button type="button" className={`copy-btn${copied ? ' done' : ''}`}
              onClick={async () => { if (await copyText(plain(data, address, rows))) { setCopied(true); window.setTimeout(() => setCopied(false), 1500); } }}>
              <Icon name={copied ? 'check' : 'copy'} size={15} />{copied ? 'Zkopírováno' : 'Kopírovat do NIS'}
            </button>
            <button type="button" className="btn-ghost" onClick={() => unconfirmCase(id, data.today)}>Zrušit potvrzení</button>
          </div>
        </section>
      )}

      <article className="card pk-paper">
        <header className="pk-head">
          <h2>Zápis k jednání multidisciplinárního týmu (MDT){!confirmed && <span className="pk-draft">návrh</span>}</h2>
          <p>Podklad připravila {ME}, koordinátorka KOC Nemocnice Lipová, {czDate(data.today)}{confirmed ? ` · potvrdil(a) ${confirmed.by}, ${time(confirmed.at)}` : ''}</p>
        </header>


        <section className="pk-sec">
          <h3><span>1</span>Základní údaje</h3>
          <dl>
            <Row label="Datum MDT" value={data.mdtDate ? czDate(data.mdtDate) : null} openDoc={openDoc} />
          </dl>
          <h4>Pacient</h4>
          <dl>
            <Row label="Jméno a příjmení" value={<>{p.name}{p.born && <span className="pk-soft"> · nar. {nb(p.born)}{p.age && `, ${p.age}`}</span>}</>} quotes={[...sameName('lastName'), ...sameName('age')]} openDoc={openDoc} />
            <Row label="Pojišťovna" value={p.insurer.code ? `${p.insurer.code} – ${p.insurer.name}` : null} quotes={sameName('insurer')} openDoc={openDoc} />
            <Row label="Telefon, email" f={f('patientContact')} openDoc={openDoc} />
            <Row label="Adresa" value={address || null} quotes={refQuote(addressLine?.[0])} openDoc={openDoc} />
            <Row label="Váha, výška" f={f('weightHeight')} openDoc={openDoc} />
            <Row label="Výkonnostní stav (ECOG)" f={f('performance')} openDoc={openDoc} />
          </dl>
          <h4>Referující lékař</h4>
          <dl>
            <Row label="Jméno a příjmení" value={p.gp.name} quotes={refQuote(referral ? refText.split('\n').find((l) => l.includes(p.gp.name)) : undefined)} openDoc={openDoc} />
            <Row label="Telefon, email" value={[p.gp.phone && `tel. ${p.gp.phone}`, gpMail ? `e-mail ${gpMail}` : 'e-mail neuveden'].filter(Boolean).join(' · ')} openDoc={openDoc} />
          </dl>
        </section>

        <section className="pk-sec">
          <h3><span>2</span>Členové MDT</h3>
          <p className="pk-fill">Doplní se na konziliu.</p>
          <div className="pk-lines" aria-hidden="true"><i /><i /><i /></div>
        </section>

        <section className="pk-sec">
          <h3><span>3</span>Diagnóza</h3>
          <dl>
            <Row label="Název diagnózy" f={f('diagnosis')} value={p.diagnosis.text || null} openDoc={openDoc} />
            <Row label="Kód diagnózy (MKN-10)" value={p.diagnosis.code || null} quotes={[]} openDoc={openDoc} />
            <Row label="Histologie" f={f('histology')} openDoc={openDoc} />
            <Row label="Otázka pro konzilium" f={f('mdtQuestion')} openDoc={openDoc} />
          </dl>
        </section>

        <section className="pk-sec">
          <h3><span>4</span>Komorbidity</h3>
          <dl>
            <Row label="Přidružená onemocnění" f={f('comorbidities')} openDoc={openDoc} />
            <Row label="Léky" f={f('medication')} openDoc={openDoc} />
            <Row label="Alergie" f={f('allergies')} openDoc={openDoc} />
          </dl>
        </section>

        <section className="pk-sec">
          <h3><span>5</span>Výsledky stávajících vyšetření</h3>
          {rows.length ? (
            <table className="pk-table">
              <thead><tr><th>Datum</th><th>Vyšetření</th><th>Výsledek</th></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={`${r.date}${r.what}${r.result.slice(0, 20)}`}>
                    <td className="pk-date">{r.date ? nb(czDate(r.date)) : ''}</td>
                    <td><b>{r.what}</b>{r.place && <small>{r.place}</small>}{r.docId && doubtful.has(r.docId) && <span className="pk-flag conf">k ověření</span>}</td>
                    <td>
                      {nb(r.result)}
                      {r.docId && <span className="pk-src"><button type="button" onClick={() => openDoc(r.docId!)}>otevřít zprávu</button></span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className="pk-empty">Zatím žádná vyšetření.</p>}
        </section>

        {([['6', 'Závěr MDT', 'zaver'], ['7', 'Doporučení MDT', 'doporuceni']] as const).map(([no, title, key]) => (
          <section className="pk-sec" key={key}>
            <h3><span>{no}</span>{title}</h3>
            {confirmed ? (
              <>
                <textarea className="pk-mdt" rows={key === 'zaver' ? 4 : 6} value={mdt[key]} placeholder="Zapíše se na konziliu" aria-label={title}
                  onChange={(e) => editConclusion(id, base, { [key]: e.target.value })} />
                {mdt[key] && <p className="pk-mdt-print">{mdt[key]}</p>}
                {key === 'doporuceni' && <p className="pk-fill">Přenese se do <a href={`#/pacienti/${id}/zaver`}>závěru pro praktika</a>.</p>}
              </>
            ) : <p className="pk-fill">Vyplní MDT na konziliu.</p>}
            {!mdt[key] || !confirmed ? <div className="pk-lines" aria-hidden="true"><i /><i /><i /></div> : null}
          </section>
        ))}
      </article>
    </div>
  );
}
