# Praha – MDT Copilot (Asseco Central Europe) – hĺbková analýza

_Stav: piatok 16. 10. 2026, cca 16:45. Nič sa necommitovalo ani neposielalo, v Slacku iba čítané._

**Značky pri zdrojoch:** **[Slack]** kanál/správa, **[doc]** Word zadanie od zadávateľa, **[pptx]** prezentácia zadania (vrátane poznámok rečníka), **[Drive]** iná prezentácia z Drive, **[V]** zdroj som v tejto relácii otvoril a číslo overil, **[S]** sekundárny zdroj alebo číslo z našich súborov 07/08/09, ktoré som znovu neotváral, **[?]** neisté / nezaznelo / neoverené. Odborné pojmy sú vysvetlené v zátvorke.

**Poznámka k webu:** nástroj WebSearch dosiahol limit pre celú reláciu, takže „vlastný web search“ je obmedzený na priame otváranie konkrétnych zdrojov (WebFetch). Stránky BMJ, ASCO, Elsevier, Roche a Fierce Healthcare mi vrátili chybu 403 alebo presmerovanie, preto sú ich čísla označené [S] alebo [?].

---

## 0. TL;DR (verdikt)

- **Čo to je:** postaviť webovú appku, ktorá z roztrúsených lekárskych správ a pacientovho dotazníka za pár sekúnd pripraví podklad pre **onkologické konzílium** (MDT = multidisciplinárny tím, porada chirurga, onkológa, rádiológa, patológa, ktorá rozhoduje o liečbe jedného pacienta; v ČR „indikační onkologická komise“). Na konci appka zapíše rozhodnutie komisie ako oficiálny záznam.
- **Prečo je to zaujímavé:** má **najpresnejšie zverejnenú bodovaciu tabuľku zo všetkých výziev** (30 / 20 / 20 / 15 / 15 % + až 10 % bonus), rozumný dopyt (Asseco aj FN Ostrava zadali v podstate to isté), vysokú realizovateľnosť s Claude Code a v Prahe zatiaľ **iba 1 tím (Korex)**. Dá sa kombinovať s cenou InterSystems (1 500 EUR).
- **Najväčšie slabiny:** (1) **dáta k výzve zatiaľ nie sú v Slacku** (dáva ich InterSystems mentor), (2) je to technicky **najširšie zadanie** (veľa povinných kúskov), (3) dôkazy o prínose AI pre konzílium sú zatiaľ len zo simulácií a malých štúdií, (4) v produkcii by išlo o zdravotnícky prostriedok (MDR) a vysokorizikovú AI (AI Act).
- **Moje celkové skóre (vážený priemer podľa Vašich váh): 6,0 z 10.** Detail v §7.
- **Pražský tím ju môže zvoliť:** áno, je medzi 12 pražskými výzvami vo formulári [Slack/web].

---

## 1. Presné zadanie

### 1.1 Kto za tým stojí
- **Zadávateľ:** Asseco Central Europe (dodávateľ nemocničných a štátnych IT systémov). **Garant a zároveň porotca:** Michal Bušek (Asseco, aj HL7 ČR). **Mentori:** Ľuboslav Piljan (softvérový analytik Asseco na projekte „Onkologická cesta pacienta“ pre slovenské NCZI), Ondřej Hoferek (technický riaditeľ InterSystems pre ČR a SK, HL7 ČR) [pptx slide 10; doc].
- **Kanál:** `#mdt-copilot` (pôvodne `praha-mdt-copilot`). Prečítal som celý kanál: obsahuje **iba dve správy od Bušeka (prezentácia 11:01, Word zadanie 11:07)** a „joined the channel“ správy. **Žiadna diskusia, žiadne vlákna, žiadne dáta, žiadne otázky tímov** [V, Slack 16. 10. ~16:40].
- Súbory v repe: `docs/materials/slack/mdt-copilot/Rakathon_tema_CZ_ACE.docx` (kompletné zadanie vrátane bonusov a váh) a `MDT_Copilot_zadani_upravene_2026_v02.pptx` (13 slidov, laická verzia + slovníček). Obsah som prečítal celý, vrátane poznámok rečníka.

### 1.2 Misia vlastnými slovami
Funkčný prototyp **webovej aplikácie**, ktorá pomocou AI:
1. zlúči dva druhy dát: **nestrukturované lekárske správy** (voľný text z eZdraví – prepúšťacie správy, popisy CT/MRI) a **dotazník pacienta** (PROMs = Patient-Reported Outcome Measures, čo pacient sám hlási: bolesť, únava, nálada),
2. vygeneruje **modulárny, nastaviteľný podklad pre konzílium**, ktorý zároveň slúži ako **oficiálny záznam so zapísaným verdiktom** [doc §1].
- **Zlaté pravidlo:** AI pripravuje, sumarizuje, upozorňuje a navrhuje, **rozhodujú vždy lekári** (human-in-the-loop = človek v rozhodovacej slučke). Každý výstup AI musí byť **vizuálne odlíšený** od obsahu potvrdeného lekárom [doc].
- Appka má podporiť **všetky tri fázy** MDT: **pred** (nominácia pacienta s konkrétnou otázkou, kontrola úplnosti podkladov), **počas** (orientácia, pohľady odborností, možnosti liečby, zápis rozhodnutia), **po** (komunikácia záveru, úlohy s termínom a zodpovednou osobou, kontrola realizácie) [doc].

### 1.3 Povinné minimum (musí byť) vs. BONUS (body navyše)

| Blok | Povinné minimum | BONUS (nepovinné, až +10 %) |
|---|---|---|
| **A. Spoločný úvod** (orientácia do 30 s) | identifikácia prípadu, hlavná diagnóza, **ECOG** (škála 0–4 – ako pacient zvláda bežné činnosti) podľa lekára **aj** podľa pacienta, rozdiel = **automaticky red flag**; **otázka pre MDT** (AI ju môže spresniť, nesmie si ju domýšľať; ak chýba, prípad je „neúplný“); **časová os** ochorenia | **Case readiness** semafor úplnosti podkladov podľa typu nádoru |
| **B. Pohľady odborností** | **min. 3 roly** z: chirurg (resekabilita, TNM = rozsah nádoru), klinický onkológ (biomarkery, linie liečby, nežiaduce účinky z PROMs), rádiológ (porovnanie CT/MRI, RECIST = pravidlá merania rastu nádoru), patológ, pacientsky rozmer (PROMs, preferencie, trend) | RECIST 1.1 predvýpočet, návrh chýbajúcich biomarkerov, ďalšie roly (nukleárna medicína, paliatíva, geriatria, genetika, koordinátor) |
| **B2. Podpora rozhodovania** (povinné) | možnosti liečby z dodaných **guidelines** (odporúčané postupy) **s citáciou konkrétnej pasáže** (RAG = AI najprv vyhľadá pasáže v dodaných dokumentoch a odpovedá len z nich), **predbežný screening klinických štúdií** (vhodný / nevhodný / chýba údaj, s dôvodom pri každom kritériu), 2–3 otázky do diskusie, kontrola súladu záveru s guidelines (upozorní, nezablokuje) | podobné anonymizované prípady |
| **C. Zápis a záver** | štruktúrovaný záznam rozhodnutia (prítomní a kvórum, zvažované možnosti, zvolený postup, zdôvodnenie, súlad s guidelines áno/nie + dôvod odchýlky, odlišné stanoviská, zaradenie do štúdie), termín re-evaluácie, **export PDF / HL7 FHIR** | mapovanie na FHIR R4 / mCODE (Condition, Observation, QuestionnaireResponse, CarePlan + Task, Provenance), AI zapisovateľ z prepisu diskusie, akčný plán s úlohami, zhrnutie pre pacienta a praktika, uzamknutie a verzovanie |
| **Nastaviteľnosť** | predseda si „naklikne“ sekcie, poradie, prítomné odbornosti, mieru detailu (odrážky vs. text) | šablóny podľa typu nádoru, pravidlá red flagov, predvolený pohľad pre rolu |
| **AI interpretácia** | **red flagy** (rozpory medzi zdrojmi, napr. pokles hemoglobínu + extrémna únava v dotazníku) so **závažnosťou a citáciou oboch zdrojov**; **dohľadateľnosť** (klik na zdroj), „v dostupnej dokumentácii sa nenachádza“ namiesto odhadu; AI obsah vizuálne označený | rozšírené red flagy (rôzne TNM v dvoch správach, zastarané podklady, nový symptóm bez vyšetrenia, rastúce onkomarkery pri „stabilnom“ náleze, interakcie liekov), citácie na úrovni vety, NLP extrakcia, Q&A nad prípadom, audit stopa, pseudonymizácia + popis AI Act/MDR, **evaluácia** (napr. 20 faktov + vložené nezrovnalosti) |

### 1.4 Dáta, ktoré majú dostať
Podľa zadania [doc §4, pptx slide 7]: mock (vymyslené) dáta z eZdraví v JSON/FHIR (prepúšťacie správy, laboratórne výsledky s trendom onkomarkerov, popisy CT/MRI, lieky); PROMs v JSON (podľa EORTC QLQ-C30, PRO-CTCAE, Distress Thermometer, **min. 2 vyplnenia v čase**); nominácia na MDT (odosielajúci lekár, otázka, dôvod, predchádzajúce závery); **výťah z guidelines** (text/PDF s číslovanými pasážami) + **3–5 fiktívnych klinických štúdií** s kritériami; **3–5 pacientov** s rôznymi nádormi, so **zámerne vloženými nezrovnalosťami a chýbajúcimi údajmi** a **referenčné riešenie (ground truth)**; bonus mock prepis diskusie. Kódovanie MKN-10 / ICD-O-3, LOINC, SNOMED CT, profily mCODE / IPS.

**Stav dát k 16:45: NIE SÚ.** V kanáli nič, ani odkaz [V]. Podľa INTRO Praha a InterSystems slidu dáva dáta k MDT Copilot a SMART ONCO AA **InterSystems mentor (Praha: Ondřej Hoferek, Gabriel Ing), osobne alebo cez Slack** [Drive, 05]. Pri SMART ONCO AA mu dáta posielal súkromnou správou o 15:38 [05]. **Tím Korex ich možno už má, to sa z Slacku nedá zistiť [?].**

### 1.5 Hodnotiace kritériá (výzva-špecifické) [doc §5]

| Kritérium | Váha | Čo tým myslia |
|---|---|---|
| Klinická hodnota a UX pre MDT | **30 %** | prehľadnosť spoločného súhrnu, zrozumiteľnosť sekcií podľa rolí, intuitívny zápis záveru |
| Konfigurovateľnosť | **20 %** | šablóny, pridávanie/odoberanie sekcií, zmena poradia pre rôzne tímy |
| Technické riešenie AI a spoľahlivosť | **20 %** | presnosť promptovania (minimum halucinácií), klikateľné citácie, dodržanie štruktúry výstupu |
| Dátová integrácia a štandardy | **15 %** | prepojenie subjektívnych dát (dotazník) s objektívnymi nálezmi, export, FHIR, štandardné číselníky |
| Podpora MDT procesu a zodpovedná AI | **15 %** | Decision Support Panel s citáciami, štruktúrovaný záznam rozhodnutia, human-in-the-loop, označenie AI obsahu |
| Bonusové funkcie | až **+10 %** | hodnotí sa kvalita, nie počet |

Všeobecné sobotné kritériá Rakathonu (AI a prevedenie; využiteľnosť v praxi u zadávateľa; inovatívnosť) a nedeľné (škálovateľnosť; kvalita prezentácie a tímu) platia navyše; váhy nie sú zverejnené [05]. Podľa mojej mapy sa výzva-špecifické kritériá takmer 1:1 prekrývajú s všeobecnými 1 a 2.

### 1.6 Čo sa má predviesť [doc §6, pptx slide 9]
Max. **5 minút, jeden pacient, celý cyklus naživo**: vygenerovať podklad podľa zvolenej konfigurácie → orientácia v súhrne do 30 s → **overiť aspoň jedno tvrdenie AI a jeden red flag klikom na zdroj** → Decision Support Panel (možnosti liečby s citáciou, screening štúdií) → zápis a potvrdenie záveru → export. K tomu **krátky popis architektúry AI**: model, grounding/RAG, prevencia halucinácií, ochrana údajov.

### 1.7 Ceny a kontext zadávateľa
- **Cena Asseco CE:** rozvoj prototypu s mentormi Asseco CE a kontakty v zdravotníctve (nie peniaze) [Drive INTRO, 05].
- **Michal Bušek je v hlavnej porote** (povedal to v úvode) [05]. Podľa zadania „návrh výstupu pripomienkujú onkológovia zapojení do hackathonu“ [doc §2, pptx slide 11], teda aspoň časť klinickej spätnej väzby príde zo strany organizátorov.
- **InterSystems cena (1 500 EUR)** sa dá pridať k tejto výzve (musí byť skutočné použitie IRIS for Health / FHIR, nie nálepka) [04].
- Pre produkciu zadanie samo hovorí: bol by to **vysokorizikový systém podľa AI Act a zdravotnícky prostriedok (MDR)**; v zadaní sa hodnotí, že tím vie opísať, ako by do požiadaviek zapadol [pptx notes, slide 9; doc bonus].

### 1.8 Nejasnosti, ktoré treba vyriešiť [?]
1. **Kedy a v akom formáte prídu dáta** a či ich už má iný tím.
2. Či je „RAG nad dodanými guidelines“ naozaj len dodaný výťah (áno podľa doc) alebo smie tím použiť aj vlastné guidelines.
3. Či sa vyžaduje **reálne FHIR úložisko** (InterSystems IRIS) alebo stačí export FHIR Bundle (JSON). Podľa doc stačí export, mapovanie je bonus.
4. Či „5 minút“ platí v sobotu pri obchôdzke aj v nedeľu na pódiu (nedeľná dĺžka pitchu nie je oficiálne zverejnená) [05].

---

## 2. Koncový užívateľ

### 2.1 Kto presne
Nie „lekár“ všeobecne, ale **štyri konkrétni ľudia okolo jedného stola**:
1. **Predseda komisie** (zvyčajne skúsený klinický onkológ alebo chirurg): chce za 30 sekúnd vedieť, o čom prípad je, a na konci diktovať rozhodnutie.
2. **Koordinátor/ka konzília (onkologická sestra, case manager)**: pred poradou zbiera podklady od lekárov z regiónu, pýta chýbajúce, po porade rozosiela závery. V ČR je od 1/2026 v každom KOC (komplexné onkologické centrum) aspoň jeden **koordinátor onkologickej starostlivosti** a za výkon koordinácie platí poisťovňa **250 Kč** [S, 08 podľa MZ 2. 9. 2026].
3. **Špecialisti** (rádiológ, patológ, chirurg, rádioterapeut): každý chce vidieť „svoju“ časť (rádiológ porovnanie snímok v čase, patológ histológiu a chýbajúce biomarkery).
4. **Odosielajúci lekár / praktik**, ktorý chce vedieť výsledok. (Pacient je nepriamy užívateľ: dostane zrozumiteľné zhrnutie, až po schválení lekárom.)

### 2.2 Ako vyzerá jeho deň (rekonštrukcia z podkladov, nie citácia z rozhovoru)
_Toto je ilustrácia poskladaná z čísel v §3 a z toho, čo hovorili Tichopád a zadávatelia. Nehovoril som s reálnym koordinátorom ani onkológom._

- **Pondelok až streda – koordinátorka:** nominácie prichádzajú e-mailom, cez NIS (nemocničný informačný systém) alebo papierom. Chýba histológia, CT je v inej nemocnici, laboratórium v treťom systéme. Volá lekárom („neobvolávať pol republiky“ je presne veta zo zadania PACS Comparatoru [04]). Ručne skladá podklad, často z PDF a skenov.
- **Štvrtok ráno – porada:** v pražských/ostravských centrách je to veľa pacientov za krátky čas. Mierka z Leeds (pankreas, 35–50 pacientov za 3 hodiny): v priemere **217 sekúnd na pacienta** [V]. Radiológ premieta snímky, ostatní počúvajú, predseda **diktuje záver**; v Leeds šlo na samotné diktovanie 47 % času [V]. Dotazník pacienta (ako sa cíti, ECOG podľa pacienta) na stole zvyčajne **nie je**.
- **Po porade:** niekto prepíše záver do dokumentácie a pošle ho odosielajúcemu lekárovi. Tichopád na pre-hack dni: MDT „má byť právny akt so zápisom“, ale často je to telefonát dvoch lekárov a **chýba sledovanie, či sa záver naozaj splnil** [02]. Presne to zadanie rieši fázou „po zasedaní“.

### 2.3 Čo ho bolí a prečo dnešný stav zlyháva
1. **Údaje sú rozhádzané v 5 systémoch** (NIS, laboratórium, PACS = archív snímok, patológia, genetika), lekár ich skladá ručne; FN Ostrava to opisuje vlastnými slovami: „Nechceme ďalší systém, kde bude lekár hľadať informácie“ [Drive, 06].
2. **Nálezy sú voľný text bez štruktúry**, takže „nič sa nesčíta samo“ (trend onkomarkerov, súčet lézií) [pptx slide 3].
3. **Chýba hlas pacienta**: dotazník je mimo systému, takže rozpor „lekár píše ECOG 1, pacient sa cíti na ECOG 3“ nikto nezachytí [pptx; doc].
4. **Neúplné podklady = zbytočná porada.** V Leeds malo **65 % pacientov neúplné údaje pri odoslaní** a **13 % rozhovorov sa nedalo uzavrieť, lebo chýbala patológia/rádiológia/iný údaj** [V]. Pacient potom čaká na ďalšie kolo porady.
5. **Málo skutočnej diskusie:** v Leeds **43 % pacientov nedostalo interaktívnu diskusiu**, prípad sa len predstavil a záver sa nadiktoval [V].
6. **Rastúci tlak:** v troch britských centrách vzrástol počet pacientov na poradu o **23,5 – 38,8 % za 5 rokov (2017 → 2022)** [V]. V ČR je cieľ zvýšiť podiel pacientov preberaných na MDT z cca 60 % na cca 80 % [V, OECD], takže záťaž bude rásť.
7. **Zodpovednosť a dôkaz:** konzílium je v ČR podmienkou úhrady (§3), takže zápis musí byť úplný a dohľadateľný.

---

## 3. Dôkazy o probléme (čísla a zdroje)

### 3.1 Čas a úplnosť podkladov na konzíliu

| Tvrdenie | Číslo | Zdroj | Spoľahlivosť |
|---|---|---|---|
| Čas na jedného pacienta (zadávateľ) | **3–5 minút** | Asseco zadanie [doc §1, pptx slide 3] | tvrdenie zadávateľa |
| Čas na pacienta, Leeds pankreas MDT | priemer **217 s**; **65 %** pacientov s neúplnou informáciou pri odoslaní; **13 %** diskusií bez záveru pre chýbajúce údaje; **43 %** bez interaktívnej diskusie; **47 %** času = diktovanie záveru; 35–50 pacientov / 3 h; 1 811 diskusií u 1 199 pacientov (2017–18) | slidy A. Young, Leeds, 2020: https://www.pancreaticcancer.org.uk/wp-content/uploads/2020/10/Improving-MDT-function-Alastair-Young.pdf | [V] otvorené a prečítané; **jedno centrum, UK, najťažší nádor (pankreas), prezentácia nie recenzovaná štúdia** |
| Čas na pacienta, urologické MDT | max. priemer **3,8 min** (rozsah 0,86–10,7, 37 odpovedí); 2022: Birmingham **2,6**, Liverpool **5,4**, Cardiff **7,6** min | https://pmc.ncbi.nlm.nih.gov/articles/PMC10705031/ | [V] malý prieskum |
| Rast záťaže 2017 → 2022 | pacienti/týždeň: Birmingham 34,5 → 46,5 (**+34,8 %**), Liverpool 27,2 → 33,6 (**+23,5 %**), Cardiff 22,7 → 31,5 (**+38,8 %**) | tamže | [V] |
| „Zbytočné prípady“ na porade | **76 %** (28 z 37) respondentov hovorí, že sa preberajú aj prípady, ktoré tam nemusia byť; odhad podielu median **20 %** (5–70 %) | tamže | [V] názory, nie meranie |
| Cena MDT v UK | **> 150 mil. £ ročne** | https://pmc.ncbi.nlm.nih.gov/articles/PMC7705157 | [V] odhad z preh. článku |
| Variabilita rozhodnutí medzi centrami | existuje štúdia 7 pankreatických centier (UK + Škandinávia) s 19 pacientmi, kde sa rôzne hodnotila resekabilita aj alokácia liečby (BJS 2019; 106: 756–64); výsledky z textu slidov neviem prečítať | slidy Leeds (odkaz na štúdiu) | [?] samotnú štúdiu som neotvoril |

### 3.2 Čo to znamená v ČR

| Tvrdenie | Číslo | Zdroj | Spoľahlivosť |
|---|---|---|---|
| MDT je povinný pre akreditáciu KOC | áno („required for KOC accreditation“) | OECD/EK Country Cancer Profile Czechia 2025, str. 23: https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-cs-2025-1663-v2-en.pdf | [V] |
| Úhrada závislá od MDT | poisťovne platia v určitých prípadoch len po konzíliu: **pankreas, prsník, vzácne nádory, robotická chirurgia a všetky inovatívne onkologické lieky**; samotné konzílium sa platí osobitne (fee-for-service) | tamže, str. 23 | [V] |
| Podiel pacientov na MDT | takmer **60 %** pacientov liečených prvýkrát pre solídny nádor v KOC (2022); Česká onkologická spoločnosť odhaduje, že by malo byť cca **80 %**; údaj môže byť mierne podhodnotený | tamže | [V] |
| Veľkosť ČR | > **61 000** nových onkologických prípadov ročne, **565 / 100 000** | tamže | [V] |
| Koordinátor od 1/2026 | min. 1 v každom z 15 KOC; **250 Kč / výkon** | MZ ČR 2. 9. 2026 (cez 08) | [S] |
| Údaje o podiele MDT sa zverejňujú | portál indiko.cz (ČVUT FBMI, ÚZIS, MZ); podiel MDT môže odrážať len vykazovanie | 08 | [S] |

### 3.3 Oneskorenie liečby (prečo je čas dôležitý)
- Meta-analýza **Hanna et al., BMJ 2020**: každé 4 týždne meškania liečby zvyšujú riziko úmrtia; pri operácii podľa abstraktu približne **6–8 % na 4 týždne** [S, 06]. Asseco v keynote uvádza rozsah „1–13 %“, presný rozsah pre iné typy liečby som nepotvrdil [?]. BMJ stránka mi vrátila 403: https://www.bmj.com/content/371/bmj.m4087
- **Pozor na logiku:** konzílium je len jeden krok cesty. MDT Copilot skracuje najmä „čakanie na úplné podklady“ a „opakované porady“, nie celú cestu od príznaku k liečbe (to je skôr téma VZP Cesta pacienta).

### 3.4 Čo vieme o prínose AI pre konzílium (čestne: slabý dôkaz)
- **Simulačná štúdia (JCO Clin Cancer Inform 2026, 26 onkológov):** príprava súhrnu **6:55 min s jazykovým modelom vs. 8:47 min bez neho**; úplnosť (škála) **3,93 vs. 3,13** [S, 07, abstrakt; stránku ASCO som neotvoril, 403].
- **Annals of Oncology 2026 (12 tumor boardov):** AI zapisovateľ znížil administratívny čas na pacienta oproti ručnému zápisu a zlepšil kvalitu zápisu [S, 07, abstrakt].
- **Záver 07:** len simulácie a malé štúdie, **žiadny veľký dôkaz o lepších výsledkoch pacientov**; agentová AI pre tumor board je „horúca téma bez publikovaných výsledkov z reálnej praxe“ [S].
- **Moja ilustračná kalkulácia (predpoklady sú moje, nie fakty):** ak by sa úspora 1:52 min na prípad z simulácie preniesla do praxe a jedno MDT ročne prejde ~1 800 diskusií ako Leeds, ide o ~**56 hodín ročne** (1 811 × 112 s). To je málo. Väčší potenciál je **v 13 % zbytočných diskusií**: pri 1 811 diskusiách je to **~235 diskusií ročne** na jednom konzíliu, ktoré skončia bez záveru a posúvajú pacienta o ďalší cyklus porady (týždeň) [odvodené z Leeds, jedno centrum]. **Pre pitch teda neťahať „ušetríme minúty“, ale „menej porád bez rozhodnutia a úplnejšie podklady“.**

### 3.5 Širší kontext
- Nedostatok ľudí: v Anglicku chýba 30 % rádiológov a 15 % klinických onkológov (RCR census 2023) [S, 07]. ČR má „formálne dosť“ onkológov, ale veľké regionálne rozdiely [S, 07].
- Slovensko: mentor Asseca (Piljan) pracuje na projekte „Onkologická cesta pacienta“ pre NCZI [pptx slide 10]. Verejne známy projekt NCZI „OnkoAsist“ cieli skrátiť cestu z > 160 na 60 dní, hodnota cca 11 mil. € (TASR 2023); že ide o ten istý projekt a že ho realizuje Asseco, nie je potvrdené [S, 08, ?]. Keynote Asseca ho ale uvádza ako vlastnú referenciu [Drive, 06].

---

## 4. Existujúce riešenia na trhu

| Riešenie | Čo robí | Kto platí / cena | Čo nám z toho plynie |
|---|---|---|---|
| **Microsoft Healthcare Agent Orchestrator** (open-source ukážka, máj 2025) | v Teams koordinuje „expertných agentov“: história pacienta, stav pacienta (štádium, biomarkery, výkonnostný stav), rádiológia (len RTG hrudníka), klinické guidelines, klinické štúdie, výskum; vytvorí Word dokument pre tumor board | zdarma ako vzor kódu; README výslovne: „iba pre výskum a vývoj“, nie na klinické nasadenie a nie na diagnostiku/liečbu | [V GitHub README: https://github.com/Azure-Samples/healthcare-agent-orchestrator]. Pilotujú Stanford, Johns Hopkins, Mass General Brigham, Washington, **bez publikovaných výsledkov 2026** [S, 07] |
| **OncoLens** (USA) | príjem prípadov na tumor board, evidencia CME (vzdelávacích bodov), hlásenia pre akreditáciu | cena **neverejná [?]**; tvrdí „65 % zlepšenie prípravy prípadov“, „> 10 % amerických onkologických centier“ | [V web https://www.oncolens.com/], **ide o marketingové tvrdenia, nie nezávislé merania** |
| **Roche navify Tumor Board** | komerčný produkt na prípravu a vedenie tumor boardov (zlúči dáta do jedného pohľadu) | cena neverejná | [?] stránku sa mi nepodarilo otvoriť (404 / 403), vedomosť pochádza z mojej pamäte, neoverené |
| **Všeobecní AI zapisovatelia** (Abridge, Ambience, Nabla, Microsoft DAX, Heidi, Epic natívny AI charting) | zapisujú rozhovor lekár–pacient, nie prípravu konzília | Nabla v RCT skrátila čas písania o **9,5 %** (~41 s na záznam), DAX len −1,7 % (nevýznamné) | [S, 07: NEJM AI 2025]; **úspora je skôr malá, hlavný prínos je úľava** |
| **ČR/SK produkty pre MDT** | **nenašiel som samostatný produkt pre prípravu podkladov a zápis z konzília** [?]. Asseco MedWorks je všeobecný nemocničný IS (onkologický modul som nenašiel); koordinačné aplikácie sa len pilotujú v niektorých KOC | – | [S, 08] |
| **Štátna infraštruktúra** | eŽádanka (pilot od 2. 1. 2026, typ „konziliárna“ vznikla pre onkológiu), indiko.cz meria podiel MDT | – | [S, 08]. Rada expertov z pre-hack dňa: **nestavať vlastnú eŽádanku ani vlastný register**, použiť FHIR a nechať dáta u pôvodcu [02] |

### Kto za to už platí a čo robia zle
- **Platia** nemocnice a onkologické centrá (USA: OncoLens, navify). V ČR platí poisťovňa **za samotný výkon konzília** a pri inovatívnych liekoch ho vyžaduje [V OECD]. Za nástroj na prípravu konzília v ČR dnes **nenašiel som nikoho, kto by platil** [?] (VZP vo svojej inovačnej výzve preferuje „digitálnu medicínu“, organizačné nástroje môžu prísť až neskôr [S, 08]).
- **Čo robia zle / kde je priestor:** (a) väčšina riešení sú **uzavreté americké produkty** bez českého kontextu (MKN-10, eZdraví, eŽádanka); (b) Microsoft vzor je výslovne „nie pre klinickú prax“ a nepracuje s PROMs; (c) **dotazník pacienta ako rovnocenný zdroj** vedľa lekárskych správ je v zadaní Asseca explicitne kľúčový, kým pri známych riešeniach som ho ako hlavnú funkciu nenašiel [?]; (d) **dôkaz pôvodu** (klik na presné miesto v správe) je v zadaní tvrdá požiadavka, v marketingu produktov nie je jasné, ako je riešená [?]; (e) cena a nasadenie: hotové produkty sú ťažké projekty, my ukážeme **ľahkú vrstvu nad FHIR**, ktorú vie Asseco zapojiť do vlastného IS.

---

## 5. Najlepší návrh riešenia pre nás

### 5.1 Pracovný názov a jedna veta
**„Konzílium za 30 sekúnd“** (pracovný názov): jedna obrazovka na pacienta, ktorá z desiatok strán správ a dotazníka ukáže, **o čom je prípad, čo je v poriadku, čo je podozrivé a čo chýba**, a **každé tvrdenie je klikateľné na zdroj**. Na konci jeden klik zapíše rozhodnutie komisie.

### 5.2 Princíp, ktorý robí rozdiel („AI, ktorá nemôže klamať“)
Jadro, ktoré zodpovedá 20 % „spoľahlivosť AI“ a 15 % „zodpovedná AI“, aj pitchu:
1. **Každý fakt z AI musí prísť s doslovným citátom zo zdroja.** Program (nie AI) overí, že citát v zdrojovom texte naozaj je. Ak nie je, tvrdenie sa nezobrazí alebo sa označí „nepotvrdené“. Toto je „citačná poistka“ a je to dobre ukázateľné.
2. **Čo v dokumentoch nie je, appka povie nahlas:** „V dostupnej dokumentácii sa nenachádza“ (napr. HER2 nevyšetrené), namiesto odhadu.
3. **Red flagy sú z veľkej časti pravidlá, nie nálada modelu** (ECOG lekár vs. pacient rozdiel ≥ 2, pokles hemoglobínu + únava v dotazníku, staging starší ako 6 týždňov, chýbajúci povinný biomarker, rôzne TNM v dvoch správach). Pravidlá sú v konfiguračnom súbore, takže ich predseda môže meniť (bonus „pravidlá red flagov“ + konfigurovateľnosť).
4. **AI obsah vs. potvrdené:** AI text má fialový rámik a štítok „Návrh AI“, po kliknutí lekára „Potvrdiť“ sa zmení na zelený „Potvrdil MUDr. …“ (vzor hodnotenia „human-in-the-loop“).

### 5.3 Čo appka obsahuje (zoradené podľa váhy v bodovaní)

**Priorita A – povinné, urobiť perfektne (pokrýva 100 % váh):**
1. **Výber pacienta (3–5 kariet)**, jeden klik otvorí podklad.
2. **Súhrn na 30 s:** diagnóza, otázka pre MDT (nikdy domyslená; ak chýba, červený štítok „neúplné“), **ECOG lekár vs. pacient** vedľa seba, **časová os** ochorenia, 3 najdôležitejšie red flagy.
3. **Pohľady odborností (4 roly):** chirurg, klinický onkológ, rádiológ, **pacientsky rozmer (PROMs a trend)**. Patológ ako 5. rola, ak zostane čas.
4. **Klikateľný zdroj:** panel vpravo ukáže pôvodnú správu so zvýraznenou vetou, dátumom a autorom.
5. **Decision Support Panel:** možnosti liečby z dodaných guidelines **s číslom pasáže**, **screening 3–5 štúdií** (vhodný / nevhodný / chýba údaj + dôvod pri každom kritériu), 2–3 otázky do diskusie.
6. **Zápis záveru:** štruktúrovaný formulár (prítomní, zvažované možnosti, zvolený postup, zdôvodnenie, súlad s guidelines + dôvod odchýlky, odlišné stanoviská, termín re-evaluácie). Pri odchýlke od guidelines appka **upozorní a vyžiada krátke zdôvodnenie**, nezablokuje.
7. **Export:** PDF (tlačiteľný záznam) a **FHIR R4 Bundle (JSON)**.
8. **Konfigurácia:** zapnúť/vypnúť sekcie, zmeniť poradie, vybrať prítomné odbornosti, prepínač „odrážky / text“. (20 % bodov!)
9. **Stránka „Architektúra a spoľahlivosť“** (1 slajd v appke): model, RAG nad dodanými guidelines, citačná poistka, ochrana údajov (syntetické dáta, nasadenie v EÚ), ako by to išlo do MDR/AI Act.

**Priorita B – lacné bonusy s vysokým efektom:**
- **Case readiness semafor** (zelená / oranžová / červená podľa zoznamu povinných údajov) = „vrátiť na doplnenie“ ešte pred poradou (priamo rieši Leeds 13 %).
- **Hodnotiaca tabuľka (evaluácia):** „Z 12 zámerne vložených nezrovnalostí appka zachytila X, vymyslela 0 nepodložených tvrdení, 100 % citácií overených“. Počíta sa proti ground truth od organizátorov (ak ju dostaneme) alebo proti našej vlastnej sade.
- **Audit stopa:** model, verzia promptu, kto potvrdil, kedy. **Uzamknutie a verzovanie** po schválení.
- **Zhrnutie pre pacienta a pre praktika** (po schválení lekárom), v zrozumiteľnej češtine.
- **Q&A nad prípadom** (jedno textové pole: „Kedy bola posledná dávka oxaliplatiny?“, odpoveď len z dát + citácia).

**Priorita C – iba ak zostane čas:** AI zapisovateľ z mock prepisu diskusie, RECIST predvýpočet, podobné prípady, zápis do **InterSystems IRIS FHIR servera** (Provenance: „navrhla AI, potvrdil človek“) pre bonusovú cenu InterSystems.

### 5.4 Jednoduchosť pre lekára (pravidlá UX)
- **Žiadne prihlasovanie, žiadne zadávanie dát.** Lekár len číta, klikne na zdroj a potvrdí.
- Jedna obrazovka, veľké písmo, 3 farby (červená = pozor, žltá = chýba, zelená = potvrdené). Nastavenie je skryté v jednom ozubenom koliesku.
- Čeština, žiadny žargón z IT. Predvolená konfigurácia je rozumná, takže bez klikania to funguje.

### 5.5 Technicky (pre Claude Code, jednoducho)
- **Webová appka** (React/Vite alebo jednoduchý Python backend), beží na notebooku aj verejne.
- **Spracovanie dát vopred, nie živé počas dema:** pre každého pacienta sa raz vygenerujú „kartičky faktov“ (hodnota, dátum, zdrojový dokument, doslovný citát), uložia sa do súboru. Demo je tak rýchle a nezávisí od zdieľaného API (rate limity = HTTP 429, treba retry s exponenciálnym čakaním [03]).
- **LLM cez dodané Azure API** (OpenAI-kompatibilné; deployment s označením EÚ). Extrakcia: silnejší model so štruktúrovaným výstupom (JSON schéma); kontrola druhým modelom [03: „kontrolovať výstup jedného modelu iným“].
- **RAG:** guidelines sú malý výťah s číslovanými pasážami, preto ich stačí rozdeliť na kúsky a vybrať relevantné cez jednoduché vyhľadávanie (pre bonus InterSystems vector search v IRIS).
- **Export FHIR:** Condition, Observation, QuestionnaireResponse, CarePlan + Task, Provenance v jednom Bundle.
- **Dáta:** ak nepríde dataset od Hoferka včas, **vygenerujeme vlastných 3 syntetických pacientov** (Claude vie napísať realistické správy s vloženými chybami a vlastnou ground truth). Parsovanie napíšeme tak, aby zniesol FHIR Bundle aj holý JSON; keď prídu originálne dáta, prispôsobí sa.
- **Poistky:** vopred nahraté demo (video záloha), „studený štart“ bez internetu s uloženými výsledkami, pevný tester na ground truth.

### 5.6 Čo ukážeme v 3-minútovom pitchi (a čo v 5-minútovom dème zadávateľovi)

| Čas | Obsah | Kritérium |
|---|---|---|
| 0:00–0:20 | **Hák:** „217 sekúnd na pacienta. V 65 % prípadov neúplné podklady. V 13 % porada skončí bez záveru, lebo niečo chýba.“ (Leeds, pankreas) a „V ČR poisťovňa nezaplatí ani jeden inovatívny onkologický liek bez konzília.“ | využiteľnosť |
| 0:20–0:45 | **Kto to používa a kto to nasadí:** predseda a koordinátorka konzília, Asseco ako dodávateľ IS | využiteľnosť |
| 0:45–1:45 | **Video (60–75 s, skutočná obrazovka):** otvoriť pacienta → súhrn 30 s → red flag „ECOG lekár 1, pacient 3 + pokles Hb + extrémna únava“ → klik na dva zdroje → „HER2: v dokumentácii sa nenachádza“ (AI nehádala) → možnosti liečby s číslom pasáže guidelines → zápis → export PDF + FHIR | AI + inovatívnosť |
| 1:45–2:15 | **Ako to funguje a prečo tomu veriť:** citačná poistka, RAG, človek potvrdzuje, tabuľka „X zo Y vložených chýb zachytených, 0 vymyslených tvrdení“, syntetické dáta, EÚ | AI technológia |
| 2:15–2:40 | **Pilot na jednom riadku:** 1 KOC, 1 typ nádoru, 8 týždňov, merať podiel úplných podkladov, podiel porád bez záveru, minúty prípravy; partner Asseco | škálovateľnosť |
| 2:40–3:00 | Tím (Maťo: rádiológia a zobrazovanie, Bruno: príbeh a produkt) a jedna konkrétna žiadosť (mentoring Asseco, klinický partner) | tím |

- **Titulný obrázok 16:9:** vľavo „20 strán v 5 systémoch“, vpravo „1 obrazovka, každé tvrdenie so zdrojom“.
- **Čestné vyhlásenie, ktoré porota ocení:** „Nestanovuje diagnózu ani liečbu, rozhoduje komisia. Pre produkciu by to bol zdravotnícky prostriedok (MDR) a vysokorizikový systém (AI Act). Ukazujeme prototyp na syntetických dátach.“
- Pri sobotnej obchôdzke zadávateľ dostane **presne ten 5-minútový scenár z §1.6**, v rovnakom poradí ako je v jeho zadaní (hodnotiteľ si ho odškrtáva).

### 5.7 Čo robia Bruno a Maťo (nie Claude Code)
1. **Hneď získať dáta od Ondřeja Hoferka** (osobne alebo správou). Opýtať sa na formát a či ich už má iný tím.
2. **Maťo:** skontrolovať obsahovú vierohodnosť rádiologickej sekcie (CT/MR/PET, porovnanie v čase), pomenovať, čo rádiológ naozaj hľadá; **nehovoriť v mene ÚRO**.
3. **Bruno:** pitch, 60–75 s video (screen recording + hlas), titulný obrázok, texty do formulára (140 znakov, dopad a AI).
4. Opýtať sa Bušeka/Piljana na 1–2 veci, ktoré sa dajú overiť (napr. „Čo musí byť na jednej strane záznamu, aby ho lekár podpísal?“).

---

## 6. „Šialený“ ambiciózny variant

**„Konzílium, ktoré sa píše samo“** – appka sedí na porade a pokrýva všetky tri fázy naraz:
1. **Predporada (AI pred-konzílium):** štyria „AI odborníci“ (chirurg, onkológ, rádiológ, patológ) si prejdú prípad a položia pred poradou 2–3 otázky (podobný princíp ako orchestrátor Microsoftu [V]), ale **každá otázka má citáciu a nič sa nerozhoduje bez človeka**.
2. **Agenda optimalizátor:** zo 40 pacientov vyberie, ktorí potrebujú plnú diskusiu a ktoré prípady sú štandardné s kompletnými podkladmi (rýchlo ~1 min), a ktoré treba **vrátiť na doplnenie ešte pred poradou**. Cieľ: priamo zasiahnuť Leeds zistenia (13 % bez záveru, 43 % bez diskusie) a názor 76 % lekárov, že sa preberajú zbytočné prípady [V].
3. **Živý zapisovateľ:** počúva diskusiu (v prehliadači cez rozpoznávanie reči v češtine, alebo z mock prepisu od organizátora), v reálnom čase navrhuje znenie záveru a akčné kroky, **hneď hlási odchýlku od guidelines**, predseda jedným klikom schváli.
4. **Po porade:** automaticky pripraví **list pre praktika a zrozumiteľné zhrnutie pre pacienta** (po schválení), úlohy s majiteľom a termínom a **zápis do FHIR servera InterSystems IRIS** s dôkazom pôvodu („navrhla AI, potvrdil človek“) → získa aj bonusovú cenu InterSystems.
5. **Hlasová otázka v miestnosti:** „Kedy bola posledná dávka oxaliplatiny a s akou toxicitou?“ Odpoveď len z dát pacienta, s citáciou.
6. **Maťova stopa (jedinečné):** v rádiologickej časti **orientačný prehľad kumulatívnej dávky ionizujúceho žiarenia z doterajších CT/PET** s upozornením pri opakovanom zobrazovaní. Opora: malá štúdia 54 pacientov s melanómom na imunoterapii (medián 8 CT, 64 % prekročilo 100 mSv) a register 5,6 mil. CT, kde opakované zobrazovanie je hlavný dôvod vysokých dávok [S, 07, Z41, abstrakty]. **Riziko:** mock dáta pravdepodobne neobsahujú dávky, museli by sa odhadnúť z typu vyšetrenia, čo treba jasne označiť ako orientačné.

**Cena šialeného variantu:** vysoké riziko, že po ceste zlyhá jadro. Odporúčanie: najprv 100 % priorita A, potom po jednom bonusoch podľa poradia v §5.3. Najlepší pomer efekt/riziko majú **agenda optimalizátor** a **case readiness**, najväčší „wow“ **živý zapisovateľ** (ale demo na mock prepise, nie na živom zvuku).

---

## 7. Konkurencia na tejto výzve a či ju môže zvoliť pražský tím

### 7.1 Môže pražský tím zvoliť?
**Áno.** MDT Copilot (Asseco) je jednou z **12 výziev dostupných v Prahe** (9 pražských + 3 spoločné VZP) vo formulári výberu [Slack/web, 05 §2.6]. Ostravská „AI asistent multidisciplinárního týmu“ (FN Ostrava) je iná výzva a pre pražský tím vo formulári nie je.

### 7.2 Stav na tabuli (live `submit.rakathon.cz/vyzvy`, načítané počas tejto analýzy, cca 16:40) [V]
- **MDT Copilot (Praha): 1 tím – Korex.** (Celkovo: Praha 23 tímov má výzvu, **5 ešte nevybralo** – Ctrl+Alt+CURE, FIT/S, FSMZ, Pražský Meridian, walking legs.)
- Podľa organizátorskej listiny **sedem pražských tímov ešte nie je na tabuli** vôbec (Data Team, Junior Scholars, Nexlytics, Panacea, quattro formaggi, radiQA, Risk off) [05, Slack 12:52]. Ich výber pred 19:00 ešte môže čísla zmeniť, väčšinou nahor.

### 7.3 Signály záujmu (iba názvy tímov, nie mená)
- V `#mdt-copilot` sa dnes pripojili aj členovia tímov **Hyeny**, **walking legs**, **Canbe** (to je SMART ONCO AA), **VI KA** (to je Hlídač NÚ) a dvaja jednotlivci „hľadám tím“ [V]. **Pripojenie do kanála nie je záväzok.**
- **Hyeny:** sólo hacker v `#06-hledam-tym` o 14:00 hľadal spoluhráča práve na MDT Copilot, píše o skúsenostiach z viacerých víťazných hackathonov, a poznačil „tím nájdený“; **ich tím zatiaľ nie je na tabuli** [V]. **Najpravdepodobnejší silný konkurent v Prahe.**
- **Korex** je jediný zapísaný tím; o ich zložení a zrelosti nič neviem [?].
- Mimo Prahy: **Super Team MEMOyA** (Ostrava) už pred hackathonom postavil základ „AI prečíta celý spis, nájde chýbajúce a rozporné údaje, každé číslo s doslovnou citáciou“, má FHIR/IRIS zápis (2 190 FHIR záznamov) a 6 správnych zistení bez falošných u testovacieho pacienta; mieri na ostravskú MDT výzvu, Beatu (sprievodkyňa pre pacientov) a cenu InterSystems [V, jeho vlastná verejná stránka https://claude.ai/artifact/5sG1qwcd3tPvkogSQX3dQT]. Ostravské MDT výzvu zatiaľ majú 2 tímy (Codebridge, zombie_apocalypse) [V]. **Dôležité:** MEMOyA nie je naša priama konkurencia o pražského víťaza MDT Copilot, ale **ak vyhrá svoju výzvu, stretneme sa s ním v nedeľnom finále v tej istej téme** a jeho „hotový základ“ je výhoda (organizátor ale hodnotí len to, čo vzniklo počas hackathonu, nezdeklarovaný predchádzajúci kód je riziko [03/09]).

### 7.4 Môj odhad [odhad, nie fakt]
- Do 19:00 pribudnú na Praha MDT Copilot **ďalšie 1–3 tímy** (Hyeny + niektorý z 12 nezaradených). Teda **2–4 tímy spolu**, čo je nižšie ako Trial Matching (4) a mamograf (3), ale vyššie ako Kvalita péče (0) a Twincer (0).
- Pravidlo „víťaz každej výzvy ide do nedeľného finále“ platí [05]; pri 2–4 tímoch je reálna šanca na víťazstvo výzvy pre dobre pripravený tím zhruba **1 z 3** [odhad].
- Výhoda tejto výzvy: **predvídateľné hodnotenie** (váhy sú zverejnené). Nevýhoda: práve to láka technicky silné tímy.

---

## 8. Skóre 1–10 (prísne, 5 = priemer medzi výzvami, 9–10 iba výnimočne)

| Kritérium | Váha | Skóre | Zdôvodnenie |
|---|---|---|---|
| Veľkosť problému | 1 | **7** | Týka sa každého pacienta, ktorý ide na konzílium: v ČR > 61 000 nových prípadov ročne a takmer 60 % pacientov v KOC sa preberá na MDT, cieľ 80 % [V]. Ale nie všetkých pacientov (len v centrách) a nie je to najväčšia jednotlivá diagnóza. |
| Dopad na zdravie | 1,5 | **5** | Nepriamy: úplnejšie podklady, menej porád bez záveru, väčšia pozornosť na rizikové signály. Oneskorenie liečby škodí (Hanna) [S], ale konzílium je len malá časť cesty a **dôkazy o lepších výsledkoch pacientov pri AI na tumor boarde chýbajú** [S, 07]. |
| Úspora času | 1 | **6** | Reálne: prípravu podkladov, diktovanie (47 % času), opakované porady. Ale **meraná úspora je skromná** (6:55 vs 8:47 min v simulácii, ~56 h/rok na jedno konzílium podľa mojej kalkulácie) [S]; väčší efekt je v kvalite a úplnosti. |
| Úspora peňazí / zisk | 1,2 | **5** | Priamy zisk nemocnice nie je jasný (konzílium sa platí samostatne, nástroj tržby nezvýši). Nepriamo: menej opakovaných porád a istota, že záznam splní podmienku úhrady inovatívnych liekov [V]. Pre Asseco ide o produktovú príležitosť. |
| Akútnosť bottlenecku | 1,5 | **6** | Dopyt je viditeľný: Asseco aj FN Ostrava zadali tú istú úlohu, MZ tlačí na zvyšovanie podielu MDT a zverejňuje indikátory, koordinátori od 1/2026, Microsoft vydal vzor [S]. Ale nie je to „horí nám strecha“ ako čakanie na liečbu. |
| Ochota platiť | 1,2 | **6** | Kupec je jasný (KOC/nemocnica a cez dodávateľa IS, napr. Asseco) a trh existuje v USA (OncoLens, navify) [V/?]. V ČR **nenašiel som dnes platený nástroj ani vyhradený rozpočet** a VZP inovačný portál zvýhodňuje digitálnu medicínu [S, 08]. |
| Jednoduchosť pre užívateľa | 1 | **6** | Samotná myšlienka („jedna obrazovka, klik na zdroj“) je jednoduchá. Zadanie ale vyžaduje konfigurovateľnosť a veľa funkcií, čo ľahko vytvorí zložité rozhranie; treba disciplínu (predvolené nastavenie, žiadne zadávanie). |
| Dostupnosť a kvalita dát | 1 | **5** | Zadanie sľubuje bohatý balík (3–5 pacientov so zámernými chybami + ground truth), čo je ideálne na meranie. **Ale dnes ho v Slacku nie je** a závisí od mentora; formát neznámy. Vieme si pomôcť vlastnými syntetickými dátami. |
| Realizovateľnosť dema za noc | 1 | **8** | Všetko sú úlohy, ktoré LLM zvláda (extrakcia s citátmi, súhrn, pravidlá, RAG nad malým textom, formulár, export). Demo je jeden pacient. Riziko je rozsah (veľa povinných kúskov) a leštenie UX, nie technická nemožnosť. |
| Wow a príbeh | 1,2 | **7** | Silné čísla (217 s, 65 %, 13 %), jasné „pred/po“ a efektné momenty (klik na zdroj, „AI nehádala“, zachytený vložený chybný údaj). Slabší: dashboardy pre lekárov vyzerajú podobne, odlíšenie musí prísť z dôkazov (tabuľka X/Y zachytených) a rozprávania. |
| Strategická hodnota partnera | 1,2 | **6** | Asseco je dodávateľ IS pre štát/poisťovne/poskytovateľov, Bušek v hlavnej porote a HL7 ČR, Hoferek (InterSystems) ako mentor, možnosť InterSystems ceny [Drive, 05, 09]. Cena je mentoring, nie peniaze ani VZP „kreslo“. |
| Šanca vyhrať a ísť do finále | 1 | **6** | Dnes 1 tím, očakávam 2–4; víťaz výzvy ide do finále. Riziká: Hyeny a technicky silné tímy, ktoré láka explicitné bodovanie; v nedeľu možný MEMOyA v tej istej téme. |
| Šanca na pokračovanie | 0,8 | **7** | Cena Asseco je presne pokračovanie (mentoring, kontakty); zadávateľ je dodávateľ, ktorý vie nástroj zapojiť do IS; slovenský projekt OnkoAsist ukazuje, že tému rozvíja [S]. Brzdí regulácia (MDR, AI Act) a absencia platiteľa. |
| Fit s naším tímom | 0,8 | **6** | Maťo (radiačná ochrana, zobrazovanie) vie posúdiť rádiologickú sekciu a prípadne dávkový pohľad; Bruno je silný na video, príbeh a pitch. **Chýba klinický onkológ** a MDT je silne klinická téma. |
| Nízke regulačné/klinické riziko | 0,6 | **4** | V produkcii softvér, ktorý podporuje rozhodnutia o liečbe, je zdravotnícky prostriedok (MDR) a vysokorizikový systém podľa AI Act; zadanie samo to priznáva [pptx notes slide 9]. Mierni to: prototyp, syntetické dáta, človek rozhoduje, AI nikdy nevyberá liečbu. Presnú triedu MDR som v tejto relácii neoveril [?]. |

**Vážený priemer: 6,0 / 10** (súčet vážených bodov 96,1 pri súčte váh 16,0).

---

## 9. Hlavné riziká a odporúčané kroky

### Riziká
1. **Dáta zatiaľ nemáme a formát je neznámy.** → Spýtať sa Hoferka ešte pred 19:00; pripraviť vlastné syntetické dáta ako zálohu.
2. **Rozsah zadania.** Povinné minimum je veľké (A + B + B2 + C + konfigurácia). → Jeden pacient z začiatku do konca, potom ďalší pacienti; bonusy až po jadre.
3. **Halucinácie a falošné červené vlajky** (MEMOyA priznáva 1 falošný nález „chýba“ pri novom pacientovi [V]). → Citačná poistka, pravidlá namiesto čistého LLM, evaluačná tabuľka.
4. **Rate limity zdieľaného Azure API** (HTTP 429) [03]. → Predspracovať a uložiť; retry s čakaním.
5. **Silný konkurent** (Hyeny; v nedeľu MEMOyA). → Dokonalé splnenie zverejnenej rubriky + odlišnosť v dôkaze (X zo Y) a v príbehu.
6. **Slabý dôkaz o prínose AI pre konzílium** (len simulácie) [S, 07]. → V pitchi nesľubovať záchranu životov; sľubovať **meratelný pilot** (úplnosť podkladov, porady bez záveru).
7. **Regulácia a dáta:** syntetické dáta, nič skutočné; prototyp nie je zdravotnícky prostriedok (pravidlá Rakathonu) [05].
8. **Klinická vierohodnosť bez onkológa v tíme.** → Využiť onkológov zapojených do hackathonu a Piljana/Bušeka na pripomienkovanie výstupu [pptx notes].
9. **Možné zdvojenie so SMART ONCO AA a Cesta pacienta:** téma je blízka, ale každý tím môže riešiť len jednu výzvu.

### Čo overiť pred 19:00 (ľudsky, nie cez automat)
- Dataset od Ondřeja Hoferka (formát, termín, či ho má už iný tím).
- Či smie tím použiť vlastné guidelines, ak dodaný výťah nestačí.
- Či je nedeľný pitch pre túto výzvu naozaj 5 minút.

---

## 10. Zdroje

**Interné súbory (repo):**
- `docs/materials/slack/mdt-copilot/Rakathon_tema_CZ_ACE.docx` – zadanie vrátane BONUS a váh [doc]
- `docs/materials/slack/mdt-copilot/MDT_Copilot_zadani_upravene_2026_v02.pptx` – prezentácia a poznámky rečníka [pptx]
- `docs/research/04-slack-vyzvy-a-pravidla.md`, `05-slack-refresh.md`, `06-prezentacie-drive.md`, `07-trendy-a-bottlenecky.md`, `08-cesky-kontext-a-trh.md`, `09-partneri-a-vitazne-vzorce.md`, `02-prehack-prednasky.md`
- Slack `#mdt-copilot` (C0C8V7CA49W), `#06-hledam-tym`, `#03-info-praha`; živá tabuľa https://submit.rakathon.cz/vyzvy

**Otvorené a overené v tejto relácii [V]:**
- Leeds pancreatic MDT (A. Young, 2020): https://www.pancreaticcancer.org.uk/wp-content/uploads/2020/10/Improving-MDT-function-Alastair-Young.pdf
- UK urologické MDT, prieskum a multicentrické dáta: https://pmc.ncbi.nlm.nih.gov/articles/PMC10705031/
- UK urologické MDT, prehľad (čas 3–4 min, náklady > 150 mil. £): https://pmc.ncbi.nlm.nih.gov/articles/PMC7705157
- OECD/EK Country Cancer Profile Czechia 2025: https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-cs-2025-1663-v2-en.pdf
- Microsoft Healthcare Agent Orchestrator: https://github.com/Azure-Samples/healthcare-agent-orchestrator
- OncoLens: https://www.oncolens.com/
- MEMOyA (verejná stránka tímu z Ostravy): https://claude.ai/artifact/5sG1qwcd3tPvkogSQX3dQT

**Nepodarilo sa otvoriť (čísla preberám z 06/07 ako [S] alebo označené [?]):**
- Hanna et al., BMJ 2020: https://www.bmj.com/content/371/bmj.m4087
- JCO Clin Cancer Inform 2026: https://doi.org/10.1200/cci-25-00244
- Annals of Oncology 2026: https://doi.org/10.1016/j.annonc.2026.05.709
- Roche navify Tumor Board, Fierce Healthcare (Microsoft orchestrator), EUR-Lex MDR/AI Act (klasifikácia, termíny)
