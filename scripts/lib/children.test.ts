import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { sha256, validateCollection, validateReview, validateStory } from "./children";
import { storyboardDimensions } from "./storyboard";

const fixture = () => JSON.parse(readFileSync("data/children-src/panchatantra/chatura-mola/story.json", "utf8"));

describe("children publication gate", () => {
  it("checks real storyboard dimensions and rejects damaged files", () => {
    const image = readFileSync("public/stories/panchatantra/chatura-mola/storyboard.webp");
    expect(storyboardDimensions(image)).toEqual({ width: 1024, height: 1536 });
    expect(storyboardDimensions(image.subarray(0, 20))).toBeUndefined();
    expect(storyboardDimensions(Buffer.from("not an image"))).toBeUndefined();
  });
  it("accepts the real story and refuses restricted source licences", () => {
    const story = fixture();
    expect(validateStory(story)).toEqual([]);
    story.provenance.license = "CC-BY-NC-4.0";
    expect(validateStory(story)).toContain("source licence not allowed");
  });
  it("refuses a placeholder illustration generator", () => {
    const story = fixture();
    story.illustrations.generator = "TO BE RECORDED: the tool actually used for the storyboard";
    expect(validateStory(story)).toContain("illustration generator still a placeholder");
  });
  it("rejects wrong panel order and AI-style dash punctuation", () => {
    const story = fixture();
    story.scenes[1].panel = 0;
    story.scenes[0].paragraphs[0] += " ಮೊಲ—ಎಲ್ಲವೂ";
    expect(validateStory(story)).toContain("scene 2 panel must match reading order");
    expect(validateStory(story)).toContain("story prose contains forbidden dash or markup");
  });
  it("accepts the three hub sections and pins the picture-book slugs the reader links back to", () => {
    const sections = JSON.parse(readFileSync("data/children-src/collections.json", "utf8"));
    expect(sections.map((c: { slug: string }) => c.slug)).toEqual(["panchatantra", "keli-odi", "picturebooks"]);
    for (const section of sections) expect(validateCollection(section)).toEqual([]);
    expect(validateCollection({ ...sections[1], slug: "audio" })).toEqual(["audio: narrated=true section must use slug keli-odi"]);
    expect(validateCollection({ ...sections[2], narrated: "no" })).toEqual(["picturebooks: picture-book section needs narrated true/false"]);
    expect(validateCollection({ ...sections[0], kind: "audio" })).toEqual(["panchatantra: kind must be stories or picturebooks"]);
    expect(validateCollection({ slug: "x", title: { kn: "ಕ" } })).toEqual(["invalid children collection"]);
  });
  it("requires actual evidence and invalidates approval when text or art changes", () => {
    const story = "reviewed text";
    const image = Buffer.from("reviewed image");
    const review = { status: "approved", reviewer: "test reviewer", date: "2026-09-20",
      storySha256: sha256(story), imageSha256: sha256(image),
      text: ["read all scenes"], illustrations: ["inspected all panels"], limitations: ["agent review"] };
    expect(validateReview(review, story, image)).toEqual([]);
    expect(validateReview(review, `${story}!`, image)).toContain("story changed since review");
    expect(validateReview(review, story, Buffer.from("other art"))).toContain("illustration changed since review");
    expect(validateReview({ ...review, status: "draft" }, story, image)).toContain("dated reviewer approval required");
    expect(validateReview({ ...review, text: [] }, story, image)).toContain("review evidence and limitations required");
  });
});
