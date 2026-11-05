"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/components/providers/AppProviders";
import { loadManifest } from "../lib/data";

export function DictionaryCoverage() {
  const { locale, t } = useApp();
  const [count, setCount] = useState(0);
  useEffect(() => { let alive = true; void loadManifest().then((manifest) => { if (alive) setCount(manifest?.entryCount ?? 0); }); return () => { alive = false; }; }, []);
  return <p className="mb-5 text-base text-secondary">{count > 0 ? t("dictCoverage", { n: count.toLocaleString(locale === "kn" ? "kn-IN" : "en-IN") }) : t("dictCoveragePlain")}</p>;
}
