"use client";

import Link from "next/link";
import { useApp } from "@/components/providers/AppProviders";
import { toKannadaDigits } from "@/lib/kannada";
import { sectionUrl } from "../lib/sections";
import type { ChildStory } from "../types";
import { StoryArt } from "./StoryArt";

/**
 * ಚಿತ್ರಕಥೆ (16+) reads like a book, not a lesson: a title page, then each scene as a numbered
 * chapter with its picture set in as a plate and the prose in the book serif. The children's
 * scaffolding (pause question, word list, discussion, parents' note) is left out.
 */
export function BookStoryReader({ story }: { story: ChildStory }) {
  const { t, locale } = useApp();
  const back = sectionUrl(story.collection);
  return (
    <article className="mx-auto max-w-2xl px-5 pt-6 pb-16">
      <Link href={back} className="inline-flex min-h-11 items-center text-accent">{t("childrenBack")}</Link>
      <header className="py-12 text-center" lang="kn">
        <p className="text-sm tracking-widest text-muted">{t("bookStorySource")}</p>
        <h1 className="mt-6 font-serif text-4xl font-bold leading-tight text-ink">{story.title.kn}</h1>
        <p className="mt-4 text-sm text-muted">{toKannadaDigits(story.age)}</p>
        <p aria-hidden="true" className="mt-8 text-2xl text-gold">❦</p>
      </header>
      {story.scenes.map((scene, index) => (
        <section key={scene.id} id={scene.id} aria-labelledby={`${scene.id}-title`} className="py-10" lang="kn">
          <p className="text-center font-serif text-lg text-muted">{toKannadaDigits(index + 1)}</p>
          <h2 id={`${scene.id}-title`} className="mt-1 text-center font-serif text-2xl font-semibold text-ink">{scene.title}</h2>
          <figure className="mx-auto my-8 max-w-md border border-line bg-paper p-2 shadow-elevated">
            <StoryArt image={story.image} panel={scene.panel} alt={scene.imageAlt} className="aspect-square w-full rounded-none" />
          </figure>
          <div className="font-serif text-lg leading-loose text-ink">
            {scene.paragraphs.map((paragraph, i) => (
              <p key={i} className={i === 0 ? "" : "indent-8"}>{paragraph}</p>
            ))}
          </div>
        </section>
      ))}
      <p aria-hidden="true" className="py-6 text-center text-2xl text-gold">❦</p>
      <details className="border-t border-line py-4 text-base text-secondary">
        <summary className="min-h-11 cursor-pointer py-2 font-semibold text-ink">{t("childrenCredits")}</summary>
        <p className="mt-3">{story.adaptation.credit[locale]}</p>
        <p className="mt-3">{story.adaptation.note[locale]}</p>
        <p className="mt-3">{story.illustrations.disclosure[locale]}</p>
        <p className="mt-3"><a className="underline text-accent" href="https://creativecommons.org/licenses/by-sa/4.0/">{t("childrenLicense")}</a></p>
        <a className="mt-3 inline-flex min-h-11 items-center underline text-accent" href={story.provenance.source}>{t("childrenSource")}</a>
      </details>
      <Link href={back} className="mt-4 inline-flex min-h-11 items-center text-accent">{t("childrenBack")}</Link>
    </article>
  );
}
