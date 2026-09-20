import type { Metadata } from "next";
import { ContinuePage } from "@/features/continue/components/ContinuePage";
import { strings } from "@/lib/i18n";

export const metadata: Metadata = {
  title: strings.continueTitle.kn,
  robots: { index: false },
  alternates: { canonical: "/continue" },
};

export default function Continue() {
  return <ContinuePage />;
}
