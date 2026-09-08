import { ContinueReading } from "@/features/home/components/ContinueReading";
import { Hero } from "@/features/home/components/Hero";
import { HomeHeader } from "@/features/home/components/HomeHeader";
import { HomeRow } from "@/features/home/components/HomeRow";
import { HomeShelf } from "@/features/home/components/HomeShelf";
import { TodayBlock } from "@/features/home/components/TodayBlock";

/**
 * Home: search leads, then what you were reading, today's games, the shelf, and two rows.
 * Nothing here needs the network beyond the precached books manifest.
 */
export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-5 md:px-10 pb-12">
      <HomeHeader />
      <div className="grid gap-8 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-7">
          <Hero />
        </div>
        <div className="flex flex-col gap-8 md:col-span-4 md:col-start-9 md:border-l-2 md:border-line-strong md:pl-6 md:pt-10">
          <ContinueReading />
          <TodayBlock />
        </div>
      </div>
      <div className="mt-10">
        <HomeShelf />
      </div>
      <ul className="mt-10">
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
