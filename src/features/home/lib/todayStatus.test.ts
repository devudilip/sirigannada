import { describe, expect, it } from "vitest";
import { formatShortDate, todayWordStatus, type StorageReader } from "./todayStatus";

function memoryReader(entries: Record<string, unknown>): StorageReader {
  const store = new Map(Object.entries(entries));
  return <T>(key: string, fallback: T): T => (store.has(key) ? (store.get(key) as T) : fallback);
}

const today = new Date(2026, 8, 8);
const KEY = "wordgame:2026-09-08";

describe("todayWordStatus", () => {
  it("is 'play' when nothing is stored for today", () => {
    expect(todayWordStatus(today, memoryReader({}))).toEqual({ kind: "play" });
  });

  it("is 'play' when a state exists but has no guesses yet", () => {
    const read = memoryReader({ [KEY]: { date: "2026-09-08", target: "ಮನೆ", guesses: [], outcome: "playing" } });
    expect(todayWordStatus(today, read)).toEqual({ kind: "play" });
  });

  it("is 'resume' with the guess count while still playing", () => {
    const read = memoryReader({ [KEY]: { date: "2026-09-08", target: "ಮನೆ", guesses: ["ಮರ", "ಮನ"], outcome: "playing" } });
    expect(todayWordStatus(today, read)).toEqual({ kind: "resume", guesses: 2, total: 6 });
  });

  it("is 'done' once the game is won or lost", () => {
    const won = memoryReader({ [KEY]: { date: "2026-09-08", target: "ಮನೆ", guesses: ["ಮನೆ"], outcome: "won" } });
    const lost = memoryReader({ [KEY]: { date: "2026-09-08", target: "ಮನೆ", guesses: [], outcome: "lost" } });
    expect(todayWordStatus(today, won)).toEqual({ kind: "done" });
    expect(todayWordStatus(today, lost)).toEqual({ kind: "done" });
  });

  it("ignores stale or malformed records", () => {
    const stale = memoryReader({ [KEY]: { date: "2026-09-07", target: "ಮನೆ", guesses: ["ಮನೆ"], outcome: "won" } });
    const junk = memoryReader({ [KEY]: "nope" });
    expect(todayWordStatus(today, stale)).toEqual({ kind: "play" });
    expect(todayWordStatus(today, junk)).toEqual({ kind: "play" });
  });
});

describe("formatShortDate", () => {
  it("renders day and short month in English", () => {
    expect(formatShortDate(today, "en")).toMatch(/8/);
    expect(formatShortDate(today, "en")).toMatch(/Sep/);
  });

  it("returns a non-empty string in Kannada", () => {
    expect(formatShortDate(today, "kn").length).toBeGreaterThan(0);
  });
});
