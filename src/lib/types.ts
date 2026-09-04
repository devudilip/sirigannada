/**
 * Shared data contracts. Every JSON file under public/data/ conforms to one of these.
 * Keep this file small and boring — it is the map every contributor (human or AI) reads first.
 */

export type Locale = "kn" | "en";

export type License =
  | "public-domain"
  | "CC0-1.0"
  | "CC-BY-4.0"
  | "CC-BY-SA-4.0"
  | "ODbL-1.0";

/** Where a text or dataset came from and why we are allowed to use it. Mandatory everywhere. */
export interface Provenance {
  source: string;
  license: License;
  licenseNote: string;
  author?: string;
  authorDied?: number;
  retrieved: string;
}

/* ---------------------------------- Dictionary ---------------------------------- */

export type PartOfSpeech =
  | "noun"
  | "verb"
  | "adjective"
  | "adverb"
  | "pronoun"
  | "conjunction"
  | "interjection"
  | "preposition"
  | "prefix"
  | "suffix"
  | "other";

export interface Definition {
  text: string;
  pos: PartOfSpeech;
}

export interface DictEntry {
  /** Stable id from the source corpus. */
  id: number;
  /** Kannada headword, NFC-normalised Unicode. */
  word: string;
  /** Latin phonetic transcription from the source, if present. */
  phone?: string;
  /** Language the word was borrowed from (Sanskrit, Persian…), when the source records it. */
  origin?: string;
  /** True when the Kannada headword is shorter than the phone (Alar truncation). */
  truncated?: boolean;
  /** Loose phonetic key for "sounds-like" matching (see src/lib/kannada.ts). */
  key: string;
  defs: Definition[];
}

/** One shard = all entries whose headword starts with the same akshara. */
export interface DictShard {
  akshara: string;
  entries: DictEntry[];
}

/**
 * Reverse index shard: English token → [entry id, Kannada headword] pairs.
 * The headword lets the client compute which Kannada shard holds the full entry.
 * Sharded by first Latin letter.
 */
export interface ReverseShard {
  letter: string;
  index: Record<string, Array<[id: number, word: string]>>;
}

/** 366 hand-picked-by-rule entries for "word of the day"; index by day-of-year. */
export interface DailyWords {
  entries: DictEntry[];
}

/** One entry in the daily akshara-guess game's word pool (L-05). */
export interface WordGameEntry {
  word: string;
  /** Short English sense, shown on the end-of-game reveal. */
  meaning: string;
}

/**
 * Word pool for the daily akshara-guess game (L-05). `words` is the small, hand-picked set a
 * daily puzzle's *answer* is drawn from — every entry must be a word an ordinary reader could
 * plausibly guess, not just a real headword. `guesses` is a much broader set of real,
 * well-formed 5-akshara headwords accepted as valid *input*: a player may type any real word
 * (even an obscure one) as a guess, it just never becomes the day's target. See
 * `scripts/lib/wordgame.ts` for how the two are built.
 */
export interface WordGamePool {
  words: WordGameEntry[];
  guesses: string[];
  builtAt: string;
}

export interface DictManifest {
  name: string;
  entryCount: number;
  shards: { akshara: string; file: string; count: number }[];
  reverseShards: { letter: string; file: string }[];
  provenance: Provenance;
  builtAt: string;
}

/* ------------------------------------ Books ------------------------------------- */

export type BookForm = "vachana" | "tripadi" | "shatpadi" | "kirtane" | "prose" | "poem" | "mixed";

export interface Chapter {
  id: string;
  title: string;
  /** Paragraphs or verses. Each string is one block; line breaks inside a block are "\n". */
  blocks: string[];
}

export interface BookMeta {
  slug: string;
  title: string;
  titleEn?: string;
  author: string;
  authorEn?: string;
  /** Approximate century or year for shelf ordering, e.g. "12th century" */
  era: string;
  form: BookForm;
  description: string;
  chapterCount: number;
  blockCount: number;
  provenance: Provenance;
}

export interface Book extends BookMeta {
  chapters: Chapter[];
}

export interface BooksManifest {
  books: BookMeta[];
  builtAt: string;
}

/* ---------------------------------- Proverbs ---------------------------------- */

/** One folk saying. `id` is assigned at fetch time and is stable for a given build. */
export interface Proverb {
  text: string;
  id?: string;
}

export interface ProverbsFile {
  provenance: Provenance;
  /** Wikiquote page URLs this file was built from. */
  pages: string[];
  proverbs: Proverb[];
}
