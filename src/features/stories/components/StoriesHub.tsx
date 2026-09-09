"use client";

import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/components/providers/AppProviders";
import { Skeleton } from "@/components/ui/Card";
import { PageTitle } from "@/components/ui/PageTitle";
import { localiseDigits } from "@/features/library/lib/readPercent";
import { availableFilters, filterStories, totalDuration } from "../lib/filter";
import { useStoriesManifest } from "../lib/manifest";
import { pickContinue, type StoryPosition } from "../lib/positions";
import { playable } from "../lib/queue";
import { formatTotal } from "../lib/time";
import type { StoryFilter } from "../types";
import { StoryContinue } from "./StoryContinue";
import { StoryFilters } from "./StoryFilters";
import { StoryPending } from "./StoryPending";
import { StoryRow } from "./StoryRow";
import { StorySaveAll } from "./StorySaveAll";

/**
 * The /stories shelf: title with "24 stories · 3 h 10 min", the Continue card, filter chips,
 * one row per playable story, the save-all footer, and the pending-permission note.
 */
export function StoriesHub() {
  const { locale, t } = useApp();
  const manifest = useStoriesManifest();
  const [filter, setFilter] = useState<StoryFilter>("all");
  const [cacheTick, setCacheTick] = useState(0);
  const [resume, setResume] = useState<{ slug: string; position: StoryPosition } | null>(null);

  const list = useMemo(() => playable(manifest?.stories ?? []), [manifest]);
  const filters = useMemo(() => availableFilters(list), [list]);
  const shown = useMemo(() => filterStories(list, filter), [list, filter]);
  const continueStory = resume ? list.find((s) => s.slug === resume.slug) : undefined;

  // Positions live in localStorage; read after mount so server and client markup agree.
  useEffect(() => {
    setResume(pickContinue(list.map((s) => s.slug)));
  }, [list]);

  const detail =
    list.length > 0
      ? t("storiesCount", { n: localiseDigits(list.length, locale), total: formatTotal(totalDuration(list), locale) })
      : undefined;

  return (
    <>
      <PageTitle k="storiesTitle" sub="storiesSub" detail={detail} />
      {!manifest ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-40" />
          <Skeleton className="h-11" />
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {continueStory && resume ? <StoryContinue story={continueStory} position={resume.position} list={list} /> : null}
          {list.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <StoryFilters filters={filters} value={filter} onChange={setFilter} />
              <ul className="rule-section">
                {shown.map((story) => (
                  <li key={story.slug}>
                    <StoryRow story={story} list={list} cacheTick={cacheTick} />
                  </li>
                ))}
              </ul>
              <StorySaveAll stories={list} onSaved={() => setCacheTick((n) => n + 1)} />
            </>
          )}
          <StoryPending pending={manifest.pending} />
        </div>
      )}
    </>
  );
}

function EmptyState() {
  const { t } = useApp();
  return <p className="rule-section py-8 text-base text-secondary">{t("storiesEmpty")}</p>;
}
