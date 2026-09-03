"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useT } from "@/components/providers/AppProviders";
import type { SearchResult } from "../lib/search";
import { groupSearchResults } from "../lib/resultGroups";
import { EntryCard } from "./EntryCard";

const INITIAL_RELATED_COUNT = 4;

interface SearchResultsProps {
  results: SearchResult[];
  favourites: string[];
  onToggleFavourite: (word: string) => void;
}

export function SearchResults({ results, favourites, onToggleFavourite }: SearchResultsProps) {
  const t = useT();
  const relatedId = useId();
  const [expanded, setExpanded] = useState(false);
  const { answers, related } = groupSearchResults(results);
  const shownRelated = expanded ? related : related.slice(0, INITIAL_RELATED_COUNT);
  const hiddenCount = related.length - shownRelated.length;

  const cards = (items: SearchResult[]) => (
    <ul className="flex flex-col gap-3">
      {items.map(({ entry, match }) => (
        <li key={entry.id}>
          <EntryCard
            entry={entry}
            match={match}
            favourited={favourites.includes(entry.word)}
            onToggleFavourite={() => onToggleFavourite(entry.word)}
          />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="flex flex-col gap-6" aria-live="polite">
      {answers.length > 0 && (
        <section aria-labelledby={`${relatedId}-answers`} className="flex flex-col gap-3">
          <h2 id={`${relatedId}-answers`} className="text-base font-medium text-ink">
            {t("dictBestMatches")}
          </h2>
          {cards(answers)}
        </section>
      )}

      {related.length > 0 && (
        <section aria-labelledby={`${relatedId}-related`} className="flex flex-col gap-3">
          <h2 id={`${relatedId}-related`} className="text-base font-medium text-secondary">
            {t("dictRelatedMatches")}
          </h2>
          <div id={relatedId}>{cards(shownRelated)}</div>
          {related.length > INITIAL_RELATED_COUNT && (
            <Button
              variant="secondary"
              className="self-start"
              aria-expanded={expanded}
              aria-controls={relatedId}
              onClick={() => setExpanded((value) => !value)}
            >
              {expanded ? t("dictShowLess") : t("dictShowMore", { count: hiddenCount })}
            </Button>
          )}
        </section>
      )}
    </div>
  );
}
