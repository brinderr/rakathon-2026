# VZP – Kvalita péče na konci života (všetky mestá): hĺbková analýza výzvy

_Stav: piatok 16. 10. 2026, ~16:25 (posledná správa v kanáli výzvy je zo 16:05, tabuľa tímov načítaná ~16:20). Písané pre Bruna a Maťa (nie sú technici); odborné pojmy sú vysvetlené v zátvorke._
_Značky: **[Slack]** zo Slacku, **[deck]** z podkladu výzvy (prezentácia VZP, čítaná celá cez Drive), **[slovník]** z Google Docu „Datový slovník, vysvětlivky, indikátory“, **[dok.]** z oficiálnej dokumentácie datasetu NOP Online (PDF, čítané celé), **[web]** overené na webe, **[stratégia]** z Analytickej časti Stratégie rozvoja paliatívnej starostlivosti do 2035 (MZ, PDF, čítané cez text), **[prepočet]** môj výpočet, **[odhad]** môj záver, nie fakt, **[?]** neisté alebo neoverené._
_Pravidlá: nič sa neposielalo ani necommitovalo, Slack len čítaný, žiadne kontakty osôb. Pozn.: limit webových vyhľadávaní bol v tomto behu vyčerpaný, takže doplnkové štúdie som overoval priamo cez DOI a oficiálne stránky; čísla z `07` a `08` som znova neoveroval a značím ich odkazom na tie súbory._

---

## 0. Zhrnutie na jednu stránku

- **Čo výzva chce:** VZP chce **transparentný analytický rámec**, ktorý z anonymných dát o onkologických pacientoch ukáže, ako vyzerá starostlivosť v **posledných týždňoch života** (napr. chemoterapia alebo rádioterapia v posledných 14/30 dňoch), zohľadní rozdiely medzi pacientmi a **označí odchýlky, ktoré treba odborne vysvetliť**. Výslovne **nie** hodnotenie pacienta, lekára ani pracoviska a **nie** individuálna predpoveď smrti. Je to **analytika pre poisťovňu a odborníkov, nie nástroj pre lekára pri lôžku**.
- **Dáta máme a sú verejné:** dataset NOP Online (Národný onkologický program) po diagnózach, **dnes sa dá stiahnuť bez prihlásenia** (pankreas C25 = 19 MB, pľúca C34 = 56 MB, močový mechúr C67 = 18 MB, atď.), s 82-stranovou dokumentáciou a **341 stĺpcami** na riadok. Slabé miesta: dáta sú z poisťovní a registra (nie klinická dokumentácia), **žiadny riadok sa nedá prepojiť s iným**, **nie je v nich miesto úmrtia, hospic ani paliatívna starostlivosť**, a **nie sú v nich konkrétne nemocnice** (len typ centra a kraj bydliska).
- **Môže ju zvoliť pražský tím? Áno.** Je to jedna z troch VZP výziev, ktoré sú v zozname **každého** mesta (pražský výber = 9 pražských + 3 VZP = 12). Víťaz každej výzvy, **aj VZP zo všetkých miest**, ide do nedeľného finále (organizátor T. Studeník, #02-dotazy, 15. 10. 15:42) **[Slack]**.
- **Konkurencia: dnes nulová.** Tabuľa o ~16:20 ukazuje **0 tímov v Prahe, 0 v Brne, 0 v Ostrave**. Do 19:00 čakám v Prahe 0–2 pridané tímy (signály v §6). Pre porovnanie: mamograf 3 pražské tímy, Trial Matching 4.
- **Najväčší háčik:** výzva je **ťažko „predajná“** (kupec je poisťovňa/ministerstvo, nie nemocnica; Inovačný portál VZP analytiku pre platcu **nepokrýva**) a **ťažko „wowová“** (štatistika, nie čarovné demo). Silné sú dáta, realizovateľnosť za noc, partner (VZP) a takmer istá cesta do finále.
- **Môj odhad skóre:** vážený priemer **5,8 / 10** (detail §7; priemer medzi výzvami = 5, ostatné VZP/FNMH analýzy vyšli 5,9–6,5).
- **Čo by sme postavili:** „**Posledných 30 dní**“ – jedna stránka, ktorá pre vybranú diagnózu ukáže **7 ukazovateľov**, **hrubé vs. upravené porovnanie** (kraje, typ centra, roky), **neistotu** (intervaly spoľahlivosti) a **3 hypotézy**, a hlavne má **zabudované pravidlá výzvy ako ochranu v softvéri**: na otázku „ktorý kraj/nemocnica má najhoršiu starostlivosť?“ odpovie **vysvetlením, prečo to z dát nejde**. Šialený variant: **Atlas konca života** zo všetkých 21 datasetov s AI „tvorcom hypotéz“ a návrhom národnej sady ukazovateľov (§5.5).
- **Čo robiť pred 19:00:** (1) opýtať sa doc. Študentovej na mieste na 4 otázky z §1.8, (2) **pozrieť vizuálne slide 5 decku** (zoznam ukazovateľov je v obrázku, textom prázdny), (3) rozhodnúť; výber sa dá po odoslaní ešte zmeniť odkazom z e-mailu do 19:00.

---

## 1. Presné zadanie

### 1.1 Zdroje, ktoré som prešiel
- **Slack kanál `#kvalita-pece-na-konci-zivota`** (ID C0C7VGRFG77, založený 9. 10.): prečítaný **celý** (všetky správy od 9. 10. do 16. 10. 16:05). Je v ňom **iba 6 vecných správ** (zvyšok sú „joined“): jedna otázka hackera a štyri odpovede mentorky K. Holá + jej odkaz na Google Doc **[Slack]**. Žiadne vlákna ani súbory v kanáli nie sú.
- **Deck VZP „Kvalita péče na konci života“** (11 slidov, doc. Študentová, 16. 10. 2026): prečítaný celý cez Drive konektor **[deck]**. Slide 5 „Jaké indikátory můžeme sledovat?“ a slide 6 (dáta) majú v textovom výťahu **prázdny obsah** (pravdepodobne obrázky) **[?]**.
- **Google Doc „Datový slovník, vysvětlivky, indikátory“** (Holá, 14:45): prečítaný celý; oddiel „pracovní seznam indikátorů“ je na konci **prázdny** (tabuľka/obrázok?) **[slovník]**.
- **Dokumentácia datasetu NOP Online – pankreas C25** (PDF, verzia 1.0 z 20. 11. 2025, 82 strán): prečítaná celá **[dok.]**. Predpokladám rovnakú schému pre ostatné diagnózy **[odhad]**; ich PDF som nečítal.
- **Stratégia rozvoja paliatívnej starostlivosti v ČR do 2035 – Analytická časť** (MZ, PDF 110 strán; stav k 1. 1. 2025): text extrahovaný a prečítaný v relevantných kapitolách **[stratégia]**.
- Repo: `04`, `05` (§1.1, §2, §3), `06` (§2.3), `07` (B8), `08` (§6–§9), `09` (§1, §3.1).
- Live tabuľa tímov `submit.rakathon.cz/vyzvy` (načítaná ~16:20) a vlákna v #02-dotazy (finále, minimálny tím, onsite).

### 1.2 Kto zadáva a kto pomáha
- **Zadávateľ:** VZP ČR (Všeobecná zdravotní pojišťovna). Garantka a autorka decku: **doc. MUDr. Hana Študentová, Ph.D., MHA** (FN Olomouc), **mentorka na mieste v Prahe**. **Mgr. Kateřina Holá, Ph.D.** (FN Olomouc, Brno) je mentorka **online** a odpovedá v kanáli. **Jan Bartyzal** (VZP, cloud a dáta) je technický mentor v Prahe (za výťahom v prízemí) a do kanála vstúpil o 14:51 **[deck + Slack]**.
- **Ľudia s mocou nad víťazom:** v sobotu rozhoduje **zadávateľ výzvy** (obchádza tímy 14:00–16:00), v nedeľu 12-členná porota, v ktorej sedí **Antonín Hlavinka (VZP, námestník pre zdravotnú politiku a inovácie)**, zástupkyňa MZ, pacientska organizácia (Hlas onkologických pacientov) a ďalší (`09` §1.2).
- **Ďalší mentor s pohľadom poisťovne:** neurochirurg, člen dozornej rady VZP a predseda Mladých lekárov ponúkol v `#07-hledam-mentora` (13:27) posúdiť, „či nápad rieši skutočný problém“ **[Slack]**. Hodí sa na rýchlu spätnú väzbu.

### 1.3 Otázka výzvy a 4 kroky
Hlavná otázka **[deck]**: *„Dokážeme vytvořit transparentní analytický rámec, který ukáže vzorce péče v závěru života, zohlední rozdíly mezi pacienty a pomůže identifikovat odchylky, které si zaslouží další odborné vysvětlení? Nejde o hodnocení konkrétního pacienta, lékaře nebo pracoviště.“*

| Krok | Čo to znamená (po slovensky) |
|---|---|
| 1 ZMĚŘIT | Určiť skupinu pacientov a vypočítať zrozumiteľné ukazovatele starostlivosti v závere života (deck spomína Power BI) |
| 2 ZOHLEDNIT | Zohľadniť, že pacienti sa líšia (diagnóza, štádium, vek, ďalšie choroby): **case-mix** |
| 3 POROVNAT | Porovnať skupiny, ukázať variabilitu a **štatistickú neistotu** |
| 4 VYSVĚTLIT | Oddeliť **zistenia od hypotéz** a ukázať, čo sa z dát vyvodiť nedá |

### 1.4 Štyri pravidlá, ktoré riešenie MUSÍ rešpektovať **[deck]**
1. **Región ≠ poskytovateľ:** kraj bydliska pacienta nie je miesto, kde sa liečil.
2. **Koniec protinádorovej liečby ≠ začiatok paliatívnej starostlivosti:** ak údaj v dátach nie je, nedopočítavať ho a neprezentovať ako fakt.
3. **Korelácia ≠ hodnotenie kvality:** liečba krátko pred úmrtím sama o sebe nie je dôkazom nevhodnej starostlivosti.
4. **Populačná analýza ≠ individuálne rozhodovanie:** žiadne rozhodovanie o ukončení liečby, **žiadna individuálna prognóza úmrtia**. Citát: „Hledáme signály pro další odbornou diskusi – ne automatické verdikty.“

### 1.5 Čo sa očakáva za hackathon (a čo z toho urobíme) **[deck]**
Vybrať **jednu diagnózu** a ukázať celý postup. „Nečekáme finální národní metodiku ani klinický rozhodovací systém.“

| Požadovaný výstup (z decku) | Naša odpoveď |
|---|---|
| Základný **report kvality dát** | Karta „Čo o dátach vieme a nevieme“ (počty, chýbajúce štádium, nezrovnalosti, pokrytie rokov) |
| **5–8 ukazovateľov** starostlivosti v závere života | 7 ukazovateľov (§5.2) |
| **Hrubé aj základne upravené (case-mix)** porovnanie | Hrubé % + očakávané vs. pozorované podľa vek/pohlavie/štádium/komorbidity/rok |
| Prehľadná **vizualizácia / dashboard** | Jedna stránka v češtine, funnel plot (graf s „lievikom“ neistoty) |
| **Faktory spojené s vyššou intenzitou** starostlivosti | Tabuľka účinkov s intervalmi (vek, štádium, MDT pred liečbou, typ centra, rok) |
| **3 konkrétne hypotézy** na overenie | 3 hypotézy s popisom „čo by ich vyvrátilo“ a „aké dáta treba“ |
| **Reprodukovateľný postup** | Jeden príkaz, verzované skripty, README, zámrzané definície |
| BONUS: druhá diagnóza alebo návrh validácie | Rovnaký kód spustený na 2.–3. diagnóze (konfigurácia, nie prepis) |

### 1.6 Dáta, ktoré dostaneme
**Zdroj:** „NOP Online – Otevřená data pro hlavní onkologické diagnózy“, https://onconet.cz/cs/data/otevrena-data-diagnozy/ **[deck slide 6 + Slack Holá 14:33]**. Mentorka dodala: „Ostatní indikátory si můžete vymyslet“ (14:32) a že pošle odkaz na ďalšie dátové sady NZIP **[Slack]**. Deck tvrdí, že „data, zadání a další podklady najdete na jednom místě“ (portál `aka.ms/rakathon2026`) **[deck]**; či tam leží niečo navyše oproti verejným CSV (napr. miesto úmrtia), **neviem [?]**.

**Čo ponúka web (overené 16. 10.)** **[web]**: 21 datasetov (13 solídnych nádorov a 8 krvných/lymfatických), každý ako **CSV + PDF dokumentácia**. Solídne: ORL, pažerák C15, žalúdok C16, **colorectal (CRC) 66 MB**, pečeň C22, žlčník C23, **pankreas C25 19 MB**, **pľúca C34 56 MB**, melanóm C43, **prsník C50 71 MB**, **prostata C61 63 MB**, oblička C64 26 MB, **mechúr C67 18 MB**. Stránka neuvádza licenciu ani počet riadkov.

**Ako vyzerá dataset (pankreas C25, dok. v1.0 z 20. 11. 2025)** **[dok.]**:
- **Riadkové dáta nových nádorov z Národného onkologického registra (NOR)** diagnostikovaných od **2011**, doplnené o hradené služby z poisťovní (NRHZS) a o úmrtie (List o prehliadke zomrelého). **Približne 2 200–2 700 záznamov ročne, 341 stĺpcov**. Celkovo asi 30–35 tis. riadkov **[prepočet]**.
- **Plne anonymné, riadky sú navzájom nezávislé** (žiadny identifikátor pacienta), dátum diagnózy len rok a mesiac, **všetky ostatné dátumy sú v dňoch od diagnózy**, bydlisko len kraj, **poskytovatelia nie sú uvedení, iba či ide o KOC (komplexné onkologické centrum), ROC (regionálne) alebo iné pracovisko**.
- **Liečba:** až 20 „modalít“ primárnej liečby a 20 následnej, každá s typom (O operácia, R rádioterapia, T centrová liečba, C chemoterapia), kódom, **dňom začiatku a dĺžkou**. Pre pankreas: chemoterapia = fluorouracil, gemcitabín, kapecitabín, paklitaxel, irinotekan, cisplatina, oxaliplatina; „centrová“ = erlotinib, everolimus, olaparib; rádioterapia = kódy 43315 (1 pole), 43633 (IMRT), 43641 (IGRT s 3D zobrazením). V dataset sú len látky použité aspoň u 1 % nádorov.
- **Úmrtie:** `umrti` (0/1), `time_datum_dg_to_umrti` (dni od diagnózy, môže byť i -10 pri diagnóze po pitve), `prvotni_pricina_umrti_kod`, `souhrn_diagnoz`.
- **Ďalšie premenné:** pohlavie, kraj, štádium (1–4, X = nehodnotiteľné, Y = chýba), grading, TNM, 10-ročná veková kategória, rok diagnózy, **komorbidity (DCCI – index pridružených chorôb)**, **MDT pred liečbou** (`je_mdt`), hospitalizácie počas liečby a **počet ošetrovacích dní na JIS**.

**Čo v dátach NIE JE** **[dok.]** (a preto to nesmieme tváriť ako zmerané):

| Chýba | Prečo je to dôležité |
|---|---|
| **Miesto úmrtia** (doma/nemocnica/hospic) | Hlavný svetový ukazovateľ kvality závera života sa z týchto dát **nedá spočítať** |
| **Paliatívna starostlivosť, hospic, mobilný hospic** | Pravidlo 2 výzvy: nedopočítavať |
| **Hospitalizácie a JIS v posledných dňoch** | Hospitalizácie sú len „počas primárnej/následnej liečby“, nie viazané na posledných 30 dní |
| **Konkrétne nemocnice** | Porovnávať poskytovateľov **nejde** (a je to aj zakázané) |
| **Riadky nemožno prepojiť** | Žiadne trajektórie jedného pacienta naprieč nádormi |
| **Údaje mimo verejného poistenia** | Samoplatcovia, štúdie a klinické skúšky nie sú zahrnuté |
| **Presné pripísanie liečby k nádoru** | Algoritmické (frekvencia, podobnosť diagnóz, čas); pri relapse sa fázy môžu zlúčiť, **všetka následná liečba je v dataseti jeden blok** |

Zlé správy v dokumentácii: prílohy 1–2 majú v nadpise „ZN jater“ (pečeň) hoci ide o pankreas **[dok., kopírovacia chyba, dá sa to ošetriť overením]**. Verzia 1.0, ročná aktualizácia.

### 1.7 Hlavný ukazovateľ (presná definícia) **[slovník]**
- **Kohorta:** `umrti = 1` a `prvotni_pricina_umrti_kod` obsahuje **C** (napr. C67 pri mechúri) **[?]**: nie je jasné, či musí ísť presne o diagnózu súboru alebo o ľubovoľné C (sekundárny nádor C78 a pod.); opýtať sa.
- **Dva výpočty** podľa toho, či pacient dostal následnú liečbu (`je_NL`):
  - `je_NL = 0`: `time_datum_dg_to_umrti − (time_datum_dg_to_zahajeni_pl_lecba_i + pl_delka_lecby_i)`
  - `je_NL = 1`: `time_datum_dg_to_umrti − (time_datum_dg_to_zahajeni_nl + time_zahajeni_nl_to_zahajeni_nl_lecba_i + nl_delka_lecby_i)`
- Pacient sa započíta do čitateľa, ak **aspoň pre jedno `i`** platí **0 ≤ výsledok ≤ 30 (resp. 15)**. **Podiel = čitateľ / počet všetkých zomretých × 100.**
- **Systémová liečba** = ATC začínajúce **L01** bez metotrexátu, mitomycínu, epirubicínu; **rádioterapia** podľa kódov v metodike jednotlivých sád; osobitne **30 a 14 dní** pred smrťou.
- **Nezrovnalosti k overeniu [?]:** slovník píše „30 (resp. **15**)“, deck píše **14** dní. A príklad pre C67 je **výčet konkrétnych látok** (cisplatina, karboplatina, vinflunin, nivolumab, pembrolizumab, avelumab, atezolizumab, enfortumab vedotin), čo vyzerá skôr ako **zoznam látok z prílohy datasetu** než „všetko L01“.

### 1.8 Kritériá, ceny, mentori
- **Špecifické kritériá výzvy nie sú.** Platia všeobecné: sobota **1. AI technológia a prevedenie, 2. využiteľnosť v praxi u zadávateľa, 3. inovatívnosť**; nedeľa pridáva **4. škálovateľnosť** a **5. kvalitu prezentácie a tímu**. Váhy nie sú zverejnené (`05` §2.3). Deck uvádza „dopad“: lepšie porozumenie dátam, identifikácia variability, podpora odbornej diskusie, ďalšie overovanie, základ metodiky **[deck]**.
- **Ceny:** 100/50/25 tis. Kč + **VZP „Křeslo pro inovace“** (podľa tlačovej správy VZP z 8. 10. najlepší tím VZP výziev **predstaví návrh osobne generálnemu riaditeľovi Ivanovi Duškovi**; VZP chce sľubné nápady ďalej overovať a prípadne **pilotovať**) **[web]**. Bonus InterSystems 1 500 € sa dá kombinovať.
- **Čo odovzdať v sobotu 13:00:** názov, popis do 140 znakov, popis AI a dopadu, povinný titulný obrázok 16:9 (do 8 MB), odkazy GitHub/demo/video (`05` §2.2).

**Otázky pre mentorov (kým je ešte čas):**
1. **Čo je „systémová liečba“ v ukazovateli:** všetky L01 bez troch látok, alebo len látky z prílohy datasetu danej diagnózy? A **14 alebo 15 dní**?
2. **Kohorta:** musí byť príčina smrti presne daná diagnóza, alebo ľubovoľné C? Je k dispozícii **referenčná hodnota** hlavného ukazovateľa (napr. pre C67), aby sme vedeli, že kód počíta správne?
3. **Je na portáli niečo navyše** oproti verejným CSV (miesto úmrtia, hospic, kódy paliatívy, JIS v posledných dňoch)? (Bartyzal)
4. **Čo je v „pracovnom zozname ukazovateľov“** (slide 5, text chýba)? A smie byť výstup v češtine/slovenčine a koľko kreditu dáva návrh nových ukazovateľov?

---

## 2. Koncový užívateľ

_Dôležité: toto je môj odhad z decku, stratégie a rozhovorov VZP, **nie rozhovor s ľuďmi**. [odhad]_

**Kto to bude používať (v poradí dôležitosti):**
1. **Analytik/ka alebo hlavný lekár v úseku zdravotnej politiky a inovácií VZP** (Hlavinkov úsek). Dostane otázku od vedenia: „Platíme za chemoterapiu v posledných týždňoch života? V ktorých krajoch, mení sa to?“ VZP dnes sama priznáva, že je „asi 20 rokov pozadu“ v dátach a chce platiť za výsledky (Duškov, 1. 4. 2026) (`09` §3.1).
2. **Odborník, ktorý sedí v pracovných skupinách MZ/odborných spoločností** (typ doc. Študentová): potrebuje **číslo, ktorému sa dá veriť** na diskusiu o stratégii paliatívnej starostlivosti 2035 a o Národnom onkologickom pláne 2030, ktorý má vlastný dielčí cieľ „Vznik Národní strategie paliativní péče o pacienty v závěru života“ **[stratégia]**.
3. **ÚZIS / IBA MU (tvorcovia NOP Online)**: pridali by ukazovatele do portálu; **portál indikátorov kvality ich dnes na hlavnej stránke pre závere života nemá** **[web, hlavná stránka]**.
4. **Manažéri kvality komplexných onkologických centier a hospicov**: chceli by vidieť „nás“ oproti typu centra, ale **dáta konkrétne nemocnice neukazujú**.
5. **Nepriamo:** pacient a rodina (lepší záver života), novinári (kto si pozrie hrubé čísla, urobí z nich „zlé nemocnice“).

**Deň analytika VZP dnes (typický príbeh) [odhad]:**
- Ráno príde otázka od riaditeľa. Analytik napíše SQL nad poistnými dátami, **každý krok je spor** (čo je „systémová liečba“, ktorá diagnóza, posledných 14 alebo 30 dní, ako priradiť liečbu k nádoru).
- Hotový Excel pošle onkológovi. Ten odpovie: „Moji pacienti sú chorší, to nie je kvalita.“ **Hrubé rozdiely sa nedajú obhájiť**, pretože chýba case-mix a neistota (to je presne text decku).
- O rok je otázka znova a **nikto nevie zreprodukovať minuloročný postup**. Výsledok skončí v prezentácii. Politici a médiá si z čísla urobia verdikt.

**Prečo dnešný stav zlyháva (doložené):**
- **V ČR chýbajú štandardizované ukazovatele kvality paliatívnej starostlivosti**, chýba systematický monitoring a „nejsou dostupné nastavené sady dat“ na sledovanie kvality; **v roku 2025 sa systematicky nezbierajú dáta o starostlivosti v závere života doma** **[stratégia, kap. 2.6.2, 6.4, 7.1.8–7.1.10]**.
- Deck: závere života je v dátach „popsaný méně systematicky“, chýba „jednotný a opakovatelný rámec“, hrubé rozdiely nie sú rozdielmi v kvalite **[deck]**.

---

## 3. Dôkazy o probléme (čísla a štúdie)

### 3.1 Česko
| Číslo | Zdroj |
|---|---|
| Ročne zomiera ~**110 000** ľudí; ~**65 000** z nich potrebuje nejakú formu paliatívnej starostlivosti; ~**20 000** (30 %) významne profituje zo **špecializovanej** | [MZ, Analytická časť stratégie 2035, kap. 1.1.1](https://mzd.gov.cz/wp-content/uploads/2025/04/Analyticka-cast-Strategie-rozvoje-paliativni-pece-v-CR-do-roku-2025.pdf) **[stratégia, overené]** |
| **62 %** očakávateľných úmrtí je na lôžkach akútnej a následnej starostlivosti (Nemecko 49 %, Rakúsko 51 %, **Holandsko 24 %**); **doma 26 %** (Holandsko 45,5 %); sociálne zariadenia 11 % (Holandsko 37 %). Pozor: je to **všetci chronicky chorí, nie len onkologickí** | rovnaký dokument, kap. 2.4.2 **[overené]** |
| Zahraničné rozdiely v mieste úmrtia **onkologických** pacientov v 7 krajinách (nad 65 rokov, 2010): v nemocnici zomrelo **USA 22,2 %, Holandsko 29,4 %, Nemecko 38,3 %, Anglicko 41,7 %, Nórsko 44,7 %, Belgicko 51,2 %, Kanada 52,1 %**; JIS v posledných 180 dňoch **USA 40,3 % vs. <18 % inde**; nemocničné výdavky na osobu v posledných 180 dňoch **9 342 USD (Anglicko) až 21 840 USD (Kanada)** | [Bekelman, JAMA 2016](https://doi.org/10.1001/jama.2015.18603) (cez `07` B8) |
| **Hospice:** 23 poskytovateľov, 524 lôžok (2023), **92 % pacientov je onkologických**; priemerná dĺžka pobytu 23,4 dňa, **medián 10 dní (polovica pacientov zomrie do 10 dní od prijatia)**; v hospicoch zomrie ~5 000 ľudí ročne (4,5 % úmrtí). Signál **neskorého** príchodu | [stratégia, kap. 3.2.1] **[overené]** |
| **Mobilná špecializovaná paliatíva (MSPP):** pacienti **2 927 (2019) → 7 130 (2023)**, úhrady **81 → 320 mil. Kč**, náklad poisťovne na pacienta 27 760 → 44 934 Kč | [stratégia, tab. 7] **[overené]** |
| **Dáta o domácej starostlivosti v závere života sa v ČR systematicky nezbierajú; štandardné ukazovatele kvality paliatívnej starostlivosti chýbajú** | [stratégia, kap. 2.6.2 a 7.1.8] **[overené]** |
| Úmrtia na zhubné nádory v ČR: **26 865** (2021; 19,3 % všetkých úmrtí) | [ÚZIS](https://www.uzis.cz/res/f/008447/novotvary2019-2021.pdf) (cez `08`) **[sekundárne]** |
| OECD/EK: odhadom **>80 %** onkologických pacientov v terminálnej fáze dostalo v 2022 paliatívnu starostlivosť, **regionálne rozdiely v domácej paliatíve sú veľké** | [OECD/EK Czechia 2025](https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-cs-2025-1663-v2-en.pdf) (cez `07` B8) |
| VZP minula na onkologickú starostlivosť **23,68 mld. Kč** (2024, ~332 800 klientov) | [VZP, 13. 5. 2025](https://www.vzp.cz/o-nas/aktuality/vzp-s-kolorektalnim-karcinomem-se-leci-temer-kazdy-desaty-onkologicky-pacient) (cez `08` §7.1) |
| Staršie (2011–2013, N = 27 084): okolo troch štvrtín onkologických pacientov zomrelo na lôžku zdravotníckeho zariadenia; ~63 % na lôžkach akútnej/následnej starostlivosti, 9 % hospic, 18 % doma | [ÚZIS](https://www.uzis.cz/system/files/2017-01-19-Paliativni-pece-MZ-06-Slama-Svacara-Posledni-hospitalizace.pdf), [ČSPM](https://paliativa.cz/sites/default/files/2019-09/situacni-analyza-paliativni-pece.pdf) (cez `08` §6) **[staré, nečítané celé, ?]** |

**Čo som nenašiel [?]:** **české číslo** pre „podiel onkologických pacientov s chemoterapiou v posledných 30 dňoch života“ (presne to má výzva vytvoriť), ani **náklady posledného roka života** v ČR (`08` §6 to potvrdzuje).

### 3.2 Svet: čo je „agresívna starostlivosť na konci života“ a prečo sa meria
- **Earle a kol., JCO 2003**: panel expertov, rozhovory s pacientmi a rodinami a literatúra určili **ukazovatele kvality závera života z administratívnych dát**: začatie alebo pokračovanie protinádorovej liečby veľmi blízko smrti, časté pohotovosti/hospitalizácie/JIS, **neskorý vstup do hospicu** alebo žiadny, smrť v akútnej nemocnici. **Dôležité pre nás: ukazovatele založené na „obmedzovaní liečby s nízkym prínosom“ alebo na ekonomickej efektívnosti pacienti, rodiny ani lekári neprijali** [JCO 2003;21:1133](https://doi.org/10.1200/JCO.2003.03.059) **[overené cez Crossref, abstrakt]**. Z toho plynie rétorika: **kvalita a dôstojnosť, nie šetrenie**.
- **Earle a kol., JCO 2004** (Medicare, 28 777 ľudí 65+ s rakovinou pľúc, prsníka, hrubého čreva a iných GI nádorov, 1993–1996): podiel liečených, ktorí boli na chemoterapii **do 2 týždňov pred smrťou, vzrástol z 13,8 % na 18,5 %**; pribúdali viaceré pohotovosti/hospitalizácie/JIS v poslednom mesiaci; **hospic sa začínal čoraz častejšie len v posledných 3 dňoch**; **vyššia dostupnosť hospicu = menej agresívna liečba** [JCO 2004;22:315](https://doi.org/10.1200/JCO.2004.08.136) **[overené cez Crossref, abstrakt; dáta z 90. rokov USA]**.
- **Temel a kol., NEJM 2010** (151 pacientov s rakovinou pľúc): **skorá paliatívna starostlivosť** priniesla lepšiu kvalitu života (**98,0 vs. 91,5**), menej depresie (**16 % vs. 38 %**), **menej agresívnej starostlivosti na konci života (33 % vs. 54 %)** a dlhší medián prežitia (**11,6 vs. 8,9 mesiaca**) [DOI](https://doi.org/10.1056/NEJMoa1000678) (cez `07` B8) **[jedna štúdia, jedna diagnóza]**.
- **Prigerson a kol., JAMA Oncology 2015** skúmali vzťah chemoterapie, výkonnostného stavu a kvality života na konci života [DOI](https://doi.org/10.1001/jamaoncol.2015.2378); **názov overený, výsledky v tomto behu nie [?]**, preto ich v pitchi nepoužiť.

### 3.3 Koľko to stojí (času, peňazí, životov)
- **Peniaze:** Bekelman (vyššie) ukazuje **2,3-násobný rozdiel** v nemocničných výdavkoch na osobu v posledných 180 dňoch medzi krajinami (9 342 vs. 21 840 USD) **[prepočet]**; **české číslo nemáme [?]**. Preto **netvrdíme úsporu**; tvrdíme, že rozdiely **nikto systematicky nemeria**.
- **Čas:** nezistiteľné; ide o personál analýz, nie o ambulantný čas.
- **Životy/kvalita:** najsilnejší dôkaz je skorá paliatíva (Temel), ale **naše riešenie paliatívu nezavádza, iba robí viditeľnou variabilitu**; kauzálny dopad na život sľúbiť nemôžeme.

---

## 4. Existujúce riešenia na trhu

| Riešenie | Kto za to platí / cena | Čo robí | Medzera |
|---|---|---|---|
| **NOP Online** (IBA Masarykova univerzita, MZ, ÚZIS; podpora AstraZeneca a Roche) | Verejné financovanie, **zadarmo**; ide o pilotnú novú verziu portálu | Otvorené dáta po diagnózach, „Indikátory kvality a epidemiologické indikátory“, mapy centier | Hlavná stránka **neuvádza žiadne ukazovatele závera života** **[web, hlavná stránka, ?]**; dáta sú surové, **nikto nehovorí „čo z nich nevyplýva“** |
| **Strategické analýzy MZ/ÚZIS/ČSPM** (projekt „Standardizace paliativní péče“, spolufinancovaný z EÚ, OP Zaměstnanost plus) | Verejný/EÚ projekt | Jednorazová analytická štúdia k 1. 1. 2025 | Štúdia sama píše, že **chýbajú ukazovatele a systematický monitoring** |
| **VZP interná analytika (Power BI)** | Interný rozpočet | Deck zmieňuje Power BI ako cieľový spôsob zobrazenia | Ad hoc, bez zdokumentovaného opakovateľného rámca **[odhad]** |
| **OHID „Palliative and End of Life Care Profiles“ (Anglicko, Fingertips)** | Verejný, zadarmo | Podiel úmrtí doma/nemocnica/hospic, **úmrtia s ≥3 pohotovostnými príjmami v posledných 90 dňoch života**, určené pre **komisárov a plánovačov** [web](https://fingertips.phe.org.uk/profile/end-of-life) | Anglicko, nie Česko; aktualizácia niektorých faktových listov **pozastavená v máji 2026** |
| **Dartmouth Atlas „End of Life Cancer Care“ (USA)** | Akademický, zadarmo | Mapy intenzity starostlivosti | **Už neaktualizovaný, historické sadzby len do 2019** [web](https://www.dartmouthatlas.org/) |
| **ASCO QOPI, programy platcov v USA** | Platené programy [?] | Merajú napr. chemoterapiu v posledných 14 dňoch | Nepodarilo sa mi stránku overiť (404), **neuvádzať v pitchi [?]** |
| **AI modely na predikciu úmrtia/paliatívu u jednotlivca** (zámorské nemocničné systémy) | Platia nemocnice | Odhad individuálnej prognózy | **Zakázané touto výzvou** (pravidlo 4); iná úloha, iné riziko |

**Kto za to platí:** dnes nikto systematicky. Platiteľ by bol **VZP/MZ/ÚZIS z analytického alebo grantového rozpočtu**. **Inovačný portál VZP pre nás nie je cesta:** oprávnené sú digitálne zdravotnícke pomôcky, telemedicína, AI s klinickým alebo prevádzkovým dopadom; **dátový/analytický softvér pre platcu nespomína** a žiadateľ musí byť výrobca s klinickým partnerom [web](https://inovace.vzp.cz) **[overené 16. 10.]**.

**Kde je priestor urobiť to lepšie/rýchlejšie/lacnejšie/jednoduchšie:**
1. **Opakovateľný, verzovaný „recept“** (jeden príkaz → rovnaké čísla), ktorý sa po každom ročnom vydaní dát prepočíta za minúty, namiesto ad hoc projektov.
2. **Ochrana pred zlou interpretáciou zabudovaná v softvéri** (nedá sa zobraziť rebríček nemocníc, každé číslo má interval, vždy panel „čo z toho nevyplýva“).
3. **Rovnaká metodika naprieč diagnózami** (7 v zadaní, 13 solídnych dostupných) a rýchle zistenie, **ktoré ukazovatele sú vôbec merateľné a stabilné**.
4. **AI ako pomocník interpretácie** (vysvetlenie v jednoduchom jazyku, „advokát diabla“ pre hypotézy), ale **bez prognóz jednotlivcov**.

---

## 5. Najlepší návrh riešenia pre nás

### 5.1 Princíp
**Cieľ: umožniť odborníkom hovoriť o konci života onkologických pacientov na základe čísel a férovo.** Hotový výrobok je **jednostránková webová aplikácia** (ide aj offline, v češtine, s exportom do PDF), nie model. Víťaznú výhodu nemá štatistika (tú urobí každý tím) ale **(a)** vrstva ochrany pravidiel výzvy v kóde, **(b)** poctivá neistota, **(c)** príbeh a prezentácia.

### 5.2 Čo nočný výstup obsahuje (A: odporúčaný „Posledných 30 dní“)
**Diagnóza:** postaviť kód na **pankrease C25** (dokumentáciu som overil, najmenšie riziko, 19 MB), potom ho **bez prepisovania** spustiť na **pľúcach C34** (najväčší dopad, doba imunoterapie) a na **C67** (príklad zo slovníka mentorov, slúži ako kalibrácia). Ktorá diagnóza bude „titulná“, rozhodnúť až po prvom behu.

**7 ukazovateľov** (všetko počíta zo stĺpcov `umrti`, `time_datum_dg_to_umrti`, `pl_*`, `nl_*`):
1. **Systémová liečba v posledných 30 dňoch života** (hlavný ukazovateľ VZP; podiel zo všetkých zomretých).
2. To isté **14 dní**.
3. **Rádioterapia** v posledných 30/14 dňoch; podukazovateľ: **jednoduchá technika (kód 43315) vs. IMRT/IGRT (43633, 43641)**. Tu môže **Maťo** dodať odborný pohľad (paliatívne ožiarenie jedným poľom je klinicky legitímne, zložitá technika blízko smrti vyvoláva otázky) **[odhad, treba klinicky overiť]**.
4. **Nová liečba začatá v posledných 30 dňoch života** (Earle ju považuje za jeden z kľúčových signálov; dáta majú dni začiatku každej modality).
5. **Akákoľvek protinádorová liečba v posledných 14 dňoch** (zjednotenie).
6. **Bez akejkoľvek protinádorovej liečby** („najlepšia podporná starostlivosť“) a **smrť do 30/90 dní od diagnózy** (**kontext, nie kvalita**: skoré úmrtie vysvetľuje veľa).
7. **Podiel pacientov v druhej alebo ďalšej línii liečby krátko pred smrťou:** z týchto dát sa **nedá spoľahlivo určiť** (celá následná liečba je v dataseti jeden blok), preto ho uvedieme ako „**nemerateľné z týchto dát**“. Tento riadok je zámer: ukazuje poctivosť.
- **Čo sa nedá zmerať a ukážeme to na kartách:** miesto úmrtia, hospic, paliatíva, JIS v posledných dňoch (§1.6).

**Hrubé vs. upravené porovnanie:**
- **Kraj bydliska (nie poskytovateľ), typ centra (KOC/ROC/iné), rok diagnózy**; **case-mix = vek, pohlavie, štádium, komorbidity (DCCI), grading**.
- Výpočet: logistická regresia (alebo jednoduchá nepriama štandardizácia: „očakávané vs. pozorované“), **intervaly spoľahlivosti** a **funnel plot** (graf, kde malé skupiny majú širší „lievik“, aby sa náhodný šum nevydával za signál).
- Vždy dvojica: **„hrubé“ a „po úprave“**; mnohé rozdiely sa po úprave zmenšia, **čo je samo o sebe zistenie**.

**3 hypotézy** (návrhy, ktoré **dáta samé navrhnú a otestujú**, každá s „čo by ju vyvrátilo“ a „aké dáta treba“); príklady [odhad, čísla ukáže až beh]:
- H1: Pacienti, ktorých pred liečbou posudzoval **MDT (konzílium)**, majú menej liečby v posledných 14 dňoch.
- H2: Podiel liečby v posledných 30 dňoch sa **mení v čase** (2011 → dnes), najmä po príchode nových látok.
- H3: Rozdiely medzi krajmi **zostávajú po úprave** len v jednom až dvoch ukazovateľoch (a čo to **neznamená**: poskytovateľ).
- Každá hypotéza končí vetou: „**Na overenie treba dáta VZP o mieste úmrtia, hospici a paliatíve.**“

**Karta kvality dát:** počet riadkov a zomretých, rozdelenie podľa rokov, podiel štádia X/Y, nelogické hodnoty (záporné dni, liečba po smrti), podiel pacientov s uvedenou liečbou, **dokumentačné chyby** (napr. nadpisy príloh „ZN jater“).

**Reprodukovateľnosť (kritérium výzvy):** jeden príkaz `make all`, zamrazené definície v jednom súbore, README, verzia dát, test na malej vzorke.

### 5.3 AI vrstva (aby kritérium „AI technológia“ nebolo falošné) a ochrana pravidiel
- **Claude ako „metodik“:** číta slovník a dokumentáciu a z nich vygeneruje **špecifikáciu ukazovateľov a kód** (viditeľná stopa).
- **Rozprávač v češtine/slovenčine:** vysvetlenie čísel jednoduchým jazykom, ale **čísla vkladá výhradne z vypočítaných tabuliek** (žiadna voľná číslica z modelu).
- **Advokát diabla:** ku každej hypotéze vypíše **zavádzajúce faktory** a „čo nám v dátach chýba“.
- **Ochrana pravidiel (hlavný „wow“ moment):** zoznam 10 **zakázaných otázok** („ktorá nemocnica je najhoršia?“, „koľko mu zostáva?“, „má sa ukončiť liečba?“, „ktorý lekár podáva najviac chémie?“). Systém **odmietne a vysvetlí prečo + čo vie ponúknuť namiesto toho**. Výslovne zodpovedá slovám decku: „signály pro odbornou diskusi, ne automatické verdikty“. Ukázať to **naživo** (je to dôkaz, že sme rozumeli výzve lepšie než „iný dashboard“).
- **Nezabúdať:** žiadna individuálna prognóza, žiadne rebríčky poskytovateľov.

### 5.4 Pitch 3 min + video (hrubý scenár)
| Čas | Obsah |
|---|---|
| 0:00–0:20 | **Hák:** „V Česku ročne zomiera ~110 000 ľudí a 62 % z nich v nemocnici; v Holandsku 24 %. Ale ako vyzerá **posledných 30 dní** onkologického pacienta, **nikto systematicky nemeria**. Chýbajú aj ukazovatele kvality.“ (zdroje: MZ stratégia 2035) |
| 0:20–0:50 | **Problém:** hrubé čísla klamú („moji pacienti sú chorší“, kraj ≠ nemocnica). Preto výzva žiada rámec, nie verdikt. |
| 0:50–2:00 | **Živé demo:** vyber diagnózu → karta kvality dát → 7 ukazovateľov → graf hrubé vs. upravené → klik na odchýlku → vysvetlenie + panel „čo z toho nevyplýva“ → **otázka „ktorá nemocnica je najhoršia?“ a odmietnutie**. |
| 2:00–2:30 | **3 hypotézy** a čo by ich vyvrátilo; čo sa **nedá** zmerať. |
| 2:30–3:00 | **Výzva VZP:** pilot na plných poistných dátach (miesto úmrtia, hospic, paliatíva), KPI a pravidlá stop/hold/go (to VZP žiada od pilotov); kód je otvorený; ďalšie diagnózy sú otázka hodín. |

**Video (1–1,5 min, Bruno):** abstraktné, bez herca v nemocnici a bez skutočných pacientov: **kalendár, z ktorého ubúdajú dni** (30 → 0), na každom dni jedno číslo z dát, hlas v pokojnom tóne; záver: „Nehodnotíme. **Meriame, aby sa dalo férovo hovoriť.**“ Téma je citlivá; **tón je rozhodujúci**, rozprávanie nie je dramatizácia.

**Čo odovzdať ako obrázok (16:9):** jeden graf „posledných 30 dní“ + názov. **140 znakov (návrh):** „Opakovateľný rámec: 7 ukazovateľov starostlivosti v posledných 30 dňoch života, upravený o case-mix, s neistotou a 3 hypotézami.“

### 5.5 Šialený ambiciózny variant („Atlas konca života“)
Ak by sme boli s A hotoví do ~04:00:
1. **Rovnaký kód na všetkých 13 solídnych aj 8 krvných datasetoch** (jedna konfigurácia, rôzne zoznamy látok z príloh dokumentácie) → **Atlas konca života 2026**: ktoré ukazovatele sú **merateľné, stabilné v čase a líšia sa medzi krajmi**, a ktoré sú len šum.
2. **AI „továreň na hypotézy“**: vygeneruje stovky podskupinových porovnaní, **opraví ich na náhodné nálezy (FDR, Benjamini–Hochberg)** a prežije len pár; zvyšok sa **ukáže ako „testované a zamietnuté“**. To je presne rozdiel „zistenie vs. hypotéza“, ktorý výzva žiada.
3. **Návrh národnej sady ukazovateľov v0.1** (definície, čo treba zbierať, aké sú vlastnosti každého ukazovateľa): stratégia 2035 priznáva, že **žiadna štandardná sada neexistuje**; náš výstup je **prvý konkrétny návrh podložený dátami**.
4. **Export ukazovateľov ako FHIR `Measure`/`MeasureReport`** (štandard pre výmenu ukazovateľov kvality) a načítanie do **InterSystems IRIS for Health** → kandidatúra na **bonus InterSystems 1 500 €** (kombinovateľný s ľubovoľnou výzvou). **Overiť u mentora InterSystems, či je to zmysluplné použitie [?]**; ide len o voliteľnú nadstavbu.
5. **Neposkytovať:** simulátory „čo ak“ s úsporami, prognózy jednotlivcov, rebríčky.

### 5.6 Poradie prác cez noc (pre Claude Code)
(1) stiahnuť CSV (**treba súhlas** Bruna alebo Maťa: ide o verejné súbory, 19–71 MB, zo `onconet.cz`), (2) overiť stĺpce proti PDF, (3) ukazovatele + kontrola proti referenčnej hodnote mentorov, (4) štatistika (CI, funnel, case-mix), (5) stránka + ochrana pravidiel, (6) README + `make all`, (7) druhá/tretia diagnóza, (8) video a titulný obrázok. **Časová rezerva do 13:00:** zastaviť nové funkcie o ~08:00, zvyšok na kvalitu a skúšku pitchu.

---

## 6. Konkurencia na hackathone a oprávnenosť

**Môže pražský tím túto výzvu zvoliť? Áno [web + Slack].** Formulár `submit.rakathon.cz/vyzvy/vybrat` najprv pýta mesto a potom ukáže výzvy daného mesta; **pre Prahu ponúka 12 výziev, medzi nimi „Kvalita péče na konci života (VZP ČR, společná)“** (live tabuľa ~16:20). Výzva je „spoločná pre všetky mestá“ a dá sa ju spojiť s cenou InterSystems.

**Stav tabule (~16:20) [web]:**

| Mesto | Tímy na tejto výzve | Poznámka |
|---|---|---|
| **Praha** | **0** | 23 tímov má výzvu, **5 ešte nevybralo**: Ctrl+Alt+CURE, FIT/S, FSMZ (duplicita MSFZ), Pražský Meridian, walking legs; ďalších 7 zo zoznamu organizátorov **nie je ešte na tabuli** (Data Team, Junior Scholars, Nexlytics, Panacea, quattro formaggi, radiQA, Risk off) (`05` §3.1) |
| Brno | 0 | 12 tímov, všetky majú výzvu |
| Ostrava | 0 | 9 tímov, 2 ešte nevybrali (Až na měsíc, www.pixed.cz) |

**Signály, že sa niekto môže pridať [Slack]:** v kanáli výzvy sa 16. 10. 14:27 **solo hacker s partnerom na ceste** (názov tímu nepoznáme) pýtal na dáta „na úrovni pacienta aj nemocnice“ a na indikátory (chemo v posledných týždňoch, JIS, úmrtie v nemocnici); tím **Panacea** a **walking legs** vstúpili do kanála. Nie je isté, že si ju zvolia. **[odhad]: do 19:00 pribudnú v Prahe 0 až 2 tímy.** Analyticky silný tím (štatistika, case-mix) by bol hrozba, hlavne ak spravia rebríček krajov, čo je proti pravidlám.

**Postup do finále:** Studeník: „nejlepší za každou výzvu“ a pre VZP „vítězové výzev včetně VZP ze všech měst“ (15. 10.) **[Slack]**. V sobotu výzvu vyhodnocuje **zadávateľ** (Študentová na mieste). **[?]** Nikto sa nespýtal, čo ak je na výzve len jeden tím; moja interpretácia: ak odovzdáme funkčné riešenie, víťazstvo vo výzve je veľmi pravdepodobné, ale **nie zaručené**.

**Špeciálna cena VZP „Křeslo pro inovace“:** ide **najlepšiemu tímu zo všetkých VZP výziev** (mamograf: 4 tímy v 3 mestách; Cesta pacienta: 3 tímy v 3 mestách). Tam budeme konkurovať víťazom mamografu a Cesty pacienta, ktorí majú **zrozumiteľnejší „produktový“ príbeh**. **Nedeľa:** pridávajú sa škálovateľnosť a prezentácia; **naša silná stránka je prezentácia a škálovateľnosť medzi diagnózami**; slabšia je produktová predajnosť.

---

## 7. Skóre (1–10, kalibrované: 5 = priemer medzi výzvami, 9–10 len výnimočne)

| Kritérium | Váha | Skóre | Zdôvodnenie |
|---|---|---|---|
| Veľkosť problému (`velkost`) | 1 | **6** | ~27 tis. úmrtí na rakovinu ročne (ÚZIS, 2021) a ~65 tis. ľudí ročne s potrebou paliatívy; problém je plošný, ale nie tak masový ako skríning (stovky tisíc). |
| Dopad na zdravie (`zdravie`) | 1,5 | **4** | Štúdie (Temel) ukazujú prínos skorej paliatívy, ale **naše riešenie nemení starostlivosť**; len robí viditeľnou variabilitu. Dopad je dlhý, nepriamy politický reťazec. |
| Úspora času (`cas`) | 1 | **3** | Šetrí čas analytikom (opakovateľný výpočet), nie lekárom ani pacientom. |
| Peniaze (`peniaze`) | 1,2 | **4** | Rozdiel medzi krajinami v nemocničných výdavkoch na konci života je 2,3-násobný (Bekelman), ale české číslo nemáme a **ekonomický argument pacienti ani lekári neprijímajú** (Earle 2003); priamy zisk nie je zrejmý. |
| Akútnosť bottlenecku (`bottleneck`) | 1,5 | **6** | Stratégia MZ priznáva, že **chýbajú ukazovatele aj systematické dáta**; Národný onkologický plán 2030 má príslušný cieľ; VZP zvolila výzvu ako jednu z troch. Ale je to **bottleneck merania a politiky**, nie fronty pacientov. |
| Ochota platiť (`platba`) | 1,2 | **3** | Kupec je platiteľ/ministerstvo z analytického alebo grantového rozpočtu; **Inovačný portál VZP analytiku pre platcu nepokrýva**; zahraničné obdoby sú zadarmo (OHID, Dartmouth). Komerčný trh nenašiel. |
| Jednoduchosť pre užívateľa (`jednoduchost`) | 1 | **6** | Jedna stránka, žiadna integrácia, žiadny nový návyk lekárov; ale obsah je z podstaty nuansovaný (case-mix, neistota), čo vyžaduje dôveru odborníkov. |
| Dáta (`data`) | 1 | **7** | Reálne národné dáta, **verejné a dostupné hneď**, s dokumentáciou (341 stĺpcov); mentori k dispozícii. Odpočet: nie je miesto úmrtia/hospic/paliatíva, žiadni poskytovatelia, riadky sa nedajú prepojiť, **nejasná definícia** (14/15 dní, zoznam látok), chýba referenčná hodnota. |
| Realizovateľnosť dema (`realizovatelnost`) | 1 | **8** | Tabuľkové výpočty, štatistika a statická stránka sú pre Claude Code bežná vec; objem 19–71 MB je malý; žiadne integrácie. Riziko je výklad stĺpcov a definícií. |
| Wow a príbeh (`wow`) | 1,2 | **5** | Téma je silná, ale vizuál je graf; nie je „čarovné demo“. Zdvihnúť to môže **živé odmietnutie zakázanej otázky**, kalendárové video a príbeh „posledných 30 dní“. |
| Strategická hodnota partnera (`partner`) | 1,2 | **8** | VZP je hlavný partner; porotca Hlavinka vedie VZP inovácie; cena 60 minút s generálnym riaditeľom; garantka je odborníčka na paliatívu a metodiku. (Zdieľané s dvoma ďalšími VZP výzvami.) |
| Šanca vyhrať (`konkurencia`) | 1 | **9** | **0 tímov vo všetkých troch mestách**, víťaz každej výzvy (aj VZP z každého mesta) ide do finále; riziko: 0–2 neskoro pridané tímy a nejasnosť, či zadávateľ pri jedinom tíme víťaza vyhlási. |
| Pokračovanie po hackathone (`pokracovanie`) | 0,8 | **6** | VZP verejne hovorí o ďalšom overovaní a prípadnom pilote; pilot na plných poistných dátach je pre VZP lacný. Produktizácia nie je jasná; pokračovanie skôr ako metodika, spoločná publikácia alebo grant. |
| Fit s naším tímom (`fit`) | 0,8 | **6** | Bruno (príbeh a video) rieši to, čo štatistické tímy robia zle: **prevedenie citlivej témy**. Maťo (radiačná ochrana) vie čítať rádioterapeutické kódy a podať odborný pohľad na ožarovanie, ale výzva je analytika poisťovne, nie zobrazovanie. Dátovú vedu pokryje Claude Code. |
| Nízke regulačné/klinické riziko (`riziko`) | 0,6 | **8** | Populačná analytika nad anonymnými dátami, žiadna diagnóza ani zmena liečby, nie je to zdravotnícka pomôcka (podľa mojej úvahy [?]). Riziko je **reputačné** (nesprávna interpretácia „zlé nemocnice“), zmierňujú ho pravidlá výzvy v kóde. |

**Vážený priemer: 5,8 / 10** (súčet váh 16,0; vážený súčet 92,4) **[prepočet]**. Silné: konkurencia, partner, realizovateľnosť, dáta. Slabé: platba, čas, zdravie, peniaze. **Interpretácia:** bezpečná a vyhrateľná voľba s nízkym komerčným potenciálom; rozhoduje, či chceme **istotu finále a ukázať „najlepší rámec“**, alebo **produkt, za ktorý by niekto zaplatil** (to ponúka skôr Cesta pacienta, `08` §9).

---

## 8. Riziká a čo overiť

| Riziko | Čo s tým |
|---|---|
| **Slabé „wow“ a ťažká téma** | Živé odmietnutie zakázanej otázky, kalendárové video, stručný hák s číslom a zdrojom |
| **Zlá interpretácia (rebríček krajov = „zlé nemocnice“)** | Žiadny rebríček, vždy intervaly, panel „čo z toho nevyplýva“, **kraj bydliska ≠ poskytovateľ** vždy napísané |
| **Nejasné definície ukazovateľa** | Pred 19:00 opýtať sa Študentovej; fixovať definície v jednom súbore a ukázať obe varianty (14 a 15 dní) |
| **Slide 5 a „pracovný zoznam ukazovateľov“ nevidíme** | Pozrieť prezentáciu vizuálne (Drive: https://drive.google.com/file/d/1kA6iKeDJ9EX7VanWXOtgi1LEyI9gs3bm/view) alebo zistiť u mentorky |
| **V dátach nie je miesto úmrtia/hospic/paliatíva** | Povedať to nahlas ako výsledok; hypotézy končia „treba dáta VZP“ |
| **Silný analytický tím sa pridá do 19:00** | Naša odlišnosť = ochrana pravidiel, poctivá neistota, atlas, príbeh a prezentácia |
| **Produktová predajnosť** | Netváriť sa, že ide o predaj; pitch = metodika + pilot s VZP + otvorený kód |
| **Sťahovanie dát** (19–71 MB) | **Vyžaduje súhlas** používateľa; pri oneskorenom Azure prístupe nie je potrebný |
| **Etika a ochrana údajov** | Len anonymné verejné dáta; v repe nie sú žiadne riadky pacientov (CSV nekomitovať) |

**Otvorené [?]:**
- Obsah slide 5 a pracovného zoznamu ukazovateľov; ako VZP/Študentová definuje „systémovú liečbu“ (L01 vs. zoznam z prílohy) a 14 vs. 15 dní.
- Či portál `aka.ms/rakathon2026` obsahuje pre túto výzvu **niečo navyše** oproti verejným CSV.
- Presný počet riadkov a podiel zomretých v CSV (nesťahoval som ich; dokumentácia hovorí len o 2 200–2 700 záznamoch ročne).
- Český referenčný podiel „chemoterapia v posledných 30 dňoch“ (nenašiel som).
- Či zadávateľ vyhlási víťaza pri jedinom tíme, a či sa Študentová osobne objaví pri našom stole (Holá je online).
- Zloženie sobotnej poroty pre VZP výzvy v Prahe.

---

## Zdroje (zhrnutie URL)
- Deck VZP (Drive): https://drive.google.com/file/d/1kA6iKeDJ9EX7VanWXOtgi1LEyI9gs3bm/view
- Dátový slovník (Google Doc, Holá): https://docs.google.com/document/d/1gxd3RN6-dgK1n6Jloo1RqFJFGc7Zn1Fj/edit
- NOP Online, otvorené dáta po diagnózach: https://onconet.cz/cs/data/otevrena-data-diagnozy/ (CSV a PDF pre C25: `/res/file/otevrena-data/otevrena-data-c25.csv`, `.pdf`)
- NOP Online (hlavná stránka): https://www.onconet.cz/ · NZIP otvorené dáta NOR: https://www.nzip.cz/kategorie/287-narodni-onkologicky-registr-otevrena-data
- VZP, hlavný partner Rakathonu (8. 10. 2026): https://www.vzp.cz/o-nas/aktuality/vzp-se-stava-hlavnim-partnerem-rakathonu-soutezicim-otevre-tri-realne-vyzvy-ceskeho-zdravotnictvi
- VZP Inovačný portál: https://inovace.vzp.cz
- MZ, Strategie rozvoje paliativní péče do 2035, Analytická část: https://mzd.gov.cz/wp-content/uploads/2025/04/Analyticka-cast-Strategie-rozvoje-paliativni-pece-v-CR-do-roku-2025.pdf
- Earle 2003 (JCO): https://doi.org/10.1200/JCO.2003.03.059 · Earle 2004 (JCO): https://doi.org/10.1200/JCO.2004.08.136
- Bekelman 2016 (JAMA): https://doi.org/10.1001/jama.2015.18603 · Temel 2010 (NEJM): https://doi.org/10.1056/NEJMoa1000678 · Prigerson 2015: https://doi.org/10.1001/jamaoncol.2015.2378
- OHID Fingertips End of Life Care: https://fingertips.phe.org.uk/profile/end-of-life · Dartmouth Atlas: https://www.dartmouthatlas.org/
- OECD/EK Czechia Country Cancer Profile 2025: https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-cs-2025-1663-v2-en.pdf
- Live tabuľa tímov: https://submit.rakathon.cz/vyzvy
- Slack: `#kvalita-pece-na-konci-zivota` (C0C7VGRFG77), `#02-dotazy` (vlákno o postupe víťazov do finále, 15. 10. 15:20–15:42; min. 2 ľudia, obaja fyzicky na mieste)
- Repo: `docs/research/04`, `05`, `06`, `07`, `08`, `09`
