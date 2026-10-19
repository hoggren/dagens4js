# Skill: Lägg till nya spel

Använd detta arbetsflöde när du ska skapa ett eller flera nya spel i `src/games.json`.

## 1. Välj datum

- Läs befintliga datum i `src/games.json`.
- Lägg till spel för nästa lediga vardag (måndag–fredag), om inget annat begärs.
- Datum har formatet `ÅÅÅÅ-MM-DD` och måste vara unika.
- Håll arrayen sorterad efter datum.

## 2. Välj svårighetsgrad och tema

- `difficulty` krävs och måste vara exakt `easy`, `medium` eller `hard` (visas som Lätt, Medel, Svår).
  - **easy:** mest tydliga kategorier, högst en enkel ordlek.
  - **medium:** blandning, minst en ordlek och några fällor.
  - **hard:** minst två ordlekar/stavningsgrupper och flera fällor.
- `theme` är valfritt: en kort rubrik (1–3 ord), till exempel `Gömda ord`. Utelämna fältet om spelet saknar tydligt tema.
- Variera svårighet över veckan, gärna lättare tidigt och svårare mot fredag.

## 3. Välj fyra kategorier

Blanda svårighetsgrader:

1. **Lätt:** tydlig kategori, till exempel fiskar eller grönsaker.
2. **Medel:** kunskap eller fasta uttryck, till exempel nordiska gudar eller `___BOLL`.
3. **Svår:** ordlek, till exempel gömda ord, ord som blir nya ord med en extra bokstav eller palindrom.
4. **Svårast:** en kategori där sambandet syns först när man tittar på stavningen.

Bra typer av ordlekskategorier:

- Gömda djur, tal, färger eller namn i längre ord.
- Ord som bildar nytt ord med samma förled eller efterled.
- Ord som blir nya ord med en extra bokstav först eller sist.
- Palindrom eller anagram.
- Ord som kan stå före eller efter samma ord.

## 4. Lägg in fällor

- Ha 1–3 ord som ser ut att passa i fel grupp.
- Varje ord ska ändå höra till exakt en grupp när hela lösningen är känd.
- Fällorna ska kännas rättvisa, inte vara tvetydiga utan rimlig lösning.

## 5. Kvalitetskontroll

- `difficulty` är satt och matchar faktisk svårighet; `theme` är kort eller utelämnat.
- Exakt 4 grupper och 4 ord per grupp.
- Inga dubblettord i samma spel.
- Använd vanliga svenska ord och korrekt stavning.
- Skriv ord med versaler; kategorinamn med vanlig skrivning.
- Undvik stötande, för smala eller lätt ifrågasatta ord.
- Kontrollera varje gömt ord bokstav för bokstav.
- Kopiera aldrig DN:s spel eller kategorier.
- Gruppernas ordning styr färgen; lägg gärna lättaste först och svåraste sist.

## Format

```json
{
  "date": "2026-10-23",
  "difficulty": "hard",
  "theme": "Ordlekar",
  "groups": [
    { "category": "Lätt kategori", "words": ["ORD1", "ORD2", "ORD3", "ORD4"] },
    { "category": "Medelsvår kategori", "words": ["ORD5", "ORD6", "ORD7", "ORD8"] },
    { "category": "Ordlek", "words": ["ORD9", "ORD10", "ORD11", "ORD12"] },
    { "category": "Svåraste kategorin", "words": ["ORD13", "ORD14", "ORD15", "ORD16"] }
  ]
}
```

## 6. Verifiera och dokumentera

1. Kör `npm test`.
2. Uppdatera tabellen "Spel som finns" i `AGENTS.md`.
3. Redovisa kort datum, svårighetsgrad, tema, kategorier och eventuella fällor.
