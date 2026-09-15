"use client";

import { stripPunctuation, words } from "@/features/stories/lib/sentences";
import type { PictureBookPage } from "@/lib/types";

/**
 * One story page: the illustration on top (left on md+), the text below (right on md+) in serif
 * at the reader's chosen size, each word a tap target for the dictionary sheet. A page with no
 * image centres its text vertically instead.
 */
export function BookReaderStoryPage({
  page,
  size,
  eager,
  onWord,
}: {
  page: PictureBookPage;
  size: number;
  eager: boolean;
  onWord: (word: string) => void;
}) {
  const body = (
    <div className="flex flex-col gap-3 px-6 py-6 md:justify-center">
      {page.text.map((para, i) => {
        const tokens = words(para);
        return (
          <p key={i} lang="kn" style={{ fontSize: `${size}px`, lineHeight: 1.8 }} className="font-serif text-pretty text-ink">
            {tokens.map((w, j) => (
              <span key={`${i}-${j}`}>
                <button
                  type="button"
                  lang="kn"
                  onClick={() => {
                    const clean = stripPunctuation(w);
                    if (clean) onWord(clean);
                  }}
                  className="inline appearance-none border-0 bg-transparent p-0 hover:underline focus-visible:underline focus-visible:outline-none"
                  style={{ font: "inherit", color: "inherit" }}
                >
                  {w}
                </button>
                {j < tokens.length - 1 ? " " : null}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );

  if (!page.image) {
    return (
      <div className="h-full w-full shrink-0 snap-center overflow-y-auto bg-surface flex items-center">
        <div className="mx-auto w-full max-w-xl">{body}</div>
      </div>
    );
  }

  return (
    <div className="h-full w-full shrink-0 snap-center overflow-y-auto md:flex md:flex-row">
      <div className="bg-elevated md:w-3/5 md:h-full md:flex md:items-center">
        {/* eslint-disable-next-line @next/next/no-img-element -- same-origin static asset, no optimiser in static export */}
        <img
          src={page.image.src}
          alt=""
          width={page.image.width}
          height={page.image.height}
          loading={eager ? "eager" : "lazy"}
          className="block w-full h-auto md:h-full md:w-full object-contain"
        />
      </div>
      <div className="md:w-2/5 md:h-full md:overflow-y-auto">{body}</div>
    </div>
  );
}
