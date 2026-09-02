# Contributing to Sirigannada (ಸಿರಿಗನ್ನಡ)

Thank you for helping keep Kannada’s dictionary and classics online, offline-capable, and legally clean.

Start with [`docs/handbook.md`](docs/handbook.md) for architecture and workflow. This file is the human contributor contract: what we accept, how to propose work, and how you keep your copyright.

## License of your work

- **Code** you submit is licensed under [AGPL-3.0-or-later](LICENSE), same as the rest of the repo.
- **Original documentation and original content** you submit is CC BY-SA 4.0 unless a file says otherwise.
- **Third-party texts and dictionary data** keep the license recorded in their `provenance` block. Do not relicense them.

## Legal constitution (non-negotiable)

Only these may enter the corpus:

| Allowed | Condition |
|---|---|
| Public domain | Author died in or before **1965** (India: life + 60 years). Record the death year. |
| Creative Commons | CC0, CC BY, or CC BY-SA only. Record the exact license and source URL. |
| ODbL | Alar dictionary only. Credit V. Krishna; derived data stays ODbL. |
| Government CC | Only works **explicitly** released under CC (for example Dept. of Kannada & Culture). |

**Never:** authors who died after 1965 (Kuvempu, Bendre, DVG, Karanth, Masti and others remain in copyright); text retyped from a modern printed edition (editorial copyright); scraped sites without an explicit license; news; modern editors’ introductions, notes, or glossaries.

Every book needs a complete `provenance` block (`source`, `license`, `author`, `authorDied`, plus `licenseNote` / `retrieved` in the source `book.json`). The build validator rejects books that omit it.

**Clean room:** do not copy code, schemas, or curated data from other Kannada projects. Ideas are fine; implementations here are written fresh.

## Proposing a new book

Open a **New book** issue (use the GitHub template). Fill in provenance **before** anyone starts ingesting text:

- Source URL (Wikisource proofread page, CC release, or other allowed origin)
- License (`public-domain`, `CC0-1.0`, `CC-BY-4.0`, `CC-BY-SA-4.0`)
- Author name
- Year the author died (must be **1965 or earlier** for public-domain claims)

A maintainer will check the source and death year. Do not paste large copyrighted excerpts into the issue.

## Reporting a bug

Use the **Bug** issue template. Include steps, what you expected, what happened, and browser/device (especially if it is an offline / PWA problem).

## Code and corpus patches

```bash
npm install
npm run data        # dictionary + books into public/data
npm run typecheck && npm test
npm run data:validate   # if you touched corpus or pipeline
npm run dev
```

- Conventional Commits: `feat|fix|data|style|docs|chore|refactor|test(scope): …`
- TypeScript strict, files under 250 lines, one React component per file, UI strings via `src/lib/i18n.ts`, colours from design tokens.
- Kannada is always Unicode. Never store Nudi/Baraha ASCII.
- No runtime `fetch()` to third-party APIs; data lives under `public/data/`.

Book source layout is documented in [`docs/book-format.md`](docs/book-format.md).

## Developer Certificate of Origin (DCO)

There is **no CLA** and **no copyright assignment**. You keep copyright in your contribution.

Every commit must include a DCO sign-off (`git commit -s`), which adds:

```
Signed-off-by: Your Name <you@example.com>
```

That certifies you have the right to submit the work under this project’s licenses (DCO 1.1: you created it, or it is already under an appropriate open license and you may submit it). See [developercertificate.org](https://developercertificate.org/).

If a commit is missing the line, amend locally with `git commit --amend -s` **before** it is pushed, or add a follow-up commit that restates the sign-off — do not rewrite history on shared branches.
