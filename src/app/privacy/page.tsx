import type { Metadata } from "next";
import { PageTitle } from "@/components/ui/PageTitle";
import { PrivacyBody } from "@/features/privacy/components/PrivacyBody";
import { strings } from "@/lib/i18n";

export const metadata: Metadata = {
  title: strings.privacyTitle.kn,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-8 pb-12">
      <PageTitle k="privacyTitle" sub="privacySub" />
      <PrivacyBody />
    </div>
  );
}
