"use client";

import { useT } from "@/components/providers/AppProviders";
import { toIso15919 } from "@/lib/iso15919";
import { useSpeakKannada } from "@/lib/SpeakContext";

/**
 * One akshara on a square surface tile with its ISO 15919 line. Speaks when a Kannada TTS
 * voice exists; pressing turns the tile coral.
 */
export function LetterCell({ glyph }: { glyph: string }) {
  const t = useT();
  const speak = useSpeakKannada();
  const inner = (
    <>
      <span className="font-serif text-xl font-semibold leading-tight" lang="kn">
        {glyph}
      </span>
      <span className="text-2xs text-muted" lang="en">
        {toIso15919(glyph)}
      </span>
    </>
  );

  const className = "flex aspect-square min-h-11 w-full flex-col items-center justify-center gap-0.5 rounded-md border border-line bg-elevated text-ink px-1 py-1";

  if (!speak) return <div className={className}>{inner}</div>;

  return (
    <button
      type="button"
      className={`${className} transition-colors duration-150 hover:bg-paper-edge active:bg-accent active:text-on-accent`}
      aria-label={t("speakLetter", { letter: glyph })}
      onClick={() => speak(glyph)}
    >
      {inner}
    </button>
  );
}
