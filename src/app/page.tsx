import { ContinueReading } from "@/features/home/components/ContinueReading";
import { DailyProverb } from "@/features/home/components/DailyProverb";
import { Hero } from "@/features/home/components/Hero";
import { FeaturedBook } from "@/features/home/components/FeaturedBook";
import { ExploreGrid } from "@/features/home/components/ExploreGrid";
import { HomeShelf } from "@/features/home/components/HomeShelf";
import { TodayBlock } from "@/features/home/components/TodayBlock";
import { PicturebooksShelf } from "@/features/picturebooks/components/PicturebooksShelf";
import { readChildStories, storyUrl } from "@/features/children/lib/catalog";

/** Search, resume, choose a destination, then discover daily activities and reading. */
export default function HomePage() {
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
      <div className="grid lg:grid-cols-5 gap-12 md:gap-16 pt-6 md:pt-12">
        <div className="lg:col-span-3 self-center"><Hero /><div className="mt-6"><ContinueReading /></div></div>
        <div className="lg:col-span-2"><FeaturedBook /></div>
        <div className="lg:col-span-5"><ExploreGrid /></div>
        <div className="lg:col-span-5 grid lg:grid-cols-2 gap-8">
          <TodayBlock />
          <DailyProverb />
        </div>
        <div className="lg:col-span-5"><PicturebooksShelf lead={lead} leadCount={children.length} /></div>
        <div className="lg:col-span-5"><HomeShelf /></div>
      </div>
    </div>
  );
}
