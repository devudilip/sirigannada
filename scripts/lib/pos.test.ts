import { mapPos } from "./pos";
import { tokenise, tokenShard } from "./tokenise";

describe("mapPos", () => {
  it("maps canonical names", () => {
    expect(mapPos("noun")).toBe("noun");
    expect(mapPos("verb")).toBe("verb");
    expect(mapPos("adjective")).toBe("adjective");
    expect(mapPos("adverb")).toBe("adverb");
    expect(mapPos("pronoun")).toBe("pronoun");
    expect(mapPos("conjunction")).toBe("conjunction");
    expect(mapPos("interjection")).toBe("interjection");
    expect(mapPos("preposition")).toBe("preposition");
    expect(mapPos("prefix")).toBe("prefix");
    expect(mapPos("suffix")).toBe("suffix");
  });

  it("normalises abbreviations, case and stray dots", () => {
    expect(mapPos("n.")).toBe("noun");
    expect(mapPos("v.")).toBe("verb");
    expect(mapPos("v..")).toBe("verb");
    expect(mapPos("v+c32968.")).toBe("verb");
    expect(mapPos("Adj")).toBe("adjective");
    expect(mapPos(" adv. ")).toBe("adverb");
    expect(mapPos("ವ.")).toBe("verb");
  });

  it("falls back to other", () => {
    expect(mapPos("")).toBe("other");
    expect(mapPos(undefined)).toBe("other");
    expect(mapPos("independent clause")).toBe("other");
    expect(mapPos("sentence")).toBe("other");
    expect(mapPos("pr.p.")).toBe("other");
  });
});

describe("tokenise", () => {
  it("lower-cases, strips punctuation and drops stopwords", () => {
    expect(tokenise("The curtain, used to pull-down at the END of a scene.")).toEqual([
      "curtain", "pull", "down", "end", "scene",
    ]);
  });

  it("drops short tokens, dedupes and folds diacritics", () => {
    expect(tokenise("an ox; ox or oxen of Kannaḍa")).toEqual(["oxen", "kannada"]);
  });

  it("ignores Kannada script and digits", () => {
    expect(tokenise("ಅ ಆ 123 water")).toEqual(["water"]);
  });
});

describe("tokenShard", () => {
  it("shards by first letter", () => {
    expect(tokenShard("water")).toBe("w");
    expect(tokenShard("zebra")).toBe("z");
    expect(tokenShard("")).toBe("other");
  });
});
