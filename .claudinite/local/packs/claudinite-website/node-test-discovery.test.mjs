// Fixture for claudinite-website/node-test-discovery. The bar: a violating
// input must produce a finding, a clean one must produce none — proved on the
// rule's own `run` against a synthetic context, not on the live repo (whose
// content is exactly what the rule is there to keep clean).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import rule from './node-test-discovery.mjs';

// The tree the fixture pretends to be: one test file the arguments can resolve
// to, plus unrelated content.
const TRACKED = [
  'package.json',
  '.github/workflows/ci.yml',
  '.claudinite/local/packs/claudinite-website/node-test-discovery.test.mjs',
  '.claudinite/shared/engine/checks/check_the_world.mjs',
  'site/index.html',
];

function ctxWith({ scripts = {}, workflow = null, tracked = TRACKED, untracked = [] }) {
  const files = {
    'package.json': JSON.stringify({ name: 'fixture', scripts }, null, 2),
    ...(workflow === null ? {} : { '.github/workflows/ci.yml': workflow }),
  };
  return {
    tracked,
    files: [...tracked, ...untracked],
    read: (p) => (p in files ? files[p] : null),
  };
}

const CLEAN_WORKFLOW = `name: CI
jobs:
  t:
    steps:
      - run: node --test '.claudinite/local/packs/**/*.test.mjs'
`;

const BARE_WORKFLOW = `name: CI
jobs:
  t:
    steps:
      - run: node --test
`;

const TYPO_WORKFLOW = `name: CI
jobs:
  t:
    steps:
      - run: node --test '.claudinite/local_packs/**/*.test.mjs'
`;

test('fires on a bare node --test in a workflow step', () => {
  const found = rule.run(ctxWith({ workflow: BARE_WORKFLOW }));
  assert.equal(found.length, 1);
  assert.equal(found[0].rule, 'claudinite-website/node-test-discovery');
  assert.equal(found[0].file, '.github/workflows/ci.yml');
  assert.equal(found[0].line, 5);
  assert.match(found[0].fix, /explicit path or glob/);
});

test('fires on a glob that matches nothing in the tree', () => {
  const found = rule.run(ctxWith({ workflow: TYPO_WORKFLOW }));
  assert.equal(found.length, 1);
  assert.match(found[0].what, /names no test path that exists/);
});

test('fires on a bare node --test in a package.json script', () => {
  const found = rule.run(ctxWith({ scripts: { test: 'node --test' } }));
  assert.equal(found.length, 1);
  assert.equal(found[0].file, 'package.json');
  assert.ok(found[0].line > 0);
});

test('fires when only flags follow --test', () => {
  const found = rule.run(ctxWith({ scripts: { test: 'node --test --test-reporter=spec' } }));
  assert.equal(found.length, 1);
});

test('fires on the second command of a chained script', () => {
  const found = rule.run(ctxWith({ scripts: { test: 'npm run lint && node --test' } }));
  assert.equal(found.length, 1);
});

test('stays quiet on an invocation whose glob resolves', () => {
  assert.deepEqual(rule.run(ctxWith({ workflow: CLEAN_WORKFLOW })), []);
});

test('stays quiet on an explicit file path that exists', () => {
  const scripts = { test: 'node --test .claudinite/local/packs/claudinite-website/node-test-discovery.test.mjs' };
  assert.deepEqual(rule.run(ctxWith({ scripts })), []);
});

test('stays quiet on a directory that holds files', () => {
  assert.deepEqual(rule.run(ctxWith({ scripts: { test: 'node --test .claudinite/local/packs/' } })), []);
});

test('stays quiet on a repo with no node --test at all', () => {
  const scripts = { 'bump-version': 'node scripts/bump-version.mjs' };
  assert.deepEqual(rule.run(ctxWith({ scripts, workflow: 'name: CI\njobs:\n  c:\n    steps:\n      - run: node .claudinite/shared/engine/checks/check_the_world.mjs\n' })), []);
});

test('stays quiet on an interpolated command it cannot judge', () => {
  assert.deepEqual(rule.run(ctxWith({ scripts: { test: 'node --test $TEST_GLOB' } })), []);
});

test('stays quiet when the test file is added in the same, not-yet-committed change', () => {
  const tracked = TRACKED.filter((f) => !f.endsWith('node-test-discovery.test.mjs'));
  const untracked = ['.claudinite/local/packs/claudinite-website/node-test-discovery.test.mjs'];
  assert.deepEqual(rule.run(ctxWith({ workflow: CLEAN_WORKFLOW, tracked, untracked })), []);
});

test('does not confuse --test-reporter for --test', () => {
  assert.deepEqual(rule.run(ctxWith({ scripts: { report: 'node --test-reporter=spec scripts/bump-version.mjs' } })), []);
});
