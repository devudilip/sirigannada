"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useT } from "@/components/providers/AppProviders";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Card";
import { useBook } from "@/features/reader/lib/useBook";
import { versePermalinkPath } from "@/features/reader/lib/versePermalink";
import { hitSnippets } from "../lib/hitSnippets";

const PER_PAGE = 5;

/** Snippets for one book's hits. Mounting it fetches the book, so groups mount it only when open. */
export function BookHitList({ slug, blocks, terms }: { slug: string; blocks: readonly number[]; terms: readonly string[] }) {
  const t = useT();
  const state = useBook(slug);
  const [visible, setVisible] = useState(PER_PAGE);
  const shown = useMemo(
    () => (state.status === "ready" ? hitSnippets(state.book, blocks.slice(0, visible), terms) : []),
    [state, blocks, visible, terms],
  );

  if (state.status === "loading") return <Skeleton className="h-24" />;
  if (state.status === "missing") return <p className="py-3 text-base text-secondary">{t("corpusSearchBookOffline")}</p>;

  const remaining = Math.min(PER_PAGE * 4, blocks.length - visible);
  return (
    <div className="flex flex-col gap-2">
      <ol className="flex flex-col divide-y divide-line">
        {shown.map((hit) => (
          <li key={hit.block}>
            <Link
              href={versePermalinkPath(slug, hit.block)}
              className="flex min-h-11 flex-col gap-1 py-3 hover:bg-elevated active:bg-paper-edge"
              lang="kn"
            >
              <span className="text-sm text-muted">{hit.chapterTitle}</span>
              <span className="font-serif text-base leading-relaxed text-ink">{hit.snippet}</span>
            </Link>
          </li>
        ))}
      </ol>
      {remaining > 0 && (
        <Button variant="secondary" onClick={() => setVisible((n) => n + remaining)}>
          {t("readerSearchShowMore", { count: remaining })}
        </Button>
      )}
    </div>
  );
}
