// site-release — cut a version, publish site/ to Cloudflare, record the release.
//
// The whole run is deterministic: read the branch tip, advance the version, push that
// bump, upload the tree. Nothing here is a judgment call, which is why the task runs
// no agent — and, unlike the Pages deploy it replaces, nothing here is a marketplace
// action either: `wrangler deploy` is a CLI, so the release needs no workflow of its
// own and lives entirely in the queue.
//
// ORDER IS DELIBERATE: the bump lands on the branch BEFORE the upload. Either half
// can fail, and of the two possible drifts only one is silent — a site serving a
// version the repo has no record of. A consumed version number that never shipped is
// visible in the park and costs nothing; the next release simply takes the next one.

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
// The long reach into the mount is deliberate, and file-placement flags it as such:
// reading a branch tip without disturbing the executor's checkout is claudinite-tasks'
// to own, and a local copy of it would be a second implementation of the one thing
// that must not have two.
import { baseTip, readAt, remoteUrl } from '../../../../../shared/packs/claudinite-tasks/deliver-generated.mjs';
import { withTaskTrailer } from '../../../../../shared/packs/claudinite-tasks/task-trailer.mjs';
// The version scheme and the footer stamp have one home, and it is the script a person
// runs by hand to repair drift.
import { nextVersion, stampHtml } from '../../../../../../scripts/bump-version.mjs';

// Pinned rather than floating: a release that silently changes its own toolchain
// between two nights is a change nobody reviewed.
export const WRANGLER = 'wrangler@4.128.0';

// The Cloudflare Web Analytics beacon token is public — it ships in the client — so it
// rides a repo VARIABLE and is substituted into the copy being uploaded, never into
// the commit. `site/assets/analytics.js` carries this placeholder verbatim and no-ops
// while it is still in place; `analytics-token-stays-uninjected` keeps it that way in
// the repo, and `worker.test.mjs` holds this spelling against the file.
export const BEACON_PLACEHOLDER = 'REPLACE_WITH_CLOUDFLARE_WEB_ANALYTICS_TOKEN';
export const ANALYTICS_FILE = 'site/assets/analytics.js';
// Cloudflare's beacon tokens are hex. Anything else would be substituted into a string
// literal in a served script, so it is refused rather than shipped.
const BEACON_SHAPE = /^[0-9a-f]{8,}$/i;

// How many times the bump push re-reads the tip and rebuilds before giving up. The
// scheduler and the maintenance PRs also land on the default branch, and a lost race
// here would leave the repo naming an older version than the one being served.
const PUSH_ATTEMPTS = 5;

const log = (m) => console.log(`site-release: ${m}`);

const git = (cwd, args, opts = {}) => execFileSync('git', ['-C', cwd, ...args], {
  encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, ...opts,
});

// Every page at `sha` that the version stamp applies to.
const pagesAt = (root, sha) => git(root, ['ls-tree', '-r', '--name-only', sha, '--', 'site'])
  .split('\n').filter((p) => p.endsWith('.html'));

// A commit carrying `files` on top of `parent`, built through a scratch index so the
// executor's checkout and working tree are never touched.
function commitOnto(root, { parent, files, message }) {
  const index = join(tmpdir(), `claudinite-release-${process.pid}-${Date.now()}.index`);
  const plumb = (args, opts) => git(root, args, { ...opts, env: { ...process.env, GIT_INDEX_FILE: index } });
  try {
    plumb(['read-tree', parent]);
    for (const [path, content] of Object.entries(files)) {
      const blob = git(root, ['hash-object', '-w', '--stdin'], { input: content }).trim();
      plumb(['update-index', '--add', '--cacheinfo', `100644,${blob},${path}`]);
    }
    const tree = plumb(['write-tree']).trim();
    return git(root, [
      '-c', 'user.name=claudinite[bot]', '-c', 'user.email=claudinite@users.noreply.github.com',
      'commit-tree', tree, '-p', parent, '-m', message,
    ]).trim();
  } finally { rmSync(index, { force: true }); }
}

// Advance the version on `base` and push it, rebuilding on top of whatever landed
// under us. The version is recomputed from each attempt's tip rather than carried
// across, so a release that raced another writer still counts from what is there.
//
// Deliberately not `pushGenerated`: that lane force-pushes, which is correct for a
// regenerate-not-reconcile branch and catastrophic for the default branch.
export function pushRelease(root, { remote, base, taskId, now = new Date() }) {
  let lastError = null;
  for (let attempt = 1; attempt <= PUSH_ATTEMPTS; attempt += 1) {
    const parent = baseTip(root, remote, base);
    const pkgText = readAt(root, parent, 'package.json');
    if (pkgText === null) {
      console.error(`claudinite-needs-human: decision — package.json is absent from ${base}, so there is no version to advance`);
      throw new Error(`package.json is absent from ${base}`);
    }
    const pkg = JSON.parse(pkgText);
    const version = nextVersion(pkg.version, now);

    const files = { 'package.json': `${JSON.stringify({ ...pkg, version }, null, 2)}\n` };
    for (const page of pagesAt(root, parent)) {
      const html = readAt(root, parent, page);
      if (html === null) continue;
      const stamped = stampHtml(html, version);
      if (stamped !== html) files[page] = stamped;
    }

    const commit = commitOnto(root, {
      parent,
      files,
      message: withTaskTrailer(`Release site version ${version}`, taskId),
    });
    try {
      git(root, ['push', '--quiet', remote, `${commit}:refs/heads/${base}`]);
      return { version, commit, attempts: attempt };
    } catch (e) {
      lastError = e;
      log(`push rejected on attempt ${attempt} — ${base} moved; rebuilding on its new tip`);
    }
  }
  throw new Error(`could not push the version bump after ${PUSH_ATTEMPTS} attempts: ${lastError?.message ?? 'unknown'}`);
}

// The exact tree that is about to be uploaded, checked out beside the repo so the
// deployed bytes are the released commit's and nothing else's.
function withReleaseTree(root, commit, fn) {
  const dir = mkdtempSync(join(tmpdir(), 'claudinite-release-'));
  git(root, ['worktree', 'add', '--detach', '--quiet', dir, commit]);
  try { return fn(dir); } finally {
    try { git(root, ['worktree', 'remove', '--force', dir]); } catch { rmSync(dir, { recursive: true, force: true }); }
  }
}

// Substitute the beacon token into the copy being uploaded. Returns whether analytics
// will actually be live on this release — the placeholder surviving is the documented
// off state, not a failure, and saying which happened is the only way a run where the
// beacon never engaged is distinguishable from one where it did.
export function injectBeacon(path, token) {
  if (!token) return false;
  if (!BEACON_SHAPE.test(token)) {
    console.error('claudinite-needs-human: action — the CLOUDFLARE_ANALYTICS_TOKEN repository variable is not a Cloudflare beacon token (hex); fix or clear it');
    throw new Error('CLOUDFLARE_ANALYTICS_TOKEN is malformed');
  }
  const text = readFileSync(path, 'utf8');
  if (!text.includes(BEACON_PLACEHOLDER)) {
    console.error(`claudinite-needs-human: decision — ${ANALYTICS_FILE} no longer carries the ${BEACON_PLACEHOLDER} placeholder, so the token has nowhere to go`);
    throw new Error('the analytics placeholder is gone');
  }
  writeFileSync(path, text.split(BEACON_PLACEHOLDER).join(token));
  return true;
}

// A wrangler failure a person can fix in seconds (a token without the right scope, an
// account id that is not theirs, a zone that is not on Cloudflare yet) versus one that
// needs the trace read. The park lane follows from this.
export const isOperatorFailure = (output) => /\b(10000|10001|10021)\b|authentication error|not authorized|unauthorized|permission|no such zone|could not find zone/i.test(output ?? '');

function deploy(dir, { apiToken, accountId }) {
  try {
    const out = execFileSync('npx', ['--yes', WRANGLER, 'deploy'], {
      cwd: dir,
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
      env: {
        ...process.env,
        CLOUDFLARE_API_TOKEN: apiToken,
        CLOUDFLARE_ACCOUNT_ID: accountId,
        WRANGLER_SEND_METRICS: 'false',
        CI: 'true',
      },
    });
    console.log(out);
    return out;
  } catch (e) {
    const output = `${e.stdout ?? ''}\n${e.stderr ?? ''}`;
    console.log(output);
    console.error(isOperatorFailure(output)
      ? 'claudinite-needs-human: action — Cloudflare refused the upload; check the CLOUDFLARE_API_TOKEN scopes, the CLOUDFLARE_ACCOUNT_ID, and that claudinite.com is a zone on this account'
      : 'claudinite-needs-human: failure — wrangler deploy failed; the output above is the trace');
    throw new Error(`wrangler deploy failed: ${e.message}`);
  }
}

export async function main() {
  const root = process.env.CLAUDINITE_REPO_ROOT || process.cwd();
  const repo = process.env.CLAUDINITE_REPO;
  const base = process.env.CLAUDINITE_DEFAULT_BRANCH || 'main';
  const taskId = `${process.env.CLAUDINITE_PACK}/${process.env.CLAUDINITE_TASK}`;
  const token = process.env.GITHUB_TOKEN;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;

  if (!repo) throw new Error('CLAUDINITE_REPO is not set (owner/repo)');
  if (!token) throw new Error('GITHUB_TOKEN is not set — the release cannot read the branch tip or push its bump');
  if (!apiToken || !accountId) {
    console.error('claudinite-needs-human: action — CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID must both be configured as repository secrets before the site can be published');
    throw new Error('the Cloudflare credentials are not configured');
  }

  const { version, commit, attempts } = pushRelease(root, { remote: remoteUrl(repo, token), base, taskId });
  log(`released version ${version} as ${commit.slice(0, 7)}${attempts > 1 ? ` (after ${attempts} push attempts)` : ''}`);

  withReleaseTree(root, commit, (dir) => {
    const live = injectBeacon(join(dir, ANALYTICS_FILE), process.env.CLOUDFLARE_ANALYTICS_TOKEN);
    log(live
      ? 'injected the Cloudflare Web Analytics beacon token — analytics is live on this release'
      : 'no CLOUDFLARE_ANALYTICS_TOKEN variable — the placeholder ships and analytics stays off');
    deploy(dir, { apiToken, accountId });
  });

  log(`published site/ at version ${version}`);
}

// Run only when invoked directly (code-work's `node worker.mjs`), never on import.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => { console.error(`site-release failed: ${e.message}`); process.exit(1); });
}
