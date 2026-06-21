(function () {
  'use strict';

  function initDock() {
    var dock = document.getElementById('fun-dock');
    if (!dock) return;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDock);
  } else {
    initDock();
  }
})();
