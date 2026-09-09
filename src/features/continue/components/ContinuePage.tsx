"use client";

import { useEffect, useState } from "react";
import { useT } from "@/components/providers/AppProviders";
import { decodeBlob } from "../lib/blobCodec";
import { applyProgress } from "../lib/applyProgress";

type Phase = { k: "working" } | { k: "done"; route: string } | { k: "bad" };

/**
 * Landing screen for a continue link. The blob rides in the hash (`/continue#<blob>`), so there
 * is never a server round-trip. Decode -> apply into the features' own local keys -> redirect.
 * A missing, malformed, or expired blob shows a bilingual error instead.
 */
export function ContinuePage() {
  const t = useT();
  const [phase, setPhase] = useState<Phase>({ k: "working" });

  useEffect(() => {
    const code = window.location.hash.replace(/^#/, "");
    const blob = code ? decodeBlob(code) : null;
    if (!blob) {
      setPhase({ k: "bad" });
      return;
    }
    const { route } = applyProgress(blob);
    setPhase({ k: "done", route });
    // Full navigation, not the SPA router: the target pages are static and this must not depend
    // on the client router having hydrated (mobile / dev-server first loads were flaky).
    const id = window.setTimeout(() => window.location.replace(route), 500);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="mx-auto flex min-h-[60dvh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      {phase.k === "working" && <p className="text-base text-secondary">{t("continueApplying")}</p>}

      {phase.k === "done" && (
        <>
          <p className="text-base text-ink">{t("continueDone")}</p>
          <a href={phase.route} className="font-medium text-accent hover:underline">
            {t("continueOpenManually")}
          </a>
        </>
      )}

      {phase.k === "bad" && (
        <>
          <p className="text-lg font-semibold text-ink">{t("continueBadLink")}</p>
          <p className="text-base text-secondary">{t("continueBadLinkHelp")}</p>
          <a href="/" className="font-medium text-accent hover:underline">
            {t("navHome")}
          </a>
        </>
      )}
    </div>
  );
}
