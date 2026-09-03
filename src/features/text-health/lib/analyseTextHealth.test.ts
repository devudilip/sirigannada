import { describe, expect, it } from "vitest";
import { applyFinding } from "./applyFinding";
import { analyseTextHealth } from "./analyseTextHealth";

function finding(text: string, key: string) {
  const result = analyseTextHealth(text).findings.find((item) => item.explanationKey === key);
  expect(result).toBeDefined();
  return result!;
}

describe("analyseTextHealth", () => {
  it("offers NFC normalization without mutating the input", () => {
    const input = "ಕೊ".normalize("NFD");
    const issue = finding(input, "nonNfc");
    expect(input).not.toBe("ಕೊ");
    expect(issue.replacement).toBe("ಕೊ");
    expect(applyFinding(input, issue)).toBe("ಕೊ");
  });

  it("detects Nudi-like text and Latin leaked into Kannada", () => {
    expect(finding("PÀ£ÀßqÀ", "legacyNudi").category).toBe("legacy");
    const issue = finding("ಮತ್ತs ನಾಗಿ", "latinMatraLeak");
    expect(issue.replacement).toBeUndefined();
    expect(applyFinding("ಮತ್ತs ನಾಗಿ", issue)).toBe("ಮತ್ತs ನಾಗಿ");
    expect(finding("ಕxyz", "mixedLatin").replacement).toBeUndefined();
  });

  it("does not flag separate English words in otherwise Kannada text", () => {
    expect(analyseTextHealth("ಕನ್ನಡ text ಚೆನ್ನಾಗಿದೆ").findings).toHaveLength(0);
  });

  it.each(["\u200B", "\u200C", "\u200D", "\u2060", "\uFEFF"])(
    "reports invisible character %s with its exact location",
    (invisible) => {
      const issue = finding(`ಮೊದಲ ಸಾಲು\nಕ${invisible}ನ್ನಡ`, "invisibleCharacter");
      expect(issue.location).toMatchObject({ line: 2, column: 2 });
      expect(issue.explanationData?.character).toMatch(/^U\+/);
      expect(issue.replacement).toBeUndefined();
    },
  );

  it("reports whitespace and punctuation without changing intentional formatting", () => {
    const input = "ಕನ್ನಡ   ಪಠ್ಯ!!!!\n\n\nಮುಂದೆ";
    const report = analyseTextHealth(input);
    expect(report.findings.map((item) => item.explanationKey)).toEqual([
      "repeatedWhitespace", "repeatedPunctuation", "extraBlankLines",
    ]);
    expect(report.findings.every((item) => item.replacement === undefined)).toBe(true);
  });

  it("finds common encoding-damage markers without guessing a repair", () => {
    const issue = finding("ಪಠ್ಯ � â€™", "encodingMarker");
    expect(issue.category).toBe("encoding");
    expect(issue.replacement).toBeUndefined();
  });

  it.each([
    ["ಲಿಂಗಸಂಬಂದ್ಥಿ", "legacyConversionDamage"],
    ["ಬ್ಥಿತ್ತಿ", "legacyConversionDamage"],
    ["ಕಾಷ*ದಲ್ಲಿ", "legacyConversionDamage"],
    ["ಸ್ಧಾನ", "legacyConversionDamage"],
    ["ಮತಿುಲ್ಲದ", "legacyConversionDamage"],
    ["ತಾ—\nನಾಗಿ", "brokenLineWrap"],
  ])("reports known pipeline symptom %s without guessing a repair", (input, key) => {
    const issue = analyseTextHealth(input).findings.find((item) => item.explanationKey === key);
    expect(issue).toBeDefined();
    expect(issue?.replacement).toBeUndefined();
    expect(applyFinding(input, issue!)).toBe(input);
  });

  it("refuses to apply a stale or diagnostic-only finding", () => {
    const repair = finding("ಕೊ".normalize("NFD"), "nonNfc");
    expect(applyFinding("ಬೇರೆ", repair)).toBe("ಬೇರೆ");
    const diagnostic = finding("ಕx", "mixedLatin");
    expect(applyFinding("ಕx", diagnostic)).toBe("ಕx");
  });

  it("does not mistake a single maths or currency symbol for legacy Kannada", () => {
    expect(analyseTextHealth("10÷2 ಮತ್ತು ಬೆಲೆ £10").findings).toHaveLength(0);
  });

  it("caps pathological reports for budget-phone safety", () => {
    const report = analyseTextHealth("ಕa".repeat(100_001));
    expect(report.findings).toHaveLength(200);
    expect(report.truncated).toBe(true);
  });
});
