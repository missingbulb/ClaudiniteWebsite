#!/usr/bin/env node
//
// Bump the site version for a production release.
//
// Scheme: 1.<mmdd>.<previous patch + 1>
//   - major  stays 1
//   - minor  is the release date as zero-padded month+day (Asia/Jerusalem, the
//            timezone the rest of the fleet stamps its builds in)
//   - patch  is a monotonic counter: previous patch + 1, so it always advances
//            even when the day (and therefore the minor) rolls over
//
// package.json is the single source of truth for the version. The release commits
// the bumped files back to main — so the number in the repo always names the last
// release that actually went out.
//
// This script also owns the site's copy of the version: the footer's `title`
// tooltip on every page carrying the copyright element. That copy is generated
// here, never hand-edited, and the
// `claudinite-website/site-version-tooltip` check fails the build if the two
// ever disagree.
//
// `--stamp-only` re-stamps the pages from the current package.json without
// advancing anything — the way to repair drift (a bad merge, a page added
// without the stamp) that must not consume a version number.
//
// Prints the version to stdout (nothing else) so a caller can capture it.
//
// The release task's worker imports the two pure functions rather than shelling
// out: it stamps a temporary worktree it is about to deploy, not this checkout.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

// The version that follows `current`, released at `now`. Anything unparseable
// (e.g. the initial "1.0.0") treats the patch as 0, so the first bump lands on 1.
export function nextVersion(current, now = new Date()) {
  const prevPatch = Number.parseInt(String(current ?? "").split(".")[2], 10);
  const newPatch = (Number.isFinite(prevPatch) ? prevPatch : 0) + 1;
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jerusalem", month: "2-digit", day: "2-digit",
  }).formatToParts(now);
  const mm = parts.find((p) => p.type === "month").value;
  const dd = parts.find((p) => p.type === "day").value;
  return `1.${mm}${dd}.${newPatch}`;
}

// One page's `version` stamp. Matches the copyright element's whole `title`, so a
// page whose stamp is missing its value (the placeholder a new page is authored
// with) is repaired too. A page carrying no copyright element is returned as-is.
export function stampHtml(html, version) {
  if (!html.includes('class="copyright"')) return html;
  return html.replace(
    /(class="copyright"[^>]*?)title="version [^"]*"/,
    `$1title="version ${version}"`,
  );
}

// Stamp every page under `siteDir`, in place. Returns the names it rewrote.
export function stampPages(siteDir, version) {
  const stamped = [];
  for (const name of readdirSync(siteDir)) {
    if (!name.endsWith(".html")) continue;
    const path = join(siteDir, name);
    const html = readFileSync(path, "utf8");
    const next = stampHtml(html, version);
    if (next === html) continue;
    writeFileSync(path, next);
    stamped.push(name);
  }
  return stamped;
}

// Advance package.json and the pages under `repoRoot`, and return the new version.
// `stampOnly` re-stamps from the version already recorded, consuming none.
export function bump(repoRoot, { now = new Date(), stampOnly = false } = {}) {
  const pkgPath = join(repoRoot, "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  const version = stampOnly ? pkg.version : nextVersion(pkg.version, now);
  if (!stampOnly) {
    pkg.version = version;
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  }
  stampPages(join(repoRoot, "site"), version);
  return version;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
  console.log(bump(repoRoot, { stampOnly: process.argv.includes("--stamp-only") }));
}
