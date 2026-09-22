# Changelog

All notable changes to Sirigannada are recorded here. Dates are UTC.

## [Unreleased]

### Features
- Android app (Trusted Web Activity) project in `apps/android/`, package `in.sirigannada.app` (#47)
- ಗೌಪ್ಯತೆ · Privacy page at `/privacy`, linked from the footer and More

### Removed
- Google Analytics 4. Visitor counts come from Cloudflare's server-side analytics only

## [0.3.0] — 2026-09-16

### Features
- ಚಿತ್ರಪುಸ್ತಕಗಳು · Picture books: 40 Kannada picture books from StoryWeaver (Pratham Books, CC BY 4.0) in a phone-first reader with narration, tap-to-look-up, offline saving, and per-book credits pages (#86, #90)
- App-wide audio player with a mini-player, Media Session controls, per-story position memory, and byte-range serving from cached audio (#80)
- New UX and brand: five-tab shell, coral and turmeric palette, outlined ಸಿ mark, redesigned home, library, dictionary, proverbs (alphabetical index and letter rail), reader bars, games, alphabet and offline manager; ಇಂದಿನ ಗಾದೆ on the home page (#79)
- Site footer and ಸಂಪರ್ಕ · Contact page with a public feedback form and GitHub channels (#82)
- Google Analytics 4 tag, owner-approved (#78)

### Fixes
- Mini-player no longer hidden under the tab bar on iPhone (#88)
- Share cards: full word gloss, legible preview, flag-colour wordmark (#85)
- Visible page turn on single-page screens; Kannada ascenders no longer clipped in titles

### Corpus
12 public-domain books (unchanged), 2,194 proverbs, 40 CC BY 4.0 picture books.

## [0.2.0] — 2026-09-06

- On-device share image cards for a word, a ಗಾದೆ, the daily word, and a library verse (#20)
- /games hub with daily word and 120 generated Padabandha crosswords (#72, #73)
- Contributor process: accepted issues, DCO, code-owner review, preview branches (#22, #25)

## [0.1.0] — 2026-09-02

First public cut: a static, offline-capable Kannada dictionary and classics reader.

### Features
- Dictionary search (exact → prefix → phonetic), English reverse lookup, Latin transliteration, word of the day (Alar, ODbL)
- Measurement-based page-turn reader with spread mode, paper themes, chapters, bookmarks, progress, tap-to-lookup
- Installable PWA (hand-written service worker)
- `/credits` — author, death year, source, and licence for every book, plus Alar ODbL credit

### Corpus (12 books)
Basavanna, Akka Mahadevi, Allama Prabhu, Chennabasavanna; Sarvajna tripadis; Kumaravyasa Bharata Adiparva sandhis 1–5; Purandaradasa kirtanes; Kanakadasa Haribhaktisara; Lakshmisha Jaimini Bharata sandhis 1–4; Shishunala Sharif tatvapadas; Jagannatha Dasa Harikathamrutasara sandhis 1–4; Panje Mangesha Rao ಕೋಟಿ ಚೆನ್ನಯ.

Every book has a `provenance` block. Only public-domain texts (author died ≤ 1965).
