import { describe, expect, it } from "vitest";
import type { Story } from "@/lib/types";
import { availableFilters, filterByQuery, filterStories, totalDuration } from "./filter";

const mk = (slug: string, durationSec: number, tags: Story["tags"], titleEn?: string): Story => ({
  slug, title: slug, titleEn, collection: { kn: "ಸ", en: "c" }, tags, durationSec, audio: `/data/stories/${slug}.mp3`, art: null,
  provenance: { source: "s", license: "CC-BY-4.0", licenseNote: "n", retrieved: "2026-09-15" },
});
const L = [mk("ಆಮೆ", 200, ["animal", "moral"], "Aame Mattu Mola"), mk("ಶಾಲೆ", 400, ["school"]), mk("ಮಳೆ", 100, [])];

describe("story filters", () => {
  it("filters by tag and by short duration", () => {
    expect(filterStories(L, "animal").map((s) => s.slug)).toEqual(["ಆಮೆ"]);
    expect(filterStories(L, "short").map((s) => s.slug)).toEqual(["ಆಮೆ", "ಮಳೆ"]);
    expect(filterStories(L, "all")).toHaveLength(3);
  });
  it("offers only filters that would show something", () => {
    expect(availableFilters(L)).toEqual(["all", "short", "animal", "moral", "school"]);
  });
  it("searches titles in both languages, case-insensitively", () => {
    expect(filterByQuery(L, "mola").map((s) => s.slug)).toEqual(["ಆಮೆ"]);
    expect(filterByQuery(L, "ಶಾ").map((s) => s.slug)).toEqual(["ಶಾಲೆ"]);
    expect(filterByQuery(L, "  ")).toHaveLength(3);
  });
  it("sums durations", () => {
    expect(totalDuration(L)).toBe(700);
  });
});
