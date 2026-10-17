// Tab "Zprávy" (owner: Bruno) – all reports of the patient in one place, like a file list. The reports known before the
// MDT (they go into the handover) are listed newest first with a filter by type; a click opens the reader with the
// sentences the engine used highlighted. Below, the reports that came after the MDT – kept apart, they do not belong in
// the handover (VZP assignment: "Do zprávy pro MDT patří jen to, co bylo k 21. 10. 2026 známo").
import { useState } from 'react';
import type { OpenDoc } from '../Journey';
import { DocList } from '../Journey';
import { useCaseData } from '../caseContext';
import { czDate } from '../../../ui/format';
import './zpravy.css';

const TYPE_LABEL: Record<string, string> = {
  ŽÁD: 'Žádanka', LAB: 'Laboratoř', HIS: 'Histologie', AMB: 'Ambulance', CT: 'CT', UZ: 'Ultrazvuk', RTG: 'RTG', EUS: 'Endoskopie',
};

export function Zpravy({ openDoc }: { openDoc: OpenDoc }) {
  const { data } = useCaseData();
  const [type, setType] = useState('');
  const known = Object.values(data.documents).sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  const types = [...new Set(known.map((d) => d.code))];
  const shown = type ? known.filter((d) => d.code === type) : known;

  return (
    <div className="zp">
      <section className="card">
        <div className="card-head">
          <h2>Zprávy pacienta</h2>
          <span className="muted">{known.length} {known.length === 1 ? 'zpráva' : known.length < 5 ? 'zprávy' : 'zpráv'} do konzilia{data.mdtDate ? ` ${czDate(data.mdtDate)}` : ''}</span>
        </div>
        <p className="muted zp-intro">Všechny zprávy na jednom místě, nejnovější nahoře. Klikněte na zprávu – otevře se celá, se zvýrazněnými větami, ze kterých aplikace vzala údaje.</p>
        {types.length > 1 && (
          <div className="zp-filter" role="group" aria-label="Filtr podle typu zprávy">
            <button type="button" className={`zp-pill${type === '' ? ' on' : ''}`} aria-pressed={type === ''} onClick={() => setType('')}>Vše ({known.length})</button>
            {types.map((t) => (
              <button key={t} type="button" className={`zp-pill${type === t ? ' on' : ''}`} aria-pressed={type === t} onClick={() => setType(t)}>
                {TYPE_LABEL[t] ?? t} ({known.filter((d) => d.code === t).length})
              </button>
            ))}
          </div>
        )}
        <DocList docs={shown} onOpen={(id) => openDoc(id)} />
      </section>

      {data.afterMdt.length > 0 && (
        <section className="card zp-after">
          <div className="card-head">
            <h2>Po konziliu – nepatří do podkladu</h2>
            <span className="chip conf">{data.afterMdt.length} {data.afterMdt.length === 1 ? 'zpráva' : 'zprávy'}</span>
          </div>
          <p className="muted zp-intro">Tyto zprávy vznikly až po konziliu{data.mdtDate ? ` ${czDate(data.mdtDate)}` : ''}. Do podkladu pro konzilium se nezapočítávají, aby lékaři viděli jen to, co se v den konzilia vědělo.</p>
          <ul className="zp-later">
            {data.afterMdt.map((d) => (
              <li key={d.id}>
                <span className="zp-code">{d.code}</span>
                <span className="zp-what"><b>{d.what ? `${d.what} · ` : ''}{d.title}</b><span className="muted">{d.place}</span></span>
                <span className="mono">{czDate(d.date)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
