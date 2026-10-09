"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type SyntheticEvent } from "react";
import { SearchBox } from "@/components/ui/SearchBox";
import { Skeleton } from "@/components/ui/Card";
import { IconButton } from "@/components/ui/Button";
import { KeyboardIcon } from "@/components/icons";
import { useT } from "@/components/providers/AppProviders";
import { normalise } from "@/lib/kannada";
import { resultCountLabel } from "../lib/search";
import { useSearch } from "../lib/useSearch";
import { useSavedLists } from "../lib/useSavedLists";
import { headwordFromParams } from "../lib/permalink";
import { lookupToRemember } from "../lib/savedLists";
import { backspaceAtCursor, insertAtCursor } from "../lib/insertAtCursor";
import { DidYouMean } from "./DidYouMean";
import { DownloadDictionaryButton } from "./DownloadDictionaryButton";
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
  // A query the reader explicitly asked for (Enter, a tapped chip/suggestion, a ?w= permalink),
  // waiting for its results to settle before it may enter recent searches.
  const [committed, setCommitted] = useState<string | null>(() => normalise(params.get("w") ?? "") || null);
  const { results, suggestions, loading, settledQuery } = useSearch(q);
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

  // Recent searches record explicit acts only. Live results update on every (debounced) keystroke,
  // including each tap on the on-screen keyboard, so a settled query is not a lookup: saving those
  // filled history with single letters and half-typed words. A query is remembered when the reader
  // presses Enter, taps a suggestion or recent/example chip, or lands on a ?w= permalink (all via
  // `committed`, checked once its own results arrive), or expands a related result (`onOpenEntry`).
  // `pushHistory` additionally drops anything a single akshara long.
  useEffect(() => {
    if (!committed) return;
    if (q.trim() !== committed) {
      setCommitted(null);
      return;
    }
    if (loading || settledQuery !== committed) return;
    const word = lookupToRemember(committed, results);
    if (word) rememberSearch(word);
    setCommitted(null);
  }, [committed, q, loading, settledQuery, results, rememberSearch]);

  const pick = (word: string) => {
    setQ(word);
    setCursor(null);
    setCommitted(word.trim() || null);
  };

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
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.nativeEvent.isComposing) setCommitted(q.trim() || null);
              }}
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

      {/* Kept mounted (not conditionally rendered) so screen readers reliably announce text
          changes on this live region — only its content should change, never its presence. */}
      <p className="text-sm text-muted" role="status" aria-live="polite">
        {q.trim() && !loading ? resultCountLabel(t, results.length) : ""}
      </p>

      {!loading && q.trim() && results.length === 0 && suggestions.length > 0 && (
        <div className="flex flex-col items-center gap-4 py-8">
          <DidYouMean words={suggestions} onPick={pick} />
        </div>
      )}

      {results.length > 0 && (
        <SearchResults
          results={results}
          favourites={favourites}
          onToggleFavourite={toggleStar}
          onOpenEntry={rememberSearch}
        />
      )}

      {!q.trim() && (
        <>
          <SearchEmptyState
            history={history}
            favourites={favourites}
            onPick={pick}
            onClearHistory={clearHistory}
            onToggleStar={toggleStar}
          />
          <p className="text-xs text-muted">{t("dictCredit")}</p>
        </>
      )}

      <DownloadDictionaryButton />
    </div>
  );
}
