# Slepá sada „bez nadpisů“ č. 2 (zadanka-5 až zadanka-8)
Napsal slepý agent (Claude Code) bez přístupu k extraktoru, jeho pravidlům i k ostatním datům v repu, takže texty nejsou laděné na žádná pravidla.
Obsahuje 4 FIKTIVNÍ doporučující dopisy koordinátorovi KOC (ledvina, prostata, prs, žaludek) psané souvislým textem bez nadpisů a bez řádků typu „Pacient:“.
Očekávané hodnoty jsou v gold.json (20 polí na dopis, present + mustContain = doslovné podřetězce z dopisu, u pohlaví „muž“/„žena“), v každém dopise 2–3 pole záměrně chybí.
Vytvořeno 17. 10. 2026, všechny osoby, čísla a pracoviště jsou smyšlené.
