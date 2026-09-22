"use client";

import Link from "next/link";
import { useApp } from "@/components/providers/AppProviders";
import type { ChildStory, StoryCollection } from "../types";
import { storyUrl } from "../lib/storyUrl";
import { ChildrenSectionHeader } from "./ChildrenSectionHeader";
import { StoryArt } from "./StoryArt";

/** A story section (e.g. ಪಂಚತಂತ್ರ): its header, then one art-led card per illustrated story. */
export function ChildrenShelf({ collection, stories }: { collection: StoryCollection; stories: ChildStory[] }) {
  const { locale, t } = useApp();
  const own = stories.filter((s) => s.collection === collection.slug);
  return (
    <div className="mx-auto max-w-5xl px-5 pt-8 pb-12">
      <ChildrenSectionHeader collection={collection} count={own.length} />
      <h2 className="mb-4 text-xl font-semibold">{t("childrenStories")}</h2>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {own.map((story) => (
          <li key={story.slug}>
            <Link href={storyUrl(story)} className="block rounded-lg border border-line bg-paper p-4 transition-colors hover:border-accent active:bg-paper-edge">
              <StoryArt image={story.image} panel={0} alt={story.scenes[0]?.imageAlt ?? story.title.kn} />
              <h3 className="mt-4 font-serif text-xl font-semibold text-ink" lang={locale}>{story.title[locale]}</h3>
              <p className="mt-2 text-base text-secondary" lang={locale}>{story.teaser[locale]}</p>
              <p className="mt-3 text-base text-accent">{t("childrenRead")} · {t("childrenAge", { age: story.age })}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
