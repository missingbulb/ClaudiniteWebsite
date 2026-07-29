// Red-first fixtures for this pack's checks. Dependency-free, node:test only:
//   node --test .claudinite/local/packs/claudinite-website/pack.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';

import canonRefInStep from './canon-ref-in-step.mjs';

// Minimal stand-in for the engine's context: rules only ever call ctx.read().
const ctx = (files) => ({ read: (path) => (path in files ? files[path] : null) });

const config = (ref) => JSON.stringify({ packs: ['basics'], claudinite: { ref } });
const promoted = (short) => `window.CLAUDINITE = {\n  canonRepo: 'x',\n  canonRef: '${short}',\n};\n`;

const SHA = '005edd2028b770facd2be74812b29556ced5194d';

test('canon-ref-in-step: green when the site short ref prefixes the vendored ref', () => {
  const found = canonRefInStep.run(ctx({
    '.claudinite-checks.json': config(SHA),
    'site/data/promoted.js': promoted('005edd2'),
  }));
  assert.deepEqual(found, []);
});

test('canon-ref-in-step: red when baselining moved the vendored ref and the site kept the old one', () => {
  const found = canonRefInStep.run(ctx({
    '.claudinite-checks.json': config('8b31f77aa1c0de4455e2c93a7ba0f6d0d1e2f3a4'),
    'site/data/promoted.js': promoted('005edd2'),
  }));
  assert.equal(found.length, 1);
  assert.equal(found[0].file, 'site/data/promoted.js');
  assert.equal(found[0].line, 3);
  assert.match(found[0].fix, /8b31f77/);
});

test('canon-ref-in-step: red when the site data carries no canonRef at all', () => {
  const found = canonRefInStep.run(ctx({
    '.claudinite-checks.json': config(SHA),
    'site/data/promoted.js': "window.CLAUDINITE = {\n  canonRepo: 'x',\n};\n",
  }));
  assert.equal(found.length, 1);
  assert.match(found[0].fix, /005edd2/);
});

test('canon-ref-in-step: inert when either file is absent or the settings are malformed', () => {
  assert.deepEqual(canonRefInStep.run(ctx({ '.claudinite-checks.json': config(SHA) })), []);
  assert.deepEqual(canonRefInStep.run(ctx({ 'site/data/promoted.js': promoted('005edd2') })), []);
  assert.deepEqual(canonRefInStep.run(ctx({
    '.claudinite-checks.json': '{ not json',
    'site/data/promoted.js': promoted('005edd2'),
  })), []);
});
