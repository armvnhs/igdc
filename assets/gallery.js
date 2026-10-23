(function () {
  'use strict';
  var hosts = document.querySelectorAll('[data-gallery]');
  if (!hosts.length) return;
  var ALBUMS_PER_PAGE = 12, PHOTOS_PER_PAGE = 24;
  var albums = [], selected = null, lastFocus = null, photoIndex = 0;
  var lb = document.getElementById('lb'), image = document.getElementById('lbimg'), closeButton = document.getElementById('lbx');
  var previous, next, position, caption;
  var paths = {
    folder: '<path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10H3z"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.5"/><path d="m3 16 5-5 4 4 4-5 5 6"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18m-13 4h2m4 0h2"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',
    right: '<path d="m9 6 6 6-6 6M15 12H4"/>',
    left: '<path d="m15 6-6 6 6 6M9 12h11"/>',
    zoom: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4m-13-9h7m-3.5-3.5v7"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>'
  };
  function icon(name) { return '<svg class="i" viewBox="0 0 24 24" aria-hidden="true">' + (paths[name] || paths.image) + '</svg>'; }
  function esc(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fa(value) { return String(value).replace(/\d/g, function (d) { return '۰۱۲۳۴۵۶۷۸۹'[d]; }); }
  function media(value) {
    if (typeof value !== 'string' || !value.trim() || value.includes('\\')) return '';
    try {
      var parsed = new URL(value.trim(), document.baseURI);
      if (parsed.username || parsed.password || !['https:', 'http:'].includes(parsed.protocol)) return '';
      if (parsed.origin !== location.origin && parsed.protocol !== 'https:') return '';
      return parsed.origin === location.origin ? parsed.pathname + parsed.search : parsed.href;
    } catch (error) { return ''; }
  }
  function slug(value) { return String(value || '').trim().toLowerCase().replace(/[^a-z0-9\u0600-\u06ff_-]+/g, '-').replace(/^-+|-+$/g, ''); }
  function normalize(data) {
    if (!data || !Array.isArray(data.albums)) throw new Error('Invalid gallery data');
    var ids = new Set();
    return data.albums.map(function (record, index) {
      if (!record || typeof record.title !== 'string' || !record.title.trim()) return null;
      var id = slug(record.id) || slug(record.title) || 'event-' + (index + 1), base = id, duplicate = 2;
      while (ids.has(id)) id = base + '-' + duplicate++;
      ids.add(id);
      var photos = [], seen = new Set();
      function addPhoto(value) {
        if (typeof value === 'string') value = { image: value };
        if (!value) return;
        var src = media(value.image);
        if (!src || seen.has(src)) return;
        seen.add(src);
        photos.push({ src: src, caption: String(value.caption || ''), alt: String(value.alt || record.title + ' — تصویر ' + fa(photos.length + 1)) });
      }
      addPhoto(record.cover);
      if (Array.isArray(record.photos)) record.photos.forEach(addPhoto);
      return { id: id, legacy: index + 1, title: record.title.trim(), date: String(record.date || ''), description: String(record.description || ''), photos: photos };
    }).filter(function (a) { return a && a.photos.length; });
  }
  function albumUrl(album) { return '/album.html?event=' + encodeURIComponent(album.id); }
  function meta(album) { return (album.date ? '<span>' + icon('calendar') + esc(album.date) + '</span>' : '') + '<span>' + icon('image') + fa(album.photos.length) + ' تصویر</span>'; }
  function cardHtml(album) {
    return '<a class="gx-album-link" href="' + esc(albumUrl(album)) + '"><div class="gx-cover"><span class="gx-cover-placeholder">' + icon('folder') + '</span><img loading="lazy" decoding="async" src="' + esc(album.photos[0].src) + '" alt=""><span class="gx-cover-badge">' + icon('image') + fa(album.photos.length) + '</span></div><div class="gx-card-body"><h2>' + esc(album.title) + '</h2><div class="gx-meta">' + meta(album) + '</div><p>' + esc(album.description) + '</p><span class="gx-card-action">مشاهدهٔ آلبوم ' + icon('left') + '</span></div></a>';
  }
  function readPage(params, count, size) {
    var raw = Number(params.get('page')), total = Math.max(1, Math.ceil(count / size));
    return { page: Number.isSafeInteger(raw) && raw > 0 ? Math.min(raw, total) : 1, total: total };
  }
  function fold(value) { return String(value).normalize('NFKC').replace(/ي/g, 'ی').replace(/ك/g, 'ک').replace(/[\u064b-\u065f\u200c]/g, '').toLowerCase(); }
  function pageUrl(page) { var url = new URL(location.href); url.hash = ''; if (page > 1) url.searchParams.set('page', page); else url.searchParams.delete('page'); return url.pathname + url.search; }
  function pagination(state) {
    if (state.total < 2) return '';
    function link(page, label, symbol) { return '<a class="gx-page-link" data-gx-page href="' + esc(pageUrl(page)) + '" aria-label="' + label + '">' + icon(symbol) + '<span>' + label + '</span></a>'; }
    var numbers = [], html = '', last = 0;
    for (var i = 1; i <= state.total; i++) if (i === 1 || i === state.total || Math.abs(i - state.page) <= 1) numbers.push(i);
    numbers.forEach(function (i) {
      if (i - last > 1) html += '<span class="gx-page-gap" aria-hidden="true">…</span>';
      html += '<a class="gx-page-number" data-gx-page href="' + esc(pageUrl(i)) + '" aria-label="صفحهٔ ' + fa(i) + '"' + (i === state.page ? ' aria-current="page"' : '') + '>' + fa(i) + '</a>'; last = i;
    });
    return '<nav class="gx-pagination" aria-label="صفحه‌بندی گالری">' + (state.page > 1 ? link(state.page - 1, 'قبلی', 'right') : '<span></span>') + '<div class="gx-page-numbers">' + html + '</div>' + (state.page < state.total ? link(state.page + 1, 'بعدی', 'left') : '<span></span>') + '</nav>';
  }
  function empty(title, description) { return '<div class="gx-empty">' + icon('folder') + '<h2>' + esc(title) + '</h2><p>' + esc(description) + '</p></div>'; }
  function archiveHtml(params) {
    var query = (params.get('q') || '').trim().slice(0, 160), term = fold(query);
    var matches = albums.filter(function (album) { return !term || fold(album.title + ' ' + album.date + ' ' + album.description).includes(term); });
    var state = readPage(params, matches.length, ALBUMS_PER_PAGE), start = (state.page - 1) * ALBUMS_PER_PAGE;
    var toolbar = '<form class="gx-search" role="search"><label class="sr-only" for="gx-query">جست‌وجوی رویدادها</label><span class="gx-search-icon">' + icon('search') + '</span><input id="gx-query" name="q" type="search" value="' + esc(query) + '" maxlength="160" placeholder="نام رویداد یا تاریخ را جست‌وجو کنید"><button type="submit">جست‌وجو</button></form>';
    return '<div class="gx-toolbar">' + toolbar + '<p class="gx-results" role="status">' + icon('folder') + fa(matches.length) + ' آلبوم' + (matches.length ? ' · صفحهٔ ' + fa(state.page) + ' از ' + fa(state.total) : '') + '</p></div>' + (matches.length ? '<div class="gx-album-grid">' + matches.slice(start, start + ALBUMS_PER_PAGE).map(cardHtml).join('') + '</div>' : empty('آلبومی پیدا نشد', query ? 'عبارت دیگری را جست‌وجو کنید.' : 'تصاویر رویدادهای تازه به‌زودی اینجا قرار می‌گیرند.')) + pagination(state);
  }
  function albumHtml(params) {
    var id = params.get('event');
    selected = albums.find(function (album) { return album.id === id; });
    var back = '<a class="gx-back" href="/gallery">' + icon('right') + 'همهٔ آلبوم‌ها</a>';
    if (!selected) { document.title = 'آلبوم پیدا نشد | IGDC'; return back + empty('آلبوم پیدا نشد', 'برای انتخاب رویداد به فهرست آلبوم‌ها برگردید.'); }
    document.title = selected.title + ' | گالری IGDC';
    var canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = 'https://igdc.ir' + albumUrl(selected);
    var state = readPage(params, selected.photos.length, PHOTOS_PER_PAGE), start = (state.page - 1) * PHOTOS_PER_PAGE;
    var photos = selected.photos.slice(start, start + PHOTOS_PER_PAGE).map(function (photo, offset) {
      var number = start + offset;
      return '<figure class="gx-photo"><button class="gx-photo-button" data-gx-photo="' + number + '" type="button" aria-label="نمایش بزرگ‌تر: ' + esc(photo.alt) + '"><span class="gx-photo-placeholder">' + icon('image') + '</span><img loading="lazy" decoding="async" src="' + esc(photo.src) + '" alt="' + esc(photo.alt) + '"><span class="gx-zoom">' + icon('zoom') + '</span></button>' + (photo.caption ? '<figcaption>' + esc(photo.caption) + '</figcaption>' : '') + '</figure>';
    }).join('');
    return back + '<header class="gx-album-heading"><span class="eyebrow">' + icon('folder') + 'آلبوم رویداد</span><h1>' + esc(selected.title) + '</h1>' + (selected.description ? '<p>' + esc(selected.description) + '</p>' : '') + '<div class="gx-meta">' + meta(selected) + '</div></header><div class="gx-photo-summary" role="status">تصاویر ' + fa(start + 1) + ' تا ' + fa(Math.min(start + PHOTOS_PER_PAGE, selected.photos.length)) + ' از ' + fa(selected.photos.length) + '</div><div class="gx-photo-grid">' + photos + '</div>' + pagination(state);
  }
  function render() {
    var params = new URLSearchParams(location.search);
    hosts.forEach(function (host) {
      var mode = host.getAttribute('data-gallery');
      host.innerHTML = mode === 'preview' ? (albums.length ? albums.slice(0, 3).map(cardHtml).join('') : empty('خاطره‌های بعدی، به‌زودی', 'تصاویر رویدادهای باشگاه اینجا منتشر می‌شوند.')) : mode === 'album' ? albumHtml(params) : archiveHtml(params);
      host.removeAttribute('aria-busy');
    });
    document.dispatchEvent(new Event('igdc:content'));
  }
  function navigate(value) { close(); history.pushState(null, '', value); render(); var host = document.querySelector('[data-gallery]:not([data-gallery="preview"])'); if (host) { host.scrollIntoView({ block: 'start' }); host.focus({ preventScroll: true }); } }
  function show() {
    var photo = selected.photos[photoIndex];
    image.src = photo.src; image.alt = photo.alt;
    position.textContent = fa(photoIndex + 1) + ' از ' + fa(selected.photos.length);
    caption.textContent = photo.caption;
    previous.disabled = photoIndex === 0; next.disabled = photoIndex === selected.photos.length - 1;
  }
  function open(index) {
    if (!selected || !selected.photos[index] || !lb) return;
    lastFocus = document.activeElement; photoIndex = index; show(); lb.hidden = false; document.body.style.overflow = 'hidden'; closeButton.focus();
  }
  function close() {
    if (!lb || lb.hidden) return;
    lb.hidden = true; image.removeAttribute('src'); document.body.style.overflow = '';
    if (lastFocus && lastFocus.isConnected) lastFocus.focus();
  }
  function step(direction) { if (!selected) return; var index = photoIndex + direction; if (index >= 0 && index < selected.photos.length) { photoIndex = index; show(); } }
  function setupLightbox() {
    if (!lb || !image || !closeButton) return;
    lb.classList.add('gx-lightbox'); lb.setAttribute('aria-label', 'نمایش تصاویر آلبوم');
    closeButton.innerHTML = icon('close');
    previous = document.createElement('button'); previous.className = 'gx-nav gx-prev'; previous.type = 'button'; previous.setAttribute('aria-label', 'تصویر قبلی'); previous.innerHTML = icon('right');
    next = document.createElement('button'); next.className = 'gx-nav gx-next'; next.type = 'button'; next.setAttribute('aria-label', 'تصویر بعدی'); next.innerHTML = icon('left');
    position = document.createElement('p'); position.className = 'gx-position'; position.setAttribute('role', 'status');
    caption = document.createElement('p'); caption.className = 'gx-caption';
    lb.append(previous, next, position, caption);
    previous.addEventListener('click', function () { step(-1); }); next.addEventListener('click', function () { step(1); }); closeButton.addEventListener('click', close);
    lb.addEventListener('click', function (event) { if (event.target === lb) close(); });
    document.addEventListener('keydown', function (event) {
      if (lb.hidden) return;
      if (event.key === 'Escape') { event.preventDefault(); close(); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); step(1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); step(-1); }
      if (event.key === 'Tab') {
        var controls = [closeButton, previous, next].filter(function (button) { return !button.disabled; });
        var current = controls.indexOf(document.activeElement), nextIndex = (current + (event.shiftKey ? -1 : 1) + controls.length) % controls.length;
        event.preventDefault(); controls[nextIndex].focus();
      }
    });
    var x = null;
    lb.addEventListener('touchstart', function (event) { if (event.touches.length === 1) x = event.touches[0].clientX; else x = null; }, { passive: true });
    lb.addEventListener('touchend', function (event) { if (x === null) return; var delta = event.changedTouches[0].clientX - x; x = null; if (Math.abs(delta) > 50) step(delta < 0 ? 1 : -1); }, { passive: true });
  }
  hosts.forEach(function (host) {
    host.setAttribute('aria-busy', 'true');
    host.addEventListener('click', function (event) {
      var photo = event.target.closest('[data-gx-photo]');
      if (photo) { event.preventDefault(); open(Number(photo.getAttribute('data-gx-photo'))); return; }
      var page = event.target.closest('[data-gx-page]');
      if (page && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && event.button === 0) { event.preventDefault(); navigate(page.href); }
      if (event.target.closest('[data-gx-retry]')) load();
    });
    host.addEventListener('submit', function (event) {
      if (!event.target.matches('.gx-search')) return;
      event.preventDefault(); var target = new URL(location.href), query = new FormData(event.target).get('q').trim();
      if (query) target.searchParams.set('q', query); else target.searchParams.delete('q'); target.searchParams.delete('page');
      navigate(target.pathname + target.search);
    });
    host.addEventListener('error', function (event) { if (event.target.tagName === 'IMG') event.target.hidden = true; }, true);
  });
  window.addEventListener('popstate', function () { close(); if (albums.length) render(); });
  function load() {
    hosts.forEach(function (host) { host.setAttribute('aria-busy', 'true'); });
    fetch('/content/gallery.json', { cache: 'no-store' }).then(function (response) { if (!response.ok) throw new Error('Gallery unavailable'); return response.json(); }).then(function (data) {
      albums = normalize(data);
      var legacy = /^#album-(\d+)$/.exec(location.hash);
      if (legacy) { var old = albums.find(function (a) { return a.legacy === Number(legacy[1]); }); if (old) { location.replace(albumUrl(old)); return; } }
      render();
    }).catch(function () {
      hosts.forEach(function (host) { host.removeAttribute('aria-busy'); host.innerHTML = empty('گالری دریافت نشد', 'اتصال اینترنت را بررسی کنید و دوباره تلاش کنید.') + '<button class="btn gx-retry" type="button" data-gx-retry>تلاش دوباره</button>'; });
    });
  }
  setupLightbox(); load();
})();
