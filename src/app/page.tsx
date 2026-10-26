import { ContinueReading } from "@/features/home/components/ContinueReading";
import { DailyProverb } from "@/features/home/components/DailyProverb";
import { Hero } from "@/features/home/components/Hero";
import { HomeHeader } from "@/features/home/components/HomeHeader";
import { HomeRow } from "@/features/home/components/HomeRow";
import { HomeShelf } from "@/features/home/components/HomeShelf";
import { TodayBlock } from "@/features/home/components/TodayBlock";
import { PicturebooksShelf } from "@/features/picturebooks/components/PicturebooksShelf";
import { readChildStories, storyUrl } from "@/features/children/lib/catalog";
import { readStoriesManifest } from "@/features/stories/lib/readManifest";

/**
 * Home: search leads, then what you were reading, today's games, today's proverb, the children's
 * shelf, the classics shelf, and two rows. Nothing here needs the network beyond the precached books manifest and proverbs file.
 */
export default function HomePage() {
  // The audio-story shelf stays unlinked until at least one licensed recording ships.
  const hasStories = readStoriesManifest().stories.length > 0;
  const children = readChildStories();
  const first = children[0];
  const lead = first && {
    href: storyUrl(first),
    image: first.image,
    alt: first.scenes[0]?.imageAlt ?? first.title.kn,
    title: first.title.kn,
  };
  return (
    <div className="mx-auto max-w-7xl px-6 min-[1033px]:px-10 pb-12">
      <HomeHeader />
      <div className="flex flex-col gap-10 min-[1033px]:grid min-[1033px]:grid-cols-12 min-[1033px]:grid-rows-[auto_1fr] min-[1033px]:gap-x-6 min-[1033px]:gap-y-10">
        <div className="min-[1033px]:col-span-7 min-[1033px]:row-start-1">
          <Hero />
        </div>
        <div className="flex flex-col gap-8 min-[1033px]:col-span-4 min-[1033px]:col-start-9 min-[1033px]:row-span-2 min-[1033px]:row-start-1 min-[1033px]:border-l-2 min-[1033px]:border-line-strong min-[1033px]:pl-6 min-[1033px]:pt-10">
          <ContinueReading />
          <TodayBlock />
          <DailyProverb />
        </div>
        <div className="flex flex-col gap-10 min-[1033px]:col-span-7 min-[1033px]:col-start-1 min-[1033px]:row-start-2">
          <PicturebooksShelf lead={lead} leadCount={children.length} />
          <HomeShelf />
        </div>
      </div>
      <ul className="mt-10">
        <li>
          {hasStories && <HomeRow href="/stories" titleKey="navStories" subKey="homeStoriesSub" />}
        </li>
        <li>
          <HomeRow href="/proverbs" titleKey="proverbsTitle" subKey="homeProverbsSub" />
        </li>
        <li>
          <HomeRow href="/learn" titleKey="learnTitle" subKey="homeLearnSub" />
        </li>
      </ul>
    </div>
  );
}
