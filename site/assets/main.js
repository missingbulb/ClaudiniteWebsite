/* claudinite.com — behavior. Vanilla JS, no dependencies.
   Four jobs: reveal-on-scroll, the hero compounding chart, the mechanism
   animations (session terminal, baselining board, adopt typewriter), and
   rendering the promoted-content slots from data/promoted.js.
   All motion is skipped under prefers-reduced-motion. */
(function () {
  'use strict';

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DATA = window.CLAUDINITE || null;
  var SVG_NS = 'http://www.w3.org/2000/svg';

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  /* ---------------------- reveal on scroll ---------------------- */
  var revealed = document.querySelectorAll('.reveal');
  if (REDUCED || !('IntersectionObserver' in window)) {
    revealed.forEach(function (n) { n.classList.add('in'); });
  } else {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); }
      });
    }, { threshold: 0.18 });
    revealed.forEach(function (n) { ro.observe(n); });
  }

  /* ------------- hero: the compounding chart -------------------
     The curves and the meters' end states are authored in the markup, so the
     page states its argument with scripting off. This only animates the way
     in: a left-to-right sweep over the curves, the meters filling beneath it,
     and the prose-only meter pinning at full exactly where its curve flattens.
     Geometry constants mirror the SVG's own coordinates. */
  (function compoundChart() {
    var svg = document.getElementById('compound-viz');
    if (!svg) return;
    var clip = document.getElementById('cx-clip-rect');
    var fillProse = document.getElementById('cx-fill-prose');
    var fillClaud = document.getElementById('cx-fill-claud');
    var pin = document.getElementById('cx-pin');
    var replay = document.getElementById('cx-replay');

    var SWEEP = 554, METER = 426;
    var PIN_T = 0.55;             // prose fills the budget here, and stops climbing
    var LATE_T = 0.72;            // the curves are far enough along to be named
    var PROMOS = [0.30, 0.50, 0.66, 0.79, 0.90];  // promotions, arriving faster
    var FREED = 0.30;             // budget each promotion hands back
    var FLOOR = 0.10;
    var DUR = 7200, HOLD = 2800;

    function proseFill(t) { return Math.min(1, t / PIN_T); }
    function claudFill(t) {
      var freed = 0;
      for (var i = 0; i < PROMOS.length; i++) if (t >= PROMOS[i]) freed += FREED;
      return Math.max(FLOOR, Math.min(1, t / PIN_T - freed));
    }

    function draw(t) {
      clip.setAttribute('width', SWEEP * t);
      fillProse.setAttribute('width', METER * proseFill(t));
      fillClaud.setAttribute('width', METER * claudFill(t));
      svg.classList.toggle('cx-pinned', t >= PIN_T);
      svg.classList.toggle('cx-late', t >= LATE_T);
    }

    // With motion suppressed the authored end state is already correct.
    if (REDUCED) { svg.classList.add('cx-pinned'); svg.classList.add('cx-late'); return; }

    var raf = null, timer = null, promoIdx = 0;

    function flash() {
      fillClaud.classList.remove('cx-freed');
      void fillClaud.getBoundingClientRect();   // restart the animation
      fillClaud.classList.add('cx-freed');
    }

    function play() {
      if (raf) cancelAnimationFrame(raf);
      if (timer) clearTimeout(timer);
      promoIdx = 0;
      var start = null;
      svg.classList.add('cx-running');
      (function step(now) {
        if (start === null) start = now;
        var t = Math.min(1, (now - start) / DUR);
        draw(t);
        while (promoIdx < PROMOS.length && t >= PROMOS[promoIdx]) { flash(); promoIdx++; }
        if (t < 1) raf = requestAnimationFrame(step);
        else { svg.classList.remove('cx-running'); timer = setTimeout(play, HOLD); }
      })(performance.now());
    }

    if (replay) replay.addEventListener('click', play);

    draw(0);
    if (!('IntersectionObserver' in window)) { play(); return; }
    var seen = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !seen) { seen = true; play(); io.disconnect(); }
      });
    }, { threshold: 0.3 });
    io.observe(svg);
  })();

  /* ------------------ session-loop terminal ---------------------- */
  (function sessionTerm() {
    var body = document.getElementById('term-body');
    if (!body) return;
    var lines = Array.prototype.slice.call(body.querySelectorAll('.t-line'));
    var timers = [];

    function play() {
      timers.forEach(clearTimeout); timers = [];
      lines.forEach(function (l) { l.classList.remove('on'); });
      if (REDUCED) { lines.forEach(function (l) { l.classList.add('on'); }); return; }
      var t = 200;
      lines.forEach(function (l) {
        timers.push(setTimeout(function () { l.classList.add('on'); }, t));
        // linger on the failing check and its fix line, so the story reads
        var idx = Number(l.dataset.t);
        t += (idx === 5 || idx === 6) ? 1100 : 480;
      });
    }

    var replay = document.getElementById('term-replay');
    if (replay) replay.addEventListener('click', play);

    if (!('IntersectionObserver' in window)) { play(); return; }
    var seen = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !seen) { seen = true; play(); io.disconnect(); }
      });
    }, { threshold: 0.35 });
    io.observe(body);
  })();

  /* ------------------- fleet board: baselining ------------------- */
  (function fleetBoard() {
    var grid = document.getElementById('repo-grid');
    if (!grid) return;
    var names = ['payments', 'web-app', 'infra', 'ml-service', 'cli', 'docs-site', 'mobile', 'data-etl'];
    var REFS = ['e20584a', (DATA && DATA.canonRef) || '005edd2', '8b31f77'];
    var canonRefEl = document.getElementById('canon-ref');
    var pulse = document.getElementById('canon-pulse');
    var tiles = names.map(function (n) {
      var d = el('div', 'repo-tile');
      d.appendChild(el('span', 'r-name', n));
      d.appendChild(el('span', 'r-ref', REFS[0]));
      grid.appendChild(d);
      return d;
    });

    var cur = 1; // canon starts one ref ahead of the fleet
    if (canonRefEl) canonRefEl.textContent = REFS[cur];
    if (REDUCED) {
      tiles.forEach(function (t) {
        t.classList.add('fresh');
        t.querySelector('.r-ref').textContent = REFS[cur];
      });
      return;
    }
    tiles.forEach(function (t) { t.classList.add('stale'); });

    function baseline() {
      if (pulse) { pulse.classList.remove('go'); void pulse.offsetWidth; pulse.classList.add('go'); }
      tiles.forEach(function (t, i) {
        setTimeout(function () {
          t.classList.remove('stale');
          t.classList.add('fresh');
          t.querySelector('.r-ref').textContent = REFS[cur];
        }, 250 + i * 110);
      });
      // the canon moves on; the fleet is briefly behind again — that's the loop
      setTimeout(function () {
        cur = (cur + 1) % REFS.length;
        if (canonRefEl) canonRefEl.textContent = REFS[cur];
        tiles.forEach(function (t) { t.classList.remove('fresh'); t.classList.add('stale'); });
      }, 4600);
    }
    baseline();
    setInterval(baseline, 6400);
  })();

  /* --------------------- adopt: typewriter ----------------------- */
  (function adoptType() {
    var target = document.getElementById('type-target');
    var result = document.getElementById('adopt-result');
    if (!target || !result) return;
    var TEXT = 'Adopt Claudinite — follow missingbulb/Claudinite’s bootstrap.md';

    if (REDUCED) { target.textContent = TEXT; result.classList.add('on'); return; }

    var started = false;
    function play() {
      if (started) return; started = true;
      var i = 0;
      (function step() {
        target.textContent = TEXT.slice(0, i);
        if (i <= TEXT.length) { i++; setTimeout(step, 26); }
        else setTimeout(function () { result.classList.add('on'); }, 350);
      })();
    }
    if (!('IntersectionObserver' in window)) { play(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { play(); io.disconnect(); } });
    }, { threshold: 0.4 });
    io.observe(target);
  })();

  /* -------------- promoted-content slots (data-driven) ----------- */
  (function renderPromoted() {
    if (!DATA) return;
    try {
      var stats = document.getElementById('stats-slot');
      if (stats && DATA.stats) DATA.stats.forEach(function (s) {
        var d = el('div', 'stat');
        d.appendChild(el('b', null, s.n));
        d.appendChild(el('span', null, s.label));
        stats.appendChild(d);
      });

      var spot = document.getElementById('spotlight-slot');
      if (spot && DATA.spotlight) DATA.spotlight.forEach(function (s) {
        var d = el('article', 'spot');
        d.appendChild(el('h3', null, s.title));
        d.appendChild(el('p', null, s.tag));
        spot.appendChild(d);
      });

    } catch (err) {
      // A malformed promoted.js must never blank the page — evergreen sections
      // stand on their own; the canon link still gets people there.
      if (window.console) console.error('promoted-content render failed:', err);
    }
  })();
})();
