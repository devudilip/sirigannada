import { coverFromSlug, coverKey, firstAkshara, hashSlug } from "./coverFromSlug";

const SHELF = [
  "akkamahadevi-vachanagalu",
  "allamaprabhu-vachanagalu",
  "chennabasavanna-vachanagalu",
  "basavanna-vachanagalu",
  "kumaravyasa-bharata-adiparva",
  "lakshmisha-jaimini-bharata",
  "purandaradasa-keertanegalu",
  "sarvajna-tripadigalu",
  "kanakadasa-haribhaktisara",
  "jagannathadasa-harikathamrutasara",
  "shishunala-sharifa-tatvapadagalu",
  "panje-koti-chennaya",
];

describe("hashSlug", () => {
  it("is stable and non-zero for a real slug", () => {
    expect(hashSlug("basavanna-vachanagalu")).toBe(hashSlug("basavanna-vachanagalu"));
    expect(hashSlug("basavanna-vachanagalu")).not.toBe(0);
  });
});

describe("coverFromSlug", () => {
  it("gives every current shelf slug a distinct variant", () => {
    const keys = SHELF.map((slug) => coverKey(coverFromSlug(slug)));
    expect(new Set(keys).size).toBe(SHELF.length);
  });

  it("stays on the accent / paper / ink schemes", () => {
    for (const slug of SHELF) {
      expect(["paper", "accent", "ink"]).toContain(coverFromSlug(slug).scheme);
    }
  });
});

describe("firstAkshara", () => {
  it("takes the first grapheme, including a vowel sign", () => {
    expect(firstAkshara("ಬಸವಣ್ಣನ ವಚನಗಳು")).toBe("ಬ");
    expect(firstAkshara("ಶಿಶುನಾಳ ಶರೀಫ")).toBe("ಶಿ");
  });
});
