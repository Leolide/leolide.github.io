(function() {
  'use strict';

  var homeBtn = document.getElementById('home-nav-btn');
  var funBtn  = document.getElementById('fun-nav-btn');
  var overlay = document.querySelector('.page-transition-overlay');
  var isTransitioning = false;

  function fadeOut() {
    return new Promise(function(resolve) {
      if (!overlay) { resolve(); return; }
      overlay.style.opacity = '1';
      overlay.style.pointerEvents = 'auto';
      setTimeout(resolve, 350);
    });
  }

  function fadeIn() {
    if (!overlay) return;
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
  }

  function updateNav(target) {
    if (homeBtn) {
      homeBtn.classList.toggle('is-current', target === 'home');
      homeBtn.setAttribute('aria-current', target === 'home' ? 'page' : '');
    }
    if (funBtn) {
      funBtn.classList.toggle('is-current', target === 'fun');
      funBtn.setAttribute('aria-current', target === 'fun' ? 'page' : '');
    }
  }

  function swapContent(html, url) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, 'text/html');
    var newContent = doc.querySelector('.page-content');
    var oldContent = document.querySelector('.page-content');
    if (!newContent || !oldContent) return false;

    // Swap
    oldContent.parentNode.replaceChild(newContent, oldContent);

    // Update title
    if (doc.title) document.title = doc.title;

    // Update URL
    history.pushState({page: url}, '', url);

    // Re-initialize any scripts that need to run on new content
    var event = new Event('pageswap');
    document.dispatchEvent(event);

    // Re-initialize Spline 3D scene on new DOM after SPA navigation
    var splineModule = window.Webflow && window.Webflow.require && window.Webflow.require('spline');
    if (splineModule && splineModule.init) {
      try { splineModule.init(); } catch (e) {}
    }

    // Clean up fun-canvas body class if not on fun page
    var hasViewport = newContent.querySelector('#fun-canvas-viewport');
    if (!hasViewport) {
      document.body.classList.remove('fun-canvas-mode');
    }

    return true;
  }

  function navigate(url, target) {
    if (isTransitioning) return;
    isTransitioning = true;

    fadeOut().then(function() {
      return fetch(url, { credentials: 'same-origin' });
    }).then(function(res) {
      if (!res.ok) throw new Error('Fetch failed');
      return res.text();
    }).then(function(html) {
      if (swapContent(html, url)) {
        updateNav(target);
        window.scrollTo(0, 0);
      } else {
        window.location.href = url;
      }
    }).catch(function() {
      window.location.href = url;
    }).finally(function() {
      fadeIn();
      isTransitioning = false;
    });
  }

  if (homeBtn) {
    homeBtn.addEventListener('click', function(e) {
      if (homeBtn.classList.contains('is-current')) return;
      e.preventDefault();
      e.stopPropagation();
      navigate(homeBtn.href, 'home');
    });
  }

  if (funBtn) {
    funBtn.addEventListener('click', function(e) {
      if (funBtn.classList.contains('is-current')) return;
      e.preventDefault();
      e.stopPropagation();
      navigate(funBtn.href, 'fun');
    });
  }

  // Handle back/forward
  window.addEventListener('popstate', function(e) {
    if (e.state && e.state.page) {
      window.location.href = e.state.page;
    }
  });
})();
