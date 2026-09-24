"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@/components/icons";
import { useApp } from "@/components/providers/AppProviders";
import { localiseDigits } from "@/features/library/lib/readPercent";
import type { BookMeta } from "@/lib/types";
import { BookHitList } from "./BookHitList";

interface BookHitGroupProps {
  slug: string;
  meta: BookMeta | undefined;
  blocks: readonly number[];
  terms: readonly string[];
  initiallyOpen: boolean;
}

/** One book's results: a header with the hit count that opens or closes its snippet list. */
export function BookHitGroup({ slug, meta, blocks, terms, initiallyOpen }: BookHitGroupProps) {
  const { locale, t } = useApp();
  const [open, setOpen] = useState(initiallyOpen);
  const title = meta?.title ?? slug;
  const listId = `hits-${slug}`;

  return (
    <section className="rule-section pt-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={listId}
        aria-label={open ? undefined : t("corpusSearchShowMatches", { title })}
        className="flex min-h-14 w-full items-center justify-between gap-4 py-2 text-left hover:bg-elevated"
      >
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="font-serif text-lg font-semibold leading-snug text-ink" lang="kn">{title}</span>
          <span className="text-sm text-secondary">
            {meta?.author && <span lang="kn">{meta.author} · </span>}
            {t("corpusSearchMatches", { n: localiseDigits(blocks.length, locale) })}
          </span>
        </span>
        <ChevronDownIcon size={20} className={`shrink-0 text-ink transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <div id={listId}>{open && <BookHitList slug={slug} blocks={blocks} terms={terms} />}</div>
    </section>
  );
}
