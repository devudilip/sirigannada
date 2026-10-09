"use client";

import type { MouseEvent } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { useT } from "@/components/providers/AppProviders";
import { IconButton } from "@/components/ui/Button";
import type { Locale } from "@/lib/types";
import { splitAksharas } from "@/lib/kannada";
import type { NumberedEntry } from "../types";
import { localized } from "../types";

const keepFocus = (event: MouseEvent) => event.preventDefault();

/**
 * The selected clue, right above the answer box: ◀ ▶ step through the clues without scrolling,
 * and a row of small squares mirrors the entry's cells so typing stays visible under a phone keyboard.
 */
export function PadabandhaClueBar({
  entry,
  guess,
  locale,
  onPrev,
  onNext,
}: {
  entry: NumberedEntry;
  guess: string;
  locale: Locale;
  onPrev: () => void;
  onNext: () => void;
}) {
  const t = useT();
  const letters = splitAksharas(guess);
  const fromAlar = entry.clueSource === "alar";
  return (
    <div>
      <div className="flex items-start gap-1">
        <IconButton onMouseDown={keepFocus} onClick={onPrev} aria-label={t("padabandhaPrevClue")} className="shrink-0 border border-line-strong">
          <ChevronLeftIcon size={20} />
        </IconButton>
        <div className="min-w-0 flex-1 px-1">
          <p className="text-sm font-semibold text-secondary">
            {t("padabandhaClueHeading", {
              number: entry.number,
              direction: t(entry.direction === "across" ? "padabandhaAcross" : "padabandhaDown"),
              count: entry.aksharas.length,
            })}
          </p>
          <p lang={fromAlar ? "en" : locale} className="text-base text-ink">{localized(entry.clue, locale)}</p>
          {fromAlar && <p className="mt-1 text-xs text-muted">{t("padabandhaAlarClue")}</p>}
        </div>
        <IconButton onMouseDown={keepFocus} onClick={onNext} aria-label={t("padabandhaNextClue")} className="shrink-0 border border-line-strong">
          <ChevronRightIcon size={20} />
        </IconButton>
      </div>
      <div aria-hidden="true" className="mt-3 flex flex-wrap gap-1">
        {entry.aksharas.map((_, index) => (
          <span
            key={index}
            lang="kn"
            className="flex size-11 items-center justify-center border border-line-strong bg-surface font-serif text-lg text-ink"
          >
            {letters[index] ?? ""}
          </span>
        ))}
      </div>
    </div>
  );
}
