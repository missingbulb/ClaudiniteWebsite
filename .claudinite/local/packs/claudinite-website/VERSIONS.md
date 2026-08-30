# claudinite-website — change record

One row per change automatic work made to this local pack — a prose rule added or
removed, a check created, a rule corrected against a probe or deleted as
irrelevant. A run that changed nothing writes no row.

| Date | Task | Change |
|---|---|---|
| 2026-08-30 | `growth-dedup` | Stripped: the `queue/instructions.md` step 6 `converge-item.mjs`-specific framing ("known, standing gap", "post a plain comment ... leave the item's labels and state untouched") off the GitHub-credential rule — RULES.md. Covered by `packs/claudinite-tasks/queue/instructions.md` step 6 itself (v60827.4, #1374): "If it says it has no REST route from this session, that is the ordinary case ... Nothing is broken and nothing is deferred: you finish this item yourself, with the command still deciding every step ... the label sets already carry every label the issue should still have, so writing your own is how one gets dropped." Kept the residual point the canon doesn't make: a session's credential fails *any* direct `curl`/raw-`fetch` to `api.github.com`, not only `converge-item.mjs`. |
| 2026-08-27 | `growth-extract` | Added: **A background subagent dispatched to analyze a file makes the parent's own read of that same file redundant while it's running — wait on it, don't shadow it** — RULES.md. |
| 2026-08-25 | `growth-dedup` | Removed: the "sync local `main` after a merge — take one attempt, don't retry variants" rule — RULES.md. Covered by `packs/git-github/skills/git-github-advanced/SKILL.md`'s "A local git-mutation refusal after a merge already succeeded server-side is not worth a second variant": "if the session's own permission/auto-mode classifier denies a mutating git command (`git checkout main`, `git pull`, `git reset --hard`), take one attempt and stop; a differently-phrased retry ... hits the same classifier and burns minutes on a step with nothing downstream of it. State plainly that local `main` is behind and move on." |
| 2026-08-25 | `growth-dedup` | Removed: the `search_issues`/`list_issues` MCP-token-limit rule (narrow the `fields`) — RULES.md. Covered by `packs/git-github/skills/git-github-advanced/SKILL.md`'s "Cap *and* qualify every list/search call": "Ask for the fields you need (`["number","title","state"]` covers most lookups)" and "When you already know the exact title, don't search at all — list and match it yourself." |
| 2026-08-23 | `growth-extract` | Added: **A `converge-item.mjs` failure from a session is a known gap; never hand-replicate it via `issue_write`'s full-overwrite `labels` field** — RULES.md. |
| 2026-08-23 | `growth-extract` | Added: **Split a tall mobile screenshot into height quarters, not halves, before sending** — `skills/site-visual-check/SKILL.md`. |
