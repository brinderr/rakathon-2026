# 07 · Pohľad platiteľa (stratég VZP)

_17. 10. 2026. Hraná rola, nie výrok VZP. MDT = konzílium, RL = revízny lekár poisťovne, signálny kód = riadok vo vyúčtovaní poisťovni, podľa ktorého poisťovňa vie, že sa niečo stalo. [výpočet] = naša aritmetika._

## Verdikt
Pre koordinátorku je appka dobrý nástroj, plátcovi však nič neukáže: ani o koľko dní je cesta kratšia, ani koľko konzílií sa neodložilo, ani čo z toho má poisťovňa. Presne na toto sa zadávateľ VZP pri stole spýta. Najviac za najmenej práce prinesie obrazovka „Pro plátce“ s hodinami cesty od prvého kontaktu (ten údaj dávky poisťovní nemajú) a export cez signálne kódy, ktoré VZP už sama používa.

## Top nálezy

**1. Chýba obrazovka „Pro plátce“**
- **Problém:** appka ukazuje len jednotlivých pacientov, súhrn chýba. Věstník meria KOC indikátorom „doba od prvního kontaktu do zahájení prvoliniové léčby“. Indiko.cz ho však z dávok počíta až od prvého zobrazovacieho vyšetrenia a zverejňuje najmenej s polročným oneskorením.
- **Dôkaz:**
  - screenshot 01,
  - Věstník 11/2025, čl. 8-2: https://portal.gov.cz/vestniky/pv8aaxd/1556005765.pdf
  - MZ: https://mzd.gov.cz/tiskove-centrum-mz/kdyz-data-zachranuji-zivoty-cesko-otevira-prvni-data-o-organizaci-onkologicke-pece-v-oblasti-karcinomu-plic-prsu-a-pankreatu/
  - Vitalia: https://www.vitalia.cz/clanky/rakovina-slinivky-plic-prsu-jak-cist-data-ktera-ukazuji-kvalitu-lecby/
- **Zmena:** obrazovka „Pro plátce · KOC 2 · říjen 2026“ s prepínačom „VZP 111 / všechny“.
  - **Dlaždice:**
    - nové prípady C25/C34,
    - medián dní od žiadosti po MDT,
    - % MDT s úplným podkladom,
    - počet MDT odložených pre chýbajúci podklad,
    - medián dní od MDT po doručenie záveru praktikovi,
    - dni s doloženým zásahom na prípad.
  - **Tabuľka:** T0 prvý kontakt (s citátom), T1 žiadosť do KOC, T2 MDT, T3 doručený záver, počet dní od T0, kto je na ťahu.
  - **Čo ukážu naši pacienti [výpočet]:**
    - Novák (VZP): prvý kontakt 24. 8., do KOC sa dostal po 44 dňoch, MDT 22. 10. príde po 59 dňoch. Ešte pred liečbou je teda za hranicou 8 týždňov, ktorú používa MZ (indiko by počítalo až od CT 10. 9.).
    - Alena: od 1. 9. po termín na onkológii 4. 11. ubehlo 64 dní a liečba ešte nezačala.
    - Väčšina čakania vzniká ešte pred KOC. Dávky poisťovní to nezachytia, appka áno.
  - **Pravidlo:** každá poisťovňa vidí len svojich poistencov. Alena (ZP 211) sa vo výbere VZP neukáže.
- **Dopad:** vysoký · **Práca:** 3–4 h

**2. Revízny lekár má len tri štítky**
- **Problém:** podľa slidu 11 (body 24–25) má RL dostať údaje automaticky v štruktúre a má si vedieť vyžiadať doplnenie. Zákon mu ukladá posúdiť „odůvodněnost léčebného procesu“ a skontrolovať, či vykázaná starostlivosť zodpovedá poskytnutej.
- **Dôkaz:**
  - screenshot 08,
  - `docs/matej-poziadavky-zadania.md`,
  - § 42 ods. 3 zákona 48/1997: https://www.zakonyprolidi.cz/cs/1997-48
- **Zmena:** pri Novákovi (VZP 111) pridať kartu „Pro revizního lékaře“.
  - Na karte: kód MKN-10, histológia a odporúčanie MDT, každá položka s citátom.
  - Tlačidlo „Vyžádat doplnění“ vloží úlohu do fronty koordinátorky.
  - Odporúčam to stihnúť už na sobotu, nie až na nedeľu.
- **Dopad:** vysoký · **Práca:** 1,5–2 h

**3. Záznam o koordinovaní neobstojí pri kontrole výkonu 51887**
- **Problém:** Věstník vyžaduje, aby koordinátor pracoval „na základě písemného vyžádání ošetřujících lékařů“ a každý zásah „průkazně“ zdokumentoval. Indikátor kvality počíta zásahy „dle diagnóz“. Záznam má len dátum, čas, úkon, text a áno/nie.
- **Dôkaz:**
  - `app/src/types.ts`, riadok 59,
  - screenshot 06.
- **Zmena:**
  - pridať stĺpce „vyžádal“ (správa 07, MUDr. Řezníček), „doklad“, „typ zásahu“ a „diagnóza“,
  - hlavička „9 dní s doloženým zásahem“, bez korún,
  - export do CSV.
- **Dopad:** stredný až vysoký · **Práca:** 1–1,5 h

**4. Chýba cesta dát k plátcovi**
- **Problém:** appka nevie odovzdať údaje poisťovni.
- **Dôkaz:** VZP už zaviedla signálne kódy 99893 (vykazuje KOC) a 99894 (vykazuje ROC) „za účelem kontroly delegovaného podání“.
  - Páruje ich cez rodné číslo: 233 párov sedí, 32 kódom z KOC chýba pár z ROC a 73 kódom z ROC chýba pár z KOC.
  - Zdroj: https://www.linkos.cz/files/pro_odborniky/napl_onko_prog/sled_predikce_onko/Forum/2025-04/5--Onkoforum-04_2025-VZP.pdf
- **Zmena:**
  - navrhnúť dva signálne kódy: „KOC převzal žádost“ a „závěr MDT doručen“,
  - pridať tlačidlo „Export pro pojišťovnu“, ktoré vytvorí riadky pre bežnú mesačnú dávku cez NIS alebo VZP Point: https://www.vzp.cz/poskytovatele/informace-pro-praxi/poradna/vzp-point-neslouzi-pouze-k-odesilani-davek-vykonu-a-faktur
  - Klinické texty z nemocnice neodídu a otvorené slučky VZP nájde sama, ako pri ROC.
- **Dopad:** vysoký, lebo rieši integráciu aj rozšírenie na 15 + 2 KOC · **Práca:** 2 h

**5. VZP nie je v appke nikdy „na ťahu“**
- **Problém:** poisťovňa musí zaistiť „časovou dostupnost“ starostlivosti (§ 46 ods. 1 zákona 48/1997). Nariadenie vlády 307/2012 určuje, že CT musí byť do 3 týždňov. MZ zistilo, že poisťovne sa o indikácii vyšetrenia nedozvedia, a preto nevedia, odkedy lehota beží.
- **Dôkaz:**
  - nariadenie vlády 307/2012: https://www.zakonyprolidi.cz/cs/2012-307
  - MZ: https://mzd.gov.cz/tiskove-centrum-mz/sledovani-objednacich-lhut-a-elektronicky-poukaz-umozni-lepe-zajistit-dostupnost-pece/
  - správa 07: „Termín CT se nám … nepodařilo zajistit.“
- **Zmena:**
  - pri každom kroku zobraziť zákonnú lehotu, ktorá beží od dátumu indikácie,
  - keď je lehota ohrozená, tlačidlo „Požádat pojišťovnu o zajištění termínu“.
- **Dopad:** vysoký · **Práca:** 1,5–2 h

**6. Pitch je nepresný a business case nemá čísla**
- **Problém:** veta „VZP hradí jejich výkon“ je nepresná. Výkon platí poisťovňa pacienta a Alena má ZP 211. Pilot v jednom KOC nemá s čím porovnať výsledky.
- **Dôkaz:** `docs/pitch/SUBMISSION.md`, riadok 60.
- **Zmena:**
  - opraviť na „zdravotní pojišťovny hradí“,
  - pilot rozšíriť na 2 KOC na 6 mesiacov a porovnať ho s dávkami za predchádzajúcich 12 mesiacov,
  - pridať slajd s overenými vstupmi:
    - výkon 51887 sa platí 250 Kč za uznaný výkon, najviac raz denne na pacienta: https://www.zakonyprolidi.cz/cs/2025-432
    - MZ odhaduje „nižší desítky milionů“ ročne: https://mzd.gov.cz/tiskove-centrum-mz/jeden-kontakt-mene-cekani-rychlejsi-cesta-k-lecbe-koordinatori-meni-peci-o-onkologicke-pacienty/
    - náš prepočet [výpočet]: 8 633 prípadov C25 + C33–34 (ÚZIS 2021: https://www.uzis.cz/res/f/008447/novotvary2019-2021.pdf) × 9 dní × 250 Kč ≈ 19 mil. Kč,
    - VZP má viac než 6 mil. klientov: https://www.vzp.cz/o-nas
    - 4 týždne odkladu operácie zvyšujú riziko úmrtia o 6–8 %: https://pubmed.ncbi.nlm.nih.gov/33148535/
  - **Pointa:** nežiadame nové peniaze. Úsporu zmeria pilot.
- **Dopad:** vysoký · **Práca:** 1,5 h

## Nové nápady zo sveta

1. **Dánsko**
   - **Čo robia:** nemocnice zapisujú míľniky liečby do národného registra a štát ich zverejňuje štvrťročne. Pri pankrease začala v roku 2025 chemoterapia do 44 dní u 71 % pacientov.
   - **Zdroj:** https://cdn1.gopublic.dk/sundhedsdatastyrelsen/Media/639168548110422377/monitorering-af-kraeftomraadet-aarsopgoerelse-2025.pdf
   - **V appke:** T0–T3 sú tie isté míľniky.
2. **NHS England**
   - **Čo robia:** zverejňujú čísla každý mesiac po nemocniciach. V júli 2026 začala liečba do 62 dní u 71,2 % pacientov.
   - **Zdroj:** https://www.england.nhs.uk/statistics/wp-content/uploads/sites/2/2026/09/Cancer-Waiting-Times-Statistical-Release-July-2026-Provider-based-Provisional.pdf
   - **V appke:** mesačný export z „Pro plátce“.
3. **CMS (USA)**
   - **Čo robia:** Medicare platí 110 $ mesačne na pacienta za rozšírené služby vrátane navigácie, ale iba ak zariadenie posiela report o kvalite a dáta.
   - **Zdroj:** https://www.cms.gov/priorities/innovation/innovation-models/enhancing-oncology-model
   - **V appke:** report „Pro plátce“ ako podmienka bonusu VZP za uzavretú slučku (úplný podklad + doručený záver), navyše k 51887.
4. **Zasada a kol. (2023)**
   - **Čo zistili:** 24 % prípadov na MDT sa odložilo.
   - **Zdroj:** https://pmc.ncbi.nlm.nih.gov/articles/PMC10166965/
   - **V appke:** po MDT jeden klik „rozhodnuto / odloženo – důvod“.
5. **Rocque a kol. (2017)**
   - **Čo zistili:** laickí navigátori znížili náklady Medicare o 781 $ na pacienta za štvrťrok (observačná štúdia z USA, číslo sa nedá preniesť).
   - **Zdroj:** https://pmc.ncbi.nlm.nih.gov/articles/PMC5540048
   - **V appke:** VZP dostane z pilotu pseudonymný zoznam pacientov a dopad si spočíta z vlastných dávok.

## Čo nerobiť
1. **Neuvádzať úspory v korunách z predpokladov ani americké čísla ako naše.** Analytici VZP ich rozoberú; ukázať overené vstupy a to, čo zmeria pilot.
2. **Nesľubovať VZP portál s klinickými textmi.** Na kontrolu má poisťovňa revízneho lekára (§ 42).
3. **Nerobiť rebríčky KOC.** Podľa MZ dáta indiko nie sú na porovnávanie centier.
