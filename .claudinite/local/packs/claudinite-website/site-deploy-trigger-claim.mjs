import { finding } from '../../../shared/engine/checks/helpers/findings.mjs';

// WHY. deploy-pages.yml's own header comment and site/README.md each describe
// when the deploy workflow fires. Both used to be true of an `on.push.paths`
// filter scoped to `site/**`; #45 dropped that filter (the workflow now also
// bumps the release version on every push to main, not only ones touching the
// site) but nothing forced either description to be revisited, and both still
// claim the old scope. Grepping either file for the claim text alone risks a
// false positive on an unrelated mention, so this rule first parses the
// workflow's own `on: push:` block structurally — a `paths:` key anywhere else
// in the file (a step, another trigger) never counts.

const WORKFLOW = '.github/workflows/deploy-pages.yml';
const README = 'site/README.md';
const CLAIM_RE = /touches?\s*`?site\/\*\*`?|touches it\b/i;

// Whether `on: push:` in this workflow YAML carries a `paths:` filter —
// indentation-scoped to that one block so a `paths:` key elsewhere in the file
// is never mistaken for it. Exported for the fixture.
export function hasPushPathsFilter(yamlText) {
  let section = null; // null | 'on' | 'push'
  let sectionIndent = -1;
  for (const raw of yamlText.split('\n')) {
    if (!raw.trim()) continue;
    const indent = raw.length - raw.trimStart().length;
    const trimmed = raw.trim();
    if (section && indent <= sectionIndent) section = null;
    if (!section) {
      if (/^on:\s*$/.test(trimmed)) { section = 'on'; sectionIndent = indent; }
      continue;
    }
    if (section === 'on') {
      if (/^push:\s*$/.test(trimmed)) { section = 'push'; sectionIndent = indent; }
      continue;
    }
    if (section === 'push' && /^paths:/.test(trimmed)) return true;
  }
  return false;
}

const rule = {
  id: 'claudinite-website/site-deploy-trigger-claim',
  severity: 'blocking',
  description: "deploy-pages.yml's header comment and site/README.md must describe the workflow's actual push trigger, not a stale `paths:` scope",
  doc: '.claudinite/local/packs/claudinite-website/RULES.md',
  why: "#45 dropped the paths: filter that scoped deploys to `site/**`, but the workflow's own header comment and site/README.md still claimed the old scope — a reader trusts either as ground truth for when a release goes out",

  run(ctx) {
    const workflow = ctx.read(WORKFLOW);
    if (workflow === null) return [];
    if (hasPushPathsFilter(workflow)) return []; // the filter is back — the claim may be true again

    const out = [];
    const wLines = workflow.split('\n');
    for (let i = 0; i < wLines.length; i += 1) {
      if (wLines[i].trimStart().startsWith('#') && CLAIM_RE.test(wLines[i])) {
        out.push(finding(rule, {
          file: WORKFLOW,
          line: i + 1,
          what: 'this header comment claims the deploy is scoped to changes touching `site/**`, but `on.push` carries no `paths:` filter',
          fix: 'describe the actual trigger (every push to `main`) or restore the `paths:` filter under `on.push` if scoping is what you want',
        }));
      }
    }

    const readme = ctx.read(README);
    if (readme !== null) {
      const rLines = readme.split('\n');
      for (let i = 0; i < rLines.length; i += 1) {
        if (CLAIM_RE.test(rLines[i])) {
          out.push(finding(rule, {
            file: README,
            line: i + 1,
            what: "this claims the deploy is scoped to changes touching `site/**`, but `.github/workflows/deploy-pages.yml`'s `on.push` carries no `paths:` filter",
            fix: 'describe the actual trigger (every push to `main`) or restore the `paths:` filter under `on.push` if scoping is what you want',
          }));
        }
      }
    }

    return out;
  },
};

export default rule;
