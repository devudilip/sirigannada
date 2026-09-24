/**
 * The prebuilt full-corpus word index (B-05, GH #43), sharded by the first letter of each word so
 * /search downloads only the letters a query needs: `public/data/search/index.json` is the small
 * `SearchIndexMeta`, and `public/data/search/<key>.json` is one `SearchShardFile` per first letter
 * (`key` is that letter's code point in hex, e.g. `c95` for ಕ).
 *
 * Kannada is three bytes per letter in UTF-8, so each shard's word list is front-coded: `words`
 * holds one line per distinct normalised word form, sorted, each line being one base-36 character
 * (letters shared with the previous word, capped at 35) plus the rest of the word. `refs` holds,
 * line for line, the blocks that contain that word as comma-separated base-36 deltas of a
 * corpus-wide block number. Book `i` owns corpus blocks `starts[i]` up to `starts[i + 1]`; the
 * difference is the book's own block index, the one `#b<n>` links use.
 */
export interface SearchIndexMeta {
  v: 2;
  slugs: string[];
  starts: number[];
  /** Shard keys, sorted; one file each. */
  shards: string[];
}

export interface SearchShardFile {
  words: string;
  refs: string;
}

/** One shard after decoding: words expanded and sorted, refs still packed until a word is hit. */
export interface SearchShard {
  words: string[];
  refs: string[];
}

/** What a search runs against: the meta plus whichever shards have been loaded so far. */
export interface SearchIndex {
  slugs: string[];
  starts: number[];
  shards: ReadonlyMap<string, SearchShard>;
}

/** One book's matching blocks, in reading order. `blocks` are the book's own block indices. */
export interface BookHits {
  slug: string;
  blocks: number[];
}
