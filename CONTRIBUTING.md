# Contributing to Sirigannada (ಸಿರಿಗನ್ನಡ)

Thank you for helping keep Kannada’s dictionary and classics online, offline-capable, and legally clean.

This file is the human contributor contract: what we accept, how work gets accepted, and how you keep your copyright. **Pull requests are welcome, but only against an accepted issue.** Work on a **feature branch**, verify it works, then open a PR into `main`. Never push to `main`. Every commit needs a DCO sign-off (`git commit -s`). There is no CLA.

## What this project is, in five lines

1. One reliable, open, offline-capable home for Kannada: dictionary, public-domain classics, proverbs, learning tools.
2. **Legally clean by construction.** Every text has verifiable provenance, and the build fails without it. That is the product, not paperwork.
3. **Copyleft.** Code is AGPL, original content is CC BY-SA. Anyone may reuse it; nobody can close it.
4. **Curated, not scraped.** Books are chosen and read by people who know Kannada. Quality beats volume.
5. **Works on a cheap Android phone with no network.** Static export, sharded data, no backend.

## What we will not build

Do not propose or submit these; the answer is a fixed no.

- User accounts, logins, or servers of any kind (including "opaque JSON" sync endpoints).
- Ads, analytics, or anything that phones home.
- Machine-translated or AI-generated Kannada content presented as reference material.
- Scraped news or websites; texts by authors who died after 1965; text retyped from modern editions.
- New npm dependencies where thirty lines of code would do.
- Code, schemas, or curated data copied from other Kannada projects.

## How work is accepted

Anyone can generate a large pull request in an afternoon. What is scarce here is judgement about scope, licence, and Kannada quality, so the process is deliberately **discuss first, code second**.

1. **Propose in Discussions.** New features and ideas go to [Discussions › Ideas](https://github.com/devudilip/sirigannada/discussions/categories/ideas). New books use the **New book** issue template because they need a licence check. Bugs use the **Bug** template.
2. **Wait for `accepted`.** A maintainer weighs the proposal against the mission and the legal constitution below. Accepted work becomes an issue with the `accepted` label. `needs-discussion` means not yet; `legal-review` means a source or death year must be verified first; `blocked-source` means no legally clean source exists, so do not retry it.
3. **Claim it.** Comment `/assign` on an `accepted` issue. A bot assigns you if nobody else has it. One task, one person.
4. **Branch, build, verify, PR.** Follow the sections below. The PR template checklist is the review checklist; fill it in honestly.
5. **Review.** Every PR needs a maintainer review and green CI (typecheck, tests, corpus validation, build, DCO). CI on a first-time contributor's PR waits for a maintainer to approve the run; that is a GitHub safety default, not a judgement on your work.

Unsolicited PRs, and PRs whose scope grew past the accepted issue, are closed with a pointer back to step 1. Small, complete changes merge fastest.

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

## Branch, verify, PR (never `main`)

`main` is production. Do not push commits onto it.

```bash
git fetch origin
git checkout -b feat/short-slug origin/main
# …implement…
npm run typecheck && npm test
# Exercise the change in the browser (or the closest substitute) until it works.
git commit -s
git push -u origin HEAD
gh pr create --base main
```

A maintainer reviews and merges the PR. Force-push to `main` is never allowed.

## Developer Certificate of Origin (DCO)

There is **no CLA** and **no copyright assignment**. You keep copyright in your contribution.

Every commit must include a DCO sign-off (`git commit -s`), which adds:

```
Signed-off-by: Your Name <you@example.com>
```

That certifies you have the right to submit the work under this project’s licenses (DCO 1.1: you created it, or it is already under an appropriate open license and you may submit it). See [developercertificate.org](https://developercertificate.org/).

If a commit is missing the line, amend locally with `git commit --amend -s` **before** it is pushed, or add a follow-up commit that restates the sign-off — do not rewrite history on shared branches.
