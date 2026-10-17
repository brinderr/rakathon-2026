// "Zeptat se AI" (Vercel Function): the coordinator asks anything about what the app holds – patients, reports and
// when they came, to-dos, MDTs, the coordination record – and Claude answers only from that data, with the source of
// each fact. The browser sends a snapshot of the app state already pseudonymized (birth numbers, phones, e-mails,
// addresses and names replaced by tokens) and maps the tokens back in the answer. The key lives only in the Vercel
// project settings (ANTHROPIC_API_KEY).
import { createAnthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';

const MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-5-5';
const ALLOWED = /^(https:\/\/ekoordinace(-[\w-]+)?\.vercel\.app|http:\/\/localhost(:\d+)?)$/;
const MAX_CONTEXT = 240_000;

const SYSTEM = `Jsi asistent koordinátorky komplexního onkologického centra v aplikaci eKoordinace.
Odpovídáš na otázky o pacientech, jejich zprávách (kdy přišly a co v nich je), úkolech, konziliích a záznamu koordinace.
Odpovídej JEN z dat v bloku <data> (stav aplikace k simulovanému dni). Když odpověď v datech není, napiš „V datech to není.“ a nic nedomýšlej.
Nedávej lékařská doporučení ani nehodnoť léčbu – jsi pomocník pro koordinaci, ne lékař.
U každého faktu uveď zdroj v závorce, např. „(Alena, histologie 19. 10.)“ nebo „(záznam koordinace 19. 10. 10:12)“.
Osobní údaje jsou nahrazené značkami jako [PACIENT_1], [RČ_1], [TEL_1] – používej je přesně tak, jak jsou.
Když se ptá na priority nebo na to, co je urgentní, seřaď body podle termínu (dřívější = naléhavější) a u každého řekni, co udělat.

FORMÁT ODPOVĚDI (vždy):
- První řádek: jedna krátká věta se shrnutím.
- Potom odrážky začínající „- “: jedna odrážka na pacienta nebo na bod. Na začátku odrážky tučně jméno nebo téma (**Alena Procházková** – …), pak stručně co, do kdy a co udělat.
- Zdroj vždy na konci odrážky v kulaté závorce.
- Žádné nadpisy, tabulky ani dlouhé odstavce; nejvýše 6 odrážek.
Piš česky, stručně a věcně.`;

interface Req { method?: string; headers: Record<string, string | string[] | undefined>; body?: unknown }
interface Res { status: (n: number) => Res; json: (b: unknown) => void; setHeader: (k: string, v: string) => void }
const send = (res: Res, status: number, body: unknown) => res.status(status).json(body);

/** The AI SDK (v4) always sends `temperature: 0`; the current Claude models reject sampling parameters – drop them.
 *  A quick chat answer does not need extended thinking (it would eat the whole answer budget on a large context), so
 *  it is switched off; if a model does not allow that, the request goes again as it was. */
const tuned: typeof fetch = async (url, init) => {
  if (typeof init?.body !== 'string') return fetch(url, init);
  const body = JSON.parse(init.body) as Record<string, unknown>;
  delete body.temperature;
  delete body.top_p;
  delete body.top_k;
  const first = await fetch(url, { ...init, body: JSON.stringify({ ...body, thinking: { type: 'disabled' } }) });
  if (first.status !== 400) return first;
  return fetch(url, { ...init, body: JSON.stringify(body) });
};

export default async function handler(req: Req, res: Res) {
  res.setHeader('Cache-Control', 'no-store');
  const key = process.env.ANTHROPIC_API_KEY;
  if (req.method === 'GET') return send(res, 200, { claude: Boolean(key), model: MODEL });
  if (req.method !== 'POST') return send(res, 405, { error: 'Jen GET nebo POST.' });
  if (!key) return send(res, 503, { error: 'AI není zapnutá – v nastavení projektu na Vercelu chybí ANTHROPIC_API_KEY.' });
  const origin = String(req.headers.origin ?? '');
  if (origin && !ALLOWED.test(origin)) return send(res, 403, { error: 'Volání je povolené jen z eKoordinace.' });

  const body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) as { question?: unknown; context?: unknown; history?: unknown } | undefined;
  const question = String(body?.question ?? '').trim().slice(0, 2000);
  const context = String(body?.context ?? '').slice(0, MAX_CONTEXT);
  const history = (Array.isArray(body?.history) ? body!.history : [])
    .filter((m): m is { role: 'user' | 'assistant'; content: string } => Boolean(m) && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-6);
  if (!question) return send(res, 400, { error: 'Prázdná otázka.' });

  try {
    const anthropic = createAnthropic({ apiKey: key, fetch: tuned });
    const { text, usage, finishReason } = await generateText({
      model: anthropic(MODEL),
      system: `${SYSTEM}\n\n<data>\n${context}\n</data>`,
      messages: [...history, { role: 'user', content: question }],
      maxTokens: 4000,
    });
    if (!text.trim()) return send(res, 502, { error: `AI nevrátila odpověď (${finishReason}) – zkuste otázku zúžit.` });
    return send(res, 200, { model: MODEL, answer: text, usage });
  } catch (e) {
    return send(res, 502, { error: `AI neodpověděla: ${e instanceof Error ? e.message : String(e)}` });
  }
}
