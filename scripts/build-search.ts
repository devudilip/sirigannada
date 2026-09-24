/**
 * Build public/data/search/, the full-corpus word index behind /search (B-05, GH #43), from the
 * book JSON that `npm run data:books` wrote: index.json (book list + shard keys) and one shard per
 * first letter. /search downloads only the shards a query needs, so the budget is per shard.
 * Usage: npm run data:search
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Book, BooksManifest } from "../src/lib/types";
import { buildSearchIndex } from "../src/features/search/lib/searchIndex";

const BOOKS_DIR = join(process.cwd(), "public", "data", "books");
const OUT_DIR = join(process.cwd(), "public", "data", "search");
export const SEARCH_SHARD_BUDGET = 400_000;

function main(): void {
  const manifest = JSON.parse(readFileSync(join(BOOKS_DIR, "manifest.json"), "utf8")) as BooksManifest;
  const books = manifest.books.map(
    (meta) => JSON.parse(readFileSync(join(BOOKS_DIR, `${meta.slug}.json`), "utf8")) as Book,
  );
  const { meta, shards } = buildSearchIndex(books);
  const files = Object.entries(shards).map(([key, shard]) => [key, JSON.stringify(shard)] as const);
  const over = files.filter(([, json]) => Buffer.byteLength(json) > SEARCH_SHARD_BUDGET);
  if (over.length > 0) {
    for (const [key, json] of over) console.error(`✗ search shard ${key} is ${Buffer.byteLength(json)} bytes, over ${SEARCH_SHARD_BUDGET}`);
    console.error("  split the largest shards by their first two letters");
    process.exit(1);
  }
  rmSync(OUT_DIR, { recursive: true, force: true });
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(join(OUT_DIR, "index.json"), JSON.stringify(meta));
  for (const [key, json] of files) writeFileSync(join(OUT_DIR, `${key}.json`), json);
  const total = files.reduce((n, [, json]) => n + Buffer.byteLength(json), 0);
  const largest = Math.max(...files.map(([, json]) => Buffer.byteLength(json)));
  console.log(
    `✓ wrote search index for ${books.length} book(s): ${files.length} shards, ` +
      `${(total / 1024).toFixed(0)} KB in all, largest ${(largest / 1024).toFixed(0)} KB`,
  );
}

if (process.argv[1]?.endsWith("build-search.ts")) main();
