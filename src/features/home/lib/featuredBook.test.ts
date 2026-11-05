import { describe, expect, it } from "vitest";
import type { BookMeta } from "@/lib/types";
import { featuredBook } from "./featuredBook";

const books = [{ slug: "a", cover: {} }, { slug: "b", cover: {} }] as BookMeta[];
describe("daily reading pick", () => {
  it("is stable during a day and rotates the next day", () => {
    expect(featuredBook(books, {}, new Date(2026, 10, 5, 9))).toBe(featuredBook(books, {}, new Date(2026, 10, 5, 20)));
    expect(featuredBook(books, {}, new Date(2026, 10, 5))?.slug).not.toBe(featuredBook(books, {}, new Date(2026, 10, 6))?.slug);
  });
  it("excludes finished books and hides when everything is finished", () => {
    expect(featuredBook(books, { "book:a": "read" }, new Date(2026, 10, 5))?.slug).toBe("b");
    expect(featuredBook(books, { "book:a": "read", "book:b": "read" }, new Date(2026, 10, 5))).toBeUndefined();
  });
  it("never competes with continue reading, including older unfinished books", () => {
    expect(featuredBook(books, {}, new Date(), (slug) => slug === "a" ? { block: 2, updatedAt: 1 } : null)?.slug).toBe("b");
    expect(featuredBook(books, {}, new Date(), () => ({ block: 2, updatedAt: 1 }))).toBeUndefined();
  });
  it("does not suggest completed progress even after explicitly marking unread", () => {
    expect(featuredBook(books, { "book:a": "unread", "book:b": "read" }, new Date(), (slug) => slug === "a" ? { block: 999, updatedAt: 1 } : null)).toBeUndefined();
  });
  it("handles an empty shelf", () => expect(featuredBook([], {}, new Date())).toBeUndefined());
});
