import { Hero } from "@/features/home/components/Hero";
import { ContinueReading } from "@/features/home/components/ContinueReading";
import { HomeProverbs } from "@/features/home/components/HomeProverbs";
import { HomeTools } from "@/features/home/components/HomeTools";
import { BookShelf } from "@/features/library/components/BookShelf";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-12">
      <Hero />
      <ContinueReading />
      <section className="mt-12">
        <SectionHeading k="shelfTitle" href="/library" linkKey="navLibrary" />
        <BookShelf limit={6} />
      </section>
      <section className="mt-12">
        <HomeProverbs />
      </section>
      <section className="mt-12">
        <SectionHeading k="navTools" href="/tools" linkKey="navTools" />
        <HomeTools />
      </section>
    </div>
  );
}
