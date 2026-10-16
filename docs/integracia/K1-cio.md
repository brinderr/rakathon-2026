# K1: IT riaditeľ a kyberbezpečnosť FN (KOC) čítajú návrh A

_16. 10. 2026. Hraná rola (Claude ako CIO), nie stanovisko skutočnej nemocnice. [overené] = zdroj otvorený dnes; [odhad] = môj úsudok._

## Verdikt
Vlna A (fiktívne dáta) je v poriadku. Vlnu B takto nepodpíšem: podcenené sú rozhrania, podpis dokumentov, pošta a AI. Ostrá prevádzka v 2. mesiaci je nereálna, skôr o 9 až 12 mesiacov [odhad].

**Sporné tvrdenia z A sedia [overené]:** priame API Anthropic nemá EÚ (len „us“/„global“, úložisko USA) [3]; Azure „Data Zone EU“ spracúva v EÚ [2]; ÚOOÚ k e-mailu [6]; logy 18 mesiacov, pentest [4].

## Čo by som do siete nepustil
- **Aplikáciu s prístupom ku všetkej pošte.** Povolenie Mail.Read v Microsoft 365 otvára všetky schránky. Na jednu rola-schránku ho zúži „RBAC for Applications“, pôvodné povolenie treba odobrať [overené, 1].
- **Verejný formulár a „odkaz pre pacienta bez účtu“.** Nová brána z internetu, cez ktorú ktokoľvek nahrá súbor k pacientovi. Chcem antivírus, čistenie súborov, limity a odpoveď, kto overí, že PDF je naozaj od praktika [odhad].
- **LLM bez dočítaných podmienok.** Azure predvolene dovoľuje, aby podozrivé vstupy čítal zamestnanec Microsoftu (v EHP). Vypnúť sa to dá len po schválení žiadosti [overené, 2]. Pseudonymizácia českého textu (skloňované mená) riziko len znižuje [odhad].
- **Druhý integračný engine (IRIS)** vedľa nášho: dvojitá prevádzka [odhad].

## Rozpory v návrhu
- „Lekár sa nič nové neučí“, no praktik má dostať „odkaz s prihlásením“. To je nový účet a dvojfaktorové prihlásenie (MFA) platí pre všetkých používateľov [overené, 4: §19 ods. 2].
- Záver MDT pre praktika je zdravotnícka dokumentácia odoslaná inej osobe: potrebuje časové razítko a pečať nemocnice alebo uznávaný podpis zdravotníka [overené, 5: §55a ods. 4]. E-mailová doručenka to nenahradí. A to nerieši.

## Koľko rozhrania do NIS reálne stoja

| Verejná zmluva | Bez DPH | Čas |
|---|---|---|
| Havlíčkův Brod: lekárenský systém Lekis ↔ NIS STAPRO FONS v3, len strana Lekisu, z toho 10 človekodní za 150 000 Kč [overené, 7] | 397 500 Kč | do 90 dní |
| Třebíč: hotový modul STAPRO na hlásenie infekcií ÚZIS s ročnou podporou [overené, 8] | 101 150 Kč | nevieme |
| UN Bratislava: modul NIS STAPRO na overovanie liekov [overené, 9] | 14 895 EUR | 2 mesiace |
| UN Bratislava: podpora napojenia NIS na eZdravie a DRG [overené, 10] | 39 422,90 EUR | 1 rok |

Aj hotové, štátom predpísané rozhranie stojí okolo 100 tisíc Kč a platí sa ročná podpora. Či STAPRO v Havlíčkovom Brode účtoval aj svoju stranu, nevieme. Na pilot (demografia z NIS, vloženie dokumentu do NIS) počítam 0,3 až 1 mil. Kč plus podporu a 3 až 6 mesiacov od objednávky [odhad]. Služby do 3 mil. Kč bez DPH sú zákazka malého rozsahu bez zákonného zadávacieho konania [overené, 11].

## Čo chýba v bezpečnosti a práve
- Firma: poistenie a kontakt na incident 24/7. My hlásime NÚKIB prvotne do 24 hodín [overené, g4], vy nám skôr.
- Zmluva podľa čl. 28 GDPR a prílohy 5 vyhlášky 409/2025, zoznam podspracovateľov s regiónmi.
- Pentest (skúšobný útok) pred spustením a po veľkej zmene [overené, 4: §24 ods. 5].
- Zlé priradenie dokumentu = únik k inému pacientovi. Chcem pravidlá párovania a mieru chýb.
- Retencia: čo je originál a čo pracovná kópia, kedy ju vymažete.
- Prompt injection (skrytý príkaz pre AI v dokumente) otestovaný na zákerných PDF.

## Čo chcem vidieť pred pilotom
1. Jednu stranu: účel, tok dát, kto má administrátorský prístup.
2. Návrh DPIA (posúdenie vplyvu), zmluvy a pentest report.
3. Prihlásenie cez naše SSO s MFA.
4. Presnosť na syntetike: podiel polí bez opravy, nula nepravdivých citátov.
5. **Fázu 0 bez rozhrania:** jedna rola-schránka a PDF, ktoré koordinátorka sama vloží do NIS. Po 3 mesiacoch meraní rozhodneme o rozhraní.
6. Ponuku dodávateľa NIS na import dokumentu ešte pred podpisom.

## Zdroje (čítané 16. 10. 2026)
1. Microsoft (21. 8. 2026): https://learn.microsoft.com/en-us/exchange/permissions-exo/application-rbac
2. Microsoft (5. 6. 2026): https://learn.microsoft.com/en-us/azure/foundry/responsible-ai/openai/data-privacy ; https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/abuse-monitoring
3. Anthropic (bez dátumu): https://platform.claude.com/docs/en/manage-claude/data-residency
4. Vyhláška 409/2025 Sb.: https://www.zakonyprolidi.cz/cs/2025-409
5. Zákon 372/2011 Sb.: https://www.zakonyprolidi.cz/cs/2011-372
6. ÚOOÚ (bez dátumu): https://uoou.gov.cz/profesional/qa-otazky-a-odpovedi/zdravotnictvi
7. Ponuka 24. 2. 2022: https://www.hlidacstatu.cz/KopiePrilohy/21623381?hash=347edbf6a02beb3ca52c3bae4ba6a9f8a73df40b4620311e88ea76be6ed8e853
8. 25. 11. 2025: https://smlouvy.gov.cz/smlouva/soubor/44228693/00839396-anonym-6508-1769153183.pdf
9. 28. 6. 2021: https://www.crz.gov.sk//data/att/2928194.pdf
10. 7. 3. 2022: https://www.crz.gov.sk//data/att/3184486.pdf
11. CRR (05/2025): https://crr.gov.cz/wp-content/uploads/2025/05/Informace-Centra-ke-zvyseni-limitu-VZMR-po-novele-3.-4.-2025-a-zvyseni-limitu-pro-primy-nakup_FINAL.pdf
