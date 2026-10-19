# Skill: Add game

Läs INTE `src/games.json`. Använd CLI:t, det sparar tokens.

1. `npm run games:info` – visar lediga datum och senaste spelens kategorier (undvik upprepning).
2. Skriv ett spel per rad och lägg till alla i ett anrop:
   `node scripts/games.mjs add "rad1" "rad2"` (eller `--file fil.txt`, `--replace` för att skriva över ett datum)
3. CLI:t validerar, sorterar och sparar. Vid fel: rätta raden och kör igen. Läs inte filen.
4. Svara kort: datum, svårighet, tema, kategorier.

## Radformat

`DATUM|svårighet|tema|Kategori: ORD, ORD, ORD, ORD|Kategori: …|…|…`

- `DATUM`: `ÅÅÅÅ-MM-DD` eller `next` (nästa lediga datum).
- `svårighet`: `medium` eller `hard` (använd inte `easy`).
- `tema`: kort (1–3 ord) eller tomt (`||`).
- Exakt 4 grupper × 4 ord, 16 unika ord. Ord versaliseras automatiskt.
- Gruppordning = färg; lättast först, svårast sist.

Exempel:
`next|hard|Ordlekar|Fåglar: KRÅKA, TRANA, SVALA, HÄGER|___STOL: GUNG, KÖKS, BAR, RULL|Gömda träd: ALMANACKA, PEKARE, BOKHYLLA, RASPA|Gömda tal: STRESS, SEXTANT, TVÅL, FEMININ`

## Innehållsregler

- medium: minst en ordlek + fällor. hard: minst två ordlekar/stavningsgrupper + flera fällor.
- Ordlekar: gömda ord, `___X`/`X___`-sammansättningar, baklänges, extra bokstav, anagram.
- 1–3 fällor (ord som verkar passa i fel grupp), men varje ord hör till exakt en grupp.
- Kontrollera gömda ord bokstav för bokstav. Vanliga svenska ord. Kopiera aldrig DN:s spel.
- Ändrade ord i ett befintligt spel nollställer spelarnas resultat för det datumet.