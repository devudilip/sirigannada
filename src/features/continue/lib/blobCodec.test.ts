import { describe, expect, it } from "vitest";
import { CONTINUE_TTL_MS, continueUrl, decodeBlob, encodeBlob, fitContinueUrl } from "./blobCodec";
import type { ProgressBlob } from "../types";

const now = 1_000_000_000_000;
const base: ProgressBlob = {
  v: 1,
  exp: now + CONTINUE_TTL_MS,
  library: { bookId: "koti-chennaya", page: 12, verseId: 340 },
  dailyWord: { date: "2026-09-05", guesses: ["ಮನೆ", "ಮಗು"] },
};

describe("blobCodec", () => {
  it("round-trips a blob through the URL-safe encoding", () => {
    const decoded = decodeBlob(encodeBlob(base), now);
    expect(decoded).toEqual(base);
  });

  it("keeps the daily-word section to date + guesses — never an answer", () => {
    const decoded = decodeBlob(encodeBlob(base), now);
    expect(Object.keys(decoded!.dailyWord!).sort()).toEqual(["date", "guesses"]);
    expect(JSON.stringify(decoded)).not.toContain("target");
    expect(JSON.stringify(decoded)).not.toContain("answer");
  });

  it("rejects an expired link", () => {
    const encoded = encodeBlob({ ...base, exp: now - 1 });
    expect(decodeBlob(encoded, now)).toBeNull();
  });

  it("rejects malformed or wrong-version input", () => {
    expect(decodeBlob("not-base64!!", now)).toBeNull();
    expect(decodeBlob(encodeBlob({ ...base, v: 2 as unknown as 1 }), now)).toBeNull();
  });

  it("builds a /continue# URL on the given origin", () => {
    expect(continueUrl("https://sirigannada.in/", base)).toBe(`https://sirigannada.in/continue#${encodeBlob(base)}`);
  });

  it("drops stars, then padabandha, to stay under the length ceiling", () => {
    const heavy: ProgressBlob = {
      ...base,
      padabandha: { packId: "namma-nadu-01", grid: Object.fromEntries(Array.from({ length: 40 }, (_, i) => [`e${i}`, "ಅಆಇಈ"])) },
      stars: { words: Array.from({ length: 300 }, (_, i) => `ಪದ${i}`), gade: [] },
    };
    const { url, trimmed } = fitContinueUrl("https://sirigannada.in", heavy);
    expect(trimmed).toBe(true);
    expect(url.length).toBeLessThanOrEqual(1200);
    expect(decodeBlob(new URL(url).hash.slice(1), now)!.library).toEqual(base.library);
  });
});
