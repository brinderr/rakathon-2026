// Section "Přehled" = the coordinator's queue (owner: Bruno) – starter, not switched on yet.
// To build (docs/PLAN-EKOORDINACE.md, task 3; slide 9): one row per patient with state (nový / aktivní / odložený),
// current step, who is on turn and until when, number of open to-dos; filters Čeká na mě · Čeká na jiné · Po termínu ·
// Konzilium tento týden. Alena from src/sections/pacient/caseData (+ live state via useCase from src/state/caseStore),
// Novák and Brabec computed by the engine (app/data-pacient-2, app/data-pacient-3) with your own script → src/data/fronta.json.
// Switch on in src/sections.tsx: render: () => <Fronta /> on the "prehled" line.
import './fronta.css';

export function Fronta() {
  return (
    <section className="card fronta">
      <div className="card-head"><h2>Moje případy</h2></div>
      <p className="muted">Připravujeme.</p>
    </section>
  );
}
