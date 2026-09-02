import { describe, expect, it } from "vitest";
import type { BookMeta } from "@/lib/types";
import type { Progress } from "@/features/reader/types";
import { pickLastReading } from "./lastReading";

const book = (slug: string): BookMeta => ({
  slug,
  title: slug,
  author: "ಅ",
  era: "12th century",
  form: "vachana",
  description: "x",
  chapterCount: 1,
  blockCount: 1,
  provenance: {
    source: "https://example.com",
    license: "public-domain",
    licenseNote: "test",
    authorDied: 1196,
    retrieved: "2026-09-02",
  },
});

describe("pickLastReading", () => {
  it("returns null when nothing is saved", () => {
    expect(pickLastReading([book("a"), book("b")], () => null)).toBeNull();
  });

  it("picks the newest updatedAt and ignores books with no progress", () => {
    const progress: Record<string, Progress | null> = {
      a: { block: 3, page: 2, updatedAt: 100 },
      b: { block: 1, page: 9, updatedAt: 200 },
    };
    const last = pickLastReading([book("a"), book("b"), book("c")], (slug) => progress[slug] ?? null);
    expect(last?.book.slug).toBe("b");
    expect(last?.progress.page).toBe(9);
  });
});
