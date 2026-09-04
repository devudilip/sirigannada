import { dailyPoolIndex, dateKey, daysSinceEpoch } from "./wordGameDay";

describe("daysSinceEpoch", () => {
  it("is 0 on the epoch date", () => {
    expect(daysSinceEpoch(new Date(2024, 0, 1))).toBe(0);
  });
  it("counts forward by whole local days", () => {
    expect(daysSinceEpoch(new Date(2024, 0, 2))).toBe(1);
    expect(daysSinceEpoch(new Date(2024, 0, 31))).toBe(30);
    expect(daysSinceEpoch(new Date(2025, 0, 1))).toBe(366); // 2024 is a leap year
  });
  it("counts backward for dates before the epoch", () => {
    expect(daysSinceEpoch(new Date(2023, 11, 31))).toBe(-1);
  });
  it("ignores the time of day", () => {
    expect(daysSinceEpoch(new Date(2024, 0, 2, 23, 59, 59))).toBe(1);
    expect(daysSinceEpoch(new Date(2024, 0, 2, 0, 0, 1))).toBe(1);
  });
});

describe("dailyPoolIndex", () => {
  it("is deterministic for a given date and pool length", () => {
    const a = dailyPoolIndex(new Date(2026, 8, 4), 220);
    const b = dailyPoolIndex(new Date(2026, 8, 4), 220);
    expect(a).toBe(b);
  });
  it("is the same for everyone on the same calendar day regardless of time", () => {
    const morning = dailyPoolIndex(new Date(2026, 8, 4, 6, 0), 220);
    const night = dailyPoolIndex(new Date(2026, 8, 4, 23, 30), 220);
    expect(morning).toBe(night);
  });
  it("stays within [0, poolLength)", () => {
    for (let d = 0; d < 400; d++) {
      const date = new Date(2024, 0, 1 + d);
      const idx = dailyPoolIndex(date, 37);
      expect(idx).toBeGreaterThanOrEqual(0);
      expect(idx).toBeLessThan(37);
    }
  });
  it("advances by one each consecutive day until it wraps", () => {
    const i0 = dailyPoolIndex(new Date(2024, 0, 1), 10);
    const i1 = dailyPoolIndex(new Date(2024, 0, 2), 10);
    expect(i1).toBe((i0 + 1) % 10);
  });
  it("returns 0 for a non-positive pool length instead of dividing by zero", () => {
    expect(dailyPoolIndex(new Date(2024, 0, 1), 0)).toBe(0);
  });
});

describe("dateKey", () => {
  it("formats YYYY-MM-DD with zero-padding", () => {
    expect(dateKey(new Date(2026, 8, 4))).toBe("2026-09-04");
    expect(dateKey(new Date(2026, 0, 1))).toBe("2026-01-01");
  });
});
