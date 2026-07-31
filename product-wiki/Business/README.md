# Business

Business models and price anchors for Claudinite: what adjacent devtools
charge, which commercial archetypes survive contact with a "plain vendored
files, no server" product, and what is genuinely scarce enough to price.
Method lessons live in [`Methods/`](../Methods/README.md); who would pay in
[`Customers/`](../Customers/README.md). Nothing on this page is a decision —
the human-reviewed distillation is
[`product-requirements/`](../product-requirements/README.md).

## Key insights

- Vendored files are trivially copyable — the sellable scarcities are the convergence bot, canon updates, private packs, and SLA.
- Governance tooling prices at $19–29/seat/mo (Copilot Business, GitLab Premium); AI-multiplier tools reach $60–200.
- pre-commit.ci's $0-for-OSS / $10–100/mo flat org tiers is the closest live pricing precedent for a config-bot product.
- Only GitHub Apps can be paid Marketplace listings (95% to publisher) — Actions and plain files cannot.
- Spotify sells its paid Backstage plugins only via negotiated AWS private offers — self-serve paid content looked weak.
- Sponsorware is hobby-scale: GitHub Sponsors totals ~$100M cumulative over ~7 years across ~70k maintainers.
- Behavioral seats (Snyk: committed in 90 days; CodeRabbit: opened a PR) are the emerging norm for repo-attached tools.

## Price anchors (mid-2026)

Caveat on provenance: several vendor pricing pages 403-block fetchers; where
a price rests on vendor-domain search quotes rather than a directly-opened
page, the source bullet says so.

**AI assistant/agent seats** (what the target user already pays):

- GitHub Copilot: Free / Pro $10 / Pro+ $39 / Max $100 per user/mo
  (vendor page, opened directly); Business $19, Enterprise $39 per user/mo
  (GitHub docs).
- Cursor: Pro $20 / Pro+ $60 / Ultra $200; team seats $32 (Standard) and $96
  (Premium) per seat/mo annual, after the June 2026 teams-pricing change
  (vendor pages via search quotes).
- Claude: Pro $20, Max $100–200; Team Standard $25/seat (5-seat min), Team
  Premium $100/seat annual — Claude Code rides Premium seats; Enterprise
  custom (triangulated secondary sources; vendor page blocked).

**Repo-attached quality/governance tooling** (the band Claudinite would be
judged in):

- Codecov Team $5 / Pro $12 per user/mo; Snyk Team $25 per contributing
  dev/mo (caps at 10 licenses before forced sales contact).
- CodeRabbit Lite $12 / Pro $24 / Pro Plus $48 per dev/mo annual — billing
  only devs who open PRs.
- SonarQube Cloud prices the *codebase*, not the humans: from $32/mo per
  100k LOC — the notable per-repo-style metric.
- pre-commit.ci: $0 open source, $10/mo personal private, $20/mo org ≤25
  users, $100/mo org ≤100 users (Marketplace listing, opened directly).
- Atlassian Compass was the scorecard category's floor at $0/$8/$25 per
  user/mo — now being sunset into DX (see Customers wiki for the
  consolidation signal).
- Enterprise scorecard platforms (transaction data, not list prices):
  OpsLevel ~$400–700/dev/yr; Cortex enterprise contracts $100k–250k+/yr;
  Port free ≤15 seats then quote-gated with SSO/RBAC/audit behind Enterprise.
- GitLab open-core: Free / Premium $29 / Ultimate ~$99 per user/mo, Duo AI
  add-on +$19 — the paid line drawn at org-level controls, not core function.
- npm private packages: $7/user/mo — the canonical private-registry price.

## Archetypes that survive "plain files, no server"

Each with its named precedent and the implication for Claudinite:

- **Hosted-service-on-OSS** (pre-commit.ci, Renovate/Mend): the files and
  mechanism are free; the *bot that runs the loop for you* is the product.
  Claudinite's equivalent sellable: operating the nightly
  baselining/convergence fleet and the scheduled agentic maintenance. The
  strongest-fit archetype — it prices exactly what is ongoing.
- **Open-core / enterprise edition** (GitLab, Mend Renovate EE): core free,
  paid tier at org-level controls — scale, reporting, compliance, SLA. Maps
  to fleet reporting, private canon, multi-team controls.
- **Private-registry pattern** (npm, Docker Hub): public packs free, private
  packs paid (~$7–24/user/mo band). Maps directly to "your org's private
  canon and packs."
- **Support/SLA subscription** (Tidelift): validated as strategic value but
  acquired (Sonar, Dec 2024) rather than scaled standalone — treat as a
  deal-sweetener, not the model.
- **Paid content on a free platform** (Spotify's Backstage plugin bundle):
  exists, but Spotify retreated from public self-serve pricing to AWS
  Marketplace private offers — read as weak self-serve demand for paid
  plugins; enterprise-negotiated deals instead. A warning against "sell the
  packs themselves."
- **Marketplace billing** (GitHub): publishers keep 95%, but only GitHub
  *Apps* can be paid listings — Actions and files cannot. Marketplace
  distribution/billing would require wrapping Claudinite's loop in a GitHub
  App, which pushes toward the hosted-bot model anyway.
- **Sponsorware**: ceiling too low to matter commercially — ~$100M
  *cumulative* across ~70k maintainers in ~7 years; mid-tier maintainers
  $500–5k/mo.

One-time content sales have no working precedent in this space at product
scale — though the indie segment does pay $199–249 one-time for
boilerplates (see [`Customers/`](../Customers/README.md)), which suggests a
one-time *entry* SKU is viable even if recurring revenue must come from the
loop.

## What the anchors suggest

- Per-seat: $10–40/seat/mo is defensible for governance-positioned tooling
  (between Codecov's $5 and Copilot Enterprise's $39); the $60–200 AI-premium
  band applies only if positioned as a capability multiplier, not
  governance.
- Flat org tiers: pre-commit.ci's $20/mo (≤25 users) and $100/mo (≤100
  users) is the credible low-end floor; per-repo or per-LOC metrics
  (SonarQube-style) are the alternative if seats fit badly.
- Seat definition: behavioral ("developers whose repos consume a pack" /
  "opened a PR in a governed repo") mitigates the uneven-adoption objection,
  per Snyk and CodeRabbit precedent.
- The free tier is load-bearing in every surviving precedent: free for
  public/OSS repos is how pre-commit.ci, Renovate, Codecov and CodeRabbit
  all built their funnels.

## Sources

- [GitHub Copilot plans](https://github.com/features/copilot/plans) — individual tiers (opened directly)
- [Copilot org billing — GitHub docs](https://docs.github.com/en/enterprise-cloud@latest/copilot/concepts/billing/organizations-and-enterprises) — Business/Enterprise seats
- [Cursor teams pricing change](https://cursor.com/blog/teams-pricing-june-2026) and [teams pricing docs](https://cursor.com/docs/account/teams/pricing) — via search quotes (site 403s fetchers)
- [Claude Team pricing 2026 — tygartmedia](https://tygartmedia.com/claude-team-pricing-2026-standard-premium-seats/), corroborated by [aipricing.guru](https://www.aipricing.guru/subscriptions/claude-team-premium/) and [intuitionlabs](https://intuitionlabs.ai/articles/claude-pricing-plans-api-costs) — secondary triangulation
- [pre-commit ci — GitHub Marketplace](https://github.com/marketplace/pre-commit-ci) — tiers (opened directly)
- [Sonar plans & pricing](https://www.sonarsource.com/plans-and-pricing/) — per-LOC entry tier (via search quotes)
- [Codecov pricing](https://about.codecov.io/pricing/), [Snyk plans](https://snyk.io/plans/), [CodeRabbit plans](https://docs.coderabbit.ai/management/plans) — via search quotes
- [Compass pricing — Atlassian](https://www.atlassian.com/software/compass/pricing)
- [OpsLevel pricing — Vendr](https://www.vendr.com/marketplace/opslevel), [Cortex — Vendr](https://www.vendr.com/marketplace/cortex), [Port cost framework](https://platformengineeringcost.com/port-cost) — transaction-data estimates
- [GitLab pricing 2026 — costbench](https://costbench.com/software/developer-tools/gitlab/) (vendor page blocked), corroborated by [Vendr](https://www.vendr.com/marketplace/gitlab)
- [npm products](https://www.npmjs.com/products) — $7/user private packages
- [Mend Renovate](https://www.mend.io/renovate/) — free bot, paid EE
- [Receiving payment — GitHub Marketplace docs](https://docs.github.com/en/apps/github-marketplace/selling-your-app-on-github-marketplace/receiving-payment-for-app-purchases) and [about Marketplace for apps](https://docs.github.com/en/apps/github-marketplace/github-marketplace-overview/about-github-marketplace-for-apps) — 95%/5%, Apps-only
- [Spotify Plugins for Backstage bundle](https://backstage.spotify.com/partners/spotify/bundle/spotify-plugins-bundle/) and [AWS Marketplace listing](https://aws.amazon.com/marketplace/pp/prodview-ae67cydhcqpei)
- [Sonar acquires Tidelift](https://www.sonarsource.com/company/press-releases/sonar-to-acquire-tidelift/)
- [GitHub Sponsors crosses $100M — Help Net Security](https://www.helpnetsecurity.com/2026/07/21/open-source-github-sponsors-100-million/) and [About GitHub Sponsors](https://docs.github.com/en/sponsors/getting-started-with-github-sponsors/about-github-sponsors)

## Open questions

- Direct confirmation of Cursor/Claude/Snyk/Codecov/Sonar prices on their own
  pricing pages (all 403'd this pass; figures rest on vendor-domain search
  quotes and consistent secondaries).
- Mend Renovate Enterprise's real price (contact-sales; the $250/dev/yr
  figure is third-party) — the closest comparable for a paid convergence
  fleet.
- rulesync.dev's paid team pricing once out of beta — the first direct
  willingness-to-pay signal inside the rule-sync category itself.
- Does pre-commit.ci have an above-100-users tier? None listed — how does
  the flat-tier model extend to enterprise scale?
- Claude Enterprise per-seat price and minimum seats (secondary sources hint
  ~150-user threshold) — bounds what a Claude-Code-attached governance layer
  can plausibly add per seat.
- What did Spotify's plugin bundle actually charge inside private offers?
  Would calibrate the paid-content archetype's real numbers.

## Growth log

- **2026-07-31** — page created in the owner-directed ecosystem research
  pass: price anchors collected across AI-assistant seats, repo-attached
  quality tooling, scorecard platforms and registries; seven commercial
  archetypes assessed against the no-server constraint; scarcity analysis
  (convergence bot / canon stream / private packs / SLA) and indicative
  price bands distilled, all cited with provenance caveats where vendor
  pages were fetch-blocked.
