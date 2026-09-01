"use client";

import { useEffect, useState } from "react";
import type { Book } from "@/lib/types";

type State = { status: "loading" } | { status: "ready"; book: Book } | { status: "missing" };

const cache = new Map<string, Book>();

export function useBook(slug: string): State {
  const cached = cache.get(slug);
  const [state, setState] = useState<State>(cached ? { status: "ready", book: cached } : { status: "loading" });

  useEffect(() => {
    if (cache.has(slug)) return;
    let alive = true;
    fetch(`/data/books/${slug}.json`)
      .then((r) => (r.ok ? (r.json() as Promise<Book>) : null))
      .catch(() => null)
      .then((book) => {
        if (!alive) return;
        if (book) {
          cache.set(slug, book);
          setState({ status: "ready", book });
        } else {
          setState({ status: "missing" });
        }
      });
    return () => {
      alive = false;
    };
  }, [slug]);

  return state;
}
