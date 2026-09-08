import { formatGamesDate, formatShortDate } from "./gamesDate";

const monday = new Date(2025, 8, 8); // 8 September 2025, local time

describe("formatGamesDate", () => {
  it("spells out weekday, day and month in English for the en locale", () => {
    const text = formatGamesDate(monday, "en");
    expect(text).toContain("Monday");
    expect(text).toContain("8");
    expect(text).toContain("September");
  });

  it("returns a non-empty localised string for the kn locale", () => {
    const text = formatGamesDate(monday, "kn");
    expect(text.length).toBeGreaterThan(0);
    expect(text).not.toContain("September");
  });
});

describe("formatShortDate", () => {
  it("abbreviates the month in English", () => {
    expect(formatShortDate(monday, "en")).toMatch(/8 Sep/);
  });
});
