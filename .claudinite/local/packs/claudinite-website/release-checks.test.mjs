// Fixtures for the release mechanism's declared checks. The bar: a violating input
// must produce a finding, a clean one must produce none — proved on the compiled
// declarations against synthetic contexts, never on the live repo, whose content is
// exactly what these rules are there to keep true.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadDeclaredChecks } from '../../../shared/engine/checks/helpers/pattern-rules.mjs';

const rules = loadDeclaredChecks(dirname(fileURLToPath(import.meta.url)));
const ruleFor = (id) => {
  const rule = rules.find((r) => r.id === `claudinite-website/${id}`);
  assert.ok(rule, `no declared check named claudinite-website/${id}`);
  return rule;
};

const ctxWith = (files) => ({
  mode: 'all',
  tracked: Object.keys(files),
  files: Object.keys(files),
  allFiles: Object.keys(files),
  read: (p) => (p in files ? files[p] : null),
  // `requirePaths` asks the tree directly, and the scan is shared across the pack's
  // rules — so every context one of them is run against carries this.
  exists: (p) => p in files,
});

const wrangler = (over = {}) => JSON.stringify({
  name: 'claudinite-website',
  compatibility_date: '2026-09-08',
  assets: { directory: './site' },
  ...over,
});

const TASK = '.claudinite/local/packs/claudinite-website/tasks/site-release/task.json';
const declaration = (over = {}) => JSON.stringify({
  id: 'site-release',
  on_interrupt: 'needs-human',
  code_work_required_secrets: ['CLOUDFLARE_API_TOKEN', 'CLOUDFLARE_ACCOUNT_ID'],
  ...over,
});

const whatOf = (found) => found.map((f) => f.what).join(' | ');

// --- release-publishes-only-the-site ----------------------------------------

test('fires when the upload is pointed anywhere but site/', () => {
  const rule = ruleFor('release-publishes-only-the-site');
  const found = rule.run(ctxWith({ 'wrangler.json': wrangler({ assets: { directory: './' } }) }));
  assert.equal(found.length, 1);
  assert.match(found[0].what, /does not upload \.\/site/);
});

test('fires when a Worker script is added behind the static site', () => {
  const rule = ruleFor('release-publishes-only-the-site');
  const found = rule.run(ctxWith({ 'wrangler.json': wrangler({ main: 'src/index.js' }) }));
  assert.equal(found.length, 1);
  assert.match(found[0].what, /Worker script/);
});

test('fires when the runtime is left to whatever the deploy day defaults to', () => {
  const rule = ruleFor('release-publishes-only-the-site');
  const bare = JSON.stringify({ name: 'claudinite-website', assets: { directory: './site' } });
  const found = rule.run(ctxWith({ 'wrangler.json': bare }));
  assert.equal(found.length, 1);
  assert.match(found[0].what, /compatibility_date/);
});

// The parsed family asserts nothing about a file that is absent, so without this the
// whole check would go silent the moment its subject was deleted.
test('fires when the deploy target is gone entirely', () => {
  const rule = ruleFor('release-publishes-only-the-site');
  const found = rule.run(ctxWith({ 'site/index.html': '<p>hi</p>' }));
  assert.equal(found.length, 1);
  assert.match(found[0].what, /wrangler\.json is gone/);
});

test('stays quiet on a wrangler.json that publishes site/ and nothing else', () => {
  assert.deepEqual(ruleFor('release-publishes-only-the-site').run(ctxWith({ 'wrangler.json': wrangler() })), []);
});

// --- no-second-path-to-production -------------------------------------------

test('fires on a workflow that publishes through the Pages actions', () => {
  const rule = ruleFor('no-second-path-to-production');
  const yaml = ['jobs:', '  deploy:', '    steps:', '      - uses: actions/upload-pages-artifact@v4', ''].join('\n');
  const found = rule.run(ctxWith({ '.github/workflows/deploy.yml': yaml }));
  assert.equal(found.length, 1);
  assert.match(found[0].what, /publishes the site from a workflow/);
});

test('fires on a workflow that shells out to wrangler', () => {
  const rule = ruleFor('no-second-path-to-production');
  const yaml = ['jobs:', '  ship:', '    steps:', '      - run: npx wrangler@4.128.0 deploy', ''].join('\n');
  assert.equal(rule.run(ctxWith({ '.github/workflows/ship.yaml': yaml })).length, 1);
});

test('fires on the wrangler marketplace action too', () => {
  const rule = ruleFor('no-second-path-to-production');
  const yaml = ['    steps:', '      - uses: cloudflare/wrangler-action@v3', ''].join('\n');
  assert.equal(rule.run(ctxWith({ '.github/workflows/ship.yml': yaml })).length, 1);
});

// A workflow explaining why it must not publish is exactly where a naive scan trips
// over its own reasoning.
test('stays quiet on a comment saying not to publish from a workflow', () => {
  const rule = ruleFor('no-second-path-to-production');
  const yaml = ['# Never add a `wrangler deploy` step here — the release is a task.', 'jobs: {}', ''].join('\n');
  assert.deepEqual(rule.run(ctxWith({ '.github/workflows/ci.yml': yaml })), []);
});

test('stays quiet outside .github/workflows', () => {
  const rule = ruleFor('no-second-path-to-production');
  const worker = "execFileSync('npx', ['--yes', WRANGLER, 'deploy']);\n";
  assert.deepEqual(rule.run(ctxWith({ 'tasks/site-release/worker.mjs': worker })), []);
});

// --- release-declares-its-credentials ---------------------------------------

test('fires on each Cloudflare credential the declaration drops', () => {
  const rule = ruleFor('release-declares-its-credentials');
  const found = rule.run(ctxWith({ [TASK]: declaration({ code_work_required_secrets: [] }) }));
  assert.equal(found.length, 2);
  assert.match(whatOf(found), /CLOUDFLARE_API_TOKEN/);
  assert.match(whatOf(found), /CLOUDFLARE_ACCOUNT_ID/);
});

test('fires when an interrupted release would be silently re-executed', () => {
  const rule = ruleFor('release-declares-its-credentials');
  const found = rule.run(ctxWith({ [TASK]: declaration({ on_interrupt: 'requeue' }) }));
  assert.equal(found.length, 1);
  assert.match(found[0].what, /on_interrupt/);
});

test('stays quiet on a declaration carrying both credentials and the one-shot guard', () => {
  assert.deepEqual(ruleFor('release-declares-its-credentials').run(ctxWith({ [TASK]: declaration() })), []);
});

test('stays quiet on another task\'s declaration', () => {
  const rule = ruleFor('release-declares-its-credentials');
  const other = '.claudinite/local/packs/claudinite-website/tasks/site-stats/task.json';
  assert.deepEqual(rule.run(ctxWith({ [other]: JSON.stringify({ id: 'site-stats' }) })), []);
});

// --- analytics-token-stays-uninjected ---------------------------------------

test('fires when the placeholder has been replaced in the committed loader', () => {
  const rule = ruleFor('analytics-token-stays-uninjected');
  const injected = "var TOKEN = '4f8b21ce9a7d4e0fb3c65a1d2e7f9081';\n";
  const found = rule.run(ctxWith({ 'site/assets/analytics.js': injected }));
  assert.equal(found.length, 1);
  assert.match(found[0].what, /placeholder/);
});

test('stays quiet while the loader still ships its placeholder', () => {
  const rule = ruleFor('analytics-token-stays-uninjected');
  const clean = "var TOKEN = 'REPLACE_WITH_CLOUDFLARE_WEB_ANALYTICS_TOKEN';\n";
  assert.deepEqual(rule.run(ctxWith({ 'site/assets/analytics.js': clean })), []);
});

// --- release-contract-carries-its-description -------------------------------

const workWith = (changedFiles) => ({
  ctx: ctxWith({}),
  changedFiles,
  addedLines: () => [],
  untracked: [],
});

test('fires when the release contract changes and the site README does not', () => {
  const rule = ruleFor('release-contract-carries-its-description');
  const found = rule.run(workWith(['wrangler.json', 'site/index.html']));
  assert.equal(found.length, 1);
  assert.equal(found[0].file, 'wrangler.json');
});

test('fires on the declaration half of the contract too', () => {
  const rule = ruleFor('release-contract-carries-its-description');
  assert.equal(rule.run(workWith([TASK])).length, 1);
});

test('stays quiet when the description changed with the contract', () => {
  const rule = ruleFor('release-contract-carries-its-description');
  assert.deepEqual(rule.run(workWith(['wrangler.json', 'site/README.md'])), []);
});

test('stays quiet on a change that touches neither', () => {
  const rule = ruleFor('release-contract-carries-its-description');
  assert.deepEqual(rule.run(workWith(['site/assets/style.css'])), []);
});
