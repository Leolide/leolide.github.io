(function () {
  'use strict';

  var STORAGE_VERSION = 'v4';
  var STORAGE_KEY = 'fun-canvas-' + STORAGE_VERSION;
  var PAN_STORAGE_KEY = 'fun-canvas-pan-' + STORAGE_VERSION;
  var DRAG_THRESHOLD = 5;
  var isEditMode = false;
  var MIN_SCALE = 0.25;
  var MAX_SCALE = 3.5;

  var DEFAULT_CAMERA = { panX: -770, panY: -676.8090662915642, scale: 1.180853428463634 };

  var DEFAULT_POSITIONS = {
    'canvas-card-0':  { left: 1692.13, top: 971.123, rot: -2.2 },
    'canvas-card-1':  { left: 1644.37, top: 361.18,  rot: 1.8  },
    'canvas-card-2':  { left: 2358.22, top: 226.97,  rot: -1.1 },
    'canvas-card-3':  { left: 1282.81, top: 1104.3,  rot: -0.76212121083267 },
    'canvas-card-4':  { left: 1415.69, top: 1424.46, rot: -0.7 },
    'canvas-card-5':  { left: 1058.16, top: 1363.67, rot: 1.5  },
    'canvas-card-6':  { left: 925.168, top: 323.198, rot: -2.0 },
    'canvas-card-7':  { left: 264.716, top: 181.107, rot: 0.9  },
    'canvas-card-8':  { left: 2162.44, top: 793.421, rot: -1.4 },
    'canvas-hero':    { left: 1145.62, top: 692.251, rot: -0.5 },
    'canvas-note-1':  { left: 159.736, top: 588.97,  rot: 0, text: "I like exploring and researching cities!" },
    'canvas-note-2':  { left: 1974.42, top: 590.896, rot: 0, text: "I have built architecture in the world!" },
    'canvas-note-3':  { left: 1269.46, top: 956.105, rot: 0.13506228490013983, text: "Drag items & pan the canvas to explore" },
    'canvas-note-4':  { left: 2641.71, top: 851.24,  rot: 0, text: "Fun fact: Hablo un poco Español!" },
    'canvas-note-5':  { left: 1751.51, top: 1422.22, rot: -5.2573647884465675, text: "I happened to start a designer community in London" },
    'canvas-note-6':  { left: 2105.35, top: 1174.5,  rot: 0, text: "Cooking is meditating for me" },
    'canvas-note-7':  { left: 657.367, top: 1422.04, rot: 0, text: "I love being outdoor" },
    'canvas-note-8':  { left: 1023.79, top: 1758.68, rot: 0, text: "I still have a manga dream" },
    'canvas-note-9':  { left: 1299.7,  top: 1060.59, rot: 0, text: "I do stickers... WHAT" },
    'canvas-photo-0': { left: 281.945, top: 860.93,  rot: -1.8, width: 280, height: 360 },
    'canvas-photo-1': { left: 1964.94, top: 268.547, rot: 2.2,  width: 240, height: 300 },
    'canvas-photo-2': { left: 521.975, top: 1109.8,  rot: -0.6, width: 340, height: 260 },
    'canvas-photo-3': { left: 854.719, top: 641.915, rot: 1.4,  width: 260, height: 330 },
    'canvas-photo-4': { left: 2545.39, top: 477.694, rot: -2.0, width: 374, height: 348 },
    'canvas-photo-5': { left: 790.251, top: 1059.48, rot: 2.5,  width: 260, height: 340 },
    'canvas-photo-6': { left: 286.573, top: 1266.08, rot: -1.5, width: 340, height: 260 },
    'canvas-photo-7': { left: 2386.52, top: 1028.48, rot: 1.0,  width: 260, height: 320 },
    'canvas-photo-8': { left: 558.82,  top: 404.064, rot: -3.0, width: 280, height: 360 }
  };

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
    document.querySelectorAll('.canvas-item.text-item').forEach(function (item) {
      var id = item.id;
      if (pos[id]) {
        var textEl = item.querySelector('.note-text');
        if (textEl) pos[id].text = textEl.innerText || '';
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
        item.style.transition = 'none';
      }

      if (pos) {
        item.style.left = pos.left + 'px';
        item.style.top  = pos.top  + 'px';
        if (pos.width)  item.style.width  = pos.width  + 'px';
        if (pos.height) item.style.height = pos.height + 'px';
      }
      item.style.setProperty('--canvas-rot', rot + 'deg');
      item.style.zIndex = '10';
    });
  }

  function bringToFront(item) {
    document.querySelectorAll('.canvas-item').forEach(function (el) {
      el.style.zIndex = '10';
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
      if (selectedCard && selectedCard.classList.contains('text-item')) {
        var noteText = selectedCard.querySelector('.note-text');
        if (noteText) {
          setEditMode(true);
          noteText.focus();
          var range = document.createRange();
          range.selectNodeContents(noteText);
          range.collapse(false);
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
    });

    floatingMenu.querySelector('.fab-close').addEventListener('click', function (e) {
      e.stopPropagation();
      deselectCard();
    });

    floatingMenu.addEventListener('mousedown', function (e) { e.stopPropagation(); });
    floatingMenu.addEventListener('touchstart', function (e) { e.stopPropagation(); }, { passive: true });
  }

  function showFloatingMenu() {
    if (!floatingMenu) createFloatingMenu();
    var editBtn = floatingMenu.querySelector('.fab-edit');
    if (editBtn) {
      var showEdit = selectedCard && selectedCard.classList.contains('text-item');
      editBtn.style.display = showEdit ? '' : 'none';
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

    var modeBtn = document.getElementById('fun-mode-btn');
    var modeLabel = document.getElementById('fun-mode-label');
    if (modeLabel) modeLabel.textContent = edit ? 'Edit' : 'Read';
    else if (modeBtn) modeBtn.textContent = edit ? 'Edit' : 'Read';

    var editBtns = ['fun-export-btn', 'fun-add-text-btn'];
    editBtns.forEach(function (id) {
      var btn = document.getElementById(id);
      if (btn) btn.style.display = edit ? '' : 'none';
    });

    if (!edit) deselectCard();
  }

  function toggleMode() {
    setEditMode(!isEditMode);
  }

  /* ---------- ITEM DRAG ---------- */
  function onItemPointerDown(e) {
    var isTextItem = this.classList.contains('text-item');
    if (!isEditMode && !isTextItem) return;
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
    } else if (!dragStartedOnAnchor && item.classList.contains('card-item')) {
      selectCard(item);
    } else if (!dragStartedOnAnchor && item.classList.contains('text-item')) {
      selectCard(item);
    } else if (!dragStartedOnAnchor) {
      var href = item.getAttribute('data-href');
      if (href) window.open(href, '_blank');
    }

    dragMoved = false;
    dragStartedOnAnchor = false;
  }

  /* ---------- HANDWRITTEN TEXT NOTES ---------- */
  var noteCounter = 0;
  function addHandwrittenNote(worldX, worldY, text) {
    var id = 'canvas-note-' + (++noteCounter);
    var item = document.createElement('div');
    item.className = 'canvas-item text-item';
    item.id = id;
    item.style.left = (worldX || 0) + 'px';
    item.style.top  = (worldY || 0) + 'px';
    item.style.setProperty('--canvas-rot', '0deg');
    item.innerHTML = '<div class="note-text" contenteditable="true">' + (text || '') + '</div>';
    canvas.appendChild(item);

    item.addEventListener('mousedown', onItemPointerDown.bind(item));
    item.addEventListener('touchstart', onItemPointerDown.bind(item), { passive: true });

    var noteText = item.querySelector('.note-text');
    noteText.addEventListener('mousedown', function (e) {
      e.stopPropagation();
    });
    noteText.addEventListener('touchstart', function (e) {
      e.stopPropagation();
    }, { passive: true });

    noteText.addEventListener('focus', function () {
      item.classList.add('is-editing');
      deselectCard();
    });
    noteText.addEventListener('blur', function () {
      item.classList.remove('is-editing');
      savePositions();
    });
    noteText.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        noteText.blur();
      }
    });

    if (!text) {
      setTimeout(function () {
        noteText.focus();
        item.classList.add('is-editing');
      }, 50);
    }

    var rh = document.createElement('div');
    rh.className = 'rot-handle';
    rh.title = 'Drag to rotate';
    item.appendChild(rh);
    rh.addEventListener('mousedown',  onRotPointerDown);
    rh.addEventListener('touchstart', onRotPointerDown, { passive: false });

    savePositions();
    return item;
  }

  /* ---------- RESTORE SAVED NOTES ---------- */
  function restoreNotes(saved) {
    Object.keys(saved).forEach(function (id) {
      if (!id.startsWith('canvas-note-')) return;
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
  }

  /* ---------- ZOOM BUTTONS ---------- */
  function zoomByButton(delta) {
    var rect = viewport.getBoundingClientRect();
    var cx = rect.width / 2;
    var cy = rect.height / 2;
    zoomToPoint(delta, cx + rect.left, cy + rect.top);
  }

  /* ---------- RESET ---------- */
  function resetLayout() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(PAN_STORAGE_KEY);
    } catch (e) {}
    deselectCard();
    scale = DEFAULT_CAMERA.scale;
    panX = DEFAULT_CAMERA.panX;
    panY = DEFAULT_CAMERA.panY;
    applyCanvasTransform(true);
    applyPositions(null, true);
  }

  /* ---------- FOCUS ON HERO ---------- */
  function focusOnHero() {
    var hero = document.getElementById('canvas-hero');
    if (!hero) return;
    deselectCard();
    var heroPos = DEFAULT_POSITIONS['canvas-hero'] || { left: 1145.62, top: 692.251 };
    var heroW = 480;
    var heroH = 160;
    var rect = viewport.getBoundingClientRect();
    var targetScale = 1.0;
    panX = (rect.width / 2) - (heroPos.left + heroW / 2) * targetScale;
    panY = (rect.height / 2) - (heroPos.top + heroH / 2) * targetScale - 150;
    scale = targetScale;
    applyCanvasTransform(true);
    savePan();
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
      if (id === '__camera') return;
      var p = saved[id];
      var parts = ['left:' + p.left, 'top:' + p.top, 'rot:' + (p.rot || 0)];
      if (p.width)  parts.push('width:'  + p.width);
      if (p.height) parts.push('height:' + p.height);
      if (p.text && typeof p.text === 'string' && p.text.trim()) {
        parts.push("text:'" + p.text.replace(/'/g, "\\'") + "'");
      }
      lines.push("    '" + id + "': { " + parts.join(', ') + ' },');
    });
    lines.push('  };');

    var cam = saved.__camera || { panX: panX, panY: panY, scale: scale };
    lines.push('');
    lines.push('  var DEFAULT_CAMERA = { panX: ' + cam.panX + ', panY: ' + cam.panY + ', scale: ' + cam.scale + ' };');

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
    document.body.classList.add('fun-canvas-mode');

    if (isMobile()) return;

    viewport = document.getElementById('fun-canvas-viewport');
    canvas   = document.getElementById('fun-canvas');
    if (!viewport || !canvas) return;

    var saved = loadPositions();
    if (saved && saved.__version !== STORAGE_VERSION) {
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(PAN_STORAGE_KEY);
      } catch (e) {}
      saved = null;
    }
    applyPositions(saved, false);
    if (saved) restoreNotes(saved);
    restoreNotes(DEFAULT_POSITIONS); // ensure default notes exist
    var savedPan = false;
    try { savedPan = !!localStorage.getItem(PAN_STORAGE_KEY); } catch (e) {}
    if (savedPan) {
      var pd = loadPan();
      if (pd && pd.__version !== STORAGE_VERSION) savedPan = false;
    }
    if (savedPan) {
      loadPan();
    } else {
      panX = DEFAULT_CAMERA.panX;
      panY = DEFAULT_CAMERA.panY;
      scale = DEFAULT_CAMERA.scale;
    }
    applyCanvasTransform(false);

    document.querySelectorAll('.canvas-item').forEach(function (item) {
      item.addEventListener('mousedown',  onItemPointerDown.bind(item));
      item.addEventListener('touchstart', onItemPointerDown.bind(item), { passive: true });
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

    // Default to read mode on load
    setEditMode(false);

    var resetBtn = document.getElementById('fun-reset-btn');
    if (resetBtn) resetBtn.addEventListener('click', function () {
      resetLayout();
    });

    var focusBtn = document.getElementById('fun-focus-btn');
    if (focusBtn) focusBtn.addEventListener('click', function () {
      focusOnHero();
    });

    var exportBtn = document.getElementById('fun-export-btn');
    if (exportBtn) exportBtn.addEventListener('click', function () {
      if (isEditMode) exportLayout();
    });

    var zoomInBtn = document.getElementById('fun-zoom-in');
    var zoomOutBtn = document.getElementById('fun-zoom-out');
    if (zoomInBtn)  zoomInBtn.addEventListener('click',  function () { zoomByButton(0.2); });
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', function () { zoomByButton(-0.2); });

    var modeBtn = document.getElementById('fun-mode-btn');
    if (modeBtn) modeBtn.addEventListener('click', toggleMode);

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

    // In read mode, click/tap selects the item and shows the floating menu
    document.querySelectorAll('.canvas-item').forEach(function (item) {
      item.addEventListener('click', function (e) {
        if (isEditMode) return;
        // Skip if tapping on an inner <a> link
        if (e.target.closest('a[href]')) return;
        // Select and show the floating menu
        selectCard(item);
      });
    });

    window.addEventListener('resize', updateFloatingMenu);

    /* Reset to defaults when switching from mobile back to desktop */
    var wasMobile = isMobile();
    window.addEventListener('resize', function () {
      var nowMobile = isMobile();
      if (wasMobile && !nowMobile) {
        // Transitioned from mobile → desktop: reset canvas
        resetLayout();
      }
      wasMobile = nowMobile;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
