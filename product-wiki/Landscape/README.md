# Landscape

The agent-tooling stack read as **layers rather than vendor classes**: which
question each offering answers, where Claudinite sits among them, and what
separates it from each. [`Market/`](../Market/README.md) is the per-vendor
inventory — who exists, organised by category — and stays the place a new
competitor is first recorded. This page is the frame that explains why several
of those entries are not competitors at all. Claudinite's own strengths and
gaps are [`Positioning/`](../Positioning/README.md).

## Key insights

- Xirp, Gas Town and Claudinite mostly compose rather than compete — they sit at different layers of one stack.
- No Claude Code plugin scope carries repo-scoped enforcement: project scope is advisory, managed scope follows people.
- Spotify shipped a vendor-neutral agent IDE and calls harness portability an architectural requirement, not a feature.
- Gas Town runs its gates as in-session stages before a PR exists; its workers never push to main and never wait for review.
- Gas Town rebases onto the target *before* running the full suite, so its merge queue can fast-path a merge in ~5 seconds.
- Neither Xirp nor Gas Town has any conformance layer — both list rule files, neither checks that rules were followed.
- A plugin distributes capability into a session; a pack distributes constraint, plus files the repository keeps.

## The layer model

Every offering below answers a different question. Read in this order, the
landscape stops looking like one crowded category:

| Layer | The question it answers | Who is there |
| :--- | :--- | :--- |
| **Substrate** | What file does an agent read? | AGENTS.md, CLAUDE.md, SKILL.md |
| **Labor** | Who does the work, and how does it land? | Gas Town |
| **Cockpit** | How does a human watch and steer many sessions? | Xirp |
| **Distribution** | How does capability reach a session? | Claude Code plugins, Vercel `npx skills` |
| **Governance** | What constrains any session, and who checks? | Claudinite; rule-sync rivals, partially |

Two observations fall straight out of the table.

**Enforcement appears at exactly one layer.** Substrate formats are silent on
it by design; labor and cockpit products list rule files without reading them;
distribution ships capability. Only the governance layer asks whether a rule
was followed — and within it, the rule-sync rivals check only that the rules
*arrived* (see [`Market/`](../Market/README.md)).

**Composition, not displacement.** A Gas Town worker agent, a session in
Xirp's grid, and a plugin-installed skill all run inside a repository whose
conventions something else has to govern. Nothing at the labor, cockpit or
distribution layer forecloses the governance layer, which is why the honest
comparison is rarely "which one wins."

## Spotify Xirp — the cockpit layer

Xirp is a **macOS desktop app, in beta**, for running many coding-agent
sessions in parallel — Claude Code, Codex or Gemini in persistent terminals,
each task in its own Git worktree, with tabs for Git, files, and *listings* of
the project's skills and rules ([Xirp
docs](https://backstage.spotify.com/docs/xirp),
[Projects](https://backstage.spotify.com/docs/xirp/projects.md)). It runs
standalone; connecting **Spotify Portal** adds organisational context — catalog
entities, Workspaces, members, records, a generated wiki — served to the agent
over MCP, plus manual upload of the session transcript back into the Workspace
([Workspaces](https://backstage.spotify.com/docs/xirp/workspaces/index.md)).

The launch post claims **thousands of Spotify engineers and more than 36,000
sessions**, and states vendor-neutrality as an architectural requirement rather
than a feature: switch harness or model mid-task and the working state carries
over, including to self-hosted open models, "so that we are never locked in"
([What we've learned scaling AI coding agents at Spotify, Tyson Singer,
2026-08-10](https://portal.spotify.com/blog/introducing-xirp)).

**What it does not do.** Xirp's Rules tab is a viewer: it lists `CLAUDE.md`,
`AGENTS.md` and supported agent config files, and nothing reads or enforces
them. There is no check concept, no CI surface, and no path by which a lesson
from one session becomes a constraint on the next — Portal's loop ends in a
wiki page a human accepts or rejects.

**Ideas worth tracking.** Three are relevant to Claudinite's own roadmap and
are recorded here as landscape evidence, not as requirements:

- **Harness portability as a stated architecture principle**, not a
  compatibility afterthought — the sharpest external articulation found of the
  cost of binding a corpus to one agent.
- **A three-verb review queue** — Accept / Reject / Dismiss — plus a "Wiki Log"
  of what was proposed and what happened
  ([wiki-pages](https://backstage.spotify.com/docs/xirp/workspaces/wiki-pages.md)).
  A durable *rejected* verdict is something a PR-based promotion loop, which
  has only merge and close, cannot express.
- **The Wiki Schema page**: the prompt that governs generation shipped as an
  editable artifact beside its own output, so a team steers how its knowledge
  is written without forking the generator.

## Gas Town — the labor layer

Gas Town is Steve Yegge's **open-source multi-agent orchestration system**
(Go CLI plus Dolt plus tmux), open-sourced 2026-01-01
([gastownhall/gastown](https://github.com/gastownhall/gastown),
[yegge.ai/gastown](https://yegge.ai/gastown)). A **Mayor** decomposes an ask
into **beads** (a git-backed issue ledger used as external agent memory),
bundles them into **convoys**, and slings them to **polecats** — worker agents
with persistent identity but ephemeral sessions, each in a git-worktree
**hook**. Eleven agent presets ship built in (`claude`, `codex`, `gemini`,
`copilot`, `cursor`, and others).

It is the most complete external answer found to *unattended-agent failure
handling*, and that — not parallelism — is what makes it worth studying:

- **A three-tier watchdog chain**: a Go daemon heartbeat → **Boot** (triage) →
  **Deacon** (cross-rig patrol) → per-rig **Witness**, with a problems view
  classifying agents as GUPP-violation / stalled / zombie / working / idle.
- **Severity-routed escalation** (`gt escalate -s HIGH`), routed
  Deacon → Mayor → Overseer.
- **A capacity scheduler** capping concurrent workers to avoid rate-limit
  exhaustion.
- **Seance** (`gt seance --talk <id>`) — a session discovers and *interrogates
  its predecessors* through their `.events.jsonl` logs, rather than reading a
  handover someone wrote.
- **Wasteland** — federated cross-town work coordination over DoltHub, with
  portable multi-dimensional reputation stamps.

### Gas Town's gating model

The deepest external treatment of merge gating found in this landscape, and
the one that most directly validates running gates **as in-session stages
before a PR exists** rather than as review round-trips on an open PR. Read from
`internal/formula/formulas/mol-polecat-work.formula.toml` in the repository.

A worker moves through eight stages, each with an explicit `Exit criteria:`
line and crash-resumable at stage granularity: `load-context → branch-setup →
implement → commit-changes → self-review → build-check → pre-verify →
submit-and-exit`. Three are gates:

- **`self-review`** — an agentic review of the worker's own diff before the
  build check, graded A–F, with "fix any CRITICAL or MAJOR issues before
  proceeding" and an exit criterion of Grade B or better. It also enforces
  scope: "Only files relevant to {{issue}} should appear… If you accidentally
  modified unrelated files, remove those changes."
- **`pre-verify`** — fetch, **rebase onto the target branch, then run the full
  configured suite on the rebased result** (`build_command`,
  `typecheck_command`, `lint_command`, `test_command`, each from rig config).
  The stated rationale: "This enables the refinery to fast-path merge your MR
  in ~5 seconds instead of re-running gates." The generalisable idea is that a
  gate result is only meaningful with a freshness proof — the claim is not "the
  suite passed" but "the suite passed on a branch rebased onto current target"
  — and `gt done --pre-verified` carries that claim forward. Skipping is
  explicitly permitted and merely costs speed.
- **`submit-and-exit`** — one hard gate: zero-commit branches are rejected
  outright.

Queue-side, the **Refinery** batches merge requests, runs gates on the merged
stack, and on red **bisects to isolate the culprit and merges the innocent
ones** — a Bors-style queue in which workers never push to main. Two further
mechanisms:

- **Gate beads with a retry loop**
  (`internal/formula/formulas/gate-bead-instructions.md`): the review gate is
  itself a work item, blocked by all implementation tasks. On finding issues it
  **does not fix them** — it files one fix item per issue, adds each as a
  blocking dependency *on itself*, dispatches them, and exits. When they close,
  the gate unblocks and a **fresh** reviewer re-runs every step from the top
  with no memory of the prior pass. Two properties: the reviewer never fixes,
  and re-review carries no priors.
- **Review presets by change class**
  (`internal/formula/formulas/code-review.formula.toml`): ten parallel
  specialised legs — correctness, performance, security, elegance, resilience,
  style, smells, plus three verification legs (`wiring`, for dependencies added
  but never imported; `commit-discipline`; `test-quality`, on the premise that
  "coverage numbers lie, a test that can't fail provides no value") — selected
  by preset: `gate` for the automatic flow, `full` for major features, plus
  `security-focused` and `refactor`. This expresses trust as *how much review a
  change class earns*, rather than as a per-PR policy predicted in advance.
- **Safety stop** (`internal/refinery/safety_stop.go`): a durable
  `safety_stop:` label on the refinery's own work item that blocks it from
  starting at all, cleared only by an operator — "the referenced ID is
  provenance, not an implicit clear condition," i.e. it never self-clears.

Two design choices here are worth recording as **counter-examples**, not
models: the merge-queue priority function (`internal/refinery/score.go`) is
tunable magic numbers — base 1000, +10/hour convoy age, +100×(4−priority),
−50/retry capped at 300 — and the gate suite treats an **empty command as
"skip silently"**, so an unconfigured gate and a deliberately-disabled one are
indistinguishable.

**What it does not do.** Gas Town has no static conformance layer at all — no
catalog of checks, no severities, no scope split. Its gates are shell commands
plus agentic review, and each town re-derives its own conventions; nothing
distributes a versioned body of rules between towns.

## Claude Code plugins — the distribution layer

Unlike the two above, this is **the same category as Claudinite**: a named,
versioned bundle of skills, hooks and config, declared on a repo and
distributed to many. The mapping is close enough that the differences are the
whole story ([plugins](https://code.claude.com/docs/en/plugins),
[reference](https://code.claude.com/docs/en/plugins-reference)).

| Claudinite | Claude Code plugins |
| :--- | :--- |
| `packs/<name>/` | a plugin directory |
| `packs/directory.GENERATED.md` | `marketplace.json` |
| pack id in `.claudinite-settings.json` | `enabledPlugins` in `settings.json` |
| the vendored tree (`repo:.claudinite/shared/`) | plugin cache (copy or link mode) |
| pack version + `VERSIONS.md` | `plugin.json` `version` |
| `adopt-pack` skill | `claude plugin install` |
| nightly converge task | `/plugin update`, auto-update |
| `skills/<name>/SKILL.md` | `skills/<name>/SKILL.md` — *identical shape* |
| SessionStart / PreToolUse / Stop hooks | `hooks/hooks.json` — *identical event names* |
| pack adoption interview (`questions`) | `userConfig`, prompted at enable time |
| `seededByDefault` | `defaultEnabled` |
| `requires` (no version constraints) | `dependencies` with semver constraints |

### The four install scopes, and the enforcement hole

Plugin "install scopes" are Claude Code's ordinary settings scopes applied to
one key, `enabledPlugins`
([settings](https://code.claude.com/docs/en/settings)). Precedence runs
managed → command-line `--settings` → project-local → shared-project → user.

| Scope | File | Reaches |
| :--- | :--- | :--- |
| `user` | `~/.claude/settings.json` | one person, every project on that machine |
| `project` | `.claude/settings.json` | everyone in the folder; committed |
| `local` | `.claude/settings.local.json` | one person, one project; kept out of git |
| `managed` | `managed-settings.json`, MDM, or the claude.ai console | everyone the org deploys it to; read-only |

Two documented facts turn this into the landscape's most important finding:

- **Project scope distributes the decision, not the bytes.** "As of Claude Code
  v2.1.195, adding the marketplace doesn't install plugins that come from an
  external source, on any path that loads plugins… Claude Code reports the
  plugin as not installed and shows the `claude plugin install` command to run"
  ([discover-plugins](https://code.claude.com/docs/en/discover-plugins)). It is
  also opt-out-able: a teammate sets the plugin `false` in
  `.claude/settings.local.json`. This is the documented mechanism behind the
  insight already on [`Market/`](../Market/README.md) that CLI auto-install was
  closed "not planned" — it reinforces that conclusion rather than changing it.
  For automated environments the supported answer is
  `CLAUDE_CODE_PLUGIN_SEED_DIR`, a read-only plugin directory pre-populated at
  container build time
  ([marketplaces](https://code.claude.com/docs/en/plugin-marketplaces)).
- **Managed scope is enforced but follows people and machines, never repos.**
  Its four delivery mechanisms are server-managed settings from the claude.ai
  console (fetched at startup, polled hourly, and the only one reaching a cloud
  session), MDM/OS policy, a `managed-settings.json` file in a system
  directory, and the Windows `HKCU` registry
  ([managed-settings](https://code.claude.com/docs/en/managed-settings)). A
  managed policy travels with the person to every repository they open and
  cannot be narrowed to one; the console cannot even target a group yet.

**Therefore no plugin scope carries repo-scoped enforcement.** Project scope
reaches the repository but is advisory and locally overridable; managed scope
is genuinely enforced but is attached to identities and devices. The gap
between the two is precisely where a vendored, git-tracked corpus sits, and it
is not an oversight — the two systems are answering different questions.

### What each can distribute

**Only a plugin** can distribute subagents, MCP servers, LSP servers,
background monitors, themes, output styles, channels, and semver-constrained
dependencies — all *capability or integration*.

**Only a pack** can distribute conformance checks as a typed artifact
(world/work scope split, severities, `fix` text, a catalog), scheduled tasks
with preconditions, migration records consumers apply to their own paths,
workflow stubs, install-once seeded files, an adoption interview, environment
requirements, a content fingerprint, and rules addressed to *another pack*
(`repo:.claudinite/shared/engine/pack_loader/pack-schema.mjs`).

Two pack slots have no plugin analogue at any level, and they are the
load-bearing ones: `seedOps` and `stubs` **write files the consuming repository
then owns**, and `adoptionHandover` **distributes instructions to a human** —
steps only a person can perform, filed as a tracking issue. A plugin is purely
additive to a session and never modifies the repository or addresses anyone but
the agent.

## Key differentiators, consolidated

| | Gas Town | Xirp | Claude Code plugins | Claudinite |
| :--- | :--- | :--- | :--- | :--- |
| Layer | Labor | Cockpit | Distribution | Governance |
| Autonomy | agents dispatch agents | human-driven | n/a | ambient constraint |
| Substrate | Go + Dolt + tmux, git-native | macOS app + SaaS | plugin cache | files tracked in the repo |
| Work ledger | beads (git-backed) | Portal Workspaces | — | GitHub issues |
| Failure handling | watchdogs, escalation, bisecting queue | a human notices | — | janitor lane, park to needs-human |
| Enforces conventions | **no** | **no** (Rules tab is a viewer) | **no repo-scoped scope** | **yes** |
| Learning loop back to a shared canon | no | manual transcript upload | publish-only | extract → promote → dedup |
| Works offline / in CI | partial | no | no (cache, or a seed image) | yes — corpus is in the checkout |

The two properties nothing else in this table has: **enforcement that travels
with the repository**, and **a loop that turns a lesson from one repo into a
constraint on every repo**. Marketplaces are strictly one-directional; Portal's
loop ends at a human-reviewed wiki page; Gas Town has no canon to promote into.

## Sources

- [Xirp — Spotify for Backstage documentation](https://backstage.spotify.com/docs/xirp) — overview, beta scope, macOS-only, agents supported
- [Xirp: Projects](https://backstage.spotify.com/docs/xirp/projects.md) — the Skills and Rules tabs as listings; worktree-per-session
- [Xirp: Workspaces](https://backstage.spotify.com/docs/xirp/workspaces/index.md) — Portal context over MCP, manual transcript upload
- [Xirp: Workspace wiki pages](https://backstage.spotify.com/docs/xirp/workspaces/wiki-pages.md) — Accept/Reject/Dismiss, Wiki Log, editable Wiki Schema
- [What we've learned scaling AI coding agents at Spotify — Tyson Singer, 2026-08-10](https://portal.spotify.com/blog/introducing-xirp) — 36,000+ sessions, vendor-neutrality as architecture
- [gastownhall/gastown](https://github.com/gastownhall/gastown) — README: Mayor/rigs/polecats/beads, watchdogs, Refinery, Seance, Wasteland
- [Gas Town — Steve Yegge](https://yegge.ai/gastown) — author's own overview
- [Steve Yegge's Gas Town comes to the cloud — The New Stack](https://thenewstack.io/steve-yegges-ai-agent-orchestration-project-gas-town-comes-to-the-cloud-and-brings-the-wasteland-with-it/) — open-sourcing and positioning
- [Claude Code: Create plugins](https://code.claude.com/docs/en/plugins) and [Plugins reference](https://code.claude.com/docs/en/plugins-reference) — components, manifest schema, install scopes, version management
- [Claude Code: Discover and install plugins](https://code.claude.com/docs/en/discover-plugins) — the v2.1.195 non-install behaviour for external-source plugins
- [Claude Code: Plugin marketplaces](https://code.claude.com/docs/en/plugin-marketplaces) — source types, `CLAUDE_CODE_PLUGIN_SEED_DIR`, `strictKnownMarketplaces`
- [Claude Code: Settings files and precedence](https://code.claude.com/docs/en/settings) and [Managed settings](https://code.claude.com/docs/en/managed-settings) — the scope stack and the four managed delivery mechanisms

## Open questions

- Xirp's licensing, pricing and availability outside Spotify: the docs are a
  beta-invitation surface and the blog points at `xirp.spotify.com`, which was
  not opened this pass. Whether Xirp is sold, bundled with Portal, or free is
  unknown, and it determines whether it ever appears in
  [`Business/`](../Business/README.md).
- Does Xirp's Portal pairing enforce anything, or only supply context? Nothing
  in the docs read this pass suggests enforcement, but the Soundcheck
  scorecard product sits in the same Portal — whether the two are wired
  together is unresolved and would move Spotify from cockpit to governance.
- Gas Town adoption: no star count, download figure or user estimate was
  captured this pass. Its trajectory decides whether the labor layer becomes a
  buyer of governance or grows its own.
- Whether a relative-path (in-repo) plugin marketplace auto-loads for
  teammates. The v2.1.195 rule is scoped in the docs to plugins "from an
  external source such as a GitHub repository or npm package"; the in-repo case
  is an inference from that qualifier, not a documented statement. This matters
  directly — it is the configuration closest to a vendored pack.
- Does any offering at the labor or cockpit layer intend to add conformance
  checking? Nothing found in either product's docs this pass; a change here
  would be the first real overlap with the governance layer.

## Growth log

- **2026-09-10** — page created, owner-directed, out of a session comparison
  (Claudinite #480). Three offerings absent from or thin in
  [`Market/`](../Market/README.md) researched from primary sources: Spotify
  Xirp (docs plus launch post), Gas Town (repository README plus
  `internal/refinery/`, `internal/formula/formulas/` and
  `internal/config/roles/` read from a sparse clone), and Claude Code plugins
  (six doc pages). The organising finding — that these sit at different layers
  and mostly compose — is why this exists as its own wiki rather than as more
  sections on `Market/`, which stays the per-vendor inventory. The strongest
  single result is that **no plugin install scope carries repo-scoped
  enforcement**, which is the documented mechanism behind `Market/`'s existing
  "CLI auto-install closed not planned" insight and reinforces rather than
  changes it. Gas Town's gating ladder is recorded in unusual depth because it
  is the closest external prior art to gates-before-the-PR. No
  `product-requirements/` change proposed; the retrospective candidates noted
  under Xirp (a durable *rejected* verdict; generation policy as an editable
  artifact) are landscape evidence and need a human to become requirements.
