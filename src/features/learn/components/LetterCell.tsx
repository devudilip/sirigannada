import { toIso15919 } from "@/lib/iso15919";

/** One akshara with its ISO 15919 line. No images — glyph + Latin only. */
export function LetterCell({ glyph }: { glyph: string }) {
  return (
    <div className="flex min-h-11 flex-col items-center justify-center gap-1 rounded-md border border-line bg-paper px-1 py-2">
      <span className="font-serif text-2xl text-ink" lang="kn">
        {glyph}
      </span>
      <span className="text-xs text-muted" lang="en">
        {toIso15919(glyph)}
      </span>
    </div>
  );
}
