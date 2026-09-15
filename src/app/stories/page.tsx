import type { Metadata } from "next";
import { StoriesHub } from "@/features/stories/components/StoriesHub";
import { strings } from "@/lib/i18n";

export const metadata: Metadata = { title: strings.storiesTitle.kn, alternates: { canonical: "/stories" } };

export default function StoriesPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-6 pb-12">
      <StoriesHub />
    </div>
  );
}
