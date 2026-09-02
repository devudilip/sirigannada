/**
 * Validate every book under data/books-src/: metadata, provenance/licence, and text quality.
 * Usage: npm run data:validate   (exit code 1 on any error)
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { listBookDirs, validateBookDir } from "./lib/books";
import { validateProverbsFile } from "./lib/proverbs";

export const BOOKS_SRC = join(process.cwd(), "data", "books-src");
const PROVERBS_JSON = join(process.cwd(), "public", "data", "proverbs.json");

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

function main(): void {
  const errors = [...validateCorpus(), ...validateProverbsJson()];
  const count = listBookDirs(BOOKS_SRC).length;
  if (errors.length > 0) {
    console.error(`✗ corpus validation failed with ${errors.length} error(s):`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  console.log(`✓ ${count} book(s) validated`);
}

if (process.argv[1]?.endsWith("validate-corpus.ts")) main();
