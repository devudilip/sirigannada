import type { Metadata, Viewport } from "next";
import { Anek_Kannada, Noto_Serif_Kannada } from "next/font/google";
import "@/styles/globals.css";
import { AppProviders } from "@/components/providers/AppProviders";
import { AppShell } from "@/components/shell/AppShell";
import { ServiceWorkerRegistrar } from "@/components/pwa/ServiceWorkerRegistrar";

const anek = Anek_Kannada({
  subsets: ["kannada", "latin"],
  variable: "--font-anek",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const notoSerif = Noto_Serif_Kannada({
  subsets: ["kannada", "latin"],
  variable: "--font-noto-serif",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: { default: "ಸಿರಿಗನ್ನಡ · Sirigannada", template: "%s · ಸಿರಿಗನ್ನಡ" },
  description: "ಕನ್ನಡದ ನಿಘಂಟು, ಶಾಸ್ತ್ರೀಯ ಸಾಹಿತ್ಯ ಮತ್ತು ಭಾಷಾ ಸಲಕರಣೆಗಳು — ಒಂದೇ ಕಡೆ. One reliable, open home for Kannada.",
  applicationName: "Sirigannada",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "ಸಿರಿಗನ್ನಡ" },
  openGraph: { type: "website", siteName: "Sirigannada", locale: "kn_IN" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fffdf8" },
    { media: "(prefers-color-scheme: dark)", color: "#151311" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/** Applies persisted theme before first paint to avoid a flash. Keep in sync with ThemeContext. */
const themeScript = `(function(){try{var t=JSON.parse(localStorage.getItem('sg:theme')||'null');if(!t){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t;var l=JSON.parse(localStorage.getItem('sg:locale')||'null');if(l){document.documentElement.lang=l==='en'?'en':'kn'}}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="kn" suppressHydrationWarning className={`${anek.variable} ${notoSerif.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans text-ink bg-surface antialiased">
        <AppProviders>
          <AppShell>{children}</AppShell>
          <ServiceWorkerRegistrar />
        </AppProviders>
      </body>
    </html>
  );
}
