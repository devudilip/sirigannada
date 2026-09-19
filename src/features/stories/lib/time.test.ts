import { describe, expect, it } from "vitest";
import { clamp, formatClock, formatTotal } from "./time";

describe("time", () => {
  it("formats m:ss and time left with a minus", () => {
    expect(formatClock(0)).toBe("0:00");
    expect(formatClock(328)).toBe("5:28");
    expect(formatClock(-252)).toBe("−4:12");
    expect(formatClock(59.6)).toBe("1:00");
  });
  it("formats shelf totals in both locales", () => {
    expect(formatTotal(11400, "en")).toBe("3 h 10 min");
    expect(formatTotal(540, "en")).toBe("9 min");
    expect(formatTotal(11400, "kn")).toBe("3 ಗಂ 10 ನಿಮಿಷ");
  });
  it("clamps", () => {
    expect(clamp(5, 0, 3)).toBe(3);
    expect(clamp(-1, 0, 3)).toBe(0);
  });
});
