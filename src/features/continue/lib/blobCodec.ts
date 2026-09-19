import type { ProgressBlob } from "../types";

/**
 * Encode / decode the progress blob for the URL hash. base64url of the UTF-8 JSON — no
 * compression (the blob is tiny in practice) and no server. `decodeBlob` also enforces the
 * version, the self-contained expiry, and the shape of every field, so an old, corrupt, or
 * hand-crafted link fails cleanly instead of crashing a consumer that trusts its shape.
 */

/** Continue links live this long. Kept in the 24–48h band the brief asks for. */
export const CONTINUE_TTL_MS = 36 * 60 * 60 * 1000;

/**
 * Hard ceiling on the continue URL. Keeps the copyable link a reasonable size; when the blob
 * would exceed it, `fitContinueUrl` drops the least essential parts (stars, then Padabandha) and
 * keeps the reading position.
 */
export const MAX_CONTINUE_URL = 1200;

/**
 * Hard ceiling on the URL actually encoded into the QR. Error correction "H" plus the centre
 * logo knockout means a long URL renders too dense to scan reliably on a small plate — this stays
 * well under `MAX_CONTINUE_URL` so the QR (position + games, stars only while they still fit) is
 * scannable even though the copyable link can carry the fuller blob.
 */
export const MAX_QR_URL = 400;

/** Sane caps so a hand-crafted blob cannot balloon the applied state. Matches what the app itself ever writes. */
const MAX_ARRAY_ITEMS = 300;
const MAX_STRING_LEN = 200;
const MAX_GRID_ENTRIES = 300;

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

function isBoundedString(v: unknown, maxLen = MAX_STRING_LEN): v is string {
  return typeof v === "string" && v.length > 0 && v.length <= maxLen;
}

/** Lowercase-hyphenated ascii, the shape every book slug and Padabandha pack id already has. */
function isSlug(v: unknown): v is string {
  return typeof v === "string" && /^[a-z0-9](?:[a-z0-9-]{0,78}[a-z0-9])?$/.test(v);
}

function isYmd(v: unknown): v is string {
  return typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);
}

function isFiniteNonNegative(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v) && v >= 0;
}

function isBoundedStringArray(v: unknown, maxLen = MAX_STRING_LEN): v is string[] {
  return Array.isArray(v) && v.length <= MAX_ARRAY_ITEMS && v.every((item) => isBoundedString(item, maxLen));
}

function isValidLibrary(v: unknown): v is NonNullable<ProgressBlob["library"]> {
  if (!v || typeof v !== "object") return false;
  const l = v as Record<string, unknown>;
  if (!isSlug(l.bookId)) return false;
  if (l.page !== undefined && !isFiniteNonNegative(l.page)) return false;
  if (l.verseId !== undefined && !isFiniteNonNegative(l.verseId)) return false;
  return true;
}

function isValidPadabandha(v: unknown): v is NonNullable<ProgressBlob["padabandha"]> {
  if (!v || typeof v !== "object") return false;
  const p = v as Record<string, unknown>;
  if (!isSlug(p.packId)) return false;
  if (!p.grid || typeof p.grid !== "object" || Array.isArray(p.grid)) return false;
  const entries = Object.entries(p.grid as Record<string, unknown>);
  if (entries.length > MAX_GRID_ENTRIES) return false;
  return entries.every(([key, val]) => isBoundedString(key, 80) && typeof val === "string" && val.length <= 40);
}

function isValidDailyWord(v: unknown): v is NonNullable<ProgressBlob["dailyWord"]> {
  if (!v || typeof v !== "object") return false;
  const d = v as Record<string, unknown>;
  if (!isYmd(d.date)) return false;
  if (!isBoundedStringArray(d.guesses, 20)) return false;
  return true;
}

function isValidStars(v: unknown): v is NonNullable<ProgressBlob["stars"]> {
  if (!v || typeof v !== "object") return false;
  const s = v as Record<string, unknown>;
  return isBoundedStringArray(s.words) && isBoundedStringArray(s.gade);
}

/** Returns null for anything that is not a live v1 blob (bad base64/JSON, wrong version, expired, or malformed field). */
export function decodeBlob(text: string, now: number = Date.now()): ProgressBlob | null {
  try {
    const b64 = text.replace(/-/g, "+").replace(/_/g, "/");
    const json = new TextDecoder().decode(base64ToBytes(b64));
    const raw = JSON.parse(json) as unknown;
    if (!raw || typeof raw !== "object") return null;
    const b = raw as Record<string, unknown>;
    if (b.v !== 1 || !isFiniteNonNegative(b.exp)) return null;
    if (now > (b.exp as number)) return null;

    const blob: ProgressBlob = { v: 1, exp: b.exp as number };
    if (b.library !== undefined) {
      if (!isValidLibrary(b.library)) return null;
      blob.library = b.library;
    }
    if (b.padabandha !== undefined) {
      if (!isValidPadabandha(b.padabandha)) return null;
      blob.padabandha = b.padabandha;
    }
    if (b.dailyWord !== undefined) {
      if (!isValidDailyWord(b.dailyWord)) return null;
      blob.dailyWord = b.dailyWord;
    }
    if (b.stars !== undefined) {
      if (!isValidStars(b.stars)) return null;
      blob.stars = b.stars;
    }
    return blob;
  } catch {
    return null;
  }
}

export function continueUrl(origin: string, blob: ProgressBlob): string {
  return `${origin.replace(/\/$/, "")}/continue#${encodeBlob(blob)}`;
}

/** Shared by `fitContinueUrl` and `fitQrUrl`: shed stars then Padabandha until the URL fits `maxLen`. */
function fitUrl(origin: string, blob: ProgressBlob, maxLen: number): { url: string; trimmed: boolean } {
  let current: ProgressBlob = blob;
  let url = continueUrl(origin, current);
  let trimmed = false;
  for (const key of ["stars", "padabandha"] as const) {
    if (url.length <= maxLen) break;
    if (current[key] === undefined) continue;
    current = { ...current };
    delete current[key];
    trimmed = true;
    url = continueUrl(origin, current);
  }
  return { url, trimmed };
}

/**
 * Builds the copyable continue URL, shedding optional parts until it fits `MAX_CONTINUE_URL`.
 * Reading position and the daily-word date/guesses are always kept.
 */
export function fitContinueUrl(origin: string, blob: ProgressBlob): { url: string; trimmed: boolean } {
  return fitUrl(origin, blob, MAX_CONTINUE_URL);
}

/** Builds the (usually smaller) URL actually encoded into the QR — see `MAX_QR_URL`. */
export function fitQrUrl(origin: string, blob: ProgressBlob): { url: string; trimmed: boolean } {
  return fitUrl(origin, blob, MAX_QR_URL);
}
