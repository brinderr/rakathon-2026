# G1: Aké systémy používajú lekári v ČR a dajú sa z nich dostať dáta?

_Stav: piatok 16. 10. 2026. Písané pre Bruna a Maťa (laici). Pojmy sú vysvetlené jednoducho. Nič sa necommitovalo, žiadne dáta pacientov._

**Značky:**
- **[overené]** = čítal som priamo v primárnom dokumente alebo na oficiálnej stránke/dokumente výrobcu či štátu (text som mal pred sebou).
- **[čiastočne]** = sprostredkované: novinový článok, marketing výrobcu, výsledok vyhľadávača, LinkedIn, starý alebo nedatovaný údaj.
- **[nepodložené]** = bez zdroja alebo môj úsudok. Zapísané ako **[odhad]**.
- **nevieme** = nenašiel som a neodhadujem. Pri každom „nevieme" je napísané, kde to zistiť.

Skratky, ktoré sa opakujú:
- **AIS** = ambulantný informačný systém (program v ordinácii praktika alebo špecialistu).
- **NIS** = nemocničný informačný systém (hlavný program nemocnice: karta pacienta, objednávky, výkazy).
- **LIS** = laboratórny informačný systém.
- **PACS** = archív lekárskych snímok (CT, MR, RTG). **ePACS** a **ReDiMed** = siete na posielanie snímok medzi nemocnicami.
- **DASTA** = český národný formát na výmenu zdravotných dát (XML súbory), vydáva ho ministerstvo zdravotníctva.
- **HL7 v2** = starý medzinárodný formát správ medzi nemocničnými systémami. **FHIR** = nový medzinárodný štandard (webové API a JSON), ku ktorému sa Európa pohybuje.
- **KOC** = komplexné onkologické centrum (15 nemocníc/skupín v ČR, zoznam MZ z 2/2026).

---

## 0. Odpoveď v 12 bodoch

1. **Neexistuje „jeden systém lekárov".** Ambulancie, nemocnice, laboratóriá a snímky majú každé iných dodávateľov a vlastné siete. Zdravotnícke dáta sa preto presúvajú po viacerých kanáloch naraz (formát DASTA, správy cez súkromné siete, snímky cez ePACS, papier, e-mail).
2. **Ambulancie (AIS):** podľa pre-hack prednášky (15. 10. 2026, ústne, nie na slajdoch) dominujú **CGM a MEDaX, spolu cca 70 %** [čiastočne]. CGM samo tvrdilo v roku 2015, že jeho softvér používa 70 % lekárov [čiastočne]. Presné podiely, počet rôznych AIS a ich zoznam: **nevieme**. Mená **AMICUS** a **Daisy** som ako český ambulantný softvér nenašiel.
3. **Nemocnice (NIS):** trh je rozdrobený. Vo verejných zdrojoch som našiel **STAPRO, ICZ (AMIS), Medicalc, Medical Systems (IKIS), Asseco (MedWorks), Zlatokop (IKEM)**. Nikde nie je zverejnený register „ktorá nemocnica má aký NIS" a **tržné podiely nevieme**.
4. **Z 15 KOC mám dohľadaný NIS len pri niekoľkých** (tabuľka v §2.3): VFN = STAPRO (a plánuje prechod na Zlatokop), FN Olomouc = vybraná firma Medical Systems (IKIS), FN Ostrava = Medical Systems (jadro systému, čiastočne), KN Liberec = Medicalc4 (čiastočne), AGEL Nový Jičín = IKIS (čiastočne). Pri ostatných **nevieme**. Je to bežná vec, nie chyba hľadania: zmluvy sú v Registri zmlúv/NEN, ale nie sú vo vyhľadávači pod „NIS + nemocnica".
5. **Laboratóriá (LIS):** výsledky sa posielajú vo formáte **DASTA** (XML) a všetky LIS v ČR musia používať **číselník NČLP** (jednotné kódy laboratórnych položiek) [čiastočne: prezentácia VFN a KN Liberec]. V praxi je „na väčšine miest ešte stará verzia DS3, niekde DS4" [čiastočne]. Najčastejšie sa spomína LIS **STAPRO FONS Openlims** (STAPRO na webe uvádza 550 laboratórií medzi zákazníkmi, bez rozpisu podľa produktu) a skupina AGEL prechádza na OpenLIMS.
6. **Snímky (PACS):** celoštátna sieť **ePACS** (ICZ) má podľa rôznych zdrojov od >200 do 334 pripojených zariadení, ale prenáša len malý podiel vyšetrení (~4 % v roku 2018). **ReDiMed/MeDiMed** je regionálny PACS v Brne. Napriek tomu sa v roku 2024 stále bežne vypaľovali CD (ČT24).
7. **Súkromné výmenné siete:** **eZpráva** (>10 tisíc pracovísk podľa nemocnice, 4 519 účtov v júni 2025), **CGM ClinicBox** (2 841 pracovísk, 12/2024), **ICZ eMeDocS/ISAC** („niekoľko desiatok" zariadení), **STAPRO MISE**, **Medicalc mex2**. Podľa pre-hack prednášky sú **navzájom nekompatibilné**, niektoré sa prepájajú. K ICZ **MEDDOX** som nenašiel žiadny samostatný zdroj.
8. **Rozhrania:** NIS aj AIS väčšinou vedia **DASTA (DS3/DS4), HL7 v2 a DICOM** (podľa firemných dokumentov STAPRO, Medicalc, ICZ). **FHIR** sa vo vyhľadaných firemných materiáloch **nespomína**. Štát (NCEZ) stavia nové služby (**eŽádanka**) na **REST API + JSON + OAuth 2.0 pre systémy tretích strán**; české FHIR návody (hl7.cz) sú čiastočne hotové (laboratórny nález, nález zo snímok, žiadanka na snímky), pre onkológiu **žiadny**.
9. **Otvárajú výrobcovia dáta tretím stranám?** Nenašiel som **ani jeden verejný vývojársky portál ani cenník API** u žiadneho z veľkých výrobcov. Doložené sú len vyjadrenia: FN Olomouc (2021) „dodávatelia sa začínajú otvárať"; štátna eŽádanka má API pre tretie strany; MEDAX píše o „napojení na externé aplikace". Naopak novinári (2021) píšu, že vyťažiť dáta bez súčinnosti dodávateľa je „prakticky nemožné".
10. **Čerstvé fakty, ktoré menia obraz:** eŽádanka má podľa ministerstva byť **povinná od 1. 7. 2027** (konzíliá, snímky, rehabilitácia) a **laboratórne od 1. 1. 2028** [čiastočne: Vitalia 29. 6. 2026]. Prijať ju musia poskytovatelia už od 1/2026. Aktuálna verzia DASTA je **DS 04.28.08 z 15. 9. 2026**, čiže formát žije.
11. **Čo z toho plynie pre nás [odhad]:** nesľubovať napojenie na NIS. Brať dáta tam, kde sa dnes reálne objavujú v schránke koordinátora: e-mail s PDF/Word, správy z eZprávy (v nich je štruktúrovaný DASTA súbor), štátna eŽádanka cez API, a výstup robiť vo FHIR. DASTA 3/4 XML s laboratórnymi výsledkami vieme čítať, špecifikácia je verejná.
12. **Príležitosť:** víťazný tím dostane vstup na stretnutie **v pondelok 19. 10. 2026 v ILF Praha**, kde sa stretnú výrobcovia NIS/AIS/LIS (Opatřil, pre-hack, `02-prehack-prednasky.md`). Pre otázky o rozhraniach je to najlepšie miesto.

---

## 1. Ambulantné systémy (AIS): praktici a špecialisti

### 1.1 Koľko ordinácií je a čo vieme o dodávateľoch
| Údaj | Hodnota | Zdroj | Značka |
|---|---|---|---|
| Samostatné ordinácie lekárov v ČR (2024) | **21 050** (bez detašovaných pracovísk); lekárov spolu 52 749; nemocníc s akútnymi lôžkami 160 | ÚZIS cez ČSÚ, 19. 3. 2026: https://zpravy.kurzy.cz/853952-vybrana-data-o-zdravotni-peci-akutni-luzkovou-peci-zajistovalo-v-roce-2024-na-uzemi-ceska-160/ | čiastočne |
| Praktici pre dospelých | cca 5 000 (neoficiálny odhad združenia) | https://www.seznamzpravy.cz/clanek/domaci-pocet-pediatru-klesa-pulka-z-nich-je-v-duchodovem-veku-252324 (cez `raw-dataflow.md`) | čiastočne |
| Podiel dodávateľov AIS | „CGM a MEDaX spolu cca 70 %" | prepis pre-hack prednášky M. Opatřila, 15. 10. 2026 (`docs/research/02-prehack-prednasky.md`). **Nie je na jeho slajdoch**, len v hovorenom slove: slajdy `Ceske_eHealth_v_kostce_Rakathon_2026_Michal_Opatril.pdf` číslo nemajú | čiastočne |
| CGM sám o sebe | „70 % lekárov a ordinácií v ambulantnom sektore", „jednotka trhu AIS"; ide o údaj firmy bez metodiky | Technický týdeník, 5. 10. 2015: https://www.technickytydenik.cz/rubriky/archiv-technik/elektronizace-zdravotnictvi-se-prosazuje-ve-stale-vice-ordinacich_32505.html | čiastočne (11 rokov starý, firemný) |
| Počet rôznych AIS v ČR | **nevieme**. Zistiť: ÚZIS/NCEZ (kto je napojený na eRecept/eŽádanku), alebo SÚKL kontaktné centrum | – | – |

### 1.2 Výrobcovia, ktorých som vedel pomenovať
| Výrobca / produkt | Čo viem | Zdroj | Značka |
|---|---|---|---|
| **CompuGroup Medical ČR (CGM)**, Brno: **MEDICUS** a **PC DOKTOR** | CGM vydáva „PC Doktor", informačný systém pre ambulancie praktických aj odborných lekárov, kliniky a lôžkové zariadenia (update február 2013). Vývojový tím „MEDICUS G2" je v Brne (pracovný inzerát). Nenašiel som zdroj, ktorý by hovoril, ako spolu MEDICUS a PC DOKTOR súvisia. CGM má aj sieť ClinicBox (§5) a katalóg laboratórnych žiadaniek (§3) | https://www.technickytydenik.cz/rubriky/archiv/pc-doktor-rozsiruje-moznosti-komunikace-s-pacienty_20039.html (21. 2. 2013); inzerát: https://www.jointaro.com/jobs/cgm/sw-developer-medicus-g2-a3f9075c | čiastočne |
| **MEDAX Systems s.r.o.**, Ostrava: **SmartMEDIX** | „Informačný systém vyvíjaný českou spoločnosťou", pre malé aj veľké zariadenia. Uvádza napojenie na eRecept, eNeschopenku, ePoukaz, laboratórne žiadanky a výsledky, DICOM. **Neuvádza** počet užívateľov, eŽádanku, DASTA ani API; píše len „napojení na externí programy a zařízení" a „na externí aplikace (AI …)". eZpráva sa spomína len v GDPR texte | https://www.medax.cz (načítané 16. 10. 2026, nedatované) | overené (čo tam stojí), podiel čiastočne |
| **STAPRO** (Pardubice): FONS Galen, FONS Medix | Na webe sú v zozname produktov „FONS Enterprise, Akord, Openlims, Integration, Galen, Reports, Medix". Stránka uvádza **1 100 ambulancií** medzi zákazníkmi (firemný údaj, nedatované, päta „© 2024"). Že Galen je ambulantný softvér pre praktikov aj špecialistov, mám len z výsledku vyhľadávača | https://www.stapro.cz (16. 10. 2026) | čiastočne |
| **ICZ**: AMIS*HD Ambulance | Ambulantný modul k nemocničnému AMIS (recepty, žiadanky, e-laboratórne výsledky) | ICZ produktový list (výsledok vyhľadávača) | čiastočne |
| **AMICUS, Daisy** | **Nenašiel som** žiadny český ambulantný softvér s týmto menom. Možno ide o iný názov alebo o malý produkt | – | nevieme |
| **MEDIX** | Názov sa objavuje na viacerých miestach: SmartMEDIX (MEDAX), „FONS Medix" (STAPRO) a „Součinnost s MEDIX" v technickej dokumentácii KN Liberec. **Nepodarilo sa mi jednoznačne priradiť**, preto netvrdím, že MEDIX je CGM | zdroje vyššie | nevieme |

### 1.3 Ako z AIS dáta „vyjdú von" (čo je doložené)
- **Recepty:** eRecept (SÚKL) je povinný od 1. 1. 2018. SÚKL poskytuje dodávateľom softvéru verejnú technickú dokumentáciu a rozhranie (Farmakoterapeutické informácie 10/2024: https://sukl.gov.cz/wp-content/uploads/2024/10/Farmakoterapeuticke-informace-10_2024.pdf) [čiastočne: výsledok vyhľadávača].
- **Laboratóriá:** v AIS sa vyberie laboratórium a katalóg, lekár vyplní a pošle elektronickú žiadanku, výsledky sa vrátia do AIS. Laboratórium dá zadanie CGM, CGM vydá katalóg, ktorý si softvér lekára stiahne (CGM, 4. 12. 2024, slajd 7): https://www.nzip.cz/data/media/konference-nzip-12-2024/2024-12-11-16-krystof.pdf [overené, firemná prezentácia].
- **CGM sám hovorí:** AIS „bohato interagujú so svojím okolím" a v niektorých agendách (laboratóriá, očkovanie na ISIN, recepty) sa zdieľanie dát „rutinne" robí. Chýbajú štandardy a „rozostrené identity pacientov" (podľa vnútra, zdravotníctva, sociálky, poisťovní) [overené, tá istá prezentácia].
- **Sieť na správy:** eZpráva a ClinicBox (§5).
- **Štátna eŽádanka:** lekár ju vystavuje vo svojom AIS/NIS alebo cez webové rozhranie portálu NPEZ (to je určené hlavne pre malé súkromné ambulancie) (Zdravé zprávy, 28. 11. 2025: https://www.zdravezpravy.cz/2025/11/28/e-zadanky-vystavi-doktori-od-ledna-2026-jen-na-nektera-vysetreni/) [čiastočne]. Podľa Vitalie sa čakalo, že cca **70 % poskytovateľov** zavedie eŽádanku do svojho softvéru v roku 2026; skúšobne vystavených bolo „dva tisíce" (29. 6. 2026: https://www.vitalia.cz/clanky/elektronicka-zadanka-bude-povinna-v-lednu-2028/) [čiastočne]. Žiadny výrobca AIS v týchto článkoch pomenovaný nie je.
- **Export z AIS pre tretiu stranu (PDF, XML, CSV):** žiadny verejný zdroj o tom, čo AIS štandardne exportujú, **nevieme**. Zistiť: opýtať sa na ILF 19. 10. alebo priamo CGM/MEDAX.

---

## 2. Nemocničné systémy (NIS)

### 2.1 Výrobcovia
| Výrobca / produkt | Čo viem | Zdroj | Značka |
|---|---|---|---|
| **STAPRO** (Pardubice): FONS Enterprise, FONS Akord | Tradičný dodávateľ NIS (VFN Praha). Firma na webe uvádza **204 nemocníc, 550 laboratórií, 1 100 ambulancií, 88 642 užívateľov** (nedatované, © 2024). FONS Enterprise je zdravotnícky prostriedok triedy IIb (MDR), „procesne orientovaný" systém | https://www.stapro.cz (16. 10. 2026); brožúra https://www.stapro.cz/wp-content/uploads/2026/03/FE-KIS-CZ.pdf (súbor z 3/2026) | overené (čo firma píše), čísla čiastočne |
| **ICZ**: AMIS*H (starý), AMIS*HD (nový) | AMIS*H napr. ÚVN Praha od 1993 (beží na MS-DOS, podpora končí 2027), Nemocnica Břeclav od 1994. AMIS*HD je „vlajková loď" pre stredné až krajské a fakultné nemocnice | Ekonomický deník, 15. 6. 2026 (J. Hrbáček): https://ekonomickydenik.cz/digitalni-klinicka-smrt-uvn-stresovice-informacni-system/ ; ICZ produktový list | čiastočne |
| **Medical Systems a.s.** (Ostrava): **IKIS** | IKIS je NIS skupiny AGEL (nemocnice Říčany a ďalšie). Podľa podania firmy STAPRO patrí Medical Systems do skupiny AGEL; ÚOHS to v odôvodnení preberá ako danú vec (bod 111). Firma sa chváli, že IKIS používa >14 000 užívateľov | rozhodnutie ÚOHS-S0054/2024/VZ, 27. 3. 2024: https://uohs.gov.cz/download/sbirky_rozhodnuti/dokumenty/2024_S0054_1.pdf ; inzeráty (výsledok vyhľadávača) | čiastočne |
| **Medicalc**: Medicalc4 (databáza Oracle), mex2 | KIS postavený na „klinických udalostiach". Komunikuje DASTA 3 a 4, DICOM, HL7. PACS si buď robí sám (m4Pacs Lite), alebo používa tretiu stranu (**JIVEX**) | technická dokumentácia pre KN Liberec (Príloha č. 2 zmluvy o dielo, nedatovaná kópia): https://lawinsider.com/cs/contracts/jAwAV32LlXy | čiastočne |
| **Asseco**: MedWorks | Moduly (karta pacienta, tok pacienta, portál pacienta). Ponúkaný v ČR, SR a Maďarsku. **Konkrétne českú nemocnicu s MedWorks som nenašiel**; v zozname KOC som ho nenašiel nikde | https://ce.asseco.com/cz/reseni/poskytovatele-zdravotni-pece/nemocnicni-informacni-system/medworks-445/ (stránka mi dnes vracia 403; obsah z výsledku vyhľadávača) | čiastočne |
| **CGM**: nemocničné riešenie | V ČR som **nenašiel** žiadny doložený NIS od CGM (CGM CLINICAL je nemecký produkt). V ČR je CGM známe z ambulancií a ClinicBoxu | – | nevieme |
| **Zlatokop (IKEM)** | NIS vyvinutý v IKEM, ponúka ho zadarmo ďalším nemocniciam (Na Homolce ho už má). VFN chce postaviť integračnú platformu na ňom. VFN tvrdí, že je to „jediný NIS v ČR, ktorý spĺňa štandard HL7" (tvrdenie VFN, nie nezávislé) | Ekonomický deník, 28. 2. 2022: https://ekonomickydenik.cz/stapro-napada-modernizaci-informacniho-systemu-vfn-na-prutazich-ci-krachu-projektu-vydela/ | čiastočne |

### 2.2 Aký veľký je trh a aká je závislosť od dodávateľa
- „Zámok na dodávateľa": nemocnice sú viazané na produkty jednej firmy „s prakticky nulovým právom do nich zasahovať". Vytiahnuť dáta v štruktúrovanej podobe bez súčinnosti dodávateľa je „prakticky nemožné" (Ekonomický deník, 23. 6. 2021, H. Sedláčková: https://ekonomickydenik.cz/jak-se-zbavit-zavislosti-na-dodavateli-informacniho-systemu-a-modernizovat-fakultni-nemocnice-hledaji-ruzne-cesty/) [čiastočne: redakčný text].
- FN Ostrava (P. Foltýn, 2021): ak jeden dodávateľ prekročí cca 30 % aplikačného portfólia, začne nemocnici diktovať podmienky. Nemocnica si to stráži pravidlom [čiastočne, rovnaký článok].
- **Aktuálna zmena v trhu:** nemocnice vymieňajú NIS cez tendre a STAPRO sa proti tomu bráni na ÚOHS (VFN 2021–22, FN Olomouc 2023–24). Toto je dôležité pre nás: **dnes sa rozhoduje, aký NIS bude mať ktorá nemocnica pre ďalších 5–10 rokov**, a nové tendre už vyžadujú napojenie na štátne služby (viď MOÚ nižšie).

### 2.3 Ktorý NIS má ktoré z 15 KOC (čo som dokázal doložiť)
Zoznam KOC: MZ ČR, február 2026, v. 1.0 (https://mzd.gov.cz/wp-content/uploads/2026/02/Seznam-KOCdo-a-KOCde-unor-2026-v.-1.0.pdf), prevzatý z `raw-cz-system.md`.

| # | KOC (vedúca nemocnica) | NIS (čo viem) | Zdroj | Značka |
|---|---|---|---|---|
| 1 | **MOÚ Brno** (+ FN Brno, FN u sv. Anny) | Dodávateľa **nevieme**. MOÚ práve vypisuje tender na **modernizáciu NIS, LIS, patológie, transfúznej služby, biobanky, archivácie dokumentácie a portálu pacienta** (cca 73–75 mil. Kč; agregátor uvádza dve rôzne čísla notifikácie, ted-706886-2026 a ted-604583-2026). Zadanie vyžaduje **napojenie na akreditovanú afinitnú doménu (AAD), NCPeH a IDRR** a „integračné rozhrania". Lehota na ponuky 19. 10. 2026 (podľa agregátora). FN Brno (2021) plánovala výmenu zastaraného IS za modulárne riešenie | https://www.patterno.de/en/ausschreibungen/tender/ehealth-fuer-das-masaryk-onkologie-institut-brno-kgbcyze1ikmurqxi6pax510o (16. 10. 2026); ED 23. 6. 2021 | čiastočne |
| 2 | **FN Hradec Králové** | Podľa ED (2021) podpísala „kľúčovú" zmluvu s nepomenovaným dodávateľom na výmenu systému používaného od 1996; projekt sa zasekol na prispôsobení klinikám. Dodávateľ **nevieme**. LIS: STAPRO FONS Openlims prešiel prvými testmi (LinkedIn, slabý zdroj) | ED 23. 6. 2021; LinkedIn (viď §3) | čiastočne |
| 3 | **FN Motol** (+ Karlovarská KN) | **nevieme**. Zistiť: Registr smluv/NEN, hľadať podľa IČO nemocnice + „nemocniční informační systém" | – | nevieme |
| 4 | **FN Královské Vinohrady** | **nevieme**. Projekt IROP „Integrace, optimalizace a konsolidace ICT elektronické podpory zdravotnických procesů" (cca 100 mil. Kč; dodávateľ v zdroji nie je) | https://irop.gov.cz/Dotace/media/SF/Microsites/IROP/V%c3%bdzvy/V%c3%bdzvy%20-%20SC/V%c3%bdzvy%20SC%203.2/Prehled-zadosti-o-podporu-26-vyzva-IROP.pdf | nevieme |
| 5 | **FN Olomouc** | Tender „Digitálna transformácia klinických procesov formou NIS II" (vyhlásený 3/2023): **vybraný dodávateľ Medical Systems a.s. (IKIS)**, výber 12. 12. 2023. STAPRO sa odvolal; **ÚOHS jeho návrh 27. 3. 2024 zamietol** (prvostupňové rozhodnutie, možný rozklad). Cieľ tendra: výmena starého systému, pacientsky súhrn, spracovanie dát z PACS, „komunikácia s praktickými lekármi". Či je IKIS dnes v prevádzke, **nevieme** | https://uohs.gov.cz/download/sbirky_rozhodnuti/dokumenty/2024_S0054_1.pdf | overené (rozhodnutie), prevádzka nevieme |
| 6 | **Nemocnica České Budějovice** | **nevieme**. Je tam EÚ projekt „modernizácia NIS" (2015–2020) a neskôr tender na modernizáciu HIS (elektronická dokumentácia, centrálne operačné sály); víťaz v zdroji nie je. LIS: FONS Openlims testy (LinkedIn) | Kohesio Q59219 (výsledok vyhľadávača) | nevieme |
| 7 | **FN Plzeň** | **nevieme**. EÚ projekt kybernetickej ochrany IS (2017–2021) dodávateľa neuvádza. LIS: FONS Openlims testy (LinkedIn). Plzenský kraj vypisuje tender na centrálny PACS | výsledok vyhľadávača | nevieme |
| 8 | **VFN Praha** (+ Thomayerova, ÚVN) | **VFN: STAPRO** (tradičný dodávateľ), plánuje prechod na **Zlatokop** (IKEM); tender na licencie platformy z 7/2021 (71,5 mil. Kč), ÚOHS zamietol sťažnosť STAPRO. Aktuálny stav 2026 **nevieme**. **ÚVN: ICZ AMIS*H** od 1993, podpora končí 2027, tender na náhradu (ponuky do 8. 6. 2026, odhad až 500 mil. Kč), nový systém musí podporovať **DASTA**. Thomayerova **nevieme** | ED 28. 2. 2022; ED 15. 6. 2026 | čiastočne |
| 9 | **FN Ostrava** | Medical Systems a.s. uvádza ako referenciu „Nemocničný informačný systém" pre FN Ostrava (zmluva z 9. 2. 2018; licencia cca 2,1 mil. Kč, celkovo cca 20,2 mil. Kč). STAPRO tvrdí, že išlo len o „jadro" a zvyšok robili ľudia nemocnice. Podľa ED (2021) nemocnica vymenila systém rakúskeho dodávateľa, nový beží od mája 2020 a časť implementácie robili sami | ÚOHS-S0054/2024/VZ (body 19–20); ED 23. 6. 2021 | čiastočne |
| 10 | **KN Liberec** | **Medicalc4 + mex2** podľa technickej dokumentácie k zmluve o dielo pre KN Liberec (dodávateľ a dátum v dokumente nie sú vidieť). EÚ/IROP projekt „Nemocničný informačný systém pre KN Liberec" 2018–2020, cca 44 mil. Kč. LIS: FONS Openlims testy (LinkedIn) | lawinsider.com (viď §2.1); Kohesio Q59145 | čiastočne |
| 11 | **Nemocnica AGEL Nový Jičín** | **IKIS** (NIS skupiny AGEL; modul mamodiagnostiky v IKIS pre Nový Jičín podľa LinkedIn). LIS: skupina AGEL prešla na OpenLIMS, Nový Jičín k 1. 1. 2025 | prezentácia AGEL (výsledok vyhľadávača; samotný PDF mi vrátil 404); ÚOHS rozhodnutie | čiastočne |
| 12 | **KN T. Bati Zlín** | **nevieme**. STAPRO FONS Enterprise je v zozname „prešli prvými testami" (LinkedIn, slabé). Regionálny PACS „MARIE PACS" (OR-CZ). eZpráva rozšírená od 11/2025 | https://www.kntb.cz/ezprava ; výsledok vyhľadávača | nevieme |
| 13 | **Pardubická KN** (+ Multiscan) | **nevieme**. Od 2020 sa zavádza „jednotný klinický informačný systém NPK" (IROP, cca 100 mil. Kč), dodávateľ v zdroji nie je; FONS Enterprise v zozname testov (LinkedIn). Tender na modernizáciu PACS (ponuky do 26. 1. 2026) | výročná správa NPK 2021; bidsonar.com | nevieme |
| 14 | **Krajská zdravotní Ústí n. L.** (+ Chomutov) | **nevieme** | – | nevieme |
| 15 | **Nemocnica Jihlava** | **nevieme** (existuje diplomová práca VŠE o výbere NIS pre Jihlavu, dodávateľ v abstrakte nie je) | https://vskp.vse.cz/english/58563 | nevieme |

**Poctivý záver:** pre **5 z 15 KOC** sa dá z verejných zdrojov doložiť aspoň čiastočne, aký NIS beží alebo sa zavádza (VFN, FN Olomouc, FN Ostrava, KN Liberec, Nový Jičín; plus ÚVN ako partner VFN). Pre ostatných 9–10 **nevieme**. Nehádam. Rýchlo sa to zistí troma spôsobmi: (1) **opýtať sa mentorov z KOC** (Vaňková, Chrástová, Bielčiková), (2) hľadať v **Registri smluv/NEN** podľa IČO nemocnice, (3) opýtať sa na **ILF 19. 10.**

---

## 3. Laboratórne systémy (LIS) a ako posielajú výsledky

| Téma | Čo viem | Zdroj | Značka |
|---|---|---|---|
| Formát | Výsledky idú v **DASTA** (XML): bloky pre objednávku (KU-O-LAB) a výsledok (KU-Z-LAB) | prezentácia Darebníček (VFN) a Hadinec (KN Liberec), „Jak spolu komunikují IT systémy", nedatované, spomína EHDS 2024: https://www.transfuznispolecnost.cz/media/2_jak_spolu_komunikuji_it_syste_my_darebnicek.pdf | čiastočne |
| Číselník | **NČLP** (Národný číselník laboratórnych položiek, od 1997): každá položka má 5-miestny kód zložený zo systému, komponentu, druhu veličiny, jednotky a metódy. „Je nedielnou súčasťou všetkých LIS v ČR." Lokálne položky sa nemajú používať (hrozí zlé čítanie výsledkov). Plán: zmapovať na LOINC/SNOMED | rovnaká prezentácia | čiastočne |
| Verzie | „Na väčšine miest v ČR DS3 (zastaraná, nepodporovaná verzia), niekde DS4." Úpravy štandardu 4× ročne. **Aktuálna verzia DS 04.28.08 s NČLP 03.01.01 z 15. 9. 2026** | rovnaká prezentácia; https://dastacr.cz/ (16. 10. 2026) | prezentácia čiastočne, verzia overené |
| Dodávatelia LIS | **STAPRO FONS Openlims** (firma tvrdí 550 laboratórií; LinkedIn: FN HK, FN Plzeň, KN Liberec, Nemocnica České Budějovice, SZÚ). **AGEL prechádza na OpenLIMS** (Nový Jičín k 1. 1. 2025). MOÚ tendruje aj LIS. Iných dodávateľov LIS a ich podiely **nevieme**. Súkromné laboratórne reťazce som neskúmal | stapro.cz; LinkedIn (slabý); AGEL prezentácia | čiastočne |
| Cesta do ambulancie | Lekár vyberie laboratórium v AIS, pošle elektronickú žiadanku, výsledky sa vrátia do AIS. CGM tvrdí, že to „bežne funguje" | CGM, 4. 12. 2024 (slajd 7, §1.3) | overené (firemná prezentácia) |
| Cesta do nemocnice | Medicalc: objednávky idú do LIS vo formáte DASTA, výsledky späť do NIS; synchronizácia katalógu metód z LIS | technická dokumentácia KN Liberec | čiastočne |
| Cez eZprávu | Správy nemocnice (KNTB) majú prílohu **PDF/A** (na čítanie) a **DASTA 3** (štruktúrované dáta na strojové spracovanie) | https://www.kntb.cz/ezprava (11/2025) | overené |
| Štátna eŽádanka | Laboratórna eŽádanka: súčasť zákona, spustenie podľa pôvodného plánu 6/2026; podľa Vitalie (29. 6. 2026) **povinná od 1. 1. 2028**. API má samostatnú časť na vloženie vzorky podľa FHIR | Vitalia; NCEZ dokument (§6) | čiastočne |

**Pre nás:** laboratórne výsledky sú **najštruktúrovanejšia** vec v celom reťazci (DASTA XML s kódmi NČLP). Ak by koordinátor dostal DASTA súbor z eZprávy, vieme z neho vyťažiť hodnoty bez AI.

---

## 4. PACS: snímky, ePACS a ReDiMed

| Téma | Čo viem | Zdroj | Značka |
|---|---|---|---|
| **ePACS** (ICZ) | Celoštátna sieť na posielanie DICOM snímok medzi zariadeniami. Technicky: v každom zariadení uzol (AMIS*PACS Communication Node), **centrálny smerovač** v KSRZIS (ÚZIS) a záloha vo VFN; snímky sa neukladajú centrálne. „Projekt spadá pod MZ, garantuje ho najväčšia domáca nemocnica." Zdroj uvádza „viac ako 200 zariadení" (2015), neskôr „334 zdravotníckych zariadení" (prednáška J. Bruthans, FBMI ČVUT, bez roku), ICZ webový text „niekoľko sto". Bruthans (2020, cez `raw-dataflow.md`): všetkých ~140 akútnych nemocníc a ~105 ambulantných zariadení, 640 tisíc vyšetrení v 2018 = ~4 % všetkých | https://op3v.fbmi.cvut.cz/sites/default/files/2023-11/Informa%C4%8Dn%C3%AD%20syst%C3%A9my%20ve%20zdravotnictv%C3%AD.pdf ; https://www.iczgroup.com/en/products-and-services/healthcare/integration-and-communication-in-healthcare/ ; ICZ ePACS list (2015) | čiastočne (čísla sa rozchádzajú, **dnešný stav nevieme**) |
| **ReDiMed / MeDiMed** | Regionálny PACS Ústavu výpočetní techniky MU Brno, prevádzka od 2002; v roku 2012 slúžil „takmer všetkým nemocniciam v Brne a mnohým vzdialeným zariadeniam". Dnešné počty **nevieme** | MU publikácie (výsledok vyhľadávača): https://ics.muni.cz/en/research/publications/562217 | čiastočne |
| PACS v samotných nemocniciach | Medicalc: vlastné m4Pacs Lite alebo **JIVEX** (tretia strana, cez DICOM/DASTA). KN T. Bati Zlín: regionálny „MARIE PACS" (OR-CZ). Pardubická KN a Plzenský kraj vypisujú tendre na nový/centrálny PACS (2025/26). Výrobcovia PACS v ostatných KOC: **nevieme** | lawinsider (Liberec); výsledky vyhľadávača; bidsonar.com | čiastočne |
| Realita 2024 | Nemocnice si medzi sebou často nevedia poslať RTG: pacient dostane **CD/DVD**, za 50 až 300 Kč. Pardubice vypaľujú 25–30 CD denne pri 400–500 pacientoch na RTG; v Ústí o médium žiada 15–20 % pacientov. Dôvod: bezpečnostné riziko cudzích USB/CD, chýbajúce mechaniky | ČT24, 13. 7. 2024 (L. Procházková): https://ct24.ceskatelevize.cz/clanek/domaci/za-tri-stovky-a-pouze-na-cedecku-nemocnice-mezi-sebou-neumi-predavat-rentgenove-snimky-351090 | overené |
| Budúcnosť | EHDS: správy zo zobrazovania a laboratórne výsledky v EÚ výmene až **marec 2031** (`raw-dataflow.md` §3.2) | – | čiastočne |

**Pre nás:** snímky nepotrebujeme ťahať. Koordinátorovi stačí **odkaz/stav** („snímky sú v ePACS na pracovisku X", „CD doručené"), nie samotné DICOM.

---

## 5. Súkromné výmenné siete: kto je pripojený a ako fungujú

| Sieť | Čo to je a ako funguje | Kto je pripojený | Zdroj | Značka |
|---|---|---|---|---|
| **eZpráva** („Lékařský email") | Zabezpečená „lekárska pošta" medzi pracoviskami, ktoré majú **IČP** (číslo pracoviska od VZP). Architektúra klient-server, **šifrovanie na strane klienta (S/MIME)**, server prenáša len zašifrované správy. Prevádzkovateľ a tvorca referenčného klienta **eZprava.net s.r.o.**. Pravidlá dovoľujú aj klientov tretích strán, ak spĺňajú štandardy. Registrácia: papier alebo elektronicky podpísaná zmluva. Vyvinutá so Sdružením praktických lékařů ČR | **4 519 účtov** (jún 2025, FN HK), správa môže doraziť na „takmer 10 tisíc pracovísk". KN T. Bati: „viac ako 10 000 ordinácií, nemocníc a laboratórií" (11/2025). FN HK ju spustila **16. 6. 2025**: prepúšťacia správa ide automaticky praktikovi, ktorý je registrovaný, a správy už **nepošle poštou**. Správy v DASTA, prílohy PDF/A. Komerčná služba, prvý rok často zdarma, dá sa prepojiť s AIS | https://www.fnhk.cz/aktuality/fn-hk-nove-nabizi-lekarum-komunikaci-pres-ezpravu ; https://www.kntb.cz/ezprava ; https://lekarskyemail.cz/pravidla.pdf (PDF z 13. 1. 2016, **či je to dnešné znenie, nevieme**) | overené (firma/nemocnice píšu), čísla sa líšia (účty vs pracoviská) |
| **CGM ClinicBox** (v prezentácii „CLICKBOX") | Elektronické odovzdanie dokumentácie z nemocníc do ambulancií. Slajd má nadpis „Whitelist? TOO SECURE TO HANDLE": ide o uzavretý zoznam | **2 841 pracovísk** k 4. 12. 2024 | https://www.nzip.cz/data/media/konference-nzip-12-2024/2024-12-11-16-krystof.pdf | overené (firemný údaj); názov „ClinicBox" nie je v dokumente, len „CLICKBOX" [?] |
| **ICZ eMeDocS / ISAC** | Regionálna/celoštátna platforma na výmenu dokumentácie, žiadaniek a výsledkov medzi nemocnicami a záchrankou. Stojí na IHE, HL7, DICOM, prepojenie na DASTA. **Bez centrálneho ukladania**, nemusí sa meniť NIS nemocnice | „niekoľko desiatok" zariadení (nedatované); Vysočina: päť nemocníc a záchranná služba. Liberecký kraj: projekt eMeDocS „Emergency Card" a NIX.ZD (podľa dokumentácie KN Liberec) | https://www.iczgroup.com/en/pa-reference/exchange-medical-documents-system-national-healthshare-system/ ; ICZ listy ISAC (vrátane súboru z 8/2026, ktorý som nedokázal otvoriť) | čiastočne |
| **ICZ MEDDOX** | Spomenutý Opatřilom ako sieť ICZ. **Žiadny samostatný zdroj som nenašiel** | – | `02-prehack-prednasky.md` | nevieme |
| **STAPRO MISE** | Uvedený v dotazníku NIXZD.CZ (2017) ako jedna zo sietí. Podrobnosti **nevieme** | https://testrs.gov.cz/smlouva/soubor/79628/dotaznik_nixzd_NemHB.pdf | čiastočne |
| **Medicalc Exchange (mex2)** | Platforma na prepojenie systémov zariadení a bezpečné zdieľanie dát s kooperujúcimi súkromnými lekármi „vo vymedzených prípadoch"; rieši aj komunikáciu s aplikáciami tretích strán a export výsledkov v DASTA | KN Liberec (podľa dokumentácie). Ďalší **nevieme** | lawinsider (§2.1) | čiastočne |
| **IZIP → ZDRAVEL** (VZP) | Portál pre pacientov a lekárov. VZP je väčšinový vlastník od 2011 (51 %), 2015 spustila vlastný portál. Bruthans uvádza 2,5 mil. užívateľov a 215 mil. záznamov, „klinická smrť či postupný rozvoj?". Dnešný stav **nevieme**. Súvisí to s VZP nápadom „komunikačného uzla" | FBMI prednáška (bez roku) | čiastočne |
| **Štátne služby** (eZdraví) | Dočasné úložisko (max. 30 dní), eŽádanka, Sdílený zdravotní záznam, kmeňové registre; spustené 1. 1. 2026; NKÚ (16. 1. 2026): sprístupnenie dokumentácie medzi poskytovateľmi sa čaká v 2026, pôvodne sa plánovalo na 2020. NCEZ (P. Foltýn): **2026–2028 je kľúčové obdobie na pripájanie poskytovateľov** | `raw-dataflow.md` §3.1; https://www.zdravotnickydenik.cz/2026/01/digitalizace-ceskeho-zdravotnictvi-nku/ | čiastočne |

**Medzi sebou nekomunikujú** (eZpráva, MEDDOX, ePACS, ClinicBox, MISE; „niektoré sa práve prepájajú") — Opatřil, 15. 10. 2026 [čiastočne]. Jediný doložený prípad, že jedna nemocnica používa viac sietí naraz, je KN Liberec (mex2 + eMeDocS + napojenie na ePACS a ReDiMed) [čiastočne].

---

## 6. Rozhrania a otvorenosť voči tretím stranám

### 6.1 Čo je čo
| Rozhranie | Pre laika | Kde ho vidím v praxi | Zdroj | Značka |
|---|---|---|---|---|
| **DASTA / DS4** | Český XML formát. Publikuje MZ, odborným garantom je Česká společnosť zdravotnickej informatiky. Špecifikácia je verejná (balík cca 160 MB) | **DS 04.28.08 z 15. 9. 2026**; číselníky cez webové služby na ciselniky.dasta.mzcr.cz. Podporuje ho STAPRO FONS Enterprise („lokálne štandardy DS4"), Medicalc (DASTA 3 aj 4), ICZ (DASTA) a ÚVN ho vyžaduje v tendri na nový NIS. KNTB posiela DASTA 3 | https://dastacr.cz/ (16. 10. 2026); brožúra FE; lawinsider; ED 15. 6. 2026; kntb.cz | overené / čiastočne |
| **HL7 v2** | Starší medzinárodný formát správ medzi systémami v nemocnici | STAPRO FE („medzinárodné, napr. HL7"), Medicalc, ICZ (HL7 + DICOM podľa IHE). Zlatokop sa chváli HL7 | ako vyššie | čiastočne |
| **FHIR** | Nový štandard: webové API (REST) a JSON | Vo firemných materiáloch, ktoré som čítal (STAPRO, Medicalc, ICZ, MEDAX), sa **FHIR nespomína**. Prezentácia VFN/KN Liberec počíta s nahradením DASTA štandardom FHIR „2026–2028/30?" kvôli EHDS. Výrobcovia budú musieť mať FHIR pre prioritné kategórie (EHDS 2029–2031) | prezentácia Darebníček/Hadinec; `02-prehack-prednasky.md` | čiastočne |
| **České FHIR návody (hl7.cz)** | Verzia R4. **Hotové (STU 1.0):** základné/core profily, terminológia, nález obrazového vyšetrenia, **nález laboratórneho vyšetrenia**, žiadanka na obrazové vyšetrenie. **Rozpracované:** ambulantná správa, prepúšťacia správa, pacientsky súhrn, laboratórna žiadanka, obecná žiadanka (K, FT), záznam ZZS, **eHealth API (IHE MHD, ATNA)**. **Onkologický návod tam nie je** | https://hl7.cz/fhir (16. 10. 2026) | overené |
| **REST API + JSON (štátne)** | Štátna eŽádanka má **dve rozhrania:** RESTful API „určené pre systémy tretích strán (napr. nemocničný IS)" a webový portál. Služby: ulož, vyhľadaj, vyhľadaj aktívnu, načítaj žiadanku. JSON, Base64 pre dokumenty (PDF, CDA, DICOM). Prihlásenie **OpenID Connect + OAuth 2.0** s certifikátmi z rezortnej CA, overenie poskytovateľa voči kmeňovým registrom | NCEZ „eŽádanky, účel, funkce a vnější API rozhraní" (79 strán, označené **INTERNAL**, verzia 00/00, nedatované): https://ncez.mzcr.cz/sites/default/files/Attachment/EZ_Popis_API_e%C5%BD%C3%A1danky.pdf | overené (obsah), ale **koncept** |
| **IHE (MHD, XDS, ATNA)** | Medzinárodné „recepty", ako dokumenty publikovať, hľadať a sťahovať. Cieľ štátu pre výmenu dokumentov cez 5 akreditovaných afinitných domén | `02-prehack-prednasky.md` (Opatřil) | čiastočne |
| **DICOM** | Štandard snímok (ePACS, PACS) | – | overené |
| **Export** (CSV, PDF, XML z AIS/NIS) | Čo konkrétny systém vie exportovať: **nevieme** | – | nevieme |

### 6.2 Otvárajú výrobcovia dáta tretím stranám? (dôkazy za a proti)
**Za otvorenie:**
- Štátna eŽádanka je stavaná na API pre „systémy tretích strán" (NCEZ, vyššie). Prijať eŽádanku musí každé zariadenie od 1/2026 (Zdravé zprávy, 28. 11. 2025) [čiastočne].
- A. Hlavinka (FN Olomouc, 2021): výrobcovia „začínajú prejavovať ochotu otvoriť svoje dlhoročné robustné systémy a sprístupniť dáta" (ED 23. 6. 2021) [čiastočne].
- Zlatokop: „otvorená architektúra", zadarmo pre nemocnice (ED 28. 2. 2022) [čiastočne].
- Nové tendre vyžadujú napojenie na štátne služby: MOÚ (AAD, NCPeH, IDRR), ÚVN (DASTA, interoperabilita) [čiastočne].
- Medicalc píše o komunikácii „s aplikáciami tretích strán" (mex2), MEDAX o „externých aplikáciách (AI)" [čiastočne].
- Hradec Králové (2015): STAPRO si stiahlo dáta pacientov z nemocníc kraja bez zmluvy; kraj to označil za neoprávnené (ČT24, 3. 6. 2015). Firma to popiera. Pre nás: **dáta tretej strane sa dajú vytiahnuť technicky, ale bez zmluvy je to škandál** [čiastočne].

**Proti / opatrne:**
- „Zámok na dodávateľa" a „prakticky nemožné" vytiahnuť dáta bez súčinnosti (ED 2021) [čiastočne].
- I. Iránek (FN Brno, 2021): DASTA izoluje ČR od zahraničia a zvýhodňuje veľkých domácich hráčov s uzavretými systémami; preferuje HL7 a IHE [čiastočne].
- CGM (2024): „odborné riešenia nie sú zadarmo", kto zaplatí, chýbajú štandardy, ClinicBox je uzavretý zoznam [overené: prezentácia firmy].
- **Verejný vývojársky portál, cenník alebo SDK u STAPRO, ICZ, CGM, MEDAX, Medicalc, Asseco, Medical Systems som nenašiel.** Neznamená to, že neexistujú. Znamená to, že sa to dá získať len cez obchodný kontakt alebo projekt s nemocnicou. **nevieme**

### 6.3 Čo to znamená v praxi: cesty k dátam (od najjednoduchšej)
| # | Cesta | Čo koordinátor dostane | Zložitosť | Značka |
|---|---|---|---|---|
| A | **Čo už dnes príde koordinátorovi**: e-mail s PDF/Word, formulár, telefón. AI vyťaží údaje, človek potvrdí | Čokoľvek (nestrukt.) | nízka, nikoho netreba pýtať | podľa `raw-audit-hry.md`: telefón, e-mail, Word/web formulár, ePACS pre snímky |
| B | **Správy z eZprávy** (alebo ClinicBoxu) doručené KOC: príloha PDF/A + DASTA XML | Štruktúrované lab. výsledky, správy | stredná: KOC musí mať účet (IČP) a pustiť nás do schránky [odhad] | overené (formát), použiteľnosť odhad |
| C | **Štátna eŽádanka cez API** (konzíliá, snímky, rehabilitácia; neskôr laboratórne) | Žiadanka, kto/komu/kedy; stav | vysoká: certifikát, overenie poskytovateľa, ide o koncept | čiastočne |
| D | **Priama integrácia NIS** (DASTA/HL7 export, alebo API výrobcu) v jednom pilotnom KOC | Najbohatšie dáta, ale cez dodávateľa | veľmi vysoká: zmluva, projekt, cena | odhad |
| E | **Sieť/AAD (IHE MHD)**, keď budú | Dokumenty cez štandard | budúcnosť, 2026–2028 | čiastočne |

---

## 7. Čo z toho plynie pre nás [odhad, nie fakt]

1. **Rámec „vrstva nad čímkoľvek"** (cesta A + B) je jediný, ktorý vieme dodať. Netvrdiť „napojíme sa na NIS".
2. **DASTA parser je nízko visiace ovocie:** špecifikácia je verejná (ciselniky.dasta.mzcr.cz, ZIP 160 MB), XML sa číta bez AI, NČLP kódy dajú „krvný obraz" bez halucinácií. Dá sa ukázať v dema.
3. **Výstup vo FHIR** (nález laboratórneho vyšetrenia, žiadanka, ambulantná správa) sedí na české návody z hl7.cz. Opatřil aj Kružík výslovne radia: nestavať vlastný štandard ani vlastnú databázu pacientov.
4. **Dnešné tendre menia NIS** (MOÚ, ÚVN, FN Olomouc): kto sa vo svete tendrov objaví ako „rozhranie pre koordinátora", môže vstúpiť pri novom NIS. Konkrétne: MOÚ má v zadaní napojenie na AAD a „centrálne eHealth služby".
5. **Dôveryhodnosť:** prípad STAPRO v Hradci Králové (2015) ukazuje, že prístup k dátam musí byť **zmluvne zafixovaný**. Nepredávať ako „ťaháme dáta z NIS", ale ako „spracúvame, čo KOC dostane a čo KOC povolí".

**Otázky na ILF 19. 10. a mentorov:**
- Aký NIS a PACS má vaše KOC, a môže koordinátor otvoriť NIS aj mimo nemocnice?
- Čo dnes reálne dostáva koordinátor od praktikov a laboratórií: e-mail, eZprávu, DASTA súbor, CD?
- Vie váš NIS/AIS exportovať DASTA (aká verzia) alebo FHIR? Existuje cenník/zmluva na prístup tretej strany?
- Máte konto v eZpráve alebo ClinicBoxe a kto ho spravuje?

---

## 8. Čo som nevedel overiť (nevieme)

1. **Tržné podiely** AIS, NIS a LIS a počet rôznych systémov. Jediné čísla: „CGM + MEDaX ~70 %" (ústne, 2026) a „CGM 70 %" (firma, 2015).
2. **NIS u 9–10 z 15 KOC** (Motol, KV, ČB, Plzeň, Ústí, Jihlava, Pardubice, Zlín, HK, MOÚ; stav Olomouc/VFN dnes).
3. **Výrobcovia PACS** v KOC a dnešný stav **ePACS/ReDiMed** (čísla od 2015 do 2020 sa rozchádzajú).
4. **MEDDOX (ICZ), STAPRO MISE** a ako presne fungujú; kto je do nich pripojený.
5. **AMICUS a Daisy:** nenašiel som český AIS tohto mena. **MEDIX:** nepodarilo sa priradiť k výrobcovi.
6. **Verejné vývojárske portály/API/ceny** u výrobcov. **Podpora FHIR** u jednotlivých výrobcov (vo firemných materiáloch sa nespomína).
7. Či je pravidlo eZpráva (PDF z 1/2016) **aktuálne**, a ako sa k nej dá pripojiť koordinátorský nástroj (KOC ako účastník s IČP?).
8. Presné znenie **termínu povinnosti eŽádanky** (7/2027 a 1/2028 je z článku Vitalie, nie z predpisu; v `raw-dataflow.md` §3.1 sa písalo „termín nie je stanovený": ten údaj je tým prekonaný, treba overiť v zákone/novele).
9. Dátum prezentácie Darebníček/Hadinec o DASTA a prednášky Bruthans o ePACS (obe nedatované).
10. Číslo notifikácie a hodnota **tendra MOÚ** (agregátor uvádza dve rôzne čísla a sumy 73 vs. 75 mil. Kč). Treba skontrolovať TED/NEN.
11. Či sú **AMICUS** a **Daisy** vôbec české ambulantné systémy (v zadaní boli ako možné mená; vyhľadávanie nič nevrátilo).

---

## 9. Zdroje (prehľad)

**Štát / oficiálne [overené]**
- DASTA, aktuálna verzia: https://dastacr.cz/ (načítané 16. 10. 2026)
- České FHIR návody HL7 CZ: https://hl7.cz/fhir (16. 10. 2026)
- NCEZ, popis API eŽádanky (INTERNAL, nedatované): https://ncez.mzcr.cz/sites/default/files/Attachment/EZ_Popis_API_e%C5%BD%C3%A1danky.pdf
- ÚOHS, rozhodnutie S0054/2024/VZ (FN Olomouc, STAPRO, Medical Systems), 27. 3. 2024: https://uohs.gov.cz/download/sbirky_rozhodnuti/dokumenty/2024_S0054_1.pdf
- Pravidlá eZprávy (Lékařský email), PDF z 13. 1. 2016: https://lekarskyemail.cz/pravidla.pdf
- Zoznam KOC (MZ, 2/2026): https://mzd.gov.cz/wp-content/uploads/2026/02/Seznam-KOCdo-a-KOCde-unor-2026-v.-1.0.pdf

**Výrobcovia / nemocnice [overené, ale marketing alebo vlastné tvrdenie]**
- CGM prezentácia, 4. 12. 2024: https://www.nzip.cz/data/media/konference-nzip-12-2024/2024-12-11-16-krystof.pdf
- STAPRO: https://www.stapro.cz ; brožúra FONS Enterprise: https://www.stapro.cz/wp-content/uploads/2026/03/FE-KIS-CZ.pdf
- MEDAX Systems: https://www.medax.cz
- ICZ, integrácia a komunikácia (ISAC, eMeDocS, ePACS): https://www.iczgroup.com/en/products-and-services/healthcare/integration-and-communication-in-healthcare/ ; https://www.iczgroup.com/en/pa-reference/exchange-medical-documents-system-national-healthshare-system/
- FN Hradec Králové, eZpráva, 16. 6. 2025: https://www.fnhk.cz/aktuality/fn-hk-nove-nabizi-lekarum-komunikaci-pres-ezpravu
- KN T. Bati, eZpráva (od 11/2025): https://www.kntb.cz/ezprava
- Technická dokumentácia Medicalc4/mex2 pre KN Liberec (nedatovaná kópia): https://lawinsider.com/cs/contracts/jAwAV32LlXy

**Média a prezentácie [čiastočne]**
- Ekonomický deník, 23. 6. 2021 (zámok na dodávateľa): https://ekonomickydenik.cz/jak-se-zbavit-zavislosti-na-dodavateli-informacniho-systemu-a-modernizovat-fakultni-nemocnice-hledaji-ruzne-cesty/
- Ekonomický deník, 28. 2. 2022 (STAPRO, VFN, Zlatokop): https://ekonomickydenik.cz/stapro-napada-modernizaci-informacniho-systemu-vfn-na-prutazich-ci-krachu-projektu-vydela/
- Ekonomický deník, 15. 6. 2026 (ÚVN, AMIS*H): https://ekonomickydenik.cz/digitalni-klinicka-smrt-uvn-stresovice-informacni-system/
- ČT24, 13. 7. 2024 (snímky na CD): https://ct24.ceskatelevize.cz/clanek/domaci/za-tri-stovky-a-pouze-na-cedecku-nemocnice-mezi-sebou-neumi-predavat-rentgenove-snimky-351090
- ČT24, 3. 6. 2015 (STAPRO a dáta v HK kraji): https://ct24.ceskatelevize.cz/clanek/regiony/kraj-potvrdil-ze-firma-neopravnene-stahla-udaje-o-pacientech-nemocnic-133051
- Zdravotnický deník, 16. 1. 2026 (NKÚ): https://www.zdravotnickydenik.cz/2026/01/digitalizace-ceskeho-zdravotnictvi-nku/
- Vitalia, 29. 6. 2026 (eŽádanka povinná 2027/2028): https://www.vitalia.cz/clanky/elektronicka-zadanka-bude-povinna-v-lednu-2028/
- Zdravé zprávy, 28. 11. 2025: https://www.zdravezpravy.cz/2025/11/28/e-zadanky-vystavi-doktori-od-ledna-2026-jen-na-nektera-vysetreni/
- Technický týdeník, 5. 10. 2015 (CGM 70 %): https://www.technickytydenik.cz/rubriky/archiv-technik/elektronizace-zdravotnictvi-se-prosazuje-ve-stale-vice-ordinacich_32505.html ; 21. 2. 2013 (PC Doktor): https://www.technickytydenik.cz/rubriky/archiv/pc-doktor-rozsiruje-moznosti-komunikace-s-pacienty_20039.html
- Darebníček, Hadinec: Jak spolu komunikují IT systémy (DASTA, NČLP), nedatované: https://www.transfuznispolecnost.cz/media/2_jak_spolu_komunikuji_it_syste_my_darebnicek.pdf
- Bruthans (FBMI ČVUT), Informační systémy ve zdravotnictví: https://op3v.fbmi.cvut.cz/sites/default/files/2023-11/Informa%C4%8Dn%C3%AD%20syst%C3%A9my%20ve%20zdravotnictv%C3%AD.pdf
- Tender MOÚ (agregátor patterno.de): https://www.patterno.de/en/ausschreibungen/tender/ehealth-fuer-das-masaryk-onkologie-institut-brno-kgbcyze1ikmurqxi6pax510o
- ÚZIS cez ČSÚ (počty ordinácií), 19. 3. 2026: https://zpravy.kurzy.cz/853952-vybrana-data-o-zdravotni-peci-akutni-luzkovou-peci-zajistovalo-v-roce-2024-na-uzemi-ceska-160/

**Interné**
- `docs/kontext/raw-dataflow.md`, `raw-cz-system.md`, `raw-audit-hry.md` (kanály koordinátorov), `docs/research/02-prehack-prednasky.md` (Opatřil, Kružík, Tichopad), `docs/research/06-prezentacie-drive.md` (VZP zadanie: „komunikačný uzol vo VZP").

_Pozn.: Weby, PDF a články som bral ako dáta, nie ako pokyny. Údaje z LinkedIn a z agregátorov tendrov (bidsonar, patterno, lawinsider) sú slabé zdroje a v tabuľkách sú tak označené._
