import { describe, expect, it } from "vitest";
import {
  assertShareable,
  buildCaption,
  displayUrl,
  KIND_LABEL,
  paintShareCard,
  SHARE_SIZES,
  ShareCardError,
  type ShareCardInput,
  type ShareKind,
} from "./shareCard";

/** Minimal recording stand-in for CanvasRenderingContext2D (node has no real canvas). */
function fakeCtx() {
  const calls: { fn: string; args: unknown[] }[] = [];
  const rec = (fn: string) => (...args: unknown[]) => calls.push({ fn, args });
  const ctx = {
    calls,
    fillStyle: "",
    font: "",
    textAlign: "",
    textBaseline: "",
    globalAlpha: 1,
    lineWidth: 1,
    save: rec("save"),
    restore: rec("restore"),
    translate: rec("translate"),
    rotate: rec("rotate"),
    beginPath: rec("beginPath"),
    fill: rec("fill"),
    fillRect: rec("fillRect"),
    roundRect: rec("roundRect"),
    fillText: rec("fillText"),
    measureText: (s: string) => ({ width: s.length * 20 }),
  };
  return ctx as unknown as CanvasRenderingContext2D & { calls: typeof calls };
}

const fonts = { serif: "TestSerif", sans: "TestSans" };

function baseInput(over: Partial<ShareCardInput> = {}): ShareCardInput {
  return {
    kind: "word",
    main: "ಕನ್ನಡ",
    support: "the Kannada language",
    url: "https://www.sirigannada.in/dictionary?w=kannada",
    source: "Alar · V. Krishna",
    size: "portrait",
    ...over,
  };
}

describe("SHARE_SIZES", () => {
  it("offers a 4:5 default and a 1:1 square, both 1080 wide", () => {
    expect(SHARE_SIZES.portrait).toEqual({ w: 1080, h: 1350 });
    expect(SHARE_SIZES.square).toEqual({ w: 1080, h: 1080 });
  });
});

describe("paintShareCard", () => {
  it("fills a paper background before anything else", () => {
    const ctx = fakeCtx();
    paintShareCard(ctx, baseInput(), fonts);
    const first = ctx.calls.find((c) => c.fn === "fillRect");
    expect(first?.args).toEqual([0, 0, 1080, 1350]);
  });

  it("produces a card for every one of the four content kinds", () => {
    const kinds: ShareKind[] = ["word", "gade", "dailyWord", "verse"];
    for (const kind of kinds) {
      const ctx = fakeCtx();
      paintShareCard(ctx, baseInput({ kind }), fonts);
      expect(ctx.calls.some((c) => c.fn === "fillText" && c.args[0] === KIND_LABEL[kind])).toBe(true);
    }
  });

  it("prints the real link at the footer and the two-colour site mark on the right", () => {
    const ctx = fakeCtx();
    paintShareCard(ctx, baseInput(), fonts);
    const texts = ctx.calls.filter((c) => c.fn === "fillText").map((c) => c.args[0]);
    expect(texts).toContain("sirigannada.in/dictionary?w=kannada");
    expect(texts).toContain("siri");
    expect(texts).toContain("gannada.in");
  });

  it("keeps support to one line by default, more when supportMaxLines allows", () => {
    const long = Array.from({ length: 10 }, (_, i) => `sense ${i} a long meaning phrase`).join("  ·  ");
    const supportLineCount = (ctx: ReturnType<typeof fakeCtx>) =>
      ctx.calls.filter(
        (c) => c.fn === "fillText" && typeof c.args[0] === "string" && (c.args[0] as string).includes("sense"),
      ).length;

    const one = fakeCtx();
    paintShareCard(one, baseInput({ support: long }), fonts);
    expect(supportLineCount(one)).toBe(1);

    const many = fakeCtx();
    paintShareCard(many, baseInput({ support: long, supportMaxLines: 4 }), fonts);
    expect(supportLineCount(many)).toBeGreaterThan(1);
    expect(supportLineCount(many)).toBeLessThanOrEqual(4);
  });

  it("refuses to paint empty or Nudi/Baraha main text", () => {
    expect(() => paintShareCard(fakeCtx(), baseInput({ main: "   " }), fonts)).toThrow(ShareCardError);
    expect(() => paintShareCard(fakeCtx(), baseInput({ main: "PÀ£ÀßqÀ" }), fonts)).toThrow(ShareCardError);
  });
});

describe("assertShareable", () => {
  it("returns NFC-normalised text for clean Kannada", () => {
    expect(assertShareable("ಕೊ".normalize("NFD"))).toBe("ಕೊ");
  });

  it("rejects empty text and text that fails text-health", () => {
    expect(() => assertShareable("")).toThrow(ShareCardError);
    expect(() => assertShareable("ಪಠ್ಯ â€™ �")).toThrow(ShareCardError);
  });
});

describe("displayUrl", () => {
  it("drops the scheme and www, and decodes percent-encoded Kannada", () => {
    expect(displayUrl("https://www.sirigannada.in/dictionary?w=%E0%B2%AE%E0%B2%A8%E0%B3%86")).toBe(
      "sirigannada.in/dictionary?w=ಮನೆ",
    );
  });
});

describe("buildCaption", () => {
  it("carries the sentence, the kind line, the absolute URL, and the hashtags", () => {
    const cap = buildCaption(baseInput());
    expect(cap).toContain("ಕನ್ನಡ — the Kannada language");
    expect(cap).toContain(`${KIND_LABEL.word} · ಸಿರಿಗನ್ನಡ`);
    expect(cap).toContain("https://");
    expect(cap).toContain("sirigannada.in");
    expect(cap).toContain("#ಸಿರಿಗನ್ನಡ #ಕನ್ನಡ #Kannada #sirigannada");
  });

  it("drops the em-dash when there is no support line", () => {
    expect(buildCaption(baseInput({ support: undefined })).split("\n")[0]).toBe("ಕನ್ನಡ");
  });
});
