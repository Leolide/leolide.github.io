// Selected Works — Sequential Scroll Stack (faithful port of TiltStack canvas)
(function () {
  'use strict';

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function clamp(v, lo, hi) { return Math.min(Math.max(v, lo || 0), hi !== undefined ? hi : 1); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  var hoveredIndex = null;

  function init() {
    var section  = document.getElementById('SelectedWorks');
    if (!section) return;

    var cards    = Array.from(section.querySelectorAll('.sw-card'));
    var driver   = document.getElementById('swDriver');
    var cta      = document.getElementById('swCTA');
    if (!cards.length || !driver) return;

    /* Mobile images fallback — complements CSS media query */
    if (window.innerWidth <= 991) {
      var mobileImages = ['autopilot-mobile.webp', 'kit-mobile.webp', 'debrief-mobile.webp'];
      cards.forEach(function(card, i) {
        var img = card.querySelector('.sw-card-image--screenshot');
        if (img && mobileImages[i]) img.style.backgroundImage = 'url(images/' + mobileImages[i] + ')';
      });
    }

    var TOTAL = cards.length;

    // ── Inject cursor-glow div + hover tracking ──────────────────────────
    cards.forEach(function (card, i) {
      var glow = document.createElement('div');
      glow.className = 'sw-cursor-glow';
      card.appendChild(glow);

      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        glow.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100) + '%');
        glow.style.setProperty('--my', ((e.clientY - rect.top)  / rect.height * 100) + '%');
      });

      card.addEventListener('mouseenter', function () {
        hoveredIndex = i;
        frame();
      });
      card.addEventListener('mouseleave', function () {
        hoveredIndex = null;
        frame();
      });
    });

    // ── Scroll progress [0,1] driven by the driver div ───────────────────
    function getSpread() {
      var r   = driver.getBoundingClientRect();
      var vh  = window.innerHeight;
      return clamp((vh - r.top) / (r.height + vh));
    }

    // ── Per-card accent colors (must match HTML data-accent) ─────────────
    var accentRgb = cards.map(function (c) { return c.getAttribute('data-accent') || '255,255,255'; });

    // ── Main animation frame ─────────────────────────────────────────────
    function frame() {
      var spread     = getSpread();
      var seg        = 1 / TOTAL;
      var anyHovered = hoveredIndex !== null;

      // Determine which card is currently centered (active)
      // Active = entryT is substantially progressed AND exitT is near zero
      var activeIndex = TOTAL - 1; // default to last card
      for (var ai = 0; ai < TOTAL - 1; ai++) {
        var aEntry = easeOut(clamp((spread - ai * seg) / (seg * 0.55)));
        var aExit  = easeOut(clamp((spread - (ai * seg + seg * 0.70)) / (seg * 0.45)));
        if (aEntry >= 0.5 && aExit < 0.5) { activeIndex = ai; break; }
        if (aExit >= 0.5) continue;
        if (aEntry < 0.5) { activeIndex = ai; break; }
      }

      cards.forEach(function (card, i) {
        var entryStart = i * seg;
        var entryEnd   = entryStart + seg * 0.55;
        var exitStart  = entryStart + seg * 0.70;
        var exitEnd    = entryStart + seg * 1.15;

        var entryT = easeOut(clamp((spread - entryStart) / (entryEnd - entryStart)));
        var exitT  = (i < TOTAL - 1)
          ? easeOut(clamp((spread - exitStart) / (exitEnd - exitStart)))
          : 0;

        // Stacked starting positions (all cards just below center)
        var stackedY     =  20 + i * 6;
        var stackedRot   = (i - (TOTAL - 1) / 2) * 1.2;
        var stackedScale = 1 - i * 0.025;

        var baseY   = lerp(stackedY, 0, entryT);
        var finalYv = lerp(baseY, -780, exitT);
        var finalRot   = lerp(stackedRot, 0, entryT);
        var finalScale = lerp(stackedScale, 1, entryT);

        // Only the active (centered) card is interactive
        var isActive  = (i === activeIndex);
        card.style.pointerEvents = isActive ? 'auto' : 'none';
        if (!isActive && hoveredIndex === i) { hoveredIndex = null; }

        var isHovered = isActive && (hoveredIndex === i);

        // Hover modifiers
        var liftY  = isHovered ? -14 : 0;
        var sc     = finalScale * (isHovered ? 1.02 : 1);
        var rot    = isHovered ? 0 : finalRot;
        var zIdx   = isHovered ? 50 : (TOTAL - i);

        var opacity;
        if (exitT > 0.05) {
          opacity = Math.max(0, 1 - exitT * 1.4);
        } else if (anyHovered && !isHovered) {
          opacity = 0.55;
        } else {
          opacity = 1;
        }

        card.style.transform = 'translate(-50%, calc(-50% + ' + (finalYv + liftY) + 'px)) rotate(' + rot + 'deg) scale(' + sc + ')';
        card.style.opacity   = opacity;
        card.style.zIndex    = zIdx;

        // Hover box-shadow with accent glow
        var acc = accentRgb[i];
        if (isHovered) {
          card.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.15), 0 28px 60px rgba(0,0,0,0.75), 0 0 80px rgba(' + acc + ',0.18)';
          card.style.borderColor = 'rgba(255,255,255,0.13)';
        } else {
          card.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.08), 0 14px 36px rgba(0,0,0,0.55)';
          card.style.borderColor = '';
        }
      });

      // Fade in "View all work" CTA after last card settles
      if (cta) {
        var lastEntryEnd = (TOTAL - 1) * seg + seg * 0.55;
        var ctaT = clamp((spread - lastEntryEnd) / 0.15);
        cta.style.opacity   = ctaT;
        cta.style.transform = 'translateY(' + lerp(16, 0, ctaT) + 'px)';
      }
    }

    var rafId;
    window.addEventListener('scroll', function () {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(frame);
    }, { passive: true });

    frame();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  document.addEventListener('pageswap', init);
})();
