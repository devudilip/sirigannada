/**
 * Validate every book under data/books-src/: metadata, provenance/licence, and text quality.
 * Usage: npm run data:validate   (exit code 1 on any error)
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { listBookDirs, validateBookDir } from "./lib/books";
import { listPicturebookDirs, loadPicturebook, validatePicturebook } from "./lib/picturebooks";
import { validateProverbsFile } from "./lib/proverbs";
import { listStoryDirs, loadStory, validateStory } from "./lib/stories";

export const BOOKS_SRC = join(process.cwd(), "data", "books-src");
const PROVERBS_JSON = join(process.cwd(), "public", "data", "proverbs.json");
export const STORIES_SRC = join(process.cwd(), "data", "stories-src");
export const PICTUREBOOKS_SRC = join(process.cwd(), "data", "picturebooks-src");

export function validateCorpus(root: string = BOOKS_SRC): string[] {
  const slugs = listBookDirs(root);
  if (slugs.length === 0) return [`no book folders found under ${root}`];
  return slugs.flatMap((slug) => validateBookDir(join(root, slug), slug));
}

export function validateProverbsJson(file: string = PROVERBS_JSON): string[] {
  if (!existsSync(file)) return [`${file} is missing`];
  try {
    return validateProverbsFile(JSON.parse(readFileSync(file, "utf8")));
  } catch {
    return [`${file} is not valid JSON`];
  }
}

/** Committed stories only (`_dev/` placeholders are local and skipped here). */
export function validateStories(root: string = STORIES_SRC): string[] {
  // Validation never attaches local audio: a committed pending story must validate without it.
  return listStoryDirs(root).flatMap((slug) => validateStory(loadStory(join(root, slug), slug), join(process.cwd(), "public")));
}

/** Committed picture books under data/picturebooks-src/. */
export function validatePicturebooks(root: string = PICTUREBOOKS_SRC): string[] {
  return listPicturebookDirs(root).flatMap((slug) => validatePicturebook(loadPicturebook(join(root, slug), slug), join(process.cwd(), "public")));
}

function main(): void {
  const errors = [...validateCorpus(), ...validateProverbsJson(), ...validateStories(), ...validatePicturebooks()];
  const count = listBookDirs(BOOKS_SRC).length;
  if (errors.length > 0) {
    console.error(`✗ corpus validation failed with ${errors.length} error(s):`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  console.log(
    `✓ ${count} book(s), ${listStoryDirs(STORIES_SRC).length} story(ies), ${listPicturebookDirs(PICTUREBOOKS_SRC).length} picture book(s) validated`,
  );
}

if (process.argv[1]?.endsWith("validate-corpus.ts")) main();
