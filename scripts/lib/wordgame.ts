/**
 * Word pool for the daily akshara-guess game (roadmap L-05): a hand-picked *answer* list
 * plus a much broader *valid-guess* list. See `WordGamePool` in `src/lib/types.ts`.
 *
 * Requiring exactly five Kannada aksharas produced mostly scholarly compounds: the project's
 * established everyday-word list contains no five-akshara words. L-15 therefore uses familiar
 * two-to-four-akshara answers and lets the UI adapt its columns to today's word.
 *
 * The much larger `isWordGameCandidate`-filtered set (minus the ordinariness scoring/window pick)
 * still has real value as the *valid-guess* dictionary: accepting more real words as input is
 * harmless and good UX (a player typing an obscure-but-real word shouldn't be told it's invalid),
 * it just must never be eligible as the day's answer.
 */
import { splitAksharas } from "../../src/lib/kannada";
import type { DictEntry, PartOfSpeech, WordGameEntry } from "../../src/lib/types";
import { ABSTRACT_NOUN, COMPOUND_END } from "./daily";
import { WORD_GAME_ANSWERS as BASE_WORD_GAME_ANSWERS, WORD_GAME_MEANINGS_EN } from "./wordGameAnswers";
import { EXTRA_WORD_GAME_ANSWERS } from "./wordGameAnswersExtra";
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

export const MIN_WORD_GAME_LENGTH = 2;
export const MAX_WORD_GAME_LENGTH = 4;
const MAX_GUESSES_PER_LENGTH = 2_000;

export const WORD_GAME_ANSWERS = [
  ...BASE_WORD_GAME_ANSWERS.map((answer) => ({
    ...answer,
    meaningEn: WORD_GAME_MEANINGS_EN[answer.word],
  })),
  ...EXTRA_WORD_GAME_ANSWERS,
];

const MAX_DEFS = 24;
const ALLOWED_POS = new Set<PartOfSpeech>(["noun", "verb", "adjective"]);
/** Causative "-ify" verbs (ಸಂಘಟಿಸು, ಪ್ರಚೋದಿಸು…) are common at 5 aksharas but read as technical. */
const CAUSATIVE_VERB = /ಿಸು$/;
/** "-shastra/-shastrajna" ("-science"/"-scientist") academic-discipline compounds. */
const SCHOLARLY_DISCIPLINE = /ಶಾಸ್ತ್ರ(ಜ್ಞ[ೆ]?)?$/;

function firstPos(entry: DictEntry): PartOfSpeech {
  return entry.defs[0]!.pos;
}

/**
 * True if `entry` is a real, well-formed, playable-length word: the same
 * boolean composition `selectDaily` uses for word-of-day, minus the codepoint-length window (a
 * Kannada word can be any number of codepoints) and gated on `splitAksharas` instead. This is
 * a necessary but not sufficient quality bar — see the module doc comment; `selectWordGamePool`
 * additionally ranks and trims what passes here.
 */
export function isWordGameCandidate(entry: DictEntry, haWords: Set<string>): boolean {
  const length = splitAksharas(entry.word).length;
  if (length < MIN_WORD_GAME_LENGTH || length > MAX_WORD_GAME_LENGTH) return false;
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
 * Deduplicated, alphabetised list of every real, well-formed 2–4-akshara headword — the *valid
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

/** Keep the offline pool small while sampling evenly across each length's alphabetised list. */
function sampleGuessDictionary(candidates: readonly DictEntry[]): DictEntry[] {
  const sampled: DictEntry[] = [];
  for (let length = MIN_WORD_GAME_LENGTH; length <= MAX_WORD_GAME_LENGTH; length += 1) {
    const matching = candidates.filter((entry) => splitAksharas(entry.word).length === length);
    if (matching.length <= MAX_GUESSES_PER_LENGTH) {
      sampled.push(...matching);
      continue;
    }
    const step = matching.length / MAX_GUESSES_PER_LENGTH;
    for (let index = 0; index < MAX_GUESSES_PER_LENGTH; index += 1) {
      sampled.push(matching[Math.floor(index * step)]!);
    }
  }
  return sampled;
}

/**
 * Builds the game's word pool: `words` is `WORD_GAME_ANSWERS` resolved against the real
 * dictionary (so every answer is still a real Alar headword, and a missing curated word fails the
 * build rather than silently shrinking the pool); `guesses` is an alphabetically distributed
 * sample of filter-passing playable-length headwords. `familySizes`/
 * `score`/`windowPick` from `daily.ts` are intentionally unused here now — see module doc comment
 * for why an ordinariness *heuristic* wasn't a substitute for an explicit answer list.
 */
export function selectWordGamePool(
  entries: DictEntry[],
  compare: (a: string, b: string) => number,
): { words: WordGameEntry[]; guesses: string[] } {
  const candidates = selectGuessDictionary(entries, compare);
  const byWord = new Map<string, DictEntry>();
  for (const entry of entries) {
    if (!entry.phone || entry.truncated || isTruncatedHeadword(entry.word, entry.phone) || entry.defs.length === 0) continue;
    if (!byWord.has(entry.word)) byWord.set(entry.word, entry);
  }
  const words: WordGameEntry[] = [];
  for (const answer of WORD_GAME_ANSWERS) {
    const e = byWord.get(answer.word);
    if (!e) {
      throw new Error(`wordgame: curated answer "${answer.word}" is missing or invalid`);
    }
    words.push({ word: e.word, meaning: { kn: answer.meaningKn, en: answer.meaningEn } });
  }
  words.sort((a, b) => compare(a.word, b.word));
  const guesses = [...new Set([
    ...sampleGuessDictionary(candidates).map((entry) => entry.word),
    ...words.map((entry) => entry.word),
  ])].sort(compare);
  return { words, guesses };
}
