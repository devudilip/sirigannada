"use client";

import { useT } from "@/components/providers/AppProviders";
import { KeyboardKey, type KeyStatus } from "./KeyboardKey";

interface KeyboardRowProps {
  title: string;
  letters: readonly string[];
  onPress: (insert: string) => void;
  /** Optional glyph shown on each key, when it differs from the inserted text (e.g. a matra shown as ಕ + sign). */
  display?: (letter: string) => string;
  /** Per-letter word-game feedback, keyed by the inserted text. */
  statuses?: Readonly<Record<string, KeyStatus>>;
  /** Outline every key in this row (vowel signs). */
  outlined?: boolean;
}

/** One labelled group of keys, e.g. vowels or a consonant varga. */
export function KeyboardRow({ title, letters, onPress, display, statuses, outlined = false }: KeyboardRowProps) {
  const t = useT();
  return (
    <div className="flex flex-col gap-1">
      <span className="kicker text-muted">{title}</span>
      <div className="flex flex-wrap gap-1">
        {letters.map((letter) => {
          const glyph = display ? display(letter) : letter;
          return (
            <KeyboardKey
              key={letter}
              glyph={glyph}
              insert={letter}
              ariaLabel={t("kbdInsertLetter", { letter: glyph })}
              onPress={onPress}
              status={statuses?.[letter]}
              outlined={outlined}
            />
          );
        })}
      </div>
    </div>
  );
}
