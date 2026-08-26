/*
 * Promoted-content data for claudinite.com — the ONE file scheduled agent runs
 * edit to rotate what the site promotes. Rendering lives in assets/main.js;
 * markup and copy for evergreen sections live in index.html. Keep this file
 * valid ES5-ish (a plain script, no modules) — it must run from file:// too.
 *
 * Editing contract (see site/README.md for the full guide):
 *  - `stats`: keep claims verifiable against the vendored canon in .claudinite/.
 *  - `spotlight`: ordered, first item gets visual priority; 3–5 items, taglines
 *    ≤ 90 chars, no unverifiable claims. Benefits, never named packs — the page
 *    shows how many packs there are and never which.
 */
window.CLAUDINITE = {
  canonRepo: 'https://github.com/missingbulb/Claudinite',
  canonRef: '005edd2',

  stats: [
    { n: '33', label: 'packs in the canon' },
    { n: '45+', label: 'deterministic checks' },
    { n: '24+', label: 'skills on demand' },
    { n: '15+', label: 'scheduled task types' },
  ],

  spotlight: [
    {
      title: 'Certainty that costs no context',
      tag: 'Promoted to a check, a rule stops competing for attention and starts blocking instead.',
    },
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

};
