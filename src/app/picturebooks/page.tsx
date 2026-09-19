import type { Metadata } from "next";
import { PicturebooksHub } from "@/features/picturebooks/components/PicturebooksHub";
import { strings } from "@/lib/i18n";

export const metadata: Metadata = { title: strings.picturebooksTitle.kn, alternates: { canonical: "/picturebooks" } };

export default function PicturebooksPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-6 pb-12">
      <PicturebooksHub />
    </div>
  );
}
