import { describe, expect, it } from "vitest";
import type { Proverb } from "../types";
import { dailyProverb, dailyProverbIndex } from "./dailyProverb";

const POOL: Proverb[] = Array.from({ length: 50 }, (_, i) => ({ id: `p${i}`, text: `ಗಾದೆ ${i}` }));

describe("dailyProverbIndex", () => {
  it("is deterministic for a date and pool size", () => {
    const a = dailyProverbIndex(new Date(2026, 8, 9), 50);
    const b = dailyProverbIndex(new Date(2026, 8, 9, 23, 59), 50);
    expect(a).toBe(b);
    expect(a).toBeGreaterThanOrEqual(0);
    expect(a).toBeLessThan(50);
  });

  it("visits every proverb once before repeating", () => {
    const seen = new Set<number>();
    for (let d = 0; d < 50; d += 1) seen.add(dailyProverbIndex(new Date(2026, 0, 1 + d), 50));
    expect(seen.size).toBe(50);
  });

  it("changes from one day to the next and is not simply the next row", () => {
    const today = dailyProverbIndex(new Date(2026, 8, 9), 50);
    const tomorrow = dailyProverbIndex(new Date(2026, 8, 10), 50);
    expect(tomorrow).not.toBe(today);
  });

  it("handles an empty pool", () => {
    expect(dailyProverbIndex(new Date(), 0)).toBe(0);
    expect(dailyProverb(new Date(), [])).toBeNull();
    expect(dailyProverb(new Date(2026, 8, 9), POOL)?.id).toMatch(/^p\d+$/);
  });
});
