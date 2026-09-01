import type { PartOfSpeech } from "../../src/lib/types";

/**
 * Map the free-text `type` field of an Alar definition onto our closed PartOfSpeech set.
 * The source is mostly clean ("noun", "verb", ...) but has a handful of abbreviations,
 * typos and Kannada labels; anything unrecognised becomes "other".
 */
const POS_MAP: Record<string, PartOfSpeech> = {
  noun: "noun", n: "noun",
  verb: "verb", v: "verb", "ವ": "verb",
  adjective: "adjective", adj: "adjective",
  adverb: "adverb", adv: "adverb",
  pronoun: "pronoun", pron: "pronoun",
  conjunction: "conjunction", conj: "conjunction",
  interjection: "interjection", interj: "interjection", int: "interjection",
  preposition: "preposition", prep: "preposition",
  prefix: "prefix", pref: "prefix",
  suffix: "suffix", suf: "suffix", suff: "suffix",
};

/** Lower-case, drop trailing dots/whitespace, keep only the leading alphabetic token. */
function canonical(raw: string): string {
  const cleaned = raw.trim().toLowerCase().replace(/[.\s]+$/g, "");
  const match = /^[a-z\u0C80-\u0CFF]+/.exec(cleaned);
  return match ? match[0] : cleaned;
}

export function mapPos(raw: string | undefined | null): PartOfSpeech {
  if (!raw) return "other";
  return POS_MAP[canonical(raw)] ?? "other";
}
