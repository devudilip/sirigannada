import type { Metadata } from "next";
import { PageTitle } from "@/components/ui/PageTitle";
import { OfflineManager } from "@/features/offline/components/OfflineManager";
import { strings } from "@/lib/i18n";

export const metadata: Metadata = { title: strings.offlineManagerTitle.kn, alternates: { canonical: "/tools/offline" } };

export default function OfflinePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-8 pb-8">
      <PageTitle k="offlineManagerTitle" sub="offlineManagerSub" />
      <OfflineManager />
    </div>
  );
}
