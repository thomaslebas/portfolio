function renderGrid(container, projects, imageBasePath) {
  if (!container || !projects) return;

  projects.forEach(function (project) {
    var card = document.createElement('button');
    card.className = 'project-card';
    card.type = 'button';
    card.setAttribute('aria-label', 'View ' + project.title);

    if (project.thumbnail) {
      var img = document.createElement('img');
      img.className = 'project-card-image';
      img.src = imageBasePath + project.thumbnail;
      img.alt = '';
      img.loading = 'lazy';
      card.appendChild(img);
    } else {
      var placeholder = document.createElement('div');
      placeholder.className = 'project-card-placeholder';
      card.appendChild(placeholder);
    }

    var title = document.createElement('p');
    title.className = 'project-card-title';
    title.textContent = project.title;
    card.appendChild(title);

    card.addEventListener('click', function () {
      openOverlay(project, imageBasePath);
    });

    container.appendChild(card);
  });
}
