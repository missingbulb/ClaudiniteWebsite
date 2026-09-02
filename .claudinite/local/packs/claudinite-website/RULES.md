# claudinite-website

This repo's own conventions: the `site/` marketing page and the upkeep of this
repo's vendored Claudinite mount.

## Rules

- **The site describes itself in prose beyond its privacy claims — a behaviour
  change to something like deploy triggers must still correct every
  self-description it falsifies, in the same commit.** Before landing a change
  to site behaviour or to `deploy-pages.yml`, grep `site/README.md` and the
  page copy for what the change makes false, and ship the correction in the
  same commit as the behaviour. (1)

- **A fix that belongs in the canon can be written here but never *pushed* from
  here — preserve it as a patch on an issue in this repo rather than routing
  around the block.** A scratch clone of the canon is read-only in practice:
  the git proxy serves `missingbulb/Claudinite` for a fetch but `403`s a push,
  because a session's GitHub scope is `missingbulb/claudinitewebsite` alone.
  That is an organisation egress policy, so don't re-diagnose it, don't retry
  with another remote or a token, and don't edit the vendored
  `.claudinite/shared/` mount in place to compensate — baselining re-vendors it
  and the edit vanishes. Finish and test the change in the scratch canon
  clone, then open an issue here carrying the full `git diff` as a patch block
  plus the verification you ran, so a session that does have canon scope can
  `git apply` it. (2)

- **A `queue/instructions.md` step 6 `converge-item.mjs` failure from a session is
  a known, standing gap — recognize it immediately and never hand-replicate the
  transition with `mcp__github__issue_write`'s `labels` field.** This session
  type carries a GitHub credential wired for MCP tools only; `converge-item.mjs`
  (like any direct `curl`/raw-`fetch` call to `api.github.com`, e.g. a hand-rolled
  CI-status poll) needs the Action's own `GITHUB_TOKEN` and fails from here —
  first with `GITHUB_REPOSITORY is not set`, then (once set) a plain `401`, and
  under `NODE_USE_ENV_PROXY=1` a proxy `403` ("GitHub access is not enabled for
  this session. An org admin must connect the Claude GitHub App"). That
  `labels` field is a full **overwrite** of the issue's label set, not an add,
  so hand-replicating it silently clobbers the item's actual queue-state
  labels (`task:agent`, etc.). The only correct response, per `instructions.md`
  itself: post a plain comment naming the failure and leave the item's labels
  and state untouched for a human. (3)

- **A file missing from the mount is evidence about the *vendor set*, not about
  the canon — read the canon before an issue names the gap.** The scratch
  canon clone the rule above names is read-only, but it *reads*: use it, and
  where it still can't settle the cause, report only that the mount lacks the
  file. (4)

- **Never amend a subagent's already-pushed commit, and never relay a fabricated
  "fix" instruction for a check that doesn't exist as described, when a
  mid-dispatch Stop-hook finding turns out to be a background subagent's shared
  checkout misread as your own.** **If the checkout-back or the amend is
  itself refused by the permission classifier, don't retry or force it** — a
  live subagent is using the shared checkout; leave the branch untouched and
  wait. (5)

- **A background subagent dispatched to analyze a file makes the parent's own
  read of that same file redundant while it's running — wait on the subagent,
  don't shadow it.** Idle on `ReadNotifications`/`ScheduleWakeup` for the wait,
  or spend it on genuinely different work, rather than re-deriving what a
  dispatched subagent is already computing. (6)

- **After a background subagent's handle goes unreachable following a genuine
  worker-restart notice, checking only git log/status and the dispatch PR's own
  comments is not enough to tell whether it made progress — it may already have
  filed a GitHub issue.** Before asserting "no progress" in a relaunch briefing
  after a worker-restart, also search GitHub issues (`search_issues`/`list_issues`)
  for anything the lost subagent may have filed — not just the dispatch PR's own
  comments and local git log. (7)
