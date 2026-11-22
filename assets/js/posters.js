/* =========================================================
   SKT — Poster wall (home): fanned deck, autoplay, swipe,
   3D tilt, colour-shifting glow and a lightbox.
   ========================================================= */
(function () {
  'use strict';
  var root = document.querySelector('[data-pw]');
  if (!root) return;

  var cards = [].slice.call(root.querySelectorAll('.pw-card'));
  var dots = [].slice.call(root.querySelectorAll('.pw-dot'));
  var deck = root.querySelector('.pw-deck');
  var copy = root.querySelector('.pw-copy');
  var numEl = root.querySelector('.pw-n');
  var lb = root.parentNode.parentNode.querySelector('.pw-lb') || document.querySelector('.pw-lb');
  var n = cards.length, active = 0, timer = null, DUR = 5000;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var state = { hover: false, focus: false, visible: false, lb: false };

  root.style.setProperty('--dur', DUR + 'ms');

  function pad(i) { return (i < 9 ? '0' : '') + (i + 1); }
  function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  function layout() {
    var half = Math.floor(n / 2);
    cards.forEach(function (c, i) {
      var d = ((i - active + n + half) % n) - half;
      c.style.setProperty('--d', d);
      c.style.setProperty('--ad', Math.abs(d));
      c.classList.toggle('on', d === 0);
      c.classList.toggle('far', Math.abs(d) > 2);
      c.setAttribute('tabindex', d === 0 ? '0' : '-1');
      c.setAttribute('aria-hidden', d === 0 ? 'false' : 'true');
    });
  }

  function render(animate) {
    var c = cards[active];
    root.style.setProperty('--accent', c.style.getPropertyValue('--c'));
    copy.innerHTML =
      '<span class="pw-k">' + esc(c.dataset.k) + '</span>' +
      '<h3 class="pw-t">' + c.dataset.t + '</h3>' +
      '<p class="pw-d">' + esc(c.dataset.d) + '</p>' +
      '<div class="pw-tags">' + c.dataset.tags.split('|').map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div>';
    numEl.textContent = pad(active);
    if (animate && !reduce) {
      copy.classList.remove('swap'); numEl.classList.remove('swap');
      void copy.offsetWidth;
      copy.classList.add('swap'); numEl.classList.add('swap');
    }
    dots.forEach(function (d, i) {
      d.classList.remove('on');
      d.setAttribute('aria-current', i === active ? 'true' : 'false');
    });
    void root.offsetWidth; // restart progress bar
    dots[active].classList.add('on');
  }

  function go(i, user) {
    active = (i + n) % n;
    layout(); render(true);
    if (state.lb) showLb();
    schedule();
  }

  /* ---- autoplay ---- */
  function running() { return !reduce && state.visible && !state.hover && !state.focus && !state.lb && !document.hidden; }
  function schedule() {
    clearTimeout(timer);
    root.classList.toggle('paused', !running());
    if (running()) timer = setTimeout(function () { go(active + 1); }, DUR);
  }
  root.addEventListener('mouseenter', function () { state.hover = true; schedule(); });
  root.addEventListener('mouseleave', function () { state.hover = false; schedule(); });
  root.addEventListener('focusin', function () { state.focus = true; schedule(); });
  root.addEventListener('focusout', function (e) { if (!root.contains(e.relatedTarget)) { state.focus = false; schedule(); } });
  document.addEventListener('visibilitychange', schedule);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { state.visible = en[0].isIntersecting; schedule(); }, { threshold: .35 }).observe(root);
  } else { state.visible = true; }

  /* ---- controls ---- */
  root.querySelector('[data-pw-prev]').addEventListener('click', function () { go(active - 1, true); });
  root.querySelector('[data-pw-next]').addEventListener('click', function () { go(active + 1, true); });
  dots.forEach(function (d) { d.addEventListener('click', function () { go(+d.dataset.go, true); }); });
  root.addEventListener('keydown', function (e) {
    if (e.target.closest('a')) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); go(active + 1, true); cards[active].focus({ preventScroll: true }); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(active - 1, true); cards[active].focus({ preventScroll: true }); }
  });

  /* ---- drag / swipe + click ---- */
  var sx = 0, sy = 0, dragging = false, moved = false;
  deck.addEventListener('pointerdown', function (e) {
    if (e.button !== 0) return;
    dragging = true; moved = false; sx = e.clientX; sy = e.clientY;
  });
  window.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    if (Math.abs(e.clientX - sx) > 8 && Math.abs(e.clientX - sx) > Math.abs(e.clientY - sy)) moved = true;
  });
  window.addEventListener('pointerup', function (e) {
    if (!dragging) return;
    dragging = false;
    var dx = e.clientX - sx;
    if (moved && Math.abs(dx) > 40) go(active + (dx < 0 ? 1 : -1), true);
  });
  cards.forEach(function (c, i) {
    c.addEventListener('click', function (e) {
      if (moved) { e.preventDefault(); moved = false; return; }
      if (i === active) openLb(); else go(i, true);
    });
  });

  /* ---- 3D tilt on the front poster ---- */
  if (fine && !reduce) {
    deck.addEventListener('pointermove', function (e) {
      var c = cards[active], r = c.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return reset();
      var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      c.classList.add('tilting');
      c.style.setProperty('--ty', ((px - .5) * 14).toFixed(2) + 'deg');
      c.style.setProperty('--tx', ((.5 - py) * 12).toFixed(2) + 'deg');
      c.style.setProperty('--sx', (px * 100) + '%');
      c.style.setProperty('--sy', (py * 100) + '%');
    });
    deck.addEventListener('pointerleave', reset);
  }
  function reset() {
    cards.forEach(function (c) { c.classList.remove('tilting'); c.style.setProperty('--tx', '0deg'); c.style.setProperty('--ty', '0deg'); });
  }

  /* ---- lightbox ---- */
  var lbImg = lb && lb.querySelector('.pw-lb-img'), lbCap = lb && lb.querySelector('.pw-lb-cap');
  function showLb() {
    var c = cards[active], img = c.querySelector('img');
    lbImg.src = c.dataset.full; lbImg.alt = img.alt;
    lbCap.textContent = pad(active) + ' / 0' + n + ' · ' + c.dataset.k;
    lbImg.style.animation = 'none'; void lbImg.offsetWidth; lbImg.style.animation = '';
  }
  function openLb() {
    if (!lb || typeof lb.showModal !== 'function') { window.open(cards[active].dataset.full, '_blank', 'noopener'); return; }
    state.lb = true; showLb(); lb.showModal(); document.documentElement.style.overflow = 'hidden'; schedule();
  }
  function closeLb() { if (lb.open) lb.close(); }
  if (lb) {
    lb.addEventListener('close', function () { state.lb = false; document.documentElement.style.overflow = ''; cards[active].focus({ preventScroll: true }); schedule(); });
    lb.querySelector('[data-pw-close]').addEventListener('click', closeLb);
    lb.querySelector('[data-pw-lprev]').addEventListener('click', function () { go(active - 1, true); });
    lb.querySelector('[data-pw-lnext]').addEventListener('click', function () { go(active + 1, true); });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.tagName === 'FIGURE') closeLb(); });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') go(active + 1, true);
      if (e.key === 'ArrowLeft') go(active - 1, true);
    });
    var lx = 0;
    lb.addEventListener('touchstart', function (e) { lx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) { var dx = e.changedTouches[0].clientX - lx; if (Math.abs(dx) > 50) go(active + (dx < 0 ? 1 : -1), true); });
  }

  layout(); render(false); schedule();
})();
