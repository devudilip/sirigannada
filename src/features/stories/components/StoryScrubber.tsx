"use client";

import { useState, type ChangeEvent } from "react";
import { useT } from "@/components/providers/AppProviders";
import { formatClock } from "../lib/time";
import { percentOf, remaining, secondsAt, trackBackground } from "../lib/scrubber";

const thumb =
  "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:rounded-[4px] [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:cursor-pointer " +
  "[&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-[4px] [&::-moz-range-thumb]:bg-accent [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer";

/**
 * Seek bar: a 4 px track with a gold played portion and a 20 px coral thumb. While the user
 * drags, the bar shows the drag position locally and commits with `onSeek` on release.
 */
export function StoryScrubber({
  position,
  duration,
  onSeek,
}: {
  position: number;
  duration: number;
  onSeek: (seconds: number) => void;
}) {
  const t = useT();
  const [drag, setDrag] = useState<number | null>(null);
  const shown = drag ?? position;
  const percent = percentOf(shown, duration);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => setDrag(secondsAt(Number(e.target.value), duration));
  const commit = () => {
    if (drag === null) return;
    onSeek(drag);
    setDrag(null);
  };

  return (
    <div className="mt-6">
      <input
        type="range"
        min={0}
        max={100}
        step={0.1}
        value={percent}
        onChange={onChange}
        onPointerUp={commit}
        onKeyUp={commit}
        onTouchEnd={commit}
        aria-label={t("playerSeek")}
        aria-valuetext={formatClock(shown)}
        style={{ background: trackBackground(percent) }}
        className={`block w-full h-1 my-2.5 appearance-none rounded-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${thumb}`}
      />
      <div className="flex justify-between text-sm text-muted tabular-nums" aria-hidden="true">
        <span>{formatClock(shown)}</span>
        <span>{formatClock(remaining(shown, duration))}</span>
      </div>
    </div>
  );
}
