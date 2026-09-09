"use client";

import Link from "next/link";
import { ChevronDownIcon } from "@/components/icons";
import { useT } from "@/components/providers/AppProviders";
import type { TextSize } from "../lib/textSize";

/**
 * Sticky top strip: collapse back to the player, story title over a "ಓದಿ ಕೇಳಿ · Aa 22" kicker,
 * and the Aa control that cycles the body size. Sits below the desktop top bar (h-16).
 */
export function ReadAlongHeader({ slug, title, size, onCycleSize }: { slug: string; title: string; size: TextSize; onCycleSize: () => void }) {
  const t = useT();
  return (
    <header className="sticky top-0 md:top-16 z-20 -mx-5 px-5 bg-surface border-b border-line">
      <div className="flex items-center gap-2 py-2">
        <Link
          href={`/stories/${slug}`}
          aria-label={t("playerCollapse")}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-md text-ink hover:bg-elevated active:bg-paper-edge"
        >
          <ChevronDownIcon size={24} />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 lang="kn" className="truncate font-serif text-base font-semibold text-ink">
            {title}
          </h1>
          <p className="kicker text-muted">
            {t("readAlongTitle")} · Aa {size}
          </p>
        </div>
        <button
          type="button"
          onClick={onCycleSize}
          aria-label={`${t("readAlongTextSize")} · ${size}`}
          className="inline-flex h-11 min-w-11 shrink-0 items-center justify-center rounded-md border border-line-strong bg-elevated px-3 font-serif text-base font-semibold text-ink hover:border-ink active:bg-paper-edge"
        >
          Aa
        </button>
      </div>
    </header>
  );
}
