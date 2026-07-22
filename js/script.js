(function () {
  var THEMES = [
    { id: 'feminine', name: 'Feminine Blush', colors: ['#d9718f', '#d4af7a'] },
    { id: 'luxury', name: 'Luxury Spa', colors: ['#7c8f6e', '#c9a24b'] },
    { id: 'glam', name: 'Glam Noir', colors: ['#121114', '#c9a24b'] },
    { id: 'bright', name: 'Bright & Playful', colors: ['#f26419', '#ffd23f'] },
    { id: 'earthy', name: 'Earthy Artisan', colors: ['#b06a45', '#7d8c5c'] },
    { id: 'minimal', name: 'Minimalist Modern', colors: ['#111111', '#ff6b57'] },
    { id: 'pastel', name: 'Pastel Dream', colors: ['#9c82d1', '#a8dfc9'] },
    { id: 'vintage', name: 'Vintage Boho', colors: ['#c68b3a', '#9b4630'] }
  ];

  var STORAGE_KEY = 'gbg-theme';

  function currentTheme() {
    return localStorage.getItem(STORAGE_KEY) || 'feminine';
  }

  function setTheme(id) {
    localStorage.setItem(STORAGE_KEY, id);
    document.documentElement.setAttribute('data-theme', id);
    updateActiveSwatch(id);
  }

  function updateActiveSwatch(id) {
    var items = document.querySelectorAll('.ts-item');
    items.forEach(function (el) {
      el.classList.toggle('active', el.dataset.theme === id);
    });
  }

  function buildSwitcher() {
    var wrap = document.createElement('div');
    wrap.id = 'theme-switcher';

    var toggle = document.createElement('button');
    toggle.className = 'ts-toggle';
    toggle.type = 'button';
    toggle.innerHTML = '🎨 Style';
    toggle.setAttribute('aria-label', 'Preview a different site style');

    var panel = document.createElement('div');
    panel.className = 'ts-panel';

    var heading = document.createElement('h4');
    heading.textContent = 'Preview a style';
    panel.appendChild(heading);

    var list = document.createElement('div');
    list.className = 'ts-list';

    THEMES.forEach(function (theme) {
      var item = document.createElement('button');
      item.type = 'button';
      item.className = 'ts-item';
      item.dataset.theme = theme.id;

      var swatch = document.createElement('span');
      swatch.className = 'ts-swatch';
      swatch.style.background = 'linear-gradient(135deg,' + theme.colors[0] + ',' + theme.colors[1] + ')';

      var label = document.createElement('span');
      label.textContent = theme.name;

      item.appendChild(swatch);
      item.appendChild(label);
      item.addEventListener('click', function () {
        setTheme(theme.id);
      });

      list.appendChild(item);
    });

    panel.appendChild(list);
    wrap.appendChild(toggle);
    wrap.appendChild(panel);
    document.body.appendChild(wrap);

    toggle.addEventListener('click', function () {
      panel.classList.toggle('open');
    });

    document.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) panel.classList.remove('open');
    });

    updateActiveSwatch(currentTheme());
  }

  function setupNav() {
    var toggle = document.querySelector('.nav-toggle');
    var links = document.querySelector('.nav-links');
    if (toggle && links) {
      toggle.addEventListener('click', function () {
        links.classList.toggle('open');
      });
      links.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () { links.classList.remove('open'); });
      });
    }

    var path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (href === path || (path === '' && href === 'index.html')) {
        a.classList.add('active');
      }
    });
  }

  function setupContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;
    var success = document.getElementById('form-success');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (success) success.classList.add('show');
      form.reset();
      if (success) success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* ---------- Toast ---------- */

  function showToast(message) {
    var toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(function () {
      toast.classList.remove('show');
    }, 2400);
  }

  /* ---------- Demo cart ---------- */

  var CART_KEY = 'gbg-cart';

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    renderCart();
  }

  function addToCart(id, name, price) {
    var cart = getCart();
    if (!cart[id]) cart[id] = { name: name, price: price, qty: 0 };
    cart[id].qty += 1;
    saveCart(cart);
    showToast(name + ' added to cart');
  }

  function removeFromCart(id) {
    var cart = getCart();
    delete cart[id];
    saveCart(cart);
  }

  function cartCount(cart) {
    return Object.keys(cart).reduce(function (sum, id) { return sum + cart[id].qty; }, 0);
  }

  function cartSubtotal(cart) {
    return Object.keys(cart).reduce(function (sum, id) { return sum + cart[id].qty * cart[id].price; }, 0);
  }

  function renderCart() {
    var cart = getCart();
    var count = cartCount(cart);

    document.querySelectorAll('.cart-badge').forEach(function (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });

    document.querySelectorAll('.cart-panel').forEach(function (panel) {
      var list = panel.querySelector('.cart-list');
      var subtotalEl = panel.querySelector('.cart-subtotal-amt');
      if (!list) return;

      list.innerHTML = '';
      var ids = Object.keys(cart);

      if (!ids.length) {
        list.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
      } else {
        ids.forEach(function (id) {
          var item = cart[id];
          var row = document.createElement('div');
          row.className = 'cart-item';
          row.innerHTML =
            '<div class="cart-item-media">🛍️</div>' +
            '<div class="cart-item-info">' +
              '<div class="name"></div>' +
              '<div class="meta"></div>' +
            '</div>' +
            '<button class="cart-item-remove" type="button" aria-label="Remove ' + item.name + '">&times;</button>';
          row.querySelector('.name').textContent = item.name;
          row.querySelector('.meta').textContent = 'Qty ' + item.qty + ' × $' + item.price.toFixed(2);
          row.querySelector('.cart-item-remove').addEventListener('click', function (e) {
            e.stopPropagation();
            removeFromCart(id);
          });
          list.appendChild(row);
        });
      }

      if (subtotalEl) subtotalEl.textContent = '$' + cartSubtotal(cart).toFixed(2);
    });
  }

  function setupCart() {
    document.querySelectorAll('.cart-btn').forEach(function (btn) {
      var panel = btn.parentElement.querySelector('.cart-panel');
      if (!panel) return;
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        panel.classList.toggle('open');
      });
      document.addEventListener('click', function (e) {
        if (!panel.contains(e.target) && e.target !== btn) panel.classList.remove('open');
      });
    });

    document.querySelectorAll('.cart-checkout').forEach(function (btn) {
      btn.addEventListener('click', function () {
        showToast("This is a demo store — checkout isn't connected to a real payment processor.");
      });
    });

    document.querySelectorAll('.add-btn, .quick-add').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var card = btn.closest('[data-product-id]');
        if (!card) return;
        addToCart(card.dataset.productId, card.dataset.productName, parseFloat(card.dataset.productPrice));
      });
    });

    renderCart();
  }

  /* ---------- Collection filter tabs ---------- */

  function setupTabs() {
    var tabs = document.querySelectorAll('.tab-btn');
    if (!tabs.length) return;
    var products = document.querySelectorAll('[data-category]');

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        var filter = tab.dataset.filter;
        products.forEach(function (p) {
          p.style.display = (filter === 'all' || p.dataset.category === filter) ? '' : 'none';
        });
      });
    });
  }

  /* ---------- Newsletter demo submit ---------- */

  function setupNewsletter() {
    var form = document.getElementById('newsletter-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      showToast('Thanks for subscribing! (demo only — no email was sent)');
      form.reset();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    buildSwitcher();
    setupNav();
    setupContactForm();
    setupCart();
    setupTabs();
    setupNewsletter();
  });
})();
