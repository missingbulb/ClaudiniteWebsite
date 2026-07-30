// This repo's own pack: conventions for the claudinite.com marketing site and
// for maintaining this repo's Claudinite mount. Prose + one bundled skill, no
// structural fingerprint of its own — the declaration in .claudinite-checks.json
// is authoritative (detect: null skips the drift check in both directions).
export default {
  id: 'claudinite-website',
  ruleRoutingGuidance: {
    belongs: "conventions for the claudinite.com marketing site and for maintaining this repo's Claudinite mount",
    excludes: 'general site markup and product research — those are html and product-wiki',
  },
  marker: null,
  detect: null,
  prose: 'RULES.md',
  worldRules: [],
  skills: ['site-visual-check'],
};
