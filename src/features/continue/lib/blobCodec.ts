import type { ProgressBlob } from "../types";

/**
 * Encode / decode the progress blob for the URL hash. base64url of the UTF-8 JSON — no
 * compression (the blob is tiny in practice) and no server. `decodeBlob` also enforces the
 * version and the self-contained expiry, so an old or corrupt link fails cleanly.
 */

/** Continue links live this long. Kept in the 24–48h band the brief asks for. */
export const CONTINUE_TTL_MS = 36 * 60 * 60 * 1000;

/**
 * Hard ceiling on the continue URL. Keeps the QR scannable from a laptop screen; when the blob
 * would exceed it, `fitContinueUrl` drops the least essential parts (stars, then games) and
 * keeps the reading position.
 */
export const MAX_CONTINUE_URL = 1200;

function bytesToBase64(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i);
  return out;
}

export function encodeBlob(blob: ProgressBlob): string {
  const bytes = new TextEncoder().encode(JSON.stringify(blob));
  return bytesToBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Returns null for anything that is not a live v1 blob (bad base64/JSON, wrong version, expired). */
export function decodeBlob(text: string, now: number = Date.now()): ProgressBlob | null {
  try {
    const b64 = text.replace(/-/g, "+").replace(/_/g, "/");
    const json = new TextDecoder().decode(base64ToBytes(b64));
    const raw = JSON.parse(json) as unknown;
    if (!raw || typeof raw !== "object") return null;
    const blob = raw as ProgressBlob;
    if (blob.v !== 1 || typeof blob.exp !== "number") return null;
    if (now > blob.exp) return null;
    return blob;
  } catch {
    return null;
  }
}

export function continueUrl(origin: string, blob: ProgressBlob): string {
  return `${origin.replace(/\/$/, "")}/continue#${encodeBlob(blob)}`;
}

/**
 * Builds the continue URL, shedding optional parts until it fits `MAX_CONTINUE_URL`.
 * Reading position and the daily-word date/guesses are always kept.
 */
export function fitContinueUrl(origin: string, blob: ProgressBlob): { url: string; trimmed: boolean } {
  let current: ProgressBlob = blob;
  let url = continueUrl(origin, current);
  let trimmed = false;
  for (const key of ["stars", "padabandha"] as const) {
    if (url.length <= MAX_CONTINUE_URL) break;
    if (current[key] === undefined) continue;
    current = { ...current };
    delete current[key];
    trimmed = true;
    url = continueUrl(origin, current);
  }
  return { url, trimmed };
}
