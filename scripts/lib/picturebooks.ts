/**
 * Load and validate picture-book sources under data/picturebooks-src/. Each book is a folder
 * with book.json (a `PictureBook` minus slug/pages/wordCount) and pages.json ({ pages }); its
 * illustrations, cover, and optional audio live under public/data/picturebooks/<slug>/.
 * Used by build-picturebooks.ts and validate-corpus.ts.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import type { PictureBook, PictureBookLevel, PictureBookPage } from "../../src/lib/types";

const LEVELS: readonly PictureBookLevel[] = ["1", "2", "3", "4", "5"];
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type PictureBookSource = Omit<PictureBook, "pages" | "wordCount">;

export function listPicturebookDirs(root: string): string[] {
  if (!existsSync(root)) return [];
  return readdirSync(root)
    // A folder without book.json is a fetch that was skipped or interrupted; ignore it rather than crash.
    .filter((name) => !name.startsWith(".") && !name.startsWith("_") && statSync(join(root, name)).isDirectory() && existsSync(join(root, name, "book.json")))
    .sort();
}

/** Word count across all page paragraphs, split on whitespace — used for reading-time estimates. */
export function countWords(pages: readonly PictureBookPage[]): number {
  return pages.reduce((n, p) => n + p.text.reduce((m, t) => m + (t.trim() === "" ? 0 : t.trim().split(/\s+/).length), 0), 0);
}

/** Load one book folder, merging book.json + pages.json and computing wordCount. */
export function loadPicturebook(dir: string, slug: string): PictureBook {
  const meta = JSON.parse(readFileSync(join(dir, "book.json"), "utf8")) as PictureBookSource;
  const raw = JSON.parse(readFileSync(join(dir, "pages.json"), "utf8")) as { pages: PictureBookPage[] };
  // Blank pages (no picture, no words) exist in a few source books; drop them and renumber.
  const pages = raw.pages.filter((p) => p.image !== null || p.text.some((t) => t.trim() !== "")).map((p, i) => ({ ...p, n: i + 1 }));
  return { ...meta, slug, pages, wordCount: countWords(pages) };
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Validate one loaded book. Returns human-readable errors; empty means it is buildable. */
export function validatePicturebook(book: PictureBook, publicRoot: string): string[] {
  const e: string[] = [];
  const at = `picturebooks/${book.slug}`;
  if (!SLUG.test(book.slug)) e.push(`${at}: slug must be lowercase kebab-case`);
  if (!book.title?.trim()) e.push(`${at}: title is required`);
  if (!LEVELS.includes(book.level)) e.push(`${at}: level must be one of ${LEVELS.join(", ")}`);
  if (book.orientation !== "landscape" && book.orientation !== "portrait") e.push(`${at}: orientation must be landscape or portrait`);

  if (!book.cover?.src) {
    e.push(`${at}: cover is required`);
  } else if (!existsSync(join(publicRoot, book.cover.src))) {
    e.push(`${at}: cover file ${book.cover.src} is missing`);
  }

  if (!Array.isArray(book.pages) || book.pages.length === 0) {
    e.push(`${at}: needs at least one page`);
  } else {
    for (const page of book.pages) {
      const hasText = page.text.some((t) => t.trim() !== "");
      if (!hasText && !page.image) e.push(`${at}: page ${page.n} has neither text nor an image`);
      if (page.image && !existsSync(join(publicRoot, page.image.src))) {
        e.push(`${at}: page ${page.n} image ${page.image.src} is missing`);
      }
    }
  }

  if (book.audio) {
    if (!book.audio.src.startsWith(`/data/picturebooks/${book.slug}/`)) e.push(`${at}: audio must be same-origin under /data/picturebooks/${book.slug}/`);
    if (!existsSync(join(publicRoot, book.audio.src))) e.push(`${at}: audio file ${book.audio.src} is missing`);
    if (!(book.audio.durationSec > 0)) e.push(`${at}: audio durationSec must be positive`);
  }

  const p = book.provenance;
  if (!isRecord(p)) {
    e.push(`${at}: provenance block is required`);
    return e;
  }
  if (p.license !== "CC-BY-4.0") e.push(`${at}: provenance.license must be CC-BY-4.0`);
  if (typeof p.source !== "string" || !/^https?:\/\/(www\.)?storyweaver\.org\.in\//.test(p.source)) {
    e.push(`${at}: provenance.source must be a storyweaver.org.in URL`);
  }
  if (typeof p.licenseNote !== "string" || p.licenseNote.trim() === "") e.push(`${at}: provenance.licenseNote is required`);
  if (typeof p.retrieved !== "string" || p.retrieved.trim() === "") e.push(`${at}: provenance.retrieved is required`);
  if (!Array.isArray(p.authors) || p.authors.length === 0) e.push(`${at}: provenance.authors must be non-empty`);
  if (!Array.isArray(p.illustrators) || p.illustrators.length === 0) e.push(`${at}: provenance.illustrators must be non-empty`);
  if (typeof p.attributionLine !== "string" || p.attributionLine.trim() === "") {
    e.push(`${at}: provenance.attributionLine is required`);
  } else if (!p.attributionLine.includes("CC BY 4.0")) {
    e.push(`${at}: provenance.attributionLine must mention CC BY 4.0`);
  }

  return e;
}

/** Level ascending, then title in Kannada collation — the order the hub lists picture books in. */
export function sortPicturebooks<T extends { level: string; title: string }>(books: readonly T[]): T[] {
  return [...books].sort((a, b) => Number(a.level) - Number(b.level) || a.title.localeCompare(b.title, "kn"));
}
