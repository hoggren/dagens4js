// Compact CLI for managing src/games.json without reading the whole file.
// Usage:
//   node scripts/games.mjs info [count]          Next free dates + recent games (one line each)
//   node scripts/games.mjs add [--replace] "<game>" ["<game>" ...]
//   node scripts/games.mjs add [--replace] --file games.txt   One game per line
//   node scripts/games.mjs validate
// Game format: DATE|difficulty|Category: W1, W2, W3, W4|...  (exactly 4 groups)
//   DATE may be "next" for the next free date.
import { readFileSync, writeFileSync } from 'node:fs';
import { validateGames } from '../src/game.js';

const FILE = new URL('../src/games.json', import.meta.url);
const read = path => readFileSync(path, 'utf8').replace(/^\uFEFF/, '');

process.on('uncaughtException', error => {
  console.error(`Error: ${error.message}`);
  process.exit(1);
});

function save(games) {
  const items = games.map(game => {
    const head = [`    "date": "${game.date}"`, `    "difficulty": "${game.difficulty}"`];
    const groups = game.groups
      .map(g => `      { "category": ${JSON.stringify(g.category)}, "words": [${g.words.map(w => JSON.stringify(w)).join(', ')}] }`)
      .join(',\n');
    return `  {\n${head.join(',\n')},\n    "groups": [\n${groups}\n    ]\n  }`;
  });
  writeFileSync(FILE, `[\n${items.join(',\n')}\n]\n`);
}

function nextDate(dates) {
  const last = [...dates].sort().at(-1) ?? new Date().toISOString().slice(0, 10);
  const day = new Date(`${last}T12:00:00Z`);
  do day.setUTCDate(day.getUTCDate() + 1);
  while (dates.has(day.toISOString().slice(0, 10)));
  return day.toISOString().slice(0, 10);
}

function parse(line, dates) {
  const [date, difficulty = '', ...groups] = line.split('|').map(part => part.trim());
  if (groups.length !== 4) throw new Error(`Expected 4 groups: ${line}`);
  return {
    date: date === 'next' ? nextDate(dates) : date,
    difficulty: difficulty.toLowerCase(),
    groups: groups.map(group => {
      const split = group.lastIndexOf(':');
      if (split < 1) throw new Error(`Missing "Category:" in: ${group}`);
      return {
        category: group.slice(0, split).trim(),
        words: group.slice(split + 1).split(',').map(w => w.trim().toLocaleUpperCase('sv-SE')),
      };
    }),
  };
}

const [command = 'info', ...args] = process.argv.slice(2);
const games = JSON.parse(read(FILE));

if (command === 'info') {
  const dates = new Set(games.map(g => g.date));
  const free = [];
  for (let i = 0; i < 5; i++) {
    free.push(nextDate(dates));
    dates.add(free.at(-1));
  }
  console.log(`games: ${games.length}; next free dates: ${free.join(' ')}`);
  for (const g of games.slice(-(Number(args[0]) || 15))) {
    console.log(`${g.date} ${g.difficulty}: ${g.groups.map(x => x.category).join('; ')}`);
  }
} else if (command === 'add') {
  const fileIndex = args.indexOf('--file');
  const lines = fileIndex >= 0
    ? read(args[fileIndex + 1]).split(/\r?\n/)
    : args.filter(arg => !arg.startsWith('--'));
  const next = [...games];
  const dates = new Set(next.map(g => g.date));
  for (const line of lines.map(l => l.trim()).filter(l => l && !l.startsWith('#'))) {
    const game = parse(line, dates);
    const existing = next.findIndex(g => g.date === game.date);
    if (existing >= 0 && !args.includes('--replace')) throw new Error(`${game.date} already exists (use --replace)`);
    if (existing >= 0) next.splice(existing, 1);
    next.push(game);
    dates.add(game.date);
    console.log(`added ${game.date} ${game.difficulty}`);
  }
  next.sort((a, b) => a.date.localeCompare(b.date));
  validateGames(next);
  save(next);
} else if (command === 'validate') {
  validateGames(games);
  console.log(`ok: ${games.length} games`);
} else {
  throw new Error(`Unknown command: ${command}`);
}
