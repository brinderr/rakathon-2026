# VZP – Od pozvánky k mamografu (všetky mestá): hĺbková analýza výzvy

_Stav: piatok 16. 10. 2026, popoludnie (posledná správa v kanáli výzvy je z 15:34). Písané pre Bruna a Maťa (nie sú technici); odborné pojmy sú vysvetlené v zátvorke._
_Značky: **[Slack]** zo Slacku, **[deck]** z podkladu výzvy (PDF od VZP), **[web]** overené na webe, **[prepočet]** môj výpočet z uvedených čísel, **[odhad]** môj záver, nie fakt, **[?]** neisté alebo som to nevedel overiť._
_Pravidlá: nič sa neposielalo ani necommitovalo, Slack len čítaný, žiadne kontakty osôb._

---

## 0. Zhrnutie na jednu stránku

- **Čo výzva chce:** VZP posiela ženám 45–69 rokov, ktoré nechodia na mamografický skríning (preventívne röntgenové vyšetrenie prsníkov u zdravých žien), **rovnaký list**. Odozva je dlhodobo okolo **každej piatej** (2014: 19,5 %; 2024: 18,9 %) a pri ženách, ktoré dostali list opakovane aj po 11. pozvaní, len **3,2 %**. Úloha: **KDO** nepríde, **PREČO**, **ČO** im ponúknuť a **AKO OVERIŤ**, že to zabralo.
- **Dáta máme:** anonymizovaný dataset VZP (**viac ako 1,3 mil. záznamov**) + dátový slovník, už na portáli `aka.ms/rakathon2026`. Slabé miesta: prístup do Azure sa oneskoruje, nie je jasné, či dáta obsahujú históriu predošlých pozvánok/SMS, spoločná testovacia sada nebola potvrdená.
- **Môže ju zvoliť pražský tím? Áno.** Je to jedna z troch VZP výziev, ktoré sú v zozname **každého** mesta (pražský zoznam = 9 pražských + 3 VZP = 12). **Víťaz za mesto ide do nedeľného finále** (organizátor T. Studeník: „vítězové výzev včetně VZP ze všech měst“, #02-dotazy, 15. 10. 15:42). VZP navyše dáva špeciálnu cenu „Křeslo pro inovace“ (60 minút s generálnym riaditeľom VZP) najlepšiemu tímu zo všetkých VZP výziev.
- **Konkurencia:** v Prahe teraz **3 tímy** (Titics, mammo_prg, Čímžtopádem Vyléčeno), vo všetkých mestách spolu 4. Jeden z tímov (mammo_prg) je technicky zameraný (strojové učenie, CatBoost). Mamograf je po AI Trial Matching (4) **druhá najobsadenejšia** pražská výzva.
- **Môj odhad:** problém je veľký, dáta sú najbohatšie zo všetkých výziev, partner (VZP) je najsilnejší na akcii a demo sa dá zvládnuť za noc. Slabšie sú konkurencia a „wow“ (je to analytika, nie čarovné demo). **Vážený priemer skóre 6,45 / 10** (detail v §7).
- **Čo by sme postavili:** „Mamo Kompas“ – jednoduchá web aplikácia pre pracovníčku prevencie VZP: skóre rizika neúčasti → pár pomenovaných skupín žien → pre každú skupinu konkrétna ponuka (kanál, text, načasovanie) → hotový plán **A/B experimentu** (náhodné rozdelenie, počet žien, pravidlá „pokračovať/zastaviť“) → odhad, o koľko žien navyše to môže zvýšiť účasť. Model samotný je dnes bežná vec (všetky tímy ho budú mať); **vyhráva rozhodovacia a overovacia vrstva a príbeh** (§5).

---

## 1. Presné zadanie

### 1.1 Zdroje, ktoré som prešiel
- Slack kanál `#od-pozvanky-k-mamografu` (ID C0C7VGSF98V): **všetky správy aj vlákna** od 9. 10. do 16. 10. 15:34 (čítané celé). Zadanie samotné je v súbore `Rakathon.pdf` od mentorky H. Damovskej (16. 10. 11:13), uložený v `docs/materials/slack/od-pozvanky-k-mamografu/Rakathon_VZP_mamograf.pdf` (prečítaný celý, 12 strán).
- Vlákna mimo kanála, ktoré sa výzvy týkajú: #02-dotazy (postup víťazov do finále, min. 2 ľudia, obaja fyzicky na mieste), #07-hledam-mentora (VZP technický mentor, mentor s pohľadom poisťovne), formulár výberu výzvy a tabuľa tímov (`submit.rakathon.cz/vyzvy`, podľa `05-slack-refresh.md`).
- Súhrny v repe: `04`, `05` (§1.2, §2, §3), `06` (§2.1), `07` (B2), `08` (§3, §8, §9), `09` (§3.1, §4.5).

### 1.2 Kto zadáva a kto pomáha
- **Zadávateľ:** Všeobecná zdravotní pojišťovna ČR (VZP). Podklad spracoval **Ing. Antonín Hlavinka** (VZP; podľa `09` vedie úsek zdravotnej politiky a inovácií a je členom nedeľnej poroty) **[deck + web]**.
- **Garantka výzvy a mentorka v Prahe:** **Helena Damovská** (VZP). Spolu s technickým mentorom **Janom Bartyzalom** (cloud a dáta za VZP) sú v Prahe „v prízemí za výťahom“ **[Slack, 14:33]**. Bartyzal tiež píše, že vie odpovedať, či je navrhnutá technológia alebo postup použiteľný v zdravotníctve **[Slack #07, 12:12]**.
- **Mentorky v ďalších mestách:** Vendula Frodlová (Brno), Květoslava Smolková (Ostrava) **[Slack #02-dotazy, 12:38]**.
- **Mentor s pohľadom poisťovne:** MUDr. Albert Štěrba (neurochirurg, člen dozornej rady VZP) sa ponúkol overiť, či nápad rieši skutočný problém a čo ho čaká na ceste k úhrade zo zdravotného poistenia **[Slack #07, 13:27]**. Pre „niekto by za to zaplatil“ je to užitočná osoba.
- **Radiológ na konzultáciu:** M. Standara (MOÚ Brno) ponúkol konzultáciu k zobrazovacím metódam vrátane mamografu, ale **len pre brnianske tímy** (v Brne) **[Slack #07, 10:56]**.

### 1.3 Otázka výzvy
> Ktoré adresne oslovené klientky VZP majú najvyššie riziko, že skríning neabsolvujú, komu ponúknuť intenzívnejšiu podporu a ako jej skutočný efekt následne overiť? **[deck, slide 5]**

**Dôležité vymedzenie [deck, slide 3]:** neriešia sa „no-show“ (nedostavenie sa na už objednaný termín). Rieši sa, či **adresne oslovená žena absolvuje skríning v stanovenom období po oslovení**.

### 1.4 Štyri úlohy [deck, slide 6]
1. **KDO** – predikcia rizika neúčasti (ktoré ženy majú najvyššiu pravdepodobnosť, že neprídu).
2. **PREČO** – faktory, ktoré súvisia s neúčasťou, a zrozumiteľné skupiny (segmenty), ktoré z nich vznikajú.
3. **ČO** – návrh konkrétnej podpory pre jednotlivé skupiny.
4. **AKO OVERIŤ** – návrh experimentu (A/B test = dve skupiny žien, jednej sa pošle nová ponuka, druhej stará; porovná sa, kto prišiel), ktorý ukáže, či zásah skutočne zvýšil účasť.

Zadanie výslovne hovorí: „Cieľom nie je len predpovedať, kto nepríde, ale navrhnúť, čo s tým robiť a ako overiť, že to funguje.“ **[deck, slide 9]**

### 1.5 Čísla, ktoré VZP dáva do zadania (rok 2024) [deck, slide 4]
| Údaj | Hodnota |
|---|---|
| Pozvánky na mamografický skríning | **292 176** |
| Účasť u žien oslovených prvýkrát | **44,5 %** (cca 55 tis. žien) |
| Celková účasť po adresnom pozvaní | **18,9 %** |
| Účasť u žien oslovených opakovane po mnoho rokov (aj po 11. pozvaní) | **3,2 %** (cca 59 tis. žien) |

Počty žien (55 tis., 59 tis.) som prevzal z `06` (slide 4 pôvodného decku). V PDF zo Slacku sú len percentá.

Môj prepočet (zaokrúhlené čísla, predpoklad, že skupiny sa neprekrývajú): z 292 176 žien je cca 55 tis. nových, 59 tis. „tvrdé jadro“ a cca 178 tis. žien uprostred, ktorých odozva vychádza na **~16 %** **[prepočet]**.

### 1.6 Hypotézy skupín, ktoré dáva VZP (výslovne „nie hotové“) [deck, slide 8]
| Skupina | Navrhovaná podpora |
|---|---|
| Pravidelná preventistka, teraz v omeškaní | jednoduché pripomenutie + konkrétny krok objednania |
| Nízky kontakt so zdravotníctvom | viackanálové oslovenie + informácia, že skríning je dôležitý aj bez príznakov |
| V starostlivosti, ale bez prevencie | zapojenie praktika alebo gynekológa |
| Opakovane nereagujúce | iný kanál / telefonická navigácia / pomoc s objednaním |
| Regionálna bariéra | navigácia na dostupné pracoviská |

### 1.7 Čo majú odovzdať [deck, slide 9]
- model / skóre rizika neúčasti,
- hlavné faktory súvisiace s neúčasťou,
- niekoľko zrozumiteľných a prakticky využiteľných skupín žien,
- návrh konkrétnych intervencií pre vybrané skupiny,
- návrh experimentu / A/B testu na overenie skutočného efektu.

Dopad podľa zadania: lepšie cielenie komunikácie, efektívnejšie využitie zdrojov, vyššia účasť, merateľný efekt **[deck, slide 10]**.

### 1.8 Dáta
- **Čo je potvrdené:** dataset VZP pre výzvu (**viac ako 1,3 mil. záznamov**), popis dát a dátový slovník, kompletné zadanie a metodické podklady **[deck, slide 11]**. Dáta sú **na portáli účastníka `aka.ms/rakathon2026`**, kde sú sťahovateľné tímovým účtom **[Slack 14:33; `03` §2.1]**. Dáta VZP sú len pre VZP výzvy **[`04` §3, slidy MSFT]**.
- **Spresnenie z 15:34 [Slack]:** hacker si všimol, že popis poľa „referenčný čas“ odkazuje na neexistujúcu „Prílohu B“. Mentorka H. Damovská odpovedala: Príloha B bola len pomocná príloha pri tvorbe výzvy a omylom ostala v popise dát; **prediktory (vstupné premenné) sú v bode 7: B3 História skríningu a B4 Preventívne správanie.** Referenčný čas pre všetky prediktory aj výsledky = `invitation_date` (dátum pozvánky) **[Slack 15:27 a 15:34]**. Prakticky: do modelu patria len informácie známe **pred** dátumom pozvánky, inak by model „podvádzal“ (úniku informácií sa hovorí leakage).
- **Čo nevieme [?]:** (a) či dataset obsahuje **históriu predošlých pozvánok alebo SMS** (otázka z 14:27, bez odpovede); (b) či bude **spoločná testovacia sada** na porovnanie tímov (otázka z 11:07: vo vlákne diskutovali len hackeri, odpoveď organizátora nie je; jeden hacker argumentoval, že testovacia sada má vyjsť až po dokončení modelov); (c) presné stĺpce a ich význam (dataset sme zatiaľ nevideli).
- **Technický stav:** viaceré pražské tímy (vrátane mammo_prg) o 15:44 stále nemali prístup do Azure po vyplnení formulára kapitánom **[Slack, vlákno k prístupom do Azure, 15:01–15:44; cez `05` §5]**. Prístupy sa dostanú na tlačenej kartičke pre kapitána (účet tímu + dočasné heslo) alebo e-mailom po vyplnení formulára.
- **Vstup do modelov (LLM):** Microsoft poskytuje v portáli kľúč k jazykovým modelom (OpenAI, xAI, DeepSeek, Microsoft). Na kódovanie je určený GitHub Copilot (100 USD kredit na osobu) **[`03` §2.3]**.

### 1.9 Kritériá a ceny
- **Špecifické váhy pre túto výzvu nie sú.** Platia všeobecné kritériá. **Sobota (lokálne, hodnotí zadávateľ pri obchôdzke tímov 14:00–16:00):** 1. AI technológia a prevedenie, 2. využiteľnosť v praxi u zadávateľa, 3. inovatívnosť. **Nedeľa (finále, 12-členná porota, kde je aj A. Hlavinka z VZP):** pribudnú 4. škálovateľnosť a 5. kvalita prezentácie a tímu. Váhy nie sú zverejnené **[`05` §2.3; `09` §1]**.
- **Odovzdanie:** sobota 17. 10. **13:00** (tvrdý deadline) na `submit.rakathon.cz`: názov, popis do 140 znakov, popis AI a dopadu, **povinný titulný obrázok 16:9 do 8 MB**, odkazy na GitHub, demo, video (či sú povinné, nie je jasné [?]) **[`05` §2.2]**.
- **Ceny:** 100 / 50 / 25 tis. Kč; VZP „Křeslo pro inovace“ = 60 min s generálnym riaditeľom VZP pre najlepší tím VZP výziev; InterSystems 1 500 EUR (dá sa kombinovať s akoukoľvek výzvou, vyžaduje reálne použitie FHIR/IRIS) **[INTRO Praha, slid „Partnerské ceny“]**.
- **Pitch vo finále:** oficiálna dĺžka nie je uvedená; môj odhad je 4,8 až 6 minút na tím vrátane výmeny **[odhad `09` §1.1]**.

### 1.10 Čo zadanie nehovorí (otvorené otázky) [?]
1. Má dataset históriu pozvánok/SMS? (rozhoduje, či sa dá odhadnúť „efekt zásahu“ z dát, alebo len navrhnúť experiment)
2. Bude spoločná testovacia sada? Podľa čoho porovnajú tímy modely?
3. Aké presné je meranie „absolvovala skríning“ (okno v dňoch po `invitation_date`)? Zahŕňa aj vyšetrenia mimo skríningu (diagnostické, samoplatené)?
4. Súhlas na použitie dát vo vlastných nástrojoch (cloudový LLM mimo schváleného Azure). Odporúčam spýtať sa J. Bartyzala, než sa dáta dostanú mimo portálu.
5. Je víťaz VZP výzvy porovnávaný len v rámci Prahy? (zatiaľ pravdepodobne áno, ale nepotvrdené)

---

## 2. Koncový užívateľ

Používateľ nie je lekár. Sú tu **tri postavy**, každá s iným problémom.

### 2.1 Hlavný používateľ: pracovníčka/analytik prevencie vo VZP
Kto presne (oficiálny názov funkcie) **[?]**. Z verejných informácií o systéme vieme:
- VZP posiela list **od 2014** poistencom, ktorí nechodia na prevenciu a nie sú liečení pre daný nádor. Pre prsník sú cieľom ženy **45–70 rokov**. Zasielanie ide **postupne podľa dátumu narodenia**, aby sa rovnomerne naplnila kapacita pracovísk **[web: vzp.cz, projekt adresného zvania]**.
- List hovorí, na aké vyšetrenia má žena nárok, že ich nemá, ako a kde ich absolvovať, a obsahuje **infolinku** (aj pre ženy bez praktika/gynekológa, ktoré sa odkážu na lekárov s voľnou kapacitou). Stránka **nehovorí o pevnom termíne** vyšetrenia a nespomína SMS, e-mail ani aplikáciu **[web: vzp.cz; `08` §3]**.
- Od 1. 7. 2026 môže žena 45+ v odôvodnených prípadoch prísť na mamograf **bez žiadanky** a VZP upozorní na blížiaci sa termín cez aplikáciu **Moje VZP** **[web: VZP 24. 6. 2026]**.

**Jej týždeň (rekonštrukcia z verejných údajov, [odhad]):**
1. Z IT dostane zoznam žien 45–69, ktoré podľa nárokov nemajú skríning za posledné 2 roky a nie sú liečené.
2. Vlny listov plánuje podľa dátumu narodenia a kapacity centier, nie podľa toho, **komu list pomôže**.
3. Po týždňoch až mesiacoch sčíta, koľko žien potom prišlo na mamograf (údaje z vyúčtovania chodia s oneskorením [?]). Výsledok: „každá piata pozvánka uspela“.
4. Šéfovi povie „funguje to“, ale **nevie povedať, čo by sa stalo bez listu** (žiadna kontrolná skupina). Zadanie to priznáva: „bez následného experimentu nelze říct, zda konkrétní intervence účast skutečně zvýšila“ **[deck, slide 3]**.

**Čo ju bolí (konkrétne):**
- **Rovnaký list pre všetkých.** Ženy s veľmi rozdielnou pravdepodobnosťou príchodu dostávajú podobnú komunikáciu **[deck]**. Približne **57 tis. žien ročne** dostane list, ktorý v **97 %** nezaberie (59 tis. × (1 − 0,032)) **[prepočet]**.
- **Nevie prečo.** Historické dáta „neříkají, proč konkrétní klientka nepřišla“ **[deck]**.
- **Nové páky bez pravidla.** VZP ide posielať pozvánky aj cez aplikáciu a otvoriť kalendáre poskytovateľov pacientovi (riaditeľ VZP, marec 2026) **[`08` §3; zdroj e15]**; Moje VZP má takmer 3 mil. používateľov (1. 4. 2026) **[web: VZP]**. Nemá však pravidlo, **komu ktorý kanál dať**.
- **Tlak na dôkazy.** VZP má na 2026 plánovaný deficit 12,7 mld. Kč (výdavky 341,2 mld., príjmy 328,5 mld.) **[web: ČTK 24. 11. 2025]** a hovorí „platíme za preukázanú hodnotu“ **[`09` §3.1]**. Každá nová aktivita potrebuje číslo a dôkaz.
- **Zmeny z 1. 7. 2026 zoberú „ľahké“ prípady.** Expertný odhad predsedu odborného výboru MZ je **+5 až 8 percentuálnych bodov** účasti z nových opatrení **[web: VZP 24. 6. 2026, J. Daneš]**; je to len odhad, nie výsledok. Zostane **tvrdé jadro**, kde administratívna zmena nestačí **[odhad `08` §3]**.

**Čo by robila s naším nástrojom (utorok ráno):** otvorí aplikáciu, vyberie vlnu listov, vidí skupiny žien s veľkosťou a očakávanou odozvou, pre každú skupinu vyberie ponuku, stiahne zoznam „žena → skupina → varianta“ pre tlačiareň/IT a jednostranový plán experimentu pre šéfa.

### 2.2 Žena, ktorá list dostane (koncový príjemca)
- Typické profily (**hypotézy z decku, nie z dát**): pravidelná preventistka, ktorá len zabudla; žena bez kontaktu so zdravotníctvom; žena „v starostlivosti“, ktorú nikto neposlal na prevenciu; žena, ktorá dostáva list po 11. raz a už ho ignoruje; žena, pre ktorú je pracovisko ďaleko **[deck, slide 8]**.
- Pre skupinu 59 tis. žien to znamená, že ide o list číslo 11 či viac. Čo ich naozaj zastavuje (strach z vyšetrenia, nepohodlie, čas, chýbajúci lekár, nedôvera, skrytý súkromný mamograf, ktorý v dátach VZP nie je [?]) **dáta nepovedia** a bude to treba overiť rozhovormi alebo experimentom.
- Zaujímavý detail: po liste musí žena **sama vybrať pracovisko a objednať sa** (list pevný termín nedáva) **[web: vzp.cz]**. Britský pokus ukázal, že **pevne daný termín** zvýšil návštevnosť u žien, ktoré predtým neprišli, z 12,3 % na 22,3 % (§3.4). Rozdiel je v tom, **kto robí prvý krok**.

### 2.3 Lekár, ktorý ženu pozná (praktik/gynekológ) a pracovisko
- Podpora praktika je jedna z najstaršie overených páčok (list podpísaný lekárom: 21 % vs 10 % pri druhom liste, §3). Zadanie navrhuje zapojiť praktika pre skupinu „v starostlivosti, ale bez prevencie“ **[deck]**.
- Pre pracoviská je dôležité rovnomerné vyťaženie (VZP preto posiela podľa dátumu narodenia). **Nová pozvánka nesmie pracovisko zahltiť** **[odhad]**; v simulácii nástroja preto má byť „kapacitný“ posuvník.

### 2.4 Prečo dnešný stav zlyháva (v bodoch)
1. **Jeden kanál (list), jeden text, desať rokov rovnaký výsledok.** 2014: 19,5 % úspešných pozvánok (61 967 z 318 360). 2024: 18,9 % **[web: VZP 2015; deck]**.
2. **Pevný termín chýba.** List vysvetľuje ako sa objednať, ale žena si ho musí objednať sama **[web: vzp.cz]**; dôkaz o tom, že pevný termín zlepšuje návštevnosť, existuje (§3).
3. **Čas nie je prispôsobený žene.** Vlny podľa dátumu narodenia vyrovnávajú kapacitu, nie šancu uspieť. U ročníka 2014 klesla úspešnosť z 26,1 % v januári na 12,6 % v decembri a VZP to spájalo s doznením mediálnej pozornosti **[web: VZP 2015, cez `08` §3]** — z čoho vyplýva, že **sama o sebe vlna ukazuje zmiešané účinky listu a okolia**, čo bez kontrolnej skupiny nejde oddeliť [odhad].
4. **Žiadne meranie.** Bez kontrolnej skupiny nevie povedať, čo list spôsobil **[deck]**.
5. **Administratívne prekážky.** Do 30. 6. 2026 bola nutná žiadanka (zmenené len „v odôvodnených prípadoch“) **[web: VZP 24. 6. 2026]**.

---

## 3. Dôkazy o probléme (čísla a štúdie)

### 3.1 Prečo skríning zachraňuje životy
| Tvrdenie | Číslo | Zdroj |
|---|---|---|
| Ženy 50–69 pozvané na skríning majú o **23 %** nižšie riziko smrti na rakovinu prsníka; ženy, ktoré **skutočne prídu**, o približne **40 %** nižšie | IARC (WHO) Handbook 2015, 11 randomizovaných štúdií + 40 pozorovacích | IARC tlačová správa https://www.iarc.who.int/wp-content/uploads/2018/07/pr234_E.pdf ; sprostredkované: https://healthmanagement.org/pdf/article/breast-cancer-screening-lowers-death-risk-by-40 **[sprostredkované; pôvodný článok: Lauby-Secretan et al., NEJM 2015;372:2353]** |
| Rozdiel „pozvaná vs. prišla“ je celé jadro výzvy: pozvánka nezachráni nikoho, kým žena nepríde | – | prepočet z hore |

### 3.2 Aká je účasť v Česku a vo svete
- **ČR:** účasť na mamografii **~60 %** žien (rok 2022; EÚ 56 %) **[OECD ČR 2025: https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-cs-2025-1663-v2-en.pdf ; ECA 07/2026 https://www.eca.europa.eu/ECAPublications/SR-2026-07/SR-2026-07_EN.pdf]**. VZP: účasť „mierne rastie, je nad 60 %“; **skoro 443 tis.** klientok VZP bolo na mamografickom skríningu v 2025, o **13 %** viac než pred piatimi rokmi **[web: https://www.vzp.cz/o-nas/aktuality/ruzovy-rijen-pripomina-prevenci-proti-rakovine-prsu-na-mamograf-slo-vloni-pres-440-tisic-klientek-vzp]**.
- **Nesúlad čísel vysvetlený:** „60 %“ je účasť všetkých žien v cieľovej skupine, kým „18,9 %“ je odozva len na **list**, ktorý dostanú ženy, ktoré skríning **nemajú** (tvrdšia časť populácie). Preto obe čísla nie sú v rozpore **[odhad podľa popisu výberu v `vzp.cz`]**.
- **Slovensko (Maťo):** odozva na pozvanie poisťovne len **21–22 %** (NOI 2023); účasť na mamografii ~29–30 % **[TASR: https://www.teraz.sk/zdravie/skrining-rakoviny-moze-zachranit-ro/748832-clanok.html ; OECD SK 2025 https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-sk-2024-1683-en.pdf]** → ten istý problém, ešte väčší.
- **Dlhodobá stagnácia listov VZP:** 2014: 318 360 pozvaných → 61 967 prišlo = **19,5 %** **[VZP 2015]**; 2024: **18,9 %** **[deck]**. Desať rokov bez zlepšenia.

### 3.3 Čo to stojí
- **Liečba rakoviny prsníka v VZP (2025):** **59 044** klientok, **3,64 mld. Kč**. V roku 2021 to bolo 55 024 klientok a 2,25 mld. Kč. Náklady vyrástli o 62 % pri náraste počtu pacientok o 7 %; na pacientku ~41 tis. → ~62 tis. Kč **[prepočet z VZP 25. 9. 2026; číslo 3 637 766 tis. Kč a 59 044 potvrdené na webe]**.
- **Neskoršie štádium je drahšie:** nemecký modelový odhad (pohľad platiteľa, ceny 2021) na jednu pacientku: štádium I **21 523 €**, II 25 679 €, III 30 156 €, **IV 42 086 €**; štádium IV je ~**2×** drahšie než I **[https://pmc.ncbi.nlm.nih.gov/articles/PMC9853539/ ; modelový odhad, nie česká reálna cena]**. Anglické nemocničné náklady za prvý rok: £5 167 (I), £7 613 (II), £13 330 (IIIA) **[sprostredkované vyhľadávaním, https://lshtm-eprints-repo-prod.lshtm-eprints.cdl.cosector.com/4659743/1/Costs%20of%20early%20invasive%20breast%20cancer%20in%20England%20using%20national%20patient-level%20data.pdf]**.
- **Ilustrácia veľkosti (nie sľub):** 1 percentuálny bod účasti z 292 176 pozvaných = **~2 900 žien** **[prepočet]**. Pri záchyte rádovo 5 na 1 000 vyšetrených (švédska štúdia MASAI, kontrolné rameno 5,0 na 1 000) to je **~15 zachytených rakovín** **[prepočet; zdroj číslice: https://doi.org/10.1016/s2589-7500(24)00267-x cez `07`; české záchyty u neúčastníčok môžu byť iné [?]]**. Posun z III. do I. štádia znamená v modeli ~8,6 tis. € rozdiel na pacientku **[prepočet z 30 156 − 21 523]**.
- **Poctivo:** dodatočné vyšetrenia stoja aj peniaze (cena jedného skríningového mamogramu pre VZP som nenašiel [?]). **Čisto finančný prínos pre VZP nie je zrejmý**; hlavný argument je zdravotný a „platba za výsledok“.

### 3.4 Čo funguje (dôkazy o zásahoch)
| Zásah | Výsledok | Zdroj | Pozn. |
|---|---|---|---|
| Intervencie na zvýšenie účasti na mamografii (viac-zložkové) | **OR 1,55**; u znevýhodnených skupín **OR 1,81** (OR = pomer šancí) | Ferrari et al., Public Health Rev 2025, 44 RCT, 161 141 ľudí https://doi.org/10.3389/phrs.2025.1607873 **[V cez `07`]** | najlepšie podložený dôkaz |
| Pripomienka k pozvánke | účasť +3 až 10 percentuálnych bodov (10 z 11 štúdií) | Duffy et al., J Med Screen 2017 (rýchly prehľad, 68 prác) https://pmc.ncbi.nlm.nih.gov/articles/PMC5542134 | rýchly prehľad, nie úplný systematický |
| **Pevný druhý termín vs. otvorená pozvánka** u žien, ktoré predtým neprišli | **23 % vs 12 %** (Stead); britský RCT 26 000 žien: **22,3 % vs 12,3 %** do 90 dní; druhý pevný termín dal ďalších +10,4 b. b.; väčší efekt u žien s nižším sociálno-ekonomickým statusom | Duffy 2017 (vyššie); QMUL správa o RCT v Lancet Oncology (máj 2017) https://www.sciencedaily.com/releases/2017/05/170515192753.htm | najbližšie k našej „tvrdej skupine“; **list VZP pevný termín nedáva** [web: vzp.cz] |
| Druhý list podpísaný lekárom (GP) | 21 % vs 10 % | Duffy 2017 (Turner) | |
| Odporúčanie praktika | +2 až 3 b. b. typicky, niekde 10–20 | Duffy 2017 | |
| List namiesto SMS | pri pevnom termíne a pripomienke 96 h pred termínom bola účasť SMS **86,6 %** vs list **87,3 %** (rovnocenné) | M-TICS RCT, Katalánsko 2024 https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11361687/ | SMS je lacný kanál, ale pri fixnom termíne |
| Pozvánka, telefón, pozvánka + telefón (oproti žiadnemu zásahu) | OR 1,66 / 1,94 / 2,53; domáce návštevy nepomáhajú (OR 1,06) | Cochrane 2001, 14 štúdií https://www.cochrane.org/evidence/CD002943_strategies-increasing-participation-women-community-breast-cancer-screening | staré (2001), len smerovo |

**Čo dôkazy NEhovoria (dôležité pre pitch):**
- **Neexistuje dôkaz, že správy vytvorené jazykovým modelom (AI) zvýšia skutočnú účasť** (RCT o očkovaní proti HPV: krátkodobý záujem áno, skutočné očkovanie nie) **[`07` Z58]**. Presne preto zadanie žiada **experiment**.
- Čísla z Británie a Katalánska sú pre ženy, ktoré „zmeškali termín“ alebo majú pevný termín, **nie pre ženy, ktoré 11 rokov ignorujú list** **[odhad]**. Preto treba odhad efektu v simulácii zadávať **ako rozsah a hypotézu**.

### 3.5 Dá sa „neúčasť“ predpovedať?
- Strojové učenie na predpoveď účasti v programoch skríningu existuje: v južnej Kórei dosiahli najlepšie boosting stromy **AUC 0,87** (AUC = miera, ako dobre model radí ženy; 0,5 je náhoda, 1,0 dokonalosť) **[arXiv:2101.11614 https://arxiv.org/abs/2101.11614, celonárodný skríning všeobecne, nie len prsník]**. V súvislosti s mamografom v Británii existujú staršie práce so slabším výsledkom pre „nepríde“ **[Coventry, https://pureportal.coventry.ac.uk/en/publications/predicting-breast-screening-attendance-using-machine-learning-tec-2/ ; len abstrakt]**.
- **Záver:** predikcia je zvládnuteľná a nie je to samotná hodnota; **predikcia sama neurčí, čo s ňou robiť**, a to je presne to, čo VZP chce („KDO“ je len krok 1 zo 4).

---

## 4. Existujúce riešenia na trhu

| Riešenie | Kto | Čo robí | Cena / kto platí | Čo robí zle / medzera |
|---|---|---|---|---|
| **Adresný list VZP** (od 2014) | VZP | Jednotný list ženám bez skríningu, infolinka | rozpočet VZP (cena listu [?]) | jeden kanál, rovnaký text, žiadna kontrolná skupina; ~19 % odozva stabilne 10 rokov **[web: vzp.cz; deck]** |
| **Pripomienka v Moje VZP** | VZP | upozornenie na blížiaci sa termín; takmer 3 mil. používateľov | v rámci aplikácie | funkcia pripomienok a priamej rezervácie sa len pripravuje; nie je cielená podľa rizika **[web: VZP 24. 6. 2026, 22. 4. 2026; `08` §3]** |
| **SMS pripomienky mamografických centier** | pracoviská | pripomenutie **už objednaného** termínu | pracovisko | rieši „no-show“, **nie** oslovenie ženy, ktorá sa nechystá; zadanie to výslovne vylučuje **[`08`; deck]** |
| **Register a online objednávanie pri Národnom skríningovom centre (ÚZIS)** | štát | jednotný register, online rezervačný systém | štát | v príprave, nie hotové, detaily nenájdené **[`08` §3; ?]** |
| **Pevný termín a prepojené pozývanie (Británia, severské krajiny)** | národné programy | termín je dohodnutý v liste, žena ho iba mení | národný program | funguje (22,3 % vs 12,3 %), ale **nie je to produkt, ktorý by sa dal kúpiť**; vyžaduje zmenu procesu **[Allgood/Duffy 2017]** |
| **Platformy na „uzatváranie medzier v starostlivosti“** (angl. care-gap closure, napr. Lumeon; ďalší dodávatelia z mojej znalosti: neoverené [?]) | súkromné firmy hlavne v USA | osobné oslovenie pacientov na rutinnú starostlivosť, automatizácia pre „angažovaných“ a osobný kontakt pre ostatných | cenníky nie sú verejné; Lumeon uvádza 70+ zákazníkov, na stránke nespomína skríning nádorov **[web: lumeon.com]** | cudzí systém, nie česká poisťovňa, nie A/B dôkaz pre VZP; v USA platí za to poisťovňa, lebo skríning prsníka je meraný ukazovateľ kvality **[znalosť modelu, NCQA stránka vrátila 403, neoverené]** |
| **AI na čítanie mamografov (Carebot, ďalší)** | česká firma Carebot, kolo >1,5 mil. € (júl 2026); ~30 % českých mamografických pracovísk používa AI | druhé čítanie snímky | pracovisko/pacientka (úhrada nepotvrdená) | **iný problém** (po vyšetrení, nie pred ním); ukazuje, že trh „AI v mamografii“ v ČR existuje, ale na **pozývanie** nie **[web: lupa.cz 28. 7. 2026]** |
| **VZP Inovačný portál** (od 21. 9. 2026) | VZP | dočasná úhrada 6–24 mesiacov pre overené digitálne nástroje; onkologická výzva podľa rozhovoru od 1. 11. 2026, na 2027 plánovaných ~300 mil. Kč | VZP | žiadateľ musí byť výrobca/dodávateľ alebo výskumná inštitúcia s klinickým partnerom; **nástroj na pozývanie nie je zrejmý „zdravotnícky“ nástroj** — či sa tam hodí, je otvorené **[`09` §3.1; `08` §0; ?]** |

**Kto za to dnes platí:** poisťovňa za tlač a poštu listov a za pripomienky; analytika sa robí zrejme **interne** (VZP „robí analytiku aj interne“ **[`08` §9]**). Komerčný produkt „poisťovni na mieru nastaví a overí pozvánku“ som v ČR nenašiel **[?]**.

**Kde je priestor urobiť to lepšie, rýchlejšie, lacnejšie, jednoduchšie:**
1. **Uzavrieť slučku „skupina → ponuka → zmeraný efekt“.** Dnes VZP nevie, čo zabralo (žiadna kontrolná skupina). Hotový experimentálny plán + náhodné rozdelenie je to, čo VZP **vyžaduje aj od pilotov** (cieľová skupina, KPI, trvanie, pravidlá pokračovať/zastaviť) **[`09` §3.1]**.
2. **Lacnejšie.** Bez novej infraštruktúry: vstup je tabuľka (CSV), výstup je tabuľka a jedna strana; kanály (list, SMS, Moje VZP, telefón) už VZP má.
3. **Rýchlejšie.** Plán novej vlny listov za hodiny, nie mesiace.
4. **Jednoduchšie.** Nie nový systém, ale „pomocník pre plánovanie listov“. Rovnaký princíp ako „nie ďalší systém, ďalší formulár“ (zadávatelia to opakujú pri viacerých výzvach, `06` §7).
5. **Škálovateľné.** To isté trápi **všetky české poisťovne** a **slovenské** (odozva 21–22 %) **[?; počet a tvar adresného zvania u ostatných poisťovní som nehľadal]**.

---

## 5. Najlepší návrh riešenia pre nás

### 5.1 Princíp
Model sám nie je „unikátny“: tímy, ktoré budú mať len model, sa budú líšiť o stotiny v AUC (miera kvality radenia), čo zadávateľa pravdepodobne nezaujíma [odhad]. Zadanie je postavené tak, že **rozhodovacia vrstva (čo s tým) a overenie (A/B)** sú dve zo štyroch úloh. Ukážeme celý reťazec **KDO → PREČO → ČO → AKO OVERIŤ** v jednej aplikácii, ktorej rozumie nelekárka.

### 5.2 Produkt: „Mamo Kompas“ (pracovný názov)
**Pre koho:** pracovníčka prevencie VZP (§2.1). **Čo robí:** 4 obrazovky, každá zodpovedá jednej úlohe zadania.

1. **KDO – „Koho teraz oslovujeme“.** Vyberie sa vlna pozvánok. Zobrazí sa skóre rizika neúčasti pre každú ženu (anonymné ID), rozdelenie do desiatich skupín podľa rizika a **skutočná odozva v každej skupine** (aby bolo vidieť, že model radí správne). Poctivé metriky v jednej vete: „Model radí ženy so správnym poradím v X % prípadov.“
2. **PREČO – „Pár skupín, ktorým rozumiete“.** Skupiny pomenované bežnou rečou (napr. „Oneskorené preventistky“, „V starostlivosti, ale bez prevencie“, „Bez kontaktu so zdravotníctvom“, „Opakovane nereagujúce (11+ listov)“, „Ďaleko od pracoviska“; konkrétne názvy a veľkosti z dát). Pre každú: veľkosť, súčasná odozva, 3 hlavné faktory po slovensky/česky (nie „SHAP“, ale „ženy, ktoré boli naposledy na kontrole pred viac než X rokmi“).
3. **ČO – „Čo im ponúknuť“.** Pre každú skupinu karta s ponukou: kanál (list s pevným termínom, SMS, upozornenie v Moje VZP, list od praktika, telefonát navigátora), 2 varianty textu pre test (AI ich napíše v jednoduchej češtine; kontrola: bez strašenia, bez zdravotných tvrdení), **odhad efektu z literatúry s odkazom** (rozsah z §3.4) a **cena na ženu** (parameter, ktorý VZP vloží; východzia hodnota označená „doplniť“ [?]).
4. **AKO OVERIŤ – „Plán experimentu“.** Hotový plán: skupiny (kontrola + varianty), **náhodné rozdelenie po skupinách** (stratifikované; exportovateľná tabuľka ID → ramenom), **koľko žien treba** (príklady v 5.3), hlavný ukazovateľ (skríning do N dní od `invitation_date`), ochranné ukazovatele (kapacita pracovísk, rovnosť medzi regiónmi), pravidlá pokračovať/zastaviť, jednostranové zhrnutie v „šablóne pilotu“ VZP.
5. **Bonus obrazovka „Čo ak“:** posuvníky (rozpočet, mix kanálov, predpokladaný efekt v rozsahu) → odhad, o koľko žien navyše to môže zvýšiť účasť a koľko stojí jedna žena navyše. Výrazne označené **„predpoklady, nie sľub“**.

**Poctivé obmedzenia (zobraziť priamo v aplikácii, porota to ocení):** dáta sú pozorovacie; nevieme z nich povedať, čo zaberie. Preto ponúkame **experiment**, nie tvrdenie. Nikoho „neprestaneme pozývať“; tvrdému jadru ponúkame **viac**, nie menej.

### 5.3 Čo konkrétne vypočítame (príklady pre pitch)
Veľkosť skupín pre A/B test pri 80 % sile a 5 % hladine významnosti (bežný vzorec pre porovnanie dvoch podielov, **[prepočet]**):
- „Opakovane nereagujúce“ (základ 3,2 %): zvýšenie na 4,2 % (+1 b. b.) vyžaduje **~5 600 žien na skupinu**; na 5,2 % (+2 b. b.) **~1 600**. Skupina má cca 59 tis. žien, takže test je **ľahko realizovateľný**.
- Stredná skupina (základ ~16 %): zvýšenie o +2 b. b. = **~5 500 žien na skupinu**; o +3 b. b. = **~2 500**.
- Hlavná správa pre VZP: „Na overenie stačí malá časť ročníka, nepotrebujete meniť celý program.“

### 5.4 AI (kde presne je a čo je len pravidlo)
- **Model rizika:** gradient boosting (LightGBM/CatBoost) na tabuľkových dátach, **časové rozdelenie** (učí sa na skorších pozvánkach, testuje na neskorších), kalibrácia pravdepodobností. Bez úniku informácií po `invitation_date`.
- **Vysvetlenie:** hlavné faktory ako veta, nie graf.
- **Jazykový model (LLM):** (a) pomenuje skupiny a vysvetlí ich z čísel; (b) napíše varianty textov pre test; (c) odpovedá na otázky nad **agregovanými** tabuľkami (nie nad jednotlivými ženami). Beží cez Azure kľúč z portálu.
- **Pravidlá, nie AI:** priradenie žien do skupín, náhodné rozdelenie, výpočet počtov, kontrola textov na zakázané tvrdenia.
- **Voliteľné (cena InterSystems 1 500 €):** export plánu ako FHIR zdroje (napr. `Communication` pre oslovenie, `Task`, `Appointment`/`Slot` pre pevný termín) a zápis do IRIS for Health (zadarmo, komunitná verzia) — musí to byť **skutočná integrácia**, nie nálepka **[`09` §5]**. Tým aj kritérium „škálovateľnosť“ vo finále.

### 5.5 Čo ukážeme v 3-minútovom pitchi (podľa šablóny `09` §4.5)
| Čas | Obsah | Kritérium |
|---|---|---|
| 0:00–0:20 | Hák: „Každá pozvaná piata žena príde. Je to tak už 10 rokov. 59 tisíc žien dostalo ten istý list aj 11. raz, **3 zo 100** prišli.“ (čísla VZP) | 2 |
| 0:20–0:45 | Pre koho: manažérka prevencie VZP a jej každoročná vlna 292 176 listov; kto platí a kto to používa. Pozdrav zadávateľovi v sále. | 2 |
| 0:45–1:45 | **Video 60–75 s so skutočnou obrazovkou:** vybrať vlnu → skupiny → ponuka pre „opakovane nereagujúce“ → plán experimentu a „čo ak“. | 1, 3 |
| 1:45–2:15 | Ako to funguje: model + čo je pravidlo + čo urobil AI; poctivo: „z dát nevieme, čo zaberie → preto experiment“. Čo vzniklo teraz. FHIR áno/nie. | 1, 2 |
| 2:15–2:40 | **Pilot na jednom riadku:** skupina 59 tis., 2 varianty + kontrola, ~5 600 žien na skupinu, 1 vlna, KPI = skríning do 90 dní, pravidlo pokračovať/zastaviť; potom iné poisťovne (SK 21–22 %). | 2, 4 |
| 2:40–3:00 | Tím a „čo robíme v pondelok“; jedna konkrétna žiadosť (60 min „Křeslo pro inovace“ + pilot v ročníku 2027). | 5 |

**Titulný obrázok 16:9:** jeden výsledok, nie logo: veľké „292 176 → 59 000“ a obrazovka aplikácie so skupinami.

### 5.6 Plán na noc (pre Claude Code, jednoducho)
1. **Teraz do 19:00:** vybrať výzvu na `submit.rakathon.cz/vyzvy/vybrat` (kapitán), vyplniť formulár o prístupy do Azure (`docs.google.com` formulár z #08/#02) čo najskôr, prijať pozvánku do GitHub Copilot na GitHube.
2. **Prvé 2 hodiny:** stiahnuť dataset a dátový slovník, zistiť stĺpce (hlavne bod 7, B3, B4), definovať výsledok (skríning do N dní od `invitation_date`), rýchlo overiť kvalitu dát. Pozor: celé riešenie stojí na tom, že prístup funguje.
3. **Ďalšie 4 hodiny:** model + časové rozdelenie + kalibrácia, skupiny, vysvetlenia.
4. **Ďalších 4 hodiny:** web aplikácia (4 obrazovky), experimentálny plán + náhodné rozdelenie + počty, „čo ak“.
5. **Do rána:** LLM texty, kontrola, export jednostránky, nahrať 60–75 s video (skutočná obrazovka, Brunov štýl úpravy).
6. **Do 13:00:** odovzdanie. **Verejný GitHub bez dát VZP** (iba kód a agregované/umelé ukážkové dáta); dáta VZP sú len pre túto výzvu a neverejné **[`05` §2.4]**.

### 5.7 „Šialený“ ambiciózny variant: „AI navigátorka a digitálne dvojča pozvánok“
Nadstavba, ktorú robíme **len ak je jadro hotové** (inak ju neukazujeme):
- **Digitálne dvojča programu:** umelá populácia 292 176 žien kalibrovaná na zverejnené čísla (44,5 / 18,9 / 3,2 %) a reálny model. VZP si môže vyskúšať politiky („pevný termín pre všetkých tvrdých“, „list od praktika“, „telefonát“) a **vidieť rozsah efektu pred tým, než minie korunu**, vrátane dopadu na kapacitu pracovísk a rovnosť medzi regiónmi.
- **AI navigátorka (hlas alebo chat v češtine) pre tvrdé jadro:** vysvetlí, že od 1. 7. 2026 netreba žiadanku (v odôvodnených prípadoch) **[web: VZP 24. 6. 2026]**, nájde pracovisko a **zarezervuje pevný termín** (FHIR `Slot`/`Appointment` do IRIS = cena InterSystems), odpovie na najčastejšie obavy. Odpovede len zo **schválenej knižnice faktov** (žiadne vymýšľanie). **Maťo (ÚRO)** vie fakticky vysvetliť dávku: typicky ~0,5 mSv (UK) až ~0,7 mSv (Austrália, 4 snímky), čo je približne 3 mesiace až pol roka prirodzeného žiarenia **[https://www.breastscreen.health.wa.gov.au/Breast-screening/Benefits-and-harms/Radiation ; hodnota pre ČR/SK doplniť [?]]**. Pozor: nevystupujeme v mene ÚRO.
- **Video mikropríbehy pre skupiny (Brunovo štúdio):** 15–20 s videá v hlase skupiny („Marie, 58, dostala list po 11. raz“) ako **varianty A/B testu**; všetky umelé postavy, žiadne reálne ženy ani skutočné hlasy.
- **Riziká šialeného variantu:** viac pohyblivých častí (hlas, FHIR, video), čas; telefonovanie klientkam v reálnom svete vyžaduje súhlas a posúdenie ochrany údajov (GDPR), v demu iba **umelí volajúci**; **dôkaz o účinnosti správ z jazykového modelu chýba** (§3.4), preto sú to **varianty v teste**, nie tvrdenie.

### 5.8 Hlavné riziká návrhu (zhrnutie)
1. **Silná technická konkurencia** (tím s ML zázemím v Prahe, ďalšie v Brne). Model samotný nestačí; odlíšenie je rozhodovacia vrstva + experiment + príbeh.
2. **Prístup k dátam** (oneskorené Azure prístupy; nejasnosť „Prílohy B“; možný chýbajúci údaj o minulých pozvánkach). Ak dataset nemá históriu pozvánok, **nedokážeme z dát odhadnúť efekt zásahu** → ponúkame iba experiment (čo zadanie vyžaduje).
3. **Dáta sú neverejné.** Pravidlá: nezverejňovať neverejné údaje; nebol schválený výslovný súhlas na nahrávanie do cloudového LLM mimo Azure portálu [?]. Plán: kód lokálne, LLM vidí len schému, agregáty a umelé príklady; ak sa to dá, aj model v Azure.
4. **Spravodlivosť.** Skóre rizika nesmie viesť k „menej starostlivosti pre ženy s nízkou šancou“ (vrátane regiónu alebo veku ako zástupcu). V demo to riešime tak, že nikoho neprestaneme pozývať a skupine s najnižšou šancou ponúkame **viac**.
5. **Hodnota pre platiteľa je nejasná.** Extra mamogramy stoja peniaze [?]; hlavná hodnota je zdravotná. Preto pitch bude „cena za jednu ženu navyše“, nie „úspora“.

---

## 6. Konkurencia na hackathone a oprávnenosť

### 6.1 Môže pražský tím túto výzvu zvoliť? **Áno.**
- Výzva je **spoločná pre všetky mestá** (INTRO Praha: „3 výzvy VZP ve všech městech“). Formulár výberu najprv pýta mesto a pre Prahu ukáže **12 výziev: 9 pražských + 3 VZP** **[`05` §2.6]**. Už ju zvolili 3 pražské tímy. Brnianska/ostravská výzva (ktorá by nás neoslobodzovala od fyzickej prítomnosti) tu nie je potrebná.
- **Víťaz sa vyhlasuje za mesto a postupuje do nedeľného finále**: „Nejlepší za každou výzvu“ a na doplňujúcu otázku, či postúpia aj víťazi spoločných výziev zo všetkých troch miest, odpovedal T. Studeník: **„Ano, vítězové výzev včetně VZP ze všech měst“** **[Slack #02-dotazy, 15. 10. 15:20–15:42]**. Prakticky v nedeľu môžu byť v finále až **3 víťazi mamografu** (Praha, Brno, Ostrava).
- VZP cena „Křeslo pro inovace“ ide **jednému** najlepšiemu tímu zo všetkých VZP výziev **[INTRO; `05` §2.5]**.
- **Povinnosti:** tím 2–4 ľudia, **obaja fyzicky na mieste v Prahe**, jedna výzva na tím **[Slack #02-dotazy, 15:36]**.

### 6.2 Kto je na výzve (stav ~16:00 na `submit.rakathon.cz/vyzvy`, cez `05` §3)
| Mesto | Tímy | Poznámky |
|---|---|---|
| **Praha (3)** | Titics, **mammo_prg**, Čímžtopádem Vyléčeno | mammo_prg: bioinformatika/ML + backend, CatBoost + zhlukovanie, zaujímajú sa o FHIR, majú výzvu zvolenú a prístup k dátam riešia (15:44 ešte bez prístupu) **[Slack; `04` §7; `05` §3.1 a §5]**. O Titics a Čímžtopádem Vyléčeno nič nevieme [?]. |
| Brno (1) | Mámo, graf! | v kanáli sú aj tímy TokenPerSecond (pýtali sa na testovaciu sadu) a RationAI (výskumná skupina z MUNI), ale **na tabuli výziev nie sú vedené ako tím pre mamograf**, takže ich skutočná výzva je [?] **[Slack joiny; `05` §3]** |
| Ostrava (0) | – | |
| **Spolu zatiaľ** | **4** | |
- **Ešte nerozhodnuté pražské tímy (5):** Ctrl+Alt+CURE, FIT/S, FSMZ, Pražský Meridian, walking legs. Plus **7 tímov z organizátorského zoznamu ešte nie je na tabuli** (Data Team, Junior Scholars, Nexlytics, Panacea, quattro formaggi, radiQA, Risk off). Tím **Panacea** sa v kanáli pýtal na dáta mamografu **[Slack 14:31]**, hacker z externej firmy sa pýtal na modelovanie efektu zásahu **[Slack 14:27]** — **počet sa pred 19:00 pravdepodobne ešte zvýši** **[odhad `05` §3.1]**.
- **Pre porovnanie v Prahe:** Kvalita péče 0, Twincer 0; PACS, MEDDI, Plíce, SMART ONCO AA, MDT Copilot po 1; Cesta pacienta 2; Hlídač NÚ 2; NÚVR 2; **mamograf 3**; Trial Matching 4.
- **Kto rozhoduje v sobotu:** zadávateľ pri obchôdzke (VZP, mentorka H. Damovská a kolegovia); v nedeľu 12-členná porota s A. Hlavinkom (autorom podkladu) **[`09` §1]**.

### 6.3 Moje odhady šance [odhad, nie fakt]
- **Vyhrať pražské kolo výzvy:** ~25–30 % (3–5 tímov; technicky silný konkurent; naša výhoda je vrstva rozhodovania/experimentu a príbeh).
- **Dostať sa do top 3 vo finále:** ~8–12 % (v nedeľu 25+ víťazov výziev, pitch rozhoduje kvalita prezentácie).
- **Kompromis:** výzva je v Prahe **najexponovanejšia analytická**; ak chcete menej konkurencie pri podobnej dôležitosti partnera, v rovnakej VZP rodine sú „Kvalita péče na konci života“ (0 tímov, verejné dáta, ale analytická, menej „wow“, `05` §1.1) a „Cesta pacienta“ (2 tímy v Prahe).

---

## 7. Skóre (1–10, kalibrované: 5 = priemer medzi výzvami, 9–10 len výnimočne)

| Kritérium | Váha | Skóre | Zdôvodnenie |
|---|---|---|---|
| Veľkosť problému (`velkost`) | 1 | **8** | 292 176 pozvánok ročne, takmer 443 tis. klientok VZP na skríningu ročne, 59 tis. žien dostane list opakovane bez odozvy; rakovina prsníka ~7 400 nových prípadov ročne v ČR (ÚZIS cez `08`). Rovnaký problém má SK (21–22 %). |
| Dopad na zdravie (`zdravie`) | 1,5 | **7** | Účasť na skríningu mení úmrtnosť (IARC: o ~40 % nižšie riziko smrti u žien, ktoré prídu). Ale naše zlepšenie je len niekoľko percentuálnych bodov a nepriame (1 b. b. ≈ 2 900 žien ≈ ~15 záchytov, ilustračne). |
| Úspora času (`cas`) | 1 | **4** | Nešetrí lekárom ani sestrám. Šetrí analytikom čas pri plánovaní vlny a ženám jeden krok pri objednaní (ak ide o pevný termín); celkovo skromne. |
| Peniaze (`peniaze`) | 1,2 | **5** | Presun peňazí z ~57 tis. neúčinných listov do účinnejších kanálov; neskoršie štádium je ~2× drahšie (model, I vs IV). Ale ďalšie mamogramy stoja a cenu som nenašiel; čisto finančný zisk nie je zrejmý. |
| Akútnosť bottlenecku (`bottleneck`) | 1,5 | **7** | Odozva stagnuje 10 rokov (19,5 → 18,9 %); VZP presúva pozvánky do aplikácie, od 1. 7. 2026 ruší žiadanku a očakáva +5–8 b. b.; zadanie spísal šéf inovácií VZP. Nie je to „horí to“ ako čakanie na liečbu. |
| Ochota platiť (`platba`) | 1,2 | **5** | Jasný kupec (VZP, rozpočet na pozývanie, Inovačný portál ~300 mil. Kč pre 2027), ale produkt je analytika/plán, ktorú si VZP robí aj interne [`08`]; cesta cez portál nie je zrejmá (žiadateľ musí byť dodávateľ + klinický partner). Komerčný trh v ČR som nenašiel. |
| Jednoduchosť pre užívateľa (`jednoduchost`) | 1 | **8** | Vstup tabuľka, výstup tabuľka a jedna strana; existujúce kanály; žiadna integrácia do nemocnice ani nový návyk lekárov; žena nevidí žiadnu novú aplikáciu. |
| Dáta (`data`) | 1 | **7** | Najväčší a najreálnejší dataset zo všetkých výziev (>1,3 mil. záznamov), s dátovým slovníkom, už na portáli. Odpočet za: oneskorené prístupy do Azure, zmätok s „Prílohou B“, neznáma história pozvánok, žiadna spoločná testovacia sada. |
| Realizovateľnosť dema (`realizovatelnost`) | 1 | **8** | Tabuľkový model, skupiny, web aplikácia, plán experimentu a „čo ak“ sú pre Claude Code jednoduché; 1,3 mil. riadkov je malý objem. Riziko je len prístup k dátam. |
| Wow a príbeh (`wow`) | 1,2 | **6** | Silný číselný hák (každá piata, 10 rokov, 3,2 % po 11. liste) a jasný príbeh „list číslo 11“. Ale je to analytika bez „čarovného“ momentu; wow zdvihne len šialený variant (navigátorka, mikropríbehy). |
| Strategická hodnota partnera (`partner`) | 1,2 | **8** | VZP je hlavný partner; autor podkladu A. Hlavinka je v nedeľnej porote a vedie VZP inovácie; cena 60 minút s generálnym riaditeľom; Inovačný portál sa otvára krátko po finále. (Zdieľané s ďalšími dvoma VZP výzvami.) |
| Šanca vyhrať (`konkurencia`) | 1 | **4** | 3 tímy v Prahe už teraz (výzva s druhým najvyšším počtom), jeden technicky silný, a ďalšie sa ešte môžu pridať; výzva je analytická, čiže klasický terén dátových tímov. Úplne bez tímu sú Kvalita péče a Twincer. |
| Pokračovanie po hackathone (`pokracovanie`) | 0,8 | **6** | VZP vyhlásila, že sľubné nápady sa majú validovať a prípadne pilotovať; experimentálny plán je to, čo pilot VZP vyžaduje; pilot A/B listov je pre VZP lacný. Prekážky: dáta/ochrana údajov, právnická osoba a klinický partner pre Inovačný portál, VZP robí analytiku aj interne. |
| Fit s tímom (`fit`) | 0,8 | **6** | Bruno (marketing, scenár, AI video) priamo sedí na „ČO“ (obsah a komunikácia pre skupiny) a pitch. Maťo (ÚRO) pomôže s faktami o dávke a o mamografii ako vyšetrení s ožiarením, ale výzva je poisťovňa/dáta, nie zobrazovanie. Dátovú vedu pokryje Claude Code. |
| Nízke regulačné riziko (`riziko`) | 0,6 | **8** | Prototyp, anonymizované dáta, žiadna diagnóza ani zmena liečby, nástroj na plánovanie pozvánok nie je zdravotnícky prostriedok (podľa mojej úvahy [?]). Otvorené: ochrana osobných údajov pri reálnom nasadení a spravodlivosť (nediskriminovať podľa regiónu/veku). |

**Vážený priemer: 6,45 / 10** (súčet váh 16,0; vážený súčet 103,2) **[prepočet]**.

---

## Zdroje (zhrnutie URL)

- Podklad výzvy (PDF z Slacku, autor A. Hlavinka, 16. 10. 2026): `docs/materials/slack/od-pozvanky-k-mamografu/Rakathon_VZP_mamograf.pdf`; Drive kópia https://drive.google.com/file/d/1jpN3tlCxpvTmsduJL3Ogkb1qC5b-pguf/view
- Slack: `#od-pozvanky-k-mamografu` (C0C7VGSF98V); `#02-dotazy` vlákno o víťazoch spoločných výziev (15. 10. 15:20–15:42); `#07-hledam-mentora`.
- VZP: adresné zvanie https://vzp.cz/pojistenci/prevence/projekt-adresneho-zvani-na-onkologickou-prevenci ; ženy od 45 bez žiadanky https://www.vzp.cz/o-nas/aktuality/zeny-od-45-let-budou-mit-jednodussi-cestu-na-mamograficky-screening ; Ružový október 2026 https://www.vzp.cz/o-nas/aktuality/ruzovy-rijen-pripomina-prevenci-proti-rakovine-prsu-na-mamograf-slo-vloni-pres-440-tisic-klientek-vzp ; deficit VZP https://www.ceskenoviny.cz/zpravy/vzp-na-pristi-rok-planuje-deficit-127-miliardy-kc-dorovna-ho-z-rezerv/2751320
- Dôkazy: Duffy et al. 2017 https://pmc.ncbi.nlm.nih.gov/articles/PMC5542134 ; britský RCT pevné termíny https://www.sciencedaily.com/releases/2017/05/170515192753.htm ; Cochrane CD002943 https://www.cochrane.org/evidence/CD002943_strategies-increasing-participation-women-community-breast-cancer-screening ; Ferrari 2025 https://doi.org/10.3389/phrs.2025.1607873 ; M-TICS (SMS vs list) https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11361687/ ; IARC 2015 https://www.iarc.who.int/wp-content/uploads/2018/07/pr234_E.pdf ; náklady podľa štádia (Nemecko) https://pmc.ncbi.nlm.nih.gov/articles/PMC9853539/ ; predikcia účasti (Kórea) https://arxiv.org/abs/2101.11614 ; dávka z mamografu https://www.breastscreen.health.wa.gov.au/Breast-screening/Benefits-and-harms/Radiation
- Trh: Carebot https://www.lupa.cz/aktuality/ceska-ai-hledajici-rakovinu-je-ve-stovkach-nemocnic-na-rozvoj-nasla-nove-miliony/ ; Lumeon http://lumeon.com/
- Interné: `docs/research/05-slack-refresh.md`, `06-prezentacie-drive.md`, `07-trendy-a-bottlenecky.md`, `08-cesky-kontext-a-trh.md`, `09-partneri-a-vitazne-vzorce.md`.

**Čo som nestihol overiť (webové vyhľadávanie vyčerpalo limit pridelený pre tento beh):** cenu listu a cenu mamogramu pre VZP, ostatné českých poisťovní a ich adresné zvanie, vendorov „care gap“ okrem Lumeonu, ďalšie literatúru o bariérach neúčasti. Sú označené [?].
