# SMART ONCO AA: Příprava bez čekání (VFN, Praha) – hĺbková analýza

_Stav: piatok 16. 10. 2026, cca 17:00. Písané pre Bruna a Maťa (nie sú technici). Odborné pojmy sú vysvetlené v zátvorke. Pri číslach je zdroj (URL alebo PMID). **[?]** = neisté alebo som to nevedel overiť. **[V]** = číslo som videl priamo v abstrakte štúdie / v dokumente zdroja. **[S]** = sprostredkovaný alebo obchodný zdroj. **(prepočet)** = môj jednoduchý výpočet z uvedených čísel._

_Prečítané: `00`, `04`, `05`, `06`, `07`, `08`, `09`, `02`, `03`, kanál `#smart-onco-aa-priprava-bez-cekani` (celý, vrátane jediného vlákna; je prázdny, len „prosím o dáta“), tabuľa tímov `submit.rakathon.cz/vyzvy` (živá), **celá prezentácia zadávateľa (16 slidov)**, výročná správa VFN 2025, web VFN, Europe PMC (štúdie). Slack som len čítal, nič som neposielal. Nič sa necommitovalo. Žiadny súbor som nesťahoval ručne: prezentáciu som si prezrel ako náhľad na verejnom odkaze._

> Poznámka k webovému vyhľadávaniu: limit na vyhľadávanie (WebSearch) bol v tejto relácii vyčerpaný, takže som nehľadal „naslepo“. Dôkazy som bral z `07`, `08`, z priamo otvorených stránok (VFN, Qventus, LeanTaaS, Europe PMC) a z mojich znalostí tam, kde to výslovne značím **[?]**. Ak chcete ešte doplniť vyhľadávanie (napr. ďalšie produkty na trhu), treba napísať follow-up.

---

## 0. Zhrnutie na 1 minútu

**Čo to je (jednou vetou):** Pacient s rakovinou ide na veľkú operáciu a pred ňou musí prejsť „predoperačnou prípravou“ (vyšetrenia, laboratórne výsledky, anesteziológ, kardiológ, výživa…). Dnes sa to robí po jednom, papiere sa strácajú a špecialisti na seba čakajú. Zadávateľ (VFN, **doc. Jan Bláha, prednosta Kliniky anesteziológie, resuscitácie a intenzívnej medicíny VFN** [V: web VFN]) chce **nový spôsob, ako príprava prebehne paralelne a bez čakania, nech už informácie prídu v akejkoľvek forme**. Zadanie výslovne hovorí: **nechceme, aby ste naprogramovali náš formulár**.

**Čo sa z prezentácie zadávateľa (16 slidov, doteraz neprečítaná) dozvedáme nové:**
1. Zadanie nie je „vyťaž údaje z textu“, ale **celý cyklus v 5 krokoch: získať informácie → pochopiť ich → vyhodnotiť → rozdeliť úlohy → hlídať priebeh** (slide 11).
2. Anesteziológ **aj pacient** majú mať **stály prehľad o stave prípravy**, so **5 stavmi: HOTOVO / CHYBÍ / ŘEŠÍ SE / NEJISTÉ / POZOR** (slide 13). To je hotové zadanie na obrazovku.
3. Informácie prichádzajú **vytlačené, naskenované, vyfotené, PDF alebo zapísané online** a **dôveryhodnosť** je rôzna: overená / nečitateľná / nejasná / zastaralá / pochybná (slide 12). Riešenie musí fungovať „bez ohľadu na to, čo a odkiaľ príde“ (slide 16).
4. Príbeh a metafora sú **formula 1: predoperačná príprava ako pit stop**. Kto pritiahne túto metaforu do dema a videa, hovorí zadávateľovi jeho vlastnou rečou (a Bruno je presne na toto).
5. Zdôraznená bolesť: **viac ako 20 % onkologických pacientov vstupuje do operácie s anémiou (málokrvnosťou)**, lebo ju nikto včas neriešil (slide 8). Je to merateľné a medicínsky obhájiteľné (§3).

**Dáta:** **neznáme.** V kanáli je len jedna otázka hackerov „pošle niekto dáta?“, odpoveď: Ondřej Hoferek (InterSystems) ich poslal **súkromnou správou** (15:38). Čo v nich je, nevieme **[?]**. Tomu zodpovedá aj návrh nižšie: demo postavíme tak, aby fungovalo **na našich vlastných syntetických (vymyslených) dokumentoch** a dáta od Hoferka sa dali doplniť.

**Naše odporúčané riešenie (stručne):** **„PIT STOP“ – jedna obrazovka na pacienta.** Pretiahnete do nej 6 rôznych, chaotických dokumentov (foto vytlačenej správy, sken, PDF, rukou písaná poznámka, údaj z online systému). AI ich prečíta, **ku každému údaju ukáže zdroj a mieru dôvery**, rozsvieti **5-stavovú tabuľu prípravy** (kardiológia, krv/anémia, pľúca, výživa, lieky, informovanie pacienta…), **sama rozdelí úlohy paralelne** a ukáže **najdlhšiu cestu k operácii („čo zdržuje termín“)**. Pacient dostane to isté v jednoduchej verzii na telefón (alebo na papier) a anesteziológ jednu stranu „pripravený / nepripravený a prečo“, kde sa dá každé tvrdenie rozkliknúť na zdroj. AI **nerozhoduje o spôsobilosti na narkózu**, iba triedi, upozorňuje a hlídá. Šialený variant: AI zavolá pacientovi (hlasový asistent po česky), dopýta chýbajúce údaje a **odhadne dátum „pripravený na operáciu“**.

**Konkurencia:** k 16:30 je na tejto výzve **1 tím (Canbe)**; **FIT/S** (4 ľudia, sú v kanáli a pýtali sa na dáta) zatiaľ nevybral, ďalší v kanáli len pribúdajú. Odhad pri uzávierke: **2–4 tímy**. Pražský tím túto výzvu **môže** zvoliť (je v zozname 12 pražských výziev vo formulári).

**Skóre (vážený priemer): 6,4 / 10** (detail v §7). Silné: úspora času, jednoduchosť, realizovateľnosť za noc, wow/príbeh, málo konkurencie. Slabé: **dáta neznáme**, jasný platiteľ chýba, partner bez ceny od VZP, náš fit je len čiastočný.

**Čo urobiť pred 19:00 (ak o tejto výzve vážne uvažujete):** (1) otvoriť si prezentáciu a overiť môj prepis (odkaz v §8, trvá 3 minúty); (2) opýtať sa Hoferka (mentorská miestnosť alebo Slack správa od vás), **v akej forme dáta sú** (PDF/obrázky/FHIR? koľko pacientov?); (3) rozhodnúť sa. Ak by dáta boli len „3 PDF-ká“, naša cesta (vlastné syntetické prípady) to neohrozí.

---

## 1. Presné zadanie

### 1.1 Odkiaľ to je a čo sme prečítali

| Zdroj | Čo obsahuje | Stav |
|---|---|---|
| Kanál `#smart-onco-aa-priprava-bez-cekani` | Len „has joined“ správy a 1 vlákno: hacker (FIT/S) o 14:00 „mohl by nám někdo zaslat data?“, organizátor „5 min“ (14:19), Ondřej Hoferek „zasláno přes PM“ (15:38). **Žiadne zadanie, popis ani súbor.** Garant Jan Bláha v kanáli nepíše. | prečítané celé |
| Prezentácia „VFN – SMART ONKO AA.pptx“ (66 MB, Google Drive, verejný odkaz) | **16 slidov, obrázkové** (preto konektor vracal prázdny text). Prečítané vizuálne cez náhľad v prehliadači. | **prečítané celé (nové oproti `05` a `06`)** |
| `INTRO Praha` (slidy organizátorov) | iba meno garanta a názov výzvy | prečítané |
| InterSystems workshop | výzva je zaradená do kategórie „**overiť a doplniť – SQL/API**“ (spolu s PACS Comparator a Cesta pacienta) | prečítané |
| Web VFN | Jan Bláha = **doc. MUDr. Jan Bláha, Ph.D., MHA, LL.M., přednosta Kliniky anesteziologie, resuscitace a intenzivní medicíny (KARIM)** [V: vfn.cz/pacienti/kliniky-ustavy/klinika-anesteziologie-resuscitace-a-intenzivni-mediciny/] | prečítané |

**Čo „AA“ znamená:** v zadaní to nie je vysvetlené. Podľa toho, že hlavnými používateľmi sú **anesteziológ a pacient** (slide 13) a garantom je prednosta anesteziologickej kliniky, je to pravdepodobne **anesteziologická ambulancia** (miesto, kde anesteziológ pacienta pred operáciou posúdi) **[?]**.

### 1.2 Prezentácia zadávateľa, slide po slide (moje zhrnutie, nie doslovný prepis)

1. **Titul:** SMART ONKO AA, Všeobecná fakultní nemocnice v Praze, Rakathon 16/10/2026.
2. **„Imagine“:** máte rakovinu a čaká vás veľká operácia.
3. Vaša operácia nezačína tým, že vás odvezú na sál. Rozhodujúce veci sa musia stať **dávno predtým** (a dnes sa často nedejú).
4. **Ako to dnes vyzerá** (fotka ambulancie, komiks): lekár sa pýta, či má pacient správu od praktika, laborky a nález z pľúc. Pacient: „To mi ale neřekli!“ Lekár: „Tak já to teď sepíšu a dám vám žádanky“, no pacient **bude musieť prísť znova**.
5. Do predoperačnej prípravy vstupuje rad odborností. **Jeden špecialista čaká na druhého, požiadavky sa strácajú alebo dublujú, pacient stráca čas**, ktorý by sa mohol lepšie pripraviť.
6. Aby pacient zvládol náročnú operáciu čo najlepšie, musia byť splnené **3 podmienky:** (01) **v čo najlepšom stave** (optimalizovaná výživa, „prehabilitácia“ = tréning pred operáciou, a krvný obraz), (02) **čo najlepšie pripravený** (včas vyriešené riešiteľné riziká: kardiologické, infekčné, pľúcne a ďalšie), (03) **čo najlepšie informovaný** (pokojný pacient s jasným plánom liečby).
7. V príprave vystupuje: **onkológ, chirurg, rádiológ, laborant, anesteziológ (zvýraznený), kardiológ a ďalší špecialisti.**
8. **Viac ako 20 % onkologických pacientov vstupuje do operácie s anémiou…** lebo ju nikto včas neriešil, hoci možnosť bola, a pacient nevedel, že je to dôležité.
9. „Chceli by sme mať prípravu **zladenú ako symfonický orchester**.“ (fotka orchestra)
10. **Predoperačná príprava ako pit stop vo formule 1.** Podstata (parafráza): nechceme, aby všetci pracovali rýchlejšie, chceme, aby sa **zkoordinovali a prestali na seba čakať**. **A presne to je vašou úlohou.**
11. **SMART ONKO AA – „Příprava bez čekání“** a **5 krokov: ZÍSKAT INFORMACE → POCHOPIT JE → VYHODNOTIT → ROZDĚLIT ÚKOLY → HLÍDAT PRŮBĚH.** Pod tým: nemusíme čakať, kým vieme všetko, aby sme začali riešiť to, čo už vieme.
12. **Každý pacient je iný a rovnako vstupné informácie.** Ako informácia príde: vytlačená, naskenovaná, vyfotená, PDF, zapísaná online. **Ako veľmi jej môžeme veriť:** kvalitná a overená, nečitateľná, nejasná či neprehľadná, zastaralá, pochybná.
13. **Potrebujeme, aby anesteziológ aj pacient mali stály prehľad o stave prípravy.** Stavy: **HOTOVO, CHYBÍ, ŘEŠÍ SE, NEJISTÉ, POZOR** (farby: zelená, šedá, modrá, oranžová, červená). Obrázok: pit stop s lekármi.
14. **Tak ako to robíme my, to nefunguje.** Nechceme, aby ste **naprogramovali náš formulár**. Potrebujeme, aby ste **vymysleli lepší spôsob**.
15. **Onkologický pacient nemá čas čakať.**
16. **Postavte nám pit stop, ktorý funguje bez ohľadu na to, čo a odkiaľ príde.** „To je SMART ONKO AA výzva!“

### 1.3 Čo presne chcú (zložené do jednej úlohy)

Navrhnúť a ukázať **prototyp „pit stopu“ predoperačnej prípravy onkologického pacienta**, ktorý:
- **prijme informácie v akejkoľvek forme** (papier, sken, foto, PDF, online záznam) a **nečaká na úplnosť** (už s tým, čo je, začne konať),
- **informácie pochopí a vyhodnotí aj z pohľadu dôveryhodnosti** (kvalitná / nečitateľná / zastaralá / pochybná),
- **rozdelí úlohy medzi odbornosti paralelne** (nie po jednej),
- **hlídá priebeh** a **ukazuje anesteziológovi aj pacientovi stav v 5 stavoch**,
- a **nie je to len formulár**.

Hodnotiace kritériá pre túto výzvu neexistujú osobitne. Platia **všeobecné:** (sobota) 1. AI technológia a prevedenie, 2. využiteľnosť v praxi u zadávateľa, 3. inovatívnosť; (nedeľa, finále) navyše 4. škálovateľnosť a 5. kvalita prezentácie a tímu. Váhy nie sú zverejnené. **Využiteľnosť u zadávateľa hodnotí sám zadávateľ pri obchôdzke v sobotu 14:00–16:00** (podľa `05`). Teda **Jan Bláha príde k nášmu stolu**. Poznámka: je to manažérsky orientovaný lekár (MHA = diplom zo zdravotníckeho manažmentu, LL.M. = právnický titul). Rátajte s otázkami typu „kto za to zodpovedá?“, „ako sa to dá nasadiť?“, „čo keď sa AI pomýli?“.

### 1.4 Dáta, mentori, čo v zadaní chýba

- **Dáta:** dodáva InterSystems mentor **Ondřej Hoferek** (Praha; ďalší: Gabriel Ing; online mentori 24/7). Obsah, formát, počet pacientov a či sú „reálne anonymizované“ alebo vymyslené: **[?] nevieme.** Otázka v kanáli bola o 14:00, dáta odišli o 15:38 súkromne.
- **Mentori:** za zadávateľa v kanáli nikto uvedený (`#02-dotazy` uvádza len garanta Jana Bláhu). Technicky InterSystems (Hoferek, Ing) a Microsoft (Marusan: AI aplikácie, Azure, architektúra).
- **Čo v zadaní chýba:** referenčné správne riešenie (ground truth), váhy hodnotenia, forma výstupu (app / dashboard / API), napojenie na nemocničný systém, zoznam odborností a vyšetrení, ktoré sa majú sledovať, pravidlá „kedy je pacient pripravený“. To je **príležitosť aj riziko:** môžeme si zadanie vyložiť sami, ale musíme to obhájiť pred anesteziológom.
- **InterSystems cena 1 500 EUR** sa dá spojiť s touto výzvou (kategória „overiť a doplniť – SQL/API“; FHIR server ako úložisko by sme použili).

---

## 2. Koncový užívateľ

Hlavní užívatelia sú **štyria** (v zadaní explicitne anesteziológ a pacient; ostatných odvodzujem z toho, ako príprava prebieha **[?] treba overiť na mieste u anesteziológa**).

### 2.1 Anesteziológ v anesteziologickej ambulancii (hlavný užívateľ)
- **Čo robí:** pred plánovanou operáciou posudzuje, či je pacient pripravený na narkózu a aké riziká treba vyriešiť.
- **Jeho deň v praxi:** pacient pri dverách s papiermi z viacerých miest: správa od praktika, laboratórne výsledky z inej laboratória (iné referenčné rozmedzia), EKG z minulého roka, CD z röntgenu, fotka v mobile. Anesteziológ musí **zistiť, čo je, čo chýba a čomu veriť**, potom volá, žiada doplnenie a posiela pacienta preč s papierikom „príďte znova“ (slide 4). Operačný termín medzitým beží.
- **Čo ho bolí:** (1) dohľadávanie a prepisovanie, (2) nevie, kto z ostatných špecialistov „drží loptu“, (3) o chýbajúcom sa dozvie neskoro, nie keď sa ešte dalo niečo robiť, (4) nikdy nemá istotu, či je údaj aktuálny a či nie je zámena pacienta alebo jednotiek.
- **Prečo to dnes zlyháva:** príprava je **sériová** (jeden po druhom), **bez jedného vlastníka**, informácie majú **rôznu kvalitu a formu**, **stav nikto nevidí na jednom mieste**. To všetko je presne obsah slidov 5, 12 a 13 (zadávateľ to opisuje sám).

### 2.2 Sestra / koordinátor onkologickej starostlivosti
- Od 1/2026 má každé z 15 komplexných onkologických centier (KOC) koordinátora; hradí sa **250 Kč za výkon**; **štandardný softvér pre nich zatiaľ neexistuje** (len pilotné aplikácie) [V: MZ ČR 2. 9. 2026 podľa `08`]. VFN je súčasťou KOC (spolu s FTN a ÚVN) [V: výročná správa VFN 2025].
- Deň: telefonuje pacientom, praktikom a ambulanciám, zisťuje, „kto kde čo má“, a nahlas upozorňuje, že niekomu chýba výsledok. Potrebuje **zoznam „čo uviazlo a u koho“**, nie ďalší formulár.

### 2.3 Pacient (a jeho rodina)
- Často **70+, úzkostný, nie každý ovláda smartfón** (Tichopád: pacienti sú často 70+ a kognitívne krehkí, pozri `02`). Nevie, **čo je dôležité** (anémia, výživa, lieky), a tak príprave nepomáha (slidy 6 a 8).
- Preto musí byť pacientska verzia **mimoriadne jednoduchá** a aj **na papieri** (jedna stránka „čo mám urobiť“), nie len aplikácia.

### 2.4 Chirurg / onkológ (ten, kto operáciu plánuje)
- Chce **potvrdený termín** a vedieť, **čo ho zdrží**. Ak príprava nie je hotová, operácia sa odloží, a to je pre pacienta s rakovinou strata času (§3: každé 4 týždne meškania ~ +6–8 % riziko úmrtia pri operácii, pozorovacie dáta).

**Koho NIE je:** nie lekár IT; nie je to produkt pre pacienta ako „zdravotný denník“. Kupcom je nemocnica (prednosta kliniky/riaditeľ), vstupným bodom je anesteziológ.

---

## 3. Dôkazy o probléme (čísla a štúdie)

Značky: [V] overené v abstrakte; [S] sprostredkované; (prepočet) vlastný výpočet.

### 3.1 Koľko ľudí sa to týka
| Číslo | Hodnota | Zdroj |
|---|---|---|
| Nové zhubné nádory v ČR za rok | **58 461** (2021); odhad OECD >61 000 (2022) | ÚZIS Novotvary 2019–2021 https://www.uzis.cz/res/f/008447/novotvary2019-2021.pdf; OECD ČR 2025 [V, cez `08`] |
| Podiel pacientov, ktorí niekedy potrebujú operáciu | „**viac ako 80 % prípadov** bude potrebovať operáciu, niektoré aj opakovane“ (svetový údaj, 2015) | Sullivan et al., Lancet Oncology 2015, PMID 26427363, DOI 10.1016/s1470-2045(15)00223-5 [V] |
| Horný odhad pre ČR | 58 461 × 0,8 ≈ **do ~47 000 pacientov ročne** (zahŕňa menšie, diagnostické a paliatívne výkony; väčšina nevyžaduje veľkú predoperačnú prípravu, takže realistický rád je **desiatky tisíc** ročne) | (prepočet) **[?]** |
| VFN | v roku 2025 **1 272 „léčených pacientů v KOC VFN“** (definícia nie je v správe vysvetlená) | VFN, Výroční zpráva 2025, str. s kľúčovými číslami https://www.vfn.cz/wp-content/uploads/2026/07/VFN-vyrocni-zprava-2025.pdf **[?]** |
| Čas lekára | v USA ~**49 %** času pri elektronickej karte a papieroch, ~27 % pri pacientovi | Sinsky 2016, Ann Intern Med, https://doi.org/10.7326/M16-0961 [V, cez `07`] (nie onkológia, nie ČR) |

### 3.2 Anémia pred operáciou (hlavný „tvrdý“ príklad zo slidu 8)
- **Zadávateľ tvrdí: >20 % onkologických pacientov vstupuje do operácie s anémiou** (slide 8, údaj bez zdroja; berieme ako údaj zadávateľa).
- **Literatúra (všetky operácie, nie len onkológia):**
  - Meta-analýza 24 štúdií, 949 445 pacientov: **39,1 % malo anémiu pred operáciou**; spojená s vyššou úmrtnosťou (**OR 2,90**), akútnym poškodením obličiek (**OR 3,75**), infekciou (**OR 1,93**) a transfúziou (**OR 5,04**). Autori upozorňujú, že nie je jasné, či je anémia samostatný rizikový faktor, alebo len ukazovateľ závažnejšej choroby. Fowler et al., Br J Surg 2015, PMID 26349842, DOI 10.1002/bjs.9861 [V].
  - Európska štúdia, 39 309 pacientov, 28 krajín: anémia u **31,1 % mužov a 26,5 % žien**; stredne ťažká anémia OR úmrtia v nemocnici **1,99**, ťažká **2,82**. Baron et al., Br J Anaesth 2014, PMID 24829444 [V].
  - USA, 227 425 pacientov: **30,4 %** malo anémiu; 30-dňová úmrtnosť OR **1,42**, komplikácie OR **1,35**. Musallam et al., Lancet 2011, PMID 21982521 [V].
  - **Kolorektálny karcinóm:** v dvoch malých fínskych kohortách (148 + 208 pacientov) **43 %** s anémiou pred operáciou. Väyrynen 2018, Sci Rep, PMID 29348549 [V] (malá vzorka).
- **Liečba anémie nie je automaticky „vyriešená“, a časovanie je kľúčové:**
  - **FIT (RCT, 202 pacientov s kolorektálnym karcinómom):** železo do žily sa začalo **v mediáne len 14 dní pred operáciou**; v deň príjmu sa krvný obraz upravil len u **17 % (žila) a 16 % (tablety)**, ale **o 30 dní neskôr u 60 % vs 21 %**. Autori: kým je príprava hotová, môže byť potrebné operáciu posunúť. Talboom et al., Lancet Haematol 2023, PMID 36863386 [V]. **Čítanie pre nás: príprava sa musí začať skôr, nie až pri ambulantnej návšteve pár dní pred operáciou.**
  - **PREVENTT (RCT, 487 pacientov pred veľkou brušnou operáciou):** železo do žily **nezmenšilo** počet úmrtí alebo transfúzií (28 % vs 29 %, RR 1,03). Richards et al., Lancet 2020, PMID 32896294 [V]. **Poctivé upozornenie:** nie každý „zásah v príprave“ zlepší výsledok; naše riešenie musí **organizovať prípravu**, nie sľubovať zázrak.

### 3.3 Zrušené operácie a prečo príprava pomáha
- **Predoperačná ambulancia znižuje zrušenia v deň operácie:** s návštevou kliniky **8,4 %** vs bez nej **16,2 %** (jednodňová chirurgia, 1 164 vs 2 252 prípadov); vo všeobecných sálach **5,3 %** vs **13,0 %**. Ferschl et al., Anesthesiology 2005, PMID 16192779 [V] (jedno pracovisko v USA; nie randomizované).
- **Nemecká multicentrická štúdia (6 009 anestézií):** zrušenia **12,4 %** vo fakultných nemocniciach vs **5,0 %** v malých. Schuster et al., Anesth Analg 2011, PMID 21680860 [V].
- **Poctivá výhrada:** v jednej kanadskej univerzitnej nemocnici bolo **14,0 %** operácií zrušených, no **83,5 %** z administratívnych/štrukturálnych dôvodov (sál sa omeškal, nedostatok lôžok, prednosť pre urgentný prípad). Teda **nie všetky zrušenia vyrieši lepšia príprava.** Koh et al., Can J Surg 2021, PMID 33666393 [V].

### 3.4 Meškanie liečby a strata informácií
- **Každé 4 týždne meškania** zvyšuje riziko smrti pri operácii o ~**6–8 %** (pomer rizika 1,06–1,08; 34 štúdií, 1,27 mil. pacientov). Hanna et al., BMJ 2020, https://doi.org/10.1136/bmj.m4087 [V, cez `07`]. **Pozorovacie dáta, príčinnosť nie je dokázaná.**
- **ČR:** viac ako **60 %** pacientov s rakovinou pľúc nezačne liečbu do 8 týždňov od CT [MZ ČR 2. 9. 2026 podľa `08`]; **40 %** pacientov s rakovinou pľúc čaká na operáciu viac ako 8 týždňov [údaj odborníka na pre-hack dni, `02`, **[?]** nepotvrdené verejným zdrojom].
- **Strata informácií = opakované vyšetrenia:** ak sa cudzie snímky nahrali do archívu, opakovalo sa **11 %** vyšetrení, ak neboli dostupné, **72 %**. AJR 2012, https://doi.org/10.2214/ajr.11.6890 [V, cez `07`] (analógia pre nás, nie predoperačná štúdia).

### 3.5 Prehabilitácia a výživa (to, čo slide 6 chce „riešiť včas“)
- **RCT PREHAB (251 pacientov, kolorektálna operácia):** závažné komplikácie **17,1 % vs 29,7 %** (OR 0,47), ale vzdialenosť prejdená za 6 minút po 4 týždňoch sa **významne nelíšila**. Molenaar et al., JAMA Surg 2023, PMID 36988937 [V].
- **Systematický prehľad 23 RCT (2 475 pacientov):** výživová prehabilitácia znižuje infekčné komplikácie (**RR 0,65**; dôkaz strednej kvality) a mierne pobyt v nemocnici; pre ostatné formy je dôkaz slabý. Steffens et al., Ann Surg Oncol 2024, PMID 38914837 [V].
- Záver: **prínos je reálny, ale podložený rozdielne.** Pre pitch používame zdržanlivé vety („znižuje pravdepodobnosť komplikácií“), nie „zachraňuje životy“.

### 3.6 Čo hovorí AI a prečo nemôže „rozhodovať“
- GPT-4 Turbo pri hodnotení **ASA** (štandardné skóre telesného stavu pred narkózou) z poznámok dosiahol F1 len **0,50** (úmrtnosť v nemocnici 0,86; odhady dĺžok pobytu „univerzálne slabé“). Chung et al., JAMA Surg 2024, PMID 38837145 [V]. **→ AI nech nehodnotí spôsobilosť. Nech číta, triedi, upozorňuje a cituje zdroj.**
- Randomizovaná štúdia LLM asistenta pri predoperačnej konzultácii (Singapore General Hospital, PEACH): **celkový čas dokumentácie sa významne neskrátil** (zisk 5,8 min len pri stredne zložitých pacientoch), lekári preferovali záznamy s LLM v **57,1 %** prípadov; odhad úspor **SGD 197 501 ročne** (modelový). Ke et al., npj Digit Med 2025, PMID 40691284 [V]. **→ úspora času nie je automatická; hodnota je v kvalite a prehľade.**
- Prehľad 56 štúdií o AI v predoperačnom testovaní: väčšinou proof-of-concept, málo prospektívnych štúdií. Chinn et al., J Clin Monit Comput 2026, PMID 41619047 [V]. Trh je teda **otvorený, no nedokázaný.**

**Čo si z toho zobrať do pitchu (3 čísla s poctivým obalom):** (1) „26 až 39 % pacientov prichádza na operáciu s anémiou“ (Baron 2014, Fowler 2015); (2) „predoperačná ambulancia znižuje zrušenia z 13 % na 5 %“ (Ferschl 2005); (3) „každé 4 týždne meškania ≈ +6–8 % riziko úmrtia pri operácii“ (Hanna 2020). **Ilustračný výpočet:** ak by nemocnica mala 1 000 plánovaných veľkých onkologických operácií ročne a zrušení by bolo 12,4 % (Schuster), ide o ~124 zrušených termínov; ak by lepšia príprava odstránila aj len štvrtinu z nich, je to ~31 operácií, ktoré sa neposunú (prepočet, **[?]** len ilustrácia, skutočný podiel vyriešiteľný prípravou je podľa Koh 2021 nižší).

---

## 4. Existujúce riešenia na trhu

### 4.1 Čo sme našli

| Riešenie | Čo robí | Kto platí / cena | Čo robí zle alebo čo chýba |
|---|---|---|---|
| **Qventus – Perioperative Care Coordination** (USA) | „AI administrátori pre predoperačný príjem“ (pre-admission testing): číta celý záznam vrátane externých, hľadá **200+ rizík**, každý nález odkazuje na zdroj, dátum a citát; elektronicky vybavuje ~**80 %** rutinných pacientov; hlasový/SMS/e-mail „concierge“ pre pacienta; inteligentný dotazník. Tvrdí: **až 40 % menej zbytočných zrušení**, **až 50 % viac kapacity** predoperačného tímu. Zákazníci: HonorHealth, Allina a ďalšie (logá na stránke). | Nemocnice v USA; **cenu nezverejňuje [?]**. Čísla sú **tvrdenia dodávateľa** („up to“), metodika nie je zverejnená. https://www.qventus.com/solutions/perioperative-care-coordination/ [S] | Postavené na **dátach v nemocničnom IS**, USA workflow; **nie je pre český jazyk a české prostredie** [?]; „klírens na anestéziu“ nie je automatizovaný (len označenie na kontrolu). **Nemá 5-stavovú tabuľu pre pacienta** a nehovorí o „papierových a odfotených“ vstupoch [?]. |
| **LeanTaaS iQueue for Operating Rooms** (USA) | Plánovanie sálových blokov a voľných kapacít. Tvrdí +6 % prípadov a ~100 tis. USD na sál ročne. https://www.leantaas.com [S] | Nemocnice | **Rieši sály, nie pripravenosť pacienta.** |
| **Modul nemocničných systémov** (napr. Epic, Oracle Health): „predanestetické vyšetrenie“ v elektronickej karte | Štruktúrované formuláre a kontrolné zoznamy | Nemocnica (licencia IS) | **Formulár**, presne to, čo zadávateľ nechce. Že konkrétne moduly existujú, vyplýva z mojich znalostí a webový dôkaz som tu nemal **[?]**. |
| **Český trh** | Koordinačné aplikácie pre koordinátorov KOC sa **pilotne testujú**; dodávateľov sa v `08` nepodarilo nájsť; Asseco MedWorks je všeobecný nemocničný IS bez onkologického modulu v dostupných zdrojoch. | KOC z 250 Kč/výkon (nepriamo) [`08`] | **Štandardný nástroj neexistuje.** |
| **VFN a AI** | VFN v roku 2025 **testovala AI v zobrazovaní** (Gleamer, Transpara, iCAD, QP-Care) a chystá modernizáciu nemocničných, laboratórnych a lekárenských IS pre digitalizáciu dokumentácie a interoperabilitu (VFN, Výroční zpráva 2025, odd. Informatika) [V]. NÚKIB (kybernetický úrad) varoval pred AI DeepSeek (zmienka vo výročnej správe VFN 2025). | – | Ukazuje, že **VFN je otvorená AI** aj, že má **proces na pilotovanie**. **Poučenie: v dema nepoužívať DeepSeek.** |
| **Akademické prototypy** (PEACH, LLM pre ASA, NLP pre ASA) | pozri §3.6 | – | Väčšinou proof-of-concept, žiadny produkt nasadený na českej klinike. |

### 4.2 Kto už za to platí
V USA nemocnice platia za produkty typu Qventus (reklamné údaje, ceny neznáme **[?]**). V ČR **neznáme žiadneho platiaceho zákazníka pre tento konkrétny účel [?]**. Nepriame financovanie: (a) **koordinátor v KOC** (250 Kč/výkon, od 1/2026), (b) **Inovačný portál VZP** (od 21. 9. 2026; onkológia ako prvá téma; až 300 mil. Kč na 2027; žiadať môžu výrobcovia s klinickým partnerom, nie nemocnice; **organizačné nástroje môžu prísť neskôr, Hlavinka** [V, cez `08`]). Teda cesta k penaženke je **dlhá** (pilot na jednej klinike → úhrada alebo vlastný rozpočet nemocnice).

### 4.3 Kde je priestor urobiť to lepšie / rýchlejšie / lacnejšie / jednoduchšie
1. **Vstup „čokoľvek a odkiaľkoľvek“** (foto, sken, PDF) namiesto čakania na IS (zadanie to žiada). Konkurencia sa opiera o štruktúrované dáta.
2. **Dôveryhodnosť údaja ako samostatný rozmer** (zastaraný / nečitateľný / protirečivý), nie len „extrahované hodnoty“.
3. **Stav rovnako pre anesteziológa aj pacienta** v 5 zrozumiteľných stavoch.
4. **Paralelné rozdelenie úloh a „najdlhšia cesta“** (čo skutočne zdržuje termín).
5. **Česky, pre český proces**, lacno (cloudové LLM + pravidlá, žiadne drahé nasadenie).

---

## 5. Najlepší návrh riešenia pre nás

### 5.1 Princíp: „PIT STOP“ – jedna obrazovka, 5 stavov, 5 krokov

Pomenujeme to **PIT STOP – Příprava bez čekání** (rovnaká reč ako zadávateľ). Presne kopírujeme ich 5 krokov a 5 stavov, aby Jan Bláha videl **svoje zadanie splnené**.

| Krok zadávateľa | Čo v appke ukážeme |
|---|---|
| 1 ZÍSKAT INFORMACE | Pretiahnem do okna 6 rôznych vecí: foto vytlačenej správy z mobilu, naskenovaný papier, PDF z laboratória, rukou písaná poznámka, údaj z „online“ systému (JSON/FHIR), nahrávka hlasu. |
| 2 POCHOPIT JE | AI prečíta všetko (čeština, aj mierne rozmazané foto), vytiahne: typ dokumentu, dátum, zdroj, hodnoty s jednotkami. **Každý údaj má zdroj: klik na údaj zvýrazní riadok na pôvodnom papieri.** |
| 3 VYHODNOTIT | **Dve nezávislé hodnotenia:** (a) *dôveryhodnosť* údaja (čitateľnosť, vek údaja, spoľahlivý zdroj, súlad s inými dokumentmi) a (b) *čo z neho vyplýva podľa pravidiel* (napr. hemoglobín pod hranicou → anémia). **Pravidlá sú viditeľné a upraviteľné lekárom** (nie „čierna skrinka“); AI nehodnotí spôsobilosť na narkózu. |
| 4 ROZDĚLIT ÚKOLY | Z medzier vzniknú **úlohy paralelne** pre odbornosti (kardiológ, laboratórium, výživa, krv/anémia, pľúca, lieky, informovanie pacienta), každá s vlastníkom a termínom. Návrh textu žiadanky sa vygeneruje (nenapájame na IS). |
| 5 HLÍDAT PRŮBĚH | **Tabuľa** 5 stavov (HOTOVO zelená / CHYBÍ šedá / ŘEŠÍ SE modrá / NEJISTÉ oranžová / POZOR červená), **„čo zdržuje termín“** (najdlhšia cesta), upozornenie keď úloha uviazne. |

**Tri pohľady z jedného zdroja pravdy:**
- **Anesteziológ:** jedna strana „pripravený / nepripravený / pripravený s výhradou a prečo“; **klik na zdroj** pri každom tvrdení; AI-text vizuálne odlíšený; **podpis lekára** je jediný, kto „uzavrie“ stav.
- **Pacient:** veľké písmo, 3–5 vecí „čo mám urobiť / čo sa už stalo“, tie isté farby; **QR kód + vytlačiteľná jedna strana** (kvôli 70+ pacientom). Pacient môže **odfotiť dokument** a pošle ho do tabule.
- **Koordinátor:** zoznam „kto čaká na koho“, kde sú pacienti, ktorým uviazla úloha.

### 5.2 Prečo je to „jednoduché“ pre koncového užívateľa
- **Jeden vstup (pretiahnuť súbory) a jedna obrazovka.** Nič sa „nevypisuje“.
- 5 farebných stavov, ktoré si zadávateľ vymyslel sám.
- Každé tvrdenie je **overiteľné jedným kliknutím**.

### 5.3 Čo ukážeme v 3-minútovom pitchi (cca 1–1,5 min video + reč)

Použijeme **vymyslenú pacientku** (napr. „pani Nováková, 67, rakovina hrubého čreva, operácia o 3 týždne“; všetko syntetické a označené ako simulácia):

| Čas | Čo vidieť | Reč |
|---|---|---|
| 0:00–0:25 (video) | Chodba, papiere, 3. návšteva ambulancie, „To mi neřekli!“ (**nahradíme vlastnou scénou**, nie kópiou ich fotky), odpočítavanie termínu operácie | „Operácia sa nezačína na sále. Rozhoduje sa týždne predtým, a dnes na seba špecialisti čakajú.“ |
| 0:25–0:55 (video) | Pit stop formule 1: 12 ľudí, každý vie, čo robiť, súčasne | „Nechceme, aby všetci pracovali rýchlejšie. Chceme, aby prestali na seba čakať.“ (je to ich myšlienka, **citovať ju s menom zadávateľa**) |
| 0:55–2:20 (živé demo alebo záznam obrazovky) | Pretiahnem 6 chaotických dokumentov → za ~20 s sa tabuľa rozsvieti: 2 zelené, **jedna červená POZOR (nízky hemoglobín, nikto to neriešil)**, oranžová NEJISTÉ (EKG staré 14 mesiacov / rozmazaná hodnota), 2 šedé CHYBÍ; klik na červenú → zvýrazní sa riadok na fotke; **súčasne vzniknú 4 úlohy**; pacient dostane QR; anesteziológ vidí 1 stranu; ukáže sa **„Čo zdržuje termín“** | „Za 20 sekúnd vie anesteziológ aj pacientka, kde sme a čo zdržuje.“ |
| 2:20–3:00 | 3 čísla (anémia 26–39 %, zrušenia 13 → 5 %, 4 týždne = +6–8 %) + „AI nerozhoduje, lekár podpisuje“ + pilot na KARIM | „Pilotovať vieme na jednej klinike. Potrebujeme anesteziológa a jedno pracovisko.“ |

**Pozor:** čísla typu „termín 38 dní → 9 dní“ v demo scenári sú **simulácia**, musia byť vo videu označené „ukážkový scenár“. Reálne čísla v pitchi len zo zdrojov v §3.

### 5.4 Technický plán na noc (pre Claude Code; jednoduché a robustné)

1. **Jedna webová aplikácia** (jednoduché UI, 3 obrazovky: tabuľa, anesteziológ, pacient) + malý server.
2. **Čítanie dokumentov:** model s videním cez dostupné LLM API (Azure endpoint); výstup do **pevnej JSON schémy** (typ dokumentu, dátum, hodnoty, jednotky, čitateľnosť, **citát/miesto na strane**). **Retry s exponenciálnym čakaním** (zdieľaný limit, chyby 429 sú normálne; `03`). **Nepoužívať DeepSeek** (varovanie NÚKIB).
3. **„Pravidlá prípravy“ v jednom čitateľnom súbore** (napr. YAML): **vzorová konfigurácia** (hranice hemoglobínu, platnosť EKG a laboratória, ktoré odbornosti sa pozývajú). Hodnoty sú **zástupné, klinik ich musí potvrdiť [?]**, čo v appke aj v pitchi **vyslovíme** (jedna z našich silných stránok pred anesteziológom). Pre anémiu je v štúdii FIT použitá hranica Hb < 12 g/dl (ženy) a < 13 g/dl (muži) [V: PMID 36863386].
4. **Skóre dôveryhodnosti:** pravidlá (vek dokumentu, zdroj, čitateľnosť z AI, súlad jednotiek, rozpor medzi dokumentmi) → stav NEJISTÉ/POZOR. Bez „čarov“.
5. **Plánovač úloh:** závislosti medzi úlohami + výpočet najdlhšej cesty („čo zdržuje termín“) jednoduchým grafom.
6. **Export:** FHIR balík (Task, Observation, DocumentReference) do **InterSystems IRIS for Health** (cena 1 500 EUR, kombinuje sa s výzvou; ak nás to nezdrží, nie je to nutné).
7. **Testovací súbor „pasce“:** 5 syntetických pacientov, každý s **vloženou chybou** (jednotky, staré EKG, nečitateľná hodnota, rozpor v liekoch, chýbajúce echo) a **správnym riešením**; skript vypíše „zachytené pasce X/Y“ → číslo do pitchu, kvalita pre porotu. (Rovnaký prístup chce MDT Copilot, takže poznáme, čo porotcovia v tomto štýle čakajú.)
8. **Bezpečnosť v dema:** žiadne reálne dáta, žiadne telefónne čísla/e-maily v súboroch; všetko označené „syntetické“.

### 5.5 Šialený ambiciózny variant: „PIT STOP LIVE“
- **Hlasový asistent**: AI **po česky zavolá alebo napíše pacientovi** (ElevenLabs), dopytá chýbajúce údaje („beriete lieky na riedenie krvi?“) a zapíše do tabule. Vo videu veľmi silné.
- **Odhad dátumu „pripravený na operáciu“** s posuvníkom „čo keby sa kardiológ posunul na štvrtok?“ (simulácia najdlhšej cesty).
- **Ambient zápis**: počúva konzultáciu u anesteziológa a priebežne aktualizuje tabuľu.
- **Agent pre každú odbornosť** (kardiológ, výživa…) číta spis a pridáva úlohy.
- **Riziko:** príliš veľa pohyblivých častí; odporúčam z toho **spraviť len dve** (hlasový hovor do videa a „čo zdržuje termín“).

---

## 6. Konkurencia na hackathone a oprávnenie

- **Tabuľa tímov (živá, ~17:00):** Praha 23 tímov má výzvu, 5 ešte nevybralo (Ctrl+Alt+CURE, **FIT/S**, FSMZ, Pražský Meridian, walking legs). **SMART ONCO AA: 1 tím (Canbe).** O skúsenostiach Canbe nič nevieme **[?]**.
- **V kanáli** sú ďalší záujemcovia: **FIT/S** (4 ľudia, pýtali sa na dáta; podľa `05` sa zaujímajú aj o Cestu pacienta), jeden hacker z quattro formaggi, jeden z walking legs, hackeri z tímov, ktoré už vybrali inú výzvu (Korex, MediBit, VI KA) a niekoľko jednotlivcov. Z toho bude finálne **2–4 tímy**.
- **Porovnanie:** AI Trial Matching 4, Mamograf 3, Hlídač NÚ 2, Cesta pacienta 2, Kvalita péče 0, Twincer 0. **SMART ONCO AA je „tichá“ výzva** s malou konkurenciou.
- **Môže ju pražský tím zvoliť?** **Áno.** Je v zozname 12 pražských výziev vo formulári výberu (`05` §2.6). Obaja členovia musia byť fyzicky na mieste (Praha). Víťaz výzvy ide do nedeľného finále; nie je jasné, či musí zadávateľ vyhlásiť víťaza aj pri jedinom tíme **[?]**.
- **Ako sa odlíšiť od ostatných tímov** (pravdepodobne väčšina postaví „AI prečíta dokumenty a vyplní formulár“): (1) **kopírovať ich pit-stop reč a 5 stavov**, (2) **dôveryhodnosť údaja a pasce**, (3) **úlohy paralelne + „čo zdržuje termín“**, (4) **video v štýle F1**, (5) **pacientska papierová verzia**. Ak ukážeme formulár, prehráme na bode „nechceme váš formulár“.

---

## 7. Skóre (1–10; 5 = priemer medzi výzvami; 9–10 výnimočne)

| Kritérium | Váha | Skóre | Zdôvodnenie | Vážené |
|---|---|---|---|---|
| Veľkosť problému | 1,0 | **6** | Desiatky tisíc onkologických operácií ročne v ČR (horný odhad ~47 tis., §3.1) a 26–39 % pacientov s anémiou pred operáciou; no ide o jeden krok cesty, nie celú populáciu (skríning je väčší). | 6,0 |
| Dopad na zdravie | 1,5 | **6** | Včasná príprava (anémia, výživa, riziká) súvisí s menej komplikáciami a zrušeniami; dôkaz je zmiešaný (PREVENTT neutrálny, PREHAB čiastočne pozitívny, anémia pozorovacie dáta). Zdržanie liečby škodí (BMJ 2020). Dopad nepriamy. | 9,0 |
| Úspora času | 1,0 | **8** | Menej opakovaných návštev, menej telefonovania a dohľadávania, paralelné úlohy. Priamy zásah do času anesteziológa, koordinátora aj pacienta. Úspora však nie je automatická (štúdia PEACH). | 8,0 |
| Úspora peňazí / zisk | 1,2 | **6** | Menej zrušených termínov a menej komplikácií (cena sály a lôžka), no české čísla (cena minúty sály, DRG) neviem **[?]**; pre poisťovňu úspora len nepriama. | 7,2 |
| Akútnosť bottlenecku | 1,5 | **7** | Zadávateľ je prednosta anesteziologickej kliniky, ktorý to hlási osobne; koordinátori od 1/2026 bez nástroja; ministerstvo tlačí na skrátenie čakania. Menej „politicky horúce“ než čakanie na diagnózu. | 10,5 |
| Ochota platiť | 1,2 | **5** | Existuje zahraničný trh (Qventus), ale **v ČR nie je jasný kupec ani úhrada**; VZP portál možno až neskôr pre procesné nástroje; platiť by musela nemocnica z vlastného rozpočtu/IT. | 6,0 |
| Jednoduchosť pre užívateľa | 1,0 | **8** | Jedna obrazovka, 5 farebných stavov od zadávateľa, pacientska papierová verzia. Odpočet za rôznorodosť vstupov a klinickú zložitosť. | 8,0 |
| Dáta na hackathone | 1,0 | **4** | **Obsah dát neznámy**, odišli súkromne, v kanáli nič nie je, žiadny ground truth, zadanie bez špecifikácie vstupov. Dá sa nahradiť vlastnými syntetickými prípadmi, no hodnotenie „na ich dátach“ je neistá. | 4,0 |
| Realizovateľnosť dema za noc | 1,0 | **8** | Web + čítanie dokumentov LLM + pravidlá + plánovač je spraviteľné za noc; riziká: limity zdieľaného endpointu, česká rukopisná poznámka, správnosť pravidiel. | 8,0 |
| Wow a príbeh | 1,2 | **8** | Formula 1 pit stop je silná vizuálna metafora (od zadávateľa), tabuľa sa za 20 s rozsvieti, rozklik na zdroj, video na mieru pre Bruna. Emócia slabšia než pri „odkazoch pre deti“. | 9,6 |
| Strategická hodnota partnera | 1,2 | **5** | VFN je veľká pražská univerzitná nemocnica a KOC, garant je prednosta kliniky; VZP cena „Křeslo pro inovace“ sa sem **nevzťahuje**; Asseco/AZ tu nie sú; InterSystems 1 500 EUR sa dá kombinovať. | 6,0 |
| Šanca vyhrať / ísť do finále | 1,0 | **8** | 1 potvrdený tím + odhad 2–4 celkovo; zadávateľ hodnotí využiteľnosť osobne a zadanie je napísané ako príbeh, ktorý vieme zahrať. Neistota: kvalita tímov Canbe a FIT/S. | 8,0 |
| Pokračovanie po hackathone | 0,8 | **6** | Garant môže otvoriť pilot na KARIM VFN; spomalí MDR/GDPR, integrácia do IS a chýbajúci platiteľ. | 4,8 |
| Fit s naším tímom | 0,8 | **5** | Bruno: storytelling a video sú **presne to, čo táto výzva potrebuje**; Maťo: radiačná ochrana/zobrazovanie je iba okrajovo súvisiace (snímky sú jeden zo vstupov), kontakt na anesteziológov nemáme **[?]**. | 4,0 |
| Nízke regulačné/klinické riziko | 0,6 | **6** | Ak ide len o triedenie, citovanie a hlídanie (lekár rozhoduje), riziko je zvládnuteľné; ak AI „vyhodnocuje“ klinické pravidlá, môže ísť o softvér s lekárskym účelom podľa MDR (pravidlo 11) **[?]**; GDPR čl. 9 (zdravotné údaje). | 3,6 |

**Súčet váh = 16,0. Súčet vážených skóre = 102,7. Vážený priemer = 6,4 / 10.**

---

## 8. Riziká, čo nevieme a odkazy

### Hlavné riziká
1. **Dáta neznáme** (formát, množstvo, kvalita). Zmiernenie: vlastné syntetické prípady + adaptér na dáta od Hoferka.
2. **Klinická vierohodnosť pravidiel.** Anesteziológ sa spýta na hranice (Hb, platnosť EKG, kto má byť konzultovaný). Zmiernenie: pravidlá vo viditeľnom súbore, označené ako vzorové, tvrdenie „potvrdí ich klinik“; využiť Hoferka a Bláhu pri obchôdzke.
3. **LLM spoľahlivosť** (zlé čítanie fotky, rozmazané údaje, zdieľaný limit, 429). Zmiernenie: každý údaj s citátom a „NEJISTÉ“ pri nízkej istote; retry; predpripravené demo.
4. **Regulácia a ochrana dát:** MDR pravidlo 11 (softvér pre klinické rozhodovanie) **[?]** a GDPR čl. 9; v demu iba syntetické dáta, produkčné nasadenie len v EÚ regióne po DPIA.
5. **Fit tímu:** nemáme kontakt na anesteziológa; Maťova odbornosť je okrajová. Zmiernenie: hovoriť jazykom zadávateľa, využiť organizačných mentorov.
6. **Dĺžka pitchu:** 3 min (náš odhad), v zadaní MDT Copilot je 5 min; nedeľný pitch môže byť dlhší **[?]**. Pripraviť 3-minútovú a 5-minútovú verziu.
7. **Slabá cesta k platbe**: povedať na rovinu, že pilot je prvý krok a že nástroj podporuje prácu koordinátora (250 Kč/výkon).
8. **Konkurencia FIT/S a Canbe**: neznáma kvalita.

### Čo som nevedel overiť [?]
- Obsah dát od Hoferka.
- Čo presne znamená „AA“.
- Počet veľkých onkologických operácií na VFN a v ČR za rok (výročná správa VFN neobsahuje taký prehľad v textovej forme; číslo 1 272 pacientov v KOC VFN nemá definíciu).
- Cena minúty sály a úspora v českom DRG.
- Cena produktov typu Qventus a existencia českých konkurentov.
- Presný text MDR pravidla 11 (EUR-Lex som nevedel načítať).
- Zdroj údaja „>20 % onkologických pacientov s anémiou“ zo slidu 8.

### Zdroje
- Prezentácia zadávateľa (16 slidov, 66 MB): https://drive.google.com/file/d/1_Z654kP1TFtO9teie0KasDZVk1qZFLBU/view
- Slack kanál výzvy `#smart-onco-aa-priprava-bez-cekani` (rakathon2026), `#02-dotazy` (zoznam garantov), `#03-info-praha` (zoznam tímov).
- Živá tabuľa tímov: https://submit.rakathon.cz/vyzvy
- VFN, Klinika anesteziologie, resuscitace a intenzivní medicíny: https://www.vfn.cz/pacienti/kliniky-ustavy/klinika-anesteziologie-resuscitace-a-intenzivni-mediciny/
- VFN, Výroční zpráva 2025: https://www.vfn.cz/wp-content/uploads/2026/07/VFN-vyrocni-zprava-2025.pdf
- Qventus Perioperative Care Coordination: https://www.qventus.com/solutions/perioperative-care-coordination/ ; LeanTaaS: https://www.leantaas.com
- Fowler 2015 (PMID 26349842), Baron 2014 (PMID 24829444), Musallam 2011 (PMID 21982521), Väyrynen 2018 (PMID 29348549), Talboom FIT 2023 (PMID 36863386), Richards PREVENTT 2020 (PMID 32896294), Ferschl 2005 (PMID 16192779), Schuster 2011 (PMID 21680860), Koh 2021 (PMID 33666393), Molenaar PREHAB 2023 (PMID 36988937), Steffens 2024 (PMID 38914837), Chung 2024 (PMID 38837145), Ke 2025 (PMID 40691284), Chinn 2026 (PMID 41619047), Sullivan 2015 (PMID 26427363); všetko cez Europe PMC https://europepmc.org (vyhľadať PMID).
- ESAIC/ESA pokyny k predoperačnému hodnoteniu dospelých pred nekardiálnou operáciou: De Hert et al., Eur J Anaesthesiol 2018, PMID 29708905 (pre pravidlá v aplikácii; „mnohé odporúčania stoja na názore expertov a majú sa prispôsobiť krajine“).
- Interné súbory: `05-slack-refresh.md`, `06-prezentacie-drive.md`, `07-trendy-a-bottlenecky.md`, `08-cesky-kontext-a-trh.md`, `09-partneri-a-vitazne-vzorce.md`, `02-prehack-prednasky.md`.
