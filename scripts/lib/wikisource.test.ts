import { describe, expect, it } from "vitest";
import {
  cleanWikitext,
  dropNonVerse,
  extractLinks,
  fixConversionGlitches,
  joinNumberedVerses,
  sectionOf,
  stripTemplates,
} from "./wikisource";

describe("fixConversionGlitches", () => {
  it("repairs known legacy-font conversion errors", () => {
    expect(fixConversionGlitches("ಮತಿುಲ್ಲದ ಕಾುಗೆ")).toBe("ಮತಿಯಿಲ್ಲದ ಕಾಯಿಗೆ");
    expect(fixConversionGlitches("ಲಿಂಗಸಂಬಂದ್ಥಿ ಬ್ಥಿತ್ತಿ")).toBe("ಲಿಂಗಸಂಬಂಧಿ ಭಿತ್ತಿ");
    expect(fixConversionGlitches("ಕಾಷ*ದಲ್ಲಿ ಗೋಷಿ* ನಿಷೆ*")).toBe("ಕಾಷ್ಠದಲ್ಲಿ ಗೋಷ್ಠಿ ನಿಷ್ಠೆ");
    expect(fixConversionGlitches("ಸ್ಧಾನ")).toBe("ಸ್ಥಾನ");
  });

  it("maps Latin letters stuck in Kannada words to matras (ಮತ್ತs-class)", () => {
    expect(fixConversionGlitches("ಮತ್ತs")).toBe("ಮತ್ತೆ");
    expect(fixConversionGlitches("ಮತ್ತS")).toBe("ಮತ್ತೇ");
    expect(fixConversionGlitches("ಮತ್ತs ನಾಗಿ")).toBe("ಮತ್ತೆ ನಾಗಿ");
    expect(fixConversionGlitches("ಕxyz")).toBe("ಕ");
    expect(fixConversionGlitches("hello ಮನೆ")).toBe("hello ಮನೆ");
  });

  it("rejoins lines broken with an em-dash wrap mark", () => {
    expect(fixConversionGlitches("ತಾ—\nನಾಗಿ")).toBe("ತಾನಾಗಿ");
    expect(fixConversionGlitches("ತಾ–\nನಾಗಿ")).toBe("ತಾನಾಗಿ");
    expect(fixConversionGlitches("ತಾ—ನಾಗಿ")).toBe("ತಾನಾಗಿ");
  });
});

describe("cleanWikitext", () => {
  it("keeps poem lines and drops header template, categories and nav template", () => {
    const raw = `{{header
|title = ಚಕೋರಂಗೆ
|author = ಬಸವಣ್ಣ
}}
<poem>
ಚಕೋರಂಗೆ ಚಂದ್ರಮನ ಬೆಳಗಿನ ಚಿಂತೆ
ಅಂಬುಜಗೆ ಭಾನುವಿನ ಉದಯದ ಚಿಂತೆ
</poem>
[[Category:ವಚನ ಸಾಹಿತ್ಯ]]<br>
{{ಪರಿವಿಡಿ}}`;
    expect(cleanWikitext(raw)).toBe("ಚಕೋರಂಗೆ ಚಂದ್ರಮನ ಬೆಳಗಿನ ಚಿಂತೆ\nಅಂಬುಜಗೆ ಭಾನುವಿನ ಉದಯದ ಚಿಂತೆ");
  });

  it("extracts the verse from {{PoemHeader|Pages=…}} and drops Remarks commentary", () => {
    const raw = `{{PoemHeader
|Author=ಬಸವಣ್ಣ
|Pages=ಉದಕದೊಳಗೆ ಬೈಚಿಟ್ಟ
ಬೈಕೆಯ ಕಿಚ್ಚಿನಂತೆ ಇದ್ದಿತ್ತು;
|Remarks=ಆಧುನಿಕ ವಿವರಣೆ
}}`;
    expect(cleanWikitext(raw)).toBe("ಉದಕದೊಳಗೆ ಬೈಚಿಟ್ಟ\nಬೈಕೆಯ ಕಿಚ್ಚಿನಂತೆ ಇದ್ದಿತ್ತು;");
  });

  it("converts <BR> to newlines, strips bold/links/refs/tables and turns headings into ##", () => {
    const raw = `'''ರಚನೆ''': [[ಪುರಂದರದಾಸರ ಸಾಹಿತ್ಯ|ಶ್ರೀ ಪುರಂದರದಾಸರು]]
----
==ಶೀರ್ಷಿಕೆ==
ಆಚಾರವಿಲ್ಲದ ನಾಲಿಗೆ<BR>
ನೀಚಗುಣವ ಬಿಡು<ref>x</ref><BR>
{| class="wikitable"
|-
| ಕೋಶ
|}`;
    expect(cleanWikitext(raw)).toBe("ರಚನೆ: ಶ್ರೀ ಪುರಂದರದಾಸರು\n\n## ಶೀರ್ಷಿಕೆ\nಆಚಾರವಿಲ್ಲದ ನಾಲಿಗೆ\nನೀಚಗುಣವ ಬಿಡು");
  });
});

describe("cleanWikitext edge cases", () => {
  it("does not treat unbalanced '=' runs as headings and drops the <big> placeholder", () => {
    const raw = "=== ಎಮ್ಮವರು ಬೆಸಗೊಂಡಡೆ<br> ಕೂಡಲಸಂಗಮದೇವನ ಪೂಜಿಸಿದ ಫಲ ನಿಮ್ಮದಯ್ಯಾ.ದೊಡ್ಡ ಪಠ್ಯ<br> ===";
    expect(cleanWikitext(raw)).toBe("ಎಮ್ಮವರು ಬೆಸಗೊಂಡಡೆ\nಕೂಡಲಸಂಗಮದೇವನ ಪೂಜಿಸಿದ ಫಲ ನಿಮ್ಮದಯ್ಯಾ.");
  });

  it("keeps only <poem> bodies when a page also has table-cell commentary", () => {
    const raw = `<table>
<tr><td>
<poem>
ಚಕೋರಂಗೆ ಚಂದ್ರಮನ ಬೆಳಗಿನ ಚಿಂತೆ
</poem>
</td><td>ತಾತ್ಪರ್ಯ: ಆಧುನಿಕ ವಿವರಣೆ</td></tr>
</table>`;
    expect(cleanWikitext(raw)).toBe("ಚಕೋರಂಗೆ ಚಂದ್ರಮನ ಬೆಳಗಿನ ಚಿಂತೆ");
  });

  it("strips (gloss=) notes, maps Latin-in-Kannada, and joins em-dash wraps", () => {
    const raw = "ಮತ್ತs ನಾಗಿ (gloss=coat) ತಾ—\nನಾಗಿ";
    expect(cleanWikitext(raw)).toBe("ಮತ್ತೆ ನಾಗಿ ತಾನಾಗಿ");
  });

  it("keeps a no-poem song body; dropNonVerse then removes the encyclopedia intro", () => {
    const raw = `'''''ಲೋಕದ ಕಾಳಜಿ''''' ಸಂತ ಶಿಶುನಾಳ ಷರೀಫ್ ರವರು ರಚಿಸಿರುವ ಒಂದು ಗೀತೆ. ಗೀತೆಯು ಉತ್ತರ ಕರ್ನಾಟಕದ ಉಪಭಾಷೆಯಲ್ಲಿ ರಚಿಸಲಾಗಿದೆ.<ref>x</ref>

==ಗೀತೆ==
ಲೋಕದ ಕಾಳಜಿ ಮಾಡತೇನಂತಿ<br>
ನಿಂಗ್ಯಾರ್ ಬ್ಯಾಡಾಂತಾರ, ಮಾದಪ್ಪ ಚಿಂತಿ!

''[ಲೋಕದ ಕಾಳಜಿ...]''

ನೀ ಮಾಡೋದು ಘಳಿಗಿ ಸಂತಿ

==ಉಲ್ಲೇಖಗಳು==
{{reflist}}`;
    const cleaned = cleanWikitext(raw);
    expect(cleaned).toContain("ರವರು ರಚಿಸಿರುವ");
    expect(dropNonVerse(cleaned, { commentary: true })).toBe(
      "ಲೋಕದ ಕಾಳಜಿ ಮಾಡತೇನಂತಿ\nನಿಂಗ್ಯಾರ್ ಬ್ಯಾಡಾಂತಾರ, ಮಾದಪ್ಪ ಚಿಂತಿ!\n\nನೀ ಮಾಡೋದು ಘಳಿಗಿ ಸಂತಿ",
    );
  });
});

describe("stripTemplates", () => {
  it("handles nested templates", () => {
    expect(stripTemplates("a {{x|{{y}}|z}} b")).toBe("a  b");
  });
});

describe("extractLinks", () => {
  it("lists linked titles in order, skipping categories and interwiki links", () => {
    const raw = `# '''[[ ಚಕೋರಂಗೆ ಚಂದ್ರಮನ]]'''
[[:wikipedia:kn:ಬಸವಣ್ಣ|ಬಸವಣ್ಣ]]
# [[ಯಾರು ಒಲಿದರೇನು|ಯಾರು ಒಲಿದರೇನು]]
[[Category:ವಚನ ಸಾಹಿತ್ಯ]] [[ವರ್ಗ:ಅ]]`;
    expect(extractLinks(raw)).toEqual(["ಚಕೋರಂಗೆ ಚಂದ್ರಮನ", "ಯಾರು ಒಲಿದರೇನು"]);
  });
});

describe("sectionOf / joinNumberedVerses", () => {
  it("returns only the named section", () => {
    const cleaned = "## ಒಂದು\nಅ\n\n## ಎರಡು\nಆ\nಇ\n\n## ಮೂರು\nಈ";
    expect(sectionOf(cleaned, "ಎರಡು")).toBe("ಆ\nಇ");
    expect(sectionOf(cleaned, "ಇಲ್ಲ")).toBe("");
  });

  it("rejoins verse lines split by blank lines and breaks after the verse number", () => {
    const text = "ಶ್ರೀವನಿತೆಯರಸನೆ\n\nಜೀವ ಪೀಠನ\n\nಕಾವುದಾನತ ಜನವ ೧\n\n\n\nಶರಣಸಂಗವ್ಯಸನ\n\nಬರನೆ ಸಲಹುಗೆ ॥೨॥";
    expect(joinNumberedVerses(text)).toBe("ಶ್ರೀವನಿತೆಯರಸನೆ\nಜೀವ ಪೀಠನ\nಕಾವುದಾನತ ಜನವ ೧\n\nಶರಣಸಂಗವ್ಯಸನ\nಬರನೆ ಸಲಹುಗೆ ॥೨॥");
  });

  it("accepts parenthesised verse numbers after dandas", () => {
    const text = "ಕೇಳು ಜನಮೇಜಯ\nಶೀಲವನು ರಾಗದಲಿ||    (೧)\nಕರೆಸಿ ಕುಂತೀಭೋಜನನು\nಮುಹೂರ್ತದಲಿ || (೨)";
    expect(joinNumberedVerses(text)).toBe("ಕೇಳು ಜನಮೇಜಯ\nಶೀಲವನು ರಾಗದಲಿ||    (೧)\n\nಕರೆಸಿ ಕುಂತೀಭೋಜನನು\nಮುಹೂರ್ತದಲಿ || (೨)");
  });

  it("does not glue an unnumbered ಸೂಚನೆ onto verse 1", () => {
    const text = "ಸೂಚನೆ: ಈ ಪದ್ಯವನ್ನು ಹಾಡುವುದು ||\nಕೇಳು ಜನಮೇಜಯ\nಶೀಲವನು ರಾಗದಲಿ ೧";
    expect(joinNumberedVerses(text)).toBe("ಕೇಳು ಜನಮೇಜಯ\nಶೀಲವನು ರಾಗದಲಿ ೧");
  });
});

describe("dropNonVerse", () => {
  it("drops commentary headers and Latin-only nav lines", () => {
    const text = "## ಶೀರ್ಷಿಕೆ\nರಾಗ: ಭೈರವಿ\nಚಕೋರಂಗೆ ಚಂದ್ರಮನ\nತಾತ್ಪರ್ಯ ಆಧುನಿಕ ವಿವರಣೆ\nMain_Page\nಪದವಿಭಾಗ: ಪದ";
    expect(dropNonVerse(text)).toBe("ಚಕೋರಂಗೆ ಚಂದ್ರಮನ");
  });

  it("drops ನೋಡಿ/ಉಲ್ಲೇಖ section bodies, not only the heading line", () => {
    const text = "ಚಕೋರಂಗೆ ಚಂದ್ರಮನ\n## ನೋಡಿ\nಶರೀಫ ಸಾಹಿತ್ಯ\n## ಉಲ್ಲೇಖಗಳು\nಅನಾಮಿಕ";
    expect(dropNonVerse(text)).toBe("ಚಕೋರಂಗೆ ಚಂದ್ರಮನ");
  });

  it("in blocks mode drops unlabeled modern intro prose and [refrain] cues", () => {
    const text = `ಲೋಕದ ಕಾಳಜಿ ಸಂತ ಶಿಶುನಾಳ ಷರೀಫ್ ರವರು ರಚಿಸಿರುವ ಒಂದು ಗೀತೆ. ಗೀತೆಯು ಉತ್ತರ ಕರ್ನಾಟಕದ ಉಪಭಾಷೆಯಲ್ಲಿ ರಚಿಸಲಾಗಿದೆ.
## ಗೀತೆ
ಲೋಕದ ಕಾಳಜಿ ಮಾಡತೇನಂತಿ
ನಿಂಗ್ಯಾರ್ ಬ್ಯಾಡಾಂತಾರ, ಮಾದಪ್ಪ ಚಿಂತಿ!
[ಲೋಕದ ಕಾಳಜಿ...]
ನೀ ಮಾಡೋದು ಘಳಿಗಿ ಸಂತಿ`;
    expect(dropNonVerse(text, { commentary: true })).toBe(
      "ಲೋಕದ ಕಾಳಜಿ ಮಾಡತೇನಂತಿ\nನಿಂಗ್ಯಾರ್ ಬ್ಯಾಡಾಂತಾರ, ಮಾದಪ್ಪ ಚಿಂತಿ!\nನೀ ಮಾಡೋದು ಘಳಿಗಿ ಸಂತಿ",
    );
  });

  it("does not treat long prose as commentary unless asked (novels use page mode)", () => {
    const prose = "ಮುಂಜಾನೆ ಇಂದಿರಾಬಾಯಿ ತನ್ನ ಮನೆಯ ಅಂಗಳದಲ್ಲಿ ನಿಂತು ದೂರದ ಬಯಲನ್ನು ನೋಡುತ್ತಿದ್ದಳು. ಗಾಳಿ ಮಲ್ಲಿಗೆಯ ಕಂಪನ್ನು ತಂದಿತು.";
    expect(dropNonVerse(prose)).toBe(prose);
  });
});
