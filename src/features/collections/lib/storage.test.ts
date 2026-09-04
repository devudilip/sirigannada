import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { writeStorage } from "@/lib/storage";
import { DICT_FAVOURITES_KEY } from "@/features/dictionary/types";
import { FAVOURITES_COLLECTION_ID } from "../types";
import { loadCollectionsData, saveCollectionsData } from "./storage";

/**
 * A real (not spy-based) in-memory Storage implementation, so these tests exercise the same
 * getItem/setItem/JSON round trip that a browser localStorage would — not a mocked stand-in
 * that could silently diverge from real semantics.
 */
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

describe("collections storage migration", () => {
  const original = globalThis.window;

  beforeEach(() => {
    (globalThis as { window?: unknown }).window = { localStorage: new MemoryStorage() };
  });

  afterEach(() => {
    (globalThis as { window?: unknown }).window = original;
  });

  it("migrates existing flat favourites into a Favourites collection on first load", () => {
    writeStorage(DICT_FAVOURITES_KEY, ["ಒಂದು", "ಎರಡು"]);

    const data = loadCollectionsData();

    expect(data.collections).toHaveLength(1);
    expect(data.collections[0]!.id).toBe(FAVOURITES_COLLECTION_ID);
    expect(data.collections[0]!.items.map((it) => (it.kind === "word" ? it.word : null))).toEqual(["ಒಂದು", "ಎರಡು"]);
  });

  it("does not duplicate migrated favourites on a second load", () => {
    writeStorage(DICT_FAVOURITES_KEY, ["ಒಂದು", "ಎರಡು"]);

    const first = loadCollectionsData();
    expect(first.collections[0]!.items).toHaveLength(2);

    const second = loadCollectionsData();
    expect(second.collections[0]!.items).toHaveLength(2);
    expect(second).toEqual(first);
  });

  it("leaves the old favourites key untouched after migrating", () => {
    writeStorage(DICT_FAVOURITES_KEY, ["ಒಂದು"]);
    loadCollectionsData();

    const raw = (globalThis.window as unknown as { localStorage: MemoryStorage }).localStorage.getItem("sg:" + DICT_FAVOURITES_KEY);
    expect(raw).toBe(JSON.stringify(["ಒಂದು"]));
  });

  it("a user's own new collections survive a later app load without re-migrating", () => {
    writeStorage(DICT_FAVOURITES_KEY, ["ಒಂದು"]);
    const migrated = loadCollectionsData();
    expect(migrated.collections[0]!.items).toHaveLength(1);

    saveCollectionsData({
      collections: [
        ...migrated.collections,
        { id: "c2", name: "Custom", createdAt: 1, updatedAt: 1, items: [] },
      ],
    });

    const reloaded = loadCollectionsData();
    expect(reloaded.collections).toHaveLength(2);
    expect(reloaded.collections[0]!.items).toHaveLength(1);
  });

  it("starts empty with no error when there is no old data at all", () => {
    const data = loadCollectionsData();
    expect(data.collections).toEqual([]);
  });
});
