# VÝSLEDOK – záverečná kontrola appky (kolo kvality)

_So 17. 10. 2026, okolo 03:00. Kontroloval som stav kódu po opravách z R1–R4. Prešiel som 44 nových screenshotov v `design/shots/` a opravil, čo ešte nesedelo._

## 1. Príkazy

| Príkaz | Výsledok |
|---|---|
| `npm run build` | **OK** (tsc bez chýb, vite build) |
| `npm run verify` | **OK, 100 %**: 5 prípadov, citáty **137/137** doslovne v správach, `✓ Všetko overené` (4 upozornenia na 2-slovné citáty pri Josefovi, neblokujú) |
| `npm run eval` (Alena) | **OK**: 20/20 polí · 17/17 pascí · 0 vymyslených · 72/72 citátov · režim rules+llm |
| `npm run eval -- --case pacient-2` | **OK**: 20/20 polí · 13/13 pascí · 0 vymyslených · 49/49 citátov |
| `node scripts/build-pacient2.mjs` | pregenerované `pacient2.gen.ts` a `eval.gen.ts`, aby sedeli s novým behom evalu |
| `npm run lint` | 0 chýb, 21 upozornení (react-refresh „only-export-components“, neškodné) |
| Konzola prehliadača (celý priechod dema) | žiadna chyba ani varovanie |
| Šírka 1280 px | bez vodorovného scrollu |

## 2. Čo som opravil v tomto kole

| # | Problém | Oprava |
|---|---|---|
| 1 | **Fronta nevidela, čo koordinátorka urobila v prípade.** Ranný prehľad písal „Procházková: chýba ECOG“ aj po doplnení (R1 #1, R3 B6). Dôvod: prípad zapisuje do svojho úložiska, fronta číta iný kontext. | Fronta teraz spája oba stavy (`useAllCaseSessions` + `mergeSessions`). „Ďalší krok“ na karte sa odvodí rovnako ako v prípade, napr. „Skontrolovať 2 návrhy a 1 rozpor pred konzíliom“. |
| 2 | **Žiadanka praktika nemala cestu späť ani pieskový pruh** (R1 #10). Shell čakal, že pruh nakreslí stránka, a stránka čakala Shell. | Pruh „Pohľad praktika · MUDr. Tomáš Řezníček“ s tlačidlom „Späť do appky koordinátora“ kreslí Shell. |
| 3 | Hlavička Aleny tvrdila **„AI výstup predpočítaný“**, hoci údaje pripravil tím ručne (karta merania pritom hovorí opak). | Odznak „ručne overené tímom“ a pravdivý tooltip. AI odznak má iba Josef Novák. |
| 4 | Dlaždica „20/20 na kontrolnej sade“ chýbala pri Josefovi (súbor má `caseId: pacient-2`). | `toEvalInfo` číta generovaný `EVAL_SUMMARY.cases[]` aj súbor `pacient-2`. |
| 5 | **Test poistky** (4 z 5 chybných AI návrhov zamietnutých) sa nezobrazoval, súbor nebol v `public/data` (R4 a4). | Skopírovaný `eval/vysledok-test-halucinacii.json` → `public/data/`. |
| 6 | Podklad MDT u Josefa: „tel. tel. … · e-mail … · e-mail …“ (kontakt dvakrát). | `mdtModel` rozdelí spojené pole na telefón a e-mail. |
| 7 | Riadok rozporu „Lieky“ ukazoval len A/B, zoznam liekov chýbal (R1 #3). | Hodnota poľa je nad verziami A/B. |
| 8 | Po uzavretí bola hlavička prípadu stále „aktívny“. Prípad sa „uzavrel 27. 10.“ a karta písala „uzavreté za 17 dní“. | Hlavička ukáže „uzavretý“. Dátum uzavretia = potvrdenie praktikom (22. 10., zo záznamu), počet dní sa ráta do uzavretia. |
| 9 | Ilustračné prípady nemali v hlavičke označenie (R1 #17). | Čip „ukážka · ilustračný prípad“. Dvojitá prázdna karta „Podklad sa ešte nezačal“ odstránená. |
| 10 | Pilulka „odošle sa spolu so záverom…“ pri revíznom lekárovi pretekala z karty. | Text sa zalomí. |
| 11 | Gramatika záznamu: „2 údajov chýba · 1 rozpory“. | „2 údaje chýbajú · 1 rozpor ponechaný konzíliu“. |
| 12 | Pole „Vykonané vyšetrenia“ u Josefa malo v riadku ~25 riadkov textu. | Dlhá hodnota má v riadku 4 riadky, celá je v paneli. |
| 13 | V paneli stálo „Návrh: ručne (tím)“ aj pri potvrdenom poli a pri ECOG z odpovede. | „Text poľa pripravil: …“, pri doplnenom poli sa nezobrazuje. |
| 14 | README nemal `#case/novak` ani príkazy `eval` / `build-pacient2`. | Doplnené. |

## 3. Stav nálezov R1–R4 (overené na screenshotoch)

**R1 (UX): opravené** #1, #2, #3, #4, #5, #6, #7, #8, #9, #10, #11, #12, #13, #14, #15, #16, #17, #18 (rýchla verzia: „Konzílium 21. 10.“ otvorí najbližší podklad), #19, #22, #23, #24, #25.
**Čiastočne:** #20 (laboratórium je zlúčené a kompaktný semafor je preč, Meno a Priezvisko sú stále dva riadky), #21 (poznámky v podklade MDT sú zoskupené po správach, hodnoty však ostávajú slovenské parafrázy v českej šablóne).

**R2 (fakty): opravené** #1, #2, #4–#25, #27 (extract a eval z toho istého behu rules+llm, 72/72), #28, #29, #30.
**Zostáva:** #3 mimo UI (pozri nižšie), #26 („Pravdepodobne preklep“ v `src/ai/extract.ts`, v UI sa nezobrazuje), #31 (voliteľné, „Nemocnica“ vs. „Nemocnice“).

**R3 (test dema): opravené** B1–B28. Okno „Vyžiadať“, panel aj toast sú na obrazovke (portál). Stav dema sa prenáša do podkladu MDT, záveru aj fronty. Rozhodnutie rozporu nemení hodnotu poľa, zapíše sa, kto ho potvrdil. Žiadanka s vlastným súborom sa dá odoslať.

**R4 (Maťova AI): hotové** P0 aj P1. Karta „Kontrola presnosti“ vo fronte a v prípade číta len namerané čísla, Josef Novák je plnohodnotný prípad (ID `N-xx`, bez tímu GIT v MDT, VZP 111). Ďalej odznak „AI výstup (predpočítaný)“, čip „AI“ a „Vysvetlivka AI“ pri poliach od modelu, tlačidlo „Skontrolované so zdrojom – potvrdiť“, „Vyžiadať dodatok“ (EGFR, ALK, ROS1, PD-L1) a test poistky.
**Nerobené (podľa plánu R4 voliteľné):** P2 prepínač ručne/strojovo pri Alene, P3 prepočet v prehliadači, stránka `#presnost`.

## 4. Kontrola „nič nevymyslené“

Strojovo som prešiel všetky mená (MUDr./Bc./doc.), telefóny a e-maily v `src/` voči textom správ (`source.json`, správy Josefa). Mimo zdrojov sú iba:
- 3 ilustračné prípady (Kučera, Pospíšilová, Králová, ich lekári MUDr. Jana Sedláčková, MUDr. Karel Novotný, MUDr. Petra Šťastná a telefóny +420 …611/621/631). Sú označené čipom „ukážka“ na karte vo fronte, v hlavičke prípadu a v poznámke pod frontou.
- Kontakt koordinátora v potvrdení žiadanky (`koordinator.koc2@example.cz`, +420 261 000 150), na obrazovke označený „(fiktívne)“.
- ECOG 1 zo správy 14, označený ako „ukážka (fiktívna správa pre demo)“.

Čísla: dánske lehoty a holandský cieľ sú označené ako zahraničný vzor, výkon 51887 = 250 Kč „ak ho poisťovňa uzná“. Čísla presnosti AI sa čítajú zo súborov merania, nič nie je napevno. Kanály, dátumy prijatia a časy úkonov majú poznámku „v deme simulované“. Odporúčania liečby sú len citácie zápisu MDT. Fronta je zoradená len podľa termínov.

## 5. Čo zostáva (na rozhodnutie alebo na Maťa)

1. **Maťove surové dáta** (`data-pacient-2/*.txt`, `source-pacient-2.json`, `public/data/extracted-pacient-2.json`, `eval/llm-cache/*.request.json`) stále obsahujú „Nemocnice Benešov“ (R2 #3). Appka to pri generovaní nahrádza („Nemocnice Podhájí“), v UI sa názov neukáže. Súbor v `public/data` je však verejne stiahnuteľný. Čisté riešenie: premenovať v zdrojoch a znova spustiť `extract` → `eval` → `build-pacient2` → `verify`.
2. `src/ai/extract.ts:253` „Pravdepodobne preklep“ (R2 #26) treba zmeniť na „Jeden z dátumov je chybný – overte s patológiou“ a znova spustiť extract + eval. Je to Maťov kód a v UI sa nezobrazuje.
3. Podklad MDT: hodnoty by mali byť doslovné české citáty (R1 #21). Je to väčšia zmena, pred 13:00 neodporúčam.
4. Demo krok 3 zo scenára (koncepty žiadostí o správy 01–06) je v appke len ako záznam „Vyžiadané správy 01–06“, samostatnú obrazovku nemá.
5. Časy úkonov z dema berú skutočný čas počítača (na generálke o 11:00 to bude 11:xx). Pri potvrdení podkladu je dátum pevne 19. 10.
6. Technický dlh: stav dema žije na dvoch miestach (modul `case/caseSession.ts` + kontext `session.ts`), spája ich `mergeSessions`. Funguje, ale je to krehké.
7. Keď je otvorený bočný panel, hlavička prípadu sa zúži a údaje idú pod seba. Je to len kozmetika.

## 6. Screenshoty (`design/shots/`, 1440 px, posledný beh)

01-fronta · 02-pripad-alena · 02b-pripad-meranie · 03-pripad-podklad · 04-pripad-cesta · 05-pripad-dokumenty · 06-pripad-zaznam · 07-podklad-mdt · 08-zaver-praktik · 09-ziadanka · 10-ziadanka-kontrola · 11-zaver-odoslany · 12-pripad-pole-panel · 12b-pole-ecog-chyba · 13-ziadost-koncept · 13b-ziadost-odoslana · 14-pole-doplnene · 15-stav-k-konziliu · 16-ziadanka-prijata · 17-rozpor-panel · 18-rozpor-rozhodnuty · 19-podklad-potvrdeny · 20-pripad-uzavrety · 21-navrh-potvrdeny · 22-pripad-po-deme · 23-dokumenty-k-konziliu · 24-podklad-mdt-po-deme · 25-fronta-po-deme · 26-zaznam-po-uzavreti · 27-fronta-uzavrety · 28-novak-pripad · 28b-novak-meranie · 29-novak-podklad · 30-novak-pole-ai · 31-novak-potvrdene · 32-novak-rozpor · 33-novak-mdt · 34-novak-zaver · 35-novak-dokumenty · 36-kucera · 37-ukazka-8-krokov · 38-ukazka-krok-2 · 39-fronta-1280 · 40-pripad-1280

---

# 2. kolo – mobil, demo časy, vyžiadané správy, urgovanie, nálezy poroty

_So 17. 10. 2026 ráno. Spojil som prácu troch agentov (mobil, doladenie dema, porota R5) a opravil nálezy poroty. Nové screenshoty sú v `design/shots/`._

## 1. Príkazy

| Príkaz | Výsledok |
|---|---|
| `npm run build` | **OK** (tsc bez chýb, vite build) |
| `npm run verify` | **OK, 100 %**: citáty **159/159** doslovne v správach (pribudli upozornenia a lieky zo správy 12), `✓ Všetko overené` (5 upozornení na 2-slovné citáty pri Josefovi, neblokujú) |
| `npm run eval` (Alena) | **OK**: 20/20 polí · 17/17 pascí · 0 vymyslených · 72/72 citátov |
| `npm run eval -- --case pacient-2` | **OK**: 20/20 polí · 13/13 pascí · 0 vymyslených · 49/49 citátov |
| `node scripts/build-pacient2.mjs` | pregenerované (zmenili sa len časové pečiatky merania) |
| `npm run lint` | 0 chýb, 25 upozornení (react-refresh „only-export-components“, neškodné) |
| Headless Chrome, celý priechod dema 1440 px | žiadna chyba ani varovanie v konzole, 1280 px bez vodorovného scrollu |
| Headless Chrome, mobil 390 × 844 (29 obrazoviek vrátane panelu, okien a ukážky) | `scrollWidth == innerWidth` všade, žiadna chyba v konzole |

## 2. Čo pribudlo od agentov
- **Mobil (≤ 760 px):** spodná lišta s ikonami, kompaktná horná lišta, jednostĺpcové rozloženie, panel originálu a okná ako „bottom sheet“, tabuľky sa posúvajú vo vnútri. Desktop sa nezmenil.
- **Demo:** časy úkonov sú pevné (`demoClock.ts`, napr. 12:40 histológia → 12:43 → 12:45), nie z hodín počítača. Karta **„Vyžiadané správy“** na záložke Dokumenty (01–06: kto, kedy vyžiadané, kedy prišlo, koľko dní). Tlačidlo **„Urgovať“** pri kroku, ktorý mešká (koncept, simulované odoslanie, zápis do záznamu, „urgované 19. 10.“). „Záver pre praktika →“ v hlavičke podkladu MDT.

## 3. Čo som opravil podľa poroty (R5)

| R5 | Problém | Oprava |
|---|---|---|
| #1 | Varovanie **tramadol + antidepresíva** (správy 12 a 13) sa stratilo, Lieky ostali na stave z 2. 10. | Od 26. 10. červená karta **„Upozornenie, ktoré musí ísť ďalej“** s doslovnými citátmi zo správ 12 a 13 a tlačidlom **„Pripraviť správu pre psychiatriu a praktika“** (koncept, odoslanie simulované, zápis do záznamu). Pole Lieky má od 26. 10. novú verziu zo správy 12 (tramadol, metamizol, paracetamol max. 3×, metoklopramid, laktulóza), karta Lieky ich ukáže s citátmi. Pri uzavretí karta vypíše kroky, ktoré po konzíliu ešte bežia; nová správa po uzavretí prípad znovu otvorí. |
| #2 | Riadok rozporu nepovedal, v čom je rozpor. | Pod A/B je oranžovo vysvetlenie rozporu. Pri inom rodnom čísle (Josef, laboratórium N-04) je hodnota prečiarknutá s textom „Nepoužívať, kým sa neoverí, či správa patrí tomuto pacientovi“. |
| #3 | Podklad MDT bral nepotvrdené návrhy ako fakt a dal sa poslať. | Hodnoty z návrhov majú v dokumente pilulku „návrh – nepotvrdený“ (pri AI aj „· AI“), počítadlo „16 návrhov čaká na kontrolu“. **Poslať lekárovi** sa dá až po kontrole všetkých návrhov (tlačidlo „Najprv skontrolovať návrhy (N) →“). Chýbajúci dodatok EGFR/ALK/ROS1/PD-L1 sa počíta medzi chýbajúce. Po potvrdení fronta aj prípad píšu „Podklad potvrdil MUDr. Martin Svoboda · 1 rozpor nechaný konzíliu“ namiesto „neúplný podklad“. |
| #4 | „deň X z 33“ (pankreas) aj pri pľúcach, čreve, prsníku. | Pri inej diagnóze len „deň X od prijatia žiadosti“, bez cieľa a bez pruhu. |
| #5 | Čísla presnosti bez kontextu, „1 prijal“ strašilo. | „Meranie na 2 fiktívnych pacientoch“ + poctivá veta z merania („pravidlá sme po prvom behu zovšeobecnili, predtým 18/20 polí, 6/13 pascí“). Test poistky jednotne: „model navrhol 5 hodnôt, 4 vymyslené zamietol, 1 pravdivú prijal → v podklade 0 vymyslených“. Namiesto „náhradný model“: „odpoveď vygeneroval Claude na presne ten istý pseudonymizovaný prompt (v prevádzke Azure OpenAI EU)“. |
| #6 | Ďalší porotca videl Alenu „uzavretú 22. 10.“ v pondelok 19. 10. | „Ukážka v 8 krokoch“ vždy začína z čistého stavu. V hornej lište sa po prvom úkone objaví „Začať odznova“, v paneli ukážky tiež. |
| #7 | V podklade MDT chýbala otázka praktika a želania pacientky. | V časti 3 rámik „Otázka praktika pre konzílium“ (doslovná veta zo správy 07), v časti 4 „Želania a sociálne“; oboje označené „doplnené nad rámec šablóny“. |
| #8 | „Moja bilancia“ ukazovala koruny a čísla nesedeli so Záznamom. | Hlavné číslo = „slučky uzavreté tento týždeň“, ďalej „Podklady na konzílium tento týždeň kompletné 0/2“, „S termínom dnes (na mne)“, „Čaká na iných“. Koruny sú len v Zázname („podklad pre vykázanie výkonu 51887 · vykazuje nemocnica, uznáva poisťovňa“). |
| #9 | Bezpečnostné fakty zahrabané v riadkoch. | Pás **„Pozor“** pod menom: Alena – antikoagulácia apixaban (správa 07), od 26. 10. aj tramadol + antidepresíva; Josef – alergia na jódovú kontrastnú látku, laboratórium s iným rodným číslom. Každá položka má citát a klik na originál, žiadne odporúčanie. |
| #10 | „23 údajov so zdrojom“, hoci polovica nie je doslovný citát. | „13 doslovných citátov · 11 odkazov na celú správu“. (Doslovné vety pre riadky vyšetrení zostávajú, pozri nižšie.) |
| #11 | Budúcnosť presakovala (Josef, 73 kg pri 19. 10.). | Veta o neskoršej hodnote sa skryje, kým nepríde jej správa. Časy úkonov a dátum potvrdenia podkladu opravil agent dema. |
| #12 | Nový prípad nemal tlačidlo na svoj krok. | Kučera: hlavné tlačidlo **„Prevziať žiadosť“** (zápis do záznamu, prípad je aktívny, ďalší krok „Vyžiadať CT…“). Prípad bez konzília má podklad sivý „po zaradení na konzílium“. „Pohľad praktika“ vo fronte je sekundárne tlačidlo. |
| #13 | ECOG v podklade vs. zápis konzília „stanovit ECOG“. | V „Čo to znamená pre vás“ drobný text: „ECOG 1 bol v podklade od 19. 10. (správa 14 – ukážka pre demo). Zápis konzília je fiktívny podklad VZP a ECOG ešte neuvádza.“ |
| #14 | Čeština v slovenčine, gramatika, rozpor pri kóde MKN. | „chýba v dokumentácii: 3“, „e-mail (odosielajúci lekár)“, veta o jazyku šablóny, „Vysvetlivka AI (píše jazykom správy)“, rozpor laloka sa pri kóde C34.1 už nevypisuje. |
| #15 | Drobnosti. | Bez „jedno sloveso na riadok“; Cesta „7 krokov · 4 s výsledkom“; ECOG v Dokumentoch v skupine „Treba vyžiadať“; rozpor v semafore sýtejšou oranžovou so značkou „A/B“; ranný prehľad po riadkoch s menami ako odkazmi; e-maily v žiadanke „na vedomie“; čas „08:15“. |

Ďalej: rozpracované hľadanie sa pri prechode na inú obrazovku vymaže; „Ukážka“ aj „Začať odznova“ fungujú aj na mobile.

## 4. Čo zostáva
1. **Uzavretie s otvorenými krokmi** (R5 #1): nezablokoval som ho, lebo je to krok 8 ukážky. Appka to hovorí nahlas a nová správa prípad znovu otvorí. Fronta je pevne k 19. 10., „nová správa po uzavretí“ sa v nej neukáže.
2. **Doslovné vety pre riadky vyšetrení v podklade MDT** (R5 #10, M) a české citáty namiesto slovenských parafráz (R1 #21).
3. **Maťove surové dáta** stále obsahujú „Nemocnice Benešov“ (R2 #3) a `src/ai/extract.ts` „Pravdepodobne preklep“ (R2 #26) – v UI sa nezobrazujú.
4. Technický dlh: stav dema žije na dvoch miestach (`case/caseSession.ts` + kontext v `App.tsx`), spája ich `mergeSessions`; reset maže oba.
5. Pri „stav k 27. 10.“ je na Prehľade popri hlavičke druhé fialové tlačidlo (karta upozornenia) – zámerne, je to najdôležitejší úkon v tej chvíli.

## 5. Screenshoty (`design/shots/`)
**Desktop 1440 px (prepísané):** 01–40 ako doteraz, plus d-01, d-02, d-12 (kópie 01, 02, 12).
**Desktop – nové:** 36b-kucera-prevzata · 41-vyziadane-spravy · 42-urgovat · 43-urgencia-koncept · 44-urgovane · 45-po-uzavreti-upozornenie · 46-upozornenie-koncept · 47-upozornenie-poslane · 48-lieky-po-26-10.
**Mobil 390 × 844 @2x (prepísané):** m-00 … m-37 ako doteraz.
**Mobil – nové:** m-33-novak-mdt · m-41-vyziadane-spravy · m-42-urgovat · m-45-upozornenie-hlavicka · m-45b-upozornenie-karta · m-46-upozornenie-koncept.

---

# 3. kolo – motor naživo, čeština, upratanie, telefonát ECOG

_So 17. 10. 2026 okolo 06:00. Spojil som prácu troch agentov (A: obrazovka „Zpracování naživo“, B1: čeština rámu a dokumentov, B2: čeština prípadu a dát) a Maťove commity z noci (motor česky, mutácie „Zkuste to rozbít“, slepý test pacienta 3 a zovšeobecnené pravidlá po ňom, commit 97e5f92). Všetko nižšie je overené na jeho najnovšom motore._

## 1. Príkazy

| Príkaz | Výsledok |
|---|---|
| `npx tsc -b`, `npm run build` | **OK** (0 chýb) |
| `npm run verify` | **OK, 100 %**: citáty **158/158** doslovne v správach, `✓ Všetko overené` (6 upozornení na 2-slovné citáty pri Josefovi, neblokujú). Zápis telefonátu (ECOG) sa vypíše zvlášť ako „vstup koordinátorky, neoveruje sa proti správam“. |
| `npm run eval` (Alena) | **OK**: 20/20 polí · 17/17 pascí · 0 vymyslených · 73/73 citátov |
| `npm run eval -- --case pacient-2` | **OK**: 20/20 polí · 13/13 pascí · 0 vymyslených · 49/49 citátov |
| `npm run eval:mutations` (Maťov) | **OK**: 14/14 úprav bez chyby, 0 vymyslených hodnôt |
| `node scripts/build-pacient2.mjs` | pregenerované `pacient2.gen.ts` a `eval.gen.ts` z Maťových nových výstupov |
| `npm run lint` | 0 chýb, 27 upozornení (react-refresh, neškodné) |
| Headless Chrome, produkčný build | 1440, 1280 aj 390 × 844: **žiadna chyba ani varovanie v konzole**, **žiadny vodorovný scroll**, kontrola slovenských slov na každej obrazovke: **0 nálezov** |
| „Ukázka v 8 krocích“ | prejdená celá na 1440 (so všetkými úkonmi v krokoch) aj na 390, bez chyby |

Eval prepíše v `public/data/eval-*.json` a `eval/vysledok-mutace.json` len čas behu – vrátil som ich na Maťovu verziu, jeho súbory (`src/ai`, `scripts/extract*`, `scripts/eval*`, `eval/`, `data-pacient-*`) som nemenil.

## 2. Namerané čísla motora (`extractHandover`, beží v prehliadači, bez servera)

| Situácia (Alena) | Vyplnené | Rozpory | Citáty doslova | Čas jedného prepočtu |
|---|---|---|---|---|
| len žiadanka 07 (2. 10.) | 15/20 | 0 | 24/24 | 6 ms |
| po príchode všetkých 13 správ | 19/20 (chýba ECOG) | 2 (apixaban 18. 10. × výkon 12. 10.; histológia odber 20. 10. × vydaná 19. 10.) | 66/66 | 16–28 ms na každú správu |
| prepínač „Stav k datu konzilia 21. 10.“ | 19/20, váha **65 kg** (nie 63 kg), správy 12 a 13 „po konziliu – mimo podklad“ | 2 | 64/64 | 17 ms |
| + „Zapsat telefonát“ (ECOG 1) | **20/20** | 2 | 67/67 | 15 ms |
| Zkuste to rozbít: iné RČ v správe 10 | 19/20 | **3** (nový: iné rodné číslo, obe citácie) | 68/68 | 30 ms |
| Zkuste to rozbít: „kaudy“ namiesto „hlavy“ v CT 08 | 19/20 | **3** (nový: umiestnenie nálezu) | – | 27 ms |
| oprava dátumu apixabanu / ECOG v 07 / zmazaná 11 | 19/20 · 20/20 · 18/20 | 1 · 2 · 1 | 64 · 67 · 61 | 15–16 ms (Node) |
| Josef Novák, 10 správ | 20/20 | 3 (strana, alergia, cudzie RČ) + chýba dodatok EGFR/ALK | 46/46 | 7–8 ms |

Čísla sú z headless Chrome na tomto Macu (produkčný build), na Maťovom najnovšom motore. Na inom notebooku sa ms môžu líšiť, poradie zostáva desiatky milisekúnd.

## 3. Čo je hotové v tomto kole

1. **Obrazovka „Zpracování naživo“ je zapojená do appky.** Odkazy `/#live`, `/#live/alena`, `/#live/novak`. V bočnom paneli (a v spodnej lište na mobile) je nová položka **„Zpracování“**. V hlavičke prípadu Aleny a Josefa je tlačidlo **„Zpracovat naživo“**, na obrazovke motora je **„Otevřít případ“**. Prepnutie pacienta je v adrese, takže tlačidlo „Späť“ v prehliadači funguje.
2. **„Ukázka v 8 krocích“ je nanovo, podľa nového príbehu.** 1 Fronta → 2 Praktik pošle žádanku (Vložit ukázku → kontrola → Odeslat) → 3 Zpracování naživo (Přehrát příchod zpráv) → 4 Pasti a rozpory (apixaban, histologie) → 5 Zkuste to rozbít (Jiné rodné číslo ve zprávě 10) → 6 Chybí ECOG → Zapsat telefonát → Uložit do podkladu → 7 Stav k 21. 10. → Podklad pro konzilium (MDT_zapis) → 8 Závěr pro praktika → Odeslat → doručenka → Uzavřít případ. Texty krokov používajú skutočné názvy tlačidiel. Kroky 3–5 sú na tej istej obrazovke a jej stav medzi krokmi ostáva.
3. **Čeština všade.** Maťov motor už píše česky, prevodník `components/live/cesky.ts` nechávam ako poistku (český text prejde bez zmeny). Josefove poznámky z motora boli v `pacient2.gen.ts` ešte po slovensky („Podľa označenia…“, „60 rokov“, „Chýba avizovaný dodatok“, tooltip modelu) – `build-pacient2.mjs` ich teraz prevedie cez ten istý prevodník, citáty nemení. Kontrola textu každej obrazovky (vrátane `title`, `aria-label`, `placeholder`) v prehliadači nenašla ani jedno slovenské slovo.
4. **Drobné opravy:** zápis telefonátu na obrazovke motora má nadpis „Doslovně ze zápisu koordinátorky“ (nie „ze zprávy“) a odkaz „Zobrazit zápis“; nový nález motora `location-conflict` má český nadpis „Nesouhlasí umístění nálezu“; v závere pre praktika zmizla dvojitá bodka („27. 10..“); na mobile sa dlhé tlačidlo „Připravit zprávu pro psychiatrii a praktického lékaře“ zalomí.
5. **Piata pripravená úprava v „Zkuste to rozbít“:** „Jiné umístění nádoru ve zprávě 08 (CT)“ (z Maťovho `public/data/mutace.json`, otestované `npm run eval:mutations`). Zmena strany/umiestnenia nádoru u Aleny teraz funguje.
6. **README:** odkaz `/#live/…`, príkaz `eval:mutations`, priečinok `components/live`.
7. Overené z kola B1/B2: vo fronte nie je „Moje bilance“ ani karta 20/20, len „den X od přijetí žádosti“ (bez 33-dňového cieľa a zahraničných lehôt); v Žiadanke nie je falošná 0,9 s kontrola súboru; štítok „ručně ověřeno“ sa nikde nezobrazuje; jediná poznámka je v pätičke „Prototyp · fiktivní data · odesílání je v prototypu simulované · není zdravotnický prostředek“; ECOG sa dopĺňa len „Zapsat telefonát“ s predvyplneným textom kapitána a zdrojom „telefonát · zapsala koordinátorka“, správa 14 neexistuje.

## 4. Čo zostáva

1. **Prípad Aleny (`#case/alena`) stále ukazuje ručne pripravené dáta** (`cases.ts`, `mode: 'manual'`), nie výstup motora. Motor beží naživo len na obrazovke „Zpracování naživo“. Telefonát zapísaný tam sa do prípadu neprenesie (prípad má vlastné „Zapsat telefonát“, ktoré sa prenesie do podkladu MDT aj záveru). Prepnúť prípad na motor + hromadné „Potvrdit ověřené“ je ďalší krok (tech lead: 1,5–2 h).
2. **„Vyžádat 01–06“ jedným klikom a objednanie CT s meniteľným termínom** (bod E4 z kritického hodnotenia) nie sú urobené.
3. **Slepý test (pacient 3)** – Maťove čísla (10/20 polí, 1/4 pascí pred úpravou pravidiel; po zovšeobecnení 20/20) v appke nie sú, sú v jeho `eval/` a v pitchu. Pacient 3 nie je v appke ako prípad.
4. Podklad MDT u Aleny: „3 návrhy čekají na kontrolu“ – lekárovi KOC sa dá poslať až po ich potvrdení v prípade (krok 7 ukážky to hovorí).
5. Na 1440 × 900 panel ukážky prekryje spodok stĺpca „Pasti a rozpory“, treba posunúť stránku. Rieši sa pri redizajne.
6. V kóde zostali nepoužité komponenty `EvalCard` (karta presnosti už nie je na obrazovkách) a slovenské komentáre (nie sú v UI). `CONTRACT.md` stále hovorí o slovenčine a dánskych lehotách – je zastaraný, appka sa ním v týchto bodoch už neriadi.

## 5. Screenshoty (`design/shots/`, 96 súborov)

**Desktop 1440 (prepísané a nové):** 00-hledani · 01-fronta · 02 až 06 prípad Aleny · 07-podklad-mdt (stav k 21. 10., ECOG z telefonátu) · 08-zaver-praktik · 09/10/16 žiadanka · 11-zaver-odoslany · 12-pripad-pole-panel · 12b-pole-ecog-chyba · 13-ziadost-koncept · 13b-ziadost-odoslana · **13-telefonat-okno** · 14-pole-doplnene · 15-stav-k-konziliu · 17-rozpor-panel · 20-pripad-uzavrety · 27-fronta-uzavrety · 28 až 35 Josef · 36-kucera · 37-ukazka-8-krokov · 41 až 46 · 39/40 a live-1280-start (1280 px).
**Motor naživo 1440:** live-1440-start · -all · -all-full · -field · -viewer · -pasti · -preset-rc · **-preset-kauda** · -edit · -mdt · -phone-okno · -phone · -novak.
**Mobil 390 × 844 @2x:** m-00 až m-46 (rovnaké obrazovky) + **m-50 až m-57** (motor naživo: štart, po prehratí, polia, pasce, rozbiť, telefonát, Josef) + m-37b-ukazka-krok-3.
**Zmazané (zastarané, slovenské UI alebo odstránené funkcie):** 02b/28b meranie, 18, 19, 21–26, 31, 36b, 38, 44, 45, 47, 48, d-01/d-02/d-12, live-390-*, m-00-hladanie, m-01b-fronta-bilancia, m-02b, m-03b, m-07b, m-08b. Sú v histórii gitu.
