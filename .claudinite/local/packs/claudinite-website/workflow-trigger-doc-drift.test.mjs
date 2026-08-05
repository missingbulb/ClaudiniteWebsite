// Fixture for claudinite-website/workflow-trigger-doc-drift. The bar: a
// violating input must produce a finding, a clean one must produce none —
// proved on the rule's own `run` against a synthetic context, never on the live
// repo (whose content is what the rule exists to keep true).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import rule, { claimsIn, paragraphAt, pushTrigger } from './workflow-trigger-doc-drift.mjs';

const WF = '.github/workflows/deploy-pages.yml';
const TRACKED = ['site/README.md', WF, 'site/index.html'];

const EVERY_PUSH = `name: Deploy
on:
  push:
    branches: [main]
  workflow_dispatch:
jobs:
  deploy:
    runs-on: ubuntu-latest
`;

const FILTERED = `name: Deploy
on:
  push:
    branches: [main]
    paths:
      - 'site/**'
jobs:
  deploy:
    runs-on: ubuntu-latest
`;

const IGNORING = `name: Deploy
on:
  push:
    branches: [main]
    paths-ignore:
      - 'docs/**'
jobs:
  deploy:
    runs-on: ubuntu-latest
`;

const NO_PUSH = `name: Deploy
on:
  workflow_dispatch:
jobs:
  deploy:
    runs-on: ubuntu-latest
`;

const CLAIMS_FILTER = `# site/

The static marketing site. No build step: the directory is published as-is by
[.github/workflows/deploy-pages.yml](../.github/workflows/deploy-pages.yml)
(GitHub Pages via the actions artifact flow) on every push to \`main\` that
touches \`site/**\`.

## Layout
`;

const CLAIMS_NOTHING = `# site/

The static marketing site. No build step: the directory is published as-is by
[.github/workflows/deploy-pages.yml](../.github/workflows/deploy-pages.yml)
(GitHub Pages via the actions artifact flow) on every push to \`main\`.

## Layout
`;

function ctxWith({ doc = CLAIMS_FILTER, workflow = EVERY_PUSH, tracked = TRACKED } = {}) {
  const files = { 'site/README.md': doc, [WF]: workflow };
  return { tracked, files: tracked, read: (p) => (p in files ? files[p] : null) };
}

test('fires when the doc claims a paths filter the workflow does not have', () => {
  const found = rule.run(ctxWith({}));
  assert.equal(found.length, 1);
  assert.equal(found[0].rule, 'claudinite-website/workflow-trigger-doc-drift');
  assert.equal(found[0].file, 'site/README.md');
  assert.equal(found[0].line, 4);
  assert.match(found[0].what, /no `on\.push\.paths` filter/);
  assert.match(found[0].fix, /drop the path qualifier/);
});

test('fires when the doc names a glob the workflow does not filter on', () => {
  const doc = CLAIMS_FILTER.replace('site/**', 'web/**');
  const found = rule.run(ctxWith({ doc, workflow: FILTERED }));
  assert.equal(found.length, 1);
  assert.match(found[0].what, /\["site\/\*\*"\]/);
});

test('fires when the doc names a branch the workflow does not trigger on', () => {
  const doc = CLAIMS_NOTHING.replace('`main`', '`release`');
  const found = rule.run(ctxWith({ doc }));
  assert.equal(found.length, 1);
  assert.match(found[0].what, /on a push to `release`/);
});

test('stays quiet when the doc claim matches the filtered workflow', () => {
  assert.deepEqual(rule.run(ctxWith({ workflow: FILTERED })), []);
});

test('stays quiet when the doc makes no path claim about an unfiltered workflow', () => {
  assert.deepEqual(rule.run(ctxWith({ doc: CLAIMS_NOTHING })), []);
});

test('stays quiet when the workflow filters by paths-ignore', () => {
  assert.deepEqual(rule.run(ctxWith({ workflow: IGNORING })), []);
});

test('stays quiet when the workflow has no push trigger at all', () => {
  assert.deepEqual(rule.run(ctxWith({ workflow: NO_PUSH })), []);
});

test('stays quiet on a doc that never links the workflow', () => {
  const doc = CLAIMS_FILTER.replace(/\[[^\]]*\]\([^)]*\)/, 'the deploy workflow');
  assert.deepEqual(rule.run(ctxWith({ doc })), []);
});

test('stays quiet on a claim in a different paragraph from the link', () => {
  const doc = `# site/

Published by [deploy](../.github/workflows/deploy-pages.yml).

An unrelated paragraph about a script that touches \`site/**\` on every run.
`;
  assert.deepEqual(rule.run(ctxWith({ doc })), []);
});

test('stays quiet on unparseable workflow YAML', () => {
  assert.deepEqual(rule.run(ctxWith({ workflow: '\t\t: : :\n  - [' })), []);
});

test('claimsIn reads only backticked, path-shaped tokens', () => {
  assert.deepEqual(claimsIn('on every push to `main` that touches `site/**`.'),
    { branches: ['main'], paths: ['site/**'] });
  // A backticked word that is not path-shaped is prose, not a path filter.
  assert.deepEqual(claimsIn('do not touch `production` by hand.').paths, []);
  // The claim must sit in the same sentence as the verb.
  assert.deepEqual(claimsIn('it touches nothing. Elsewhere `site/**` is served.').paths, []);
});

test('paragraphAt returns the whole paragraph holding the line, joined', () => {
  const p = paragraphAt('a\n\nb1\nb2\n\nc\n', 4);
  assert.equal(p, 'b1 b2');
});

test('pushTrigger reads branches and paths, and declines what it cannot judge', () => {
  assert.deepEqual(pushTrigger(FILTERED), { branches: ['main'], paths: ['site/**'], ignoring: false });
  assert.deepEqual(pushTrigger(EVERY_PUSH), { branches: ['main'], paths: null, ignoring: false });
  assert.equal(pushTrigger(NO_PUSH), null);
  assert.equal(pushTrigger(IGNORING).ignoring, true);
});
