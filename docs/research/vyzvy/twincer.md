# Praha – Twincer / Cancer Twin (Fuck Cancer): hĺbková analýza

_Stav: piatok 16. 10. 2026, po 16:30. Pre Bruna a Maťa (nie ste technici, čítajte ako príbeh). Odborné pojmy sú vysvetlené v zátvorke. Pri číslach je zdroj. Značky: **[V]** = číslo/fakt som videl priamo v zdroji, **[S]** = sprostredkovaný zdroj (správa, súhrn v našom researchu 07/08/09), **[prepočet]** = moje vlastné jednoduché počty, **[pamäť]** = z mojej pamäti, tento beh som to neoveril, **[?]** = neisté alebo si zdroje protirečia. Nič som nevymýšľal; čo nie je isté, je označené._

_Obmedzenie behu: limit webového vyhľadávania (spoločný pre všetkých agentov) sa vyčerpal skôr, než som stihol urobiť čo i len jeden dotaz. Preto je časť 3 (dôkazy) a 4 (trh) postavená na existujúcom researchu (07, 08, 09) a na priamych načítaniach konkrétnych stránok (NCI, EÚ plán proti rakovine, GLOBOCAN, webstránky organizácií a konkurentov, výročná správa Fuck Cancer). Odborné štúdie o peer podpore som k dispozícii nemal (PubMed a Europe PMC sa nenačítali), takže tvrdenia o účinnosti sú opatrné a označené. Ak chcete dôkazy hlbšie, treba spustiť ďalší beh._

---

## 0. Verdikt na jednej obrazovke

- **O čom to je:** Pacientska organizácia Fuck Cancer (založili ju mladí onkologickí pacienti) chce aplikáciu „Cancer Twin“: človek s rakovinou si pod prezývkou (bez e-mailu) vyplní krátky zdravotný dotazník, aplikácia mu nájde niekoho s **podobnou skúsenosťou** (rovnaká diagnóza, podobné štádium, rovnaká liečba, podobný vek) a obaja si môžu písať alebo diktovať. **AI automaticky prekladá**, takže partner môže byť „aj na druhom konci sveta“. Druhá časť: **AI zo súhlasných rozhovorov vytiahne, čo pacienti riešia a čo im chýba**, a ukáže to anonymne (v súhrnoch) lekárom, pacientskym organizáciám a výskumu.
- **Najsilnejšie stránky:** (1) **Žiadny tím** (stav živej tabule dnes, 0 tímov); zadávateľ sám vyberá sobotného víťaza a víťaz každej výzvy ide do nedeľného finále. (2) **Najpodrobnejšie zadanie zo všetkých výziev, čo sa týka vzhľadu aj pravidiel**: schválené obrazovky, všetky texty v češtine a angličtine, číselník 24 diagnóz, zadanie šiestich prehľadov a 12 testov. Nemusíme nič vymýšľať, len to dobre postaviť. (3) **Najlepší príbeh a video** zo všetkých výziev („Nemusím na to byť sám. Aj na druhom konci sveta.“). (4) Zadávateľ je kreatívna, mediálne zdatná organizácia, čo je Brunovo remeslo.
- **Najväčšie slabiny:** (1) **Nikto za to nezaplatí v rozsahu, ktorý by uživil produkt**: Fuck Cancer je malý spolok (príjmy 2025 asi 2,9 mil. Kč, 0,24 úväzku zamestnancov), žiadna poisťovňa ani nemocnica nemá na „peer chat“ peniaze. (2) **Žiadne reálne dáta** (pravidlá hackathonu ich zakazujú; všetko je syntetické). (3) Dôkaz o zdravotnom prínose je slabý a nedá sa „zmerať v číslach“ ako pri mamografe. (4) V nedeľnom finále bude porota (platca, ministerstvo, nemocnice) pravdepodobne tlačiť na tvrdé čísla, a tie tu nemáme. (5) Rozsah zadania je veľký (aplikácia + AI preklad + analytika + súhlasy + testy).
- **Môj návrh produktu:** „**Cancer Twin: prvá verzia**“ = mobilná webová aplikácia presne podľa schválených obrazoviek (2 okná vedľa seba: Češka a Japonka si píšu, každá vo svojom jazyku) + **Insight Studio** (6 prehľadov z 200 syntetických rozhovorov, ochrana malých skupín, testy K01–K12 s výsledkom „12 z 12“). Detail v časti 5.
- **Skóre:** vážený priemer **5,3 / 10** (priemer medzi výzvami = 5). Je to **výzva s najľahšou cestou do finále, ale s najslabšou cestou k peniazom.** Detail v časti 7.
- **Môže pražský tím túto výzvu zvoliť?** **Áno.** Je to jedna z 12 pražských výziev na formulári (kapitán potvrdí do **19:00**). Žiadne obmedzenie nikde nie je.
- **Kedy ju vybrať:** ak je cieľ **istý postup do nedeľného finále + silný príbeh/video + práca, ktorú vieme urobiť do 11:00**. **Kedy nie:** ak je cieľ produkt, za ktorý niekto zaplatí (poisťovňa, nemocnica) alebo pilot s VZP; vtedy sú lepšie výzvy Cesta pacienta, MEDDI alebo mamograf (pozri ostatné súbory v `docs/research/vyzvy/`).

---

## 1. Presné zadanie

### 1.1 Kto a odkiaľ
- **Zadávateľ:** Fuck Cancer, z. s. (pacientska organizácia, Praha). Verejný popis: podporuje pacientov, spája organizácie, šíri osvetu; má portál **Xko** (adresár pomoci: mapa, blog, kalendár), uzavretú Facebook skupinu **Fuck Cancer Cartel** pre pacientov a prežívajúcich („Heroes“) a „Soldiers“ (podporovatelia bez rakoviny). [V – https://fuckcancer.cz/ , https://x.fuckcancer.cz/]
- **Ľudia:** **garant David Foldyna** (predseda spolku, kreatívny riaditeľ v reklamnej agentúre [S, 09]); podklady do Slacku posiela **Petr Novák**. V tabuľkách sa spomína vývojár **Zdeněk Cholévu** (technické rozhodnutia o tokoch dát) – nie je isté, či bude na Rakathone [?]. [V – Slack #twincer; Príloha 3, list „Prehled“ P09 a O03]
- **Mentori:** **žiadny nie je pridelený.** Zoznam mentorov v #02-dotazy (12:38) uvádza pri Twincer len Davida Foldynu; rakathon.cz píše, že mentori sa predstavia v piatok ráno, mená neuvádza. Petr Novák v #07-hledam-mentora (10:17) sám píše, že Fuck Cancer **hľadá mentorov, ktorí pomôžu s vylepšením aplikácie**; odpoveď nedostal (žiadne vlákno). [V – Slack]
- **Kanál `#twincer`:** v kanáli je **iba päť správ s prílohami od Petra Nováka** (PDF + tri tabuľky). **Žiadne otázky, žiadne odpovede, žiadne vlákna.** Do kanála vstúpili členovia tímov MediBit (zvolili Cesta pacienta), VI KA (zvolili Hlídač NÚ), „walking legs“ (zatiaľ nič nezvolili) a jeden človek z firmy xavalabs (tím neznámy [?]). [V – Slack, prečítané celé]

### 1.2 Čo je v zadaní (oficiálny popis)
Verejný popis na rakathon.cz: **anonymná chatovacia aplikácia, ktorá pomocou AI spája onkologických pacientov podľa diagnózy, štádia a liečby; preklad v reálnom čase má zrušiť jazykovú bariéru; riešenie má obsahovať aj modul, ktorý z anonymizovaných rozhovorov vyťahuje najčastejšie témy a potreby pre lekárov, psychológov a pacientske organizácie.** Hodnotiace kritériá pre túto výzvu rakathon.cz neuvádza, cena špecifická pre Twincer **neexistuje**. [V – https://rakathon.cz/]

Podrobnejšie je zadanie v prezentácii „Cancer Twin“ (11 slidov, obrázkové PDF; pozn.: je to „grafická korektúra v09“, teda pracovná verzia) a v troch tabuľkách. Prečítal som všetko:

**A) Aplikácia pre pacienta (slidy 3–8, tabuľka „Texty“)**
1. **Princíp:** „Bez e-mailu. Pod prezývkou. S kontrolou nad vlastnými dátami.“ Profil, obľúbení a história sú **v telefóne**; pri strate telefónu o ne človek príde.
2. **Štyri kroky:** Profil → Nájdenie zhody → Rozhovor → Ďalšie stretnutie (pridať si človeka medzi obľúbených).
3. **Profil v 5 krátkych obrazovkách** („veľké voľby, údaje sa dajú neskôr upraviť“): O mne (jazyk, prezývka, krajina, veková skupina, pohlavie nepovinné) → Diagnóza (hľadať/vybrať, pôvodné miesto nádoru, štádium nepovinné, „neviem / nechcem uviesť“) → Liečba (pred / v / po liečbe; operácia, chemoterapia, ožarovanie, hormonálna, cielená, imunoterapia, iná) → Rozhovor (s kým chcem hovoriť: niekto v podobnej situácii / po liečbe / bez preferencie; jedna veta o sebe, návrh 80 znakov) → Pomoc ostatným (súhlas s analytikou, **dobrovoľný a oddelený od chatu**).
4. **Zhoda (matching) v troch úrovniach:** Supermatch (rovnaká diagnóza, porovnateľné štádium, podobný vek) → Rovnaká diagnóza (iná fáza choroby) → Spoločná skúsenosť (podobné miesto pôvodného ochorenia alebo rovnaký druh liečby). **Krajina nerozhoduje, pohlavie je dobrovoľná preferencia, vždy sa ukáže dôvod odporúčania.** Percento má vyjadrovať zhodu vyplnených údajov. [V – slide 5] **Pozor, vnútorný rozpor:** tabuľka s textami (pravidlo R13) hovorí, že číslo v % sa smie ukázať **len z vysvetleného výpočtu a s dostatkom údajov**, inak „zobrazovať overené dôvody bez percent“. V demu preto ukážeme dôvody vždy a % len s odkazom „ako sa to počíta“.
5. **Rozhovor:** písanie alebo **diktovanie** (prepis sa pred odoslaním skontroluje), **čítanie nahlas** (AI hlas, nie napodobenina hlasu pacienta), **AI preklad s možnosťou „zobraziť originál“**, veľkosť písma (Bežná / Väčšia / Najväčšia), zvuk predvolene **vypnutý**. Obľúbiť, nahlásiť, zablokovať, zmazať lokálnu históriu.
6. **Bezpečnostné texty:** „O zmenách liečby sa poraď so svojím ošetrujúcim tímom.“ „Preklad môže obsahovať nepresnosti.“ Nahlásenie: obťažovanie, spam/podvod, **nebezpečné rady**, iné; pred odoslaním vidí používateľ, čo sa pošle.

**B) Analytika pacientských skúseností (slidy 9–10, Príloha 3 – 9 listov)**
1. **Tri cieľové skupiny**: lekári a tímy starostlivosti; pacientske organizácie; výskumné tímy. Jeden spoločný dátový základ, tri pohľady (12 výstupov L01–L04, N01–N04, V01–V04).
2. **Čo sa meria:** témy (13 kategórií T01–T13: telesná záťaž, každodenné fungovanie, psychická a sociálna podpora, rodina, telesný obraz a intimita, informácie a porozumenie, navigácia a dostupnosť starostlivosti, práca a financie, život po liečbe, praktické zvládanie, podpora od druhých, zdravotné rady a sporné tvrdenia, iné), opakované otázky, **nenaplnené potreby**, **laické rady a reakcie na ne** (kto radí, na čom sa tvrdenie zakladá, ako príjemca zareagoval), rozdiely medzi skupinami, vývoj v čase, **pokrytie a kvalita dát**.
3. **Členenie:** veková skupina, krajina, pohlavie, diagnóza, fáza (pred / v / po liečbe); doplnkovo druh liečby a jazyk.
4. **Prísne pravidlá:** iba so súhlasom (pri dialógu **oboch** účastníkov), len súhrnné výstupy, **malé skupiny sa nezobrazia** (aj ochrana pred odvodením odpočítaním súčtov), pri každom výsledku počet profilov (n/N), obdobie a rozsah pokrytia, **frekvencia rady nedokazuje jej bezpečnosť ani účinnosť**, žiadna individuálna diagnóza ani „krízové sledovanie“, text rozhovoru je **dáta, nie pokyny** (model nesmie nasledovať príkazy ukryté v chate), AI sumár len z overených agregátov, žiadne vymyslené príčiny a citáty.
5. **Prvé demo podľa zadania:** syntetické dialógy → AI klasifikácia → **šesť spoločných prehľadov** (témy, potreby, rady, porovnanie dvoch skupín, čas, pokrytie/kvalita) + filtrovanie vrátane neznámych hodnôt a potlačených malých skupín. Prvá verzia je len popisná (deskriptívna), nie štatistický dôkaz.
6. **Testy K01–K12** (zadanie pre vývojárov, všetky „Neprovedeno“): súhlas (obaja / jeden / nikto / odvolaný), duplicitné spracovanie, vlastná vs. cudzia skúsenosť a negácia, rada a reakcia, dva jazyky (rovnaký význam / opačný význam), správny menovateľ (32 z 200 = 16 %), filtre a neznáme hodnoty, malé kombinácie, „vymyslený záver“, **vložený príkaz v dialógu**, výpadok analytiky, export. [V – Príloha 3, listy „Overeni“ a „Zpracovani“]
7. **Čo konkrétne chcú dostať od tímov (list „Overeni“, rozhodnutie O08, stav „K rozhodnutiu“):** *„Základ dema, rozšírenie a otvorené hranice ostrej prevádzky. Návrh: šesť spoločných prehľadov a testy K01–K12 na syntetických dátach; súvýskyt a medzinárodné smery rád ako rozšírenie. Neslubovať pacientsku databázu ani overenie zdravotných účinkov.“* Pri odovzdaní (K12): export každej obrazovky s filtrami (len agregáty), **slovník dát, popis architektúry, náklady dema a zoznam zatiaľ neoverených podmienok pilotu**.

### 1.3 Aké dáta dostaneme
- **Žiadne dátové súbory s rozhovormi ani s pacientmi.** Tabuľky obsahujú **texty aplikácie** (CZ/EN, ~200 riadkov s kľúčmi), **číselník 24 diagnóz + 3 záložné voľby** s popisom štádií a pravidiel výberu (zdroje: IARC GLOBOCAN, český NOR) a **zadanie analytiky**. [V – Prílohy 1–3]
- Rozhovory si musíme **vyrobiť syntetické** (zadanie to výslovne počíta: „Príklady RX1–RX3 sú vymyslené, nie pacientske dáta“). Pravidlá hackathonu zakazujú neverejné dáta pacientov. [V – Prílohy; INTRO Praha slide „Pravidlá v kocke“]
- **Lacná výhoda:** texty aj diagnózy môžeme načítať **priamo z tabuliek** do aplikácie (bez prepisovania), čo zadávateľ ocení ako vernosť návrhu.

### 1.4 Aký výstup chcú a podľa čoho sa hodnotí
- **Odovzdanie (spoločné pre všetky výzvy):** sobota 17. 10. **13:00 (tvrdý deadline)** na `submit.rakathon.cz`: názov + popis do 140 znakov, popis AI a dopadu, **povinný titulný obrázok 16:9 do 8 MB**, odkazy na GitHub/demo/video. [V – INTRO Praha]
- **Hodnotenie v sobotu:** 14:00–16:00 **zadávateľ obchádza tímy** (na Twincer teda David Foldyna alebo jeho zástupca [?]), o 16:00 nahlási víťaza, 17:00 vyhlásenie; **víťaz výzvy ide do nedeľného finále** (14:00, Kampus Plzeňská, Praha 5 – Motol). Kritériá: **1. AI technológia a prevedenie, 2. využiteľnosť v praxi u zadávateľa, 3. inovatívnosť**; v nedeľu pribudne **4. škálovateľnosť, 5. kvalita prezentácie a tímu**. Váhy sú neznáme [?]. [V – INTRO Praha; 09]
- **Pre túto výzvu zadávateľ žiadne vlastné váhy nezverejnil.** Reálnym „hodnotiacim zoznamom“ sú preto jeho vlastné požiadavky v tabuľkách (vyššie 1.2–1.4) a schválené obrazovky.
- **Cena:** špecifická cena pre Twincer **nie je**. Dá sa ísť po hlavných cenách (100/50/25 tis. Kč), **Cene hackerov** (hlasujú účastníci, masterclass PitchPerfect.cz za 30 000 Kč; príbeh tu môže zabrať), a **InterSystems 1 500 €** (kombinovateľné s ľubovoľnou výzvou), pozri 5.7. [V – INTRO Praha]
- **Dĺžka pitchu:** oficiálne neuvedená; odhad ~5 minút na tím vrátane otázok [?]. Pre nás: 3 minúty + otázky (zadanie od vás).

### 1.5 Čo v zadaní nie je jasné [?]
- Či sa od tímov čaká **celá aplikácia** (profil, zhoda, chat) alebo hlavne **AI časti** (preklad a analytika). Verejný popis hovorí o oboch; slidy popisujú aplikáciu veľmi podrobne. Bezpečná odpoveď: postaviť oboje, ale v jednoduchej forme.
- Či zadávateľ pri jedinom tíme **musí** vyhlásiť víťaza (nikto sa nepýtal).
- Aké jazyky má demo ukázať (tabuľky majú len CZ a EN; „ďalšie jazyky nie sú preložené“).
- Definície krajiny a pohlavia, veková hranica, kto smie vidieť výstupy (všetko označené „K rozhodnutiu“ v liste Overeni).

---

## 2. Koncový používateľ (myslieť ako ten človek)

### 2.1 Primárny používateľ: človek s rakovinou (alebo po liečbe)
Používateľ nie je „pacient v systéme“, je to **Lucie, 41 rokov, Praha, dve deti**, tri týždne po diagnóze rakoviny prsníka, v utorok má prvú chemoterapiu.

**Jej deň (a noc):**
- **Ráno** v ambulancii má **desať minút** s onkológom, ktoré použije na dve otázky z tridsiatich. Odíde s hŕbou papierov a slovami, ktorým nerozumie. [pamäť, bežná skúsenosť; presné čísla o dĺžke ambulancie v ČR nemáme]
- **Doma** manžel hovorí „bude to dobré“, kamarátky sa vyhýbajú téme, mama plače. Nikto z nich **nezažil presne toto**.
- **O druhej v noci** je hore a googlí. Nájde príbehy, ktoré sú horšie než jej situácia, aj ponuky „zázračných“ liekov. Chce **jediné**: nájsť niekoho, kto je o šesť mesiacov ďalej, má **rovnakú diagnózu a rovnakú liečbu**, a povie jej: „Takto to zvládam ja. Toto ma prekvapilo.“ Nie lekárske rady, ale **pocit, že v tom nie je sama**. To je presne to, čo Fuck Cancer sľubuje („Nemusím na to byť sám“).
- Pri **vzácnejšej diagnóze alebo v malej krajine** takého človeka v Česku nenájde: existuje ich pár desiatok ročne (pozri 3.4, ilustračný prepočet). Preto nápad s **prekladom**.

**Ďalší používatelia v tej istej skupine:** 60+ pacient, ktorý ovláda telefón len základne (preto veľké voľby, nastaviteľné písmo, ticho predvolene, päť krátkych krokov); mladý dospelý (Fuck Cancer vznikol okolo mladých pacientov [V, výročná správa 2025]) s ostychom zdieľať pravé meno; **blízky človek** (partner, rodič), ktorý hľadá niekoho v podobnej situácii (zadanie hovorí o „Heroes a ich blízkych“).

**Prečo dnešný stav zlyháva (konkrétne):**
1. **Podpora je „v čase kancelárie“, strach je v noci.** Linka Amelie (česká organizácia pre onkologických pacientov) beží **denne 9:00–15:00**. [V – https://www.amelie-zs.cz/]
2. **Skupiny sú lokálne a ľudia sú „zmiešaní“.** Osobné stretnutia fungujú pre Prahu, ťažko pre vzácnu diagnózu alebo pre človeka, ktorý nie je mobilný. Amelie má centrá v Prahe, Rakovníku, Olomouci a Liberci [V]. Organizácia Mamma HELP (ženy s rakovinou prsníka) **skončila činnosť 30. 6. 2020** [V – https://www.mammahelp.cz/]. Komunitné organizácie v ČR sú krehké.
3. **Facebook skupiny** (aj samotná Fuck Cancer používa uzavretú skupinu „Cartel“ [V]) nemajú **zhodu podľa diagnózy/štádia/liečby**, nemajú **preklad**, identita býva spojená s reálnym účtom [pamäť] a obsah je hlučný a nemoderovaný odborne.
4. **Fóra a komunity** vo svete sú **jazykové silá**: napríklad Carenity (500 tis. členov) má verzie FR, EN, ES, DE, IT, **českú nemá** [V – https://www.carenity.com/]. Čech so vzácnou diagnózou má teda malý rybník.
5. **Dnes nikto nevidí, čo pacienti naozaj potrebujú.** Fuck Cancer zbiera príbehy a otázky ručne (osvetové akcie, členská skupina). Strategický prehľad (čo sa opakuje, čo chýba) **neexistuje**.

### 2.2 Sekundárni používatelia: kto číta výstupy analytiky
- **Psychoonkológ / sestra / lekár v komplexnom onkologickom centre** (zadanie L01–L04): chce vedieť „na čo sa mám pýtať“ a „čomu pacienti nerozumejú“. Jeho deň: 15–25 pacientov, každý 10–20 minút [pamäť, [?]]. Potrebuje **jednu stranu s tromi vetami a číslami**, nie 40 grafov.
- **Programový manažér pacientskej organizácie** (zadanie N01–N04): rozhoduje, aký článok, video alebo stretnutie urobí zajtra a o čo požiada sponzora. Dnes to robí „z pocitu“.
- **Výskumný tím** (V01–V04): hľadá výskumné otázky o kvalite života a podpornej starostlivosti. Chce **poctivú metodiku** (n/N, neznáme hodnoty, nulová prísľuba kauzality).

### 2.3 Čo je pre tohto používateľa „jednoduché“
Podľa schválených obrazoviek: **päť krokov, veľké tlačidlá, žiadny e-mail, žiadne telefónne číslo, žiadne heslo, tlačidlo „Preskočiť“**, výber podľa slov („Niekto v podobnej situácii“), nie podľa lekárskych kódov. Jeden vstup na obrazovke, tlačidlo „Zvuk: vyp.“ a „Aa“ stále dostupné. To treba zachovať aj v našom demo.

---

## 3. Dôkazy o probléme (svet + ČR)

### 3.1 Koľko ľudí sa to týka
| Ukazovateľ | Hodnota | Zdroj |
|---|---|---|
| Svet: nové prípady rakoviny (odhad 2024) | **20 636 441** | GLOBOCAN 2024 (IARC), súhrnná strana sveta [V] – https://gco.iarc.who.int/media/globocan/factsheets/populations/900-world-fact-sheet.pdf |
| Svet: úmrtia | **9 762 507** | rovnaký zdroj [V] |
| Svet: ľudia, ktorí žijú do 5 rokov po diagnóze („5-ročná prevalencia“) | **54 244 091** | rovnaký zdroj [V] |
| Európa: ľudia, ktorí rakovinu prežili | **viac ako 12 miliónov** | EÚ plán proti rakovine, kap. 6 [V] – https://health.ec.europa.eu/system/files/2022-02/eu_cancer-plan_en_0.pdf |
| ČR: nové prípady za rok | **58 461** (2021, bez nemelanómových kožných); MZ ČR hovorí „viac ako 90 tis.“ (asi vrátane kožných) | ÚZIS https://www.uzis.cz/res/f/008447/novotvary2019-2021.pdf [S, 08]; MZ ČR 2. 9. 2026 https://mzd.gov.cz/tiskove-centrum-mz/jeden-kontakt-mene-cekani-rychlejsi-cesta-k-lecbe-koordinatori-meni-peci-o-onkologicke-pacienty/ [S, 08] |
| ČR: ľudia, ktorí s rakovinou žijú | **viac ako 600 tis.** | MZ ČR (rovnaký odkaz) [S, 08] |
| Fuck Cancer: členovia | **1 466** (z toho 748 riadnych), stav 31. 12. 2025; portál Xko si zaregistrovalo ďalších **250+** organizácií a jednotlivcov | Výročná správa 2025 [V] – https://www.fuckcancer.cz/files/vyrocni-zprava-2025.pdf |

### 3.2 Aký je problém (stres a nenaplnené potreby)
- **Skoro polovica ľudí s rakovinou hlási veľa stresu** a približne štvrtina „veľkú úzkosť“; podľa NCI sa to v priemere nelíši podľa typu rakoviny. Skupinová podpora je medzi liečbami spájanými s **nižšou depresiou a úzkosťou, menej príznakmi a väčšou nádejou**. (Strana NCI naposledy aktualizovaná 14. 5. 2025.) [V – https://www.cancer.gov/about-cancer/coping/feelings/anxiety-distress-pdq] (pozn.: ide o súhrnnú odbornú stránku, nie o štúdiu peer chatu)
- **EÚ plán proti rakovine** výslovne uvádza medzi **najčastejšími problémami prežívajúcich „nenaplnené psychosociálne potreby“, emočný stres, zlú koordináciu a návrat do práce**, a hovorí, že sa treba sústrediť nie na „ako dlho“, ale na „**ako dobre a ako dlho**“ ľudia žijú. [V – EÚ plán, kap. 6 (citované: zhrnutie vlastnými slovami)]
- **Národný onkologický plán ČR 2030** (schválený 22. 6. 2022) má medzi cieľmi „najmä kvalitu života pacientov“. [S – 08, §2; https://mzd.gov.cz/narodni-onkologicky-plan-cr-2030/]
- **Priamo o prínose „peer“ rozhovorov:** Cancer Hope Network (USA; viac ako 680 vyškolených mentorov, 60 tis. obslúžených) uvádza **pokles distresu o 3,5 bodu na 10-bodovej stupnici NCCN** – ale ide o **vlastné sebahlásené údaje organizácie**, nie nezávislú štúdiu. [V – http://cancerhopenetwork.org/] V odbornej literatúre sú podľa mojej pamäti pri peer podpore v onkológii **malé až stredné zlepšenia a veľká nejednotnosť štúdií** **[pamäť, neoverené v tomto behu, vyžaduje overenie]**.
- **Nepriamy dôkaz, že psychosociálna podpora sa dá zmerať:** v štúdii skorej paliatívnej starostlivosti (profesionálny tím, NEJM 2010, pacienti s rakovinou pľúc) bola kvalita života **98,0 vs. 91,5**, depresia **16 % vs. 38 %**, agresívna starostlivosť na konci života **33 % vs. 54 %**. Pozor: ide o **profesionálnu starostlivosť, nie peer chat**; berieme to len ako dôkaz, že psychosociálna podpora **má zmerateľný efekt**. [V – 07, B8; https://doi.org/10.1056/NEJMoa1000678]
- **Poctivá medzera:** nenašiel som (a nemal som ako hľadať) overené číslo, **koľko stojí osamelosť/stres v onkológii** v peniazoch alebo koľko životov. Preto v pitchi **netvrdíme úsporu ani predĺženie života** (zadanie samo hovorí: „Neslubovať overenie zdravotných účinkov“). **[?]**

### 3.3 Koľko to stojí (čas, peniaze, životy)
- **Čas/peniaze systému:** žiadne spoľahlivé číslo pre túto konkrétnu oblasť. Všeobecne: ekonomický dopad rakoviny v EÚ je viac než 100 mld. € ročne (EK/ECA) [S – 07, Z4]. Podiel pripadajúci na psychosociálne problémy neviem **[?]**.
- **Životy:** priame zníženie úmrtnosti peer podporou **nie je doložené** [?]; neslubovať.
- **Hlavný „náklad“ je ľudský:** kvalita života a duševné zdravie, čo je presne to, o čom hovorí Fuck Cancer a NOP 2030. Pitch preto stojí na príbehu a na transparentnosti, nie na úspore.

### 3.4 Prečo je dôležitý preklad (ilustračný prepočet)
Predstavme si diagnózu, ktorá tvorí **1 % všetkých rakovín**. V ČR je to pri ~58 000 nových prípadoch ročne ~580 ľudí. Ak hľadáte niekoho s **rovnakým štádiom (~25 %)** a **podobným vekom (~25 %)**, ostane **~36 ľudí za rok na celú republiku**; z toho len časť je zrovna teraz v rovnakej fáze liečby a ochotná písať. Vo svete (20,6 mil. nových prípadov) to je pri rovnakých pomeroch **~12 900 ľudí za rok**, čiže asi **350× viac**. [prepočet; ilustračný, podiely 1 %, 25 %, 25 % sú **moje predpoklady**, nie dáta; princíp: preklad zväčšuje „rybník“ o rád veľkosti]

### 3.5 Čo hovorí „Rakathon 2025“
Víťazné projekty minulého roka boli **úzke klinické problémy s merateľným prínosom** (3D registrácia CT pri rádioterapii; predikcia recidívy rakoviny prsníka) [01, 09]. **Twincer má iný charakter** (komunita a skúsenosť pacienta), preto sa nedá obhájiť rovnakým typom čísel. To je hlavné riziko pri hodnotení v nedeľu (kritérium „využiteľnosť v praxi“ a „dopad“).

---

## 4. Existujúce riešenia na trhu

| Riešenie | Čo robí | Čísla | Kto platí | Čo robí zle / čo chýba |
|---|---|---|---|---|
| **Cancer Hope Network** (USA) | Ľudský párovač: vyškolený mentor s podobnou skúsenosťou, 1:1 | **680+ mentorov, 60 tis. obslúžených, 150+ druhov rakoviny, 16+ jazykov mentorov, 60+ nemocníc/partnerov**; udávaný pokles distresu o 3,5 bodu (sebahlásený) [V] | **dary**, firemné sponzorstvo, udalosti [V] | páruje **ľudia ručne** (pomalé, drahé na škálovanie), USA-centrické; bez AI prekladu a bez agregovanej analytiky [?] – http://cancerhopenetwork.org/ |
| **Imerman Angels** (USA) | 1:1 párovanie pacient – „angel“ podľa typu rakoviny a veku | stránka sa nenačítala (502) | neziskovka, dary [pamäť] | nedá sa overiť, v tomto behu **[?]** |
| **Inspire** (USA) | Veľké komunity pacientov, vrátane rakoviny | „milióny pacientov a opatrovateľov“, stovky komunít [V] | partnerstvá so „sponzormi“ (výskum, štúdie) [V]; presný model nie je na stránke uvedený | fórum po téme, nie zhoda 1:1; **jazykové silo**; komerčný pohľad na dáta – https://www.inspire.com/ |
| **Carenity** (FR) | Sociálna sieť pre chronicky chorých, hodnotenie liečby, prieskumy | **500 tis. členov**, 1,49 mil. správ, 81,8 tis. hodnotených liečieb, 300 tis. účastníkov prieskumov [V] | **štúdie pre firemných partnerov** (anonymizované prieskumy a analýzy) [V] | nemá českú verziu; nie je zameraná na onkológiu; nie je zhoda podľa štádia – https://www.carenity.com/ |
| **Smart Patients** (USA) | Online komunity (100+ chorôb vrátane rakoviny) | 100+ komunít; počty členov nie sú uvedené [V] | nezverejnené [V] | opäť fórum bez AI prekladu – https://www.smartpatients.com/ |
| **PatientsLikeMe** (USA) | Platforma, kde pacienti zdieľajú údaje o chorobe | stránka počty ani vlastníka neuvádza [V]; podľa mojej pamäti ju v 2019 kúpila americká poisťovacia skupina (UnitedHealth/Optum) **[pamäť, ?]** | údajové partnerstvá [pamäť, ?] | citlivosť okolo využitia dát (reputácia) [pamäť, ?] – https://www.patientslikeme.com/ |
| **Cancer Chat** (Cancer Research UK) | Plne moderované fórum, „Nová diagnóza“, „Opýtaj sa sestier“ | moderátori **365 dní v roku**, anonymné príspevky [V] | charita (CRUK) [V] | vyžaduje prácu ľudí (moderácia), len v angličtine – https://cancerchat.cancerresearchuk.org/ |
| **Amelie** (ČR) | Bezplatná psychosociálna podpora, poradňa, linka, dobrovoľníci s podobnou skúsenosťou, 4 centrá | počty klientov na stránke nie sú [V] | spolok (granty, dary) [?] | linka **9:00–15:00**; lokálne; bez matchingu a prekladu – https://www.amelie-zs.cz/ |
| **Mamma HELP** (ČR) | pacientky s rakovinou prsníka | **činnosť ukončená 30. 6. 2020** [V] | – | ukazuje krehkosť českých pacientskych organizácií – https://www.mammahelp.cz/ |
| **Xko + FB skupina Cartel** (Fuck Cancer, ČR) | Adresár pomoci (mapa, blog, kalendár), uzavretá FB skupina pre Heroes | Xko +250 registrovaných organizácií a jednotlivcov [V]; Cartel členovia nie sú uvedení | dary a dotácie (pozri nižšie) | **na Xko nie je chat ani peer podpora** [V]; FB skupina bez zhody a bez prekladu – https://x.fuckcancer.cz/ |

**Čo z toho plynie**
- **Kto za to platí vo svete:** **dary a charity** (CHN, CRUK, Fuck Cancer) alebo **farmaceutické/priemyselné štúdie nad anonymizovanými dátami** (Carenity, Inspire). Poisťovňa ani nemocnica za „peer chat“ nezvyčajne neplatí [?]. V ČR ani v EÚ som **nenašiel úhradu ani verejný nákup** takejto služby. [?]
- **Kde je priestor:** (1) **matching s vysvetlením dôvodov** a bez ručného párovania (CHN je ručný), (2) **preklad** (sieť, ktorá rozbíja jazykové silá), (3) **súkromie už pri vstupe** (prezývka, žiadny e-mail, história v telefóne), (4) **bezpečnejšia analytika** s vysvetlenými pravidlami (malé skupiny, súhlas, n/N) namiesto „predaja dát“, (5) **mobilná zjednodušená verzia pre 60+**.
- **Čo urobiť lepšie/rýchlejšie/lacnejšie:** namiesto moderátorov 365 dní ponúknuť **AI predfiltrovanie rizík** (nebezpečné rady, podvody, spam) s ľudským posudzovaním, a namiesto ručného párovania **automatický a vysvetliteľný** matching.
- **Riziko:** **moderácia a bezpečnosť** je tvrdý problém (podvody, falošné diagnózy, rady typu „vysaď lieky“) [pamäť, ?]; preto zadanie samo zakladá nahlasovanie a blokovanie. Pre prototyp je to **testovateľné v demu**, pre ostrý pilot to znamená reálnych moderátorov.
- **Financovanie zadávateľa (relevantné pre „kto za to zaplatí“):** príjmy Fuck Cancer 2025 **2,888 mil. Kč** (2024: 4,324 mil.), z toho tržby (napr. merch) 1,174 mil. Kč, dary 1,264 mil. Kč, dotácie a granty 450 tis. Kč; 11–12 pracovníkov na dohody (výročná správa a účtovná závierka sa líšia o jedného), **prepočítane 0,24 úväzku**; dotácia MZ ČR 300 tis. Kč, Praha 149,9 tis. Kč. Charitatívna večera Rakovíno vyzbierala **viac než 860 tis. Kč „na vývoj novej aplikácie, ktorá zaisťuje informovanosť Heroes a ich blízkych“** (nie je isté, že ide o Cancer Twin [?]); Forbes Gala asi 2,5 mil. Kč na virtuálnu realitu do nemocníc; plán 2026: **„spustiť prvé verzie nových aplikácií pre Heroes a ich blízkych“**. [V – výročná správa 2025]

---

## 5. Najlepší návrh riešenia pre nás

### 5.1 Jedna veta
**„Cancer Twin: nájdi niekoho, kto ti rozumie, aj na druhom konci sveta, a daj lekárom a organizáciám poctivý obraz o tom, čo pacienti naozaj potrebujú.“**

### 5.2 Princípy (aby to bolo MAXIMÁLNE JEDNODUCHÉ)
1. **Presne podľa schválených obrazoviek a textov** zadávateľa (slidy 4–8, tabuľka „Texty“), aby pri obchôdzke videl **svoju vlastnú aplikáciu, len funkčnú**. Texty načítať z `FCK_…Priloha_01_Texty_CZ_EN_v01.xlsx` a diagnózy z Prílohy 2 priamo do kódu.
2. **Päť krokov, jedna vec na obrazovku**, bez e-mailu a hesla (iba prezývka, história v telefóne).
3. **AI robí len to, čo vie robiť bezpečne:** preklad (s originálom po ruke), prepis hlasu, **klasifikáciu rozhovorov do pevnej schémy**, zhrnutie **len z už spočítaných čísel**. **Neradí o liečbe**, nediagnostikuje, nesleduje individuálnu krízu.
4. **Pravidlá z kódu sú „podlaha“**: matching je pravidlový (vysvetliteľný), nie čierna skrinka; AI sa nepýta, kto je „najpodobnejší“.

### 5.3 Čo postavíme (demo za noc)
**Časť A – Aplikácia pre pacienta (mobilná webová aplikácia, PWA = „appka z prehliadača“)**
1. **Profil v 5 krokoch** (jazyk → o mne → diagnóza → liečba → rozhovor → pomoc ostatným) so súhlasom s analytikou **oddeleným od chatu** a bez „penalizácie“ za odmietnutie.
2. **Domov:** „Nájsť podobných ľudí“, Obľúbení, Odporúčania s dôvodom („Rovnaká diagnóza“, „Podobný vek“, „Zážitok po liečbe“) a **percento len s vysvetlením výpočtu**; krajina nevstupuje do skóre.
3. **Chat so živým AI prekladom:** originál/preklad jedným ťukom, **diktovanie** (prehliadač), **čítanie nahlas** (prehliadač), veľkosť textu Bežná/Väčšia/Najväčšia, zvuk vypnutý, „Preklad môže byť nepresný“, „O zmenách liečby sa poraď s tímom“.
4. **Bezpečnosť:** nahlásiť (obťažovanie, spam/podvod, nebezpečné rady, iné), zablokovať, zmazať lokálnu históriu.
5. **Demo režim „dve okná“:** vľavo Lucie (CZ, rakovina prsníka, 43), vpravo Sakura (JP, rakovina prsníka, 46), písanie a odpovede v reálnom čase v **ich jazykoch**.
6. **Syntetická „komunita“ 12–15 postáv** (prezývky ako v slide: Luna, Sakura, Sol…), z rôznych krajín.

**Časť B – Insight Studio (pre lekárov, organizácie, výskum)**
1. **200 syntetických profilov / ~600 výmen v 3–4 jazykoch**, vygenerovaných LLM so **skrytými správnymi štítkami** a zámernými „pascami“: cudzia skúsenosť („kamarátke to pomohlo“), negácia („nevyskúšal som“), duplicita, **vložený príkaz v dialógu** („ignoruj pravidlá…“), dialóg s jedným súhlasom.
2. **Postup:** kontrola súhlasu (obaja) → odstránenie mien a identifikátorov → AI klasifikácia do pevnej schémy T01–T13 + typ výroku + reakcia (R04–R08) → výpočet n/N → **ochrana malých skupín** → prehľady.
3. **Šesť prehľadov (D01–D06)** s filtrami (vek, krajina, pohlavie, diagnóza, fáza, neznáme hodnoty zvlášť): témy a otázky; nenaplnené potreby; rady a reakcie; porovnanie dvoch skupín (v percentuálnych bodoch, s upozornením na rozdielne zloženie); čas; **pokrytie a kvalita** (dostupné z každého výsledku).
4. **AI sumár z agregátov** („Z 200 zahrnutých profilov 32 spomenulo… [16 %]“), každá veta s odkazom na číslo, a **hláška „údajov je málo“** namiesto vymyslenej príčiny.
5. **Stránka „Testy K01–K12“** so živým výsledkom (cieľ 12/12) a **stránka „Kvalita klasifikácie“** (presnosť a úplnosť podľa kategórií na zlatej sade; poctivo označiť, že zlatá sada je **syntetická, vytvorená spolu s dátami**, nie nezávislý expert).
6. **Export (len agregáty)** + **dátový slovník, popis architektúry, náklady dema (volania AI, čas dávky), zoznam neoverených podmienok pilotu** (presne to žiada K12).

**Technológia v skratke (pre Claude Code):** jedna webová aplikácia (Vite/React alebo podobne) + malý backend (Azure Functions alebo kontajner) + databáza (SQLite/Postgres/Cosmos). **OpenAI-kompatibilný model v Azure** pre preklad a klasifikáciu (kľúč len na serveri, retry s exponenciálnym čakaním kvôli zdieľaným limitom, cache prekladov a vopred preložené seed správy ako poistka). **Diktovanie a čítanie nahlas cez prehliadač** (Web Speech API; funguje v Chrome/Safari, nie vo Firefoxe) = bez ďalšej služby; hlasové modely Azure nemusia byť dostupné [?]. Obsah rozhovorov v prompte je **dáta, nie pokyny** (pevná JSON schéma, validácia výstupu). Sekrety do súborov nikdy nedávať.

### 5.4 Čo ukážeme v 3-minútovom pitchi
| Čas | Čo | Prečo |
|---|---|---|
| 0:00–0:20 | **Video (Brunov AI štúdio):** noc, žena v Prahe pri telefóne („nikto mi nerozumie“) → rez na ženu v Osake v rovnakej situácii → titulok „**Niekto, kto vám rozumie. Aj na druhom konci sveta.**“ | emócia hneď na začiatku; jazyk Fuck Cancer |
| 0:20–0:50 | Problém v troch číslach: **skoro polovica pacientov hlási veľa stresu** (NCI); **12+ mil. ľudí v Európe prežilo rakovinu a nenaplnené psychosociálne potreby patria medzi najčastejšie problémy** (EÚ plán); **pri vzácnej diagnóze v malej krajine je človek „sám“** (ilustračný prepočet) | uzemnenie bez prehnaných sľubov |
| 0:50–1:50 | **Živé demo:** Lucie vyplní profil za ~20 s; „Nájsť podobných ľudí“ → karta **Sakura, Japonsko, 40–49 s dôvodmi**; Lucie **nadiktuje po česky**, Sakura vidí japončinu; odpoveď japonsky sa zobrazí česky; ťuk na „Originál“; písmo „Najväčšie“ | hlavný „wow“: preklad naživo + jednoduchosť |
| 1:50–2:30 | **Insight Studio:** z 200 syntetických rozhovorov šesť prehľadov; porovnanie Česko vs. Japonsko (n/N); **malá skupina je potlačená** a vysvetlená; **AI sumár len z čísel**; „vložený príkaz“ v dialógu sa nevykoná | kritérium 1 (AI a prevedenie) a 2 (využiteľnosť, bezpečnosť) |
| 2:30–2:50 | **Dôvera:** súhlas oddelený od chatu, žiadny e-mail, história v telefóne, nahlásenie a blokácia, **testy 12/12**, „neradíme o liečbe“ | porota: platca, ministerstvo, nemocnice |
| 2:50–3:00 | „Pre Fuck Cancer: hotový základ prvej verzie. Pre pacientov: **Nemusím na to byť sám.**“ | kritérium 4 a 5 (pokračovanie, tím) |

### 5.5 Čo musí byť hotové do 11:00 v sobotu (odovzdanie 13:00; rezerva 2 hodiny)
- **P0 (najprv):** profil 5 krokov, matching s dôvodmi, chat s AI prekladom v dvoch oknách, nastavenie písma/zvuku.
- **P1:** syntetické dáta + klasifikácia + prehľady D01–D06 + ochrana malých skupín.
- **P2:** testy K01–K12, stránka kvality, export + dátový slovník + architektúra + náklady.
- **P3:** titulný obrázok 16:9 (do 8 MB), video 60–90 s, popis do 140 znakov, popis AI/dopadu, README.
- **Ak sa nestihne všetko:** radšej **menej obrazoviek, ale dokonale funkčných** (kritérium 1 hodnotí „čo tím reálne vytvoril“).

### 5.6 „Šialený“ ambiciózny variant: **Twin Atlas + Hlas + Insight→Video**
1. **Twin Atlas:** živý svetový glóbus, na ktorom sa **v reálnom čase rozsvecujú anonymné agregáty** (iba súhlasné a nad hranicou malých skupín): „v Japonsku sa v 3. týždni chemoterapie rieši hlavne spánok, v Česku práca a financie“. Pohľad pre lekárov a organizácie.
2. **Hlas z hlasu:** režim „hovoriť a počúvať“: Lucie povie vetu česky, Sakura ju **počuje v japončine** syntetickým hlasom (nie klonom hlasu; zadanie klonovanie hlasu zakazuje), a naopak.
3. **Insight→Video (Brunova silná stránka):** z top „nenaplnenej potreby“ sa automaticky vygeneruje **návrh 30–45 s osvetového videa** pre Fuck Cancer (scenár + AI-vizuály + titulky) s **ľudskou kontrolou** a **bez citátov z reálnych rozhovorov** (zadanie R11: len parafráza po kontrole identifikovateľnosti). Presne to žiada výstup N02 („témy pre články, videá, stretnutia“).
4. **Riziko:** čas (3 veľké veci), zdieľané limity AI, a možný dojem, že sa „predáva príbeh pacientov“ (etika). Preto len ako **bonus po dokončení P0–P2**.

### 5.7 Voliteľne: cena InterSystems (1 500 €)
Dá sa kombinovať s ľubovoľnou výzvou. **Zmysluplné využitie** by bolo: uložiť pseudonymný profil ako **FHIR zdroje** (Patient/Condition so SNOMED/ICD kódmi z číselníka diagnóz; agregáty ako MeasureReport) a použiť **vektorové vyhľadávanie** na hľadanie podobných tém. [06, §3.8] **Moje hodnotenie:** pre jednu noc je to zbytočné riziko; robiť len ak P0–P2 budú hotové do 05:00 **[?]**.

### 5.8 Čo treba spýtať zadávateľa (Slack píšte vy; ja som nič neposielal)
1. Stačí **mobilná webová aplikácia (PWA)**, alebo čakajú natívnu appku?
2. Ktoré **jazyky** chcú v demu vidieť (návrh: CZ, EN, JA, ES)?
3. Môžeme použiť ich **logo a farby** v prototype a na titulnom obrázku?
4. Kto z Fuck Cancer bude **fyzicky v sobotu 14:00** pri obchôdzke?
5. Ako chcú **kód a dáta odovzdať** po hackathone (GitHub, licencia; pravidlá dávajú organizátorovi a partnerom nevýhradnú licenciu)?
6. Ktoré z otvorených rozhodnutí O01–O08 sú pre prvé demo záväzné?

Návrh mentorov z organizátorov: **Bernardo Sunderhus** (Microsoft; frontend, prístupnosť, UX, React) a **Michal Marusan** (Microsoft; AI aplikácie, Azure, GitHub Copilot) sa ponúkli na Slacku a sedia presne na túto výzvu; **Albert Štěrba** (neurochirurg, člen dozornej rady VZP) ponúka overenie, či to rieši skutočný problém z praxe. [V – #07-hledam-mentora]

---

## 6. Konkurencia na hackathone na tejto výzve a či ju pražský tím môže zvoliť

- **Môže?** **Áno.** Twincer je jedna z 12 pražských výziev (9 pražských + 3 VZP). Formulár najprv pýta mesto a potom ukáže výzvy daného mesta. Kapitán potvrdí výzvu do **dnes 19:00** na `submit.rakathon.cz/vyzvy/vybrat`; tím môže mať 2–4 členov, obaja musíte byť fyzicky v Prahe. [V – 05, INTRO Praha]
- **Aktuálny stav (živá tabuľa `submit.rakathon.cz/vyzvy`, prečítaná pri písaní tohto dokumentu): Twincer = 0 tímov** (nikto si ju nevybral; spolu s „Kvalita péče na konci života“ je jediná v Prahe bez tímu). 23 pražských tímov má výzvu, 5 ešte nemá: Ctrl+Alt+CURE, FIT/S, FSMZ (pravdepodobne duplicita k MSFZ), Pražský Meridian, walking legs. [V]
- **Signály záujmu o Twincer:** členovia tímov **VI KA** (2 ľudia) a **MediBit** vstúpili do kanála, ale zvolili si **inú výzvu**; tím **walking legs** vstúpil do kanála 15. 10. o 23:59 a **dnes nemá výzvu** (najpravdepodobnejší konkurent); človek z firmy xavalabs vstúpil o 14:19, tím neznámy [?]. Organizátori majú v zozname ešte 7 pražských tímov, ktoré nie sú na tabuli (Data Team, Junior Scholars, Nexlytics, Panacea, quattro formaggi, radiQA, Risk off). [V – Slack, 05]
- **Odhad do 19:00 [odhad]:** 0 až 2 tímy; základný scenár **1 tím** (približne 50 % pravdepodobnosť, že sa niekto pridá). Technicky je to „chatovacia aplikácia s AI prekladom“, ktorá vyzerá ľahká, preto môže pritiahnuť tím s dobrým frontend vývojárom; analytika a testy sú však náročnejšie a väčšina tímov ich vynechá.
- **Šanca vyhrať výzvu:** pri 0–1 konkurentovi **veľmi vysoká** (zadávateľ rozhoduje v sobotu 16:00; nie je isté, či pri jedinom tíme musí vyhlásiť víťaza [?]). Kľúčové: **kopírovať ich schválený návrh** + dodať analytiku a testy, ktoré zadanie výslovne žiada.
- **Šanca v nedeľnom finále [odhad]:** postup do finále ~80–90 % pri funkčnom demu; víťazstvo vo finále ~**10–20 %**, lebo 12-členná porota (platca VZP, ministerstvo, vládny zmocnenec pre AI, 4 nemocnice, výskum, pacientska organizácia, 3 technologické firmy) bude porovnávať aj s projektmi s tvrdými číslami (čas, peniaze). **Plus:** v porote sedí pacientska organizácia (Hlas onkologických pacientov) a téma „kvalita života“ je v NOP 2030 aj v EÚ pláne. [09]
- **Mentori:** žiadny pridelený, Fuck Cancer ich hľadá (pozri 1.1). **Plus pre nás:** minimálne rušenie; **mínus:** nikto nevie povedať „takto je to správne“. Preto je kľúčová vernosť ich dokumentom.

---

## 7. Skórovanie (1–10; 5 = priemer medzi výzvami; prísne)

| Kritérium (váha) | Skóre | Zdôvodnenie |
|---|---|---|
| **Veľkosť problému** (1) | **7** | Skoro polovica pacientov hlási veľa stresu (NCI); v ČR žije >600 tis. ľudí s rakovinou, v Európe >12 mil. prežívajúcich, vo svete 54 mil. v 5-ročnej prevalencii [V]. Dosiahnuteľná skupina (kto by použil peer chat) je menšia, preto nie 8–9. |
| **Dopad na zdravie** (1,5) | **4** | Ide o kvalitu života a duševnú pohodu, nie o včasnú diagnostiku či prežitie. Dôkaz o účinku peer podpory je v našom behu **slabý/neoverený**, sebahlásený pokles distresu CHN je vlastný údaj organizácie. Riziko škodlivých rád medzi pacientmi. Zadanie samo zakazuje sľubovať zdravotný účinok. |
| **Úspora času** (1) | **2** | Nešetrí čas personálu ani pacienta. Analytika by mohla ušetriť lekárovi pár minút pri príprave na návštevu, ale nie je to merateľné. |
| **Peniaze** (1,2) | **3** | Žiadny platca nemá priamu úsporu. Nepriamy zisk existuje len cez štúdie nad anonymizovanými dátami (Carenity, Inspire), čo je etická citlivá cesta a nie je v zozname príjemcov výstupov (lekári, organizácie, výskum). |
| **Akútnosť bottlenecku** (1,5) | **4** | Dopyt je skutočný, ale úzky: Fuck Cancer má vyzbierané peniaze na apku a plán na 2026 [V], EÚ plán uvádza nenaplnené psychosociálne potreby. Nie je to však akútna prevádzková brzda systému (čakanie na liečbu, strata informácií) a nikto veľký to dnes nekupuje. |
| **Ochota platiť** (1,2) | **3** | Kupec je malý spolok (príjmy 2,9 mil. Kč, 0,24 úväzku), nie poisťovňa ani nemocnica. VZP Inovačný portál žiada merateľné klinické KPI a klinického partnera; peer chat pod to nezapadá [pamäť, ?]. Možné: granty, dary, EÚ projekty, platený analytický modul pre výskum. |
| **Jednoduchosť pre používateľa** (1) | **8** | Schválené obrazovky sú postavené na jednoduchosti: päť krokov, prezývka, žiadny e-mail, nastaviteľné písmo, ticho predvolene. Bariéra: dôvera a nutnosť nainštalovať/otvoriť nový nástroj v ťažkom období. |
| **Dáta na hackathone** (1) | **4** | **Žiadne dátové súbory.** Spec je veľmi podrobný (texty, diagnózy, metriky), ale rozhovory si musíme vyrobiť syntetické a „zlatá sada“ vznikne spolu s nimi. Pravidlá zakazujú reálne dáta pacientov. |
| **Realizovateľnosť dema za 1 noc** (1) | **7** | Chat s AI prekladom, diktovanie a čítanie nahlas v prehliadači, klasifikácia na syntetických dátach a šesť prehľadov je pre Claude Code bežná práca. Riziká: veľký rozsah zadania (aplikácia + analytika + 12 testov), zdieľané limity AI, real-time chat v dvoch oknách. |
| **Wow a príbeh pre pitch/video** (1,2) | **8** | Živý rozhovor Češka–Japonka, každá vo svojom jazyku, plus „vložený príkaz sa nevykoná“ a testy 12/12. Najlepšia emócia a najlepšie video zo všetkých výziev; sedí na Brunove štúdio. Mínus: pre porotu, ktorá chce čísla, môže pôsobiť „mäkko“. |
| **Strategická hodnota partnera a network** (1,2) | **5** | Fuck Cancer: 1 466 členov, mediálny dosah, kreatívny predseda, kontakty na darcov; **bez rozhodovacej moci nad nasadením a peniazmi** (nie platca, nie nemocnica). Pre Bruna 7 [09]. Sedí pacientska organizácia (iná) v nedeľnej porote. |
| **Šanca vyhrať výzvu a ísť do finále** (1) | **9** | **0 tímov na tabuli**; 1–2 možní; zadávateľ rozhoduje v sobotu; jasný „pokyn“ v podobe schváleného návrhu. Odpočet: nie je isté, že zadávateľ musí vyhlásiť víťaza, a nedeľné víťazstvo je ťažšie. |
| **Pokračovanie po hackathone** (0,8) | **6** | Zadávateľ má vyzbierané financie na aplikácie, plán spustiť verzie v 2026, hľadá mentorov a vývojárov, a licencia pre organizátora je automatická. Reálna cesta pre nás: tvorivý/technický partner (pro bono alebo z grantu); žiadny pilot s platcom. |
| **Fit s naším tímom** (0,8) | **6** | Bruno (video, marketing, storytelling) = silný fit a značka zadávateľa je kreatívna (predseda je kreatívny riaditeľ). Maťo (radiačná ochrana, zobrazovanie) = takmer žiadny priamy fit; vie ale pomôcť s „pohľadom zdravotníka“ a kontrolou textov. |
| **Nízke regulačné/klinické riziko** (0,6) | **5** | Nie je to zdravotnícka pomôcka, **ak neradí o liečbe a nediagnostikuje** (kritérium účelu softvéru podľa pokynu MDCG 2019-11 [pamäť, nepodarilo sa overiť, 403]). Ťažšie: zdravotné údaje v súbore „osobitná kategória“ GDPR (výslovný súhlas, EDPB), zraniteľní používatelia, nezletilí (veková hranica nie je rozhodnutá, R05), preklad zdravotných viet, moderácia podvodov a škodlivých rád. Pre prototyp so syntetickými dátami nízke, pre pilot stredné až vysoké. |

**Vážený priemer ≈ 5,3 / 10** (súčet váha×skóre = 84,4; súčet váh = 16,0). Interpretácia: **priemerná výzva, ktorá je mimoriadne bezpečná na postup a slabá na „niekto za to zaplatí“.** Ak by tím chcel výzvu využiť hlavne na istý postup do finále, jeho silné stránky sú konkurencia (9), jednoduchosť (8), wow (8) a realizovateľnosť (7); podmienkou je dodať aj analytiku a testy, nielen chat.

---

## 8. Riziká a otvorené otázky

1. **Rozsah:** zadanie je veľké (aplikácia, preklad, diktovanie, analytika, 12 testov, export, slovník). Bez disciplíny P0 → P1 → P2 sa **nič nedotiahne**. Poistka: P0 hotové do rána, ostatné po kusoch.
2. **Porota chce čísla:** nedeľná porota (platca, ministerstvo, nemocnice) uprednostní merateľný prínos. Poistka: **pitch stojí na dôvere, jednoduchosti a poctivosti** (testy 12/12, kvalita klasifikácie), nie na sľube úspory; rámovať ako **„infraštruktúra pre kvalitu života a pacientsky hlas“ podľa EÚ plánu a NOP 2030**.
3. **Bezpečnosť obsahu:** chat medzi pacientmi môže šíriť **nebezpečné rady** a podvody. V prototype to musíme **ukázať a ošetriť** (nahlásenie, AI predfiltrovanie, „o liečbe sa poraď s tímom“). Pre pilot treba **ľudskú moderáciu 24/7** [?].
4. **Súkromie a analytika:** zdravotné údaje v chate sú citlivé. Zadanie vyžaduje **oddelený, dobrovoľný súhlas oboch účastníkov**, anonymizáciu a ochranu malých skupín; náš prototyp musí **neslubovať absolútnu anonymitu** (spec R04, R09, A17).
5. **Preklad zdravotných viet:** model môže zameniť číslo, lieky alebo negáciu. Poistka: originál vždy po ruke, poznámka o nepresnosti, **test negácie (K05)** a vzorka spätného prekladu.
6. **Rate limity AI:** všetky tímy zdieľajú rovnaký endpoint (HTTP 429). Poistka: cache, **vopred preložené seed správy**, retry s exponenciálnym čakaním, **žiadne API kľúče do súborov ani do prehliadača**.
7. **Konkurencia:** môže prísť 1–2 tímy (hlavne „walking legs“). Odlíšenie: **vernosť zadaniu**, **analytika + testy**, **príbeh a video**.
8. **Zadávateľ je malý:** 0,24 úväzku zamestnancov, vývojár je pravdepodobne externý [?]; po hackathone nemusí byť kapacita na prevzatie. Poistka: **čistý kód, README, slovník dát, architektúra** (K12).
9. **Chýbajúce rozhodnutia (O01–O08):** krajina, pohlavie, interval veku, komu smú byť výstupy dostupné, ako dlho uchovávať. Riešiť na Slacku s Petrom Novákom (nič sme neposlali).
10. **Autorstvo a licencia:** autorstvo zostáva tímu, organizátor a partneri dostávajú bezplatnú nevýhradnú licenciu. Pre prípadné pokračovanie s Fuck Cancer si to treba **dohodnúť osobitne** [09].
11. **Mamma HELP skončila (2020):** pripomienka, že komunitné projekty v ČR sú krehké; pri pitchi nenaznačovať, že „vyriešime“ podporu pacientov, len že dávame **základ prvej verzie**.

---

## 9. Zdroje

**Zadanie a dáta (zadávateľ/organizátor):**
- Slack `#twincer` (C0C80LR7KLJ): všetkých 5 správ s prílohami od Petra Nováka (10:49 PDF, 11:53 Príloha 1, 11:54 Príloha 2, 12:43 Príloha 3), žiadne vlákna ani otázky. Súbory v repe: `docs/materials/slack/twincer/` (PDF „FCK_Rakathon2026_CancerTwin_v09“, tri xlsx).
- Slack `#07-hledam-mentora` (Petr Novák, 10:17: Fuck Cancer hľadá mentorov); `#02-dotazy` (12:38: zoznam výziev, garantov a mentorov: pri Twincer len David Foldyna).
- rakathon.cz (popis Twincer, zoznam 24 výziev): https://rakathon.cz/
- INTRO Praha (kritériá, ceny, harmonogram): `docs/materials/drive/INTRO_Praha_text.md`
- Živá tabuľa tímov: https://submit.rakathon.cz/vyzvy (načítaná pri písaní)

**Fuck Cancer (zadávateľ):**
- Web a projekty: https://fuckcancer.cz/ ; portál Xko: https://x.fuckcancer.cz/ ; skupina „Cartel“ (uzavretá FB skupina, odkaz na webe)
- Výročná správa 2025 (členovia, príjmy, plány 2026, vyzbierané prostriedky): https://www.fuckcancer.cz/files/vyrocni-zprava-2025.pdf ; ďalšie správy: https://www.fuckcancer.cz/files/fc-vyrocni-zprava-2024.pdf , https://www.fuckcancer.cz/files/fc-vyrocnizprava2023.pdf

**Dôkazy:**
- IARC GLOBOCAN 2024, svetová súhrnná strana: https://gco.iarc.who.int/media/globocan/factsheets/populations/900-world-fact-sheet.pdf
- Europe's Beating Cancer Plan (EK, 2022): https://health.ec.europa.eu/system/files/2022-02/eu_cancer-plan_en_0.pdf
- NCI, „Adjustment to Cancer: Anxiety and Distress (PDQ)“: https://www.cancer.gov/about-cancer/coping/feelings/anxiety-distress-pdq
- Temel et al., NEJM 2010 (skorá paliatívna starostlivosť): https://doi.org/10.1056/NEJMoa1000678 [cez 07]
- Basch, JCO 2016 (ePRO, nepriamy): https://europepmc.org/article/MED/26644527 [cez 07]
- MZ ČR (600 tis. s rakovinou, >90 tis. nových prípadov): https://mzd.gov.cz/tiskove-centrum-mz/jeden-kontakt-mene-cekani-rychlejsi-cesta-k-lecbe-koordinatori-meni-peci-o-onkologicke-pacienty/ [cez 08]
- ÚZIS Novotvary 2019–2021: https://www.uzis.cz/res/f/008447/novotvary2019-2021.pdf ; OECD/EK Czechia Country Cancer Profile 2025: https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-cs-2025-1663-v2-en.pdf [cez 08]
- Národný onkologický plán ČR 2030: https://mzd.gov.cz/narodni-onkologicky-plan-cr-2030/ [cez 08]
- VZP Inovačný portál: https://inovace.vzp.cz ; VZP rozhovor 29. 9. 2026: https://www.vzp.cz/o-nas/aktuality/hlavinka-digitalni-technologie-uz-pouzivame-je-na-case-naucit-se-hodnotit-jejich-prinos [cez 08, 09]
- ESMO ELCAP (pacientske AI nástroje pod dohľadom s eskaláciou): https://pubmed.ncbi.nlm.nih.gov/41111032/ [cez 07, S]

**Trh a konkurencia (priame načítanie stránok):**
- Cancer Hope Network: http://cancerhopenetwork.org/ ; Inspire: https://www.inspire.com/ ; Carenity: https://www.carenity.com/ ; Smart Patients: https://www.smartpatients.com/ ; PatientsLikeMe: https://www.patientslikeme.com/ ; Cancer Chat (CRUK): https://cancerchat.cancerresearchuk.org/ ; Amelie: https://www.amelie-zs.cz/ ; Mamma HELP: https://www.mammahelp.cz/

**Interný research:** `docs/research/00`, `04`, `05`, `06`, `07`, `08`, `09`.

**Čo som nevedel overiť [?]:**
- Nezávislé štúdie o účinnosti peer podpory a o osamelosti v onkológii (vyhľadávanie sa vyčerpalo, PubMed/Europe PMC sa nenačítali); všetky tvrdenia o účinnosti sú preto opatrné.
- Imerman Angels, Macmillan Online Community a Reddit r/cancer sa nenačítali (502/prázdne/blokované).
- Presné zloženie financovania Cancer Twin v rámci Fuck Cancer (či sú vyzbierané peniaze určené práve naň).
- Koľko tímov skutočne vstúpi na Twincer do 19:00; či zadávateľ pri jedinom tíme musí vyhlásiť víťaza.
- Zloženie a váhy sobotného hodnotenia výzvy; osoby, ktoré budú obchádzať tímy.
- Kto je „Zdeněk Cholévu“ v praxi a či bude prítomný.
- Právne kvalifikovanie aplikácie (MDR) a GDPR hodnotenie je len na úrovni prototypu so syntetickými dátami; pre pilot treba právnika.
