import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateGames, createState, toggleWord, submitGuess, isFinished, shuffle } from '../src/game.js';

const games = JSON.parse(readFileSync(new URL('../src/games.json', import.meta.url), 'utf8'));
const game = games[0];
const guess = (state, words) => submitGuess(game, { ...state, selected: words });

test('all supplied games have four groups and sixteen unique words', () => {
  assert.equal(validateGames(games), games);
});

test('invalid dates, duplicate dates, groups and words are rejected', () => {
  for (const mutate of [
    data => { data[0].date = '2026-02-30'; },
    data => { data[1].date = data[0].date; },
    data => { data[0].groups.pop(); },
    data => { data[0].groups[0].words[0] = ' '; },
    data => { data[0].groups[0].words[0] = 'päron'; },
    data => { delete data[0].difficulty; },
    data => { data[0].difficulty = 'Lätt'; },
    data => { data[0].theme = ' '; },
  ]) {
    const copy = structuredClone(games);
    mutate(copy);
    assert.throws(() => validateGames(copy));
  }
  assert.throws(() => validateGames([]));
});

test('selection is limited to four and can be toggled', () => {
  let state = createState(game);
  for (const word of state.words.slice(0, 5)) state = toggleWord(state, word);
  assert.equal(state.selected.length, 4);
  state = toggleWord(state, state.selected[0]);
  assert.equal(state.selected.length, 3);
});

test('a correct group is removed and all four groups win', () => {
  let state = createState(game);
  for (const group of game.groups) state = guess(state, [...group.words].reverse());
  assert.equal(state.words.length, 0);
  assert.equal(state.solved.length, 4);
  assert.equal(state.mistakes, 0);
  assert.equal(isFinished(state), true);
  assert.equal(submitGuess(game, state), state);
});

test('near misses get a hint and repeated guesses cost no additional mistakes', () => {
  const words = [...game.groups[0].words.slice(0, 3), game.groups[1].words[0]];
  let state = guess(createState(game), words);
  assert.match(state.message, /Nästan/);
  state = guess(state, [...words].reverse());
  assert.equal(state.mistakes, 1);
  assert.match(state.message, /redan/);
});

test('four different incorrect guesses end the game', () => {
  let state = createState(game);
  for (let i = 0; i < 4; i++) {
    state = guess(state, game.groups.map(group => group.words[i]));
  }
  assert.equal(state.mistakes, 4);
  assert.equal(isFinished(state), true);
  assert.equal(toggleWord(state, state.words[0]), state);
  assert.equal(guess(state, game.groups[0].words).solved.length, 0);
});

test('incomplete guesses do not cost a mistake', () => {
  const state = { ...createState(game), selected: game.groups[0].words.slice(0, 3) };
  assert.equal(submitGuess(game, state), state);
});

test('shuffle preserves the input and its words', () => {
  const words = game.groups.flatMap(group => group.words);
  const before = [...words];
  assert.deepEqual(shuffle(words).sort(), [...words].sort());
  assert.deepEqual(words, before);
});
