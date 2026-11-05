import { ContinueReading } from "@/features/home/components/ContinueReading";
import { DailyProverb } from "@/features/home/components/DailyProverb";
import { Hero } from "@/features/home/components/Hero";
import { ExploreGrid } from "@/features/home/components/ExploreGrid";
import { HomeRow } from "@/features/home/components/HomeRow";
import { HomeShelf } from "@/features/home/components/HomeShelf";
import { TodayBlock } from "@/features/home/components/TodayBlock";
import { PicturebooksShelf } from "@/features/picturebooks/components/PicturebooksShelf";
import { readChildStories, storyUrl } from "@/features/children/lib/catalog";
import { readStoriesManifest } from "@/features/stories/lib/readManifest";

/** Search, resume, choose a destination, then discover daily activities and reading. */
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
      <div className="flex flex-col gap-10 pt-6 md:pt-10">
        <Hero />
        <ContinueReading />
        <ExploreGrid />
        <div className="grid lg:grid-cols-2 gap-8">
          <TodayBlock />
          <DailyProverb />
        </div>
        <PicturebooksShelf lead={lead} leadCount={children.length} />
        <HomeShelf />
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
