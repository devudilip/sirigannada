import type { Metadata } from "next";
import { PageTitle } from "@/components/ui/PageTitle";
import { VargaLesson } from "@/features/learn/components/VargaLesson";
import { strings } from "@/lib/i18n";

export const metadata: Metadata = {
  title: strings.vargaTitle.kn,
  description: strings.vargaSub.kn,
  alternates: { canonical: "/learn/varga" },
};

export default function VargaPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-8 pb-12">
      <PageTitle k="vargaTitle" sub="vargaSub" />
      <VargaLesson />
    </div>
  );
}
