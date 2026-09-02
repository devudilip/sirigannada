import { nudiToUnicode, unicodeToNudi } from "./convert";

/** Public Nudi 01-e / Baraha glyph sequences and their Unicode. */
const ROUND_TRIP: ReadonlyArray<readonly [ascii: string, uni: string]> = [
  ["C", "ಅ"],
  ["D", "ಆ"],
  ["E", "ಇ"],
  ["F", "ಈ"],
  ["G", "ಉ"],
  ["H", "ಊ"],
  ["IÄ", "ಋ"],
  ["J", "ಎ"],
  ["K", "ಏ"],
  ["L", "ಐ"],
  ["M", "ಒ"],
  ["N", "ಓ"],
  ["O", "ಔ"],
  ["PÀ", "ಕ"],
  ["PÁ", "ಕಾ"],
  ["Q", "ಕಿ"],
  ["QÃ", "ಕೀ"],
  ["PÀÄ", "ಕು"],
  ["PÀÆ", "ಕೂ"],
  ["PÉ", "ಕೆ"],
  ["PÉÃ", "ಕೇ"],
  ["PÉÊ", "ಕೈ"],
  ["PÉÆ", "ಕೊ"],
  ["PÉÆÃ", "ಕೋ"],
  ["PË", "ಕೌ"],
  ["Pï", "ಕ್"],
  ["R", "ಖ"],
  ["UÀ", "ಗ"],
  ["ZÀ", "ಚ"],
  ["qÀ", "ಡ"],
  ["£À", "ನ"],
  ["ªÀ", "ಭ"],
  ["ªÀi", "ಮ"],
  ["ªÀiÁ", "ಮಾ"],
  ["gÀ", "ರ"],
  ["®", "ಲ"],
  ["¸À", "ಸ"],
  ["A", "ಂ"],
  ["B", "ಃ"],
  ["PÀ£ÀßqÀ", "ಕನ್ನಡ"],
  ["PÀð", "ರ್ಕ"],
  ["gÀå", "ರ್ಯ"],
  ["0", "೦"],
  ["5", "೫"],
];

describe("Nudi/Baraha ASCII ↔ Unicode", () => {
  it("has at least 20 round-trip fixtures", () => {
    expect(ROUND_TRIP.length).toBeGreaterThanOrEqual(20);
  });

  it.each(ROUND_TRIP)("round-trips %s ↔ %s", (ascii, uni) => {
    expect(nudiToUnicode(ascii)).toBe(uni);
    expect(unicodeToNudi(uni)).toBe(ascii);
    expect(unicodeToNudi(nudiToUnicode(ascii))).toBe(ascii);
    expect(nudiToUnicode(unicodeToNudi(uni))).toBe(uni);
  });

  it("preserves whitespace and punctuation", () => {
    expect(nudiToUnicode("PÀ, UÀ!")).toBe("ಕ, ಗ!");
    expect(unicodeToNudi("ಕ, ಗ!")).toBe("PÀ, UÀ!");
  });

  it("leaves English inside $...$ untouched (Baraha convention)", () => {
    expect(nudiToUnicode("C $OK$ PÀ")).toBe("ಅ OK ಕ");
  });

  it("passes through Unicode already in the ASCII stream", () => {
    expect(nudiToUnicode("ಕ")).toBe("ಕ");
  });

  it("lengthens e-matra after a vattu (broken Ã)", () => {
    expect(nudiToUnicode("PÉßÃ")).toBe("ಕ್ನೇ");
  });
});
