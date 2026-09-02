import { test } from 'node:test';
import assert from 'node:assert/strict';
import task from './task.mjs';
import { validateTaskDeclaration } from '../../../../../shared/packs/claudinite-tasks/task-contract.mjs';

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
