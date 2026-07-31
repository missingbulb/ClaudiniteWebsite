# Market

The competitive landscape for Claudinite: the open substrate standards every
coding-agent user already has on disk, the platform-native layer Anthropic now
ships itself, the direct rule-sync competitors, the adjacent content
ecosystems, and the enterprise vendors encroaching from above. Business models
and price anchors live in [`Business/`](../Business/README.md); customer
segments in [`Customers/`](../Customers/README.md); what this means for
Claudinite in [`Positioning/`](../Positioning/README.md).

## Key insights

- Anthropic now ships the session half natively: plugins bundle skills+hooks+MCP and can be force-enabled org-wide.
- Nobody — native or rival — converges repos: no auto-PR loop from a canon, no CI convention gates, no shared growth loop.
- Rival enforcement is config-drift only: they check the rules arrived; nothing checks the rules are followed.
- The rule-sync category is nearly all free OSS under 3k stars; the one hosted SaaS (rulesync.dev) is in free beta.
- Skills won the content war: anthropics/skills hit 165k stars; SKILL.md is a ~40-tool cross-vendor standard.
- Enterprise scorecard vendors (Cortex, Port, OpsLevel) now sell AI-agent governance from above; OpsLevel's Tidra ships auto-PRs.
- The AGENTS.md spec stays minimal by design — no enforcement, versioning, or packaging — leaving that layer open.

## The substrate: per-repo convention files

Every agent-facing repo already carries at least one plain-text convention
file, and Claudinite has to interoperate with all of them rather than compete
with them:

- **AGENTS.md** is the vendor-neutral standard: a plain-markdown,
  no-frontmatter file at the repo root, formalized as an open spec in August
  2025 and donated to the Linux Foundation's Agentic AI Foundation (AAIF) on
  December 9, 2025 — alongside MCP and Block's goose, with AWS, Anthropic,
  Google, Microsoft and OpenAI as platinum members — citing adoption by more
  than 60,000 open-source projects.
  *Correction (2026-07-31):* this page previously said "read by 30+ agents,"
  citing the codersera guide; that page actually says "native support in 20+
  tools," and the "30+" figure appears to have been conflated with Ruler's
  own supported-agent marketing. The scale citation is now the LF
  announcement (primary).
- The spec itself is deliberately minimal — "a README for agents," no
  required fields, no schema — and says nothing about enforcement, machine
  checks, versioning, or packaged conventions. The only shared semantics are
  precedence (nearest file wins; chat instructions override). Enforcement and
  packaging are out of scope, i.e. open territory.
- **CLAUDE.md** is Claude Code's project-memory file, now a four-level
  hierarchy (managed policy / user / project / local) plus path-scoped
  `.claude/rules/` files and `@path` imports. Claude Code still reads
  CLAUDE.md natively, not AGENTS.md — the docs recommend an `@AGENTS.md`
  import or symlink as the bridge. Community best practice still converges on
  keeping it under ~200 lines (spot-checked 2026-07-31: the cited guide is
  alive and still says this).
- **SKILL.md / Agent Skills** became a cross-vendor open standard: Anthropic
  published the spec (agentskills.io, Dec 2025), and by mid-2026 roughly 40
  tools — OpenAI Codex, GitHub Copilot, Cursor, VS Code, Gemini CLI, JetBrains
  Junie, Block's goose — read the same format. anthropics/skills sits at
  ~165.3k stars (verified via GitHub API 2026-07-31). The spec mandates only
  `name`/`description` frontmatter; nothing about checks or distribution.
- **Cursor** keeps its `.cursor/rules/` directory; Cursor Teams now also
  markets "Team Commands" with a team baseline and drift detection — the
  platform vendor absorbing single-tool rule sharing natively.
- **GitHub Copilot** keeps `.github/copilot-instructions.md` and reads
  AGENTS.md; GitHub's own blog mined 2,500+ AGENTS.md files for guidance.

None of these substrate formats answer the question Claudinite is for: how
the *same* convention, once refined, reaches every repo that shares it,
stays current there, and is *checked* rather than trusted.

## The platform layer: what Claude Code now ships natively

The largest competitive change since this page was seeded is Anthropic's own
distribution stack (all verified against current Claude Code docs,
2026-07-31):

- **Plugins** (announced October 9, 2025) bundle skills, agents, hooks, MCP
  servers, LSP servers, and default settings into versioned packages,
  distributed through decentralized **marketplaces** (`marketplace.json` in
  any git repo/npm source, semver or SHA pinning, background auto-update).
- **Plugins can be centrally mandated**: project-level
  `extraKnownMarketplaces`/`enabledPlugins`, managed-settings force-enable,
  `strictKnownMarketplaces` lockdown, container seed dirs, and claude.ai
  org-level plugin sync on Team/Enterprise plans.
- **Managed settings** give admins non-overridable org-wide permission rules,
  hooks (`allowManagedHooksOnly`), MCP allowlists, model restrictions, and
  even an org-wide CLAUDE.md blob — delivered by MDM, machine-wide.
- **Hooks** provide deterministic in-session blocking (exit code 2 /
  `permissionDecision: "deny"`); Anthropic's own docs route enforcement away
  from prose to hooks — validating Claudinite's thesis while shipping the
  session-side half of it.
- **Native scheduling** arrived in three tiers (session cron//loop, cloud
  Routines, Desktop tasks); **auto memory** is per-project learnings that are
  explicitly machine-local and never shared.

What the native stack still does **not** do — the whitespace Claudinite
occupies (absence verified across the plugins/marketplaces/settings/memory
docs): plugins converge *clients* (a per-user cache outside the repo), not
*repos*; nothing runs convention checks in CI; nothing opens PRs against
consuming repos to converge committed files with a canon; and no path exists
from one developer's local learnings to a reviewed shared canon. The risk to
watch is pace: scheduled tasks, auto memory, and org plugin sync all shipped
within about nine months.

## Direct rivals: syncing rules across repos

The category is crowded, young (almost everything created May 2025–June
2026), fragmented, and almost entirely free OSS. Star counts verified via
GitHub API on 2026-07-31:

- **intellectronica/ruler** (2,833 ★, active) — "Centralise Your AI Coding
  Assistant Instructions"; a `.ruler/` directory concatenated into 30+
  agent-specific files. Single-repo only. Its README does ship a CI example
  that fails on uncommitted generated-file diffs — file-drift checking, the
  category's strongest "enforcement."
- **dyoshikawa/rulesync** (1,273 ★, 298 npm releases, very active) — CLI
  generating configs for 30+ tools from one `.rulesync/` source. Its
  supported-tools matrix now lists "checks" and "hooks" as feature columns —
  category vocabulary drifting toward checks without shipping enforcement.
- **RuleSync (rulesync.dev)** — the only commercial player found: a hosted
  dashboard + `rsc pull/push` CLI syncing CLAUDE.md/AGENTS.md/.cursorrules
  across repos, with a CI-failable `check` command. Free during beta, team
  plans "planned." Ranks #1 for the literal query "sync CLAUDE.md across
  repos." Unrelated to the dyoshikawa CLI despite the name.
- **Goldziher/ai-rulez** (135 ★) — the rival with the strongest enforcement
  language: pre-commit hooks literally named `ai-rulez-enforce`, a
  `verify` command, and cross-repo "remote includes." All of it targets
  config-file integrity, not the code the agent writes.
- **agent-sh/agnix** (372 ★, Rust) — a 444-rule *linter for agent config
  files* (CLAUDE.md, AGENTS.md, SKILL.md, hooks, MCP) with a CI GitHub
  Action. No sync; complementary evidence for the checks-on-config trend.
- **yujiosaka/knowhub** (41 ★) — dormant: last push 2025-07-24, two npm
  releases ever. The earlier open question about its enforcement is answered:
  file-sync verification only.
- **lbb00/ai-rules-sync** (35 ★) — cross-repo team sharing via symlinked
  central git repos, 12+ tools; npm activity stalled March 2026. No
  enforcement.
- **fabian-barney/ai-rules** (3 ★) — a content repo vendored via git subtree
  pinned to tagged releases; prior art for the vendored-versioned-unit idea,
  no tooling.
- **Sync AI Agent Rules** (GitHub Action, 1 ★) — compiles layered rules from
  a central repo and auto-commits them into agent files; pushes updates,
  gates nothing.
- **ranyitz/aicm** (36 ★) — closest architectural precedent to packs:
  installable npm packages bundling rules/commands/skills/hooks
  (`@company/ai-preset`), but outputs are regenerated into gitignored dirs,
  and no enforcement or convergence.
- Fragmentation is extreme: at least ten distinct repos named "agentsync"
  were created Dec 2025–Jun 2026, all under 60 stars — nobody owns the niche.

Category-level answers to this page's former open questions:

- **Enforcement**: yes-but-narrowly. Five tools advertise CI-failable checks
  (ruler, ai-rulez, agnix, rulesync.dev, spxrogers/agentsync), every one
  scoped to config-file drift or config-file lint. None runs checks on the
  work product, blocks an agent session, or opens convergence PRs. The
  sharpened differentiation line: *they check that the rules arrived;
  Claudinite checks that the rules are followed.*
- **Business models**: except hosted RuleSync, every surveyed tool (15+) is
  unmonetized MIT/Apache/Unlicense OSS — an opening, and a price-anchor risk.
- **Marketing**: every headline is a movement verb (synchronize / centralise /
  share / find); multi-agent breadth (30+/31/20/12+ tools) is the default
  marketing axis, making Claudinite's Claude-Code-only focus unusual in the
  field. No rival names enforcement in its headline.

## Adjacent gravity wells

- **Vercel's `npx skills` ecosystem** — vercel-labs/skills (27,660 ★) and
  vercel-labs/agent-skills (29,638 ★) in about six months: a "package manager
  for AI coding agents" across 17+ agents, with the skills.sh directory.
  Distribution only — no checks, no CI, no convergence — but it validates
  versioned vendored agent-knowledge packages at two orders of magnitude more
  adoption than any rule-sync tool.
- **Curated content lists**: hesreallyhim/awesome-claude-code (51,368 ★)
  overtook the 8-months-older PatrickJS/awesome-cursorrules (40,476 ★) —
  convention-sharing energy has moved to Claude Code. Fork counts (3.4k/4.4k)
  indicate copy-into-my-project behavior with no update path.
- **steipete/agent-rules** (5,702 ★), the category's most-starred rules
  content repo, is archived — static rules-content repos are being
  superseded, plausibly by the skills ecosystem.
- **cursor.directory** monetizes free rules browsing indirectly (~$35k/mo via
  jobs/ads per its founder's public claims) — attention, not governance.
- **davila7/claude-code-templates** (30,020 ★, aitmpl.com) is the largest
  community hub for Claude Code assets, independent of Anthropic's plugin
  system.

## From above: enterprise scorecard vendors

Internal-developer-portal vendors sell "standards enforced across many
repos" to enterprises as **scorecards** (checks graded across a service
fleet, with levels and campaign deadlines), and in 2025–2026 every one of
them pivoted to AI-agent governance:

- **Cortex** rebranded "mission control for the AI software factory" and
  ships AI-governance scorecards that check "which repositories have proper
  AI instructions" — observation of config presence, not authoring or
  convergence. It published Claudinite's exact thesis as marketing: "AI is
  writing your code. Who's watching your standards?" (Sept 2025).
- **Port** repositioned as an "Agentic SDLC" platform that auto-discovers
  "agents, MCPs, skills so you can enforce your standards."
- **OpsLevel** markets a portal that "enforces standards automatically" and
  spun out **Tidra AI** — the one IDP product found that *remediates* with
  auto-PRs across every repo in scope (campaign-driven, not a continuous
  convergence-to-canon loop).
- **Spotify Soundcheck** (paid Backstage plugin) shipped MCP actions so
  Claude Code and Cursor can *query* failing checks — scorecards made
  readable by agents, the inverse of governing what agents follow.
- The category norm remains observe-and-nudge (notifications, Jira tickets,
  deadlines); default-on auto-PR convergence stays ahead of it.

Deeper enterprise-buyer analysis (procurement gates, ranked requirements)
lives in [`Customers/`](../Customers/README.md).

## Sources

- [Linux Foundation announces the Agentic AI Foundation (AAIF)](https://www.prnewswire.com/news-releases/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation-aaif-anchored-by-new-project-contributions-including-model-context-protocol-mcp-goose-and-agentsmd-302636897.html) — AGENTS.md donation, 60,000+ projects, members
- [agents.md spec README (openai/agents.md)](https://raw.githubusercontent.com/openai/agents.md/main/README.md) — minimal-by-design scope
- [AGENTS.md Complete Guide 2026 — codersera](https://codersera.com/blog/agents-md-complete-guide-2026/) — "20+ tools" (spot-checked alive 2026-07-31)
- [CLAUDE.md Best Practices: The Complete 2026 Guide — DEV Community](https://dev.to/nishilbhave/claudemd-best-practices-the-complete-2026-guide-435j) — ~200-line guidance (spot-checked alive 2026-07-31)
- [Top AI Agent Standards to Know in 2026 — Agentailor](https://blog.agentailor.com/posts/top-ai-agent-standards-2026) — standards overview (spot-checked alive 2026-07-31)
- [Keeping Agent Behavior Consistent Across Separate Repositories — Antigravity Lab](https://antigravitylab.net/en/articles/antigravity/antigravity-multi-repo-agent-governance-design) — multi-repo governance framing (spot-checked alive 2026-07-31)
- [Claude Code docs: plugins](https://code.claude.com/docs/en/plugins), [plugin marketplaces](https://code.claude.com/docs/en/plugin-marketplaces), [settings](https://code.claude.com/docs/en/settings), [hooks](https://code.claude.com/docs/en/hooks), [memory](https://code.claude.com/docs/en/memory), [scheduled tasks](https://code.claude.com/docs/en/scheduled-tasks), [discover plugins](https://code.claude.com/docs/en/discover-plugins)
- [Agent Skills spec (agentskills/agentskills)](https://raw.githubusercontent.com/agentskills/agentskills/main/README.md) and [Claude Code skills docs](https://code.claude.com/docs/en/skills); cross-vendor adoption: [paperclipped.de](https://www.paperclipped.de/en/blog/agent-skills-open-standard-interoperability/)
- [anthropics/skills](https://github.com/anthropics/skills) — 165,327 ★ (GitHub API, 2026-07-31)
- [intellectronica/ruler](https://github.com/intellectronica/ruler) — 2,833 ★, CI drift example
- [dyoshikawa/rulesync](https://github.com/dyoshikawa/rulesync) — 1,273 ★; [supported-tools matrix](https://raw.githubusercontent.com/dyoshikawa/rulesync/main/docs/reference/supported-tools.md)
- [RuleSync (hosted)](https://www.rulesync.dev/) and [rulesync-cli on npm](https://registry.npmjs.org/rulesync-cli) — free beta, paid plans planned
- [Goldziher/ai-rulez](https://github.com/Goldziher/ai-rulez) — enforce/verify hooks, remote includes
- [agent-sh/agnix](https://github.com/agent-sh/agnix) — 444-rule agent-config linter
- [yujiosaka/knowhub](https://github.com/yujiosaka/knowhub) — dormant since 2025-07
- [lbb00/ai-rules-sync](https://github.com/lbb00/ai-rules-sync) — symlink team sharing
- [fabian-barney/ai-rules](https://github.com/fabian-barney/ai-rules) — git-subtree vendored content
- [Sync AI Agent Rules — GitHub Marketplace](https://github.com/marketplace/actions/sync-ai-agent-rules)
- [ranyitz/aicm](https://github.com/ranyitz/aicm) — npm-packaged presets
- [vercel-labs/skills](https://github.com/vercel-labs/skills), [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills), [Vercel changelog: introducing skills](https://vercel.com/changelog/introducing-skills-the-open-agent-skills-ecosystem)
- [hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code), [PatrickJS/awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules), [steipete/agent-rules (archived)](https://github.com/steipete/agent-rules), [davila7/claude-code-templates](https://github.com/davila7/claude-code-templates)
- [cursor.directory](https://cursor.directory/) and [founder revenue claim](https://x.com/pontusab/status/1966470564601835963)
- [Cursor for Teams](https://cursor.com/business/teams) — Team Commands, drift detection
- [How to write a great agents.md — GitHub Blog](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/)
- [Cortex: AI is writing your code. Who's watching your standards?](https://www.cortex.io/post/ai-is-writing-your-code-whos-watching-your-standards) and [AI governance solutions](https://docs.cortex.io/solutions/ai-governance)
- [Port.io](https://www.port.io/) — Agentic SDLC positioning
- [OpsLevel AI](https://www.opslevel.com/ai) and [Tidra AI](https://tidra.ai/)
- [Soundcheck — Spotify Plugins for Backstage](https://backstage.spotify.com/partners/spotify/plugin/soundcheck/) and [Portal GA / MCP actions](https://backstage.spotify.com/discover/blog/spotify-portal-ga-webinar-october-2025)

## Open questions

- What does dyoshikawa/rulesync's "checks" feature column actually generate
  (its docs site was egress-blocked this pass), and does it map to native
  check primitives in Amp/Cursor?
- rulesync.dev's concrete paid pricing and team once out of beta — the first
  direct commercial test of this category's willingness to pay.
- npm weekly downloads for ruler/rulesync/knowhub/ai-rules-sync (npm stats
  endpoints were egress-blocked; adoption is star/release-cadence-based).
- Does claude.ai org-level plugin sync push plugins to members or only offer
  them (support article was 403 this pass)? This decides how much of the
  "centrally mandated conventions" story the native layer already owns.
- Current plugin counts in `claude-plugins-official`/`community` and their
  growth rate — the pace of native absorption is the platform-risk metric.
- Does any AAIF working group plan to add structure (schemas, checks,
  versioning) to AGENTS.md? No evidence found this pass; re-check.
- Whether Cursor Teams' drift-detecting Team Commands extend beyond
  Cursor-native rules (to AGENTS.md/CLAUDE.md) — if so, first-party
  absorption reaches further than assumed.
- Has any tool announced a Renovate-style auto-PR convergence bot for agent
  conventions since July 2026?

## Growth log

- **2026-07-28** — initial seed: substrate standards (AGENTS.md, CLAUDE.md,
  Cursor, Windsurf, Copilot) and the direct rule-sync competitor set
  (knowhub, ai-rules-sync, ai-rules) researched and cited.
- **2026-07-28** — open question added by the website build: how competitors
  market themselves, to defend the enforcement-differentiation message the
  launched site leads with.
- **2026-07-31** — major maturation pass (owner-directed ecosystem research):
  answered all five standing open questions (rival enforcement = config-drift
  only; adoption numbers verified via GitHub API; business models = free OSS
  except rulesync.dev beta; AGENTS.md spec silent on enforcement; no rival
  markets enforcement). Added the platform-native layer (plugins,
  marketplaces, managed settings, Agent Skills), adjacent gravity wells
  (Vercel skills, awesome-lists, cursor.directory), and the enterprise
  scorecard category. Corrected the "30+ agents" substrate claim (source says
  20+ tools; primary scale citation now the LF AAIF announcement). All four
  pre-existing citations spot-checked alive.
