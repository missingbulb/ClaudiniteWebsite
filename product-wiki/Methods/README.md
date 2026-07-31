# Methods

How the industry solved "propagate a convention across many repos and keep it
enforced" before AI coding agents existed. These are analogy and lesson
sources, not competitors: each system here picked a propagation model, an
enforcement model, and a drift story, and their fates predict what a
convention-pack product needs. Competitive landscape lives in
[`Market/`](../Market/README.md); pricing detail in
[`Business/`](../Business/README.md).

## Key insights

- The winning pattern is pin-in-repo plus a bot that opens update PRs — pre-commit and Renovate both ride it.
- pre-commit.ci monetizes exactly Claudinite's loop shape: free for OSS, $10–100/mo flat org tiers for private repos.
- Renovate's bot is free lead-gen; Mend charges (~$250/dev/yr) for scale, reporting and SLA — never for the mechanism.
- Peril — central org-wide rules, zero per-repo setup — died when GitHub Actions absorbed it; platform absorption kills.
- ESLint's flat-config break stranded eslint-config-airbnb: a pack format is an API; breaking it orphans the installed base.
- Bare template-sync (cruft, actions-template-sync) never broke 2k stars: the sync mechanism alone is not a product.
- GitHub itself gates org-wide enforcement behind paid plans — org rulesets were Enterprise-only until June 2025.

## Two propagation archetypes

Across nine systems studied, propagation splits cleanly:

- **Pin-in-repo + bot-driven update PRs.** The consuming repo carries a small
  config with an exact version pin; a bot keeps the pin fresh via PRs.
  pre-commit (`rev:` pins + `autoupdate`, and pre-commit.ci's weekly
  autoupdate PRs), cruft/copier (recorded template pin + scheduled update
  PRs), ESLint shareable configs (semver pin in the lockfile + Renovate
  bumps). This archetype dominates *file-based* convention distribution.
- **Dynamic central resolution, no per-repo pin.** Renovate `extends` presets
  re-resolve from the preset repo's default branch on every run; OPA agents
  poll signed bundles from a control plane; Allstar and GitHub org rulesets
  enforce server-side. Pin-less live resolution is chosen only where the
  operator also owns the runtime and cannot break the consumer's own CI.

Claudinite's baselining (vendored corpus converged nightly to canon head via
auto-PRs) is structurally the first archetype's *mechanism* with the second
archetype's *no-pin policy* — a combination none of the winners chose; see
[`Positioning/`](../Positioning/README.md) for the gap this opens.

## What the winners did

- **pre-commit** (~15.5k ★): a single small config file in the consuming
  repo, exact `rev` pins so repos never silently change behavior, and an
  explicit `autoupdate` command. Enforcement is local hooks plus
  `pre-commit run --all-files` in CI.
- **pre-commit.ci** monetizes the loop as a hosted bot: zero-configuration
  setup beyond the existing config file, auto-fixing PRs (it pushes fix
  commits onto the PR branch), and automated weekly pin updates. Free for
  open source; $10/mo personal private, $20/mo orgs ≤25 users, $100/mo orgs
  ≤100 users — flat org tiers, identical features across tiers.
- **Renovate**: the hosted GitHub App is free with 71,414 marketplace
  installs; org-wide adoption is one onboarding PR (it auto-detects an
  org-level `renovate-config` repo). Its enforcement is auto-PRs only — it
  never gates CI itself. Mend monetizes Enterprise Edition (~$250 per
  contributing developer/year, third-party figure) on scale, Merge
  Confidence, reporting APIs, and SLA — the mechanism stays free.
- **ESLint shareable configs**: registry+semver+lockfile propagation at
  enormous scale (eslint-config-prettier ~61M weekly downloads). Nobody
  monetized the distribution itself; value accrued to adjacent services.

Four traits recur across the winners: a single small file in the consuming
repo; near-zero-effort adoption (zero-config or an auto-generated onboarding
PR); drift handled by bots opening PRs, not by humans; CI-fail enforcement
softened by autofix.

## Cautionary tales

- **Peril** (hosted Danger: centrally-stored org-wide Dangerfiles, zero
  per-repo setup — the closest structural ancestor to a convention canon)
  went to maintenance mode after its creator concluded "80% of Peril is
  available today in GitHub Actions." Central-rules products die when the
  platform absorbs their mechanism.
- **GitHub required workflows** were killed and folded into repository
  rulesets within roughly a year (GA October 2023) — platform-native
  enforcement primitives churn, which cuts both ways for anyone building on
  them.
- **The ESLint flat-config migration** stranded the ecosystem's flagship
  convention package: eslint-config-airbnb never shipped flat-config support
  and its TypeScript companion was archived May 2025, handing the installed
  base to forks and shims. A pack format is an API; a breaking format change
  can orphan every consumer.
- **Copy-based template sync stayed niche**: cruft (~1.6k ★) ships `cruft
  check` for CI drift detection and a README recipe for a weekly
  drift-PR workflow — literally Claudinite's baselining loop as a DIY recipe
  since ~2020 — and actions-template-sync (~327 ★) does scheduled
  merge-upstream PRs. Neither broke out. The sync mechanism alone, without
  curated content and enforcement, is not a product.
- **copier** has the most sophisticated drift-merge algorithm in the family
  (regenerate old template, diff to extract local changes, re-apply over the
  new template, inline conflict markers) — sophistication that still didn't
  buy adoption (~3.5k ★).

## Enforcement-model spectrum

- **Advisory graduated**: Danger's fail/warn/message levels (~5.5k ★, never
  commercialized) — the graduated blocking-vs-advisory distinction is the
  design export, matching Claudinite's blocking/advisory severities.
- **Settings-not-content**: OpenSSF Allstar (org-wide GitHub policy app,
  log → auto-issue → auto-fix ladder) and GitHub org rulesets enforce
  *platform settings and required checks*, never file content inside repos.
  Org rulesets were Enterprise-only until June 16, 2025 (then extended to
  Team plans) — GitHub prices org-wide enforcement as a premium.
- **Fallback-without-copying**: GitHub's default community health files
  (org-level `.github` repo applies wherever a repo lacks its own copy) —
  zero drift by construction but limited to a fixed whitelist of file types.
- **Runtime pull**: OPA distributes signed, versioned policy bundles agents
  poll and activate atomically — a control-plane convergence loop
  structurally identical to canon→repos, at runtime instead of via git.
  conftest pushes/pulls the same bundles through OCI registries — an
  emerging "policy packs as OCI artifacts" distribution norm.
- **URL-inheritance + autofix**: MegaLinter's remote `EXTENDS` config merge
  plus APPLY_FIXES delivered as commit or PR.

## Lessons for a convention-pack product

Read directly off the corpus: pinned versions with bot-opened update PRs as
the drift mechanism (not silent head-tracking); one-command or zero-config
adoption; CI-fail enforcement paired with autofix to keep friction low;
free-for-OSS plus flat private tiers or per-dev enterprise pricing; treat the
pack format as a stable API; and expect the platform (GitHub, Anthropic) to
absorb any mechanism that isn't paired with curated, maintained content.

## Sources

- [pre-commit/pre-commit](https://github.com/pre-commit/pre-commit) — pins, autoupdate, adoption
- [pre-commit ci — GitHub Marketplace](https://github.com/marketplace/pre-commit-ci) — tiers and features
- [pre-commit.ci](https://pre-commit.ci/) — weekly autoupdate PRs
- [Renovate config presets docs](https://raw.githubusercontent.com/renovatebot/renovate/main/docs/usage/config-presets.md) — unpinned extends, org preset detection
- [Renovate — GitHub Marketplace](https://github.com/marketplace/renovate) — 71,414 installs
- [Mend Renovate products](https://www.mend.io/renovate/) and [Community Edition](https://www.mend.io/mend-renovate-community/) — free bot, paid Enterprise
- [ESLint shareable configs docs](https://raw.githubusercontent.com/eslint/eslint/main/docs/src/extend/shareable-configs.md)
- [eslint-config-prettier downloads — Snyk](https://snyk.io/advisor/npm-package/eslint-config-prettier) — ~61M/week (aggregator figure)
- [eslint-config-airbnb-typescript flat-config issue](https://github.com/iamturns/eslint-config-airbnb-typescript/issues/331) — stranding
- [GitHub Changelog: required workflows → repository rules](https://github.blog/changelog/2023-10-11-requiring-workflows-with-repository-rules-is-generally-available/)
- [GitHub Changelog: org rulesets on Team plans](https://github.blog/changelog/2025-06-16-organization-rulesets-now-available-for-github-team-plans/)
- [Default community health files — GitHub docs](https://raw.githubusercontent.com/github/docs/main/content/communities/setting-up-your-project-for-healthy-contributions/creating-a-default-community-health-file.md)
- [ossf/allstar](https://github.com/ossf/allstar) — enforcement ladder
- [OPA bundle management docs](https://raw.githubusercontent.com/open-policy-agent/opa/main/docs/docs/management-bundles/index.md)
- [conftest sharing docs](https://raw.githubusercontent.com/open-policy-agent/conftest/master/docs/sharing.md) — OCI distribution
- [danger/danger-js](https://github.com/danger/danger-js) — fail/warn/message
- [danger/peril](https://github.com/danger/peril) — maintenance mode, absorption quote
- [cruft/cruft](https://github.com/cruft/cruft) — `cruft check`, weekly drift-PR recipe
- [Copier updating docs](https://raw.githubusercontent.com/copier-org/copier/master/docs/updating.md) — drift-merge algorithm
- [AndreasAugustin/actions-template-sync](https://github.com/AndreasAugustin/actions-template-sync)
- [MegaLinter configuration docs](https://raw.githubusercontent.com/oxsecurity/megalinter/main/docs/configuration.md) — EXTENDS, APPLY_FIXES

## Open questions

- pre-commit.ci's actual adoption (installed repos/orgs) — no public counter
  found; it is the closest business-model precedent, so scale matters.
- Official Mend Renovate Enterprise pricing (the $250/dev/yr figure is
  third-party; Mend gates specifics behind sales).
- Quantified failure rates for template-sync loops (update PRs going stale,
  merge-conflict fatigue) — anecdotes only; if real data exists it would
  sharpen the "sync alone is not a product" lesson.
- Does OCI-registry policy distribution (conftest-style) have meaningful
  enterprise adoption? Relevant to how Claudinite packs might one day be
  distributed beyond git.
- Peril's peak adoption before GitHub Actions absorbed it — would calibrate
  how much traction a central-rules product can build before platform risk
  lands.

## Growth log

- **2026-07-31** — page created in the owner-directed ecosystem research
  pass: nine pre-AI convention-propagation systems studied (pre-commit +
  pre-commit.ci, Renovate, ESLint shareable configs, cruft/copier/
  actions-template-sync, Danger/Peril, OPA/conftest, Allstar, GitHub native,
  MegaLinter); the two propagation archetypes, winner traits, cautionary
  tales, and product lessons distilled and cited.
