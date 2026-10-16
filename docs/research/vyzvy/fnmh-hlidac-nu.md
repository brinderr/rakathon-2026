# Výzva: Praha – Digitální hlídač nežádoucích účinků (FN Motol a Homolka)

_Hĺbková analýza pre Bruna a Maťa. Stav: piatok 16. 10. 2026, popoludnie (po ~16:00). Písané jednoducho, odborné pojmy sú v zátvorke._

**Značky:** [Slack] zo Slacku · [Drive] z prezentácie organizátorov · [web] z webu · [V] číslo overené v abstrakte alebo primárnom zdroji · [S] sprostredkovaný zdroj (tlačová správa, novinový článok, obchodná stránka), berte ako orientačné · [prepočet] moje vlastné jednoduché počty · [odhad] môj úsudok, nie fakt · **[?]** neisté alebo som to nevedel overiť.

**Poznámka k rozsahu:** pri dopĺňaní vlastného web searchu som narazil na limit počtu vyhľadávaní. Časť čísel (náklady na pohotovosť, ceny produktov, MDR) preto ostáva na úrovni [S] alebo [?] a je to v texte vždy označené.

---

## 0. Verdikt v 10 riadkoch

1. **Čo to je:** pacient doma na chemoterapii/imunoterapii dostane krátky dotazník prispôsobený diagnóze a liečbe, dostane rady, a keď je situácia vážna, **automaticky sa ozve ošetrujúci tím**. Zadávateľka chce byť informovaná **o závažných účinkoch, nie o každej drobnosti**.
2. **Dôkaz, že problém je skutočný:** pravidelné hlásenie príznakov z domu zlepšuje kvalitu života a znižuje návštevy pohotovosti (RCT, 766 pacientov: 34 % vs. 41 % pohotovosť; kvalita života 34 % vs. 18 % zlepšených). **Zlepšenie prežitia** sa ukázalo v menších štúdiách, ale **najväčšia štúdia z 2025 ho nepotvrdila** (HR 0,99) – slajd zadávateľky ho spomína bez výhrady, v pitchi to treba povedať opatrne.
3. **Najväčšia sila:** je to jedna z najjednoduchších výziev na realizáciu a vysvetlenie, má silný ľudský príbeh (horúčka o druhej v noci) a veľmi dobre sa natáča.
4. **Najväčšia slabina:** **dáta.** Dataset FNMH nie je na Slacku, treba ho vyžiadať od mentora InterSystems; podľa zadania obsahuje správy, laboratórne výsledky a lieky, ale **žiadne pacientom hlásené príznaky a žiadne výsledky**, takže nemáme čím overiť, či naše upozornenia „trafili". Demo bude stáť na scenároch.
5. **Druhá slabina:** nápad nie je nový. **MEDDI Onco už v Masarykovom onkologickom ústave sleduje nežiaduce účinky s automatickými upozorneniami** a na Rakathone má vlastnú, susednú výzvu. V Motole som nič podobné nenašiel [?]. Odlíšenie musí byť jasné (§5).
6. **Regulácia:** nástroj, ktorý radí „choďte na pohotovosť" a upozorňuje lekára, je v reálnej prevádzke pravdepodobne zdravotnícka pomôcka (MDR) [?]. Na hackathone je to len prototyp, ale pri otázke „čo ďalej" to bude čelná téma.
7. **Konkurencia na výzve:** ku ~16:00 **2 tímy** (Cheirón, VI KA); do 19:00 pravdepodobne 3–5. V Prahe je to stredná hodnota (0–4 tímy na výzvu).
8. **Môže ju pražský tím zvoliť?** Áno, je to jedna z 12 pražských výziev vo výberovom formulári.
9. **Kto platí (budúcnosť):** v ČR zatiaľ nikto systematicky. Cesta: VZP Inovačný portál, kde sa **onkologická výzva otvára okolo 1. 11. 2026** a diaľkové monitorovanie je hlavný príklad. Zahraničie platí (Nemecko, Francúzsko).
10. **Celkové skóre (vážený priemer, 1–10): ~6,2.** Solídna voľba, nie výnimočná; hlavné otázky pred 19:00 sú v §5.6.

---

## 1. Presné zadanie

### 1.1 Čo chcú (v jednoduchosti)

Zdroje: prezentácia zadávateľky „Výzvy FN Motol a Homolka" (10 strán; MUDr. Alina Pirshtuk, Onkologická klinika FNMH), kanál `#digitalni-hlidac-nezadoucich-ucinku` a INTRO Praha. [Drive: https://drive.google.com/file/d/1VKP3UXN5p_YmiqrtI4gq-RnRUF5xZQ1O/view ; lokálna kópia `docs/materials/slack/fnm-motol-vyzvy/Rakathon_vyzvy_onkologie_FNM.pdf`; Slack kanál: https://rakathon2026.slack.com/archives/C0C80LQ1A2W]

**Problém podľa slajdu:** nežiaduce účinky liečby trápia pacientov týždne predtým, než ich zachytí kontrola u lekára.

**Cieľ:** systém, ktorý pacienta osloví, poradí mu a pri varovných hodnotách upozorní tím.

**Rozsah prvej verzie (3 časti):**
1. **Dotazník** v pravidelných intervaloch, **prispôsobený diagnóze a aktuálnej liečbe** pacienta.
2. **Rady pacientovi** na zvládanie príznakov; pri akútnych ťažkostiach odkaz na ambulanciu alebo linku 155.
3. **Upozornenie tímu:** keď sa prekročia stanovené hodnoty, automaticky sa upozorní ošetrujúci tím.

**Čo reálne chcú (doslovný zmysel vety zo slajdu):** byť **ihneď informovaní o závažných nežiaducich účinkoch, nie o každej drobnosti.** Toto je kľúčové: hodnotí sa schopnosť **netrúsiť poplach zbytočne** (riziko „únavy z poplachov", angl. alert fatigue).

**Doplnenie mentorky v Slacku (12:57):** poslala prehľad bežných nežiaducich účinkov (CTCAE v6). Vysvetlila, že **keď sa nežiaduci účinok uvádza do lekárskej správy, má sa písať aj s jeho stupňom, napr. „nevoľnosť G1" (to povie pacient) a „anémia G2" (to vieme z odberov)**. Poznámka: nerobia to všetci, ako je vidieť zo správ, ale malo by sa to tak robiť. [Slack] _Z toho vyplýva skrytý tip: nástroj, ktorý vie pri každom pacientovi poskladať takéto zápisy z príznakov a laboratórnych výsledkov, trafí presne do lekárkinho spôsobu práce._

**Vysvetlenie pojmov:**
- **Nežiaduci účinok (NÚ)** = vedľajší účinok liečby (nevoľnosť, hnačka, horúčka, únava, zníženie krviniek…).
- **CTCAE** = medzinárodný „slovník" a stupnica závažnosti nežiaducich účinkov, stupne **G1 (mierny) až G5 (smrť)**. Verzia **6.0** je nová (NCI ju vydal 2025/2026; zmeny hlavne pri hodnotení neutrofilov, kožných reakcií, imunoterapie a srdca). [web: https://dctd.cancer.gov/about/news-events/news/2026-news/ctcae-updated-version-6 ; oficiálne PDF na ktoré odkazuje mentorka: https://dctd.cancer.gov/research/ctep-trials/for-sites/adverse-events/ctcae-v6.pdf] [V pre existenciu verzie 6; presné prahy čerpať iba z oficiálneho PDF, nie z pamäte]
- **SPC** = „súhrn údajov o prípravku" (príbalový leták pre odborníkov) v databáze liekov SÚKL (štátny ústav pre kontrolu liečiv): https://prehledy.sukl.cz/prehled_leciv.html#/

### 1.2 Aké dáta dostaneme (a aké nie)

| | Čo | Zdroj / stav |
|---|---|---|
| **Máme** | Spoločný dataset FNMH pre všetky 3 pražské výzvy FNMH: anonymizované lekárske správy, textové popisy CT, laboratórne výsledky, vykázané výkony a lieky, ďalšie dáta z nemocničného systému (NIS) u aktuálne liečených onkologických pacientov | prezentácia [Drive/Slack] |
| **Máme (verejné)** | SPC liekov z databázy SÚKL | https://prehledy.sukl.cz/prehled_leciv.html# |
| **Máme (verejné)** | CTCAE v6.0 (stupnica nežiaducich účinkov) | oficiálne PDF, odkaz vyššie |
| **Nemáme** | Obrazové dáta (snímky), prístup do ePACS | prezentácia |
| **Nemáme** | **Pacientom hlásené príznaky a výsledky** (zo zadania nič také nevyplýva) | [odhad zo zloženia datasetu, over u O. Hoferka] |
| **Kde dataset fyzicky je** | **Na Slacku nie je.** Mentorka trikrát napísala: „pre získanie datasetu kontaktujte Ondřeja Hoferka" (InterSystems, mentor Praha). Dnes ~15:57 je v miestnosti pre mentorov. | [Slack 12:59] |
| **Typ dát [?]** | Slajd hovorí „anonymizované" dáta u liečených pacientov, čo vyzerá na **reálne anonymizované dáta**, nie fiktívne (pri MEDDI sú výslovne fiktívne). Pravidlá používania (nezverejňovať, mazať po akcii, len schválené prostredie) pri FNMH nie sú uvedené, pri iných výzvach áno. **Správať sa ako pri citlivých dátach**: nič z toho nedávať do verejného repozitára ani do verejných submissions (všetky odovzdané projekty sa zverejnia). | [?] |

**Praktický dopad:** kým nedostaneme dataset, vieme stavať na verejných zdrojoch (CTCAE + SPC) a na vymyslených pacientoch. Dataset by sa dal využiť na dve veci: (a) vybrať reálne režimy liečby, aby boli scenáre vierohodné; (b) **ukázať „dieru v dokumentácii"**: porovnať, koľko laboratórne zistiteľných závažných stavov (napr. nízke neutrofily) je v správe aj reálne zapísaných s G-stupňom. Číslo z reálnych dát by bolo silným argumentom v pitchi, ale **neviem, či to dataset umožní [?]**.

### 1.3 Aký výstup chcú, kritériá, odovzdanie

**Výstup (z 1.1):** funkčný prototyp so 3 časťami (dotazník, rady, upozornenia tímu). Vstupy: dataset, SPC, CTCAE v6.

**Kritériá špecifické pre túto výzvu:** nie sú uvedené (potvrdené v 05 §1.7). Platia **všeobecné**:
- **Sobota** (lokálne hodnotenie zadávateľmi): 1. AI technológia a prevedenie, 2. využiteľnosť v praxi u zadávateľa výzvy, 3. inovatívnosť. Váhy nie sú zverejnené [?]. [Drive – INTRO Praha MASTER; 05 §2.3]
- **Nedeľa** (finále) pribudne: 4. škálovateľnosť, 5. kvalita prezentácie a tímu.
- **Čo to znamená:** sobotný „porotca" je **zadávateľka, lekárka z Onkologickej kliniky FNMH**, ktorá o 14:00–16:00 obchádza tímy. Zaujíma ju **klinická použiteľnosť** („môžem to dať k svojim pacientom?") a **správnosť CTCAE**. Nie je programátorka, treba jej ukázať obrazovku sestry a pacienta, nie architektúru.
- InterSystems v mape výziev radí „hlídač NÚ" do typu **„vyhodnotiť riziko – modely/pravidlá"**. Cena InterSystems (1 500 EUR) sa **dá pridať k akejkoľvek výzve** (kritériá: inovatívnosť, reálny prínos, zmysluplné využitie ich technológií/FHIR, technická ucelenosť). [04 §1.5]

**Odovzdanie:** sobota 17. 10. **13:00 (tvrdý deadline)** cez `submit.rakathon.cz`: názov, popis do 140 znakov, popis použitia AI a dopadu, **povinný titulný obrázok 16:9 do 8 MB**, odkazy na GitHub/demo/video (nie je jasné, či povinné [?]). Finále v nedeľu 18. 10. o 14:00, pitche osobne pred hlavnou porotou; dĺžka pitchu nie je uvedená [?]. [05 §2.1–2.2]

### 1.4 Mentori a ľudia

| Kto | Rola | Poznámka |
|---|---|---|
| **MUDr. Alina Pirshtuk** | garantka a mentorka všetkých 3 výziev FNMH, Onkologická klinika FNMH | na Slacku do cca 19–20 h a zajtra; „first come first serve" v miestnosti pre mentorov (15:57) |
| Dr. Pavel Škrobánek, Dr. Michaela Klimeš Lipánová | ďalší lekári FNMH, ktorých mentorka odporúča kontaktovať | v kanáli sú pridaní |
| Tomáš Panský | mentor uvedený pri 3 výzvach FNMH | [Slack #02-dotazy, zoznam 12:38] |
| **Ondřej Hoferek** (InterSystems, Praha) | **dáva dataset** (aj pre MDT Copilot, SMART ONCO AA); aj mentor pre cenu InterSystems | Gabriel Ing (InterSystems, Praha) |
| Microsoft: Michal Marušan (Azure, AI aplikácie), Olena Vasylenko (inžinierka s biologickým zameraním), Bernardo Sunderhus (frontend/UX, iba EN) | technická pomoc | [05 §5] |
| MUDr. Albert Štěrba | člen dozornej rady VZP; ponúka posúdiť, „čo čaká nápad na ceste k pacientovi až po úhradu" | užitočné pre otázku „kto zaplatí" [05 §5] |
| Miroslav Pavlíček | IT z FNMH, v hlavnej porote (nedeľa) | [09 §3.2] |

Kontakty (telefón, e-maily) sú v Slacku, **nezapisujem ich do repa.**

### 1.5 Čo je nejasné [?]

1. Obsah a veľkosť datasetu (koľko pacientov, aké režimy, aké diagnózy) – kým ho nedostaneme.
2. Či dataset obsahuje nejaký záznam o nežiaducich účinkoch s G-stupňom (mentorka naznačila, že v správach sú nekonzistentne).
3. Kto presne má dostávať upozornenia (sestra? lekár?) a **aké sú „stanovené hodnoty"**, teda prahy. Zadanie ich nedefinuje; treba sa spýtať (§5.6).
4. Či je zadávateľka ochotná pomôcť s kontrolou klinických scenárov (v miestnosti pre mentorov je dnes aj zajtra).
5. Formát nedeľného pitchu a to, či je po sobotnom odovzdaní „lock" práce (otázka tímu Pixel Predators ostala bez odpovede).

---

## 2. Koncový užívateľ

**Upozornenie:** ide o realistický opis zostavený zo zadania FNMH, z procesu MEDDI Onco v MOÚ (ako príklad existujúcej prevádzky) a zo štúdií. Konkrétny denný režim na Onkologickej klinike FNMH som neoveril [?]; overiť u mentorky.

### 2.1 Traja ľudia, ktorých sa to týka

**A) Sestra v onkologickej ambulancii / dennom stacionári (hlavný používateľ upozornení).**
- **Jej deň (ilustrácia):** ráno telefonáty od pacientov doma („mám nevoľnosť, je to normálne?", „mám teplotu 37,6, mám volať?"), príprava a podávanie chemoterapie, odbery, edukácia, zapisovanie do nemocničného systému. Odpoludnia dohľadáva, kto sa neozval.
- **Čo ju bolí:** nevie, kto zo stoviek pacientov doma práve zlyháva; telefonáty nemajú prioritu (vážny a banálny zvonia rovnako); po pracovnej dobe a cez víkend zostáva pacient sám (pri MEDDI v MOÚ je monitorovacie centrum po–pi 7:00–15:30, inak služba alebo 155 [Slack/MEDDI zadanie]); dokumentácia nežiaducich účinkov je zdĺhavá a nejednotná. V ČR je málo sestier, najmä s onkologickou špecializáciou (v onkologických oddeleniach ~1 125 sestier [V, OECD/EK 2025]).
- **Čo od nástroja chce:** zoznam „kto potrebuje pozornosť dnes", s dôvodom na jeden riadok; **nechce 100 upozornení denne**.

**B) Lekár onkológ (mentorka je presne tento typ).**
- **Jeho deň:** ambulancia s časom na pacienta nízkym (v ambulanciách je pri pacientovi iba asi 27 % času a 49 % pri počítači a papieroch [V, americká štúdia, nie onkológia]); kontrola raz za 2–3 týždne.
- **Čo ho bolí:** keď príde pacient na kontrolu, nežiaduci účinok mohol trvať týždne (znamená to zbytočné utrpenie alebo zbytočné zastavenie liečby); v správach sa nežiaduce účinky nezapisujú jednotne (mentorka to priznáva); lekári podhodnocujú príznaky oproti tomu, čo hlási pacient (pozri §3.3).
- **Čo chce:** byť „ihneď informovaný o závažných, nie o každej drobnosti" a mať pri kontrole hotový prehľad príznakov so stupňami.

**C) Pacient doma (typicky 60–75 rokov, cykly chemoterapie po 2–3 týždňoch alebo imunoterapia).**
- **Čo prežíva:** najťažšie dni sú medzi cyklami. Po chemoterapii býva obdobie pár dní až dvoch týždňov, keď klesnú biele krvinky (tzv. nadir) a **horúčka je núdzový stav**. Pacient si kladie tri otázky: _Je to normálne? Mám volať lekárovi? Potrebujem pomoc hneď?_ (formulácia zadávateľa MEDDI [06 §3.2]).
- **Čo ho bolí:** nechce „obťažovať"; nevie, čo je v poriadku; ak sa rozhodne volať, dovolá sa ťažko alebo mimo pracovnej doby; seniori často nemajú chuť na novú aplikáciu.
- **Čo chce:** jednoduchú otázku „Ako sa dnes máte?", jasnú odpoveď „toto je v poriadku" alebo „choďte teraz" bez odborných slov. Často tiež zapojiť **blízku osobu** (dcéra, manžel).

**Kupujúci/rozhodovateľ (nie používateľ):** prednosta Onkologickej kliniky, riaditeľ nemocnice a IT FNMH, v budúcnosti poisťovňa (VZP).

### 2.2 Prečo dnešný stav zlyháva (5 dôvodov)

1. **Medzi kontrolami je „slepá zóna".** Kontrola je za 2–3 týždne, nežiaduci účinok sa objaví za 2–3 dni. [zadanie FNMH]
2. **Pacient nevie, kedy volať**, a vážne stavy (horúčka v nadire, imunitná kolitída pri imunoterapii) sa nemajú čakať do rána. [MEDDI zadanie; všeobecná klinická znalosť]
3. **Lekári podhodnocujú príznaky.** V štúdiách, kde sa porovnávali hlásenia pacientov a lekárov, pacienti hlásia príznaky častejšie než lekári (u MSK asi v troch štvrtinách prípadov) [S]; japonský prehľad uvádza podhodnotenie o 30–50 % [S]. (Pozri §3.3.)
4. **Nežiaduce účinky sa nezapisujú jednotne** (mentorka, Slack 12:57).
5. **Naivné digitálne riešenie by pridalo poplachy**, nie úľavu: ak by systém upozornil tím na každý príznak G2, sestry by ho vypli. Preto zadávateľka píše „nie o každej drobnosti". Skúsenosť z dánskych štúdií: pri slabom efekte chýbali **určení ľudia, ktorí na signály reagujú** (6 zo 7 štúdií ESMO ich malo, len 1 zo 4 dánskych) [V, cez 07 §B7].

---

## 3. Dôkazy o probléme a o riešení

### 3.1 Štyri kľúčové štúdie o pravidelnom hlásení príznakov (ePRO = elektronické pacientom hlásené výstupy)

| Štúdia | Kto a koľko | Čo sa zmenilo | Poctivá poznámka |
|---|---|---|---|
| **Basch, JCO 2016** (RCT, MSK New York) | 766 pacientov s pokročilým nádorom na ambulantnej chemoterapii; 12 príznakov cez tablet týždenne | **Kvalita života zlepšená u 34 % vs. 18 %**; **návšteva pohotovosti 34 % vs. 41 %**; na chemoterapii dlhšie (8,2 vs. 6,3 mesiaca) | [V pre čísla v abstrakte; definíciu „zlepšenia" som v plnom texte nekontroloval] https://doi.org/10.1200/JCO.2015.63.0830 ; registrácia https://clinicaltrials.gov/study/NCT00578006 |
| **Basch, JAMA 2017** (dlhšie sledovanie tej istej štúdie) | tie isté | **Medián prežitia 31,2 vs. 26,0 mesiaca** (P = 0,03) | [S/V] https://doi.org/10.1001/jama.2017.7156 . **Toto je štúdia, na ktorú sa odvoláva slajd zadávateľky.** Jedna štúdia, jedno centrum. |
| **Denis, JNCI 2017** (RCT, 5 francúzskych centier; systém Moovcare) | 121 pacientov s rakovinou pľúc | prežitie **19,0 vs. 12,0 mesiaca**; neskoršia aktualizácia 23,0 vs. 14,8 mesiaca (HR 0,62) | Malá štúdia, **financovaná firmou s produktom**. https://doi.org/10.1093/jnci/djx029 |
| **PRO-TECT, Nature Medicine 2025** (52 ordinácií v USA) | 1 191 pacientov s metastatickým nádorom; týždenné dotazníky, závažné alebo zhoršujúce sa príznaky posielali upozornenie tímu | **Prežitie sa NEZLEPŠILO** (HR 0,99; 0,83–1,17). **Čas do prvej návštevy pohotovosti dlhší** (HR 0,84; P = 0,03); fyzická funkcia, príznaky a kvalita života sa zhoršovali neskôr (HR 0,73; 0,69; 0,72); **91,5 % týždenných dotazníkov vyplnených**; 91 % by odporučilo | [V, abstrakt] https://doi.org/10.1038/s41591-025-03507-y |

**Čo z toho plynie pre pitch (poctivo):**
- Spoľahlivo funguje: **lepšia kvalita života, menej návštev pohotovosti, dlhšie udržanie na liečbe, vysoká ochota pacientov vypĺňať.**
- **Zlepšenie prežitia nesľubovať.** Najväčšia a najnovšia štúdia ho nepotvrdila.
- Slajd zadávateľky tvrdí, že pravidelné hlásenie „predlžuje prežitie" (Basch 2017). **Navrhujem** v pitchi povedať: „Dôkazy ukazujú menej návštev pohotovosti a lepší život medzi cyklami; vplyv na prežitie sa v štúdiách líši." Je to tak aj férové, aj pôsobí odborne.

### 3.2 Čo stojí neriešenie (peniaze a život)

| Číslo | Hodnota | Zdroj a kvalita |
|---|---|---|
| Návšteva pohotovosti súvisiaca s chemoterapiou: priemerný náklad | **~800 USD**, ak skončí hospitalizáciou **~22 000 USD** | Milliman cez OncLive, 2018, **USA** [S] https://www.onclive.com/publications/oncology-live/2018/vol-19-no-8/new-strategies-emerge-for-urgent-care-in-oncology |
| Ľudia s rakovinou, ktorí navštívia pohotovosť do roka od diagnózy (bez prijatia) | **27 %** z ~5 800 dospelých; až **53 %** z ~2 400 návštev bolo potenciálne vyhnuteľných (odhad, bez jednotnej definície) | Fred Hutchinson cez OncLive [S], USA |
| Nečakané príchody pacientov po chemoterapii | väčšina skončí hospitalizáciou (87,6 %), medián pobytu 5 dní | jedna nemocnica v Sydney, 2006–07 [S], staré https://link.springer.com/doi/10.1007/s00520-010-0913-y |
| Rozdiel pohotovostí v RCT | 41 % vs. 34 % pacientov s aspoň jednou návštevou | Basch 2016 (vyššie) |
| **[prepočet]** | rozdiel 7 percentuálnych bodov = **približne 70 pacientov z 1 000** menej s návštevou pohotovosti za rok sledovania | z Basch 2016; **iba ilustrácia, nie česká predikcia** |
| Úspora práce sestry | ~137 000 Kč ročne na jednu všeobecnú sestru (ocenenie ušetreného času) | tvrdenie firmy MEDDI, **nezávisle neoverené**, slajd to sám uvádza [06 §3.2] |
| Hospodárnosť v rámci 757 pacientov (chemoterapia) | najlepšie vyšla **plná verzia** hlásenia s následným telefonátom sestry pri ťažkých príznakoch | ekonomická analýza, 2025, https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12603855/ [S z abstraktu] |

**Česko (veľkosť):** viac ako 90 000 nových onkologických prípadov ročne a viac ako 600 000 ľudí žijúcich s rakovinou podľa MZ ČR; OECD/EK uvádza ~61 000 nových prípadov v 2022 (rozdiel asi tvoria nemelanómové kožné nádory [?]). Koľko z nich je naraz na aktívnej systémovej liečbe, **nemám overené číslo [?]**. [MZ ČR 2. 9. 2026: https://mzd.gov.cz/tiskove-centrum-mz/jeden-kontakt-mene-cekani-rychlejsi-cesta-k-lecbe-koordinatori-meni-peci-o-onkologicke-pacienty/ ; OECD/EK: https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-cs-2025-1663-v2-en.pdf]

**Financie FNMH:** v 2025 hlásili hotovosť na približne jeden mesiac prevádzky (~1,2 mld. Kč pri obrate ~18 mld. Kč), takže zlúčená nemocnica šetrí [S; dátum článku neistý [?]; 09 §3.2]. Preto platí: nástroj musí ušetriť čas alebo nepridávať prácu.

### 3.3 Prečo je to „bolesť lekárov", nie len pacientov

- **Podhodnocovanie príznakov lekármi:** MSK analýza a súvisiaca literatúra: ak sa porovná hlásenie pacienta s hlásením lekára (CTCAE), pacienti hlásia viac príznakov (bez úpravy asi v troch štvrtinách prípadov) [S, tlačová správa MSK: https://www.mskcc.org/news-releases/cancer-patients-and-doctors-report-drug-side-effects-differently-when-combined-improve-reporting-adverse-effects-study-shows]; japonský prehľad bariér uvádza podhodnotenie o 30–50 % [S: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11102941/]. „Až o polovicu" z európskej štúdie JCO som nevedel overiť v primárnom zdroji [?].
- **PRO-CTCAE** (dotazník pacienta založený na CTCAE) bol overený na ~1 000 pacientoch ako platný a spoľahlivý [S]. Vhodný základ na „preklad" príznakov pacienta do G-stupňov.
- **Dokumentácia:** mentorka priznáva nejednotný zápis G-stupňov v správach (Slack 12:57).

### 3.4 Čo som nevedel overiť [?]

- České číslo „ľudia na aktívnej systémovej liečbe naraz" a „neplánované hospitalizácie po chemoterapii v ČR".
- Jednotkové náklady v Kč (nemám české dáta; čísla sú z USA).
- Presný vplyv ePRO na prežitie v Európe (spor medzi malými štúdiami a PRO-TECT).
- Počet poplachov na pacienta a týždeň v PRO-TECT (stránka PMC sa mi neotvorila, spoliehal som sa na abstrakt) – dôležité pre navrhovanie „rozpočtu poplachov".

---

## 4. Existujúce riešenia na trhu

### 4.1 Kto to už robí

| Produkt / kto | Čo robí | Kto platí / cena / stav | Zdroj |
|---|---|---|---|
| **MEDDI Onco** (český MEDDI hub; v Masarykovom onkologickom ústave od 2020) | aplikácia pre pacienta: dotazníky o nežiaducich účinkoch (nevoľnosť, bolesť, únava, kožné reakcie), fotky, chat, video; **monitorovacie centrum sestier** triedi požiadavky; **automatické upozornenia sestrám a lekárom**; psychoonkologický skríning; paliatívni pacienti | firmou udávané: > 15 500 pacientov v systéme, ~137 000 Kč úspory práce na sestru ročne (nezávisle neoverené). V ČR nie je diaľková starostlivosť štandardne hradená (VZP 29. 9. 2026). Na Rakathone je to **susedná výzva MEDDI ONCO Challenge** s hodnotením na skrytých pacientoch | `docs/materials/slack/meddi-onco-challenge/…` ; https://www.seznamzpravy.cz/clanek/masarykuv-onkologicky-ustav-ma-vlastni-aplikaci-pro-komunikaci-s-pacienty-152521 ; 06 §3.2 |
| **Moovcare** (Sivan Innovation, Francúzsko/Izrael) | web aplikácia, týždenný dotazník s 12 príznakmi, algoritmus upozorní lekára na možný relaps alebo komplikáciu (pľúcna rakovina) | **vo Francúzsku hradená**, odhad ~1 000 EUR na polrok na pacienta (francúzska odborná tlač, nepotvrdené z primárneho dokumentu); RCT s prežitím (JNCI 2017) | https://www.lequotidiendupharmacien.fr/medicament-parapharmacie/dispositifs-medicaux/premiere-therapie-digitale-remboursee [S] ; https://www.medical-xprt.com/software/moovcare-application-for-digital-therapeutics-reimbursed-795793 [S] |
| **Kaiku Health** (Fínsko) | digitálne sledovanie príznakov onkologických pacientov | fínske HTA odporúčanie 2020; v štúdii u myelómu dokončilo týždenné sledovanie 80,1 % pacientov; zdravotníci hlásili menej telefonátov na oddelenie; **cena v zdrojoch nie je** | https://oys.fi/fincchta/wp-content/uploads/sites/21/2022/06/kaiku-health-service-for-symptom-management-of-cancer-patients.pdf [S] |
| **Noona** (Varian) | pacientska aplikácia na hlásenie príznakov pre onkologické tímy | pilot v Helsinkách na 44 pacientoch; cena nenájdená | https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8138702/ [S] |
| **Mika** (Fosanis, Nemecko; DiGA = aplikácia na recept hradená poisťovňou) | podpora onkologických pacientov (psychika, príznaky) | v registri DiGA od marca 2021; v 2022 sa dočasne stiahla kvôli hodnoteniu štúdie; **aktuálny stav neviem [?]**. Priemerná cena onkologických aplikácií v prvom roku ~400 € na štvrťrok (údaj GKV 2022; poisťovne v apríli 2026 kritizujú vysoké ceny) | https://www.aerzteblatt.de/news/psychoonkologie-app-steigt-voruebergehend-aus-diga-verzeichnis-aus-1066aba3-33a0-4087-9a87-80e55ae8a656 [S] ; 07 §B7 |
| **Stanford ePRO (PRO-CTCAE), ONCOpatient (Írsko)** | akademické/pilotné systémy | pilotné štúdie: uskutočniteľné bez zvýšenia záťaže, 15 základných nežiaducich účinkov | https://stanfordhealthcare.org/publications/826/826843.html [S] |
| **FN Motol** | **nič podobné som nenašiel** | – | [?] (jedno vyhľadávanie; overiť u mentorky) |

### 4.2 Kto za to platí

- **Zahraničie:** poisťovne (Nemecko cez DiGA, Francúzsko cez zoznam hradených pomôcok) alebo nemocnice po hodnotení zdravotníckych technológií (Fínsko). Cena rádovo **stovky eur na štvrťrok a pacienta** [S].
- **Česko:** **zatiaľ nikto systematicky**; „telemedicína je legislatívne ukotvená, ale až na výnimky nehradená" (VZP 29. 9. 2026). [07 §B7]
- **Nová cesta:** **VZP Program riadeného vstupu inovácií** (od 21. 9. 2026): onkológia je prvá tematická výzva, štvrťročne od ~1. 11. 2026 (FAQ hovorí „od októbra" [?]); dočasná úhrada 6–24 mesiacov; hlavné príklady: **telemedicína a AI v rádiodiagnostike**; plánovaná alokácia ~300 mil. Kč na 2027 [?, jediný zdroj rozhovor 29. 9.]; vstupný filter: preukázateľná priama úspora aspoň 5 % ročne; žiadateľ musí byť **výrobca/dodávateľ s klinickým partnerom** (nemocnice nemôžu žiadať priamo); 8 povinných podmienok („hard gates"): klinická bezpečnosť, GDPR, kybernetická bezpečnosť, jasná klinická zodpovednosť, ľudský dohľad pri AI, regulačná spôsobilosť… [08 §7.2; https://inovace.vzp.cz ; https://www.vzp.cz/o-nas/aktuality/hlavinka-digitalni-technologie-uz-pouzivame-je-na-case-naucit-se-hodnotit-jejich-prinos]. **Pozor: cena „Křeslo pro inovace" (60 min s generálnym riaditeľom VZP) je len pre tímy z VZP výziev**, nie pre túto výzvu.

### 4.3 Čo robia slabo a kde je priestor

| Slabina existujúcich riešení | Čo by sme urobili inak |
|---|---|
| **Rovnaký zoznam ~12 príznakov pre každého** (Moovcare, MSK, PRO-CTCAE základ) | Dotazník **zostavený automaticky podľa liečby pacienta** (liek → typické nežiaduce účinky z SPC SÚKL → 6–8 otázok). Presne to chce zadanie („prispôsobený diagnóze a aktuálnej liečbe"). |
| **Odpojené od údajov nemocnice** (labáky, správy) | Spojiť to, čo hovorí pacient, **s tým, čo ukazujú odbery** → stupne G podľa CTCAE v6, napr. „nevoľnosť G1 (udáva pacient), anémia G2 (z odberov)". Presne štýl zápisu, ktorý žiada mentorka. |
| **Veľa poplachov** (únava z poplachov; cudzie štúdie ukazujú, že bez určeného reagujúceho človeka efekt klesá) | **Rozpočet poplachov** a jasné pravidlá; zelené zhrnúť do týždenného prehľadu; červené vždy hneď. Meriame „poplachy na 100 pacientov". |
| **Len upozornenie, bez uzavretia slučky** | Upozornenie s termínom reakcie, potvrdením „preberám", eskaláciou, ak nikto nereaguje; **uzavretá slučka** (kto, do kedy, čo urobil). |
| **Cena** (stovky eur na pacienta a štvrťrok) a uzavretosť | Cena výpočtu AI je zlomok (centy na pacienta mesačne [odhad]); otvorený formát **FHIR**; ľahké nasadenie. |
| **Jazyk, seniori, žiadna inštalácia aplikácie** | Odkaz v SMS (žiadna aplikácia), veľké tlačidlá, jednoduchá čeština, režim pre príbuzného, **záloha telefonátom**. |

**Poctivo:** MEDDI Onco má časť z toho (monitorovacie centrum, upozornenia). Naše odlíšenie je **personalizácia z SPC + spojenie s labákmi + rozpočet poplachov + zápis s G-stupňami + jednoduchosť**. Na otázku poroty „a čím sa líšite od MEDDI?" treba mať odpoveď v jednej vete.

---

## 5. Najlepší návrh riešenia pre nás

### 5.1 Zásada: prototyp, ktorý Alina uvidí za 2 minúty a povie „toto by som použila"

**Pracovný názov:** **Hlídač** („Zavoláme vám skôr, než budete musieť volať vy").

**Tri veci, ktoré musia byť perfektné** (a všetko ostatné je bonus):
1. **Obrazovka sestry:** zoznam „dnes" – 2 červené, 3 oranžové, zvyšok zelený a ticho; pri každom riadku jedna veta „prečo", trend, a tlačidlá „Preberám / Volám / Hotovo".
2. **Telefón pacienta:** odkaz v SMS, jedna otázka na obrazovke, veľké tlačidlá, jasná odpoveď „To je v poriadku, tu je čo robiť" alebo „Zavolajte 155 / choďte na ambulanciu".
3. **Zápis nežiaducich účinkov so stupňami** pre lekársku správu: „Nevoľnosť G1 (udáva pacient), anémia G2 (dle odběrů)" – vygeneruje sa automaticky z odpovedí a labákov.

### 5.2 Ako to funguje (jednoducho, 6 krokov)

1. **Pacient v systéme:** diagnóza, liečba (lieky, cyklus, dátum posledného podania), posledné odbery. (V demo verzii z datasetu FNMH, ak ho dostaneme, inak z vymyslených pacientov.)
2. **Otázky na mieru:** z liekov pacienta AI vyberie z SPC SÚKL najčastejšie nežiaduce účinky (frekvencia „veľmi časté/časté") a poskladá **6–8 otázok** v štýle PRO-CTCAE (ako často, ako silno, ako to ruší) + vždy **teplotu** a „je niečo iné?". Každá otázka má „prečo sa pýtame" (odkaz na SPC).
3. **Kedy sa pýtame:** podľa cyklu (zvýšená pozornosť v dňoch 7–14 po chemoterapii, u imunoterapie stále), nie raz za týždeň slepo.
4. **Vyhodnotenie (bezpečnosť na prvom mieste):**
   - **Tvrdé pravidlá (bez AI):** horúčka ≥ 38,0 °C počas chemoterapie alebo do 6 týždňov po nej, dýchavica v pokoji, krvácanie, ťažká hnačka, nezastaviteľné zvracanie atď. → **červená, 155 / pohotovosť, tím hneď.** Vzor: semaforová triáž UKONS 24h a PRO-CTCAE, ako ich uvádza zadanie MEDDI (verejné pre účastníkov); **každé pravidlo overiť v zdroji, nie z pamäte**.
   - **CTCAE v6 stupne:** mapovanie odpovedí a labákov na G1–G4 **iba z oficiálneho PDF** (neurčovať prahy LLM-kou).
   - **AI (jazykový model) len na:** pochopenie voľného textu („mám pocit, že sa mi točí hlava aj mám zimnicu"), priateľskú reč pacientovi a jednoriadkové zhrnutie pre sestru. **AI môže iba zvýšiť naliehavosť, nikdy ju znížiť.**
   - **Trend:** zhoršenie o ≥ 2 stupne alebo 3 po sebe idúce horšie odpovede = vyššia úroveň aj pri nízkych stupňoch.
5. **Upozornenia tímu = „rozpočet poplachov":** tím dostane okamžité upozornenie iba pri G3+, tvrdých pravidlách alebo rýchlom zhoršení. G1–G2 idú do **jedného denného/týždenného prehľadu**. Meriame a ukazujeme: „poplachy na 100 pacientov: naivný systém vs. Hlídač".
6. **Uzavretá slučka:** pri oranžovej a červenej je termín reakcie, potvrdenie „preberám", eskalácia, ak nikto nereaguje; záznam, čo sa stalo.

**Výstupy pre porotu:** obrazovka sestry, chat pacienta, vygenerovaný zápis o NÚ s G-stupňami, **export FHIR** (Questionnaire, QuestionnaireResponse, Observation/AdverseEvent so stupňom, Task pre upozornenie) – kvôli cene InterSystems (1 500 EUR, dá sa pridať k tejto výzve) a škálovateľnosti. Presné FHIR profily overiť s mentorom InterSystems [?].

### 5.3 Demo za jednu noc (čo zvládne Claude Code)

**Jedna webová aplikácia** (mobile-first), tri obrazovky:
- **/pacient/:token** – chat s veľkými tlačidlami (a hlas ako bonus).
- **/tim** – obrazovka sestry s radením, farbami, časovačom odpovede, tlačidlami.
- **/zapis/:pacient** – vygenerovaný zápis o NÚ so stupňami + export FHIR.

**Pod kapotou:** malý server (Python/Node), rozhodovacie pravidlá v tabuľke (YAML/JSON) so zdrojom pri každom riadku, volanie jazykového modelu cez Azure (OpenAI-kompatibilný endpoint, treba retry kvôli zdieľaným limitom), uloženie do SQLite/Postgres. **Voliteľne (časový limit 2 h): IRIS for Health FHIR server** z Docker obrazu InterSystems pre cenu InterSystems; ak sa nepodarí, FHIR export zo súboru.

**Dáta na demo:**
- **12–20 vymyslených pacientov** s reálnymi režimami (výber podľa datasetu FNMH, ak príde; inak podľa SPC bežných režimov), časovými osami príznakov a odberov.
- **30 hodnotiacich scenárov** s „správnou odpoveďou" pripravenou s lekárkou (Alina, Dr. Škrobánek, Dr. Klimeš Lipánová sú v miestnosti pre mentorov) alebo aspoň s expertom z okruhu Maťa. Metriky: **100 % zachytenie červených a oranžových**, počet poplachov na 100 pacientov oproti naivnému pravidlu „každý príznak ≥ G2". Čísla pomenovať ako **simulácia na vymyslených scenároch**, nie dôkaz.
- **Ak dostaneme dataset:** spustiť laboratórny počítač stupňov nad kohortou a ukázať „toľko pacientov malo laboratórne G3, v správe je zapísané len u N". Použiť len v tíme, **do submission len súhrnné číslo, nie dáta**.

**Čo vedome nestaviame:** vlastný register pacientov, prepojenie na reálny NIS, aplikáciu na inštaláciu, diagnostiku, odporúčanie zmeny dávok liekov.

### 5.4 Pitch 3 min (cca 1–1,5 min video + reč) – návrh

| Čas | Čo | Poznámka |
|---|---|---|
| 0:00–0:20 | **Príbeh:** „Utorok, 2:14 ráno. Pani Marie, 68, deviaty deň po chemoterapii. Teplota 38,4. Nechce nikoho budiť." Video: telefón, jedna otázka, odpoveď. | Bruno: silná prvá scéna, titulný obrázok 16:9 z tej istej scény |
| 0:20–0:50 | **Problém s číslami:** kontrola je o 2–3 týždne, príznaky o 2–3 dni; lekári podhodnocujú príznaky; dôkaz: menej pohotovostí (34 % vs. 41 %), lepší život (34 % vs. 18 %). **O prežití nehovoriť ako o istote.** | z §3.1 |
| 0:50–2:00 | **Demo (video + naživo):** vľavo telefón Marie, vpravo obrazovka sestry – o 2:14 červená, jedna veta prečo; 118 zelených pacientov mlčí. Potom zápis „Nevoľnosť G1 (udáva pacient), anémia G2 (z odberov)" a graf „poplachy: naivne 38 vs. Hlídač 5 na 100 pacientov" (**uviesť ako simuláciu**). | presne to, čo chce zadávateľka |
| 2:00–2:30 | **Prečo to bude fungovať v praxi:** dotazník z liekov (SPC SÚKL), stupne podľa CTCAE v6, AI nikdy nezníži naliehavosť, ľudský dohľad, FHIR. | kritérium 2 a cena InterSystems |
| 2:30–3:00 | **Cesta ďalej:** pilot na jednej ambulancii FNMH, VZP Inovačný portál (onkológia od ~1. 11.), prvý meraný ukazovateľ: poplachy na 100 pacientov a čas reakcie. | kritérium 4 (nedeľa) |

### 5.5 „Šialený" ambiciózny variant: **Hlídač, ktorý zavolá**

**Hlasový agent po česky**, ktorý zavolá pacientovi (alebo príbuznému) v deň, keď sa očakáva najväčšie riziko (napr. 7.–10. deň po chemoterapii) a vyhodnotí odpovede za 90 sekúnd. Pre ľudí bez smartfónu (seniori), kde je klasický ePRO najslabší.
- **Predikcia dňa „nadiru"** z histórie odberov a režimu (kto bude pravdepodobne G3 pred ďalším cyklom → volať prvého).
- **Príbuzný ako druhý senzor** (dcéra dostane tú istú správu v SMS).
- **Prepis hovoru → vyplnený dotazník → G-stupne → zápis**, a pri červenej hovor prepojí na živú sestru s 20-sekundovým zhrnutím.
- V pitchi: **nahrávka reálne znejúceho hovoru** (Bruno má nástroje na hlas; v nahrávke len herec/syntetický hlas a vymyslená pacientka).
- **Riziko:** latencia a chyby v češtine, bezpečnosť (hlas nesmie nikdy upokojiť, keď treba volať 155), regulácia; v reálnej prevádzke vyžaduje ďalšiu validáciu. Navrhujem to ako **bonusový efekt vo videu**, nie ako základ dema.

### 5.6 Čo spraviť pred 19:00 (rozhodovací zoznam)

1. **Ísť za O. Hoferkom a dostať dataset hneď** (hoci len ukážku): koľko pacientov, aké diagnózy a režimy, či sú tam odbery s dátumami, či je v správach zapísané „NÚ s G-stupňom".
2. **Opýtať sa Aliny (miestnosť pre mentorov, 3 otázky):** (a) kto má upozornenia dostávať (sestra / lekár / koordinátorka) a **aké sú ich „stanovené hodnoty"**; (b) ktoré 3–5 režimov/diagnóz nás majú zaujímať (napr. chemoterapia s horúčkou v nadire, imunoterapia s kolitídou); (c) ak ukážeme 30 vymyslených scenárov, pozrie sa na ne a povie, či sú klinicky správne.
3. **Rozhodnutie o výzve:** ak dataset nepríde do rozumného času, výzva stále funguje (verejné zdroje + scenáre), ale **riziko „nemáme na čom ukázať prínos"** rastie; alternatívne porovnať s MEDDI (má reálne scenáre a skrytý test) a s výzvami, kde dáta už sú (mamograf, Plíce včas, Cesta pacienta).
4. **Nezverejňovať dáta** do submission ani do verejného repozitára; do submission len syntetické ukážky.

---

## 6. Konkurencia na hackathone

**Stav (tabuľa `submit.rakathon.cz/vyzvy`, načítaná ~16:00 a potvrdená opätovným načítaním pri písaní tejto správy):**

| | Počet | Tímy |
|---|---|---|
| **Digitální hlídač NÚ – Praha** | **2** | **Cheirón**, **VI KA** |
| Ešte nevybrali (Praha) | 5 | Ctrl+Alt+CURE, FIT/S, FSMZ, Pražský Meridian, walking legs |
| Pražské tímy z organizátorskej listiny, ktoré ešte nie sú na tabuli | 7 | Data Team, Junior Scholars, Nexlytics, Panacea, quattro formaggi, radiQA, Risk off |

- **Pre porovnanie v Prahe:** 0 tímov (Kvalita péče, Twincer); 1 (PACS Comparator, MEDDI, Plíce včas, SMART ONCO AA, MDT Copilot); 2 (Cesta pacienta, Hlídač, NÚVR); 3 (VZP mamograf); 4 (AI Trial Matching). Hlídač je **stred zoznamu**.
- **Signály záujmu zo Slacku (iba názvy tímov):** do kanála hlídača sa pripojili členovia tímov **walking legs**, **Junior Scholars**, **quattro formaggi** a **VI KA** (ten už výzvu zvolil). Pripojenie do kanála ešte neznamená výber (pripojili sa aj členovia tímov, ktoré si zvolili inú výzvu, napr. MSFZ, Korex, Přemke), ale tieto tímy môžu do 19:00 prísť.
- **Odhad konečného počtu na výzve: 3–5 tímov [odhad].** Dôvod: hlídač je „veľmi demonštrovateľná" téma, takže nerozhodnuté tímy sa k nej môžu pridať.
- **Sila súperov:** nepoznám. Spomedzi pražských tímov mal minulý rok ocenenia tím Pixel Predators (je na AI Trial Matching) [01 / FEL ČVUT]; o Cheirón a VI KA nič nevieme [?].
- **Susedná výzva MEDDI ONCO:** 1 tím (Přemke). **Nie je to naša konkurencia o to isté víťazstvo** (iná výzva, iný zadávateľ), ale ak niekto vyhrá MEDDI a my Hlídač, pred nedeľnou porotou stoja dve podobné riešenia. Pre nás je to dôvod odlíšiť sa (§4.3).
- **Môže pražský tím zvoliť túto výzvu?** **Áno.** Je to jedna z 12 pražských výziev vo formulári výberu (3 VZP + Trial Matching, MEDDI, PACS Comparator, **Hlídač NÚ**, NÚVR, Plíce včas, SMART ONCO AA, MDT Copilot, Twincer). [05 §2.6]
- **Cesta do finále:** víťaz každej výzvy ide do nedeľného finále (zadávateľ ho nahlási o 16:00 v sobotu). Pri 3–5 tímoch ide o súboj o prvé miesto na výzve; v nedeľu pribudnú škálovateľnosť a kvalita prezentácie, kde sú naše silné stránky (príbeh, video, jasná cesta k pilotu).

---

## 7. Skóre (1–10, prísne; 5 = priemer medzi výzvami)

| Kritérium | Váha | Skóre | Zdôvodnenie |
|---|---|---|---|
| Veľkosť problému | 1 | **7** | Dotýka sa každého pacienta na aktívnej systémovej liečbe (v ČR > 90 000 nových prípadov ročne, > 600 000 žije s rakovinou; presné číslo na liečbe nemám [?]). Väčšie než nika (PillGaze, ProstaPaper, detská onkológia), porovnateľné s hlavnými. |
| Dopad na zdravie | 1,5 | **7** | RCT: lepšia kvalita života (34 % vs. 18 %), menej pohotovostí (34 % vs. 41 %; HR 0,84 v PRO-TECT), včasné zachytenie horúčky a imunitnej toxicity. Prežitie nepotvrdené (HR 0,99). |
| Úspora času | 1 | **5** | Môže ušetriť telefonáty a zápis G-stupňov, ale ePRO bez dobrého triedenia pridáva prácu; efekt závisí od „rozpočtu poplachov". |
| Peniaze | 1,2 | **5** | Menej pohotovostí a hospitalizácií je cenných pre poisťovňu, no pri platbe nemocnice za DRG pre ňu úspora nie je priama; české jednotkové dáta chýbajú [?]. |
| Akútnosť bottlenecku | 1,5 | **7** | Zadávateľ ju sám zadal; VZP onkologická výzva ~1. 11. s telemedicínou ako hlavným príkladom; MEDDI ukazuje, že dopyt existuje. Nie je to „horí" ako koordinácia po zavedení koordinátorov. |
| Ochota platiť | 1,2 | **5** | V ČR zatiaľ nikto systematicky; platba cez VZP portál je možná, no vyžaduje výrobcu s klinickým partnerom, úsporu ≥ 5 % a MDR. V zahraničí platia (DE, FR). |
| Jednoduchosť pre používateľa | 1 | **8** | SMS odkaz + jedna otázka na obrazovke; sestra vidí zoznam „kto dnes". Slabina: seniori bez smartfónu (záloha telefonátom). |
| Dostupnosť dát | 1 | **4** | Dataset nie je na Slacku, treba si ho vyžiadať; podľa zadania bez príznakov a výsledkov, takže nie je ground truth; riziko spracovania češtiny a citlivosti. Verejné zdroje (CTCAE, SPC) sú. |
| Realizovateľnosť dema za noc | 1 | **8** | Webová appka + pravidlá + jazykový model + vymyslení pacienti je štandardná práca; nič nezávisí od cudzieho API. Riziko: dataset, čeština, doladenie UX. |
| Wow a príbeh | 1,2 | **7** | Silný príbeh (2:14 ráno), delená obrazovka, G-stupne; „šialený" hlasový variant by to zvýšil. Téma je bežná (ePRO), takže wow musí niesť kvalita vyhotovenia. |
| Strategická hodnota partnera | 1,2 | **7** | FNMH je najväčšia nemocnica, IT v porote, precedens spolupráce s víťazom 2025; no výzva nie je VZP (žiadne „Křeslo pro inovace"), zadávateľka je klinička bez rozpočtu. |
| Šanca vyhrať a ísť do finále | 1 | **6** | 2 tímy teraz, odhad 3–5 po 19:00; silní súperi nie sú známi; susedný MEDDI znižuje jedinečnosť. |
| Pokračovanie po hackathone | 0,8 | **5** | Mentorka je zapojená a VZP portál sa otvára; ale vyžaduje právnickú osobu, klinického partnera, MDR a integráciu do NIS; MEDDI je v ČR etablovaný hráč. |
| Fit s naším tímom | 0,8 | **6** | Bruno: príbeh, video, texty pre pacienta (veľká výhoda); Maťo: klinické prostredie a prístup k expertom na kontrolu scenárov, žiarenie (radiačná dermatitída) je odbočka, nie jadro. Zobrazovanie/ÚRO tu nehrá hlavnú rolu. |
| Nízke regulačné/klinické riziko | 0,6 | **3** | Nástroj, ktorý triažuje a upozorňuje, je v ostrej prevádzke pravdepodobne zdravotnícka pomôcka (MDR) [?, znalosť mimo overených zdrojov]; riziko podhodnotenia horúčky; GDPR (zdravotné dáta); zodpovednosť. Na hackathone: prototyp, ľudský dohľad. |

**Vážený priemer:** súčet váha×skóre = 98,4; súčet váh = 16,0 → **≈ 6,2 / 10.**

**Ako to čítať:** nad priemerom vďaka jednoduchosti, realizovateľnosti, príbehu a partnerovi; ťahajú dole dáta, riziko a „nie je to nové" (MEDDI).

---

## 8. Zdroje

**Zadanie a organizácia**
- Prezentácia zadávateľky (10 strán): https://drive.google.com/file/d/1VKP3UXN5p_YmiqrtI4gq-RnRUF5xZQ1O/view ; lokálne `docs/materials/slack/fnm-motol-vyzvy/Rakathon_vyzvy_onkologie_FNM.pdf`
- Slack kanál výzvy: https://rakathon2026.slack.com/archives/C0C80LQ1A2W
- Tabuľa výziev a tímov: https://submit.rakathon.cz/vyzvy
- INTRO Praha (kritériá, odovzdanie): `docs/materials/slack/refresh-1600/Rakathon_2026_INTRO_Praha_MASTER.txt`; 05-slack-refresh.md §2
- CTCAE v6 PDF: https://dctd.cancer.gov/research/ctep-trials/for-sites/adverse-events/ctcae-v6.pdf ; oznam NCI: https://dctd.cancer.gov/about/news-events/news/2026-news/ctcae-updated-version-6
- SPC v databáze SÚKL: https://prehledy.sukl.cz/prehled_leciv.html#/

**Dôkazy**
- Basch JCO 2016: https://doi.org/10.1200/JCO.2015.63.0830 ; https://clinicaltrials.gov/study/NCT00578006
- Basch JAMA 2017: https://doi.org/10.1001/jama.2017.7156
- Denis JNCI 2017: https://doi.org/10.1093/jnci/djx029 ; https://www.onclive.com/view/web-app-boosts-survival-for-lung-cancer-patients
- PRO-TECT Nat Med 2025: https://doi.org/10.1038/s41591-025-03507-y
- Náklady pohotovosti (USA): https://www.onclive.com/publications/oncology-live/2018/vol-19-no-8/new-strategies-emerge-for-urgent-care-in-oncology ; https://link.springer.com/doi/10.1007/s00520-010-0913-y
- Podhodnocovanie príznakov: https://www.mskcc.org/news-releases/cancer-patients-and-doctors-report-drug-side-effects-differently-when-combined-improve-reporting-adverse-effects-study-shows ; https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11102941/
- Ekonomická analýza ePRO: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12603855/
- Čas lekára (Sinsky 2016): https://doi.org/10.7326/M16-0961
- Česko: MZ ČR 2. 9. 2026 https://mzd.gov.cz/tiskove-centrum-mz/jeden-kontakt-mene-cekani-rychlejsi-cesta-k-lecbe-koordinatori-meni-peci-o-onkologicke-pacienty/ ; OECD/EK 2025 https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-cs-2025-1663-v2-en.pdf

**Trh a platby**
- VZP Inovačný portál: https://inovace.vzp.cz ; https://www.vzp.cz/o-nas/aktuality/vzp-otevira-dvere-technologickym-inovacim-v-medicine-pomohou-pacientum-i-v-diagnostice-pohlidaji-organizaci-pece-a-vysi-vydaju ; https://www.vzp.cz/o-nas/aktuality/hlavinka-digitalni-technologie-uz-pouzivame-je-na-case-naucit-se-hodnotit-jejich-prinos
- MEDDI v MOÚ: https://www.seznamzpravy.cz/clanek/masarykuv-onkologicky-ustav-ma-vlastni-aplikaci-pro-komunikaci-s-pacienty-152521 ; zadanie MEDDI `docs/materials/slack/meddi-onco-challenge/extracted/rakathon_meddi_onco_data/docs/`
- Moovcare: https://www.lequotidiendupharmacien.fr/medicament-parapharmacie/dispositifs-medicaux/premiere-therapie-digitale-remboursee ; https://www.medical-xprt.com/software/moovcare-application-for-digital-therapeutics-reimbursed-795793
- Kaiku: https://oys.fi/fincchta/wp-content/uploads/sites/21/2022/06/kaiku-health-service-for-symptom-management-of-cancer-patients.pdf
- Noona: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8138702/
- Mika/DiGA: https://www.aerzteblatt.de/news/psychoonkologie-app-steigt-voruebergehend-aus-diga-verzeichnis-aus-1066aba3-33a0-4087-9a87-80e55ae8a656 ; https://www.apotheke-adhoc.de/nachrichten/detail/e-health/diga-zwei-apps-sind-gestrichen/
- Interné: `docs/research/07-trendy-a-bottlenecky.md` (B7), `08-cesky-kontext-a-trh.md` (§7–9), `09-partneri-a-vitazne-vzorce.md` (§3.1–3.2), `05-slack-refresh.md` (§1.7, §2, §3)

**Čo som nestihol/nevedel overiť (celkový zoznam [?])**
1. Obsah datasetu FNMH (kým ho nedostaneme).
2. České jednotkové náklady a české čísla o neplánovaných hospitalizáciách po chemoterapii.
3. Triedu zdravotníckej pomôcky podľa MDR pre takýto nástroj (overiť, napr. podľa MDCG 2019-11 a pravidla 11 pre softvér) a vplyv AI Actu.
4. Poplachy na pacienta v PRO-TECT (primárny text sa mi neotvoril).
5. Presný aktuálny stav aplikácie Mika v registri DiGA a cenu Kaiku/Noona.
6. Či má FNMH už nejaký systém diaľkového sledovania (jedno vyhľadávanie nič nenašlo).
7. Overenie tvrdenia „lekári podhodnocujú príznaky až o polovicu" (JCO, Európa) a presná definícia „zlepšenia kvality života" v Basch 2016.
