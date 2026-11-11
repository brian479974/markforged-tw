/* ================================================================
   home-motion.js — 首頁動態層（第十輪 · 2026-11-11）
   進場動畫（IntersectionObserver）、數字滾動、導覽列透明→實心、捲動進度條、
   主視覺與 FX10 爆炸圖視差、主視覺影片離開畫面就暫停。
   不改任何文字內容；中英切換（shared.js 的 data-zh／data-en）照常運作。
   ================================================================ */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.body.classList.add('home');

  /* ── 1. 進場標記：自動幫各區塊加 data-mo，同一組依序延遲 ── */
  var GROUPS = [
    ['.section-label', 'mask'], ['.section-title', 'mask'], ['.feature-card', ''], ['.product-card', ''],
    ['.solution-card', ''], ['.oc-card', ''], ['.vc', ''], ['.vip-left', ''], ['.vip-stat-card', ''],
    ['.cta-band .eyebrow', 'mask'], ['.cta-band h2', 'mask'], ['.cta-band p', 'fade'], ['.cta-band .btn-primary, .cta-band .btn-dark, .cta-band a', 'fade'],
    ['.home-metal > div', ''], ['.sx-copy > *', ''], ['.sx-feats > div', ''], ['.text-center.mt-48', 'fade']
  ];
  GROUPS.forEach(function (g) {
    document.querySelectorAll(g[0]).forEach(function (el) {
      if (el.closest('.hx') || el.hasAttribute('data-mo')) return;
      el.setAttribute('data-mo', g[1]);
      // 同一個父層裡的兄弟依序延遲（最多 5 階）
      var sibs = Array.prototype.filter.call(el.parentNode.children, function (s) { return s.matches(g[0]); });
      el.style.setProperty('--i', Math.min(sibs.indexOf(el), 5));
    });
  });
  // 舊的 .reveal 交給新系統（避免兩套同時動）
  document.querySelectorAll('.reveal').forEach(function (el) { el.classList.remove('reveal', 'will-animate'); el.classList.add('visible'); });

  var targets = document.querySelectorAll('[data-mo], .yellow-bar, .stat-item');
  if (reduce || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('in'); });
    document.querySelectorAll('.stat-number').forEach(function (n) { n.dataset.done = '1'; });
  } else {
    // 「遮罩上推」(clip-path 全裁) 的元素 Chrome 不算進入畫面 → 改觀察它的父層，父層一進畫面就放它進場
    var proxy = new Map();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var t = e.target, list = (proxy.get(t) || []).slice();
        if (t.hasAttribute('data-mo') || t.classList.contains('yellow-bar') || t.classList.contains('stat-item')) list.push(t);
        list.forEach(function (el) {
          el.classList.add('in');
          if (el.classList.contains('stat-item')) countUp(el.querySelector('.stat-number'));
        });
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });
    targets.forEach(function (el) {
      if (el.getAttribute('data-mo') === 'mask') {
        var par = el.parentNode, arr = proxy.get(par);
        if (!arr) { proxy.set(par, arr = []); io.observe(par); }
        arr.push(el);
      } else io.observe(el);
    });
  }
  root.classList.remove('mo-fallback');
  if (window.__moFallback) clearTimeout(window.__moFallback);

  /* ── 2. 數字滾動：800 MPa／3／200°C／4，結尾一定還原成原字串 ── */
  function countUp(el) {
    if (!el || el.dataset.done) return;
    el.dataset.done = '1';
    var orig = el.textContent;
    var m = orig.match(/^([^0-9]*)([0-9][0-9,]*)(.*)$/);
    if (!m || reduce) return;
    var end = parseInt(m[2].replace(/,/g, ''), 10), dur = end < 10 ? 900 : 1600, t0 = null;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 4);
      el.textContent = m[1] + Math.round(end * e).toLocaleString('en-US') + m[3];
      if (p < 1) requestAnimationFrame(step); else el.textContent = orig;
    }
    el.textContent = m[1] + '0' + m[3];
    requestAnimationFrame(step);
  }

  /* ── 3. 捲動：進度條、導覽列、視差 ── */
  var bar = document.createElement('div'); bar.id = 'mo-progress'; document.body.appendChild(bar);
  var hero = document.querySelector('.hx'), heroContent = hero && hero.querySelector('.hero-content'),
      heroMedia = hero && hero.querySelector('.hx-media'), sx = document.querySelector('.sx'), sxImg = sx && sx.querySelector('.sx-bg img');
  var ticking = false;
  function onScroll() {
    var y = window.scrollY || window.pageYOffset, h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(y / h, 1) : 0) + ')';
    document.body.classList.toggle('nav-solid', y > 40);
    if (!reduce) {
      if (hero && y < window.innerHeight * 1.2) {
        var k = y / window.innerHeight;
        if (heroContent) { heroContent.style.transform = 'translate3d(0,' + (y * -0.18) + 'px,0)'; heroContent.style.opacity = String(Math.max(1 - k * 1.25, 0)); }
        if (heroMedia) heroMedia.style.transform = 'translate3d(0,' + (y * 0.32) + 'px,0)';
      }
      if (sxImg) {
        var r = sx.getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight) {
          var q = (window.innerHeight - r.top) / (window.innerHeight + r.height); // 0→1
          sxImg.style.transform = 'translate3d(0,' + ((0.5 - q) * 90) + 'px,0) scale(' + (1.14 - q * 0.1) + ')';
        }
      }
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  /* ── 4. 主視覺影片：減少動態就停在第一格；離開畫面就暫停省電 ── */
  var v = document.querySelector('.hx-video');
  if (v) {
    if (reduce) { v.removeAttribute('autoplay'); v.pause(); }
    else if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause(); });
      }, { threshold: 0.05 }).observe(v);
    }
  }
})();
