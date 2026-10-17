# R3 – QA test dema (klikanie v prehliadači)

_So 17. 10. 2026, 02:05–02:20. Kód `src/` zo 02:03 (počas testu sa nemenil). Dev server `npx vite --port 5179`, Chrome, viewport 1440 × 900 a 1280 × 800, svetlá téma. V kóde som nič nemenil._

## 1. Príkazy

| Príkaz | Výsledok |
|---|---|
| `npm run build` | **OK** – `tsc -b` bez chýb, `vite build` 68 modulov, JS 379 kB (gzip 116 kB) |
| `npm run verify` | **OK** – 4 prípady, 20 polí, Alena: 14 potvrdených · 3 na kontrolu · 1 chýba · 2 rozpory · 0 bez citátu; **citáty 81/81 doslovne**. `cases.json` sa prepísal bez zmeny (rovnaký SHA) |
| `npm run eval` (Alena) | **OK** – 20/20 polí, 17/17 pascí, 0 vymyslených, 0 polí bez citátu. O 02:05 režim `rules`, 63/63 citátov; po tom, čo iný agent o 02:11 prepísal `extracted-alena.json`, režim `rules+llm`, 72/72 citátov |
| `npm run eval -- --case pacient-2` | **OK** – 20/20 polí, 13/13 pascí, 0 vymyslených, 49/49 citátov |

Eval som púšťal s `--out` do scratchpadu, aby sa neprepísali `public/data/eval-*.json`. V konzole prehliadača nebola žiadna chyba ani varovanie.

## 2. Priechod demom – súhrn

| # | Krok | Výsledok |
|---|---|---|
| 1 | Fronta: poradie podľa termínu, filtre, hľadanie, ranný prehľad, „Prototyp · fiktívne dáta“ | OK (drobnosti B18) |
| 2 | Prípad Aleny: hlavička, metriky, „0 údajov bez zdroja“ | OK |
| 3 | Klik na pole → originál so zvýraznenou vetou + „Citát overený“ | OK, ale stránka pod panelom poskočí (B7) |
| 4 | Rozpor vedľa seba (apixaban, histológia) → Platí A/B | Zobrazenie OK, **po rozhodnutí sa stratí obsah poľa (B5)** |
| 5 | Vyžiadať ECOG → koncept žiadosti | **BLOKUJE: okno je mimo obrazovky (B1)** |
| 6 | Odoslať → Simulovať odpoveď | **Panel je prázdny, tlačidlo je mimo obrazovky (B2), toast nevidno (B3)** |
| 7 | Pole ECOG zozelenie | OK (16/20 potvrdených), „Ďalší krok“ sa ale neaktualizuje (B8) |
| 8 | Posuvník k 21. 10.: váha 65 kg (15. 9.), správy 12 a 13 v „Prídu neskôr“, 27. 10. → 63 kg s poznámkou | OK |
| 9 | Podklad pre konzílium (7 častí MDT_zapis, vynechané 12 a 13, Potvrdiť, Tlačiť) | Funguje, **ale ECOG „nie je v dokumentácii“ a rozpor stále otvorený (B4)** |
| 10 | Záver praktikovi → Odoslať → doručenka (3 stavy) | OK (časy nesedia so záznamom, B14) |
| 11 | Revízny lekár ZP 211 (nie VZP) | OK |
| 12 | Uzavrieť → záznam o koordinovaní (11 dní, 25 úkonov, 2 750 Kč) | Karta OK, **odkaz ukáže iné čísla a prípad ostane „aktívny“ (B6, B10)** |
| 13 | Intake: Vložiť ukážku → kontrola (5 chýba / 4 na vedomie) → Odoslať → Prijaté + e-mail | OK (B16, B17) |

## 3. Bugy

Závažnosť: **P0** = na deme to spadne alebo to porota uvidí hneď · **P1** = vážna chyba v dátach alebo v logike · **P2** = viditeľná nekonzistencia · **P3** = drobnosť alebo obsah.

### P0

#### B1 – Okno „Vyžiadať“ (koncept žiadosti) sa nezobrazí, vidno len rozmazanú obrazovku
- **Kroky:** `#case/alena` (Prehľad) alebo `#case/alena/podklad` → pri poli 14 „Výkonnostný stav (ECOG)“ klik **Vyžiadať**.
- **Očakávané:** v strede obrazovky sa otvorí okno s adresátom, kanálom NIS, konceptom a tlačidlom Odoslať.
- **Skutočné:** celá plocha sa rozmaže, ale okno nie je vidno. Na Prehľade je nad hornou hranou (top −530 px), na Podklade pod spodnou hranou (top +1314 px). Treba ho hľadať posúvaním, Esc ho zavrie. Rovnako sa správa **Vyžiadať upresnenie** pri rozpore. Chyba je zachytená už aj na `design/shots/13-ziadost-koncept.png`.
- **Príčina:** `src/theme.css:57–58` – `.page-enter { animation: page-enter … both }`. Po skončení animácie ostane `transform: matrix(1,0,0,1,0,0)` a to robí z obalu stránky „containing block“ pre všetky prvky s `position: fixed` (`.cs-modal-back`, `.cs-panel`, `.cs-panel-scrim`, `.cv-toast`). Tieto prvky sa potom nemerajú k obrazovke, ale k celej stránke vysokej 7 000 px.
- **Oprava (overená v prehliadači cez dočasný inline štýl):** `animation-fill-mode: backwards` (alebo vyhodiť `transform` z keyframes). Potom `transform: none` a okno sa zobrazí v strede (top 183 px, bottom 745 px pri 900 px výške). Alternatíva: modal, panel aj toast vykresliť cez `createPortal(…, document.body)`.

#### B2 – Bočný panel originálu má výšku celej stránky, po akcii je viditeľná časť prázdna
- **Kroky:** Podklad → posunúť nadol → pole 14 → Vyžiadať → (nájsť okno) → Odoslať.
- **Očakávané:** panel vpravo ukáže „Žiadosť odoslaná · čaká na odpoveď“ a tlačidlo **Simulovať odpoveď**.
- **Skutočné:** panel je biely a prázdny. Má výšku 7 244 px a obsah s tlačidlom je hore mimo obrazovky (top −3 426 px), takže treba vyskrolovať na začiatok stránky. Pri rozpore (široký panel) sa panel otvorí posunutý a nadpis poľa nevidno.
- **Príčina a oprava:** rovnaké ako B1.

#### B3 – Potvrdzujúce hlášky (toast) nikdy nevidno
- **Kroky:** Odoslať žiadosť / Simulovať odpoveď / Platí A.
- **Očakávané:** dole na obrazovke sa na 2,8 s ukáže „Žiadosť odoslaná · …“, „Prišla odpoveď · správa 14 · pole … doplnené“, „Rozpor rozhodnutý · platí A“.
- **Skutočné:** toast sa vykreslí na spodku stránky (y ≈ 3 760 px pri výške okna 900 px).
- **Príčina a oprava:** rovnaké ako B1.

#### B4 – Doplnený ECOG a rozhodnutý rozpor sa nedostanú do Podkladu pre konzílium
- **Kroky:** prípad Aleny → Vyžiadať ECOG → Odoslať → Simulovať odpoveď (pole 14 = ECOG 1, zelené) → Platí A pri liekoch → **Podklad pre konzílium**.
- **Očakávané:** v časti 5 „Stav výkonnosti (ECOG): ECOG 1“ s poznámkou na správu 14, rozpor apixabanu je uzavretý. Zadanie (`Zadani_ulohy`) to žiada výslovne: „doplnění … koordinátorem a jejich zapracování do handoveru“.
- **Skutočné:** „Stav výkonnosti (ECOG): **nie je v dokumentácii**“, počítadlo „3 nie je v dokumentácii“ a pri liekoch stále „Rozpor v dokumentácii …“.
- **Príčina:** stav dema (`overrides`, `arrived`, `sessionLog`) žije len v `useState` v `src/pages/CaseView.tsx:57–59`. `MdtDoc` a `GpReport` čítajú len statické `CASES`. Treba ho zdvihnúť do `App` alebo do kontextu, napr. vedľa `asOf` v `NavContext`, a `buildMdtModel` musí overrides použiť.

### P1

#### B5 – Rozhodnutie rozporu prepíše obsah poľa: zmizne zoznam liekov aj výsledok histológie
- **Kroky:** Podklad → pole 12 „Lieky, ktoré užíva“ → **Platí A**; pole 19 „Histológia“ → **Platí B**.
- **Očakávané:** pole ostane „apixaban 5 mg 1-0-1, bisoprolol …“, resp. „Duktálny adenokarcinóm pankreasu, G2–G3 …“ a pribudne poznámka, ktorý dátum platí.
- **Skutočné:** pole 12 = „**Biopsia bola 12. 10. 2026**“, pole 19 = „**Správa vydaná 19. 10. 2026**“. Lieky a histológia zo semaforu zmiznú a citáty sa zúžia na jediný.
- **Príčina:** `CaseView.tsx:181` uloží `value: v.value` (text varianty rozporu) a `caseUtils.ts:188` ním nahradí hodnotu poľa. Opraviť tak, že sa ponechá `field.value` a `citations` a variant pôjde len do `note`.

#### B6 – Stav dema sa po odchode z prípadu stratí a uzavretie sa nikde neprejaví
- **Kroky:** doplniť ECOG + Platí A → Podklad pre konzílium → **Späť na prípad**. Alebo Záver pre praktika → Uzavrieť prípad → Fronta.
- **Očakávané:** ECOG ostane zelený, rozpor uzavretý, v zázname sú nové úkony. Po uzavretí má prípad stav „uzavretý“ vo fronte aj v hlavičke.
- **Skutočné:** po návrate ECOG znova „chýba“, rozpor je otvorený a úkony zo záznamu zmizli. Po uzavretí je hlavička aj karta vo fronte „aktívny“ a ranný prehľad stále píše „Procházková: chýba ECOG“.
- **Príčina:** rovnaká ako pri B4. Stav uzavretia drží len `GpReport` (`stage`).

#### B7 – Klik na citát v paneli posunie celú stránku a koordinátor stratí miesto v zozname
- **Kroky:** Podklad → posunúť na pole 8 → klik na čip „správa 08“ alebo „správa 11“.
- **Očakávané:** posunie sa iba text správy v paneli.
- **Skutočné:** stránka poskočí (zmerané: scrollY 1 100 → 687 px).
- **Príčina:** `OriginalPanel.tsx:18` volá `scrollIntoView` na `<mark>`. Keďže panel nie je naozaj fixný (B1), scrolluje sa okno. Po oprave B1 overiť znova, prípadne scrollovať len `.cs-panel-body`.

### P2

#### B8 – „Ďalší krok“ sa po doplnení ECOG neaktualizuje
- **Kroky:** doplniť ECOG (pole zelené) → Prehľad → posuvník „konzílium · 21. 10.“.
- **Očakávané:** ďalší krok sa zmení alebo sa označí ako hotový.
- **Skutočné:** stále „Doplniť výkonnostný stav (ECOG) …“, a pri 21. 10. navyše načerveno „do 20. 10. 2026“ ako meškajúce (`CaseView.tsx:215`, statické `c.nextStep`).

#### B9 – „Vyžiadať upresnenie“ pri rozpore je slepá ulička
- **Kroky:** pole 12 → Vyžiadať upresnenie → Odoslať.
- **Očakávané:** po odpovedi (alebo aj bez nej) sa dá rozhodnúť A/B alebo odpoveď simulovať.
- **Skutočné:** pole sa natrvalo prepne na „čaká na odpoveď“. Verzie A/B, tlačidlá Platí A/B aj hodnota poľa (lieky) zmiznú a „Simulovať odpoveď“ chýba (pri rozporoch nie je `resolvedBy`).
- **Text konceptu** (`CaseView.tsx:141`): „rozchádzajú dva zdroje (**správa 09 a správa 09**)“ (oba citáty sú z tej istej správy), „pre pacientku **Alena Procházková**“ (má byť „Alenu Procházkovú“), podpis „Koordinátorka KOC, KOC 2 · Nemocnica Lipová“ je bez mena.

#### B10 – Záznam o koordinovaní po uzavretí ukazuje iné čísla ako karta uzavretia
- **Kroky:** posuvník na 21. 10. → Záver pre praktika → Odoslať → Uzavrieť prípad → **Otvoriť záznam o koordinovaní**.
- **Očakávané:** 11 dní so zásahom, 2 750 Kč, celý záznam do 22. 10.
- **Skutočné:** „**10 dní** so zásahom · 4 k dátumu skrytých“, pretože posuvník ostal na 21. 10. Odkaz by mal posuvník nastaviť na „všetko“.

#### B11 – Posuvník „stav k dátumu“ sa prenáša medzi pacientmi
- **Kroky:** Alena → posuvník 21. 10. → Fronta → Jaroslav Kučera.
- **Očakávané:** nový prípad sa otvorí k „dnes · 19. 10.“.
- **Skutočné:** Kučera sa otvorí k 21. 10. s „deň 2 z 33“, kým vo fronte má „deň 0 z 33“ (`App.tsx:64`, globálny `asOf`).

#### B12 – Ľahké prípady hlásia „Podklad je kompletný“, hoci nemajú ani jedno pole
- **Kroky:** `#case/kucera` (rovnako Pospíšilová, Králová).
- **Skutočné:** „Úplnosť podkladu 0/0 · 0 % · **všetky polia potvrdené**“ a „**Podklad je kompletný. Všetky polia majú zdroj.**“ (`Metrics.tsx:32`, `CaseView.tsx:232`).
- **Očakávané:** „Podklad sa ešte nezačal – čakáme na správy“.

#### B13 – Podklad MDT pre pacienta s pľúcami uvádza tím pre nádory GIT
- **Kroky:** `#mdt/kucera`.
- **Skutočné:** časť 2 „Členové MDT“ vypíše HPB chirurga, gastroenterológa a ďalších zo vzoru `MDT zaver` Aleny so zdrojom „zloženie tímu pre nádory GIT“ (`mdtModel.ts:226`). Pre pľúca je to vymyslené priradenie.
- **Očakávané:** pri inom type nádoru „nie je v dokumentácii“ alebo tím jasne označený ako „ukážka“.

#### B14 – Časy uzavretia slučky si odporujú
- Záver pre praktika (`GpReport.tsx:35–37`, natvrdo): odoslané **21. 10. 16:40**, doručené 21. 10. 16:41, potvrdené **22. 10. 8:15**. Revízny lekár: „súhrn odoslaný · 21. 10.“.
- Záznam o koordinovaní (`cases.ts`, ALENA_LOG): „**22. 10. 09:00** Záver odoslaný praktikovi“ a „22. 10. 09:10 Súhrn pre revízneho lekára“. Podľa záznamu teda záver odišiel až po tom, čo ho praktik potvrdil.

#### B15 – Dve rôzne mená koordinátorky
- Horná lišta a pozdrav: „**Klára**, koordinátorka“ (`Shell.tsx:31`, meno nie je v zdrojoch).
- Žiadosť o ECOG, potvrdenie prijatia v Intake, zoznam členov MDT aj Záver pre praktika: „**Bc. Lucie Dvořáková**“ (to meno je vo vzore `MDT zaver`).
- **Návrh:** všade Bc. Lucie Dvořáková.

#### B16 – Intake: s vlastným súborom sa nedá odoslať a appka nepovie prečo
- **Kroky:** `#intake` → pretiahnuť alebo vybrať ľubovoľný súbor (nie „Vložiť ukážku“).
- **Skutočné:** súbor sa pridá s textom „obsah sa v prototype nespracúva“. Kontrola ostane „čaká na žiadosť“ a **Odoslať** je natrvalo neaktívne (`Intake.tsx:75–80`, `298`). Ak mentor nahrá vlastný dokument („živý režim“ z overdeliver plánu), demo sa zasekne.
- **Očakávané:** aspoň hláška „V prototype vyhodnocujeme len ukážku (správa 07)“, alebo povoliť odoslanie bez kontroly.

#### B17 – Intake: potvrdenie ide e-mailom praktikovi, hoci ten istý e-mail píše, že jeho adresa chýba
- **Kroky:** Intake → Vložiť ukážku → Odoslať.
- **Skutočné:** „Komu: MUDr. Tomáš Řezníček … (e-mail)“ a v tele „Chýba e-mail praktika na doručenie záveru“. Ak žiadosť prišla e-mailom, adresa je známa (odpoveď). Ak nie je známa, potvrdenie nemôže odísť e-mailom. Gramatika: „prevzatie pacientky **Alena Procházková**“ má byť „Aleny Procházkovej“ (`Intake.tsx:133`).

### P3 (drobnosti a obsah)

- **B18 – Lehota 33 dní (dánsky pankreas) aj pri pľúcach, hrubom čreve a prsníku.** Fronta aj metrika píšu „deň X z 33 · dánsky vzor pre pankreas“ pri Kučerovi, Pospíšilovej a Královej. Tooltip to priznáva, ale lehota k týmto diagnózam nepatrí. Pri ľahkých prípadoch ju skryť alebo napísať „predvolená lehota (ukážka)“.
- **B19 – Zlý rod pri mužovi.** `#gp/kucera`: „**Pacientka** je poistená v 111 … súhrn ide **jej** reviznému lekárovi“ (`GpReport.tsx:183`).
- **B20 – Dátum fiktívnej správy 14.** Text správy má „Datum: 20. 10. 2026“, appka ukáže „vyšetrenie 19. 10. 2026 · prijaté 19. 10.“ (`CaseView.tsx:170` skráti dátum na „dnes“).
- **B21 – Kto rozhoduje rozpor.** Vysvetlenie píše „Kedy pacientka liek naozaj vysadila, treba overiť – **rozhodne lekár**“, ale Platí A/B klikne koordinátor a záznam uloží „rozhodnuté **koordinátorom**“. Pri klinickom údaji (apixaban, dátum odberu histológie) je to v rozpore s pravidlom „rozhoduje človek/lekár“. Návrh: „Platí A – potvrdil lekár (meno)“.
- **B22 – Eskalácia histológie „dnes“ nevidno.** K 19. 10. je krok Histológia zelený bez značky „doručené 4 dni po termíne“. Červené „mešká“ sa ukáže len pri posuvníku na 16.–18. 10. Pre krok 6 dema treba buď posunúť posuvník, alebo pridať značku „prišlo neskoro“.
- **B23 – Podklad MDT:**
  - „Potvrdil lekár KOC: MUDr. Martin Svoboda · **19. 10. 2026**“, ale hlavička hovorí „údaje známe k **21. 10. 2026**“.
  - Poznámky pod čiarou nie sú v poradí čítania (…13, 14, **22**, 15 … 18, 19, **21**, 20).
  - Poznámky 6 a 13–20 nemajú citát, len správu a dátum.
- **B24 – Neoznačené simulačné detaily.** Nie sú v zdrojoch ani označené ako „ukážka/simulované“:
  - časy a kanály v Zázname o koordinovaní, napr. „5. 10. 14:20 Urgencia: kardiológia Jesenice – telefonát“, „RTG poštou (naskenované)“;
  - dátumy prijatia a kanály správ 01–06 v Dokumentoch (eZpráva, papier, prijaté 3.–6. 10.).

  Podľa pravidla „nič nevymýšľať alebo jasne označiť“ stačí jeden štítok „simulovaný priebeh“ nad záznamom a zoznamom dokumentov.
- **B25 – UI nepoužíva výstup AI.** Polia na obrazovke sú ručne pripravené v `src/data/cases.ts`. `src/ai/*`, `extracted-*.json` ani `eval-*.json` UI nečíta a veta „Na kontrolnej sade: 20/20 polí … 0 vymyslených hodnôt“ z `eval-alena.json` sa v appke nikde neukazuje. V pitchi preto netvrdiť, že obrazovka ukazuje živé AI vyťaženie. Alebo headline z evalu zobraziť (napr. pod metrikou „0 údajov bez zdroja“).
- **B26 – Duplicitná kópia.** Záver pre praktika má adresáta MUDr. Řezníčka a v päte zároveň „Kópia: MUDr. Tomáš Řezníček“.
- **B27 – Revízny lekár sa posiela automaticky** („odošle sa spolu so záverom“). `docs/IDEALNE-RIESENIE.md` §7.2 to má v stĺpci „Nerobiť“ („kanál nevieme“). CONTRACT ho povoľuje ako simulované, takže na pitchi to treba povedať nahlas.
- **B28 – Intake (strana praktika) beží v plášti koordinátorky** („Klára, koordinátorka“ vpravo hore). Môže to mýliť, kto obrazovku vidí.

## 4. Čo funguje dobre

- Fronta je zoradená len podľa termínu (dnes → zajtra → 23. 10. → 26. 10.) s poznámkou „nikdy podľa zdravotných údajov“. Filtre a hľadanie („proch“ → Procházková) fungujú.
- Klik na dlaždicu semaforu otvorí záložku Podklad, pole aj originál so žltou vetou a hláškou „Citát overený“. Čipy „správa 07/08/11“ prepínajú zdroj.
- Rozpory sú vedľa seba (A/B), každá strana má vlastný overený citát.
- Doplnenie ECOG (keď okno nájdete): pole zozelenie, 16/20, a fiktívna správa 14 je zreteľne označená „FIKTÍVNA DOPLNKOVÁ SPRÁVA PRE DEMO“.
- Posuvník: k 21. 10. váha 65 kg (15. 9.), správy 12 a 13 v „Prídu neskôr“, „13 z 15 k 21. 10.“. K 27. 10. 63 kg s vysvetlením „po konzíliu“. Záznam skryje 4 neskoršie úkony.
- Podklad MDT: 7 častí podľa `MDT_zapis`, „vynechané správy po tomto dátume: 12, 13“, chýbajúce údaje načerveno. Potvrdenie (simulácia) aj Tlačiť (`window.print`) fungujú a tlačový štýl schová lištu.
- Záver pre praktika: pôvodná otázka (citát zo 07), „Čo to znamená pre vás“, pečať podľa §55a, doručenka v troch krokoch, ZP 211 ≠ VZP. Pri Kučerovi je Odoslať správne neaktívne.
- Intake: 5 chýba / 4 na vedomie presne podľa správy 07, číslo prípadu KOC2-2026-0107, kontakt koordinátora označený „(fiktívne)“.
- Pri 1 280 px šírke nie je vodorovný scroll.

## 5. Odporúčané poradie opráv pred 13:00

1. **B1–B3** – jeden riadok v `theme.css` (`animation-fill-mode: backwards`). Odblokuje kroky 5–7.
2. **B4 + B6** – zdvihnúť `overrides/arrived/sessionLog` (+ uzavretie) do kontextu v `App.tsx` a použiť ich v `MdtDoc` (ECOG, rozpory) aj vo fronte.
3. **B5** – pri rozhodnutí rozporu nechať hodnotu poľa.
4. **B8, B10, B15** – rýchle textové alebo stavové opravy viditeľné na deme.
