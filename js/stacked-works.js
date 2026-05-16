// Stacked Works - Scroll-driven sequential card reveal with hover interactions
(function() {
  'use strict';

  const section = document.getElementById('SelectedWorks');
  if (!section) return;

  const cards = Array.from(section.querySelectorAll('.stacked-card'));
  if (cards.length === 0) return;

  let scrollProgress = 0;
  let activeIndex = null;

  // Mouse tracking for cursor glow
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.querySelector('.stacked-card-inner').getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.querySelector('.stacked-card-inner').style.setProperty('--mouse-x', x + '%');
      card.querySelector('.stacked-card-inner').style.setProperty('--mouse-y', y + '%');
    });

    card.addEventListener('mouseenter', () => {
      activeIndex = parseInt(card.dataset.index);
      updateCards();
    });

    card.addEventListener('mouseleave', () => {
      activeIndex = null;
      updateCards();
    });
  });

  function getCardProgress(index) {
    const cardStart = index * 0.25;
    const cardEnd = cardStart + 0.5;
    if (scrollProgress <= cardStart) return 0;
    if (scrollProgress >= cardEnd) return 1;
    return (scrollProgress - cardStart) / (cardEnd - cardStart);
  }

  function updateCards() {
    const totalCards = cards.length;

    cards.forEach((card, index) => {
      const progress = getCardProgress(index);

      // Stacked/fanned transforms
      const stackOffset = (index - (totalCards - 1) / 2) * 4; // base offset in px
      const stackRotate = (index - (totalCards - 1) / 2) * 1.5; // base rotation in deg
      const stackScale = 1 - (totalCards - 1 - index) * 0.02;

      // Revealed transforms
      const revealOffset = (index - (totalCards - 1) / 2) * 40;
      const revealRotate = 0;
      const revealScale = 1;

      // Interpolate
      const offset = stackOffset + (revealOffset - stackOffset) * progress;
      const rotate = stackRotate + (revealRotate - stackRotate) * progress;
      const scale = stackScale + (revealScale - stackScale) * progress;

      // Hover override: active card rises to front, straightens, glows
      let zIndex = index;
      let shadow = '0 25px 50px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)';
      let borderOpacity = 0.06;

      if (activeIndex !== null) {
        if (index === activeIndex) {
          zIndex = 100;
          shadow = '0 35px 70px -15px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.15), 0 0 60px rgba(255,255,255,0.04)';
          borderOpacity = 0.15;
        } else {
          zIndex = index;
          // Dim non-active cards
          shadow = '0 15px 30px -10px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)';
        }
      }

      card.style.zIndex = zIndex;
      card.style.transform = `translateY(${offset}px) rotate(${rotate}deg) scale(${scale})`;
      card.style.boxShadow = shadow;
      card.querySelector('.stacked-card-inner').style.borderColor = `rgba(255,255,255,${borderOpacity})`;

      // Fade in opacity as it reveals
      const opacity = 0.3 + progress * 0.7;
      card.style.opacity = activeIndex !== null && index !== activeIndex ? opacity * 0.5 : opacity;
    });
  }

  function handleScroll() {
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const start = windowHeight;
    const end = -rect.height;
    const current = rect.top;

    const rawProgress = (start - current) / (start - end);
    scrollProgress = Math.min(1, Math.max(0, rawProgress));

    updateCards();
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // initial state
})();
