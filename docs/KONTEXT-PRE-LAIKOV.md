# Kontext pre laikov: onkológia, koordinátor a naša výzva

_Na 10 minút čítania. Stav: piatok 16. 10. 2026. Zdroje a detaily sú v `docs/kontext/raw-*.md`, kontrola 15 kľúčových faktov v `docs/kontext/raw-factcheck.md`. Značka [?] znamená, že číslo nikto nezverejnil alebo sa zdroje líšia._

## Problém, ktorý riešime (jednou vetou)

**Keď má človek podozrenie na rakovinu, jeho správy a výsledky sú roztrúsené po rôznych lekároch a systémoch, takže koordinátor v onkologickom centre ich ručne naháňa, konzílium nemá všetko včas a praktický lekár sa nedozvie, ako sa rozhodlo, a pacient tak zbytočne stráca dni pred začiatkom liečby.**

## 1. Slovník (10 pojmov, ktoré budete počuť)

| Pojem | Čo to znamená |
|---|---|
| **Praktik (PL)** | Váš obvodný lekár. Väčšinou ako prvý zistí, že niečo nie je v poriadku. |
| **KOC** | Komplexné onkologické centrum. **Nie je to samostatná budova ani firma**, ale „titul“, ktorý dá ministerstvo veľkej nemocnici (alebo skupine max. 3 nemocníc). |
| **ROC** | Regionálne onkologické centrum: menšia nemocnica, zmluvne naviazaná na jedno KOC. |
| **Koordinátor (onkologickej starostlivosti)** | Od roku 2026 ho musí mať každé KOC (niektoré nemocnice ho mali už skôr). „Dispečer“ pacienta: objednáva vyšetrenia, stráži termíny, zbiera podklady. **Nerozhoduje o liečbe a nemusí byť zdravotník.** |
| **MDT / konzílium** | Porada lekárov rôznych odborov (chirurg, onkológ, rádiológ, patológ…), ktorá rozhodne, ako sa bude pacient liečiť. |
| **Handover / podklad pre MDT** | Zhrnutie všetkého o pacientovi, ktoré lekári na konzíliu potrebujú. |
| **NIS** | Nemocničný informačný systém, softvér nemocnice (STAPRO, Asseco, ICZ, Medicalc…). Každá nemocnica môže mať iný. |
| **AIS** | Softvér ambulancie praktika (najčastejšie CGM a MEDaX, spolu asi 70 % [?]). |
| **eŽádanka** | Elektronická žiadanka od lekára k ďalšiemu lekárovi. Od 1. 1. 2026 existuje, ale **vystaviť ju je zatiaľ dobrovoľné**. |
| **Revízny lekár** | Lekár poisťovne, ktorý kontroluje, či je liečba oprávnená. |

## 2. Česko (tu je naša výzva)

**Koľko je centier:** **15 KOC pre dospelých a 2 pre deti**. Oficiálny zoznam vydalo ministerstvo vo februári 2026 a titul platí do roku 2031. Okolo nich je **zhruba 23 regionálnych centier (ROC)**. Patria sem napríklad MOÚ Brno, FN Motol + Homolka, VFN Praha (spolu s Thomayerovou nemocnicou a ÚVN), FN Hradec Králové, FN Olomouc, FN Ostrava a FN Plzeň.

**Kde sú:** KOC je vždy **súčasť nemocnice**: jej onkológia, chirurgia, rádiológia, patológia, ožarovanie, paliatíva, psychológ a sociálny pracovník. Aby nemocnica dostala titul, musí ročne liečiť **aspoň 1 000 nových onkologických pacientov**, mať 2 ožarovacie prístroje, konzíliá a **aspoň jedného koordinátora na plný úväzok**.

**Komu patria:** z 15 KOC je **8 štátnych** (fakultné nemocnice a MOÚ pod ministerstvom), **väčšina ostatných je krajská** (vlastníka sme neoverili pri všetkých [?]) a **1 súkromné** (AGEL Nový Jičín).

**Kto to platí:** platí to **verejné zdravotné poistenie**. V ČR je 7 poisťovní a **VZP je najväčšia** (6,17 mil. klientov, asi 57 %). Na onkológiu dala VZP v roku 2024 **23,7 mld. Kč**. Nemocnica dostáva peniaze za hospitalizácie (paušál podľa diagnózy), za výkony a za drahé „centrové“ lieky, ktoré smie podávať len centrum.

**Koordinátori:**
- **Od kedy:** zaviedlo ich ministerstvo od **1. 1. 2026**. Koncepciu spoluvytváral **Marián Rybář**, garant našej výzvy.
- **Koľko:** každé KOC musí mať **aspoň 1 človeka na plný úväzok**, horná hranica nie je. Podľa webov 5 nemocníc je to v praxi **1 až 3 koordinátori** na onkologické pracovisko (Jihlava 3, Olomouc 2–3, Na Pleši 2, Zlín 1, Ostrava 1 s kontaktom len ut–št 10–12). Celkový počet v ČR **nikto nezverejnil [?]**. Údaje o vyťažení sú len z dvoch rozhovorov: Bulovka **asi 10 pacientov týždenne**, FN Olomouc **15–20 týždenne**. Na ČVUT prebehli dve školenia (16 hodín) pre zhruba 140 záujemcov.
- **Typy (MZ):** koordinátor 1 vedie pacienta od podozrenia po diagnózu, koordinátor 2 pracuje vnútri KOC a chystá podklady pre MDT, koordinátor 3 sa stará o pacienta po liečbe. **Náš užívateľ je koordinátor v KOC, ktorý robí prvé aj druhé:** prezentácia VZP volá „K1“ toho, kto prevezme dokumenty od praktika, dokončí diagnostiku a posunie prípad na MDT. **Pozor:** „KOC 1“ a „KOC 2“ v zadaní sú dve nemocnice (Severní a Lipová), nie typy koordinátora.
- **Platba:** poisťovňa platí nemocnici **250 Kč za každý deň, keď koordinátor niečo urobil pre jedného pacienta** (kód výkonu 51887, najviac 1× denne na pacienta, strop za liečbu nie je). Príklad: 4 dni so zásahom = 1 000 Kč. Peniaze idú **nemocnici**, nie koordinátorovi, a každý zásah musí byť zapísaný, inak poisťovňa nezaplatí. Je to malý bonus, nie platba za liečbu.
- **Nástroje:** podľa predpisu musí koordinátor pracovať v NIS a všetko **preukázateľne zapisovať**. **Štandardný softvér pre neho neexistuje** (MZ spomína len pilotné aplikácie v niektorých KOC), a presne ten chce VZP.

**Čísla:**
- ročne asi **60–65 tisíc** nových rakovín (bez bežnej kožnej) a asi **82–88 tisíc** aj s ňou (ÚZIS; ministerstvo uvádza „vyše 90 tisíc“, ale to nesedí so žiadnym zverejneným rokom, preto v pitchi citujeme ÚZIS),
- s rakovinou žije **vyše pol milióna ľudí**,
- úmrtia: asi **27 tisíc ročne**,
- čakanie: viac ako **60 % pacientov s rakovinou pľúc** nezačne liečbu do 8 týždňov od CT; pri podozrení na nádor tráviaceho traktu môže cesta k diagnóze bez koordinátora trvať až ~2 mesiace (výrok koordinátorky z Bulovky, nie štatistika; MZ 2. 9. 2026),
- konzíliom (MDT) dnes prejde asi **60 % nových pacientov**, odporúča sa 80 %.

## 3. Slovensko (pre Maťa a porovnanie)

- **KOC na Slovensku zatiaľ nie je.** Buduje sa: NOÚ (Národný onkologický ústav) spustil akreditáciu v júni 2025 a odhad je „do 2 rokov“.
- **Centrá:**
  - 3 onkologické ústavy: **NOÚ Bratislava** (štátny), **OÚSA Bratislava** (s.r.o., neštátny) a **VOÚ Košice** (a.s. vlastnená štátom),
  - ďalej asi **13 onkologických oddelení** v nemocniciach a 15 pracovísk rádioterapie.
- **Čísla:** vyše **38 tisíc** nových prípadov ročne (2024, odhad NCZI), **13 337 úmrtí** (asi štvrtina všetkých úmrtí).
- **Platia** 3 poisťovne: VšZP (štátna, ~52 %), Dôvera (~35 %) a Union (~13 %).
- **Oficiálny koordinátor ako v ČR na SR nie je** (nikde sme ho nenašli, ale úplne vylúčiť to nevieme). Existuje len pilot „onkologického sprievodcu“ od Ligy proti rakovine (Agel Levice, marec 2026), ktorý rieši skôr sociálne veci.
- **Konzílium (MDT) na SR nemá úhradový kód**, teda poisťovňa zaň osobitne neplatí.
- **OnkoAsist (NCZI):**
  - **čo to je:** štátny systém „onkologická cesta pacienta“, ktorý má skrátiť cestu od podozrenia po liečbu zo **160–185 dní na ~60**,
  - **cena:** tender asi 11 mil. €,
  - **stav:** obstarávanie od 2023 a k máju 2026 **stále nie je dodaný**.

  Pre nás je to dôkaz, že problém je skutočný a štát ho nevie rýchlo vyriešiť.
- **eZdravie** (NCZI) existuje, ale je technicky zastarané. Od 7/2026 musia lekári vykazovať cez neho, inak im poisťovňa nezaplatí.

## 4. Ako dnes tečú informácie (ČR)

**Neexistuje jedna „diaľnica“ pre dáta pacienta.** Informácie idú naraz mnohými kanálmi. V tabuľke je to, čo sme našli v zdrojoch (rozhovory s koordinátorkami, weby nemocníc, NKÚ, ČT24, MZ; podrobne v `docs/kontext/raw-audit-hry.md`). Čo je overené len čiastočne, je pri riadku označené. **Koľko správ ide ktorou cestou, nikto nezverejnil.**

| Kanál | Čo o ňom vieme (a odkiaľ) |
|---|---|
| **Telefón a e-mail** | Hlavný nástroj koordinátoriek. Koordinátorka vo FN Olomouc hovorí, že pracoviskám telefonuje a píše maily. |
| **Formulár** | Na Bulovke lekár koordinátorke zavolá alebo napíše e-mail a pošle formulár (online, alebo Word e-mailom). V MOÚ Brno vyplní žiadanku na webe. Pre centrá, ktoré operujú pankreas, MZ od 1. 9. 2026 určuje ako kontakt web, e-mail a telefón koordinátora. |
| **Obyčajný e-mail** | Používa sa. Jedna nemocnica (Tišnov) v tendri z roku 2024 píše, že sa ním zdravotná dokumentácia „mnohdy“ posiela. |
| **eZpráva** | Elektronické posielanie správ z nemocnice praktikom. FN Hradec Králové ju lekárom ponúka od júna 2025, používa ju aj Krajská nemocnica T. Bati v Zlíne. |
| **Pošta** | FN Hradec Králové v júni 2025 napísala, že lekárom zaregistrovaným v eZpráve už správy nebude posielať poštou. Dovtedy teda chodili poštou; ako dostávajú správy ostatní, nepíše. |
| **ePACS** | Sieť na posielanie snímok CT a MR medzi nemocnicami. Bulovka chce snímky práve cez ePACS, MOÚ Brno sa vo formulári pýta, či sú dostupné v PACS. Pripojené sú všetky akútne nemocnice (štúdia 2020). Najnovší údaj o využití, ktorý sme našli (2018, od výrobcu), hovorí, že ním išli asi 4 % vyšetrení. |
| **CD so snímkami** | Stále sa používa: v jednej krajskej nemocnici si 15–20 % pacientov pýta snímky na CD (ČT24, 2024). |
| **Papier, ktorý nosí pacient** | Zákon ho dovoľuje. Pacienti niekedy stále nosia papierové správy sami (NKÚ, 2026). |
| **Súkromné siete firiem** (CGM ClinicBox, ICZ MEDDOX, STAPRO MISE, Medicalc mex2) | Podľa prednášky z pre-hack dňa fungujú **len vnútri jednej siete**, medzi sebou nie (niektoré sa práve prepájajú). |
| **Štátne služby** (eŽádanka, eRecept, Sdílený zdravotní záznam) | eRecept funguje. eŽádanka beží od januára 2026, ale je dobrovoľná; do konca júna 2026 ich lekári vystavili asi 2 000 skúšobne. Ministerstvo chce, aby bola povinná od júla 2027 (laboratórne od januára 2028); zatiaľ je to len plán (Vitalia, 29. 6. 2026). **Spoločné miesto pre všetky lekárske správy pacienta nie je**; štát zatiaľ centrálne zbiera laboratórne výsledky. |
| **Fax** | Niektoré nemocnice ho uvádzajú pri žiadankách na PET/CT a MR (AGEL Nový Jičín, FN Olomouc, Náchod). Overené len čiastočne. |
| **Dátová schránka** | Ako bežný kanál medzi lekármi sme ju nepotvrdili [?]. |

**Čo nevieme:**
- Ako sa ku koordinátorovi dostanú správy od praktikov a ambulancií, ktoré nie sú v ePACS. Nikto to nezverejnil.
- Koľko správ ide ktorou cestou.
- V Aleninom prípade zadanie nepíše, akým kanálom prišla žiadosť praktika (len „zaslaním epikrízy“), ako koordinátor dostal správy 01–06 ani ako sa snímky CT dostali z Nemocnice Severní do Lipovej.

**Čo z toho vyplýva:**
- **Každý lekár má iný softvér.** Praktik má AIS, nemocnica NIS. VZP píše, že tieto systémy sú „odlišné a málo kompatibilné“.
- **Lekári opakovane prepisujú údaje**, ktoré už v dokumentácii sú (VZP).
- **Súhlas pacienta** so zdieľaním medzi lekármi, ktorí ho liečia, **nie je potrebný**. Na podanie informácií rodine treba súhlas.
- Výsledok konzília sa **má** poslať praktikovi, ale **zákon neurčuje, akým kanálom, ani ako doložiť, že prišiel**.

## 5. Cesta pacienta v skratke

Celá mapa s mikrokrokmi je v **`docs/MAPA-CESTY-PACIENTA.html`** (a na odkaze z chatu). Pracujeme s dvoma prípadmi. Oba sú fiktívne.

**Súťažná pacientka zo zadania VZP: Alena P., 63 r.** (13 správ z rôznych pracovísk)

1. **Polovica augusta:** začne ju bolieť brucho.
2. **1. 9.:** prvá návšteva u praktika (teplota, podozrenie na infekciu, antibiotiká).
3. **15. 9.:** gastroenterologička; **29. 9.** ultrazvuk nájde ložisko v pankrease.
4. **2. 10.:** praktik posiela žiadosť koordinátorovi v Nemocnici Lipová (v zadaní „KOC 2“).
5. **8. 10.:** CT v Nemocnici Severní („KOC 1“), lebo v Lipovej nebol termín.
6. **12. 10.** biopsia, **19. 10.** histológia potvrdí rakovinu.
7. **21. 10.:** konzílium (MDT) odporučí najprv chemoterapiu, potom znova posúdiť operáciu.
8. **4. 11.:** termín na onkológii. Kedy chemoterapia naozaj začne, v podkladoch nie je.

Od 1. 9. po konzílium prešlo **50 dní** (31 pred KOC, 19 v KOC), po termín na onkológii **64 dní**. Ministerstvo píše, že pri rýchlo postupujúcich nádoroch, kam patrí aj pankreas, by čakacie doby mali byť ideálne do dvoch týždňov.

**Ukážkový pacient z prezentácie VZP (slajd 4): muž, 60 r.** V prezentácii nemá meno, „pán Novák“ je naše označenie.

1. **5. 1.:** zožltne a zavolá praktikovi.
2. **6. 1.:** ultrazvuk ukáže nádor pankreasu, praktik kontaktuje koordinátora KOC (na e-mailovú adresu koordinácie).
3. **7. 1.:** prijatie do nemocnice.
4. **9. 1.:** stent do žlčových ciest a odber vzorky.
5. **12. 1.:** CT.
6. **13. 1.** a **20. 1.:** dve konzíliá.
7. **26. 1.:** operácia.

**Spolu 21 dní** od zožltnutia po operáciu. Prezentácia VZP týmto príkladom ukazuje, že koordinátor (v prezentácii „K1“) stráži čas do liečby. Koordinátorka z Bulovky hovorí, že pri nádoroch tráviaceho traktu môže bežná cesta k diagnóze trvať až dva mesiace, s koordinátorom niekoľko týždňov (MZ, 2. 9. 2026).

## 6. Kde presne sa strácajú informácie (a čo s tým urobíme)

| Kde | Čo sa deje | Čo urobí naša appka |
|---|---|---|
| **Vstup** (praktik → KOC) | Správy chodia neúplné, rôznymi kanálmi a lekári ich prepisujú. | Praktik nahrá, čo má, **jedným krokom**, bez nového formulára. |
| **Vnútri KOC** | Koordinátor dohľadáva dokumenty namiesto koordinovania a MDT dostane podklady neskoro alebo neúplné. | **AI vytiahne údaje do šablóny, pri každom údaji ukáže zdroj**, označí, čo chýba a čo si odporuje. Na jednej obrazovke je vidno stav, termín a **kto je na ťahu**. |
| **Výstup** (KOC → praktik) | Praktik nemá jednoduchý spôsob, ako zistiť, či pacienta prijali a ako sa rozhodlo (VZP). | Záver MDT sa pošle praktikovi **s potvrdením doručenia** a prípad sa uzavrie. |

**Pravidlo:** AI iba pripraví návrh, rozhoduje vždy človek (lekár).

## 7. Čo sa opýtať mentorov (zajtra ráno)

1. Koľko minút strávi koordinátor prípravou jedného prípadu na konzílium?
2. Ako často sa konzílium odloží, lebo niečo chýba?
3. Akým kanálom im dnes reálne chodia správy (e-mail, papier, NIS, telefón)?
4. Koľko pacientov má jeden koordinátor a koľko je koordinátorov v ich KOC?
5. Čo by im v práci najviac pomohlo zajtra ráno?
