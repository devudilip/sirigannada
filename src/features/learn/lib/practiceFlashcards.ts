import { makeRng, seededShuffle } from "./practiceRandom";

/**
 * Builds the review order for a favourites flashcard session: every saved word, shuffled with
 * the given seed. Pure — the meaning side of each card is looked up separately (async, from the
 * dictionary shards) by the component, since that needs a network-free fetch of local JSON.
 */
export function buildFlashcardDeck(words: readonly string[], seed: number): string[] {
  return seededShuffle(words, makeRng(seed));
}
