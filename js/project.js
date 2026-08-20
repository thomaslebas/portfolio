(function () {
  var params = new URLSearchParams(window.location.search);
  var source = params.get('source');
  var id = parseInt(params.get('id'), 10);

  var backUrls = {
    archive: 'archive.html',
    'side-projects': 'side-projects.html',
    'case-studies': 'case-studies.html'
  };

  var backLabels = {
    archive: 'Archive',
    'side-projects': 'Side quests',
    'case-studies': 'Case studies'
  };

  var collections = {
    archive: sortProjectsByYear(typeof archiveProjects !== 'undefined' ? archiveProjects : []),
    'side-projects': typeof sideProjects !== 'undefined' ? sideProjects : [],
    'case-studies': typeof caseStudies !== 'undefined' ? caseStudies : []
  };

  var imageBasePaths = {
    archive: 'images/archive/',
    'side-projects': 'images/archive/',
    'case-studies': 'images/case-studies/'
  };

  if (!source || !collections[source] || isNaN(id) || id < 0 || id >= collections[source].length) {
    window.location.replace('archive.html');
    return;
  }

  if (typeof caseStudiesAuth !== 'undefined' && !caseStudiesAuth.guardProjectSource(source)) {
    return;
  }

  var container = document.getElementById('project-detail');
  var imageBasePath = imageBasePaths[source];
  var entry = collections[source][id];

  resolveProjectContent(entry, source).then(renderProject);

  function renderProject(project) {
    document.title = project.title + ' — Thomas Le Bas';

    var html = '<span class="project-back-cell"><a class="project-back" href="' + backUrls[source] + '"><span class="project-back-arrow" aria-hidden="true">←</span> ' + backLabels[source] + '</a></span>';

    if (project.body && project.body.length) {
      var headBlocks = project.body.filter(function (block) {
        return block.type === 'meta';
      });
      var restBlocks = project.body.filter(function (block) {
        return block.type !== 'subline' && block.type !== 'meta';
      });

      html += '<div class="project-content">';
      html += '<h1 class="project-title">' + escapeHtml(project.title) + '</h1>';
      html += renderBody(headBlocks);
      html += '</div>';
      html += '<div class="project-body">' + renderBody(restBlocks) + '</div>';
    } else {
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
    }

    container.innerHTML = html;
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function renderInline(text) {
    var escaped = escapeHtml(text);
    escaped = escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    escaped = escaped.replace(/(?<!!)\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
    return escaped;
  }

  function renderBody(body) {
    var out = '';

    body.forEach(function (block) {
      switch (block.type) {
        case 'subline':
          out += '<p class="project-subline">' + renderInline(block.text) + '</p>';
          break;
        case 'meta':
          out += '<p class="project-meta">' + renderInline(block.text) + '</p>';
          break;
        case 'intro':
          out += '<p class="project-intro">' + renderInline(block.text) + '</p>';
          break;
        case 'stats':
          out += '<div class="project-stats">';
          (block.items || []).forEach(function (item) {
            out += '<p class="project-stat">' + renderInline(item) + '</p>';
          });
          out += '</div>';
          break;
        case 'heading':
          out += '<h2 class="project-subheading">' + renderInline(block.text) + '</h2>';
          break;
        case 'paragraph':
          out += '<p class="project-paragraph">' + renderInline(block.text) + '</p>';
          break;
        case 'image':
          out += '<figure class="project-figure">';
          out += '<img src="' + block.src + '" alt="' + escapeHtml(block.caption || '') + '">';
          if (block.caption) {
            out += '<figcaption class="project-caption">' + renderInline(block.caption) + '</figcaption>';
          }
          out += '</figure>';
          break;
        case 'list':
          out += '<ul class="project-list">';
          (block.items || []).forEach(function (item) {
            out += '<li>' + renderInline(item) + '</li>';
          });
          out += '</ul>';
          break;
        case 'note':
          out += '<p class="project-note">' + renderInline(block.text) + '</p>';
          break;
      }
    });

    return out;
  }
})();
