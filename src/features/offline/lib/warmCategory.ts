import { DATA_CACHE, SHELL_CACHE } from "@/lib/cacheNames";
import type { BooksManifest } from "@/lib/types";
import { warmDictionaryCache } from "@/features/dictionary/lib/warmDictionaryCache";
import { warmBookCache } from "@/features/library/lib/warmBookCache";
import type { OfflineCategoryId, OfflineWarmProgress } from "../types";
import { PROVERBS_URL } from "./expectedUrls";
import { SHELL_PRECACHE_ROUTES } from "./shellManifest";
import { warmUrls } from "./warmCache";

/** (Re)downloads every file a category needs, reusing the dictionary/books features' own warmers. */
export async function warmCategory(
  id: OfflineCategoryId,
  booksManifest: BooksManifest | null,
  onProgress: (p: OfflineWarmProgress) => void,
): Promise<OfflineWarmProgress> {
  switch (id) {
    case "shell":
      return warmUrls(SHELL_CACHE, SHELL_PRECACHE_ROUTES, onProgress);
    case "proverbs":
      return warmUrls(DATA_CACHE, [PROVERBS_URL], onProgress);
    case "dictionary":
      return warmDictionaryCache(onProgress);
    case "books":
      return warmBookCache(booksManifest?.books.map((b) => b.slug) ?? [], onProgress);
  }
}
