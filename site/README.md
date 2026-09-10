# site/ — claudinite.com

The static marketing site for Claudinite. No build step, no dependencies: the
directory is published as-is by [.github/workflows/deploy-pages.yml](../.github/workflows/deploy-pages.yml)
(GitHub Pages via the actions artifact flow) on every push to `main` — the
workflow carries no `paths:` filter, so a push that touches nothing under
`site/` still redeploys the same content.

## Layout

| Path | What it is | Who edits it |
|---|---|---|
| [index.html](index.html) | The one page. The hero is the layer scene; the enforcement gap, the layer model, the promotion ladder (with the compounding chart), the two gates, convergence, the growth loop, the pack, the canon, the stated limits and adoption follow. Copy is deliberately terse — a claim earns its words or goes | Rarely — structure and evergreen claims |
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
  `pack-field` graphic and the `stats` count) and never *which*, so no copy
  goes stale when the canon's pack set moves.
- **`canonRef`** — illustrative only. It seeds the sample refs the baselining
  board animates through; it tracks nothing, because the declaration stopped
  carrying a canon `ref` when Claudinite moved to per-pack version stamps.
- Keep the file a plain script (`window.CLAUDINITE = {...}`) — it must run
  from `file://` with no module loader.

Evergreen sections (hero, mechanisms, limits, adopt, FAQ) state how Claudinite
works; change them only when the product's mechanisms actually change. What
argument those sections are making, and why they are in that order, is
[docs/messaging/MESSAGING.md](../docs/messaging/MESSAGING.md); the buyer and
user questions the page is answerable to are
[docs/messaging/QUESTIONS.md](../docs/messaging/QUESTIONS.md). A change to what
the page *claims* belongs in those two first — the page is their output.

**The limits section is not an oversight.** `#limits` names what Claudinite
does not do yet, in four cards, and it is there on purpose: the research is
explicit that the page's earlier attackable claims were retired rather than
softened, and a page that survives a teardown is worth more than one that
reads better. Do not quietly drop a card because the sentence is unflattering —
drop it when the limit is actually gone.

## The layer scene

The hero states the page's argument as a picture: three dashed bands across the
top that all *multiply* sessions, changes falling from them, one gate, and a
floor that only holds what got through. The copy beside it makes the same claim
in words; the drawing is what makes it a position rather than a boast.

Three things in it are load-bearing rather than decorative:

- **The three bands are unlabelled by vendor, and stay that way.** They are
  named for what they do — orchestrators, cockpits, marketplaces — so the
  drawing does not date when a product does, and so the page never has to
  defend a characterisation of somebody's roadmap.
- **Two changes are turned back, with the fix named.** A gate that only ever
  passes things is not a gate; a gate that only rejects is a wall. The mix is
  the message, and so is the red label — the finding says what to do.
- **The drawing is authored visible.** With scripting off, or between loop
  passes, it still reads: the bands, the gate and the floor are all in the
  static state, and the beats only move the changes and resolve the gate. This
  is the same discipline the compounding chart follows.

Staging is driven by cumulative beat classes `.b1`…`.b4` that
[assets/main.js](assets/main.js) adds to the SVG on a timer — every visual state
is a CSS rule keyed off a beat, so beats stay editable and the loop reset is
just dropping the classes. Reduced motion applies all four at once, which
states the destination rather than the journey.

**It is hidden below 720px, deliberately.** The figure is 960 user units wide,
so on a phone every label in it renders at about a third of its authored size —
illegible, and not fixable by enlarging text that then no longer fits. The same
content is carried there by the layer list in `#layers`, which is real
selectable text and reads better on a phone than the drawing ever would.

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
