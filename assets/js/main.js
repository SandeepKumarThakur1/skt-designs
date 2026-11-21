/* =========================================================
   SKT v2 — main.js
   Tile loader · circle page transition · cursor · scramble nav ·
   word reveals · bento pop-ins · spotlight · stacking cards ·
   scroll timeline · hero graphic parallax · projects · copy · form
   ========================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var EMAIL = 'sktdesignsofficial@gmail.com';
  /* RESUME / CV — paste your Google Drive share link here (e.g.
     'https://drive.google.com/file/d/XXXX/view?usp=sharing'). Leave it empty
     to use the PDF at assets/cv/resume.pdf instead. Every "Resume" link on
     the site (header, mobile menu, footer, story) updates from this one line. */
  var CV_URL = '';
  /* Contact form delivery. After you confirm FormSubmit's activation email,
     you can replace the email in this URL with the random alias they send you
     (hides your address from spam bots). */
  var FORM_ENDPOINT = 'https://formsubmit.co/ajax/' + EMAIL;
  var store = {
    get: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} },
    del: function (k) { try { sessionStorage.removeItem(k); } catch (e) {} }
  };
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  /* ---------- ready: start hero animations ---------- */
  var readyDone = false;
  function setReady() {
    if (readyDone) return; readyDone = true;
    root.classList.add('is-ready');
    $$('[data-hero]').forEach(function (el, i) {
      setTimeout(function () { el.classList.add('is-in'); }, 0);
    });
  }

  /* =========================================================
     LOADER — bento tiles pop in, count, pop out
     ========================================================= */
  function runLoader() {
    var loader = $('.loader');
    if (!root.classList.contains('first-load') || !loader) return false;
    var n = $('.ld-n', loader), bar = $('.ld-bar i', loader), word = $('.ld-word', loader);
    var words = ['Design', 'Develop', 'Deliver'];
    var dur = reduce ? 300 : 2300, start = null, wi = -1;
    function ease(t) { return 1 - Math.pow(1 - t, 3); }
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1), v = Math.round(ease(p) * 100);
      if (n) n.textContent = v;
      if (bar) bar.style.width = v + '%';
      var w = Math.min(2, Math.floor(p * 3));
      if (word && w !== wi) { wi = w; word.textContent = words[w]; }
      if (p < 1) requestAnimationFrame(tick); else setTimeout(out, reduce ? 0 : 300);
    }
    function out() {
      loader.classList.add('is-out');
      store.set('skt-loaded', '1');
      setTimeout(setReady, reduce ? 0 : 450);
      setTimeout(function () { root.classList.remove('first-load'); loader.remove(); }, reduce ? 50 : 1300);
    }
    requestAnimationFrame(tick);
    return true;
  }

  /* =========================================================
     PAGE TRANSITION — blue circle from click point
     ========================================================= */
  function initTransition() {
    var pt = $('.page-trans'); if (!pt) return;
    var label = $('.pt-label', pt);
    if (root.classList.contains('trans-in')) {
      var l = store.get('skt-trans-label'); if (l && label) label.textContent = l;
      store.del('skt-trans'); store.del('skt-trans-label');
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          pt.classList.add('leave');
          root.classList.remove('trans-in');
          setTimeout(setReady, 300);
          setTimeout(function () {
            pt.style.transition = 'none'; pt.classList.remove('leave');
            void pt.offsetWidth; pt.style.transition = '';
          }, 950);
        });
      });
    }
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a');
      if (!a) return;
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#' || a.target === '_blank' || a.hasAttribute('download')) return;
      if (/^(mailto:|tel:|https?:|\/\/|javascript:)/i.test(href)) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0 || reduce) return;
      e.preventDefault();
      closeMenu();
      var name = a.getAttribute('data-label') || (a.textContent || '').replace(/\s+/g, ' ').trim();
      if (!name || name.length > 18) name = 'SKT';
      if (label) label.textContent = name;
      pt.style.setProperty('--x', e.clientX + 'px');
      pt.style.setProperty('--y', e.clientY + 'px');
      store.set('skt-trans', '1'); store.set('skt-trans-label', name);
      pt.classList.add('cover');
      setTimeout(function () { window.location.href = href; }, 800);
    });
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) { pt.classList.remove('cover', 'leave'); root.classList.remove('trans-in'); }
    });
  }

  /* =========================================================
     HEADER — hide on scroll down, progress bar, active link
     ========================================================= */
  function initHeader() {
    var h = $('.site-header'), bar = $('.progress'), last = 0;
    function on() {
      var y = window.scrollY, max = document.documentElement.scrollHeight - innerHeight;
      if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
      if (h && !root.classList.contains('menu-open')) h.classList.toggle('is-hidden', y > last && y > 300);
      last = y;
    }
    window.addEventListener('scroll', on, { passive: true }); on();
    var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if (page === 'project-details.html') page = 'projects.html';
    $$('.nav a, .mm-tile[href]').forEach(function (a) {
      if ((a.getAttribute('href') || '').toLowerCase() === page) { a.classList.add('is-active'); a.setAttribute('aria-current', 'page'); }
    });
  }

  /* ---------- mobile menu ---------- */
  function closeMenu() {
    root.classList.remove('menu-open');
    var b = $('.menu-btn'); if (b) { b.setAttribute('aria-expanded', 'false'); $('.mb-txt', b).textContent = 'Menu'; }
    document.body.style.overflow = '';
  }
  function initMenu() {
    var b = $('.menu-btn'); if (!b) return;
    b.addEventListener('click', function () {
      var open = !root.classList.contains('menu-open');
      root.classList.toggle('menu-open', open);
      b.setAttribute('aria-expanded', String(open));
      $('.mb-txt', b).textContent = open ? 'Close' : 'Menu';
      document.body.style.overflow = open ? 'hidden' : '';
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }

  /* ---------- text scramble on nav hover ---------- */
  function initScramble() {
    if (reduce) return;
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*+';
    $$('[data-scramble]').forEach(function (el) {
      var orig = el.textContent, timer = null;
      el.addEventListener('mouseenter', function () {
        var f = 0; clearInterval(timer);
        timer = setInterval(function () {
          el.textContent = orig.split('').map(function (c, i) {
            if (c === ' ') return ' ';
            return i < f / 2 ? orig[i] : chars[Math.floor(Math.random() * chars.length)];
          }).join('');
          f++; if (f / 2 >= orig.length) { clearInterval(timer); el.textContent = orig; }
        }, 28);
      });
    });
  }

  /* =========================================================
     CURSOR + MAGNETIC + SPOTLIGHT
     ========================================================= */
  function initCursor() {
    if (!fine || reduce) return;
    var c = $('.cursor'); if (!c) return;
    var lab = $('.cursor-label', c), mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
    addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; }, { passive: true });
    (function loop() { cx += (mx - cx) * .2; cy += (my - cy) * .2; c.style.transform = 'translate(' + cx + 'px,' + cy + 'px)'; requestAnimationFrame(loop); })();
    document.addEventListener('mouseover', function (e) {
      var v = e.target.closest('[data-cursor]'), h = e.target.closest('a,button,label,input,textarea');
      c.classList.toggle('is-view', !!v);
      if (v && lab) lab.textContent = v.getAttribute('data-cursor');
      c.classList.toggle('is-hover', !v && !!h);
      c.classList.toggle('is-dark', !v && !h && !!e.target.closest('.tile--blue'));
    });
    document.addEventListener('mouseleave', function () { c.classList.add('is-hidden'); });
    document.addEventListener('mouseenter', function () { c.classList.remove('is-hidden'); });

    $$('.magnetic').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.transform = 'translate(' + (e.clientX - r.left - r.width / 2) * .22 + 'px,' + (e.clientY - r.top - r.height / 2) * .3 + 'px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transition = 'transform .6s cubic-bezier(.22,1,.36,1)'; el.style.transform = '';
        setTimeout(function () { el.style.transition = ''; }, 600);
      });
    });
    document.addEventListener('mousemove', function (e) {
      var t = e.target.closest && e.target.closest('.tile');
      if (!t) return;
      var r = t.getBoundingClientRect();
      t.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      t.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  }

  /* =========================================================
     WORD REVEAL — wraps each word in a mask
     ========================================================= */
  function splitWords() {
    $$('[data-rv]').forEach(function (el) {
      var i = 0;
      function walk(node) {
        Array.prototype.slice.call(node.childNodes).forEach(function (ch) {
          if (ch.nodeType === 3) {
            var frag = document.createDocumentFragment();
            ch.textContent.split(/(\s+)/).forEach(function (part) {
              if (!part) return;
              if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
              var w = document.createElement('span'); w.className = 'w';
              var s = document.createElement('span'); s.style.setProperty('--d', i++); s.textContent = part;
              w.appendChild(s); frag.appendChild(w);
            });
            node.replaceChild(frag, ch);
          } else if (ch.nodeType === 1 && ch.tagName !== 'BR') {
            if (ch.classList.contains('hl-box')) {
              var w2 = document.createElement('span'); w2.className = 'w';
              var s2 = document.createElement('span'); s2.style.setProperty('--d', i++);
              ch.parentNode.replaceChild(w2, ch); s2.appendChild(ch); w2.appendChild(s2);
            } else walk(ch);
          }
        });
      }
      el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
      walk(el);
      el.classList.add('rv');
    });
  }

  /* =========================================================
     IN-VIEW — pop / fade / reveal
     ========================================================= */
  function initInView() {
    var els = $$('.pop:not([data-hero]), .fade:not([data-hero]), .rv:not([data-hero])');
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('is-in'); io.unobserve(x.target); } });
    }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- statement words light up ---------- */
  function initStatement() {
    $$('[data-statement]').forEach(function (el) {
      var html = '';
      Array.prototype.forEach.call(el.childNodes, function (n) {
        var b = n.nodeType === 1 ? ' b' : '';
        n.textContent.split(/\s+/).forEach(function (w) { if (w) html += '<span class="sw' + b + '">' + w + '</span> '; });
      });
      el.innerHTML = html;
      var ws = $$('.sw', el);
      if (reduce) { ws.forEach(function (w) { w.classList.add('on'); }); return; }
      function up() {
        var r = el.getBoundingClientRect();
        var p = clamp((innerHeight * .85 - r.top) / (r.height + innerHeight * .3), 0, 1);
        var k = Math.round(p * ws.length);
        ws.forEach(function (w, i) { w.classList.toggle('on', i < k); });
      }
      addEventListener('scroll', up, { passive: true }); up();
    });
  }

  /* ---------- rotating words ---------- */
  function initRotator() {
    $$('.rotator').forEach(function (r) {
      var items = $$('span', r); if (!items.length) return;
      items[0].classList.add('on');
      if (items.length < 2 || reduce) return;
      var i = 0;
      setInterval(function () {
        var cur = items[i]; i = (i + 1) % items.length; var nx = items[i];
        cur.classList.remove('on'); cur.classList.add('off');
        nx.classList.remove('off'); nx.classList.add('on');
        setTimeout(function () { cur.classList.remove('off'); }, 800);
      }, 2200);
    });
  }

  /* ---------- resume / CV links ---------- */
  function initCv() {
    if (!CV_URL) return;
    $$('[data-cv]').forEach(function (a) { a.setAttribute('href', CV_URL); });
  }

  /* ---------- story: scroll-driven chapters ---------- */
  function initStory() {
    $$('[data-story]').forEach(function (sec) {
      var steps = $$('.story-step', sec), svs = $$('.sv', sec), dots = $$('.stage-dots i', sec);
      var n = $('.stage-n', sec), title = $('.stage-title', sec), bar = $('.stage-bar b', sec), list = $('.story-steps', sec);
      var names = steps.map(function (s) { var k = $('.story-k', s); return k ? k.textContent.split('·').pop().trim() : ''; });
      var cur = -1;
      function set(i) {
        if (i === cur) return; cur = i;
        steps.forEach(function (s, j) { s.classList.toggle('is-on', j === i); });
        svs.forEach(function (s, j) { s.classList.toggle('on', j === i); });
        dots.forEach(function (d, j) { d.classList.toggle('on', j <= i); });
        if (n) n.textContent = (i + 1 < 10 ? '0' : '') + (i + 1);
        if (title) title.textContent = names[i] || '';
      }
      function up() {
        var line = innerHeight * (innerWidth <= 900 ? .82 : .55), i = 0;
        steps.forEach(function (s, j) { if (s.getBoundingClientRect().top < line) i = j; });
        set(i);
        if (bar && list) {
          var r = list.getBoundingClientRect();
          bar.style.transform = 'scaleX(' + clamp((line - r.top) / r.height, 0, 1) + ')';
        }
      }
      set(0);
      addEventListener('scroll', up, { passive: true }); addEventListener('resize', up); up();
    });
  }

  /* ---------- sticky stacking cards ---------- */
  function initStack() {
    var cards = $$('.stack-card'); if (cards.length < 2 || reduce) return;
    function up() {
      cards.forEach(function (c, i) {
        var next = cards[i + 1];
        if (!next) { c.style.transform = ''; return; }
        var top = parseFloat(getComputedStyle(c).top) || 0;
        var d = next.getBoundingClientRect().top - top;
        var p = clamp(1 - d / c.offsetHeight, 0, 1);
        c.style.transform = 'scale(' + (1 - p * .06) + ')';
        c.style.opacity = String(1 - p * .35);
      });
    }
    addEventListener('scroll', up, { passive: true }); addEventListener('resize', up); up();
  }

  /* ---------- process timeline fill ---------- */
  function initTimeline() {
    $$('.timeline').forEach(function (tl) {
      var fill = $('.tl-fill', tl), steps = $$('.tl-step', tl);
      function up() {
        var r = tl.getBoundingClientRect();
        var p = clamp((innerHeight * .6 - r.top) / r.height, 0, 1);
        if (fill) fill.style.transform = 'scaleY(' + p + ')';
        steps.forEach(function (s) { s.classList.toggle('on', s.getBoundingClientRect().top < innerHeight * .6); });
      }
      if (reduce) { if (fill) fill.style.transform = 'scaleY(1)'; steps.forEach(function (s) { s.classList.add('on'); }); return; }
      addEventListener('scroll', up, { passive: true }); up();
    });
  }

  /* ---------- hero graphic parallax ---------- */
  function initGfx() {
    var g = $('.gfx'); if (!g || !fine || reduce) return;
    var host = g.closest('.tile') || g, layers = $$('[data-depth]', g);
    host.addEventListener('mousemove', function (e) {
      var r = host.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      layers.forEach(function (l) { var d = parseFloat(l.getAttribute('data-depth')) || 0; l.style.translate = (x * d * 36).toFixed(1) + 'px ' + (y * d * 36).toFixed(1) + 'px'; });
    });
    host.addEventListener('mouseleave', function () { layers.forEach(function (l) { l.style.translate = ''; }); });
  }

  /* =========================================================
     PROJECTS
     ========================================================= */
  function isDark(hex) {
    var h = hex.replace('#', ''), r = parseInt(h.substr(0, 2), 16), g = parseInt(h.substr(2, 2), 16), b = parseInt(h.substr(4, 2), 16);
    return (.299 * r + .587 * g + .114 * b) < 128;
  }
  function vars(p) { return '--c1:' + p.c1 + ';--c2:' + p.c2 + ';--c3:' + p.c3; }
  function mockHTML(p) {
    var bars = [40, 65, 50, 80, 60, 90, 70];
    if (p.image) return '<img src="' + p.image + '" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">';
    if (p.mock === 'phones') {
      var ph = function (k) {
        return '<div class="mock-phone"><div class="notch"></div>' + (k === 1
          ? '<div class="card"></div><div class="row"><i></i><b></b></div><div class="row"><i></i><b></b></div><div class="row"><i></i><b></b></div>'
          : '<div class="row"><i></i><b></b></div><div class="chart">' + bars.map(function (b) { return '<i style="height:' + b + '%"></i>'; }).join('') + '</div><div class="card" style="height:14%"></div>') + '</div>';
      };
      return '<div class="mock mock-phones" aria-hidden="true">' + ph(1) + ph(2) + '</div>';
    }
    if (p.mock === 'dashboard') {
      return '<div class="mock mock-dash" aria-hidden="true"><div class="mock-browser"><div class="mock-bar"><i></i><i></i><i></i><b></b></div><div class="mock-body"><div class="mock-side"><i></i><i></i><i></i><i></i><i></i></div><div class="mock-main"><div class="mock-kpis"><i></i><i></i><i></i></div><div class="mock-graph">' + bars.concat(bars).map(function (b) { return '<i style="height:' + b + '%"></i>'; }).join('') + '</div></div></div></div></div>';
    }
    return '<div class="mock" aria-hidden="true"><div class="mock-browser"><div class="mock-bar"><i></i><i></i><i></i><b></b></div><div class="mock-body"><div class="mock-nav"><b></b><span><i></i><i></i><i></i></span></div><div class="mock-hero"><div class="txt"><i></i><i></i><i></i><i></i><u></u></div><div class="art"></div></div><div class="mock-cards"><i></i><i></i><i></i></div></div></div></div>';
  }

  /* ---------- live screenshots (WordPress mShots) ---------- */
  function domainOf(u) { return (u || '').replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''); }
  function shotURL(url, mobile) {
    return 'https://s0.wp.com/mshots/v1/' + encodeURIComponent(url) +
      (mobile ? '?w=390&h=844&vpw=390&vph=844' : '?w=1280&h=860&vpw=1440&vph=960');
  }
  function visualHTML(p, mode) {
    var mobile = mode === 'mobile';
    var src = (!mobile && p.image) ? p.image : (mobile && p.imageMobile) ? p.imageMobile : (p.url ? shotURL(p.url, mobile) : '');
    var fallback = mockHTML(Object.assign({}, p, mobile ? { mock: 'phones' } : (p.mock === 'phones' ? { mock: 'browser' } : {})));
    if (!src) return fallback;
    var local = (!mobile && p.image) || (mobile && p.imageMobile);
    var img = '<img alt="Screenshot of the ' + p.title + ' website' + (mobile ? ' on mobile' : '') + '" loading="lazy" decoding="async" data-shot="' + src + '"' + (local ? ' data-local="1"' : '') + (p.brand ? '' : ' data-sample="' + p.slug + '"') + '>';
    var shot = mobile
      ? '<div class="shot shot--mob"><div class="shot-img">' + img + '</div></div>'
      : '<div class="shot shot--desk"><div class="shot-bar"><i></i><i></i><i></i><span>' + domainOf(p.url) + '</span></div><div class="shot-img">' + img + '</div></div>';
    return '<div class="vis">' + fallback + shot + '</div>';
  }
  function hexOf(r, g, b) { return '#' + [r, g, b].map(function (v) { return ('0' + Math.round(v).toString(16)).slice(-2); }).join('').toUpperCase(); }
  // Try to read the client's main colour from the screenshot (only works if the image server allows it)
  function sampleBrand(src, slug) {
    var im = new Image(); im.crossOrigin = 'anonymous';
    im.onload = function () {
      try {
        var c = document.createElement('canvas'), W = 48, H = 32; c.width = W; c.height = H;
        var x = c.getContext('2d'); x.drawImage(im, 0, 0, W, H);
        var d = x.getImageData(0, 0, W, H).data, buckets = {};
        for (var i = 0; i < d.length; i += 4) {
          var r = d[i], g = d[i + 1], b = d[i + 2], mx = Math.max(r, g, b), mn = Math.min(r, g, b);
          var sat = mx ? (mx - mn) / mx : 0;
          if (sat < .28 || mx < 40 || mx > 250 && mn > 235) continue; // skip greys, black, white
          var k = (r >> 5) + ',' + (g >> 5) + ',' + (b >> 5);
          var bk = buckets[k] || (buckets[k] = { n: 0, r: 0, g: 0, b: 0 });
          bk.n++; bk.r += r; bk.g += g; bk.b += b;
        }
        var best = null; Object.keys(buckets).forEach(function (k) { if (!best || buckets[k].n > best.n) best = buckets[k]; });
        if (!best || best.n < 20) return;
        var col = hexOf(best.r / best.n, best.g / best.n, best.b / best.n);
        $$('[data-brand-target="' + slug + '"]').forEach(function (el) { el.style.setProperty('--c1', col); });
      } catch (e) { /* image server doesn't allow colour reading — keep neutral */ }
    };
    im.src = src;
  }
  function loadShots(scope) {
    $$('img[data-shot]', scope).forEach(function (img) {
      if (img._init) return; img._init = true;
      var src = img.getAttribute('data-shot'), tries = 0, local = img.hasAttribute('data-local');
      var shot = img.closest('.shot'), vis = img.closest('.vis');
      img.onload = function () {
        // mShots returns a small "generating…" image the first time — retry until the real screenshot is ready
        var gen = img.naturalHeight <= img.naturalWidth && img.naturalWidth < 600;
        if (!local && gen && tries < 8) { tries++; setTimeout(function () { img.src = src + '&r=' + tries; }, 3500); return; }
        if (shot) shot.classList.add('loaded'); if (vis) vis.classList.add('has-shot');
        var slug = img.getAttribute('data-sample'); if (slug && !local) sampleBrand(img.src, slug);
      };
      img.onerror = function () { if (shot) shot.remove(); };
      img.src = src;
    });
  }
  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var SPANS = [7, 5, 5, 7, 4, 4, 4];
  function card(p, i) {
    return '<a class="p-card pop c-' + SPANS[i % SPANS.length] + '" style="' + vars(p) + ';--i:' + (i % 2) + '" href="project-details.html?p=' + p.slug + '" data-cats="' + p.cats.join(' ') + '" data-cursor="View" data-label="' + p.title + '" data-brand-target="' + p.slug + '">' +
      '<div class="p-top"><span>' + (i < 9 ? '0' : '') + (i + 1) + '</span><span class="p-status' + (p.status === 'Live' ? ' live' : '') + '">' + (p.status || '') + '</span></div>' +
      '<div class="p-media">' + visualHTML(p, 'desk') + '</div>' +
      '<div class="p-bar"><div><h3>' + p.title + '</h3><p>' + p.type + (p.tech && p.tech.length ? ' · ' + p.tech[0] : '') + '</p></div><span class="p-go">' + ARROW + '</span></div></a>';
  }
  function initProjects() {
    var list = window.SKT_PROJECTS || [];
    var grid = $('[data-projects]');
    if (grid) {
      var lim = parseInt(grid.getAttribute('data-limit') || '0', 10);
      grid.innerHTML = (lim ? list.slice(0, lim) : list).map(card).join('');
      loadShots(grid);
    }
    $$('.filter-btn').forEach(function (b) {
      var f = b.getAttribute('data-filter');
      var sup = document.createElement('sup');
      sup.textContent = f === 'all' ? list.length : list.filter(function (p) { return p.cats.indexOf(f) > -1; }).length;
      b.appendChild(sup);
      b.addEventListener('click', function () {
        $$('.filter-btn').forEach(function (x) { x.classList.remove('is-active'); x.setAttribute('aria-pressed', 'false'); });
        b.classList.add('is-active'); b.setAttribute('aria-pressed', 'true');
        var shown = 0;
        $$('.p-card', grid).forEach(function (c) {
          var ok = f === 'all' || c.getAttribute('data-cats').split(' ').indexOf(f) > -1;
          c.classList.toggle('is-hidden', !ok);
          if (ok) {
            c.className = c.className.replace(/\bc-\d+\b/, 'c-' + SPANS[shown % SPANS.length]);
            shown++;
            c.classList.remove('is-in'); void c.offsetWidth; c.classList.add('is-in');
          }
        });
      });
    });
    var d = $('[data-project-detail]');
    if (!d || !list.length) return;
    var slug = new URLSearchParams(location.search).get('p');
    var idx = Math.max(0, list.findIndex(function (p) { return p.slug === slug; }));
    var p = list[idx], nx = list[(idx + 1) % list.length];
    document.title = p.title + ' — Case Study · Sandeep K. Thakur';
    d.setAttribute('style', vars(p)); d.setAttribute('data-brand-target', p.slug);
    ['title', 'tagline', 'type', 'industry', 'location', 'status', 'summary'].forEach(function (k) {
      $$('[data-f="' + k + '"]', d).forEach(function (n) { n.textContent = p[k] || '—'; });
    });
    $$('[data-f="url"]', d).forEach(function (a) { if (p.url) a.href = p.url; else a.remove(); });
    $$('[data-f="domain"]', d).forEach(function (n) { n.textContent = (p.url || '').replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''); });
    $$('[data-f="live-note"]', d).forEach(function (n) { n.textContent = p.status === 'Live' ? 'The website is live — have a look around.' : 'This project is in progress — preview the current version.'; });
    var ft = $('[data-f="features"]', d);
    if (ft) ft.innerHTML = (p.features || []).map(function (x, i) { return '<li style="--i:' + i + '">' + x + '</li>'; }).join('');
    var set = function (k, h) { var n = $('[data-f="' + k + '"]', d); if (n) n.innerHTML = h; };
    set('hero', visualHTML(p, 'desk'));
    set('g1', visualHTML(p, 'mobile'));
    set('tech', (p.tech && p.tech.length ? p.tech : ['Details coming soon']).map(function (t) { return '<li>' + t + '</li>'; }).join(''));
    $$('[data-f="tech-short"]', d).forEach(function (n) { n.textContent = (p.tech && p.tech.length) ? p.tech.slice(0, 2).join(', ') : '—'; });
    loadShots(d);
    set('g2', '<div class="type-spec" style="color:' + (isDark(p.c3) ? '#F5F0E8' : '#111111') + '"><span>Typeface</span><b>Aa</b><span>Headings · Body</span></div>');
    set('palette', '<div class="palette">' + [p.c1, p.c2, p.c3].map(function (c) { return '<span style="background:' + c + ';color:' + (isDark(c) ? '#F5F0E8' : '#111111') + '">' + c.toUpperCase() + '</span>'; }).join('') + '</div>');
    set('g4', mockHTML(Object.assign({}, p, { mock: p.mock === 'dashboard' ? 'dashboard' : (p.mock === 'phones' ? 'browser' : 'phones') })));
    var n = $('[data-f="next"]', d);
    if (n) { n.href = 'project-details.html?p=' + nx.slug; n.setAttribute('data-label', nx.title); $('[data-f="next-title"]', d).textContent = nx.title; }
  }

  /* ---------- FAQ ---------- */
  function initFaq() {
    $$('.faq-q').forEach(function (q) {
      q.addEventListener('click', function () {
        var it = q.closest('.faq-item'), open = !it.classList.contains('is-open');
        it.classList.toggle('is-open', open); q.setAttribute('aria-expanded', String(open));
      });
    });
  }

  /* ---------- copy email ---------- */
  function toast(msg) {
    var t = $('.toast'); if (!t) return;
    t.textContent = msg; t.classList.add('show');
    clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove('show'); }, 2200);
  }
  function initCopy() {
    $$('[data-copy]').forEach(function (b) {
      b.addEventListener('click', function () {
        var txt = b.getAttribute('data-copy');
        var done = function () { toast('Email copied — paste it anywhere'); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, function () { location.href = 'mailto:' + txt; });
        else location.href = 'mailto:' + txt;
      });
    });
  }

  /* ---------- contact form → email app ---------- */
  function initForm() {
    var f = $('#contact-form'); if (!f) return;
    var err = $('.form-error', f);
    f.addEventListener('input', function () { if (err) err.classList.remove('is-shown'); });
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var el = f.elements;
      var name = el['name'].value.trim(), email = el['email'].value.trim(), msg = el['message'].value.trim();
      if (!name || !email || !msg || email.indexOf('@') < 1) {
        if (err) { err.textContent = 'Please add your name, a valid email and a short message.'; err.classList.add('is-shown'); }
        return;
      }
      if (el['_honey'] && el['_honey'].value) return; // spam bot
      var needs = $$('input[name="need"]:checked', f).map(function (i) { return i.value; }).join(', ');
      var ok = $('.form-success', f), btnEl = $('button[type="submit"]', f), btnTxt = $('.btn-txt', btnEl);

      // Fallback: open the visitor's email app with the message filled in
      function mailtoFallback() {
        var body = 'Hi Sandeep,\n\n' + msg + '\n\n— ' + name + '\nEmail: ' + email + (needs ? '\nInterested in: ' + needs : '');
        location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('New project enquiry from ' + name) + '&body=' + encodeURIComponent(body);
        ok.textContent = 'Your email app should open with your message ready — just hit send.';
        ok.classList.add('is-shown');
      }

      // Send straight to Sandeep's inbox via FormSubmit (free, no backend needed)
      if (!window.fetch) { mailtoFallback(); return; }
      btnEl.disabled = true; if (btnTxt) btnTxt.textContent = 'Sending…';
      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: name,
          email: email,
          interested_in: needs || '—',
          message: msg,
          _subject: 'New website enquiry from ' + name,
          _replyto: email,
          _template: 'table',
          _captcha: 'false'
        })
      }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (res) {
          if (res.ok && String(res.j.success) !== 'false') {
            f.reset();
            ok.textContent = 'Thank you, ' + name + '! Your message has been sent — I\'ll get back to you soon.';
            ok.classList.add('is-shown');
          } else { mailtoFallback(); }
        })
        .catch(mailtoFallback)
        .then(function () { btnEl.disabled = false; if (btnTxt) btnTxt.textContent = 'Send message'; });
    });
  }

  /* ---------- clock + year ---------- */
  function initClock() {
    var els = $$('.clock'); if (!els.length) return;
    function u() {
      var t = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
      els.forEach(function (e) { e.textContent = t; });
    }
    u(); setInterval(u, 30000);
  }
  $$('[data-year]').forEach(function (e) { e.textContent = new Date().getFullYear(); });

  /* =========================================================
     BOOT
     ========================================================= */
  initProjects();
  splitWords();
  initHeader();
  initMenu();
  initScramble();
  initCursor();
  initInView();
  initStatement();
  initRotator();
  initCv();
  initStory();
  initStack();
  initTimeline();
  initGfx();
  initFaq();
  initCopy();
  initForm();
  initClock();
  initTransition();
  if (!runLoader() && !root.classList.contains('trans-in')) setReady();
})();
