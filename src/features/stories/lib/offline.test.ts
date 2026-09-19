import { describe, expect, it } from "vitest";
import type { Story } from "@/lib/types";
import { pageAssetUrls, storyCacheUrls, storyPageUrls } from "./offline";

const story: Story = {
  slug: "s",
  title: "s",
  collection: { kn: "ಸ", en: "c" },
  tags: [],
  durationSec: 10,
  audio: "/data/stories/s/audio.mp3",
  art: "/data/stories/s/art.svg",
  sentences: ["a"],
  provenance: { source: "x", license: "CC-BY-4.0", licenseNote: "n", retrieved: "2026-09-09" },
};

describe("offline urls", () => {
  it("lists audio and art, and both pages when there is text", () => {
    expect(storyCacheUrls(story)).toEqual(["/data/stories/s/audio.mp3", "/data/stories/s/art.svg"]);
    expect(storyPageUrls(story)).toEqual(["/stories/s", "/stories/s/read"]);
    expect(storyPageUrls({ ...story, sentences: undefined })).toEqual(["/stories/s"]);
  });
  it("extracts the page's static scripts and styles once each", () => {
    const html = `<link rel="stylesheet" href="/_next/static/chunks/a.css"><script src="/_next/static/chunks/b.js"></script><script src="/_next/static/chunks/b.js"></script><img src="/icons/x.png">`;
    expect(pageAssetUrls(html)).toEqual(["/_next/static/chunks/a.css", "/_next/static/chunks/b.js"]);
  });
});
