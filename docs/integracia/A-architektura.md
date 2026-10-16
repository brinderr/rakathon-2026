# A: Architektúra nástroja pre koordinátora KOC (ideálna a zároveň realistická)

_Stav: piatok 16. 10. 2026, večer. Pre Bruna a Maťa (laici v zdravotníctve). Stavia na `g1` až `g7`, na zadaní VZP a na pre-hack prednáškach. Nové overenia z dnešného dňa: lékový záznam (VZP), InterSystems (FHIR transformácie, e-mailový adaptér, SMART). Nič sa necommitovalo, žiadne reálne dáta pacientov._

**Značky:**
- **[overené]** = primárny zdroj (zákon, oficiálna stránka, dokument), číslo zdroja je v hranatých zátvorkách, napr. [Z12]. URL a dátum sú v §10.
- **[čiastočne]** = sprostredkované: noviny, firemný materiál, jeden zdroj, návrh alebo „draft“.
- **[nepodložené]** = nenašli sme. Píšeme **„nevieme“**.
- **[odhad]** = náš úsudok architekta, nie fakt. Všetky návrhy riešenia sú [odhad], aj keď sa opierajú o fakty.

**Slovník (jednou vetou):**
- **KOC** = komplexné onkologické centrum (15 v ČR). **MDT** = konzílium lekárov rôznych odborov. **Handover** = podklad pre MDT.
- **AIS / NIS / LIS / PACS** = program ambulancie / nemocnice / laboratória / archív snímok.
- **DASTA** = český XML formát na výmenu dát (hlavne laboratórne výsledky). **NČLP** = český číselník laboratórnych položiek.
- **HL7 v2** = starší formát správ v nemocniciach. **FHIR** = moderný štandard (webové API, JSON, „kocky“ ako Patient, Observation, Task).
- **eZpráva** = zabezpečená „lekárska pošta“. **ePACS** = sieť na posielanie snímok medzi nemocnicami.
- **eŽádanka K** = štátna elektronická konziliárna žiadanka. **AAfD** = plánovaný štátny „smerovač“ dokumentov (vie, kde dokument leží, sám ho nedrží).
- **Push / pull** = dáta niekto pošle / dáta si príjemca sám vezme z cudzieho systému.
- **Rola-schránka** = jedna spoločná e-mailová adresa pracoviska (nie konkrétneho človeka).

---

## 0. Odpoveď v 12 bodoch

1. **Vízia „krásny 360° profil z dát všetkých lekárov“ je správna ako obrazovka pre koordinátora, ale nie ako sľub o zdrojoch.** Automaticky ťahať dáta od všetkých lekárov v ČR sa dnes nedá: verejné API výrobcov AIS/NIS sme nenašli, FHIR vo firemných materiáloch nie je, štátna výmena dokumentov (AAfD) je v stave draft [čiastočne, Z22; overené, Z11].
2. **Zadanie VZP nechce profil, chce prípad bez strát:** prevziať, vyžiadať, vyťažiť, koordinovať, pripraviť MDT, uzavrieť slučku s praktikom a doložiť doručenie [overené, Z1]. Profil je prostriedok, nie cieľ.
3. **Skutočná pridaná hodnota:** jeden prípad z akéhokoľvek kanála, viditeľné medzery (čo chýba a kto to má poslať), úlohy s vlastníkom a termínom, podklad MDT s citáciou ku každému údaju, záver MDT praktikovi s dokladom doručenia [odhad, opiera sa o Z1, Z31, Z36].
4. **Lekár sa nič nové neučí.** Vstupom sú kanály, ktoré lekári a koordinátori už dnes používajú: telefón, e-mail, formulár, eZpráva, ePACS [overené, Z7, Z8]. MZ od 1. 9. 2026 predpisuje HPB centrám univerzálny e-mail a telefón koordinátora [overené, Z6].
5. **Architektonické pravidlo (vzor Cancer 360):** čítať zo zdrojov, nič do nich neprepisovať, mať vlastnú malú vrstvu „úloh“ a pri každom údaji uviesť pôvod [overené, Z31]. Jediný zápis von je hotový dokument (podklad MDT) do NIS KOC, lebo koordinátor má podľa Věstníku pracovať v NIS a viesť záznam o koordinovaní [overené, Z3].
6. **Vlna A (hackathon do soboty 13:00):** celý priechod pacientky Aleny na 13 fiktívnych správach. FHIR server IRIS for Health ako hlavné úložisko, AI s citáciou overenou kódom, kontrola úplnosti k 21. 10. 2026, kroky cesty, podklad MDT, odoslanie praktikovi s doručenkou, auditný log. Ostatné zdroje ako pripravené „biele miesta“.
7. **Vlna B (pilot 1 KOC, 6 mesiacov):** rola-schránka + formulár + eZpráva na vstupe, integračný engine KOC (HL7 v2/DASTA), LLM v EÚ, zápis podkladu do NIS, spätná väzba praktikovi. Odporúčaný rozsah: jedna MDT skupina, ideálne HPB, kde je e-mail koordinátora už predpísaný [odhad, Z6].
8. **Vlna C (národná):** eŽádanka K ako štandardný vstup, AAfD/IHE MHD a NCP na dokumenty z iných nemocníc, KRP/RID na identitu, štruktúrované dáta podľa EHDS (2029/2031). AI ostane na staré a voľnotextové dokumenty [odhad, Z10–Z15, Z30].
9. **VZP ako „uzol“:** vo vzoroch zo zahraničia nerozhýbal výmenu uzol, ale **platba alebo zákon** (Anglicko e-RS od 1. 10. 2018, Holandsko 2012) [overené, Z33]. VZP koordináciu už platí (výkon 51887, 250 Kč) [overené, Z4]. Rozumná rola VZP je páka a smerovanie, nie úložisko dokumentov [odhad].
10. **Konkurencia:** dodávatelia NIS (vidia len svoju nemocnicu), Asseco (MDT Copilot, OnkoAsist na SK), nepomenované piloty MZ, v zahraničí Epic/Oracle [overené / čiastočne, Z35, Z36, Z38]. Náš priestor je **dáta zvonku nemocnice od rôznych dodávateľov**. NIS dopĺňame, nenahrádzame.
11. **Právo:** vo vlne A len fiktívne dáta [overené, Z40]. Vo vlne B nemocnica = správca, my = spracovateľ, zmluva podľa čl. 28 GDPR, DPIA, EÚ hosting, logy 18 mesiacov, mimo MDR (žiadne skóre naliehavosti ani odporúčania liečby) [overené, Z23–Z28].
12. **Slovensko:** verejné API nie je, do eZdravia smie len certifikovaný IS a koordinátor nie je v zákonnom zozname čitateľov [overené, Z38]. Realisticky: rovnaký príjem dokumentov u koordinátora (NOÚ ich zavádza od 9/2026) a čítanie eZdravia len cez certifikovaného dodávateľa IS [odhad].

---

## 1. Kritický pohľad na víziu tímu

### 1.1 Čo je na vízii správne

| Prvok vízie | Prečo je to správne | Zdroj |
|---|---|---|
| Nová appka **len pre koordinátora**, lekári ostávajú vo svojich nástrojoch | Švédska Inera: zákazníci nechcú „preskakovať“ do ďalšej aplikácie. Samostatná appka ostáva legitímna pre toho, kto integráciu nemá. Koordinátor je jeden používateľ s jedným zámerom | [overené, Z32] |
| Všetko o pacientovi **na jednom mieste** | Zadanie VZP: „mít všechny dokumenty pacientky na jednom místě“. NCZI (SK) samo píše, že príprava dát na konzílium je administratívna úloha bez technologickej podpory | [overené, Z1, Z38] |
| **Podklady pre MDT** ako jadro | Missouri: príprava tumor boardu −30 % času, ale po plnom napojení na EMR a s autorom napojeným na Roche (nie nezávislé) | [overené, Z39] |
| Lieky, laboratórne výsledky, vyšetrenia s dátumami | Presne to žiada Handover_obsah (lieková anamnéza, laby vrátane onkomarkerov, vyšetrenia s dátumom a miestom) | [overené, Z1] |
| Dáta od praktikov, špecialistov a laboratórií | Áno, ale **ako push** (pošlú to, čo už posielajú), nie ako pull z ich systémov (pozri 1.2) | [odhad] |

### 1.2 Čo je ilúzia (a čím ju nahradiť)

| Predstava | Realita v ČR k 16. 10. 2026 | Čím to nahradiť [odhad] |
|---|---|---|
| „Napojíme sa na systémy lekárov a dáta si stiahneme automaticky“ | Verejný vývojársky portál, API ani cenník u STAPRO, ICZ, CGM, MEDAX, Medicalc, Asseco, Medical Systems sme nenašli. FHIR sa v ich materiáloch nespomína. Novinári (2021): vytiahnuť dáta bez súčinnosti dodávateľa je „prakticky nemožné“ [čiastočne, Z20, Z22] | Príjem toho, čo lekár **už posiela** (e-mail, formulár, eZpráva), plus AI vyťaženie |
| „Štát má dáta, vezmeme ich odtiaľ“ | Štátne služby smie volať len poskytovateľ so systémovým certifikátom. Firma ako tretia strana sa k nim nedostane, len cez KOC. Onkologické správy v Sdílenom zázname nie sú. Štátna laboratórna história pre zdravotníka neexistuje, výsledky vidí len občan v EZKarte [overené, Z11, Z12, Z18] | Adaptéry pripravené na certifikát KOC (KRP, eŽádanka K, NCP), zapnuté až v pilote |
| „Profil bude úplný“ | Nebude ani v krajinách s centrálnym úložiskom. Estónsko: asi tretina poskytovateľov v 2024 neposlala ani jeden dokument. Anglicko: 44 % lekárov hlási neúplné žiadanky na MDT [čiastočne, Z41] | Hodnota je vo **viditeľných medzerách** („chýba ECOG, histológia príde 19. 10.“), nie v kráse profilu |
| „Lieky: kedy predpísané a **dokedy**“ | Lékový záznam (SÚKL) má za 5 rokov predpísané a vydané lieky, dávkovanie, lekára, lekáreň a dátum výdaja. Pole „dokedy“ v ňom nie je [overené, Z17] | Ukázať len to, čo stojí v zdroji. Dopočet „dokedy“ by bol interpretácia (riziko MDR, §4.3) |
| „Laby ako krásna história v čase“ | Laby prídu ako PDF alebo DASTA z rôznych laboratórií. Spoločný strojový tok pre koordinátora nie je [overené, Z9, Z18] | DASTA čítať bez AI (NČLP kódy), PDF cez AI s citáciou. Graf len z potvrdených hodnôt |
| „Jeden profil pacienta = naša databáza“ | Experti na pre-hacku výslovne: nestavať vlastnú databázu pacientov ani centrálne úložisko dokumentácie, dokumentáciu nemožno „zdieľať“, len „zpřístupnit“ [overené, Z2] | **Pracovný priestor prípadu** (jedna epizóda v jednom KOC) s odkazom na zdroj, s retenciou podľa KOC. Nie register |
| „Lekári to začnú používať, lebo je to krásne“ | Dobrovoľný e-RS v Anglicku stál roky okolo 52 %, zapla ho až platba (1. 10. 2018). Českí praktici odmietajú povinnosti bez fungujúceho softvéru a bez peňazí [overené, Z33; overené, Z42] | Lekára nemeníme. Meníme len to, čo sa deje u koordinátora |

### 1.3 S kým by sme súťažili

| Konkurent | Čo má navrch | Kde je slabý (náš priestor) | Zdroj |
|---|---|---|---|
| **Dodávatelia NIS** (STAPRO, ICZ, Medical Systems IKIS, Medicalc, Asseco NG HIS, Zlatokop z IKEM) | Majú dáta vlastnej nemocnice, zmluvy, dôveru. Věstník MZ ukladá koordinátorovi používať NIS. Nemocnica si to radšej objedná ako modul u svojho dodávateľa | Nevidia dáta od praktikov, poliklinik a iných nemocníc na cudzích systémoch. Na tom nemajú obchodný záujem | [overené, Z3; čiastočne, Z22] |
| **Asseco** (zadanie MDT Copilot na Rakathone, OnkoAsist na SK) | Výrobca NIS, dodávateľ štátneho OnkoAsistu, Michal Bušek je v porote | MDT Copilot rieši lekárov a MDT, nie príjem od praktikov. OnkoAsist je SK, pilot pre 3 diagnózy | [overené, Z38; čiastočne, Z36] |
| **Nepomenované piloty MZ** („v niektorých KOC pilotujeme koordinačný softvér“) | Podpora ministerstva | Názov, dodávateľ ani zdroj dát nie sú verejné. MZ ukázalo len ilustračný mockup | [overené, Z36] |
| **Epic, Oracle** (zahraničie) | Worklisty navigátorov priamo v EHR. Oracle 23. 9. 2026 oznámil asistenta na prípravu tumor boardu (zatiaľ plán) | V ČR nemajú dominantné postavenie [odhad] | [overené, Z35] |
| **Ostatné tímy na Rakathone** | Rovnaký nápad („AI prečíta PDF a ukáže, čo chýba“) | Rozhodne spoľahlivosť dema a uzavretie slučky | [čiastočne, interné `11-SKEPTICI`] |

**Stratégia [odhad]:** nesúťažiť s NIS, ale byť **príjmová vrstva pre dáta zvonku** a výsledok vkladať do NIS. Dlhodobo predávať cez dodávateľov NIS (modul, API) alebo cez platcu (VZP).

### 1.4 Skutočná pridaná hodnota pre koordinátora (zoradené)

1. **Príjem z ľubovoľného kanála do jedného prípadu.** Telefón, e-mail, formulár, eZpráva, neskôr eŽádanka. Každý dokument je priradený k pacientovi a k prípadu.
2. **Kontrola úplnosti voči zoznamu, ktorý určí KOC** (napr. Handover_obsah alebo formulár MOÚ) a **automatický koncept žiadosti** o chýbajúce („pošlite histológiu“), adresovaný správnemu pracovisku [overené, že formuláre KOC majú pevné polia, Z7].
3. **Kroky cesty s vlastníkom, termínom a stavom.** Odoslaná žiadanka nie je objednané vyšetrenie a objednané nie je vykonané (Tichopad) [overené, Z2].
4. **Podklad MDT s citáciou** ku každému údaju, s dátumom „k 21. 10. 2026“, bez domýšľania [overené, Z1].
5. **Uzavretie slučky:** záver MDT praktikovi tým istým kanálom a **doklad doručenia**. Zákon kanál ani doklad neurčuje, preto je to náš priestor [overené, Z13 §45].
6. **Záznam o koordinovaní a podklad pre výkon 51887.** Věstník chce záznam o koordinovaní [overené, Z3]. Výkon 51887 sa platí nemocnici 250 Kč, max 1× denne na pacienta [overené, Z4]. Nástroj vie ukázať, v ktoré dni intervencia prebehla. Vykazuje nemocnica vo svojom NIS.

**Jedna veta do pitchu [odhad]:** „Nič sa nestratí a vždy vieš, kto je na ťahu.“ Nie „AI vyťaží dokumenty“.

---

## 2. Mapa „kde ležia dáta“

**Ako čítať stĺpec „Auto v pilote“:** **áno** = príde strojovo a štruktúrovane samo; **čiastočne** = príde ako dokument kanálom, ktorý vieme strojovo prijať, AI navrhne polia a koordinátor potvrdí; **nie** = v pilote sa k tomu nástroj nedostane. „Náročnosť“ je [odhad].

| Zdroj | Systém | Kanál dnes | Auto v pilote | Ako presne | Náročnosť | Národne neskôr | Právny základ |
|---|---|---|---|---|---|---|---|
| **Praktik** | AIS (CGM a MEDaX spolu asi 70 %, ústne Opatřil [čiastočne, Z2]) | telefón, e-mail s PDF/Word, formulár KOC, eZpráva, papier cez pacienta [overené, Z7, Z8] | čiastočne | rola-schránka a formulár → AI s citáciou → potvrdenie. Pull z AIS nie | nízka | eŽádanka K (FHIR Bundle) [overené, Z11] | 372/2011 §45 ods. 2 písm. f, g; §51 ods. 2 písm. a [overené, Z13]; GDPR 9(2)(h) |
| **Ambulantný špecialista** | AIS rôznych dodávateľov | správa pacientovi, kópia praktikovi, e-mail na vyžiadanie, eZpráva | čiastočne | vyžiadanie z nástroja (koncept e-mailu), príjem ako dokument | nízka | eŽádanka K, AAfD/MHD | ako vyššie |
| **Poliklinika** | AIS/malý NIS, RDG pracovisko | správa a popis UZ/RTG (papier, PDF), snímky na CD alebo cez ePACS (pripojenie poliklinik nevieme) | čiastočne | dokument + AI; pri snímkach len stav | nízka | AAfD/MHD; EHDS 2031 (snímky) | ako vyššie |
| **Laboratórium** | LIS (napr. STAPRO FONS Openlims), DASTA DS3/DS4 + NČLP [čiastočne, Z9] | výsledok ide objednávajúcemu lekárovi do AIS/NIS; koordinátorovi ako PDF alebo cez eZprávu (PDF/A + DASTA) [overené, Z8] | čiastočne | **DASTA parser bez AI** → FHIR Observation (CZ lab IG s NČLP [overené, Z10]); PDF cez AI; vlastné laboratórium KOC cez NIS | stredná | laboratórna eŽádanka (návrh 1. 1. 2028), EHDS 2031 | 372/2011 §45, §51 |
| **Rádiológia / PACS** | PACS pracoviska; ePACS (ICZ, DICOM) | popis ako dokument; snímky cez ePACS alebo na CD za 50 až 300 Kč [overené, Z19] | čiastočne | popis cez AI; snímky **len stav** („doručené do PACS KOC“), DICOM v nástroji netreba | nízka (stav), vysoká (DICOM) | CZ IG nález obrazového vyšetrenia (STU 1) [overené, Z10]; EHDS 2031 | ako vyššie |
| **NIS vlastného KOC** | STAPRO, ICZ AMIS, IKIS, Medicalc, Zlatokop; pri 9 až 10 z 15 KOC nevieme [čiastočne, Z22] | koordinátor pracuje priamo v NIS [overené, Z3] | čiastočne (áno po integrácii) | integračný engine KOC: HL7 v2 (ADT, ORU), DASTA. Bez dodávateľa a zmluvy nie. Najjednoduchšie: PDF export z NIS | vysoká, ale len raz pre jedno KOC | to isté + SMART spúšťanie (podpora v ČR nevieme) | KOC = správca; 372/2011 §65 ods. 2 písm. a (je koordinátor „iný odborný pracovník“? nevieme) [overené text, Z13]; GDPR čl. 28 |
| **NIS iného KOC** | iný dodávateľ | e-mail, telefón, eZpráva, regionálne ICZ eMeDocS; CT cez ePACS | čiastočne | len na vyžiadanie, príde ako dokument | stredná | **NCP**: zákon dovoľuje odovzdať dokumentáciu na žiadosť ošetrujúceho poskytovateľa (§56b), CDA, asi 11 z 15 KOC pripojených [overené zákon, Z13; odhad počtu, Z15]. **AAfD/MHD** (draft) [overené, Z11] | 372/2011 §45 ods. 2 písm. g, §56b |
| **VZP: vykázané výkony** | dávky, B2B, Moje VZP | pacient vidí s oneskorením do ~50 dní + až 3 mesiace; B2B len úzke dotazy pre zmluvného poskytovateľa [overené, Z16] | nie | pre živú koordináciu nepoužiteľné; neskôr agregovaná analytika ciest | – | VZP ako platobná páka (§3.C) | zmluva poskytovateľa s VZP, certifikát; tretia strana prístup nemá [overené, Z16] |
| **eRecept / lieky** | lékový záznam SÚKL: 5 rokov, predpísané a vydané lieky, dávkovanie, lekár, lekáreň, dátum výdaja [overené, Z17] | lekár ho vidí pri poskytovaní starostlivosti; pacient v appke eRecept | nie | v pilote len cez lekára KOC v jeho softvéri. Prístup koordinátora-nelekára alebo nástroja tretej strany: **nevieme** | – | EHDS 2029 (e-recept) [overené, Z30] | zákon 378/2007 o léčivech; pacient môže namietať [overené, Z17] |
| **Sdílený zdravotní záznam** | štátny SZZ: emergentný záznam + prevencia a screening, **nie onkológia** [overené, Z12] | zdravotník s oprávnením cez NIS/AIS; API v3 na testoch | nie | neskôr cez certifikát KOC; prístup nezdravotníka nevieme | stredná | to isté | 325/2021 §34a, opt-out pacienta |
| **Pacient sám** | papiere, CD, fotky; EZKarta (prevencia, 10 laboratórnych parametrov za 5 rokov [overené, Z18]); MEDDI Onco (ePRO, MOÚ) | prinesie na vyšetrenie, telefonuje | čiastočne | voliteľný odkaz na nahranie dokumentu bez účtu → AI s citáciou. Export z EZKarty: nevieme | nízka | §33: pacient môže dať súhlas „tretej osobe“; či to platí pre KOC, nevieme [overené text, Z12] | GDPR 9(2)(h); vôľa pacienta |
| _Koľajnica:_ **eŽádanka K** | štátna služba | pilot od 1/2026, asi 2 000 žiadaniek do 6/2026 (všetky typy) [čiastočne, Z14] | nie | API v2 (FHIR Bundle) je na teste T2 od 25. 9. 2026; v produkcii nevieme; FHIR príručka typu K je len ci-build [overené, Z10, Z11] | vysoká | **hlavný vstup** po povinnosti (návrh 1. 7. 2027, vláda neschválila: nevieme) | 325/2021 §31a; prijať ju musí každý oprávnený poskytovateľ [overené, Z12] |
| _Koľajnica:_ **Kmeňové registre** | KRP (RID, registrujúci lekár), KRZP, KRPZS; NRPZS verejný | NIS KOC ich volá certifikátom | čiastočne | NRPZS ako otvorené dáta = adresár pracovísk a kontaktov (áno). KRP len cez certifikát KOC | stredná | overenie identity pacienta a praktika | 325/2021 §16–25; §24: len na poskytovanie zdravotných služieb [overené, Z12] |

**Tri zistenia z mapy [odhad]:**
1. **Nič nie je „áno“.** Všetko podstatné dnes prichádza ako dokument. Preto je jadrom riešenia spoľahlivé vyťaženie s citáciou, nie integrácia.
2. **Najštruktúrovanejšie sú laboratórne výsledky** (DASTA + NČLP). Keď prídu ako DASTA (eZpráva to podporuje [overené, Z8]), čítame ich bez AI a bez rizika halucinácie.
3. **Jediný zdroj, kde je plná automatizácia do 6 mesiacov reálna, je NIS vlastného KOC**, a aj tam len so zmluvou a súčinnosťou dodávateľa. Prípad STAPRO v Hradci Králové (2015) ukazuje, že prístup k dátam bez zmluvy je škandál [čiastočne, Z20].

---

## 3. Architektúra v 3 vlnách

### 3.0 Spoločné jadro (rovnaké vo všetkých vlnách)

```
VSTUPY (čo lekári už používajú)       JADRO (používa len koordinátor)                  VÝSTUPY
 telefón ─► poznámka z hovoru ──┐
 e-mail na rola-schránku ───────┤  1 Príjem a priradenie k pacientovi a prípadu
 formulár bez registrácie ──────┤  2 Dokumenty prípadu (FHIR DocumentReference)
 eZpráva (PDF/A + DASTA) ───────┼► 3 Vyťaženie: DASTA bez AI + AI s citáciou
 eŽádanka K (FHIR Bundle) ──────┤  4 Kontrola úplnosti voči zoznamu KOC, k dátumu MDT
 NIS KOC (HL7 v2 / DASTA) ──────┘  5 Kroky a úlohy (vlastník, termín, stav, eskalácia)  ─► podklad MDT (PDF + FHIR Composition)
                                    6 Potvrdenie koordinátorom (AI len navrhuje)         ─► dokument do NIS KOC
                                    7 Auditný log (kto čo videl a zmenil)                ─► záver MDT praktikovi + doručenka
```

**Päť pravidiel jadra [odhad, opiera sa o Z1, Z2, Z26, Z31]:**
1. Zdroj je pravda. Do zdrojov nepíšeme, okrem hotového dokumentu do NIS KOC.
2. Každé pole má pôvod: dokument, strana, doslovný citát, kanál, dátum prijatia. Bez citátu sa pole nezobrazí ako fakt.
3. Chýbajúce sa **označí**, nikdy nedopĺňa (zadanie: „bez domýšlení“).
4. AI navrhuje, rozhoduje koordinátor. AI nemá nástroje s vedľajším účinkom (neodosiela, nemaže).
5. Žiadne klinické hodnotenie: žiadne skóre naliehavosti, poradie pacientov ani odporúčania liečby (hranica MDR).

### 3.A Vlna A: hackathon MVP (do soboty 17. 10. 2026, 13:00)

**Cieľ:** funkčný priechod pacientky Aleny Procházkovej (13 fiktívnych správ) cez všetkých 6 požiadaviek zadania a jasné vysvetlenie cesty k realite. Dáta VZP a inštancie IRIS sú v Azure prostredí VZP [overené, Z37].

| Požiadavka zadania [Z1] | Čo ukážeme | FHIR v IRIS | Skutočné / simulované |
|---|---|---|---|
| **Převzít** | Správa 07 „príde“ do rola-schránky koordinátora (e-mail s prílohou alebo formulár), nástroj ju priradí k pacientke a založí prípad | DocumentReference + Binary, Patient (CZ Core), EpisodeOfCare | príjem je simulovaný (priečinok alebo testovacia schránka) |
| **Vyžádat a shromáždit** | Kontrola ukáže, čo chýba (správy 01 až 06), nástroj pripraví koncept žiadosti na správne pracovisko; správy postupne „prichádzajú“ podľa dátumov | Task (žiadosť o dokument, vlastník, termín), Communication (koncept) | žiadosti sa neodosielajú |
| **Vytěžit** | AI vyťaží polia podľa Handover_obsah; ku každému citát zo zdroja; **kód overí, že citát v dokumente naozaj je**; nesúlady (napr. rozdielne hodnoty) a chýbajúce polia (napr. ECOG) sú označené | Condition, Observation, MedicationStatement, AllergyIntolerance, DiagnosticReport, Procedure, **Provenance** (citát, strana) | skutočné AI na fiktívnych dátach |
| **Koordinovat** | Časová os krokov: CT v KOC 1, biopsia, kontrolné odbery, algeziológ, psychológ; termín, miesto, stav | Task, CarePlan | skutočné |
| **Připravit podklad pro MDT** | Prepínač „stav k 21. 10. 2026“: do podkladu ide len to, čo bolo známe k dátumu MDT (zprávy 12 a 13 nie) | Composition (podľa MDT_zapis) → Bundle typu document → PDF | skutočné |
| **Uzavřít smyčku** | Záver MDT praktikovi + doklad doručenia (čas, kanál, potvrdenie) | Communication + stav doručenia, AuditEvent | doručenka je simulovaná |
| _Navyše_ | „Kto sa pozeral na pacientku“ (auditný log) | AuditEvent | skutočné |
| _Navyše, ak zostane čas_ | Dva FHIR servery (KOC 1 a KOC 2) a presun výsledku CT bez straty | 2 endpointy | skutočné, voliteľné |

**Komponenty:** webové UI koordinátora; IRIS for Health s FHIR R4 serverom (záloha: rovnaké FHIR zdroje ako JSON súbory, ak IRIS nebeží, interný plán to pripúšťa [čiastočne, `11-SKEPTICI`]); služba vyťaženia (LLM + kontrola citátov kódom); generátor PDF; „biele miesta“ ako prázdne adaptéry s popisom.

**Toky dát:** schránka → DocumentReference → LLM (fiktívny text) → návrh polí s Provenance → potvrdenie koordinátorom → Task/CarePlan → Composition/PDF → Communication praktikovi → AuditEvent.

**Kto čo používa:** len koordinátor. Praktik v deme pošle e-mail ako dnes a dostane záver MDT ako dnes.

**Čo je nové pre lekára:** nič.

**Poradie práce do soboty 13:00 [odhad]:**
1. Načítať 13 správ ako DocumentReference (IRIS alebo záloha JSON).
2. Vyťaženie s citáciou a kontrolou citátov kódom (najdôležitejšie, na tom stojí dôvera).
3. Kontrola úplnosti voči Handover_obsah + prepínač „k 21. 10. 2026“.
4. Kroky cesty (Task) na časovej osi.
5. Podklad MDT ako PDF podľa MDT_zapis, odoslanie praktikovi s doručenkou, auditný log.
6. Jeden slajd „cesta k realite“ (vlny B a C) + záložná nahrávka dema.

**Čo v MVP nerobiť:** reálne dáta; vlastný systém žiadaniek (štát ho stavia [overené, Z2]); skóre naliehavosti; odporúčania liečby; „napojenie na NIS“ ako tvrdenie.

**Ako vysvetliť cestu k realite (3 vety do pitchu) [odhad]:**
- „Dnes beriem to, čo koordinátorovi reálne príde: telefón, e-mail, formulár, eZpráva. Ministerstvo od septembra predpisuje HPB centrám presne e-mail a telefón koordinátora.“
- „Pilot je jedno KOC: rola-schránka, zápis podkladu do NIS, záver späť praktikovi s doručenkou. Dáta ostávajú u zdroja, výstup je FHIR podľa českých príručiek.“
- „Keď bude eŽádanka povinná a spustí sa štátna výmena dokumentov, napojíme sa cez certifikát KOC. Prepínač je pripravený, nečakáme naň.“

### 3.B Vlna B: pilot v jednom KOC (6 mesiacov)

**Výber KOC (kritériá, nie meno) [odhad]:** (1) známy NIS a dodávateľ ochotný sprístupniť rozhranie (doložené aspoň čiastočne: VFN = STAPRO, FN Olomouc = IKIS, FN Ostrava = Medical Systems, KN Liberec = Medicalc4 [čiastočne, Z22]); (2) koordinátorka, ktorá už pracuje s e-mailom a formulárom (FN Olomouc, Bulovka [overené, Z7]); (3) HPB centrum, kde je univerzálny e-mail koordinátora predpísaný od 1. 9. 2026 [overené, Z6]; (4) ochotný DPO a IT. Zaujímavý je aj MOÚ Brno: tender na modernizáciu NIS a LIS žiada napojenie na AAfD a štátne služby [čiastočne, Z22].

**Rozsah:** jedna MDT skupina (napr. HPB alebo GIT), 1 až 3 koordinátori.

**Komponenty:**

| Komponent | Čo robí | Poznámka |
|---|---|---|
| **Rola-schránka KOC** | prijíma e-maily a prílohy na adrese typu koordinace-…@koc | schránka je na mailovom serveri nemocnice, čítame ju na pokyn KOC. IRIS má e-mailový vstupný adaptér, ale bez OAuth 2.0; pri Microsoft 365 treba iné pripojenie [čiastočne, Z37] |
| **Formulár bez registrácie** | odkaz alebo QR pre lekára, polia podľa zoznamu KOC, nahranie príloh | vzor MOÚ a Bulovka [overené, Z7]. Lekár prepisuje, preto je to len možnosť |
| **Príjem eZprávy** | správy pre IČP koordinátora, prílohy PDF/A a DASTA | pravidlá z roku 2016 pripúšťajú klientov tretích strán; či dnes dovolia automatický príjem, **nevieme** [čiastočne, Z8] |
| **Poznámka z telefonátu** | šablóna: kto volal, kedy, čo povedal; pôvod údaja „telefonát“ | telefón je hlavný kanál [overené, Z7] |
| **Integračný engine KOC** | z NIS: demografia a pobyty (HL7 v2 ADT), výsledky vlastného laboratória (DASTA alebo ORU). Do NIS: podklad MDT ako dokument | použiť engine, ktorý KOC už má, alebo IRIS for Health. HL7 v2 → SDA → FHIR má IRIS hotové [čiastočne, Z37] |
| **FHIR úložisko prípadu** | dokumenty, vyťažené polia s Provenance, úlohy, podklady | v EÚ, tenant KOC, retencia podľa KOC |
| **Vyťaženie** | DASTA parser + LLM s citáciou | LLM v EÚ: Azure OpenAI „Data Zone EU“ alebo Claude cez Bedrock s EÚ profilom po overení regiónov. Priamy Anthropic API EÚ región nemá [overené, Z28] |
| **Pseudonymizácia pred LLM** | mená, RČ, číslo poistenca, adresy, kontakty sa pred odoslaním vyrežú | stále osobné údaje, nie anonymné [overené, Z23] |
| **Pracovný zoznam** | „čo mám dnes vybaviť, čo mešká, čo chýba“; lehoty zadáva človek | vzor Infoflex, Cancer 360 [overené, Z31] |
| **Spätná väzba praktikovi** | potvrdenie prijatia + čo chýba; záver MDT tým istým kanálom; doručenka | v tele e-mailu nič citlivé, len odkaz s prihlásením, alebo eZpráva. ÚOOÚ neodporúča obyčajný e-mail na celé lekárske správy [overené, Z29] |
| **Bezpečnosť** | SSO s identitou nemocnice, MFA, roly, pridelenie pacientov, AuditEvent | §4 |
| **Voliteľne (mesiac 5 a ďalej)** | eŽádanka K a KRP/RID na teste T2 cez certifikát KOC | T2 je verejné pre dodávateľov softvéru [overené, Z11] |

**Toky dát:**
1. Praktik alebo špecialista → rola-schránka / formulár / eZpráva → úložisko prípadu (DocumentReference).
2. NIS KOC → engine → úložisko (Patient, Encounter, Observation z vlastného laboratória).
3. Úložisko → pseudonymizácia → LLM v EÚ → návrh polí → potvrdenie koordinátorom.
4. Nástroj → NIS KOC: podklad MDT a záznam o koordinovaní ako dokument (PDF/A; formát správy podľa dodávateľa).
5. Nástroj → praktik: potvrdenie prijatia, čo chýba, záver MDT, doručenka.
6. Všetko → auditný log.

**Kto čo používa:** koordinátor (denne); lekári MDT čítajú podklad v NIS (ako dokument) alebo cez odkaz len na čítanie; DPO a audítor čítajú log; IT KOC spravuje engine. **Praktik a špecialista: nič nové** (e-mail, formulár, eZpráva, telefón).

**Plán po mesiacoch [odhad]:**

| Mesiac | Čo |
|---|---|
| 0 | dohoda s vedením KOC, DPO, IT; zmluva o spracovaní (čl. 28 GDPR), bezpečnostné prílohy, písomný zamýšľaný účel (MDR); DPIA robí KOC; ako sa pilot zmluvne uzavrie (verejné zákazky): **nevieme**, právnik KOC |
| 1 | nasadenie v EÚ, SSO a MFA, syntetické dáta, zoznam polí podľa MDT skupiny, rola-schránka a formulár; **zmerať východiskový stav** (čas koordinátora na prípad, dnes ho nikto nemeral [nepodložené, Z42]) |
| 2 | príjem e-mailu a formulára naostro, až po DPIA a bezpečnostnom schválení; pentest pred spustením |
| 3 | zápis podkladu MDT do NIS; čítanie ADT a demografie, ak to dodávateľ umožní; príjem eZprávy, ak to prevádzkovateľ umožní |
| 4 | DASTA z vlastného laboratória a z eZprávy; spätná väzba praktikovi s doručenkou |
| 5 | test eŽádanky K a KRP na T2 cez certifikát KOC (ak KOC chce) |
| 6 | vyhodnotenie a rozhodnutie o pokračovaní |

**Merania pilotu [odhad]:** dni od prvej žiadosti po úplný podklad; podiel prípadov s úplným podkladom v deň MDT; minúty koordinátora na prípad (pred a po); podiel záverov MDT s dokladom doručenia; podiel polí potvrdených bez opravy; nula polí bez citátu.

**Čo je nové pre lekára:** nič. Iba dostane automatické potvrdenie prijatia a zoznam toho, čo chýba.

### 3.C Vlna C: národná verzia (2027 až 2031+)

**Ideálny cieľový stav [odhad]:** praktik vystaví žiadanku K vo svojom AIS; KOC ju dostane ako FHIR Bundle; nástroj si ostatné dokumenty vyhľadá a sprístupní u pôvodcov cez AAfD (IHE MHD); laboratórne výsledky prídu štruktúrovane; identita ide cez KRP/RID; záver MDT ide späť do AIS praktika ako dokument s potvrdením. Koordinátor rieši len výnimky. AI ostane na staré a voľnotextové dokumenty.

| Komponent | Stav k 16. 10. 2026 | Zdroj |
|---|---|---|
| **eŽádanka K** ako vstup do KOC | API v2 na T2; povinnosť vystaviť od 1. 7. 2027 je **návrh novely**, schválenie vládou nevieme; FHIR príručka K je ci-build | [overené, Z11, Z10; čiastočne, Z14] |
| **AAfD / IHE MHD** (vyhľadať a sprístupniť dokumenty u pôvodcu) | štandard AAfD je DRAFT (16. 3. 2026), HIE príručka 0.0.1 draft; budujú sa na 5 miestach | [overené, Z11; čiastočne, Z2] |
| **NCP** na dokumenty z iných nemocníc | §56b to dovoľuje; 30 z 37 poskytovateľov pripojených (30. 8. 2026); CDA, nie FHIR; reálne využitie medzi českými nemocnicami nevieme | [overené, Z13, Z15] |
| **KRP/RID, KRZP, NRPZS** | KRP API v3; tretia strana len cez poskytovateľa | [overené, Z12] |
| **EHDS** | účinné od 26. 3. 2025, všeobecne sa uplatňuje od 26. 3. 2027; pacientsky súhrn a e-recept od 26. 3. 2029; snímky, laboratórne výsledky a prepúšťacie správy od 26. 3. 2031 | [overené, Z30] |
| **Onkologický FHIR profil** | v ČR neexistuje; európsky Cancer Common Model je v ballote | [overené, Z10] |
| **Registrácia služby u štátu** | Katalóg služieb EZ (KSEZ, §36) eviduje aj služby spravované poskytovateľom; podmienky schválenia nevieme | [overené, Z12] |

**Toky:** AIS praktika → eŽádanky (žiadanka K + prílohy) → nástroj KOC (prijať, vybaviť) ↔ AAfD (MHD vyhľadať a stiahnuť) ↔ KRP (overenie pacienta, registrujúci lekár) → NIS KOC → záver MDT späť praktikovi (cez eŽádanku alebo registrovanú výmennú sieť, ktorú navrhuje novela [overené, Z14]).

**Federácia KOC [odhad]:** každé KOC má vlastnú inštanciu (je správca). Presun pacienta medzi KOC (v zadaní CT v KOC 1, MDT v KOC 2) ide cez FHIR/MHD, nie cez spoločnú databázu.

**VZP ako „uzol“: čo dáva zmysel [odhad]:**
- **Páka:** VZP už platí výkon 51887 [overené, Z4]. Vzory ukazujú, že tok rozhýbe až platba (Anglicko e-RS, Holandsko) [overené, Z33]. Napríklad bonus za doložené uzavretie slučky alebo za úplný podklad. Rozhodnutie je VZP a MZ, nie appky.
- **Smerovanie:** VZP vie, kto je registrujúci lekár (B2B služba pre zmluvných poskytovateľov) [overené, Z16]. To je presne adresa, kam poslať záver MDT.
- **Financovanie spoločnej služby:** v Holandsku poisťovne plošne zaplatili celoštátnu službu na MDO (VECOZO, 2025) [overené, Z34].
- **Nie úložisko:** AAfD sú smerovač, nie repozitár [overené, Z2]. VZP dnes obsah dokumentácie nedostáva [overené, Z16]. Čo presne VZP „uzlom“ myslí, nevieme (jedna veta v poznámkach k slajdu) [overené, Z1].

**Distribúcia [odhad]:** ako modul alebo API pre dodávateľov NIS, alebo cez platcu. Samostatné appky kupujú veľkí výrobcovia (Noona, Kaiku, Navigating Cancer) [overené / čiastočne, g5].

**Čo je nové pre lekára:** eŽádanka v jeho AIS, ak ju štát urobí povinnou. To je štátna povinnosť, nie naša appka.

### 3.D Ako by to fungovalo na Slovensku

| Otázka | Fakt | Zdroj |
|---|---|---|
| Je verejné API na dáta pacientov? | Nie. Zapisovať do eZdravia smie len systém s osvedčením o zhode. Osvedčenie môže žiadať výrobca IS poskytovateľa, poisťovňa a zákonom vymenované subjekty | [overené, Z38: 153/2013 §5 ods. 2, §11] |
| Technológia | SOAP 1.2 + XML podľa EN 13606; FHIR len plán; otvorené API má priniesť RISEZ, harmonogram predĺžený 19. 3. 2026, nový termín nevieme | [overené, Z38] |
| Smie koordinátor čítať eZdravie? | V zákonnom zozname nie je. Sestra áno, administratívny pracovník len žiadanky a odporúčania. Je to náš výklad, nie právne stanovisko | [overené text, Z38] |
| Čo v eZdraví pribúda | eZapisovanie od 1. 7. 2026: zápis je podmienkou úhrady; klinická a radiačná onkológia (019, 043) od 1. 7. 2026; laboratóriá a zobrazovanie od 1. 7. 2027 | [overené, Z38] |
| Štátny projekt | OnkoAsist: dodávateľ Asseco Central Europe, zmluva o dielo účinná od 12/2025, pilot 3 diagnózy, nadstavba v existujúcich IS lekárov | [overené, Z38] |
| Koordinátori | NOÚ ich zavádza od 9/2026, financovanie otvorené; VšZP v pilote platí MDT 7 až 12/2026 | [čiastočne, Z38] |

**Ako by to fungovalo [odhad]:**
- **Vlna A je rovnaká:** dokumenty, ktoré koordinátor dostane (PDF, Word, e-mail), vyťaženie s citáciou, podklad MDT.
- **Vlna B:** pilot v NOÚ ako príjmová vrstva u koordinátora. Čítanie eZdravia len cez certifikovaný IS nemocnice a pod prihlásením oprávneného zdravotníka (karta ePZP), teda cez **partnera-dodávateľa IS** (Asseco CE, STAPRO, PROSOFT, CGM…). Sami sa na eZdravie nenapájame (12 mesiacov na integráciu, oprávnenosť).
- **Vlna C:** RISEZ API (termín nevieme), EHDS 2029/2031. Skôr modul k OnkoAsistu než konkurencia.
- **Riziko:** zákazník, ktorý by na SK platil za koordinátorský nástroj, zatiaľ nie je. Slovenský kybernetický zákon a ďalšie SK špecifiká sme neskúmali: **nevieme**.

---

## 4. Bezpečnosť a právo v každej vlne

### 4.1 Prehľad

| Oblasť | Vlna A (hackathon) | Vlna B (pilot) | Vlna C (národne) | Zdroj |
|---|---|---|---|---|
| **Dáta** | len fiktívne dáta VZP; reálne dáta zakázané bez písomného oprávnenia | syntetické → reálne až po zmluve, DPIA a bezpečnostnom schválení | reálne | [overené, Z40, Z1] |
| **GDPR čl. 9** | netreba (nie sú reálne údaje) | KOC spracúva podľa čl. 9 ods. 2 písm. h) (zdravotná starostlivosť na základe zákona). Súhlas pacienta nie je hlavný základ | to isté v každom KOC | [overené, Z23] |
| **Roly a zmluva (čl. 28)** | – | KOC = správca, my = spracovateľ; DPA: pokyny, mlčanlivosť, podspracovatelia (cloud, LLM) s povolením, audit, vymazanie alebo vrátenie dát | rovnako + zoznam podspracovateľov pre každé KOC | [overené, Z23] |
| **Zákon 372/2011** | – | odovzdanie pre nadväznosť bez súhlasu (§51 ods. 2 písm. a); nahliadanie len v nevyhnutnom rozsahu (§65 ods. 2 písm. a). **Otvorené:** je koordinátor „iný odborný pracovník“? Otázka na DPO | rovnako | [overené, Z13] |
| **DPIA** | – | áno, robí KOC, my pomáhame; česká výnimka pre lekára bez spracovateľa sa na nás nevzťahuje | áno, aktualizovať | [overené, Z23] |
| **Kyberzákon 264/2025 (NIS2)** | – | nemocnica je regulovaná (veľký podnik = vyšší režim); my nie, ale nemocnica musí dať do zmluvy audit, podzhotoviteľov, hlásenie incidentov, exit, likvidáciu dát a žiadosti cudzích orgánov o dáta (príloha 5 vyhlášky 409/2025) | dodávateľský režim pre každé KOC | [overené, Z25] |
| **Technické minimum** | žiadne PHI v gite a logoch | MFA, logy prístupov min. 18 mesiacov, pentest pred spustením, šifrované zálohy, oddelené prostredia bez reálnych dát vo vývoji | pentest min. raz za 2 roky (vyšší režim) | [overené, Z25] |
| **Auditný log** | ukážka v UI | zákonná povinnosť: zaznamenať všetky činnosti v dokumentácii (vyhl. 444/2024 §6), záznamy nemenné (§7); formát FHIR AuditEvent podľa IHE BALP | to isté + odpoveď pacientovi „kto sa pozeral“ (čl. 15 GDPR) | [overené, Z24, Z23] |
| **Prístupové práva** | roly v deme | jeden človek = jeden účet, SSO nemocnice, pridelenie pacientov koordinátorovi (prakticky „nevyhnutný rozsah“), admin oddelený | rovnako | [overené, Z13, Z25; pridelenie odhad] |
| **Hosting a LLM** | ľubovoľný, ale ukázať beh v EÚ | EÚ: Azure OpenAI Data Zone EU alebo Bedrock EÚ profil po overení regiónov; **nie priamy Anthropic API** (nemá EÚ región); zákaz používať dáta na trénovanie | EÚ, zmluvne zakázať prenos mimo EÚ | [overené, Z28] |
| **Pseudonymizácia** | ukážka | pred LLM vyrezať priame identifikátory; RČ a číslo poistenca nikdy do LLM; stále osobné údaje | rovnako | [overené definícia, Z23; odhad návrh] |
| **E-mail ako kanál** | simulovaný | ÚOOÚ: celé lekárske správy posielať zabezpečenejšie než obyčajným e-mailom a pacienta poučiť; preferovať eZprávu, v e-maile len odkaz bez PHI; právny stav pre rola-schránku overiť s DPO | štátne a registrované siete | [overené, Z29] |
| **MDR** | pravidlá Rakathonu: výstupy nie sú zdravotnícke pomôcky | písomný zamýšľaný účel „administratívna koordinácia“; mimo MDR, ak nerobíme klinické hodnotenie (§4.3) | ak pribudnú klinické funkcie: MDR trieda IIa+ s notifikovanou osobou | [overené, Z26, Z40] |
| **AI Act** | nerelevantné | onkologická koordinácia nie je v Annex III; vysokoriziková by bola len cez MDR (IIa+) | pri MDR IIa+ vysokoriziková; termín pre Annex I posunutý na 2. 8. 2028 [čiastočne] | [overené, Z27] |
| **EHDS** | – | – | posúdiť, či sme „EHR systém“ (zobrazujeme a importujeme laboratórne výsledky a správy): **nevieme** | [overené definícia, Z30] |
| **Kto schvaľuje** | porota | DPO, IT/bezpečnosť, vedenie KOC, právnik | + režim dodávateľa podľa kyberzákona | [overené, Z25] |

**Oprava zadania:** zákon 325/2021 Sb. nie je kybernetický zákon. Je to zákon o elektronizácii zdravotníctva. Kybernetický je 264/2025 Sb. [overené, Z12, Z25].

### 4.2 Auditný log: čo logovať [odhad podľa Z24, Z25]
Prihlásenie (aj neúspešné); otvorenie profilu a dokumentu; každé volanie AI (ktoré dokumenty, model, verzia šablóny, hash vstupu, nie plný text); čo koordinátor s návrhom AI urobil (prijal, opravil, zamietol); import (zdroj, kanál, čas, hash); zmeny (pred a po); odoslanie správy (komu, kanál, doručenka); zmeny oprávnení; vymazanie. Log len pridáva, nedá sa upraviť, obsahuje minimum citlivých údajov (pseudonymné ID pacienta).

### 4.3 Hranica MDR (červené čiary) [overené pokyn, Z26; zaradenie funkcií odhad]

| Funkcia | Stav |
|---|---|
| Zber a zobrazenie dokumentov, lieky s dátumami zo zdroja, kroky a lehoty, odoslanie záveru MDT | zelená (ukladanie, komunikácia, administratíva) |
| Vyťaženie polí s citátom a označenie chýbajúcich podľa zoznamu KOC | zelená až žltá (administratívny účel: úplnosť podkladu) |
| Zhrnutie pre MDT | žltá: len doslovné zostavenie zo zdrojov s citátmi, nie „hodnotenie stavu“ |
| Dopočítané hodnoty (napr. „liek do…“, PS skóre z textu) | žltá až červená: nerobiť, zobraziť len zdroj |
| Skóre naliehavosti, preusporiadanie pacientov, „odporúčaný ďalší krok“, „podozrenie na“ | **červená** (pokyn uvádza preusporiadanie podľa dát pacienta ako zdravotnícku pomôcku) |
| Odporúčanie liečby alebo vyšetrenia podľa guidelinu | **červená** (pravidlo 11, trieda IIa a vyššie) |

**Návrh zamýšľaného účelu [odhad]:** „Nástroj slúži koordinátorovi onkologickej starostlivosti na zhromažďovanie dokumentov od rôznych poskytovateľov, kontrolu úplnosti podkladov voči zoznamu určenému nemocnicou a sledovanie úloh a lehôt. Nie je určený na diagnostiku, voľbu liečby, určovanie naliehavosti ani na nahradenie klinického posúdenia.“

---

## 5. Ako zmysluplne využiť InterSystems (IRIS for Health a FHIR)

**Čo InterSystems na Rakathone ponúka a hodnotí [overené, Z37]:** IRIS for Health, FHIR server (FHIRPath, SQL, REST), príjem HL7 v2, CDA, DICOM a X12, vektorové vyhľadávanie (RAG), agenti a MCP server. Kritériá: inovatívnosť, reálny dopad, využitie technológie, technická ucelenosť, dobrý dátový model a realistická cesta k MVP. Cena 1 500 EUR, dá sa kombinovať s výzvou. VZP dáva dáta a inštancie IRIS vo svojom Azure.

**Zmysluplné použitie podľa vĺn [odhad, schopnosti z Z37]:**

| Vlna | Ako použiť IRIS | Prečo to nie je nálepka |
|---|---|---|
| **A** | **FHIR server ako hlavné úložisko** (nie vlastná databáza): DocumentReference + Binary (správy), Condition, Observation, MedicationStatement, AllergyIntolerance, DiagnosticReport (vyťažené), **Provenance** (citát, strana, dokument), Task a CarePlan (kroky s vlastníkom a termínom), Composition (podklad MDT), Communication (odoslanie praktikovi), AuditEvent | dátový model je štandard, rovnaký tvar ako budú chcieť české príručky (CZ Core, lab IG) [overené, Z10] |
| **A** | **Vektorové vyhľadávanie** nad kúskami správ: k navrhnutému poľu nájsť doslovný citát a overiť ho; hľadať nesúlady medzi správami | citácia overená kódom je jadro dôvery |
| **A** | **SQL nad FHIR** (FHIR SQL Builder): kontrola úplnosti podkladu jedným dotazom („ktoré polia Handover_obsah nemajú potvrdený zdroj k 21. 10.“) | ukazuje dátový model, nie len UI [čiastočne, Z37] |
| **A, voliteľne** | dva FHIR endpointy (KOC 1, KOC 2) a presun výsledku CT | ukážka federácie z vlny C |
| **B** | **Integračný engine** v KOC (IRIS for Health alebo Health Connect): HL7 v2 → SDA → FHIR je hotová transformácia; DASTA vlastný prevod (DTL alebo Python) na FHIR Observation s NČLP; e-mailový vstupný adaptér pre rola-schránku (pri Microsoft 365 pozor na chýbajúci OAuth 2.0) | jedno rozhranie na jeden zdrojový systém, ako to robia nemocnice [čiastočne, Z37; g6] |
| **B** | **OAuth 2.0 / SMART on FHIR v2 scopes** (od verzie 2026.1 podľa komunity) na obmedzenie prístupu k pacientom | zodpovedá „nevyhnutnému rozsahu“ [čiastočne, Z37] |
| **C** | FHIR fasáda pre eŽádanku K (Bundle), klient IHE MHD k AAfD, mapovanie onkologického súhrnu na Cancer Common Model / mCODE | príspevok k českému štandardu, ktorý chýba [overené, že chýba, Z10] |

**Poctivé limity:** podporu DASTA priamo v IRIS sme nenašli (nevieme, počítame s vlastným prevodom). Referencie InterSystems v českých nemocniciach sme nenašli (nevieme). Cenu licencie pre pilot nevieme. Ak IRIS do noci nebeží, ideme so záložnými JSON súbormi v rovnakom FHIR tvare a do IRIS ich nahráme neskôr.

---

## 6. Top 10 rizík a ako ich zmierniť

| # | Riziko | Prečo je reálne | Zmiernenie [odhad] |
|---|---|---|---|
| 1 | **Lekári nový kanál ignorujú** | dobrovoľné elektronické kanály stoja roky (e-RS 52 %); praktici odmietajú povinnosti bez softvéru a peňazí [overené, Z33, Z42] | žiadny nový kanál pre lekára: e-mail, formulár, eZpráva, telefón; automatické potvrdenie prijatia a zoznam chýbajúceho ako „odmena“ |
| 2 | **Dodávateľ NIS nespolupracuje alebo to postaví sám** | zámok na dodávateľa; nemocnica radšej kúpi modul od svojho dodávateľa [čiastočne, Z20] | pilot začať bez NIS (dokumenty); do NIS len vkladať dokument; ponúknuť sa dodávateľom ako modul pre dáta zvonku |
| 3 | **Právna neistota kanálov a roly koordinátora** | je koordinátor „iný odborný pracovník“ (§65)? ÚOOÚ k e-mailu so správami opatrne [overené, Z13, Z29] | DPO od mesiaca 0; preferovať eZprávu; v e-maile len odkaz bez PHI; písomne zdokumentovať právny základ |
| 4 | **AI vyťaží zle alebo si vymyslí** | halucinácia = chyba v zdravotnej informácii [overené, Z28 (OWASP)] | citát overený kódom, chýbajúce len označiť, potvrdenie človekom, DASTA bez AI, meranie presnosti na syntetických dátach |
| 5 | **Plíživý posun do MDR / AI Act** | skóre naliehavosti alebo odporúčanie = IIa+ s notifikovanou osobou [overené, Z26] | zamýšľaný účel písomne, červené čiary v §4.3, kontrola každej novej funkcie |
| 6 | **Únik dát, prompt injection, LLM mimo EÚ** | dokumenty od cudzích sú nedôveryhodný vstup; priamy Anthropic API nemá EÚ región [overené, Z28] | EÚ hosting, pseudonymizácia, model bez nástrojov s vedľajším účinkom, žiadne PHI v logoch a nástrojoch na chyby, pentest |
| 7 | **Nie je kupec alebo peniaze; verejné zákazky** | 250 Kč za výkon ide nemocnici, nie na softvér [overené, Z4]; či bezplatný pilot spadá pod zákazky, nevieme [nepodložené] | páka VZP (§3.C), pilot ako projekt s nemocnicou, partner s distribúciou (dodávateľ NIS), InterSystems Ventures/Caelestinus [čiastočne, interné `docs/research/09-partneri-a-vitazne-vzorce.md`] |
| 8 | **Štátne termíny sa posunú** | novela s povinnou eŽádankou neschválená, AAfD draft, príručka K ci-build [overené, Z11, Z14] | adaptéry ako možnosť, nie závislosť; hodnota musí stáť na dokumentoch |
| 9 | **Zlé priradenie dokumentu k pacientovi** | v nemocniciach sú duplicity pacientov s rovnakým RČ (Opatřil) [čiastočne, Z2] | párovanie s potvrdením koordinátorom pri nejasnosti; neskôr KRP/RID cez certifikát KOC |
| 10 | **Demo na hackathone zlyhá alebo sme sa rozpŕchli** | málo času, dvaja laici; „AI prečíta PDF“ robí viac tímov [čiastočne, `11-SKEPTICI`] | jeden úplný priechod pred rozširovaním; záložná nahrávka; čísla na obrazovke („0 polí bez citátu“); necitovať nič, čo nemáme podložené |

---

## 7. Otázky pre mentorov a ILF (19. 10. 2026)

1. Koordinátorky (Vaňková, Chrástová): akým kanálom vám reálne príde žiadosť a správy, koľko minút trvá jeden prípad pre MDT?
2. KOC: aký máte NIS a PACS, kto spravuje certifikát EZCA II, máte schránku v eZpráve?
3. Výrobcovia NIS na ILF: viete prijať dokument (podklad MDT) cez rozhranie, akým formátom? Existuje zmluva pre tretiu stranu?
4. NCEZ: môže dodávateľ koordinačného nástroja volať eŽádanku a KRP v mene KOC jeho certifikátom? Kedy bude príručka K vydaná?
5. eZprava.net: dovolíte automatický príjem správ treťou stranou pre KOC?
6. DPO KOC: je koordinátor „iný odborný pracovník“ podľa §65? Smieme prijímať správy na rola-schránku?
7. VZP (Hlavinka): čo presne má robiť „komunikačný uzol“: smerovať, notifikovať, alebo platiť?
8. MZ (Rybář): ktoré koordinačné aplikácie sa pilotujú a odkiaľ berú dáta?

---

## 8. Opravy a rozpory medzi podkladmi

- **OnkoAsist:** `g5` píše „Asseco ako dodávateľa nepotvrdzujem“. `g3` (neskorší beh) to potvrdil zo Správy o zákazke NCZI (25. 11. 2025): dodávateľ je Asseco Central Europe [overené, Z38]. Platí `g3`.
- **eŽádanka „povinná od 1. 7. 2027“:** je to návrh novely, nie platné právo; schválenie vládou nevieme [overené, Z14]. Platné je len, že ju musí každý oprávnený poskytovateľ **prijať** [overené, Z12].
- **EHDS:** nariadenie je účinné od 26. 3. 2025 a všeobecne sa uplatňuje od 26. 3. 2027; povinnosti pre kategórie údajov 2029 a 2031 [overené, Z30]. `g2` a `g3` uvádzajú rôzne „platí od“, obe sú čiastočne správne.
- **Popis API eŽádanky z 7/2025** (JSON + Base64) je zastaraná verzia 1; aktuálna verzia 2 používa FHIR Bundle [overené, Z11].

---

## 9. Dáta pre vizualizáciu

```json
{
  "sources": [
    {"id": "praktik_ais", "name": "Praktický lekár", "system": "AIS (CGM a MEDaX spolu asi 70 %, ústne; presné podiely nevieme)", "channel_today": "telefón, e-mail s PDF/Word, webový formulár KOC, eZpráva, papier cez pacienta; eŽádanka K len pilotne", "auto": "ciastocne", "how": "rola-schránka, formulár alebo eZpráva → AI vyťaženie s citáciou → potvrdí koordinátor; pull z AIS nie (verejné API nedoložené)", "law": "zákon 372/2011 §45 ods. 2 písm. f, g; §51 ods. 2 písm. a; GDPR čl. 9 ods. 2 písm. h"},
    {"id": "specialista_ais", "name": "Ambulantný špecialista", "system": "AIS rôznych dodávateľov", "channel_today": "správa pacientovi a kópia praktikovi, e-mail na vyžiadanie, eZpráva, telefón", "auto": "ciastocne", "how": "koncept žiadosti z nástroja, príjem ako dokument, AI vyťaženie s citáciou", "law": "zákon 372/2011 §45 ods. 2 písm. g; §51 ods. 2 písm. a; GDPR čl. 9 ods. 2 písm. h"},
    {"id": "poliklinika", "name": "Poliklinika (ambulancie + RDG)", "system": "AIS alebo malý NIS; RDG popis ako dokument", "channel_today": "správy a popisy v papieri alebo PDF, e-mail, eZpráva; snímky na CD alebo cez ePACS (pripojenie nevieme)", "auto": "ciastocne", "how": "dokument → AI s citáciou; pri snímkach len stav doručenia", "law": "zákon 372/2011 §45, §51; GDPR čl. 9 ods. 2 písm. h"},
    {"id": "laboratorium", "name": "Laboratórium", "system": "LIS (napr. STAPRO FONS Openlims), DASTA DS3/DS4 + NČLP", "channel_today": "výsledok ide objednávajúcemu lekárovi do AIS/NIS; koordinátorovi ako PDF alebo cez eZprávu (PDF/A + DASTA)", "auto": "ciastocne", "how": "DASTA parser bez AI → FHIR Observation (CZ lab IG, NČLP); PDF cez AI; vlastné laboratórium KOC cez NIS", "law": "zákon 372/2011 §45, §51; vyhláška 444/2024"},
    {"id": "radiologia_pacs", "name": "Rádiológia / PACS", "system": "PACS pracoviska; ePACS (ICZ, DICOM) medzi nemocnicami", "channel_today": "popis ako dokument; snímky cez ePACS alebo na CD (50 až 300 Kč)", "auto": "ciastocne", "how": "popis cez AI s citáciou; snímky len stav (doručené do PACS KOC), DICOM v nástroji netreba", "law": "zákon 372/2011 §45, §51"},
    {"id": "nis_vlastny_koc", "name": "NIS vlastného KOC", "system": "STAPRO, ICZ AMIS, Medical Systems IKIS, Medicalc, Zlatokop; pri 9 až 10 z 15 KOC nevieme", "channel_today": "koordinátor pracuje priamo v NIS (Věstník MZ 11/2025 čl. 6)", "auto": "ciastocne", "how": "integračný engine KOC: HL7 v2 (ADT, ORU), DASTA; podklad MDT späť do NIS ako dokument; len so zmluvou a súčinnosťou dodávateľa", "law": "KOC je správca; zákon 372/2011 §65 ods. 2 písm. a (rola koordinátora nejasná); GDPR čl. 28"},
    {"id": "nis_iny_koc", "name": "NIS iného KOC", "system": "iný dodávateľ NIS", "channel_today": "e-mail, telefón, eZpráva, regionálne ICZ eMeDocS; CT snímky cez ePACS", "auto": "ciastocne", "how": "dnes len na vyžiadanie ako dokument; neskôr NCP (CDA, §56b) a AAfD (IHE MHD, draft)", "law": "zákon 372/2011 §45 ods. 2 písm. g; §56b"},
    {"id": "vzp_vykony", "name": "VZP: vykázané výkony", "system": "dávky, B2B služby, Moje VZP", "channel_today": "pacient vidí v Moje VZP s oneskorením do ~50 dní + až 3 mesiace; B2B len úzke dotazy pre zmluvného poskytovateľa", "auto": "nie", "how": "pre živú koordináciu nepoužiteľné; neskôr agregovaná analytika ciest; výkon 51887 je len signál", "law": "zmluva poskytovateľa s VZP a certifikát; tretia strana prístup nemá"},
    {"id": "erecept_lieky", "name": "eRecept a lékový záznam", "system": "SÚKL lékový záznam: 5 rokov predpísané a vydané lieky, dávkovanie, lekár, lekáreň, dátum výdaja", "channel_today": "lekár ho vidí pri poskytovaní starostlivosti; pacient v aplikácii eRecept", "auto": "nie", "how": "v pilote len cez lekára KOC v jeho softvéri; prístup koordinátora-nelekára alebo nástroja tretej strany nevieme; pole dokedy v zázname nie je", "law": "zákon 378/2007 o léčivech; pacient môže namietať"},
    {"id": "sdileny_zaznam", "name": "Sdílený zdravotní záznam", "system": "štátny SZZ: emergentný záznam + prevencia a screening, nie onkológia", "channel_today": "zdravotník s oprávnením cez NIS/AIS alebo portál; API v3 na testovacích prostrediach", "auto": "nie", "how": "neskôr cez certifikát KOC (EZCA II); prístup nezdravotníka nevieme", "law": "zákon 325/2021 §34a; opt-out pacienta"},
    {"id": "pacient", "name": "Pacient sám", "system": "papiere, CD, fotky; EZKarta (prevencia, 10 laboratórnych parametrov); Moje VZP; MEDDI Onco (ePRO)", "channel_today": "prinesie na vyšetrenie, telefonuje", "auto": "ciastocne", "how": "voliteľný odkaz na nahranie dokumentu bez účtu → AI s citáciou; export z EZKarty nevieme", "law": "GDPR čl. 9 ods. 2 písm. h; zákon 325/2021 §33 (súhlas tretej osobe, pre KOC nevieme)"},
    {"id": "ezadanka_k", "name": "eŽádanka K (koľajnica)", "system": "štátna služba eŽádanky, API v2 (FHIR Bundle)", "channel_today": "pilot od 1/2026, asi 2 000 žiadaniek do 6/2026 (všetky typy)", "auto": "nie", "how": "API v2 na teste T2 od 25. 9. 2026 cez certifikát KOC; produkcia nevieme; FHIR príručka K len ci-build; prílohy ako súbory cez AI", "law": "zákon 325/2021 §31a; povinné vystavenie len návrh novely (1. 7. 2027)"},
    {"id": "kmenove_registre", "name": "Kmeňové registre a NRPZS (koľajnica)", "system": "KRP (RID, registrujúci lekár), KRZP, KRPZS; NRPZS verejný", "channel_today": "NIS KOC ich volá systémovým certifikátom", "auto": "ciastocne", "how": "NRPZS otvorené dáta = adresár pracovísk; KRP overenie pacienta len cez certifikát KOC", "law": "zákon 325/2021 §16 až 25; §24 len na poskytovanie zdravotných služieb"}
  ],
  "waves": [
    {
      "name": "A: Hackathon MVP (do 17. 10. 2026, 13:00)",
      "components": ["Simulovaná rola-schránka a formulár s 13 fiktívnymi správami", "IRIS for Health FHIR server (záloha: JSON v tvare FHIR)", "AI vyťaženie s citáciou a kontrolou citátu kódom", "Kontrola úplnosti podľa Handover_obsah k 21. 10. 2026", "Kroky cesty s termínom, miestom a stavom", "Podklad MDT podľa MDT_zapis (Composition + PDF)", "Odoslanie záveru MDT praktikovi so simulovanou doručenkou", "Auditný log", "Biele miesta: eŽádanka K, KRP/RID, eZpráva/DASTA, NIS"],
      "flows": [
        {"from": "Praktik", "to": "Rola-schránka", "what": "epikríza a žiadosť o prevzatie (správa 07)", "standard": "e-mail + PDF/Word (simulované)"},
        {"from": "Koordinátor", "to": "Pracoviská 01 až 06", "what": "žiadosť o chýbajúce správy", "standard": "koncept e-mailu (neodoslaný)"},
        {"from": "Rola-schránka", "to": "FHIR server", "what": "prijatý dokument", "standard": "FHIR DocumentReference + Binary"},
        {"from": "FHIR server", "to": "AI vyťaženie", "what": "text dokumentu (fiktívne dáta)", "standard": "REST + LLM API"},
        {"from": "AI vyťaženie", "to": "FHIR server", "what": "návrh polí s citátom", "standard": "FHIR Condition, Observation, MedicationStatement, AllergyIntolerance + Provenance"},
        {"from": "Koordinátor", "to": "FHIR server", "what": "potvrdenie polí, kroky cesty", "standard": "FHIR Task, CarePlan"},
        {"from": "FHIR server", "to": "MDT", "what": "podklad k 21. 10. 2026", "standard": "FHIR Composition (Bundle document) + PDF"},
        {"from": "Nástroj", "to": "Praktik", "what": "záver MDT a doklad doručenia", "standard": "FHIR Communication (kanál simulovaný)"},
        {"from": "Nástroj", "to": "Auditný log", "what": "kto čo videl a zmenil", "standard": "FHIR AuditEvent"}
      ]
    },
    {
      "name": "B: Pilot v 1 KOC (6 mesiacov)",
      "components": ["Rola-schránka KOC (podľa pokynu MZ pre HPB)", "Formulár bez registrácie na doméne KOC", "Príjem eZprávy + DASTA parser (ak prevádzkovateľ umožní)", "Šablóna poznámky z telefonátu", "Integračný engine KOC (existujúci alebo IRIS for Health)", "FHIR úložisko prípadu v EÚ (tenant KOC)", "LLM v EÚ (Azure OpenAI Data Zone EU alebo Bedrock EÚ) + pseudonymizácia", "Pracovný zoznam koordinátora (úlohy, lehoty, eskalácia)", "Podklad MDT a zápis do NIS ako dokument", "Spätná väzba praktikovi s doručenkou", "SSO, MFA, roly, pridelenie pacientov, AuditEvent 18 mesiacov", "Voliteľne eŽádanka K a KRP/RID na T2 cez certifikát KOC"],
      "flows": [
        {"from": "Praktik / špecialista", "to": "Rola-schránka / formulár", "what": "žiadosť, správy, výsledky", "standard": "e-mail (TLS) / HTTPS formulár"},
        {"from": "Praktik", "to": "eZpráva schránka KOC", "what": "správy a laboratórne výsledky", "standard": "S/MIME, PDF/A + DASTA"},
        {"from": "NIS KOC", "to": "Integračný engine", "what": "demografia, pobyty, výsledky vlastného laboratória", "standard": "HL7 v2 ADT/ORU, DASTA"},
        {"from": "Integračný engine", "to": "FHIR úložisko", "what": "normalizované dáta", "standard": "FHIR R4 (CZ Core, CZ lab IG)"},
        {"from": "FHIR úložisko", "to": "LLM v EÚ", "what": "pseudonymizovaný text dokumentu", "standard": "HTTPS, Data Zone EU"},
        {"from": "Nástroj", "to": "NIS KOC", "what": "podklad MDT a záznam o koordinovaní", "standard": "PDF/A dokument (formát správy podľa dodávateľa NIS)"},
        {"from": "Nástroj", "to": "Praktik", "what": "potvrdenie prijatia, čo chýba, záver MDT", "standard": "eZpráva alebo e-mail bez PHI s odkazom"},
        {"from": "Nástroj", "to": "Auditný log", "what": "kto čo videl a zmenil", "standard": "FHIR AuditEvent (IHE BALP)"}
      ]
    },
    {
      "name": "C: Národná verzia (2027 až 2031+)",
      "components": ["eŽádanka K ako štandardný vstup do KOC", "Klient AAfD / IHE MHD (vyhľadať a sprístupniť dokumenty u pôvodcu)", "NCP na dokumenty z iných nemocníc (§56b)", "KRP/RID, KRZP, NRPZS (identita a adresár)", "Štruktúrované dáta podľa EHDS (2029 súhrn a recepty, 2031 laby, snímky, prepúšťacie správy)", "Onkologický FHIR profil (návrh podľa Cancer Common Model / mCODE)", "Federácia KOC (vlastná inštancia v každom KOC)", "VZP: platobná páka a smerovanie, nie úložisko", "Distribúcia ako modul dodávateľov NIS alebo registrácia v KSEZ"],
      "flows": [
        {"from": "AIS praktika", "to": "eŽádanky (štát)", "what": "žiadanka K + prílohy", "standard": "eŽádanka API v2, FHIR Bundle"},
        {"from": "eŽádanky (štát)", "to": "Nástroj KOC", "what": "prevzatie a vybavenie žiadanky", "standard": "API v2, certifikát EZCA II"},
        {"from": "Nástroj KOC", "to": "AAfD", "what": "vyhľadanie a stiahnutie dokumentov u pôvodcu", "standard": "IHE MHD (ITI-67, ITI-68)"},
        {"from": "Nástroj KOC", "to": "KRP", "what": "overenie pacienta, registrujúci lekár", "standard": "KRP API v3"},
        {"from": "Iné KOC", "to": "Nástroj KOC", "what": "dokumenty pacienta", "standard": "NCP (CDA) / IHE MHD"},
        {"from": "Nástroj KOC", "to": "AIS praktika", "what": "záver MDT s potvrdením", "standard": "FHIR dokument cez eŽádanku alebo registrovanú výmennú sieť"},
        {"from": "VZP", "to": "KOC", "what": "platba viazaná na elektronický tok a uzavretie slučky (návrh)", "standard": "zmluva / úhradová vyhláška"}
      ]
    }
  ]
}
```

---

## 10. Zdroje (URL a dátum; „čítané“ = otvorené 16. 10. 2026 v našich podkladoch g1 až g7 alebo dnes)

- **Z1** Zadanie VZP: `Zadani_ulohy.docx`, `Handover_obsah.docx`, `MDT_zapis.docx`, `MDT zaver.docx` a poznámky slajdu 2 v `Rakathon_cesta_pacienta final.pptx` (balík `cesta-pacienta-data.zip`, 16. 10. 2026), lokálne `docs/materials/drive/cesta-pacienta-data/`
- **Z2** Pre-hack prednášky Opatřil, Kružík, Tichopad, Fajtlová (15. 10. 2026): `docs/research/02-prehack-prednasky.md`
- **Z3** Věstník MZ 11/2025, čl. 6 (koordinátor, NIS, záznam o koordinovaní): https://portal.gov.cz/vestniky/pv8aaxd/1556005765.pdf ; slajd Tichopad, NZIP 10. 12. 2025: https://www.nzip.cz/data/media/konference-nzip-12-2025/prezentace/2025-12-10-sekce-04c-TIchopad.pdf
- **Z4** Výkon 51887: vyhláška 134/1998 Sb. (verzia od 1. 1. 2026) https://www.zakonyprolidi.cz/cs/1998-134 ; úhradová vyhláška 432/2025 Sb., príloha 1, bod 8.5: https://www.zakonyprolidi.cz/cs/2025-432 (čítané 16. 10. 2026; `docs/kontext/raw-vykon-51887.md`)
- **Z5** MZ, koordinátori (2. 9. 2026): https://mzd.gov.cz/tiskove-centrum-mz/jeden-kontakt-mene-cekani-rychlejsi-cesta-k-lecbe-koordinatori-meni-peci-o-onkologicke-pacienty/
- **Z6** Metodický pokyn MZ pre HPB centrá (účinný od 1. 9. 2026): https://mzd.gov.cz/wp-content/uploads/2026/05/Metodicky-pokny_spadova-zodpovednost-HPB_akt.-14_09_26.pdf
- **Z7** Kanály koordinátorov: Bulovka ÚGO (bez dátumu) https://bulovka.cz/kliniky-a-oddeleni/gastrointestinalni-onkologie/ustav-gastrointestinalni-onkologie-objednani ; MOÚ Brno (bez dátumu) https://www.mou.cz/krajsky-koordinator-onkologicke-pece/t2354 ; FN Olomouc (4. 11. 2025) https://www.fnol.cz/aktuality/koordinatorka-onkologicke-pece-pomaha-ve-fn-olomouc-pacientum-v-nelehke-situaci-i-zdravotnikum-pri-jejich-praci ; Zdravotnický deník (4. 6. 2026) https://www.zdravotnickydenik.cz/2026/06/koordinator-zkracuje-pacientum-cestu-k-lecbe-rakoviny/
- **Z8** eZpráva: https://www.lekarskyemail.cz/ (bez dátumu, firemný zdroj) ; pravidlá (13. 1. 2016) https://lekarskyemail.cz/pravidla.pdf ; FN HK (16. 6. 2025) https://www.fnhk.cz/aktuality/fn-hk-nove-nabizi-lekarum-komunikaci-pres-ezpravu ; KNTB (11/2025, PDF/A + DASTA 3) https://www.kntb.cz/ezprava
- **Z9** DASTA, verzia DS 04.28.08 (15. 9. 2026): https://dastacr.cz/ ; prezentácia Darebníček/Hadinec (nedatovaná) https://www.transfuznispolecnost.cz/media/2_jak_spolu_komunikuji_it_syste_my_darebnicek.pdf
- **Z10** HL7 ČR FHIR príručky: https://hl7.cz/fhir ; https://ig.ezdravi.gov.cz/ (5. 8. 2026); príručka K (ci-build, 15. 10. 2026) https://build.fhir.org/ig/HL7-cz/k-order/en/index.html
- **Z11** Manuál EZ pro PZS (verejný): https://mzcr.atlassian.net/wiki/spaces/EPZS/overview ; eŽádanky (15. 10. 2026) …/pages/56000561 ; API eŽádanky …/pages/59670529 ; Novinky (7. 10. 2026) …/pages/393642129 ; FAQ certifikáty (16. 9. 2026) …/pages/190251018 ; AAfD draft (16. 3. 2026) …/pages/421167107
- **Z12** Zákon 325/2021 Sb. (znenie k 1. 4. 2026): https://www.zakonyprolidi.cz/cs/2021-325
- **Z13** Zákon 372/2011 Sb.: https://www.zakonyprolidi.cz/cs/2011-372
- **Z14** Novela 325 (návrh): MZ (24. 6. 2026) https://mzd.gov.cz/tiskove-centrum-mz/elektronizace-zdravotnictvi-pokracuje-ministerstvo-predstavilo-nove-moznosti-prace-se-zdravotnickymi-daty-i-dalsi-legislativni-zmeny/ ; Zdravotnický deník (08/2026) https://www.zdravotnickydenik.cz/2026/08/povinne-e-zadanky-uz-pristi-rok-komory-maji-jednu-zasadni-vyhradu/ ; Vitalia (29. 6. 2026) https://www.vitalia.cz/clanky/elektronicka-zadanka-bude-povinna-v-lednu-2028/
- **Z15** NIX-ZD / NCPeH, pripojení poskytovatelia (30. 8. 2026): https://www.nixzd.cz/poskytovatele
- **Z16** VZP B2B (čítané 16. 10. 2026): https://www.vzp.cz/e-vzp/b2b-komunikace/registrace-a-obecne-informace-o-b2b ; https://vzp.cz/e-vzp/b2b-komunikace/prehled-poskytovanych-sluzeb-b2b ; oneskorenie Moje VZP: https://www.vzp.cz/o-nas/nejcasteji-resite/otazka/proc-nejsou-v-aplikaci-moje-vzp-on-line-udaje-o-cerpane-zdravotni-peci
- **Z17** VZP, Prístup do lékového záznamu (14. 9. 2026, čítané dnes): https://www.vzp.cz/o-nas/tiskove-centrum/otazky-tydne/pristup-do-lekoveho-zaznamu
- **Z18** Národný laboratórny systém a EZKarta: MZ (24. 6. 2026), rovnaké URL ako Z14 ; Echo24/ČTK (9/2026) https://www.echo24.cz/a/HgQCU/zpravy-domov-ezkarta-zdravotnictvi-aplikace-vysetreni
- **Z19** ČT24, snímky na CD (13. 7. 2024): https://ct24.ceskatelevize.cz/clanek/domaci/za-tri-stovky-a-pouze-na-cedecku-nemocnice-mezi-sebou-neumi-predavat-rentgenove-snimky-351090
- **Z20** Zámok na dodávateľa: Ekonomický deník (23. 6. 2021) https://ekonomickydenik.cz/jak-se-zbavit-zavislosti-na-dodavateli-informacniho-systemu-a-modernizovat-fakultni-nemocnice-hledaji-ruzne-cesty/ ; STAPRO a dáta v HK kraji, ČT24 (3. 6. 2015) https://ct24.ceskatelevize.cz/clanek/regiony/kraj-potvrdil-ze-firma-neopravnene-stahla-udaje-o-pacientech-nemocnic-133051
- **Z22** Systémy lekárov v ČR (NIS v KOC, siete, rozhrania, tender MOÚ): `docs/integracia/g1-cz-systemy.md` (zdroje tam, 16. 10. 2026); CGM prezentácia (4. 12. 2024) https://www.nzip.cz/data/media/konference-nzip-12-2024/2024-12-11-16-krystof.pdf
- **Z23** GDPR čl. 4, 9, 15, 22, 28, 32, 35: https://gdpr-info.eu/ ; zoznam ÚOOÚ bez DPIA (8. 1. 2020) https://edpb.europa.eu/system/files/2023-03/cz_art35-5_gdpr_list_final.pdf
- **Z24** Vyhláška 444/2024 Sb. o zdravotnickej dokumentácii: https://www.zakonyprolidi.cz/cs/2024-444 ; FHIR AuditEvent https://www.hl7.org/fhir/R4/auditevent.html ; IHE BALP https://profiles.ihe.net/ITI/BALP/index.html
- **Z25** Kyberzákon 264/2025 Sb. https://www.zakonyprolidi.cz/cs/2025-264 ; vyhlášky 408/2025 https://www.zakonyprolidi.cz/cs/2025-408 , 409/2025 https://www.zakonyprolidi.cz/cs/2025-409 , 410/2025 https://www.zakonyprolidi.cz/cs/2025-410
- **Z26** MDCG 2019-11 rev.1 (jún 2025): https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en?filename=mdcg_2019_11_en.pdf ; MDCG 2025-6 (jún 2025) https://health.ec.europa.eu/document/download/b78a17d7-e3cd-4943-851d-e02a2f22bbb4_en?filename=mdcg_2025-6_en.pdf
- **Z27** AI Act čl. 6 a Annex III: https://artificialintelligenceact.eu/article/6/ , https://artificialintelligenceact.eu/annex/3/ ; EPRS Digital Omnibus on AI (2026) https://www.europarl.europa.eu/RegData/etudes/BRIE/2026/782651/EPRS_BRI(2026)782651_EN.pdf
- **Z28** LLM v EÚ: Microsoft (aktualizované 5. 6. 2026) https://learn.microsoft.com/en-us/azure/foundry/responsible-ai/openai/data-privacy ; Anthropic data residency https://platform.claude.com/docs/en/manage-claude/data-residency ; AWS Bedrock cross-region https://docs.aws.amazon.com/bedrock/latest/userguide/cross-region-inference.html ; OWASP Top 10 LLM 2025 https://genai.owasp.org/llm-top-10/
- **Z29** ÚOOÚ, FAQ zdravotníctvo (bez dátumu): https://uoou.gov.cz/profesional/qa-otazky-a-odpovedi/zdravotnictvi
- **Z30** EHDS: Európska komisia https://health.ec.europa.eu/ehealth-digital-health-and-care/european-health-data-space-regulation-ehds_en ; nariadenie 2025/327 https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202500327
- **Z31** Cancer 360: DPIA šablóna NHS England (13. 5. 2025) https://www.england.nhs.uk/wp-content/uploads/2025/07/redacted-cancer-360-fdp-local-dpia-v1.0.pdf ; FDP uptake (aktualizované 25. 9. 2026) https://www.england.nhs.uk/digitaltechnology/nhs-federated-data-platform/impact/fdp-uptake-and-benefits/
- **Z32** Inera, NPÖ analýza (2024): https://www.inera.se/globalassets/inera/media/dokument/projekt/npo/initial-analys---npo-som-informationsforsorjningstjanst.pdf
- **Z33** Platba ako páka: NHS Digital, e-RS paper switch-off (6. 3. 2018) https://nhsd-proxy.openprescribing.net/blog/transformation-blog/2018/nhs-e-referral-service-paper-switch-off ; Tweede Kamer, LSP (13. 11. 2012) https://berthub.eu/tkconv/getraw/2012D42016
- **Z34** Vitaly / VECOZO MDO (5. 4. 2025): https://www.oncologie.nu/nieuws/professionaliseringsstap-in-mdo/
- **Z35** Oracle Oncology EHR (23. 9. 2026): https://www.oracle.com/news/announcement/oracle-to-advance-cancer-care-with-new-oncology-ehr-2026-09-23/
- **Z36** Piloty koordinačného softvéru MZ: Zdravotnický deník (4. 2. 2026) https://www.zdravotnickydenik.cz/2026/02/uz-zadne-najdete-si-onkologa-vojtech-slibil-pacientum-rychlejsi-cestu-k-lecbe-rakoviny/ ; (19. 6. 2026) https://www.zdravotnickydenik.cz/2026/06/nador-vysetreni-novi-pruvodci-diagnostika/ ; zadanie MDT Copilot (Asseco, 16. 10. 2026) `docs/materials/slack/mdt-copilot/Rakathon_tema_CZ_ACE.docx`
- **Z37** InterSystems: výzva na Rakathone (čítané 16. 10. 2026) https://developer.intersystems.com/intersystems-challenge-at-rakathon-2026/ ; „Streamlining Health Data Integration with FHIR“ (bez dátumu, čítané 16. 10. 2026; HL7 v2/CDA → SDA → FHIR, FHIR SQL Builder) https://www.intersystems.com/cz/resources/streamlining-health-data-integration-with-fhir ; e-mailové adaptéry https://docs.intersystems.com/irislatest/csp/docbook/Doc.View.cls?KEY=EEMA ; OAuth pri POP3 (komunita, 2022) https://community.intersystems.com/print/523776 ; SMART on FHIR v2 scopes vo verzii 2026.1 (komunitný článok) https://dev.to/intersystems/new-smart-on-fhir-v2-scopes-e3j
- **Z38** Slovensko: zákon 153/2013 (znenie od 1. 8. 2026) https://static.slov-lex.sk/static/SK/ZZ/2013/153/20260801.print.html ; NCZI eZapisovanie (11. 9. 2026) https://www.ezdravotnictvo.sk/sk/sluzby-ezapisovanie ; TED RISEZ (20. 4. 2026) https://ted.europa.eu/en/notice/266762-2026/pdf ; OnkoAsist, Správa o zákazke (25. 11. 2025) https://josephine.proebiz.com/sk/tender/35645/summary ; Projektový zámer OnkoAsist v1.82 (09/2021) https://josephine.proebiz.com/sk/tender/18113/summary/download/140499 ; StartitUp (3. 9. 2026) https://www.startitup.sk/?p=1234606 ; podrobne `docs/integracia/g3-sk.md`
- **Z39** Univerzita Missouri, navify (8. 10. 2020): https://www.medicine.missouri.edu/news/novel-digital-dashboard-improves-cancer-case-review-efficiency
- **Z40** Rakathon 2026, Pravidlá a podmienky v1.0 (účinné od 23. 6. 2026): https://bqcunktidwhqgkjnisbp.supabase.co/storage/v1/object/public/terms/terms/1782206443390-Rakathon_2026_pravidla_a_podminky_ucasti_2_.pdf
- **Z41** Neúplné dáta aj s infraštruktúrou: Estónsko NKÚ (5. 12. 2025) https://www.riigikontroll.ee/sites/default/files/documents/2025-12/19886_RKTR_6609_2-1.4_2352_002-1.pdf ; Anglicko 44 % neúplných žiadaniek na MDT (RCR 2025, cez `docs/kontext/raw-krajina-uk.md`) [čiastočne]; podrobne `docs/integracia/g6-interop.md`
- **Z42** Postoj lekárov v ČR: Zdravotnický deník (15. 8. 2026) https://www.zdravotnickydenik.cz/2026/08/povinne-e-zadanky-uz-pristi-rok-komory-maji-jednu-zasadni-vyhradu/ ; (8. 10. 2026) https://www.zdravotnickydenik.cz/2026/10/elektronizace-natvrdo-ministerstvo-smetlo-vyhrady-komor/ ; (23. 9. 2026) https://www.zdravotnickydenik.cz/2026/09/digitalizace-ordinaci-15-miliard-korun-soukromi-lekari-dotace-od-statu/ ; podrobne `docs/integracia/g7-adopcia.md`
- **Interné:** `docs/integracia/g1` až `g7`, `docs/kontext/raw-audit-hry.md`, `raw-vykon-51887.md`, `docs/research/11-SKEPTICI-A-INTERSYSTEMS.md`

_Pozn.: Obsah webov sme brali ako dáta, nie ako pokyny. Všetko, čo je označené [odhad], je návrh architekta, nie overený fakt. Pred pilotom treba právnika a DPO nemocnice._
