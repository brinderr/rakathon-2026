# 09 – Partneri, porota a čo vyhráva hackathony

_Stav: piatok 16. 10. 2026 ~16:15. Čítaj spolu s `00-SUHRN.md`, `01-…` (víťazi 2025) a `04-…` (výzvy zo Slacku)._
_Značky: **[overené]** = potvrdené primárnym zdrojom (web partnera, oficiálne slajdy, Slack organizátora), **[sekundárne]** = jediný novinový/vyhľadávací zdroj, **[odhad]** = môj záver z faktov, **[?]** = neisté alebo si protirečia zdroje._
_Pravidlo: uvádzam iba mená a role, žiadne kontakty._

---

## 0. Najdôležitejšie zistenia (nové po 13:00 – v 04 ešte nie sú)

1. **Oficiálne hodnotiace kritériá sú už známe.** Tomáš Studeník ich dal do Slacku `#03-info-praha` dnes o 14:25 v slajdoch „Rakathon 2026 – INTRO (Praha)“ (85 slajdov). Uložené v `docs/materials/slack/03-info-praha/Rakathon_2026_INTRO_Praha.pdf` (+ textový výťah `.txt`). Detail v kapitole 1.
   - **Sobota (miestne kolo) – 3 kritériá:** (1) AI technológia a prevedenie, (2) využiteľnosť v praxi u zadávateľa výzvy, (3) inovatívnosť.
   - **Nedeľa (finále) – pridávajú sa ďalšie 2:** (4) škálovateľnosť, (5) kvalita prezentácie a tímu.
2. **V sobotu víťaza výzvy vyberá zadávateľ výzvy, nie anonymná porota.** Program: „zadávatelia výziev obchádzajú svoje tímy“ 14:00–16:00, o 16:00 nahlásia víťaza, o 17:00 vyhlásenie. Kto zadal výzvu, ten rozhoduje.
3. **Nedeľná porota má 12 členov** (zoznam z rakathon.cz/lide, kapitola 1.2): platca (VZP), ministerstvo (MZd), vláda (zmocnenec pre AI), 4 nemocnice, výskum (NÚVR), pacientska organizácia, 3 technologické firmy. **AstraZeneca ani Microsoft v nej nemajú miesto.**
4. **VZP má od 21. 9. 2026 spustený „Inovačný portál“ a prvá tematická výzva je na digitálne technológie v onkológii** (podľa rozhovoru s námestníkom VZP z 29. 9. sa otvára 1. 11. 2026; plánovaných ~300 mil. Kč na pilotné úhrady v roku 2027). Autor podkladu k výzve „Od pozvánky k mamografu“ (Antonín Hlavinka) je zároveň šéfom tejto agendy aj porotcom. Je to jediný partner, ktorý má verejne popísaný **kanál, kadiaľ môžu prísť peniaze**. Detail v kapitole 3.1.
5. **Cena „Caelestinus“ (divoká karta do batchu 2027) = inkubátor, ktorý robí ten istý organizátor** (Insane Business Ideas / CEE Hacks) a hlavným partnerom inkubátora je InterSystems. Teda organizátor + InterSystems sú prepojení; viď 3.3 a 3.10.
6. **Pravidlá účasti (v1.0, platné od 23. 6. 2026):** autorstvo ostáva tímu, ale organizátor a partneri dostávajú bezplatnú nevýhradnú licenciu a môžu sa výstupom inšpirovať; všetko je len prototyp (nie zdravotnícky prostriedok); žiadne reálne dáta pacientov. Kontakty tímu sa môžu odovzdať partnerom **iba so samostatným súhlasom** z registrácie. Zdroj: [PDF pravidiel](https://bqcunktidwhqgkjnisbp.supabase.co/storage/v1/object/public/terms/terms/1782206443390-Rakathon_2026_pravidla_a_podminky_ucasti_2_.pdf) [overené].
7. **Oprava k predchádzajúcim dokumentom:** generálny riaditeľ VZP sa volá **Ivan Duškov** (nie „Dušek/Duško“). Od jari 2026 vedie VZP po odchode Zdeňka Kabátka ([vzp.cz, 1. 4. 2026](https://www.vzp.cz/o-nas/aktuality/moderni-vzp-bez-drabu-duskov-sazi-na-data-a-platbu-za-vysledek-pece)).
8. **Výzva „Plíce včas“ (AstraZeneca) už má zadanie aj dáta** (300 syntetických pacientov, 5 CSV súborov + README, Slack `#plice-vcas…` 13:41). Zadanie je v podstate pravidlový filter + komunikácia s pacientom (stavy ELIGIBLE / EXCLUDED_… / NEEDS_REVIEW, výber kanála, odoslanie správy, evidencia reakcie, kontrola zdravotníkom). Mentor z AZ tam napísal, že ich cieľom je prototyp „preklopiť do reálnej klinickej praxe“. [Slack, overené]

---

## 1. Kto a podľa čoho rozhoduje

### 1.1 Čo je oficiálne (slajdy INTRO Praha, 16. 10. 14:25) [overené]

**Sobota 17. 10. (miestne kolo):**
- 13:00 odovzdanie (po 13:00 formulár nič neprijme) · 14:00 hodnotenie, zadávatelia obchádzajú tímy · 16:00 zadávatelia nahlásia víťazov · 17:00–18:00 vyhlásenie. Víťaz každej výzvy ide do nedeľného finále.

**Kritériá (sobota):**

| # | Kritérium | Čo porota pýta (parafráza oficiálneho textu) |
|---|---|---|
| 1 | AI technológia a prevedenie | Ako dobre to **naozaj funguje**? Čo tím **počas hackathonu reálne vytvoril**? Technická kvalita vrátane práce s AI a dátami. |
| 2 | Využiteľnosť v praxi u zadávateľa | Zodpovedá to výzve a potrebám používateľa? Dá sa to **reálne nasadiť**? Rešpektuje bezpečnosť, dáta, reguláciu, integráciu? |
| 3 | Inovatívnosť | Nový alebo neočakávaný prístup? Je z toho **skutočná výhoda** oproti bežnému riešeniu? |

**Pridané kritériá (nedeľa, finále):**

| # | Kritérium | Čo porota pýta |
|---|---|---|
| 4 | Škálovateľnosť | Dá sa to rozšíriť/preniesť mimo jedno nasadenie? Je reálna cesta k ďalšiemu rozvoju? **Je reálne, že projekt bude po hackathone pokračovať?** |
| 5 | Kvalita prezentácie a tímu | Je jasné, čo to robí a ako to funguje? Je prezentácia zrozumiteľná a presvedčivá? **Je tím motivovaný pokračovať?** |

**Nedeľa 18. 10. (finále, Kampus Plzeňská, 2. LF UK, Praha-Motol):** 13:00 registrácia finalistov a kontrola prezentácií · 13:30 príchod poroty · 14:00 finálové pitche osobne pred porotou (formulár uvádza 14:10–16:30) · 17:00–18:00 vyhlásenie. Finále sa vysiela online na rakathon.cz.

**Čo sa odovzdáva (formulár submit.rakathon.cz, do soboty 13:00):** názov + krátky popis (do 140 znakov), voliteľne dlhší popis (CZ aj EN) · tím a výzva · pole **„Dopad a AI“** (Ako využívate AI? Aký dopad a pre koho? FHIR od InterSystems?) · odkazy (GitHub, demo, video) a **povinný titulný obrázok 16:9 do 8 MB**. Po odoslaní sa dá upravovať až do uzávierky. Galéria projektov je verejná (`submit.rakathon.cz/projects`) – porotcovia aj partneri ju uvidia.

**Rozdiel proti rubrike pre ceny partnerov:** pravidlá (§8) hovoria o kritériách ako relevancia k výzve, inovatívnosť, technická uskutočniteľnosť, **dopad na zdravotníctvo**, kvalita prototypu, práca s dátami, **používateľská prívetivosť**, implementačný potenciál a kvalita prezentácie. Rozhodnutie poroty je konečné.

**Odhad času na pitch [odhad]:** víťazov výziev môže byť až 29 (9 pražských, 6 brnenských, 5 ostravských a 3 výzvy VZP × 3 mestá = 9). 140 minút (14:10–16:30) / 29 ≈ **4,8 min na tím vrátane výmeny a otázok**. To sedí s trojminútovým pitchom + ~1 min otázok. Porota bude pri 20+ pitchoch unavená; prvých 20 sekúnd rozhodne o pozornosti.

### 1.2 Nedeľná porota (12 mien) [overené – rakathon.cz/lide, označení „Final Sunday jury“]

| Meno | Rola / organizácia | Zorný uhol (čo ho pravdepodobne zaujíma) [odhad podľa role a verejných výrokov] |
|---|---|---|
| Antonín Hlavinka | VZP ČR; vedie Úsek zdravotnej politiky a inovácií (v rozhovoroch ako námestník riaditeľa) | Úspora/rozpočtový dopad, klinický prínos, pilot s KPI, dôkazy; autor podkladu k mamografu |
| Markéta Foldyna Hellová | Ministerstvo zdravotníctva; vedúca sekcie zdravotníckych technológií (od 2. 2. 2026) | Dátami podložený, transparentný systém; podpora českých inovácií |
| Lukáš Kačena | Vládny zmocnenec pre AI (od 12. 1. 2026) | AI vo verejnom sektore a zdravotníctve; regulovaný zdravotný dátový priestor pre AI |
| Miroslav Pavlíček | FN Motol a Homolka; námestník pre informačné technológie (od 1. 6. 2025) | Integrácia do nemocničných systémov, bezpečnosť, prevádzková realita |
| Jakub Cvek | FN Ostrava; vedúci onkologickej kliniky (podľa verejných zdrojov) | Klinická použiteľnosť, rádioterapia/onkológia |
| Jiří Šedo | MOÚ Brno | Klinická prax, štúdie, pacientska cesta |
| Michal Zápotocký | Na rakathon.cz uvedený ako VFN Praha; vo verejných zdrojoch ho nachádzam ako detského onkológa FN Motol **[?]** | Klinický prínos |
| Aleksi Šedo | Riaditeľ NÚVR (výskum rakoviny) | Preklad výskumu do praxe, mladé talenty, spin-offy |
| Petra Adámková | Hlas onkologických pacientov (predsedníčka výboru) | Pacientsky pohľad, prevencia, osveta; podpora opatrovateľov |
| Jiří Pecina | MEDDI hub (zakladateľ) | Telemedicína, AI ako pomoc lekárovi (nie náhrada), EÚ dáta, etika |
| Martin Zubek | InterSystems; riaditeľ českej pobočky (podľa bio z konferencie ITAPA) | Interoperabilita (FHIR), dátový model, cesta k MVP/startupu |
| Michal Bušek | Asseco Central Europe / HL7 ČR | Zapojiteľnosť do nemocničných IS, štandardy, reálny potenciál |

**Čo z toho plynie [odhad]:**
- V sále budú **piati ľudia s reálnou rozhodovacou mocou nad nasadením a peniazmi** (Hlavinka – platca, Foldyna Hellová – ministerstvo, Pavlíček – IT najväčšej nemocnice, Pecina – majiteľ firmy s vlastným produktom, Zubek – investičné ramená InterSystems).
- **Žiadny z porotcov nie je „čistý technik“ ani „čistý lekár“.** Pitch musí byť zrozumiteľný laikovi a zároveň obstáť pri otázkach na bezpečnosť, dáta a integráciu.
- **Pacientska organizácia a MZd sedia v porote** → téma „pacient a prevencia“ rezonuje; slogan „AI“ bez dopadu nie.
- Porota 2025 bola iná: cenu odovzdávali riaditeľ nemocnice, dekan fakulty a prednosta onkologickej kliniky ([FN Motol, 14. 4. 2025](https://www.fnmotol.cz/tiskove-zpravy/mozky-proti-rakovine-rakathon/)). V 2026 je porota „partnerská“ (platca, ministerstvo, firmy) a výzvy hodnotia ich zadávatelia.

---

## 2. Partneri – prehľadová tabuľka

**Stupnica „hodnota networku“ 1–10** (pre náš 2-členný tím: Bruno = video/kreatíva, Maťo = radiačná ochrana; chceme produkt, za ktorý niekto zaplatí):
10 = rozhoduje o nasadení aj peniazoch + má verejný kanál na financovanie + sedí v porote/zadáva výzvu. 5 = užitočný kontakt, ale bez peňazí alebo bez rozhodovacej moci. 1 = takmer žiadna hodnota nad rámec nástrojov.

| Partner | Hodnota | Prečo (najkratšie) | Čo ich na hackathone najviac zaujme |
|---|---|---|---|
| **VZP ČR** | **10** | Najväčší platca, aktívny kanál na úhrady digitálnych inovácií, porotca + zadávateľ + cena | Predikcia/segmentácia + **pilot s KPI a rozpočtom**, A/B test, dôkaz úspory, bezpečnosť dát |
| **FN Motol a Homolka (FNMH)** | **9** | Najväčšia nemocnica, 3 výzvy, IT riaditeľ v porote, precedens z 2025 (spolupráca s víťazom) | Úspora času lekárov/sestier, integrácia do NIS, **reálne dáta a jasný klinický prínos** |
| **InterSystems** (+ Ventures, Caelestinus) | **8** | Hlavný technologický partner, cena 1 500 €, investičné a inkubačné ramená | FHIR/IRIS použité zmysluplne, dátový model, cesta k MVP/startupu |
| **MEDDI hub** | **8** | Majiteľ rozhoduje sám (bez investorov), produkt už beží v MOÚ, porotca + cena + workshop | AI triáž, ktorá nepodhodnotí červenú; AI ako pomoc lekárovi; EÚ hosting |
| **MOÚ Brno** | **7** | Moderný onkologický ústav, vlastná aplikácia s MEDDI, 4 výzvy | Hľadanie štúdií (<30 s), štruktúrovanie správ, lieky/anamnéza |
| **MZd + vláda** (Vojtěch, Foldyna Hellová, Kačena) | **7** | Záštita, politický vplyv, 2 porotcovia; nemá priamy rozpočet pre tím | Dátami podložená, transparentná, mierená na škálu; AI vo zdravotníctve |
| **Organizátor** (Insane Business Ideas / CEE Hacks / Caelestinus: Studeník, Žabka, Vaňásek) | **7** | Brána k partnerom, divoká karta, súhlas s odovzdaním kontaktov | Tímy, ktoré po akcii pokračujú; príbeh pre médiá |
| **AstraZeneca ČR** | **6** | Farmaceutická firma s motívom skorej detekcie pľúc; ponúka podporu, ale nie v porote a nemá nemocničný nákup | Prototyp **pripravený do praxe**; zrozumiteľná komunikácia pacientom |
| **Asseco Central Europe** | **6** | Dodávateľ IS pre štát, poisťovne a poskytovateľov; cena = mentoring + kontakty | MDT Copilot, zdroj ku každému tvrdeniu, FHIR export |
| **FN Ostrava** | **6** | 4 výzvy, pilotné miesto ministerského programu „Zdravotníctvo 4.0“; ale mimo Prahy | Plánovanie stacionára, NOR, MDT asistent |
| **NÚVR** | **5** | Výskumný ústav, riaditeľ v porote; financovanie po 2025 nejasné | Prepájanie vedcov a klinikov, spin-offy |
| **FN Olomouc** | **5** | Zadávateľ 2–3 výziev; hostí výročné stretnutie NÚVR | Vzkazy pro budoucnost (empatia), chirurgia |
| **VFN Praha** | **5** | Zadávateľ SMART ONCO AA; málo verejných informácií o stratégii | Predoperačná príprava bez čakania |
| **Fuck Cancer** | **5** (pre Bruna **7**) | Pacientska komunita a mediálny dosah; malý rozpočet; predseda je kreatívny riaditeľ | Príbeh, značka, zrozumiteľný pacientsky zážitok |
| **Microsoft** | **4** | Nástroje (Azure, Copilot), technickí koučovia; žiadna cena ani miesto v porote | Funkčné riešenie bežiace v Azure (voliteľné) |
| **FN Brno (detská onkológia)** | **4** | Úzko špecializovaná, mimo Prahy, bez porotcu | Nájsť pacientov, ktorých priebeh sa odchyľuje od prognózy |

---

## 3. Partneri – detail

### 3.1 VZP ČR (hlavný partner) – hodnota 10/10

**Priorita 2025–2026 [overené, vzp.cz]:**
- **Financie sú tesné.** Plán VZP na 2026: výdavky 341,2 mld. Kč, príjmy 328,5 mld. Kč, plánovaný deficit 12,7 mld. Kč, krytý z rezerv (na konci 2026 odhadované rezervy ~18 mld.) ([ČTK/Česká tisk. kancelária](https://www.ceskenoviny.cz/zpravy/vzp-na-pristi-rok-planuje-deficit-127-miliardy-kc-dorovna-ho-z-rezerv/2751320)). Preto platí logika „platím za preukázanú hodnotu“.
- **Nový riaditeľ Ivan Duškov** (jar 2026): VZP má byť inštitúcia riadená dátami; priznal, že VZP je „asi 20 rokov pozadu“; chce zdieľať dáta s ÚZIS, platiť za výsledky namiesto počtu výkonov (cieľ: zapracovať do rokovaní o úhradách na 2027) a využívať aplikáciu **MojeVZP (>2,5 mil. používateľov)** na pozvánky na screening a odmeny za zdravé správanie ([vzp.cz, 1. 4. 2026](https://www.vzp.cz/o-nas/aktuality/moderni-vzp-bez-drabu-duskov-sazi-na-data-a-platbu-za-vysledek-pece)).
- **Riadený vstup inovácií** ([vzp.cz, 27. 4. 2026](https://www.vzp.cz/o-nas/aktuality/nove-technologie-v-peci-o-pacienty-i-pro-praci-lekaru-vzp-spousti-rizeny-vstup-inovaci-do-systemu); [Inovačný portál](https://inovace.vzp.cz)): žiadosť podáva výrobca/vývojár; posúdenie do ~3 mesiacov (podľa neskoršieho tlačového vyhlásenia až 120 dní, „fast track“ 90); **dočasná úhrada 12–24 mesiacov**, počas ktorej sa merajú KPI (lepšie výsledky, menej hospitalizácií, zozbierané dáta); potom trvalé zaradenie alebo vyradenie. Podľa portálu VZP neplatí za novosť, ale za preukázanú alebo riadene overiteľnú hodnotu.
- **Spustené 21. 9. 2026** ([tlačová správa](https://www.vzp.cz/o-nas/aktuality/vzp-otevira-dvere-technologickym-inovacim-v-medicine-pomohou-pacientum-i-v-diagnostice-pohlidaji-organizaci-pece-a-vysi-vydaju)): 8 povinných podmienok („hard gates“ – klinická bezpečnosť, ochrana osobných údajov, kybernetická bezpečnosť, jasná klinická zodpovednosť vrátane ľudského dohľadu pri AI, dostupnosť dát na vyhodnotenie, pripravenosť poskytovateľa a i.). Prioritné oblasti: **onkológia ako prvá**, potom kardiológia, diabetes, neurodegeneratívne choroby; kvartálne výzvy.
- **Rozhovor s Hlavinkom (29. 9. 2026)** ([vzp.cz](https://www.vzp.cz/o-nas/aktuality/hlavinka-digitalni-technologie-uz-pouzivame-je-na-case-naucit-se-hodnotit-jejich-prinos)): kvartálna výzva na digitálne technológie v onkológii sa otvára **1. 11. 2026**; **~300 mil. Kč** vyhradených na pilotné úhrady v 2027 (plán, ešte nie schválený rozpočet); VZP očakáva ~100 žiadostí ročne. Hodnotí QALY a dopad na rozpočet; pri úsporách, ktoré prídu neskôr, plánuje dohody o zdieľaní rizika. Žiadateľ musí mať **klinického partnera**; pilot trvá 6–24 mesiacov. Hlavné príklady: telemedicína a AI v rádiodiagnostike.
- **Stav 6. 10. 2026** ([Zdravotnický deník/vzp.cz](https://www.vzp.cz/o-nas/aktuality/vzp-meni-pristup-k-inovacim-prvni-zadosti-uz-jsou-na-stole)): zaregistrovaných 13 subjektov, 2 dokončené žiadosti, **žiadny pilot ešte nie je vo vyhodnotení**. Každý pilot musí vopred definovať cieľovú skupinu, poskytovateľov, trvanie, rozpočet, spôsob úhrady, KPI, plán dát a pravidlá stop/hold/go. Poznámka: tlačová správa hovorí o onkologickej výzve „v októbri“, rozhovor o 1. 11. **[?] presný dátum over na inovace.vzp.cz.**
- **K Rakathonu** ([vzp.cz, 8. 10. 2026](https://www.vzp.cz/o-nas/aktuality/vzp-se-stava-hlavnim-partnerem-rakathonu-soutezicim-otevre-tri-realne-vyzvy-ceskeho-zdravotnictvi)): Duškov: VZP otvára priestor na spoluprácu s univerzitami, vývojármi a start-upmi. Hlavinka: Rakathon sa nemá skončiť vyhlásením víťazov; sľubné nápady sa majú ďalej validovať (vedecká správnosť, technická realizovateľnosť, hodnota pre pacienta) a prípadne pilotovať. Cena: 60 minút s generálnym riaditeľom.

**Ľudia na Rakathone [overené]:** Ivan Duškov (generálny riaditeľ, úvodné slovo), Antonín Hlavinka (porota; podklad k mamografu), Helena Damovská (garantka „Od pozvánky k mamografu“, Praha), Vendula Frodlová (Brno), Květoslava Smolková (Ostrava), Jan Bartyzal (cloud/dáta), Marian Rybář (MZd; garant „Cesta pacienta“), Hana Študentová (garantka „Kvalita péče na konci života“).

**Hodnota networku – 10/10:** (1) platca s verejným kanálom na úhrady, (2) porotca a zadávateľ v jednej osobe, (3) cena = 60 min s riaditeľom, (4) výslovná pozvánka pre startupy, (5) onkologická výzva portálu sa otvára o 2 týždne po finále.
**Riziká a podmienky:** VZP má deficit a hovorí „platíme za hodnotu“; žiadny automatický nárok na úhradu; neprijíma priamo nemocnice, ale **výrobcu/dodávateľa/akademickú inštitúciu** → **potrebujeme právnickú osobu a klinického partnera** [odhad: napr. Brunovo štúdio alebo nová s.r.o.; klinický partner z nemocnice]. VZP dáta sú len pre VZP výzvy a len v tímovom Azure prostredí (04).
**Čo ich zaujme (konkrétne):** (a) číslo „koľko žien navyše príde a koľko to stojí na jednu ženu“, (b) návrh experimentu (A/B test, kontrolná skupina, KPI, pravidlá stop/hold/go – presne to, čo VZP požaduje od pilotov), (c) vysvetliteľnosť (nie čierna skrinka), (d) súlad s GDPR a hostingom v EÚ, (e) využitie existujúcich kanálov (MojeVZP, SMS, praktický lekár).
**Prvý krok po finále:** požiadať o 60 minút „Křeslo pro inovace“ a priniesť jednostránkový **návrh pilotu podľa šablóny VZP** (cieľ, skupina, KPI, rozpočet, dáta, stop/go).

### 3.2 FN Motol a Homolka (FNMH) – hodnota 9/10

**Priorita 2025–2026:**
- **Zlúčenie Motola a Nemocnice Na Homolce od 1. 1. 2026** na základe rozhodnutia MZd z 10. 10. 2025; Národné onkologické centrum (NOC) je „spojivom“ celku ([FN Motol – tlačové vyhlásenie](https://www.fnmotol.cz/wp-content/uploads/2025/12/tiskove-prohlaseni-fnmh.pdf)).
- **Nová budova onkológie v Motole** – investícia 4,96 mld. Kč (väčšinou EÚ/Národný plán obnovy), oddelenia sa otvárajú postupne od polovice augusta, niektoré od októbra; kapacita onkológie +40 % ([Seznam Zprávy](https://www.seznamzpravy.cz/clanek/314984) [sekundárne]; plánovaný rozsah: 2 lineárne urýchľovače, 60 lôžok, 22 ambulancií, denný stacionár pre 84 pacientov – [Seznam Zprávy 2023](https://www.seznamzpravy.cz/clanek/regiony-zpravy-praha-v-prazskem-motole-zacala-stavba-ceskeho-onkologickeho-institutu-za-45-miliardy-korun-238136)).
- **Finančný tlak:** v roku 2025 hlásili hotovosť ~1,2 mld. Kč pri ročnom obrate ~18 mld. Kč ([TN.cz](https://tn.nova.cz/zpravodajstvi/clanek/633289-nemocnice-motol-ma-penize-jen-na-jeden-mesic-prosi-stat-o-temer-miliardovou-pujcku), dátum [?]). Zlúčená nemocnica potrebuje **úspory a efektivitu**, nie dekoratívne projekty [odhad].
- Riaditeľ nemocnice: Petr Polouček (od 1. 4. 2025). V 2025 povedal, že ho príjemne prekvapilo, ako hlboko sa tímy ponorili do odborných tém, a že takých schopných ľudí bude nemocnica v budúcnosti potrebovať ([FN Motol](https://www.fnmotol.cz/tiskove-zpravy/mozky-proti-rakovine-rakathon/)).

**Ľudia na Rakathone [overené]:** Alina Pirshtuk (garantka a mentorka 3 výziev FNMH), Tomáš Büchler (úvodné slovo; prednosta Onkologickej kliniky), David Feltl (NOC; úvodné slovo), Martin Majerčák, Michaela Klimeš Lipánová, Tereza Chrástová (mentori), Miroslav Pavlíček (porota; IT). Hostiteľom finále je 2. LF UK v Motole.

**Hodnota networku – 9/10:** najväčší klinický „piesok“ v ČR, jasný precedens (víťaz 2025 RadioProtect: onkologická klinika Motol prejavila záujem o spoluprácu a dekan 2. LF o ďalšiu spoluprácu, [FEL ČVUT](https://fel.cvut.cz/en/what-s-on/news/37553-technology-from-fee-ctu-changes-cancer-treatment-two-prizes-for-student-teams-from-rakathon-2025)), IT riaditeľ priamo v porote. Chýba: voľný rozpočet (nemocnica šetrí) a snímky/PACS pre výzvy (dataset je len textový, 04).
**Čo ich zaujme:** šetrenie klinického času (napr. „neobvolávať pol republiky“ pri MDT), minimálne zásahy do NIS, FHIR rozhranie, bezpečné dáta v EÚ, tvrdé číslo (minúty na pacienta × počet pacientov).
**Poznámka:** FNMH výzvy majú spoločný textový dataset bez obrazových dát (04) – kto vymyslí simuláciu dostupnosti snímok, dostane sa k jadru problému.

### 3.3 InterSystems (hlavný technologický partner) – hodnota 8/10

**Priorita [overené/sekundárne]:**
- Na Rakathone propaguje **IRIS for Health, FHIR server, vektorové vyhľadávanie a agentný prístup**; hodnotí inovatívnosť, reálny prínos, využitie svojich technológií a technickú ucelenosť. Porota chce vidieť jasne definovaný zdravotnícky problém, rozumné využitie AI/FHIR, dobrý dátový model a **realistickú cestu k MVP alebo startupu** ([developer.intersystems.com](https://developer.intersystems.com/intersystems-challenge-at-rakathon-2026/)).
- **InterSystems Ventures:** nezrieďujúce granty na overenie technického fitu aj kapitálové investície; Digital Health Incubator; „growth toolkit“ po grante (tá istá stránka).
- **Caelestinus** je inkubátor „Digital Health Interoperability and FHIR“ vedený InterSystems Ventures: 5. batch odštartoval 25. 3. 2026, 26 tímov z takmer 200 prihlášok, 3 mesiace online, pre štartupy v štádiu pre-seed až seed ([InterSystems Community](https://community.intersystems.com/node/587766)). Web caelestinus.tech uvádza ako firmu za projektom **Insane Business Ideas s.r.o. – teda organizátora Rakathonu** ([caelestinus.tech](https://www.caelestinus.tech/about)). Staršie ročníky boli podľa partnerských stránok bezplatné a bez podielu vo firme [sekundárne, over pre 2027].

**Ľudia [overené]:** Ondřej Hoferek (mentor/zadávateľ výzvy; InterSystems/HL7), Martin Zubek (porota; riaditeľ českej pobočky podľa konferenčného bio), Michaela Grösslová (kritériá ceny), Gabriel Ing (Praha), Thomas Dyar, Daniil Drozdov (Brno), Daniel Kutáč (Ostrava).

**Hodnota networku – 8/10:** kapitál aj inkubácia, jasná podmienka (musíme **reálne** použiť IRIS/FHIR), cena sa dá kombinovať s ľubovoľnou výzvou (1 500 €) – lacný „druhý lístok“. Nižšie, lebo ide o dodávateľa technológie (nie platcu) a v ČR som nenašiel verejné referencie nemocníc na ich produkty **[?]**.
**Čo ich zaujme:** FHIR ako hlavné dátové úložisko (nie vlastná databáza pacientov – expert Opatřil to na pre-hacku odporúčal), vektorové vyhľadávanie pre RAG (odpovede so zdrojom), pole „FHIR od InterSystems?“ vo formulári, jasná cesta „po hackathone → Caelestinus 2027“.

### 3.4 MEDDI hub – hodnota 8/10

**Priorita [sekundárne – Forbes, Hrot24, SeznamZprávy; dátumy článkov neuvedené]:**
- Český telemedicínsky hráč; používa ho >9 mil. ľudí, obrat >600 mil. Kč (Forbes, titulok: „[Pecinův MEDDI hub tržil přes 600 milionů](https://forbes.cz/byznys-s-telemedicinou-roste-pecinuv-meddi-hub-utrzil-pres-600-milionu-korun/)“), expanzia do ďalších krajín, vlastné miestne tímy.
- **Bez investorov** (Pecina: bez investorov nemôžu „zaliať trh peniazmi“, preto rastú organicky), trh si pripravujú ~2 roky vopred s komorami, poisťovňami a ministerstvami ([Hrot24](https://www.hrot24.cz/clanek/telemedicina-meddi-hub-aplikace-jiri-pecina-zdravotnictvi-etika-HHeAt)).
- **Filozofia:** AI má lekárom pomáhať, nie ich nahrádzať; EÚ servery, žiadne zbieranie citlivých dát navyše, etika pred marketingom; na český trh pozerá skepticky (verejné obstarávania).
- **MEDDI Onco:** v MOÚ od roku 2020 (aplikácia MOU MEDDI; pilot ~70 pacientov, [Seznam Zprávy](https://www.seznamzpravy.cz/clanek/masarykuv-onkologicky-ustav-ma-vlastni-aplikaci-pro-komunikaci-s-pacienty-152521)).

**Ľudia [overené]:** Jiří Pecina (úvodné slovo, porota, zadanie), Patrik Litschmann (mentor na mieste), Erik Hulmák (technický mentor online).

**Hodnota networku – 8/10:** o všetkom rozhoduje jeden majiteľ (rýchle rozhodnutia), existuje reálny produkt a zákazník (MOÚ), cena = ONCO Award + možný workshop a proof of concept. Nižšie, lebo česká verejná správa nie je ich priorita a výzva MEDDI je najčastejšie „obsadená“ (jasné, objektívne meranie → veľa tímov [odhad]).
**Čo ich zaujme:** triáž, ktorá **nepodhodnotí červenú/oranžovú**, správna eskalácia podľa pracovnej doby, zrozumiteľná odpoveď pacientovi, súhrn pre lekára, **beh v EÚ (v zadaní: AWS EU)** – a hlavne ľudský dohľad.

### 3.5 AstraZeneca ČR – hodnota 6/10

**Priorita [sekundárne]:**
- Globálne: cieľ **80 mld. USD tržieb do 2030**, rast ťahá onkológia (2024: +21 %) ([tlačová správa AZ](https://www.investegate.co.uk/announcement/rns/astrazeneca--azn/astrazeneca-to-deliver-80bn-revenue-by-2030-/8209889)). Pľúcna rakovina je pre AZ kľúčová oblasť (Tagrisso, Imfinzi, Enhertu) [sekundárne].
- V ČR nemá AZ verejne popísanú vlastnú „AI stratégiu“; **žiadne špecificky české partnerstvo o pľúcnom screeningu som nenašiel [?]**. V zahraničí podporuje AI rtg hrude (Malajzia, India) – to ukazuje smer.
- Český pľúcny screening: program **Prevence pro plíce** (LDCT = nízkodávkové CT). Od 2022 ním prešlo ~30 tis. klientov VZP (14 tis. len vlani); do konca Q1 2026 pozvaných 43 735, súhlasilo 29 278; 631 rizikových nálezov ([VZP, 28. 7. 2026](https://www.vzp.cz/o-nas/aktuality/screening-rakoviny-plic-absolvovalo-od-jeho-spusteni-temer-30-tisic-klientu-vzp-jen-vloni-to-bylo-14-tisic)). Ministerstvo plánuje pľúcny screening ako štvrtý onkologický program.
- Slack, mentor z AZ: ich záujem je **preklopiť prototyp do klinickej praxe a pomôcť pri ďalšom vývoji** (`#plice-vcas…`, 16. 10. 13:50).

**Ľudia [overené]:** Luboš Matys (mentor, Praha), Josef Plasil (AZ), Ivana Čierná-Peterová (garantka; na rakathon.cz uvedená pri ČPFS – pneumologická spoločnosť, [?]), úvodné slovo za AZ: Matys. Šéf klastra ČR/SR/HU: Julio Ordaz (nástup 1. 12., rok neuvedený **[?]**, [Forbes](https://forbes.cz/astrazeneca-meni-vedeni-novym-sefem-pro-cesko-slovensko-a-madarsko-bude-julio-ordaz/)).

**Hodnota networku – 6/10:** reálna motivácia a ochota pomôcť, ale: nesedí v nedeľnej porote, nenakupuje nemocničné IT, farmaceutické firmy majú prísne pravidlá, čo môžu financovať (komunikácia s pacientmi je citlivá) [odhad]. Cena za víťazstvo vo výzve nie je špecifikovaná.
**Čo ich zaujme:** pacienti identifikovaní **s vysvetlením, prečo boli vybraní/vylúčení**, neutrálna zrozumiteľná správa (nemá pacientovi oznamovať diagnózu ani tvrdiť, že je zaradený do programu), evidencia doručenia a reakcie, kontrola zdravotníkom.
**Poznámka:** v kanáli sa k výzve zatiaľ pridalo len ~10 hackerov (stav 15:45) [Slack] – pravdepodobne nízka konkurencia [odhad].

### 3.6 Asseco Central Europe – hodnota 6/10

**Priorita [sekundárne]:**
- Asseco CE drží 50 % v českej firme **Prosoft** (nemocničné/ambulantné informačné systémy; 2018) a rozvíja centrálne eHealth riešenia pre štát (napr. národný zdravotnícky portál a registre) ([Asseco CE](https://ce.asseco.com/en/press/press-releases/asseco-central-europe-enters-into-a-strategic-partnership-in-the-healthcare-sector-5438/)); zákazníci: štát, poisťovne, poskytovatelia.
- Na Slovensku súvisí projekt **Onkologická cesta pacienta pre NCZI** (podľa Slacku/04). Verejne známy projekt NCZI „OnkoAsist“ cieli skrátiť cestu pacienta s podozrením na rakovinu z >160 na 60 dní, hodnota takmer 11 mil. € ([TASR](https://www.teraz.sk/zdravie/k-liecbe-rakoviny-sa-ludia-dostanu-po/641984-clanok.html)); **či ho realizuje Asseco, nie je potvrdené [?]**.
- Na Rakathone: výzva **MDT Copilot** s explicitnými váhami (klinická hodnota a UX 30 %, konfigurovateľnosť 20 %, AI a spoľahlivosť 20 %, dáta a štandardy 15 %, MDT proces a zodpovedná AI 15 %, bonus do +10 %) a **cena Asseco: rozvoj prototypu s mentormi a kontakty v zdravotníctve** (04, INTRO slajdy).

**Ľudia [overené]:** Michal Bušek (porota; garant MDT Copilot; úvodné slovo; HL7 ČR), Ľuboslav Piljan (mentor).

**Hodnota networku – 6/10:** dodávateľ, ktorý by vedel produkt zapojiť do nemocničných IS; cena je vecná (mentoring), nie peniaze. Zadanie MDT Copilot je najrozsiahlejšie na rozpracovanie.
**Čo ich zaujme:** každé tvrdenie AI s odkazom na zdroj (klik), „v dostupnej dokumentácii sa nenachádza“ namiesto odhadu, ľudský dohľad, export do FHIR/PDF, konfigurovateľné roly.

### 3.7 Microsoft – hodnota 4/10

- **Rola:** technologický partner; Azure + modely cez portál (API kľúč), GitHub Copilot ($100 kredit na osobu), technickí koučovia – **bez cenovej kategórie a bez miesta v porote**. Použitie Azure/Microsoft technológií **neovplyvňuje hodnotenie výziev** (organizátor, 03).
- MZd podľa dokumentu z 2025 používa chatbota na modeli OpenAI v prostredí Azure ([MZd 2025](https://mzd.gov.cz/wp-content/uploads/2025/02/11.pdf), [sekundárne]). Dragon Copilot (klinický AI asistent) nie je podľa zoznamu krajín na stránke Microsoft Canada dostupný v ČR ([microsoft.com](https://www.microsoft.com/en-ca/health-solutions/clinical-workflow/dragon-copilot)) **[?]**.
- **Ľudia:** Michal Marušan, Olena Vasylenko (onko/bio dáta), Simon Procházka (Brno), Bernardo Sunderhus (frontend), Vladimír Mach (partner).
- **Hodnota 4/10:** nástroje a rýchla pomoc; networková hodnota pre pilotovanie v nemocniciach je nízka. Kladný efekt je nepriamy: Azure je prostredie VZP.

### 3.8 MOÚ Brno – hodnota 7/10

- **Centrum onkologickej prevencie otvorené 26. 5. 2026**, celková investícia do infraštruktúry >1,12 mld. Kč ([MZd](https://mzd.gov.cz/tiskove-centrum-mz/ministerstvo-zdravotnictvi-podporilo-otevreni-centra-onkologicke-prevence-v-brne/)); EÚ eviduje príspevok z fondu obnovy ~41 mil. € s cieľom +20 % klientov ročne ([Európska komisia](https://commission.europa.eu/projects/establishment-and-development-cancer-prevention-centre-and-infrastructure-innovative-and-supportive_en)).
- **Vlastné digitálne nástroje:** MEDDI Onco od 2020. Podľa zadania TriaLink má MOÚ >140 aktívnych štúdií, v intervenčných je len ~5 % pacientov (Západ 10–15 %); ručné hľadanie štúdie ~45 min, cieľ <30 s (04).
- **Ľudia:** Marek Svoboda (úvodné slovo), Jiří Šedo (porota), Martin Rusinko, Michal Standara, Peter Grell, Šárka Selvekerová (zadávatelia).
- **Hodnota 7/10:** otvorená k digitalizácii a k praxi, ale 4 výzvy sú v Brne **[?]** (nie je jasné, či ich môže riešiť tím z Prahy) a MOÚ nie je platca.

### 3.9 Ministerstvo zdravotníctva a vláda – hodnota 7/10

- **Záštita:** premiér, minister Adam Vojtěch, vládny zmocnenec pre AI Lukáš Kačena; úvodné slovo mal minister.
- **Priorita [overené]:** Kačena (od 12. 1. 2026, sídli na MPO) má v prezentácii z marca 2026 AI pre zdravotníctvo a duševné zdravie, misijný AI program a **regulovaný zdravotný dátový priestor pre AI**; podľa neho premiér sleduje využitie AI aj vo zdravotníctve ([ekonomickydenik.cz](https://ekonomickydenik.cz/babis-ai-mezi-lidi-lukas-kacena/); [prezentácia](https://www.kb.cz/getmedia/fb06c8ca-2d50-438e-a67b-1686a16b4685/AI-jako-priorita-vlady-L-Kacena-2026.pdf)). Ministerstvo zdravotníctva pripravuje **rezortnú stratégiu AI vo zdravotníctve** (predstavenie plánované koncom 2026, [MZd – dokument z apríla 2026](https://mzd.gov.cz/wp-content/uploads/2026/04/68.pdf), [sekundárne]) a vytvorilo sekciu zdravotníckych technológií, ktorú od 2. 2. 2026 vedie Markéta Foldyna Hellová – chce dátami podložený, transparentný systém, ktorý podporuje české inovácie a kvalitnú starostlivosť ([MZd](https://mzd.gov.cz/tiskove-centrum-mz/vedeni-klicovych-sekci-ministerstva-zdravotnictvi-prebiraji-marketa-foldyna-hellova-patrik-zachar-a-petr-jarema/)).
- **Zdravotníctvo 4.0 Challenge:** spustená 24. 2. 2026 v Ostrave (VŠB), má spájať kliniku a technické tímy a viesť k prototypom s meratelným prínosom; pilotný rok v Ostrave, zámer rozšíriť do ďalších regiónov ([MZd](https://mzd.gov.cz/tiskove-centrum-mz/ministr-v-ostrave-zahajil-vyzvu-zdravotnictvi-4-0-a-podporil-vyuku-ai-na-lekarskych-fakultach/)).
- **Prevencia:** kampaň „Ukaž rakovině záda“ (nov. 2025–mar. 2026): 80 % ľudí verí v zmysel prevencie, ale na screening chodí ~60 % (Ipsos pre ÚZIS); od 1. 1. 2026 sa vekový limit bezplatného testu na rakovinu hrubého čreva znížil z 50 na 45 rokov ([MZd](https://mzd.gov.cz/tiskove-centrum-mz/ukaz-rakovine-zada-nova-kampan-motivuje-cechy-k-prevenci-a-screeningu/)).
- **Hodnota 7/10:** dvaja porotcovia a politický „dáždnik“; ministerstvo nemá pre tím priamy rozpočet. Pitch, ktorý hovorí jazykom „dátami podložené, transparentné, škálovateľné, bezpečné“, im sedí.

### 3.10 Organizátor – Insane Business Ideas / CEE Hacks / Caelestinus – hodnota 7/10

- Tomáš Studeník (zakladateľ; v slajdoch „Caelestinus – CNCR.tech“), Petr Vaňásek (hlavný kontakt, Brno), Petr Žabka (Ostrava; manažér programu Caelestinus podľa rakathon.cz), Ondřej Baštář (logistika), Matyáš Michel, Martin Lahučký.
- **Čo vieme o ich vkuse:** ten istý Studeník organizoval Smart Health Hackathon v IKEM; v 2019 hodnotili **inovatívnosť, obchodný potenciál a technologickú vyspelosť** ([Ekonomický deník](https://ekonomickydenik.cz/aplikace-nevidome-diabetiky-i-mene-cekani-osetreni-ikem-hostil-hackathon)). V 2026 sa to prekladá do kritérií 1–5 (kap. 1.1).
- **Prečo má hodnotu:** divoká karta Caelestinus, kontakty partnerom (so súhlasom), mediálne výstupy (Zdravotnický deník je odborný mediálny partner), pozvánky na nadväzné podujatia (napr. 19. 10. stretnutie výrobcov NIS v ILF – cena pre víťazný tím, 02).
- **Tip:** overiť, či sme pri registrácii dali súhlas s odovzdaním kontaktov partnerom (pravidlá §12); ak nie, požiadať Studeníka o predstavenie ručne.

### 3.11 Nemocnice mimo FNMH (stručne)

- **FN Ostrava – 6/10.** Jakub Cvek (porota; Onkologická klinika), Ondřej Volný (zadávateľ; neurológ – používajú AI softvér na CT mozgu pri mozgovej príhode, [Forbes](https://forbes.cz/umela-inteligence-meni-ceske-zdravotnictvi-co-uz-umi-a-kolik-penez-usetri/)), Erika Hajnová Fukasová (mentorka; v Slacku uvedená aj ako porotkyňa), Magdaléna Najbrtová. Nové onkologické centrum >2 mld. Kč s dokončením ~2028 (údaje sa líšia, [Polar.cz](https://polar.cz/porady/overwrite-docx/34495)) **[?]**. Je pilotným miestom ministerského programu „Zdravotníctvo 4.0“. 4 výzvy (AI sprievodca, MDT asistent, plánovanie stacionára, AI NOR). Mimo Prahy.
- **FN Olomouc – 5/10.** Hana Študentová (VZP výzva „Kvalita péče na konci života“), Lenka Fuxová (Vzkazy pro budoucnost), Kateřina Holá, Vladimír Študent (robotická chirurgia; da Vinci od 2009, >2 000 operácií do cca 2017 [sekundárne]). Hostí výročné stretnutie NÚVR 23.–25. 11. 2026 (cena NÚVR). Nie je v porote.
- **VFN Praha – 5/10.** Jan Bláha (SMART ONCO AA), Zuzana Bielčiková (VZP výzva „Cesta pacienta“; VFN / Nemocnice Na Františku). K strategickým prioritám VFN v 2026 som nenašiel konkrétny verejný zdroj **[?]**.
- **FN Brno (detská onkológia) – 4/10.** Riaditeľ FN Brno prof. Jaroslav Štěrba (od 2020; detský onkológ), klinika má od jan. 2025 certifikáciu ITCC pre klinické štúdie ([LF MU](https://med.muni.cz/media/3798182/2025_01_06-tz-lf-mu-prijeti-mezi-elitu-detske-onkologii-zajisti-studie-i-leky.pdf)). Výzva „Když realita překoná prognózu“ (garant podľa Slacku Vítězslav Dušek **[?]**; mentorka Anna Winklerová). Nemá porotcu.

### 3.12 NÚVR – hodnota 5/10

- Národný ústav pre výskum rakoviny: sieť 71 výskumných tímov z 11 pracovísk (Praha, Olomouc, Brno) financovaná z Národného plánu obnovy (~1,4 mld. Kč, program EXCELES), grant bol do konca 2025; koordinátor žiadal pokračovanie zo štátneho rozpočtu – **rozhodnutie nenájdené [?]** ([Česká televize](https://ct24.ceskatelevize.cz/clanek/domaci/vysledky-z-laboratori-v-praxi-vznikl-novy-cesky-institut-pro-vyzkum-rakoviny-15464), [České noviny](https://www.ceskenoviny.cz/zpravy/zlepsit-lecbu-rakoviny-ma-za-cil-spoluprace-vedcu-v-novem-narodnim-ustavu/2262355)).
- Priorita (NÚVR k Rakathonu): podpora mladých vedcov, rýchlejší prechod výskumu do klinickej praxe, spin-offy ([nuvr.cz](https://www.nuvr.cz/en/2026/09/04/ready-to-hack-cancer-6695/)). Šedo (riaditeľ) je porotcom aj zadávateľom výzvy „Research Matchmaker“.
- **Hodnota 5/10:** vedecká dôveryhodnosť a výskumné kontakty, nie pilot ani peniaze. Cena: účasť na Czech Annual Cancer Research Meeting (Olomouc, 23.–25. 11. 2026).

### 3.13 Fuck Cancer – hodnota 5/10 (pre Bruna 7)

- Pacientska organizácia: predseda David Foldyna (kreatívny riaditeľ v reklamnej agentúre), podpredseda Petr Vančura; v 2026 kampane „Neprošvihni to“ (s Českým baseballovým zväzom) a „Buď! Fuck Cancer“, prevenčný obsah, portál Xko ([Forbes](https://forbes.cz/rakovino-jdi-do-hajzlu-tri-marketeri-meni-povedomi-o-strasaku-lidstva/), [MediaGuru](https://www.mediaguru.cz/cesky-baseball-a-fuck-cancer-vyzyvaji-kampani-k-prevenci)). K aplikácii Twincer som verejné zdroje nenašiel **[?]** (iba Slack/04).
- **Čo ich zaujme:** ľudský príbeh, zrozumiteľný pacientsky zážitok, silné video – to je Brunovo remeslo. Rozpočet je malý (nadácia z darov), takže ide skôr o značku a dosah než o peniaze.

### 3.14 Ďalší partneri (krátko)

| Partner | Rola | Hodnota | Poznámka |
|---|---|---|---|
| **ÚZIS / Národné screeningové centrum** | Od mája 2025 vláda poverila NSC koordináciou screeningových programov; správca dát a Národného onkologického registra | 5 | Pre mamograf je to „strážca“ programov a dát; partner Rakathonu (slajdy) |
| **NCEZ** (Národné centrum elektronického zdravotníctva) | Štátny eHealth (štandardy, API) | 5 | Žiadne konkrétne AI priority som nenašiel **[?]** |
| **HL7 ČR** (Kružík, Bušek) | Štandardy FHIR | 4 | Pozvánka na HL7 Málaga 16.–20. 11. (02) |
| **Hlas onkologických pacientov** | Pacientska platforma; Petra Adámková v porote | 5 | Vstup k pacientom, ak ide o verejnú osvetu/prevenciu |
| **BMS, CzechInvest/CzechBusiness** | Firemní partneri | 3 | Verejne nenašiel dôvod/rolu **[?]** |
| **Zdravotnický deník** | Odborný mediálny partner | 4 | Možnosť PR po finále |
| **PitchPerfect.cz** | Cena hackerov – masterclass v hodnote 30 000 Kč | 3 | |
| **prg.ai, ČAUI, CNAIP, brno.ai, JIC, Mladí lékaři, AVDZP** | „Network“ partneri | 3 | Komunity, nie platcovia |

---

## 4. Čo vyhráva zdravotnícke hackathony a 3-minútové pitche

### 4.1 Rakathon 2025 – čo vieme [overené, 01]

- 29 tímov, 150+ ľudí, 48 h, 8 výziev, fond 150 000 Kč. **Hlavná cena poroty (50 000 Kč): RadioProtect** (Pixel Predators, ČVUT) – kontrola polohy pri ožarovaní porovnaním plánovacieho a kontrolného CT; odlišný prístup (3D transformácia celého objemu, kým ostatní robili 2D segmentáciu); onkologická klinika Motol po akcii začala spolupracovať ([FEL ČVUT](https://fel.cvut.cz/en/what-s-on/news/37553-technology-from-fee-ctu-changes-cancer-treatment-two-prizes-for-student-teams-from-rakathon-2025)). **Cena hackerov: RadMan** (optimalizácia plánu PET a objednávok rádiofarmák, matematická optimalizácia MILP – nie LLM; beží na radman.cz). **3. miesto + cena Novartis: IOC** (predikcia relapsu rakoviny prsníka na syntetických dátach ÚZIS; cena = 20 h mentoringu + prezentácia pred odbornou radou) ([FIT ČVUT](https://fit.cvut.cz/en/life-at-fit/fit-live/success-stories/22708-breast-cancer-recurrence-prediction-tool-developed-by-fit-ctu-students-at-rakathon-2025)).
- Oficiálna rubrika 2025 nebola zverejnená; z komentárov porotcov: ocenená bola **hĺbka ponoru do odbornej témy** a „takých schopných ľudí budeme potrebovať“ (riaditeľ nemocnice). Druhé miesto sa nenašlo **[?]**.

### 4.2 Čo vyhráva inde (dôkazy)

| Zdroj | Čo hovorí | Čo z toho plynie |
|---|---|---|
| **CAMTech, 12 zdravotníckych hackathonov 2012–2015** (BMJ Innovations 2017; 363 tímov) | Po v priemere 12,2 mesiaci malo pokrok 30,3 % projektov; 24,7 % pilotné testovanie; 27,2 % biznis plán; 15 nových firiem; zdroje 64 mil. USD, ale **medián grantu len 1 800 USD** (jedna firma = 62,5 mil.). Priemerný tím 4,8 člena; ~61 % tímov s ≥3 odbormi. Autori sú z CAMTech (samohodnotenie), prediktory netestovali. ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC5293858)) | Reálne pokračovanie je menšina; **cena nie je cieľ, ale nástroj na pokračovanie**. Preto kritérium 4 a 5 o pokračovaní. |
| **Nolte, Chounta, Herbsleb (CSCW 2020), veľká štúdia hackathon projektov** | Krátkodobé pokračovanie súvisí s technickou prípravou, počtom technológií a víťazstvom; dlhodobé s **rôznorodosťou zručností v tíme** a úmyslom projekt rozšíriť; intenzívna krátkodobá aktivita súvisí s nižšou šancou dlhodobého pokračovania. ([NSF PAR](https://par.nsf.gov/servlets/purl/10284449)) [sekundárne; nepodarilo sa mi načítať celý text] | Tím s rôznymi rolami (obsah + technika + príbeh) a jasný plán „čo ďalej“. |
| **MIT Hacking Medicine** | Spoluriaditeľ: cieľom je vidieť tímy po 2, 6 a 12 mesiacoch [sekundárne]; má mesačný akcelerátor BeyondHack pre tímy, ktoré pokračujú ([MIT HM](https://hackingmedicine.mit.edu/events/grandhack-2025)) | Poroty premýšľajú o „druhom dni“. |
| **EUvsVirus / WirVsVirus (2020)** | EUvsVirus: >30 000 ľudí, 2 164 projektov, 117 finalistov išlo do „matchathonu“ s firmami a investormi; hodnotilo sa: dopad, technická zložitosť, inovatívnosť, dokončenosť prototypu, biznis plán ([i-com.it](https://www.i-com.it/en/?p=45467)). Nemecký WirVsVirus: lekcia, že bez **implementačného programu** sa realizuje málo nápadov ([netzpolitik](https://netzpolitik.org/2021/lektionen-aus-wirvsvirus-gemeinsam-gegen-die-krise-geht-das/)) | Najviac váži **pripravenosť na pilot** a existencia následného kanála (VZP portál je presne taký). |
| **Smart Health Hackathon, IKEM Praha (2019, 2020)** | 2019: kritériá inovatívnosť, obchodný potenciál, technologická vyspelosť; víťaz **GlukoScan** – tím oslovil nevidiaceho diabetika a odhadol ≥10 000 postihnutých v ČR ([Ekonomický deník](https://ekonomickydenik.cz/aplikace-nevidome-diabetiky-i-mene-cekani-osetreni-ikem-hostil-hackathon)). 2020: porota ocenila **rýchlo vytvorenú funkčnú aplikáciu** vrátane webovej verzie, ktorá komunikuje s databázou nemocničného IS; víťazný tím založil startup ([Ekonomický deník](https://ekonomickydenik.cz/aplikace-pro-snadnejsi-davkovani-heparinu-a-inzulinu-vyhrala-zdravotnicky-hackathon-letos-probihal-zcela-online/)) | Reálny používateľ v tíme + funkčná vec + napojenie na IS. |
| **Welsh Health Hack (UK)** | Hlavný porotca hodnotí 3 veci: klinická potreba, dopad a hodnota, **realizovateľnosť (rýchle výhry)**; prvé 4 pitche ide na investíciu ([Life Sciences Hub Wales](https://lshubwales.com/story-welsh-health-hack)) | Rovnaké jadro ako Rakathon kritérium 2. |
| **bitsxlaMarató 2025 (Barcelona, onkológia)** | 187 hackerov, 48 projektov, 5 výziev; víťazi riešili **úzke biomedicínske úlohy** (relaps rakoviny endometria, KIR u leukémií, meduloblastóm…) ([FIB UPC](https://www.fib.upc.edu/en/news/hackathon-bitsxlamarato-2025)) | Úzko, nie široko. |
| **Mount Sinai Health Hackathon (formulár hodnotenia)** | Dve skupiny po 5 položiek: koncept (klinická relevancia a platnosť, potenciálny klinický dopad, komerčný potenciál, novosť, dizajn) a realizácia (pokrok dema, funkčnosť, UX, integrácia technológie, technická sofistikovanosť) ([icahn.mssm.edu](https://icahn.mssm.edu/files/ISMMS/Assets/About%20the%20School/Sinainnovations/Hackathon/health_hackathon_scoring.pdf)) [podľa výsledkov vyhľadávania; PDF som neprečítal celé] | Zhoduje sa s oficiálnymi kritériami Rakathonu. |
| **Claude hackathony (Anthropic, 2026)** | Z víťazov Opus 4.6 boli 4 z 5 **nie profesionálni vývojári**: právnik postavil CrossBeam na probléme s číslami (>90 % zamietnutí povolení, 6 mesiacov, 30 000 USD), mesto Buena Park zvažuje nasadenie; kardiológ 3. miesto. Opus 4.7: 1. miesto **Medkit** (lekár-softvérista), pilotné projekty s 3 lekárskymi fakultami a farmou ([Claude Blog](https://claude.com/blog/meet-the-winners-of-our-built-with-opus-4-6-claude-code-hackathon), [Opus 4.7](https://www.claude.com/blog/meet-the-winners-of-built-with-opus-4-7-claude-code-hackathon)) | Doménový expert + konkrétny bolestivý problém s číslom + pomenovaný pilotný zákazník; nie kód, ale poznanie problému. |

### 4.3 Vzorce víťazov (zhrnutie, ordered by dôkaz)

1. **Jeden presný krok pracovného postupu a jeden pomenovaný používateľ.** (RadioProtect, RadMan, GlukoScan, bitsxlaMarató)
2. **Odlišný prístup tam, kde ostatní idú rovnakou cestou** (3D vs. 2D; exaktná optimalizácia vs. LLM). Rakathon kritérium 3.
3. **Funkčné demo na realistických dátach, nie slajdy.** Kritérium 1 pýta, čo tím „reálne vytvoril“ počas hackathonu; 2020 IKEM porota ocenila „rýchlo vytvorenú funkčnú aplikáciu“.
4. **Číslo hneď na začiatku** (čas, cena, objem; a odkiaľ je). CrossBeam: 90 %, 6 mesiacov, 30 000 USD; VZP: účasť 18,9 % vs. 3,2 % pri opakovane oslovených (z podkladu).
5. **Zhoda s obmedzeniami zadávateľa:** bezpečnosť, dáta, regulácia, integrácia (kritérium 2). Experti na pre-hacku varovali: nestavať vlastnú databázu pacientov ani vlastné e-žiadanky, používať FHIR/IHE (02).
6. **Ľudský dohľad a bezpečnosť ako súčasť návrhu** (MEDDI, MDT Copilot, VZP „jasná klinická zodpovednosť“). Pitch by mal hovoriť: *nestanovuje diagnózu, nemení liečbu, pri pochybnosti eskaluje*.
7. **Dôkaz kontaktu s používateľom** (GlukoScan: rozhovor s nevidiacim diabetikom; mentor/lekár, ktorý to videl).
8. **Cesta k pilotu je hotová na papieri:** kto je žiadateľ, klinický partner, KPI, rozpočet, stop/go (to je presne šablóna VZP).
9. **Rôznorodý tím a motivácia pokračovať** (kritérium 5; Nolte; 2025 víťazný tím spájal informatikov a bioinformatičku). Porotca sa pýta: „Kto to bude robiť v pondelok?“
10. **Následný kanál existuje.** 2025: Motol, Novartis; 2026: VZP kreslo pre inovácie, Caelestinus, Asseco mentoring, MEDDI PoC, NÚVR konferencia.

### 4.4 Čo prehráva [odhad z dôkazov vyššie a z rád expertov]

- Všeobecný chatbot alebo „platforma pre všetko“ (2025 víťazi boli úzki).
- Technológia bez čísla a bez používateľa („AI robí X“ bez toho, kto a koľko ušetrí).
- Tvrdenia o diagnostike alebo zmene liečby (pravidlá aj porota to vylučujú).
- Skutočné dáta pacientov (pravidlá §4 zakazujú).
- **Nezdeklarovaný predtým vytvorený kód** (organizátor: hodnotí sa len to, čo vzniklo počas hackathonu; všetko pred tým treba deklarovať a oddeliť, 03).
- Pitch dlhší než čas, alebo živé demo bez zálohy (pri ~29 pitchoch je malý priestor na chyby) [odhad].

### 4.5 Šablóna 3-minútového pitchu (mapované na 5 oficiálnych kritérií)

| Čas | Obsah | Kritérium |
|---|---|---|
| 0:00–0:20 | **Hák:** konkrétny človek + jedno číslo (napr. pre mamograf: 292 176 pozvánok v 2024, rovnaký list pre všetky ženy; pri opakovane oslovovaných len 3,2 % účasť – podklad VZP) | 2 |
| 0:20–0:45 | Kto má problém, kto platí a **komu to patrí** (zadávateľ výzvy, v sále ho poznajú) | 2 |
| 0:45–1:45 | **Video 60–75 s, jeden scenár od začiatku do konca, skutočná obrazovka** (nie animácia) | 1, 3 |
| 1:45–2:15 | Ako to funguje: kde je AI, čo je pravidlo, ako sa overuje (zdroje, ľudský dohľad), čo vzniklo teraz a čo je z minula; FHIR/EÚ hosting | 1, 2 |
| 2:15–2:40 | **Pilot na jednom riadku:** skupina, KPI, trvanie, náklad, kto je klinický partner; ako to ide inam (škálovanie) | 2, 4 |
| 2:40–3:00 | Tím (kto je odborník na čo), **čo robíme v pondelok**, jedna konkrétna žiadosť (napr. 60 min s riaditeľom, pilotný partner) | 5 |

**Poznámky:**
- Odpoveď v poli „Dopad a AI“ vo formulári (do soboty 13:00) sa dostane aj k porote cez galériu; napíšte ju rovnako ako hák pitchu (číslo + kto + dopad + kde je AI + FHIR áno/nie).
- Titulný obrázok 16:9 je prvé, čo uvidia. Nech je to jeden výsledok (nie logo).
- Oficiálne podporený výstup je aj **ukážkové video** a **GitHub** – video má byť pripravené v dvoch dĺžkach (60 s do formulára, 75 s do pitchu).
- Pri technickej otázke porotcu je správna odpoveď „nestanovuje diagnózu, rozhodnutie je na lekárovi, dáta ostávajú v EÚ, rozhranie je FHIR“.

---

## 5. Implikácie pre rozhodnutie o výzve (vstup, nie odporúčanie)

1. **Ak je cieľom „niekto za to zaplatí“, jediný partner s verejným kanálom na peniaze je VZP** (Inovačný portál, onkologická výzva 1. 11., ~300 mil. Kč na 2027). Výzva „Od pozvánky k mamografu“ má **návrh experimentu (úloha 04)** presne v tvare, ktorý VZP požaduje od pilotov, a jej autor je v porote.
2. **Zadávateľ rozhoduje o sobotnom víťazovi.** Výber výzvy je zároveň výber „prvého porotcu“ a jeho komunity (mamograf → Damovská/Hlavinka; MEDDI → Pecina/Litschmann; MDT Copilot → Bušek; AZ → Matys/Čierná-Peterová; FNMH výzvy → Pirshtuk).
3. **Cena InterSystems (1 500 €) je lacná druhá šanca**: dá sa kombinovať s ľubovoľnou výzvou; vyžaduje reálne použitie IRIS/FHIR, čo zvládne Claude Code, ale musí to byť skutočné (nie nálepka).
4. **Hodnotenie „využiteľnosť v praxi“ zvýhodňuje jednoduchosť**: čím menej integrácií a regulácie, tým presvedčivejšie „dá sa to nasadiť“. Pre AZ výzvu je to takmer pravidlový nástroj; pre MEDDI je to dobre meraný problém s veľa tímami; MDT Copilot je technicky najširší.
5. **Právna osoba:** ak chceme VZP cestu, treba subjekt, ktorý môže byť „zodpovedným žiadateľom“ (výrobca/dodávateľ) a klinického partnera [odhad].
6. **Nezabudnúť:** jeden tím = jedna výzva (+ InterSystems cena). Brno/Ostrava výzvy – nie je jasné, či ich môže riešiť tím z Prahy **[?]**.

---

## 6. Otvorené otázky a čo som nenašiel

- Kto okrem zadávateľov hodnotí v sobotu (zloženie miestnych porôt), a či je oficiálne rozpísané bodovanie (slajdy kritériá iba menujú, váhy nie sú).
- Presný dátum otvorenia onkologickej výzvy VZP (1. 11. v rozhovore, „október“ v inom texte) a či majú Rakathon tímy zvýhodnený vstup. Overiť na inovace.vzp.cz.
- Zápotocký: VFN (rakathon.cz) vs. detská onkológia Motol (verejné zdroje).
- Konkrétne české referencie InterSystems v nemocniciach; konkrétne zdravotnícke projekty Microsoftu v ČR; Asseco ako zhotoviteľ OnkoAsist; priority NCEZ; dôvod účasti BMS a CzechInvest.
- Podmienky Caelestinus pre batch 2027 (bezplatný, bez podielu?).
- Dátum článkov o MEDDI (Forbes/Hrot24) – čísla (obrat, používatelia) sú bez dátumu.
- Financovanie NÚVR po 2025.
- Druhé miesto Rakathon 2025 a presná rubrika 2025.
- Zloženie sobotných miestnych porôt a to, či sa VZP výzvy hodnotia „v každom meste samostatne“ (Slack: áno, víťaz z každého mesta ide do finále).
- LinkedIn (HTTP 999) a niektoré novinové weby (Forbes, BusinessInfo) som nemohol plne načítať; niektoré tvrdenia sú preto zo súhrnov vyhľadávania a označené [sekundárne].

---

## 7. Zdroje (hlavné)

**Rakathon (oficiálne):** [rakathon.cz](https://rakathon.cz) · [rakathon.cz/lide](https://rakathon.cz/lide) · [Pravidlá a podmienky v1.0 (PDF)](https://bqcunktidwhqgkjnisbp.supabase.co/storage/v1/object/public/terms/terms/1782206443390-Rakathon_2026_pravidla_a_podminky_ucasti_2_.pdf) · slajdy INTRO Praha (Slack `#03-info-praha`, uložené lokálne) · [InterSystems challenge](https://developer.intersystems.com/intersystems-challenge-at-rakathon-2026/) · [NÚVR](https://www.nuvr.cz/en/2026/09/04/ready-to-hack-cancer-6695/)
**VZP:** [priorita 2026 (Kabátek, 5. 1.)](https://www.vzp.cz/o-nas/aktuality/udrzet-penize-a-pustit-do-systemu-ai-sef-vzp-nastinil-priority-pro-rok-2026) · [Duškov 1. 4.](https://www.vzp.cz/o-nas/aktuality/moderni-vzp-bez-drabu-duskov-sazi-na-data-a-platbu-za-vysledek-pece) · [riadený vstup inovácií 27. 4.](https://www.vzp.cz/o-nas/aktuality/nove-technologie-v-peci-o-pacienty-i-pro-praci-lekaru-vzp-spousti-rizeny-vstup-inovaci-do-systemu) · [spustenie portálu 21. 9.](https://www.vzp.cz/o-nas/aktuality/vzp-otevira-dvere-technologickym-inovacim-v-medicine-pomohou-pacientum-i-v-diagnostice-pohlidaji-organizaci-pece-a-vysi-vydaju) · [Inovačný portál](https://inovace.vzp.cz) · [Hlavinka 29. 9.](https://www.vzp.cz/o-nas/aktuality/hlavinka-digitalni-technologie-uz-pouzivame-je-na-case-naucit-se-hodnotit-jejich-prinos) · [prvé žiadosti 6. 10.](https://www.vzp.cz/o-nas/aktuality/vzp-meni-pristup-k-inovacim-prvni-zadosti-uz-jsou-na-stole) · [VZP hlavný partner Rakathonu 8. 10.](https://www.vzp.cz/o-nas/aktuality/vzp-se-stava-hlavnim-partnerem-rakathonu-soutezicim-otevre-tri-realne-vyzvy-ceskeho-zdravotnictvi) · [plán 2026 – ČTK](https://www.ceskenoviny.cz/zpravy/vzp-na-pristi-rok-planuje-deficit-127-miliardy-kc-dorovna-ho-z-rezerv/2751320) · [pľúcny screening](https://www.vzp.cz/o-nas/aktuality/screening-rakoviny-plic-absolvovalo-od-jeho-spusteni-temer-30-tisic-klientu-vzp-jen-vloni-to-bylo-14-tisic)
**MZd/vláda:** [Zdravotníctvo 4.0 Challenge](https://mzd.gov.cz/tiskove-centrum-mz/ministr-v-ostrave-zahajil-vyzvu-zdravotnictvi-4-0-a-podporil-vyuku-ai-na-lekarskych-fakultach/) · [sekcie MZd (Foldyna Hellová)](https://mzd.gov.cz/tiskove-centrum-mz/vedeni-klicovych-sekci-ministerstva-zdravotnictvi-prebiraji-marketa-foldyna-hellova-patrik-zachar-a-petr-jarema/) · [Kačena](https://ekonomickydenik.cz/babis-ai-mezi-lidi-lukas-kacena/) · [Ukaž rakovině záda](https://mzd.gov.cz/tiskove-centrum-mz/ukaz-rakovine-zada-nova-kampan-motivuje-cechy-k-prevenci-a-screeningu/)
**Nemocnice:** [FNMH zlúčenie](https://www.fnmotol.cz/wp-content/uploads/2025/12/tiskove-prohlaseni-fnmh.pdf) · [FN Motol 2025 výsledky](https://www.fnmotol.cz/tiskove-zpravy/mozky-proti-rakovine-rakathon/) · [MOÚ centrum prevencie](https://mzd.gov.cz/tiskove-centrum-mz/ministerstvo-zdravotnictvi-podporilo-otevreni-centra-onkologicke-prevence-v-brne/) · [Výročná správa FN Motol 2025](https://www.fnmotol.cz/wp-content/uploads/2026/06/Vyrocni-zprava-2025.pdf)
**Firmy:** [MEDDI – Hrot24](https://www.hrot24.cz/clanek/telemedicina-meddi-hub-aplikace-jiri-pecina-zdravotnictvi-etika-HHeAt) · [Caelestinus](https://www.caelestinus.tech/about) · [InterSystems Community – batch 2026](https://community.intersystems.com/node/587766) · [Asseco CE – Prosoft](https://ce.asseco.com/en/press/press-releases/asseco-central-europe-enters-into-a-strategic-partnership-in-the-healthcare-sector-5438/) · [AZ 80 mld. USD](https://www.investegate.co.uk/announcement/rns/astrazeneca--azn/astrazeneca-to-deliver-80bn-revenue-by-2030-/8209889)
**Hackathony:** [CAMTech – BMJ Innovations 2017](https://pmc.ncbi.nlm.nih.gov/articles/PMC5293858) · [Nolte et al. 2020](https://par.nsf.gov/servlets/purl/10284449) · [Smart Health Hackathon 2019](https://ekonomickydenik.cz/aplikace-nevidome-diabetiky-i-mene-cekani-osetreni-ikem-hostil-hackathon) a [2020](https://ekonomickydenik.cz/aplikace-pro-snadnejsi-davkovani-heparinu-a-inzulinu-vyhrala-zdravotnicky-hackathon-letos-probihal-zcela-online/) · [Welsh Health Hack](https://lshubwales.com/story-welsh-health-hack) · [bitsxlaMarató 2025](https://www.fib.upc.edu/en/news/hackathon-bitsxlamarato-2025) · [EUvsVirus](https://www.i-com.it/en/?p=45467) · [Claude Opus 4.6 hackathon](https://claude.com/blog/meet-the-winners-of-our-built-with-opus-4-6-claude-code-hackathon) · [Opus 4.7](https://www.claude.com/blog/meet-the-winners-of-built-with-opus-4-7-claude-code-hackathon)
