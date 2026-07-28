# Market

The competitive landscape for Claudinite: the open substrate standards every
coding-agent user already has on disk, and the direct competitors solving the
same problem Claudinite does — keeping AI-coding-agent conventions consistent
and current across many repositories.

## The substrate: per-repo convention files

Every agent-facing repo already carries at least one plain-text convention
file, and Claudinite has to interoperate with all of them rather than compete
with them:

- **AGENTS.md** is the vendor-neutral standard: a plain-markdown, no-frontmatter
  file at the repo root, formalized as an open spec in August 2025 with OpenAI,
  Google, Cursor, and Factory participating, then donated to the Linux
  Foundation's Agentic AI Foundation in December 2025. By December 2025 it was
  read by 30+ agents (Codex, Claude Code via import, Copilot, Cursor, Gemini
  CLI, Jules, Factory, Aider, Zed, VS Code, Windsurf, Devin) across 60,000+
  repos.
- **CLAUDE.md** is Claude Code's own project-memory file, pulled into every
  session automatically. Community best-practice converges on keeping it under
  ~200 lines, universally-applicable only, and using file-path references
  instead of pasting detail inline — the same "progressive disclosure" shape
  Claudinite's pack system (always-loaded `RULES.md` plus skills/checks pulled
  in on demand) formalizes structurally instead of leaving to author
  discipline.
- **Cursor** has moved from a single `.cursorrules` file to a `.cursor/rules/`
  directory, with per-file and combined character caps (6,000 / 12,000) and
  mention-triggered activation.
- **Windsurf** carries `global_rules.md` plus `.windsurf/rules/` (discovered
  walking up to the git root), with the legacy `.windsurfrules` still
  supported.
- **GitHub Copilot** uses `.github/copilot-instructions.md`; unlike Cursor and
  Windsurf it has no mention-triggered rule activation.

None of these substrate formats natively answer the question Claudinite is
for: how the *same* convention, once refined, reaches every repo that shares
it, and stays current there without hand-copying.

## Direct competitors: syncing rules across repos

A distinct, smaller tool category has formed around exactly that gap —
propagating shared agent rules across many repositories:

- **knowhub** — teams edit rules in one shared source and rerun a sync in each
  repo to pull in diffed updates, so no repo falls behind.
- **ai-rules-sync (lbb00)** — syncs/manages agent rules, skills, commands, and
  subagents across many agent tools at once (Cursor, Claude Code, Copilot,
  OpenCode, Trae AI, Codex, Gemini CLI, Warp).
- **ai-rules (fabian-barney)** — a shared rules/guidance repo consumed by
  multiple projects.
- **Sync AI Agent Rules** (GitHub Action) — a marketplace action wrapping the
  same sync-on-CI idea.
- **Antigravity Lab's multi-repo governance notes** frame the underlying
  design problem directly: keeping agent behavior consistent across separate
  repos via sync scripts and drift detection.

Where these tools mostly move **files** (copy/symlink the latest rule text
into place), Claudinite's pack model additionally carries **enforcement**
(checks that fail a session or CI on drift), **procedure** (skills), and
**scheduled work** (tasks) as one versioned, vendored unit per pack — the
differentiation to sharpen with more research below.

## Sources

- [AGENTS.md Complete Guide 2026: Spec, Tools, Examples](https://codersera.com/blog/agents-md-complete-guide-2026/)
- [Top AI Agent Standards to Know in 2026 — Agentailor](https://blog.agentailor.com/posts/top-ai-agent-standards-2026)
- [CLAUDE.md Best Practices: The Complete 2026 Guide — DEV Community](https://dev.to/nishilbhave/claudemd-best-practices-the-complete-2026-guide-435j)
- [Best practices for Claude Code — Claude Code Docs](https://code.claude.com/docs/en/best-practices)
- [Cursor vs Windsurf vs GitHub Copilot in 2026 — CodeAnt](https://www.codeant.ai/blogs/best-ai-code-editor-cursor-vs-windsurf-vs-copilot)
- [Cursor Rules vs CLAUDE.md vs Copilot Instructions — Agent Rules Builder](https://www.agentrulegen.com/guides/cursorrules-vs-claude-md)
- [ai-rules-sync — GitHub](https://github.com/lbb00/ai-rules-sync)
- [fabian-barney/ai-rules — GitHub](https://github.com/fabian-barney/ai-rules)
- [Introducing knowhub: Share AI Assistant Rules Across Repos — Medium](https://medium.com/@yujiisobe/introducing-knowhub-share-ai-assistant-rules-across-repos-17fb6b09c114)
- [Sync AI Agent Rules — GitHub Marketplace](https://github.com/marketplace/actions/sync-ai-agent-rules)
- [Keeping Agent Behavior Consistent Across Separate Repositories: Notes on Multi-Repo Governance — Antigravity Lab](https://antigravitylab.net/en/articles/antigravity/antigravity-multi-repo-agent-governance-design)

## Open questions

- Do any of knowhub, ai-rules-sync, or ai-rules ship enforcement (a failing
  check/CI gate), or are they purely file-propagation — the exact axis
  Claudinite's pack model (checks + skills + tasks, not just prose) would
  differentiate on?
- What are the adoption numbers (repos, orgs, GitHub stars) for knowhub and
  ai-rules-sync, to size this category against AGENTS.md's 60,000+ repos?
- Is there a pricing/business model for any of these — are they OSS-only, or
  does anyone charge for a hosted sync/registry service (relevant to
  Claudinite's own commercial positioning)?
- Does the AGENTS.md spec (via the Linux Foundation's Agentic AI Foundation)
  say anything about layering enforcement or packaged conventions on top of
  the base file, or is that explicitly out of its scope?
- How do knowhub and ai-rules-sync *market* themselves (headline claim, named
  audience, adoption CTA)? claudinite.com launched on the
  enforcement/procedure/scheduled-work differentiation (see
  [Website wiki](../Website/README.md)) — worth checking whether any
  competitor has started claiming enforcement too, which would blunt that
  message.

## Growth log

- **2026-07-28** — initial seed: substrate standards (AGENTS.md, CLAUDE.md,
  Cursor, Windsurf, Copilot) and the direct rule-sync competitor set
  (knowhub, ai-rules-sync, ai-rules) researched and cited.
- **2026-07-28** — open question added by the website build: how competitors
  market themselves, to defend the enforcement-differentiation message the
  launched site leads with.
