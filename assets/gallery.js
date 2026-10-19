(function () {
  var hosts = document.querySelectorAll('[data-gallery]');
  if (!hosts.length) return;

  var css = [
    '.gx-open{display:block;width:100%;height:100%;padding:0;margin:0;border:0;background:none;cursor:zoom-in;font:inherit}',
    'figure.tile{margin:0}.album-card{scroll-margin-top:96px}',
    '.gx-open:focus-visible,.gx-nav:focus-visible,.gx-jump a:focus-visible,.gx-card:focus-visible{outline:3px solid var(--accent);outline-offset:-3px}',
    '.gx-jump{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 6px}',
    '.gx-jump a{padding:8px 16px;border:1px solid var(--line);border-radius:99px;font-size:13px;color:var(--ink);background:#fff;transition:border-color .25s,color .25s}',
    '.gx-jump a:hover{border-color:var(--accent);color:var(--accent-ink)}',
    '.album-card .album-photos{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;align-items:stretch;overflow:visible;padding:0}',
    '.album-card .album-photos .tile{aspect-ratio:1/1;margin:0;flex:none;width:auto;min-height:0;background:#f1f1f4;border-radius:18px}',
    '.album-card .album-photos .tile.gx-lead{grid-column:span 2;grid-row:span 2;aspect-ratio:auto;height:100%}',
    '.album-card .album-photos .shot{display:block;width:100%;height:100%;object-fit:cover}',
    '.album-card .album-photos .tile:hover .shot{transform:scale(1.04)}',
    '@media(max-width:900px){.album-card .album-photos{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.album-card .album-photos .tile.gx-lead{grid-column:span 2;grid-row:auto;aspect-ratio:16/10;height:auto}.album-card .album-photos .tile{border-radius:14px}}',
    '.gx-card{display:block;position:relative;color:#fff;text-decoration:none}',
    '.gx-mos{position:absolute;inset:0;display:grid;grid-template-columns:2fr 1fr;grid-template-rows:1fr 1fr;gap:3px;background:#fff}',
    '.gx-mos.one{grid-template-columns:1fr;grid-template-rows:1fr}',
    '.gx-mos img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s cubic-bezier(.2,.9,.3,1)}',
    '.gx-mos img:first-child{grid-row:1/3}.gx-mos.one img:first-child{grid-row:auto}',
    '.gx-card:hover .gx-mos img{transform:scale(1.04)}',
    '.gx-card .cap{z-index:2;pointer-events:none}',
    '.gx-card .cap b{font-size:15px}.gx-card .cap span{font-size:12px}',
    '#gallery .gal{grid-template-columns:repeat(auto-fill,minmax(300px,1fr))}',
    '@media(max-width:560px){#gallery .gal{display:flex}#gallery .gal .tile{flex:0 0 82%}}',
    '.lb .gx-nav{position:absolute;top:50%;translate:0 -50%;width:46px;height:46px;border:0;border-radius:50%;background:#ffffff25;color:#fff;font-size:26px;line-height:1;cursor:pointer;transition:background .2s}',
    '.lb .gx-nav:hover{background:#ffffff45}.lb .gx-prev{right:16px}.lb .gx-next{left:16px}',
    '.lb .gx-pos{position:absolute;bottom:18px;left:50%;translate:-50% 0;color:#fff9;font-size:13px}',
    '.lb[data-single] .gx-nav,.lb[data-single] .gx-pos{display:none}'
  ].join('');
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  var lb = document.getElementById('lb');
  var lbi = document.getElementById('lbimg');
  var lbx = document.getElementById('lbx');
  var albums = [];
  var set = [];
  var idx = 0;
  var lastFocus = null;
  var pos = null;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function fa(n) {
    return String(n).replace(/\d/g, function (d) { return '۰۱۲۳۴۵۶۷۸۹'.charAt(d); });
  }
  function url(s) {
    s = String(s || '').trim();
    if (!s) return '';
    return /^(https?:)?\/\//.test(s) || s.charAt(0) === '/' ? s : '/' + s;
  }

  function normalize(data) {
    var list = (data && data.albums) || [];
    return list.map(function (a, i) {
      var title = String(a.title || '').trim() || 'رویداد ' + fa(i + 1);
      var photos = (a.photos || []).map(function (p) {
        if (typeof p === 'string') p = { image: p };
        if (!p || !p.image) return null;
        return { src: url(p.image), caption: p.caption || '', alt: p.alt && p.alt !== 'تصویری از باشگاه' ? p.alt : '' };
      }).filter(Boolean);
      var cover = url(a.cover);
      if (cover && !photos.some(function (p) { return p.src === cover; })) {
        photos.unshift({ src: cover, caption: '', alt: '' });
      }
      if (cover) {
        var k = photos.findIndex(function (p) { return p.src === cover; });
        if (k > 0) photos.unshift(photos.splice(k, 1)[0]);
      }
      photos.forEach(function (p, j) { if (!p.alt) p.alt = title + ' — تصویر ' + fa(j + 1); });
      return { n: i + 1, title: title, date: a.date || '', description: a.description || '', photos: photos };
    }).filter(function (a) { return a.photos.length; });
  }

  function albumHtml(a) {
    var lead = a.photos.length >= 5;
    var tiles = a.photos.map(function (p, j) {
      return '<figure class="tile' + (lead && j === 0 ? ' gx-lead' : '') + '"><button class="gx-open" type="button" data-a="' + (a.n - 1) + '" data-p="' + j +
        '" aria-label="نمایش بزرگ‌تر: ' + esc(p.alt) + '"><img class="shot" loading="lazy" decoding="async" src="' + esc(p.src) +
        '" alt="' + esc(p.alt) + '"></button>' +
        (p.caption ? '<figcaption class="cap"><b>' + esc(p.caption) + '</b></figcaption>' : '') + '</figure>';
    }).join('');
    return '<section class="album-card" id="album-' + a.n + '" aria-labelledby="album-t-' + a.n + '"><div class="album-head"><div><h2 id="album-t-' + a.n + '">' +
      esc(a.title) + '</h2>' + (a.description ? '<p>' + esc(a.description) + '</p>' : '') +
      '<span class="album-date">' + (a.date ? esc(a.date) + ' · ' : '') + fa(a.photos.length) + ' تصویر</span></div></div><div class="album-photos">' + tiles + '</div></section>';
  }

  function fullHtml(list) {
    var jump = list.length > 1 ? '<nav class="gx-jump" aria-label="رویدادها">' + list.map(function (a) {
      return '<a href="#album-' + a.n + '">' + esc(a.title) + '</a>';
    }).join('') + '</nav>' : '';
    return jump + list.map(albumHtml).join('');
  }

  function cardHtml(a) {
    var pics = a.photos.slice(0, a.photos.length >= 3 ? 3 : 1);
    var mos = '<span class="gx-mos' + (pics.length === 1 ? ' one' : '') + '">' + pics.map(function (p) {
      return '<img loading="lazy" decoding="async" src="' + esc(p.src) + '" alt="">';
    }).join('') + '</span>';
    return '<a class="tile gx-card" href="/gallery#album-' + a.n + '" aria-label="' + esc(a.title) + ' — ' + fa(a.photos.length) + ' تصویر">' + mos +
      '<span class="cap"><b>' + esc(a.title) + '</b><span>' + fa(a.photos.length) + ' تصویر</span></span></a>';
  }

  function previewHtml(list) {
    return list.slice(0, 6).map(cardHtml).join('');
  }

  var renders = 0;
  var busy = false;

  function render() {
    busy = true;
    hosts.forEach(function (h) {
      var mode = h.getAttribute('data-gallery');
      h.innerHTML = mode === 'preview' ? previewHtml(albums) : fullHtml(albums);
      if (h.firstElementChild) h.firstElementChild.setAttribute('data-gx', '');
    });
    renders++;
    setTimeout(function () { busy = false; }, 0);
    document.dispatchEvent(new Event('igdc:content'));
    var id = location.hash.slice(1);
    if (id) {
      var el = document.getElementById(id);
      if (el) el.scrollIntoView();
    }
  }

  function guard() {
    if (typeof MutationObserver === 'undefined') return;
    hosts.forEach(function (h) {
      new MutationObserver(function () {
        if (busy || renders > 4) return;
        if (!h.firstElementChild || !h.firstElementChild.hasAttribute('data-gx')) render();
      }).observe(h, { childList: true });
    });
  }

  function show() {
    var p = set[idx];
    lbi.src = p.src;
    lbi.alt = p.alt;
    if (pos) pos.textContent = fa(idx + 1) + ' / ' + fa(set.length);
  }
  function open(ai, pi) {
    set = albums[ai].photos;
    idx = pi;
    lastFocus = document.activeElement;
    if (set.length < 2) lb.setAttribute('data-single', ''); else lb.removeAttribute('data-single');
    show();
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    lbx.focus();
  }
  function close() {
    lb.hidden = true;
    lbi.removeAttribute('src');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function step(d) {
    if (set.length < 2) return;
    idx = (idx + d + set.length) % set.length;
    show();
  }

  function setupLightbox() {
    if (!lb || !lbi || !lbx) return;
    var prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'gx-nav gx-prev';
    prev.setAttribute('aria-label', 'تصویر قبلی');
    prev.textContent = '›';
    var next = document.createElement('button');
    next.type = 'button';
    next.className = 'gx-nav gx-next';
    next.setAttribute('aria-label', 'تصویر بعدی');
    next.textContent = '‹';
    pos = document.createElement('span');
    pos.className = 'gx-pos';
    lb.appendChild(prev);
    lb.appendChild(next);
    lb.appendChild(pos);
    prev.addEventListener('click', function (e) { e.stopPropagation(); step(-1); });
    next.addEventListener('click', function (e) { e.stopPropagation(); step(1); });
    lbx.addEventListener('click', close);
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') step(1);
      else if (e.key === 'ArrowRight') step(-1);
    });
    var x0 = null;
    lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    });
  }

  function bindHosts() {
    hosts.forEach(function (h) {
      h.addEventListener('click', function (e) {
        var b = e.target.closest('.gx-open');
        if (b) {
          e.stopPropagation();
          var a = +b.getAttribute('data-a');
          if (lb && albums[a]) open(a, +b.getAttribute('data-p'));
          return;
        }
        if (e.target.closest('.gx-card')) e.stopPropagation();
      });
      h.addEventListener('keydown', function (e) {
        if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.gx-open,.gx-card')) e.stopPropagation();
      });
    });
  }

  setupLightbox();
  bindHosts();

  fetch('/content/gallery.json', { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (data) {
      albums = normalize(data);
      if (!albums.length) return;
      render();
      guard();
    })
    .catch(function () {});
})();
