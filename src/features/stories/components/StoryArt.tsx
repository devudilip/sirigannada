import { splitAksharas } from "@/lib/kannada";
import { arabicToKannadaDigits } from "@/features/tools/lib/numerals";
import type { Story } from "@/lib/types";

type Size = "sm" | "md" | "lg";

const sizes: Record<Size, { box: string; glyph: string }> = {
  sm: { box: "size-10 rounded-md", glyph: "text-xl" },
  md: { box: "size-18 rounded-md", glyph: "text-3xl" },
  lg: { box: "size-30 rounded-lg", glyph: "text-[40px]" },
};

/**
 * Square story art at 40 / 72 / 120 px: the manifest's image when there is one, else a typographic
 * placeholder — the series number in Kannada digits (a child can find "೩೦" again), or the title's
 * first akshara when there is no number. Decorative — the surrounding row or card already carries
 * the title, so it is hidden from assistive tech.
 */
export function StoryArt({ story, size, className = "" }: { story: Story; size: Size; className?: string }) {
  const s = sizes[size];
  if (story.art) {
    return (
      <span aria-hidden="true" className={`block shrink-0 overflow-hidden ${s.box} bg-elevated border border-line ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element -- same-origin static asset, no optimiser in static export */}
        <img src={story.art} alt="" className="block size-full object-cover" loading="lazy" />
      </span>
    );
  }
  const akshara = story.series ? arabicToKannadaDigits(String(story.series)) : (splitAksharas(story.title.trim())[0] ?? story.title.charAt(0));
  const glyph = story.series && story.series > 9 ? (size === "sm" ? "text-base" : size === "md" ? "text-2xl" : "text-[36px]") : s.glyph;
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center ${s.box} bg-elevated border border-line font-serif font-semibold leading-none text-accent-strong ${glyph} ${className}`}
      lang="kn"
    >
      {akshara}
    </span>
  );
}
