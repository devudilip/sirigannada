import { describe, expect, it } from "vitest";
import { BEGINNER_PADABANDHA } from "../data/puzzles";
import { readAnswerInput } from "./latinAnswer";
import { buildGrid, entryById, entryValue, isEntrySolved, writeEntry } from "./puzzle";

const grid = buildGrid(BEGINNER_PADABANDHA);
const answer = (id: string, raw: string) => {
  const entry = entryById(grid.entries, id);
  const values = writeEntry({}, entry, readAnswerInput(raw).kannada);
  return { value: entryValue(values, entry), solved: isEntrySolved(values, entry) };
};

describe("readAnswerInput", () => {
  it("keeps Latin as typed and transliterates it", () => {
    expect(readAnswerInput("mane")).toEqual({ latin: "mane", kannada: "ಮನೆ" });
  });

  it("passes Kannada through untouched", () => {
    expect(readAnswerInput("ಮನೆ")).toEqual({ latin: "", kannada: "ಮನೆ" });
  });

  it("treats a field with any Latin letter as Latin", () => {
    expect(readAnswerInput("ಮನe").kannada).toBe("ಎ");
  });

  it("keeps a trailing virama while a word is half typed", () => {
    expect(readAnswerInput("man").kannada).toBe("ಮನ್");
    expect(readAnswerInput("bas").kannada).toBe("ಬಸ್");
  });

  it("reads capital M as anusvara", () => {
    expect(readAnswerInput("caMdra").kannada).toBe("ಚಂದ್ರ");
  });
});

describe("Latin answers in the grid", () => {
  it("solves entries typed in English letters", () => {
    expect(answer("aramane", "aramane")).toEqual({ value: "ಅರಮನೆ", solved: true });
    expect(answer("kannada", "kannaDa")).toEqual({ value: "ಕನ್ನಡ", solved: true });
    expect(answer("mavina-hannu", "maavinahaNNu")).toEqual({ value: "ಮಾವಿನಹಣ್ಣು", solved: true });
  });

  it("does not solve a near miss and trims to the entry length", () => {
    expect(answer("kannada", "kannada")).toEqual({ value: "ಕನ್ನದ", solved: false });
    expect(answer("nagara", "nagaraga").value).toBe("ನಗರ");
  });

  it("fills a half-typed word akshara by akshara", () => {
    expect(answer("adige", "aDig").value).toBe("ಅಡಿಗ್");
  });
});
