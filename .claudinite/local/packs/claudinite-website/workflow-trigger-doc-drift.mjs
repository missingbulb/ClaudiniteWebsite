import { finding } from '../../../shared/engine/checks/helpers/findings.mjs';
import { extractLinks } from '../../../shared/engine/checks/helpers/markdown.mjs';
import { parseYaml } from '../../../shared/engine/checks/helpers/minimal-yaml.mjs';

// WHY. A doc that describes when a workflow runs is a self-description, and
// nothing fails when a change to the workflow quietly makes it untrue. #45
// widened the Pages deploy to every push to `main` and dropped its `paths:`
// filter; `site/README.md` went on saying the site publishes only "on every
// push to `main` that touches `site/**`", and stayed wrong for months because
// the falsehood is invisible to every test the repo runs. The trigger is the
// one part of a workflow's description that IS mechanically checkable — the
// doc names a branch or a path glob, the workflow's `on:` block either carries
// it or does not.
//
// SCOPE. Only a claim the doc makes *about a workflow it links* is judged, and
// only in the paragraph carrying that link — a doc that never links the
// workflow is not claiming anything about it. Only two claim shapes are read,
// both anchored on a backticked token so prose can't be misread as a
// specification:
//   - "…push to `main`…"        -> the branch must be in `on.push.branches`
//   - "…touches `site/**`…"     -> the glob must be in `on.push.paths`
// Everything else a doc says about a workflow (what it uploads, which domain
// it serves) is not knowable from the trigger, so it is left to the reader.
//
// QUIET BY DEFAULT. A workflow with no `push:` trigger, a `paths-ignore:`
// filter (a positive "touches X" claim is not decidable against a negative
// filter), an unparseable YAML body, or a `branches`/`paths` key that isn't a
// list is not judged at all. The rule fires only where the artifact positively
// contradicts the sentence.

const SHARED_PREFIX = '.claudinite/shared/';
const WORKFLOW_RE = /^\.github\/workflows\/[^/]+\.ya?ml$/;

// Resolve a relative Markdown link target against the linking file's directory.
function resolveFrom(docPath, target) {
  const parts = docPath.split('/').slice(0, -1);
  for (const seg of target.split('/')) {
    if (seg === '.' || seg === '') continue;
    if (seg === '..') parts.pop();
    else parts.push(seg);
  }
  return parts.join('/');
}

// The paragraph (run of non-blank lines) holding `line`, joined into one string
// so a claim split across a line break still reads as one sentence.
export function paragraphAt(text, line) {
  const lines = text.split('\n');
  let start = line - 1;
  let end = line - 1;
  while (start > 0 && lines[start - 1].trim() !== '') start -= 1;
  while (end < lines.length - 1 && lines[end + 1].trim() !== '') end += 1;
  return lines.slice(start, end + 1).join(' ');
}

const isPathish = (t) => /[/*]/.test(t) || /\.\w+$/.test(t);

// The trigger claims one paragraph makes. Exported for the fixture.
export function claimsIn(paragraph) {
  const branches = [];
  const paths = [];
  for (const m of paragraph.matchAll(/push(?:es|ed)?\s+to\s+`([^`]+)`/g)) branches.push(m[1]);
  // "touches `site/**`" — the glob may sit a few words after the verb, but
  // never past the end of the sentence.
  for (const m of paragraph.matchAll(/touch\w*\b[^.`]{0,60}`([^`]+)`/g)) {
    if (isPathish(m[1])) paths.push(m[1]);
  }
  return { branches: [...new Set(branches)], paths: [...new Set(paths)] };
}

// `on.push` as this rule can judge it: null whenever the answer isn't knowable
// from the artifact. Exported for the fixture.
export function pushTrigger(yamlText) {
  const doc = parseYaml(yamlText);
  if (!doc || typeof doc !== 'object') return null;
  // A workflow's `on:` survives the minimal parser as the literal key.
  const on = doc.on ?? doc.true ?? doc.True;
  if (!on || typeof on !== 'object' || Array.isArray(on)) return null;
  if (!('push' in on)) return null;
  const push = on.push;
  if (push === null) return { branches: null, paths: null, ignoring: false };
  if (typeof push !== 'object' || Array.isArray(push)) return null;
  return {
    branches: Array.isArray(push.branches) ? push.branches.map(String) : null,
    paths: Array.isArray(push.paths) ? push.paths.map(String) : null,
    ignoring: 'paths-ignore' in push,
  };
}

const rule = {
  id: 'claudinite-website/workflow-trigger-doc-drift',
  severity: 'blocking',
  description: "A doc's claim about when a workflow it links runs must match that workflow's `on:` trigger",
  doc: '.claudinite/local/packs/claudinite-website/RULES.md',
  why: 'a doc describing a workflow trigger is a self-description no test reads: widening the Pages deploy in #45 left `site/README.md` claiming the site publishes only on a push touching `site/**`, and nothing failed',

  run(ctx) {
    const paths = [...new Set([...ctx.tracked, ...(ctx.files || [])])]
      .filter((f) => !f.startsWith(SHARED_PREFIX));
    const workflows = new Set(paths.filter((f) => WORKFLOW_RE.test(f)));
    if (!workflows.size) return [];
    const out = [];

    for (const doc of paths.filter((f) => f.endsWith('.md'))) {
      const text = ctx.read(doc);
      if (text === null) continue;

      for (const link of extractLinks(text)) {
        const wf = resolveFrom(doc, link.target);
        if (!workflows.has(wf)) continue;
        const body = ctx.read(wf);
        if (body === null) continue;
        const trigger = pushTrigger(body);
        if (trigger === null) continue;

        const { branches, paths: filtered } = claimsIn(paragraphAt(text, link.line));
        const report = (what, fix) => out.push(finding(rule, { file: doc, line: link.line, what, fix }));

        for (const branch of branches) {
          if (trigger.branches === null || trigger.branches.includes(branch)) continue;
          report(
            `this paragraph says \`${wf}\` runs on a push to \`${branch}\`, but its \`on.push.branches\` is ${JSON.stringify(trigger.branches)}`,
            `correct the sentence to the branches the workflow actually triggers on, or add \`${branch}\` to its \`on.push.branches\` — whichever matches the behaviour you meant`,
          );
        }

        if (trigger.ignoring) continue; // a positive path claim isn't decidable against paths-ignore
        for (const glob of filtered) {
          if (trigger.paths !== null && trigger.paths.includes(glob)) continue;
          report(
            trigger.paths === null
              ? `this paragraph says \`${wf}\` runs only on a push touching \`${glob}\`, but the workflow has no \`on.push.paths\` filter — it runs on every push`
              : `this paragraph says \`${wf}\` runs on a push touching \`${glob}\`, but its \`on.push.paths\` is ${JSON.stringify(trigger.paths)}`,
            `ship the correction with the behaviour: drop the path qualifier from the sentence, or restore the workflow's \`on.push.paths\` filter`,
          );
        }
      }
    }

    return out;
  },
};

export default rule;
