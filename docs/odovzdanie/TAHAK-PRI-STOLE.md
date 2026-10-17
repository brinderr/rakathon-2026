# Tahák u stolu – eKoordinace pro VZP (2 minuty)

Hodnocení: sobota 14:00, zadavatelé obcházejí týmy. Demo: https://ekoordinace.vercel.app
Pořadí kroků kopíruje slide 12 výzvy „Demo musí ukázat“. Vpravo je, který bod slidu krok splňuje.

## Před příchodem poroty (5 minut předem)
- Otevřít https://ekoordinace.vercel.app, v menu **Pacienti → Obnovit demo** (smaže, co jsme v tomto prohlížeči zkoušeli). Pak **Přehled**.
- **Záložní prohlížeč** (např. Safari): Alena už s potvrzeným podkladem a odeslaným závěrem – data jsou uložená v prohlížeči, takže druhý prohlížeč je nezávislý. Kdyby nebyl čas na krok 6, přepnout sem.
- Zvětšit písmo prohlížeče, aby porota četla z boku stolu.
- Vědět, co znamená **„Simulovaný den 19. 10. 2026“** v horní liště: případ z výzvy má poslední zprávu před konziliem 19. 10. a konzilium 21. 10., aplikace hraje tento den.

## Scénář klikání

| # | Kam kliknout | Co říct (1 věta) | Slide 12 |
|---|---|---|---|
| 1 | **Přehled** (úvodní obrazovka) | „Ráno koordinátorka vidí, co je na ní, co čeká na ostatní a kdy je nejbližší konzilium – řazeno podle termínů, bez skóre naléhavosti.“ | Přehled případů se stavem a termínem |
| 2 | **Žádanka od praktika** → pod oknem „Ukázka:“ **David Sipos – žádanka a 5 zpráv (Word)** → počkat, až se údaje vyplní → dole **Před odesláním** → **Odeslat do …** | „Praktik jen přetáhne dopis a zprávy, které už má – údaje se vyplní samy, u každého věta, odkud je, a před odesláním vidí, co bude chybět; odeslání je v prototypu simulované.“ | Referování do KOC bez dalšího formuláře |
| 3 | **Jak to vidí koordinátorka** → pak v menu **Pacienti** → **Alena Procházková** (záložka **Přehled**) | „Nový pacient přistál v seznamu koordinátorky; tady je Alena z výzvy – 16 z 20 údajů připraveno, 4 body k vyřešení a u aktuálního kroku je napsané, co udělat a komu zavolat.“ | Vlastník každého dalšího kroku |
| 4 | Záložka **Údaje pro konzilium** → kliknout na citaci u **Histologie** (otevře zprávu se zvýrazněnou větou) → u **Výkonnostní stav (ECOG)** ukázat „V dokumentaci není“ | „Motor vyplní 20 položek šablony Handover_obsah, každou s doslovnou citací – a co chybí nebo si odporuje, nedomýšlí, ale označí: tady chybí ECOG a histologie je vydaná den před odběrem.“ | AI vytěžení s kontrolou úplnosti |
| 5 | Záložka **Plán cesty** | „Plán hlídá pořadí kroků, termíny a kdo je na tahu; co je po termínu, jde urgovat, pacientce poslat SMS nebo pracovišti e-mail – simulovaně, zapíše se do záznamu koordinace.“ | Přehled se stavem a termínem · vlastník kroku |
| 6 | Záložka **Podklad** → ukázat zamčené **Potvrdit a vygenerovat PDF** → u otevřených bodů **Ponechat** s důvodem (nebo **Vyřešit**) → **Potvrdit a vygenerovat PDF** | „Podklad má strukturu zápisu MDT ze zadání a lékař KOC ho potvrdí až ve chvíli, kdy je každý bod vyřešený, nebo vědomě ponechaný jako neověřený.“ | Strukturovaný závěr KOC / MDT |
| 7 | Záložka **Závěr** → **Odeslat praktikovi** → počkat na **doručeno → přečteno** | „Po konziliu jde praktikovi strukturovaný závěr a doporučení MDT s diagnózou i zdrojem a vidíme, že ho doručil a přečetl – dokud nepřečte, jde urgovat.“ | Zpětná vazba a potvrzené předání |
| 8 | Zpět na **Přehled** (nebo **Konzilia**) | „Smyčka je zavřená: v přehledu je vidět, na koho se čeká, a v Konziliích stav podkladu každého pacienta na konzilium.“ | celý průchod |

Když dojde čas: krok 6 přeskočit a krok 7 ukázat v záložním prohlížeči.

## 5 nejtěžších otázek VZP

**1. „Kde je tu AI? Není to jen sada pravidel?“**
Vytěžení v nasazené verzi dělají pravidla s ověřenou citací a OCR v prohlížeči – záměrně, aby zprávy neodcházely ven. Vrstva s jazykovým modelem je v motoru hotová (5 volných textů, pseudonymizace před voláním) a pojistku jsme testovali: ze záměrně chybné odpovědi kód zamítl všechny 4 vymyšlené návrhy a podklad zůstal 20/20. Zapneme ji, až bude model v EU nebo v nemocnici. Čísla přesnosti vycházejí s modelem i bez něj stejně.

**2. „Jak víte, že to funguje i na jiném pacientovi? Nevyladili jste to na Alenu?“**
Alena 20/20 položek a 17/17 pastí; druhý fiktivní pacient (karcinom plic) 20/20 a 13/13, ale až po úpravě pravidel – předtím 18/20 a 6/13. Slepý test na třetím pacientovi (karcinom rekta, jiný formát): jen 10/20 a 1/4, jednou číslo, které v citované zprávě nebylo. Z 10 chybných položek 5 nechal prázdných (označené „chybí“), 4 vyplnil špatně a 1 označil jako rozpor. Po zobecnění pravidel 20/20 a 4/4 – to už slepé není. Kontrolní sady psal náš tým. Živě: nahrajte vlastní zprávu v **Žádance od praktika** nebo v **Pacienti → Nový pacient**.

**3. „Co z toho má VZP / kdo to zaplatí?“**
Za každou intervenci koordinátora platí centru 250 Kč všechny zdravotní pojišťovny, ne jen VZP (výkon 51887, nejvýše jednou denně na pacienta). Fiktivní Alena je navíc u ZP 211, ne u VZP. Ministerstvo koordinační aplikace v některých KOC teprve pilotně testuje (MZ ČR, 2. 9. 2026), společný nástroj zatím není. Úsporu času jsme neměřili – změří ji pilot: 1 KOC, 3 měsíce, čas do kompletního podkladu, odložená konzilia, minuty koordinátora.

**4. „Jak se to napojí na nemocnici? Kde jsou data?“**
Dnes vše běží v prohlížeči a nic se neodesílá – odesílání je simulované. Napojení na NIS, eŽádanku a zabezpečené zprávy patří podle slidu 12 do další fáze. Podklad jde zkopírovat do NIS a vytisknout jako PDF. Datový model lze namapovat na FHIR (DocumentReference, Provenance, Task, Composition), export ale zatím nemáme.

**5. „Co když něco vymyslí? Není to zdravotnický prostředek?“**
Každá hodnota má doslovnou citaci, kterou kód ve zprávě ověří; co oporu nemá, se neukáže jako fakt, ale jako „chybí“ nebo rozpor. Nenavrhujeme diagnózu, léčbu ani naléhavost – diagnózu přebíráme od lékaře doslovně a podklad potvrzuje lékař KOC. Podle našeho výkladu MDCG 2019-11 to není zdravotnický prostředek, definitivně posoudí regulátor.

## Co nemáme (říct na rovinu, když se zeptají)
- Revizní lékař ze slidu 11 zatím informaci automaticky nedostává.
- Skutečné odesílání (e-mail, SMS, zabezpečená zpráva) – vše je simulované.
- FHIR export.
