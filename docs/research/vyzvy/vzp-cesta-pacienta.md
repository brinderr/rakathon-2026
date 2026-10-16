# VZP – Cesta pacienta bez ztráty informací (všetky mestá): hĺbková analýza

_Stav: piatok 16. 10. 2026, cca 16:30. Písané pre Bruna a Maťa (nie sú technici). Odborné pojmy sú vysvetlené v zátvorke. Pri číslach je zdroj (URL). **[?]** = neisté alebo som to nevedel overiť. **[V]** = overené v primárnom zdroji, **[S]** = sprostredkovaný zdroj (výsledok vyhľadávania, tlačová správa, deck zadávateľa), **[náš výpočet]** / **[odhad]** = moje vlastné počty alebo úsudok, nie fakt. Nič som nevymýšľal. Slack som iba čítal (nič som neposielal), nič sa necommitovalo._

_Prečítané: `04`, `05`, `06`, `07`, `08`, `09`, `02`, `docs/materials/` (4 zadávacie dokumenty), kanál `#cesta-pacienta-bez-ztraty-informaci` (celý, vrátane vlákien; posledná správa o 14:05, vlákna sú prázdne), celý balík `cesta-pacienta-data.zip` (13 správ pacientky + 4 šablóny + 13-slidový deck; rozbalené mimo repa, údaje pacientky som do repa nekopíroval), živá tabuľa tímov `submit.rakathon.cz/vyzvy`, VZP Inovačný portál. Web search: rozpočet vyhľadávaní sa mi minul uprostred práce, preto niektoré citácie (MDT štúdie, ceny konkurencie) pochádzajú len z výsledkov vyhľadávania a označil som ich [S]._

---

## 0. Zhrnutie na 1 minútu

**Čo to je (jednou vetou):** Koordinátor v komplexnom onkologickom centre (KOC) dostane od praktika pacienta s podozrením na rakovinu, ku ktorému sa správy valia z 5–7 pracovísk v rôznych formách. Úlohou je postaviť prototyp, ktorý z nich zloží podklad pre onkologické konzílium (MDT), povie, čo chýba a čo si odporuje, ukáže, kto je „na ťahu“, a po konzíliu vráti záver praktikovi s dôkazom doručenia.

**Prečo je to zaujímavé pre nás:**
1. **Najpresnejšie zadanie zo všetkých 24 výziev.** Máme konkrétnu pacientku, 13 reálne vyzerajúcich správ, šablóny vstupu aj výstupu a ukážkový záver. Presne vieme, čo musí demo ukázať („Hotovo, keď…“ pri každom kroku).
2. **Reálny, dnešný bottleneck s vyhradeným peniazom:** od januára 2026 má každé z 15 KOC koordinátora (250 Kč za výkon, „nižšie desiatky miliónov Kč ročne“) a pilotujú sa aplikácie pre nich; štandardný nástroj zatiaľ nie je. Zadanie samo hovorí: „ďalším krokom je nástroj, ktorý mu uľahčí administratívu“.
3. **Zadávateľ je zároveň kupec a porotca.** VZP platí koordinátora aj spúšťa Inovačný portál; porotcovia v nedeľu (Hlavinka z VZP, Foldyna Hellová z MZ) sú ľudia, ktorým patrí tento program.
4. **Demo za noc je veľmi realizovateľné.** Celý prípad má len ~2 900 slov (13 krátkych .docx), takže sa celý zmestí do jedného volania AI. Rozhodne polish, spoľahlivosť a príbeh, nie ťažká technika.
5. **Naše silné stránky sa tu uplatnia v pitchi.** Príbeh pacientky Aleny, silné video a živá obrazovka. Maťova radiačná ochrana sa dá priviesť cez „snímky z iného centra vs. opakované CT“.

**Hlavné riziká:** (a) veľa tímov postaví „AI vyťaží text“, odlíšime sa len kvalitou (citácie, pasce v dátach, uzavretá slučka); (b) peniaze: VZP Inovačný portál zatiaľ jasne nepripúšťa organizačné/procesné nástroje [V]; samotný český trh je malý; (c) len 1 pacientka v dátach, treba zvládnuť aj inú vstupnú správu, keď sa porota opýta; (d) regulácia (MDR, GDPR) je pre produkt po hackathone reálna prekážka; (e) neistota, či víťaza VZP výziev určujú mestá, alebo celá krajina [?].

**Skóre (vážený priemer): 7,0 / 10** (detail v §7). Pre porovnanie: 5 = priemer medzi výzvami. Podľa mňa ide o jednu z 2–3 najsilnejších výziev pre náš tím, hlavne vďaka zhode „jasné zadanie + jasný kupec + zadávateľ v porote + dá sa spraviť za noc“.

---

## 1. Presné zadanie

### 1.1 Odkiaľ to je
- **Kanál `#cesta-pacienta-bez-ztraty-informaci`** (Slack `rakathon2026`): iba 1 vecná správa, organizátor Ondřej Baštař 16. 10. 14:05 „Podklady k výzvě“ + súbor `cesta-pacienta-data.zip` (3,2 MB). Hacker z tímu FIT/S sa o 14:00 pýtal, či existujú podklady okrem VZP dát na Azure; odpoveď bola práve tento ZIP. Žiadne ďalšie otázky, odpovede ani vlákna. [Slack: https://rakathon2026.slack.com/archives/C0C84GD9JAG/p1792152304485149]
- **ZIP obsahuje:** `Zadani_ulohy.docx`, `Handover_obsah.docx`, `MDT_zapis.docx`, `MDT zaver.docx`, priečinok `Pacient/` (13 správ .docx) a deck `Rakathon_cesta_pacienta final.pptx` (13 slidov). Kópie 4 špecifikačných dokumentov sú v `docs/materials/drive/cesta-pacienta-data/`.
- **Dáta VZP na Azure portáli** (`aka.ms/rakathon2026`) sú spoločné pre VZP výzvy (mamograf a koniec života); pre túto výzvu nie sú podľa kanála potrebné [?] (nikto organizátora nepotvrdil, že tam nie je nič ďalšie).

### 1.2 Čo to je
VZP a hostia (nemocnice, ministerstvo) chcú **„software pre koordináciu onkologickej starostlivosti medzi referujúcim lekárom a KOC“** (titulný slide decku). Ministerstvo zdravotníctva zaviedlo koordinátora, VZP jeho prácu platí, a **„ďalším krokom je nástroj, ktorý mu uľahčí administratívu“** (slide 2).

Problém má **tri miesta, kde sa strácajú informácie** (slide 5):
1. **Na vstupe:** dokumentácia prichádza roztrieštene a často neúplne, lekári opakovane prepisujú údaje, ktoré už existujú.
2. **Vnútri KOC:** koordinátor trávi veľkú časť času dohľadávaním údajov namiesto koordinácie; nie je spoločný prehľad stavu, termínov a zodpovednosti; MDT môže dostať podklady neskoro alebo neúplné.
3. **Na výstupe:** referujúci lekár nevie, či bol pacient prijatý, čo chýba a ako MDT rozhodlo; prieťah medzi odoslaním, doplnením dokumentov, rozhodnutím a začiatkom liečby sa ťažko sleduje.

Koordinátor stráži **čas do liečby = T1 (diagnostika) + T2 (MDT) + T3 (liečba)**. Ukážkový prípad v decku: pán Novák, 60 rokov, príznak 5. 1., operácia 26. 1. (21 dní).

### 1.3 Štyri kroky a „Hotovo, keď…“ (slidy 6–11)

| Krok | Úloha | Hotovo, keď… |
|---|---|---|
| 01 PREVZIAŤ | Jedno digitálne miesto na vstup do KOC. Externý lekár vyberie KOC, vyplní svoje údaje a nacionále pacienta, priloží epikrízu a suspektnú diagnózu, nahrá správy zo svojho softvéru. **Bez ďalšieho veľkého formulára**, ručné vypĺňanie na minimum, zvyšok z nahranej správy. | Koordinátor dostane všetky potrebné informácie o pacientovi **v jednom kroku**. |
| 02 VYŤAŽIŤ | AI z dokumentácie vytiahne kľúčové údaje do **pevnej štruktúry**, **označí, čo chýba**, výstup v kopírovateľných častiach. **AI iba pripraví návrh, lekár potvrdí.** Koordinátor môže cez software požiadať lekára o doplnenie. | Koordinátor vidí **lekárom potvrdený** strukturovaný handover aj **zoznam chýbajúcich údajov**. |
| 03 KOORDINOVAŤ | Dashboard: fronta pacientov (nový / aktívny / odložený), detail s kontextom z referovania + úlohy s termínom a prioritou; digitálny plán: sady úloh podľa diagnózy (napr. karcinóm pankreasu), poradie krokov, e-mail/SMS/chat, notifikácie. | U každého pacienta je vidno **stav, termín a kto je na ťahu**; je jasné, kde je prípad a do kedy treba spraviť ďalší krok. |
| 04 SPÄTNÁ VÄZBA | Po rozhodnutí KOC/MDT vrátiť referujúcemu lekárovi jasný štruktúrovaný výsledok s pôvodným kontextom; revíznemu lekárovi automaticky; odovzdanie potvrdiť a prípad uzavrieť. | Referujúci lekár má výsledok **aj s kontextom** a odovzdanie je **potvrdené**. |

**Demo musí ukázať** (slide 12): referovanie bez ďalšieho formulára; AI vyťaženie s kontrolou úplnosti; prehľad prípadov so stavom a termínom; vlastníka každého ďalšieho kroku; štruktúrovaný záver KOC/MDT; spätnú väzbu a potvrdené odovzdanie. Veta zadávateľov: **„Rakathon overí princíp. Produkčná integrácia patrí do ďalšej fázy.“**

### 1.4 Konkrétna súťažná úloha (`Zadani_ulohy.docx`)
„Využite dostupnú dokumentáciu a nasimulujte vo vašej aplikácii prácu koordinátora KOC pri súťažnom prípade.“
- Aplikácia z dokumentácie vytvorí **handover pre MDT dňa 21. 10. 2026** podľa zoznamu `Handover_obsah`. **AI označí chýbajúce podklady.** Aplikácia umožní koordinátorovi tieto podklady **doplniť** a zapracovať do handoveru. Správu z MDT aplikácia **pošle praktikovi** a **doloží doručenie**.
- Čo aplikácia má vedieť: Prevziať (žiadosť praktika o prevzatie do KOC 2) · Vyžiadať a zhromaždiť (koordinátor vyžiada chýbajúce správy z iných pracovísk, všetko na jednom mieste) · Vytiahnuť (AI údaje + upozornenie na chýbajúce **alebo nesúhlasiace** údaje) · Koordinovať (CT v KOC 1, biopsia, kontrolné odbery, algeziológ, psychológ, každý krok s termínom, miestom a stavom) · Pripraviť podklad pre MDT (len z údajov dostupných k 21. 10.) · Uzavrieť slučku (po MDT poslať záver praktikovi a doložiť doručenie).
- **Čo odovzdať:** (1) funkčné demo celého priechodu pacientky; (2) správu k jednaniu MDT vytvorenú aplikáciou podľa `MDT_zapis`; (3) ukážku odoslania záveru MDT praktikovi.
- **Upozornenia zadávateľa:** správy algeziológa a psychológa vznikli **po MDT**, do podkladu patrí len to, čo bolo známe k 21. 10. 2026. Údaje preberať **bez domýšľania**, čo chýba, označiť. Všetky dáta sú fiktívne.
- Podoba formulára a dátová štruktúra: „navrhnú súťažiaci“ (`Handover_obsah`).

### 1.5 Dáta, ktoré dostaneme (fiktívna pacientka, 63 r., rakovina hlavy pankreasu C25.0)

| # | Dátum | Pracovisko | Dokument | K 21. 10. známe? |
|---|---|---|---|---|
| 01 | 20. 7. | Kardiologická ambulancia | kontrola 3 mesiace pred diagnózou | áno |
| 02 | 1. 9. | Laboratórium LabJih | krvný obraz, biochémia, moč, kultivácia | áno |
| 03 | 3. 9. | Rádiologické centrum | RTG pľúc | áno |
| 04 | 4. 9. | Praktik | epikríza, ATB, odoslanie ku gastroenterológovi | áno |
| 05 | 15. 9. | Gastroenterológia | vstupné vyšetrenie | áno |
| 06 | 29. 9. | RDG Polikliniky | USG brucha | áno |
| 07 | 2. 10. | Praktik | epikríza a **žiadosť o prevzatie do KOC 2** (bez výsledkov vyšetrení) | áno |
| 08 | 8. 10. | KOC 1 | CT brucha a hrudníka | áno |
| 09 | 12. 10. | KOC 2, endoskopia | protokol biopsie EUS-FNB | áno |
| 10 | 15. 10. | KOC 2, laboratórium | kontrolné odbery vrátane onkomarkerov | áno |
| 11 | 19. 10. | KOC 2, patológia | výsledok biopsie (histológia) | áno |
| 12 | 26. 10. | KOC 1, liečba bolesti | algeziologické vyšetrenie | **nie, po MDT** |
| 13 | 27. 10. | KOC 2, psychoonkológia | správa psychológa | **nie, po MDT** |

Šablóny: **`Handover_obsah`** (20 položiek, čo AI vyťažuje: nacionále, kontakty a kontaktná osoba, diagnóza a epikríza, otázka pre MDT, komorbidity, lieková anamnéza, alergie, výkonnostný stav ECOG/Karnofsky, váha a výška, príznaky a ich začiatok, vyšetrenia s dátumom, miestom, typom a výsledkom v plnom znení, laboratórne výsledky vrátane onkomarkerov, histológia, iné vrátane **želaní pacienta**); **`MDT_zapis`** (7 sekcií: základné údaje, členovia MDT, diagnóza s kódom MKN-10, komorbidity, výsledky vyšetrení, záver MDT, odporúčania); **`MDT zaver`** (vzorový záver, ktorý má aplikácia posielať praktikovi; slúži aj ako referencia na kontrolu našej správy).

Údaje sú v obyčajných `.docx`, dokopy ~2 900 slov (správy majú 99–504 slov). Pripomienka: v správach sú vymyslené telefónne čísla, adresy a rodné číslo, preto ich do repa nekopírujem.

### 1.6 Kritériá a hodnotenie
- **Špecifické váhy pre túto výzvu nie sú.** Platia všeobecné: sobota 1. AI technológia a prevedenie, 2. využiteľnosť v praxi u zadávateľa, 3. inovatívnosť; nedeľa pridáva 4. škálovateľnosť a 5. kvalitu prezentácie a tímu (`05` §2.3, `09` §1.1).
- **Sobotu rozhodujú zadávatelia:** 14:00–16:00 obchádzajú tímy a o 16:00 nahlásia víťaza. Pri tejto výzve to budú ľudia z decku (mentori). Preto je kľúčové **kritérium 2** a literálne splnenie „Hotovo, keď…“.
- **Odovzdanie:** sobota 13:00 (`submit.rakathon.cz`), povinný titulný obrázok 16:9 do 8 MB; odkazy na GitHub, demo a video (či sú povinné, nie je jasné [?]).

### 1.7 Mentori
Garant **Marián Rybář** (podľa `09` MZ ČR, nepotvrdené [?]); mentori **Tereza Chrástová, Klára Vaňková, Zuzana Bielčiková** (VFN / Nemocnica Na Františku), **Michaela Klimeš Lipánová**, **Jan Bartyzal** (cloud a dáta VZP). Chrástová a Klimeš Lipánová sa do kanála pridali dnes ráno, takže sú pravdepodobne v Prahe [?]. Ďalšia autorka decku: Michaela Tůmová. Mentori sú zároveň autori zadania, čiže **vedia, čo chcú vidieť**, a vieme sa ich pýtať na reálne čísla (viď §3.5).

### 1.8 Pasce a nezrovnalosti, ktoré som v balíku našiel (naše zistenia po prečítaní všetkých 13 správ)
Úloha hovorí „označte chýbajúce **alebo nesúhlasiace** údaje“. V dátach je viacero vecí, ktoré to otestujú. Nie je isté, ktoré sú zámer a ktoré preklepy [?], ale dobré riešenie ich musí vedieť označiť:

| # | Kde | Čo | Čo má aplikácia urobiť |
|---|---|---|---|
| 1 | celý balík | **ECOG (výkonnostný stav) nie je nikde uvedený.** Vzorový MDT záver to sám potvrdzuje. | Označiť „chýba“, navrhnúť žiadosť (onkologická ambulancia / praktik). |
| 2 | správa 09 (výkon 12. 10.) | „Posledná dávka apixabanu **18. 10. 2026** večer“ pri výkone 12. 10. a „znovu od **21. 10.**“ | Označiť **rozpor dátumov**, nehádať správnu hodnotu. |
| 3 | správa 11 (histológia) | Materiál „odber **20. 10.**“, ale správa je **vydaná 19. 10.** a biopsia bola 12. 10. | Označiť rozpor. |
| 4 | správy 09 a 11 | Výsledok histológie bol sľúbený „do 3 pracovných dní“ (12. 10. je pondelok, teda do štvrtku 15. 10.), vydaný 19. 10. (5. pracovný deň) [náš výpočet] | Signál na eskaláciu v plánovači (nie rozpor v dátach). |
| 5 | správa 04 | Praktik plánuje kontrolu 9. 9. s odberom, správa z nej v balíku nie je | Označiť ako možnú chýbajúcu dokumentáciu. |
| 6 | správa 07 | Praktik píše „výsledky sú k dispozícii na jednotlivých pracoviskách“, teda **správy 01–06 treba vyžiadať** (to je krok „Vyžiadať a zhromaždiť“) | Plán žiadostí s adresátom pre každú správu. |
| 7 | správy 01, 05, 12 | Váha 69 kg (20. 7.), 65 kg (15. 9.), 63 kg (26. 10., **po MDT**); výška len 165 cm z kardiológie | Do podkladu 65 kg a 165 cm s dátumom a zdrojom, 63 kg nie. |
| 8 | správy 07 a 13 | Súhlas pacientky so zdieľaním informácií s dcérou je už v správe 07 (pred MDT). Želanie v správe 13 je po MDT. | Použiť 07, **nepoužiť** 13. |
| 9 | `MDT_zapis` vs. správy | E-mail pacientky a praktika v dokumentoch nie je; zoznam členov MDT tiež nie (zdroj je rozpis MDT v KOC) | Označiť „chýba“ / „vstup koordinátora“, nevymýšľať. |
| 10 | správa 08 | CT bolo v KOC 1, MDT beží v KOC 2, vzorový záver hovorí o „radiologickej revízii“. Správa nehovorí nič o dostupnosti **snímok** v KOC 2. | Poznámka „overiť dostupnosť snímok“ (aj Maťova téma, viď §5.5). |
| 11 | správy 01, 05, 09 vs. vzorový záver | Kardiológ: apixaban vysadiť 48 h pred rizikovým výkonom; vzorový MDT záver: „samostatne nevysadzovať, postup určiť individuálne“ | Ukázať ako upozornenie („rôzne odporúčania“), **nerozhodovať**. |
| 12 | správa 10 | Onkomarkery: CA 19-9 312 (vysoké), **CA 125 48 (mierne vysoké)**, CEA v norme. Vzorový záver spomína len CA 19-9. | Do podkladu všetky markery („všetko, nie výber“). |
| 13 | správa 07 | „Otázka na MDT“ je všeobecná („dokončenie diagnostiky a stanovenie ďalšieho postupu“) | Označiť ako neurčitú, navrhnúť doplnenie. |

### 1.9 Čo nevieme [?]
- Dĺžka pitchu (INTRO ju neuvádza; MDT Copilot zadanie hovorí 5 min).
- Či VZP víťaza určujú mestá osobitne, alebo jeden pre celú krajinu (INTRO: „víťaz každej výzvy“).
- Či je GitHub / video pri odovzdaní povinné.
- Či má VZP portál ešte nejaké dáta k tejto výzve (iné ako ZIP).
- Presné údaje o prevádzke koordinátorov (koľko prípadov týždenne, koľko minút na prípad) – treba sa opýtať mentorov (§3.5).

---

## 2. Koncový užívateľ

### 2.1 Kto presne
**Hlavný používateľ: koordinátor onkologickej starostlivosti v KOC** (podľa MZ v 3 typoch):
- **Koordinátor 1:** začína, keď je silné podozrenie na rakovinu, a vedie pacienta diagnostikou do KOC; má pôsobiť hlavne na „predsunutých“ pracoviskách (pneumológia, gastroenterológia).
- **Koordinátor 2:** pôsobí **vnútri KOC po diagnóze** a pomáha **zostaviť podklady pre MDT**. V našom prípade je to „koordinátor KOC 2“.
- **Koordinátor 3:** následná starostlivosť po liečbe.
- Môže byť **aj nelekár** (minimálne stredoškolské vzdelanie), pracuje **na základe písomnej žiadosti ošetrujúceho lekára**, nerozhoduje o liečbe, sleduje, či sú vyšetrenia, výsledky a dokumenty hotové, objednáva termíny a upozorňuje na systémové brzdy. Používa nemocničný informačný systém „v plnom rozsahu“ a vedie záznam o koordinácii. Odmena: 250 Kč za koordinovaného pacienta. [V: MZ ČR 2. 9. 2026, https://mzd.gov.cz/tiskove-centrum-mz/jeden-kontakt-mene-cekani-rychlejsi-cesta-k-lecbe-koordinatori-meni-peci-o-onkologicke-pacienty/]

**Vedľajší používatelia:** referujúci **praktik** (potrebuje jednoduché odovzdanie a spätnú väzbu), **lekár, ktorý prípad na MDT prezentuje** (má na pacienta 2–4 minúty [S]), **revízny lekár**, a **pacientka** s dcérou (pasívne, ale ona je dôvod, prečo to robíme).

### 2.2 Jeho deň (ilustrácia, zložená zo zadania a vystúpení expertov; nie je to zdokumentovaný časový rozpis, overiť s mentormi [odhad])
Postava z fiktívneho vzorového záveru: **Bc. Lucie Dvořáková, koordinátorka KOC.**
1. **Ráno:** v spoločnej schránke koordinácie je niekoľko nových žiadostí od praktikov. Jedna je „Alena P., 63, suspektný nádor hlavy pankreasu, urgentne“. Epikríza je 2-stranový dokument, **výsledky vyšetrení v nej nie sú**, len zoznam, kde sa dajú nájsť. Chýba e-mail aj jasná otázka pre MDT.
2. **Dohľadávanie:** volá a píše na 5 pracovísk (kardiológ, laboratórium, RTG, gastroenterológ, USG) a čaká na PDF, fotky alebo „výsledok na CD“. Niečo príde poštou, niečo e-mailom, niečo sa nájde v NIS, niečo nie.
3. **Objednáva:** CT v KOC 2 nie je voľné, objedná ho v KOC 1. Potom biopsiu (pozor, pacientka berie apixaban, treba ho vysadiť 48 h vopred), kontrolné odbery, onkológa, psychológa, algeziológa. Termíny má v hlave a v e-maile.
4. **Pred MDT:** prepisuje údaje do formátu podkladu (nacionále, lieky, alergie, laboratórne hodnoty, histológia). Skúma, či niečo nechýba. Niekto z lekárov na poslednú chvíľu: „A aký je ECOG?“
5. **MDT:** prípad dostane 2–4 minúty. Ak podklad nie je kompletný, rozhodnutie sa odloží (MDT štúdie: 6–24 % odložených, viď §3).
6. **Po MDT:** píše záver, posiela praktikovi, volá pacientke. Praktik sa neozve, či to prišlo. Koordinátorka nevie, či je slučka uzavretá.

### 2.3 Prečo dnešný stav zlyháva
- **Informácie sú v 7 pracoviskách a 13 dokumentoch rôznych foriem** (od úplných správ po samotné laboratórne tabuľky) a v nekompatibilných sieťach (eZpráva, MEDDOX, ePACS, ClinicBox, STAPRO MISE; z pre-hack dňa) [`02`]. Anekdota z pre-hack dňa: „stratilo sa preventívne CT na CD“.
- **Pacient si cestu často „nejako zariaďuje sám“** (Tichopád, ČVUT) a koordinátor je podľa neho často „nekvalifikovaný nelekár“, preto má mať systém proces v pozadí, ktorý ho vedie: úloha → **vlastník** → **lehota** → **potvrdenie prevzatia** (odoslaná žiadanka ≠ objednané ≠ vykonané vyšetrenie) → **výnimka a eskalácia** [`02`, pre-hack deň].
- **Formálna zodpovednosť je rozmazaná.** MDT je často „telefonát dvoch lekárov“ a má byť právny akt so zápisom; chýba tracking [Tichopád, `02`].
- **Čo ešte nie je vyriešené:** koordinačné aplikácie sa len **pilotne testujú v niektorých KOC**, spoločný prehľad kapacít sa pripravuje [MZ ČR, URL vyššie]. „Štandardný nástroj“ preto nie je, tento záver pochádza z `08` a z MZ, dodávateľov pilotov som nenašiel [?].
- **Ľudský faktor:** koordinačné úlohy robia aj lekári a sestry navyše k práci [MZ]; lekári trávia 49 % času pri počítači a papieroch a 27 % pri pacientovi (americká štúdia, nie onkológia) [V: Sinsky 2016, https://doi.org/10.7326/M16-0961].

---

## 3. Dôkazy o probléme

### 3.1 Čas do liečby (svet + ČR)
| Fakt | Číslo | Zdroj |
|---|---|---|
| Každé 4 týždne meškania liečby zvyšujú riziko úmrtia (pozorovacie dáta, nie RCT) | operácia +6–8 %, systémová liečba +1–28 % podľa typu rakoviny (34 štúdií, 1,27 mil. pacientov) | [V] Hanna, BMJ 2020, https://doi.org/10.1136/bmj.m4087 |
| Pľúca v ČR: liečba nezačne do 8 týždňov od CT | **viac ako 60 %** pacientov | [V] MZ ČR 2. 9. 2026 (URL v §2.1) |
| Cieľ pre „fast-track“ diagnózy (pľúca, pankreas) | čakanie ideálne **do 2 týždňov** | [V] MZ ČR, rovnaký zdroj |
| Podozrenie na nádor GIT | bežná cesta až ~2 mesiace; s koordinátorom „v rádoch týždňov“ (výrok koordinátora, nie štatistika) | [S] MZ ČR |
| Pankreas, štádium IV: liečení do 4 týždňov | len 13–17 %, 42–50 % po viac ako 8 týždňoch | [S][?] konferenčný slajd Tichopád, NZIP 12/2025 |
| ČR nesleduje čakacie doby systematicky; meria sa od prvého zobrazovacieho vyšetrenia | | [V] OECD ČR 2025, https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-cs-2025-1663-v2-en.pdf |
| Navigácia pacienta (koordinátor): po 90 dňoch vyššia šanca na vyriešenie diagnózy (aHR 1,51) a začiatok liečby (aHR 1,43); v prvých 90 dňoch bez efektu | | [S] PNRP, JNCI 2014, https://pmc.ncbi.nlm.nih.gov/articles/PMC4072900 |

### 3.2 Pankreas – prečo je to pre náš prípad ťažká diagnóza
Verejné dáta ÚZIS (Novotvary 2019–2021, kap. 3.11, s. 92) [V: https://www.uzis.cz/res/f/008447/novotvary2019-2021.pdf]:
- **2 393 nových prípadov v 2021** (7. najčastejší nádor), **2 343 úmrtí** (3. najčastejšia príčina úmrtia na rakovinu, 8,7 %); ČR je v Európe na **3. mieste v incidencii** a 2.–3. v úmrtnosti.
- **55 % prípadov** sa zachytí v pokročilom štádiu (III–IV).
- **5-ročné prežitie len 9,3 %** (všetci pacienti, diagnóza 2015–2019); u pacientov s vykázanou liečbou 12,6 %.
- Pri pankrease **poisťovňa platí liečbu až po MDT** a pokrytie MDT je v ČR ~60 % nových pacientov so solídnym nádorom (odporúča sa ~80 %) [V: OECD ČR 2025, URL vyššie]. Teda **zápis z MDT je pri pankrease aj platobný dokument**.

### 3.3 Chýbajúce a neúplné podklady na MDT
| Fakt | Číslo | Zdroj |
|---|---|---|
| Leeds, pankreatický MDT: podklady pri odoslaní neúplné | **65 %** pacientov; priemer 217 s na pacienta; 47 % času ide na diktovanie záveru | [S] https://www.pancreaticcancer.org.uk/wp-content/uploads/2020/10/Improving-MDT-function-Alastair-Young.pdf |
| UK, MDT pre rakovinu pľúc (2023): rozhodnutie odložené | ~**24 %** prípadov (väčšinou čakanie na výsledky); výkonnostný stav (ECOG) doložený len u ~**60 %** prípadov | [S][?] Cancer Medicine 2023 cez výsledok vyhľadávania, https://doaj.org/article/c92e172138c54d1b88d112fa0a14cf7a (stránku som nevedel otvoriť, 403) |
| Renálny MDT: odložených pre neúplné klinické informácie | **6,7 %** zo 1 500 prípadov | [S][?] https://journals.sagepub.com/doi/abs/10.1177/2051415819829309 (nevedel som otvoriť, 403) |
| Upper-GI MDT (2006): 15 % rozhodnutí sa neuskutočnilo, v ~20 % z nich sa rozhodnutie zmenilo po doplnení informácií | 41 z 273 | [S][?] https://pubmed.ncbi.nlm.nih.gov/16322114 (PubMed cookie stena) |
| MDT prípady: počet narástol o 23,5–38,8 % za 5 rokov (UK) | | [S] prehľad v `07` Z26 |

**Poznámka:** presne ten istý jav (chýbajúci ECOG) je v našom prípade zámerne alebo náhodne prítomný (§1.8, bod 1), čiže zadávatelia vedia, kde to v praxi škrípe.

### 3.4 Opakované vyšetrenia a strata dokumentov
- Keď cudzie snímky **neboli dostupné**, opakovalo sa **72 %** vyšetrení; ak boli na CD, ale nenahrané, 52 %; ak sa **nahrali do archívu snímok (PACS)**, len **11 %** (267 pacientov, UCSF, pred chemoembolizáciou pečene) [V: AJR 2012, https://doi.org/10.2214/ajr.11.6890].
- Opakované zobrazovanie je **hlavný dôvod vysokých kumulatívnych dávok** (register 5,6 mil. CT) [V: BJR 2026 podľa `07`, Z41]. Týka sa to Maťovej oblasti (radiačná ochrana).
- Náš prípad: CT urobili v inom KOC, než kde sa bude MDT diskutovať.

### 3.5 Čas koordinátorov a lekárov
- Ošetrovateľky-navigátorky v USA: **60 % času administratíva, 40 % práca s pacientom** [S][?] (infografika multicentrickej štúdie, https://www.jons-online.com/images/resources/navigation_tools/InfographicStudyFindings.pdf; videl som len výsledok vyhľadávania).
- Lekári: 27 % času pri pacientovi, 49 % pri počítači a papieroch [V] (Sinsky 2016, v §2.3).
- **Čo nemáme a treba získať od mentorov (Chrástová, Vaňková, Bielčiková) už dnes večer:** „Koľko minút trvá príprava jedného prípadu pre MDT? Koľko prípadov týždenne? Ako často MDT odložíte pre chýbajúci údaj?“ Jediné číslo z reality KOC by pitch zdvojnásobilo na sile. Zatiaľ je to [?].

### 3.6 Kolko to stojí
- **Peniaze v systéme:** VZP onkologická starostlivosť **23,68 mld. Kč v 2024**, ~332 800 klientov (≈71 tis. Kč na pacienta [náš výpočet]) [S: VZP 13. 5. 2025, https://www.vzp.cz/o-nas/aktuality/vzp-s-kolorektalnim-karcinomem-se-leci-temer-kazdy-desaty-onkologicky-pacient]. Koordinácia: 250 Kč za výkon, „nižšie desiatky miliónov Kč ročne“ (MZ), čo je pri 10–30 mil. Kč asi **40–120 tisíc výkonov ročne** [náš výpočet].
- Z toho **nevieme** spočítať, koľko stojí jedna strata informácie (zbytočné CT, odložené MDT, extra návšteva) ani koľko životov by sa zachránilo. Odporúčam v pitchi **nesľubovať ani životy, ani peniaze**, len merateľné veci z dema (§5.3) a citovať dôkazy o škode z meškania a neúplných podkladov.

---

## 4. Existujúce riešenia na trhu

### 4.1 Zahraničie
| Riešenie | Čo robí | Peniaze / cena | Poznámka |
|---|---|---|---|
| **Tennr** (USA) | AI na vstup odporúčaní (referral intake): z faxu vytiahne údaje o pacientovi, overí poistenie a pošle správnemu pracovníkovi; spracúva 10 mil. dokumentov mesačne | séria C 101 mil. USD (jún 2025), ocenenie 605 mil. USD; tvrdí >99,8 % presnosť (tvrdenie firmy) | [S] https://www.fiercehealthcare.com/health-tech/tennr-clinches-101m-build-out-ai-automates-patient-referral-workflows , https://www.ivp.com/content/tennr-a-cure-for-healthcare-paperwork/ . Dôkaz, že „AI vyťaží dokument a pošle ho ďalej“ je investičný trh. Nie onkologické MDT, nie čeština. |
| **Roche navify Tumor Board** | cloudový nástroj na prípravu, vedenie a zápis MDT; zbiera patológiu, zobrazenie, biomarkery a poznámky z EHR do jedného dashboardu | cena nie je verejná [?] | [V] https://www.roche.com/media/releases/med-cor-2017-10-03.htm ; stojí na integrácii zdrojov |
| **Equicare CS** | webový nástroj na koordináciu onkologickej starostlivosti (navigácia, distress, plán) | cena nie je verejná [?] | [S] agregátor intuitionlabs.ai |
| **Triomics** | AI štruktúrovanie onkologických záznamov a párovanie na štúdie | séria B 22 mil. USD (máj 2026); tvrdenia firmy: −67 % času na prehľad chorobopisu | [S] `07` Z31 |
| **Ambient scribe** (Abridge, Nabla, DAX, Epic natívne) | AI zápis návštevy; susedná oblasť (dokumentácia) | ~119–600 USD mesačne na lekára, 1 zdroj, nepotvrdené [?] | [S] `07` Z45; RCT: Nabla −9,5 % času písania [V] |
| **Microsoft Healthcare Agent Orchestrator** | agenty pre tumor board (rádiológia, patológia, staging, štúdie) | nezverejnené | [S] `07` Z48; v 2026 bez publikovaných výsledkov |
| Epic, Flatiron, Cota, OncoLens a podobní | koordinácia a MDT v USA | – | z vlastných znalostí, v tejto rešerši neoverené [?] |

### 4.2 ČR a SK
| Čo | Stav | Zdroj |
|---|---|---|
| Nemocničné IS (Asseco MedWorks, STAPRO, CGM ClinicBox, ICZ MEDDOX a ePACS, eZpráva) | spolu v zásade nekomunikujú; koordinátor ich používa „v plnom rozsahu“ | [S] `02`, `08`; MZ |
| Koordinačné aplikácie v KOC | pilotne v niektorých KOC; dodávateľov nepoznám [?] | [V] MZ ČR |
| Spoločný prehľad kapacít (hlavne zobrazovanie) | v príprave (NCEZ) | [V] MZ ČR |
| indiko.cz | meria čas do liečby a pokrytie MDT po centrách, od 1/2026 | [V] MZ ČR |
| eŽádanka, sdílený zdravotní záznam | pilotne od 1/2026, dobrovoľné; žiadne centrálne úložisko | `08` §5 |
| **OnkoAsist (NCZI, SK)** | systém na riadenie cesty od príznaku po liečbu; cieľ skrátiť z >160 na 60 dní; tender ~11 mil. € bez DPH; dnešný stav neznámy [?] | [S] https://www.teraz.sk/zdravie/k-liecbe-rakoviny-sa-ludia-dostanu-po/641984-clanok.html ; https://www.teraz.sk/slovensko/nczi-onkoasist-by-mohol-byt-lacnejsi/715535-clanok.html |
| Asseco (MDT Copilot) | zadávateľ výzvy MDT Copilot; v keynote spomína OnkoAsist | [S] `06` |

**Kto už platí:** za samotný „nástroj pre koordinátora“ v ČR zatiaľ nikto nesystematicky. Platí sa **koordinátor** (250 Kč/výkon z verejného poistenia), **MDT** (osobný výkon) a v SK sa rozbehol veľký tender (OnkoAsist).

### 4.3 Čo robia zle a kde je priestor
Tvrdím opatrne (nemám prístup k produktom, `[odhad]` podľa popisov):
1. **Referral-intake nástroje (typ Tennr)** sú postavené na faxe a poisťovacej logike v USA. Neriešia onkologické MDT, MKN-10, české správy ani zodpovednosť „kto je na ťahu“.
2. **Tumor-board balíky (typ navify)** predpokladajú integráciu zdrojových systémov. V ČR sú systémy roztrieštené a podklady prichádzajú ako PDF/Word z nezávislých ambulancií, takže „zber“ a „kontrola úplnosti“ zostáva na človeku.
3. **Nemocničné IS** majú dáta, ale nie je v nich koordinačný proces (úloha, vlastník, lehota, eskalácia, spätná väzba referujúcemu) a nie sú spojené medzi sebou.
4. **Pilotné aplikácie v KOC** (neznáme) sú podľa MZ stále pilotné.

**Priestor:** vrstva „NIT“ nad čímkoľvek: **vstup = to, čo koordinátor už dostáva** (e-mail s prílohami, Word, PDF, sken), **výstup = potvrdený handover, MDT zápis, plán krokov a uzavretá slučka**; štandard FHIR na rozhraní, takže sa dá neskôr napojiť na NIS (to, čo odporúčal Tichopád a Opatřil z pre-hack dňa). Lacnejšie a jednoduchšie, lebo nepotrebuje integráciu v deň 1; rýchlejšie, lebo koordinátor nič nepíše.

### 4.4 Ceny a kupec
- Referenčné hodnoty: ambient scribe ~119–600 USD/mes. na lekára [S][?], NHS rámec pre AI dokumentáciu 150 mil. £ [S] `07`, nemecký DiGA ~400 € na štvrťrok [S] `07`. Cena nástroja pre koordinátora nie je nikde zverejnená [?].
- **Náš scenár (nie fakt):** ak by sa cena viazala na 250 Kč za koordinovaný prípad a cena nástroja bola napríklad 10–20 % tejto platby, celý český trh by predstavoval ~1–7 mil. Kč ročne [náš výpočet: 40–120 tis. výkonov × 25–50 Kč]. **Teda český trh sám je malý.** Hodnota je v roli „referenčná implementácia pre program MZ a VZP“, SK (OnkoAsist) a v moduloch pre dodávateľov NIS.
- **VZP Inovačný portál** (overené na https://inovace.vzp.cz): onkologická tematická výzva pre digitálne technológie sa má otvoriť **v októbri 2026** (v rozhovore s Hlavinkom 1. 11. [S]), príjem trvá asi 3 mesiace; žiadať môžu výrobcovia, dodávatelia, výskumné a akademické inštitúcie alebo konzorciá, **poskytovatelia (nemocnice) zatiaľ nie**; plynulý vstup vyžaduje **priamu úsporu ≥ 5 % za rok** (analýza dopadu na rozpočet); **organizačné a procesné inovácie nie sú v prvej fáze výslovne zahrnuté, VZP ich môže pridať neskôr**. Preto je cesta cez portál pre nástroj koordinácie **neistá [?]**; reálnejšia je spolupráca s KOC a program MZ.

---

## 5. Najlepší návrh riešenia pre nás

### 5.1 Produkt: **NIT** (pracovný názov: „aby sa nit cesty pacienta nepretrhla“)
Zásady (zhodujú sa s tým, čo zadávatelia opakovane povedali): **nič nové na vypĺňanie · AI navrhne, človek potvrdí · každé číslo má zdroj · každá diera má vlastníka a termín.**

**Štyri obrazovky = štyri kroky zadania:**
1. **Prevziať.** Stránka pre praktika „Odoslať do KOC“: vyberie centrum, **pretiahne epikrízu a správy** (alebo preposiela e-mail), údaje sa doplnia z dokumentu, klikne „Odoslať“. Koordinátor má v schránke nový prípad na jednej karte. Bez formulára.
2. **Vyťažiť.** Vľavo časová os 13 dokumentov (pracovisko, dátum). Vpravo handover podľa `Handover_obsah`. **Každá hodnota má odkaz na zdroj** (klik zobrazí dokument s označeným úryvkom). Tri stavy: vytiahnuté (zdroj), chýba (nikde v dokumentoch), rozpor (obe hodnoty vedľa seba). Ukazovateľ úplnosti („18 z 20“). Tlačidlo „Vyžiadať“ pripraví správu správnemu adresátovi. Praktik alebo koordinátor stlačí „Potvrdiť“.
3. **Koordinovať.** Fronta (nový / aktívny / odložený) + detail pacientky: **plán pre karcinóm pankreasu** (CT → EUS-FNB → odbery → histológia → MDT 21. 10. → onkologické konzílium 4. 11. 10:30) s poradím, vlastníkom („na ťahu“), termínom, miestom, stavom a eskaláciou, keď sa termín minie. **Hodiny času do liečby** (T1/T2/T3). Notifikácie (e-mail/SMS simulované).
4. **Spätná väzba.** **Zápis na MDT podľa `MDT_zapis`**, automaticky, **len z údajov k 21. 10.** (správy 12 a 13 sú viditeľne vyradené s vysvetlením „vznikli po MDT“). Po MDT koordinátor vloží záver (alebo nahrá `MDT zaver`); aplikácia z neho vyrobí **úlohy** (6 odporúčaní → 6 úloh s vlastníkom a dátumom) a **pošle praktikovi** (e-mail s PDF + pôvodný kontext). **Dôkaz doručenia**: čas doručenia a otvorenia, prípad sa uzavrie so stavom „slučka uzavretá“.

**Technický návrh pre Claude Code (jednoduchý, spoľahlivý):**
- Web aplikácia (React alebo čisté HTML + Python FastAPI), dáta v JSON/SQLite, **žiadny reálny údaj pacienta**.
- **Extrakcia = AI so štruktúrovanou schémou.** Každé pole vracia `hodnota + dokument + doslovný citát`. **Aplikácia overí, že citát naozaj stojí v dokumente**; ak nie, hodnota sa zahodí (toto je poistka proti vymysleným údajom, presne požiadavke „bez domýšľania“).
- **Pravidlá bez AI** (spoľahlivé a vysvetliteľné): dátum po MDT sa nepoužije; dátum po dátume vydania; „posledná dávka po výkone“; povinné polia z `Handover_obsah`; čo je chýbajúce vs. rozporné.
- **Výstup:** MDT zápis (DOCX/PDF), JSON handover, a **FHIR R4 bundle** (Patient, Condition C25.0, Observation, DiagnosticReport, DocumentReference, Task, Communication, Provenance). Voliteľne uložiť do **InterSystems IRIS for Health** (Docker Community) a vo formulári odpovedať „FHIR od InterSystems: áno“ (cena 1 500 € sa dá kombinovať). Je to **rozšírenie, nie jadro**.
- **E-mail:** poslať skutočne len na vlastnú testovaciu adresu tímu cez transaktný e-mail; praktik je v dema fiktívny. Nič reálnym lekárom ani pacientom.
- **LLM:** API od organizátorov (OpenAI-kompatibilné, zdieľané limity, treba retry s čakaním). Pozor: prístupy sa oneskorovali (do 15:44 ich 3 pražské tímy ešte nemali) [05 §5]; ak nepríde, náhradný vlastný kľúč, údaje sú fiktívne. **Kľúče nikdy do repa.**
- **Druhý prípad (rozšírenie):** pripraviť 1 ďalšiu fiktívnu pacientku (napr. pľúca C34) a druhú „sadu úloh“, aby sa pri otázke poroty „a keď príde iná správa?“ dalo ukázať, že to nie je ušité na jeden prípad. Podľa zadania sú „sady úloh podľa diagnózy“ priamo súčasť kroku 03.

### 5.2 Čo ukážeme v 3-minútovom pitchi (a videu 60–75 s)
Šablóna vychádza z `09` §4.5. Kľúčové je **ukázať skutočnú obrazovku jedného celého priechodu**.

| Čas | Obsah |
|---|---|
| 0:00–0:20 | **Hák:** „Alena, 63 rokov. **13 dokumentov zo 7 pracovísk, 50 dní** od prvej návštevy u praktika po MDT; **31 z nich**, kým sa prípad vôbec dostal ku koordinátorovi.“ (naše výpočty z dátumov fiktívnych správ, §5.4). A číslo z reality: „**Viac ako 60 % pacientov s rakovinou pľúc nezačne liečbu do 8 týždňov od CT**“ (MZ ČR). |
| 0:20–0:40 | Kto to potrebuje a komu to patrí: koordinátor v KOC, od januára 2026 v každom z 15 centier; „ďalším krokom je nástroj“ (zadanie VZP). |
| 0:40–1:50 | **Video:** (1) pretiahnuť 13 správ, handover sa zloží za pár sekúnd; (2) klik na hodnotu otvorí zdroj; (3) **ECOG chýba, apixaban dátum je nemožný, histológia má rozpor**; (4) plán a „kto je na ťahu“; (5) MDT zápis len z údajov k 21. 10. (správy po MDT zašednuté); (6) „Odoslať praktikovi“, **doručené, otvorené**, slučka uzavretá. |
| 1:50–2:15 | Ako to funguje: AI navrhne, človek potvrdí; každé pole s citátom, overeným strojovo; nestanovuje diagnózu ani liečbu; fiktívne dáta; výstup FHIR. |
| 2:15–2:40 | **Pilot na jednom riadku:** 1 KOC (klinický partner VFN alebo FNMH), 3 mesiace, 50–100 nových prípadov. KPI: medián času od žiadosti po kompletný handover, počet chýbajúcich údajov nájdených pred MDT, počet MDT odložení pre neúplné podklady, minúty koordinátora na prípad; pravidlá stop/go (šablóna VZP). Škálovanie: ďalšie diagnózy, ďalšie KOC, SK. |
| 2:40–3:00 | Tím a žiadosť: „60 minút s generálnym riaditeľom“ / pilotné centrum. |

**Čísla, ktoré môžeme citovať z našej práce (odmerať v demo, nie sľúbiť):** koľko z 20 polí sa vyťažilo s overeným citátom; koľko chýbajúcich a rozporných údajov sa odhalilo (cieľ: ECOG, e-mail, 3 rozpory, post-MDT vyradenie); kontrola voči vzorovému `MDT zaver` (zhoda polí); „0 vymyslených hodnôt“ (kontrola citátov); čas od vloženia po hotový podklad.

### 5.3 Čo nás odlíši od ďalších tímov (budú aspoň 2 podobné)
1. **Overené citácie a „bez domýšľania“** (zadanie to výslovne žiada; mnohí to sľúbia, málokto vynúti kódom).
2. **Chytanie pascí z §1.8** (porotcovia sú autori zadania; zbadajú to).
3. **„Stav k 21. 10.“:** posuvník času, ktorý ukazuje, čo MDT v ten deň vedelo.
4. **Uzavretá slučka s dôkazom doručenia** a **plán s vlastníkom a eskaláciou**, nie len extrakcia.
5. **FHIR + IRIS** (cena InterSystems, škálovateľnosť v nedeľu).
6. **Druhá diagnóza / druhý prípad** a **video na úrovni Brunovho štúdia**.

### 5.4 Poznámka k číslam z prípadu (naše výpočty z fiktívnych správ)
- Prvý kontakt u praktika **1. 9.** · odoslanie do KOC 2 **2. 10.** (**31 dní**) · CT 8. 10. · EUS-FNB 12. 10. · histológia **19. 10.** (48 dní od prvého kontaktu) · MDT **21. 10.** (**50 dní**; z toho 31 pred KOC a 19 v KOC) · onkologické konzílium **4. 11.** (**64 dní**).
- Pre porovnanie: cieľ ministerstva pre pankreas je čakanie na diagnostiku do 2 týždňov [MZ ČR]; vzorový prípad v decku (iný, VFN) mal od príznaku po operáciu 21 dní.
- **Poctivo:** software nevytvorí voľný termín na CT. Rieši **zbytočné prestoje a stratené informácie medzi krokmi**, nie kapacity. Kapacity rieši pripravovaný zdieľaný prehľad (NCEZ) a dá sa naň neskôr napojiť. V pitchi to povedať takto.

### 5.5 Kde zapadne Maťo a Bruno
- **Bruno:** príbeh Aleny, hák, 60–75 s video s reálnou obrazovkou, titulný obrázok 16:9, kvalita prezentácie a tímu (nedeľné kritérium 5).
- **Maťo (ÚRO):** riadok „**Snímky**“ v handoveri: CT je z iného centra, aplikácia pri kroku „CT hotové“ pripomenie overiť dostupnosť **snímok** (nie len správy) pre MDT radiológa, a tým pomáha nezopakovať zbytočné CT (dôkaz: opakovanie 72 % vs. 11 %, §3.4). Rozšírenie: zobraziť „kto už koľko CT mal“ v prípade, keď je k dispozícii dávková história. V dátach nie je [?], preto len ako nápad na budúcu fázu. Maťo môže tiež v pitchi hovoriť o regulácii a bezpečnosti (kritérium 2).

### 5.6 Plán noci (hrubý, na Claude Code; Maťo a Bruno kontrolujú výsledok)
- 19:00–21:00 prieskum a kostra: ZIP, parsovanie `.docx`, schéma polí, e-mailový test, repo.
- 21:00–01:00 extrakcia + overenie citátov + pravidlá (§1.8) + test na všetkých 13 správach a porovnanie so `MDT zaver`.
- 01:00–05:00 4 obrazovky, plán s eskaláciou, MDT zápis (DOCX/PDF), odoslanie a dôkaz doručenia.
- 05:00–08:00 FHIR bundle (+ IRIS ako rozšírenie), druhý prípad, opravy, záložné nahrávky obrazovky.
- 08:00–11:30 video, titulný obrázok 16:9, text odovzdania (140 znakov + popis AI a dopadu), nahranie na GitHub.
- 11:30–12:45 buffer a odovzdanie na `submit.rakathon.cz` **pred 13:00** (po 13:00 formulár nič neprijme).

### 5.7 „Šialený“ ambiciózny variant: **NIT Agent** (koordinátor, ktorý nespí)
Rovnaký produkt, ale z asistenta sa stane **autonómny agent**, ktorý nielen pripraví podklady, ale **sám dohľadáva, žiada a stráži**:
1. **Číta schránku koordinácie** (e-maily, PDF, sken, fotka CD obalu) a **sám založí prípad a priradí dokumenty**.
2. **Hlasový agent** (napr. ElevenLabs) sám **zavolá na sekretariát KOC 1 a vyžiada snímky a chýbajúcu správu**; prepis hovoru sa vráti ako úloha. V demo iba **nahraná simulácia s fiktívnymi číslami, nikdy skutočný hovor**.
3. **Radar prestojov:** pravidlo „úloha → vlastník → lehota → potvrdenie → eskalácia“ (Tichopád); agent 3 dni vopred upozorní, že prípad nestihne 2-týždňový cieľ pre fast-track a **eskaluje**.
4. **Digitálne dvojča cesty:** časová os (posuvník) celej cesty od 20. 7. po 27. 10., čo kto vedel v ktorom okamihu, **kde sa strácal čas** (31 dní pred KOC vs. 19 v KOC). Anonymne po stovkách prípadov by to bola **mapa prestojov** pre KOC a pre VZP (jeho indikátory kvality).
5. **Stránka „Moja cesta“ pre pacientku a dcéru** v jednoduchom jazyku (so súhlasom, ktorý je v správe 07).
6. **Dve inštancie FHIR (KOC 2 → KOC 1)**: ukázať, že prípad sa presúva medzi centrami bez straty informácií (škálovateľnosť, kritérium 4).

Odporúčanie: začať jadrom (§5.1); šialené kúsky pridať len ak je jadro hotové do ~03:00. Rizikové je hlas (nesmie to pôsobiť ako reálne volanie) a prílišná šírka na úkor spoľahlivosti jadra.

---

## 6. Konkurencia na hackathone

### 6.1 Stav (živá tabuľa `submit.rakathon.cz/vyzvy`, načítaná ~16:25; uzávierka výberu dnes 19:00)
| Mesto | Tímy na tejto výzve |
|---|---|
| **Praha** | **2: MediBit, smetytech.** |
| Brno | 1: Správci Silnic |
| Ostrava | 0 |

- Pražských tímov je 23 s výzvou a 5 bez výzvy: Ctrl+Alt+CURE, **FIT/S**, FSMZ, Pražský Meridian, walking legs. Ďalších ~7 tímov z organizátorskej listiny (Data Team, Junior Scholars, Nexlytics, Panacea, quattro formaggi, radiQA, Risk off) ešte nie je na tabuli (`05` §3.1).
- **Signály záujmu:** tím **FIT/S** (členovia v kanáli) sa podľa `05` zaujíma o túto výzvu a o SMART ONCO AA. Do kanála sa pridali aj ľudia z tímov „walking legs“, „404: tumor not found“ (už majú PACS), MediBit, RationAI (Brno), Elektra, OncoMedViz, Holub (Ostrava) a **Super Team MEMOyA** (Ostrava).
- **MEMOyA** má podľa `04` §7 už bežiaci základ „AI prečíta spis, nájde chýbajúce a rozporné údaje, každé číslo s doslovnou citáciou“ a cieli aj na InterSystems cenu. Teraz **nie je na tabuli tejto výzvy** (v Ostrave je 0 tímov); je to hrozba len ak sa registrujú a ak VZP víťaza určuje celoštátne [?].

### 6.2 Odhad
**Dnes 2 tímy v Prahe; do 19:00 pravdepodobne 3–5** [odhad], lebo je to najpresnejšie zadanie (podobne ako mamograf 3 a Trial Matching 4). Sila známych tímov je mi neznáma [?]. Typický konkurent postaví „nahraj správy, AI vyťaží, tabuľka“; rozhodovať bude **kvalita (citácie, pasce, slučka), spoľahlivé demo a príbeh**.

### 6.3 Môže pražský tím túto výzvu zvoliť?
**Áno.** Je to jedna z 3 VZP výziev, ktoré sú v zozname **každého mesta** (pre Prahu je to 12 volieb: 3 VZP + 9 pražských), a v Prahe ju už majú 2 tímy (tabuľa). Nejasnosť: či víťaza VZP výzvy určujú mestá osobitne alebo celoštátne **[?]**. Cena VZP „Křeslo pro inovace“ (60 minút s generálnym riaditeľom) ide **najlepšiemu tímu zo všetkých VZP výziev**, čiže budeme porovnávaní aj s víťazmi mamografu a konca života (koniec života: 0 tímov).

---

## 7. Skóre (1–10; 5 = priemer medzi výzvami; 9–10 výnimočne)

| Kritérium | Váha | Skóre | Zdôvodnenie |
|---|---|---|---|
| velkost | 1,0 | **7** | Dotkne sa všetkých pacientov, ktorí idú cez KOC: ČR má ~58–61 tis. nových rakovín ročne [OECD/ÚZIS], pri 250 Kč/výkon vychádza 40–120 tis. koordinovaných prípadov ročne [náš výpočet]. Menej než skríning (stovky tisíc), viac než väčšina úzkych výziev. |
| zdravie | 1,5 | **6** | Meškanie liečby škodí (+6–8 % rizika úmrtia na 4 týždne [Hanna]) a pankreas má 9 % prežitie, ale náš nástroj rieši **informačné prestoje, nie kapacity**; účinok softvéru na prežitie nie je nikde meraný, dôkaz je len pre koordináciu (aHR ~1,4–1,5). |
| cas | 1,0 | **7** | Priamy cieľ je ušetriť čas koordinátora a MDT (admin 60 % [S][?], 2–4 min na prípad [S]); skutočná úspora v minútach nie je známa [?], číslo od mentorov by to zvýšilo na 8. |
| peniaze | 1,2 | **5** | Úspory sú pravdepodobné (opakované vyšetrenia 72 % vs. 11 %, odložené MDT), ale nekvantifikované; priamy zisk je malý (český trh ~1–7 mil. Kč ročne pri našom scenári [náš výpočet]); filter VZP ≥ 5 % priamej úspory sa ťažko preukazuje. |
| bottleneck | 1,5 | **8** | Role koordinátora je od 1/2026 zákonom platená, štandardný nástroj chýba (len pilotné aplikácie), VZP aj MZ zadanie takto formulujú; expert z pre-hack dňa to označil za najväčší zmätok. Nie 9, lebo pilotné aplikácie existujú a kapacity (nie informácie) sú časť problému. |
| platba | 1,2 | **6** | Kupec je jasný (KOC z platby za koordináciu; VZP cez portál), existujú peniaze, a MDT je pri pankrease podmienkou úhrady. No VZP portál zatiaľ procesné nástroje jasne nepripúšťa [V], nemocnice nemôžu žiadať priamo a verejné obstarávanie je pomalé. |
| jednoduchost | 1,0 | **8** | Zadanie samo žiada „bez ďalšieho veľkého formulára“; koordinátor nič nepíše, len potvrdzuje; jedna obrazovka na krok. Riziko: viacero rolí (praktik, koordinátor, MDT, pacient). |
| data | 1,0 | **8** | Presne pripravený balík: pacientka, 13 správ, šablóny vstupu aj výstupu, vzorový záver, fiktívne (žiadny GDPR problém). Mínus: len 1 pacientka a žiadna oficiálna „pravdivá“ extrakcia okrem vzorového záveru. |
| realizovatelnost | 1,0 | **9** | ~2 900 slov, známy vstup aj výstup, 4 obrazovky, jasné kritériá „Hotovo, keď“; extrakcia aj pravidlá sú dobre zvládnuteľné pre Claude Code. Zvyšné riziko je polish a LLM limity, nie technika. |
| wow | 1,2 | **7** | Silný ľudský príbeh a „zachytené pasce“, plus pekné video; ale „AI vyťaží dokument“ budú ukazovať viacerí a efekt je skôr „prakticky užitočné“ než „vau“. Zvýši to časový posuvník, doručenie s dôkazom a Brunovo video. |
| partner | 1,2 | **9** | VZP je podľa `09` partner 10/10 (platca s verejným kanálom na úhrady, v nedeľnej porote Hlavinka + MZ, cena „Křeslo pro inovace“), ku tomu autori z ministerstva a nemocníc (VFN, FNMH). Výzva spája štyri rozhodovacie kruhy. |
| konkurencia | 1,0 | **6** | Dnes 2 pražské tímy (1 Brno, 0 Ostrava), reálne 3–5 do 19:00; konkurenti stavajú podobnú vec; MEMOyA je silný, ale zatiaľ nie je zapísaný; neistota o víťazovi VZP po mestách. Dobrá šanca pri kvalitnom prevedení. |
| pokracovanie | 0,8 | **6** | Cesta existuje (pilot v 1 KOC, VZP Inovačný portál, program MZ, SK OnkoAsist), no treba právnickú osobu, klinického partnera, napojenie na NIS a zvládnuť 8 „hard gates“ VZP; procesné nástroje v portáli [?]. |
| fit | 0,8 | **6** | Bruno (príbeh, video, prezentácia) sa uplatní naplno; Maťo (radiačná ochrana, zobrazovanie) len okrajovo (snímky, opakované CT). Žiadny kliniker v tíme, ale 6 mentorov je na mieste. |
| riziko | 0,6 | **6** | Nástroj nediagnostikuje ani neodporúča liečbu, AI navrhuje a človek potvrdzuje, dáta sú fiktívne. Po hackathone ostáva otázka MDR (zdravotnícky prostriedok?), GDPR a zodpovednosti [z vlastných znalostí, neoverené, ?]. |

**Vážený priemer = 111,6 / 16,0 = 6,98 (≈ 7,0).**

---

## 8. Čo som nevedel overiť a odkazy

- **MDT štúdie (lung 2023, renal, upper-GI 2006)**: čísla z výsledkov vyhľadávania, stránky sa nepodarilo otvoriť (403, cookie stena). Pred použitím v pitchi **overiť**.
- **Navigátorky 60 % admin**: iba infografika vo výsledku vyhľadávania.
- **KOC majú 65 % onkologických pacientov** (`05` §1.3 podľa Drive decku): v mojej zip-verzii decku som toto číslo nenašiel (slide 2 je grafický) [?].
- **Marián Rybář = MZ ČR**: iba `09`, nepotvrdené.
- **Dátum onkologickej výzvy VZP**: portál hovorí „október 2026“, rozhovor 1. 11. **Overiť** na https://inovace.vzp.cz .
- **Ceny konkurencie**: nie sú verejné; čísla v §4 sú orientačné.
- **MDR / AI Act klasifikácia nástroja**: nevyhľadané (limit vyhľadávaní); treba prečítať MDCG 2019-11 a Metodiku riadeného vstupu VZP v. 1.0 [?].
- **Rozpočet web vyhľadávania sa vyčerpal**; ďalšie vyhľadávanie (napr. český trh koordinačných aplikácií, dodávatelia pilotov) treba ďalšou požiadavkou.

**Hlavné zdroje:**
- Slack `#cesta-pacienta-bez-ztraty-informaci`: https://rakathon2026.slack.com/archives/C0C84GD9JAG/p1792152304485149
- Živá tabuľa tímov: https://submit.rakathon.cz/vyzvy
- MZ ČR (koordinátori, 2. 9. 2026): https://mzd.gov.cz/tiskove-centrum-mz/jeden-kontakt-mene-cekani-rychlejsi-cesta-k-lecbe-koordinatori-meni-peci-o-onkologicke-pacienty/
- VZP Inovačný portál: https://inovace.vzp.cz ; rozhovor s Hlavinkom: https://www.vzp.cz/o-nas/aktuality/hlavinka-digitalni-technologie-uz-pouzivame-je-na-case-naucit-se-hodnotit-jejich-prinos
- VZP o Rakathone: https://www.vzp.cz/o-nas/aktuality/vzp-se-stava-hlavnim-partnerem-rakathonu-soutezicim-otevre-tri-realne-vyzvy-ceskeho-zdravotnictvi
- ÚZIS Novotvary 2019–2021: https://www.uzis.cz/res/f/008447/novotvary2019-2021.pdf
- OECD/EK Česko 2025: https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-cs-2025-1663-v2-en.pdf
- Hanna, BMJ 2020: https://doi.org/10.1136/bmj.m4087 · AJR 2012: https://doi.org/10.2214/ajr.11.6890 · Sinsky 2016: https://doi.org/10.7326/M16-0961
- Tennr: https://www.fiercehealthcare.com/health-tech/tennr-clinches-101m-build-out-ai-automates-patient-referral-workflows · Roche navify: https://www.roche.com/media/releases/med-cor-2017-10-03.htm
- OnkoAsist (SK): https://www.teraz.sk/zdravie/k-liecbe-rakoviny-sa-ludia-dostanu-po/641984-clanok.html
- Interné: `docs/research/02, 04, 05, 06, 07, 08, 09`, `docs/materials/drive/cesta-pacienta-data/`
