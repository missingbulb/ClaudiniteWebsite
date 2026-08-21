# Website

How this category *markets* itself: the words on rivals' and adjacent
vendors' landing pages and READMEs — what they claim, what they carefully
don't, and which vocabulary is being taken. Capability research lives in
[`Market/`](../Market/README.md); this page reads the same field one layer
up, at the copy, because the messaging gap and the capability gap are not
the same gap and close at different speeds.

Claudinite's *own* positioning decisions are not research and do not live
here — they are requirements, in
[`product-requirements/`](../product-requirements/README.md) (R11–R14), with
the mechanics of editing the page in
[site/README.md](../../site/README.md).

## Key insights

- No rival's headline claims its rules are followed — every one claims the rules *arrived*, and that gap is a year old.
- The governance vocabulary is being taken while the mechanism isn't: ai-rulez markets "governance" it ships as prose.
- Anthropic's own docs are the category's most quotable marketing copy: "context, not enforced configuration".
- The category sells the writing-once relief; nobody sells the failure it prevents.
- Enterprise vendors market to the anxiety directly ("AI is writing your code. Who's watching your standards?").
- Every rival page is a README or a docs site; nobody in the rule-sync tier has a marketing page worth the name.
- Where a rival does say "verify", it always resolves to config-drift — committed output matching its source.

## What the rule-sync tier actually claims

Read directly, not from search snippets, on the dates given.

- **Ruler** (2026-08-21, README opened directly): *"Ruler solves this by
  providing a **single source of truth** for all your AI agent instructions,
  automatically distributing them to the right configuration files."* The
  one CI example in its docs verifies *"the committed agent files (AGENTS.md,
  CLAUDE.md, skills) match the `.ruler/` source"*. Distribution plus
  file-drift; no claim about the agent's behaviour, then or now.
- **ai-rulez** (2026-08-21, README opened directly) is the interesting one:
  it has moved furthest up the vocabulary ladder. Hero: *"A complete
  development workflow for AI coding tools"*, and the pitch is the
  write-once relief — *"Write your rules, context, skills, agents, and
  commands once in `.ai-rulez/`. Run `generate`. Get native configs for
  every tool you use."* It ships a builtin **`ai-governance`** domain whose
  bullets read like enforcement (*"Verification before claiming success.
  Critical review of subagent output."*). Checked against its own definition
  of a domain, those are **rule text injected into agent configs**, not
  checks that run: a domain contains *"Rules — What AI must/must not do;
  Context…; Skills…; Agents…; Commands…"*, and `verify` is scoped to
  *"prove committed output matches its sources"*. So the governance word is
  taken; the governance mechanism is not.
- **rulesync.dev** markets on the multi-repo axis Claudinite also claims
  ("sync CLAUDE.md across repos" is its own SEO ground). The page is
  egress-blocked to this repo's fetcher, so its current wording is *not*
  verified here — the Market wiki's capability read stands, the copy read
  does not. Marked in Open questions rather than asserted.

Across the tier the shape is constant: the promise is **relief from writing
it twice**, never **the failure that follows when the rules are ignored**.
Nobody in it has a marketing page — a README on GitHub is the whole funnel,
which is also why a real page is cheap ground to take.

## The vocabulary arms race

The words are moving faster than the mechanisms, which sets a clock on any
message built purely on words:

- "Governance" now appears in a free OSS tool's README (ai-rulez, above)
  attached to prose rules.
- "Drift detection" is marketed by the platform vendor's own team tier
  (Cursor Teams — Market wiki) for team rule baselines.
- "Enforce" is used loosely across the tier for config generation.

The line that survives this is the one that names *what is checked*, not
that something is checked: rivals check the rules **arrived**; Claudinite
checks they were **followed**. Every word in it is falsifiable against a
rival's own docs, which is what makes it defensible when their copy moves.

## The best copy in the category belongs to Anthropic

The platform vendor documents the problem more plainly than any vendor in
the category markets it (memory doc, opened directly 2026-08-21):

- *"Claude treats them as context, not enforced configuration. To block an
  action regardless of what Claude decides, use a PreToolUse hook instead."*
- *"Settings rules are enforced by the client regardless of what Claude
  decides to do. CLAUDE.md instructions shape Claude's behavior but are not
  a hard enforcement layer."*
- *"target under 200 lines per CLAUDE.md file"* — because *"longer files
  consume more context and reduce adherence."*

A quotation from the platform the buyer already trusts costs nothing, cannot
be dismissed as vendor spin, and is not available to any rival whose product
*is* the prose those sentences are about.

## How the tier above markets it

The enterprise scorecard vendors sell to the anxiety rather than the
mechanism, and in doing so educate the buyer for free:

- **Cortex**: *"AI is writing your code. Who's watching your standards?"* —
  the thesis stated as a headline, by someone else's marketing budget.
- **Port** positions on the "Agentic SDLC"; **OpsLevel** ships remediation
  (Tidra) but markets campaigns, not continuous convergence (Market wiki).

Their framing is observation ("who's watching"); the remediation framing
("nothing merges that drifted") is unoccupied at that altitude.

## Sources

Capability claims about these same vendors are cited on their own primary
sources in the [Market wiki](../Market/README.md) and are not re-cited here;
what follows are the pages this one read for their *copy*.

- [intellectronica/ruler](https://raw.githubusercontent.com/intellectronica/ruler/main/README.md) — hero and CI-example wording (README opened directly, 2026-08-21)
- [Goldziher/ai-rulez](https://raw.githubusercontent.com/Goldziher/ai-rulez/main/README.md) — hero, write-once pitch, the `ai-governance` domain, and the definition of a domain / scope of `verify` (README opened directly, 2026-08-21)
- [Claude Code docs: memory](https://code.claude.com/docs/en/memory) — the three quotations above (primary page, opened directly 2026-08-21)
- [Cortex: AI is writing your code. Who's watching your standards?](https://www.cortex.io/post/ai-is-writing-your-code-whos-watching-your-standards) — the enterprise-tier headline
- [Paperclip](https://paperclip.ing/) — the monochrome, typography-led landing-page style this category has no example of

## Open questions

- **rulesync.dev's live copy** is unverified — the domain is egress-blocked
  to this repo's fetcher, and a search snippet is not the page. Needs an
  unblocked environment or a human; it will not resolve on a later agent
  pass from here.
- **Does the write-once promise or the enforcement promise convert better?**
  The whole tier sells the first and this site sells the second; nothing in
  the research settles it, and the site has no traffic yet to test it on.
- **How fast does the vocabulary move?** ai-rulez took "governance" while
  shipping prose. Worth re-reading the same three READMEs quarterly: the day
  a rival's headline claims the agent's *work* is checked, the differentiation
  line needs a new axis, not a rewrite.
- **Does anyone in the tier publish pricing copy yet?** rulesync.dev's beta
  was the only commercial signal, and it is the blocked page.
- **Is there a category page worth studying at all** — an AI-config product
  with a real marketing site rather than a README? None found in two passes;
  the style reference remains an unrelated SaaS page.

## Growth log

- **2026-08-21** — page re-scoped, on owner instruction, from a log of *our
  own* site decisions to research about *how this category markets itself*.
  The decisions it used to carry (headline choice, the naming constraints,
  the terseness discipline, the version tooltip) were not research and are
  now requirements R11–R14 in the human-reviewed sink; the site's editing
  mechanics live in `site/README.md`. Fresh copy research landed with the
  re-scope: Ruler and ai-rulez READMEs read directly, the `ai-governance`
  domain checked against its own definition (prose, not checks), and the
  Anthropic memory doc's three quotations recorded as the category's most
  quotable copy. `## Key insights` rewritten end to end — the page's subject
  changed, so every bullet did.
- **2026-08-21** — (superseded by the re-scope above) messaging refocus pass
  recorded the site rewrite: enforcement headline, the vendor quotation, the
  ~46% copy cut, the retired attackable claims, and the two naming
  constraints. Retained as a pointer so the growth log stays continuous; the
  content moved to the requirements sink.
- **2026-07-31** — ecosystem research pass: competitor-marketing question
  answered (no rival headline claims enforcement — one file-drift-CI
  footnote, Ruler).
- **2026-07-28** — page created alongside the initial site build.
