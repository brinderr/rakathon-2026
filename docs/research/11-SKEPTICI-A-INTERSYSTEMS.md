# 11 – Sceptici + cena InterSystems (top 3)

_Piatok 16. 10. ~17:15. Každého kandidáta sa pokúsil zhodiť red team (primár + finančný riaditeľ / VZP + porotca). Doplnok k `10-VYHODNOTENIE-VYZIEV.md`._

| Kandidát | Pôvodné skóre | Po sceptikoch | Verdikt | Fit na InterSystems (1 500 €) | Šanca na IS cenu |
|---|---|---|---|---|---|
| **VZP – Cesta pacienta** | 69,8 | **62** | kandidát s výhradami | **prirodzený** (interoperabilita je jadro zadania) | ~10–15 % pri IRIS ako hlavnom úložisku |
| **AZ – Plíce včas** | 68,9 | **62** | kandidát s výhradami | **prirodzený** | ~10–15 % |
| MEDDI ONCO | 65,3 | 58 | kandidát s výhradami | dá sa | ~5–10 % |

**Záver: Cesta a Plíce sú po kritike presná remíza (62 : 62).** MEDDI zaostáva (rozhoduje meranie na skrytých dátach, kde sú silní technickí tímy).

## VZP – Cesta pacienta
**Námietky:**
1. Kupec a peniaze: koordinátor dostane 250 Kč za výkon, takže na ďalší nástroj nezostáva. Český trh je asi 1–7 mil. Kč ročne. Nemocnica by si to skôr objednala ako modul u svojho dodávateľa systému (Asseco, STAPRO).
2. Utorok ráno: ďalšie okno vedľa nemocničného systému a GDPR pri posielaní dát do cloudového AI. Viac času stoja chýbajúce termíny na CT než stratené papiere.
3. Komodita: „AI prečíta PDF a ukáže, čo chýba“ stavia viac tímov (MDT Copilot, MEMOyA…). Rozhodne spoľahlivosť dema.
4. Jedna fiktívna pacientka, pasce v dátach chytí každý.

**Ako vyhrať:**
- Predávať pocit „nič sa nestratí a vždy vieš, kto je na ťahu“, nie „AI vyťaží dokumenty“. V deme ukázať posuvník času, kde sa stratilo 31 dní.
- Citáty overené kódom. Na obrazovke „0 vymyslených hodnôt, 20/20 polí, 13/13 pascí“.
- Pripraviť druhý prípad a nechať mentora vložiť vlastnú správu.
- Získať 1 reálne číslo od mentorky KOC.
- Poctivo povedať: „Termíny na CT nevyrábame, odstraňujeme prestoje.“
- Mať pripravenú záložnú nahrávku dema.

**InterSystems plán:** IRIS for Health s FHIR serverom ako hlavné úložisko:
- správy ako DocumentReference,
- vytiahnuté údaje ako Condition, Observation a MedicationStatement, každý s odkazom na doslovný citát (Provenance),
- plán ako CarePlan a Task s vlastníkom a termínom,
- odoslanie praktikovi ako Communication s doručenkou,
- kontrola úplnosti SQL dotazom a vector search na hľadanie citátov,
- bonus: 2 FHIR servery a presun pacienta medzi centrami bez straty dát.

Ak IRIS do ~23:00 nebeží, ideme bez neho.

## AZ – Plíce včas
**Námietky:**
1. „Veď je to filter v Exceli“ (vek 55–74 + fajčiar), takže hrozí málo AI.
2. Skutočná brzda je praktický lekár a to, či pacient na CT reálne dôjde.
3. Kupec: skríning zvyšuje náklady a jediný ochotný sponzor je AstraZeneca (konflikt záujmov pred porotou VZP a ministerstva).
4. Strop vo finále: v sobotu skoro istá výhra (1–3 tímy), ale AZ nesedí v nedeľnej porote.

**Ako vyhrať:**
- AI číta špinavé poznámky o fajčení a CT z iných nemocníc a dáva citácie. Sestra potvrdí jedným klikom („60 nejasných vyriešených za 3 minúty“).
- Hotová úloha pre praktika a lievik, kde ľudia odpadávajú.
- Peniaze: nemocnica s CT dostane každé vyšetrenie zaplatené od poisťovne. Prežitie v 1. štádiu je 62 %, v 4. štádiu 6 %.
- Ukázať, že ten istý systém funguje aj pre skríning prsníka, čreva a krčka maternice.

**InterSystems plán:**
- 300 pacientov vo FHIR (fajčenie ako Observation, CT ako ImagingStudy),
- vhodnosť počíta SQL,
- výstupy ako Communication, Task a Consent,
- vector search nad poznámkami.

## MEDDI ONCO
**Námietky:** hlavné číslo je slabšie, ako vyzerá (väčšinu vážnych prípadov chytia už pravidlá MEDDI). Platca je nejasný a zodpovednosť tiež. O výsledku rozhoduje meranie na skrytej sade, čo je terén technických tímov. Pôvodné skóre bolo nafúknuté.

**Ako vyhrať:** byť „bezpečnostná poistka s dôkazom“: porotca nahrá skrytého pacienta a hneď vidí výsledok. K tomu hlasová „nočná sestra“ mimo pracovných hodín (hlas je bonus zadávateľa), FHIR výstup a nikdy nesľubovať lepšie prežitie.
