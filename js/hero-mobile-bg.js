(function () {
  'use strict';

  var BREAKPOINT = 991;
  var animFrame = null;
  var canvas = null;
  var ctx = null;
  var startTime = null;

  /* ── card silhouette definitions ── */
  var CARD_DEFS = [
    { xFrac: 0.72, yFrac: 0.18, w: 160, h: 220, speed: 0.009, phase: 0.00 },
    { xFrac: 0.10, yFrac: 0.55, w: 130, h: 180, speed: 0.007, phase: 2.10 },
    { xFrac: 0.55, yFrac: 0.70, w: 110, h: 150, speed: 0.011, phase: 4.20 }
  ];

  /* ── helpers ── */
  function isMobile() {
    return window.innerWidth <= BREAKPOINT;
  }

  function roundRect(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.lineTo(x + w - r, y);
    c.quadraticCurveTo(x + w, y, x + w, y + r);
    c.lineTo(x + w, y + h - r);
    c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    c.lineTo(x + r, y + h);
    c.quadraticCurveTo(x, y + h, x, y + h - r);
    c.lineTo(x, y + r);
    c.quadraticCurveTo(x, y, x + r, y);
    c.closePath();
  }

  /* ── draw a single frame ── */
  function draw(ts) {
    if (!canvas || !ctx) return;
    if (!startTime) startTime = ts;
    var elapsed = (ts - startTime) * 0.001; /* seconds */

    var W = canvas.width;
    var H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    /* 1. background fill */
    ctx.fillStyle = '#08090b';
    ctx.fillRect(0, 0, W, H);

    /* 2. "+" crosshatch grid */
    var gridStep = 40;
    var armLen   = 5;
    var armW     = 1;
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = armW;
    for (var gx = 0; gx <= W + gridStep; gx += gridStep) {
      for (var gy = 0; gy <= H + gridStep; gy += gridStep) {
        ctx.beginPath();
        ctx.moveTo(gx - armLen, gy);
        ctx.lineTo(gx + armLen, gy);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(gx, gy - armLen);
        ctx.lineTo(gx, gy + armLen);
        ctx.stroke();
      }
    }

    /* 3. radial glow — lower-right, echoes Spline triangle light */
    var glowX  = W * 0.82;
    var glowY  = H * 0.78;
    var glowR  = Math.max(W, H) * 0.55;
    var glow   = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, glowR);
    glow.addColorStop(0,   'rgba(80, 120, 180, 0.09)');
    glow.addColorStop(0.4, 'rgba(60,  90, 150, 0.04)');
    glow.addColorStop(1,   'rgba(0,    0,   0, 0.00)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    /* 4. floating card silhouettes */
    for (var i = 0; i < CARD_DEFS.length; i++) {
      var def = CARD_DEFS[i];
      /* slow drift: sinusoidal offset */
      var driftX = Math.sin(elapsed * def.speed * 6.28 + def.phase) * 18;
      var driftY = Math.cos(elapsed * def.speed * 6.28 + def.phase * 0.7) * 12;

      var cx = def.xFrac * W + driftX - def.w * 0.5;
      var cy = def.yFrac * H + driftY - def.h * 0.5;

      /* very faint frosted-glass fill */
      ctx.save();
      roundRect(ctx, cx, cy, def.w, def.h, 12);
      ctx.fillStyle = 'rgba(255,255,255,0.015)';
      ctx.fill();

      /* subtle border */
      ctx.strokeStyle = 'rgba(255,255,255,0.07)';
      ctx.lineWidth = 0.75;
      ctx.stroke();
      ctx.restore();

      /* tiny interior highlight line at top of card */
      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(cx + 14, cy + 1);
      ctx.lineTo(cx + def.w - 14, cy + 1);
      ctx.stroke();
      ctx.restore();
    }

    animFrame = requestAnimationFrame(draw);
  }

  /* ── mount canvas into .bg-image.mobile ── */
  function mount() {
    var host = document.querySelector('.section .bg-image.mobile');
    if (!host) return;

    canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
    host.appendChild(canvas);
    ctx = canvas.getContext('2d');
    resize();
    startTime = null;
    animFrame = requestAnimationFrame(draw);
  }

  /* ── unmount and cancel ── */
  function unmount() {
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

  /* ── resize canvas to match host ── */
  function resize() {
    if (!canvas) return;
    var host = canvas.parentNode;
    if (!host) return;
    var dpr = window.devicePixelRatio || 1;
    var w = host.offsetWidth  || window.innerWidth;
    var h = host.offsetHeight || window.innerHeight;
    canvas.width  = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
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

  /* ── init ── */
  document.addEventListener('DOMContentLoaded', function () {
    if (isMobile()) mount();
    window.addEventListener('resize', onResize);
  });
}());
