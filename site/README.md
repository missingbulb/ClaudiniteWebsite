# site/ — claudinite.com

The static marketing site for Claudinite. No build step, no dependencies: the
directory is published as-is by [.github/workflows/deploy-pages.yml](../.github/workflows/deploy-pages.yml)
(GitHub Pages via the actions artifact flow) on every push to `main` — the
workflow carries no `paths:` filter, so a push that touches nothing under
`site/` still redeploys the same content.

## Layout

| Path | What it is | Who edits it |
|---|---|---|
| [index.html](index.html) | The one page. The hero is the two gates; the layer stack, what runs when, the promotion ladder, the fleet, the growth ring, the data flow, the pack, the audiences, the limits band, adoption and the FAQ follow. Copy is deliberately terse — a claim earns its words or goes | Rarely — structure and evergreen claims. What the page *claims* starts in [docs/messaging/MESSAGING.md](../docs/messaging/MESSAGING.md); the page follows the brief |
| [assets/style.css](assets/style.css) | The whole design system (tokens at the top) | Rarely |
| [assets/main.js](assets/main.js) | Animations + rendering of the promoted-content slots | Rarely |
| [assets/analytics.js](assets/analytics.js) | Cookieless Cloudflare Web Analytics loader; no-ops until the deploy injects the token | Never — the token comes from the `CLOUDFLARE_ANALYTICS_TOKEN` repo variable |
| [privacy.html](privacy.html) | The privacy disclosure the analytics behaviour requires | When what the site collects changes — same commit as the change |
| [data/promoted.js](data/promoted.js) | **The promoted content: stats and the spotlight** | **Every promo refresh — edit this, usually nothing else** |

## Updating promoted content (the expected frequent, agentic change)

`data/promoted.js` is the single file a routine promo run edits. Contract:

- **Truthful and verifiable.** Every stat, count, and update must be checkable
  against the canon or against this repo's history. No aspirational numbers, no
  invented dates. The `stats` counts are **canon-wide**, and nobody counts them by
  hand: the weekly `site-stats` task recomputes all four from a canon checkout and
  lands the difference, so a promo run edits the spotlight and leaves the numbers
  alone. Its README is where the counting rules live.
- **`spotlight`** — the 3–5 benefits currently being promoted, ordered; the
  first entry renders full-width (visual priority). Taglines ≤ 90 chars.
  Benefits, never named packs: the page shows *how many* packs there are (the
  `stats` count) and never *which*, so no copy goes stale when the canon's pack
  set moves.
- **`canonRef`** — illustrative only. It seeds the sample refs the baselining
  board animates through; it tracks nothing, because the declaration stopped
  carrying a canon `ref` when Claudinite moved to per-pack version stamps.
- Keep the file a plain script (`window.CLAUDINITE = {...}`) — it must run
  from `file://` with no module loader.

Evergreen sections (hero, mechanisms, limits, adopt, FAQ) state how Claudinite
works; change them only when the product's mechanisms actually change — and
when one does, the *limits* band is the first place to re-read, because it
states what the product does not do yet and goes false the moment it does.

## The figures

The page argues in pictures so the copy can stay terse: every figure is
literal SVG in `index.html`, so the argument stands with scripting off, and
[assets/main.js](assets/main.js) only animates a way in, gated by
`prefers-reduced-motion` with a still frame that states the destination. What
is load-bearing in each, and must survive an edit:

- **The two gates** (hero). Changes from several sessions cross a stop gate and
  a CI gate before they land on `main`. A gate that only passes things is not a
  gate: at least one change must turn back with its fix named, and `main` must
  hold only what got through.
- **The stack as a building** (the gap). Four floors compose on one foundation,
  and the foundation is the only floor stamped as checking anything. The claim
  is *exactly one layer enforces*; drawing a second stamp anywhere breaks it.
- **The ladder** (context). Rungs rise from prose to platform setting; the
  meter beside drains as a rule climbs. Cost and force move together — a rung
  that costs less must also bind harder, or the ladder lies.
- **The growth ring** (loop). Session → transcript → local pack → canon →
  every repo, and back. The canon node is the only accent: promotion into it is
  the gated step.
- **The data flow** (trust). Static on purpose. Exactly three arrows — the
  canon in, the session out to Anthropic as before, promoted lessons back out
  with an opt-out — and the empty space labelled as having no Claudinite
  server. Adding an arrow is a disclosure change, and [privacy.html](privacy.html)
  moves in the same commit.

The figures assert **no magnitudes**: the terminal's counts are the ones a real
session prints, and nothing else on the page carries a number the canon does
not.

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

The site links a repository that visibly runs Claudinite; today that is
[GoogleCalendarEventCreator](https://github.com/missingbulb/GoogleCalendarEventCreator).

## Local preview

Open `index.html` directly, or `python3 -m http.server -d site` and browse
`http://localhost:8000`.

## Custom domain

The Pages artifact flow takes its domain from the repository's Pages settings
(no `CNAME` file needed). When claudinite.com is connected there, the
`<link rel="canonical">` in `index.html` is already correct.
