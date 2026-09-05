import type { Locale, LocalizedText, PadabandhaEntry } from "@/lib/types";

export type {
  ClueSource,
  LocalizedText,
  PadabandhaDirection,
  PadabandhaEntry,
  PadabandhaPuzzle,
  PadabandhaSet,
} from "@/lib/types";

export interface NumberedEntry extends PadabandhaEntry {
  number: number;
  aksharas: string[];
}

export interface PadabandhaCell {
  row: number;
  column: number;
  answer: string;
  number?: number;
  entryIds: string[];
}

export interface PadabandhaGrid {
  cells: (PadabandhaCell | null)[][];
  entries: NumberedEntry[];
}

export type EntryGuesses = Record<string, string>;

export function localized(text: LocalizedText, locale: Locale): string {
  return text[locale];
}
