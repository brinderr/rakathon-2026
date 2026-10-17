// Tab "Plán cesty" (owner: Bruno) – every step the coordinator arranges, with date, place, status and who is on turn.
// To build (docs/PLAN-EKOORDINACE.md, task 4 in Zadani_ulohy): CT (KOC 1, 8. 10.), biopsie EUS-FNB (KOC 2, 12. 10.),
// kontrolní odběry (KOC 2, 15. 10.), histologie (slíbeno do 15. 10., doručeno 19. 10. → zpoždění), algeziologie (KOC 1,
// objednáno 26. 10.), psychologie (KOC 2, objednáno 27. 10.). Status: vyžádáno → objednáno → provedeno → výsledek
// doručen. Per step "SMS pacientce" / "E-mail pracovišti" (simulated, written with addEvent to the coordination record).
// Data: caseData.steps (koordinovat), documents, afterMdt (../caseData); state: src/state/caseStore.
import type { OpenDoc } from '../Journey';
import { Soon } from './Soon';

export function Plan(_props: { openDoc: OpenDoc }) {
  return <Soon title="Plán cesty" />;
}
