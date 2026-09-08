import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ANALYTICS_FILE, BEACON_PLACEHOLDER, injectBeacon, isOperatorFailure } from './worker.mjs';
import { nextVersion, stampHtml } from '../../../../../../scripts/bump-version.mjs';

const REAL_TOKEN = '4f8b21ce9a7d4e0fb3c65a1d2e7f9081';

const loaderIn = (dir) => {
  const path = join(dir, 'analytics.js');
  writeFileSync(path, `var TOKEN = '${BEACON_PLACEHOLDER}';\n`);
  return path;
};

const withTemp = (fn) => {
  const dir = mkdtempSync(join(tmpdir(), 'site-release-test-'));
  try { return fn(dir); } finally { rmSync(dir, { recursive: true, force: true }); }
};

test('a configured beacon token reaches the uploaded copy', () => {
  withTemp((dir) => {
    const path = loaderIn(dir);
    assert.equal(injectBeacon(path, REAL_TOKEN), true);
    const text = readFileSync(path, 'utf8');
    assert.ok(text.includes(REAL_TOKEN));
    assert.ok(!text.includes(BEACON_PLACEHOLDER));
  });
});

// The documented off state, and the one the run must be able to report: with no
// variable set the placeholder ships and the loader no-ops.
test('no variable leaves the placeholder in place and says analytics is off', () => {
  withTemp((dir) => {
    const path = loaderIn(dir);
    assert.equal(injectBeacon(path, undefined), false);
    assert.equal(injectBeacon(path, ''), false);
    assert.ok(readFileSync(path, 'utf8').includes(BEACON_PLACEHOLDER));
  });
});

// A value that is not a beacon token would be substituted into a string literal in a
// script every visitor runs, so it is refused rather than shipped.
test('a malformed variable stops the release instead of shipping it', () => {
  withTemp((dir) => {
    const path = loaderIn(dir);
    assert.throws(() => injectBeacon(path, "'); alert(1); //"), /malformed/);
    assert.ok(readFileSync(path, 'utf8').includes(BEACON_PLACEHOLDER));
  });
});

test('a loader with nowhere to put the token stops the release', () => {
  withTemp((dir) => {
    const path = join(dir, 'analytics.js');
    writeFileSync(path, "var TOKEN = 'already-something-else';\n");
    assert.throws(() => injectBeacon(path, REAL_TOKEN), /placeholder/);
  });
});

// Two artifacts that drift in silence: the worker substitutes a literal the shipped
// loader must actually contain, and a rename on either side leaves every release
// shipping a loader that no-ops with analytics configured.
test('the placeholder the worker substitutes is the one the shipped loader carries', () => {
  const loader = readFileSync(new URL(`../../../../../../${ANALYTICS_FILE}`, import.meta.url), 'utf8');
  assert.ok(loader.includes(BEACON_PLACEHOLDER), `${ANALYTICS_FILE} does not carry ${BEACON_PLACEHOLDER}`);
});

// The park lane is chosen from wrangler's own output, and the two lanes mean different
// things to whoever opens the item: one is a five-second settings fix, the other is a
// trace to read.
test('Cloudflare refusals route to the human-action lane', () => {
  assert.equal(isOperatorFailure('✘ [ERROR] A request to the Cloudflare API failed. [code: 10000] Authentication error'), true);
  assert.equal(isOperatorFailure('Could not find zone for claudinite.com'), true);
  assert.equal(isOperatorFailure('✘ [ERROR] Build failed with 1 error: unexpected token'), false);
  assert.equal(isOperatorFailure(''), false);
  assert.equal(isOperatorFailure(undefined), false);
});

// The patch is a monotonic counter rather than a per-day one, so two releases either
// side of midnight cannot land on the same version.
test('the version advances across a day rollover', () => {
  const eve = nextVersion('1.0903.57', new Date('2026-09-03T20:00:00Z'));
  const morning = nextVersion(eve, new Date('2026-09-04T20:00:00Z'));
  assert.equal(eve, '1.0903.58');
  assert.equal(morning, '1.0904.59');
});

test('an unparseable recorded version still yields a first release', () => {
  assert.equal(nextVersion('1.0.0', new Date('2026-09-04T20:00:00Z')), '1.0904.1');
  assert.equal(nextVersion(undefined, new Date('2026-09-04T20:00:00Z')), '1.0904.1');
});

test('the stamp rewrites the footer tooltip and leaves a page without one alone', () => {
  const page = '<p class="copyright" title="version 1.0903.57">© 2026</p>';
  assert.equal(stampHtml(page, '1.0904.58'), '<p class="copyright" title="version 1.0904.58">© 2026</p>');
  assert.equal(stampHtml('<p>no footer here</p>', '1.0904.58'), '<p>no footer here</p>');
});
