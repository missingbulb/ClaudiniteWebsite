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

- The headline names the enforcement gap, not the category — "convention packs" means nothing to a cold visitor.
- The page's strongest asset is Anthropic's own sentence: CLAUDE.md is "context, not enforced configuration."
- Promoted differentiation: rivals check the rules arrived; Claudinite checks they were followed. Still true 2026-08-21.
- Three benefits carry the page — rules that bite, a fleet that converges itself, lessons that travel; the rest is mechanism.
- The four attackable claims are fixed, which cost a promise: adoption is now "one conversation, then one wire-up".
- Show how many packs exist, never which: names date the copy. Copy is down ~46% — visuals carry it.
- No invented testimonials, stars or adoption numbers until real proof points exist — hence zero social proof today.

## Messaging refocus (2026-08-21)

Owner-directed pass (repo issue #233): re-research, re-evaluate the benefits,
and cut the word count hard. What changed and why:

- **Headline** moved from "Stop copy-pasting agent rules." to "Rules your
  agent can't skip." The copy-paste pain is real but shared with the
  rule-sync category, which sells the copy-paste fix; the enforcement gap is
  the axis nobody else claims (Market wiki) and is now vendor-stated.
- **One quotation, no other proof.** Anthropic's memory doc — "Claude treats
  them as context, not enforced configuration" — is placed at the top of the
  Why section, cited to the primary page. It is the only quotation on the
  site, and it does the arguing three paragraphs used to do. This does not
  breach the no-social-proof constraint: it is a vendor doc, not a
  testimonial.
- **Prose cut from ~1,000 to ~620 visible words** (excluding the terminal
  transcripts). Every mechanism keeps its animation and its heading and
  loses its explanatory paragraph; bullets became fragments. The bet: the
  visuals were always carrying the explanation, and the prose was insurance.
- **The promoted spotlight now names benefits, not features** — "rules that
  bite", "the fleet converges itself", "lessons travel", "upkeep runs
  itself" — matching the Positioning wiki's three-benefit distillation.
- **The four attackable claims are retired**: "the same sweep runs again in
  CI" → "the repo-facing ones run again in CI"; "leave by deleting a
  directory and two hook entries" → the FAQ now lists all four artifacts;
  "one conversation to adopt" → "One conversation, then one wire-up", with
  the manual runner step named as step 3; and "AI coding agents" → Claude
  Code, with a FAQ entry saying so plainly.

## What the site may not name (2026-08-21)

Two constraints the owner set, both about what the page *shows* rather than
what it claims:

- **This repository is private, so it can never be the site's example.** The
  "see a repo running it" CTA and the footer's "this site's repo" link both
  pointed here; both are gone. The example is now a public member of the
  fleet, [GoogleCalendarEventCreator](https://github.com/missingbulb/GoogleCalendarEventCreator)
  (visibility verified before linking). Any future example needs the same
  check — a private repo's link is a dead end for every visitor and an
  unintended disclosure of what the fleet contains.
- **No individual packs.** No per-pack cards, no pack names, no check, skill
  or task names anywhere on the page. What replaces them is a graphic — a
  field of pack glyphs with a handful lit, captioned "declare the ones you
  want" — which carries the two facts that matter (there are many; you
  choose) and dates only when the *count* changes, not when the canon's pack
  set moves. The `updates` feed went with them: dated entries are a
  maintenance debt the page was not paying.

The footer now reads `© 2026 MissingBulb` and carries the released version in
its `title` tooltip, substituted into the artifact at deploy time from the
same bump the release performs — so the number always names the build a
visitor is looking at.

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
  ([deploy-pages.yml](../../.github/workflows/deploy-pages.yml)) on every
  push to `main` (the workflow carries no `paths:` filter); the
  claudinite.com domain is attached in the repository's Pages settings.

## Sources

- [Claude Code docs: memory](https://code.claude.com/docs/en/memory) — the source of the one quotation the page carries, "Claude treats them as context, not enforced configuration" (primary page, opened directly 2026-08-21)
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

- **2026-08-21** — owner feedback on the just-released page (repo issue #235):
  the private-repo example removed, per-pack detail replaced by a graphic, the
  footer re-attributed with a version tooltip, and another ~90 words cut.
  Recorded above as the may-not-name section. `## Key insights` gained the
  show-the-count-never-the-names finding; the cut figure updated.

- **2026-08-21** — owner-directed messaging refocus (repo issue #233). New
  research first (Market wiki: Anthropic's own docs state the
  context-is-not-enforcement premise; the AGENTS.md request closed on an
  import; auto memory is machine-local; Ruler re-read and still
  distribution-only), then the benefit re-evaluation (Positioning wiki: three
  benefits carry the product), then the page. Recorded above as the messaging
  refocus section. Two standing open questions closed by being *done* rather
  than answered — sharpen the differentiation line, and fix the four
  attackable claims — and three new ones opened about what the cut might
  have cost. `## Key insights` rewritten: five of seven bullets changed,
  because the page's top-line understanding of what the site should say
  changed.

- **2026-07-28** — page created alongside the initial site build: launch
  positioning, promoted-feature choices, agentic-update architecture, and
  the conversion strategy recorded; open questions seeded for future passes.
- **2026-07-31** — ecosystem research pass: the competitor-marketing open
  question is answered (no rival headline claims enforcement — message
  holds, with a Ruler file-drift footnote), the commercial-model question
  now points at the new Business wiki and requirements proposal, and two new
  copy-facing questions added (sharpen the enforcement line; fix the four
  attackable claims the Positioning wiki identifies).
