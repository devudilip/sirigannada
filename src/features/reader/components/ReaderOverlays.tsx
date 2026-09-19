"use client";

import type { Book } from "@/lib/types";
import { useApp, useT } from "@/components/providers/AppProviders";
import type { SearchResult } from "@/features/dictionary/lib/search";
import { ShareCardSheet } from "@/features/share/components/ShareCardSheet";
import type { ReaderSettings } from "../types";
import { verseShareInput } from "../lib/verseShareInput";
import { BookSearchSheet } from "./BookSearchSheet";
import { CopiedToast } from "./CopiedToast";
import { ChaptersSheet, LookupSheet, SettingsSheet } from "./ReaderSheets";
import { VerseActionSheet } from "./VerseActionSheet";

export type ReaderSheet = "settings" | "chapters" | "search" | null;

export interface ReaderLookup {
  word: string;
  result: SearchResult | null | undefined;
}

interface ReaderOverlaysProps {
  book: Book;
  sheet: ReaderSheet;
  onCloseSheet: () => void;
  settings: ReaderSettings;
  onStepFont: (dir: 1 | -1) => void;
  onUpdate: (patch: Partial<ReaderSettings>) => void;
  currentChapter: number;
  bookmark: number | null;
  /** Global block index where each chapter starts. */
  starts: number[];
  onGoToBlock: (block: number) => void;
  lookup: ReaderLookup | null;
  onCloseLookup: () => void;
  actionBlock: number | null;
  onCloseAction: () => void;
  onCopyLink: (block: number) => void;
  shareBlock: number | null;
  onShareBlock: (block: number | null) => void;
  copiedBlock: number | null;
  licenseLabel: string;
}

/** Every sheet, menu and toast that floats above the reader stage. */
export function ReaderOverlays(props: ReaderOverlaysProps) {
  const { book, sheet, onCloseSheet, settings, lookup, actionBlock, shareBlock } = props;
  const t = useT();
  const { locale } = useApp();
  return (
    <>
      <SettingsSheet
        open={sheet === "settings"}
        onClose={onCloseSheet}
        settings={settings}
        bookForm={book.form}
        onStepFont={props.onStepFont}
        onUpdate={props.onUpdate}
      />
      <ChaptersSheet
        open={sheet === "chapters"}
        onClose={onCloseSheet}
        book={book}
        currentChapter={props.currentChapter}
        hasBookmark={props.bookmark !== null}
        onSelect={(i) => props.onGoToBlock(props.starts[i] ?? 0)}
        onGoToBookmark={() => props.bookmark !== null && props.onGoToBlock(props.bookmark)}
      />
      <BookSearchSheet open={sheet === "search"} book={book} onClose={onCloseSheet} onSelect={props.onGoToBlock} />
      <LookupSheet
        word={lookup?.word ?? null}
        result={lookup?.result}
        book={book}
        onClose={props.onCloseLookup}
        onJumpToOccurrence={(block) => {
          props.onCloseLookup();
          props.onGoToBlock(block);
        }}
      />
      <VerseActionSheet
        open={actionBlock !== null}
        onClose={props.onCloseAction}
        onCopyLink={() => {
          if (actionBlock !== null) props.onCopyLink(actionBlock);
          props.onCloseAction();
        }}
        onShareCard={() => {
          props.onShareBlock(actionBlock);
          props.onCloseAction();
        }}
      />
      <ShareCardSheet
        open={shareBlock !== null}
        onClose={() => props.onShareBlock(null)}
        input={
          shareBlock !== null
            ? verseShareInput(book, shareBlock, locale, `${t("license")}: ${props.licenseLabel}`)
            : null
        }
      />
      <CopiedToast visible={props.copiedBlock !== null} />
    </>
  );
}
