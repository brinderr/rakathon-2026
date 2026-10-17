// CORDIN mark (A1 "kruh"): a loop from the GP through the centre and the MDT back to the GP; the chevron = whose turn it is.
export function Mark({ size = 28, title }: { size?: number; title?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M159.9,53.2 A76,76 0 1 0 159.9,146.8" strokeWidth="22" />
        <path d="M141,68 A52,52 0 1 0 141,132" strokeWidth="10" />
        <polyline points="124,78 150,100 124,122" strokeWidth="16" />
      </g>
    </svg>
  );
}
