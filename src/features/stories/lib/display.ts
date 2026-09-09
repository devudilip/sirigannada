import type { Locale, Story } from "@/lib/types";

/** Title in the UI locale: the English title when reading in English and one exists. */
export function storyTitle(story: Story, locale: Locale): string {
  return locale === "en" && story.titleEn ? story.titleEn : story.title;
}

export function storyCollection(story: Story, locale: Locale): string {
  return story.collection[locale] || story.collection.kn;
}
