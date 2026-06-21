(function() {
  'use strict';

  var homeBtn = document.getElementById('home-nav-btn');
  var funBtn  = document.getElementById('fun-nav-btn');
  var overlay = document.querySelector('.page-transition-overlay');

  // Fade in on page load
  if (overlay) {
    overlay.style.opacity = '1';
    setTimeout(function() {
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';
    }, 80);
  }

  function doTransition(href) {
    if (overlay) {
      overlay.style.opacity = '1';
      overlay.style.pointerEvents = 'auto';
    }
    setTimeout(function() {
      window.location.href = href;
    }, 400);
  }

  if (homeBtn) {
    homeBtn.addEventListener('click', function(e) {
      if (homeBtn.classList.contains('is-current')) return;
      e.preventDefault();
      e.stopPropagation();
      doTransition(homeBtn.href);
    }, false);
  }

  if (funBtn) {
    funBtn.addEventListener('click', function(e) {
      if (funBtn.classList.contains('is-current')) return;
      e.preventDefault();
      e.stopPropagation();
      doTransition(funBtn.href);
    }, false);
  }
})();
