# 03 – Pre-Hack Day 2/2: technické prostredie (Microsoft) a čo vieme o výzvach

**Zdroj:** Wispr Flow meeting `35ef9cd5-46c1-42d8-aee6-f4760fde7f69` – „Rakathon Pre-Hack Day 2/2 (Fireflies nahrává)“
**Kedy:** 15. 10. 2026, 13:00–16:00 SELČ (záznam; Microsoft blok trval cca 1 h)
**Kto hovoril:** Michal (Microsoft, tech coach), organizátor Tomáš (v prepise ako „Speaker 4“ a čiastočne „caelestinus“ – diarizácia mieša mená), na konci súkromný rozhovor caelestinus × B Drek (nesúvisí s hackathonom).
**Share link:** https://notes.wisprflow.ai/shared/AM3TnVZilv6WbSIZV-bOnG6cu4Yr76Wr81t_k8SghTY
**Prečítané:** celý prepis (cca 52 000 znakov) + Flow summary.

> **Dôležité upozornenie hneď na úvod:** Táto session **NEPREDSTAVOVALA jednotlivé výzvy (challenges)**. Bola to čisto technická prezentácia Microsoftu o prostredí. Výzvy, ich vlastníci, datasety (okrem VZP), hodnotiace kritériá, harmonogram a ceny **zazneli iba okrajovo alebo vôbec**. Predstavenie výziev je naplánované na **úvodný dopoludňajší blok prvého hack dňa (16. 10.)**. Nižšie je presne to, čo zaznelo – nič nedomýšľam. Medzery sú vyznačené ako „NEZAZNELO“.

---

## 1. Výzvy / tracky – čo zaznelo

| Výzva / vlastník | Čo vieme | Dáta |
|---|---|---|
| **VZP** (Všeobecná zdravotní pojišťovna) – viac výziev | VZP „predstavila“ konkrétne výzvy (zrejme na Pre-Hack Day 1/2 alebo v podkladoch – v tomto prepise sa obsah výziev nepopisuje). VZP je zároveň partner, cez ktorého tenant beží celé Azure prostredie. | **Jediné dáta vystavené na portáli aka.ms/rackathon2026**: popis datasetu + **anonymizovaný dataset** ku konkrétnym výzvam VZP. Dá sa prezerať aj stiahnuť priamo z portálu. Formát NEZAZNEL. |
| **Ostatné výzvy** (iní autori) | Autori výziev ich predstavia „zajtra“ (16. 10.) v úvodnej session. | Dáta zdieľajú autori výziev **do Slack kanálov konkrétnych výziev, najneskôr po zajtrajšom úvodnom dopoludňajšom bloku** (potvrdil organizátor). |
| Verejné dáta | Michal: v rámci výziev sa dajú použiť akékoľvek verejne dostupné dáta, obmedzenia v tomto smere nie sú. | – |

- Problem statementy, očakávané výstupy jednotlivých výziev: **NEZAZNELO** v tejto session.
- Kontext/zmysel podujatia (Michal na záver): nejde priamo o „boj proti rakovine“, ale skôr o **zlepšenie stavu z pohľadu toho, ako to pacient prežíva a cíti** (patient experience).
- Cieľ hackathonu podľa organizátora: **proof of concept / prototyp**.

## 2. Technické prostredie

### 2.1 Portál – vstupná brána
- **URL:** `aka.ms/rackathon2026` (+ QR kód). Do portálu sa prihlasuje **tímovým účtom**.
- Na portáli nájdeme:
  - **API kľúč** k LLM modelom nasadeným v Azure (zobrazí sa hneď hore),
  - **endpoint** (adresa), zoznam nasadených modelov – po rozbalení karty modelu je vidno **presný názov deploymentu** a endpoint daného modelu,
  - „Hello world“ ukážku volania (REST API aj Python),
  - **dáta k výzvam VZP** (popis + anonymizovaný dataset, stiahnuteľné),
  - **QR kód / špeciálnu URL na aktiváciu GitHub Copilot licencie**,
  - odkazy na Microsoft dokumentáciu a príklady (napr. ako postaviť single page app do Static Web Apps).

### 2.2 Prístupové údaje tímu
- Každý tím dostane **UPN** (formát `tím@<doména>`) a **access pass** (v prepise „Poly/fore Access Pass“ – zrejme *Temporary Access Pass*) = **časovo obmedzené heslo** do prostredia.
- Rozdáva sa **až od začiatku hackovania (od 16. 10.)** – buď fyzicky ako **kartička s QR kódom** na mieste, alebo cez **tímový Slack kanál**. Dá sa o ňu aj explicitne požiadať.
- Predpoklad: tím má mať na Slacku vytvorený **tímový kanál s názvom tímu** (podľa inštrukcií organizátorov, zopakujú ich 16. 10.).
- Týmto tímovým účtom sa prihlasuje do portálu aj do **Azure portálu (portal.azure.com)**.

### 2.3 LLM modely (Azure, cez API)
- Modely od cca **4–5 providerov**:
  - **OpenAI** – najnovší spomenutý „Astra 6.1 Sol“, plus menšie/rýchlejšie modely,
  - **xAI – najnovší Grok**,
  - **DeepSeek** (posledný),
  - **Microsoft** modely (napr. aj na generovanie obrázkov).
  - Zoznam sa môže priebežne rozširovať („svet je veľmi rýchly“).
- Všetky by mali byť dostupné cez **OpenAI-kompatibilné API**; fungujú **Chat Completions aj Responses API**. Ľubovoľný framework.
- **Jeden kľúč pre všetky modely** (zdieľaný v portáli).
- Treba si overiť: správny **endpoint**, správnu **API verziu**, správny **názov deploymentu** (nie len názov modelu). Názvy deploymentov obsahujú verziu modelu a info, či je nasadený v **EU alebo globálne**.
- Kľúč ako secret: posielať v **hlavičke**, držať v **env premennej** / secret store, **necommitovať do kódu**, **nikdy nedávať do frontendu/prehliadača**.
- Určenie: tieto modely sú na **AI vo výslednej aplikácii** (runtime). Na **kódovanie** je určený **GitHub Copilot**.
- **Rate limiting:** všetky tímy zdieľajú rovnaký endpoint → môže prísť **HTTP 429 / quota exceeded** → aplikačne riešiť **retry s exponential backoff**. Je to normálne správanie.
- 401/403 (revokovaný prístup, trafený limit) → hlásiť koučom.

### 2.4 Azure – oprávnenia a služby
- Azure = public cloud; všetky prostriedky musia patriť do **resource group**.
- Každý tím má **vlastnú resource group `RG-<názov tímu>`** (názov tímu podľa kartičky). Je **prázdna**. Iné tímy by ste nemali vidieť; ak vidíte, je to chyba setupu – nezasahovať a nahlásiť.
- Rola: **iba Contributor**. **Nemožno priraďovať RBAC role**, **žiadny prístup do Entra ID** (tenant patrí VZP a je strážený). **Azure DevOps nie je** v ponuke. Špeciálne potreby (napr. managed identity, RBAC) riešiť individuálne s koučmi na Slacku.
- **GPU stroje a iné „drahé“ VM sú defaultne zakázané** – pri špecifickej potrebe písať koučom na Slack.
- Inak bez zásadných obmedzení na služby.
- **Odporúčané patterny / služby:**
  - **Azure Static Web Apps** – statický web/SPA, má free tier, cez jednoduché API volá serverless komponenty; ideálne napr. na formuláre / triáž prípadov.
  - **Azure Functions** (serverless) – napojenie na DB, workflow („keď sa stane X, urob Y“).
  - **Azure Durable Functions** – stavové spracovanie (state, rewind), napr. spracovanie sád dokumentov/dát/požiadaviek.
  - **Azure Container Apps** – klasický backend v Dockeri (FastAPI, ASP.NET, JS…), so škálovaním.
  - Databázy: **Azure SQL, Postgres, „Horizon DB“, Cosmos DB** – treba si ich postaviť vo vlastnej RG.
- **Azure Copilot** + nový **deployment agent** priamo v Azure portáli – vie podľa požiadavky vytočiť zdroje a sprevádza agentom namiesto formulára.
- **InterSystems image**: dá sa nasadiť do Azure **jedným príkazom**; obsahuje nástroje na prácu s medicínskymi dátami (detaily v InterSystems session).

### 2.5 Limity a rozpočet
- Prostredie pripravené v spolupráci s VZP, s nastavenými **limitmi a budgetmi** – po prekročení môžu služby prestať fungovať / byť nedostupné → hlásiť.
- Orientačne **100–200 USD na tím na deň** v Azure (nie je to garantované ani pevné; limity sú „pohyblivé“ podľa toho, ako sa tímy rozložia).
- **Free tiery sú zdieľané na úrovni celej subscription** – ak ho niekto vyčerpal, zvoliť iný tier.

### 2.6 GitHub Copilot
- **Každý hacker (nie tím)** dostane vlastnú licenciu → 5-členný tím = 5 licencií. U nás 2 licencie (Bruno, Matej).
- Aktivácia: **QR kód / špeciálna URL na portáli** → login page → vyplniť pár údajov → **pripojenie do GitHub organizácie** s prednabitým kreditom.
- Copilot účet **nie je** tímový účet z kartičky – je to osobný GitHub účet každého hackera.
- **POZOR:** kto už má **platený GitHub Copilot** (súkromný alebo pracovný), nech si radšej **založí nový GitHub účet** – organizácia by nahradila existujúcu licenciu a museli by ste ju potom obnovovať.
- Kredit: cca **100 USD na účet**; **1 AI credit = 1 cent** (Michal si nebol istý, či to je 10 000 alebo 100 000 kreditov – pri 1 cent/kredit je to 10 000). Po skončení hackathonu alebo vyčerpaní kreditu sa licencia odreže – žiadne náklady navyše. Po vyčerpaní si môžete použiť vlastné prostriedky.
- Cenu modelov vidno v appke vpravo („AI credits“), napr. Claude Opus 5.5 output ~2000 jednotiek / 1M tokenov.
- Dostupné modely cez Copilot: OpenAI, **Anthropic**, Google, xAI a ďalší.
- Kde beží: **VS Code** (chat vpravo), **Copilot CLI** (Win/Linux/Mac – nainštalovať, prihlásiť), **GitHub Copilot app** (nový prístup: riadenie viacerých agentov a sessions, issues/tasky – Michal ju „vrelo odporúča“). Agenti môžu bežať lokálne aj **v cloude (GitHub)** – užitočné napr. cez noc; spotreba kreditu rovnaká.
- Copilot vie použiť **Claude Code skills 1:1**.
- Licencia zahŕňa aj **GitHub** (repozitáre) – teda práca na GitHube namiesto Azure DevOps.
- Tipy:
  - Nedávať všetko na najväčší model (Astra / Opus 5.5) – **na kódovanie a subagentov lacnejšie/menšie modely**, veľký model + vysoký reasoning effort len na **architektúru a plánovanie**.
  - Pri pálení napr. 20 subagentov na jeden prompt – kredit rýchlo ubúda; subagentom dať menšie modely.
  - Kontrolovať výstup jedného modelu iným modelom.
  - Reasoning effort a context window sa dajú nastaviť per session.
  - Agent vidí defaultne iba otvorený projekt (adresár/repo).
  - **Git worktree** per session („workpiece“ v prepise) – umožní paralelnú prácu na viacerých vetvách.
  - Na architektúru/plánovanie použiť skills (napr. Anthropic skills).

## 3. Pravidlá

- **Predtým vytvorený kód / boilerplate / UI komponenty sa smú použiť**, ale treba ich **konkrétne a transparentne deklarovať** a pri prezentácii mentorom **oddeliť**, čo vzniklo pred a čo počas hackathonu. **Hodnotí sa to, čo vzniklo počas hackathonu.**
- Odporúča sa uviesť aj použité **nástroje a dátové zdroje/sady** – detaily zaznejú 16. 10. na úvod.
- **Všetky submissions budú zverejnené** (pre všetkých účastníkov).
- **Použitie Azure / Microsoft technológií NEOVPLYVŇUJE hodnotenie výziev** – je to len možnosť/odporúčanie. Ale **ceny partnerov (InterSystems, prípadne aj nejaká cena Microsoftu) sa bez použitia ich technológií získať ťažko dajú**.
- Organizátor odporúča otvorené, **čo najinteroperabilnejšie protokoly** – uľahčí neskoršie nasadenie v nemocniciach / VZP.
- Bezpečnosť: **nikdy nezdieľať access pass ani API kľúč na Slacku** (ani koučom – nepotrebujú ho). Nezasahovať do RG iných tímov.

## 4. Hodnotenie, odovzdanie, ceny, harmonogram

- **Hodnotiace kritériá:** NEZAZNELI (iba: hodnotí sa práca počas hackathonu; Azure nie je kritériom).
- **Submission požiadavky:** NEZAZNELI detailne (iba: submissions budú zverejnené; deklarovať pred-hackathon kód, nástroje, dáta; prezentuje sa mentorom).
- **Ceny:** spomenutá **cena InterSystems** a „možno aj nejaká cena Microsoft“ – výška/podmienky NEZAZNELI.
- **Harmonogram (čo zaznelo):**
  - 15. 10.: Microsoft session (~1 h) → 30 min pauza → **14:30 predstavenie nástrojov a podpory od InterSystems** (hlavný technologický partner) – odporúčané poslať aspoň 1 člena tímu; je to nahrávané, slajdy budú.
  - 16. 10. dopoludnie: **úvodný blok – predstavenie výziev**, inštrukcie (Slack tímové kanály, pravidlá, nástroje/dáta), potom **začiatok hackovania**. Od toho momentu: kartičky s prístupmi, dáta výziev v Slack kanáloch, mentori plne k dispozícii.
  - Deadline odovzdania a koniec hackathonu: NEZAZNELI.
- Hackuje sa distribuovane: **Praha, Brno, Ostrava** (tím môže byť na ktoromkoľvek mieste).

## 5. Mentori a podpora

- **Microsoft tech coaches** (Michal + tím; jedna kolegyňa nehovorí česky, ale má skúsenosti z tejto domény). Expertíza: **technika** – Azure, moderné AI aplikácie, architektúra, frontend, aplikačný vývoj. **Nie doménová (medicínska) znalosť.**
- Primárne cez **Slack**, niektorí aj **onsite** v lokalitách.
- Slack kanály:
  - **#Tech Support** – technické problémy,
  - **#Hledám mentora** – hľadanie mentora,
  - **oznámení / announcements** – tam pôjde aj link na Michalovu prezentáciu (GitHub Pages),
  - **kanály jednotlivých výziev** – dáta k výzvam,
  - **tímový kanál** (vytvoriť podľa inštrukcií).
- Pri hlásení problému uviesť: **tím, endpoint/deployment, čas** (aby sa dalo dohľadať v logoch); pri Copilot probléme aj **GitHub login**. **Nikdy kľúč/pass.**

## 6. Tipy z prezentácie (pre rýchly štart)

- Pre PoC nad malými dátami stačí jednoduchý stack: **Static Web App (frontend) + Azure Functions (API) + malá DB**, alebo **Container Apps** pre Docker backend (FastAPI).
- LLM volania robiť **zo servera** (Functions/Container App), kľúč v env / secret store – nie v prehliadači.
- Hneď na začiatku spraviť „hello world“ volanie z portálu, overiť kľúč, endpoint, deployment name, API verziu.
- Do kódu zabudovať **retry s exponential backoff** na 429.
- Šetriť Copilot kredit: menšie modely na kódovanie.
- Ak cielime na **cenu InterSystems** – pozrieť ich image (jeden príkaz do Azure) a session/slajdy z 14:30.

---

## Praktický checklist na štart

**Pred / hneď ráno 16. 10.**
- [ ] Byť na úvodnom dopoludňajšom bloku (predstavenie výziev) – zapísať si pre každú výzvu: vlastník, problém, dáta, očakávaný výstup.
- [ ] Na Slacku vytvoriť **tímový kanál s názvom tímu** podľa inštrukcií organizátorov.
- [ ] Sledovať **kanály výziev** – tam pribudnú dáta (najneskôr po úvodnom bloku).
- [ ] Pozrieť záznam/slajdy **InterSystems session** (15. 10., 14:30), ak sme ju nevideli.
- [ ] Nájsť link na Michalovu prezentáciu (GitHub Pages) v kanáli oznámení / Tech Support.

**Prístupy (od začiatku hackovania)**
- [ ] Vyzdvihnúť **kartičku tímu** (UPN + časovo obmedzený access pass) na mieste alebo v tímovom Slack kanáli; ak nepríde, explicitne si o ňu požiadať.
- [ ] Prihlásiť sa tímovým účtom na **aka.ms/rackathon2026**.
- [ ] Skopírovať API kľúč do lokálneho `.env` (pridať `.env` do `.gitignore`!), poznačiť si **endpoint, presné deployment names a API verziu** vybraných modelov.
- [ ] Spustiť „Hello world“ volanie (Python/REST) – overiť, že kľúč funguje. Ak nie → #Tech Support (tím + deployment + čas, bez kľúča).
- [ ] Ak ideme na VZP výzvu: stiahnuť **popis datasetu + anonymizovaný dataset** z portálu.
- [ ] Prihlásiť sa na **portal.azure.com** tímovým účtom, overiť, že vidíme len `RG-<názov tímu>`.

**GitHub Copilot (Bruno aj Matej zvlášť)**
- [ ] Zistiť, či máme na svojom GitHub účte **platený Copilot** – ak áno, **založiť nový GitHub účet** pre hackathon.
- [ ] Naskenovať **QR kód z portálu** → pripojiť sa do GitHub organizácie → aktivovať licenciu (~100 USD kredit).
- [ ] Prihlásiť sa týmto účtom do VS Code / Copilot CLI / Copilot app a overiť licenciu v nastaveniach účtu.
- [ ] Vytvoriť tímové GitHub repo; dohodnúť sa na worktree/branch workflow.

**Pravidlá a hygiena**
- [ ] Ak použijeme čokoľvek pripravené vopred (boilerplate, komponenty, tento research), **zapísať to do README / submission** a jasne oddeliť od práce počas hackathonu.
- [ ] Viesť zoznam použitých **nástrojov a dátových zdrojov**.
- [ ] Nikdy nezdieľať access pass ani API kľúč (Slack, repo, frontend).
- [ ] Rozpočet Azure ~100–200 USD/deň/tím – nevytáčať drahé služby; GPU nie je (bez žiadosti).
- [ ] Rozhodnúť, či chceme cieliť na **partnerskú cenu** (InterSystems / Microsoft) – vtedy treba ich technológiu reálne použiť.

## Otvorené otázky (zistiť 16. 10.)
- Kompletný zoznam výziev, ich vlastníci, problem statementy a očakávané výstupy.
- Formát a obsah dát (VZP aj ostatné).
- Hodnotiace kritériá, formát a **deadline submission**, dĺžka pitchu/prezentácie.
- Ceny (výška, kategórie), podmienky partnerských cien.
- Harmonogram hackathonu (koniec, checkpointy, finále).
