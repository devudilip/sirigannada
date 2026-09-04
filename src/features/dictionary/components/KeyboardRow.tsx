"use client";

import { useT } from "@/components/providers/AppProviders";
import { KeyboardKey } from "./KeyboardKey";

interface KeyboardRowProps {
  title: string;
  letters: readonly string[];
  onPress: (insert: string) => void;
  /** Optional glyph shown on each key, when it differs from the inserted text (e.g. a matra shown as ಕ + sign). */
  display?: (letter: string) => string;
}

/** One labelled group of keys, e.g. vowels or a consonant varga. */
export function KeyboardRow({ title, letters, onPress, display }: KeyboardRowProps) {
  const t = useT();
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted">{title}</span>
      <div className="flex flex-wrap gap-1.5">
        {letters.map((letter) => {
          const glyph = display ? display(letter) : letter;
          return (
            <KeyboardKey
              key={letter}
              glyph={glyph}
              insert={letter}
              ariaLabel={t("kbdInsertLetter", { letter: glyph })}
              onPress={onPress}
            />
          );
        })}
      </div>
    </div>
  );
}
