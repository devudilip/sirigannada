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
  description: "ಕನ್ನಡದ ನಿಘಂಟು, ಸಾಹಿತ್ಯ, ಗಾದೆಗಳು, ಕಲಿಕೆ ಮತ್ತು ಭಾಷಾ ಸಲಕರಣೆಗಳು. Kannada dictionary, literature, proverbs, learning, and language tools.",
  applicationName: "Sirigannada",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "ಸಿರಿಗನ್ನಡ" },
  metadataBase: new URL("https://sirigannada.in"),
  openGraph: {
    type: "website",
    siteName: "Sirigannada",
    locale: "kn_IN",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "ಸಿರಿಗನ್ನಡ · Sirigannada" }],
  },
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
