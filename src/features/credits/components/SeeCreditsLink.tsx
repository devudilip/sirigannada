"use client";

import Link from "next/link";
import { useT } from "@/components/providers/AppProviders";

export function SeeCreditsLink() {
  const t = useT();
  return (
    <p className="text-base">
      <Link className="text-accent underline" href="/credits">
        {t("seeAllCredits")}
      </Link>
    </p>
  );
}
