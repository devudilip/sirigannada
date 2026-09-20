import { BEGINNER_PADABANDHA } from "../data/puzzles";
import { dailyPadabandhaId, padabandhaPool } from "./today";
import type { PadabandhaSet } from "@/lib/types";

const extra = (id: string) => ({ ...BEGINNER_PADABANDHA, id });

const set: PadabandhaSet = {
  kn: [extra("kn-1"), extra("kn-2"), extra("kn-3")],
  en: [extra("en-1"), extra("en-2")],
  builtAt: "2026-01-01",
};

describe("padabandhaPool", () => {
  it("puts the beginner puzzle first, then the locale's generated set", () => {
    expect(padabandhaPool(set, "kn").map((p) => p.id)).toEqual([BEGINNER_PADABANDHA.id, "kn-1", "kn-2", "kn-3"]);
    expect(padabandhaPool(set, "en").map((p) => p.id)).toEqual([BEGINNER_PADABANDHA.id, "en-1", "en-2"]);
  });

  it("falls back to just the beginner puzzle when the set hasn't loaded", () => {
    expect(padabandhaPool(null, "kn").map((p) => p.id)).toEqual([BEGINNER_PADABANDHA.id]);
    expect(padabandhaPool(undefined, "kn").map((p) => p.id)).toEqual([BEGINNER_PADABANDHA.id]);
  });
});

describe("dailyPadabandhaId", () => {
  it("is deterministic for a given date and picks an id actually in the pool", () => {
    const date = new Date(2026, 8, 4);
    const id = dailyPadabandhaId(set, "kn", date);
    expect(padabandhaPool(set, "kn").map((p) => p.id)).toContain(id);
    expect(dailyPadabandhaId(set, "kn", date)).toBe(id);
  });

  it("falls back to the beginner puzzle id when the set is missing", () => {
    expect(dailyPadabandhaId(null, "kn", new Date(2026, 8, 4))).toBe(BEGINNER_PADABANDHA.id);
  });
});
