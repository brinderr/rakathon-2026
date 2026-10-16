# Rakathon 2026 – súhrn researchu (čítaj ako prvé)

_Stav: piatok 16. 10. 2026 ~13:00. Detaily sú v súboroch 01–04 a v `docs/materials/slack/INDEX.md`._

## ⏰ Najbližšie termíny
- **DNES 19:00** – kapitán musí vybrať výzvu na `submit.rakathon.cz/vyzvy/vybrat`. Tím 2–4 ľudia, **iba jedna výzva**.
- Prístup (Azure + portál `aka.ms/rakathon2026`): tlačená kartička pre kapitána (UPN + dočasné heslo), od 13:00. Potrebujeme vlastný tímový Slack kanál.
- GitHub Copilot: $100 kredit na osobu (`aka.ms/rakathon2026/github`). Ak už máš platený Copilot, použi iný GitHub účet, inak ti prepíše licenciu.
- **Sobota**: lokálne poroty. **Nedeľa**: národné finále v Prahe, kam postupuje najlepší tím z každej výzvy.
- Formát odovzdania a všeobecné kritériá zatiaľ nie sú zverejnené. Sledovať Slack #01/#02.

## Čo je Rakathon
- 2. ročník, Praha + Brno + Ostrava, ~100 tímov, 24 h hackovania, 24 výziev.
- Hlavný partner **VZP**, tech partner **InterSystems** (FHIR/IRIS), ďalej Microsoft (Azure, LLM API), Asseco, AstraZeneca, MEDDI a nemocnice.
- Ceny: 100 / 50 / 25 tis. Kč a partnerské ceny. **InterSystems 1 500 €** sa dá kombinovať s ľubovoľnou výzvou (AI + FHIR).
- Prostredie: OpenAI-kompatibilné API (OpenAI, Grok, DeepSeek, MS modely), zdieľané rate limity, takže treba retry + backoff. Vlastná resource group v Azure (Contributor), rozpočet ~$100–200 na deň.

## Čo vyhralo minule (2025)
1. **RadioProtect** (ČVUT): 3D registrácia CT pri rádioterapii, Motol potom s tímom spolupracuje.
2. 2. miesto sa nenašlo.
3. **IOC**: predikcia recidívy karcinómu prsníka.
- Cena hackerov: **RadMan**, optimalizácia rozvrhu PET cez MILP.

**Vzorec:** úzky konkrétny klinický problém, technicky odlišný prístup (nie „ďalší chatbot“), funkčné demo na realistických dátach a merateľný prínos.

## Čo zdôrazňovali experti (pre-hack day)
- Najväčšia bolesť je **koordinácia na začiatku**: od podozrenia cez diagnózu po liečbu (40 % pacientov s rakovinou pľúc čaká na operáciu viac ako 8 týždňov), opakované vyšetrenia a stratené vzorky.
- **Bezpečné sprístupnenie dokumentov medzi nemocnicami** cez HL7 FHIR R4 a IHE MHD, žiadne vlastné databázy pacientov.
- **AI na prevod voľného textu na štruktúrované dáta a kódy** (SNOMED CT) je otvorená príležitosť.
- Nestavať: vlastný register pacientov, vlastné eŽádanky, proprietárne rozhrania.

## Výzvy s jasným zadaním a dátami (Praha + celonárodné)
| Výzva | Čo treba | Dáta | Prečo áno / nie |
|---|---|---|---|
| **VZP – Od pozvánky k mamografu** | predikovať, kto vynechá skríning, segmentovať, navrhnúť intervencie + A/B test | >1,3 M záznamov (portál) | Hlavný partner, víťaz z každého mesta ide do finále. ML + **návrh komunikácie a kampaní = naša silná stránka (marketing/kreatíva)**. Konkurencia: mammo_prg. |
| **MEDDI ONCO Challenge** | 4-stupňový triage domácich check-inov + odpoveď pacientovi + súhrn pre lekára | 14 fiktívnych pacientov s ground truth, hodnotí sa na skrytých 6 | Najjasnejšie zadanie, objektívne meranie, LLM sa hodí. Riziko: veľa tímov s podobným riešením. |
| **MDT Copilot (Asseco)** | AI podklad a zápis pre tumor board, citácie, red flags, FHIR export | zatiaľ nezverejnené | Explicitné váhy hodnotenia, kombinovateľné s cenou InterSystems. Konkurencia: MEMOyA (Ostrava) má hotový základ. |
| AI Trial Matching (FNMH) | párovanie pacientov na klinické štúdie s vysvetlením | zoznam ~90 štúdií | Silná téma, chýbajú pacientske dáta. |
| Hlídač nežádoucích účinků (FNMH) | dotazník, rady, alerty pri nebezpečných hodnotách | CTCAE v6, SÚKL | Dobre demovateľné (appka + alerty). |
| Twincer (Fuck Cancer) | párovanie pacientov na peer chat + preklad | — | UX/komunitný projekt. |

Výzvy bez zadania (zatiaľ): VZP Konec života, VZP Cesta pacienta, NÚVR, Plíce včas (AZ), SMART ONCO AA a väčšina Brna a Ostravy.

## Odporúčanie na rozhodnutie (Bruno + Matej)
1. **VZP – Od pozvánky k mamografu.** Najlepší pomer: veľké reálne dáta, hlavný partner, istá cesta do finále a výhoda v tom, čo vieme (segmentácia + personalizované pozvánky / kampane generované AI + návrh A/B testu, prezentované cez silné demo a video). Prediktívny model + „kreatívny engine“, ktorý pre každý segment vyrobí správu a kanál, je odlišný prístup.
2. **MEDDI ONCO**: ak chceme čisté, merateľné LLM zadanie.
3. **MDT Copilot + FHIR**: ak chceme ísť aj po cene InterSystems (1 500 €).

Rozhodnutie zapíšte do `docs/DECISIONS.md` a výzvu nahláste **do 19:00**.

## Otvorené otázky
- Formát a deadline odovzdania, všeobecné kritériá poroty, čas nedeľného finále.
- Formát VZP dát (pozrieť na portáli hneď po získaní prístupu).
- Zadania zatiaľ prázdnych výziev (sledovať Slack kanály výziev).
