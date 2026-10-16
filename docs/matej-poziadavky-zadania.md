# Požiadavky zadania VZP „Cesta pacienta bez ztráty informací“: kontrolný zoznam

_Matej (Claude), 17. 10. 2026. Zdroj: prezentácia VZP (slidy 6–12) a `Zadani_ulohy.docx` / `Handover_obsah.docx`
v `docs/materials/drive/cesta-pacienta-data/`. Ako ich splníme a prekonáme: `docs/matej-idealny-system.md`
a `docs/matej-overdeliver.md`._

## Celková úloha (slide 6)
- Funkčný prototyp, ktorý prevedie **jeden onkologický prípad** od odoslania po spätnú väzbu **bez straty informácií**.
- Výstup: **jedna diagnóza a funkčné demo celého priechodu**.
- 4 kroky: **01 Prevziať → 02 Vyťažiť → 03 Koordinovať → 04 Spätná väzba**.

## 01 PREVZIAŤ (slide 7)
1. Vstupná obrazovka na odoslanie pacienta do vybraného KOC.
2. Externý lekár vyberie KOC zo zoznamu, vyplní svoje údaje a nacionále, priloží epikrízu a podozrivú diagnózu,
   nahrá správy zo svojho ambulantného softvéru.
3. Ručné vypĺňanie na minimum, ostatné prevziať z nahranej správy.
4. **Nevytvárať ďalší rozsiahly formulár.**
5. **Hotovo, keď** koordinátor dostane všetky potrebné informácie **v jednom kroku**.

## 02 VYŤAŽIŤ (slide 8)
6. AI automaticky vytiahne kľúčové údaje do vopred definovanej štruktúry (`Handover_obsah`).
7. Odhaliť a označiť, čo chýba.
8. Výstup v **kopírovateľných častiach**.
9. **Lekár návrh skontroluje a potvrdí** („AI iba pripraví návrh, rozhoduje človek“).
10. Koordinátor môže cez softvér kontaktovať lekára a vyžiadať doplňujúce informácie.
11. **Hotovo, keď** koordinátor vidí lekárom potvrdený handover a zoznam chýbajúcich údajov.

## 03 KOORDINOVAŤ: dashboard (slide 9)
12. Pracovná fronta: **nový** (čaká na prevzatie) / **aktívny** (prebieha diagnostika) / **odložený** (čaká na
    externý krok).
13. Detail pacienta: kontext z odoslania (štruktúrovaná správa aj originál) a **úlohy s termínmi a prioritou**.
14. Každý nový pacient pristane v dashboarde príslušného KOC.
15. Všetci pacienti na jednom mieste, komunikácia s lekárom aj pacientom.
16. **Hotovo, keď** pri každom pacientovi vidno **stav, termín a kto je na ťahu**.

## 03 KOORDINOVAŤ: cesta pacienta (slide 10)
17. Jednorazová úloha alebo **sada krokov pre diagnózu** (napr. karcinóm pankreasu).
18. Strážiť poradie krokov (čo musí predchádzať čomu), termíny a stav prípadu.
19. Komunikácia: **e-mail, SMS, chat**.
20. **Notifikácie**: strážiť termíny.
21. **Hotovo, keď** je jasné, kde prípad je, kto je na ťahu a do kedy.

## 04 SPÄTNÁ VÄZBA (slide 11)
22. Koordinátor vyberie prípad a nahrá správu z MDT.
23. Odosielajúci lekár dostane štruktúrovaný výsledok **vrátane pôvodného kontextu**.
24. **Revízny lekár** dostane informáciu **automaticky** (roztriedenú AI do štruktúry).
25. Revízny lekár si môže od koordinátora vyžiadať doplnenie.
26. **Potvrdiť odovzdanie a uzavrieť prípad.**
27. **Hotovo, keď** odosielajúci lekár má výsledok s kontextom a odovzdanie je potvrdené.

## Čo musí demo ukázať (slide 12)
- ☐ Odoslanie do KOC bez ďalšieho formulára (01)
- ☐ AI vyťaženie s kontrolou úplnosti (02)
- ☐ Prehľad prípadov so stavom a termínom (03)
- ☐ Vlastník každého ďalšieho kroku (03)
- ☐ Štruktúrovaný záver KOC/MDT (04)
- ☐ Spätná väzba a potvrdené odovzdanie (04)

„Rakathon overí princíp. Produkčná integrácia patrí do ďalšej fázy.“

## Doplnok zo `Zadani_ulohy.docx`
- Nasimulovať prácu koordinátora KOC u pacientky **Aleny Procházkovej** (13 správ).
- Vytvoriť **handover pre MDT, ktoré sa koná 21. 10. 2026**. Neskoršie správy do podkladu nepatria.
- AI označí chýbajúce podklady. Koordinátor ich **doplní** a aplikácia ich **zapracuje do handoveru**.
- **Správu z MDT aplikácia pošle praktickému lekárovi** (vzor `MDT zaver`). Údaje na predstavenie pacienta na MDT
  sú v `MDT_zapis`.

## Polia handoveru (`Handover_obsah.docx`)
- **Nacionále:** meno, priezvisko, vek, pohlavie, číslo zdravotnej poisťovne
- **Kontakty:** kontakt na pacienta, kontaktná osoba a jej telefón
- **Klinický prehľad:** diagnóza, epikríza, **požiadavka alebo otázka na MDT**
- **Anamnéza:** komorbidity (OA), lieková anamnéza (FA), alergie (AA)
- **Stav pacienta:** výkonnostný stav (PS / Karnofsky), váha a výška, symptómy a ich začiatok
- **Vykonané vyšetrenia:** dátum, miesto, typ, popis výsledkov v plnom znení
- **Laboratórne výsledky** vrátane onkomarkerov
- **Histológia** (ak existuje)
- **Iné dôležité oznámenia** vrátane želaní pacienta

## Rozdiely oproti `docs/IDEALNE-RIESENIE.md`, ktoré treba vyriešiť
- **Bod 1:** zadanie chce vstupnú obrazovku pre lekára. Brunov návrh rieši vstup e-mailom (bez nového účtu pre praktika).
  Riešenie: jednoduchá stránka bez registrácie.
- **Bod 19:** SMS a chat. Brunov návrh pokrýva len e-mail a telefón. Riešenie: aspoň simulované.
- **Bod 24:** revízny lekár. V Brunovom návrhu je v zozname „nerobiť“. Riešenie: aspoň simulovaný súhrn, inak
  nesplníme slide 12.
