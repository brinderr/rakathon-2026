// Section "Žádanka od praktika" = the GP's side (owner: Bruno). Route #/zadanka (hidden from the coordinator's menu).
// The GP fills in no form (slide 7 "Nevytvářejte další rozsáhlý formulář"): he drops the letter he already wrote in his
// own software (Word or text) or pastes it, and the shared engine (app/src/ai, rules only, in this browser) reads the
// patient, insurer, diagnosis and what he asks for – each value with the sentence it came from. Before sending he sees
// what the coordinator will miss (the engine's precheck). Step 2 (send to KOC 2 + confirmation) comes next.
import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { extractHandover } from '../../../../app/src/ai/extract.ts';
import type { ExtractionResult } from '../../../../app/src/ai/extract.ts';
import { readFile, reportDate } from '../../case/readReport';
import { caseData } from '../pacient/caseData';
import { Icon } from '../../ui/Icon';
import { czDate } from '../../ui/format';
import './zadanka.css';

/** The demo letter: the GP's epikríza and request of 2. 10. 2026 (zpráva 07 of the VZP case). */
const SAMPLE = caseData.documents['07'];

/** What the GP's letter must carry for the KOC, in the order the coordinator reads it (subset of Handover_obsah). */
const SHOWN: { key: string; label: string }[] = [
  { key: 'firstName', label: 'Jméno' },
  { key: 'lastName', label: 'Příjmení' },
  { key: 'age', label: 'Věk' },
  { key: 'insurer', label: 'Zdravotní pojišťovna' },
  { key: 'patientContact', label: 'Kontakt na pacientku' },
  { key: 'contactPerson', label: 'Kontaktní osoba' },
  { key: 'diagnosis', label: 'Diagnóza' },
  { key: 'mdtQuestion', label: 'Co praktik od KOC žádá' },
  { key: 'medication', label: 'Léky' },
  { key: 'allergies', label: 'Alergie' },
  { key: 'performance', label: 'Výkonnostní stav (ECOG)' },
];

interface Letter { title: string; text: string; date: string }

export function Zadanka() {
  const [letter, setLetter] = useState<Letter | null>(null);
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [ms, setMs] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [over, setOver] = useState(false);
  const [paste, setPaste] = useState<string | null>(null);
  const input = useRef<HTMLInputElement | null>(null);

  const read = async (title: string, text: string, fallbackDate: string) => {
    setBusy(true);
    setError('');
    const date = reportDate(text, fallbackDate);
    const t0 = performance.now();
    try {
      const r = await extractHandover({ caseId: 'zadanka', docs: [{ id: 'Z', date, title, text }], asOf: '9999-12-31', generatedAt: `${date}T08:00:00Z` });
      setMs(performance.now() - t0);
      setLetter({ title, text, date });
      setResult(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
    setBusy(false);
  };

  const onFiles = async (files: FileList | null) => {
    const f = files?.[0];
    if (!f) return;
    try {
      const text = await readFile(f);
      if (!text.trim()) { setError(`${f.name}: soubor je prázdný.`); return; }
      await read(f.name.replace(/\.[^.]+$/, ''), text, caseData.today);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const reset = () => { setLetter(null); setResult(null); setPaste(null); setError(''); };
  const field = (k: string) => result?.fields.find((f) => f.key === k);
  const missing = result?.precheck.findings ?? [];
  const quotes = result ? result.fields.flatMap((f) => f.citations.map((c) => c.quote)) : [];

  return (
    <div className="zd">
      <div className="zd-banner"><Icon name="user" size={16} /> Pohled praktického lékaře · žádost o převzetí do péče KOC 2 – Nemocnice Lipová</div>

      <section className="card zd-intro">
        <div className="card-head"><h2>Žádanka do KOC bez dalšího formuláře</h2></div>
        <p className="muted">Pošlete dopis, který jste napsal ve své ambulanci – epikrízu se žádostí. Nic nepřepisujete: aplikace z něj sama přečte údaje o pacientovi a ještě před odesláním ukáže, co bude koordinátorce chybět. Text zůstává v tomto prohlížeči.</p>

        {!letter && (
          <>
            <div className={`zd-drop${over ? ' over' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setOver(true); }}
              onDragLeave={() => setOver(false)}
              onDrop={(e) => { e.preventDefault(); setOver(false); void onFiles(e.dataTransfer.files); }}>
              <Icon name="file" size={26} />
              <p><b>Přetáhněte sem svůj dopis</b> – Word (.docx) nebo text (.txt).</p>
              <div className="zd-actions">
                <button type="button" className="zd-btn primary" disabled={busy} onClick={() => void read(SAMPLE.title, SAMPLE.text, SAMPLE.date)}>
                  Použít žádanku z {czDate(SAMPLE.date)}
                </button>
                <button type="button" className="zd-btn" disabled={busy} onClick={() => input.current?.click()}>Vybrat soubor</button>
                <button type="button" className="zd-btn" disabled={busy} onClick={() => setPaste(paste === null ? '' : null)}>Vložit text</button>
              </div>
              <input ref={input} type="file" accept=".docx,.txt,text/plain" hidden onChange={(e) => { void onFiles(e.target.files); e.target.value = ''; }} />
            </div>
            {paste !== null && (
              <div className="zd-paste">
                <textarea rows={8} value={paste} onChange={(e) => setPaste(e.target.value)} placeholder="Vložte celý text dopisu (např. z e-mailu)…" aria-label="Text dopisu" />
                <button type="button" className="zd-btn primary" disabled={!paste.trim() || busy} onClick={() => void read('Vložený text', paste.trim(), caseData.today)}>Přečíst dopis</button>
              </div>
            )}
            {error && <p className="zd-error">{error}</p>}
          </>
        )}
      </section>

      {letter && result && (
        <div className="zd-grid">
          <section className="card zd-read">
            <div className="card-head">
              <h2>Co aplikace z dopisu přečetla</h2>
              <span className="zd-meta">{result.meta.stats.citationsVerified} vět ověřeno doslova · {ms.toFixed(0)} ms · v prohlížeči</span>
            </div>
            <dl className="zd-fields">
              {SHOWN.map(({ key, label }) => {
                const f = field(key);
                const ok = !!f && f.status !== 'missing' && !!f.value;
                return (
                  <div key={key} className={`zd-row${ok ? '' : ' miss'}`}>
                    <dt>{label}</dt>
                    <dd>
                      {ok ? <span className="zd-value">{f!.value}</span> : <span className="zd-chip miss">v dopise není</span>}
                      {ok && f!.citations[0] && <q className="zd-quote">{f!.citations[0].quote}</q>}
                    </dd>
                  </div>
                );
              })}
            </dl>
            {result.meta.plainText && <p className="zd-note">{result.meta.plainText.notice}</p>}
          </section>

          <aside className="zd-side">
            <section className="card zd-check">
              <div className="card-head"><h2>Před odesláním: co bude koordinátorce chybět</h2></div>
              {missing.length === 0
                ? <p className="muted">Nic zásadního nechybí.</p>
                : <ul>{missing.map((m) => (
                    <li key={m.text} className={m.severity}><Icon name={m.severity === 'missing' ? 'alert' : 'note'} size={16} /><span>{m.text}</span></li>
                  ))}</ul>}
            </section>

            <section className="card zd-orig">
              <div className="card-head">
                <h2><Icon name="file" size={16} /> {letter.title}</h2>
                <button type="button" className="zd-btn small" onClick={reset}>Jiný dopis</button>
              </div>
              <p className="zd-orig-meta">{czDate(letter.date)} · žluté jsou věty, ze kterých aplikace údaje vzala</p>
              <pre className="zd-text">{highlight(letter.text, quotes)}</pre>
            </section>
          </aside>
        </div>
      )}
    </div>
  );
}

/** The letter with every quoted sentence marked, so the GP sees where each value came from. */
function highlight(text: string, quotes: string[]) {
  const spans: [number, number][] = [];
  for (const q of new Set(quotes)) {
    const at = q ? text.indexOf(q) : -1;
    if (at >= 0) spans.push([at, at + q.length]);
  }
  spans.sort((a, b) => a[0] - b[0]);
  const out: ReactNode[] = [];
  let pos = 0;
  spans.forEach(([s, e], i) => {
    if (e <= pos) return;
    const from = Math.max(s, pos);
    if (from > pos) out.push(text.slice(pos, from));
    out.push(<mark key={i}>{text.slice(from, e)}</mark>);
    pos = e;
  });
  out.push(text.slice(pos));
  return out;
}
