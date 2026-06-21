(function() {
  'use strict';

  var funBtn = document.getElementById('fun-gooey-btn');
  var homeBtn = document.getElementById('home-nav-btn');
  var canvas = document.getElementById('nav-gooey-canvas');
  var overlay = document.querySelector('.page-transition-overlay');

  // ── Page transition helpers ─────────────────────────────────
  function doTransition(href) {
    if (overlay) {
      overlay.style.opacity = '1';
      overlay.style.pointerEvents = 'auto';
    }
    setTimeout(function() {
      window.location.href = href;
    }, 400);
  }

  // Fade in on page load
  if (overlay) {
    overlay.style.opacity = '1';
    setTimeout(function() {
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';
    }, 80);
  }

  // ── Home button: simple slide transition ────────────────────
  if (homeBtn) {
    homeBtn.addEventListener('click', function(e) {
      if (homeBtn.classList.contains('is-current')) return;
      e.preventDefault();
      e.stopPropagation();

      if (!canvas || !homeBtn) {
        doTransition(homeBtn.href);
        return;
      }

      resizeCanvas();
      var hPos = getPos(homeBtn);
      var fPos = getPos(funBtn);

      homeBtn.classList.add('is-current');
      funBtn.classList.remove('is-current');
      funBtn.classList.remove('gooey-target');

      var data = {
        homeX: hPos.x, homeY: hPos.y,
        homeW: hPos.w, homeH: hPos.h,
        funX: fPos.x, funY: fPos.y,
        funW: fPos.w
      };

      var start = performance.now();

      function animateSlide(now) {
        var t = (now - start) / 1000;
        var cw = canvas.width / (window.devicePixelRatio || 1);
        var ch = canvas.height / (window.devicePixelRatio || 1);
        ctx.clearRect(0, 0, cw, ch);

        var progress = Math.min(t / 0.5, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var fade = t > 0.5 ? Math.max(0, 1 - (t - 0.5) / 0.2) : 1;

        var sx = data.funX, sy = data.funY;
        var ex = data.homeX, ey = data.homeY;
        var cx = sx + (ex - sx) * eased;
        var cy = sy + (ey - sy) * eased;
        var sw = data.funW, ew = data.homeW;
        var w = sw + (ew - sw) * eased;
        var h = data.homeH;
        var r = h / 2;

        ctx.save();
        ctx.globalAlpha = fade;
        ctx.fillStyle = 'white';
        drawRoundRect(cx - w / 2, cy - h / 2, w, h, r);
        ctx.fill();
        ctx.restore();

        if (t < 0.7) {
          requestAnimationFrame(animateSlide);
        } else {
          ctx.clearRect(0, 0, cw, ch);
        }
      }

      requestAnimationFrame(animateSlide);
      setTimeout(function() {
        doTransition(homeBtn.href);
      }, 700);
    }, false);
  }

  // If no canvas or fun button, stop here
  if (!funBtn || !canvas) {
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
    ctx.restore();

    // Particles (burst dots, not bubbling protrusions)
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
    if (funBtn.classList.contains('is-current')) return;
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

    for (var i = 0; i < 8; i++) {
      data.particles.push(spawnParticle());
    }

    var start = performance.now();

    function animate(now) {
      var elapsed = (now - start) / 1000;
      drawGooey(elapsed, data);

      if (elapsed < 0.3 && Math.random() > 0.85) {
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

    // After gooey animation, do page transition
    setTimeout(function() {
      doTransition(funBtn.href);
    }, NAVIGATE_DELAY);
  }, false);

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
})();
