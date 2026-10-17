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
