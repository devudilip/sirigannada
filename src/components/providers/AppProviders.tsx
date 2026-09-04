"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/types";
import { translate, type StringKey } from "@/lib/i18n";
import { readStorage, writeStorage } from "@/lib/storage";
import { KannadaSpeechProvider } from "@/lib/SpeakContext";

type Theme = "light" | "dark";

interface AppState {
  theme: Theme;
  setTheme: (t: Theme) => void;
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: StringKey, vars?: Record<string, string | number>) => string;
}

const AppContext = createContext<AppState | null>(null);

function systemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [locale, setLocaleState] = useState<Locale>("kn");

  // Hydrate from storage after mount (layout's inline script already painted the right theme).
  useEffect(() => {
    setThemeState(readStorage<Theme | null>("theme", null) ?? systemTheme());
    setLocaleState(readStorage<Locale>("locale", "kn"));
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    writeStorage("theme", next);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    writeStorage("locale", next);
  }, []);

  const value = useMemo<AppState>(
    () => ({
      theme,
      setTheme,
      locale,
      setLocale,
      t: (key, vars) => translate(locale, key, vars),
    }),
    [theme, setTheme, locale, setLocale]
  );

  return (
    <AppContext.Provider value={value}>
      <KannadaSpeechProvider>{children}</KannadaSpeechProvider>
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProviders");
  return ctx;
}

/** Shorthand: `const t = useT(); t("navHome")` */
export function useT() {
  return useApp().t;
}
