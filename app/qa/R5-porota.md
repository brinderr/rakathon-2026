# R5 – pohľad poroty (onkológ + človek z VZP + IT architekt), sobotná obchôdzka, 3 minúty

_So 17. 10. 2026, ráno. Prešiel som všetkých 44 screenshotov v `design/shots/` (stav 03:03–03:04) a kód stránok. V kóde som nič nemenil._

Typ nálezu: **(a)** zmätie · **(b)** vyvolá nedôveru · **(c)** chýba, aby porotca povedal „toto chcem v našom KOC“.
Námaha: **S** = do 30 min · **M** = 1–2 h.
Zoradené podľa dopadu na porotu.

---

## 1. Varovanie tramadol + antidepresíva sa stratí, prípad sa zavrie s otvorenými krokmi (b + c) · M
**Kto sa ozve:** onkológ aj VZP. Je to presne téma výzvy „bez ztráty informací“.
**Obrazovky:** 26-zaznam-po-uzavreti, 20-pripad-uzavrety, 27-fronta-uzavrety, 03-pripad-podklad (časová os Vyšetrenia), 08-zaver-praktik.
**Problém:**
- Správa 12 (algeziológ 26. 10.) aj správa 13 (psychológ 27. 10.) výslovne varujú: „tramadol zvyšuje riziko serotoninového syndromu v kombinaci s antidepresivy (SSRI, SNRI)“ (12) a „Pacientka užívá tramadol – při volbě antidepresiva zohlednit riziko serotoninového syndromu.“ (13). Psychiatria je objednaná na **3. 11.**
- V appke sa to nikde neukáže. Zhrnutie správy 12 píše len „Nasadená nová liečba bolesti“ a zhrnutie správy 13 varovanie vynecháva (`src/data/cases.ts`, `ALENA_EXAMS`). V `src` nie je slovo „tramadol“ ani raz.
- Pole „Lieky, ktoré užíva“ ostane aj po 27. 10. na stave z 2. 10. (paracetamol max. 4×). Nové lieky zo správy 12 chýbajú (tramadol 100 mg 1-0-1, metamizol, paracetamol max. 3×, metoklopramid, laktulóza). Rovnako váha 63 kg zo správy 12.
- Prípad sa **uzavrie 22. 10.**, hoci v Ceste sú ešte 2 objednané kroky (algeziológ 26. 10., psychológ 27. 10.). Správy 12 a 13 potom prídu do uzavretého prípadu „bez zásahu koordinátora“.

**Oprava:**
- Pri „stav k dátumu“ ≥ 26. 10. zobraziť na Prehľade červenú kartu **„Upozornenie, ktoré musí ísť ďalej“**: „Tramadol + antidepresíva = riziko serotonínového syndrómu. Píšu to správa 12 aj 13. Psychiatria je objednaná na 3. 11.“ K tomu dva doslovné citáty a tlačidlo **„Pripraviť správu pre psychiatriu a praktika“** (koncept, simulované, znovu použiť `RequestModal`). Nie je to odporúčanie liečby, len posunutie varovania od lekárov.
- Pole Lieky: od 26. 10. nová verzia zo správy 12 s citátmi a poznámka „zmena 26. 10. (algeziológ)“.
- Uzavretie: tlačidlo „Uzavrieť“ povoliť až po doručení výsledkov krokov „Po konzíliu“. Inak text „Uzavrieť nejde: čakáme na 2 kroky po konzíliu (26. 10., 27. 10.)“. Ak príde správa do uzavretého prípadu, nech sa prípad znova otvorí a vo fronte zobrazí „Nová správa po uzavretí – skontrolovať“.

## 2. Riadok rozporu nehovorí, v čom je rozpor, a údaje z cudzieho RČ vyzerajú platne (a + b) · S
**Kto sa ozve:** všetci traja do 30 sekúnd od otvorenia prípadu.
**Obrazovky:** 02-pripad-alena, 03-pripad-podklad, 22-pripad-po-deme, 28-novak-pripad, 28b.
**Problém:** Riadok ukáže A/B a pod tým `note`, nie `conflict.explain`. Pri histológii stojí „A Odber vzorky 20. 10. · B Správa vydaná 19. 10.“ a pod tým „Výsledok bol sľúbený do 3 pracovných dní…“. Porotca nepochopí, kde je problém. Vysvetlenie („Správa je vydaná deň pred uvedeným odberom… Jeden z dátumov je chybný“) je len v bočnom paneli. Ešte horšie je to u Josefa, pole 18: hodnoty laboratória sú vypísané ako platné a pod nimi „Rodné číslo 660314/1243 vs RČ 660314/1234“. Poznámka pritom hovorí len „Uvedené všetky nádorové markery…“.
**Oprava:** `src/components/case/FieldList.tsx` (riadok s `cs-row-note`): pri `status === 'conflict'` vypísať `f.field.conflict.explain` (oranžovo, ikona výstrahy) namiesto `note`. Pri rozpore v rodnom čísle hodnotu zošednúť alebo prečiarknuť a pridať text „Nepoužívať, kým sa neoverí, či správa patrí pacientovi“.

## 3. Podklad pre konzílium berie nepotvrdené návrhy AI ako fakt a dá sa poslať (b) · M
**Kto sa ozve:** IT architekt („human in the loop“ platí len na obrazovke) a onkológ.
**Obrazovky:** 33-novak-mdt, 19-podklad-potvrdeny, 22-pripad-po-deme, 25-fronta-po-deme.
**Problém:**
- Josef má 0/20 potvrdených a 17 návrhov. Podklad MDT ich ukáže bez akéhokoľvek označenia. Počítadlá ukážu „23 údajov so zdrojom · **0 nie je v dokumentácii** · 3 rozpory“ a tlačidlo „Poslať lekárovi KOC na potvrdenie“ je aktívne. `applyOverrides` v `mdtModel.ts` status `proposed` iba prepustí a `MdtDoc.tsx` ho nezobrazí.
- Pri adenokarcinóme pľúc chýba dodatok **EGFR, ALK, ROS1, PD-L1**. Prípad ho hlási ako chýbajúci, ale podklad MDT píše „0 nie je v dokumentácii“.
- U Aleny lekár potvrdí podklad (19), kým sú ešte 2 návrhy nepotvrdené. Potom fronta a prípad píšu „Skontrolovať 2 návrhy a 1 rozpor pred konzíliom“ a ranný prehľad „konzílium 21. 10. má neúplný podklad“. Teda podklad je potvrdený a zároveň neúplný.

**Oprava:**
- V podklade MDT pri hodnote zo stavu `proposed` zobraziť pilulku „návrh – nepotvrdený“ (pri AI aj čip „AI“) a pridať počítadlo „17 návrhov čaká na kontrolu“.
- Do `preConfirm` doplniť „17 návrhov nepotvrdených“. Tlačidlo „Poslať lekárovi“ zablokovať s textom „Najprv skontroluj návrhy (17)“, alebo ho aspoň nechať sekundárne s výstrahou.
- V časti 5 doplniť riadok „Dodatok k histológii (EGFR, ALK, ROS1, PD-L1): avizovaný, neprišiel“ a započítať ho medzi chýbajúce.
- Po potvrdení lekárom ukázať v prípade aj vo fronte „Podklad potvrdil MUDr. Svoboda 19. 10. · 1 rozpor nechaný konzíliu“ namiesto „neúplný podklad“.

## 4. Lehota „z 33 dní“ (pankreas) sa ukazuje aj pri pľúcach, prsníku a čreve (b) · S
**Kto sa ozve:** onkológ okamžite.
**Obrazovky:** 01-fronta (všetky karty „deň X z 33“), 28-novak-pripad, 36-kucera.
**Problém:** Josef (pľúca), Kučera (pľúca), Pospíšilová (hrubé črevo) a Králová (prsník) majú „deň X z 33“ s textom „predvolená lehota (ukážka) · dánsky vzor pre pankreas“. Lekár to číta ako chybu v odbornosti.
**Oprava:** Pri inej diagnóze ako pankreas ukázať len „deň 12 od prijatia žiadosti“, bez „z 33“ a bez cieľa na pruhu (`Metrics.tsx:12/54`, `Queue.tsx:309`). Ak chcete cieľ pre pľúca, overené číslo je v `docs/kontext/raw-krajina-dk.md`: „Dánsko, pľúca (B26): štandard 41–45 dní do začiatku liečby (2025), zahraničný vzor“. Rozpis na fázy nemáme, preto nič ďalšie nedopĺňať.

## 5. Presnosť 20/20 · 17/17 · 0 · 72/72 pôsobí ako test na trénovacích dátach a „1 prijal“ straší (b) · S
**Kto sa ozve:** IT architekt.
**Obrazovky:** 01-fronta (Kontrola presnosti), 02b-pripad-meranie, 28b-novak-meranie.
**Problém:**
- Štyri stopercentné čísla na tých istých 2 pacientoch, na ktorých sa pravidlá ladili. Slovo „kontrolná sada“ naznačuje dáta, ktoré systém nevidel. Úprimné poučenie existuje v `src/data/eval.gen.ts` → `caveats` („predtým 18/20 polí, 6/13 pascí… ďalší pacient by mal prísť naslepo“), v UI sa však nezobrazuje.
- Fronta píše „4 z 5 návrhov program zamietol, **1 prijal**“. Znie to, akoby 1 halucinácia prešla. V skutočnosti bol prijatý návrh pravdivý (`mdtQuestion`, „prijaté – citát aj čísla overené“). Stránka prípadu pritom píše „v podklade ostalo 0 vymyslených“. Dve obrazovky teda hovoria každá niečo iné.
- „Odpoveď AI predpočítaná **náhradným modelom**“ vyvolá otázku „akým?“.

**Oprava:**
- „na kontrolnej sade“ → „na 2 fiktívnych pacientoch (pravidlá sme na nich ladili)“.
- Pridať riadok z `caveats`: „Prvý beh na Josefovi: 18/20 polí · 6/13 pascí → po úprave 20/20 · 13/13. Ďalší pacient príde naslepo.“
- Test poistky (`EvalCard.tsx:97` aj `case/EvalCard.tsx:158`) zjednotiť: „Úmyselne chybný model navrhol 5 hodnôt: 4 vymyslené program zamietol, 1 pravdivú prijal → v podklade 0 vymyslených.“
- „náhradným modelom“ → „odpoveď vygeneroval Claude na presne ten istý pseudonymizovaný prompt (v prevádzke Azure OpenAI EU)“, ako v `extracted-*.json` → `model`.

## 6. Po prvom prechode dema uvidí ďalší porotca Alenu „uzavretú 22. 10.“ v pondelok 19. 10. (a + b) · S
**Kto sa ozve:** každý ďalší porotca pri striedaní.
**Obrazovky:** 37-ukazka-8-krokov, 27-fronta-uzavrety.
**Problém:** Stav dema žije v pamäti (`caseSession.ts` a kontext v `App.tsx`). Funkcia `resetCaseSession` existuje, ale nikto ju nevolá. „Ukážka v 8 krokoch“ začína krokom 1 rovno v stave po deme: Alena je „uzavretá 22. 10.“, hoci je „dnes 19. 10.“, a v rannom prehľade už nie je. Pomôže len ručné obnovenie stránky.
**Oprava:** Krok 1 ukážky (`Shell.tsx`, tour) nech zavolá reset všetkých prípadov (`resetCaseSession` pre každý prípad + `reset` z `App.tsx:110`). Do hornej lišty dať nenápadný odkaz „Začať demo odznova“.

## 7. V podklade MDT chýba otázka praktika a želania pacientky (c) · S
**Kto sa ozve:** onkológ („na čo sa nás pýtajú?“).
**Obrazovky:** 07-podklad-mdt, 24-podklad-mdt-po-deme, 33-novak-mdt.
**Problém:** Šablóna MDT_zapis má 7 častí. Pole 10 „Otázka pre konzílium“ a pole 20 „Iné dôležité a želania pacientky“ (úzkosť, prosba o psychológa, súhlas so zdieľaním s dcérou) sa do podkladu nedostanú (`mdtModel.ts`, skladanie sekcií). Informácia sa teda stratí presne na konzíliu.
**Oprava:** Na začiatok časti 3 (alebo pred „6 Závěr MDT“) pridať rámik **„Otázka praktika pre konzílium“** s doslovným citátom zo správy 07 („Žádám o převzetí pacientky do péče KOC k dokončení diagnostiky … a stanovení dalšího postupu v rámci MDT.“). Do časti 4 pridať riadok **„Želania a sociálne“** (pole 20 s citátmi). Oba označiť drobným textom „doplnené nad rámec šablóny“.

## 8. „Moja bilancia“ ukazuje koruny a čísla nesedia so Záznamom (b) · S
**Kto sa ozve:** človek z VZP („gamifikujete vykazovanie?“).
**Obrazovky:** 01-fronta, 27-fronta-uzavrety vs. 20-pripad-uzavrety a 26-zaznam-po-uzavreti.
**Problém:**
- Hlavné číslo na osobnej karte koordinátorky je „9 dní so zásahom · Procházková · 2 250 Kč“. Pre poisťovňu to znie ako motivácia zapisovať viac zásahov.
- Po uzavretí karta stále píše „9“ a „deň 17 z 33 cesty“. Záznam pritom hovorí 10 dní a 2 500 Kč a karta prípadu „uzavreté za 20 dní“.
- „Na mne dnes 2“ a „Čaká na mňa 4“ sú dve takmer rovnaké frázy s inými číslami.

**Oprava:** V „Mojej bilancii“ (`Queue.tsx:347–356`) dať ako hlavné číslo „Slučky uzavreté tento týždeň“ a „Podklady kompletné načas“ (podľa kontraktu). Koruny presunúť iba do záložky Záznam s textom „podklad pre vykázanie · vykazuje nemocnica, uznáva poisťovňa“. Ak počet dní ostane, rátať ho zo zlúčeného záznamu (ten istý zdroj ako Záznam). „Na mne dnes“ premenovať na „S termínom dnes“.

---

## 9. Chýba pás bezpečnostných upozornení v hlavičke pacienta (c) · S–M
**Obrazovky:** 02-pripad-alena, 28-novak-pripad.
**Problém:** Antikoagulácia apixabanom (Alena), alergia na jódovú kontrastnú látku pred CT a PET (Josef) a nesediace RČ v správe N-04 (Josef) sú zahrabané v riadkoch podkladu.
**Oprava:** Pod meno pacienta dať tenký červený pás „Pozor: antikoagulácia – apixaban (správa 07) · …“. Každá položka bude mať citát a klik na originál. Pás obsahuje len fakty zo správ, bez odporúčania. Neskôr sem patrí aj tramadol z bodu 1.

## 10. Polovica zdrojov v podklade MDT nie je doslovný citát (b) · S / M
**Obrazovka:** 07-podklad-mdt (poznámky pod čiarou).
**Problém:** Hlavička píše „23 údajov so zdrojom“. Poznámky 6 a 13–22 sú však „zhrnutie správy (bez doslovného citátu)“. Hlavný sľub appky je „každá hodnota má citát doslova“ a lekár, ktorý klikne na poznámky, uvidí opak.
**Oprava (S):** Počítadlo rozdeliť na „11 doslovných citátov · 12 odkazov na celú správu“.
**Oprava (M):** Pre riadky vyšetrení použiť doslovné vety, ktoré už sú pri poli „Vykonané vyšetrenia“ (`cases.ts`: správy 03, 06, 08, 09), napr. „Tumor hlavy pankreatu 35 mm s venózním postižením VMS…“.

## 11. Časová os dema si protirečí a prezrádza budúcnosť (b) · S
**Obrazovky:** 26-zaznam-po-uzavreti, 19-podklad-potvrdeny, 28b-novak-meranie.
**Problém:**
- 19. 10. je v Zázname poradie „03:04 Podklad potvrdený lekárom KOC“ a až potom „12:40 Doručená histológia (11)“. Podklad pritom histológiu obsahuje. Na obchôdzke o 11:00 to bude „11:xx“, stále pred 12:40.
- Podklad píše „údaje známe k 21. 10. 2026“ a zároveň „Potvrdil … 19. 10. 2026“.
- Josef, pole 15, pri „stav k 19. 10.“ píše „Novšia hodnota 73 kg (správa 10, 27. 10. 2026)…“, teda budúcnosť presakuje.

**Oprava:**
- Čas demo úkonov = neskorší z (aktuálny čas, posledný záznam dňa + 5 min) (`MdtDoc.tsx:132–134`, rovnako v `CaseView`).
- Potvrdený podklad zamknúť na „údaje známe k dátumu potvrdenia“.
- Vetu o 73 kg skryť, kým `asOf` < 27. 10.

## 12. Nový prípad nemá tlačidlo na svoj ďalší krok a hlavné tlačidlo fronty prepína rolu (a) · S
**Obrazovky:** 36-kucera, 01-fronta.
**Problém:**
- U Kučeru (nový, bez konzília) je hlavné tlačidlo „Podklad pre konzílium“ a vedľa neho „Záver pre praktika“. Ďalší krok je „Prevziať žiadosť praktika a vyžiadať CT“, no tlačidlo naň nie je.
- Vo fronte je jediné fialové tlačidlo „Pohľad praktika: nová žiadanka“, čiže prepnutie do inej roly.

**Oprava:**
- `CaseHeader.tsx:55–56`: pri stave `new` dať ako hlavné tlačidlo „Prevziať žiadosť“ (zápis do záznamu, stav → aktívny). Tlačidlá Podklad a Záver skryť alebo zošednúť s textom „po zaradení na konzílium“.
- Vo fronte zmeniť tlačidlo praktika na sekundárne a presunúť ho do hornej lišty k „Ukážke v 8 krokoch“.

## 13. Príbeh ECOG protirečí zápisu konzília (b) · S
**Obrazovky:** 14-pole-doplnene vs. 08 / 20-zaver-praktik.
**Problém:** Demo doplní ECOG 1 ešte pred konzíliom (fiktívna správa 14). Záver konzília (dáta VZP) však píše „Před zahájením léčby: stanovit ECOG“. Onkológ sa spýta: „Tak sa ECOG na konzílium dostal, či nie?“
**Oprava:** Do záveru pre praktika pridať pod prvý bod drobný sivý text „ECOG 1 bol v podklade od 19. 10. (správa 14 – ukážka pre demo). Zápis konzília je fiktívny podklad VZP a ECOG ešte neuvádza.“ Alternatíva: v deme nechať ECOG „vyžiadaný, čaká na odpoveď“, potom to so zápisom sedí bez vysvetľovania.

## 14. Jazyk a gramatika v dokumentoch (a) · S
**Obrazovky:** 07, 19, 33 (podklad MDT), 28 a 32 (Josef).
**Problém:**
- Podklad MDT má české nadpisy („Jméno a příjmení“, „Léková anamnéza“) a slovenské hodnoty. Vo vete „chýba: e-mail (referující lékař)“ je čeština uprostred slovenčiny.
- Gramatika: „3 nie je v dokumentácii“, „2 nie je v dokumentácii“.
- U Josefa sú hodnoty aj „Vysvetlivka AI“ po česky, u Aleny po slovensky. Pôsobí to ako dva rôzne produkty.
- Rozpor laloka je pri Josefovi vytlačený dvakrát, aj pri „Kód diagnózy C34.1“, hoci kód stranu nerieši.

**Oprava:**
- Pod nadpis podkladu MDT pridať: „Šablóna VZP je v češtine, hodnoty v slovenčine, pôvodné vety sú v poznámkach.“
- Pilulku zmeniť na „chýba v dokumentácii: 3“.
- Pri AI poli doplniť „AI píše jazykom správy (čeština)“.
- Rozpor pri kóde MKN nevypisovať.

## 15. Drobnosti, ktoré za 3 minúty zmätú (a) · S
- 02 a 22: „Čo treba vyriešiť · **jedno sloveso na riadok**“ je interný dizajnový žargón. Zmazať, ostane „6 položiek“.
- 04 Cesta: „**7 z 7 krokov** k 19. 10.“ vedľa Prehľadu s „4/7 krokov s výsledkom“ (`CaseView.tsx:378`). Zmeniť na „7 krokov · 4 s výsledkom“.
- 05 Dokumenty: sekcia „Čakáme na“ (vyžiadané alebo objednané) obsahuje ECOG „chýba · vyžiadať“, hoci ešte nebol vyžiadaný. Dať ho do skupiny „Treba vyžiadať“.
- 02 Úplnosť podkladu: dlaždice „návrh“ a „rozpor“ majú skoro rovnakú broskyňovú farbu. Rozpor treba sýtejšou oranžovou a značkou „A/B“.
- 01 Ranný prehľad je jeden dlhý odsek s bodkami. Lepšie 3–4 riadky, každý s menom ako odkazom („Dnes urgovať: Pospíšilová – histológia mešká 3 dni“).
- 10 Žiadanka praktika: 2 z 5 „chýb“ sú e-maily. Praktik povie, že to nie je chyba. E-maily presunúť do „na vedomie“.
- 26: „8:16“ vs. „08:15“, jednotný formát času.

---

### Čo nechať, lebo porotu presvedčí
Klik na údaj, ktorý ukáže zvýraznenú vetu v origináli. Rozpor A/B vedľa seba s „Overené mimo systému“. Kontrolu žiadanky ešte pred odoslaním s potvrdením prijatia. Blok „Čo to znamená pre vás, pán doktor“ s pôvodnou otázkou praktika. Smerovanie na poisťovňu 211 namiesto VZP. Pätička je na každej obrazovke.

---

## Stav po 2. kole (záverečný integrátor, So 17. 10. ráno)

**Opravené:** #2, #3, #4, #5, #6, #7, #8, #9, #11 (zvyšok – veta o 73 kg pred 27. 10. zmizne), #12, #13, #14, #15 a väčšina #1 a #10. Podrobne v `qa/VYSLEDOK.md` → „2. kolo“.

**Zostáva:**
- **#1 (časť):** tlačidlo „Uzavrieť prípad“ sa nezablokovalo, lebo uzavretie je krok 8 ukážky. Namiesto toho karta pri uzavretí vypíše „Po konzíliu ešte bežia 2 kroky: Algeziológ 26. 10., Klinický psychológ 27. 10.“ a nová správa po uzavretí prípad sama znovu otvorí (hlavička „znovu otvorený · správa 12 po uzavretí“, ďalší krok „Nová správa po uzavretí – skontrolovať“). Fronta je pevne k 19. 10., preto „Nová správa po uzavretí“ vo fronte neuvidíte.
- **#10 (M):** riadky vyšetrení v podklade MDT sú stále slovenské zhrnutia s odkazom na celú správu. Počítadlo to teraz hovorí poctivo („13 doslovných citátov · 11 odkazov na celú správu“).
- **#12 (časť):** „Pohľad praktika: nová žiadanka“ je už sekundárne tlačidlo, ale ostalo vo fronte (presun do hornej lišty by na mobile zahltil lištu).
- **#4 (voliteľné):** dánsky cieľ pre pľúca (41–45 dní) sme nepridali. Pri inej diagnóze ako pankreas appka ukazuje len „deň X od prijatia žiadosti“ bez cieľa.
- **#14 (časť):** hodnoty u Josefa ostávajú po česky (tak ich napísal model zo správ). Pri poli je „Vysvetlivka AI (píše jazykom správy)“ a v podklade MDT veta o jazyku šablóny.
