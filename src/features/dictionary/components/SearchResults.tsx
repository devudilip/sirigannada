"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useT } from "@/components/providers/AppProviders";
import type { SearchResult } from "../lib/search";
import { groupSearchResults } from "../lib/resultGroups";
import { EntryCard } from "./EntryCard";
import { RelatedRow } from "./RelatedRow";

const INITIAL_RELATED_COUNT = 3;

interface SearchResultsProps {
  results: SearchResult[];
  favourites: string[];
  onToggleFavourite: (word: string) => void;
}

/** The pinned answer card(s) first, then related matches as expandable rows on 1 px rules. */
export function SearchResults({ results, favourites, onToggleFavourite }: SearchResultsProps) {
  const t = useT();
  const relatedId = useId();
  const [expanded, setExpanded] = useState(false);
  const { answers, related } = groupSearchResults(results);
  const shownRelated = expanded ? related : related.slice(0, INITIAL_RELATED_COUNT);
  const hiddenCount = related.length - shownRelated.length;

  return (
    <div className="flex flex-col gap-6" aria-live="polite">
      {answers.length > 0 && (
        <section aria-label={t("dictBestMatches")} className="flex flex-col gap-3">
          {answers.map(({ entry, match, suffix }) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              match={match}
              suffix={suffix}
              favourited={favourites.includes(entry.word)}
              onToggleFavourite={() => onToggleFavourite(entry.word)}
            />
          ))}
        </section>
      )}

      {related.length > 0 && (
        <section aria-labelledby={`${relatedId}-heading`}>
          <div className="rule-section flex items-baseline justify-between gap-4 pt-3">
            <h2 id={`${relatedId}-heading`} className="kicker text-accent-strong">
              {t("dictRelated")}
              <span className="text-muted"> · {related.length}</span>
            </h2>
            <span className="kicker text-muted">{t("dictWhyMatched")}</span>
          </div>
          <ul id={relatedId} className="mt-2 flex flex-col">
            {shownRelated.map((result) => (
              <RelatedRow key={result.entry.id} result={result} />
            ))}
          </ul>
          {related.length > INITIAL_RELATED_COUNT && (
            <div className="rule-row">
              <Button
                variant="ghost"
                className="-ml-4"
                aria-expanded={expanded}
                aria-controls={relatedId}
                onClick={() => setExpanded((value) => !value)}
              >
                {expanded ? t("dictShowLess") : `${t("dictShowMore", { count: hiddenCount })} ↓`}
              </Button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
