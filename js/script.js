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
    toggle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18c1.2 0 2-1 2-2 0-.6-.2-1-.5-1.4-.3-.4-.5-.8-.5-1.3 0-1 .8-1.8 1.8-1.8H17a4 4 0 0 0 4-4c0-4.4-4-7.5-9-7.5Z"/><circle cx="7.5" cy="10.5" r="1" fill="currentColor" stroke="none"/><circle cx="11" cy="7.5" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="8.5" r="1" fill="currentColor" stroke="none"/></svg> Style';
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

  var TEE_MARK = '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M35,9 C41,15 59,15 65,9 L83,9 L98,27 L83,41 L75,33 L75,93 Q75,97 71,97 L29,97 Q25,97 25,93 L25,33 L17,41 L2,27 L17,9 Z" fill="none" stroke="currentColor" stroke-width="5"/></svg>';
  var SOAP_MARK = '<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="14" y="34" width="72" height="52" rx="16" fill="none" stroke="currentColor" stroke-width="5"/><path d="M26,48 Q40,36 54,48 Q66,58 76,46" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>';

  function productIcon(id) {
    return id.indexOf('tee') === 0 ? TEE_MARK : SOAP_MARK;
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
            '<div class="cart-item-media">' + productIcon(id) + '</div>' +
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
        showToast('Demo checkout — no payment processor is wired up here.');
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
      showToast("You're on the list! (Demo form — no email was actually sent.)");
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
