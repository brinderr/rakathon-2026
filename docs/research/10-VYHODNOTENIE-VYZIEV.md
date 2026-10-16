# 10 – Vyhodnotenie výziev a odporúčanie (rozhodnúť do 19:00)

_Stav: piatok 16. 10. 2026, neskoré popoludnie. Pre Bruna a Maťa. Postavené na súboroch `05`–`09` a `vyzvy/*.md`; počty tímov som znova pozrel na živej tabuli [submit.rakathon.cz/vyzvy](https://submit.rakathon.cz/vyzvy) pri písaní. Slack som nečítal ani nepoužil, nič sa neposielalo ani necommitovalo._

**Značky:** **[?]** = neisté alebo neoverené · **[S]** = sprostredkovaný zdroj (tlačová správa, výsledok vyhľadávania) · **(náš výpočet)** = vlastný prepočet, nie fakt · **(odhad)** = úsudok.
**Skratky:** KOC = komplexné onkologické centrum (veľká nemocnica, kde sa lieči väčšina onkologických pacientov) · MDT = onkologické konzílium (lekári viacerých odborov spolu rozhodnú o liečbe) · FHIR = štandard na výmenu zdravotných dát medzi systémami · LDCT = nízkodávkové CT (CT s nízkou dávkou žiarenia) · triáž = triedenie podľa naliehavosti · MDR = európske pravidlá pre zdravotnícke pomôcky (aj softvér) · GDPR = ochrana osobných údajov.

---

## 1. Odporúčanie (čítaj ako prvé)

1. **Vyberte výzvu „VZP – Cesta pacienta bez ztráty informací“** – má najvyššie skóre (69,8 zo 100) zo všetkých výziev, ktoré pražský tím reálne môže zvoliť.
2. **Prečo:** rieši bottleneck (úzke hrdlo), za ktorý systém už dnes platí: od januára 2026 má každé z 15 KOC koordinátora (VZP platí 250 Kč za výkon), ale štandardný softvér pre neho neexistuje, a viac ako 60 % pacientov s rakovinou pľúc nezačne liečbu do 8 týždňov od CT ([MZ ČR, 2. 9. 2026](https://mzd.gov.cz/tiskove-centrum-mz/jeden-kontakt-mene-cekani-rychlejsi-cesta-k-lecbe-koordinatori-meni-peci-o-onkologicke-pacienty/)).
3. **Čo postavíme („NIT“):** koordinátor iba pretiahne správy; AI z nich zloží podklad pre konzílium, pri každom údaji ukáže doslovný citát zo zdroja (aplikácia ho overí), označí, čo chýba a čo si odporuje, ukáže, kto je „na ťahu“, a po konzíliu pošle záver praktikovi s dôkazom doručenia – nič nové na vypĺňanie.
4. **Prečo to môže vyhrať a má hodnotu:** zadanie je najpresnejšie zo všetkých (1 fiktívna pacientka, 13 správ, šablóny vstupu aj výstupu), demo za noc je veľmi reálne, v Prahe sú zatiaľ len 2 tímy, a v nedeľnej porote sedí VZP aj ministerstvo, ktorým program koordinátorov patrí.
5. **Poctivo:** od 2. voľby nás delí menej ako 1 bod (to je šum, nie jasné víťazstvo), ostatné tímy postavia podobné „AI prečíta správy“, a priamy český trh pre takýto nástroj je malý – hodnota je v pilote a referencii pre VZP a ministerstvo, nie v rýchlych peniazoch.

**2. voľba: AZ – Plíce včas (68,9).** Nájsť ľudí vhodných na bezplatný skríning rakoviny pľúc, vysvetliť prečo, poslať im neutrálnu správu a sledovať, kto sa ozval. Najväčší dopad na zdravie z top 3, najmenej konkurencie (1 tím), ale nejasný kupec a menej „AI“ a „wow“.
**3. voľba: MEDDI ONCO (65,3).** AI semafor pre pacientov doma, ktorý nesmie prehliadnuť „červenú“. Najlepšie dáta a objektívne meranie, majiteľ MEDDI je v porote, ale najvyššie regulačné riziko a slabý fit s naším tímom.

**Rozhodovacie pravidlo o 18:30:** pozrite tabuľu [submit.rakathon.cz/vyzvy](https://submit.rakathon.cz/vyzvy). Ak bude mať Cesta pacienta **5 a viac** pražských tímov a Plíce včas stále **najviac 2**, prepnite na Plíce včas (vtedy podľa nášho skóre Plíce vyjde vyššie: 68,9 vs. 68,5). Inak ostaňte pri Ceste.

**Skeptická kontrola:** samostatná kontrola top 4 „skeptikmi“ nevrátila žiadny výstup (prázdny zoznam), poradie teda nemenila. Námietky v časti 3 som preto spísal sám, ako advokát diabla.

---

## 2. Veľká tabuľka: všetky výzvy × 15 kritérií

**Ako čítať:** každé kritérium má známku 1–10 (5 = priemer medzi výzvami, 9–10 výnimočne). **Skóre** = vážený priemer × 10 (stupnica 10–100). Súčet váh = 16.

| Skratka | Kritérium | Váha |
|---|---|---|
| Vel | veľkosť problému (koľko ľudí to zasiahne) | 1 |
| Zdr | dopad na zdravie pacienta | **1,5** |
| Čas | úspora času personálu/pacienta | 1 |
| Pen | úspora peňazí alebo zisk | 1,2 |
| Btl | akútnosť bottlenecku (je dopyt TERAZ) | **1,5** |
| Pla | ochota platiť (jasný kupec, trh) | 1,2 |
| Jed | jednoduchosť pre koncového užívateľa | 1 |
| Dát | dostupnosť a kvalita dát na hackathone | 1 |
| Rea | realizovateľnosť dema za 1 noc | 1 |
| Wow | príbeh a efekt pre 3-min pitch a video | 1,2 |
| Par | hodnota zadávateľa a networku | 1,2 |
| Kon | šanca vyhrať výzvu (menej silných tímov = vyššie) | 1 |
| Pok | šanca na pokračovanie po hackathone | 0,8 |
| Fit | fit s nami (radiačná ochrana/zobrazovanie, storytelling) | 0,8 |
| Riz | regulačné/klinické riziko (vyššie = bezpečnejšie) | 0,6 |

**„Pre nás?“** = môže ju zvoliť pražský tím. Formulár výberu ponúka pražskému tímu len 12 výziev (9 pražských + 3 VZP) a obaja členovia musia byť fyzicky v meste výzvy (`05` §2.6). **„Tímy Praha“** = počet pražských tímov na tabuli pri písaní; ešte nevybrali: Ctrl+Alt+CURE, FIT/S, FSMZ (FSMZ je pravdepodobne duplicita tímu MSFZ [?]).

| # | Výzva | Mesto | Pre nás? | Tímy Praha | Vel | Zdr | Čas | Pen | Btl | Pla | Jed | Dát | Rea | Wow | Par | Kon | Pok | Fit | Riz | **Skóre** |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | TriaLink (MOÚ) | Brno | NIE | – | 7 | 7 | 8 | 6 | 8 | 6 | 8 | 7 | 9 | 7 | 7 | 7 | 8 | 6 | 7 | **71,9** |
| 2 | EduAIttractive (MOÚ) | Brno | NIE | – | 7 | 5 | 9 | 6 | 8 | 6 | 7 | 7 | 7 | 9 | 7 | 6 | 7 | 10 | 6 | **70,8** |
| 3 | **VZP – Cesta pacienta bez ztráty informací** | Praha/VZP | **ÁNO** | 2 | 7 | 6 | 7 | 5 | 8 | 6 | 8 | 8 | 9 | 7 | 9 | 6 | 6 | 6 | 6 | **69,8** |
| 4 | **AZ – Plíce včas** | Praha | **ÁNO** | 1 | 7 | 8 | 6 | 5 | 7 | 5 | 8 | 8 | 9 | 6 | 6 | 8 | 7 | 7 | 7 | **68,9** |
| 5 | Plánovanie stacionára (FN Ostrava) | Ostrava | NIE | – | 6 | 4 | 8 | 7 | 7 | 6 | 8 | 5 | 8 | 7 | 6 | 8 | 6 | 7 | 9 | **66,6** |
| 6 | PillGaze (MOÚ) | Brno | NIE | – | 7 | 6 | 7 | 5 | 7 | 5 | 7 | 7 | 8 | 9 | 7 | 5 | 6 | 7 | 5 | **65,7** |
| 7 | **MEDDI ONCO Challenge** | Praha | **ÁNO** | 1 | 6 | 6 | 6 | 5 | 7 | 6 | 8 | 9 | 8 | 7 | 7 | 6 | 7 | 5 | 4 | **65,3** |
| 8 | **VZP – Od pozvánky k mamografu** | Praha/VZP | **ÁNO** | 3 | 8 | 7 | 4 | 5 | 7 | 5 | 8 | 7 | 8 | 6 | 8 | 4 | 6 | 6 | 8 | **64,5** |
| 9 | **VFN – SMART ONCO AA** | Praha | **ÁNO** | 1 | 6 | 6 | 8 | 6 | 7 | 5 | 8 | 4 | 8 | 8 | 5 | 8 | 6 | 5 | 6 | **64,2** |
| 10 | AI asistent MDT (FN Ostrava) | Ostrava | NIE | – | 7 | 7 | 8 | 6 | 8 | 6 | 6 | 5 | 8 | 7 | 6 | 3 | 6 | 5 | 6 | **63,7** |
| 11 | AI NOR (FN Ostrava) | Ostrava | NIE | – | 7 | 3 | 8 | 5 | 7 | 5 | 8 | 6 | 9 | 5 | 6 | 7 | 7 | 5 | 8 | **62,3** |
| 12 | **FNMH – Hlídač nežádoucích účinků** | Praha | **ÁNO** | 2 | 7 | 7 | 5 | 5 | 7 | 5 | 8 | 4 | 8 | 7 | 7 | 6 | 5 | 6 | 3 | **61,5** |
| 13 | **FNMH – PACS Comparator Check** | Praha | **ÁNO** | 2 | 6 | 5 | 7 | 5 | 6 | 4 | 8 | 4 | 8 | 5 | 8 | 7 | 5 | 8 | 8 | **61,3** |
| 14 | **Asseco – MDT Copilot** | Praha | **ÁNO** | 2 | 7 | 5 | 6 | 5 | 6 | 6 | 6 | 5 | 8 | 7 | 6 | 6 | 7 | 6 | 4 | **60,1** |
| 15 | **FNMH – AI Trial Matching** | Praha | **ÁNO** | 4 | 5 | 5 | 6 | 6 | 6 | 5 | 7 | 4 | 8 | 7 | 8 | 3 | 6 | 5 | 7 | **58,6** |
| 16 | **VZP – Kvalita péče na konci života** | Praha/VZP | **ÁNO** | 0 | 6 | 4 | 3 | 4 | 6 | 3 | 6 | 7 | 8 | 5 | 8 | 9 | 6 | 6 | 8 | **57,7** |
| 17 | Onkologický AI průvodce (FN Ostrava) | Ostrava | NIE | – | 8 | 5 | 6 | 4 | 6 | 4 | 8 | 6 | 9 | 5 | 6 | 3 | 5 | 5 | 4 | **56,1** |
| 18 | **Fuck Cancer – Twincer** | Praha | **ÁNO** | 0 | 7 | 4 | 2 | 3 | 4 | 3 | 8 | 4 | 7 | 8 | 5 | 9 | 6 | 6 | 5 | **52,8** |
| 19 | Vzkazy pro budoucnost (FN Olomouc) | Brno | NIE | – | 3 | 4 | 2 | 2 | 3 | 2 | 9 | 9 | 9 | 9 | 4 | 5 | 4 | 8 | 7 | **51,1** |
| 20 | ProstaPaper (MOÚ) | Brno | NIE | – | 3 | 3 | 5 | 3 | 5 | 3 | 6 | 6 | 5 | 6 | 7 | 8 | 5 | 6 | 7 | **50,5** |
| 21 | **NÚVR – Research Matchmaker** | Praha | **ÁNO** | 2 | 3 | 2 | 4 | 4 | 5 | 4 | 8 | 6 | 8 | 6 | 5 | 5 | 6 | 4 | 9 | **50,4** |
| 22 | AI Surgical Copilot (FN Olomouc) | Ostrava | NIE | – | 3 | 5 | 4 | 4 | 5 | 4 | 4 | 4 | 3 | 10 | 5 | 3 | 4 | 6 | 3 | **45,9** |
| 23 | Když realita překoná prognózu (FN Brno) | Brno | NIE | – | 3 | 3 | 3 | 2 | 3 | 2 | 6 | 7 | 8 | 4 | 4 | 6 | 4 | 5 | 8 | **42,7** |

(Bonusová cena InterSystems – 1 500 € za najlepšie použitie AI + FHIR – nie je samostatná výzva; dá sa pridať k hociktorej. Preto nie je v tabuľke.)

### Ako veľmi tomu veriť (poctivo)
- **Dve najvyššie výzvy (TriaLink, EduAIttractive) sú v Brne – pre nás nedostupné.** Ich pražský ekvivalent (AI Trial Matching) má 4 tímy a horšie dáta, preto skóroval len 58,6.
- **Známky dávali rôzni analytici, každý pre svoju výzvu.** Mali spoločnú stupnicu (5 = priemer), ale neboli navzájom „prekalibrovaní“. Rozdiel menší ako ~3 body je šum.
- **Test citlivosti (náš výpočet):** keď zmeníme váhy, prvé dve miesta sú vždy Cesta pacienta a Plíce včas; mení sa len ich poradie.

| Scenár váh | 1. miesto | 2. miesto | 3. miesto |
|---|---|---|---|
| Naše váhy (zadané) | Cesta 69,8 | Plíce 68,9 | MEDDI 65,3 |
| Všetky váhy rovnaké | Cesta 69,3 | Plíce 69,3 (remíza) | MEDDI / mamograf 64,7 |
| Len hodnota nápadu (bez partnera, konkurencie, wow, fitu) | **Plíce 69,7** | Cesta 69,2 | MEDDI / mamograf 65,8 |
| Len dopad a dopyt (veľkosť, zdravie, čas, peniaze, bottleneck, platba) | Cesta 65,1 | Plíce 64,2 | SMART ONCO 63,1 |
| Len šanca vyhrať (realizovateľnosť, wow, partner, konkurencia, dáta) | Cesta 78,0 | Plíce / MEDDI / Koniec života 74,0 | – |

**Záver:** voľba „Cesta alebo Plíce“ je rozhodnutie o tom, čo chceme viac. Cesta = silnejší partner (VZP + ministerstvo), akútnejší dopyt a jasnejší kupec. Plíce = väčší dopad na zdravie a menej konkurencie. Preto platí rozhodovacie pravidlo z časti 1.

**Zmena oproti `00-SUHRN.md` (13:00):** vtedy sme odporúčali mamograf. O 13:00 však 6 výziev nemalo zadanie. Teraz má mamograf 3 pražské tímy (jeden z nich, mammo_prg, je silný v strojovom učení), samotný model je bežná vec a dôkaz, že lepšie texty listov zvýšia skutočnú účasť, chýba. Preto klesol na 4. miesto (64,5).

---

## 3. Top 3 detailne

### 3.1 VZP – Cesta pacienta bez ztráty informací (69,8) – ODPORÚČANÉ

**Problém očami užívateľa.** Koordinátorka v KOC (napr. „Lucie“; môže byť aj nelekárka so SŠ/VŠ vzdelaním) dostane ráno od praktika žiadosť: „Alena, 63, podozrenie na nádor pankreasu, urgentne.“ Epikríza nemá výsledky, len zoznam, kde sú. Lucie volá a píše na 5 pracovísk, čaká na PDF, fotky a CD. Objednáva CT, biopsiu a odbery a termíny drží v hlave a v e-maile. Pred konzíliom prepisuje údaje do podkladu a na poslednú chvíľu príde otázka „a aký je výkonnostný stav (ECOG)?“ – nikde nie je. Prípad má na konzíliu 2–4 minúty. Po konzíliu pošle záver praktikovi a nevie, či ho dostal. (Ilustrácia zložená zo zadania a vystúpení expertov, nie meraný deň [odhad]; detail v `vyzvy/vzp-cesta-pacienta.md` §2.)

**Dôkazy (čísla so zdrojom):**

| Fakt | Číslo | Zdroj |
|---|---|---|
| Pľúca v ČR: liečba nezačne do 8 týždňov od CT | **viac ako 60 %** pacientov | [MZ ČR 2. 9. 2026](https://mzd.gov.cz/tiskove-centrum-mz/jeden-kontakt-mene-cekani-rychlejsi-cesta-k-lecbe-koordinatori-meni-peci-o-onkologicke-pacienty/) |
| Koordinátor v každom z 15 KOC od 1/2026, 250 Kč za výkon; aplikácie sa len pilotujú | „nižšie desiatky mil. Kč ročne“ | tamže |
| Meškanie liečby zvyšuje riziko úmrtia (pozorovacie štúdie, nie randomizované) | +6–8 % na každé 4 týždne pri operácii | [Hanna, BMJ 2020](https://doi.org/10.1136/bmj.m4087) |
| Keď cudzie snímky nie sú dostupné, vyšetrenie sa opakuje | 72 % vs. 11 %, keď sú nahraté v archíve | [AJR 2012](https://doi.org/10.2214/ajr.11.6890) |
| Konzílium pri pankrease (Leeds, UK): neúplné podklady pri odoslaní | 65 % pacientov, priemerne 217 s na pacienta [S] | [Pancreatic Cancer UK](https://www.pancreaticcancer.org.uk/wp-content/uploads/2020/10/Improving-MDT-function-Alastair-Young.pdf) |
| ČR: konzílium sa dostane k ~60 % nových pacientov (odporúča sa ~80 %); pri pankrease poisťovňa platí liečbu až po konzíliu | – | [OECD/EK Czechia 2025](https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-cs-2025-1663-v2-en.pdf) |
| Pankreas v ČR: 5-ročné prežitie | 9,3 %; 55 % zachytených v pokročilom štádiu | [ÚZIS Novotvary 2019–2021](https://www.uzis.cz/res/f/008447/novotvary2019-2021.pdf) |
| Náš prípad: od prvej návštevy u praktika po konzílium | 50 dní, z toho 31 dní, kým sa prípad vôbec dostal do KOC | (náš výpočet z fiktívnych dátumov zadania) |
| Trh: AI na príjem odporúčaní (USA, Tennr) | séria C 101 mil. USD [S] | [Fierce Healthcare](https://www.fiercehealthcare.com/health-tech/tennr-clinches-101m-build-out-ai-automates-patient-referral-workflows) |

**Čo nemáme:** koľko minút koordinátor reálne strávi prípravou jedného prípadu a ako často sa konzílium odkladá pre chýbajúci údaj v ČR [?]. Treba sa dnes osobne spýtať mentorov (časť 7).

**Riešenie (jednoduchý produkt „NIT“ – aby sa niť cesty pacienta nepretrhla).** Štyri obrazovky = štyri kroky zadania:
1. **Prevziať:** praktik pretiahne epikrízu a správy, vyberie centrum, klikne „Odoslať“. Žiadny formulár.
2. **Vyťažiť:** vľavo časová os 13 dokumentov, vpravo podklad pre konzílium (20 položiek podľa šablóny VZP). Klik na hodnotu ukáže zdroj. Tri stavy: **vytiahnuté** / **chýba** / **rozpor**. Ukazovateľ „18 z 20“. Tlačidlo „Vyžiadať“ pripraví žiadosť o chýbajúcu správu. Lekár stlačí „Potvrdiť“.
3. **Koordinovať:** zoznam pacientov (nový / aktívny / odložený); pri pacientke plán krokov (CT → biopsia → odbery → histológia → konzílium) s vlastníkom, termínom a upozornením, keď sa termín minie.
4. **Spätná väzba:** zápis z konzília vytvorený len z údajov známych v deň konzília (21. 10.; správy, ktoré vznikli neskôr, sú viditeľne vyradené). Záver ide praktikovi s dôkazom doručenia a prípad sa uzavrie.

**Poistky:** AI vracia ku každému údaju doslovný citát a kód overí, že citát v dokumente naozaj je – inak údaj zahodí („bez domýšľania“, ako žiada zadanie). Pravidlá bez AI chytia pasce v dátach: ECOG nikde nie je; dátum poslednej dávky lieku na riedenie krvi je po výkone; histológia má dátum odberu po dátume vydania; váha je z rôznych dátumov. Výstup aj ako FHIR (voliteľne do InterSystems IRIS – bonus 1 500 €).

**„Šialený“ variant – NIT Agent (koordinátor, ktorý nespí):** agent sám číta schránku koordinácie (e-mail, PDF, sken), zakladá prípady, vyžiada chýbajúce správy a snímky (hlasový hovor len ako nahraná simulácia s fiktívnymi číslami, nikdy skutočný hovor), 3 dni vopred varuje, že prípad nestihne 2-týždňový cieľ, a ukáže „digitálne dvojča cesty“ s posuvníkom času – kde sa strácali dni. Stránka „Moja cesta“ pre pacientku a dcéru jednoduchou rečou. **Len ak je jadro hotové do ~03:00.**

**3-minútový pitch (cca 70 s video + reč):**

| Čas | Obsah |
|---|---|
| 0:00–0:20 | Hák: „Alena, 63 rokov (fiktívna pacientka zo zadania VZP): 13 správ, 50 dní od praktika po konzílium, 31 z nich, kým sa vôbec dostala do centra.“ + „V skutočnosti viac ako 60 % pacientov s rakovinou pľúc nezačne liečbu do 8 týždňov.“ (MZ ČR) |
| 0:20–0:35 | Kto: koordinátorka v KOC, od januára v každom z 15 centier. Zadanie VZP samo píše: ďalším krokom je nástroj. |
| 0:35–1:45 | **Video zo skutočnej obrazovky:** pretiahnuť 13 správ → podklad za sekundy → klik na údaj ukáže zdroj → „ECOG chýba, nemožný dátum lieku, rozpor v histológii“ → plán a kto je na ťahu → zápis z konzília len z údajov k 21. 10. → odoslané praktikovi, doručené, otvorené. |
| 1:45–2:10 | Dôvera: AI navrhne, človek potvrdí; každý údaj s overeným citátom; žiadna diagnóza ani liečba; fiktívne dáta; FHIR. Čísla z dema: „X z 20 polí s overeným citátom, 0 vymyslených hodnôt, Y nájdených dier a rozporov“ (doplniť po behu). |
| 2:10–2:40 | Pilot na jednom riadku: 1 KOC, 3 mesiace, 50–100 nových prípadov; KPI: čas od žiadosti po kompletný podklad, počet dier nájdených pred konzíliom, počet odložených konzílií, minúty koordinátora; pravidlá stop/go podľa šablóny VZP. |
| 2:40–3:00 | Tím a žiadosť: 60 minút s generálnym riaditeľom VZP + pilotné centrum. |

**Námietky skeptika a ako ich vyriešime:**

| Námietka | Odpoveď / riešenie |
|---|---|
| „To postaví každý tím – AI prečíta PDF.“ | Áno, preto rozhodne kvalita: citát overený kódom (nie sľubom), chytené pasce, ktoré autori zadania dali do dát, a uzavretá slučka s dôkazom doručenia. Väčšina tímov skončí pri extrakcii. |
| „Máte jednu pacientku – je to ušité na mieru.“ | Pripravíme druhý vymyslený prípad (napr. pľúca) a tlačidlo „nahraj novú správu“ naživo pred zadávateľom. |
| „Kto to zaplatí? VZP Inovačný portál procesné nástroje zatiaľ výslovne nepokrýva a vyžaduje úsporu aspoň 5 %.“ | Pravda ([inovace.vzp.cz](https://inovace.vzp.cz)). Priamy český trh je malý: ~1–7 mil. Kč ročne pri našom scenári (náš výpočet). Cesta k peniazom: pilot v 1 KOC, program koordinátorov ministerstva, modul pre dodávateľov nemocničných systémov, slovenský OnkoAsist (tender ~11 mil. €, stav neznámy [?], [TASR](https://www.teraz.sk/zdravie/k-liecbe-rakoviny-sa-ludia-dostanu-po/641984-clanok.html)). Úhradu nesľubujeme. |
| „Softvér nevyrobí voľný termín na CT.“ | Súhlas. Rieši prestoje a stratené informácie medzi krokmi, nie kapacity. V pitchi to povieme presne takto. |
| „AI si vymyslí hodnotu – pri pankrease je zápis z konzília aj podklad k platbe.“ | Bez overeného citátu žiadna hodnota; rozpory ukazujeme vedľa seba, nehádame; potvrdzuje lekár. |
| „Nemáte v tíme klinika.“ | Mentori na mieste sú autori zadania; demo im ukážeme ešte v noci alebo ráno. Nástroj o liečbe nerozhoduje. |

**Riziká:** (1) Konkurencia: 2 pražské tímy (MediBit, smetytech.), tím FIT/S sa o výzvu zaujíma → odhad 2–4. (2) Prístup k AI cez Azure sa niektorým tímom oneskoril; záloha = vlastný kľúč (dáta sú fiktívne). (3) Príliš veľa funkcií na úkor spoľahlivosti jadra. (4) Po hackathone: MDR (či je to zdravotnícka pomôcka [?]), GDPR, klinická zodpovednosť, 8 „povinných brán“ VZP. (5) Ostravský tím MEMOyA má podobný hotový základ; teraz nie je na tabuli, hrozba až vo finále [?]. (6) Organizátor T. Studeník napísal, že do finále idú víťazi výziev „vrátane VZP zo všetkých miest“ (Slack #02-dotazy, 15. 10.), formálne potvrdenie, že VZP vyhlási pražského víťaza osobitne, chýba [?].

---

### 3.2 AZ – Plíce včas (68,9) – 2. voľba

**Problém očami užívateľa.** Praktická lekárka má stovky až tisíce registrovaných pacientov a program jej hovorí: „vyberte fajčiarov 55–74 rokov s ≥20 balíčkorokmi“ (balíčkorok = krabička denne počas jedného roka). Vek vie vyfiltrovať, ale fajčenie je vo voľnom texte („fajčil krabičku denne“), niekde chýba, niekde si dva záznamy odporujú, a či pacient nemal nedávno CT v inej nemocnici, nevie. Nemá na to čas, tak to nerobí. 63-ročného fajčiara tak nikto nikdy neosloví.

**Dôkazy:**

| Fakt | Číslo | Zdroj |
|---|---|---|
| Úmrtia na rakovinu pľúc v ČR | viac ako 5 000 ročne; 67 % zistených v pokročilom štádiu | [prevenceproplice.cz](https://www.prevenceproplice.cz) |
| Prežitie podľa štádia (ČR) | štádium 1: 62 %, štádium 4: 6 % | [OECD/EK Czechia 2025](https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-cs-2025-1663-v2-en.pdf) |
| Skríning LDCT znižuje úmrtia na rakovinu pľúc | o 20 % (NLST), o ~24 % u mužov (NELSON) | [NLST](https://pmc.ncbi.nlm.nih.gov/articles/PMC4356534/), [NELSON](https://europepmc.org/article/MED/31995683) |
| Český program: oslovení vs. súhlasili (VZP, do Q1 2026) | 43 735 oslovených, 29 278 súhlasilo (67 %, náš výpočet) | [VZP 28. 7. 2026](https://www.vzp.cz/o-nas/aktuality/screening-rakoviny-plic-absolvovalo-od-jeho-spusteni-temer-30-tisic-klientu-vzp-jen-vloni-to-bylo-14-tisic) |
| Oprávnených v celej krajine | odhadom 250–500 tisíc | [prevenceproplice.cz – pre lekárov](https://www.prevenceproplice.cz/cs/pro-lekare/) |
| Prečo to nejde: slabé zapojenie praktikov, slabá účasť po odoslaní | – | [OECD/EK Czechia 2025](https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-cs-2025-1663-v2-en.pdf) |
| Cena skríningu | +1 631 USD na osobu, 81 000 USD za rok života v kvalite (oplatí sa, ale platiteľovi nešetrí) | [Black, NEJM 2014](https://europepmc.org/article/MED/25372087) |

Zlyháva teda hlavne **vyhľadanie a oslovenie**, nie ochota ľudí (keď ich oslovia, dvaja z troch súhlasia; pozor, oslovujú ich motivovaní lekári, takže číslo je asi nadhodnotené).

**Riešenie (jednoduchý produkt „DechRadar“).** Princíp: **pravidlá rozhodujú, AI číta a píše, človek schvaľuje.** Štyri obrazovky: (1) dnešný prehľad s lievikom 300 skontrolovaných → vhodní → oslovení → prečítali → zaujíma ich → u praktika; (2) kartička pacienta so semaforom, vetou „Prečo?“ so zdrojmi, navrhnutým kanálom (portál / list / úloha pre praktika) a tlačidlami Schváliť / Upraviť / Preskočiť; (3) „Na kontrolu“ – čo chýba a čo doplniť; (4) pravidlá s prepínačom balíčkorokov (≥20 ako reálny program vs. „ignorovať“ ako v slide zadania) a živými počtami. AI má zmysel tam, kde pravidlá zlyhajú: číta voľný text s poškodenou diakritikou a píše neutrálne správy s kontrolou, že nepovedia diagnózu ani „ste zaradený“. Pasce v dátach: 60 z 300 ľudí má len 7,5 balíčkoroka; 30 má chybne predpočítané balíčkoroky (28 namiesto 56); 28 riadkov má chýbajúci stĺpec (náš výpočet, `vyzvy/az-plice-vcas.md` §1.3). FHIR export (úloha, správa, súhlas) na bonus InterSystems.

**„Šialený“ variant – DechRadar Autopilot:** český AI hlas zavolá ľuďom bez portálu (so súhlasom, na syntetické číslo), za 40 s vysvetlí program, položí 3 otázky, pri varovných príznakoch odporučí volať praktika alebo 155; „pripomienka v reálnom čase“, keď oprávnený pacient príde do nemocnice z iného dôvodu; anonymný národný radar oslovenia po krajoch pre VZP. Odporúčam len ako nahrané video/víziu.

**3-minútový pitch:** hák „Viac ako 5 000 úmrtí ročne. V 1. štádiu prežije 62 %, v 4. štádiu 6 %. Program zadarmo existuje, no ľudí musí vyberať praktik z hlavy.“ → používateľ (sestra/praktička bez času) → video: 300 pacientov, lievik za 2 sekundy, kartička „Prečo“, doplnenie chýbajúceho údaja, správa po česky, schválenie, simulované odpovede, úloha pre praktika, prepínač balíčkorokov („60 ľudí by sme oslovili zbytočne“) → dôvera (rozhoduje pravidlo, AI nič nediagnostikuje, dáta neidú k AstraZenece) → pilot (1 pneumologická ambulancia + 3 ordinácie s AZ a pneumologickou spoločnosťou; meriame podiel oslovených z oprávnených a koľkí došli na LDCT).

**Námietky skeptika a riešenie:**

| Námietka | Odpoveď / riešenie |
|---|---|
| „Je to len filter v tabuľke, kde je AI?“ | AI číta poškodený voľný text a píše bezpečné správy; pridáme uzavretý cyklus (kto reagoval, čo ďalej) a FHIR. Bez toho by sme naozaj vyzerali ako ostatní. |
| „Kto to zaplatí?“ | Za LDCT platí VZP, za nástroj zatiaľ nikto. VZP portál chce úsporu, skríning náklady zvyšuje. Reálne: AstraZeneca ako sponzor pilotu (napísala, že chce prototyp preklopiť do praxe), potom nemocnice/praktici. Netvrdiť opak. |
| „Zadanie si odporuje (balíčkoroky áno/nie, CT vs. LDCT).“ | Prepínač v aplikácii + otázka mentorovi (AstraZeneca). |
| „Lepšie správy nezvýšia účasť – dôkaz chýba.“ | Pravda ([JAMA Netw Open 2026](https://doi.org/10.1001/jamanetworkopen.2026.16822): AI texty zvýšili len krátkodobý záujem, nie očkovanie). Povieme „meriame to v pilote“, nie „zvýšime účasť o X %“. |
| „AstraZeneca nie je v nedeľnej porote.“ | Vo finále argumentujeme národným programom, číslami VZP a OECD – to zaujíma VZP a ministerstvo. |

**Riziká:** malá „AI“ a „wow“ zložka; nejasný kupec; citlivá téma (kritický článok „Každé páté CT plic je omyl“, 12. 2. 2026) – správy musia byť neutrálne; farmafirma nesmie dostať osobné údaje a komunikácia musí byť bez značky; do 19:00 môžu prísť ďalšie tímy (odhad 2–3 spolu). Dva dátové súbory (pacienti, CT) sme nevideli [?].

---

### 3.3 MEDDI ONCO Challenge (65,3) – 3. voľba

**Problém očami užívateľa.** Sestra v monitorovacom centre MOÚ (po–pi 7:00–15:30) má na starosti tisíce pacientov na liečbe doma (MEDDI uvádza viac ako 15 500 pacientov v systéme – tvrdenie firmy). Pacientka v stredu o 21:52 napíše: „mám 38,4, trasie ma, mám si dať Paralen a počkať do rána?“ Farba dotazníka je žltá. Centrum je zatvorené.

**Dôkazy:**

| Fakt | Číslo | Zdroj |
|---|---|---|
| Farba dotazníka prehliadne závažné stavy (v dátach výzvy, fiktívne) | 13 z 19 oranžových/červených záznamov má len zelenú/žltú farbu; 2 horúčky s triaškou len žlté | (náš výpočet z dát MEDDI, `vyzvy/meddi-onco.md` §2.4) |
| Hlásenie príznakov z domu (ePRO) | lepšia kvalita života 34 % vs. 18 %, pohotovosť 34 % vs. 41 % | [Basch, JCO 2016](https://europepmc.org/article/MED/26644527) |
| Prežitie sa vo veľkej štúdii nepotvrdilo | HR 0,99; čas do prvej pohotovosti dlhší (HR 0,84) | [PRO-TECT, Nat Med 2025](https://doi.org/10.1038/s41591-025-03507-y) |
| Pohotovosť u pacientov na liečbe (USA) | 27 % aspoň raz za rok, 53 % z nich riešiteľných ambulantne | [ASCO Post](https://ascopost.com/News/55724) |
| Samotný jazykový model na triáž nestačí | macro-F1 ~0,475 v 4-stupňovej triáži (preprint) | [arXiv 2605.15680](https://arxiv.org/abs/2605.15680) |

**Riešenie (jednoduchý produkt „Druhé oči“).** AI semafor, kde pevné pravidlá zo zadania sú „podlaha“ (nižšie sa nejde), AI pridá kontext, trend a voľný text (aj slovensky a bez diakritiky) a výsledok je vždy to vyššie z oboch. Tri obrazovky: front sestry zoradený podľa naliehavosti so súhrnom na 30 sekúnd; obrazovka pacienta („Je to v poriadku? Čo teraz? Kedy sa ozve tím?“); dôkazová stránka – prehranie všetkých 171 záznamov v čase s cieľom 19 z 19 zachytených a 0 podhodnotených + nahranie skrytých pacientov poroty jedným klikom. Smerovanie podľa pracovných hodín robí kód, nie AI.

**„Šialený“ variant – AI nočná sestra, ktorá zavolá:** hlasový agent po česky/slovensky sám osloví pacienta, keď chýbajú záznamy alebo rastie trend, položí 3–5 otázok (aj pečujúcej dcére), skončí jasným krokom a sestre vytvorí lístok s prepisom. Hlas je výslovný bonus, ktorý majiteľ MEDDI „ocení“ (zadanie, slide 12).

**3-minútový pitch:** hák „streda 21:52, 38,4 °C, ‚počkať do rána?‘, dotazník žltá – AI červená“ → číslo 13 z 19 → video (horúčka po chemoterapii, imunitná kolitída 3 → 4 → 8 stolíc za 3 dni, slovenský text + hlas, front sestry) → „pravidlá sú podlaha, vždy rozhodne človek“, výsledok prehrania 171 záznamov → pilot v tieňovom režime v MOÚ.

**Námietky skeptika a riešenie:**

| Námietka | Odpoveď / riešenie |
|---|---|
| „AI podhodnotí červenú – to je najhoršia chyba.“ | Pravidlá ako podlaha, pri nejasnosti +1 úroveň a doplňujúca otázka, test na 3 pacientoch vynechaných z ladenia. |
| „Bude to ďalší triážny prompt, tímov bude veľa.“ | Odlíši nás dôkazová stránka (prehranie 171 záznamov) a hlas. Dnes 1 tím (Přemke), odhad 3–5. |
| „Kto to zaplatí v ČR?“ | Telemedicína je v ČR väčšinou bez úhrady; kupec je MEDDI (dodávateľ) + MOÚ; Nemecko platí podobné aplikácie ~400 € za štvrťrok [S]. |
| „Sľubujete dlhší život?“ | Nie – PRO-TECT to nepotvrdil. Hovoríme o kvalite života a menej pohotovostiach. |

**Riziká:** najvyššie regulačné riziko z top 3 (triáž by v ostrej prevádzke bola zdravotnícka pomôcka podľa MDR [?]); skrytá sada 6 pacientov môže odhaliť chybu; slabý fit s Maťovou radiačnou ochranou; limity zdieľaného AI rozhrania.

---

## 4. Prečo NIE ostatné (1 riadok každá)

**Pražské (dostupné):**
- **VZP – mamograf (64,5):** 3 pražské tímy už teraz (vrátane ML-silného mammo_prg), model je komodita, dôkaz o účinku lepších listov chýba a kupcom je VZP interne; tesný 4. kandidát, ak by sme chceli hrať na komunikáciu a marketing.
- **VFN – SMART ONCO AA (64,2):** málo tímov (1), no zadanie sme nevedeli prečítať (66 MB obrázkový deck), dáta sa posielajú súkromne a anesteziológ-zadávateľ bude tvrdo pýtať klinickú zodpovednosť.
- **FNMH – Hlídač nežádoucích účinků (61,5):** dataset nie je zverejnený a nemá správne odpovede, MEDDI rieši to isté s lepšími dátami, triáž má najvyššie regulačné riziko.
- **FNMH – PACS Comparator (61,3):** najlepší fit pre Maťa, ale archív snímok treba vymyslieť, dáta sú neznáme, kupec nejasný a teraz už 2 tímy (pribudol walking legs).
- **Asseco – MDT Copilot (60,1):** najširšie zadanie (riziko plytkého výsledku), dáta stále nie sú, teraz 2 tímy (pribudol Pražský Meridian) a silný ostravský súper vo finále.
- **FNMH – AI Trial Matching (58,6):** zmysluplný problém, ale najviac konkurencie v Prahe (4 tímy) a v dátach chýbajú kritériá štúdií aj správne odpovede.
- **VZP – Kvalita péče na konci života (57,7):** 0 tímov = ľahšia cesta do finále, ale je to analytika bez kupca, bez úspory času a s malým „wow“.
- **Fuck Cancer – Twincer (52,8):** 0 tímov a silné video pre Bruna, ale nikto veľký za to nezaplatí, slabý dôkaz zdravotného prínosu a obrovský rozsah na 1 noc.
- **NÚVR – Research Matchmaker (50,4):** nepriamy dopad na pacienta, žiadny platca, riziko vymyslených tvrdení o reálnych vedcoch.

**Brno / Ostrava (pre pražský tím nedostupné – formulár ich neponúka a treba byť fyzicky v meste):**
- **TriaLink (71,9):** najlepší nápad celkovo, ale v Brne; pražský ekvivalent Trial Matching má 4 tímy.
- **EduAIttractive (70,8):** najlepší fit pre Bruna (AI video), ale v Brne a bez pražského ekvivalentu.
- **Plánovanie stacionára (66,6):** dobrá úloha na optimalizáciu, v Ostrave; dáta len za 30 dní.
- **PillGaze (65,7):** silné wow (fotka liekov), v Brne; 3 tímy a riziko pri kontrole interakcií.
- **AI asistent MDT, FN Ostrava (63,7):** preplnená téma, v Ostrave.
- **AI NOR (62,3):** „byrokracia“ s malým dopadom na zdravie, v Ostrave.
- **Onkologický AI průvodce (56,1):** ďalší chatbot, v Ostrave, silný súper.
- **Vzkazy pro budoucnost (51,1):** krásny príbeh, ale bez platcu a bottlenecku; v Brne.
- **ProstaPaper (50,5):** veľmi úzka nika, v Brne.
- **AI Surgical Copilot (45,9):** najväčšie wow, ale výskumná úloha, za noc nereálna; v Ostrave.
- **Když realita překoná prognózu (42,7):** malá kohorta (157 detí), slabý obchodný ťah; v Brne.

---

## 5. Kľúčové trendy a bottlenecky sveta (8 bodov) a ako sa na ne viaže odporúčanie

1. **Čas do liečby je najväčšia bolesť.** Každé 4 týždne meškania zvyšujú riziko úmrtia o 6–8 % pri operácii ([Hanna, BMJ 2020](https://doi.org/10.1136/bmj.m4087)); ani Anglicko neplní 62-dňový cieľ (71,2 % vs. 85 %, [NHS júl 2026](https://www.england.nhs.uk/statistics/wp-content/uploads/sites/2/2026/09/Cancer-Waiting-Times-Statistical-Release-July-2026-Provider-based-Provisional.pdf)); v ČR viac ako 60 % pľúcnych pacientov nezačne do 8 týždňov ([MZ ČR](https://mzd.gov.cz/tiskove-centrum-mz/jeden-kontakt-mene-cekani-rychlejsi-cesta-k-lecbe-koordinatori-meni-peci-o-onkologicke-pacienty/)). → **Cesta pacienta mieri presne sem.**
2. **Informácie sa strácajú medzi pracoviskami a vyšetrenia sa opakujú:** 72 % vs. 11 % ([AJR 2012](https://doi.org/10.2214/ajr.11.6890)); v ČR beží viac nekompatibilných sietí na zdieľanie dokumentov (pre-hack deň, `02`). → **Cesta (podklad + riadok „snímky“ od Maťa).**
3. **Personálu chýba čas:** lekár 27 % času pri pacientovi a 49 % pri počítači ([Sinsky 2016](https://doi.org/10.7326/M16-0961)); 84 % mladých onkológov v strednej Európe má známky vyhorenia ([Banerjee 2017](https://doi.org/10.1093/annonc/mdx196)). → **Náš produkt nesmie pridať ani jeden formulár.**
4. **Konzílium má na prípad 2–4 minúty a podklady bývajú neúplné** (Leeds: 65 % neúplných podkladov [S], [Pancreatic Cancer UK](https://www.pancreaticcancer.org.uk/wp-content/uploads/2020/10/Improving-MDT-function-Alastair-Young.pdf)); v ČR je konzílium podmienkou úhrady inovatívnych liekov a dostane sa k ~60 % pacientov ([OECD 2025](https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-cs-2025-1663-v2-en.pdf)). → **Výstupom Cesty je práve kompletný podklad pre konzílium.**
5. **Skríning zachraňuje životy, ale chodí naň málo ľudí:** ČR hrubé črevo 29 % (EÚ 42 %), adresné listy VZP fungujú u ~19 % už 10 rokov ([VZP 2015](https://www.vzp.cz/o-nas/aktuality/kazda-5-pozvanka-uspela-na-mamograf-loni-prislo-o-120-tisic-zen-vice-nez-pred-sedmi-lety)); zásahy fungujú (OR 1,55, [Ferrari 2025](https://doi.org/10.3389/phrs.2025.1607873)), ale personalizované AI správy zatiaľ dôkaz nemajú. → **Plíce včas a mamograf (alternatívy).**
6. **Sledovanie pacientov doma (ePRO)** zlepšuje kvalitu života a znižuje pohotovosti, no prežitie veľká štúdia nepotvrdila ([PRO-TECT](https://doi.org/10.1038/s41591-025-03507-y)) a funguje len vtedy, keď je určený človek, ktorý na signál reaguje. → **MEDDI (alternatíva); lekcia pre všetky: vždy skončiť u človeka.**
7. **Peniaze idú do AI na „papierovú prácu“ a dáta:** digitálne zdravie v USA 14,2 mld. USD v 2025, 54 % do AI firiem ([Rock Health](https://rockhealth.com/insights/2025-year-end-digital-health-funding-overview-a-tale-of-two-markets/)); AI zapisovateľ však v randomizovanej štúdii ušetril len ~9,5 % času ([NEJM AI 2025](https://doi.org/10.1056/aioa2501000)). → **Cesta je v tomto segmente; sľubovať len to, čo zmeriame v deme.**
8. **Kto v ČR platí a regulácia:** VZP od 21. 9. 2026 spustila Inovačný portál, onkológia je prvá tematická výzva (od októbra / 1. 11. [?]), na 2027 sa spomína až 300 mil. Kč [?], podmienky: ľudský dohľad, GDPR, ≥5 % úspora ([inovace.vzp.cz](https://inovace.vzp.cz), [Hlavinka 29. 9.](https://www.vzp.cz/o-nas/aktuality/hlavinka-digitalni-technologie-uz-pouzivame-je-na-case-naucit-se-hodnotit-jejich-prinos)); Európa tlačí na štandardy (EHDS 2027–2031 [S]) a dohľad nad AI pre pacientov ([ESMO ELCAP](https://pubmed.ncbi.nlm.nih.gov/41111032/) [S]). → **Návrh „AI navrhne, človek potvrdí, výstup FHIR“; pozor, pre procesné nástroje je portál zatiaľ neistý.**

---

## 6. Hodnota partnerov a networku pre top 3

Hodnota 1–10 podľa `09` (10 = rozhoduje o nasadení aj peniazoch, má verejný kanál financovania a sedí v porote).

| | Cesta pacienta | Plíce včas | MEDDI ONCO |
|---|---|---|---|
| **Hlavný partner** | **VZP (10/10)** + ministerstvo (7/10) + mentori z VFN a FNMH (FNMH 9/10) | **AstraZeneca (6/10)** + pneumologická spoločnosť (mentorka je jej 1. podpredsedníčka) | **MEDDI hub (8/10)** + MOÚ ako zákazník (7/10) |
| **Kto rozhoduje v sobotu** | autori zadania (VFN, FNMH; garant podľa `09` z ministerstva [?]) | AstraZeneca + mentorka | zadávateľ MEDDI na mieste v Prahe |
| **Kto sedí v nedeľnej porote** | Hlavinka (VZP), Foldyna Hellová (ministerstvo), Pavlíček (IT FNMH) – program koordinátorov je ich | AstraZeneca **nie**; pomôže argument národného programu (VZP, ministerstvo, pacientska organizácia) | Pecina (majiteľ MEDDI) **áno** |
| **Čo môžeme získať** | cena „Křeslo pro inovace“ (60 min s generálnym riaditeľom VZP) – súperíme o ňu s víťazmi ostatných VZP výziev; cesta k pilotu v KOC; Inovačný portál, ak pripustí procesné nástroje [?] | AZ výslovne sľubuje podporu pri prenose do praxe; pilot s ambulanciou | MEDDI ONCO Award, workshop a možný skúšobný projekt; majiteľ rozhoduje sám |
| **Slabina** | VZP má deficit a platí len za preukázanú hodnotu; potrebujeme právnickú osobu a klinického partnera | farmafirma má prísne pravidlá, nenakupuje nemocničné IT | MEDDI nie je platca; český trh vníma skepticky |
| **Spoločné pre všetky** | InterSystems (8/10): cena 1 500 € za skutočné použitie FHIR/IRIS, inkubátor Caelestinus (spojený s organizátorom) | | |

**Prakticky:** najväčšiu sieť dáva Cesta – jedno víťazstvo nás postaví pred platcu (VZP), ministerstvo aj najväčšiu nemocnicu naraz. Pri Plíciach je sieť užšia (farma), pri MEDDI hlbšia, ale len s jednou firmou.

---

## 7. Čo ešte overiť do 19:00 (max 5 bodov) + praktické

1. **~18:30 tabuľa tímov** ([submit.rakathon.cz/vyzvy](https://submit.rakathon.cz/vyzvy)). Pri písaní: Cesta 2, Plíce 1, MEDDI 1; nevybrali Ctrl+Alt+CURE, FIT/S, FSMZ. Uplatnite pravidlo z časti 1 (Cesta ≥5 a Plíce ≤2 → prepnúť).
2. **Osobne mentori Cesty (sú v Prahe):** jedno reálne číslo z KOC – koľko minút trvá príprava prípadu na konzílium, koľko prípadov týždenne, ako často sa konzílium odkladá pre chýbajúci údaj – a čo presne chcú v sobotu vidieť. Jedno číslo z reality zdvojnásobí silu pitchu.
3. **Organizátor:** dĺžka finálového pitchu (3 min vs. ~5 min s otázkami), či sú GitHub a video povinné, a potvrdenie, že VZP vyhlási pražského víťaza Cesty osobitne.
4. **Prístupy:** funguje AI rozhranie cez Azure (kartička kapitána, formulár)? Ak nie, záložný vlastný kľúč (dáta sú fiktívne). Kľúče nikdy do repa.
5. **Kapitán potvrdí výzvu** na `submit.rakathon.cz/vyzvy/vybrat` **do 19:00** a rozhodnutie zapíšte do `docs/DECISIONS.md`.

**Praktické (z oficiálnych slajdov, `05` §2):**
- **Odovzdanie: sobota 17. 10. o 13:00 – tvrdý deadline**, po 13:00 formulár nič neprijme. Rozumný cieľ: odovzdať do 12:30.
- **Formulár** (`submit.rakathon.cz`): názov, krátky popis do 140 znakov, voliteľne dlhší popis (CZ/EN), pole „Dopad a AI“ (ako používate AI, aký dopad a pre koho, či používate FHIR od InterSystems), **povinný titulný obrázok 16:9 do 8 MB**, odkazy na GitHub, demo, video (povinnosť nejasná [?]). Galéria projektov je verejná.
- **Sobota 14:00–16:00:** zadávatelia obchádzajú stoly – obaja pri stole s bežiacim demom a záložným videom. 16:00 nahlásenie víťazov, 17:00 vyhlásenie. Víťaz výzvy ide do finále.
- **Nedeľa 18. 10.:** finále v Kampuse Plzeňská (2. LF UK, Praha-Motol), registrácia 13:00, pitche 14:00–16:30 osobne pred porotou, vyhlásenie 17:00. Pribúdajú kritériá škálovateľnosť a kvalita prezentácie a tímu.
- **Pravidlá:** iba prototyp (nie zdravotnícka pomôcka), žiadne reálne dáta pacientov, kód vytvorený pred hackathonom treba priznať a oddeliť, obaja fyzicky na mieste, oficiálny jazyk čeština (pitch môže byť po anglicky). [Pravidlá v1.0 (PDF)](https://bqcunktidwhqgkjnisbp.supabase.co/storage/v1/object/public/terms/terms/1782206443390-Rakathon_2026_pravidla_a_podminky_ucasti_2_.pdf)

---

## Podklady
- Detailné analýzy výziev: `docs/research/vyzvy/vzp-cesta-pacienta.md`, `az-plice-vcas.md`, `meddi-onco.md`, `vzp-mamograf.md` a ďalšie; Brno/Ostrava v `vyzvy/_brno-ostrava.md`.
- Trendy a dôkazy: `07-trendy-a-bottlenecky.md`; český trh a kto platí: `08-cesky-kontext-a-trh.md`; partneri, porota a víťazné vzorce: `09-partneri-a-vitazne-vzorce.md`; pravidlá, termíny a konkurencia: `05-slack-refresh.md`.
- Jednostranový súhrn: `docs/ONE-PAGER.md`.
