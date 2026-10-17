# 11 – Svet na YouTube: čo ukazujú demá veľkých hráčov

Pozreté titulky 17 videí: Abridge, Nuance DAX a Dragon Copilot, Microsoft/Stanford (tumor board), navify Tumor Board, Tempus One, Epic AI, Carta Lighthouse, Cerner (triáž onkologických žiadaniek), Komodo, Voxelomics, Somerset Cancer Register (NHS), estónsky portál a Pieces. Časy v odkazoch sú začiatky 20-sekundových úsekov titulkov (±20 s).

## Verdikt
V hlavnom „wow“ momente svetových dem (klik na vetu ukáže presné miesto v zdroji a rozpor sa ukáže vedľa seba namiesto hádania) je appka na úrovni špičky a navyše beží bez cloudu, čo veľkí hráči neponúkajú. Zaostávame v tom, čo svet s vyťaženým textom robí ďalej: odporúčania zo správ sa nemenia na úlohy, oprava človekom po sebe nenechá stopu a záver pre praktika vety so zdrojom nespája. Je to zhruba 6–8 hodín práce na hotovom motore, nie nový produkt, a zadávatelia VZP to pri klikaní uvidia hneď.

## Matica funkcií (oni vs my)
| Funkcia | Kto to ukazuje | My |
|---|---|---|
| Klik na vetu → zdroj | Abridge [15:35](https://www.youtube.com/watch?v=qXPBXhUrjMc&t=935), Carta [11:29](https://www.youtube.com/watch?v=oYu37qC4LV0&t=689) | áno; v závere pre praktika nie |
| Rozpor: obe verzie s dôkazom | Carta [22:30](https://www.youtube.com/watch?v=oYu37qC4LV0&t=1350) | áno (A/B) |
| „Nie“ s vysvetlením prečo | Carta [14:09](https://www.youtube.com/watch?v=oYu37qC4LV0&t=849) | áno (ECOG) |
| Odporúčania zo správ → úlohy | Epic [1:10](https://www.youtube.com/watch?v=BIIWqlCrXAA&t=70) | **nie** |
| Pracovný zoznam: vybavené samo zmizne, „pozdržané: chýba CT“ | Cerner [6:38](https://www.youtube.com/watch?v=8rrJvVzPau8&t=398), [7:31](https://www.youtube.com/watch?v=8rrJvVzPau8&t=451); NHS SCR [0:23](https://www.youtube.com/watch?v=8Dl-ZwDFm9Y&t=23) | karty, kroky ručne |
| Oprava + dôvod → spätná väzba | DAX [7:36](https://www.youtube.com/watch?v=tBulTCOVWg8&t=456), Carta [15:46](https://www.youtube.com/watch?v=oYu37qC4LV0&t=946) | **len „Potvrdit“** |
| Otázka nad prípadom so zdrojom | Dragon Copilot [8:08](https://www.youtube.com/watch?v=RuEyGi2dowM&t=488), Tempus One [1:03](https://www.youtube.com/watch?v=fO0Hqg4oz_g&t=63) | nie |
| Režim pre konzílium | navify [2:27](https://www.youtube.com/watch?v=hJ2gY0g4BIA&t=147), Stanford v Teams [1:35](https://www.youtube.com/watch?v=DSOcjyV0oAE&t=95) | tlač, kopírovanie |
| Presnosť meraná na dátach nemocnice | Carta [29:40](https://www.youtube.com/watch?v=oYu37qC4LV0&t=1780), Microsoft TBFact ([MSR](https://www.microsoft.com/en-us/research/publication/demo-healthcare-agent-orchestrator-hao-for-patient-summarization-in-molecular-tumor-boards)) | 2 pacienti, testoval ten istý tím |
| Kto videl záznam | Estónsko [10:50](https://www.youtube.com/watch?v=JTbLndic--s&t=650) | nie (len v pláne) |
| Beží lokálne, bez cloudu | Voxelomics [0:47](https://www.youtube.com/watch?v=XvYmUYs7iOk&t=47); Microsoft beží v Azure [0:49](https://www.youtube.com/watch?v=DSOcjyV0oAE&t=49) | **áno: naša výhoda** |

## Top nálezy

**1. Odporúčania v správach sa strácajú, a práve toto chce VZP zachytiť**
- Problém: Cestu (shot 04) napísal tím ručne. Motor sekciu DOPORUČENÍ číta len preto, aby z nej nebral dátumy (`app/src/ai/rules.ts:460`).
- Dôkaz: sekciu DOPORUČENÍ má 6 z 13 správ (01, 04, 05, 09, 12, 13). Správa 05 z 15. 9. žiada CT „dle pankreatického protokolu“ a „Kontrola v gastroenterologické ambulanci s výsledkem UZ“. CT prišlo až 8. 10. a o kontrole správa neexistuje. Správa 09: „Výsledek histologie do 3 pracovních dnů“; meškanie dnes píše appka ručne. Epic vyťahuje z rádiologických správ úlohy, aby koordinátori mohli „reliably take the next steps“ ([1:10](https://www.youtube.com/watch?v=BIIWqlCrXAA&t=70)).
- Zmena: v obrazovke „Zpracování naživo“ panel „Otevřené smyčky“. Každý bod DOPORUČENÍ = návrh úlohy s citátom, termínom z textu a s tým, kto je na ťahu. Keď príde správa s výsledkom, smyčka sa zavrie („splněno 19. 10., 4 dny po slíbeném termínu“). Stačia pravidlá, AI netreba. Koordinátorka úlohu potvrdí. Zápis z MDT ostáva na neskôr, ako ste rozhodli.
- Dopad: **vysoký** (kritérium 1: cesta vznikne zo správ naživo, nie ručne).
- Práca: 3–4 h.

**2. Záver pre praktika ide von, ale jeho vety nemajú zdroj**
- Problém: štyri odrážky „Čo to znamená pre vás“ odkazujú len na celý zápis (shot 08). Vetu „Drenáž žlčových ciest zatiaľ v správach nie je“ nemá ako overiť.
- Dôkaz: Abridge: „highlight any part of this note… shows us where the evidence came from“ ([15:35](https://www.youtube.com/watch?v=qXPBXhUrjMc&t=935)). Dragon: „I will always see the source“ ([10:27](https://www.youtube.com/watch?v=RuEyGi2dowM&t=627)). Podklad MDT poznámky pod čiarou má (shot 07).
- Zmena: za každou vetou malé číslo, klik zvýrazní vetu v zápise MDT. Pri tvrdení, že niečo chýba, odkaz „hledáno ve 13 zprávách“.
- Dopad: stredný až vysoký. Práca: 1–1,5 h.

**3. Oprava človekom po sebe nenechá stopu**
- Problém: pole sa dá iba „Potvrdit (zkontroloval člověk)“ (`components/live/FieldPanel.tsx:74`). Zamietnuť ho alebo opraviť s dôvodom nejde.
- Dôkaz: v deme DAX predvádzajúca zdravotníčka sama opraví chybu AI („bottled trip“, [7:36](https://www.youtube.com/watch?v=tBulTCOVWg8&t=456)). Carta má „mark this incorrect“ ([15:46](https://www.youtube.com/watch?v=oYu37qC4LV0&t=946)). Pieces chyby triedi podľa závažnosti a kontroluje ich lekár ([7:58](https://www.youtube.com/watch?v=tSviDrpQn64&t=478)).
- Zmena: tlačidlá „Potvrdit / Opravit / Zamítnout“ a dôvod jedným klikom (zlá veta · zlé pole · zastarané · preklep v správe). V „Záznamu“ pribudne „Deník oprav“: čo navrhol motor, čo zapísal človek a kedy.
- Dopad: stredný až vysoký (kritérium 2: ľudský dohľad, podklad pre meranie v pilote). Práca: 1,5–2 h.

**4. „Citáty ověřeny doslova 65/65“ znie ako presnosť**
- Problém: obrazovka naživo (shot live-1440-all) ukazuje 65/65 vedľa „potvrzeno 0“. Doslovný citát ešte neznamená správny údaj. „Poslední dávka 18. 10.“ je v správe 09 doslovne, a predsa je chybná.
- Dôkaz: Texas uzavrel s firmou Pieces dohodu kvôli reklame, ktorá sľubovala menej ako 1 vážnu chybu na 100 000 súhrnov. Úrad to označil za „likely inaccurate“, firma vinu odmieta ([Healthcare Dive](https://www.healthcaredive.com/news/texas-attorney-general-ken-paxton-settles-pieces-technologies-generative-ai-accuracy/727699/)).
- Zmena: text „65/65 citátů nalezeno doslova ve zprávách · správnost potvrzuje člověk (0/20)“. V pitchi nehovoriť „0 halucinácií“.
- Dopad: stredný. Práca: 0,25 h.

**5. Konzílium má na pacienta 3 minúty, podklad je dlhý**
- Problém: podklad MDT má 7 častí a asi 25 poznámok pod čiarou (shot 07). Pri stole sa číta dobre, na plátne nie.
- Dôkaz: Microsoft: v USA „three minutes per patient“, vo Veľkej Británii „under a minute“ ([12:09](https://www.youtube.com/watch?v=jeY8VUr3GmU&t=729)). navify má samostatný režim prezentácie ([2:27](https://www.youtube.com/watch?v=hJ2gY0g4BIA&t=147)). Dopĺňa nález 4 kritika 05.
- Zmena: tlačidlo „Režim konzilia“ otvorí jednu obrazovku na celú šírku: otázka, 5 rozhodujúcich nálezov s citátom, čo chýba a čo treba overiť. Žiadny nový text, len výber z polí.
- Dopad: stredný. Práca: 1,5–2 h.

## Nové nápady zo sveta

1. **„Hledat ve zprávách“ namiesto chatu.** Dragon Copilot odpovedá na otázku z prepisu a ukáže zdroj ([8:08](https://www.youtube.com/watch?v=RuEyGi2dowM&t=488)). U nás bez jazykového modelu: koordinátorka napíše „apixaban“ a dostane 8 viet z 5 správ zoradených podľa dátumu, každú s odkazom. Rozpor 12. 10. verzus 18. 10. tak uvidí na jednom mieste. Nič sa nedomýšľa a beží to offline. 1,5 h.
2. **„Kdo viděl podklad“.** Estónsky portál ukazuje, ktorý lekár ktorý dokument otvoril, s presnosťou na sekundy ([10:50](https://www.youtube.com/watch?v=JTbLndic--s&t=650)). VZP rovnakú „historii přístupů“ sama propaguje pri Lékovom zázname ([vzp.cz, 14. 9. 2026](https://www.vzp.cz/o-nas/tiskove-centrum/otazky-tydne/pristup-do-lekoveho-zaznamu)). V appke: v „Záznamu“ riadky typu otvoril / vytlačil / odoslal, kto a kedy. 1 h.
3. **Pilot ako Carta: najprv merať na starých prípadoch.** Carta pri nasadení spracuje prípady, ktoré už predtým vyplnili ľudia, a presnosť hlási po jednotlivých otázkach ([29:40](https://www.youtube.com/watch?v=oYu37qC4LV0&t=1780)). Microsoft TBFact beží lokálne „without sharing sensitive clinical data“ ([MSR](https://www.microsoft.com/en-us/research/publication/demo-healthcare-agent-orchestrator-hao-for-patient-summarization-in-molecular-tumor-boards)). Pre VZP jeden slide: v jednom KOC 30 starších prípadov, motor beží v nemocnici, výstupom je zhoda po 20 poliach. Pokrýva kritériá 2 a 4.
4. **Žiadanka „pozdržaná“ s dôvodom.** V Cerneri lekár žiadanku pozdrží s dôvodom „missing CT report“ a prípad zmizne zo zoznamu, až keď je vybavený ([7:31](https://www.youtube.com/watch?v=8rrJvVzPau8&t=451)). U nás: na fronte stav „Čeká na: zpráva CT (vyžádáno 3. 10.)“, ktorý sa sám zmení, keď správa príde. 1 h.

## Čo nerobiť
1. **Nerobiť chat s jazykovým modelom nad pacientom.** Azure nebežal ani raz. Chaty Dragon a Tempus stoja na napojení na nemocničný systém (EHR) a na overených zdrojoch. Vyhľadávanie viet (nápad 1) má ten istý efekt bez rizika.
2. **Neuvádzať čísla presnosti bez cudzieho testu.** Prípad Pieces ukazuje, že aj „1 chyba na 100 000“ môže skončiť pred úradom. Hovoriť „každá veta sa dá dohľadať“, nie „AI je presná“.
3. **Nehrať sa na integráciu.** Produktový manažér Microsoftu za lekárov hovorí, že nechcú „another app“ ([6:53](https://www.youtube.com/watch?v=jeY8VUr3GmU&t=413)). Netreba maketu Teams ani NIS. Stačí úprimne ukázať, kde by vrstva sedela (eZpráva, panel v NIS), a opierať sa o to, čo už beží v prehliadači.
