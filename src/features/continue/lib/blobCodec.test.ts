import { describe, expect, it } from "vitest";
import { CONTINUE_TTL_MS, MAX_QR_URL, continueUrl, decodeBlob, encodeBlob, fitContinueUrl, fitQrUrl } from "./blobCodec";
import type { ProgressBlob } from "../types";

/** base64url-encodes an arbitrary (possibly malformed) JSON payload, bypassing `encodeBlob`'s typed input. */
function encodeRaw(value: unknown): string {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

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

  it("rejects a malformed field instead of returning a half-trusted blob", () => {
    const now2 = now;
    const exp = now2 + CONTINUE_TTL_MS;
    // The exact shape reported to crash /continue: stars.words is a number, not an array.
    expect(decodeBlob(encodeRaw({ v: 1, exp, stars: { words: 5 } }), now2)).toBeNull();
    // Non-slug book id.
    expect(decodeBlob(encodeRaw({ v: 1, exp, library: { bookId: "../etc/passwd" } }), now2)).toBeNull();
    // Negative page.
    expect(decodeBlob(encodeRaw({ v: 1, exp, library: { bookId: "koti-chennaya", page: -1 } }), now2)).toBeNull();
    // Padabandha grid is an array, not a map.
    expect(decodeBlob(encodeRaw({ v: 1, exp, padabandha: { packId: "namma-nadu-01", grid: ["a"] } }), now2)).toBeNull();
    // Daily-word date not in YYYY-MM-DD shape.
    expect(decodeBlob(encodeRaw({ v: 1, exp, dailyWord: { date: "not-a-date", guesses: [] } }), now2)).toBeNull();
    // Guesses array holding a non-string.
    expect(decodeBlob(encodeRaw({ v: 1, exp, dailyWord: { date: "2026-09-05", guesses: [1, 2] } }), now2)).toBeNull();
    // Stars.gade missing entirely.
    expect(decodeBlob(encodeRaw({ v: 1, exp, stars: { words: [] } }), now2)).toBeNull();
    // exp not a number.
    expect(decodeBlob(encodeRaw({ v: 1, exp: "soon" }), now2)).toBeNull();
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

  it("fits the QR to a much smaller cap than the copyable link", () => {
    const heavy: ProgressBlob = {
      ...base,
      padabandha: { packId: "namma-nadu-01", grid: Object.fromEntries(Array.from({ length: 40 }, (_, i) => [`e${i}`, "ಅಆಇಈ"])) },
      stars: { words: Array.from({ length: 300 }, (_, i) => `ಪದ${i}`), gade: [] },
    };
    const { url: qrUrl } = fitQrUrl("https://sirigannada.in", heavy);
    const { url: linkUrl } = fitContinueUrl("https://sirigannada.in", heavy);
    expect(qrUrl.length).toBeLessThanOrEqual(MAX_QR_URL);
    expect(qrUrl.length).toBeLessThanOrEqual(linkUrl.length);
    expect(decodeBlob(new URL(qrUrl).hash.slice(1), now)!.library).toEqual(base.library);
  });
});
