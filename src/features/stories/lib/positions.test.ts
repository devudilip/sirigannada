import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { clearPosition, pickContinue, readPosition, resumeAt, writePosition } from "./positions";

class MemoryStorage implements Storage {
  private m = new Map<string, string>();
  get length() { return this.m.size; }
  clear() { this.m.clear(); }
  getItem(k: string) { return this.m.get(k) ?? null; }
  key(i: number) { return [...this.m.keys()][i] ?? null; }
  removeItem(k: string) { this.m.delete(k); }
  setItem(k: string, v: string) { this.m.set(k, v); }
}

describe("positions", () => {
  const original = globalThis.window;
  beforeEach(() => {
    (globalThis as { window?: unknown }).window = { localStorage: new MemoryStorage() };
  });
  afterEach(() => {
    (globalThis as { window?: unknown }).window = original;
  });

  it("round-trips a position and ignores the first seconds", () => {
    writePosition("s", 1, 100, 5);
    expect(readPosition("s")).toBeNull();
    writePosition("s", 42, 100, 5);
    expect(readPosition("s")).toEqual({ positionSec: 42, durationSec: 100, updatedAt: 5 });
    clearPosition("s");
    expect(readPosition("s")).toBeNull();
  });

  it("resumes mid-story but restarts a finished one", () => {
    expect(resumeAt(null)).toBe(0);
    expect(resumeAt({ positionSec: 42, durationSec: 100, updatedAt: 1 })).toBe(42);
    expect(resumeAt({ positionSec: 98, durationSec: 100, updatedAt: 1 })).toBe(0);
  });

  it("picks the most recently touched unfinished story for Continue", () => {
    writePosition("a", 30, 100, 10);
    writePosition("b", 50, 100, 20);
    writePosition("c", 99, 100, 30);
    expect(pickContinue(["a", "b", "c", "d"])?.slug).toBe("b");
    expect(pickContinue(["d"])).toBeNull();
  });
});
