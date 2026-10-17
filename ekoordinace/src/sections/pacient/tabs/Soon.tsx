// Placeholder for a tab that is being built (shows in the app until its owner replaces it).
export function Soon({ title }: { title: string }) {
  return (
    <section className="card tab-soon" aria-label={title}>
      <div className="card-head"><h2>{title}</h2></div>
      <p className="muted">Připravujeme.</p>
    </section>
  );
}
