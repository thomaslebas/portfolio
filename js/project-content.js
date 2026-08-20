// Parses a project markdown file (content/<contentDir>/<slug>.md) into a
// generic block schema (meta, intro, stats, heading, paragraph, image, list,
// note) rendered by js/project.js. Used by both Case studies
// (content/case-studies/) and Side quests (content/side-projects/).
// Convention:
//
//   # Title
//
//   Subline: short line shown below the title, both on the project page
//   Year: 2025 — shown on the grid thumbnail, and prepended to Meta on the
//   project page (e.g. "2025 · Design Vision · Product Strategy")
//   Meta: line shown below the subline, on the project page only
//
// (Subline also doubles as the grid card's descriptor on the listing pages.
// Write Subline, then Year, then Meta — in that order — so they combine and
// render correctly.)
//
//   Intro paragraph(s)
//
//   Stats:
//   - highlight one
//   - highlight two
//
//   ## Section heading
//
//   Paragraph text.
//
//   ![Caption text for that image.](slug) — defaults to .jpg; give an
//   extension yourself (e.g. slug.png) to use a different format
//
//   - Outcome bullet one
//   - Outcome bullet two
//
//   > Closing note text
//
// **bold** and [link text](https://url) are left as-is; js/project.js
// already converts them to <strong> and <a> at render time.

function parseProjectMarkdown(text, slug, contentDir) {
  var lines = text.replace(/\r\n/g, '\n').split('\n');
  var i = 0;
  var title = '';
  var descriptor = '';
  var year = '';
  var body = [];
  var inSection = false;

  function isBlank(line) {
    return line.trim() === '';
  }

  function skipBlankLines() {
    while (i < lines.length && isBlank(lines[i])) i++;
  }

  function collectPlainLines() {
    var collected = [];
    while (i < lines.length && !isBlank(lines[i])) {
      collected.push(lines[i].trim());
      i++;
    }
    return collected.join(' ');
  }

  while (i < lines.length) {
    skipBlankLines();
    if (i >= lines.length) break;

    var line = lines[i];

    if (!title && /^#\s+/.test(line)) {
      title = line.replace(/^#\s+/, '').trim();
      i++;
      continue;
    }

    if (/^##\s+/.test(line)) {
      inSection = true;
      body.push({ type: 'heading', text: line.replace(/^##\s+/, '').trim() });
      i++;
      continue;
    }

    if (/^Meta:\s*/.test(line)) {
      var metaText = line.replace(/^Meta:\s*/, '').trim();
      body.push({ type: 'meta', text: year ? year + ' · ' + metaText : metaText });
      i++;
      continue;
    }

    if (/^Subline:\s*/.test(line)) {
      descriptor = line.replace(/^Subline:\s*/, '').trim();
      body.push({ type: 'subline', text: descriptor });
      i++;
      continue;
    }

    if (/^Year:\s*/.test(line)) {
      year = line.replace(/^Year:\s*/, '').trim();
      i++;
      continue;
    }

    if (/^Stats:\s*$/.test(line.trim())) {
      i++;
      skipBlankLines();
      var statsItems = [];
      while (i < lines.length && /^-\s+/.test(lines[i])) {
        statsItems.push(lines[i].replace(/^-\s+/, '').trim());
        i++;
      }
      body.push({ type: 'stats', items: statsItems });
      continue;
    }

    var imageMatch = line.match(/^!\[(.*)\]\((.+?)\)\s*$/);
    if (imageMatch) {
      var caption = imageMatch[1].trim();
      var imageSlug = imageMatch[2].trim();
      var imageFile = /\.[a-zA-Z0-9]+$/.test(imageSlug) ? imageSlug : imageSlug + '.jpg';
      i++;
      body.push({
        type: 'image',
        src: 'images/' + contentDir + '/' + slug + '/' + imageFile,
        caption: caption
      });
      continue;
    }

    if (/^-\s+/.test(line)) {
      var listItems = [];
      while (i < lines.length && /^-\s+/.test(lines[i])) {
        listItems.push(lines[i].replace(/^-\s+/, '').trim());
        i++;
      }
      body.push({ type: 'list', items: listItems });
      continue;
    }

    if (/^>\s?/.test(line)) {
      var noteLines = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        noteLines.push(lines[i].replace(/^>\s?/, '').trim());
        i++;
      }
      body.push({ type: 'note', text: noteLines.join(' ') });
      continue;
    }

    var paragraph = collectPlainLines();
    body.push({ type: inSection ? 'paragraph' : 'intro', text: paragraph });
  }

  return { title: title, descriptor: descriptor, year: year, body: body };
}

function resolveProjectContent(entry, contentDir) {
  if (!entry || !entry.slug) {
    return Promise.resolve(entry);
  }

  return fetch('content/' + contentDir + '/' + entry.slug + '.md')
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Failed to load project content: ' + contentDir + '/' + entry.slug);
      }
      return response.text();
    })
    .then(function (text) {
      return parseProjectMarkdown(text, entry.slug, contentDir);
    });
}
