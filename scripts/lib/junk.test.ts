import { describe, expect, it } from "vitest";
import { findBlockJunk, junkErrorsForBlocks } from "./junk";

describe("findBlockJunk — clean (negative) fixtures", () => {
  it("accepts Kannada verse with danda, digits, quotes, and a real question", () => {
    expect(findBlockJunk("ಸಾಲು । ಸಾಲು ॥೧॥\nಲಿಂಗದ ಗುಡಿಯೆಲ್ಲಿ ?")).toEqual([]);
  });

  it("accepts parentheses that are not uncertainty notes", () => {
    expect(findBlockJunk("ಪದ್ಯ (೧)\nಹರಿ (ಮಾವ) ಬಂದನು")).toEqual([]);
  });

  it("does not treat a URL-like string as a block we would scan from provenance", () => {
    // Callers must not pass provenance.source; if they did, Latin would correctly fail.
    expect(findBlockJunk("https://kn.wikisource.org/wiki/ಅ")).not.toEqual([]);
  });
});

describe("findBlockJunk — junk (positive) fixtures", () => {
  it("flags Latin letters leftover from English notes or IAST", () => {
    expect(findBlockJunk("delete this tripdadi")).toEqual([
      expect.stringContaining('Latin letters "delete, this, tripdadi"'),
    ]);
    expect(findBlockJunk("ಸುರಾಭಾಂಡಮಿವಾ[s] ಶುಚಿಃ")).toEqual([
      expect.stringContaining('Latin letters "s"'),
    ]);
  });

  it("flags wiki/markdown marks = < * _", () => {
    expect(findBlockJunk("ಶೀರ್ಷಿಕೆ = ಮೌಲ್ಯ")).toEqual([expect.stringContaining('"="')]);
    expect(findBlockJunk("ಅ<br>ಆ")).toEqual(
      expect.arrayContaining([expect.stringContaining("Latin"), expect.stringContaining('"<"')]),
    );
    expect(findBlockJunk("ಅ * ಆ")).toEqual([expect.stringContaining('"*"')]);
    expect(findBlockJunk("ಅ_ಆ")).toEqual([expect.stringContaining('"_"')]);
  });

  it("flags (…?) uncertainty notes, including Kannada editor guesses", () => {
    expect(findBlockJunk("ಹೊಂದಿಕೆ (variant?)")).toEqual(
      expect.arrayContaining([
        expect.stringContaining("Latin"),
        expect.stringContaining('uncertainty note "(variant?)"'),
      ]),
    );
    expect(findBlockJunk("ಹೊಂದಿಕೆ (ಹೊದಿಕೆ?)")).toEqual([
      expect.stringContaining('uncertainty note "(ಹೊದಿಕೆ?)"'),
    ]);
  });
});

describe("junkErrorsForBlocks", () => {
  it("names the chapter file and 0-based block index", () => {
    const errors = junkErrorsForBlocks("02-lingaatishaya.txt", [
      "ಸ್ವಚ್ಛ ಸಾಲು",
      "ಇಲ್ಲಿ delete ಉಳಿದಿದೆ",
    ]);
    expect(errors).toEqual([
      '02-lingaatishaya.txt block 1: contains Latin letters "delete"',
    ]);
  });
});
