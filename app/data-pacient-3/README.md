# Pacient 3 – slepý test (FIKTIVNÍ PACIENT)

Všechna data jsou smyšlená: osoby, zařízení s označením „(fiktivní)“, telefony +420 6xx 000 xxx, e-maily @example.cz.
Sadu napsal agent **bez přístupu ke kódu, pravidlům a ostatním pacientům** – je to slepý test enginu.

**Pacient:** Vlastimil Brabec, muž, nar. 14. 3. 1958 (k MDT 68 let), RČ 580314/2158, ZP 211.
Adenokarcinom středního rekta (C20), mrT3c mrN1b, MRF+, EMVI+, CEA 7,8 µg/l, dMMR.
Komorbidity: hypertenze, paroxysmální fibrilace síní, DM 2. typu. Pečuje o manželku s Alzheimerovou chorobou.
Kontaktní osoba: dcera Petra Malá.

**Datum MDT: 2026-09-02** (kolorektální MDT KOC, Fakultní nemocnice Hradní (fiktivní)).
Předávka se plní jen ze zpráv 01–09. Zpráva 10 je po MDT a **nesmí se použít**.

## Časová osa

| # | Datum | Zpráva | Co obsahuje (tučně = souvisí s pastí) |
|---|---|---|---|
| 01 | 2026-07-06 | Praktický lékař – doporučení na koloskopii | krev ve stolici od poloviny května, anémie (Hb 104), TOKS+, OA, FA s warfarinem, „AA: neguje“, 86 kg / 178 cm, kontakty |
| 02 | 2026-07-20 | Protokol koloskopie (ON Rybníky) | tumor rekta 7–11 cm od anu, biopsie, polypektomie, „Alergie: neudává“ |
| 03 | 2026-07-24 | Histologie B-2026-07118 | adenokarcinom low-grade; **MMR „bude sdělen formou dodatku“** |
| 04 | 2026-07-30 | CT hrudníku, břicha a pánve | 3 mezorektální uzliny; **ložisko 8 mm v S7 jater, nejasné → doporučena MR jater**; **kopřivka po jodové k. l., premedikace** |
| 05 | 2026-08-03 | Laboratoř (výsledkový list) | Hb 109, INR 2,1 (warfarin), CEA 7,8 (H), CA 19-9 18 |
| 06 | 2026-08-06 | MR malé pánve (MR centrum Medicon Plus) | mrT3c, mrN1b, MRF+ (1 mm), EMVI+, dolní okraj 7 cm od anu |
| 07 | 2026-08-11 | Kardiologie | **warfarin trvale vysazen → Eliquis (apixaban) 5 mg 1-0-1 od 12. 8.**; 83 kg; EF LK 55 % |
| 08 | 2026-08-19 | Žádost chirurga o MDT do KOC | otázka pro MDT, přání pacienta, kontakty, 82 kg, ECOG prázdné; **„cM0“, „FA: Warfarin“, „AA: neguje“, „MMR/MSI není k dispozici“** |
| 09 | 2026-08-26 | Dodatek k histologii | **dMMR (ztráta MLH1 a PMS2), MSI-H**, doporučení BRAF/MLH1 a genetické konzultace |
| — | **2026-09-02** | **MDT** | stav předávky k tomuto datu |
| 10 | 2026-09-09 | Onkologie KOC po MDT – **nepoužít** | závěr MDT (dostarlimab), MR jater = prostá cysta, ECOG PS 0, 80 kg, CEA 6,9, Hb 121 |

## Pasti (engine o nich neví)

1. **T1 – Nejasné ložisko v játrech vs. „cM0“.** CT 30. 7. popisuje v S7 jater ložisko 8 mm, u kterého nelze vyloučit metastázu, a doporučuje MR jater. Žádost o MDT to přepsala na „bez známek vzdálených metastáz (cM0)“ a MR jater do MDT nebyla provedena. Proč na tom záleží: MDT by rozhodovalo o lokální léčbě, přestože M-stadium není uzavřené. Výsledek „cysta“ je až ve zprávě 10 a v předávce se objevit nesmí.
2. **T2 – Alergie na jodovou kontrastní látku jen v popisu CT.** PL, gastroenterolog i novější žádost o MDT uvádějí „AA: neguje / neudává“. Proč na tom záleží: KOC bude plánovat další CT s kontrastem a operaci, takže alergie se nesmí ztratit. V předávce musí být uvedena s citací zprávy 04.
3. **T3 – Warfarin vs. apixaban.** Kardiolog 11. 8. trvale vysadil warfarin a nasadil Eliquis. Žádost z 19. 8. (novější dokument!) kopíruje starý lékový seznam s warfarinem. Proč na tom záleží: pravidlo „nejnovější vyhrává“ tady selže. Před operací a biopsií je nutné znát skutečné antikoagulans (jiné vysazování, riziko zdvojení). Správně je uvést apixaban s citací zprávy 07 a rozpor nahlásit.
4. **T4 – Dodatek k histologii (dMMR) až po odeslání žádosti.** Žádost uvádí, že MMR chybí. Dodatek z 26. 8. (poslaný jen gastroenterologii a chirurgii) prokazuje dMMR / MSI-H. Proč na tom záleží: u dMMR karcinomu rekta se zvažuje imunoterapie místo chemoradioterapie a je potřeba genetická konzultace (Lynchův syndrom). Tady naopak platí novější dokument, předávka musí citovat zprávu 09.

## Další očekávání (mimo pasti)

- **Stav výkonnosti = chybí.** Do MDT existuje jen slovní popis („celkově dobrý stav, soběstačný“) a prázdná kolonka „PS dle ECOG: ---“. ECOG PS 0 je až po MDT.
- **Hmotnost:** platí 82 kg / 178 cm (19. 8.). Starší údaje jsou 86 a 83 kg, 80 kg je až po MDT.
- **Věk 68:** dopočítá se z data narození, případně z „68letý“ v žádosti.
- Nic se nesmí citovat ze zprávy 10, ani hodnoty CEA 6,9, Hb 121, „cysta“ a „dostarlimab“.

## Soubory

- `01_…txt` až `10_…txt` – zprávy v prostém textu; první řádek je vždy „FIKTIVNÍ PACIENT – testovací data pro Rakathon 2026“.
- `source-pacient-3.json` – vstup pro engine (`mdtDate` 2026-09-02, texty zpráv).
- `gold-pacient-3.json` – správná předávka k 2026-09-02 (20 polí) a 4 pasti se strukturními kontrolami.
