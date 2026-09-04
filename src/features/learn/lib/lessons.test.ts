import { describe, expect, it } from "vitest";
import { LESSONS } from "./lessons";

describe("LESSONS", () => {
  it("points at the alphabet chart", () => {
    expect(LESSONS.map((lesson) => lesson.href)).toContain("/learn/alphabet");
  });

  it("includes every published practice destination", () => {
    expect(LESSONS.map((lesson) => lesson.href)).toEqual(expect.arrayContaining(["/learn/practice", "/learn/padabandha"]));
  });
});
