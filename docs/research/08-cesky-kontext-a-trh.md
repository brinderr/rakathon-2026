# 08 – Český (a slovenský) kontext a trh: čísla, kto čo platí, existujúce riešenia, čo by VZP a nemocnice kúpili

_Stav: piatok 16. 10. 2026, popoludnie. Písané pre Bruna a Maťa (nie sú technici). Odborné pojmy sú vysvetlené v zátvorke. Pri číslach je zdroj (URL). **[?]** = neisté alebo som to nevedel overiť. Nič som nevymýšľal; vlastné prepočty sú označené „(náš prepočet)“._

---

## 0. Zhrnutie na jednu stranu

1. **Najdôležitejší nový fakt:** VZP od **21. 9. 2026** spustila **Inovačný portál** a pre digitálne nástroje v onkológii otvára **štvrťročnú výzvu od 1. 11. 2026** (v FAQ portálu stojí „od októbra 2026“ [?]). Schválený nástroj dostane **dočasnú úhradu 6–24 mesiacov**, na rok 2027 je vyčlenených **až 300 mil. Kč** a VZP čaká asi **100 žiadostí ročne**. Žiadať môžu výrobcovia, startupy a univerzity (nie nemocnice), s nemocnicou ako klinickým partnerom. ([VZP 21. 9. 2026](https://www.vzp.cz/o-nas/aktuality/vzp-otevira-dvere-technologickym-inovacim-v-medicine-pomohou-pacientum-i-v-diagnostice-pohlidaji-organizaci-pece-a-vysi-vydaju), [inovace.vzp.cz](https://inovace.vzp.cz), [Hlavinka 29. 9. 2026](https://www.vzp.cz/o-nas/aktuality/hlavinka-digitalni-technologie-uz-pouzivame-je-na-case-naucit-se-hodnotit-jejich-prinos)). To je reálna „cesta ku kupcovi“ pre naše riešenie po hackathone.
2. **Najväčší bottleneck, o ktorom hovorí samo ministerstvo:** čakanie na začiatok liečby. Viac ako **60 % pacientov s rakovinou pľúc nezačne liečbu do 8 týždňov od CT** (vyšetrenie, ktoré ju odhalí) ([MZ ČR, 2. 9. 2026](https://mzd.gov.cz/tiskove-centrum-mz/jeden-kontakt-mene-cekani-rychlejsi-cesta-k-lecbe-koordinatori-meni-peci-o-onkologicke-pacienty/)). Od **1/2026 má každé z 15 komplexných onkologických centier koordinátora** (človek, ktorý pacienta vedie systémom), úhrada **250 Kč za výkon koordinácie**, odhad nákladov „nižšie desiatky miliónov Kč ročne“ – a **štandardný softvérový nástroj pre nich zatiaľ neexistuje** (len pilotné aplikácie v niektorých centrách).
3. **Skríning:** účasť na mamografii je ~**60 %** (EÚ 56 %), na kolorektále len **29 %** (EÚ 42 %), na cervikálnom **74 %**. Adresné pozvánky VZP (list poštou od 2014) konvertujú dlhodobo len **~19–20 %** oslovených – v ČR aj na Slovensku (21–22 %). Zostáva „tvrdé jadro“, ktoré listy neoslovia.
4. **Koniec života:** v ČR **62 %** ľudí zomiera na lôžkach akútnej/následnej nemocničnej starostlivosti (Nemecko 49 %, Nizozemsko 24 %), doma len **26 %**. Dáta o starostlivosti na konci života doma sa **systematicky nezbierajú** ([MZ/ÚZIS/ČSPM 2025](https://mzd.gov.cz/wp-content/uploads/2025/04/Analyticka-cast-Strategie-rozvoje-paliativni-pece-v-CR-do-roku-2025.pdf)).
5. **eHealth:** novela zákona o elektronizácii (**236/2025 Sb.**) platí od **1. 1. 2026**; eŽádanky (elektronická žiadanka) bežia **dobrovoľne/pilotne** od 2. 1. 2026, sdílený zdravotní záznam (spoločný záznam pacienta) štartuje bez centrálneho úložiska. Stavať vlastný register ani vlastnú eŽádanku nemá zmysel – treba sa na ne **napojiť** (FHIR).
6. **Kto platí:** za všetko zdravotné platia zdravotné poisťovne (VZP ~300 mld. Kč ročne); nemocnice platia len to, čo im poisťovňa uhradí. Telemedicína a AI v diagnostike **zatiaľ väčšinou nemajú úhradu** (VZP to sama priznáva). Preto je nový inovačný portál kľúčový.
7. **Medzery na trhu:** (a) štandardný nástroj pre koordinátorov a odovzdanie pacienta medzi regiónom a KOC, (b) personalizovaná/viackanálová komunikácia skríningu s meraním účinku, (c) populačné ukazovatele kvality na konci života, (d) trial matching (párovanie pacientov na klinické štúdie) – komerčnú českú platformu som nenašiel [?].
8. **Slovensko (Maťo):** NCZI má podobný projekt **OnkoAsist** (cieľ: cesta od podozrenia po liečbu z >160 na 60 dní; tender ~11 mil. € bez DPH, stav dnes nejasný [?]); skríning ~30 % účasť, Národné skríningové centrum od 1/2026.
9. **Moja poznámka k výberu výzvy (nie fakt):** najlepšie „kupovateľná“ je výzva **VZP – Cesta pacienta bez ztráty informací** (+ príbuzná MDT Copilot): má vyhradený peniaz (koordinátor, inovačná výzva), jasného kupca (KOC + VZP) a nič hotové na trhu. Mamograf je silný dátovo a pre VZP, ale ide skôr o analytiku/komunikáciu než o produkt, za ktorý by sa platilo. Detail v §8.
10. **Opravy predpokladov:** „VZP Vitakarta“ je podľa nájdených zdrojov program **OZP**, nie VZP (VZP má aplikáciu **Moje VZP**, ~3 mil. používateľov, a Fond prevence) – jeden sekundárny zdroj to miešal [?].

---

## 1. Rakovina v ČR v číslach

| Ukazovateľ | Číslo | Zdroj |
|---|---|---|
| Nové zhubné nádory za rok (bez nemelanómových kožných) | **58 461** (rok 2021), 556,7 na 100 tis. obyv. | [ÚZIS, Novotvary 2019–2021](https://www.uzis.cz/res/f/008447/novotvary2019-2021.pdf) |
| Odhad nových prípadov (OECD/EÚ, rok 2022) | viac ako **61 000**, 565 na 100 tis. (EÚ 572) | [OECD Country Cancer Profile ČR 2025](https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-cs-2025-1663-v2-en.pdf) |
| „Nových prípadov ročne“ podľa MZ | **viac ako 90 tis.**; s rakovinou žije **viac ako 600 tis.** ľudí | [MZ ČR, 2. 9. 2026](https://mzd.gov.cz/tiskove-centrum-mz/jeden-kontakt-mene-cekani-rychlejsi-cesta-k-lecbe-koordinatori-meni-peci-o-onkologicke-pacienty/). Rozdiel oproti 58–61 tis. asi robia nemelanómové kožné nádory (C44) [?] – definíciu MZ som nenašiel |
| Úmrtia na zhubné nádory | **26 865** (2021; 255,8 na 100 tis.; 19,3 % všetkých úmrtí) | [ÚZIS](https://www.uzis.cz/res/f/008447/novotvary2019-2021.pdf). ČSÚ uvádza za rok 2023 „novotvary“ 28 170 úmrtí (25 %) – širšia definícia, nie je to rozpor [?] |
| Štyri najčastejšie nádory | prostata ~7 800, prsník (ženy) ~7 400, hrubé črevo a konečník ~7 200, pľúca ~6 600 nových ročne | [ÚZIS](https://www.uzis.cz/res/f/008447/novotvary2019-2021.pdf) |
| Predpoveď | počet prípadov +16 % v rokoch 2022–2040 | [OECD ČR 2025](https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-cs-2025-1663-v2-en.pdf) |
| Výdavky na onkológiu | na obyvateľa +59 % do roku 2050 (rovnako ako priemer EÚ) | OECD (rovnaký zdroj) |

### Štádium pri diagnóze (koľko ľudí sa chytí včas)
Štádium I+II = „včas, dobre liečiteľné“.

| Nádor | Podiel v štádiu I+II | Zdroj |
|---|---|---|
| Prsník (ženy) | **79 %** | [ÚZIS](https://www.uzis.cz/res/f/008447/novotvary2019-2021.pdf) |
| Prostata | **65 %** | ÚZIS |
| Hrubé črevo a konečník | **43 %** | ÚZIS |
| Pľúca | **18 %** | ÚZIS |
| Pankreas (kohorta, slajdy z konferencie) | až **47 % v štádiu IV**, štádiá 1–2 len 20 % | [Tichopád, NZIP 12/2025](https://www.nzip.cz/data/media/konference-nzip-12-2025/prezentace/2025-12-10-sekce-04c-TIchopad.pdf) – konferenčný slajd, nie oficiálna štatistika [?] |

ÚZIS sám píše: „celkovo je včasná diagnostika zhubných novotvarov v ČR nedostatočná.“

### Prežitie (5-ročné relatívne, diagnóza 2015–2019)
- Pľúca **17 %** (zlepšenie o takmer 6 p. b.); **štádium 1: 62 % vs. štádium 4: 6 %** ([OECD ČR 2025](https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-cs-2025-1663-v2-en.pdf)).
- Zlepšenie oproti 2010–2014: prostata +5 p. b., prsník +4, hrubé črevo +6 (rovnaký zdroj).
- Pokročilé štádiá aj tam, kde skríning existuje: **48 %** hrubé črevo a **16 %** prsník je v štádiu 3–4 (údaj za 2019, OECD).

### Slovenská paralela (pre Maťa)
- Incidencia 2024 (odhad algoritmom z dát poisťovní, nie z registra): **719 na 100 tis.** (1996: 582); úmrtnosť 2024: **258 na 100 tis.**; 5-ročné prežitie 2016–2019: **58–59 %**; najhoršie pankreas **9 %** ([NCZI, 29. 9. 2025](https://nczisk.sk/Documents/aktuality/tlacove_spravy/2025/TS_Vyskyt_zhubnych_nadorov_29092025.pdf)).
- NOR SR (slovenský onkologický register) potvrdené dáta končia rokom 2015, ďalej je to odhad z úhrad poisťovní (rovnaký zdroj) – to je samo o sebe dátová medzera.

---

## 2. Národný onkologický plán (NOP/NOPL) 2030 a čo z neho plynie

- Vláda ho schválila **22. 6. 2022**, je súčasťou európskeho plánu proti rakovine; ciele: prevencia a „najmä“ kvalita života pacientov ([MZ ČR](https://mzd.gov.cz/narodni-onkologicky-plan-cr-2030/)).
- Akčný plán **2025–2027** je druhý z troch; má 4 strategické ciele: účinná prevencia, starostlivosť orientovaná na pacienta (aj paliatíva), **koordinácia celého systému**, vysoký štandard starostlivosti s novými technológiami ([MZ ČR](https://mzd.gov.cz/?p=208932)). Číselné ciele som na webovej stránke nenašiel (sú v PDF prílohách, neotvorené) [?].
- **Metodika „Onkologický patera“** (marec 2026): 5 princípov – dobrý štart, **krátke čakacie lehoty**, **koordinátor**, racionálna decentralizácia, **indikátory kvality**. Dáta o čase do liečby a o zapojení multidisciplinárnych tímov (MDT = konzílium lekárov rôznych odborov, „tumor board“) sa zverejňujú na portáli **indiko.cz** (ČVUT FBMI, ÚZIS, KZP, MZ), od januára 2026 až na úroveň jednotlivých centier ([MZ 24. 3. 2026](https://mzd.gov.cz/tiskove-centrum-mz/kdyz-data-zachranuji-zivoty-cesko-otevira-prvni-data-o-organizaci-onkologicke-pece-v-oblasti-karcinomu-plic-prsu-a-pankreatu/), [MZ 2. 9. 2026](https://mzd.gov.cz/tiskove-centrum-mz/jeden-kontakt-mene-cekani-rychlejsi-cesta-k-lecbe-koordinatori-meni-peci-o-onkologicke-pacienty/)).
- Slajdy konferencie NZIP (12/2025) naznačujú, že **udelenie/odobratie statusu centra môže závisieť od hodnôt indikátorov kvality** – teda centrá majú motiváciu merať a zlepšovať čas do liečby a MDT ([Tichopád](https://www.nzip.cz/data/media/konference-nzip-12-2025/prezentace/2025-12-10-sekce-04c-TIchopad.pdf)) [?] (konferenčný slajd).

### KOC (komplexné onkologické centrá) a regionálne siete
- **15 KOC** ([MZ, 4. 2. 2026](https://mzd.gov.cz/tiskove-centrum-mz/koordinator-onkologicke-pece-klicova-zmena-ktera-zrychli-lecbu-a-muze-zachranit-stovky-zivotu/)); statusy na 2026–2031 podľa výzvy zverejnenej vo Věstníku MZ 11/2025, zoznam k februáru 2026 ([zoznam](https://mzd.gov.cz/wp-content/uploads/2026/02/Seznam-KOCdo-a-KOCde-unor-2026-v.-1.0.pdf) – otvorený len čiastočne [?]). Výzva zdôrazňuje štandardizáciu MDT.
- Každé KOC vedie **regionálnu onkologickú sieť (ROS)** menších nemocníc, ambulancií a praktikov; zmluvy KOC–ROS existujú, ale **pre poskytovateľov v ROS nie sú akreditačné kritériá** ([OECD ČR 2025](https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-cs-2025-1663-v2-en.pdf)). Presne tu (odovzdanie pacienta regionálne pracovisko → KOC) sedí VZP výzva „Cesta pacienta bez ztráty informací“.

---

## 3. Skríning a adresné zvanie VZP

### Čo existuje a aká je účasť
| Program | Kto / ako často | Účasť / výsledok | Zdroj |
|---|---|---|---|
| **Mamografia** | ženy od 45, raz za 2 roky, zadarmo | ~**60 %** žien 50–69 (rok 2022; EÚ 56 %); VZP: nad 60 %, mierne rastie; **442–443 tis.** klientok VZP v 2025; 73 mamografických centier | [OECD ČR 2025](https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-cs-2025-1663-v2-en.pdf), [VZP 24. 6. 2026](https://www.vzp.cz/o-nas/aktuality/zeny-od-45-let-budou-mit-jednodussi-cestu-na-mamograficky-screening), [VZP 25. 9. 2026](https://www.vzp.cz/o-nas/aktuality/ruzovy-rijen-pripomina-prevenci-proti-rakovine-prsu-na-mamograf-slo-vloni-pres-440-tisic-klientek-vzp) |
| **Kolorektálny** (hrubé črevo) | od 45 do 74; test okultného krvácania (TOKS/FIT) každé 2 roky alebo kolonoskopia raz za 10 rokov | **29 %** vo veku 50–74 (2022; EÚ 42 %); MZ: „takmer 30 %“ nad 50; 600–700 tis. testov ročne. Riaditeľ VZP v marci 2026 hovorí o „asi 40 %“ – rozpor, definície sa líšia [?] | [OECD](https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-cs-2025-1663-v2-en.pdf), [MZ 2024](https://mzd.gov.cz/tiskove-centrum-mz/prevence-na-prvnim-miste-nove-screeningove-programy-a-uspechy-v-boji-proti-rakovine/), [e15 30. 3. 2026](https://www.e15.cz/finexpert/servis/novy-reditel-vzp-se-zameri-na-reorganizaci-v-planu-je-zmena-onkologickych-screeningu-1431768) |
| **Cervikálny** (krčok maternice) | cytológia ročne od 15; HPV test pri 35, 45 a od 2024 aj 55 | **74 %** žien 20–69 za 3 roky; nad 2 mil. cytológií ročne | OECD, MZ 2024 |
| **Pľúca** (nízkodávkové CT) | pilot od 1. 1. 2022; fajčiari 55–74 r., ≥20 cigariet denne ≥20 rokov; cez praktika/pneumológa | VZP do Q1 2026: **43 735** oslovených, **29 278** pristúpilo, **631** rizikových nálezov; NSC: 3,2 % pozitívnych uzlíkov, **polovica zachytených nádorov v 1. štádiu** | [VZP 28. 7. 2026](https://www.vzp.cz/o-nas/aktuality/screening-rakoviny-plic-absolvovalo-od-jeho-spusteni-temer-30-tisic-klientu-vzp-jen-vloni-to-bylo-14-tisic), [reakcia NSC a odborných spoločností](https://www.zdravotnickydenik.cz/app/uploads/2026/02/reakce-nsc-a-odbornych-spolecnosti.pdf) (obhajoba programu po kritickom článku, berte ako stranu programu) |
| **Prostata** | pilot od 1/2024, muži 50–69, pozýva praktik/urológ; PSA, potom MRI | prvý v EÚ, pilot aspoň 5 rokov; čísla o účasti som nenašiel [?] | [MZ 2024](https://mzd.gov.cz/tiskove-centrum-mz/prevence-na-prvnim-miste-nove-screeningove-programy-a-uspechy-v-boji-proti-rakovine/), OECD |

Slabé miesta pľúcneho pilotu (OECD, stav polovica 2024): nízke zapojenie praktikov, nízka účasť po odoslaní od praktika, treba informačnú kampaň ([OECD](https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-cs-2025-1663-v2-en.pdf)). Od 2027 má odosielať aj iný lekár než praktik/pneumológ [?] (len z výsledku vyhľadávania, neoverené).

### Adresné zvanie VZP – ako funguje a čo to dáva
- Od **2014** VZP posiela **list poštou** poistencom, ktorí na prevenciu nechodia a nie sú liečení pre daný nádor; vyberá podľa dátumu narodenia, aby sa vyrovnala kapacita centier. Webstránka VZP spomína len list, **nie SMS, e-mail ani aplikáciu** ([VZP – adresné zvanie](https://vzp.cz/pojistenci/prevence/projekt-adresneho-zvani-na-onkologickou-prevenci)).
- 2016: **1 011 919 listov** (750 tis. kolorektál, 293 tis. prsník, 325 tis. krčok). Mamografia Jan–Nov 2016 vs. 2013: +5 %, kolorektál +13 % ([VZP 2017](https://www.vzp.cz/o-nas/aktuality/treti-rok-adresneho-zvani-diky-dopisum-chodi-na-onkologickou-prevenci-o-desitky-tisic-lidi-vice)).
- **Mamografia 2014:** 318 360 pozvaných → 61 967 prišlo = **19,5 %**; úspešnosť klesala v priebehu roka z **26,1 % (január) na 12,6 % (december)**, VZP to spája s odznením mediálnej pozornosti ([VZP 2015](https://www.vzp.cz/o-nas/aktuality/kazda-5-pozvanka-uspela-na-mamograf-loni-prislo-o-120-tisic-zen-vice-nez-pred-sedmi-lety)).
- **Mamografia 2024 (podklad výzvy, PDF zo Slacku):** 292 176 pozvánok; účasť po prvom oslovení 44,5 %, celková účasť po adresnom pozvaní **18,9 %**, pri opakovane oslovovaných mnoho rokov len **3,2 %**; všetkým sa posiela rovnaká komunikácia (pozri `docs/research/04-slack-vyzvy-a-pravidla.md` §1.1).
- OECD: osobné pozvánky zvýšili účasť „skromne“ po 2014, najmä u prvoúčastníkov. Pilot poslania HPV samoodberových súprav poštou (~5 000 žien 50–65 r.) mal odozvu **len 7 %**; pri 3. pilote bola odozva o 8 p. b. vyššia pri priamom poslaní ako cez pozvánku ([OECD](https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-cs-2025-1663-v2-en.pdf), Box 2).
- **Slovensko:** na pozvanie poisťovne reaguje len **21–22 %** ľudí (NOI, 19. 10. 2023) – takmer rovnako ako v ČR ([TASR](https://www.teraz.sk/zdravie/skrining-rakoviny-moze-zachranit-ro/748832-clanok.html)).

### Čo sa mení práve teraz (dôležité pre výzvu VZP #1)
- Od **1. 7. 2026** môže žena 45+ v odôvodnených prípadoch prísť na mamograf **bez žiadanky** (stratená žiadanka, nemá praktika/gynekológa, reaguje na pripomienku centra). VZP spravila online kontrolu nároku. VZP očakáva (zástupca ministerského výboru) **+5 až 8 percentuálnych bodov** účasti. VZP upozorní na blížiaci sa termín cez **Moje VZP** (priamu rezerváciu termínu stránka nepopisuje) ([VZP 24. 6. 2026](https://www.vzp.cz/o-nas/aktuality/zeny-od-45-let-budou-mit-jednodussi-cestu-na-mamograficky-screening)).
- Riaditeľ VZP (marec 2026): pozvánky chce presunúť z listov do aplikácie, **kalendár poskytovateľa sa má otvoriť priamo pacientovi** (najprv kolorektál) ([e15](https://www.e15.cz/finexpert/servis/novy-reditel-vzp-se-zameri-na-reorganizaci-v-planu-je-zmena-onkologickych-screeningu-1431768)). Moje VZP má **2 957 546 používateľov** (1. 4. 2026); funkcie pripomienok a rezervácií stránka o aplikácii nespomína ([VZP 22. 4. 2026](https://www.vzp.cz/o-nas/aktuality/aplikace-moje-vzp-bude-mit-vyssi-zabezpeceni-pouziva-ji-uz-3-miliony-klientu)).
- VZP má aj „páky“: **Fond prevence** (napr. 1 000 Kč na rehabilitačné aktivity po screeningu; 135 000 klientov to využilo) a pri vyšetrení mimo veku/častejšie než 1× za 2 roky príspevok 500 Kč (VZP 24. 6. 2026).
- Národné skríningové centrum (NSC pri ÚZIS, Brno) má od 2023 za úlohu zjednotiť skríningové dáta do jedného registra; v príprave je prepojenie s očkovacím registrom a online rezervačný systém [?] (OECD, text ostal nedočítaný).

**Čo z toho plynie:** „ľahkých“ neúčastníčok sa bude zbavovať administratíva (žiadanka, termín); zostane tvrdé jadro (opakovane neodpovedajúce, bez kontaktu so zdravotníctvom, regionálne bariéry). Presne na to sa pýta výzva VZP (predikcia neúčasti → segmenty → intervencia → **overenie A/B testom**).

---

## 4. Čakacie doby a cesta pacienta

| Čo | Číslo | Zdroj |
|---|---|---|
| Pľúca: začiatok liečby do 8 týždňov od CT | **viac ako 60 % pacientov NEZAČNE** do 8 týždňov; veľké regionálne rozdiely | [MZ 2. 9. 2026](https://mzd.gov.cz/tiskove-centrum-mz/jeden-kontakt-mene-cekani-rychlejsi-cesta-k-lecbe-koordinatori-meni-peci-o-onkologicke-pacienty/), [Tichopád](https://www.nzip.cz/data/media/konference-nzip-12-2025/prezentace/2025-12-10-sekce-04c-TIchopad.pdf) |
| Kolonoskopia po pozitívnom TOKS | priemer **76 dní** (2022); podľa okresu **40–135 dní**; podľa poskytovateľa 34–152 dní | [OECD ČR 2025](https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-cs-2025-1663-v2-en.pdf) |
| Podozrenie na nádor GIT | bežná cesta až **2 mesiace**; s koordinátorom „v rádoch týždňov“ | MZ 2. 9. 2026 |
| Cieľ ministerstva pre „fast-track“ diagnózy | čakanie ideálne **do 2 týždňov** | MZ 2. 9. 2026 |
| Pankreas, štádium IV | len 13–17 % liečených do 4 týždňov, 42–50 % až po viac ako 8 týždňoch | [Tichopád](https://www.nzip.cz/data/media/konference-nzip-12-2025/prezentace/2025-12-10-sekce-04c-TIchopad.pdf) [?] slajd |
| Sledovanie čakacích dôb | OECD: „nie sú systematicky sledované a vyhodnocované“; čas sa dnes meria od **prvého zobrazovacieho vyšetrenia**, presnejšie ho umožnia eŽádanky | OECD, [MZ 24. 3. 2026](https://mzd.gov.cz/tiskove-centrum-mz/kdyz-data-zachranuji-zivoty-cesko-otevira-prvni-data-o-organizaci-onkologicke-pece-v-oblasti-karcinomu-plic-prsu-a-pankreatu/) |

Čakanie na CT/MRI všeobecne: regionálne rozdiely a oficiálny cieľ som nevedel overiť z aktuálneho zdroja (nájdený ČT24 je z 2018) [?].

### Koordinátor onkologickej starostlivosti (nová rola 2026)
- Od januára 2026 min. 1 v každom KOC; **250 Kč za výkon koordinácie** hradí verejné poistenie; odhad nákladov „nižšie desiatky miliónov Kč ročne“; na ČVUT prebehli 2 školenia pre ~140 záujemcov. Nerozhoduje o liečbe, **hľadá, či sú výsledky a podklady kompletné, zabezpečuje termíny a odovzdávanie informácií, pomáha s podkladmi pre MDT**. Koordinačné aplikácie sa **pilotne testujú v niektorých KOC**, pripravuje sa **zdieľaný prehľad pracovísk a kapacít** (hlavne zobrazovacích metód). Čísla o počte koordinátorov ani o výsledkoch zatiaľ nezverejnené ([MZ 2. 9. 2026](https://mzd.gov.cz/tiskove-centrum-mz/jeden-kontakt-mene-cekani-rychlejsi-cesta-k-lecbe-koordinatori-meni-peci-o-onkologicke-pacienty/)).
- Minister: potenciál „zachrániť stovky životov ročne“ – je to odhad, nie meranie ([MZ 4. 2. 2026](https://mzd.gov.cz/tiskove-centrum-mz/koordinator-onkologicke-pece-klicova-zmena-ktera-zrychli-lecbu-a-muze-zachranit-stovky-zivotu/)).

### Čo VZP skutočne chce od výzvy „Cesta pacienta“
Zo zadania VZP: vytiahnuť z dostupnej dokumentácie kľúčové údaje, upozorniť na **chýbajúce podklady**, ujasniť **kto je zodpovedný za ďalší krok**; **nemá nahrádzať rozhodovanie lekárov umelou inteligenciou** ([VZP – Rakathon](https://www.vzp.cz/o-nas/aktuality/vzp-se-stava-hlavnim-partnerem-rakathonu-soutezicim-otevre-tri-realne-vyzvy-ceskeho-zdravotnictvi)).

---

## 5. eHealth: čo existuje a čo to znamená pre nás

| Prvok | Stav | Zdroj |
|---|---|---|
| Zákon | novela **236/2025 Sb.** (mení 325/2021 Sb.), väčšina ustanovení platí od **1. 1. 2026** | [dauc.cz](https://www.dauc.cz/predpisy/6195/236-2025-sb), [Právní prostor](https://pravniprostor.cz/zmeny-v-legislative/vyslo-ve-sbirce-zakonu/novela-zakona-o-elektronizaci-zdravotnictvi) |
| **eŽádanka** | pilot od 2. 1. 2026; **vystavovať je dobrovoľné, ale zariadenie ju musí prijať**, ak ju pacient prinesie (okrem technických prekážok); typy: zobrazovacie (CT, RTG, MR, USG), rehabilitácia, konziliárne (typicky onkológia); laboratórna mala prísť v polovici 2026; platí 3 roky; vidno ju v EZKarta; termín povinnosti **nestanovený** | [Naše zdravotnictví](https://nasezdravotnictvi.cz/aktualita/centralni-system-elektronickeho-zdravotnictvi-se-spousti-1-ledna-2026-co-se-zmeni), [Zdravé zprávy 28. 11. 2025](https://www.zdravezpravy.cz/2025/11/28/e-zadanky-vystavi-doktori-od-ledna-2026-jen-na-nektera-vysetreni/) |
| **Sdílený zdravotní záznam (SZZ)** | emergentný záznam (krvná skupina, alergie…) + výsledky preventívnych a skríningových vyšetrení; pacient môže odmietnuť; **žiadne centrálne úložisko** – dáta ostávajú u lekárov, existuje len „Index“ (zoznam, kde dokument je) | Naše zdravotnictví, Právní prostor |
| Portál/aplikácia | eZdravi.gov.cz, EZKarta; „Index prevence“ v EZKarta plánovaný od 1. 5. 2026 | Naše zdravotnictví |
| **EHDS** (európsky priestor zdravotných dát) | nariadenie prijaté začiatkom 2025; české termíny a orgán pre sekundárne využitie dát som nenašiel; NCEZ má pracovný balík „príprava implementácie EHDS“ [?]. Z vlastných znalostí: používa sa postupne od 2027 do 2031 – **neoverené z nájdených zdrojov** | [Právní prostor](https://pravniprostor.cz/clanky/spravni-pravo/nova-era-digitalniho-zdravotnictvi-co-prinasi-evropsky-prostor-pro-zdravotni-data-ehds), [NZIP k09-p01](https://www.nzip.cz/data/koncepce2025/k09-p01.pdf) |
| Interoperabilita (stav z 2019!) | „centrálna infraštruktúra neexistuje, lokálne riešenia spolu v zásade nekomunikujú“; väčšina nemocničných IS podporuje národný štandard DASTA, HL7 sa vo veľkom nepoužíva; očakával sa prechod na IHE/HL7 | [Ekonomický deník 2019](https://ekonomickydenik.cz/centralni-infrastruktura-neexistuje-lokalni-reseni-spolu-v-zasade-nekomunikuji-takze-je-cas-vybudovat-nejaky-jednotici-prvek-rika-sef-it-z-uzis) – staré, dnešný stav [?] |

**Čo z toho plynie:** (1) nestavať vlastný register ani vlastnú eŽádanku (zhoduje sa s radou expertov z pre-hack dňa v `00-SUHRN.md`); (2) vstup aj výstup riešenia robiť cez **HL7 FHIR/IHE** a nechať dáta u pôvodcu; (3) dáta o eŽádankách umožnia presnejšie merať čakacie doby – skutočné prepojenie s onkológiou je zatiaľ len „typicky konziliárna žiadanka“; reálne adopčné čísla eŽádanky po januári 2026 som nenašiel [?].

---

## 6. Paliatíva a koniec života

| Ukazovateľ | Číslo | Zdroj |
|---|---|---|
| Ročne zomiera v ČR | ~**110 000** ľudí; asi **65 000** z nich potrebuje nejakú formu paliatívnej starostlivosti; ~**20 000** výrazne profituje zo špecializovanej | [MZ/ÚZIS/ČSPM 2025](https://mzd.gov.cz/wp-content/uploads/2025/04/Analyticka-cast-Strategie-rozvoje-paliativni-pece-v-CR-do-roku-2025.pdf) |
| Miesto úmrtia (všetci chronicky chorí/očakávateľné úmrtia) | lôžka akútnej a následnej starostlivosti: **ČR 62 %** (DE 49 %, AT 51 %, NL 24 %); sociálne zariadenia 11 % (NL 37 %); **doma 26 %** (NL 45,5 %) | rovnaký zdroj |
| Onkologickí pacienti (staré dáta 2011–2013) | okolo troch štvrtín úmrtí na lôžku zdravotníckeho zariadenia (ÚZIS, zomrelí v 2013, N = 27 084); ČSPM uvádza ~63 % onkologických pacientov na lôžkach akútnej/následnej starostlivosti, 9 % v hospici, 18 % doma; 75 % pacientov (nie nutne len onko) bolo v posledných 3 mesiacoch života aspoň raz hospitalizovaných | [ÚZIS slajdy](https://www.uzis.cz/system/files/2017-01-19-Paliativni-pece-MZ-06-Slama-Svacara-Posledni-hospitalizace.pdf), [ČSPM situačná analýza](https://paliativa.cz/sites/default/files/2019-09/situacni-analyza-paliativni-pece.pdf) – údaje zo vyhľadávacieho zhrnutia, dokumenty som celé nečítal; staré, čerstvé onko-špecifické číslo som nenašiel [?] |
| Paliatívna starostlivosť u terminálnych onkologických pacientov | podľa OECD (zdroj ÚZIS 2024) **>80 %** v roku 2022 dostalo nejakú paliatívnu starostlivosť | [OECD ČR 2025](https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-cs-2025-1663-v2-en.pdf) |
| Dáta o starostlivosti doma na konci života | „v ČR v roku 2025 **nie sú systematicky zbierané**“ | MZ/ÚZIS/ČSPM 2025 |
| Kapacity dnes → cieľ 2035 (návrh stratégie) | mobilné špecializované tímy (MSPP) 71 → 157; konzultačné nemocničné tímy 32 → 200; ambulancie 76 → 314; lôžka hospicov 5 → 10 na 100 tis. obyv.; potreba paliatívy +86 % do 2050 | [MZ – vízia a ciele, júl 2026](https://mzd.gov.cz/wp-content/uploads/2026/07/Vize-a-cile-Strategie-rozvoje-paliativni-pece-v-CR-do-roku-2035.pdf) |
| Úhrady | domáca paliatíva v štandardných úhradách od 2017, nemocničné tímy od 2023 | OECD ČR 2025 |
| **Náklady posledného roka života** | **nenašiel som** reprezentatívne české číslo (jeden starší zdroj tvrdí, že dáta nie sú dostupné); stratégia hovorí len kvalitatívne, že „ad hoc“ akútna starostlivosť je drahšia | [?] |

Existuje **Národná dátová základňa paliatívnej starostlivosti** (paliativnidata.cz, údaje o mieste úmrtia a pod.) – stránku som nevedel otvoriť (chyba spojenia), takže jej obsah a prevádzkovateľa neviem potvrdiť [?]. VZP v zadaní výzvy chce **populačné indikátory** (intenzita protinádorovej a akútnej starostlivosti, počet hospitalizácií, zapojenie paliatívy, čas mimo nemocnice) – **nie hodnotiť jednotlivých pacientov ani lekárov** ([VZP – Rakathon](https://www.vzp.cz/o-nas/aktuality/vzp-se-stava-hlavnim-partnerem-rakathonu-soutezicim-otevre-tri-realne-vyzvy-ceskeho-zdravotnictvi)).

---

## 7. Kto čo platí (a čo by reálne kúpili)

### 7.1 Peniaze v systéme
| Položka | Číslo | Zdroj |
|---|---|---|
| Rozpočet VZP | **viac ako 300 mld. Kč ročne**; plán 2026 prebytok 12,7 mld., no k 2/2026 odhad deficitu 10,9 mld. do konca roka (rozporné vyjadrenia) [?] | [e15/ČTK 30. 3. 2026](https://www.e15.cz/finexpert/servis/novy-reditel-vzp-se-zameri-na-reorganizaci-v-planu-je-zmena-onkologickych-screeningu-1431768) |
| Onkologická starostlivosť VZP | **23,68 mld. Kč** v 2024 (~332 800 klientov) | [VZP 13. 5. 2025](https://www.vzp.cz/o-nas/aktuality/vzp-s-kolorektalnim-karcinomem-se-leci-temer-kazdy-desaty-onkologicky-pacient) |
| Rakovina prsníka VZP | 2025: **59 044** klientok, **3,64 mld. Kč**; 2021: 55 024 / 2,25 mld. – náklady +62 %, pacientky +7 %, na pacientku ~41 tis. → ~62 tis. Kč (náš prepočet) | [VZP 25. 9. 2026](https://www.vzp.cz/o-nas/aktuality/ruzovy-rijen-pripomina-prevenci-proti-rakovine-prsu-na-mamograf-slo-vloni-pres-440-tisic-klientek-vzp) |
| Kolorektál VZP | 2024: 31 296 pacientov, 2,29 mld. Kč (~73 tis. Kč na pacienta, náš prepočet) | [VZP 2025](https://www.vzp.cz/o-nas/aktuality/vzp-s-kolorektalnim-karcinomem-se-leci-temer-kazdy-desaty-onkologicky-pacient) |
| Koordinátor | 250 Kč za výkon, ~desiatky mil. Kč ročne | [MZ 2. 9. 2026](https://mzd.gov.cz/tiskove-centrum-mz/jeden-kontakt-mene-cekani-rychlejsi-cesta-k-lecbe-koordinatori-meni-peci-o-onkologicke-pacienty/) |
| VZP inovácie | **až 300 mil. Kč** na 2027 (predpoklad – rozpočet 2027 ešte nie je schválený) | [VZP 21. 9. 2026](https://www.vzp.cz/o-nas/aktuality/vzp-otevira-dvere-technologickym-inovacim-v-medicine-pomohou-pacientum-i-v-diagnostice-pohlidaji-organizaci-pece-a-vysi-vydaju) |
| Nemocnice – úhrady | každoročne sa dojednáva bodová hodnota a pravidlá (úhradová vyhláška, rokovania VZP–nemocnice o 2027 ešte prebiehajú); klasifikácia **CZ-DRG** (systém zaraďovania hospitalizácií do skupín podľa nákladov) pre 2027 má 1 772 skupín | [NZIP 06/2026](https://www.nzip.cz/data/media/20260615-uhrady/02-04-bortlicek.pdf) [?] čiastočné; podrobnosti DRG→platba som neoveril |
| Pozvánky: cena za list | **nenašiel som** [?] | – |

### 7.2 VZP Inovačný portál (najdôležitejšie)
- **Čo:** riadený vstup technológií do úhrad: AI v diagnostike, vzdialené monitorovanie pacienta, nové modely organizácie starostlivosti ([VZP 21. 9. 2026](https://www.vzp.cz/o-nas/aktuality/vzp-otevira-dvere-technologickym-inovacim-v-medicine-pomohou-pacientum-i-v-diagnostice-pohlidaji-organizaci-pece-a-vysi-vydaju)).
- **Ako:** online návrh na portáli → interná komisia VZP → externá komisia (odborné spoločnosti, MZ, pacientske organizácie, akadémia, mladí lekári) → **dočasná úhrada 6–24 mesiacov**, potom trvalá úhrada, štandardný legislatívny proces alebo koniec. Štandardne do **120 dní**, „fast track“ do **90 dní**.
- **8 povinných podmienok:** klinická bezpečnosť, ochrana osobných údajov, kybernetická bezpečnosť, jasná klinická zodpovednosť, dostupnosť dát na vyhodnotenie, pripravenosť poskytovateľa… + hodnotenie prínosu (klinický, ekonomický, dopad na dostupnosť a organizáciu, merateľnosť, súlad s prioritami VZP).
- **Filter „5 %“:** plynulý vstup vyžaduje preukázateľnú priamu úsporu aspoň 5 % za rok (analýza dopadu na rozpočet – BIA) pri zachovaní/zlepšení výsledkov; VZP to opisuje ako vstupný filter, nie automatické pravidlo ([inovace.vzp.cz](https://inovace.vzp.cz)).
- **Kto žiada:** výrobcovia a dodávatelia, výskumné a akademické inštitúcie, konzorciá; **poskytovatelia (nemocnice) zatiaľ nie**, ostávajú partnermi pre klinickú validáciu; žiadateľ **musí mať klinického partnera** ([Hlavinka](https://www.vzp.cz/o-nas/aktuality/hlavinka-digitalni-technologie-uz-pouzivame-je-na-case-naucit-se-hodnotit-jejich-prinos)).
- **Onkológia je prvá tematická výzva** (štvrťročne od 1. 11. 2026; FAQ: „od októbra 2026“ [?]). Čakajú sa **~100 žiadostí ročne** (v Nemecku DiGA 7 000–8 000), riaditeľ VZP by bol spokojný s „desiatkami nových nástrojov“ po prvom roku a očakáva, že **viac návrhov bude zamietnutých než prijatých**.
- **Úprimné upozornenie:** VZP kladie dôraz na *digitálnu medicínu*; **organizačné/procesné technológie môžu prísť až neskôr** (Hlavinka). Náš nástroj pre koordináciu by sa mohol zaradiť skôr ako „nový model organizácie starostlivosti“ – či ho VZP v prvej výzve prijme, **neviem [?]**. Treba si prečítať Metodiku riadeného vstupu v. 1.0 (PDF na portáli), ktorú som nečítal.

### 7.3 Kto je kupec (zhrnutie)
| Typ riešenia | Pravdepodobný platca | Existuje peňažná linka? |
|---|---|---|
| Nástroj pre koordinátorov / odovzdanie pacienta KOC ↔ región, MDT podklady | KOC (nemocnice) z platieb za koordináciu (250 Kč/výkon), VZP cez inovačnú výzvu | **Áno** (koordinátor od 1/2026; inovačný portál) |
| Pozvánky/pripomienky skríningu, predikcia neúčasti | VZP (vnútorný rozpočet na prevenciu; rozhoduje sa inak než pri „produkte“) | Čiastočne (Moje VZP, Fond prevence); platba za nástroj nejasná [?] |
| Telemedicína, PROMs, sledovanie nežiaducich účinkov | zatiaľ **nikto systematicky** („väčšinou nehradené“ – VZP) | Cez inovačný portál po dočasnej úhrade |
| AI v zobrazovaní | zatiaľ bez mechanizmu úhrady (VZP) | Cez inovačný portál |
| Indikátory kvality na konci života | VZP/MZ (analytika, plánovanie stratégie), nie nemocnica | Skôr interný/analytický rozpočet [?] |
| Trial matching | nemocnice (výskum), farma ako sponzor štúdií | Nenašiel som priamu linku [?] |

Ostatní platcovia: **farma** – sponzoruje klinické štúdie (v ČR >480 aktívnych komerčných štúdií, >16 000 pacientov ročne podľa vyhľadávania, URL nepotvrdená [?]); priamy nákup digitálnych nástrojov od farmy som nedoložil [?]. **Štát/EÚ** – granty (napr. projekt Standardizace paliativní péče z OP Zaměstnanost+, [MZ](https://mzd.gov.cz/wp-content/uploads/2026/07/Vize-a-cile-Strategie-rozvoje-paliativni-pece-v-CR-do-roku-2035.pdf)).

---

## 8. Existujúce riešenia a ich medzery (ČR a SK)

| Oblasť | Čo už existuje | Medzera |
|---|---|---|
| Skríningové pozvánky | list VZP od 2014; pripomienka v Moje VZP (3 mil. používateľov); mamografické centrá posielajú SMS pripomienky; NSC buduje jednotný register | rovnaká správa pre všetkých, žiadne cielenie ani meranie A/B; priama rezervácia termínu z aplikácie sa len pripravuje |
| Koordinácia a odovzdanie pacienta | koordinátori v 15 KOC (od 1/2026); pilotné koordinačné aplikácie v „niektorých KOC“ (dodávateľov som nenašiel [?]); portál indiko.cz meria čas do liečby a MDT; eŽádanky | nie je štandardný nástroj; podklady sú nesúrodé (roztrieštené IS), dokumentácia z ROS do KOC sa stráca; zdieľaný prehľad kapacít len v príprave |
| MDT / tumor board | KOC povinné MDT; Asseco MedWorks je všeobecný nemocničný IS (zmienka o onkologickom module nenájdená [?]) ([Asseco](https://ce.asseco.com/cz/reseni/poskytovatele-zdravotni-pece/nemocnicni-informacni-system/medworks-445/)); podiel MDT na indiko.cz **môže odrážať len vykazovanie, nie realitu** (autor, ÚZIS/FBMI) | ručná kompletizácia podkladov; chýba jednotný „podklad + zápis“ |
| AI v zobrazovaní | **Carebot** (český startup; AI druhé čítanie mamografie + RTG hrudníka; „stovky zariadení“ v 8 európskych krajinách + Vietnam, UAE; kolo >1,5 mil. € v júli 2026; úhrada nepotvrdená) ([Lupa](https://www.lupa.cz/aktuality/ceska-ai-hledajici-rakovinu-je-ve-stovkach-nemocnic-na-rozvoj-nasla-nove-miliony/)); **Waltrovka (EUC) + OZP**: pacientka si môže vyžiadať dodatočné AI hodnotenie ([cc.cz](https://cc.cz/umela-inteligence-zacne-v-dubnu-v-cesku-hledat-nadory-prsu-poprve-ji-v-zemi-zamestnaji-naostro/)) | chýba mechanizmus úhrady (VZP priznáva) |
| Telemedicína / vzdialená starostlivosť | **MEDDI hub** (viac ako 5 000 lekárov v CZ/SK/HU/Lat. Amerike; v ČR nie je štandardne hradené, na Slovensku áno – online ambulancia hradená poisťovňou) ([businessinfo](https://www.businessinfo.cz/clanky/meddi-hub-digitalizuje-zdravotni-peci-a-setri-pacientum-cas/), [Forbes](https://forbes.cz/stredoevropsky-unikat-cech-na-slovensku-spustil-online-kliniku-hrazenou-pojistovnou/)) [?] | onkologické sledovanie (príznaky, nežiaduce účinky) s úhradou v ČR nenájdené [?] |
| Trial matching | register klinických hodnotení (SÚKL/EÚ), MOÚ skúšal programy na vyhľadávanie pacientov (2020, detaily nenájdené); na Slacku je tím „Trialink“ | komerčná česká platforma nenájdená [?] |
| Koniec života – dáta | Národná dátová základňa paliatívnej starostlivosti (neoverená [?]); ÚZIS dáta z hospitalizácií; analytická časť stratégie | domáca starostlivosť na konci života nie je systematicky zbieraná; chýbajú indikátory „agresívnej“ starostlivosti pri smrti na úrovni populácie |
| Pacientska navigácia | organizácie pacientov (Hlas onkologických pacientov, projekt „Cesta pacienta“) a práve vznikajúci koordinátori ([iPrima CNN](https://cnn.iprima.cz/novinka-pro-pacienty-s-rakovinou-pomuze-jim-onkologicky-koordinator-co-bude-delat-503353)) | pacient dostane navigáciu len v KOC, nie predtým (na „predsunutých“ pracoviskách – pneumológia, gastroenterológia – len pilotne) |

### Slovenské paralely
- **OnkoAsist (NCZI):** systém na riadenie cesty onkologického pacienta od symptómov po liečbu vrátane skríningu, pilot pre pľúca, hrubé črevo, prsník; cieľ skrátiť cestu z **>160 na 60 dní** ([TASR 2023](https://www.teraz.sk/zdravie/k-liecbe-rakoviny-sa-ludia-dostanu-po/641984-clanok.html)); odhad hodnoty ~**11 mil. € bez DPH** (verejné obstarávanie, 4. predĺženie lehoty v máji 2023) ([TASR 19. 5. 2023](https://www.teraz.sk/slovensko/nczi-onkoasist-by-mohol-byt-lacnejsi/715535-clanok.html)). Víťaza ani dnešný stav som nenašiel [?]. Zo Slacku vieme, že mentor Asseca pracuje na projekte „Onkologická cesta pacienta pre NCZI SK“ (`04-slack-vyzvy-a-pravidla.md`, MDT Copilot) – Asseco teda pozná slovenský ekvivalent problému, čo pravdepodobne súvisí so zadaním MDT Copilot (moja domnienka [?]).
- **Skríning SK:** účasť na mamografii ~**29–30 %** (v certifikovaných centrách len **16 %** v 2023, OECD) oproti ČR ~60 %; poisťovne (VšZP, Dôvera, Union) pozývajú, odozva 21–22 %; Národné skríningové centrum zriadené 1/2026; pľúca a prostata v príprave ([TASR 11. 2. 2026](https://www.teraz.sk/zdravie/odbornici-upozornuju-na-rezervy-v-onk/940271-clanok.html), [OECD SK 2025](https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-sk-2024-1683-en.pdf)).
- **Slovenský register:** NOR SR bol dlho spracúvaný ručne; od 2023 nový IS + algoritmus z dát poisťovní ([NCZI 2025](https://nczisk.sk/Documents/aktuality/tlacove_spravy/2025/TS_Vyskyt_zhubnych_nadorov_29092025.pdf)).
- **Moja poznámka pre Maťa (radiačná ochrana):** pľúcny skríning (nízkodávkové CT) a mamografia sú pod dozorom (u nás SÚJB kontroluje akreditované pracoviská pľúcneho skríningu – podľa NSC). Trh pre „dávkový“ nástroj som nehľadal [?] – nie je to súčasť zadania.

---

## 9. Čo to znamená pre výber výzvy (môj názor, nie fakt)

Kritériá „kupovateľnosti“, ktoré vyplynuli z VZP a MZ: (1) už existuje **vyhradená peňažná linka**, (2) napojenie na **eŽádanku/FHIR**, nie vlastný register, (3) merateľný efekt (čas do liečby, ≥5 % úspora), (4) **klinický partner**, (5) bezpečnosť a ochrana dát, (6) **nenahrádza lekára**.

| Výzva | Kupec a peniaze | Čo hovoria dáta | Riziko |
|---|---|---|---|
| **VZP – Cesta pacienta bez ztráty informací** (+ MDT Copilot, PACS Comparator) | KOC (250 Kč/výkon koordinácie), VZP (inovačná výzva); jasný dopyt – koordinátori nemajú štandardný nástroj | >60 % pľúc. pacientov mimo 8-týždňového okna; dokumentácia sa stráca; zadanie VZP presne pomenúva (chýbajúce podklady, zodpovednosť za ďalší krok) | konkurencia (MEMOyA – Ostrava); dáta pre tú výzvu zatiaľ neznáme; prijatie organizačného nástroja do VZP výzvy [?] |
| **VZP – Od pozvánky k mamografu** | VZP; najbližšie k „vnútornému projektu“ než k produktu; VZP sa už pohybuje smerom k appke + otvorenému kalendáru | konverzia pozvánok ~19 % dlhodobo (ČR aj SK); tvrdé jadro opakovane neodpovedajúcich (3,2 %); +5–8 p. b. už očakávaný od zmeny 1. 7. 2026 | VZP robí analytiku aj interne; náš prínos = cielenie + **meraný experiment**; hodnota jedného ďalšieho mamogramu nie je v zdrojoch [?] |
| **VZP – Kvalita péče na konci života** | VZP/MZ (stratégia 2035 potrebuje indikátory); platiteľ skôr analytický než produktový | 62 % úmrtí v nemocnici vs. 24 % NL; chýbajú dáta o domácej starostlivosti | nie je to nástroj, ktorý by zaplatila nemocnica; pitch je silný príbeh, „predajnosť“ nižšia |
| MEDDI ONCO, FNMH (NÚ, trial matching) | nemocnice/farma; úhrada nejasná | – | bez priameho platiteľa [?] |

**Čo by sa dalo povedať v pitchi s číslom a zdrojom (pre Bruna):**
- „Viac ako 60 % pacientov s rakovinou pľúc nezačne liečbu do 8 týždňov od CT.“ (MZ ČR, 2. 9. 2026)
- „Od januára 2026 má každé z 15 komplexných onkologických centier koordinátora – za 250 Kč za výkon. Softvér pre nich ešte neexistuje.“ (MZ ČR 2. 9. 2026)
- „Každý piaty pozvaný príde na mamograf – a tak je to už 10 rokov.“ (VZP 2015: 19,5 %; 2024: 18,9 %)
- „V ČR 62 % ľudí zomiera v nemocnici, v Nizozemsku 24 %.“ (MZ/ÚZIS/ČSPM 2025)
- „VZP od 21. septembra platí za overené digitálne nástroje v onkológii – až 300 mil. Kč na 2027.“ (VZP)

---

## 10. Otvorené otázky [?] a čo som nevedel overiť

1. Presné číselné ciele NOP 2030 a akčného plánu 2025–2027 (sú v PDF prílohách, neotvorené).
2. Aktuálne **čakacie doby na CT/MRI** (zdroj ČT24 je z 2018); medián dní do liečby podľa centier z **indiko.cz** (portál sa nezobrazuje bez JavaScriptu – obsah som nevidel).
3. Náklady posledného roka života v ČR; obsah a prevádzkovateľ paliativnidata.cz.
4. Metodika riadeného vstupu inovácií v. 1.0 (PDF na inovace.vzp.cz) – či pripustí organizačné nástroje a aké presné podmienky platia pre onkologickú výzvu (dátum 1. 11. vs. október).
5. Skutočný stav adopcie eŽádanky a sdíleného záznamu po 1/2026; české termíny EHDS.
6. Dodávatelia pilotných koordinačných aplikácií v KOC; či existuje komerčný český trial-matching nástroj.
7. Stav a dodávateľ OnkoAsist (SK) dnes; Asseco onkologický modul pre ČR.
8. Cena za adresný list VZP a hodnota jedného dodatočného mamogramu (potrebné pre „obchodný prípad“ výzvy #1).
9. Rozpor v číslach o účasti na kolorektálnom skríningu (29 % OECD vs. ~40 % VZP) a o ročnej incidencii (58–61 tis. vs. >90 tis.).

## Zdroje, ktoré sa nepodarilo plne prečítať
- Prezentácia „Koordinovat je slušnost“ (MZ, 02/2026) a časť slajdov Tichopáda – PDF s obrázkami, text neextrahovateľný; použité len čitateľné časti.
- Zoznam KOC (február 2026) – iba čiastočne.
- paliativnidata.cz – spojenie zlyhalo.
