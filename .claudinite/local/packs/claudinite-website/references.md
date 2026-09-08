# References — rationale behind this pack's rules and checks

Maintenance and review material for the `writing-pack-prose` references convention: each entry
carries the reason a rule or check exists, written so a periodic review can reaffirm — or
retire — it. Entry keys are file-scoped stable identifiers (gaps allowed, never renumbered): an
end-of-line `(n)` marker in `RULES.md` cites `RULES-n`, one in a skill cites
`<skill-name>-n`, and `check:` entries cover checks. No session loads this file for daily work.

- **(RULES-1)** `site/README.md` made a checkable claim about when the site publishes;
  dropping the deploy workflow's `paths:` filter (#45) left it still saying the site publishes
  only on a push that touches `site/**`. Retire only if the site stops making checkable claims
  about its own behaviour.
- **(RULES-2)** Work in this repo lands in canon code often — #53, #54, #55 and #57 were all
  defects in the vendored engine and packs, found from here; #59 is the shape a patch issue
  should take. Retire only if a session here gains push scope to the canon repo.
- **(RULES-3)** Seven work-item sessions in one day (2026-08-23) independently spent 2–5 minutes
  each re-deriving this chain via env/curl/`gh.mjs` archaeology before landing on the same
  conclusion, already filed as #274 and #277. Two of those sessions made it worse: they read
  `converge-item.mjs`'s internals to hand-replicate its labeling step and called
  `mcp__github__issue_write` with `labels: ["task:done"]`, clobbering the item's actual
  queue-state labels — exactly the failure `instructions.md` names ("doing it by hand anyway is
  how an item ends up closed wearing `task:agent`"). Retire only if this session type gains a
  working GitHub credential for direct API calls.
- **(RULES-4)** Three queue-dispatched sessions on 2026-08-16/17 found
  `engine/scheduler/queue/instructions.md` absent from `.claudinite/shared/`, and two filed it
  (#190, #192) as the canon never having shipped it, both saying they had "no way to tell which
  from here." A third shallow-cloned `missingbulb/Claudinite` and found the file present — a
  vendoring omission; #192's ask to author it would have duplicated a file that already existed.
  Retire only if the mount gains a way to distinguish an omission from a genuine canon gap
  without a scratch clone.
- **(RULES-5)** Issue #98: the orchestrator sent the subagent exactly such a fabricated
  instruction (which the subagent correctly refused as looking like an injection) and attempted
  `git commit --amend` on the subagent's already-pushed commit, blocked only by the permission
  classifier. Issue #116 hit the same shape: both remedies were blocked mid-run, and the
  orchestrator correctly left the branch untouched and waited; the branch reverted to the
  orchestrator's own assigned one, and the false-positive noise with it, the moment the subagent
  finished. Retire only if dispatched subagents stop sharing the parent's checkout.
- **(RULES-6)** Issue #211: while four background subagents each mined one conversation log for
  lessons, the orchestrator itself also directly read and grepped those same four files
  throughout the ~7.5-minute wait — 69 tool calls that fed nothing, since the two lessons it
  eventually landed matched the subagents' own reports verbatim. Retire only if a session gains
  a way to tell a dispatched subagent's progress without reading its target files itself.
- **(RULES-7)** In issue #112, a subagent found a blocking finding and filed issue #113 moments
  before its worker restarted. The orchestrator's recovery check covered only git and
  PR-comment state (both clean, since the subagent's real output was a filed issue, not a
  commit), concluded "no progress survived," and relaunched a second subagent from a
  from-scratch briefing — which re-investigated the same root cause and filed a duplicate,
  issue #114, wasting about 5m42s of redundant subagent work. Retire only if a subagent's
  filed-issue output is surfaced to the orchestrator automatically on worker-restart.
- **(RULES-8)** Owner request, 2026-09-08 (#454): two asks in a row — host the site on Cloudflare
  Pages; email three fleet repos every morning through Cloudflare Email Service — had the same
  shape ("research online … how to do this correctly", "create a skill", "create a claudinite
  task", "add declared checks") and were each improvised in prose. Retire only if the skill's
  prompt trigger is shown to catch every such ask on its own.
- **(learning-a-technology-1)** The session that wrote the skill (#454) probed
  `developers.cloudflare.com` from a Claude Code web sandbox and got `CONNECT tunnel failed,
  response 403` — the environment's network policy, which `fetching-from-the-web` says no
  alternate source or later pass crosses. Neither earlier ask could tell whether its research
  had actually reached the vendor's documentation. Retire only if every session's environment
  is known to allow vendor-documentation egress, or the `## Verified` record is checked by
  machine against a real fetch log.
- **(learning-a-technology-2)** Owner request, 2026-09-08 (#454): "consider the difference
  between the project-specific task and the technology skills, and try to assess if the
  project-specific task is also an ad-hoc thing for the current project or could fit in a
  different pack"; the no-technology-local-pack rule and the promote stage's ownership of the
  call are `extracting-lessons.md`'s. Retire only if the growth lifecycle gains a way to read a
  task's intended home other than a recorded verdict.
- **(learning-a-technology-3)** Promotion lifts a skill's folder into a canon pack and the
  `growth-dedup` pass then removes the local copy; a worker that imports the skill's code by a
  relative path spelled in more than one place breaks at that removal with nothing red pointing
  at the cause. Retire only if the engine resolves a skill's code by skill name rather than by
  path.
- **(check:technology-skill-cites-dated-sources)** Every session that loads a technology skill
  reads its procedure as verified, and the two shapes that are not — a skill written from search
  snippets, a skill written from memory behind an egress block — leave no other mark in the
  tree. The dated URL and the `## Verified` section are the only signatures a scan can see.
  Retire only if a skill's provenance is recorded somewhere a check can read it.
- **(check:technology-skill-links-inside-its-folder)** The basics rule on writing file A to
  depend on file B already forbids re-spelling B; the residue here is that a technology skill
  is promoted by moving its folder, so a link out of it dangles at the landing — the failure
  `references-integrity` catches for markers, uncaught for links. Retire only if promotion
  rewrites relative links.
- **(check:technology-skill-code-imports-inside-its-folder)** Same lifting failure for code:
  an outward import resolves in the local pack and throws `ERR_MODULE_NOT_FOUND` at the
  landing, and this session hit exactly that on its own fixture's first run (an engine import
  one directory short). Test files are exempt because the fixture must reach the engine's
  declaration loader, and that one line is the known cost of a promotion. Retire only if
  skill code is bundled at promotion time.
