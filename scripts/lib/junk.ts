/**
 * Block-body junk detector. Scan verse/prose text only — not provenance URLs or book.json.
 * Hits are leftover wiki markup, English notes, and editor uncertainty parens like (variant?).
 */

const LATIN_RE = /[A-Za-z]+/g;
/** Parenthetical that contains `?` — not every `(…)` pair. */
const UNCERTAIN_NOTE_RE = /\([^()\n]*\?[^()\n]*\)/g;

const MARKS: readonly { char: string; re: RegExp }[] = [
  { char: "=", re: /=/ },
  { char: "<", re: /</ },
  { char: "*", re: /\*/ },
  { char: "_", re: /_/ },
];

/** Human-readable reasons the block is junk; empty means clean. */
export function findBlockJunk(text: string): string[] {
  const hits: string[] = [];
  const latin = text.match(LATIN_RE);
  if (latin) hits.push(`Latin letters "${[...new Set(latin)].join(", ")}"`);
  for (const { char, re } of MARKS) {
    if (re.test(text)) hits.push(`"${char}"`);
  }
  const notes = text.match(UNCERTAIN_NOTE_RE);
  if (notes) {
    hits.push(`uncertainty note ${notes.map((n) => `"${n}"`).join(", ")}`);
  }
  return hits;
}

/** Errors named with file and 0-based block index (empty = all blocks clean). */
export function junkErrorsForBlocks(fileName: string, blocks: string[]): string[] {
  const errors: string[] = [];
  blocks.forEach((block, i) => {
    for (const hit of findBlockJunk(block)) {
      errors.push(`${fileName} block ${i}: contains ${hit}`);
    }
  });
  return errors;
}
