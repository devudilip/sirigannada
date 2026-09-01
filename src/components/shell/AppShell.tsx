"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { TopNav } from "./TopNav";
import { BottomNav } from "./BottomNav";

/** Page chrome. The reader route hides both navs to give the book the whole screen. */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const immersive = pathname.startsWith("/library/") && pathname.length > "/library/".length;

  if (immersive) return <>{children}</>;

  return (
    <div className="min-h-dvh flex flex-col">
      <TopNav />
      <main className="flex-1 w-full pb-20 md:pb-8">{children}</main>
      <BottomNav />
    </div>
  );
}
