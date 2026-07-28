# claudinite-website

This repo's own conventions: the `site/` marketing page and the upkeep of this
repo's vendored Claudinite mount.

## Rules

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
