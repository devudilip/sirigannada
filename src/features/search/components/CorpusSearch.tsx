"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useApp } from "@/components/providers/AppProviders";
import { SearchBox } from "@/components/ui/SearchBox";
import { localiseDigits } from "@/features/library/lib/readPercent";
import { useBooksManifest } from "@/features/library/lib/useBooksManifest";
import { queryWords, searchCorpus } from "../lib/searchIndex";
import { useSearchIndex } from "../lib/useSearchIndex";
import { BookHitGroup } from "./BookHitGroup";

/** Groups opened on arrival; the rest fetch their book only when tapped. */
const OPEN_GROUPS = 3;
/** Words with many hits across different poets, for the empty state. */
const EXAMPLES = ["ಕೂಡಲಸಂಗಮ", "ಗುಹೇಶ್ವರ", "ಹರಿ", "ಮಳೆ", "ಗುರು"];

export function CorpusSearch() {
  const { locale, t } = useApp();
  const router = useRouter();
  const params = useSearchParams();
  const [query, setQuery] = useState(() => params.get("q") ?? "");
  const deferred = useDeferredValue(query);
  const state = useSearchIndex();
  const manifest = useBooksManifest();

  const hits = useMemo(() => (state.status === "ready" ? searchCorpus(state.index, deferred) : []), [state, deferred]);
  const terms = useMemo(() => queryWords(deferred), [deferred]);
  const total = hits.reduce((n, h) => n + h.blocks.length, 0);
  const hasQuery = terms.length > 0;

  // Shareable URL without a history entry per keystroke, as on the dictionary page.
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed === (params.get("q") ?? "")) return;
    router.replace(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search", { scroll: false });
  }, [query, params, router]);

  let status = t("corpusSearchHint");
  if (state.status === "loading") status = t("corpusSearchLoading");
  else if (state.status === "missing") status = t("corpusSearchUnavailable");
  else if (hasQuery && total === 0) status = t("corpusSearchNoResults");
  else if (hasQuery) status = t("corpusSearchCount", { n: localiseDigits(total, locale), books: localiseDigits(hits.length, locale) });

  return (
    <div className="flex flex-col gap-4">
      <SearchBox
        value={query}
        onChange={setQuery}
        size="lg"
        placeholder={t("corpusSearchPlaceholder")}
        aria-label={t("corpusSearchPlaceholder")}
      />
      <p className="text-sm text-muted" aria-live="polite">{status}</p>
      {!hasQuery && state.status === "ready" && (
        <div>
          <p className="mb-2 text-sm text-secondary">{t("trySearches")}</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((word) => (
              <button
                key={word}
                type="button"
                onClick={() => setQuery(word)}
                className="min-h-11 rounded-full border border-line-strong px-4 font-serif text-base text-ink hover:bg-elevated"
                lang="kn"
              >
                {word}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="flex flex-col gap-2">
        {hits.map((hit, i) => (
          <BookHitGroup
            key={`${deferred}\u0000${hit.slug}`}
            slug={hit.slug}
            meta={manifest?.books.find((b) => b.slug === hit.slug)}
            blocks={hit.blocks}
            terms={terms}
            initiallyOpen={i < OPEN_GROUPS}
          />
        ))}
      </div>
    </div>
  );
}
