import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import data from './games.json';
import { MAX_MISTAKES, validateGames, createState, isFinished, toggleWord, submitGuess, shuffle } from './game.js';
import './style.css';

const STORAGE_KEY = 'fyra-tillsammans:results';
const DIFFICULTY_LABELS = { easy: 'Lätt', medium: 'Medel', hard: 'Svår' };

function loadResults(games) {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    // Drop results for games whose content has changed since they were played.
    return Object.fromEntries(games
      .filter(game => parsed[game.date]?.signature === gameSignature(game))
      .map(game => [game.date, parsed[game.date]]));
  } catch {
    return {};
  }
}

function gameSignature(game) {
  return game.groups.map(group => group.words.join(',')).join('|');
}

function AboutGame() {
  return (
    <>
      <button className="about-button" popoverTarget="about-game">Om spelet</button>
      <div id="about-game" className="about" popover="auto">
        <h2>Om spelet</h2>
        <p>Fyra tillsammans är ett svenskt ordpussel med ett nytt spel varje dag. Du får 16 ord som ska delas in i fyra grupper om fyra.</p>
        <h3>Regler</h3>
        <ul>
          <li>Markera fyra ord som du tror hör ihop och tryck på <strong>Gissa</strong>.</li>
          <li>Grupperna kan bygga på betydelse, sammansatta ord, stavning eller ord som gömmer sig i andra ord.</li>
          <li>Varje ord hör till exakt en grupp. Se upp för ord som verkar passa på flera ställen.</li>
          <li>Du får göra fyra misstag. Har du tre av fyra rätt får du en ledtråd.</li>
          <li>Svårighetsgraden och temat visas ovanför spelbrädet.</li>
        </ul>
        <button popoverTarget="about-game" popoverTargetAction="hide">Stäng</button>
      </div>
    </>
  );
}

function resultLabel(result) {
  if (!result) return '';
  return result.won ? ` ✓ Klarad (${result.mistakes} misstag)` : ' ✗ Ej klarad';
}

function Puzzle({ game, onFinish }) {
  const [state, setState] = useState(() => createState(game));
  const finished = isFinished(state);
  const lost = state.mistakes >= MAX_MISTAKES;

  useEffect(() => {
    if (finished) onFinish({ won: !lost, mistakes: state.mistakes });
  }, [finished]);
  const revealed = lost
    ? [...state.solved, ...game.groups.map((_, index) => index).filter(index => !state.solved.includes(index))]
    : state.solved;

  return (
    <section aria-label="Ordpussel">
      <p>Hitta fyra grupper med fyra ord som hör ihop.</p>
      <div className="board">
        {revealed.map(index => (
          <div className={`group color-${index}`} key={index}>
            <strong>{game.groups[index].category}</strong>
            <span>{game.groups[index].words.join(' · ')}</span>
            {lost && !state.solved.includes(index) && <small>Facit</small>}
          </div>
        ))}
        {!finished && state.words.map(word => (
          <button
            className="word"
            key={word}
            aria-pressed={state.selected.includes(word)}
            disabled={state.selected.length === 4 && !state.selected.includes(word)}
            onClick={() => setState(current => toggleWord(current, word))}
          >{word}</button>
        ))}
      </div>
      <p>Misstag kvar: <strong>{MAX_MISTAKES - state.mistakes}</strong> av {MAX_MISTAKES}</p>
      <p className="message" role="status">{state.message}</p>
      {!finished ? (
        <div className="actions">
          <button onClick={() => setState(current => ({ ...current, words: shuffle(current.words) }))}>Blanda</button>
          <button disabled={!state.selected.length} onClick={() => setState(current => ({ ...current, selected: [] }))}>Avmarkera</button>
          <button className="primary" disabled={state.selected.length !== 4}
            onClick={() => setState(current => submitGuess(game, current))}>Gissa</button>
        </div>
      ) : (
        <button onClick={() => setState(createState(game))}>Spela igen</button>
      )}
    </section>
  );
}

function App({ games }) {
  const sorted = [...games].sort((a, b) => a.date.localeCompare(b.date));
  const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Stockholm' }).format(new Date());
  const defaultGame = sorted.filter(game => game.date <= today).at(-1) ?? sorted[0];
  const [date, setDate] = useState(defaultGame.date);
  const game = sorted.find(item => item.date === date);
  const [results, setResults] = useState(() => loadResults(sorted));
  const completed = sorted.filter(item => results[item.date]?.won).length;

  function clearResults() {
    if (!window.confirm('Vill du ta bort alla sparade resultat?')) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Storage can be unavailable; still clear the visible results.
    }
    setResults({});
  }

  function saveResult(result) {
    setResults(current => {
      // Keep a win if the game is replayed and lost later.
      if (current[date]?.won && !result.won) return current;
      const next = { ...current, [date]: { ...result, signature: gameSignature(game), finishedAt: new Date().toISOString() } };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Storage can be unavailable in private mode; keep the result for this session.
      }
      return next;
    });
  }

  return (
    <main>
      <header>
        <h1>Fyra tillsammans</h1>
        <p>Ett svenskt ordpussel</p>
      </header>
      <select id="game-date" value={date} onChange={event => setDate(event.target.value)}>
        {sorted.map(item => (
          <option key={item.date} value={item.date}>{item.date} · {DIFFICULTY_LABELS[item.difficulty]}{item.theme ? ` · ${item.theme}` : ''}{resultLabel(results[item.date])}</option>
        ))}
      </select>
      <p className="progress">Klarade spel: <strong>{completed}</strong> av {sorted.length}
        {results[date] && <> · Detta spel:{resultLabel(results[date])}</>}</p>
      {Object.keys(results).length > 0 && (
        <button className="clear-results" onClick={clearResults}>Ta bort resultat</button>
      )}
      <p className="game-info">
        <span className={`badge difficulty-${game.difficulty}`}>Svårighetsgrad: {DIFFICULTY_LABELS[game.difficulty]}</span>
        {game.theme && <span className="badge">Tema: {game.theme}</span>}
      </p>
      <Puzzle key={date} game={game} onFinish={saveResult} />
      <footer>Fristående ordpussel med egna exempelspel.
        <br />Resultat sparas i den här webbläsaren. Pågående spel sparas inte.
      </footer>
      <AboutGame />
    </main>
  );
}

const root = createRoot(document.getElementById('root'));
try {
  const games = validateGames(data);
  root.render(<App games={games} />);
} catch (error) {
  console.error(error);
  root.render(<main><h1>Spelet kunde inte laddas</h1><p>Kontrollera spelfilen: {error.message}</p></main>);
}
