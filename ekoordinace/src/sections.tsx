// The sections of the app, one per item in the side menu. A section is a folder in src/sections/<name>/ with its own
// components and CSS; register it here with one line. A section without `render` shows greyed out in the menu.
// Owners (see README): pacienti – Matej, konzilia – Bruno. The address picks the section: #/pacienti, #/konzilia/…
import type { ReactNode } from 'react';
import { PatientPage } from './sections/pacient/PatientPage';

export interface Section {
  id: string;
  label: string;
  icon: string;
  /** Renders the section; `path` is the rest of the address, e.g. ["ukoly"] for #/pacienti/ukoly. */
  render?: (path: string[]) => ReactNode;
}

export const DEFAULT_SECTION = 'pacienti';

export const SECTIONS: Section[] = [
  { id: 'prehled', label: 'Přehled', icon: 'grid' },
  { id: 'pacienti', label: 'Pacienti', icon: 'user', render: (path) => <PatientPage path={path} /> },
  { id: 'konzilia', label: 'Konzilia', icon: 'calendar' }, // Bruno: render: () => <Konzilia /> (src/sections/konzilia)
];
