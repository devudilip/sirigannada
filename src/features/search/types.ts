/**
 * `public/data/search.json`, the prebuilt full-corpus word index (B-05, GH #43).
 *
 * Kannada is three bytes per letter in UTF-8, so the word list is front-coded to stay under the
 * 1 MB budget: `words` holds one line per distinct normalised word form, sorted, each line being
 * one base-36 character (letters shared with the previous word, capped at 35) plus the rest of the
 * word. `refs` holds, line for line, the blocks that contain that word as comma-separated base-36
 * deltas of a corpus-wide block number. Book `i` owns corpus blocks `starts[i]` up to
 * `starts[i + 1]`; the difference is the book's own block index, the one `#b<n>` links use.
 */
export interface SearchIndexFile {
  v: 1;
  slugs: string[];
  starts: number[];
  words: string;
  refs: string;
}

/** The index after one decode: words expanded and sorted, refs still packed until a word is hit. */
export interface SearchIndex {
  slugs: string[];
  starts: number[];
  words: string[];
  refs: string[];
}

/** One book's matching blocks, in reading order. `blocks` are the book's own block indices. */
export interface BookHits {
  slug: string;
  blocks: number[];
}
