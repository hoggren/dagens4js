# Fyra tillsammans

Ett fristående svenskt ordpussel i React och Vite.

## Regler

Markera fyra ord och välj **Gissa**. Rätt grupp plockas bort. Fyra felaktiga kombinationer avslutar spelet och visar facit. Tre rätta ord ger en ledtråd. Samma felaktiga kombination kostar inte ett nytt misstag.

## Utveckling

### Kör lokalt

Kräver Node.js 20.19+ eller 22.12+.

```sh
npm install
npm run dev
```

### Skapa spel

Öppna adressen som Vite skriver ut. `npm run build` skapar en statisk produktion i `dist`. `npm run preview` visar bygget lokalt.

### Kommandon

- `npm run games:validate` – validera spelen.
- `npm run games:info` – visa lediga datum och senaste spel.
- `node scripts/games.mjs add "…"` – lägg till ett spel.
- `npm install` – installera beroenden.
- `npm run dev` – starta utvecklingsservern.
- `npm run build` – skapa produktionsbygget.
- `npm run preview` – förhandsvisa produktionsbygget.

## Publicera på GitHub Pages

1. På GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Pusha till `main`. Flödet i `.github/workflows/deploy.yml` validerar, bygger och publicerar.
3. Appen finns på `https://hoggren.github.io/dagens4js/`.

## Spel och datum

Alla spel finns i `src/games.json`. Två egna exempel ingår. Lägg till ett objekt per speldag, normalt måndag–fredag:

```json
{
  "date": "2026-10-21",
  "difficulty": "medium",
  "groups": [
    { "category": "Kategori ett", "words": ["ORD A", "ORD B", "ORD C", "ORD D"] },
    { "category": "Kategori två", "words": ["ORD E", "ORD F", "ORD G", "ORD H"] },
    { "category": "Kategori tre", "words": ["ORD I", "ORD J", "ORD K", "ORD L"] },
    { "category": "Kategori fyra", "words": ["ORD M", "ORD N", "ORD O", "ORD P"] }
  ]
}
```

Datum måste vara unika och varje spel måste ha fyra grupper med fyra unika ord. `difficulty` krävs (`easy`, `medium`, `hard` eller `expert`, visas som Lätt, Medel, Svår, Expert); båda visas i appen. Filen valideras när appen startar och med `npm run games:validate`. Gruppernas ordning bestämmer färgen. Nya spel läggs enklast till med `node scripts/games.mjs add "…"`, se `.github/skills/add-game/SKILL.md`.