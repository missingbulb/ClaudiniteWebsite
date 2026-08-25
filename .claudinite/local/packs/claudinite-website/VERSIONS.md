# claudinite-website — change record

One row per change automatic work made to this local pack — a prose rule added or
removed, a check created, a rule corrected against a probe or deleted as
irrelevant. A run that changed nothing writes no row.

| Date | Task | Change |
|---|---|---|
| 2026-08-25 | `rule-revalidation` | Removed: **"`git checkout main`/`fetch origin main`/`pull` are refused by the session's permission classifier"** — probe (`git checkout main`, `git fetch origin main`, `git pull` from a live work-item session) showed none of the three is refused; the surface the rule warned about no longer exists — RULES.md. |
| 2026-08-25 | `rule-revalidation` | Corrected: **`mcp__github__search_issues`/`list_issues` token-limit rule** — probe showed `search_issues` is now natural-language semantic matching, not a raw GitHub `in:title` qualifier search (a query ending `in:title` still surfaced non-matching titles); reworded to the actual trigger (an unnarrowed call, not specifically a title search) while keeping the confirmed `fields`-narrowing fix — RULES.md. |
| 2026-08-23 | `growth-extract` | Added: **A `converge-item.mjs` failure from a session is a known gap; never hand-replicate it via `issue_write`'s full-overwrite `labels` field** — RULES.md. |
| 2026-08-23 | `growth-extract` | Added: **Split a tall mobile screenshot into height quarters, not halves, before sending** — `skills/site-visual-check/SKILL.md`. |
