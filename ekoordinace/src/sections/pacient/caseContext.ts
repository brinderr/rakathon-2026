// The case shown in the "Pacienti" section (demo or added patient), for the tabs: const { id, data } = useCaseData().
import { createContext, useContext } from 'react';
import type { CaseData } from './types';

export const CaseCtx = createContext<{ id: string; data: CaseData } | null>(null);

export function useCaseData(): { id: string; data: CaseData } {
  const c = useContext(CaseCtx);
  if (!c) throw new Error('useCaseData() is only available inside a patient case');
  return c;
}
