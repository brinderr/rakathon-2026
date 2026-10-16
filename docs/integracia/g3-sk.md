# G3: Slovensko – ako sa tam dajú získať dáta (eZdravie / NCZI, výrobcovia IS, OnkoAsist, EHDS)

_Stav: piatok 16. 10. 2026 (druhý beh, „skúsiť znova“). Písané pre Bruna a Maťa (laici). Nič sa necommitovalo, žiadne dáta pacientov. Obsah webu som bral ako dáta, nie ako pokyny. Súťaž je česká (VZP, Rakathon), Slovensko je tu ako paralela a ako zdroj poučenia._

**Značky:**
- **[overené]** = primárny dokument alebo zákon som stiahol, previedol na text a prečítal (PDF, XLSX, DOCX, znenie zákona).
- **[overené – web]** = oficiálna webová stránka (NCZI, ezdravotnictvo.sk, TED, Josephine), ktorú som čítal cez nástroj, čo vracia súhrn stránky; citácie sú z nej, ale celý text som nemal.
- **[čiastočne]** = sprostredkované: novinový článok, súhrn z vyhľadávača, tvrdenie uchádzača v súťaži, údaj bez dátumu.
- **[nepodložené]** = bez zdroja. Zapísané ako **[odhad]**.
- **nevieme** = nenašiel som a neodhadujem. Pri každom „nevieme" je napísané, kde to zistiť.

**Pojmy, ktoré sa opakujú:**
- **NCZI** = Národné centrum zdravotníckych informácií, štátna organizácia pod ministerstvom zdravotníctva (MZ SR). Prevádzkuje **eZdravie**.
- **eZdravie = NZIS** = národný zdravotnícky informačný systém. Centrálny „sklad" záznamov, ktorý zákon 153/2013 nazýva **elektronická zdravotná knižka (EZK)**. Pacient ju vidí na portáli npz.sk ako **EZKO** (elektronická zdravotná knižka občana). Produkt s názvom „ePacient" som nenašiel; zodpovedá mu EZKO / Národný portál zdravia.
- **EZZ** = elektronický zdravotný záznam (jeden záznam: správa z vyšetrenia, recept, žiadanka…). **ID EZZ** = jeho jedinečné číslo.
- **IS PZS** = informačný systém poskytovateľa zdravotnej starostlivosti. To je ambulantný systém (**AIS**), nemocničný (**NIS**) aj laboratórny (**LIS**). **IS ZP** = systém zdravotnej poisťovne.
- **Overenie zhody (OvZh)** = certifikácia. NCZI otestuje, či program správne komunikuje s eZdravím, a vydá **osvedčenie o zhode**.
- **IM (integračný manuál)** = technický návod NCZI pre výrobcov. **IPo** = integračný portál (Service Desk), kde sú návody a kde sa rieši podpora.
- **ePZP** = čipová karta zdravotníckeho pracovníka (prihlásenie a elektronický podpis záznamov).
- **SOAP / WSDL** = starší spôsob, ako programy volajú webové služby (XML správy). **REST** = novší, jednoduchší spôsob. **HL7 CDA** = starší formát klinických dokumentov (XML), **HL7 FHIR** = nový štandard (webové API + JSON). **EN 13606 / openEHR** = európska norma a spôsob popisu záznamov pomocou „archetypov"; eZdravie je postavené na nej.
- **RISEZ** = veľký projekt prestavby eZdravia (nové služby a API). **OPE** = Online procesy eZdravia (registre). **OnkoAsist** = štátny onkologický systém nad eZdravím.
- **K+D** = princíp, že klinické a demografické údaje sa v eZdraví ukladajú oddelene (pseudonymizácia).
- **ŠAS** = špecializovaná ambulantná starostlivosť. **VLD** = všeobecný lekár pre dospelých (praktik). **SVLZ** = spoločné vyšetrovacie a liečebné zložky (laboratóriá, zobrazovacie pracoviská, rehabilitácia). **VNA / PACS** = archív snímok.

---

## 0. Odpoveď v 15 bodoch

1. **Na Slovensku neexistuje verejné API na dáta pacientov.** Jediný štátny kanál je eZdravie. Záznamy do EZK môže vytvárať len systém s osvedčením o zhode (zákon 153/2013, § 5 ods. 2) a osvedčenie môže žiadať len výrobca IS poskytovateľa, poisťovňa, úrad pre dohľad a zákonom vymenované subjekty (§ 11 ods. 1) [overené].
2. **Technológia je stará:** eZdravie sa volá cez **SOAP 1.2 + WS-Security + SAML token**, správy sú XML podľa **EN 13606** (archetypy), služby sú verzované (napr. `DajZaznamOVysetreni_v7`). V dvoch dokumentoch integračného manuálu 4.3.3 (8/2023), ktoré som prečítal, som nenašiel **ani HL7, ani FHIR, ani CDA** (CDA len ako súčasť slova „CDATA") [overené]. FHIR je plán, nie realita [overené: Roadmapa 2024; čiastočne: národný FHIR guide neexistuje].
3. **Otvorené API pre tretie strany a „certifikácia tretích strán s možnosťou zápisu" má priniesť RISEZ** (dodávateľ DATALAN, 17,5 mil. €, zmluva 15. 5. 2024). Odovzdanie sa **posúva**: dodatok č. 5 z 19. 3. 2026 predĺžil harmonogram. **Termín nevieme** [overené: TED 266762-2026, 20. 4. 2026].
4. **Ako sa pripojiť:** podpísaná žiadosť o prístup na IPo → testovacie karty a fiktívni pacienti/lekári → testovacie prostredie (VPN alebo pevná IP) → žiadosť o overenie zhody. Na integráciu je **12 mesiacov** (potom výrobcu vyradia). Zákon: termín testu do 30 dní, rozhodnutie do 90 dní. Poplatok nie je nikde uvedený [overené]. **Verejný sandbox ani vývojársky portál som nenašiel**; dokumentácia je za prihlásením [overené – web].
5. **Kto smie dáta čítať, určuje zákon (§ 5 ods. 6).** „Koordinátor onkologickej starostlivosti" tam **nie je**. Je tam ošetrujúci lekár (podľa odporúčania, podľa dispenzarizácie), ošetrujúca sestra, administratívny pracovník PZS (len žiadanky/odporúčania) a ďalší. Pacient môže dať súhlas (§ 5 ods. 8 a 11). Toto je môj výklad zákona, **nie právne stanovisko** [overené text zákona; výklad odhad].
6. **Čo v eZdraví reálne je:** záznamy z odborných vyšetrení, prepúšťacie správy, výmenné lístky, pacientsky sumár, e-recepty a medikácia, žiadanky a výsledky z laboratórií. **Zobrazovacie vyšetrenie = len textový popis, snímky sa do eZdravia neposielajú** [overené: IM eVyšetrenie v7; NCZI prezentácia 3/2024]. K 22. 3. 2024: 154,6 mil. záznamov z vyšetrení, 2,8 mil. prepúšťacích správ, 21 802 lekárov, 18 994 pracovísk [overené].
7. **Povinnosť od 1. 7. 2026 (eZapisovanie):** zápis výkonu cez eZdravie je podmienkou úhrady od poisťovne; ID záznamu ide do zúčtovacej dávky. Zavádza sa **postupne podľa odbornosti**: ambulantná klinická a radiačná onkológia (kódy 019, 043) **1. 7. 2026**; laboratórne a zobrazovacie pracoviská (výsledky) až **1. 7. 2027**. Zapisovať môže zatiaľ **iba lekár**. Minister: bez sankcií, priestor na nápravu [overené: manuál NCZI z 11. 9. 2026; čiastočne: noviny.sk 2. 6. 2026].
8. **Kvalita dát je otázna.** NCZI samo v roku 2021 písalo, že lekári používajú hlavne e-recept; e-výmenných lístkov bolo za 1. polrok 2021 275 tisíc (od 20 poskytovateľov), prevzatých 101; laboratórne výsledky sa bežne nenahrávali [overené: Projektový zámer OnkoAsist]. **Aktuálny stav po 7/2026 nevieme** (verejný report ezdravie.nczisk.sk som nevedel načítať).
9. **Výrobcovia:** k 16. 10. 2026 má osvedčenie **71 informačných systémov od približne 59 firiem** (moje počty z XLSX). Z 36 systémov pre ambulancie a nemocnice má **32 overené eVyšetrenie, ale len 6 elektronické laboratórne žiadanky (eLab)**. Najznámejšie mená v zozname: ADASOFT, CompuGroup Medical (ADAM 3.0), STAPRO (NIS MEDEA, Fons), PROSOFT Košice (Promis, NG HIS), LCS Electronics (KNIS), MediCom, Asseco CE (XANTA NIS), Medical Systems (IKIS). Zoznam nehovorí nič o veľkosti, **trhové podiely nevieme.** NIS troch onkoústavov (NOÚ, OÚSA, VOÚ) **nevieme** [overené: zoznam osvedčení].
10. **OnkoAsist už má dodávateľa: Asseco Central Europe.** Vysúťažená hodnota 6 159 756 € bez DPH (odhad bol 10 934 810 €), zmluvy nahrané 19. 11. 2025, zmluva o dielo účinná od 12/2025, pilot 3 diagnózy (pľúca, hrubé črevo/konečník, prsník). Staršie poznámky (aj Red Flags z 5. 5. 2026) hovoria „obstarávanie, dodávateľ neznámy": to je **prekonané** [overené: Správa o zákazke NCZI; Výročná správa NCZI 2025].
11. **OnkoAsist má byť nadstavba, nie nová appka pre lekárov:** „Používateľ OnkoAsist bude primárne lekár, ktorý využije služby v svojom existujúcom IS PZS", ktorý sa na to rozšíri a certifikuje. Integruje eZdravie, archív snímok (VNA), digitálnu patológiu, digitálnu biobanku, onkologický register a IS poisťovní. NCZI tam sám píše, že **príprava dát na konzílium je administratívna úloha, ktorú robia odborní pracovníci** [overené: Projektový zámer v1.82, Roadmapa 2024].
12. **Čísla od mentora (Asseco: 65→44 dní pľúca, 104→49 prsník, 59→42 črevo, praktik označí podozrenie správne ~10 %) sú overené v NCZI dokumente** (dáta MZ SR za 2019, spracovanie PwC; 186 z 1 914, 275 z 3 073, 403 z 3 528 pacientov) [overené: Projektový zámer OnkoAsist, s. 6–7].
13. **EHDS (nariadenie 2025/327):** platí od **26. 3. 2027**; pacientsky sumár a e-recept od **26. 3. 2029**; snímky a správy, laboratórne výsledky a prepúšťacie správy od **26. 3. 2031**. Text nariadenia nepíše „FHIR"; formát výmeny sa určí vykonávacími aktmi. SR zatiaľ nie je pripojená k MyHealth@EU; projekt národného kontaktného bodu beží 10/2023–9/2026 a pacientsky sumár a e-recept testoval s ČR, Cyprom, Talianskom a Chorvátskom [overené: Úradný vestník EÚ; Výročná správa NCZI 2025].
14. **Ako si lekári na SK reálne posielajú správy (e-mail, CD, papier, pacient):** pre onkológiu **nevieme**, nenašiel som verejný zdroj. Jediné tvrdé: špecialista dnes zvyčajne vidí cudzie dáta len cez výmenný lístok alebo čipový občiansky preukaz pacienta (ZAP, jún 2026 [čiastočne]). **NOÚ zavádza koordinátorov od 9/2026**, financovanie je otvorené; žiadny IT systém sa nespomína [čiastočne: StartitUp 3. 9. 2026].
15. **Čo z toho plynie [odhad]:** na Slovensku sa k dátam z externej appky **dá dostať len cez partnera, ktorý už má osvedčenie** (Asseco, STAPRO, PROSOFT, CGM…), alebo cez vstup od samotného koordinátora (PDF, správy). Priame napojenie na eZdravie nie je pre tím na hackathone dosiahnuteľné (12 mesiacov, zákonná oprávnenosť). Do prezentácie patrí: „adaptér na vstupe + výstup vo FHIR + slot na budúce eZdravie/RISEZ/EHDS". Zákazník, ktorý by platil za koordinátorský nástroj, na SK zatiaľ **nie je**.

---

## 1. Služby eZdravia a čo z nich môže koordinátor reálne dostať

Zdroj tabuľky: NCZI Roadmapa 2024 (28 strán, dátum v dokumente nie je; názov „Roadmapa 2024"), zákon 153/2013 § 5 a 6 (znenie účinné od 1. 8. 2026), IM eVyšetrenie v7 (verzia z 24. 2. 2022), prezentácia NCZI (aktualizácia 22. 3. 2024) [overené].

| Služba | Čo to je | Čo z toho môže byť pre koordinátora cenné | Obmedzenia |
|---|---|---|---|
| **EZKO / Národný portál zdravia** (npz.sk) | Pacientov pohľad: prihlásenie cez občiansky preukaz s čipom (eID). Vidí predpísané lieky, výkony, laboratórne výsledky, očkovania. | Cesta „cez pacienta" (pozri § 5) | Či sa dá obsah stiahnuť/exportovať, **nevieme**. |
| **eVyšetrenie** | Záznam z odborného vyšetrenia, **prepúšťacia správa**, zobrazovacie vyšetrenie, **výmenný lístok** (odporúčanie) alebo žiadanka na zobrazovanie. | História vyšetrení, závery, diagnózy (MKCH-10), prepúšťacie správy | Obsah je z veľkej časti **voľný text**. **Snímky sa neposielajú**, len textový popis a prípadný smerník. Podpisuje ePZP. |
| **Pacientsky sumár** (zákon § 6) | Výber základných údajov: zdravotné problémy, **lieková anamnéza**, varovania, kontakty, ICE kontakt, ošetrujúci lekár. | Rýchly prehľad „kto je pacient" | Praktik má prístup automaticky; ostatní len v rozsahu zákona. |
| **eLab** (eLaboratórium) | Elektronické laboratórne **žiadanky** a **výsledky**; laboratórne položky sú kódované číselníkom odvodeným od **LOINC** (od 2019). Žiadanky nasadené 9/2023. | Laboratórne výsledky pod jedným profilom | Overenie eLab majú len 6 AIS/NIS (§ 4); výsledky z laboratórií majú povinnosť až od **1. 7. 2027**. |
| **eRecept + modul podaných liekov (MPD)** | Predpisy, výdaj, podané lieky, kontrola interakcií. (V EÚ sa tomu hovorí ePrescription / ePreskripcia.) | Zoznam liekov a kedy boli predpísané | Čo presne z dávkovania/trvania je dostupné, **nevieme**. |
| **eObjednanie** | Rezervácie na doplnkové ordinačné hodiny. | Nie veľmi | Pre lekárov **dobrovoľné**. |
| **eOčkovanie, ePN/eDPN, HoN, eOČR, eTK, ePotvrdenia** | Očkovanie, práceneschopnosť, hlásenie o narodení, nové služby od **1. 8. 2026** (povinné až od 1. 2. 2027). | Takmer nič pre onkológiu | [čiastočne: SITA 30. 7. 2026] |
| **Notifikácie, ečakačky** | Schránka správ zdravotníckeho pracovníka; čakacie listiny cez poisťovne. | Čakacie listiny pre plánované zákroky | Cez poisťovne. |
| **JRÚZ** | Registre a číselníky (poskytovatelia, pracovníci, pacienti). | Overenie, kto je kto | Pre pripojené systémy. |

**Ďalšie fakty o povahe dát:**
- Dáta v eZdraví sú **pseudonymizované (K+D)**: v úložisku záznamov o zdraví nie je identifikátor osoby, len bezvýznamové číslo. NCZI na otázku uchádzača v súťaži (jún 2025) odpovedalo, že služba na pseudonymizáciu ani na jej spätné zrušenie neexistuje [čiastočne: vysvetlenie súťažných podkladov č. 31, Josephine].
- **EZZ je možné priradiť k „epizóde"** (nový pojem v zákone: záznam, ktorý prepája záznamy k tej istej chorobe) a zákon (1. 8. 2026) pozná aj „záznam o plánovaných a navrhnutých vyšetreniach" [overené: zákon § 2 ods. 32, § 5 ods. 1 a ods. 2]. Pre onkologickú „cestu pacienta" je to užitočný stavebný kameň; **či ho systémy reálne používajú, nevieme**.
- **Pacient si môže zapísať „preferovaného zdravotníckeho pracovníka"** (v manuáli je príklad „onkologickí pacienti budú evidovať ošetrujúceho onkológa") [overené: IM eVyšetrenie v7].
- Vzorové počty (NCZI, aktualizácia 22. 3. 2024): 379 mil. predpísaných a 417 mil. vydaných receptov, 154,6 mil. záznamov z odborných vyšetrení, 2,8 mil. prepúšťacích správ [overené]. Roadmapa 2024: **19 680 poskytovateľov s 46 180 systémami** integrovanými na NZIS (inštalácie, nie výrobcovia) [overené].

---

## 2. Rozhrania a dostupnosť pre tretie strany

### 2.1 Aké rozhranie eZdravie dnes má

| Otázka | Zistenie | Istota |
|---|---|---|
| Protokol | **SOAP 1.2**, WS-Security, XML Signature/Encryption, bezpečnostný token SAML z ADFS (`sts-zpr.infra.npz.sk`); WSDL: `IeHealthService`, `IeHealthSyncService`, `IeHealthServiceReadResponseManager` (+ Typed) | [overené: IM 4.3.3, dokument „Volanie služieb 3.0.17"] |
| Formát dát | XML podľa **EN 13606** (archetypy, súbory `.adl` a `.xsd` v balíku IM: 239 XSD, 81 ADL, 9 WSDL), správa „eHtalk" | [overené: zoznam súborov v IM 4.3.3] |
| HL7 / CDA / FHIR / IHE v rozhraní | V dokumente „Volanie služieb 3.0.17" **0 zmienok** HL7, FHIR, IHE, DICOM (EN 13606 13×); v „IM eVyšetrenie v7" **0 zmienok** HL7, CDA, FHIR, IHE (EN 13606 163×). Čítal som len tieto dva dokumenty z balíka | [overené] |
| Kde sú technické podrobnosti | **Integračný manuál (IM)** na IPo (za prihlásením). Verzia **4.3.3 z 8. 8. 2023** je verejne prístupná ako príloha súťaže OnkoAsist na Josephine (107 MB ZIP) | [overené – web] |
| Obmedzenia správania | Načítavať max. **15 záznamov** v jednom XML; logovať celú komunikáciu 6 mesiacov; fronta pri výpadku; používateľ nesmie vedieť vypnúť synchronizáciu | [overené: Metodika 7.1, pravidlá 1–23] |
| FHIR na SK | Roadmapa 2024: nové API Gateway má vedieť transformovať dáta medzi formátmi, „napr. EN13606 ↔ FHIR/openEHR", plus IHE. Súťaž na „elab gateway" (2020) žiadala aj FHIR, ale bola **zrušená** | [overené: Roadmapa 2024; Josephine tender 6004] |
| Národný FHIR guide | Simplifier (bez dátumu): FHIR je na SK „v ranom štádiu", **žiadny národný základný implementačný guide, žiadny národný terminologický server a ani sa nechystá** | [čiastočne: bez dátumu] |
| HL7 pri cezhraničnej výmene | Brána MyHealth@EU (OpenNCP) komunikuje v HL7; podľa uchádzača v súťaži (jún 2025) sa dáta z ISO 13606 prekladajú | [čiastočne: tvrdenie uchádzača; Výročná správa 2025 potvrdzuje len zriadenie Open NCP a testy] |

**Čo to znamená slovami:** eZdravie nie je „webové API s JSON", ale podnikový SOAP systém z rokov 2010–2013 (Windows Server 2008 R2, BizTalk 2010, SQL 2008; podpora výrobcov skončila 31. 12. 2019) [overené: Roadmapa 2024]. NCZI to samo priznáva: „nízka miera inovácie, nesúlad s najnovšími štandardmi, bezpečnostné problémy, nestabilita a výpadky".

### 2.2 Kto a ako sa smie pripojiť (proces overenia zhody)

Zdroje: Metodika integrácie IS s NZIS v7.1 (zverejnená 28. 4. 2023, účinná 28. 6. 2023), zákon 153/2013 § 11, stránky ezdravotnictvo.sk (čítané 16. 10. 2026).

1. **Analýza rozsahu** s NCZI vrátane „**legislatívneho preskúmania žiadateľa a oprávnenosti nároku na využívanie služieb NZIS**" a technickej dokumentácie (typ IS, architektúra, moduly, platforma) [overené].
2. **Žiadosť o prístup na IPo.** Len podpísaná žiadosť (pošta/e-mail na `ispzs@nczisk.sk`); NCZI pošle prihlasovacie údaje a čipovú kartu s čítačkou [overené – web].
3. **Testovacie karty a fiktívne subjekty** (Specimen = pacient, Avatar = zdravotník) sa požičiavajú **bezplatne**: do 3 kariet eID a 2 čítačiek na žiadateľa [overené].
4. **Testovacie prostredie (PREPROD)**: pripojenie cez Cisco VPN alebo pevnú IP adresu [overené].
5. **Integrácia + (ak treba) napojenie na poisťovne**, potom **žiadosť o overenie zhody** (aj cez ÚPVS). **Na integráciu je 12 mesiacov**; kto nepodá žiadosť, môže byť vyradený [overené].
6. **Testovanie v sídle NCZI**: NCZI určí termín do 30 dní, rozhodne **do 90 dní** od žiadosti; ak splní, dostane „Osvedčenie o zhode" so zoznamom procesných scenárov; inak „Rozhodnutie o zamietnutí" [overené: zákon § 11 ods. 2; ezdravotnictvo.sk].
7. **Kapacita:** stránka o overení zhody uvádza max. 2 overenia denne celkom (eRecept 2, eVyšetrenie 2, eLab 1, eObjednanie 2); stránka s termínmi z 19.–20. 10. 2026 uvádza „3 výrobcovia IS PZS" za deň (údaje sa mierne líšia). Najbližšie termíny: **19.–20. 10. a 21. 10. 2026** v Bratislave; záujem treba vopred konzultovať s integračnými manažérmi [overené – web].
8. **Poplatok a presná dĺžka v praxi:** **nevieme** (nikde uvedené).

**Kto môže žiadať osvedčenie (zákon § 11 ods. 1):** výrobca IS poskytovateľa; zdravotná poisťovňa; úrad pre dohľad; výrobca IS alebo subjekt z § 5 ods. 6 písm. j)–o), s)–y), ab) (armáda, polícia, Sociálna poisťovňa, ÚPSVaR, znalci, inšpektori ŠÚKL, úrady verejného zdravotníctva…); výrobca IS, ktorý integruje certifikovaný merací prístroj. **Aplikácia pre koordinátora ako taká v zozname nie je** [overené]. Dve zaujímavé výnimky: pre „informačný systém na objednávanie pacientov" platia **ľahšie požiadavky** (§ 11 ods. 4: bez zdokonaleného podpisu, bez ePZP, bez identifikátorov a bez testovacích kritérií) a pre IS s certifikovaným meracím prístrojom tiež (bez podpisu, ePZP a identifikátora dokumentu); či by sa dala podobná „ľahká" cesta použiť pre iný typ appky, **nevieme**.

**Ako vyzerá „iná organizácia" čítajúca eZdravie (najbližší precedens pre tretiu stranu):** v zozname osvedčení je zvlášť zoznam organizácií mimo poskytovateľov, napr. **Sociálna poisťovňa, ÚPSVaR, VšZP, Dôvera, Union**. Čítajú cez ten istý SOAP s krátkym zoznamom služieb (napr. `VyhladajZaznamyOVysetreniach_v7`, `DajZaznamOVysetreni_v7`, `DajPacientskySumar_v3`, `VyhladajLabVysetreniaPacienta_v5`, `DajLaboratornyVysledok_v5`, `VyhladajMedikacneZaznamy`) a majú **Dohodu o integračnom zámere (DIZ)** s právnym základom [overené: zoznam osvedčení, hárok „DIZ – Iná organizácia"; Metodika 7.1].

### 2.3 Čo sľubuje RISEZ (a prečo to nepomôže „zajtra")

- Cieľ projektu: „**Bezpečné otvorenie systému** implementáciou nových služieb, platforiem a API", „nové API pre tretie strany z pohľadu občana a výrobcov IS PZS", štandardy IHE/FHIR, **proces certifikácie tretích strán s možnosťou zápisu do eZdravia**, API pre mobilné aplikácie a medicínske prístroje, štruktúrovaný zápis „TOP 30 klinických dokumentov", NCZI ako dátový hub pre poisťovne [overené: Roadmapa 2024].
- Dodávateľ: **DATALAN, a.s.** (podriadení: TEMPEST, Alanata, Ensogate, SOFTIP; 60 % subdodávky), ponuka **17 534 145 €**, zmluva č. 24–25/2024 uzatvorená **15. 5. 2024**; financované z Plánu obnovy [overené: TED 266762-2026, 20. 4. 2026].
- Posun: dodatok č. 5 (19. 3. 2026) **predĺžil harmonogram odovzdania diela** a podporu starého eZdravia z 12 na 19 mesiacov. Nový termín **nevieme**; NCZI sa na otázku o míľnikoch na jar 2025 nevyjadrilo [overené: TED; čiastočne: Zdravotnícky denník 26. 3. 2025].
- NCZI v 2025 komunikovalo RISEZ voči výrobcom, „aby sa vedeli pripraviť na nastávajúce zmeny" [overené: Výročná správa 2025].
- Plán „Systému výmeny údajov" (typ X-Road, uzol „box" u každej organizácie) je v Roadmape 2024 ako budúci stav [overené, ale ako plán].

---

## 3. Povinnosti lekárov: eZapisovanie od 1. 7. 2026

**Čo sa mení (NCZI manuál „eZapisovanie", aktualizovaný 11. 9. 2026, a tlačová správa z 26. 5. 2026) [overené]:**
- Novela zákona 153/2013 (zákon 344/2025 Z. z.) **prepája každý elektronický zdravotný záznam s jedinečným ID**; informačný systém poskytovateľa ho **vloží do zúčtovacej dávky pre poisťovňu**. Zápis výkonu cez eZdravie sa tak stáva **podmienkou úhrady**.
- Povinnosť zapisovať do eZdravia platí **od roku 2018**; novinka je v prepojení na peniaze.
- Poskytovateľ musí mať: platnú kartu ePZP, **IS s aktuálnou verziou a platným osvedčením o zhode**, aktualizované pracovnoprávne vzťahy v registri. Má si u dodávateľa overiť, že IS vie správne zapisovať záznamy a spracovať ID EZZ.
- Ministerstvo: bez sankcií „v zmysle trestania", „bude tam priestor na opravu" (minister Šaško); jednoznačnú ochrannú lehotu článok neuvádza [čiastočne: noviny.sk 2. 6. 2026].
- Manuál uvádza: „Informácie v tomto materiáli nie sú právne záväzné a môžu podliehať zmenám."

**Harmonogram podľa typu starostlivosti a odbornosti (zhrnutie z manuálu):**

| Kedy | Kto / čo |
|---|---|
| **1. 7. 2026** | Všeobecná ambulantná starostlivosť; ambulantná pohotovosť; jednodňová starostlivosť; **veľká väčšina odborností špecializovanej ambulantnej starostlivosti (zoznam kódov vrátane 019 klinická onkológia a 043 radiačná onkológia)**; záznam o prepustení z ústavnej starostlivosti (vrátane kódov 019, 043); kúpeľná starostlivosť |
| **1. 1. 2027** | Zvyšok ŠAS (kódy 141, 143, 144, 241, 571, 931); stacionáre |
| **1. 7. 2027** | **Laboratórne pracoviská (výsledky)**, **zobrazovacie pracoviská**, rehabilitácia; **záznam o prijatí do ústavnej starostlivosti**; domáca ošetrovateľská starostlivosť a hospic |
| Nevzťahuje sa | Očná optika, lekárne a výdajne (iná cesta cez dispenzačné záznamy), dopravná a záchranná služba |

Kódy odborností som overil v číselníku NCZI (súbor 39.xls z 6/2026): **019 = klinická onkológia, 043 = radiačná onkológia, 079 = onkológia v otorinolaryngológii, 229 = onkológia v gynekológii, 319 = onkológia v chirurgii, 322 = onkológia v urológii, 329 = pediatrická hematológia a onkológia**. Všetkých týchto 7 kódov je v zozname na **1. 7. 2026** (ambulantný záznam aj záznam o prepustení); **záznam o prijatí do ústavnej starostlivosti** majú tie isté odbornosti až **1. 7. 2027**. Kódy 219 (detská onkológia) a 350 (onkológia vo vnútornom lekárstve) som v harmonograme nenašiel [overené: číselník + harmonogram z 11. 9. 2026].

**Dôležité pre dátový obraz:**
- **Zapisovať EZZ môže zatiaľ iba lekár** (nie sestra); tam, kde to tak je, povinnosť presunuli na neskôr [overené: manuál NCZI].
- Povinný je **jeden „najkomplexnejší" záznam na typ starostlivosti** a ID sa uvedie na všetkých riadkoch dávky; manuál píše, že cieľom nie je, aby poisťovne mali prehľad o všetkých EZZ [overené]. To je zmena kvantity záznamov, nie zaručená **úplnosť klinického obsahu**.
- Výnimky (novorodenec pod rodným číslom matky, utajený pôrod, nepoistení, vybraní cudzinci) sa riešia vyhláškou, ktorá je v legislatívnom procese [overené].
- Hlásenia do **Národného onkologického registra** (NOR) idú inou cestou: od 2023 dve hlásenia (DGO od klinika, PAT od patológa) **cez webovú aplikáciu ISZI do 30 dní**, s priloženými zdrojovými dokumentmi (PDF, DOC, JPG, TXT…) [overené: Metodický pokyn NOR pre rok 2025]. NOR teda dostáva dokumenty aj ako súbory, nie len štruktúrované polia.

---

## 4. Výrobcovia IS na Slovensku (kto má osvedčenie)

Zdroj: oficiálny zoznam „Zoznam vydaných osvedčení" NCZI (XLSX, aktualizácia **16. 10. 2026**), ezdravotnictvo.sk, Výročná správa NCZI 2025 [overené]. Výročná správa: v roku 2025 pôsobilo **71 samostatných IS** (75 vrátane poisťovní), NCZI overilo **116 implementácií služieb u 45 rôznych IS**.

**Legenda stĺpcov:** eVyš = najvyššia overená verzia služby eVyšetrenie (V9 je najvyššia, NOK = neoverené); eLab = elektronické laboratórne žiadanky; eObj = eObjednanie.

### 4.1 Systémy pre ambulancie a nemocnice (AIS/NIS)

| Výrobca (produkt) | Typ | eVyš | eLab | eObj |
|---|---|---|---|---|
| ADASOFT (Doctus, Clinicom, Ordinis) | amb./ústavné | V7–V8 | NOK | – |
| **Asseco Central Europe (XANTA NIS)** | amb./ústavné | V7 | NOK | – |
| **CompuGroup Medical Slovensko (ADAM 3.0)** | amb./zubné/ústavné | V8 | **V3** | V1 |
| **STAPRO Slovensko (NIS MEDEA, Fons Enterprise)** | amb./ústavné | V8 | **V3** | – |
| **PROSOFT Košice (Promis Ambis, Promis Lozis, NG HIS)** | amb./ústavné | V8 | NOK | V1 (Ambis) |
| **LCS Electronics (KNIS)** | amb./ústavné/labor. | V8 | V2 | V1 |
| **MediCom Software (Medicom)** | amb./zubné/ústavné | V8 | **V3** | V1 |
| Medical Systems (IKIS) | amb./ústavné | V9 | NOK | – |
| DATASOFT (Ambulancia pre Windows) | amb./ústavné/kúpele | V8 | NOK | – |
| Sator IT Consulting (EuCliD 5) | amb. | V8 | V3 | – |
| Capitol Development (MEDI FLOW), CURO, MEDDI hub (MEDDI MD), SPIRE LIFE SOLUTION (ambee), SHAREX-IN (Doctor IN), MEDIXON (Dr. Rex), PEHAcom, SOFTPROGRES (WinAmbulancia), VYPTECH, Petra Soft (PAEON), ProDos (Nefris), AXON PRO, NávštevaLekara (HealthPro), Počítače a Programovanie (SOLw)… | prevažne ambulancie | V6–V8 | NOK | niektoré V1 |
| Vlastné systémy nemocníc a ústavov: **FN Trenčín (MEDIS)**, FNsP Nové Zámky (Ambis 2), NEDÚ | amb./ústavné | V8 / NOK / V8 | NOK | – |

Poznámky:
- Zo 36 systémov pre ambulancie a nemocnice má **32 overené eVyšetrenie, 6 eLab** (CompuGroup, STAPRO ×2, MediCom, LCS, Sator) [overené: moje počty z XLSX].
- **NG HIS** je v zozname osvedčení vedený pod **PROSOFT Košice**, zatiaľ čo Asseco ho predáva ako vlastný produkt (stránka Asseco) a vo FN Nitra mal zmluvu Asseco, no systém údajne dodáva Prosoft [čiastočne: Denník N a CRZ cez vyhľadávač; vzťah firiem **nevieme**].
- Vo verejnom zozname je aj ICZ Slovakia „Doctus" z roku 2017–18 (NCZI „conecttathon"); dnes je Doctus pod ADASOFT. Ako spolu súvisia, **nevieme**.

### 4.2 Laboratórne systémy (LIS)

CONA (CONALAB), Green energy estate (LIS), Prodata Praha (WinZis), PROSOFT (Laboratorium), Realtime (LIA pathology), STAPRO (Fons Openlims), Unilabs Slovensko (AMNZIS), ADASOFT (Ordinis), LCS (KNIS). Väčšina má eLab laboratórnu doménu overenú na V1–V3 [overené].

### 4.3 Trh a závislosť od dodávateľa
- **Trhové podiely nevieme.** V českých poznámkach sme mali „CGM a MEDaX ~70 %"; pre SR som **nenašiel žiadny porovnateľný zdroj** (výrobcovia sa chvália „stovkami ambulancií" – CURO, marketing).
- **NIS NOÚ, OÚSA ani VOÚ som nenašiel.** Jediný náznak (zmluva VOÚ s TatraMed Software, TMS-2018-71 na „servisné služby") nehovorí, aký je to systém [čiastočne, **nevieme**]. Zistiť sa to dá v Centrálnom registri zmlúv (crz.gov.sk) alebo spýtať sa priamo ústavov.
- Dodávateľ je pre NCZI aj hlavný kanál: **pri zavádzaní eZapisovania musí IS poskytovateľa upraviť jeho výrobca** (manuál NCZI). Poskytovateľ nemá nástroj, ako to obísť.

---

## 5. Cesty k dátam na Slovensku (od najrealistickejšej) [odhad, nie fakt]

| # | Cesta | Čo musí platiť | Realistickosť pre nás |
|---|---|---|---|
| A | **Cez partnera, ktorý je výrobcom certifikovaného IS** (Asseco CE, STAPRO, PROSOFT, CGM, MediCom, LCS) | Ich zmluva s nemocnicou/KOC; ich ochota; DIZ nie je potrebná, lebo nie sme „tretia strana" ku eZdraviu | **Najlepšia.** Rovnaká myšlienka ako OnkoAsist („služba v existujúcom IS PZS"). |
| B | **Vstup od koordinátora** (PDF, správy, Word, e-mail, skeny), ktoré spracujeme/štruktúrujeme | Koordinátor má dokumenty; GDPR a súhlas | **Funguje bez čakania na štát**; rovnaká logika ako v ČR (pozri g1). |
| C | **Cez pacienta** (zdieľanie z EZKO) | Zákon § 5 ods. 8 a 11: pacient môže udeliť súhlas lekárovi/PZS číselným kódom alebo „inej osobe" dočasným identifikátorom z npz.sk | Právny základ existuje, **technický kanál pre externú appku nevidno** [overené text zákona; nevieme technicky]. |
| D | **Vlastná integrácia na eZdravie** | Oprávnenosť podľa § 11 + 12 mesiacov + OvZh | **Pre hackathon nie.** Pre dlhodobý plán až po RISEZ. |
| E | **Otvorené/agregované dáta** (NOR, štatistiky NCZI) | verejné | Len anonymné agregáty, **nie profil pacienta**. |

**Zákonný detail pre cestu A a „koordinátora"** (výklad, nie právne stanovisko):
- Ošetrujúca **sestra** (aj pôrodná asistentka, praktická sestra) má po zadaní rodného čísla prístup k širokému rozsahu záznamov (§ 5 ods. 6 písm. g).
- **Administratívny pracovník určený poskytovateľom** má prístup len k **žiadankám a odporúčaniam** (§ 5 ods. 6 písm. z).
- **Ošetrujúci lekár** špecialista má rozsiahly prístup, ak pacienta **prevzal** do starostlivosti potvrdením odporúčania alebo ak je pacient u neho **dispenzarizovaný** (po dobu dispenzarizácie) (§ 5 ods. 6 písm. b).
- Prístup je vždy cez **IS PZS s ePZP** a každý prístup sa loguje v EZK (§ 5 ods. 10). Koordinátor, ktorý by mal vlastný program mimo IS poskytovateľa, by sa legálne nedostal k ničomu.
- NCZI v Roadmape 2024 samo píše, že pre OnkoAsist „bude potrebné **legislatívne upraviť** aj formu zdieľania zdravotnej dokumentácie" a že spustilo legislatívnu analýzu [overené]; zákon 344/2025 (účinný postupne 2026) priniesol „prepracovanie prístupov zdravotníckych pracovníkov do eZK" a nové záznamy [overené: Výročná správa 2025].

---

## 6. OnkoAsist: čo mal integrovať a v akom je stave

**Čo to je:** „OnkoAsist – manažment cesty pacienta od nálezu po začiatok liečby". Systém NCZI nad eZdravím. Cieľ: zlepšiť a skrátiť cestu od podozrenia po liečbu pre **3 diagnózy: C34 pľúca, C18–C21 hrubé črevo/konečník, C50 prsník**, a znížiť úmrtnosť zo 350 na 300 na 100 000 obyvateľov ročne [overené: Výročná správa NCZI 2025].

**Stav a dodávateľ [overené]:**
- Zmluva o poskytnutí NFP podpísaná **9/2024**, program Slovensko. Zmluva o dielo s dodávateľom je **účinná od 12/2025** (Výročná správa 2025).
- Verejné obstarávanie OA-2022 (vyhlásené 4./5. 1. 2023, odhad 10 934 810 € bez DPH): úspešný uchádzač **Asseco Central Europe, a. s.** (IČO 35760419), **vysúťažená hodnota 6 159 756 € bez DPH**. Vylúčení boli ADASTRA, InterWay a GlobalTel. Subdodávatelia: NESS KE (25 %, biznis procesy a integračné rozhrania) a Asseco CE Praha (5 %, architekt a analytik; help desk). Zmluvy (dielo, podpora a rozvoj, dodatok č. 1) nahraté na Josephine **19. 11. 2025**, správa o zákazke z **25. 11. 2025** [Správa o zákazke, Josephine, tender 35645].
- **Staršie údaje sa líšia a sú prekonané:** Red Flags (Slovensko.Digital, 5. 5. 2026) stále píše „prebieha verejné obstarávanie" a rozpočet 7,2 mil. € + 0,9 mil. € SLA na 8 rokov s DPH [overené – web]; TASR 19. 5. 2023 uvádza odhad takmer 11 mil. € bez DPH. Ktoré číslo zodpovedá ZoD (16,6 MB, nečítal som), **nevieme**.
- Tým je potvrdené, že **Asseco CE je dodávateľom OnkoAsistu**. V našich poznámkach to bolo [nepodložené]. Čísla z keynote Asseco sú teraz overené v NCZI dokumente (§ 0 bod 12).

**Čo má OnkoAsist integrovať (Roadmapa 2024; Projektový zámer v1.82 z 09/2021):** [overené]
- **Existujúce moduly eZdravia** (eVyšetrenie, výmenný lístok, objednanie, EZKO, IAM pre prihlásenie a roly).
- **VNA archív snímok** (projekt NAOV; v 2025 stále v „iniciačnej fáze", softvérová súťaž prebieha) – ak bude k dispozícii.
- **Digitálna patológia** (digitalizované protokoly a žiadanky) a **Digitálna biobanka** (anonymizované dáta pre výskum) – ak budú k dispozícii.
- **Národný onkologický register** (prenos štruktúry do ISZI – modul NOR).
- **IS poisťovní** (nevizuálne služby S2S na dohľad nad pacientom).
- **Projekty MZ SR s umelou inteligenciou** (asistovaná interpretácia obrazu, digitálna patológia, rádiológia) na úrovni konzumenta výstupov.
- **Používatelia a vstup:** lekár cez **svoj existujúci IS PZS** (ten sa rozšíri a znova certifikuje); praktik, špecialista, mamografické pracoviská sa pripájajú „integráciou s existujúcimi IS PZS"; pracoviská patológie a genetiky cez Digitálnu biobanku.
- **Moduly:** Dotazník (pacient–lekár), Klinické dáta (onkologický sumár, konsolidácia údajov), Komunikácia (objednanie, fronta, notifikácie, čakacie doby/KPI), **DTŠ** (diagnosticko-terapeutické štandardy ESMO + NCCN), Administrácia (IAM).
- **Predpoklad:** OnkoAsist závisí od **RISEZ** („bez RISEZ by nebolo možné naplniť legislatívne požiadavky") – a RISEZ mešká. Z toho plynie riziko: **kľúčové prepojenia sa nemôžu začať naplno, kým nie sú nové služby eZdravia** [overené text; riziko = môj úsudok].

**Čo NCZI samo písalo o problémoch (2021–22), ktoré zodpovedajú našej vízii [overené: Projektový zámer v1.82]:**
- „Neexistujúca technologická podpora pre konsolidáciu dát o pacientovi pre účely multidisciplinárneho posudzovania."
- „Príprava dát o pacientovi na konziliárne zasadnutie je administratívna úloha… dáta pripravujú odborní pracovníci, ktorí by mohli tento čas venovať diagnostike a liečbe."
- Žiadny na SK certifikovaný AIS neposkytuje podporu rozhodovania podľa štandardných postupov.
- Lekári (2021) využívali z eZdravia hlavne e-recepty a lekárske správy „v obmedzenej miere"; e-výmenné lístky a e-objednávanie boli „prakticky nevyužívané", rovnako ako zdieľanie laboratórnych výsledkov. Ošetrujúci lekár ŠAS cez rodné číslo „prakticky nemal prístup k žiadnym zdravotným dátam".

**Kritika (Red Flags 5. 5. 2026) [overené – web]:** chýba analýza reformy, KPI sú ťažko overiteľné, závislosť od iných projektov a od zmeny legislatívy, riziko duplicity s eZdravím, odporúčanie najprv pilot/proof of concept, prínosy „nereálne vysoké".

**Dôležité pre našu pozíciu [odhad]:** OnkoAsist sa sústreďuje na **skorú fázu** (podozrenie → liečba), 3 diagnózy, a má byť v systémoch lekárov. Nerieši výslovne koordinátora KOC ani výstup „podklady pre konzílium s pôvodom každého údaja". Medzera je teda otvorená, ale **konkuruje „štátnemu" riešeniu**, ktoré by v budúcnosti mohlo časť našej hodnoty pokryť.

---

## 7. EHDS (európsky priestor pre zdravotné údaje) a Slovensko

**Čo hovorí nariadenie (EÚ) 2025/327 (Úradný vestník 5. 3. 2025; text prečítaný) [overené]:**
- Platí od **26. 3. 2027**.
- Pravidlá o primárnom použití (články 3–15 a súvisiace) sa uplatňujú: pre **pacientsky sumár, e-recepty, výdaje** od **26. 3. 2029**; pre **zobrazovacie vyšetrenia a správy, laboratórne výsledky, prepúšťacie správy** od **26. 3. 2031**.
- Požiadavky na **výrobcov systémov EHR** (články 25–27) sa viažu na tie isté dátumy podľa kategórie dát, ktoré systém spracúva (2029 pre sumár a recepty, 2031 pre snímky, laboratórne výsledky a prepúšťacie správy). Kapitola III pre systémy vyvíjané a používané priamo v zdravotníckom zariadení a pre EHR „ako službu" platí až od **26. 3. 2031**. Kapitola o sekundárnom použití od **26. 3. 2029** (niektoré články 2027, 2031, 2035).
- Nariadenie hovorí o „**európskom formáte výmeny elektronických zdravotných záznamov**"; **FHIR ani HL7 v texte nie sú**, detaily určia vykonávacie akty. To, že „pôjde o FHIR", sme počuli v pre-hack prednáškach (Kružík, `02-prehack-prednasky.md`); v texte nariadenia to nie je [overené].
- Členské štáty môžu zákonom pridať ďalšie kategórie dát (napr. onkologické) [overené: čl. 14 ods. 1].

**Slovensko [overené: Výročná správa NCZI 2025; stránka NCZI o NCP]:**
- SR **zatiaľ nie je zapojená do MyHealth@EU**. NCZI má od 2023 priamy grant EU4Health; projekt **SK-NCPeH** (pacientsky sumár a e-recept) trvá podľa stránky NCZI **10/2023 – 9/2026**, celkový grant 2 780 699 € (podiel NCZI 695 174,78 €); Výročná správa 2025 hovorí, že „bude pokračovať ešte niekoľko rokov" (rozdiel v zdrojoch).
- V 2025 zriadený prístupový bod **Open NCP** a portál NCP; úspešné predprodukčné testy **pacientskeho sumára a ePreskripcie s ČR, Cyprom, Talianskom a Chorvátskom**. (Tzn. s ČR už prebieha testovacia výmena.)
- **HeDAB-SK** (od 1/2024): informačný systém na posudzovanie žiadostí o sekundárne použitie dát, katalóg metadát a brána do HealthData@EU.
- NCZI je členom SNOMED International; položky pacientskeho sumára sa pri cezhraničnom prenose kódujú v SNOMED CT.
- NCZI sa zúčastňuje na Xt-EHR, TEHDAS2 a Orion a pomáhalo slovenskému vyjednávaciemu tímu.
- Slovenský zákon na vykonanie EHDS (orgán pre digitálne zdravie a pod.) **som nenašiel**.

**Čo to znamená pre koordinátorský nástroj [odhad]:** pre onkológiu sú dôležité **laboratórne výsledky, snímky a prepúšťacie správy, ktoré prídu na rad až v 2031**. EHDS teda nepomôže do 5 rokov; pomôže najskôr pri **pacientskom sumári a receptoch (2029)**.

---

## 8. Ako sa dáta medzi lekármi na SK reálne presúvajú (e-mail, CD, papier)?

- **Pre onkológiu na SK som nenašiel žiadny verejný zdroj o kanáloch** (e-mail, CD, pošta, pacient). Toto zostáva **nevieme** (rovnako ako v `raw-sk-system.md`).
- Čo je doložené nepriamo:
  - Špecialista cez rodné číslo „prakticky nemá prístup k žiadnym zdravotným dátam pacienta"; dostane sa k nim cez akceptovaný elektronický výmenný lístok alebo čipový občiansky preukaz pacienta (stav 2021) [overené: Projektový zámer OnkoAsist].
  - Aktéri onkologickej cesty pracujú v komerčných ambulantných a nemocničných IS, ktoré sú pripojené na eZdravie, no lekári z neho používajú hlavne e-recepty a nahrávanie lekárskych správ „v obmedzenej miere" (stav 2021) [overené: tamže].
  - ZAP (Asociácia ambulantných poskytovateľov) v 6/2026: špecialisti majú obmedzený prístup k dátam, pacient musí priniesť odporúčanie alebo vložiť čipový preukaz do druhej čítačky [čiastočne: noviny.sk 2. 6. 2026].
  - Pri NOR hlásení sa zdrojová dokumentácia posiela ako **súbory (PDF/DOC/JPG…)** [overené].
  - Zobrazovanie: snímky ostávajú v PACS poskytovateľa, do eZdravia ide len text; **NAOV** (národný archív snímok) je v iniciačnej fáze [overené].
- **Koordinátor:** oficiálny štátny koordinátor na SK nie je; NOÚ ich zavádza od 9/2026, financovanie je otvorené [čiastočne: StartitUp 3. 9. 2026]. VšZP v pilote platí MDT od 7. do 12. 2026 [čiastočne].
- Otázku, **akým kanálom si koordinátori v KOC reálne posielajú podklady**, treba položiť NOÚ/OÚSA/VOÚ alebo koordinátorom z NOÚ.

---

## 9. Čo z toho plynie pre nás [odhad, nie fakt]

1. **Nesľubovať „napojenie na eZdravie".** Právne ani technicky to pre tím mimo certifikovaného IS poskytovateľa nie je otvorené; RISEZ meškajúci bez termínu to nemení.
2. **Slovenská verzia príbehu:** „Dáta, ktoré už štát zbiera (eZdravie, onkologický register, OnkoAsist), sú bohaté a **zamknuté**; prístupné sú len cez certifikované systémy lekárov. Preto náš nástroj nedáva lekárom novú appku, ale **berie podklady tam, kde ich koordinátor reálne dostane**, a pripravuje ich vo FHIR tak, aby sa dali napojiť na eZdravie/RISEZ/EHDS, keď sa otvoria."
3. **Najcennejší kontakt je Asseco CE** (dodávateľ OnkoAsistu, výrobca XANTA NIS/NG HIS, zadávateľ výzvy „MDT Copilot" na hackathone). Otázky pre nich:
   - Ako OnkoAsist číta dáta z NIS a z eZdravia (ktoré služby, aký formát, aké prístupy)?
   - Obsahuje dodávka aj prípravu podkladov na konzílium (MDT)?
   - Ako sa v OnkoAsiste rieši oprávnenie nelekára (koordinátora/sestry)?
4. **Zdroje slovenských štruktúr, ktoré môžeme použiť ako vzor** (bez pripojenia): zoznam služieb pre „inú organizáciu" (`VyhladajZaznamyOVysetreniach`, `DajPacientskySumar`, `DajLaboratornyVysledok`, `VyhladajMedikacneZaznamy`), štruktúra pacientskeho sumára (zdravotné problémy, lieková anamnéza, varovania, kontakty) a **epizóda** ako spojnica záznamov.
5. **Čo by sme nemali tvrdiť:** že vieme, ako si SK lekári posielajú správy; že FHIR je na SK štandard; že EHDS to vyrieši do pár rokov; že OnkoAsist je len „plán" (je to rozbehnutý projekt).
6. **Slovensko zatiaľ nie je zákazník.** Štandardný úhradový kód pre MDT podľa OECD/EK 2025 nie je a platený koordinátor tiež nie (pozri `raw-sk-system.md`); VšZP v pilote od 7. do 12. 2026 MDT uhrádza a NOÚ zavádza koordinátorov od 9/2026, takže sa to teprv rozbieha [čiastočne: StartitUp 3. 9. 2026].

---

## 10. Čo som nevedel overiť (nevieme) a kde to zistiť

1. **Trhové podiely AIS/NIS/LIS na SK.** Kde: NCZI (počty inštalácií podľa výrobcu), výrobcovia, ÚDZS.
2. **NIS NOÚ, OÚSA, VOÚ.** Kde: crz.gov.sk, priamo ústavy.
3. **Aktuálna úplnosť dát v eZdraví po 1. 7. 2026** (podiel lekárov zapisujúcich, objem záznamov). Verejný report `ezdravie.nczisk.sk/sk/` je dynamická stránka, nevedel som ju načítať. Kde: priamo NCZI.
4. **Termín odovzdania RISEZ a prvého API pre tretie strany.** Kde: NCZI / integrační manažéri (`ispzs@nczisk.sk`).
5. **Poplatky a skutočná dĺžka overenia zhody; či existuje „ľahká" kategória pre appku mimo IS PZS** (kľúčová otázka pre nás). Kde: integrační manažéri NCZI.
6. **Obsah IM 4.3.3 okrem dvoch dokumentov** (čítal som „Volanie služieb 3.0.17" a „IM eVyšetrenie v7"). Novšie verzie (2024–2026) nie sú verejne vidieť.
7. **Export z EZKO (PDF?) a technický kanál pre súhlas „inej osoby" (§ 5 ods. 11).** Kde: npz.sk, NCZI.
8. **Skutočné kanály výmeny dokumentov u slovenských onkológov** (e-mail, CD, papier). Kde: koordinátori NOÚ (od 9/2026), onkologické oddelenia.
9. **Rozsah dodávky OnkoAsistu podľa ZoD** (16,6 MB zmluvy, nečítaná), či zahŕňa podporu konzília (MDT) a aký je harmonogram. Kde: CRZ / Josephine (tender 35645) alebo Asseco.
10. **Vlastnícke a produktové vzťahy** ADASOFT/DATALAN/ICZ Slovakia a Asseco/PROSOFT (NG HIS). Kde: obchodný register.
11. **HL7 CDA vo vnútri SK systémov.** Nenašiel som potvrdenie okrem tvrdenia uchádzača o cezhraničnej bráne.

---

## 11. Opravy oproti našim starším poznámkam

| Kde | Pôvodné tvrdenie | Teraz |
|---|---|---|
| `raw-sk-system.md` §0 bod 4, §3.1; `g5-svet-appky.md` §8.5, §8.6 | OnkoAsist „ešte nie je dodaný", dodávateľa nevieme, Asseco ako dodávateľ [nepodložené] | **Dodávateľ je Asseco CE** (Správa o zákazke, 25. 11. 2025); zmluva o dielo účinná od 12/2025; projekt v realizačnej fáze (Výročná správa 2025). |
| `raw-sk-system.md` §3.1 | Čísla 65→44, 104→49, 59→42, ~10 % „nemožno overiť" | **Overené v NCZI Projektovom zámere** OnkoAsist (dáta MZ SR za 2019, PwC). |
| `raw-sk-system.md` §4.1 | „ePacient som nenašiel" | Nenašiel som ani teraz; zodpovedá mu **EZKO / Národný portál zdravia**. |
| `raw-sk-system.md` §4.2 | „FHIR/openEHR a IHE v pláne" | Potvrdené: **dnes SOAP + EN 13606, FHIR len plán**; RISEZ mešká (dodatok č. 5). |
| `raw-sk-system.md` §4.2 | „Povinnosť od 7/2026: poisťovňa nezaplatí" | Presnejšie: **ID EZZ v zúčtovacej dávke**, postupne podľa odbornosti, laboratóriá a zobrazovanie až **1. 7. 2027**, zapisovať môže iba lekár. |
| `raw-dataflow.md` §174 | „OnkoAsist: dnešný stav neznámy" | Pozri vyššie. |

---

## 12. Zdroje (URL a dátum), podľa istoty

**[overené] – prečítané ako text (PDF/XLSX/DOCX/zákon):**
- NCZI, **Roadmapa 2024** (dátum v dokumente nie je): https://www.nczisk.sk/Documents/projekty/ROADMAPA_2024.pdf
- NCZI, **Metodika integrácie informačného systému s NZIS, v7.1** (zverejnená 28. 4. 2023, účinná 28. 6. 2023): https://www.ezdravotnictvo.sk/documents/1005903/1007442/Metodika_integracie_informacneho_systemu.pdf
- NCZI, **Zoznam vydaných osvedčení** (aktualizácia 16. 10. 2026): https://www.ezdravotnictvo.sk/documents/1005903/1007493/Zoznam_vydane_osvedcenie_20261610.xlsx
- NCZI, **eZapisovanie – manuál pre poskytovateľov a harmonogram** (11. 9. 2026): https://www.ezdravotnictvo.sk/documents/1005903/4357298/eZapisovanie_komunikacny_manual_a_harmonogram_11_9_2026.pdf/e72c5086-77cb-a162-8806-3d75a5f6dfee?t=1789126294934
- NCZI, **tlačová správa Informačné stretnutia pre PZS k eZapisovaniu** (26. 5. 2026): https://nczisk.sk/Documents/aktuality/tlacove_spravy/2026/TS_Informacne_stretnutia_pre_PZS_26052026.pdf
- NCZI, **číselník odborností** (súbor 39.xls, uložený 2. 6. 2026): https://www.nczisk.sk/Documents/standardy/standardy_zdravotnickej_informatiky/Ciselniky/39.xls
- **Zákon 153/2013 Z. z. o NZIS**, úplné znenie účinné od 1. 8. 2026: https://static.slov-lex.sk/static/SK/ZZ/2013/153/20260801.print.html
- NCZI, **Výročná správa 2025**: https://www.nczisk.sk/Documents/download/vyrocna_sprava_NCZI_2025.pdf
- TED, **oznámenie o zmene zmluvy RISEZ 266762-2026** (OJ S 76/2026, 20. 4. 2026): https://ted.europa.eu/en/notice/266762-2026/pdf
- NCZI, **Správa o zákazke OnkoAsist** (Josephine, nahraná 25. 11. 2025): https://josephine.proebiz.com/sk/tender/35645/summary (dokument `/download/595845`)
- NCZI, **Projektový zámer OnkoAsist v1.82** (09/2021; história zmien 7.–9. 2. 2022): https://josephine.proebiz.com/sk/tender/18113/summary/download/140499
- NCZI, **Integračný manuál eZdravie 4.3.3** (8. 8. 2023, ZIP 107 MB; čítané len dokumenty „Volanie služieb 3.0.17" a „IM eVyšetrenie v7 v1.1"; zoznam súborov z hlavičky ZIP): https://josephine.proebiz.com/sk/tender/35645/summary/download/336806
- NCZI, **Metodický pokyn pre hlásenie do NOR pre rok 2025**: https://nczisk.sk/Documents/nzr/2025/MP_ZR_NOR.pdf
- NCZI, **prezentácia „eZdravie a jeho význam pre ambulancie a nemocnice"** (Óvári; údaje z 22. 3. 2024): https://www.itapa.sk/data/att/8bc/10556.8b295d.pdf
- Súťaž NCZI **„elab gateway"** (tender 6004, 2020, zrušená): https://josephine.proebiz.com/cs/tender/6004/summary/download/46330 a stránka https://josephine.proebiz.com/sk/tender/6004/summary
- Nariadenie (EÚ) **2025/327 (EHDS)**, Úradný vestník 5. 3. 2025: https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202500327

**[overené – web] – oficiálne stránky (súhrn nástroja):**
- Pre dodávateľov IS: https://www.ezdravotnictvo.sk/sk/dodavatel-is ; integrácia: https://www.ezdravotnictvo.sk/sk/-/dodavatel-integracia-informacnych-systemov ; overenie zhody: https://www.ezdravotnictvo.sk/sk/-/dodavatel-overenie-zhody-informacnych-systemov ; udalosti overenia zhody 19.–21. 10. 2026: https://www.ezdravotnictvo.sk/sk/-/overenie-zhody-19-20102026 (všetko čítané 16. 10. 2026)
- eZapisovanie: https://www.ezdravotnictvo.sk/sk/sluzby-ezapisovanie (16. 10. 2026)
- NCZI, projekt národného kontaktného bodu eHealth (nedatované): https://nczisk.sk/en/International_cooperation/EHDS/Pages/Creation-and-operation-of-the-National-Contact-Point-for-eHealth-of-the-Slovak-Republic.aspx
- Slovensko.Digital, **Red Flags: OnkoAsist** (hodnotenie 5. 5. 2026): https://redflags.slovensko.digital/projekty/8255/hodnotenie-pripravy

**[čiastočne] – novinové články a sprostredkované zdroje:**
- noviny.sk (TV JOJ), „Od júla poisťovne nezaplatia lekárom výkony bez záznamu v eZdraví" (2. 6. 2026): https://www.noviny.sk/slovensko/1216327-od-jula-poistovne-nezaplatia-lekarom-vykony-bez-zaznamu-v-ezdravi
- SITA, „NCZI od augusta spúšťa nové e-služby, povinné budú od februára 2027" (30. 7. 2026): https://sita.sk/vzdravotnictve/nczi-od-augusta-spusta-nove-e-sluzby-povinne-budu-od-februara-2027/
- Zdravotnícky denník, „Nové eZdravie? Prichádza projekt RISEZ" (26. 3. 2025): https://zdravotnickydennik.sk/2025/03/nove-ezdravie-prichadza-projekt-risez/
- SITA, „Atraktivitu eZdravia má zvýšiť projekt za milióny eur" (5. 8. 2019; prvá verzia zámeru RISEZ, 9,3 mil. €/40 mesiacov, „API rozhranie pre všetky zúčastnené strany"): https://sita.sk/vzdravotnictve/atraktivitu-ezdravia-ma-zvysit-projekt-za-miliony-eur-pribudnu-nove-sluzby-pre-lekarov-aj-pacientov/
- TASR, NCZI chce zaviesť eLab (25. 1. 2020): https://www.teraz.sk/zdravie/nczi-chce-zaviest-elab-ako-sucast-ez/442773-clanok.html
- StartitUp (3. 9. 2026), koordinátori v NOÚ, pilot MDT VšZP: https://www.startitup.sk/?p=1234606
- Simplifier, jurisdikcia SK (bez dátumu): https://api.simplifier.net/jurisdictions/SK
- Josephine, súťaž NCZI (tender 62813), vysvetlenie súťažných podkladov č. 31 (23. 6. 2025): https://josephine.proebiz.com/cs/tender/62813/summary/download/560694 (otázka č. 1 je text uchádzača, nie stanovisko NCZI)
- Denník N a CRZ cez vyhľadávač (NG HIS FN Nitra): https://dennikn.sk/5501319/firmu-ktora-dodala-system-do-nemocnice-v-nitre-vlastni-siet-penty-zamestnanci-proti-nemu-spisali-peticiu/ (nečítané celé)

**Hľadané a nenájdené:** verejný vývojársky portál/sandbox eZdravia; trhové podiely AIS/NIS; NIS NOÚ/OÚSA/VOÚ; slovenský národný FHIR guide od NCZI; slovenský zákon k EHDS; verejné údaje o kanáloch výmeny dokumentov u slovenských onkológov; poplatky za overenie zhody.
