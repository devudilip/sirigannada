import type { Metadata } from "next";
import { ChildrenHub } from "@/features/children/components/ChildrenHub";
import { readHubSections } from "@/features/children/lib/catalog";
import { strings } from "@/lib/i18n";

export const metadata: Metadata = { title: strings.childrenTitle.kn, alternates: { canonical: "/children" } };

export default function ChildrenPage() {
  return <ChildrenHub sections={readHubSections()} />;
}
