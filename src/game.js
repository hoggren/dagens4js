export const MAX_MISTAKES = 4;
export const DIFFICULTIES = ['easy', 'medium', 'hard', 'expert'];

export function validateGames(games) {
  if (!Array.isArray(games) || games.length === 0) {
    throw new Error('The games file must contain at least one game.');
  }
  const dates = new Set();
  for (const game of games) {
    const date = game?.date;
    if (
      typeof date !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !Number.isFinite(Date.parse(date)) ||
      new Date(date).toISOString().slice(0, 10) !== date ||
      dates.has(date)
    ) {
      throw new Error('Every game must have a unique, valid date (YYYY-MM-DD).');
    }
    dates.add(date);
    if (!DIFFICULTIES.includes(game.difficulty)) {
      throw new Error(`Game ${date} must have a difficulty: ${DIFFICULTIES.join(', ')}.`);
    }
    if (!Array.isArray(game.groups) || game.groups.length !== 4) {
      throw new Error(`Game ${date} must contain four groups.`);
    }
    const words = new Set();
    for (const group of game.groups) {
      if (
        typeof group?.category !== 'string' || !group.category.trim() ||
        !Array.isArray(group.words) || group.words.length !== 4
      ) {
        throw new Error(`Every group in ${date} must have a category and four words.`);
      }
      for (const word of group.words) {
        if (typeof word !== 'string' || !word.trim()) {
          throw new Error(`Game ${date} contains an empty or invalid word.`);
        }
        const normalized = word.trim().normalize('NFC').toLocaleUpperCase('sv-SE');
        if (words.has(normalized)) {
          throw new Error(`Game ${date} contains the duplicate word ${word}.`);
        }
        words.add(normalized);
      }
    }
  }
  return games;
}

export function shuffle(words) {
  const result = [...words];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function createState(game) {
  return {
    words: shuffle(game.groups.flatMap(group => group.words)),
    selected: [],
    solved: [],
    guesses: [],
    mistakes: 0,
    message: '',
  };
}

export function isFinished(state) {
  return state.solved.length === 4 || state.mistakes >= MAX_MISTAKES;
}

export function toggleWord(state, word) {
  if (isFinished(state) || !state.words.includes(word)) return state;
  if (state.selected.includes(word)) {
    return { ...state, selected: state.selected.filter(item => item !== word) };
  }
  if (state.selected.length === 4) return state;
  return { ...state, selected: [...state.selected, word] };
}

export function submitGuess(game, state) {
  if (isFinished(state) || state.selected.length !== 4) return state;
  if (state.guesses.some(guess => guess.every(word => state.selected.includes(word)))) {
    return { ...state, message: 'Du har redan provat den kombinationen.' };
  }
  const guesses = [...state.guesses, [...state.selected]];
  const match = game.groups.findIndex(group =>
    group.words.every(word => state.selected.includes(word)));
  if (match !== -1) {
    const solved = [...state.solved, match];
    return {
      ...state, guesses, solved, selected: [],
      words: state.words.filter(word => !state.selected.includes(word)),
      message: solved.length === 4 ? 'Snyggt! Du hittade alla fyra grupper!' : 'Rätt! En grupp hittad.',
    };
  }
  const mistakes = state.mistakes + 1;
  const almost = game.groups.some(group =>
    group.words.filter(word => state.selected.includes(word)).length === 3);
  return {
    ...state, guesses, mistakes,
    message: mistakes >= MAX_MISTAKES
      ? 'Inga försök kvar. Här är lösningen.'
      : almost ? 'Nästan! Ett ord ska bytas ut.' : 'Inte rätt grupp. Försök igen!',
  };
}
