import type { StringKey } from "@/lib/i18n";

/** One row in the ottakshara (conjunct) teaching list. */
export interface OttaksharaExample {
  conjunct: string;
  word: string;
  glossKey: StringKey;
}

export interface OttaksharaGroup {
  titleKey: StringKey;
  examples: readonly OttaksharaExample[];
}

export interface LetterGroup {
  titleKey: StringKey;
  letters: readonly string[];
}
