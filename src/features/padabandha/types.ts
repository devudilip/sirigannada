import type { Locale } from "@/lib/types";

export type PadabandhaDirection = "across" | "down";

export interface LocalizedText {
  kn: string;
  en: string;
}

export interface PadabandhaEntry {
  id: string;
  answer: string;
  clue: LocalizedText;
  row: number;
  column: number;
  direction: PadabandhaDirection;
}

export interface PadabandhaPuzzle {
  id: string;
  title: LocalizedText;
  rows: number;
  columns: number;
  entries: readonly PadabandhaEntry[];
  provenance: {
    creator: LocalizedText;
    license: "CC-BY-SA-4.0";
  };
}

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
