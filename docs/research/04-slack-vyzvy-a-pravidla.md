# 04 – Slack Rakathon 2026: výzvy, pravidlá, program, materiály

**Zdroj:** Slack workspace `rakathon2026` (čítané cez Brunov Slack konektor, iba čítanie, nič sa neposielalo).
**Stav k:** piatok 16. 10. 2026 cca 13:00 SELČ (hackovanie štartuje 14:00). Kanály výziev sa ešte plnia – materiály pribúdajú.
**Prečítané:** všetky info kanály (#01–#09), všetkých 23 kanálov výziev + #best-use-of-intersystems-technology-for-ai-and-fhir, dôležité vlákna v #02-dotazy, canvas „Podklady" (Vzkazy pro budoucnost). #06-hledam-tym len zbežne.
**Stiahnuté súbory:** pozri `docs/materials/slack/INDEX.md`.

Legenda: **[Slack]** = priamo zo Slacku, **[doc]** = zo stiahnutého podkladu, **[?]** = neisté / nezaznelo.

---

## 0. TL;DR – čo je dôležité hneď

- **Do dnes 19:00 (pi 16. 10.)** musí kapitán vyplniť výber výzvy: `submit.rakathon.cz/vyzvy/vybrat` (alebo najprv založiť tím na `submit.rakathon.cz/tym`). Tím = **2–4 ľudia** vrátane kapitána. Formulár neposielať dvakrát; zmena výzvy cez odkaz z e-mailu do 19:00. Kto má akú výzvu (živo): `submit.rakathon.cz/vyzvy` (filter `?city=brno` atď.). Výzvy bez tímu svietia načerveno – organizátori chcú pokryť všetky. **[Slack, #01-oznameni, #04-info-brno]**
- **Jeden tím = jedna výzva** (nedá sa riešiť viac naraz). **[Slack, P. Vaňásek v #02-dotazy]** – InterSystems cena je ale „nad" výzvami (dá sa kombinovať s akoukoľvek výzvou).
- **Postup do finále:** do nedeľného finále v Prahe postupuje **najlepší tím z každej výzvy**, a to aj pri spoločných VZP výzvach **z každého mesta**. **[Slack, T. Studeník]**
- **Finále: nedeľa 18. 10. v Prahe.** „Cena hackerov" sa hlasuje až v Prahe a môže ju vyhrať aj tím, ktorý do finále nepostúpil → oplatí sa ísť do Prahy aj bez postupu. **[Slack]**
- **Prístupy Azure + Portál účastníka** (`aka.ms/rakathon2026`) dostáva **kapitán po obede, aktívne od 13:00**; login je iný než registračný (tímový UPN + TAP na kartičke). Tím si má vytvoriť **tímový Slack kanál** a pingnúť Michala Marušana (MSFT) o prístupy. **[Slack, #08-tech-helpdesk, #02-dotazy]**
- **GitHub Copilot ($100 kredit/osoba):** pozvánka do GitHub org `hackathon-green-snail-77` cez `aka.ms/rakathon2026/github` – individuálne, už teraz. **[Slack]**
- **VZP dáta (3 spoločné výzvy) sú len na portáli** (Azure tenant VZP), nie na Slacku; mamograf dataset „cca od 12:00". Dáta VZP sú **len pre VZP výzvy**. **[Slack + MSFT slidy]**
- Oficiálny jazyk čeština, **pitch môže byť po anglicky**. Na mieste sa dá **prespať** vo všetkých 3 mestách. **[Slack]**
- **Termín a formát odovzdania (submission) ani všeobecné hodnotiace kritériá Rakathonu na Slacku zatiaľ NEZAZNELI.** Špecifické kritériá majú zatiaľ len MDT Copilot (váhy), MEDDI Onco a InterSystems. **[?]**

---

## 1. Zoznam všetkých výziev (24 = 23 výziev + InterSystems cena)

Zdroj mapy kanálov: uvítacia správa P. Vaňáska v #01-oznameni (14. 10.). Garanti/mentori: vlákno P. Vaňáska v #02-dotazy (16. 10. 12:38) „Rakathon 2026: výzvy, zadavatelé a mentoři". Detaily z podkladov v kanáloch.

### 1.1 Spoločné pre všetky mestá (VZP ČR)

Dáta ku všetkým trom VZP výzvam: **anonymizovaný dataset na Portáli účastníka** (`aka.ms/rakathon2026`, sťahovať tímovým účtom cez Azure Portal). Technický mentor za VZP (cloud/dáta): **Jan Bartyzal** (Praha). Predstavenie VZP výziev: pi 10:45 (stream z Prahy).

#### 1) Kvalita péče na konci života – `#kvalita-pece-na-konci-zivota`
- **Zadávateľ:** VZP ČR; **garantka:** Hana Študentová (FN Olomouc).
- **Mentori:** Hana Študentová, Kateřina Holá (Brno), Jan Bartyzal (dáta v Azure).
- **Problém / výstup:** v kanáli zatiaľ **žiadne zadanie ani podklady** (len joiny). [?] – pozri portál / prezentáciu VZP.

#### 2) Od pozvánky k mamografu – `#od-pozvanky-k-mamografu`
- **Zadávateľ:** VZP ČR; **garantka:** Helena Damovská. Podklad spracoval Ing. Antonín Hlavinka. [doc]
- **Mentori:** Helena Damovská (Praha), Vendula Frodlová (Brno), Květoslava Smolková (Ostrava), Jan Bartyzal.
- **Problém [doc]:** VZP adresne pozýva ženy na mamografický skríning, ale všetkým posiela rovnakú komunikáciu. 2024: 292 176 pozvánok; účasť pri prvom oslovení 44,5 %, celková účasť po adresnom pozvaní 18,9 %, pri opakovane oslovovaných mnoho rokov len 3,2 %. **Nerieši sa no-show na objednaný termín**, ale či oslovená klientka skríning v definovanom období absolvuje.
- **Hlavná otázka:** Ktoré oslovené klientky majú najvyššie riziko, že skríning neabsolvujú, komu ponúknuť intenzívnejšiu podporu a ako overiť jej efekt.
- **Úlohy (4):** 01 KDO – predikcia rizika neúčasti; 02 PROČ – faktory a segmenty; 03 CO – návrh intervencie pre segmenty; 04 JAK OVĚŘIT – návrh experimentu/A-B testu.
- **Príklady segmentov (hypotézy, nie hotové):** pravidelná preventistka v omeškaní → pripomenutie + objednací krok; nízky kontakt so zdravotníctvom → viackanálové oslovenie; v péči ale bez prevencie → zapojiť praktika/gynekológa; opakovane nereagujúce → iný kanál / telefonická navigácia; regionálna bariéra → navigácia na dostupné pracoviská.
- **Očakávaný výstup:** model/skóre rizika neúčasti, hlavné faktory, zrozumiteľné segmenty, návrh intervencií, návrh experimentu (A/B).
- **Dáta:** dataset VZP **> 1,3 mil. záznamov** + popis dát a dátový slovník (na portáli). Mentorka (Slack 11:14): „Data budou k dispozici cca ve 12h." Testovací/holdout dataset pre porovnanie tímov – otázka padla, **odpoveď organizátora nie je** [?].
- **Súbor:** `docs/materials/slack/od-pozvanky-k-mamografu/Rakathon_VZP_mamograf.pdf`.
- **Konkurencia:** Alex Yudzin + Varvara Shorina („mammo_prg", Praha; Python/CatBoost/FHIR), „Máma, graf" (Brno), TokenPerSecond (Brno, pýtali sa na test set), RationAI, MSFZ… (podľa joinov).

#### 3) Cesta pacienta bez ztráty informací – `#cesta-pacienta-bez-ztraty-informaci`
- **Zadávateľ:** VZP ČR; **garant:** Marian Rybář.
- **Mentori:** Marian Rybář, Tereza Chrástová, Klára Vaňková, Zuzana Bielčiková, Michaela Klimeš Lipánová, Jan Bartyzal.
- **Problém / výstup:** v kanáli **žiadne zadanie ani podklady** [?] – na portáli / v prezentácii VZP.
- **Konkurencia:** Super Team MEMOyA (Ostrava) to uvádza ako nadväzujúcu výzvu; Jan Kondula (Holub, Ostrava) ju mal ako favorita.

### 1.2 Praha (9)

Spoločný základ pre 3 výzvy FN Motol a Homolka (FNMH): **jeden dataset** – anonymizované lekárske správy, textové popisy CT, laboratórne výsledky, vykázané výkony a liečivá, ďalšie dáta z NIS u aktuálne liečených onko pacientov. **Neobsahuje** obrazovú dokumentáciu (snímky) ani prístup do ePACS. [doc `Rakathon_vyzvy_onkologie_FNM.pdf`] **Kde je dataset fyzicky – na Slacku zatiaľ nie** (asi portál alebo príde) [?]. Garantka/mentorka MUDr. **Alina Pirshtuk** (Onkologická klinika FNMH), na Slacku do ~19–20 h a zajtra; ďalšie kontakty Dr. Pavel Škrobánek, Dr. Míša Klimeš Lipánová. Mentor: Tomáš Panský.

#### 4) AI Trial Matching – `#ai-trial-matching`
- **Úloha [doc]:** previesť kritériá zaradenia/vyradenia klinickej štúdie do štruktúrovanej podoby, porovnať s anonymizovanými údajmi pacienta, pri každom výsledku vysvetliť mieru zhody a upozorniť na chýbajúce/nesplnené podmienky.
- **Výstup:** štruktúrované kritériá (strojovo spracovateľné), **skóre zhody** (nie len áno/nie), vysvetlenie (splnené / nesplnené / údaj chýba). „Aby nás systém upozornil, že pacient spĺňa kritériá štúdie skôr, než nás to napadne."
- **Dáta:** spoločný dataset FNMH + **zoznam náborujúcich štúdií FNMH** (`Seznam_studii_FNMH.xlsx`, ~90 riadkov: číslo, rok otvorenia, protokol, zadávateľ, názov, fáza, diagnóza, skúšajúci, koordinátor) + clinicaltrials.gov; inšpirácia: zoznam štúdií MOÚ `mou.cz/klinicke-studie/t1520`.
- **Doplnok mentorky:** bolo by fajn hľadať aj v iných pražských nemocniciach (VFN, FTN…), aby sa pacient dal referovať inam.

#### 5) PACS Comparator Check – `#pacs-comparator-check`
- **Úloha [doc]:** zabezpečiť, aby lekár pred plánovaným CT/MR/PET alebo MDT mal všetky dôležité predchádzajúce vyšetrenia; v PACS automaticky overiť dostupnosť snímok/sérií; chýbajúce včas označiť a pripraviť prehľad prípadov na doriešenie.
- **Obmedzenie:** snímky ani PACS nie sú k dispozícii → **kontrolu dostupnosti treba simulovať**; len spoločný dataset so správami.
- **Flow:** plánované vyšetrenie/MDT → zo správ určiť relevantné zobrazovacie vyšetrenia → overiť v PACS → včas označiť/zabezpečiť. „Zadať pacienta na MDT a neobvolávať pol republiky."

#### 6) Digitální hlídač nežádoucích účinků – `#digitalni-hlidac-nezadoucich-ucinku`
- **Úloha [doc]:** systém, ktorý pacienta pravidelne osloví (krátky dotazník prispôsobený diagnóze a liečbe), poradí s manažmentom symptómov (pri akútnych ťažkostiach odkaz na ambulanciu / 155) a pri prekročení prahov automaticky upozorní ošetrujúci tím. „Chceme byť hneď informovaní o závažných NÚ, nie o každej drobnosti."
- **Evidencia:** Basch et al., JAMA 2017 (pravidelné hlásenie symptómov predlžuje prežitie).
- **Dáta:** spoločný dataset + SPC liekov z databázy SÚKL (`prehledy.sukl.cz`) + **CTCAE v6.0** (gradovanie NÚ; mentorka: v správe písať napr. „nevolnosť G1", „anémia G2").

#### 7) MEDDI ONCO Challenge – `#meddi-onco-challenge`
- **Zadávateľ:** MEDDI Hub (Jiří Pecina); **zadávateľ/mentor na mieste v Prahe:** Patrik Litschmann (zadanie, MEDDI Onco v praxi, MOÚ, hodnotenie); **technický mentor online:** Erik Hulmák.
- **Kontext [doc]:** MEDDI Onco = telemedicínska platforma, v praxi v MOÚ od 2020 (dotazníky, foto, chat, monitorovacie centrum, sestry/lekári).
- **Úloha:** AI vrstva nad check-inom pacienta (dotazník + voľný text + merania + foto): načítať kontext (liečba, cyklus, lieky, labáky, predchádzajúce check-iny), **triáž do 4 úrovní** (zelená/žltá/oranžová/červená) so zdôvodnením, prípadne sa doptať, odpovedať pacientovi zrozumiteľným ďalším krokom, pri úrovni 2–4 upozorniť tím + **súhrn pre lekára**. API MEDDI počas Rakathonu nie je – integráciu navrhnúť nad dátovým modelom.
- **Dáta [doc]:** zip so **14 fiktívnymi pacientmi** (JSON), 171 check-inov (115 zelených, 37 žltých, 13 oranžových, 6 červených), **ground truth** pre každý záznam, definície dotazníkov MEDDI Onco, pravidlá triáže (UKONS, CTCAE v5, PRO-CTCAE; tvrdé pravidlá = minimálna úroveň), vzorové súhrny pre lekára. Prehrávať chronologicky (žiadny pohľad do budúcnosti).
- **Hodnotenie (porota na skrytej sade 6 pacientov):** zachytenie všetkých červených a oranžových (podhodnotenie červenej = najhoršia chyba), počet zbytočných eskalácií, správne nasmerovanie podľa pracovnej doby (monitorovacie centrum po–pi 7:00–15:30, inak služba MOÚ / 155), zrozumiteľnosť pre pacienta a vysvetliteľnosť pre lekára, kvalita súhrnu pre lekára.
- **Povinné pravidlá:** nestanovuje diagnózu, nemení liečbu; pri pochybnosti eskaluje; nepodhodnotí tvrdé pravidlá; pracuje s trendom; správa pacienta má prednosť pred dotazníkom; vysvetliteľnosť; ľudský dohľad pri úrovniach 2–4; pracovná doba; GDPR – produkčne AWS v EU (pre prototyp akýkoľvek LLM, v prezentácii ukázať beh v AWS EU).
- **Súbory:** `docs/materials/slack/meddi-onco-challenge/` (zip + rozbalené `extracted/`). Dáta sú **fiktívne**.

#### 8) NÚVR Research Matchmaker – `#nuvr-research-matchmaker`
- **Zadávateľ:** NÚVR; **garant:** Aleksi Šedo.
- **Zadanie / dáta:** v kanáli **zatiaľ nič** [?]. Záujem: Remiho klubík, dudes, Štěpán Chrast.

#### 9) Plíce včas: chytrá cesta k prevenci – `#plice-vcas-chytra-cesta-k-prevenci`
- (kanál predtým `cesta-ke-screeningu-plic`) **Zadávateľ:** AstraZeneca; **garantka:** Ivana Čierná-Peterová. Mentori v kanáli: Luboš Matys (AstraZeneca), Josef Plasil (AZ), Olena Vasylenko (MSFT).
- **Zadanie / dáta:** v kanáli **zatiaľ nič** [?]. Podľa InterSystems slidu patrí s mamografom do kategórie „vyhodnotiť riziko – modely/pravidlá".

#### 10) SMART ONCO AA: Příprava bez čekání – `#smart-onco-aa-priprava-bez-cekani`
- **Zadávateľ:** VFN; **garant:** Jan Bláha. Zadanie / dáta **v kanáli zatiaľ nie sú** [?]. (InterSystems slide: kategória „overiť a doplniť – SQL/API".)

#### 11) MDT Copilot – `#mdt-copilot`
- **Zadávateľ:** Asseco Central Europe; **garant / porota:** Michal Bušek; mentori: Ľuboslav Piljan (Asseco, projekt Onkologická cesta pacienta pre NCZI SK), Ondřej Hoferek (InterSystems / HL7 ČR).
- **Úloha [doc]:** funkčný prototyp webovej aplikácie, ktorá s AI skonsoliduje dáta pacienta (neštruktúrované nálezy z eZdravia + PROMs dotazník) a vygeneruje **modulárny, konfigurovateľný podklad pre MDT (onkologické konzílium)**, ktorý zároveň slúži ako **oficiálny záznam so zapísaným verdiktom**. Pokryť 3 fázy MDT (pred / počas / po).
- **Povinné minimum:** A) Executive summary (orientácia do 30 s; ECOG lekár vs. pacient – rozdiel = red flag; otázka pre MDT – AI ju nesmie domýšľať; časová os). B) sekcie podľa rolí – **min. 3 roly** (chirurg, klinický onkológ, rádiológ, patológ, pacientsky rozmer/PROMs). B2) **Decision Support Panel** – možnosti liečby z dodaných guidelines s citáciou (RAG nad dodanými dokumentmi), predbežný skríning klinických štúdií (vhodný / nevhodný / chýba údaj), 2–3 otázky do diskusie, kontrola súladu záveru s guidelines. C) zápis rozhodnutia (štruktúrovaný), akčný plán, export (PDF / HL7 FHIR). Konfigurovateľnosť sekcií/poradia/rolí/detailu. Red flags so závažnosťou a citáciou oboch zdrojov. Dohľadateľnosť – klik na zdroj; „v dostupnej dokumentácii sa nenachádza" namiesto odhadu. Human-in-the-loop, AI obsah vizuálne odlíšený.
- **BONUS:** case readiness semafor, RECIST 1.1 predvýpočet, návrh chýbajúcich biomarkerov, ďalšie roly (nukleárna medicína, paliatívna péče…), podobné prípady, FHIR R4/mCODE export (Condition, Observation, QuestionnaireResponse, CarePlan+Task, Provenance), AI zapisovateľ (ambient scribe), akčný plán s úlohami, súhrn pre pacienta a praktika, uzamknutie a verzovanie, šablóny podľa typu nádoru, NLP extrakcia, Q&A nad prípadom, audit trail, pseudonymizácia/AI Act/MDR, evaluácia (napr. 20 faktov + vložené nezrovnalosti).
- **Dáta (deklarované v zadaní):** mock eZdravie (JSON/FHIR) – prepúšťacie správy, labáky (onkomarkery v čase), popisy CT/MRI, lieky; PROMs JSON (EORTC QLQ-C30, PRO-CTCAE, Distress Thermometer; ≥2 vyplnenia); nominácia na MDT; výťah z guidelines + 3–5 fiktívnych štúdií; 3–5 pacientov s vloženými chybami + ground truth; bonus mock prepis diskusie. **Samotné dáta na Slacku zatiaľ nie sú** [?].
- **Hodnotenie (váhy):** Klinická hodnota & UX pre MDT **30 %**; Konfigurovateľnosť **20 %**; Technické riešenie AI & spoľahlivosť **20 %**; Dátová integrácia a štandardy **15 %**; Podpora MDT procesu & zodpovedná AI **15 %**; Bonusy **až +10 %** (kvalita, nie počet).
- **Demo (max 5 min, 1 pacient):** vygenerovať podklad podľa konfigurácie → orientácia v súhrne do 30 s → overiť 1 tvrdenie AI a 1 red flag klikom na zdroj → Decision Support Panel → zápis a potvrdenie záveru → export; + krátko architektúra AI (model, RAG, prevencia halucinácií, ochrana údajov).
- **Súbory:** `docs/materials/slack/mdt-copilot/` (docx + pptx).

#### 12) Twincer (Cancer Twin) – `#twincer`
- **Zadávateľ:** Fuck Cancer (pacientska organizácia); **garant:** David Foldyna; podklady posiela Petr Novák. Hľadajú aj mentorov na vylepšenie aplikácie.
- **Koncept [doc, PDF je obrázkové, čítané zo snímok]:** „Nemusím na to být sám" – prepojiť onkologických pacientov s podobnou skúsenosťou (profil pod prezývkou bez e-mailu + krátky zdravotný dotazník → zhoda v % podľa prezývky, krajiny, pohlavia, vekovej skupiny → rozhovor písaním/diktovaním, **AI prekladá medzi jazykmi** → obľúbení, história len v telefóne). Druhá časť: **analytika pacientskych skúseností** – AI rozpoznáva témy, potreby a ich vývoj; anonymizované súhrnné výstupy pre lekárov, pacientske organizácie, výskum; členenie podľa veku, krajiny, pohlavia, diagnózy, fázy (pred/v/po liečbe); malé skupiny sa nezobrazujú; len so súhlasom.
- **Prílohy (xlsx):** 01 texty aplikácie CZ/EN (kľúče, obrazovky, pravidlá pre tím), 02 diagnózy CZ/EN, 03 zadanie analytických výstupov (prehľad, výstupy, rady a odpovede, metriky, filtre, témy a dáta, spracovanie, overenie, metodické podklady). Prvé demo: syntetické dialógy → klasifikácia → 6 spoločných prehľadov + filtrovanie vrátane neznámych hodnôt a potlačených malých skupín.
- **Súbory:** `docs/materials/slack/twincer/`.

### 1.3 Brno (6) – FEKT VUT, Technická 3058/10

#### 13) Když realita překoná prognózu – `#kdyz-realita-prekona-prognozu`
- FN Brno, Klinika dětské onkologie; **garant:** Vítězslav Dušek; mentorka Anna Winklerová (FN Brno). Zadanie/dáta **v kanáli zatiaľ nie sú** [?].

#### 14) PillGaze – `#pillgaze`
- MOÚ; **garant:** Martin Rusinko. Zadanie/dáta **v kanáli zatiaľ nie sú** [?]. (InterSystems slide: kategória „zapsat do databáze – validace/FHIR/API".)

#### 15) ProstaPaper – `#prostapaper`
- MOÚ; **zadávateľ:** Michal Standara (rádiológ; ponúka aj rádiologické konzultácie k akejkoľvek výzve v Brne).
- **Dáta:** zdrojové dáta cez **CESNET FileSender** (odkaz v kanáli, 16. 10. 8:06; nesťahované – externý odkaz, môžu to byť klinické dáta). Prístup do **testovacieho zrkadla REDCap registra Compare** – poslať meno/mail zadávateľovi; na mieste Honza Švancara (správca registra) na konzultácie k importu a štruktúre.
- Prezentácia zadania `ProstaPaper_zadání.pptx` (14,9 MB) – **nestiahnutá (>10 MB)**. Obsah zadania teda zatiaľ nepoznáme [?] (názov naznačuje papierové formuláre k prostate → digitalizácia do registra – **neoverené**).

#### 16) TriaLink – `#trialink`
- MOÚ; **garanti/mentori:** Peter Grell, Šárka Selvekerová.
- **Problém [doc]:** v MOÚ >140 aktívnych štúdií (~50 intervenčných), len ~5 % pacientov v intervenčných štúdiách (Západ 10–15 %); manuálne hľadanie štúdie trvá ~45 min, cieľ < 30 s.
- **Riešenie:** pre lekára rozhodovací strom (MKN-10 diagnóza, klinické štádium, biomarkery KRAS G12C/HER2/TMB…, línia liečby) + referral správa študijnej koordinátorke; pre pacienta vyhľadávanie v češtine s vysvetlením pojmov, AI spracovanie nahratej anonymizovanej správy **lokálnym LLM** (vyplní parametre). 2. etapa: celá sieť KOC / celá ČR.
- **Vstupné dáta:** export bežiacich štúdií z NIS SONIS (.csv), číselník biomarkerov (.xlsx), TNM (cis_stadium.csv, cis_skupina.csv) + MKN-10 (ÚZIS), ≥10 anonymizovaných/syntetických kazuistík; registre euclinicaltrials.eu, ClinicalTrials.gov; inšpirácia en.trialing.org, klineo.com, clinicaltrialfinder.info. Dáta: **CESNET FileSender odkaz v kanáli** (15. 10.) – nesťahované.
- **Očakávanie:** funkčný webový prototyp s importom CSV zo SONIS a číselníka biomarkerov; overený prechod rozhodovacím stromom na 5 kazuistikách (lekár aj pacient); simulácia odoslania referral e-mailu; demo extrakcie parametrov z anonymizovanej správy lokálnym LLM (v operačnej pamäti).
- **Súbor:** `docs/materials/slack/trialink/RAKATHON_2026_MOU_Vyzva3_TriaLink_prezentace.pptx`.

#### 17) EduAIttractive – `#eduaittractive`
- MOÚ; **garant/mentor:** Jiří Šedo; mentori v kanáli Adam Melničák (Orbiso, online), Vít Svojše (Bindworks). Zadanie/dáta **zatiaľ nie sú** [?].

#### 18) Vzkazy pro budoucnost – `#vzkazy-pro-budoucnost`
- FN Olomouc; **garantka:** Lenka Fuxová; mentorky Lenka Fuxová, Kateřina Holá (FNOL).
- **Zadanie [canvas „Podklady"]:** „Schránka vzpomínek" – appka, kde rodič (najmä pri závažnom ochorení) ukladá osobné listy, príbehy a spomienky pre svoje deti. **Cieľ:** spustiteľné demo s jedným dokončeným scenárom od výberu dieťaťa po znovuotvorenie uloženého listu.
- **MVP:** profil dieťaťa (≥1 fiktívne), textový list (vytvoriť/otvoriť/upraviť), koncept vs. hotový, prehľad so stavmi, trvalé uloženie (prežije reštart). Hlavný priechod 6 krokov (výber dieťaťa → nový list → koncept → úprava → hotový → nájsť v prehľade → reštart). **Hotovo = beží na telefóne alebo emulátore** + stručné vysvetlenie technického riešenia a bezpečného ukladania.
- **Tón:** láskavo, jednoducho, bez tlaku (žiadne odpočty, hodnotenie), súkromne (len fiktívne dáta, žiadne zdieľanie); vizuál svetlý, teplé pastelové tóny. Rozšírenia: foto, hlas, video, prevod reči na text, míľniky, plánované odkazy, export.
- **Súbory:** 9 PNG obrazoviek (inšpirácia) v `docs/materials/slack/vzkazy-pro-budoucnost/` + `Podklady_canvas.md`. `Diagram aplikace.drawio` (15 MB) **nestiahnutý**.

### 1.4 Ostrava (5) – VŠB-TUO (hackerspaces 4. poschodie)

Garanti 1–4: FN Ostrava. Zadania ani dáta **v žiadnom ostravskom kanáli zatiaľ nie sú** (ani prezentácie – tím OncoMedViz o ňu žiadal v #ai-surgical-copilot o 12:49). [?]

19) **Onkologický AI průvodce** – `#onkologicky-ai-pruvodce` – FN Ostrava, Jakub Cvek.
20) **AI asistent multidisciplinárního týmu** – `#ai-asistent-multidisciplinarniho-tymu` – FN Ostrava, „Jakub" (pravdepodobne tiež Jakub Cvek [?]). Ostravská obdoba MDT Copilota.
21) **Chytřejší plánování onkologického stacionáře** – `#chytrejsi-planovani-onkologickeho-stacionare` – FN Ostrava, Erika Hajnová Fukasová (mentorka **a porotkyňa**).
22) **AI NOR** – `#ai-nor` – FN Ostrava, Magdaléna Najbrtová.
23) **AI Surgical Copilot** – `#ai-surgical-copilot` – FN Olomouc, Vladimír Študent. (Zero Latency z Ostravy plánuje computer vision a potrebuje GPU.)

### 1.5 Partnerská cena (nad výzvami)

#### 24) Best Use of InterSystems Technology for AI and Interoperability – `#best-use-of-intersystems-technology-for-ai-and-fhir`
- **Cena: 1 500 EUR** pre jeden tím, odovzdá sa **v nedeľu 18. 10. na finále v Prahe**. Dá sa kombinovať s **akoukoľvek** výzvou ako primárnou.
- **Čo:** najlepšie využitie technológií InterSystems pre AI, prepojenie zdravotníckych dát a systémov (najmä HL7 FHIR) alebo kombináciu. Technológie: **InterSystems IRIS for Health** (Community Docker image cez GitHub šablónu), **FHIR server** (odporúčajú ho mať ako hlavné dátové úložisko), SQL databáza IRIS, **vector search** (RAG), agentný prístup (tool-calling nad SQL/API/FHIR/Vector Search), LangChain integrácia.
- **Kritériá (Michaela Grösslová, InterSystems):** Inovatívnosť; Reálny prínos (komu, dopad, cesta k ďalšiemu rozvoju); Využitie technológií InterSystems (zmysluplne – AI, zdravotnícke dáta, FHIR); Technická ucelenosť (dátový model, architektúra). V prezentácii: aký problém, ako riešenie funguje, prečo tento prístup.
- **Podpora:** 24 h online mentori; mentori na mieste: Ondřej Hoferek, Gabriel Ing (Praha), Thomas Dyar, Daniil Drozdov (Brno), Daniel Kutac (Ostrava).
- **Odkaz:** `developer.intersystems.com/intersystems-challenge-at-rakathon-2026/`.
- **Súbory:** workshop PDF + QR flyer.
- InterSystems slide mapuje výzvy na typy AI: „nájsť súvislosti – vector search/RAG" (MDT Copilot, AI Trial Matching, NÚVR); „overiť a doplniť – SQL/API" (PACS Comparator, SMART ONCO AA, Cesta pacienta); „vyhodnotiť riziko – modely/pravidlá" (mamograf, skríning pľúc, hlídač NÚ); „zapísať do databázy – validácia/FHIR/API" (PillGaze, ProstaPaper, AI NOR).

---

## 2. Program / harmonogram

### Štvrtok 15. 10. – Pre-hack day (online Zoom, nahrávané)
9:30 Cesta onkologického pacienta (Aleš Tichopád) · 10:30 České eHealth v kostce (Michal Opatřil) · 11:00 HL7 FHIR a European Common Cancer Model (Hynek Kružík) · 12:00 obed · 13:00 Microsoft workshop · 14:30 InterSystems (Ondřej Hoferek) · 15:30 FHIR & PHOENIX (Luc Chatty). Záznamy (Zoom, s heslom) sú v #01-oznameni (správa P. Žabku 15. 10. 19:30) – heslá sem nepíšem. Spracované v `02-prehack-prednasky.md` a `03-prehack-tech-a-vyzvy.md`.

### Piatok 16. 10. – Brno (FEKT VUT) [Slack, #04-info-brno]
- 8:30 registrácia · 9:30 spoločný stream zahájenia z Prahy · 10:20 zahájenie Brno (M. Kubíček, M. Mezl – FEKT VUT; D. Pospíšil – FN Brno)
- 10:45 VZP výzvy streamom z Prahy · 11:20 coffee break
- 11:30 brnenské výzvy: 11:40 Když realita překoná prognózu · 11:50 PillGaze · 12:00 ProstaPaper · 12:10 TriaLink · 12:20 EduAIttractive · 12:30 Vzkazy pro budoucnost · 12:40 InterSystems · 12:50 Pravidlá
- 13:00 predstavenie mentorov (online mentori v #07-hledam-mentora) · 13:20 obed
- **14:00 štart hackovania a mentoring**
- **19:00 uzávierka výberu výzvy + večera**

### Piatok 16. 10. – Praha [Slack, #03-info-praha]
- Start 9:30 (zahájenie streamované do Brna/Ostravy); prezentácie výziev dopoludnia (zdieľané majú byť – P. Vaňásek: „Yes").
- Tímy majú pridelené stanovištia v miestnostiach 205, 206, 218 (pri kávovaroch); čísla na stoloch. Tímy zložené na mieste dostanú stanicu o poschodie vyššie. (Zoznam 24 pražských tímov nižšie.)
- Presný program Prahy na Slacku **nie je** [?].

### Piatok 16. 10. – Ostrava (VŠB) [Slack, #05-info-ostrava]
- ~12:37 predstavovanie mentorov → presun do hackerspaces na 4. poschodí; **od 13:00 obed v menze (visačku so sebou)**; potom hackovanie.

### Sobota 17. 10.
- Na Slacku **nič konkrétne** [?] (hackovanie, mentoring; Alina Pirshtuk dostupná aj „zítra").

### Nedeľa 18. 10. – Finále v Prahe
- Finále (víťazi výziev zo všetkých miest), odovzdanie InterSystems ceny, hlasovanie „ceny hackerov", spievanie „cancel cancer" songu :) Čas, miesto a formát pitchu **nezazneli** [?]. MDT Copilot uvádza „Finále: 5 minut, jeden pacient" – pravdepodobne špecifické pre túto výzvu.

---

## 3. Pravidlá (čo zaznelo)

- Tím 2–4 členovia vrátane kapitána; výber výzvy vypĺňa kapitán do pi 19:00. **[Slack]**
- Jeden tím rieši **jednu výzvu**. **[Slack]**
- Do finále: **najlepší tím z každej výzvy**; pri VZP výzvach víťaz z každého mesta. **[Slack]**
- Mentorov si tímy vyberajú samy (nie sú prideľovaní). **[Slack]**
- Vlastné LLM/nástroje: organizátor priamo nepovedal nie; poskytnuté sú Azure modely + Copilot. MEDDI výslovne: pre prototyp nad fiktívnymi dátami akýkoľvek LLM. Verejné dáta sa môžu používať (podľa MSFT, poznámka 03). **[Slack + doc]**
- VZP dáta len pre VZP výzvy, len tímovým účtom; platené Azure prostriedky najprv konzultovať; API kľúče nepatria do prehliadača. **[doc MSFT slidy]**
- Prepis prednášok cez externú službu (ElevenLabs) a zdieľanie prepisov – organizátor: „To je OK". **[Slack]**
- Zobrazované meno na Slacku: `Meno Priezvisko (hacker - tím - mesto)`. Tím má mať vlastný Slack kanál (napr. tím „mammo_prg"). **[Slack]**
- Jazyk: čeština oficiálne, pitch po anglicky povolený. Nocovanie možné (karimatka, spacák). **[Slack]**
- Všeobecné pravidlá boli prezentované live (Brno 12:50 „Pravidla") – **text na Slacku nie je** [?].

## 4. Hodnotenie, odovzdanie, ceny

- **Všeobecné hodnotiace kritériá Rakathonu 2026 – na Slacku nie sú** [?] (pozri `01-rakathon-prehlad-a-vitazi.md` §5 pre zverejnené/minuloročné).
- **Špecifické:** MDT Copilot (váhy 30/20/20/15/15 + 10 % bonus), MEDDI Onco (skrytá testovacia sada; recall červenej/oranžovej, zbytočné eskalácie, routing podľa pracovnej doby, zrozumiteľnosť, súhrn), InterSystems (inovatívnosť, reálny prínos, využitie InterSystems, technická ucelenosť).
- **Formát a deadline odovzdania (repo/video/slidy, čas v nedeľu?)** – **NEZAZNELO** [?].
- **Ceny:** InterSystems 1 500 EUR; „cena hackerov" (hlasovanie v Prahe); „wild card" spomenutá hackerom, nepotvrdená. Hlavné ceny / výška – na Slacku **nie sú** [?].
- Porotcovia známi zo Slacku: Michal Bušek (Asseco, porota MDT Copilot), Erika Hajnová Fukasová (FNO, porotkyňa).

## 5. Technická podpora

- **Portál účastníka:** `https://aka.ms/rakathon2026` – API kľúč k LLM (Azure APIM, hlavička `api-key`, OpenAI-kompatibilné `/openai/v1/chat/completions`), endpoint + deploymenty, VZP dáta, Copilot registrácia. Tímový účet = UPN + TAP (časovo obmedzené heslo) na **tlačenej kartičke** pre kapitána; prístup od 13:00. Tenant `vzpcrrakaton` – prihlásenie osobným MS účtom nefunguje (chyba AADSTS50020) → treba tímový účet. **[Slack + doc]**
- **Modely v portáli (podľa MSFT slidov):** OpenAI gpt-6.1-sol, gpt-6-astra, gpt-6-luna; xAI grok-4.7; DeepSeek-V4-Pro; Moonshot Kimi-K2.7-Code; Microsoft MAI-Thinking-1 (deployment názvy napr. `gpt-6-1-sol-dz-eu`). **[doc]**
- **Azure:** vlastná resource group `rg-teamNN`, rola Contributor; odporúčané Static Web Apps (Free), Functions (Flex Consumption), Container Apps, Durable Functions; Azure SQL free offer najprv potvrdiť s organizátormi. **[doc]**
- **GitHub Copilot:** `aka.ms/rakathon2026/github` → org `hackathon-green-snail-77`, $100 kredit/osoba, vlastný GitHub účet. **[Slack]**
- **Newcomer guide (MSFT):** `michalmar.github.io/rakathon-env/docs/newcomer-guide.standalone.html` (aj `?view=slides`). **[Slack]**
- **Kanál:** `#08-tech-helpdesk` (FHIR, Copilot, Azure). Microsoft mentori: Michal Marušan (AI apps/Azure/Copilot), Simon Procházka (Brno), Olena Vasylenko (onko/bio dáta, Praha), Bernardo Sunderhus (frontend/UX/React, len EN, Praha), Vladimír Mach (partner MSFT). VZP cloud: Jan Bartyzal. InterSystems: viď vyššie. VŠB Ostrava: Michal Krumnikl. Kuba Comensky (Ostrava, kyberbezpečnosť/AI, natáča).
- Testovací FHIR pre mamograf: hacker sa pýtal na `FHIR_BASE_URL`/token – **bez odpovede na Slacku** [?].

## 6. Odkazy

- Výber výzvy: `submit.rakathon.cz/vyzvy/vybrat` · založenie tímu: `submit.rakathon.cz/tym` · prehľad: `submit.rakathon.cz/vyzvy`
- Ľudia/mentori podľa mesta: `rakathon.cz/lide#brno` (atď.)
- Portál: `aka.ms/rakathon2026` · Copilot: `aka.ms/rakathon2026/github`
- InterSystems: `developer.intersystems.com/intersystems-challenge-at-rakathon-2026/`, `startup.intersystems.com`
- SÚKL databáza liečiv/SPC: `prehledy.sukl.cz/prehled_leciv.html` · CTCAE v6: `dctd.cancer.gov/research/ctep-trials/for-sites/adverse-events/ctcae-v6.pdf`
- Štúdie MOÚ: `mou.cz/klinicke-studie/t1520` · `clinicaltrials.gov`, `euclinicaltrials.eu`, `clinicaltrialfinder.info`, `en.trialing.org`, `klineo.com`
- Instagram podujatia: CNCR.tech

## 7. Konkurencia / pozoruhodné tímy (zbežne z #06, #03, joinov)

- **Super Team MEMOyA** (Standa Nagy, Ostrava, + Viola Kintrová) – už má bežiaci základ „MEMOyA": AI prečíta celý spis, nájde chýbajúce a rozporné údaje, každé číslo s doslovnou citáciou zo správy, len syntetické dáta. Cieli na FN Ostrava (MDT asistent), nadväzuje na VZP Cestu pacienta a **InterSystems cenu (FHIR/IRIS)**. Silný kandidát v Ostrave a na InterSystems.
- **TokenPerSecond** (Brno: Marek Filip, Peter Zdravecky, Jakub Lorenc) – súťaživí, sledujú mamograf/MDT/PillGaze kanály, pýtajú sa na hodnotiaci test set.
- **RationAI** (Brno, MUNI) – výskumná skupina (AI v patológii), joiny v mamograf/Cesta pacienta/ProstaPaper.
- **mammo_prg** (Praha: Alex Yudzin – bioinformatika/ML, Varvara Shorina – backend) – mamograf, CatBoost + clustering.
- **Zero Latency** (Ostrava) – AI Surgical Copilot, computer vision, chcú GPU.
- **www.pixed.cz** (Ostrava: Richard Klopec, Daniel Tenora) – Claude-heavy, hľadali člena s Claude MAX.
- **OncoMedViz** (Ostrava, VŠB), **Elektra** (Ostrava), **Sněženky a Michal** (Ostrava), **Holub** (Ostrava – Jan Kondula, React/AI fullstack, mojezdravotnictvi.cz, vyhral 2 pitch súťaže).
- Praha – 24 tímov na stanovištiach: 404: tumor not found, Canbe, Compass Crew, Čímžtopádem Vyléčeno, Data Team, dudes, FIT/S, Cheirón, Junior Scholars, Korex, M&A, MediBit, MSFZ, Nexlytics, Panacea, Pixel Predators, Přemke, quattro formaggi, radiQA, Remiho klubík, Risk off, smetytech., Smradi, VI KA. Brno ďalej: Brainless, Going Bananas, Axolotl, JOTOZO, modulBit, Robinsoni, Správci silnic, bahnaci.cz, SMTP, Podbranč, ae, Máma graf, Patrik Vrbovský, 404 Founders, Rakovina.

## 8. Zhrnutia stiahnutých dokumentov

- **Rakathon_vyzvy_onkologie_FNM.pdf** (10 str., MUDr. A. Pirshtuk) – 3 výzvy FNMH (Trial Matching, PACS Comparator Check, hlídač NÚ), spoločný dataset (čo obsahuje/neobsahuje), úlohy, vstupy, výstupy a „čo reálne chceme". Detail v §1.2.
- **Seznam_studii_FNMH.xlsx** – ~90 aktuálne náborujúcich štúdií Onkologickej kliniky FNMH (GIT, prs, pľúca…; protokol, zadávateľ, fáza, diagnóza, skúšajúci, koordinátor).
- **Rakathon_VZP_mamograf.pdf** (12 str.) – výzva „Kto nedorazí na mamografický skríning" – čísla 2024, otázka, 4 úlohy, segmenty, výstupy, dopad, dáta (>1,3 mil. záznamov). Detail v §1.1.
- **Rakathon_tema_CZ_ACE.docx** + **MDT_Copilot_zadani_upravene_2026_v02.pptx** (13 slidov) – kompletné zadanie MDT Copilot (Asseco): architektúra reportu A/B/B2/C, kľúčové požiadavky, bonusy, deklarované dáta, hodnotiace váhy, scenár 5-min dema; pptx = laická verzia + slovníček (MDT, PROMs, ECOG, TNM, RECIST, RAG, mCODE, EHDS…) a štandardy (FHIR R4, mCODE, HL7 Europe Common Cancer Model, MKN-10/ICD-O-3, LOINC, SNOMED CT).
- **rakathon_meddi_onco_pro_tymy_3.zip** – README (dátový slovník, pacienti, pravidlá, hodnotenie), 14 pacientov JSON, 14 ground truth JSON, definície dotazníkov, pravidlá triáže, vzorové súhrny, pacientska cesta.
- **RAKATHON_2026_MOU_Vyzva3_TriaLink_prezentace.pptx** (6 slidov) – TriaLink: čísla o štúdiách v ČR/MOÚ, cieľ <30 s, riešenie pre lekára/pacienta, vstupné dáta, očakávania. Detail v §1.3.
- **FCK_Rakathon2026_CancerTwin_v09.pdf** (11 slidov, obrázkové) + 3 xlsx prílohy – Cancer Twin (Fuck Cancer): prepájanie pacientov a analytika skúseností. Detail v §1.2.
- **Vzkazy pro budoucnost – 9 PNG + canvas** – UI inšpirácia „Schránka vzpomínek" (homepage, moje deti, profil dieťaťa, knižnica so stavmi, editor listu, potvrdenie uloženia, prečo to má zmysel, inšpirácia, mimo aplikácie).
- **Rakathon_2026_InterSystems_Workshop.pdf** (26 str., O. Hoferek) – výzva InterSystems, mapovanie výziev na AI vzory, RAG, vector search, agentný tool-calling, prečo FHIR (prenositeľnosť, Provenance, EHDS), IRIS for Health Community Docker, FHIR server ako hlavné úložisko, LangChain.
- **QR_flyers_Rakathon_2026_InterSystems.pdf** (2 str.) – leták InterSystems challenge: 1. miesto 1 500 EUR, 24 h online mentori, odkazy (newsletter, Startup Program, Ventures).
- **Rakathon_2026-MSFT-Slides.pdf** – sprievodca pre tímy: portál, kartička UPN+TAP, API kľúč, zoznam modelov, ukážkové curl volanie, VZP dáta len pre VZP výzvy, resource group, Copilot, Azure služby pre prototyp.
- **Rakathon_HoF_PHOENIX_XiA.pdf** (16 str., Luc Chatty, HL7 Europe / Hospitals on FHIR) – ako dostať prototyp za hranice jednej nemocnice: FHIR ako zmluva (profily, terminológia, bezpečnosť, workflow), „We store JSON ≠ interoperable", EHDS, PHOENIX/XiA.
- **HL7_Rakathon_2026_uvod-1.pptx** (Hynek Kružík) a **Ceske_eHealth_v_kostce…pdf** (Michal Opatřil, 8 str.) – prednášky z pre-hack day; spracované v `02-prehack-prednasky.md`.

## 9. Otvorené otázky

1. **Formát a deadline odovzdania** (kedy v sobotu/nedeľu, čo sa odovzdáva – repo, video, slidy, formulár na submit.rakathon.cz?).
2. **Všeobecné hodnotiace kritériá** a porota na lokálnych kolách (pi–so v mestách?) vs. finále.
3. **Hlavné ceny** (výška, kategórie, wild card?).
4. **Čas a miesto finále** v nedeľu, dĺžka pitchu (MDT uvádza 5 min).
5. **Zadania bez podkladov na Slacku:** Kvalita péče na konci života, Cesta pacienta bez ztráty informací (VZP – asi na portáli), NÚVR Research Matchmaker, Plíce včas, SMART ONCO AA, Když realita překoná prognózu, PillGaze, EduAIttractive, všetkých 5 ostravských, ProstaPaper (pptx >10 MB nestiahnutý).
6. **Kde je dataset FNMH** (3 pražské výzvy Motol) a **dáta MDT Copilot** (mock eZdravie, PROMs, guidelines, štúdie) – v kanáloch zatiaľ nie sú.
7. Testovací FHIR server pre VZP výzvy – URL/token? (otázka bez odpovede).
8. Holdout/test set pre mamograf – bude porovnanie tímov na spoločnej sade?
9. V ktorom meste hackujeme a akú výzvu volíme – rozhodnúť do 19:00.
