/**
 * Build public/data/picturebooks/manifest.json and one <slug>.json per book from
 * data/picturebooks-src/, with illustration and audio paths rewritten to the asset base
 * (src/lib/assetBase.ts). Refuses to write on any validation error.
 * Usage: npm run data:picturebooks
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { PICTUREBOOK_ASSET_BASE } from "../src/lib/assetBase";
import type { PictureBook, PictureBookMeta, PictureBooksManifest } from "../src/lib/types";
import { listPicturebookDirs, loadPicturebook, localAssetsRoot, sortPicturebooks, validatePicturebook, withAssetBase } from "./lib/picturebooks";

export const PICTUREBOOKS_SRC = join(process.cwd(), "data", "picturebooks-src");
const OUT_DIR = join(process.cwd(), "public", "data", "picturebooks");

/** Manifest entry: the book minus its pages and its provenance (both live in <slug>.json). */
function toMeta(book: PictureBook): PictureBookMeta {
  const { pages, provenance: _provenance, ...rest } = book;
  return { ...rest, pageCount: pages.length };
}

export function buildPicturebooks(
  root: string = PICTUREBOOKS_SRC,
  assetBase: string = PICTUREBOOK_ASSET_BASE,
  assetsRoot: string | null = localAssetsRoot(),
): { books: PictureBook[]; manifest: PictureBooksManifest; errors: string[] } {
  const slugs = listPicturebookDirs(root);
  const books = slugs.map((slug) => loadPicturebook(join(root, slug), slug));
  const errors = books.flatMap((book) => validatePicturebook(book, assetsRoot));
  const seen = new Set<string>();
  for (const b of books) {
    if (seen.has(b.slug)) errors.push(`picturebooks/${b.slug}: duplicate slug`);
    seen.add(b.slug);
  }
  const sorted = sortPicturebooks(books).map((b) => withAssetBase(b, assetBase));
  const manifest: PictureBooksManifest = { books: sorted.map(toMeta), builtAt: new Date().toISOString() };
  return { books: sorted, manifest, errors };
}

function main(): void {
  const assetsRoot = localAssetsRoot();
  const { books, manifest, errors } = buildPicturebooks(PICTUREBOOKS_SRC, PICTUREBOOK_ASSET_BASE, assetsRoot);
  if (errors.length > 0) {
    console.error(`✗ refusing to build picturebooks: ${errors.length} error(s)`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(join(OUT_DIR, "manifest.json"), JSON.stringify(manifest));
  for (const book of books) writeFileSync(join(OUT_DIR, `${book.slug}.json`), JSON.stringify(book));
  console.log(`✓ ${books.length} picture book(s) → ${OUT_DIR}, assets on ${PICTUREBOOK_ASSET_BASE}${assetsRoot ? "" : " (no local assets/ mirror: files not checked)"}`);
}

if (process.argv[1]?.endsWith("build-picturebooks.ts")) main();
