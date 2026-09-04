import { describe, expect, it } from "vitest";
import {
  addItem,
  createCollection,
  deleteCollection,
  emptyCollectionsData,
  exportCollections,
  isSaved,
  mergeImport,
  migrateFavouriteWords,
  parseExport,
  parseExportJson,
  removeItem,
  renameCollection,
  serializeExport,
  toggleFavourite,
} from "./collections";
import { FAVOURITES_COLLECTION_ID } from "../types";

describe("createCollection / renameCollection / deleteCollection", () => {
  it("creates, renames and deletes a collection", () => {
    let data = createCollection(emptyCollectionsData(), "My words", 1000, "c1");
    expect(data.collections).toHaveLength(1);
    expect(data.collections[0]!).toMatchObject({ id: "c1", name: "My words", items: [] });

    data = renameCollection(data, "c1", "Renamed", 2000);
    expect(data.collections[0]!.name).toBe("Renamed");
    expect(data.collections[0]!.updatedAt).toBe(2000);

    data = deleteCollection(data, "c1");
    expect(data.collections).toHaveLength(0);
  });

  it("ignores blank names", () => {
    const data = createCollection(emptyCollectionsData(), "   ");
    expect(data.collections).toHaveLength(0);
  });
});

describe("addItem / removeItem", () => {
  it("dedupes by item identity and removes by identity", () => {
    let data = createCollection(emptyCollectionsData(), "Words", 1000, "c1");
    data = addItem(data, "c1", { kind: "word", word: "ನಮಸ್ಕಾರ" }, undefined, 1100);
    data = addItem(data, "c1", { kind: "word", word: "ನಮಸ್ಕಾರ" }, undefined, 1200); // duplicate, ignored
    expect(data.collections[0]!.items).toHaveLength(1);

    data = addItem(data, "c1", { kind: "verse", bookSlug: "vachana-1", blockIndex: 3 }, "note", 1300);
    expect(data.collections[0]!.items).toHaveLength(2);

    data = removeItem(data, "c1", { kind: "word", word: "ನಮಸ್ಕಾರ" }, 1400);
    expect(data.collections[0]!.items).toHaveLength(1);
    expect(data.collections[0]!.items[0]!.kind).toBe("verse");
  });
});

describe("toggleFavourite", () => {
  it("creates the implicit Favourites collection on first save and toggles membership", () => {
    let data = emptyCollectionsData();
    data = toggleFavourite(data, { kind: "proverb", proverbId: "p0001" }, 1000);
    expect(data.collections).toHaveLength(1);
    expect(data.collections[0]!.id).toBe(FAVOURITES_COLLECTION_ID);
    expect(isSaved(data, { kind: "proverb", proverbId: "p0001" })).toBe(true);

    data = toggleFavourite(data, { kind: "proverb", proverbId: "p0001" }, 2000);
    expect(isSaved(data, { kind: "proverb", proverbId: "p0001" })).toBe(false);
    expect(data.collections[0]!.items).toHaveLength(0);
  });
});

describe("migrateFavouriteWords", () => {
  it("returns null for an empty list", () => {
    expect(migrateFavouriteWords([])).toBeNull();
  });

  it("builds a Favourites collection from flat words, trimming blanks", () => {
    const migrated = migrateFavouriteWords(["ಒಂದು", " ಎರಡು ", "", "  "], 5000);
    expect(migrated).not.toBeNull();
    expect(migrated?.collections).toHaveLength(1);
    expect(migrated?.collections[0]!.id).toBe(FAVOURITES_COLLECTION_ID);
    expect(migrated?.collections[0]!.items).toEqual([
      { kind: "word", word: "ಒಂದು", addedAt: 5000 },
      { kind: "word", word: "ಎರಡು", addedAt: 5000 },
    ]);
  });
});

describe("export / import round trip", () => {
  it("serializing then parsing reproduces the same collections", () => {
    let data = createCollection(emptyCollectionsData(), "Verses", 1000, "c1");
    data = addItem(data, "c1", { kind: "verse", bookSlug: "vachana-1", blockIndex: 42 }, "beautiful line", 1100);
    data = addItem(data, "c1", { kind: "word", word: "ಆಕಾಶ" }, undefined, 1200);

    const exported = exportCollections(data, undefined, 9999);
    const json = serializeExport(exported);
    const parsed = parseExportJson(json);

    expect(parsed).not.toBeNull();
    expect(parsed).toEqual(exported);
    expect(parsed?.collections).toEqual(data.collections);
  });

  it("merging an import into empty data reproduces the exported collections", () => {
    let data = createCollection(emptyCollectionsData(), "Proverbs", 1000, "c1");
    data = addItem(data, "c1", { kind: "proverb", proverbId: "p0002" }, undefined, 1100);
    const exported = exportCollections(data);

    const restored = mergeImport(emptyCollectionsData(), exported, 5000);
    expect(restored.collections).toEqual(data.collections);
  });

  it("rejects malformed shapes", () => {
    expect(parseExport(null)).toBeNull();
    expect(parseExport({ version: 2, exportedAt: 1, collections: [] })).toBeNull();
    expect(parseExport({ version: 1, exportedAt: 1, collections: [{ id: "x" }] })).toBeNull();
    expect(parseExportJson("not json")).toBeNull();
    expect(
      parseExport({
        version: 1,
        exportedAt: 1,
        collections: [{ id: "c1", name: "X", createdAt: 1, updatedAt: 1, items: [{ kind: "word" }] }],
      }),
    ).toBeNull();
  });

  it("merging twice does not duplicate items", () => {
    let data = createCollection(emptyCollectionsData(), "Words", 1000, "c1");
    data = addItem(data, "c1", { kind: "word", word: "ಮಳೆ" }, undefined, 1100);
    const exported = exportCollections(data);

    let target = emptyCollectionsData();
    target = mergeImport(target, exported, 2000);
    target = mergeImport(target, exported, 3000); // re-importing the same export again
    expect(target.collections[0]!.items).toHaveLength(1);
  });
});
