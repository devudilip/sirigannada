/**
 * Word pool for the daily akshara-guess game (roadmap L-05): a small, hand-picked *answer* list
 * plus a much broader *valid-guess* list. See `WordGamePool` in `src/lib/types.ts`.
 *
 * A plain boolean-filter pass (`isWordGameCandidate`) plus the word-of-day-style ordinariness
 * `score()` still lets through mostly scholarly/technical compounds: at exactly 5 aksharas, Alar
 * skews heavily toward tatsama compounds that pass every junk-headword heuristic and even rank
 * well by `score()`'s compound-family-size proxy, but are not words an ordinary reader would
 * recognize or could plausibly guess (verified by hand-reading the full ~220-word
 * filter-and-rank output while building this — the vast majority were archaic, regional-dialect,
 * or specialist vocabulary: e.g. ಅಂಕಕಹಳೆ "a war trumpet", ಅಧಿಜ್ಯಧನು "holding a strung bow",
 * ಇರ್ತಲೆವೊತ್ತು "(fire) to catch from both sides"). No automated heuristic here can substitute
 * for actually knowing which Kannada words are ordinary — that requires either a native-fluent
 * reviewer or an external frequency corpus, neither of which this pass has. So `WORD_GAME_ANSWERS`
 * below is an explicit, literal, hand-picked list (same pattern as `dailyWordLists.ts`'s
 * `ALLOWED_HEADWORD_LIST`) of words the coordinator judged ordinary on a plain reading of their
 * Alar gloss — a best-effort starting set, honestly not a native-speaker-verified one, and should
 * grow via a real Kannada-fluent review pass (same review step D-02's word-of-day list needed)
 * rather than by loosening the filter/score heuristic back open.
 *
 * The much larger `isWordGameCandidate`-filtered set (minus the ordinariness scoring/window pick)
 * still has real value as the *valid-guess* dictionary: accepting more real words as input is
 * harmless and good UX (a player typing an obscure-but-real word shouldn't be told it's invalid),
 * it just must never be eligible as the day's answer.
 */
import { splitAksharas } from "../../src/lib/kannada";
import type { DictEntry, PartOfSpeech, WordGameEntry } from "../../src/lib/types";
import { ABSTRACT_NOUN, COMPOUND_END } from "./daily";
import {
  hasHaCrossRef,
  isAllowedHeadword,
  isDeniedHeadword,
  isJunkDefinition,
  isJunkHeadword,
  isOldPVerb,
  isPaNounWithHaTwin,
} from "./dailyFilters";
import { isTruncatedHeadword } from "./truncated";

/** Aksharas the grid has columns for. */
export const WORD_GAME_LENGTH = 5;

const MAX_DEFS = 24;
const ALLOWED_POS = new Set<PartOfSpeech>(["noun", "verb", "adjective"]);
/** Causative "-ify" verbs (ಸಂಘಟಿಸು, ಪ್ರಚೋದಿಸು…) are common at 5 aksharas but read as technical. */
const CAUSATIVE_VERB = /ಿಸು$/;
/** "-shastra/-shastrajna" ("-science"/"-scientist") academic-discipline compounds. */
const SCHOLARLY_DISCIPLINE = /ಶಾಸ್ತ್ರ(ಜ್ಞ[ೆ]?)?$/;

const MAX_MEANING_LENGTH = 140;

function firstPos(entry: DictEntry): PartOfSpeech {
  return entry.defs[0]!.pos;
}

/** First, short sense of an entry's primary definition — shown on the end-of-game reveal.
 * Same shape as `firstSense` in `src/features/learn/lib/practiceMatch.ts`; kept local to avoid
 * a build script depending on feature/UI code. */
function firstSense(entry: DictEntry): string {
  const raw = entry.defs[0]?.text ?? "";
  const sense = raw.split(";")[0]!.trim();
  return sense.length > MAX_MEANING_LENGTH ? `${sense.slice(0, MAX_MEANING_LENGTH - 1)}…` : sense;
}

/**
 * True if `entry` is a real, well-formed, exactly-`WORD_GAME_LENGTH`-akshara word: the same
 * boolean composition `selectDaily` uses for word-of-day, minus the codepoint-length window (a
 * 5-akshara word can be any number of codepoints) and gated on `splitAksharas` instead. This is
 * a necessary but not sufficient quality bar — see the module doc comment; `selectWordGamePool`
 * additionally ranks and trims what passes here.
 */
export function isWordGameCandidate(entry: DictEntry, haWords: Set<string>): boolean {
  if (splitAksharas(entry.word).length !== WORD_GAME_LENGTH) return false;
  if (isAllowedHeadword(entry.word)) {
    if (!entry.phone) return false;
    if (isTruncatedHeadword(entry.word, entry.phone) || entry.truncated) return false;
    return entry.defs.length > 0;
  }
  if (isJunkHeadword(entry.word) || isDeniedHeadword(entry.word)) return false;
  if (!entry.phone) return false;
  if (isTruncatedHeadword(entry.word, entry.phone) || entry.truncated) return false;
  if (entry.defs.length < 1 || entry.defs.length > MAX_DEFS) return false;
  if (!entry.defs.every((d) => ALLOWED_POS.has(d.pos))) return false;
  if (isOldPVerb(entry.word, firstPos(entry))) return false;
  if (isPaNounWithHaTwin(entry.word, firstPos(entry), haWords)) return false;
  if (entry.word.startsWith("ಪ") && hasHaCrossRef(entry.defs[0]!.text)) return false;
  if (isJunkDefinition(entry.defs[0]!.text)) return false;
  // Hard-exclude shapes that are almost always scholarly/technical compounds at this length,
  // rather than merely score-penalising them: abstract nouns (-ತ್ವ/-ತೆ), compound-continuation
  // endings, and causative "-ify" verbs (-ಿಸು).
  if (
    ABSTRACT_NOUN.test(entry.word) ||
    COMPOUND_END.test(entry.word) ||
    CAUSATIVE_VERB.test(entry.word) ||
    SCHOLARLY_DISCIPLINE.test(entry.word)
  ) {
    return false;
  }
  return true;
}

/**
 * Hand-picked, exactly-5-akshara words an ordinary reader could plausibly recognize and guess —
 * the only words eligible to be a daily puzzle's *answer*. See the module doc comment for why
 * this is a literal list rather than a scoring heuristic, and for the honesty caveat: this is a
 * best-effort coordinator pass reading Alar's English glosses, not a native-Kannada-fluent
 * review. Grow this list (never the score/window heuristic) once that review happens.
 */
export const WORD_GAME_ANSWERS: readonly string[] = [
  "ಅಂಗಸಾಧನೆ", "ಅಂತಾರಾಷ್ಟ್ರೀಯ", "ಅಗ್ನಿಶಾಮಕ", "ಅಸಹಾಯಕ", "ಉದಾಹರಣೆ", "ಒಣಹರಟೆ", "ಕಳ್ಳಸಾಗಣೆ",
  "ಕಾಕತಾಲೀಯ", "ಕಾತರಗೊಳ್ಳು", "ಕಾಲಗಣನ", "ಕಿಶೋರಾವಸ್ಥೆ", "ಗಾಬರಿಗೊಳ್ಳು", "ಗುದ್ದಲಿಪೂಜೆ", "ಜಗಳಗಂಟಿ",
  "ದೂರದರ್ಶಕ", "ದೋಷಾನ್ವೇಷಣೆ", "ಧ್ವನಿಮುದ್ರಣ", "ನಿಯಮಬದ್ಧ", "ನಿರಾಶೆಗೊಳ್ಳು", "ನೆರವಣಿಗೆ", "ಪರಿಷ್ಕರಣೆ",
  "ಪಾಲುಗಾರಿಕೆ", "ಪುನಶ್ಚೇತನ", "ಪೂರ್ವಸೂಚನೆ", "ಪ್ರತಿಷ್ಠಾಪನೆ", "ಮಹತ್ವಾಕಾಂಕ್ಷೆ", "ಮಾತುಗಾರಿಕೆ", "ವಿಶ್ವಮಾನವ",
  "ವೇಗವರ್ಧನೆ", "ಶರಣಾಗತ", "ಸಮಭಾಜಕ", "ಸ್ಥಿತಿಸ್ಥಾಪಕ", "ಚಿಗುರುಮೀಸೆ", "ಕಲಶಪೂಜೆ",
];

/**
 * Deduplicated, alphabetised list of every real, well-formed 5-akshara headword — the *valid
 * guess* dictionary (broader than `WORD_GAME_ANSWERS` on purpose; see module doc comment).
 */
function selectGuessDictionary(entries: DictEntry[], compare: (a: string, b: string) => number): DictEntry[] {
  const haWords = new Set(entries.filter((e) => e.word.startsWith("ಹ")).map((e) => e.word));
  const seen = new Set<string>();
  const candidates: DictEntry[] = [];
  for (const e of [...entries].sort((a, b) => compare(a.word, b.word) || a.id - b.id)) {
    if (seen.has(e.word) || !isWordGameCandidate(e, haWords)) continue;
    seen.add(e.word);
    candidates.push(e);
  }
  return candidates;
}

/**
 * Builds the game's word pool: `words` is `WORD_GAME_ANSWERS` resolved against the real
 * dictionary (so the reveal shows a real Alar sense, and any allowlisted word that turns out not
 * to exist/pass the filter is dropped with a console warning rather than silently kept or
 * crashing the build); `guesses` is every filter-passing 5-akshara headword. `familySizes`/
 * `score`/`windowPick` from `daily.ts` are intentionally unused here now — see module doc comment
 * for why an ordinariness *heuristic* wasn't a substitute for an explicit answer list.
 */
export function selectWordGamePool(
  entries: DictEntry[],
  compare: (a: string, b: string) => number,
): { words: WordGameEntry[]; guesses: string[] } {
  const guessCandidates = selectGuessDictionary(entries, compare);
  const byWord = new Map(guessCandidates.map((e) => [e.word, e]));
  const words: WordGameEntry[] = [];
  for (const w of WORD_GAME_ANSWERS) {
    const e = byWord.get(w);
    if (!e) {
      console.warn(`⚠ wordgame: allowlisted answer "${w}" not found in the filtered candidate set — skipped`);
      continue;
    }
    words.push({ word: e.word, meaning: firstSense(e) });
  }
  words.sort((a, b) => compare(a.word, b.word));
  const guesses = guessCandidates.map((e) => e.word).sort(compare);
  return { words, guesses };
}
