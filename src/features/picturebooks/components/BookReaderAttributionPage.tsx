"use client";

import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { useT } from "@/components/providers/AppProviders";
import type { PictureBook } from "@/lib/types";

/** Final page, required by CC BY 4.0: the attribution line, source and licence links, image credits. */
export function BookReaderAttributionPage({ book, onReadAgain }: { book: PictureBook; onReadAgain: () => void }) {
  const t = useT();
  const p = book.provenance;

  return (
    <div className="h-full w-full shrink-0 snap-center overflow-y-auto bg-surface flex flex-col items-center px-6 py-10">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
        <h2 className="text-lg font-semibold text-ink">{t("picturebooksAttributionTitle")}</h2>
        <p className="text-base text-ink">{p.attributionLine}</p>
        <p className="text-sm text-secondary">
          <a href={p.source} target="_blank" rel="noopener noreferrer" className="underline hover:text-ink">
            {p.source}
          </a>
        </p>
        <p className="text-sm text-secondary">
          <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="underline hover:text-ink">
            {t("licenseCCBY")}
          </a>
        </p>
        {p.copyrightNotice && <p className="text-sm text-muted">{p.copyrightNotice}</p>}
        {p.imageCredits.length > 0 && (
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold text-ink">{t("picturebooksImageCredits")}</h3>
            <ul className="flex flex-col gap-1 text-sm text-muted">
              {p.imageCredits.map((c) => (
                <li key={c.page}>
                  {c.title} — {c.illustrator} · © {c.holder}, {c.year}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button onClick={onReadAgain}>{t("picturebooksReadAgain")}</Button>
          <LinkButton href="/picturebooks" variant="ghost">
            {t("picturebooksAnotherBook")}
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
