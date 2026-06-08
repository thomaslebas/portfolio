(function () {
  var page = document.body.dataset.page;
  if (!page) return;

  var links = document.querySelectorAll('.site-nav a');
  links.forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href) return;

    var linkPage = href.replace('.html', '').replace('index', 'home');
    if (linkPage === page || (page === 'home' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();
