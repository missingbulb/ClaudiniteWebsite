/* claudinite.com — behavior. Vanilla JS, no dependencies.
   Four jobs: reveal-on-scroll, the three mechanism animations (fleet sync,
   session terminal, baselining board, plus the adopt typewriter), and
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

  /* ------------------- hero: fleet sync diagram ------------------ */
  (function heroFleet() {
    var svg = document.getElementById('fleet-viz');
    if (!svg) return;
    var CX = 320, CY = 262;
    var repos = [
      { name: 'payments', x: 112, y: 92 },
      { name: 'web-app', x: 320, y: 46 },
      { name: 'infra', x: 532, y: 96 },
      { name: 'ml-service', x: 92, y: 328 },
      { name: 'cli', x: 548, y: 330 },
      { name: 'docs-site', x: 320, y: 468 },
    ];
    var links = document.getElementById('fleet-links');
    var pulses = document.getElementById('fleet-pulses');
    var nodesG = document.getElementById('fleet-repos');
    var W = 116, H = 38;

    repos.forEach(function (r, i) {
      var path = document.createElementNS(SVG_NS, 'path');
      path.setAttribute('d', 'M' + CX + ' ' + CY + ' L' + r.x + ' ' + r.y);
      path.dataset.i = i;
      links.appendChild(path);

      var g = document.createElementNS(SVG_NS, 'g');
      g.setAttribute('class', 'repo-node');
      g.dataset.i = i;
      var rect = document.createElementNS(SVG_NS, 'rect');
      rect.setAttribute('x', r.x - W / 2); rect.setAttribute('y', r.y - H / 2);
      rect.setAttribute('width', W); rect.setAttribute('height', H);
      rect.setAttribute('rx', 10);
      var label = document.createElementNS(SVG_NS, 'text');
      label.setAttribute('x', r.x - W / 2 + 12); label.setAttribute('y', r.y + 4.5);
      label.textContent = r.name;
      var status = document.createElementNS(SVG_NS, 'text');
      status.setAttribute('class', 'repo-status');
      status.setAttribute('x', r.x + W / 2 - 22); status.setAttribute('y', r.y + 4.5);
      status.textContent = '✓';
      g.appendChild(rect); g.appendChild(label); g.appendChild(status);
      nodesG.appendChild(g);
    });

    if (REDUCED) return;

    function nodeAt(i) { return nodesG.querySelector('[data-i="' + i + '"]'); }
    function linkAt(i) { return links.querySelector('[data-i="' + i + '"]'); }

    function sendPulse(i, done) {
      var r = repos[i];
      var c = document.createElementNS(SVG_NS, 'circle');
      c.setAttribute('class', 'pulse-dot');
      c.setAttribute('r', 5);
      c.setAttribute('cx', CX); c.setAttribute('cy', CY);
      c.style.transition = 'transform 0.9s cubic-bezier(.4,0,.6,1)';
      pulses.appendChild(c);
      linkAt(i).classList.add('hot');
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          c.style.transform = 'translate(' + (r.x - CX) + 'px,' + (r.y - CY) + 'px)';
        });
      });
      setTimeout(function () {
        pulses.removeChild(c);
        linkAt(i).classList.remove('hot');
        if (done) done();
      }, 920);
    }

    var driftIdx = null;
    function tick() {
      if (driftIdx === null) {
        driftIdx = Math.floor(Math.random() * repos.length);
        var g = nodeAt(driftIdx);
        g.classList.add('drift');
        g.querySelector('.repo-status').textContent = '✗';
        setTimeout(function () {
          sendPulse(driftIdx, function () {
            g.classList.remove('drift');
            g.classList.add('flash');
            g.querySelector('.repo-status').textContent = '✓';
            setTimeout(function () { g.classList.remove('flash'); }, 700);
            driftIdx = null;
          });
        }, 1300);
      } else {
        sendPulse(Math.floor(Math.random() * repos.length));
      }
    }
    tick();
    setInterval(tick, 4200);
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
