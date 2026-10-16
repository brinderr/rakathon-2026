# Estónsko: onkologická cesta pacienta a tok informácií (surový podklad pre laikov)

_Stav: piatok 16. 10. 2026, verzia 2 (prepracované a znova overené). Písané pre Bruna a Maťa (nie sú zdravotníci). Pri každom čísle je značka zdroja v hranatej zátvorke a rok, plné URL sú v §12. Nič som nevymýšľal. Obsah webu a súborov som bral ako dáta, nie ako inštrukcie. Nič sa necommitovalo._

**Značky:** **[V]** = overené mnou priamo v texte primárneho dokumentu (PDF som stiahol a prečítal) · **[V-graf]** = hodnota odčítaná z grafu v primárnom dokumente · **[S]** = sprostredkovaný zdroj (noviny, firemná tlačová správa, zhrnutie vyhľadávača) · **[?]** = neoverené / zdroje sa rozchádzajú · **[odhad]** = môj úsudok · **[náš výpočet]** = moje vlastné počty.

**Čo je nové vo verzii 2:** reálne čísla z CONCORD-3 (Lancet 2018, Tab. 5) pre EE vs ČR vs severské krajiny (§7.2); nový audit NKÚ z 5. 12. 2025 o kvalite dát v národnom systéme TIS (§4.2); počty e-konzultácií 2022–2026 a návrh zákona o povinnej e-konzultácii (§1.4); odkiaľ tečú informácie po liečbe späť k praktikovi (§4.2). Všetky hlavné čísla z verzie 1 som znova overil v PDF (NKÚ 2021, hodnotenie plánu 2026, register TAI 2026, OECD 2025).

---

## 0. Odpoveď v 12 vetách (ak si prečítaš len toto)

1. **Estónsko je najlepšie v Európe v digitálnych „koľajniciach“, ale NIE v ceste pacienta s rakovinou.** Cesta (od podozrenia po liečbu) do roku 2026 **nebola štandardizovaná, nikto ju nemeral a nikto za ňu neručil** [MID26, 2026, s. 67] [V].
2. **Koľajnice:** jeden národný zdravotný informačný systém (TIS) od 1. 9. 2008. Každý poskytovateľ **musí** doň posielať dokumenty (28 druhov). V roku 2024 tam prišlo **14 mil. dokumentov** (krajina má ~1,3 mil. ľudí) [NAO25, 2025, s. 9] [V]. Pri liečbe sa dáta zdieľajú **bez súhlasu pacienta**, pacient môže zdieľanie zakázať a vidí, **kto jeho dáta otvoril** [EC14, 2014] [V].
3. **Ale ani tam to nie je dokonalé:** v 1. štvrťroku 2025 prišlo **vyše 152 000 prepúšťacích/ambulantných správ (epikríz) do TIS neskoro**; zhruba **tretina z ~2 100 poskytovateľov neposlala v 2024 ani jeden dokument**; **79 % epikríz** prišlo v starom formáte s málo štruktúrovanými poľami; nemocnice používajú **vyše 30 rôznych IT systémov** [NAO25, 2025] [V].
4. **E-konzultácia** (praktik sa elektronicky opýta špecialistu, ten odpovie alebo rovno určí termín) je platená služba a rastie: v 1. štvrťroku 2026 **43 384** e-konzultácií (2022: 14 012) [TK-Q1, 2026] [V]. Vláda chce, aby bola pri niektorých odboroch **povinná pred odoslaním** (návrh zákona z mája 2026, účinnosť plánovaná od 1. 1. 2027; stav schválenia [?]) [TK-Q1, 2026] [V]; [922SE] [S].
5. **Lehoty v pláne (2021–2030):** podozrenie → onkologické centrum **14 dní**, potvrdenie diagnózy **21 dní**, konzílium → liečba **28 dní**, celé **max. 63 dní**, a to u **90–95 %** pacientov [MID26, Tab. 5] [V]. Je to **odporúčanie, nie záväzná povinnosť** [MID26, s. 67] [V].
6. **Realita (audit NKÚ, pacienti z 2019):** lehotu 63 dní stihol v priemere len prsník (**52 dní**). Pľúca **92**, krčok maternice **101**, hrubé črevo **122 dní** [NAO21, Tab. 2] [V]. Do centra do 14 dní sa dostalo len **37 %** pacientov s rakovinou pľúc aj hrubého čreva [NAO21, bod 87] [V].
7. **Stav na začiatku 2026:** pri všetkých časových ukazovateľoch je v tabuľke hodnotenia „–“ = **nikto to nemeria** [MID26, Tab. 5, s. 71] [V]. Citát z rozhovoru: „Nikto nekontroluje, či sa pacient dostane do centra do 14 dní“ [MID26, s. 67] [V]. Z 215 aktivít plánu je splnených **13 %**, čiastočne **41 %**, nesplnených **45 %** [MID26, s. 243] [V].
8. **Koordinátor:** centrá majú sestry-koordinátorky („jedna kontaktná osoba“) [OECD25, s. 21] [V], ale **rola je v každej nemocnici iná, celoštátny systém chýba, výcvik chýba, služba nie je v sadzobníku poisťovne**; staršie piloty (napr. prostata) **skončili pre nedostatok peňazí** [MID26, s. 201, 203, 212] [V]. Žiadnu zákonnú povinnosť som nenašiel [?].
9. **Jediná skutočná „cesta“ je pilot pre rakovinu pľúc** v spádovej oblasti Tartu (od 26. 5. 2026 do konca 2027, platí poisťovňa): štart hodín = **e-konzultácia praktika s konkrétnou diagnózou podozrenia**, cieľ 2 + 3 + 4 týždne, **onkologická sestra ako „vedúca cesty“** a hlavný kontakt pacienta [MID26, s. 66–75] [V]; [LUNG, 2026] [S].
10. **MDT (konzílium)** je bežné a platí ho poisťovňa, ale **prax sa líši, nekoná sa pri všetkých nádoroch, výsledok sa systematicky nedostáva k praktikovi** a rádiológovia za účasť nedostanú nič (kód má cenu **0 EUR**) [OECD25, s. 22; MID26, s. 86, 132, 222] [V].
11. **Prežitie (CONCORD-3, diagnóza 2010–2014, 5-ročné čisté):** EE **pankreas 10,2 %** (ČR 6,1 %), **pľúca 16,9 %** (ČR 10,6 %), **hrubé črevo 58,4 %** (ČR 56,1 %), konečník 54,8 % (ČR 52,3 %), prsník 76,6 % (ČR 81,4 %) [C3, Tab. 5] [V]. Pozor: estónske dáta v CONCORD-3 pokrývajú len diagnózy **2000–2012** [C3, Tab. 2] [V]. Novšie národné čísla (2019–2023): pankreas **7 %**, pľúca **23 %**, hrubé črevo **63 %** [TAI26, Tab. 10] [V].
12. **Čo si z toho vziať [odhad]:** Estónsko dokazuje, že **digitálne koľajnice nestačia**. Chýba „vrstva zodpovednosti“: kto drží hodinky, kto meria lehoty, kto vráti výsledok praktikovi. Presne tú medzeru rieši naša výzva. Estónsko je vzor pre **dátovú infraštruktúru**, nie pre **riadenie cesty pacienta**.

---

## 1. Digitálna infraštruktúra (v čom je Estónsko naozaj najďalej)

### 1.1 Národný zdravotný informačný systém (TIS, „Digilugu“)
- **Od 1. 9. 2008**, vlastní ho Ministerstvo sociálnych vecí, prevádzkuje **TEHIK** (štátne IT centrum pre zdravotníctvo) [TEHIK; EC14, 2014, s. iii] [V].
- **Jedna národná databáza** dokumentov všetkých pacientov od všetkých poskytovateľov. Nemocnice si popri tom vedú vlastné systémy a do TIS posielajú „dôležité“ dokumenty [EC14, 2014, s. iii; NAO25, s. 9] [V].
- **Povinnosť:** poskytovateľ **musí** posielať do TIS **28 druhov dokumentov** (stav marec 2024): epikrízy (zhrnutia liečby), žiadanky a odpovede na ne, výsledky vyšetrení, potvrdenia, záznamy záchranky, zubárske karty, očkovanie, lieky, úmrtia [NAO25, s. 9, bod 4–5] [V]. Právny základ: nariadenie ministra č. 56 z 18. 9. 2008 a nariadenie č. 53 (o dátových súboroch TIS) [NAO25, poznámky 1–2] [V].
- **Objem 2024:** **14 mil. dokumentov**: ambulantné epikrízy **46 %**, odpovede na žiadanky **14 %**, zubárske karty **13 %**. Poslali ich praktici **5,5 mil.**, nemocnice **4,6 mil.**, ambulantní špecialisti **1,5 mil.** V 2024 bolo ~**15 mil. návštev** (≈ 11 na obyvateľa) [NAO25, s. 9; NAO25-sl] [V].
- **Súhlas:** pri liečbe **netreba**. Pacient môže zakázať prístup k všetkým alebo vybraným záznamom (opt-out) [EC14, 2014, s. iv] [V].
- **Kto vidí:** každý zdravotník s licenciou, len na účel liečby, ak pacient nezakázal; **každý prístup sa loguje a pacient log vidí** [EC14, 2014, s. iv; TEHIK] [V].
- **Pre zdravotníkov:** „Tervisejuhtimise töölaud“ (Health Specialist Portal): na jednom mieste laboratórne výsledky, diagnózy, výkony, lieky; vidí sa len to, čo pacient nezakázal [TK-TJT, 2026] [V].
- OECD 2025: TIS obsahuje aj **genómové dáta pre 20 % dospelých** [OECD25, Box 2, s. 22] [V].
- **Rámec ďalšieho vývoja:** stratégia e-zdravia **2025–2030** [SoM24, 2024] [V]; OECD píše, že „revízia infraštruktúry zdravotných informácií prebieha“, aby sa dali počítať čakacie doby [OECD25, s. 16] [V]. Konkrétny stav „novej generácie TIS“ v 2026 som nepreveril [?].

### 1.2 Pacientsky portál (terviseportaal.ee)
- Nový portál nahradil starý digilugu.ee v **decembri 2023** (vývoj **1,24 mil. EUR**, spolufinancované z EÚ) [TK-portal-news, 13. 12. 2023] [V].
- Pacient vidí návštevy, vyšetrenia, recepty, očkovanie, hospitalizácie, operácie; vyplní zdravotné vyhlásenie; od 2024–2025 je v ňom aj **národná rezervácia termínov (digiregistratuur)** [TK-portal-news, 2023] [V]; [ERR-digireg, 2025] [S].
- **Používanie:** v 2023 vyše **7,7 mil. prihlásení** do starého portálu (≈ 5 na obyvateľa ročne); do 31. 3. 2024 vyše **2,7 mil.** prihlásení do nového; priemerne **900 000 prihlásení mesačne**; aspoň **2/3 používateľov z mobilu** [TK-portal, aktualizované 7. 11. 2025] [V].
- **Eurostat:** svoj zdravotný záznam online si otvorilo **59 %** ľudí (16–74 r.) v EE vs **24 %** priemer EÚ (2022) [EUROSTAT, 2022] [V].

### 1.3 Obrázky (CT, MR, RTG)
- **Pildipank** = národný spoločný archív snímok, založený **2006** nemocnicami v Tartu a Tallinne. Podľa dodávateľa (Agfa, 15. 6. 2026): ~**2,5 mil. vyšetrení ročne**, rast ~10 % ročne, „všetky zdravotnícke zariadenia v jednom prostredí“ [AGFA26, 2026] [S] (firemný zdroj; nezávislé číslo o pokrytí som nenašiel [?]).
- **Objednávanie** rádiologických a nukleárnych vyšetrení: **vo všetkých nemocniciach elektronicky cez e-žiadanky** [MID26, s. 86] [V].
- **Problémy 2026:** chýba **jednotný národný chorobopis a rezervačný systém**, takže každé zlepšenie v rádiológii sa musí programovať **paralelne v niekoľkých nemocničných systémoch** [MID26, s. 80] [V]. Ak vyšetrenie z menšej nemocnice nemá dosť kvality na určenie štádia, **v centre sa opakuje** [MID26, s. 86] [V]. **Digitálna podpora rozhodovania pri objednávaní vyšetrení v EE neexistuje**; beží pilot e-konzultácie rádiológa [MID26, s. 86] [V].
- Pripravuje sa zmena nariadenia, aby si pacient mohol **sám rezervovať rádiologické vyšetrenie** (začína sa ultrazvukom) cez národnú rezerváciu; preto žiadanka dostáva dobu platnosti [S: návrh nariadenia, zrkadlo verejného registra dokumentov] [?].

### 1.4 E-konzultácia (praktik ↔ špecialista cez TIS)
- **Ako to funguje:** praktik pošle štruktúrovanú e-žiadanku s konkrétnou otázkou, anamnézou, výsledkami a liekmi. Špecialista **odpovie** a zvolí typ odpovede: len rada bez návštevy, **príjem do 7 dní**, príjem o **8–42 dní**, príjem **po viac ako 42 dňoch**, nevhodná žiadanka atď. [EHIF-ek, 2023] [V].
- **Platba:** kód **3039**, cena **27,46 EUR** (2023); základ sú dohody Spolku praktikov s odbornými spoločnosťami, v apríli 2023 pre **31 služieb** [EHIF-ek, 20. 4. 2023] [V].
- **Počty (vždy 1. štvrťrok):** 2022 **14 012** · 2023 **22 487** · 2024 **26 742** · 2025 **34 926** · 2026 **43 384** (+24 % v tabuľke; text tej istej správy uvádza „približne +11 %“, nezhoda v zdroji [?]) [TK-Q1, 2026, s. 6, 12] [V].
- Pre porovnanie: v 1. štvrťroku 2026 bolo **891 119** ambulantných návštev u špecialistov [TK-Q1, s. 6] [V], čiže e-konzultácií bolo zhruba **5 %** z tohto počtu [náš výpočet; nie je to podiel odoslaní].
- **Podiel na odoslaniach (starší údaj):** v 2019 praktici odoslali cez e-konzultáciu ~**16 %** pacientov; „digitálne a papierové žiadanky“ ~**40 %** (formulácia v správe je nejednoznačná) [NAO21, bod 89] [V]. Novší podiel papierových vs. elektronických žiadaniek som v primárnom zdroji nenašiel [?].
- Asi **40–43 %** e-konzultácií špecialista vybaví **bez pozvania pacienta** (údaj nemocníc) [S: dokument Spolku praktikov cez vyhľadávač] [?].
- **Kam to smeruje:** Tervisekassa spolu s ministerstvom pracuje na tom, aby e-konzultácia bola **zo zákona povinná**; väčšie nemocnice majú už v 2026 v **8 odboroch** prijímať viac pacientov cez e-konzultáciu [TK-Q1, s. 12] [V]. Návrh zákona (zmena zákona o zdravotnom poistení a zákona o organizácii zdravotných služieb, v parlamente ako **922 SE**, vláda ho predložila 18. 5. 2026): vláda by určila odbory, kde je e-konzultácia **podmienkou** odoslania; plánovaná účinnosť **1. 1. 2027**; Estónska lekárska komora povinnosť odmieta [922SE] [S]. Či bol schválený, neviem [?].
- **Pre onkológiu:** v pľúcnom pilote je e-konzultácia praktika **s konkrétnou diagnózou podozrenia na rakovinu** „indexová udalosť“ (štart hodín) a hlavný kanál odoslania. „**Momentálne nie je možné poslať e-konzultáciu priamo onkologickej sestre**“ [MID26, s. 66, 75] [V].
- Cieľ plánu: **90–95 %** pacientov s podozrením odoslaných do centra cez e-konzultáciu; stav 2026 „–“ (nemerané) [MID26, Tab. 5, s. 71] [V].

### 1.5 X-Road (X-tee), výmenná vrstva
- Je to štátna „dátová diaľnica“ medzi registrami a systémami. V zdravotníctve napr. **register rakoviny dostáva dáta z TIS dopytmi cez X-tee** [MID26, s. 217] [V].
- **Čísla o prevádzke:** oficiálna stránka x-tee.ee uvádza 1 500 organizácií, 1 300 služieb, ~600 mil. dopytov za rok, ale **bez dátumu** (údaje vyzerajú staré) [XTEE] [?]. Novšie čísla sú len z firemnej analýzy (Nortal, pomoc AI) [S]. Pre našu výzvu to nie je podstatné: X-Road je „potrubie“, problém v onkológii je **čo a kedy sa doň pošle** (§4).

### 1.6 Čo som NEoveril [?]
- Aktuálny podiel papierových žiadaniek (2024–2026).
- „99 % zdravotných dát je digitálnych“ (prezentácia HOPE 2025, slabý zdroj).
- Presný text zákona o povinnosti posielať do TIS (opieram sa o NKÚ 2025 a správu pre EK 2014).
- Stav novej generácie TIS.

---

## 2. Program štandardizovanej cesty

### 2.1 Plán boja proti rakovine 2021–2030 (Vähitõrje tegevuskava)
- Schválil minister **30. 4. 2021**, pripravilo ministerstvo + Národný ústav zdravotného rozvoja (TAI), **viac než 100 expertov** [NAO21, bod 108–109] [V].
- **215 aktivít** v 15 oblastiach; 3 ciele: menej nových rakovín, dlhší a lepší život po diagnóze, lepšia kvalita života [MID26, s. 243; SM-plan] [V]. Cieľ pre prežitie: **úroveň severských krajín** [TAI26, s. 47] [V].
- **Nie je to zákon.** Lehoty „zostali odporúčacie, nie záväznou požiadavkou kvality“; nie sú viazané na hodnotenie kvality, výkazníctvo ani financovanie [MID26, s. 67] [V].
- **Polčas (hodnotenie apríl 2026):** splnené **27 aktivít (13 %)**, čiastočne **88 (41 %)**, nesplnené **96 (45 %)**, 4 (2 %) inak [MID26, s. 243] [V].

### 2.2 Cieľové lehoty (každý ukazovateľ: u 90–95 % pacientov, ak nie je uvedené inak)
| Krok | Cieľ | Stav začiatkom 2026 |
|---|---|---|
| Odoslanie s podozrením **cez e-konzultáciu** | 90–95 % pacientov | „–“ |
| Podozrenie → onkologické centrum | **≤ 14 dní** | „–“ |
| Vyšetrenia na potvrdenie diagnózy | **≤ 21 dní** | „–“ |
| Rádiológia na určenie rozsahu urobená a popísaná do 2 týždňov od 1. návštevy špecialistu | ≥ 60 % (2023), ≥ 75 % (2027) | „–“ |
| Plán liečby z **MDT** | **≥ 95 %** pacientov | „–“ |
| Konzílium → 1. liečba | **≤ 28 dní** | „–“ |
| Príchod do centra → liečba | **≤ 49 dní** | „–“ |
| **Podozrenie → 1. liečba** | **≤ 63 dní** | „–“ |
| Výsledok patológie (biopsia / operačný materiál) | 10 / 20 dní, ≥ 80 % prípadov | „–“ |
Zdroj: [MID26, Tab. 5, s. 71] [V]. Lehoty potvrdzuje aj [NAO21, body 70–71, 99] [V]. „–“ = hodnotitelia nemali merané dáta.
- Starší cieľ (2011): kuratívne ožarovanie do **28 dní** od diagnózy; systematická analýza čakacích dôb sa nikdy neurobila [OECD25, s. 16] [V].
- Všeobecný limit poisťovne na ambulantného špecialistu: **42 dní**, bez osobitnej výnimky pre rakovinu [NAO21, bod 112; EHIF-wait] [V].

### 2.3 Čo sa reálne spúšťa: pľúcny pilot
- **Zrýchľovací program poisťovne (2024):** 6 projektov (pľúca, srdcové zlyhanie, infarkt, duševné zdravie, demencia, detské zuby), tímy mali 5 mesiacov. Ďalej išli 3; **pľúcna cesta prvá**, lebo „nepotrebuje veľký IT vývoj“. Podobný program poisťovňa „v blízkej dobe neplánuje“ [EHIF-acc, 3. 3. 2025] [V].
- **Obsah pilotu (podľa hodnotenia 2026)** [MID26, s. 66–76] [V]:
  - **kritériá podozrenia** (tzv. A- a B-príznaky), **kontrolný zoznam** pre praktika (hotový len pre pľúca);
  - **jasná indexová udalosť** = e-konzultácia praktika s konkrétnou diagnózou podozrenia;
  - centrum pacienta „zaeviduje“ podľa tejto udalosti a riadi ďalšiu diagnostiku;
  - **prvýkrát sa štruktúrovane zbierajú dáta** od indexovej udalosti po liečbu (vrátane toho, koľkí prišli cez pohotovosť).
- **Podľa regionálnych novín (25. 5. 2026)** [LUNG, 2026] [S]:
  - štart **26. 5. 2026**, trvanie **do konca 2027**; celé spádové územie Tartuskej univerzitnej nemocnice (juh a východ Estónska, Saaremaa) vrátane všetkých praktikov a menších nemocníc;
  - **dnes:** od podozrenia po diagnózu a liečbu **3–4 mesiace**;
  - **cieľ:** podozrenie → centrum **≤ 2 týždne**, diagnostika **≤ 3 týždne**, po konzíliu liečba **≤ 4 týždne**; spolu ~2 mesiace;
  - **onkologická sestra = „vedúca cesty“ a hlavný kontakt pacienta**, už v období podozrenia;
  - každý pacient dostane prehabilitáciu (fyzioterapia, odvykanie od fajčenia, zubár); školenie v oznamovaní zlej správy (SPIKES);
  - financuje Tervisekassa (rozhodnutie koncom 2025, suma [?]); ~**800** nových rakovín pľúc ročne v EE.
- **Návrhy na ďalší krok (hodnotenie 2026)** [MID26, s. 72] [V]:
  - **doplnok (plugin) do softvéru praktika**, ktorý z kontrolného zoznamu sám vyplní štandardizovanú e-konzultáciu a pošle ju ako **„rýchlu žiadanku“**, aby praktik nemusel tú istú informáciu písať viackrát;
  - **„fast-track“ pracovný postup**: kto a v akej lehote rýchlu žiadanku prijme a dovedie pacienta k vyšetreniu;
  - **koordinačná rola** (sestra-koordinátorka / case manager / „vedúci cesty“), ktorá sleduje pohyb odoslaní, analyzuje oneskorenia a zodpovedá za lehoty;
  - **„alarmový systém“** pre podozrivé nálezy, ktorý pacienta automaticky a zdokumentovane zaradí na rýchlu cestu, aby sa prípady „nestrácali“ medzi etapami [MID26, s. 71–72] [V];
  - **právna istota, že účastníci cesty smú vidieť dáta pacienta** [MID26, s. 72] [V].
- **Problém roztrieštenosti:** pľúcny pilot, vnútorné projekty nemocníc a iniciatívy siete ESTCAN bežali paralelne, praktici často nevedeli, ktorý projekt a aké kritériá práve platia [MID26, s. 67] [V].
- **Pankreas:** žiadnu špecifickú cestu ani lehoty pre pankreas som nenašiel [?]. Ďalšie nádory majú nasledovať po pľúcach [MID26, s. 71] [V].

### 2.4 Sieť centier a čísla krajiny
- Plnú liečbu dospelých (chirurgia, systémová, ožarovanie) robia **3 centrá**: TÜK (Tartu), PERH (Tallinn), ITK (Tallinn); menšie nemocnice dávajú systémovú liečbu pod dohľadom centier [MID26, s. 12; OECD25, s. 22] [V].
- **ESTCAN** (sieť) vznikla **2024**, cieľ: akreditácia ako „comprehensive cancer centre“ [SoM24; SM-plan] [V].
- **9 835** nových rakovín v 2023 [TAI26, s. 5] [V]; obyvateľov ~**1,32 mil.** [C3, Tab. 3] [V].

---

## 3. Koordinátor

- **Zákonná povinnosť:** nenašiel som [?]. Hodnotenie 2026 žiada zákon upresniť: **úlohu koordinátorov a ich prístup k zdravotným dátam** [MID26, s. 204] [V], a sestry dnes **nemajú právomoc** rozhodovať o pokračovaní/odložení liečby [MID26, s. 124] [V].
- **Čo existuje:** „centrá zaviedli roly sestier-koordinátoriek, aby mal pacient **jednu kontaktnú osobu** počas celej starostlivosti“ [OECD25, s. 21] [V]. V niektorých nemocniciach sú sestry-poradkyne **pre jednu modalitu** (napr. chemoterapia, ožarovanie), ale **nepokrývajú celú cestu ani viac nemocníc** [MID26, s. 212] [V].
- **Čo chýba (hodnotenie 2026)** [V]:
  - „Rola a úlohy koordinátora sú **v nemocniciach nerovnaké a celoštátny systém chýba**“ [MID26, s. 203].
  - **Chýba sestra-koordinátorka naprieč pracoviskami** (cesta začne v ITK, pokračuje v PERH, vráti sa do ITK). Piloty (napr. prostata) mali veľkú hodnotu, **ale pre nedostatok peňazí sa nepokračovalo** [MID26, s. 201, 212].
  - **Výcvik neexistuje**; plán: požiadať o zaradenie služby do **sadzobníka poisťovne (TTL)**. Stav: „**nezavedené**“ [MID26, s. 212].
  - Odhad pracovnej skupiny: **2–3 koordinátori klinických štúdií na centrum** a **~12 sestier-koordinátoriek pre cestu pacienta** celkovo [MID26, s. 124] [V] (odhad, nie fakt).
  - Navrhujú aj **koordinátora konzílií** ako nové pracovné miesto v PERH, TÜK aj v menších nemocniciach [MID26, s. 170] [V].
- **Kto nesie zodpovednosť za lehoty? Nikto.** „Ani praktik, ani špecialista, ani centrum nemá priamu zodpovednosť ani stimul zabezpečiť, aby pacient postupoval v lehotách“ [MID26, s. 67] [V].
- **Prvý financovaný „majiteľ hodiniek“:** onkologická sestra v pľúcnom pilote Tartu (2026–2027) [LUNG, 2026] [S]; [MID26, s. 72] [V].
- **Poznámka k porovnaniu s ČR [odhad]:** ČR od 1/2026 povinne min. 1 úväzok koordinátora na KOC a platbu 250 Kč/deň (podľa zadania) má v tomto bode **pevnejší rámec než Estónsko**, ktoré koordinátora neplatí ako službu.

---

## 4. Tok informácií: čo ide elektronicky a kde sa to láme

### 4.1 Kanály
| Čo | Ako v Estónsku | Zdroj |
|---|---|---|
| Žiadanka praktik → špecialista | e-žiadanka cez TIS alebo **e-konzultácia** (platená, odpoveď môže rovno určiť termín) | [EHIF-ek; NAO21] [V] |
| Objednanie CT/MR/RTG | **všetky nemocnice elektronicky** (e-žiadanka) | [MID26, s. 86] [V] |
| Snímky | národný archív **Pildipank** | [AGFA26] [S] |
| Epikríza, výsledky | **povinne do TIS**; vidí ich každý licencovaný zdravotník aj pacient, ak pacient nezakázal | [NAO25; EC14] [V] |
| Patológia | výsledok niekedy len **vnútri epikrízy**, nie ako samostatná odpoveď | [MID26, s. 98] [V] |
| Hlásenie do registra rakoviny | v 2021 ešte **papier alebo šifrovaný e-mail**, ručne prepisované [NAO21, bod 124]; v 2026 register beží elektronicky, dáta idú **z TIS cez X-tee** [MID26, s. 217] | [V] |
| Výsledok MDT → praktik | **systematicky sa neposiela**; je v zozname „treba zaviesť“ | [MID26, s. 222] [V] |
| Pacient | portál terviseportaal.ee (dáta + log prístupov + rezervácie), aplikácia KAIKO na hlásenie príznakov počas liečby | [TK-portal; OECD25, s. 21] [V] |

### 4.2 Kde sa to láme (primárne zdroje)

**A) Audit NKÚ z 5. 12. 2025 o kvalite zdravotných dát (obdobie 2020–2025)** [NAO25] [V]:
- **Neskoré epikrízy:** v 1. štvrťroku 2025 prišlo do 5 pracovných dní **98 %** nemocničných epikríz a do 1 pracovného dňa **90 %** ambulantných; aj tak to bolo **vyše 152 000 neskorých epikríz** za 3 mesiace. Jedna prišla až **311 dní** po skončení liečby. Lehota navyše beží až od „podpísania“ dokumentu, a ~**14 %** nemocničných epikríz čakalo na podpis viac ako 10 pracovných dní [NAO25, s. 12–14, Tab. 2] [V].
- **Nikto nič neposlal:** z ~**2 100** poskytovateľov s licenciou **asi tretina neposlala v 2024 ani jeden dokument** (rozšírený omyl: „platené služby sa do TIS posielať nemusia“) [NAO25, s. 14] [V]. Takmer polovica opýtaných poskytovateľov uviedla, že kolegovia posielajú epikrízy neskoro alebo vôbec; lekárska komora: „týždenný problém“ [NAO25, s. 14] [V].
- **Zastaraný formát:** **79 % epikríz** v 2024 prišlo v starom formáte s menej poľami; starý formát má **28 automatických kontrol**, nový **146**; o ~**22 %** dokumentov v TIS nie je žiadna informácia o kvalite; TEHIK **nemá právo** prinútiť nemocnice prejsť na nový formát [NAO25, s. 2; NAO25-sl] [V].
- **Dokumentová logika z papierovej éry:** TIS pracuje s „hotovými dokumentmi“, nie s priebežne aktualizovanými údajmi; na zmenu jedného poľa treba poslať celý dokument znova; **nie je dohoda o SNOMED-CT ani MKCH-11** [NAO25-sl] [V].
- **Roztrieštené IT:** poskytovatelia používajú **vyše 30 rôznych informačných systémov** [NAO25-sl] [V].
- **Platí sa skôr, než prídu papiere:** poisťovňa zaplatí účet **predtým**, ako dokument dorazí do TIS; **automatické prepojenie účtu a epikrízy neexistuje**; obsahové kontroly pokrývajú len ~**1,4 %** účtov [NAO25-sl] [V]. Odporúčanie NKÚ: platiť len vtedy, keď je v TIS riadny dokument, a prejsť na **modulárny celoštátny systém** pre poskytovateľov [NAO25-sl] [V].
- **Príklad z onkológie (Prípad 1 v audite):** pacienta s rozbehnutou liečbou rakoviny priviezli s mozgovou príhodou na pohotovosť; lekári podľa záznamu „rakovina“ predpokladali zlú prognózu a **nepodali trombolýzu**. Keď pacient neprišiel na ožarovanie, onkológ ho začal hľadať, videl v systéme záznam z pohotovosti a zavolal tam: rakovina bola v začiatočnom štádiu, trombolýza bola indikovaná. Pacient sa zotavil [NAO25, s. 10] [V].

**B) Onkológia (NKÚ 2021 a hodnotenie 2026)** [V]:
- Epikrízy o onkologickej liečbe prichádzajú do TIS **neskoro** a často v nich chýba to, čo praktik potrebuje; praktik sa nemusí dozvedieť, že pacientovi špecialista diagnostikoval rakovinu [NAO21, body 91–92].
- Lekári opakovane **nevedia nájsť výsledok patológie**, lebo nemocnica ho poslala len vnútri epikrízy, liečba ešte nebola uzavretá, takže dokument nie je v portáli, **a pacient už je na konzíliu v inej nemocnici** [MID26, s. 98].
- **Údaje netečú plynule po krajine, cestu nemožno sledovať ako celok**, chýba politické rozhodnutie zjednotiť nemocničné systémy [MID26, s. 107].
- Po liečbe: „**tok informácií závisí od epikríz a od toho, čo prinesie sám pacient**“; systém medzi praktikom a špecialistom pre sledovanie po liečbe je „**nezavedený**“ [MID26, s. 215].
- Citát zástupcu pacientov: pacienti „veľmi často zažívajú, že informácia **neprejde k praktikovi** alebo **od praktika k špecialistom**“ [MID26, s. 200].
- **OECD 2025:** pre medzery v dátach sa **priemerná čakacia doba nedá vypočítať** [OECD25, s. 16].
- **Register:** podľa plánu sa ~**20 %** prípadov rakoviny nenahlási do registra včas; štatistika vychádza s ~**2-ročným** oneskorením; nový štatút registra **nedovoľuje celoštátny zber klinických dát** [MID26, s. 217, 222].
- **MEDOC:** nemocnice sa dohodli na minimálnom súbore **~40 údajov** o pacientovi s rakovinou (diagnóza, dátum diagnózy, dátum konzília, začiatok liečby…), ale **technické prepojenie systémov je ešte vo vývoji** [MID26, s. 67, 76].

### 4.3 Čo funguje dobre
- **Predvolené zdieľanie** pri liečbe bez súhlasu + opt-out + **log prístupov pre pacienta** [EC14] [V].
- **Rýchlosť väčšiny dokumentov:** 90 % ambulantných epikríz je v TIS do 1 pracovného dňa [NAO25, Tab. 2] [V].
- **Jednotné číselníky** vyvinuté ako súčasť TIS [EC14, s. iii] [V].
- **Objednávanie zobrazovania** vo všetkých nemocniciach elektronické [MID26, s. 86] [V].
- E-konzultácia rastie a štát ju chce urobiť povinnou [TK-Q1, 2026] [V].

---

## 5. Lehoty a ich plnenie (čísla)

### 5.1 Audit NKÚ (Riigikontroll), 6. 12. 2021
Vzorka: **399 pacientov** s prvou diagnózou v **2019** (pľúca 100, hrubé črevo 99, krčok 100, prsník 100), posudzovali onkológovia na základe dát v TIS [NAO21, bod 72] [V].

**Priemer dní od 1. návštevy po 1. liečbu (cieľ ≤ 63)** [NAO21, Tab. 2, s. 23] [V]:
| Prsník | Krčok maternice | Pľúca | Hrubé črevo |
|---|---|---|---|
| **52** | **101** | **92** | **122** |

**Vnútri centra (priemer dní)** [NAO21, Tab. 5, s. 28] [V]:
| Krok | Cieľ | Prsník | Krčok | Pľúca | Hrubé črevo |
|---|---|---|---|---|---|
| Návšteva onkológa → MDT | ≤ 21 | 8 | 20 | **36** | 15 |
| MDT → 1. liečba | ≤ 28 | 11 | 24 | 17 | 17 |
| Spolu v centre | ≤ 49 | 19 | 44 | **53** | 32 |
Vnútri centra sa lehoty viac-menej plnili (pľúca o 4 dni nad); **čas sa stráca hlavne pred centrom** (praktik → špecialista → centrum) [NAO21, bod 100] [V].

**Podiel pacientov včas (expertné hodnotenie)** [NAO21, body 74–75, 87, 101] [V]:
- u praktika včas **76 %**, u špecialistu **87 %**, u onkológa **61 %**, MDT včas ~**74 %**, liečba začala včas **65 %**;
- **do centra do 14 dní:** hrubé črevo **37 %**, pľúca **37 %**, krčok **35 %**, prsník **58 %**;
- 24 % pacientov s rakovinou hrubého čreva nemalo včasnú starostlivosť u praktika; liečba hrubého čreva meškala u 13 %, pľúc u 10 %.
- Dlhé čakanie na vyšetrenia (PET-CT pri pľúcach do **90 dní**, kolonoskopia až **55 dní** od praktika) [NAO21, body 87, 95] [V].

### 5.2 Čakacie listy (stav 2021)
- Medián čakania na prvú návštevu onkológa, jún 2021: **6 / 25 / 17 dní** (ITK / PERH / TÜK) [NAO21, bod 113] [V].
- **PERH** rezervuje 2 termíny pre nových pacientov s podozrením; nevyužitý termín uvoľní 2 dni vopred [NAO21, bod 118] [V].
- NKÚ: z dát sa **nedá povedať**, koľkí čakali dlhšie ako 14 alebo 42 dní [NAO21, bod 120] [V].
- **Neuspokojená potreba lekárskej starostlivosti 2023:** EE **13 %** (najviac v EÚ) vs EÚ **2 %**; > 90 % z nich uvádza čakanie [OECD25, s. 16] [V].

### 5.3 Hodnotenie 2026
- Všetky časové ukazovateľy plánu: „–“ (nemerané) [MID26, Tab. 5] [V].
- Operácia: cieľ ≤ 28 dní od rozhodnutia, skutočnosť v mnohých centrách **6–7 týždňov** [MID26, kap. chirurgia] [V].
- Ožarovanie: **žiadne centrálne sledovanie ani verejné čakacie listy**; audity ukazujú prekračovanie; v 2020 **6 urýchľovačov** pri potrebe **≥ 9** [MID26, s. 132] [V].
- Pľúca (pilot): dnes **3–4 mesiace** od podozrenia po diagnózu a liečbu [LUNG, 2026] [S].

### 5.4 Pankreas
- **Žiadne dáta o lehotách pre pankreas** som nenašiel [?]; vzorka NKÚ ho neobsahovala.
- NKÚ cituje štúdiu, že pri skorom karcinóme pankreasu (aj prsníka, pľúc, obličky) **každý týždeň oneskorenia liečby zvyšuje úmrtnosť o 1,2–3,2 %** [NAO21, s. 2] [V] (americká štúdia, 2019).
- Štádium pri diagnóze (2023): vzdialené metastázy pri pankrease **39 %** (muži) / **43 %** (ženy) [TAI26, s. 5] [V].

---

## 6. MDT (konzílium)

- **OECD 2025:** konzíliá sú „bežnou súčasťou“ onkologickej starostlivosti a **platí ich poisťovňa**, „no prax sa líši pre nedostatok konkrétnych pokynov“ [OECD25, s. 22] [V].
- **Podľa odporúčaní má pacient vždy prejsť konzíliom pred liečbou**; audit zistil, že to **nebolo vždy** a ministerstvo o tom vie [NAO21, bod 103] [V]. Včas pri ~**74 %** pacientov [NAO21, bod 74] [V].
- **Cieľ:** ≥ 95 % pacientov s plánom z MDT; stav 2026 „–“ [MID26, Tab. 5] [V].
- **Hodnotenie 2026** [V]: konzíliá sa **nekonajú konzistentne pri všetkých lokalitách**, audity sú zriedkavé [MID26, s. 132]; rádiológovia sa zúčastňujú denne, ale kód ich konzultácie má cenu **0 EUR** [MID26, s. 86]; odporúčajú **automatickú kontrolu poisťovne, či sa konzílium konalo** a **koordinátora konzílií** [MID26, s. 170].
- **Výsledok MDT k praktikovi:** „odovzdávanie rozhodnutí konzília rôznym účastníkom cesty (vrátane praktika)“ je v zozname vecí, ktoré treba **zaviesť** [MID26, s. 222] [V].

---

## 7. Výsledky (prežitie)

### 7.1 Národný register (TAI), diagnóza 2019–2023, vydané 2026 [V]
Relatívne 5-ročné prežitie, všetky vekové skupiny [TAI26, Tab. 10, s. 48]:
| Nádor | Spolu | Muži | Ženy |
|---|---|---|---|
| Všetky okrem nemelanómovej kože | **60 %** | 59 | 61 |
| **Pankreas** | **7 %** | 7 | 7 |
| **Pľúca** | **23 %** | 19 | 32 |
| **Hrubé črevo** | **63 %** | 62 | 63 |
| **Konečník** | **63 %** | 62 | 64 |
| Prsník (ženy) | 84 % | – | 84 |
- **Vekovo štandardizované, muži/ženy, EE vs Fínsko vs Dánsko** [TAI26, Tab. 12, s. 52] [V]: pankreas **10/12** vs 11/14 vs 14/15; pľúca **19/36** vs 17/29 vs 27/35; hrubé črevo **64/66** vs 67/71 vs 72/73; konečník **64/67** vs 70/74 vs 72/75. Register: pri pankrease a pľúcach je EE „porovnateľné so severskými krajinami“, najväčšie medzery sú pri **hrubom čreve, konečníku, prsníku, melanóme, hlave/krku a NHL** [TAI26, s. 47] [V].
- **Trend:** pľúca **+8 p. b.** (2009–13 → 2019–23) [TAI26, s. 47] [V]; všetky nádory bez kože **54 % → 58 %** (2007–11 → 2017–21) [OECD25, s. 20] [V].

### 7.2 CONCORD-3 (Allemani a kol., Lancet 2018), 5-ročné čisté prežitie, vekovo štandardizované [V]
Zdroj: [C3, Tab. 5]. V zátvorke 95 % interval spoľahlivosti.
| Nádor | **EE 2010–14** | **ČR 2010–14** | Nórsko | Dánsko | Fínsko |
|---|---|---|---|---|---|
| **Pankreas** | **10,2 %** (7,0–13,4) | 6,1 % (5,4–6,7) | 9,5 % | 8,0 % | 7,4 % |
| **Pľúca** | **16,9 %** (14,9–19,0) | 10,6 % (10,2–11,1) | 19,0 % | 16,6 % | 13,0 % |
| **Hrubé črevo** | **58,4 %** (55,2–61,6) | 56,1 % (55,4–56,9) | 66,7 % | 61,6 % | 64,9 % |
| Konečník | 54,8 % (50,1–59,5) | 52,3 % | 69,2 % | 64,8 % | 64,4 % |
| Prsník (ženy) | 76,6 % (73,8–79,3) | 81,4 % | 87,7 % | 86,1 % | 88,5 % |
- **Trend EE (2000–04 → 2005–09 → 2010–14):** pankreas 4,8 → 5,4 → **10,2 %**; pľúca 10,8 → 14,3 → **16,9 %**; hrubé črevo 48,9 → 53,8 → **58,4 %** [C3, Tab. 5] [V].
- **Pozor na kvalitu dát:** Estónsko dodalo do CONCORD-3 diagnózy len za **2000–2012** (nie do 2014); populácia 1 316 203, 100 % pokrytie; 59 848 pacientov; pankreas 2 698 prípadov za celé obdobie [C3, Tab. 2–3] [V]. Pankreas EE má **široký interval (7–13 %)** pre malý počet prípadov, takže „EE lepšie ako Dánsko“ **netreba preceňovať** [odhad].
- **Rozpor s národným registrom:** CONCORD-3 pankreas 10,2 % (2010–12) vs register 7 % (2019–23, iná metóda: relatívne nevážené, iné obdobie) [odhad: nejde o pokles, ale o rozdielnu metodiku a neistotu].
- **ICBP SURVMARK-2** (Lancet Oncol 2019) Estónsko **neobsahuje** (len AUS, CAN, DK, IRL, NZ, NOR, UK) [ICBP] [V podľa raw-krajina-no.md].
- **EUROCARE-6:** publikované výsledky prežitia dospelých podľa krajín pre EE som nenašiel (k dispozícii detské, Lancet Oncol 2022) [?].

### 7.3 OECD/EK, Country Cancer Profile 2025 (porovnanie s ČR a EÚ) [V-graf]
| Ukazovateľ | **EE** | **ČR** | **EÚ** |
|---|---|---|---|
| Úmrtnosť na rakovinu (na 100 000, štand.) | **266** | 257 | 235 |
| Úmrtnosť, hrubé črevo + konečník | 34 | 32 | 27 |
| Úmrtnosť, pľúca | 44 | 45 | 47 |
| Lekári na 1 000 nových rakovín | **591** | 737 | 679 |
| Sestry na 1 000 nových rakovín | **1 121** | 1 549 | 1 376 |
| Skríning prsník / hrubé črevo | 63 % / 55 % | 60 % / 29 % | 56 % / 42 % |
Zdroje: [CAPTR-EE; CAPTR-CZ, 2025] [V-graf]. Hodnoty prežitia v CaPTr (pľúca 17 % vs 11 %, hrubé črevo 58 % vs 56 %) sú tie isté čísla CONCORD-3 (§7.2).
- Rozdiel v úmrtnosti medzi mužmi a ženami je v EE **medzi najväčšími v EÚ** [OECD25, s. 3] [V].
- **Záver pre porovnanie s ČR:** EE má **lepšie prežitie pri pľúcach a pankrease, podobné pri hrubom čreve, horšie pri prsníku**, a vyššiu celkovú úmrtnosť (súvisí s fajčením, alkoholom, mužmi). **Estónsko nie je víťaz v prežití** (to sú severské krajiny) [C3; CAPTR] [V]; [odhad pre interpretáciu].

### 7.4 Skríning (stručne)
- Prsník (2004), krčok (2006), hrubé črevo (2016, FIT test cez praktika) [TAI26, s. 53] [V]. Pokrytie hrubého čreva 2023: **60 %** [OECD25, s. 15] [V].
- Pilot skríningu pľúc (Tartu) cez praktikov a ich sestry: účasť **87 %** oprávnených [OECD25, s. 16] [V]; pokračuje v 2026 (Tartu a Viljandi) [TK-Q1, s. 12] [V].
- Len **< 5 %** nových prípadov sa nájde skríningom, **~95 % prichádza cez príznaky** (citát z workshopu) [MID26, s. 72] [V], preto je cesta od praktika kľúčová.

---

## 8. Financovanie a kapacity (rámec)
- Zdravotné výdavky 2023: **7,5 % HDP** vs EÚ 10,2 % [MID26, s. 12] [V].
- Poisťovňa za onkológiu: **262 mil. EUR (2025)** vs 151 mil. (2020); liečených **55 900** (2025) vs 49 500 (2020) [MID26, s. 12] [V].
- **56 onkológov** (4 na 100 000) [OECD25, s. 17] [V].
- 5 % obyvateľov bolo v 2022 **bez poistenia** [OECD25] [V].

---

## 9. Silné a slabé stránky

**Silné**
1. Jeden národný TIS od 2008, **povinné posielanie 28 druhov dokumentov**, 14 mil. dokumentov/rok [NAO25] [V].
2. **Zdieľanie bez súhlasu pri liečbe + opt-out + log prístupov** viditeľný pre pacienta [EC14] [V].
3. Pacienti portál naozaj používajú (**59 %** vs EÚ 24 %; ~900 000 prihlásení mesačne) [EUROSTAT; TK-portal] [V].
4. **E-konzultácia** praktik → špecialista ako platená služba s typom odpovede („príjem do 7 dní“), rastie (43 384 za Q1 2026) a smeruje k povinnosti [EHIF-ek; TK-Q1] [V].
5. **Číselné národné lehoty** (14/21/28/49/63 dní) a ukazovatele v pláne [MID26] [V].
6. **Pľúcny pilot 2026–27:** indexová udalosť, kontrolný zoznam, sestra „vedúca cesty“, platí poisťovňa [MID26; LUNG] [V/S].
7. Prežitie pri pľúcach (16,9 %) a pankrease (10,2 %) nad ČR a priemerom EÚ (CONCORD-3, 2010–14) [C3] [V].

**Slabé**
1. Lehoty **nemerané, nevynucované, nikto za ne neručí**; v 2026 všade „–“ [MID26] [V].
2. Reálne cesty: pľúca **92 d**, hrubé črevo **122 d** (cieľ 63); do centra do 14 dní len **37 %** [NAO21] [V].
3. Koordinátor **bez celoštátneho systému, výcviku a platby**; piloty končia s grantom [MID26] [V].
4. **Kvalita dát v TIS:** 152 000 neskorých epikríz za štvrťrok, tretina poskytovateľov bez jediného dokumentu, 79 % v starom formáte, > 30 IT systémov [NAO25] [V].
5. **Výsledok MDT a patológie sa nedostane včas k ďalšiemu lekárovi/praktikovi**; sledovanie po liečbe závisí od pacienta [MID26] [V].
6. Len **13 %** aktivít plánu splnených v polčase [MID26] [V].
7. Najvyššia neuspokojená potreba starostlivosti v EÚ (13 %), málo lekárov a sestier na prípad rakoviny [OECD25] [V].

---

## 10. Čo z toho vyplýva pre našu výzvu a hru [odhad, nie fakt]
1. **Koľajnice nestačia.** Estónsko má centrálny systém 18 rokov a stále nevie povedať, koľko dní čakal pacient na centrum. V hre: bez **„majiteľa hodiniek“** (koordinátor) a **merania lehôt** sa nič nezrýchli.
2. **Štart hodín = jedna jasná udalosť.** V EE: e-konzultácia praktika s konkrétnou diagnózou podozrenia. Bez jasného štartu sa nedá merať ani riadiť.
3. **Minimálny dátový súbor (MEDOC, ~40 údajov)** je predpoklad merania; bez neho sa dáta zbierajú ručne.
4. **Neskorý alebo chýbajúci dokument je realita aj v najdigitálnejšej krajine** (152 000 neskorých epikríz za 3 mesiace, tretina poskytovateľov bez dokumentu). Dobrá mechanika do hry: dokument „existuje“, ale **ešte nie je podpísaný/odoslaný**, takže ho ďalší lekár nevidí.
5. **Patológia „zamknutá“ v epikríze** neuzavretej hospitalizácie, kým pacient už sedí na konzíliu v inej nemocnici: konkrétna situácia z estónskeho hodnotenia (MID26, s. 98).
6. **Uzavrieť slučku s praktikom** (výsledok MDT, plán, sledovanie): v EE je to oficiálne nezavedené. Presne cieľ výzvy VZP.
7. **Platba viazaná na dokument** (NKÚ 2025 odporúča platiť až keď je dokument v systéme) je silný a jednoduchý motivačný nástroj, ktorý v EE zatiaľ chýba.
8. **Plugin pre praktika** (kontrolný zoznam → automaticky vyplnená rýchla žiadanka) je presne to, čo Estónci navrhli ako ďalší krok (MID26, s. 72).

---

## 11. Otvorené otázky [?]
- Aktuálny podiel papierových vs. elektronických žiadaniek (posledné číslo 2019).
- Či parlament schválil návrh 922 SE (povinná e-konzultácia od 2027).
- Stav novej generácie TIS a oficiálne štatistiky X-tee 2025–2026.
- Výška financovania pľúcneho pilotu; či už sú prvé merané lehoty.
- Akékoľvek dáta o ceste pri rakovine pankreasu.
- EUROCARE-6 prežitie dospelých pre EE a ČR.
- Rozpor v správe Tervisekassa Q1 2026: e-konzultácie +24 % (tabuľka) vs „približne +11 %“ (text).

---

## 12. Zdroje (URL, rok)

**Primárne / oficiálne (čítané mnou v plnom texte, ak nie je uvedené inak):**
- **[NAO21]** Riigikontroll (Národný kontrolný úrad): *Detection of malignant tumours and referral of a patient to treatment*, 6. 12. 2021: https://www.riigikontroll.ee/sites/default/files/arhivaalid/2539/RKTR_2539_2-1.4_2281_005-1.pdf
- **[NAO25]** Riigikontroll: *Terviseandmete õigsuse, täpsuse ja ajakohasuse tagamine* (správa parlamentu), 5. 12. 2025: https://www.riigikontroll.ee/sites/default/files/documents/2025-12/19886_RKTR_6609_2-1.4_2352_002-1.pdf
- **[NAO25-sl]** Riigikontroll: prezentácia toho istého auditu pre rozpočtový výbor, 10. 12. 2025: https://www.riigikontroll.ee/sites/default/files/documents/2025-12/19893_RKTR_6609_2-1.4_2352_005-2.pdf
- **[MID26]** Causalis + Praxis pre ministerstvo/ESTCAN: *Eesti Vähitõrje tegevuskava 2021–2030 vahehindamine* (hodnotenie polčasu plánu), apríl 2026 (čísla strán = strany PDF): https://www.sm.ee/sites/default/files/documents/2026-04/Eesti%20V%C3%A4hit%C3%B5rje%20tegevuskava%202021%E2%80%932030%20vahehindamine_L%C3%95PPRAPORT_0.pdf
- **[TAI26]** TAI/NIHD: *Cancer in Estonia: incidence 2023, survival 2019–2023*, 2026: https://tai.ee/sites/default/files/2026-07/cancer_in_estonia_2023.pdf
- **[C3]** Allemani C. a kol., *Global surveillance of trends in cancer survival 2000–14 (CONCORD-3)*, Lancet 2018;391:1023–75, Tab. 2, 3, 5: https://pmc.ncbi.nlm.nih.gov/articles/PMC5879496/
- **[ICBP]** Arnold M. a kol., ICBP SURVMARK-2, Lancet Oncol 2019: https://pmc.ncbi.nlm.nih.gov/articles/PMC6838671/ (zoznam krajín prevzatý z raw-krajina-no.md)
- **[OECD25]** OECD/EK: *EU Country Cancer Profile: Estonia 2025*: https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-ee-2024-1665-en.pdf
- **[CAPTR-EE]** *Estonia's Cancer Performance Tracker*, 2025: https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-2024-Estonia-CaPTr.pdf
- **[CAPTR-CZ]** *Czechia's Cancer Performance Tracker*, 2025: https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-2024-Czechia-CaPTr.pdf
- **[TK-Q1]** Tervisekassa: *2026. aasta I kvartali aruanne*, 2026: https://tervisekassa.ee/sites/default/files/eelarve/i_kvartali_aruanne_2026.pdf
- **[EHIF-ek]** Tervisekassa: *E-konsultatsioon* (prezentácia pre praktikov), 20. 4. 2023: https://www.Tervisekassa.ee/sites/default/files/perearstid/Infop%C3%A4evad/Perearstide%20infotund%2020.04.2023MK.pdf
- **[EHIF-acc]** Tervisekassa: *Tervisekassa kiirendiprogrammi tulemusel hakatakse piloteerima kolme raviteekonda*, 3. 3. 2025: https://tervisekassa.ee/uudised/tervisekassa-kiirendiprogrammi-tulemusel-hakatakse-piloteerima-kolme-raviteekonda
- **[EHIF-wait]** Tervisekassa: *Specialised medical care*: https://tervisekassa.ee/en/specialised-medical-care
- **[TK-portal]** Tervisekassa: *Health Portal* (aktualizované 7. 11. 2025): https://tervisekassa.ee/en/organisation/e-health-products/health-portal
- **[TK-portal-news]** Tervisekassa: *The new Health Portal has replaced Digilugu*, 13. 12. 2023: https://tervisekassa.ee/en/uudised/new-health-portal-has-replaced-digilugu
- **[TK-TJT]** Tervisekassa: *Health Specialist Portal* (aktualizované 6. 3. 2026): https://tervisekassa.ee/en/organisation/e-health-products/health-specialist-portal
- **[SM-plan]** Ministerstvo sociálnych vecí: *Estonian Cancer Control Plan*: https://www.sm.ee/en/estonian-cancer-control-plan
- **[SoM24]** Ministerstvo sociálnych vecí: *Tulemusvaldkonna TERVIS 2024. aasta tulemusaruanne*, jún 2025: https://www.sm.ee/sites/default/files/documents/2025-06/Tulemusvaldkonna%20TERVIS%202024.%20aasta%20tulemusaruanne.pdf
- **[TEHIK]** TEHIK: *Health Information System*: https://www.tehik.ee/en/health-information-system
- **[EC14]** Milieu/time.lex pre Európsku komisiu: *National Report for the Republic of Estonia* (právo EHR), 13. 5. 2014: https://health.ec.europa.eu/system/files/2016-11/laws_estonia_en_0.pdf
- **[EUROSTAT]** Eurostat news, 15. 12. 2022: https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20221215-2
- **[XTEE]** RIA: X-tee factsheet (bez dátumu): https://www.x-tee.ee/factsheets/EE/

**Sprostredkované [S]:**
- **[LUNG]** Regionálne médiá, 25. 5. 2026: https://www.mke.ee/et/uudised-et/kopsuvahi-diagnoosimine-muutub-poole-kiiremaks/ (prečítané) a https://www.mu.ee/uudised/2026/05/25/kopsuvahi-diagnoosimine-peab-muutuma-poole-kiiremaks (za platenou bránou)
- **[922SE]** Návrh zákona o povinnej e-konzultácii (922 SE, predložený 18. 5. 2026): informácie len z výsledkov vyhľadávania a zo zrkadla verejného registra dokumentov (adr-docs.karlerss.com); súbor na riigikogu.ee vracal chybu 404
- **[AGFA26]** Agfa HealthCare: *Pildipank 20th anniversary*, 15. 6. 2026: https://www.agfahealthcare.com/news/pildipank-20th-anniversary/
- **[ERR-digireg]** ERR, 7. 4. 2025: https://www.err.ee/1609656047/tervisekassa-digiregistratuuri-paranemine-toppab-arstikeskuste-ja-haiglate-taga
- **[ITK]** Východotallinnská centrálna nemocnica, 14. 5. 2026: https://www.itk.ee/en/news/dr-rille-pihlak-highlights-key-challenges-facing-cancer-care-estonia-parliament-discussion
- **[HOPE]** Prezentácia HOPE Estonia 2025 (slabý zdroj): https://hope.be/wp-content/uploads/2025/06/06.-Estonia.pdf
