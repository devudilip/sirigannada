"use client";

import { useEffect, useRef } from "react";
import type { Story } from "@/lib/types";
import { sentenceAt } from "../lib/sentences";

/**
 * Desktop companion column: the story's sentences as reading paragraphs, the one being spoken
 * tinted coral-soft and kept in view. The full read-along view lives at /stories/[slug]/read.
 */
export function StoryTextPreview({ story, position, onSeek }: { story: Story; position: number; onSeek: (sec: number) => void }) {
  const sentences = story.sentences ?? [];
  const timings = story.timings ?? [];
  const current = timings.length === sentences.length ? sentenceAt(timings, position) : -1;
  const activeRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [current]);

  if (sentences.length === 0) return null;

  return (
    <div className="font-serif text-[22px] leading-[1.8] text-ink" lang="kn">
      <p>
        {sentences.map((s, i) => {
          const active = i === current;
          const seekable = timings[i] !== undefined;
          return (
            <span
              key={i}
              ref={active ? activeRef : undefined}
              onClick={seekable ? () => onSeek(timings[i] ?? 0) : undefined}
              className={`rounded-md px-1 -mx-1 transition-colors duration-150 ${active ? "bg-accent-soft text-accent-text" : ""} ${seekable ? "cursor-pointer" : ""}`}
            >
              {s}{" "}
            </span>
          );
        })}
      </p>
    </div>
  );
}
