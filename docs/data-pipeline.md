# Data pipeline

Everything the app shows comes from static JSON under `public/data/`, produced by scripts in `scripts/`. There is no database and no server. Run everything with `npm run data`.

## Dictionary (`npm run data:dict`)

Source: [Alar](https://alar.ink) Kannada–English dictionary by V. Krishna, ODC-ODbL, from `github.com/alar-dict/data`.

1. `scripts/build-dictionary.ts` downloads `alar.yaml` to `data/raw/` (cached; git-ignored).
2. Each entry becomes a `DictEntry` (`src/lib/types.ts`): NFC-normalised headword, phonetic `key` from `phoneticKey()` in `src/lib/kannada.ts`, definitions with a normalised part of speech.
3. Output in `public/data/dict/` (git-ignored, ~50 MB, rebuilt on every deploy):
   - `u<hex>.json` — one `DictShard` per first Kannada letter (e.g. `u0c95.json` for ಕ). The client only downloads the shard for the letter being typed.
   - `en-<a-z>.json` — `ReverseShard`: English token → `[entry id, headword]` pairs, for English → Kannada lookup.
   - `daily.json` — 366 entries for "word of the day", chosen by a deterministic rule.
   - `manifest.json` — counts, shard list, and the ODbL provenance block.

Search itself (`src/features/dictionary/lib/search.ts`) runs entirely in the browser: exact → prefix → phonetic for Kannada input; transliteration + reverse index for Latin input.

## Books (`npm run data:books`)

Source folders live in `data/books-src/<slug>/` (committed). Format: `docs/book-format.md`.

1. `scripts/validate-corpus.ts` checks every `book.json`: provenance present, license allowed, `authorDied ≤ 1965` for public-domain, clean Unicode text with no markup.
2. `scripts/build-books.ts` runs the validation, then writes `public/data/books/<slug>.json` and `manifest.json` (committed — the corpus is small and is the product).
3. `scripts/fetch-wikisource.ts <page title>` pulls a page from Kannada Wikisource and prints cleaned plain text, to bootstrap a new book folder. Always review the output by hand before committing.

## Adding a new book

1. Confirm the author died in or before 1965 (or the text has an explicit CC licence).
2. `TMPDIR=/tmp npx tsx scripts/fetch-wikisource.ts "<page title>" > data/books-src/<slug>/01-<chapter>.txt`
3. Fix the chapter title line and block breaks; remove any modern commentary.
4. Write `book.json` with a complete `provenance` block.
5. `npm run data:books` — fix anything the validator rejects.
6. Commit as `data(corpus): add <title>`.

## Deployment

`npm run build` produces a fully static site in `out/`. Run `npm run data:dict` first (CI does this) so dictionary shards exist. Any static host works: Cloudflare Pages, GitHub Pages, Netlify, or a plain S3 bucket.
