# Market

The competitive landscape for Claudinite: the open substrate standards every
coding-agent user already has on disk, the platform-native layer Anthropic now
ships itself, the direct rule-sync competitors, the adjacent content
ecosystems, and the enterprise vendors encroaching from above. Business models
and price anchors live in [`Business/`](../Business/README.md); customer
segments in [`Customers/`](../Customers/README.md); what this means for
Claudinite in [`Positioning/`](../Positioning/README.md).

## Key insights

- Anthropic ships the session half natively, but CLI auto-install of org-mandated plugins was closed "not planned."
- Nobody converges repos: no auto-PR loop from a canon, no CI convention gates; native auto memory is machine-local, never shared.
- Rival enforcement is config-drift only: they check the rules arrived; nothing checks the rules are followed.
- The rule-sync category is nearly all free OSS under 3k stars; the one hosted SaaS (rulesync.dev) is in free beta.
- Enterprise scorecard vendors (Cortex, Port, OpsLevel) now sell AI-agent governance from above; OpsLevel's Tidra ships auto-PRs.
- Anthropic's own docs say CLAUDE.md is "context, not enforced configuration" — the vendor states Claudinite's premise.
- The AGENTS.md ask (4,944 👍) closed *completed* via a one-time import; Anthropic's own `.agents/skills/` standard stays unaddressed.

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
- **The AGENTS.md request was closed as completed on 2026-08-17 — and Claude
  Code still does not read the file** (researched 2026-08-21).
  `anthropics/claude-code` #6235 "Feature Request: Support AGENTS.md." was
  closed `completed` by the Claude Code lead (bcherny) at 2026-08-17T03:37Z,
  after twelve months and 4,944 👍 (6,367 total reactions, 374 comments) —
  the largest quantified demand signal in the agent-config space, and now
  answered by an *import*, not by native reading. The memory doc, re-fetched
  the same day the issue's last update landed, still says flatly "Claude Code
  reads `CLAUDE.md`, not `AGENTS.md`"; what shipped is `/import` (Claude Code
  v2.1.213+), which "appends a one-time copy of instruction files such as
  `AGENTS.md` to the matching `CLAUDE.md`", alongside `/init` under
  `CLAUDE_CODE_NEW_INIT=1` reading AGENTS.md at generation time. Both are
  one-time copies into CLAUDE.md — the same bridge this wiki has recorded
  since 2026-08-02, now blessed as the official answer. The read gap is
  therefore *durable by decision*, not by backlog: the interop whitespace
  stays open, and a copy-in bridge is itself a drift source, which is the
  territory Claudinite is already in.
- **The close settled file-reading only — the parallel `.agents/skills/` ask
  is a separate, still-open thread** (researched 2026-08-30). Two more
  specific issues split off the same demand cluster: `anthropics/claude-code`
  #31005 ("Support for AGENTS.md and .agents/skills/, the community has been
  asking since August 2025," opened 2026-03-05, citing 3,020 👍 on #6235 at
  the time it was filed) is still **open** as of this pass — thirteen days
  after #6235's close. #50778 (opened 2026-04-19, a four-part consolidated
  spec: AGENTS.md dual-read with CLAUDE.md-wins precedence on collision,
  `.agents/skills/` dual-discovery merged into the skill registry, plus
  optional future hooks/commands extensions) was closed as a duplicate of
  #6235 without any of its four parts shipping. `.agents/skills/` is
  Anthropic's *own* published Agent Skills standard (agentskills.io) — Claude
  Code reads only `.claude/skills/` — so the unaddressed half of the demand
  is non-adoption of the platform's own standard directory, not third-party
  interop.
- **Anthropic now states the enforcement gap in its own docs, in Claudinite's
  own terms** (primary page, 2026-08-21). The memory doc's opening comparison
  says of CLAUDE.md and auto memory: "Claude treats them as context, not
  enforced configuration. To block an action regardless of what Claude
  decides, use a PreToolUse hook instead," and its managed-policy section
  draws the same line: "Settings rules are enforced by the client regardless
  of what Claude decides to do. CLAUDE.md instructions shape Claude's
  behavior but are not a hard enforcement layer." The same page tells teams
  to "target under 200 lines per CLAUDE.md file" because "longer files
  consume more context and reduce adherence." The platform vendor is the
  primary source for the premise the whole rule-sync category is built on
  top of and never addresses.
- **Auto memory is the native learning loop — and it is machine-local by
  design.** Claude Code writes its own notes from a user's corrections into
  `~/.claude/projects/<project>/memory/`, on by default. The doc is explicit
  that "Auto memory is machine-local... Files are not shared across machines
  or cloud environments" (primary page, 2026-08-21), and only the first 200
  lines / 25KB of its index load per session. Nothing native promotes a
  lesson from one machine to a team, a repo, or a fleet.
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
- **Plugins can be centrally mandated — but not uniformly across surfaces.**
  Project-level `extraKnownMarketplaces`/`enabledPlugins`, managed-settings
  force-enable, `strictKnownMarketplaces` lockdown, container seed dirs, and
  claude.ai org-level plugin sync on Team/Enterprise plans (per-plugin
  installation preferences — Installed by default / Available for install /
  Required / Not available) all exist as mechanisms.
  *Correction (2026-08-09):* this page previously left the impression the
  CLI itself honors `enabledPlugins`/`extraKnownMarketplaces` automatically.
  It doesn't. [anthropics/claude-code#45323](https://github.com/anthropics/claude-code/issues/45323)
  ("CLI: Auto-install plugins from org managed settings") documents that the
  CLI fetches the managed-settings marketplace into
  `~/.claude/remote-settings.json` at startup but never registers it in
  `known_marketplaces.json` or installs the listed plugin — the org's admin
  still has to have every user run `/plugin marketplace add` and
  `/plugin install` by hand, or bake plugins into a container image at build
  time via `CLAUDE_CODE_PLUGIN_SEED_DIR`. Filed April 2026, the issue was
  closed **"not planned."** The same managed settings *do* auto-install on
  the desktop and web apps per the issue's own comparison and the Claude
  Help Center's org-plugin-management article (that page egress-blocked to
  this pass's fetcher — via search-quoted context, not opened directly) — so
  the CLI, Claudinite's own delivery surface, is specifically the one where
  central mandate still isn't unattended.
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
from one developer's local learnings to a reviewed shared canon. Even the
client-convergence story is uneven today: centrally-mandated plugins land
unattended on the desktop/web apps but not in the CLI, where the same
managed-settings config still needs a human running install commands (or a
container image baked ahead of time) — Anthropic's own tracker calls this
"not planned," not merely unshipped. The risk to watch is pace: scheduled
tasks, auto memory, and org plugin sync all shipped within about nine
months. That pace is not uniform, though, and the
unevenness is itself the signal: across the same window Anthropic shipped
three distribution features and did *not* ship cross-vendor interop, despite
AGENTS.md support being the loudest request in its own tracker (above).
Absorption has been fast on distribution and absent on interop — so the
interop-facing whitespace looks more durable than the raw nine-month cadence
suggests.

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
  supported-tools matrix lists "checks" as a feature column, and the CLI
  reference resolves what that means (2026-08-23): it is the `generate`
  command's `--check` flag, which "exits with code 1 if files are not up to
  date" — a drift/staleness check on the *generated config files*, the same
  class as Ruler's CI example, not a check on the rules being followed. The
  vocabulary reads as enforcement; the mechanism is still config-file drift.
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
  Re-checked 2026-08-02: the most active of them, **dallay/agentsync** (52 ★,
  Rust, last push 2026-08-01), synchronises agent configs across assistants
  via *symbolic links* — the newest live entrant in the category is still
  file-placement machinery with no auto-PR and no CI gate.

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
- [anthropics/claude-code#45323 — CLI auto-install from org managed settings, closed "not planned"](https://github.com/anthropics/claude-code/issues/45323) (filed 2026-04-08; opened directly, verified 2026-08-09); desktop/web auto-install behavior per the issue's own text and [Manage plugins for your organization — Claude Help Center](https://support.claude.com/en/articles/13837433-manage-plugins-for-your-organization) (page egress-blocked to this pass's fetcher — via search-quoted context)
- [Agent Skills spec (agentskills/agentskills)](https://raw.githubusercontent.com/agentskills/agentskills/main/README.md) and [Claude Code skills docs](https://code.claude.com/docs/en/skills); cross-vendor adoption: [paperclipped.de](https://www.paperclipped.de/en/blog/agent-skills-open-standard-interoperability/)
- [anthropics/skills](https://github.com/anthropics/skills) — 165,327 ★ (GitHub API, 2026-07-31)
- [intellectronica/ruler](https://github.com/intellectronica/ruler) — 2,833 ★; README re-read 2026-08-21: "a **single source of truth** for all your AI agent instructions, automatically distributing them", and its CI example "[v]erifies the committed agent files (AGENTS.md, CLAUDE.md, skills) match the .ruler/ source" — distribution plus file-drift, no work-product enforcement
- [dyoshikawa/rulesync](https://github.com/dyoshikawa/rulesync) — 1,273 ★; [supported-tools matrix](https://raw.githubusercontent.com/dyoshikawa/rulesync/main/docs/reference/supported-tools.md); [CLI commands reference](https://raw.githubusercontent.com/dyoshikawa/rulesync/main/docs/reference/cli-commands.md) — the `--check` flag's definition (opened directly, 2026-08-23)
- [RuleSync (hosted)](https://www.rulesync.dev/) and [rulesync-cli on npm](https://registry.npmjs.org/rulesync-cli) — free beta, paid plans planned
- [Goldziher/ai-rulez](https://github.com/Goldziher/ai-rulez) — enforce/verify hooks, remote includes
- [agent-sh/agnix](https://github.com/agent-sh/agnix) — 444-rule agent-config linter
- [anthropics/claude-code #6235 "Feature Request: Support AGENTS.md."](https://github.com/anthropics/claude-code/issues/6235) — closed `completed` 2026-08-17T03:37Z by bcherny, 4,944 👍 / 6,367 reactions / 374 comments, opened 2025-08-21 (GitHub API, 2026-08-21); corroborating [#34235](https://github.com/anthropics/claude-code/issues/34235) (90 👍)
- [anthropics/claude-code #31005 "Support for AGENTS.md and .agents/skills/, the community has been asking since August 2025"](https://github.com/anthropics/claude-code/issues/31005) — opened 2026-03-05, still **open** as of 2026-08-30 (fetched directly); *correction (2026-08-30): this page previously listed #31005 only as a 277-👍 corroborating vote for #6235 — it is in fact a distinct ask specifically for `.agents/skills/` directory support, and the one still open after #6235 closed*
- [anthropics/claude-code #50778 "Feature Request: Native support for AGENTS.md and .agents/skills/ as portable alternatives to CLAUDE.md and .claude/skills/"](https://github.com/anthropics/claude-code/issues/50778) — opened 2026-04-19, closed as a duplicate (fetched directly, 2026-08-30); its four-part spec (AGENTS.md dual-read, `.agents/skills/` dual-discovery, optional hooks/commands extensions, zero breaking changes) shipped none of it
- [Claude Code docs: memory](https://code.claude.com/docs/en/memory) — primary page, re-opened directly 2026-08-21: "Claude treats them as context, not enforced configuration"; "CLAUDE.md instructions shape Claude's behavior but are not a hard enforcement layer"; "target under 200 lines"; "Claude Code reads `CLAUDE.md`, not `AGENTS.md`" with the `@AGENTS.md` import, symlink, `/init` and `/import` (v2.1.213+) bridges; "Auto memory is machine-local… Files are not shared across machines or cloud environments"
- [dallay/agentsync](https://github.com/dallay/agentsync) — 52 ★, Rust, symlink-based agent-config sync (2026-08-02)
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

- rulesync.dev's concrete paid pricing and team once out of beta — the first
  direct commercial test of this category's willingness to pay.
- npm weekly downloads for ruler/rulesync/knowhub/ai-rules-sync (npm stats
  endpoints were egress-blocked; adoption is star/release-cadence-based).
- Confirm directly (not via search-quoted context — support.claude.com is
  still egress-blocked to this pass's fetcher) that claude.ai desktop/web org
  plugin sync actually auto-installs today; the CLI half of the question is
  now settled (it doesn't — anthropics/claude-code#45323, closed "not
  planned"), but the desktop/web side still rests on secondary
  characterization.
- Is `CLAUDE_CODE_PLUGIN_SEED_DIR`-at-build-time Anthropic's intended
  permanent answer for CLI fleets, or does #45323 being closed "not planned"
  just mean deprioritized rather than rejected in principle? No roadmap
  signal found this pass.
- Answered in two parts. 2026-08-21: file-reading closed with the "the
  import is the answer" stance — #6235 closed `completed` on the `/import`
  command, docs unchanged on native reading; no reopening or maintainer
  statement found as of 2026-08-30, so that half reads as final. 2026-08-30:
  the `.agents/skills/` half is not settled either way — #31005 stays open
  and #50778's duplicate-close shipped none of its four-part spec, with no
  maintainer rationale for either, so it reads as unaddressed rather than
  declined.
- Do the rival CLIs treat Claude Code's `@AGENTS.md` import/symlink bridge as
  a first-class output target? If the bridge is becoming the de-facto
  standard, emitting it is cheaper than emitting a second rules corpus.
- Current plugin counts in `claude-plugins-official`/`community` and their
  growth rate — the pace of native absorption is the platform-risk metric.
- Does any AAIF working group plan to add structure (schemas, checks,
  versioning) to AGENTS.md? `agents.md` is egress-blocked to this pass's
  fetcher (checked 2026-08-23); needs an unblocked environment or a human,
  not a later agent pass from here.
- Whether Cursor Teams' drift-detecting Team Commands extend beyond
  Cursor-native rules (to AGENTS.md/CLAUDE.md) — if so, first-party
  absorption reaches further than assumed. `cursor.com` is egress-blocked to
  this pass's fetcher (checked 2026-08-23); needs an unblocked environment or
  a human, not a later agent pass from here.
- Has any tool announced a Renovate-style auto-PR convergence bot for agent
  conventions? Re-checked 2026-08-02 (web search plus a GitHub repository
  search restricted to tools pushed since June 2026): none found — every
  live entrant is a CLI, a generator, or a symlinker. Absence of evidence
  from two search surfaces, not proof; re-check next pass.

## Growth log

- **2026-08-30** — wiki-growth pass (Context: the product-wiki tree moved in
  the window — re-checked; no product-wiki-affecting change landed since the
  2026-08-23 pass, which already spot-checked Website and Positioning
  against the #236 move, so nothing further to spot-check here). Researched
  the standing open question on whether #6235's `completed` close is final
  or a staging post: it is two separate asks, not one.
  `anthropics/claude-code` #31005 (opened 2026-03-05) is still open, and
  #50778 (opened 2026-04-19, a four-part consolidated spec covering
  `.agents/skills/` dual-discovery) was closed as a duplicate without
  shipping — the close resolved plain AGENTS.md file-reading only; the
  parallel ask for Anthropic's own `.agents/skills/` standard remains
  unaddressed. Corrects this page's prior citation of #31005 as a mere
  277-👍 corroborating vote — it is a distinct, still-open ask. `## Key
  insights` bullet on the AGENTS.md close rewritten to carry both halves.

- **2026-08-23** — wiki-growth pass (Context: the product-wiki tree moved in
  the window — the Website re-scope, #236). Spot-checked Website and
  Positioning against that move: both already reconcile cleanly, no
  correction needed. Researched the standing open question on
  dyoshikawa/rulesync's "checks" feature: its CLI reference (opened directly)
  resolves it as the `generate` command's `--check` flag — a drift check on
  generated config files, the same class as Ruler's CI example, not a check
  on agent behavior — closing the citation gap without changing the page's
  differentiation line. Two other open questions (Cursor Team Commands'
  AGENTS.md/CLAUDE.md scope; AAIF working-group plans for AGENTS.md
  structure) hit hard `EGRESS_BLOCKED` responses on `cursor.com` and
  `agents.md` — recorded as needing a human or an unblocked environment
  rather than left to re-check later. `## Key insights` left unchanged: the
  finding reinforces the existing config-drift-only conclusion rather than
  changing it.

- **2026-08-21** — owner-directed pass ahead of a site messaging rewrite.
  Three findings, all from primary sources: `anthropics/claude-code` #6235
  closed `completed` 2026-08-17 while the memory doc still says Claude Code
  does not read AGENTS.md (the shipped answer is `/import`, a one-time copy),
  which corrects this page's "open and unshipped" framing without changing
  the interop conclusion; Anthropic's memory doc now states the
  context-is-not-enforcement premise verbatim, which is a stronger citation
  for the category's blind spot than any third-party analysis this wiki
  carried; and native auto memory is documented machine-local, which closes
  the question of whether the platform had absorbed shared learning. Ruler's
  README re-read the same day — still distribution plus file-drift only, so
  the differentiation line holds. `## Key insights` rewritten on all three.

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
- **2026-08-09** — wiki-growth pass: researched the standing open question on
  whether claude.ai org-level plugin sync pushes or only offers plugins.
  Found anthropics/claude-code#45323 ("CLI: Auto-install plugins from org
  managed settings") — filed April 2026, closed **"not planned"** — which
  shows the CLI never auto-installs `enabledPlugins`/`extraKnownMarketplaces`
  (desktop/web do); corrected the "Plugins can be centrally mandated" bullet
  and the platform-layer whitespace paragraph accordingly, rewrote the
  matching Key insights bullet, and updated Open questions. Spot-checked
  intellectronica/ruler (2.8k ★) and anthropics/skills (167.1k ★) star counts
  via GitHub — both currently accurate, no correction needed.
- **2026-08-02** — growth pass on two standing open questions. (1) Quantified
  the AGENTS.md interop gap: `anthropics/claude-code` #6235 is open since
  2025-08-21 with 4,487 👍 / 5,808 reactions / 348 comments (plus #31005 and
  #34235), against a memory doc re-verified the same day that still reads
  "Claude Code reads `CLAUDE.md`, not `AGENTS.md`" — added to the substrate
  section and used to qualify the platform-absorption-pace claim, which
  previously read as uniformly fast (absorption is fast on distribution,
  absent on interop). The `## Key insights` header's AGENTS.md-spec-minimality
  bullet was displaced by this sharper finding; the spec-scope claim it
  carried is unchanged in the body. (2) The auto-PR-convergence-bot question
  was re-checked across web and GitHub repository search and stays open as a
  dated negative; the category's newest live entrant, dallay/agentsync, is
  symlink-based, which reinforces the existing fragmentation claim. Two new
  open questions added (Anthropic's reason for not shipping; whether the
  `@AGENTS.md` bridge is becoming the de-facto emission target).
