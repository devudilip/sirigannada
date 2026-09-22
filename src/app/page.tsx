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
  const lead = first && { href: storyUrl(first), image: first.image, alt: first.scenes[0]?.imageAlt ?? first.title.kn, title: first.title.kn };
  return (
    <div className="mx-auto max-w-6xl px-5 md:px-10 pb-12">
      <HomeHeader />
      <div className="flex flex-col gap-10 md:grid md:grid-cols-12 md:grid-rows-[auto_1fr] md:gap-x-6 md:gap-y-10">
        <div className="md:col-span-7 md:row-start-1">
          <Hero />
        </div>
        <div className="flex flex-col gap-8 md:col-span-4 md:col-start-9 md:row-span-2 md:row-start-1 md:border-l-2 md:border-line-strong md:pl-6 md:pt-10">
          <ContinueReading />
          <TodayBlock />
          <DailyProverb />
        </div>
        <div className="flex flex-col gap-10 md:col-span-7 md:col-start-1 md:row-start-2">
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
