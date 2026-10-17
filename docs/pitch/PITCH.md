# Pitch (česky) – výzva VZP „Cesta pacienta bez ztráty informací“

> **Hlavní věta:** „Aby se nic neztratilo a bylo jasné, kdo je na tahu.“
> Neříkáme „AI vytěží dokumenty“. Říkáme: **pravidla + ověřené citace, AI navrhuje volný text.**

**Kde a jak dlouho (ověřit u organizátorů):** v sobotu 14:00–16:00 chodí zadavatelé VZP k jednotlivým stolům (žádné pódium) →
video (max 1:30, VIDEO.md: problém Aleny + řešení ve zkratce) a pak **~2 minuty živé demo na notebooku, kde si porotce může sám něco změnit**.
Délka nedělního finálového pitche není zveřejněná (odhad 5–6 min včetně otázek) – níže je 3minutová verze, kterou lze natáhnout.
Rozdělení (návrh): Bruno úvod + demo, Maťo čísla, cesta k realitě a prosba. Záloha: video.

---

## 0:00–0:20 · Úvod (Bruno)

„Tohle je Alena – fiktivní pacientka, 63 let, podezření na nádor slinivky. Má **13 zpráv ze 7 zařízení**, včetně **dvou různých
onkologických center**; od praktika ke konziliu uběhlo **50 dní**. Skutečné koordinátorky popisují, že zprávy shánějí hlavně
telefonem a e-mailem. A v těch zprávách jsou díry a rozpory, které musí někdo najít ještě před konziliem.“

*(Na obrazovce: fronta případů, Alena nahoře.)*

## 0:20–2:00 · Živé demo (Bruno kliká, ke každému kroku jedna věta)

| # | Klik v aplikaci | Jedna věta |
|---|---|---|
| 1 | **Fronta** | „Ráno koordinátorka vidí všechny případy a u každého, **kdo je na tahu a do kdy** – žádné skóre naléhavosti, jen termíny.“ |
| 2 | **Pohled praktika → nová žádanka → Odeslat** | „Praktik pošle žádanku a hned dostane **potvrzení se seznamem toho, co chybí** – v prototypu je odeslání simulované.“ |
| 3 | **Zpracování naživo** – zprávy přicházejí jedna po druhé | „Motor běží přímo v prohlížeči: ze samotné žádanky vyplní **15 z 20 položek**, s každou další zprávou přibývají – **u každého údaje je doslovná citace**.“ |
| 4 | **Pasti a rozpory** (červené) → klik na hodnotu → zvýrazněná věta ve zprávě | „Z 11 zpráv, které existovaly před konziliem, ukáže **díry a rozpory: chybí ECOG, apixaban ‚vysazen 18. 10.‘ u výkonu 12. 10., histologie ‚vydaná‘ den před odběrem** – nic nedomýšlí.“ |
| 5 | **Zkuste to rozbít** – porotce změní rodné číslo v laboratorní zprávě 10 | „Zkuste to sami: změňte rodné číslo – za vteřinu je tu **nový rozpor s oběma citacemi**. Opravte datum apixabanu na 10. 10. – rozpor zmizí.“ |
| 6 | **Chybí ECOG → Zapsat telefonát** | „ECOG ve zprávách není. Koordinátorka zavolá do ambulance, **zapíše telefonát** a údaj se doplní se zdrojem ‚telefonát‘ – ne z vymyšlené zprávy.“ |
| 7 | **Stav k 21. 10.** (posuvník) | „Podklad obsahuje jen to, co bylo známo v den konzilia: **váha 65 kg z 15. 9.**, ne 63 kg ze zprávy, která vznikla až po něm.“ |
| 8 | **Podklad pro konzilium** (MDT_zapis) → PDF | „Podklad má přesně strukturu zápisu z jednání MDT ze zadání a dá se vytisknout do PDF.“ |
| 9 | **Závěr pro praktika → Odeslat → doručenka** | „Praktik dostane závěr s odpovědí na svou otázku a my vidíme doručenku – v prototypu simulovanou. Každý krok je v záznamu o koordinování.“ |

*(Když demo selže: pustit video od 1:00 a pokračovat slovy.)*

## 2:00–2:30 · Čísla (Maťo)

„Měříme to. Na ručně ověřené kontrolní sadě má Alena **20 z 20 položek, 17 ze 17 pastí a 0 vymyšlených hodnot** – stejně s AI
i bez ní, protože čísla a data berou pravidla; AI jen navrhuje volný text a kód ho ověří.
Kontrolní sady jsme ale psali sami. Proto jsme nechali agenta, který naše pravidla neviděl, napsat **třetího pacienta naslepo**:
**[SLEPÝ TEST – doplní se z app/public/data/eval-pacient-3.json]**.
A když jsme AI záměrně podstrčili vymyšlené stadium a čísla, **kód zahodil všechny 4 vymyšlené návrhy** a jediný správný přijal.“

## 2:30–2:45 · Cesta k realitě (Maťo)

1. „V pilotu budeme brát to, co koordinátorovi reálně chodí: telefon, e-mail na společnou adresu a eZprávu – metodický pokyn MZ pro centra HPB od 1. 9. 2026 uvádí jako kontakt právě univerzální e-mail a telefon koordinátora.“
2. „Pilot je jedno KOC: tři měsíce bez rozhraní, podklad jako PDF do NIS a měření; až potom rozhraní. Lékař se nic nového neučí a nedostane žádný nový účet.“
3. „AI má běžet v EU (Azure OpenAI); v prototypu zatím odpověděl náhradní model na stejný pseudonymizovaný prompt. Rodná čísla ani telefony k AI neodejdou – to náš kód dělá už dnes. Pokud bude vystavení eŽádanky povinné (zatím je to návrh novely), chceme se napojit přes certifikát KOC – zda to jde, ověřujeme s NCEZ.“

## 2:45–3:00 · Prosba (Maťo)

„Každé z 15 KOC musí mít od roku 2026 koordinátora a pojišťovny nemocnici platí za každou jeho intervenci 250 Kč –
**společný nástroj ale zatím není**, ministerstvo koordinační aplikace teprve pilotně testuje.
Prosíme VZP o **pilot v jednom KOC: 3 měsíce, 50 až 100 případů**. Měříme čtyři čísla: čas do kompletního podkladu,
díry nalezené před konziliem, odložená konzilia a minuty koordinátora.

**Aby se nic neztratilo a bylo jasné, kdo je na tahu.**“

---

## Neříkat
„ostrý režim Azure“, „AI složí podklad“, „napojeno na NIS“, „AI rozhodne“, „GDPR compliant“, „nasazeno“, „VZP hradí“, „léky do kdy“,
„uzel VZP“ jako hotová věc, Missouri −30 % jako náš výsledek, dánské a holandské lhůty jako české pravidlo, „aplikace sama eskaluje“,
„žádosti na 5 pracovišť jedním klikem“. Žádné skóre naléhavosti, žádné doporučení léčby.

## Otázky poroty – připravené odpovědi

| Otázka | Odpověď (1–2 věty) |
|---|---|
| Co když AI halucinuje? | AI jen navrhuje. Program ověří, že každá citace je ve zprávě doslova a že každé číslo v hodnotě je v citaci; jinak návrh zahodí a použije větu přímo ze zprávy. Test se záměrně chybnou odpovědí (stadium T3N1M0, „úbytek 8 kg“, citace ze zprávy po konziliu, vymyšlené přání): všechny 4 vymyšlené návrhy zamítnuté, jediný správný přijat (`app/eval/vysledok-test-halucinacii.json`). |
| Jak jste to měřili? | Ručně ověřená správná odpověď pro 20 položek + pasti, každý důkaz ověřený doslova v textu; `npm run eval` to přepočítá při každé změně. Kontrolní sady psal náš tým, proto slepý test na třetím pacientovi od agenta bez přístupu k pravidlům. |
| Kolik toho dělá AI? | Čísla přesnosti vycházejí stejně bez AI – položky a pasti čtou pravidla. AI navrhuje pět volných textů (diagnóza, epikríza, otázka na MDT, symptomy, jiná sdělení) a kód je ověřuje. |
| Kam jdou data pacienta? | Cílově Azure OpenAI v EU; v prototypu náhradní model a jen fiktivní data. Před voláním nahradíme rodné číslo, telefony, e-maily, adresu, datum narození a jméno pacienta i kontaktní osoby tokeny ([RČ_1] …). Jména lékařů zatím zůstávají. |
| Je to zdravotnický prostředek (MDR)? | Podle našeho výkladu pokynu MDCG 2019-11 ne: neděláme diagnózu, skóre naléhavosti ani doporučení léčby – sbíráme, ověřujeme úplnost a hlídáme termíny. Definitivně to posoudí regulátor. |
| Proč ne portál pro praktika? | Portál = nový účet, heslo a MFA; elektronické doporučenky v Anglii (e-RS) roky stály kolem 52 %, dokud je nezapnula platba. Praktik u nás nic nového nedělá – dostane jen potvrzení přijetí a seznam, co chybí. |
| Jak se napojíte na nemocnici? | Fáze 0 bez rozhraní (společná schránka, PDF do NIS), pak rozhraní přes integrační engine nemocnice. Výstup umíme namapovat na FHIR (DocumentReference, Provenance s citací), export zatím nemáme. |
| Funguje to i na jinou diagnózu? | Druhý fiktivní pacient má karcinom plic, jinou pojišťovnu (111), žádanku od specialisty a jiné pasti: 20/20 po úpravě pravidel (před ní 18/20). Třetí pacient naslepo: viz čísla výše. |
| Kolik to stojí a kdo platí? | Náš odhad: náklady na AI jsou malé oproti minutám koordinátora. Pojišťovny už platí nemocnici 250 Kč za intervenci koordinátora (výkon 51887, nejvýše jednou denně na pacienta) – nástroj ty minuty šetří a každý krok dokládá. Přesná čísla změříme v pilotu. |
| Je to jen připravený film? | Ne: motor běží přímo v prohlížeči za desítky milisekund. Změňte si text zprávy (rodné číslo, datum, smažte histologii) a uvidíte nový rozpor nebo „chybí“ – s citacemi. |
