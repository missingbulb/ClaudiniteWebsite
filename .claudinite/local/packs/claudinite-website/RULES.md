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

- **`site/` states absolute privacy and no-external-asset claims in several places
  at once — adding any third-party or network asset means re-checking every one of
  them in the same change.** The claims are not confined to `site/privacy.html`:
  they also sit in that page's `<meta name="description">`, in its lede paragraph,
  and in the header comment of `site/assets/style.css` ("No external assets, no
  webfonts, no frameworks"). Landing the analytics beacon updated the page body but
  left the meta description and the stylesheet header asserting the opposite, so the
  site shipped claiming "no tracking" while loading a tracker. Before committing a
  change that adds a script, beacon, font, or any off-origin fetch under `site/`,
  grep the whole directory for the standing absolutes (`no track`, `no cookie`,
  `no third-party`, `no external`, `cookieless`) and reconcile each hit — a stale
  claim in a comment or a meta tag is still a false claim to a reader.

- **`node --test` skips dot-directories, so a bare `node --test` in this repo runs
  zero tests and exits green.** Every test this repo has lives under
  `.claudinite/`, which Node's default test discovery ignores outright — the
  command reports success having found nothing, which reads exactly like a passing
  suite. Any CI step or local invocation that is meant to exercise a
  `.claudinite/local/packs/` fixture must pass an explicit glob for that path, and
  whoever adds the step must confirm it by watching the run's test count be
  non-zero, never by watching it go green.
