"use client";

import { DiscoveryFilters } from "@/components/ui/DiscoveryFilters";

import { useDiscoveryState } from "@/lib/useDiscoveryState";
import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/components/providers/AppProviders";
import { ReadingFilters } from "@/components/ui/ReadingFilters";
import { isRead, matchesReadingFilter, type ReadingFilter } from "@/lib/readingStatus";
import { useReadingStatus } from "@/lib/useReadingStatus";
import { readProgress } from "../lib/progress";
import { Skeleton } from "@/components/ui/Card";
import { PageTitle } from "@/components/ui/PageTitle";
import { SearchBox } from "@/components/ui/SearchBox";
import { localiseDigits } from "@/features/library/lib/readPercent";
import { availableFilters, filterBooks, filterByQuery } from "../lib/filter";
import type { PicturebookFilter } from "../lib/filter";
import { usePicturebooksManifest } from "../lib/manifest";
import { pickContinue, type PicturebookProgress } from "../lib/progress";
import { PicturebookContinue } from "./PicturebookContinue";
import { PicturebookCredit } from "./PicturebookCredit";
import { PicturebookFilters } from "./PicturebookFilters";
import { PicturebookGrid } from "./PicturebookGrid";
import { PicturebookSaveAll } from "./PicturebookSaveAll";

/**
 * The picture-book shelf: title with "12 books", the Continue card, level/audio filter chips,
 * a search box past 8 books, the cover grid, the save-all footer and the StoryWeaver credit line.
 * With `narrated` set it shows only books with (or without) narration and drops the audio chip,
 * so the ಕೇಳಿ ಓದಿ and ಚಿತ್ರಪುಸ್ತಕಗಳು sections under /children share one set of level chips.
 * `hideTitle` lets a section page draw its own header above it.
 */
export function PicturebooksHub({ narrated, hideTitle = false }: { narrated?: boolean; hideTitle?: boolean } = {}) {
  const { locale, t } = useApp();
  const manifest = usePicturebooksManifest();
  const states = useReadingStatus();
  const [{ visibleCount, reading, filter, query }, update] = useDiscoveryState({ visibleCount: 24, reading: "unread" as ReadingFilter, filter: "all" as PicturebookFilter, query: "" }, Boolean(manifest));
  const setQuery = (query: string) => update({ query, visibleCount: 24 });
  const setReading = (reading: ReadingFilter) => update({ reading, visibleCount: 24 });
  const setFilter = (filter: PicturebookFilter) => update({ filter, visibleCount: 24 });
  const [cacheTick, setCacheTick] = useState(0);
  const [resume, setResume] = useState<{ slug: string; progress: PicturebookProgress } | null>(null);

  const list = useMemo(() => {
    const all = manifest?.books ?? [];
    return narrated === undefined ? all : all.filter((b) => (b.audio !== null) === narrated);
  }, [manifest, narrated]);
  const filters = useMemo(
    () => availableFilters(list).filter((f) => narrated === undefined || f !== "audio"),
    [list, narrated],
  );
  const finished = (slug: string) => {
    const saved = readProgress(slug);
    return isRead(`picturebook:${slug}`, states, Boolean(saved && saved.page >= saved.pageCount - 1));
  };
  const shown = filterByQuery(filterBooks(list, filter), query).filter((book) => matchesReadingFilter(finished(book.slug), reading));
  const continueBook = resume ? list.find((b) => b.slug === resume.slug) : undefined;

  // Progress lives in localStorage; read after mount so server and client markup agree.
  useEffect(() => {
    setResume(pickContinue(list.filter((book) => !finished(book.slug)).map((b) => b.slug)));
  }, [list, states]);

  const detail = list.length > 0 ? t("picturebooksCount", { n: localiseDigits(list.length, locale) }) : undefined;

  return (
    <>
      {!hideTitle && <PageTitle k="picturebooksTitle" sub="picturebooksSub" detail={detail} />}
      {!manifest ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-40" />
          <Skeleton className="h-11" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="aspect-[4/5]" />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {continueBook && resume ? <PicturebookContinue book={continueBook} progress={resume.progress} /> : null}
          {list.length === 0 ? (
            <p className="rule-section py-8 text-base text-secondary">{t("picturebooksEmpty")}</p>
          ) : (
            <>
              {list.length > 8 && (
                <SearchBox value={query} onChange={setQuery} placeholder={t("picturebooksSearch")} aria-label={t("picturebooksSearch")} />
              )}
              <ReadingFilters value={reading} onChange={setReading} />
              <DiscoveryFilters active={filter !== "all"} onReset={() => update({ filter: "all", reading: "unread", query: "", visibleCount: 24 })}><PicturebookFilters filters={filters} value={filter} onChange={setFilter} /><p className="text-base text-secondary">{t("readingLevelHelp")}</p></DiscoveryFilters>
              {shown.length === 0 && <p className="text-secondary text-base py-4">{t(reading === "all" ? "noResults" : "readingEmpty")}</p>}
              <p className="text-base text-muted" aria-live="polite">{t("readingResultCount", { shown: Math.min(visibleCount, shown.length), total: shown.length })}</p>
              <PicturebookGrid books={shown.slice(0, visibleCount)} cacheTick={cacheTick} finished={finished} />
              {visibleCount < shown.length && <button type="button" onClick={() => update({ visibleCount: visibleCount + 24 })} className="min-h-11 rounded-md border border-line p-3 font-semibold text-accent-strong">{t("readingShowMore")}</button>}
              <PicturebookSaveAll books={list} onSaved={() => setCacheTick((n) => n + 1)} />
            </>
          )}
          <PicturebookCredit />
        </div>
      )}
    </>
  );
}
