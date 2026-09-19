import type { Locale, Story } from "@/lib/types";
import { arabicToKannadaDigits } from "@/features/tools/lib/numerals";

/** Title in the UI locale: the English title when reading in English and one exists. */
export function storyTitle(story: Story, locale: Locale): string {
  return locale === "en" && story.titleEn ? story.titleEn : story.title;
}

export function storyCollection(story: Story, locale: Locale): string {
  return story.collection[locale] || story.collection.kn;
}

/** "ಕಥೆ ೩೦" / "Story 30" when the story has a series number, else the collection name. */
export function storyLabel(story: Story, locale: Locale): string {
  if (!story.series) return storyCollection(story, locale);
  return locale === "kn" ? `ಕಥೆ ${arabicToKannadaDigits(String(story.series))}` : `Story ${story.series}`;
}
