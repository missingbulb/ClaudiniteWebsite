// The four canon-wide counts the site promotes, derived from a canon checkout.
//
// Pure and I/O-free so the counting can be tested against fixtures rather than a
// clone: the caller supplies the directory file's text, a reader for one pack's
// README, and the checkout's path listing.
//
// THE DIRECTORY IS THE PACK SET. `packs/directory.GENERATED.md` lists every pack a
// repo can adopt, and a pack absent from it is absent on purpose — the canary pack
// declares `hidden: true` precisely so nothing offers it — so a directory row is
// the only thing that makes a pack countable. Reading `packs/` off disk instead
// would count it.

// A pack row in the directory table: the id is the first cell, in backticks.
const PACK_ROW = /^\|\s*`([^`]+)`\s*\|/;

export function packsFromDirectory(directory) {
  return String(directory ?? '')
    .split('\n')
    .map((line) => line.match(PACK_ROW)?.[1])
    .filter(Boolean);
}

// A README table row is a check when its first cell is a backticked name and some
// later cell states an enforcement of `check: …`.
//
// Matched on the ROW rather than on the section heading or the header cells above
// it, because neither is written the same way twice: `barriers` heads its section
// "The check", `claudinite-tasks` heads its columns `| Rule | Confidence |` where
// everyone else writes `| Check | Severity |`, and `claudinite-lifecycle` carries
// two separate check tables under one section. Keying off the heading silently
// undercounts all three.
export function checksInReadme(readme) {
  let n = 0;
  for (const line of String(readme ?? '').split('\n')) {
    if (!line.startsWith('|')) continue;
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    if (cells.length < 2) continue;
    if (!/^`[^`]+`$/.test(cells[0])) continue;
    if (cells.slice(1).some((c) => /^check:\s*\S/.test(c))) n += 1;
  }
  return n;
}

// The directory entries directly under `packs/<pack>/<kind>/` — one per skill, one
// per task. Taken from the path listing rather than a directory read so the same
// function serves a real checkout and a fixture.
export function subdirsOf(paths, pack, kind) {
  const prefix = `packs/${pack}/${kind}/`;
  const names = new Set();
  for (const path of paths) {
    if (!path.startsWith(prefix)) continue;
    const rest = path.slice(prefix.length);
    const name = rest.split('/')[0];
    if (name) names.add(name);
  }
  return names.size;
}

// The four counts, plus the per-pack breakdown the PR body reports.
// `readme(pack)` returns that pack's README text, or null where it has none —
// nine packs are prose-only and legitimately carry neither a README nor a
// skills/ or tasks/ directory.
export function countCanonStats({ directory, readme, paths }) {
  const list = [...paths];
  const perPack = packsFromDirectory(directory).map((pack) => ({
    pack,
    checks: checksInReadme(readme(pack)),
    skills: subdirsOf(list, pack, 'skills'),
    tasks: subdirsOf(list, pack, 'tasks'),
  }));
  const sum = (key) => perPack.reduce((t, p) => t + p[key], 0);
  return {
    packs: perPack.length,
    checks: sum('checks'),
    skills: sum('skills'),
    tasks: sum('tasks'),
    perPack,
  };
}
