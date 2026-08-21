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
// package.json is the single source of truth for the version. The deploy
// workflow runs this, then commits the bumped files back to main — so the number
// in the repo always names the last release that actually went out.
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
// Prints the version to stdout (nothing else) so the workflow can capture it.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const pkgPath = join(repoRoot, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
const stampOnly = process.argv.includes("--stamp-only");

// Write `version` into every site page that carries the footer copyright.
// Matches the element's whole `title`, so a page whose stamp is missing its
// value (the placeholder a new page is authored with) is repaired too.
function stampPages(version) {
  const siteDir = join(repoRoot, "site");
  for (const name of readdirSync(siteDir)) {
    if (!name.endsWith(".html")) continue;
    const path = join(siteDir, name);
    const html = readFileSync(path, "utf8");
    if (!html.includes('class="copyright"')) continue;
    const stamped = html.replace(
      /(class="copyright"[^>]*?)title="version [^"]*"/,
      `$1title="version ${version}"`,
    );
    if (stamped !== html) writeFileSync(path, stamped);
  }
}

if (stampOnly) {
  stampPages(pkg.version);
  console.log(pkg.version);
  process.exit(0);
}

// The current patch is the third dotted component; treat anything unparseable
// (e.g. the initial "1.0.0") as 0 so the first bump lands on patch 1.
const prevPatch = Number.parseInt(String(pkg.version ?? "").split(".")[2], 10);
const newPatch = (Number.isFinite(prevPatch) ? prevPatch : 0) + 1;

const parts = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Jerusalem", month: "2-digit", day: "2-digit",
}).formatToParts(new Date());
const mm = parts.find((p) => p.type === "month").value;
const dd = parts.find((p) => p.type === "day").value;

const newVersion = `1.${mm}${dd}.${newPatch}`;
pkg.version = newVersion;
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
stampPages(newVersion);

console.log(newVersion);
