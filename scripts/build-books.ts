/**
 * Build public/data/books/<slug>.json and manifest.json from data/books-src/.
 * Runs the corpus validation first and refuses to write anything if it fails.
 * Usage: npm run data:books
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import type { Book, BookMeta, BooksManifest } from "../src/lib/types";
import { eraSortKey, listBookDirs, loadBookSource } from "./lib/books";
import { BOOKS_SRC, validateCorpus } from "./validate-corpus";

const OUT_DIR = join(process.cwd(), "public", "data", "books");

export function buildBook(dir: string): Book {
  const { meta, chapters } = loadBookSource(dir);
  const blockCount = chapters.reduce((n, c) => n + c.blocks.length, 0);
  return { ...meta, chapterCount: chapters.length, blockCount, chapters };
}

export function toMeta(book: Book): BookMeta {
  const { chapters: _chapters, ...meta } = book;
  return meta;
}

export function sortBooks<T extends BookMeta>(books: T[]): T[] {
  return [...books].sort((a, b) => {
    const era = eraSortKey(a.era) - eraSortKey(b.era);
    return era !== 0 ? era : a.title.localeCompare(b.title, "kn");
  });
}

function main(): void {
  const errors = validateCorpus();
  if (errors.length > 0) {
    console.error(`✗ refusing to build: ${errors.length} validation error(s)`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }

  mkdirSync(OUT_DIR, { recursive: true });
  for (const f of readdirSync(OUT_DIR)) if (f.endsWith(".json")) unlinkSync(join(OUT_DIR, f));

  const books = sortBooks(listBookDirs(BOOKS_SRC).map((slug) => buildBook(join(BOOKS_SRC, slug))));
  for (const book of books) {
    writeFileSync(join(OUT_DIR, `${book.slug}.json`), JSON.stringify(book));
    console.log(`  ${book.slug}: ${book.chapterCount} chapters, ${book.blockCount} blocks`);
  }
  const manifest: BooksManifest = { books: books.map(toMeta), builtAt: new Date().toISOString() };
  writeFileSync(join(OUT_DIR, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  console.log(`✓ wrote ${books.length} book(s) to ${OUT_DIR}`);
}

if (process.argv[1]?.endsWith("build-books.ts")) main();
