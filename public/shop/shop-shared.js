(function() {
  'use strict';

  // Scroll progress bar
  var progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  progressBar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progressBar);

  function updateScrollProgress() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  window.addEventListener('resize', updateScrollProgress);
  updateScrollProgress();

  // Reveal animations
  var revealSelectors = ['.reveal', '.reveal-left', '.reveal-right', '.reveal-scale'];
  var revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealSelectors.forEach(function(sel) {
    document.querySelectorAll(sel).forEach(function(el) { revealObserver.observe(el); });
  });
  document.querySelectorAll('section').forEach(function(section) {
    if (section.classList.contains('no-reveal')) return;
    var hasReveal = revealSelectors.some(function(sel) { return section.classList.contains(sel.replace('.', '')); });
    if (!hasReveal) { section.classList.add('auto-reveal'); revealObserver.observe(section); }
  });

  // Header scrolled state
  var header = document.querySelector('.header');
  if (header) {
    function updateHeader() { header.classList.toggle('header-scrolled', window.scrollY > 10); }
    window.addEventListener('scroll', updateHeader, { passive: true });
    window.addEventListener('resize', updateHeader);
    updateHeader();
  }

  // Detect dark hero for transparent header
  var firstSection = document.querySelector('section');
  if (firstSection && (firstSection.classList.contains('page-hero') || firstSection.classList.contains('shop-hero') || firstSection.classList.contains('hero') || firstSection.classList.contains('dark-section'))) {
    document.body.classList.add('header-over-dark');
  }

  // Mobile menu
  var menuBtn = document.getElementById('menuBtn');
  var mobileMenu = document.getElementById('mobileMenu');
  if (menuBtn && mobileMenu) {
    var menuOpen = false;
    var openIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
    var closeIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/></svg>';
    menuBtn.addEventListener('click', function() {
      menuOpen = !menuOpen;
      mobileMenu.classList.toggle('active', menuOpen);
      menuBtn.innerHTML = menuOpen ? openIcon : closeIcon;
    });
  }

  // Cart
  var STORAGE_KEY = 'hushkhan_cart';
  function getCart() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch (e) { return []; } }
  function saveCart(cart) { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); }
  function formatPrice(n) { return n.toLocaleString('mn-MN').replace(/,/g, ' ') + '₮'; }
  function parsePrice(t) { if (!t) return 0; var num = parseInt(String(t).replace(/[^0-9]/g, ''), 10); return isNaN(num) ? 0 : num; }

  var drawer = document.getElementById('cartDrawer');
  var overlay = document.getElementById('cartOverlay');
  var toggle = document.getElementById('cartToggle');
  var close = document.getElementById('cartClose');
  var itemsContainer = document.getElementById('cartItems');
  var totalEl = document.getElementById('cartTotal');
  var originalTotalEl = document.getElementById('cartOriginalTotal');
  var countEl = document.getElementById('cartCount');
  var headerCountEl = document.getElementById('cartHeaderCount');
  var checkoutBtn = document.getElementById('checkoutBtn');

  var PRODUCTS = {
    roasted: { title: 'Шарсан хушны самар', image: '/assets/products/roasted.jpg', price: 45000, original: 52000 },
    raw: { title: 'Цэвэр хушны самар', image: '/assets/products/raw.jpg', price: 52000, original: 60000 },
    oil: { title: 'Хушны самрын тос', image: '/assets/products/oil.jpg', price: 78000, original: 90000 },
    gift: { title: 'HushKhan бэлэг багц', image: '/assets/products/gift.jpg', price: 158000, original: 180000 },
    honey: { title: 'Зөгийн балтай самар', image: '/assets/products/honey.jpg', price: 58500, original: 68000 },
    chocolate: { title: 'Самрын шоколад', image: '/assets/products/chocolate.jpg', price: 43200, original: 50000 },
    'oil-small': { title: 'Самрын тос жижиг лонх', image: '/assets/products/oil.jpg', price: 0, original: 25000 },
    mystery: { title: 'HushKhan Mystery Bag', image: '/assets/products/gift.jpg', price: 35000, original: 50000 },
  };

  function updateCount() {
    var cart = getCart();
    var count = cart.reduce(function(sum, item) { return sum + item.quantity; }, 0);
    if (countEl) countEl.textContent = count;
    if (headerCountEl) headerCountEl.textContent = '(' + count + ')';
  }

  function openDrawer() {
    if (!drawer || !overlay) return;
    drawer.classList.add('open'); overlay.classList.add('open'); document.body.style.overflow = 'hidden'; renderCart();
  }
  function closeDrawer() {
    if (!drawer || !overlay) return;
    drawer.classList.remove('open'); overlay.classList.remove('open'); document.body.style.overflow = '';
  }
  if (toggle) toggle.addEventListener('click', openDrawer);
  if (close) close.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeDrawer(); });

  function addToCart(id, optionLabel, price, originalPrice, title, image) {
    var cart = getCart();
    var existing = cart.find(function(i) { return i.id === id && i.optionLabel === optionLabel; });
    if (existing) { existing.quantity += 1; } else { cart.push({ id: id, title: title, image: image, optionLabel: optionLabel, price: price, originalPrice: originalPrice, quantity: 1 }); }
    saveCart(cart); updateCount(); openDrawer();
  }
  function upsellAdd(key) { var p = PRODUCTS[key]; if (!p) return; addToCart(key, 'Нэг удаагийн', p.price, p.original, p.title, p.image); }

  function renderCart() {
    if (!itemsContainer) return;
    var cart = getCart();
    if (!cart.length) { itemsContainer.innerHTML = '<div class="cart-empty">Сагс хоосон байна.</div>'; if (totalEl) totalEl.textContent = '0₮'; if (originalTotalEl) originalTotalEl.textContent = '0₮'; return; }
    var total = 0, originalTotal = 0, html = '';
    cart.forEach(function(item, index) {
      total += item.price * item.quantity;
      originalTotal += item.originalPrice * item.quantity;
      html += '<div class="cart-item" data-index="' + index + '">' +
        '<img src="' + item.image + '" alt="' + item.title + '" class="cart-item-img">' +
        '<div class="cart-item-info"><h4>' + item.title + '</h4><p class="cart-item-option">' + (item.optionLabel || '') + '</p></div>' +
        '<div class="cart-item-actions"><div class="qty-stepper"><button class="qty-btn minus" data-index="' + index + '" aria-label="Багасгах">−</button><span class="qty-value">' + item.quantity + '</span><button class="qty-btn plus" data-index="' + index + '" aria-label="Нэмэх">+</button></div><button class="cart-item-remove" data-index="' + index + '">Хасах</button></div>' +
        '<div class="cart-item-price">' + formatPrice(item.price * item.quantity) + '</div>' +
        '</div>';
    });
    itemsContainer.innerHTML = html;
    if (totalEl) totalEl.textContent = formatPrice(total);
    if (originalTotalEl) originalTotalEl.textContent = formatPrice(originalTotal);
  }

  function changeQty(index, delta) {
    var cart = getCart();
    if (!cart[index]) return;
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    saveCart(cart); updateCount(); renderCart();
  }
  function removeItem(index) { var cart = getCart(); cart.splice(index, 1); saveCart(cart); updateCount(); renderCart(); }

  if (itemsContainer) {
    itemsContainer.addEventListener('click', function(e) {
      var btn = e.target.closest('button'); if (!btn) return;
      var index = parseInt(btn.dataset.index, 10);
      if (btn.classList.contains('plus')) changeQty(index, 1);
      if (btn.classList.contains('minus')) changeQty(index, -1);
      if (btn.classList.contains('cart-item-remove')) removeItem(index);
    });
  }
  document.querySelectorAll('[data-upsell]').forEach(function(btn) { btn.addEventListener('click', function() { upsellAdd(btn.dataset.upsell); }); });
  document.querySelectorAll('.shop-quickadd').forEach(function(btn) {
    btn.addEventListener('click', function(e) { e.preventDefault(); e.stopPropagation(); addToCart(btn.dataset.id, 'Багцад авах', parseInt(btn.dataset.price, 10) || 0, parseInt(btn.dataset.original, 10) || 0, btn.dataset.title, btn.dataset.image); });
  });
  updateCount();
  window.addToCart = addToCart;
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
      var cart = getCart();
      if (!cart.length) { alert('Сагс хоосон байна.'); return; }
      window.location.href = '/shop/checkout';
    });
  }

  // Product detail page: size selector + add to cart
  var productSizeOptions = document.querySelectorAll('.size-option');
  var productPriceDisplay = document.querySelector('.product-price');
  var productAddToCart = document.querySelector('.btn-add-to-cart');
  if (productSizeOptions.length && productPriceDisplay) {
    function updateProductPrice() {
      var selected = document.querySelector('.size-option.active');
      if (!selected) return;
      var price = parseInt(selected.dataset.price, 10) || 0;
      var original = parseInt(selected.dataset.original, 10) || 0;
      var html = formatPrice(price);
      if (original > price) html += ' <s>' + formatPrice(original) + '</s>';
      productPriceDisplay.innerHTML = html;
      if (productAddToCart) {
        productAddToCart.dataset.price = price;
        productAddToCart.dataset.original = original;
        productAddToCart.dataset.option = selected.textContent.trim();
      }
    }
    productSizeOptions.forEach(function(opt) {
      opt.addEventListener('click', function() {
        productSizeOptions.forEach(function(o) { o.classList.remove('active'); });
        opt.classList.add('active');
        updateProductPrice();
      });
    });
    updateProductPrice();
  }
  if (productAddToCart) {
    productAddToCart.addEventListener('click', function(e) {
      e.preventDefault();
      var id = productAddToCart.dataset.id;
      var price = parseInt(productAddToCart.dataset.price, 10) || 0;
      var original = parseInt(productAddToCart.dataset.original, 10) || 0;
      var option = productAddToCart.dataset.option || 'Нэг удаагийн';
      var title = productAddToCart.dataset.title || '';
      var image = productAddToCart.dataset.image || '';
      var qtyInput = document.querySelector('.quantity input');
      var qty = qtyInput ? Math.max(1, parseInt(qtyInput.value, 10) || 1) : 1;
      for (var i = 0; i < qty; i++) addToCart(id, option, price, original, title, image);
    });
  }

  // Cart page render
  var pageCartContainer = document.getElementById('pageCartItems');
  var pageCartSubtotal = document.getElementById('pageCartSubtotal');
  var pageCartShipping = document.getElementById('pageCartShipping');
  var pageCartTotal = document.getElementById('pageCartTotal');
  var pageCartOriginal = document.getElementById('pageCartOriginal');
  if (pageCartContainer) {
    function renderPageCart() {
      var cart = getCart();
      if (!cart.length) {
        pageCartContainer.innerHTML = '<div class="empty-cart"><h2>Сагс хоосон байна</h2><p>Онлайн дэлгүүрээс бүтээгдэхүүн сонгоорой.</p><a href="/shop" class="btn btn-primary">Дэлгүүр рүү буцах</a></div>';
        if (pageCartSubtotal) pageCartSubtotal.textContent = '0₮';
        if (pageCartTotal) pageCartTotal.textContent = '0₮';
        if (pageCartOriginal) pageCartOriginal.textContent = '0₮';
        return;
      }
      var total = 0, originalTotal = 0, html = '';
      cart.forEach(function(item, index) {
        total += item.price * item.quantity;
        originalTotal += item.originalPrice * item.quantity;
        html += '<div class="page-cart-item" data-index="' + index + '">' +
          '<img src="' + item.image + '" alt="' + item.title + '">' +
          '<div class="page-cart-item-info"><h3>' + item.title + '</h3><p>' + (item.optionLabel || '') + '</p></div>' +
          '<div class="page-cart-item-actions"><div class="qty-stepper"><button class="qty-btn minus" data-index="' + index + '">−</button><span class="qty-value">' + item.quantity + '</span><button class="qty-btn plus" data-index="' + index + '">+</button></div><button class="cart-item-remove" data-index="' + index + '">Хасах</button></div>' +
          '<div class="page-cart-item-price">' + formatPrice(item.price * item.quantity) + '</div>' +
          '</div>';
      });
      pageCartContainer.innerHTML = html;
      var shipping = total >= 150000 ? 0 : 5000;
      if (pageCartSubtotal) pageCartSubtotal.textContent = formatPrice(total);
      if (pageCartShipping) pageCartShipping.textContent = shipping === 0 ? 'Үнэгүй' : formatPrice(shipping);
      if (pageCartTotal) pageCartTotal.textContent = formatPrice(total + shipping);
      if (pageCartOriginal) pageCartOriginal.textContent = formatPrice(originalTotal + shipping);
    }
    pageCartContainer.addEventListener('click', function(e) {
      var btn = e.target.closest('button'); if (!btn) return;
      var index = parseInt(btn.dataset.index, 10);
      if (btn.classList.contains('plus')) changeQty(index, 1);
      if (btn.classList.contains('minus')) changeQty(index, -1);
      if (btn.classList.contains('cart-item-remove')) removeItem(index);
      renderPageCart();
    });
    renderPageCart();
  }

  // Checkout page order summary + payment toggle
  var checkoutSummary = document.getElementById('checkoutSummary');
  if (checkoutSummary) {
    var cart = getCart();
    var total = cart.reduce(function(sum, item) { return sum + item.price * item.quantity; }, 0);
    var shipping = total >= 150000 ? 0 : 5000;
    var subtotalEl = document.getElementById('checkoutSubtotal');
    var shippingEl = document.getElementById('checkoutShipping');
    var totalEl2 = document.getElementById('checkoutTotal');
    if (subtotalEl) subtotalEl.textContent = formatPrice(total);
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Үнэгүй' : formatPrice(shipping);
    if (totalEl2) totalEl2.textContent = formatPrice(total + shipping);
    var html = '';
    cart.forEach(function(item) {
      html += '<div class="summary-item"><span>' + item.title + ' x ' + item.quantity + '</span><span>' + formatPrice(item.price * item.quantity) + '</span></div>';
    });
    if (!cart.length) html = '<div class="summary-item"><span>Сагс хоосон</span><span>—</span></div>';
    checkoutSummary.innerHTML = html;
  }

  document.querySelectorAll('.payment-option').forEach(function(opt) {
    opt.addEventListener('click', function() {
      document.querySelectorAll('.payment-option').forEach(function(o) { o.classList.remove('active'); });
      opt.classList.add('active');
    });
  });

  var checkoutForm = document.getElementById('checkoutForm');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var cart = getCart();
      if (!cart.length) { alert('Сагс хоосон байна.'); return; }
      alert('Захиалга хүлээн авлаа. Баярлалаа!');
      saveCart([]); updateCount();
      window.location.href = '/shop';
    });
  }
})();
