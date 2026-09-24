/**
 * Build public/data/search.json, the full-corpus word index behind /search (B-05, GH #43),
 * from the book JSON that `npm run data:books` wrote. Fails when the index outgrows its budget:
 * the page downloads it whole, so past 1 MB it should be sharded by first letter instead.
 * Usage: npm run data:search
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Book, BooksManifest } from "../src/lib/types";
import { buildSearchIndex } from "../src/features/search/lib/searchIndex";

const BOOKS_DIR = join(process.cwd(), "public", "data", "books");
const OUT = join(process.cwd(), "public", "data", "search.json");
export const SEARCH_INDEX_BUDGET = 1_000_000;

function main(): void {
  const manifest = JSON.parse(readFileSync(join(BOOKS_DIR, "manifest.json"), "utf8")) as BooksManifest;
  const books = manifest.books.map(
    (meta) => JSON.parse(readFileSync(join(BOOKS_DIR, `${meta.slug}.json`), "utf8")) as Book,
  );
  const json = JSON.stringify(buildSearchIndex(books));
  const bytes = Buffer.byteLength(json);
  if (bytes > SEARCH_INDEX_BUDGET) {
    console.error(`✗ search index is ${bytes} bytes, over the ${SEARCH_INDEX_BUDGET} byte budget — shard it by first letter`);
    process.exit(1);
  }
  writeFileSync(OUT, json);
  console.log(`✓ wrote search index for ${books.length} book(s): ${(bytes / 1024).toFixed(0)} KB`);
}

if (process.argv[1]?.endsWith("build-search.ts")) main();
