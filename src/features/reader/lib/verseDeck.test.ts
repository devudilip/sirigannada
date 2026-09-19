import type { Book, BookForm } from "@/lib/types";
import {
  deckFirstBlockOnPage,
  deckIndex,
  deckPageAt,
  deckPageOfBlock,
  defaultVerseLayout,
  effectiveVerseLayout,
  isVerseForm,
} from "./verseDeck";

function book(...counts: number[]): Pick<Book, "chapters"> {
  return {
    chapters: counts.map((n, ci) => ({
      id: `c${ci}`,
      title: `ಅಧ್ಯಾಯ ${ci}`,
      blocks: Array.from({ length: n }, (_, i) => `ಪದ್ಯ ${ci}-${i}`),
    })),
  };
}

describe("deckIndex", () => {
  it("counts a title card, a card per chapter and a page per block", () => {
    const idx = deckIndex(book(3, 2));
    expect(idx.total).toBe(5);
    expect(idx.starts).toEqual([0, 3]);
    expect(idx.pageCount).toBe(1 + 2 + 5);
  });

  it("handles a book with no blocks", () => {
    const idx = deckIndex(book());
    expect(idx.pageCount).toBe(1);
    expect(deckPageOfBlock(idx, 0)).toBe(0);
    expect(deckFirstBlockOnPage(idx, 0)).toBe(0);
  });
});

describe("deckPageAt", () => {
  const idx = deckIndex(book(2, 1));

  it("lays the pages out in reading order", () => {
    expect(deckPageAt(idx, 0)).toEqual({ kind: "title" });
    expect(deckPageAt(idx, 1)).toEqual({ kind: "chapter", chapter: 0 });
    expect(deckPageAt(idx, 2)).toEqual({ kind: "verse", chapter: 0, block: 0, verse: 1 });
    expect(deckPageAt(idx, 3)).toEqual({ kind: "verse", chapter: 0, block: 1, verse: 2 });
    expect(deckPageAt(idx, 4)).toEqual({ kind: "chapter", chapter: 1 });
    expect(deckPageAt(idx, 5)).toEqual({ kind: "verse", chapter: 1, block: 2, verse: 1 });
  });

  it("returns null outside the deck", () => {
    expect(deckPageAt(idx, -1)).toBeNull();
    expect(deckPageAt(idx, idx.pageCount)).toBeNull();
  });
});

describe("block <-> page round trips", () => {
  it("maps every block to a verse page and back", () => {
    const idx = deckIndex(book(4, 1, 6, 2));
    for (let b = 0; b < idx.total; b++) {
      const page = deckPageOfBlock(idx, b);
      expect(deckPageAt(idx, page)).toMatchObject({ kind: "verse", block: b });
      expect(deckFirstBlockOnPage(idx, page)).toBe(b);
    }
  });

  it("numbers verses within their own chapter", () => {
    const idx = deckIndex(book(2, 3));
    expect(deckPageAt(idx, deckPageOfBlock(idx, 2))).toMatchObject({ verse: 1, chapter: 1 });
    expect(deckPageAt(idx, deckPageOfBlock(idx, 4))).toMatchObject({ verse: 3, chapter: 1 });
  });

  it("clamps out-of-range blocks", () => {
    const idx = deckIndex(book(2));
    expect(deckPageOfBlock(idx, -5)).toBe(deckPageOfBlock(idx, 0));
    expect(deckPageOfBlock(idx, 99)).toBe(deckPageOfBlock(idx, 1));
  });

  it("skips empty chapters when mapping blocks", () => {
    const idx = deckIndex(book(2, 0, 3));
    expect(deckPageAt(idx, 4)).toEqual({ kind: "chapter", chapter: 1 });
    expect(deckPageAt(idx, 5)).toEqual({ kind: "chapter", chapter: 2 });
    expect(deckPageOfBlock(idx, 2)).toBe(6);
    expect(deckFirstBlockOnPage(idx, 6)).toBe(2);
  });
});

describe("deckFirstBlockOnPage", () => {
  const idx = deckIndex(book(2, 3));

  it("anchors the title card to the first block", () => {
    expect(deckFirstBlockOnPage(idx, 0)).toBe(0);
  });

  it("anchors a chapter card to that chapter's first verse", () => {
    expect(deckFirstBlockOnPage(idx, 4)).toBe(2);
  });

  it("clamps pages past the end", () => {
    expect(deckFirstBlockOnPage(idx, 999)).toBe(0);
  });
});

describe("verse layout derivation", () => {
  it("decks short verse forms and flows the rest", () => {
    const deck: BookForm[] = ["vachana", "tripadi", "kirtane", "poem"];
    const flow: BookForm[] = ["shatpadi", "prose", "mixed"];
    for (const form of deck) expect(defaultVerseLayout(form)).toBe("one-per-page");
    for (const form of flow) expect(defaultVerseLayout(form)).toBe("flow");
  });

  it("lets an explicit choice win over the form", () => {
    expect(effectiveVerseLayout("flow", "vachana")).toBe("flow");
    expect(effectiveVerseLayout("one-per-page", "prose")).toBe("one-per-page");
    expect(effectiveVerseLayout("auto", "vachana")).toBe("one-per-page");
    expect(effectiveVerseLayout(undefined, "prose")).toBe("flow");
  });

  it("treats shatpadi as verse for numbering but not for the deck", () => {
    expect(isVerseForm("shatpadi")).toBe(true);
    expect(defaultVerseLayout("shatpadi")).toBe("flow");
    expect(isVerseForm("prose")).toBe(false);
    expect(isVerseForm("mixed")).toBe(false);
  });
});
