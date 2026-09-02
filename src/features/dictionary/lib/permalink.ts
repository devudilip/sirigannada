import { normalise } from "@/lib/kannada";

/** Root-relative URL that opens this headword on the dictionary page. */
export function entryPermalinkPath(word: string): string {
  return `/dictionary?w=${encodeURIComponent(normalise(word))}`;
}

/** Absolute permalink when `origin` is set (e.g. `window.location.origin`). */
export function entryPermalinkUrl(word: string, origin = ""): string {
  const path = entryPermalinkPath(word);
  if (!origin) return path;
  return `${origin.replace(/\/$/, "")}${path}`;
}

/** Prefer permalink `w`, then live-search `q`. */
export function headwordFromParams(get: (key: string) => string | null): string {
  return normalise(get("w") ?? get("q") ?? "");
}
