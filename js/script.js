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

  document.addEventListener('DOMContentLoaded', function () {
    buildSwitcher();
    setupNav();
    setupContactForm();
  });
})();
