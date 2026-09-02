import { describe, expect, it } from "vitest";
import { sortBooks } from "./shelfOrder";

describe("sortBooks", () => {
  it("pins Koti Chennayya, Sharif, then Jaimini, then the rest by era", () => {
    const slugs = sortBooks([
      { slug: "basavanna-vachanagalu", era: "12th century", title: "ಬಸವಣ್ಣನವರ ವಚನಗಳು" },
      { slug: "lakshmisha-jaimini-bharata", era: "17th century", title: "ಜೈಮಿನಿ ಭಾರತ" },
      { slug: "panje-koti-chennaya", era: "1924", title: "ಕೋಟಿ ಚೆನ್ನಯ" },
      { slug: "shishunala-sharifa-tatvapadagalu", era: "19th century", title: "ಶಿಶುನಾಳ ಶರೀಫರ ತತ್ವಪದಗಳು" },
    ]).map((b) => b.slug);
    expect(slugs).toEqual([
      "panje-koti-chennaya",
      "shishunala-sharifa-tatvapadagalu",
      "lakshmisha-jaimini-bharata",
      "basavanna-vachanagalu",
    ]);
  });
});
