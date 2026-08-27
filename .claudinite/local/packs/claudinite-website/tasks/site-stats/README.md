# site-stats — what the worker does

Recounts the four canon-wide figures `site/data/promoted.js` promotes — packs,
deterministic checks, skills, scheduled task types — and lands the difference.

There is no `task.md` because there is no agent: counting is arithmetic over the
canon's own files, and [`task.mjs`](task.mjs) says why that makes the whole run code.

## The count

The site declares which canon it is about (`canonRepo`), so the worker follows that
rather than carrying the address a second time. It shallow-clones what it names and
reads the tree:

| Figure | Where it comes from |
|---|---|
| packs | the rows of `packs/directory.GENERATED.md` |
| checks | per pack, its `README.md` rows whose enforcement cell reads `check:` |
| skills | per pack, the directory entries under `skills/` |
| tasks | per pack, the directory entries under `tasks/` |

Two properties of that table are the whole reason the counting is its own tested
module ([`count-canon-stats.mjs`](count-canon-stats.mjs)) rather than a few lines
inline:

- **The directory is the pack set, not `packs/`.** A pack absent from the directory
  is absent deliberately — the canary pack declares `hidden: true` so nothing offers
  it — so counting the checkout's directories counts a pack no one can adopt.
- **A check is a table *row*, never a heading.** The section is "Checks" in most
  packs, "The check" in `barriers`; the columns are `Check | Severity` in most,
  `Rule | Confidence` in `claudinite-tasks`; and `claudinite-lifecycle` puts two
  check tables under one heading. Anything that keys off the heading or the header
  cells silently undercounts all three. Counting check *files* is no better: checks
  ship as `declared-checks.json` entries, as `*Rules/*.mjs` modules and as modules
  bundled inside a skill, so any one glob is wrong in both directions.

Nine packs are prose-only and legitimately have no README and no `skills/` or
`tasks/` directory; they count zero rather than failing.

## The write

[`promoted-stats.mjs`](promoted-stats.mjs) substitutes each number into the entry
carrying its label, leaving the rest of the file — the spotlight above all — exactly
as it was. The page is hand-edited by promo runs, so it is rewritten in place and
never regenerated.

Two consequences worth knowing:

- **A run that recounts the same four numbers delivers nothing.** The comparison is
  against the base branch's copy, not the working tree, so it holds no matter what
  the checkout is sitting on.
- **A label that is gone parks the item for a decision** rather than being appended
  back. The entry is missing because a person rewrote the stats block, and a task
  that restores its own row is overruling that edit instead of maintaining it.
