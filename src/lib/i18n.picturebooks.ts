import type { Locale } from "./types";

/** Strings for ಚಿತ್ರಪುಸ್ತಕಗಳು — StoryWeaver picture books: hub, reader, attribution. */
export const picturebooksStrings = {
  navPicturebooks: { kn: "ಚಿತ್ರಪುಸ್ತಕಗಳು", en: "Picture books" },
  picturebooksTitle: { kn: "ಚಿತ್ರಪುಸ್ತಕಗಳು", en: "Picture books" },
  picturebooksSub: { kn: "ಚಿತ್ರಗಳೊಂದಿಗೆ ಓದುವ ಮಕ್ಕಳ ಕಥೆಗಳು", en: "Children's stories to read with pictures" },
} as const satisfies Record<string, Record<Locale, string>>;
