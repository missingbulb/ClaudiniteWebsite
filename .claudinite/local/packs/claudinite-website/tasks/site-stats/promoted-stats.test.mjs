import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { applyStats, canonRepoUrl, STAT_LABELS } from './promoted-stats.mjs';

const REPO_ROOT = join(import.meta.dirname, '..', '..', '..', '..', '..', '..');
const PROMOTED = readFileSync(join(REPO_ROOT, 'site', 'data', 'promoted.js'), 'utf8');

const COUNTS = { packs: 40, checks: 100, skills: 41, tasks: 25 };

test('the canon repo is read from the page rather than carried here', () => {
  assert.equal(canonRepoUrl(PROMOTED), 'https://github.com/missingbulb/Claudinite');
  assert.equal(canonRepoUrl('no declaration here'), null);
});

// Against the REAL file, not a fixture: a fixture spelling the shape this code
// expects only proves the two agree with each other. The page is what it has to
// rewrite, so the page is what the test drives it over.
test('every stat on the live page is found and substituted', () => {
  const { text, changed, missing } = applyStats(PROMOTED, COUNTS);
  assert.deepEqual(missing, []);
  assert.ok(changed);
  for (const [key, label] of Object.entries(STAT_LABELS)) {
    assert.match(text, new RegExp(`n: '${COUNTS[key]}', label: '${label}'`));
  }
});

test('nothing outside the four numbers is touched', () => {
  const { text } = applyStats(PROMOTED, COUNTS);
  const strip = (s) => s.replace(/n: '[^']*'/g, "n: 'N'");
  assert.equal(strip(text), strip(PROMOTED));
});

test('a recount that matches the page changes nothing', () => {
  const { text } = applyStats(PROMOTED, COUNTS);
  const again = applyStats(text, COUNTS);
  assert.equal(again.changed, false);
  assert.equal(again.text, text);
});

test('a label someone removed is reported, never appended back', () => {
  const withoutSkills = PROMOTED.replace(/\n\s*\{ n: '[^']*', label: 'skills on demand' \},/, '');
  assert.ok(!withoutSkills.includes('skills on demand'));
  const { text, missing } = applyStats(withoutSkills, COUNTS);
  assert.deepEqual(missing, ['skills on demand']);
  assert.ok(!text.includes('skills on demand'));
  // The other three are still maintained — one rewritten entry is not a reason to
  // stop updating the rest.
  assert.match(text, new RegExp(`n: '${COUNTS.packs}', label: '${STAT_LABELS.packs}'`));
});

test('the rewritten page is still a loadable plain script', async () => {
  const { text } = applyStats(PROMOTED, COUNTS);
  const scope = { window: {} };
  // eslint-disable-next-line no-new-func -- the page is a plain script by contract; running it is the assertion
  new Function('window', text)(scope.window);
  assert.deepEqual(
    scope.window.CLAUDINITE.stats.map((s) => s.n),
    [COUNTS.packs, COUNTS.checks, COUNTS.skills, COUNTS.tasks].map(String),
  );
});
