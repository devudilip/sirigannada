"use client";

import Link from "next/link";
import { useApp } from "@/components/providers/AppProviders";
import type { ChildStory } from "../types";
import { StoryArt } from "./StoryArt";

export function StoryReader({ story }: { story: ChildStory }) {
  const { t, locale } = useApp();
  return (
    <article className="mx-auto max-w-5xl px-4 pt-6 pb-12">
      <Link href={`/children/${story.collection}`} className="inline-flex min-h-11 items-center text-accent">{t("childrenBack")}</Link>
      <header className="py-6 text-center">
        <p className="text-base text-accent">{t("childrenKannada")} · {t("childrenAge", { age: story.age })}</p>
        <h1 className="mt-4 font-serif text-3xl font-bold text-ink" lang="kn">{story.title.kn}</h1>
        <p className="mt-4 font-serif text-xl text-secondary" lang="kn">{story.teaser.kn}</p>
        <details className="mt-4 text-base text-secondary">
          <summary className="inline-flex min-h-11 cursor-pointer items-center underline">{t("childrenNote")}</summary>
          <p>{story.contentNote[locale]}</p>
        </details>
      </header>
      {story.scenes.map((scene) => (
        <section key={scene.id} id={scene.id} aria-labelledby={`${scene.id}-title`}
          className="grid gap-6 border-t border-line py-8 md:grid-cols-2 md:gap-8">
          <StoryArt image={story.image} panel={scene.panel} alt={scene.imageAlt} />
          <div className="font-serif text-lg text-ink" lang="kn">
            <h2 id={`${scene.id}-title`} className="mb-4 text-xl font-bold">{scene.title}</h2>
            {scene.paragraphs.map((paragraph, index) => <p className="mb-4" key={index}>{paragraph}</p>)}
            {scene.question && <aside className="rounded-md bg-gold-soft p-4">
              <h3 className="font-sans text-base font-semibold" lang={locale}>{t("childrenPause")}</h3>
              <p className="mt-2">{scene.question}</p>
            </aside>}
          </div>
        </section>
      ))}
      <section className="border-t border-line py-8">
        <h2 className="text-xl font-semibold">{t("childrenWords")}</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2" lang="kn">
          {story.vocabulary.map(({ word, meaning }) => <div key={word} className="rounded-md bg-paper p-4">
            <dt className="font-serif text-lg font-bold">{word}</dt><dd className="mt-2 text-base">{meaning}</dd>
          </div>)}
        </dl>
      </section>
      <section className="border-t border-line py-8">
        <h2 className="text-xl font-semibold">{t("childrenDiscuss")}</h2>
        <ul className="mt-4 list-disc pl-6 font-serif text-lg" lang="kn">
          {story.questions.map((question) => <li className="mb-3" key={question}>{question}</li>)}
        </ul>
      </section>
      <details className="border-t border-line py-4 text-base text-secondary">
        <summary className="min-h-11 cursor-pointer py-2 font-semibold text-ink">{t("childrenCredits")}</summary>
        <p className="mt-3">{story.adaptation.credit[locale]}</p>
        <p className="mt-3">{story.adaptation.note[locale]}</p>
        <p className="mt-3">{story.illustrations.disclosure[locale]}</p>
        <p className="mt-3"><a className="underline text-accent" href="https://creativecommons.org/licenses/by-sa/4.0/">{t("childrenLicense")}</a></p>
        <a className="mt-3 inline-flex min-h-11 items-center underline text-accent" href={story.provenance.source}>{t("childrenSource")}</a>
      </details>
      <Link href={`/children/${story.collection}`} className="mt-4 inline-flex min-h-11 items-center text-accent">{t("childrenBack")}</Link>
    </article>
  );
}
