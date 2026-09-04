/**
 * Session state for the daily akshara-guess game (L-05): the guesses made so far and whether
 * today's puzzle is won, lost, or still in progress. `submitGuess` is a pure function (easy to
 * test); `loadWordGameState`/`saveWordGameState` are the only parts that touch localStorage
 * (via `src/lib/storage.ts`), keyed by date so a stale state from a previous day or a changed
 * pool never carries over into today's puzzle.
 */
import { readStorage, writeStorage } from "@/lib/storage";

export const MAX_GUESSES = 6;
/** Aksharas the grid has columns for — matches `WORD_GAME_LENGTH` in `scripts/lib/wordgame.ts`,
 * the build-time filter that only lets exactly-this-length headwords into the pool. */
export const WORD_GAME_LENGTH = 5;

export type WordGameOutcome = "playing" | "won" | "lost";

export interface WordGameState {
  date: string;
  target: string;
  guesses: string[];
  outcome: WordGameOutcome;
}

export function initWordGameState(date: string, target: string): WordGameState {
  return { date, target, guesses: [], outcome: "playing" };
}

/** Records one submitted guess and updates the win/loss outcome. No-op once the game is over. */
export function submitGuess(state: WordGameState, guess: string): WordGameState {
  if (state.outcome !== "playing") return state;
  const guesses = [...state.guesses, guess];
  const won = guess === state.target;
  const outcome: WordGameOutcome = won ? "won" : guesses.length >= MAX_GUESSES ? "lost" : "playing";
  return { ...state, guesses, outcome };
}

function storageKey(date: string): string {
  return `wordgame:${date}`;
}

/** Loads today's stored progress, or starts a fresh game if there is none (or it is stale —
 * yesterday's state, or today's target changed because the pool was rebuilt). */
export function loadWordGameState(date: string, target: string): WordGameState {
  const stored = readStorage<WordGameState | null>(storageKey(date), null);
  if (stored && stored.date === date && stored.target === target) return stored;
  return initWordGameState(date, target);
}

export function saveWordGameState(state: WordGameState): void {
  writeStorage(storageKey(state.date), state);
}
