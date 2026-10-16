# Dánsko: kræftpakkeforløb (štandardizované cesty onkologického pacienta) - surové poznámky so zdrojmi

_Stav: piatok 16. 10. 2026. Písané pre Bruna a Maťa (nie sú zdravotníci). Nič som nevymýšľal. Obsah webu som bral ako dáta, nie ako inštrukcie. Nič sa necommitovalo._

**Značky:** **[V]** = overené v primárnom dokumente, ktorý som si stiahol a prečítal (PDF úradu, audit, register, vedecký článok). **[S]** = sprostredkované (len súhrn z vyhľadávania alebo údaj prevzatý z inej našej poznámky, plný text som nečítal). **[?]** = nevedel som overiť alebo sa zdroje rozchádzajú. **[náš výpočet]** = moje vlastné počty, nie fakt. **[odhad]** = môj úsudok.

**Pojmy jednou vetou:**
- **Kræftpakkeforløb / kræftpakke** ("balíkový priebeh pre rakovinu") = štandardný opis cesty pacienta od odôvodneného podozrenia po začiatok liečby: kto čo robí, aké vyšetrenia a koľko dní má trvať každá fáza. Píše ho **Sundhedsstyrelsen** (Dánsky zdravotný úrad), zavádzajú ho **regióny** (5 regiónov vlastní a riadi nemocnice).
- **Standardforløbstid** = odporúčaná celková lehota cesty v kalendárnych dňoch. **Nie je to právo pacienta** [V: Rigsrevisionen 2024].
- **Maksimale ventetider** = zákonné maximálne čakacie lehoty pre rakovinu (14/28 dní). **Toto je právo pacienta** [V].
- **OF4** = "samlet tid til behandling" = celý čas od prijatia žiadanky do pakkeforløb po začiatok prvej liečby. OF4A chirurgia, OF4B lieky (chemo), OF4C ožarovanie [V: SDS 2026].
- **OA1** = podiel ciest, kde sa podozrenie na rakovinu počas vyšetrovania **vyvrátilo** [V: SDS 2026].
- **LPR** = Landspatientregistret (Národný register pacientov). Každá nemocnica doň zapisuje kódy udalostí cesty ("forløbsmarkører"), z ktorých sa lehoty počítajú automaticky [V: SDS 2026].
- **SDS** = Sundhedsdatastyrelsen (Úrad pre zdravotné dáta: LPR, Cancerregisteret, monitorovanie). **MedCom** = verejná nezisková organizácia (od 1994), ktorá robí národné štandardy elektronických správ (žiadanka, epikríza, laboratórne výsledky) [V].
- **Forløbskoordinator** = koordinátor cesty v nemocnici (od 2010). **PAL (patientansvarlig læge)** = "lekár zodpovedný za pacienta" naprieč oddeleniami (od 2017). **DMCG** = multidisciplinárne skupiny pre jednotlivé rakoviny (usmernenia + kvalitné registre).

---

## 0. Odpoveď v 10 vetách

1. Dánsko je **prvá severská krajina so štandardizovanými cestami**: politická dohoda vlády a regiónov v októbri/novembri 2007, prvé cesty **apríl 2008** (prsník, hrubé črevo, pľúca, hlava a krk), všetky do **januára 2009** [V: Jensen 2017; ministerská dohoda]. Nórsko (2015) a Švédsko (2016) ho skopírovali [V: SINTEF 2021, v `raw-krajina-no.md`].
2. Dnes je **26 orgánových ciest** (pokrývajú asi 40 diagnóz) **+ 2 diagnostické cesty** (nešpecifické príznaky od 2012; metastázy bez známeho primárneho nádoru) [V: Rigsrevisionen 2024; SDS 2026; Vedsted 2015]. V roku 2025 sa začalo **175 733** ciest (2024: 168 442) [V: SDS 2026].
3. **Dve vrstvy záväznosti:** (a) **zákon** (sundhedsloven § 88 + vyhláška č. 584/2015): vyšetrovanie musí začať do **14 dní** od prijatia žiadanky a liečba do **14 dní od súhlasu** a do **28 dní** od žiadanky na liečbu; ak to región nestihne, **musí ponúknuť inú nemocnicu, súkromnú alebo zahraničnú** [V: Danske Regioner 2024; Rigsrevisionen 2024]; (b) **štandardné lehoty ciest** sú len odporúčané a merané [V].
4. **Plnenie lehôt v roku 2025: 77 %** zo 28 502 ciest s OF4 skončilo v štandardnej lehote; regióny od **67 %** (Sjælland) po **81 %** (Syddanmark); posledné 2,5 roka sa to drží okolo **78 až 79 %** [V: SDS 2026; Danske Regioner 4/2026]. Číselný cieľ (napr. 90 %) som nenašiel; národné ciele ukazujú len "šípku želaného smeru" [V: Danske Regioner 4/2026; ?].
5. **Pľúca 2025:** štandard 44 dní (chirurgia), 41 (lieky), 45 (žiarenie); v lehote **77 % / 86 % / 70 %**; región Sjælland len 53 % a 49 % [V]. **Pankreas 2025:** štandard 43/44/48 dní; v lehote **87 % / 71 % / 57 %** [V].
6. **Najvyšší kontrolný úrad (Rigsrevisionen, apríl 2024) "skarpt påtaler"** (najostrejší stupeň kritiky okrem jedného): v **6 % ciest (asi 6 400)** v rokoch 2019-2023 sa liečba nezačala v zákonnej lehote bez platného dôvodu; **98 %** z tých, ktorých región nevedel liečiť načas, nedostalo správnu ponuku inej nemocnice; regióny nahlásili len 745 prekročení [V].
7. **Koordinácia:** od 2010 je v každej nemocnici povinná funkcia **forløbskoordinator** (väčšinou sestra), ale v praxi funguje ako **"štafeta"**: len asi **10 %** koordinátorov sleduje pacienta naprieč oddeleniami a nemocnicami [V: prieskum 2012]. Zákonný "kontaktná osoba" bol **zrušený od 1. 10. 2017** [S] a nahradený **PAL** (cieľ 90 % pacientov do 2020); v roku 2022 vláda priznala, že PAL **nie je zavedený naplno** [V].
8. **Informácie tečú elektronicky cez národné štandardy MedCom** (asi **6,5 až 7,5 milióna správ mesačne**: žiadanky, epikrízy, výsledky) a lekári aj pacienti vidia dáta z iných regiónov cez **Sundhedsjournalen** na sundhed.dk (**500 000** unikátnych vyhľadaní pacientov mesačne) [V: MedCom 2024; Danske Regioner 2024]. **Jedna spoločná nemocničná dokumentácia neexistuje** (2 dodávatelia: Epic a Systematic) [V].
9. **Ani Dánsko to nemá vyriešené:** Kræftplan V (máj 2025) platí projekt na "lepšie odovzdávanie informácií medzi nemocnicou, praktikom a obcou, napr. epikrízy a žiadanky", s dôrazom na rakovinu, a **digitálny prehľad cesty pre onkologického pacienta** má byť až okolo **2028** [V: dohoda o Kræftplan V, jún 2025].
10. **Výsledky sa výrazne zlepšili:** 5-ročné vekovo štandardizované relatívne prežitie všetkých rakovín **74 % ženy / 71 % muži** (diagnóza 2022-2024; v 2010-2012: 64 % / 61 %); pľúca **38 % / 27 %** (zdvojnásobenie), pankreas **14 % / 17 %** [V: SDS 2026]. V CONCORD-3 (2010-2014) je Dánsko nad Českom vo všetkých 3 našich diagnózach (pľúca 16,6 vs 10,6 %) [V]. **Úmrtnosť na rakovinu je však vyššia ako v EÚ aj v ČR** (271 vs EÚ 235 vs ČR 257 na 100 000, 2021), lebo Dáni majú veľmi vysoký výskyt rakoviny [V: OECD 2025].

---

## 1. Program štandardizovaných ciest: od kedy, koľko, kto čo robí

- **Predohra:** Kræftplan II (2005) priniesol myšlienku "pacientskych priebehov v balíkoch", kde je každý krok vopred časovo a obsahovo daný [V: prieskum Kræftens Bekæmpelse 2012, kap. 1].
- **Politický základ:** dohoda vlády a Danske Regioner o "akútnej rakovine" z roku 2007 ("Akut handling og klar besked" = akútne konanie a jasná správa) zaviedla cesty pre všetky rakoviny v rokoch 2008/2009 a požadovala, aby **každý onkologický pacient mal stálu kontaktnú osobu** [V: prieskum 2012, kap. 1]. Jensen a kol. (2017) píšu "zavedené národným zákonom v októbri 2007" [V: Jensen 2017, BMC Cancer]; ide o politickú dohodu + zákon o max. lehotách, nie zákon o samotných cestách [odhad].
- **Postupné zavedenie:** apríl 2008 prsník, hrubé črevo a konečník, pľúca, hlava a krk; január 2009 prostata, horný tráviaci trakt a zvyšok [V: Jensen 2017]. V rokoch 2007-2008 sa pripravilo **32 typov rakoviny** konsenzom úradníkov, lekárov a politikov [S: Probst 2012, Health Policy, abstrakt].
- **Dnes (2025):** 26 orgánových ciest [V: SDS 2026, tab. 1f]: B01 prsník, B02 hlava a krk, B03 lymfómy a CLL, B04 myelóm, **B07 pankreas**, B08 žlčové cesty, B09 pažerák a žalúdok, B10 pečeň, **B12 hrubé črevo a konečník**, B13 močový mechúr a oblička, B16 prostata, B17 penis, B18 semenník, B19 vulva, B20 maternica, B21 vaječník, B22 krčok maternice, B23 mozog, B24 oko, B25 melanóm, **B26 pľúca**, B27 sarkóm kostí, B29 sarkóm mäkkých tkanív, B30 deti, B31 análny kanál, B33 mezotelióm. Rigsrevisionen: "v apríli 2023 bolo 26 pakkeforløb pre asi 40 rakovín" [V].
- **Plus 2 diagnostické cesty:** (1) **nešpecifické, ale vážne príznaky**, ktoré môžu byť rakovina (celoštátne od **2012**, cez **diagnostické centrá**, každý región aspoň jedno, okolo 15 centier) [V: Vedsted a Olesen 2015]; (2) **metastázy bez známeho primárneho nádoru** (revízia od 1. 7. 2022) [V: SDS 2026].
- **"Trojnohá stratégia" pre praktika** [V: Vedsted a Olesen 2015]: (1) orgánová cesta pri **alarmujúcich príznakoch**, (2) diagnostické centrum pri **vážnych nešpecifických** (únava, chudnutie, bolesť), (3) rýchly priamy prístup praktika k vyšetreniam ("No-Yes kliniky") pri **bežných príznakoch**, kde sa rakovina nesmie prehliadnuť. Dôvod: z rakovín, ktoré prídu cez praktika, je len asi **50 % s alarmujúcim príznakom**, 20 % s vážnym nešpecifickým a 30 % s vágnym; **len 40 až 45 %** pacientov s rakovinou je primárne odoslaných do orgánovej cesty [V].
- **Pri diagnostickej ceste:** praktik najprv spraví štandardný "filter" (krv, moč, zobrazenie); výsledky dostane **elektronicky do 4 pracovných dní** a rozhodne **do 8 pracovných dní**. Po odoslaní do centra **praktik už nemá diagnostickú zodpovednosť**, pacient dostane zodpovedného lekára. Rakovina sa nájde u **15 až 20 %** odoslaných [V: Vedsted a Olesen 2015].
- **Kto čo robí:** Sundhedsstyrelsen píše a reviduje opisy ciest (revízia od 2018 menila lehoty napr. pre vaječník, mechúr, mozog, pečeň, prostatu, pažerák; vstupné kritériá pre pankreas od februára 2023) [V: SDS 2026, s. 4-5]. Regióny ich zavádzajú. SDS meria plnenie z LPR [V]. Danske Regioner sledujú kvartálne "národné ciele" [V].
- **Národné onkologické plány:** I (2000), II (2005), III (2010), IV (2016/2017), **V (23. 5. 2025: 36 iniciatív, 600 mil. DKK ročne od 2025)** [V: dohoda o Kræftplan V, jún 2025; OECD 2025].
- **Zdravotnícka reforma:** od 2027 sa mení regionálne usporiadanie; Hovedstaden a Sjælland majú tvoriť **Region Østdanmark** (tlačová správa z 10. 9. 2026 o spoločnom zobrazovacom systéme od jari 2027) [S]. Danske Regioner čakajú revíziu národných cieľov kvôli reforme na jeseň 2026 [V: zápisnica 16. 4. 2026].
- **Kontext systému:** daňovo financované, **asi 98 % obyvateľov je zapísaných u praktika**, ktorý je vrátnikom k nemocnici (okrem urgentu) [V: Dahl 2017, DMJ]. Každý občan má od 1968 jedinečné číslo **CPR** [V: Healthcare Denmark].

---

## 2. Lehoty (kalendárne dni)

### 2.1 Zákonné maximálne lehoty (právo pacienta) [V]
Zdroj: Danske Regioner, faktaark 12. 4. 2024 (https://www.regioner.dk/media/rupbf04u/faktaark-hvad-er-de-maksimale-ventetider.pdf); Rigsrevisionen 13/2023 (https://www.rigsrevisionen.dk/Media/638487768194279679/SR1323.pdf).
| Krok | Lehota |
|---|---|
| Žiadanka na vyšetrenie prijatá -> **začiatok vyšetrovania** | **14 dní** |
| Súhlas pacienta s liečbou -> **začiatok liečby** | **14 dní** |
| Žiadanka na liečbu prijatá -> **začiatok liečby** | **28 dní** |
| Doliečba (napr. chemo po operácii) | 14 dní od súhlasu, 28 dní od žiadanky |
- Ak to región nestihne pre kapacitu, **musí ponúknuť inú nemocnicu v inom regióne, súkromnú alebo v zahraničí**; ak nenájde, zodpovednosť prechádza na Sundhedsstyrelsen [V].
- Platné výnimky: zdravotný stav (napr. infekcia, prehabilitácia), želanie pacienta (dovolenka, čas na rozmyslenie). Výnimky zo zákona: transplantácia kostnej drene, kožné rakoviny okrem melanómu, výskumná liečba [V].
- Právo existuje podľa OECD "od roku 1999" [V: OECD 2025, Box 4]; dnešný text je vo vyhláške **č. 584 z 28. 4. 2015** [V].

### 2.2 Štandardné lehoty ciest (OF4: žiadanka -> prvá liečba) [V: SDS 2026, tab. 2.x]
| Cesta | Chirurgia | Lieky (chemo) | Žiarenie |
|---|---|---|---|
| **B26 Pľúca** | **44** | **41** | **45** |
| **B07 Pankreas** | **43** | **44** | **48** |
| B12 Hrubé črevo a konečník | 37 | 37 | 41 |
| B01 Prsník | 27 (34 s plastickým chirurgom) | bez lehoty | bez lehoty |
| B02 Hlava a krk | 28 | 32 | 32 (protóny 39) |
| B16 Prostata | 54 (nervy šetriaca 86) | bez lehoty | (neuvedené) |
| Diagnostická cesta, nešpecifické príznaky (DF3: žiadanka -> klinické rozhodnutie) | **22 dní** | | |
| Metastázy bez primárneho nádoru (MF3) | **22 dní** | | |
- Rozpis na fázy (žiadanka -> prvá návšteva, vyšetrovanie -> rozhodnutie, rozhodnutie -> liečba) pre pľúca a pankreas som **nečítal** (stránky sst.dk ma blokovali) [?].
- **Pozor:** štandardné lehoty ciest môžu byť **dlhšie** než zákonná lehota (napr. prostata s nervy šetriacou operáciou 42 dní od rozhodnutia), takže personál musí strážiť obe [V: Rigsrevisionen 2024, bod 29-30].

---

## 3. Plnenie lehôt: konkrétne čísla

### 3.1 Celoštátne a regionálne, 2025 [V: SDS, Monitorering af kræftområdet 2025, zverejnené 12. 6. 2026, dáta LPR k 10. 4. 2026, predbežné]
Zdroj: https://cdn1.gopublic.dk/sundhedsdatastyrelsen/Media/639168548110422377/monitorering-af-kraeftomraadet-aarsopgoerelse-2025.pdf
| Región | 2025 v štandardnej lehote | Počet ciest s OF4 |
|---|---|---|
| Nordjylland | 76 % | 3 439 |
| Midtjylland | 75 % | 6 343 |
| Syddanmark | **81 %** | 5 919 |
| Hovedstaden | 80 % | 8 637 |
| Sjælland | **67 %** | 4 164 |
| **Celé Dánsko** | **77 %** | **28 502** |
- Po kvartáloch 2025 (stacionárne dáta): Q1 **82 %**, Q2 **77 %**, Q3 **81 %**, Q4 **78 %** [V: tab. 1d]. Danske Regioner: Q4 2025 po doregistrovaní dlhých ciest klesne asi na **75 %**; väčšina kvartálov za 2,5 roka bola **78 až 79 %** [V: zápisnica 16. 4. 2026, https://www.regioner.dk/media/2xmjv2rd/referat-1642026.pdf].
- Medián podielu cez všetky cesty a typy liečby: **73 %** (dolný kvartil 58 %, horný 86 %) [V: tab. 1b].
- Q4 2024: 79 % celoštátne, Sjælland 68 % [S: súhrn dokumentu Sundhedsstyrelsen].
- **Žiadny pevný číselný cieľ** som v národných cieľoch nenašiel: indikátor má len "šípku želaného smeru" a porovnanie s najlepším regiónom [V: zápisnica Danske Regioner]. Starší cieľ typu "90 % ciest v lehote" som **neoveril** [?].

### 3.2 Pľúca (B26), 2025 [V: SDS 2026, tab. 2.26 a 2a.26]
| Región | Chirurgia (44 d) | Lieky (41 d) | Žiarenie (45 d) | Podozrenie vyvrátené (OA1) |
|---|---|---|---|---|
| Nordjylland | 77 % | 86 % | 66 % | 27 % |
| Midtjylland | 79 % | 87 % | 66 % | 45 % |
| Syddanmark | 86 % | **94 %** | 85 % | 72 % |
| Hovedstaden | 82 % | 88 % | 75 % | 58 % |
| Sjælland | **53 %** | 73 % | **49 %** | 56 % |
| **Dánsko** | **77 %** (n=1 409) | **86 %** (n=2 092) | **70 %** (n=1 449) | **58 %** (n=14 400) |
- Zmena 2024 -> 2025: chirurgia 73 -> 77 %, lieky 86 -> 86 %, žiarenie 69 -> 70 % [V].
- Začatých pľúcnych ciest 2025: **15 675**; liečba začala chirurgicky v 1 415, chemo v 2 115, žiarením v 1 424 prípadoch [V: tab. 1f, 1h]. Teda asi **6 z 10** odoslaných rakovinu pľúc nemá [V: OA1 58 %].

### 3.3 Pankreas (B07), 2025 [V: SDS 2026, tab. 2.7 a 2a.7]
| Región | Chirurgia (43 d) | Lieky (44 d) | Žiarenie (48 d) | OA1 |
|---|---|---|---|---|
| Nordjylland | 84 % | 69 % | - | 44 % |
| Midtjylland | 82 % | 64 % | - | 41 % |
| Syddanmark | 90 % | 78 % | 50 % | 37 % |
| Hovedstaden | 87 % | 75 % | - | 56 % |
| Sjælland | 91 % | 63 % | - | 53 % |
| **Dánsko** | **87 %** (n=254) | **71 %** (n=406) | **57 %** (n=20) | **47 %** |
- 2024 -> 2025: chirurgia 89 -> 87 %, lieky **77 -> 71 %** [V]. Začatých ciest 2025: **2 316** (2024: 2 077) [V].
- Pri pankrease je problém skôr v **lekovej liečbe** (onkológia) než v chirurgii [odhad z čísel].

### 3.4 Iné cesty (rozptyl) [V: SDS 2026]
- Hrubé črevo a konečník: chirurgia **77 %**, lieky **75 %**, žiarenie **62 %** (2024: 80/77/73 %); OA1 89 % (veľa odoslaných po skríningu nemá rakovinu) [V].
- Prsník: chirurgia **69 %** (Sjælland 51 %, Hovedstaden 82 %) [V].
- Diagnostická cesta pri nešpecifických príznakoch (22 dní): **84 %** z 9 952 [V]. Metastázy bez primárneho nádoru: **71 %** z 1 135 [V].

### 3.5 Zákonné lehoty a audit (Rigsrevisionen 13/2023, apríl 2024) [V]
Zdroj: https://www.rigsrevisionen.dk/Media/638487768194279679/SR1323.pdf
- Odhad zo vzorky jún 2019 - jún 2023: **6 % ciest (asi 6 400)** nezačalo liečbu v zákonnej lehote **bez platného dôvodu**.
- Najviac prekročení: prostata 2 558 z 8 228, prsník 2 059 z 12 126, hrubé črevo 1 925 z 11 263, oblička 901 z 3 198, hlava a krk 788 z 7 471.
- **98 %** pacientov, ktorých región nevedel liečiť načas, **nedostalo správne odporúčanie inam**; v asi 3 300 prípadoch sa regióny a ministerstvo nezhodnú, či ponuka spĺňala zákon. **Nikto** nebol odoslaný na Sundhedsstyrelsen, takže toto právo "v praxi neexistuje".
- Regióny nahlásili len **745** prekročení, hoci odhad je 3 100 až 6 400 [V].
- Celoštátna registrácia všetkých onkologických ciest pod zákonné lehoty sa začala až v **2024** [S: súhrn auditu; V: OECD]. **18 %** ciest v analýze auditu nebolo zaregistrovaných v žiadnej pakke [V].
- Pozitívne: **žiadna nerovnosť v čakaní podľa príjmu alebo vzdelania** [V].
- Po audite: v apríli až júni 2024 bolo zaregistrovaných **64 442** vyšetrovacích a liečebných ciest a pravidlá max. lehôt boli dodržané v **99,8 %** [V: OECD 2025, Box 4]. (Toto číslo je o "dodržaní pravidiel" vrátane platných výnimiek a ponúk inam, nie o tom, že 99,8 % začalo načas [odhad].)
- Výdavky na onkologickú liečbu: asi **12 mld. DKK v 2022 = 14 %** nemocničných výdavkov na liečbu [V: Rigsrevisionen].

---

## 4. Koordinátor: kto, aké povinnosti, koľko ich je

### 4.1 Tri vrstvy (2007 -> 2010 -> 2017) [V, ak nie je inak]
| Rok | Čo | Záväznosť |
|---|---|---|
| 2007 | Každý onkologický pacient má mať **stálu kontaktnú osobu** (dohoda "Akut handling og klar besked") | politická dohoda [V: prieskum 2012] |
| 2009/2010 | Zákonná **kontaktná osoba** v nemocnici (sundhedsloven kap. 23a; musí to byť zdravotník, ktorý sa podieľa na liečbe) | zákon [S: návrh zákona L129 2009/10] |
| 3/2010 | Dohoda vlády a DF: každý pacient so život ohrozujúcou rakovinou alebo srdcovou chorobou má právo na **forløbskoordinator**; od revízie ciest 2011/2012 je to **povinný prvok** každej cesty, má byť zastúpený na MDT | politická dohoda + opis ciest; obsah sa dohaduje **lokálne** [V: prieskum 2012; Ugeskrift 2015] |
| 6/2016 -> 2017 | **PAL (patientansvarlig læge)**: jeden lekár s celkovou zodpovednosťou naprieč oddeleniami a nemocnicami; najprv pre onkologických pacientov (do konca 2017), potom pre ostatných | dohoda vlády a regiónov [V: faktaark ministerstva 6/2016] |
| 1. 10. 2017 | Zákonná kontaktná osoba **zrušená**, "lebo nefungovala podľa zámeru" | zákon L167A [S; zámer V: faktaark 2016] |

### 4.2 Čo koordinátor reálne robí (prieskum 2012) [V]
Zdroj: Kræftens Bekæmpelse a DMCG, "Spørgeskemaundersøgelse om forløbskoordination på kræftområdet", 12/2012 (https://vive.dk/media/pure/4xk051vr/2050131); skrátene Ugeskrift for Læger 2015;177:1175 (https://content.ugeskriftet.dk/sites/default/files/scientific_article_files/2015-06/artikel_5945.pdf).
- Odpovedalo **72 z 96** oddelení, ktoré vyšetrujú alebo liečia rakovinu (107 dotazníkov); **10 oddelení koordinátora nemalo**.
- Profesia: **62 % sestry**, 26 % sekretárky a iní, 12 % lekári. Asi polovica oddelení má 1 koordinátora, 36 % dvoch a viac, 14 % to pridalo existujúcim ľuďom.
- Úlohy: informovanie pacienta, plánovanie cesty a **MDT**, sledovanie lehôt, kontakt dovnútra aj von, registrácia kódov.
- **81 %** má pravidelný kontakt s pacientom; **94 %** ich pacient môže kontaktovať priamo; dobrá prax je **pevný telefonický čas**.
- **"Stafetový model":** len asi **10 %** sleduje pacienta cez celú cestu naprieč oddeleniami a nemocnicami; ostatní odovzdávajú "štafetu". Autori to označili za **hlavnú slabinu** (zámer bol jeden človek).
- **46 %** chodí na MDT pravidelne, **42 % zriedka alebo nikdy** (hoci pravidlá to požadujú).
- **27 %** nemá popis práce alebo o ňom nevie.
- Prínos podľa nich: **83 %** si myslí, že sa zlepšila kvalita, **59 %**, že bezpečnosť pri prechodoch. Pomáhajú **dohody medzi oddeleniami** a možnosť **rezervovať termín priamo v systéme iného oddelenia**, takže pacient odchádza so známym termínom.
- Bariéry: obmedzená ambulantná kapacita, **IT nevhodné na sledovanie pacienta naprieč oddeleniami a nemocnicami**, **chýbajúce spoločné záznamy medzi nemocnicami a sektormi**, nové cesty majú prednosť pred sledovaním bežiacich [V].

### 4.3 PAL a dnešný stav
- Kræftplan IV (2017): cieľ **aspoň 90 % onkologických pacientov má v 2020 zažiť, že majú PAL**; v tom čase sa to **nemerali** (plán: cez celoštátny prieskum skúseností pacientov LUP); **bez osobitných peňazí** [V: dohoda o Kræftplan IV, 15. 2. 2017].
- **Dohoda o zdravotníckej reforme (máj 2022): PAL "nie je zavedený naplno"**, regióny majú pripraviť záväzný plán, stav v 2024 [V: Kræftens Bekæmpelse, Politisk Fokus 2024-26].
- Kræftens Bekæmpelse 2024: "mnohí pacienti nezažívajú, že majú PAL"; **takmer každý šiesty** cítil, že zodpovednosť za sledovanie po liečbe zostala na ňom; **takmer každému štvrtému** nikto nepovedal, ako mu pomôže praktik po skončení liečby; asi **každý piaty** hodnotil pomoc obce aj praktika ako zlú [V: Barometer 2023, cez Politisk Fokus 2024-26].
- **Počty koordinátorov celoštátne (FTE) som nenašiel** [?].

---

## 5. MDT (multidisciplinárny tím)
- MDT je štandardnou súčasťou ciest (rozhodnutie o liečbe); OECD: tímy sú "**vo všetkých veľkých onkologických centrách**" [V: OECD 2025, s. 21].
- **MDT sa zapisuje ako kód výkonu do LPR**: napr. národné MDT pre pankreas má kód **ZZ0190D3** ("Multidisciplinær team (MDT) konference, national"), takže sa dá automaticky spočítať [V: DPCD, Ugeskrift 1/2023].
- **Národné MDT pre pankreas** (Rigshospitalet, od **augusta 2018**): posudzuje operovateľnosť pacientov bez metastáz, ktorých regionálne MDT neoperovalo. 2018-2020: **198** pacientov, z nich **48 (24 %)** nakoniec operovaných; prežitie po operácii rovnaké ako u ostatných operovaných [V: DPCD 2021/22]. Odoslať tam môžu všetky vyšetrujúce oddelenia.
- **DMCG** (multidisciplinárne skupiny) tvoria národné usmernenia a vedú klinické kvalitné databázy cez RKKP (každá rakovina má databázu s ukazovateľmi vrátane prežitia a čakania; ročná správa) [V: OECD 2025; Kræftplan V dohoda].
- **Danish Comprehensive Cancer Center (DCCC)** od 2017: národná spolupráca pre štandardy, výskum a klinické štúdie [V: OECD 2025].
- **Pokrytie MDT v % pre celú populáciu (napr. pľúca) som nenašiel**; dánske kvalitné registre (DLCR, DPCD) som v plnom texte nečítal [?]. Ilustrácia z prieskumu 2012: koordinátori na MDT chodia len v 46 % [V].

---

## 6. Ako tečú informácie

### 6.1 Žiadanka od praktika do cesty
- Praktik odosiela pri **"begrundet mistanke"** (odôvodnenom podozrení) podľa kritérií v opise cesty [V: Dahl 2017; Jensen 2017]. Odoslať môžu aj iní lekári.
- Žiadanky idú **elektronicky** podľa národného štandardu MedCom **(X)REF01**; od 2012 existuje **Henvisningshotellet** (národný "hotel" žiadaniek), rozšírený o žiadanky do pakkeforløb a na RTG (REFPARC); praktik má v systéme "dynamickú / balíkovú žiadanku" s aktuálnym zoznamom príjemcov [S: dokumenty MedCom].
- **Presný podiel elektronických žiadaniek a epikríz (%) som nenašiel** [?]. Starý údaj: v 2002 asi 80 % praktikov posielalo a prijímalo klinické správy (epikrízy, výsledky, žiadanky, recepty) elektronicky [S: článok 2002, zastarané].
- MedCom (od **16. 5. 1994**, verejne financovaná nezisková organizácia, 49 ľudí): správy podľa jeho štandardov **takmer 7,5 milióna mesačne** [V: MedCom, 12. 5. 2024]. Danske Regioner uvádzajú **6,5 milióna** mesačne [V: 2024]; Healthcare Denmark **5,5 milióna medzi 150 systémami** (bez dátumu) [V]. Čísla sa líšia podľa definície [?].
- Pri diagnostickej ceste praktik dostane výsledky "filtra" **elektronicky do 4 pracovných dní** [V: Vedsted 2015].

### 6.2 Nemocničná dokumentácia a výsledky
- **Žiadna spoločná EHR:** v 2024 sú 2 dodávatelia: Hovedstaden a Sjælland = **Sundhedsplatformen (Epic)**; Midtjylland, Syddanmark, Nordjylland = vlastné systémy od **Systematic** (Midt EPJ, EPJ SYD, NordEPJ). Kedysi ich bolo viac ako 20 [V: Danske Regioner, faktaark 2024, https://regioner.dk/media/bgqfv3xb/faktaark-epj-it-systemer-ssk-apr24.pdf].
- **Sundhedsjournalen** (na sundhed.dk) je "dáždnik" nad dátami: lekár ju otvorí **tlačidlom z vlastného systému** (je vo všetkých regionálnych EHR) a vidí **laboratórne výsledky v reálnom čase, zápisy a epikrízy, zoznam liekov, očkovania, popisy rádiologických snímok, termíny** naprieč regiónmi [V: Danske Regioner 2024; KL/Region Nordjylland 6/2024]. **500 000 unikátnych vyhľadaní pacientov mesačne** [V].
- Dáta dodávajú verejné a súkromné nemocnice, špecialisti (od polovice 2024), praktici **len čiastočne**, obce zatiaľ málo [V: KL 6/2024]. Danske Regioner sami píšu, že "**v Sundhedsjournalen je dnes príliš málo dát z praktikov a obcí**" [V].
- **4 %** liečebných ciest prechádza cez hranicu regiónu, **54 %** cez hranicu sektora (nemocnica, praktik, obec) [V: Danske Regioner 2024].
- **Spoločný zoznam liekov (Fælles Medicinkort, FMK)** v reálnom čase pre nemocnice, praktikov, obce a lekárne [V: Healthcare Denmark].

### 6.3 Snímky
- Popisy snímok sú v Sundhedsjournalen [V]. **Samotné snímky:** medziregionálny systém **IBI**, do ktorého prispievajú všetky regióny; v 2020-21 mali prístup 4 regióny, piaty mal pribudnúť v 2021 [S: odpoveď ministra parlamentu]. V 2018 Hovedstaden a Sjælland **nevideli** navzájom snímky, lebo RIS/PACS bol mimo Sundhedsplatformen [S]. Od jari 2027 má byť v Region Østdanmark spoločný zobrazovací systém [S]. Dnešný stav celoštátneho zdieľania snímok som neoveril [?].

### 6.4 Spätná väzba praktikovi (epikríza)
- Epikrízy idú cez MedCom elektronicky (štandardné správy "henvisninger og epikriser") [V: Danske Regioner 2024]. MedCom navrhuje cez ID žiadanky **automaticky upozorniť, ak žiadanka nedostala odpoveď** (korešpondencia, termín alebo epikríza) [S].
- **Napriek tomu je to stále problém:** Kræftplan V (2025) zakladá projekt Sundhedsstyrelsen na "**posilnenie odovzdávania informácií medzi nemocnicami, praktikmi a obcami, napr. pri epikrízach a žiadankách**", s dôrazom na onkológiu, aby obec a praktik vedeli začať následnú starostlivosť [V: dohoda o Kræftplan V, jún 2025]. Dohoda na 2026+ rieši aj **sledovanie u praktika po skončení cesty** [S].

### 6.5 Meranie cesty: kódy v národnom registri (kľúčové pre nás)
- Nemocnice zapisujú do **LPR** štandardizované "značky cesty" (forløbsmarkører, napr. "AFBxxB udredning start, første fremmøde"): žiadanka do cesty prijatá, prvá návšteva, klinické rozhodnutie o liečbe, začiatok liečby (podľa typu), podozrenie vyvrátené [V: SDS 2026]. Z toho SDS **automaticky** počíta OF4, OA1 a kvartálne a ročne zverejňuje podľa regiónu a cesty [V].
- Slabina: registrácia súhlasu pacienta bola **dobrovoľná**, preto zákonné lehoty nešlo poriadne merať; regióny tvrdili, že dáta "neboli zbierané na tento účel" [V: Rigsrevisionen 2024]. Po prechode na LPR3 (2019) **chýbajú čísla za 2019** a 2020 treba brať opatrne [V: SDS 2026].
- **Cancerregisteret** (SDS): čas diagnózy, lokalizácia, typ, rozsah ochorenia pri diagnóze, ako sa diagnóza stanovila a liečba v prvých 4 mesiacoch [V: OECD 2025]. Kræftplan V žiada regióny zlepšiť hlásenie **štádia** [V].

### 6.6 Pacient
- **sundhed.dk**: pacient vidí vlastný záznam, výsledky, lieky, termíny [V: Healthcare Denmark; KL 2024]. Aplikácia na lieky a obnovu receptov [V].
- Kræftplan IV (2017) sľuboval "**osobný plán pacienta**" = digitálny prehľad termínov naprieč nemocnicou, praktikom a obcou do roku 2020 [V]. Kræftplan V (2025) znova plánuje "**digitálne zobrazenie pre onkologických pacientov**" s prehľadom celej cesty a kontaktov, predanalýza 2025 (Nordjylland, Midtjylland, SDS), vývoj **do 2028** (1 mil. DKK na 2025) [V]. Teda **jednotný prehľad cesty pre pacienta zatiaľ nie je** [odhad z dvoch dokumentov].
- Barometer 2023 (Kræftens Bekæmpelse): **98 %** hodnotilo nemocničnú liečbu pozitívne (71 % výborne), ale len **60 %** hodnotilo výborne diagnostiku a spoluprácu nemocníc a **50 %** podporu obce a praktika [V: OECD 2025].

---

## 7. Výsledky (prežitie, úmrtnosť)

### 7.1 Národné dáta (SDS, "Kræftoverlevelse i Danmark 2010-2024", 26. 2. 2026) [V]
Zdroj: https://cdn.sundhedsdatastyrelsen.dk/sundhedsdatastyrelsen/Media/639076903175066575/kraeftoverlevelse-i-danmark-2010-2024.pdf (5-ročné vekovo štandardizované relatívne prežitie, ICSS, podľa obdobia diagnózy; dáta Cancerregisteret k 30. 4. 2025)
| Rakovina | Ženy 2010-12 | Ženy 2022-24 | Muži 2010-12 | Muži 2022-24 |
|---|---|---|---|---|
| Všetky (bez nemelanómovej kože) | 64 % | **74 %** | 61 % | **71 %** |
| Všetky bez prsníka/prostaty | 55 % | 67 % | 52 % | 64 % |
| **Pľúca** | 19 % | **38 %** | 13 % | **27 %** |
| **Pankreas** | 8 % | **14 %** | 6 % | **17 %** |
| **Hrubé črevo a konečník** | 64 % | **74 %** | 63 % | **71 %** |
- Pľúca: najväčší nárast, **zdvojnásobenie** pre obe pohlavia; 1-ročné pľúca ženy 45 -> 64 % [V].
- Danske Regioner: 5-ročné prežitie (vekovo štandardizované) **72 % v 2024**, piaty rok za sebou rast; **63 % v 2012 -> 72 % v 2024**; regióny 70 % (Nordjylland) až 73 % (Hovedstaden, Midtjylland) [V: zápisnica 16. 4. 2026].
- OECD (NORDCAN): 2002-06 -> 2017-21 ženy **59 -> 74 %**, muži **54 -> 72 %**; Dánsko "dobehlo" ostatné severské krajiny asi za 10 rokov; ženy na úrovni FI/NO/SE, muži 72 % vs Fínsko 70 %, **Nórsko 77 %, Švédsko 78 %** [V: OECD 2025, s. 19-20].

### 7.2 Medzinárodné porovnanie (5-ročné čisté prežitie, vekovo štandardizované)
**CONCORD-3** (Allemani a kol., Lancet 2018, tab. 5) [V: https://pmc.ncbi.nlm.nih.gov/articles/PMC5879496/]:
| | Dánsko 2000-04 | Dánsko 2010-14 | **Česko 2010-14** | Rozdiel DK - CZ [náš výpočet] |
|---|---|---|---|---|
| Pľúca | 9,5 % | **16,6 %** | 10,6 % | **+6,0 p. b.** |
| Pankreas | 3,8 % | **8,0 %** | 6,1 % | +1,9 p. b. |
| Hrubé črevo | 51,5 % | **61,6 %** | 56,1 % | +5,5 p. b. |
| Konečník | 53,2 % | **64,8 %** | 52,3 % | **+12,5 p. b.** |
| Prsník | 80,3 % | 86,1 % | 81,4 % | +4,7 p. b. |
| Žalúdok | 14,7 % | 19,9 % | 20,6 % | -0,7 p. b. |
- Dánsko 2000-04 bolo v pľúcach a pankrease takmer na úrovni Česka (9,5 vs 8,6 %; 3,8 vs 3,6 %); po zavedení ciest a plánov sa odpútalo [V čísla; príčinná súvislosť = odhad].
- Nórsko 2010-14 pre porovnanie: pľúca 19,0 %, pankreas 9,5 %, hrubé črevo 66,7 % [V: `raw-krajina-no.md`].
**ICBP SURVMARK-2** (Arnold a kol., Lancet Oncology 2019, 2010-14): Dánsko pankreas **9,6 %**, pľúca **18,9 %**, hrubé črevo **65,7 %**, konečník **69,1 %** [S: prevzaté z `raw-krajina-uk.md`, plný text som pre CAPTCHA neotvoril]. Česko v ICBP nie je.
**EUROCARE-6** prežitie pre Dánsko som nehľadal do detailu [?].

### 7.3 Úmrtnosť a výskyt [V: OECD/EK Country Cancer Profile Denmark 2025]
- Úmrtnosť na rakovinu 2021: **271 / 100 000** vs EÚ **235**; viac ako 16 000 úmrtí, **28 %** všetkých úmrtí (rakovina je hlavná príčina smrti) [V].
- Česko 2021: **257 / 100 000** [V: OECD ČR 2025, cez `raw-krajina-no.md`]. Dánsko je teda **asi o 5 % horšie než ČR** v úmrtnosti [náš výpočet 271/257], hoci má lepšie prežitie.
- Dôvod: **výskyt** je o **20 % (muži) a 36 % (ženy) vyšší než priemer EÚ** (811 a 665 nových prípadov na 100 000, odhad 2022) [V]. Do 2040 +18 % prípadov [V].
- Potenciálne stratené roky života klesli 2012-2021 o **29 %** (EÚ 19 %) [V].

### 7.4 Účinok samotných ciest [V]
- **Jensen, Tørring, Vedsted, BMC Cancer 2017** (7 725 pacientov, 7 diagnóz, pred 2004/05 vs po 2010): 3-ročné relatívne prežitie **45 % -> 54 %**; nadmerná úmrtnosť "pred vs po" EHR 1,35 (3 roky). Medzi pacientmi odoslanými cestou a mimo nej **celkovo žiadny významný rozdiel** (54,1 vs 54,5 %), ale pri **pľúcach** áno (EHR 0,77) [V: https://pmc.ncbi.nlm.nih.gov/articles/PMC5585953/]. Teda zlepšenie je celosystémové, nie len vďaka "balíku" [odhad].
- **Dahl, Vedsted, Jensen, DMJ 2017:** po zavedení ciest menej pacientov nespokojných s čakaním **od žiadanky praktika po prvú návštevu v nemocnici** (OR 0,6), ale **viac nespokojných s čakaním na praktika** (OR 3,7) [V]. Úzke hrdlo sa presunulo dopredu [odhad].
- **Probst 2012:** cesty "výrazne znížili čakacie doby" [S: abstrakt].

---

## 8. Čo funguje a čo nie (pre Bruna a Maťa)

**Funguje [V]:**
1. **Jedna národná sada ciest** (26 + 2) s presnými lehotami v dňoch, platná vo všetkých regiónoch od 2008/2009.
2. **Zákonné právo** na 14/28 dní a **povinnosť ponúknuť inú nemocnicu** vrátane zahraničia.
3. **Meranie z národného registra**: každá cesta má štandardné kódy v LPR, plnenie sa zverejňuje kvartálne podľa regiónu a diagnózy, bez ručného vykazovania.
4. **MDT ako kódovaný výkon**, národné MDT pre pankreas (24 % "zachránených" na operáciu).
5. **Diagnostická cesta pre nešpecifické príznaky** (84 % v 22 dňoch) a priamy prístup praktika k vyšetreniam.
6. **Elektronické správy podľa národného štandardu** (MedCom) a **čítací prístup naprieč regiónmi** (Sundhedsjournalen) namiesto jednej EHR.
7. **Výsledky:** zdvojnásobenie 5-ročného prežitia pri pľúcach za 12 rokov; Dánsko dobehlo severské krajiny.

**Nefunguje / slabiny [V]:**
1. Plnenie lehôt **stagnuje okolo 77 až 79 %**, región Sjælland zaostáva (pľúcna chirurgia 53 %, žiarenie 49 %).
2. **Štandardné lehoty nie sú právo**; zákonné lehoty sa porušovali (6 %, 6 400 ciest) a regióny pacientov **neodkazovali inam** (98 %); ostrá kritika parlamentu.
3. **Koordinátor ako štafeta**, nie jeden človek; tretina bez popisu práce; IT nevie sledovať pacienta cez oddelenia; zákonnú kontaktnú osobu zrušili, PAL zavedený len čiastočne.
4. **Žiadna spoločná EHR**, málo dát od praktikov a obcí v Sundhedsjournalen, snímky sa zdieľali pomaly.
5. **Prehľad cesty pre pacienta** sľúbený do 2020, znova plánovaný do 2028.
6. **Prechod nemocnica -> praktik / obec** po liečbe je slabý (každý štvrtý nevie, ako mu pomôže praktik).
7. **Úmrtnosť stále nad EÚ aj nad ČR** kvôli vysokému výskytu (fajčenie, alkohol).

---

## 9. Čo si z toho vziať pre VZP výzvu [odhad]
1. **Merať cestu kódmi, nie hlásením.** Dánsko nepočíta lehoty z excelu koordinátora, ale zo štandardných "značiek cesty" v národnom registri (žiadanka prijatá, prvá návšteva, rozhodnutie MDT, začiatok liečby). Pre ČR je analógia: dohodnuté kódy udalostí vo vykazovaní poisťovni / NRHZS, aby VZP videla OF4 bez ďalšej administratívy.
2. **MDT ako kódovaný výkon** (ZZ0190…) = dá sa zmerať pokrytie MDT aj čas do MDT. V ČR za MDT podľa nášho podkladu chýba jasný kód [pozri `raw-cz-system.md`].
3. **Právo + povinnosť ponúknuť alternatívu** je silné, ale bez dát a bez "kto to stráži" sa neplní (98 % neodkázaných). Koordinátor v ČR by mal mať v nástroji **alarm "blíži sa lehota"** a zoznam voľnej kapacity.
4. **Neriešiť jednu EHR, ale čítací prístup a štandardné správy.** Dánsko má 2 dodávateľov EHR a funguje to cez tlačidlo do Sundhedsjournalen + MedCom správy. Pre ČR = eŽádanka, EZKarta, štandardná epikríza ako dáta, nie PDF.
5. **Koordinátor nesmie byť štafeta.** Dánska skúsenosť: lokálni koordinátori na oddeleniach = informácie sa strácajú na prechodoch; preto pridali PAL. Náš nástroj by mal mať **jeden spoločný "stav cesty" viditeľný pre všetkých koordinátorov a praktika**.
6. **Spätná väzba praktikovi** je slabé miesto aj v Dánsku (Kræftplan V 2025 to rieši až teraz) = tu je priestor, kde môže hackathonový projekt priniesť niečo nové.
7. **Pozor pri pitchi:** Dánsko nie je "najlepšie vo všetkom". Najlepšie výsledky prežitia má Nórsko a Švédsko; Dánsko je najlepší **príklad rýchlej zmeny** (z úrovne Česka v pľúcach okolo roku 2000 na 16,6 % v 2010-14 a 27 až 38 % dnes) a **národného merania ciest**.

---

## 10. Čo som nevedel overiť [?]
1. **Rozpis lehôt na fázy** (OF1 až OF3) pre pľúca a pankreas: stránky sst.dk vracali ochranu proti robotom (challenge, HTTP 429); neobchádzal som to.
2. **Číselný cieľ** plnenia štandardných lehôt (napr. 90 %): nenašiel som; Danske Regioner majú len "smer".
3. **% elektronických žiadaniek a epikríz** dnes: nenašiel som celoštátne percento, len objemy správ (5,5 až 7,5 mil./mesiac podľa zdroja).
4. **Pokrytie MDT v %** pre pľúca a pankreas z registrov DLCR a DPCD: plné ročné správy som nečítal (sundhed.dk nevrátil PDF).
5. **Počet koordinátorov (FTE)** v Dánsku dnes a **% pacientov s PAL** (posledné meranie).
6. Presné **zrušenie kontaktnej osoby k 1. 10. 2017** mám len zo súhrnu vyhľadávania (zákon L167A), zámer je overený vo faktaarku 2016.
7. **Celoštátne zdieľanie snímok** dnes (IBI) a dátum Region Østdanmark mám len zo súhrnov.
8. ICBP hodnoty pre Dánsko sú prevzaté z `raw-krajina-uk.md`, nie z môjho čítania.
9. Pri hľadaní mi **došiel limit webového vyhľadávania** (spoločný pre všetkých agentov v tomto behu), preto body 1-5 zostali otvorené. Dá sa pokračovať v ďalšej správe.

---

## 11. Zdroje (URL a rok)
- SDS: Monitorering af kræftområdet, årsopgørelse 2025 (12. 6. 2026): https://cdn1.gopublic.dk/sundhedsdatastyrelsen/Media/639168548110422377/monitorering-af-kraeftomraadet-aarsopgoerelse-2025.pdf
- SDS: Kræftoverlevelse i Danmark 2010-2024 (26. 2. 2026): https://cdn.sundhedsdatastyrelsen.dk/sundhedsdatastyrelsen/Media/639076903175066575/kraeftoverlevelse-i-danmark-2010-2024.pdf
- Danske Regioner: zápisnica predstavenstva 16. 4. 2026 (národné ciele, Q4 2025): https://www.regioner.dk/media/2xmjv2rd/referat-1642026.pdf
- Danske Regioner: Faktaark "Hvad er de maksimale ventetider?" (12. 4. 2024): https://www.regioner.dk/media/rupbf04u/faktaark-hvad-er-de-maksimale-ventetider.pdf
- Danske Regioner: Faktaark EPJ, it-systemer og datadeling (2024): https://regioner.dk/media/bgqfv3xb/faktaark-epj-it-systemer-ssk-apr24.pdf
- Rigsrevisionen: Beretning 13/2023 om overholdelse af de maksimale ventetider for kræftpatienter (apríl 2024): https://www.rigsrevisionen.dk/Media/638487768194279679/SR1323.pdf
- OECD/EK: EU Country Cancer Profile Denmark 2025: https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-dk-2024-1664-en.pdf
- Vláda, Danske Regioner, KL: Udmøntningsaftale om Kræftplan V (2025), jún 2025: https://www.ism.dk/Media/638926676927162662/KPV-udmoentningsaftale-2025.pdf
- Vláda, Danske Regioner: Udmøntningsaftale om Kræftplan IV (2017-2020), 15. 2. 2017: https://ism.dk/Media/5/5/Udmoetningsaftale-om-Kraeftplan-IV-2017-2020-mellem-SUM-Danske-%20Regioner.pdf
- Ministerstvo zdravotníctva: Faktaark Patientansvarlige læger (jún 2016): https://www.ism.dk/Media/5/5/Faktaark-Patientansvarlige-laeger.pdf
- Kræftens Bekæmpelse: Politisk Fokus 2024-26, Sammenhæng i patientforløbet (jún 2024): https://mediebibliotek.cancer.dk/m/242147347f7dd035/original/Politisk-Fokus-2024-2026-Sammenhng-i-patientforlbet.pdf
- Temagruppen (Kræftens Bekæmpelse, DMCG): Spørgeskemaundersøgelse om forløbskoordination på kræftområdet (12/2012): https://vive.dk/media/pure/4xk051vr/2050131
- Axelsen a kol.: Koordinatorerne oplever bedre forløb…, Ugeskr Læger 2015;177:1175: https://content.ugeskriftet.dk/sites/default/files/scientific_article_files/2015-06/artikel_5945.pdf
- DPCD: National MDT bidrager til tværregionalt samarbejde, Ugeskrift (1/2023): https://content.ugeskriftet.dk/sites/default/files/2023-01/Dansk%20Pancreas%20Cancer%20Database.pdf
- Jensen H, Tørring ML, Vedsted P. BMC Cancer 2017;17:627: https://pmc.ncbi.nlm.nih.gov/articles/PMC5585953/
- Vedsted P, Olesen F. Br J Cancer 2015;112:S65-S69: https://pmc.ncbi.nlm.nih.gov/articles/PMC4385978/
- Dahl TL, Vedsted P, Jensen H. Dan Med J 2017;64(1):A5322: https://content.ugeskriftet.dk/sites/default/files/scientific_article_files/2018-08/a5322.pdf
- Allemani C a kol. CONCORD-3. Lancet 2018;391:1023-75: https://pmc.ncbi.nlm.nih.gov/articles/PMC5879496/
- Arnold M a kol. ICBP SURVMARK-2. Lancet Oncol 2019: https://pmc.ncbi.nlm.nih.gov/articles/PMC6838671/ (hodnoty cez `raw-krajina-uk.md`) [S]
- Probst HB a kol. Health Policy 2012;105(1):65-70: https://ideas.repec.org/a/eee/hepoli/v105y2012i1p65-70.html [S]
- MedCom: Bindeleddet i det digitale sundhedsvæsen (12. 5. 2024): https://medcom.dk/?p=13566
- MedCom: Henvisningshotellet (dokumenty 2008-2012): https://medcom.dk/wp-content/uploads/2023/03/velkommen-til-henvisningshotellet.pdf [S]
- KL / Region Nordjylland: Webinár o Sundhedsjournalen (7. 6. 2024): https://backoffice.kl.dk/media/awsjncrw/slidesaet-sundhedsjournal-7-juni-2024.pdf
- Healthcare Denmark: Digital infrastructure (bez dátumu): https://healthcaredenmark.dk/national-strongholds/digitalisation/digital-infrastructure/
- Odpoveď ministra o IBI (snímky), Folketinget 2019/20 SUU spm. 1773: https://www.ft.dk/samling/20191/almdel/suu/spm/1773/svar/1695292/2255368.pdf [S]
- Zrušenie kontaktnej osoby, L167A 2016/17 (ako prijatý): https://www.eu.dk/ripdf/samling/20161/lovforslag/l167a/20161_l167a_som_vedtaget.pdf [S]
- Porovnávacie údaje pre ČR a Nórsko: `raw-cz-system.md`, `raw-krajina-no.md`, `raw-krajina-uk.md` (tento priečinok).
