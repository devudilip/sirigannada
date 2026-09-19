import { dateKey } from "@/features/games/lib/wordGameDay";
import { MAX_GUESSES, type WordGameState } from "@/features/games/lib/wordGameSession";
import { readStorage } from "@/lib/storage";
import type { Locale } from "@/lib/types";

/** What the "ಇಂದು · Today" cell should say for the daily word game. */
export type WordGameStatus =
  | { kind: "play" }
  | { kind: "resume"; guesses: number; total: number }
  | { kind: "done" };

/** Same signature as `readStorage` so tests can pass an in-memory reader. */
export type StorageReader = <T>(key: string, fallback: T) => T;

function isWordGameState(value: unknown): value is WordGameState {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<WordGameState>;
  return typeof v.date === "string" && Array.isArray(v.guesses) && typeof v.outcome === "string";
}

/**
 * Reads today's stored word-game state (key `wordgame:<YYYY-MM-DD>`) without needing the target
 * word, so home never has to fetch the word pool. Stale or malformed records count as unplayed.
 */
export function todayWordStatus(date: Date, read: StorageReader = readStorage): WordGameStatus {
  const key = dateKey(date);
  const stored = read<unknown>(`wordgame:${key}`, null);
  if (!isWordGameState(stored) || stored.date !== key) return { kind: "play" };
  if (stored.outcome !== "playing") return { kind: "done" };
  if (stored.guesses.length > 0) return { kind: "resume", guesses: stored.guesses.length, total: MAX_GUESSES };
  return { kind: "play" };
}

/** "8 Sep" / "8 ಸೆಪ್ಟೆಂ" — day and short month in the UI locale. */
export function formatShortDate(date: Date, locale: Locale): string {
  try {
    return new Intl.DateTimeFormat(locale === "kn" ? "kn-IN" : "en-IN", { day: "numeric", month: "short" }).format(date);
  } catch {
    return `${date.getDate()}/${date.getMonth() + 1}`;
  }
}
