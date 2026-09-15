"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { useApp } from "@/components/providers/AppProviders";
import { localiseDigits } from "@/features/library/lib/readPercent";

/**
 * Always-visible page indicator ("೩ / ೧೫") on a 4 px gold progress bar, plus 56 px prev/next
 * corner buttons on phones — big enough for a child's thumb; hidden on md+ where ← → work.
 */
export function BookReaderBottomBar({
  page,
  total,
  onPrev,
  onNext,
}: {
  page: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  const { locale, t } = useApp();
  const percent = total > 1 ? (page / (total - 1)) * 100 : 0;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 safe-bottom">
      <span aria-hidden="true" className="block h-1 w-full bg-paper-edge">
        <span className="block h-full bg-gold transition-[width] duration-200" style={{ width: `${percent}%` }} />
      </span>
      <div className="flex items-center justify-between px-3 py-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={page === 0}
          aria-label={t("prevPage")}
          className="md:hidden inline-flex size-14 items-center justify-center rounded-full bg-elevated border border-line-strong shadow-elevated text-ink disabled:opacity-30"
        >
          <ChevronLeftIcon size={26} />
        </button>
        <span aria-live="polite" className="flex-1 text-center text-sm font-semibold tabular-nums text-ink" lang={locale}>
          {t("playerOf", { n: localiseDigits(page + 1, locale), total: localiseDigits(total, locale) })}
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={page === total - 1}
          aria-label={t("nextPage")}
          className="md:hidden inline-flex size-14 items-center justify-center rounded-full bg-elevated border border-line-strong shadow-elevated text-ink disabled:opacity-30"
        >
          <ChevronRightIcon size={26} />
        </button>
      </div>
    </div>
  );
}
