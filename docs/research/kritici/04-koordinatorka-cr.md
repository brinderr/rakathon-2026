# 04 – Koordinátorka českého KOC: môj pondelok s appkou

## Verdikt
Každý deň by som použila „Na mne dnes“, urgenciu s hotovým konceptom a pred konzíliom podklad s citátmi a rozpormi; to je reálna úspora. Pri ~10 nových pacientoch týždenne na koordinátorku ([ZD 6/2026](https://www.zdravotnickydenik.cz/2026/06/koordinator-zkracuje-pacientum-cestu-k-lecbe-rakoviny/)) mi však chýba to, na čo padne väčšina dňa: voľné termíny, kontakty, pripomienky, zástup a prehľad pre primára. Najväčšia vecná chyba: prípad sa „uzavrie“ listom praktikovi, hoci MZ meria cestu až po začiatok liečby.

## Top nálezy

**1. Prípad sa uzavrie pred začiatkom liečby**
- Dôkaz: shots/20 „prípad uzavretý“ a „sledujeme ďalej: algeziológ, psychológ“. Termín u onkológa 4. 11. je len v texte (`GpReport.tsx`). Věstník MZ 11/2025, čl. 7 má lokálny indikátor „doba od prvního kontaktu do zahájení prvoliniové léčby dle diagnóz“ ([Věstník](https://portal.gov.cz/vestniky/pv8aaxd/1556005765.pdf)).
- Zmena: po odoslaní záveru má prípad stav „čeká na zahájení léčby“. Posledný krok Cesty je „Zahájení léčby – neoadjuvantní CHT, plán 4. 11.“ s citátom z MDT. Počítadlo dní beží od 2. 10. až po tento krok.
- Dopad: **vysoký**. Práca: 1,5 h.

**2. Voľný termín je len veta v texte**
- Dôkaz: „V KOC 2 nebol voľný termín“ (`cases.ts:572`, shots/06). V `src` nie je kalendár ani termín, ktorý sa dá vybrať. MZ 2. 9. 2026 píše: „Připravuje se také sdílený přehled pracovišť a kapacit, zejména u zobrazovacích metod“ ([MZ](https://mzd.gov.cz/tiskove-centrum-mz/jeden-kontakt-mene-cekani-rychlejsi-cesta-k-lecbe-koordinatori-meni-peci-o-onkologicke-pacienty/)).
- Zmena: pri kroku CT bude tlačidlo „Najít termín“. Ukáže 3 ilustračné pracoviská a pri každom najbližší termín. Výber zapíše miesto, termín a stav „objednané“ do Cesty aj do Záznamu.
- Dopad: **vysoký**, lebo je to presne to, čo MZ chystá. Práca: 2 h.

**3. Appka nevie, kde končí moja rola**
- Dôkaz: podľa MZ musí koordinátorka „vědět, kdy má situaci předat zdravotníkovi“ (tá istá stránka MZ). Záver MDT sám vymenúva varovné príznaky: horúčka, zimnica, žltačka (shots/08). Okno „Zapsat telefonát“ (`PhoneNoteModal.tsx`) ich nesleduje.
- Zmena: ak zápis telefonátu obsahuje príznak z tohto zoznamu, vyskočí červené „Předat lékaři hned“ s kontaktom ošetrujúceho lekára a citátom. Udalosť sa zapíše do Záznamu. Nejde o AI triáž, zoznam príznakov napísal lekár.
- Dopad: **vysoký** (bezpečnosť, kritérium 2). Práca: 1–1,5 h.

**4. „Konzílium“ je jeden pacient, nie celé zasadnutie**
- Dôkaz: položka „Konzílium 21. 10.“ v bočnom paneli otvorí iba podklad Aleny (shots/07). Ja však pripravujem celé zasadnutie MDT.
- Zmena: stránka „Program MDT 21. 10.“ so zoznamom pacientov. Pri každom bude pripravenosť (14/20, chýba ECOG, 2 rozpory) a tlačidlo „Poslat členům MDT“ (jedno PDF).
- Dopad: stredný. Práca: 1,5 h.

**5. Fronta má jedného človeka, KOC má tím**
- Dôkaz: „Lucie“ je natvrdo v `Shell.tsx`, všade „na ťahu: ja“. FNOL delí koordinátorky podľa diagnóz s rôznym pracovným časom ([FNOL](https://onkologie.fnol.cz/koordinatorka-onkologicke-lecby)), Jihlava má 3 so spoločným e-mailom a telefónom ([Jihlava](https://www.nemji.cz/en/oddeleni/onkologicke-oddeleni/onko-koo/)), na Bulovke diagnostická koordinátorka odovzdáva pacienta koordinátorom liečby (ZD).
- Zmena: „na ťahu“ ukáže meno, filter Moje / Tým / Zastupuji, rozdelenie podľa diagnóz, tlačidlo „Předat kolegyni“ (formát poznámky navrhuje kritik 03).
- Dopad: stredný až vysoký (škálovateľnosť). Práca: 2 h.

**6. Prehľad pre primára nehovorí jazykom MZ**
- Dôkaz: Věstník čl. 7 chce indikátory „dle diagnóz (u solidních nádorů i dle klinických stádií)“: počet MDT, počet intervencií koordinátoriek a čas do začiatku liečby. Pole klinické štádium appka nemá.
- Zmena: namiesto bilancie stránka „Přehled pro primáře“ s týmito 3 indikátormi a tabuľkou „Kde se čeká“ (napr. patológia KOC 2 +4 dni). Export do CSV, pole „klinické stadium (z MDT)“; u Aleny „není v dokumentaci“.
- Dopad: **vysoký** pre VZP. Práca: 2–2,5 h.

**7. Záznam o koordinovaní nespĺňa Věstník**
- Dôkaz: podľa Věstníka (čl. 6, ods. 3 a 4) koordinátorka pracuje „na základě písemného vyžádání ošetřujících lékařů“ a úkony „průkazně dokumentuje“. Záznam (shots/06) neuvádza, kto o úkon žiadal ani kto ho urobil.
- Zmena: stĺpce „Na žádost“ (lekár a dokument) a „Provedla“. Tlačidlo „Záznam o koordinování (PDF)“.
- Dopad: stredný (regulácia). Práca: 1 h.

**8. Chýbajú kontakty na pracoviská a pripomienky**
- Dôkaz: urgencia pozná len „KOC 2 · patológia, e-mail“ (shots/43), bez mena, telefónu a ordinačných hodín. Pripomienka v kóde nie je, hoci zadanie (bod 20) chce strážiť termíny. Vaňková hovorí, že kľúčové je vedieť, na koho sa obrátiť (ZD).
- Zmena:
  - stránka „Kontakty“: osoba, telefón, hodiny, preferovaný kanál a typické meškanie zo Záznamu,
  - v telefonáte a v urgencii pole „Připomenout dne“; pripomienka sa v ten deň objaví v „Na mně dnes“.
- Dopad: stredný. Práca: 1,5 h.

Ak do 13:00 stihneme len tri veci: 1, 3 a 7 (spolu asi 4 h).

## Nové nápady zo sveta
1. **Kontrola pripravenosti 2 dni pred MDT (NHS).** V pilote Barts sa 2 dni pred MDT stretol triážny panel aj s MDT koordinátorom; zoznam na MDT klesol z 89 na 57 pacientov (−35 %), okrem iného vďaka tomu, že sa neprejednávali prípady s neúplnými údajmi ([NHS 2020](https://www.england.nhs.uk/wp-content/uploads/2020/01/multi-disciplinary-team-streamlining-guidance.pdf)). V appke: „Program MDT“ 48 h vopred ukáže „Pripravené 3/5; Procházková: chýba ECOG“ → „doplniť“ alebo „presunúť na ďalšie MDT“.
2. **Zdvojená žiadanka (Nórsko).** Pacient poslaný praktikom zvlášť na rádiológiu a zvlášť do cesty skončí v dvoch poradovníkoch; zachytia to len koordinátorky, „ikkje system“ ([Helse Vest 2025, s. 53](https://www.helse-vest.no/4a5cbd/contentassets/7b08f25571d846ffbcbcf40af13cf76a/internrevisjon-av-pakkeforlop-for-kreft.pdf)). V appke: motor porovná rodné číslo a typ vyšetrenia → „CT brucha už objednané 8. 10. v KOC 1 – zdvojená žiadanka?“.
3. **Zástup a potvrdené prevzatie (Nórsko).** Audit: niekde je rola na jednej osobe bez zástupu; keď v Hammerfeste koordinátorka chýbala, podiel pacientov s rakovinou hrubého čreva zaradených do cesty klesol z 90 % na 65 %; pri presune do inej nemocnice prijímajúca koordinátorka zvyčajne nedostane správu ([Helse Nord 2025](https://www.helse-nord.no/4a6af7/siteassets/dokumenter-og-blokker/4-om-oss/styret/styremoter/styremoter-2025/20250925/styresak-096-2025-internrevisjonsrapport-1-2025-pakkeforlop-kreft-i-helse-nord.pdf)). V appke: každý prípad má zástupkyňu, odovzdanie do iného KOC/ROC dostane doručenku ako list praktikovi.
4. **Kontrolný bod ROC (slovami VZP).** MUDr. Sajdlová (VZP), Onkoforum 2026: ROC „v předem dohodnutém intervalu referuje do KOC“, kópia záznamu ide do KOC pre revíznu činnosť VZP ([Onkoforum](https://www.linkos.cz/files/pro_odborniky/napl_onko_prog/sled_predikce_onko/Forum/2026_04/8_Onkoforum-04_2026_Sajdlova.pdf)). V appke: krok „Delegováno do ROC“ s pripomienkou „čekám zprávu z ROC do …“; po príchode ide revíznemu lekárovi.
5. **Ponúknuť iné pracovisko (Dánsko).** Ak región pre kapacitu nestihne lehotu, musí ponúknuť inú nemocnicu ([Danske Regioner](https://www.regioner.dk/media/rupbf04u/faktaark-hvad-er-de-maksimale-ventetider.pdf)); MZ: pri fast-track by sa čakanie malo „ideálně pohybovat do dvou týdnů“. V appke: ak je najbližší termín ďalej ako 14 dní, „Najít termín“ sám ponúkne iné pracovisko.

## Čo nerobiť
1. **Vlastný objednávací systém.** Termíny vlastní NIS alebo RIS nemocnice. Panel termínov označiť ako ilustračný a v pitchi hovoriť o napojení na prehľad kapacít MZ, nie „objednávame“.
2. **Koruny kdekoľvek.** Kč sú ešte aj v Zázname (shots/06, „250 Kč“ pri každom dni) a pri závere („2 500 Kč“, shots/20). Rozhodnutie o bilancii treba dotiahnuť do konca.
3. **Vypočítaná priorita.** Podľa Věstníka (čl. 6, ods. 3) koordinátorka prioritizuje „na základě doporučení ošetřujícího lékaře“, najmä pri C34 a C25. Stačí štítok „fast-track (C25) · podle MUDr. Řezníčka“.
