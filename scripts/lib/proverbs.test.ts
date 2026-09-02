import { describe, expect, it } from "vitest";
import {
  cleanProverb,
  extractProverbs,
  fixAnusvaraZero,
  isUsableProverb,
  mergeProverbs,
  stripWikiMarkup,
  validateProverbsFile,
} from "./proverbs";

const SAMPLE = `{{ಗಾದೆ}}
__NOTOC__
==ಅ==
* <poem>
* ಅಕ್ಕಿ ಮೇಲೆ ಆಸೆ ನೆಂಟರ ಮೇಲೆ ಇಷ್ಟ.
* ಅತ್ತೆಗೊಂದು ಕಾಲ, ಸೊಸೆಗೊಂದು ಕಾಲ.
*ಉಪ್ಪು ತಿಂದವನು ನೀರು ಕುಡಿಯಲೇಬೇಕು.
* ಏನಾದರೂ ಆಗು ಮೊದಲುdda ಮಾನವನಾಗು.
** English explanation of a saying.
* [http://example.com ಬ್ಲಾಗ್ ಮೂಲ]
[[ವರ್ಗ:ಗಾದೆ]]
`;

describe("stripWikiMarkup", () => {
  it("drops templates, poem tags, categories and bold", () => {
    const out = stripWikiMarkup("'''ಹಾಯ್''' {{x|y}}\n[[ವರ್ಗ:ಗಾದೆ]]\n<poem>ಅಕ್ಕಿ</poem>");
    expect(out).not.toMatch(/\{\{/);
    expect(out).not.toMatch(/ವರ್ಗ/);
    expect(out).toContain("ಹಾಯ್");
    expect(out).toContain("ಅಕ್ಕಿ");
  });

  it("keeps link labels and drops bare URLs", () => {
    expect(stripWikiMarkup("[[ಪುಟ|ಗಾದೆ]]")).toContain("ಗಾದೆ");
    expect(stripWikiMarkup("[https://kn.wikiquote.org/ x]")).toContain("x");
  });
});

describe("extractProverbs", () => {
  it("takes starred Kannada lines and skips junk", () => {
    const got = extractProverbs(SAMPLE);
    expect(got).toContain("ಅಕ್ಕಿ ಮೇಲೆ ಆಸೆ ನೆಂಟರ ಮೇಲೆ ಇಷ್ಟ.");
    expect(got).toContain("ಅತ್ತೆಗೊಂದು ಕಾಲ, ಸೊಸೆಗೊಂದು ಕಾಲ.");
    expect(got).toContain("ಉಪ್ಪು ತಿಂದವನು ನೀರು ಕುಡಿಯಲೇಬೇಕು.");
    expect(got.some((p) => p.includes("dda"))).toBe(false);
    expect(got.some((p) => /English/i.test(p))).toBe(false);
    expect(got.some((p) => p.includes("ಬ್ಲಾಗ್"))).toBe(false);
  });

  it("skips the modern electronic/city block and quote-only duplicates", () => {
    const raw = `* ಅತ್ತೆಗೊಂದು ಕಾಲ, ಸೊಸೆಗೊಂದು ಕಾಲ.
* ''''''ಹೊಸಾ ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಗಾದೆಗಳು!''''''
* *"ಉಪಗ್ರಹ ಕೇಂದ್ರದಲ್ಲಿದ್ದರು, ಶನಿಗ್ರಹ ಕಾಟ ತಪ್ಪಲಿಲ್ಲ"
==ಅ==
* ಅತ್ತೆಗೊಂದು ಕಾಲ, ಸೊಸೆಗೊಂದು ಕಾಲ.
* ’ಕೋ’ ಅನ್ನೋದು ಕುಲದಲ್ಲಿಲ್ಲ
* 'ಕೋ' ಅನ್ನೋದು ಕುಲದಲ್ಲಿಲ್ಲ
`;
    const got = extractProverbs(raw);
    expect(got.some((p) => p.includes("ಉಪಗ್ರಹ"))).toBe(false);
    expect(got.some((p) => p.includes("ಎಲೆಕ್ಟ್ರಾನಿಕ್"))).toBe(false);
    expect(got.filter((p) => p.includes("ಕೋ"))).toHaveLength(1);
    expect(got).toContain("ಅತ್ತೆಗೊಂದು ಕಾಲ, ಸೊಸೆಗೊಂದು ಕಾಲ.");
  });
});

describe("cleanProverb / anusvara", () => {
  it("maps Kannada digit 0 between letters to anusvara", () => {
    expect(fixAnusvaraZero("ನೆ೦ಟರ")).toBe("ನೆಂಟರ");
    expect(cleanProverb("ಅಕ್ಕಿ ಮೇಲೆ ಆಸೆ, ನೆ೦ಟರ ಮೇಲೆ ಪ್ರೀತಿ.")).toBe(
      "ಅಕ್ಕಿ ಮೇಲೆ ಆಸೆ, ನೆಂಟರ ಮೇಲೆ ಪ್ರೀತಿ.",
    );
  });
});

describe("isUsableProverb", () => {
  it("rejects Latin, markup and tiny fragments", () => {
    expect(isUsableProverb("ಅತ್ತೆಗೊಂದು ಕಾಲ")).toBe(true);
    expect(isUsableProverb("hello")).toBe(false);
    expect(isUsableProverb("ಅ")).toBe(false);
    expect(isUsableProverb("ಮನೆ = ಮನೆ")).toBe(false);
  });
});

describe("mergeProverbs", () => {
  it("sorts and dedupes across pages", () => {
    const merged = mergeProverbs([
      ["ಮಳೆ ಬಂದರೆ ಕೇಡಲ್ಲ", "ಅತ್ತೆಗೊಂದು ಕಾಲ"],
      ["ಅತ್ತೆಗೊಂದು ಕಾಲ", "ಉಪ್ಪು ತಿಂದವನು ನೀರು ಕುಡಿಯಲೇಬೇಕು"],
    ]);
    expect(merged).toHaveLength(3);
    expect(merged[0]).toBe("ಅತ್ತೆಗೊಂದು ಕಾಲ");
  });
});

describe("validateProverbsFile", () => {
  it("requires CC-BY-SA provenance and usable rows", () => {
    const ok = {
      provenance: {
        source: "https://kn.wikiquote.org/wiki/ಗಾದೆಗಳು",
        license: "CC-BY-SA-4.0",
        licenseNote: "Kannada Wikiquote contributors",
        retrieved: "2026-09-02",
      },
      pages: ["https://kn.wikiquote.org/wiki/ಗಾದೆಗಳು"],
      proverbs: [{ text: "ಅತ್ತೆಗೊಂದು ಕಾಲ, ಸೊಸೆಗೊಂದು ಕಾಲ", id: "p0001" }],
    };
    expect(validateProverbsFile(ok)).toEqual([]);
    expect(validateProverbsFile({ ...ok, provenance: { ...ok.provenance, license: "ODbL-1.0" } }).length).toBeGreaterThan(0);
  });
});
