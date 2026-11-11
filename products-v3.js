/* ================================================================
   products-v3.js — 產品總覽頁 v3（第十四輪 · 2026-11-11）
   輕淡入、相簿切換（交叉淡化）、黏頂機型切換列標出目前機型。
   ================================================================ */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 輕淡入：同一個父層裡依序延遲 */
  var rv = Array.prototype.slice.call(document.querySelectorAll('[data-rv]'));
  rv.forEach(function (el) {
    if (el.style.getPropertyValue('--i')) return;
    var sibs = Array.prototype.filter.call(el.parentNode.children, function (s) { return s.hasAttribute('data-rv'); });
    el.style.setProperty('--i', Math.min(sibs.indexOf(el), 5));
  });
  if (reduce || !('IntersectionObserver' in window)) rv.forEach(function (el) { el.classList.add('in'); });
  else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -6% 0px', threshold: .08 });
    rv.forEach(function (el) { io.observe(el); });
  }

  /* 相簿：點縮圖換主圖（去背圖＝完整呈現＋落地陰影；照片＝滿版） */
  document.querySelectorAll('.v3-gal').forEach(function (g) {
    var view = g.querySelector('.v3-view'), main = g.querySelector('.v3-main');
    g.querySelectorAll('.v3-th').forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.classList.contains('on')) return;
        g.querySelectorAll('.v3-th').forEach(function (x) { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        var src = b.getAttribute('data-src'), cut = b.getAttribute('data-kind') === 'cut';
        var fit = b.getAttribute('data-kind') === 'fit';
        var swap = function () { main.src = src; view.classList.toggle('is-cut', cut); view.classList.toggle('is-fit', fit); };
        if (reduce) { swap(); return; }
        main.classList.add('fading');
        var pre = new Image(); pre.onload = pre.onerror = function () { setTimeout(function () { swap(); requestAnimationFrame(function () { main.classList.remove('fading'); }); }, 180); };
        pre.src = src;
      });
    });
  });

  /* 黏頂切換列：標出目前章節 */
  var links = Array.prototype.slice.call(document.querySelectorAll('.v3-sub a'));
  var chs = Array.prototype.slice.call(document.querySelectorAll('.v3-ch'));
  function mark() {
    var y = window.innerHeight * .4, cur = null;
    chs.forEach(function (c) { var r = c.getBoundingClientRect(); if (r.top <= y && r.bottom > y) cur = c.id; });
    links.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + cur); });
    var on = links.filter(function (a) { return a.classList.contains('on'); })[0];
    if (on && on.parentNode.scrollWidth > on.parentNode.clientWidth) {
      var p = on.parentNode, x = on.offsetLeft - (p.clientWidth - on.offsetWidth) / 2;
      if (Math.abs(p.scrollLeft - x) > 4) p.scrollTo({ left: x, behavior: reduce ? 'auto' : 'smooth' });
    }
  }
  var tick = false;
  window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(function () { mark(); tick = false; }); } }, { passive: true });
  mark();
})();
