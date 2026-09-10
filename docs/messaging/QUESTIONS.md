# What a prospect asks themselves

The questions a buyer and an engineer bring to Claudinite: the segment
triggers, the procurement gates and the product's own candid gaps, turned into
the sentences a person actually says to themselves. Written before checking
what the page answers, then reconciled against [MESSAGING.md](MESSAGING.md).

The research these were drawn from is the repo's own market, customer and
positioning wikis. They are deliberately not linked: that research grows
autonomously, and nothing in the repo is allowed to depend on it — the reviewed
crossing point is
[`product-requirements/`](../../product-wiki/product-requirements/README.md),
and that is the only wiki artifact these questions are answerable to.

**The rule of the reconciliation:** a question that decides whether someone
adopts is answered in the page's own argument. A question that decides a
detail is answered in the FAQ. A question we cannot answer honestly yet is
answered by saying so.

## The engineer — the person who will live with it

| # | Question | Answered where |
|---|---|---|
| E1 | Why isn't my `CLAUDE.md` enough? | M1 — the problem section, with the vendor's own sentence |
| E2 | Is this going to nag me all day? | M4 — two severities; an advisory never fails anything |
| E3 | What happens when a rule is wrong, or wrong *here*? | M4 — an exemption with a written reason; or turn the rule down, or off |
| E4 | What exactly blocks me, and when? | M4 — at session stop with the transcript in view, and again in CI |
| E5 | Do I have to write all these rules myself? | M6 + the canon section — they arrive from your own sessions, and 33 packs ship already written |
| E6 | How is this different from installing a plugin? | M2 — a plugin adds capability to a session; a pack adds constraint to a repository, and no plugin scope is repo-scoped |
| E7 | Does it work for a teammate who installed nothing? | M7 — the corpus is in the checkout, so CI and a fresh clone both have it |
| E8 | How much of my context window does it eat? | M3 — the whole point of promotion: a check costs nothing until it fires |
| E9 | Can I add a rule that is only ours? | M3 + FAQ — a local pack, same machinery, never leaves the repo |
| E10 | Is my session transcript being sent somewhere? | M7 + FAQ — no service exists to send it to |
| E11 | What lands in my repo when I adopt? | Adopt section + FAQ |
| E12 | How do I get out? | FAQ — delete the directory, the hook entries, the workflow and the CI step |
| E13 | Will it fight the tools I already run? | FAQ — it adds the layer `CLAUDE.md` cannot carry, and keeps that file lean |
| E14 | Does it work on Windows, or in a monorepo? | FAQ — Node and bash hooks; native Windows without WSL is unsupported, monorepos unaddressed |

## The decision maker — the person who will sign for it

| # | Question | Answered where |
|---|---|---|
| B1 | Why is this a problem now, and not last year? | M1 — the volume argument; review does not scale with agent output |
| B2 | Hasn't the platform vendor solved this? | M2 — no plugin install scope carries repo-scoped enforcement, and the vendor documents the gap itself |
| B3 | Is this a category, or one person's script? | M2 — the layer model; four categories checked, none enforces |
| B4 | Does any of our code or telemetry leave our environment? | M7 — no server, no account, nothing to leave through |
| B5 | What is the blast radius of a bad canon change? | M8 — stated plainly: it tracks head, gated by your CI and your PR review, and pinning is not shipped |
| B6 | Who reviews what the vendor pushes into our repos? | M5 — every convergence is a pull request in your repository; the diff is the supply-chain review |
| B7 | What happens if you disappear? | M7 — vendored plain files keep working; that is the escrow |
| B8 | Can we run our own private canon? | M8 — not yet; the canon location is not configurable today |
| B9 | We run Copilot and Cursor too. | M8 — Claude Code is the enforced target; the others keep reading your convention files |
| B10 | How do I see whether it is working across forty repos? | M8 — per repo today; there is no aggregation pane |
| B11 | What does it cost? | FAQ — the canon is public and there is nothing to buy today |
| B12 | How long does adoption take, honestly? | Adopt section — one conversation, then one manual wire-up, stated as two steps because it is two |
| B13 | Does it need MDM, SSO, or an admin rollout? | M7 + FAQ — no; there is no identity in the system |
| B14 | Is this another dashboard my team will ignore? | M5 — the output is pull requests in the repos people already watch |
| B15 | Does it work on GitLab? | M8 — GitHub today |
| B16 | What do we tell an auditor about our AI stance? | FAQ — the corpus *is* the codified stance, versioned and distributed |
| B17 | Is this the same thing as the multi-agent tools my team is asking for? | M2 — those multiply sessions; this constrains them; they compose |

## What the reconciliation changed

Three questions had no home in the spine as first written, and the messaging
moved rather than the question:

- **E6 / B17 — "how is this different from a plugin / from the orchestrators?"**
  M2 was a positioning statement about the field. It now has to carry an
  explicit contrast, because this is the first question anyone inside the
  Claude Code ecosystem asks. The page states it as a property, not a
  competitor comparison: a plugin distributes capability into a session, a
  pack distributes constraint into a repository.
- **E2 / E3 — "will it nag me, and what if it is wrong?"** Nothing in the
  spine said that enforcement is graduated, or that an exemption is a
  first-class, reasoned act rather than a hack. M4 gained both. Without them
  M4 reads as a product that cannot be lived with.
- **B6 — "who reviews what you push into our repos?"** The convergence PR was
  described as a delivery mechanism. It is also the answer to the
  supply-chain question, which is the first procurement gate in the research.
  M5 now says so.

Two questions are answered by admitting the answer is no — B8, B10 and B15 are
why M8 exists as its own section rather than as softened language elsewhere.
