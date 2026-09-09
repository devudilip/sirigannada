import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { readProgress } from "@/features/reader/lib/settings";
import { hashBlock } from "@/features/reader/lib/versePermalink";
import { parseStoredValues } from "@/features/padabandha/lib/puzzle";
import { loadWordGameState } from "@/features/games/lib/wordGameSession";
import { loadCollectionsData } from "@/features/collections/lib/storage";
import { FAVOURITES_COLLECTION_ID } from "@/features/collections/types";
import { applyProgress } from "./applyProgress";
import { buildProgress } from "./buildProgress";
import type { ProgressBlob } from "../types";

class MemoryStorage {
  private store = new Map<string, string>();
  getItem(k: string) {
    return this.store.has(k) ? this.store.get(k)! : null;
  }
  setItem(k: string, v: string) {
    this.store.set(k, String(v));
  }
  removeItem(k: string) {
    this.store.delete(k);
  }
  clear() {
    this.store.clear();
  }
}

const original = globalThis.window;

beforeEach(() => {
  (globalThis as { window?: unknown }).window = { localStorage: new MemoryStorage() };
});
afterEach(() => {
  if (original === undefined) delete (globalThis as { window?: unknown }).window;
  else (globalThis as { window?: unknown }).window = original;
});

const EXP = Date.now() + 60_000;

describe("applyProgress", () => {
  it("restores a reading position into the reader's own key, and a deep-link route", () => {
    const { route } = applyProgress({ v: 1, exp: EXP, library: { bookId: "koti-chennaya", page: 7, verseId: 42 } });
    expect(readProgress("koti-chennaya")).toMatchObject({ block: 42, page: 7 });
    expect(route).toBe("/library/koti-chennaya#b42");
    // the route's hash is what the reader parses on open
    expect(hashBlock(new URL(`https://x${route}`).hash, 1000)).toBe(42);
  });

  it("restores the Padabandha grid so the save helper reads it back", () => {
    const grid = { "mavina-hannu": "ಮಾವಿನ", nagara: "ನಗರ" };
    applyProgress({ v: 1, exp: EXP, padabandha: { packId: "namma-nadu-01", grid } });
    const stored = parseStoredValues(JSON.parse(window.localStorage.getItem("sg:padabandha:namma-nadu-01:v1")!));
    expect(stored).toEqual(grid);
  });

  it("restores daily-word guesses without ever knowing the answer", () => {
    applyProgress({ v: 1, exp: EXP, dailyWord: { date: "2026-09-05", guesses: ["ಮಗು", "ಮನೆ"] } });
    const state = loadWordGameState("2026-09-05", "ಮನೆ"); // target arrives only now, on this device
    expect(state.guesses).toEqual(["ಮಗು", "ಮನೆ"]);
    expect(state.outcome).toBe("won"); // replayed onto the local target
  });

  it("merges stars into the Favourites collection", () => {
    applyProgress({ v: 1, exp: EXP, stars: { words: ["ಮನೆ"], gade: ["gq-12"] } });
    const fav = loadCollectionsData().collections.find((c) => c.id === FAVOURITES_COLLECTION_ID)!;
    expect(fav.items.map((i) => (i.kind === "word" ? i.word : i.kind === "proverb" ? i.proverbId : ""))).toEqual(["ಮನೆ", "gq-12"]);
  });

  it("prefers the reading position over games for the redirect", () => {
    const blob: ProgressBlob = {
      v: 1,
      exp: EXP,
      library: { bookId: "b1", verseId: 3 },
      padabandha: { packId: "namma-nadu-01", grid: { nagara: "ನಗರ" } },
      stars: { words: ["ಪದ"], gade: [] },
    };
    expect(applyProgress(blob).route).toBe("/library/b1#b3");
  });
});

describe("buildProgress -> applyProgress", () => {
  it("carries a reader position placed by buildProgress back to the same key", () => {
    const blob = buildProgress([], { current: { bookId: "shishunala", verseId: 90, page: 5 } });
    expect(blob.dailyWord).toBeUndefined();
    expect(blob.library).toEqual({ bookId: "shishunala", verseId: 90, page: 5 });
    applyProgress(blob);
    expect(readProgress("shishunala")).toMatchObject({ block: 90, page: 5 });
  });
});
