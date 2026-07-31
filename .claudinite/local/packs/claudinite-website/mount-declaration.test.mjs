import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import rule from './mount-declaration.mjs';

// Fixture repos, not the real tree: the rule reads the mount off ctx.root, so a
// temp dir with a couple of pack directories is the whole world it can see. The
// context is hand-built (root + the normalized config the loader produces) —
// buildContext wants a git repo, and none of that is what this rule reads.
function fixture(vendored, declared, { errors = [] } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'mount-decl-'));
  for (const [name, isPack] of Object.entries(vendored)) {
    const dir = join(root, '.claudinite', 'shared', 'packs', name);
    mkdirSync(dir, { recursive: true });
    if (isPack) writeFileSync(join(dir, 'pack.mjs'), `export default { id: '${name}' };\n`);
  }
  return { root, ctx: { root, config: { packs: declared, errors } } };
}

const run = (f) => {
  try { return rule.run(f.ctx); } finally { rmSync(f.root, { recursive: true, force: true }); }
};

test('fires on a pack vendored into the mount that nothing declares', () => {
  const found = run(fixture({ basics: true, orphan: true }, ['basics']));
  assert.equal(found.length, 1);
  assert.equal(found[0].rule, 'claudinite-website-mount-declared');
  assert.equal(found[0].severity, 'blocking');
  assert.equal(found[0].file, '.claudinite-checks.json');
  assert.match(found[0].what, /"orphan" pack is vendored/);
});

test('stays quiet when every vendored pack is declared', () => {
  assert.deepEqual(run(fixture({ basics: true, orphan: true }, ['basics', 'orphan'])), []);
});

test('a directory with no pack.mjs is not a pack', () => {
  assert.deepEqual(run(fixture({ basics: true, README: false }, ['basics'])), []);
});

test('stays quiet in a repo with no vendored mount', () => {
  assert.deepEqual(run(fixture({}, [])), []);
});

test('stays quiet when the settings file failed to load — the runner owns that finding', () => {
  const f = fixture({ basics: true }, [], { errors: [{ what: 'not valid JSON', fix: 'fix it' }] });
  assert.deepEqual(run(f), []);
});
