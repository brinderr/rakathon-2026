# Overdeliver: každá požiadavka VZP → ako ju prekonať (reálne do soboty 13:00)

_Matej (Claude), so 17. 10. 2026, 00:50. Nadväzuje na `docs/matej-idealny-system.md` (čo splniť) a Brunovo
`docs/IDEALNE-RIESENIE.md` (hranice: právo, MDR, bezpečnosť). Toto je **ako zaujať porotu** bez klamania a bez rozbitého
dema. Na stavbu máme ~12 hodín a kód píše Claude._

## 0. Tri pravidlá overdeliveru

1. **Hĺbka namiesto šírky.** Porota má kontrolný zoznam (slide 12, 6 bodov). Každý bod musí fungovať **naživo
   a spoľahlivo** a mať **jeden „wow“ moment**. Desať polovičatých funkcií navyše porotu nepresvedčí.
2. **Dôkaz namiesto sľubu.** Každé tvrdenie na obrazovke má číslo, ktoré sme naozaj zmerali. Napríklad „20/20 polí
   správne na kontrolnej sade“, nie „AI je presná“.
3. **Demo nesmie spadnúť.** Zdieľaný Azure API má limity (chyba 429). Preto:
   - **Výsledky pre Alenu predpočítame a uložíme.** Demo beží okamžite aj bez internetu.
   - **„Živý režim“** spracuje novú správu naostro. To je moment, keď mentor nahrá vlastný dokument.
   - **Záložné video** celého priechodu.

---

## 1. Slide 12, bod po bode: splniť → prekonať

### ✅ 1. „Odoslanie do KOC bez ďalšieho formulára“ (požiadavky 1–5)

| | Čo |
|---|---|
| **Splniť** | Stránka praktika: vybrať KOC, pretiahnuť súbory, kliknúť „Odoslať“. Nacionále a podozrenie AI vytiahne zo správ |
| **Prekonať** | **„Kontrola žiadanky“ ešte pred odoslaním.** Praktik okamžite vidí: „Chýba: telefón pacientky, výkonnostný stav (ECOG), výsledky vyšetrení 01–06 (máte ich?)“. Môže doplniť hneď, nie o týždeň po telefonáte koordinátorky. Po odoslaní príde **automatické potvrdenie prijatia** s číslom prípadu |
| **Wow na deme** | Pretiahnem len správu 07 (epikríza bez výsledkov, presne ako v zadaní) a systém **sám povie**, že výsledky sú „na jednotlivých pracoviskách“, a navrhne ich zoznam |
| **Bonus, ak zostane čas** | Prijme aj **fotku papierovej správy z mobilu**. AI vie čítať obrázok a papier je v ČR stále legálny a bežný |
| **Prečo to porota ocení** | Zadanie (slide 5) hovorí, že dokumentácia „přichází roztříštěná a nekompletně“. My dieru zalepíme na začiatku, kde je to najlacnejšie |
| **Riziko** | Nízke. Formulár je jednoduchý, kontrola je rovnaká logika ako pri koordinátorovi |

### ✅ 2. „AI vyťaženie s kontrolou úplnosti“ (požiadavky 6–11)

| | Čo |
|---|---|
| **Splniť** | 20 polí z `Handover_obsah`, označené chýbajúce, lekár potvrdí |
| **Prekonať 1: overený citát** | Pri každom údaji je doslovná veta zo správy. **Program overí, že veta v dokumente naozaj je** (presná zhoda textu), inak údaj zahodí. Klik na údaj otvorí originál so **zvýraznenou vetou vedľa seba**. Na obrazovke svieti počítadlo **„0 polí bez citátu“** |
| **Prekonať 2: rozpor vedľa seba** | Pri rozpore AI nehádže. Ukáže **obe verzie a obe zdroje vedľa seba**, napríklad apixaban „18. 10.“ (správa 09) oproti výkonu 12. 10., a rozhodne človek |
| **Prekonať 3: stroj času** | Posuvník **„stav k 21. 10. 2026“**. Správy 12 a 13 zošednú, váha sa prepne zo 63 kg na 65 kg so zdrojom. Konzílium vidí len to, čo vedelo v daný deň |
| **Prekonať 4: doplnenie naživo** | Zadanie výslovne chce, aby koordinátor chýbajúce **doplnil a aplikácia to zapracovala do handoveru**. Na deme: klik „Vyžiadať ECOG“, pripraví sa žiadosť, nahrám „odpoveď“ (fiktívna správa s ECOG 1) a **pole sa samo zazelená a handover sa prepíše** |
| **Prekonať 5: meranie presnosti** | Pre Alenu si ručne pripravíme **kontrolnú sadu** (správna hodnota pre každé z 20 polí a 13 pascí). Aplikácia ukáže **„Na kontrolnej sade: X/20 polí správne, Y/13 pascí zachytených, 0 vymyslených hodnôt“**. Až po skutočnom meraní, nie odhad |
| **Prekonať 6: druhý pacient** | Druhý fiktívny prípad (napr. pán Novák z prezentácie VZP alebo pľúca), aby nikto nepovedal „ušité na jednu pacientku“ |
| **Kopírovateľné časti** | Pri každom bloku tlačidlo „Kopírovať“ (čistý text pre nemocničný systém), celý podklad ako PDF |
| **Riziko** | Stredné: kvalita extrakcie. Riešenie: predpočítané výsledky a kontrolná sada, ladiť hneď v noci |

### ✅ 3. „Prehľad prípadov so stavom a termínom“ (požiadavky 12–16)

| | Čo |
|---|---|
| **Splniť** | Fronta nový / aktívny / odložený, pri každom pacientovi stav, termín, kto je na ťahu |
| **Prekonať 1: hodiny cesty** | Pri každom pacientovi **„deň 12 z 33“**, teda koľko dní uplynulo od prijatia žiadanky oproti cieľovej lehote. Cieľ sa nastavuje, predvolené sú dánske lehoty pre pankreas (6 dní do prvej návštevy, 27 dní vyšetrovanie). Povieme: „Česko lehoty nemá, Dánsko áno, a stíha ich 87 %“ |
| **Prekonať 2: ranný prehľad** | Hore jedna veta, čisto administratívna: **„Dnes: urgovať 2, konzílium zajtra má 1 neúplný podklad (Procházková: chýba ECOG), 1 nová žiadanka“** |
| **Prekonať 3: filtre zo života** | Čaká na mňa · Čaká na iných · Mešká · Konzílium tento týždeň |
| **Hranica** | Poradie **len podľa termínov**, nikdy podľa zdravotného stavu. Inak by aplikácia bola zdravotnícka pomôcka (MDR). Toto porote povieme sami, ukáže to, že rozumieme regulácii |
| **Riziko** | Nízke. Do fronty pridáme 2–3 fiktívne prípady, aby nebola prázdna |

### ✅ 4. „Vlastník každého ďalšieho kroku“ (požiadavky 17–21)

| | Čo |
|---|---|
| **Splniť** | Pri každom kroku vidno, kto je na ťahu a dokedy |
| **Prekonať 1: šablóna cesty jedným klikom** | „Spustiť cestu: Pankreas“ vytvorí kroky v správnom poradí s termínmi: CT → biopsia → odbery a onkomarkery → histológia → konzílium → onkológ. Kroky majú **závislosti** (biopsia až po CT) |
| **Prekonať 2: štyri stavy kroku** | **vyžiadané → objednané → vykonané → výsledok doručený**. Odoslať žiadosť ešte neznamená mať termín (prednáška Tichopad). Práve tu sa dnes strácajú dni |
| **Prekonať 3: pripomienka zo zdroja** | Ak správa gastroenterológa hovorí „apixaban vysadiť 48 h pred výkonom“, pri biopsii vznikne úloha **s citátom tej vety**. Nie je to rada AI, je to pokyn lekára zo správy |
| **Prekonať 4: eskalácia** | Histológia mala byť 15. 10., prišla 19. 10. Po termíne krok sčervenie a pripraví sa urgencia na patológiu |
| **Prekonať 5: časová os** | Vizuálna os cesty s čiarou „dnes“ (dá sa prevziať z Brunovej hry Alena) |
| **Riziko** | Nízke až stredné. Šablóna je dátová štruktúra, nie AI |

### ✅ 5. „Štruktúrovaný záver KOC / MDT“ (požiadavky 22, 23)

| | Čo |
|---|---|
| **Splniť** | Koordinátor nahrá záver konzília, ten sa uloží štruktúrovane podľa vzoru `MDT zaver` |
| **Prekonať 1: záver pre praktika** | Pod formálnym záverom je blok **„Čo to znamená pre vás, pán doktor“**: čo sa rozhodlo, kto je kontakt v KOC, čo sledovať (bolesť, psychika, riedenie krvi) a kedy pacientka príde späť. Údaje sú **len zo záveru konzília a zo správ**, s citátmi, nič domyslené |
| **Prekonať 2: pôvodný kontext** | Hore je otázka praktika („dokončenie diagnostiky“) a pod ňou odpoveď konzília, aby uzavrel svoju otázku |
| **Prekonať 3: lehota 2 pracovné dni** | Hodiny strážia, aby záver odišiel do 2 pracovných dní (pravidlo z Holandska) |
| **Právna poznámka** | V ČR musí záver podpísať alebo zapečatiť **nemocnica** (§55a ods. 4 zákona 372/2011). Na deme ukážeme krok „podpísané v nemocničnom systéme (simulované)“ |

### ✅ 6. „Spätná väzba a potvrdené odovzdanie“ (požiadavky 24–27)

| | Čo |
|---|---|
| **Splniť** | Praktik dostane výsledok, odovzdanie sa potvrdí, prípad sa uzavrie |
| **Prekonať 1: revízny lekár** | Súhrn pre poisťovňu sa **vyberie podľa poisťovne pacientky**. Alena má kód **211 (ZPMV), nie VZP**, a aplikácia to sama rozpozná. Súhrn: diagnóza (C25.0), rozhodnutie konzília, plánovaná liečba. Revízny lekár môže odpísať „doplňte X“ a vznikne úloha koordinátorovi |
| **Prekonať 2: doručenka** | Stav „odoslané → doručené → otvorené“ (simulované, povieme nahlas). Prípad sa uzavrie, až keď sú oba doručené |
| **Prekonať 3: záznam o koordinovaní** | Pri uzavretí vznikne **časová os všetkých krokov koordinátora** (prijal, vyžiadal, objednal, urgoval, odoslal). Ministerstvo ho od koordinátora žiada a nemocnici slúži ako podklad k výkonu 51887 (250 Kč). **Úspora práce, ktorú nikto nečaká** |
| **Riziko** | Nízke |

---

## 2. Požiadavky, ktoré netreba vynechať (porota ich má v zadaní)

| Požiadavka | Ako ju ukážeme |
|---|---|
| **19: e-mail, SMS, chat** | Náhľad **SMS v rámčeku telefónu** pre pacientku („Zajtra 8:00 biopsia, KOC 2, pavilón B. Vaša koordinátorka: …“), náhľad **e-mailu** pre lekára, **chat** pri prípade (koordinátor ↔ patológia). Všetko simulované, ale realistické a po česky |
| **Bonus: stránka „Moja cesta“ pre pacientku** | Mobilná stránka s jednoduchými slovami: ďalší termín, kto je moja koordinátorka, čo bude nasledovať. Švédsko má digitálny plán liečby („Min vårdplan“) s vyše 100 000 plánmi. Pacienti sú to, prečo to celé robíme |
| **24: revízny lekár automaticky** | Viď bod 6 vyššie |

---

## 3. „Wow“ pre VZP: panel pre vedenie (ak zostane čas)

- Malý panel **„Ako sa darí ceste pankreasu v KOC 2“** nad 30 vymyslenými historickými prípadmi (jasne označené ako
  simulácia):
  - % ciest v lehote,
  - **kde sa najviac čaká** (podľa krokov: histológia, CT…),
  - koľko záverov odišlo praktikovi do 2 dní.
- Prečo:
  - Česko čakanie dnes nesleduje (OECD 2025).
  - Riaditeľ VZP Duškov chce „datově řízenou instituci“ a „platbu za výsledek“.
  - Vo finálovej porote sedí VZP aj ministerstvo, a tento panel je pre nich.
- Údaje sú len anonymné súhrny, žiadne mená.

## 4. Riadok „Snímky a dávka“ (Maťo, malá práca, veľké odlíšenie)

- **Zoznam zobrazovacích vyšetrení zo správ:** RTG pľúc 3. 9., ultrazvuk 29. 9., CT 8. 10. v KOC 1.
- **Stav snímok:** „CT z KOC 1: v PACS KOC 2? nepotvrdené → vyžiadať cez ePACS“.
- **Upozornenie:** „Neobjednávať nové CT, kým nie sú k dispozícii snímky z KOC 1.“
- **Orientačná kumulatívna dávka** z typických hodnôt, jasne označená ako odhad.
- **Opora:** smernica Euratom 2013/59, čl. 55 ods. 2 písm. d) hovorí, že pred vyšetrením treba získať predchádzajúce
  diagnostické informácie.

## 5. Čo NEROBIŤ (pasce overdeliveru)

- Žiadne skóre rizika, „odporúčanie liečby“ ani „AI zhrnutie stavu pacienta“ (MDR, zadanie to výslovne nechce).
- Žiadne grafy laboratórnych výsledkov a žiadne „lieky dokedy“ (Brunova kritika: dáta to nemajú).
- Žiadne tvrdenie „napojené na NIS“ ani „nasadené“. Všetko simulované povieme nahlas.
- Nie viac obrazoviek, ako stihneme odladiť. Radšej 6 dokonalých ako 12 rozbitých.

## 6. Stavba v noci: poradie a čas

| Čas | Čo | Kto |
|---|---|---|
| 01:00–02:00 | Kostra appky, dáta Aleny (13 správ), kontrolná sada 20 polí ručne | Claude + Maťo kontroluje kontrolnú sadu |
| 02:00–05:00 | Vyťaženie s overeným citátom, semafor, rozpory, stroj času, predpočítanie | Claude |
| 05:00–07:00 | Fronta, detail prípadu, hodiny cesty, šablóna pankreas, eskalácia | Claude |
| 07:00–08:30 | Vstup praktika s kontrolou žiadanky, doplnenie naživo (ECOG) | Claude |
| 08:30–10:00 | Záver praktikovi, revízny lekár, doručenky, záznam o koordinovaní, SMS a e-mail náhľady | Claude |
| 10:00–11:00 | Riadok Snímky a dávka, Moja cesta, ak čas: panel VZP, FHIR export | Claude |
| 11:00–12:00 | **Generálka dema 3×**, oprava chýb, nahrávka záložného videa | Bruno + Maťo |
| 12:00–12:45 | Titulný obrázok 16:9, popis, odovzdanie na submit.rakathon.cz | Bruno |

**Rozdelenie medzi nás dvoch, aby sme si neprepisovali súbory:** jeden Claude stavia **jadro** (dáta, vyťaženie,
podklad), druhý **obrazovky koordinátora a komunikáciu**. Treba dohodnúť cez INBOX hneď teraz.

## 7. Demo za 5 minút (scenár)

1. **0:00** Praktik pretiahne správu 07 → kontrola žiadanky: „chýbajú výsledky 01–06, telefón, ECOG“ → odoslané, potvrdenie prijatia.
2. **0:40** Fronta koordinátora: Alena „nový“, hodiny „deň 0 z 33“. Spustiť cestu Pankreas jedným klikom.
3. **1:20** Správy prichádzajú, handover sa skladá. Klik na údaj, zvýraznená veta. „0 polí bez citátu.“
4. **2:00** Pasce: chýba ECOG, rozpor apixabanu vedľa seba, histológia z budúcnosti. Stroj času k 21. 10.
5. **2:40** „Vyžiadať ECOG“, príde odpoveď, pole zelené. Lekár potvrdí podklad.
6. **3:10** Histológia mešká, eskalácia. SMS pacientke v telefóne. Riadok „Snímky a dávka“.
7. **3:50** Záver konzília, „Čo to znamená pre vás, pán doktor“, odoslané praktikovi aj poisťovni 211, doručené, prípad uzavretý, záznam o koordinovaní hotový.
8. **4:30** Panel VZP: „Kde sa čaká“. Pointa: „Nič sa nestratí a vždy vieš, kto je na ťahu.“ (+ nahrá mentor vlastnú správu?)
