import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { clearProgress, pickContinue, readProgress, resumePage, writeProgress } from "./progress";

class MemoryStorage implements Storage {
  private m = new Map<string, string>();
  get length() {
    return this.m.size;
  }
  clear() {
    this.m.clear();
  }
  getItem(k: string) {
    return this.m.get(k) ?? null;
  }
  key(i: number) {
    return [...this.m.keys()][i] ?? null;
  }
  removeItem(k: string) {
    this.m.delete(k);
  }
  setItem(k: string, v: string) {
    this.m.set(k, v);
  }
}

describe("picturebook progress", () => {
  const original = globalThis.window;
  beforeEach(() => {
    (globalThis as { window?: unknown }).window = { localStorage: new MemoryStorage() };
  });
  afterEach(() => {
    (globalThis as { window?: unknown }).window = original;
  });

  it("round-trips through storage", () => {
    expect(readProgress("a")).toBeNull();
    writeProgress("a", 3, 15);
    const saved = readProgress("a");
    expect(saved?.page).toBe(3);
    expect(saved?.pageCount).toBe(15);
    clearProgress("a");
    expect(readProgress("a")).toBeNull();
  });

  it("resumes at the saved page, or 0 when nothing saved or finished", () => {
    expect(resumePage(null)).toBe(0);
    expect(resumePage({ page: 5, pageCount: 15, updatedAt: 1 })).toBe(5);
    expect(resumePage({ page: 14, pageCount: 15, updatedAt: 1 })).toBe(0);
  });

  it("picks the most recently touched, unfinished book", () => {
    const store: Record<string, ReturnType<typeof readProgress>> = {
      a: { page: 2, pageCount: 10, updatedAt: 100 },
      b: { page: 5, pageCount: 10, updatedAt: 200 },
      c: { page: 9, pageCount: 10, updatedAt: 300 }, // finished, skipped
      d: null,
    };
    const read = (slug: string) => store[slug] ?? null;
    expect(pickContinue(["a", "b", "c", "d"], read)?.slug).toBe("b");
    expect(pickContinue(["c", "d"], read)).toBeNull();
  });
});
