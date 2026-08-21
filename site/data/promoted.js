/*
 * Promoted-content data for claudinite.com — the ONE file scheduled agent runs
 * edit to rotate what the site promotes. Rendering lives in assets/main.js;
 * markup and copy for evergreen sections live in index.html. Keep this file
 * valid ES5-ish (a plain script, no modules) — it must run from file:// too.
 *
 * Editing contract (see site/README.md for the full guide):
 *  - `stats`: keep claims verifiable against the vendored canon in .claudinite/.
 *  - `spotlight`: ordered, first item gets visual priority; 3–5 items, taglines
 *    ≤ 90 chars, no unverifiable claims.
 *  - `packs`: one card per canon pack; `counts` chips are free-form strings.
 *  - `updates`: newest first, ISO dates, ≤ 140 chars each, only shipped facts.
 */
window.CLAUDINITE = {
  canonRepo: 'https://github.com/missingbulb/Claudinite',
  canonRef: '005edd2',

  stats: [
    { n: '8', label: 'packs in the canon' },
    { n: '25+', label: 'deterministic checks' },
    { n: '15+', label: 'skills on demand' },
    { n: '10', label: 'scheduled task types' },
  ],

  spotlight: [
    {
      title: 'Rules that bite',
      tag: 'Checks run at session stop; the repo-facing ones run again in CI. Blocking means blocking.',
    },
    {
      title: 'The fleet converges itself',
      tag: 'Each repo re-vendors the canon nightly; updates land as PRs through your own CI.',
    },
    {
      title: 'Lessons travel',
      tag: 'What one repo learns becomes a local rule, then canon — and every repo inherits it.',
    },
    {
      title: 'Upkeep runs itself',
      tag: 'Tidy sweeps, wiki growth, prose→checks conversion, on the repo’s own schedule.',
    },
  ],

  packs: [
    { id: 'basics', tag: 'Working discipline and the task lifecycle: issue → branch → PR, reference integrity, warning hygiene.', counts: ['13 checks', '6 skills', 'baselining task'] },
    { id: 'git-github', tag: 'The git/GitHub side of the lifecycle — merge policy, branch recovery, CI-trigger rules.', counts: ['skills', 'merge-to-main'] },
    { id: 'github-actions', tag: 'Workflow lints: secrets placement, pipefail, Pages artifact traps, failure escalation.', counts: ['8 checks'] },
    { id: 'grow_with_claudinite', tag: 'The growth lifecycle: extract lessons from sessions, dedup against canon, discover new packs.', counts: ['5 tasks', 'conversation capture'] },
    { id: 'tidy-repo', tag: 'Standing hygiene: triage stale branches, PRs, and issues on a schedule, judged by content.', counts: ['3 tasks', '3 skills'] },
    { id: 'product-wiki', tag: 'A self-growing, cited market-research wiki with a human-reviewed requirements sink.', counts: ['6 checks', 'growth task'] },
    { id: 'html', tag: 'Hand-authored HTML practice: content-model traps, date-convention inference, live-page verification.', counts: ['prose rules'] },
    { id: 'barriers', tag: 'Declared walls between subtrees — like the one keeping vendored canon read-only in consumers.', counts: ['engine + checks'] },
  ],

  updates: [
    { date: '2026-07-28', text: 'claudinite.com ships — designed, built and deployed by an agent session governed by the same checks it advertises.' },
    { date: '2026-07-28', text: 'This site’s repo adopts the product-wiki pack: cited competitive-landscape research, growing on a schedule.' },
    { date: '2026-07-28', text: 'Canon vendored at ref 005edd2 — hooks, checks manifest, CI sweep and hourly scheduler wired in one bootstrap PR.' },
  ],
};
