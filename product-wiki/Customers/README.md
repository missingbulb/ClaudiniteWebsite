# Customers

Customer profiles and potential users for Claudinite, in three segments:
independent developers, small software shops and agencies (2–50 devs), and
large enterprises (100+ engineers, platform teams). For each: who they are,
what they do today instead, the trigger moment, and what they would pay.
Price anchors live in [`Business/`](../Business/README.md); what this implies
for the offering in [`Positioning/`](../Positioning/README.md).

## Key insights

- 90% of developers use AI at work; only ~24–33% trust its output — the adoption/trust scissor is the buying condition.
- Claude Code went from ~3% to 18% work usage in eight months with the category's best satisfaction — the fastest-growing agent.
- Users file issues titled "need enforcement mechanism"; the tracker's loudest ask (AGENTS.md, 4,944 👍) closed on an import.
- Solo devs run dotfiles and symlinks; agencies copy a shared config repo per client — drift machines with no update path.
- Indies pay $199–249 one-time for vendored starter files (ShipFast: $250k in 5 months); shops absorb $125/seat for Claude Premium.
- Enterprise near-blockers, in order: security review, multi-agent (AGENTS.md) support, private canon — then metrics and SLA.
- Spotify's Fleetshift proved the mechanism at scale: 270k+ fleet PRs, 77% automerged — enterprises already hold this mental model.

## The market condition: adoption up, trust down

- Stack Overflow 2025 (49k+ respondents): 84% use or plan to use AI tools
  (up from 76%), 51% of professionals use them daily — while favorable
  sentiment fell to 60% and 46% actively distrust output accuracy; 66% name
  "almost right, but not quite" solutions as their top frustration. Only 31%
  currently use *agents*; 87% of respondents are concerned about agent
  accuracy — Stack Overflow's own framing is "agents on a leash."
- DORA 2025 (≈5,000 respondents): 90% of developers use AI at work, 80%+
  report productivity gains, yet 30% report little or no trust in
  AI-generated code. Its central finding: AI *amplifies* existing
  organizational strengths and dysfunctions; quality internal platforms and
  a "clear and communicated AI stance" are named mediating capabilities —
  and AI adoption still correlates with delivery *instability* where control
  systems (testing, version control, feedback loops) haven't kept up.
- JetBrains (24,534 devs, 2025): 85% regularly use AI for coding but only
  44% call it integrated into their workflow; by its January 2026 pulse, 90%
  used at least one AI tool at work.
- Claude Code specifically: 18% work usage by January 2026 (24% US/Canada),
  up from ~3% mid-2025, with category-best satisfaction (CSAT 91, NPS 54);
  Anthropic announced $1B annualized run-rate within ~6 months of GA
  (Dec 2025). GitHub Copilot leads usage at 29% but has flatlined.

The scissor — near-universal use, low trust, "almost right" output — is the
condition a machine-enforced-conventions product sells into: human vigilance
does not scale with agent output volume.

## Segment: independent developers

- **Who**: ~14% of Stack Overflow respondents are freelancers; SlashData
  counts 47.2M developers worldwide (36.5M professional) — a ~5M freelance
  professional ceiling before filtering to agent users. r/ClaudeAI reached
  ~1M members by mid-2026 (+37% in one 90-day window).
- **What they do today**: version-control `~/.claude` in a dotfiles repo,
  symlink CLAUDE.md/commands/hooks across projects, with explicit gitignore
  allowlists; the pattern is common enough that dedicated tools exist
  (dot-claude-sync, claude-code-dotfiles). This solves one *machine's*
  consistency, not cross-repo drift.
- **Documented pain**: multiple anthropics/claude-code issues (verified via
  GitHub API 2026-07-31) — #18660 "CLAUDE.md instructions are read but not
  reliably followed — need enforcement mechanism", #34132 "Rules in
  .claude/rules/ and CLAUDE.md are advisory-only", #32193 "Claude violates
  its own mandatory CLAUDE.md instructions"; plus blog posts like "I wrote
  200 lines of rules for Claude Code. It ignored them all."
- **Trigger moment**: the Nth repo whose CLAUDE.md has drifted from the
  others, or the agent visibly violating rules it was given.
- **Willingness to pay**: already paying $10–200/mo for the agent itself;
  demonstrated $199–249 one-time for vendored starter files (Marc Lou's
  ShipFast: $250k in its first 5 months, "own it forever" as the pitch) and
  $5–27 for Gumroad rules packs. Realistic band: ~$10–19/mo, or a $29–79
  one-time/annual pack license.
- **What matters in Claudinite's shape**: plain files (matches how they
  already share conventions — the awesome-lists at 51k/40k stars are
  copy-paste culture), no account/server, and free-for-public-repos
  (every comparable's funnel).

## Segment: small shops and agencies (2–50 devs)

- **Who**: 57% of employed Stack Overflow respondents work at companies
  under 500 employees; Clutch lists 8,500+ US software-development firms (no
  clean global count of 2–50-dev shops exists — open question).
- **What they do today**: a shared config repo whose CLAUDE.md is copied or
  symlinked into each client project; layered global/client/project configs;
  how-to content explicitly targets multi-client Claude Code setups, and
  paid Gumroad packs are marketed to "agencies shipping the same stack
  across multiple client projects." Consultancies already sell "configure
  Claude Code for your team" engagements — both a channel and a substitute.
- **Documented demand for convergence**: anthropics/claude-code #14467
  "[FEATURE] Organization-wide shared CLAUDE.md via GitHub org" — open, 40 👍
  (verified 2026-07-31). Anthropic has not shipped it.
- **Trigger moment**: onboarding a new client repo or a new hire; a
  convention fix that must reach every client repo.
- **Willingness to pay**: the $100/seat gap between Claude Team Standard
  ($25) and Premium ($125, the Claude Code seat) normalizes per-seat spend
  for Claude-Code-attached capability. Realistic band: ~$20–50/seat/mo or
  $199–499/yr flat per org.
- **What matters in Claudinite's shape**: no server/account (client-repo
  security objections vanish — nothing of the client's leaves their repos),
  PR-gated automation (client-visible review trail), and per-client canon
  separation.

## Segment: large enterprises (100+ engineers)

- **Who buys**: platform-engineering/DevEx teams — Gartner: 80% of large
  software-engineering orgs will have platform teams by 2026 (up from 45% in
  2022); DORA: 90% of orgs have at least one internal platform. DX's survey
  of budget holders: 38% spent $101–500 per developer per year on AI dev
  tools in 2025; about half reserve 1–3% of engineering budget for AI
  tooling. Booking.com's DevEx team is the documented example of the buying
  center (procures AI tools, justifies with DX telemetry).
- **Scale of rollouts**: Uber ~90% of engineers on Cursor/Claude Code with
  in-house uReview gating; Accenture ~12,000 devs on Copilot; Infosys
  ~18,000; TELUS 57,000 employees on Claude; DX's Q4-2025 dataset (135k
  developers, 435 companies): 91% adoption, 22% of merged code AI-authored,
  and enterprises deploying "access controls, logging, approved model
  policies, and CI policy gates — not simply open access."
- **The precedent they hold**: Spotify's Fleet Management created 270,000+
  automated PRs across thousands of repos in 2022, 77% automerged — and its
  2025 Honk background agent (1,500+ merged AI PRs) rides the same
  infrastructure with CI/test gating and constraints on what the agent may
  touch. Puppet/Chef desired-state convergence is the older mental model:
  agents check in, compare to desired state, remediate drift. "Puppet for
  agent conventions, converging via reviewable PRs" is legible to any
  platform team.
- **Segmentation note**: the top ~20% (DORA "harmonious high-achievers" —
  the Ubers and Spotifys) build this in-house; the bottom ~10% lack
  prerequisites; the middle majority with partial practices that AI
  destabilizes is the addressable market.
- **Enterprises already accept the mechanism**: Claude Code managed-settings
  are deployed via MDM as non-overridable, file-based, no-server policy —
  proving appetite for exactly Claudinite's delivery shape at the
  device-policy layer (conventions/checks/fleet convergence remain
  unclaimed).
- **Ranked requirements a sale would face** (each grounded in the research;
  hardest first): (1) security/supply-chain review — SOC 2 or a compensating
  no-server data-flow story; reviews add 2–4 weeks and 77% of buyers demand
  verified compliance proof, though "code never leaves our environment" is a
  documented approval accelerant; (2) multi-agent support — enterprises run
  Copilot + Cursor + Claude Code simultaneously and converge on AGENTS.md,
  so Claude-Code-only addresses a slice of the fleet — and this near-blocker
  is now the best-quantified demand signal in the whole research set:
  `anthropics/claude-code` #6235 "Feature Request: Support AGENTS.md."
  ran from 2025-08-21 to its `completed` close on 2026-08-17 carrying
  4,944 👍 (6,367 total reactions, 374 comments), with #31005 (277 👍) and
  #34235 (90 👍) behind it — and it closed on the `/import` command while
  the Claude Code memory doc still states "Claude Code reads `CLAUDE.md`,
  not `AGENTS.md`" (re-verified 2026-08-21, Market wiki). That is roughly 100×
  the org-wide-shared-CLAUDE.md request (#14467, 40 👍) cited for the agency
  segment above, and the reaction base is the whole Claude Code user
  population rather than enterprise buyers specifically — so multi-agent
  emission reads as broad table stakes, not an enterprise-only gate;
  (3) private canon in
  the customer's own tenancy; (4) central non-overridable enforcement with
  an audit trail; (5) adoption/convergence metrics for the champion's ROI
  slide; (6) support SLA and vendor-viability mitigation (vendored plain
  files are a built-in escrow: they keep working if the vendor dies);
  (7) SSO — moot while there is truly no server, mandatory the moment any
  dashboard exists; (8) EU AI Act / NIST AI RMF mapping — a differentiator,
  not a burden: deployers' main in-force obligation is AI literacy, and a
  distributed, codified AI stance is the natural compliance artifact.
- **Regulatory tailwind**: under the EU AI Act, enterprises using coding
  assistants are "deployers" (model obligations fall on providers); NIST's
  RMF ecosystem pushes documented AI governance. Both reward "clear,
  codified, distributed AI stance" — which is what packs operationalize.

## Sources

- [Stack Overflow 2025 Developer Survey — AI](https://survey.stackoverflow.co/2025/ai) and [press release](https://stackoverflow.co/company/press/archive/stack-overflow-2025-developer-survey/) — 84%, 46%, 66% (via quoted context; survey site blocked direct fetch)
- [SO 2025 for leaders: AI agents](https://stackoverflow.co/teams/resources/2025-stack-overflow-developer-survey-for-leaders/ai-agents/) and [Agents on a leash — SO blog](https://stackoverflow.blog/2026/05/27/agents-on-a-leash-agentic-ai-remains-mostly-monitored-at-work/)
- [Announcing the 2025 DORA report — Google Cloud](https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report) — 90% use, amplifier finding; [trust breakdown](https://dora.dev/insights/balancing-ai-tensions/); [AI Capabilities Model](https://cloud.google.com/blog/products/ai-machine-learning/introducing-doras-inaugural-ai-capabilities-model); [RedMonk read](https://redmonk.com/rstephens/2025/12/18/dora2025/); [profiles — Faros](https://www.faros.ai/blog/key-takeaways-from-the-dora-report-2025)
- [Which AI coding tools do developers actually use at work? — JetBrains](https://blog.jetbrains.com/research/2026/04/which-ai-coding-tools-do-developers-actually-use-at-work/) — Claude Code 18%, CSAT 91; [State of Developer Ecosystem 2025](https://blog.jetbrains.com/research/2025/10/state-of-developer-ecosystem-2025/)
- [Anthropic acquires Bun; Claude Code reaches $1B](https://www.anthropic.com/news/anthropic-acquires-bun-as-claude-code-reaches-usd1b-milestone) (page proxy-blocked; milestone corroborated by [VentureBeat](https://venturebeat.com/technology/anthropic-says-it-hit-a-30-billion-revenue-run-rate-after-crazy-80x-growth))
- [anthropics/claude-code #18660](https://github.com/anthropics/claude-code/issues/18660), [#34132](https://github.com/anthropics/claude-code/issues/34132), [#14467 (org-wide shared CLAUDE.md, 40 👍)](https://github.com/anthropics/claude-code/issues/14467) — verified via GitHub API 2026-07-31; ["It ignored them all" — dev.to](https://dev.to/minatoplanb/i-wrote-200-lines-of-rules-for-claude-code-it-ignored-them-all-4639)
- [Dotfiles: taming your dev environment and AI agents](https://drmowinckels.io/blog/2026/dotfiles-coding-agents/), [claude-code-dotfiles](https://github.com/elizabethfuentes12/claude-code-dotfiles), [dot-claude-sync](https://dev.to/ugo/share-claude-created-documents-across-worktrees-with-dot-claude-sync-cpc)
- [Multi-client Claude Code context inheritance — MindStudio](https://www.mindstudio.ai/blog/claude-code-context-inheritance-multi-client), [3-layer configuration](https://doneyli.substack.com/p/the-3-layer-claude-code-configuration)
- [CLAUDE.md Rules Pack — Gumroad](https://oliviacraftlat.gumroad.com/l/skdgt) — agency-targeted paid pack; [Mad Devs shared_cursor_rules](https://github.com/maddevsio/shared_cursor_rules)
- [ShipFast revenue — Starter Story](https://www.starterstory.com/marc-lou-shipfast) and [Marc Lou's own account](https://newsletter.marclou.com/p/i-made-250000-usd-selling-javascript)
- [Claude Code pricing 2026 — CloudZero](https://www.cloudzero.com/blog/claude-code-pricing/) — Team seat split
- [Global developer population — SlashData](https://www.slashdata.co/post/global-developer-population-trends-2025-how-many-developers-are-there); [SO 2025 work section](https://survey.stackoverflow.co/2025/work/); [Clutch developers directory](https://clutch.co/developers)
- [r/ClaudeAI stats — RedditList](https://redditli.st/subreddit/ClaudeAI) (tracker; Reddit itself unfetchable)
- [Gartner: platform engineering](https://www.gartner.com/en/experts/top-tech-trends-unpacked-series/platform-engineering-empowers-developers) — 80%-by-2026 prediction
- [AI tooling budgets — DX](https://getdx.com/blog/how-are-engineering-leaders-approaching-2026-ai-tooling-budget/) and [Q4 impact report](https://getdx.com/blog/ai-assisted-engineering-q4-impact-report-2025/); [Booking.com case](https://getdx.com/customers/booking-uses-dx-to-measure-impact-of-genai/)
- [How Uber uses AI for development — Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/how-uber-uses-ai-for-development) and [uReview](https://www.uber.com/us/en/blog/ureview/)
- [Spotify Honk part 1](https://engineering.atspotify.com/2025/11/spotifys-background-coding-agent-part-1) and [Fleet-wide refactoring](https://engineering.atspotify.com/2023/05/fleet-management-at-spotify-part-3-fleet-wide-refactoring) — 270k PRs, 77% automerged
- [Accenture Copilot study — GitHub blog](https://github.blog/news-insights/research/research-quantifying-github-copilots-impact-in-the-enterprise-with-accenture/); [TELUS/Rakuten figures](https://agentmarketcap.ai/blog/2026/04/05/anthropic-agentic-coding-trends-report-claude-code-eight-shifts)
- [anthropics/claude-code #6235 "Feature Request: Support AGENTS.md."](https://github.com/anthropics/claude-code/issues/6235) — 4,944 👍 / 6,367 reactions / 374 comments, opened 2025-08-21, closed `completed` 2026-08-17 (GitHub API, 2026-08-21); [#31005](https://github.com/anthropics/claude-code/issues/31005) (277 👍), [#34235](https://github.com/anthropics/claude-code/issues/34235) (90 👍)
- [Claude Code docs: memory](https://code.claude.com/docs/en/memory) — "Claude Code reads `CLAUDE.md`, not `AGENTS.md`" (primary page opened directly, 2026-08-02)
- [Claude Code admin setup (managed settings)](https://code.claude.com/docs/en/admin-setup)
- [SOC 2 for enterprise clients — Bright Defense](https://www.brightdefense.com/resources/soc-2-for-enterprise-clients/); [on-prem AI code review — Dextralabs](https://dextralabs.com/blog/on-premise-ai-code-review-for-enterprise/); [vendor viability — FirmAdapt](https://firmadapt.com/blog/how-procurement-teams-evaluate-vendor-companies)
- [EU AI Act: employers as deployers — Freshfields](https://www.freshfields.com/en/our-thinking/blogs/technology-quotient/eu-ai-act-unpacked-22-key-considerations-for-employers-as-deployers-vs-provide-102k1kz); [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework)
- [Octoverse 2025 — GitHub blog](https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/) — 121M new repos, 180M+ developers
- [Config-management convergence comparison](https://technologymatch.com/blog/terraform-ansible-puppet-or-chef-which-tool-is-right-for-it-leaders) — Puppet mental model

## Open questions

- Re-verify the top survey figures against the primary pages from an
  unrestricted network (survey.stackoverflow.co, devecosystem-2025.jetbrains
  .com, github.blog, anthropic.com all 403'd fetchers this pass; numbers
  rest on quoted search context of the primary URLs).
- Claude Code WAU: aggregators conflict (2M vs 4.2M in 2026) with no primary
  Anthropic statement located; post-Feb-2026 revenue claims ($8B) are
  unconfirmed.
- A defensible bottoms-up count of 2–50-dev software shops/agencies (Clutch's
  8,500+ US listing is directory-based) — needed to size the mid segment.
- Median repos-per-organization at 100+ engineers — no published
  distribution found; only proxies (Octoverse aggregates, Spotify's
  "thousands").
- Would enterprises accept a nightly auto-PR bot's write-scoped GitHub App
  credentials without a full SaaS-grade security review? No source directly
  addresses PR-bot credential scoping for a no-server vendor.
- Actual conversion/churn for paid convention content (Gumroad packs) —
  price points are known, revenue is not.
- Does Anthropic's roadmap (org-managed CLAUDE.md per issue #14467, plugin
  marketplaces) absorb convergence/enforcement first-party? The standing
  platform-risk question — still open, but partially answered on the interop
  axis as of 2026-08-21: the tracker's loudest request (#6235) was answered
  with a one-time import rather than native reading, so the native layer is
  not racing to close cross-vendor gaps, whatever it does on distribution.
- Would enterprise buyers accept an operator-side AGENTS.md bridge (the
  `@AGENTS.md` import or a symlink, which is what Anthropic's own docs
  recommend) as satisfying near-blocker #2, or does the requirement only
  clear with tool-native parity? Decides whether emission is a cheap
  unblock or a deep one.
- What are the 374 comments on #6235 actually asking for — pure file
  recognition, or skills/rules portability too? The thread is the largest
  free-text corpus of user-side demand in this category and has not been
  read; it would sharpen the multi-agent requirement's real shape.

## Growth log

- **2026-08-21** — re-verification pass alongside the site messaging rewrite:
  the AGENTS.md demand signal this page leans on for near-blocker #2 closed
  `completed` on 2026-08-17 (4,944 👍 at close) without the docs changing
  what Claude Code reads — the near-blocker itself is unchanged, but its
  "open and unshipped" evidence is not, so the segment text and the
  platform-risk open question now cite the close. Detail and sources in the
  [Market wiki](../Market/README.md).

- **2026-07-31** — page created in the owner-directed ecosystem research
  pass: three segments profiled with primary-survey adoption data (SO 2025,
  DORA 2025, JetBrains 2025/26), documented pain evidence (enforcement-gap
  and org-shared-CLAUDE.md GitHub issues, dotfiles/symlink workarounds,
  agency shared-config patterns), willingness-to-pay anchors per segment,
  named enterprise rollouts, and the ranked enterprise requirements list —
  all cited with provenance caveats where primary pages were fetch-blocked.
- **2026-08-02** — growth pass: quantified enterprise near-blocker #2
  (multi-agent/AGENTS.md support) with the demand evidence it previously
  lacked — `anthropics/claude-code` #6235, open since 2025-08-21 at 4,487 👍
  / 5,808 reactions / 348 comments, roughly 100× the org-wide-CLAUDE.md
  request already cited here, and unshipped as of a same-day re-read of the
  Claude Code memory doc. The `## Key insights` header's demand bullet was
  rewritten to lead with this figure instead of the 40-👍 one it dwarfs (the
  40-👍 request is unchanged in the agency segment body). Three open
  questions updated or added, including the partial answer to the standing
  platform-risk question. **Note for the human reviewing
  `product-requirements/`:** this strengthens the evidence base for the
  proposed **R2 — Multi-agent surface** and bears on where R2 sits in the
  gap-closing order; no requirement was edited, per the isolation wall.
