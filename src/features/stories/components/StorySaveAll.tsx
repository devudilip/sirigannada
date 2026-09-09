"use client";

import { useEffect, useState } from "react";
import { CheckIcon, DownloadIcon } from "@/components/icons";
import { useApp } from "@/components/providers/AppProviders";
import { Button } from "@/components/ui/Button";
import { localiseDigits } from "@/features/library/lib/readPercent";
import type { Story } from "@/lib/types";
import { isStoryCached, saveStoryOffline } from "../lib/offline";
import { saveAll } from "../lib/saveAll";

type Phase = "checking" | "idle" | "saving" | "done";

/**
 * "Save all N for offline": saves every playable story one after another, announcing "Saving · 3 of 24"
 * as it goes. Shows the all-saved line instead of the button when every story is already cached.
 * Calls `onSaved` after each successful save so rows can re-read the cache.
 */
export function StorySaveAll({ stories, onSaved }: { stories: Story[]; onSaved: () => void }) {
  const { locale, t } = useApp();
  const [phase, setPhase] = useState<Phase>("checking");
  const [done, setDone] = useState(0);
  const [failed, setFailed] = useState<string[]>([]);
  const total = stories.length;

  useEffect(() => {
    let alive = true;
    void Promise.all(stories.map(isStoryCached)).then((flags) => {
      if (alive) setPhase(flags.length > 0 && flags.every(Boolean) ? "done" : "idle");
    });
    return () => {
      alive = false;
    };
  }, [stories]);

  // A retry after a partial failure only fetches what is still missing.
  const targets = failed.length > 0 ? stories.filter((s) => failed.includes(s.slug)) : stories;

  const start = async () => {
    setPhase("saving");
    setDone(0);
    const missed = await saveAll(
      targets,
      async (story) => {
        const ok = await saveStoryOffline(story);
        if (ok) onSaved();
        return ok;
      },
      (n) => setDone(n),
    );
    setFailed(missed);
    setPhase(missed.length === 0 ? "done" : "idle");
  };

  if (phase === "checking" || total === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {phase === "done" ? (
        <p className="inline-flex items-center gap-2 text-base text-ink">
          <CheckIcon size={20} />
          {t("storiesAllSaved")}
        </p>
      ) : (
        <Button variant="secondary" size="lg" onClick={start} disabled={phase === "saving"} className="w-full sm:w-auto">
          <DownloadIcon size={20} />
          {t("storiesSaveAll", { n: localiseDigits(targets.length, locale) })}
        </Button>
      )}
      <p className="text-sm text-muted min-h-5" aria-live="polite">
        {phase === "saving" ? t("storiesSaving", { done: localiseDigits(done, locale), total: localiseDigits(targets.length, locale) }) : ""}
      </p>
    </div>
  );
}
