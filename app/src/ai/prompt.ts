// Prompt for the LLM part of the extractor. The LLM only drafts the free-text fields; every quote it returns is
// verified by code against the original report before anything is shown as a fact.
import type { ISODate } from '../types.ts';
import type { FieldSpec } from './fields.ts';
import type { ChatMessage, LlmRequest } from './llm.ts';
import { czDate } from './text.ts';

export const PROMPT_VERSION = 'handover-v1';

const SYSTEM = `Jsi pečlivý asistent koordinátora onkologické péče v Komplexním onkologickém centru (KOC).
Z lékařských zpráv připravuješ strukturovaný podklad (handover) pro multidisciplinární tým (MDT).
Nejsi lékař: nestanovuješ diagnózu, nedoporučuješ léčbu, nic nedomýšlíš a nic neodhaduješ.

Pravidla:
1. Každá vyplněná hodnota musí mít alespoň jednu citaci {"docId","quote"}. "quote" je DOSLOVNÝ souvislý úryvek
   z dané zprávy (zkopíruj přesně včetně diakritiky, čísel a interpunkce), 10–220 znaků, bez vynechávek a bez „…“.
2. "value" je stručná (nejvýše 300 znaků), česky, a skládá se ze slov a čísel z citací. Nepiš žádné číslo ani datum,
   které není v citacích.
3. Když údaj ve zprávách chybí, dej "status":"missing", "value":"", "citations":[] a do "note" napiš, co přesně chybí.
4. Když si zprávy odporují, dej "status":"conflict", vyplň "conflict":{"a":{"value","citation"},"b":{"value","citation"},"explain"}
   a nerozhoduj, která verze platí – rozhodne člověk.
5. Pokud je údaj obecný nebo neúplný (např. otázka na MDT), uveď to krátce v "note".
6. Tokeny jako [RČ_1], [TEL_1], [ADRESA_1], [PACIENT_1], [KONTAKT_1], [NAROZENÍ_1] jsou pseudonymizované osobní údaje.
   Nepřepisuj je a nevymýšlej jejich obsah; v citaci je ponech tak, jak jsou.
7. Máš jen zprávy známé k datu MDT. Nic z budoucnosti nepředpokládej.
8. Odpověz POUZE jedním validním JSON objektem podle schématu, bez dalšího textu.`;

const SCHEMA = `{"fields":[{"key":"<klíč>","status":"proposed|missing|conflict","value":"<text>",
"citations":[{"docId":"07","quote":"<doslovný úryvek>"}],"note":"<volitelně>",
"conflict":{"a":{"value":"<text>","citation":{"docId":"..","quote":".."}},"b":{"value":"<text>","citation":{"docId":"..","quote":".."}},"explain":"<1 věta>"}}]}`;

export interface PromptDoc { id: string; date: ISODate; text: string }

export function buildRequest(docs: PromptDoc[], specs: FieldSpec[], mdtDate: ISODate): LlmRequest {
  const fieldList = specs.map((s) => `- ${s.key} (${s.template}): ${s.hint}`).join('\n');
  const reports = docs.map((d) => `### Zpráva ${d.id} · ${czDate(d.date)}\n${d.text.trim()}`).join('\n\n');
  const user = `Datum MDT: ${czDate(mdtDate)}.
Vyplň tato pole podkladu pro MDT:
${fieldList}

Schéma odpovědi:
${SCHEMA}

Zprávy (${docs.length}):

${reports}`;
  const messages: ChatMessage[] = [
    { role: 'system', content: SYSTEM },
    { role: 'user', content: user },
  ];
  return { messages, temperature: 0, json: true };
}
