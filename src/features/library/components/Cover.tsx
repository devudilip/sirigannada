import type { Locale } from "@/lib/types";
import { coverFromSlug, firstAkshara } from "../lib/coverFromSlug";
import { CoverPattern } from "./CoverPattern";

const SCHEME = {
  paper: {
    bg: "bg-paper",
    spine: "bg-accent",
    title: "text-ink",
    titleAlt: "text-accent",
    sub: "text-secondary",
    pattern: "text-accent",
    patternAlt: "text-ink",
  },
  accent: {
    bg: "bg-accent",
    spine: "bg-ink",
    title: "text-on-accent",
    titleAlt: "text-on-accent",
    sub: "text-on-accent/80",
    pattern: "text-on-accent",
    patternAlt: "text-paper",
  },
  ink: {
    bg: "bg-ink",
    spine: "bg-accent",
    title: "text-paper",
    titleAlt: "text-paper",
    sub: "text-paper/80",
    pattern: "text-paper",
    patternAlt: "text-accent",
  },
} as const;

/**
 * Typographic book cover: slug-hashed pattern in accent / paper / ink,
 * title and author as live text. No image assets.
 */
export function Cover({
  slug,
  title,
  author,
  era,
  lang,
}: {
  slug: string;
  title: string;
  author: string;
  era: string;
  lang: Locale;
}) {
  const spec = coverFromSlug(slug);
  const pal = SCHEME[spec.scheme];
  const titleClass = spec.altTone ? pal.titleAlt : pal.title;
  const patternClass = spec.altTone ? pal.patternAlt : pal.pattern;

  return (
    <span className={`relative flex h-full w-full min-w-0 ${pal.bg}`}>
      <span aria-hidden="true" className={`w-2.5 shrink-0 ${pal.spine}`} />
      <span className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <CoverPattern spec={spec} id={`cover-${slug}`} className={patternClass} />
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute -right-1 -bottom-2 select-none font-serif text-3xl leading-none opacity-20 scale-150 origin-bottom-right ${titleClass}`}
        >
          {firstAkshara(title)}
        </span>
        <span className="relative z-10 flex h-full min-w-0 flex-col justify-between p-4">
          <span className="flex min-w-0 flex-col gap-1">
            <span className={`font-serif font-semibold text-lg leading-snug line-clamp-3 ${titleClass}`} lang={lang}>
              {title}
            </span>
            <span className={`truncate text-sm ${pal.sub}`}>{author}</span>
          </span>
          <span className={`text-xs ${pal.sub}`}>{era}</span>
        </span>
      </span>
    </span>
  );
}
