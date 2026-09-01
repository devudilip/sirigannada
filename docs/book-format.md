# Book format

Every book is one JSON file at `public/data/books/<slug>.json` conforming to `Book` in `src/lib/types.ts`. `scripts/build-books.ts` reads source files from `data/books-src/<slug>/` and writes the JSON plus `public/data/books/manifest.json`. `scripts/validate-corpus.ts` rejects any book without a complete `provenance` block or with a disallowed license.

## Source folder: `data/books-src/<slug>/`

```
book.json        metadata + provenance (see below)
01-<chapter>.txt one plain-text file per chapter, in order
02-<chapter>.txt
```

### `book.json`

```json
{
  "slug": "sarvajna-tripadi",
  "title": "ಸರ್ವಜ್ಞನ ತ್ರಿಪದಿಗಳು",
  "titleEn": "Tripadis of Sarvajna",
  "author": "ಸರ್ವಜ್ಞ",
  "authorEn": "Sarvajna",
  "era": "16th century",
  "form": "tripadi",
  "description": "ಸರ್ವಜ್ಞನ ಆಯ್ದ ತ್ರಿಪದಿಗಳು — ಲೋಕಾನುಭವ, ನೀತಿ, ವಿಡಂಬನೆ.",
  "provenance": {
    "source": "https://kn.wikisource.org/wiki/…",
    "license": "public-domain",
    "licenseNote": "Author died c. 1600s; text from Kannada Wikisource proofread edition (CC BY-SA metadata, PD text)",
    "author": "ಸರ್ವಜ್ಞ",
    "authorDied": 1601,
    "retrieved": "2026-09-02"
  }
}
```

`form` is one of: `vachana`, `tripadi`, `shatpadi`, `kirtane`, `prose`, `poem`, `mixed`.

### Chapter text files

- First line: chapter title. Then a blank line. Then the body.
- Blocks (a verse, a vachana, a prose paragraph) are separated by **one blank line**.
- Lines within a block (poem lines) are separated by a single newline and are preserved.
- Unicode NFC Kannada only. No HTML, no wiki markup, no legacy ASCII fonts.
- Chapter file names are `NN-anything.txt`; `NN` sets the order.

## What may be added

See `.cursor/rules/data-license.mdc`. Short version: public-domain (author died ≤ 1965) from Wikisource/CC releases, or explicit CC-licensed texts. Never retype from a modern printed edition.
