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
| **Koordinátor (onkologickej starostlivosti)** | Nová pozícia od 1. 1. 2026. „Dispečer“ pacienta: objednáva vyšetrenia, stráži termíny, zbiera podklady. **Nerozhoduje o liečbe a nemusí byť zdravotník.** |
| **MDT / konzílium** | Porada lekárov rôznych odborov (chirurg, onkológ, rádiológ, patológ…), ktorá rozhodne, ako sa bude pacient liečiť. |
| **Handover / podklad pre MDT** | Zhrnutie všetkého o pacientovi, ktoré lekári na konzíliu potrebujú. |
| **NIS** | Nemocničný informačný systém, softvér nemocnice (STAPRO, Asseco, ICZ, Medicalc…). Každá nemocnica môže mať iný. |
| **AIS** | Softvér ambulancie praktika (najčastejšie CGM a MEDaX, spolu asi 70 % [?]). |
| **eŽádanka** | Elektronická žiadanka od lekára k ďalšiemu lekárovi. Od 1. 1. 2026 existuje, ale **vystaviť ju je zatiaľ dobrovoľné**. |
| **Revízny lekár** | Lekár poisťovne, ktorý kontroluje, či je liečba oprávnená. |

## 2. Česko (tu je naša výzva)

**Koľko je centier:** **15 KOC pre dospelých a 2 pre deti**. Oficiálny zoznam vydalo ministerstvo vo februári 2026 a titul platí do roku 2031. Okolo nich je **zhruba 23 regionálnych centier (ROC)**. Patria sem napríklad MOÚ Brno, FN Motol + Homolka, VFN Praha (spolu s Thomayerovou nemocnicou a ÚVN), FN Hradec Králové, FN Olomouc, FN Ostrava a FN Plzeň.

**Kde sú:** KOC je vždy **súčasť nemocnice**: jej onkológia, chirurgia, rádiológia, patológia, ožarovanie, paliatíva, psychológ a sociálny pracovník. Aby nemocnica dostala titul, musí ročne liečiť **aspoň 1 000 nových onkologických pacientov**, mať 2 ožarovacie prístroje, konzíliá a **aspoň jedného koordinátora na plný úväzok**.

**Komu patria:** z 15 KOC je **8 štátnych** (fakultné nemocnice a MOÚ pod ministerstvom), **6 krajských** a **1 súkromné** (AGEL Nový Jičín).

**Kto to platí:** platí to **verejné zdravotné poistenie**. V ČR je 7 poisťovní a **VZP je najväčšia** (6,17 mil. klientov, asi 57 %). Na onkológiu dala VZP v roku 2024 **23,7 mld. Kč**. Nemocnica dostáva peniaze za hospitalizácie (paušál podľa diagnózy), za výkony a za drahé „centrové“ lieky, ktoré smie podávať len centrum.

**Koordinátori:**
- **Od kedy:** zaviedlo ich ministerstvo od **1. 1. 2026**. Koncepciu spoluvytváral **Marián Rybář**, garant našej výzvy.
- **Koľko:** každé KOC musí mať **minimálne 1 úväzok**, väčšie majú viac (jedna klinika uvádza „máme dve koordinátorky“). Celkový počet v ČR **nikto nezverejnil [?]**, minimum je 15. Zatiaľ ich vyškolili asi 140 (ČVUT).
- **Typy:** koordinátor 1 vedie pacienta od podozrenia po diagnózu, koordinátor 2 pracuje vnútri KOC a chystá podklady pre MDT (**to je náš užívateľ**), koordinátor 3 sa stará o pacienta po liečbe.
- **Platba:** VZP platí nemocnici **250 Kč za výkon koordinátora** (kód 51887). Peniaze teda idú nemocnici, nie koordinátorovi.
- **Nástroje:** podľa predpisu musí koordinátor pracovať v NIS a všetko **preukázateľne zapisovať**. **Špeciálny softvér pre neho neexistuje**, a presne ten chce VZP.

**Čísla:**
- ročne asi **60–65 tisíc** nových rakovín (bez bežnej kožnej) a asi **82–88 tisíc** aj s ňou (ÚZIS; ministerstvo uvádza „vyše 90 tisíc“, ale to nesedí so žiadnym zverejneným rokom, preto v pitchi citujeme ÚZIS),
- s rakovinou žije **vyše pol milióna ľudí**,
- úmrtia: asi **27 tisíc ročne**,
- čakanie: viac ako **60 % pacientov s rakovinou pľúc** nezačne liečbu do 8 týždňov od CT; pri podozrení na nádor tráviaceho traktu to bežne trvá aj ~2 mesiace,
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

**Neexistuje jedna „diaľnica“ pre dáta pacienta.** Informácie idú naraz mnohými kanálmi:

| Kanál | Ako sa používa |
|---|---|
| **Papier** (žiadanka, správa, výmenný list) | Úplne legálny a bežný. Pacient často **nosí papiere a CD so snímkami sám**. |
| **Telefón** | Koordinátor a lekári si veľa vecí dohodnú telefonicky. Nikde to nie je zapísané. |
| **E-mail** | Používa sa, ale zdravotné údaje by sa mali posielať šifrovane, preto ho niektoré nemocnice nepoužívajú vôbec. |
| **Súkromné siete firiem** (CGM ClinicBox, ICZ MEDDOX, STAPRO, Medicalc mex2) | Fungujú **len vnútri jednej siete**, medzi sebou nie. |
| **ePACS** | Výmena snímok CT/MR medzi nemocnicami. Pripojené sú takmer všetky nemocnice, ale išlo ním len asi 4 % vyšetrení (údaj z 2018, novší nie je). |
| **eŽádanka, eRecept, Sdílený zdravotní záznam** | Štátne služby. eRecept funguje, eŽádanka je v pilote a dobrovoľná, **centrálne úložisko dokumentov neexistuje**. |
| **Dátová schránka, fax** | Ako bežný kanál medzi lekármi sa nepotvrdilo [?]. |

**Čo z toho vyplýva:**
- **Každý lekár má iný softvér.** Praktik má AIS, nemocnica NIS, a tie sa navzájom nepoznajú.
- Správy sú často **PDF alebo sken**, ktorý počítač nevie „prečítať“, takže **ľudia údaje opakovane prepisujú**.
- **Súhlas pacienta** so zdieľaním medzi lekármi, ktorí ho liečia, **nie je potrebný**. Na podanie informácií rodine treba súhlas.
- Výsledok konzília sa **má** poslať praktikovi, ale **zákon neurčuje ako a nikto nepotvrdzuje, že ho dostal**.

## 5. Cesta pacienta v skratke

Celá mapa s mikrokrokmi je v **`docs/MAPA-CESTY-PACIENTA.html`** (a na odkaze z chatu). Ukážkový pacient zo zadania, pán Novák (60 r.):

1. **5. 1.:** zožltne a zavolá praktikovi.
2. **6. 1.:** ultrazvuk ukáže nádor pankreasu, praktik kontaktuje koordinátora KOC.
3. **7. 1.:** prijatie do nemocnice.
4. **9. 1.:** stent do žlčových ciest a odber vzorky.
5. **12. 1.:** CT.
6. **13. 1.** a **20. 1.:** dve konzíliá.
7. **26. 1.:** operácia.

**Spolu 21 dní, a to je dobrý prípad.** Bežne to trvá týždne až mesiace.

## 6. Kde presne sa strácajú informácie (a čo s tým urobíme)

| Kde | Čo sa deje | Čo urobí naša appka |
|---|---|---|
| **Vstup** (praktik → KOC) | Správy chodia neúplné, rôznymi kanálmi a lekári ich prepisujú. | Praktik nahrá, čo má, **jedným krokom**, bez nového formulára. |
| **Vnútri KOC** | Koordinátor dohľadáva papiere namiesto koordinovania a MDT dostane podklady neskoro alebo neúplné. | **AI vytiahne údaje do šablóny, pri každom údaji ukáže zdroj**, označí, čo chýba a čo si odporuje. Na jednej obrazovke je vidno stav, termín a **kto je na ťahu**. |
| **Výstup** (KOC → praktik) | Praktik sa nedozvie, či pacienta prijali a ako sa rozhodlo. | Záver MDT sa pošle praktikovi **s potvrdením doručenia** a prípad sa uzavrie. |

**Pravidlo:** AI iba pripraví návrh, rozhoduje vždy človek (lekár).

## 7. Čo sa opýtať mentorov (zajtra ráno)

1. Koľko minút strávi koordinátor prípravou jedného prípadu na konzílium?
2. Ako často sa konzílium odloží, lebo niečo chýba?
3. Akým kanálom im dnes reálne chodia správy (e-mail, papier, NIS, telefón)?
4. Koľko pacientov má jeden koordinátor a koľko je koordinátorov v ich KOC?
5. Čo by im v práci najviac pomohlo zajtra ráno?
