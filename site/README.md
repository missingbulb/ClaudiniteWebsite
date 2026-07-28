# site/ — claudinite.com

The static marketing site for Claudinite. No build step, no dependencies: the
directory is published as-is by [.github/workflows/deploy-pages.yml](../.github/workflows/deploy-pages.yml)
(GitHub Pages via the actions artifact flow) on every push to `main` that
touches `site/**`.

## Layout

| Path | What it is | Who edits it |
|---|---|---|
| [index.html](index.html) | The one page: evergreen copy + the four mechanism explainers | Rarely — structure and evergreen claims |
| [assets/style.css](assets/style.css) | The whole design system (tokens at the top) | Rarely |
| [assets/main.js](assets/main.js) | Animations + rendering of the promoted-content slots | Rarely |
| [data/promoted.js](data/promoted.js) | **The promoted content: stats, spotlight, pack cards, updates** | **Every promo refresh — edit this, usually nothing else** |

## Updating promoted content (the expected frequent, agentic change)

`data/promoted.js` is the single file a routine promo run edits. Contract:

- **Truthful and verifiable.** Every stat, count, and update must be checkable
  against the vendored canon packs in this repo or against its history. No
  aspirational numbers, no invented dates.
- **`updates`** — newest first, ISO `YYYY-MM-DD` dates, ≤ 140 chars, only
  shipped facts. Keep at most 6 entries; drop the oldest.
- **`spotlight`** — the 3–5 features currently being promoted, ordered; the
  first entry renders full-width (visual priority). Taglines ≤ 90 chars.
- **`packs`** — one card per canon pack. When a pack lands in or leaves the
  canon, mirror it here and refresh `stats`.
- **`canonRef`** — keep in step with the `ref` stamp in
  [../.claudinite-checks.json](../.claudinite-checks.json) (short form).
- Keep the file a plain script (`window.CLAUDINITE = {...}`) — it must run
  from `file://` with no module loader.

Evergreen sections (hero, mechanisms, adopt, FAQ) state how Claudinite works;
change them only when the product's mechanisms actually change.

## Local preview

Open `index.html` directly, or `python3 -m http.server -d site` and browse
`http://localhost:8000`.

## Custom domain

The Pages artifact flow takes its domain from the repository's Pages settings
(no `CNAME` file needed). When claudinite.com is connected there, the
`<link rel="canonical">` in `index.html` is already correct.
