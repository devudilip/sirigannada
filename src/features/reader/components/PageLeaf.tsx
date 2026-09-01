"use client";

import type { RefObject } from "react";
import type { Book } from "@/lib/types";
import type { PageLayout, ReaderSettings } from "../types";
import type { LeafPlan } from "../lib/flipMath";
import { PageView } from "./PageView";

interface PageLeafProps {
  book: Book;
  layout: PageLayout;
  settings: ReaderSettings;
  plan: LeafPlan;
  leafRef: RefObject<HTMLDivElement | null>;
  shadeRef: RefObject<HTMLDivElement | null>;
}

/**
 * The turning sheet. Two faces back-to-back; the controller rotates `leafRef` around the spine
 * and fades `shadeRef` (a flat tint) as the sheet goes edge-on.
 */
export function PageLeaf({ book, layout, settings, plan, leafRef, shadeRef }: PageLeafProps) {
  const left = plan.side === "right" ? layout.pageWidth : 0;
  const face = "absolute inset-0 [backface-visibility:hidden]";
  return (
    <div
      ref={leafRef}
      className="absolute top-0 will-change-transform"
      style={{
        left,
        width: layout.pageWidth,
        height: layout.pageHeight,
        transformOrigin: plan.side === "right" ? "left center" : "right center",
        transformStyle: "preserve-3d",
        transform: `rotateY(${plan.startAngle}deg)`,
        boxShadow: "var(--sg-shadow-elevated)",
      }}
    >
      <div className={face}>
        <PageView book={book} layout={layout} settings={settings} page={plan.front} />
        <div ref={shadeRef} className="absolute inset-0 pointer-events-none" style={{ background: "var(--sg-text)", opacity: 0 }} />
      </div>
      <div className={face} style={{ transform: "rotateY(180deg)" }}>
        <PageView book={book} layout={layout} settings={settings} page={plan.back} />
      </div>
    </div>
  );
}
