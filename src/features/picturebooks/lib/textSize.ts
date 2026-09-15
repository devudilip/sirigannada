import { readStorage, writeStorage } from "@/lib/storage";

/** Reader body sizes in px; the Aa control cycles through them and wraps. */
export const TEXT_SIZES = [18, 22, 26] as const;
export type TextSize = (typeof TEXT_SIZES)[number];
export const DEFAULT_TEXT_SIZE: TextSize = 22;
export const TEXT_SIZE_KEY = "picturebook:textSize";

export function isTextSize(value: unknown): value is TextSize {
  return (TEXT_SIZES as readonly unknown[]).includes(value);
}

/** The size after `size` in the cycle; unknown sizes restart at the default. */
export function nextTextSize(size: number): TextSize {
  const i = (TEXT_SIZES as readonly number[]).indexOf(size);
  if (i < 0) return DEFAULT_TEXT_SIZE;
  return TEXT_SIZES[(i + 1) % TEXT_SIZES.length] ?? DEFAULT_TEXT_SIZE;
}

export function readTextSize(): TextSize {
  const saved = readStorage<unknown>(TEXT_SIZE_KEY, DEFAULT_TEXT_SIZE);
  return isTextSize(saved) ? saved : DEFAULT_TEXT_SIZE;
}

export function writeTextSize(size: TextSize): void {
  writeStorage<TextSize>(TEXT_SIZE_KEY, size);
}
