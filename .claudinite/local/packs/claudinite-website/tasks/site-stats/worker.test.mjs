import { test } from 'node:test';
import assert from 'node:assert/strict';

// WHY THIS EXISTS. The worker's own logic is tested through the two pure modules
// it composes, so nothing here re-tests the counting or the write. What is left
// untested by those is the thing that actually broke: whether `node worker.mjs`
// can LOAD. The reach into the vendored mount was one `../` short, every unit test
// stayed green because none of them imported the worker, and the first evidence was
// an ERR_MODULE_NOT_FOUND on a real run.
//
// Importing the module is the whole assertion — it resolves the entire graph,
// including the mount path, and the worker's `main()` is behind a run-directly guard
// so nothing executes.
test('the worker and everything it reaches actually resolve', async () => {
  const mod = await import('./worker.mjs');
  assert.equal(typeof mod.main, 'function');
});
