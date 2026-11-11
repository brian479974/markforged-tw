/* ================================================================
   products-v2.js — 產品總覽頁新版（第十三輪 · 2026-11-11）
   黏頂機型切換列標出目前章節、規格卡依序進場、產品圖捲動視差。
   ================================================================ */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var links = Array.prototype.slice.call(document.querySelectorAll('.pv-sub a'));
  var chs = Array.prototype.slice.call(document.querySelectorAll('.pv-ch'));

  // 規格卡：依序延遲；整組進畫面才放
  document.querySelectorAll('.pv-specs').forEach(function (ul) {
    Array.prototype.forEach.call(ul.children, function (li, k) { li.style.setProperty('--i', k); });
  });
  if (reduce || !('IntersectionObserver' in window)) {
    document.querySelectorAll('.pv-specs').forEach(function (u) { u.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px', threshold: .15 });
    document.querySelectorAll('.pv-specs').forEach(function (u) { io.observe(u); });
  }

  // 目前章節 → 切換列標亮
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
  // 產品圖視差
  var imgs = Array.prototype.slice.call(document.querySelectorAll('.pv-ch:not(.wide) .pv-stage img'));
  function para() {
    if (reduce) return;
    var h = window.innerHeight;
    imgs.forEach(function (img) {
      var st = img.parentNode; if (!st.classList.contains('in')) return;
      var r = st.getBoundingClientRect(); if (r.bottom < 0 || r.top > h) return;
      var q = (r.top + r.height / 2 - h / 2) / h; // -1..1
      img.style.transform = 'translate3d(0,' + (q * -26).toFixed(1) + 'px,0)';
    });
  }
  var tick = false;
  window.addEventListener('scroll', function () {
    if (tick) return; tick = true;
    requestAnimationFrame(function () { mark(); para(); tick = false; });
  }, { passive: true });
  mark();
})();
