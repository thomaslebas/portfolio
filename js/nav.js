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

  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
    });
  });
})();
