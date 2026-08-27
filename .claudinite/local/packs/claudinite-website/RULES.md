# claudinite-website

This repo's own conventions: the `site/` marketing page and the upkeep of this
repo's vendored Claudinite mount.

## Rules

- **The site describes itself in prose beyond its privacy claims — a behaviour
  change to something like deploy triggers must still correct every
  self-description it falsifies, in the same commit.** `site/README.md` makes a
  checkable claim about when the site publishes; dropping the deploy workflow's
  `paths:` filter (#45) left it still saying the site publishes only on a push
  that touches `site/**`. Before landing a change to site behaviour or to
  `deploy-pages.yml`, grep `site/README.md` and the page copy for what the
  change makes false, and ship the correction in the same commit as the
  behaviour.

- **A fix that belongs in the canon can be written here but never *pushed* from
  here — preserve it as a patch on an issue in this repo rather than routing
  around the block.** Work in this repo lands in canon code often (#53, #54, #55
  and #57 were all defects in the vendored engine and packs, found from here), and
  a scratch clone of the canon is read-only in practice: the git proxy
  serves `missingbulb/Claudinite` for a fetch but `403`s a push, because a
  session's GitHub scope is `missingbulb/claudinitewebsite` alone. That is an
  organisation egress policy, so don't re-diagnose it, don't retry with another
  remote or a token, and don't edit the vendored `.claudinite/shared/` mount in
  place to compensate — baselining re-vendors it and the edit vanishes. Finish
  and test the change in the scratch canon clone, then open an issue here
  carrying the full `git diff` as a patch block plus the verification you ran
  (#59 is the shape), so a session that does have canon scope can `git apply` it.

- **A `queue/instructions.md` step 6 `converge-item.mjs` failure from a session is
  a known, standing gap — recognize it immediately and never hand-replicate the
  transition with `mcp__github__issue_write`'s `labels` field.** This session
  type carries a GitHub credential wired for MCP tools only; `converge-item.mjs`
  (like any direct `curl`/raw-`fetch` call to `api.github.com`, e.g. a hand-rolled
  CI-status poll) needs the Action's own `GITHUB_TOKEN` and fails from here —
  first with `GITHUB_REPOSITORY is not set`, then (once set) a plain `401`, and
  under `NODE_USE_ENV_PROXY=1` a proxy `403` ("GitHub access is not enabled for
  this session. An org admin must connect the Claude GitHub App"). Seven
  work-item sessions in one day (2026-08-23) independently spent 2–5 minutes each
  re-deriving this exact chain via env/curl/`gh.mjs` archaeology before landing on
  the same conclusion, already filed as #274 and #277 — search for those before
  re-diagnosing rather than re-tracing env vars and script internals from
  scratch. Two of those sessions then made it worse: read `converge-item.mjs`'s
  internals to hand-replicate its labeling step and called
  `mcp__github__issue_write` with `labels: ["task:done"]` — that field is a full
  **overwrite** of the issue's label set, not an add, so it silently clobbered
  the item's actual queue-state labels (`task:agent`, etc.), exactly the failure
  `instructions.md` names ("doing it by hand anyway is how an item ends up closed
  wearing `task:agent`"). The only correct response, per `instructions.md`
  itself: post a plain comment naming the failure (citing #274/#277) and leave
  the item's labels and state untouched for a human.

- **A file missing from the mount is evidence about the *vendor set*, not about
  the canon — read the canon before an issue names the gap.** Three
  queue-dispatched sessions on 2026-08-16/17 found
  `engine/scheduler/queue/instructions.md` absent from `.claudinite/shared/`,
  and two filed it (#190, #192) as the canon never having shipped it, both
  saying they had "no way to tell which from here." A third shallow-cloned
  `missingbulb/Claudinite` and found the file present — a vendoring omission, so
  #192's ask to author it would have produced a duplicate of a file that already
  existed. The scratch canon clone the rule above names is read-only, but it
  *reads*: use it, and where it still can't settle the cause, report only that
  the mount lacks the file.

- **Never amend a subagent's already-pushed commit, and never relay a fabricated
  "fix" instruction for a check that doesn't exist as described, when a
  mid-dispatch Stop-hook finding turns out to be a background subagent's shared
  checkout misread as your own.** Issue #98: the orchestrator sent the subagent
  exactly such an instruction (which the subagent correctly refused as looking
  like an injection) and attempted `git commit --amend` on the subagent's
  already-pushed commit — blocked only by the permission classifier. **If the
  checkout-back or the amend is itself refused by the permission classifier,
  don't retry or force it** — a live subagent is using the shared checkout. Issue
  #116 hit exactly this: both remedies were blocked mid-run, and the orchestrator
  correctly left the branch untouched and waited; the branch reverted to the
  orchestrator's own assigned one, and the false-positive noise with it, the
  moment the subagent finished.

- **A background subagent dispatched to analyze a file makes the parent's own
  read of that same file redundant while it's running — wait on the subagent,
  don't shadow it.** Issue #211: while four background subagents each mined one
  conversation log for lessons, the orchestrator itself also directly read and
  grepped those same four files throughout the ~7.5-minute wait — 69 tool calls
  that fed nothing, since the two lessons it eventually landed matched the
  subagents' own reports verbatim. Idle on `ReadNotifications`/`ScheduleWakeup`
  for the wait, or spend it on genuinely different work, rather than re-deriving
  what a dispatched subagent is already computing.

- **After a background subagent's handle goes unreachable following a genuine
  worker-restart notice, checking only git log/status and the dispatch PR's own
  comments is not enough to tell whether it made progress — it may already have
  filed a GitHub issue.** In issue #112, a subagent found a blocking finding and
  filed issue #113 moments before its worker restarted. The orchestrator's recovery
  check covered only git and PR-comment state (both clean, since the subagent's
  real output was a filed issue, not a commit), concluded "no progress survived,"
  and relaunched a second subagent from a from-scratch briefing — which
  re-investigated the same root cause and filed a duplicate, issue #114, wasting
  about 5m42s of redundant subagent work. Before asserting "no progress" in a
  relaunch briefing after a worker-restart, also search GitHub issues
  (`search_issues`/`list_issues`) for anything the lost subagent may have filed —
  not just the dispatch PR's own comments and local git log.
