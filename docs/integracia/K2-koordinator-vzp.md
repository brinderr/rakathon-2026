# K2: Koordinátorka KOC a zadávateľ VZP čítajú návrh A

_16. 10. 2026. **Hraná rola (Claude)**, nie výpoveď skutočnej koordinátorky ani VZP. Fakty majú zdroj (§6), hodnotenia sú [odhad]. Pojmy: MDT = konzílium, ECOG = stav výkonnosti pacienta, B2B = spojenie systém–systém._

## 1. Pomôže mi to v utorok ráno?

Áno, ak prvá obrazovka nebude profil, ale **zoznam prípadov: čo mešká, čo čaká na mňa, čo na iných a do kedy**. To chce VZP: u každého pacienta stav, termín a kto je na ťahu [čiastočne, D sl. 9]. A to v §1.4 radí správne, vlna A (§3.A) však začína dátovým modelom [odhad].

Reálne koordinátorky hlavne telefonujú a píšu e-maily [overené, S1]. Na Bulovke správy samy zháňajú, asi 10 pacientov týždenne [čiastočne, S2]. Minúty na prípad: **nevieme**.

V A chýba **záznam o koordinovaní ako vedľajší produkt**. Věstník ho od koordinátora žiada [overené, S3]. Nemocnica dostane 250 Kč za intervenciu, najviac raz denne na pacienta [overené, S4]. Každý úkon nech je riadkom záznamu [odhad].

## 2. Čo je zbytočné (pre sobotu)

- **Krásny profil.** Na MDT potrebujem podklad podľa `MDT_zapis` a zoznam medzier [overené, Z], nie dashboard.
- **Lieky „dokedy“.** Lékový záznam takéto pole nemá [overené, S5]. Len to, čo stojí v správe.
- **Graf laboratórií.** Do MDT sú v dátach dva odbery (1. 9. a 15. 10.) [overené, Z]. Stačí tabuľka.
- Z A: dva FHIR servery, vektorové vyhľadávanie, Slovensko, detail vlny C. Patria na slajd alebo k cene InterSystems [odhad].

## 3. Budú praktici niečo meniť?

Nie a nemusia. Dobrovoľný elektronický kanál v Anglicku roky stál okolo 52 %, rozhýbala ho až platba (2018) [overené, S8]. Česká lekárska komora nesúhlasí s novými povinnosťami, kým systém nefunguje, a žiada kompenzáciu [overené, S9]. MZ predpisuje HPB centrám (pečeň, pankreas, žlčové cesty) univerzálny e-mail a telefón koordinátora [overené, S10]. Kanály v A sú preto správne.

Pozor: deck VZP si predstavuje **jedno digitálne miesto**, kam praktik nahrá správy bez ďalšieho veľkého formulára [čiastočne, D sl. 7]. Vysvetlite porote, prečo e-mail namiesto portálu. Praktikovi pribudne len potvrdenie prijatia a zoznam chýbajúceho. Dnes nevie, či pacienta prijali [čiastočne, D sl. 5].

## 4. Čo vie dodať VZP

- **Platbu.** Výkon 51887 už existuje [overené, S4]. Bonus za doložené uzavretie slučky je na VZP a MZ [odhad].
- **Adresu praktika.** B2B služba „registrujúci poskytovateľ“, len pre zmluvného poskytovateľa s certifikátom, teda cez KOC [overené, S6].
- **Vykázané výkony** na živú prácu nie: spracovanie do 50 dní, vykazovanie až 3 mesiace spätne [overené, S7]. Na spätnú analýzu ciest áno [odhad].
- **„Komunikačný uzol vo VZP“** je jedna veta v poznámkach k slajdu 2 [čiastočne, D]. Čo znamená, **nevieme**. Opýtajte sa mentora, nesľubujte úložisko.

## 5. Čo musí sobotné demo ukázať

Slajd 12 VZP [čiastočne, D] v 8 krokoch:

1. Úvod = fronta prípadov so stavom, termínom a vlastníkom kroku (Alena + 2 fiktívne riadky) [odhad].
2. E-mail praktika (správa 07) → prípad → automatické potvrdenie prijatia.
3. Medzery a rozpory: ECOG chýba (aj podľa záveru MDT [overené, Z]); dátum apixabanu v správe 09; histológia „vydaná“ pred „odberom“ v správe 11 [čiastočne, S11].
4. Klik na údaj → citát v pôvodnej správe.
5. Koncept žiadosti o správy 01–06 so správnym adresátom.
6. Kroky s termínom a eskaláciou: odoslané ≠ objednané ≠ vykonané [čiastočne, S12].
7. Prepínač „k 21. 10.“: váha 63 kg zo správy 12 (26. 10.) sa nesmie objaviť [čiastočne, S11].
8. Podklad podľa `MDT_zapis`, záver praktikovi a doručenka (simulovaná, povedať nahlas).

Nehovoriť: „napojené na NIS“, „lieky dokedy“, „AI rozhodne“.

## 6. Zdroje (URL overené v podkladoch tímu 16. 10. 2026)

- **Z** zadanie (`Zadani_ulohy`, `MDT_zapis`, `MDT zaver`), `docs/materials/drive/cesta-pacienta-data/`
- **D** deck VZP (rovnaký balík), podľa `vzp-cesta-pacienta.md` §1.3; nečítaný priamo
- **S1** FN Olomouc (4. 11. 2025) https://www.fnol.cz/aktuality/koordinatorka-onkologicke-pece-pomaha-ve-fn-olomouc-pacientum-v-nelehke-situaci-i-zdravotnikum-pri-jejich-praci
- **S2** Zdravotnický deník, ZD (4. 6. 2026) https://www.zdravotnickydenik.cz/2026/06/koordinator-zkracuje-pacientum-cestu-k-lecbe-rakoviny/
- **S3** Věstník MZ 11/2025, čl. 6 https://portal.gov.cz/vestniky/pv8aaxd/1556005765.pdf
- **S4** 432/2025 Sb., bod 8.5 https://www.zakonyprolidi.cz/cs/2025-432 ; 134/1998 Sb. https://www.zakonyprolidi.cz/cs/1998-134
- **S5** VZP (14. 9. 2026) https://www.vzp.cz/o-nas/tiskove-centrum/otazky-tydne/pristup-do-lekoveho-zaznamu
- **S6** VZP B2B https://vzp.cz/e-vzp/b2b-komunikace/prehled-poskytovanych-sluzeb-b2b
- **S7** VZP https://www.vzp.cz/o-nas/nejcasteji-resite/otazka/proc-nejsou-v-aplikaci-moje-vzp-on-line-udaje-o-cerpane-zdravotni-peci
- **S8** NHS Digital, zrkadlo (6. 3. 2018) https://nhsd-proxy.openprescribing.net/blog/transformation-blog/2018/nhs-e-referral-service-paper-switch-off
- **S9** ZD (15. 8. 2026) https://www.zdravotnickydenik.cz/2026/08/povinne-e-zadanky-uz-pristi-rok-komory-maji-jednu-zasadni-vyhradu/
- **S10** MZ, pokyn HPB (od 1. 9. 2026) https://mzd.gov.cz/wp-content/uploads/2026/05/Metodicky-pokny_spadova-zodpovednost-HPB_akt.-14_09_26.pdf
- **S11** naše čítanie 13 správ: `vzp-cesta-pacienta.md` §1.8, `raw-audit-hry.md` krok 12
- **S12** Tichopad, pre-hack (15. 10. 2026), `02-prehack-prednasky.md` §1
