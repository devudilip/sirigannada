import { describe, expect, it } from "vitest";
import { storyUrl } from "./storyUrl";
import { sectionUrl } from "./sections";

describe("story and section URLs", () => {
  it("keeps children's sections under /children and shelves the adults' section in the library", () => {
    expect(sectionUrl("panchatantra")).toBe("/children/panchatantra");
    expect(storyUrl({ collection: "panchatantra", slug: "chatura-mola" })).toBe("/children/panchatantra/chatura-mola");
    expect(sectionUrl("doddavara-kathegalu")).toBe("/library/doddavara-kathegalu");
    expect(storyUrl({ collection: "doddavara-kathegalu", slug: "x" })).toBe("/library/doddavara-kathegalu/x");
  });
});
