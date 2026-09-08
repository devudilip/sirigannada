"use client";

export type KeyStatus = "correct" | "present" | "absent";

/** Tints for keys already tried in the word game — same fills as the grid tiles. */
const STATUS_CLASS: Record<KeyStatus, string> = {
  correct: "bg-accent text-on-accent",
  present: "bg-ink text-surface",
  absent: "bg-neutral text-ink",
};

interface KeyboardKeyProps {
  /** Glyph shown on the key (may differ from `insert`, e.g. a matra shown combined with ಕ). */
  glyph: string;
  /** Text inserted into the search box when the key is pressed. */
  insert: string;
  ariaLabel: string;
  onPress: (insert: string) => void;
  /** Word-game feedback for this key, if it has been guessed. */
  status?: KeyStatus;
  /** 1 px ink outline — the vowel-sign keys and ⌫ use it. */
  outlined?: boolean;
}

/**
 * One key of the on-screen Kannada keyboard: 42 px tall, square, surface fill, serif glyph.
 * `onClick` fires for both mouse clicks and touch taps; `onMouseDown` prevents default so the
 * input keeps focus (and its cursor position) instead of the key stealing it.
 */
export function KeyboardKey({ glyph, insert, ariaLabel, onPress, status, outlined = false }: KeyboardKeyProps) {
  const fill = status
    ? STATUS_CLASS[status]
    : `bg-elevated text-ink hover:bg-paper-edge active:bg-paper-edge ${outlined ? "border border-ink" : ""}`;
  return (
    <button
      type="button"
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => onPress(insert)}
      aria-label={ariaLabel}
      lang="kn"
      className={`flex h-10.5 min-w-11 items-center justify-center px-1 font-serif text-base transition-colors duration-150 ${fill}`}
    >
      {glyph}
    </button>
  );
}
