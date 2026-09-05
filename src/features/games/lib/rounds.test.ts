import { describe, expect, it } from "vitest";
import { initRounds, nextRound } from "./rounds";

describe("nextRound", () => {
  it("visits every index exactly once before repeating", () => {
    let state = initRounds(10, 42);
    const seen: number[] = [];
    for (let i = 0; i < 10; i += 1) {
      const r = nextRound(state, 10);
      state = r.state;
      seen.push(r.index);
    }
    expect([...seen].sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it("skips excluded indices such as today's daily puzzle", () => {
    let state = initRounds(6, 7);
    for (let i = 0; i < 5; i += 1) {
      const r = nextRound(state, 6, [3]);
      state = r.state;
      expect(r.index).not.toBe(3);
    }
  });

  it("reseeds and continues once a pass is exhausted", () => {
    let state = initRounds(3, 1);
    for (let i = 0; i < 3; i += 1) state = nextRound(state, 3).state;
    const r = nextRound(state, 3);
    expect(r.state.seed).not.toBe(1);
    expect([0, 1, 2]).toContain(r.index);
  });

  it("restarts the pass when the pool size changes", () => {
    const state = { seed: 5, cursor: 4, total: 10 };
    const r = nextRound(state, 20);
    expect(r.state.total).toBe(20);
    expect(r.state.cursor).toBe(1);
  });

  it("is deterministic for a seed", () => {
    expect(nextRound(initRounds(50, 9), 50).index).toBe(nextRound(initRounds(50, 9), 50).index);
  });
});
