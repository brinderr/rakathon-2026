// Načítanie textov správ (fiktívne dáta) a hľadanie citátov v nich.
// Mapa id → text: správy 01–13 z public/data/source.json, zápis z konzília ('MDT' = šablóna „MDT zaver“),
// fiktívna doplnková správa 14 (EXTRA_DOCS) a texty ľahkých prípadov (SourceDoc.text v CASES).

import { useEffect, useState } from 'react';
import type { SourceDoc } from '../types';
import { CASES, EXTRA_DOCS } from './cases';

interface SourceJson {
  documents: { id: string; file: string; date: string; text: string }[];
  templates: Record<string, string>;
}

let cache: Promise<Record<string, string>> | null = null;

/** Načíta všetky texty správ raz (výsledok sa cachuje). */
export function loadSources(): Promise<Record<string, string>> {
  if (!cache) {
    cache = fetch(`${import.meta.env.BASE_URL}data/source.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`source.json: HTTP ${r.status}`);
        return r.json() as Promise<SourceJson>;
      })
      .then((json) => {
        const map: Record<string, string> = {};
        for (const d of json.documents) map[d.id] = d.text;
        if (json.templates['MDT zaver']) map.MDT = json.templates['MDT zaver'];
        for (const c of CASES) for (const d of c.docs) if (d.text && !map[d.id]) map[d.id] = d.text;
        return { ...map, ...EXTRA_DOCS };
      })
      .catch((e: unknown) => {
        cache = null; // ďalší pokus môže uspieť
        throw e;
      });
  }
  return cache;
}

/** Pozícia doslovného citátu v texte, alebo -1. */
export function findQuote(text: string, quote: string): number {
  if (!text || !quote) return -1;
  return text.indexOf(quote);
}

/** Doplní SourceDoc.text z načítanej mapy (dokumenty, ktoré už text majú, nemení). */
export function withTexts(docs: SourceDoc[], sources: Record<string, string>): SourceDoc[] {
  return docs.map((d) => (d.text || !sources[d.id] ? d : { ...d, text: sources[d.id] }));
}

/** React hook: mapa id → text (null, kým sa nenačíta). */
export function useSources(): Record<string, string> | null {
  const [sources, setSources] = useState<Record<string, string> | null>(null);
  useEffect(() => {
    let alive = true;
    loadSources()
      .then((s) => alive && setSources(s))
      .catch(() => alive && setSources({}));
    return () => {
      alive = false;
    };
  }, []);
  return sources;
}
