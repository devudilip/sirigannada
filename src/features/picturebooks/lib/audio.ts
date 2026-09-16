import type { PictureBook, Story } from "@/lib/types";

/**
 * Adapts an audio picture book into a `Story` so the app's one audio player (mini-player,
 * lock-screen controls, position memory) can play its narration unchanged. Only meaningful for
 * a book with `audio`; callers gate on that before offering play controls. Takes the full book
 * (from <slug>.json): the Story carries provenance, which manifest entries omit.
 */
export function bookAsStory(book: PictureBook): Story {
  return {
    slug: book.slug,
    title: book.title,
    titleEn: book.titleEn,
    collection: { kn: `ಹಂತ ${book.level}`, en: `Level ${book.level}` },
    tags: [],
    durationSec: book.audio?.durationSec ?? 0,
    audio: book.audio?.src ?? null,
    audioBytes: book.audio?.bytes,
    art: book.cover.src,
    provenance: {
      source: book.provenance.source,
      license: book.provenance.license,
      licenseNote: book.provenance.licenseNote,
      retrieved: book.provenance.retrieved,
      narrator: book.provenance.narrator,
      publisher: book.provenance.publisher,
    },
  };
}
