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

- **The canon repo is readable from a session here but never writable — clone it
  to read, and park anything you want to *change* as an issue in this repo.** The
  read path succeeds and masks the write path: `git clone` of
  `missingbulb/Claudinite` through the session proxy exits 0, so the canon tree is
  fully inspectable, while `push` returns `403` and every `mcp__github__*` call
  against it is refused outright ("repository `missingbulb/claudinite` is not
  configured for this session. Allowed repositories: `missingbulb/claudinitewebsite`").
  The session's GitHub scope is this repo alone. A session that took the successful
  clone as proof of reach wrote, tested and locally committed a complete eight-file
  canon change (canon suite 1148 pass / 0 fail, every new test seen red first) before
  discovering it could not land any of it; the work had to be parked as a patch in
  #59, where it still sits. So when an owner asks for a Claudinite behaviour change
  from here: read canon by cloning it, **verify the write path before building on the
  assumption you can land there**, and deliver the outcome as a tracking issue in
  *this* repo carrying the patch. Do not route around the denial — the proxy README
  says to report an egress refusal, not work past it. (The pack-adoption rule above
  tells you to clone canon for exactly this kind of lookup; that is the read half
  only.)

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
