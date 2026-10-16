# Praha – AI Trial Matching (FN Motol a Homolka): hĺbková analýza výzvy

_Stav: piatok 16. 10. 2026, cca 16:30. Slack iba čítaný, nič sa neposielalo ani necommitovalo. Web search sa v tomto behu vyčerpal (limit zdieľaný medzi agentmi), preto sú niektoré čísla označené ako sekundárne._

_Značky: **[V]** overené v primárnom zdroji alebo priamo v súbore, **[S]** sekundárny zdroj (novinový výťah, abstrakt, údaj firmy), **[odhad]** môj záver z faktov, **[?]** neisté alebo nezaznelo. Odborné pojmy sú vysvetlené v zátvorke. Mená uvádzam len pri rolách mentorov, žiadne kontakty._

---

## 0. Zhrnutie na jednu obrazovku

- **O čo ide jednoducho:** v Motole práve beží **76 klinických štúdií** (výskumné programy, v ktorých pacient dostane nový liek skôr, než je bežne dostupný). Lekár má na pacienta pár minút a nikto nemá v hlave 76 protokolov po 20–50 podmienok. Zadávateľka chce systém, ktorý ju **upozorní, že pacient do štúdie pasuje, skôr než ju to napadne**. [V: zadanie, súbor `Rakathon_vyzvy_onkologie_FNM.pdf`]
- **Problém je reálny a doložený:** do štúdie sa dostane ~8 % pacientov, u 55,6 % štúdia na ich pracovisku vôbec nie je dostupná (Unger 2019). AI párovanie funguje v testoch (TrialGPT 87,3 % presnosť pri jednotlivých podmienkach). Za trh sa platí: Tempus kúpil Deep 6 AI (marec 2025), Triomics získal 22 mil. USD (máj 2026). [V/S, §3]
- **Čo je na výzve slabé pre nás:** (1) **najhustejšia konkurencia v Prahe: 4 tímy už vybrali túto výzvu**, medzi nimi tím s názvom Pixel Predators (rovnaký názov ako víťaz 2025, či sú to tí istí ľudia, nevieme [?]); (2) **dáta ešte nie sú v Slacku**, dostať ich treba od InterSystems mentora; (3) **zoznam štúdií obsahuje len názvy, nie podmienky zaradenia**, tie treba dohľadať v registroch; (4) **nie je dodaná žiadna "správna odpoveď"** (ktorý pacient patrí do ktorej štúdie), takže presnosť sa nedá objektívne zmerať.
- **Skóre: 5,9 / 10** (vážený priemer 15 kritérií, §7). Je to **stredne atraktívna voľba**: silný problém, výborný partner (FNMH má v porote IT námestníka), jednoduché demo za noc, ale slabé šance vyhrať výzvu a zatiaľ neistá dátová základňa.
- **Ak by sme ju brali:** staviame **"ranný radar" (systém sám zaklope na plece), nie ďalšie vyhľadávanie**. Výsledok je zoznam pacientov na zajtra s priloženými zelenými, žltými a červenými štúdiami, dôkazom z lekárskej správy a zoznamom chýbajúcich údajov. Odlišujeme sa dvoma vecami, ktoré zadávateľka sama spomenula: **upozornenie bez vyhľadávania** a **odporúčanie do iných pražských nemocníc** (§5).

---

## 1. Presné zadanie

### 1.1 Čo chce zadávateľ (výstup)

Zdroj: slajdy zadávateľky MUDr. **Aliny Pirshtuk** (Onkologická klinika FNMH), súbor `docs/materials/slack/fnm-motol-vyzvy/Rakathon_vyzvy_onkologie_FNM.pdf`, dostala ho aj kanál `#ai-trial-matching` (16. 10. 12:49). [V]

**Čo má nástroj urobiť:**
1. Previesť **kritériá zaradenia a vyradenia štúdie** (inclusion/exclusion criteria: podmienky, ktoré pacient musí splniť, resp. nesmie mať) do **strojovo spracovateľnej podoby**.
2. Porovnať ich s **anonymizovanými údajmi pacienta**.
3. Pri každom výsledku **vysvetliť mieru zhody** a upozorniť na **chýbajúce alebo nesplnené podmienky**.

**Čo má vzniknúť (3 výstupy):**

| Výstup | Podľa zadania |
|---|---|
| Štruktúrované kritériá | každé kritérium zaradenia a vyradenia v strojovo spracovateľnej podobe |
| Miera zhody | "pre pacienta a štúdiu prehľadné skóre zhody, **nie len odpoveď áno či nie**" |
| Vysvetlenie | pri každom výsledku dôvod: kritérium **splnené / nesplnené / údaj chýba** |

**Veta, ktorá rozhoduje (doslova z rámčeka "Čo reálne chceme"):** nástroj má upozorniť, že pacient spĺňa kritériá klinickej štúdie **ešte skôr, než nás to napadne**. [V] Z toho plynie dôležitý záver: zadávateľka nechce ďalší vyhľadávač, kde si lekár vyberie štúdiu a pacienta, ale **systém, ktorý sa ozve sám**.

**Doplnok mentorky v kanáli (12:54):** bolo by dobré hľadať štúdie aj v **iných pražských nemocniciach**. Jedna štúdia môže bežať v Motole aj vo FTN, niekedy len vo VFN, "a my v Motole o tom nemusíme vědět". Cieľ je **odkázať pacienta na iné pracovisko**. [V: Slack]

### 1.2 Dáta, ktoré dostaneme (a ktoré nie)

**A) Spoločný dataset FNMH (rovnaký pre 3 výzvy FNMH)** [V: PDF]
- **Obsahuje:** anonymizované lekárske správy, textové popisy CT (slovné opisy, nie snímky), laboratórne výsledky, vykázané výkony a lieky, ďalšie dáta z nemocničného systému (NIS) o **aktuálne liečených onkologických pacientoch**.
- **Neobsahuje:** snímky ani prístup do ePACS (archív snímok).
- **Kde dataset je:** v Slacku **nie je**. Mentorka trikrát napísala (12:59), že dataset treba vypýtať od **Ondřeja Hoferka (InterSystems mentor, Praha)**. [V: Slack] Formát, počet pacientov, diagnózy a či ide o skutočné anonymizované alebo syntetické záznamy: **nevieme [?]**.

**B) Zoznam štúdií s aktuálnym náborom** (`Seznam_studii_FNMH.xlsx`, lokálne `docs/materials/slack/ai-trial-matching/`) [V: prečítané]
- **76 štúdií** (nie "~90", ako sa uvádza inde; presný počet riadkov so štúdiou som spočítal).
- Stĺpce: interné číslo (KHL-rok-poradie), rok otvorenia, protokol, zadávateľ (sponzor), názov, liek, fáza, diagnóza, skúšajúci lekár, koordinátor.
- **Rozdelenie podľa oblasti:** gynekológia a prsník 23, urológia 21, tráviaci trakt (GIT) 12, hlava a krk 8, lymfómy 8, pľúca 1, ostatné 3 (vrátane 2 štúdií na kachexiu, t. j. chradnutie pri rakovine).
- **Podľa diagnózy:** prsník 16, prostata 11, oblička 9, zvyšok kolorektál, pankreas, žalúdok, žlčovody, vaječníky, endometrium, lymfómy, hlava a krk.
- **Fáza:** 61 × fáza III, ostatné II/III, II, I.
- **Zdroj sponzorov:** typicky veľká farma (MSD 19 štúdií, ďalej Pfizer, AstraZeneca, Daiichi Sankyo, Novartis, BMS, GSK...).
- **Dôležité obmedzenie:** zoznam obsahuje **iba názov a základné údaje, nie text kritérií zaradenia/vyradenia**. Pri každej štúdii je teda potrebné **kritériá dohľadať v registroch** (ClinicalTrials.gov, euclinicaltrials.eu). Pri 36 z 76 štúdií je názov po anglicky. Pri 75 zo 76 je uvedený skúšajúci lekár a koordinátor (znalosť o štúdii je teda rozdelená medzi mnoho ľudí).

**C) Verejné registre, ktoré zadanie výslovne uvádza** [V]
- **ClinicalTrials.gov** (v zadaní), **euclinicaltrials.eu** (odkaz od mentorky 16:15), inšpirácia: zoznam štúdií MOÚ (`mou.cz/klinicke-studie/t1520`).
- **Overil som, že ClinicalTrials.gov má verejné API** (rozhranie bez kľúča): textové pole `eligibilityCriteria` (kritériá ako jeden odsek textu), štruktúrované polia (min. vek, pohlavie) a zoznam pracovísk s mestom. Vyhľadávanie dnes (16. 10. 2026) vrátilo **161 nábor otvorených štúdií na rakovinu s pojmom "Prague" v lokalite** a 233 s "Czechia" (približné, závisí od spôsobu vyhľadávania). [V: vlastný dotaz na `clinicaltrials.gov/api/v2`]
- **Pozor na mapovanie:** pri teste dvoch protokolov zo zoznamu jeden (`MK-5684-003` → NCT06136624) sedel presne, druhý (`DS8201-724`) vrátil inú štúdiu. Dohľadanie podľa čísla protokolu preto treba robiť aj podľa názvu a sponzora a **overiť ručne**. [V: vlastný test, vzorka 2]
- Príklad veľkosti kritérií: jedna testovaná štúdia (NCT06136624) má v registri ~17 podmienok zaradenia a ~33 podmienok vyradenia, text má 6–7 tisíc znakov. [V]

### 1.3 Kritériá hodnotenia a odovzdanie (platí pre všetky výzvy)

Zdroj: `Rakathon_2026_INTRO_Praha_MASTER.txt`, `05-slack-refresh.md`. [V]
- **Výber výzvy:** kapitán dnes **do 19:00** na `submit.rakathon.cz/vyzvy`. **Odovzdanie: sobota 17. 10. 13:00, tvrdý deadline.**
- **Čo odovzdať:** názov, popis do **140 znakov**, dopad a AI (vrátane otázky, či použijete FHIR od InterSystems), **povinný titulný obrázok 16:9 do 8 MB**, odkazy na GitHub, demo, video.
- **Sobota (miestne kolo):** o 14:00–16:00 zadávatelia výziev **obchádzajú tímy**, o 16:00 nahlásia víťaza. **Víťaza FNMH výzvy teda efektívne vyberá zadávateľka (alebo jej tím)**, nie anonymná porota. Víťaz ide do nedeľného finále. Kritériá: **1. AI technológia a prevedenie, 2. využiteľnosť v praxi u zadávateľa, 3. inovatívnosť.** Váhy nie sú zverejnené.
- **Nedeľa (finále, Kampus Plzeňská, Motol):** 14:00 pitche pred porotou; pribudnú **4. škálovateľnosť a 5. kvalita prezentácie a tímu.** V nedeľnej porote sedí **Miroslav Pavlíček (IT námestník FNMH)**. [V: 09]
- **Pre túto výzvu špecifické kritériá nie sú** (mentorka žiadne nepridala). [V]
- **Pravidlá, ktoré sa týkajú nás:** len prototyp (nie zdravotnícky prostriedok), žiadne skutočné dáta pacientov mimo dodaných, hodnotí sa len to, čo vzniklo počas hackathonu (starší kód treba deklarovať). [V: 09]
- **Cena InterSystems (1 500 EUR)** sa dá kombinovať s ľubovoľnou výzvou. Slajd InterSystems radí Trial Matching do skupiny **"nájsť súvislosti: vector search / RAG"** (vyhľadávanie podľa významu textu a odpovede podložené nájdenými zdrojmi). [V]

### 1.4 Mentori a ľudia

| Kto | Rola | Poznámka |
|---|---|---|
| **MUDr. Alina Pirshtuk** | zadávateľka, garantka a mentorka všetkých 3 výziev FNMH | od 15:57 sedí v miestnosti pre mentorov, "first come first serve", večer do 19–20 h online, zajtra znova; kontakt na ňu je v Slack kanáli |
| MUDr. Pavel Škrobánek, MUDr. Michaela Klimeš Lipánová | ďalší lekári, na ktorých mentorka odkazuje | [V: Slack] |
| **Ondřej Hoferek** (InterSystems, Praha) | **dáva dataset** | aj Gabriel Ing (InterSystems, Praha) [V: 05] |
| Tomáš Panský | mentor FNMH | [V: 04] |
| Miroslav Pavlíček | FNMH, IT námestník, **nedeľná porota** | [V: 09] |

### 1.5 Čo o zadaní nevieme [?]
1. Formát a veľkosť datasetu, či sú pacienti skutoční alebo syntetickí, aké diagnózy pokrýva (pokryje 76 štúdií?).
2. Či existujú **overené príklady** (pacient X bol do štúdie Y zaradený), ktoré by slúžili ako "správna odpoveď".
3. Kto v nemocnici dnes zisťuje vhodnosť pacienta (lekár, koordinátor) a kedy.
4. Či sa dá používať LLM cez Azure na týchto dátach (platí všeobecne prostredie organizátora, 03).

---

## 2. Koncový užívateľ: kto to bude používať a aký má deň

> Nižšie je **rekonštrukcia z podkladov a z logiky onkologickej ambulancie, nie rozhovor s lekárom**. Čo je domnienka, je označené. Správnosť treba overiť u Aliny (otázky v §9).

### 2.1 Kto
1. **Študijná koordinátorka / koordinátor (study coordinator)**: zdravotník (často sestra), ktorý pri každej štúdii vedie administratívu, kontroluje, či pacient spĺňa podmienky, objednáva a zapisuje. V zozname je uvedený pri 75 zo 76 štúdií. **To je primárny používateľ**: jej práca je presne "vyhľadať pacienta pre štúdiu".
2. **Ošetrujúci onkológ / skúšajúci lekár (investigator)**: v ambulancii vidí pacienta, rozhoduje o ďalšej liečbe a môže ho do štúdie poslať. Zadávateľka sama je takýto lekár.
3. **Pacient** (sekundárne): chce poznať možnosti, no do výberu zvyčajne nevstupuje. Zadanie na neho nemieri (na rozdiel od brnianskeho TriaLinku).

### 2.2 Aký má deň (rekonštrukcia) [odhad]
- **7:30–8:00** Ambulancia: 20–30 pacientov na lekára, pár minút na každého. Pri kontrole sa rozhoduje "čo ďalej": nová línia liečby, progresia (rakovina rastie), výsledky z patológie.
- **V hlave lekára**: pozná zopár štúdií, kde je skúšajúcim. Ostatných ~70 protokolov (ďalších 100+ strán každý) si nepamätá, protokoly sa **menia dodatkami (amendments)**. Zoznam štúdií sám o sebe je **Excel** s názvom a diagnózou, bez podmienok.
- **Koordinátorka**: ak jej lekár povie "máme pre ňu niečo?", otvára protokol, porovnáva s dokumentáciou v NIS, obvoláva, čaká na laboratórne hodnoty. Mayo Clinic nameralo pri **ručnom preverení jedného pacienta v priemere ~30 minút** (rozsah 5–75), s AI nástrojom ~10 minút. [S: abstrakt ESMO 2019, tam aj ~2 nájdené štúdie na pacienta ručne vs. ~7,7 s AI; originál sa mi nepodarilo otvoriť]
- **Rozhodujúce okno:** pri štúdiách pre pacientov **bez predchádzajúcej liečby alebo v prvej línii** (aspoň **14 zo 76 názvov** to uvádza výslovne, hrubé vyhľadanie v názvoch) sa možnosť **definitívne stratí, keď štandardná liečba začne**. Ak sa nikto nezamyslí v deň, keď sa liečba rozhoduje, štúdia pre pacienta zanikne. [odhad z názvov štúdií]

### 2.3 Čo ho bolí a prečo dnešný stav zlyháva
| Bolesť | Prečo dnešný stav zlyháva |
|---|---|
| "Nenapadne nás to" | Detekcia stojí na pamäti lekára. Zadávateľka to hovorí sama: "ještě dříve, než nás to napadne". |
| **Údaje sú v texte**, nie v poliach | Biomarkery (napr. mutácia KRAS G12C), počet predchádzajúcich línií liečby či stav pacienta (ECOG: škála 0–5, ako zvláda bežné dni) sú v lekárskej správe vo voľnej češtine. V analýze 20 onkologických štúdií fázy III sa **81 % podmienok dalo nájsť v zdravotnej dokumentácii**, z toho **31 % len vo voľnom texte** (nie v štruktúrovaných poliach). [S: ISPOR 2022, malá vzorka] |
| **Veľa podmienok** | Medián **21 kritérií na štúdiu** (rozsah 7–51) v tej istej analýze; testovaná štúdia mala ~50. Pri 76 štúdiách je to tisíce podmienok. [V/S] |
| Ručné preverenie trvá | ~30 minút na pacienta (Mayo, jeden abstrakt). [S] |
| Vidí len svoju nemocnicu | Mentorka: štúdia môže bežať vo VFN alebo FTN a Motol o tom nevie. Unger 2019: u 55,6 % pacientov štúdia na pracovisku vôbec nebola k dispozícii. [V/S] |
| Existujúce nástroje sa musia **ručne vyplniť** | Pacientske vyhľadávače (Klineo, trialing.org) čakajú, že človek profil naklikne. To je ten istý problém: "kto si na to spomenie". [S] |
| Únava z upozornení | Mentorka pri výzve s nežiaducimi účinkami opakovane povedala: "ihneď o závažných, nie o každej drobnosti". Platí aj tu: ping iba pri pravdepodobnej zhode. [V: 04/05] |

**Čo by používateľ povedal (parafráza, nie citát):** "Ja nechcem otvárať appku a hľadať. Ráno mi stačí zoznam: tento pacient, táto štúdia, toto vám ešte chýba."

---

## 3. Dôkazy o probléme: čísla a štúdie

| # | Údaj | Zdroj | Istota |
|---|---|---|---|
| 1 | **Do klinickej štúdie sa dostane 8,1 % pacientov.** U 55,6 % štúdia na ich pracovisku nebola dostupná, 21,5 % nebolo vhodných, 14,8 % sa nezapojilo. Metaanalýza 13 štúdií, 8 883 pacientov (Unger, JNCI 2019). **Poznámka:** najväčšia prekážka je dostupnosť štúdie na pracovisku, nie vhodnosť. AI preto najviac pomôže tam, kde vie **odkázať pacienta inam**, čo presne chce mentorka. | https://doi.org/10.1093/jnci/djy221 ; výťah: https://www.fredhutch.org/en/news/center-news/2019/02/patient-barriers-to-cancer-clinical-trials.html | [V výťah, originál neotvorený] |
| 2 | Z pacientov, ktorým štúdiu ponúknu, **~55 % súhlasí** (metaanalýza 35 štúdií, 9 759 pacientov, Unger 2020). Ľudia teda štúdie nezdráhajú, problém je, že im **nie sú ponúknuté**. | https://ascopost.com/issues/november-10-2025/making-clinical-trials-more-accessible-new-report-highlights-barriers-and-solutions/ (téma; samotný údaj som videl len vo výťahu z vyhľadávania) | [S, URL k údaju nepotvrdená] |
| 3 | Podiel dospelých pacientov v štúdiách sa uvádza ako 3 % až 7 % podľa zdroja. **V MOÚ (Brno) ~5 %** oproti 10–15 % v západných centrách; ručné hľadanie štúdie ~45 minút, cieľ pod 30 sekúnd. | slajdy zadávateľa TriaLink (`docs/materials/slack/trialink/`) | [S: údaj organizátora] |
| 4 | **ČR: viac ako 480 komerčných štúdií je aktívnych, viac ako 16 000 pacientov ročne** sa do nich zapája (všetky odbory). Ministerstvo pripravuje **Národnú stratégiu klinických hodnotení**: zjednodušenie administratívy, digitalizácia, **podpora koordinátorov**. Dopyt po digitalizácii je teda aj politický. | https://mzd.gov.cz/tiskove-centrum-mz/inovativni-lecba-blize-pacientum-ceska-republika-posiluje-podporu-klinickeho-vyzkumu/ (29. 5. 2025) | [V] |
| 5 | **Zlyhanie náboru stojí peniaze.** Priemerný deň meškania štúdie = ~500 000 USD ušlých tržieb sponzora a ~40 000 USD priamych nákladov (Tufts CSDD). Z predčasne ukončených štúdií, kde nešlo o dáta, je 57 % kvôli nedostatku pacientov (Williams, PLOS ONE 2015). V USA 18 % štúdií fázy 2/3 siete NCTN nedosiahlo cieľ náboru. | https://www.appliedclinicaltrialsonline.com/view/how-much-does-a-day-of-delay-in-a-clinical-trial-really-cost- ; https://doi.org/10.1371/journal.pone.0127242 ; https://www.fdanews.com/articles/174768-report-one-fifth-of-cancer-clinical-trials-fall-short-on-recruitment-goals | [V Tufts], [V Williams podľa 07], [S NCTN] |
| 6 | **AI párovanie funguje:** TrialGPT (NIH, Nature Communications 2024) má **87,3 % presnosť** pri jednotlivých podmienkach (1 015 párov, ručné hodnotenie), nájde **>90 % relevantných štúdií na 6 % zbierky** a pilot skrátil čas preverovania o **42,6 %**. Testované na 183 **syntetických** pacientoch. | https://doi.org/10.1038/s41467-024-53081-z | [V] |
| 7 | Mayo Clinic + IBM Watson (2017–18): nábor do štúdií rakoviny prsníka **+80 %** (6,3 vs 3,5 pacienta mesačne), porovnanie pred/po, jedna ambulancia, nie kontrolovaná štúdia. | https://www.beckershospitalreview.com/?p=127246 | [S] |
| 8 | Ručné vs. AI-asistované preverenie v Mayo (GIT): ~30,5 vs ~10 minút na pacienta. | ESMO 2019, abstrakt 5271 (stránka dnes vrátila 404) | [S, neoverené] |
| 9 | **Medián 21 kritérií na štúdiu** (7–51) pri 20 onkologických štúdiách fázy III z roku 2020; 81 % kritérií dohľadateľných v dokumentácii, 31 % len vo voľnom texte. | https://ispor.org/heor-resources/presentations-database/presentation-paper/intl2022-3469/14040/feasibility-of-using-oncology-specific-electronic-health-records-ehr-data-to-emulate-clinical-trial-inclusion-and-exclusion-criteria | [V abstrakt, malá vzorka] |
| 10 | **Lokálne:** 76 otvorených štúdií v FNMH; ~29 má číslo z rokov 2025–2026 (interný ročník), t. j. portfólio sa rýchlo mení a ručné sledovanie je ťažké. | `Seznam_studii_FNMH.xlsx` | [V] |

**Ilustračný výpočet (nie fakt):** ak v ČR pribúda ~60 000 nových zhubných nádorov ročne (údaj zo slajdov MOÚ, [S]) a podiel pacientov v interventných štúdiách by sa zvýšil z 5 % na 10 % (západný štandard podľa MOÚ), išlo by o **~3 000 pacientov ročne navyše**. [odhad, závisí od predpokladov, nie je to predpoveď dopadu nášho nástroja]

**Čo údaje NEdokazujú:** že účasť v štúdii predlžuje prežitie (dôkazy sú zmiešané; zdravotný dopad je preto skôr "prístup k novej liečbe pri vyčerpaných možnostiach", nie "zachránený život"). V pitchi nenazývať účasť zázrakom.

**Kto na tom zarobí:** MOÚ píše v zadaní, že **liečbu v štúdii hradí sponzor**, čo "šetrí prostriedky nemocnice aj verejného zdravotníctva". [S: slajd TriaLink] Nemocnica navyše dostáva od sponzora platby za zaradeného pacienta (výška v ČR **nezistená [?]**).

---

## 4. Existujúce riešenia na trhu: kto platí, čo robia zle

| Riešenie | Kto / odkiaľ | Ako to funguje | Cena a platca | Slabé miesto |
|---|---|---|---|---|
| **Tempus (Deep 6 AI)** | USA; Tempus kúpil Deep 6 AI **11. 3. 2025**: 750+ pracovísk, 30 mil. pacientov v sieti | číta štruktúrované aj voľné dáta z elektronickej dokumentácie nemocnice a páruje pacientov na štúdie; aplikácia TIME pre pacientov | cena **nezverejnená**; platí nemocnica a/alebo sponzor; firma tvrdí +25 % vhodných pacientov a 3× rýchlejší nábor (tvrdenie firmy) | postavené na US dokumentácii a angličtine; nie je pripravené na češtinu ani na FNMH |
| **Triomics (PRISM)** | USA; **22 mil. USD séria B, máj 2026** | AI štruktúruje onkologické záznamy a páruje na štúdie; firma uvádza -67 % času na prehľad chorobopisu a +40 % zhôd (štúdia v Nature Digital Medicine, údaj neoverený) | cena nezverejnená; onkologické centrá | rovnaké: USA, angličtina, integrácia s nemocničným systémom je dlhá |
| **IBM Watson Clinical Trial Matching** | Mayo Clinic, 2017–18 | pozri #7 v §3 | nezverejnená | historický precedens (produkt sa medzitým zmenil [?]) |
| **Inspirata** | USA | matching a sledovanie kandidátov; tvrdí **platbu len pri zvýšení náboru** | výkonová platba (údaj z marketingu) | marketingové tvrdenia |
| **Klineo** | Paríž; **2 mil. EUR** (Bpifrance, apríl 2024); spolupráca so Servierom | pacient aj lekár si vytvoria zdravotný profil a systém ukáže otvorené štúdie vo Francúzsku | **zadarmo pre pacientov a lekárov**, platia farmaceutické firmy a akademické partneri | profil sa musí zadávať ručne (nevyriešený problém "napadne nás to"); iba Francúzsko |
| **trialing.org, clinicaltrialfinder.info** | uvádza ich organizátor ako inšpiráciu | pacientske vyhľadávače | zadarmo | jednoduché formuláre, nečítajú dokumentáciu |
| **TrialGPT** | NIH, otvorený výskum | akademický referenčný postup (GPT-4) | zdarma na výskum | nie je produkt, len metóda |
| **MOÚ TriaLink** (Brno) | výzva na Rakathone | rozhodovací strom + lokálny LLM na vytiahnutie parametrov zo správy | vyvíja sa | rovnaké zadanie, iná nemocnica; **dáva nám predobraz očakávaní** (referral e-mail, import CSV, 5 kazuistík) |
| **ClinAsyst** (Capterra) | malý nástroj na predselekciu | | od 400 USD/mesiac [S] | tenký profil bez recenzií |
| **Česká komerčná platforma** | | | | **nenašiel som žiadnu [?]** (08 §8: "komerčnú českú platformu som nenašiel") |

**Kto už za to platí:** v USA nemocnice a farmaceutickí sponzori (Tempus, Triomics, Inspirata); vo Francúzsku farma financuje bezplatný pacientsky vyhľadávač (Klineo). **V ČR som platiteľa nenašiel**, vláda ale cez stratégiu klinických hodnotení smeruje k digitalizácii a koordinátorom. VZP inovačný portál (spustený 21. 9. 2026, až 300 mil. Kč na 2027) cieli na nástroje pre onkológiu, ale **matching pre výskum nie je zjavne ich cieľ** [?, 08].

**Kde je priestor urobiť to lepšie, rýchlejšie, lacnejšie, jednoduchšie:**
1. **Česky, lokálne:** pracuje s českou zdravotnou správou a lokálnym zoznamom štúdií (kto je koordinátor, na ktorej klinike). Zahraničné produkty to nevedia.
2. **Push namiesto pull:** ozve sa sám, nie "otvorte appku a hľadajte". Vyhľadávače (Klineo a spol.) to nerobia.
3. **Vysvetliteľnosť:** každé "splnené/nesplnené" s **doslovným citátom z dokumentácie a dátumom**. Čierne skóre bez dôkazu lekári nezoberú.
4. **Úplne jednoduchý štart bez integrácie do NIS:** stačí nahrať správu/export. Veľké systémy potrebujú mesiace integrácie.
5. **Odporúčanie do iných pražských nemocníc**: z verejných registrov (ClinicalTrials.gov uvádza pracoviská s mestom). Nikto z vyššie uvedených to pre ČR nerobí.
6. **Cena:** LLM náklad na pacienta je rádovo **jednotky korún** [odhad, závisí od modelu a od toho, koľko štúdií sa predfiltruje]. To je radikálne lacnejšie než "enterprise" licencia.

---

## 5. Najlepší návrh riešenia pre nás

### 5.1 Produkt: "Studijní radar" (pracovný názov; SK: Radar štúdií)

**Jedna veta:** Každé ráno ukáže koordinátorke **zoznam pacientov na dnes** s priloženými štúdiami, do ktorých **pravdepodobne pasujú**, s **dôkazom z ich správy** a **zoznamom toho, čo ešte chýba**. Jedno kliknutie pošle poznámku koordinátorke.

**Vzor obrazovky (jediná stránka, 3 prvky):**
1. **Ľavý stĺpec:** pacienti (anonymné ID), každý má farebný štítok: zelená (aspoň 1 pravdepodobná štúdia), žltá (zhoda, ale chýba údaj), šedá (nič).
2. **Pravá strana, po kliknutí:** max. 3 štúdie. Pri každej **gauge** zhody (napr. 12 z 14 podmienok splnených, 2 chýbajú, 0 nesplnených) a **tabuľka podmienok**: ikona (splnené / nesplnené / chýba), podmienka po česky jednoducho, **zvýraznená veta z lekárskej správy** s dátumom.
3. **Tlačidlá:** "Poslať koordinátorke" (vygeneruje krátku správu s zoznamom chýbajúcich údajov, v demu len simulácia) a záložka **"Aj inde v Prahe"** s podobnými štúdiami vo VFN/FTN z verejných registrov.

**Princíp "nesvieti, kým nie je dôvod"** (únava z upozornení): ping len pri zelenej alebo žltej s malým počtom chýbajúcich údajov, nie pri každom náhodnom prekryve.

### 5.2 Ako to funguje technicky (stručne; stavia Claude Code)

| Krok | Čo sa deje | AI alebo pravidlo |
|---|---|---|
| A. Knižnica štúdií (jednorazovo) | 76 štúdií zo zoznamu → dohľadanie záznamu v ClinicalTrials.gov podľa čísla protokolu, názvu a sponzora → stiahnutie textu kritérií a zoznamu pracovísk → prevod na štruktúrovaný zoznam podmienok (typ, kategória: diagnóza / štádium / biomarker / predchádzajúca liečba / ECOG / laboratórna hodnota / orgánové funkcie / komorbidita / zobrazenie; tvrdá alebo mäkká; slovenčina či čeština "ľudskou rečou") | LLM + ručná kontrola na 3–5 štúdiách (vzorka) |
| B. Profil pacienta | z lekárskych správ, CT opisov a laboratórií vytiahne: diagnóza (MKN-10), štádium, histológia, biomarkery, predchádzajúce línie liečby, ECOG, komorbidity, laboratóriá; **ku každému údaju citát a dátum** | LLM (štruktúrovaný výstup), laboratórne čísla porovnáva pravidlo |
| C. Párovanie | najprv **tvrdé predfiltrovanie** (diagnóza, vek, pohlavie, línia) → potom **po jednej podmienke** verdikt: splnené / nesplnené / chýba (ak dôkaz nie je, **vždy "chýba"**, nikdy nepredpokladať) | LLM + pravidlá |
| D. Skóre | ak je akékoľvek tvrdé vylučujúce kritérium splnené → "nespĺňa"; inak miera zhody = podiel splnených, plus počet chýbajúcich | čistý výpočet |
| E. Výstup | zelená / žltá / šedá, dôkaz, zoznam chýbajúcich údajov, správa pre koordinátorku | šablóna |
| F. Cross-nemocnice | pre každý žltý/zelený prípad dohľadá v registri **podobné štúdie s pracoviskami v Prahe** a ukáže mesto | API volanie |

**InterSystems (cena 1 500 EUR, kombinovateľná):** vyhľadávanie relevantných štúdií cez **IRIS vector search** (vektorové vyhľadávanie podľa významu) a ukladanie pacienta ako **FHIR** (Patient / Condition / Observation); štúdia ako FHIR **ResearchStudy**, kde je kritérium (zaradenia/vyradenia) referencia na `Group`. [V: https://hl7.org/fhir/R4/researchstudy.html, prvok `enrollment`]. Stačí **FHIR export** a odpoveď "FHIR áno" vo formulári.

### 5.3 Čo ukážeme v 3-minútovom pitchi (a videu)

Mapa na šablónu z `09` §4.5 a na 5 kritérií:

| Čas | Obsah | Kritérium |
|---|---|---|
| 0:00–0:20 | **Hák:** "Vo FN Motol beží 76 klinických štúdií. Lekár má na pacienta pár minút. Nikto si nepamätá 76 protokolov po 20–50 podmienkach." (+ **fiktívny** príbeh: pani s čerstvým nálezom mutácie, štúdia pre pacientov bez liečby, okno sa zatvára dnes) | 2 |
| 0:20–0:45 | Číslo + kto: "Do štúdie sa dostane ~8 % pacientov, u 55,6 % štúdia na ich pracovisku nie je dostupná (Unger 2019). Ručné preverenie trvá ~30 minút." Zadávateľka Alina je v sále. | 2 |
| 0:45–1:45 | **Video 60–75 s:** reálna obrazovka, jeden scenár: ráno zoznam pacientov → jeden svieti → dôkaz (zvýraznená veta zo správy) → "chýba ECOG" → "poslať koordinátorke" → záložka "Aj inde v Prahe". Žiadna animácia. | 1, 3 |
| 1:45–2:15 | Kde je AI a kde pravidlo, čo vzniklo cez noc, ako sa overuje (citát pri každej odpovedi, "chýba" ak niet dôkazu, **lekár rozhoduje**), meranie presnosti na kontrolnej vzorke. EÚ hosting, FHIR. | 1, 2 |
| 2:15–2:40 | **Pilot na jednom riadku:** jedna klinika FNMH, mesiac, KPI (čas na preverenie pacienta, počet identifikovaných pacientov, počet odoslaných koordinátorke), partner: Onkologická klinika FNMH; škálovanie: ďalšie KOC a iné pražské nemocnice. | 2, 4 |
| 2:40–3:00 | Tím (marketing a storytelling + radiačná ochrana a zobrazovanie), čo robíme v pondelok, **jedna žiadosť** (pilot s Alinou, prístup k reálnym dátam v bezpečnom prostredí). | 5 |

**Povinné vyhlásenie:** nástroj **nestanovuje diagnózu ani nemení liečbu**, je to pomôcka na predvýber pre skúšajúceho lekára.

**Návrh textu do formulára (140 znakov):** "Studijní radar: ze zprávy zjistí, do které studie FNMH pasuje, proč a co chybí. Koordinátorku upozorní dřív, než na to lékař pomyslí."

### 5.4 Plán na noc (pre Claude Code) a záložný plán

1. **Dnes do 19:00:** rozhodnúť o výzve, zavolať Alinu / dostať sa k Hoferkovi pre dataset, vybrať 5 otázok z §9.
2. **Večer:** knižnica štúdií (krok A) pre všetkých 76, vrátane mapovania na ClinicalTrials.gov; overiť ručne ≥3.
3. **V noci:** profil pacienta + párovanie (B–D); UI (E); cross-hospital (F); FHIR export; testovacia sada.
4. **Merateľnosť bez "správnej odpovede":** vytvoriť **kontrolnú sadu** (~20 syntetických českých správ s vopred známymi zhodami pre 5–6 štúdií) a zmerať **zhodu verdiktov podmienok** a **odhalenie vhodných pacientov** (recall). Uvádzať ako "kontrolná sada", **nie ako klinickú validáciu**. Ak dataset dorazí, doplniť pár skutočných (anonymizovaných) prípadov a **nechať Alinu ručne potvrdiť 5 výsledkov** (to je silné pre kritérium 2).
5. **Sobota ráno:** video (60 a 75 s), titulný obrázok 16:9, popis (140 znakov), repozitár, demo odkaz; **záložné video + snímky**, ak živé demo zlyhá.
6. **Záložný plán pre dáta:** ak dataset nepríde do ~22:00, ide sa na **syntetické české správy** (jasne označené) a verejné kritériá z registra. Demo funguje a poctivo to povieme.

### 5.5 "Šialený" ambiciózny variant: "Nočná hliadka štúdií"

Autonómny agent, ktorý **neustále pracuje na pozadí** a robí 4 veci, ktoré dnes nikto nerobí:
1. **Ranný digest:** každú noc prejde zoznam pacientov na zajtra a nové správy, ráno pošle každému koordinátorovi 3–5 riadkov.
2. **Sledovač dodatkov protokolov:** pri zmene kritérií v registri (amendment) **znova prepočíta všetkých pacientov** a ohlási, "po dodatku 4 sa uvoľnil limit ECOG, pasujú 3 ďalší pacienti".
3. **Spätné párovanie (feasibility radar):** pre každú štúdiu ukáže, **koľko pacientov v nemocnici na ňu pasuje a koľko bolo zaradených**, teda "kde nám chýbajú pacienti". Toto je produkt pre **sponzorov a vedenie nemocnice** (výber štúdií, ktoré sa oplatí brať), čiže cesta k peniazom.
4. **Pacientska strana:** stránka "Mám nárok?" vo veľmi jednoduchej češtine/slovenčine s pojmami v zátvorke a odkazom na kontakt koordinátorky.

**Prečo je to šialené:** dokazuje vízia "nemocnica, ktorá sa sama spýta, kto nie je v štúdii". **Riziko:** rozsah. Pre sobotu **rezať na bod 1 + 2** (stačí ukázať jeden prepočet), body 3 a 4 len ako slajd a prototyp obrazovky.

---

## 6. Konkurencia na hackathone a či ju pražský tím môže zvoliť

**Môže pražský tím túto výzvu zvoliť?** **Áno.** Je to jedna z 12 pražských možností vo formulári (9 pražských + 3 VZP). Nič nebráni, aby ju zvolilo viac tímov (už ju zvolili 4). [V: 05]

**Tabuľa tímov (podľa `submit.rakathon.cz/vyzvy`, stav ~16:00)** [V: 05]

| Tím | Poznámka |
|---|---|
| Compass Crew | nič viac o ňom nevieme [?] |
| Smradi | nič viac [?] |
| **Pixel Predators** | rovnaký názov ako **víťaz Rakathonu 2025 (RadioProtect, FEL ČVUT)**, ktorému FN Motol následne ponúkol spoluprácu; **či ide o tých istých ľudí, nie je potvrdené [?]** |
| M&A | nič viac [?] |

**Čo to znamená:**
- **4 tímy z 23 priradených je najvyšší počet v Prahe** (mamograf 3, Cesta pacienta 2, Hlídač NÚ 2, NÚVR 2, ostatné 0–1). Päť tímov ešte výzvu nevybralo (Ctrl+Alt+CURE, FIT/S, FSMZ, Pražský Meridian, walking legs) a sedem z organizátorskej listiny na tabuli zatiaľ nie je, takže **počet môže ešte stúpnuť** (5 až 8 tímov). [V: 05]
- **Základná šanca vyhrať výzvu** pri 4 rovnocenných tímoch je 25 % (pri 5 tímoch 20 %), **pred** zohľadnením sily tímov. Tímy z technických škôl bývajú technicky silné (kritérium 1). [odhad]
- Víťaza vyberá **zadávateľka pri obchôdzke** (14:00–16:00), a nie porota. Jej kritérium je zrejme praktické: "funguje, rozumiem tomu, dalo by sa to použiť u nás". To je kritérium 2, kde môžeme získať body **dôkazom kontaktu s užívateľom** (potvrdenie od Aliny).
- **Pravdepodobne budú všetky tímy robiť to isté:** LLM extrakcia kritérií + vyber pacienta + vyber štúdie → skóre (pull). Preto sa odlišujeme **push modelom ("radar")**, **dôkazom v správe (citát)**, **chýbajúcimi údajmi ako úlohami** a **odporúčaním do iných nemocníc**. Toto je to, čo zadávateľka výslovne napísala, takže riziko, že ju to nezaujme, je malé. [odhad]
- **Sobota neznamená finále:** bez víťazstva vo výzve sa do nedele nepostupuje (pravidlo "víťaz výzvy → finále"). Pre výzvy s 0–1 tímom je cesta do finále jednoduchšia (Kvalita péče na konci života 0, Twincer 0, PACS 1, MEDDI 1, Plíce 1, SMART ONCO 1, MDT Copilot 1). [V: 05]

---

## 7. Skóre (1–10, prísne; 5 = priemer medzi výzvami)

| Kritérium | Váha | Skóre | Zdôvodnenie |
|---|---|---|---|
| Veľkosť problému | 1 | **5** | Dotýka sa všetkých pacientov s progresiou a potenciálne ~60 000 nových nádorov ročne, no do štúdie ide menšina (5–8 %). Menšia než výzvy s milión+ záznamov (mamograf). |
| Dopad na zdravie | 1,5 | **5** | Prístup k novej liečbe pri vyčerpaných možnostiach, ale **dôkazy o lepšom prežití sú zmiešané** a zasiahne len zlomok pacientov. Nie je to včasná diagnóza ani prevencia. |
| Úspora času | 1 | **6** | Ručné preverenie ~30 min vs ~10 min (Mayo, jeden abstrakt); TrialGPT -42,6 % (pilot). Reálna, ale na malej skupine zamestnancov. |
| Peniaze | 1,2 | **6** | Sponzor hradí liečbu v štúdii (úspora nemocnice a VZP), nemocnica dostáva platby za zaradeného pacienta (výška [?]), sponzor stráca ~500 tis. USD za deň meškania. Neexistuje však priamy rozpočet na nástroj. |
| Akútnosť bottlenecku | 1,5 | **6** | Dve nemocnice nezávisle zadali tú istú tému (FNMH a MOÚ TriaLink) + NÚVR Research Matchmaker, Národná stratégia klinických hodnotení. Dopyt je, ale nie je "horí" ako čakanie na liečbu. Najväčšia prekážka (55,6 %: štúdia na pracovisku neexistuje) sa len čiastočne rieši párovaním. |
| Ochota platiť / kupec | 1,2 | **5** | Globálny trh existuje (Tempus, Triomics), v ČR platiteľ nenájdený, nemocnice šetria (hotovosť FNMH 1,2 mld. Kč pri obrate ~18 mld. [S: 09]), VZP za výskum neplatí. Platiť môže sponzor alebo grant. |
| Jednoduchosť pre užívateľa | 1 | **7** | Ranný zoznam s dôkazom je veľmi jednoduché rozhranie. Rizikom je dôvera (musí vidieť dôkaz) a cesta k dátam v NIS. |
| Dostupnosť dát | 1 | **4** | **Dataset v Slacku nie je** (treba ho vypýtať), formát neznámy, **zoznam štúdií bez kritérií** (dohľadať v registri a mapovanie nie je 100 %), **žiadna správna odpoveď**. Verejné registre sú silný záchranný bod. Iné výzvy (mamograf, MEDDI, Plíce včas) majú dáta už teraz. |
| Realizovateľnosť dema za noc | 1 | **8** | Overený postup (TrialGPT), verejné API na kritériá, LLM rozumie češtine, UI je jedna stránka. Riziko: neistý dataset (záložný plán: syntetická sada). |
| Wow a príbeh | 1,2 | **7** | "Systém zaklope na plece" + zvýraznená veta v správe + "aj inde v Prahe" sú silný, vizuálny scenár na 75 s. Ale "AI číta správy" bude v sále viackrát, wow nie je výnimočný. |
| Strategický partner | 1,2 | **8** | FNMH (najväčšia nemocnica, 9/10 v `09`), IT námestník v porote, zadávateľka je klinik na mieste, precedens 2025 (Motol po víťazovi nadviazal spoluprácu). Vhodné na kombináciu s cenou InterSystems (RAG/FHIR). Chýba voľný rozpočet. |
| Šanca vyhrať výzvu / finále | 1 | **3** | **4 tímy už vybrali (najviac v Prahe)**, možno sa pridajú ďalšie; tím s názvom víťaza 2025. Víťaz je jeden. Odlišenie pushom a dôkazom pomáha, ale základná šanca ~20–25 %. |
| Šanca na pokračovanie | 0,8 | **6** | Mentorka je motivovaná a konkrétna ("chceme…"), stratégia klinických hodnotení ide rovnakým smerom, MOÚ rieši to isté (škálovanie na KOC). Brzdí ochrana dát, integrácia do NIS a nejasný platiteľ. |
| Fit s naším tímom | 0,8 | **5** | Marketing/storytelling/video sedí na pitch a príbeh. Radiačná ochrana a zobrazovanie majú len okrajové využitie (podmienky o predchádzajúcom ožarovaní, RECIST/meratelné ložisko na CT, texty CT popisov). Chýba klinik v tíme (riešime cez Alinu). |
| Nízke regulačné/klinické riziko | 0,6 | **7** | Nástroj len **predselektuje kandidátov pre skúšajúceho lekára**, nestanovuje diagnózu ani liečbu, rozhoduje človek; hackathon je len prototyp. Zostáva GDPR (anonymizované dáta, EÚ hosting) a to, či by produkt v praxi spadol pod MDR/AI Act (neoverené [?]). |

**Vážený priemer: 5,9 / 10** (súčet váhy 16,0; spočítané z hodnôt vyššie, presne 5,86).

**Verdikt:** stredná voľba. Na úrovni **problému a partnera** je výzva silná (8/10 partner, 7/10 jednoduchosť a wow), na úrovni **dát a konkurencie** slabá (4 a 3). **Do finále sa dostaneme iba vtedy, ak vyhráme výzvu**, a tu je to najhustejšie pole v Prahe.

---

## 8. Riziká

| Riziko | Dopad | Ako sa vyhnúť |
|---|---|---|
| Dataset nepríde včas alebo je v neočakávanom formáte | demo bez reálnych údajov | záložná syntetická sada (jasne označená), registre ako zdroj kritérií |
| **Bez správnej odpovede** sa presnosť nedá objektívne zmerať | slabé kritérium 1 | vlastná kontrolná sada + ručné potvrdenie Alinou na 5 prípadoch |
| Mapovanie protokol → záznam v registri nie je dokonalé (vlastný test: 1 z 2 presne) | zlé kritériá pri niektorých štúdiách | dohľadávať aj podľa názvu a sponzora, ručná kontrola, označenie "kritériá neoverené" |
| LLM si vymyslí údaj ("hallucination") | nedôvera lekára | **pravidlo: bez citátu = "chýba"**, nikdy nehádať |
| 4 až 8 konkurenčných tímov | nízka šanca vyhrať | odlíšiť push modelom, dôkazom a odporúčaním do iných nemocníc; kontakt s užívateľom |
| Pixel Predators technicky silní [?] | kritérium 1 | nesúťažiť na "čistej technike", ale na použiteľnosti a dôkaze |
| GDPR a regulácia (MDR, AI Act) | prevádzková nepoužiteľnosť | len anonymizované dáta, EÚ hosting, "pomôcka na predvýber pre lekára", právne posúdenie v pláne pilota |
| Rozsah šialeného variantu | nedokončené demo | rezať na ranný digest + 1 prepočet po dodatku |

---

## 9. Čo sa opýtať Aliny (alebo Hoferka) hneď

1. **Dataset:** koľko pacientov, aké diagnózy, v akom formáte (jeden pacient = jedna zložka správ?), skutoční alebo syntetickí? Pokrýva to 76 štúdií?
2. Existujú **pacienti, ktorí už boli do štúdie zaradení** (anonymne), ktoré by sme mohli použiť ako "správnu odpoveď"?
3. **Kto** v nemocnici dnes zisťuje vhodnosť a **kedy** (ambulancia, MDT)? Komu by prišlo ranné upozornenie?
4. Majú **text podmienok** (synopsy protokolov) aspoň pre 5 štúdií, aby sme neriešili chyby mapovania?
5. Smie sa pre štúdie z **iných nemocníc** použiť verejný register, alebo chce vlastný zoznam?
6. Čo by pre ňu bol **úspech v sobotu 14:00** (konkrétne: na čo sa pozrie na obchôdzke)?

---

## 10. Zdroje

**Lokálne súbory (v repe):** `docs/materials/slack/fnm-motol-vyzvy/Rakathon_vyzvy_onkologie_FNM.pdf`; `docs/materials/slack/ai-trial-matching/Seznam_studii_FNMH.xlsx`; `docs/materials/slack/refresh-1600/Rakathon_2026_INTRO_Praha_MASTER.txt`; `docs/materials/slack/trialink/RAKATHON_2026_MOU_Vyzva3_TriaLink_prezentace.pptx`; `docs/materials/slack/best-use-of-intersystems/Rakathon_2026_InterSystems_Workshop.pdf`; `docs/research/04, 05, 06, 07, 08, 09`.
**Slack:** kanál `#ai-trial-matching` prečítaný celý (11 obsahových správ od mentorky, zvyšok len oznámenia o pripojení do kanála; žiadne vlákna ani ďalšie súbory), vyhľadávanie "dataset", "Hoferek", "Trial", "matching", "FNMH".

**Web (overené alebo výťah z vyhľadávania, 16. 10. 2026):**
- Unger 2019, JNCI: https://doi.org/10.1093/jnci/djy221 ; https://www.fredhutch.org/en/news/center-news/2019/02/patient-barriers-to-cancer-clinical-trials.html
- TrialGPT (Jin et al., Nat Commun 2024): https://doi.org/10.1038/s41467-024-53081-z
- Mayo + Watson: https://www.beckershospitalreview.com/?p=127246
- Tufts CSDD, deň meškania: https://www.appliedclinicaltrialsonline.com/view/how-much-does-a-day-of-delay-in-a-clinical-trial-really-cost-
- Williams, PLOS ONE 2015: https://doi.org/10.1371/journal.pone.0127242
- NCTN nábor: https://www.fdanews.com/articles/174768-report-one-fifth-of-cancer-clinical-trials-fall-short-on-recruitment-goals
- ISPOR 2022 (počet kritérií): https://ispor.org/heor-resources/presentations-database/presentation-paper/intl2022-3469/14040/feasibility-of-using-oncology-specific-electronic-health-records-ehr-data-to-emulate-clinical-trial-inclusion-and-exclusion-criteria
- MZ ČR (klinické štúdie, 29. 5. 2025): https://mzd.gov.cz/tiskove-centrum-mz/inovativni-lecba-blize-pacientum-ceska-republika-posiluje-podporu-klinickeho-vyzkumu/
- Tempus a Deep 6 AI: https://www.tempus.com/news/pr/tempus-announces-acquisition-of-deep-6-ai/
- Triomics (22 mil. USD): https://www.sovereignmagazine.com/article/triomics-raises-22m-oncology-ai
- Klineo: https://www.eu-startups.com/2024/04/paris-based-klineo-raises-e2-million-to-revolutionize-access-to-clinical-trials-for-oncology-patients/
- ClinicalTrials.gov API v2: https://clinicaltrials.gov/api/v2/studies (vlastné dotazy, 16. 10. 2026)
- FHIR R4 ResearchStudy: https://hl7.org/fhir/R4/researchstudy.html
- Mayo GIT abstrakt (nedostupný, 404): https://oncologypro.esmo.org/meeting-resources/esmo-2019-congress/A-Pilot-Study-to-Implement-an-Artificial-Intelligence-AI-System-for-Gastrointestinal-Cancer-Clinical-Trial-Matching

**Nepodarilo sa overiť:** formát datasetu, platiteľ v ČR, výška platieb sponzora nemocnici, presný stav mapovania všetkých 76 protokolov, tvrdenia firiem (Tempus, Triomics, Inspirata), pôvodný údaj Unger 2020 (55 % súhlasí), abstrakt ESMO 2019.
