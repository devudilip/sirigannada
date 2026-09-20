"use client";

import Link from "next/link";
import { DestinationLink } from "@/components/ui/DestinationLink";
import { useApp } from "@/components/providers/AppProviders";
import type { ChildStory, StoryCollection } from "../types";
import { StoryArt } from "./StoryArt";

export function ChildrenShelf({ collections, stories, collection }: {
  collections: StoryCollection[];
  stories: ChildStory[];
  collection?: StoryCollection;
}) {
  const { locale, t } = useApp();
  return (
    <div className="mx-auto max-w-5xl px-4 pt-8 pb-12">
      {collection && <Link href="/children" className="inline-flex min-h-11 items-center text-accent">{t("childrenTitle")}</Link>}
      <h1 className="font-serif text-3xl font-bold text-ink">{collection?.title[locale] ?? t("childrenTitle")}</h1>
      <p className="mt-3 text-lg text-secondary">{collection?.description[locale] ?? t("childrenSub")}</p>
      <h2 className="mt-8 mb-4 text-xl font-semibold">{t(collection ? "childrenStories" : "childrenCollections")}</h2>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(collection ? stories.filter((s) => s.collection === collection.slug) : collections).map((item) => {
          const story = "scenes" in item ? item : stories.find((s) => s.collection === item.slug);
          return (
            <li key={item.slug}>
              <Link href={"scenes" in item ? `/children/${item.collection}/${item.slug}` : `/children/${item.slug}`}
                className="block rounded-lg border border-line bg-paper p-4 hover:border-accent">
                {story && <StoryArt image={story.image} panel={0} alt={story.scenes[0]?.imageAlt ?? story.title.kn} />}
                <h3 className="mt-4 font-serif text-xl font-semibold text-ink">{item.title[locale]}</h3>
                <p className="mt-2 text-base text-secondary">{"scenes" in item ? item.teaser[locale] : item.description[locale]}</p>
                {"scenes" in item && <p className="mt-3 text-base text-accent">{t("childrenRead")} · {t("childrenAge", { age: item.age })}</p>}
              </Link>
            </li>
          );
        })}
      </ul>
      {!collection && <div className="mt-8"><DestinationLink href="/picturebooks" titleKey="navPicturebooks" subKey="picturebooksSub" /></div>}
    </div>
  );
}
