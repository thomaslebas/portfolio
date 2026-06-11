(function () {
  var params = new URLSearchParams(window.location.search);
  var source = params.get('source');
  var id = parseInt(params.get('id'), 10);

  var backUrls = {
    archive: 'archive.html',
    'side-projects': 'side-projects.html'
  };

  var backLabels = {
    archive: 'Archive',
    'side-projects': 'Side quests'
  };

  var collections = {
    archive: sortProjectsByYear(typeof archiveProjects !== 'undefined' ? archiveProjects : []),
    'side-projects': typeof sideProjects !== 'undefined' ? sideProjects : []
  };

  var imageBasePaths = {
    archive: 'images/archive/',
    'side-projects': 'images/archive/'
  };

  if (!source || !collections[source] || isNaN(id) || id < 0 || id >= collections[source].length) {
    window.location.replace('archive.html');
    return;
  }

  if (typeof caseStudiesAuth !== 'undefined' && !caseStudiesAuth.guardProjectSource(source)) {
    return;
  }

  var project = collections[source][id];
  var container = document.getElementById('project-detail');
  var imageBasePath = imageBasePaths[source];

  document.title = project.title + ' — Thomas Le Bas';

  var html = '<div class="project-back"><span class="project-back-arrow" aria-hidden="true">←</span> <a class="project-back-link" href="' + backUrls[source] + '">' + backLabels[source] + '</a></div>';
  html += '<div class="project-content">';
  html += '<h1 class="project-title">' + escapeHtml(project.title) + '</h1>';

  if (project.description) {
    html += '<p class="project-description">' + escapeHtml(project.description) + '</p>';
  }

  if (project.credit) {
    html += '<p class="project-credit">' + escapeHtml(project.credit) + '</p>';
  }

  if (project.year) {
    html += '<p class="project-year">' + escapeHtml(project.year) + '</p>';
  }

  html += '</div>';

  if (project.images && project.images.length) {
    html += '<div class="project-images">';
    project.images.forEach(function (src) {
      html += '<img src="' + imageBasePath + src + '" alt="">';
    });
    html += '</div>';
  }

  container.innerHTML = html;

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
})();
