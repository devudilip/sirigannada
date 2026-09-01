# Sirigannada brand guide

## Name

**ಸಿರಿಗನ್ನಡ** · Latin: **Sirigannada** (always one word, capital S only). From *ಸಿರಿಗನ್ನಡಂ ಗೆಲ್ಗೆ* — "may rich Kannada triumph" — the refrain associated with Kavirajamarga (c. 850 CE), the oldest surviving Kannada literary work. The name claims the whole heritage without naming any single genre or era.

Domain: `sirigannada.in`.

## Mark

The mark is the letter **ಸಿ** — the initial of the name — set in Noto Serif Kannada Bold as a true vector outline (never a raster of a font), in ivory on a kumkum-red rounded square, resting on an open book drawn as a single turmeric curve.

| File | Use |
|---|---|
| `public/brand/logo-mark.svg` | Primary mark. App icon, social avatar, splash. |
| `public/brand/logo-mark-mono.svg` | Glyph + book in `currentColor`, no background. Inline in nav, footers, print. |
| `public/favicon.svg` | Browser tab. Slightly enlarged glyph for 16px legibility. |
| `public/icons/icon-192.png`, `icon-512.png` | PWA `any` icons. |
| `public/icons/icon-maskable-512.png` | PWA `maskable` icon — content sits inside the 80% safe zone. |
| `public/icons/apple-touch-icon.png` | iOS home screen (180px). |

Rules: never stretch, recolor outside the palette, add effects, or place the mark on a busy background. Minimum clear space around the mark equals the book curve's height. The wordmark is always live text in the loaded web font (`<Wordmark />` component), never an image, so it stays sharp, selectable, and accessible.

## Color

| Token | Light | Dark | Role |
|---|---|---|---|
| `accent` | `#B3122B` kumkum | `#E23A55` | Primary actions, links, mark background |
| `gold` | `#E8A317` turmeric | `#F0B53A` | Highlights, progress, the book curve. Sparingly. |
| `paper` | `#FBF6EA` ivory | `#1A1714` | Reading surface |
| `surface` | `#FFFDF8` | `#151311` | App background |
| `text` | `#1C1917` ink | `#F2EDE3` | Body text |

Most of every screen is paper/surface and ink. Red is for the one thing that matters on the screen; gold is for delight. If a screen has more than two red elements, one of them is wrong.

## Typography

- **Reading** (definitions, books): Noto Serif Kannada. Body 17px+, line-height 1.75.
- **Interface**: Anek Kannada (variable). Latin falls back to its built-in Latin set, so mixed-script UI stays consistent.
- Kannada leads; English follows in the same style one step smaller or lighter. Never English above Kannada.

## Voice

Warm, precise, unhurried — like a good librarian. Kannada copy is standard modern written Kannada (ಗ್ರಾಂಥಿಕ but not archaic). No exclamation marks in UI. No slogans about "saving" the language; we just make it usable.
