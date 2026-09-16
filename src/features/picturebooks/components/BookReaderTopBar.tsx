"use client";

import Link from "next/link";
import { ChevronLeftIcon } from "@/components/icons";
import { useT } from "@/components/providers/AppProviders";
import type { TextSize } from "../lib/textSize";

/** Thin top bar, always visible: back to the hub, the book's title, and the Aa control. */
export function BookReaderTopBar({ title, size, onCycleSize }: { title: string; size: TextSize; onCycleSize: () => void }) {
  const t = useT();
  return (
    <header className="fixed inset-x-0 top-0 z-30 flex items-center gap-2 bg-surface/95 backdrop-blur border-b border-line px-2 py-2">
      <Link
        href="/picturebooks"
        aria-label={t("picturebooksBack")}
        className="inline-flex h-11 shrink-0 items-center gap-1 rounded-full border border-line-strong bg-elevated pl-2 pr-4 text-ink hover:border-ink active:bg-paper-edge"
      >
        <ChevronLeftIcon size={22} />
        <span className="text-sm font-semibold" lang="kn">{t("picturebooksTitle")}</span>
      </Link>
      <h1 lang="kn" className="min-w-0 flex-1 truncate font-serif text-sm font-semibold text-ink">
        {title}
      </h1>
      <button
        type="button"
        onClick={onCycleSize}
        aria-label={`${t("readAlongTextSize")} · ${size}`}
        className="inline-flex h-11 min-w-11 shrink-0 items-center justify-center rounded-full border border-line-strong bg-elevated px-3 font-serif text-base font-semibold text-ink hover:border-ink active:bg-paper-edge"
      >
        Aa
      </button>
    </header>
  );
}
