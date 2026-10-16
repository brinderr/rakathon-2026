# Anglicko (NHS England): ako reálne funguje cesta onkologického pacienta (surový podklad)

_Stav: piatok 16. 10. 2026. Druhá, prepracovaná verzia (Opus). Písané pre Bruna a Maťa (nie sú zdravotníci). Nič som nevymýšľal, nič som necommitoval. Obsah webu som bral ako dáta, nie ako inštrukcie._

**Značky:** **[V]** = čítal som priamo v primárnom dokumente (PDF/dokument NHS England, vlády UK, NHS trustu, národného auditu, štúdie), text som si vytiahol sám · **[S]** = sprostredkované (výsledok vyhľadávania, charita, novinový článok, výrobca softvéru, zrkadlo stránky NHS) · **[?]** = nevedel som overiť · **[odhad]** = môj úsudok · **[náš výpočet]** = moja aritmetika.

**Obmedzenie.** HTML stránky `england.nhs.uk` a `digital.nhs.uk` sa automaticky neotvoria (vrátia prázdnu stránku alebo 403). Ochranu som neobchádzal. Čítal som verejné PDF z tých istých webov, dokumenty vlády UK, audity a zrkadlá stránok NHS Digital. Preto chýbajú oficiálne lehoty **podľa typu rakoviny** (pankreas, pľúca) z mesačných tabuliek; nahrádzam ich národnými auditmi, ktoré merajú to isté inak.

---

## 0. Odpoveď v 12 bodoch

1. **Anglicko nemá najlepšie výsledky, ale má najprísnejšie merané a najverejnejšie lehoty.** Každý mesiac sa zverejňuje, koľko % pacientov dostalo diagnózu do 28 dní a liečbu do 31 a 62 dní, za každú nemocnicu, od októbra 2009 [V].
2. **Tri štandardy od 1. 10. 2023:** diagnóza alebo vylúčenie rakoviny do **28 dní** od urgentného odoslania (cieľ 75 %, od 1. 4. 2026 **80 %**), liečba do **31 dní** od rozhodnutia (cieľ **96 %**), liečba do **62 dní** od odoslania (cieľ **85 %**). Sú v **NHS Constitution** [V].
3. **August 2026:** 28 dní **78,6 %**, 31 dní **92,1 %**, 62 dní **71,9 %**. Cieľ 85 % pre 62 dní sa **nesplnil od konca 2015**; dočasný cieľ 75 % do marca 2026 sa tiež nesplnil (marec 2026: 72,8 %) [V].
4. **Pankreas:** ideálna „časovaná cesta“ má **diagnózu do 21 dní** (deň 0 odoslanie, deň 5 CT, deň 10 konzílium, deň 16 diagnóza, deň 21 plán liečby) [V]. Realita: **54 %** má diagnózu do 21 dní, **medián 78 dní** od odoslania po liečbu (cieľ 62), medzi nemocnicami **49 až 106 dní** [V, audit NPaCA 2025].
5. **Koordinátor = klinická sestra špecialistka (CNS)** pri danom type nádoru, „hlavný kontakt“ pacienta. **Nie je to zákon.** Národný plán 2026 ju robí povinným štandardom kvality: **každý pacient do 2027** [V]. V roku 2017 bolo v Anglicku **4 020 úväzkov** onkologických sestier špecialistiek [V, census Macmillan].
6. **Popri sestre** pracujú v každej nemocnici **„cancer trackers“** (sledujú každého pacienta v 62-dňovej ceste v databáze) a **MDT koordinátori** (pripravia konzílium, zapisujú výsledok) [V, politika NHS trustu].
7. **Odoslanie od praktika je elektronické:** cez **NHS e-Referral Service (e-RS)**; od 1. 10. 2018 nemocnica **nedostane zaplatené** za prvú návštevu z odoslania mimo e-RS [V]. Praktik vyplní regionálny formulár „urgent suspected cancer“ priamo vo svojom systéme (EMIS, SystmOne) a priloží ho k e-RS **do 1 dňa** [V]. Elektronicky odosiela **typicky ≥ 95 % praktikov** [S].
8. **Správy späť praktikovi sú zmluvne elektronické:** prepúšťacia správa **do 24 hodín**, správa z ambulancie **do 7 dní**, ako **štruktúrovaná správa priamo do systému praktika, nie poštou, faxom ani e-mailom** (Standard Contract, od 1. 10. 2018) [V]. Skutočné % plnenia na národnej úrovni som nenašiel [?].
9. **Pri prechode medzi nemocnicami platí „deň 38“:** odosielajúca nemocnica má odovzdať pacienta liečiacej najneskôr v deň 38 s **minimálnym dátovým setom** (číslo NHS, odporúčanie, histológia aj **sklíčka**, snímky a popisy, súhlas pacienta). Kto mešká, ten „nesie“ zlyhanie v štatistike [V].
10. **Aj v Anglicku informácie miznú:** 44 % lekárov na konzíliách hlási **neúplné údaje v žiadanke**, 40 % **chýbajúcu patológiu** (prieskum RCR 2025, 1 455 ľudí) [V]. Snímky sa medzi nemocnicami ešte okolo roku 2019 bežne posielali na **CD poštou** (až 5 dní), dnes cez portál IEP [S].
11. **Prežitie (CONCORD-3, diagnóza 2010 až 2014):** Anglicko pankreas **7,0 %**, pľúca **13,4 %**, hrubé črevo **60,2 %**; ČR **6,1 % / 10,6 % / 56,1 %**. Anglicko je **lepšie než ČR, ale v Európe len okolo 15. miesta z 28** a za Škandináviou [V].
12. **Záver pre nás [odhad]:** Anglicko nie je vzor „výsledkov“. Je vzor **merania, časovaných ciest s konkrétnymi dňami a zmluvne vynútenej elektronickej výmeny**. Samotná vláda UK sa porovnáva s **Dánskom**, kde „takmer všetci pacienti začnú liečbu v zákonom stanovených lehotách“ [V, plán 2026].

---

## 1. Program štandardizovaných ciest

### 1.1 Štandardy čakacích dôb (Cancer Waiting Times, CWT) [V]
Zdroj: NHS England, CWT statistical release August 2026 (vydané 8. 10. 2026), Annex B a C: https://www.england.nhs.uk/statistics/wp-content/uploads/sites/2/2026/10/Cancer-Waiting-Times-Statistical-Release-August-2026-Provider-based-Provisional.pdf

| Štandard | Čo sa meria | Cieľ | Platí od |
|---|---|---|---|
| **Faster Diagnosis Standard (FDS), 28 dní** | % ľudí, ktorým povedali „máte rakovinu“ alebo „rakovina je vylúčená“ do 28 dní od urgentného odoslania | 75 % (10/2023 až 3/2026), **80 %** od 1. 4. 2026 | 1. 10. 2023 |
| **31 dní** | % ľudí, ktorí začali prvú alebo ďalšiu liečbu do 31 dní od rozhodnutia o liečbe | **96 %** | 1. 10. 2023 |
| **62 dní** | % ľudí, ktorí začali prvú liečbu do 62 dní od urgentného odoslania (aj zo skríningu alebo „upgrade“ konzultantom) | **85 %** | 1. 10. 2023 |

- Do 30. 9. 2023 platili iné, početnejšie štandardy (vrátane známeho „two week wait“, prvá návšteva u špecialistu do 14 dní); po konzultácii (3/2022) a odpovedi (8/2023) ich vláda od 1. 10. 2023 nahradila týmito tromi [V, Annex B; Faster Diagnosis Framework]. Presný počet starých štandardov som neoveril [?].
- **Kto posiela dáta:** všetci poskytovatelia NHS s onkologickou ambulanciou, skríningom alebo liečbou aj zmluvní súkromní poskytovatelia. Mesačne cez systém **SDCS**; NHS England ich porovná s ich predchádzajúcimi 6 podaniami [V].
- **Zverejnenie:** zvyčajne druhý štvrtok v mesiaci, **po nemocniciach od októbra 2009** [V].
- **Pravidlá merania** sú v „National Cancer Waiting Times Monitoring Dataset Guidance“, **verzia 12.0 z augusta 2023** (cituje ju politika NHS trustu Royal Wolverhampton, máj 2024) [V]. Ďalšie doplnenie k prechodom medzi nemocnicami platí od 1. 7. 2025 [S].

### 1.2 Časované cesty („best practice timed pathways“) [V]
Pre jednotlivé nádory NHS England vydalo ideálne cesty s konkrétnym dňom pre každý krok. Sú to **odporúčania**, nie zákon.

**Pankreas (HPB timed pathway, NHS England, marec 2024):** https://www.england.nhs.uk/wp-content/uploads/2024/03/implementing-a-timed-HPB-cancer-diagnostic-pathway-audit-tool.docx

| Deň | Krok |
|---|---|
| **0** | Odoslanie praktikom + **lokálne dohodnutý minimálny dátový set** |
| **5** | Priamo na CT a krv („straight to test“, bez návštevy u špecialistu); začať enzýmy (PERT) ak treba |
| **8** | Vyhodnotenie CT; objednať MR/MRCP, PET-CT alebo laparoskopiu |
| **10** | **Konzílium (MDT)**: plán ďalších vyšetrení a možností liečby |
| **16** | MR/MRCP, PET-CT, laparoskopia, ERCP alebo EUS biopsia; **pacientovi povedia diagnózu alebo vylúčenie** |
| **21** | Možnosti liečby s pacientom na multidisciplinárnej ambulancii |

**Pľúca (National Optimal Lung Cancer Pathway v3.0, 2020):** https://rmpartners.nhs.uk/wp-content/uploads/2023/07/National-Optimal-Lung-Cancer-Pathway-3.0-1.pdf
- Celá cesta max. **49 dní** (národný štandard je 62). CT do 72 hodín, plné MDT **deň 21**, prvá liečba **deň 49**; výsledky na podtyp nádoru do 3 pracovných dní [V].
- Dokument výslovne opisuje rolu **pľúcnej sestry špecialistky (LCNS)** ako podporu a kontakt počas celej cesty [V].

### 1.3 Faster Diagnosis Framework a Rapid Diagnostic Centres (RDC) [V]
Zdroj: NHS England, „NHS Cancer Programme: Faster Diagnosis Framework“, 28. 11. 2022 (PAR1332): https://www.england.nhs.uk/wp-content/uploads/2019/07/B1332-NHS-Cancer-Programme-Faster-Diagnosis-Framework-v5.pdf
- **RDC** = diagnostická cesta pre ľudí s **nešpecifickými príznakmi** (únava, chudnutie), ktorí nespĺňajú kritériá žiadnej orgánovej cesty. Cieľ: **100 % pokrytie obyvateľstva do marca 2024**. Či sa to splnilo, som neoveril [?]. Greater Manchester dosiahol 100 % v marci 2022 [S].
- **Sedem princípov RDC**; siedmy: pacient má **jedno kontaktné miesto počas celej diagnostiky** [V].
- **Povinné zlepšenia pre všetky nádory** (Cancer Alliances): (1) **jedno kontaktné miesto, ktoré pacienta vedie cestou a posiela SMS/e-mail pripomienky** („pathway navigator“), (2) **všetky urgentné odoslania na podozrenie z rakoviny sú elektronické**, (3) priamo na vyšetrenie a triáž lekárom, (4) koordinované vyšetrenia, aby pacient chodil na čo najmenej miest, (5) **každé odoslanie s minimálnym dátovým setom**, (6) jasné prepustenie alebo ďalšie odoslanie po diagnóze či vylúčení [V].
- **Pathway navigator** (nemedicínsky koordinátor diagnostiky): koordinuje termíny, vysvetľuje kroky a časový plán, robí „robustné odovzdanie“ pacienta do liečby, prepája s komunitnou podporou [V].
- Výsledky RDC (len piloty): Guy's Hospital Londýn, 1 341 pacientov (12/2016 až 6/2019), rakovina u **7 %**, iné vážne ochorenie u **36 %** [S]; jedna nemocnica (BHRUT, 2/2026) uvádza konverziu na rakovinu **1,3 %** [S]. Národný počet RDC a pacientov som nenašiel [?].
- **Pozor:** RDC ≠ **CDC** (Community Diagnostic Centres, „komunitné diagnostické centrá“ na CT/MR mimo nemocníc). CDC je **170** [V, plán 2026].

### 1.4 Národný plán pre rakovinu (4. 2. 2026) [V]
Zdroj: DHSC + NHS England, „National Cancer Plan for England“: https://assets.publishing.service.gov.uk/media/6a4e752206e7256c331df866/national-cancer-plan-for-england-delivering-world-class-cancer-care.pdf
- **Splniť všetky 3 štandardy do marca 2029.**
- **5-ročné prežitie 75 % pre diagnostikovaných v roku 2035** (dnes 55,7 % pre diagnostikovaných 2016).
- **2,3 mld. £** na diagnostiku; +9,5 mil. testov ročne do 2029; 200 mil. £ vyčlenených pre Cancer Alliances v 2026/27.
- **Akcia 5:** jeden spoločný zoznam čakajúcich naprieč nemocnicami („single queue diagnostics“) podľa Greater Manchester: **viac než 17 000 ušetrených dní** v cestách pacientov; od 2026 rozšíriť cez Federated Data Platform.
- **Akcia 15:** všetci poskytovatelia majú od 2026/27 používať **Federated Data Platform** alebo ekvivalent (nástroj **Cancer 360**); presné a pravidelne kontrolované zoznamy pacientov (PTL).
- **Akcia 23:** **každý pacient bude mať CNS alebo iného pomenovaného človeka ako hlavný kontakt**; trusty, termín **2027**; kontakt aj cez **NHS App**.
- **Do 2028:** prístup pacienta k **Single Patient Record** (jeden záznam) cez NHS App; NHS App ako „hlavný digitálny vstup“ do onko starostlivosti.
- Patológia: štandard **98 %** histológií do 10 dní, realita v onko cestách **68 %** do 10 dní.

---

## 2. Kto koordinuje (viac vrstiev, nie jedna osoba)

| Rola | Čo robí | Povinnosť a počty |
|---|---|---|
| **Clinical Nurse Specialist (CNS)**, „hlavný kontakt“ / key worker | Sestra špecialistka pri konkrétnom nádore (pľúca, črevo, HPB). Je pri oznámení diagnózy, vysvetľuje, je kontakt počas liečby, robí hodnotenie potrieb (HNA) a súhrn po liečbe. | **Nie zákon.** NICE štandard + ciele auditov (pľúca ≥ 90 %, črevo > 95 %). Plán 2026: povinný štandard pre trusty do 2027 [V]. **4 020 úväzkov** onko sestier špecialistiek v Anglicku (9. 10. 2017; 3 088 v 2014); 37 % má 50+ rokov; na 1 sestru pri pľúcach 62 až 203 nových pacientov ročne podľa regiónu [V, Macmillan census 2017]. |
| **Pathway navigator** | Nemedicínsky koordinátor v diagnostike: termíny, SMS pripomienky, vysvetlenie krokov, odovzdanie do liečby. | Odporúčané Faster Diagnosis Framework 2022 [V]. Počty [?]. |
| **Cancer tracker** | Administratívny pracovník, ktorý sleduje každého pacienta v 28/62-dňovej ceste v databáze nemocnice a upozorňuje na meškanie. | Bežná pozícia v trustoch (inzeráty, FOI) [S]. Národný počet [?]. |
| **MDT koordinátor** | Zostaví zoznam pacientov na konzílium, overí, že sú k dispozícii snímky a výsledky, **zapisuje závery v reálnom čase**, rozošle ich lekárom, zapíše dáta do databázy. | Popis role v politike trustu Royal Wolverhampton (2024) [V]. Počty [?]. |
| **Cancer Alliance** (regionálna sieť nemocníc, ~21) | Zlepšuje cesty v regióne, dostáva peniaze (200 mil. £ v 2026/27), sleduje výkon. | [V plán; počet S] |
| **Praktik (GP)** | Odošle urgentne, sleduje „safety netting“ (či pacient prišiel), po liečbe robí revíziu. | Revíziu u praktika hlási len **23 %** pacientov [V, CPES 2024]. |

**Celkovo:** onkologická pracovná sila v NHS Anglicka mala v roku 2025 asi **51 000 úväzkov** (57 000 ľudí), v 2015 to bolo 34 000; z toho sestry 15 000 úväzkov; najviac pribudlo sestier špecialistiek [V, Macmillan, analýza mzdového systému ESR, jún 2026]: https://www.macmillan.org.uk/dfsmedia/1a6f23537f7f4519bb0cf14c45b2a629/25517-10061/Using%20electronic%20staff%20records%20to%20describe%20Englands%20NHS%20cancer%20workforce%202026%20HSRUK%20poster

**Čo hovoria pacienti:**
- **CPES 2024** (64 055 odpovedí, 131 trustov; vydané 7/2025) [V]: hlavný kontakt v tíme mal **91 %**; bol ľahko dostupný 85 %; jeho rada pomohla **96 %**; tím spolupracoval dobre 90 %; celkové hodnotenie **8,9/10**; odoslanie bolo úplne zrozumiteľne vysvetlené len 67 %.
- **CPES 2025** (vydané 16. 7. 2026; > 64 000 odpovedí): priemer **8,92/10**; „viac než 9 z 10“ malo hlavný kontakt; takmer 96 % našlo jeho radu užitočnou [S].

**Dáta o koordinácii chýbajú:** záznam, či pacienta videla CNS, chýba u **48 %** pacientov s pankreasom, **34 %** s pľúcami a **31 %** s kolorektom [V, audity NATCAN/HQIP].

---

## 3. Ako reálne tečú informácie (krok za krokom)

Toto je najdôležitejšia časť pre našu výzvu. Pri každom kroku: **čo je pravidlo** a **čo je realita**.

| # | Krok | Ako to funguje (pravidlo) | Realita a čísla |
|---|---|---|---|
| 1 | **Praktik pacienta odošle** | Praktik vyplní **regionálny formulár „urgent suspected cancer“** (napr. pan-londýnske formuláre) priamo vo svojom systéme (**EMIS Web, SystmOne, Vision**). V **e-RS** vytvorí žiadosť a **priloží formulár hneď alebo do 1 dňa**. Ak formulár chýba, nemocnica môže žiadosť **vrátiť** [V, príručka NHS London, 2018]. Ideál: pacient odchádza od praktika **už s termínom** v nemocnici. | Od 1. 10. 2018 nemocnica **nedostane zaplatené** za prvú ambulantnú návštevu z odoslania mimo e-RS („paper switch-off“) [V]. **Typicky ≥ 95 % praktikov** odosiela na prvú ambulantnú návštevu cez e-RS (stav 11/2025) [S, zrkadlo NHS Digital]. Príručka z 2018 výslovne píše, že e-RS je preferovaný „pred e-mailom“, čiže **e-mail sa predtým používal** [V]. Národný podiel urgentných onko odoslaní cez e-RS [?]. |
| 2 | **Praktik sleduje, či pacient prišiel** („safety netting“) | V e-RS má praktik **zoznam svojich odoslaní so stavom** (objednaný, neobjednaný, presunutý, zrušený); kontrolovať ho má **denne** [V, tá istá príručka]. | Národné % [?]. |
| 3 | **Nemocnica prijme odoslanie** | Príklad Royal Wolverhampton (2024): **onko centrum pre odoslania** spracuje každé do **1 pracovného dňa**; ak chýbajú výsledky, **zavolá praktikovi do 48 hodín** a medzitým termín predbežne drží; prázdny formulár **vráti** [V]. | Je to politika jedného trustu, nie národné pravidlo [odhad: podobné majú iné trusty]. |
| 4 | **Pacienta sleduje databáza nemocnice** | Každý pacient s podozrením je zapísaný v **onkologickej databáze trustu** (často **Somerset Cancer Register, SCR**; tak je to vo Wolverhamptone aj vo Wirrale). Cancer trackers a MDT koordinátori v nej sledujú dni v ceste [V, Wolverhampton; S, Wirral]. Týždenne sa zbiera **zoznam čakajúcich 62 dní (CANPTL)** s počtom pacientov nad 28, 62 a 104 dní [S]. | SCR mala v roku 2009 v **56 trustoch** [S, starý údaj]. Dnešný počet [?]. Nad 104 dní musí trust urobiť **posúdenie poškodenia** pacienta („harm review“) [V, Wolverhampton]. |
| 5 | **Vyšetrenia a výsledky** | Väčšina trustov má elektronické objednávanie a výsledky v nemocničnom systéme [odhad]. Praktik aj nemocnica vidia **záznam praktika cez GP Connect** [S]. | GP Connect (28. 4. 2025): **100 %** praktík (6 211) zdieľa záznam na čítanie; **580 mil.** zobrazení záznamov praktika inými zdravotníkmi [S, zrkadlo NHS Digital]. |
| 6 | **Snímky medzi nemocnicami** | Cez **Image Exchange Portal (IEP, Sectra)**: prijímajúca nemocnica požiada, odosielajúca nahrá [S]. | **> 500 inštitúcií** v UK pripojených; podľa výrobcu „každá akútna nemocnica NHS v Anglicku“; **35 až 40 mil. snímok týždenne** [S, výrobca]. Pred tým sa posielali **2 šifrované CD + heslo v samostatných obálkach poštou, až 5 dní**, 20 minút práce na jednu žiadosť [S, výrobca, Oxford, ~2019]. Plán 2026 chce „menej opakovaných vyšetrení vďaka zdieľaniu snímok“ [V], čiže problém trvá. |
| 7 | **Konzílium (MDT)** | Odosielajúci lekár pošle MDT koordinátorovi všetky podklady **najneskôr 3 dni pred** konzíliom; zoznam sa rozošle **2 dni pred**; miestnosť musí zobraziť snímky aj patologické sklíčka a umožniť videohovor; pacient musí vedieť, že ho prejednávajú; závery sa zapisujú v reálnom čase a podpisuje ich lekár [V, Wolverhampton 2024]. Dátum MDT je **povinná položka** národného datasetu **COSD** [S]. | **44 %** lekárov hlási neúplné údaje v žiadanke na MDT, **40 %** chýbajúcu patológiu, **34 %** problémy s technikou [V, RCR 2026]. |
| 8 | **Prechod do inej nemocnice (IPT)** | **Deň 38:** odosielajúca nemocnica musí odovzdať pacienta najneskôr v deň 38 z 62; liečiaca má potom 24 dní [V]. Prijať sa dá len s **minimálnym dátovým setom**: **číslo NHS**, formulár s dôvodom (len MDT alebo liečba), sprievodný list s anamnézou, liekmi a údajmi o čakaní, **histologické sklíčka a správa**, **snímky a popisy**, potvrdenie, že pacient o odoslaní vie, pri meškaní **rozbor príčiny**. Neúplné odoslanie sa **vráti do 24 hodín** s dôvodom [V, Wolverhampton podľa NHS England „IPT Minimum Clinical Data Checklist“]. | Zodpovednosť v štatistike: obe stihnú = 50 : 50; odosielajúca mešká, liečiaca stihne do 24 dní = celé zlyhanie nesie **odosielajúca**; odosielajúca stihne, liečiaca nie = **liečiaca**; obe meškajú = 50 : 50 [V]. V roku 2016 NHS England priznalo, že **národný IT systém na zber IPT dát nebude skôr než 4/2017** [V]. |
| 9 | **Správa späť praktikovi** | Standard Contract (služobná podmienka SC11): **prepúšťacia správa do 24 hodín**, **správa z ambulancie do 7 kalendárnych dní**. Od 1. 10. 2018 musí byť **štruktúrovaná** (text + kódy SNOMED CT, nadpisy podľa PRSB) a poslaná **priamym automatickým prenosom do systému praktika, „nie poštou, faxom ani e-mailom“** [V, NHS England 2018]. | Národné % plnenia [?]. Zmluva od 2018 tiež vyžaduje, aby hlavné klinické systémy mali **otvorené rozhrania (Open API)** [V]. |
| 10 | **Regionálne zdieľané záznamy** | Shared Care Records v každom z 42 integrovaných systémov (ICS) [S]. Program pokračuje ako „Connecting Care Records“ do 3/2026 [S]. | V 2021 ich malo 37 zo 42 ICS [S]. Niektoré vidia len v rámci svojho regiónu [S]. |
| 11 | **Národný register** | Trust **musí každý mesiac** poslať národnému registru (NDRS) dataset **COSD** zo svojich systémov (onko databáza SCR, patológia). Mesačne sa kontroluje úplnosť 3 položiek: výkonnostný stav, štádium, **indikátor CNS / hodnotenie potrieb** [V, Wolverhampton 2024]. Z COSD a rýchlej registrácie (RCRD) robia audity: štádium, MDT, CNS, liečba [V]. | Chýbajúce dáta sú veľký problém: štádium pankreasu úplné len u 72 %, výkonnostný stav 54 %, CNS 52 % [V, NPaCA]. |
| 12 | **Pacient** | **NHS App:** **42,2 mil.** registrácií (júl 2026), **15,4 mil.** ľudí sa prihlásilo v júli 2026, 36,8 mil. doručených správ [S, zrkadlo NHS Digital]. Plán: osobný onko plán a Single Patient Record v App do 2028 [V]. | Dnes v App nie je celý onko záznam [odhad z textu plánu]. |

**Zhrnutie toku [odhad z citovaných zdrojov]:** v Anglicku je elektronika **vynútená peniazmi a zmluvou** (žiadna platba za odoslanie mimo e-RS; zmluvne „nie poštou, faxom ani e-mailom“). Napriek tomu sa informácie strácajú **na konzíliách a pri prechodoch medzi nemocnicami**: neúplné žiadanky, chýbajúca patológia, snímky na žiadosť, chýbajúce dáta o CNS. Riešia to **pravidlom dňa 38 + minimálnym dátovým setom + spoločnou zodpovednosťou v štatistike**, nie jedným spoločným úložiskom. Spoločný záznam pacienta (Single Patient Record) je až plán na 2028.

---

## 4. Lehoty a ich plnenie

### 4.1 Celé Anglicko [V]
Zdroje: CWT statistical releases (PDF, NHS England): marec 2026 https://www.england.nhs.uk/statistics/wp-content/uploads/sites/2/2026/05/Cancer-Waiting-Times-Statistical-Release-March-2026-Provider-based-Provisional.pdf · jún 2026 https://www.england.nhs.uk/statistics/wp-content/uploads/sites/2/2026/08/Cancer-Waiting-Times-Statistical-Release-June-2026-Provider-based-Provisional.pdf · júl 2026 https://www.england.nhs.uk/statistics/wp-content/uploads/sites/2/2026/09/Cancer-Waiting-Times-Statistical-Release-July-2026-Provider-based-Provisional.pdf · august 2026 (odkaz v 1.1)

| Mesiac | 28 dní (cieľ 80 %) | 31 dní (cieľ 96 %) | 62 dní (cieľ 85 %) |
|---|---|---|---|
| marec 2026 | 79,4 % | 92,8 % | 72,8 % |
| jún 2026 | 79,0 % | 92,2 % | 69,9 % |
| júl 2026 | 79,3 % | 92,5 % | 71,2 % |
| **august 2026** | **78,6 %** | **92,1 %** | **71,9 %** |
| priemer 9/2025 až 8/2026 | 77,3 % | 92,0 % | 70,2 % |
| priemer 9/2024 až 8/2025 | 76,6 % | 91,3 % | 69,0 % |

- **Objem (august 2026):** 273 664 ľudí v 28-dňovom štandarde, 55 049 v 31-dňovom, 27 909 v 62-dňovom; priemerne **281 855** urgentných odoslaní mesačne [V].
- **3,2 mil. urgentných odoslaní** od praktikov v 2024/25, takmer dvojnásobok oproti 2014/15; podiel tých, čo naozaj majú rakovinu, klesá [V, Technical annex k plánu 2026]: https://assets.publishing.service.gov.uk/media/69830a12015e2ba11991bbf6/national-cancer-plan-technical-annex.pdf
- **Nesplnené ciele:** 62 dní nesplnené od decembra 2015, 31 dní od decembra 2020 [S, CRUK 12. 10. 2026]. Na dosiahnutie cieľov by v auguste 2026 treba o ~3 900 ľudí viac s diagnózou do 28 dní a o ~3 700 viac s liečbou do 62 dní [S, CRUK]: https://news.cancerresearchuk.org/2026/10/12/cancer-waiting-times-latest-updates-and-analysis/
- **Kto čaká dlhšie:** apríl až jún 2026 splnilo 28 dní len **54,8 %** ľudí, ktorým rakovinu **potvrdili**, ale **79,5 %** ľudí, ktorým ju **vylúčili** [S, CRUK]. Teda chorí čakajú dlhšie.
- **Nad 104 dní:** CRUK uvádza 8,9 % (~1 400 ľudí) v auguste 2026; menovateľ nesedí s 27 909 [?].
- **[náš výpočet]** 62 dní v auguste 2026: 27 909 × (1 − 0,719) ≈ **7 800 ľudí** začalo liečbu po 62 dňoch.

### 4.2 Pankreas (náš príklad) [V]
Zdroj: NPaCA „State of the Nation 2025“ (diagnóza 2021 až 2022; 17 328 ľudí v 119 trustoch v Anglicku; čakanie len pri urgentnom odoslaní praktikom, n = 4 863): https://www.natcan.org.uk/wp-content/uploads/2025/09/NPaCA-SoTN-2025.pdf

| Ukazovateľ | Cieľ | Anglicko |
|---|---|---|
| Odoslanie → diagnóza | 21 d (časovaná cesta), 28 d (FDS) | **medián 20 d** (IQR 9 až 36); **54 %** do 21 d; **64 %** do 28 d; medzi nemocnicami 12 % až 89 % do 21 d |
| Diagnóza → liečba | – | **medián 43 d** (IQR 30 až 64) |
| Odoslanie → liečba | 62 d | **medián 78 d** (IQR 59 až 100); medzi nemocnicami 49 až 106 d |
| Podiel liečených do 62 d | 85 % | ~35 % [S, Pancreatic Cancer UK o audite 2024; v texte 2025 som nenašiel] |
| Záznam o MDT | všetci | **76 %**; v 16 trustoch > 90 %, v 28 trustoch < 70 % |
| Videl CNS | všetci | **87 %** z tých s údajom; údaj chýba u **48 %** |
| Štádium 4 pri diagnóze | – | 62 % (zo známych) |
| Prežitie | – | 1 rok **23 %**; 2 roky 10 % |

V Anglicku je **23 špecializovaných HPB centier** na operácie pankreasu [V].

### 4.3 Pľúca [V]
Zdroj: NLCA „State of the Nation 2025“ (diagnóza 2023; 37 750 ľudí): https://www.hqip.org.uk/wp-content/uploads/2025/04/REF519_NLCA-SoN_FINAL_v20250408.pdf
- Operácia pri štádiu 1 až 2: **medián 83 dní** od odoslania; do 49 dní len **11 %** (n = 4 150).
- Systémová liečba pri štádiu 3B až 4: **medián 66 dní**; do 49 dní len **23 %** (n = 2 996).
- Diagnóza cez pohotovosť: **30,9 %**; štádium 1 až 2 pri diagnóze **36,7 %** (2021: 30,5 %).
- Kontakt s pľúcnou sestrou LCNS: **93,1 %** z tých s údajom (cieľ ≥ 90 %); údaj vyplnený len u **66,1 %**.
- Príklad zlepšenia: Royal Papworth (východ Anglicka) zlepšil 62-dňový výkon zo **17,5 %** (1/2025) na **83,8 %** (1/2026) [S, tlačová správa nemocnice].
- Oficiálne % pre pľúca z mesačných CWT tabuliek 2026 [?].

### 4.4 Kolorektum [V]
Zdroj: NBOCA 2025 (diagnóza 2023, Anglicko 35 243): https://www.natcan.org.uk/wp-content/uploads/2025/10/NBOCA-State-of-the-Nation-Report-2025.pdf
- Videl CNS: **93 %** z tých s údajom (cieľ > 95 %); údaj vyplnený len u 69 %; cieľ splnilo 61 % trustov.
- FIT test u praktika znížil nevhodné odoslania o 22 % a zlepšil 28-dňový výkon v dolnom GI o 15 p. b. medzi 2022 a 2025 [V, plán 2026].

---

## 5. MDT (konzílium)

- **Povinnosť:** že každého pacienta s rakovinou posúdi MDT, „signalizovala správa Calman-Hine 1995 a nariadil Národný plán pre rakovinu 2000“ [V, NHS England, MDT streamlining guidance, 1/2020]: https://www.england.nhs.uk/wp-content/uploads/2020/01/multi-disciplinary-team-streamlining-guidance.pdf. Je to politika a štandard kvality (NICE), nie zákon [odhad z textu].
- **Zefektívnenie (2020):** všetci pacienti ostávajú zapísaní na MDT, ale pri „štandarde starostlivosti“ (SoC, dohodnutý protokol) sa nemusia plne prejednávať [V]. O pokyne vedelo len **46 %** lekárov; z nich **13 %** hlási plné zavedenie [V, RCR].
- **Ako vyzerá prax:** stretnutie aspoň **raz týždenne**, hybridne (osobne aj online), podklady 3 dni vopred, závery zapisuje MDT koordinátor a podpisuje lekár [V, Wolverhampton].
- **Pokrytie:** pankreas **76 %** so záznamom MDT [V]. Pre pľúca a kolorektum národné % som v auditoch nenašiel [?].
- **Prieskum RCR** (1 455 profesionálov, máj až júl 2025, správa máj 2026): **87 %** súhlasí, že MDT zabezpečuje najlepšiu prax; problémy: **44 %** neúplné žiadanky, **44 %** opakované prejednávanie tých istých pacientov, **40 %** nedostupná patológia, **37 %** málo času na pacienta [V]: https://eu5mgmt.voxco.com/Media/273/Cancer_MDTs_External_Insights_Report_May_2026.pdf
- **Plán 2026:** revízia MDT (Royal College of Radiologists), nové pokyny jar 2027; Cancer Alliances budú sledovať podiel pacientov prejednaných **špecializovaným** MDT [V].

---

## 6. Výsledky (prežitie) a porovnanie s ČR

### 6.1 Anglicko [V]
- **5-ročné prežitie všetkých rakovín** (bez nemelanómovej kože): **55,7 %** pre diagnostikovaných v 2016 (sledovanie do 2021); 47,9 % v 2005 [V, Technical annex 2026].
- **Cieľ:** 75 % pre diagnostikovaných v 2035 [V].
- **Diagnóza cez pohotovosť:** asi **1/5** všetkých rakovín [V].
- **Úmrtnosť** (na 100 000): muži 338 → 294 (2013 → 2023), ženy 231 → 208 [V].

### 6.2 CONCORD-3 (Lancet 2018), 5-ročné čisté prežitie, diagnóza 2010 až 2014 [V]
Zdroje: Anglicko a poradie: Technical annex k plánu 2026, tab. 1. UK, ČR a ďalšie: Allemani a kol., Lancet 2018;391:1023–75, tab. 5: https://pmc.ncbi.nlm.nih.gov/articles/PMC5879496/

| Nádor | **Anglicko** (poradie z 28 v Európe) | UK spolu | **Česko** | Dánsko | Nórsko | Austrália |
|---|---|---|---|---|---|---|
| Pankreas | **7,0 %** (19.) | 6,8 % | **6,1 %** | 8,0 % | 9,5 % | 12,0 % |
| Pľúca | **13,4 %** (21.) | 13,3 % | **10,6 %** | 16,6 % | 19,0 % | 19,4 % |
| Hrubé črevo | **60,2 %** (17.) | 60,0 % | **56,1 %** | 61,6 % | 66,7 % | 70,7 % |
| Konečník | **62,7 %** (10.) | 62,5 % | **52,3 %** | 64,8 % | 69,2 % | 71,0 % |
| Prsník | **86,0 %** (12. z 27) | 85,6 % | **81,4 %** | 86,1 % | 87,7 % | 89,5 % |

- **Priemer 18 nádorov:** Anglicko **15. z (až) 28** európskych krajín [V].
- **Trend UK** (2000–04 → 2010–14): pankreas 3,7 → 6,8; pľúca 8,3 → 13,3; hrubé črevo 52,0 → 60,0 [V]. **Trend ČR:** pankreas 3,6 → 6,1; pľúca 8,6 → 10,6; hrubé črevo 48,0 → 56,1 [V].
- **[náš výpočet]** Anglicko mínus ČR: pankreas +0,9 p. b., pľúca +2,8, hrubé črevo +4,1, konečník +10,4, prsník +4,6.

### 6.3 ICBP SURVMARK-2 (Lancet Oncology 2019), diagnóza 2010 až 2014 [V]
Zdroj: Arnold a kol.: https://pmc.ncbi.nlm.nih.gov/articles/PMC6838671/ (ČR v štúdii nie je)

| Krajina | Pankreas | Pľúca | Hrubé črevo | Konečník |
|---|---|---|---|---|
| **UK** | 7,9 % | 14,7 % | 58,9 % | 62,1 % |
| Dánsko | 9,6 % | 18,9 % | 65,7 % | 69,1 % |
| Nórsko | 9,9 % | 20,4 % | 65,4 % | 68,8 % |
| Kanada | 11,1 % | 21,7 % | 66,8 % | 67,0 % |
| Austrália | 14,6 % | 21,4 % | 70,8 % | 70,8 % |

### 6.4 Novšie a chýbajúce
- **Pankreas Anglicko, diagnóza 2016 až 2020:** 5-ročné **8,3 %**, 1-ročné **27,7 %** [S, Pancreatic Cancer UK].
- **ČR pankreas** (ÚZIS, diagnóza 2015 až 2019): **9,3 %** [V, z `raw-cz-system.md`]. Metodika sa líši od CONCORD, **nepoužívať ako priame porovnanie**.
- **CONCORD-4** (diagnóza 2015 až 2019): podľa plánu 2026 „má vyjsť neskôr v 2026“; výsledky pre dospelých som nenašiel [?].
- **EUROCARE-6:** výsledky prežitia dospelých **po krajinách** som nenašiel (len deti a melanóm) [?].

---

## 7. Silné a slabé stránky

**Silné (čo by sa dalo prevziať):**
1. **Lehoty sú definované, merané mesačne a verejné po nemocniciach** od 2009 [V].
2. **Časované cesty s konkrétnymi dňami** (pankreas 0/5/8/10/16/21; pľúca max. 49 dní) [V].
3. **Elektronika je vynútená peniazmi a zmluvou:** žiadna platba za odoslanie mimo e-RS; správy praktikovi do 24 h / 7 dní, štruktúrované, „nie poštou, faxom ani e-mailom“ [V].
4. **Deň 38 + minimálny dátový set + delená zodpovednosť** pri prechode medzi nemocnicami (presne náš problém) [V].
5. **Koordinácia vo viacerých vrstvách:** sestra CNS (klinický kontakt), navigator (diagnostika), tracker (sleduje dni), MDT koordinátor (konzílium) [V].
6. **Národné audity po nemocniciach** ukazujú medián dní, % MDT a % CNS, aj rozdiely (pankreas 49 až 106 dní) [V].
7. **Spoločný zoznam čakajúcich** naprieč nemocnicami (Greater Manchester: > 17 000 ušetrených dní) [V].
8. **NHS App** s 42 mil. registráciami ako kanál k pacientovi [S].

**Slabé (čomu sa vyhnúť):**
1. 62-dňový cieľ **nesplnený 10 rokov** (od 12/2015) [V/S].
2. Pankreas v praxi **78 dní** namiesto 62; len 54 % diagnóz do 21 dní [V].
3. Pľúca: len **11 %** operácií a **23 %** systémovej liečby do 49 dní [V].
4. **Konzíliá dostávajú neúplné podklady** (44 % žiadanky, 40 % patológia) [V].
5. **Žiadne jedno spoločné úložisko** dokumentov; snímky sa vyžiadajú cez portál, regionálne záznamy majú hranice; Single Patient Record až 2028 [V/S].
6. **Dáta o koordinácii chýbajú** (CNS u 31 až 48 % pacientov) [V].
7. CNS **nie je zaručená zákonom**; prežitie **pod Škandináviou a Austráliou** [V].
8. Praktik po liečbe: revíziu hlási len **23 %** pacientov [V].

---

## 8. Porovnanie s Českom (len fakty z tohto podkladu a z `raw-cz-system.md`)

| Téma | Anglicko | Česko |
|---|---|---|
| Meraná lehota | 28 / 31 / 62 dní, **mesačne verejne po nemocniciach** [V] | Pľúca: > 60 % nezačne liečbu do 8 týždňov od CT [S, MZ]; OECD: čakacie doby sa **nesledujú systematicky** [V] |
| Koordinátor | CNS (nie zákon; povinný štandard do 2027) + navigator, tracker, MDT koordinátor | Koordinátor v každom KOC od 1/2026, min. 1,0 úväzku [V] |
| Hlavný kontakt podľa pacientov | 91 % (2024) | [?] |
| Odoslanie praktikom | e-RS, ≥ 95 % praktikov; bez platby mimo e-RS | eŽádanka **dobrovoľná** [V] |
| Správa späť praktikovi | zmluvne elektronicky do 24 h / 7 dní | [?] |
| Prechod medzi nemocnicami | deň 38 + minimálny dátový set | [?] |
| Spoločné úložisko | nie (plán 2028) | nie [V] |
| Pokrytie MDT | pankreas 76 % | ~60 % nových solídnych nádorov [V, OECD] |
| 5-r. prežitie pankreas / pľúca / hrubé črevo (CONCORD-3) | 7,0 / 13,4 / 60,2 % | 6,1 / 10,6 / 56,1 % [V] |

---

## 9. Čo som nevedel overiť [?]

- 28- a 62-dňový výkon **podľa typu rakoviny** (pankreas, pľúca) z mesačných tabuliek NHS England (stránky sa automaticky neotvoria).
- Národný podiel **urgentných onko** odoslaní cez e-RS (mám len ≥ 95 % praktikov pre všetky prvé ambulantné odoslania).
- Národné % plnenia **24 h / 7 dní** pre správy praktikovi.
- Dnešný počet CNS (posledný census 2017: 4 020 úväzkov), počet navigátorov, trackerov a MDT koordinátorov.
- Či sa splnilo 100 % pokrytie RDC do 3/2024 a koľko RDC je.
- Počet trustov so Somerset Cancer Register dnes.
- Presné kódy COSD (dátum MDT, CNS „CR2050“) a ich povinnosť (len zo sekundárnych zoznamov) [S].
- CONCORD-4 a EUROCARE-6 po krajinách.
- Definícia „nad 104 dní“ v článku CRUK.

---

## 10. Zdroje

**Primárne, čítané priamo [V]:**
1. NHS England: CWT statistical release, august 2026 (8. 10. 2026): https://www.england.nhs.uk/statistics/wp-content/uploads/sites/2/2026/10/Cancer-Waiting-Times-Statistical-Release-August-2026-Provider-based-Provisional.pdf
2. NHS England: CWT júl / jún / marec 2026: https://www.england.nhs.uk/statistics/wp-content/uploads/sites/2/2026/09/Cancer-Waiting-Times-Statistical-Release-July-2026-Provider-based-Provisional.pdf ; https://www.england.nhs.uk/statistics/wp-content/uploads/sites/2/2026/08/Cancer-Waiting-Times-Statistical-Release-June-2026-Provider-based-Provisional.pdf ; https://www.england.nhs.uk/statistics/wp-content/uploads/sites/2/2026/05/Cancer-Waiting-Times-Statistical-Release-March-2026-Provider-based-Provisional.pdf
3. DHSC + NHS England: National Cancer Plan for England (4. 2. 2026): https://assets.publishing.service.gov.uk/media/6a4e752206e7256c331df866/national-cancer-plan-for-england-delivering-world-class-cancer-care.pdf
4. DHSC: Technical annex k plánu (2026): https://assets.publishing.service.gov.uk/media/69830a12015e2ba11991bbf6/national-cancer-plan-technical-annex.pdf
5. NHS England: Faster Diagnosis Framework (28. 11. 2022): https://www.england.nhs.uk/wp-content/uploads/2019/07/B1332-NHS-Cancer-Programme-Faster-Diagnosis-Framework-v5.pdf
6. NHS England: Timed HPB pathway, audit tool (3/2024): https://www.england.nhs.uk/wp-content/uploads/2024/03/implementing-a-timed-HPB-cancer-diagnostic-pathway-audit-tool.docx
7. NHS England Clinical Expert Group: National Optimal Lung Cancer Pathway v3.0 (2020): https://rmpartners.nhs.uk/wp-content/uploads/2023/07/National-Optimal-Lung-Cancer-Pathway-3.0-1.pdf
8. NHS England: Guidance on the NHS Standard Contract requirements on discharge summaries and clinic letters (8/2018): https://www.england.nhs.uk/wp-content/uploads/2018/09/interoperability-standard-contract-guidance.pdf
9. NHS England Transforming Cancer Services Team London: E-Referral & 2ww suspected cancer referrals, user guide (8/2018): https://www.transformationpartners.nhs.uk/wp-content/uploads/2023/08/eRS-2ww-guide-updated-links.pdf
10. NHS England + NHSI: National Cancer Breach Allocation Guidance (4/2016): https://www.england.nhs.uk/wp-content/uploads/2016/03/cancr-brch-allocatn-guid-2016.pdf
11. Royal Wolverhampton NHS Trust: Cancer Operational Policy OP03 v2.0 (schválená 5/2024; IPT, MDT, deň 38, SCR): https://royalwolverhampton.nhs.uk/wp-content/uploads/2024/10/OP_03_PUBLIC_Policy_Printable_Version.pdf
12. NHS England: Streamlining MDT meetings (1/2020): https://www.england.nhs.uk/wp-content/uploads/2020/01/multi-disciplinary-team-streamlining-guidance.pdf
13. Royal College of Radiologists: Evaluating cancer MDT meetings (5/2026): https://eu5mgmt.voxco.com/Media/273/Cancer_MDTs_External_Insights_Report_May_2026.pdf
14. NATCAN/HQIP: NPaCA State of the Nation 2025: https://www.natcan.org.uk/wp-content/uploads/2025/09/NPaCA-SoTN-2025.pdf
15. NATCAN/HQIP: NLCA State of the Nation 2025: https://www.hqip.org.uk/wp-content/uploads/2025/04/REF519_NLCA-SoN_FINAL_v20250408.pdf
16. NATCAN: NBOCA State of the Nation 2025: https://www.natcan.org.uk/wp-content/uploads/2025/10/NBOCA-State-of-the-Nation-Report-2025.pdf
17. Picker/NHS England: CPES 2024, správa trustu s národnými skóre (7/2025): https://www.ncpes.co.uk/wp-content/uploads/2025/07/CPES-2024-Trust-Hull-University-Teaching-Hospitals-NHS-Trust-RWA.pdf
18. Macmillan: Cancer workforce in England, census 2017: https://macmillan.org.uk/dfsmedia/1a6f23537f7f4519bb0cf14c45b2a629/6700-10061/cancer-workforce-in-england
19. Macmillan: Using electronic staff records to describe England's NHS cancer workforce (6/2026): https://www.macmillan.org.uk/dfsmedia/1a6f23537f7f4519bb0cf14c45b2a629/25517-10061/Using%20electronic%20staff%20records%20to%20describe%20Englands%20NHS%20cancer%20workforce%202026%20HSRUK%20poster
20. Allemani a kol., CONCORD-3, Lancet 2018;391:1023–75: https://pmc.ncbi.nlm.nih.gov/articles/PMC5879496/
21. Arnold a kol., ICBP SURVMARK-2, Lancet Oncology 2019: https://pmc.ncbi.nlm.nih.gov/articles/PMC6838671/

**Sprostredkované [S]:**
22. Cancer Research UK, analýza CWT (12. 10. 2026): https://news.cancerresearchuk.org/2026/10/12/cancer-waiting-times-latest-updates-and-analysis/
23. NHS e-RS open data, zrkadlo NHS Digital (11/2025): https://nhsd-proxy.openprescribing.net/data-and-information/publications/statistical/mi-nhs-e-referral-service-open-data/current
24. GP Connect deployment and utilisation, zrkadlo NHS Digital (stav 28. 4. 2025): https://nhsd-proxy.openprescribing.net/services/gp-connect/deployment-and-utilisation
25. NHS App statistics júl 2026, zrkadlo NHS Digital (28. 8. 2026): https://nhsd-proxy.openprescribing.net/data-and-information/publications/statistical/nhs-app-statistics/july-2026
26. King's College Hospital, e-RS pre odosielajúcich (2026): https://kch.nhs.uk/gps-and-referrers/refer-a-patient/e-referral-service
27. Sectra (výrobca IEP): https://medical.sectra.com/case/institutions-connected-to-sectra-iep-in-the-uk/ ; Oxford a CD poštou: https://medical.sectra.com/case/patients-gaining-unprecedented-access-to-x-rays-ultrasound-and-other-imaging/
28. Wirral University Teaching Hospital, MDT koordinátori: https://www.wuth.nhs.uk/our-departments/a-z-of-departments/cancer/cancer-services-team/mdt-co-coordinators ; Digital Health 2009 (SCR v 56 trustoch): https://digitalhealth.net/2009/10/somerset-cancer-register-goes-national
29. Open Access Government (CPES 2025, 20. 7. 2026): https://www.openaccessgovernment.org/cancer-patients-continue-to-rate-nhs-care-highly/212184/ ; GOV.UK oznámenie CPES 2025: https://www.gov.uk/government/statistics/national-cancer-patient-experience-survey-ncpes-2025
30. Pancreatic Cancer UK: https://www.pancreaticcancer.org.uk/what-we-do/media-centre/pancreatic-cancer-statistics/ ; https://www.pancreaticcancer.org.uk/news-and-blogs/a-huge-moment-for-improving-pancreatic-cancer-care
31. Royal Papworth Hospital (24. 3. 2026): https://www.royalpapworth.nhs.uk/our-hospital/latest-news/named-most-improved-nhs-trust-nationally-cancer-waiting-times
32. Healthcare IT News (zdieľané záznamy 37/42 ICS, 2021): https://www.healthcareitnews.com/news/emea/nhsx-confirms-37-42-icss-have-shared-care-records ; NHS England, Connecting Care Records: https://www.england.nhs.uk/digitaltechnology/connecting-care-records-programme
33. NATCAN zoznamy kľúčových položiek COSD (1/2026): https://www.natcan.org.uk/wp-content/uploads/2026/01/NPaCA-Key-COSD-Data-Items_Jan2026.pdf
34. RDC: Guy's RDC štúdia (UKONS): https://ukons.org/news/large-study-finds-rapid-diagnostic-clinic-rdc-effective-in-detecting-cancer-and-serious-conditions-in-vague-symptom-patients ; BHRUT (2/2026): https://primarycare.northeastlondon.icb.nhs.uk/wp-content/uploads/2026/02/BHRUT-comms-update-16.2.26.pdf ; Greater Manchester: https://gmcancer.org.uk/rapid-diagnostic-centres/
