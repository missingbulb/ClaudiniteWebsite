// Fixture for claudinite-website/site-deploy-trigger-claim. The bar: a
// violating input must produce a finding, a clean one must produce none —
// proved on the rule's own `run` against a synthetic context, not on the live
// repo (whose content is exactly what the rule is there to keep clean).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import rule, { hasPushPathsFilter } from './site-deploy-trigger-claim.mjs';

function ctxWith({ workflow, readme = null }) {
  const files = {
    '.github/workflows/deploy-pages.yml': workflow,
    ...(readme === null ? {} : { 'site/README.md': readme }),
  };
  return { read: (p) => (p in files ? files[p] : null) };
}

const UNSCOPED_WORKFLOW = `# Publishes site/ to GitHub Pages on every push to main that touches it.
name: Deploy site to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    steps:
      - run: echo deploying
`;

const SCOPED_WORKFLOW = `# Publishes site/ to GitHub Pages on every push to main that touches it.
name: Deploy site to GitHub Pages

on:
  push:
    branches: [main]
    paths:
      - 'site/**'
  workflow_dispatch:

jobs:
  deploy:
    steps:
      - run: echo deploying
`;

// The literal string "paths:" appears, but nested under a step far deeper than
// on.push — must not be mistaken for a real filter.
const DECOY_PATHS_WORKFLOW = `# Publishes site/ to GitHub Pages on every push to main that touches it.
name: Deploy site to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    steps:
      - name: Notes
        run: |
          # paths: not a real filter, just a step comment
          echo hi
`;

const HONEST_UNSCOPED_WORKFLOW = `# Publishes site/ to GitHub Pages on every push to main.
name: Deploy site to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:
`;

const SCOPED_README = `# site/ — claudinite.com

The static marketing site for Claudinite. Published as-is by
[.github/workflows/deploy-pages.yml](../.github/workflows/deploy-pages.yml)
on every push to \`main\` that touches \`site/**\`.
`;

const HONEST_README = `# site/ — claudinite.com

The static marketing site for Claudinite. Published as-is by
[.github/workflows/deploy-pages.yml](../.github/workflows/deploy-pages.yml)
on every push to \`main\`.
`;

test('hasPushPathsFilter finds a paths: key scoped under on.push', () => {
  assert.equal(hasPushPathsFilter(SCOPED_WORKFLOW), true);
});

test('hasPushPathsFilter ignores a decoy paths: outside on.push', () => {
  assert.equal(hasPushPathsFilter(DECOY_PATHS_WORKFLOW), false);
});

test('hasPushPathsFilter is false with no paths: anywhere', () => {
  assert.equal(hasPushPathsFilter(UNSCOPED_WORKFLOW), false);
});

test('fires on the workflow header comment when the filter is gone', () => {
  const found = rule.run(ctxWith({ workflow: UNSCOPED_WORKFLOW }));
  assert.equal(found.length, 1);
  assert.equal(found[0].rule, 'claudinite-website/site-deploy-trigger-claim');
  assert.equal(found[0].file, '.github/workflows/deploy-pages.yml');
  assert.equal(found[0].line, 1);
});

test('fires on site/README.md when the filter is gone', () => {
  const found = rule.run(ctxWith({ workflow: UNSCOPED_WORKFLOW, readme: SCOPED_README }));
  assert.equal(found.length, 2);
  assert.ok(found.some((f) => f.file === 'site/README.md' && f.line === 5));
});

test('fires on the decoy workflow too — the decoy only defeats hasPushPathsFilter, not the claim scan', () => {
  const found = rule.run(ctxWith({ workflow: DECOY_PATHS_WORKFLOW }));
  assert.equal(found.length, 1);
});

test('stays quiet when the paths: filter is present, even if the claim text is stale', () => {
  assert.deepEqual(rule.run(ctxWith({ workflow: SCOPED_WORKFLOW, readme: SCOPED_README })), []);
});

test('stays quiet when the filter is gone but the docs describe the real trigger', () => {
  assert.deepEqual(rule.run(ctxWith({ workflow: HONEST_UNSCOPED_WORKFLOW, readme: HONEST_README })), []);
});

test('stays quiet when site/README.md does not exist in this tree', () => {
  const found = rule.run(ctxWith({ workflow: UNSCOPED_WORKFLOW, readme: null }));
  assert.equal(found.length, 1);
  assert.equal(found[0].file, '.github/workflows/deploy-pages.yml');
});
