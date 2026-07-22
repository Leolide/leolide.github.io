(function () {
  'use strict';

  var STORAGE_VERSION = 'v8-next';
  var STORAGE_KEY = 'fun-canvas-' + STORAGE_VERSION;
  var PAN_STORAGE_KEY = 'fun-canvas-pan-' + STORAGE_VERSION;
  var DRAG_THRESHOLD = 5;
  var isEditMode = false;
  var MIN_SCALE = 0.25;
  var MAX_SCALE = 3.5;

  /* Author mode: open /fun?edit=1 to arrange the canvas and export the layout.
     Visitors always get the curated default layout and the cinematic opening —
     nothing they drag is persisted. */
  var IS_AUTHOR = /[?&]edit=1/.test(window.location.search);
  var REDUCE_MOTION = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* The world is organised as four themed clusters around the hero:
     things I've built (N) · community (W) · doodles & manga (S) · food & the outdoors (E) */
  /* Curated layout — exported from the canvas by Lide (?edit=1 → Export). */
  var DEFAULT_POSITIONS = {
    'canvas-hero':    { left: 328.538,  top: -173.868, rot: -0.5 },

    /* — things I've built (north) — */
    'canvas-card-1':  { left: 5.49023,  top: -673.007, rot: 1.8  },
    'canvas-card-2':  { left: 231.307,  top: -571.307, rot: -1.1 },
    'canvas-card-7':  { left: 463.66,   top: -725.817, rot: 0.9  },
    'canvas-card-6':  { left: 740.445,  top: -614.773, rot: -2   },
    'canvas-photo-8': { left: 977.145,  top: -795.555, rot: -3,   width: 234.884, height: 338.671, caption: 'Model that is bigger than me\nBerkeley, 2019' },

    /* — community (west) — */
    'canvas-card-0':  { left: -713.4,   top: -184.508, rot: -0.8370028327311587 },
    'canvas-photo-4': { left: -451.563, top: -122.483, rot: 2.3858358053842936, width: 265.111, height: 279.111, caption: 'Clase de Español, London, 2025' },
    'canvas-photo-9': { left: -1057.66, top: -31.7646, rot: 0,    width: 360, height: 240, caption: 'Fouxy Squad, London, 2026' },
    'canvas-photo-11': { left: -1314.84, top: -190.393, rot: -0.16055764563408936, width: 221.412, height: 340.882, caption: 'Config WatchParty, London, 2026' },

    /* — doodles & manga (south) — */
    'canvas-card-3':  { left: -55.294,  top: 528.693,  rot: -0.8 },
    'canvas-card-4':  { left: 180.065,  top: 592.548,  rot: -0.7 },
    'canvas-card-5':  { left: 440.458,  top: 456.928,  rot: 1.5  },
    'canvas-photo-5': { left: 681.896,  top: 549.412,  rot: 2.5,  width: 260, height: 340, caption: 'Kendo Boy, Japan, 2020' },

    /* — food & the outdoors (east) — */
    'canvas-photo-6': { left: 1128.48,  top: -76.8231, rot: -1.5, width: 340, height: 260, caption: 'Hawaii, US, 2023' },
    'canvas-photo-0': { left: 1435.64,  top: -234.824, rot: -1.8, width: 280, height: 360, caption: 'Tignes, France, 2024' },
    'canvas-photo-10': { left: 1637.65, top: -124.707, rot: 1.8,  width: 278.235, height: 372.059, caption: 'Patagonia, Chile, 2026' },
    'canvas-photo-7': { left: 1948.15,  top: -5.02287, rot: 1,    width: 260, height: 320, caption: 'Gyudon, 2020' },
    'canvas-photo-2': { left: 1264.7,   top: 236.47,   rot: -0.6, width: 340, height: 260, caption: 'Boat Club, Cambridge, 2022' },
    'canvas-card-8':  { left: 2064.46,  top: 199.03,   rot: -1.4, z: 11 },

    /* — handwritten notes: hidden until the visitor pans near them — */
    'canvas-note-1':  { left: 540.206,  top: -390.882, rot: 0.8,  text: 'I like studying cities\n& complex systems' },
    'canvas-note-2':  { left: 14.3253,  top: -723.366, rot: 1.0912047486640095, text: 'I have built architecture in the real world!' },
    'canvas-note-3':  { left: 353.333,  top: 178.889,  rot: 1.2,  text: 'drag things and pan around, I left notes everywhere' },
    'canvas-note-4':  { left: -446.081, top: 173.848,  rot: 1.7830832955024705, text: 'Fun fact: Hablo un poco Español!' },
    'canvas-note-5':  { left: -1056.89, top: 233.349,  rot: -0.36751063430080766, text: 'I happened to start a designer\ncommunity in London' },
    'canvas-note-6':  { left: 1955.96,  top: -62.8675, rot: 1.5064718886182635, text: 'Cooking is meditating for me' },
    'canvas-note-7':  { left: 1628.2,   top: 463.99,   rot: 0.6,  text: 'I used to row!' },
    'canvas-note-8':  { left: 761.079,  top: 494.738,  rot: 0.5,  text: 'I still have a manga dream' },
    'canvas-note-9':  { left: -48.1699, top: 480.197,  rot: 0,    text: 'I do stickers... WHAT' }
  };

  /* Faint handwritten labels rendered behind each cluster */
  var CLUSTER_LABELS = [
    { id: 'cluster-label-build',  text: "Things I've Built",   left: 16.6815,  top: -813.795, rot: -1.6 },
    { id: 'cluster-label-people', text: 'Community',           left: -1048.47, top: -114.41,  rot: 1.2  },
    { id: 'cluster-label-draw',   text: 'Doodles & Manga',     left: -52.1577, top: 413.529,  rot: -1   },
    { id: 'cluster-label-live',   text: 'Food & The Outdoors', left: 1025.88,  top: -165.296, rot: 0.8  }
  ];

  /* Camera tour — the Wander button / arrow keys cycle through these framings.
     Index 0 is home (the hero). */
  var TOUR = [
    { cx: 580,  cy: -30,  scale: 0.9  },   /* hero */
    { cx: 600,  cy: -510, scale: 0.85 },   /* things I've built */
    { cx: -750, cy: 40,   scale: 0.85 },   /* community */
    { cx: 440,  cy: 660,  scale: 0.85 },   /* doodles & manga */
    { cx: 1690, cy: 130,  scale: 0.8  }    /* food & the outdoors */
  ];
  var tourIndex = 0;

  var viewport, canvas;
  var panX = 0, panY = 0, scale = 1;
  var isPanning = false;
  var panStartX = 0, panStartY = 0;
  var panOriginX = 0, panOriginY = 0;
  var pinchStartDist = 0;
  var pinchStartScale = 1;
  var pinchMidX = 0, pinchMidY = 0;

  var dragging = null;
  var dragStartClientX = 0, dragStartClientY = 0;
  var dragStartLeft = 0, dragStartTop = 0;
  var dragMoved = false;
  var dragStartedOnAnchor = false;

  var selectedCard = null;
  var floatingMenu = null;

  /* Ids of items (notes, photos) the author deleted — persisted so they
     don't resurrect on the next load. */
  var deletedItems = [];

  function getCentroid(touches) {
    var x = 0, y = 0;
    for (var i = 0; i < touches.length; i++) {
      x += touches[i].clientX;
      y += touches[i].clientY;
    }
    return { x: x / touches.length, y: y / touches.length };
  }

  function getTouchDist(touches) {
    var dx = touches[0].clientX - touches[1].clientX;
    var dy = touches[0].clientY - touches[1].clientY;
    return Math.hypot(dx, dy);
  }

  function applyCanvasTransform(animated) {
    if (animated) {
      canvas.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    } else {
      canvas.style.transition = 'none';
    }
    canvas.style.transform = 'translate(' + panX + 'px, ' + panY + 'px) scale(' + scale + ')';
    updateFloatingMenu();
  }

  function savePan() {
    if (!IS_AUTHOR) return;
    try {
      localStorage.setItem(PAN_STORAGE_KEY, JSON.stringify({ x: panX, y: panY, s: scale, __version: STORAGE_VERSION }));
    } catch (e) {}
  }

  function loadPan() {
    try {
      var d = JSON.parse(localStorage.getItem(PAN_STORAGE_KEY));
      if (d) {
        if (typeof d.x === 'number') panX = d.x;
        if (typeof d.y === 'number') panY = d.y;
        if (typeof d.s === 'number') scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, d.s));
      }
    } catch (e) {}
  }

  function savePositions() {
    if (!IS_AUTHOR) return;
    var pos = { __version: STORAGE_VERSION };
    document.querySelectorAll('.canvas-item').forEach(function (item) {
      var id = item.id;
      var def = DEFAULT_POSITIONS[id];
      var rotVal = item.style.getPropertyValue('--canvas-rot') || (def ? def.rot + 'deg' : '0deg');
      var rotNum = parseFloat(rotVal) || 0;
      var rec = {
        left: parseFloat(item.style.left) || 0,
        top:  parseFloat(item.style.top)  || 0,
        rot:  rotNum
      };
      var w = parseFloat(item.style.width);
      var h = parseFloat(item.style.height);
      if (w) rec.width  = w;
      if (h) rec.height = h;
      pos[id] = rec;
    });
    pos.__camera = { panX: panX, panY: panY, scale: scale };
    pos.__deleted = deletedItems.slice();
    document.querySelectorAll('.canvas-item.text-item').forEach(function (item) {
      var id = item.id;
      if (pos[id]) {
        var textEl = item.querySelector('.note-text');
        if (textEl) pos[id].text = textEl.innerText || '';
      }
    });
    document.querySelectorAll('.canvas-item.photo-item').forEach(function (item) {
      var id = item.id;
      if (pos[id]) {
        var capEl = item.querySelector('.photo-caption');
        pos[id].caption = capEl ? (capEl.innerText || '').trim() : '';
        pos[id].captionAlign = item.classList.contains('caption-center') ? 'center' : 'left';
        syncCaptionHeight(item); /* photo may have been resized — rewrap */
      }
    });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pos));
    } catch (e) {}
  }

  function loadPositions() {
    try {
      var d = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return d && typeof d === 'object' ? d : null;
    } catch (e) {
      return null;
    }
  }

  function applyPositions(positions, animated) {
    document.querySelectorAll('.canvas-item').forEach(function (item) {
      var id = item.id;
      var pos = (positions && positions[id]) ? positions[id] : DEFAULT_POSITIONS[id];
      var def = DEFAULT_POSITIONS[id];
      var rot = pos && pos.rot !== undefined ? pos.rot : (def ? def.rot : 0);

      if (animated) {
        item.style.transition = 'left 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)';
        setTimeout(function () { item.style.transition = ''; }, 500);
      } else {
        item.style.transition = '';
      }

      if (pos) {
        item.style.left = pos.left + 'px';
        item.style.top  = pos.top  + 'px';
        if (pos.width)  item.style.width  = pos.width  + 'px';
        if (pos.height) item.style.height = pos.height + 'px';
      }
      if (item.classList.contains('photo-item')) {
        var caption = pos && pos.caption !== undefined
          ? pos.caption
          : (def && def.caption);
        setPhotoCaption(item, caption || '');
        var align = pos && pos.captionAlign !== undefined
          ? pos.captionAlign
          : (def && def.captionAlign);
        item.classList.toggle('caption-center', align === 'center');
      }
      item.style.setProperty('--canvas-rot', rot + 'deg');
      item.style.zIndex = String((def && def.z) || 10);
    });
  }

  function bringToFront(item) {
    document.querySelectorAll('.canvas-item').forEach(function (el) {
      /* Cluster labels live behind everything else */
      var def = DEFAULT_POSITIONS[el.id];
      el.style.zIndex = el.classList.contains('cluster-label') ? '1' : String((def && def.z) || 10);
    });
    item.style.zIndex = '100';
  }

  /* ---------- ZOOM ---------- */
  function zoomToPoint(delta, clientX, clientY) {
    var oldScale = scale;
    var newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale + delta));
    if (newScale === oldScale) return;

    var rect = viewport.getBoundingClientRect();
    var vx = clientX - rect.left;
    var vy = clientY - rect.top;

    var worldX = (vx - panX) / oldScale;
    var worldY = (vy - panY) / oldScale;

    panX = vx - worldX * newScale;
    panY = vy - worldY * newScale;
    scale = newScale;

    applyCanvasTransform(false);
    savePan();
    checkNoteReveals();
  }

  function onWheel(e) {
    if (e.ctrlKey || e.metaKey || Math.abs(e.deltaY) > 5) {
      e.preventDefault();
      var delta = -e.deltaY * 0.0015;
      zoomToPoint(delta, e.clientX, e.clientY);
    }
  }

  function startPanFromTouch(touches) {
    var c = getCentroid(touches);
    isPanning = true;
    viewport.classList.add('is-panning');
    panStartX  = c.x;
    panStartY  = c.y;
    panOriginX = panX;
    panOriginY = panY;
  }

  function cancelItemDrag() {
    if (!dragging) return;
    dragging.classList.remove('is-dragging');
    dragging = null;
    dragMoved = false;
  }

  /* ---------- SELECTION ---------- */
  function selectCard(card) {
    if (selectedCard === card) return;
    deselectCard();
    selectedCard = card;
    card.classList.add('is-selected');
    showFloatingMenu();
  }

  function deselectCard() {
    if (selectedCard) {
      selectedCard.classList.remove('is-selected');
      selectedCard = null;
    }
    hideFloatingMenu();
  }

  /* ---------- FLOATING MENU ---------- */
  function createFloatingMenu() {
    if (floatingMenu) return;
    floatingMenu = document.createElement('div');
    floatingMenu.id = 'fun-floating-menu';
    floatingMenu.innerHTML =
      '<button class="fab-btn fab-link" title="Open link">' +
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">' +
          '<path d="M6 10L10 6M10 6H7M10 6V9M3 13H13V3H3V13Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>' +
      '</button>' +
      '<button class="fab-btn fab-edit" title="Edit text">' +
        '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">' +
          '<path d="M8 2L12 6M8 2L2 8V12H6L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>' +
      '</button>' +
      '<button class="fab-btn fab-align" title="Caption alignment"></button>' +
      '<button class="fab-btn fab-delete" title="Delete note">' +
        '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">' +
          '<path d="M2 3.5h10M5.5 3.5V2h3v1.5M3.5 3.5l.7 8.5h5.6l.7-8.5M5.8 6v3.8M8.2 6v3.8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>' +
      '</button>' +
      '<button class="fab-btn fab-close" title="Deselect">' +
        '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">' +
          '<path d="M1 1L7 7M7 7L13 1M7 7L1 13M7 7L13 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
        '</svg>' +
      '</button>';
    document.body.appendChild(floatingMenu);

    floatingMenu.querySelector('.fab-link').addEventListener('click', function (e) {
      e.stopPropagation();
      if (selectedCard) {
        var href = selectedCard.getAttribute('data-href');
        if (href) window.open(href, '_blank');
      }
    });

    floatingMenu.querySelector('.fab-edit').addEventListener('click', function (e) {
      e.stopPropagation();
      if (!selectedCard) return;
      if (selectedCard.classList.contains('text-item')) {
        startNoteEdit(selectedCard, false);
      } else if (selectedCard.classList.contains('photo-item')) {
        startCaptionEdit(selectedCard);
      }
    });

    floatingMenu.querySelector('.fab-align').addEventListener('click', function (e) {
      e.stopPropagation();
      if (!selectedCard || !selectedCard.classList.contains('photo-item')) return;
      selectedCard.classList.toggle('caption-center');
      updateAlignButton();
      savePositions();
    });

    floatingMenu.querySelector('.fab-delete').addEventListener('click', function (e) {
      e.stopPropagation();
      deleteItem(selectedCard);
    });

    floatingMenu.querySelector('.fab-close').addEventListener('click', function (e) {
      e.stopPropagation();
      deselectCard();
    });

    floatingMenu.addEventListener('mousedown', function (e) { e.stopPropagation(); });
    floatingMenu.addEventListener('touchstart', function (e) { e.stopPropagation(); }, { passive: true });
  }

  function updateAlignButton() {
    if (!floatingMenu || !selectedCard) return;
    var btn = floatingMenu.querySelector('.fab-align');
    if (!btn) return;
    var centered = selectedCard.classList.contains('caption-center');
    btn.innerHTML = centered
      ? '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">' +
          '<path d="M2 3h10M3.5 7h7M3 11h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
        '</svg>'
      : '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">' +
          '<path d="M2 3h10M2 7h7M2 11h9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
        '</svg>';
    btn.title = centered ? 'Caption centered — click for left' : 'Caption left — click to center';
  }

  function showFloatingMenu() {
    if (!floatingMenu) createFloatingMenu();
    var editBtn = floatingMenu.querySelector('.fab-edit');
    if (editBtn) {
      var showEdit = selectedCard &&
        (selectedCard.classList.contains('text-item') ||
         selectedCard.classList.contains('photo-item'));
      editBtn.style.display = showEdit ? '' : 'none';
    }
    var alignBtn = floatingMenu.querySelector('.fab-align');
    if (alignBtn) {
      var showAlign = isEditMode && selectedCard && selectedCard.classList.contains('photo-item');
      alignBtn.style.display = showAlign ? '' : 'none';
      if (showAlign) updateAlignButton();
    }
    var deleteBtn = floatingMenu.querySelector('.fab-delete');
    if (deleteBtn) {
      var showDelete = isEditMode && selectedCard &&
        (selectedCard.classList.contains('text-item') || selectedCard.classList.contains('photo-item'));
      deleteBtn.style.display = showDelete ? '' : 'none';
    }
    var linkBtn = floatingMenu.querySelector('.fab-link');
    if (linkBtn) {
      var showLink = selectedCard && selectedCard.getAttribute('data-href');
      linkBtn.style.display = showLink ? '' : 'none';
    }
    floatingMenu.classList.add('is-visible');
    updateFloatingMenu();
  }

  function hideFloatingMenu() {
    if (floatingMenu) floatingMenu.classList.remove('is-visible');
  }

  function updateFloatingMenu() {
    if (!selectedCard || !floatingMenu) return;
    var rect = selectedCard.getBoundingClientRect();
    var menuW = floatingMenu.offsetWidth || 84;
    var menuH = floatingMenu.offsetHeight || 40;
    var left = rect.left + (rect.width / 2) - (menuW / 2);
    var top  = rect.top - menuH - 10;

    if (top < 8) top = rect.bottom + 10;
    if (left < 8) left = 8;
    var vw = window.innerWidth;
    if (left + menuW > vw - 8) left = vw - menuW - 8;

    floatingMenu.style.left = left + 'px';
    floatingMenu.style.top  = top  + 'px';
  }

  /* ---------- MODE ---------- */
  function setEditMode(edit) {
    isEditMode = edit;
    document.body.classList.toggle('read-mode', !edit);
    document.body.classList.toggle('edit-mode', edit);

    /* Author-only dock controls */
    var editEls = ['fun-add-text-btn', 'fun-restore-btn', 'fun-export-btn', 'fun-edit-divider'];
    editEls.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.style.display = edit ? '' : 'none';
    });

    /* Notes are edited transiently (double-click) — make sure none stay editable */
    document.querySelectorAll('.canvas-item.text-item .note-text').forEach(function (t) {
      t.setAttribute('contenteditable', 'false');
    });

    if (!edit) deselectCard();
  }

  /* ---------- ITEM DRAG ---------- */
  function onItemPointerDown(e) {
    /* Everyone can drag everything — it's part of the fun. Visitor moves are
       never persisted, so a refresh always restores the curated layout. */
    if (e.button !== undefined && e.button !== 0) return;
    var item = this;
    e.stopPropagation();

    var clientX, clientY;
    if (e.touches) {
      if (e.touches.length !== 1) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    dragStartClientX    = clientX;
    dragStartClientY    = clientY;
    dragStartLeft       = parseFloat(item.style.left) || 0;
    dragStartTop        = parseFloat(item.style.top)  || 0;
    dragMoved           = false;
    dragging            = item;
    var evtTarget       = e.target || e.touches && e.touches[0] && e.touches[0].target;
    dragStartedOnAnchor = !!(evtTarget && evtTarget.closest('a[href]'));

    item.classList.add('is-dragging');
    bringToFront(item);
    deselectCard();

    if (e.type === 'mousedown') {
      document.addEventListener('mousemove', onDocMouseMove, { passive: false });
      document.addEventListener('mouseup',   onDocMouseUp,   { once: true });
    } else {
      document.addEventListener('touchmove', onDocTouchMove, { passive: false });
      document.addEventListener('touchend',  onDocTouchEnd,  { once: true });
    }
  }

  function onDocMouseMove(e) {
    if (!dragging) return;
    var dx = e.clientX - dragStartClientX;
    var dy = e.clientY - dragStartClientY;
    if (!dragMoved && Math.hypot(dx, dy) > DRAG_THRESHOLD) dragMoved = true;
    if (!dragMoved) return;
    dragging.style.left = (dragStartLeft + dx / scale) + 'px';
    dragging.style.top  = (dragStartTop  + dy / scale) + 'px';
    updateFloatingMenu();
  }

  function onDocMouseUp() {
    document.removeEventListener('mousemove', onDocMouseMove);
    finishDrag();
  }

  function onDocTouchMove(e) {
    if (!e.touches.length) return;
    e.preventDefault();

    if (e.touches.length >= 2) {
      cancelItemDrag();
      var dist = getTouchDist(e.touches);
      var c = getCentroid(e.touches);
      if (!pinchStartDist) {
        pinchStartDist = dist;
        pinchStartScale = scale;
        pinchMidX = c.x;
        pinchMidY = c.y;
        isPanning = true;
        viewport.classList.add('is-panning');
      }
      var ratio = dist / pinchStartDist;
      var newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, pinchStartScale * ratio));
      var rect = viewport.getBoundingClientRect();
      var vx = pinchMidX - rect.left;
      var vy = pinchMidY - rect.top;
      var worldX = (vx - panOriginX) / pinchStartScale;
      var worldY = (vy - panOriginY) / pinchStartScale;
      panX = vx - worldX * newScale;
      panY = vy - worldY * newScale;
      scale = newScale;
      applyCanvasTransform(false);
      document.removeEventListener('touchmove', onDocTouchMove);
      document.removeEventListener('touchend',  onDocTouchEnd);
      document.addEventListener('touchmove', onViewportTouchMove, { passive: false });
      document.addEventListener('touchend',  onViewportTouchEnd,  { once: true });
      return;
    }

    if (!dragging) return;
    var dx = e.touches[0].clientX - dragStartClientX;
    var dy = e.touches[0].clientY - dragStartClientY;
    if (!dragMoved && Math.hypot(dx, dy) > DRAG_THRESHOLD) dragMoved = true;
    if (!dragMoved) return;
    dragging.style.left = (dragStartLeft + dx / scale) + 'px';
    dragging.style.top  = (dragStartTop  + dy / scale) + 'px';
    updateFloatingMenu();
  }

  function onDocTouchEnd() {
    document.removeEventListener('touchmove', onDocTouchMove);
    finishDrag();
  }

  function finishDrag() {
    if (!dragging) return;
    var item = dragging;
    dragging = null;
    item.classList.remove('is-dragging');

    if (dragMoved) {
      savePositions();
    } else if (!dragStartedOnAnchor) {
      if (isEditMode) {
        /* Author: tap selects and shows the floating menu */
        if (item.classList.contains('card-item') || item.classList.contains('text-item') ||
            item.classList.contains('photo-item')) {
          selectCard(item);
        }
      } else if (item.classList.contains('photo-item')) {
        /* Visitor: tap previews the photo in a lightbox */
        var photoImg = item.querySelector('img');
        var capEl = item.querySelector('.photo-caption');
        if (photoImg) {
          openLightbox(
            photoImg.currentSrc || photoImg.src,
            photoImg.alt,
            capEl ? capEl.innerText : '',
            item.classList.contains('caption-center')
          );
        }
      } else {
        /* Visitor: tap simply opens the project */
        var href = item.getAttribute('data-href');
        if (href) window.open(href, '_blank');
      }
    }

    dragMoved = false;
    dragStartedOnAnchor = false;
  }

  /* ---------- PHOTO LIGHTBOX ---------- */
  var lightboxEl = null;

  function onLightboxKey(e) {
    if (e.key === 'Escape') closeLightbox();
  }

  function closeLightbox() {
    if (!lightboxEl) return;
    var el = lightboxEl;
    lightboxEl = null;
    el.classList.remove('is-open');
    document.removeEventListener('keydown', onLightboxKey);
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 240);
  }

  function openLightbox(src, alt, caption, captionCentered) {
    if (!src) return;
    closeLightbox();
    var overlay = document.createElement('div');
    overlay.id = 'fun-lightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', 'Photo preview');
    var fig = document.createElement('figure');
    var img = document.createElement('img');
    img.src = src;
    img.alt = alt || '';
    fig.appendChild(img);
    if (caption && caption.trim()) {
      var figCap = document.createElement('figcaption');
      figCap.textContent = caption.trim();
      fig.appendChild(figCap);
      fig.classList.add('has-caption');
      if (captionCentered) fig.classList.add('caption-center');
    }
    overlay.appendChild(fig);
    overlay.addEventListener('click', closeLightbox);
    document.body.appendChild(overlay);
    var figCapEl = fig.querySelector('figcaption');
    if (figCapEl && figCapEl.scrollHeight > 32) fig.classList.add('caption-two-lines');
    lightboxEl = overlay;
    document.addEventListener('keydown', onLightboxKey);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        overlay.classList.add('is-open');
      });
    });
  }

  /* ---------- PHOTO CAPTIONS (polaroid chin) ---------- */
  function wireCaptionEvents(item, el) {
    /* While actively editing, the caption keeps the pointer for the caret;
       otherwise events bubble up and the photo drags/selects as usual. */
    el.addEventListener('mousedown', function (e) {
      if (item.classList.contains('is-editing-caption')) e.stopPropagation();
    });
    el.addEventListener('touchstart', function (e) {
      if (item.classList.contains('is-editing-caption')) e.stopPropagation();
    }, { passive: true });
    el.addEventListener('blur', function () {
      item.classList.remove('is-editing-caption');
      el.setAttribute('contenteditable', 'false');
      if (!(el.innerText || '').trim()) setPhotoCaption(item, '');
      savePositions();
    });
    el.addEventListener('keydown', function (e) {
      /* Enter commits; Shift+Enter starts the second row */
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        el.blur();
      }
    });
    el.addEventListener('input', function () {
      syncCaptionHeight(item);
    });
  }

  function ensureCaptionEl(item) {
    var el = item.querySelector('.photo-caption');
    if (!el) {
      el = document.createElement('div');
      el.className = 'photo-caption';
      el.setAttribute('contenteditable', 'false');
      item.appendChild(el);
      wireCaptionEvents(item, el);
    }
    return el;
  }

  /* Grow the chin only when the caption wraps to a second row */
  function syncCaptionHeight(item) {
    var el = item.querySelector('.photo-caption');
    item.classList.toggle('caption-two-lines', !!el && el.scrollHeight > 30);
  }

  function setPhotoCaption(item, text) {
    var t = (text || '').trim();
    var el = item.querySelector('.photo-caption');
    if (!t) {
      item.classList.remove('has-caption');
      item.classList.remove('caption-two-lines');
      if (el) el.parentNode.removeChild(el);
      return;
    }
    item.classList.add('has-caption');
    ensureCaptionEl(item).innerText = t;
    syncCaptionHeight(item);
  }

  function startCaptionEdit(item) {
    if (!isEditMode || !item || !item.classList.contains('photo-item')) return;
    var el = ensureCaptionEl(item);
    item.classList.add('has-caption'); /* make room in the chin while typing */
    deselectCard();
    el.setAttribute('contenteditable', 'true');
    item.classList.add('is-editing-caption');
    el.focus();
    var range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  /* ---------- HANDWRITTEN TEXT NOTES ---------- */
  var noteCounter = 0;

  /* Notes drag like any other item; editing starts on double-click and ends
     on blur, so contenteditable is only ever on while actively typing. */
  function startNoteEdit(item, selectAll) {
    var noteText = item.querySelector('.note-text');
    if (!noteText) return;
    deselectCard();
    noteText.setAttribute('contenteditable', 'true');
    item.classList.add('is-editing');
    noteText.focus();
    var range = document.createRange();
    range.selectNodeContents(noteText);
    if (!selectAll) range.collapse(false);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
  function addHandwrittenNote(worldX, worldY, text) {
    var id = 'canvas-note-' + (++noteCounter);
    var item = document.createElement('div');
    item.className = 'canvas-item text-item';
    item.id = id;
    item.style.left = (worldX || 0) + 'px';
    item.style.top  = (worldY || 0) + 'px';
    item.style.setProperty('--canvas-rot', '0deg');
    item.innerHTML = '<div class="note-text" contenteditable="false">' + (text || '') + '</div>';
    canvas.appendChild(item);

    item.addEventListener('mousedown', onItemPointerDown.bind(item));
    item.addEventListener('touchstart', onItemPointerDown.bind(item), { passive: true });

    var noteText = item.querySelector('.note-text');
    /* While actively editing, the text keeps the pointer so the caret works;
       otherwise the event bubbles up and the note drags like anything else. */
    noteText.addEventListener('mousedown', function (e) {
      if (item.classList.contains('is-editing')) e.stopPropagation();
    });
    noteText.addEventListener('touchstart', function (e) {
      if (item.classList.contains('is-editing')) e.stopPropagation();
    }, { passive: true });

    /* Double-click to edit (authors only) */
    item.addEventListener('dblclick', function (e) {
      if (!isEditMode) return;
      e.stopPropagation();
      startNoteEdit(item, false);
    });

    noteText.addEventListener('blur', function () {
      item.classList.remove('is-editing');
      noteText.setAttribute('contenteditable', 'false');
      /* An emptied note deletes itself */
      if (isEditMode && !(noteText.innerText || '').trim()) {
        deleteItem(item);
        return;
      }
      savePositions();
    });
    noteText.addEventListener('keydown', function (e) {
      /* Enter commits; Shift+Enter starts a new row */
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        noteText.blur();
      }
    });

    if (!text) {
      setTimeout(function () {
        startNoteEdit(item, false);
      }, 50);
    }

    var rh = document.createElement('div');
    rh.className = 'rot-handle';
    rh.title = 'Drag to rotate';
    item.appendChild(rh);
    rh.addEventListener('mousedown',  onRotPointerDown);
    rh.addEventListener('touchstart', onRotPointerDown, { passive: false });

    /* No savePositions() here: during restoreNotes the note still has its
       temporary counter id (renamed to the saved id just after this call),
       and saving that snapshot minted duplicate phantom notes on every load.
       New author notes are saved on blur instead. */
    return item;
  }

  /* ---------- DELETE ITEM (notes & photos) ---------- */
  function deleteItem(item) {
    if (!item) return;
    if (!item.classList.contains('text-item') && !item.classList.contains('photo-item')) return;
    if (deletedItems.indexOf(item.id) === -1) deletedItems.push(item.id);
    if (selectedCard === item) deselectCard();
    item.remove();
    savePositions();
  }

  /* ---------- RESTORE SAVED NOTES ---------- */
  function restoreNotes(saved) {
    Object.keys(saved).forEach(function (id) {
      if (!id.startsWith('canvas-note-')) return;
      if (deletedItems.indexOf(id) !== -1) return;
      var p = saved[id];
      if (document.getElementById(id)) return;
      var note = addHandwrittenNote(p.left, p.top, p.text || '');
      note.id = id;
      var num = parseInt(id.replace('canvas-note-', ''), 10);
      if (!isNaN(num) && num > noteCounter) noteCounter = num;
      note.style.setProperty('--canvas-rot', (p.rot || 0) + 'deg');
    });
  }

  /* ---------- PHOTO RESIZE ---------- */
  var resizing = null;
  var resizeStartX = 0, resizeStartY = 0;
  var resizeStartW = 0, resizeStartH = 0;

  function onResizePointerDown(e) {
    if (!isEditMode) return;
    e.stopPropagation();
    e.preventDefault();
    var item = this.closest('.canvas-item');
    resizing = item;
    item.classList.add('is-resizing');
    deselectCard();

    if (e.type === 'mousedown') {
      resizeStartX = e.clientX;
      resizeStartY = e.clientY;
      document.addEventListener('mousemove', onResizeMouseMove, { passive: false });
      document.addEventListener('mouseup',   onResizeMouseUp,   { once: true });
    } else {
      resizeStartX = e.touches[0].clientX;
      resizeStartY = e.touches[0].clientY;
      document.addEventListener('touchmove', onResizeTouchMove, { passive: false });
      document.addEventListener('touchend',  onResizeTouchEnd,  { once: true });
    }
    resizeStartW = item.offsetWidth;
    resizeStartH = item.offsetHeight;
  }

  function applyResize(dx, dy) {
    if (!resizing) return;
    var newW = Math.max(120, resizeStartW + dx / scale);
    var newH = Math.max(120, resizeStartH + dy / scale);
    resizing.style.width  = newW + 'px';
    resizing.style.height = newH + 'px';
    updateFloatingMenu();
  }

  function onResizeMouseMove(e) {
    applyResize(e.clientX - resizeStartX, e.clientY - resizeStartY);
  }

  function onResizeMouseUp() {
    document.removeEventListener('mousemove', onResizeMouseMove);
    finishResize();
  }

  function onResizeTouchMove(e) {
    if (!e.touches.length) return;
    e.preventDefault();
    applyResize(e.touches[0].clientX - resizeStartX, e.touches[0].clientY - resizeStartY);
  }

  function onResizeTouchEnd() {
    document.removeEventListener('touchmove', onResizeTouchMove);
    finishResize();
  }

  function finishResize() {
    if (!resizing) return;
    resizing.classList.remove('is-resizing');
    savePositions();
    resizing = null;
  }

  /* ---------- ROTATION ---------- */
  var rotating = null;
  var rotStartAngle = 0;
  var rotStartRot = 0;

  function getItemCenter(item) {
    var rect = item.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }

  function onRotPointerDown(e) {
    if (!isEditMode) return;
    e.stopPropagation();
    e.preventDefault();
    var item = this.closest('.canvas-item');
    rotating = item;
    item.classList.add('is-rotating');
    deselectCard();

    var c = getItemCenter(item);
    var clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    var clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
    rotStartAngle = Math.atan2(clientY - c.y, clientX - c.x);
    var rotVal = item.style.getPropertyValue('--canvas-rot') || '0deg';
    rotStartRot = parseFloat(rotVal) || 0;

    if (e.type === 'mousedown') {
      document.addEventListener('mousemove', onRotMouseMove, { passive: false });
      document.addEventListener('mouseup',   onRotMouseUp,   { once: true });
    } else {
      document.addEventListener('touchmove', onRotTouchMove, { passive: false });
      document.addEventListener('touchend',  onRotTouchEnd,  { once: true });
    }
  }

  function applyRotation(clientX, clientY) {
    if (!rotating) return;
    var c = getItemCenter(rotating);
    var angle = Math.atan2(clientY - c.y, clientX - c.x);
    var delta = (angle - rotStartAngle) * (180 / Math.PI);
    var newRot = rotStartRot + delta;
    rotating.style.setProperty('--canvas-rot', newRot + 'deg');
  }

  function onRotMouseMove(e) {
    applyRotation(e.clientX, e.clientY);
  }

  function onRotMouseUp() {
    document.removeEventListener('mousemove', onRotMouseMove);
    finishRotation();
  }

  function onRotTouchMove(e) {
    if (!e.touches.length) return;
    e.preventDefault();
    applyRotation(e.touches[0].clientX, e.touches[0].clientY);
  }

  function onRotTouchEnd() {
    document.removeEventListener('touchmove', onRotTouchMove);
    finishRotation();
  }

  function finishRotation() {
    if (!rotating) return;
    rotating.classList.remove('is-rotating');
    savePositions();
    rotating = null;
  }

  /* ---------- CANVAS PAN ---------- */
  function onViewportPointerDown(e) {
    if (e.target !== viewport && e.target !== canvas) return;
    if (e.button !== undefined && e.button !== 0) return;
    deselectCard();

    if (e.touches) {
      var c = getCentroid(e.touches);
      isPanning = true;
      viewport.classList.add('is-panning');
      panStartX  = c.x;
      panStartY  = c.y;
      panOriginX = panX;
      panOriginY = panY;
      pinchStartDist = 0;
      document.addEventListener('touchmove', onViewportTouchMove, { passive: false });
      document.addEventListener('touchend',  onViewportTouchEnd,  { once: true });
    } else {
      isPanning = true;
      viewport.classList.add('is-panning');
      panStartX  = e.clientX;
      panStartY  = e.clientY;
      panOriginX = panX;
      panOriginY = panY;
      document.addEventListener('mousemove', onViewportMouseMove, { passive: true });
      document.addEventListener('mouseup',   onViewportMouseUp,   { once: true });
    }
  }

  function onViewportMouseMove(e) {
    if (!isPanning) return;
    panX = panOriginX + (e.clientX - panStartX);
    panY = panOriginY + (e.clientY - panStartY);
    applyCanvasTransform(false);
  }

  function onViewportMouseUp() {
    document.removeEventListener('mousemove', onViewportMouseMove);
    endPan();
  }

  function onViewportTouchMove(e) {
    if (!isPanning || !e.touches.length) return;
    e.preventDefault();
    var c = getCentroid(e.touches);

    if (e.touches.length >= 2 && pinchStartDist) {
      var dist = getTouchDist(e.touches);
      var ratio = dist / pinchStartDist;
      var newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, pinchStartScale * ratio));
      var rect = viewport.getBoundingClientRect();
      var vx = pinchMidX - rect.left;
      var vy = pinchMidY - rect.top;
      var worldX = (vx - panOriginX) / pinchStartScale;
      var worldY = (vy - panOriginY) / pinchStartScale;
      panX = vx - worldX * newScale;
      panY = vy - worldY * newScale;
      scale = newScale;
    } else {
      panX = panOriginX + (c.x - panStartX);
      panY = panOriginY + (c.y - panStartY);
    }

    applyCanvasTransform(false);
  }

  function onViewportTouchEnd() {
    document.removeEventListener('touchmove', onViewportTouchMove);
    pinchStartDist = 0;
    endPan();
  }

  function endPan() {
    isPanning = false;
    viewport.classList.remove('is-panning');
    savePan();
    checkNoteReveals();
  }

  /* ---------- ZOOM BUTTONS ---------- */
  function zoomByButton(delta) {
    var rect = viewport.getBoundingClientRect();
    var cx = rect.width / 2;
    var cy = rect.height / 2;
    zoomToPoint(delta, cx + rect.left, cy + rect.top);
  }

  /* ---------- CAMERA: FLY-TO & TOUR ---------- */
  function flyTo(frame, duration) {
    deselectCard();
    var rect = viewport.getBoundingClientRect();
    var s = frame.scale;
    var dur = REDUCE_MOTION ? 0 : (duration || 900);
    canvas.style.transition = dur
      ? 'transform ' + dur + 'ms cubic-bezier(0.22, 1, 0.36, 1)'
      : 'none';
    panX = rect.width / 2 - frame.cx * s;
    panY = rect.height / 2 - frame.cy * s;
    scale = s;
    canvas.style.transform = 'translate(' + panX + 'px, ' + panY + 'px) scale(' + scale + ')';
    updateFloatingMenu();
    savePan();
    setTimeout(checkNoteReveals, dur + 60);
  }

  function focusOnHero() {
    tourIndex = 0;
    flyTo(TOUR[0], 700);
  }

  function wander(direction) {
    tourIndex = (tourIndex + (direction || 1) + TOUR.length) % TOUR.length;
    flyTo(TOUR[tourIndex], 950);
  }

  /* ---------- CLUSTER LABELS ---------- */
  /* Labels are canvas items so the author can drag/rotate them in edit mode
     (and they persist + export); for visitors they stay click-through. */
  function injectClusterLabels(saved) {
    CLUSTER_LABELS.forEach(function (c) {
      if (document.getElementById(c.id)) return;
      var el = document.createElement('div');
      el.className = 'canvas-item cluster-label';
      el.id = c.id;
      el.textContent = c.text;
      var pos = (saved && saved[c.id]) ? saved[c.id] : c;
      el.style.left = pos.left + 'px';
      el.style.top = pos.top + 'px';
      el.style.setProperty('--canvas-rot', (pos.rot !== undefined ? pos.rot : c.rot) + 'deg');
      canvas.appendChild(el);
    });
  }

  /* ---------- HIDDEN NOTES: DISCOVERY REVEAL ---------- */
  function checkNoteReveals() {
    if (isEditMode || !viewport) return;
    var rect = viewport.getBoundingClientRect();
    var stagger = 0;
    document.querySelectorAll('.canvas-item.text-item:not(.is-revealed)').forEach(function (item) {
      var left = parseFloat(item.style.left) || 0;
      var top = parseFloat(item.style.top) || 0;
      var w = (item.offsetWidth || 200) * scale;
      var h = (item.offsetHeight || 40) * scale;
      var cx = left * scale + panX + w / 2;
      var cy = top * scale + panY + h / 2;
      if (cx > 30 && cx < rect.width - 30 && cy > 30 && cy < rect.height - 30) {
        item.style.transitionDelay = stagger + 'ms';
        item.classList.add('is-revealed');
        (function (el, wait) {
          setTimeout(function () { el.style.transitionDelay = ''; }, wait);
        })(item, stagger + 800);
        stagger += 140;
      }
    });
  }

  /* ---------- OPENING SHOT ---------- */
  function playIntro() {
    /* Frame the whole map for a beat, then fly into the hero so first-time
       visitors get a mental map of what's out there. */
    var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    document.querySelectorAll('.canvas-item, .cluster-label').forEach(function (item) {
      var left = parseFloat(item.style.left) || 0;
      var top = parseFloat(item.style.top) || 0;
      minX = Math.min(minX, left);
      minY = Math.min(minY, top);
      maxX = Math.max(maxX, left + (item.offsetWidth || 200));
      maxY = Math.max(maxY, top + (item.offsetHeight || 100));
    });
    var rect = viewport.getBoundingClientRect();
    if (REDUCE_MOTION || !isFinite(minX) || rect.width === 0) {
      focusOnHero();
      return;
    }
    var fit = Math.max(MIN_SCALE, Math.min(rect.width / (maxX - minX), rect.height / (maxY - minY)) * 0.92);
    scale = fit;
    panX = rect.width / 2 - ((minX + maxX) / 2) * fit;
    panY = rect.height / 2 - ((minY + maxY) / 2) * fit;
    applyCanvasTransform(false);
    setTimeout(function () {
      tourIndex = 0;
      flyTo(TOUR[0], 1300);
    }, 650);
  }

  /* ---------- EXPORT CURRENT LAYOUT ---------- */
  function exportLayout() {
    var saved;
    try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch (e) {}
    if (!saved || typeof saved !== 'object') {
      alert('No saved layout found. Drag some items first!');
      return;
    }
    var lines = ['  var DEFAULT_POSITIONS = {'];
    Object.keys(saved).sort().forEach(function (id) {
      if (id.indexOf('__') === 0) return;
      if (deletedItems.indexOf(id) !== -1) return;
      var p = saved[id];
      var parts = ['left:' + p.left, 'top:' + p.top, 'rot:' + (p.rot || 0)];
      if (p.width)  parts.push('width:'  + p.width);
      if (p.height) parts.push('height:' + p.height);
      if (p.text && typeof p.text === 'string' && p.text.trim()) {
        parts.push("text:'" + p.text.replace(/'/g, "\\'").replace(/\n/g, '\\n') + "'");
      }
      if (p.caption && typeof p.caption === 'string' && p.caption.trim()) {
        parts.push("caption:'" + p.caption.replace(/'/g, "\\'").replace(/\n/g, '\\n') + "'");
        if (p.captionAlign === 'center') parts.push("captionAlign:'center'");
      }
      lines.push("    '" + id + "': { " + parts.join(', ') + ' },');
    });
    lines.push('  };');

    if (deletedItems.length) {
      lines.push('');
      lines.push('  /* deleted items: ' + deletedItems.join(', ') + ' */');
    }

    var cam = saved.__camera || { panX: panX, panY: panY, scale: scale };
    lines.push('');
    lines.push('  /* camera at export time (for TOUR framing reference): panX ' + cam.panX + ', panY ' + cam.panY + ', scale ' + cam.scale + ' */');

    var code = lines.join('\n');
    try {
      navigator.clipboard.writeText(code).then(function () {
        alert('Layout + camera copied to clipboard! Paste it here or in the code.');
      }, function () {
        console.log(code);
        alert('Clipboard blocked. Layout is in the browser console (F12).');
      });
    } catch (e) {
      console.log(code);
      alert('Clipboard blocked. Layout is in the browser console (F12).');
    }
  }

  /* ---------- INIT ---------- */
  function isMobile() {
    return window.innerWidth <= 767;
  }

  function init() {
    viewport = document.getElementById('fun-canvas-viewport');
    canvas   = document.getElementById('fun-canvas');

    // Only activate when the fun-canvas DOM is present
    if (!viewport || !canvas) {
      document.body.classList.remove('fun-canvas-mode', 'fun-loaded');
      return;
    }

    document.body.classList.add('fun-canvas-mode');

    if (isMobile()) {
      /* Mobile shows the static fallback list. Its thumbnails are CSS
         background-images, so text paints instantly while each photo pops
         in separately underneath — hold the curtain until they've actually
         loaded (or a timeout elapses) so everything appears together in one
         clean fade instead of assembling piecemeal in front of the user. */
      var reveal = (function () {
        var done = false;
        return function () {
          if (done) return;
          done = true;
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              document.body.classList.add('fun-loaded');
            });
          });
        };
      })();

      var mobileRoot = document.getElementById('fun-mobile-content');
      var urls = mobileRoot
        ? Array.prototype.slice.call(mobileRoot.querySelectorAll('[style*="background-image"]'))
            .map(function (el) {
              var match = /url\(["']?(.*?)["']?\)/.exec(el.style.backgroundImage);
              return match && match[1];
            })
            .filter(Boolean)
        : [];

      if (!urls.length) {
        reveal();
        return;
      }

      var pending = urls.length;
      var onOneLoaded = function () {
        pending -= 1;
        if (pending <= 0) reveal();
      };
      urls.forEach(function (src) {
        var img = new Image();
        img.onload = onOneLoaded;
        img.onerror = onOneLoaded;
        img.src = src;
      });
      /* Safety net so a slow/broken image can't hold the page hostage. */
      setTimeout(reveal, 1800);
      return;
    }

    // Guard against double-init on the same DOM (script load + boot component)
    if (viewport.dataset.fcInit) return;
    viewport.dataset.fcInit = '1';

    /* Saved layout/camera only apply in author mode — visitors always start
       from the curated layout and the opening shot. */
    var saved = null;
    if (IS_AUTHOR) {
      saved = loadPositions();
      if (saved && saved.__version !== STORAGE_VERSION) {
        try {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(PAN_STORAGE_KEY);
        } catch (e) {}
        saved = null;
      }
    }
    deletedItems = (saved && Array.isArray(saved.__deleted)) ? saved.__deleted.slice() : [];
    /* Remove deleted static items (e.g. photos) from the fresh DOM */
    deletedItems.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.remove();
    });
    applyPositions(saved, false);
    if (saved) restoreNotes(saved);
    restoreNotes(DEFAULT_POSITIONS); // ensure default notes exist
    injectClusterLabels(saved);

    if (IS_AUTHOR) {
      var savedPan = false;
      try { savedPan = !!localStorage.getItem(PAN_STORAGE_KEY); } catch (e) {}
      if (savedPan) {
        loadPan();
        applyCanvasTransform(false);
      } else {
        focusOnHero();
      }
    } else {
      playIntro();
    }

    /* Curtain up — items are positioned and the camera is framed.
       Double rAF so the transform paints before the fade starts. */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        document.body.classList.add('fun-loaded');
      });
    });

    document.querySelectorAll('.canvas-item').forEach(function (item) {
      item.addEventListener('mousedown',  onItemPointerDown.bind(item));
      item.addEventListener('touchstart', onItemPointerDown.bind(item), { passive: true });
      /* Authors: double-click a photo to write its polaroid caption */
      if (item.classList.contains('photo-item')) {
        item.addEventListener('dblclick', function (e) {
          if (!isEditMode) return;
          e.stopPropagation();
          startCaptionEdit(item);
        });
      }
    });

    viewport.addEventListener('mousedown',  onViewportPointerDown);
    viewport.addEventListener('touchstart', onViewportPointerDown, { passive: true });
    viewport.addEventListener('wheel',      onWheel,                { passive: false });

    document.querySelectorAll('.resize-handle').forEach(function (handle) {
      handle.addEventListener('mousedown',  onResizePointerDown);
      handle.addEventListener('touchstart', onResizePointerDown, { passive: false });
    });

    // Inject rotation handles into all items
    document.querySelectorAll('.canvas-item').forEach(function (item) {
      if (!item.querySelector('.rot-handle')) {
        var rh = document.createElement('div');
        rh.className = 'rot-handle';
        rh.title = 'Drag to rotate';
        item.appendChild(rh);
      }
    });

    document.querySelectorAll('.rot-handle').forEach(function (handle) {
      handle.addEventListener('mousedown',  onRotPointerDown);
      handle.addEventListener('touchstart', onRotPointerDown, { passive: false });
    });

    // Visitors get read mode; authors (?edit=1) get edit mode
    setEditMode(IS_AUTHOR);

    var focusBtn = document.getElementById('fun-focus-btn');
    if (focusBtn) focusBtn.addEventListener('click', function () {
      focusOnHero();
    });

    var wanderBtn = document.getElementById('fun-wander-btn');
    if (wanderBtn) wanderBtn.addEventListener('click', function () {
      wander(1);
    });

    // Arrow keys also walk the tour
    if (!window.__funCanvasKeysBound) {
      window.__funCanvasKeysBound = true;
      document.addEventListener('keydown', function (e) {
        if (!document.getElementById('fun-canvas-viewport')) return;
        if (document.activeElement && document.activeElement.isContentEditable) return;
        if (e.key === 'ArrowRight') wander(1);
        else if (e.key === 'ArrowLeft') wander(-1);
        else if ((e.key === 'Delete' || e.key === 'Backspace') && isEditMode && selectedCard &&
                 (selectedCard.classList.contains('text-item') || selectedCard.classList.contains('photo-item'))) {
          e.preventDefault();
          deleteItem(selectedCard);
        }
      });
    }

    var exportBtn = document.getElementById('fun-export-btn');
    if (exportBtn) exportBtn.addEventListener('click', function () {
      if (isEditMode) exportLayout();
    });

    /* Restore everything the author deleted (positions are kept) */
    var restoreBtn = document.getElementById('fun-restore-btn');
    if (restoreBtn) restoreBtn.addEventListener('click', function () {
      if (!isEditMode) return;
      if (!deletedItems.length) {
        alert('Nothing to restore — no deleted items.');
        return;
      }
      var names = deletedItems.join(', ');
      deletedItems = [];
      savePositions();
      alert('Restored: ' + names);
      location.reload();
    });

    var zoomInBtn = document.getElementById('fun-zoom-in');
    var zoomOutBtn = document.getElementById('fun-zoom-out');
    if (zoomInBtn)  zoomInBtn.addEventListener('click',  function () { zoomByButton(0.2); });
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', function () { zoomByButton(-0.2); });

    var addNoteBtn = document.getElementById('fun-add-text-btn');
    if (addNoteBtn) addNoteBtn.addEventListener('click', function () {
      if (!isEditMode) return;
      var vw = viewport.clientWidth;
      var vh = viewport.clientHeight;
      var worldX = (vw / 2 - panX) / scale - 60;
      var worldY = (vh / 2 - panY) / scale - 20;
      addHandwrittenNote(worldX, worldY, '');
    });

    viewport.addEventListener('dblclick', function (e) {
      if (!isEditMode) return;
      if (e.target !== viewport && e.target !== canvas) return;
      var rect = viewport.getBoundingClientRect();
      var worldX = (e.clientX - rect.left - panX) / scale;
      var worldY = (e.clientY - rect.top  - panY) / scale;
      addHandwrittenNote(worldX, worldY, '');
    });

    /* Window-level listeners are bound once — they survive client-side
       navigation, so each checks that the canvas is actually on the page. */
    if (!window.__funCanvasGlobalsBound) {
      window.__funCanvasGlobalsBound = true;

      window.addEventListener('resize', updateFloatingMenu);

      /* Re-center on hero whenever the window resizes (desktop only) */
      var resizeTimer;
      window.addEventListener('resize', function () {
        if (isMobile()) return;
        if (!document.getElementById('fun-canvas-viewport')) return;
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          focusOnHero();
        }, 150);
      });

      /* Focus on hero when switching from mobile back to desktop */
      var wasMobile = isMobile();
      window.addEventListener('resize', function () {
        var nowMobile = isMobile();
        if (wasMobile && !nowMobile && document.getElementById('fun-canvas-viewport')) {
          // Transitioned from mobile → desktop: focus on hero
          focusOnHero();
        }
        wasMobile = nowMobile;
      });
    }
  }

  /* Boot hooks for the Next.js page: the script only executes once per hard
     load, so after client-side navigation the page re-inits via these. */
  window.__funCanvasInit = init;
  /* Authoring: arrange in ?edit=1, then run __funCanvasExport() in the console
     to copy the layout as code. */
  window.__funCanvasExport = exportLayout;
  window.__funCanvasCleanup = function () {
    document.body.classList.remove('fun-canvas-mode', 'read-mode', 'edit-mode', 'fun-loaded');
    deselectCard();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
