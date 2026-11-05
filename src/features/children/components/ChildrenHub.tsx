"use client";

import Link from "next/link";
import { VolumeIcon } from "@/components/icons";
import { useApp } from "@/components/providers/AppProviders";
import { PageTitle } from "@/components/ui/PageTitle";
import { localiseDigits } from "@/features/library/lib/readPercent";
import type { StringKey } from "@/lib/i18n";
import type { HubSection } from "../types";
import { sectionUrl } from "../lib/sections";
import { StoryArt } from "./StoryArt";

const HUB_SUMMARIES: Record<string, StringKey> = {
  panchatantra: "childrenHubPanchatantra",
  janapada: "childrenHubFolk",
  "keli-odi": "childrenHubListen",
  picturebooks: "childrenHubPictures",
};

/**
 * /children: one big card per section (ಪಂಚತಂತ್ರ, ಕೇಳಿ ಓದಿ, ಚಿತ್ರಪುಸ್ತಕಗಳು …) in collections.json
 * order. Phones stack the cards as picture-led rows so all sections fit on one screen; md+ shows
 * them side by side. The whole card is the tap target and the art carries the meaning.
 */
export function ChildrenHub({ sections }: { sections: HubSection[] }) {
  const { t } = useApp();
  return (
    <div className="mx-auto max-w-5xl px-5 pt-8 pb-12">
      <PageTitle k="childrenTitle" sub="childrenSub" showBack={false} />
      <h2 className="mt-8 mb-4 text-lg font-semibold">
        {t("childrenCollections")}
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
        {sections.map((section) => (
          <li key={section.collection.slug}>
            <SectionCard section={section} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function SectionCard({ section }: { section: HubSection }) {
  const { locale, t } = useApp();
  const { collection, count } = section;
  const summaryKey = HUB_SUMMARIES[collection.slug];
  const narrated = collection.kind === "picturebooks" && collection.narrated;
  const countLabel =
    collection.kind === "stories"
      ? count === 1
        ? t("childrenStoryOne")
        : t("childrenStoryCount", { n: localiseDigits(count, locale) })
      : t("picturebooksCount", { n: localiseDigits(count, locale) });
  return (
    <Link
      href={sectionUrl(collection.slug)}
      className="flex h-full min-w-0 items-center gap-3 sm:flex-col sm:items-stretch rounded-lg border border-line bg-elevated p-3 md:p-4 transition-colors hover:border-accent active:bg-paper-edge md:flex-col md:items-stretch md:gap-0"
    >
      <span className="w-20 shrink-0 sm:w-full">
        {section.story ? (
          <StoryArt
            image={section.story.image}
            panel={0}
            alt={section.story.alt}
          />
        ) : (
          <CoverFan covers={section.covers} />
        )}
      </span>
      <span className="flex min-w-0 flex-1 flex-col sm:mt-4">
        <span
          className="block font-serif text-lg font-semibold break-words leading-snug text-ink md:text-xl"
          lang={locale}
        >
          {collection.title[locale]}
        </span>
        <span
          className="mt-1 block text-base text-secondary md:mt-2"
          lang={locale}
        >
          {summaryKey ? t(summaryKey) : collection.description[locale]}
        </span>
        <span
          className="mt-2 inline-flex items-center gap-1.5 self-start text-base font-semibold text-accent-strong md:mt-auto md:pt-3"
          lang={locale}
        >
          {narrated && <VolumeIcon size={18} />}
          {countLabel}
        </span>
      </span>
    </Link>
  );
}

/** Three covers fanned like a small stack of books, in a square so it sits level with story art. */
function CoverFan({ covers }: { covers: string[] }) {
  const poses = [
    "translate(-50%, -50%) translateX(-42%) rotate(-8deg)",
    "translate(-50%, -50%) translateY(4%)",
    "translate(-50%, -50%) translateX(42%) rotate(8deg)",
  ];
  return (
    <span
      aria-hidden="true"
      className="relative block aspect-square w-full overflow-hidden rounded-lg bg-elevated"
    >
      {covers.map((src, i) => (
        <span
          key={src}
          className="absolute left-1/2 top-1/2 block w-[52%] overflow-hidden rounded-md shadow-elevated"
          style={{ transform: poses[i], zIndex: i === 1 ? 2 : 1 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- same-origin static asset, no optimiser in static export */}
          <img
            src={src}
            alt=""
            className="block aspect-[4/5] w-full object-cover"
            loading="lazy"
          />
        </span>
      ))}
    </span>
  );
}
