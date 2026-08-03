import { finding } from '../../../shared/engine/checks/helpers/findings.mjs';

// WHY. `site/` describes itself in half a dozen places at once — the privacy
// page's lede and its `<meta name="description">`, the header comment of
// `site/assets/style.css`, `site/README.md` — and nothing in the tree fails
// when a behaviour change makes one of them untrue. Landing the analytics
// beacon (#36) left the stylesheet header asserting "No external assets"
// standing, so the site shipped claiming it loaded nothing off-origin while
// loading a tracker, and it took a second commit to walk the claim back.
//
// SCOPE. This rule mechanises the one slice of that discipline that is
// unconditionally decidable from the artifact: an UNQUALIFIED
// "no external/third-party <asset>" absolute is false the moment `site/` loads
// any off-origin asset, whatever that asset happens to be. The neighbouring
// absolutes the prose also lists — "no tracking", "no cookies", "cookieless" —
// are NOT decidable this way (an off-origin webfont falsifies none of them),
// so they stay prose and this rule says nothing about them.
//
// TWO GUARDS, because a false alarm on the site's own copy is expensive:
//  - LOAD POSITIONS ONLY. An off-origin URL is an asset load only where the
//    browser actually fetches it — `src=`, a stylesheet/preload/icon `<link>`'s
//    `href=`, CSS `url()`/`@import`, or a `.src =` / `fetch()` / `sendBeacon()`
//    in JS. A plain `<a href>` and `<link rel="canonical">` load nothing, and
//    `site/` is full of both. Comments are stripped first (with a scanner that
//    knows string state, so the `//` in `https://` is never read as a line
//    comment), so a commented-out beacon is not a load either.
//  - QUALIFIED CLAIMS ARE NOT ABSOLUTES. "the only external asset is the
//    beacon" and "no external assets except the beacon" both concede the
//    asset; the sentence around a match is read for a concession before the
//    rule fires.

const SITE_DIR = 'site/';

// Comments in a JS or CSS source, blanked out (same length, newlines kept, so
// offsets and line numbers survive). String state is tracked deliberately: a
// naive `//`-to-end-of-line strip eats the rest of `beacon.src =
// 'https://…'`, which is exactly the load this rule exists to see.
function stripCodeComments(src, { lineComments = true } = {}) {
  const blank = (s) => s.replace(/[^\n]/g, ' ');
  let out = '';
  let i = 0;
  let quote = null;
  while (i < src.length) {
    const c = src[i];
    const next = src[i + 1];
    if (quote) {
      if (c === '\\') { out += c + (next === undefined ? '' : next); i += 2; continue; }
      if (c === quote) quote = null;
      out += c;
      i += 1;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { quote = c; out += c; i += 1; continue; }
    if (c === '/' && next === '*') {
      const end = src.indexOf('*/', i + 2);
      const stop = end < 0 ? src.length : end + 2;
      out += blank(src.slice(i, stop));
      i = stop;
      continue;
    }
    if (lineComments && c === '/' && next === '/') {
      const end = src.indexOf('\n', i);
      const stop = end < 0 ? src.length : end;
      out += blank(src.slice(i, stop));
      i = stop;
      continue;
    }
    out += c;
    i += 1;
  }
  return out;
}

function stripHtmlComments(src) {
  return src.replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, ' '));
}

const lineAt = (text, index) => text.slice(0, index).split('\n').length;

// Off-origin: any scheme followed by `//`, or a protocol-relative `//host`.
// A repo-relative path, a `data:`/`mailto:` URI and a bare `#anchor` are not.
const OFF_ORIGIN = /^\s*(?:[a-z][a-z0-9+.-]*:)?\/\//i;
const isOffOrigin = (url) => OFF_ORIGIN.test(url);

// `<link>` relations the browser fetches. `canonical`, `alternate` and friends
// name a URL without loading it, and the site uses `canonical` on every page.
const LOAD_RELS = new Set([
  'stylesheet', 'preload', 'prefetch', 'preconnect', 'dns-prefetch',
  'modulepreload', 'icon', 'shortcut icon', 'apple-touch-icon', 'manifest',
]);

// Which attributes of a tag hold something the browser fetches.
const LOAD_ATTRS = {
  script: ['src'], img: ['src', 'srcset'], iframe: ['src'], embed: ['src'],
  audio: ['src'], video: ['src', 'poster'], source: ['src', 'srcset'],
  track: ['src'], object: ['data'],
};

function attrs(raw) {
  const out = {};
  for (const m of raw.matchAll(/([\w:.-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    out[m[1].toLowerCase()] = m[2] ?? m[3] ?? m[4] ?? '';
  }
  return out;
}

function htmlLoads(text) {
  const src = stripHtmlComments(text);
  const out = [];
  for (const m of src.matchAll(/<([a-zA-Z][\w-]*)\b([^>]*)>/g)) {
    const tag = m[1].toLowerCase();
    const a = attrs(m[2]);
    const names = tag === 'link'
      ? (LOAD_RELS.has((a.rel || '').trim().toLowerCase()) ? ['href'] : [])
      : (LOAD_ATTRS[tag] || []);
    for (const name of names) {
      // `srcset` is a comma-separated candidate list; every candidate loads.
      for (const cand of (a[name] || '').split(',')) {
        const url = cand.trim().split(/\s+/)[0];
        if (url && isOffOrigin(url)) out.push({ line: lineAt(src, m.index), url });
      }
    }
  }
  return out;
}

function cssLoads(text) {
  const src = stripCodeComments(text, { lineComments: false });
  const out = [];
  const patterns = [
    /url\(\s*(['"]?)([^'")]+)\1\s*\)/g,
    /@import\s+(['"])([^'"]+)\1/g,
  ];
  for (const re of patterns) {
    for (const m of src.matchAll(re)) {
      if (isOffOrigin(m[2])) out.push({ line: lineAt(src, m.index), url: m[2].trim() });
    }
  }
  return out;
}

function jsLoads(text) {
  const src = stripCodeComments(text);
  const out = [];
  // `.href =` is deliberately absent: an anchor's href loads nothing, and the
  // site's renderer writes plenty of them.
  const patterns = [
    /\.src\s*=\s*(['"`])([^'"`]+)\1/g,
    /\b(?:fetch|importScripts|sendBeacon)\s*\(\s*(['"`])([^'"`]+)\1/g,
    /\bnew\s+(?:Worker|SharedWorker|EventSource|WebSocket)\s*\(\s*(['"`])([^'"`]+)\1/g,
    /\bimport\s*\(\s*(['"`])([^'"`]+)\1/g,
  ];
  for (const re of patterns) {
    for (const m of src.matchAll(re)) {
      if (isOffOrigin(m[2])) out.push({ line: lineAt(src, m.index), url: m[2].trim() });
    }
  }
  return out;
}

// Every off-origin asset `site/` loads, in load position. Exported for the
// fixture.
export function externalLoads(read, files) {
  const out = [];
  for (const f of files) {
    const text = read(f);
    if (text === null || text === undefined) continue;
    const scan = f.endsWith('.html') ? htmlLoads
      : f.endsWith('.css') ? cssLoads
        : (f.endsWith('.js') || f.endsWith('.mjs')) ? jsLoads
          : null;
    if (!scan) continue;
    for (const hit of scan(text)) out.push({ file: f, ...hit });
  }
  return out;
}

// An unqualified "no external / no third-party <asset>" absolute. Narrow on
// purpose: every phrase it matches is falsified by ANY off-origin load, so the
// rule never has to judge what kind of asset landed.
const ABSOLUTE = /\b(?:no|zero)\s+(?:external|third[-\s]?party|off[-\s]?origin)[-\s]+(?:asset|script|resource|request|dependenc\w*|font|stylesheet|call|connection|fetch|download)\w*/i;

// Words that concede the very asset the absolute denies, anywhere in the
// sentence carrying it.
const CONCESSION = /\b(?:except|excepting|other than|besides|apart from|aside from|save for|unless|only external|only third[-\s]?party|exactly one)\b/i;

// The sentence `index` sits in — bounded by terminators or a blank line, so a
// concession three paragraphs away can't silence a real claim.
function sentenceAround(text, index) {
  const before = text.slice(0, index);
  const start = Math.max(
    before.lastIndexOf('. '), before.lastIndexOf('.\n'), before.lastIndexOf('! '),
    before.lastIndexOf('? '), before.lastIndexOf('; '), before.lastIndexOf('\n\n'),
  );
  const rest = text.slice(index);
  const end = rest.search(/[.!?;]\s|\n\n/);
  return text.slice(start + 1, index + (end < 0 ? rest.length : end + 1));
}

const TEXTUAL = /\.(?:html|css|js|mjs|md|txt|svg|json)$/;

// Every unqualified absolute standing in `site/`. Exported for the fixture.
export function absoluteClaims(read, files) {
  const out = [];
  for (const f of files.filter((p) => TEXTUAL.test(p))) {
    const text = read(f);
    if (text === null || text === undefined) continue;
    for (const m of text.matchAll(new RegExp(ABSOLUTE, 'gi'))) {
      if (CONCESSION.test(sentenceAround(text, m.index))) continue;
      out.push({ file: f, line: lineAt(text, m.index), claim: m[0] });
    }
  }
  return out;
}

const rule = {
  id: 'claudinite-website/site-external-asset-claims',
  severity: 'blocking',
  description: '`site/` must not carry an unqualified no-external-asset claim while it loads an off-origin asset',
  doc: '.claudinite/local/packs/claudinite-website/RULES.md',
  why: 'the site states its no-external-asset absolutes in several files at once — the privacy lede and meta description, the stylesheet header, site/README.md — and #36 shipped the analytics beacon while the stylesheet still said "No external assets", so the site claimed to load nothing off-origin while loading a tracker',

  run(ctx) {
    const files = [...new Set([...ctx.tracked, ...(ctx.files || [])])]
      .filter((f) => f.startsWith(SITE_DIR));
    const loads = externalLoads(ctx.read, files);
    if (loads.length === 0) return [];

    const example = loads[0];
    return absoluteClaims(ctx.read, files).map((c) => finding(rule, {
      file: c.file,
      line: c.line,
      what: `"${c.claim}" is stated without qualification, but \`site/\` loads the off-origin asset \`${example.url}\` (${example.file}:${example.line})`,
      fix: 'in the same commit as the behaviour, either drop the off-origin load or qualify the claim to match what the site really loads (e.g. "the only external asset is …"), and reconcile the site\'s other standing absolutes — grep `site/` for `no track`, `no cookie`, `no third-party`, `no external`, `cookieless` — plus any disclosure the behaviour requires',
    }));
  },
};

export default rule;
