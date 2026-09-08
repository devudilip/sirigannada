"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useApp } from "@/components/providers/AppProviders";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CANONICAL_ORIGIN } from "@/features/reader/lib/versePermalink";
import { ShareCardSheet } from "@/features/share/components/ShareCardSheet";
import { dailyProverb } from "@/features/proverbs/lib/dailyProverb";
import { loadProverbs } from "@/features/proverbs/lib/load";
import type { Proverb } from "@/features/proverbs/types";

/**
 * ಇಂದಿನ ಗಾದೆ · Proverb of the day. Same proverb for everyone on a given local date, chosen from
 * the precached proverbs file, so it works offline and never needs a server. Owner-requested
 * (2026-09-09); see roadmap F-09.
 */
export function DailyProverb() {
  const { t } = useApp();
  const [proverb, setProverb] = useState<Proverb | null>(null);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    const now = new Date();
    loadProverbs().then((file) => {
      if (alive && file) setProverb(dailyProverb(now, file.proverbs));
    });
    return () => {
      alive = false;
    };
  }, []);

  if (!proverb) return null;
  const firstWord = proverb.text.replace(/^[^ಀ-೿]+/, "").split(/\s+/)[0] ?? "";
  const action = "inline-flex min-h-11 items-center text-sm font-semibold text-accent-strong hover:underline";

  return (
    <section>
      <SectionHeading k="homeDailyProverb" href="/proverbs" linkKey="proverbsTitle" />
      <blockquote className="bg-elevated border-t-[3px] border-gold p-4">
        <p className="font-serif text-xl leading-kannada text-ink" lang="kn">
          {proverb.text}
        </p>
        <p className="mt-2 text-xs text-muted" lang="en">
          {t("homeDailyProverbSource")}
        </p>
        <div className="mt-2 flex flex-wrap gap-x-5">
          {firstWord && (
            <Link href={`/dictionary?q=${encodeURIComponent(firstWord)}`} className={action}>
              {t("proverbWords")} →
            </Link>
          )}
          <button type="button" onClick={() => setShareOpen(true)} className={action}>
            {t("proverbShare")}
          </button>
        </div>
      </blockquote>
      <ShareCardSheet
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        input={
          shareOpen
            ? { kind: "gade", main: proverb.text, url: `${CANONICAL_ORIGIN}/proverbs`, source: "Wikiquote", size: "portrait" }
            : null
        }
      />
    </section>
  );
}
