// Fixture for claudinite-website/site-external-asset-claims. The bar: a
// violating input must produce a finding and a clean one must produce none —
// proved on the rule's own `run` against a synthetic site tree, never on the
// live `site/` (whose content is exactly what the rule is there to keep true).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import rule from './site-external-asset-claims.mjs';

function ctxWith(files) {
  const paths = Object.keys(files);
  return { tracked: paths, files: paths, read: (p) => (p in files ? files[p] : null) };
}

// The real regression: the stylesheet header still saying "No external assets"
// after the analytics beacon landed (#36).
const BEACON_JS = `// Cloudflare Web Analytics loader.
(function () {
  var beacon = document.createElement('script');
  beacon.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  document.head.appendChild(beacon);
})();
`;

const STALE_CSS = `/* claudinite.com — design system.
   No external assets, no webfonts, no frameworks. */
:root { --paper: #faf8f4; }
`;

const HONEST_CSS = `/* claudinite.com — design system.
   No webfonts, no frameworks; the only external asset is the cookieless
   analytics beacon (see assets/analytics.js, privacy.html). */
:root { --paper: #faf8f4; }
`;

const PAGE = `<!doctype html>
<html><head>
<link rel="canonical" href="https://claudinite.com/">
<link rel="stylesheet" href="assets/style.css">
</head><body>
<a href="https://github.com/missingbulb/Claudinite" rel="noopener">The canon</a>
<script defer src="assets/analytics.js"></script>
</body></html>
`;

test('fires on a stale "No external assets" header once a beacon ships', () => {
  const found = rule.run(ctxWith({
    'site/index.html': PAGE,
    'site/assets/style.css': STALE_CSS,
    'site/assets/analytics.js': BEACON_JS,
  }));
  assert.equal(found.length, 1);
  assert.equal(found[0].rule, 'claudinite-website/site-external-asset-claims');
  assert.equal(found[0].severity, 'blocking');
  assert.equal(found[0].file, 'site/assets/style.css');
  assert.equal(found[0].line, 2);
  assert.match(found[0].what, /static\.cloudflareinsights\.com/);
  assert.match(found[0].fix, /same commit/);
});

test('fires on an off-origin script tag in the markup', () => {
  const html = PAGE.replace(
    '<script defer src="assets/analytics.js"></script>',
    '<script src="https://cdn.example.com/widget.js"></script>',
  );
  const found = rule.run(ctxWith({
    'site/index.html': html,
    'site/README.md': 'The site ships no third-party scripts.\n',
  }));
  assert.equal(found.length, 1);
  assert.equal(found[0].file, 'site/README.md');
});

test('fires on an off-origin webfont pulled in by CSS', () => {
  const css = '@import "https://fonts.example.com/inter.css";\n:root { --paper: #fff; }\n';
  const found = rule.run(ctxWith({
    'site/assets/style.css': css,
    'site/privacy.html': '<p>This site loads no external resources whatsoever.</p>\n',
  }));
  assert.equal(found.length, 1);
  assert.match(found[0].what, /fonts\.example\.com/);
});

test('fires on a protocol-relative preload link', () => {
  const html = '<link rel="preload" as="font" href="//cdn.example.com/f.woff2">\n';
  const found = rule.run(ctxWith({
    'site/index.html': html,
    'site/assets/style.css': '/* No external assets. */\n',
  }));
  assert.equal(found.length, 1);
});

test('reports every standing absolute, not just the first', () => {
  const found = rule.run(ctxWith({
    'site/assets/analytics.js': BEACON_JS,
    'site/assets/style.css': STALE_CSS,
    'site/README.md': 'Static, hand-authored: no third-party assets.\n',
  }));
  assert.equal(found.length, 2);
  assert.deepEqual(found.map((f) => f.file).sort(), ['site/README.md', 'site/assets/style.css']);
});

test('stays quiet when the claim is qualified to match reality', () => {
  assert.deepEqual(rule.run(ctxWith({
    'site/index.html': PAGE,
    'site/assets/style.css': HONEST_CSS,
    'site/assets/analytics.js': BEACON_JS,
  })), []);
});

test('stays quiet on an "except" concession in the same sentence', () => {
  assert.deepEqual(rule.run(ctxWith({
    'site/assets/analytics.js': BEACON_JS,
    'site/privacy.html': '<p>There are no external assets except the analytics beacon.</p>\n',
  })), []);
});

test('stays quiet on a concession that precedes the absolute', () => {
  assert.deepEqual(rule.run(ctxWith({
    'site/assets/analytics.js': BEACON_JS,
    'site/privacy.html': '<p>Aside from the beacon, no external assets are loaded.</p>\n',
  })), []);
});

test('stays quiet on an absolute when the site really loads nothing off-origin', () => {
  assert.deepEqual(rule.run(ctxWith({
    'site/index.html': PAGE,
    'site/assets/style.css': STALE_CSS,
    'site/assets/analytics.js': "(function () { var t = 'REPLACE_ME'; }());\n",
  })), []);
});

test('an <a href> and a canonical link are not asset loads', () => {
  assert.deepEqual(rule.run(ctxWith({
    'site/index.html': PAGE,
    'site/assets/style.css': STALE_CSS,
  })), []);
});

test('a commented-out beacon is not a load', () => {
  const commented = `// beacon.src = 'https://static.cloudflareinsights.com/beacon.min.js';
/* var other = { src: 'https://cdn.example.com/x.js' }; */
(function () { return 1; }());
`;
  assert.deepEqual(rule.run(ctxWith({
    'site/assets/analytics.js': commented,
    'site/assets/style.css': STALE_CSS,
  })), []);
});

test('the // in an https URL is not read as a line comment', () => {
  const found = rule.run(ctxWith({
    'site/assets/analytics.js': "el.src = 'https://cdn.example.com/x.js'; var after = 1;\n",
    'site/assets/style.css': STALE_CSS,
  }));
  assert.equal(found.length, 1);
  assert.match(found[0].what, /cdn\.example\.com/);
});

test('says nothing about the cookie and tracking absolutes it cannot decide', () => {
  assert.deepEqual(rule.run(ctxWith({
    'site/assets/analytics.js': BEACON_JS,
    'site/privacy.html': '<p>No cookies, no personal data, no cross-site tracking.</p>\n',
  })), []);
});

test('ignores files outside site/', () => {
  assert.deepEqual(rule.run(ctxWith({
    'README.md': 'This repo vendors no third-party assets.\n',
    'scripts/x.mjs': "el.src = 'https://cdn.example.com/x.js';\n",
  })), []);
});
