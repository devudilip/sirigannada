/**
 * Build public/data/picturebooks/manifest.json and one <slug>.json per book from
 * data/picturebooks-src/. Refuses to write on any validation error.
 * Usage: npm run data:picturebooks
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { PictureBook, PictureBookMeta, PictureBooksManifest } from "../src/lib/types";
import { listPicturebookDirs, loadPicturebook, sortPicturebooks, validatePicturebook } from "./lib/picturebooks";

export const PICTUREBOOKS_SRC = join(process.cwd(), "data", "picturebooks-src");
const PUBLIC = join(process.cwd(), "public");
const OUT_DIR = join(PUBLIC, "data", "picturebooks");

function toMeta(book: PictureBook): PictureBookMeta {
  const { pages, ...rest } = book;
  return { ...rest, pageCount: pages.length };
}

export function buildPicturebooks(root: string = PICTUREBOOKS_SRC): { books: PictureBook[]; manifest: PictureBooksManifest; errors: string[] } {
  const slugs = listPicturebookDirs(root);
  const books = slugs.map((slug) => loadPicturebook(join(root, slug), slug));
  const errors = books.flatMap((book) => validatePicturebook(book, PUBLIC));
  const seen = new Set<string>();
  for (const b of books) {
    if (seen.has(b.slug)) errors.push(`picturebooks/${b.slug}: duplicate slug`);
    seen.add(b.slug);
  }
  const sorted = sortPicturebooks(books);
  const manifest: PictureBooksManifest = { books: sorted.map(toMeta), builtAt: new Date().toISOString() };
  return { books: sorted, manifest, errors };
}

function main(): void {
  const { books, manifest, errors } = buildPicturebooks();
  if (errors.length > 0) {
    console.error(`✗ refusing to build picturebooks: ${errors.length} error(s)`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(join(OUT_DIR, "manifest.json"), JSON.stringify(manifest));
  for (const book of books) writeFileSync(join(OUT_DIR, `${book.slug}.json`), JSON.stringify(book));
  console.log(`✓ ${books.length} picture book(s) → ${OUT_DIR}`);
}

if (process.argv[1]?.endsWith("build-picturebooks.ts")) main();
