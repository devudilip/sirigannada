import { Hero } from "@/features/home/components/Hero";
import { WordOfDay } from "@/features/dictionary/components/WordOfDay";
import { BookShelf } from "@/features/library/components/BookShelf";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <Hero />
      <section className="mt-10">
        <SectionHeading k="wordOfDay" />
        <WordOfDay />
      </section>
      <section className="mt-12">
        <SectionHeading k="shelfTitle" href="/library" />
        <BookShelf limit={6} />
      </section>
    </div>
  );
}
