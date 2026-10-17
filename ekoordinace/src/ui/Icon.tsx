// Line icons (24 × 24, 1.75 stroke), drawn here so the app needs no icon library. Shared by all sections.
const PATHS: Record<string, string> = {
  grid: 'M4.5 3.5h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1Zm10 0h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1Zm-10 10h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1Zm10 0h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1Z',
  user: 'M5.5 3.5h13a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2ZM12 7.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM7.2 20c.9-2.4 2.7-3.6 4.8-3.6s3.9 1.2 4.8 3.6',
  calendar: 'M5 5h14a1.5 1.5 0 0 1 1.5 1.5V19a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19V6.5A1.5 1.5 0 0 1 5 5Zm3-2.5v4m8-4v4M3.5 10h17',
  search: 'M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14Zm9 16-3.6-3.6',
  mail: 'M5 5.5h14a1.5 1.5 0 0 1 1.5 1.5v10a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 17V7A1.5 1.5 0 0 1 5 5.5Zm-1 1.5 8 5.5 8-5.5',
  bell: 'M6 10a6 6 0 1 1 12 0c0 5.5 2.3 7 2.3 7H3.7S6 15.5 6 10Zm4 10a2.2 2.2 0 0 0 4 0',
  note: 'M7 4.5h10A1.5 1.5 0 0 1 18.5 6v14A1.5 1.5 0 0 1 17 21.5H7A1.5 1.5 0 0 1 5.5 20V6A1.5 1.5 0 0 1 7 4.5Zm2-2h6v4H9v-4Zm0 9h6m-6 4h4',
  phone: 'M6 3.5h3l1.6 4.2-2.1 1.4a11 11 0 0 0 6.4 6.4l1.4-2.1 4.2 1.6v3a2 2 0 0 1-2 2A15.5 15.5 0 0 1 4 5.5a2 2 0 0 1 2-2Z',
  message: 'M4.5 5h15A1.5 1.5 0 0 1 21 6.5v9a1.5 1.5 0 0 1-1.5 1.5H9.5L5 20.5V17h-.5A1.5 1.5 0 0 1 3 15.5v-9A1.5 1.5 0 0 1 4.5 5Z',
  download: 'M12 4v11m-4.5-4.5L12 15l4.5-4.5M4.5 19.5h15',
  file: 'M6.5 3h7.5l4.5 4.5V21h-12V3Zm7.5 0v4.5h4.5M9 12h6m-6 4h6',
  check: 'm5 12.5 4.5 4.5L19 7.5',
  alert: 'M12 4 21 19.5H3L12 4Zm0 6v4.5m0 2.5v.5',
  clock: 'M12 3.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17ZM12 7.5V12l3 2',
  fields: 'M4 6h16M4 12h16M4 18h10',
  right: 'm9.5 6 6 6-6 6',
  up: 'm6.5 14.5 5.5-5.5 5.5 5.5',
  down: 'm6.5 9.5 5.5 5.5 5.5-5.5',
};

export function Icon({ name, size = 20 }: { name: keyof typeof PATHS | string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="icon">
      <path d={PATHS[name] ?? ''} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
