# Praha – MEDDI ONCO Challenge (MEDDI Hub): hĺbková analýza

_Stav: piatok 16. 10. 2026, cca 16:30. Pre Bruna a Maťa (nie ste technici, čítajte ako príbeh). Odborné pojmy sú vysvetlené v zátvorke. Pri číslach je zdroj. Značky: **[V]** = číslo som videl priamo v zdroji, **[S]** = sprostredkovaný zdroj (správa, súhrn), **[prepočet]** = moje vlastné počty z dát výzvy, **[pamäť]** = z mojej pamäti, tento beh som to neoveril, **[?]** = neisté. Nič som nevymýšľal; čo nie je isté, je označené._

_Obmedzenie behu: limit webového vyhľadávania sa vyčerpal po dvoch dotazoch, preto je časť 4 (trh) postavená aj na existujúcom researchu (07, 08, 09) a na pár priamych načítaniach stránok. Ak chcete trh dohľadať hlbšie, treba spustiť ďalší beh._

---

## 0. Verdikt na jednej obrazovke

- **O čom to je:** onkologický pacient je väčšinu liečby doma. Vyplní dotazník, napíše pár viet, odmeria teplotu. AI má za pár sekúnd rozhodnúť, **ako naliehavé to je** (4 úrovne: zelená, žltá, oranžová, červená), povedať pacientovi **jasný ďalší krok**, **upozorniť tím** a pripraviť lekárovi **súhrn na 30 sekúnd**.
- **Najsilnejšie stránky:** najjasnejšie zadanie a **najlepšie dáta zo všetkých výziev** (14 fiktívnych pacientov, 171 záznamov, správna odpoveď ku každému záznamu, pravidlá, vzorové súhrny). Hodnotí sa **merateľne** na 6 skrytých pacientoch. Zadávateľ (Patrik Litschmann) je **fyzicky v Prahe**, majiteľ firmy (Jiří Pecina) je v porote a rozhoduje sám.
- **Najväčšie slabiny:** výzva je „očividná“ pre technické tímy, takže na 19:00 bude pravdepodobne **3–5 tímov** (dnes 1) [odhad]. Platiteľ v ČR zatiaľ nie je (telemedicína sa väčšinou nehradí). Fit s Maťovým know-how (radiačná ochrana) je slabší; Brunov storytelling a video sú využité naplno.
- **Môj návrh produktu:** „**Druhé oči**“ – AI semafor, ktorý číta medzi riadkami a **nikdy neuspí červenú**. Princíp: pevné pravidlá z kódu sú **podlaha** (nižšie sa nejde), AI pridáva kontext, trend a voľný text, výsledok je vždy **to vyššie z oboch**. K tomu obrazovka pre sestru, obrazovka pre pacienta a **dôkazová stránka**: prehranie všetkých 171 záznamov s počtom zachytených a zbytočných poplachov.
- **Skóre:** vážený priemer **6,5 / 10** (priemer medzi výzvami = 5). Detail v časti 7.
- **Môže pražský tím túto výzvu zvoliť?** **Áno.** Je to jedna z 12 pražských výziev na formulári; stačí 2 členovia (tím 2–4).

---

## 1. Presné zadanie

### 1.1 Kto a odkiaľ
- **Zadávateľ:** MEDDI hub a.s. (česká telemedicínska platforma „Ordinace bez hranic“: lekár do 2 minút a online terapia). **MEDDI Onco** je ich modul pre onkologických pacientov, sestry a lekárov. V Masarykovom onkologickom ústave (MOÚ, Brno) sa používa **od 2020**; v systéme je **viac ako 15 500 pacientov** (údaj od J. Pecinu z 16. 10.); MOÚ má asi **5 000 novodiagnostikovaných pacientov ročne**. [Zdroj: slidy MEDDI v Drive – https://drive.google.com/file/d/1UFHs13Muitry1SEXqPRqw6eFJmXJ5bvL/view a https://drive.google.com/file/d/1ozmZmwRXvcJiJs9aSg2ZT7SjA5ORQrNZ/view] [V, ale čísla sú z produktového materiálu MEDDI bez nezávislého overenia]
- **Ľudia:** garant a majiteľ **Jiří Pecina** (zakladateľ a CEO, úvodné slovo, v porote [09]); zadávateľ a mentor na mieste v Prahe **Patrik Litschmann** („budem fyzicky v Prahe, pokojne ma odchyťte“, Slack #meddi-onco-challenge 12:19); technický a AI mentor online **Erik Hulmák**.
- **Čerstvá správa (16:05):** Patrik poslal do kanála aktualizovanú prezentáciu „Rakathon – výzva MEDDI Onco.pdf“ (13 slidov). Prečítal som ju celú; **nové kritériá ani nové dáta v nej nie sú** (zhoduje sa s Drive verziou a s README v zipe). V kanáli nie sú žiadne vlákna ani otázky tímov.

### 1.2 Úloha
Funkčný **prototyp AI**, ktorý:
1. **zisťuje stav** pacienta (symptómy, intenzita, vývoj) – pravidelne a zrozumiteľne,
2. **pozná kontext liečby** (lieky, cykly, zdravotné údaje); je navrhnutý na napojenie na MEDDI Onco (API počas Rakathonu **nebude**, integráciu treba **navrhnúť**),
3. **rozpozná riziko** a zaradí ho do **4 úrovní**,
4. **odporučí krok** pacientovi,
5. **upozorní zdravotnícky tím**,
6. **zhrnie vývoj pre lekára** (súhrn, ktorý prečíta za 30 sekúnd).

### 1.3 Štyri úrovne
| Úroveň | Krok pre pacienta | Čo sa stane | Typicky |
|---|---|---|---|
| 1 zelená | ďalšie sledovanie | tím vidí záznam v prehľade | očakávané mierne ťažkosti, stabilný stav |
| 2 žltá | kontaktovať tím | tím sa ozve do konca nasledujúceho pracovného dňa | 2. stupeň bez varovných príznakov, zlý trend, vynechávanie liekov, 3 nevyplnené záznamy za sebou |
| 3 oranžová | telekonzultácia | lekár do 2 hodín; mimo pracovnej doby služobný lekár MOÚ | 3. stupeň, hroziaca dehydratácia, podozrenie na vážnu toxicitu |
| 4 červená | neodkladná pomoc | ihneď 155 / urgentný príjem; tím upozornený do 15 minút | život ohrozujúci stav, napr. horúčka ≥ 38 °C počas chemoterapie |

Monitorovacie centrum pracuje **pondelok až piatok 7:00–15:30**. Mimo toho: oranžová → služobný lekár MOÚ (číslo je v pravidlách triáže v zipe), červená → 155.

### 1.4 Povinné mantinely (každý je aj kritérium hodnotenia)
1. **Žiadna diagnóza, žiadna zmena liečby.** Lekárovi smie napísať „podozrenie na…“, pacientovi diagnózu nehovorí a lieky/dávky nemení (smie pripomenúť postup, ktorý už pacient dostal od lekára, napr. schému lieku na hnačku).
2. **Pri pochybnosti vyššia úroveň, nikdy nižšia.**
3. **Tvrdé pravidlá = najnižšia prípustná úroveň** (napr. horúčka ≥ 38,0 °C počas chemoterapie alebo do 6 týždňov po nej = červená; krv v stolici = červená; TK ≥ 180/110 = červená; 4–6 stolíc navyše pri imunoterapii alebo kapecitabíne = aspoň oranžová…). Riešenie môže ísť vyššie, nikdy nižšie.
4. **Pracuje s trendom a kontextom**, nielen s jednou odpoveďou.
5. **Správa pacienta má prednosť pred dotazníkom.** Ak si odporujú, doptá sa a dovtedy počíta s horšou variantou.
6. **Vysvetliteľnosť:** každé vyhodnotenie povie, z čoho vychádza (lekár to overí za pár sekúnd).
7. **Ľudský dohľad:** úrovne 2–4 vždy končia u zdravotníka; systém pacienta nikdy len „neupokojí“.
8. **Pracovná doba:** správne nasmerovanie podľa hodín (centrum / služobný lekár / 155).
9. **Ochrana údajov:** ostrá prevádzka na AWS so servermi v EÚ. Pre prototyp nad fiktívnymi dátami môže byť akýkoľvek jazykový model; v prezentácii treba ukázať, ako by to bežalo na AWS v EÚ, a do modelu posielať len nevyhnutné údaje.

### 1.5 Dáta, ktoré dostaneme
Zip v Slacku (Erik Hulmák, 12:01), u nás rozbalený v `docs/materials/slack/meddi-onco-challenge/extracted/`:
- `pacienti/ONC-xxx.json` – **14 fiktívnych pacientov**, **171 záznamov domáceho sledovania** (3–6 týždňov na pacienta), kompletný kontext: diagnóza, režim a cykly, všetky lieky, choroby, laboratórne výsledky, vyšetrenia, záznamy tímu.
- `ground_truth/ONC-xxx.json` – **správne vyhodnotenie ku každému záznamu** (úroveň, krok, kontakt, kľúčové nálezy, varovné príznaky, zdôvodnenie, vzorová odpoveď pacientovi). Rozloženie: **115 zelených, 37 žltých, 13 oranžových, 6 červených** [V, aj moje prepočítanie].
- `docs/dotazniky_definice.json` – 4 dotazníky, ktoré MEDDI Onco naozaj používa (nežiaduce účinky 25 otázok, psychoonkologický screening 9, bolesť 5, ESAS 10), vrátane farieb odpovedí.
- `docs/pravidla_triaze.md` – úrovne, pracovná doba, **tvrdé pravidlá**, typické žlté situácie, kontext, ktorý mení úroveň (z UKONS 24h Triage Tool, CTCAE v5 a PRO-CTCAE).
- `docs/vzorove_souhrny_pro_lekare.md` – 4 vzorové súhrny + zásady (veta navrchu, trendy, každé tvrdenie s dátumom, odlíšiť „pacient uviedol / nameralo sa / odhad systému“).
- `docs/pacientska_cesta_meddi_onco.md` – ako MEDDI Onco funguje a kde sa AI napája (adaptér pre dáta oddelený od logiky; zoznam volaní, ktoré by riešenie potrebovalo).
- Formát JSON; všetko je **fiktívne**. Scenáre sú naschvál ťažké: horúčka pri poklese bielych krviniek, imunitná kolitída, ktorá sa zhorší za 2 dni, plíživé zlyhávanie srdca, liekové interakcie a krvácanie, paliatívna pacientka (píše dcéra), správa, ktorá odporuje dotazníku, **slovenčina**, preklepy a text bez diakritiky.
- **Skrytá testovacia sada: 6 ďalších pacientov** v rovnakej štruktúre. V dáte chýbajú ID ONC-003, 006, 012, 015, takže skrytí pacienti pravdepodobne pochádzajú z rovnakej série [odhad, nie fakt]. Ladiť treba na **princípy**, nie na tieto konkrétne prípady (odporúča to aj README).
- Poznámka pre kód: **4 z 6 červených záznamov prišli mimo pracovnej doby** (večer/skoro ráno) a **90 zo 171 záznamov (53 %)** prišlo mimo pondelok–piatok 7:00–15:30 [prepočet z fiktívnych dát; nepoužívať ako štatistiku reality].

### 1.6 Ako budú hodnotiť
- **Test:** 6 skrytých pacientov, **prehrávanie v čase** (riešenie vidí len to, čo už nastalo), sleduje sa **zachytenie všetkých oranžových a červených** aj **počet zbytočných poplachov**. „**Podhodnotenie červenej je najzávažnejšia chyba.**“ Potom ručné hodnotenie zrozumiteľnosti pre pacienta, vysvetlenia pre lekára a kvality súhrnu.
- **Váhy:** klinický prínos a bezpečnosť **30 %**, využiteľnosť pre pacienta a tím **25 %**, kvalita technológie a AI **20 %**, jednoduchosť a zrozumiteľnosť UI **15 %**, možnosť integrácie a rozvoja **10 %** [V: slide 10 prezentácie].
- **Päť tipov zadávateľa:** pracujte s kontextom a trendom; správa pacienta má prednosť; pacientovi jasný krok ľudsky a bez odborných termínov; súhrn na 30 sekúnd; integráciu navrhnite.
- **Bonus:** „jazykový model, ktorý s pacientom hovorí hlasom. Majiteľ MEDDI pán Jiří Pecina ocení.“ [V: slide 12]
- **Cena:** **MEDDI ONCO Award** pre riešenie s najväčším potenciálom pre prax, možný workshop a proof of concept (skúšobné nasadenie) [05, INTRO slidy]. Rozhoduje v sobotu zadávateľ pri obchôdzke (14:00–16:00); víťaz výzvy ide do nedeľného finále, kde pribudnú škálovateľnosť a kvalita prezentácie [05].

### 1.7 Čo z tohto vyplýva (dôležité)
- MEDDI hodnotí **hlavne bezpečnosť a použiteľnosť**, nie „lesk technológie“. 30 % + 25 % = 55 % je „je to bezpečné a dá sa to použiť“.
- Pecinov úvodný príhovor (slidy v Drive) opakuje dve myšlienky: pacient má vedieť **„komu to mám povedať a čo bude nasledovať“** a tím má mať **prehľad a jasnú zodpovednosť** „bez toho, aby sme im pridávali ďalšiu prácu“. Náš produkt to musí ukázať doslova: potvrdenie pre pacienta („správa dorazila, ozve sa vám X do Y“) a front s jasným vlastníkom.
- Kritériá odovzdania (sobota 13:00: názov, popis do 140 znakov, popis AI a dopadu, titulný obrázok 16:9, odkazy na GitHub/demo/video) sú v 05. Z podkladov nie je jasné, či sú GitHub a video povinné [?].

### 1.8 Čo ešte nevieme [?]
1. **Ako sa skrytá sada dodá do tímov** (spustí ju Erik na našom stroji? nahráme výstupy? živé demo?). Riešenie: urobiť aplikáciu tak, aby vedela spracovať **nový JSON pacienta jedným klikom a jedným príkazom**. Otázka pre Patrika/Erika.
2. Či v sobotu platia tieto MEDDI váhy, alebo všeobecné 3 kritériá Rakathonu (AI technológia, využiteľnosť, inovatívnosť). Pravdepodobne MEDDI váhy pre výber víťaza výzvy, ale váhy ostatných nie sú zverejnené.
3. Či smieme použiť externé API (ElevenLabs, Whisper) pre hlas. Organizátor MEDDI pre prototyp výslovne povolil „akýkoľvek jazykový model“; dáta sú fiktívne. Hlasové služby sú logické rozšírenie, ale spýtať sa je lacné.
4. Dĺžka pitchu: oficiálne neuvedená (odhad 5–6 min na tím [05]). Vy plánujete 3 min.

---

## 2. Koncový používateľ (myslieť ako ten človek)

### 2.1 Sestra v monitorovacom centre (hlavný používateľ)
**Kto:** všeobecná alebo onkologická sestra v Centre digitálnej medicíny MOÚ (pondelok až piatok 7:00–15:30). Nie je to technik; chce vedieť, **komu zavolať najprv**.

**Jej deň dnes (z popisu cesty v zadaní + slidov MEDDI):**
- ráno otvorí **front požiadaviek**: dotazníky, správy, fotografie od pacientov, ktorí počas noci a večera niečo poslali,
- monitorovacie centrum **triedi podľa priority a typu**, vyrieši, alebo pridelí inej sestre či lekárovi,
- aby rozhodla, musí si pri každom pacientovi **pamätať alebo dohľadať**: aká liečba, ktorý deň cyklu, aké lieky, ako sa to vyvíjalo minulý týždeň, čo už tím urobil,
- po **15:30 a cez víkend** nikto v centre nie je; pacient má volať služobného lekára alebo 155.

**Čo ju bolí:**
1. **Farby dotazníka posudzujú každú odpoveď samostatne.** README to hovorí priamo: dotazník „nevidí liečbu, trend, merania ani správu pacienta“.
2. **Dôležité sa schováva vo voľnom texte.** Napr. „Večer mi je zima, třesu se, naměřila jsem 38,4. Mám si vzít Paralen a počkat do rána?“ (záznam ONC-001-C07, 9. 9. 21:52), dotazník ukázal len **žltú**; správne bolo **červená** (podozrenie na febrilnú neutropéniu, teda horúčku pri nízkych bielych krvinkách po chemoterapii).
3. **Alert fatigue (únava z poplachov):** zelených je 67 % záznamov (115 zo 171), ale všetky ležia vo fronte. Zároveň farba „červená“ sa objavila pri 9 záznamoch, pričom naozaj červených bolo len 4.
4. **Texty sú chaotické:** preklepy, bez diakritiky, slovensky, píše dcéra za mamu.
5. **Chýba čas** (v ČR chýbajú sestry, v onkologických oddeleniach je len 1 125 sestier [OECD 2025]).

### 2.2 Pacient doma (príjemca odpovede)
**Kto:** 41-ročná žena na imunoterapii pri melanóme; 63-ročný diabetik na FOLFOX; 76-ročná paliatívna pacientka, za ktorú píše dcéra; 69-ročný Slovák, ktorý napíše „neviem ako sa to vyplna“. Je unavený, bojí sa, často starší, nie vždy ovláda smartfón (pozorovanie Tichopáda z pre-hack dňa, 02).

**Jeho tri otázky** (slide 4 zadania): *Je to normálne? Mám zavolať lekárovi? Potrebujem pomoc hneď?*

**Čo by mu pomohlo:** po odoslaní jedna veľká obrazovka s odpoveďou na tieto tri otázky a s jasným krokom („Volajte 155 teraz“, alebo „tím sa ozve zajtra do 15:30“) a s farbou; v jeho jazyku a bez odborných termínov.

### 2.3 Lekár (príjemca súhrnu)
Pred cyklom alebo pri eskalácii chce **jednu vetu** („čo je teraz dôležité a čo sa od mňa čaká“), trendy namiesto výpisu hodnôt a každé tvrdenie s dátumom, **bez diagnózy a bez návrhu zmeny liečby** („k posúdeniu lekárom“). Vzorové 4 súhrny sú v zipe.

### 2.4 Prečo dnešný stav zlyháva (naše čísla z dát výzvy)
Porovnal som **najvyššiu farbu dotazníka** v každom zázname so správnou úrovňou (ground truth). Je to **fiktívne** a **len farby zo zadania**; ukazuje to princíp, nie realitu [prepočet z `pacienti/` a `ground_truth/`]:

| | Farba dotazníka by zachytila | Chýba |
|---|---|---|
| 19 závažných záznamov (13 oranžových + 6 červených) | iba **6** má aspoň oranžovú farbu | **13 z 19 (68 %)** má v dotazníku len zelenú alebo žltú |
| 6 červených | 4 majú červenú farbu | **2** (horúčka 38,4 a 38,6 s triaškou) majú len žltú |
| 9 záznamov s červenou farbou | iba 4 sú naozaj červené | **5** by poslalo pacienta zbytočne na 155 (1 zelený, 2 žlté, 2 oranžové) |

Záver: „semafor podľa farieb odpovedí“ **aj prehliada, aj zbytočne plaší**. 13 z 19 zachytených prípadov vyžaduje čítať **text, merania a kontext**; to je práca pre AI, ale s bezpečnostnou poistkou (viď časť 5).

---

## 3. Dôkazy o probléme (svet + ČR)

### 3.1 Koľko ľudí a čo sa deje doma
- **Svet:** takmer 20 mil. nových rakovín a 9,7 mil. úmrtí (2022) [Z1][V] https://doi.org/10.3322/caac.21834 .
- **ČR:** 58 461 nových zhubných nádorov v 2021 (ÚZIS) https://www.uzis.cz/res/f/008447/novotvary2019-2021.pdf ; s rakovinou žije **viac ako 600 tis.** ľudí (MZ ČR, 2. 9. 2026) https://mzd.gov.cz/tiskove-centrum-mz/jeden-kontakt-mene-cekani-rychlejsi-cesta-k-lecbe-koordinatori-meni-peci-o-onkologicke-pacienty/ [S podľa 08]. Koľko z nich je naraz na aktívnej lieku/chemoterapii v ČR, **nemám overené [?]**; preto je „veľkosť problému“ pri skóre opatrná.
- **MOÚ/MEDDI:** 15 500 pacientov v systéme, ~5 000 nových ročne [slidy MEDDI, V, bez nezávislého overenia].

### 3.2 Čo stojí „nezachytený“ príznak
- **Pohotovosť u pacientov na liečbe (USA):** v kohorte 5 853 komerčne poistených pacientov so solídnymi nádormi na chemoterapii/ožarovaní malo **27 %** aspoň jednu návštevu pohotovosti bez prijatia do roka od začiatku liečby (2 400 návštev); **53 %** z nich sa dalo riešiť ambulantne (pri širšom meradle 70 %); najčastejší dôvod bola bolesť (27 %), horúčka a dýchavičnosť po 6 %; **mediánny náklad ~1 047 USD** za návštevu pri ambulantne riešiteľných onkologických príznakoch. Panattoni et al., ASCO 2017, abstrakt 6505. https://ascopost.com/News/55724 [V, USA, nie ČR].
- **Celoštátna analýza USA (JAMA Network Open):** podľa súhrnu **52 %** pohotovostných návštev onkologických pacientov v rokoch 2012–2019 bolo potenciálne vyhnuteľných a takmer 30 % skončilo neplánovanou hospitalizáciou; hlavný dôvod bolesť. https://pubmed.ncbi.nlm.nih.gov/39038257/ [S: čísla zo súhrnu vo vyhľadávaní, samotný abstrakt sa mi nenačítal; USA].
- **Horúčka pri nízkych bielych krvinkách (febrilná neutropénia)** je priamo život ohrozujúca: hospitalizovaní pacienti ju v klasickej americkej analýze (Kuderer et al., Cancer 2006) mali s úmrtnosťou okolo **9,5 %** [pamäť, overiť pred použitím v pitchi]. Preto zadanie hovorí, že podhodnotenie červenej je najhoršia chyba.
- **Imunoterapia:** imunitné nežiaduce účinky (napr. kolitída, zápal hrubého čreva) môžu nastúpiť kedykoľvek a **zhoršiť sa za 1–2 dni**; pravidlá triáže to uvádzajú výslovne. Prípad ONC-004 v dátach: 3 → 4 → 8 stolíc a krv za 2 dni.

### 3.3 Čo funguje: pravidelné hlásenie príznakov z domu (ePRO)
- **Basch, JCO 2016** (766 pacientov): kvalita života sa zlepšila u **34 % vs. 18 %**; návšteva pohotovosti **34 % vs. 41 %**; na chemoterapii dlhšie (8,2 vs. 6,3 mesiaca) https://europepmc.org/article/MED/26644527 [V, podľa 07].
- **Prežitie je sporné:** Denis (pľúca, malá štúdia) a Basch ho ukázali; **veľká štúdia PRO-TECT (Nat Med 2025, 1 191 pacientov) ho nepotvrdila (HR 0,99)**, ale čas do prvej pohotovosti bol dlhší (HR 0,84) https://doi.org/10.1038/s41591-025-03507-y [V podľa 07]. **V pitchi sľubovať zlepšenie prežitia sa nesmie**; hovorte o kvalite života, menej pohotovostiach a včasnom zachytení.
- **Dôležité poučenie:** tam, kde nebol určený človek, ktorý na signály reaguje, efekt zoslabol (6 zo 7 štúdií ESMO ich malo, len 1 zo 4 dánskych) [07]. Preto naše riešenie **nenahrádza sestru, ale jej zlepšuje front** a vždy končí u človeka.
- **AI nástroje pre pacientov:** odporúčanie ESMO (ELCAP, okt. 2025) žiada dohľad, jasnú eskaláciu a ochranu údajov https://pubmed.ncbi.nlm.nih.gov/41111032/ [S podľa 07].

### 3.4 Prečo nestačí „len pustiť LLM“
- Preprint (arXiv 2605.15680, 2026) testoval 6 jazykových modelov na štvorstupňovej triáži online dotazov pacientov: model dosiahol macro-F1 len ~0,475, trieda „urgentné posúdenie lekárom“ je najťažšia a autori uzatvárajú, že LLM môže **podporiť prioritizáciu a výber na ľudskú kontrolu, nie autonómne nasadenie** https://arxiv.org/abs/2605.15680 [V abstrakt; všeobecné dotazy, nie onkológia; preprint].
- Komentár UCSF o štúdii „ChatGPT Health“ uvádza, že model **systematicky podhodnocoval skutočné pohotovosti** (v >50 % prípadov radil „do 24–48 hodín“) https://codex.ucsf.edu/news/insights-codex-director-sumant-ranji-md-sfhm-analyzing-new-research-llms-and-patient-triage [S zo súhrnu vyhľadávania, stránku som nemohol načítať; originálnu štúdiu overiť [?]].
- Z toho plynie náš dizajn: **pevné pravidlá ako podlaha + AI ako doplnok + vždy to vyššie + vždy človek**.

### 3.5 Ľudia a čas
- Lekárovi zostáva pri pacientovi v ambulancii len ~27 % času, 49 % ide na počítač a papiere (Sinsky 2016) https://doi.org/10.7326/M16-0961 [V podľa 07]; 71 % mladých európskych onkológov má známky vyhorenia, v strednej Európe 84 % (Banerjee 2017) https://doi.org/10.1093/annonc/mdx196 [V podľa 07].
- **MEDDI** sám uvádza úsporu práce asi **137 000 Kč ročne na jednu všeobecnú sestru** (ocenenie ušetreného času, nie hotovostná úspora; bez nezávislého overenia) [slidy MEDDI, V ako tvrdenie firmy].

### 3.6 Kto by to mohol platiť v ČR (stručne; viac v 08)
- **Telemedicína je v ČR väčšinou nehradená** (VZP, 29. 9. 2026) [07, 08]. VZP ale od **21. 9. 2026** spustila **Inovačný portál** (dočasná úhrada 6–24 mesiacov), predmetom je aj **vzdialené monitorovanie pacienta** a AI; onkologická tematická výzva štartuje **od 1. 11. 2026** (FAQ: „od októbra“ [?]); na 2027 sa spomína až **300 mil. Kč** [?, neschválený rozpočet] https://inovace.vzp.cz . Žiadateľ musí byť výrobca/dodávateľ s **klinickým partnerom**; vstup nezaručuje úhradu. MEDDI Hub (dodávateľ) + MOÚ (klinický partner) sú presne taká dvojica [moja interpretácia, nie fakt].
- **Nemecko:** aplikácie na podobné účely hradia poisťovne ako DiGA; priemerná cena v prvom roku ~**400 € na štvrťrok** (údaj GKV 2022; poisťovne ju kritizujú) https://www.gkv-spitzenverband.de/gkv_spitzenverband/presse/pressemitteilungen_und_statements/pressemitteilung_2239872.jsp [S podľa 07].

---

## 4. Existujúce riešenia na trhu

**Poznámka:** cenníky takýchto systémov sa väčšinou nezverejňujú; per-pacient ceny som **nenašiel** (jeden pokus o vyhľadanie nič nedal) [?].

| Riešenie | Čo robí | Kto platí / cena | Čo robí slabo (pre nás) |
|---|---|---|---|
| **MEDDI Onco** (náš zadávateľ) | dotazníky, správy, fotky, monitorovacie centrum, farby odpovedí; v MOÚ od 2020 | MOÚ/nemocnica; cena nezverejnená [?]; v ČR nie je štandardná úhrada | farby posudzujú každú odpoveď zvlášť; AI vrstva kontextu a voľného textu chýba (to je náš priestor) |
| **Noona** (Siemens Healthineers, predtým Varian) | „onkologická platforma na vzdialené sledovanie príznakov“, PRO a bezpečná komunikácia [V: https://cancercare.siemens-healthineers.com/products/software/patient-engagement ] | predplatné (SaaS), cena nezverejnená | stránka neuvádza dôkazy ani AI triáž; rozšírenie do CZ/SK neviem [?] |
| **Kaiku Health** (Elekta) | ePRO, v Ženeve systém PROHUG ako certifikovaná zdravotnícka pomôcka [S, mobihealthnews cez súhrn vyhľadávania]; doména kaikuhealth.com dnes presmeruje na elekta.com (pozorované 16. 10. 2026), čo zodpovedá akvizícii [pamäť: 2021, overiť] | nemocnice; cena nezverejnená | zrejme pravidlá nad dotazníkom; čeština/slovenčina a voľný text neviem [?] |
| **Moovcare** (Sivan) | týždenný dotazník, algoritmus upozorní na relaps pri rakovine pľúc; opora v štúdii Denis 2017 [07] | v niektorých krajinách hradené [pamäť, overiť] | jedna diagnóza |
| **Mika (Fosanis), DiGA v Nemecku** | aplikácia pre onkologických pacientov hradená poisťovňou | ~400 € na štvrťrok v priemere pri DiGA [07, S] | pacientska appka, nie triáž pre tím |
| **Americké ePRO a navigátori** (napr. Resilience, Carevive, Navigating Cancer) | symptómy, upozornenia, navigácia | nemocnice/onkológia v USA [pamäť, neoverené, ceny neviem] | nie EÚ dáta, nie CZ/SK jazyk |
| **Všeobecné chatboty/„symptom checkers“** (ChatGPT, Ada…) | rady k príznakom | zadarmo/predplatné | **podhodnocujú pohotovosti** (3.4); nepoznajú liečbu pacienta; žiadna eskalácia do tímu |
| **Telefónna triáž sestrou (stav dnes)** | UKONS 24h Triage Tool v UK a podobné tabuľky | čas sestry | závisí od hodín a únavy; mimo pracovnej doby nikto |

**Kde je priestor urobiť to lepšie, rýchlejšie, lacnejšie a jednoduchšie:**
1. **Kontext + trend + voľný text v slovenčine/češtine** (aj bez diakritiky a s preklepmi) nad existujúcimi dotazníkmi. Konkurenti sú buď pravidlá nad dotazníkom, alebo všeobecný chatbot.
2. **Bezpečná architektúra „podlaha + AI“** s dôkazom na prehraní záznamov (nikto nepublikuje „zachytili sme 19 z 19 a X zbytočných poplachov“ pre CZ/SK).
3. **Vysvetliteľnosť a súhrn na 30 sekúnd** pre lekára (zdroj ku každému tvrdeniu).
4. **Hlas** pre starších pacientov (slovenský/český hlas; bonus zadávateľa).
5. **Beh v EÚ** (AWS; MEDDI to vyžaduje).
6. **Lacnejšie:** nie je to nová platforma. Je to vrstva (modul) nad tým, čo MEDDI už má v MOÚ; nemocnica nemení systém.

---

## 5. Najlepší návrh riešenia pre nás

### 5.1 Produkt: „Druhé oči“ (pracovný názov)
**Jedna veta:** AI semafor pre onkologických pacientov doma, ktorý číta medzi riadkami (liečba, trend, správa, merania), **nikdy neuspí červenú** a sestre ukáže **kto je na rade a prečo**.

**Tri obrazovky, nič viac:**
1. **Front sestry** (hlavná). Jeden zoznam zoradený podľa naliehavosti: farba, pacient, **jedna veta prečo** („horúčka 38,4 °C, 10. deň po AC chemoterapii, triaška“), kto je zodpovedný a **čas do reakcie** (podľa pracovných hodín). Zelené sú zbalené do jedného riadku „115 v poriadku“, ale **dajú sa rozbaliť a auditovať**. Klik → **súhrn na 30 sekúnd** (veta navrchu; trend s malým grafom; fakty s dátumom; farebne odlíšené „pacient uviedol / nameralo sa / odhad systému“; „k posúdeniu lekárom“). Tlačidlá: **Potvrdiť / Zmeniť úroveň / Volať pacienta**; zmena sa ukladá (spätná väzba pre AI).
2. **Pacient (mobilný náhľad).** Po odoslaní záznamu jedna veľká obrazovka s farbou a s odpoveďami na **tri otázky z deku**: *Je to v poriadku? Čo urobiť teraz? Kedy sa ozve tím a čo ak sa to zhorší?* Ak správa odporuje dotazníku, najprv **doplňujúca otázka s dvoma tlačidlami** („Píšete 6-krát hnačka. Je to tak?“). V češtine/slovenčine, bez odborných termínov. Pre červenú: veľké tlačidlo „Volať 155“.
3. **Dôkazy a čas (pre porotu a pre pitch).** Prehratie všetkých 171 záznamov v čase (posuvník po dňoch): vedľa seba **farba dotazníka vs. úroveň AI vs. správna odpoveď**. Hore tabuľka: zachytené oranžové/červené (cieľ: **všetkých 19**), podhodnotené (cieľ: **0**), zbytočné eskalácie, správne smerovanie podľa hodín, výsledok pre každého pacienta. A tlačidlo **„Nahrať nového pacienta (JSON)“**: porota môže vložiť skrytých 6 a vidieť výsledok na mieste. Voliteľne políčko „napíšte vlastný scenár“ pre porotcu.

### 5.2 Ako to funguje vo vnútri (pre Claude Code; vy to len potvrdíte)
1. **Prehrávanie v čase:** pre záznam k sa model dostane len to, čo bolo známe do jeho času (staršie záznamy, laboratóriá, udalosti tímu, lieky). Žiadne „pozeranie do budúcnosti“.
2. **Pravidlá v kóde (podlaha):** tvrdé pravidlá z `pravidla_triaze.md` (13 červených a 15 oranžových oblastí) zakódované ako testovateľné funkcie s ID pravidla. Výstup: **najnižšia prípustná úroveň** a zoznam spustených pravidiel.
3. **AI vrstva (jazykový model):** číta voľný text (aj slovensky, bez diakritiky), liečbu, trend, laboratóriá, správu pacienta; vracia **striktný JSON**: úroveň, kľúčové nálezy s odkazom na záznam/dátum, varovné príznaky, rozpor medzi textom a dotazníkom, doplňujúca otázka, správa pre pacienta (jednoducho), súhrn pre lekára. Môže spustiť aj druhý „advokát diabla“ prechod („čo by to mohlo zhoršiť?“) a pri nezhode ísť vyššie.
4. **Zlúčenie:** **konečná úroveň = to vyššie z (pravidlá, AI)**; ak AI hlási nejasnosť alebo rozpor, **+1 úroveň a doplňujúca otázka**, kým pacient neodpovie. Úrovne 2–4 vždy končia u človeka.
5. **Smerovanie podľa hodín:** deterministicky v kóde (pondelok–piatok 7:00–15:30 centrum; mimo toho oranžová → služobný lekár MOÚ, červená → 155), **nie** v jazykovom modeli.
6. **Hodnotiaca skúška:** skript prehrá všetkých 171 záznamov a spočíta zhodu so správnymi odpoveďami. Ladí sa na princípy; **vynechať 3 pacientov z ladenia** a ukázať výsledok aj na nich (simulácia skrytej sady).
7. **Integrácia (návrh, nie napojenie):** 5 volaní (načítať kontext, prijať nový záznam [webhook], vytvoriť požiadavku s prioritou, poslať správu pacientovi, uložiť súhrn), výstup aj ako **FHIR** zdroje (Flag/Task/Communication) a nákres beh na **AWS v EÚ**. Adaptér na dáta oddelený od logiky (v prototype číta JSON).
8. **Technické riziká, ktoré treba ošetriť v kóde:** zdieľaný endpoint (HTTP 429, treba opakovanie so spomaľovaním); nulová teplota a uložené výsledky, aby demo nezávisel od siete; záložný režim „iba pravidlá“.

### 5.3 Čo ukážeme v 3-minútovom pitchi (mapované na kritériá MEDDI)
| Čas | Obsah | Kritérium |
|---|---|---|
| 0:00–0:20 | **Hák:** streda 21:52, 48-ročná pacientka (ONC-001), 10. deň po chemoterapii, trasie ju zimnica, má 38,4. Píše: „Mám si vziať Paralen a počkať do rána?“ Aplikácia jej ukázala **žltú**. Centrum je zatvorené. | klinický prínos |
| 0:20–0:45 | Číslo: **13 z 19 závažných záznamov farba dotazníka nezachytí** (z dát MEDDI, fiktívnych). Používateľ: sestra v monitorovacom centre MOÚ (15 500 pacientov). | využiteľnosť |
| 0:45–1:45 | **Video 60–75 s zo skutočnej obrazovky:** (a) pacientka z ONC-001: AI ukáže **červenú**, dostane „Volajte 155, Paralen si neberte“; (b) Lucie (ONC-004, imunoterapia): 3 → 4 → 8 stolíc v 3 dňoch, AI ide žltá → oranžová → červená; (c) pán z ONC-018 po slovensky (text bez diakritiky) + **hlas**; (d) sestra: front a 30-sekundový súhrn. | AI, UI |
| 1:45–2:15 | Ako to funguje: **pravidlá sú podlaha, AI číta kontext, vždy to vyššie, vždy človek**; prehranie 171 záznamov: „19 z 19 zachytených, 0 podhodnotených, X zbytočných poplachov“ (doplniť po behu); EÚ hosting, žiadna diagnóza. | bezpečnosť, technológia |
| 2:15–2:40 | Pilot na jednom riadku: **tieňový režim v MOÚ** (AI iba navrhuje, sestra rozhoduje, porovnávame so skutočnosťou), KPI: zachytenie, zbytočné poplachy, minúty práce; cesta: MEDDI + MOÚ → žiadosť do Inovačného portálu VZP (onkologická výzva od 1. 11.). | integrácia, rozvoj |
| 2:40–3:00 | Tím a prosba: „Pustite si na nás svojich 6 skrytých pacientov naživo“ a workshop/PoC s MEDDI. | tím |

**Pravidlá komunikácie (čo nehovoriť):** nesľubovať lepšie prežitie (PRO-TECT ho nepotvrdil); nehovoriť „diagnostikujeme“; vždy „AI navrhuje, rozhoduje človek“.

### 5.4 Plán na noc (čo Claude Code postaví; poradie podľa dôležitosti)
- **P0 (must, cca prvých 6–8 hodín):** jadro (pravidlá + AI + zlúčenie + smerovanie), hodnotiaci skript, front sestry s 30-s súhrnom, pacientska obrazovka, stránka s dôkazmi a nahrávaním JSON, **spustiteľné jedným príkazom**.
- **P1 (potom):** hlas (prehliadač: mikrofón → prepis → odpoveď hlasom v češtine/slovenčine; ElevenLabs alebo služby v Azure; hlas hovorí rovnakú správu ako obrazovka), diagram integrácie a FHIR mapovanie, vlastný scenár od porotcu.
- **P2 (len ak zostane čas):** zápis do FHIR servera InterSystems IRIS (lístok na cenu InterSystems 1 500 EUR; musí to byť skutočné použitie, nie nálepka) a generátor ťažkých testovacích prípadov.
- **Video:** nahrať skutočnú obrazovku (Bruno), 60 s do formulára + 75 s do pitchu; titulný obrázok 16:9 = jeden výsledok („červená, ktorú farba dotazníka nevidela“), nie logo.
- **Čo spraviť s Patrikom (je v Prahe):** večer 1 krátka otázka na skrytú sadu a smerovanie; ráno ukázať demo ešte pred odovzdaním (využiteľnosť hodnotí práve on).

### 5.5 „Šialený“ ambiciózny variant: **AI nočná sestra, ktorá zavolá**
- **Hlasový agent**, ktorý pacienta **zavolá sám**, keď: chýbajú 2–3 záznamy za sebou (pravidlo „3 nevyplnené“), správa je nejasná, alebo trend rastie. Pýta sa 3–5 jednoduchých otázok v češtine/slovenčine, prispôsobí sa starším ľuďom a pečujúcim („píše dcéra“), skončí **jasným krokom** a v pozadí vytvorí požiadavku pre sestru s prepisom a súhrnom. (Dáta sú fiktívne, volanie v demo sa simuluje v prehliadači; reálny telefón netreba.)
- **„Bezpečnostný dôkaz“ ako produkt:** generátor, ktorý z každého tvrdého pravidla vyrobí stovky ťažkých variantov (preklepy, slovenčina, protirečivé správy, iné lieky) a zmeria, či systém nikdy nepodhodnotí; automaticky vygeneruje 2-stranovú správu „pravidlo → test → výsledok“ (pre tých, čo rozhodujú o nasadení a o VZP portáli).
- **Zápis do FHIR/IRIS naživo** (Flag + Task + Communication), takže sestra vidí lístok vo fronte a porota vidí štandard v praxi (InterSystems cena).
- **Prečo je to odvážne a stále zmysluplné:** priamo zasahuje bonus „hlas“ (Pecina), problém starších pacientov a otázku „čo ak nikto neodpíše“. **Riziko:** veľa pohyblivých častí za jednu noc; preto len po dokončení P0 a P1.

---

## 6. Konkurencia na hackathone na tejto výzve a či ju pražský tím môže zvoliť

- **Môže pražský tím voliť MEDDI?** **Áno.** MEDDI ONCO Challenge je jedna z 9 pražských výziev (spolu s 3 VZP = **12** na formulári pre Prahu) [05 §2.6; živá tabuľa https://submit.rakathon.cz/vyzvy]. Tím 2–4 ľudia, obaja na mieste v Prahe.
- **Dnes (16:xx, živá tabuľa):** **1 tím – Přemke**. (Celkovo Praha: 18 tímov má výzvu a 5 ešte nevybralo; pri iných výzvach: mamograf 3, Cesta pacienta 2, Trial Matching 4, Hlídač NÚ 2, NÚVR 2, PACS 1, Plíce 1, SMART ONCO 1, MDT 1, Kvalita péče 0, Twincer 0.) Čísla sa mierne líšia od 05 („23 tímov má výzvu“): živá tabuľa teraz hlási 23 tímov spolu, z toho 18 s výzvou a 5 bez.
- **Signály, že pribudnú ďalší:** do kanála #meddi-onco-challenge sa pripojili ľudia z tímov **MediBit** (2, majú výzvu Cesta pacienta), **VI KA** (2, výzva Hlídač NÚ), **walking legs** (1, výzvu ešte nemajú), **MSFZ** (1, Plíce včas) a **ďalší bez označenia tímu**. Okrem toho **5 tímov ešte nevybralo** (Ctrl+Alt+CURE, FIT/S, FSMZ, Pražský Meridian, walking legs) a **7 tímov z organizátorskej listiny** ešte nie je na tabuli (Data Team, Junior Scholars, Nexlytics, Panacea, quattro formaggi, radiQA, Risk off) [05]. Vstup do kanála neznamená voľbu výzvy; je to len signál záujmu.
- **Prečo MEDDI priťahuje:** najjasnejšie zadanie, hotové dáta a **objektívne meranie** (09 to označuje ako „najčastejšie obsadenú“ výzvu [odhad]). Technické tímy to uvidia ako „vyrobíme triážny prompt a vyhráme“.
- **Môj odhad pri uzávierke 19:00: 3–5 tímov** [odhad, nie fakt].
- **Ako sa výzva rozhoduje:** zadávateľ (Litschmann, pravdepodobne s Pecinom) obchádza tímy 14:00–16:00 a nahlási víťaza; hodnotí na skrytej sade a váhach 30/25/20/15/10. Jeden víťaz ide do finále.
- **Naša šanca** (subjektívny odhad): pri 3–5 tímoch zhruba **30–40 %**, ak zvládneme P0 a dôkaz na prehraní a hlasový bonus. Rozhodujú tri veci: **0 podhodnotených červených**, **málo zbytočných poplachov**, **čistá obrazovka sestry**. Slabá stránka: sme nie technici; zbytok vyrieši disciplína pri vyhodnotení a testovaní, nie počet funkcií.
- **Druhá šanca:** cenu InterSystems (1 500 EUR) možno kombinovať s touto výzvou (musí byť skutočné použitie FHIR/IRIS).

---

## 7. Skórovanie (1–10; 5 = priemer medzi výzvami; prísne)

| Kritérium | Váha | Skóre | Zdôvodnenie |
|---|---|---|---|
| **velkost** – veľkosť problému | 1 | **6** | Dotýka sa všetkých pacientov na aktívnej liečbe (v MEDDI 15 500 pacientov, v ČR >600 tis. žije s rakovinou), ale presný počet pacientov naraz na systémovej liečbe v ČR nemám overený [?]; menej ako skríning alebo MDT. |
| **zdravie** – dopad na zdravie | 1,5 | **6** | Včasné zachytenie život ohrozujúcich toxicít (horúčka pri chemoterapii, imunitná kolitída) je reálne; ePRO zlepšuje kvalitu života a znižuje pohotovosti, ale prežitie nie je dokázané (PRO-TECT HR 0,99). |
| **cas** – úspora času | 1 | **6** | Súhrn na 30 s a front podľa naliehavosti; 67 % záznamov je zelených. MEDDI uvádza ~137 tis. Kč ročne na sestru pre platformu ako celok (nie pre AI vrstvu). |
| **peniaze** – úspora / zisk | 1,2 | **5** | Vyhnuteľné pohotovosti stoja ~1 000 USD/návštevu (USA), ale v ČR nemám dôkaz o úspore a telemedicína nemá úhradu. |
| **bottleneck** – akútnosť dopytu TERAZ | 1,5 | **7** | MEDDI to chce vo svojom produkte, sestier je málo, VZP otvára cestu pre vzdialené monitorovanie (od 1. 11.). Znižuje to, že nemocnica nemá voľný rozpočet. |
| **platba** – ochota platiť | 1,2 | **6** | Jasný kupec (MEDDI Hub ako dodávateľ, MOÚ ako zákazník; existujúci trh: Noona, Kaiku, DiGA v Nemecku). V ČR chýba trvalá úhrada, VZP portál nezaručuje úhradu. |
| **jednoduchost** – maximálna jednoduchosť | 1 | **8** | Semafor je prirodzene jednoduchý: pacient vidí jednu správu, sestra jeden front. Riziko: dôvera lekárov, preto vysvetlenie a potvrdenie človekom. |
| **data** – dáta na hackathone | 1 | **9** | Najlepšia sada z výziev: 14 pacientov, 171 záznamov, správna odpoveď ku každému, pravidlá, vzorové súhrny, skrytý test. Odčítam za malý počet pacientov a fiktívny charakter. |
| **realizovatelnost** – demo za noc | 1 | **8** | Jasný vstup a výstup, žiadna integrácia, malé dáta; hlavné riziko je dosiahnuť nulové podhodnotenie na skrytej sade a limity zdieľaného endpointu. |
| **wow** – príbeh a pitch | 1,2 | **7** | Silný príbeh (21:52, „počkať do rána?“), prehranie v čase, hlas; ale „AI triáž“ budú ukazovať aj iné tímy. |
| **partner** – hodnota zadávateľa a networku | 1,2 | **7** | Majiteľ rozhoduje sám a je v porote, MOÚ ako referencia, cena a možný workshop/PoC (09: 8/10); nie je to platiteľ (VZP) ani veľká nemocnica Prahy. |
| **konkurencia** – šanca vyhrať a ísť do finále | 1 | **6** | Dnes 1 tím, odhad 3–5 do 19:00; objektívne meranie zvýhodňuje dôsledné vyhodnotenie, nie len „nápad“. |
| **pokracovanie** – pokračovanie po hackathone | 0,8 | **7** | MEDDI má reálny produkt, zákazníka (MOÚ) a Award s PoC; autorstvo ostáva nám, organizátori a partneri dostanú nevýhradnú licenciu (05), takže MEDDI to môže reálne využiť. |
| **fit** – zhoda s naším tímom | 0,8 | **5** | Brunov storytelling, video a jednoduchý jazyk sedia výborne; Maťova radiačná ochrana a zobrazovanie priamo neprispievajú k triáži (výnimka: pacient po chemoradioterapii ONC-011) [?]. |
| **riziko** – nízke regulačné/klinické riziko | 0,6 | **4** | Triáž ovplyvňuje naliehavosť starostlivosti; v ostrom nasadení by išlo o zdravotnícku pomôcku (MDR) s ľudským dohľadom a GDPR [pamäť, nie právne posúdenie]. V hackathone je to prototyp a mantinely sú zabudované do zadania. |

**Vážený priemer = 6,5 / 10** (súčet vážených bodov 104,5 pri súčte váh 16,0). Najsilnejšie: dáta, jednoduchosť, realizovateľnosť. Najslabšie: riziko, fit, peniaze.

---

## 8. Riziká a otvorené otázky

**Riziká**
1. **Podhodnotenie červenej na skrytej sade** (najhoršia chyba). Mitigácia: pravidlá ako podlaha, „+1 pri nejasnosti“, doplňujúca otázka, test na vynechaných pacientoch.
2. **Zbytočné poplachy** (hodnotia sa tiež). Mitigácia: doptanie sa namiesto okamžitej eskalácie, meranie na 115 zelených záznamoch.
3. **Preučenie na 14 pacientov.** Mitigácia: princípy, nie kopírovanie scenárov; vynechať 3 pacientov.
4. **Zdieľaný endpoint (limity) a modely.** Mitigácia: opakovanie so spomaľovaním, uložené výsledky pre demo, režim „iba pravidlá“.
5. **Veľa tímov na výzve** (3–5). Mitigácia: odlíšiť dôkazom (prehranie 171), hlasom a čistým UI.
6. **Právne/regulačné** (MDR, GDPR, zodpovednosť): povedať otvorene, že ide o prototyp; AI navrhuje, rozhodnutie robí človek; EÚ hosting v návrhu.
7. **Nie sme technici:** všetko ladenie rieši Claude Code; vy rozhodujete o obsahu textov pre pacienta, pri pitchi a pri videu.
8. **Kód pred hackathonom:** všetko, čo nevzniklo počas hackathonu, deklarovať (pravidlá súťaže).

**Otázky na Patrika Litschmanna (je v Prahe) a Erika Hulmáka**
- Ako sa spúšťa skrytá sada (náš stroj, naša aplikácia, živé demo)?
- Platia v sobotu tieto váhy 30/25/20/15/10?
- Je v poriadku použiť hlasové služby tretích strán (prepis a syntéza reči) pre prototyp s fiktívnymi dátami?
- Má MEDDI preferovaný formát výstupu (JSON schéma) pre úroveň, krok a súhrn?

---

## 9. Zdroje

**Zadanie a dáta (interné/zadávateľ):** Slack #meddi-onco-challenge (Hulmák 12:01 zip; Litschmann 12:19 úvod, 16:05 prezentácia); prezentácia „Rakathon – výzva MEDDI Onco.pdf“ (Slack file F0C9UK6BF0S); Drive: https://drive.google.com/file/d/1UFHs13Muitry1SEXqPRqw6eFJmXJ5bvL/view , https://drive.google.com/file/d/1ozmZmwRXvcJiJs9aSg2ZT7SjA5ORQrNZ/view ; zip v repe `docs/materials/slack/meddi-onco-challenge/extracted/` (README, pravidla_triaze, dotazniky_definice, vzorove_souhrny, pacientska_cesta); INTRO Praha `docs/materials/drive/INTRO_Praha_text.md`; živá tabuľa https://submit.rakathon.cz/vyzvy (načítaná pri písaní).

**Interný research:** 04, 05, 06, 07, 08, 09 v `docs/research/`.

**Verejné zdroje:**
- Panattoni et al., ASCO 2017 (pohotovosť pri onkoliečbe): https://ascopost.com/News/55724
- Celoštátna analýza USA o vyhnuteľných pohotovostiach (súhrn): https://pubmed.ncbi.nlm.nih.gov/39038257/
- Basch, JCO 2016 (ePRO): https://europepmc.org/article/MED/26644527 ; Denis, JNCI 2017: https://doi.org/10.1093/jnci/djx029 ; PRO-TECT, Nat Med 2025: https://doi.org/10.1038/s41591-025-03507-y ; ESMO ELCAP: https://pubmed.ncbi.nlm.nih.gov/41111032/
- LLM triáž (preprint): https://arxiv.org/abs/2605.15680 ; komentár UCSF: https://codex.ucsf.edu/news/insights-codex-director-sumant-ranji-md-sfhm-analyzing-new-research-llms-and-patient-triage
- Noona (Siemens Healthineers): https://cancercare.siemens-healthineers.com/products/software/patient-engagement ; Kaiku (súhrn): https://www.mobihealthnews.com/news/emea/swiss-hospitals-implement-remote-covid-19-symptom-checking-platform
- VZP Inovačný portál: https://inovace.vzp.cz ; VZP rozhovor 29. 9. 2026: https://www.vzp.cz/o-nas/aktuality/hlavinka-digitalni-technologie-uz-pouzivame-je-na-case-naucit-se-hodnotit-jejich-prinos
- MZ ČR (koordinátori, 600 tis. pacientov): https://mzd.gov.cz/tiskove-centrum-mz/jeden-kontakt-mene-cekani-rychlejsi-cesta-k-lecbe-koordinatori-meni-peci-o-onkologicke-pacienty/
- ÚZIS Novotvary: https://www.uzis.cz/res/f/008447/novotvary2019-2021.pdf ; OECD/EK Czechia Country Cancer Profile 2025: https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-cs-2025-1663-v2-en.pdf
- DiGA ceny (GKV): https://www.gkv-spitzenverband.de/gkv_spitzenverband/presse/pressemitteilungen_und_statements/pressemitteilung_2239872.jsp
- Sinsky 2016: https://doi.org/10.7326/M16-0961 ; Banerjee 2017: https://doi.org/10.1093/annonc/mdx196 ; Bray 2024 (GLOBOCAN): https://doi.org/10.3322/caac.21834

**Čo som nevedel overiť [?]:** presný počet pacientov naraz na systémovej liečbe v ČR; úmrtnosť pri febrilnej neutropénii (číslo z pamäti); akvizícia Kaiku/Elekta a úhrada Moovcare (z pamäti); ceny Noona, Kaiku a podobných; presné znenie metodiky Inovačného portálu pre vzdialené monitorovanie; spôsob dodania skrytej sady; zloženie sobotnej poroty výzvy.
