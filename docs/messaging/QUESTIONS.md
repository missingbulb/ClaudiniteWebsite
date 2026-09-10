# The buyer and user question set

Every question a potential customer asks themselves about Claudinite, and
where the page answers it. Weight **core** means the main messaging answers it
unprompted; **small** means the FAQ may. Personas: **L** engineering leader
buying for a fleet, **F** founder or lead at a shop or agency, **E** the
engineer who lives in it daily, **S** the security or platform reviewer who
approves it. Derived from `product-wiki/Customers`, `Positioning`, `Business`,
`Market`, `Landscape`, `Methods` and the vendored engine; the honest answer is
what the page must say, not what would sell.

`Where` names the page section by its `id`; `faq` is the FAQ.

| # | Question | Who | Weight | Honest answer | Where |
|---|---|---|---|---|---|
| 1 | Does it actually stop the agent, or can it talk its way past? | L E S | core | Hooks decide by exit code, not by what the model says: the stop stays blocked while blocking findings remain; a guarded tool call is denied before it runs. Relents only after two identical blocks. | hero, runs |
| 2 | Does it cover Copilot and Cursor, or only Claude Code? | L | core | Claude Code only. Other agents still read your rules file, and CI's repo checks run on their changes too. | limits |
| 3 | What does it cost, and per what? | L F | core | No price is published. | limits |
| 4 | What leaves my repos — to you, to Anthropic, to the canon? | F S | core | To a vendor: nothing — no server; the canon is pulled. To Anthropic: the session, as with any Claude Code use. To the canon: promoted lessons, in reviewed PRs, unless the repo opts out. | trust |
| 5 | Will it pass a security review? | L S | core | The shape helps — no service, tracked files, your own CI, one deletable tree — and there is no certification to show. | trust, faq |
| 6 | Will it slow my sessions down? | E | core | The stop exits at once on a clean tree; checks are text scans over the diff. No measured figure exists, so the page claims none. | runs |
| 7 | Can one fix reach every repo I own? | F | core | Yes: every repo re-vendors the canon daily as one PR. | fleet |
| 8 | Can we run our own private canon? | L F | core | Not yet — one public canon. | limits |
| 9 | How do I see whether it is working across the fleet? | L | core | Per repo today: the PRs, the issues, the CI runs. No fleet roll-up. | limits |
| 10 | What happens when a bad rule ships to the canon — pin, rollback? | L E | core | It reaches every repo next cycle, gated by each repo's CI and by the review switch; no pin or rollback yet. | fleet, limits |
| 11 | How long does adoption take, and what is manual? | F | core | One conversation vendors and wires everything as a PR; then a person wires the runner once — a routine and a token. | adopt |
| 12 | Does anything merge to main without a human? | F S | core | The daily update PR lands itself when CI is green; one setting makes it wait for review. Task PRs land only on a policy predicted before the diff exists. | fleet |
| 13 | Can I keep one client's conventions separate from another's? | F | core | Per-repo local packs, yes; per-client canons, not yet. | who, limits |
| 14 | What happens when a check fails? | E | core | The session stays open and the finding names what, why and the fix. | runs |
| 15 | Can it trap my session in a loop? | E S | core | No — after the same findings survive two fix attempts the stop goes through. | runs |
| 16 | What runs when — session, tool call, stop, CI? | E | core | Start: rules loaded, seven probes. Tool call: guarded calls denied. Stop: checks over diff and transcript. End: transcript captured. CI: repo-state checks. | runs |
| 17 | How do I leave, exactly? | E L | core | Delete tracked files: the vendored tree, the settings file, six hook entries, the rules import, two workflows, a CI step. | trust |
| 18 | What credentials do the bots hold? | S L | core | The Actions token of your own workflows, and one routine token you create. | trust |
| 19 | Where does the vendored code come from, who can change it? | S | core | One public repository, cloned daily into a PR you can read. | trust |
| 20 | Can I turn a rule off, and how is that reviewed? | E | core | Yes, with a reason recorded in the settings file; a reasonless acceptance is itself a finding. | runs |
| 21 | Is my transcript recorded, where, for how long? | E S | core | Yes: to a branch in your own repo, secret-scrubbed, pruned after a retention you set. | loop |
| 22 | What if Anthropic ships this natively? | L | small | Anthropic ships distribution fast and nothing that checks conduct in the repo, converges a fleet or shares lessons. | faq |
| 23 | What if you disappear? | L | small | The files keep working; the update stream stops. | faq |
| 24 | GitLab or Bitbucket? | L | small | GitHub only. | limits |
| 25 | How is this different from scorecards (Cortex, Port)? | L | small | They observe from a dashboard; this fixes in the repo, and has no dashboard. | faq |
| 26 | Who else uses it? | L | small | Nothing the page may say — no invented proof. | — |
| 27 | Why not the shared CLAUDE.md repo I already have? | F | small | It distributes a file; nothing checks the file was followed or keeps the copies current. | gap |
| 28 | Why not a Claude Code plugin? | E | small | A plugin distributes capability into a session; no plugin scope is enforced per repository. A pack distributes constraint, plus files the repo keeps. | gap |
| 29 | Is there a SOC 2? | S | small | No, and no hosted component to certify. | faq |
| 30 | What is the licence? | S | small | No licence is published yet. | faq |
| 31 | Does it help with EU AI Act / NIST? | L | small | A codified, distributed AI stance is the artifact those ask for; no formal mapping exists. | faq |
| 32 | Do I have to write the rules myself — what packs exist? | F | small | The canon's packs cover common stacks; your own rules land as local packs. | pack |
| 33 | Can a developer disable it locally? | F S | small | The hooks live in a committed settings file; nothing stops a local edit. | faq |
| 34 | What does it burn in Actions minutes and Claude usage? | F | small | Unmeasured; the page claims nothing. | — |
| 35 | Windows, monorepos? | F | small | Node and bash; Windows means WSL. | faq |
| 36 | Does the same check run in CI? | E | small | Repo-state checks do; transcript checks never. | runs |
| 37 | How much context does it consume? | E | small | The session's first line reports it. | context |
| 38 | Does it work in Claude Code on the web and in CI containers? | E | small | Yes — the corpus is in the checkout. | faq |
| 39 | What stops an unattended agent going rogue on my repos? | S | small | Every automated change is a PR through your own CI; the dispatch prompt names one issue and nothing else. | fleet |
| 40 | Can I write my own rule and have it stick? | E | small | Yes — a local pack; the growth loop drafts them from your sessions. | loop |
| 41 | Will an update break my repo overnight? | E | small | Migrations apply in the same PR, gated by your CI; see 10. | fleet |

## What the reconcile changed

- **A limits section became core.** Six core questions (2, 3, 8, 9, 10, 13)
  have "not yet" as the honest answer. Burying them in a FAQ would fail the
  decision maker, who finds them anyway; the page states them as a band of its
  own, before adoption.
- **The runs section carries the fairness mechanics.** Questions 15 and 20
  were not in the original messages; the 14-day grace, the reasoned acceptance
  and the two-attempt loop guard now sit beside the terminal, because the
  engineer's fear is the nonsense block, not the block.
- **The trust section is a diagram, not a paragraph.** Questions 4, 17, 18 and
  19 are one picture: what comes in, what goes out, what the bots hold, what
  you delete to leave.
- **Two questions stay unanswered on purpose** (26, 34): nothing true can be
  said yet, so the page says nothing.
