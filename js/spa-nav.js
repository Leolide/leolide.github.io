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

  function rebaseUrls(container, targetUrl) {
    var base = new URL(targetUrl, window.location.href);
    container.querySelectorAll('img[src], video[src], source[src], audio[src]').forEach(function(el) {
      var val = el.getAttribute('src');
      if (val && !/^(https?:|data:|\/\/|\/)/.test(val)) {
        el.setAttribute('src', new URL(val, base).pathname);
      }
    });
    container.querySelectorAll('[srcset]').forEach(function(el) {
      var srcset = el.getAttribute('srcset');
      if (!srcset) return;
      el.setAttribute('srcset', srcset.split(',').map(function(part) {
        var pieces = part.trim().split(/\s+/);
        if (pieces[0] && !/^(https?:|data:|\/\/|\/)/.test(pieces[0])) {
          pieces[0] = new URL(pieces[0], base).pathname;
        }
        return pieces.join(' ');
      }).join(', '));
    });
  }

  function swapContent(html, url) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, 'text/html');
    var newContent = doc.querySelector('.page-content');
    var oldContent = document.querySelector('.page-content');
    if (!newContent || !oldContent) return false;

    // Rebase relative image/media paths against the target page's URL
    // so they resolve correctly regardless of which page we're navigating from
    rebaseUrls(newContent, url);

    // Swap
    oldContent.parentNode.replaceChild(newContent, oldContent);

    // Update title
    if (doc.title) document.title = doc.title;

    // Update URL
    history.pushState({page: url}, '', url);

    // Re-initialize any scripts that need to run on new content
    var event = new Event('pageswap');
    document.dispatchEvent(event);

    // Webflow sets opacity:0 on data-w-id elements for scroll animations.
    // After SPA swap its interaction engine never re-runs, so those elements
    // stay invisible. Use an IntersectionObserver to reveal them instead.
    (function revealWebflowElements() {
      var hidden = document.querySelectorAll('[data-w-id][style*="opacity"]');
      if (!hidden.length) return;
      var io = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (!entry.isIntersecting) return;
          entry.target.style.transition = 'opacity 0.5s ease';
          entry.target.style.opacity = '1';
          io.unobserve(entry.target);
        });
      }, { threshold: 0.1 });
      hidden.forEach(function(el) { io.observe(el); });
    })();

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
