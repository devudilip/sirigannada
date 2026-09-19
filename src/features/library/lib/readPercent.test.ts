import { describe, expect, it } from "vitest";
import { localiseDigits, readPercent } from "./readPercent";

describe("readPercent", () => {
  it("rounds block / blockCount to a whole percent", () => {
    expect(readPercent(34, 132)).toBe(26);
    expect(readPercent(0, 132)).toBe(0);
    expect(readPercent(132, 132)).toBe(100);
  });

  it("clamps and guards against bad input", () => {
    expect(readPercent(200, 100)).toBe(100);
    expect(readPercent(-5, 100)).toBe(0);
    expect(readPercent(5, 0)).toBe(0);
    expect(readPercent(Number.NaN, 10)).toBe(0);
  });
});

describe("localiseDigits", () => {
  it("uses Kannada digits for the Kannada UI and Arabic digits for English", () => {
    expect(localiseDigits(26, "kn")).toBe("೨೬");
    expect(localiseDigits(26, "en")).toBe("26");
  });
});
