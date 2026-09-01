import type { Book } from "@/lib/types";
import { pageOfOffset } from "./flipMath";

/**
 * Maps between global block indices and pages using the hidden measuring flow
 * (which is laid out identically to the visible pages but never translated).
 */
export function pageOfBlock(flow: HTMLElement | null, block: number, stride: number): number {
  if (!flow) return 0;
  const el = flow.querySelector<HTMLElement>(`[data-b="${block}"]`);
  return el ? pageOfOffset(el.offsetLeft, stride) : 0;
}

export function firstBlockOnPage(flow: HTMLElement | null, page: number, stride: number): number {
  if (!flow) return 0;
  const els = flow.querySelectorAll<HTMLElement>("[data-b]");
  let last = 0;
  for (const el of els) {
    const p = pageOfOffset(el.offsetLeft, stride);
    const b = Number(el.dataset.b);
    if (p === page) return b;
    if (p > page) return last;
    last = b;
  }
  return last;
}

/** Global block index where each chapter starts. */
export function chapterStarts(book: Book): number[] {
  const starts: number[] = [];
  let n = 0;
  for (const ch of book.chapters) {
    starts.push(n);
    n += ch.blocks.length;
  }
  return starts;
}

export function chapterOfBlock(starts: number[], block: number): number {
  let idx = 0;
  for (let i = 0; i < starts.length; i++) if ((starts[i] ?? 0) <= block) idx = i;
  return idx;
}
