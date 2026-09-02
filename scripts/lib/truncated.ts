import { aksharaCount } from "./dailyFilters";

/** Latin vowels used in Alar phones (IAST + doubled ASCII). Not ṛ/ḷ: those are ಱ/ಳ. */
const PHONE_VOWELS = ["ai", "au", "aa", "ii", "uu", "ee", "oo", "ā", "ī", "ū", "ē", "ō", "a", "i", "u", "e", "o"];

/** First transcription only: Alar often lists alternatives after space, "/", or "or". */
export function firstPhoneToken(phone: string): string {
  const cut = phone.normalize("NFC").trim().split(/\s+or\s+|[/,\s]+/)[0];
  return (cut ?? "").toLowerCase();
}

/** Syllable nuclei in an Alar Latin phone (diphthongs and long vowels count as one). */
export function phoneVowelCount(phone: string): number {
  const s = firstPhoneToken(phone);
  let n = 0;
  let i = 0;
  while (i < s.length) {
    const hit = PHONE_VOWELS.find((v) => s.startsWith(v, i));
    if (hit) {
      n++;
      i += hit.length;
    } else {
      i++;
    }
  }
  return n;
}

/**
 * True when the phone has more vowels than the headword has aksharas — Alar's
 * truncated-Kannada / full-transliteration pattern (ಅಭ್ಯು vs abhyukṣaṇa).
 */
export function isTruncatedHeadword(word: string, phone: string | undefined): boolean {
  if (!phone) return false;
  const vowels = phoneVowelCount(phone);
  if (vowels === 0) return false;
  return vowels > aksharaCount(word);
}
