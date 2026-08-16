import { finding } from '../../../shared/engine/checks/helpers/findings.mjs';
import { parseYaml } from '../../../shared/engine/checks/helpers/minimal-yaml.mjs';

// WHY. The site describes its own deploy in prose, and nothing failed when the
// deploy stopped matching the description. Dropping the `paths:` filter from
// deploy-pages.yml (#45) left `site/README.md` — and the workflow's own header
// comment — still saying the site publishes only on a push that touches
// `site/**`, a claim that stayed false and unnoticed until a sweep read both
// files side by side. The trigger is the one self-description with a machine
// -readable counterpart, so it is the one the prose no longer has to carry.
//
// SCOPE. One direction only: prose that claims the deploy is *path-filtered*
// must be backed by an actual `paths:`/`paths-ignore:` list on the workflow's
// push trigger, and any glob the prose names must appear in it. An unqualified
// "publishes on every push to main" is never judged — it is true under both
// shapes, and a rule that demanded prose enumerate the filter would fire on
// every honest summary.
//
// PARSED, NOT GREPPED. The trigger comes from the workflow's parsed `on.push`,
// not from the text `paths:` appearing somewhere in the file (a `paths:` under
// a step's `with:` is not a trigger filter). The claim side is read as
// sentences over whitespace-collapsed text, because the claim wraps lines in
// both surfaces it has actually been written on.

const WORKFLOW = '.github/workflows/deploy-pages.yml';

// "on every push to `main`", "on pushes to main" — the sentence is about when
// the deploy runs.
const TRIGGER = /push(?:es)?\s+to\s+`?(?:main|master)`?/i;

// The qualifier that turns a trigger sentence into a path-filter claim.
const QUALIFIER = /\bthat\s+touch(?:es)?\b|\bwhen\s+(?:it|they)\s+touch(?:es)?\b|\bonly\s+(?:on|when)\b|\btouching\b|\bpaths?\s*:/i;

// A glob the claim names, e.g. `site/**` in backticks or bare.
const GLOB = /`([^`\s]*\*[^`\s]*)`|(?:^|\s)((?:[\w.-]+\/)+\*\*?)/g;

// Comment and markdown furniture, so a claim reads the same in a YAML header,
// a JS header and a README line.
function plain(text) {
  return text
    .split('\n')
    .map((l) => l.replace(/^\s*(?:#|\/\/|\*|>|-|\|)+\s?/, '').trim())
    .join(' ')
    .replace(/\s+/g, ' ');
}

function sentences(text) {
  return plain(text).split(/(?<=\.)\s+/).filter(Boolean);
}

// The push trigger's path filter as declared, or null when the trigger names
// none (an unparseable workflow answers null too — a rule that guesses at a
// shape it could not read would cry wolf).
export function declaredPaths(workflowText) {
  const doc = parseYaml(workflowText);
  const on = doc && (doc.on ?? doc.true); // `on:` unquoted is a YAML 1.1 boolean in some parsers
  const push = on && typeof on === 'object' ? on.push : null;
  if (!push || typeof push !== 'object') return null;
  const paths = push.paths ?? push['paths-ignore'];
  if (!Array.isArray(paths) || paths.length === 0) return null;
  return paths.map(String);
}

// The path-filter claims one document makes about the deploy trigger, each
// with the globs it names. Exported for the fixture.
export function claims(text) {
  const out = [];
  for (const sentence of sentences(text)) {
    if (!TRIGGER.test(sentence) || !QUALIFIER.test(sentence)) continue;
    const globs = [...sentence.matchAll(GLOB)].map((m) => (m[1] ?? m[2]).trim());
    out.push({ sentence, globs });
  }
  return out;
}

function lineOf(text, sentence) {
  const lines = text.split('\n');
  // The claim can wrap, so anchor on the trigger phrase — the part that always
  // sits on one line — and fall back to the file's first line.
  const at = lines.findIndex((l) => TRIGGER.test(l));
  return at < 0 ? null : at + 1;
}

const rule = {
  id: 'claudinite-website/deploy-trigger-claims',
  severity: 'blocking',
  description: 'Prose claiming the Pages deploy is path-filtered must match deploy-pages.yml\'s actual push trigger',
  doc: '.claudinite/local/packs/claudinite-website/RULES.md',
  why: 'the site describes its own deploy, and nothing fails when a workflow change falsifies the description — dropping the `paths:` filter (#45) left README and the workflow header both claiming the site publishes only on a push touching `site/**`',

  run(ctx) {
    const workflow = ctx.read(WORKFLOW);
    if (workflow === null) return [];
    const paths = declaredPaths(workflow);

    // The surfaces this claim has been written on: the workflow's own header
    // and the project's markdown. The vendored mount is already out of the
    // scanned set, so `ctx.files` is the project's own prose.
    const surfaces = [WORKFLOW, ...(ctx.files || []).filter((f) => f.endsWith('.md'))];
    const out = [];

    for (const file of [...new Set(surfaces)]) {
      const text = ctx.read(file);
      if (text === null) continue;
      for (const { sentence, globs } of claims(text)) {
        if (paths === null) {
          out.push(finding(rule, {
            file,
            line: lineOf(text, sentence),
            what: `this says the deploy runs only on a push that touches specific paths ("${sentence.trim()}"), but ${WORKFLOW}'s push trigger declares no \`paths:\` filter — it publishes on every push`,
            fix: `say the deploy runs on every push to \`main\`, or restore the \`paths:\` filter on the push trigger in ${WORKFLOW} — whichever matches the behaviour you want, in the same commit`,
          }));
          continue;
        }
        const missing = globs.filter((g) => !paths.includes(g));
        if (missing.length) {
          out.push(finding(rule, {
            file,
            line: lineOf(text, sentence),
            what: `this says the deploy is filtered to ${missing.map((g) => `\`${g}\``).join(', ')}, which ${WORKFLOW}'s push trigger does not list (it filters on ${paths.map((p) => `\`${p}\``).join(', ')})`,
            fix: `name the globs the workflow actually filters on, or add the claimed ones to \`on.push.paths\` in ${WORKFLOW} — in the same commit as the behaviour`,
          }));
        }
      }
    }

    return out;
  },
};

export default rule;
