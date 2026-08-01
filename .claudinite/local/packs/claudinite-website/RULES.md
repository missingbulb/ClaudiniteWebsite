# claudinite-website

This repo's own conventions: the `site/` marketing page and the upkeep of this
repo's vendored Claudinite mount.

## Rules

- **The site describes itself in prose — a behaviour change must correct every
  self-description it falsifies, in the same commit.** `site/index.html`,
  `site/privacy.html`, the header comment in `site/assets/style.css` and
  `site/README.md` all make checkable claims about what the site loads, collects,
  and deploys, and nothing fails when a change quietly makes one of them untrue.
  Adding the analytics beacon (#36) left the privacy lede's no-tracking claim and
  the stylesheet's "No external assets" standing, and took a second commit to walk
  both back; dropping the deploy workflow's `paths:` filter (#45) left
  `site/README.md` still saying the site publishes only on a push that touches
  `site/**`. Before landing a change to site behaviour or to
  `deploy-pages.yml`, grep the site copy, the CSS/JS header comments and
  `site/README.md` for what the change makes false, and ship the correction (and
  any disclosure the behaviour requires) in the same commit as the behaviour.

- **Adopting an *additional* canon pack is not a local lookup — the vendored
  `.claudinite/shared/packs/` holds only what this repo already adopted, never the
  catalog of what's adoptable.** Nothing in the checkout lists the available packs,
  and the `adopt-claudinite` skill's canonical pointer (`bootstrap.md`) is *not*
  vendored here, so it can't be read locally either. Don't exhaustively grep the
  tree to prove a pack is missing: shallow-clone the canon
  (`missingbulb/Claudinite`) to scratch, list `packs/`, and pick from there. Then
  declare the pack in `.claudinite-checks.json`, vendor it with the canon
  checkout's `vendoring/apply-vendor-set.mjs --target . --ref <sha>` (never
  hand-copy pack files), scaffold whatever the pack's own rules require, and
  delete the scratch clone. **Match the owner's plain-words name to a pack id
  before asking them to disambiguate** — the names differ ("the market research
  pack" is the `product-wiki` pack); read the candidate's `pack.mjs` and `RULES.md`
  in the canon clone and confirm the fit yourself.
