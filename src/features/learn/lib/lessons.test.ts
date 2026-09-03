import { describe, expect, it } from "vitest";
import { LESSONS } from "./lessons";

describe("LESSONS", () => {
  it("points at the alphabet chart", () => {
    expect(LESSONS.map((lesson) => lesson.href)).toContain("/learn/alphabet");
  });
});
