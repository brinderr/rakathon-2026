// Reports of a patient added in the app (owner: Matej): drop Word (.docx) or text files, or paste the text; the case is
// rebuilt from them in the browser right away (the date of the MDT is in the patient header). Nothing leaves this browser.
import { useRef, useState } from 'react';
import { readFile, reportDate } from '../../case/readReport';
import { SIM_TODAY, nextDocId, updatePatient } from '../../state/patients';
import type { StoredPatient } from '../../state/patients';
import { Icon } from '../../ui/Icon';
import { czDate } from '../../ui/format';

export function AddReports({ patient, first = false }: { patient: StoredPatient; first?: boolean }) {
  const [over, setOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [paste, setPaste] = useState<string | null>(null);
  const input = useRef<HTMLInputElement | null>(null);

  const add = (items: { title: string; text: string }[]) => updatePatient(patient.id, (p) => {
    const docs = [...p.docs];
    for (const it of items) docs.push({ id: nextDocId({ ...p, docs }), date: reportDate(it.text, SIM_TODAY), title: it.title, text: it.text });
    return { ...p, docs };
  });

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    const items: { title: string; text: string }[] = [];
    const errs: string[] = [];
    for (const f of Array.from(files)) {
      try {
        const text = await readFile(f);
        if (text.trim()) items.push({ title: f.name.replace(/\.[^.]+$/, ''), text });
        else errs.push(`${f.name}: soubor je prázdný.`);
      } catch (e) {
        errs.push(e instanceof Error ? e.message : String(e));
      }
    }
    if (items.length) add(items);
    setErrors(errs);
    setBusy(false);
  };

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
        onDrop={(e) => { e.preventDefault(); setOver(false); void onFiles(e.dataTransfer.files); }}
      >
        <Icon name="file" size={24} />
        <p><b>Přetáhněte sem zprávy</b> – Word (.docx) nebo text (.txt), klidně víc najednou.</p>
        <div className="form-actions">
          <button type="button" className="btn-primary" onClick={() => input.current?.click()} disabled={busy}>{busy ? 'Načítám…' : 'Vybrat soubory'}</button>
          <button type="button" className="btn-ghost" onClick={() => setPaste(paste === null ? '' : null)}>Vložit text</button>
        </div>
        <input ref={input} type="file" accept=".docx,.txt,text/plain" multiple hidden onChange={(e) => { void onFiles(e.target.files); e.target.value = ''; }} />
      </div>
      {paste !== null && (
        <div className="paste">
          <textarea value={paste} onChange={(e) => setPaste(e.target.value)} rows={8} placeholder="Vložte celý text zprávy (např. z PDF nebo e-mailu)…" aria-label="Text zprávy" />
          <div className="form-actions">
            <button type="button" className="btn-primary" disabled={!paste.trim()} onClick={() => { add([{ title: 'Vložený text', text: paste.trim() }]); setPaste(null); }}>Přidat zprávu</button>
            <button type="button" className="btn-ghost" onClick={() => setPaste(null)}>Zrušit</button>
          </div>
        </div>
      )}
      {errors.length > 0 && <ul className="add-errors">{errors.map((e) => <li key={e}>{e}</li>)}</ul>}
      {docs.length > 0 && (
        <ul className="added" aria-label="Přidané zprávy">
          {docs.map((d) => (
            <li key={d.id}>
              <span className="mono">{czDate(d.date)}</span>
              <span className="added-title">{d.title}</span>
              <button type="button" className="pt-remove" title="Odebrat zprávu" aria-label={`Odebrat zprávu ${d.title}`}
                onClick={() => updatePatient(patient.id, (p) => ({ ...p, docs: p.docs.filter((x) => x.id !== d.id) }))}>
                <Icon name="close" size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
