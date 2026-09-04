import {
  FAVOURITES_COLLECTION_ID,
  type Collection,
  type CollectionItem,
  type CollectionItemInput,
  type CollectionsData,
  type CollectionsExport,
} from "../types";

/** Stable identity for an item, independent of note/addedAt — used to dedupe within a collection. */
export function itemKey(item: CollectionItemInput): string {
  switch (item.kind) {
    case "word":
      return `word:${item.word}`;
    case "verse":
      return `verse:${item.bookSlug}:${item.blockIndex}`;
    case "proverb":
      return `proverb:${item.proverbId}`;
  }
}

export function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export function emptyCollectionsData(): CollectionsData {
  return { collections: [] };
}

function touch(collection: Collection, now: number): Collection {
  return { ...collection, updatedAt: now };
}

export function findCollection(data: CollectionsData, id: string): Collection | undefined {
  return data.collections.find((c) => c.id === id);
}

export function createCollection(data: CollectionsData, name: string, now = Date.now(), id = makeId()): CollectionsData {
  const trimmed = name.trim();
  if (!trimmed) return data;
  const collection: Collection = { id, name: trimmed, createdAt: now, updatedAt: now, items: [] };
  return { collections: [...data.collections, collection] };
}

export function renameCollection(data: CollectionsData, id: string, name: string, now = Date.now()): CollectionsData {
  const trimmed = name.trim();
  if (!trimmed) return data;
  return {
    collections: data.collections.map((c) => (c.id === id ? touch({ ...c, name: trimmed }, now) : c)),
  };
}

export function deleteCollection(data: CollectionsData, id: string): CollectionsData {
  return { collections: data.collections.filter((c) => c.id !== id) };
}

/** Ensures a collection with this id exists (used for the implicit "Favourites" collection). */
function ensureCollection(data: CollectionsData, id: string, name: string, now: number): CollectionsData {
  if (findCollection(data, id)) return data;
  return createCollection(data, name, now, id);
}

/** Adds an item to a collection; a no-op if an item with the same identity is already present. */
export function addItem(
  data: CollectionsData,
  collectionId: string,
  input: CollectionItemInput,
  note?: string,
  now = Date.now(),
): CollectionsData {
  const key = itemKey(input);
  return {
    collections: data.collections.map((c) => {
      if (c.id !== collectionId) return c;
      if (c.items.some((it) => itemKey(it) === key)) return c;
      const item: CollectionItem = { ...input, addedAt: now, ...(note ? { note } : {}) };
      return touch({ ...c, items: [...c.items, item] }, now);
    }),
  };
}

export function removeItem(data: CollectionsData, collectionId: string, input: CollectionItemInput, now = Date.now()): CollectionsData {
  const key = itemKey(input);
  return {
    collections: data.collections.map((c) =>
      c.id === collectionId ? touch({ ...c, items: c.items.filter((it) => itemKey(it) !== key) }, now) : c,
    ),
  };
}

export function setItemNote(
  data: CollectionsData,
  collectionId: string,
  input: CollectionItemInput,
  note: string,
  now = Date.now(),
): CollectionsData {
  const key = itemKey(input);
  return {
    collections: data.collections.map((c) => {
      if (c.id !== collectionId) return c;
      const items = c.items.map((it) => (itemKey(it) === key ? { ...it, note: note.trim() || undefined } : it));
      return touch({ ...c, items }, now);
    }),
  };
}

/** True when some collection already holds an item with this identity. */
export function isSaved(data: CollectionsData, input: CollectionItemInput): boolean {
  const key = itemKey(input);
  return data.collections.some((c) => c.items.some((it) => itemKey(it) === key));
}

export function collectionsContaining(data: CollectionsData, input: CollectionItemInput): string[] {
  const key = itemKey(input);
  return data.collections.filter((c) => c.items.some((it) => itemKey(it) === key)).map((c) => c.id);
}

/** Toggles `input` in the implicit Favourites collection, creating it if needed. */
export function toggleFavourite(data: CollectionsData, input: CollectionItemInput, now = Date.now()): CollectionsData {
  const withFavourites = ensureCollection(data, FAVOURITES_COLLECTION_ID, "Favourites", now);
  const favourites = findCollection(withFavourites, FAVOURITES_COLLECTION_ID);
  const key = itemKey(input);
  const already = favourites?.items.some((it) => itemKey(it) === key) ?? false;
  return already
    ? removeItem(withFavourites, FAVOURITES_COLLECTION_ID, input, now)
    : addItem(withFavourites, FAVOURITES_COLLECTION_ID, input, undefined, now);
}

/** Pure migration step: turns a flat list of favourited words into a Favourites collection. Returns null when there is nothing to migrate. */
export function migrateFavouriteWords(words: readonly string[], now = Date.now()): CollectionsData | null {
  const trimmed = words.map((w) => w.trim()).filter(Boolean);
  if (trimmed.length === 0) return null;
  const items: CollectionItem[] = trimmed.map((word) => ({ kind: "word", word, addedAt: now }));
  return {
    collections: [{ id: FAVOURITES_COLLECTION_ID, name: "Favourites", createdAt: now, updatedAt: now, items }],
  };
}

/* --------------------------------- Export / import --------------------------------- */

export function exportCollections(data: CollectionsData, ids?: readonly string[], now = Date.now()): CollectionsExport {
  const collections = ids ? data.collections.filter((c) => ids.includes(c.id)) : data.collections;
  return { version: 1, exportedAt: now, collections };
}

export function serializeExport(exp: CollectionsExport): string {
  return JSON.stringify(exp, null, 2);
}

function isCollectionItem(x: unknown): x is CollectionItem {
  if (typeof x !== "object" || x === null) return false;
  const o = x as Record<string, unknown>;
  if (typeof o.addedAt !== "number") return false;
  if (o.note !== undefined && typeof o.note !== "string") return false;
  switch (o.kind) {
    case "word":
      return typeof o.word === "string" && o.word.trim() !== "";
    case "verse":
      return typeof o.bookSlug === "string" && o.bookSlug.trim() !== "" && typeof o.blockIndex === "number";
    case "proverb":
      return typeof o.proverbId === "string" && o.proverbId.trim() !== "";
    default:
      return false;
  }
}

function isCollection(x: unknown): x is Collection {
  if (typeof x !== "object" || x === null) return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    o.id.trim() !== "" &&
    typeof o.name === "string" &&
    typeof o.createdAt === "number" &&
    typeof o.updatedAt === "number" &&
    Array.isArray(o.items) &&
    o.items.every(isCollectionItem)
  );
}

/** Validates a parsed JSON value as a collections export. Returns null when the shape is invalid. */
export function parseExport(raw: unknown): CollectionsExport | null {
  if (typeof raw !== "object" || raw === null) return null;
  const o = raw as Record<string, unknown>;
  if (o.version !== 1) return null;
  if (typeof o.exportedAt !== "number") return null;
  if (!Array.isArray(o.collections) || !o.collections.every(isCollection)) return null;
  return { version: 1, exportedAt: o.exportedAt, collections: o.collections };
}

export function parseExportJson(raw: string): CollectionsExport | null {
  try {
    return parseExport(JSON.parse(raw));
  } catch {
    return null;
  }
}

/**
 * Merges an import into existing data. Collections with a matching id are merged
 * item-by-item (imported items win on note conflicts); new ids are appended.
 */
export function mergeImport(data: CollectionsData, imported: CollectionsExport, now = Date.now()): CollectionsData {
  let next = data;
  for (const incoming of imported.collections) {
    const existing = findCollection(next, incoming.id);
    if (!existing) {
      next = { collections: [...next.collections, incoming] };
      continue;
    }
    let merged = existing;
    for (const item of incoming.items) {
      const key = itemKey(item);
      if (merged.items.some((it) => itemKey(it) === key)) {
        merged = { ...merged, items: merged.items.map((it) => (itemKey(it) === key ? { ...it, ...item } : it)) };
      } else {
        merged = { ...merged, items: [...merged.items, item] };
      }
    }
    merged = touch(merged, now);
    next = { collections: next.collections.map((c) => (c.id === incoming.id ? merged : c)) };
  }
  return next;
}

/** Replaces all local data with the imported data verbatim (used for a clean restore). */
export function replaceWithImport(imported: CollectionsExport): CollectionsData {
  return { collections: imported.collections };
}
