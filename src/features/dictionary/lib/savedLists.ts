import { DICT_HISTORY_LIMIT } from "../types";

export function parseStringList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((item): item is string => typeof item === "string" && item.trim() !== "");
}

/** Newest first, unique, capped. Empty queries are ignored. */
export function pushHistory(items: string[], query: string, limit = DICT_HISTORY_LIMIT): string[] {
  const q = query.trim();
  if (!q) return items;
  return [q, ...items.filter((item) => item !== q)].slice(0, limit);
}

/** Star adds to the front; starring again removes. */
export function toggleFavourite(items: string[], word: string): string[] {
  const w = word.trim();
  if (!w) return items;
  if (items.includes(w)) return items.filter((item) => item !== w);
  return [w, ...items];
}
