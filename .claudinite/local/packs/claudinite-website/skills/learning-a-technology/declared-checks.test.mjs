// Fixtures for the learning-a-technology skill's three declared checks. The bar:
// a violating tree must find, a clean one must not — proved on the compiled
// declarations against synthetic contexts, since the live repo carries no
// technology skill yet and a green run over it would prove nothing.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadDeclaredChecks } from '../../../../../shared/engine/checks/helpers/pattern-rules.mjs';

const rules = loadDeclaredChecks(dirname(fileURLToPath(import.meta.url)));
const rule = (id) => rules.find((r) => r.id === id);
const sources = rule('technology-skill-cites-dated-sources');
const links = rule('technology-skill-links-inside-its-folder');
const imports = rule('technology-skill-code-imports-inside-its-folder');

const ctxWith = (files) => ({
  mode: 'all',
  tracked: Object.keys(files),
  files: Object.keys(files),
  allFiles: Object.keys(files),
  read: (p) => (p in files ? files[p] : null),
  exists: (p) => p in files,
});

const SKILL = '.claudinite/local/packs/site/skills/cloudflare-email/SKILL.md';
const CODE = '.claudinite/local/packs/site/skills/cloudflare-email/send.mjs';
const TEST = '.claudinite/local/packs/site/skills/cloudflare-email/send.test.mjs';

const frontmatter = (technology) => [
  '---',
  'name: cloudflare-email',
  'description: Send one transactional email through the vendor.',
  ...(technology ? ['metadata:', `  technology: ${technology}`] : []),
  '---',
  '',
  '# Cloudflare email',
  '',
].join('\n');

const SOURCES = [
  '## Sources',
  '',
  '- https://developers.example.com/email/send/ — fetched 2026-09-08',
  '',
].join('\n');
const VERIFIED = ['## Verified', '', '- 2026-09-08: one send to the owner, accepted with id `abc`.', ''].join('\n');

const complete = () => frontmatter('Cloudflare Email Service') + SOURCES + VERIFIED;

test('a complete technology skill passes every check', () => {
  const ctx = ctxWith({ [SKILL]: complete(), [CODE]: "import { post } from './http.mjs';\n" });
  for (const r of [sources, links, imports]) assert.deepEqual(r.run(ctx), [], r.id);
});

test('sources: fires when the Sources section carries no dated URL', () => {
  const undated = frontmatter('Cloudflare Email Service')
    + '## Sources\n\n- https://developers.example.com/email/send/\n\n' + VERIFIED;
  const found = sources.run(ctxWith({ [SKILL]: undated }));
  assert.equal(found.length, 1);
  assert.equal(found[0].file, SKILL);
  assert.match(found[0].what, /fetch date/);
});

test('sources: fires when the Verified section is missing', () => {
  const found = sources.run(ctxWith({ [SKILL]: frontmatter('Cloudflare Email Service') + SOURCES }));
  assert.equal(found.length, 1);
  assert.match(found[0].what, /## Verified/);
});

test('sources: a URL inside a fenced example does not count as a source', () => {
  const fenced = frontmatter('Cloudflare Email Service')
    + '## Sources\n\n```\ncurl https://developers.example.com/email/ # 2026-09-08\n```\n\n' + VERIFIED;
  assert.equal(sources.run(ctxWith({ [SKILL]: fenced })).length, 1);
});

test('sources: stays quiet on a skill that declares no technology', () => {
  const plain = frontmatter(null) + 'A procedure skill: `technology: x` mentioned inline is not a marker.\n';
  assert.deepEqual(sources.run(ctxWith({ [SKILL]: plain })), []);
});

test('links: fires on a relative link out of the folder and on a mount path', () => {
  const leaky = complete()
    + 'See [the task contract](../../../../shared/packs/claudinite-tasks/README.md).\n'
    + 'Or read .claudinite/local/packs/site/RULES.md first.\n';
  const found = links.run(ctxWith({ [SKILL]: leaky }));
  assert.equal(found.length, 2);
  assert.equal(found[0].line, complete().split('\n').length);
});

test('links: a path inside a fenced example is not a link', () => {
  const fenced = complete() + '```\ncp -r .claudinite/local/packs/site/skills/x .\n```\n';
  assert.deepEqual(links.run(ctxWith({ [SKILL]: fenced })), []);
});

test('links: a sibling link inside the folder is fine', () => {
  assert.deepEqual(links.run(ctxWith({ [SKILL]: complete() + 'Run [send.mjs](send.mjs).\n' })), []);
});

test('imports: fires when the technology skill\'s code imports from outside the folder', () => {
  const ctx = ctxWith({
    [SKILL]: complete(),
    [CODE]: "import { finding } from '../../../../shared/engine/checks/helpers/findings.mjs';\n",
  });
  const found = imports.run(ctx);
  assert.equal(found.length, 1);
  assert.equal(found[0].file, CODE);
  assert.match(found[0].what, /Cloudflare Email Service/);
});

test('imports: a commented-out outward import is not an import', () => {
  const ctx = ctxWith({ [SKILL]: complete(), [CODE]: "// import x from '../x.mjs';\nexport const a = 1;\n" });
  assert.deepEqual(imports.run(ctx), []);
});

test('imports: the skill\'s own test file may reach the engine', () => {
  const ctx = ctxWith({
    [SKILL]: complete(),
    [TEST]: "import { loadDeclaredChecks } from '../../../../../shared/engine/checks/helpers/pattern-rules.mjs';\n",
  });
  assert.deepEqual(imports.run(ctx), []);
});

test('imports: code beside a skill that declares no technology is not judged', () => {
  const ctx = ctxWith({ [SKILL]: frontmatter(null), [CODE]: "import x from '../x.mjs';\n" });
  assert.deepEqual(imports.run(ctx), []);
});
