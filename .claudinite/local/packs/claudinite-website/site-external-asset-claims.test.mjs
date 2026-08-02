// Fixture for claudinite-website/site-external-asset-claims. The bar: a
// violating input must produce a finding, a clean one must produce none —
// proved on the rule's own `run` against a synthetic site tree, never on the
// live repo (whose content is what the rule exists to keep honest).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import rule, { offOriginLoads } from './site-external-asset-claims.mjs';

const CLAIM_CSS = `/* claudinite.com — design system.
   No external assets, no webfonts, no frameworks. */
:root { --paper: #faf8f4; }
`;

const RECONCILED_CSS = `/* claudinite.com — design system.
   No webfonts, no frameworks; the only external asset is the cookieless
   analytics beacon (see assets/analytics.js, privacy.html). */
:root { --paper: #faf8f4; }
`;

const PLAIN_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<link rel="canonical" href="https://claudinite.com/">
<meta property="og:url" content="https://claudinite.com/">
<link rel="stylesheet" href="assets/style.css">
</head>
<body>
<p>Read about <a href="https://www.cloudflare.com/web-analytics/" rel="noopener">Cloudflare</a>.</p>
<!-- an example in a comment: <script src="https://cdn.example.com/x.js"></script> -->
<script src="assets/analytics.js" defer></script>
</body>
</html>
`;

const CDN_HTML = PLAIN_HTML.replace(
  '<link rel="stylesheet" href="assets/style.css">',
  '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter">'
);

const BEACON_JS = `(function () {
  var beacon = document.createElement('script');
  beacon.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  document.head.appendChild(beacon);
})();
`;

const NOOP_JS = `// The loader bails out until the deploy injects a token, so nothing is
// requested — see https://developers.cloudflare.com/web-analytics/ for the docs.
(function () { return; })();
`;

function ctxWith(files) {
  const tracked = ['package.json', 'README.md', ...Object.keys(files)];
  return {
    tracked,
    files: tracked,
    read: (p) => (p in files ? files[p] : null),
  };
}

test('fires when a stylesheet header claims no external assets and the page loads a CDN stylesheet', () => {
  const found = rule.run(ctxWith({ 'site/index.html': CDN_HTML, 'site/assets/style.css': CLAIM_CSS }));
  assert.equal(found.length, 1);
  assert.equal(found[0].rule, 'claudinite-website/site-external-asset-claims');
  assert.equal(found[0].severity, 'blocking');
  assert.equal(found[0].file, 'site/assets/style.css');
  assert.equal(found[0].line, 2);
  assert.match(found[0].what, /fonts\.googleapis\.com/);
});

test('fires on the historical incident: the beacon lands in JS, the CSS header still says no external assets', () => {
  const found = rule.run(ctxWith({
    'site/index.html': PLAIN_HTML,
    'site/assets/style.css': CLAIM_CSS,
    'site/assets/analytics.js': BEACON_JS,
  }));
  assert.equal(found.length, 1);
  assert.match(found[0].what, /static\.cloudflareinsights\.com/);
  assert.match(found[0].fix, /same commit/);
});

test('fires on a prose claim in site/README.md too, not just code comments', () => {
  const found = rule.run(ctxWith({
    'site/README.md': 'The site is static: no third-party requests, no build step.\n',
    'site/assets/analytics.js': BEACON_JS,
  }));
  assert.equal(found.length, 1);
  assert.equal(found[0].file, 'site/README.md');
  assert.equal(found[0].line, 1);
});

test('fires once per standing claim so every stale copy is named', () => {
  const found = rule.run(ctxWith({
    'site/index.html': CDN_HTML,
    'site/assets/style.css': CLAIM_CSS,
    'site/privacy.html': '<meta name="description" content="No third-party assets are loaded.">\n',
  }));
  assert.equal(found.length, 2);
  assert.deepEqual(found.map((f) => f.file).sort(), ['site/assets/style.css', 'site/privacy.html']);
});

test('stays quiet when the claim stands and nothing off-origin is loaded', () => {
  assert.deepEqual(
    rule.run(ctxWith({ 'site/index.html': PLAIN_HTML, 'site/assets/style.css': CLAIM_CSS, 'site/assets/analytics.js': NOOP_JS })),
    []
  );
});

test('stays quiet when the claim was reconciled with the asset it now loads', () => {
  assert.deepEqual(
    rule.run(ctxWith({
      'site/index.html': PLAIN_HTML,
      'site/assets/style.css': RECONCILED_CSS,
      'site/assets/analytics.js': BEACON_JS,
    })),
    []
  );
});

test('stays quiet on the same claim outside site/', () => {
  assert.deepEqual(
    rule.run(ctxWith({ 'docs/notes.md': 'no external assets\n', 'site/assets/analytics.js': BEACON_JS })),
    []
  );
});

test('canonical links, og:url, anchors and commented-out examples are not loads', () => {
  assert.deepEqual(offOriginLoads('site/index.html', PLAIN_HTML), []);
});

test('a same-origin absolute URL is not an external asset', () => {
  const html = '<script src="https://claudinite.com/assets/main.js"></script>\n';
  assert.deepEqual(offOriginLoads('site/index.html', html), []);
});

test('a URL living only in a JS comment is not a load', () => {
  assert.deepEqual(offOriginLoads('site/assets/analytics.js', NOOP_JS), []);
});

test('a CSS @import and a url() to another host are loads', () => {
  const css = "@import 'https://cdn.example.com/reset.css';\nbody { background: url(https://img.example.com/p.png); }\n";
  assert.deepEqual(offOriginLoads('site/assets/style.css', css).map((l) => l.line), [1, 2]);
});

test('a fetch() to another host is a load', () => {
  const js = "async function go() { await fetch('https://api.example.com/v1/hit'); }\n";
  assert.deepEqual(offOriginLoads('site/assets/main.js', js).map((l) => l.url), ['https://api.example.com/v1/hit']);
});

test('an iframe embed is a load', () => {
  assert.equal(offOriginLoads('site/index.html', '<iframe src="https://www.youtube.com/embed/x"></iframe>\n').length, 1);
});
