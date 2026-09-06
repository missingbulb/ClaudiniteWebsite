// Fixture for claudinite-website/deploy-trigger-claim. The bar: a workflow
// that grew a `paths:` filter while the README still claims there is none
// must produce a finding, and every other combination must stay silent —
// proved on the rule's own `run` against a synthetic context, not on the live
// repo (whose content is exactly what the rule is there to keep aligned).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import rule from './deploy-trigger-claim.mjs';

const README = 'site/README.md';
const WORKFLOW = '.github/workflows/deploy-pages.yml';

const CLAIM_LINE = 'the workflow carries no `paths:` filter, so a push that touches nothing under `site/` still redeploys the same content.';

function readmeWith(claimLine) {
  return ['# site/', '', claimLine, ''].join('\n');
}

const NO_FILTER_WORKFLOW = ['on:', '  push:', '    branches: [main]', '  workflow_dispatch:'].join('\n');
const FILTERED_WORKFLOW = ['on:', '  push:', '    branches: [main]', '    paths:', "      - 'site/**'"].join('\n');

function ctxWith({ readme = readmeWith(CLAIM_LINE), workflow = NO_FILTER_WORKFLOW }) {
  const files = {};
  if (readme !== null) files[README] = readme;
  if (workflow !== null) files[WORKFLOW] = workflow;
  return { tracked: Object.keys(files), files: Object.keys(files), read: (p) => (p in files ? files[p] : null) };
}

test('silent when the claim matches an unfiltered workflow', () => {
  assert.deepEqual(rule.run(ctxWith({})), []);
});

test('fires when the workflow grows a paths filter the claim no longer describes', () => {
  const found = rule.run(ctxWith({ workflow: FILTERED_WORKFLOW }));
  assert.equal(found.length, 1);
  assert.equal(found[0].rule, 'claudinite-website/deploy-trigger-claim');
  assert.equal(found[0].file, README);
  assert.equal(found[0].line, 3);
  assert.match(found[0].what, /now has one/);
});

test('silent when the README carries no such claim at all', () => {
  const found = rule.run(ctxWith({ readme: readmeWith('No claim about the deploy trigger here.'), workflow: FILTERED_WORKFLOW }));
  assert.deepEqual(found, []);
});

test('silent when the README is missing', () => {
  assert.deepEqual(rule.run(ctxWith({ readme: null, workflow: FILTERED_WORKFLOW })), []);
});

test('silent when the workflow is missing', () => {
  assert.deepEqual(rule.run(ctxWith({ workflow: null })), []);
});
