---
name: releasing-the-site
description: How claudinite.com is released — the version contract, the guards that stop a release loop or a half-release, forcing one, rolling one back, and which parts of Cloudflare only a person can change. Use when changing the release task, wrangler.json, the version script or the analytics loader, and when a release parks.
metadata:
  force-load-on-file-edits-paths:
    - "**/tasks/site-release/**"
    - "**/wrangler.json"
    - "**/scripts/bump-version.mjs"
    - "**/site/assets/analytics.js"
---

# Releasing the site

A release is one thing: the default branch's tree, at a version the release itself
cuts, uploaded to Cloudflare. The `claudinite-website/site-release` task owns all of
it — its `README.md` says what the worker does; this says how to operate it and what a
change to it must not break.

## The four properties a change preserves

- **The version names what shipped.** `package.json` is the only source and the footer
  tooltip is generated from it, so the bump and the upload are one run — and the bump
  goes first, because of the two possible drifts only one is invisible: a site serving
  a version the repo has no record of. A number consumed by an upload that then failed
  is visible in the park and costs nothing.
- **A release cannot re-arm itself.** The gate is "the branch has moved past the last
  release commit", read off the `Claudinite-Task:` trailer. Anything that makes the
  release's own commit look like ordinary work releases nightly, forever.
- **Only `site/` is published.** `wrangler.json`'s `assets.directory` is the outer
  boundary, and the repo root holds the vendored mount, the queue's workers and the
  packs — none of which may reach a public URL. Inside it, `site/.assetsignore`
  (`.gitignore` syntax, wrangler's own mechanism) holds back what is documentation
  rather than page, so a file landing in `site/` is not automatically a public URL.
- **The beacon token is injected, never committed.** `site/assets/analytics.js` ships
  with its placeholder and no-ops; the deploy substitutes the
  `CLOUDFLARE_ANALYTICS_TOKEN` repository variable into the copy it uploads. Changing
  what the page loads or logs changes the promise, so edit
  [privacy.html](../../../../../../site/privacy.html) in the same commit.

## Releasing now rather than tonight

The release is the queue's, so force it the way any task is forced:

```
gh workflow run claudinite-scheduler.yml -f wake=claudinite-website/site-release
```

The gate is still evaluated when the item is picked, so a force with nothing to
release rolls with its reason on record rather than shipping a duplicate.

## Rolling back

Revert on the branch and let the next release carry it — the revert sits above the
last release commit, so the gate opens on it; force the run with the command above
when it cannot wait for the nightly anchor. Don't add a rollback lever: it would be a
second path to production, with its own version arithmetic to keep in step.

## What only a person can change

Everything on the Cloudflare side — the account, the API token and its scopes, and
whether `claudinite.com` is a zone on that account at all. `wrangler.json` claims the
apex and `www` as custom domains, so a deploy fails outright until the zone is there.
That is the intended failure: a release that quietly published to a URL nobody visits
is worse than one that stops and says so.

A custom domain cannot be attached to a hostname that already carries a `CNAME`
record, and adding a zone imports whatever the previous host had — so a `www` record
inherited from the old host blocks the deploy until a person deletes it, and the
apex's old records serve the old host for as long as they are left in place.

## Reading a park

The worker names the lane it wants, so the label is the diagnosis. **`action`** is a
credential, a scope or the zone, and the comment names which — nothing is wrong with
the code. **`decision`** means a surface the release depends on changed underneath it
(no `package.json` on the branch, the analytics placeholder gone), and whether the
release should follow is a person's call. **`failure`** means read the trace; that
lane also holds the next occurrence until the item is woken or closed, so a broken
release stops rather than filing a queue of items that break the same way. A park
after the push but before the upload has consumed a version number — re-queue the
item, and the retry counts from the branch's new tip.

## Changing the release

- **Never add a workflow that publishes.** The release lives in code-work precisely
  because `wrangler` is a CLI and needs no `uses:` step; a workflow beside it would
  bypass both the version bump and the queue's failure lane. A declared check refuses
  one, so don't also guard it in review.
- **Keep `wrangler` pinned to an exact version**, so two nights cannot run different
  toolchains without a commit saying so.
- **Correct `site/README.md` and this file in the same commit** as any behaviour
  change — a description that still says the old thing is worse than none.
