# Slepý test – žádanky bez nadpisů (FIKTIVNÍ – testovací data)
Napsal slepý agent (Claude, subagent) bez přístupu k pravidlům extraktoru: neviděl jeho kód, skripty, eval ani data pacientů a texty nijak neladil podle pravidel.
Obsah: 4 smyšlené žádanky souvislým textem bez nadpisů a bez řádků typu „Štítek:“ (praktik stručně, gastroenterolog zkratkami, pneumolog dlouze, sestra z gynekologie ve 3. osobě) + gold.json.
V každé žádance záměrně chybí 2–4 pole („present“: false); „mustContain“ jsou doslovné podřetězce z textu, jen u pohlaví normalizovaná hodnota „muž“/„žena“.
Datum vytvoření: 17. 10. 2026; všechny osoby, telefony, nálezy i pracoviště jsou smyšlené.
