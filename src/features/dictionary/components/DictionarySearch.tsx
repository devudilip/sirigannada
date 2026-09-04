"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type SyntheticEvent } from "react";
import { SearchBox } from "@/components/ui/SearchBox";
import { Skeleton } from "@/components/ui/Card";
import { IconButton } from "@/components/ui/Button";
import { KeyboardIcon } from "@/components/icons";
import { useT } from "@/components/providers/AppProviders";
import { hasKannada, normalise } from "@/lib/kannada";
import { useSearch } from "../lib/useSearch";
import { useSavedLists } from "../lib/useSavedLists";
import { headwordFromParams } from "../lib/permalink";
import { backspaceAtCursor, insertAtCursor } from "../lib/insertAtCursor";
import { DidYouMean } from "./DidYouMean";
import { SearchEmptyState } from "./SearchEmptyState";
import { SearchResults } from "./SearchResults";
import { KannadaKeyboard } from "./KannadaKeyboard";

export function DictionarySearch() {
  const t = useT();
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(() => headwordFromParams((k) => params.get(k)));
  const [cursor, setCursor] = useState<number | null>(null);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const { results, suggestions, loading } = useSearch(q);
  const { history, favourites, rememberSearch, clearHistory, toggleStar } = useSavedLists();

  // Track the search input's caret so on-screen-keyboard keys insert where the
  // user last placed it, instead of always appending to the end of the query.
  const captureCursor = (event: SyntheticEvent<HTMLInputElement>) => setCursor(event.currentTarget.selectionStart);

  const insertText = (text: string) => {
    const result = insertAtCursor(q, text, cursor);
    setQ(result.text);
    setCursor(result.cursor);
  };

  const backspace = () => {
    const result = backspaceAtCursor(q, cursor);
    setQ(result.text);
    setCursor(result.cursor);
  };

  // Keep the URL shareable without adding history entries on every keystroke.
  // Permalink `w` stays until the user changes the query.
  useEffect(() => {
    const trimmed = q.trim();
    const permalink = normalise(params.get("w") ?? "");
    const currentQ = params.get("q") ?? "";
    if (trimmed && trimmed === permalink) return;
    if (trimmed === currentQ) return;
    const url = trimmed ? `/dictionary?q=${encodeURIComponent(trimmed)}` : "/dictionary";
    router.replace(url, { scroll: false });
  }, [q, params, router]);

  // Remember finished lookups: exact Kannada headword, or a Latin query that returned hits.
  useEffect(() => {
    const trimmed = q.trim();
    if (!trimmed || loading) return;
    const exact = results.some(({ entry }) => entry.word === trimmed);
    const latinHit = results.length > 0 && !hasKannada(trimmed);
    if (!exact && !latinHit) return;
    rememberSearch(trimmed);
  }, [q, loading, results, rememberSearch]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <SearchBox
              value={q}
              onChange={(v) => {
                setQ(v);
                setCursor(null);
              }}
              size="lg"
              autoFocus
              onSelect={captureCursor}
              onClick={captureCursor}
              onKeyUp={captureCursor}
              onFocus={captureCursor}
            />
          </div>
          <IconButton
            onClick={() => setKeyboardOpen((v) => !v)}
            aria-label={keyboardOpen ? t("kbdCloseKeyboard") : t("kbdOpenKeyboard")}
            aria-pressed={keyboardOpen}
          >
            <KeyboardIcon size={20} />
          </IconButton>
        </div>
        <p className="mt-2 text-sm text-muted">{t("searchHint")}</p>
        <KannadaKeyboard
          open={keyboardOpen}
          onInsert={insertText}
          onBackspace={backspace}
          onClose={() => setKeyboardOpen(false)}
        />
      </div>

      {loading && results.length === 0 && (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      )}

      {!loading && q.trim() && results.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-8">
          <p className="text-secondary text-base text-center">{t("noResults")}</p>
          <DidYouMean words={suggestions} onPick={setQ} />
        </div>
      )}

      {results.length > 0 && (
        <SearchResults
          key={normalise(q)}
          results={results}
          favourites={favourites}
          onToggleFavourite={toggleStar}
        />
      )}

      {!q.trim() && (
        <>
          <SearchEmptyState
            history={history}
            favourites={favourites}
            onPick={setQ}
            onClearHistory={clearHistory}
            onToggleStar={toggleStar}
          />
          <p className="text-xs text-muted">{t("dictCredit")}</p>
        </>
      )}
    </div>
  );
}
