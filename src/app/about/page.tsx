import type { Metadata } from "next";
import { LogoMark } from "@/components/ui/LogoMark";
import { AboutBody } from "@/features/about/components/AboutBody";

export const metadata: Metadata = { title: "ಕುರಿತು" };

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-2xl px-4 pt-10 flex flex-col gap-8">
      <header className="flex items-center gap-4">
        <LogoMark size={56} />
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink" lang="kn">
            ಸಿರಿಗನ್ನಡ
          </h1>
          <p className="text-sm tracking-[0.18em] uppercase text-muted">Sirigannada</p>
        </div>
      </header>
      <AboutBody />
    </article>
  );
}
