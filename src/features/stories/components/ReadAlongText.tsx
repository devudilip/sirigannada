"use client";

import { useRef } from "react";
import { useT } from "@/components/providers/AppProviders";
import { useFollowSentence } from "../lib/useFollowSentence";
import { ReadAlongSentence, type SentenceState } from "./ReadAlongSentence";

function stateOf(i: number, current: number): SentenceState {
  if (current < 0 || i > current) return "upcoming";
  return i === current ? "current" : "past";
}

/** The story body: one paragraph per sentence, the spoken one lit, following playback. */
export function ReadAlongText({
  sentences,
  current,
  hasTimings,
  size,
  onSeek,
  onWord,
}: {
  sentences: readonly string[];
  current: number;
  hasTimings: boolean;
  size: number;
  onSeek: (index: number) => void;
  onWord: (word: string, index: number) => void;
}) {
  const t = useT();
  const ref = useRef<HTMLDivElement | null>(null);
  useFollowSentence(current, ref);

  return (
    <div ref={ref} className="flex flex-col gap-3 pt-5">
      {!hasTimings && <p className="rounded-md border border-line bg-elevated px-3 py-2 text-sm text-secondary">{t("readAlongNoTimings")}</p>}
      {sentences.map((s, i) => (
        <ReadAlongSentence key={i} index={i} text={s} state={stateOf(i, current)} size={size} onSeek={onSeek} onWord={onWord} />
      ))}
    </div>
  );
}
