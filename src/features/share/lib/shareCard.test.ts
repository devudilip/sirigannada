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

function watermarkCount(ctx: ReturnType<typeof fakeCtx>): number {
  return ctx.calls.filter((c) => c.fn === "fillText" && c.args[0] === "sirigannada.in").length;
}

describe("SHARE_SIZES", () => {
  it("offers a 4:5 default and a 1:1 square, both 1080 wide", () => {
    expect(SHARE_SIZES.portrait).toEqual({ w: 1080, h: 1350 });
    expect(SHARE_SIZES.square).toEqual({ w: 1080, h: 1080 });
  });
});

describe("paintShareCard", () => {
  it("always draws both the corner and the ghost watermark", () => {
    const ctx = fakeCtx();
    paintShareCard(ctx, baseInput(), fonts);
    expect(watermarkCount(ctx)).toBe(2);
    // the ghost is rotated ~-18deg and drawn before the main text; the corner is not rotated.
    expect(ctx.calls.some((c) => c.fn === "rotate")).toBe(true);
  });

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
      expect(watermarkCount(ctx)).toBe(2);
      expect(ctx.calls.some((c) => c.fn === "fillText" && c.args[0] === KIND_LABEL[kind])).toBe(true);
    }
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
