import { eraSortKey } from "./books";

/** Shown first on the library shelf, in this order. Remaining books follow by era. */
export const SHELF_FRONT = [
  "panje-koti-chennaya",
  "shishunala-sharifa-tatvapadagalu",
  "lakshmisha-jaimini-bharata",
] as const;

/** Pin SHELF_FRONT, then older works first, then Kannada title. */
export function sortBooks<T extends { slug: string; era: string; title: string }>(books: T[]): T[] {
  const pin = new Map<string, number>(SHELF_FRONT.map((slug, i) => [slug, i]));
  return [...books].sort((a, b) => {
    const pa = pin.get(a.slug);
    const pb = pin.get(b.slug);
    if (pa !== undefined && pb !== undefined) return pa - pb;
    if (pa !== undefined) return -1;
    if (pb !== undefined) return 1;
    const era = eraSortKey(a.era) - eraSortKey(b.era);
    return era !== 0 ? era : a.title.localeCompare(b.title, "kn");
  });
}
