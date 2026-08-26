# site/ — claudinite.com

The static marketing site for Claudinite. No build step, no dependencies: the
directory is published as-is by [.github/workflows/deploy-pages.yml](../.github/workflows/deploy-pages.yml)
(GitHub Pages via the actions artifact flow) on every push to `main` — the
workflow carries no `paths:` filter, so a push that touches nothing under
`site/` still redeploys the same content.

## Layout

| Path | What it is | Who edits it |
|---|---|---|
| [index.html](index.html) | The one page. The hero is the desk scene; the ceiling, the three multipliers (opening with the compounding chart), the pack, the scale tiers and the executable-requirements workflow follow. Copy is deliberately terse — a claim earns its words or goes | Rarely — structure and evergreen claims |
| [assets/style.css](assets/style.css) | The whole design system (tokens at the top) | Rarely |
| [assets/main.js](assets/main.js) | Animations + rendering of the promoted-content slots | Rarely |
| [assets/analytics.js](assets/analytics.js) | Cookieless Cloudflare Web Analytics loader; no-ops until the deploy injects the token | Never — the token comes from the `CLOUDFLARE_ANALYTICS_TOKEN` repo variable |
| [privacy.html](privacy.html) | The privacy disclosure the analytics behaviour requires | When what the site collects changes — same commit as the change |
| [data/promoted.js](data/promoted.js) | **The promoted content: stats and the spotlight** | **Every promo refresh — edit this, usually nothing else** |

## Updating promoted content (the expected frequent, agentic change)

`data/promoted.js` is the single file a routine promo run edits. Contract:

- **Truthful and verifiable.** Every stat, count, and update must be checkable
  against the canon or against this repo's history. No aspirational numbers, no
  invented dates. The `stats` counts are **canon-wide**, and this repo mounts
  only the packs it declares, so they are not countable from `.claudinite/`:
  count them in a checkout of the canon, from `packs/directory.GENERATED.md`
  (the pack count, and the pack list every other count sums over) and each
  pack's `README.md` — its check tables for the checks, its `skills/` and
  `tasks/` directories for the other two. Packs the directory omits (a `hidden`
  pack such as the canary) are not adoptable and count for nothing.
- **`spotlight`** — the 3–5 benefits currently being promoted, ordered; the
  first entry renders full-width (visual priority). Taglines ≤ 90 chars.
  Benefits, never named packs: the page shows *how many* packs there are (the
  `pack-field` graphic and the `stats` count) and never *which*, so no copy
  goes stale when the canon's pack set moves.
- **`canonRef`** — illustrative only. It seeds the sample refs the baselining
  board animates through; it tracks nothing, because the declaration stopped
  carrying a canon `ref` when Claudinite moved to per-pack version stamps.
- Keep the file a plain script (`window.CLAUDINITE = {...}`) — it must run
  from `file://` with no module loader.

Evergreen sections (hero, mechanisms, adopt, FAQ) state how Claudinite works;
change them only when the product's mechanisms actually change.

## The desk scene

The hero is a narrative loop: one operator's desk over eight beats, from a
single screen and constant typing to six clean workstreams and a person who
only approves. It carries the same argument the chart makes, in the register
the chart cannot reach — what it feels like.

Two things in it are load-bearing rather than decorative, and must survive any
edit:

- **The assistant is born from the cruft.** The agent accretes barnacles and
  moss as it grows, and that accretion is what gets stripped and crystallised
  into the small precise robot. If the robot simply arrives from outside, the
  scene stops being about promotion and becomes "he added a second AI".
- **Motion signature.** The agent eases and breathes; the robot moves in
  `steps()` and blinks on a metronome. Organic versus deterministic is doing
  the work of a label neither one carries.

The agent is deliberately **our own pentagon**, never a third party's mark: the
thing that decays in this story is an unmanaged corpus, not somebody's model.

Staging is driven by cumulative beat classes `.b1`…`.b8` that
[assets/main.js](assets/main.js) adds to the SVG on a timer — every visual state
is a CSS rule keyed off a beat, so beats stay editable and the loop reset is
just dropping the classes. Reduced motion applies all eight at once, which
freezes the destination rather than the struggle.

## The compounding chart

Below the fold, opening "What compounds", the chart is the argument's proof: a
prose-only corpus saturates once its rules fill the context budget, and
promoting prose into checks keeps freeing that budget so the curve never has to
flatten. A faded version of the same exponential runs behind the hero scene.

It is **schematic and asserts no magnitudes** — the axes carry no numbers, and
the FAQ says so outright. Keep it that way: putting real-looking figures on it
would claim a measurement nobody has made.

Both curves, the shaded gap between them and the meters' end states are
authored as literal geometry in `index.html`, generated from the closed-form
curves recorded in this repo's history. [assets/main.js](assets/main.js) only
animates the reveal, so the argument still stands with scripting off or with
`prefers-reduced-motion` set. If you change the shape of either curve, the
plateau marker, the gap path and the meter that explains the plateau all have
to move with it — they are one drawing, not four.

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
