# Ultimátny systém: šesť overených vecí zo šiestich krajín, zložených do cesty Aleny

_17. 10. 2026. Pre laikov aj pre porotu. Stavia na overených podkladoch tímu (`kontext/raw-krajina-*.md`,
`raw-vitaz-proces.md`, `raw-vitaz-factcheck.md`, `raw-audit-hry.md`, `integracia/g1`, `g2`, `IDEALNE-RIESENIE.md`,
`matej-idealny-system.md`). Web som použil len na doplnenie štyroch medzier (označené „doplnené 17. 10.“).
Nič som nevymýšľal._

**Značky:** **[V]** = overené v primárnom zdroji · **[S]** = sprostredkované (článok, firma, súhrn) ·
**[?]** = neisté alebo nenájdené · **[odhad]** = náš úsudok, nie fakt.

**Hlavná myšlienka v jednej vete:** nestavíme nič veľké. Berieme šesť malých pravidiel, ktoré inde fungujú a majú
čísla, a pustíme ich nad tým, čo český koordinátor dostáva už dnes (telefón, e-mail, eZpráva, ePACS).

---

## 1. Realita ČR: čo dnes reálne používa kto

Toto sú skutočné názvy. Všetko ostatné v dokumente stojí na tejto tabuľke.

| Kto | Nástroj alebo proces | Čo robí (1 veta) | Zdroj |
|---|---|---|---|
| **Praktik** | **AIS** (ambulantný softvér): CGM (MEDICUS, PC DOKTOR), MEDAX (SmartMEDIX), STAPRO (FONS Galen), ICZ (AMIS*HD Ambulance) | Karta pacienta v ordinácii; odtiaľ idú recepty, laboratórne žiadanky a správy. CGM a MEDaX majú spolu asi 70 % trhu [S, ústne na pre-hacku] | `integracia/g1-cz-systemy.md` §1; https://www.medax.cz ; https://www.stapro.cz |
| Praktik | **eRecept** (SÚKL) | Povinný elektronický recept od 1. 1. 2018 [S] | `g1` §1.3 |
| Praktik | **Laboratórna žiadanka cez katalóg v AIS** | Lekár vyberie laboratórium, pošle žiadanku a výsledky sa vrátia do AIS [V, firemná prezentácia CGM] | https://www.nzip.cz/data/media/konference-nzip-12-2024/2024-12-11-16-krystof.pdf |
| Praktik → KOC | **eŽádanka** (štát, typy **K** konzílium, **Z** zobrazovanie, **FT** fyzioterapia) | Štátna elektronická žiadanka cez dočasné úložisko. Prijať ju musí každý od 1/2026, vystaviť zatiaľ nemusí nikto; do 6/2026 ich bolo asi 2 000 [S]. Povinnosť od 1. 7. 2027 je len návrh novely [V] | `g2-cz-narodne.md` §1.3, §4; https://mzcr.atlassian.net/wiki/spaces/EPZS/pages/56000561 |
| Praktik, poliklinika, nemocnica | **eZpráva** („lekársky e-mail“) | Šifrovaná pošta medzi pracoviskami s IČP; správa ide ako PDF/A + DASTA. FN HK ňou od 16. 6. 2025 posiela prepúšťacie správy praktikom namiesto pošty. 4 519 účtov (6/2025), dosah takmer 10 000 pracovísk [V/S] | https://www.fnhk.cz/aktuality/fn-hk-nove-nabizi-lekarum-komunikaci-pres-ezpravu ; https://www.kntb.cz/ezprava |
| Nemocnica → ambulancia | **CGM ClinicBox**, **ICZ eMeDocS/ISAC**, **STAPRO MISE**, **Medicalc mex2** | Súkromné výmenné siete na dokumenty; navzájom väčšinou nekompatibilné. ClinicBox: 2 841 pracovísk (12/2024) [S] | `g1` §5 |
| **Poliklinika / ambulantný špecialista** (gastroenterológ, kardiológ) | Ten istý AIS + správa s riadkom „Kopie: praktický lékař“ | Správa ide pacientovi a kópia praktikovi. V Aleninom prípade to platí pre správy 01 a 05 [V, zadanie VZP] | `kontext/raw-audit-hry.md`, krok 7 |
| **Laboratórium** | **LIS** (napr. STAPRO FONS Openlims) + formát **DASTA** + číselník **NČLP** | Výsledky idú ako XML (DASTA, väčšinou ešte verzia 3) s jednotnými kódmi NČLP. Aktuálna verzia DS 04.28.08 z 15. 9. 2026 [V] | https://dastacr.cz/ ; `g1` §3 |
| Laboratórium → pacient | **Národný laboratórny systém (ÚZIS)** + **EZKarta** | 282 laboratórií, 405 mil. výsledkov. Pacient v EZKarte vidí 10 parametrov za 5 rokov. Koordinátor ani lekár k tomu cez štát prístup nemajú [V/odhad] | MZ 24. 6. 2026: https://mzd.gov.cz/tiskove-centrum-mz/elektronizace-zdravotnictvi-pokracuje-ministerstvo-predstavilo-nove-moznosti-prace-se-zdravotnickymi-daty-i-dalsi-legislativni-zmeny/ |
| **Rádiológia** | **PACS** v nemocnici (napr. JIVEX, m4Pacs, MARIE PACS) | Archív snímok CT, MR a RTG jednej nemocnice [S] | `g1` §4 |
| Rádiológia ↔ KOC | **ePACS** (ICZ), **ReDiMed** (Brno) | Sieť na posielanie snímok medzi nemocnicami. Asi 334 zariadení, ale v roku 2018 prenášala len ~4 % vyšetrení [S] | https://op3v.fbmi.cvut.cz/sites/default/files/2023-11/Informa%C4%8Dn%C3%AD%20syst%C3%A9my%20ve%20zdravotnictv%C3%AD.pdf |
| Rádiológia → pacient | **CD/DVD** | Keď to nejde sieťou, pacient dostane snímky na CD za 50 až 300 Kč [V] | https://ct24.ceskatelevize.cz/clanek/domaci/za-tri-stovky-a-pouze-na-cedecku-nemocnice-mezi-sebou-neumi-predavat-rentgenove-snimky-351090 |
| **KOC (nemocnica)** | **NIS**: STAPRO FONS Enterprise / Akord (VFN), ICZ AMIS*H / AMIS*HD (ÚVN), IKIS (FN Olomouc, AGEL), Medicalc4 (KN Liberec), Zlatokop (IKEM, Na Homolce) | Hlavný nemocničný systém. Pre 9 až 10 z 15 KOC verejne nevieme, aký majú [V/S]. Verejné API sme u žiadneho výrobcu nenašli [S] | `g1` §2 |
| KOC | **Konzílium (MDT)** ako výkon 51881 [?] | Pankreas poisťovňa platí až po konzíliu [V, OECD 2025]. Číslo výkonu sa v zdrojoch líši (51881 vs 51883) [?] | `kontext/raw-cz-system.md` bod 9 |
| KOC | **NCPeH** (národný kontaktný bod) | Štátny uzol na pacientsky súhrn; pripojených 30 z 37 poskytovateľov (30. 8. 2026), asi 11 z 15 KOC [V/odhad] | https://www.nixzd.cz/poskytovatele |
| **Koordinátor** | **Telefón, e-mail, formulár** (Bulovka: online alebo Word; MOÚ: webová žiadanka), snímky cez **ePACS** | Takto koordinátorky dnes reálne pracujú; správy často zháňajú samy [V/S] | https://www.fnol.cz/aktuality/koordinatorka-onkologicke-pece-pomaha-ve-fn-olomouc-pacientum-v-nelehke-situaci-i-zdravotnikum-pri-jejich-praci ; https://www.zdravotnickydenik.cz/2026/06/koordinator-zkracuje-pacientum-cestu-k-lecbe-rakoviny/ |
| Koordinátor | **Věstník MZ 11/2025, čl. 6** + **záznam o koordinovaní** | Každé KOC musí mať koordinátora (min. 1,0 úväzku, zdravotnícke vzdelanie netreba). Pracuje na písomné vyžiadanie lekára a každý úkon zapisuje do „záznamu o koordinování zdravotních služeb“ v NIS [V] | https://portal.gov.cz/vestniky/pv8aaxd/1556005765.pdf |
| Koordinátor → poisťovňa | **Výkon 51887** | 250 Kč za intervenciu koordinátora, najviac raz denne na pacienta; vykazuje nemocnica [V] | vyhláška 432/2025 Sb., bod 8.5: https://www.zakonyprolidi.cz/cs/2025-432 |
| Koordinátor | **Metodický pokyn MZ pre HPB centrá** (pečeň, pankreas, žlčové cesty), účinný od 1. 9. 2026 | Určuje spádovosť a ako kontakt **web, univerzálny e-mail a telefón koordinátora** [V] | https://mzd.gov.cz/wp-content/uploads/2026/05/Metodicky-pokny_spadova-zodpovednost-HPB_akt.-14_09_26.pdf |
| Koordinátor | **„Pilotované koordinačné aplikácie“ MZ** (od 2/2026) | Niektoré KOC skúšajú softvér; názov ani dodávateľ nie sú verejné [S] | `IDEALNE-RIESENIE.md` §4 (Z34) |
| **VZP a iné poisťovne** | **VZP Point**, **B2B služby** (overenie poistenia, registrujúci lekár) | Webová aplikácia a služby systém–systém; smie ich používať len zmluvný poskytovateľ s certifikátom [V] | https://vzp.cz/e-vzp/b2b-komunikace/prehled-poskytovanych-sluzeb-b2b |
| VZP | **Vykázané výkony / Moje VZP** | Poisťovňa vidí starostlivosť až z vyúčtovania: spracovanie do ~50 dní, vykazovať sa dá až 3 mesiace spätne. Na živé sledovanie cesty to nestačí [V] | https://www.vzp.cz/o-nas/nejcasteji-resite/otazka/proc-nejsou-v-aplikaci-moje-vzp-on-line-udaje-o-cerpane-zdravotni-peci |
| VZP | **Inovačný portál** (inovace.vzp.cz) | Onkológia je prvá oblasť, kam sa dajú podať projekty [S] | `ONE-PAGER.md`; https://inovace.vzp.cz |
| **Pacient** | **Lékový záznam (SÚKL) + aplikácia eRecept** | Zoznam vydaných liekov. Pacient v „historii přístupů“ vidí, **ktorí zdravotníci do záznamu nahliadli** [V, doplnené 17. 10.] | VZP 14. 9. 2026: https://www.vzp.cz/o-nas/tiskove-centrum/otazky-tydne/pristup-do-lekoveho-zaznamu |
| Pacient | **EZKarta**, portál **eZdraví (NPEZ)**, **Sdílený zdravotní záznam** | Štátna appka a portál pre pacienta. Zdieľaný záznam má len krvnú skupinu, alergie, lieky a prevenciu, **onkologické správy nie** [V] | `g2` §5; https://www.zakonyprolidi.cz/cs/2021-325 |
| Štát | **Žurnál činností, §37 zákona 325/2021** | Pacient aj zdravotník vidia, kto čo robil s pacientovými údajmi v štátnom rozhraní [V podľa výťahu] | `integracia/g4-pravo-bezpecnost.md` §3.4 |
| Štát (meranie) | **ÚZIS, otvorené dáta Onco_C25** | Čas do diagnózy meria spätne od **prvého zobrazenia**, nie od žiadanky [V] | https://www.onconet.cz/res/file/otevrena-data/otevrena-data-c25.pdf |
| Štát (meranie) | **Nikto** | OECD: čakacie doby v onkológii sa v ČR **systematicky nesledujú** [V]. MZ: viac ako 60 % pacientov s rakovinou pľúc nezačne liečbu do 8 týždňov od CT [V ako výrok MZ, zdroj dát neuvádza] | https://cancer-inequalities.jrc.ec.europa.eu/sites/default/files/docs/ccp2025/ec-oecd-cs-2025-1663-v2-en.pdf ; https://mzd.gov.cz/tiskove-centrum-mz/jeden-kontakt-mene-cekani-rychlejsi-cesta-k-lecbe-koordinatori-meni-peci-o-onkologicke-pacienty/ |

**Čo z tabuľky plynie [odhad]:** ČR má človeka (koordinátor), platbu (51887) aj kanály (e-mail, eZpráva, ePACS).
Nemá štyri veci: **hodiny** (kto meria čas), **pravidlo úplnosti** (čo musí byť v žiadanke a pri odovzdaní),
**uzavretú slučku** (praktik vie, čo sa rozhodlo) a **meranie**. Presne tieto štyri diery plátajú veci nižšie.

---

## 2. Šesť vecí zo šiestich krajín

Výber: pri každej krajine **jedna** vec, ktorá (a) má čísla, (b) sa dá spustiť nad dnešnými kanálmi ČR, (c) lekára
nestojí nič alebo takmer nič.

### 2.1 Dánsko: hodiny cesty a automatické meranie

**Čo to je.** Každá cesta má **5 udalostí s dátumom**: žiadanka prijatá, prvá návšteva, rozhodnutie o liečbe, začiatok
liečby, podozrenie vyvrátené. Nemocnica ich zapisuje ako kódy do národného registra a úrad z nich **sám** počíta, či
cesta stihla lehotu. Pre pankreas platí: **6 dní** do prvej návštevy, **27 dní** vyšetrovanie po rozhodnutie, **10 / 11 /
15 dní** do operácie, chemoterapie alebo žiarenia (spolu 43 / 44 / 48 dní) [V: SDS monitorovací model 2023 a SDS 2026].

**Dopad (čísla).**
- Dánsko vie každý štvrťrok povedať, koľko ciest stihlo lehotu, bez ručného vykazovania: **77 %** z 28 502 ciest
  v roku 2025 (predbežné); pankreas **87 %** operovaných (n = 254), **71 %** pri chemoterapii (n = 406) [V: SDS 2026].
- Po zavedení ciest bolo menej pacientov nespokojných s čakaním od žiadanky po prvú návštevu v nemocnici
  (**OR 0,6**) [V: Dahl a kol., DMJ 2017].
- 3-ročné prežitie pri 7 diagnózach stúplo zo **45 % na 54 %** (pred 2004/05 vs po 2010). Pozor: zlepšenie je
  celosystémové, nie len vďaka cestám [V: Jensen a kol., BMC Cancer 2017].
- Meranie odhaľuje problémy: audit našiel **6 % ciest (~6 400)** mimo zákonnej lehoty bez platného dôvodu
  [V: Rigsrevisionen 13/2023]. Česko by dnes takéto číslo nevedelo zistiť (OECD 2025) [V].

**Ako to napojíme v ČR bez zmeny infraštruktúry.** Päť udalostí zapíše appka koordinátora **sama**, keď sa stane
niečo, čo koordinátor aj tak robí: príde e-mail alebo eZpráva so žiadosťou (štart hodín), zapíše termín, zapíše dátum
konzília, zapíše začiatok liečby. Každá pečiatka je zároveň riadok **záznamu o koordinovaní** (Věstník) a podklad pre
výkon 51887. Lehoty ukazujeme ako **zahraničný vzor**, nie českú normu. Do NIS appka sama nič nezapisuje;
riadky záznamu koordinátor prenesie ako text alebo PDF (pilot bez rozhrania).

**Čo to stojí lekára.** Nič. Koordinátora tiež nič navyše, pečiatky vznikajú z krokov, ktoré už robí [odhad].

**Poctivá poznámka pre Alenu:** od prijatia v KOC (2. 10.) po konzílium (21. 10.) prešlo **19 dní**. Dánsky štandard
je 33 dní (6 + 27). Alena by ho splnila. Najdlhší úsek bol **pred** KOC (1. 9. až 2. 10., 31 dní), kde oficiálnu lehotu
nemá ani Dánsko [V: `raw-vitaz-factcheck.md` 1.17; náš výpočet]. Hodiny teda nie sú výčitka, sú **meranie**.

Zdroje: https://cdn1.gopublic.dk/sundhedsdatastyrelsen/media/16379/Monitoreringsmodel%20Organspecifik%20kraeft.pdf ·
https://cdn1.gopublic.dk/sundhedsdatastyrelsen/Media/639168548110422377/monitorering-af-kraeftomraadet-aarsopgoerelse-2025.pdf ·
https://content.ugeskriftet.dk/sites/default/files/scientific_article_files/2018-08/a5322.pdf ·
https://pmc.ncbi.nlm.nih.gov/articles/PMC5585953/ · https://cdn.rigsrevisionen.dk/rigsrevisionen/Media/638487768194279679/SR1323.pdf

### 2.2 Švédsko: menovaná kontaktná osoba, ktorá pacienta aktívne odovzdá

**Čo to je.** Pacient má **jednu menovanú kontaktnú osobu** (vo Švédsku kontaktná sestra). Pozná ju menom a telefónom.
Keď pacient mení pracovisko, kontaktná osoba ho **aktívne odovzdá** ďalej (nie „zaneste si to tam“) [V: RCC 2026;
Vårdanalys 2024].

**Dopad (čísla).**
- Pri pankrease má menovanú kontaktnú sestru **viac ako 90 %** pacientov každý rok od 2019 [V: register pankreasu 2026].
- Pacienti hodnotia otázku „Koordinoval personál vaše kontakty v potrebnom rozsahu?“ na **84 až 89 bodov zo 100**
  podľa regiónu (cieľ 90) [V: RCC 2026, obr. 12].
- Štátny hodnotiteľ: kontaktné sestry sú oblasť, kde sa onkologickej stratégii „darilo obzvlášť dobre“
  [V: Vårdanalys 2024].
- Podporný dôkaz zo susedného Nórska: keď v nemocnici Hammerfest na jeseň 2024 **chýbal koordinátor**, podiel pacientov
  s rakovinou čreva zaradených do cesty klesol z **90 % na 65 %** [V: audit Helse Nord 2025].
- Slabina, ktorú riešime: sestra je často viazaná na oddelenie, takže pacient **nemá tú istú osobu** celú cestu
  [V: Vårdanalys 2024]. Preto k menu pridávame aktívne odovzdanie.

**Ako to napojíme v ČR.** Koordinátor v KOC už je (Věstník). Nové sú len dve veci v appke: (1) Alena dostane
**meno a telefón** svojej koordinátorky (SMS alebo jednoduchá stránka „Moja cesta“ cez jednorazový odkaz), (2) pri
presune medzi nemocnicami (Alena: CT v KOC 1, konzílium v KOC 2) sa zapíše **„odovzdané komu, kedy, prevzaté“**.
Kanál je telefón a e-mail ako dnes.

**Čo to stojí lekára.** Nič. Koordinátora jeden klik „odovzdané“ [odhad].

_Druhá švédska možnosť (bez dát o dopade [?]):_ rádiológ v náleze odpovie **áno/nie** na „odôvodnené podozrenie na
rakovinu“ a praktik podľa toho hneď posiela do cesty [V: SVF dokumenty]. Je to jeden riadok v náleze, ale číslo
o prínose sme nenašli.

Zdroje: https://cancercentrum.se/download/18.2aeb47be19eafbced6fd621/1781249105692/%C3%85rsrapport%20bukspottk%C3%B6rtelcancer%202025.pdf ·
https://cancercentrum.se/download/18.7c07b08019d24db18e31c3b8/1774868818243/%C3%85rsapport%20%C3%B6verenskommelse%202025%20J%C3%A4mlik%20och%20effektiv%20cancerv%C3%A5rd%20med%20kortare%20v%C3%A4ntetider_med%20bilagor.pdf ·
https://www.vardanalys.se/wp-content/uploads/2024/01/PM-2024-2-Lägesbild-av-den-nationella-cancerstrategin.pdf ·
https://www.helse-nord.no/4a6af7/siteassets/dokumenter-og-blokker/4-om-oss/styret/styremoter/styremoter-2025/20250925/styresak-096-2025-internrevisjonsrapport-1-2025-pakkeforlop-kreft-i-helse-nord.pdf

### 2.3 Anglicko: minimálny balík dát pri odovzdaní („deň 38“)

**Čo to je.** Keď pacienta lieči viac nemocníc, odosielajúca musí odovzdať pacienta najneskôr v **deň 38** zo 62
a len s **minimálnym balíkom**: číslo pacienta, dôvod, anamnéza a lieky, histológia, snímky a ich popisy, potvrdenie,
že pacient o odoslaní vie. Neúplné odovzdanie sa **vráti do 24 hodín**. Kto mešká, nesie zlyhanie v štatistike
(inak 50 : 50) [V: NHS England 2016; politika trustu Wolverhampton 2024].

**Dopad (čísla).** Priamy efekt samotného pravidla nikto nezmeral [?]. Doložené je, **aký veľký problém rieši**:
- **15 %** 62-dňových ciest zdieľajú dve nemocnice, tieto cesty trvajú **až o 50 % dlhšie** a pripadá na ne
  **tretina všetkých prekročení** lehoty [V: NHS England, Breach Allocation Guidance, apríl 2016; doplnené 17. 10.].
- **44 %** lekárov na konzíliách hlási neúplné údaje v žiadanke, **40 %** chýbajúcu patológiu [V: RCR, prieskum
  1 455 ľudí v 2025, správa 5/2026].
- V Nórsku každý prestup medzi nemocnicami pridá pri pľúcach **10,5 až 18,5 dňa** [V: audit Helse Vest 2025].

**Ako to napojíme v ČR.** Balík pre konzílium = **20 polí zo zadania VZP (`Handover_obsah`)** so semaforom
(potvrdené / návrh / chýba / rozpor) a s citátom zo správy. Pri presune KOC 1 → KOC 2 appka ukáže, čo z balíka chýba
a **kto je na ťahu** (napr. „popis CT: KOC 1, do 10. 10.“, ilustrácia). Snímky neťaháme, stačí stav „v ePACS KOC 2: áno/nie“.

**Čo to stojí lekára.** Nič. Balík skladá koordinátor (s AI), lekár KOC ho len potvrdí, čo pred konzíliom robí aj dnes.

Zdroje: https://www.england.nhs.uk/wp-content/uploads/2016/03/cancr-brch-allocatn-guid-2016.pdf ·
https://eu5mgmt.voxco.com/Media/273/Cancer_MDTs_External_Insights_Report_May_2026.pdf ·
https://www.helse-vest.no/4a5cbd/contentassets/7b08f25571d846ffbcbcf40af13cf76a/internrevisjon-av-pakkeforlop-for-kreft.pdf

### 2.4 Holandsko: záver konzília praktikovi do 2 pracovných dní

**Čo to je.** Z konzília vzniká **jeden zápis**, uloží sa v nemocnici a **do 2 pracovných dní** ide praktikovi. Vopred je
určené, kto ho posiela a komu. Je to záväzná norma SONCOS pre každú nemocnicu, ktorá lieči rakovinu [V: SONCOS 14,
s. 7–8].

**Dopad (čísla).** Číslo o tom, o koľko pravidlo zrýchlilo správy, sme **nenašli** [?] (doplnené 17. 10., hľadané
v indikátoroch SONCOS). Doložené je:
- Bez pravidla prichádza informácia k praktikovi „**vždy včas**“ len podľa **4 %** holandských praktikov, „pravidelne“
  podľa 80 % [V: eHealth-monitor 2017].
- Kde sa čas správy praktikovi meria (Nórsko), odíde **73,0 %** správ do 1 dňa a **86,7 %** do 7 dní (1. tertial 2026)
  [V: Helsedirektoratet]. Nórsky región HSØ sa zlepšil zo **78,8 %** (2024) na **83,0 %** (2. tertial 2025) [V].
- V ČR VZP sama píše, že praktik nemá jednoduchý spôsob zistiť, či pacienta prijali a ako konzílium rozhodlo
  [V: deck VZP, slajd 5].

**Ako to napojíme v ČR.** Zo zápisu konzília (šablóna VZP `MDT zaver`) appka pripraví **záver pre praktika**: jeho
pôvodná otázka, rozhodnutie, čo má sledovať on. Odíde kanálom, ktorý KOC má (eZpráva, e-mail). Hodiny strážia
2 pracovné dni a prípad sa uzavrie až po **potvrdení doručenia**.

**Čo to stojí lekára.** Lekár KOC potvrdí záver, ktorý vznikol zo zápisu, čo píše aj dnes. Praktik nerobí nič, len
dostane správu [odhad].

Zdroje: https://demedischspecialist.nl/normeringsrapport-van-soncos ·
https://nivel.nl/sites/default/files/bestanden/Nictiz_eHealth_monitor_2017_tabellen.pdf ·
https://www.helsedirektoratet.no/statistikk/kvalitetsindikatorer/sykehusopphold/sykehusopphold-epikrisetid

### 2.5 Nórsko: povinný obsah žiadanky

**Čo to je.** Žiadanka do cesty pre pankreas musí obsahovať: dôvod podozrenia, lieky, pridružené choroby, hodnotenie
krehkosti, krvné výsledky a alergiu na kontrast, a musí byť označená „Pakkeforløp“ [V: Helsedirektoratet, 3. 7. 2026].
Dánsko má podobný zoznam (aj lieky na riedenie krvi, telefón a to, či pacient vie o podozrení) [V, ako „odporúčaný“].

**Dopad (čísla).**
- Zrandomizovaná štúdia v severnom Nórsku (14 ambulancií, 500 pacientov): so **šablónou žiadanky** mali žiadanky
  o **18 % vyššie skóre kvality** (95 % CI 11 až 25 %) [V: Wåhlberg a kol., BMC Health Serv Res 2015; doplnené 17. 10.].
  Ktoré 4 diagnózy štúdia pokryla, sme v plnom texte neoverili [?].
- Pozor: nadväzná štúdia (2017) **nenašla** merateľný vplyv na kvalitu starostlivosti; šablónu reálne používala asi
  **polovica** ambulancií [V]. Poučenie: kontrola musí byť tam, kde lekár už píše, nie v ďalšom formulári [odhad].
- Problém je skutočný: najväčší nórsky región v roku 2025 uvádza ako príčinu zdržaní **neúplné žiadanky** a žiada
  spoločné checklisty [V: Helse Sør-Øst 2025].

**Ako to napojíme v ČR.** Praktik pošle žiadosť ako dnes (e-mail, web KOC, eZpráva; neskôr eŽádanka K). Appka mu
**hneď** vráti potvrdenie prijatia a zoznam, čo chýba (v Aleninom prípade: výsledky 01–06 sú len ako „k dispozícii na
pracoviskách“, chýba ECOG, e-mail pacientky aj praktika) [V: `raw-audit-hry.md`, krok 7]. Údaje z priloženej správy
vytiahne AI, praktik doplní len chýbajúce.

**Čo to stojí lekára.** Málo, nie nič: doplní pár údajov, ktoré má v karte. Koľko minút, sme nemerali [?].

Zdroje: https://www.helsedirektoratet.no/nasjonale-forlop/bukspyttkjertelkreft/inngang-til-pakkeforlop-for-bukspyttkjertelkreft ·
https://www.biomedcentral.com/1472-6963/15/353 · https://bmchealthservres.biomedcentral.com/articles/10.1186/s12913-017-2127-1 ·
https://www.helse-sorost.no/494e56/siteassets/documents/arlig-melding/arlig-melding-2025-for-helse-sor-ost-rhf.pdf

### 2.6 Estónsko: pacient vidí, kto pozeral jeho dáta

**Čo to je.** V národnom systéme sa **každé otvorenie záznamu zaloguje** a pacient ten zoznam vidí na portáli.
Zároveň si lekári pri liečbe zdieľajú dáta **bez súhlasu** pacienta (pacient môže zdieľanie zakázať)
[V: správa pre Európsku komisiu 2014; TEHIK]. Log je protiváha tejto voľnosti [odhad].

**Dopad (čísla).** Štúdiu, že log znížil zneužitie, sme **nenašli** [?] (hľadané 17. 10.). Doložené je:
- Svoj zdravotný záznam si online otvorilo **59 %** Estóncov oproti **24 %** v priemere EÚ (2022) [V: Eurostat].
- Estónsky portál má priemerne **900 000** prihlásení mesačne (krajina má ~1,3 mil. ľudí) [V: Tervisekassa 2025].
- Česko už podobnú vec má: v lékovom zázname si pacient overí, **ktorí zdravotníci nahliadli** [V: VZP 14. 9. 2026],
  a zákon 325/2021 (§37) zavádza žurnál činností viditeľný pacientovi [V podľa výťahu].

**Prečo to dávame do systému [odhad].** Koordinátor často nie je zdravotník a vidí celú dokumentáciu. Otvorená
právna otázka je, či na to má nárok (zákon 372/2011 §65) [`g4` bod 5]. Log viditeľný pacientovi je najlacnejšia
dôvera: každý vie, kto sa pozeral.

**Ako to napojíme v ČR.** Appka každé otvorenie prípadu zapíše (kto, kedy, prečo) a na stránke „Moja cesta“ ukáže
Alene zoznam. Je to rovnaký princíp ako história prístupov v aplikácii eRecept.

**Čo to stojí lekára.** Nič.

Zdroje: https://health.ec.europa.eu/system/files/2016-11/laws_estonia_en_0.pdf · https://www.tehik.ee/en/health-information-system ·
https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20221215-2 ·
https://www.vzp.cz/o-nas/tiskove-centrum/otazky-tydne/pristup-do-lekoveho-zaznamu

### Prehľad na jednej strane

| Krajina | Vec | Najsilnejšie číslo | Čo to stojí lekára |
|---|---|---|---|
| Dánsko | Hodiny cesty, 5 udalostí, automatické meranie | 77 % ciest v lehote, merané bez vykazovania; nespokojnosť s čakaním OR 0,6 | nič |
| Švédsko | Menovaná kontaktná osoba + aktívne odovzdanie | > 90 % pacientov s pankreasom má menovanú sestru; koordinácia 84–89/100 | nič |
| Anglicko | Minimálny balík pri odovzdaní (deň 38) | zdieľané cesty o 50 % dlhšie, tretina prekročení | nič |
| Holandsko | Záver konzília praktikovi do 2 pracovných dní | bez pravidla „vždy včas“ len 4 %; dopad pravidla [?] | potvrdenie zápisu |
| Nórsko | Povinný obsah žiadanky | šablóna: +18 % kvality žiadanky (RCT) | pár polí navyše |
| Estónsko | Pacient vidí, kto pozeral | 59 % ľudí si otvorí záznam (EÚ 24 %); dopad na zneužitie [?] | nič |

---

## 3. Ultimátny systém: cesta Aleny krok po kroku

Alena (fiktívna pacientka zo zadania VZP) má podozrenie na rakovinu pankreasu. Poistená je v **ZP 211**, nie vo VZP.
Dátumy sú zo zadania [V: `raw-audit-hry.md`].

| # | Kedy | Dnes (podľa zadania a overených zdrojov) | S ultimátnym systémom | Vec |
|---|---|---|---|---|
| 1 | 2. 10. | Praktik pošle žiadosť do KOC 2 (Nemocnica Lipová). Výsledky v nej nie sú, len „k dispozícii na pracoviskách“. Nevie, či ju prijali. | Pri odoslaní hneď vidí: **chýba ECOG, e-mail pacientky, výsledky 01–06**. Priloží, čo má. Dostane **potvrdenie prijatia**. | NO |
| 2 | 2. 10. | Koordinátorka dostane e-mail. Kde je prípad a do kedy, nikto nemeria. | Prijatím **štartujú hodiny**: „deň 0 z 33 do rozhodnutia (dánsky vzor)“. Alena dostane SMS s **menom a telefónom** koordinátorky. | DK, SE |
| 3 | 2.–8. 10. | Koordinátorka telefonuje a píše na päť pracovísk po správy 01–06. | Appka ukáže **balík 20 polí**: čo je, čo chýba, čo si odporuje. Každé chýbajúce pole má **vlastníka a termín** (napr. „na ťahu: kardiológ, do 6. 10.“, ilustrácia). | UK |
| 4 | 8. 10. | CT robia v KOC 1 (Nemocnica Severní), lebo v KOC 2 nebol termín. Snímky sa musia dostať do KOC 2. | Presun KOC 1 → KOC 2 má **minimálny balík** (popis CT, stav „v ePACS KOC 2: áno“) a zápis **„odovzdané komu, kedy, prevzaté“**. | UK, SE |
| 5 | 12.–20. 10. | Biopsia, krv, histológia. V správe 11 je histológia „vydaná“ 19. 10., deň pred „odberom“ 20. 10.; treba si to všimnúť ručne. | Kroky majú 4 stavy (vyžiadané → objednané → vykonané → výsledok doručený). Rozpor dátumov **svieti**. Pri meškaní eskalácia. | DK, UK |
| 6 | 21. 10. | Konzílium rozhodne: najprv chemoterapia. Zapíše, že ECOG v podkladoch chýba. | Podklad je úplný a s citátmi, ECOG bol vyžiadaný už 2. 10. Udalosť „rozhodnutie“ = **deň 19 z 33**. | DK, UK |
| 7 | do 23. 10. | Zadanie chce, aby praktik dostal záver. Ako a kedy, sa nemeria; praktik nevie, či niečo príde. | **Záver praktikovi do 2 pracovných dní** (do 23. 10.): jeho otázka, rozhodnutie, čo má sledovať. Prípad sa uzavrie až po **potvrdení doručenia** praktikovi aj ZP 211. | NL |
| 8 | 23.–27. 10. | Alena sa dozvie diagnózu; ide k algeziológovi (KOC 1) a psychologičke (KOC 2). | Na stránke „Moja cesta“ vidí ďalšie termíny (26. 10., 27. 10., onkológ 4. 11.), svoju koordinátorku a **kto otvoril jej prípad**. | SE, EE |
| 9 | štvrťrok | Nikto nevie, ako dlho cesty v KOC trvajú (OECD 2025). | VZP a MZ vidia **anonymné súhrny**: % ciest v lehote za KOC, kde sa najviac čaká, % záverov praktikovi do 2 dní. | DK |

**Čo sa oproti dnešku zmení, v piatich bodoch:**
1. Praktik vie hneď, čo chýba, a vie, že žiadosť prišla (NO).
2. Každý prípad má hodiny a pri každom kroku je jasné, kto je na ťahu (DK, UK).
3. Alena má meno a telefón jedného človeka aj pri presune medzi nemocnicami (SE).
4. Slučka sa zatvorí: praktik dostane záver do 2 pracovných dní a doručenie je potvrdené (NL).
5. Pacient vidí, kto sa pozeral, a štát po prvý raz vidí, ako dlho cesta trvá (EE, DK).

**Čo sa nemení:** lekári ostávajú vo svojich systémoch (AIS, NIS), nikto nedostane nový účet, kanály sú tie isté
(telefón, e-mail, eZpráva, ePACS). Keď bude eŽádanka K povinná (návrh od 1. 7. 2027), stane sa len ďalším vstupom.

---

## 4. Čo z toho je v našom deme a čo povedať porote

Stav podľa stavebného kontraktu appky (`app/CONTRACT.md`) a zoznamu 8 krokov dema (`IDEALNE-RIESENIE.md` §7.1).
V čase písania sú stránky appky ešte rozpracované, takže „v deme“ znamená **naplánované a v kontrakte**.

| Vec | V deme? | Ako to vyzerá |
|---|---|---|
| NO: kontrola žiadanky | **áno** | Obrazovka „Príjem žiadanky“: chýbajú výsledky 01–06, telefón/e-mail, ECOG + automatické potvrdenie prijatia |
| DK: hodiny cesty | **áno** | „Deň 12 z 33“ pri prípade, označené ako dánsky vzor; ranný prehľad „dnes urgovať“ |
| UK: balík pri odovzdaní | **áno** | Semafor 20 polí s citátom, klik ukáže vetu v správe, rozpory vedľa seba, prepínač „stav k 21. 10.“ |
| NL: záver do 2 dní | **áno** | Záver pre praktika s blokom „Čo to znamená pre vás“ + doručenka (simulovaná) + súhrn pre ZP 211 |
| SE: menovaná osoba | **čiastočne** | „Na ťahu“ a vlastník kroku áno; stránka „Moja cesta“ s menom koordinátorky je len návrh (`matej-idealny-system.md`) |
| EE: kto pozeral | **čiastočne** | Záznam o koordinovaní a auditný log sú v pláne („mal by“); pohľad pacienta na log je len na slajde |
| DK: národné meranie | **nie** | Len na slajde (pilot v 1 KOC, potom národne) |

**Tri vety pre porotu:**
1. „Nevymysleli sme nový systém: zložili sme šesť vecí, ktoré inde fungujú a majú čísla, a pustili ich nad tým, čo
   český koordinátor dostáva už dnes, teda telefón, e-mail, eZprávu a ePACS.“
2. „Z Dánska hodiny cesty, z Nórska kontrola žiadanky, z Anglicka balík pri odovzdaní, z Holandska záver praktikovi
   do dvoch pracovných dní, zo Švédska meno kontaktnej osoby a z Estónska prehľad, kto sa na pacienta pozeral.“
3. „Lekár sa nič nové neučí, koordinátor vždy vie, kto je na ťahu, a VZP po prvý raz uvidí, ako dlho trvá cesta
   onkologického pacienta v Česku, čo dnes podľa OECD nikto nemeria.“

---

## 5. Čo nevieme [?]

1. Priamy dopad holandského pravidla „2 pracovné dni“ a anglického „dňa 38“ v číslach (máme len veľkosť problému).
2. Či estónsky log znížil zneužitie dát.
3. Koľko minút stojí praktika doplnenie žiadanky a koľko minút koordinátora jeden prípad (otázka na mentorov).
4. Ktoré 4 diagnózy pokryla nórska štúdia so šablónami žiadaniek.
5. Kódy MDT výkonu v ČR (51881 vs 51883) a akým kanálom dnes ide informácia reviznému lekárovi.
6. Či koordinátor bez zdravotníckeho vzdelania smie vidieť celú dokumentáciu (zákon 372/2011 §65).
7. Švédska alternatíva „rádiológ áno/nie“ nemá v našich zdrojoch číslo o prínose.
