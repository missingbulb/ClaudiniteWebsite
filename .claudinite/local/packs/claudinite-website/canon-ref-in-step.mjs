// The site publishes the canon ref this repo is vendored at, but it reads it
// from site/data/promoted.js while the authoritative value lives in
// .claudinite-checks.json (`claudinite.ref`) — two files that can't share an
// import (a JSON manifest and a plain browser script). Baselining bumps the
// manifest on its own schedule and auto-merges, and nothing in that path ever
// touches the site data, so the two copies drift apart by default and the page
// keeps advertising a ref the repo has already left behind.
//
// Dependency-free by the local-pack contract: plain finding objects, no import
// of the vendored engine's helpers.
const CONFIG = '.claudinite-checks.json';
const PROMOTED = 'site/data/promoted.js';
const CANON_REF = /canonRef\s*:\s*'([0-9a-f]+)'/;

const lineOf = (text, index) => text.slice(0, index).split('\n').length;

const rule = {
  id: 'site/canon-ref-in-step',
  severity: 'blocking',
  description: "site/data/promoted.js's canonRef must be the short form of the vendored ref in .claudinite-checks.json",
  doc: 'site/README.md',
  why: 'the site states the canon ref as a verifiable fact, and baselining bumps the declaration without ever touching the site data — left unguarded the copies only drift apart',

  run(ctx) {
    const promoted = ctx.read(PROMOTED);
    const config = ctx.read(CONFIG);
    if (promoted === null || config === null) return [];

    let ref;
    try {
      ref = JSON.parse(config)?.claudinite?.ref;
    } catch {
      return []; // malformed settings is the world runner's own finding, not this rule's
    }
    if (typeof ref !== 'string' || !ref) return [];

    const match = CANON_REF.exec(promoted);
    if (!match) {
      return [{
        rule: rule.id,
        severity: rule.severity,
        file: PROMOTED,
        line: null,
        what: 'no canonRef literal — the site has no ref to show and nothing pins it to the vendored canon',
        why: rule.why,
        fix: `add \`canonRef: '${ref.slice(0, 7)}',\` to the exported object`,
        doc: rule.doc,
      }];
    }

    const short = match[1];
    if (ref.startsWith(short)) return [];

    return [{
      rule: rule.id,
      severity: rule.severity,
      file: PROMOTED,
      line: lineOf(promoted, match.index),
      what: `canonRef is '${short}' but ${CONFIG} is vendored at ${ref}`,
      why: rule.why,
      fix: `set canonRef to '${ref.slice(0, short.length)}' — whatever moves the vendored ref (baselining included) must move the site's copy in the same change`,
      doc: rule.doc,
    }];
  },
};

export default rule;
