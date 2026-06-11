function getProjectSortYear(year) {
  if (!year) return 0;

  var range = year.match(/^(\d{4})[–-](\d{2,4})$/);
  if (range) {
    var end = range[2];
    if (end.length === 2) {
      end = range[1].slice(0, 2) + end;
    }
    return parseInt(end, 10);
  }

  var matches = year.match(/\d{4}/g);
  if (!matches) return 0;

  return Math.max.apply(null, matches.map(function (y) {
    return parseInt(y, 10);
  }));
}

function sortProjectsByYear(projects) {
  return projects.slice().sort(function (a, b) {
    return getProjectSortYear(b.year) - getProjectSortYear(a.year);
  });
}
