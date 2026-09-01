import { describe, expect, it } from "vitest";
import {
  cleanWikitext,
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
});
