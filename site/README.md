# site/ — claudinite.com

The static marketing site for Claudinite. No build step, no dependencies: the
directory is published as-is by [.github/workflows/deploy-pages.yml](../.github/workflows/deploy-pages.yml)
(GitHub Pages via the actions artifact flow) on every push to `main` — the
workflow carries no `paths:` filter, so a push that touches nothing under
`site/` still redeploys the same content.

## Layout

| Path | What it is | Who edits it |
|---|---|---|
| [index.html](index.html) | The one page: evergreen copy framed around "your work, exponentially better" — the grow/enforce/automate/disseminate mechanism explainers, the scale tiers, and the executable-requirements workflow. Copy is deliberately terse — a claim earns its words or goes | Rarely — structure and evergreen claims |
| [assets/style.css](assets/style.css) | The whole design system (tokens at the top) | Rarely |
| [assets/main.js](assets/main.js) | Animations + rendering of the promoted-content slots | Rarely |
| [assets/analytics.js](assets/analytics.js) | Cookieless Cloudflare Web Analytics loader; no-ops until the deploy injects the token | Never — the token comes from the `CLOUDFLARE_ANALYTICS_TOKEN` repo variable |
| [privacy.html](privacy.html) | The privacy disclosure the analytics behaviour requires | When what the site collects changes — same commit as the change |
| [data/promoted.js](data/promoted.js) | **The promoted content: stats and the spotlight** | **Every promo refresh — edit this, usually nothing else** |

## Updating promoted content (the expected frequent, agentic change)

`data/promoted.js` is the single file a routine promo run edits. Contract:

- **Truthful and verifiable.** Every stat, count, and update must be checkable
  against the vendored canon packs in this repo or against its history. No
  aspirational numbers, no invented dates.
- **`spotlight`** — the 3–5 benefits currently being promoted, ordered; the
  first entry renders full-width (visual priority). Taglines ≤ 90 chars.
  Benefits, never named packs: the page shows *how many* packs there are (the
  `pack-field` graphic and the `stats` count) and never *which*, so no copy
  goes stale when the canon's pack set moves.
- **`canonRef`** — keep in step with the `ref` stamp in
  [../.claudinite-checks.json](../.claudinite-checks.json) (short form).
- Keep the file a plain script (`window.CLAUDINITE = {...}`) — it must run
  from `file://` with no module loader.

Evergreen sections (hero, mechanisms, adopt, FAQ) state how Claudinite works;
change them only when the product's mechanisms actually change.

## The footer's version tooltip

Every page's footer copyright carries the released version in its `title`, so a
visitor can name the build they are looking at. It is **generated**:
[scripts/bump-version.mjs](../scripts/bump-version.mjs) writes `package.json`
and stamps the pages in one run, and the deploy commits both — so never hand-edit
it. `node scripts/bump-version.mjs --stamp-only` repairs a drifted stamp without
consuming a version number, and the
`claudinite-website/site-version-tooltip` check fails the build when the two
disagree.

`assets/analytics.js` keeps its own placeholder,
`REPLACE_WITH_CLOUDFLARE_WEB_ANALYTICS_TOKEN`, substituted at deploy time — see
the table above.

## Example repositories

This repository is private, so it can never be the site's "see a repo running
it" example. The link points at a public member of the fleet
([GoogleCalendarEventCreator](https://github.com/missingbulb/GoogleCalendarEventCreator));
check any replacement is public before linking it.

## Local preview

Open `index.html` directly, or `python3 -m http.server -d site` and browse
`http://localhost:8000`.

## Custom domain

The Pages artifact flow takes its domain from the repository's Pages settings
(no `CNAME` file needed). When claudinite.com is connected there, the
`<link rel="canonical">` in `index.html` is already correct.
