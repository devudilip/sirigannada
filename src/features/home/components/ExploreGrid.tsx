"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { NavIcon } from "@/components/shell/NavIcon";
import { useApp } from "@/components/providers/AppProviders";

const destinations = [
  { href: "/dictionary", title: "navDictionary", sub: "homeDictionarySub", icon: "search" },
  { href: "/library", title: "navLibrary", sub: "homeLibrarySub", icon: "book" },
  { href: "/children", title: "navChildren", sub: "homeChildrenSub", icon: "stories" },
  { href: "/learn", title: "learnTitle", sub: "homeLearnDescription", icon: "info" },
  { href: "/games", title: "navGames", sub: "homeGamesSub", icon: "games" },
  { href: "/tools", title: "navTools", sub: "homeToolsSub", icon: "more" },
] as const;

export function ExploreGrid() {
  const { locale, t } = useApp();
  return (
    <section aria-labelledby="explore-title" lang={locale}>
      <h2 id="explore-title" className="text-2xl font-semibold">{t("homeExplore")}</h2>
      <p className="mt-2 mb-5 text-base text-secondary">{t("homeExploreSub")}</p>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {destinations.map((item) => (
          <Link key={item.href} href={item.href} className="group rounded-lg border border-line bg-elevated p-4 md:p-5 hover:border-accent-strong transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="size-11 rounded-md bg-accent-soft text-accent-text flex items-center justify-center"><NavIcon icon={item.icon} /></span>
              <ArrowRightIcon size={20} className="text-muted group-hover:text-accent-strong" />
            </div>
            <h3 className="text-base md:text-lg font-semibold">{t(item.title)}</h3>
            <p className="mt-1 text-base text-secondary">{t(item.sub)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
