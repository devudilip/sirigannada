/**
 * Shared data contracts. Every JSON file under public/data/ conforms to one of these.
 * Keep this file small and boring — it is the map every contributor (human or AI) reads first.
 */

export type Locale = "kn" | "en";

/**
 * Every licence any asset here may carry. Text is limited to the five the data rules allow
 * (`scripts/lib/books.ts`, `scripts/lib/stories.ts`, `scripts/lib/proverbs.ts` each keep their
 * own narrower list); the older CC versions exist only for Wikimedia Commons photographs, which
 * are usually published under a 2.0/2.5/3.0 licence and cannot be relicensed to 4.0.
 */
export type License =
  | "public-domain"
  | "CC0-1.0"
  | "CC-BY-2.0"
  | "CC-BY-2.5"
  | "CC-BY-3.0"
  | "CC-BY-4.0"
  | "CC-BY-SA-2.0"
  | "CC-BY-SA-2.5"
  | "CC-BY-SA-3.0"
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
  /** Original, plain-language Kannada and English explanations. */
  meaning: Record<Locale, string>;
}

/**
 * Word pool for the daily akshara-guess game (L-05). `words` is the small, hand-picked set a
 * daily puzzle's *answer* is drawn from — every entry must be a word an ordinary reader could
 * plausibly guess, not just a real headword. `guesses` is a much broader set of real,
 * well-formed 2–4-akshara headwords accepted as valid *input*: a player may type any real word
 * (even an obscure one) as a guess, it just never becomes the day's target. See
 * `scripts/lib/wordgame.ts` for how the two are built.
 */
export interface WordGamePool {
  words: WordGameEntry[];
  guesses: string[];
  builtAt: string;
}

/* ----------------------------------- Games ------------------------------------ */

export type LocalizedText = Record<Locale, string>;

export type PadabandhaDirection = "across" | "down";

/** Where a crossword clue came from: written for this project, or an Alar definition (ODbL). */
export type ClueSource = "original" | "alar";

export interface PadabandhaEntry {
  id: string;
  answer: string;
  clue: LocalizedText;
  row: number;
  column: number;
  direction: PadabandhaDirection;
  clueSource?: ClueSource;
}

export interface PadabandhaPuzzle {
  id: string;
  title: LocalizedText;
  rows: number;
  columns: number;
  entries: readonly PadabandhaEntry[];
  provenance: {
    creator: LocalizedText;
    license: "CC-BY-SA-4.0";
  };
}

/**
 * Generated crossword sets (G-01), `public/data/dict/padabandha.json`. `kn` uses only words with
 * original Kannada clues, so the Kannada UI never shows an English clue; `en` adds the everyday
 * words whose only gloss is an Alar (English) definition. The hand-written puzzle is prepended
 * by the UI in both locales.
 */
export interface PadabandhaSet {
  kn: PadabandhaPuzzle[];
  en: PadabandhaPuzzle[];
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

/**
 * A photograph used as a book's cover. Optional: a book without one falls back to the drawn
 * typographic cover. Contract, enforced by `scripts/lib/books.ts` at build time:
 *
 * - `file` must be exactly `<slug>.webp`; the image lives at `public/data/covers/<file>`,
 *   is committed, and must be **40 KB or smaller** (produced with `cwebp`).
 * - `alt.kn` and `alt.en` are both required and describe what the photo shows — not the book.
 * - `provenance` must be complete: an https `source` (the Wikimedia Commons *file page*), an
 *   allowed image licence (`public-domain`, `CC0-1.0`, or any CC BY / CC BY-SA version;
 *   **ODbL is not allowed for images**), a `licenseNote` naming the photographer and the edits
 *   we made (crop, resize, duotone tint), an `author`, and an ISO `retrieved` date.
 *   `public-domain` additionally requires the note to say *why* it is public domain.
 *
 * Example:
 * ```json
 * "cover": {
 *   "file": "basavanna-vachanagalu.webp",
 *   "alt": { "kn": "ಬಸವಣ್ಣನವರ ಪ್ರತಿಮೆ, ಬಸವಕಲ್ಯಾಣ", "en": "Statue of Basavanna at Basavakalyana" },
 *   "provenance": {
 *     "source": "https://commons.wikimedia.org/wiki/File:Basavanna.jpg",
 *     "license": "CC-BY-SA-4.0",
 *     "licenseNote": "Photograph by A. Photographer via Wikimedia Commons, CC BY-SA 4.0; cropped, resized and shown with a brand duotone tint.",
 *     "author": "A. Photographer",
 *     "retrieved": "2026-09-19"
 *   }
 * }
 * ```
 */
export interface BookCover {
  /** File name only, always `<slug>.webp`; served from `/data/covers/`. */
  file: string;
  /** What the photograph shows, in both languages. Never the book title. */
  alt: LocalizedText;
  provenance: Provenance;
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
  /** Optional cover photograph; absent means the drawn typographic fallback is used. */
  cover?: BookCover;
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

/* ----------------------------------- Stories ----------------------------------- */

/** A story's licence: the accepted set, or a placeholder while the rights holder is asked. */
export type StoryLicense = License | "pending-permission";

export type StoryTag = "animal" | "moral" | "funny" | "school" | "family";

export interface StoryProvenance extends Omit<Provenance, "license"> {
  license: StoryLicense;
  /** Who reads the story aloud, when known. */
  narrator?: string;
  /** Publisher or collection name as it should be credited, e.g. "ಕನ್ನಡ ಅಭಿವೃದ್ಧಿ ಪ್ರಾಧಿಕಾರ". */
  publisher?: string;
}

/**
 * One children's story (ಮಕ್ಕಳ ಕಥೆ). `audio` is a same-origin URL under /data/stories/ or null while
 * the licence is pending — a story with a pending licence never carries audio, text, or art.
 * `sentences` and `timings` (start second of each sentence) drive the read-along view.
 */
export interface Story {
  slug: string;
  title: string;
  titleEn?: string;
  collection: LocalizedText;
  /** Position within its collection (e.g. "Audio story series 30"); drives hub order. */
  series?: number;
  tags: StoryTag[];
  durationSec: number;
  audio: string | null;
  /** Size of the audio file in bytes, filled in by the build so the hub can quote a download size. */
  audioBytes?: number;
  /** Same-origin image URL, or null for a typographic placeholder. */
  art: string | null;
  sentences?: string[];
  timings?: number[];
  provenance: StoryProvenance;
}

export interface PendingStorySource {
  name: LocalizedText;
  source: string;
  titles: Array<{ title: string; titleEn?: string }>;
}

export interface StoriesManifest {
  /** Stories that carry audio. */
  stories: Story[];
  /** Titles we hold without audio (licence pending) or catalogues we have asked permission for. */
  pending: PendingStorySource[];
  builtAt: string;
}

/* -------------------------------- Picture books -------------------------------- */

/** StoryWeaver reading level 1–4 (plus "5" for older readers). */
export type PictureBookLevel = "1" | "2" | "3" | "4" | "5";

export interface PictureBookPage {
  /** 1-based, story pages only (covers and attribution pages are not included). */
  n: number;
  /** Illustration with its pixel size: `/data/picturebooks/<slug>/<file>` in source, a URL on the asset base once built. */
  image: { src: string; width: number; height: number } | null;
  /** Paragraphs of page text, plain Unicode Kannada (HTML stripped). May be empty for a picture-only page. */
  text: string[];
}

export interface PictureBookImageCredit {
  page: number;
  title: string;
  illustrator: string;
  holder: string;
  year: string;
}

/** Everything CC BY 4.0 asks us to show, as StoryWeaver's attribution guidelines list it. */
export interface PictureBookProvenance extends Provenance {
  license: "CC-BY-4.0";
  /** The StoryWeaver story page, e.g. https://storyweaver.org.in/en/stories/797-mola-mattu-aame */
  source: string;
  storyweaverId: number;
  authors: string[];
  illustrators: string[];
  translators: string[];
  publisher: string;
  publishedYear: string;
  donor?: string;
  /** Title and language of the original when this is a translation. */
  originalStory?: { title: string; language?: string };
  /** StoryWeaver's own "Other credits" / copyright notice, verbatim. */
  copyrightNotice?: string;
  /** The one-line attribution in StoryWeaver's required form, ready to print. */
  attributionLine: string;
  imageCredits: PictureBookImageCredit[];
  /** Narrator credit for audio books, when StoryWeaver names one. */
  narrator?: string;
}

export interface PictureBook {
  slug: string;
  title: string;
  titleEn?: string;
  level: PictureBookLevel;
  description: string;
  /** "landscape" pages are 2:1 illustrations over text; "portrait" are taller. */
  orientation: "landscape" | "portrait";
  cover: { src: string; width: number; height: number };
  pages: PictureBookPage[];
  /** Whole-story narration (MP3 on the asset base) for StoryWeaver audio books. */
  audio: { src: string; durationSec: number; bytes?: number } | null;
  wordCount: number;
  provenance: PictureBookProvenance;
}

/**
 * One manifest entry: what the hub, shelves, filters and offline save-all need. Provenance is
 * deliberately NOT here — it is ~2.7 KB per book and only the reader, end page and credits page
 * show it, all of which load the per-book /data/picturebooks/<slug>.json (a full PictureBook).
 */
export type PictureBookMeta = Omit<PictureBook, "pages" | "provenance"> & { pageCount: number };

export interface PictureBooksManifest {
  books: PictureBookMeta[];
  builtAt: string;
}
