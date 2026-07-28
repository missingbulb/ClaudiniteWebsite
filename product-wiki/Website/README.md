# Website

The marketing site itself as a research subject: the positioning, promoted
features, and conversion decisions behind claudinite.com (`site/` in this
repo), recorded so future passes can revisit them against evidence instead of
re-deriving them. The site is built for frequent agentic refreshes — the
rotating promo content lives in one data file
([site/data/promoted.js](../../site/data/promoted.js), contract in
[site/README.md](../../site/README.md)); this page is where the *reasoning*
behind what gets promoted accumulates.

## Positioning decisions (2026-07-28, initial)

Decisions made for launch — owner-editable calls, not researched claims; the
research they lean on is the [Market wiki](../Market/README.md):

- **Audience**: teams running Claude Code / AI coding agents across many
  repositories; the individual staff-plus engineer as the entry point.
- **Headline**: "Stop copy-pasting agent rules." Names the substrate pain
  (CLAUDE.md/AGENTS.md copies drifting) rather than the category, because the
  category ("convention packs") is unknown to cold visitors.
- **Differentiation promoted above the fold-adjacent sections**: competitors
  move *files*; Claudinite moves *enforcement (checks), procedure (skills),
  and scheduled work (tasks)* as one versioned unit — the axis the Market
  wiki identifies as the sharpest available gap.
- **Promoted features (initial four, ordered)**: enforced checks; nightly
  baselining; the growth loop; scheduled upkeep. Chosen because each is a
  mechanism competitors in the rule-sync category demonstrably lack, and each
  has a visual explanation on the page (animated: fleet sync, session loop,
  baselining board, growth loop).
- **Primary conversion action**: adopt Claudinite in a repo (the "one
  conversation to adopt" section); secondary: visit the canon repository.
  Trust reducers placed at the decision point: no server/account, vendored
  plain files, every automated change is a PR through CI, leave by deleting a
  directory.
- **Style**: monochrome ink-on-paper with one malachite accent, large
  grotesk headlines, terminal demos, generous whitespace — modeled on
  paperclip.ing's typography-led minimalism (see Sources) but with an
  ownable mineral/crystal motif; check-state semantics (red blocking, amber
  advisory, green pass) are the only other colors.
- **Honesty constraint**: no invented testimonials, stars, or adoption
  numbers anywhere on the site; social proof waits until real proof points
  exist (see Open questions).

## Site architecture for agentic updates

- Evergreen mechanism explanations are static HTML (`site/index.html`);
  rotating promo content (stats, spotlight, pack cards, dated updates) is
  data-driven from `site/data/promoted.js` and rendered client-side, so a
  scheduled promo pass edits one file and cannot break layout.
- Deploys ride GitHub Pages' artifact flow
  ([deploy-pages.yml](../../.github/workflows/deploy-pages.yml)) on pushes to
  `main` touching `site/**`; the claudinite.com domain is attached in the
  repository's Pages settings.

## Sources

- [Paperclip](https://paperclip.ing/) — the style reference: monochrome,
  typography-led SaaS landing page; hero → features → proof → one-command
  install CTA structure, FAQ for objection handling.

The competitive claims the positioning leans on are cited in the
[Market wiki](../Market/README.md), not re-cited here; decisions recorded on
this page are owner calls, not researched claims.

## Open questions

- **Social proof**: what real proof points exist to put on the site — count
  of repos on the home fleet, canon commit cadence, GitHub stars once the
  canon repo is public? The site currently ships zero testimonials/numbers
  by design.
- **Canon repo visibility**: the site's CTAs link
  `github.com/missingbulb/Claudinite` — is that repo public? If not, what
  should "Get Claudinite" point to until it is?
- **Domain + analytics**: is claudinite.com DNS connected to Pages yet, and
  do we want privacy-respecting analytics (e.g. no-cookie counters) to learn
  which promoted features draw clicks on the adopt CTA?
- **Commercial model**: the site presents Claudinite as adoptable OSS-style
  tooling with no pricing page — `product-requirements/` is still empty;
  when a business model is distilled there, the site needs a pricing/plans
  decision (relates to the Market wiki's open question on competitor
  pricing).
- **Messaging test**: does "Stop copy-pasting agent rules" outperform a
  category-first headline ("Convention packs for AI coding agents") with the
  target audience? Worth a lightweight test once traffic exists.
- **OG/social image**: the page has no raster og:image yet (SVG-only
  assets); generate one so link shares render a card.

## Growth log

- **2026-07-28** — page created alongside the initial site build: launch
  positioning, promoted-feature choices, agentic-update architecture, and
  the conversion strategy recorded; open questions seeded for future passes.
