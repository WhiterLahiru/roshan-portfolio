(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ===== Categories (keys match the industry cards on the home page) ===== */
  var CATEGORIES = [
    { key: 'all', name: 'All products' },
    { key: 'cosmetics', name: 'Cosmetics' },
    { key: 'baby', name: 'Baby Products' },
    { key: 'electronics', name: 'Electronics' },
    { key: 'household', name: 'Household' },
    { key: 'food', name: 'Food & Beverage' },
    { key: 'health', name: 'Health Supplements' },
    { key: 'pet', name: 'Pet Products' }
  ];

  /* ===== Products =====
     To add a product, copy one block below and change the values.
     cats:   one or more category keys from the list above
     images: [file, label] pairs; the first image is the card cover */
  var PRODUCTS = [
    {
      id: 'lumiwave-led-mask',
      name: 'LumiWave 7-in-1 LED Mask',
      brand: 'Nuovaglo',
      cats: ['cosmetics', 'electronics'],
      type: 'Retail box',
      desc: 'A premium retail box for an at-home LED skincare device. Soft neutrals, gold accents and a clear benefits panel give it a clinical but luxurious feel on shelf.',
      deliverables: ['Retail box', 'Dieline', '3D mockup', 'Brand system'],
      images: [
        ['assets/products/led-mask-box.jpg', '3D product mockup'],
        ['assets/products/skincare-mask-box.jpg', 'Hero banner'],
        ['assets/products/led-mask-dieline.jpg', 'Print-ready dieline'],
        ['assets/products/led-mask-mockup.jpg', 'Campaign visual'],
        ['assets/products/led-mask-brand.jpg', 'Brand system'],
        ['assets/products/led-mask-lifestyle.jpg', 'Lifestyle']
      ]
    },
    {
      id: 'kvibe-baby-wipes',
      name: 'GentleTouch Baby Wipes',
      brand: 'K-VIBE',
      cats: ['baby'],
      type: 'Flow-wrap pack',
      desc: 'A friendly, trustworthy flow-wrap pack for sensitive-skin baby wipes. Deep navy and soft blues keep it calm, while clear benefit icons make it easy to shop.',
      deliverables: ['Design draft', 'Dieline', '3D mockup', 'Brand system'],
      images: [
        ['assets/products/baby-wipes-pack.jpg', '3D product mockup'],
        ['assets/process/step-draft.jpg', 'Design draft'],
        ['assets/products/baby-wipes-dieline.jpg', 'Print-ready dieline'],
        ['assets/products/baby-wipes-mockup.jpg', 'Shelf mockup'],
        ['assets/products/baby-wipes-brand.jpg', 'Brand system'],
        ['assets/products/baby-wipes-lifestyle.jpg', 'Lifestyle']
      ]
    },
    {
      id: 'beepro-steamsense',
      name: 'SteamSense Garment Steamer',
      brand: 'Beepro',
      cats: ['household', 'electronics'],
      type: 'Product carton',
      desc: 'A bold black-and-rose-gold carton for a 2100W handheld steamer, with an icon-led feature panel, full spec table and accessories on the back.',
      deliverables: ['Product carton', 'Spec panel', 'Dieline', '3D mockup'],
      images: [
        ['assets/products/steamer-packaging.jpg', '3D product mockup'],
        ['assets/products/steamer-gift-box.jpg', 'All carton panels']
      ]
    },
    {
      id: 'beeperfect-lady-shaver',
      name: 'Lady Shaver Electric Set',
      brand: 'Beeperfect',
      cats: ['electronics'],
      type: 'Retail box',
      desc: 'A soft pink retail box for an electric shaver set. A honeycomb pattern ties back to the brand, and the attachments are laid out clearly on the front.',
      deliverables: ['Retail box', 'Dieline', '3D mockup'],
      images: [
        ['assets/products/lady-shaver-box.jpg', '3D product mockup']
      ]
    }
  ];

  var catName = {};
  CATEGORIES.forEach(function (c) { catName[c.key] = c.name; });
  var state = { cat: 'all', q: '', sort: 'featured' };
  var visible = [];

  /* ===== Filter chips ===== */
  var chips = $('#chips');
  CATEGORIES.forEach(function (c) {
    var n = c.key === 'all' ? PRODUCTS.length : PRODUCTS.filter(function (p) { return p.cats.indexOf(c.key) > -1; }).length;
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip' + (n ? '' : ' none');
    b.dataset.cat = c.key;
    b.setAttribute('role', 'tab');
    b.innerHTML = '<span></span><i></i>';
    b.firstChild.textContent = c.name;
    b.lastChild.textContent = n;
    b.addEventListener('click', function () { setCat(c.key, true); });
    chips.appendChild(b);
  });

  function setCat(key, push) {
    if (!catName[key]) key = 'all';
    state.cat = key;
    $$('.chip', chips).forEach(function (b) {
      var on = b.dataset.cat === key;
      b.classList.toggle('on', on);
      b.setAttribute('aria-selected', on);
      if (on && chips.scrollWidth > chips.clientWidth) chips.scrollLeft = b.offsetLeft - chips.offsetLeft - 20;
    });
    if (push) history.replaceState(null, '', key === 'all' ? 'products.html' : 'products.html?cat=' + key);
    render();
  }

  /* ===== Grid ===== */
  var grid = $('#grid');
  function card(p, i) {
    var a = document.createElement('article');
    a.className = 'p-card';
    a.style.setProperty('--d', (i % 3) * 0.06 + 's');
    a.innerHTML =
      '<button class="p-media" type="button"><img loading="lazy" alt=""><span class="p-views"></span><span class="p-open">Preview</span></button>' +
      '<div class="p-body"><p class="p-cat"></p><h3></h3><p class="p-brand"></p><ul class="tags"></ul>' +
      '<button class="p-link" type="button">Preview product <span aria-hidden="true">→</span></button></div>';
    var img = $('img', a);
    img.src = p.images[0][0];
    img.alt = p.brand + ' ' + p.name + ' packaging';
    $('.p-views', a).textContent = p.images.length + (p.images.length === 1 ? ' view' : ' views');
    $('.p-cat', a).textContent = p.cats.map(function (c) { return catName[c]; }).join(' · ');
    $('h3', a).textContent = p.name;
    $('.p-brand', a).textContent = p.brand + ' · ' + p.type;
    var tags = $('.tags', a);
    p.deliverables.forEach(function (d) { var li = document.createElement('li'); li.textContent = d; tags.appendChild(li); });
    $('.p-media', a).setAttribute('aria-label', 'Preview ' + p.name);
    $$('button', a).forEach(function (b) { b.addEventListener('click', function () { openPreview(p.id, b); }); });
    return a;
  }

  function render() {
    var q = state.q.trim().toLowerCase();
    visible = PRODUCTS.filter(function (p) {
      var inCat = state.cat === 'all' || p.cats.indexOf(state.cat) > -1;
      var hay = (p.name + ' ' + p.brand + ' ' + p.type).toLowerCase();
      return inCat && (!q || hay.indexOf(q) > -1);
    });
    if (state.sort !== 'featured') {
      visible = visible.slice().sort(function (a, b) { return a.name.localeCompare(b.name); });
      if (state.sort === 'za') visible.reverse();
    }
    grid.innerHTML = '';
    visible.forEach(function (p, i) { grid.appendChild(card(p, i)); });
    $('#empty').hidden = visible.length > 0;
    var where = state.cat === 'all' ? '' : ' in ' + catName[state.cat];
    $('#count').textContent = 'Showing ' + visible.length + ' of ' + PRODUCTS.length + ' products' + where + (q ? ' matching “' + state.q.trim() + '”' : '');
  }

  $('#q').addEventListener('input', function () { state.q = this.value; render(); });
  $('#sort').addEventListener('change', function () { state.sort = this.value; render(); });
  $('#reset').addEventListener('click', function () { $('#q').value = ''; state.q = ''; setCat('all', true); });

  /* ===== Preview box ===== */
  var pv = $('#pv'), cur = null, imgIdx = 0, lastFocus = null;
  function list() { return visible.length ? visible : PRODUCTS; }

  function showImage(i) {
    var imgs = cur.images;
    imgIdx = (i + imgs.length) % imgs.length;
    var im = $('#pvImg');
    im.classList.remove('in');
    im.src = imgs[imgIdx][0];
    im.alt = cur.brand + ' ' + cur.name + ': ' + imgs[imgIdx][1];
    requestAnimationFrame(function () { im.classList.add('in'); });
    $('#pvLabel').textContent = imgs[imgIdx][1] + '  ·  ' + (imgIdx + 1) + ' / ' + imgs.length;
    $$('.pv-thumbs button').forEach(function (b, k) { b.classList.toggle('on', k === imgIdx); b.setAttribute('aria-current', k === imgIdx); });
    var multi = imgs.length > 1;
    $('#pvPrevImg').hidden = !multi; $('#pvNextImg').hidden = !multi;
  }

  function fill(p) {
    cur = p;
    $('#pvCat').textContent = p.cats.map(function (c) { return catName[c]; }).join(' · ');
    $('#pvTitle').textContent = p.name;
    $('#pvBrand').textContent = 'Brand: ' + p.brand;
    $('#pvDesc').textContent = p.desc;
    $('#pvType').textContent = p.type;
    var tags = $('#pvTags'); tags.innerHTML = '';
    p.deliverables.forEach(function (d) { var li = document.createElement('li'); li.textContent = d; tags.appendChild(li); });
    var th = $('#pvThumbs'); th.innerHTML = '';
    th.hidden = p.images.length < 2;
    p.images.forEach(function (im, k) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Show ' + im[1]);
      b.innerHTML = '<img alt="" loading="lazy">';
      b.firstChild.src = im[0];
      b.addEventListener('click', function () { showImage(k); });
      th.appendChild(b);
    });
    showImage(0);
    var l = list(), at = l.indexOf(p);
    $('#pvPrev').disabled = l.length < 2; $('#pvNext').disabled = l.length < 2;
    $('#pvPrev').dataset.to = l[(at - 1 + l.length) % l.length].id;
    $('#pvNext').dataset.to = l[(at + 1) % l.length].id;
  }

  function openPreview(id, from) {
    var p = PRODUCTS.filter(function (x) { return x.id === id; })[0];
    if (!p) return;
    lastFocus = from || lastFocus;
    fill(p);
    pv.classList.add('open');
    pv.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    $('.x', pv).focus();
  }
  function closePreview() {
    pv.classList.remove('open');
    pv.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  $('#pvPrevImg').addEventListener('click', function () { showImage(imgIdx - 1); });
  $('#pvNextImg').addEventListener('click', function () { showImage(imgIdx + 1); });
  $('#pvPrev').addEventListener('click', function () { openPreview(this.dataset.to); });
  $('#pvNext').addEventListener('click', function () { openPreview(this.dataset.to); });
  $$('[data-close]', pv).forEach(function (c) { c.addEventListener('click', closePreview); });
  document.addEventListener('keydown', function (e) {
    if (!pv.classList.contains('open')) return;
    if (e.key === 'Escape') closePreview();
    else if (e.key === 'ArrowRight') showImage(imgIdx + 1);
    else if (e.key === 'ArrowLeft') showImage(imgIdx - 1);
  });

  /* ===== Header: mobile menu, hide on scroll, back to top ===== */
  var nav = $('#nav'), burger = $('#burger'), header = $('#header'), totop = $('#totop'), lastY = 0;
  function menu(open) {
    nav.classList.toggle('open', open);
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  }
  burger.addEventListener('click', function () { menu(!nav.classList.contains('open')); });
  $$('#nav a').forEach(function (a) { a.addEventListener('click', function () { menu(false); }); });
  addEventListener('resize', function () { if (innerWidth > 1000) menu(false); });
  addEventListener('scroll', function () {
    var y = scrollY;
    totop.classList.toggle('show', y > 700);
    lastY = y;
  }, { passive: true });
  totop.addEventListener('click', function (e) { e.preventDefault(); scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ===== Start: category from the URL (products.html?cat=baby) ===== */
  var m = /[?&]cat=([a-z]+)/.exec(location.search);
  setCat(m ? m[1] : 'all', false);
  var pm = /[?&]p=([a-z0-9-]+)/.exec(location.search);
  if (pm) openPreview(pm[1]);
})();
