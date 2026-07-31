// This repo's own pack: conventions for the claudinite.com marketing site and
// for maintaining this repo's Claudinite mount. Prose, one bundled skill and one
// mount-upkeep rule, no structural fingerprint of its own — the declaration in
// .claudinite-checks.json is authoritative (detect: null skips the drift check in
// both directions).
import mountDeclared from './mount-declaration.mjs';

export default {
  id: 'claudinite-website',
  ruleRoutingGuidance: {
    belongs: "conventions for the claudinite.com marketing site and for maintaining this repo's Claudinite mount",
    excludes: 'general site markup and product research — those are html and product-wiki',
  },
  marker: null,
  detect: null,
  prose: 'RULES.md',
  worldRules: [mountDeclared],
  skills: ['site-visual-check'],
};
