import { splitAksharas } from "@/lib/kannada";
import { clamp } from "./time";

/** 0–100 percent of `duration` played; 0 when the duration is unknown. */
export function percentOf(position: number, duration: number): number {
  if (!Number.isFinite(duration) || duration <= 0) return 0;
  return clamp((position / duration) * 100, 0, 100);
}

/** Seconds at `percent` of `duration`, clamped into range. */
export function secondsAt(percent: number, duration: number): number {
  if (!Number.isFinite(duration) || duration <= 0) return 0;
  return clamp((clamp(percent, 0, 100) / 100) * duration, 0, duration);
}

/** Seconds left, as a non-positive number so `formatClock` renders "−4:12". */
export function remaining(position: number, duration: number): number {
  return -Math.max(0, duration - position);
}

/** Track background: gold up to `percent`, paper-edge after. Tokens only, no literal colours. */
export function trackBackground(percent: number): string {
  const p = clamp(percent, 0, 100).toFixed(2);
  return `linear-gradient(to right, var(--sg-gold) 0%, var(--sg-gold) ${p}%, var(--sg-paper-edge) ${p}%, var(--sg-paper-edge) 100%)`;
}

/** First akshara of a title for the typographic art placeholder; the first character otherwise. */
export function firstAkshara(title: string): string {
  const word = title.trim().split(/\s+/)[0] ?? "";
  return splitAksharas(word)[0] ?? [...word][0] ?? "";
}
