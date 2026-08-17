// Fixture for claudinite-website/no-conflict-markers. The bar: a violating
// input must produce a finding, a clean one must produce none — proved on the
// compiled declaration against a synthetic context, not on the live repo (whose
// content is exactly what the rule is there to keep clean).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadDeclaredChecks } from '../../../shared/engine/checks/helpers/pattern-rules.mjs';

const rule = loadDeclaredChecks(dirname(fileURLToPath(import.meta.url)))
  .find((r) => r.id === 'claudinite-website/no-conflict-markers');

// The markers are assembled rather than written out: a marker at the start of a
// line in this file would be a real violation of the rule the file tests.
const OURS = `${'<'.repeat(7)} HEAD`;
const BASE = `${'|'.repeat(7)} merged common ancestors`;
const THEIRS = `${'>'.repeat(7)} 2e8914e (Claudinite growth: extract lessons)`;
const RULES = '.claudinite/local/packs/claudinite-website/RULES.md';

const ctxWith = (files) => ({
  mode: 'all',
  tracked: Object.keys(files),
  files: Object.keys(files),
  allFiles: Object.keys(files),
  read: (p) => (p in files ? files[p] : null),
});

const conflicted = (...markers) => [
  '# claudinite-website',
  '',
  markers[0],
  '- a rule the dedup pass kept',
  '=======',
  '- a rule the extract pass added',
  ...markers.slice(1),
  '',
].join('\n');

test('fires on every conflict marker left in a scanned file', () => {
  const found = rule.run(ctxWith({ [RULES]: conflicted(OURS, THEIRS) }));
  assert.equal(found.length, 2);
  assert.equal(found[0].rule, 'claudinite-website/no-conflict-markers');
  assert.equal(found[0].file, RULES);
  assert.equal(found[0].line, 3);
  assert.equal(found[1].line, 7);
  assert.match(found[0].what, /merge-conflict marker/);
});

test('fires on the leftover marker that survived a rebase --continue', () => {
  const trailing = ['- a rule the extract pass added', THEIRS, ''].join('\n');
  const found = rule.run(ctxWith({ [RULES]: trailing }));
  assert.equal(found.length, 1);
  assert.equal(found[0].line, 2);
});

test('fires on the diff3 base marker too', () => {
  const found = rule.run(ctxWith({ [RULES]: conflicted(OURS, BASE, THEIRS) }));
  assert.equal(found.length, 3);
});

test('fires in any scanned file, not just markdown', () => {
  const found = rule.run(ctxWith({ 'site/data/promoted.js': `const a = 1;\n${THEIRS}\n` }));
  assert.equal(found.length, 1);
  assert.equal(found[0].file, 'site/data/promoted.js');
});

test('stays quiet on a setext heading underline', () => {
  const setext = ['Rules', '=======', '', 'A heading, not a conflict separator.', ''].join('\n');
  assert.deepEqual(rule.run(ctxWith({ [RULES]: setext })), []);
});

test('stays quiet on a marker named mid-line in prose', () => {
  const prose = `Delete the \`${OURS}\` line before staging.\n`;
  assert.deepEqual(rule.run(ctxWith({ [RULES]: prose })), []);
});

test('stays quiet on a run of the same characters with no conflict label', () => {
  const banner = ['/* <<<<<<<<<<<<<<< */', '>>>>>>>', '', 'code();', ''].join('\n');
  assert.deepEqual(rule.run(ctxWith({ 'site/data/promoted.js': banner })), []);
});

test('stays quiet on a clean file', () => {
  const clean = ['# claudinite-website', '', '- a rule', ''].join('\n');
  assert.deepEqual(rule.run(ctxWith({ [RULES]: clean })), []);
});
