# ಸಿರಿಗನ್ನಡ · Sirigannada

**One reliable, beautiful, legally-clean home for Kannada.**
Dictionary, classic literature, and language tools in a single offline-capable web app — built entirely on public-domain and openly licensed sources.

ಕನ್ನಡದ ನಿಘಂಟು, ಶಾಸ್ತ್ರೀಯ ಸಾಹಿತ್ಯ ಮತ್ತು ಭಾಷಾ ಸಲಕರಣೆಗಳು — ಒಂದೇ ಸ್ಥಳದಲ್ಲಿ, ಮುಕ್ತವಾಗಿ, ಸದಾ ಲಭ್ಯ.

**Live:** [sirigannada.in](https://sirigannada.in)

## Contributing

Pull requests are welcome. Keep them small, focused, and legally clean — the maintainer reviews and merges.

1. Read [CONTRIBUTING.md](CONTRIBUTING.md) (DCO sign-off, provenance rules, no CLA).
2. Open a GitHub issue first for a new book (use the template) or a non-trivial feature.
3. Fork, one change per PR, `git commit -s`, open a PR against `main`.

CI runs typecheck, tests, corpus validation, and `next build` on every PR. Do not copy code or curated data from other Kannada projects.

## Why

Kannada's digital resources are scattered, unreliable, and hostile to actual use. Government portals go dark for months; classics exist only as scanned PDFs; tools live on a dozen unrelated sites. The *data* is rich and open. The *product* has never been built. This is that product.

## Principles

1. **Legally clean.** Only public-domain texts (author died in or before 1965), Creative Commons, ODbL, or explicitly licensed content. Every document carries a provenance record. No code is copied from any other Kannada project.
2. **Actually free, forever.** Code is AGPL-3.0. Original content is CC BY-SA 4.0. Contributors keep their copyright (DCO, no assignment). The corpus is published as open data anyone can mirror.
3. **Data outlives the site.** Static-first. If this domain dies, anyone can redeploy from the repo in an afternoon.
4. **Kannada first, offline first, low-end first.** Real Unicode text, never scanned images. Works on a budget Android phone with no signal.

## Modules

| Module | Kannada | Status |
|---|---|---|
| Dictionary | ನಿಘಂಟು | MVP |
| Library (page-turn reader) | ಗ್ರಂಥಾಲಯ | MVP |
| Language tools | ಸಲಕರಣೆ | MVP (transliteration, numbers) |
| Research workbench | ಸಂಶೋಧನೆ | Planned |
| Learning | ಕಲಿಕೆ | Planned |

## Development

```bash
npm install
npm run data        # build dictionary + book data into public/data
npm run dev         # http://localhost:3000
```

How to propose a book, report a bug, and sign off commits (DCO, no CLA): [CONTRIBUTING.md](CONTRIBUTING.md). Maintainers: `docs/handbook.md` is the internal map (architecture, legal constitution, how to work).

## Data credits

- **Alar** Kannada–English dictionary © V. Krishna, licensed [ODC-ODbL](https://opendatacommons.org/licenses/odbl/). https://alar.ink
- Classic texts from [Kannada Wikisource](https://kn.wikisource.org) and the Department of Kannada & Culture's Creative Commons releases. Per-book provenance is in each book file.

## License

Code: [AGPL-3.0-or-later](LICENSE). Original content and documentation: CC BY-SA 4.0. Third-party data retains its own license as recorded in its provenance block.
