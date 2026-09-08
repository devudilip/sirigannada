"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { TopNav } from "./TopNav";
import { BottomNav } from "./BottomNav";
import { SiteFooter } from "./SiteFooter";

/** Page chrome. The reader route hides the navs and footer to give the book the whole screen. */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const immersive = pathname.startsWith("/library/") && pathname.length > "/library/".length;

  if (immersive) return <>{children}</>;

  return (
    <div className="min-h-dvh flex flex-col">
      <TopNav />
      <main className="flex-1 w-full">{children}</main>
      <div className="pb-20 md:pb-0">
        <SiteFooter />
      </div>
      <BottomNav />
    </div>
  );
}
