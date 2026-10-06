import type { Metadata } from "next";
import { PageTitle } from "@/components/ui/PageTitle";
import { AppsList } from "@/features/apps/components/AppsList";
import { strings } from "@/lib/i18n";

export const metadata: Metadata = { title: strings.appsTitle.kn, alternates: { canonical: "/apps" } };

export default function AppsPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 pt-6 pb-12">
      <PageTitle k="appsTitle" sub="appsSub" />
      <AppsList />
    </div>
  );
}
