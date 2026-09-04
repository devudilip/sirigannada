import { isWin, scoreGuess } from "./wordGameScore";

describe("scoreGuess", () => {
  it("marks every akshara correct when the guess matches exactly", () => {
    expect(scoreGuess(["ಕ", "ನ್ನ", "ಡ"], ["ಕ", "ನ್ನ", "ಡ"])).toEqual(["correct", "correct", "correct"]);
  });

  it("marks a wrong akshara that appears elsewhere in the target as present", () => {
    expect(scoreGuess(["ಡ", "ಕ", "ನ್ನ"], ["ಕ", "ನ್ನ", "ಡ"])).toEqual(["present", "present", "present"]);
  });

  it("marks an akshara that is not in the target at all as absent", () => {
    expect(scoreGuess(["ಪ", "ಕ", "ನ್ನ"], ["ಕ", "ನ್ನ", "ಡ"])).toEqual(["absent", "present", "present"]);
  });

  it("does not double-count a duplicate guess akshara beyond how many times it appears in the target", () => {
    // target has exactly one "ಕ"; guessing "ಕ" twice should mark only one as present/correct.
    const target = ["ಕ", "ನ್ನ", "ಡ", "ವ", "ಿ"];
    const guess = ["ಕ", "ಕ", "ಡ", "ವ", "ಿ"];
    expect(scoreGuess(guess, target)).toEqual(["correct", "absent", "correct", "correct", "correct"]);
  });

  it("prefers marking the correct-position match over a present match for the same duplicate letter", () => {
    // target has "ಕ" once, at position 1. Guess has "ಕ" at position 0 (wrong) and position 1 (right).
    const target = ["ಡ", "ಕ", "ವ"];
    const guess = ["ಕ", "ಕ", "ವ"];
    // position 1 is an exact match and consumes the only "ಕ"; position 0 has nothing left to claim.
    expect(scoreGuess(guess, target)).toEqual(["absent", "correct", "correct"]);
  });

  it("handles a target with two of the same akshara and only one guessed correctly placed", () => {
    const target = ["ಅ", "ಕ", "ಕ", "ರ", "ದ"];
    const guess = ["ಕ", "ಕ", "ಅ", "ದ", "ರ"];
    // guess[1] "ಕ" matches target[1] exactly -> correct, consumes one "ಕ".
    // guess[0] "ಕ" -> the other "ಕ" remains in target -> present.
    // guess[2] "ಅ" -> present (target has "ಅ" elsewhere).
    // guess[3] "ದ" -> present (target has "ದ" elsewhere).
    // guess[4] "ರ" -> present (target has "ರ" elsewhere).
    expect(scoreGuess(guess, target)).toEqual(["present", "correct", "present", "present", "present"]);
  });

  it("returns all-absent for an empty overlap", () => {
    expect(scoreGuess(["ಅ", "ಆ"], ["ಇ", "ಈ"])).toEqual(["absent", "absent"]);
  });
});

describe("isWin", () => {
  it("is true only when every status is correct", () => {
    expect(isWin(["correct", "correct", "correct"])).toBe(true);
    expect(isWin(["correct", "present", "correct"])).toBe(false);
    expect(isWin(["absent"])).toBe(false);
  });
  it("is false for an empty status list", () => {
    expect(isWin([])).toBe(false);
  });
});
