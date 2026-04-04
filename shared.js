/* ── Password Gate ─────────────────────────────────────────────── */
(function(){
  var KEY = 'mf_access';
  var PASS = 'MF8888';
  var EXPIRE_HOURS = 168; // 7 days

  // Check localStorage (persists across tabs/sessions)
  try {
    var ts = localStorage.getItem(KEY);
    if (ts && (Date.now() - parseInt(ts)) < EXPIRE_HOURS * 3600000) return;
  } catch(e) {}

  // Hide body until auth
  document.documentElement.style.visibility = 'hidden';

  function showGate() {
    document.documentElement.style.visibility = 'visible';
    var style = document.createElement('style');
    style.textContent = [
      '#mf-gate{position:fixed;inset:0;background:#000;z-index:99999;display:flex;align-items:center;justify-content:center;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;}',
      '#mf-gate-box{background:#0d0d0d;border:1px solid #222;border-top:4px solid #FFC500;padding:48px 40px;max-width:360px;width:90%;text-align:center;}',
      '#mf-gate-logo{font-size:20px;font-weight:900;letter-spacing:4px;color:#FFC500;margin-bottom:6px;}',
      '#mf-gate-logo span{color:#fff;}',
      '#mf-gate-sub{font-size:12px;color:#555;letter-spacing:2px;text-transform:uppercase;margin-bottom:32px;}',
      '#mf-gate-label{font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#aaa;margin-bottom:10px;text-align:left;}',
      '#mf-gate-input{width:100%;padding:14px 16px;background:#1a1a1a;border:1.5px solid #333;color:#fff;font-size:18px;font-weight:700;letter-spacing:4px;text-align:center;border-radius:0;outline:none;box-sizing:border-box;font-family:inherit;}',
      '#mf-gate-input:focus{border-color:#FFC500;}',
      '#mf-gate-btn{width:100%;margin-top:16px;background:#FFC500;color:#000;border:none;padding:14px;font-size:14px;font-weight:900;letter-spacing:1px;text-transform:uppercase;cursor:pointer;}',
      '#mf-gate-btn:hover{background:#e6b000;}',
      '#mf-gate-err{color:#ff4444;font-size:13px;margin-top:12px;min-height:20px;}'
    ].join('');
    document.head.appendChild(style);

    var box = document.createElement('div');
    box.id = 'mf-gate';
    box.innerHTML = [
      '<div id="mf-gate-box">',
        '<div id="mf-gate-logo">MARK<span>FORGED</span></div>',
        '<div id="mf-gate-sub">Taiwan Official</div>',
        '<div id="mf-gate-label">Access Code</div>',
        '<input id="mf-gate-input" type="password" placeholder="• • • • • •" maxlength="12" autocomplete="off">',
        '<button id="mf-gate-btn">Enter</button>',
        '<div id="mf-gate-err"></div>',
      '</div>'
    ].join('');
    document.body.appendChild(box);

    function tryLogin() {
      var val = document.getElementById('mf-gate-input').value.trim();
      if (val === PASS) {
        try { localStorage.setItem(KEY, Date.now().toString()); } catch(e) {}
        document.getElementById('mf-gate').remove();
      } else {
        var err = document.getElementById('mf-gate-err');
        err.textContent = '密碼錯誤，請再試一次';
        document.getElementById('mf-gate-input').value = '';
        document.getElementById('mf-gate-input').focus();
        setTimeout(function(){ err.textContent = ''; }, 2500);
      }
    }

    document.getElementById('mf-gate-btn').addEventListener('click', tryLogin);
    document.getElementById('mf-gate-input').addEventListener('keydown', function(e){
      if (e.key === 'Enter') tryLogin();
    });
    setTimeout(function(){ document.getElementById('mf-gate-input').focus(); }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showGate);
  } else {
    showGate();
  }
})();
/* ================================================================
   shared.js — Markforged GCR | www.markforged.tw
   - Nav/footer injection
   - Language toggle (zh/en, localStorage)
   - Scroll reveal
   ================================================================ */

(function () {
  'use strict';

  // ── Config ──────────────────────────────────────────────────────
  var LANG_KEY = 'mf_lang';
  var currentLang = 'zh';
  try { currentLang = localStorage.getItem(LANG_KEY) || 'zh'; } catch (e) {}

  // ── Nav HTML ────────────────────────────────────────────────────
  var NAV_HTML = `
<nav id="main-nav">
  <a href="index.html" class="nav-logo" aria-label="Markforged Taiwan">
    <span class="nav-logo-text">MARKFORGED</span>
  </a>
  <button class="hamburger" id="hamburger" aria-label="Menu" aria-expanded="false">
    <span></span><span></span><span></span>
  </button>
  <ul class="nav-links" id="nav-links">
    <li class="has-dropdown">
      <a href="products.html" data-zh="產品" data-en="Products">產品</a>
      <div class="dropdown">
        <a href="fx10.html">FX10</a>
        <a href="fx20.html">FX20</a>
        <a href="px100.html">PX100</a>
        <a href="x7fe.html" data-zh="X7 Field Edition" data-en="X7 Field Edition">X7 Field Edition</a>
      </div>
    </li>
    <li class="has-dropdown">
      <a href="solutions.html" data-zh="解決方案" data-en="Solutions">解決方案</a>
      <div class="dropdown">
        <a href="defense.html" data-zh="國防與政府" data-en="Federal & Defense">國防與政府</a>
        <a href="aerospace.html" data-zh="航太與國防" data-en="Aerospace & Defense">航太與國防</a>
        <a href="automotive.html" data-zh="汽車製造" data-en="Automotive">汽車製造</a>
        <a href="industrial.html" data-zh="工業設備" data-en="Industrial Equipment">工業設備</a>
        <a href="medical.html" data-zh="醫療" data-en="Medical">醫療</a>
        <a href="electronics.html" data-zh="電子製造" data-en="Electronics">電子製造</a>
        <a href="energy.html" data-zh="能源" data-en="Energy">能源</a>
        <a href="education.html" data-zh="教育與研究" data-en="Education & Research">教育與研究</a>
        <a href="cpg.html" data-zh="消費品製造" data-en="Consumer Goods">消費品製造</a>
        <a href="food.html" data-zh="食品飲料" data-en="Food & Beverage">食品飲料</a>
        <a href="packaging.html" data-zh="包裝機械" data-en="Packaging Machinery">包裝機械</a>
        <a href="product-dev.html" data-zh="產品開發" data-en="Product Development">產品開發</a>
        <a href="solutions.html" data-zh="查看全部 →" data-en="View All →">查看全部 →</a>
      </div>
    </li>
    <li><a href="materials.html" data-zh="材料" data-en="Materials">材料</a></li>
    <li><a href="cases.html" data-zh="案例" data-en="Cases">案例</a></li>
    <li><a href="about.html" data-zh="關於" data-en="About">關於</a></li>
    <li><a href="contact.html" data-zh="聯絡" data-en="Contact">聯絡</a></li>
  </ul>
  <div class="nav-right">
    <a href="contact.html" class="nav-cta" data-zh="立即詢價" data-en="Request a Quote">立即詢價</a>
    <div class="lang-toggle" id="lang-toggle" role="group" aria-label="Language">
      <span data-lang="zh" class="active">中</span>
      <span class="lang-sep">|</span>
      <span data-lang="en">EN</span>
    </div>
  </div>
</nav>`;

  // ── Footer HTML ─────────────────────────────────────────────────
  var FOOTER_HTML = `
<footer>
  <div class="footer-inner">
    <div class="footer-brand">
      <div class="logo"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1283.6 273.6" width="180" height="38" style="display:block;margin-bottom:12px;" fill="#FFFFFF"><path d="M420.7,67.5l-2,2l-45.5,110.9h-2L325.7,69.5l-2-2H302l-2,2v134.6l2,2h15.8l2-2v-95h2l39.6,95l2,2h17.8l2-2l39.6-95h2v95l2,2h15.8l2-2V69.5l-2-2H420.7z M535.8,115.9c-3.1-3.6-7.2-6.2-12.3-8c-5.1-1.8-11.3-2.7-18.7-2.7c-7.4,0-13.6,0.9-18.7,2.7c-5.1,1.8-9.2,4.1-12.3,6.9c-3.1,2.8-5.3,6-6.6,9.6c-1.3,3.6-2,7.1-2,10.5l2,2h15.8l2-2c0-4,1.5-6.9,4.6-8.9c3.1-2,8.1-3,15.1-3c7,0,12,1.2,15.1,3.7c3.1,2.4,4.6,7.2,4.6,14.1v4l-2,2c-1.6-0.3-3.3-0.6-5.1-1c-1.6-0.3-3.5-0.5-5.6-0.7c-2.2-0.2-4.5-0.3-7-0.3c-6.5,0-12.4,0.6-17.7,1.9c-5.3,1.3-9.9,3.2-13.7,5.7c-3.8,2.6-6.8,5.9-8.9,9.9c-2.1,4-3.2,8.7-3.2,14.1c0,9.9,2.9,17.6,8.6,23.2c5.7,5.6,14.1,8.4,25,8.4c5,0,9.2-0.6,12.7-1.9c3.4-1.3,6.3-2.6,8.5-4.1c2.5-1.7,4.7-3.7,6.5-5.9h2l2,7.9l2,2h13.8l2-2v-55.4c0-7.4-0.7-13.8-2-19.3C541.1,124,538.9,119.5,535.8,115.9z M524.6,170.5c0,5.9-2.3,10.7-6.9,14.3c-4.6,3.6-10.9,5.4-18.8,5.4c-5.9,0-10.4-1.1-13.4-3.2c-3-2.1-4.5-5.7-4.5-10.7c0-5,2-8.9,6.1-11.7c4.1-2.8,10.6-4.2,19.6-4.2c2.5,0,4.7,0.1,6.6,0.3c1.9,0.2,3.6,0.4,5,0.7c1.6,0.4,3,0.7,4.2,1l2,2V170.5z M608.7,107.2c-3.4,0-6.4,0.2-9,0.7c-2.6,0.5-4.8,1.1-6.8,2c-2,0.9-3.8,1.9-5.3,3.2c-1.6,1.3-3.1,2.6-4.5,4.1h-2l-2-7.9l-2-2h-13.8l-2,2v94.9l2,2H579l2-2v-49.4c0-5.9,0.6-10.8,1.8-14.6c1.2-3.8,2.9-6.9,5.1-9.1c2.2-2.2,4.9-3.8,8.1-4.6c3.2-0.9,6.7-1.3,10.7-1.3h9.9l2-2v-13.8l-2-2H608.7z M680.9,150.7l27.7-27.7v-13.8l-2-2h-5.9l-4,2l-45.5,45.5h-2V69.6l-2-2h-15.8l-2,2v134.5l2,2h15.8l2-2v-19.8l2-4l13.8-13.8h2l29.7,37.6l4,2h7.9l2-2v-13.8l-29.7-37.6V150.7z M941,107.2c-3.4,0-6.4,0.2-9,0.7c-2.6,0.5-4.8,1.1-6.8,2c-2,0.9-3.8,1.9-5.3,3.2c-1.6,1.3-3.1,2.6-4.5,4.1h-2l-2-7.9l-2-2h-13.8l-2,2v94.9l2,2h15.8l2-2v-49.4c0-5.9,0.6-10.8,1.8-14.6c1.2-3.8,2.9-6.9,5.1-9.1c2.2-2.2,4.9-3.8,8.1-4.6c3.2-0.9,6.7-1.3,10.7-1.3h9.9l2-2v-13.8l-2-2H941z M1030.9,107.2l-2,2l-2,7.9h-2c-1.7-2.2-3.8-4.2-6.1-5.9c-2.1-1.5-4.8-2.8-8-4.1c-3.2-1.3-7.1-1.9-11.6-1.9c-7,0-13.2,1.3-18.5,3.9c-5.3,2.6-9.9,6.1-13.6,10.7c-3.8,4.5-6.6,10-8.5,16.3c-1.9,6.3-2.9,13.2-2.9,20.6c0,7.4,1,14.2,2.9,20.6c1.9,6.3,4.7,11.8,8.5,16.3c3.8,4.5,8.3,8.1,13.6,10.7c5.3,2.6,11.5,3.9,18.5,3.9c4.5,0,8.3-0.6,11.6-1.9c3.2-1.3,5.9-2.6,8-4.1c2.4-1.7,4.4-3.7,6.1-5.9h2c0,10.9-2,19.3-6.1,25c-4.1,5.7-10.6,8.6-19.6,8.6c-5,0-9.1-0.7-12.2-2c-3.1-1.3-5.6-4-7.6-7.9l-2-2h-15.8l-2,2c1.1,7.9,4.9,14.5,11.6,19.8c6.7,5.3,16,7.9,28,7.9c5.9,0,11.6-0.9,17.1-2.8c5.5-1.8,10.3-4.9,14.5-9.1c4.2-4.2,7.6-9.7,10.1-16.5c2.5-6.8,3.8-15.1,3.8-25v-85l-2-2H1030.9z M1020.1,182.4c-4.6,5.3-10.9,7.9-18.8,7.9c-7.9,0-14.2-2.9-18.8-8.6c-4.6-5.7-6.9-14.1-6.9-25c0-10.9,2.3-19.3,6.9-25c4.6-5.7,10.9-8.6,18.8-8.6c7.9,0,14.2,2.6,18.8,7.9c4.6,5.3,6.9,13.8,6.9,25.7C1027,168.5,1024.7,177.1,1020.1,182.4z M234.9,64.5c-3.4-2.1-7.7-2.2-11.2-0.2L21.8,180.9v-16.8L198.2,62.3c3.5-2,5.6-5.8,5.4-9.8c-0.1-3.8-2.3-7.3-5.6-9.2l-36.2-20.9c-3.4-1.9-7.5-1.9-10.9,0L21.8,96.9V80.1l110.9-64c4-2.3,4-8.2,0-10.5l-7-4c-3.6-2.1-8-2.1-11.5,0L5.5,64.4C2.1,66.3,0,69.9,0,73.8v41.8c0,3.8,1.9,7.4,5.1,9.5c3.4,2.1,7.7,2.2,11.2,0.2l140-80.8l14.5,8.4L5.5,148.3c-3.4,1.9-5.5,5.6-5.5,9.4v41.8c0,3.8,1.9,7.4,5.1,9.5c3.4,2.1,7.7,2.2,11.2,0.2L218.2,92.7v16.8L41.8,211.3c-3.4,1.9-5.5,5.5-5.5,9.4c0,3.9,2.1,7.5,5.5,9.4l36.4,21c3.4,1.9,7.5,1.9,10.9,0l129.1-74.5v16.8l-110.9,64c-4,2.3-4,8.2,0,10.5l7,4c3.6,2.1,8,2.1,11.5,0l108.8-62.8c3.4-1.9,5.5-5.5,5.5-9.4V158c0-3.8-1.9-7.4-5.1-9.5c-3.4-2.1-7.7-2.2-11.2-0.2l-140,80.8l-14.5-8.4l165.5-95.5c3.4-1.9,5.5-5.5,5.5-9.4V74C240,70.2,238.1,66.6,234.9,64.5z M1139.7,120.6c-3.7-4.7-8.4-8.4-14.1-11.2c-5.7-2.8-12.6-4.2-20.5-4.2c-7.9,0-14.7,1.4-20.5,4.2c-5.7,2.8-10.5,6.5-14.1,11.2c-3.7,4.7-6.4,10.2-8.2,16.4c-1.8,6.3-2.7,12.8-2.7,19.7c0,7.4,1,14.2,3,20.6c2,6.3,4.9,11.8,8.9,16.3c4,4.5,8.9,8.1,14.8,10.7c5.9,2.6,12.9,3.9,20.8,3.9c5.9,0,11.2-0.8,15.9-2.4c4.7-1.6,8.7-3.8,12.1-6.5c3.4-2.8,6-5.9,7.9-9.5c1.9-3.6,3.1-7.3,3.7-11.3l-2-2h-15.8l-2,2c-1.1,2.5-2.3,4.5-3.7,6c-1.4,1.5-3,2.7-4.7,3.6c-1.8,0.9-3.6,1.5-5.5,1.8c-1.9,0.3-3.9,0.5-5.8,0.5c-5.9,0-10.6-1.1-14-3.2c-3.4-2.1-6-4.5-7.7-7.2c-1.7-2.7-2.8-5.3-3.3-7.9c-0.5-2.6-0.7-4.4-0.7-5.4l2-2h65.3l2-2v-5.9c0-6.9-0.9-13.4-2.7-19.7C1146.2,130.7,1143.4,125.2,1139.7,120.6z M1126.9,148.8h-43.5l-2-2c0-1.4,0.2-3.5,0.7-6.2c0.5-2.7,1.5-5.3,3.1-7.9c1.6-2.6,4-4.8,7.1-6.7c3.2-1.9,7.4-2.9,12.9-2.9c5.4,0,9.7,1,12.9,2.9c3.2,1.9,5.5,4.2,7.1,6.7c1.6,2.6,2.6,5.2,3.1,7.9c0.5,2.7,0.7,4.8,0.7,6.2L1126.9,148.8z M868,119.1c-4.1-4.5-9.1-7.9-14.9-10.3c-5.9-2.4-12.5-3.6-19.9-3.6c-7.4,0-14,1.2-19.9,3.6c-5.9,2.4-10.8,5.8-14.9,10.3c-4.1,4.5-7.2,9.9-9.4,16.2c-2.2,6.3-3.3,13.4-3.3,21.4s1.1,15,3.3,21.4c2.2,6.3,5.3,11.7,9.4,16.2c4.1,4.5,9.1,7.9,14.9,10.3c5.9,2.4,12.5,3.6,19.9,3.6c7.4,0,14-1.2,19.9-3.6c5.9-2.4,10.8-5.8,14.9-10.3c4.1-4.5,7.2-9.9,9.4-16.2c2.2-6.3,3.3-13.4,3.3-21.4s-1.1-15-3.3-21.4C875.2,129,872.1,123.6,868,119.1z M853.7,181.7c-4.7,5.7-11.6,8.6-20.6,8.6c-9,0-15.8-2.9-20.6-8.6c-4.7-5.7-7.1-14.1-7.1-25c0-10.9,2.4-19.3,7.1-25c4.7-5.7,11.6-8.6,20.6-8.6c9,0,15.8,2.9,20.6,8.6c4.7,5.7,7.1,14.1,7.1,25C860.8,167.6,858.5,175.9,853.7,181.7z M762.9,71.6c-3.4,0-6.8,0.5-10.2,1.5c-3.4,1-6.3,2.5-8.9,4.6c-2.6,2.1-4.6,4.8-6.2,8c-1.6,3.2-2.4,7.1-2.4,11.6v7.9l-2,2h-13.8l-2,2V123l2,2h13.8l2,2v77.1l2,2h15.8l2-2V127l2-2h19.8l2-2v-13.8l-2-2H757l-2-2v-7.9c0-3,0.8-5.1,2.5-6.2c1.6-1.1,3.5-1.7,5.4-1.7h15.8l2-2V73.6l-2-2H762.9z M1246.5,67.7h-15.8l-2,2v47.5h-2c-1.7-2.2-3.8-4.2-6.1-5.9c-2.1-1.5-4.8-2.8-8-4.1c-3.2-1.3-7.1-1.9-11.6-1.9c-7,0-13.2,1.3-18.5,3.9c-5.3,2.6-9.9,6.1-13.6,10.7c-3.8,4.5-6.6,10-8.5,16.3c-1.9,6.3-2.9,13.2-2.9,20.6c0,7.4,1,14.2,2.9,20.6c1.9,6.3,4.7,11.8,8.5,16.3c3.8,4.5,8.3,8.1,13.6,10.7c5.3,2.6,11.5,3.9,18.5,3.9c4.5,0,8.3-0.6,11.6-1.9c3.2-1.3,5.9-2.6,8-4.1c2.4-1.7,4.4-3.7,6.1-5.9h2l2,7.9l2,2h13.8l2-2V69.6L1246.5,67.7z M1221.8,182.4c-4.6,5.3-10.9,7.9-18.8,7.9c-7.9,0-14.2-2.9-18.8-8.6c-4.6-5.7-6.9-14.1-6.9-25c0-10.9,2.3-19.3,6.9-25c4.6-5.7,10.9-8.6,18.8-8.6c7.9,0,14.2,2.6,18.8,7.9c4.6,5.3,6.9,13.8,6.9,25.7C1228.7,168.5,1226.4,177.1,1221.8,182.4z"/></svg></div>
      <p data-zh="Markforged 大中華區官方<br>工業級積層製造解決方案<br>複合材料 · 金屬 · 高溫工程材料" data-en="Markforged Greater China Region<br>Industrial Additive Manufacturing Solutions<br>Composite · Metal · High-Temp Engineering Materials">Markforged 大中華區官方<br>工業級積層製造解決方案<br>複合材料 · 金屬 · 高溫工程材料</p>
    </div>
    <div class="footer-col">
      <h4 data-zh="產品" data-en="Products">產品</h4>
      <ul>
        <li><a href="products.html" data-zh="產品總覽" data-en="All Products">產品總覽</a></li>
        <li><a href="fx10.html">FX10</a></li>
        <li><a href="fx20.html">FX20</a></li>
        <li><a href="px100.html">PX100</a></li>
        <li><a href="x7fe.html" data-zh="X7 Field Edition" data-en="X7 Field Edition">X7 Field Edition</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4 data-zh="導覽" data-en="Navigate">導覽</h4>
      <ul>
        <li><a href="solutions.html" data-zh="解決方案" data-en="Solutions">解決方案</a></li>
        <li><a href="defense.html" data-zh="國防專題" data-en="Federal & Defense">國防專題</a></li>
        <li><a href="aerospace.html" data-zh="航太與國防" data-en="Aerospace">航太與國防</a></li>
        <li><a href="automotive.html" data-zh="汽車製造" data-en="Automotive">汽車製造</a></li>
        <li><a href="industrial.html" data-zh="工業設備" data-en="Industrial">工業設備</a></li>
        <li><a href="medical.html" data-zh="醫療" data-en="Medical">醫療</a></li>
        <li><a href="electronics.html" data-zh="電子製造" data-en="Electronics">電子製造</a></li>
        <li><a href="materials.html" data-zh="材料總覽" data-en="Materials">材料總覽</a></li>
        <li><a href="cases.html" data-zh="客戶案例" data-en="Case Studies">客戶案例</a></li>
        <li><a href="about.html" data-zh="關於我們" data-en="About Us">關於我們</a></li>
        <li><a href="contact.html" data-zh="聯絡我們" data-en="Contact">聯絡我們</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4 data-zh="聯絡" data-en="Contact">聯絡</h4>
      <ul>
        <li><a href="contact.html" data-zh="聯絡我們" data-en="Contact Us">聯絡我們</a></li>
        <li><a href="https://line.me/ti/p/@markforged" target="_blank" rel="noopener">LINE: @markforged</a></li>
        <li><a href="https://markforged.com/contact" target="_blank" rel="noopener" data-zh="Markforged 全球官網" data-en="Markforged Global">Markforged 全球官網</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <p data-zh="© 2026 Markforged 大中華區. All rights reserved." data-en="© 2026 Markforged Greater China Region. All rights reserved.">© 2026 Markforged 大中華區. All rights reserved.</p>
    <p><a href="https://markforged.com" target="_blank" rel="noopener">markforged.com</a></p>
  </div>
</footer>`;

  // ── Inject Nav & Footer ──────────────────────────────────────────
  function inject() {
    var navSlot = document.getElementById('nav-slot');
    if (navSlot) navSlot.outerHTML = NAV_HTML;
    else document.body.insertAdjacentHTML('afterbegin', NAV_HTML);

    var footerSlot = document.getElementById('footer-slot');
    if (footerSlot) footerSlot.outerHTML = FOOTER_HTML;
    else document.body.insertAdjacentHTML('beforeend', FOOTER_HTML);
  }

  // ── Language ─────────────────────────────────────────────────────
  function applyLang(lang) {
    currentLang = lang;
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}

    document.querySelectorAll('[data-zh]').forEach(function (el) {
      var val = lang === 'zh' ? el.getAttribute('data-zh') : el.getAttribute('data-en');
      if (!val) return;
      var tag = el.tagName;
      if (tag === 'META') { el.setAttribute('content', val); }
      else if (tag === 'TITLE') { el.textContent = val; document.title = val; }
      else if (tag === 'INPUT' || tag === 'TEXTAREA') { /* skip value fields */ }
      else { el.innerHTML = val; }
    });

    document.querySelectorAll('[data-ph-zh]').forEach(function (el) {
      el.placeholder = lang === 'zh' ? el.getAttribute('data-ph-zh') : el.getAttribute('data-ph-en');
    });

    // Toggle active class on lang buttons
    document.querySelectorAll('[data-lang]').forEach(function (el) {
      el.classList.toggle('active', el.getAttribute('data-lang') === lang);
    });

    document.documentElement.lang = lang === 'zh' ? 'zh-TW' : 'en';
  }

  // ── Hamburger ─────────────────────────────────────────────────────
  function initNav() {
    var hamburger = document.getElementById('hamburger');
    var navLinks = document.getElementById('nav-links');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
    });

    // Mobile dropdown toggle
    document.querySelectorAll('.has-dropdown > a').forEach(function (a) {
      a.addEventListener('click', function (e) {
        if (window.innerWidth <= 960) {
          e.preventDefault();
          var li = this.parentElement;
          var wasOpen = li.classList.contains('open');
          document.querySelectorAll('.has-dropdown.open').forEach(function (d) { d.classList.remove('open'); });
          if (!wasOpen) li.classList.add('open');
        }
      });
    });

    // Close mobile nav on leaf link click
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () {
        if (window.innerWidth <= 960 && !this.closest('.has-dropdown > a')) {
          navLinks.classList.remove('open');
          hamburger.classList.remove('open');
          hamburger.setAttribute('aria-expanded', false);
        }
      });
    });

    // Mark active page
    var current = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (href === current || (current === '' && href === 'index.html')) {
        a.classList.add('active');
      }
    });
  }

  // ── Lang toggle binding ──────────────────────────────────────────
  function initLang() {
    document.querySelectorAll('#lang-toggle [data-lang]').forEach(function (el) {
      el.addEventListener('click', function () {
        applyLang(this.getAttribute('data-lang'));
      });
    });
    applyLang(currentLang);
  }

  // ── Scroll Reveal ────────────────────────────────────────────────
  function initReveal() {
    // Reveal all elements immediately - no hide/show animation
    // to ensure content is always visible regardless of viewport size
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ── Bootstrap ────────────────────────────────────────────────────
  function boot() {
    inject();
    initNav();
    initLang();
    initReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
