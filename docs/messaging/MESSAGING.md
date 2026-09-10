# Core messaging — claudinite.com

The argument the page makes, in the order it makes it — derived from this
repo's own market research rather than from the previous page. Each message
carries the metaphor that explains it, the evidence behind it, and where it
lands on the page. The research pages themselves are deliberately not linked
from here: they grow autonomously and nothing in the repo may depend on them.
The requirements that bind all of this are R11–R14 in
[`product-requirements/`](../../product-wiki/product-requirements/README.md);
the mechanics of editing the page are [site/README.md](../../site/README.md).

Nothing here is a research finding and nothing here is a requirement. It is
the working brief for one artifact — the page — and it is rewritten whenever
the page's argument changes.

## The one sentence

**Everything else in the agent stack multiplies sessions. Claudinite is the
layer that constrains what they land.**

## The spine

Seven messages. The first three are the argument; the next three are the
proof; the last is the honesty that makes the first six believable.

### M1 — Advice is not a control

A rule written in prose is a *sign*, not a *speed bump*. A sign asks; a bump
decides. Every convention file in the industry is a sign, and the platform
vendor says so in its own documentation: Claude "treats them as context, not
enforced configuration."

Why it now matters more than it did: volume. Roughly a fifth of merged code in
large orgs is agent-authored, and human vigilance does not scale with agent
output. The scissor in the survey data — near-universal adoption, minority
trust — *is* the buying condition.

- **Metaphor:** signs and speed bumps.
- **Evidence:** Claude Code memory doc; DX Q4-2025 (22% of merged code
  AI-authored); DORA 2025 (90% use, 30% little-or-no trust).
- **Page:** the problem section, carrying the vendor quotation as the page's
  single quote (R11).

### M2 — Enforcement appears at exactly one layer

The field looks crowded until it is read as a stack. Orchestrators answer *who
does the work*; cockpits answer *how a human watches many sessions*;
marketplaces answer *how capability reaches a session*. All three multiply
sessions. None of them reads the rule files it displays.

That is not an oversight and not a gap waiting to close — it is what those
products are for. A session's constraint has to live where the work lands: in
the repository.

The contrast has to be stated as a property rather than as a competitor
comparison, because it is the first question anyone already inside this
ecosystem asks: **a plugin distributes capability into a session; a pack
distributes constraint into a repository** — plus files the repository then
owns. The two are answering different questions, which is why no plugin
install scope is repo-scoped: project scope reaches the repo but is advisory
and can be switched off locally, and managed scope is genuinely enforced but
follows a person to every repository they open.

- **Metaphor:** the stack — three floors of amplification above one floor of
  restraint. Everyone else is building upstairs.
- **Evidence:** Landscape wiki's layer model. Xirp's Rules tab is a viewer;
  Gas Town has no conformance layer; no plugin install scope is repo-scoped
  (project scope is advisory and locally overridable, managed scope follows
  people and devices).
- **Page:** the layer section — the page's key differentiator, and the one
  section no rival page could publish.

### M3 — A rule graduates

Prose is where a rule starts, not where it ends. Claudinite promotes a rule
down a ladder — prose → skill → check → hook → schema → platform setting —
and each rung costs less attention and binds harder than the one above it.

The economics are the point, and they are a metaphor a buyer already knows:
**prose is rent, a check is equity.** A written rule is re-read, re-weighed and
re-paid for out of the context budget in every session, forever, and adherence
falls as the file grows. A check is paid for once and then costs nothing until
the moment it fires. So a corpus of prose saturates; a corpus that keeps
promoting its rules does not.

- **Metaphor:** the ladder; rent versus equity.
- **Evidence:** the promotion ladder is a working rule of the corpus itself;
  the vendor's own guidance to keep a convention file under 200 lines "because
  longer files consume more context and reduce adherence."
- **Page:** the ladder section plus the compounding chart, which is schematic
  and asserts no magnitudes.

### M4 — It holds twice, and one of those is not the agent's to skip

The corpus is checked when a session stops — with the transcript in view, so
rules about *how the work was done* are checkable, not just what the files say
— and the repo-facing half runs again in CI, where no session is present at
all. A finding is not a lint message: it names what, why, and the fix, and a
blocking one holds the session open until it is cleared. An exemption is
allowed and must carry a written reason; a reasonless one is itself a
violation.

Enforcement is graduated, and that is what makes it liveable: a finding is
blocking or advisory, and an advisory never fails anything. A rule that is
wrong *here* is exempted on the record — the exemption names a path and a
reason, and the reason is mandatory — or turned down to advisory, or off. The
escape hatch is a first-class, reviewed act rather than a hack, which is the
difference between a system a team keeps and one a team disables.

- **Metaphor:** the gate. Two gates, actually, and the second one does not
  care whether an agent was involved.
- **Evidence:** work-scope and world-scope runners; severities; reason-required
  acceptances.
- **Page:** the enforcement mechanism, in a terminal.

### M5 — The fleet converges itself

Every repo re-vendors the canon nightly and lands the difference as a pull
request through the repo's own CI. This is desired-state convergence — the
Puppet model, which any platform team recognises on sight — applied to
conventions rather than servers. Drift stops being an errand somebody owns and
becomes a state the system leaves on its own.

The pull request is also the answer to the question procurement asks first:
*who reviews what the vendor pushes into our repositories?* You do — every
convergence arrives as a diff in your own repo, gated by your own CI, and
nothing lands any other way. The delivery mechanism and the supply-chain
review are the same object.

- **Metaphor:** Puppet for conventions. Also: a tide, not a chore.
- **Evidence:** nightly baselining with auto-merged maintenance PRs; Spotify's
  fleet management (270k+ PRs, 77% automerged) as the mental model enterprises
  already hold; the pin-plus-bot-PR pattern every winning comparable shipped.
- **Page:** the fleet mechanism.

### M6 — Lessons travel

A correction in one session becomes a rule in that repo, and a rule that
proves itself is promoted into the canon every repo reads. It is the only loop
in the field that runs *backwards* — from the work back into the constraint.
The native analog is deliberately machine-local: Claude Code's auto memory
"is not shared across machines or cloud environments."

- **Metaphor:** immune memory. One repo meets the pathogen; the fleet is
  immune.
- **Evidence:** capture → extract → local pack → dedup → canon, implemented
  end to end; auto memory's documented locality; no rival has any analog.
- **Page:** the growth mechanism.

### M7 — Nothing to trust, and nothing to be locked into

There is no service, no account and no dashboard. The corpus is plain files in
the checkout, which means it works with no network, in CI, and for a person
who installed nothing. Every automated change arrives as a pull request in the
customer's own repository. Leaving is deleting files, and the files keep
working if the vendor disappears — vendored plain files are their own escrow.

- **Metaphor:** it is in the box, not in the cloud.
- **Evidence:** the no-runtime-service shape; "code never leaves our
  environment" is a documented enterprise-approval accelerant; managed
  settings prove enterprises already accept file-based, no-server policy.
- **Page:** the assurance strip under adoption, plus the FAQ.

### M8 — Where it stops

Named plainly, on the page: Claude Code today, GitHub today, no aggregation
pane, and a canon that tracks head rather than a pin you choose. A page that
states its own edges survives a teardown; the previous page's four attackable
claims were retired rather than softened, and that discipline is the message.

- **Metaphor:** none. This section earns its credibility by having none.
- **Evidence:** Positioning gaps 1–9.
- **Page:** its own short band before adoption.

## What the page must not say

Carried from R12, because these are the failure modes a rewrite reintroduces:

- No named pack, check, skill or task — the page says *how many*, never
  *which*, so no copy dates when the canon moves.
- No private repository linked as an example, ever.
- No invented testimonials, stars, adoption numbers or measured magnitudes;
  the compounding chart carries no numbers on its axes.
- No generic "AI coding agents" — the enforced target is Claude Code, and
  saying otherwise is the claim a teardown starts with.

## Tone

Terse by construction (R13). Every section earns its heading and a visual; a
section that wants a paragraph needs a better drawing. Fragments over
sentences. One idea per line.
