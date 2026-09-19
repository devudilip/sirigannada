import { describe, expect, it } from "vitest";
import type { Story } from "@/lib/types";
import { saveAll } from "./saveAll";

function story(slug: string): Story {
  return {
    slug,
    title: slug,
    collection: { kn: "ಪರೀಕ್ಷೆ", en: "Test" },
    tags: [],
    durationSec: 60,
    audio: `/data/stories/${slug}.mp3`,
    art: null,
    provenance: { source: "test", license: "CC0-1.0", licenseNote: "", retrieved: "2026-01-01" },
  };
}

describe("saveAll", () => {
  it("saves in order, reports progress after each, and returns no failures when all succeed", async () => {
    const order: string[] = [];
    const progress: Array<[number, number]> = [];
    const failed = await saveAll(
      [story("a"), story("b"), story("c")],
      async (s) => {
        order.push(s.slug);
        return true;
      },
      (done, total) => progress.push([done, total]),
    );
    expect(order).toEqual(["a", "b", "c"]);
    expect(progress).toEqual([
      [0, 3],
      [1, 3],
      [2, 3],
      [3, 3],
    ]);
    expect(failed).toEqual([]);
  });

  it("runs sequentially: the next save starts only after the previous resolves", async () => {
    let inFlight = 0;
    let maxInFlight = 0;
    await saveAll([story("a"), story("b")], async () => {
      inFlight += 1;
      maxInFlight = Math.max(maxInFlight, inFlight);
      await Promise.resolve();
      inFlight -= 1;
      return true;
    });
    expect(maxInFlight).toBe(1);
  });

  it("collects failed and throwing saves but keeps going", async () => {
    const failed = await saveAll([story("a"), story("b"), story("c")], async (s) => {
      if (s.slug === "a") return false;
      if (s.slug === "b") throw new Error("network");
      return true;
    });
    expect(failed).toEqual(["a", "b"]);
  });

  it("handles an empty list", async () => {
    const progress: Array<[number, number]> = [];
    const failed = await saveAll([], async () => true, (d, t) => progress.push([d, t]));
    expect(failed).toEqual([]);
    expect(progress).toEqual([[0, 0]]);
  });
});
