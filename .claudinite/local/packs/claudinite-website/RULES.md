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

- **After a merge lands on GitHub, syncing local `main` is a convenience, not part
  of landing — if the environment refuses it, record that and stop, don't retry
  variants.** `git checkout main` and its neighbours are refused by the session's
  permission classifier here; the two merge sessions on 2026-08-01 hit five straight
  denials between them, one of them after three rephrasings of the same intent
  (`checkout && pull`, then bare `checkout`, then `fetch origin main`), burning about
  four minutes on a step with nothing downstream of it. The `merge-to-main` recipe's
  sync step exists so *your working copy* isn't stale; the squash-merge already
  happened server-side and `merge_pull_request` returning `"merged":true` is the
  whole proof. Take one attempt, and on a refusal say plainly that local `main` is
  behind and move to the next step (the growth-pack capture) rather than looking for
  a phrasing that gets through.

- **`ScheduleWakeup` requires `prompt` unless `stop: true`, and `noop: true` does
  not exempt it.** Three unattended runs (issues #148, #159 and #161, between
  2026-08-12 and 2026-08-14) were rejected with "`prompt` is required when `stop`
  is not true" — two of them passing `noop: false`, one `noop: true`, so the flag
  is not the variable. Give any wakeup that isn't `stop: true` a `prompt` — the
  instruction the woken turn is to act on.
