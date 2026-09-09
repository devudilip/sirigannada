"use client";

import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { useT } from "@/components/providers/AppProviders";
import { EntryCard } from "@/features/dictionary/components/EntryCard";
import type { SearchResult } from "@/features/dictionary/lib/search";
import { SaveToCollectionButton } from "@/features/collections/components/SaveToCollectionButton";

/**
 * Compact lookup for a word tapped in the read-along: the dictionary hit (an inflected or
 * phonetic match is shown as such by EntryCard), save-to-collection, and "hear again", which
 * replays the sentence the word came from. `result` undefined = still looking up.
 */
export function StoryWordSheet({
  word,
  result,
  onClose,
  onHearAgain,
}: {
  word: string | null;
  result: SearchResult | null | undefined;
  onClose: () => void;
  onHearAgain: () => void;
}) {
  const t = useT();
  const saveWord = result?.entry.word ?? word;

  return (
    <Sheet open={word !== null} onClose={onClose} title={word ?? ""}>
      {result === undefined && <p className="py-4 text-secondary">{t("loading")}</p>}
      {result === null && <p className="py-4 text-secondary">{t("noResults")}</p>}
      {result && <EntryCard entry={result.entry} match={result.match} suffix={result.suffix} compact compactActions />}
      <div className="mt-5 flex items-center gap-2">
        {saveWord && (
          <span className="inline-flex items-center gap-1 rounded-md bg-accent-soft pl-3 text-sm font-semibold text-accent-text">
            {t("readAlongSaveWord")}
            <SaveToCollectionButton item={{ kind: "word", word: saveWord }} />
          </span>
        )}
        <Button variant="secondary" onClick={onHearAgain} data-sheet-initial-focus>
          {t("readAlongHearAgain")}
        </Button>
      </div>
    </Sheet>
  );
}
