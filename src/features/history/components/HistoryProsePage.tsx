"use client";

import type { TextSize } from "@/features/picturebooks/lib/textSize";
import { PAGE } from "./HistoryTitlePage";

/** A text-only page (ಪೀಠಿಕೆ, ಸಾರಾಂಶ): a heading and the Kannada paragraphs at the chosen size. */
export function HistoryProsePage({ id, heading, paragraphs, size }: { id: string; heading: string; paragraphs: string[]; size: TextSize }) {
  return (
    <section aria-labelledby={`${id}-title`} className={`${PAGE} pt-14`} lang="kn">
      <div className="mx-auto max-w-2xl px-6 pt-8 pb-reader-bar">
        <h2 id={`${id}-title`} className="font-serif text-2xl font-semibold text-ink">{heading}</h2>
        <div className="mt-4 font-serif text-ink" style={{ fontSize: `${size}px`, lineHeight: 1.8 }}>
          {paragraphs.map((paragraph, i) => (
            <p key={i} className={`text-pretty ${i === 0 ? "" : "indent-8"}`}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
