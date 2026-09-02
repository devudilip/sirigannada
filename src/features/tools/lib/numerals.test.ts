import {
  arabicToKannadaDigits,
  kannadaToArabicDigits,
  numberToKannadaWords,
  parseNonNegativeInteger,
} from "./numerals";

describe("digit conversion", () => {
  it("maps Arabic 0–9 to Kannada ೦–೯", () => {
    expect(arabicToKannadaDigits("0123456789")).toBe("೦೧೨೩೪೫೬೭೮೯");
  });

  it("maps Kannada digits back to Arabic", () => {
    expect(kannadaToArabicDigits("೦೧೨೩೪೫೬೭೮೯")).toBe("0123456789");
  });

  it("converts digits inside mixed strings and round-trips", () => {
    expect(arabicToKannadaDigits("ಪುಟ 1200")).toBe("ಪುಟ ೧೨೦೦");
    expect(kannadaToArabicDigits("ಪುಟ ೧೨೦೦")).toBe("ಪುಟ 1200");
    const mixed = "id-42 / ೭";
    expect(kannadaToArabicDigits(arabicToKannadaDigits(mixed))).toBe("id-42 / 7");
  });
});

describe("numberToKannadaWords", () => {
  it("covers the L-04 fixtures through 10^9", () => {
    expect(numberToKannadaWords(0)).toBe("ಸೊನ್ನೆ");
    expect(numberToKannadaWords(1)).toBe("ಒಂದು");
    expect(numberToKannadaWords(10)).toBe("ಹತ್ತು");
    expect(numberToKannadaWords(11)).toBe("ಹನ್ನೊಂದು");
    expect(numberToKannadaWords(21)).toBe("ಇಪ್ಪತ್ತೊಂದು");
    expect(numberToKannadaWords(100)).toBe("ನೂರು");
    expect(numberToKannadaWords(101)).toBe("ನೂರು ಒಂದು");
    expect(numberToKannadaWords(1000)).toBe("ಒಂದು ಸಾವಿರ");
    expect(numberToKannadaWords(1200)).toBe("ಒಂದು ಸಾವಿರ ಇನ್ನೂರು");
    expect(numberToKannadaWords(100000)).toBe("ಒಂದು ಲಕ್ಷ");
    expect(numberToKannadaWords(10000000)).toBe("ಒಂದು ಕೋಟಿ");
    expect(numberToKannadaWords(1_000_000_000)).toBe("ನೂರು ಕೋಟಿ");
  });

  it("applies tens sandhi and named hundreds", () => {
    expect(numberToKannadaWords(25)).toBe("ಇಪ್ಪತ್ತೈದು");
    expect(numberToKannadaWords(26)).toBe("ಇಪ್ಪತ್ತಾರು");
    expect(numberToKannadaWords(200)).toBe("ಇನ್ನೂರು");
  });

  it("rejects values outside 0…10^9", () => {
    expect(() => numberToKannadaWords(-1)).toThrow(RangeError);
    expect(() => numberToKannadaWords(1_000_000_001)).toThrow(RangeError);
    expect(() => numberToKannadaWords(1.5)).toThrow(RangeError);
  });
});

describe("parseNonNegativeInteger", () => {
  it("accepts Arabic, Kannada, and grouped digit strings", () => {
    expect(parseNonNegativeInteger("೧೨೦೦")).toBe(1200);
    expect(parseNonNegativeInteger("1,00,000")).toBe(100000);
    expect(parseNonNegativeInteger("1_000_000_000")).toBe(1_000_000_000);
    expect(parseNonNegativeInteger("")).toBeNull();
    expect(parseNonNegativeInteger("1e9")).toBeNull();
  });
});
