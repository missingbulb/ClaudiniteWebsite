import { finding } from '../../../shared/engine/checks/helpers/findings.mjs';
import { parseYaml } from '../../../shared/engine/checks/helpers/minimal-yaml.mjs';

// WHY. site/README.md states, as a checkable fact, that the deploy workflow's
// push trigger carries no `paths:` filter — the exact claim that went stale
// once before (#45 dropped the filter's absence from the workflow without
// correcting the README) until an audit caught it. The workflow is the source
// of truth and the README a copy of one fact about it; this rule is that
// copy's drift guard.

const WORKFLOW = '.github/workflows/deploy-pages.yml';
const README = 'site/README.md';
const CLAIM = /no `paths:` filter/i;

const rule = {
  id: 'claudinite-website/deploy-trigger-claim',
  severity: 'blocking',
  since: '2026-08-30',
  description: "site/README.md's claim that the deploy workflow's push trigger carries no `paths:` filter must match the workflow",
  doc: '.claudinite/local/packs/claudinite-website/RULES.md',
  why: "the README states this as a fact a reader relies on to predict when the site redeploys; a filter added to the workflow without correcting the claim leaves the README describing a trigger the site no longer has",

  run(ctx) {
    const readme = ctx.read(README);
    if (readme === null) return [];
    const lines = readme.split('\n');
    const at = lines.findIndex((l) => CLAIM.test(l));
    if (at < 0) return [];

    const wf = ctx.read(WORKFLOW);
    if (wf === null) return [];
    const doc = parseYaml(wf);
    const hasPathsFilter = Array.isArray(doc?.on?.push?.paths) && doc.on.push.paths.length > 0;
    if (!hasPathsFilter) return [];

    return [finding(rule, {
      file: README,
      line: at + 1,
      what: `claims the deploy workflow's push trigger carries no \`paths:\` filter, but ${WORKFLOW} now has one`,
      fix: 'update this claim to describe the actual trigger — either the filter it now applies, or that the workflow redeploys only when matching paths change',
    })];
  },
};

export default rule;
