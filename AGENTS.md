# AI-minne: Fyra tillsammans

Läs den här filen innan du ändrar projektet. Uppdatera den när viktiga beslut eller mönster ändras.

## Projekt

- Svenskt ordpussel inspirerat av DN:s Dagens fyra, men med eget namn, egen design och egna spel.
- Kopiera inte DN:s pussel, kategorier, texter eller design.
- All text i appen ska vara på svenska.
- Teknik: React 19 + Vite 7, ES-moduler, ingen backend.
- UI är medvetet enkelt; prioritera spelflöde och data före design.

## Viktiga filer

- `src/games.json` – alla spel, ett per datum.
- `src/game.js` – validering och spelregler, utan React.
- `src/main.jsx` – gränssnitt, datumval och resultat i `localStorage`.
- `src/style.css` – enkel styling.
- `scripts/games.mjs` – CLI för att visa, lägga till och validera spel.
- `SKILLS.md` – arbetsflöde för att skapa nya spel. Läs inte hela `games.json`; använd CLI:t.

## Regler och beteende

- Varje spel har exakt 4 grupper med exakt 4 ord, alltså 16 unika ord.
- Varje spel har `difficulty` (`easy`, `medium` eller `hard`, visas som Lätt, Medel, Svår) och valfritt `theme`; båda visas i datumlistan och ovanför brädet.
- Ord skrivs med versaler och svenska tecken (Å, Ä, Ö).
- Max 4 misstag. Tre rätt i en gissning ger en ledtråd.
- En upprepad felaktig kombination kostar inget nytt misstag.
- Startsidan väljer senaste spel till och med dagens datum i `Europe/Stockholm`.
- Resultat sparas under `localStorage`-nyckeln `fyra-tillsammans:results` (äldre nyckel `fyra-tillsammans:resultat` läses som reserv).
- Varje resultat sparar en signatur av spelets ord. Om ett spel ändras i `games.json` nollställs dess resultat automatiskt.
- En vinst skrivs inte över av en senare förlust. "Ta bort resultat" rensar alla resultat.
- Pågående spel sparas inte.
- Knappen "Om spelet" öppnar en popover (native HTML `popover`) med kort beskrivning och regler.
- Nya spel ska vara `medium` eller `hard`; `easy` används inte längre för nya spel.

## Språk

- Text som visas i appen, spelinnehåll och dokumentation: svenska.
- Kod, identifierare, JSON-nycklar/värden som `difficulty`, felmeddelanden i kod, kommentarer, YAML och git-commits: engelska.

## Kommandon

- `npm run dev` – starta lokalt.
- `npm run games:info` – lediga datum och senaste spel (kompakt).
- `npm run games:validate` – validera `games.json`.
- `node scripts/games.mjs add "rad"` – lägg till spel, se `SKILLS.md`.
- `npm run build` – produktionsbygge.

## Kända detaljer

- Vite på Windows kan ibland missa en filändring. Spara filen igen eller starta om `npm run dev` om webbläsaren visar gammal kod.
