import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseTaskDeclaration } from '../../../../../shared/packs/claudinite-tasks/task-declaration-text.mjs';
import { validateTaskDeclaration } from '../../../../../shared/packs/claudinite-tasks/task-contract.mjs';
import { loadTaskTerms } from '../../../../../shared/packs/claudinite-tasks/task-terms.mjs';
import { RELEASE_TASK_ID } from './preconditions.mjs';

const taskDir = dirname(fileURLToPath(import.meta.url));
const task = parseTaskDeclaration(readFileSync(new URL('./task.json', import.meta.url), 'utf8'));

// The declaration is judged by THIS REPO'S OWN vendored contract, not a canon copy:
// the mount is what discovery validates against, and a declaration that fails it is
// skipped with an error rather than failing the mount — so the task would simply stop
// releasing, with nothing red to say so.
test('the vendored contract accepts the declaration, with the task\'s own term resolved', async () => {
  assert.deepEqual(validateTaskDeclaration(task, await loadTaskTerms(taskDir)), []);
});

// Two artifacts that can drift apart in silence: the declaration names its gate only
// by term, and a rename on either side leaves a condition resolving against nothing.
test('every condition the declaration names resolves to a term that exists', async () => {
  const terms = await loadTaskTerms(taskDir);
  for (const condition of task.preconditions) {
    assert.ok(terms.has(condition), `no term named ${condition}`);
  }
});

// The third artifact in the same triangle. The worker stamps its release commits with
// the id the queue hands it — `<pack>/<task>`, derived from these two directory names
// — and the gate recognises a release commit by comparing against this literal. A
// rename of either directory silently stops the gate seeing the release's own commits,
// which releases the same bytes every night forever.
test('the gate\'s task id is the one the directories give the queue', () => {
  const pack = basename(dirname(dirname(taskDir)));
  assert.equal(RELEASE_TASK_ID, `${pack}/${basename(taskDir)}`);
});
