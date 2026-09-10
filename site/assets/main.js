/* claudinite.com — behavior. Vanilla JS, no dependencies.
   Jobs: reveal-on-scroll, the hero gates, the building, the ladder, the
   session terminal, the fleet board, the adopt typewriter, and rendering the
   promoted-content slots from data/promoted.js. Every figure is authored in
   its still frame in the markup; this file only moves things, and does not
   under prefers-reduced-motion. */
(function () {
  'use strict';

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DATA = window.CLAUDINITE || null;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  // Runs fn once, the first time node scrolls into view.
  function onceVisible(node, threshold, fn) {
    if (!('IntersectionObserver' in window)) { fn(); return; }
    var seen = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !seen) { seen = true; fn(); io.disconnect(); }
      });
    }, { threshold: threshold });
    io.observe(node);
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

  /* --------------------- hero: the two gates ---------------------
     Three changes travel their lanes. One fails the Stop gate and goes back to
     its session with the fix; one fails the CI gate the same way; what passes
     both lands on main. Positions are the svg's own x coordinates. */
  (function gates() {
    var svg = document.getElementById('gates-viz');
    if (!svg || REDUCED) return;

    var X = { session: 166, gate1: 392, gate2: 660, main: 788 };
    var LANES = [82, 180, 278];
    var chips = [1, 2, 3].map(function (i) { return document.getElementById('chip-' + i); });
    var tags = [document.getElementById('tag-1'), document.getElementById('tag-2')];
    var lamps = [document.querySelector('#gate-1 .gt-lamp'), document.querySelector('#gate-2 .gt-lamp')];
    var landed = Array.prototype.slice.call(svg.querySelectorAll('.gt-landed'));
    var timers = [];
    var slot = 0;

    function at(ms, fn) { timers.push(setTimeout(fn, ms)); }
    function place(chip, x, lane, ms) {
      chip.style.transition = ms ? 'transform ' + ms + 'ms linear, opacity 0.3s ease' : 'opacity 0.3s ease';
      chip.style.transform = 'translate(' + x + 'px, ' + lane + 'px)';
    }
    function state(chip, cls) {
      chip.classList.remove('chip-bad'); chip.classList.remove('chip-good');
      if (cls) chip.classList.add(cls);
    }
    function lamp(i, cls) {
      lamps[i].classList.remove('bad'); lamps[i].classList.remove('good');
      if (cls) lamps[i].classList.add(cls);
    }
    function tag(i, on, lane) {
      tags[i].style.transform = 'translate(' + (i === 0 ? X.gate1 - 74 : X.gate2 - 74) + 'px, ' + lane + 'px)';
      tags[i].classList.toggle('on', on);
    }
    function land(chip) {
      chip.classList.remove('on');
      if (slot >= landed.length) { landed.forEach(function (r) { r.classList.remove('on'); }); slot = 0; }
      landed[slot++].classList.add('on');
    }

    function reset() {
      timers.forEach(clearTimeout); timers = [];
      chips.forEach(function (c, i) { c.classList.remove('on'); state(c, null); place(c, X.session, LANES[i], 0); });
      tags.forEach(function (t) { t.classList.remove('on'); });
      lamp(0, null); lamp(1, null);
      if (slot === 0) landed.forEach(function (r) { r.classList.remove('on'); });
    }

    // One change's trip: out to a gate, and either through or back.
    function travel(chip, lane, t0, failAt, done) {
      var t = t0;
      at(t, function () { chip.classList.add('on'); });
      at(t + 100, function () { place(chip, X.gate1, lane, 1300); }); t += 1500;
      if (failAt === 1) {
        at(t, function () { state(chip, 'chip-bad'); lamp(0, 'bad'); tag(0, true, lane); });
        at(t + 900, function () { place(chip, X.session, lane, 1100); lamp(0, null); }); t += 2100;
        at(t, function () { state(chip, null); tag(0, false, lane); });
        at(t + 500, function () { place(chip, X.gate1, lane, 1300); }); t += 1900;
      }
      at(t, function () { state(chip, 'chip-good'); lamp(0, 'good'); });
      at(t + 300, function () { place(chip, X.gate2, lane, 1200); lamp(0, null); }); t += 1600;
      if (failAt === 2) {
        at(t, function () { state(chip, 'chip-bad'); lamp(1, 'bad'); tag(1, true, lane); });
        at(t + 900, function () { place(chip, X.session, lane, 1900); lamp(1, null); }); t += 2900;
        at(t, function () { state(chip, null); tag(1, false, lane); });
        at(t + 500, function () { place(chip, X.gate1, lane, 1300); }); t += 1900;
        at(t, function () { state(chip, 'chip-good'); lamp(0, 'good'); });
        at(t + 300, function () { place(chip, X.gate2, lane, 1200); lamp(0, null); }); t += 1600;
      }
      at(t, function () { lamp(1, 'good'); });
      at(t + 300, function () { place(chip, X.main, lane, 700); lamp(1, null); }); t += 1100;
      at(t, function () { land(chip); });
      if (done) at(t + 1400, done);
      return t;
    }

    function play() {
      reset();
      var end = 0;
      end = Math.max(end, travel(chips[0], LANES[0], 0, 1));
      end = Math.max(end, travel(chips[1], LANES[1], 900, 2));
      end = Math.max(end, travel(chips[2], LANES[2], 1800, 0));
      at(end + 1600, play);
    }

    var replay = document.getElementById('gates-replay');
    if (replay) replay.addEventListener('click', play);
    onceVisible(svg, 0.25, play);
  })();

  /* ------------------- the building settles ---------------------
     The markup is authored settled; dropping the class and putting it back
     runs the per-floor transitions in style.css. */
  (function building() {
    var svg = document.getElementById('building-viz');
    if (!svg || REDUCED) return;

    function play() {
      svg.classList.remove('settled'); svg.classList.remove('pulse');
      void svg.getBoundingClientRect();
      svg.classList.add('settled'); svg.classList.add('pulse');
    }

    var replay = document.getElementById('building-replay');
    if (replay) replay.addEventListener('click', play);
    svg.classList.remove('settled');
    onceVisible(svg, 0.35, play);
  })();

  /* ---------------------- the ladder climbs ---------------------
     One rule token climbs from prose to setting; the meter drains beside it.
     The rungs' geometry is read live, so the token lands wherever the
     stylesheet put each tread at the current width. */
  (function ladder() {
    var box = document.getElementById('ladder');
    var token = document.getElementById('ladder-token');
    if (!box || !token) return;
    var rungs = Array.prototype.slice.call(box.querySelectorAll('.rung'));
    var timers = [];

    function setRung(n) {
      for (var i = 0; i < rungs.length; i++) box.classList.remove('at-' + i);
      box.classList.add('at-' + n);
      var rung = rungs[n];
      var tread = rung.querySelector('.rung-tread');
      var x = rung.offsetLeft + tread.offsetLeft + tread.offsetWidth - token.offsetWidth + 6;
      var y = rung.offsetTop - token.offsetHeight / 2 + 1;
      token.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    }

    if (REDUCED) { setRung(rungs.length - 1); window.addEventListener('resize', function () { setRung(rungs.length - 1); }); return; }

    var current = rungs.length - 1;
    function play() {
      timers.forEach(clearTimeout); timers = [];
      rungs.forEach(function (r, i) {
        timers.push(setTimeout(function () { current = i; setRung(i); }, i * 1100));
      });
      timers.push(setTimeout(play, rungs.length * 1100 + 2600));
    }
    window.addEventListener('resize', function () { setRung(current); });

    var replay = document.getElementById('ladder-replay');
    if (replay) replay.addEventListener('click', play);
    setRung(current);
    onceVisible(box, 0.4, play);
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
        // linger on the failing check and its why/fix line, so the story reads
        var idx = Number(l.getAttribute('data-t'));
        t += (idx === 6 || idx === 7) ? 1100 : 480;
      });
    }

    var replay = document.getElementById('term-replay');
    if (replay) replay.addEventListener('click', play);
    onceVisible(body, 0.35, play);
  })();

  /* ------------------- fleet board: the daily update ------------- */
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

    function update() {
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
    update();
    setInterval(update, 6400);
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
    onceVisible(target, 0.4, play);
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
