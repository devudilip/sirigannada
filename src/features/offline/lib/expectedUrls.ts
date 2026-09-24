import type { BooksManifest } from "@/lib/types";
import { dictionaryCacheUrls } from "@/features/dictionary/lib/warmDictionaryCache";
import { loadManifest as loadDictManifest } from "@/features/dictionary/lib/data";
import { BOOKS_MANIFEST_URL, bookCacheUrls, loadSearchShardKeys } from "@/features/library/lib/warmBookCache";
import { loadStoriesManifest, STORIES_MANIFEST_URL } from "@/features/stories/lib/manifest";
import { storiesCacheUrls } from "@/features/stories/lib/offline";
import { playable } from "@/features/stories/lib/queue";
import type { OfflineCategoryId } from "../types";
import { SHELL_PRECACHE_ROUTES } from "./shellManifest";

const DICT_MANIFEST_URL = "/data/dict/manifest.json";
export const PROVERBS_URL = "/data/proverbs.json";

/**
 * The URLs each category expects to have cached. Dictionary, books and stories read their real manifest
 * (falling back to just the manifest URL if it can't be fetched); shell and proverbs are static.
 */
export async function expectedUrlsFor(id: OfflineCategoryId, booksManifest: BooksManifest | null): Promise<string[]> {
  switch (id) {
    case "shell":
      return [...SHELL_PRECACHE_ROUTES];
    case "proverbs":
      return [PROVERBS_URL];
    case "dictionary": {
      const manifest = await loadDictManifest();
      return manifest ? dictionaryCacheUrls(manifest) : [DICT_MANIFEST_URL];
    }
    case "books":
      return booksManifest && booksManifest.books.length > 0
        ? bookCacheUrls(booksManifest.books.map((b) => b.slug), await loadSearchShardKeys())
        : [BOOKS_MANIFEST_URL];
    case "stories": {
      const stories = playable((await loadStoriesManifest()).stories);
      return stories.length > 0 ? storiesCacheUrls(stories) : [STORIES_MANIFEST_URL];
    }
  }
}
