import { readdirSync, existsSync } from 'node:fs';
import { join, sep } from 'node:path';
import { finding } from '../../../shared/engine/checks/helpers/findings.mjs';
import { SHARED_SUBDIR } from '../../../shared/engine/pack_loader/pack-registry.mjs';

// Mount-upkeep rule: every pack VENDORED into this repo's Claudinite mount must
// also be DECLARED in .claudinite-checks.json.
//
// The two halves of adopting a pack are a declaration and a vendoring, and only
// one of the two directions was ever checked. A declared pack that isn't
// vendored is loud — discovery never finds it, so the world runner reports
// `declares unknown pack "<id>"` and the run goes red. The opposite is silent:
// `isActive` gates purely on the declaration, so a pack sitting in the mount
// with nothing declaring it contributes no prose, no checks and no skills. It
// looks adopted in the tree and is inert in every session — the exact residue a
// hand-copied pack, an abandoned half-adoption, or a vendor set that drifted
// past the settings file leaves behind.
//
// Dependencies don't false-alarm: `requires` closures are materialized INTO the
// declaration when it is written (resolveDeclaredPacks stamps each pulled-in
// pack with `via`), so a legitimately vendored dependency carries its own entry.
//
// Two deliberate silences, both because something else already owns the finding:
// no mount at all (a repo that hasn't vendored yet is not drifting), and a
// settings file the loader couldn't read (the world runner reports that itself,
// and its empty pack list would otherwise indict every vendored pack at once).
// A directory without a pack.mjs is not a pack — discovery skips it, so does this.
const MOUNT_PACKS = join(SHARED_SUBDIR, 'packs');
const display = (p) => p.split(sep).join('/');

const rule = {
  id: 'claudinite-website-mount-declared',
  severity: 'blocking',
  description: 'Every pack vendored into .claudinite/shared/packs/ is declared in .claudinite-checks.json',
  doc: '.claudinite/local/packs/claudinite-website/RULES.md',
  why: 'a pack is activated by its declaration alone, so one vendored without an entry is dead weight in the mount — its rules, prose and skills silently never run',

  run(ctx) {
    const dir = join(ctx.root, MOUNT_PACKS);
    if (!existsSync(dir)) return [];
    if (ctx.config?.errors?.length) return [];

    let names;
    try {
      names = readdirSync(dir, { withFileTypes: true })
        .filter((d) => d.isDirectory()).map((d) => d.name).sort();
    } catch {
      return [];
    }

    const declared = new Set(ctx.config?.packs ?? []);
    const out = [];
    for (const name of names) {
      if (!existsSync(join(dir, name, 'pack.mjs'))) continue;
      if (declared.has(name)) continue;
      out.push(finding(rule, {
        file: '.claudinite-checks.json',
        what: `the "${name}" pack is vendored at ${display(MOUNT_PACKS)}/${name}/ but no "packs" entry declares it`,
        fix: `add "${name}" to "packs" in .claudinite-checks.json if the repo wants it, or drop it from the vendor set and re-run the canon's vendoring/apply-vendor-set.mjs — never hand-copy or hand-delete pack files`,
      }));
    }
    return out;
  },
};

export default rule;
