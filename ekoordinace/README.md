# eKoordinace – aplikácia pre koordinátora KOC

Nová, čistá aplikácia pre koordinátora KOC (výzva VZP „Cesta pacienta bez ztráty informací“). Staviame ju po krokoch,
každý krok schváli Matej. Stará aplikácia v `app/` ostáva nedotknutá ako záloha.

- **Značka:** názov eKoordinace (v štýle štátnych e-služieb ako eRecept), logo „K“ s bielou linkou a nožičkou, ktorá sa
  vracia šípkou späť k praktikovi (`src/ui/Mark.tsx`). Farby VZP
  (červená #D22D0F len pre „teraz“ a hlavnú akciu), písmo Source Sans 3 + Source Code Pro, rohy 10/8/6/4 px.
- **Dáta:** `npm run data` spustí spoločný motor (`app/src/ai`, len pravidlá) nad fiktívnymi správami a zapíše
  `src/data/alena.json`. Nič nie je vpísané ručne.

```bash
cd ekoordinace
npm install
npm run dev           # http://localhost:5173  (#/pacienti, #/konzilia, …)
npm run check         # typecheck + build – spusti pred každým pushom
npm run data          # prepočíta src/data/alena.json z motora
npm run preview:pack -- /cesta/preview.html   # jeden súbor na dočasný náhľad
```

## Ako na tom robíme dvaja naraz

| Čo | Kde | Kto |
|---|---|---|
| Rám appky: bočné menu, horná lišta, výber sekcie podľa adresy | `src/App.tsx` | zdieľané – meniť len po dohode |
| Zoznam sekcií (1 riadok = 1 položka v menu) | `src/sections.tsx` | zdieľané – zapnúť svoju sekciu je OK |
| Farby, karty, dlaždice `.stats`, záložky `.tabs`, štítky `.chip`, `.eyebrow` | `src/styles.css` | zdieľané – meniť len po dohode |
| Ikony, logo, formát dátumu (`czDate`, `nb`, `inDays`), ikona správy `DocIcon`, čítačka správ `DocViewer`, písmo EK Mono | `src/ui/`, `src/assets/` | zdieľané – pridať je OK, existujúce nemeniť |
| Sekcia **Pacienti** (hlavička, cesta pacientky, úlohy, kontakty) | `src/sections/pacient/` | matej |
| Sekcia **Konzilia** | `src/sections/konzilia/` | bruno (zatiaľ kostra, nezapnutá) |
| Dáta | `src/data/<súbor>.json` | kto ich generuje (`alena.json` = matej, `npm run data`) |

1. Každý píše do svojej sekcie (komponenty aj CSS vedľa seba). Zdieľané súbory mení len po dohode cez INBOX.
2. Sekciu zapneš v `src/sections.tsx`: import + `render: () => <Konzilia />`. Adresa je `#/konzilia`.
3. Pred pushom `npm run check`. Keď padne, nepushuj.
4. Nové npm balíčky len po dohode (`package-lock.json` robí konflikty).
5. Vercel nasadí každý push do `main`; keď build zlyhá, beží ďalej posledná dobrá verzia.

## Nasadenie

**Adresa: https://ekoordinace.vercel.app**

Automaticky cez GitHub Actions (`.github/workflows/ekoordinace-vercel.yml`): každý push do `main`, ktorý mení
`ekoordinace/`, spustí `npm run check` a výsledok nasadí na Vercel (projekt `ekoordinace` v tíme „Matej Salat's
projects“). Funguje so súkromným repom aj s commitmi od hocikoho. Potrebuje jeden secret v repe: **`VERCEL_TOKEN`**
(GitHub → Settings → Secrets and variables → Actions; pridať ho môže len vlastník repa). Bez neho sa krok nasadenia
preskočí. Ručne: GitHub → Actions → „eKoordinace → Vercel“ → Run workflow. Adresa je v súhrne behu.

## Kroky

| Krok | Čo | Stav |
|---|---|---|
| 0 | Základ: appka, značka, rozloženie | hotovo |
| 1 | Prehľad: hlavička s diagnózou z histológie, cesta pacientky v 5 krokoch (hotové kroky malé), čo je na rade + komu volať | hotovo |
| 2 | Záložka Zprávy: zoznam, zprávy po konzíliu zvlášť (čítačka správ ako vo Worde už je – `src/ui/DocViewer.tsx`) | ďalej |
| 3 | Údaje pro konzilium: 20 údajov so stavom a vetou zo zprávy | |
| 4 | Doplniť: zapísať telefonát, vyžiadať správu, potvrdenie lekárom | |
| 5 | Podklad pre konzílium podľa `MDT_zapis`, tlač do PDF | |
| 6 | Závěr pre praktika podľa `MDT_zaver` a doručenka | |
