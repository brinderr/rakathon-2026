// Minimal OpenAI-compatible chat client (Azure OpenAI / Azure APIM of the Rakathon portal, or any OpenAI-compatible
// endpoint). No SDK, only fetch. Keys come from the caller (Node: app/.env); never ship a key to the browser.

export interface ChatMessage { role: 'system' | 'user' | 'assistant'; content: string }
export interface LlmRequest { messages: ChatMessage[]; temperature: number; json: boolean }
export interface LlmResponse { text: string; model: string }
export type Complete = (req: LlmRequest) => Promise<LlmResponse>;

export interface AzureConfig {
  endpoint: string;      // e.g. https://<apim>.azure-api.net or https://<resource>.openai.azure.com
  apiKey: string;        // header "api-key"
  deployment: string;    // deployment name, e.g. gpt-6-1-sol-dz-eu (EU data zone)
  apiVersion?: string;   // set → classic Azure path /openai/deployments/{d}/chat/completions?api-version=…
}

export interface RetryOptions { maxRetries?: number; log?: (msg: string) => void }

const RETRY_STATUS = new Set([408, 409, 429, 500, 502, 503, 504]);

function sleep(ms: number): Promise<void> { return new Promise((r) => setTimeout(r, ms)); }

async function postWithRetry(url: string, headers: Record<string, string>, body: unknown, opts: RetryOptions): Promise<unknown> {
  const max = opts.maxRetries ?? 6;
  let payload = body as Record<string, unknown>;
  for (let attempt = 0; ; attempt++) {
    let res: Response | null = null;
    let networkError: unknown = null;
    try {
      res = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(payload) });
    } catch (e) { networkError = e; }
    if (res && res.ok) return res.json();
    const status = res?.status ?? 0;
    const text = res ? await res.text() : String(networkError);
    // Some reasoning deployments reject a custom temperature – drop it once and retry immediately.
    if (status === 400 && /temperature/i.test(text) && 'temperature' in payload) {
      const { temperature: _t, ...rest } = payload;
      void _t;
      payload = rest;
      continue;
    }
    if ((networkError || RETRY_STATUS.has(status)) && attempt < max) {
      const ra = Number(res?.headers.get('retry-after'));
      const wait = Number.isFinite(ra) && ra > 0 ? ra * 1000 : Math.min(30_000, 1000 * 2 ** attempt) + Math.floor(Math.random() * 400);
      opts.log?.(`LLM ${status || 'network'} – opakujem o ${Math.round(wait / 1000)} s (pokus ${attempt + 1}/${max})`);
      await sleep(wait);
      continue;
    }
    throw new Error(`LLM request failed (${status}): ${text.slice(0, 300)}`);
  }
}

function pickText(data: unknown): string {
  const d = data as { choices?: { message?: { content?: string } }[] };
  return d.choices?.[0]?.message?.content ?? '';
}

export function azureComplete(cfg: AzureConfig, opts: RetryOptions = {}): Complete {
  const base = cfg.endpoint.replace(/\/+$/, '');
  const url = cfg.apiVersion
    ? `${base}/openai/deployments/${encodeURIComponent(cfg.deployment)}/chat/completions?api-version=${encodeURIComponent(cfg.apiVersion)}`
    : `${base}/openai/v1/chat/completions`;
  return async (req) => {
    const body: Record<string, unknown> = { messages: req.messages, temperature: req.temperature };
    if (!cfg.apiVersion) body.model = cfg.deployment;
    if (req.json) body.response_format = { type: 'json_object' };
    const data = await postWithRetry(url, { 'api-key': cfg.apiKey }, body, opts);
    return { text: pickText(data), model: `azure:${cfg.deployment}` };
  };
}

export function openAiCompatibleComplete(cfg: { baseUrl: string; apiKey: string; model: string }, opts: RetryOptions = {}): Complete {
  const url = `${cfg.baseUrl.replace(/\/+$/, '')}/chat/completions`;
  return async (req) => {
    const body: Record<string, unknown> = { model: cfg.model, messages: req.messages, temperature: req.temperature };
    if (req.json) body.response_format = { type: 'json_object' };
    const data = await postWithRetry(url, { authorization: `Bearer ${cfg.apiKey}` }, body, opts);
    return { text: pickText(data), model: `openai-compatible:${cfg.model}` };
  };
}

/** Stable SHA-256 of a request (used as the offline cache key). Works in Node 22 and browsers. */
export async function requestHash(req: LlmRequest): Promise<string> {
  const bytes = new TextEncoder().encode(JSON.stringify(req));
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
}

/** Parse a JSON answer that may be wrapped in ```json fences. */
export function parseJsonAnswer(text: string): unknown {
  const t = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
  const start = t.indexOf('{');
  const end = t.lastIndexOf('}');
  return JSON.parse(start >= 0 && end > start ? t.slice(start, end + 1) : t);
}
