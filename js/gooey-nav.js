(function() {
  'use strict';

  var funBtn = document.getElementById('fun-gooey-btn');
  var homeBtn = document.getElementById('home-nav-btn');
  var canvas = document.getElementById('nav-gooey-canvas');

  if (!funBtn || !homeBtn || !canvas) {
    console.log('GooeyNav: missing elements', !!funBtn, !!homeBtn, !!canvas);
    return;
  }

  var ctx = canvas.getContext('2d');
  var NAVIGATE_DELAY = 900;
  var animId = null;

  function resizeCanvas() {
    var parent = canvas.parentNode;
    var rect = parent.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    canvas.width = (rect.width + 60) * dpr;
    canvas.height = (rect.height + 40) * dpr;
    canvas.style.width = (rect.width + 60) + 'px';
    canvas.style.height = (rect.height + 40) + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function getPos(el) {
    var rect = el.getBoundingClientRect();
    var canvasRect = canvas.getBoundingClientRect();
    return {
      x: rect.left - canvasRect.left + rect.width / 2,
      y: rect.top - canvasRect.top + rect.height / 2,
      w: rect.width,
      h: rect.height
    };
  }

  function easeOutBack(t) {
    if (t >= 1) return 1;
    var c1 = 1.70158;
    var c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }

  function drawRoundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }

  function spawnParticle() {
    var angle = Math.random() * Math.PI * 2;
    var speed = 2 + Math.random() * 4;
    return {
      x: 0, y: 0,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: 2 + Math.random() * 5,
      life: 1.0,
      decay: 0.015 + Math.random() * 0.02
    };
  }

  function drawGooey(t, data) {
    var cw = canvas.width / (window.devicePixelRatio || 1);
    var ch = canvas.height / (window.devicePixelRatio || 1);
    ctx.clearRect(0, 0, cw, ch);

    var progress = Math.min(t / 0.6, 1);
    var eased = easeOutBack(progress);
    var fade = t > 0.6 ? Math.max(0, 1 - (t - 0.6) / 0.3) : 1;

    var sx = data.homeX, sy = data.homeY;
    var ex = data.funX, ey = data.funY;
    var cx = sx + (ex - sx) * eased;
    var cy = sy + (ey - sy) * eased;

    var sw = data.homeW, ew = data.funW;
    var cw2 = sw + (ew - sw) * eased;
    var ch2 = data.homeH;
    var r = ch2 / 2;

    ctx.save();
    ctx.globalAlpha = fade;

    // Glow effect
    ctx.shadowColor = 'rgba(255,255,255,0.4)';
    ctx.shadowBlur = 20;

    // Main pill
    ctx.fillStyle = 'white';
    drawRoundRect(cx - cw2 / 2, cy - ch2 / 2, cw2, ch2, r);
    ctx.fill();

    ctx.shadowBlur = 0;

    // Gooey protrusions
    for (var i = 0; i < 6; i++) {
      var offset = (i - 2.5) * (ch2 * 0.3);
      var side = i < 3 ? -1 : 1;
      var bx = cx + side * cw2 / 2 * 0.75;
      var by = cy + offset;
      var br = r * (0.4 + Math.sin(t * 12 + i * 1.3) * 0.25);
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    // Particles
    for (var j = 0; j < data.particles.length; j++) {
      var p = data.particles[j];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.97;
      p.vy *= 0.97;
      p.life -= p.decay;

      if (p.life > 0) {
        ctx.save();
        ctx.globalAlpha = p.life * fade;
        ctx.fillStyle = 'rgba(255,255,255,' + (p.life * 0.9 + 0.1) + ')';
        ctx.beginPath();
        ctx.arc(p.x + cx, p.y + cy, p.r * p.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }

  funBtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();

    resizeCanvas();

    var hPos = getPos(homeBtn);
    var fPos = getPos(funBtn);

    funBtn.classList.add('gooey-target');
    homeBtn.classList.remove('is-current');

    var data = {
      homeX: hPos.x, homeY: hPos.y,
      homeW: hPos.w, homeH: hPos.h,
      funX: fPos.x, funY: fPos.y,
      funW: fPos.w,
      particles: []
    };

    for (var i = 0; i < 18; i++) {
      data.particles.push(spawnParticle());
    }

    var start = performance.now();

    function animate(now) {
      var elapsed = (now - start) / 1000;
      drawGooey(elapsed, data);

      if (elapsed < 0.5 && Math.random() > 0.75) {
        data.particles.push(spawnParticle());
      }

      data.particles = data.particles.filter(function(p) { return p.life > 0; });

      if (elapsed < 1.0) {
        animId = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, 999, 999);
      }
    }

    if (animId) cancelAnimationFrame(animId);
    animId = requestAnimationFrame(animate);

    setTimeout(function() {
      window.location.href = funBtn.href;
    }, NAVIGATE_DELAY);
  }, false);

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Auto-trigger for testing (remove in production)
  setTimeout(function() {
    console.log('GooeyNav: auto-triggering test');
    funBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  }, 5000);
})();
