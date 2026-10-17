// Section "Žádanka od praktika" = the GP's side (owner: Bruno) – starter, not switched on yet. Route #/zadanka (hidden
// from the coordinator's menu).
// To build (docs/PLAN-EKOORDINACE.md, task 1; slide 7 "bez dalšího formuláře"): the GP drops the epikríza (žádanka
// praktika 2. 10.); the fields fill themselves from the engine (patient, ZP, dg. C25.0, what he asks for); completeness
// check before sending ("chybí ECOG", "chybí e-mail pacientky", "výsledky nejsou přiloženy – jsou na 5 pracovištích");
// "Odeslat do KOC 2" → confirmation for the GP ("přijato") and the case appears in the queue as "nový".
// Data: src/sections/pacient/caseData (patient, steps[0].request, documents['07']); record: addEvent (src/state/caseStore).
// Switch on in src/sections.tsx: render: () => <Zadanka /> on the "zadanka" line.
import './zadanka.css';

export function Zadanka() {
  return (
    <section className="card zadanka">
      <div className="card-head"><h2>Žádanka do KOC</h2></div>
      <p className="muted">Připravujeme.</p>
    </section>
  );
}
