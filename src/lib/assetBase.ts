/**
 * Where picture-book illustrations and narration are served from: an R2 bucket behind
 * `assets.sirigannada.in`, not the Pages deploy (which is capped at 20,000 files). Source data
 * keeps `/data/picturebooks/<slug>/<file>` paths; `npm run data:picturebooks` rewrites them to
 * `${PICTUREBOOK_ASSET_BASE}/picturebooks/<slug>/<file>`, and the service worker is told the
 * same base so it can cache those cross-origin files. Override with
 * NEXT_PUBLIC_PICTUREBOOK_ASSET_BASE (an origin, no trailing slash) to test against a local server.
 */
export const PICTUREBOOK_ASSET_BASE = (process.env.NEXT_PUBLIC_PICTUREBOOK_ASSET_BASE ?? "https://assets.sirigannada.in").replace(/\/+$/, "");
