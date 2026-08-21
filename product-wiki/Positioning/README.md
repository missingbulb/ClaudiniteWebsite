# Positioning

Claudinite's strengths, market position, and the candid gaps in the offering
— the synthesis page that reads the [`Market/`](../Market/README.md),
[`Methods/`](../Methods/README.md), [`Business/`](../Business/README.md) and
[`Customers/`](../Customers/README.md) research against what the product
actually ships today (assessed from the vendored implementation in this
repo, cited as `repo:` paths). Positioning *decisions* for the marketing
site stay in [`Website/`](../Website/README.md); requirement candidates go
through [`product-requirements/`](../product-requirements/README.md).

## Key insights

- Anthropic's own docs now say rules are "context, not enforced configuration" — the benefit claim needs no argument, only a citation.
- The moat and the message are one trio: rules that bite, a fleet that converges itself, lessons that travel. The rest is mechanism.
- The sharpest line available: rivals check the rules *arrived*; Claudinite checks the rules are *followed*.
- Hard-coded single-tenant canon, Claude-Code-only, GitHub-only: the three gaps between today's repo and a sellable product.
- Versioning is track-canon-head with no pinning or rollback — the opposite of what every winning comparable shipped.
- SEO white space is real: multi-repo consistency and enforcement queries rank only blogs; "sync rules" is already taken.
- "Context engineering" has the borrowed credibility; "AI-ready codebase" is unclaimed; "rules management" never formed.

## What Claudinite actually is (offering inventory)

Assessed from the vendored engine and packs in this repository (grounding
files cited as `repo:` paths), the product is deeper than the rule-sync
category on every axis:

- A **spec-validated pack model**: each pack is a `pack.mjs` manifest
  carrying always-loaded RULES.md prose, on-demand skills, deterministic
  checks split into work-scope (Stop hook, with session transcript) and
  world-scope (CI), scheduled tasks, adoption-interview questions,
  dependencies and cross-pack contributions
  (`repo:.claudinite/shared/engine/pack_loader/pack-schema.mjs`).
- **Session enforcement** through four Claude Code hooks, with blocking
  findings that hold the session open until fixed and a self-limiting loop
  guard (`repo:.claudinite/shared/engine/hooks/`).
- A **stateless hourly scheduler** watermarked off the GitHub Actions run
  ledger, with exactly-once labeled dispatch issues, dead-claim reclamation,
  and outcome ceilings verified in code — hardening born of documented
  production incidents (`repo:.claudinite/shared/engine/scheduler/`).
- **Nightly baselining**: deterministic re-vendor of the canon, wiring
  convergence, mechanical migrations, one auto-merged maintenance PR
  (`repo:.claudinite/shared/packs/basics/tasks/update/worker.mjs`).
- A **growth loop implemented end-to-end repo-side**: conversation capture
  with secret scrubbing, lesson extraction, canon dedup, prose-to-checks
  conversion, and a skill-usage metrics fold with denominators
  (`repo:.claudinite/shared/packs/grow_with_claudinite/`).
- **Barriers**: a language-agnostic folder-access-graph engine enforcing
  declared isolation walls (`repo:.claudinite/shared/packs/barriers/`).

## Strengths (structurally hard to copy)

1. **Enforcement depth.** Checks that block the agent's session *and* gate
   CI, with what/why/fix findings and reason-required acceptances. Matching
   this requires a hook runtime, a two-scope check engine, and a config
   model — not a sync script. No rival ships any of it (Market wiki).
2. **The convergence loop.** Default-on nightly auto-PRs from a canon. The
   enterprise category norm is observe-and-nudge scorecards; the one
   remediating product (OpsLevel's Tidra) is campaign-driven, not
   continuous. The DIY precedent (cruft's weekly drift-PR recipe) never
   productized (Methods wiki).
3. **The measured growth cycle.** Sessions → captured logs → local packs →
   dedup → canon, with usage metrics. Claude Code's native analog (auto
   memory) is explicitly machine-local and never shared; no rival has any
   analog (Market wiki).
4. **The no-runtime-service trust shape.** Plain vendored files, the
   consumer's own CI, every automated change a PR, leave by deleting files.
   This sidesteps the ops-cost failure mode of self-hosted IDPs and eases
   the enterprise data-flow review ("code never leaves our environment" is a
   documented approval accelerant — Customers wiki), and it is a shape a
   hosted-registry competitor cannot copy without giving up its model.

The unattended-operation hardening (incident-derived dispatch guards,
recovery, escalation) is a fifth, quieter moat: it is the difference between
a demo and a fleet that runs unattended, and it lives in engine code rather
than prose.

## Market position

- **Against the rule-sync category** (ruler, rulesync, knowhub, ai-rules-sync
  and the sub-100-star swarm): Claudinite is the only entrant whose checks
  target the *work product* rather than config-file drift. The honest line:
  *they check the rules arrived; Claudinite checks the rules are followed.*
  The category is free OSS — competing on price is impossible; competing on
  the loop (enforcement + convergence + growth) is uncontested.
- **Against the native platform** (plugins, marketplaces, managed settings):
  complementary today, absorbing tomorrow. Plugins converge clients, not
  repos; nothing native runs CI checks, opens convergence PRs, or shares
  learnings. The right posture is to *ride* the native layer (distribute
  session assets as a plugin; emit SKILL.md-standard skills) while owning
  the repo-side loop — and to watch absorption pace (three major native
  features shipped in nine months; Peril is the cautionary tale).
- **Against enterprise scorecards** (Cortex, Port, OpsLevel): they sell
  observation dashboards to leadership; Claudinite sells remediation
  mechanics to the repo. Cortex's own marketing ("AI is writing your code.
  Who's watching your standards?") validates the thesis and educates the
  buyer. Scorecard vendors lack repo-vendored convention authoring and
  continuous convergence; Claudinite lacks their aggregation pane — which is
  the natural partnership/roadmap seam.
- **Category language**: "context engineering" (Karpathy/Anthropic-backed)
  is credible to attach to as *context engineering at fleet scale*, without
  claiming the term; "AI-ready codebase" is unclaimed blog-tier territory
  Claudinite could own; "spec-driven development" (spec-kit, 124.7k ★) is
  adjacent but per-feature, not fleet conventions; "rules management" never
  formed and should be an SEO modifier only.
- **SEO reality** (Market wiki): "sync CLAUDE.md across repos" is already
  taken by rulesync.dev; the enforcement and multi-repo-consistency queries
  ("enforce AI coding standards CI", "keep AGENTS.md consistent multiple
  repositories") rank only blog content — harvestable white space aligned
  with the differentiation.

## Gaps in the offering (candid)

Ordered by how directly they block the customer segments the research
profiles:

1. **Single-canon, single-tenant hard-coding.** The baselining worker clones
   `https://github.com/missingbulb/Claudinite.git` (must be public);
   preferences fetch from that repo's raw URL; fleet enumeration is
   owner-affiliation over a personal PAT
   (`repo:.claudinite/shared/packs/basics/tasks/update/worker.mjs`). A
   customer cannot point consumers at their own canon without editing engine
   code — yet a private canon in their own tenancy ranks #3 on the
   enterprise requirements list (Customers wiki). Today "commercial product"
   and "one person's public personal repo" are the same object.
2. **Claude Code-only.** Rules inject via Claude Code hooks; skills mount as
   `.claude/skills/` symlinks; model families are Anthropic-only. Nothing
   emits AGENTS.md, Cursor rules, or Copilot instructions
   (`repo:.claudinite/shared/engine/scheduler/converge-wiring.mjs`).
   Enterprises demonstrably run multi-tool fleets and converge on AGENTS.md
   (near-blocker #2, Customers wiki) — though Claude Code being the
   fastest-growing, best-loved agent (18% and climbing) makes this a
   defensible *sequencing* choice rather than a mistake. The 2026-08-02 pass
   adds a second reason it is sequencing rather than a closing window:
   AGENTS.md support has been the loudest unshipped request in Anthropic's own
   tracker for eleven months (#6235, 4,487 👍 — Market and Customers wikis),
   so the platform is not about to absorb the interop bridge. The same finding
   raises the cost of *not* emitting: cross-vendor interop is the single
   most-demanded capability in the agent-config space, and Claudinite
   currently emits none of it.
3. **No pinning, no rollback, no release channels.** Versioning is a single
   whole-corpus sha stamp always converged to canon head; a bad canon change
   propagates fleet-wide in one cycle, gated only by per-repo CI and the
   `review` delivery option (`repo:.claudinite-checks.json`). Every winning
   comparable shipped pins plus bot-PR updates (Methods wiki); pin-less live
   tracking was only ever chosen by operators who owned the runtime.
4. **GitHub-only end to end.** Scheduler = Actions cron; dispatch = issues;
   delivery = GitHub API auto-merge; no GitLab/Bitbucket story
   (`repo:.claudinite/shared/engine/scheduler/signals/gh.mjs`).
5. **No fleet reporting.** Observability is per-repo (Actions summaries,
   hook log, tracker issues, a usage JSON). A buyer asking "is this working
   across my 40 repos?" reads issues repo by repo. Scorecard-educated
   buyers expect an aggregation pane, and the DevEx champion needs an ROI
   slide (Customers wiki).
6. **The executor path isn't self-installing.** The engine 3→4 update
   (2026-08-14) flipped the default dispatch mechanism from the label-wired
   `[claudinite-task]` routine to a work-item queue; converge-wiring now
   auto-generates the queue's workflow scaffolding and stamps every declared
   secret's *name* into it, but the agent hand-off itself still needs a human
   to create a per-account Claude Code Web routine, copy its trigger URL into
   `taskScheduler.endpoints`, and set the secret's actual *value*
   (`repo:.claudinite/shared/engine/scheduler/converge-wiring.mjs`,
   `repo:.claudinite/shared/engine/scheduler/queue/invoke.mjs`). This repo hit
   the gap directly: for about a day and a half after the flip, every
   agentic work item silently parked in the queue — the precondition fails
   before it ever looks for a token, so nothing signals the miswiring short
   of a human reading a dispatch comment — until the endpoint was declared
   and the token stamped (PR #186). Adoption cost is therefore higher than
   "one conversation," and now concretely: a repo can go dark on agentic
   dispatch for days with no check catching it.
7. **No discovery/registry surface.** Finding adoptable packs means cloning
   the canon and listing `packs/`. The content ecosystems (aitmpl at 30k ★,
   skills.sh) show discovery is its own gravity well.
8. **Platform prerequisites.** Node ≥18 plus bash hooks — native Windows
   without WSL is effectively unsupported; monorepos unaddressed
   (`repo:.claude/settings.json`).
9. **Site-claim edges.** The site's core mechanism claims verify against the
   implementation, but four are attackable in a teardown: "the same sweep
   runs again in CI" (CI runs world-scope only; transcript checks never run
   in CI), "leave by deleting a directory and two hook entries" (it is four
   hooks, a workflow, a CI step and a manifest), "one conversation to adopt"
   (bootstrap + executor wiring say otherwise), and the generic "AI coding
   agents" framing (Claude Code only) (`repo:site/index.html`).

## Sources

This is a synthesis page: repo-grounded claims cite `repo:` paths inline
above (the vendored implementation in this repository is their primary
source), and market claims are synthesized from the sibling wikis —
[Market](../Market/README.md) (rival capabilities, native-platform coverage,
category language, SEO scan), [Methods](../Methods/README.md) (pin+bot-PR
pattern, Peril absorption, format-API lesson),
[Business](../Business/README.md) (price bands, archetypes) and
[Customers](../Customers/README.md) (segment triggers, ranked enterprise
requirements) — where each claim carries its own primary-URL citation.
Sources used directly on this page:

- [Cortex: AI is writing your code. Who's watching your standards?](https://www.cortex.io/post/ai-is-writing-your-code-whos-watching-your-standards) — the thesis-validating quote used directly on this page
- [Andrej Karpathy on context engineering](https://x.com/karpathy/status/1937902205765607626) and [Anthropic: effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — category-language claims used directly on this page
- [github/spec-kit](https://github.com/github/spec-kit) — 124.7k ★ (verified via GitHub API 2026-07-31)

## Open questions

- Which gap to close first is a strategy call the wiki cannot make: private
  canon (unlocks enterprise), AGENTS.md emission (unlocks multi-tool
  fleets), or pinning/channels (de-risks every fleet) — the requirements
  sink proposes an ordering; the owner decides. New evidence for the second
  of the three as of 2026-08-21: the AGENTS.md demand signal (#6235,
  4,944 👍) is the largest quantified demand in the research set, and its
  `completed` close on an import rather than native reading makes the
  interop whitespace durable — see Market and Customers.
- Can the aggregation-pane gap be closed by *feeding* existing scorecard
  products (a Cortex/Port integration exposing pack-conformance facts)
  instead of building a dashboard? Would turn the from-above encroachers
  into channels.
- What does distributing Claudinite's session assets as a Claude Code
  plugin actually look like (plugin wrapping the pack mount), and does it
  strengthen or cannibalize the vendored model?
- Is there a measured cost story (Actions minutes, API calls) for the
  hourly scheduler plus nightly baselining at 50+ repos? Needed before any
  per-repo pricing claim.
- The canon repo's own contents (bootstrap.md, sheepdog, promote task) are
  not vendored here — canon-side capabilities were inferred from
  references; verify before printing claims about them.
- No check in this repo (checked 2026-08-16) catches an undeclared
  invocation endpoint — the queue just parks work items silently. Is that
  gap closed anywhere in canon, or does every member risk the same
  multi-day dark spell this repo hit (PR #186)?

## Growth log

- **2026-08-21** — benefit re-evaluation pass, commissioned to refocus the
  site (repo issue #233). The three strengths that survive a cold read are
  enforcement, convergence and travelling lessons; strengths 1 and 3 gained
  vendor-primary citations rather than argued ones (Market wiki: "context,
  not enforced configuration"; auto memory "machine-local"), which is what
  lets the site state them in a line instead of a paragraph. Gap 2's
  evidence updated for #6235's `completed` close on an import. `## Key
  insights` gained the vendor-states-the-premise finding and the
  three-benefit distillation; nothing was superseded.

- **2026-08-16** — spot-check pass (Context: the product-wiki tree moved in
  the engine 3→4 window). Gap 6 was stale on two counts: it cited the
  retired `[claudinite-task]`/`ready-for-agent` label mechanism instead of
  the current work-item queue, and it understated how much of the wiring
  the engine now auto-generates (converge-wiring stamps the queue's
  workflows and secret names; only the routine's own creation and its
  endpoint/token values stay manual). Corrected with a same-repo instance
  of the gap materializing (PR #186 — the queue ran unwired for about a
  day and a half). `## Key insights` left unchanged: the pass corrected a
  gap's mechanism and evidence, not the page's top-line understanding of
  what the gaps are.
- **2026-07-31** — page created in the owner-directed ecosystem research
  pass: offering inventory, four structural strengths, position statements
  against each competitor class (rule-sync, native platform, scorecards),
  category-language and SEO assessment, and nine candid gaps ranked by
  segment impact — repo-grounded claims cited to implementation paths,
  market claims to the sibling wikis' sourced research.
- **2026-08-02** — growth pass: gap 2 (Claude Code-only) re-framed against
  new evidence sourced in the Market and Customers wikis — the AGENTS.md
  demand signal (#6235, 4,487 👍, unshipped for eleven months) makes the
  interop whitespace durable rather than closing, which cuts both ways for
  this gap and is recorded as such. `## Key insights` left unchanged: the
  pass sharpened the reasoning behind gap 2, not the page's top-line
  understanding of what the gaps are. No requirement edited; the finding's
  bearing on proposed **R2** is logged in the Customers growth log for the
  human reviewing the requirements sink.
