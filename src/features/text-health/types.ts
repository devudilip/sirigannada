export type TextHealthCategory =
  | "normalization"
  | "legacy"
  | "invisible"
  | "spacing"
  | "punctuation"
  | "encoding";

export type TextHealthExplanationKey =
  | "nonNfc"
  | "legacyNudi"
  | "mixedLatin"
  | "latinMatraLeak"
  | "invisibleCharacter"
  | "repeatedWhitespace"
  | "extraBlankLines"
  | "repeatedPunctuation"
  | "encodingMarker"
  | "legacyConversionDamage"
  | "brokenLineWrap";

export interface TextHealthLocation {
  /** UTF-16 offsets, suitable for String.slice and textarea selection ranges. */
  start: number;
  end: number;
  line: number;
  /** One-based UTF-16 column, matching browser textarea selection semantics. */
  column: number;
}

export interface TextHealthFinding {
  id: string;
  category: TextHealthCategory;
  explanationKey: TextHealthExplanationKey;
  explanationData?: Readonly<Record<string, string | number>>;
  location: TextHealthLocation;
  excerpt: string;
  /** Present only when the replacement is deterministic and safe to offer. */
  replacement?: string;
}

export interface TextHealthReport {
  findings: readonly TextHealthFinding[];
  /** True when input or findings exceeded the budget-phone safety limits. */
  truncated: boolean;
}

export type TextHealthMessage = (
  vars?: Readonly<Record<string, string | number>>,
) => string;

export interface TextHealthCopy {
  inputLabel: string;
  inputPlaceholder: string;
  privacyNote: string;
  emptyHint: string;
  healthy: string;
  findingsSummary: TextHealthMessage;
  truncatedNotice: string;
  findingLocation: TextHealthMessage;
  suggestionLabel: string;
  applySuggestion: string;
  copyText: string;
  copied: string;
  categories: Readonly<Record<TextHealthCategory, string>>;
  explanations: Readonly<Record<TextHealthExplanationKey, TextHealthMessage>>;
}
