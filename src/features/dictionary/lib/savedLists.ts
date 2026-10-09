import { hasKannada, splitAksharas } from "@/lib/kannada";
import { DICT_HISTORY_LIMIT } from "../types";

export function parseStringList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((item): item is string => typeof item === "string" && item.trim() !== "");
}

/** Stored history, parsed and trimmed to the current cap (older builds kept up to 20). */
export function parseHistory(raw: unknown, limit = DICT_HISTORY_LIMIT): string[] {
  return parseStringList(raw).slice(0, limit);
}

/**
 * Whether a query is worth keeping in recent searches. A single akshara (ಕ, ಕ್ಷ, ಮೆ) or a single
 * Latin letter is a half-typed word, never a lookup the reader wants to come back to.
 */
export function isRecordableQuery(query: string): boolean {
  const q = query.trim();
  if (!q) return false;
  return hasKannada(q) ? splitAksharas(q).length > 1 : [...q].length > 1;
}

/**
 * The word to remember after an explicit lookup (Enter, a tapped suggestion, a ?w= permalink),
 * once its results are in: a Kannada query that is itself a headword, or a Latin query that found
 * something. Null when the lookup found nothing worth keeping.
 */
export function lookupToRemember(query: string, results: ReadonlyArray<{ entry: { word: string } }>): string | null {
  const q = query.trim();
  if (!isRecordableQuery(q)) return null;
  const exact = results.some(({ entry }) => entry.word === q);
  const latinHit = results.length > 0 && !hasKannada(q);
  return exact || latinHit ? q : null;
}

/** Newest first, unique, capped. Blank and single-akshara queries are ignored. */
export function pushHistory(items: string[], query: string, limit = DICT_HISTORY_LIMIT): string[] {
  const q = query.trim();
  if (!isRecordableQuery(q)) return items;
  return [q, ...items.filter((item) => item !== q)].slice(0, limit);
}

/** Star adds to the front; starring again removes. */
export function toggleFavourite(items: string[], word: string): string[] {
  const w = word.trim();
  if (!w) return items;
  if (items.includes(w)) return items.filter((item) => item !== w);
  return [w, ...items];
}
