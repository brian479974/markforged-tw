/* ================================================================
   home-particles.js — 首頁觀點區的 3D 粒子光影（第十一輪 · 2026-11-11）
   純 WebGL（不載外部函式庫）。粒子組成各產業的立體造型，換觀點時先炸散再重組；
   旋轉光源打出明暗，一道黃色「列印層」掃描帶由下往上掃過（3D 列印逐層成形的意象）。
   造型全部用程式算出來（不是圖片、不是 AI 生成），沒有任何產品外觀或 logo。
   API：window.MFParticles.init(canvas, opts) → { morph(i), pause(b), shapes: [...] }
   ================================================================ */
(function () {
  'use strict';
  var R = Math.random;
  function rnd(a, b) { return a + (b - a) * R(); }

  /* ── 取樣基本形（回傳點陣列），每個部件依面積分配點數 ── */
  function P() { this.parts = []; }
  P.prototype.add = function (area, fn) { this.parts.push([area, fn]); return this; };
  P.prototype.sample = function (n) {
    var tot = 0, out = new Float32Array(n * 3), i, k, acc;
    this.parts.forEach(function (p) { tot += p[0]; });
    var cdf = [], s = 0; this.parts.forEach(function (p) { s += p[0] / tot; cdf.push(s); });
    for (i = 0; i < n; i++) {
      var r = R(); for (k = 0; k < cdf.length - 1 && r > cdf[k]; k++);
      var v = this.parts[k][1]();
      out[i * 3] = v[0]; out[i * 3 + 1] = v[1]; out[i * 3 + 2] = v[2];
    }
    return out;
  };
  // 箱體表面
  function box(cx, cy, cz, w, h, d) {
    return function () {
      var f = R() * (w * h * 2 + w * d * 2 + h * d * 2), x = rnd(-w, w) / 2, y = rnd(-h, h) / 2, z = rnd(-d, d) / 2, s;
      if (f < w * h * 2) z = (f < w * h ? -d : d) / 2;
      else if (f < w * h * 2 + w * d * 2) y = (R() < .5 ? -h : h) / 2;
      else x = (R() < .5 ? -w : w) / 2;
      return [cx + x, cy + y, cz + z];
    };
  }
  // 圓柱表面（axis: 'x'|'y'|'z'），r1→r2 可做錐形
  function cyl(cx, cy, cz, r1, r2, len, axis, caps) {
    return function () {
      var t = R(), a = R() * 6.2832, r = r1 + (r2 - r1) * t, u, v, w;
      if (caps && R() < .18) { r = Math.sqrt(R()) * (t < .5 ? r1 : r2); t = t < .5 ? 0 : 1; }
      u = Math.cos(a) * r; v = Math.sin(a) * r; w = (t - .5) * len;
      if (axis === 'x') return [cx + w, cy + u, cz + v];
      if (axis === 'z') return [cx + u, cy + v, cz + w];
      return [cx + u, cy + w, cz + v];
    };
  }
  function ell(cx, cy, cz, rx, ry, rz) {
    return function () {
      var u = rnd(-1, 1), a = R() * 6.2832, s = Math.sqrt(1 - u * u);
      return [cx + rx * s * Math.cos(a), cy + ry * u, cz + rz * s * Math.sin(a)];
    };
  }
  function torus(cx, cy, cz, R0, r0, axis) {
    return function () {
      var a = R() * 6.2832, b = R() * 6.2832, x = (R0 + r0 * Math.cos(b)) * Math.cos(a), y = r0 * Math.sin(b), z = (R0 + r0 * Math.cos(b)) * Math.sin(a);
      if (axis === 'x') return [cx + y, cy + x, cz + z];
      if (axis === 'z') return [cx + x, cy + z, cz + y];
      return [cx + x, cy + y, cz + z];
    };
  }
  function seg(a, b, j) {
    return function () {
      var t = R(); j = j || 0;
      return [a[0] + (b[0] - a[0]) * t + rnd(-j, j), a[1] + (b[1] - a[1]) * t + rnd(-j, j), a[2] + (b[2] - a[2]) * t + rnd(-j, j)];
    };
  }
  // 平面四邊形（四角）
  function quad(p0, p1, p2, p3, th) {
    return function () {
      var u = R(), v = R(), t = th || 0;
      var a = [p0[0] + (p1[0] - p0[0]) * u, p0[1] + (p1[1] - p0[1]) * u, p0[2] + (p1[2] - p0[2]) * u];
      var b = [p3[0] + (p2[0] - p3[0]) * u, p3[1] + (p2[1] - p3[1]) * u, p3[2] + (p2[2] - p3[2]) * u];
      return [a[0] + (b[0] - a[0]) * v, a[1] + (b[1] - a[1]) * v + rnd(-t, t), a[2] + (b[2] - a[2]) * v];
    };
  }

  // 繞 X 軸傾斜（平面造型朝向鏡頭）
  function tilt(a, ang) {
    var c = Math.cos(ang), s = Math.sin(ang), i, y, z;
    for (i = 0; i < a.length; i += 3) { y = a[i + 1]; z = a[i + 2]; a[i + 1] = c * y - s * z; a[i + 2] = s * y + c * z; }
    return a;
  }
  // 置中並縮放到指定外接半徑（造型大小一致，不會有的被切掉）
  function fitR(a, R0) {
    var i, n = a.length / 3, cx = 0, cy = 0, cz = 0, m = 0, d;
    var mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9];
    for (i = 0; i < a.length; i += 3) for (var k = 0; k < 3; k++) { mn[k] = Math.min(mn[k], a[i + k]); mx[k] = Math.max(mx[k], a[i + k]); }
    cx = (mn[0] + mx[0]) / 2; cy = (mn[1] + mx[1]) / 2; cz = (mn[2] + mx[2]) / 2;
    for (i = 0; i < a.length; i += 3) { a[i] -= cx; a[i + 1] -= cy; a[i + 2] -= cz; d = Math.sqrt(a[i] * a[i] + a[i + 1] * a[i + 1] + a[i + 2] * a[i + 2]); if (d > m) m = d; }
    var s = R0 / (m || 1);
    for (i = 0; i < a.length; i++) a[i] *= s;
    return a;
  }

  /* ── 八個產業造型 ── */
  var SHAPES = [
    { key: 'aerospace', build: function (n) {          // 航太：客機
      var p = new P();
      p.add(2.2, ell(0, 0, 0, 1.15, .13, .13));
      p.add(1.3, quad([.12, -.02, .02], [-.28, -.02, .02], [-.62, -.04, 1.05], [-.42, -.04, 1.05], .006));
      p.add(1.3, quad([.12, -.02, -.02], [-.28, -.02, -.02], [-.62, -.04, -1.05], [-.42, -.04, -1.05], .006));
      p.add(.35, quad([-.82, .02, .02], [-1.05, .02, .02], [-1.15, .02, .42], [-1.0, .02, .42], .004));
      p.add(.35, quad([-.82, .02, -.02], [-1.05, .02, -.02], [-1.15, .02, -.42], [-1.0, .02, -.42], .004));
      p.add(.4, quad([-.8, .1, 0], [-1.1, .1, 0], [-1.18, .48, 0], [-1.02, .48, 0], .004));
      p.add(.35, cyl(-.12, -.16, .42, .07, .06, .32, 'x', true));
      p.add(.35, cyl(-.12, -.16, -.42, .07, .06, .32, 'x', true));
      return p.sample(n);
    } },
    { key: 'industrial', build: function (n) {         // 工業設備：六軸機械手臂（斜向伸出的輪廓）
      var p = new P();
      p.add(.9, cyl(-.35, -.9, 0, .4, .4, .1, 'y', true));
      p.add(.6, cyl(-.35, -.72, 0, .24, .28, .26, 'y', true));
      p.add(.3, ell(-.35, -.52, 0, .19, .19, .19));
      p.add(1.3, seg([-.35, -.52, 0], [-.02, .3, 0], .075));            // 下臂（斜上）
      p.add(.3, ell(-.02, .3, 0, .15, .15, .15));
      p.add(1.1, seg([-.02, .3, 0], [.78, .42, 0], .06));               // 上臂（往前伸）
      p.add(.25, ell(.78, .42, 0, .1, .1, .1));
      p.add(.35, seg([.78, .42, 0], [.92, .16, 0], .045));              // 手腕往下
      p.add(.3, seg([.92, .16, 0], [.86, -.06, .09], .022));            // 夾爪
      p.add(.3, seg([.92, .16, 0], [.86, -.06, -.09], .022));
      p.add(.2, ell(.86, -.12, 0, .05, .05, .05));                       // 夾著的零件
      return p.sample(n);
    } },
    { key: 'defense', build: function (n) {            // 國防：四旋翼無人機
      var p = new P(), k;
      p.add(1.0, box(0, 0, 0, .46, .16, .46));
      p.add(.4, ell(0, .1, 0, .2, .08, .2));
      for (k = 0; k < 4; k++) {
        var a = Math.PI / 4 + k * Math.PI / 2, x = Math.cos(a) * .82, z = Math.sin(a) * .82;
        p.add(.6, seg([0, 0, 0], [x, 0, z], .03));
        p.add(.25, cyl(x, .04, z, .06, .06, .14, 'y', true));
        p.add(.9, torus(x, .1, z, .36, .012, 'y'));
        p.add(.35, seg([x - .3 * Math.cos(a + 1.2), .12, z - .3 * Math.sin(a + 1.2)], [x + .3 * Math.cos(a + 1.2), .12, z + .3 * Math.sin(a + 1.2)], .008));
      }
      p.add(.35, seg([-.2, -.08, .18], [-.26, -.36, .26], .01)); p.add(.35, seg([.2, -.08, .18], [.26, -.36, .26], .01));
      p.add(.35, seg([-.2, -.08, -.18], [-.26, -.36, -.26], .01)); p.add(.35, seg([.2, -.08, -.18], [.26, -.36, -.26], .01));
      return p.sample(n);
    } },
    { key: 'automotive', build: function (n) {         // 汽車：跑車輪廓
      var p = new P();
      p.add(3.0, function () {                            // 車身：超橢球，前低後高
        var u = rnd(-1, 1), a = R() * 6.2832, s = Math.sqrt(1 - u * u), cx = Math.cos(a), sx = Math.sin(a);
        var x = 1.18 * Math.sign(cx) * Math.pow(Math.abs(cx * s), .55), z = .48 * Math.sign(sx) * Math.pow(Math.abs(sx * s), .4);
        var y = .2 * Math.sign(u) * Math.pow(Math.abs(u), .6) - .1 + (x < 0 ? .03 : -.02);
        return [x, y, z];
      });
      p.add(1.1, function () {                            // 座艙
        var u = R(), a = R() * 3.1416, x = rnd(-.55, .35);
        var w = .38 * (1 - Math.pow(Math.abs((x + .1) / .48), 2.4));
        return [x, .08 + Math.sin(a) * .2 * Math.max(w, 0) / .38, Math.cos(a) * Math.max(w, 0)];
      });
      [[.72, .5], [.72, -.5], [-.72, .5], [-.72, -.5]].forEach(function (w) {
        p.add(.55, torus(w[0], -.28, w[1], .18, .045, 'z'));
        p.add(.25, function () { var r = Math.sqrt(R()) * .14, a = R() * 6.2832; return [w[0] + Math.cos(a) * r, -.28 + Math.sin(a) * r, w[1] * 1.04]; });
      });
      return p.sample(n);
    } },
    { key: 'electronics', build: function (n) {        // 電子製造：晶片＋電路
      var p = new P(), k;
      p.add(2.0, box(0, 0, 0, 1.0, .1, 1.0));
      p.add(.6, box(0, .07, 0, .5, .04, .5));
      for (k = 0; k < 12; k++) {
        var t = -.42 + k * (.84 / 11);
        p.add(.06, box(t, -.04, .58, .03, .02, .16)); p.add(.06, box(t, -.04, -.58, .03, .02, .16));
        p.add(.06, box(.58, -.04, t, .16, .02, .03)); p.add(.06, box(-.58, -.04, t, .16, .02, .03));
      }
      for (k = 0; k < 18; k++) {                         // 電路走線
        var side = k % 4, off = rnd(-.45, .45), L = rnd(.3, .6), y = -.07;
        var a = side === 0 ? [.66, y, off] : side === 1 ? [-.66, y, off] : side === 2 ? [off, y, .66] : [off, y, -.66];
        var b = side === 0 ? [.66 + L, y, off] : side === 1 ? [-.66 - L, y, off] : side === 2 ? [off, y, .66 + L] : [off, y, -.66 - L];
        var c = side < 2 ? [b[0], y, off + rnd(-.3, .3)] : [off + rnd(-.3, .3), y, b[2]];
        p.add(.12, seg(a, b, .004)); p.add(.08, seg(b, c, .004));
        p.add(.03, ell(c[0], y, c[2], .025, .01, .025));
      }
      return tilt(p.sample(n), 1.0);
    } },
    { key: 'medical', build: function (n) {            // 醫療：DNA 雙螺旋
      var p = new P(), k;
      p.add(2.2, function () { var t = rnd(-1, 1), a = t * 9.4; return [Math.cos(a) * .42 + rnd(-.02, .02), t * 1.15, Math.sin(a) * .42 + rnd(-.02, .02)]; });
      p.add(2.2, function () { var t = rnd(-1, 1), a = t * 9.4 + Math.PI; return [Math.cos(a) * .42 + rnd(-.02, .02), t * 1.15, Math.sin(a) * .42 + rnd(-.02, .02)]; });
      for (k = 0; k < 22; k++) {
        var t = -1 + k * (2 / 21), a = t * 9.4;
        p.add(.12, seg([Math.cos(a) * .42, t * 1.15, Math.sin(a) * .42], [Math.cos(a + Math.PI) * .42, t * 1.15, Math.sin(a + Math.PI) * .42], .006));
      }
      return p.sample(n);
    } },
    { key: 'energy', build: function (n) {             // 能源：風力發電機
      var p = new P(), k, hub = [0, .62, .1];
      p.add(1.3, cyl(0, -.25, 0, .07, .035, 1.7, 'y', false));
      p.add(.5, box(0, .62, -.08, .14, .14, .36));
      p.add(.25, ell(hub[0], hub[1], hub[2] + .14, .07, .07, .1));
      for (k = 0; k < 3; k++) {
        var a = k * 2.0944 + .3, c = Math.cos(a), s = Math.sin(a), q = -s, r = c;
        p.add(.9, quad([hub[0] + c * .06 + q * .05, hub[1] + s * .06 + r * .05, .25], [hub[0] + c * .06 - q * .05, hub[1] + s * .06 - r * .05, .25],
                       [hub[0] + c * 1.05 - q * .015, hub[1] + s * 1.05 - r * .015, .25], [hub[0] + c * 1.05 + q * .015, hub[1] + s * 1.05 + r * .015, .25], .004));
      }
      p.add(.5, function () { var r = Math.sqrt(R()) * .5, a = R() * 6.2832; return [Math.cos(a) * r, -1.1, Math.sin(a) * r]; });
      return p.sample(n);
    } },
    { key: 'product-dev', build: function (n) {        // 產品開發：3D 列印晶格（gyroid）
      var out = new Float32Array(n * 3), i = 0, x, y, z, g, s = 3.1416 * 1.6;
      var edge = Math.floor(n * .16), c = .9, E = [[[-c,-c,-c],[c,-c,-c]],[[-c,c,-c],[c,c,-c]],[[-c,-c,c],[c,-c,c]],[[-c,c,c],[c,c,c]],
        [[-c,-c,-c],[-c,c,-c]],[[c,-c,-c],[c,c,-c]],[[-c,-c,c],[-c,c,c]],[[c,-c,c],[c,c,c]],
        [[-c,-c,-c],[-c,-c,c]],[[c,-c,-c],[c,-c,c]],[[-c,c,-c],[-c,c,c]],[[c,c,-c],[c,c,c]]];
      for (; i < edge; i++) { var e = E[i % 12], v = seg(e[0], e[1], .006)(); out[i * 3] = v[0]; out[i * 3 + 1] = v[1]; out[i * 3 + 2] = v[2]; }
      while (i < n) {
        x = rnd(-.85, .85); y = rnd(-.85, .85); z = rnd(-.85, .85);
        g = Math.sin(x * s) * Math.cos(y * s) + Math.sin(y * s) * Math.cos(z * s) + Math.sin(z * s) * Math.cos(x * s);
        if (Math.abs(g) < .065) { out[i * 3] = x; out[i * 3 + 1] = y; out[i * 3 + 2] = z; i++; }
      }
      return out;
    } }
  ];

  /* ── WebGL ── */
  var VS = [
    'attribute vec3 aA; attribute vec3 aB; attribute float aS;',
    'uniform float uT, uTime, uScale, uAspect, uSize, uScan, uRY, uRX, uDpr;',
    'uniform vec3 uLight;',
    'varying vec3 vC; varying float vA;',
    'void main(){',
    '  float d = aS * .35; float k = clamp((uT - d) / .65, 0., 1.); k = k*k*(3.-2.*k);',
    '  vec3 p = mix(aA, aB, k);',
    '  float burst = sin(k * 3.1416) * (.35 + aS * .55);',
    '  vec3 dir = normalize(vec3(sin(aS*91.7), cos(aS*53.3), sin(aS*27.1+1.3)));',
    '  p += dir * burst;',
    '  p += .012 * vec3(sin(uTime*1.3 + aS*40.), cos(uTime*1.1 + aS*33.), sin(uTime*.9 + aS*21.));',
    '  float cy = cos(uRY), sy = sin(uRY), cx = cos(uRX), sx = sin(uRX);',
    '  vec3 q = vec3(cy*p.x + sy*p.z, p.y, -sy*p.x + cy*p.z);',
    '  q = vec3(q.x, cx*q.y - sx*q.z, sx*q.y + cx*q.z);',
    '  float cam = 3.4; float w = cam - q.z;',
    '  gl_Position = vec4(q.x * uScale / w / uAspect, q.y * uScale / w, 0., 1.);',
    '  gl_PointSize = max(uSize * uDpr * (cam / w) * (.75 + aS * .5), 1.);',
    '  float lit = .28 + .72 * max(dot(normalize(q + vec3(0.,0.,.001)), uLight), 0.);',
    '  float scan = exp(-pow((p.y - uScan) * 16., 2.));',
    '  float yel = step(.86, fract(aS * 7.31));',
    '  vec3 base = mix(vec3(.92,.95,1.), vec3(1.,1.,0.), yel);',
    '  vC = mix(base * lit, vec3(1.,1.,.15), scan * .9);',
    '  vA = (.30 + .62 * lit + scan * 1.4) * smoothstep(5.4, 2.0, w) * (1. - burst * .25);',
    '}'
  ].join('\n');
  var FS = [
    'precision mediump float; varying vec3 vC; varying float vA;',
    'void main(){ vec2 c = gl_PointCoord - .5; float d = length(c); if (d > .5) discard;',
    '  float core = pow(max(1. - d * 2.2, 0.), 1.3); float halo = pow(1. - d * 2., 4.) * .10;',
  '  float a = (core + halo) * vA; gl_FragColor = vec4(vC * a, a); }'
  ].join('\n');

  function init(canvas, opts) {
    opts = opts || {};
    var gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: 'high-performance' });
    if (!gl) return null;
    function sh(t, s) { var o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw gl.getShaderInfoLog(o); return o; }
    var pr = gl.createProgram();
    try { gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); } catch (e) { return null; }
    gl.linkProgram(pr); if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return null;
    gl.useProgram(pr);
    var small = Math.min(window.innerWidth, window.innerHeight) < 700;
    var N = opts.count || (small ? 18000 : 38000), DUST = Math.floor(N * .05);
    var cache = {};
    function shape(i) {
      if (!cache[i]) {
        var a = fitR(SHAPES[i].build(N - DUST), SHAPES[i].r || 1.12), out = new Float32Array(N * 3), k;
        out.set(a);
        for (k = N - DUST; k < N; k++) {                 // 遠處懸浮微塵（每個造型共用同一組）
          var r = rnd(1.6, 2.6), u = rnd(-1, 1), t = R() * 6.2832, s = Math.sqrt(1 - u * u);
          if (!init.dust) init.dust = {};
          if (!init.dust[k]) init.dust[k] = [r * s * Math.cos(t), r * u * .6, r * s * Math.sin(t)];
          out[k * 3] = init.dust[k][0]; out[k * 3 + 1] = init.dust[k][1]; out[k * 3 + 2] = init.dust[k][2];
        }
        cache[i] = out;
      }
      return cache[i];
    }
    var seed = new Float32Array(N); for (var j = 0; j < N; j++) seed[j] = R();
    function buf(name, data, size, usage) {
      var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, data, usage);
      var loc = gl.getAttribLocation(pr, name); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0); return b;
    }
    var cur = 0, scatter = new Float32Array(N * 3);
    for (j = 0; j < N * 3; j++) scatter[j] = rnd(-2.2, 2.2);
    var bA = buf('aA', scatter, 3, gl.DYNAMIC_DRAW), bB = buf('aB', shape(0), 3, gl.DYNAMIC_DRAW);
    buf('aS', seed, 1, gl.STATIC_DRAW);
    var U = {}; ['uT', 'uTime', 'uScale', 'uAspect', 'uSize', 'uScan', 'uRY', 'uRX', 'uDpr', 'uLight'].forEach(function (n) { U[n] = gl.getUniformLocation(pr, n); });
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE); gl.disable(gl.DEPTH_TEST); gl.clearColor(0, 0, 0, 0);
    var reduce = opts.reduce, dpr = Math.min(window.devicePixelRatio || 1, 2), W = 0, H = 0;
    function resize() {
      var r = canvas.getBoundingClientRect(); W = Math.max(1, Math.round(r.width * dpr)); H = Math.max(1, Math.round(r.height * dpr));
      if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
      gl.viewport(0, 0, W, H);
    }
    window.addEventListener('resize', resize, { passive: true }); resize();
    var morphT0 = performance.now(), MORPH = reduce ? 1 : 2600, running = true, raf = 0, mx = 0, my = 0, tmx = 0, tmy = 0, rot = .6;
    canvas.parentNode.addEventListener('pointermove', function (e) {
      var r = canvas.getBoundingClientRect(); tmx = ((e.clientX - r.left) / r.width - .5) * 2; tmy = ((e.clientY - r.top) / r.height - .5) * 2;
    }, { passive: true });
    var last = performance.now();
    function frame(now) {
      raf = 0; if (!running) return;
      var dt = Math.min((now - last) / 1000, .05); last = now;
      resize();
      mx += (tmx - mx) * .04; my += (tmy - my) * .04;
      if (!reduce) rot += dt * .22;
      var t = Math.min((now - morphT0) / MORPH, 1), time = now / 1000;
      var aspect = W / H, fit = Math.min(1, aspect) * (small ? 2.55 : 2.75);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(U.uT, reduce ? 1 : t); gl.uniform1f(U.uTime, reduce ? 0 : time);
      gl.uniform1f(U.uScale, fit); gl.uniform1f(U.uAspect, aspect);
      gl.uniform1f(U.uSize, small ? 1.6 : 1.7); gl.uniform1f(U.uDpr, dpr);
      gl.uniform1f(U.uScan, reduce ? 9 : ((time * .32) % 1) * 3 - 1.5);
      gl.uniform1f(U.uRY, rot + mx * .5); gl.uniform1f(U.uRX, -.32 + my * .25);
      var la = time * .5; gl.uniform3f(U.uLight, Math.cos(la) * .7, .55, Math.sin(la) * .7 + .4);
      gl.drawArrays(gl.POINTS, 0, N);
      if (!reduce || t < 1) raf = requestAnimationFrame(frame);
    }
    function kick() { if (!raf && running) { last = performance.now(); raf = requestAnimationFrame(frame); } }
    function morph(i) {
      i = ((i % SHAPES.length) + SHAPES.length) % SHAPES.length;
      // 起點＝目前畫面上的位置近似（上一個目標造型）
      var from = cur === i && morphT0 ? shape(cur) : shape(cur);
      gl.bindBuffer(gl.ARRAY_BUFFER, bA); gl.bufferData(gl.ARRAY_BUFFER, from, gl.DYNAMIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, bB); gl.bufferData(gl.ARRAY_BUFFER, shape(i), gl.DYNAMIC_DRAW);
      cur = i; morphT0 = performance.now(); kick();
    }
    function pause(b) { running = !b; if (running) kick(); }
    kick();
    return { morph: morph, pause: pause, shapes: SHAPES.map(function (s) { return s.key; }) };
  }
  window.MFParticles = { init: init, count: SHAPES.length };
})();
