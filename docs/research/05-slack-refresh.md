# 05 – Slack refresh (stav piatok 16. 10. 2026 ~16:00)

**Čo to je:** doplnok k `04-slack-vyzvy-a-pravidla.md` (ten je k 13:00). Prejdené: všetky info kanály (#01–#09), všetkých 23 kanálov výziev + kanál InterSystems, vlákna, tabuľa tímov na `submit.rakathon.cz`, verejný Google Drive priečinok organizátorov (prezentácie všetkých výziev) a nové súbory zo Slacku. Slack iba čítaný, nič sa neposielalo. Nič sa necommitovalo.

Značky: **[Slack]** zo Slacku, **[Drive]** z prezentácie na Google Drive, **[web]** z webu organizátorov, **[?]** neisté / nezaznelo. Odborné pojmy sú vysvetlené v zátvorke.

---

## 0. TL;DR – 12 vecí, ktoré sa zmenili

1. **Odovzdanie je v SOBOTU 17. 10. o 13:00, tvrdý deadline** (po 13:00 formulár nič neprijme). Máme teda cca 21 hodín od teraz. [Drive – INTRO Praha, slidy „Sobota“ a „Jak a do kdy odevzdat“]
2. **Hodnotenie v sobotu (lokálne):** 14:00–16:00 zadávatelia výziev **obchádzajú svoje tímy** (nie je to javisko), o 16:00 nahlásia víťaza, 17:00–18:00 vyhlásenie. **Víťaz každej výzvy ide do nedeľného finále v Prahe.** [Drive]
3. **Kritériá (sobota): 1. AI technológia a prevedenie, 2. Využiteľnosť v praxi u zadávateľa výzvy, 3. Inovatívnosť.** V nedeľu pribudnú **4. Škálovateľnosť** a **5. Kvalita prezentácie a tímu**. Váhy nie sú zverejnené. [Drive]
4. **Finále v nedeľu 18. 10.:** Kampus Plzeňská (2. LF UK, budova A, Plzeňská 130/221, Praha 5 – Motol). 13:00 registrácia, 14:00 pitche osobne pred porotou (do 16:30), 17:00 vyhlásenie. **Dĺžka pitchu nie je uvedená** [?]. [Drive, web]
5. **Čo sa odovzdáva** (formulár na `submit.rakathon.cz`): názov + krátky popis (do 140 znakov) + voliteľný dlhší popis (CZ aj EN); mesto, výzva, tím; „Ako používate AI? Aký dopad a pre koho? FHIR od InterSystems?“; **povinný titulný obrázok (do 8 MB, pomer 16:9)**; odkazy na GitHub, demo, video. Po odoslaní príde odkaz na úpravy až do deadlinu. [Drive]
6. **Pražský tím si reálne vyberie len z 12 pražských výziev** (9 pražských + 3 VZP). Formulár výberu najprv pýta mesto a potom ukáže iba výzvy toho mesta. Brnianska/ostravská výzva pre pražský tím tam nie je. Oficiálne nikto nepovedal „zakázané“, ale **obaja členovia musia byť fyzicky na mieste** (Vaňásek v #02-dotazy). [web + Slack] (detail v §2.6)
7. **Dokončené zadania:** doplnené sú všetky výzvy, ktoré 13:00 nemali zadanie, **okrem SMART ONCO AA** (VFN) – tá prezentácia je 66 MB obrázkové pptx, text sa nedal vytiahnuť. [?] (§1)
8. **Konkurencia v Prahe (stav ~16:00):** 23 tímov má výzvu, 5 ešte nevybralo. **Bez tímu: „Kvalita péče na konci života“ (VZP) a Twincer.** Najviac tímov: AI Trial Matching (4), VZP mamograf (3). (§3)
9. **VZP mamograf – dáta sú už dostupné** na portáli `aka.ms/rakathon2026`; mentorka spresnila, že „Příloha B“ v popise polí je len pomocná, prediktory sú v bode 7 (B3 história screeningu, B4 preventívne správanie). [Slack]
10. **Prístupy do Azure sa oneskorujú:** viaceré tímy (mammo_prg, 404: tumor not found, Canbe) o 15:44 stále nedostali prístup po vyplnení formulára. GitHub Copilot: pozvánku treba po vytvorení ešte **prijať priamo na GitHube**. [Slack]
11. **Dáta k FNMH výzvam (AI Trial Matching, PACS Comparator, hlídač NÚ) a k MDT Copilot / SMART ONCO AA dáva InterSystems mentor Ondřej Hoferek** (osobne alebo cez Slack správu). [Slack + Drive InterSystems Intro]
12. **Všetky prezentácie z dopoludnia sú na verejnom Google Drive** (priečinky Praha/Brno/Ostrava), zoznam URL je v §4 a prečítal som ich cez Google Drive konektor (`read_file_content` funguje na tieto ID).

---

## 1. Nové zadania výziev

Prehľad, čo sa zmenilo oproti `04`:

| Výzva | Mesto | Stav zadania v `04` | Stav teraz |
|---|---|---|---|
| Kvalita péče na konci života (VZP) | spoločná | žiadne | **plné zadanie + dátový slovník** (§1.1) |
| Od pozvánky k mamografu (VZP) | spoločná | plné | dáta živé, spresnenie (§1.2) |
| Cesta pacienta bez ztráty informací (VZP) | spoločná | žiadne | **plné zadanie + dátový balík (fiktívna pacientka)** (§1.3) |
| Plíce včas (AstraZeneca) | Praha | žiadne | **plné zadanie + 300 syntetických pacientov** (§1.4) |
| NÚVR Research Matchmaker | Praha | žiadne | **prezentácia zadania, dáta nezverejnené** (§1.5) |
| SMART ONCO AA (VFN) | Praha | žiadne | **stále chýba** [?] (§1.6) |
| MDT Copilot (Asseco) | Praha | plné, bez dát | dáta stále nie sú v kanáli, dáva ich InterSystems mentor (§1.7) |
| AI Trial Matching, PACS Comparator, Hlídač NÚ (FNMH) | Praha | plné, bez datasetu | dataset cez O. Hoferka (§1.7) |
| Když realita překoná prognózu (FN Brno) | Brno | žiadne | **plné zadanie + 3 CSV** (§1.8) |
| PillGaze (MOÚ) | Brno | žiadne | **plné zadanie** (§1.9) |
| ProstaPaper (MOÚ) | Brno | žiadne | **zadanie z prezentácie** (§1.10) |
| EduAIttractive (MOÚ) | Brno | žiadne | **plné zadanie** (§1.11) |
| 5 ostravských výziev | Ostrava | žiadne | **zadania z prezentácií** (§1.12) |

### 1.1 VZP – Kvalita péče na konci života (spoločná pre všetky mestá)

Zdroj: Drive deck „VZP – Kvalita péče na konci života“ (Praha) + Google Doc „Datový slovník, vysvětlivky, indikátory“, ktorý poslala mentorka v kanáli o 14:45. Garantka doc. MUDr. Hana Študentová (Praha), mentorka Mgr. Kateřina Holá (online). Technický mentor VZP: Jan Bartyzal. **Tímy: 0 vo všetkých troch mestách.**

- **Otázka výzvy:** Dokážeme z dát lepšie pochopiť starostlivosť v posledných týždňoch a mesiacoch života onkologických pacientov? Treba vytvoriť **transparentný analytický rámec**, ktorý ukáže vzorce starostlivosti, zohľadní rozdiely medzi pacientmi a označí odchýlky, ktoré treba odborne vysvetliť. **Nejde o hodnotenie konkrétneho pacienta, lekára ani pracoviska.**
- **4 kroky úlohy:** ZMERAŤ (definovať skupinu pacientov a spočítať zrozumiteľné ukazovatele, deck spomína Power BI) → ZOHĽADNIŤ (case-mix = úprava na to, že pacienti sa líšia diagnózou, štádiom, vekom) → POROVNAŤ (skupiny, variabilita, štatistická neistota) → VYSVETLIŤ (oddeliť zistenia od hypotéz, ukázať, čo sa z dát vyvodiť nedá).
- **Príklad ukazovateľa:** chemoterapia / iná systémová onkologická liečba alebo rádioterapia v posledných 14 alebo 30 dňoch života. Hlavný ukazovateľ = podiel pacientov s takou liečbou z všetkých zomretých pacientov danej diagnózy (v %).
- **Dáta:** anonymizované onkologické datasety po diagnózach (v dokumente: **C18 črevo, C25 pankreas, C34 pľúca, C50 prsník, C61 prostata, C64 oblička, C67 močový mechúr**). Analyzujú sa len pacienti s vyplneným úmrtím a príčinou úmrtia s kódom „C“. Systémová liečba = kódy ATC začínajúce L01 (bez methotrexátu, mitomycínu, epirubicínu), rádioterapia podľa zoznamu výkonov. **Verejný zdroj dát: NOP Online – otvorené dáta** https://onconet.cz/cs/data/otevrena-data-diagnozy/ (mentorka pridala odkaz v kanáli). Ďalšie dátové sady/indikátory si môžu tímy vymyslieť.
- **Realistický výstup za hackathon:** vybrať **jednu diagnózu** a ukázať celý postup: základný report kvality dát; približne 5–8 ukazovateľov starostlivosti na konci života; hrubé aj základne upravené (case-mix) porovnanie; prehľadná vizualizácia alebo dashboard; faktory spojené s vyššou intenzitou starostlivosti; **3 konkrétne hypotézy** na ďalšie overenie; reprodukovateľný postup. Bonus: overiť metodiku na druhej diagnóze. „Nečakáme finálnu národnú metodiku ani klinický rozhodovací systém.“
- **Čo riešenie musí rešpektovať:** región bydliska nie je poskytovateľ liečby; koniec protinádorovej liečby nie je začiatok paliatívnej starostlivosti (ak údaj v dátach nie je, nedopočítavať ho); korelácia nie je hodnotenie kvality; populačná analýza nie je individuálne rozhodovanie (**žiadna individuálna prognóza smrti**, žiadne rozhodovanie o ukončení liečby).
- **Kritériá:** špecifické neuvedené, platia všeobecné (§2.3). Dopad podľa zadania: lepšie porozumenie dátam, identifikácia variability, podklad na odbornú diskusiu, základ metodiky.

### 1.2 VZP – Od pozvánky k mamografu (doplnky od 13:00)

Plné zadanie je v `04` §1.1 (a v Drive decku Autor: Ing. Antonín Hlavinka). Nové:
- **Dáta sú už k dispozícii** na portáli `aka.ms/rakathon2026` (mentorka Helena Damovská, 14:33). Navigácia: ona a Jan Bartyzal sú **v prízemí za výťahom** (Praha). [Slack]
- **Spresnenie k dátovému slovníku (15:34):** „Příloha B“ bola len pomocný podklad pri tvorbe zadania a omylom zostala v popise dát; **prediktory (vstupné premenné) sú v bode 7: B3 História screeningu a B4 Preventívne správanie.** Referenčný čas pre všetky prediktory aj labely (výsledky, ktoré sa predpovedajú) = `invitation_date`. [Slack – hackeri z mammo_prg si všimli odkaz na neexistujúcu prílohu]
- Údaje v decku (2024): 292 176 pozvánok; účasť pri prvom pozvaní 44,5 % (55 tis. pozvaných), celková účasť po adresnom pozvaní 18,9 %, pri opakovane (aj po 11. pozvánke) pozývaných 3,2 % (cca 59 tis. žien). Dôraz: **neriešime no-show na objednaný termín**, ale či pozvaná žena absolvuje screening v definovanom období. [Drive: https://drive.google.com/file/d/1jpN3tlCxpvTmsduJL3Ogkb1qC5b-pguf/view]
- Otvorené [?]: holdout/test sada na porovnanie tímov; či dáta obsahujú históriu predošlých pozvánok/SMS (otázka bola položená o 14:27, odpoveď nie je).
- Kritériá: nie sú špecifické, platia všeobecné; výstup = skóre rizika neúčasti, hlavné faktory, segmenty, návrh intervencií, návrh A/B testu.

### 1.3 VZP – Cesta pacienta bez ztráty informací

Zdroj: Drive deck (Autori: Bielčiková, Vaňková, Chrástová, Rybář, Tůmová, Klimeš Lipánová) + balík `cesta-pacienta-data.zip` v kanáli (14:05; 13 dokumentov, 3,2 MB; obsahuje aj úlohu `Zadani_ulohy.docx`). Kópie zadávacích dokumentov: `docs/materials/slack/refresh-1600/cesta-pacienta_*.docx`. **Tímy: Praha 2, Brno 1, Ostrava 0.**

- **Kontext:** Koordinátor v komplexnom onkologickom centre (KOC) – človek, ktorého zaviedlo ministerstvo a platí ho VZP – hlási čas do liečby (symptóm → diagnostika → MDT → liečba). V centrách je cca 65 % všetkých onkologických pacientov (kapacity sú plné). Koordinátori dnes nahrádzajú chýbajúcu elektronizáciu: dokumentácia prichádza roztrieštene, koordinátor trávi čas dohľadávaním údajov a spätná väzba k odosielajúcemu lekárovi sa neuzatvára. MDT (multidisciplinárny tím = konzílium lekárov rôznych odborov, ktorý rozhoduje o liečbe).
- **Úloha:** postaviť **funkčný prototyp, ktorý prevedie jeden onkologický prípad od odoslania až po spätnú väzbu bez straty informácií**: 1 PREVZIAŤ (dokumentácia od externého lekára bez ďalšieho veľkého formulára), 2 VYŤAŽIŤ (AI vytiahne kľúčové údaje do pevnej štruktúry a označí, čo chýba; lekár potvrdí), 3 KOORDINOVAŤ (dashboard koordinátora: nový/aktívny/odložený pacient, úlohy s termínom a prioritou, kto je „na ťahu“; digitálny plán s poradím krokov, e-mail/SMS/chat, upozornenia na termíny), 4 SPÄTNÁ VÄZBA (po MDT vrátiť odosielajúcemu lekárovi štruktúrovaný výsledok s pôvodným kontextom, potvrdiť odovzdanie).
- **Konkrétna súťažná úloha (zo `Zadani_ulohy.docx`):** simulovať prácu koordinátora KOC pri **jednej fiktívnej pacientke s rakovinou hlavy pankreasu (C25.0)**. Podklady: 13 dokumentov z rôznych pracovísk (kardiológ, laboratóriá, RTG, praktik, gastroenterológ, USG, CT, biopsia, histológia, algeziológ, psychológ). Aplikácia má: prijať žiadosť praktika o prevzatie, zhromaždiť dokumenty, vytvoriť **handover pre MDT dňa 21. 10. 2026** podľa zoznamu `Handover_obsah` (nacionále, kontakty, diagnóza, otázka pre MDT, komorbidity, lieky, alergie, stav výkonnosti, váha/výška, symptómy, vyšetrenia, laboratórium + onkomarkery, histológia, iné), **AI označí chýbajúce podklady**, koordinátor ich doplní, potom aplikácia vytvorí **správu z MDT podľa `MDT_zapis`** a **pošle záver MDT praktikovi** (s dokladom o doručení).
- **Čo odovzdať:** funkčné demo celého priechodu pacientky; správu k jednaniu MDT vytvorenú aplikáciou; ukážku odoslania záveru MDT praktikovi.
- **Upozornenia zadávateľa:** správy algeziológa a psychológa vznikli **po** MDT, do podkladov pre MDT patrí len to, čo bolo známe k 21. 10. 2026; údaje preberať **bez domýšľania**, čo chýba, označiť. Všetky dáta sú fiktívne.
- **Kritériá „hotovo, keď…“ po krokoch:** koordinátor dostane všetky údaje v jednom kroku; vidí lekárom potvrdený handover aj zoznam chýbajúcich údajov; pri každom pacientovi je vidno stav, termín a kto je na ťahu; referujúci lekár má výsledok aj s kontextom a odovzdanie je potvrdené. „Rakathon overí princíp, produkčná integrácia patrí do ďalšej fázy.“ Špecifické váhy nie sú.

### 1.4 Plíce včas: chytrá cesta k prevenci (AstraZeneca, Praha)

Zdroj: Drive deck „Astra Plíce“ (mentorka prim. MUDr. Ivana Čierná-Peterová, pneumologička) + `README.pdf` a 5 CSV súborov, ktoré dal v kanáli Luboš Matys (AstraZeneca) o 13:41. Kópia README: `docs/materials/slack/refresh-1600/plice-vcas_README.pdf`. **Tímy v Prahe: 1 (MSFZ); tím FSMZ s rovnakým stolom a kapitánom ešte nevybral, je to zrejme duplicita [?].**

- **Problém:** rakovina pľúc je najčastejšia príčina úmrtia medzi onkologickými diagnózami. Treba v nemocničnom/ambulantnom systéme **vybrať pacientov vhodných na oslovenie do screeningového programu skorého záchytu** (program „Prevence pro plíce“, www.PrevenceProPlice.cz, nízkodávkové CT hrudníka).
- **Kritériá zaradenia:** vek 55–74 rokov (vrátane), aktívny alebo bývalý fajčiar. **Vylúčenie:** CT hrudníka za posledný mesiac. Deck píše, že „balíčkoroky“ (pack-years = množstvo vyfajčených cigariet v čase) sa zatiaľ nezohľadňujú, README ale odporúča aj výstupný stav `EXCLUDED_PACK_YEARS` [rozpor, spýtať sa mentora].
- **Cieľ:** **automatický systém + aplikácia**, ktorá: nájde vhodných pacientov; zohľadní nedávne CT; **ukáže dôvod, prečo bol pacient vybraný alebo vyradený**; navrhne komunikačný kanál; **automaticky odošle pripravenú informačnú správu**; eviduje stav doručenia a reakciu pacienta; zdravotník môže výsledok skontrolovať/upraviť.
- **Odporúčané výstupné stavy:** `ELIGIBLE`, `EXCLUDED_AGE`, `EXCLUDED_SMOKING_STATUS`, `EXCLUDED_PACK_YEARS`, `EXCLUDED_RECENT_CT`, `NEEDS_REVIEW` (údaje chýbajú, sú neúplné alebo si odporujú).
- **Kontakt pacienta:** pacientsky portál, listová pošta/tlač, úloha pre praktika alebo pneumológa. Správa má byť **zrozumiteľná a neutrálna**, nesmie pacientovi oznamovať diagnózu ani tvrdiť, že je automaticky zaradený do screeningu. Praktik sa má o oslovených pacientoch dozvedieť.
- **Dáta:** syntetické (vymyslené) dáta pre **300 pacientov**: `1_patients.csv`, `2_smoking_history.csv`, `3_chest_ct_examinations.csv`, `4_patients_contact_history.csv`, `5_data_dictionary.csv`. Len pre Rakathon, nie na skutočné klinické rozhodovanie. Súbory sú v Slacku (#plice-vcas-chytra-cesta-k-prevenci, 13:41; ID F0CAN00HMME, F0C9C7H2A3Z, F0C9X9H6F2Q, F0C9X9J6B6G, F0C9N9XKWTX).
- **Postoj AZ:** zaujíma ich hlavne prototyp, ktorý sa dá preniesť do reálnej klinickej praxe; sľubujú podporu aj po hackathone. Kritériá: špecifické nie sú.

### 1.5 NÚVR Research Matchmaker (Národný ústav pre výskum rakoviny, Praha)

Zdroj: Drive deck (6 slidov). Garant Aleksi Šedo. **Tímy: 2 (Remiho klubík, dudes).**
- **Zadanie:** AI platforma na vyhľadávanie partnerov, technológií a zdrojov v českom onkologickom výskume („správny partner, správny zdroj, správny čas“). Premeniť roztrúsené informácie o tímoch NÚVR na funkčnú alianciu spolupráce **s vysvetlením, prečo spojenie dáva zmysel**. Pilot: **30–60 tímov**, neskôr celý NÚVR.
- **Tri prínosy:** partneri (rýchlo nájsť tímy na granty, publikácie, validačné štúdie), kapacity (expertíza, technológie, modely, kohorty, biobanky), medzery a duplicity.
- **Príklad vstupu:** „Chceme postaviť tím na riešenie vzťahov v nádorovom mikroprostredí, ideálne s modelom mozgových metastáz a priestorovou transkriptomikou pre spoločný grant.“ Výstup pri každej odporúčanej skupine: PREČO je relevantná, aký PRÍNOS ponúka, čo MÁ projekt ešte CHÝBAŤ, PRVÝ KROK (návrh spoločnej aktivity) + dohľadateľný zdroj informácie.
- **Dáta:** **nezverejnené** [?]. Deck zdôrazňuje, že AI je ľahšia časť a ťažšie je spoľahlivý katalóg tímov; pilot vyžaduje „jednotnú štruktúru dát a výber 30–60 tímov“ (z toho vyplýva, že tím si katalóg pripraví/syntetizuje sám). Otázka hackera o dátach (14:27) zostala bez odpovede.
- **Kritérium úspechu:** funkčné demo, ktoré pre konkrétny výskumný zámer odporučí partnerov, zdroje a prvý spoločný krok a **dokáže odporúčanie obhájiť**. Cena NÚVR: účasť na Czech Annual Cancer Research Meeting (23.–25. 11. 2026, Olomouc).

### 1.6 SMART ONCO AA: Příprava bez čekání (VFN, Praha) – STÁLE CHÝBA [?]

Garant Jan Bláha. Drive súbor „VFN – SMART ONKO AA.pptx“ má **66 MB** a je obrázkový, konektor vrátil prázdny text. V kanáli nie je zadanie ani popis, hackeri o dáta žiadali (14:00) a Ondřej Hoferek (InterSystems) im ich poslal cez súkromnú správu (15:38). Podľa InterSystems slidu: dáta k SMART ONCO AA aj MDT Copilot dáva InterSystems mentor osobne alebo na Slacku. Podľa predošlého mapovania InterSystems patrí do kategórie „overiť a doplniť – SQL/API“. **Tím: 1 (Canbe).** Zadanie treba pozrieť vizuálne (Drive URL v §4) alebo sa opýtať v #smart-onco-aa-priprava-bez-cekani.

### 1.7 MDT Copilot a 3 výzvy FNMH – bez zmien v zadaní, ale s novým postupom pre dáta

- **MDT Copilot (Asseco):** dáta stále nie sú v kanáli. Podľa InterSystems slidu ich dáva InterSystems mentor (Praha: Ondřej Hoferek, Gabriel Ing). **Michal Bušek z Asseco je v hlavnej porote** (sám to povedal v keynote). V keynote Asseco spomína: slovenský projekt OnkoAsist a štúdiu Hanna et al., BMJ 2020 (každé 4 týždne meškania liečby zvyšujú riziko úmrtia o 1–13 %; číslo je z decku, pôvodnú štúdiu som neoveril) a to, že praktik dnes označí podozrenie správne len asi u 10 % pacientov (SK 2019, zdroj NCZI/OnkoAsist podľa decku). Cena Asseco CE: mentoring prototypu a kontakty v zdravotníctve. **Tím: 1 (Korex).** [Drive: https://drive.google.com/file/d/1x1IrNcV4KEdqiFnfataEhVZlj2k4pOhv/view]
- **AI Trial Matching, PACS Comparator Check, Digitální hlídač NÚ (FNMH):** mentorka Alina Pirshtuk opakovane písala: „pre získanie datasetu kontaktujte Ondru Hoferka“ (12:59). Dnes o 15:57 je v miestnosti pre mentorov. Doplnenie k Trial Matching: hľadať štúdie aj pre iné pražské nemocnice (VFN, FTN), aby sa pacient dal odkázať inam. Kritériá špecifické nie sú. [Slack]
- **MEDDI ONCO Challenge:** bez zmien. Deck od zakladateľa MEDDI (Pecina) iba prezentuje produkt; číslo z decku: viac ako 15 500 pacientov v systéme MOÚ, orientačná úspora cca 137 000 Kč ročne na jednu všeobecnú sestru (nie je to nezávislo overené, deck to sám uvádza). Zadávateľ na mieste Patrik Litschmann, technický mentor online Erik Hulmák. **Tím: 1 (Přemke).**

### 1.8 Když realita překoná prognózu (FN Brno, Klinika dětské onkologie)

Zdroj: `Vyzva_KDO_Rakathon_Outlier.docx`, Drive deck a `release_fin.zip` (116 KB, 3 CSV + `datapackage.json`) od mentorky Anny Winklerovej (14:00). Garant MUDr. Vítězslav Dušek. Kópia: `docs/materials/slack/refresh-1600/kdyz-realita_Vyzva_KDO_Outlier.docx`. **Tímy: Brno 2 (Brainless, Axolotl).**

- **Problém:** lekári vedia, ako vyzerá „typický“ pacient. Zaujímaví sú tí, ktorí sa z očakávania vymkli (iná záťaž hospitalizáciami/komplikáciami, než zodpovedá diagnóze a veku). Treba ich **systematicky nájsť, vyčísliť mieru „neočakávanosti“ a vysvetliť, čo ich odlišuje**. Hlavný parameter hodnotenia podľa decku: **kreativita a učenlivosť v práci s dátami**.
- **Dáta (overené v zipe):** pseudonymizovaný dataset **157 pacientov** detskej onkológie (deck hovorí o ~250 detiach, skutočný súbor má 157): `patients.csv` (157 riadkov), `episodes.csv` (**17 864 epizód** starostlivosti: 1 707 hospitalizácií, 16 157 ambulantných kontaktov), `labs.csv` (1 624 laboratórnych výsledkov u 49 pacientov). Čas = dni od prvej epizódy, žiadne kalendárne dátumy.
- **Čo treba odovzdať (4 veci):** (1) model, ktorý pre každého pacienta odhadne očakávaný výsledok a vyčísli odchýlku; (2) vysvetlenie na úrovni jednotlivca (ktoré vlastnosti prispeli, nie len skóre); (3) vysvetlenie na úrovni skupiny outlierov (zhlukovanie samotných outlierov); (4) jednoduché rozhranie/dashboard, kde lekár prechádza outlierov zoradených podľa miery prekvapivosti, vidí vysvetlenie a môže ich potvrdiť/zamietnuť (**human-in-the-loop** = človek potvrdzuje), export do CSV.
- **Kritériá (docx):** klinická relevancia, interpretovateľnosť (rozumie lekár bez dátového vzdelania?), human-in-the-loop, práca s neistotou (jasný outlier vs. hraničný prípad), UX/prezentácia.
- **Pozor:** úmrtie je len u 1 pacienta (prežitie sa použiť nedá); štádium je známe len u 26 pacientov, TNM väčšinou chýba, liečba v dátach nie je; malá kohorta; dni epizód sú náhodne posunuté o 0–3 dni. **Pravidlá užitia dát: neidentifikovať pacientov, nezdieľať mimo tím, nenahrávať do verejných repozitárov ani do služieb mimo schváleného prostredia, po hackathone dáta zmazať.**

### 1.9 PillGaze (MOÚ Brno)

Zdroj: Drive deck + `RAKATHON_2026_MOU_Rusinko.docx` (mentor Martin Rusinko, 13:40). Kópia docx v `refresh-1600/`. Dáta: odkaz na CESNET FileSender v kanáli (13:34; token v odkaze nekopírujem). **Tímy: Brno 3 (Going Bananas, modulBit, bahnaci.cz).**
- **Problém:** zbieranie farmakologickej anamnézy (zoznam užívaných liekov) je pomalé a ručné; pacient nemá zoznam alebo prinesie ručne písané poznámky s chybami (neexistujúce gramáže, rovnaké názvy s viacerými silami). Dostupné nástroje na kontrolu interakcií berú len jednotlivé lieky a nedajú sa jednoducho upraviť ani bezpečne zdieľať s lekárom.
- **Zadanie:** mobilná aplikácia pre pacienta, ktorá spracuje **ručne písané poznámky aj fotky škatuliek liekov (OCR)**, zlúči informácie podľa spoľahlivosti zdrojov a vytvorí zoznam liekov so silami a denným rozpisom; **webové rozhranie/plugin pre lekára**; na požiadanie lekára **kontrola závažných interakcií** z verejných databáz (výsledok oddelený od pacientovho zoznamu, len v lekárskom rozhraní); rozpoznanie **onkologických režimov** (skratky chemoterapie/imunoterapie) vo verejnej databáze režimov.
- **Bezpečnosť:** žiadne citlivé osobné údaje; prenos zoznamu medzi pacientom a lekárom **anonymne cez krátky jednorazový PIN (max 4 miestny, platnosť napr. 3 minúty)**; zoznam môže zostať v telefóne pacienta, nesmie sa ukladať na externé úložisko.
- **Úspech za 48 h:** funkčné MVP (pacient + lekár, bezpečný prenos), čítanie fotiek obalov a tlačených zoznamov (ideálne aj ručne písaných), kontrola interakcií, rozpoznanie najpoužívanejších onko režimov, spoľahlivá ukážka PIN prenosu.
- **Dáta:** vzorové ručne písané a tlačené zoznamy (PDF, vrátane typických chýb), fotky obalov všetkých liekov z týchto zoznamov, zoznam verejných nástrojov na interakcie, prehľad zdrojov o onko režimoch. Kritériá špecifické nie sú.

### 1.10 ProstaPaper (MOÚ Brno)

Zdroj: Drive deck „ProstaPaper_zadání.pptx“ (11 slidov; kontaktné údaje autora nekopírujem). Zadávateľ MUDr. Michal Standara (rádiológ). **Tím: Brno 1 (Patrik Vrbovsky).**
- **Problém:** rádiológ, urológ a patológ vidia nádor prostaty rôzne a každý potrebuje spätnú väzbu. Patológ kreslí rozsah nádoru **na papier** (elektronický zákres je nepohodlný) a napíše nález do nemocničného systému; údaje treba dostať do registra COMPARE (REDCap – nástroj na zber dát do registrov).
- **Zadanie:** nástroj **prečíta text histologického nálezu** (vytiahne a dovodí vlastnosti jednotlivých ložísk definované v registri) a **pomocou obrazovej schémy zo skenu určí ich výskyt v segmentoch prostaty**, údaje uloží do registra v REDCap. Pri vývoji sa pracuje s nič nehovoriacim identifikátorom pacienta, v ostrej prevádzke s číslom poistenca.
- **Úspech za 48 h:** nástroj prevedie sken schémy v kontexte textu histológie do parametrickej formy importovateľnej do registra COMPARE.
- **Dáta:** vzorka anonymných schém a textov histologických nálezov (CESNET FileSender), dátový slovník `COMPARE_DataDictionary_2026-09-14.csv` (v Slacku 13:53), prístup do testovacej verzie registra REDCap (správca bude v kancelárii, zadávateľ doručí cez mail/telefón, dnes do večera). Kritériá špecifické nie sú.

### 1.11 EduAIttractive (MOÚ Brno)

Zdroj: Drive PDF (MUDr. Jiří Šedo, Centrum digitálnej medicíny MOÚ; mentor Adam Melničák, platforma Orbiso). **Tím: Brno 1 (JOTOZO & Magdalénka).**
- **Problém:** zdravotníci opakujú tie isté informácie mnohým pacientom, internetové a AI zdroje môžu zavádzať; potrebujú doručiť **obsah, ktorý vedia odborne garantovať**, správnemu pacientovi vo správnom čase.
- **Zadanie:** jednoduchý nástroj, ktorý z odborných podkladov rýchlo vytvorí **krátke profesionálne edukačné videá** (dynamické ilustrácie, animácie, infografika, prípadne zábery osôb). **Úzke hrdlo je čas zdravotníka:** dnes kontroluje celé video veta po vete celé hodiny, cieľ je skrátiť na minúty. Treba: schvaľovanie po scénach a vetách; **každá veta má zdroj** (odkaz na odsek textu alebo časovú značku podcastu, informácie nad rámec zdroja viditeľne označené); oprava iba dotknutej scény (video uložené ako scény s textom, hlasom a obrazom); automatická kontrola (prepis hlasu vs. schválený text, výslovnosť, titulky, vady obrazu); varianty schváleného obsahu (kratšia/dlhšia, jednoduchší jazyk, preventívny/paliatívny tón); prístupnosť pre divákov 60+ (čeština, titulky najviac na 2 riadky, pokojné tempo, kontrast).
- **Výstup:** nástroj na tvorbu a editáciu videí + **aspoň 3 videá** z dodaných podkladov. **Hodnotí sa:** kvalita audiovizuálnych výstupov (profesionálna úroveň) a **čas a náklady** (orientačný počet minút práce zdravotníka a cena v Kč na jednu minútu hotového videa).
- **Podklady:** videopodcasty, texty a letáky; zdravotníci na mieste môžu nahovoriť krátky podcast.

### 1.12 Ostrava (5 výziev, FN Ostrava + FN Olomouc)

Zdroj: Drive decky. Dáta pre FNO/FNOL výzvy dáva Daniel Kutáč (InterSystems, v miestnosti mentorov); dáta k Surgical Copilot sú v Dropboxe (odkazy v #ai-surgical-copilot, tokeny nekopírujem). **Pražský tím si tieto výzvy nevyberie (§2.6), uvádzam ich pre úplnosť.**

1. **Onkologický AI průvodce** (doc. Cvek, FNO; tím Wigym Trio): AI chatbot – bezpečný sprievodca pacienta: odpovedá na časté otázky, vysvetľuje liečbu a nežiaduce účinky, **rozpozná rizikovú situáciu a pošle pacienta k zdravotníkovi**, uvedie zdroj, personalizuje (po napojení na objednávkový systém aj návrh termínu kontroly). Súčasť: dotazník kvality života EQ-5D. **Nie je lekár, nediagnostikuje, nemá si vymýšľať.** Dáta: informačné materiály, odporúčané postupy („Modrá kniha“), EQ-5D, časté otázky, zoznam kontaktov. Prínos: informácie 24/7, menej rutinných telefonátov.
2. **AI asistent multidisciplinárního týmu** (MDT, doc. Cvek; Codebridge, zombie_apocalypse): z lekárskych správ, laboratória, zobrazovania, patológie a genetiky vytvoriť **dva výstupy**: interaktívnu prezentačnú aplikáciu pre MDT (schéma pacienta, súhrn, rozklikávacie údaje, časová os) a **report/PDF** do dokumentácie alebo žiadanky. „Nechceme ďalší systém, kde bude lekár hľadať informácie.“ Dáta: fiktívne zdravotné dokumentácie vzorových onko prípadov + štruktúra MDT protokolu FNO.
3. **Chytřejší plánování onkologického stacionáře** (Mgr. Hajnová Fukasová, FNO, aj porotkyňa; Pokorní vítězové): AI plánovač chemoterapie: predpovedať počet pacientov, odhadnúť dĺžku liečby podľa režimu, optimalizovať rozloženie počas dňa/týždňa, **semafor obsadenosti**, simulácia „čo ak“, dashboard. Vzorová kapacita: 20 kresiel, 6 lôžok, prevádzka 7:00–15:30. Dáta: anonymizované objednávky za 30 dní, aplikačný rozpis chemoterapie.
4. **AI NOR** (Ing. Najbrtová, FNO; zatiaľ bez tímu): automatické vyťaženie údajov z onkologickej dokumentácie do formulára Národného onkologického registra (diagnóza, MKN-10, morfológia, TNM, štádium, liečba, recidíva), so **zdrojom údaja** a kontrolou zdravotníka. Hodnotí sa presnosť, úplnosť, správne priradenie, dohľadateľnosť zdroja, počet opráv, čas na záznam. Dáta: modelové ambulantné a prepúšťacie správy, histológia, ukážka formulára registra, dátový slovník MKN-10.
5. **AI Surgical Copilot** (doc. Študent, FN Olomouc; Prestige, Sněženky a Michal): **z CT do operačného sálu** – z predoperačného CT (DICOM) vysegmentovať oblička/nádor/cievy, urobiť 3D model a **priložiť ho do videa z kamery robota**. Tri úrovne úspechu: (1) segmentácia a 3D model (Dice vs. ručná anotácia), (2) model priložený do videa s pomocou človeka, (3) automatická registrácia a sledovanie (chyba v px/mm, FPS); bonus: fázy operácie z videa. Dáta: 8 anonymizovaných pacientov (video + CT). Prototyp je výskumný, nie zdravotnícky prostriedok. Údaj z decku: 3 224 nových nádorov obličky ročne v ČR (zdroj NOR/ÚZIS uvedený v decku).

---

## 2. Odovzdanie a hodnotenie

Zdroj: **hlavná prezentácia INTRO Praha** (85 strán), ktorú Tomáš Studeník dal do #03-info-praha o 14:25 s poznámkou „Master prezentácie z dopoludnia vrátane hodnotiacich kritérií na sobotné semifinále aj pre nedeľné finále“. Kópia aj textový prepis: `docs/materials/slack/refresh-1600/Rakathon_2026_INTRO_Praha_MASTER.pdf` / `.txt`. Doplnky z `rakathon.cz` [web].

### 2.1 Harmonogram

| Kedy | Čo |
|---|---|
| **Pi 16. 10. 19:00** | Uzávierka výberu výzvy (potvrdzuje kapitán), do tej doby sa dá zmeniť cez odkaz z e-mailu. Večera o 19:00, potom sa hackuje cez noc. |
| So 17. 10. 08:00 | Raňajky a ranný mentoring |
| **So 17. 10. 13:00** | **Odovzdanie projektov – po 13:00 formulár nič neprijme.** |
| So 14:00–16:00 | Hodnotenie – zadávatelia výziev obchádzajú svoje tímy |
| So 16:00 | Zadávatelia nahlásia víťazov, coffee break |
| So 17:00 (do 18:00) | Vyhlásenie víťazov výziev. **Víťaz každej výzvy postupuje do nedeľného finále v Prahe.** |
| **Ne 18. 10.** (Kampus Plzeňská, 2. LF UK, budova A, Plzeňská 130/221, Praha 5 – Motol) | 13:00 registrácia finalistov a kontrola finálových prezentácií; 13:30 príchod finálovej poroty; 13:55 spoločná fotka víťazov a otvorenie; **14:00 finálové pitche (do 16:30) osobne pred porotou**; 17:00 slávnostné vyhlásenie (do 18:00). Finále sa vysiela online na rakathon.cz. |

- „Najlepšie tímy z Prahy, Brna a Ostravy sa **znovu** prezentujú pred hlavnou porotou, ktorá o 17:00 vyberie celkových víťazov.“ [web]
- Pitche sú na slide „14:10–16:30“; pri 23+ víťazoch výziev (plus víťazi VZP výziev z ďalších miest, ak platí pravidlo z `04`) to vychádza zhruba na **5–6 minút na tím vrátane výmeny** [odhad, oficiálna dĺžka nezverejnená]. MDT Copilot uvádza vo svojom zadaní demo max. 5 minút a jeden pacient (špecifické pre túto výzvu).
- Otvorená otázka bez odpovede (13:34, tím Pixel Predators): či po odovzdaní v sobotu o 13:00 môže tím v nedeľu ešte prerábať prácu, alebo je „lock“. [?]
- Cestu na finále organizátori **preplácajú** každému účastníkovi, ktorý príde fandiť (formulár cez QR v slidoch „Přijďte v neděli na finále“). [Drive]

### 2.2 Čo sa odovzdáva (formulár `submit.rakathon.cz`)

1. **Projekt:** názov, krátky popis (do 140 znakov), dlhší popis (nepovinný), v CZ aj EN.
2. **Tím a výzva:** mesto, výzva, názov tímu, e-mail, členovia (2–4).
3. **Dopad a AI:** ako používate AI? aký dopad a pre koho? používate FHIR od InterSystems?
4. **Odkazy a obrázok:** **titulný obrázok povinný** (do 8 MB, 16:9); GitHub, demo, video (z textu nie je jasné, že video/GitHub sú povinné [?]).
- Po odoslaní príde odkaz na úpravy až do uzávierky. Galéria odovzdaných projektov: `submit.rakathon.cz/projects` (zatiaľ 0 projektov). Tím sa zakladá cez `submit.rakathon.cz/tym` a výzva sa volí cez `submit.rakathon.cz/vyzvy/vybrat`.

### 2.3 Hodnotiace kritériá

**Sobota (lokálne, zadávatelia výziev):**
1. **AI technológia a prevedenie** – ako dobre riešenie skutočne funguje, čo tím počas hackathonu naozaj vytvoril, ako kvalitne je technicky spracované vrátane práce s AI a dátami tam, kde sú relevantné.
2. **Využiteľnosť v praxi u zadávateľa výzvy** – ako dobre riešenie zodpovedá zadanej výzve a potrebám používateľa; je realisticky nasaditeľné; zohľadňuje bezpečnosť, dáta, reguláciu alebo integráciu.
3. **Inovatívnosť** – pristupuje tím k problému novým/neočividným spôsobom; prináša oproti bežnému prístupu skutočnú výhodu.

**Nedeľa (finále) pridáva k 1–3:**
4. **Škálovateľnosť** – dá sa riešenie rozšíriť/preniesť mimo jedno nasadenie; reálna cesta k ďalšiemu rozvoju; je reálne, že projekt po hackathone pokračuje.
5. **Kvalita prezentácie a tímu** – jasne ukázal, čo riešenie robí a ako funguje; zrozumiteľné a presvedčivé; je tím motivovaný pokračovať.

Váhy nie sú zverejnené [?]. Výzvy so špecifickými váhami/kritériami: MDT Copilot (30/20/20/15/15 + 10 % bonus), MEDDI ONCO (skrytá testovacia sada), EduAIttractive (kvalita audiovizuálu + čas a náklady), Když realita (5 kritérií v §1.8), InterSystems (4 kritériá v `04`). Zloženie finálovej poroty nie je zverejnené [?]; zo Slacku vieme, že v porote sú Michal Bušek (Asseco) a Erika Hajnová Fukasová (FNO).

### 2.4 Pravidlá v kocke (slide v INTRO)
- Tím 2–4 ľudia, **onsite** (obaja členovia fyzicky na mieste – potvrdil Petr Vaňásek 15:36; sólo hacker môže tím nájsť alebo ho zložia v lobby prízemia, organizátor to navrhol v #06 o 14:39).
- **Jedna výzva na tím** (+ ISC = InterSystems Challenge sa dá pridať).
- Len **prototyp**: nie zdravotnícky prostriedok, nie klinicky overený nástroj.
- **Licencia:** autorstvo zostáva vám, organizátori a partneri dostanú nevýhradnú licenciu.
- **Dáta a know-how:** nezverejňovať neverejné údaje pacientov a know-how partnerov.
- Rozhodnutie poroty je konečné; ceny môžu podliehať zdaneniu.
- Foto/video: profesionálne správanie, **zákaz fotenia v sleeproome**.
- Oficiálny jazyk čeština, pitch môže byť po anglicky.

### 2.5 Ceny (INTRO slidy + `rakathon.cz`)
- Hlavné: 1. miesto **100 000 Kč**, 2. miesto 50 000 Kč, 3. miesto 25 000 Kč (odovzdanie v nedeľu).
- **VZP cena „Křeslo pro inovace“:** 60 minút s generálnym riaditeľom VZP ČR pre najlepší tím výziev VZP.
- **InterSystems:** 1 500 EUR pre jeden víťazný tím (dá sa kombinovať s akoukoľvek výzvou).
- **NÚVR cena:** účasť na Czech Annual Cancer Research Meeting (23.–25. 11. 2026, Olomouc) pre víťaza výzvy NÚVR.
- **FEI VŠB-TUO:** cena dekana za najlepšie technické riešenie, externý disk (~5 000 Kč) pre každého člena (sobota, Ostrava).
- **MEDDI cena:** MEDDI ONCO Award za riešenie s najväčším potenciálom pre prax, možný workshop a proof of concept.
- **Caelestinus cena „Divoká karta“:** priamy vstup do 2027 Batch medzi top 25 startupov zo sveta (organizátor Tomáš Studeník pôsobí v Caelestinus – CNCR.tech).
- **Cena hackerov:** víťaza volia účastníci, pozvánka na masterclass PitchPerfect.cz v hodnote 30 000 Kč (hlasuje sa v Prahe v nedeľu).
- **Asseco CE cena:** rozvoj prototypu s mentormi Asseco CE a kontaktmi v zdravotníctve.

### 2.6 Môže pražský tím zvoliť brnianku/ostravskú výzvu?

- **Formulár to neumožňuje.** `submit.rakathon.cz/vyzvy/vybrat` má polia Názov tímu → **Mesto (Praha/Brno/Ostrava)** → Stôl → Kapitán → Členovia → Výzva. Pri výzve je text „Najprv vyber mesto“ a zoznam sa filtruje na výzvy daného mesta. Pre Prahu je to **12 výziev**: 3 VZP + Trial Matching, MEDDI, PACS Comparator, Hlídač NÚ, NÚVR, Plíce včas, SMART ONCO AA, MDT Copilot, Twincer. Tri VZP výzvy sa v zozname opakujú v každom meste (počítajú sa osobitne). [web]
- Pravidlá: tím je onsite v jednom meste, obaja členovia fyzicky na mieste. Nikto na Slacku výslovne nepovedal, že zmena mesta je zakázaná ani povolená, **nikto sa na to ani nepýtal** [?]. Z toho vyplýva: kto chce Brno/Ostravu, musel by tam byť fyzicky a tím registrovať v tom meste. Na jednoznačnú odpoveď treba spýtať sa organizátorov (Ondřej Baštař – logistika Praha, Tomáš Studeník).
- Brnianski mentori ponúkajú konzultácie k ľubovoľnej výzve v Brne (napr. rádiológ M. Standara), čiže sú to konzultácie len pre brnianske tímy.

---

## 3. Konkurencia podľa výziev

**Zdroj:** živá tabuľa `https://submit.rakathon.cz/vyzvy` (načítaná ~16:00; stránka sa obnovuje sama; `?city=praha` nemá osobitnú stránku, mestá sú v jednej tabuľke), plus kanály výziev a #06-hledam-tym. Uvádzam iba názvy tímov, nie mená ľudí.

### 3.1 Praha: 23 tímov má výzvu, 5 ešte nevybralo (uzávierka 19:00)

| Výzva (Praha) | Tímy | Tímy (názvy) |
|---|---|---|
| Kvalita péče na konci života (VZP) | **0** | – (červená, tím potrebuje) |
| Od pozvánky k mamografu (VZP) | 3 | Titics, mammo_prg, Čímžtopádem Vyléčeno |
| Cesta pacienta bez ztráty informací (VZP) | 2 | MediBit, smetytech. |
| AI Trial Matching (FNMH) | **4** | Compass Crew, Smradi, Pixel Predators, M&A |
| MEDDI ONCO Challenge | 1 | Přemke |
| PACS Comparator Check (FNMH) | 1 | 404: tumor not found |
| Digitální hlídač nežádoucích účinků (FNMH) | 2 | Cheirón, VI KA |
| NÚVR Research Matchmaker | 2 | Remiho klubík, dudes |
| Plíce včas (AstraZeneca) | 1 | MSFZ |
| SMART ONCO AA (VFN) | 1 | Canbe |
| MDT Copilot (Asseco) | 1 | Korex |
| Twincer (Fuck Cancer) | **0** | – (červená) |
| *Ešte nevybrali* | 5 | Ctrl+Alt+CURE, FIT/S, FSMZ (rovnaký stôl a kapitán ako MSFZ, pravdepodobne duplicita), Pražský Meridian, walking legs |

Poznámky:
- Organizátori mali v zozname pražských stanovíšť 24 tímov. **Tieto ešte nie sú na tabuli výzev:** Data Team, Junior Scholars, Nexlytics, Panacea, quattro formaggi, radiQA, Risk off (7 tímov) – takže čísla sa pred 19:00 ešte zmenia (hlavne smerom nahor). Naopak na tabuli sú tímy Titics a Ctrl+Alt+CURE, Pražský Meridian, walking legs, ktoré v zozname 24 neboli.
- Signály zo Slacku (kto sa zaujíma): tím Panacea (zatiaľ nie je na tabuli) vstúpil do kanála „Kvalita péče“ a pýtal sa na dáta v mamografe; tím FIT/S sa zaujíma o SMART ONCO AA a Cesta pacienta; solo hacker z tímu Hyeny hľadal spoluhráča na MDT Copilot (už tím našiel); sólo hackeri sa schádzajú v lobby prízemia. **mammo_prg** (podľa `04`: bioinformatika/ML + backend, CatBoost) už má dáta a výzvu zvolenú a rieši mamograf.
- Čo vyplýva z čísel: **VZP mamograf v Prahe má 3 tímy**, Trial Matching 4. Pri pravidle „víťaz výzvy → finále“ majú výzvy s 0–1 tímom jednoduchšiu cestu do finále (Kvalita péče 0, Twincer 0, PACS 1, MEDDI 1, Plíce 1, SMART ONCO 1, MDT 1). Neistota [?]: nie je jasné, či zadávateľ výzvy pri jedinom tíme musí vyhlásiť víťaza (nikto sa nepýtal).
- Známe tímy z predošlého prehľadu (`04` §7): **mammo_prg** (Praha, mamograf); MEMOyA (Ostrava, MDT/Cesta pacienta) **zatiaľ nie je na tabuli** výziev [?], nie je teda v Prahe.

### 3.2 Brno: 12 tímov (8 z 9 výziev pokrytých)
Od pozvánky k mamografu 1 (Mámo, graf!); Cesta pacienta 1 (Správci Silnic); Když realita 2 (Brainless, Axolotl); PillGaze 3 (Going Bananas, modulBit, bahnaci.cz); ProstaPaper 1 (Patrik Vrbovsky); Vzkazy pro budoucnost 2 (Výherní tým, RationAI); TriaLink 1 (Podbranč); EduAIttractive 1 (JOTOZO & Magdalénka); **Kvalita péče 0**.

### 3.3 Ostrava: 8 tímov (4 z 8 výziev pokryté)
Onkologický AI průvodce 1 (Wigym Trio); AI asistent MDT 2 (Codebridge, zombie_apocalypse); Chytřejší plánování stacionáře 1 (Pokorní vítězové); AI Surgical Copilot 2 (Prestige, Sněženky a Michal); **bez tímu:** Kvalita péče, Od pozvánky k mamografu, Cesta pacienta (všetky 3 VZP), AI NOR. Ešte nevybrali: Až na měsíc, www.pixed.cz.

### 3.4 VZP výzvy celkovo (3 mestá spolu)
Mamograf 3+1+0 = 4 tímy; Cesta pacienta 2+1+0 = 3 tímy; **Kvalita péče 0+0+0 = 0 tímov**. VZP cena „Křeslo pro inovace“ ide najlepšiemu tímu z VZP výziev.

---

## 4. Odkazy na Drive / prezentácie (zoznam pre iného agenta)

**Koreňový verejný priečinok (všetky prezentácie z dopoludnia, Petr Vaňásek, #01-oznameni 13:43):**
https://drive.google.com/drive/folders/1tM6p2V4plY4FXScZTXNmPDNgg0PDoJkr

Podpriečinky:
- Praha: https://drive.google.com/drive/folders/1h8aMcVvplz3BpmY1RZMV75QE4b0o97S-
- Brno: https://drive.google.com/drive/folders/1PFoLFmYLlGcLQnidTJ6OqDYGIBxojsCq
- Ostrava: https://drive.google.com/drive/folders/1blfM24tcomYNP_Edamhc59TWN4a8ntQ_

**Ako ich čítať:** Google Drive konektor `read_file_content` s ID súboru (pozri URL `/file/d/<ID>/view`) vráti text prezentácie. Okrem VFN SMART ONKO AA fungovali všetky. Zoznam priečinka sa dá získať bez prihlásenia cez `https://drive.google.com/embeddedfolderview?id=<ID priečinka>`.

### 4.1 Priečinok Praha

| Súbor | URL | Obsah / stav čítania |
|---|---|---|
| VZP – Od pozvánky k mamografu.pptx | https://drive.google.com/file/d/1jpN3tlCxpvTmsduJL3Ogkb1qC5b-pguf/view | Zadanie mamograf (12 slidov): čísla 2024, 4 úlohy, segmenty, výstupy, dopad. **Prečítané** (§1.2) |
| VZP – Kvalita péče na konci života.pptx | https://drive.google.com/file/d/1kA6iKeDJ9EX7VanWXOtgi1LEyI9gs3bm/view | Zadanie (11 slidov). **Prečítané** (§1.1) |
| VZP – Cesta pacienta bez ztráty informací.pptx | https://drive.google.com/file/d/1kjyKaGu0UTa6F5_ew7VxNxpUz6wrwOXj/view | Zadanie (13 slidov), 4 kroky, demo. **Prečítané** (§1.3) |
| Astra_Plicee_Rakathon_prim.Čierná Peterová.pptx | https://drive.google.com/file/d/16yUnx85Hu-Kwpt7sUdV-VW36IKepQlAy/view | Plíce včas: kritériá zaradenia/vylúčenia, výzva (4 slidy). **Prečítané** (§1.4) |
| NÚVR – Research Matchmaker.pptx | https://drive.google.com/file/d/1j1U1jmJ666aH2-3bFOBSh1bAAHKa4Ruq/view | NÚVR zadanie (6 slidov). **Prečítané** (§1.5) |
| VFN – SMART ONKO AA.pptx | https://drive.google.com/file/d/1_Z654kP1TFtO9teie0KasDZVk1qZFLBU/view | SMART ONCO AA, **66 MB, text sa nedal načítať, treba pozrieť vizuálne** [?] (§1.6) |
| MDT_Copilot_zadani_upravené_2026_v02.pptx | https://drive.google.com/file/d/1TdVOrigp1Pur2JmcGl0OAc64b_LF5fPp/view | Zadanie MDT Copilot (už je v repe: `docs/materials/slack/mdt-copilot/`). Neprečítané znova |
| Asseco_keynote_v03_MB.pptx | https://drive.google.com/file/d/1x1IrNcV4KEdqiFnfataEhVZlj2k4pOhv/view | Keynote Asseco CE: OnkoAsist, čas liečby (BMJ 2020), MDT Copilot, cena Asseco. **Prečítané** (§1.7) |
| MEDDI_Onco_Rakathon_2026.pptx | https://drive.google.com/file/d/1ozmZmwRXvcJiJs9aSg2ZT7SjA5ORQrNZ/view | Keynote MEDDI: koordinácia starostlivosti, „AI spoločník medzi kontrolami“. **Prečítané** (bez nových kritérií) |
| MEDDI – MEDDI Onco.pdf | https://drive.google.com/file/d/1UFHs13Muitry1SEXqPRqw6eFJmXJ5bvL/view | Produktový podklad MEDDI. Neprečítané [?] |
| Alina_FNMH_Rakathon výzvy – onkologie FNM.pdf | https://drive.google.com/file/d/1VKP3UXN5p_YmiqrtI4gq-RnRUF5xZQ1O/view | 3 výzvy FNMH (už v repe: `docs/materials/slack/fnm-motol-vyzvy/`) |
| Fuck Cancer – CancerTwin.pdf | https://drive.google.com/file/d/1D7aK5in0E4rOc-Q1qzx5ofP9ZkuWwWs6/view | Twincer (už v repe: `docs/materials/slack/twincer/`) |
| InterSystems Keynote.pptx | https://drive.google.com/file/d/1yAc3qi20PmEi5Udfay5den7QKKmONlb2/view | Keynote InterSystems. Neprečítané [?] |
| Rakathon 2026 InterSystems Challenge Intro.pptx | https://drive.google.com/file/d/1BuTChiXUgJM1sMzhNtVhlwUl9XXTfMny/view | InterSystems Challenge: 1 500 EUR, RAG, agentný prístup, FHIR server, **kto dáva dáta v ktorom meste**, mentori (aj online 24/7). **Prečítané** (§5) |

### 4.2 Priečinok Brno

| Súbor | URL | Obsah / stav |
|---|---|---|
| Když realita překoná prognózu.pdf | https://drive.google.com/file/d/1yj4tnTmTNf-vidf5ZgoXoI0Fvs6T8y3n/view | Zadanie + štruktúra CSV. **Prečítané** (§1.8) |
| MOÚ – PillGaze.pptx | https://drive.google.com/file/d/1UvMHWw9AUr2C98xYS2Ost3IKhbhNBedK/view | Zadanie PillGaze (18 slidov). **Prečítané** (§1.9) |
| ProstaPaper_zadání.pptx | https://drive.google.com/file/d/1IE6ETWQ5uwkWKeIoPIYiVB85GViu-Daf/view | Zadanie ProstaPaper (11 slidov; obsahuje kontakt na autora, nekopírované). **Prečítané** (§1.10). Originál (14,9 MB), ktorý sa zo Slacku nedal stiahnuť, je cez Drive konektor čitateľný |
| MOÚ – EduAIttractive.pdf | https://drive.google.com/file/d/1iP2T0Dp2TCyXR2CMM_EKGw-_KyDUdhh2/view | Zadanie EduAIttractive. **Prečítané** (§1.11) |
| FN Olomouc – Vzkazy pro budoucnost (Schránka vzpomínek).pptx | https://drive.google.com/file/d/1slFt7v_NYwUQj7KNbhJVDT2qxkumFlrL/view | Zadanie Vzkazy pro budoucnost (v repe už je canvas + 9 PNG). Neprečítané znova |
| Rakathon 2026 InterSystems Challenge Intro.pptx | https://drive.google.com/file/d/1DyreWTkBK9n1bXnugr-AF8C3jKKe_uR5/view | Rovnaký deck ako Praha, s brnianskou slide o prístupe k dátam |

### 4.3 Priečinok Ostrava

| Súbor | URL | Obsah / stav |
|---|---|---|
| 1 – FN Ostrava – Onkologický AI průvodce.pptx | https://drive.google.com/file/d/1QlUR289pRB5iDS5mgY1dsA7yq0LhqyOE/view | **Prečítané** (§1.12) |
| 2 – FN Ostrava – AI asistent multidisciplinárního týmu.pptx | https://drive.google.com/file/d/1jfyTMIPGVjZd_iDhfDH1KMev9FiPfboN/view | **Prečítané** (§1.12) |
| 3 – FN Ostrava – Chytřejší plánování onkologického stacionáře.pptx | https://drive.google.com/file/d/1Ew4PFs1yxQ1-x1FyXaDnMXvvWsBJ7f2k/view | **Prečítané** (§1.12) |
| 4 – FN Ostrava – AI NOR.pptx | https://drive.google.com/file/d/1KygyqRIrCiicGsRlyWrExSLDgHARZcNZ/view | **Prečítané** (§1.12) |
| 5 – Surgical Copilot – Rakathon.pptx | https://drive.google.com/file/d/1Xvvsk0ln_h1ANK09xBocCCTuTjBARrX0/view | **Prečítané** (§1.12; 15 slidov, obsahuje kontakt na autora, nekopírované) |
| 6 – Rakathon 2026 InterSystems Challenge Intro.pptx | https://drive.google.com/file/d/1YoVGmAPWYJd7-szvPm33s5Mz1_wvIbKr/view | Deck InterSystems (ostravská verzia) |
| videoklip_FNO_2026.mp4 | https://drive.google.com/file/d/1hYqD5-wi974BzwlNi94_GnP1pd-t4vUY/view | Video FNO. Neotvorené [?] |
| VZP – Cesta pacienta bez ztráty informací.pptx | https://drive.google.com/file/d/1lTDYVQCjGDGXXvA1QhPPieqAlDZHXoQ9/view | Kópia VZP decku |
| VZP – Kvalita péče na konci života.pptx | https://drive.google.com/file/d/1K2xNaNYWJNRtaRxPVq2MOySRyPPdOWHN/view | Kópia VZP decku |
| VZP – Od pozvánky k mamografu.pptx | https://drive.google.com/file/d/1_V-MAANV0HgykSPepoLrx-9NaI4grwC4/view | Kópia VZP decku |

### 4.4 Ďalšie Google odkazy zo Slacku
- **Google Doc – VZP „Kvalita péče“: datový slovník, vysvetlivky, indikátory:** https://docs.google.com/document/d/1gxd3RN6-dgK1n6Jloo1RqFJFGc7Zn1Fj/edit (mentorka Kateřina Holá, 14:45). **Prečítané** (§1.1).
- **Google Form na prístupy do Azure a Portálu účastníka** (vypĺňa kapitán; Martin Lahučký rozosiela prístupy e-mailom): https://docs.google.com/forms/d/e/1FAIpQLSf1VMrm0_yKuMlcjHHfk1_-P9y-umerbnUosX73bwmu70XcWQ/viewform
- Verejné dáta k Kvalite péče: https://onconet.cz/cs/data/otevrena-data-diagnozy/

### 4.5 Hlavná prezentácia INTRO Praha (nie je na Drive, len ako Slack súbor)
Slack súbor `F0C9CH0RUEB` „Copy of Rakathon 2026 – INTRO (Praha).pdf“ (7 MB, 85 strán, #03-info-praha 14:25). Obsah: program, partneri, VZP/pražské výzvy, ceny, sobota (odovzdanie a hodnotenie), formulár na odovzdanie, kritériá sobota/nedeľa, pravidlá, finále, tím organizátorov, Slack. **Prečítané** (§2). Kópia v repe: `docs/materials/slack/refresh-1600/`.

### 4.6 Súbory nahrané zo Slacku po 13:00 a uložené v repe (`docs/materials/slack/refresh-1600/`)
- `Rakathon_2026_INTRO_Praha_MASTER.pdf` + `.txt` (prepis)
- `plice-vcas_README.pdf`
- `kdyz-realita_Vyzva_KDO_Outlier.docx`
- `pillgaze_RAKATHON_2026_MOU_Rusinko.docx`
- `cesta-pacienta_Zadani_ulohy.docx`, `cesta-pacienta_Handover_obsah.docx`, `cesta-pacienta_MDT_zapis_sablona.docx`

Dátové balíky (CSV, fiktívne/anonymizované) som **do repa nekopíroval** (pravidlo: žiadne údaje pacientov do gitu). Sú v Slacku: `release_fin.zip` (F0C9NDTCQAZ, #kdyz-realita-prekona-prognozu), `cesta-pacienta-data.zip` (F0CAN57HADN), 5 CSV Plíce (ID v §1.4), `COMPARE_DataDictionary_2026-09-14.csv` (F0C9RN6ML7Q, #prostapaper).

---

## 5. Ostatné novinky

**Prístupy a technika**
- **Azure + Portál účastníka:** kapitán vyplní Google Form (§4.4), prístupy príde e-mailom. Do 15:44 sa ozvali 3 pražské tímy (mammo_prg, 404: tumor not found, Canbe), že ešte nič nedostali; Martin Lahučký žiada, aby sa ozvali. Riziko pre nás: treba formulár vyplniť čo najskôr.
- **GitHub Copilot ($100 kredit):** cez `aka.ms/rakathon2026/github` sa vytvorí pozvánka do GitHub organizácie, tú ale treba **ešte prijať priamo na GitHube**, až potom sa Copilot sprístupní (Vladimír Mach, MSFT, 15:43). Tým, ktorým pozvánka nepríde, žiadal o 13:57 poslať GitHub handle v súkromnej správe.
- **VZP dáta** sú v Azure; **Jan Bartyzal** (cloud za VZP) a **Helena Damovská** sú v Prahe v prízemí za výťahom.
- **InterSystems:** dáta k FNMH výzvam, MDT Copilot a SMART ONCO AA cez mentora (Praha: Ondřej Hoferek, Gabriel Ing); pre brnianske výzvy kontaktovať zadávateľov; dáta VZP sú v Azure. Online mentori InterSystems 24/7: pi 20:00–24:00 Henry Hamon Pereira, so 0:00–4:00 José Roberto Pereira, so 4:00–8:00 Semen Makarov. Hlavný kanál #best-use-of-intersystems-technology-for-ai-and-fhir.
- **Microsoft mentori (#07):** Michal Marusan (AI aplikácie, Azure, GitHub Copilot, architektúra, prototyp), Olena Vasylenko (softvérová inžinierka s biologickým zameraním, pracovný jazyk EN), Bernardo Sunderhus (frontend/React/UX, len po anglicky).
- **Nový mentor s pohľadom poisťovne:** MUDr. Albert Štěrba (neurochirurg, predseda spolku Mladí lékaři, člen dozornej rady VZP) – ponúka overiť, či nápad rieši skutočný klinický problém, ako zapadne do prevádzky nemocnice a **čo ho čaká na ceste k pacientom až po úhradu zo zdravotného poistenia**. Dostupný online/Praha cez #07-hledam-mentora. Zaujímavé pre zámer „niekto by za to zaplatil“.
- **Mentori v Prahe:** Alina Pirshtuk (FNMH) je dnes v miestnosti pre mentorov (15:57); k FNMH dátam ju (v Slacku) môžu kontaktovať ďalší lekári Dr. Škrobánek a Dr. Klimeš Lipánová.

**Organizácia**
- 15:35–15:36: organizátori poslali do #03/#04/#05 pripomienku „It is time to strategize“: kapitán nech vyberie výzvu na `submit.rakathon.cz/vyzvy/vybrat`, kto je sólo, nech nájde partnerov (2–4) a založí tím na `submit.rakathon.cz/tym`, **uzávierka dnes 19:00**, výzvu možno do tej doby zmeniť; červené výzvy čakajú na tím.
- Obed v Prahe sa vydával dole v bistre do 14:30; večera o 19:00.
- Sólo hackeri v Prahe: stretnutie v lobby na prízemí (návrh Ondřeja Baštařa 14:39).
- Ostrava: parkovanie cez noc v areáli – treba nahlásiť ŠPZ; občerstvenie pri hackerspacoch na 4. poschodí.
- Min. 2 ľudia na tím (Vaňásek: „Min 2 lidi“).
- **Všeobecné pravidlá z live programu sú teraz aj písomne** (INTRO slid „Pravidla v kostce“, §2.4).

**Zhodnotenie vplyvu na rozhodnutie (iba fakty, bez odporúčania)**
- Nové dôležité fakty pre výber výzvy: (a) kritérium „využiteľnosť v praxi u zadávateľa“ hodnotí **priamo zadávateľ výzvy pri obchôdzke**; (b) VZP cena a víťaz z každej výzvy; (c) najmenej tímov majú Kvalita péče (0) a Twincer (0), pri 1 tíme sú PACS, MEDDI, Plíce, SMART ONCO AA, MDT Copilot; (d) mamograf má už dáta a 3 tímy v Prahe (aj skúsený mammo_prg); (e) Kvalita péče pracuje s **verejnými dátami** (NOP online) a dá sa rozbehnúť bez čakania na Azure; (f) pri Plíciach sú jasne definované výstupné stavy (`ELIGIBLE` atď.) a 300 syntetických pacientov, v Prahe je tu zatiaľ jeden tím (MSFZ); (g) pri Cesta pacienta je konkrétna **fiktívna pacientka a presné odovzdávané výstupy** (najkonkrétnejšie zadanie zo všetkých).

**Otvorené otázky (nezodpovedané ku ~16:00) [?]**
1. Oficiálna dĺžka nedeľného pitchu a formát (len slidy, alebo aj živé demo/video).
2. Či pri VZP výzvach postupuje víťaz z každého mesta (tvrdenie z `04`), alebo jeden víťaz za výzvu (INTRO slid hovorí „víťaz každej výzvy“).
3. Či pražský tím môže mať výzvu z iného mesta (formulár to nedovoľuje, pravidlo nie je napísané).
4. Či je po sobotnom odovzdaní „lock“ práce pred nedeľným finále (otázka Pixel Predators bez odpovede).
5. Čo presne je povinné pri odovzdaní okrem titulného obrázka (GitHub/demo/video).
6. SMART ONCO AA: text zadania a dáta (66 MB obrázkový pptx).
7. MDT Copilot: dáta (mock eZdravie, PROMs, guidelines, štúdie) – dáva ich InterSystems mentor.
8. NÚVR: odkiaľ sú dáta o tímoch a pre koho je nástroj (vedenie NÚVR vs. výskumníci) – otázka bez odpovede.
9. Mamograf: test/holdout sada na porovnanie tímov a či dáta obsahujú históriu predošlých pozvánok/SMS (otázky bez odpovede).
10. Plíce včas: pack-years sa v decku nezohľadňujú, v README je stav `EXCLUDED_PACK_YEARS`.
