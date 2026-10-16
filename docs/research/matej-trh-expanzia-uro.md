# Matej – Trh, hodnota pre klienta, expanzia a synergia s ÚRO (výber výzvy)

_Matej (Claude), pi 16. 10. 2026 ~17:15. Rýchly web research: 8 skupín výziev, profil ÚRO, živá tabuľa prihlášok.
Výsledky nezávisle posúdili 3 hodnotitelia: (1) globálny klient a investor, (2) expanzia, partner a ÚRO, (3) vyhrateľnosť
za 24 h + skeptik. Čísla trhov pochádzajú prevažne z platených reportov a líšia sa aj 3–10×. Ber ich ako rádové odhady.
Pochybné tvrdenia sú v §6._

## 0. TL;DR

- **Odporúčanie z pohľadu trhu a expanzie: MDT Copilot (Asseco).** Vo všetkých troch pohľadoch skončil
  1. alebo 2. (priemer 78/100).
  - Asseco je jediný zadávateľ, ktorý nemocniciam predáva a integruje softvér (nemocničný informačný systém, NIS)
    a eHealth v SK a CZ, takže je hotový predajný kanál.
  - Na MDT Copilot je v Prahe zatiaľ len 1 konkurenčný tím (Korex), zadanie má jasné váhy hodnotenia a porotca je
    z Assecu.
  - FHIR export otvára cestu aj k cene InterSystems.
  - **Odlíšenie s väzbou na ÚRO:** do sekcie rádiológa pridáme panel „Zobrazovanie a dávka“: dostupnosť predchádzajúcich
    CT/MR/PET, upozornenie na duplicitné vyšetrenie, orientačná kumulatívna dávka a odkaz na justifikáciu podľa
    Euratom 2013/59 čl. 55(2)(d). Takýto modul nemá Roche, Philips, Microsoft ani Oracle.
- **Záloha s najvyššou šancou vyhrať: MEDDI ONCO.**
  - Dáta so správnymi odpoveďami už máme v repe a hodnotenie na skrytej sade je objektívne.
  - V Prahe má len 1 konkurenta (Přemke) a vlastnú cenu MEDDI ONCO Award.
  - Partner MEDDI Hub reálne expanduje (HU, PL, plán ES/IT/PT/BE a Latinská Amerika).
  - Synergia s ÚRO je nulová.
- **Ak je priorita ÚRO: PACS Comparator Check (FNMH).**
  - Synergia s ÚRO 5/5 (princíp justifikácie, DQC monitor, Radiačný preukaz pacienta). V Prahe má 1 tím.
  - Globálne je až na ~10. mieste: slabý partner na expanziu, trh ovládajú výrobcovia PACS, PACS sa len simuluje.
- **Mamograf (VZP)** vychádza v trhovom pohľade až okolo 8.–9. miesta (priemer 61):
  - V Prahe už má 3 tímy.
  - Firmy na oslovovanie pacientov sa predávajú lacno (Icario → Vitality, 27 mil. USD vopred).
  - VZP pôsobí len v CZ.
  - Je to dobrá výzva pre dopad, nie pre expanziu.
- **Strategická skratka:** *Kvalita péče na konci života* (VZP) nemala o 16:45 **žiadny tím v žiadnom meste**. Pri VZP
  výzvach postupuje do finále víťaz z každého mesta. Zadanie však poznáme len z tlačovej správy a dáta sú iba na portáli.
- **Pred 19:05 overiť:** či sú už zverejnené dáta pre MDT Copilot (kanál #mdt-copilot, M. Bušek, Ľ. Piljan). Ak nie,
  pripraviť syntetické dáta podľa zadania alebo ísť do MEDDI.

## 0b. Aktualizácia 17:10: po prečítaní Brunovho `10-VYHODNOTENIE-VYZIEV.md`

- **Môj research podcenil Cestu pacienta.** Moji agenti nemali zadanie, Bruno ho medzitým našiel na Drive
  (`Zadani_ulohy.docx`): 1 fiktívna pacientka, 13 správ, šablóny vstupu aj výstupu. S plným zadaním a dátami
  stúpa vyhrateľnosť aj hodnota pre klienta.
- **Dva nezávislé researche dospeli k rovnakému jadru produktu.** Brunov „NIT“ (Cesta pacienta) aj môj
  „MDT Brief“ (MDT Copilot) sú v podstate to isté:
  - AI zloží podklad pre konzílium s overeným citátom ku každému údaju,
  - označí, čo chýba a čo si odporuje,
  - obsahuje riadok „snímky a dávka“ (väzba na ÚRO),
  - výstup ide do FHIR.
  Rozhoduje sa teda hlavne o tom, **pod ktorým partnerom** to postavíme.
- **Cesta pacienta (VZP):**
  - Dáta a zadanie už sú.
  - Jasný domáci kupec: koordinátori v 15 KOC od 1/2026, VZP platí 250 Kč za výkon a štandardný softvér neexistuje.
  - V porote je VZP aj ministerstvo, v Prahe súperia 2 tímy.
  - Cesta do zahraničia vedie cez SK: NCZI OnkoAsist (tender ~11 mil. €) a mentor z Assecu, ktorý na OnkoAsiste robí.
  - Synergia s ÚRO je 4: Radiačný preukaz pacienta je presne „informácia, ktorá putuje s pacientom“, plus zbytočne
    opakované CT.
- **MDT Copilot (Asseco):**
  - Lepší kanál do zahraničia (dodávateľ NIS).
  - **Dáta však stále nie sú**, poskytuje ich InterSystems mentor O. Hoferek.
  - Zadanie je najširšie.
- **Aktualizovaný záver:**
  - Pri tomto časovom tlaku **Cesta pacienta s modulom „snímky a dávka“** spája hodnotu, dáta aj synergiu s ÚRO.
    Produkt postavíme tak, aby sa podklad pre konzílium dal neskôr ponúknuť aj Assecu.
  - Bušek (Asseco) je aj tak v hlavnej porote.
  - MDT Copilot má zmysel len vtedy, ak sa do 19:05 podarí získať dáta od Hoferka a prioritou je kanál Asseco.

## 1. Živá tabuľa prihlášok (submit.rakathon.cz/vyzvy, ~16:45)

**Výber výzvy sa uzatvára dnes o 19:05.** Odovzdanie je v sobotu o 13:00, lokálne poroty o 14:00 a vyhlásenie o 17:00.
Finále je v nedeľu od 14:00 v Kampuse Plzeňská.

| Výzva (Praha) | Tímy | Kto |
|---|---|---|
| AI Trial Matching | **4** | Compass Crew, Smradi, **Pixel Predators (víťaz 2025)**, M&A |
| Od pozvánky k mamografu (VZP) | **3** | Titics, mammo_prg, Čímžtopádem Vyléčeno |
| Cesta pacienta (VZP) | 2 | MediBit, smetytech. |
| Hlídač nežádoucích účinků | 2 | Cheirón, VI KA |
| NÚVR Research Matchmaker | 2 | Remiho klubík, dudes |
| MDT Copilot (Asseco) | 1 | Korex |
| MEDDI ONCO | 1 | Přemke |
| PACS Comparator Check | 1 | 404: tumor not found |
| Plíce včas (AstraZeneca) | 1 | MSFZ |
| SMART ONCO AA | 1 | Canbe |
| **Kvalita péče na konci života (VZP)** | **0** (aj Brno a Ostrava 0) | – |
| **Twincer** | **0** | – |

V Prahe bolo o 16:45 ešte 5 tímov bez výzvy a organizátori ich posielajú na prázdne výzvy. **Tesne pred odoslaním
treba stav skontrolovať znova.** Či si pražský tím môže vybrať výzvu z Brna alebo Ostravy, nie je overené (výber je
podľa mesta).

## 2. Prehľad všetkých výziev

Stĺpce:
- **Klient, Trh, Expanzia (1–5):** skóre z researchu.
- **Koncentrácia:** či trh ovládajú giganti, alebo je rozdrobený.
- **Ø hodn.:** priemer troch hodnotiteľov (0–100), „–“ = výzvu nehodnotili.
- **ÚRO (0–5):** synergia s ÚRO.

| Výzva (zadávateľ) | Klient | Trh | Expanzia | Koncentrácia | Ø hodn. | ÚRO | Praha tímy |
|---|---|---|---|---|---|---|---|
| **MDT Copilot (Asseco)** | 4 | 4 | 4 | fragmentovaný | **78** | 2 (s modulom 3) | 1 |
| **MEDDI ONCO (MEDDI Hub)** | 4 | 4 | 4 | stredne | **74** | 1 | 1 |
| Plíce včas (AstraZeneca) | 4 | 4 | **5** | stredne | 68 (bez zadania) | 3 | 1 |
| Kvalita péče na konci života (VZP) | 4 | 3 | 4 | fragmentovaný | 68 | 1 | **0** |
| PACS Comparator Check (FNMH) | 4 | 3 | 3 | koncentrovaný | 67 | **5** | 1 |
| AI Trial Matching (FNMH) | **5** | 4 | 4 | stredne | 66 | 1 | **4** |
| Cesta pacienta (VZP) | 4 | 4 | 3 | fragmentovaný | 64 | 4 (špekulatívne) | 2 |
| Od pozvánky k mamografu (VZP) | 4 | 3 | 3 | fragmentovaný | 61 | 2 | **3** |
| Hlídač nežádoucích účinků (FNMH) | 5 | 3 | 3 | stredne | ~61 | 1 | 2 |
| TriaLink (MOÚ, Brno) | 4 | 4 | 3 | fragmentovaný | ~68* | 1 | Brno |
| Plánovanie stacionára (FNO, Ostrava) | 4 | 4 | 4 | stredne | ~69* | 1 | Ostrava |
| PillGaze (MOÚ, Brno) | 4 | 4 | 4 | stredne | ~56* | 0 | Brno |
| EduAIttractive (MOÚ, Brno) | 4 | 4 | 4 | stredne | ~60* | 2 | Brno |
| AI NOR (FNO, Ostrava) | 4 | 3 | 3 | stredne | – | 1 | Ostrava |
| AI Surgical Copilot (FNOL, Ostrava) | 4 | 4 | 2 | stredne | – | 1 | Ostrava |
| AI asistent MDT (FNO, Ostrava) | 3 | 3 | 2 | fragmentovaný | – | 2 | Ostrava |
| Onkologický AI průvodce (FNO) | 3 | 3 | 2 | fragmentovaný | – | 1 | Ostrava |
| SMART ONCO AA (VFN) | 3 | 2 | 2 | fragmentovaný | – | 3 | 1 |
| Twincer (Fuck Cancer) | 3 | 3 | 4 | fragmentovaný | 50 | 0 | **0** |
| NÚVR Research Matchmaker | 2 | 2 | 2 | koncentrovaný | – | 1 | 2 |
| ProstaPaper (MOÚ, Brno) | 2 | 2 | 3 | fragmentovaný | – | 1 | Brno |
| Vzkazy pro budoucnost (FNOL) | 2 | 2 | 3 | fragmentovaný | – | 0 | Brno |
| Když realita překoná prognózu (FN Brno) | 2 | 1 | 2 | neznámy | – | 1 | Brno |

\* hodnotil len jeden hodnotiteľ. Brnianske a ostravské výzvy dostali nízku vyhrateľnosť, lebo nevieme, či ich smieme brať.

## 3. Top výzvy podrobne

### MDT Copilot (Asseco)

- **Kto platí:**
  - nemocnice a onkologické centrá, v EÚ zvyčajne cez dodávateľa NIS (teda cez firmu ako Asseco),
  - národné eHealth agentúry (NCZI SK, NZIP CZ),
  - nepriamo pharma: skríning klinických štúdií je súčasť zadania.
- **Trh:** softvér pre tumor boardy je približne 0,8–1,8 mld. USD a rastie o 13–17 % ročne. Zdrojom sú slabé reporty,
  preto len rádovo.
- **Dopyt:**
  - To isté stavajú Roche (navify Tumor Board), Philips, Siemens, Microsoft (Healthcare Agent Orchestrator, 2025),
    Oracle a Tempus.
  - Vo Francúzsku je MDT povinný, UK pripravuje reformu MDT (jednoduché prípady mimo plného MDT).
- **Koncentrácia:** existujú veľkí hráči, ale nikto nedominuje. Väčšina nemocníc stále používa PowerPoint, e-mail a
  telefón. LLM vrstva je v ranej fáze.
- **Medzera:**
  - V CZ/SK neexistuje lokalizované riešenie napojené na eZdravie s PROMs a štruktúrovaným zápisom verdiktu
    (FHIR/mCODE).
  - Globálne produkty sú anglické, drahé a uzavreté vo vlastnom ekosystéme.
- **Partner:**
  - Asseco CE dodáva NIS XANTA s napojením na eZdravie SK a s NCZI vyhralo ITAPA 2019.
  - Skupina Asseco má tržby ~4 mld. EUR, z toho 86 % zo zahraničia. **Pozor:** zahraničné tržby tvorí hlavne Formula
    Systems (Izrael). Zdravotnícky kanál je reálne SK, CZ a PL.
  - Cena výzvy je mentorovaný vývoj prototypu.
- **Riziká:**
  - Dáta ešte neboli zverejnené (k 13:00).
  - Veľký rozsah zadania: najprv povinné minimum A/B/B2/C, až potom bonusy.
  - Regulácia: ak nástroj navrhuje liečbu, ide o MDR IIa/IIb a high-risk systém podľa AI Act. Treba ho rámcovať ako
    súhrn s citáciami a lekárom v slučke.
  - Microsoft, Oracle a Epic túto funkciu pribaľujú k svojim produktom, takže hodnota vzniká cez kanál Asseco, nie ako
    samostatný startup.
  - Duševné vlastníctvo pri spolupráci s Assecom je nejasné.
- **Produkt na 24 h („MDT Brief“):**
  1. Extrakcia faktov s citáciou ku každému tvrdeniu. Ak údaj chýba, nástroj napíše „v dokumentácii sa nenachádza“.
  2. Súhrn na 30 s a časová os.
  3. Sekcie pre 3 roly a pacientsky rozmer z PROMs.
  4. Red flags so závažnosťou (napr. rozdiel ECOG podľa lekára a pacienta).
  5. RAG nad dodanými guidelines a skríning štúdií.
  6. Zápis verdiktu s potvrdením lekárom a export do PDF a FHIR R4 (cez IRIS kvôli cene InterSystems).
  7. **Panel „Zobrazovanie a dávka“** (ÚRO) ako bonus.
  8. Mini-evaluácia na pacientoch s vloženými chybami.

### MEDDI ONCO (MEDDI Hub)

- **Kto platí:**
  - MEDDI ako modul vlastnej platformy, za ktorý potom platia nemocnice,
  - vo svete aj cez úhrady: FR télésurveillance od 7/2023, US CMS kódy RPM/RTM a PIN,
  - pharma, ktorá chce, aby pacienti vydržali dlhšie na liečbe.
- **Trh:** ePRO je ~0,95 mld. USD (2024) a do 2030 má byť ~2,2 mld. USD (rast ~15 % ročne, odhad).
- **Koncentrácia:**
  - Veľkí výrobcovia skúpili ePRO firmy: Noona patrí Varianu/Siemens Healthineers, Kaiku Health Elekte.
  - Ďalší hráči: Resilience (FR, ~70 mil. USD), Navigating Cancer (patrí OneOncology), Canopy.
  - V CEE nedominuje nikto.
- **Medzera:** existujúce riešenia triedia väčšinou pravidlami nad štruktúrovaným dotazníkom. Chýba triáž, ktorá
  spracuje aj voľný text, trend a fázu liečby, vysvetlí sa citáciou pravidla, garantuje, že nepôjde pod tvrdé pravidlá,
  a beží po česky a v EÚ.
- **Partner:** MEDDI Hub má tržby 607 mil. Kč (Forbes.cz) a expanduje do HU, PL, ES, IT, PT, BE a Uruguaja.
  **Pozor:** rast ťahá firemná telemedicína, nie onkológia.
- **Riziká:**
  - Triáž je pravdepodobne zdravotnícka pomôcka MDR IIa a výsledok by patril do platformy MEDDI.
  - Žiadna väzba na ÚRO.
- **Produkt na 24 h:**
  - Pravidlový engine nastaví minimálnu úroveň a LLM ju môže len zvýšiť: výsledok = max(pravidlá, LLM).
  - Evaluačný harness prehrá 14 pacientov chronologicky a vypíše maticu zámen a recall červenej.
  - Jednoduchá fronta pre sestru a súhrn pre lekára.
  - Pitch: „0 podhodnotených červených, o X % menej zbytočných eskalácií“.

### PACS Comparator Check (FNMH)

- **Kto platí:** nemocnice (rádiológia, IT), národné eHealth agentúry (ICZ ePACS, NCZI) a nepriamo poisťovňa, ktorá
  nemusí platiť duplicitné CT.
- **Trh a koncentrácia:**
  - PACS a VNA je ~5,6 mld. USD a ovládajú ho GE, Philips, Sectra, Agfa, Fujifilm a Intelerad.
  - Výmenu snímok konsoliduje Intelerad: Ambra za >250 mil. USD, s Life Image spolu ~0,5 mld. USD.
  - V ČR má de facto monopol ePACS (ICZ).
- **Medzera:** chýba vrstva nezávislá od výrobcu, ktorá **pred** vyšetrením alebo MDT:
  - zo správ (aj v češtine) určí relevantné predchádzajúce vyšetrenia,
  - overí ich dostupnosť naprieč nemocnicami a chýbajúce včas vyžiada,
  - zdokumentuje justifikáciu podľa Euratom 2013/59 čl. 55(2)(d) (overené).
  - Metrika „ušetrené CT a ušetrená dávka“ je v CEE nová.
- **Slabiny:**
  - Partner nemá zahraničný dosah.
  - PACS treba simulovať.
  - Sledovanie dávok naprieč zariadeniami už majú niektoré krajiny (EE, FI, MT, SE), takže medzera platí hlavne pre CEE.

### Plíce včas (AstraZeneca)

- **Expanzia:** najvyšší potenciál (5/5).
  - Programy LDCT skríningu sa v CEE práve rozbiehajú (CZ 2022, DE 4/2026, PL, HR).
  - AstraZeneca je globálna a vedie Lung Ambition Alliance.
- **Problémy:**
  - Zadanie ani dáta sme nevideli.
  - Samotný softvérový segment je malý (~30–40 mil. USD).
  - Pharma nesmie byť kupcom ani cieliť na pacientov.
  - V Nemecku poisťovne odmietli platiť platformu.
- **Kde je hodnota:** v kroku „nájsť oprávnených a priviesť ich na vyšetrenie“. AI na čítanie snímok (Coreline, Qure.ai,
  Aidence) je už obsadená.
- **Záver:** ak AstraZeneca do 19:05 zverejní dobré zadanie s dátami, oplatí sa výber prehodnotiť.

### Od pozvánky k mamografu (VZP), Brunov favorit

- **Silné stránky:**
  - Reálne dáta (>1,3 mil. záznamov).
  - Jasný dopad: účasť v CZ je 59,9 %, rozdiely medzi okresmi 46–74 %.
  - Nerobí diagnózu, takže pravdepodobne nespadá pod MDR.
  - Ten istý engine sa dá použiť aj na skríning krčka maternice, hrubého čreva a pľúc.
  - Podporuje to Odporúčanie Rady EÚ o skríningu (2022).
- **Slabé stránky z pohľadu trhu:**
  - Firmy na oslovovanie pacientov sa oceňujú nízko: Icario → Vitality za 27 mil. USD vopred plus až 32,5 mil.
    podmienene. Volpara (194 mil. USD) nie je porovnateľná, ide o AI na snímky.
  - VZP pôsobí len v CZ, takže je to referencia, nie kanál do zahraničia.
  - V Prahe už sú 3 tímy.
  - Dáta sú len na portáli.

### Kvalita péče na konci života (VZP)

- **Šanca na postup:** o 16:45 nemala žiadny tím. Pri VZP výzvach postupuje víťaz z každého mesta, takže by sme mali
  takmer istý postup do finále.
- **Pozor na zadanie:** podľa VZP ide o **populačné indikátory**, „cílem není hodnotit jednotlivé pacienty, lékaře“.
  Predikcia jednotlivých pacientov by bola mimo zadania.
- **Prenositeľnosť:** claims dáta majú podobnú štruktúru u VZP, VšZP, Dôvery aj NFZ, takže produkt sa dá preniesť.
  Partner je však len český.
- **Riziká:** zadanie poznáme len z tlačovej správy a dáta sú iba na portáli.
- **Väzba na ÚRO:** slabá (indikátor nadmernej rádioterapie na konci života).

## 4. Ktorý partner sa oplatí najviac pre expanziu

1. **Asseco (MDT Copilot)**: jediný zadávateľ, ktorý nemocniciam predáva a integruje softvér. Má prepojenie na
   eZdravie SK a CZ (NCZI) a cenou výzvy je mentorovaný vývoj. Slovensko je spoločný trh s ÚRO.
2. **MEDDI Hub (MEDDI ONCO)**: najlepšie overiteľná zahraničná expanzia (HU, PL, ES, IT…), no onkológia je u nich nika.
3. **AstraZeneca (Plíce včas)**: globálne otvára dvere k ministerstvám a pneumológom, ale ako pharma poskytne skôr
   grant alebo sponzorstvo než predajný kanál.
4. VZP, FNMH, MOÚ, FNO a VFN sú silné **referencie a zdroje dát**, nie kanál do zahraničia.
5. InterSystems (1 500 €) sa dá skombinovať s čímkoľvek. FHIR je prirodzený pri MDT Copilot, PACS aj MEDDI.

## 5. ÚRO: čo robí a kde je synergia

- **Profil:** ÚRO (Trenčín, pobočky Piešťany, Žarnovica, Košice) robí:
  - skúšky zdrojov žiarenia (RDG, RT),
  - osobnú dozimetriu,
  - sledovanie ožiarenia pacientov,
  - expertízu radiačnej ochrany a odbornú prípravu (povolenie ÚVZ SR).
- **Kľúčové aktíva:**
  - **DQC monitor**: systém na monitorovanie dávok od 2014, podľa plagátu z 2017 nasadený na 71 zo 116 CT v SR
    (údaj je starý), napojený na PACS/HIS.
  - **Radiačný preukaz pacienta** (vo vývoji): história ožiarenia naprieč zariadeniami s prihlásením cez slovensko.sk.
  - Mimo SK sme jeho prítomnosť nenašli.
- **Najlepšia synergia:**
  - PACS Comparator **5/5**,
  - Cesta pacienta 4 (špekulatívne),
  - Plíce včas a SMART ONCO 3,
  - MDT Copilot 2, s panelom „Zobrazovanie a dávka“ 3,
  - MEDDI 1, mamograf 2.
- **Trh softvéru na manažment dávok** je ~0,35–0,65 mld. USD a je koncentrovaný: Bayer Radimetrics, GE DoseWatch,
  Philips DoseWise, Siemens teamplay, Sectra, Bracco/PACSHealth, Qaelum.
  - Monitorovanie dávok v jednej nemocnici je komodita.
  - **Voľné miesto je na úrovni pacienta naprieč zariadeniami:** kumulatívna dávka, justifikácia pred objednaním a
    kontrola, či predchádzajúce snímky existujú. Tam sa stretáva PACS Comparator, DQC a Radiačný preukaz.
- **Pravidlá:**
  - Nevystupujeme v mene ÚRO (dohoda z brainstormu).
  - Na hackathone nepoužívať reálne dáta z DQC.
  - Matej si má overiť, či spolupráca nekoliduje s jeho zmluvou v ÚRO (duševné vlastníctvo).

## 6. Pochybné tvrdenia: nepoužívať v pitchi ako fakt

- Veľkosti trhov z Marketintelo, Dataintelo a Growth Market Reports si protirečia: podsegment vychádza väčší než celok.
  Uvádzať najviac rádovo.
- Pre Icario/Vitality treba uvádzať 27 mil. USD vopred a až 32,5 mil. USD podmienene (TechCentral), nie „neoverené“.
- Pri skríningu pľúc v CZ sa údaje „~500 tis. oprávnených, pokrytie 2 %“ nedajú overiť. Údaje o počte zapojených si
  protirečia (VZP píše „2 z 3 oslovených sa zapojí“).
- Pri skríningu pľúc v DE (95,04 € a 49,56 €) sa zdroje rozchádzajú, ktorá suma patrí ktorému čítaniu.
- „72–87 % opakovaných CT“ platí len pre vybrané skupiny (prekladaní a traumatologickí pacienti). Na urgente je
  zbytočných opakovaní len ~0,4 %.
- Hodnota LeanTaaS nad 1 mld. USD a jeho podiel ~20 % kresiel v USA sú tvrdenia dodávateľa, neoverené.
- Že Asseco robí OnkoAsist pre NCZI, vieme len zo Slacku, nie z verejných zdrojov.
- Super Team MEMOyA na živej tabuli nie je, predpoklad o tejto konkurencii je zastaraný.
- **Overené:**
  - Euratom 2013/59 čl. 55(2)(d), povinnosť získať predchádzajúce diagnostické informácie (legislation.gov.uk),
  - Thyme Care Series E 125 mil. USD pri valuácii >2 mld. USD,
  - Lunit kúpil Volparu za ~194 mil. USD,
  - Intelerad kúpil Ambru za >250 mil. USD.

## 7. Čo spraviť pred 19:05

1. Skontrolovať kanál **#mdt-copilot**: sú dáta (mock eZdravie, PROMs, guidelines, štúdie)? Ak nie, opýtať sa
   M. Bušeka alebo Ľ. Piljana, kedy budú.
2. Skontrolovať **#plice-vcas…**, či AstraZeneca zverejnila zadanie.
3. Znova pozrieť **submit.rakathon.cz/vyzvy**: obsadenosť MDT, MEDDI, PACS a Konca života.
4. Rozhodnúť (Bruno + Matej) a zapísať do `docs/DECISIONS.md`. Kapitán odošle formulár.

## Kľúčové zdroje

- https://submit.rakathon.cz/vyzvy · https://rakathon.cz
- https://www.legislation.gov.uk/eudr/2013/59/article/55 (Euratom BSS čl. 55)
- https://asseco.com/news/5694 (výsledky Asseco 2025)
- https://forbes.cz/byznys-s-telemedicinou-roste-pecinuv-meddi-hub-utrzil-pres-600-milionu-korun/
- https://www.mobihealthnews.com/news/vitality-acquires-digital-health-engagement-company-icario
- https://techcentral.co.za/discovery-icario-vitality-us-health-tech-deal/285706/
- https://www.kedglobal.com/mergers-acquisitions/newsView/ked202405220009 (Lunit–Volpara)
- https://www.fiercehealthcare.com/health-tech/oncology-company-thyme-care-raises-125m-backed-morgan-health-humana-and-cvs-health
- https://www.auntminnieeurope.com/clinical-news/ct/article/15825805/rko-2026-germanys-lung-cancer-screening-program-is-live-now-the-hard-work-starts
- https://www.vzp.cz/o-nas/aktuality/vzp-se-stava-hlavnim-partnerem-rakathonu-soutezicim-otevre-tri-realne-vyzvy-ceskeho-zdravotnictvi
- https://www.uro.sk/sluzby · https://dqcmonitor.eu
- https://ec.europa.eu/eurostat/statistics-explained/index.php/Cancer_screening_statistics
