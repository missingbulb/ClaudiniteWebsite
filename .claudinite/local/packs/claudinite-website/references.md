# References — rationale behind this pack's rules and checks

Maintenance and review material for the `writing-pack-prose` references convention: each entry
carries the reason a rule or check exists, written so a periodic review can reaffirm — or
retire — it. Entry keys are file-scoped stable identifiers (gaps allowed, never renumbered): an
end-of-line `(n)` marker in `RULES.md` cites `RULES-n`, one in a skill cites
`<skill-name>-n`, and `check:` entries cover checks. No session loads this file for daily work.

- **(RULES-1)** `site/README.md` made a checkable claim about when the site publishes;
  dropping the deploy workflow's `paths:` filter (#45) left it still saying the site publishes
  only on a push that touches `site/**`. The README half is now the
  `release-contract-carries-its-description` check (#457), so the rule keeps only the half a
  check cannot see — the claims the *pages* make. Retire only if the site stops making
  checkable claims about its own behaviour in its own copy.
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
- **(check:claudinite-website/release-publishes-only-the-site)** The GitHub Pages deploy this
  replaced carried `path: site` in its `upload-pages-artifact` step, with a comment explaining
  that uploading the repo root would publish the agent-tooling directories. Moving that value
  into `wrangler.json` (#457) moved it somewhere a one-character edit is invisible in review, so
  the boundary is asserted rather than commented. The `main` half is the same boundary on the
  other axis: `site/privacy.html` tells visitors there is no server of ours behind the page, and
  a Worker script entry point would make that false silently. Retire only if the site stops being
  static assets only.
- **(check:claudinite-website/no-second-path-to-production)** The release moved out of
  `deploy-pages.yml` and into the `site-release` task (#457) so the version bump, the gate and
  the failure lane are the queue's. A workflow that publishes would restore the exact shape that
  move removed — and would do it silently, since a green workflow deploying the site looks like
  success. Retire only if the release stops being a task.
- **(check:claudinite-website/release-declares-its-credentials)** The executor hands a task's
  code-work only the secrets that task declared, so an undeclared credential is not merely
  missing at run time — it can never arrive, and the run fails inside `wrangler` instead of
  parking with the name of what a person must set. `on_interrupt` is in the same check because
  both fields are the declaration's statement that publishing is a credentialled one-shot effect.
  Retire only if the release stops calling an external API.
- **(check:claudinite-website/analytics-token-stays-uninjected)** The loader is written to
  no-op on its placeholder, which makes both failure modes silent: a committed real token
  beacons from every local checkout and every fork, and a placeholder rewritten to something
  else stops counting visits with the page still looking correct. The deploy-time substitution
  is what `site/privacy.html` describes, so the placeholder is the disclosure's mechanism as
  much as the loader's. Retire only if the token stops being injected at release time.
