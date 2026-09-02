import { phoneDiffersFromIso, toIso15919 } from "./iso15919";

describe("toIso15919", () => {
  it("drops the inherent vowel before a virama and keeps it elsewhere", () => {
    expect(toIso15919("ಕನ್ನಡ")).toBe("kannaḍa");
    expect(toIso15919("ಪುಸ್ತಕ")).toBe("pustaka");
    expect(toIso15919("ಅಗೞ್")).toBe("agaḻ");
  });

  it("marks vowel length the way ISO 15919 does", () => {
    expect(toIso15919("ಮನೆ")).toBe("mane");
    expect(toIso15919("ಏಕೆ")).toBe("ēke");
    expect(toIso15919("ಕೋಪ")).toBe("kōpa");
    expect(toIso15919("ಶಾಲೆ")).toBe("śāle");
    expect(toIso15919("ಹೂವು")).toBe("hūvu");
    expect(toIso15919("ಕೈ")).toBe("kai");
  });

  it("uses r̥ for vocalic r, ṁ for anusvara, ḥ for visarga", () => {
    expect(toIso15919("ಋಷಿ")).toBe("r\u0325ṣi".normalize("NFC"));
    expect(toIso15919("ಕೃಷಿ")).toBe("kr\u0325ṣi".normalize("NFC"));
    expect(toIso15919("ಅಂಕ")).toBe("aṁka");
    expect(toIso15919("ದುಃಖ")).toBe("duḥkha");
  });

  it("transliterates conjuncts and the Dravidian consonants", () => {
    expect(toIso15919("ಜ್ಞಾನ")).toBe("jñāna");
    expect(toIso15919("ಷಷ್ಠ")).toBe("ṣaṣṭha");
    expect(toIso15919("ಕಾಱ")).toBe("kāṟa");
    expect(toIso15919("ಮಳೆ")).toBe("maḷe");
  });

  it("passes through spaces, punctuation, and Kannada digits", () => {
    expect(toIso15919("ಅ ಆ")).toBe("a ā");
    expect(toIso15919("ಗಂಡು-ಹೆಣ್ಣು")).toBe("gaṁḍu-heṇṇu");
    expect(toIso15919("೧೨")).toBe("12");
    expect(toIso15919("")).toBe("");
  });
});

describe("phoneDiffersFromIso", () => {
  it("hides Alar's phone when it says the same thing", () => {
    expect(phoneDiffersFromIso("kōpa", toIso15919("ಕೋಪ"))).toBe(false);
    expect(phoneDiffersFromIso("", toIso15919("ಕೋಪ"))).toBe(false);
  });

  it("keeps it when Alar's spelling or truncation differs", () => {
    expect(phoneDiffersFromIso("aŋka", toIso15919("ಅಂಕ"))).toBe(true);
    expect(phoneDiffersFromIso("abhyukṣaṇa", toIso15919("ಅಭ್ಯು"))).toBe(true);
  });
});
