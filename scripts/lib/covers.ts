/**
 * Validation for the optional book cover photograph (`cover` in data/books-src/<slug>/book.json).
 *
 * The contract, in one place — see also the doc comment on `BookCover` in src/lib/types.ts:
 *
 *   "cover": {
 *     "file": "<slug>.webp",                       // exactly the slug; lives at public/data/covers/
 *     "alt": { "kn": "…", "en": "…" },             // what the PHOTO shows, both languages, non-empty
 *     "provenance": {
 *       "source": "https://commons.wikimedia.org/wiki/File:….jpg",   // https, the Commons file page
 *       "license": "CC-BY-SA-4.0",                 // any CC BY / CC BY-SA version, CC0, or public-domain
 *       "licenseNote": "Photograph by … via Wikimedia Commons, CC BY-SA 4.0; cropped, resized and shown with a brand duotone tint.",
 *       "author": "<photographer>",                // required: attribution is the whole point
 *       "retrieved": "YYYY-MM-DD"
 *     }
 *   }
 *
 * The file must exist and be 40 KB or smaller. ODbL is a database licence and is never valid for
 * an image. A public-domain cover must say in `licenseNote` *why* it is public domain.
 */
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import type { License } from "../../src/lib/types";
import { isHttpsUrl, isIsoDate, isNonEmptyString, isRecord } from "./checks";

/** Licences a cover photograph may carry. Wider than the text list (Commons photos are usually on
 *  an older CC version), but ODbL is excluded: it covers databases, never images. */
export const COVER_LICENSES: readonly License[] = [
  "public-domain",
  "CC0-1.0",
  "CC-BY-2.0",
  "CC-BY-2.5",
  "CC-BY-3.0",
  "CC-BY-4.0",
  "CC-BY-SA-2.0",
  "CC-BY-SA-2.5",
  "CC-BY-SA-3.0",
  "CC-BY-SA-4.0",
];

/** Where cover images live under public/. Served as /data/covers/<slug>.webp. */
export const COVERS_DIR = join("data", "covers");

/** Hard budget per cover: these load on a shelf, on a budget phone, over a slow connection. */
export const COVER_MAX_BYTES = 40 * 1024;

/** Public URL the app loads a cover from. */
export function coverUrl(file: string): string {
  return `/data/covers/${file}`;
}

/** Words that make a public-domain claim checkable by a human reader of the credits page. */
const PD_REASON_RE = /\b(public domain|died|expired|copyright|PD-|CC0|no known|life\s*\+)/i;

function validateCoverAlt(alt: unknown, errors: string[]): void {
  if (!isRecord(alt)) {
    errors.push("cover.alt: missing; needs { kn, en } describing what the photo shows");
    return;
  }
  for (const loc of ["kn", "en"] as const) {
    if (!isNonEmptyString(alt[loc])) errors.push(`cover.alt.${loc}: required, non-empty`);
  }
}

function validateCoverProvenance(p: unknown, errors: string[]): void {
  if (!isRecord(p)) {
    errors.push("cover.provenance: missing or not an object");
    return;
  }
  if (!isHttpsUrl(p.source)) {
    errors.push("cover.provenance.source: must be an https URL (the Wikimedia Commons file page)");
  }
  if (!COVER_LICENSES.includes(p.license as License)) {
    errors.push(`cover.provenance.license: must be one of ${COVER_LICENSES.join(", ")} (ODbL is not a licence for images)`);
  }
  if (!isNonEmptyString(p.licenseNote)) {
    errors.push("cover.provenance.licenseNote: required; name the photographer, the licence and the edits (crop, resize, duotone tint)");
  } else if (p.license === "public-domain" && !PD_REASON_RE.test(p.licenseNote)) {
    errors.push("cover.provenance.licenseNote: a public-domain image must explain why it is public domain");
  }
  if (!isNonEmptyString(p.author)) {
    errors.push("cover.provenance.author: required; the photographer must be credited by name");
  }
  if (!isIsoDate(p.retrieved)) errors.push("cover.provenance.retrieved: must be an ISO date YYYY-MM-DD");
}

/**
 * Validate a book.json's `cover` block. `publicRoot` is the folder `public/data/covers/` sits in.
 * Returns human-readable errors; an empty array means the cover is publishable.
 */
export function validateCover(cover: unknown, slug: string, publicRoot: string): string[] {
  const errors: string[] = [];
  if (!isRecord(cover)) return ["cover: not an object"];

  const expected = `${slug}.webp`;
  if (cover.file !== expected) {
    errors.push(`cover.file: must be "${expected}" (got ${JSON.stringify(cover.file)})`);
  } else {
    const path = join(publicRoot, COVERS_DIR, expected);
    if (!existsSync(path)) {
      errors.push(`cover.file: ${join(COVERS_DIR, expected)} is missing from public/`);
    } else {
      const bytes = statSync(path).size;
      if (bytes > COVER_MAX_BYTES) {
        errors.push(`cover.file: ${expected} is ${Math.round(bytes / 1024)} KB; the limit is ${COVER_MAX_BYTES / 1024} KB`);
      }
    }
  }
  validateCoverAlt(cover.alt, errors);
  validateCoverProvenance(cover.provenance, errors);
  return errors;
}
