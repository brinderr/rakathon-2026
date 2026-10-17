// The case shown in the "Pacienti" section (demo or added patient), for the tabs: const { id, data } = useCaseData().
// `data` already includes what the coordinator filled in or checked (./live.ts); `focus` = the item named in the address
// (#/pacienti/<id>/udaje/<item>).
import { createContext, useContext } from 'react';
import type { CaseData } from './types';

export const CaseCtx = createContext<{ id: string; data: CaseData; focus?: string } | null>(null);

export function useCaseData(): { id: string; data: CaseData; focus?: string } {
  const c = useContext(CaseCtx);
  if (!c) throw new Error('useCaseData() is only available inside a patient case');
  return c;
}
