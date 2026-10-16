# Praha – NÚVR Research Matchmaker: hĺbková analýza výzvy

_Stav: piatok 16. 10. 2026, ~16:30 (posledná správa v kanáli výzvy je zo 14:27). Písané pre Bruna a Maťa (nie sú technici); odborné pojmy sú vysvetlené v zátvorke._
_Značky: **[deck]** zo zadania NÚVR (6 slidov na Google Drive), **[Slack]** zo Slacku, **[web]** overené na webe (nuvr.cz a iné), **[meranie]** moje vlastné počty z verejných stránok dnes okolo 16:30, **[prepočet]** môj výpočet z uvedených čísel, **[odhad]** môj záver, nie fakt, **[?]** neisté alebo som to nevedel overiť._
_Pravidlá: nič sa neposielalo ani necommitovalo, Slack len čítaný, v súbore nie sú žiadne e-maily ani telefóny osôb. Mená vedcov používam len tam, kde sú verejne uvedení na nuvr.cz._
_Limit analýzy: dopĺňací web search (200 volaní) sa počas práce vyčerpal. Preto nemám overené: ceny komerčných nástrojov, úspešnosť grantov Horizon Europe v ČR a čísla k BBMRI Directory. Sú označené [?]._

---

## 0. Zhrnutie na jednu stránku

- **Čo výzva chce:** NÚVR (Národný ústav pre výskum rakoviny, sieť 65 vedeckých skupín v Prahe, Brne a Olomouci) chce **AI nástroj, ktorý vedcovi povie, s kým sa spojiť**. Vedec napíše vetu („Chceme postaviť tím na nádorové mikroprostredie, ideálne s modelom mozgových metastáz a priestorovou transkriptomikou pre spoločný grant“) a nástroj vráti skupiny, **prečo sú vhodné, čo ponúkajú, čo projektu ešte chýba a aký má byť prvý krok**, vždy s dohľadateľným zdrojom [deck]. Úspech = funkčné demo, ktoré to **vie obhájiť** [deck].
- **Dáta oficiálne nemáme.** Zadávateľ píše, že AI je ľahšia časť a **ťažšie je mať spoľahlivý katalóg tímov** [deck]. Otázka hackera o dátach (14:27) ostala **bez odpovede**; garant A. Šedo vstúpil do kanála o 14:10, ale nenapísal nič [Slack]. **Nový a dôležitý nález:** NÚVR má na svojom webe verejne **65 profilov skupín** (zameranie, expertíza a technológie, spolupráca v NÚVR, ~5 vybraných publikácií s DOI na skupinu) a **stránku so 103 prístrojmi**. Dá sa z toho postaviť skutočný katalóg za pár hodín [web + meranie] (§1.2).
- **Môže ju zvoliť pražský tím? Áno.** Je to jedna z 12 pražských možností vo formulári výberu (9 pražských + 3 VZP) [05 §2.6].
- **Konkurencia:** teraz **2 tímy** (Remiho klubík, dudes). Do 19:00 reálne pribudnú ďalšie (5 pražských tímov ešte nevybralo a 7 tímov z organizátorského zoznamu nie je na tabuli) [05 §3.1]. Môj odhad na konci: **3 až 5 tímov** [odhad]. Sobotného víťaza vyberá **zadávateľ sám**, teda A. Šedo (zároveň člen nedeľnej poroty) [09].
- **Najdôležitejšie slabiny výzvy:** dopad na zdravie pacienta je **nepriamy**, kupec je akademická inštitúcia s malým rozpočtom (vedecké nástroje podobného typu sú navyše často open-source), a Maťova doména (radiačná ochrana) tu nič nerieši.
- **Najdôležitejšie silné stránky:** nulové regulačné riziko, dá sa postaviť na **skutočných** verejných dátach, demo je vizuálne (mapa 65 skupín), vysvetlenie je jasné a Bruno vie z toho spraviť dobrý príbeh. Väčšina konkurencie si pravdepodobne **vymyslí syntetických vedcov**; my môžeme ukázať skutočných ľudí a skutočné publikácie.
- **Môj odhad: vážený priemer skóre 5,0 / 10** (priemer medzi výzvami; detail v §7). Je to bezpečná a dobre uskutočniteľná výzva, ale nie „najzmysluplnejšia“ v zmysle pacienta a platiteľa.
- **Čo by sme postavili:** „**Matchmaker, ktorý sa sám udržiava**“. Katalóg sa napíše sám z toho, čo vedci už verejne publikovali; vedec ho len **potvrdí jedným klikom**. Hlavná obrazovka = jedno pole + 3 až 5 kariet partnerov (PREČO, PRÍNOS, MEDZERA, PRVÝ KROK, zdroje). K tomu **mapa NÚVR** (kde sú prekryvy a kde biele miesta) a **spätné overenie** na skutočných minulých spoluprácach („z X reálnych spoluprác by nástroj navrhol Y“) (§5).
- **Šialený variant:** „**Konzorcium na kľúč**“. Vložíte text skutočnej výzvy na grant a dostanete hotový návrh konzorcia, chýbajúce roly a jednostranový koncept (§5.6).

---

## 1. Presné zadanie

### 1.1 Zdroje, ktoré som prešiel
- **Zadanie NÚVR:** prezentácia „NÚVR – Research Matchmaker.pptx“ (6 slidov), prečítaná cez Google Drive konektor: https://drive.google.com/file/d/1j1U1jmJ666aH2-3bFOBSh1bAAHKa4Ruq/view [deck].
- **Slack kanál** `#nuvr-research-matchmaker` (ID C0C82PUV4SV): prečítaný **celý** (vrátane vlákna). Obsahuje len správy „pripojil sa do kanála“ a **jednu otázku** hackera (14:27): „z akých dát o tímoch a projektoch budeme vychádzať, a je to skôr pre výskumníkov, alebo pre vedenie NÚVR?“. Správa je podpísaná „Sent using Claude“ (autor používa AI asistenta). **Bez odpovede.** Kanál bol založený 9. 10. a premenovaný 12. 10. [Slack].
- Zoznam zadávateľov a mentorov (#02-dotazy, 16. 10. 12:38): „NÚVR Research Matchmaker – NÚVR, Aleksi Šedo“. **Pri tejto výzve nie je uvedený žiadny samostatný mentor** (pri FNMH výzvach je napr. „Mentor: Tomáš Panský“) [Slack].
- INTRO Praha (slidy z 16. 10. 14:25): výzva je v zozname 9 pražských výziev, garant A. Šedo, cena NÚVR [`docs/materials/drive/INTRO_Praha_text.md`].
- Verejný web NÚVR: https://www.nuvr.cz/ (výskumné skupiny, programy, technológie, o nás, spolupráca) a článok o Rakathone https://www.nuvr.cz/en/2026/09/04/ready-to-hack-cancer-6695/ [web].
- Súhrny v repe: `04` (§1 č. 8), `05` (§1.5, §2.6, §3.1), `06` (§3.3), `07` (B6), `09` (§1.2, §3.12).

### 1.2 Čo presne chcú (zo zadania)
Zadanie má 6 slidov. Jeho obsah vlastnými slovami:
- **Heslo:** „Správny partner. Správny zdroj. Správny čas.“ Cieľ: premeniť **roztrúsené znalosti o tímoch NÚVR** na **funkčnú alianciu spolupráce** a vysvetliť, **prečo** spojenie dáva zmysel.
- **Pilot:** **30–60 tímov**, potom celý NÚVR a neskôr aj mimo neho (národná úroveň).
- **Tri prínosy** („nie len adresár, ale nástroj na aktívne hľadanie príležitostí“): (1) **Partneri** (rýchlo nájsť tímy na granty, publikácie a validačné štúdie), (2) **Kapacity** (prehľad expertízy, technológií, modelov, kohort a biobánk), (3) **Medzery a duplicity** (kde sa kapacity prekrývajú a akú expertízu v sieti nemáme).
- **Dáta, na ktorých to stojí:** slide „Rozhodujú kvalitné vstupné dáta“: výskum (témy, metódy), biológia (modely, materiál), technológie (prístroje, infraštruktúry), klinika (kohorty, biobanky), výstupy (publikácie, projekty, spolupráce), ľudia a pravidlá (kontakty, podmienky spolupráce). **Princíp: overené dáta, jasný vlastník záznamu a pravidelná aktualizácia.**
- **Čo musí vedieť:** dotaz v prirodzenom jazyku → pre každú odporúčanú skupinu **PREČO** je relevantná, **PRÍNOS** (čo konkrétne ponúka), **MEDZERA** (čo projektu ešte chýba), **PRVÝ KROK** (návrh spoločnej aktivity) + **dohľadateľný zdroj informácie**.
- **Plán „od pilotu k inštitútu“ (4 kroky):** pripraviť (jednotná štruktúra dát, výber 30–60 tímov) → postaviť (vyhľadávanie a vysvetliteľné odporúčanie) → overiť (reálne scenáre, kontrola, či je skupina pre tím naozaj relevantná) → rozšíriť (plán správy dát a škálovanie na NÚVR).
- **Kritérium úspechu (doslova zmysel):** funkčné demo, ktoré pre konkrétny výskumný zámer **odporučí partnerov, zdroje a prvý spoločný krok a dokáže svoje odporúčanie obhájiť**.
- Kontaktné údaje sú v slide; nekopírujem ich.

### 1.3 Aké dáta dostaneme

**Oficiálne: žiadne.** Ani dataset, ani zoznam tímov v Slacku. Zadanie hovorí, že „jednotná štruktúra dát a výber z 30–60 tímov“ je súčasť úlohy [deck, 05, 06]. Nie je určený mentor, ktorý by dáta mal. **Otázky na garanta (ktoré môže niekto z vás položiť v kanáli; ja som Slack len čítal):** (a) existuje interný katalóg alebo tabuľka, ktorú smieme použiť? (b) kto je v pilote hlavný používateľ (vedec alebo vedenie)? (c) smieme v demo ukázať skutočné skupiny z webu NÚVR? (d) môžu nám dať 2–3 reálne výskumné zámery ako testovacie dotazy?

**Verejne dostupné dáta (overil som ich dnes):**

| Zdroj | Čo obsahuje | Moje overenie |
|---|---|---|
| **nuvr.cz/vedci** (zoznam skupín) | 65 skupín: Praha 34, Brno 19, Olomouc 12; meno vedúceho, domovské pracovisko, odkaz na web | Zoznam stiahnutý, 65 jedinečných odkazov na profily [web + meranie] |
| **65 profilov skupín** (nuvr.cz/vedec/…) | každý má: výskumný program (VP 1–5), zameranie a ciele, vybrané publikácie, „Expertiza a technológie“, „Spolupráca v NÚVR“, „Zapojenie do infraštruktúr“ | Stiahol som všetkých 65. Všetky majú vyplnené zameranie aj infraštruktúry; 64 z 65 majú publikácie a spoluprácu. **Hrubé počty:** ~300 DOI (medián 5 na skupinu); sekcia „Expertiza a technológie“ je **stručná** (medián ~170 znakov, len 25 z 65 má viac ako 200) [meranie] |
| **Stránka s technológiami a prístrojmi** | **103 položiek** (sekvenátory, konfokálne mikroskopy, hmotnostné spektrometre, cytometre…), rozdelené podľa pracoviska, pri každej kontaktná osoba | Je to **obyčajná webstránka**, nie databáza ani rezervačný systém; text hovorí, že katalóg je „s perspektívou budúceho zdieľania“ [web + meranie]. URL: https://www.nuvr.cz/2024/06/12/indikator-katalogizace-technologii-a-pristroju-s-perspektivou-budouciho-sdileni/ |
| **Programy** (5) | VP1 molekulárna podstata a ciele; VP2 vývoj liečiv; VP3 biomarkery a diagnostika; VP4 včasná detekcia a prevencia; VP5 translačná onkológia (klinické štúdie) | https://www.nuvr.cz/vyzkumne-programy/ [web] |
| **Európska databáza PubMed/Europe PMC** | abstrakty, mená autorov a ich pracoviská pre publikácie (podľa DOI) | Vyskúšal som na 3 DOI z profilov: vrátila **abstrakt aj pracoviská autorov bez kľúča** [meranie] |
| **OpenAlex** (otvorená databáza publikácií) | všetky práce autora, témy, spoluautori | Všetkých **65 mien sa nájde** (64 z 65 má ≥ 30 prác), ale je to len zhoda podľa mena, **bez kontroly, či ide o správnu osobu** [meranie]. **Pozor:** po mojich testoch (rádovo stovky volaní) prišla chyba 429 (denný limit **~1 000 „kreditov“ bez API kľúča**, obnova za ~9,5 hod.) [meranie]. Na noc treba **bezplatný API kľúč** (zriadi ho Bruno alebo Maťo na vlastnom účte; kľúč nepísať do súborov) alebo použiť Europe PMC + Crossref |
| **IS VaVaI** (štátna databáza výskumu, otvorené dáta) | CSV súbory: projekty (CEP, ~161 MB), účastníci projektov (~16 MB; výskumníci a ich pracoviská), výsledky RIV 2018–2025, programy a poskytovatelia; licencia CC-BY; export z 9. 10. 2026 | https://www.isvavai.cz/opendata [web]. Nepovinný bonus: kto už spolu bol na projektoch |

**Vlastné počty, ktoré ukazujú, že príklad zo zadania je ťažký (a že nástroj musí vedieť povedať „tu je medzera“)** [meranie, jednoduché textové vyhľadávanie v 65 profiloch a v stránke s prístrojmi]:
- „spatial“ (priestorová transkriptomika = zistenie, ktoré gény sú zapnuté **v ktorom mieste** tkaniva) sa v 65 profiloch vyskytuje v **2** profiloch (V. Bryja, O. Slabý), české „prostorov*“ v ďalších **2** (M. Kolář, M. Sztacho).
- „mozgové“ (pri metastázach a nádoroch mozgu): **5** profilov (P. Dráber, P. Džubák, Z. Hodný, A. Šedo, J. Trka); „metastáz*“: **10**; „mikroprostredie“ (okolie nádoru: imunitné bunky, fibroblasty, cievy): **13**.
- V stránke s **103 prístrojmi** sa **nenachádza žiadna platforma na priestorovú transkriptomiku** (hľadal som spatial, Visium, Xenium, GeoMx, CosMx: 0 nálezov), ani slová „brain“, „metastasis“, „mouse“, „organoid“.
- Teda pre vzorový dotaz zo zadania **žiadna jedna skupina nepokrýva všetko** a technológia môže chýbať v celej sieti. Poctivá odpoveď nástroja je „partneri A a B pokrývajú časť, **medzera: priestorová transkriptomika, spýtať sa externého pracoviska**“. Keyword-vyhľadávanie by tu zlyhalo a LLM bez zdrojov by si vymyslelo.
- **Prekryvy sú vidieť už v katalógu prístrojov** [meranie]: „NextSeq“ (sekvenátor, prístroj na čítanie DNA/RNA) je v troch inštitúciách (2. LF UK, CEITEC, Ústav molekulárnej genetiky AV ČR); „confocal“ (konfokálny mikroskop) 10 položiek v 5 inštitúciách; hmotnostný spektrometer timsTOF 3 položky v 3 inštitúciách. To nie je nutne plytvanie (sú to aj príležitosti na zdieľanie), ale presne to chce zadanie v prínose č. 3.

### 1.4 Čo odovzdávame a ako sa hodnotí
- **Odovzdanie:** sobota 17. 10. **13:00**, tvrdý deadline; povinný titulný obrázok 16:9 (do 8 MB), popis do 140 znakov, pole „Dopad a AI“, odkazy na GitHub, demo, video [05 §0, 09 §1.1].
- **Sobota 14:00–16:00:** zadávatelia obchádzajú tímy; **víťaza tejto výzvy vyberá NÚVR (A. Šedo)**, víťaz ide do nedeľného finále [09 §0].
- **Kritériá (všeobecné):** sobota: 1. AI technológia a prevedenie, 2. využiteľnosť v praxi u zadávateľa, 3. inovatívnosť; nedeľa pridáva 4. škálovateľnosť a 5. kvalitu prezentácie a tímu; váhy nie sú zverejnené [05 §2.3]. **NÚVR nemá vlastné bodovanie** (iba „kritérium úspechu“ z §1.2) [deck].
- **Cena NÚVR:** účasť na Czech Annual Cancer Research Meeting (Olomouc, 23.–25. 11. 2026) pre víťaza výzvy [INTRO]. **Peniaze nie sú.** Hlavné ceny 100/50/25 tis. Kč sú pre finále.
- **A. Šedo v nedeľnej porote:** potvrdené na webe NÚVR (nuvr.cz, 4. 9. 2026) a v zozname poroty. Podľa NÚVR hodnotí Rakathon ako miesto, kde sa stretávajú študenti, vedci, lekári a vývojári, a podporuje „mladé talenty, rýchlejší prechod výskumu do klinickej praxe a spin-off projekty“ [web].
- **Bonus InterSystems (1 500 EUR):** InterSystems vo svojom workshope zaraďuje NÚVR do kategórie „nájsť súvislosti – vector search / RAG“ [`docs/materials/slack/best-use-of-intersystems/…pdf`]. Cena sa dá kombinovať s ľubovoľnou výzvou; vyžaduje **zmysluplné** použitie ich technológie (IRIS vector search) a hodnotí inovatívnosť, reálny prínos, využitie technológie a technickú ucelenosť [04 §1.5]. FHIR (zdravotnícky dátový štandard) tu nie je prirodzený, preto by išlo hlavne o vyhľadávanie v IRIS.

### 1.5 Kto vie pomôcť (mentori a ľudia)
- **Garant a zadávateľ:** A. Šedo, riaditeľ NÚVR (1. LF UK; bývalý námestník ministra zdravotníctva 2020–21; podľa vyhľadávania aj prorektor UK pre rozvoj od 2025 [?]) [web: MZ ČR]. Vedecký riaditeľ NÚVR O. Slabý, lekársky riaditeľ M. Hajdúch [web: ČT24].
- **Mentor pre túto výzvu: nie je pomenovaný** [Slack].
- **Technická pomoc na mieste:** InterSystems (vector search/RAG): Ondřej Hoferek, Gabriel Ing; Microsoft: Michal Marušan (Azure AI), Olena Vasylenko (onko/bio dáta, Praha), Bernardo Sunderhus (frontend/UX); kanál #08-tech-helpdesk [04 §5].
- **Organizátori:** Petr Vaňásek (logistika, otázky), Tomáš Studeník [Slack].

---

## 2. Koncový užívateľ

**Primárny používateľ: vedúci výskumnej skupiny (v odbore „PI“, principal investigator).** Je to vedec, ktorý má vlastný tím (zvyčajne 5–15 ľudí), píše granty a rozhoduje, s kým sa spojí. V NÚVR je ich 65 [web].

**Sekundárni:** (a) **koordinátor programu / vedenie NÚVR**, ktoré potrebuje vidieť medzery a duplicity a vykázať spoluprácu (NÚVR je v „období udržateľnosti“ do 31. 12. 2028 a od 2026 ho podporuje aj ministerstvo zdravotníctva) [web: nuvr.cz/o-nas]; (b) **grantový manažér** pri vedeckej inštitúcii; (c) **mladý vedec** (postdoc, doktorand), ktorý hľadá laboratórium na stáž alebo spoluprácu (NÚVR vyhlasuje podporu mladých talentov); (d) neskôr externí: klinik alebo farmaceutická firma, ktorá sa pýta „kto v ČR vie X“.

**Odporúčanie k otázke hackera („pre vedcov, alebo pre vedenie?“):** staviame **pre vedca** (denné použitie, jedno pole), a vedenie dostane ako vedľajší produkt **mapu a prehľad medzier** [odhad]. Tak sú pokryté oba prínosy zo zadania.

### Deň vedkyne (zložený príklad, nie skutočná osoba)
Petra, 38 rokov, vedúca skupiny v ústave Akadémie vied v Prahe, 6 doktorandov. V utorok o 22:00 doma píše koncept projektu do výzvy, ktorej uzávierka je za 7 týždňov. Jej nález o signalizácii medzi nádorom a okolitými bunkami potrebuje:
1. **model mozgových metastáz** (myšací alebo bunkový, ktorý ona nemá),
2. **priestorovú transkriptomiku** (platforma, ktorú v jej ústave nie je),
3. **klinického partnera** so vzorkami pacientov (biobanka).

**Ako to rieši dnes:** zavolá dvom známym, ktorých pozná z konferencií; hľadá v PubMede; otvorí nuvr.cz/vedci, kde vidí **65 kariet s menom a pracoviskom, ale bez tém** (výskumné témy sú až na každom z 65 podstránok), potom stránku s prístrojmi (zoznam bez možnosti hľadať podľa potreby, pri každom je e-mail kontaktnej osoby). Napíše piatim ľuďom, dvaja neodpovedia. Po dvoch týždňoch **osloví tých istých troch partnerov, ktorých pozná**. Termín beží.

**Prečo dnešný stav zlyháva:**
- Katalóg je **rozptýlený** (65 podstránok, samostatná stránka s prístrojmi, publikácie inde, projekty v štátnej databáze) a **nikto nevlastní jeho aktualizáciu**; zadávateľ to sám priznáva („ťažšie je spoľahlivý a udržovaný katalóg“) [deck].
- Hľadá sa **podľa mena a kontaktov**, nie podľa potreby. Riešenie vyžaduje kombináciu (model + technológia + klinika), a tú nenájde ani jedno kľúčové slovo (§1.3).
- Aj v rámci jednej lekárskej fakulty trenie pri hľadaní partnerov brzdí spoluprácu (experiment z Harvardu, §3).
- Vedenie vidí duplicity (3 sekvenátory NextSeq v 3 inštitúciách) a nevie, či sa dajú zdieľať [meranie].

**Čo by pre ňu bol „dobrý deň“:** napíše vetu, o 10 sekúnd dostane 3 skupiny s dôvodom a odkazom na ich konkrétne články, vidí, že **priestorová transkriptomika v NÚVR chýba** a dostane návrh prvého e-mailu a agendy 30-minútového stretnutia. **Nič sa neodosiela samo.** Rozhodnutie je jej.

---

## 3. Dôkazy o probléme (čísla a štúdie)

Poctivo: **priame české číslo „koľko spoluprác sa nevytvorilo, lebo sa partneri nenašli“ nie je**. Dôkazy sú nepriame (svetové štúdie o spolupráci a o nákladoch grantov) a zo samotného NÚVR.

| Číslo / fakt | Čo to znamená | Zdroj | Spoľahlivosť |
|---|---|---|---|
| **65 skupín, 11 inštitúcií, 3 mestá** (pri vzniku 2022: 71 tímov z 11 pracovísk) | Veľká rozptýlená sieť, ktorú treba prepájať | https://www.nuvr.cz/vedci/ ; https://ct24.ceskatelevize.cz/clanek/domaci/vysledky-z-laboratori-v-praxi-vznikl-novy-cesky-institut-pro-vyzkum-rakoviny-15464 | vysoká [web] |
| **~1,48 mld. Kč** z európskych peňazí (program Exceles, Národný plán obnovy) | Veľká verejná investícia, od ktorej sa čaká prepojenie | ČT24 (26. 9. 2022, vyššie) | vysoká |
| „Onkologický výskum sa dosiaľ nijako **nekoordinoval a bol roztrieštený** do jednotlivých inštitúcií“ (A. Šedo) | NÚVR vznikol práve preto | ČT24 (vyššie); NÚVR píše o cieli „prekonať roztrieštenosť českého onkologického výskumu“ https://www.nuvr.cz/o-nas/ | vysoká |
| **103 prístrojov** na webstránke bez rezervácie a vyhľadávania; text: bez katalogizácie sa výskum „odohráva izolovane“ a zdieľanie umožní lepšie využiť peniaze vynaložené na obstaranie | NÚVR sám tvrdí, že prístroje a know-how sa nevyužívajú naprieč pracoviskami | stránka NÚVR (URL v §1.3) | vysoká [web + meranie] |
| **+75 %**: keď Harvard Medical School **náhodne** posadil dvojice vedcov na 90-minútové stretnutia, šanca, že dvojica podá spoločný grant, vzrástla z 0,16 % na 0,28 % (+75 %). Trenie pri hľadaní partnerov existuje **aj v rámci jednej fakulty** s verejnými informáciami | Hľadanie partnera je skutočná prekážka a **zníženie nákladov na hľadanie spoluprácu zvyšuje** | Boudreau a kol., pracovný článok na SSRN, https://doi.org/10.2139/ssrn.2486068 (neskôr v Review of Economics and Statistics, 2017 [?]) | stredná až vysoká (poctivý randomizovaný experiment, ale malé absolútne čísla a len jedna univerzita) |
| **34 pracovných dní** vedcov na prípravu jedného grantu (nový návrh 38 dní), len **21 %** návrhov uspelo; spolu ~**550 pracovných rokov** na jedno kolo grantov v Austrálii. Viac času neznamenalo vyššiu šancu | Neúspešné návrhy sú drahé; skrátenie hľadania partnera je malá, ale reálna úspora | Herbert a kol., BMJ Open 2013, https://doi.org/10.1136/bmjopen-2013-002800 | vysoká pre Austráliu (NHMRC); pre ČR [?] |
| **Tímy** vytvárajú **častejšie citované** práce než jednotlivci a tento náskok rastie; **medziuniverzitné tímy sú najrýchlejšie rastúci typ** a majú najväčší dopad, keď majú v tíme špičkovú univerzitu | Spolupráca naprieč inštitúciami sa oplatí | Wuchty, Jones, Uzzi, Science 2007, https://doi.org/10.1126/science.1136099 ; Jones, Wuchty, Uzzi, Science 2008, https://doi.org/10.1126/science.1158357 | vysoká (veľké analýzy), ale ide o citácie, nie o pacientov |
| Z 53 „prelomových“ predklinických onkologických štúdií sa potvrdilo len **11 %** (Amgen); to je dôvod, prečo sa vo výskume hodnotí **overovanie (validácia) cez nezávislé skupiny** | Dobrý partner na validáciu je v onkológii kľúčový; v zadaní NÚVR sú „validačné štúdie“ prvou položkou prínosu č. 1 | Begley a Ellis, Nature 2012, https://doi.org/10.1038/483531a ; číslo 11 % z 53 podľa https://en.wikipedia.org/wiki/Replication_crisis | stredná (číslo je z druhej ruky, pôvodný článok bol za prihlásením) |
| Prenos z laboratória do praxe trvá podľa prehľadu 23 štúdií často uvádzaných **17 rokov**, ale autori pripúšťajú, že merania sa nedajú porovnať | Dlhá cesta „z lavice k lôžku“; prepájanie pomáha, ale presný efekt nepoznáme | Morris, Wooding, Grant, J R Soc Med 2011, https://doi.org/10.1258/jrsm.2011.110180 | nízka až stredná pre konkrétne číslo |
| ČR: **58 461** nových zhubných nádorov (2021, bez nemelanómových kožných), **26 865** úmrtí na zhubné nádory | Veľkosť choroby, ktorej sa výskum týka. Dopad nástroja je **nepriamy** | ÚZIS, https://www.uzis.cz/res/f/008447/novotvary2019-2021.pdf (cez `08` §1) | vysoká |
| EÚ: ~**2,7 mil.** diagnóz a **1,3 mil.** úmrtí ročne; misia proti rakovine chce zlepšiť život **3 miliónom ľudí do 2030** | Európsky kontext, v ktorom sa tvoria konzorciá | https://research-and-innovation.ec.europa.eu/funding/funding-opportunities/funding-programmes-and-open-calls/horizon-europe/eu-missions-horizon-europe/eu-mission-cancer_en | vysoká |

**Môj hrubý scenár úspory** [prepočet na neoverených predpokladoch]: ak by nástroj skrátil hľadanie partnerov o 2 pracovné dni na jeden grantový návrh a každá z 65 skupín podá v priemere 1,5 návrhu ročne, je to ~**195 pracovných dní ročne** (65 × 1,5 × 2). Oproti 34 dňom na návrh (Herbert) ide o ~6 % času na jednu žiadosť. Je to **malé číslo**, nie dôvod na pitch. Silnejší argument je **kvalita a rozsah spolupráce** (viac nových dvojíc z rôznych miest), nie ušetrené hodiny.

**Čo sa dá vypočítať za noc a bolo by to silné číslo do pitchu** [odhad]: z publikácií spočítať, **koľko z možných dvojíc skupín z rôznych inštitúcií už spolu publikovalo** (podiel dvojíc, ktoré sa nikdy nespojili). Ak je ten podiel nízky, je to priamy dôkaz roztrieštenosti zo skutočných dát NÚVR.

**Čo nemáme:** nemáme dôkaz, že bežný vedec **chce** takýto nástroj používať (adopcia), ani koľko stojí zlyhaný konzorcium v ČR. A pre pacienta: **žiadny priamy dôkaz vplyvu na prežitie**.

---

## 4. Existujúce riešenia na trhu

| Riešenie | Čo robí | Veľkosť | Cena | Čo robí zle alebo čo chýba |
|---|---|---|---|---|
| **Elsevier Pure** (často so SciVal) | Systém univerzity na správu výskumu: profily vedcov, publikácie, spolupráce, viditeľnosť pre financovateľov | **500+ inštitúcií v 50+ krajinách** | **neuvedená**, „kontaktujte nás“ [?] | Postavený pre **jednu inštitúciu** [odhad z popisu], opisuje minulosť (kto čo publikoval), nevysvetľuje „prečo spolu“ ani „prvý krok“; licencia je drahá [?] https://www.elsevier.com/products/pure |
| **VIVO** (open-source) | „Mapa vedeckej práce“ organizácie: profily, vizualizácie sietí | **150+ inštancií v 25+ krajinách** | softvér zadarmo; prevádzka a ľudia nie sú uvedené | Katalóg treba **udržiavať** (to je presne problém NÚVR); neposkytuje odporúčanie a vysvetlenie https://vivoweb.org |
| **Harvard Catalyst Profiles** (open-source, financované NIH) | Hľadanie vedcov podľa kľúčových slov, siete spoluautorstva, **profily sa plnia automaticky z PubMedu** | bez štatistík použitia [?]; existujú medziinštitucionálne siete (Direct2Experts, VIVOSearch, CTSAsearch) | zadarmo (open-source) | Poradie podľa kľúčových slov, **žiadna analýza medzier, žiadny prvý krok, žiadne vysvetlenie v prirodzenom jazyku**; potrebuje zdroj identity (napr. HR) https://profiles.catalyst.harvard.edu |
| **inPart** | Platforma na partnerstvá v life-science R&D (nájsť partnerov, spravovať, due diligence) | „**500+ klientov, 70 % z top 50 farma**“ (tvrdenie firmy); tvrdí úsporu „až 4,8 mil. USD ročne“ a „24 000 hodín“ | neuvedená [?] | Cielené na **biznis development farmy**, univerzity v texte nie sú; nie je to nástroj na tvorbu akademických konzorcií a grantových tímov https://www.inpart.io |
| **Science Exchange** | Trh s dodávateľmi výskumu a nákup služieb (zmluvy, platby) | „**3 800+** dodávateľov“ | províziu neuvádza [?] | Kupuje **služby** od komerčných laboratórií, nie **vedeckých partnerov** do spoločného projektu https://www.scienceexchange.com |
| **BBMRI-ERIC Directory** (+ „Negotiator“) | Katalóg biobánk a kolekcií vzoriek v Európe | stránku sa mi nepodarilo načítať, čísla neuvádzam [?] | zadarmo [?] | Pokrýva **vzorky**, nie expertízu ani technológie; spolupracuje s NÚVR (BBMRI.cz) https://directory.bbmri-eric.eu |
| **Súčasný web NÚVR** | 65 kariet + podstránky + stránka s 103 prístrojmi | verejné | zadarmo | Karty ukazujú len meno a pracovisko, **nedá sa hľadať podľa potreby**; stránka s prístrojmi nemá rezerváciu; nikto nevlastní aktualizáciu [web + meranie] |
| **Univerzálne AI chaty a AI na literatúru** (napr. ChatGPT, Claude, Elicit) | Vedia napísať vierohodný zoznam ľudí a nájsť články | – | – | Bez katalógu si **vymýšľajú mená a vlastnosti**, nedajú overiteľný zdroj, nevidia interné prístroje; „dokáže obhájiť“ nesplnia [odhad] |

**Kto už za to platí:** univerzity za informačné systémy o výskume (Pure a podobné), farmaceutické firmy za nástroje na hľadanie partnerov (inPart) a nákup služieb (Science Exchange), americký štát (NIH) financoval open-source Profiles [web]. **V ČR som nenašiel žiadny konkrétny nákup takéhoto nástroja** [?]; ani to, či univerzity zapojené do NÚVR už nejaký systém majú [?]. Cena komerčných riešení nie je zverejnená [?].

**Kde je priestor urobiť to lepšie, lacnejšie a jednoduchšie:**
1. **Naprieč inštitúciami** (3 uzly, 11 inštitúcií), nie v jednom systéme jednej univerzity.
2. **Vysvetlenie a zdroj** („prečo spolu, čo prinesie, čo chýba, prvý krok“), nie zoznam mien.
3. **Katalóg sa sám plní** z verejných dát (profil NÚVR + publikácie), vedec iba **potvrdí** („jasný vlastník, pravidelná aktualizácia“ z princípu NÚVR).
4. **Medzery a duplicity** ako súčasť produktu.
5. **Cena:** verejné dáta + LLM; náklady sú radovo desiatky až stovky USD na pilot [odhad], nie licencia platformy.
6. **Česká a slovenská reč** vo vstupe aj výstupe.

---

## 5. Najlepší návrh riešenia pre nás

### 5.1 Jedna veta
**„NÚVR Matchmaker: napíšete, čo chcete vo výskume postaviť, a dostanete 3 skupiny, ktoré to vedia, prečo, čo ešte chýba a čo spraviť zajtra. Každé tvrdenie má odkaz na článok alebo profil a katalóg sa udržiava sám.“**

### 5.2 Tri obrazovky (maximálna jednoduchosť)
1. **Hľadať.** Jedno veľké pole a pod ním tri vzorové vety (prvá je presne vzorová veta zo zadania NÚVR). Výsledok: 3 až 5 **kariet partnerov**. Každá karta má 4 riadky presne podľa zadania:
   - **PREČO** (1–2 vety; každé tvrdenie má číselný odkaz na DOI alebo profil),
   - **PRÍNOS** (čo konkrétne prinesie: model, technológia, kohorta, prístroj),
   - **MEDZERA** (čo ešte chýba celému tímu; ak to v NÚVR nie je, napíše „v NÚVR sa nenachádza“ a navrhne, kde hľadať, napr. národné infraštruktúry, s ktorými NÚVR spolupracuje: EATRIS-CZ, Czech-BioImaging, BBMRI.cz [web: nuvr.cz/spoluprace]),
   - **PRVÝ KROK** (30-minútový hovor, 3 otázky, vhodná výzva; tlačidlo „skopírovať návrh správy“; **nič sa neposiela samo**).
   Plus značky: „už spolupracujú“ alebo „nikdy spolu nepublikovali“ (podľa spoluautorstva), „istota: vysoká/stredná/nízka“ a „overené vlastníkom: áno/nie“.
2. **Mapa NÚVR.** 65 bodov zoskupených podľa tém, farba = inštitúcia, čiary = skutočné spoločné publikácie; po hľadaní sa **rozsvietia** odporúčané skupiny. Biele miesta = málo skupín (medzera), husté miesta = prekryv. Druhá záložka **Kapacity**: 103 prístrojov a kde sa opakujú. Toto je pohľad pre vedenie NÚVR (prínos č. 3 zo zadania).
3. **Správa údajov.** Každá skupina má kartu s dátumom poslednej kontroly a tlačidlom **„Sedí / Opraviť“** (v demo uloží do súboru). Systém označí „zastarané“, keď má vedec nové publikácie, ktoré v karte nie sú. Toto je odpoveď na princíp zadania „jasný vlastník, pravidelná aktualizácia“ a na kritérium 4 (škálovateľnosť).

### 5.3 Ako to postaviť za noc (Claude Code)
- **Dáta** (cca 19:00–22:00): stiahnuť 65 profilov z nuvr.cz do jednotnej karty (téma, metódy, modely, technológie, infraštruktúry, publikácie); ~300 DOI doplniť abstraktmi a pracoviskami z **Europe PMC (bez kľúča)**; 103 prístrojov rozparsovať; **voliteľne** doplniť posledných 5 rokov prác každého vedca z OpenAlex (potrebuje bezplatný kľúč) a spoluautorstvá; **bonus** IS VaVaI (kto je na spoločných projektoch). **Dôležité:** vedcov spájať podľa **DOI z ich vlastných profilov** (nie len podľa mena), aby sa nepomiešali osoby.
- **Kľúčové miesto kvality („AI technológia a prevedenie“):** vyhľadávanie v dvoch krokoch (vektorové vyhľadávanie podľa významu + kľúčové slová) → model napíše odporúčanie v pevnej štruktúre → **druhý krok „overovateľ“** skontroluje, že **každé tvrdenie sa opiera o konkrétny úryvok**, a ak nie, tvrdenie vyhodí alebo napíše „v dostupných údajoch sa nenachádza“. Tým splníme „dokáže obhájiť“ a nezačneme vymýšľať vlastnosti skutočných ľudí.
- **Platforma:** InterSystems IRIS (vector search) ako úložisko by dalo šancu aj na bonus 1 500 EUR [04 §1.5]; vyžaduje, aby to bolo skutočné použitie, nie nálepka. LLM cez Azure podľa pravidiel akcie (zdieľané limity, preto cache a opakovanie volaní s odstupom [03]). **Riziko:** prístupy do Azure sa u niektorých tímov oneskorujú [05 §0 č. 10]; záloha: vopred vypočítané odpovede na vzorové dotazy.
- **Čo nestaviame:** nový formulár, ktorý by museli vedci vypĺňať; automatické posielanie e-mailov; **rebríček „najlepších“ vedcov** (reputačné riziko, nikto to nechce); žiadne údaje o pacientoch.
- **Časový plán** [odhad]: 19–22 dáta; 22–02 hľadanie, odporúčanie a overovateľ; 02–05 obrazovky a mapa; 05–07 test a spätné overenie; 07–11 video a texty; 11–13 odovzdanie (deadline 13:00).

### 5.4 Ako to dokážeme („funkčné demo, ktoré dokáže obhájiť“)
1. **Vzorová veta zo zadania** (porota ju určite skúsi): výsledok má byť poctivý, teda **čiastočné zhody a vyznačená medzera** (§1.3), nie falošne dokonalá odpoveď.
2. **10 vlastných dotazov** (napr. na prístroje, na liečivá, na biomarkery), každý ručne skontrolovaný podľa zdrojov.
3. **Spätné overenie (to je naše „wow“ pre porotu s technikmi):** z publikácií nájdeme **skutočné spolupráce z rokov 2024–2026** medzi skupinami NÚVR; katalóg postavíme len z dát do roku 2022; opýtame sa, či by nástroj navrhol toho skutočného partnera v prvej päťke. Výsledok povieme ako „**X z Y**“. Číslo zatiaľ nepoznáme, treba ho vypočítať; ak by bolo slabé, povieme to poctivo a ukážeme, kde sa mýlilo.
4. **Správa údajov:** ukázať postup „vedec potvrdí kartu“.

### 5.5 Čo ukážeme v 3-minútovom pitchi (a v 60–75 s videu)

| Čas | Obsah | Kritérium |
|---|---|---|
| 0:00–0:20 | **Hák:** „NÚVR má 65 skupín v troch mestách a stovky prístrojov. Petra o 22:00 potrebuje partnera na mozgové metastázy a priestorovú transkriptomiku. Dnes volá známych.“ Jedno číslo: **+75 % spoluprác, keď sa zníži trenie pri hľadaní** (Harvard) alebo **34 dní na jeden grant** (Austrália) | 2 |
| 0:20–0:45 | Pre koho a komu to patrí: Šedo a vedci NÚVR; slogan z ich zadania | 2 |
| 0:45–1:45 | **Video, skutočná obrazovka:** napíšeme vetu zo zadania → karty s PREČO, PRÍNOS, MEDZERA, PRVÝ KROK → klik na zdroj (DOI) → mapa sa rozsvieti → vidno medzeru „priestorová transkriptomika“ | 1, 3 |
| 1:45–2:15 | Ako to funguje a čo je **overené**: katalóg sa napíše z verejných dát, každé tvrdenie má citáciu, overovateľ vyhodí neopodstatnené, **spätný test X z Y**, vedec potvrdí kartu | 1, 2 |
| 2:15–2:40 | **Pilot na jednom riadku:** 65 skupín (zadanie hovorí 30–60), 4 týždne, KPI: koľko vlastníkov potvrdí kartu, koľko nových dvojíc z rôznych miest, koľko spoločných žiadostí; škálovanie na celé ČR | 2, 4 |
| 2:40–3:00 | Tím + jedna žiadosť: **„30 minút s riaditeľom NÚVR a pilot na Czech Annual Cancer Research Meeting v Olomouci.“** | 5 |

**Poznámky k videu (Bruno):** žiadna animácia, **skutočná obrazovka a skutoční vedci z verejných dát**; príbeh jednej osoby (Petra); jedna veta o pacientovi na konci („čím skôr sa správni ľudia nájdu, tým skôr sa objav dostane ku klinike“), **bez prehnaných sľubov o prežití** (§3). V texte jasne napísať: „prototyp na verejných údajoch, nie zdravotnícky prostriedok“.

### 5.6 „Šialený“ ambiciózny variant: Konzorcium na kľúč
Vložíte **text skutočnej výzvy na grant** (napr. výzva programu Európskej misie proti rakovine, GA ČR alebo ministerstva zdravotníctva). Systém:
1. vyberie požiadavky (min. počet partnerov a krajín, typ výskumu, klinické pracovisko, požadované technológie),
2. zostaví z NÚVR **návrh konzorcia** (ktoré skupiny, kto bude vedúci, kto za čo),
3. označí **chýbajúce roly** a navrhne, kde ich hľadať (externé pracoviská, národné infraštruktúry),
4. vygeneruje **jednostranový koncept** a agendu prvého stretnutia,
5. a každý pondelok pošle vedcovi „**radar**“: nová publikácia kolegu, otvorená výzva, vhodný partner, **len po schválení** a so zdrojmi.

Prečo je to „šialené“: z hľadania partnera sa stane **hotový plán konzorcia za minútu**. Rizká: kvalita návrhu je ťažko overiteľná, ľahko pôsobí ako hotový grant; preto vždy „návrh na diskusiu“ a ľudský súhlas. Druhý, **ešte odvážnejší** nápad (nedoporučujem): model navrhuje nové **hypotézy** z kombinácie dvoch skupín; vedecky riskantné a ťažko obhájiteľné za noc.

---

## 6. Konkurencia na hackathone a oprávnenosť

**Oprávnenosť:** **áno**, je to pražská výzva a je v zozname 12 pražských možností formulára. Výber do **dnes 19:00**; tím 2–4 ľudia, obaja fyzicky na mieste, jedna výzva (+ InterSystems bonus) [05 §2.4, §2.6].

**Stav ~16:00 podľa tabule tímov a Slacku:**

| Čo | Údaj | Zdroj |
|---|---|---|
| Tímy so zvolenou výzvou | **2**: Remiho klubík, dudes | 05 §3.1 |
| V kanáli výzvy sú ľudia aj z tímov, ktoré majú inú výzvu, alebo ešte nevybrali | napr. členovia VI KA (Hlídač NÚ), MediBit (Cesta pacienta), walking legs (zatiaľ **nevybraný**), traja z tímu Remiho klubík a traja z dudes | Slack (zoznam pripojených) |
| Účastník s otázkou o dátach | tím nie je uvedený; správa je podpísaná „Sent using Claude“ | Slack |
| Solo hacker (magisterské štúdium matematickej logiky, vlastné portfólio) uviedol NÚVR ako **prvú voľbu** pri hľadaní tímu (14. 10.) | môže byť už v nejakom tíme | Slack #06 |
| Ešte nevybrali (Praha) | 5 tímov: Ctrl+Alt+CURE, FIT/S, FSMZ (pravdepodobne duplicita), Pražský Meridian, walking legs | 05 §3.1 |
| Tímy z organizátorského zoznamu, ktoré nie sú na tabuli | 7: Data Team, Junior Scholars, Nexlytics, Panacea, quattro formaggi, radiQA, Risk off | 05 §3.1 |

**Odhad konečného počtu tímov na výzve: 3 až 5** [odhad]. Pre porovnanie: AI Trial Matching 4, mamograf 3, mnoho výziev 0–1.

**Čo z toho plynie:**
- Výzva je technicky **ľahká na začatie** (vyhľadávanie + LLM), takže priťahuje všeobecných „AI stavbárov“. Väčšina z nich **nemá dáta a vymyslí si syntetických vedcov** (zadávateľ dáta nedal) [odhad]. Šedo uvidí vymyslené mená; **skutočných kolegov** uvidí len tím, ktorý stiahne web NÚVR.
- **Naše odlíšenie:** skutočné dáta, spätné overenie „X z Y“, poctivé „medzera, nenašli sme“, správa údajov a príbeh. Slabá odpoveď AI (vymýšľanie) je tu najväčšie riziko pre **všetkých**; vyhráva ten, kto vie, čo nevie.
- **Finále (nedeľa):** víťaz NÚVR výzvy ide do finále proti víťazom ďalších pražských výziev (a VZP výziev). Porota (VZP, ministerstvo, nemocnice, pacientska organizácia, firmy) je zameraná na pacienta a nasadenie [09 §1.2]; NÚVR výzva je tam **slabšia na dopad na pacienta**, ale silnejšia na **škálovateľnosť** (kritérium 4). Preto príbeh o nepriamom, ale reálnom prínose (§5.5) a číslo z pilota.
- **Rozhoduje jeden človek v sobotu:** vyberá Šedo. Jeho vlastný príklad vo vzorovej vete a jeho slová o mladých ľuďoch a prenose do praxe sú to, na čo treba zacieliť.

---

## 7. Skóre (1–10, kalibrované: 5 = priemer medzi výzvami, 9–10 len výnimočne)

| Kritérium | Váha | Skóre | Zdôvodnenie |
|---|---|---|---|
| **Veľkosť problému** (`velkost`) | 1 | **3** | Priami používatelia: 65 skupín (rádovo stovky vedcov [?]); nepriamo 58 tis. nových prípadov rakoviny ročne v ČR, ale väzba je dlhá a rozmazaná. Menej ľudí než screening, MDT alebo koordinácia. |
| **Dopad na zdravie** (`zdravie`) | 1,5 | **2** | Nepriamy a vzdialený (rýchlejšie spolupráce → viac prekladového výskumu); **žiadny doložený vplyv na prežitie**; „17 rokov“ je nepresné číslo (Morris 2011). |
| **Úspora času** (`cas`) | 1 | **4** | Zrýchlenie hľadania partnera pri grante je reálne, ale úloha je **zriedkavá** (pár razy ročne); môj prepočet ~2 dni na návrh (~6 % z 34 dní, Herbert). |
| **Úspora peňazí / zisk** (`peniaze`) | 1,2 | **4** | Možná úspora zdieľaním 103 prístrojov a vyššia úspešnosť grantov, ale **nič pre nemocnicu ani poisťovňu priamo**, žiadna rozpočtová položka. |
| **Akútnosť bottlenecku** (`bottleneck`) | 1,5 | **5** | NÚVR vznikol kvôli roztrieštenosti a sám stavia katalóg prístrojov; zadávateľ píše, že katalóg je ťažký. Dopyt **existuje, ale nie je naliehavý** ako čakanie pacienta na liečbu. |
| **Ochota platiť** (`platba`) | 1,2 | **4** | Jasný kupec (NÚVR; podpora ministerstva zdravotníctva od 2026, udržateľnosť do 2028) a existujúci trh (Pure 500+ inštitúcií, inPart 500+ klientov), ale akademický rozpočet je malý, **bezplatné open-source riešenia** (VIVO, Profiles) znižujú cenu; v ČR žiadny nákup nenájdený [?]. |
| **Jednoduchosť pre používateľa** (`jednoduchost`) | 1 | **8** | Jedno pole, 3–5 kariet, žiadny formulár na vypĺňanie; vedci sú technicky gramotní. Minus: správa údajov a dôvera v odporúčania. |
| **Dostupnosť a kvalita dát** (`data`) | 1 | **6** | Oficiálne nič a **žiadna „správna odpoveď“** na meranie; no verejne je 65 profilov, ~300 DOI, 103 prístrojov a otvorené databázy. Slabiny: stručné profily (medián ~170 znakov expertízy), zhoda osôb podľa mena a denný limit OpenAlex bez kľúča [meranie]. |
| **Realizovateľnosť dema za noc** (`realizovatelnost`) | 1 | **8** | Zber, vyhľadávanie, LLM s overovateľom a jednoduché UI sú bežná práca pre Claude Code; riziká: oneskorený prístup do Azure, vymýšľanie, dĺžka overenia. Žiadna regulácia ani pacientske dáta. |
| **Wow a príbeh** (`wow`) | 1,2 | **6** | Vizuálna mapa skutočných skupín, spätné overenie „X z Y“ a príbeh Petry. Emočne slabšie než pacientske témy; porotu zaujme najmä Šedo a technici. |
| **Strategická hodnota zadávateľa** (`partner`) | 1,2 | **5** | NÚVR: sieť 65 skupín a riaditeľ v porote (zároveň vyberá sobotného víťaza; bývalý námestník ministra); cena = konferencia v Olomouci. **Žiadne peniaze, žiadny nákup v nemocniciach**; konzistentné s hodnotením 5/10 v `09`. |
| **Šanca vyhrať a ísť do finále** (`konkurencia`) | 1 | **5** | 2 tímy teraz, odhad 3–5; výzva je ľahká na začatie, no väčšina nebude mať skutočné dáta. Vyberá jeden človek. V nedeľu je výzva slabšia na pacienta. |
| **Pokračovanie po hackathone** (`pokracovanie`) | 0,8 | **6** | Pilot je v zadaní priamo opísaný (30–60 tímov → NÚVR → národne); zadávateľ je rozhodovateľ; konferencia o 5 týždňov. Chýba pomenovaný rozpočet a vlastník údajov. |
| **Fit s naším tímom** (`fit`) | 0,8 | **4** | Bruno: príbeh a video sú veľká výhoda. Maťo: radiačná ochrana a zobrazovanie sa tu **nepoužijú** a biologickú správnosť zhôd nikto z vás neoverí; treba sa spoliehať na zdroje a prípadne na pomoc NÚVR. |
| **Nízke regulačné a klinické riziko** (`riziko`) | 0,6 | **9** | Žiadne údaje o pacientoch, nie zdravotnícky prostriedok; len verejné odborné údaje o vedcoch. Zvyšné riziko: **vymyslené tvrdenia o skutočných ľuďoch** (reputácia), preto zdroje a značka „prototyp“. |

**Vážený priemer: 5,04 / 10** (súčet váha × skóre = 80,7; súčet váh = 16,0) [prepočet]. Pre porovnanie: mamograf 6,45 (`vyzvy/vzp-mamograf.md`).

**Čítanie skóre:** výzva je **bezpečná, dobre uskutočniteľná a dátovo prekvapivo bohatá**, ale **slabá na pacienta, platiteľa a veľkosť problému**. Ak je hlavný cieľ „najzmysluplnejší nápad s kupcom“, je lepšie hľadať inde (VZP výzvy, MDT, koordinácia). Ak je cieľ „istá, čistá výzva s unikátnym dátovým prístupom a dobrým príbehom pre Bruna“, má zmysel, a to najmä preto, že **zadávateľ je zároveň sobotný rozhodovateľ**.

---

## 8. Riziká a čo spraviť do 19:00 (ak by ste ju zvolili)

**Riziká**
1. **Vymýšľanie o skutočných ľuďoch.** Každé tvrdenie musí mať zdroj; inak „nenachádza sa“. Značka „prototyp na verejných údajoch; vlastník údajov môže opraviť“.
2. **Zmiešané osoby** (OpenAlex podľa mena). Viazať vedcov na DOI zo svojich profilov NÚVR.
3. **Limit OpenAlex** (denný, bez kľúča) a **oneskorený Azure**. Záloha Europe PMC a vopred spočítané odpovede.
4. **Ľahké na začatie = veľa podobných dem.** Odlíšenie: skutočné dáta, spätné overenie, medzery, správa údajov, príbeh.
5. **Slabý „X z Y“**: ak spätný test dopadne zle, povedať to a ukázať, kde nástroj pomôže (medzery, spoluprácu naprieč mestami).
6. **Nízky dopad na pacienta v nedeľnej porote.** Pripraviť poctivú vetu (nepriamy prínos) a číslo z pilota.
7. **Súkromie vedcov:** len verejné odborné údaje, žiadne e-maily v UI, možnosť opravy alebo odhlásenia.

**Čo spraviť do 19:00 (ak sa rozhodnete)**
- Opýtať sa Šedu v kanáli štyri otázky z §1.3 (pre vás najdôležitejšia: „smieme použiť verejné profily skupín z nuvr.cz v demo?“).
- Zriadiť si **bezplatný API kľúč OpenAlex** na vlastnom účte (nepísať ho do súborov) alebo rátať s Europe PMC.
- Ráno skontrolovať zadanie na Slacku (SMART ONCO AA stále chýba; k NÚVR sa nič nepridalo).

---

## Zdroje

**Interné (repo):** `docs/research/04`, `05` (§1.5, §2.6, §3.1), `06` (§3.3), `07`, `08`, `09` (§1.2, §3.12); `docs/materials/drive/INTRO_Praha_text.md`; `docs/materials/slack/best-use-of-intersystems/Rakathon_2026_InterSystems_Workshop.pdf`.
**Zadanie a Slack:** https://drive.google.com/file/d/1j1U1jmJ666aH2-3bFOBSh1bAAHKa4Ruq/view ; Slack `#nuvr-research-matchmaker` (https://rakathon2026.slack.com/archives/C0C82PUV4SV), `#02-dotazy`, `#06-hledam-tym`.
**NÚVR:** https://www.nuvr.cz/ ; https://www.nuvr.cz/vedci/ ; https://www.nuvr.cz/vyzkumne-programy/ ; https://www.nuvr.cz/o-nas/ ; https://www.nuvr.cz/spoluprace/ ; https://www.nuvr.cz/2024/06/12/indikator-katalogizace-technologii-a-pristroju-s-perspektivou-budouciho-sdileni/ ; https://www.nuvr.cz/en/2026/09/04/ready-to-hack-cancer-6695/ ; ukážkový profil https://www.nuvr.cz/vedec/barinka-cyril/.
**Médiá a verejné zdroje:** https://ct24.ceskatelevize.cz/clanek/domaci/vysledky-z-laboratori-v-praxi-vznikl-novy-cesky-institut-pro-vyzkum-rakoviny-15464 ; https://mzd.gov.cz/tiskove-centrum-mz/namestkem-pro-zdravotni-peci-se-stal-aleksi-sedo/ ; https://www.uzis.cz/res/f/008447/novotvary2019-2021.pdf ; https://www.isvavai.cz/opendata ; https://research-and-innovation.ec.europa.eu/funding/funding-opportunities/funding-programmes-and-open-calls/horizon-europe/eu-missions-horizon-europe/eu-mission-cancer_en.
**Štúdie:** https://doi.org/10.2139/ssrn.2486068 (Boudreau a kol.) ; https://doi.org/10.1136/bmjopen-2013-002800 (Herbert a kol.) ; https://doi.org/10.1126/science.1136099 (Wuchty a kol.) ; https://doi.org/10.1126/science.1158357 (Jones a kol.) ; https://doi.org/10.1038/483531a (Begley a Ellis) a https://en.wikipedia.org/wiki/Replication_crisis ; https://doi.org/10.1258/jrsm.2011.110180 (Morris a kol.).
**Konkurenčné riešenia:** https://www.elsevier.com/products/pure ; https://vivoweb.org ; https://profiles.catalyst.harvard.edu ; https://www.inpart.io ; https://www.scienceexchange.com ; https://directory.bbmri-eric.eu (nenačítalo sa).
**Dáta a technické kontroly:** Europe PMC REST (https://www.ebi.ac.uk/europepmc/webservices/rest/) a OpenAlex (https://openalex.org) vyskúšané dnes; vlastné počty z 65 profilov a stránky s prístrojmi (stiahnuté do dočasného priečinka, nie do repa).
