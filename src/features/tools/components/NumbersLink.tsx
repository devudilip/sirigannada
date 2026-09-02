"use client";

import Link from "next/link";
import { useT } from "@/components/providers/AppProviders";

export function NumbersLink() {
  const t = useT();
  return (
    <Link className="text-accent underline" href="/tools/numbers">
      {t("openNumbers")}
    </Link>
  );
}
