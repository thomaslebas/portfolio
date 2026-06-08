var overlayEl = null;

function getOverlay() {
  if (overlayEl) return overlayEl;

  overlayEl = document.createElement('div');
  overlayEl.className = 'overlay';
  overlayEl.setAttribute('role', 'dialog');
  overlayEl.setAttribute('aria-modal', 'true');
  overlayEl.innerHTML =
    '<div class="overlay-header">' +
      '<button class="overlay-close" type="button">Close</button>' +
      '<h2 class="overlay-title"></h2>' +
      '<p class="overlay-description"></p>' +
      '<p class="overlay-credit"></p>' +
      '<p class="overlay-year"></p>' +
    '</div>' +
    '<div class="overlay-images"></div>';

  overlayEl.querySelector('.overlay-close').addEventListener('click', closeOverlay);
  document.body.appendChild(overlayEl);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlayEl.classList.contains('is-open')) {
      closeOverlay();
    }
  });

  return overlayEl;
}

function openOverlay(project, imageBasePath) {
  var overlay = getOverlay();

  overlay.querySelector('.overlay-title').textContent = project.title;

  var descEl = overlay.querySelector('.overlay-description');
  descEl.textContent = project.description || '';
  descEl.style.display = project.description ? '' : 'none';

  var creditEl = overlay.querySelector('.overlay-credit');
  creditEl.textContent = project.credit || '';
  creditEl.style.display = project.credit ? '' : 'none';

  var yearEl = overlay.querySelector('.overlay-year');
  yearEl.textContent = project.year || '';
  yearEl.style.display = project.year ? '' : 'none';

  var imagesContainer = overlay.querySelector('.overlay-images');
  imagesContainer.innerHTML = '';

  if (project.images && project.images.length) {
    project.images.forEach(function (src) {
      var img = document.createElement('img');
      img.src = imageBasePath + src;
      img.alt = '';
      imagesContainer.appendChild(img);
    });
  }

  overlay.setAttribute('aria-label', project.title);
  overlay.classList.add('is-open');
  document.body.classList.add('overlay-open');
  overlay.querySelector('.overlay-close').focus();
}

function closeOverlay() {
  if (!overlayEl) return;

  overlayEl.classList.remove('is-open');
  document.body.classList.remove('overlay-open');
}
