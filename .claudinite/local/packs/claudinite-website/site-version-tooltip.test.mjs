// Fixture for claudinite-website/site-version-tooltip. The bar: a drifted or
// missing stamp must produce a finding, an aligned one must produce none —
// proved on the rule's own `run` against a synthetic context, not on the live
// repo (whose content is exactly what the rule is there to keep aligned).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import rule from './site-version-tooltip.mjs';

const VERSION = '1.0821.34';

function page(stamp) {
  return [
    '<footer class="footer">',
    '  <div class="wrap footer-meta">',
    stamp === null
      ? '    <p class="copyright">© 2026 MissingBulb</p>'
      : `    <p class="copyright" title="version ${stamp}">© 2026 MissingBulb</p>`,
    '  </div>',
    '</footer>',
  ].join('\n');
}

function ctxWith({ pages = {}, version = VERSION, tracked = null }) {
  const files = { 'package.json': JSON.stringify({ name: 'fixture', version }), ...pages };
  const paths = tracked ?? Object.keys(files);
  return { tracked: paths, files: paths, read: (p) => (p in files ? files[p] : null) };
}

test('silent when every stamped page matches package.json', () => {
  const found = rule.run(ctxWith({
    pages: { 'site/index.html': page(VERSION), 'site/privacy.html': page(VERSION) },
  }));
  assert.deepEqual(found, []);
});

test('fires on a page whose stamp has drifted behind package.json', () => {
  const found = rule.run(ctxWith({ pages: { 'site/index.html': page('1.0731.12') } }));
  assert.equal(found.length, 1);
  assert.equal(found[0].rule, 'claudinite-website/site-version-tooltip');
  assert.equal(found[0].file, 'site/index.html');
  assert.equal(found[0].line, 3);
  assert.match(found[0].what, /names version 1\.0731\.12, but package\.json says 1\.0821\.34/);
  assert.match(found[0].fix, /bump-version/);
});

test('fires on a page carrying the footer with no stamp at all', () => {
  const found = rule.run(ctxWith({ pages: { 'site/index.html': page(null) } }));
  assert.equal(found.length, 1);
  assert.match(found[0].what, /no version tooltip/);
});

test('fires on the unsubstituted placeholder a new page is authored with', () => {
  const found = rule.run(ctxWith({ pages: { 'site/about.html': page('REPLACE_WITH_SITE_VERSION') } }));
  assert.equal(found.length, 1);
  assert.equal(found[0].file, 'site/about.html');
});

test('ignores site pages that carry no footer copyright', () => {
  const found = rule.run(ctxWith({ pages: { 'site/embed.html': '<p>no footer here</p>' } }));
  assert.deepEqual(found, []);
});

test('ignores html outside site/', () => {
  const found = rule.run(ctxWith({ pages: { 'docs/old.html': page('0.0.1') } }));
  assert.deepEqual(found, []);
});

test('silent rather than noisy when package.json is unreadable', () => {
  const ctx = {
    tracked: ['site/index.html'],
    files: ['site/index.html'],
    read: (p) => (p === 'package.json' ? '{ not json' : page('9.9.9')),
  };
  assert.deepEqual(rule.run(ctx), []);
});
