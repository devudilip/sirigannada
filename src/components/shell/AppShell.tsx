"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ADULT_STORIES_URL } from "@/features/children/lib/sections";
import { usePlayer } from "@/features/stories/lib/PlayerContext";
import { MiniPlayer } from "@/features/stories/components/MiniPlayer";
import { TopNav } from "./TopNav";
import { BottomNav } from "./BottomNav";
import { SiteFooter } from "./SiteFooter";

/**
 * Page chrome. The reader routes (a book, a ಚಿತ್ರಕಥೆ story, a picture book) hide the navs and footer
 * to give the text the whole screen; the ಚಿತ್ರಕಥೆ shelf itself is a listing and keeps them.
 * The story mini-player follows the listener everywhere except that story's own player page.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { story } = usePlayer();
  const immersive =
    (pathname.startsWith("/library/") && pathname.length > "/library/".length && pathname.replace(/(\.html)?\/?$/, "") !== ADULT_STORIES_URL) ||
    (pathname.startsWith("/picturebooks/") && pathname.length > "/picturebooks/".length && !pathname.endsWith("/credits"));
  // The full player and the read-along view carry their own transport; no mini-player there.
  const onOwnPlayer = story !== null && pathname.startsWith(`/stories/${story.slug}`);
  const miniPlayer = story !== null && !onOwnPlayer && !immersive;

  if (immersive) return <>{children}</>;

  return (
    <div className="min-h-dvh flex flex-col">
      <TopNav />
      <main className={`flex-1 w-full ${miniPlayer ? "pb-14" : ""}`}>{children}</main>
      <div className={`pb-20 md:pb-0 ${miniPlayer ? "md:pb-14" : ""}`}>
        <SiteFooter />
      </div>
      {miniPlayer ? <MiniPlayer /> : null}
      <BottomNav />
    </div>
  );
}
