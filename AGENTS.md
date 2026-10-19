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
- `test/game.test.js` – tester för spelregler och spelfilen.
- `SKILLS.md` – arbetsflöde för att skapa nya spel.

## Regler och beteende

- Varje spel har exakt 4 grupper med exakt 4 ord, alltså 16 unika ord.
- Varje spel har `difficulty` (`Lätt`, `Medel` eller `Svår`) och valfritt `theme`; båda visas i datumlistan och ovanför brädet.
- Ord skrivs med versaler och svenska tecken (Å, Ä, Ö).
- Max 4 misstag. Tre rätt i en gissning ger en ledtråd.
- En upprepad felaktig kombination kostar inget nytt misstag.
- Startsidan väljer senaste spel till och med dagens datum i `Europe/Stockholm`.
- Resultat sparas under `localStorage`-nyckeln `fyra-tillsammans:resultat`.
- En vinst skrivs inte över av en senare förlust. "Ta bort resultat" rensar alla resultat.
- Pågående spel sparas inte.

## Spel som finns

| Datum | Svårighet | Tema | Grupper |
|---|---|---|---|
| 2026-10-19 | Lätt | Vardagsmix | Frukter, Danser, Metaller, Kortfärger |
| 2026-10-20 | Lätt | – | Planeter, Verktyg, Årstider, Schackpjäser |
| 2026-10-21 | Medel | Gömda ord | Fiskar, ___BOLL, Gömda djur, Samma baklänges |
| 2026-10-22 | Svår | Ordlekar | Nordiska gudar, Grönsaker, Nytt ord med S först, Gömda tal |

Uppdatera tabellen när spel läggs till. Undvik att återanvända kategorier och ord för ofta.

## Kommandon

- `npm run dev` – starta lokalt.
- `npm test` – kör tester och validera `games.json`.
- `npm run build` – produktionsbygge.

## Kända detaljer

- Vite på Windows kan ibland missa en filändring. Spara filen igen eller starta om `npm run dev` om webbläsaren visar gammal kod.
