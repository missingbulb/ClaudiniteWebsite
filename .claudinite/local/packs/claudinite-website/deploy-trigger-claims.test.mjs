// Fixture for claudinite-website/deploy-trigger-claims. The bar: a violating
// input must produce a finding, a clean one must produce none — proved on the
// rule's own `run` against a synthetic context, never on the live repo (whose
// content is exactly what the rule is there to keep honest).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import rule, { claims, declaredPaths } from './deploy-trigger-claims.mjs';

const WORKFLOW = '.github/workflows/deploy-pages.yml';

const UNFILTERED = `# Publishes site/ to GitHub Pages on every push to main.
name: Deploy site to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
`;

const STALE_HEADER = UNFILTERED.replace(
  '# Publishes site/ to GitHub Pages on every push to main.',
  '# Publishes site/ to GitHub Pages on every push to main that touches it.',
);

const FILTERED = UNFILTERED.replace('    branches: [main]', `    branches: [main]
    paths:
      - 'site/**'`);

// The claim as it is actually written — wrapped across lines, markdown link in
// the middle. If the rule only read single lines it would miss this one.
const README_CLAIM = `# site/ — claudinite.com

The static marketing site for Claudinite. No build step, no dependencies: the
directory is published as-is by [deploy-pages.yml](../.github/workflows/deploy-pages.yml)
(GitHub Pages via the actions artifact flow) on every push to \`main\` that
touches \`site/**\`.
`;

const README_HONEST = README_CLAIM.replace(' that\ntouches `site/**`.', '.');

function ctxWith({ workflow = UNFILTERED, md = {} }) {
  const files = { [WORKFLOW]: workflow, ...md };
  const paths = Object.keys(files);
  return {
    files: paths,
    tracked: paths,
    read: (p) => (p in files ? files[p] : null),
  };
}

test('fires on a README claiming a paths filter the workflow does not declare', () => {
  const found = rule.run(ctxWith({ md: { 'site/README.md': README_CLAIM } }));
  assert.equal(found.length, 1);
  assert.equal(found[0].rule, 'claudinite-website/deploy-trigger-claims');
  assert.equal(found[0].file, 'site/README.md');
  assert.equal(found[0].line, 5);
  assert.match(found[0].what, /declares no `paths:` filter/);
  assert.match(found[0].fix, /every push/);
});

test("fires on the workflow's own header comment making the same stale claim", () => {
  const found = rule.run(ctxWith({ workflow: STALE_HEADER }));
  assert.equal(found.length, 1);
  assert.equal(found[0].file, WORKFLOW);
  assert.equal(found[0].line, 1);
});

test('fires once per claiming surface', () => {
  const found = rule.run(ctxWith({ workflow: STALE_HEADER, md: { 'site/README.md': README_CLAIM } }));
  assert.equal(found.length, 2);
});

test('fires when the claim names a glob the filter does not list', () => {
  const md = { 'docs/deploy.md': 'The site publishes on every push to `main` that touches `docs/**`.\n' };
  const found = rule.run(ctxWith({ workflow: FILTERED, md }));
  assert.equal(found.length, 1);
  assert.match(found[0].what, /`docs\/\*\*`, which .* does not list/);
});

test('stays quiet when the claimed glob is the one the workflow filters on', () => {
  const found = rule.run(ctxWith({ workflow: FILTERED, md: { 'site/README.md': README_CLAIM } }));
  assert.deepEqual(found, []);
});

test('stays quiet on an unqualified "every push to main" — true under both shapes', () => {
  assert.deepEqual(rule.run(ctxWith({ md: { 'site/README.md': README_HONEST } })), []);
  assert.deepEqual(rule.run(ctxWith({ workflow: FILTERED, md: { 'site/README.md': README_HONEST } })), []);
});

test('stays quiet on prose that never mentions the deploy trigger', () => {
  const md = { 'site/README.md': 'The design system lives in assets/style.css; touch `site/**` all you like.\n' };
  assert.deepEqual(rule.run(ctxWith({ md })), []);
});

test('stays quiet in a repo with no deploy workflow at all', () => {
  const ctx = ctxWith({ md: { 'site/README.md': README_CLAIM } });
  const bare = { ...ctx, read: (p) => (p === WORKFLOW ? null : ctx.read(p)) };
  assert.deepEqual(rule.run(bare), []);
});

test('reads the trigger from on.push, not from any `paths:` in the file', () => {
  // A `paths:` under a step's `with:` is not a trigger filter.
  const decoy = UNFILTERED.replace('      - uses: actions/checkout@v5', `      - uses: actions/upload-pages-artifact@v3
        with:
          paths: site/`);
  assert.equal(declaredPaths(decoy), null);
  const found = rule.run(ctxWith({ workflow: decoy, md: { 'site/README.md': README_CLAIM } }));
  assert.equal(found.length, 1);
});

test('declaredPaths reads a real paths list, and paths-ignore counts as filtered', () => {
  assert.deepEqual(declaredPaths(FILTERED), ['site/**']);
  const ignore = UNFILTERED.replace('    branches: [main]', "    branches: [main]\n    paths-ignore: ['docs/**']");
  assert.deepEqual(declaredPaths(ignore), ['docs/**']);
});

test('claims() picks the wrapped sentence and its glob out of markdown', () => {
  const found = claims(README_CLAIM);
  assert.equal(found.length, 1);
  assert.deepEqual(found[0].globs, ['site/**']);
});
