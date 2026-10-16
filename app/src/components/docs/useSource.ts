// Loads public/data/source.json (13 fictional reports + VZP templates) once and caches it.
// Independent of src/data/source.ts so the document screens work even while that module evolves.
import { useEffect, useState } from 'react';

export interface SourceJsonDoc { id: string; file: string; date: string; text: string }
export interface SourceJson { documents: SourceJsonDoc[]; templates: Record<string, string> }

let cache: SourceJson | null = null;
let pending: Promise<SourceJson> | null = null;

export function loadSourceJson(): Promise<SourceJson> {
  if (cache) return Promise.resolve(cache);
  if (!pending) {
    pending = fetch(`${import.meta.env.BASE_URL}data/source.json`)
      .then(r => { if (!r.ok) throw new Error(`source.json ${r.status}`); return r.json() as Promise<SourceJson>; })
      .then(j => { cache = j; return j; })
      .catch(err => { pending = null; throw err; });
  }
  return pending;
}

/** Returns null while loading (or if the file cannot be read). */
export function useSource(): SourceJson | null {
  const [src, setSrc] = useState<SourceJson | null>(cache);
  useEffect(() => {
    let alive = true;
    loadSourceJson().then(j => { if (alive) setSrc(j); }).catch(() => { /* fallbacks live in the pages */ });
    return () => { alive = false; };
  }, []);
  return src;
}
