/**
 * Shared helpers for the book pipeline: reading data/books-src, splitting chapter text into
 * blocks, and validating metadata + text quality. Used by build-books.ts and validate-corpus.ts.
 */
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { normalise } from "../../src/lib/kannada";
import type { BookForm, BookMeta, Chapter, License, Provenance } from "../../src/lib/types";

export const LICENSES: readonly License[] = [
  "public-domain",
  "CC0-1.0",
  "CC-BY-4.0",
  "CC-BY-SA-4.0",
  "ODbL-1.0",
];

export const FORMS: readonly BookForm[] = [
  "vachana",
  "tripadi",
  "shatpadi",
  "kirtane",
  "prose",
  "poem",
  "mixed",
];

/** Latest death year (inclusive) for an author to be public domain under Indian law (life + 60). */
export const PD_DEATH_YEAR_MAX = 1965;

/** Metadata as written by hand in book.json (counts are computed at build time). */
export type BookSourceMeta = Omit<BookMeta, "chapterCount" | "blockCount">;

export interface BookSource {
  dir: string;
  meta: BookSourceMeta;
  chapters: Chapter[];
}

export const CHAPTER_FILE_RE = /^(\d{2})-(.+)\.txt$/;

/* --------------------------------- text helpers --------------------------------- */

/** Split body text into blocks: one or more blank lines separate blocks; inner newlines kept. */
export function splitBlocks(text: string): string[] {
  return text
    .replace(/\r\n?/g, "\n")
    .split(/\n[ \t]*\n+/)
    .map((block) =>
      block
        .split("\n")
        .map((line) => normalise(line))
        .filter((line) => line.length > 0)
        .join("\n"),
    )
    .filter((block) => block.length > 0);
}

/** "01-Peethika Sandhi.txt" → "01-peethika-sandhi". */
export function chapterId(fileName: string): string {
  const m = CHAPTER_FILE_RE.exec(fileName);
  if (!m) throw new Error(`Not a chapter file name: ${fileName}`);
  return `${m[1]}-${slugify(m[2] ?? "")}`;
}

export function slugify(s: string): string {
  return normalise(s)
    .toLowerCase()
    .replace(/[^a-z0-9\u0C80-\u0CFF]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** First line is the chapter title, rest is the body. */
export function parseChapter(fileName: string, content: string): Chapter {
  const text = content.replace(/\r\n?/g, "\n").replace(/^\uFEFF/, "");
  const nl = text.indexOf("\n");
  const title = normalise(nl === -1 ? text : text.slice(0, nl));
  const body = nl === -1 ? "" : text.slice(nl + 1);
  return { id: chapterId(fileName), title, blocks: splitBlocks(body) };
}

/* --------------------------------- validation ---------------------------------- */

const WIKI_MARKUP_RE = /\[\[|\{\{|''|<|>/;
/** Kannada block, Indic danda/double danda, om, Latin letters, digits, basic punctuation and
 *  common typographic punctuation. Markup-ish ASCII (* # _ ~ ^ \ ` { } < > @ $ % & + = /) is out. */
const ALLOWED_CHARS_RE =
  /^[\u0C80-\u0CFF\u0964\u0965\u0950A-Za-z0-9\s!"'(),\-.:;?\[\]|\u2018\u2019\u201C\u201D\u2013\u2014\u2026\u00A0]*$/u;

/** Two dependent vowel signs in a row, or virama + vowel sign: impossible in Kannada after NFC,
 *  and the fingerprint of broken legacy-font conversion (e.g. ಕಾುಗೆ for ಕಾಯಿಗೆ). */
const GARBLED_RE = /[\u0CBE-\u0CCC][\u0CBE-\u0CCC]|\u0CCD[\u0CBE-\u0CCC]/u;

export function findGarbled(text: string): string[] {
  return [...new Set(normalise(text).match(/\S*(?:[\u0CBE-\u0CCC][\u0CBE-\u0CCC]|\u0CCD[\u0CBE-\u0CCC])\S*/gu) ?? [])];
}

export function isGarbled(text: string): boolean {
  return GARBLED_RE.test(normalise(text));
}

export function findDisallowedChars(text: string): string[] {
  if (ALLOWED_CHARS_RE.test(text)) return [];
  const bad = new Set<string>();
  for (const ch of text) if (!ALLOWED_CHARS_RE.test(ch)) bad.add(ch);
  return [...bad];
}

export function validateChapterText(fileName: string, content: string): string[] {
  const errors: string[] = [];
  const text = content.replace(/^\uFEFF/, "");
  const firstLine = normalise(text.split(/\r?\n/, 1)[0] ?? "");
  if (!firstLine) errors.push(`${fileName}: first line must be the chapter title`);
  const chapter = parseChapter(fileName, text);
  if (chapter.blocks.length === 0) errors.push(`${fileName}: chapter has no text blocks`);
  const markup = WIKI_MARKUP_RE.exec(text);
  if (markup) errors.push(`${fileName}: contains markup "${markup[0]}"`);
  const bad = findDisallowedChars(text);
  if (bad.length > 0) {
    const shown = bad.map((c) => `${c} (U+${c.codePointAt(0)?.toString(16).toUpperCase()})`);
    errors.push(`${fileName}: disallowed characters: ${shown.join(", ")}`);
  }
  const garbled = findGarbled(text);
  if (garbled.length > 0) {
    errors.push(`${fileName}: invalid vowel-sign sequences (broken conversion?): ${garbled.slice(0, 5).join(", ")}`);
  }
  return errors;
}

export function isIsoDate(s: unknown): boolean {
  return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s));
}

export function isHttpUrl(s: unknown): boolean {
  if (typeof s !== "string") return false;
  try {
    const u = new URL(s);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function validateProvenance(p: unknown, errors: string[]): void {
  if (!isRecord(p)) {
    errors.push("provenance: missing or not an object");
    return;
  }
  if (!isHttpUrl(p.source)) errors.push("provenance.source: must be an http(s) URL");
  if (!LICENSES.includes(p.license as License)) {
    errors.push(`provenance.license: must be one of ${LICENSES.join(", ")}`);
  }
  if (typeof p.licenseNote !== "string" || p.licenseNote.trim() === "") {
    errors.push("provenance.licenseNote: required");
  }
  if (!isIsoDate(p.retrieved)) errors.push("provenance.retrieved: must be an ISO date YYYY-MM-DD");
  if (p.license === "public-domain") {
    if (typeof p.authorDied !== "number") {
      errors.push("provenance.authorDied: required for public-domain works");
    } else if (p.authorDied > PD_DEATH_YEAR_MAX) {
      errors.push(`provenance.authorDied: ${p.authorDied} is after ${PD_DEATH_YEAR_MAX}; not public domain`);
    }
  }
}

/** Validate a parsed book.json. Returns a list of human-readable errors (empty = valid). */
export function validateBookMeta(raw: unknown, expectedSlug?: string): string[] {
  const errors: string[] = [];
  if (!isRecord(raw)) return ["book.json: not an object"];
  for (const key of ["slug", "title", "author", "era", "description"] as const) {
    if (typeof raw[key] !== "string" || (raw[key] as string).trim() === "") {
      errors.push(`${key}: required string`);
    }
  }
  if (expectedSlug && raw.slug !== expectedSlug) {
    errors.push(`slug: "${String(raw.slug)}" does not match folder "${expectedSlug}"`);
  }
  if (!FORMS.includes(raw.form as BookForm)) errors.push(`form: must be one of ${FORMS.join(", ")}`);
  validateProvenance(raw.provenance, errors);
  return errors;
}

/* -------------------------------- source loading -------------------------------- */

export function listBookDirs(root: string): string[] {
  if (!existsSync(root)) return [];
  return readdirSync(root)
    .filter((name) => !name.startsWith(".") && statSync(join(root, name)).isDirectory())
    .sort();
}

export function listChapterFiles(dir: string): string[] {
  return readdirSync(dir)
    .filter((f) => CHAPTER_FILE_RE.test(f))
    .sort();
}

/** Validate one book folder. Returns errors; empty means the folder is buildable. */
export function validateBookDir(dir: string, slug: string): string[] {
  const metaPath = join(dir, "book.json");
  if (!existsSync(metaPath)) return [`${slug}: book.json missing`];
  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(metaPath, "utf8"));
  } catch (e) {
    return [`${slug}: book.json is not valid JSON (${(e as Error).message})`];
  }
  const errors = validateBookMeta(raw, slug).map((e) => `${slug}: ${e}`);
  const files = listChapterFiles(dir);
  if (files.length === 0) errors.push(`${slug}: no chapter files (NN-*.txt)`);
  for (const f of files) {
    errors.push(...validateChapterText(f, readFileSync(join(dir, f), "utf8")).map((e) => `${slug}/${e}`));
  }
  return errors;
}

/** Load a (previously validated) book folder into memory. */
export function loadBookSource(dir: string): BookSource {
  const meta = JSON.parse(readFileSync(join(dir, "book.json"), "utf8")) as BookSourceMeta;
  const chapters = listChapterFiles(dir).map((f) => parseChapter(f, readFileSync(join(dir, f), "utf8")));
  return { dir, meta, chapters };
}

/** Rough numeric key for shelf ordering: "12th century" → 1150, "c. 1600" → 1600, "1917" → 1917. */
export function eraSortKey(era: string): number {
  const century = /(\d{1,2})(?:st|nd|rd|th)\s+century/i.exec(era);
  if (century) return (Number(century[1]) - 1) * 100 + 50;
  const year = /(\d{3,4})/.exec(era);
  return year ? Number(year[1]) : Number.MAX_SAFE_INTEGER;
}

export type { Provenance };
