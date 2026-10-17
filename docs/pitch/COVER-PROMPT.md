# Titulný obrázok – prompt (povinný: 16:9, do 8 MB)

> **Stav:** hotový obrázok zo skutočných obrazoviek appky spravil Bruno – `docs/odovzdanie/cover.png` (zdroj `cover.html`). Texty na ňom majú byť **česky** a so sloganom „Aby se nic neztratilo a bylo jasné, kdo je na tahu.“ Tento prompt ostáva ako záloha.

**Kde sa použije:** formulár submit.rakathon.cz („Titulní obrázek povinný, do 8 MB, 16:9“) a verejná galéria projektov.
Na malom náhľade musí fungovať aj bez textu. Text (názov) sa dá dopísať až v editore, AI generátory text kazia.

**Nápad:** jedna súvislá **niť** (NIT) prechádza cez roztrúsené lekárske správy a spája ich do jedného úhľadného
podkladu na stole koordinátorky. Pokoj a poriadok namiesto chaosu. Žiadna „AI hlava“, žiadne roboty, žiadne logá.

## Prompt (EN – pre Higgsfield / Midjourney / DALL·E / Imagen)

```
Wide 16:9 editorial illustration, calm and hopeful. On a light warm-white desk, a dozen scattered paper medical reports,
lab printouts and an X-ray film lie on the left side, slightly messy. A single continuous thread in deep teal runs from
each paper, weaving through them, and gathers on the right into one neat, well-ordered folder lying next to a laptop
whose screen shows a clean list with green, amber and red status dots and a checklist. The thread ends in a small knot
tied around the folder. Soft natural daylight from the left, gentle shadows, shallow depth of field on the papers,
sharp focus on the thread and the folder. Muted palette: warm white, light grey, deep teal, a touch of amber.
Flat-ish modern editorial style with subtle paper texture, minimal, lots of negative space in the upper right third
for a title. No people's faces, no hospital logos, no readable text, no brand names, no robots, no glowing brains.
```

**Negative prompt (ak ho nástroj podporuje):** `text, letters, logo, watermark, brand, robot, glowing brain, circuit, faces, blood, syringe, dark, horror, cluttered right side`

## Varianty (ak prvý nevyjde)
1. **Mapa:** zhora pohľad na abstraktnú mapu „Praha a okolie“ bez skutočných ulíc, so 7 bodmi (zariadenia), spojenými jednou tyrkysovou niťou do bodu „KOC 2“ (druhý bod „KOC 1“ pre CT).
2. **Štafeta:** dve ruky si odovzdávajú zložku, z ktorej nevypadne žiadny papier (niť ich drží pokope); svetlé pozadie.
3. **Screenshot:** skutočná obrazovka appky (fronta prípadov) v rámčeku notebooku, vľavo rozhádzané papiere, cez ne niť – zostaví sa v Canve/Figme z reálneho screenshotu (najbezpečnejšie, žiadna AI chyba).

## Text do editora (po vygenerovaní)
- Hore vpravo, veľké: **NIT** (alebo finálny názov zo SUBMISSION.md)
- Pod tým menšie: **Aby se nic neztratilo a bylo jasné, kdo je na tahu.** (všetky texty na obrázku česky)
- Dole malé: Rakathon 2026 · výzva VZP „Cesta pacienta bez ztráty informací“ · prototyp, fiktívne dáta
- Písmo: Inter alebo Source Sans, tmavá tyrkysová (#0F5B5C) na svetlom pozadí.

## Export
- 1920 × 1080 px (alebo 2400 × 1350), PNG alebo JPG kvalita 85 → typicky 0,5–3 MB (limit 8 MB).
- Uložiť ako `docs/pitch/cover.png` (alebo .jpg) a skontrolovať náhľad v malej veľkosti (≈ 400 px šírka).
- **Nepoužiť:** logo VZP, ÚRO, nemocníc; fotky skutočných pacientov; obrázky s čitateľnými rodnými číslami.
