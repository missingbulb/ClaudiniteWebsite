# site-release — what the worker does

Publishes `site/` to Cloudflare and records the version that went out. There is no
`task.md` because there is no agent: a release is a version number, a push and an
upload, and none of the three is a judgment call.

The operating knowledge — how to force one, how to roll one back, what is on the
Cloudflare side and what a park means — is the
[releasing-the-site](../../skills/releasing-the-site/SKILL.md) skill. This file is
only what the worker does.

## The run

1. **Read the branch tip.** The version is computed from `package.json` as the remote
   has it, never from the executor's checkout, so a release cannot advance from a
   stale number.
2. **Advance and stamp.** [`scripts/bump-version.mjs`](../../../../../../scripts/bump-version.mjs)
   owns the scheme and the footer tooltip; the worker imports its two pure functions
   rather than shelling out, because it is stamping a commit it is building, not this
   working tree.
3. **Push the bump to the default branch**, rebuilding on whatever landed underneath
   and retrying — the scheduler and the maintenance PRs land there too, and a lost
   race would leave the repo naming an older version than the one being served.
4. **Check out that exact commit** and substitute the Cloudflare Web Analytics beacon
   token into the copy about to be uploaded. The token is public and lives in the
   `CLOUDFLARE_ANALYTICS_TOKEN` repository variable; with no variable set the
   placeholder ships and the loader no-ops, which the run says out loud either way.
5. **`wrangler deploy`.** [`wrangler.json`](../../../../../../wrangler.json) points
   at `site/` and nothing else, so the agent-tooling directories are never uploaded.

The bump lands **before** the upload on purpose. Both halves can fail, and only one
of the two drifts is silent: a site serving a version the repo has no record of. A
version number consumed by a release that then failed to upload is visible in the
park and costs nothing — the next release takes the next number.

## Why the declaration reads as it does

**No workflow.** The Pages deploy this replaces had to be a workflow: its publish
steps were marketplace actions, and no task can invoke a `uses:` step. `wrangler` is
a CLI, so the whole release fits in code-work and the trigger, the gate and the
failure lane come from the queue instead of from YAML.

**`unreleased-commits`** ([`preconditions.mjs`](preconditions.mjs)) is the task's own
term because no built-in asks a release's question. The file says why the two nearest
built-ins are both wrong here.

**`on_interrupt: needs-human`** because a release is a one-shot external effect: a
reclaimed claim must not re-run it, spend a second version number and re-upload.

**`code_work_required_secrets`** names the two Cloudflare credentials so a repo that
has not configured them parks saying *which* one is missing, rather than failing
somewhere inside `wrangler`.

**`expected_outcome: no_code_changes`** — the run opens no pull request. It does
commit, but to the default branch directly: a version bump reviewed after the fact is
a review of a number a machine derived, and holding the release for it would mean the
site lags the repo by however long the PR sits.

**`schedule_after: claudinite-website/site-stats`** — the release publishes what that
task lands, so it yields while a recount is live rather than shipping the page one
cycle behind it.

**Daily.** A release goes out the night after anything lands, and a night with
nothing to release files no run at all. Per-push releasing to a staging environment
is a separate, later change.
