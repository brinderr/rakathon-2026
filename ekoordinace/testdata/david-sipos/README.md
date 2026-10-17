# Testovací pacient David Sipos (FIKTIVNÍ)

Běžný případ pro vyzkoušení nahrávání zpráv v eKoordinaci. Všechna data jsou smyšlená: osoby, zařízení „(fiktivní)“,
telefony +420 xxx 000 xxx, e-maily @example.cz.

**Ke stažení (Word):** https://ekoordinace.vercel.app/test/david-sipos.zip (10 × .docx), jednotlivě v
`ekoordinace/public/test/david-sipos/`. Tady jsou stejné zprávy jako text (`.txt`) – přesně to, co appka z Wordu přečte.

**Jak zkusit:** Pacienti → Nový pacient → jméno „David Sipos“, termín konzilia 22. 10. 2026 → přetáhnout všech 10 souborů.

**Pacient:** David Sipos, muž, nar. 9. 5. 1968 (58 let), RČ 680509/1722, ZP 205 (ČPZP), řidič autobusu, manželka Jana.
Adenokarcinom antra žaludku (C16.3), cT3 N1, praktická lékařka MUDr. Hana Benešová žádá KOC o převzetí a MDT:
perioperační chemoterapie vs. primární resekce.

| # | Datum | Zpráva |
|---|---|---|
| 01 | 21. 8. | Laboratoř u praktika – anémie (Hb 104), ferritin 9 |
| 02 | 24. 8. | Praktická lékařka – epikríza, odeslání na gastroskopii |
| 03 | 9. 9. | Gastroskopie – exulcerovaný tumor antra, biopsie |
| 04 | 14. 9. | Histologie – adenokarcinom, intestinální typ, G2 |
| 05 | 21. 9. | CT hrudníku a břicha – cT3 N1, nejasné ložisko 7 mm v S4 jater |
| 06 | 28. 9. | Praktická lékařka – žádost o převzetí do péče KOC a MDT |
| 07 | 6. 10. | KOC – EUS: uT3 N1 |
| 08 | 12. 10. | KOC – laboratoř a markery (CEA, CA 19-9, CA 72-4 zvýšené) |
| 09 | 13. 10. | KOC – kardiologie: klopidogrel trvale vysazen |
| 10 | 19. 10. | KOC – nutriční ambulance: 79 kg, riziko malnutrice (dnes nové) |

## Co je schválně špatně (appka má najít všech 6)

1. **ECOG chybí** – všude jen „soběstačný“.
2. **Alergie:** gastroskopie 9. 9. „exantém po amoxicilinu“, novější žádost 28. 9. „AA: neguje“.
3. **Léky:** žádost 28. 9. má v lécích klopidogrel, kardiolog ho 13. 10. trvale vysadil.
4. **M-stadium:** žádost píše „bez vzdálených metastáz (cM0)“, CT 21. 9. „metastázu nelze vyloučit“ (MR jater neproběhla).
5. **Histologie neúplná:** HER2 a MMR „budou sděleny formou dodatku“ – dodatek nepřišel (u žaludku rozhoduje o léčbě).
6. **Jiné rodné číslo:** laboratoř 21. 8. má RČ 680905/1722 (přehozený den a měsíc) – patří vůbec pacientovi?

Mimo pasti: kontakt na pacienta je úplný (telefon i e-mail), váha 79 kg je z 19. 10.
