import { describe, expect, it } from "vitest";
import type { Story } from "@/lib/types";
import { nextStory, playable, prevStory, queueIndex } from "./queue";

const story = (slug: string, audio: string | null = `/data/stories/${slug}.mp3`, license: Story["provenance"]["license"] = "CC-BY-4.0"): Story => ({
  slug,
  title: slug,
  collection: { kn: "ಸ", en: "c" },
  tags: [],
  durationSec: 60,
  audio,
  art: null,
  provenance: { source: "s", license, licenseNote: "n", retrieved: "2026-09-09" },
});
const Q = [story("a"), story("b"), story("c")];

describe("queue", () => {
  it("walks forward and back, null at the ends", () => {
    expect(nextStory(Q, Q[0]!)?.slug).toBe("b");
    expect(nextStory(Q, Q[2]!)).toBeNull();
    expect(prevStory(Q, Q[1]!)?.slug).toBe("a");
    expect(prevStory(Q, Q[0]!)).toBeNull();
  });
  it("starts from the first story when nothing is loaded", () => {
    expect(nextStory(Q, null)?.slug).toBe("a");
    expect(prevStory(Q, null)).toBeNull();
    expect(queueIndex(Q, null)).toBe(0);
    expect(queueIndex(Q, Q[1]!)).toBe(2);
  });
  it("treats a story outside the queue as unknown", () => {
    expect(nextStory(Q, story("zz"))).toBeNull();
    expect(queueIndex(Q, story("zz"))).toBe(0);
  });
  it("stories with audio are playable; the build keeps audio off pending ones", () => {
    const list = [story("ok"), story("no-audio", null), story("pending", null, "pending-permission")];
    expect(playable(list).map((s) => s.slug)).toEqual(["ok"]);
  });
});
