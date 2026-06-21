// BounceCards — vanilla JS port of the React Bits component
// Requires GSAP (loaded via CDN)

(function () {
  'use strict';

  var DEFAULT_TRANSFORMS = [
    'rotate(5deg) translate(-120px)',
    'rotate(0deg) translate(-55px)',
    'rotate(-4deg)',
    'rotate(5deg) translate(55px)',
    'rotate(-3deg) translate(120px)'
  ];

  function getNoRotationTransform(transformStr) {
    if (/rotate\([\s\S]*?\)/.test(transformStr)) {
      return transformStr.replace(/rotate\([\s\S]*?\)/, 'rotate(0deg)');
    }
    if (transformStr === 'none') return 'rotate(0deg)';
    return transformStr + ' rotate(0deg)';
  }

  function getPushedTransform(baseTransform, offsetX) {
    var match = baseTransform.match(/translate\(([-0-9.]+)px\)/);
    if (match) {
      var newX = parseFloat(match[1]) + offsetX;
      return baseTransform.replace(/translate\(([-0-9.]+)px\)/, 'translate(' + newX + 'px)');
    }
    if (baseTransform === 'none') return 'translate(' + offsetX + 'px)';
    return baseTransform + ' translate(' + offsetX + 'px)';
  }

  function init(container) {
    if (!container || !window.gsap) return;

    var cards = Array.from(container.querySelectorAll('.bc-card'));
    var transforms = JSON.parse(container.dataset.transforms || 'null') || DEFAULT_TRANSFORMS;
    var enableHover = container.dataset.hover !== 'false';
    var delay = parseFloat(container.dataset.delay || '0.4');
    var stagger = parseFloat(container.dataset.stagger || '0.08');
    var ease = container.dataset.ease || 'elastic.out(1, 0.5)';

    // Set initial transforms
    cards.forEach(function (card, i) {
      card.style.transform = transforms[i] || 'none';
    });

    // Bounce in
    gsap.fromTo(cards,
      { scale: 0 },
      {
        scale: 1,
        stagger: stagger,
        ease: ease,
        delay: delay
      }
    );

    if (!enableHover) return;

    cards.forEach(function (card, hoveredIdx) {
      card.addEventListener('mouseenter', function () {
        cards.forEach(function (c, i) {
          gsap.killTweensOf(c);
          var base = transforms[i] || 'none';
          if (i === hoveredIdx) {
            gsap.to(c, { transform: getNoRotationTransform(base), duration: 0.4, ease: 'back.out(1.4)', overwrite: 'auto' });
          } else {
            var offsetX = i < hoveredIdx ? -160 : 160;
            var distance = Math.abs(hoveredIdx - i);
            gsap.to(c, { transform: getPushedTransform(base, offsetX), duration: 0.4, ease: 'back.out(1.4)', delay: distance * 0.05, overwrite: 'auto' });
          }
        });
      });

      card.addEventListener('mouseleave', function () {
        cards.forEach(function (c, i) {
          gsap.killTweensOf(c);
          gsap.to(c, { transform: transforms[i] || 'none', duration: 0.4, ease: 'back.out(1.4)', overwrite: 'auto' });
        });
      });
    });
  }

  function initAll() {
    document.querySelectorAll('.bounce-cards').forEach(init);
  }

  document.addEventListener('DOMContentLoaded', initAll);
  document.addEventListener('pageswap', initAll);

  window.BounceCards = { init: init, initAll: initAll };
})();
