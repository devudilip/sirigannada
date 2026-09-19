import { keyStatuses } from "./keyStatuses";

describe("keyStatuses", () => {
  it("returns an empty map with no guesses", () => {
    expect(keyStatuses([], "ಕನ್ನಡ")).toEqual({});
  });

  it("marks whole aksharas by their scored status", () => {
    // target ಕ ನ್ನ ಡ; guess ಡ ಕ ನ್ನ → all present
    expect(keyStatuses(["ಡಕನ್ನ"], "ಕನ್ನಡ")).toMatchObject({ "ಡ": "present", "ಕ": "present", "ನ್ನ": "present" });
  });

  it("also keys by the leading consonant so single keys tint", () => {
    // target ಹೂವು: ಹೂ ವು; guess ಹೂಗ → ಹೂ correct, ಗ absent
    const map = keyStatuses(["ಹೂಗ"], "ಹೂವು");
    expect(map["ಹೂ"]).toBe("correct");
    expect(map["ಹ"]).toBe("correct");
    expect(map["ಗ"]).toBe("absent");
  });

  it("never downgrades: correct beats present beats absent across guesses", () => {
    const map = keyStatuses(["ಡಕನ್ನ", "ಕನ್ನಡ"], "ಕನ್ನಡ");
    expect(map["ಕ"]).toBe("correct");
    expect(map["ಡ"]).toBe("correct");
    const again = keyStatuses(["ಕನ್ನಡ", "ಡಕನ್ನ"], "ಕನ್ನಡ");
    expect(again["ಕ"]).toBe("correct");
  });
});
