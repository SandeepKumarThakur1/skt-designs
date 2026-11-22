/* =========================================================
   SKT — Work showcase
   Projects page:  [data-wall] tilted screenshot wall · [data-showcase] presentation boards
                   [data-index] typographic index with floating preview · .sc-filter / .sc-view
   Case study:     [data-case] full case-study "deck" built from SKT_PROJECTS
   Screenshots come live from WordPress mShots. To use your own images, add
   image / imageMobile / imageFull / imageTablet paths to a project in projects.js.
   Load this BEFORE main.js so main.js can animate (.pop) what is rendered here.
   ========================================================= */
(function () {
  var P = window.SKT_PROJECTS || [];
  if (!P.length) return;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;
  var ARR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var OUT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9"/></svg>';

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function domain(u) { return (u || '').replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''); }
  function lum(hex) {
    var h = (hex || '#141414').replace('#', '');
    return (.299 * parseInt(h.substr(0, 2), 16) + .587 * parseInt(h.substr(2, 2), 16) + .114 * parseInt(h.substr(4, 2), 16));
  }
  function bd(p) { return p.board || p.brand || p.c1 || '#141414'; }
  function boardVars(p) { var c = bd(p), light = lum(c) > 150; return '--bd:' + c + ';--bt:' + (light ? '#141414' : '#F5F0E8') + ';--bm:' + (light ? 'rgba(20,20,20,.62)' : 'rgba(245,240,232,.68)'); }
  function isLight(p) { return lum(bd(p)) > 150; }
  function href(p) { return 'project-details.html?p=' + encodeURIComponent(p.slug); }

  var SIZES = {
    desk: '?w=1280&h=860&vpw=1440&vph=960',      // same as main.js — shares the browser cache
    mob: '?w=390&h=844&vpw=390&vph=844',
    tab: '?w=820&h=1100&vpw=820&vph=1100',
    full: '?w=1200&h=3000&vpw=1440&vph=3600'
  };
  var LOCAL = { desk: 'image', mob: 'imageMobile', tab: 'imageTablet', full: 'imageFull' };
  function shot(p, kind) {
    if (p[LOCAL[kind]]) return p[LOCAL[kind]];
    return p.url ? 'https://s0.wp.com/mshots/v1/' + encodeURIComponent(p.url) + SIZES[kind] : '';
  }
  function img(p, kind, alt, extra) {
    var s = shot(p, kind); if (!s) return '';
    return '<img alt="' + esc(alt || '') + '" decoding="async" data-sc-src="' + s + '"' + (extra || '') + '>';
  }
  /* mShots first returns a small "generating" picture — retry until the real one is ready */
  function load(scope) {
    var imgs = $$('img[data-sc-src]', scope);
    var start = function (im) {
      if (im._sc) return; im._sc = 1;
      var src = im.getAttribute('data-sc-src'), t = 0, remote = /mshots/.test(src);
      im.onload = function () {
        var gen = remote && im.naturalHeight <= im.naturalWidth && im.naturalWidth < 600;
        if (gen && t < 9) { t++; setTimeout(function () { im.src = src + '&r=' + t; }, 3200); return; }
        im.classList.add('ok'); var f = im.closest('[data-frame]'); if (f) f.classList.add('ok');
      };
      im.onerror = function () { im.classList.add('err'); };
      im.src = src;
    };
    if (!('IntersectionObserver' in window)) { imgs.forEach(start); return; }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); start(e.target); } });
    }, { rootMargin: '600px 0px' });
    imgs.forEach(function (i) { io.observe(i); });
  }
  function frameDesk(p, kind, cls) {
    return '<div class="sc-desk ' + (cls || '') + '" data-frame><div class="sc-bar"><i></i><i></i><i></i><span>' + esc(domain(p.url)) + '</span></div>' +
      '<div class="sc-screen"><span class="sc-ph" aria-hidden="true">' + esc(domain(p.url)) + '</span>' + img(p, kind || 'desk', 'Screenshot of the ' + p.title + ' website') + '</div></div>';
  }
  function framePhone(p, cls) {
    return '<div class="sc-phone ' + (cls || '') + '" data-frame><div class="sc-screen"><span class="sc-ph" aria-hidden="true">' + esc(p.title) + '</span>' + img(p, 'mob', p.title + ' on mobile') + '</div></div>';
  }
  function frameTab(p, cls) {
    return '<div class="sc-tab ' + (cls || '') + '" data-frame><div class="sc-screen"><span class="sc-ph" aria-hidden="true">' + esc(p.title) + '</span>' + img(p, 'tab', p.title + ' on tablet') + '</div></div>';
  }
  function statusChip(p) { return '<span class="sc-status' + (p.status === 'Live' ? ' live' : '') + '">' + esc(p.status || '') + '</span>'; }

  /* =========================================================
     PROJECTS PAGE
     ========================================================= */
  var wall = $('[data-wall]');
  if (wall) {
    var rows = [0, 1, 2].map(function (r) {
      var list = P.filter(function (_, i) { return i % 3 === r; });
      if (list.length < 5) list = list.concat(P.slice(0, 5 - list.length));
      var cells = list.map(function (p) {
        return '<a class="wall-slide" href="' + href(p) + '" tabindex="-1" style="' + boardVars(p) + '" data-frame>' +
          '<span class="sc-ph" aria-hidden="true">' + esc(p.title) + '</span>' + img(p, 'desk', '') +
          '<span class="wall-cap">' + esc(p.title) + '</span></a>';
      }).join('');
      return '<div class="wall-row' + (r === 1 ? ' rev' : '') + '" style="--d:' + (52 + r * 9) + 's"><div class="wall-track">' + cells + cells + '</div></div>';
    }).join('');
    wall.innerHTML = '<div class="wall-plane">' + rows + '</div>';
    load(wall);
  }

  var SPANS = [12, 6, 6, 7, 5, 5, 7];
  function board(p, i) {
    var words = esc(p.title).split(' ');
    var title = words.length > 1 ? words.slice(0, Math.ceil(words.length / 2)).join(' ') + '<br>' + words.slice(Math.ceil(words.length / 2)).join(' ') : words[0];
    var chips = [p.industry, p.location].concat((p.tech || []).slice(0, 1)).filter(Boolean)
      .map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');
    return '<a class="sc-board pop' + (isLight(p) ? ' is-light' : '') + '" href="' + href(p) + '" style="' + boardVars(p) + ';--i:' + (i % 2) + '" data-cats="' + p.cats.join(' ') + '" data-cursor="Open" data-label="' + esc(p.title) + '">' +
      '<div class="sc-info">' +
        '<div class="sc-meta"><span class="sc-n">' + pad(i + 1) + '<small>/' + pad(P.length) + '</small></span>' + statusChip(p) + '</div>' +
        '<div class="sc-copy"><span class="sc-kicker">' + esc(p.type) + '</span><h3 class="sc-title">' + title + '</h3><p class="sc-tag">' + esc(p.tagline || '') + '</p></div>' +
        '<div class="sc-foot"><ul class="sc-chips">' + chips + '</ul><span class="sc-go">Case study<span class="ic">' + ARR + '</span></span></div>' +
      '</div>' +
      '<div class="sc-stage" aria-hidden="true"><span class="sc-big">' + esc(p.title.split(' ')[0]) + '</span>' + frameDesk(p) + framePhone(p) + '</div>' +
    '</a>';
  }
  function row(p, i) {
    return '<a class="sc-row" href="' + href(p) + '" data-cats="' + p.cats.join(' ') + '" data-peek="' + esc(shot(p, 'desk')) + '" style="' + boardVars(p) + '" data-cursor="Open">' +
      '<span class="r-n">' + pad(i + 1) + '</span><span class="r-t">' + esc(p.title) + '<img alt="" loading="lazy" class="r-thumb" data-sc-src="' + shot(p, 'desk') + '"></span>' +
      '<span class="r-i">' + esc(p.industry) + '</span><span class="r-l">' + esc(p.location) + '</span><span class="r-k">' + esc((p.tech || [])[0] || p.type) + '</span>' +
      '<span class="r-go">' + OUT + '</span></a>';
  }
  var grid = $('[data-showcase]'), index = $('[data-index]');
  if (grid) { grid.innerHTML = P.map(board).join(''); load(grid); }
  if (index) {
    index.innerHTML = '<div class="sc-row sc-row--head" aria-hidden="true"><span class="r-n">No.</span><span class="r-t">Project</span><span class="r-i">Industry</span><span class="r-l">Location</span><span class="r-k">Built with</span><span class="r-go"></span></div>' + P.map(row).join('');
    load(index);
    /* floating preview that follows the cursor */
    if (fine) {
      var peek = document.createElement('div'); peek.className = 'sc-peek'; peek.setAttribute('aria-hidden', 'true');
      peek.innerHTML = '<div class="sc-peek-in"><img alt=""></div>'; document.body.appendChild(peek);
      var pim = $('img', peek), x = 0, y = 0, cx = 0, cy = 0, raf = 0;
      var tick = function () { cx += (x - cx) * .16; cy += (y - cy) * .16; peek.style.transform = 'translate(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px)'; raf = Math.abs(x - cx) + Math.abs(y - cy) > .5 ? requestAnimationFrame(tick) : 0; };
      index.addEventListener('mousemove', function (e) { x = e.clientX; y = e.clientY; if (!raf) raf = requestAnimationFrame(tick); });
      $$('.sc-row[data-peek]', index).forEach(function (r) {
        r.addEventListener('mouseenter', function () {
          var thumb = $('.r-thumb', r);
          pim.src = thumb && thumb.classList.contains('ok') ? thumb.src : r.getAttribute('data-peek');
          peek.style.setProperty('--bd', getComputedStyle(r).getPropertyValue('--bd'));
          peek.classList.add('on');
        });
        r.addEventListener('mouseleave', function () { peek.classList.remove('on'); });
      });
    }
  }
  /* filters */
  $$('.sc-filter').forEach(function (b) {
    var f = b.getAttribute('data-filter');
    var sup = document.createElement('sup');
    sup.textContent = f === 'all' ? P.length : P.filter(function (p) { return p.cats.indexOf(f) > -1; }).length;
    b.appendChild(sup);
    b.addEventListener('click', function () {
      $$('.sc-filter').forEach(function (x) { x.classList.toggle('is-active', x === b); x.setAttribute('aria-pressed', String(x === b)); });
      var shown = 0;
      $$('.sc-board', grid).forEach(function (c) {
        var ok = f === 'all' || c.getAttribute('data-cats').split(' ').indexOf(f) > -1;
        c.classList.toggle('is-hidden', !ok);
        if (ok) { c.setAttribute('data-span', SPANS[shown % SPANS.length]); shown++; c.classList.remove('is-in'); void c.offsetWidth; c.classList.add('is-in'); }
      });
      $$('.sc-row[data-cats]', index).forEach(function (r) {
        r.classList.toggle('is-hidden', !(f === 'all' || r.getAttribute('data-cats').split(' ').indexOf(f) > -1));
      });
      var c = $('[data-shown]'); if (c) c.textContent = shown;
    });
  });
  $$('.sc-board', grid).forEach(function (c, i) { c.setAttribute('data-span', SPANS[i % SPANS.length]); });
  var shownEl = $('[data-shown]'); if (shownEl) shownEl.textContent = P.length;
  /* boards / index switch */
  $$('.sc-view').forEach(function (b) {
    b.addEventListener('click', function () {
      var v = b.getAttribute('data-view');
      $$('.sc-view').forEach(function (x) { x.classList.toggle('is-active', x === b); x.setAttribute('aria-pressed', String(x === b)); });
      if (grid) grid.hidden = v !== 'boards';
      if (index) { index.hidden = v !== 'index'; if (v === 'index') load(index); }
      try { sessionStorage.setItem('skt-view', v); } catch (e) {}
    });
  });
  try { if (sessionStorage.getItem('skt-view') === 'index') { var vb = $('.sc-view[data-view="index"]'); if (vb) vb.click(); } } catch (e) {}

  /* =========================================================
     CASE STUDY PAGE
     ========================================================= */
  var cs = $('[data-case]');
  if (!cs) return;
  var slug = new URLSearchParams(location.search).get('p');
  var idx = Math.max(0, P.findIndex(function (p) { return p.slug === slug; }));
  var p = P[idx], nx = P[(idx + 1) % P.length], pv = P[(idx - 1 + P.length) % P.length];
  var tech = (p.tech && p.tech.length) ? p.tech : [];
  var feats = p.features || [];
  var dom = domain(p.url);
  document.title = p.title + ' — Case Study · Sandeep K. Thakur';
  var md = $('meta[name="description"]'); if (md) md.setAttribute('content', p.title + ': ' + (p.summary || p.tagline || '') + ' A website case study by Sandeep K. Thakur.');
  cs.setAttribute('style', boardVars(p));
  if (isLight(p)) cs.classList.add('is-light');

  var words = esc(p.title).split(' ');
  var visit = p.url ? '<a class="btn btn--light magnetic" href="' + esc(p.url) + '" target="_blank" rel="noopener" data-label="Visit">Visit live website<span class="ic">' + ARR + '</span></a>' : '';
  var slideN = 0, TOTAL = 7;
  function lab(name) { slideN++; return '<span class="cs-lab"><b>' + pad(slideN) + '</b><i>/' + pad(TOTAL) + '</i>' + name + '</span>'; }

  var html = '' +
  /* 01 — cover */
  '<section class="page-hero cs-sec"><div class="container"><div class="cs-cover pop" data-hero style="--i:0">' +
    '<div class="cs-top"><div class="crumbs"><a href="index.html">Home</a><span>/</span><a href="projects.html">Projects</a><span>/</span><span>' + esc(p.title) + '</span></div>' +
      '<span class="cs-count">Case study ' + pad(idx + 1) + ' / ' + pad(P.length) + '</span></div>' +
    '<div class="cs-cover-grid">' +
      '<div class="cs-cover-copy">' +
        '<span class="cs-kicker">' + statusChip(p) + esc(p.type) + '</span>' +
        '<h1 class="cs-title">' + words.map(function (w, i) { return '<span style="--w:' + i + '">' + w + '</span>'; }).join(' ') + '</h1>' +
        '<p class="cs-tagline">' + esc(p.tagline || '') + '</p>' +
        '<div class="cs-cover-info"><div><small>Project for</small><b>' + esc(p.industry) + '</b></div><div><small>Location</small><b>' + esc(p.location) + '</b></div>' +
          (p.url ? '<div><small>Find it at</small><a href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(dom) + ' ↗</a></div>' : '') + '</div>' +
        '<div class="cs-actions">' + visit + '<a class="cs-jump" href="#cs-brief">Read the case study ↓</a></div>' +
      '</div>' +
      '<div class="cs-collage" aria-hidden="true">' +
        frameDesk(p, 'desk', 'cs-c-desk') + framePhone(p, 'cs-c-phone') +
        '<div class="cs-c-crop" data-frame><span class="sc-ph">' + esc(dom) + '</span>' + img(p, 'desk', '') + '</div>' +
        '<span class="cs-c-star"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C13 7 17 11 24 12C17 13 13 17 12 24C11 17 7 13 0 12C7 11 11 7 12 0Z"/></svg></span>' +
      '</div>' +
    '</div>' +
  '</div></div></section>' +

  /* numbers strip */
  '<section class="section-tight cs-sec"><div class="container"><div class="bento">' +
    '<div class="tile tile--dark cs-num c-3 pop" style="--i:0"><span class="tile-label">Key pages &amp; features</span><b>' + pad(feats.length) + '</b></div>' +
    '<div class="tile tile--dark cs-num c-3 pop" style="--i:1"><span class="tile-label">Tools &amp; tech</span><b>' + (tech.length ? pad(tech.length) : '—') + '</b></div>' +
    '<div class="tile tile--dark cs-num c-3 pop" style="--i:2"><span class="tile-label">Screen sizes shown</span><b>03</b></div>' +
    '<div class="tile cs-num cs-num--bd c-3 pop" style="--i:3"><span class="tile-label">Status</span><b class="cs-num-s">' + esc(p.status) + '</b><span class="cs-num-sub">' + esc(p.location) + '</span></div>' +
  '</div></div></section>' +

  /* 02 — brief */
  '<section class="section-tight cs-sec" id="cs-brief"><div class="container"><div class="bento">' +
    '<div class="tile c-7 pop cs-brief" style="--i:0">' + lab('The brief') + '<p class="cs-lead">' + esc(p.summary || p.tagline || '') + '</p>' +
      '<dl class="cs-dl"><div><dt>Client</dt><dd>' + esc(p.title) + '</dd></div><div><dt>Industry</dt><dd>' + esc(p.industry) + '</dd></div><div><dt>Project</dt><dd>' + esc(p.type) + '</dd></div><div><dt>Website</dt><dd>' + (p.url ? '<a href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(dom) + ' ↗</a>' : '—') + '</dd></div></dl></div>' +
    '<div class="tile tile--soft c-5 pop" style="--i:1">' + lab('What I built') + '<ol class="cs-feats">' + feats.map(function (f, i) { return '<li style="--i:' + i + '"><span>' + pad(i + 1) + '</span>' + esc(f) + '</li>'; }).join('') + '</ol></div>' +
  '</div></div></section>' +

  /* 03 — full page */
  '<section class="section-tight cs-sec"><div class="container"><div class="tile cs-scroll-tile c-12 pop" style="--i:0">' +
    '<div class="cs-head">' + lab('The full page') + '<p class="muted">' + (fine ? 'Hover to pause' : 'Auto-scrolling') + ' — the live homepage from top to bottom.</p></div>' +
    '<div class="cs-scroll" data-frame><div class="sc-bar"><i></i><i></i><i></i><span>' + esc(dom) + '</span></div>' +
      '<div class="cs-scroll-view"><span class="sc-ph">' + esc(dom) + '</span>' + img(p, 'full', 'Full-page screenshot of the ' + p.title + ' homepage') + '</div></div>' +
  '</div></div></section>' +

  /* 04 — devices */
  '<section class="section-tight cs-sec"><div class="container"><div class="tile cs-devices c-12 pop" style="--i:0">' +
    '<div class="cs-head">' + lab('Every screen') + '<p class="muted">Desktop, tablet and mobile — responsive by design.</p></div>' +
    '<div class="cs-dev-stage" aria-hidden="true">' + frameTab(p, 'cs-d-tab') + frameDesk(p, 'desk', 'cs-d-desk') + framePhone(p, 'cs-d-phone') + '</div>' +
  '</div></div></section>' +

  /* 05 — project board */
  '<section class="section-tight cs-sec"><div class="container"><div class="bento cs-board">' +
    '<div class="tile cs-word c-8 pop" style="--i:0">' + lab('Project board') + '<span class="cs-word-big">' + esc(p.title) + '</span><span class="cs-word-dom">' + esc(dom) + '</span></div>' +
    '<div class="tile cs-b-phone c-4 pop" style="--i:1">' + framePhone(p, 'cs-bp') + '</div>' +
    '<div class="tile tile--dark c-4 pop" style="--i:0"><span class="tile-label">Built with</span><ul class="cs-tech">' + (tech.length ? tech : ['Details coming soon']).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div>' +
    '<div class="tile c-4 pop cs-swatch" style="--i:1"><span class="tile-label">Board colour</span><div class="cs-sw"><i style="background:var(--bd)"></i><i style="background:color-mix(in srgb,var(--bd) 55%,#fff)"></i><i style="background:color-mix(in srgb,var(--bd) 22%,#fff)"></i><i style="background:#141414"></i></div><code>' + esc(bd(p).toUpperCase()) + '</code></div>' +
    '<div class="tile tile--blue c-4 pop" style="--i:2"><span class="tile-label">Tags</span><div class="cs-tags">' + (p.tags || []).concat([p.location]).filter(function (t, i, a) { return t && a.indexOf(t) === i; }).map(function (t) { return '<span class="chip">' + esc(t) + '</span>'; }).join('') + '</div></div>' +
  '</div></div></section>' +

  /* 06 — process */
  '<section class="section-tight cs-sec"><div class="container"><div class="tile c-12 pop pd-process" style="--i:0">' + lab('How it came together') +
    '<ol class="pdp"><li><b>Discover</b><span class="muted">Goals, audience and the pages ' + esc(p.title) + ' needed.</span></li><li><b>Design</b><span class="muted">Layouts and UI shaped around a ' + esc((p.industry || 'business').toLowerCase()) + ' audience.</span></li><li><b>Build</b><span class="muted">' + (tech.length ? 'Developed with ' + esc(tech.slice(0, 2).join(', ')) + ', responsive' : 'Developed to be responsive') + ' on every screen.</span></li><li><b>Launch</b><span class="muted">Tested and handed over. Status: ' + esc(p.status) + '.</span></li></ol>' +
  '</div></div></section>' +

  /* 07 — more + next */
  '<section class="section-tight cs-sec" style="padding-bottom:clamp(56px,8vw,120px)"><div class="container"><div class="bento">' +
    '<div class="tile tile--soft c-12 pop" style="--i:0">' + lab('More like this') + '<div class="work-rail"><div class="work-track" data-similar></div></div></div>' +
    (p.url ? '<a class="tile tile--blue c-12 pop c-tile" href="' + esc(p.url) + '" target="_blank" rel="noopener" style="flex-direction:row;flex-wrap:wrap;justify-content:space-between;align-items:center"><div style="display:flex;flex-direction:column;gap:8px"><span class="tile-label">See it live</span><span class="t-lg">' + esc(dom) + '</span><span class="muted">' + (p.status === 'Live' ? 'The website is live — have a look around.' : 'This project is in progress — preview the current version.') + '</span></div><span class="btn btn--light" style="pointer-events:none">Open website<span class="ic">' + ARR + '</span></span></a>' : '') +
    '<a class="tile cs-prev c-4 pop" href="' + href(pv) + '" data-cursor="Prev" style="' + boardVars(pv) + '"><span class="tile-label">← Previous</span><span class="t-md">' + esc(pv.title) + '</span></a>' +
    '<a class="tile cs-next c-8 pop" href="' + href(nx) + '" data-cursor="Next" style="' + boardVars(nx) + '"><span class="tile-label">Next project →</span><span class="t-xl">' + esc(nx.title) + '</span>' +
      '<div class="cs-next-shot" aria-hidden="true">' + frameDesk(nx, 'desk') + '</div></a>' +
  '</div></div></section>';

  cs.innerHTML = html;
  load(cs);
  /* pause the full-page scroll while hovered or offscreen */
  var sv = $('.cs-scroll', cs);
  if (sv && 'IntersectionObserver' in window) new IntersectionObserver(function (en) { sv.classList.toggle('run', en[0].isIntersecting && !reduce); }).observe(sv);
  /* keyboard: ← → move between case studies */
  addEventListener('keydown', function (e) {
    if (e.target.closest && e.target.closest('input,textarea')) return;
    if (e.key === 'ArrowRight') location.href = href(nx);
    if (e.key === 'ArrowLeft') location.href = href(pv);
  });
})();
