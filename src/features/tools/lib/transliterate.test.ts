import { isoToKannada, kannadaToIso } from "./transliterate";

const CASES = [
  ["ಕ", "ka"],
  ["ಕಾ", "kā"],
  ["ಕಿ", "ki"],
  ["ಕೀ", "kī"],
  ["ಕು", "ku"],
  ["ಕೂ", "kū"],
  ["ಕೆ", "ke"],
  ["ಕೇ", "kē"],
  ["ಕೊ", "ko"],
  ["ಕೋ", "kō"],
  ["ಕ್ಷ", "kṣa"],
  ["ಮನೆ", "mane"],
  ["ಕನ್ನಡ", "kannaḍa"],
  ["ಶ್ರೀ", "śrī"],
  ["ಹಣ್ಣು", "haṇṇu"],
  ["ಋಷಿ", "r̥ṣi"],
  ["ಅಂಶ", "aṁśa"],
] as const;

describe("ISO 15919 transliteration", () => {
  it.each(CASES)("transliterates %s as %s", (kannada, iso) => {
    expect(kannadaToIso(kannada)).toBe(iso);
    expect(isoToKannada(iso)).toBe(kannada);
  });

  it("preserves whitespace and punctuation", () => {
    const kannada = "ಮನೆ, ಕನ್ನಡ!";
    const iso = "mane, kannaḍa!";
    expect(kannadaToIso(kannada)).toBe(iso);
    expect(isoToKannada(iso)).toBe(kannada);
  });

  it("represents a bare consonant with virama", () => {
    expect(kannadaToIso("ಕ್")).toBe("k");
    expect(isoToKannada("k")).toBe("ಕ್");
  });
});
