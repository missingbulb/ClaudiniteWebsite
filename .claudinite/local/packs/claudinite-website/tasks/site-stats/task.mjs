// claudinite-website task: site-stats — keep the four canon-wide figures on
// claudinite.com true.
//
// `agent_model: 'none'` with `code_work: 'node worker.mjs'`: counting packs, checks,
// skills and tasks out of the canon is arithmetic over a file listing, with no
// judgment anywhere in it, so the whole run is code and no session is ever started.
//
// `expected_outcome: 'pr'` with an `automerge` policy scoped to `site/data/` because the
// change it makes is four numbers in the one data file that folder holds, each one
// re-derivable from the canon by the same code that wrote it. The policy is measured
// against the actual diff rather than trusted: a run that wrote anywhere else in the
// repo parks for review instead of landing. The PR still lands per this repo's
// delivery settings.
//
// WHY WEEKLY. The numbers move when the canon gains a pack, a check, a skill or a
// task — a thing that happens on the canon's clock, not this repo's, and never
// urgently: a figure that is a week behind reads the same as one that is current.
// Daily would spend a run to re-derive the same four numbers six times out of seven.
//
// Self-contained (imports nothing): the whole contract is this default export.

// The folder the recount writes into, root-anchored: `worker.mjs`'s PROMOTED_PATH is
// the file inside it, and this is the scope of what the run may land unreviewed.
const PROMOTED_DIR = 'site/data';

export default {
  id: 'site-stats',
  frequency: 'weekly',
  precondition_signals: [],
  agent_model: 'none',                   // pure code — arithmetic over the canon's own files
  expected_outcome: 'pr',
  // Scoped to the folder the worker writes — `PROMOTED_PATH` is the only file in it —
  // so a diff reaching anywhere else in the repo is covered by no allow term and the
  // recount parks. On a mount predating the `under:` scope the policy reads as invalid,
  // which is that same park, never a wider merge.
  automerge: [`under:${PROMOTED_DIR}`],
  code_work: 'node worker.mjs',
  code_work_timeout: 300,                // a shallow clone of the canon plus a read per pack

  // No gate. There is nothing to observe that would tell this task whether the
  // canon's counts moved — the answer IS the count, and the count is the run.
  //
  // What keeps that from being a weekly PR of noise is idempotence rather than a
  // precondition: the worker compares its recount against the page as it stands on
  // the base branch and delivers only a difference. "Recounted, the page was already
  // right, nothing delivered" is an empty outcome, not a skip.
  precondition() {
    return { run: true, reason: 'weekly recount of the canon-wide figures the site promotes' };
  },
};
