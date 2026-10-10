"use client";

import { useApp } from "@/components/providers/AppProviders";
import type { TextSize } from "@/features/picturebooks/lib/textSize";
import { toKannadaDigits } from "@/lib/kannada";
import type { HistoryScene } from "../types";
import { PAGE } from "./HistoryTitlePage";

/**
 * One scene: the 16:9 picture full width, the scene number and title, and the paragraphs.
 * The evidence and the invented lines are not shown here; they are collected on the
 * ಇದು ಕಥೆ, ಇದು ಇತಿಹಾಸ page near the end so the reading is uninterrupted (owner direction, 2026-10-10).
 */
export function HistoryScenePage({ scene, index, size }: { scene: HistoryScene; index: number; size: TextSize }) {
  const { locale } = useApp();
  return (
    <section aria-labelledby={`${scene.id}-title`} className={`${PAGE} pt-14`} lang="kn">
      <div className="bg-elevated">
        <img src={scene.image} alt={scene.imageAlt[locale]} width={1280} height={720} loading="lazy" decoding="async" className="mx-auto aspect-video w-full max-w-4xl object-cover" />
      </div>
      <div className="mx-auto max-w-2xl px-6 pt-6 pb-reader-bar">
        <p className="font-serif text-base text-muted">{toKannadaDigits(index + 1)}</p>
        <h2 id={`${scene.id}-title`} className="font-serif text-2xl font-semibold text-ink">{scene.title}</h2>
        <div className="mt-4 font-serif text-ink" style={{ fontSize: `${size}px`, lineHeight: 1.8 }}>
          {scene.paragraphs.map((paragraph, i) => (
            <p key={i} className={`text-pretty ${i === 0 ? "" : "indent-8"}`}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
