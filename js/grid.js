function renderGrid(container, projects, imageBasePath, options) {
  if (!container || !projects) return;

  var opts = options || {};
  var showLabels = opts.showLabels !== false;
  var source = opts.source || 'archive';

  projects.forEach(function (project, index) {
    var card = document.createElement('a');
    card.className = 'project-card';
    card.href = 'project.html?source=' + encodeURIComponent(source) + '&id=' + index;
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

    if (showLabels) {
      var title = document.createElement('p');
      title.className = 'project-card-title';
      title.textContent = project.title;
      card.appendChild(title);
    }

    container.appendChild(card);
  });
}
