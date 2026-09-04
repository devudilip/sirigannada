import { describe, expect, it } from "vitest";
import { cleanKannadaGuess } from "./aksharas";

describe("cleanKannadaGuess", () => {
  it("drops whitespace, punctuation, and other scripts", () => {
    expect(cleanKannadaGuess(" ಕನ್ನಡ! test ೧ ")).toBe("ಕನ್ನಡ೧");
  });
});
