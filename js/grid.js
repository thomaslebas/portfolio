function renderGrid(container, projects, options) {
  if (!container || !projects) return;

  var opts = options || {};
  var showDescriptor = opts.showDescriptor === true;
  var source = opts.source || 'archive';
  var limit = opts.limit;
  var items = limit ? projects.slice(0, limit) : projects;

  items.forEach(function (project, index) {
    var href = 'project.html?source=' + encodeURIComponent(source) + '&id=' + index;

    if (showDescriptor) {
      var card = document.createElement('article');
      card.className = 'project-card';

      var link = document.createElement('a');
      link.className = 'project-card-link';
      link.href = href;
      link.setAttribute('aria-label', 'View ' + project.title);

      if (project.thumbnail) {
        var img = document.createElement('img');
        img.className = 'project-card-image';
        img.src = project.thumbnail;
        img.alt = '';
        img.loading = 'lazy';
        link.appendChild(img);
      } else {
        var placeholder = document.createElement('div');
        placeholder.className = 'project-card-placeholder';
        link.appendChild(placeholder);
      }

      if (project.year) {
        var year = document.createElement('p');
        year.className = 'project-card-year';
        year.textContent = project.year;
        link.appendChild(year);
      }

      var title = document.createElement('p');
      title.className = 'project-card-title';
      title.textContent = project.title;
      link.appendChild(title);

      card.appendChild(link);

      if (project.descriptor) {
        var descriptor = document.createElement('p');
        descriptor.className = 'project-card-descriptor';
        descriptor.textContent = project.descriptor;
        card.appendChild(descriptor);
      }

      container.appendChild(card);
      return;
    }

    var card = document.createElement('a');
    card.className = 'project-card';
    card.href = href;
    card.setAttribute('aria-label', 'View ' + project.title);

    if (project.thumbnail) {
      var archiveImg = document.createElement('img');
      archiveImg.className = 'project-card-image';
      archiveImg.src = project.thumbnail;
      archiveImg.alt = '';
      archiveImg.loading = 'lazy';
      card.appendChild(archiveImg);
    } else {
      var archivePlaceholder = document.createElement('div');
      archivePlaceholder.className = 'project-card-placeholder';
      card.appendChild(archivePlaceholder);
    }

    container.appendChild(card);
  });
}
