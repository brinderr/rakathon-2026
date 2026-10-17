# Koordinátor – appka pre koordinátora onkologickej starostlivosti

Prototyp pre výzvu VZP „Cesta pacienta bez ztráty informací“ (Rakathon 2026).
**Nič sa nestratí a vždy vieš, kto je na ťahu.**

> Prototyp · fiktívne dáta · nie je zdravotnícka pomôcka. Všetky údaje o pacientke Alene sú vymyslené (zadanie VZP).

## Spustenie

```bash
cd app
npm install
npm run dev        # http://localhost:5173
```

Ďalšie príkazy:

| Príkaz | Čo robí |
|---|---|
| `npm run build` | kontrola typov (TypeScript) + produkčný build do `dist/` |
| `npm run preview` | spustí hotový build (po `npm run build`) |
| `npm run verify` | overí, že každý citát sa **doslovne** nachádza v texte správy; zapíše `public/data/cases.json` |
| `npm run lint` | ESLint |
| `npm run eval:mutations` | otestované úpravy pre „Zkuste to rozbít“ (`public/data/mutace.json`) |
| `npm run eval` | presnosť strojového vyťaženia na kontrolnej sade (Alena; `-- --case pacient-2` pre Josefa) → `public/data/eval-*.json` |
| `node scripts/build-pacient2.mjs` | po novom `extract`/`eval` pregeneruje `src/data/pacient2.gen.ts` a `src/data/eval.gen.ts` (potom `npm run verify`) |

Demo „dnes“ je pevne **19. 10. 2026**, konzílium Aleny **21. 10. 2026** (`DEMO_TODAY` v `src/types.ts`).
Čo sa v deme urobí (žiadosti, potvrdenia, uzavretie), žije len v pamäti prehliadača. „Ukážka v 8 krokoch“ vždy začína z čistého stavu a po prvom úkone je v hornej lište „Začať odznova“. Funguje aj na mobile (≤ 760 px spodná lišta).

## Obrazovky a priame odkazy

| Odkaz | Obrazovka |
|---|---|
| `/#` | **Fronta prípadov** – panel „Dnes“, karty pacientov (zoradené len podľa termínov), „den X od přijetí žádosti“ |
| `/#live/alena` | **Zpracování naživo** – motor `extractHandover` (`src/ai/extract.ts`) beží v prehliadači po každej správe, úprave aj prepnutí „Stav k datu konzilia“; „Zkuste to rozbít“, „Zapsat telefonát“ (`/#live/novak` pre Josefa) |
| `/#case/alena` | **Prípad Aleny** – hlavička, metriky, stav k dátumu, ďalší krok, úplnosť podkladu, čo treba vyriešiť |
| `/#case/alena/podklad` | 20 polí podkladu s citátmi, laboratórium, lieky, vyšetrenia (klik = originál so zvýraznenou vetou) |
| `/#case/alena/kroky` | Cesta pacientky – kroky so 4 stavmi (vyžiadané → objednané → vykonané → výsledok) |
| `/#case/alena/dokumenty` | Prijaté správy a tie, ktoré prídu neskôr |
| `/#case/alena/zaznam` | Záznam o koordinovaní (dni so zásahom = podklad pre výkon 51887) |
| `/#mdt/alena` | **Podklad pre konzílium** podľa vzoru VZP `MDT_zapis` (tlač / kopírovanie) |
| `/#gp/alena` | **Záver pre praktika** + „Čo to znamená pre vás“, doručenka, revízny lekár ZP 211 |
| `/#intake` | **Žiadanka** (strana praktika) – kontrola ešte pred odoslaním |
| `/#case/novak` | **Josef Novák** (pľúca) – druhý fiktívny pacient, podklad zo strojového vyťaženia (AI, predpočítané), každé pole „návrh“ → potvrdí človek |
| `/#case/kucera` atď. | ilustračné prípady do fronty (čip „ukážka“) |

## Čo kde je

```
app/
├─ CONTRACT.md              pravidlá obsahu, dizajnu a vlastníci súborov – čítaj ako prvé
├─ public/data/source.json  texty 13 fiktívnych správ Aleny + šablóny VZP
├─ public/data/cases.json   export dát (generuje npm run verify)
├─ scripts/verify.mjs       overenie citátov
├─ design/                  dizajnové referencie (ref-*.jpg) a screenshoty appky (shots/)
└─ src/
   ├─ types.ts              dátový kontrakt (Case, HandoverField, Citation, …)
   ├─ nav.tsx               malý router (useNav) – bez knižníc
   ├─ theme.css             farby, tiene, rádiusy (tokeny)
   ├─ App.tsx, main.tsx     koreň appky, route ↔ URL hash
   ├─ data/                 CASES (Alena plná + 3 ľahké prípady), načítanie správ
   ├─ components/           Shell (bočný panel, horná lišta), ui (spoločné prvky)
   │  ├─ case/              časti profilu pacienta
   │  ├─ docs/              časti dokumentov (podklad, záver, žiadanka)
   │  └─ live/              obrazovka Zpracování naživo (adaptér motora, časová os, polia, pasce)
   └─ pages/                Queue, Live, CaseView, MdtDoc, GpReport, Intake
```

Stack: Vite + React 19 + TypeScript, žiadne ďalšie knižnice (grafy a ikony sú ručné SVG).

## Pravidlá (skrátene, celé v `CONTRACT.md`)

1. Každá hodnota má citát, ktorý je doslovne v správe – stráži to `npm run verify`.
2. Chýbajúce sa označí, nikdy nedomýšľa. Rozpor sa ukáže vedľa seba, rozhoduje človek.
3. Žiadne skóre naliehavosti ani odporúčanie liečby; fronta je zoradená len podľa termínov.
