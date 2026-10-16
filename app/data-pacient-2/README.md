# Druhý fiktívny pacient – Josef Novák (60 r., adenokarcinóm pľúc)

**FIKTIVNÍ PACIENT – testovací data.** Žiadna skutočná osoba. Slúži na to, aby nikto nepovedal
„ušité na jednu pacientku“: iný orgán, iná poisťovňa (VZP 111), žiadanku do KOC píše pneumológ, nie praktik.

| Správa | Dátum | Čo to je |
|---|---|---|
| 01 | 24. 8. 2026 | Praktická lekárka → plicní ambulance |
| 02 | 26. 8. 2026 | RTG hrudníka |
| 03 | 3. 9. 2026 | Pneumológ – vstupné vyšetrenie (ECOG 1, spirometria) |
| 04 | 8. 9. 2026 | Laboratórium vrátane onkomarkerov (CEA, CYFRA 21-1, NSE) |
| 05 | 10. 9. 2026 | CT hrudníka – reakcia na jódovú kontrastnú látku |
| 06 | 17. 9. 2026 | Bronchoskopia s EBUS-TBNA (KOC Lipová) |
| 07 | 23. 9. 2026 | Histológia – adenokarcinóm, prediktívne markery „budú doplnené“ |
| 08 | 1. 10. 2026 | PET/CT (iné KOC – Nemocnice Severní) |
| 09 | 7. 10. 2026 | Epikríza a žiadosť o prevzatie do KOC (pneumológ) |
| 10 | 27. 10. 2026 | Nutričná ambulancia – **až po konzíliu** |

Konzílium (MDT): **22. 10. 2026**.

## Pasce (nové typy oproti Alene)
1. **Strana nádoru** – bronchoskopia (06) píše „levého horního laloku“, RTG/CT/PET/žiadanka pravý.
2. **Stratená alergia** – pri CT (05) reakcia na jódovú kontrastnú látku, žiadanka (09) uvádza „AA: neguje“.
3. **Iné rodné číslo** – laboratórium (04) má RČ …/1234, ostatné …/1243.
4. **Dodatok, ktorý neprišiel** – EGFR, ALK, ROS1, PD-L1 avizované v histológii (07), do konzília chýbajú.

Plus kontroly falošných poplachov: e-maily aj ECOG tu sú, otázka na konzílium je konkrétna,
plánovaný odber v odporúčaní (03) nie je „nemožný dátum“. Váha 76 kg je zapísaná ako „Váha“, nie „Hmotnost“.

## Spustenie
```bash
node data-pacient-2/build.mjs                 # .txt → source-pacient-2.json
npm run extract -- --case pacient-2           # → public/data/extracted-pacient-2.json
npm run eval -- --case pacient-2              # → public/data/eval-pacient-2.json (zlatá sada eval/gold-pacient-2.json)
```
