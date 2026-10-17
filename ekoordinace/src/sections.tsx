// The sections of the app, one per item in the side menu. A section is a folder in src/sections/<name>/ with its own
// components and CSS; register it here with one line. A section without `render` shows greyed out in the menu.
// Owners (see README): pacienti, prehled, konzilia – Matej; zadanka – Bruno. The address picks the section: #/pacienti, …
import type { ReactNode } from 'react';
import { Konzilia } from './sections/konzilia/Konzilia';
import { PatientPage } from './sections/pacient/PatientPage';
import { Fronta } from './sections/prehled/Fronta';
import { Zadanka } from './sections/zadanka/Zadanka';

export interface Section {
  id: string;
  label: string;
  icon: string;
  /** Renders the section; `path` is the rest of the address, e.g. ["ukoly"] for #/pacienti/ukoly. */
  render?: (path: string[]) => ReactNode;
  /** Reachable by its address but not listed in the side menu (e.g. the GP's referral page). */
  hidden?: boolean;
}

export const DEFAULT_SECTION = 'prehled';

export const SECTIONS: Section[] = [
  { id: 'prehled', label: 'Přehled', icon: 'grid', render: () => <Fronta /> },
  { id: 'pacienti', label: 'Pacienti', icon: 'user', render: (path) => <PatientPage path={path} /> },
  { id: 'konzilia', label: 'Konzilia', icon: 'calendar', render: () => <Konzilia /> },
  { id: 'zadanka', label: 'Žádanka od praktika', icon: 'note', render: () => <Zadanka /> }, // Bruno – the GP's entry (VZP slide 7), shown in the menu for the demo
];
