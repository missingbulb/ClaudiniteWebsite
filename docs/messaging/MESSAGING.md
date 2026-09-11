# claudinite.com — the messaging brief

What the site claims, in what order, and why. The page is this brief's output:
a change to what the site *says* starts here, and the page follows. Derived
2026-09-10 from `product-wiki/` (R8–R14 in `product-requirements/` are binding)
and from the vendored engine and the canon's own code — never from an earlier
page. Evidence is cited as `wiki:Page §Section` or `repo:path`.
[QUESTIONS.md](QUESTIONS.md) is the audit: every question a buyer or user asks,
and where on the page it is answered.

## What Claudinite is

Teams write rules for their coding agents — how to commit, what to test, what
never to touch — and the agent reads them as advice. Anthropic's own docs say
so. Claudinite makes the rules stick: it lives in each repository as plain
files, checks the agent's actual work when the session tries to finish and again
when the change reaches CI, refuses to let a violation through, and keeps every
repository in an organisation on the same current rules — updating them nightly
through ordinary pull requests, and turning what one repository learns into a
check every repository runs.

One sentence: *Claudinite turns the rules you write for your coding agent into
checks it cannot skip, in every repository you own.*

Five words: **Rules your agent can't skip.**

## The core argument

1. An agent reads rules as context, not enforced configuration — the vendor's
   own words (`wiki:Market §Substrate`; the memory doc is the page's one
   quotation, R11).
2. Everything else in the stack writes rules, delivers them, runs sessions or
   watches them. Where anyone "verifies", they verify the rules *arrived* —
   config-file drift — never that they were *followed* (`wiki:Market §Direct
   rivals`; `wiki:Website §arms race`).
3. Claudinite checks they were followed: deterministic checks over the diff and
   the transcript hold the stop; repo-state checks gate CI; a guarded tool call
   is denied before it runs (`repo:.claudinite/shared/engine/hooks/stop-command.mjs`,
   `pretooluse-judge.mjs`, `.github/workflows/ci.yml`).
4. Because it lives in the repository it composes with whatever runs the
   sessions — labor, cockpit and distribution products all sit above it — and
   nothing else occupies that layer (`wiki:Landscape §The layer model`).
5. It converges the fleet daily and closes the loop: one repository's lesson
   becomes a rule, then a check, everywhere
   (`repo:.claudinite/shared/packs/claudinite-lifecycle/tasks/update/task.json`;
   `packs/claudinite-growth/tasks/`).

## The governing metaphor: the building code and the inspector

The rules file is the code book — advice until someone inspects. A check is
the inspection, at two moments: before the crew leaves (session stop) and
before occupancy (CI). The fleet is a city under one code; the daily update is
the current edition reaching every site; the growth loop is the amendment after
an incident; and the layer claim is that inspection does not care which
contractor built it. Engineers respect inspection as what makes a building
safe, not as an adversary — and a buyer who never opened a terminal follows it.

*Inspector* never appears as a product noun; the page says **checks**. The
metaphor lives in the visuals (the stack as a building's floors, the two gates)
and the odd verb. Each message below carries one further illustration, used
once, never as a second frame.

Rejected: *police / constitution* (adversarial, and "enforce" is the word the
category blunted); *sheepdog and herd* (casts engineers' agents as livestock,
and a canon pack carries that name — R12); *guardrails* as a frame (taken by
AI-safety copy); *immune system* as a frame (organic, implies
non-determinism); *flight checklist* as a frame (explains the schedule, not the
enforcement).

## The messages, in page order

| # | Headline | Generalisation | Illustration | Must not claim |
|---|---|---|---|---|
| 1 | **Rules your agent can't skip** (lead) | A rule nothing can stop the work on is advice, however firmly written. | The code book on the shelf vs the inspection at the door. | Guaranteed adherence: prose rules stay prose; only promoted checks bite; the loop guard relents after two identical blocks. |
| 2 | **Arrived is not followed** | Distributing a rule and complying with it are different jobs; every sync tool does only the first. | A smoke detector on every floor vs a fire drill. | That rivals check nothing, or that Claudinite checks every rule — say what is checked. |
| 3 | **Caught before the commit, again in CI** | A fault is cheapest the moment it is made. | A compiler error vs a code comment. | "The same sweep runs in CI" — CI runs repo-state checks only; transcript checks never run there. |
| 4 | **A check costs no context** | Attention is finite; every instruction dilutes every other. | Guardrails vs signposts. | A measured adherence gain — none exists; that checks replace the rules file. |
| 5 | **Fix it once. Every repo inherits it.** | Copies drift; durable consistency is a source that re-applies itself. | Municipal water: one plant, every tap. | "One conversation to adopt"; staged rollout — no pin, channel or rollback exists. |
| 6 | **What one repo learns, all repos keep** | Lessons decay unless each becomes a rule a machine re-reads. | Fought once, remembered everywhere. | Unattended canon promotion — growth lands as reviewed PRs; the canon step is owner-gated. |
| 7 | **Nothing leaves your repo** | The cheapest security review is of a system with no data flow; a thing you can delete is a thing you can trust. | A paper map vs a GPS subscription. | "A directory and two hook entries" — leaving is six hooks, two workflows, a CI step, an import and a manifest; any certification; "no credentials". |
| 8 | **Upkeep on a schedule, not a memory** | Housekeeping that depends on remembering does not happen. | Run every flight, not when the pilot feels like it. | Fully hands-off — the executor routine is wired by hand. |
| 9 | **Whatever runs your agents, this sits under it** | Every stack has exactly one layer that asks whether a rule was followed. | The inspector does not care who built it. | Governing non-Claude sessions in an orchestrator (they get the CI half only); naming orchestrators as integrations. |

## Audiences

**The decision maker** — a platform or DevEx lead buying for a fleet, or an
agency owner shipping one stack across client repos (`wiki:Customers`). Hears
*who is watching the standards* and *what leaves our environment*. Afraid of a
security review they cannot pass, AI output nobody governs, lock-in, and an
empty ROI slide. Lands: messages 1, 2, 5, 7, 9, the four stats, and the
admissions stated plainly — they will find them anyway.

**The engineer** — whose sessions it will block. Hears *my agent ignored my
rules again* and *will this nag me*. Afraid of a blocked session on a nonsense
finding, another config layer, a loop, a tool that cannot be removed. Lands:
messages 1, 3, 4, 6, 8, and the fairness mechanics that survive a teardown: a
new check is advisory for 14 days; an acceptance with a stated reason silences
a finding, and a reasonless one is itself a finding; the stop lets go after two
failed fixes; every finding says what, why and the fix; leaving is deleting
tracked files (`repo:.claudinite/shared/engine/checks/helpers/findings.mjs`,
`hooks/stop-command.mjs`).

## Proof the page may use

- **The four canon-wide stats** in `site/data/promoted.js`, machine-maintained
  weekly by the local `site-stats` task: packs, deterministic checks, skills,
  scheduled task types. Counts only, never names (R12).
- **Mechanics**: six hook events; the Stop hook exits 2 and feeds findings back;
  work vs world scope on the manifest; action-scope declarations judged before
  a tool runs; a seven-probe self-test at session start; 14-day grace;
  reason-required acceptances; the two-attempt loop guard; a daily update PR
  that supersedes its predecessor and lands itself when CI is green, or waits
  for review on one setting; scheduler failures escalated to an issue; a
  fleet-wide suspend variable; the session's opening line reporting packs,
  checks and rule tokens.
- **The one quotation**: Anthropic's memory doc.
- **Admissions**, each verified in code: Claude Code only; GitHub only; one
  hard-coded public canon; no pinning or rollback; no fleet-wide roll-up (say
  "roll-up", not "dashboard" — an opt-in dashboard pack over scheduler state
  exists in the canon and is unverified here); adoption ends with a routine
  a human wires; no published price; no licence file in the canon.
- **Never**: testimonials, stars, adoption counts, private repository links.

## Vocabulary

Use: *canon* (the shared repository every member's rules are vendored from),
*pack* (a versioned bundle of rules, checks, skills and tasks for one subject),
*rule* (a written convention loaded as prose), *check* (a deterministic test of
the work or the repo; can block), *blocking / advisory*, *finding* (what, why,
fix), *acceptance* (a reasoned decision to let a finding stand), *skill* (a
procedure loaded on demand), *task* (scheduled work a repo runs on itself),
*converge* (bring a repo back to the canon's current state), *fleet* (every
repo sharing a canon).

Avoid: *sync*, *governance* as a bare noun, *drift detection*, *enforce* used
loosely, *guardrails*, *single source of truth*, *AI coding agents* generically
(it is Claude Code), *convention packs* as a category word, *police*,
*inspector* as a product noun, *dashboard*.

## Open research questions

- Does the enforcement promise convert better than the write-once relief the
  category sells? No traffic to test on yet.
- Any measured adherence effect, hook latency or context footprint — none
  recorded.
- A public member repository to point at; real adoption counts.
- The Actions-minutes cost at 50+ repos.
