/**
 * Validate every book under data/books-src/: metadata, provenance/licence, and text quality.
 * Usage: npm run data:validate   (exit code 1 on any error)
 */
import { join } from "node:path";
import { listBookDirs, validateBookDir } from "./lib/books";

export const BOOKS_SRC = join(process.cwd(), "data", "books-src");

export function validateCorpus(root: string = BOOKS_SRC): string[] {
  const slugs = listBookDirs(root);
  if (slugs.length === 0) return [`no book folders found under ${root}`];
  return slugs.flatMap((slug) => validateBookDir(join(root, slug), slug));
}

function main(): void {
  const errors = validateCorpus();
  const count = listBookDirs(BOOKS_SRC).length;
  if (errors.length > 0) {
    console.error(`✗ corpus validation failed with ${errors.length} error(s):`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  console.log(`✓ ${count} book(s) validated`);
}

if (process.argv[1]?.endsWith("validate-corpus.ts")) main();
