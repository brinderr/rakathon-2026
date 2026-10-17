# R1 – UX kontrola očami koordinátorky KOC a porotcu

_17. 10. 2026 · prešla som 20 screenshotov v `design/shots/` a kód v `src/pages` a `src/components`. V kóde som nič nemenila._
_Pohľad 1: som koordinátorka v KOC, je utorok ráno a mám pred sebou frontu. Pohľad 2: som porotca na sobotnej obchôdzke a mám 3 minúty._

## Verdikt v 5 vetách

1. Silné stránky, ktoré si treba nechať: fronta s „Na ťahu“, klik na údaj otvorí zvýraznenú českú vetu v origináli, rozpor vedľa seba, posuvník „Stav k dátumu“, „Vaša pôvodná otázka → odpoveď konzília“ a sumy za výkon 51887.
2. **Kto je na ťahu:** vo fronte je to jasné. V prípade to po prvej akcii prestane platiť: po doplnení ECOG stále svieti „Ďalší krok: doplniť ECOG“ (č. 1).
3. **Čo chýba:** semafor a „Čo treba vyriešiť“ to ukážu dobre. Tri „návrhy“ sa však nedajú potvrdiť, takže podklad nikdy nebude kompletný (č. 4).
4. Najväčšie riziko na deme: zmeny sa nepreniesú medzi obrazovkami a okno „Vyžiadať“ sa zrejme otvára mimo obrazovky (č. 1 a 2). Rozhodnutie rozporu navyše prepíše „Lieky“ na „Biopsia bola 12. 10.“ (č. 3).
5. Najväčšia nevyužitá „wow“ vec: Maťove čísla presnosti AI (20/20 polí, 17/17 pascí, 0 vymyslených hodnôt, test halucinácií, druhý pacient) nie sú v appke nikde (č. 5).

Námaha: **S** do 20 minút · **M** do 1 hodiny · **L** viac ako 1 hodina.

---

## Nálezy (zoradené podľa dopadu)

### 1. Zmeny sa neprenášajú medzi obrazovkami, „Ďalší krok“ ostáva starý · Prípad, Podklad MDT, Fronta · M
- **Problém:**
  - Doplnenie ECOG, rozhodnutie rozporu aj záznamy z relácie žijú iba v lokálnom stave `CaseView` (`overrides`, `arrived`, `sessionLog`).
  - Po kliknutí na „Podklad pre konzílium“ dokument stále píše pri ECOG „nie je v dokumentácii“ a „3 nie je v dokumentácii“ (shot 19).
  - Fronta stále hlási „Procházková: chýba ECOG“.
  - Pri návrate na prípad je všetko späť na červenej.
  - „Ďalší krok“ je pevný text z dát. Pri stave 21. 10. svieti červené „Doplniť výkonnostný stav (ECOG) … do 20. 10. 2026“, hoci semafor už ukazuje „0 chýba“ (shot 15).
  - Na deme to rozbije prechod z kroku 5 (pole zozelenie) do kroku 8 (podklad).
- **Zmena:**
  - `overrides`, `arrived` a `sessionLog` presunúť do kontextu v `App.tsx`, vedľa `asOf`.
  - `MdtDoc`, `Queue` (ranný prehľad) a karta „Ďalší krok“ ich budú čítať odtiaľ.
  - „Ďalší krok“ odvodiť: ak ECOG už nechýba, ukázať najbližší otvorený krok. Pre Alenu napríklad „Skontrolovať 3 návrhy a 2 rozpory pred konzíliom · ja · do 20. 10.“. Po potvrdení podkladu ukázať „Konzílium 21. 10. · na ťahu: MDT GIT“.

### 2. Okno „Vyžiadať“ a bočný panel sú pripnuté k obsahu, nie k obrazovke · Prípad (Prehľad, Podklad) · S
- **Problém:**
  - Na shote 13 („žiadosť – koncept“) je len rozmazané pozadie a okno nie je vidno.
  - Stmavenie pokrýva len obsah (od x=124, y=80), nie lištu ani ľavú navigáciu. Bočný panel začína na y≈92 namiesto 12 px od vrchu (shoty 12 a 17).
  - Príčina (podľa kódu): `.page-enter { animation: page-enter … both }` animuje `transform`. S `fill-mode: both` sa tento obal stane „rodičom“ pre `position: fixed`.
  - Okno sa potom centruje do výšky celej stránky, teda pod okraj obrazovky. Panel sa otvára na vrchu stránky, aj keď kliknete na pole č. 19 dole.
- **Zmena:** v `theme.css` zmeniť na `animation: page-enter .32s var(--ease) backwards;`, alebo vykresliť `RequestModal` a `OriginalPanel` cez `createPortal(…, document.body)`.
- **Pred demom overiť v prehliadači:**
  - Prehľad → „Vyžiadať“ pri ECOG.
  - Podklad → odscrolovať dole → klik na pole 19.

### 3. Rozhodnutie rozporu prepíše hodnotu poľa a tlačidlá „Platí A/B“ sú mätúce · Prípad → panel rozporu · M
- **Problém:**
  - Pri poli 12 „Lieky, ktoré užíva“ riadok vôbec neukazuje lieky, len „A Biopsia bola 12. 10. 2026 / B Posledná dávka apixabanu 18. 10. 2026 večer“.
  - Po kliknutí na „Platí A“ sa hodnota poľa zmení na „Biopsia bola 12. 10. 2026“ (`decide()` → `ov.value`). Pole „Lieky“ potom zelene tvrdí dátum biopsie.
  - Rovnako pole 19 „Histológia“ by po rozhodnutí obsahovalo len „Odber vzorky 20. 10. 2026“ namiesto „Duktálny adenokarcinóm…“.
  - „Platí A / Platí B“ navyše núti koordinátorku rozhodnúť, kedy pacientka vysadila liek. To nie je jej rozhodnutie (vlastný text appky hovorí „rozhodne lekár“).
- **Zmena:**
  - Hodnota poľa zostane: zoznam liekov, resp. histológia.
  - Rozpor zobraziť pod hodnotou ako oranžový riadok: „Nesedia dátumy v správe 09: výkon 12. 10. a posledná dávka apixabanu 18. 10. → overiť s endoskopiou KOC 2“.
  - V paneli bude primárne tlačidlo „Vyžiadať upresnenie od endoskopie KOC 2“.
  - Sekundárne tlačidlo „Overené telefonicky…“ otvorí malý formulár: „Platí: 12. 10. (A) / 18. 10. (B) · Kto potvrdil: ____“.
  - Po uložení poznámka „Overené 19. 10.: platí A – potvrdila endoskopia KOC 2 (koordinátorka Lucie)“. Hodnota poľa sa nemení.

### 4. „Návrh AI“ sa nedá potvrdiť, chýba moment „človek potvrdí“ · Prípad → Podklad, panel poľa · S
- **Problém:**
  - Polia 4, 8 a 9 sú „návrh, čaká na kontrolu“, ale nikde nie je tlačidlo na potvrdenie (`OriginalPanel` nemá žiadnu akciu pre `proposed`).
  - „Čo treba vyriešiť“ sa preto nikdy nevyprázdni a zelená karta „Podklad je kompletný“ sa na deme nikdy neukáže.
  - Zadanie VZP aj náš pitch pritom stoja na vete „AI navrhne, človek potvrdí“.
  - Nie je ani jasné, čo znamená „potvrdené“ (kto to potvrdil?).
- **Zmena:**
  - V paneli poľa so stavom „návrh“ pridať pod citát tlačidlo **„Skontrolovala som so zdrojom – potvrdiť“**. V riadku poľa malé tlačidlo „Potvrdiť“.
  - Do záznamu zapísať „Potvrdený návrh: Diagnóza · koordinátorka“.
  - Legenda semaforu: „potvrdené = citát overený programom a skontrolovaný človekom“, „návrh = AI našla údaj s citátom, čaká na kontrolu“.

### 5. Výsledky AI a meranie presnosti nie sú na obrazovke vôbec · Prípad → Prehľad (+ Fronta) · M
- **Problém:**
  - Porotca sa spýta „kde je tu AI?“. V UI nie je slovo AI ani jedno číslo z Maťovej práce.
  - `public/data/eval-alena.json` má headline „Na kontrolnej sade: 20/20 polí správne · 17/17 pascí zachytených · 0 vymyslených hodnôt · 63/63 citátov doslova v správach“.
  - `eval/vysledok-test-halucinacii.json`: úmyselne chybná AI, 4 z 5 návrhov zamietnuté.
  - Druhý pacient Josef Novák (`extracted-pacient-2.json`, `eval-pacient-2.json`, 20/20 polí, 13/13 pascí) nie je vo fronte.
  - Štvrtá dlaždica „0 údajov bez zdroja“ zaberá veľké miesto pre jednu nulu.
- **Zmena:**
  - Štvrtú dlaždicu nahradiť dlaždicou **„AI vyťaženie, overené“** s veľkým číslom „20/20“ a pod ním „polí správne · 17/17 pascí · 0 vymyslených · 63/63 citátov doslova“.
  - Pätička dlaždice: „ako sme merali →“. Otvorí malý panel s 3 riadkami: kontrolná sada, test halucinácií (4/5 zamietnuté), druhý pacient (pľúca, 20/20).
  - Hodnoty čítať priamo z `eval-*.json` (žiadne ručné čísla).
  - Ak zostane čas, ľahký prípad Kučera (pľúca) nahradiť Josefom Novákom z `extracted-pacient-2.json`. Námietka „ušité na jednu pacientku“ tým padne.

### 6. Koordinátorka sa volá „Klára“, dokumenty hovoria „Bc. Lucie Dvořáková“ · celá appka · S
- **Problém:**
  - Horná lišta a pozdrav „Dobré ráno, Klára.“ (`COORDINATOR` v `Shell.tsx`).
  - V zdroji VZP (`MDT zaver`) je ako koordinátorka KOC uvedená „Bc. Lucie Dvořáková“. Rovnako je podpísané potvrdenie prijatia praktikovi (shot 16), koncept žiadosti o ECOG aj „Čo to znamená pre vás“.
  - „Klára“ nie je v žiadnom zdroji. Porotca uvidí dve rôzne koordinátorky.
- **Zmena:**
  - `COORDINATOR = { name: 'Lucie', role: 'koordinátorka KOC 2' }`.
  - Pozdrav „Dobré ráno, Lucie.“, avatar „LD“.

### 7. „Záver pre praktika“ ukazuje výsledok konzília 21. 10., hoci „dnes“ je 19. 10. · Záver pre praktika, hlavička prípadu · S
- **Problém:**
  - Tlačidlo „Záver pre praktika“ je aktívne pred konzíliom.
  - Stránka bez varovania ukáže „Odpoveď konzília 21. 10. 2026“, chemoterapiu a termín 4. 11.
  - Fronta a hlavička pritom tvrdia „pondelok 19. 10.“. Pre porotu je to časový paradox, kým jej to niekto nevysvetlí.
- **Zmena:**
  - V hlavičke prípadu pred dátumom konzília zmeniť text tlačidla na „Záver pre praktika · po 21. 10.“.
  - Na stránke záveru dať pod nadpis pruh: **„Ukážka stavu po konzíliu 21. 10. 2026 (zápis MDT je fiktívny podklad VZP).“**
  - Pri otvorení stránky nastaviť `asOf` na dátum konzília.

### 8. Ranný prehľad tvrdí „nič neurguje“ a „Mešká 0“, eskalácia nie je na prvej obrazovke · Fronta · S
- **Problém:**
  - Prvá veta, ktorú porota prečíta, je „Dnes: nič neurguje“. Kučera má pritom termín dnes, Alena zajtra a konzílium je o 2 dni.
  - Slovo „neurguje“ sa číta ako „nič nie je súrne“.
  - Demo krok 6 (histológia 4 dni po termíne → eskalácia) na fronte nie je: filter „Mešká 0“.
- **Zmena (text):** „Dnes: **1** úloha na mne s termínom dnes (Kučera – prevziať žiadosť) · urgovať: nikoho · konzílium **21. 10.** má neúplný podklad (Procházková: chýba ECOG) · **1** nová žiadanka.“
- **Zmena (dáta):** jednému ilustračnému prípadu (napríklad Pospíšilová) posunúť termín kroku na 16. 10.
  - Vo fronte potom vznikne „mešká 3 dni“, „Mešká 1“ a „urgovať 1“.
  - Prípad je fiktívny a označený ako ukážka (pozri č. 17).

### 9. Histológia na Ceste svieti zelenou bez zmienky o meškaní · Prípad → Cesta · S
- **Problém:**
  - Karta „Histológia (výsledok biopsie)“ má zelenú fajku a „do 15. 10.“ (shot 04).
  - Že prišla 19. 10., teda 4 dni po termíne, a 16. 10. sa urgovala, vidno iba v Zázname.
  - Kľúčová požiadavka „eskalácia pri meškaní“ je tak pri „dnes“ neviditeľná.
- **Zmena:**
  - Na karte kroku pridať riadok „výsledok 19. 10. · **4 dni po termíne** · urgované 16. 10.“ (z `history` a logu).
  - Oranžový ľavý okraj nechať aj po doručení.
  - Do legendy pridať „doručené po termíne“.

### 10. Žiadanka praktika beží v ráme koordinátorky · Žiadanka (strana praktika) · S
- **Problém:**
  - Na stránke „Odoslať pacienta do KOC“ je hore „Klára · koordinátorka“ a vľavo navigácia KOC.
  - Tlačidlo „Nová žiadanka“ vo fronte vedie na stránku praktika.
  - Porotca nevie, za koho sa práve hrá. Malé „Strana praktika · bez účtu“ to nezachráni.
- **Zmena:**
  - Na `#intake` skryť ľavú lištu a meno koordinátorky.
  - Hornú lištu zafarbiť inak (napríklad pieskovo) s textom **„Pohľad praktika · MUDr. Tomáš Řezníček · ukážka: takto dnes posiela žiadanku e-mailom“** a odkazom „← späť do appky koordinátora“.
  - Tlačidlo vo fronte premenovať na „Pohľad praktika: poslať žiadanku“ a položku v lište „Žiadanka“ na „Praktik“.

### 11. Prehliadka pre porotu v 8 krokoch (wow, priamo pre sobotnú obchôdzku) · horná lišta · M
- **Problém:** porota príde k stánku na 3 minúty a často kliká sama. Bez vedenia skončí v tabuľke laboratória.
- **Zmena:**
  - Do hornej lišty pridať nenápadné tlačidlo **„Ukážka v 8 krokoch“**.
  - Otvorí malý plávajúci panel vpravo dole (1 riadok na krok, tlačidlo „Ďalej“, ktoré naviguje).
  - Pri každom kroku uviesť, ktorú časť zadania VZP pokrýva (Převzít, Vyžádat, Vytěžit, Koordinovat, Připravit, Uzavřít):
    1. Fronta: kto je na ťahu
    2. Pohľad praktika: kontrola žiadanky
    3. Prípad Aleny: úplnosť 14/20
    4. Klik na diagnózu: zvýraznená veta v origináli
    5. Rozpor apixabanu vedľa seba
    6. Vyžiadať ECOG → príde odpoveď → pole zozelenie
    7. Stav k 21. 10.: správy 12 a 13 zošednú
    8. Podklad MDT → záver praktikovi → doručené → uzavrieť

### 12. „Prídu neskôr“ v Dokumentoch pôsobí ako veštenie · Prípad → Dokumenty · S
- **Problém:**
  - Pri „dnes 19. 10.“ appka vypíše budúce správy s názvom a dátumom: „Doplnenie ECOG … príde 20. 10.“, „Algeziológia … príde 26. 10.“, „Zápis z konzília … príde 21. 10.“. V hlavičke je „11 z 15“.
  - Koordinátorka nevie, čo presne a kedy príde. Vie len to, čo vyžiadala a objednala.
- **Zmena:**
  - Sekciu premenovať na **„Čakáme na (vyžiadané, ešte neprišlo)“**. Riadky:
    - „Výkonnostný stav (ECOG) · vyžiadané od MUDr. Markovej“
    - „Algeziológia · objednané na 26. 10.“
    - „Klinický psychológ · objednané na 27. 10.“
    - „Zápis z konzília · po 21. 10.“
  - Bez názvov budúcich správ.
  - Hlavičku zmeniť na „11 prijatých · 4 očakávame“.
  - Konkrétne správy ukázať až po posunutí posuvníka.

### 13. Podklad MDT sa dá „potvrdiť“ s otvorenými rozpormi a chýbajúcimi údajmi · Podklad pre konzílium · S
- **Problém:**
  - Hneď vedľa „3 nie je v dokumentácii“ je primárne tlačidlo „Potvrdiť (simulácia)“.
  - Po kliknutí: „Potvrdil lekár KOC: MUDr. Martin Svoboda · 19. 10. 2026“, hoci podklad je „k 21. 10.“ a 2 rozpory sú otvorené.
  - Chýba výpis toho, čo lekár potvrdzuje.
- **Zmena:**
  - Nad tlačidlo dať riadok „Pred potvrdením: 2 rozpory označené pre konzílium · ECOG chýba · e-mail pacientky a praktika chýba“.
  - Tlačidlo premenovať na „Poslať lekárovi KOC na potvrdenie (simulácia)“.
  - Po kliknutí: „Potvrdil MUDr. Martin Svoboda (prezentuje prípad) · rozpory ponechané na rozhodnutie konzília · simulácia“.

### 14. „Čo treba vyriešiť“ začína triviálnym „Pohlavie“ a texty sa opakujú · Prípad → Prehľad, panel poľa · S
- **Problém:**
  - Zoznam je zoradený podľa skupín šablóny, preto je prvé „Pohlavie: žena (návrh)“ a najdôležitejšie „ECOG chýba“ je až piate.
  - V paneli ECOG je dvakrát za sebou: „V žiadnej správe nie je ECOG ani Karnofského skóre… preto ho nedomýšľame.“ a „V dostupných správach údaj nie je. Nič nedomýšľame – vyžiadame ho.“
- **Zmena:**
  - Zoradiť podľa akcie: 1) **Chýba** (tlačidlo „Vyžiadať“), 2) **Rozpor** („Overiť“), 3) **Návrh** („Potvrdiť“).
  - Každý riadok má jedno sloveso.
  - „Pohlavie“ zbaliť pod „+ 2 drobné návrhy na kontrolu“.
  - V paneli nechať len prvú vetu.

### 15. Záznam o koordinovaní: chýbajú koruny a čísla nesedia so záverom · Prípad → Záznam, Záver → Uzavrieť · S
- **Problém:**
  - Hlavička hovorí „9 dní so zásahom · výkon 51887“ bez sumy.
  - Text „5 k dátumu skrytých“ je nezrozumiteľný.
  - Po „Uzavrieť prípad“ karta ukáže „11 dní · 25 úkonov · 2 750 Kč“. Tlačidlo „Otvoriť záznam o koordinovaní“ potom ukáže „9 dní“ a „5 skrytých“, lebo posuvník ostal na 19. 10.
- **Zmena:**
  - Hlavička: **„9 dní so zásahom = 2 250 Kč podklad pre výkon 51887 (vykazuje nemocnica)“**.
  - Text: „5 neskorších záznamov (po 19. 10.) je skrytých – posuňte Stav k dátumu“.
  - Pri uzavretí prípadu nastaviť `asOf` na posledný dátum záznamu, aby sa čísla zhodovali.

### 16. Diagnóza sa tvári ako istá už v žiadanke praktika · Žiadanka (kontrola), hlavička prípadu · S
- **Problém:**
  - V kontrole žiadanky (stav 2. 10.) je čip „nádor hlavy pankreasu (C25.0)“.
  - Praktik napísal „Suspektní diagnóza: C25.0 – suspektní tumor hlavy pankreatu“ a histológia vtedy neexistovala. Je to domyslenie.
- **Zmena:**
  - V `Intake` čip „**podozrenie** na nádor hlavy pankreasu (C25.0)“.
  - V hlavičke prípadu: „nádor hlavy pankreasu (C25.0) · histológia 19. 10. · diagnózu potvrdí konzílium“.

### 17. Ilustračné prípady nie sú označené ako vymyslené · Fronta · S
- **Problém:**
  - Kučera, Pospíšilová a Králová sú vymyslené pre frontu (komentár v `cases.ts`), ale v UI to nikde nie je.
  - Pravidlo obsahu hovorí, že mená a čísla musia byť zo zdrojov alebo jasne označené ako ukážka.
- **Zmena:**
  - Na kartách troch prípadov malý sivý čip „ukážka“ (vedľa stavu).
  - Pod frontou namiesto súčasnej poznámky: „Alena Procházková = prípad zo zadania VZP. Ostatné 3 prípady sú ilustračné. Poradie len podľa termínov, nikdy podľa zdravotných údajov.“

### 18. „Konzíliá“ v ľavej lište otvorí dokument jednej pacientky · ľavá lišta · S
- **Problém:** položka sa volá v množnom čísle, ale skočí rovno do „Podkladu pre konzílium“ Aleny. Koordinátorka čaká zoznam konzílií.
- **Zmena:**
  - Rýchla verzia: premenovať na „Najbližšie konzílium“.
  - Lepšia verzia: jednoduchý zoznam s riadkom „**21. 10.** · MDT GIT · Procházková · podklad 15/20 · 2 rozpory → Otvoriť podklad“.

### 19. Posuvník „Stav k dátumu“ je na každej záložke inde a „všetko“ je nejasné · Prípad (všetky záložky) · M
- **Problém:**
  - V Prehľade je vľavo v strede, v Podklade vpravo hore a v Ceste a Dokumentoch dole.
  - Voľba „všetko · 27. 10.“ nič nehovorí.
  - Keď je posuvník posunutý, zvyšok obrazovky to nekričí, takže sa ľahko zabudne.
- **Zmena:**
  - Jeden tenký pruh hneď pod záložkami, rovnaký na všetkých záložkách.
  - Voľby: „dnes · 19. 10.“ · „deň konzília · 21. 10.“ · „po konzíliu · 27. 10.“.
  - Mimo „dnes“ zafarbiť pruh a doplniť text „Prezeráte stav k 21. 10. · ← späť na dnes“.

### 20. Záložka Podklad má 5 200 px, meno a laboratórium zaberajú najviac · Prípad → Podklad · M
- **Problém:**
  - Meno a priezvisko sú dva riadky s rovnakým zdrojom.
  - Kompaktný semafor ukazuje len čísla 1–20 bez popisu.
  - Laboratórium sú dve plné tabuľky (asi 55 riadkov).
  - Koordinátorka hľadá chýbajúce údaje, nie hematokrit.
- **Zmena:**
  1. Skupinu Pacient zlúčiť do jedného riadku: „Alena Procházková · 63 r. · žena (návrh) · ZP 211“, zdroj „správa 07“.
  2. Kompaktný semafor v Podklade odstrániť (je v Prehľade s popismi).
  3. Laboratórium dať do jednej tabuľky so stĺpcami „1. 9. | 15. 10.“. Predvolene ukázať onkomarkery a hodnoty mimo normy, pod tým tlačidlo „Zobraziť všetkých 27 hodnôt“.

### 21. Podklad MDT mieša slovenské parafrázy s českou šablónou, poznámky sa opakujú · Podklad pre konzílium · M
- **Problém:**
  - V českom formulári „Zápis k jednání MDT“ s rubrikami „Jméno a příjmení“ a „Komorbidity“ stoja slovenské prepisy („Paroxyzmálna fibrilácia predsiení“, „duktálny adenokarcinóm“).
  - Dokument ide do českého NIS a pravidlo hovorí „doslova“.
  - V poznámkach pod čiarou je 12× ten istý reťazec „Správa 07 · Žiadosť praktika o prevzatie do KOC · Ordinácia praktického lekára, Dolní Břežany · 2. 10. 2026“.
- **Zmena:**
  - V tlačenom podklade použiť ako hodnotu doslovný český citát, ktorý už je v `citations` (napríklad „paroxysmální fibrilace síní od r. 2021 na antikoagulaci…“). Slovenčinu nechať len v ovládaní appky.
  - Poznámky zoskupiť po správach: „**Správa 07** – Žiadosť praktika, 2. 10. 2026: 1–4, 6, 7, 9–12, 23“. Citáty dať do tlačovej prílohy.

### 22. Fiktívna správa 14 (ECOG) má iný dátum, než kedy „prišla“ · Prípad → panel ECOG · S
- **Problém:**
  - Po simulácii odpovede panel píše „vyšetrenie 19. 10. 2026 · prijaté 19. 10. 2026“.
  - Text správy pritom hovorí „Datum: 20. 10. 2026“ a „V Praze dne 20. 10. 2026“ a záložka Dokumenty mala „príde 20. 10.“.
  - Porotca to v zvýraznenom origináli uvidí.
- **Zmena:** v `EXTRA_DOCS['14']` (naša fiktívna správa) zmeniť oba dátumy na 19. 10. 2026 a `examDate`/`receivedAt` na 2026-10-19. Prípadne simuláciu posunúť na 20. 10. a posunúť aj `asOf`.

### 23. Karta Revízny lekár hovorí to isté dvakrát · Záver pre praktika · S
- **Problém:** „Pacientka je poistená v 211 … (nie VZP) → súhrn ide jej revíznemu lekárovi (simulované).“ a hneď pod tým „Pacientka nie je poistenkyňa VZP. Súhrn konzília … patrí revíznemu lekárovi ZP MV ČR (211). Odoslanie je v prototype simulované.“
- **Zmena:**
  - Jedna veta: **„ZP 211 (ZP MV ČR), nie VZP → súhrn ide revíznemu lekárovi ZP 211.“**
  - Pod tým 3 čipy a stav „simulované“.
  - `reviewer.note` nezobrazovať.

### 24. Lehota „2 pracovné dni“ nie je označená ako zahraničný vzor · Záver pre praktika · S
- **Problém:** „Lehota 2 pracovné dni od konzília: odoslať do 23. 10.“ pôsobí ako česká norma. Podľa `docs/ULTIMATNY-SYSTEM.md` §2.4 ide o holandské pravidlo (SONCOS), ČR ho nemá.
- **Zmena:** „Lehota 2 pracovné dni (**holandský vzor**, ČR lehotu nemá): odoslať do 23. 10.“. Rovnako ako pri dánskych hodinách cesty.

### 25. Gamifikácia ukazuje čísla, ktoré si odporujú s frontou · Fronta → Moja bilancia · S
- **Problém:**
  - „6 slučiek uzavretých“, „4 v rade“ a „5,2 dňa“ sú vymyslené (síce s čipom „ukážka“).
  - Vo fronte sú 4 prípady a ani jeden nie je uzavretý, takže to pôsobí ako fake.
  - „Slučka“ je pre koordinátorku hackathonový žargón.
  - Pravý stĺpec zaberá štvrtinu šírky prvej obrazovky.
- **Zmena:**
  - Zmenšiť na jednu kartu „Tento týždeň“ s riadkami odvodenými z dát: „Procházková: podklad pripravený za 17 dní · 9 dní so zásahom (51887)“, „Na mne dnes: 1 úloha“.
  - „Slučky“ premenovať na „prípady uzavreté (záver doručený)“.
  - Denný cieľ vyhodiť alebo nechať len ak má reálny základ.

---

## Rýchly plán do 13:00 (len S, v tomto poradí)

1. Nález 2 (fixed okno), 6 (Lucie), 3 (hodnota rozporu ostáva), 4 (tlačidlo Potvrdiť).
2. Nález 7 (pruh „ukážka po konzíliu“), 8 (text ranného prehľadu), 9 (histológia po termíne), 16 (podozrenie), 17 (čip ukážka).
3. Nález 15 (Kč v zázname), 22 (dátum správy 14), 23, 24.
4. Zvyšok (1, 5, 10, 11, 12, 13) podľa času. Nález 1 a 5 majú najväčší dopad na porotu, ale sú M.
