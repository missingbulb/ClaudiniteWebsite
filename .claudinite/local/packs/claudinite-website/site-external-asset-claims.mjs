import { finding } from '../../../shared/engine/checks/helpers/findings.mjs';

// WHY. `site/` states in several places at once that it loads nothing from a
// third party — the header comment of `assets/style.css`, the lede and the
// `<meta name="description">` of `privacy.html`, the layout table in
// `site/README.md`. Those absolutes are load-bearing claims to a reader, and
// nothing failed when a change quietly made one untrue: landing the analytics
// beacon (#36) updated the privacy page's body but left the stylesheet header
// still asserting "No external assets", so the site shipped for a commit
// claiming it loaded nothing off-origin while it loaded a tracker.
//
// SCOPE. Only the half of that rule a post-hoc scan can settle without a
// judgment call: an *unqualified* absence claim ("no external assets", "no
// third-party requests") is falsified by ANY off-origin load, so the two
// halves can be paired mechanically. The rest of the standing absolutes
// (`cookieless`, `no cookies`, `no cross-site tracking`) are not — a
// cookieless beacon leaves every one of them true — so they stay prose in
// RULES.md and this rule never guesses at them.
//
// DETECTION. Off-origin references are found by scanning *loading constructs*,
// not by grepping for `https://`: a `<link rel="canonical">`, an `<a href>` to
// cloudflare.com, an `og:url`, or a URL inside a comment is not a load, and a
// rule that counted them would cry wolf on this very repo. Tags are read
// attribute-by-attribute and comments are blanked first.

const SITE = 'site/';
const TEXT = /\.(?:html?|css|m?js|md|txt|svg)$/i;

// The site's own origin. A reference to these is not "external".
const OWN_HOSTS = new Set(['claudinite.com', 'www.claudinite.com', 'localhost', '127.0.0.1']);

// `<link>` rel values that make the browser fetch the href. `canonical`,
// `alternate`, `me`, `license` and friends are metadata, not loads.
const LOADING_RELS = new Set([
  'stylesheet', 'preload', 'prefetch', 'preconnect', 'dns-prefetch', 'modulepreload',
  'icon', 'shortcut icon', 'apple-touch-icon', 'mask-icon', 'manifest',
]);

// Elements whose `src` (or `<object data>`) the browser fetches.
const SRC_TAGS = new Set(['script', 'img', 'iframe', 'source', 'video', 'audio', 'track', 'embed', 'input']);

// An unqualified claim that nothing off-origin is loaded. Deliberately narrow:
// "the only external asset is …" and "no other external assets" both carry a
// qualifier between the negation and the noun, so neither matches.
const ABSOLUTE_CLAIM =
  /\b(?:no|zero)\s+(?:external|third[-\s]party|off[-\s]origin)\s+(?:asset|resource|request|script|file|fetch|dependenc|code)/i;

// Blank out a comment's body while preserving every offset and newline, so
// line numbers computed from the stripped text still point at the original.
function blank(text, re) {
  return text.replace(re, (m) => m.replace(/[^\n]/g, ' '));
}

function lineOf(text, index) {
  return text.slice(0, index).split('\n').length;
}

export function hostOf(url) {
  const m = /^https?:\/\/([^/?#]+)/i.exec(url);
  return m ? m[1].toLowerCase().replace(/:\d+$/, '') : null;
}

function isOffOrigin(url) {
  const host = hostOf(url);
  return host !== null && !OWN_HOSTS.has(host);
}

// Attributes of one tag's attribute blob, lowercased names.
function attrsOf(blob) {
  const out = {};
  for (const m of blob.matchAll(/([a-zA-Z_:][\w:.-]*)\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g)) {
    out[m[1].toLowerCase()] = m[3] ?? m[4] ?? m[5] ?? '';
  }
  return out;
}

// Every off-origin *load* a file performs: [{ line, url }]. Exported for the
// fixture, which proves the metadata/navigation cases stay out of it.
export function offOriginLoads(file, text) {
  const out = [];
  const add = (index, url) => { if (isOffOrigin(url)) out.push({ line: lineOf(text, index), url }); };
  const isHtml = /\.html?$/i.test(file);
  const isCss = /\.css$/i.test(file);
  const isScript = /\.m?js$/i.test(file);

  if (isHtml) {
    const src = blank(text, /<!--[\s\S]*?-->/g);
    for (const m of src.matchAll(/<([a-zA-Z][\w-]*)\b([^>]*)>/g)) {
      const tag = m[1].toLowerCase();
      const attrs = attrsOf(m[2]);
      if (tag === 'link') {
        const rel = (attrs.rel || '').trim().toLowerCase();
        if (attrs.href && LOADING_RELS.has(rel)) add(m.index, attrs.href);
      } else if (tag === 'object') {
        if (attrs.data) add(m.index, attrs.data);
      } else if (SRC_TAGS.has(tag)) {
        if (attrs.src) add(m.index, attrs.src);
      }
    }
  }

  if (isCss) {
    const src = blank(text, /\/\*[\s\S]*?\*\//g);
    for (const m of src.matchAll(/(?:@import\s+|url\(\s*)['"]?(https?:\/\/[^)'"\s]+)/gi)) add(m.index, m[1]);
  }

  // Script bodies — a `.js` file, and the inline scripts of an HTML page. Only
  // constructs that unambiguously fetch: an element's `src`, `fetch()`, a
  // dynamic `import()`. A `.href =` is skipped, being a navigation as often as
  // a load.
  if (isScript || isHtml) {
    const src = blank(blank(text, /\/\*[\s\S]*?\*\//g), /(^|[^:'"\w])\/\/[^\n]*/g);
    const patterns = [
      /\.src\s*=\s*['"`](https?:\/\/[^'"`]+)/g,
      /\bfetch\(\s*['"`](https?:\/\/[^'"`]+)/g,
      /\bimport\(\s*['"`](https?:\/\/[^'"`]+)/g,
      /\bimportScripts\(\s*['"`](https?:\/\/[^'"`]+)/g,
    ];
    for (const re of patterns) for (const m of src.matchAll(re)) add(m.index, m[1]);
  }

  return out;
}

// Every unqualified "nothing off-origin" claim in a file: [{ line, text }].
export function absoluteClaims(text) {
  return text.split('\n')
    .map((ln, i) => ({ line: i + 1, text: ln.trim() }))
    .filter((l) => ABSOLUTE_CLAIM.test(l.text));
}

const rule = {
  id: 'claudinite-website/site-external-asset-claims',
  severity: 'blocking',
  description: "site/ must not claim it loads nothing off-origin while it loads something off-origin",
  doc: '.claudinite/local/packs/claudinite-website/RULES.md',
  why: "the site's no-external-asset absolutes sit in several files at once (the style.css header, privacy.html's lede and meta description, site/README.md), so a change that adds a network asset leaves the ones it didn't touch shipping a false claim to readers — exactly what landing the analytics beacon did",

  run(ctx) {
    const paths = [...new Set([...ctx.tracked, ...(ctx.files || [])])]
      .filter((f) => f.startsWith(SITE) && TEXT.test(f))
      .sort();

    const sources = new Map();
    for (const f of paths) {
      const text = ctx.read(f);
      if (text !== null) sources.set(f, text);
    }

    // Any off-origin load anywhere under site/ falsifies every unqualified
    // claim under site/ — the claims are about the site, not about their own
    // file.
    const loads = [];
    for (const [f, text] of sources) for (const l of offOriginLoads(f, text)) loads.push({ file: f, ...l });
    if (loads.length === 0) return [];

    const witness = loads[0];
    const out = [];
    for (const [f, text] of sources) {
      for (const claim of absoluteClaims(text)) {
        out.push(finding(rule, {
          file: f,
          line: claim.line,
          what: `"${claim.text}" claims site/ loads nothing off-origin, but ${witness.file}:${witness.line} loads ${witness.url}`,
          fix: 'reconcile this claim with what the site actually loads in the same commit — and re-read the other standing absolutes under site/ (privacy.html\'s lede and meta description, the style.css header, site/README.md) plus the disclosure the behaviour requires, which this check does not judge',
        }));
      }
    }
    return out;
  },
};

export default rule;
