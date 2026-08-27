// Writing the recomputed counts back into `site/data/promoted.js`.
//
// The file is hand-edited by promo runs (the spotlight), so it is rewritten by
// SUBSTITUTION rather than regenerated: each stat entry is found by its label and
// only its number is replaced. Everything else in the file — the spotlight, the
// canon repo, the comments — is untouched by construction.

// Which count fills which entry. The label text is the join between this task and
// the page: it is what the reader sees under the number, and what makes an entry
// findable without depending on the array's order.
export const STAT_LABELS = {
  packs: 'packs in the canon',
  checks: 'deterministic checks',
  skills: 'skills on demand',
  tasks: 'scheduled task types',
};

// The site declares which canon it is about; the worker clones what it names
// rather than carrying a second copy of the address.
const CANON_REPO = /canonRepo:\s*'([^']+)'/;

export function canonRepoUrl(text) {
  return String(text ?? '').match(CANON_REPO)?.[1] ?? null;
}

const entryFor = (label) =>
  new RegExp(`(\\{\\s*n:\\s*')([^']*)('\\s*,\\s*label:\\s*'${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'\\s*\\})`);

// Substitute every count whose label is present. Returns the new text, whether it
// differs, and the labels that were NOT found.
//
// A missing label is reported rather than appended: the entry is gone because a
// person rewrote the stats block, and a machine that adds its own row back is
// overruling that edit rather than maintaining it.
export function applyStats(text, counts) {
  let out = String(text ?? '');
  const missing = [];
  for (const [key, label] of Object.entries(STAT_LABELS)) {
    const re = entryFor(label);
    if (!re.test(out)) { missing.push(label); continue; }
    out = out.replace(re, (_m, head, _old, tail) => `${head}${counts[key]}${tail}`);
  }
  return { text: out, changed: out !== String(text ?? ''), missing };
}
