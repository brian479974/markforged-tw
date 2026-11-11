/* ================================================================
   home-quotes.js — 首頁「觀點短片」：Brian Chen 觀點＋產業 3D 粒子（第十一輪 · 2026-11-11）
   取代原本 1080×1080 的金句影片：網頁即時排版的動畫，字清晰、手機電腦各自排版、
   跟網站中英切換走（主語言大字、另一語言小字）。每則觀點配一個產業的 3D 粒子造型
   （home-particles.js），產業名稱連到官網該產業頁。
   文字：原片 10 則優化成 8 則（原第 1、7、8 則是同一個意思講三次，合併；句子改短、直述）。
   [[ ]] 內是黃色強調字。
   ================================================================ */
(function () {
  'use strict';
  var Q = [
    { ind: ['航太', 'Aerospace', 'aerospace.html'],
      zh: ['我們不該只做', '人做得到的事，', '要做的是', '人[[做不到]]的事。'],
      en: ['We should not only do', 'what people can do.', 'We should do', 'what people [[cannot do]].'] },
    { ind: ['工業設備', 'Industrial Equipment', 'industrial.html'],
      zh: ['科技存在的理由，', '不是[[模仿人力]]，', '也不是重複', '早已熟悉的工作。'],
      en: ['Technology does not exist', 'to [[imitate human effort]]', 'or to repeat', 'familiar work.'] },
    { ind: ['國防與政府', 'Federal & Defense', 'defense.html'],
      zh: ['它的價值，', '是把[[不可能的邊界]]往外推：', '解決超出人力極限的問題，', '做出過去做不出來的成果。'],
      en: ['Its value is', 'pushing [[the limits of the possible]]:', 'solving problems beyond human limits,', 'making what could not be made before.'] },
    { ind: ['汽車製造', 'Automotive', 'automotive.html'],
      zh: ['真正的創新，', '不是[[複製既有能力]]，', '而是[[解鎖新的能力]]。'],
      en: ['Real innovation is not', '[[copying capability]].', 'It is [[unlocking new capability]].'] },
    { ind: ['電子製造', 'Electronics', 'electronics.html'],
      zh: ['看[[AI]]、[[自動化]]、', '[[先進製造]]，', '我們用的是同一把尺。'],
      en: ['We hold [[AI]], [[automation]]', 'and [[advanced manufacturing]]', 'to the same standard.'] },
    { ind: ['醫療', 'Medical', 'medical.html'],
      zh: ['問題從來不是', '科技能不能做得跟人一樣，', '而是能不能做到', '[[過去根本做不到]]的事。'],
      en: ['The question was never', 'whether technology can work like people.', 'It is whether it can do', '[[what was impossible before]].'] },
    { ind: ['能源', 'Energy', 'energy.html'],
      zh: ['[[轉型]]在那裡發生，', '[[領導力]]在那裡創造價值。'],
      en: ['That is where [[transformation]] happens,', 'and where [[leadership]] creates value.'] },
    { ind: ['產品開發', 'Product Development', 'product-dev.html'],
      zh: ['[[未來]]，', '也從那裡開始。'],
      en: ['And that is where', 'the [[future]] begins.'], sign: true }
  ];
  var SIGN = {
    zh: ['陳中欣 Brian Chen', 'Markforged 大中華區暨越南區總經理'],
    en: ['Brian Chen', 'Country Manager, Greater China and Vietnam, Markforged']
  };
  var DUR = [6200, 6000, 6800, 5800, 5800, 6800, 5800, 9000];

  var box = document.getElementById('pq');
  if (!box) return;
  var stage = box.querySelector('.pq-stage'), ticks = box.querySelector('.pq-ticks'),
      cur = box.querySelector('.pq-cur'), tot = box.querySelector('.pq-tot'), live = box.querySelector('.pq-live'),
      indA = box.querySelector('.pq-ind'), canvas = box.querySelector('.pq-gl');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var idx = 0, timer = null, t0 = 0, left = 0, paused = false, inView = false, slides = [], fx = null;

  try { if (canvas && window.MFParticles) fx = window.MFParticles.init(canvas, { reduce: reduce }); } catch (e) { fx = null; }
  if (!fx && canvas) canvas.style.display = 'none';
  box.classList.toggle('pq-nogl', !fx);

  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function mark(s) { return esc(s).replace(/\[\[(.+?)\]\]/g, '<em>$1</em>'); }
  function plain(s) { return s.replace(/\[\[|\]\]/g, ''); }
  function lang() { return (document.documentElement.lang || '').indexOf('en') === 0 ? 'en' : 'zh'; }
  function two(n) { return (n < 10 ? '0' : '') + n; }

  function build() {
    var L = lang(), O = L === 'en' ? 'zh' : 'en';
    stage.innerHTML = '';
    slides = Q.map(function (q) {
      var s = document.createElement('div');
      s.className = 'pq-slide pq-' + L;
      s.setAttribute('aria-hidden', 'true');
      var main = q[L].map(function (ln, k) {
        return '<span class="pq-l"><span class="pq-li" style="--k:' + k + '">' + mark(ln) + '</span></span>';
      }).join('');
      // 中文模式：中英對照、大小平衡（英文逐行排，跟中文同樣用遮罩上推進場）；
      // 英文模式只放英文（全站英文模式零中文，第八輪規則）
      var n0 = q[L].length;
      var sub = L === 'en' ? '' : q.en.map(function (ln, k) {
        return '<span class="pq-l"><span class="pq-li" style="--k:' + (n0 + k + 1) + '">' + mark(ln) + '</span></span>';
      }).join('');
      s.innerHTML = '<p class="pq-main" lang="' + (L === 'en' ? 'en' : 'zh-TW') + '">' + main + '</p>' +
        (sub ? '<p class="pq-sub" lang="en">' + sub + '</p>' : '') +
        (q.sign ? '<div class="pq-sign"><b>' + esc(SIGN[L][0]) + '</b><small>' + esc(SIGN[L][1]) + '</small></div>' : '');
      stage.appendChild(s);
      return s;
    });
    fit();
    tot.textContent = '/ ' + two(Q.length);
    ticks.innerHTML = Q.map(function (q, i) {
      return '<button type="button" class="pq-t" aria-label="' + (L === 'en' ? 'Perspective ' + (i + 1) + ' · ' + q.ind[1] : '第 ' + (i + 1) + ' 則・' + q.ind[0]) + '"><i></i></button>';
    }).join('');
    Array.prototype.forEach.call(ticks.children, function (b, i) { b.addEventListener('click', function () { go(i, true); }); });
    show(idx, false);
  }

  // 每則依實際量到的最寬一行縮字，保證不超出文字欄（最小 0.6 倍）
  function fit() {
    var W = stage.clientWidth;
    slides.forEach(function (s) {
      s.style.setProperty('--fs', '1');
      var m = 0; Array.prototype.forEach.call(s.querySelectorAll('.pq-li'), function (li) { m = Math.max(m, li.scrollWidth); });
      if (m > W && W > 0) s.style.setProperty('--fs', Math.max(.6, (W / m) * .98).toFixed(3));
    });
  }
  var rt = null;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(fit, 150); }, { passive: true });

  function setInd(i, animate) {
    var q = Q[i], L = lang();
    indA.classList.remove('on'); void indA.offsetWidth;
    indA.href = q.ind[2];
    indA.innerHTML = '<span>' + two(i + 1) + '</span>' + esc(L === 'en' ? q.ind[1] : q.ind[0] + ' ' + q.ind[1]) + ' <b>→</b>';
    indA.classList.add('on');
  }

  function show(i, animate) {
    slides.forEach(function (s, k) {
      if (k === i) return;
      if (s.classList.contains('in')) { s.classList.remove('in'); s.classList.add('out'); setTimeout(function () { s.classList.remove('out'); }, 700); }
      s.setAttribute('aria-hidden', 'true');
    });
    var s = slides[i];
    s.setAttribute('aria-hidden', 'false');
    if (animate === false) s.classList.add('in', 'now');
    else { s.classList.remove('now'); void s.offsetWidth; s.classList.add('in'); }
    cur.textContent = two(i + 1);
    cur.classList.remove('flip'); void cur.offsetWidth; cur.classList.add('flip');
    Array.prototype.forEach.call(ticks.children, function (b, k) {
      b.classList.toggle('done', k < i); b.classList.toggle('on', k === i);
      b.setAttribute('aria-current', k === i ? 'true' : 'false');
      var bi = b.querySelector('i'); if (k !== i) { bi.style.transition = 'none'; bi.style.transform = k < i ? 'scaleX(1)' : 'scaleX(0)'; }
    });
    live.textContent = Q[i][lang()].map(plain).join(lang() === 'en' ? ' ' : '');
    setInd(i, animate);
    if (fx && animate !== false) fx.morph(i);
    var bar = ticks.children[i] && ticks.children[i].querySelector('i');
    if (bar) { bar.style.transition = 'none'; bar.style.transform = 'scaleX(0)'; }
    left = DUR[i]; arm();
  }

  function arm() {
    clearTimeout(timer); timer = null;
    var bar = ticks.children[idx] && ticks.children[idx].querySelector('i');
    if (reduce) { if (bar) bar.style.transform = 'scaleX(1)'; return; }
    if (paused || !inView) {
      if (bar) { bar.style.transition = 'none'; bar.style.transform = 'scaleX(' + (1 - left / DUR[idx]) + ')'; }
      return;
    }
    t0 = performance.now();
    if (bar) { void bar.offsetWidth; bar.style.transition = 'transform ' + left + 'ms linear'; bar.style.transform = 'scaleX(1)'; }
    timer = setTimeout(function () { go(idx + 1); }, left);
  }
  function hold() {
    if (timer) { clearTimeout(timer); timer = null; left = Math.max(0, left - (performance.now() - t0)); }
    arm();
  }
  function go(i, user) { idx = (i + Q.length) % Q.length; show(idx, true); if (user) box.classList.add('pq-touched'); }

  box.querySelector('.pq-prev').addEventListener('click', function () { go(idx - 1, true); });
  box.querySelector('.pq-next').addEventListener('click', function () { go(idx + 1, true); });
  box.addEventListener('mouseenter', function () { paused = true; hold(); });
  box.addEventListener('mouseleave', function () { paused = false; arm(); });
  box.addEventListener('focusin', function () { paused = true; hold(); });
  box.addEventListener('focusout', function () { paused = false; arm(); });
  box.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { go(idx - 1, true); e.preventDefault(); }
    if (e.key === 'ArrowRight') { go(idx + 1, true); e.preventDefault(); }
  });
  var sx = null;   // 手機左右滑
  box.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', function (e) {
    if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) > 48) go(idx + (dx < 0 ? 1 : -1), true);
  }, { passive: true });

  var first = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var was = inView; inView = e.isIntersecting;
        if (fx) fx.pause(!inView);
        if (inView && !was) {
          if (first) { first = false; show(idx, true); } else arm();
        } else if (!inView && was) hold();
      });
    }, { threshold: 0.3 }).observe(box);
  } else { inView = true; }

  // 網站切換中英 → 主語言跟著換，停在同一則（粒子不重跑）
  new MutationObserver(function () {
    var keep = idx; build(); idx = keep;
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  box.classList.add('pq-ready');
  build();
  if (fx) fx.pause(true);
})();
