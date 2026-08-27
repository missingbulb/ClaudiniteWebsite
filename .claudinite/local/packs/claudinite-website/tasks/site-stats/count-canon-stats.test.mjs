import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countCanonStats, packsFromDirectory, checksInReadme, subdirsOf } from './count-canon-stats.mjs';

// The directory's real shape: a prose preamble, a header, a separator, then one row
// per pack. `claudinite-canary-repo` is deliberately absent — it declares
// `hidden: true` in the canon and is not adoptable.
const DIRECTORY = `# Claudinite packs — the full directory

Every pack this repo can adopt from Claudinite.

| Pack | What it covers | Not this pack | Activation | Requires |
|---|---|---|---|---|
| \`basics\` | working discipline | tech-specific content | seeded | — |
| \`barriers\` | folder-access graph rules | file placement | declared by hand | — |
| \`claudinite-tasks\` | scheduled work | authoring a task | seeded | — |
| \`ios\` | app-target conventions | shipping builds | fingerprinted | — |
`;

test('the pack set is the directory\'s rows, so a pack absent from it is not counted', () => {
  assert.deepEqual(packsFromDirectory(DIRECTORY), ['basics', 'barriers', 'claudinite-tasks', 'ios']);
  assert.ok(!packsFromDirectory(DIRECTORY).includes('claudinite-canary-repo'));
});

test('a check is a row stating `check:`, whatever the section and columns are called', () => {
  // The standard shape.
  assert.equal(checksInReadme(`## Checks

| Check | Severity | Reason | Enforcement |
|---|---|---|---|
| \`markdown-link-labels\` | low | complexity | check: blocking |
| \`file-placement\` | medium | complexity | check: advisory |
`), 2);

  // barriers: the section is called "The check", not "Checks".
  assert.equal(checksInReadme(`## The check

| Check | Severity | Reason | Enforcement |
|---|---|---|---|
| \`barrier\` | high | complexity | check: blocking |
`), 1);

  // claudinite-tasks: the columns are headed Rule/Confidence/Dimension.
  assert.equal(checksInReadme(`## Checks

| Rule | Confidence | Dimension | Enforcement |
|---|---|---|---|
| \`task-declaration-shape\` | high | correctness | check: blocking |
| \`task-code-work-env\` | high | correctness | check: blocking |
`), 2);

  // claudinite-lifecycle: two separate check tables under one section.
  assert.equal(checksInReadme(`## Checks

| Check | Severity | Reason | Enforcement |
|---|---|---|---|
| \`rules-index-current\` | critical | correctness | check: blocking |

The adoption skills bundle two more:

| Check | Severity | Reason | Enforcement |
|---|---|---|---|
| \`adoption-answers-pending\` | medium | complexity | check: blocking |
| \`interview-answer-stale\` | low | complexity | check: advisory |
`), 3);
});

test('a table of something other than checks is not counted', () => {
  // tidy-repo's maintenance-task table: backticked first cell, no `check:` cell.
  assert.equal(checksInReadme(`## Maintenance tasks

| Task | Cadence | Fires when |
|---|---|---|
| \`tidy-issues\` | daily | an issue was touched |
| \`tidy-prs\` | weekly | always |
`), 0);
});

test('a pack with no README contributes nothing rather than throwing', () => {
  assert.equal(checksInReadme(null), 0);
});

test('skills and tasks are the directory entries, counted once each', () => {
  const paths = [
    'packs/basics/skills/do-later/SKILL.md',
    'packs/basics/skills/do-later/reference.md',   // a second file in one skill
    'packs/basics/skills/writing-tests/SKILL.md',
    'packs/basics/tasks/ci-performance/task.mjs',
    'packs/basics/tasks/ci-performance/worker.mjs',
    'packs/basics/RULES.md',
    'packs/barriers/worldRules/check.mjs',
  ];
  assert.equal(subdirsOf(paths, 'basics', 'skills'), 2);
  assert.equal(subdirsOf(paths, 'basics', 'tasks'), 1);
  assert.equal(subdirsOf(paths, 'barriers', 'skills'), 0);
});

test('a pack name that prefixes another is not counted into it', () => {
  const paths = [
    'packs/claudinite-tasks/tasks/usage-fold/task.mjs',
    'packs/claudinite-tasks-extra/tasks/other/task.mjs',
  ];
  assert.equal(subdirsOf(paths, 'claudinite-tasks', 'tasks'), 1);
});

test('the four totals sum the directory\'s packs and nothing else', () => {
  const readmes = {
    basics: `| Check | Severity | Reason | Enforcement |
|---|---|---|---|
| \`a\` | low | complexity | check: blocking |
| \`b\` | low | complexity | check: advisory |
`,
    barriers: `## The check

| Check | Severity | Reason | Enforcement |
|---|---|---|---|
| \`barrier\` | high | complexity | check: blocking |
`,
    'claudinite-tasks': `| Rule | Confidence | Dimension | Enforcement |
|---|---|---|---|
| \`task-declaration-shape\` | high | correctness | check: blocking |
`,
    // ios is prose-only: no README at all.
  };
  const paths = [
    'packs/basics/skills/do-later/SKILL.md',
    'packs/basics/skills/writing-tests/SKILL.md',
    'packs/basics/tasks/ci-performance/task.mjs',
    'packs/claudinite-tasks/tasks/usage-fold/task.mjs',
    'packs/claudinite-tasks/tasks/task-janitor/task.mjs',
    'packs/ios/RULES.md',
    // A pack outside the directory contributes nothing, even with content on disk.
    'packs/claudinite-canary-repo/tasks/probe/task.mjs',
  ];
  const counts = countCanonStats({ directory: DIRECTORY, readme: (p) => readmes[p] ?? null, paths });
  assert.equal(counts.packs, 4);
  assert.equal(counts.checks, 4);
  assert.equal(counts.skills, 2);
  assert.equal(counts.tasks, 3);
  assert.deepEqual(counts.perPack.find((p) => p.pack === 'ios'), { pack: 'ios', checks: 0, skills: 0, tasks: 0 });
});
