/**
 * The "one verse per page" pagination. Pure arithmetic — no DOM, no measuring.
 *
 * Page order: a title card, then for every chapter a chapter card followed by one page per
 * block. So `page = 1 (title) + (chapterIndex + 1) chapter cards + block`, i.e. `2 + ci + block`.
 */
import type { Book, BookForm } from "@/lib/types";
import type { VerseLayout, VerseLayoutSetting } from "../types";

/** Forms whose blocks are self-contained verses rather than running prose. */
const VERSE_FORMS: BookForm[] = ["vachana", "tripadi", "shatpadi", "kirtane", "poem"];
/** Verse forms short enough that one block per page reads better than a column of text. */
const DECK_FORMS: BookForm[] = ["vachana", "tripadi", "kirtane", "poem"];

export function isVerseForm(form: BookForm): boolean {
  return VERSE_FORMS.includes(form);
}

/** The layout a book gets when the reader has not chosen one. */
export function defaultVerseLayout(form: BookForm): VerseLayout {
  return DECK_FORMS.includes(form) ? "one-per-page" : "flow";
}

/** The reader's explicit choice wins; "auto" (or nothing saved) falls back to the book's form. */
export function effectiveVerseLayout(setting: VerseLayoutSetting | undefined, form: BookForm): VerseLayout {
  return setting && setting !== "auto" ? setting : defaultVerseLayout(form);
}

export interface DeckIndex {
  /** Global block index where each chapter starts. */
  starts: number[];
  /** Blocks in each chapter. */
  counts: number[];
  /** Total blocks in the book. */
  total: number;
  /** Total deck pages: title card + one card per chapter + one page per block. */
  pageCount: number;
}

export type DeckPage =
  | { kind: "title" }
  | { kind: "chapter"; chapter: number }
  | { kind: "verse"; chapter: number; block: number; verse: number };

export function deckIndex(book: Pick<Book, "chapters">): DeckIndex {
  const starts: number[] = [];
  const counts: number[] = [];
  let total = 0;
  for (const ch of book.chapters) {
    starts.push(total);
    counts.push(ch.blocks.length);
    total += ch.blocks.length;
  }
  return { starts, counts, total, pageCount: 1 + book.chapters.length + total };
}

/** Which chapter a global block index belongs to. Empty chapters never claim a block. */
export function deckChapterOfBlock(index: DeckIndex, block: number): number {
  let ci = 0;
  for (let i = 0; i < index.starts.length; i++) {
    if ((index.counts[i] ?? 0) > 0 && (index.starts[i] ?? 0) <= block) ci = i;
  }
  return ci;
}

/** Deck page holding a block. Out-of-range blocks clamp to the first/last verse page. */
export function deckPageOfBlock(index: DeckIndex, block: number): number {
  if (index.total === 0) return 0;
  const clamped = Math.min(Math.max(0, Math.trunc(block)), index.total - 1);
  return 2 + deckChapterOfBlock(index, clamped) + clamped;
}

/** What a deck page shows, or null when the page index is outside the deck. */
export function deckPageAt(index: DeckIndex, page: number): DeckPage | null {
  if (page < 0 || page >= index.pageCount) return null;
  if (page === 0) return { kind: "title" };
  for (let ci = 0; ci < index.starts.length; ci++) {
    const card = 1 + ci + (index.starts[ci] ?? 0);
    if (page === card) return { kind: "chapter", chapter: ci };
    const count = index.counts[ci] ?? 0;
    if (page <= card + count) {
      const verse = page - card;
      return { kind: "verse", chapter: ci, block: (index.starts[ci] ?? 0) + verse - 1, verse };
    }
  }
  return null;
}

/** The block a deck page anchors to — the verse itself, or the chapter's first verse on a card. */
export function deckFirstBlockOnPage(index: DeckIndex, page: number): number {
  const at = deckPageAt(index, page);
  if (!at || at.kind === "title") return 0;
  if (at.kind === "verse") return at.block;
  return Math.min(index.starts[at.chapter] ?? 0, Math.max(0, index.total - 1));
}
