import { makeRng, pickRandom, seededShuffle } from "./practiceRandom";

describe("makeRng", () => {
  it("is deterministic for a given seed", () => {
    const a = makeRng(42);
    const b = makeRng(42);
    const seqA = Array.from({ length: 5 }, () => a());
    const seqB = Array.from({ length: 5 }, () => b());
    expect(seqA).toEqual(seqB);
  });

  it("produces values in [0, 1)", () => {
    const rng = makeRng(7);
    for (let i = 0; i < 100; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it("differs across seeds", () => {
    const a = makeRng(1)();
    const b = makeRng(2)();
    expect(a).not.toBe(b);
  });
});

describe("seededShuffle", () => {
  it("is a permutation of the input", () => {
    const items = [1, 2, 3, 4, 5];
    const out = seededShuffle(items, makeRng(3));
    expect(out).toHaveLength(items.length);
    expect([...out].sort()).toEqual(items);
  });

  it("does not mutate the input array", () => {
    const items = [1, 2, 3];
    const copy = [...items];
    seededShuffle(items, makeRng(3));
    expect(items).toEqual(copy);
  });

  it("is deterministic for the same seed", () => {
    const items = ["a", "b", "c", "d", "e", "f"];
    expect(seededShuffle(items, makeRng(99))).toEqual(seededShuffle(items, makeRng(99)));
  });
});

describe("pickRandom", () => {
  it("returns the requested count, excluding the given index", () => {
    const items = [10, 20, 30, 40, 50];
    const out = pickRandom(items, 3, makeRng(5), 2);
    expect(out).toHaveLength(3);
    expect(out).not.toContain(30);
  });

  it("returns unique items from the source", () => {
    const items = [1, 2, 3, 4, 5, 6];
    const out = pickRandom(items, 4, makeRng(1));
    expect(new Set(out).size).toBe(4);
  });
});
