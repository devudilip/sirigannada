"use client";

interface KeyboardKeyProps {
  /** Glyph shown on the key (may differ from `insert`, e.g. a matra shown combined with ಕ). */
  glyph: string;
  /** Text inserted into the search box when the key is pressed. */
  insert: string;
  ariaLabel: string;
  onPress: (insert: string) => void;
}

/**
 * One key of the on-screen Kannada keyboard. `onClick` fires for both mouse
 * clicks and touch taps; `onMouseDown` prevents default so the search input
 * keeps focus (and its cursor position) instead of the key stealing it.
 */
export function KeyboardKey({ glyph, insert, ariaLabel, onPress }: KeyboardKeyProps) {
  return (
    <button
      type="button"
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => onPress(insert)}
      aria-label={ariaLabel}
      lang="kn"
      className="flex min-h-11 min-w-11 items-center justify-center rounded-md border border-line bg-elevated px-1 font-serif text-lg text-ink transition-colors duration-150 hover:border-line-strong hover:bg-paper active:bg-paper-edge"
    >
      {glyph}
    </button>
  );
}
