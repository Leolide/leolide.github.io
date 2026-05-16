// Selected Works — Sequential Scroll Stack
(function () {
  'use strict';

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function clamp(v, lo, hi) {
    return Math.min(Math.max(v, lo), hi);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function init() {
    const section = document.getElementById('SelectedWorks');
    if (!section) return;

    const cards = Array.from(section.querySelectorAll('.sw-card'));
    const driver = document.getElementById('swDriver');
    if (!cards.length || !driver) return;

    const TOTAL = cards.length;
    const STACK_OFFSET = 8; // px between stacked cards at rest
    const STACK_SCALE  = 0.025; // scale step per card in stack

    // Inject cursor glow div into each card
    cards.forEach(card => {
      const glow = document.createElement('div');
      glow.className = 'sw-cursor-glow';
      card.appendChild(glow);

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        glow.style.setProperty('--mx', x + '%');
        glow.style.setProperty('--my', y + '%');
      });
    });

    function getScrollProgress() {
      // Progress through the driver div (0 = top of driver, 1 = bottom)
      const driverRect = driver.getBoundingClientRect();
      const vh = window.innerHeight;
      // When driverRect.top === vh, progress = 0 (just entered)
      // When driverRect.bottom === 0, progress = 1 (fully exited)
      const total = driverRect.height + vh;
      const elapsed = vh - driverRect.top;
      return clamp(elapsed / total, 0, 1);
    }

    function animate() {
      const p = getScrollProgress();

      // Divide [0,1] into TOTAL equal segments, one per card
      const segSize = 1 / TOTAL;

      cards.forEach((card, i) => {
        // Local progress for this card's segment [0,1]
        const segStart = i * segSize;
        const segEnd   = (i + 1) * segSize;
        const localP   = clamp((p - segStart) / segSize, 0, 1);

        let translateY, scale, opacity, zIndex, rotate;

        if (p < segStart) {
          // Card hasn't been reached yet — sits in the stack below
          // Stack offset: each waiting card is slightly lower and smaller
          const stackDepth = i - Math.floor(p / segSize);
          translateY = stackDepth * STACK_OFFSET;
          scale      = 1 - stackDepth * STACK_SCALE;
          opacity    = stackDepth === 0 ? 1 : Math.max(0, 1 - stackDepth * 0.18);
          zIndex     = TOTAL - stackDepth;
          rotate     = 0;
        } else if (i < TOTAL - 1 && p >= segEnd) {
          // Card has already been revealed and exited (not the last card)
          // Fly upward off screen
          const exitP  = easeOut(clamp((p - segEnd) / segSize, 0, 1));
          translateY   = lerp(0, -120, exitP);
          scale        = lerp(1, 0.92, exitP);
          opacity      = lerp(1, 0, exitP * 2); // fade faster than translate
          zIndex       = i + 1;
          rotate       = 0;
        } else if (i === TOTAL - 1 && p >= segEnd) {
          // Last card — stays centered forever
          translateY = 0;
          scale      = 1;
          opacity    = 1;
          zIndex     = TOTAL;
          rotate     = 0;
        } else {
          // Active segment — card rises from stack to center
          const ep   = easeOut(localP);
          // Rise from stackOffset below to center (0)
          translateY = lerp(STACK_OFFSET, 0, ep);
          scale      = lerp(1 - STACK_SCALE, 1, ep);
          opacity    = lerp(0.75, 1, ep);
          zIndex     = TOTAL + 1; // on top while animating in
          rotate     = 0;
        }

        card.style.transform  = `translate(-50%, calc(-50% + ${translateY}px)) scale(${scale}) rotate(${rotate}deg)`;
        card.style.opacity    = opacity;
        card.style.zIndex     = zIndex;
      });
    }

    // Use rAF loop for smooth 60fps
    let rafId;
    function onScroll() {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(animate);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    animate(); // run once on load
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
