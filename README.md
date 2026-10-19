# Fyra tillsammans

Ett fristående svenskt ordpussel i React och Vite. Egna exempelspel, inte DN:s innehåll eller design.

## Kör lokalt

Kräver Node.js 20.19+ eller 22.12+.

```sh
npm install
npm run dev
```

Öppna adressen som Vite skriver ut. `npm run build` skapar en statisk produktion i `dist`. `npm run preview` visar bygget lokalt. `npm run games:validate` validerar spelfilen.

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
  "theme": "Valfritt tema",
  "groups": [
    { "category": "Kategori ett", "words": ["ORD A", "ORD B", "ORD C", "ORD D"] },
    { "category": "Kategori två", "words": ["ORD E", "ORD F", "ORD G", "ORD H"] },
    { "category": "Kategori tre", "words": ["ORD I", "ORD J", "ORD K", "ORD L"] },
    { "category": "Kategori fyra", "words": ["ORD M", "ORD N", "ORD O", "ORD P"] }
  ]
}
```

Datum måste vara unika och varje spel måste ha fyra grupper med fyra unika ord. `difficulty` krävs (`easy`, `medium` eller `hard`, visas som Lätt, Medel, Svår) och `theme` är valfritt; båda visas i appen. Filen valideras när appen startar och med `npm run games:validate`. Gruppernas ordning bestämmer färgen. Nya spel läggs enklast till med `node scripts/games.mjs add "…"`, se `SKILLS.md`.

Startsidan väljer senaste tillgängliga spel till och med dagens datum i svensk tidszon, eller första spelet om alla ligger i framtiden. Alla inlagda spel, även framtida, går att välja i listan. Det sker ingen automatisk hämtning från DN eller generering av nya spel. Bygg och publicera om appen efter ändringar i JSON-filen. Facit levereras till webbläsaren; detta är inget fuskskyddat system.

## Regler

Markera fyra ord och välj **Gissa**. Rätt grupp plockas bort. Fyra felaktiga kombinationer avslutar spelet och visar facit. Tre rätta ord ger en ledtråd. Samma felaktiga kombination kostar inte ett nytt misstag. **Blanda** ändrar ordningen och **Avmarkera** tömmer urvalet. Du kan spela igen efter vinst eller förlust.

Klarade och förlorade spel sparas i webbläsarens `localStorage` och visas i datumlistan med antal misstag. En vinst skrivs inte över av en senare förlust. **Ta bort resultat** rensar alla sparade resultat efter bekräftelse. Pågående spel återställs vid sidladdning eller byte av spel.
