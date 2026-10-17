// Section "Konzilia" (owner: Bruno) – starter, not switched on yet. To switch it on, import this file in
// src/sections.tsx and add `render: () => <Konzilia />` to the "konzilia" line.
// Styles go to ./konzilia.css; shared blocks (card, card-head, stats, tabs, chips, eyebrow) are in src/styles.css.
import './konzilia.css';

export function Konzilia() {
  return (
    <>
      <nav className="crumbs" aria-label="Drobečková navigace"><span className="crumb-now">Konzilia</span></nav>
      <section className="card konzilia-start">
        <div className="card-head"><h2>Konzilia</h2></div>
        <p className="muted">Připravujeme.</p>
      </section>
    </>
  );
}
