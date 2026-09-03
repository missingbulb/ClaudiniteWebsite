// site-stats — recount the canon and land the four numbers the site promotes.
//
// The whole run is deterministic: clone the canon the site names, count, substitute,
// deliver. Nothing here is a judgment call, which is why the task runs no agent.
//
// Idempotence is the property that keeps this quiet: the counts are a pure function
// of the canon at HEAD, and they are compared against the BASE TIP's copy of the file
// rather than the working tree, so a week in which the canon gained nothing countable
// opens no PR at all.

import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
// The long reach into the mount is deliberate, and file-placement flags it as such.
// Landing a PR under a member's delivery settings is claudinite-tasks' to own — it
// is the same library the canon's own agentless tasks call — and a local copy of it
// here would be a second implementation of the one thing that must not have two.
import { deliverGenerated, baseTip, readAt, remoteUrl } from '../../../../../shared/packs/claudinite-tasks/deliver-generated.mjs';
import { countCanonStats } from './count-canon-stats.mjs';
import { applyStats, canonRepoUrl, STAT_LABELS } from './promoted-stats.mjs';

// Exported for the declaration's drift guard: `task.json` cannot import this — it is
// a pure data literal by design — so its automerge scope carries a copy of the
// folder, and task.test.mjs asserts the copy still contains this path.
export const PROMOTED_PATH = 'site/data/promoted.js';
const PR_BRANCH_PREFIX = 'claudinite/site-stats';

const log = (m) => console.log(`site-stats: ${m}`);

const git = (cwd, args) => execFileSync('git', ['-C', cwd, ...args], {
  encoding: 'utf8',
  maxBuffer: 64 * 1024 * 1024,
});

// A shallow single-branch clone of the canon: history and tags carry nothing this
// count reads, and the tree alone is an order of magnitude smaller than the repo.
function cloneCanon(url) {
  const dir = mkdtempSync(join(tmpdir(), 'claudinite-canon-'));
  execFileSync('git', ['clone', '--depth', '1', '--single-branch', '--no-tags', '--quiet', url, dir], {
    encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
  });
  return dir;
}

// Everything under `packs/`, read from the tree rather than walked on disk — the
// same listing shape `countCanonStats` takes from a fixture.
const packPaths = (dir) => git(dir, ['ls-tree', '-r', '--name-only', 'HEAD', '--', 'packs'])
  .split('\n').filter(Boolean);

const showOrNull = (dir, path) => {
  try { return git(dir, ['show', `HEAD:${path}`]); } catch { return null; }
};

export async function main() {
  const root = process.env.CLAUDINITE_REPO_ROOT || process.cwd();
  const repo = process.env.CLAUDINITE_REPO || process.env.GITHUB_REPOSITORY;
  const token = process.env.GITHUB_TOKEN;
  const base = process.env.CLAUDINITE_DEFAULT_BRANCH || 'main';
  if (!repo) throw new Error('CLAUDINITE_REPO / GITHUB_REPOSITORY is not set (owner/repo)');
  if (!token) throw new Error('GITHUB_TOKEN is not set — the recount cannot read the base or deliver its PR');

  const baseSha = baseTip(root, remoteUrl(repo, token), base);
  const promoted = readAt(root, baseSha, PROMOTED_PATH);
  if (promoted === null) {
    console.error(`claudinite-needs-human: decision — ${PROMOTED_PATH} does not exist on ${base}; the page this task maintains has moved or gone`);
    throw new Error(`${PROMOTED_PATH} is absent from ${base}`);
  }

  // The site names its own canon, so the address lives in one place and this task
  // follows it rather than carrying a second copy.
  const canonUrl = canonRepoUrl(promoted);
  if (!canonUrl) {
    console.error(`claudinite-needs-human: decision — ${PROMOTED_PATH} no longer declares a canonRepo, so there is nothing to count`);
    throw new Error(`no canonRepo in ${PROMOTED_PATH}`);
  }

  let canon;
  try {
    canon = cloneCanon(`${canonUrl.replace(/\.git$/, '')}.git`);
    const directory = showOrNull(canon, 'packs/directory.GENERATED.md');
    if (!directory) throw new Error('the canon carries no packs/directory.GENERATED.md');
    const paths = packPaths(canon);
    const counts = countCanonStats({
      directory,
      readme: (pack) => showOrNull(canon, `packs/${pack}/README.md`),
      paths,
    });

    const { text, changed, missing } = applyStats(promoted, counts);
    if (missing.length) {
      console.error('claudinite-needs-human: decision — '
        + `${PROMOTED_PATH} no longer carries a stat labelled ${missing.map((l) => `"${l}"`).join(', ')}; `
        + 'decide whether this task should still maintain the block someone rewrote');
      throw new Error(`stat label(s) missing: ${missing.join(', ')}`);
    }

    log(`counted ${counts.packs} packs, ${counts.checks} checks, ${counts.skills} skills, ${counts.tasks} tasks`);
    if (!changed) {
      log('the page already states all four — nothing to deliver');
      return;
    }

    const moved = Object.entries(STAT_LABELS)
      .map(([key, label]) => `- **${counts[key]}** ${label}`).join('\n');
    const pr = await deliverGenerated({
      root, repo, base, token, log,
      stamp: new Date().toISOString().slice(0, 10),
      branchPrefix: PR_BRANCH_PREFIX,
      files: { [PROMOTED_PATH]: text },
      message: 'site: recount the canon-wide stats',
      title: 'site: recount the canon-wide stats',
      body: [
        `Recounted the four canon-wide figures in \`${PROMOTED_PATH}\` against`,
        `${canonUrl} at its current head:`,
        '',
        moved,
        '',
        'The pack count is the row count of the canon\'s `packs/directory.GENERATED.md`,',
        'which is the adoptable pack set — a pack absent from it (a `hidden` one) is',
        'absent on purpose. Per pack, the checks are its README\'s table rows whose',
        'enforcement cell reads `check:`, and the skills and tasks are its `skills/`',
        'and `tasks/` directory entries.',
        '',
        'Only the four numbers change; the rest of the file, the spotlight included, is',
        'substituted around. A week whose recount matches the page opens no PR.',
      ].join('\n'),
    });
    log(`${pr.reused ? 'updated' : 'opened'} PR ${pr.number !== null ? `#${pr.number}` : `on ${pr.branch}`}`
      + `${pr.merged ? ' (landed)' : pr.delivery === 'review' ? ' (left for review)' : ''}`);
  } finally {
    if (canon) rmSync(canon, { recursive: true, force: true });
  }
}

// Run only when invoked directly (code-work's `node worker.mjs`), never on import.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => { console.error(`site-stats failed: ${e.message}`); process.exit(1); });
}
