# Skill: Add game

Läs INTE `src/games.json`. Använd CLI:t, det sparar tokens.

1. `npm run games:info` – visar lediga datum och senaste spelens kategorier (undvik upprepning).
2. Skriv ett spel per rad och lägg till alla i ett anrop:
   `node scripts/games.mjs add "rad1" "rad2"` (eller `--file fil.txt`, `--replace` för att skriva över ett datum)
3. CLI:t validerar, sorterar och sparar. Vid fel: rätta raden och kör igen. Läs inte filen.
4. Svara kort: datum, svårighet, kategorier.

## Radformat

`DATUM|svårighet|Kategori: ORD, ORD, ORD, ORD|Kategori: …|…|…`

- `DATUM`: `ÅÅÅÅ-MM-DD` eller `next` (nästa lediga datum).
- `svårighet`: `medium`, `hard` eller `expert` (använd inte `easy`).
- Exakt 4 grupper × 4 ord, 16 unika ord. Ord versaliseras automatiskt.
- Gruppordning = färg; lättast först, svårast sist.

Exempel på hard:
`next|hard|Fåglar: KRÅKA, TRANA, SVALA, HÄGER|___STOL: GUNG, KÖKS, BAR, RULL|Gömda träd: ALMANACKA, PEKARE, BOKHYLLA, RASPA|Gömda tal: STRESS, SEXTANT, TVÅL, FEMININ`

## Innehållsregler

- medium: minst en ordlek och 1–3 fällor.
- hard: minst två ordleks- eller stavningsgrupper och 3–4 fällor.
- expert: minst tre ordleks- eller stavningsgrupper, minst två olika ordleksmekanismer och 4–6 trovärdiga fällor. Använd minst en mekanism som ändrar ordens form (baklänges, anagram eller extra/borttagen bokstav) och minst en gömd ord- eller sammansättningsmekanism. Högst en grupp får bygga enbart på en rak betydelsekategori.
- Ordlekar: gömda ord, `___X`/`X___`-sammansättningar, baklänges, extra bokstav, anagram.
- Fällor ska locka till en tydlig men felaktig gruppering; varje ord hör ändå till exakt en grupp. Räkna inte samma tvetydighet flera gånger.
- För hard och expert: skriv en intern kontroll av varför varje fälla är fel och varför bara den avsedda gruppen fungerar.
- Kontrollera gömda ord bokstav för bokstav och anagram/baklänges tecken för tecken. Använd vanliga svenska ord. Kopiera aldrig DN:s spel.
- Gruppordningen ska gå från lättast till svårast; expertens sista grupp ska kräva den mest indirekta insikten.
- Ändrade ord i ett befintligt spel nollställer spelarnas resultat för det datumet.