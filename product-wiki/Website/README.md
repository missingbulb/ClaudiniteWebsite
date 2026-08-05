# Website

The marketing site itself as a research subject: the positioning, promoted
features, and conversion decisions behind claudinite.com (`site/` in this
repo), recorded so future passes can revisit them against evidence instead of
re-deriving them. The site is built for frequent agentic refreshes — the
rotating promo content lives in one data file
([site/data/promoted.js](../../site/data/promoted.js), contract in
[site/README.md](../../site/README.md)); this page is where the *reasoning*
behind what gets promoted accumulates.

## Key insights

- The headline names the substrate pain, not the category — "convention packs" means nothing to a cold visitor.
- Promoted differentiation is the Market wiki's sharpest gap: rivals move files, Claudinite moves enforcement and procedure.
- The 2026-07-31 competitor check holds the message: no rival's headline claims enforcement (one file-drift-CI footnote: Ruler).
- A sharper line is now available: rivals check the rules arrived; Claudinite checks the rules are followed.
- Four site claims are attackable in a teardown: CI-sweep scope, leave story, one-conversation adopt, generic "AI agents".
- A scheduled promo pass edits one data file and cannot break layout; mechanism explanations stay static HTML.
- No invented testimonials, stars or adoption numbers until real proof points exist — hence zero social proof today.

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
  ([deploy-pages.yml](../../.github/workflows/deploy-pages.yml)) on every push
  to `main`; the claudinite.com domain is attached in the
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
- **Commercial model**: the research side now exists — the
  [Business wiki](../Business/README.md) collects archetypes and price
  anchors, and the requirements sink carries a proposed model — but the site
  still ships no pricing page; a pricing/plans decision is an owner call
  waiting on the requirements distillation being accepted.
- **Sharpen the differentiation line?** The 2026-07-31 competitor scan
  (Market wiki) found five rivals now advertise CI-failable *config-drift*
  checks, so "rivals move files" alone will age; the sharper candidate is
  "they check the rules arrived; we check the rules are followed." Worth a
  copy pass on hero/differentiation sections.
- **Fix the four attackable claims** (Positioning wiki, gap 9): "same sweep
  in CI" (CI runs world-scope checks only), "leave by deleting a directory
  and two hook entries" (undercounts the wiring), "one conversation to
  adopt" (executor routine setup is real work), and generic "AI coding
  agents" framing (Claude Code only today). Each has a truthful tightening
  that costs little.
- **Messaging test**: does "Stop copy-pasting agent rules" outperform a
  category-first headline ("Convention packs for AI coding agents") with the
  target audience? Worth a lightweight test once traffic exists.
- **OG/social image**: the page has no raster og:image yet (SVG-only
  assets); generate one so link shares render a card.

## Growth log

- **2026-07-28** — page created alongside the initial site build: launch
  positioning, promoted-feature choices, agentic-update architecture, and
  the conversion strategy recorded; open questions seeded for future passes.
- **2026-07-31** — ecosystem research pass: the competitor-marketing open
  question is answered (no rival headline claims enforcement — message
  holds, with a Ruler file-drift footnote), the commercial-model question
  now points at the new Business wiki and requirements proposal, and two new
  copy-facing questions added (sharpen the enforcement line; fix the four
  attackable claims the Positioning wiki identifies).
