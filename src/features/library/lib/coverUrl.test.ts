import { describe, expect, it } from "vitest";
import type { BookMeta } from "@/lib/types";
import { coverAlt, coverUrl } from "./coverUrl";

const book = {
  slug: "basavanna-vachanagalu",
  cover: {
    file: "basavanna-vachanagalu.webp",
    alt: { kn: "ಬಸವಣ್ಣನವರ ಪ್ರತಿಮೆ", en: "Statue of Basavanna" },
    provenance: {
      source: "https://commons.wikimedia.org/wiki/File:X.jpg",
      license: "CC-BY-SA-3.0",
      licenseNote: "Photograph by A. Photographer; cropped and tinted.",
      author: "A. Photographer",
      retrieved: "2026-09-19",
    },
  },
} as unknown as BookMeta;

describe("coverUrl", () => {
  it("serves covers under /data/ so the service worker caches them", () => {
    expect(coverUrl("basavanna-vachanagalu.webp")).toBe("/data/covers/basavanna-vachanagalu.webp");
  });
});

describe("coverAlt", () => {
  it("describes the photograph in the reader's language", () => {
    expect(coverAlt(book, "kn")).toBe("ಬಸವಣ್ಣನವರ ಪ್ರತಿಮೆ");
    expect(coverAlt(book, "en")).toBe("Statue of Basavanna");
  });

  it("is empty for a book with no photograph", () => {
    expect(coverAlt({ ...book, cover: undefined }, "kn")).toBe("");
  });
});
