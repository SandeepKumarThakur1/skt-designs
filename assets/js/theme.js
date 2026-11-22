/* SKT — theme switch with a "spark" transition + section interactions */
(function () {
  var d = document.documentElement;
  var STAR = '<svg viewBox="0 0 24 24"><path d="M12 0C13 7 17 11 24 12C17 13 13 17 12 24C11 17 7 13 0 12C7 11 11 7 12 0Z" fill="currentColor"/></svg>';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function set(t) { d.setAttribute('data-theme', t); try { localStorage.setItem('skt-theme', t); } catch (e) {} 
    var m = document.querySelector('meta[name="theme-color"]'); if (m) m.content = t === 'light' ? '#F5F0E8' : '#0B0B0B';
    document.querySelectorAll('.theme-btn').forEach(function (b) { b.setAttribute('aria-pressed', t === 'light'); b.setAttribute('aria-label', t === 'light' ? 'Switch to dark mode' : 'Switch to light mode'); });
  }
  set(d.getAttribute('data-theme') || 'dark');

  function burst(x, y, next) {
    var fx = document.createElement('div'); fx.className = 'ts-fx';
    var cols = ['#E21E34', '#7038E2', '#FF3D5E', '#F8D9A6', '#C9B8FF'];
    var h = '<span class="ts-ring" style="left:' + x + 'px;top:' + y + 'px"></span><span class="ts-ring r2" style="left:' + x + 'px;top:' + y + 'px"></span>';
    for (var i = 0; i < 26; i++) {
      var a = Math.random() * Math.PI * 2, r = 120 + Math.random() * 320;
      h += '<span class="ts-p" style="left:' + x + 'px;top:' + y + 'px;--s:' + (8 + Math.random() * 22) + 'px;--c:' + cols[i % 5] + ';--x:' + (Math.cos(a) * r).toFixed(0) + 'px;--y:' + (Math.sin(a) * r).toFixed(0) + 'px;--rot:' + (Math.random() * 540 - 270).toFixed(0) + 'deg;animation-delay:' + (Math.random() * .15).toFixed(2) + 's">' + STAR + '</span>';
    }
    fx.innerHTML = h; document.body.appendChild(fx);
    setTimeout(function () { fx.remove(); }, 1700);
  }

  function toggle(e) {
    var next = d.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    var r = e.currentTarget.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    if (reduce) { set(next); return; }
    if (document.startViewTransition) {
      var vt = document.startViewTransition(function () { set(next); });
      vt.ready.then(function () {
        var end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
        // a 4-point star that grows from the button, then a full circle
        d.animate({ clipPath: [
          'polygon(' + x + 'px ' + y + 'px,' + x + 'px ' + y + 'px,' + x + 'px ' + y + 'px,' + x + 'px ' + y + 'px)',
          'circle(' + end * 1.05 + 'px at ' + x + 'px ' + y + 'px)'] }, { duration: 1, pseudoElement: '::view-transition-new(root)' });
        d.animate({ clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + end + 'px at ' + x + 'px ' + y + 'px)'] },
          { duration: 900, easing: 'cubic-bezier(.76,0,.24,1)', pseudoElement: '::view-transition-new(root)' });
      });
    } else set(next);
    burst(x, y, next);
  }
  document.querySelectorAll('.theme-btn').forEach(function (b) { b.addEventListener('click', toggle); });

  /* logo: replay intro animation on every hover-in and every page load */
  document.querySelectorAll('.logo').forEach(function (l) {
    l.addEventListener('mouseenter', function () { l.classList.add('replay'); void l.offsetWidth; l.classList.remove('replay'); });
  });

  /* before/after slider */
  document.querySelectorAll('[data-ba]').forEach(function (b) {
    var st = b.querySelector('.ba-stage'), rg = b.querySelector('.ba-range');
    function upd() { st.style.setProperty('--p', rg.value + '%'); }
    rg.addEventListener('input', upd); upd();
    // gentle hint animation once visible
    var io = 'IntersectionObserver' in window && new IntersectionObserver(function (en) {
      if (!en[0].isIntersecting) return; io.disconnect(); if (reduce) return;
      var t0 = null; function step(t) { t0 = t0 || t; var k = (t - t0) / 1600; if (k > 1) return;
        rg.value = 32 + Math.sin(k * Math.PI * 2) * 18; upd(); requestAnimationFrame(step); }
      requestAnimationFrame(step);
    }, { threshold: .5 }); if (io) io.observe(b);
  });

  /* mini bento reshuffle */
  var mb = document.querySelector('.mini-bento'), st = 0;
  if (mb && !reduce) setInterval(function () { st = (st + 1) % 3; mb.className = 'mini-bento' + (st === 1 ? ' alt' : st === 2 ? ' alt2' : ''); }, 2200);

  /* honest counters from project data */
  var P = window.SKT_PROJECTS || [];
  var vals = { countries: Object.keys(P.reduce(function (o, p) { var c = p.country != null ? p.country : (p.location || '').split(',').pop().trim(); if (c && c !== '—') o[c] = 1; return o; }, {})).length, projects: P.length, industries: Object.keys(P.reduce(function (o, p) { if (p.industry) o[p.industry] = 1; return o; }, {})).length };
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var target = vals[el.getAttribute('data-count')] || 0;
    var io2 = 'IntersectionObserver' in window ? new IntersectionObserver(function (en) {
      if (!en[0].isIntersecting) return; io2.disconnect(); var t0 = null;
      (function step(t) { t0 = t0 || t; var k = Math.min(1, (t - t0) / 1200); el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); })(performance.now());
    }) : null;
    if (io2) io2.observe(el); else el.textContent = target;
  });
})();

/* ===== v3 interactions ===== */
(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); }, $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };
  var P = window.SKT_PROJECTS || [];
  var ARR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  function shot(u) { return 'https://s0.wp.com/mshots/v1/' + encodeURIComponent(u) + '?w=1280&h=860&vpw=1440&vph=960'; }
  function loadShot(img, src) { var t = 0; img.onload = function () { if (img.naturalWidth < 600 && t < 8) { t++; setTimeout(function () { img.src = src + '&r=' + t; }, 3500); return; } img.classList.add('ok'); }; img.onerror = function () { img.remove(); }; img.src = src; }

  /* animated favicon — looping logo mark */
  (function () {
    var link = document.querySelector('link[rel="icon"]'); if (!link || reduce) return;
    var c = document.createElement('canvas'); c.width = c.height = 64; var x = c.getContext('2d'), t0 = performance.now(), last = 0;
    function star(r, s) { x.save(); x.rotate(r); x.scale(s, s); x.beginPath(); x.moveTo(0, -18); x.bezierCurveTo(1.2, -5.5, 5.5, -1.2, 18, 0); x.bezierCurveTo(5.5, 1.2, 1.2, 5.5, 0, 18); x.bezierCurveTo(-1.2, 5.5, -5.5, 1.2, -18, 0); x.bezierCurveTo(-5.5, -1.2, -1.2, -5.5, 0, -18); x.fillStyle = '#F5F0E8'; x.fill(); x.restore(); }
    function frame(now) {
      requestAnimationFrame(frame); if (now - last < 90) return; last = now;
      var t = (now - t0) / 1000; x.clearRect(0, 0, 64, 64); x.save(); x.translate(32, 32);
      x.beginPath(); x.arc(0, 0, 32, 0, Math.PI * 2); x.fillStyle = '#E21E34'; x.fill();
      var a = (t / 4) * Math.PI * 2; x.beginPath(); x.moveTo(0, 0); x.arc(0, 0, 32, a, a + Math.PI / 2); x.closePath(); x.fillStyle = '#7038E2'; x.fill();
      x.strokeStyle = '#F8D9A6'; x.lineWidth = 1.8; x.beginPath(); x.moveTo(-19, -19); x.lineTo(19, 19); x.moveTo(19, -19); x.lineTo(-19, 19); x.stroke();
      var k = (Math.sin(t * 2) + 1) / 2; star(k * Math.PI / 4, 1 - k * .22);
      x.beginPath(); x.arc(0, 0, 3, 0, Math.PI * 2); x.fillStyle = '#E21E34'; x.fill(); x.restore();
      link.href = c.toDataURL('image/png');
    }
    requestAnimationFrame(frame);
  })();

  /* hero build machine */
  $$('.hm').forEach(function (h) {
    var st = $$('.hm-st', h), steps = $$('.hm-steps i', h), i = 0; if (reduce) return;
    setInterval(function () { i = (i + 1) % st.length; st.forEach(function (s, j) { s.classList.toggle('on', j === i); }); steps.forEach(function (s, j) { s.classList.toggle('on', j === i); }); }, 2600);
  });

  /* story path */
  $$('[data-path]').forEach(function (list) {
    var items = $$('.path-item', list), line = $('.path-line', list);
    function up() {
      var vh = innerHeight * .7, r = list.getBoundingClientRect();
      line.style.setProperty('--prog', Math.max(0, Math.min(1, (vh - r.top) / r.height)));
      items.forEach(function (it) { if (it.getBoundingClientRect().top < vh) it.classList.add('on'); else it.classList.remove('on'); });
    }
    addEventListener('scroll', up, { passive: true }); addEventListener('resize', up); up();
  });

  /* services explorer */
  $$('[data-svx]').forEach(function (box) {
    var tabs = $$('.svx-tab', box), panels = $$('.svx-panel', box), i = 0, timer;
    function go(n, user) {
      i = n; tabs.forEach(function (t, j) { t.classList.toggle('on', j === n); t.setAttribute('aria-selected', j === n); });
      panels.forEach(function (p, j) { p.classList.toggle('on', j === n); });
      if (user) { box.classList.add('paused'); clearInterval(timer); }
    }
    tabs.forEach(function (t, j) { t.addEventListener('click', function () { go(j, true); }); });
    if (!reduce) timer = setInterval(function () { if (!box.classList.contains('paused')) go((i + 1) % tabs.length); }, 6000);
  });

  /* horizontal rails: buttons, drag, progress */
  function rail(track, prev, next, prog) {
    if (!track) return;
    function step() { var c = track.querySelector('.p-card,.day'); return c ? c.getBoundingClientRect().width + 16 : 400; }
    prev && prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
    next && next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
    function up() { if (!prog) return; var m = track.scrollWidth - track.clientWidth; var v = m > 0 ? track.scrollLeft / m : 1; prog.style.transform = 'scaleX(' + (.15 + v * .85) + ')'; }
    track.addEventListener('scroll', up, { passive: true }); setTimeout(up, 600);
    var down = false, sx = 0, sl = 0, moved = false;
    track.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = track.scrollLeft; });
    addEventListener('pointermove', function (e) { if (!down) return; var dx = e.clientX - sx; if (Math.abs(dx) > 5) { moved = true; track.classList.add('drag'); } track.scrollLeft = sl - dx; });
    addEventListener('pointerup', function () { if (!down) return; down = false; setTimeout(function () { track.classList.remove('drag'); }, 30); });
  }
  rail($('.work-track[data-projects]'), $('[data-rail-prev]'), $('[data-rail-next]'), $('.rail-prog b'));
  rail($('.day-track'));

  /* flip cards on tap */
  $$('.side').forEach(function (b) { b.addEventListener('click', function () { b.classList.toggle('flip'); }); });

  /* client marquee */
  $$('[data-brands]').forEach(function (m) {
    var names = P.map(function (p) { return '<span>' + p.title + '</span>'; }).join('');
    m.innerHTML = '<div class="brand-track">' + names + names + '</div>';
  });

  /* projects: spotlight + stats */
  $$('[data-spotlight]').forEach(function (el) {
    var p = P[0]; if (!p) return;
    el.style.setProperty('--c1', p.c1);
    el.innerHTML = '<a class="spot-media" href="project-details.html?p=' + p.slug + '" aria-label="' + p.title + ' case study"><span class="spot-ph" aria-hidden="true"><i></i><b>' + (p.url || '').replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') + ' ↗</b></span><img alt="Screenshot of the ' + p.title + ' website" loading="lazy"></a>' +
      '<div class="spot-body"><span class="eyebrow" style="align-self:flex-start"><b>★</b>Featured project</span><h2 class="t-lg">' + p.title + '</h2><p class="lead">' + (p.summary || p.tagline || '') + '</p>' +
      '<div class="tags">' + [p.industry, p.location].concat(p.tech || []).filter(Boolean).slice(0, 6).map(function (t) { return '<span class="chip"><span class="dot"></span>' + t + '</span>'; }).join('') + '</div>' +
      '<div style="display:flex;flex-wrap:wrap;gap:12px"><a class="btn magnetic" href="project-details.html?p=' + p.slug + '">Read case study<span class="ic">' + ARR + '</span></a>' + (p.url ? '<a class="btn btn--ghost" href="' + p.url + '" target="_blank" rel="noopener">Visit site ↗</a>' : '') + '</div></div>';
    if (p.url) loadShot($('img', el), shot(p.url));
  });

  /* project details: industry text + similar projects */
  var slug = new URLSearchParams(location.search).get('p');
  var cur = P.filter(function (p) { return p.slug === slug; })[0] || P[0];
  if (cur) $$('[data-f="industry-lc"]').forEach(function (e) { e.textContent = (cur.industry || 'business').toLowerCase(); });
  $$('[data-similar]').forEach(function (t) {
    if (!cur) return;
    var sim = P.filter(function (p) { return p.slug !== cur.slug && p.cats.some(function (c) { return cur.cats.indexOf(c) > -1; }); });
    sim = sim.concat(P.filter(function (p) { return p.slug !== cur.slug && sim.indexOf(p) < 0; })).slice(0, 6);
    t.innerHTML = sim.map(function (p, i) {
      return '<a class="p-card" style="--c1:' + p.c1 + ';--c2:' + p.c2 + ';--c3:' + p.c3 + '" href="project-details.html?p=' + p.slug + '"><div class="p-top"><span>' + p.industry + '</span><span class="p-status' + (p.status === 'Live' ? ' live' : '') + '">' + (p.status || '') + '</span></div><div class="p-media"><img class="sim-img" alt="Screenshot of ' + p.title + '" loading="lazy"></div><div class="p-bar"><div><h3>' + p.title + '</h3><p>' + p.type + '</p></div><span class="p-go">' + ARR + '</span></div></a>';
    }).join('');
    $$('.sim-img', t).forEach(function (img, i) { if (sim[i].url) loadShot(img, shot(sim[i].url)); });
    rail(t);
  });
})();

/* About: watch your website come to life */
(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-bw]').forEach(function (bw) {
    var steps = [].slice.call(bw.querySelectorAll('.bw-step')), pct = [10, 25, 45, 70, 90, 100];
    var pctEl = bw.querySelector('.bw-pct b'), lbl = bw.querySelector('.bw-label'), prog = bw.querySelector('.bw-prog b');
    var i = 0, timer = null, resume = null, shown = pct[0];
    function count(to) { var from = shown, t0 = null; shown = to; (function f(t) { t0 = t0 || t; var k = Math.min(1, (t - t0) / 700); pctEl.textContent = Math.round(from + (to - from) * k); if (k < 1) requestAnimationFrame(f); })(performance.now()); }
    function go(n) {
      i = n; for (var k = 0; k < 6; k++) bw.classList.remove('k' + k);
      for (var k = 0; k <= n; k++) bw.classList.add('k' + k);
      if (n === 5) { bw.classList.remove('k5'); void bw.offsetWidth; bw.classList.add('k5'); }
      steps.forEach(function (s, j) { s.classList.toggle('on', j === n); s.classList.toggle('done', j < n); s.setAttribute('aria-current', j === n ? 'step' : 'false'); });
      lbl.textContent = steps[n].querySelector('b').textContent; prog.style.setProperty('--p', pct[n] / 100); count(pct[n]);
    }
    function play() { clearInterval(timer); if (reduce) return; timer = setInterval(function () { go((i + 1) % 6); }, 3200); }
    steps.forEach(function (s, j) { s.addEventListener('click', function () { go(j); bw.classList.add('paused'); clearInterval(timer); clearTimeout(resume); resume = setTimeout(function () { bw.classList.remove('paused'); play(); }, 9000); }); });
    go(0);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { if (en[0].isIntersecting) { if (!bw.classList.contains('paused')) play(); } else clearInterval(timer); }, { threshold: .35 }).observe(bw);
    else play();
  });
})();
