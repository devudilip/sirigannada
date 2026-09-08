import type { Metadata } from "next";
import { PageTitle } from "@/components/ui/PageTitle";
import { OfflineManager } from "@/features/offline/components/OfflineManager";
import { strings } from "@/lib/i18n";

export const metadata: Metadata = { title: strings.offlineManagerTitle.kn, alternates: { canonical: "/tools/offline" } };

export default function OfflinePage() {
  return (
    <div className="mx-auto max-w-2xl px-5 pt-6 pb-12">
      <PageTitle k="offlineManagerTitle" />
      <OfflineManager />
    </div>
  );
}
