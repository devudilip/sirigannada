"use client";

import { useContext } from "react";
import { useT } from "@/components/providers/AppProviders";
import { toIso15919 } from "@/lib/iso15919";
import { letterMedia } from "../lib/letterMedia";
import { OpenLetterContext } from "../lib/openLetter";

/**
 * One akshara on a square surface tile with its ISO 15919 line. Pressing opens the letter popup
 * (which plays its sound) and turns the tile coral; letters without open media are plain tiles.
 */
export function LetterCell({ glyph }: { glyph: string }) {
  const t = useT();
  const open = useContext(OpenLetterContext);
  const className = "flex aspect-square min-h-11 w-full flex-col items-center justify-center rounded-md border border-line bg-elevated text-ink px-1 py-1";
  const inner = (
    <>
      <span className="font-serif text-xl font-semibold leading-normal" lang="kn">
        {glyph}
      </span>
      <span className="-mt-1 text-2xs leading-none text-muted" lang="en">
        {toIso15919(glyph)}
      </span>
    </>
  );

  if (!letterMedia(glyph)) return <div className={className}>{inner}</div>;

  return (
    <button
      type="button"
      className={`${className} transition-colors duration-150 hover:bg-paper-edge active:bg-accent-strong active:text-on-accent`}
      aria-label={t("letterSheetOpen", { letter: glyph })}
      aria-haspopup="dialog"
      onClick={() => open(glyph)}
    >
      {inner}
    </button>
  );
}
