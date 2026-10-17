// The only backend of eKoordinace (Vercel Function): Claude reads the reports of one patient and returns their
// structure – type, date, workplace, author, what the report brings for the MDT and its key facts, each with a verbatim
// quote. The browser sends the text already pseudonymized and checks every quote against the original report itself,
// so a fact without support never reaches the coordinator. GET says whether Claude is switched on (the key is set).
// The key lives only in the Vercel project settings (ANTHROPIC_API_KEY), never in the code or the browser.
import { createAnthropic } from '@ai-sdk/anthropic';
import { generateObject } from 'ai';
import { z } from 'zod';

const MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-5-5';
const MAX_DOCS = 15;
const MAX_CHARS = 120_000;
// only our own pages may call it (production, previews, local development)
const ALLOWED = /^(https:\/\/ekoordinace(-[\w-]+)?\.vercel\.app|http:\/\/localhost(:\d+)?)$/;

const KINDS = ['žádanka', 'ambulantní zpráva', 'laboratoř', 'zobrazovací vyšetření', 'endoskopie / výkon', 'histologie', 'konziliární zpráva', 'propouštěcí zpráva', 'jiné'] as const;

const Schema = z.object({
  documents: z.array(z.object({
    id: z.string().describe('id dokumentu přesně jak je v nadpisu „Dokument …“'),
    kind: z.enum(KINDS),
    title: z.string().describe('krátký název, jak by dokument nazvala koordinátorka (např. „CT hrudníku a břicha“)'),
    date: z.string().describe('datum dokumentu RRRR-MM-DD, jen když je v textu; jinak prázdné'),
    facility: z.string().describe('pracoviště, jak je v textu'),
    author: z.string().describe('kdo zprávu podepsal, jak je v textu; jinak prázdné'),
    summary: z.string().describe('1–2 věty: co zpráva přináší pro onkologické konzilium'),
    facts: z.array(z.object({
      label: z.string().describe('co to je (např. „Diagnóza“, „ECOG“, „Léky“, „Výsledek CT“)'),
      value: z.string().describe('hodnota stručně'),
      quote: z.string().describe('DOSLOVNÝ úsek textu té zprávy, ze kterého hodnota plyne – zkopírovaný beze změny'),
    })).max(8),
    gaps: z.array(z.string()).max(4).describe('co ve zprávě chybí nebo nesedí a je důležité pro konzilium; jinak prázdné'),
  })),
});

const SYSTEM = `Jsi pečlivý asistent koordinátorky komplexního onkologického centra (KOC).
Dostaneš lékařské zprávy jednoho pacienta. Osobní údaje jsou nahrazené značkami jako [PACIENT_1], [RČ_1], [TEL_1] – nech je beze změny.
U každé zprávy urči typ, datum, pracoviště, autora, krátké shrnutí pro konzilium a nejvýše 8 klíčových údajů.
Každý údaj MUSÍ mít doslovný citát z textu té zprávy, zkopírovaný beze změny (žádná parafráze, žádné doplnění). Když citát nenajdeš, údaj vynech.
Nic nedomýšlej: žádné diagnózy, stadia, doporučení ani data, která ve zprávě nejsou. Piš česky, věcně, bez úvodu.`;

const send = (res: Res, status: number, body: unknown) => res.status(status).json(body);
interface Req { method?: string; headers: Record<string, string | string[] | undefined>; body?: unknown }
interface Res { status: (n: number) => Res; json: (b: unknown) => void; setHeader: (k: string, v: string) => void }

/** The AI SDK (v4) always sends `temperature: 0`; the current Claude models reject sampling parameters – drop them. */
const withoutSampling: typeof fetch = (url, init) => {
  if (typeof init?.body !== 'string') return fetch(url, init);
  const body = JSON.parse(init.body) as Record<string, unknown>;
  delete body.temperature;
  delete body.top_p;
  delete body.top_k;
  return fetch(url, { ...init, body: JSON.stringify(body) });
};

export default async function handler(req: Req, res: Res) {
  res.setHeader('Cache-Control', 'no-store');
  const key = process.env.ANTHROPIC_API_KEY;
  if (req.method === 'GET') return send(res, 200, { claude: Boolean(key), model: MODEL });
  if (req.method !== 'POST') return send(res, 405, { error: 'Jen GET nebo POST.' });
  if (!key) return send(res, 503, { error: 'Claude není zapnutý – v nastavení projektu na Vercelu chybí ANTHROPIC_API_KEY.' });
  const origin = String(req.headers.origin ?? '');
  if (origin && !ALLOWED.test(origin)) return send(res, 403, { error: 'Volání je povolené jen z eKoordinace.' });

  const body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) as { documents?: { id?: unknown; text?: unknown }[] } | undefined;
  const docs = (body?.documents ?? []).map((d) => ({ id: String(d.id ?? ''), text: String(d.text ?? '') })).filter((d) => d.id && d.text.trim());
  if (!docs.length) return send(res, 400, { error: 'Žádná zpráva k přečtení.' });
  if (docs.length > MAX_DOCS) return send(res, 413, { error: `Najednou nejvýše ${MAX_DOCS} zpráv.` });
  if (docs.reduce((n, d) => n + d.text.length, 0) > MAX_CHARS) return send(res, 413, { error: 'Zprávy jsou příliš dlouhé na jedno čtení.' });

  try {
    const anthropic = createAnthropic({ apiKey: key, fetch: withoutSampling });
    const { object, usage } = await generateObject({
      model: anthropic(MODEL),
      schema: Schema,
      system: SYSTEM,
      prompt: docs.map((d) => `### Dokument ${d.id}\n${d.text}`).join('\n\n'),
      maxTokens: 12000,
    });
    return send(res, 200, { model: MODEL, documents: object.documents, usage });
  } catch (e) {
    return send(res, 502, { error: `Claude neodpověděl: ${e instanceof Error ? e.message : String(e)}` });
  }
}
