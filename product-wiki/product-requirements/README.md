# Product requirements

The human-reviewed distillation of the `product-wiki/` research into product
requirements. Never auto-grown — a wiki finding that should move a requirement
gets a growth-log note and waits for a human to land it here.

## Status: proposed first distillation (2026-07-31, pending owner review)

This set was derived on explicit owner instruction at the end of the
2026-07-31 ecosystem research pass, and lands through that pass's pull
request — the owner's review of that PR is the human gate this sink
requires. Until the PR is merged by the owner, everything below is
*proposed*, not accepted. Each requirement traces to the research page(s)
that motivate it; none of the wiki pages may be cited by the rest of the
repo — this page is the only crossing point.

### Product mechanics

- **R1 — Tenant canon.** Make the canon location configurable (org-owned,
  private canons in the customer's own tenancy); remove the hard-coded
  personal public repo and owner-affiliation fleet enumeration. Motivated by:
  Positioning gap 1; enterprise requirement #3 (Customers).
- **R2 — Multi-agent surface.** Emit AGENTS.md (and optionally Cursor/Copilot
  files) from pack rules so non-Claude agents at least read the conventions;
  keep SKILL.md-standard skills as the interchange format. Claude Code
  remains the enforced first-class target — this is emission, not parity.
  Motivated by: enterprise near-blocker #2 (Customers); AGENTS.md format
  convergence (Market).
- **R3 — Pinning, channels, rollback.** Replace track-canon-head with
  pinnable corpus versions, at least stable/head channels, and a rollback
  path; keep bot-opened update PRs as the drift mechanism. Motivated by:
  every winning comparable shipped pins + bot PRs (Methods); Positioning
  gap 3.
- **R4 — True one-command adopt.** Close the gap between "one conversation
  to adopt" and reality: vendored bootstrap, and a documented or automated
  path for provisioning the executor routines that agentic dispatches
  depend on. Motivated by: zero-effort adoption as a winner trait (Methods);
  Positioning gaps 6 and 9.
- **R5 — Fleet status surface.** A minimal aggregation view (even a
  generated markdown/JSON roll-up in the canon repo) answering "is the fleet
  converged and passing?" per repo — the champion's ROI slide and the
  scorecard-educated buyer's expectation. Motivated by: Positioning gap 5;
  enterprise requirement #5 (Customers); consider feeding existing scorecard
  products (Cortex/Port) instead of building a dashboard (Positioning open
  question).

### Commercial

- **R6 — Model: free-for-OSS + paid ongoing loop.** Free for public repos;
  price the ongoing stream, not the files — hosted convergence/maintenance
  operation, private canon/packs, and (for enterprise) SLA. Indicative
  bands from anchors: $10–40/seat/mo or pre-commit.ci-style flat org tiers
  ($20–100/mo band), with behavioral seat definitions ("devs whose repos
  consume a pack"). A one-time entry SKU for indies ($29–79) is compatible
  with the evidence. Motivated by: Business (scarcity analysis, anchors);
  Customers (per-segment willingness to pay).
- **R7 — Procurement package.** A written data-flow story (what leaves the
  customer's repos: nothing; what credentials the bots hold and why), a
  supply-chain provenance story for the vendored canon, and a security-review
  FAQ. SOC 2 only becomes relevant when a hosted component exists. Motivated
  by: enterprise gate #1 and the "no-server accelerant" finding (Customers).

### Marketing and positioning

- **R8 — Sharpen the differentiation line.** Adopt "rivals check the rules
  arrived; Claudinite checks the rules are followed" (or equivalent) before
  the config-drift-check rivals blunt "rivals move files"; fix the four
  attackable site claims (CI-sweep scope, leave story, one-conversation
  adopt, generic "AI coding agents"). Motivated by: Market (five rivals now
  advertise config-drift CI checks); Positioning gap 9; Website open
  questions.
- **R9 — Own the white-space queries.** Target multi-repo-consistency and
  enforcement search demand ("enforce AI coding standards CI", "keep
  AGENTS.md consistent multiple repositories") — currently blog-only SERPs —
  rather than the taken "sync rules" queries; attach to "context engineering
  at fleet scale" and consider building "AI-ready codebase" as owned
  language. Motivated by: Market SEO scan; Positioning category-language
  assessment.

### Platform strategy

- **R10 — Ride the native layer, own the loop.** Distribute Claudinite's
  session-side assets as a Claude Code plugin/marketplace entry for
  discovery and install, while keeping the differentiating layer —
  repo-vendored checks, CI gating, nightly convergence, growth loop — in the
  repos where the native stack does not reach. Re-assess quarterly: native
  absorption pace (plugins, org sync, scheduled tasks shipped within ~9
  months) is the standing platform risk. Motivated by: Market
  (native-platform whitespace analysis); Methods (Peril's absorption
  lesson); Positioning open questions.

Deliberately *not* proposed as requirements yet, with reasons: GitLab/
Bitbucket support (no evidence of demand in any researched segment yet —
revisit with enterprise pipeline), native Windows support (real but no
segment ranked it), and a public pack registry (discovery matters, but the
plugin-marketplace route in R10 may cover it — decide after R10).
