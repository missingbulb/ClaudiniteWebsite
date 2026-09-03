# site-stats — what the worker does

Recounts the four canon-wide figures `site/data/promoted.js` promotes — packs,
deterministic checks, skills, scheduled task types — and lands the difference.

There is no `task.md` because there is no agent: counting is arithmetic over the
canon's own files, and ["Why the declaration reads as it does"](#why-the-declaration-reads-as-it-does)
below says why that makes the whole run code.

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

## Why the declaration reads as it does

Carried over from the declaration's comments when it became task.json.

claudinite-website task: site-stats — keep the four canon-wide figures on
claudinite.com true.

`agent_model: 'none'` with `code_work: 'node worker.mjs'`: counting packs, checks,
skills and tasks out of the canon is arithmetic over a file listing, with no
judgment anywhere in it, so the whole run is code and no session is ever started.

`expected_outcome: 'pr'` with an `automerge` policy scoped to `site/data/` because the
change it makes is four numbers in the one data file that folder holds, each one
re-derivable from the canon by the same code that wrote it. The policy is measured
against the actual diff rather than trusted: a run that wrote anywhere else in the
repo parks for review instead of landing. The PR still lands per this repo's
delivery settings.

WHY WEEKLY. The numbers move when the canon gains a pack, a check, a skill or a
task — a thing that happens on the canon's clock, not this repo's, and never
urgently: a figure that is a week behind reads the same as one that is current.
Daily would spend a run to re-derive the same four numbers six times out of seven.

Self-contained (imports nothing): the whole contract is this default export.
pure code — arithmetic over the canon's own files
The folder the recount writes into, root-anchored: `worker.mjs`'s PROMOTED_PATH is
the only file in it, and this is the scope of what the run may land unreviewed. A
diff reaching anywhere else in the repo is covered by no allow term and the recount
parks; on a mount predating the `under:` scope the policy reads as invalid, which is
that same park, never a wider merge. The path is spelled here rather than referenced
because this declaration imports nothing, so task.test.mjs guards the two against
drifting apart.
a shallow clone of the canon plus a read per pack
The recount cannot be gated — the answer IS the count. What keeps it from being
a weekly PR of noise is the worker delivering only a difference.
