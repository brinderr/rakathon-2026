# R4 – Ako dostať Maťovu AI časť do appky (plán tech leada)

_Stav: so 17. 10. 2026, 02:18. V projekte som **nič nezmenil**. Všetky testy bežali na kópiách v scratchpade.
Plán je písaný tak, aby ho agent vedel vykonať bez ďalšieho pátrania._

## 0. V skratke

1. **(a) Karta „Kontrolná sada“** sa dá urobiť hneď. Čísla číta za behu z `public/data/eval-*.json` (žiadne čísla
   napevno v kóde, žiadne záložné hodnoty). Ukážeme ju vo fronte (bočný panel) a v záložke Podklad.
2. **(b) Josef Novák (pľúca)** sedí na `HandoverField` 1 : 1. Overil som to cez `tsc` aj cez skutočný `verify.mjs`:
   **133/133 citátov, 0 chýb**. Na úrovni `Case` však chýba približne polovica údajov (správy s metadátami, kroky,
   ďalší krok, záznam, poisťovňa…). Tie doplní **adaptér** `scripts/build-pacient2.mjs`, otestovaný, celý je v Prílohe A.
   Dôležité: ID správ treba prefixovať (`N-01`…), inak by sa pri Josefovi zobrazili **texty správ Aleny**.
3. **(c) Do 13:00 bez živého kľúča** je realistický odznak na prípade („AI výstup (predpočítaný)“ / „ručne overené“),
   čip „AI“ pri piatich poliach, ktoré navrhol model, a tlačidlo **„Potvrdiť podľa zdroja“**: potvrdzuje človek.
   Živé volanie Azure z prehliadača nie (kľúč nemáme a do prehliadača nesmie). Prepínač medzi ručnou a strojovou verziou
   má zmysel iba pri Alene a je voliteľný.
4. **Pozor: Maťove súbory sa v noci menia.** Počas analýzy (02:03 → 02:11) sa `extracted-alena.json` prepol
   z režimu `rules` na `rules+llm` a citáty Aleny stúpli z 63/63 na 72/72. Preto UI **nikdy** nesmie mať čísla napevno
   a potrebujeme dohodnutý čas zmrazenia (návrh: 10:00).
5. Odhad: povinná časť P0 zaberie ~2 h práce agentov, dá sa robiť paralelne, potom 30 min overenie. Rezerva do generálky o 11:00 je.

---

## 1. Čo Maťo nahral (inventár)

| Súbor | Čo to je | Použijeme v UI? |
|---|---|---|
| `src/ai/extract.ts`, `rules.ts`, `narrative.ts`, `text.ts`, `fields.ts`, `prompt.ts`, `pseudo.ts`, `llm.ts` | Vyťaženie = pravidlá + voliteľne jazykový model, každý citát overený doslova, detektory pascí. Čisté TS **bez Node importov** (hash cez `crypto.subtle`), takže beží aj v prehliadači. UI ho dnes neimportuje. | Nie priamo (P3: prepočet v prehliadači) |
| `scripts/extract.mjs` | `npm run extract [-- --case pacient-2] [--provider azure\|openai\|cache\|none\|fixture]` → `public/data/extracted-<case>.json` | Nie (build krok) |
| `scripts/eval.mjs` | `npm run eval` porovná vyťaženie so zlatou sadou → `public/data/eval-<case>.json` (pole `summary`, `traps`, `headline`) | **Áno, (a)** |
| `eval/gold-alena.json`, `eval/gold-pacient-2.json` | Ručne overená správna odpoveď: 20 polí + 17 pascí (Alena), 20 polí + 13 pascí (pacient 2) | Nie (len cez eval) |
| `eval/llm-cache/*.json` | Presná pseudonymizovaná požiadavka na AI a uložená odpoveď (offline prehrávanie) | Nie (P3) |
| `eval/llm-fixtures/halucinujuci-model-alena.json` + `eval/vysledok-test-halucinacii.json` | Test poistky: úmyselne chybná AI odpoveď, 5 návrhov, **4 zamietnuté s dôvodom, 1 prijatý** | **Áno, P1** (treba skopírovať do `public/data/`) |
| `data-pacient-2/*.txt`, `source-pacient-2.json`, `build.mjs`, `README.md` | Josef Novák, 60 r., adenokarcinóm pľúc, VZP 111, 10 správ, MDT 22. 10. 2026, 4 nové typy pascí | **Áno, (b)** |
| `public/data/extracted-alena.json`, `extracted-pacient-2.json` | Výstup vyťaženia: `meta`, `fields` (20× HandoverField), `provenance`, `findings`, `precheck`, `labs`, `exams`, `meds`, `referringGp` | **Áno, (b)** + (c) |
| `public/data/eval-alena.json`, `eval-pacient-2.json` | Namerané výsledky | **Áno, (a)** |

### Namerané čísla (stav 02:18, čítané zo súborov a overené vlastným spustením `eval.mjs` s výstupom do scratchpadu)

| Prípad | Režim vyťaženia | Polia | Pasce | Vymyslené | Bez overeného citátu | Citáty doslova | Zlatá sada celistvá |
|---|---|---|---|---|---|---|---|
| Alena (pankreas) | `rules+llm`, náhradný model | 20/20 | 17/17 | 0 | 0 | 72/72 | áno |
| Josef Novák (pľúca) | `rules+llm`, náhradný model | 20/20 | 13/13 | 0 | 0 | 49/49 | áno |
| Test poistky (Alena, chybná AI odpoveď) | `fixture` | 20/20 po zamietnutí | 17/17 | 0 | – | 63/63 (starší beh) | áno |

Pole `model` doslova: _„náhrada bez Azure kľúča – odpoveď z Claude Code na presne tento prompt (ostrý režim: Azure OpenAI EU)“_.
Model navrhol 5 voľnotextových polí (diagnóza, priebeh, otázka pre konzílium, príznaky, iné), zvyšných 15 prečítali pravidlá.

**Poctivo (z `eval/README.md`, treba to vedieť povedať porote):** zlatú sadu aj pravidlá písal ten istý tím.
Pravidlá sa po prvom behu na pacientovi 2 zovšeobecnili, predtým to bolo **18/20 polí, 6/13 pascí**. Ďalší pacient má prísť naslepo.

---

## 2. Zistenia z kódu (prečo nestačí „len načítať JSON“)

1. **Polia sedia.** `extracted-pacient-2.json → fields[]` má presne tvar `HandoverField` (key, label, group, value, status,
   citations, sourceDate, note, conflict, request). `labs/exams/meds` sedia na `LabRow/Exam/Medication`. Otestované
   (`tsc` celej appky s napojením: exit 0).
2. **Kolízia ID správ (kritické).** Josef má správy `01`–`10`, Alena `01`–`13`. `CaseView.tsx` (r. ~72) berie text ako
   `sources[d.id] ?? d.text`, kde `sources` je globálna mapa zo `source.json` **Aleny**. Josef by teda pri kliknutí
   na citát ukázal Alenin text. To je presne tá chyba „ticho zlúčiť dvoch pacientov“, pred ktorou appka varuje.
   **Riešenie:** prefix `N-` (rovnaká konvencia ako `K-01`, `P-01`, `R-01` pri ľahkých prípadoch) a text v `SourceDoc.text`.
   Daň: čip ukáže „správa N-09“, kým vysvetlenie rozporu píše „Správa 09“. Je to kozmetika a dá sa vysvetliť.
3. **Na úrovni `Case` vyťaženie nič nedáva:** `patient`, `koc`, `receivedAt`, `status`, `nextStep`, `steps`, `log`,
   metadáta správ (title/place/kind/channel/receivedAt), `reviewer`, `clockTargetDays`. Adaptér ich doplní zo správ
   a z **výslovne označených predpokladov prototypu** (§4.2).
4. **Stav polí je vždy `proposed` alebo `conflict`, nikdy `confirmed`.** Je to správne, stroj len navrhuje. Appka však
   dnes **nemá tlačidlo na potvrdenie návrhu**: `OriginalPanel` vie iba „Platí A/B“, „Vyžiadať“ a „Simulovať odpoveď“.
   Rovnaká diera je aj pri Alene, kde sú 3 návrhy (pohlavie, diagnóza, priebeh). Josef by mal „Úplnosť 0/20“ bez
   možnosti to zmeniť. Riešenie je v P1 (§5.3).
5. **Poznámky od modelu (`note` pri 5 AI poliach) sú po česky a program ich neoveruje.** Overujú sa len citáty a čísla
   v hodnote. Vecne som ich skontroloval, napr. „kopřivka po iomeprolu“ je doslova v správe 05. V UI ich treba
   označiť ako vysvetlivku AI.
6. **Miesta v UI napísané pre Alenu**, ktoré by pri Josefovi klamali:
   - `MdtDoc.tsx` r. ~108–109: členovia MDT a prezentujúci lekár sa parsujú zo šablóny „MDT zaver“ Aleny (tím pre nádory GIT). Pri Josefovi to musí byť prázdne („Zloženie tímu doplní KOC.“).
   - `Metrics.tsx` r. 46: „dánsky vzor pre pankreas: 6 + 27 dní“. Overenú dánsku lehotu pre pľúca v podkladoch nemáme (hľadal som v `ULTIMATNY-SYSTEM.md` a `raw-audit-hry.md`).
   - Rod: `CaseView.tsx` r. 141, 146 („pre pacientku“), r. 260 („Cesta pacientky“); `GpReport.tsx` r. 183–184 („Pacientka je poistená… jej“).
   - `CaseHeader.tsx` r. 28: „praktik“. U Josefa posiela pneumológ MUDr. Karel Veselý.
   - `Queue.tsx` `briefing()` ráta pri konzíliách tento týždeň iba chýbajúce polia, rozpory nie. Josef (MDT 22. 10.) má 0 chýbajúcich a 3 rozpory, takže sa v rannom prehľade neobjaví.
7. **`verify.mjs` funguje bez zmeny**, aj keď `cases.ts` importuje generovaný súbor. Prvá cesta (transpilácia do `data:` URL)
   zlyhá na relatívnom importe, záložná cesta (Node ≥ 22.18 spustí `.ts` priamo) prejde. Overené na Node 24.14 (Bruno):
   `Prípady: 5 · Citáty: 133/133 · ✓ Všetko overené`. Podmienka: import **s príponou** `'./pacient2.gen.ts'`.
8. Menšie: `MUDr. Hana Benešová` je praktička Josefa (Benešov) aj fiktívna praktička ľahkého prípadu Kučera (Říčany).
   Pozorný porotca si to môže všimnúť. Voliteľne premenovať v prípade Kučera (`cases.ts` aj text `K-01`).

---

## 3. (a) Karta „Kontrolná sada“

### 3.1 Pravidlá
- Čísla **len** z `summary` v `public/data/eval-<case>.json`. Žiadny text ani číslo napevno v kóde.
- Ak sa súbor nenačíta alebo `goldIntegrity !== true`, karta sa **nezobrazí** (žiadna záloha „20/20“).
- Pri Josefovi karta porovná `eval.extraction.generatedAt` s `case.ai.generatedAt`. Ak nesedia, namiesto čísel ukáže
  „meranie patrí k inej verzii vyťaženia – spustiť `npm run eval -- --case pacient-2`“. Chráni to pred rozchodom po Maťovom prepočte.
- Pri Alene treba presné znenie: meria sa **strojové vyťaženie tých istých 13 správ**, nie ručná verzia, ktorú appka ukazuje.

### 3.2 Súbory a zmeny

| # | Súbor | Vlastník | Zmena |
|---|---|---|---|
| a1 | `src/components/EvalCard.tsx` + `EvalCard.css` (**nové**) | SHELL | Komponent podľa Prílohy B. Varianty: `compact` (fronta) a `full` (Podklad, s rozbaľovacím zoznamom pascí). |
| a2 | `src/pages/Queue.tsx` | SHELL | V `<aside className="side">` pod kartu „Tento týždeň“ a pod `side__note` pridať nadpis `KONTROLA PRESNOSTI` a `<EvalCard variant="compact" rows={CASES.filter(c => c.ai?.evalFile).map(c => ({ name: \`${c.patient.firstName} ${c.patient.lastName[0]}.\`, sub: c.diagnosisShort, file: c.ai!.evalFile!, expectGeneratedAt: c.ai!.mode === 'manual' ? undefined : c.ai!.generatedAt }))} />`. |
| a3 | `src/pages/CaseView.tsx` | PROFIL | V záložke `podklad` ako prvý prvok `cv-stack`: `{c.ai?.evalFile && <EvalCard variant="full" rows={[{ name: …, file: c.ai.evalFile, expectGeneratedAt: … }]} manual={c.ai.mode === 'manual'} />}` |
| a4 | `public/data/vysledok-test-halucinacii.json` (**kópia** z `eval/`) | Maťo | `cp eval/vysledok-test-halucinacii.json public/data/`. Ideálne po zmrazení test zopakovať, aby `evalSummary` sedel s aktuálnym behom. |
| a5 | `EvalCard` sekcia „Test poistky“ (iba Alena, `variant="full"`) | SHELL | Z `aiProposals/accepted/rejected` + `fields[]`: hodnota od AI (prečiarknutá, ak bola zamietnutá) a dôvod doslova (`reason`). **Neukazovať** jeho `evalHeadline`, lebo je zo staršieho behu (63/63) a mýlil by. |

### 3.3 Čo karta ukáže (príklad pri dnešných číslach, za behu sa vypočíta)
```
KONTROLA PRESNOSTI                                        namerané
Alena P.  · nádor hlavy pankreasu   20/20 polí správne · 17/17 pascí · 0 vymyslených hodnôt
Josef N.  · adenokarcinóm pľúc      20/20 polí správne · 13/13 pascí · 0 vymyslených hodnôt
Citáty doslova v správach: 72/72 a 49/49 (overuje program, nie AI)
Vyťaženie: pravidlá + jazykový model · odpoveď AI predpočítaná náhradným modelom (bez Azure kľúča) · 17. 10. 2026
[Ktoré pasce?]  →  zoznam `traps[].title` s ✓ (vysvetlenie `why` až pri prejdení myšou)
```
`why` pascí obsahuje vety ako „rozhoduje o liečbe“. Sú všeobecné, nejde o odporúčanie pre pacienta, ale aby sme sa
vyhli pochybnostiam o MDR, predvolene ukazovať iba `title`.

---

## 4. (b) Josef Novák ako plnohodnotný prípad vo fronte

### 4.1 Prístup: generovaný TS súbor, nie fetch za behu
`CASES` je synchrónne pole, ktoré používa každá stránka (fronta, prípad, dokumenty, `findCase`). Načítanie cez fetch
za behu by znamenalo prerobiť štyri stránky. Preto adaptér pri builde vygeneruje `src/data/pacient2.gen.ts` s `export const NOVAK: Case`.
Ak by sa niekedy použil `import … from '*.json'`, treba `resolveJsonModule` v `tsconfig.app.json` a `verify.mjs` by ho nevedel načítať, preto ho nepoužívame.

### 4.2 Adaptér: čo berie odkiaľ (predpoklady sú výslovne označené)

| Pole `Case` | Zdroj | Predpoklad? |
|---|---|---|
| `fields` | `extracted.fields` + `citations/conflict.*.citation.docId` → `N-xx`, `origin` z `provenance[key].extractor` | – |
| `labs`, `exams`, `meds` | `extracted.*`, `docId` → `N-xx` | – |
| `precheck` | `extracted.precheck` (1 info: ECOG je v správe 03) | – |
| `docs[].text`, `examDate` | `source-pacient-2.json` | – |
| `docs[].title/place/kind` | hlavička každej správy (tabuľka `META` v Prílohe A). `kind:'request'` má **len 09**, lebo appka berie prvú `request` ako žiadanku do KOC | – |
| `docs[].receivedAt` | 01–09: **7. 10. 2026** (09 uvádza prílohy 02, 04–08). 10: 27. 10. | **áno**: 01 a 03 nie sú v zozname príloh |
| `docs[].channel` | `e-mail` (09 má v hlavičke e-mail), správa 10 `NIS` (interná KOC, ako pri Alene) | **áno**: kanál v správach nie je |
| `patient` | správa 09 (meno, 60 r., muž, 111, telefón, manželka Marie Nováková + telefón) | – |
| `referringGp` | `extracted.referringGp` (MUDr. Karel Veselý, tel., e-mail); `practice` = „Pľúcna ambulancia, Nemocnica Benešov“ | – |
| `diagnosisShort` | „adenokarcinóm pľúc (C34.1)“, **bez strany**, lebo strana je v rozpore | – |
| `koc` | „KOC 2 · Nemocnica Lipová“ (09: adresát KOC Nemocnice Lipová, rovnaké mapovanie ako pri Alene) | – |
| `mdtDate` | `source-pacient-2.json → mdtDate` = 22. 10. 2026 | – |
| `receivedAt`, `status` | 7. 10. 2026 (dátum žiadosti 09), `active` | – |
| `nextStep` | generované z dát: „Skontrolovať strojový návrh podkladu: 3 rozpory, 1 chýbajúci dodatok k histológii“, ja, do **21. 10.** | **áno**: termín = deň pred konzíliom (pravidlo prototypu) |
| `steps` (7) | 5× doručené vyšetrenie (RTG, CT, bronchoskopia, histológia, PET/CT, dátumy zo správ), „Dodatok k histológii: EGFR, ALK, ROS1, PD-L1“ (`ordered` od 23. 9., správa 07 „probíhá“), „Konzílium (MDT)“ 22. 10. | **áno**: dátum objednania MDT nepoznáme, použitý 7. 10. |
| `log` | prijatá žiadosť 09 (7. 10.) + „Podklad predvyplnený strojovo (v deme predpočítané)“ | **áno**: v produkte by predvyplnenie prebehlo pri prijatí |
| `reviewer` | 111 = VZP (pasca `insurer-vzp`) | – |
| `clockTargetDays` | 33, rovnako ako pri Kučerovi (pľúca): „predvolená lehota“ | **áno**: overená lehota pre pľúca nie je |
| `gpReport` | **žiadny** (konzílium ešte nebolo), `GpReport.tsx` ukáže „Záver konzília ešte nie je zapísaný“ | – |
| `ai` (nové) | `{ label:'AI výstup (predpočítaný)', mode, model, generatedAt }` z `extracted.meta`, `evalFile:'data/eval-pacient-2.json'` | – |

Výsledok vo fronte (stav 19. 10.): karta „aktívny · deň 12 z 33 · Konzílium 22. 10. · Na ťahu: ja · Termín 21. 10.“.
Radí sa iba podľa termínu, medzi Alenu (20. 10.) a Pospíšilovú (23. 10.). Filter „Konzílium tento týždeň“: 1 → 2.

### 4.3 Súbory a zmeny

| # | Súbor | Vlastník | Zmena |
|---|---|---|---|
| b1 | `src/types.ts` | hlavný Claude | Dve **voliteľné** položky (bez dopadu na existujúce dáta):<br>v `HandoverField`: `origin?: 'manual' \| 'rules' \| 'ai';`<br>v `Case`: `ai?: { label: 'ručne overené' \| 'AI výstup (predpočítaný)'; mode: 'manual' \| 'rules' \| 'rules+llm'; model?: string \| null; generatedAt?: string; evalFile?: string };` |
| b2 | `scripts/build-pacient2.mjs` (**nový**) | DATA (alebo Maťo) | Príloha A, otestované. |
| b3 | `package.json` | DATA | `"pacient2": "node scripts/build-pacient2.mjs && npm run verify"` |
| b4 | `src/data/pacient2.gen.ts` (**generovaný**, ~38 kB) | DATA | `npm run pacient2`. Ručne neupravovať. |
| b5 | `src/data/cases.ts` | DATA | (1) pod `import type {…} from '../types';` pridať `import { NOVAK } from './pacient2.gen.ts';` (**s príponou**, kvôli `verify.mjs`)<br>(2) `export const CASES: Case[] = [ALENA, NOVAK, KUCERA, POSPISILOVA, KRALOVA];` (Alena musí ostať **prvá**, lebo `fullCase()`/`findCase()` berú prvý `demo:'full'`)<br>(3) do objektu `ALENA` pridať `ai: { label: 'ručne overené', mode: 'manual', evalFile: 'data/eval-alena.json' },` |
| b6 | `src/pages/MdtDoc.tsx` r. ~107–109 | DOKUMENTY | Tím a prezentujúci len pri prípade s vlastným zápisom z MDT:<br>`const hasOwnMdt = !!c?.docs.some(d => d.id === 'MDT');`<br>`const members = useMemo(() => (hasOwnMdt ? parseMembers(zaver) : []), [zaver, hasOwnMdt]);`<br>`const presenter = useMemo(() => (hasOwnMdt ? parsePresenter(zaver) : undefined) ?? 'lekár KOC', [zaver, hasOwnMdt]);` |
| b7 | `README.md` | ktokoľvek | Riadok `/#case/novak` + príkaz `npm run pacient2` |

**Overené na kópii** (`scratchpad/t2`, `t3`): `tsc -p tsconfig.app.json` exit 0 · `vite build` OK · skutočný
`scripts/verify.mjs`: `alena: 14 potvrdených · 3 na kontrolu · 1 chýba · 2 rozpory`, `novak: 0 potvrdených · 17 na kontrolu · 0 chýba · 3 rozpory · 0 polí bez citátu`,
`Citáty: 133/133`, `✓ Všetko overené` (4 upozornenia na 2-slovné citáty, neblokujú).
Vizuálne v prehliadači som to **neoveroval** (bez zmeny v projekte som nemohol spustiť dev server). Treba to urobiť v kroku 6.3.

---

## 5. (c) „AI výstup (predpočítaný)“ vs „ručne overené“: čo je reálne do 13:00

### 5.1 Čo áno
| # | Čo | Súbor / vlastník | Čas |
|---|---|---|---|
| c1 | **Odznak prípadu** v hlavičke vedľa stavu: `{c.ai && <span title={tip}><Pill tone={c.ai.mode === 'manual' ? 'mint' : 'amber'}>{c.ai.label}</Pill></span>}`. Tooltip pri AI: „Vyťažené {dátum} · pravidlá + jazykový model (5 voľnotextových polí) · každý citát overil program · čaká na potvrdenie človekom · model: {c.ai.model doslova}“. Pri Alene: „Údaje pripravil a overil tím ručne. Strojové vyťaženie tých istých správ je merané v karte Kontrolná sada.“ | `CaseHeader.tsx`, PROFIL | 15 min |
| c2 | **Čip „AI“** v riadku poľa (`FieldRow`) pri `f.field.origin === 'ai'`, vedľa `StatusPill`, `title="Text navrhol jazykový model, citáty overil program"`. V `OriginalPanel` (hlavička poľa) riadok „Návrh: jazykový model / pravidlá“. Poznámku `note` pri AI poliach prefixovať „Vysvetlivka AI:“. Štýl `.cs-origin` v `case.css`. | `FieldList.tsx`, `OriginalPanel.tsx`, `case.css`, PROFIL | 20 min |
| c3 | **„Potvrdiť podľa zdroja“** pre `status === 'proposed'` (Josef aj 3 návrhy Aleny):<br>`caseUtils.ts`: do `FieldOverride` pridať `\| { kind: 'confirmed'; date: ISODate; note: string }` a v `effectiveField` na začiatok `if (ov?.kind === 'confirmed' && ov.date <= asOf) return { ...base, status: 'confirmed', note: f.note ? \`${f.note} · ${ov.note}\` : ov.note };`<br>`OriginalPanel.tsx`: nový prop `onConfirm`, v poslednej vetve (citát) pri `f.status === 'proposed'` tlačidlo `Btn variant="primary"` „Potvrdiť podľa zdroja“ + hint „Potvrdzuje človek, nie AI.“<br>`CaseView.tsx`: `confirmField(key)` → override `confirmed`, `addLog('Potvrdený návrh', label + (origin==='ai' ? ' (návrh AI)' : ''))`, flash + toast. | PROFIL | 30 min |
| c4 | **Vyžiadať dodatok** pri poli s `request`, ktoré nie je `missing` (histológia Josefa: EGFR, ALK, ROS1, PD-L1). V `OriginalPanel` sekundárne tlačidlo, ak `f.field.request`. V `sendRequest` pri stave inom ako missing/conflict **nenastavovať** override `pending` (inak sa skryje hodnota histológie), iba `addLog` + toast. | PROFIL | 15 min |
| c5 | **Test poistky** (a5): najsilnejší dôkaz „AI nevymýšľa“ a je to statický, nameraný súbor | SHELL | 25 min |

### 5.2 Čo nie (a prečo)
- **Živé volanie Azure z prehliadača:** kľúč nemáme. Aj keby sme ho mali, v prehliadači by bol vidno. Živý režim patrí do
  skriptu alebo backendu (`npm run extract`), nie do UI.
- **Prepínač pre Josefa:** jeho ručne overená verzia neexistuje (zlatá sada je kontrolný kľúč, nie podklad). Iba odznak.
- **Pred-potvrdiť Josefove polia, aby semafor zelenal:** nie. Bolo by to falošné. Úplnosť 0/20 → klik → zelená, to je ten správny moment dema.

### 5.3 Voliteľné (len ak po prvej generálke zostane čas)
- **P2: prepínač pri Alene „ručne overené ↔ strojové vyťaženie“ (len na čítanie).** Rovnaký generátor spustený na
  `extracted-alena.json` (bez prefixu, Alenine ID a texty sú zo `source.json`) → `ALENA_MACHINE_FIELDS`. V `CaseView`
  `baseFields = view === 'stroj' ? ALENA_MACHINE_FIELDS : c.fields`. V režime stroj vypnúť akcie (ECOG demo
  potrebuje `resolvedBy`, ktoré stroj nemá). 45–60 min. Riziko: rozbije nacvičený priechod. Odporúčam ho mať iba ako záložku do diskusie.
- **P3: „Prepočítať teraz v prehliadači (bez AI)“.** `extractHandover({ docs, asOf, complete: undefined })` z `src/ai/extract.ts`
  beží v prehliadači (na localhoste je `crypto.subtle` dostupné). Ukáže, že výstup nie je ručne napísaný JSON. Plus prehratie
  chybnej AI odpovede naživo (fixture skopírovaný do `public/data`). ~1 h, rozširuje bundle o ~1 400 riadkov.
- **P3:** stránka `#presnost` so všetkými 30 pascami (vyžaduje `nav.tsx`, ktorý vlastní hlavný Claude).

---

## 6. Poradie práce, vlastníci, čas

### 6.1 P0 (musí, paralelne, ~2 h)
1. Hlavný Claude: **b1** (types).
2. DATA: **b2–b5** (`npm run pacient2` musí skončiť `✓ Všetko overené`).
3. SHELL: **a1, a2**. PROFIL: **a3, c1**. DOKUMENTY: **b6**.

### 6.2 P1 (mal by, ~1,5 h)
4. PROFIL: **c2, c3, c4** + rod (`CaseView` r. 141, 146, 260: `c.patient.sex === 'muž' ? 'pacienta' : 'pacientku'` / `'pacienta' : 'pacientky'`),
   `Metrics.tsx` r. 46: pre diagnózu bez `/pankrea|C25/` text „predvolená lehota (dánsky vzor pre pankreas)“,
   `CaseHeader.tsx` r. 28: `/prakt/i.test(c.referringGp.practice) ? 'praktik' : 'odosiela'`.
5. DOKUMENTY: `GpReport.tsx` r. 183–184 rod („Pacient je poistený… jeho“).
6. SHELL: **a5** (+ Maťo **a4**). `Queue.tsx` `briefing()`: pri konzíliách tento týždeň pridať rozpory → „(Novák: 3 rozpory)“.
   Pozor: zmení sa aj nacvičená veta pri Alene („chýba ECOG · 2 rozpory“). Rozhodne Bruno.

### 6.3 Zmrazenie a overenie (pred generálkou o 11:00)
- **10:00 zmrazenie Maťových výstupov.** Posledný beh: `npm run extract && npm run eval && npm run extract -- --case pacient-2 && npm run eval -- --case pacient-2`,
  zopakovať test poistky, `cp eval/vysledok-test-halucinacii.json public/data/`, potom `npm run pacient2`. Ak sa objaví Azure kľúč (`app/.env`),
  rovnaké príkazy stačia: zmení sa len pole `model` a čísla, UI netreba meniť.
- `npm run build && npm run lint && npm run verify`
- Ručne prejsť: `#` (karta Novák, filter „Konzílium tento týždeň“ = 2, karta presnosti) · `#case/novak` (odznak, semafor 17 návrh / 3 rozpor,
  0 bez zdroja, deň 12 z 33) · `#case/novak/podklad` (klik na citát → **Josefov** text so zvýraznením; rozpor strany A/B; Potvrdiť) ·
  `#case/novak/kroky` · `#case/novak/dokumenty` (správa N-10 sivá do 27. 10.) · `#mdt/novak` (bez tímu GIT, N-10 vynechaná) ·
  `#gp/novak` (placeholder, VZP) · `#case/alena` (nič sa nerozbilo, ECOG demo funguje).
- Čísla na karte sa musia zhodovať s výpisom `npm run eval`.
- Nové screenshoty `design/shots/21-novak-*.png`.

---

## 7. Kde to ukázať v deme (8 krokov z IDEALNE-RIESENIE §7.1)

- **Krok 1 (fronta):** jedna veta ku karte presnosti: „Toto je namerané, nie sľúbené: na kontrolnej sade 20 z 20 polí,
  všetky pasce a nula vymyslených hodnôt, na dvoch pacientoch.“
- **Nový medzikrok 5b (30–40 s), po kliknutí na citát u Aleny:** „Aby to nebolo ušité na jednu pacientku: Josef Novák.
  Iný orgán, iná poisťovňa, žiadanku píše pneumológ.“ Odznak „AI výstup (predpočítaný)“. Tri rozpory, ktoré stroj sám našiel:
  bronchoskopia ľavý lalok vs. všetko ostatné pravý (A/B vedľa seba, rozhoduje človek), alergia na kontrast, ktorá sa
  v žiadanke stratila, a laboratórium s iným rodným číslom („nezlúčime ticho“). K tomu dodatok EGFR/ALK/ROS1/PD-L1, ktorý
  do konzília neprišiel. Klik „Potvrdiť podľa zdroja“ a dlaždica zozelenie: „potvrdzuje človek“.
- **Krok 8 / diskusia:** „Test poistky: úmyselne chybná AI odpoveď (vymyslené štádium, vymyslené čísla, citát zo správy
  po konzíliu), 4 z 5 návrhov program zamietol a podklad ostal bez vymyslenej hodnoty.“

**Nehovoriť:** „AI je stopercentná“, „beží naživo na Azure“, „overené na pacientoch“. **Hovoriť:** „predpočítané,
lebo zdieľaný Azure nemáme. Rovnaká pseudonymizovaná požiadavka, citáty overuje program, nie model.“ Na otázku
o metodike: n = 2 fiktívni pacienti, zlatú sadu písal ten istý tím, pravidlá sme po prvom behu na pacientovi 2 doladili
(predtým 18/20 a 6/13), ďalší pacient má prísť naslepo.

---

## 8. Riziká

| Riziko | Dopad | Opatrenie |
|---|---|---|
| Maťo prepočíta po napojení a `pacient2.gen.ts` sa rozíde s `eval-pacient-2.json` | karta ukáže čísla k inej verzii | kontrola `generatedAt` v karte (§3.1) + zmrazenie 10:00 + `npm run pacient2` po každom prepočte |
| Kolízia ID správ | Josef ukáže texty Aleny | prefix `N-` (adaptér), krok 6.3 to overí kliknutím |
| `verify.mjs` na Node < 22.18 | `npm run verify` padne na importe | Bruno má Node 24.14 (overené). Inak vložiť literál priamo do `cases.ts` medzi značky `// <pacient-2:auto>` |
| 20 „návrhov“ u Josefa pôsobí ako chaos | porota si to vyloží ako horšiu kvalitu | odznak + karta 20/20 + „Potvrdiť“ ukázať naživo. Povedať: „stroj navrhuje, človek potvrdzuje“ |
| Poznámky modelu po česky a bez overenia | nekonzistentné, mohli by obsahovať nepresnosť | prefix „Vysvetlivka AI:“. Dnešný obsah som vecne skontroloval proti správam |
| Rod a lehota pre pankreas pri mužovi s pľúcami | vyzerá to ako šablóna | P1 úpravy z §6.2 |

---

## Príloha A: `app/scripts/build-pacient2.mjs` (otestované, cesty prispôsobené repu)

```js
#!/usr/bin/env node
// npm run pacient2 – druhý fiktívny pacient (Josef Novák, pľúca) ako Case pre appku.
// Vstup: public/data/extracted-pacient-2.json (Maťovo vyťaženie) + data-pacient-2/source-pacient-2.json (texty správ).
// Výstup: src/data/pacient2.gen.ts (NEUPRAVOVAŤ RUČNE). Predpoklady prototypu sú označené „predpoklad“.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const APP = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(APP, 'src/data/pacient2.gen.ts');
const rd = (p) => JSON.parse(readFileSync(join(APP, p), 'utf8'));
const ex = rd('public/data/extracted-pacient-2.json');
const src = rd('data-pacient-2/source-pacient-2.json');

const pid = (id) => `N-${id}`;                    // vlastné ID (ako K-01, P-01, R-01) – nikdy nie Alenine 01–13
const cit = (c) => ({ docId: pid(c.docId), quote: c.quote });
const RECEIVED = '2026-10-07';                    // žiadosť 09 + prílohy (02, 04–08); 01 a 03 = predpoklad
const MDT = src.mdtDate;                          // 2026-10-22
const DUE = '2026-10-21';                         // predpoklad: termín = deň pred konzíliom

const META = {                                    // [názov, pracovisko, druh] podľa hlavičky správy
  '01': ['Praktická lekárka – žiadosť o vyšetrenie u pneumológa', 'Ordinácia praktického lekára, Benešov', 'report'],
  '02': ['RTG hrudníka', 'Nemocnica Benešov – rádiológia', 'result'],
  '03': ['Pneumológ – vstupné vyšetrenie', 'Nemocnica Benešov – pľúcna ambulancia', 'report'],
  '04': ['Laboratórium a nádorové markery', 'Laboratoř Benešov s.r.o.', 'result'],
  '05': ['CT hrudníka a horného brucha', 'Nemocnica Benešov – rádiológia', 'result'],
  '06': ['Bronchoskopia s EBUS-TBNA – protokol', 'KOC 2 · Nemocnica Lipová – bronchológia', 'report'],
  '07': ['Histológia – bioptický nález', 'KOC 2 · Nemocnica Lipová – patológia', 'result'],
  '08': ['PET/CT celotelové', 'KOC 1 · Nemocnica Severní – nukleárna medicína', 'result'],
  '09': ['Žiadosť pneumológa o prevzatie do KOC (epikríza)', 'Nemocnica Benešov – pľúcna ambulancia', 'request'],
  '10': ['Nutričná ambulancia – skríning', 'KOC 2 · Nemocnica Lipová – nutričná ambulancia', 'report'],
};

const docs = src.documents.map((d) => {
  const [title, place, kind] = META[d.id];
  return { id: pid(d.id), title, place, kind, examDate: d.date, receivedAt: d.date > RECEIVED ? d.date : RECEIVED,
    channel: d.id === '10' ? 'NIS' : 'e-mail' /* predpoklad */, text: d.text };
});

const fields = ex.fields.map((f) => {
  const out = { ...f, citations: f.citations.map(cit), origin: ex.provenance[f.key]?.extractor === 'llm' ? 'ai' : 'rules' };
  if (f.conflict) out.conflict = { a: { ...f.conflict.a, citation: cit(f.conflict.a.citation) },
    b: { ...f.conflict.b, citation: cit(f.conflict.b.citation) }, explain: f.conflict.explain };
  return out;
});

const h = (state, date) => ({ state, date });
const exam = (id, title, place, owner, done, delivered, doc) =>
  ({ id, title, place, owner, due: delivered, state: 'delivered', history: [h('done', done), h('delivered', delivered)], resultDocId: pid(doc) });
const steps = [
  exam('rtg', 'RTG hrudníka', 'Nemocnica Benešov – rádiológia', 'rádiológia Nemocnice Benešov', '2026-08-26', '2026-08-26', '02'),
  exam('ct', 'CT hrudníka a horného brucha', 'Nemocnica Benešov – rádiológia', 'rádiológia Nemocnice Benešov', '2026-09-10', '2026-09-10', '05'),
  exam('bronch', 'Bronchoskopia s EBUS-TBNA', 'KOC 2 · Nemocnica Lipová – bronchológia', 'bronchológia KOC 2', '2026-09-17', '2026-09-17', '06'),
  exam('histology', 'Histológia (výsledok biopsie)', 'KOC 2 · Nemocnica Lipová – patológia', 'patológia KOC 2', '2026-09-17', '2026-09-23', '07'),
  exam('pet', 'PET/CT celotelové', 'KOC 1 · Nemocnica Severní', 'nukleárna medicína KOC 1', '2026-10-01', '2026-10-01', '08'),
  { id: 'markers', title: 'Dodatok k histológii: EGFR, ALK, ROS1, PD-L1', place: 'KOC 2 · Nemocnica Lipová – patológia',
    owner: 'patológia KOC 2', due: DUE, state: 'ordered', history: [h('ordered', '2026-09-23')] },   // správa 07: „probíhá“
  { id: 'mdt', title: 'Konzílium (MDT)', place: 'KOC 2 · Nemocnica Lipová', owner: 'KOC 2', due: MDT, state: 'ordered',
    history: [h('ordered', RECEIVED)] },                                                               // predpoklad: dátum objednania
];

const s = ex.meta.stats;
const conflicts = fields.filter((f) => f.status === 'conflict').length;
const pending = ex.findings.filter((x) => x.severity === 'missing').length;

const NOVAK = {
  id: 'novak', demo: 'full',
  patient: { firstName: 'Josef', lastName: 'Novák', age: 60, sex: 'muž', insurerCode: '111',
    insurerName: 'Všeobecná zdravotní pojišťovna ČR', phone: '+420 603 000 118',
    contact: { name: 'Marie Nováková', relation: 'manželka', phone: '+420 603 000 119' } },
  referringGp: { name: ex.referringGp.name, practice: 'Pľúcna ambulancia, Nemocnica Benešov', phone: ex.referringGp.phone, email: ex.referringGp.email },
  diagnosisShort: 'adenokarcinóm pľúc (C34.1)',    // bez strany – strana je v rozpore (06 vs. ostatné)
  koc: 'KOC 2 · Nemocnica Lipová', mdtDate: MDT, receivedAt: RECEIVED, status: 'active',
  nextStep: { text: `Skontrolovať strojový návrh podkladu: ${conflicts} rozpory, ${pending} chýbajúci dodatok k histológii`,
    owner: 'ja (koordinátor)', due: DUE, mine: true },
  clockTargetDays: 33,                              // predvolená lehota (dánsky vzor pre pankreas); pre pľúca overenú nemáme
  fields, steps,
  labs: ex.labs.map((r) => ({ ...r, docId: pid(r.docId) })),
  meds: ex.meds.map((m) => ({ ...m, citation: cit(m.citation) })),
  exams: ex.exams.map((e) => ({ ...e, docId: pid(e.docId) })),
  docs,
  log: [
    { date: RECEIVED, action: 'Prijatá žiadosť pneumológa o prevzatie do KOC', detail: `Správa ${pid('09')} s prílohami (RTG, laboratórium, CT, bronchoskopia, histológia, PET/CT).`, billable: false },
    { date: RECEIVED, action: 'Podklad predvyplnený strojovo', detail: `20 polí · ${s.citationsVerified}/${s.citations} citátov doslova · ${conflicts} rozpory · v deme predpočítané`, billable: false },
  ],
  precheck: ex.precheck,
  reviewer: { insurerCode: '111', insurerName: 'Všeobecná zdravotní pojišťovna ČR',
    note: 'Pacient je poistencom VZP (111) – súhrn konzília ide reviznému lekárovi VZP. Odoslanie je v prototype simulované.' },
  ai: { label: 'AI výstup (predpočítaný)', mode: ex.meta.mode, model: ex.meta.model ?? null, generatedAt: ex.meta.generatedAt, evalFile: 'data/eval-pacient-2.json' },
};

writeFileSync(OUT, `// GENEROVANÉ: npm run pacient2 (scripts/build-pacient2.mjs) – NEUPRAVOVAŤ RUČNE. FIKTÍVNY PACIENT.
// Zdroj: public/data/extracted-pacient-2.json (${ex.meta.generatedAt}, ${ex.meta.mode}) + data-pacient-2/source-pacient-2.json.
import type { Case } from '../types';

export const NOVAK: Case = ${JSON.stringify(NOVAK, null, 1)};
`);
console.log(`pacient2.gen.ts: ${fields.length} polí, ${docs.length} správ, ${steps.length} krokov, ${NOVAK.labs.length} lab, ${NOVAK.meds.length} lieky`);
```

## Príloha B: kostra `src/components/EvalCard.tsx`

```tsx
// Karta „Kontrolná sada“ – LEN čísla z public/data/eval-*.json. Bez súboru alebo bez celistvej zlatej sady sa nezobrazí.
import { useEffect, useState } from 'react';
import './EvalCard.css';

interface EvalJson {
  generatedAt: string;
  extraction: { mode: 'rules' | 'rules+llm'; model: string | null; generatedAt: string };
  summary: { fieldsCorrect: number; fieldsTotal: number; trapsCaught: number; trapsTotal: number; inventedValues: number;
    citationsVerified: number; citationsTotal: number; fieldsWithoutVerifiedCitation: number; goldIntegrity: boolean };
  traps: { id: string; title: string; why: string; caught: boolean }[];
}
const cache = new Map<string, Promise<EvalJson | null>>();
function loadEval(file: string): Promise<EvalJson | null> {
  if (!cache.has(file)) cache.set(file, fetch(`${import.meta.env.BASE_URL}${file}`)
    .then((r) => (r.ok ? (r.json() as Promise<EvalJson>) : null)).catch(() => null));
  return cache.get(file)!;
}
const pl = (n: number, one: string, few: string, many: string) => (n === 1 ? one : n >= 2 && n <= 4 ? few : many);
export const evalLine = (s: EvalJson['summary']) =>
  `${s.fieldsCorrect}/${s.fieldsTotal} polí správne · ${s.trapsCaught}/${s.trapsTotal} pascí zachytených · ` +
  `${s.inventedValues} ${pl(s.inventedValues, 'vymyslená hodnota', 'vymyslené hodnoty', 'vymyslených hodnôt')}`;
export const modeLabel = (e: EvalJson['extraction']) => e.mode === 'rules' ? 'pravidlá, bez jazykového modelu'
  : /náhrada/i.test(e.model ?? '') ? 'pravidlá + jazykový model · odpoveď AI predpočítaná náhradným modelom (bez Azure kľúča)'
  : `pravidlá + jazykový model · ${e.model ?? ''}`;

export interface EvalRow { name: string; sub?: string; file: string; expectGeneratedAt?: string }

function Row({ row, full }: { row: EvalRow; full: boolean }) {
  const [ev, setEv] = useState<EvalJson | null>(null);
  useEffect(() => { let on = true; loadEval(row.file).then((e) => on && setEv(e)); return () => { on = false; }; }, [row.file]);
  if (!ev || ev.summary?.goldIntegrity !== true) return null;                       // nikdy záložné čísla
  const stale = !!row.expectGeneratedAt && ev.extraction.generatedAt !== row.expectGeneratedAt;
  return (
    <div className="ev-row">
      <div className="ev-who">{row.name}{row.sub && <span> · {row.sub}</span>}</div>
      {stale ? <div className="ev-stale">Meranie patrí k inej verzii vyťaženia – spustiť npm run eval.</div> : <>
        <div className="ev-line">{evalLine(ev.summary)}</div>
        <div className="ev-meta">{ev.summary.citationsVerified}/{ev.summary.citationsTotal} citátov doslova v správach (overuje program) · {modeLabel(ev.extraction)}</div>
        {full && <details className="ev-traps"><summary>Ktoré pasce?</summary>
          <ul>{ev.traps.map((t) => <li key={t.id} title={t.why} className={t.caught ? 'is-ok' : 'is-bad'}>{t.caught ? '✓' : '✗'} {t.title}</li>)}</ul>
        </details>}
      </>}
    </div>
  );
}

export function EvalCard({ rows, variant = 'compact', manual }: { rows: EvalRow[]; variant?: 'compact' | 'full'; manual?: boolean }) {
  return (
    <section className={`ev-card ev-${variant}`} aria-label="Kontrolná sada">
      <header><span className="ev-kicker">Na kontrolnej sade</span><span className="ev-pill">namerané</span></header>
      {manual && <p className="ev-note">Meria sa strojové vyťaženie tých istých správ, nie ručne overená verzia na tejto obrazovke.</p>}
      {rows.map((r) => <Row key={r.file} row={r} full={variant === 'full'} />)}
    </section>
  );
}
```
(Znak ✓/✗ je typografický znak, nie emoji. Ak chce SHELL jednotný vzhľad, vymení ho za `Icon name="check"`.
Ak sa nenačíta žiadny riadok, môže sa skryť celá sekcia.)
