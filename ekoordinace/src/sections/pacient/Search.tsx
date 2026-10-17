// Search in the top bar (owner: Matej): patients by name, diagnosis or a report ("CT", "histologie", "Říčany").
// Patients and their reports in this browser; a hit opens the patient.
import { useMemo, useState } from 'react';
import { DEMO_ID, demoCase, useStoredPatients } from '../../state/patients';
import { Icon } from '../../ui/Icon';
import { czDate } from '../../ui/format';

interface Hit { id: string; name: string; what: string }

const fold = (s: string) => s.toLocaleLowerCase('cs').normalize('NFD').replace(/[̀-ͯ]/g, '');

export function Search() {
  const stored = useStoredPatients();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  // what can be found: name and diagnosis of each patient, and the name, place and title of every report
  const index = useMemo(() => {
    const demo = demoCase;
    const rows: (Hit & { text: string })[] = [
      { id: DEMO_ID, name: demo.patient.name, what: `${demo.patient.diagnosis.code} ${demo.patient.diagnosis.text}`, text: `${demo.patient.name} ${demo.patient.diagnosis.code} ${demo.patient.diagnosis.text}` },
      ...Object.values(demo.documents).map((d) => ({ id: DEMO_ID, name: demo.patient.name, what: d.ref, text: `${d.ref} ${d.title} ${d.place}` })),
    ];
    for (const p of stored) {
      rows.push({ id: p.id, name: p.label, what: p.docs.length ? `${p.docs.length} zpráv` : 'bez zpráv', text: p.label });
      for (const d of p.docs) rows.push({ id: p.id, name: p.label, what: `${d.title} · ${czDate(d.date)}`, text: `${d.title} ${d.text.slice(0, 400)}` });
    }
    return rows.map((r) => ({ ...r, key: fold(r.text) }));
  }, [stored]);
  const words = fold(q).split(/\s+/).filter(Boolean);
  const hits = words.length ? index.filter((r) => words.every((w) => r.key.includes(w))).slice(0, 8) : [];
  const go = (h: Hit) => { window.location.hash = `#/pacienti/${h.id}`; setQ(''); setOpen(false); };
  return (
    <div className="search-box">
      <label className="search">
        <Icon name="search" size={18} />
        <input
          type="search" placeholder="Hledat pacienta nebo zprávu" aria-label="Hledat" value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 150)}
          onKeyDown={(e) => { if (e.key === 'Enter' && hits[0]) go(hits[0]); if (e.key === 'Escape') { setQ(''); setOpen(false); } }}
        />
      </label>
      {open && words.length > 0 && (
        <ul className="search-hits" role="listbox">
          {hits.length ? hits.map((h, i) => (
            <li key={`${h.id}${h.what}${i}`}>
              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => go(h)}><b>{h.name}</b><small>{h.what}</small></button>
            </li>
          )) : <li className="search-none">Nic nenalezeno</li>}
        </ul>
      )}
    </div>
  );
}
