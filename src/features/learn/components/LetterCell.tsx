"use client";

import { useT } from "@/components/providers/AppProviders";
import { toIso15919 } from "@/lib/iso15919";
import { useSpeakKannada } from "@/lib/SpeakContext";

/** One akshara with its ISO 15919 line. Speaks when a Kannada TTS voice exists. */
export function LetterCell({ glyph }: { glyph: string }) {
  const t = useT();
  const speak = useSpeakKannada();
  const inner = (
    <>
      <span className="font-serif text-2xl text-ink" lang="kn">
        {glyph}
      </span>
      <span className="text-xs text-muted" lang="en">
        {toIso15919(glyph)}
      </span>
    </>
  );

  const className =
    "flex min-h-11 w-full flex-col items-center justify-center gap-1 rounded-md border border-line bg-paper px-1 py-2";

  if (!speak) return <div className={className}>{inner}</div>;

  return (
    <button
      type="button"
      className={`${className} hover:border-accent`}
      aria-label={t("speakLetter", { letter: glyph })}
      onClick={() => speak(glyph)}
    >
      {inner}
    </button>
  );
}
