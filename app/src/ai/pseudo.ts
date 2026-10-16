// Pseudonymization before any text leaves the machine for an LLM (GDPR: data minimisation).
// Birth numbers, phones, e-mails, addresses, birth dates and given person names are replaced by tokens;
// the LLM answer is mapped back before quotes are verified against the original reports.

export interface TokenMap { [token: string]: string }

export class Pseudonymizer {
  readonly tokens: TokenMap = {};
  private readonly reverse = new Map<string, string>();
  private readonly counters: Record<string, number> = {};
  private readonly names: { text: string; kind: string }[] = [];

  addName(text: string, kind: 'PACIENT' | 'KONTAKT'): void {
    if (text && text.length > 2) this.names.push({ text, kind });
  }

  private token(kind: string, original: string): string {
    const known = this.reverse.get(original);
    if (known) return known;
    this.counters[kind] = (this.counters[kind] ?? 0) + 1;
    const t = `[${kind}_${this.counters[kind]}]`;
    this.tokens[t] = original;
    this.reverse.set(original, t);
    return t;
  }

  apply(text: string): string {
    let out = text;
    out = out.replace(/\b\d{6}\/\d{3,4}\b/g, (m) => this.token('RČ', m));
    out = out.replace(/\+?420(?:\s?\d{3}){3}\b/g, (m) => this.token('TEL', m));
    out = out.replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, (m) => this.token('EMAIL', m));
    out = out.replace(/^(Bydliště:\s*)(.+)$/gm, (_m, label: string, addr: string) => label + this.token('ADRESA', addr));
    out = out.replace(/^(Datum narození:\s*)(\d{1,2}\.\s?\d{1,2}\.\s?\d{4})/gm, (_m, label: string, d: string) => label + this.token('NAROZENÍ', d));
    for (const n of [...this.names].sort((a, b) => b.text.length - a.text.length)) {
      out = out.split(n.text).join(this.token(n.kind, n.text));
    }
    return out;
  }

  restore(text: string): string {
    return text.replace(/\[[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]+_\d+\]/g, (t) => this.tokens[t] ?? t);
  }
}
