import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PROMOTED_PATH } from './worker.mjs';
import { parseTaskDeclaration } from '../../../../../shared/packs/claudinite-tasks/task-declaration-text.mjs';
import { validateTaskDeclaration } from '../../../../../shared/packs/claudinite-tasks/task-contract.mjs';

const task = parseTaskDeclaration(readFileSync(new URL('./task.json', import.meta.url), 'utf8'));

// The declaration is checked against THIS REPO'S OWN vendored contract, not a
// canon copy: the mount is what discovery validates against, and a declaration
// that fails it is skipped with an error rather than failing the mount — so the
// task would simply stop running with nothing red to say so.
test('site-stats declares the one precondition mechanism, and no legacy remnant', () => {
  assert.deepEqual(task.preconditions, ['none']);
  assert.equal(task.precondition, undefined);
  assert.equal(task.precondition_signals, undefined);
});

test('the vendored contract accepts it', () => {
  assert.deepEqual(validateTaskDeclaration(task, new Map()), []);
});

// DRIFT GUARD. `task.json` is a pure data literal — it imports nothing, so it cannot
// reference the path `worker.mjs` writes and instead carries a copy of the folder
// holding it, as its automerge scope. The two are free to drift, and the failure is
// silent in the worst direction: a scope that no longer covers the written file
// leaves every recount parked for review with nothing saying why.
test('the automerge scope still covers the file the worker writes', () => {
  const scopes = task.automerge
    .filter((term) => term.startsWith('under:'))
    .map((term) => term.slice('under:'.length));

  assert.ok(scopes.length > 0, 'the declaration no longer scopes automerge with an `under:` term');
  assert.ok(
    scopes.some((dir) => PROMOTED_PATH === dir || PROMOTED_PATH.startsWith(`${dir}/`)),
    `automerge scopes ${JSON.stringify(scopes)} do not contain ${PROMOTED_PATH}`,
  );
});
