import { describe, expect, it } from "vitest";
import { inflectionSuffix } from "./inflection";

describe("inflectionSuffix", () => {
  it("returns the stripped case suffix when the form starts with the stem", () => {
    expect(inflectionSuffix("ಮನೆಯಲ್ಲಿ", "ಮನೆ")).toBe("ಯಲ್ಲಿ");
    expect(inflectionSuffix("ಮನೆಗಳನ್ನು", "ಮನೆ")).toBe("ಗಳನ್ನು");
  });

  it("returns undefined for reconstructed verb roots that are not a literal prefix", () => {
    expect(inflectionSuffix("ಮಾಡಿದನು", "ಮಾಡು")).toBeUndefined();
    expect(inflectionSuffix("ಹೋದನು", "ಹೋಗು")).toBeUndefined();
  });

  it("returns undefined when the form equals the stem", () => {
    expect(inflectionSuffix("ಮನೆ", "ಮನೆ")).toBeUndefined();
  });
});
