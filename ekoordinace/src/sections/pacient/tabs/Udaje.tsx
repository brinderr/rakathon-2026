// Tab "Údaje pro konzilium" (owner: Matej) – handover 20 údajů podle Handover_obsah, stav, citace, Kopírovat, doplnění (telefonát), ověření rozporu, potvrzení lékařem.
import type { OpenDoc } from '../Journey';
import { Soon } from './Soon';

export function Udaje(_props: { openDoc: OpenDoc }) {
  return <Soon title="Údaje pro konzilium" />;
}
