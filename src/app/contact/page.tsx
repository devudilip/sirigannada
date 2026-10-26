import type { Metadata } from "next";
import { PageTitle } from "@/components/ui/PageTitle";
import { ContactChannels } from "@/features/contact/components/ContactChannels";
import { strings } from "@/lib/i18n";

export const metadata: Metadata = {
  title: strings.contactTitle.kn,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-8 pb-12">
      <PageTitle k="contactTitle" sub="contactSub" />
      <ContactChannels />
    </div>
  );
}
