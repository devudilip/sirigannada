import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { writeStorage } from "@/lib/storage";
import {
  MAX_GUESSES,
  initWordGameState,
  loadWordGameState,
  saveWordGameState,
  submitGuess,
} from "./wordGameSession";

describe("submitGuess", () => {
  it("records a guess and stays in progress before the win or the last row", () => {
    const state = initWordGameState("2026-09-04", "ಕನ್ನಡವು");
    const next = submitGuess(state, "ಅರಮನೆಯು");
    expect(next.guesses).toEqual(["ಅರಮನೆಯು"]);
    expect(next.outcome).toBe("playing");
  });

  it("wins when the guess matches the target exactly", () => {
    const state = initWordGameState("2026-09-04", "ಕನ್ನಡವು");
    const next = submitGuess(state, "ಕನ್ನಡವು");
    expect(next.outcome).toBe("won");
  });

  it("loses after MAX_GUESSES wrong guesses", () => {
    let state = initWordGameState("2026-09-04", "ಕನ್ನಡವು");
    for (let i = 0; i < MAX_GUESSES; i++) {
      state = submitGuess(state, "ಅರಮನೆಯು");
    }
    expect(state.guesses).toHaveLength(MAX_GUESSES);
    expect(state.outcome).toBe("lost");
  });

  it("is a no-op once the game is over", () => {
    let state = initWordGameState("2026-09-04", "ಕನ್ನಡವು");
    state = submitGuess(state, "ಕನ್ನಡವು");
    const after = submitGuess(state, "ಅರಮನೆಯು");
    expect(after).toBe(state);
  });
});

describe("loadWordGameState / saveWordGameState", () => {
  class MemoryStorage {
    private store = new Map<string, string>();
    getItem(key: string): string | null {
      return this.store.has(key) ? this.store.get(key)! : null;
    }
    setItem(key: string, value: string): void {
      this.store.set(key, String(value));
    }
    removeItem(key: string): void {
      this.store.delete(key);
    }
    clear(): void {
      this.store.clear();
    }
  }

  const original = globalThis.window;

  beforeEach(() => {
    (globalThis as { window?: unknown }).window = { localStorage: new MemoryStorage() };
  });

  afterEach(() => {
    (globalThis as { window?: unknown }).window = original;
  });

  it("starts a fresh game when nothing is stored", () => {
    const state = loadWordGameState("2026-09-04", "ಕನ್ನಡವು");
    expect(state).toEqual(initWordGameState("2026-09-04", "ಕನ್ನಡವು"));
  });

  it("round-trips progress for the same date and target", () => {
    const state = submitGuess(initWordGameState("2026-09-04", "ಕನ್ನಡವು"), "ಅರಮನೆಯು");
    saveWordGameState(state);
    const reloaded = loadWordGameState("2026-09-04", "ಕನ್ನಡವು");
    expect(reloaded).toEqual(state);
  });

  it("discards stale state from a different date", () => {
    const state = submitGuess(initWordGameState("2026-09-03", "ಕನ್ನಡವು"), "ಅರಮನೆಯು");
    saveWordGameState(state);
    const reloaded = loadWordGameState("2026-09-04", "ಕನ್ನಡವು");
    expect(reloaded.guesses).toEqual([]);
  });

  it("discards stale state when the target changed for the same date (e.g. pool rebuilt)", () => {
    const state = submitGuess(initWordGameState("2026-09-04", "ಕನ್ನಡವು"), "ಅರಮನೆಯು");
    saveWordGameState(state);
    const reloaded = loadWordGameState("2026-09-04", "ಬೇರೆಪದವು");
    expect(reloaded.guesses).toEqual([]);
    expect(reloaded.target).toBe("ಬೇರೆಪದವು");
  });

  it("ignores a raw pre-existing value written under a different key", () => {
    writeStorage("unrelated:key", { some: "data" });
    const state = loadWordGameState("2026-09-04", "ಕನ್ನಡವು");
    expect(state.outcome).toBe("playing");
  });
});
