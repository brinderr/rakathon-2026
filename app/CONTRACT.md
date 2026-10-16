# Koordinátor – stavebný kontrakt (pre všetkých agentov a oboch Claudov)

Appka pre koordinátora onkologickej starostlivosti v KOC (výzva VZP „Cesta pacienta bez ztráty informací“, Rakathon 2026).
**Hlavná veta:** „Nič sa nestratí a vždy vieš, kto je na ťahu.“
Stack: Vite + React 19 + TypeScript, **žiadne ďalšie knižnice** (grafy = ručné SVG). Štýly: `src/theme.css` (tokeny) + CSS súbory vedľa komponentov. Jazyk UI: **slovenčina**, jednoducho, pre laikov.

## Pravidlá obsahu (nepreskočiteľné)
1. Všetky údaje o Alene sú **fiktívne** (zadanie VZP). Každá hodnota má citát `Citation{docId, quote}` a `quote` sa **doslova** nachádza v texte správy (`public/data/source.json`). Overuje to `npm run verify`.
2. Chýbajúce sa **označí**, nikdy nedomýšľa. Rozpor sa ukáže **vedľa seba**, rozhoduje človek.
3. Žiadne skóre naliehavosti, žiadne odporúčanie liečby, fronta je zoradená **len podľa termínov** (inak MDR).
4. Na každej obrazovke nenápadne: „Prototyp · fiktívne dáta · nie je zdravotnícka pomôcka“.
5. Demo dátum „dnes“ = `DEMO_TODAY` = 19. 10. 2026. Konzílium Aleny = 21. 10. 2026.

## Dizajn (podľa referencií v `design/`)
Apple-premium, čisté, málo prvkov: svetlé plátno s jemným fialovo-mätovým gradientom, biele karty s rádiusom 20–28 px, jemné tiene, pastelové gradientné bloky pre metriky (ref-1, ref-4), „customer journey“ stĺpce s kartami krokov a spojnicami (ref-2/3), profil pacienta s kartami metrík a pravým panelom (ref-4). Veľa vzduchu, max. 1 primárne tlačidlo na obrazovke, ikony = jednoduché inline SVG (2px stroke). Žiadne emoji. Musí fungovať od 1280 px šírky (desktop demo), nemusí byť mobil.

## Obrazovky a vlastníci súborov (každý agent píše LEN svoje súbory)
| Súbor | Vlastník | Čo |
|---|---|---|
| `src/types.ts`, `src/nav.tsx`, `src/theme.css` | hlavný Claude | kontrakt, nemeniť bez dohody |
| `src/data/cases.ts`, `src/data/source.ts`, `scripts/verify.mjs` | **agent DATA** | `export const CASES: Case[]` (Alena plná + 3 ľahké prípady), `loadSources()` z `public/data/source.json`, overenie citátov |
| `src/App.tsx`, `src/main.tsx`, `src/components/Shell.*`, `src/components/ui.*`, `src/pages/Queue.*` | **agent SHELL** | rozloženie (bočný panel + horná lišta), router, spoločné UI prvky (Card, Pill, StatusDot, Button, Icon, Ring, Stat), **Fronta prípadov** + ranný prehľad + gamifikácia |
| `src/pages/CaseView.*`, `src/components/case/*` | **agent PROFIL** | **Profil pacienta / prípad**: hlavička, metriky, semafor 20 polí s citátmi, panel originálu so zvýraznenou vetou, rozpory vedľa seba, posuvník „stav k dátumu“, hodiny cesty, kroky (4 stavy), laboratórium, lieky, vyšetrenia, záznam o koordinovaní |
| `src/pages/Intake.*`, `src/pages/MdtDoc.*`, `src/pages/GpReport.*`, `src/components/docs/*` | **agent DOKUMENTY** | **Príjem/kontrola žiadanky** (strana praktika), **Podklad pre konzílium** (tlačiteľný, podľa `MDT_zapis`), **Záver pre praktika** (+ „Čo to znamená pre vás, pán doktor“, doručenka, smerovanie revíznemu lekárovi ZP 211) |
| `src/ai/*`, `scripts/extract*` | **Maťov Claude** | skutočné AI vyťaženie zo správ (Azure LLM) v tvare `HandoverField[]` + meranie presnosti; nemení UI |

`src/pages/*` exportujú `default` komponent bez props; čítajú dáta cez `CASES` a navigujú cez `useNav()`.

## Funkcie „overdeliver“ (z docs/matej-overdeliver.md)
- Kontrola žiadanky ešte pred odoslaním (chýbajú výsledky 01–06, telefón, ECOG) + automatické potvrdenie prijatia.
- Citát overený programom, klik ukáže zvýraznenú vetu v origináli; rozpory vedľa seba; posuvník „stav k 21. 10.“; doplnenie naživo (vyžiadam ECOG → príde odpoveď → pole zozelenie).
- Hodiny cesty „deň 12 z 33“ (dánske lehoty pankreasu 6 + 27 dní, označené ako zahraničný vzor) a ranný prehľad „dnes urgovať 2, zajtrajšie konzílium má neúplný podklad“.
- Šablóna „Pankreas“, kroky so 4 stavmi (vyžiadané → objednané → vykonané → výsledok doručený), eskalácia pri meškaní.
- Záver pre praktika s blokom „Čo to znamená pre vás“ + jeho pôvodná otázka a odpoveď konzília.
- Poisťovňa 211 (ZP MV ČR, nie VZP) → súhrn správnemu reviznému lekárovi (simulované). Pri uzavretí záznam o koordinovaní (dni so zásahom = podklad pre výkon 51887, 250 Kč).
- Gamifikácia koordinátora (decentne): denný cieľ, „slučky uzavreté tento týždeň“, „podklady kompletné načas v rade“, priemerné dni do kompletného podkladu. Nikdy podľa zdravotných údajov.

## Overené fakty, ktoré UI smie použiť
`docs/IDEALNE-RIESENIE.md`, `docs/kontext/*`, `docs/matej-*.md`. Nevymýšľať čísla. Dánske lehoty: 6 dní do prvej návštevy, 27 dní vyšetrovanie po rozhodnutie, 10/11 dní do operácie/chemoterapie (Sundhedsdatastyrelsen 2023).
