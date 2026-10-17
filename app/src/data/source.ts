// Načtení textů zpráv (fiktivní data) a hledání citátů v nich.
// Mapa id → text: zprávy Aleny 01–13 z public/data/source.json, zápis z MDT ('MDT' = šablona „MDT zaver“)
// a texty ostatních případů ze SourceDoc.text v CASES (Josef Novák N-01…N-10, lehké případy K-/P-/R-).
// ID zpráv jsou napříč případy jedinečná – hlídá npm run verify. Záznamy koordinátorky (telefonát, id T-…)
// vznikají až za běhu dema a do této mapy nepatří – nejsou to zprávy.

import { useEffect, useState } from 'react';
import type { SourceDoc } from '../types';
import { CASES } from './cases';

interface SourceJson {
  documents: { id: string; file: string; date: string; text: string }[];
  templates: Record<string, string>;
}

let cache: Promise<Record<string, string>> | null = null;

/** Načte všechny texty zpráv jednou (výsledek se cachuje). */
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
        return map;
      })
      .catch((e: unknown) => {
        cache = null; // další pokus může uspět
        throw e;
      });
  }
  return cache;
}

/** Pozice doslovného citátu v textu, nebo -1. */
export function findQuote(text: string, quote: string): number {
  if (!text || !quote) return -1;
  return text.indexOf(quote);
}

/** Doplní SourceDoc.text z načtené mapy (dokumenty, které už text mají, nemění). */
export function withTexts(docs: SourceDoc[], sources: Record<string, string>): SourceDoc[] {
  return docs.map((d) => (d.text || !sources[d.id] ? d : { ...d, text: sources[d.id] }));
}

/** React hook: mapa id → text (null, dokud se nenačte). */
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
