# 07 – Svetové trendy, štatistiky a bottlenecky v onkológii (2024–2026)

_Stav: piatok 16. 10. 2026 (popoludnie). Pre Brunu a Maťa. Písané jednoducho, odborné pojmy sú vysvetlené v zátvorke._

**Ako čítať značky pri číslach**
- **[V]** = číslo som videl priamo v abstrakte štúdie alebo v samotnom dokumente (PDF/web zdroja).
- **[S]** = číslo je zo sprostredkovaného zdroja (tlačová správa, spravodajský článok, obchodný web). Berte ako orientačné.
- **[?]** = neisté alebo som to nevedel potvrdiť.
- **[prepočet]** = moje vlastné jednoduché počty z uvedených čísel.
- **[Z12]** = číslo zdroja, URL je v časti 5 (Zdroje).

---

## 0. Rýchly prehľad (60 sekúnd)

1. **Meškanie liečby zhoršuje prežitie** (pozorovacie dáta, nie RCT). Veľký prehľad 34 štúdií (1,27 mil. pacientov): každé 4 týždne meškania zvyšuje riziko smrti približne o 6–8 % pri operácii a pri liekovej liečbe podľa typu rakoviny o 1–28 % [Z6][V]. Anglicko dnes stále nespĺňa cieľ liečby do 62 dní (71 % vs. cieľ 85 %) [Z7][V].
2. **Česko má dobrý skríning prsníka a krčka maternice, ale slabý skríning hrubého čreva** (29 % vs. 42 % EÚ) a po pozitívnom teste sa na kolonoskopiu čaká v priemere 76 dní (podľa okresu 40 až 135 dní) [Z3][V].
3. **Lekárom chýba čas, nie len ľudia:** v ambulancii 27 % času pri pacientovi a 49 % pri počítači a papieroch [Z22][V]; 71 % mladých európskych onkológov má známky vyhorenia, v strednej Európe 84 % [Z21][V].
4. **Tumor board (onkologické konzílium, tím lekárov rozhoduje o liečbe) má na prípad 2–4 minúty** a podklady sú často neúplné [Z26][S]. V Česku sa konzílium dostane len k ~60 % nových pacientov (odporúča sa ~80 %) a je podmienkou úhrady inovatívnych liekov [Z3][V].
5. **Klinické štúdie:** do štúdie sa dostane ~8 % pacientov; u viac ako polovice pacientov štúdia na ich pracovisku vôbec nie je dostupná (55,6 %) [Z27][V]. Matching (párovanie pacienta so štúdiou) cez AI má dobré dôkazy z testov [Z30][V].
6. **Pravidelné hlásenie príznakov z domu (ePRO)** zlepšuje kvalitu života a znižuje návštevy pohotovosti. Zlepšenie prežitia sa ukázalo v dvoch menších štúdiách (Basch, Denis), ale veľká americká štúdia z roku 2025 ho **nepotvrdila** (HR 0,99) [Z35][V]. Buďte pri tom poctiví.
7. **Strata informácií medzi nemocnicami = opakované vyšetrenia.** Ak sa cudzie snímky nahrali do PACS (archív snímok), opakovalo sa 11 % vyšetrení; ak neboli dostupné, 72 % [Z39][V].
8. **Peniaze idú do AI na dokumentáciu a do dát:** americký digitálny zdravotný biznis 14,2 mld. USD v 2025, 54 % do AI firiem [Z44][V]. Ambient scribe (AI, ktorá počúva návštevu a píše záznam) Abridge ocenený na 5,3 mld. USD [Z45][S]; Tempus (AI + genetické testy) ~1,27 mld. USD tržieb za 2025 [Z47][S].
9. **Kľúčový objav pre „kto by zaplatil“:** VZP od 21. 9. 2026 spustila **Program riadeného vstupu inovácií** a **onkologická tematická výzva má začať v októbri 2026**. Žiadateľ je výrobca s klinickým partnerom, vstup nezaručuje úhradu, treba merateľné výsledky [Z52][V].
10. **Najlepšie podložené oblasti:** zvyšovanie účasti na skríningu (RCT, 44 štúdií, OR 1,55) [Z11][V], AI pri čítaní mamografov (2 veľké štúdie) [Z14][Z16][V], skorá paliatívna starostlivosť (RCT) [Z38][V]. **Najslabšie podložené:** agentová AI, AI pre tumor board (zatiaľ len simulácie), LLM-personalizované správy pre skríning (zatiaľ žiadny dôkaz o skutočnej účasti) [Z24][V].

---

## 1. TOP 10 bottleneckov (s číslami a zdrojmi)

### Kontext: veľkosť problému (6 čísel)

| Číslo | Hodnota | Zdroj |
|---|---|---|
| Nové prípady rakoviny vo svete (2022) | takmer 20 mil.; úmrtia 9,7 mil.; do 2050 odhad 35 mil. nových prípadov | [Z1][V] |
| EÚ-27 (odhad 2022) | 2,74 mil. nových prípadov, ~1,3 mil. úmrtí (odhad); Eurostat/ECA uvádza „takmer 1,1 mil. úmrtí ročne“ (rozdiel = odhad vs. zaregistrované) | [Z2][S], [Z4][V] |
| Česko (odhad 2022) | >61 000 nových prípadov, 565 na 100 tis. obyvateľov (EÚ 572); do 2040 nárast o 16 % | [Z3][V] |
| Česko, prežitie | 5-ročné prežitie pri rakovine pľúc 17 % (diagnóza 2015–19); štádium I 62 %, štádium IV 6 % | [Z3][V] |
| Česko, neskoré štádium (2019) | 16 % rakovín prsníka a 48 % rakoviny hrubého čreva sa odhalí až v štádiu 3–4, aj napriek skríningu | [Z3][V] |
| Náklady | EÚ: celkový ekonomický dopad >100 mld. € ročne (EK) [Z4][V]; podrobnejšie 199 mld. € v 2018 (z toho 103 mld. € zdravotná starostlivosť, 70 mld. € stratená produktivita, 26 mld. € neformálna starostlivosť) [Z5][S]. Česko: výdavky na onkologické lieky 8,7 mld. Kč (342 mil. €) v 2021, viac než dvojnásobok oproti 2011; výdavky na onkológiu na osobu +59 % medzi 2023–2050 | [Z3][V] |

---


### B1. Čakanie: od podozrenia po diagnózu a liečbu
**Jednoducho:** Každý týždeň navyše medzi „niečo nie je v poriadku“ a „liečba začala“ stojí životy a peniaze. Pacient si dnes cestu často „zariaďuje sám“ (výrok experta na pre-hack dni, [Z56]).

- **Dôkaz škody:** Hanna et al., BMJ 2020: 34 štúdií, 17 typov liečby, 1 272 681 pacientov. Na každé 4 týždne meškania: **operácia HR 1,06–1,08** (kolektómia 1,06; operácia prsníka 1,08), **systémová liečba 1,01–1,28**, rádioliečba rakoviny hlavy a krku 1,09; významné pre 13 zo 17 indikácií [Z6][V]. (HR = pomer rizika; 1,08 znamená o 8 % vyššie riziko smrti.) Pri 8 týždňoch to vychádza cca +12–17 % pri operácii [prepočet]. Pozor: štúdie sú pozorovacie (nie randomizované), takže príčinnosť nie je dokázaná [Z6][V].
- **Anglicko (NHS) – aktuálny stav, júl 2026:** diagnóza alebo vylúčenie do 28 dní (Faster Diagnosis Standard): **79,3 %** (cieľ 80 %); začiatok liečby do 62 dní od urgentného podozrenia: **71,2 %** (cieľ 85 %, nesplnený od decembra 2015); do 31 dní od rozhodnutia o liečbe: **92,5 %** (cieľ 96 %) [Z7][V]. V júli bolo 31 519 pacientov v 62-dňovom režime, takže ~29 % (~9 100 ľudí za jediný mesiac) začalo liečbu neskôr [prepočet]. CRUK: ak by sa cieľ splnil, v auguste 2026 by bolo včas liečených ďalších ~3 700 pacientov [Z8][V]. Do 28 dní sa dozvedelo výsledok len 54,8 % ľudí, u ktorých sa rakovina potvrdila, a 79,5 % tých, kde sa vylúčila (apr–jún 2026) [Z8][V]. Národný plán pre rakovinu (Anglicko, február 2026) sľubuje splniť všetky štandardy do 2029 [Z8][V].
- **Česko:** čakacie doby sa **systematicky nesledujú** (OECD/EK 2025). Výnimka: po pozitívnom teste na skrytú krv v stolici sa na diagnostickú kolonoskopiu čakalo **v priemere 76 dní** (v niektorých okresoch 40, v iných 135 dní; podľa miesta poskytovateľa 34 až 152 dní) [Z3][V]. Pri rakovine pľúc čaká **40 % pacientov na operáciu viac ako 8 týždňov** (údaj odborníka z pre-hack dňa, neoverený verejným zdrojom) [Z56][?].
- **Čo funguje:** navigácia pacienta (koordinátor, ktorý vedie pacienta cestou). Meta-analýza programu PNRP (JNCI 2014): v prvých 90 dňoch bez efektu, v dňoch 91–365 **vyššia šanca na vyriešenie diagnózy (aHR 1,51)** a **na začiatok liečby (aHR 1,43)**, najviac tam, kde bola bežná starostlivosť najpomalšia [Z9][S].
- **Pre Rakathon:** výzvy „Cesta pacienta bez straty informácií“ (VZP), „SMART ONCO AA“ (VFN), koordinácia v ranej fáze (nápad z pre-hack dňa).

### B2. Skríning: nízka účasť a strata pacientov po pozitívnom teste
**Jednoducho:** Skríning (preventívne vyšetrenie zdravých ľudí) zachráni život len vtedy, ak naň človek príde a ak po pozitívnom výsledku nasleduje ďalší krok.

- **Cieľ EÚ:** aby do 2025 bol skríning (prsník, krčok maternice, hrubé črevo) **ponúknutý 90 % oprávnených** (ide o ponuku, nie o skutočnú účasť) [Z4][V]. Priemerná účasť na mamografii v EÚ v 2022: **56 %**; nad 75 % v Dánsku, Fínsku, Švédsku, Slovinsku; pod 40 % v Rumunsku, na Cypre, Slovensku, Maďarsku, Bulharsku, Lotyšsku a Poľsku; viac než polovica krajín zaznamenala za 10 rokov pokles [Z4][V].
- **Česko (programové dáta 2022):** prsník **60 %** (EÚ 56 %), krčok maternice **74 %** (jedna z najvyšších v EÚ), hrubé črevo **29 %** (EÚ 42 %, pod národným cieľom). Pľúcny pilot (od 2022, vek 55–74, fajčiari) „trpí nízkou účasťou“: málo aktívni praktici, málo pacientov po odoslaní, chýba kampaň [Z3][V]. Personalizované pozvánky od poisťovní od 2014 mierne zvýšili účasť, najmä u prvožiadateliek. Pilot: pri nikdy neskríningovaných ženách 50–65 rokov poslanie HPV samoodberu priamo dalo **o 8 percentuálnych bodov vyššiu odpoveď** než pozvánka (Ngo 2024) [Z3][V]. Celoštátny online objednávací systém na skríning mal byť spustený v 2025 [Z3][?].
- **Dáta zo zadania VZP (2024; od organizátora, nie verejný zdroj):** 292 176 pozvánok na mamografiu; účasť pri prvom oslovení 44,5 %, celková po adresnom pozvaní 18,9 %, pri opakovane oslovovaných len 3,2 % [Z56]. Ilustrácia: 18,9 % z 292 176 je ~55 200 žien; každý 1 percentuálny bod navyše je ~2 900 žien [prepočet].
- **Čo funguje (dôkazy):**
  - Meta-analýza 44 randomizovaných štúdií (161 141 ľudí): intervencie zvýšili účasť na mamografii **OR 1,55**; u znevýhodnených skupín **OR 1,81**; celkovo bolo najúčinnejšie vzdelávanie; u znevýhodnených skupín pripomienky, telefón a navigácia [Z11][V]. (OR = pomer šancí; 1,55 = šanca na účasť je 1,55-krát vyššia.)
  - Posielanie testu na skrytú krv v stolici poštou: **RR 2,26** (rozdiel 22 percentuálnych bodov), 73 RCT [Z12][V].
  - HPV samoodber (RCT Singapur 2026): účasť **56,6 % vs. 42,8 %** [Z13][V].
  - **Dôkaz chýba:** nič neukazuje, že LLM-generované/personalizované správy zvýšia **skutočnú účasť** (RCT o očkovaní HPV: krátkodobý záujem áno, skutočné očkovanie nie) [Z58][V]. To je príležitosť aj riziko.
- **AI pri čítaní mamografov (druhá oblasť skríningu):**
  - **MASAI** (Švédsko, RCT, >100 000 žien): záťaž čítania radiológov **−44,2 %**; záchyt **6,4 vs. 5,0 na 1000** (pomer 1,29); bez nárastu falošných poplachov [Z14][V]. Finálne výsledky (Lancet, 2026): **−12 % intervalových rakovín** (1,55 vs. 1,76 na 1000), **−27 % agresívnych podtypov** [Z15][S].
  - **PRAIM** (Nemecko, reálna prax, 463 094 žien): záchyt **6,7 vs. 5,7 na 1000 (+17,6 %)**, počet odvolaných žien nemenší [Z16][V].
  - **Cena a zmysel:** nórsky model: AI sa neoplatí pri 3 € za vyšetrenie, ak neklesnú intervalové rakoviny aspoň o 5 % [Z17][S]. Česko: pilot v pražskej Waltrovke (platí poisťovňa OZP pre svojich klientov) a randomizovaná štúdia v Olomouci (cca 8 000 žien, 2025–2028) [Z18][S].
- **Pre Rakathon:** VZP „Od pozvánky k mamografu“, AZ „Plíce včas“.

### B3. Nedostatok ľudí (rádiológovia, onkológovia, sestry)
- **Anglicko (RCR sčítanie 2023):** chýba **30 % rádiológov** (1 962 lekárov), bez zásahu 40 % do 2028; chýba 15 % klinických onkológov (185), do 2028 21 %. **97 %** vedúcich rádiológie hovorí, že nedostatok spôsobuje meškanie; dopyt po CT/MR rástol o 11 %, počet ľudí o 6 % [Z19][S]. Novší briefing pre Anglicko uvádza 17 % rádiológia a 24 % onkológia v 2025, do 2030 33 % a 41 % [Z19][?].
- **EÚ:** priemer ~127 rádiológov na milión obyvateľov, rozsah 51 (Bulharsko) až 270 (Švédsko) [Z20][S]. Pre Česko som číslo nenašiel [?].
- **Česko (OECD/EK 2025):** 1 168 aktívnych onkológov (291 rádioterapeutov, 417 klinických, 278 chirurgických); formálne „dosť“, ale **veľké regionálne rozdiely** (lekár počas špecializácie musí v priemere ~1,5 roka stráviť v komplexnom onkologickom centre a potom sa len neochotne vracia do regiónu). Veľká časť kapacity onkológov ide na **doživotné kontroly** pacientov po rakovine. **Nedostatok sestier** (v onkologických oddeleniach 1 125 sestier, málo s onkologickou špecializáciou). Nedostatok rádiologických asistentov a medicínskych fyzikov okrem Brna [Z3][V].
- **Vyhorenie:** 71 % mladých európskych onkológov (737 odpovedí, 41 krajín), **84 % v strednej Európe**, 74 % bez prístupu k podpore v nemocnici [Z21][V].
- **Pre Rakathon:** každý nástroj, ktorý šetrí čas lekára alebo sestry, má v tomto čísle hodnotu (viď B4, B5).

### B4. Papierovanie a dokumentácia
- **Čas lekára (USA, 57 lekárov, 4 odbornosti, 430 hodín):** **27,0 %** času pri pacientovi, **49,2 %** pri elektronickej karte a papierovaní; k tomu 1–2 hodiny večer doma. Na každú hodinu pri pacientovi takmer 2 hodiny papierov [Z22][V]. (Americké ambulancie, nie onkológia; vzorka bola výberová.)
- **AI zapisovateľ (ambient scribe):** randomizovaná štúdia (NEJM AI, dec. 2025, 238 lekárov, 14 odborností, 3 skupiny): Nabla skrátila čas písania záznamu o **9,5 %** (~41 sekúnd na záznam), Microsoft DAX len −1,7 % (nevýznamné); vyhorenie a pracovné zaťaženie sa zlepšili, ale vedľajšie výsledky treba potvrdiť [Z23][V]. Záver: **úspora je skôr malá**, hlavný prínos je úľava a komfort.
- **Pre onkologické konzíliá:** Annals of Oncology 2026 (12 tumor boardov): ambient AI znížila administratívny čas na pacienta oproti ručnému zápisu a zlepšila kvalitu zápisu (celkové skóre P<0,001); JCO Clin Cancer Inform 2026 (26 onkológov, simulácia): príprava súhrnu 6:55 min s LLM vs. 8:47 min bez neho, úplnosť 3,93 vs. 3,13 [Z24][V].
- **Reálne nasadenie:** NHS Anglicko očakáva od apríla 2026, že ICB a nemocnice prijmú „ambient voice technology“; regionálny rámec v Midlands (70 000 lekárov, jediný dodávateľ Heidi; v júli 2026 nasadené v prvých trustoch; nemocnica hlási „−80 % času dokumentácie“ v jednom pilote a skrátenie 6-mesačného backlogu listov na 14 dní, ide o tvrdenie nemocnice) [Z25][V].
- **Pre Rakathon:** MDT Copilot (bonus „AI zapisovateľ“), MEDDI (súhrn pre lekára).

### B5. Tumor board (MDT): málo času na prípad a neúplné podklady
**MDT** = multidisciplinárny tím (chirurg, onkológ, rádiológ, patológ…), ktorý spoločne rozhoduje o liečbe.

- **Čas na prípad:** typicky **2–4 minúty** (Cancer Research UK: pod 2 minúty; britská urologická štúdia 2,6–7,6 min; Leeds pankreas: priemer 217 s, 43 % pacientov bez interaktívnej diskusie, **65 % s neúplnými podkladmi pri odoslaní**, 47 % času ide na diktovanie záveru). Počet prípadov narástol o 23,5–38,8 % za 5 rokov; **76 %** respondentov hovorí, že sa riešia aj zbytočné prípady; odhad nákladov MDT v UK >150 mil. £ ročne [Z26][S].
- **Česko:** MDT je dostupné vo všetkých komplexných onkologických centrách (podmienka akreditácie). Použitie rastie, v 2022 **takmer 60 %** nových pacientov so solídnym nádorom v centre; Česká onkologická spoločnosť odhaduje, že by malo byť ~**80 %** [Z3][V]. **Úhrada je naviazaná na MDT**: pri pankrease, prsníku, vzácnych nádoroch, robotickej chirurgii a **všetkých inovatívnych liekoch** poisťovňa platí len po konzíliu; samotné konzílium sa platí osobitným výkonom [Z3][V].
- **Dôkazy pre AI:** len simulácie a malé štúdie (viď B4). Žiadny veľký dôkaz o lepších výsledkoch pacientov [Z24][V]. Microsoft Healthcare Agent Orchestrator (máj 2025) je zameraný práve na tumor boardy (rádiologický, patologický, stagingový, štúdiový agent); Stanford, Johns Hopkins, Mass General Brigham, UW ho skúšajú, **žiadne publikované výsledky z 2026** [Z48][S].
- **Pre Rakathon:** MDT Copilot (Asseco; hodnotenie: klinická hodnota 30 %), AI asistent MDT (FN Ostrava).

### B6. Klinické štúdie: väčšina pacientov sa do nich nedostane
- **Metaanalýza (Unger, JNCI 2019; 13 štúdií, 8 883 pacientov):** do štúdie sa dostalo **8,1 %**; v **55,6 %** prípadov štúdia na pracovisku **nebola dostupná**, **21,5 %** neboli vhodní, **14,8 %** sa nezapojili; akademické pracoviská 15,9 % vs. komunitné 7,0 %. Záver autorov: štrukturálne a klinické bariéry robia účasť nemožnou pre viac než 3 z 4 pacientov [Z27][V].
- **Česko (údaj organizátora MOÚ):** v MOÚ >140 aktívnych štúdií, v intervenčných štúdiách len ~5 % pacientov (Západ 10–15 %); manuálne hľadanie vhodnej štúdie ~45 minút, cieľ pod 30 sekúnd [Z56].
- **Štúdie sa nenaplnia:** ~12 % štúdií s výsledkami v registri ClinicalTrials.gov (všetky odbory, nie len onkológia) sa predčasne ukončí; z tých, ktoré skončili nie kvôli dátam, je **57 % pre nedostatok pacientov** [Z28][V]. NCTN (USA): 18 % fáza 2/3 štúdií zlyhalo na nábore [Z29][S].
- **AI matching (párovanie pacienta so štúdiou):** TrialGPT (Nat Commun 2024): presnosť pri kritériách **87,3 %**, nájde >90 % relevantných štúdií pri <6 % zbierky, skráti čas preverovania o **42,6 %** [Z30][V]. Lokálna úprava (JAMIA 2026, UT Health San Antonio): **81,8 %** skutočne vhodných pacientov nájdených vs. **36,4 %** pri ručnom preverovaní (len 55 pacientov) [Z30][V].
- **Peniaze:** Triomics (štruktúrovanie onkologických záznamov, matching) získal 22 mil. USD v sérii B (máj 2026); firma tvrdí +40 % zhôd a −67 % času na prehľad chorobopisu (tvrdenia firmy) [Z31][S].
- **Pre Rakathon:** AI Trial Matching (FNMH, ~90 štúdií), TriaLink (MOÚ), NÚVR Research Matchmaker.

### B7. Nežiaduce účinky a život doma (diaľkové sledovanie)
- **Basch, JCO 2016 (766 pacientov, MSK):** kvalita života sa zlepšila u **34 % vs. 18 %**; návšteva pohotovosti **34 % vs. 41 %**; na chemoterapii dlhšie **8,2 vs. 6,3 mesiaca**; 1-ročné prežitie 75 % vs. 69 % [Z32][V]. Neskoršie prežitie: medián **31,2 vs. 26,0 mesiaca** (P = 0,03) [Z33][S].
- **Denis, JNCI 2017 (rakovina pľúc, 121 pacientov):** medián prežitia **19,0 vs. 12,0 mesiaca** (HR 0,32), v lepšom stave pri relapse 75,9 % vs. 32,5 %; malá štúdia, financovaná firmou s produktom [Z34][V]. Neskoršia aktualizácia: 23,0 vs. 14,8 mesiaca (HR 0,62) [Z34][S].
- **PRO-TECT, Nature Medicine 2025 (1 191 pacientov, 52 praxí v USA):** **prežitie sa NEZLEPŠILO (HR 0,99; 0,83–1,17)**, ale čas do prvej návštevy pohotovosti bol dlhší (**HR 0,84**) a pacienti vyplnili 91,5 % týždenných dotazníkov. Dánske štúdie mali obmedzený efekt, medzi dôvodmi: chýbali **určení ľudia, ktorí na signály reagujú** (6 zo 7 štúdií ESMO ich malo, len 1 zo 4 dánskych) [Z35][V].
- **Záver pre poctivý pitch:** čo spoľahlivo funguje, je **lepší pocit, menej pohotovosti a udržanie na liečbe**. Zvýšené prežitie nemožno „sľubovať“.
- **Regulačný rámec:** ESMO ELCAP (október 2025): pacientske AI nástroje (chatboty) majú byť pod dohľadom s jasnou eskaláciou a ochranou údajov; pokrýva len asistenčnú AI s ľudským dohľadom, nie agentovú AI [Z36][S].
- **Kto platí:** Nemecko hradí cez DiGA aplikáciu pre onkologických pacientov (napr. Mika); priemerná cena v prvom roku ~**400 € na štvrťrok** (rozsah 119–743,75 €, údaj GKV z 2022); poisťovne v apríli 2026 kritizujú vysoké ceny [Z54][S]. Česko: telemedicína je legislatívne ukotvená, ale až na výnimky **nehradená** (VZP, 29. 9. 2026) [Z52][V].
- **Pre Rakathon:** Digitálny hlídač nežiaducich účinkov (FNMH), MEDDI ONCO (4-stupňová triáž).

### B8. Koniec života: nemocnice, intenzívna starostlivosť a neskorá paliatívna starostlivosť
- **7 krajín (Bekelman, JAMA 2016; pacienti >65 rokov, ktorí zomreli s rakovinou, rok 2010):** v nemocnici zomrelo **USA 22,2 %, Holandsko 29,4 %, Nemecko 38,3 %, Anglicko 41,7 %, Nórsko 44,7 %, Belgicko 51,2 %, Kanada 52,1 %**. Intenzívna starostlivosť v posledných 180 dňoch: USA 40,3 % vs. <18 % inde. Nemocničné výdavky na osobu v posledných 180 dňoch: od 9 342 USD (Anglicko) po 21 840 USD (Kanada) [Z37][V].
- **Skorá paliatívna starostlivosť funguje (Temel, NEJM 2010, 151 pacientov s rakovinou pľúc):** kvalita života **98,0 vs. 91,5**, depresia **16 % vs. 38 %**, agresívna starostlivosť na konci života **33 % vs. 54 %**, medián prežitia **11,6 vs. 8,9 mesiaca** [Z38][V].
- **Česko (OECD/EK 2025):** odhadom >80 % onkologických pacientov v terminálnej fáze dostalo paliatívnu starostlivosť v 2022 (ÚZIS); každé komplexné centrum musí mať paliatívny tím; **regionálne rozdiely v domácej paliatívnej starostlivosti sú veľké** [Z3][V]. Reprezentatívne české dáta o čerpaní starostlivosti na konci života historicky chýbali; kde umierajú pacienti všeobecne (~50 % akútna nemocnica) som našiel len v nedatovanom dokumente [?].
- **Zadanie VZP:** indikátory na úrovni populácie (intenzita protinádorovej a akútnej starostlivosti, hospitalizácie, zapojenie paliatívnej starostlivosti, čas mimo nemocnice); **nehodnotí sa jednotlivý pacient ani lekár** [Z53][V].
- **Pre Rakathon:** VZP „Kvalita péče na konci života“.

### B9. Strata informácií medzi pracoviskami a opakované vyšetrenia
- **Opakované zobrazovanie (AJR 2012, UCSF, 267 pacientov pred chemoembolizáciou pečene):** keď cudzie snímky **neboli k dispozícii**, opakovalo sa **72 %** vyšetrení; keď boli na CD/filme, ale nenahrané, **52 %**; keď sa **nahrali do PACS**, len **11 %** (porovnateľne s 13 % u vlastných snímok) [Z39][V]. Podobné: pri prevoze z pohotovosti import snímok znížil následné zobrazovanie o 17 % [S, výsledok vyhľadávania].
- **Strata nálezov:** odporúčané sledovanie náhodne nájdených pľúcnych uzlíkov sa podarilo v ~**29–50 %** prípadov (malé americké štúdie), v polovici prípadov nie včas [Z40][S].
- **Radiačná dávka (téma pre Maťa/ÚRO):** malá štúdia 54 pacientov s melanómom na imunoterapii: medián 8 CT, **64 % prekročilo kumulatívnu dávku 100 mSv**, 20 % 300 mSv [Z41][V; malá, jedno pracovisko]. Veľký register (5,6 mil. CT, 161 nemocníc): 0,3 % vyšetrení >100 mSv, **opakované zobrazovanie je hlavný dôvod** vysokých dávok [Z41][V].
- **Česko:** na pre-hack dni odznelo „stratilo sa preventívne CT na CD“; existuje viac nekompatibilných sietí na zdieľanie dokumentov (eZpráva, MEDDOX, ePACS, ClinicBox, STAPRO MISE) [Z56]. V roku 2026 VZP zadala výzvu „Cesta pacienta bez straty informácií“ (odovzdávanie medzi regionálnym pracoviskom a komplexným centrom: vytiahnuť kľúčové údaje, upozorniť na chýbajúce podklady, ukázať, kto je zodpovedný za ďalší krok) [Z53][V].
- **Pre Rakathon:** PACS Comparator Check (FNMH; snímky nebudú, kontrola dostupnosti sa musí simulovať), Cesta pacienta (VZP).

### B10. Neštruktúrované dáta a interoperabilita (zdieľanie dát)
**Jednoducho:** Najcennejšie informácie sú v **texte** (správy, nálezy). Stroje a iné nemocnice s nimi nevedia pracovať.

- **EHDS (Európsky priestor zdravotných dát, nariadenie 2025/327):** platné od **26. 3. 2025**; všeobecne sa začne uplatňovať od 26. 3. 2027, priorita (pacientsky súhrn, e-recept) do **2029**, **obrazové nálezy, laboratórne výsledky a prepúšťacie správy do 2031** [Z42][S, termíny sa líšia podľa právnych firiem; presné články treba skontrolovať]. Odborníci na pre-hack dni: roadmapa 2027–2031 a SNOMED CT všade, kde sa dá [Z56].
- **Európa:** Litva (centralizovaný systém): objem dokumentov z ~7 mil. (2017) na >100 mil. (2024), ale **výmena obrazov zostáva menej vyspelá** [Z43][V]. EÚ rámec pre rakovinu (Beating Cancer Plan): 42 akcií, 10 vlajkových, rozpočet 4 mld. € na 2021–2027, **po 2027 financovanie neisté** (ECA 2026); platforma EUCAIM zbiera obrazy pre vývoj AI (17 datasetov rakoviny prsníka) [Z4][V].
- **LLM na extrakciu údajov z textu:** presnosť u patologických a USG správ rakoviny prsníka **87,7 %** (340 pacientov) [Z57][V, jedna štúdia]; TrialGPT 87,3 % (B6). Hlavné varovanie ESMO: výstup je taký dobrý, aký úplný je vstup [Z36][S].
- **Pre Rakathon:** všetky výzvy s FHIR; cena InterSystems 1 500 €; AI na prevod voľného textu do štruktúry (z pre-hack dňa: „kľúčové je neubiť lekárov formulármi“).

### Ďalšie bottlenecky (mimo Top 10)
- **Čakanie na biomarkery/genetiku** (NGS): v USA medián 18 dní pre NGS, 10–15 dní pre jednotlivé biomarkery [S, MYLUNG; európske číslo som nenašiel] [?].
- **Regionálne rozdiely** v Česku: jeden mamograf obsluhuje od 23 000 (Královéhradecký kraj) po 80 000 ľudí (Jihočeský kraj) [Z3][V].
- **Dôvera a regulácia:** AI Act a MDR (zdravotnícka pomôcka), VZP v „hard gates“ vyžaduje GDPR, kybernetickú bezpečnosť a ľudský dohľad pri AI [Z52][V].

---

## 2. Trendy a kam idú peniaze

### 2.1 Čísla o peniazoch (USA a EÚ)
| Trend | Číslo | Zdroj / kvalita |
|---|---|---|
| Digitálne zdravie USA, financovanie 2025 | **14,2 mld. USD** (+35 % oproti 10,5 mld. v 2024), 482 obchodov; **54 % peňazí šlo AI firmám** (50 % obchodov); veľké obchody >100 mil. USD tvorili 42 % | [Z44][V] |
| Ambient scribe (AI zapisovateľ) – Abridge | séria E 300 mil. USD, ocenenie **5,3 mld. USD** (jún 2025, a16z); sekundárne odhady ~6 mld. USD v júni 2026 | [Z45][S], 2026 odhad [?] |
| Ambient scribe – Ambience | séria C 243 mil. USD, ocenenie **1,25 mld. USD** (júl 2025); >40 amerických zdravotných systémov | [Z45][S] |
| Tlak na dodávateľov | Epic spustil vlastné natívne „AI Charting“ (február 2026), založené na ambient technológii Microsoftu a v cene existujúcej licencie; analytici čakajú prehodnotenie zmlúv s Abridge, Ambience, Nabla | [Z46][S] |
| Onkologické dáta a diagnostika – Tempus | tržby 2025 **~1,27 mld. USD (+83 %)**, diagnostika ~955 mil. USD, zostávajúce zmluvné hodnoty >1,1 mld. USD, outlook 2026: 1,59 mld. USD | [Z47][S] |
| Onkologická AI pre registre/štúdie – Triomics | séria B 22 mil. USD (máj 2026), „4 z 10 najväčších amerických onkologických centier“ (tvrdenie firmy) | [Z31][S] |
| Agentová AI | Microsoft Healthcare Agent Orchestrator (máj 2025) pre tumor boardy; pilotné inštitúcie, bez výsledkov v 2026. Prieskumy: Deloitte 2026 – >80 % lídrov očakáva veľký prínos, ale len ~1/3 organizácií škáluje AI nad pilot; McKinsey – 85 % lídrov skúma/nasadilo generatívnu AI | [Z48][Z55][S] |
| Rádiologická AI | FDA zoznam: **1 451** AI zariadení do konca 2025, **~76 % rádiológia** (agregátori) | [Z49][S]; v EÚ 48 % rádiológov v prieskume ESR používa AI (ale návratnosť len 2 %) [Z50][S] |
| Verejné peniaze na AI v skríningu | UK EDITH: 11 mil. £, ~700 000 žien, 30 pracovísk (štart 2025) | [Z51][S] |

### 2.2 Čo nemocnice reálne kupujú a koľko platia (čo viem)
- **AI zapisovateľ:** odhad **~2 500 USD na lekára a rok** (Abridge), ~**600 USD mesačne** (Nuance DAX), ~119 USD mesačne (Nabla). Číslo je z jedného sprostredkovaného zdroja (Sacra), cenníky sa nezverejňujú [Z45][S][?]. Epic natívne „AI Charting“ je v cene licencie, cena sa nezverejňuje [Z46][S].
- **NHS Anglicko:** register dodávateľov ambient AI (musia mať triedu I zdravotníckej pomôcky a DTAC); regionálny rámec Midlands pre 70 000 lekárov; rámec NHS SBS **150 mil. £** (diktovanie, prepis, neskôr ambient; 10/2025–09/2027); Wales rámec 10 mil. £ [Z25][V]/[S]. Hodnota zmlúv pre jednotlivých dodávateľov nie je uvedená [?].
- **Zobrazovacia AI a onkologické testy:** nemocnice a poisťovne reálne platia za **diagnostiku a čítanie obrazov** (Tempus dokazuje trh s genetikou), ceny AI pre mamografiu nie sú verejné [?]. UK model pre cenu mamografickej AI: súčasné dvojité čítanie stojí ~9,66 £ na vyšetrenie [Z17][S].
- **Pacientske platformy (ePRO):** v Nemecku **platené poisťovňou** (DiGA), v Česku zatiaľ **bez úhrady**, ale **VZP práve otvára cestu** (viď 2.3).

### 2.3 Český „kto by zaplatil“ (dôležité pre pitch)
- **VZP – Program riadeného vstupu inovácií** (platí od **21. 9. 2026**, metodika v. 1.0): VZP „nehradí novosť, ale preukázanú alebo riadene overiteľnú hodnotu“; vstup **nezaručuje úhradu**; predmetom sú digitálne zdravotnícke technológie, softvér ako zdravotnícka pomôcka, telemedicína a AI. Žiadateľ: výrobca/dodávateľ, výskumné alebo akademické pracovisko; **poskytovatelia nemôžu žiadať priamo, ale sú kľúčovým klinickým partnerom**. Podmienky („hard gates“): regulačná spôsobilosť, klinická bezpečnosť, právna prípustnosť, GDPR, kybernetická bezpečnosť, jasná klinická zodpovednosť (pri AI ľudský dohľad), pripravenosť poskytovateľa. Trvalý príjem vyžaduje preukázateľnú úsporu aspoň 5 % priamych nákladov (analýza Budget Impact) pri zachovaní kvality [Z52][V].
- **Onkologická tematická výzva** má podľa FAQ začať **v októbri 2026** (presný dátum stránka neuvádza), potom každý štvrťrok ďalšie (kardiológia, cukrovka 2. typu, neurodegeneratívne choroby) [Z52][V]. Do 6. 10. 2026 sa zaregistrovalo 13 subjektov a boli podané dve žiadosti [Z52][V].
- **Alokácia:** v rozhovore z 29. 9. 2026 sa uvádza **300 mil. Kč na 2027** a pilot **6–24 mesiacov** [Z52][?] (na ostatných stránkach VZP to nebolo uvedené, preto neistý údaj). Ministerstvo zdravotníctva pripravuje paralelne štandardný úhradový mechanizmus [Z52][V].
- **VZP o AI:** niektoré technológie (napr. AI v rádiodiagnostike) sa v praxi používajú, ale **nemajú úhradový mechanizmus** [Z52][V]. VZP je hlavný partner Rakathonu; najlepší tím na VZP výzve môže predstaviť návrh generálnemu riaditeľovi [Z53][V].
- **Ďalšia úhrada v Česku:** konzílium (MDT) sa platí osobitne a je podmienkou úhrady inovatívnych liekov (B5) [Z3][V]. Poisťovňa už platí domácu paliatívnu starostlivosť (od 2017) a paliatívne tímy v nemocniciach (od 2023) [Z3][V].

### 2.4 Kam ide pozornosť (v jednej vete na oblasť)
1. **Ambient AI (zapisovatelia)** je najrýchlejšie sa rozširujúci kúsok, ale stáva sa komoditou (Epic natívne) a RCT ukazujú skromné úspory času.
2. **Agentová AI a „tumor board AI“** je horúca téma, zatiaľ bez publikovaných výsledkov z reálnej praxe.
3. **AI čítanie mamografov** má najlepšie dôkazy, ale ekonomika je citlivá na cenu a pokles intervalových rakovín.
4. **Párovanie pacientov so štúdiami a abstrakcia chorobopisov** priťahuje peniaze (Triomics, Tempus), kupujú ich centrá aj sponzori.
5. **ePRO platformy** majú klinické dôkazy (kvalita života, pohotovosť), platia ich poisťovne v Nemecku, v Česku sa otvára pilotná cesta.
6. **Regulácia:** ESMO ELCAP (okt. 2025), EHDS (2025–2031), AI Act; všetko tlačí na ľudský dohľad, auditovateľnosť a štandardy (FHIR, SNOMED).

---

## 3. Čo funguje (dôkazy, najmä randomizované štúdie)

| Intervencia | Dôkaz | Výsledok | Výhrady | Sila |
|---|---|---|---|---|
| Poštou poslaný test na skrytú krv (FIT) | meta-analýza 73 RCT | RR 2,26 (rozdiel 22 b. b.) [Z12][V] | USA, nie Česko; v Česku bol len pilot | silný |
| Viac-zložkové zvýšenie účasti na mamografii | meta-analýza 44 RCT, 161 141 ľudí | OR 1,55; znevýhodnení OR 1,81 [Z11][V] | rozdiely medzi typmi intervencií nie sú v abstrakte | silný |
| HPV samoodber | RCT Singapur 2026; český pilot | 56,6 % vs. 42,8 % [Z13][V]; +8 b. b. u nikdy neskríningovaných v Česku [Z3][V] | v Česku zatiaľ bez rozhodnutia o politike | stredný až silný |
| AI pri čítaní mamografov | RCT MASAI (>100 000 žien); PRAIM (463 094 žien, reálna prax) | −44 % záťaže, +29 % záchytu, −12 % intervalových rakovín [Z14][Z15]; +17,6 % záchytu [Z16] | švédsky/nemecký systém s dvojitým čítaním; ekonomika citlivá | silný |
| ePRO hlásenie príznakov | 3 RCT (Basch, Denis, PRO-TECT) | kvalita života a pohotovosť lepšie; prežitie: malé štúdie áno, PRO-TECT nie (HR 0,99) [Z32][Z34][Z35][V] | treba zamestnancov, ktorí reagujú | stredný |
| Skorá paliatívna starostlivosť | RCT NEJM 2010 | agresívna starostlivosť na konci života 33 % vs. 54 %; prežitie 11,6 vs. 8,9 mesiaca [Z38][V] | jedna štúdia, rakovina pľúc | silný (kvalita života), stredný (prežitie) |
| Navigácia pacienta | PNRP | po 90 dňoch aHR 1,51 pre diagnostiku, 1,43 pre liečbu [Z9][S] | nie je klasické RCT | stredný |
| Import cudzích snímkov do PACS | retrospektívna štúdia | opakovanie 11 % vs. 52 % vs. 72 % [Z39][V] | jedna štúdia, nie RCT | stredný |
| AI zapisovateľ | RCT NEJM AI 2025 | Nabla −9,5 % času (~41 s/záznam); DAX −1,7 % nevýznamné [Z23][V] | malá úspora; vyhorenie len „potenciálne“ | slabý až stredný |
| AI párovanie so štúdiami | hodnotenie na dátach, užívateľská štúdia | presnosť 87,3 %; −42,6 % času [Z30][V]; 81,8 % vs. 36,4 % záchytu [Z30][V] | žiadne RCT o počte zapísaných pacientov | stredný |
| AI pre tumor board | malé štúdie, simulácie | kratší čas prípravy, lepšia úplnosť [Z24][V] | žiadne výsledky pre pacienta | slabý |
| LLM personalizované správy pre skríning | RCT o úmysle (HPV očkovanie) | krátkodobo áno, **skutočná účasť nie** [Z58][V] | nie je dôkaz pre skríning | žiadny |

**Poctivé negatíva, ktoré by porota mohla vedieť:** PRO-TECT nepotvrdil prežitie [Z35][V]; AI scribe skracuje záznam len o desiatky sekúnd [Z23][V]; mamografická AI sa v Nórsku podľa modelu nemusí oplatiť pri 3 € na vyšetrenie [Z17][S]; navigácia pacienta nepomáha v prvých 90 dňoch [Z9][S].

---

## 4. Mapa: bottleneck ↔ oblasť výziev

### 4.1 Tabuľka (24 výziev Rakathonu podľa oblastí)

| Oblasť | Bottleneck | Najsilnejšie čísla | Kto platí / tlak | Výzvy (zdroj zadania: `04-slack-vyzvy-a-pravidla.md`, Z53) |
|---|---|---|---|---|
| **Skríning** | B2 | EÚ 56 %, Česko prsník 60 %, hrubé črevo 29 %; VZP 292 176 pozvánok, 18,9 % účasť; OR 1,55 | VZP a ďalšie poisťovne, ÚZIS Národné skríningové centrum | VZP „Od pozvánky k mamografu“; AZ „Plíce včas“ [?] |
| **Diagnostika / cesta pacienta** | B1, B9 | +6–8 % smrti na 4 týždne meškania; 76 dní kolonoskopia; 40 % pľúc >8 týždňov | VZP (zadanie), nemocnice, ministerstvo | VZP „Cesta pacienta bez straty informácií“; VFN „SMART ONCO AA“ [?]; FN Ostrava „Onkologický AI průvodce“ [?] |
| **Koordinácia / MDT** | B5, B4 | 2–4 min na prípad; 60 % vs. 80 % v ČR; MDT = podmienka úhrady | nemocnice, poisťovne (výkon MDT) | Asseco „MDT Copilot“; FN Ostrava „AI asistent multidisciplinárního týmu“; FN Ostrava „Chytřejší plánování stacionáře“ |
| **Klinické štúdie** | B6 | 8,1 % do štúdie, 55,6 % nedostupné; MOÚ 5 %, 45 min hľadanie | sponzori štúdií, centrá; trhový signál (Triomics, Tempus) | FNMH „AI Trial Matching“; MOÚ „TriaLink“; „NÚVR Research Matchmaker“ [?] |
| **Nežiaduce účinky / diaľkové sledovanie** | B7, B3 | QoL 34 % vs. 18 %; pohotovosť 34 % vs. 41 %; OS neistý | v ČR zatiaľ nikto (VZP pilot od 10/2026); v Nemecku DiGA | FNMH „Digitální hlídač NÚ“; „MEDDI ONCO Challenge“; Twincer (komunitný projekt) |
| **Koniec života** | B8 | 22–52 % úmrtí v nemocnici podľa krajiny; skorá paliatívna 33 % vs. 54 % | VZP (zadávateľ) | VZP „Kvalita péče na konci života“ |
| **Zobrazovanie / PACS** | B9 | 72 % vs. 11 % opakovaní; 64 % >100 mSv v malej štúdii | nemocnice a poisťovňa (úspora vyšetrení) | FNMH „PACS Comparator Check“; MOÚ „ProstaPaper“ [?]; FN Olomouc „AI Surgical Copilot“ [?] |
| **Dáta / interoperabilita** | B10 | EHDS 2027–2031; 87,7 % presnosť extrakcie | štát (EHDS), nemocnice | cena InterSystems 1 500 €; AI NOR (Ostrava) [?]; PillGaze (MOÚ) [?] |
| **Výskum / iné** | – | – | – | NÚVR Research Matchmaker [?]; Brno: „Když realita překoná prognózu“, EduAIttractive, Vzkazy pro budoucnost (komunitné/vzdelávacie, iné bottlenecky) |

Poznámka: pri výzvach s [?] zadanie zatiaľ nie je zverejnené (podľa `04-slack-vyzvy-a-pravidla.md`). Brno a Ostrava sú pre pražský tím pravdepodobne mimo hry [?].

### 4.2 Môj odhad „sila bottlenecku × dôkaz × kto platí × jednoduchosť produktu“ (nie je to rozhodnutie)

| Oblasť | Sila bottlenecku | Dôkaz, že riešenie funguje | Jasný platiaci zákazník | Jednoduchosť produktu | Poznámka |
|---|---|---|---|---|---|
| Skríning (VZP mamograf) | veľká | silný (RCT, meta-analýzy) | áno (VZP) | vysoká (skóre rizika + segmenty + správa + A/B test) | riziko: LLM personalizácia nemá dôkaz o skutočnej účasti; konkurencia už rieši predikciu |
| Cesta pacienta (VZP) | veľká | stredný (navigácia), údaje v ČR chýbajú | áno (VZP zadanie) | stredná | dáta/zadanie nezverejnené [?] |
| MDT | veľká | slabý (zatiaľ simulácie) | čiastočne (výkon MDT je platený) | stredná | explicitné váhy hodnotenia, ale konkurencia MEMOyA |
| Klinické štúdie | veľká | stredný (AI matching dobrý) | áno (sponzori, centrá) | vysoká | chýbajú pacientske dáta |
| ePRO / nežiaduce účinky | stredná až veľká | stredný, zmiešaný (OS neisté) | zatiaľ nie v ČR, pilot VZP | vysoká, veľmi demovateľné | veľa tímov podobne |
| Koniec života | stredná | silný pri paliatíve, ale výzva je analytická | VZP (zadávateľ) | stredná (dashboard) | menej „wow“, zadanie bez podkladov |
| Zobrazovanie/PACS | stredná | stredný (import znižuje opakovanie) | áno (úspora vyšetrení) | stredná | snímky nie sú v dátach; Maťo má know-how (dávky) |

**Najsilnejší prienik „veľký problém + dôkaz + platič + jednoduchosť“:** skríning (VZP), klinické štúdie, ePRO. **Dôležité pre pitch:** pri každom tvrdení o prínose uviesť číslo z tohto dokumentu a vyhnúť sa sľubom o prežití (B7).

---

## 5. Zdroje

**Kvalita:** [V] = overené v primárnom texte alebo abstrakte (Europe PMC / PDF / web dokument), [S] = sprostredkované zdroje.

| ID | Čo | URL | Kvalita |
|---|---|---|---|
| Z1 | Bray et al., Global cancer statistics 2022 (CA Cancer J Clin 2024) | https://doi.org/10.3322/caac.21834 ; zhrnutie UICC https://www.uicc.org/news/globocan-2022-latest-global-cancer-data-shows-rising-incidence-and-stark-inequities | V |
| Z2 | ECIS faktový list EÚ-27 2022 | https://ecis.jrc.ec.europa.eu/cancer-factsheets-eu-27-countries-2022 | S |
| Z3 | OECD/EK Czechia Country Cancer Profile 2025 | https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-cs-2025-1663-v2-en.pdf | V (celé PDF) |
| Z4 | Európsky dvor audítorov, Špeciálna správa 07/2026 o Europe's Beating Cancer Plan | https://www.eca.europa.eu/ECAPublications/SR-2026-07/SR-2026-07_EN.pdf | V |
| Z5 | Hofmarcher et al., The cost of cancer in Europe 2018 (Eur J Cancer 2020) | https://cancerworld.net/the-cost-of-cancer-in-europe/ | S |
| Z6 | Hanna et al., Mortality due to cancer treatment delay (BMJ 2020) | https://doi.org/10.1136/bmj.m4087 ; https://europepmc.org/article/MED/33148535 | V |
| Z7 | NHS England, Cancer Waiting Times júl 2026 | https://www.england.nhs.uk/statistics/wp-content/uploads/sites/2/2026/09/Cancer-Waiting-Times-Statistical-Release-July-2026-Provider-based-Provisional.pdf | V |
| Z8 | Cancer Research UK, Cancer waiting times (12. 10. 2026) | https://news.cancerresearchuk.org/2026/10/12/cancer-waiting-times-latest-updates-and-analysis/ | V |
| Z9 | Patient Navigation Research Program, JNCI 2014 | https://pmc.ncbi.nlm.nih.gov/articles/PMC4072900 | S |
| Z11 | Ferrari et al., meta-analýza zvyšovania účasti na mamografii (Public Health Rev 2025) | https://doi.org/10.3389/phrs.2025.1607873 | V |
| Z12 | Dougherty et al., JAMA Intern Med 2018 (CRC skríning, FIT poštou) | https://doi.org/10.1001/jamainternmed.2018.4637 | V |
| Z13 | HPV samoodber RCT Singapur (Ann Fam Med 2026) | https://doi.org/10.1370/afm.250683 | V |
| Z14 | MASAI, Lancet Digit Health 2025 | https://doi.org/10.1016/s2589-7500(24)00267-x | V |
| Z15 | MASAI finálne výsledky (Lancet 2026), Lund University | https://www.lunduniversity.lu.se/article/ai-support-breast-cancer-screening-fewer-missed-cancer-cases | S |
| Z16 | PRAIM, Nat Med 2025 | https://research.uni-luebeck.de/de/publications/nationwide-real-world-implementation-of-ai-for-cancer-detection-i/ | V |
| Z17 | Nórsko: AIMS a ekonomický model | https://www.fhi.no/en/projects/cancer/aims/ ; https://journals.sagepub.com/doi/full/10.1177/09691413251372829 ; ISPOR 2026 (cena AI v UK) https://www.ispor.org/heor-resources/presentations-database/presentation-cti/ispor-europe-2026/poster-session-3-4/cost-effectiveness-and-pricing-of-ai-technology-for-reading-mammograms-in-the-england-nhs-breast-screening-program | S |
| Z18 | Česko AI mamografia (Waltrovka, Olomouc NCT07075679) | https://www.prolekare.cz/technology-ai/czech-experience-ai-can-detect-even-very-small-breast-cancers-141973 ; https://tundraspace.com/directory/studies/nct07075679 | S |
| Z19 | RCR sčítanie 2023 (rádiológia, onkológia) | https://rcr.ac.uk/census2023 ; https://rcr.ac.uk/media/vaslin4x/rcr-workforce-censuses-2023-policy-briefing.pdf | S |
| Z20 | EÚ štandardy rádiológov (EU-REST) cez AuntMinnie | https://www.auntminnieeurope.com/medical-legal-and-practice/organized-radiology-issues/article/15828586/uk-radiologist-staffing-lags-eu-peers-rcr-census-shows | S |
| Z21 | Banerjee et al., vyhorenie mladých onkológov (Ann Oncol 2017) | https://doi.org/10.1093/annonc/mdx196 | V |
| Z22 | Sinsky et al., Allocation of physician time (Ann Intern Med 2016) | https://doi.org/10.7326/M16-0961 | V |
| Z23 | Lukac et al., Ambient AI Scribes: RCT (NEJM AI 2025) | https://doi.org/10.1056/aioa2501000 | V |
| Z24 | AI pre tumor board: Ann Oncol 2026; JCO Clin Cancer Inform 2026 | https://doi.org/10.1016/j.annonc.2026.05.709 ; https://doi.org/10.1200/cci-25-00244 | V (abstrakty) |
| Z25 | NHS: Midlands AVT rámec; register dodávateľov; SBS rámec | https://www.dgft.nhs.uk/newspost/nhs-launches-largest-ever-procurement-of-ai-clinical-documentation-covering-70000-midlands-clinicians/ ; https://www.find-tender.service.gov.uk/Notice/009501-2026 ; https://www.digitalhealth.net/?p=246591 | V / S |
| Z26 | MDT čas a záťaž (UK): urologická štúdia; prehľad; Leeds pankreas; EUSOMA 2026 | https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10705031/ ; https://pmc.ncbi.nlm.nih.gov/articles/PMC7705157 ; https://www.pancreaticcancer.org.uk/wp-content/uploads/2020/10/Improving-MDT-function-Alastair-Young.pdf ; https://doi.org/10.1016/j.breast.2025.104682 | S |
| Z27 | Unger et al., bariéry účasti v štúdiách (JNCI 2019) | https://doi.org/10.1093/jnci/djy221 | V |
| Z28 | Williams et al., Terminated trials (PLOS ONE 2015) | https://doi.org/10.1371/journal.pone.0127242 | V |
| Z29 | NCTN – štúdie s nízkym náborom (správa FDAnews) | https://www.fdanews.com/articles/174768-report-one-fifth-of-cancer-clinical-trials-fall-short-on-recruitment-goals | S |
| Z30 | TrialGPT (Nat Commun 2024); adaptácia JAMIA 2026 | https://doi.org/10.1038/s41467-024-53081-z ; https://doi.org/10.1093/jamia/ocag006 | V |
| Z31 | Triomics séria B (máj 2026) | https://www.vcaonline.com/news/2026052810/trusted-by-leading-cancer-centers-to-solve-oncology-s-information-overload-triomics-raises-22-million-to-accelerate-adoption/ | S |
| Z32 | Basch et al., JCO 2016 (RCT symptómov) | https://europepmc.org/article/MED/26644527 | V |
| Z33 | Basch et al., JAMA 2017 (prežitie) | https://doi.org/10.1001/jama.2017.7156 ; https://www.mskcc.org/news-releases/real-time-patient-reported-symptom-monitoring-demonstrates-overall-survival-benefit | S |
| Z34 | Denis et al., JNCI 2017; aktualizácia ASCO 2018 | https://doi.org/10.1093/jnci/djx029 ; https://www.onclive.com/view/web-app-boosts-survival-for-lung-cancer-patients | V / S |
| Z35 | PRO-TECT (Nat Med 2025); dánske štúdie; JAMA 2022 sekundárne výsledky | https://doi.org/10.1038/s41591-025-03507-y ; https://doi.org/10.1186/s12955-025-02417-4 ; https://ascopost.com/news/june-2022/weekly-electronic-reporting-of-symptoms-improved-outcomes-in-patients-with-advanced-cancer/ | V / S |
| Z36 | ESMO ELCAP (Ann Oncol 2025) | https://pubmed.ncbi.nlm.nih.gov/41111032/ | S |
| Z37 | Bekelman et al., JAMA 2016 (7 krajín, koniec života) | https://doi.org/10.1001/jama.2015.18603 | V |
| Z38 | Temel et al., NEJM 2010 | https://doi.org/10.1056/NEJMoa1000678 | V |
| Z39 | Import cudzích snímkov do PACS (AJR 2012) | https://doi.org/10.2214/ajr.11.6890 | V |
| Z40 | Sledovanie náhodných pľúcnych uzlíkov | https://pubmed.ncbi.nlm.nih.gov/24316231/ ; https://www.mdedge.com/jhospmed/article/194391/hospital-medicine/follow-incidental-high-risk-pulmonary-nodules-computed/page/0/2 | S |
| Z41 | Kumulatívna dávka u onkologických pacientov (QIMS 2025); register 5,6 mil. CT (BJR 2026) | https://doi.org/10.21037/qims-24-2102 ; https://doi.org/10.1093/bjr/tqag115 | V (abstrakty) |
| Z42 | EHDS nariadenie 2025/327 – termíny | https://www.noze.it/en/insights/ehds-regulation-2025-327/ ; https://healthcarelifesciences.bakermckenzie.com/?p=967 | S |
| Z43 | Litva, národný zdravotný IT systém (JMIR 2026) | https://doi.org/10.2196/91911 | V (abstrakt) |
| Z44 | Rock Health, 2025 year-end digital health funding | https://rockhealth.com/insights/2025-year-end-digital-health-funding-overview-a-tale-of-two-markets/ | V |
| Z45 | Abridge, Ambience – financovanie a ceny | https://sacra.com/c/abridge/ ; https://www.beckershospitalreview.com/healthcare-information-technology/ai/ambience-healthcare-reaches-1-25b-valuation/ | S |
| Z46 | Epic natívne AI Charting | https://hlth.com/insights/news/epic-releases-native-ai-charting-for-integrated-clinical-documentation-2026-02-06 ; https://www.digitalhealth.net/2025/08/epic-announces-the-launch-of-native-ai-charting-tool/ | S |
| Z47 | Tempus – výsledky 2025 | https://www.tempus.com/news/pr/tempus-reports-fourth-quarter-and-full-year-2025-results/ | S |
| Z48 | Microsoft Healthcare Agent Orchestrator | https://www.fiercehealthcare.com/ai-and-machine-learning/microsoft-rolls-out-agentic-ai-orchestrator-begins-cancer-care | S |
| Z49 | FDA zoznam AI zariadení; agregátor | https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-enabled-medical-devices ; https://intuitionlabs.ai/articles/fda-ai-medical-device-tracker | S |
| Z50 | EuroAIM/EuSoMII prieskum ESR 2024 | https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11458846/ | S |
| Z51 | UK EDITH štúdia | https://www.clinicaltrialsarena.com/analyst-comment/uk-trial-ai-breast-cancer-screening/ | S |
| Z52 | VZP – Program riadeného vstupu inovácií; rozhovor 29. 9. 2026; článok 6. 10. 2026 | https://inovace.vzp.cz ; https://www.vzp.cz/o-nas/aktuality/vzp-meni-pristup-k-inovacim-prvni-zadosti-uz-jsou-na-stole ; https://www.vzp.cz/o-nas/aktuality/hlavinka-digitalni-technologie-uz-pouzivame-je-na-case-naucit-se-hodnotit-jejich-prinos | V (okrem 300 mil. Kč [?]) |
| Z53 | VZP – hlavný partner Rakathonu, 3 výzvy | https://www.vzp.cz/o-nas/aktuality/vzp-se-stava-hlavnim-partnerem-rakathonu-soutezicim-otevre-tri-realne-vyzvy-ceskeho-zdravotnictvi | V |
| Z54 | Nemecko DiGA, ceny a kritika poisťovní | https://www.gkv-spitzenverband.de/gkv_spitzenverband/presse/pressemitteilungen_und_statements/pressemitteilung_2239872.jsp ; https://www.pharmazeutische-zeitung.de/kassen-kritisieren-hohe-preise-bei-gesundheits-apps-131597/ | S |
| Z55 | McKinsey (generatívna AI v zdravotníctve), Deloitte 2026 | https://www.mckinsey.com/industries/healthcare/our-insights/generative-ai-in-healthcare-adoption-trends-and-whats-next ; https://www.theconsultingreport.com/deloitte-forecasts-strategic-shifts-in-2026-u-s-health-care/ | S |
| Z56 | Interné materiály tímu: výroky z pre-hack dňa a zadania výziev (organizátori) | `docs/research/02-prehack-prednasky.md`, `docs/research/04-slack-vyzvy-a-pravidla.md` | údaje od organizátorov, nie verejné zdroje |
| Z57 | Extrakcia údajov z patologických a USG správ rakoviny prsníka pomocou LLM (Radiat Oncol J 2023) | https://doi.org/10.3857/roj.2023.00633 | V (abstrakt) |
| Z58 | LLM chatbot vs. materiály, úmysel očkovania HPV (JAMA Netw Open 2026) | https://doi.org/10.1001/jamanetworkopen.2026.16822 | V (abstrakt) |

### Čo som nevedel overiť alebo je neisté [?]
- **300 mil. Kč na 2027 a dĺžka pilotu 6–24 mesiacov** pri VZP inováciách: uvádza len rozhovor z 29. 9. 2026; na inovace.vzp.cz ani v článku z 6. 10. sa to nenašlo. Pred použitím v pitchi **overiť** na inovace.vzp.cz.
- **Presný dátum onkologickej výzvy VZP:** stránka hovorí „od októbra 2026“. Overiť.
- **Počet rádiológov v Česku** a **čakacie doby na popis snímok v ČR**: verejné číslo som nenašiel.
- **Ceny AI zapisovateľov** (2 500 USD/rok Abridge atď.): jeden sprostredkovaný zdroj; cenníky nie sú verejné.
- **Aktuálne ocenenie Abridge** (6 mld. USD v 2026): sekundárny odhad, nepotvrdené.
- **Basch 2017 (medián 31,2 vs. 26,0 mesiaca):** číslo je z tlačovej správy MSK a spravodajstva; abstrakt listu v databáze chýba. Basch 2016 (JCO) je overený.
- **Termíny EHDS** sa v právnych komentároch mierne líšia; presné články nariadenia 2025/327 treba skontrolovať.
- **40 % pľúcnych pacientov čaká >8 týždňov** (z pre-hack dňa): verejný zdroj som nenašiel.
- **Olomoucká AI mamografická štúdia, pilot Waltrovka:** len sprostredkované správy.
- Čísla o pomere úmrtí v nemocnici v ČR pre onkologických pacientov (VZP zadanie): verejné čísla nie sú; to je presne to, čo má výzva VZP „Koniec života“ vytvoriť.
