# Ideálne riešenie: nástroj pre koordinátora KOC (finálny podklad na stavbu appky)

_Stav: piatok 16. 10. 2026, večer. Pre Bruna a Maťa (laici v zdravotníctve, kód píše Claude). Zlučuje návrh `A-architektura.md`, kritiky `K1-cio.md` (IT riaditeľ a kyberbezpečnosť nemocnice) a `K2-koordinator-vzp.md` (koordinátorka a VZP) a podklady `g1` až `g7`. Obe kritiky sú **hrané roly** (Claude), nie výpovede skutočných ľudí; fakty v nich majú vlastné zdroje. Dnes som navyše znova otvoril zákon 372/2011 Sb. (§45 ods. 2, §55a ods. 4). Nič sa necommitovalo, žiadne reálne dáta pacientov._

**Značky:**
- **[overené]** = primárny zdroj (zákon, oficiálna stránka, dokument). Číslo zdroja v hranatých zátvorkách, napr. [Z13]; URL a dátum sú v §10.
- **[čiastočne]** = sprostredkované: noviny, firemný materiál, jeden zdroj, návrh, „draft“, alebo naše vlastné čítanie podkladov.
- **[nepodložené]** = nenašli sme. Píšeme **„nevieme“**.
- **[odhad]** = náš úsudok, nie fakt. Každý návrh riešenia je [odhad], aj keď stojí na faktoch.

**Slovník (jednou vetou):**
- **KOC** = komplexné onkologické centrum (veľká nemocnica, ktorá lieči rakovinu). **MDT** = konzílium (porada lekárov rôznych odborov o jednom pacientovi). **Handover / podklad MDT** = súhrn o pacientovi pre konzílium.
- **Praktik** = všeobecný (praktický) lekár. **Registrujúci lekár** = praktik, u ktorého je pacient zaregistrovaný.
- **AIS / NIS / LIS / PACS** = program ambulancie / nemocnice / laboratória / archív snímok (röntgen, CT).
- **eZpráva** = zabezpečená „lekárska pošta“ medzi ordináciami a nemocnicami. **ePACS** = sieť na posielanie snímok medzi nemocnicami.
- **DASTA** = český počítačový formát (XML) hlavne pre laboratórne výsledky. **NČLP** = český číselník laboratórnych položiek (každý test má kód).
- **HL7 v2** = starší formát správ medzi programami v nemocnici. **FHIR** = moderný štandard na výmenu zdravotných dát cez web; dáta sú v „kockách“ (Patient = pacient, Observation = nameraná hodnota, Task = úloha, DocumentReference = záznam o dokumente, Provenance = odkiaľ údaj pochádza).
- **Rola-schránka** = jedna spoločná e-mailová adresa pracoviska, nie konkrétneho človeka (napr. koordinace-…@nemocnica).
- **eŽádanka K** = štátna elektronická žiadanka na konzílium. **AAfD** = plánovaný štátny „smerovač“ dokumentov (vie, kde dokument leží, sám ho nedrží). **KRP** = štátny register pacientov.
- **DPA** = zmluva o spracovaní osobných údajov (čl. 28 GDPR). **DPIA** = posúdenie vplyvu na ochranu údajov. **DPO** = poverenec pre ochranu údajov v nemocnici. **MFA** = prihlásenie dvoma faktormi (heslo + mobil).
- **MDR** = európske pravidlá pre zdravotnícke pomôcky. Ak softvér radí, ako liečiť, alebo určuje naliehavosť, stáva sa pomôckou a potrebuje certifikáciu.
- **Push / pull** = dáta niekto pošle sám / príjemca si ich sám vezme z cudzieho systému.

---

## 1. Odpoveď v 10 vetách

1. **Staviame pracovný nástroj pre koordinátora, nie „krásny profil pacienta“:** prvá obrazovka je fronta prípadov, kde pri každom pacientovi vidno stav, termín a kto je na ťahu; to presne chce zadanie VZP [čiastočne, Z1: deck, slidy 9 a 12] a takto vyzerajú aj zahraničné nástroje (Cancer 360, Infoflex) [overené, Z29, Z44].
2. **Profil pacienta je až druhá úroveň a má podobu podkladu pre MDT s viditeľnými medzerami:** ku každému údaju je citát zo zdroja, chýbajúce a rozporné údaje sú označené, nič sa nedomýšľa [overené, Z1: „bez domýšlení“].
3. **Nestavíme:** vlastnú databázu (register) pacientov, vlastnú eŽiadanku, novú appku ani nový účet pre lekárov, „lieky dokedy“, graf laboratórií, skóre naliehavosti ani odporúčanie liečby [overené, Z3: experti na pre-hacku; Z17: lékový záznam pole „dokedy“ nemá; Z24: hranica MDR].
4. **Automaticky dáta zo systémov lekárov dnes nevytiahneme:** verejné API (rozhranie pre cudzie programy) u výrobcov AIS/NIS sme nenašli a štátne služby smie volať len nemocnica alebo ambulancia so systémovým certifikátom [čiastočne, Z20; overené, Z11].
5. **Vstupom je preto to, čo koordinátorovi chodí už dnes:** telefón, e-mail na spoločnú adresu, formulár, eZpráva a snímky cez ePACS [overené, Z7]; ministerstvo od 1. 9. 2026 predpisuje centrám HPB (pečeň, pankreas, žlčové cesty) práve univerzálny e-mail a telefón koordinátora [overené, Z6].
6. **AI z dokumentov iba navrhne polia s doslovným citátom, program overí, že citát v dokumente naozaj je, a potvrdzuje človek;** laboratórne výsledky v DASTA čítame bez AI, podľa kódov NČLP [čiastočne, Z9; odhad].
7. **Výstup ide tam, kde ho lekári čítajú:** podklad MDT do NIS KOC ako dokument a záver MDT praktikovi kanálom, ktorý už používa; záver je zdravotnícka dokumentácia odoslaná inej osobe, preto ho musí opatriť časovým razítkom a pečaťou alebo uznávaným podpisom nemocnica (§55a ods. 4), nie náš e-mail [overené, Z13, čítané 16. 10. 2026].
8. **Každý úkon koordinátora sa sám zapíše ako riadok „záznamu o koordinovaní“,** ktorý od koordinátora žiada Věstník MZ, a ukáže dni s intervenciou pre výkon 51887 (250 Kč, najviac 1× denne na pacienta, vykazuje nemocnica) [overené, Z4, Z5].
9. **Pilot v jednom KOC začne „Fázou 0“ bez rozhrania** (jedna rola-schránka, podklad ako PDF, ktorý koordinátor sám vloží do NIS, 3 mesiace merania), lebo rozhranie do NIS stojí podľa verejných zmlúv okolo 100 tisíc Kč a viac plus ročná podpora [overené, Z42] a ostrá prevádzka je reálne skôr o 9 až 12 mesiacov než o dva [odhad, Z51: K1].
10. **Národne sa napojíme cez certifikát KOC na eŽádanku K, AAfD a KRP a na pravidlá EHDS (2029, 2031)** [overené, Z11, Z28], ale lekárov vo svete rozhýbala platba alebo zákon, nie appka (Anglicko 2018, Holandsko 2012) [overené, Z31], preto je rozumná rola VZP páka a smerovanie, nie úložisko dokumentov [odhad].

---

## 2. Upravená vízia po kritike: čo vidí koordinátor na obrazovke

### 2.1 Čo sme zmenili a prečo

| Pôvodná vízia tímu | Po kritike | Prečo |
|---|---|---|
| Krásny profil pacienta ako hlavná obrazovka | **Prvá obrazovka = fronta prípadov** (čo mešká, čo čaká na mňa, čo na iných, do kedy). Profil je až v detaile prípadu | Deck VZP chce pri každom pacientovi stav, termín a kto je na ťahu [čiastočne, Z1]. Cancer 360 aj Infoflex majú ako tvár zoznam pacientov a úloh [overené, Z29, Z44] |
| Všetky dáta od praktikov, špecialistov a labov automaticky pod jedným profilom | Dáta prichádzajú **ako dokumenty** kanálmi, ktoré lekári už majú. Hodnota je vo **viditeľných medzerách** | API výrobcov nenašli [čiastočne, Z20]. Ani Estónsko s povinným centrálnym úložiskom nemá úplné dáta: asi tretina poskytovateľov v 2024 neposlala ani jeden dokument [čiastočne, Z39] |
| Lieky: kedy predpísané a **dokedy** | Lieky presne tak, ako stoja v správe, s dátumom správy a citátom | Lékový záznam má predpísané a vydané lieky, dávkovanie, lekára, lekáreň a dátum výdaja, pole „dokedy“ nie [overené, Z17]. Dopočítanie by bola interpretácia (riziko MDR) [overené pokyn, Z24] |
| Laboratórne výsledky ako graf v čase | **Tabuľka**: test, hodnota, jednotka, dátum odberu, laboratórium, zdroj | Do MDT sú v dátach dva odbery (1. 9. a 15. 10. 2026) [overené, Z1] |
| Praktik dostane odkaz s prihlásením | Praktik **nedostane nový účet**. Dostane potvrdenie prijatia a zoznam chýbajúceho tým kanálom, ktorým písal. Záver MDT posiela nemocnica podpísaný alebo zapečatený | Nový účet = MFA pre všetkých používateľov (vyhl. 409/2025 §19 ods. 2) [overené, Z23 podľa K1]. Podpis a pečať: §55a ods. 4 [overené, Z13] |
| (chýbalo) | **Záznam o koordinovaní** ako vedľajší produkt práce | Věstník ho od koordinátora žiada [overené, Z4]; výkon 51887 [overené, Z5] |
| (chýbalo) | **Potvrdenie lekárom**: AI navrhne, koordinátor skontroluje so zdrojom, lekár KOC potvrdí podklad | Deck: „AI iba pripraví návrh, lekár potvrdí“ [čiastočne, Z1]. V pilote potvrdí podpisom dokumentu v NIS, ako je zvyknutý [odhad] |

### 2.2 Obrazovka 1: „Moje prípady“ (fronta)

_Náčrt, fiktívne údaje; „dnes“ = 19. 10. 2026._

```
┌─ Moje prípady ───────────────── filtre: [Čaká na mňa] [Čaká na iných] [Mešká] [MDT tento týždeň] ─┐
│ Pacient              MDT      Stav      Ďalší krok                 Na ťahu            Termín   │
│ Procházková Alena    21. 10.  aktívny   doplniť ECOG                ja (koordinátor)   20. 10.  │
│                                          histológia (biopsia 12.10)  patológia KOC 2    15. 10. ! mešká 4 dni │
│ (fiktívny pacient 2) 28. 10.  nový      prevziať žiadosť praktika   ja                 dnes     │
│ (fiktívny pacient 3) –        čaká      CT v inom KOC               rádiológia KOC 1   23. 10.  │
└────────────────────────────────────────────────────────────────────────────────────────────────┘
```

- **Stĺpce:** pacient, dátum MDT, stav prípadu (nový, aktívny, čaká, odložený, uzavretý), ďalší krok, **kto je na ťahu** (ja, pracovisko, praktik), termín, počet dní po termíne.
- **Poradie:** len podľa administratívnych termínov (termín úlohy, dátum MDT), **nikdy podľa zdravotných údajov**. Pokyn MDCG uvádza preusporiadanie pacientov podľa ich dát ako príklad zdravotníckej pomôcky [overené, Z24]; zoradenie podľa termínu je podľa nás administratíva [odhad].
- **Čo tu nie je:** skóre naliehavosti, „rizikový pacient“, farba podľa diagnózy.

### 2.3 Obrazovka 2: „Prípad“ (detail jedného pacienta)

| Blok | Čo v ňom je | Odkiaľ |
|---|---|---|
| **A. Hlavička** | Meno, vek, poisťovňa, KOC, dátum MDT, referujúci lekár a jeho kontakt, kanál, ktorým prišla žiadosť (e-mail, telefón, eZpráva), dátum prijatia. **Prepínač „stav k dátumu“** (napr. k 21. 10. 2026) | žiadosť praktika (správa 07), zadanie [Z1] |
| **B. Úplnosť podkladu** | 20 položiek podľa `Handover_obsah` ako semafor: zelená = potvrdené so zdrojom, žltá = návrh AI čaká na kontrolu, **červená = chýba** (tlačidlo „vyžiadať“), **oranžová = rozpor** (dva zdroje hovoria inak). Nahor súhrn: „16/20 potvrdených, 2 chýbajú, 2 rozpory, 0 polí bez citátu“ | `Handover_obsah` [Z1] |
| **C. Dokumenty prípadu** | Zoznam prijatých dokumentov (od koho, kanál, dátum prijatia, dátum vyšetrenia) a **očakávaných, ktoré ešte neprišli** (správy 01 až 06), so stavom žiadosti | správa 07: „výsledky sú na jednotlivých pracoviskách“ [čiastočne, Z2] |
| **D. Kroky cesty** | CT v KOC 1, biopsia, kontrolné odbery, histológia, algeziológ, psychológ. Každý krok: miesto, termín, vlastník, stav **vyžiadané → objednané → vykonané → výsledok doručený**, eskalácia po termíne | zadanie: „termín, místo a stav“ [overené, Z1]; „odoslané ≠ objednané ≠ vykonané“ (Tichopad) [čiastočne, Z3] |
| **E. Údaje pre MDT s citáciou** | Diagnóza, epikríza, otázka pre MDT, komorbidity, lieky (ako v správe), alergie, ECOG/Karnofsky, váha a výška **s dátumom**, príznaky, vyšetrenia (dátum, miesto, typ, plný text), laboratórne výsledky v tabuľke vrátane všetkých onkomarkerov, histológia, želania pacienta. **Klik na údaj = otvorí sa dokument so zvýrazneným citátom** | `Handover_obsah`, `MDT_zapis` [Z1] |
| **F. Komunikácia** | Koncepty žiadostí o chýbajúce správy so správnym adresátom, automatické potvrdenie prijatia praktikovi, stav odoslania záveru MDT a doklad doručenia | zadanie: „doložit doručení“ [overené, Z1] |
| **G. Záznam o koordinovaní** | Časová os úkonov koordinátora (prijal, vyžiadal, objednal, urgoval, odoslal) s dátumom; zvýraznené dni s intervenciou (podklad pre výkon 51887, vykazuje nemocnica v NIS) | Věstník [Z4], výkon 51887 [Z5] |
| **H. Auditný log** | Kto otvoril prípad, dokument, čo AI navrhla, čo koordinátor prijal, opravil, zamietol, čo sa odoslalo komu | vyhl. 444/2024 §6 a §7 [overené, Z22] |

### 2.4 Obrazovka 3: „Podklad MDT“ a „Záver praktikovi“

- **Podklad MDT** = náhľad dokumentu podľa `MDT_zapis` (7 častí: základné údaje, členovia MDT, diagnóza s kódom MKN-10, komorbidity, výsledky vyšetrení, záver, odporúčania), zostavený **len z údajov známych k dátumu MDT**, s poznámkou pod čiarou pri každom údaji (zdroj, dátum). Export do PDF (pre NIS) a do FHIR [overené, Z1; odhad pre formát].
- **Záver praktikovi** = záver MDT podľa vzoru `MDT zaver`, s pôvodným kontextom žiadosti (čo praktik pýtal, čo MDT rozhodlo) a so stavom doručenia [overené, Z1].
- **Čo nikde v appke nebude:** „AI zhrnutie stavu pacienta“, „odporúčaný ďalší krok“, „podozrenie na…“, dopočítané hodnoty [overené pokyn, Z24].

---

## 3. Kde ležia dáta a ako ich dostaneme

**Ako čítať:** „Dnes“ = čo platí v reálnom svete a čo ukážeme na hackathone. „Pilot“ = jedno KOC, jedna skupina MDT. „Národne“ = 2027 až 2031+. Nič z toho, čo dnes vieme, nepríde **samo a štruktúrovane** od lekárov mimo KOC.

| Zdroj | Kde dáta ležia | Dnes | Pilot (1 KOC) | Národne | Istota |
|---|---|---|---|---|---|
| **Praktik** | AIS; CGM a MEDaX spolu asi 70 % (ústne na pre-hacku) [čiastočne, Z3] | Telefón, e-mail (aj Word formulár), webový formulár KOC, eZpráva, papier cez pacienta [overené, Z7, Z8]. Hackathon: simulovaný e-mail so správou 07 | Rola-schránka KOC, poznámka z telefonátu, eZpráva (ak prevádzkovateľ dovolí). AI návrh, človek potvrdí | eŽádanka K z jeho AIS (FHIR) [overené, Z11]; povinné vystavenie je zatiaľ len návrh novely (1. 7. 2027) [čiastočne, Z14] | dnes [overené]; povinnosť [čiastočne] |
| **Ambulantný špecialista** | AIS rôznych dodávateľov | Správa pacientovi, kópia praktikovi, e-mail na vyžiadanie, eZpráva [čiastočne, Z2, Z8] | Koncept žiadosti z nástroja, príjem ako dokument | eŽádanka K, AAfD (draft) [overené, Z11] | [čiastočne] |
| **Poliklinika a RDG** | AIS alebo malý NIS; popis snímky ako dokument | Papier alebo PDF; snímky na CD (50 až 300 Kč) alebo cez ePACS [overené, Z19] | Popis ako dokument cez AI; pri snímkach **len stav** „doručené do PACS KOC“ | EHDS: snímky od 26. 3. 2031 [overené, Z28] | [overené] |
| **Laboratórium** | LIS; DASTA DS3/DS4 + NČLP [čiastočne, Z20; Z9] | Výsledok ide objednávajúcemu lekárovi; koordinátorovi ako PDF alebo cez eZprávu (PDF/A + DASTA) [overené, Z8] | **DASTA bez AI** → FHIR Observation (český lab. profil) [overené, Z10]; PDF cez AI; vlastné laboratórium KOC až po rozhraní do NIS | Laboratórna eŽádanka (návrh 1. 1. 2028) [čiastočne, Z14]; EHDS 2031 [overené, Z28] | [overené / čiastočne] |
| **NIS vlastného KOC** | STAPRO, ICZ, IKIS, Medicalc, Zlatokop; pri 9 až 10 z 15 KOC nevieme, ktorý [čiastočne, Z20] | Koordinátor pracuje priamo v NIS [overené, Z4] | **Fáza 0:** podklad MDT ako PDF, koordinátor ho sám vloží do NIS. **Po rozhodnutí:** rozhranie cez **existujúci** integračný engine nemocnice (demografia, vlastné laby, vloženie dokumentu), len so zmluvou a ponukou dodávateľa | To isté + spúšťanie appky z NIS (SMART on FHIR); podporu v českých NIS **nevieme** | [overené / odhad] |
| **NIS iného KOC** | iný dodávateľ | E-mail, telefón, eZpráva; CT cez ePACS [čiastočne, Z20] | Na vyžiadanie ako dokument | NCP: zákon dovoľuje odovzdať dokumentáciu na žiadosť ošetrujúceho poskytovateľa (§56b) [overené, Z13]; 30 z 37 poskytovateľov pripojených k 30. 8. 2026 [overené, Z15]; AAfD (draft) | [overené] |
| **Lieky (lékový záznam SÚKL)** | 5 rokov predpísaných a vydaných liekov, bez poľa „dokedy“ [overené, Z17] | Vidí ho lekár pri poskytovaní starostlivosti; koordinátor-nelekár: **nevieme** | Len ako text v správach; prístup nástroja tretej strany **nevieme** | EHDS: e-recept od 26. 3. 2029 [overené, Z28] | [overené / nevieme] |
| **VZP** | Dávky, B2B služby, Moje VZP | Vykázané výkony sa spracúvajú do 50 dní a vykazovať sa dá až 3 mesiace spätne [overené, Z16]: pre živú koordináciu nepoužiteľné | **Adresa registrujúceho lekára** cez B2B, ale len pre zmluvného poskytovateľa s certifikátom, teda cez KOC [overené, Z16] | Platobná páka (výkon 51887 už existuje [overené, Z5]); spätná analýza ciest [odhad] | [overené] |
| **Sdílený zdravotní záznam** | Štátny záznam: emergentné údaje, prevencia a skríning, **nie onkológia** [overené, Z12] | Nič onkologické | Nie | Cez certifikát KOC; prístup nelekára nevieme | [overené] |
| **Pacient sám** | Papiere, CD; EZKarta (prevencia, 10 laboratórnych parametrov za 5 rokov) [overené, Z18] | Prinesie na vyšetrenie, telefonuje | Koordinátor dokument naskenuje alebo prijme ako prílohu. **Verejný odkaz na nahranie bez účtu až po splnení podmienok IT** (antivírus, čistenie súborov, limity, overenie odosielateľa) [odhad, Z51: K1] | Súhlas „tretej osobe“ (§33 z. 325/2021); či platí pre KOC, nevieme [overené text, Z12] | [overené / nevieme] |
| **eŽádanka K** (koľajnica) | Štátna služba, API v2 s FHIR Bundle [overené, Z11] | Pilot od 1/2026, asi 2 000 žiadaniek všetkých typov do 6/2026 [čiastočne, Z14]; FHIR príručka K je len rozpracovaná verzia [overené, Z10] | Voliteľne test na testovacom prostredí T2 cez certifikát KOC [overené, Z11] | **Hlavný vstup**, keď bude povinná; prijať ju musí každý oprávnený poskytovateľ už dnes [overené, Z12] | [overené / čiastočne] |
| **Kmeňové registre a NRPZS** (koľajnica) | KRP (pacient, registrujúci lekár), NRPZS (verejný adresár pracovísk) | NRPZS je verejný: adresár pracovísk a kontaktov [overené, Z12] | NRPZS áno; KRP len cez certifikát KOC a len na poskytovanie zdravotných služieb (§24 ods. 2) [overené, Z12] | Overenie identity pacienta a praktika | [overené] |

**Tri závery [odhad]:**
1. **Všetko podstatné dnes prichádza ako dokument.** Jadrom je spoľahlivé vyťaženie s citátom a viditeľné medzery, nie integrácia.
2. **Najštruktúrovanejšie sú laboratórne výsledky** (DASTA + NČLP). Keď prídu cez eZprávu, čítame ich bez AI a bez rizika, že si AI niečo vymyslí.
3. **Plná automatizácia je do roka reálna len pri NIS vlastného KOC,** a aj to len so zmluvou, ponukou dodávateľa a peniazmi. Prístup k dátam bez zmluvy skončil v Hradci Králové (2015) škandálom [čiastočne, Z20].

---

## 4. Čo používajú lekári a koordinátori v ČR, na Slovensku a vo svete

| Kde | Nástroj alebo prax | Kto ho používa | Odkiaľ berie dáta | Poučenie pre nás | Zdroj |
|---|---|---|---|---|---|
| **ČR** | Telefón, e-mail, MS Forms alebo Word formulár, ePACS, NIS | Koordinátorky (Bulovka, MOÚ Brno, FN Olomouc) | Lekár zavolá alebo pošle formulár; snímky cez ePACS | Toto je náš vstup. Na Bulovke koordinátorka správy aj sama zháňa [čiastočne, Z7] | [overené, Z7] |
| **ČR** | eZpráva (zabezpečená lekárska pošta) | Ordinácie, nemocnice, laboratóriá (4 519 účtov k 6/2025) | Odosielateľ pošle správu (PDF/A + DASTA) | Najlepší bezpečný kanál k praktikovi; či dovolí automatický príjem treťou stranou, **nevieme** | [overené/firemné, Z8] |
| **ČR** | NIS v KOC (STAPRO, ICZ, IKIS, Medicalc, Zlatokop) | Nemocnica; koordinátor ho má používať „v plnom rozsahu“ | Vlastné dáta nemocnice | NIS nevidí dáta zvonku; výrobcovia nemajú verejné API | [overené, Z4; čiastočne, Z20] |
| **ČR** | „Pilotované koordinačné aplikácie“ MZ | Niektoré KOC (od 2/2026) | **Nevieme**; MZ ukázalo len ilustračný obrázok (zoznam pacientov, kalendár, úlohy, správy) | Aj MZ si predstavuje frontu a úlohy. Názov ani dodávateľ nie sú verejné | [overené, Z34] |
| **ČR** | MEDDI Onco | Pacient zadáva, sestra a lekár v MOÚ čítajú (od 2020) | Od pacienta (ePRO = pacient sám hlási, ako sa cíti) | Iná kategória (pacientska appka); možný budúci zdroj dát | [čiastočne, firemné, Z49] |
| **ČR** | MDT Copilot (zadanie Asseco na Rakathone) | Lekári na MDT | Rieši úplnosť podkladov a dohľadateľnosť tvrdení | Ten istý problém vidí aj výrobca NIS; potenciálny partner | [overené zadanie, Z53] |
| **SK** | eZdravie (NCZI) | Lekári cez certifikovaný IS | Zapisovať smie len systém s osvedčením; koordinátor nie je v zozname čitateľov (§5 ods. 6, náš výklad) | Bez partnera s certifikovaným IS sa k dátam nedostaneme | [overené, Z36] |
| **SK** | OnkoAsist | Lekári vo svojich IS (nadstavba) | eZdravie, archív snímok, register; dodávateľ Asseco CE, zmluva účinná od 12/2025, pilot 3 diagnózy | Štát stavia „cestu pacienta“ cez systémy lekárov, nie novú appku | [overené, Z36] |
| **SK** | Koordinátori NOÚ (od 9/2026), VšZP platí MDT v pilote 7 až 12/2026 | Onkoústav | IT systém sa nespomína | Rola koordinátora na SK len vzniká, platiaci zákazník zatiaľ nie je | [čiastočne, Z36] |
| **Anglicko** | Cancer 360 | Onkologické tímy v nemocniciach | Číta zo 7 až 8 druhov systémov, **nič nezapisuje späť**, vlastné sú len „úlohy“ (kto, čo, dokedy, eskalácia) | Presne náš vzor. Ale štátom podporený nástroj mal k 6/2026 len 6 nemocničných trustov | [overené, Z29] |
| **Anglicko** | Infoflex (Civica) | Koordinátori MDT | Lekár zadá odporúčanie vo svojom systéme (ICE), to sa samo prenesie a vznikne pracovný zoznam | Lekár nič nové nerobí; koordinátor má zoznam „čo vybaviť“ | [overené, Z44] |
| **Anglicko** | Somerset Cancer Register | Koordinátori MDT | HL7 prepojenia, ktoré vie udržiavať len dodávateľ | Najdrahšie je prepojenie, nie obrazovka; zámok na dodávateľa | [overené, Z45] |
| **Anglicko** | e-RS (elektronické odporúčania) | Praktici | Zo systému praktika | Roky okolo 52 %, rozhýbala ho platba od 1. 10. 2018 | [overené, Z31] |
| **Švédsko** | NPÖ (Inera) | Lekári | Čítanie záznamov iných poskytovateľov | Zákazníci nechcú „preskakovať“ do ďalšej appky; samostatná appka ostáva pre tých bez integrácie | [overené, Z30] |
| **Dánsko** | Sundhedsjournalen | Lekári | Otvára sa tlačidlom z lekárovho vlastného systému | Lekár ostáva vo svojom nástroji; dát od praktikov je aj tam málo | [čiastočne, Z50] |
| **Holandsko** | Vitaly / VECOZO „služba MDO“ | Tímy MDT | Z nemocničných systémov (HiX, Epic) | Poisťovne zaplatili celoštátnu službu; zavedenie v jednom regióne trvá 3 roky | [overené, Z32] |
| **Holandsko** | ZorgDomein | 95 % praktikov (firemný údaj) | Zabudované v systémoch lekárov | Úspech = je tam, kde lekár už pracuje; trvalo to vyše 20 rokov | [čiastočne, firemné, Z48] |
| **Estónsko** | Národné úložisko (povinné od 2008) | Všetci poskytovatelia | Musia posielať dokumenty | Ani zákon nedá úplné dáta: asi tretina poskytovateľov v 2024 neposlala nič | [čiastočne, Z39] |
| **USA** | Epic (zoznamy a úlohy navigátorov priamo v nemocničnom systéme) | Navigátori jednej nemocnice | Z vlastného záznamu | Kto má Epic, samostatnú appku nepotrebuje; v ČR jeden dominantný NIS nie je | [overené, lokálna konfigurácia, Z46] |
| **USA** | Oracle onkologický systém (ohlásený 23. 9. 2026) | Onkológovia, navigátori | Z vlastného záznamu | Veľkí výrobcovia idú do rovnakej funkcie; zatiaľ len plán | [overené, Z33] |
| **USA** | Roche navify Tumor Board | Koordinátori konzília | HL7/FHIR z nemocničného systému | Príprava konzília −30 %, ale až po plnom napojení a autor mal väzby na Roche | [overené, Z37] |
| **USA** | Direct (zabezpečený „lekársky e-mail“) | 58 % nemocníc ho v 2023 často používalo | Odosielateľ pošle | Zabezpečený e-mail funguje vo veľkom; eZpráva je jeho český príbuzný | [overené, Z47] |

**Päť poučení [odhad, zo zdrojov vyššie]:**
1. **Nikto nenúti lekárov do novej appky.** Úspešné nástroje berú dáta z toho, čo lekár robí (systém, e-mail, odporúčanie).
2. **Tvárou nástroja je zoznam úloh**, nie dashboard (Cancer 360, Infoflex, aj mockup MZ).
3. **Čítať zo zdrojov, nič do nich neprepisovať, vlastné sú len úlohy** (Cancer 360).
4. **Najdrahšie a najpomalšie je prepojenie** (SCR, Vitaly, navify); preto začíname bez neho.
5. **Šírenie rozhýbala platba alebo zákon** (e-RS, Holandsko, Estónsko), nie kvalita appky.

---

## 5. Architektúra v 3 vlnách

### 5.0 Spoločné jadro (rovnaké vo všetkých vlnách)

```
VSTUPY (čo lekári už používajú)          JADRO (používa len koordinátor)                        VÝSTUPY
 telefón ─► poznámka z hovoru ─────┐
 e-mail na rola-schránku KOC ──────┤  1 Fronta prípadov: stav, termín, kto je na ťahu
 eZpráva (PDF/A + DASTA) ──────────┤  2 Príjem a priradenie dokumentu k pacientovi a prípadu
 papier/CD od pacienta (sken) ─────┼► 3 Vyťaženie: DASTA bez AI, ostatné AI s citátom overeným kódom
 neskôr: eŽádanka K (FHIR) ────────┤  4 Úplnosť podľa zoznamu KOC k dátumu MDT, rozpory
 neskôr: NIS KOC (HL7 v2 / DASTA) ─┘  5 Kroky a úlohy (vlastník, termín, stav, eskalácia)  ─► podklad MDT (PDF + FHIR) do NIS KOC
                                       6 Potvrdenie: koordinátor so zdrojom, lekár KOC     ─► potvrdenie prijatia praktikovi
                                       7 Záznam o koordinovaní + auditný log               ─► záver MDT (podpíše/zapečatí nemocnica)
```

**Šesť pravidiel jadra [odhad, opiera sa o Z1, Z3, Z13, Z24, Z29]:**
1. **Zdroj je pravda.** Do zdrojov nepíšeme. Jediný výstup je hotový dokument, ktorý do NIS vloží KOC.
2. **Každé pole má pôvod:** dokument, doslovný citát, kanál, dátum prijatia. Bez overeného citátu sa pole neukáže ako fakt.
3. **Chýbajúce sa označí, nikdy nedopĺňa.** Rozpor sa ukáže, nerozhoduje sa.
4. **AI iba navrhuje.** Nemá nástroje, ktoré niečo odošlú alebo zmažú. Rozhoduje človek.
5. **Žiadne klinické hodnotenie:** žiadne skóre, poradie podľa zdravotných dát, odporúčanie liečby.
6. **Nie sme register pacientov:** úložisko je pracovný priestor jedného prípadu v jednom KOC, s lehotou vymazania podľa KOC; originál ostáva u zdroja a v NIS [overené rada, Z3].

### 5.1 Vlna A: hackathon (do soboty 17. 10. 2026, 13:00)

**Cieľ:** funkčný priechod fiktívnej pacientky Aleny Procházkovej (13 správ) cez všetkých 6 požiadaviek zadania [overené, Z1] a jasný príbeh cesty k realite.

| Komponent | Čo robí | Skutočné / simulované |
|---|---|---|
| Webové UI koordinátora | 3 obrazovky z §2 | skutočné |
| Simulovaná rola-schránka | Správy „prichádzajú“ podľa dátumov (priečinok alebo testovacia schránka) | simulované |
| FHIR úložisko | **IRIS for Health** (InterSystems, dostupné vo VZP Azure [overené, Z35]); záloha: rovnaké FHIR zdroje ako JSON súbory | skutočné |
| Vyťaženie | LLM na fiktívnych dátach + kontrola citátov kódom; DASTA parser len ako „biele miesto“ (v balíku DASTA súbory nie sú [čiastočne, Z1]) | skutočné |
| Úplnosť a rozpory | Kontrola voči `Handover_obsah` k zvolenému dátumu | skutočné |
| Kroky cesty | Úlohy so stavom a termínom, eskalácia | skutočné |
| Podklad MDT | PDF podľa `MDT_zapis` + FHIR dokument | skutočné |
| Záver praktikovi | Odoslanie a doklad doručenia | **doručenka simulovaná** (povedať nahlas) |
| Záznam o koordinovaní, auditný log | Panely v UI | skutočné |
| Biele miesta | eZpráva/DASTA, NIS KOC, eŽádanka K, KRP/RID: popísané adaptéry bez spojenia | len popis |

**Čo vypúšťame oproti návrhu A (podľa K2):** dva FHIR servery (KOC 1 a KOC 2), vektorové vyhľadávanie, detail Slovenska a vlny C v demu. Patria na slajd [odhad, Z51].

**Čo je nové pre lekára:** nič. Praktik v deme pošle e-mail ako dnes a dostane potvrdenie prijatia a záver MDT ako dnes.
**Čo je nové pre koordinátora:** jedna fronta namiesto pošty, tabuliek a papierových poznámok; podklad MDT sa skladá sám a ukazuje, čo chýba.

### 5.2 Vlna B: pilot v jednom KOC

**Verdikt kritiky IT (K1):** fiktívna vlna A je v poriadku; vlnu B v pôvodnej podobe by IT nepodpísalo a ostrá prevádzka v 2. mesiaci je nereálna, skôr o 9 až 12 mesiacov [odhad, Z51]. Preto pilot delíme.

**Výber KOC (kritériá) [odhad]:** známy NIS a ochotný dodávateľ (doložené čiastočne: VFN = STAPRO, FN Olomouc = IKIS, FN Ostrava = Medical Systems, KN Liberec = Medicalc [čiastočne, Z20]); koordinátorka, ktorá už pracuje s e-mailom a formulárom [overené, Z7]; ideálne centrum HPB, kde je e-mail koordinátora predpísaný [overené, Z6]; ochotný DPO a IT. Rozsah: jedna skupina MDT, 1 až 3 koordinátori.

**Kroky pilotu [odhad, podľa K1]:**

| Krok | Čo | Čo sa ešte nerobí |
|---|---|---|
| **B-príprava** | Jedna strana pre IT (účel, tok dát, kto má administrátorský prístup); DPA + bezpečnostné prílohy; návrh DPIA; pentest; prihlásenie cez SSO nemocnice s MFA; meranie presnosti na syntetických dátach (podiel polí bez opravy, **nula nepravdivých citátov**); ponuka dodávateľa NIS na import dokumentu **ešte pred podpisom**; **zmerať dnešný stav** (minúty koordinátora na prípad, dnes ich nikto nemeral [nepodložené, Z7]) | žiadne reálne dáta |
| **B0: Fáza 0 bez rozhrania (3 mesiace)** | **Jedna** rola-schránka (aplikácia má prístup len k nej, nie k celej pošte [overené, Z41]); poznámky z telefonátov; príjem eZprávy, ak to prevádzkovateľ dovolí; AI v EÚ; fronta, úplnosť, kroky, koncepty žiadostí; **podklad MDT ako PDF, ktorý koordinátor sám vloží do NIS**; záver MDT vytvorí a podpíše alebo zapečatí nemocnica v NIS a odošle svojím kanálom, nástroj eviduje odoslanie a doručenie | rozhranie do NIS; verejný formulár; odkaz pre pacienta |
| **Rozhodnutie po 3 mesiacoch** | Podľa meraní: dni do úplného podkladu, podiel prípadov s úplným podkladom v deň MDT, minúty na prípad, podiel záverov s dokladom doručenia, chyby v priradení dokumentu k pacientovi | – |
| **B1: rozhranie (ak áno)** | Cez **existujúci integračný engine nemocnice** (nie druhý engine vedľa neho): demografia a pobyty (HL7 v2 ADT), vlastné laboratórium, vloženie dokumentu do NIS. Odhad 0,3 až 1 mil. Kč + ročná podpora, 3 až 6 mesiacov od objednávky [odhad, Z51] | – |
| **B1 voliteľne** | Formulár bez registrácie, len ak IT splní podmienky: antivírus, čistenie súborov, limity, overenie odosielateľa; test eŽádanky K a KRP na T2 cez certifikát KOC [overené T2, Z11] | – |

**Koľko stoja rozhrania do NIS (verejné zmluvy) [overené, Z42]:** Havlíčkův Brod, lekárenský systém ↔ NIS STAPRO, len strana lekárenského systému: 397 500 Kč bez DPH (2022); Třebíč, hotový modul STAPRO na hlásenie infekcií so štátnou väzbou a ročnou podporou: 101 150 Kč bez DPH (2025); UN Bratislava, modul NIS STAPRO na overovanie liekov: 14 895 € (2021). Služby do 3 mil. Kč bez DPH sú zákazka malého rozsahu bez zákonného zadávacieho konania [overené, Z43]; či spadá pod zákazky bezplatný pilot, **nevieme**.

**AI (LLM) v pilote [overené, Z26]:** priame API Anthropic nemá EÚ región (len „us“ alebo „global“). Azure OpenAI „Data Zone EU“ spracúva v EÚ, ale predvolene môže podozrivé vstupy čítať zamestnanec Microsoftu (v EHP); vypnúť sa to dá len po schválení žiadosti. Bedrock má EÚ profil, regióny treba overiť. Pseudonymizácia českého textu (skloňované mená) riziko len znižuje [odhad, Z51].

**Čo je nové pre lekára:** nič. Praktik nedostane účet ani odkaz s prihlásením. Dostane potvrdenie prijatia a zoznam chýbajúceho tým kanálom, ktorým písal, a záver MDT ako doteraz, len spoľahlivo a s dokladom.
**Čo je nové pre lekára KOC:** nič; podklad MDT nájde v NIS ako dokument a potvrdí ho, ako je zvyknutý [odhad].
**Čo je nové pre koordinátora:** fronta a úlohy, koncepty žiadostí, podklad, ktorý sa skladá sám, záznam o koordinovaní; v NIS pracuje ďalej, ako jej ukladá Věstník [overené, Z4].

### 5.3 Vlna C: národná verzia (2027 až 2031+)

**Cieľový stav [odhad]:** praktik vystaví eŽádanku K vo svojom AIS; KOC ju dostane ako FHIR Bundle; nástroj si ostatné dokumenty vyhľadá u pôvodcov cez AAfD (IHE MHD); laboratórne výsledky prídu štruktúrovane; identita ide cez KRP; záver MDT ide späť do AIS praktika. Koordinátor rieši len výnimky. AI ostane na staré a voľnotextové dokumenty.

| Koľajnica | Stav k 16. 10. 2026 | Zdroj |
|---|---|---|
| eŽádanka K | API v2 na teste T2; povinnosť vystaviť je návrh novely; FHIR príručka K je rozpracovaná | [overené, Z10, Z11; čiastočne, Z14] |
| AAfD / IHE MHD | štandard AAfD je draft (16. 3. 2026) | [overené, Z11] |
| NCP | §56b dovoľuje; 30 z 37 pripojených; formát CDA, nie FHIR | [overené, Z13, Z15] |
| KRP, NRPZS | tretia strana len cez poskytovateľa; NRPZS verejný | [overené, Z12] |
| EHDS | e-recept a súhrn pacienta od 26. 3. 2029; snímky, laboratóriá, prepúšťacie správy od 26. 3. 2031 | [overené, Z28] |
| Onkologický FHIR profil v ČR | neexistuje | [overené, Z10] |

**VZP ako „komunikačný uzol“:** v zadaní je to jedna veta v poznámkach k slajdu 2 [overené, Z1]; čo presne VZP myslí, **nevieme**. Čo dáva zmysel [odhad]: (1) **páka**: VZP už platí výkon 51887 [overené, Z5], napríklad bonus za doložené uzavretie slučky by bol rozhodnutím VZP a MZ; (2) **smerovanie**: VZP vie, kto je registrujúci lekár (B2B, len cez zmluvného poskytovateľa) [overené, Z16]; (3) **nie úložisko**: VZP dnes obsah dokumentácie nedostáva [overené, Z16] a štátne AAfD sú smerovač, nie archív [čiastočne, Z3].

**Federácia [odhad]:** každé KOC má vlastnú inštanciu (je správca dát). Presun pacienta medzi KOC ide cez štandard (FHIR, MHD), nie cez spoločnú databázu. **Distribúcia [odhad]:** ako modul alebo API pre dodávateľov NIS, prípadne cez platcu.

**Čo je nové pre lekára:** eŽádanka v jeho AIS, ak ju štát urobí povinnou. Je to štátna povinnosť, nie naša appka.
**Čo je nové pre koordinátora:** menej prepisovania, viac práce s výnimkami.

### 5.4 Slovensko (stručne)
Verejné API na dáta pacientov nie je, do eZdravia smie len systém s osvedčením a koordinátor nie je v zákonnom zozname čitateľov [overené, Z36; zaradenie je náš výklad]. Realisticky [odhad]: rovnaký príjem dokumentov u koordinátora a čítanie eZdravia len cez partnera s certifikovaným IS (napr. Asseco CE, ktorý dodáva OnkoAsist). Platiaci zákazník na SK zatiaľ nie je.

---

## 6. Bezpečnosť a právo: checklist pre každú vlnu

_Nie sme právnici. Pred pilotom treba právnika a DPO nemocnice._

### 6.1 Vlna A (hackathon)
- [ ] Len fiktívne dáta zo zadania; reálne osobné dáta sú bez písomného oprávnenia zakázané [overené, Z38].
- [ ] Údaje pacientky (aj fiktívne RČ a telefóny) nedávať do gitu ani do logov [odhad].
- [ ] V UI viditeľne: „Prototyp pre Rakathon, nie zdravotnícka pomôcka, fiktívne dáta“ [overené pravidlá, Z38].
- [ ] AI bez nástrojov, ktoré niečo odošlú alebo zmažú; dokument je dáta, nie príkaz (obrana proti „prompt injection“, teda skrytému príkazu v texte) [overené riziko, Z26: OWASP].
- [ ] Citát overený kódom; chýbajúce len označiť; rozpor nerozhodovať.
- [ ] Auditný log a záznam o koordinovaní ako ukážka.
- [ ] Konfigurácia „LLM endpoint“ prepínateľná na EÚ (ukázať, nie tvrdiť).
- [ ] Netvrdiť: „GDPR compliant“, „napojené na NIS“, „AI rozhodne“, „lieky dokedy“, „certifikované“, „anonymizované“ [odhad, Z51].
- [ ] Správne názvy: zákon 325/2021 Sb. je o elektronizácii zdravotníctva, kybernetický je 264/2025 Sb. [overené, Z12, Z23].

### 6.2 Vlna B (pilot), pred spustením
- [ ] **Roly:** KOC = správca, my = spracovateľ; **DPA podľa čl. 28 GDPR** a bezpečnostné ustanovenia podľa **prílohy 5 vyhlášky 409/2025** (audit, podzhotovitelia, hlásenie incidentov, exit, likvidácia dát, žiadosti cudzích orgánov) [overené, Z21, Z23].
- [ ] **Zoznam podspracovateľov s regiónmi** (cloud, LLM) [overené, Z21].
- [ ] **DPIA** robí KOC, my dodáme návrh; česká výnimka pre lekára bez spracovateľa sa na nás nevzťahuje [overené, Z21].
- [ ] **Právny základ:** GDPR čl. 9 ods. 2 písm. h); zákon 372/2011 §51 ods. 2 písm. a) a §65 ods. 2 písm. a). **Otvorené:** je koordinátor „iný odborný pracovník“? Otázka na DPO [overené text, Z13].
- [ ] **Jedna strana pre IT:** účel, tok dát, kto má administrátorský prístup [odhad, Z51].
- [ ] **Písomný zamýšľaný účel (MDR):** „zhromažďovanie dokumentov, kontrola úplnosti voči zoznamu nemocnice, sledovanie úloh a lehôt; nie diagnostika, voľba liečby ani určovanie naliehavosti“ [overené pokyn, Z24; text odhad].
- [ ] **SSO nemocnice + MFA** pre všetkých používateľov [overené, Z23: vyhl. 409/2025 §19 ods. 2 podľa K1].
- [ ] **Pošta:** prístup aplikácie len k jednej rola-schránke („RBAC for Applications“), široké povolenie Mail.Read odobrať [overené, Z41].
- [ ] **LLM v EÚ** (Azure Data Zone EU s požiadavkou na vypnutie ľudskej kontroly, alebo Bedrock EÚ po overení regiónov, alebo model u nemocnice); **nie priame API Anthropic**; zákaz trénovania na dátach [overené, Z26].
- [ ] **Pseudonymizácia** pred LLM; rodné číslo a číslo poistenca nikdy do LLM; stále sú to osobné údaje [overené definícia, Z21].
- [ ] **Test prompt injection** na zákerných PDF [odhad, Z51].
- [ ] **Párovanie dokumentu k pacientovi:** pravidlá, meraná chybovosť, pri nejasnosti potvrdí človek (zlé priradenie = únik k inému pacientovi) [odhad, Z51].
- [ ] **Logy:** zaznamenať všetky činnosti v dokumentácii, nemenne (vyhl. 444/2024 §6, §7); logy prístupov aspoň 18 mesiacov (vyhl. 409/2025 §22) [overené, Z22, Z23].
- [ ] **Pentest** pred spustením a po veľkej zmene [overené, Z23: vyhl. 409/2025 §24 ods. 5 podľa K1].
- [ ] **Retencia:** originál je v NIS a u zdroja, u nás pracovná kópia s lehotou vymazania podľa KOC; export a vymazanie pri ukončení [odhad].
- [ ] **Záver MDT praktikovi** = dokumentácia odoslaná inej osobe: časové razítko + pečať nemocnice alebo uznávaný podpis zdravotníka (§55a ods. 4); e-mailová doručenka to nenahradí [overené, Z13].
- [ ] **E-mail:** ÚOOÚ neodporúča posielať celé lekárske správy obyčajným e-mailom; preferovať eZprávu; v tele e-mailu žiadne zdravotné údaje [overené, Z27].
- [ ] **Incidenty:** kontakt 24/7 a poistenie dodávateľa; regulovaná nemocnica hlási NÚKIB prvotne do 24 hodín, my jej teda skôr [overené podľa výťahu zákona 264/2025, Z23; lehota pre nás odhad].
- [ ] **Verejné zákazky:** služby do 3 mil. Kč bez DPH = zákazka malého rozsahu [overené, Z43]; bezplatný pilot: **nevieme**, právnik KOC.
- [ ] **Je pilot s meraním presnosti na reálnych dátach výskum** (etická komisia)? **Nevieme**, DPO [nepodložené].

### 6.3 Vlna C (národne)
- [ ] Režim dodávateľa podľa kyberzákona v každom KOC; pentest aspoň raz za 2 roky pri vyššom režime [overené, Z23].
- [ ] Štátne služby len cez certifikát EZCA II každého KOC; KRP len na poskytovanie zdravotných služieb (§24 ods. 2, pokuta do 50 000 Kč) [overené, Z11, Z12].
- [ ] Posúdiť, či sme „EHR systém“ podľa EHDS (zobrazujeme a importujeme laboratórne výsledky a správy): **nevieme** [overené definícia, Z28].
- [ ] Ak by pribudli klinické funkcie: MDR trieda IIa a vyššia s notifikovanou osobou a zároveň vysokoriziková AI podľa AI Act (pre výrobky termín 2. 8. 2028) [overené, Z24; čiastočne, Z25].
- [ ] Odpoveď pacientovi „kto sa pozeral na moje dáta“ (čl. 15 GDPR) z auditného logu [overené, Z21].

---

## 7. Čo postavíme do soboty 13:00 a čo povieme v pitchi

### 7.1 Čo musí demo ukázať (8 krokov, podľa K2 a slajdu 12 decku)

| # | Krok dema | Požiadavka zadania [Z1] |
|---|---|---|
| 1 | Úvodná obrazovka = fronta prípadov: Alena + 2 fiktívne riadky, stav, termín, kto je na ťahu | Koordinovat (deck: „kto je na ťahu“) |
| 2 | E-mail praktika so správou 07 „príde“, založí sa prípad, praktikovi odíde **automatické potvrdenie prijatia a zoznam chýbajúceho** | Převzít |
| 3 | Koncepty žiadostí o správy 01 až 06 so správnym adresátom; správy postupne prichádzajú | Vyžádat a shromáždit |
| 4 | Medzery a rozpory: chýba ECOG; dátum apixabanu v správe 09; histológia „vydaná“ 19. 10. pred „odberom“ 20. 10. v správe 11; chýba e-mail pacientky a praktika; všetky onkomarkery (aj CA 125) [čiastočne, Z2: naše čítanie] | Vytěžit |
| 5 | Klik na údaj → citát zvýraznený v pôvodnej správe; na obrazovke „0 polí bez citátu“ | Vytěžit |
| 6 | Kroky s termínom a eskaláciou: vyžiadané ≠ objednané ≠ vykonané; histológia sľúbená do 3 pracovných dní prišla neskôr → eskalácia [čiastočne, Z2] | Koordinovat |
| 7 | Prepínač „stav k 21. 10. 2026“: váha 63 kg zo správy 12 (26. 10.) a správy 12 a 13 sa v podklade neobjavia; použije sa 65 kg z 15. 9. s dátumom [čiastočne, Z2] | Připravit podklad pro MDT |
| 8 | Podklad podľa `MDT_zapis` (PDF), potvrdenie lekárom KOC (simulované), záver praktikovi a doklad doručenia (simulovaný, povedať nahlas); záznam o koordinovaní a auditný log | Uzavřít smyčku |

### 7.2 Čo postavíme (priority)

| Priorita | Čo | Dátová kocka FHIR |
|---|---|---|
| **Musí** | Načítanie 13 správ ako dokumentov prípadu | DocumentReference + Binary, Patient, EpisodeOfCare |
| **Musí** | Vyťaženie 20 polí `Handover_obsah` s citátom a kontrolou citátu kódom; stav poľa (potvrdené, návrh, chýba, rozpor) | Condition, Observation, MedicationStatement, AllergyIntolerance, DiagnosticReport, Procedure + **Provenance** (dokument, citát) |
| **Musí** | Fronta prípadov a detail prípadu (bloky A až F) | Task (vlastník, termín, stav), EpisodeOfCare |
| **Musí** | Prepínač „k dátumu“ a podklad MDT ako PDF | Composition (podľa `MDT_zapis`) |
| **Musí** | Záver praktikovi + simulovaná doručenka | Communication |
| **Mal by** | Koncepty žiadostí a automatické potvrdenie prijatia | Task + Communication (stav „koncept“) |
| **Mal by** | Záznam o koordinovaní a auditný log | AuditEvent, história Task |
| **Mal by** | Kontrola úplnosti jedným dotazom cez SQL nad FHIR v IRIS (bod pre cenu InterSystems) | – |
| **Ak zostane čas** | Popis „bielych miest“ (eZpráva/DASTA, NIS, eŽádanka K, KRP) ako prázdne adaptéry | – |
| **Nerobiť** | Reálne dáta; graf labov; „lieky dokedy“; skóre; odporúčania; vlastná eŽiadanka; dva FHIR servery; vektorové vyhľadávanie; automatické posielanie revíznemu lekárovi (deck ho spomína [čiastočne, Z1], kanál nevieme) | – |

**Poradie práce [odhad]:** (1) dáta do úložiska (IRIS, inak JSON v tvare FHIR); (2) vyťaženie s citátom a kontrolou kódom, lebo na tom stojí dôvera; (3) fronta a detail prípadu; (4) úplnosť, rozpory a prepínač k dátumu; (5) kroky a eskalácia; (6) PDF podkladu, záver a doručenka; (7) záznam o koordinovaní a log; (8) záložná nahrávka dema a slajdy. **Pravidlo:** najprv jeden úplný priechod, až potom vylepšovanie.

**Odovzdanie:** sobota 13:00 na `submit.rakathon.cz`, povinný titulný obrázok 16:9 do 8 MB; či sú GitHub a video povinné, nevieme [čiastočne, Z52]. Zadávatelia obchádzajú tímy v sobotu 14:00 až 16:00 a rozhoduje hlavne využiteľnosť v praxi [čiastočne, Z52].

### 7.3 Čo povieme v pitchi

**Hlavná veta [odhad]:** „Nič sa nestratí a vždy vieš, kto je na ťahu.“ (Nie „AI vyťaží dokumenty“.)

**Cesta k realite v 3 vetách [odhad]:**
1. „Dnes beriem to, čo koordinátorovi reálne chodí: telefón, e-mail na spoločnú adresu a eZprávu. Ministerstvo od septembra predpisuje centrám HPB presne e-mail a telefón koordinátora.“ [overené, Z6]
2. „Pilot je jedno KOC: najprv tri mesiace bez rozhrania, podklad ako PDF do NIS a meranie; až potom rozhranie cez engine nemocnice. Lekár sa nič nové neučí a nedostane žiadny účet.“
3. „Keď bude eŽádanka K povinná a spustí sa štátna výmena dokumentov, napojíme sa cez certifikát KOC. Výstup už dnes ukladáme vo FHIR.“ [overené stav, Z10, Z11]

**Prečo e-mail a nie portál pre praktika (deck si predstavuje „jedno digitálne miesto“ [čiastočne, Z1]):** naše jedno miesto je **u koordinátora**. Praktikovi by portál pridal účet, heslo a MFA [overené, Z23], a dobrovoľné elektronické kanály stáli v Anglicku roky okolo 52 %, kým ich nezapla platba [overené, Z31]. Českí praktici odmietajú nové povinnosti bez fungujúceho softvéru a kompenzácie [overené, Z40]. Praktik preto dostane len to, čo dnes nemá: potvrdenie prijatia a zoznam toho, čo chýba.

**Čísla, ktoré môžu byť na obrazovke:** počet polí s citátom, počet potvrdených bez opravy, počet medzier a rozporov, „0 polí bez citátu“. **Nepoužiť ako náš výsledok:** Missouri −30 % (iná krajina, nástroj Roche, autor s väzbami na Roche) [overené, Z37].

**Nehovoriť:** „napojené na NIS“, „lieky dokedy“, „AI rozhodne“, „GDPR compliant“, „nasadené“, „VZP uzol“ ako hotová vec [odhad, Z51].

---

## 8. Otvorené otázky na mentorov (8)

1. **Koordinátorky (Vaňková, Chrástová):** Akým kanálom vám reálne prichádzajú žiadosti a správy, koľko minút trvá jeden prípad pre MDT a ako dnes vediete záznam o koordinovaní?
2. **MZ (Rybář, Bielčiková):** Ktoré koordinačné aplikácie sa v KOC pilotujú od februára 2026 a odkiaľ berú dáta?
3. **VZP (Hlavinka, Bartyzal):** Čo presne má robiť „komunikačný uzol vo VZP“ (smerovať, notifikovať, platiť) a je VZP ochotná viazať platbu na doložené uzavretie slučky?
4. **Autorky decku:** Stačí ako „jedno digitálne miesto“ rola-schránka KOC a eZpráva, alebo trváte na portáli, kam praktik nahrá správy?
5. **IT KOC:** Aký máte NIS, kto spravuje certifikát EZCA II, máte schránku v eZpráve a vie váš NIS prijať dokument cez rozhranie (za koľko)?
6. **DPO KOC:** Je koordinátor „iný odborný pracovník“ podľa §65 zákona 372/2011 a smieme prijímať správy na rola-schránku?
7. **Lekári KOC:** Ako dnes podpisujete alebo pečatíte záver MDT pre praktika (§55a ods. 4) a ktorým kanálom ho posielate?
8. **NCEZ a eZprava.net:** Môže dodávateľ koordinačného nástroja volať eŽádanku K a KRP certifikátom KOC a dovolí eZpráva automatický príjem treťou stranou pre KOC?

---

## 9. Dáta pre vizualizáciu (zdroje a toky pre každú vlnu, aktualizované podľa kritík)

```json
{
  "sources": [
    {"id": "praktik_ais", "name": "Praktický lekár", "system": "AIS (CGM a MEDaX spolu asi 70 %, ústne na pre-hacku; presné podiely nevieme)", "channel_today": "telefón, e-mail s PDF/Word, webový alebo Word formulár KOC, eZpráva, papier cez pacienta; eŽádanka K len pilotne", "auto": "ciastocne", "how": "rola-schránka KOC, poznámka z telefonátu alebo eZpráva → AI návrh s citátom overeným kódom → potvrdí koordinátor; pull z AIS nie (verejné API nedoložené); praktik nedostáva účet ani odkaz s prihlásením, len potvrdenie prijatia a zoznam chýbajúceho", "law": "zákon 372/2011 §45 ods. 2 písm. f, g; §51 ods. 2 písm. a; GDPR čl. 9 ods. 2 písm. h"},
    {"id": "specialista_ais", "name": "Ambulantný špecialista", "system": "AIS rôznych dodávateľov", "channel_today": "správa pacientovi a kópia praktikovi, e-mail na vyžiadanie, eZpráva, telefón", "auto": "ciastocne", "how": "koncept žiadosti z nástroja so správnym adresátom, príjem ako dokument, AI návrh s citátom, potvrdí koordinátor", "law": "zákon 372/2011 §45 ods. 2 písm. g; §51 ods. 2 písm. a; GDPR čl. 9 ods. 2 písm. h"},
    {"id": "poliklinika", "name": "Poliklinika (ambulancie + RDG)", "system": "AIS alebo malý NIS; popis snímky ako dokument", "channel_today": "správy a popisy v papieri alebo PDF, e-mail, eZpráva; snímky na CD (50 až 300 Kč) alebo cez ePACS", "auto": "ciastocne", "how": "popis ako dokument cez AI s citátom; pri snímkach len stav doručenia do PACS KOC", "law": "zákon 372/2011 §45, §51; GDPR čl. 9 ods. 2 písm. h"},
    {"id": "laboratorium", "name": "Laboratórium", "system": "LIS, DASTA DS3/DS4 + NČLP", "channel_today": "výsledok ide objednávajúcemu lekárovi; koordinátorovi ako PDF alebo cez eZprávu (PDF/A + DASTA)", "auto": "ciastocne", "how": "DASTA parser bez AI → FHIR Observation (CZ lab IG, NČLP); PDF cez AI s citátom; zobrazenie ako tabuľka, nie graf; vlastné laboratórium KOC až po rozhraní do NIS", "law": "zákon 372/2011 §45, §51; vyhláška 444/2024"},
    {"id": "radiologia_pacs", "name": "Rádiológia / PACS", "system": "PACS pracoviska; ePACS medzi nemocnicami", "channel_today": "popis ako dokument; snímky cez ePACS alebo na CD", "auto": "ciastocne", "how": "popis cez AI s citátom; snímky len stav (doručené do PACS KOC); DICOM v nástroji netreba", "law": "zákon 372/2011 §45, §51"},
    {"id": "nis_vlastny_koc", "name": "NIS vlastného KOC", "system": "STAPRO, ICZ, Medical Systems IKIS, Medicalc, Zlatokop; pri 9 až 10 z 15 KOC nevieme", "channel_today": "koordinátor pracuje priamo v NIS (Věstník MZ 11/2025 čl. 6)", "auto": "ciastocne", "how": "Fáza 0: podklad MDT ako PDF vloží koordinátor ručne; po rozhodnutí: rozhranie cez existujúci integračný engine nemocnice (HL7 v2 ADT, vlastné laby, vloženie dokumentu), len so zmluvou a ponukou dodávateľa; verejné zmluvy na podobné rozhrania okolo 100 tisíc Kč a viac + ročná podpora", "law": "KOC je správca; zákon 372/2011 §65 ods. 2 písm. a (rola koordinátora nejasná); GDPR čl. 28; príloha 5 vyhlášky 409/2025"},
    {"id": "nis_iny_koc", "name": "NIS iného KOC", "system": "iný dodávateľ NIS", "channel_today": "e-mail, telefón, eZpráva; CT snímky cez ePACS", "auto": "ciastocne", "how": "dnes len na vyžiadanie ako dokument; neskôr NCP (CDA, §56b) a AAfD (IHE MHD, draft) cez certifikát KOC", "law": "zákon 372/2011 §45 ods. 2 písm. g; §56b"},
    {"id": "vzp", "name": "VZP", "system": "dávky, B2B služby, Moje VZP", "channel_today": "vykázané výkony sa spracúvajú do 50 dní a vykazovať sa dá až 3 mesiace spätne; B2B len pre zmluvného poskytovateľa s certifikátom", "auto": "nie", "how": "pre živú koordináciu nepoužiteľné; adresa registrujúceho lekára cez B2B len cez KOC; výkon 51887 (250 Kč, max 1× denne) ako signál; neskôr platobná páka a spätná analýza ciest; nie úložisko dokumentov", "law": "zmluva poskytovateľa s VZP a certifikát; tretia strana prístup nemá"},
    {"id": "erecept_lieky", "name": "eRecept a lékový záznam", "system": "SÚKL lékový záznam: 5 rokov predpísané a vydané lieky, dávkovanie, lekár, lekáreň, dátum výdaja; pole dokedy nie je", "channel_today": "lekár ho vidí pri poskytovaní starostlivosti; pacient v aplikácii eRecept", "auto": "nie", "how": "lieky len tak, ako stoja v správach, s dátumom a citátom; prístup koordinátora-nelekára alebo nástroja tretej strany nevieme; nič nedopočítavať", "law": "zákon 378/2007 o léčivech; pacient môže namietať"},
    {"id": "sdileny_zaznam", "name": "Sdílený zdravotní záznam", "system": "štátny záznam: emergentné údaje + prevencia a skríning, nie onkológia", "channel_today": "zdravotník s oprávnením cez NIS/AIS", "auto": "nie", "how": "pre onkologickú koordináciu dnes nič; neskôr cez certifikát KOC; prístup nelekára nevieme", "law": "zákon 325/2021 §34a; opt-out pacienta"},
    {"id": "pacient", "name": "Pacient sám", "system": "papiere, CD; EZKarta (prevencia, 10 laboratórnych parametrov za 5 rokov); MEDDI Onco (ePRO)", "channel_today": "prinesie na vyšetrenie, telefonuje", "auto": "ciastocne", "how": "koordinátor dokument naskenuje alebo prijme ako prílohu → AI s citátom; verejný odkaz na nahranie bez účtu až po splnení podmienok IT (antivírus, čistenie súborov, limity, overenie odosielateľa); export z EZKarty nevieme", "law": "GDPR čl. 9 ods. 2 písm. h; zákon 325/2021 §33 (súhlas tretej osobe, pre KOC nevieme)"},
    {"id": "ezadanka_k", "name": "eŽádanka K (koľajnica)", "system": "štátna služba eŽádanky, API v2 (FHIR Bundle)", "channel_today": "pilot od 1/2026, asi 2 000 žiadaniek všetkých typov do 6/2026", "auto": "nie", "how": "API v2 na teste T2 cez certifikát KOC; produkcia nevieme; FHIR príručka K je rozpracovaná; prílohy ako dokumenty cez AI", "law": "zákon 325/2021 §31a; prijať ju musí každý oprávnený poskytovateľ; povinné vystavenie len návrh novely (1. 7. 2027)"},
    {"id": "kmenove_registre", "name": "Kmeňové registre a NRPZS (koľajnica)", "system": "KRP (pacient, registrujúci lekár), KRZP, KRPZS; NRPZS verejný", "channel_today": "NIS KOC ich volá systémovým certifikátom", "auto": "ciastocne", "how": "NRPZS ako otvorené dáta = adresár pracovísk pre koncepty žiadostí; KRP overenie pacienta len cez certifikát KOC", "law": "zákon 325/2021 §16 až 25; §24 ods. 2 len na poskytovanie zdravotných služieb"}
  ],
  "waves": [
    {
      "name": "A: Hackathon MVP (do 17. 10. 2026, 13:00)",
      "components": ["Fronta prípadov: stav, termín, kto je na ťahu, meškanie (poradie len podľa termínov)", "Simulovaná rola-schránka s 13 fiktívnymi správami", "FHIR úložisko IRIS for Health (záloha: JSON v tvare FHIR)", "AI vyťaženie s citátom overeným kódom", "Kontrola úplnosti podľa Handover_obsah, rozpory a prepínač stav k 21. 10. 2026", "Koncepty žiadostí o chýbajúce správy (neodosielajú sa) a automatické potvrdenie prijatia praktikovi", "Kroky cesty: vyžiadané → objednané → vykonané → výsledok, s eskaláciou", "Podklad MDT podľa MDT_zapis (Composition + PDF), potvrdenie lekárom KOC simulované", "Záver MDT praktikovi so simulovanou doručenkou", "Záznam o koordinovaní (dni s intervenciou, podklad pre výkon 51887)", "Auditný log", "Biele miesta (len popis): eZpráva/DASTA, NIS KOC, eŽádanka K, KRP/RID"],
      "flows": [
        {"from": "Praktik", "to": "Rola-schránka", "what": "epikríza a žiadosť o prevzatie (správa 07)", "standard": "e-mail + príloha (simulované)"},
        {"from": "Nástroj", "to": "Praktik", "what": "automatické potvrdenie prijatia a zoznam chýbajúceho", "standard": "FHIR Communication (kanál simulovaný)"},
        {"from": "Koordinátor", "to": "Pracoviská 01 až 06", "what": "žiadosť o chýbajúce správy", "standard": "FHIR Task + koncept e-mailu (neodoslaný)"},
        {"from": "Rola-schránka", "to": "FHIR úložisko", "what": "prijatý dokument", "standard": "FHIR DocumentReference + Binary"},
        {"from": "FHIR úložisko", "to": "AI vyťaženie", "what": "text dokumentu (fiktívne dáta)", "standard": "REST + LLM API"},
        {"from": "AI vyťaženie", "to": "FHIR úložisko", "what": "návrh polí s citátom", "standard": "FHIR Condition, Observation, MedicationStatement, AllergyIntolerance + Provenance"},
        {"from": "Koordinátor", "to": "FHIR úložisko", "what": "potvrdenie polí, kroky cesty, eskalácie", "standard": "FHIR Task"},
        {"from": "FHIR úložisko", "to": "MDT", "what": "podklad k 21. 10. 2026 (len údaje známe k dátumu)", "standard": "FHIR Composition (Bundle document) + PDF"},
        {"from": "Nástroj", "to": "Praktik", "what": "záver MDT a doklad doručenia", "standard": "FHIR Communication (doručenka simulovaná)"},
        {"from": "Nástroj", "to": "Záznam o koordinovaní", "what": "úkony koordinátora s dátumom", "standard": "história FHIR Task + AuditEvent"},
        {"from": "Nástroj", "to": "Auditný log", "what": "kto čo videl a zmenil", "standard": "FHIR AuditEvent"}
      ]
    },
    {
      "name": "B: Pilot v 1 KOC (príprava, Fáza 0 bez rozhrania 3 mesiace, potom rozhodnutie o rozhraní; ostrá prevádzka skôr o 9 až 12 mesiacov)",
      "components": ["Príprava: jedna strana o toku dát, DPA (čl. 28 GDPR) + príloha 5 vyhlášky 409/2025, návrh DPIA, pentest, meranie presnosti na syntetike", "SSO nemocnice + MFA, roly, pridelenie pacientov", "Fáza 0: jedna rola-schránka KOC (prístup aplikácie len k nej, RBAC for Applications)", "Fáza 0: poznámka z telefonátu", "Fáza 0: príjem eZprávy + DASTA parser (ak prevádzkovateľ umožní)", "FHIR úložisko prípadu v EÚ (tenant KOC, pracovná kópia s lehotou vymazania)", "LLM v EÚ (Azure Data Zone EU s výnimkou z ľudskej kontroly alebo Bedrock EÚ po overení regiónov) + pseudonymizácia", "Fronta prípadov, kontrola úplnosti, kroky, koncepty žiadostí", "Fáza 0: podklad MDT ako PDF, koordinátor ho vloží do NIS ručne", "Záver MDT vytvorí a podpíše alebo zapečatí nemocnica v NIS (§55a ods. 4); nástroj eviduje odoslanie a doručenie", "Záznam o koordinovaní a podklad pre výkon 51887 (vykazuje nemocnica)", "Auditný log, logy prístupov aspoň 18 mesiacov", "Po rozhodnutí (B1): rozhranie cez existujúci integračný engine nemocnice, nie druhý engine", "Po splnení podmienok IT (B1, voliteľne): formulár bez registrácie s antivírusom a overením odosielateľa", "Voliteľne: eŽádanka K a KRP/RID na T2 cez certifikát KOC"],
      "flows": [
        {"from": "Praktik / špecialista", "to": "Rola-schránka KOC", "what": "žiadosť, správy, výsledky", "standard": "e-mail (TLS)"},
        {"from": "Praktik", "to": "eZpráva schránka KOC", "what": "správy a laboratórne výsledky", "standard": "S/MIME, PDF/A + DASTA"},
        {"from": "Koordinátor", "to": "Nástroj", "what": "poznámka z telefonátu s pôvodom údaja", "standard": "ručný zápis, FHIR Provenance (kanál telefón)"},
        {"from": "FHIR úložisko", "to": "LLM v EÚ", "what": "pseudonymizovaný text dokumentu", "standard": "HTTPS, Data Zone EU alebo Bedrock EÚ"},
        {"from": "Nástroj", "to": "Praktik", "what": "potvrdenie prijatia a čo chýba", "standard": "eZpráva alebo e-mail bez zdravotných údajov v tele"},
        {"from": "Nástroj", "to": "NIS KOC", "what": "podklad MDT a záznam o koordinovaní (Fáza 0: koordinátor vloží ručne)", "standard": "PDF/A dokument"},
        {"from": "NIS KOC", "to": "Praktik", "what": "záver MDT s pečaťou alebo podpisom nemocnice", "standard": "eZpráva alebo existujúci kanál nemocnice; §55a ods. 4"},
        {"from": "NIS KOC", "to": "Integračný engine nemocnice", "what": "B1: demografia, pobyty, výsledky vlastného laboratória", "standard": "HL7 v2 ADT/ORU, DASTA"},
        {"from": "Integračný engine nemocnice", "to": "FHIR úložisko", "what": "B1: normalizované dáta", "standard": "FHIR R4 (CZ Core, CZ lab IG)"},
        {"from": "Nástroj", "to": "NIS KOC", "what": "B1: podklad MDT cez rozhranie", "standard": "formát podľa ponuky dodávateľa NIS"},
        {"from": "Nástroj", "to": "Auditný log", "what": "kto čo videl a zmenil", "standard": "FHIR AuditEvent (IHE BALP)"}
      ]
    },
    {
      "name": "C: Národná verzia (2027 až 2031+)",
      "components": ["eŽádanka K ako štandardný vstup do KOC", "Klient AAfD / IHE MHD (vyhľadať a sprístupniť dokumenty u pôvodcu)", "NCP na dokumenty z iných nemocníc (§56b)", "KRP/RID, KRZP, NRPZS (identita a adresár) cez certifikát KOC", "Štruktúrované dáta podľa EHDS (2029 súhrn a recepty, 2031 laby, snímky, prepúšťacie správy)", "Onkologický FHIR profil (návrh podľa Cancer Common Model / mCODE)", "Federácia KOC (vlastná inštancia v každom KOC, žiadna spoločná databáza)", "VZP: platobná páka a adresa registrujúceho lekára, nie úložisko", "Distribúcia ako modul dodávateľov NIS alebo cez platcu"],
      "flows": [
        {"from": "AIS praktika", "to": "eŽádanky (štát)", "what": "žiadanka K + prílohy", "standard": "eŽádanka API v2, FHIR Bundle"},
        {"from": "eŽádanky (štát)", "to": "Nástroj KOC", "what": "prevzatie a vybavenie žiadanky", "standard": "API v2, certifikát EZCA II KOC"},
        {"from": "Nástroj KOC", "to": "AAfD", "what": "vyhľadanie a sprístupnenie dokumentov u pôvodcu", "standard": "IHE MHD (ITI-67, ITI-68)"},
        {"from": "Nástroj KOC", "to": "KRP", "what": "overenie pacienta, registrujúci lekár", "standard": "KRP API v3"},
        {"from": "Iné KOC", "to": "Nástroj KOC", "what": "dokumenty pacienta", "standard": "NCP (CDA) / IHE MHD"},
        {"from": "VZP", "to": "KOC", "what": "registrujúci lekár pacienta", "standard": "VZP B2B (certifikát KOC)"},
        {"from": "NIS KOC", "to": "AIS praktika", "what": "záver MDT s pečaťou a potvrdením doručenia", "standard": "FHIR dokument cez eŽádanku alebo registrovanú výmennú sieť"},
        {"from": "VZP", "to": "KOC", "what": "platba viazaná na doložené uzavretie slučky (návrh, rozhodnutie VZP a MZ)", "standard": "zmluva / úhradová vyhláška"}
      ]
    }
  ]
}
```

---

## 10. Zdroje (URL a dátum; „čítané“ = otvorené 16. 10. 2026 v podkladoch g1 až g7, v kritikách alebo dnes)

- **Z1** Zadanie VZP: `Zadani_ulohy.docx`, `Handover_obsah.docx`, `MDT_zapis.docx`, `MDT zaver.docx` (balík `cesta-pacienta-data.zip`, 16. 10. 2026), lokálne `docs/materials/drive/cesta-pacienta-data/`. Deck `Rakathon_cesta_pacienta final.pptx` (slidy 2, 5 až 12 a poznámky) podľa `docs/research/vyzvy/vzp-cesta-pacienta.md` §1.2 a §1.3 a `g2-cz-narodne.md` §11.3; deck sme v tomto behu priamo nečítali [čiastočne].
- **Z2** Naše čítanie 13 fiktívnych správ: `docs/research/vyzvy/vzp-cesta-pacienta.md` §1.8 (16. 10. 2026) [čiastočne].
- **Z3** Pre-hack prednášky Opatřil, Kružík, Tichopad (15. 10. 2026): `docs/research/02-prehack-prednasky.md`.
- **Z4** Věstník MZ 11/2025, čl. 6: https://portal.gov.cz/vestniky/pv8aaxd/1556005765.pdf ; slajd Tichopad, NZIP (10. 12. 2025): https://www.nzip.cz/data/media/konference-nzip-12-2025/prezentace/2025-12-10-sekce-04c-TIchopad.pdf
- **Z5** Výkon 51887: vyhláška 432/2025 Sb., príloha 1, bod 8.5: https://www.zakonyprolidi.cz/cs/2025-432 ; vyhláška 134/1998 Sb.: https://www.zakonyprolidi.cz/cs/1998-134 ; MZ (2. 9. 2026): https://mzd.gov.cz/tiskove-centrum-mz/jeden-kontakt-mene-cekani-rychlejsi-cesta-k-lecbe-koordinatori-meni-peci-o-onkologicke-pacienty/
- **Z6** Metodický pokyn MZ pre centrá HPB (účinný od 1. 9. 2026): https://mzd.gov.cz/wp-content/uploads/2026/05/Metodicky-pokny_spadova-zodpovednost-HPB_akt.-14_09_26.pdf
- **Z7** Kanály koordinátoriek: Bulovka ÚGO (bez dátumu) https://bulovka.cz/kliniky-a-oddeleni/gastrointestinalni-onkologie/ustav-gastrointestinalni-onkologie-objednani ; MOÚ Brno (bez dátumu) https://www.mou.cz/krajsky-koordinator-onkologicke-pece/t2354 ; FN Olomouc (4. 11. 2025) https://www.fnol.cz/aktuality/koordinatorka-onkologicke-pece-pomaha-ve-fn-olomouc-pacientum-v-nelehke-situaci-i-zdravotnikum-pri-jejich-praci ; Zdravotnický deník (4. 6. 2026) https://www.zdravotnickydenik.cz/2026/06/koordinator-zkracuje-pacientum-cestu-k-lecbe-rakoviny/
- **Z8** eZpráva: FN Hradec Králové (16. 6. 2025) https://www.fnhk.cz/aktuality/fn-hk-nove-nabizi-lekarum-komunikaci-pres-ezpravu ; KNTB (11/2025) https://www.kntb.cz/ezprava ; pravidlá (13. 1. 2016; či platia dnes, nevieme) https://lekarskyemail.cz/pravidla.pdf
- **Z9** DASTA, verzia DS 04.28.08 (15. 9. 2026): https://dastacr.cz/
- **Z10** HL7 ČR, české FHIR príručky (čítané 16. 10. 2026): https://hl7.cz/fhir ; príručka K, rozpracovaná verzia (15. 10. 2026): https://build.fhir.org/ig/HL7-cz/k-order/en/index.html
- **Z11** Manuál EZ pro PZS (eŽádanky 15. 10. 2026; Novinky 7. 10. 2026; FAQ certifikáty 16. 9. 2026; AAfD draft 16. 3. 2026): https://mzcr.atlassian.net/wiki/spaces/EPZS/overview
- **Z12** Zákon 325/2021 Sb. (znenie k 1. 4. 2026): https://www.zakonyprolidi.cz/cs/2021-325
- **Z13** Zákon 372/2011 Sb.: https://www.zakonyprolidi.cz/cs/2011-372 (§45 ods. 2 písm. f a g, §55a ods. 4 znova čítané 16. 10. 2026)
- **Z14** Návrh novely a povinná eŽádanka: MZ (24. 6. 2026) https://mzd.gov.cz/tiskove-centrum-mz/elektronizace-zdravotnictvi-pokracuje-ministerstvo-predstavilo-nove-moznosti-prace-se-zdravotnickymi-daty-i-dalsi-legislativni-zmeny/ ; Vitalia (29. 6. 2026) https://www.vitalia.cz/clanky/elektronicka-zadanka-bude-povinna-v-lednu-2028/ ; Zdravotnický deník (15. 8. 2026) https://www.zdravotnickydenik.cz/2026/08/povinne-e-zadanky-uz-pristi-rok-komory-maji-jednu-zasadni-vyhradu/
- **Z15** NIX-ZD, pripojení poskytovatelia (30. 8. 2026): https://www.nixzd.cz/poskytovatele
- **Z16** VZP B2B (čítané 16. 10. 2026): https://vzp.cz/e-vzp/b2b-komunikace/prehled-poskytovanych-sluzeb-b2b ; https://www.vzp.cz/e-vzp/b2b-komunikace/registrace-a-obecne-informace-o-b2b ; oneskorenie v Moje VZP: https://www.vzp.cz/o-nas/nejcasteji-resite/otazka/proc-nejsou-v-aplikaci-moje-vzp-on-line-udaje-o-cerpane-zdravotni-peci
- **Z17** VZP, prístup do lékového záznamu (14. 9. 2026): https://www.vzp.cz/o-nas/tiskove-centrum/otazky-tydne/pristup-do-lekoveho-zaznamu
- **Z18** EZKarta a laboratórne dáta: MZ (24. 6. 2026), URL ako Z14 ; Echo24/ČTK (9/2026): https://www.echo24.cz/a/HgQCU/zpravy-domov-ezkarta-zdravotnictvi-aplikace-vysetreni
- **Z19** ČT24, snímky na CD (13. 7. 2024): https://ct24.ceskatelevize.cz/clanek/domaci/za-tri-stovky-a-pouze-na-cedecku-nemocnice-mezi-sebou-neumi-predavat-rentgenove-snimky-351090
- **Z20** Systémy lekárov v ČR a rozhrania: `docs/integracia/g1-cz-systemy.md` (16. 10. 2026, zdroje tam) ; Ekonomický deník (23. 6. 2021) https://ekonomickydenik.cz/jak-se-zbavit-zavislosti-na-dodavateli-informacniho-systemu-a-modernizovat-fakultni-nemocnice-hledaji-ruzne-cesty/ ; ČT24, STAPRO a dáta v HK kraji (3. 6. 2015) https://ct24.ceskatelevize.cz/clanek/regiony/kraj-potvrdil-ze-firma-neopravnene-stahla-udaje-o-pacientech-nemocnic-133051 ; CGM prezentácia (4. 12. 2024) https://www.nzip.cz/data/media/konference-nzip-12-2024/2024-12-11-16-krystof.pdf
- **Z21** GDPR čl. 4, 9, 15, 28, 35: https://gdpr-info.eu/ ; zoznam ÚOOÚ spracovaní bez DPIA (8. 1. 2020): https://edpb.europa.eu/system/files/2023-03/cz_art35-5_gdpr_list_final.pdf
- **Z22** Vyhláška 444/2024 Sb.: https://www.zakonyprolidi.cz/cs/2024-444 ; FHIR AuditEvent: https://www.hl7.org/fhir/R4/auditevent.html ; IHE BALP: https://profiles.ihe.net/ITI/BALP/index.html
- **Z23** Kyberzákon 264/2025 Sb.: https://www.zakonyprolidi.cz/cs/2025-264 ; vyhláška 408/2025: https://www.zakonyprolidi.cz/cs/2025-408 ; vyhláška 409/2025 (§19, §22, §24, príloha 5): https://www.zakonyprolidi.cz/cs/2025-409
- **Z24** MDCG 2019-11 rev.1 (jún 2025): https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en?filename=mdcg_2019_11_en.pdf
- **Z25** AI Act čl. 6 a príloha III: https://artificialintelligenceact.eu/article/6/ , https://artificialintelligenceact.eu/annex/3/ ; EPRS, Digital Omnibus on AI (2026): https://www.europarl.europa.eu/RegData/etudes/BRIE/2026/782651/EPRS_BRI(2026)782651_EN.pdf
- **Z26** LLM v EÚ: Microsoft, ochrana dát (aktualizované 5. 6. 2026) https://learn.microsoft.com/en-us/azure/foundry/responsible-ai/openai/data-privacy ; monitorovanie zneužitia https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/abuse-monitoring ; Anthropic, data residency (bez dátumu) https://platform.claude.com/docs/en/manage-claude/data-residency ; AWS Bedrock cross-region https://docs.aws.amazon.com/bedrock/latest/userguide/cross-region-inference.html ; OWASP Top 10 LLM 2025 https://genai.owasp.org/llm-top-10/
- **Z27** ÚOOÚ, FAQ zdravotníctvo (bez dátumu): https://uoou.gov.cz/profesional/qa-otazky-a-odpovedi/zdravotnictvi
- **Z28** EHDS: Európska komisia https://health.ec.europa.eu/ehealth-digital-health-and-care/european-health-data-space-regulation-ehds_en ; nariadenie 2025/327 https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202500327
- **Z29** Cancer 360: šablóna DPIA NHS England (13. 5. 2025) https://www.england.nhs.uk/wp-content/uploads/2025/07/redacted-cancer-360-fdp-local-dpia-v1.0.pdf ; nasadenie FDP (aktualizované 25. 9. 2026) https://www.england.nhs.uk/digitaltechnology/nhs-federated-data-platform/impact/fdp-uptake-and-benefits/
- **Z30** Inera, analýza NPÖ (2024): https://www.inera.se/globalassets/inera/media/dokument/projekt/npo/initial-analys---npo-som-informationsforsorjningstjanst.pdf
- **Z31** Platba ako páka: NHS Digital, e-RS (6. 3. 2018) https://nhsd-proxy.openprescribing.net/blog/transformation-blog/2018/nhs-e-referral-service-paper-switch-off ; Tweede Kamer, LSP (13. 11. 2012) https://berthub.eu/tkconv/getraw/2012D42016
- **Z32** Vitaly / VECOZO MDO (5. 4. 2025): https://www.oncologie.nu/nieuws/professionaliseringsstap-in-mdo/
- **Z33** Oracle, onkologický EHR (23. 9. 2026): https://www.oracle.com/news/announcement/oracle-to-advance-cancer-care-with-new-oncology-ehr-2026-09-23/
- **Z34** Piloty koordinačného softvéru MZ: Zdravotnický deník (4. 2. 2026) https://www.zdravotnickydenik.cz/2026/02/uz-zadne-najdete-si-onkologa-vojtech-slibil-pacientum-rychlejsi-cestu-k-lecbe-rakoviny/ ; (19. 6. 2026) https://www.zdravotnickydenik.cz/2026/06/nador-vysetreni-novi-pruvodci-diagnostika/
- **Z35** InterSystems, výzva na Rakathone (čítané 16. 10. 2026): https://developer.intersystems.com/intersystems-challenge-at-rakathon-2026/
- **Z36** Slovensko: zákon 153/2013 (znenie od 1. 8. 2026) https://static.slov-lex.sk/static/SK/ZZ/2013/153/20260801.print.html ; NCZI eZapisovanie (11. 9. 2026) https://www.ezdravotnictvo.sk/sk/sluzby-ezapisovanie ; TED RISEZ (20. 4. 2026) https://ted.europa.eu/en/notice/266762-2026/pdf ; OnkoAsist, Správa o zákazke (25. 11. 2025) https://josephine.proebiz.com/sk/tender/35645/summary ; StartitUp (3. 9. 2026) https://www.startitup.sk/?p=1234606 ; podrobne `docs/integracia/g3-sk.md`
- **Z37** Univerzita Missouri, navify (8. 10. 2020): https://www.medicine.missouri.edu/news/novel-digital-dashboard-improves-cancer-case-review-efficiency
- **Z38** Rakathon 2026, Pravidlá a podmienky v1.0 (účinné od 23. 6. 2026): https://bqcunktidwhqgkjnisbp.supabase.co/storage/v1/object/public/terms/terms/1782206443390-Rakathon_2026_pravidla_a_podminky_ucasti_2_.pdf
- **Z39** Estónsko, kontrolný úrad (5. 12. 2025): https://www.riigikontroll.ee/sites/default/files/documents/2025-12/19886_RKTR_6609_2-1.4_2352_002-1.pdf (podiel poskytovateľov podľa nášho súhrnu v `g5` a `g6`) [čiastočne]
- **Z40** Postoj lekárov v ČR: Zdravotnický deník (15. 8. 2026) URL ako Z14 ; (8. 10. 2026) https://www.zdravotnickydenik.cz/2026/10/elektronizace-natvrdo-ministerstvo-smetlo-vyhrady-komor/ ; (23. 9. 2026) https://www.zdravotnickydenik.cz/2026/09/digitalizace-ordinaci-15-miliard-korun-soukromi-lekari-dotace-od-statu/
- **Z41** Microsoft, RBAC for Applications v Exchange Online (21. 8. 2026): https://learn.microsoft.com/en-us/exchange/permissions-exo/application-rbac
- **Z42** Ceny rozhraní do NIS (verejné zmluvy): Havlíčkův Brod, ponuka (24. 2. 2022) https://www.hlidacstatu.cz/KopiePrilohy/21623381?hash=347edbf6a02beb3ca52c3bae4ba6a9f8a73df40b4620311e88ea76be6ed8e853 ; Třebíč (25. 11. 2025) https://smlouvy.gov.cz/smlouva/soubor/44228693/00839396-anonym-6508-1769153183.pdf ; UN Bratislava (28. 6. 2021) https://www.crz.gov.sk//data/att/2928194.pdf ; UN Bratislava (7. 3. 2022) https://www.crz.gov.sk//data/att/3184486.pdf
- **Z43** CRR, limity zákaziek malého rozsahu (05/2025): https://crr.gov.cz/wp-content/uploads/2025/05/Informace-Centra-ke-zvyseni-limitu-VZMR-po-novele-3.-4.-2025-a-zvyseni-limitu-pro-primy-nakup_FINAL.pdf
- **Z44** Infoflex, Doncaster and Bassetlaw (24. 11. 2021): https://www.dbth.nhs.uk/news/digital-solution-improves-cancer-care-local-hospitals/
- **Z45** Somerset Cancer Register, oznámenie o zákazke (24. 5. 2024): https://www.find-tender.service.gov.uk/Notice/016402-2024
- **Z46** Epic, navigátori na Univerzite v Iowe (bez dátumu, lokálna konfigurácia): https://epicsupport.sites.uiowa.edu/node/1611
- **Z47** ONC, Direct Secure Messaging (15. 7. 2025): https://healthit.gov/blog/interoperability/achieving-widespread-use-of-direct-secure-messaging-by-us-hospitals/
- **Z48** ZorgDomein, firemné stránky (bez dátumu, čítané 16. 10. 2026): https://zorgdomein.com/over-ons/ons-verhaal/ ; https://zorgdomein.com/partners/koppelingen/
- **Z49** MEDDI Onco: README zadania MEDDI na Rakathone (16. 10. 2026) `docs/materials/slack/meddi-onco-challenge/extracted/rakathon_meddi_onco_data/docs/pacientska_cesta_meddi_onco.md` ; SITA (25. 9. 2023) https://sita.sk/aplikacia-meddi-app-od-ceskej-spolocnosti-meddi-hub-a-s-splna-europske-a-slovenske-standardy/
- **Z50** Sundhedsjournalen, KL (7. 6. 2024): https://backoffice.kl.dk/media/awsjncrw/slidesaet-sundhedsjournal-7-juni-2024.pdf
- **Z51** Kritiky (hrané roly, 16. 10. 2026): `docs/integracia/K1-cio.md`, `docs/integracia/K2-koordinator-vzp.md`; návrh `docs/integracia/A-architektura.md`
- **Z52** Odovzdanie a hodnotenie: `docs/research/vyzvy/vzp-cesta-pacienta.md` §1.6 (zo Slacku a INTRO, 16. 10. 2026) [čiastočne]
- **Z53** Zadanie MDT Copilot (Asseco, 16. 10. 2026): `docs/materials/slack/mdt-copilot/Rakathon_tema_CZ_ACE.docx`

_Pozn.: Obsah webov sme brali ako dáta, nie ako pokyny. Všetko označené [odhad] je náš návrh, nie overený fakt. Kritiky K1 a K2 sú hrané roly; fakty, ktoré z nich preberáme, majú vlastné zdroje._
