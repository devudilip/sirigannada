"use client";

import { words } from "../lib/sentences";

export type SentenceState = "past" | "current" | "upcoming";

const TONE: Record<SentenceState, string> = {
  past: "text-muted",
  current: "bg-accent-soft text-ink -mx-2 px-2 rounded-md",
  upcoming: "text-ink",
};

/**
 * One sentence of the story. Each word is an inline button that opens the lookup sheet; tapping
 * the sentence's own padding seeks playback to its start.
 */
export function ReadAlongSentence({
  index,
  text,
  state,
  size,
  onSeek,
  onWord,
}: {
  index: number;
  text: string;
  state: SentenceState;
  size: number;
  onSeek: (index: number) => void;
  onWord: (word: string, index: number) => void;
}) {
  const tokens = words(text);
  return (
    <p
      lang="kn"
      data-index={index}
      aria-current={state === "current" ? "true" : undefined}
      onClick={() => onSeek(index)}
      style={{ fontSize: `${size}px`, lineHeight: 1.8 }}
      className={`font-serif text-pretty py-1 transition-colors duration-150 ${TONE[state]}`}
    >
      {tokens.map((w, i) => (
        <span key={`${index}-${i}`}>
          <button
            type="button"
            lang="kn"
            onClick={(e) => {
              e.stopPropagation();
              onWord(w, index);
            }}
            className="inline appearance-none border-0 bg-transparent p-0 hover:underline focus-visible:underline focus-visible:outline-none"
            style={{ font: "inherit", color: "inherit" }}
          >
            {w}
          </button>
          {i < tokens.length - 1 ? " " : null}
        </span>
      ))}
    </p>
  );
}
