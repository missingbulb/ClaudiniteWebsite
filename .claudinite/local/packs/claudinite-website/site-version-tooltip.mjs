import { finding } from '../../../shared/engine/checks/helpers/findings.mjs';

// WHY. The site's footer names the released version in a `title` tooltip, so a
// visitor can say which build they are looking at. That number is a copy of
// `package.json`'s version — the single source of truth the release bumps — and
// a copy that drifts is worse than no number at all: it names a build that is
// not the one being served, and nothing about the page looks wrong.
//
// The copy is generated, not hand-maintained: `scripts/bump-version.mjs` writes
// the version into `package.json` and stamps it into every page carrying the
// footer, in the same run. This rule is that generator's drift guard — it fires
// when a page's stamp disagrees with `package.json`, which is what a hand-edit,
// a half-applied release, or a page added without the stamp all look like.
//
// SCOPE. Every tracked `site/**.html` that carries the footer copyright element
// (`class="copyright"`). A page without that element has no claim to check; a
// page with it must carry a stamp, and the stamp must match.

const PAGE = /^site\/.*\.html$/;
const COPYRIGHT = /class="copyright"/;

// The stamp as authored: `title="version 1.0821.34"` on the copyright element.
// Exported so the generator and the fixture spell it one way.
export const STAMP = /title="version ([^"]*)"/;

const rule = {
  id: 'claudinite-website/site-version-tooltip',
  severity: 'blocking',
  description: "A site page's footer version tooltip must carry package.json's version",
  doc: '.claudinite/local/packs/claudinite-website/RULES.md',
  why: 'the tooltip is the only place a visitor can read which build they are on, and a stale copy names a build that was never served',

  run(ctx) {
    const pkg = ctx.read('package.json');
    if (pkg === null) return [];
    let version;
    try { version = JSON.parse(pkg).version; } catch { return []; }
    if (!version) return [];

    const out = [];
    const pages = [...new Set([...ctx.tracked, ...(ctx.files || [])])].filter((f) => PAGE.test(f));

    for (const page of pages) {
      const text = ctx.read(page);
      if (text === null || !COPYRIGHT.test(text)) continue;

      const lines = text.split('\n');
      const at = lines.findIndex((l) => COPYRIGHT.test(l));
      const stamped = STAMP.exec(lines[at] ?? '')?.[1];

      if (stamped === version) continue;
      out.push(finding(rule, {
        file: page,
        line: at + 1,
        what: stamped === undefined
          ? 'the footer copyright carries no version tooltip'
          : `the footer names version ${stamped}, but package.json says ${version}`,
        fix: 'run `npm run bump-version` — it writes package.json and stamps every page from it; never hand-edit either side',
      }));
    }

    return out;
  },
};

export default rule;
