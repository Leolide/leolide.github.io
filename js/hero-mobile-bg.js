(function () {
  'use strict';

  var BREAKPOINT = 991; // only render below desktop (Spline handles desktop)
  var animFrame = null;
  var canvas = null;
  var ctx = null;
  var startTime = null;
  var dpr = 1;
  var isRunning = false;

  /* ── pixel blast configuration ── */
  var CONFIG = {
    pixelSize: 5,
    color: [180, 180, 180],
    patternScale: 0.6,
    patternDensity: 0.34,
    rippleSpeed: 0.4,
    rippleIntensity: 1.5,
    edgeFade: 0.05,
    speed: 0.6,
    alpha: 0.45
  };

  var MAX_CLICKS = 10;
  var clickRipples = [];
  for (var i = 0; i < MAX_CLICKS; i++) {
    clickRipples.push({ x: -1, y: -1, time: 0, active: false });
  }
  var rippleIx = 0;

  /* ── noise functions ── */
  function hash(n) {
    return (Math.sin(n) * 43758.5453) - Math.floor(Math.sin(n) * 43758.5453);
  }

  function hash2(x, y) {
    return hash(x * 127.1 + y * 311.7);
  }

  function noise2(x, y) {
    var ix = Math.floor(x);
    var iy = Math.floor(y);
    var fx = x - ix;
    var fy = y - iy;
    var ux = fx * fx * (3 - 2 * fx);
    var uy = fy * fy * (3 - 2 * fy);
    var a = hash2(ix, iy);
    var b = hash2(ix + 1, iy);
    var c = hash2(ix, iy + 1);
    var d = hash2(ix + 1, iy + 1);
    return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
  }

  function fbm2(x, y, t) {
    var sum = 0;
    var amp = 0.5;
    var freq = 1;
    for (var i = 0; i < 5; i++) {
      sum += amp * noise2(x * freq + t * 0.1, y * freq + t * 0.15);
      freq *= 1.25;
      amp *= 0.7;
    }
    return sum;
  }

  /* ── bayer 8x8 dither matrix ── */
  var BAYER8 = [
    0, 32, 8, 40, 2, 34, 10, 42,
    48, 16, 56, 24, 50, 18, 58, 26,
    12, 44, 4, 36, 14, 46, 6, 38,
    60, 28, 52, 20, 62, 30, 54, 22,
    3, 35, 11, 43, 1, 33, 9, 41,
    51, 19, 59, 27, 49, 17, 57, 25,
    15, 47, 7, 39, 13, 45, 5, 37,
    63, 31, 55, 23, 61, 29, 53, 21
  ];

  function bayer8(x, y) {
    var idx = (Math.floor(x) % 8) + (Math.floor(y) % 8) * 8;
    return (BAYER8[idx] / 64) - 0.5;
  }

  /* ── draw a single frame ── */
  function draw(ts) {
    if (!canvas || !ctx || !isRunning) return;
    if (!startTime) startTime = ts;
    var elapsed = (ts - startTime) * 0.001 * CONFIG.speed;

    var W = canvas.width;
    var H = canvas.height;
    var pixelSize = Math.max(CONFIG.pixelSize * dpr, 2);
    var cellSize = pixelSize * 8;

    // Clear
    ctx.fillStyle = '#08090b';
    ctx.fillRect(0, 0, W, H);

    var cols = Math.ceil(W / cellSize);
    var rows = Math.ceil(H / cellSize);

    var r = CONFIG.color[0];
    var g = CONFIG.color[1];
    var b = CONFIG.color[2];
    var baseAlpha = CONFIG.alpha;

    for (var row = 0; row < rows; row++) {
      for (var col = 0; col < cols; col++) {
        var cx = col * cellSize;
        var cy = row * cellSize;

        var nx = col / cols;
        var ny = row / rows;

        // Noise with gradient fade from right side
        var noise = fbm2(nx * CONFIG.patternScale * 10, ny * CONFIG.patternScale * 10, elapsed);
        // Gradient fade: stronger on right side, fades to left
        var gradFade = Math.min((nx + 0.15) * 2.0, 1.0);
        noise *= gradFade;

        // Apply click ripples
        for (var i = 0; i < MAX_CLICKS; i++) {
          var rip = clickRipples[i];
          if (!rip.active) continue;
          var t = elapsed - rip.time;
          if (t < 0) continue;

          var rx = (rip.x / W) * cols;
          var ry = (rip.y / H) * rows;
          var dx = col - rx;
          var dy = row - ry;
          var dist = Math.sqrt(dx * dx + dy * dy);

          var waveR = CONFIG.rippleSpeed * t * cols;
          var ring = Math.exp(-Math.pow((dist - waveR) / 2, 2));
          var atten = Math.exp(-1.0 * t) * Math.exp(-0.5 * dist);
          noise = Math.max(noise, ring * atten * CONFIG.rippleIntensity);
        }

        // Edge fade
        var edgeDist = Math.min(Math.min(nx, ny), Math.min(1 - nx, 1 - ny));
        var edgeFade = edgeDist < CONFIG.edgeFade ? (edgeDist / CONFIG.edgeFade) : 1;

        // Dither within 8x8 cell
        for (var dy = 0; dy < 8; dy++) {
          for (var dx = 0; dx < 8; dx++) {
            var bayer = bayer8(dx, dy);
            var val = noise + bayer + (CONFIG.patternDensity - 0.5);

            if (val > 0.5) {
              var px = cx + dx * pixelSize;
              var py = cy + dy * pixelSize;
              var a = Math.min((val - 0.5) * 3, 1) * baseAlpha * edgeFade;

              if (a > 0.01) {
                var radius = pixelSize * 0.5 * 0.9;
                ctx.beginPath();
                ctx.arc(px + pixelSize * 0.5, py + pixelSize * 0.5, radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
                ctx.fill();
              }
            }
          }
        }
      }
    }

    // Elegant gradient fade-out overlay (bottom 55% fades to bg)
    var grad = ctx.createLinearGradient(0, H * 0.35, 0, H);
    grad.addColorStop(0, 'rgba(8,9,11,0)');
    grad.addColorStop(0.6, 'rgba(8,9,11,0.75)');
    grad.addColorStop(1, 'rgba(8,9,11,1)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    animFrame = requestAnimationFrame(draw);
  }

  /* ── mount canvas ── */
  function mount() {
    var host = document.querySelector('.section .bg-image.mobile');
    if (!host) return;
    if (canvas && canvas.parentNode === host) return;

    canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;z-index:0;';
    host.appendChild(canvas);

    ctx = canvas.getContext('2d');
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    resize();
    startTime = null;
    isRunning = true;
    animFrame = requestAnimationFrame(draw);

    canvas.addEventListener('pointerdown', function (e) {
      var rect = canvas.getBoundingClientRect();
      var scaleX = canvas.width / rect.width;
      var scaleY = canvas.height / rect.height;
      var fx = (e.clientX - rect.left) * scaleX;
      var fy = (e.clientY - rect.top) * scaleY;
      clickRipples[rippleIx] = {
        x: fx,
        y: fy,
        time: elapsedTime(),
        active: true
      };
      rippleIx = (rippleIx + 1) % MAX_CLICKS;
    }, { passive: true });
  }

  function elapsedTime() {
    return startTime ? (performance.now() - startTime) * 0.001 * CONFIG.speed : 0;
  }

  /* ── unmount ── */
  function unmount() {
    isRunning = false;
    if (animFrame) {
      cancelAnimationFrame(animFrame);
      animFrame = null;
    }
    if (canvas && canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }
    canvas = null;
    ctx = null;
    startTime = null;
  }

  /* ── resize ── */
  function resize() {
    if (!canvas) return;
    var host = canvas.parentNode;
    if (!host) return;
    var w = host.offsetWidth || window.innerWidth;
    var h = host.offsetHeight || window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
  }

  /* ── handle viewport changes ── */
  var resizeTimer = null;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (isMobile()) {
        if (!canvas) mount();
        else resize();
      } else {
        unmount();
      }
    }, 120);
  }

  function isMobile() {
    return window.innerWidth <= BREAKPOINT;
  }

  /* ── init ── */
  function tryMount() {
    if (isMobile()) mount();
  }

  document.addEventListener('DOMContentLoaded', function () {
    tryMount();
    window.addEventListener('resize', onResize);
  });

  if (document.readyState !== 'loading') {
    tryMount();
  }

  // Re-mount after SPA page swap (content may have been replaced)
  document.addEventListener('pageswap', function () {
    unmount();
    // Small delay to ensure new DOM is in place
    setTimeout(tryMount, 50);
  });
}());
