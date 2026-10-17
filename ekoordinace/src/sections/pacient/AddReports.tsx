// Reports of a patient added in the app (owner: Matej): drop or pick files – Word, PDF, RTF, text, photos and
// screenshots (text recognized in the browser) – paste a screenshot (Ctrl+V) or the text itself; the case is rebuilt
// from them in the browser right away (the date of the MDT is in the patient header). Nothing leaves this browser.
// A report read from a picture is marked, and its text can be checked and corrected here.
import { useEffect, useRef, useState } from 'react';
import { readReport, reportDate } from '../../case/readReport';
import type { ReadSource } from '../../case/readReport';
import { SIM_TODAY, nextDocId, updatePatient } from '../../state/patients';
import type { StoredPatient, StoredReport } from '../../state/patients';
import { Icon } from '../../ui/Icon';
import { czDate } from '../../ui/format';
import './addreports.css';

const ACCEPT = '.docx,.pdf,.rtf,.txt,text/plain,application/pdf,image/*,.heic,.heif,.tif,.tiff';

interface Item { title: string; text: string; source?: ReadSource }

/** An added report: date, name, a mark when read from a picture; its text can be opened and corrected. */
function Added({ patient, d }: { patient: StoredPatient; d: StoredReport }) {
  const [edit, setEdit] = useState<string | null>(null);
  const save = (text: string) => updatePatient(patient.id, (p) => ({
    ...p, docs: p.docs.map((x) => (x.id === d.id ? { ...x, text, date: reportDate(text, SIM_TODAY), source: x.source === 'ocr' ? 'text' : x.source } : x)),
  }));
  return (
    <li>
      <span className="mono">{czDate(d.date)}</span>
      <span className="added-title">
        <span className="added-name">{d.title}</span>
        {d.source === 'ocr' && <span className="chip conf">z obrázku – zkontrolujte text</span>}
      </span>
      <button type="button" className="link added-edit" onClick={() => setEdit(edit === null ? d.text : null)} aria-expanded={edit !== null}>
        {edit !== null ? 'Zavřít' : d.source === 'ocr' ? 'Zkontrolovat' : 'Text'}
      </button>
      <button type="button" className="pt-remove" title="Odebrat zprávu" aria-label={`Odebrat zprávu ${d.title}`}
        onClick={() => updatePatient(patient.id, (p) => ({ ...p, docs: p.docs.filter((x) => x.id !== d.id) }))}>
        <Icon name="close" size={14} />
      </button>
      {edit !== null && (
        <div className="added-text">
          <textarea value={edit} onChange={(e) => setEdit(e.target.value)} rows={12} aria-label={`Text zprávy ${d.title}`} />
          <div className="form-actions">
            <button type="button" className="btn-primary" disabled={edit === d.text || !edit.trim()} onClick={() => { save(edit.trim()); setEdit(null); }}>Uložit opravu</button>
            <button type="button" className="btn-ghost" onClick={() => setEdit(null)}>Zrušit</button>
          </div>
        </div>
      )}
    </li>
  );
}

export function AddReports({ patient, first = false }: { patient: StoredPatient; first?: boolean }) {
  const [over, setOver] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [paste, setPaste] = useState<string | null>(null);
  const input = useRef<HTMLInputElement | null>(null);

  const add = (items: Item[]) => updatePatient(patient.id, (p) => {
    const docs: StoredReport[] = [...p.docs];
    for (const it of items) {
      docs.push({ id: nextDocId({ ...p, docs }), date: reportDate(it.text, SIM_TODAY), title: it.title, text: it.text, ...(it.source ? { source: it.source } : {}) });
    }
    return { ...p, docs };
  });

  const onFiles = async (files: File[]) => {
    if (!files.length || busy) return;
    const items: Item[] = [];
    const errs: string[] = [];
    for (const [i, f] of files.entries()) {
      const of = files.length > 1 ? ` (${i + 1}/${files.length})` : '';
      setBusy(`Načítám ${f.name}${of}…`);
      try {
        const { text, source } = await readReport(f, (label, pct) => setBusy(`${label}${of}…${pct !== undefined ? ` ${pct} %` : ''}`));
        // a pasted screenshot is called "image.png" – name it by what it is
        const title = /^image\.\w+$/i.test(f.name) ? 'Vložený snímek obrazovky' : f.name.replace(/\.[^.]+$/, '');
        if (text.trim()) items.push({ title, text, source });
        else errs.push(`${f.name}: soubor je prázdný.`);
      } catch (e) {
        errs.push(e instanceof Error ? e.message : String(e));
      }
    }
    if (items.length) add(items);
    setErrors(errs);
    setBusy(null);
  };

  // Ctrl+V of a screenshot or a copied file anywhere on the page while the reports are shown (text goes to text fields)
  const onFilesRef = useRef(onFiles);
  onFilesRef.current = onFiles;
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const files = Array.from(e.clipboardData?.files ?? []);
      if (!files.length) return;
      e.preventDefault();
      void onFilesRef.current(files);
    };
    document.addEventListener('paste', onPaste);
    return () => document.removeEventListener('paste', onPaste);
  }, []);

  const docs = [...patient.docs].sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
  return (
    <section className={`card add-reports${first ? ' first' : ''}`} aria-label="Zprávy pacienta">
      <div className="add-head">
        <div>
          <h2>{first ? 'Přidejte zprávy pacienta' : `Zprávy pacienta (${docs.length})`}</h2>
          {first && <p className="muted">Začněte žádankou od praktika a přidejte další zprávy. Aplikace z nich sama vytáhne údaje pro konzilium a ukáže, co chybí nebo si odporuje. Vše zůstává jen v tomto prohlížeči.</p>}
        </div>
      </div>
      <div
        className={`drop${over ? ' over' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); void onFiles(Array.from(e.dataTransfer.files)); }}
      >
        <Icon name="file" size={24} />
        <p><b>Přetáhněte sem zprávy</b> – Word, PDF, fotka nebo snímek obrazovky (Ctrl+V), klidně víc najednou.</p>
        <div className="form-actions">
          <button type="button" className="btn-primary" onClick={() => input.current?.click()} disabled={busy !== null}>Vybrat soubory</button>
          <button type="button" className="btn-ghost" onClick={() => setPaste(paste === null ? '' : null)}>Vložit text</button>
        </div>
        {busy && <p className="add-busy" role="status"><span className="spinner" aria-hidden="true" />{busy}</p>}
        <input ref={input} type="file" accept={ACCEPT} multiple hidden onChange={(e) => { void onFiles(Array.from(e.target.files ?? [])); e.target.value = ''; }} />
      </div>
      {paste !== null && (
        <div className="paste">
          <textarea value={paste} onChange={(e) => setPaste(e.target.value)} rows={8} placeholder="Vložte celý text zprávy (např. z e-mailu)…" aria-label="Text zprávy" />
          <div className="form-actions">
            <button type="button" className="btn-primary" disabled={!paste.trim()} onClick={() => { add([{ title: 'Vložený text', text: paste.trim(), source: 'text' }]); setPaste(null); }}>Přidat zprávu</button>
            <button type="button" className="btn-ghost" onClick={() => setPaste(null)}>Zrušit</button>
          </div>
        </div>
      )}
      {errors.length > 0 && <ul className="add-errors">{errors.map((e) => <li key={e}>{e}</li>)}</ul>}
      {docs.length > 0 && (
        <ul className="added" aria-label="Přidané zprávy">
          {docs.map((d) => <Added key={d.id} patient={patient} d={d} />)}
        </ul>
      )}
    </section>
  );
}
