(function () {
  var page = document.body.dataset.page;

  if (page) {
    var links = document.querySelectorAll('.site-nav a');
    links.forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;

      var linkPage = href.replace('.html', '').replace('index', 'home');
      if (linkPage === page || (page === 'home' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  var inner = nav && nav.querySelector('.site-nav-inner');
  var mobileQuery = window.matchMedia('(max-width: 640px)');

  if (!toggle || !nav || !inner) return;

  function syncExpanded(open) {
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  function resetDesktopNav() {
    inner.style.height = '';
    nav.classList.remove('is-open');
    syncExpanded(false);
  }

  function syncOpenHeight() {
    inner.style.height = inner.scrollHeight + 'px';
  }

  function openNav() {
    nav.classList.add('is-open');
    inner.style.height = '0px';
    inner.offsetHeight;
    syncOpenHeight();
    syncExpanded(true);
  }

  function closeNav() {
    inner.style.height = inner.scrollHeight + 'px';
    inner.offsetHeight;
    nav.classList.remove('is-open');
    inner.style.height = '0px';
    syncExpanded(false);
  }

  toggle.addEventListener('click', function () {
    if (!mobileQuery.matches) return;

    if (nav.classList.contains('is-open')) {
      closeNav();
    } else {
      openNav();
    }
  });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (!mobileQuery.matches || !nav.classList.contains('is-open')) return;
      closeNav();
    });
  });

  mobileQuery.addEventListener('change', function (e) {
    if (e.matches) {
      inner.style.height = nav.classList.contains('is-open') ? inner.scrollHeight + 'px' : '0px';
    } else {
      resetDesktopNav();
    }
  });

  window.addEventListener('resize', function () {
    if (mobileQuery.matches && nav.classList.contains('is-open')) {
      syncOpenHeight();
    }
  });
})();
