(function () {
  var AUTH_KEY = 'case-studies-auth';
  var config = window.caseStudiesAuthConfig || {};
  var passwordHash = config.PASSWORD_HASH || '';

  function isAuthenticated() {
    return sessionStorage.getItem(AUTH_KEY) === 'true';
  }

  function setAuthenticated() {
    sessionStorage.setItem(AUTH_KEY, 'true');
  }

  function hashPassword(password) {
    var encoded = new TextEncoder().encode(password);
    return crypto.subtle.digest('SHA-256', encoded).then(function (buffer) {
      return Array.from(new Uint8Array(buffer))
        .map(function (b) { return b.toString(16).padStart(2, '0'); })
        .join('');
    });
  }

  function verifyPassword(password) {
    return hashPassword(password).then(function (hash) {
      return hash === passwordHash;
    });
  }

  function renderGate(container, onSuccess) {
    container.innerHTML =
      '<div class="auth-gate">' +
        '<h1 class="page-heading">Case studies</h1>' +
        '<p class="auth-gate-intro">This section is password protected.</p>' +
        '<form class="auth-gate-form" id="auth-gate-form">' +
          '<label class="auth-gate-label" for="auth-password">Password</label>' +
          '<input class="auth-gate-input" type="password" id="auth-password" name="password" autocomplete="current-password" required>' +
          '<p class="auth-gate-error" id="auth-gate-error" hidden>Incorrect password. Please try again.</p>' +
          '<button class="auth-gate-submit" type="submit">Enter</button>' +
        '</form>' +
      '</div>';

    var form = document.getElementById('auth-gate-form');
    var input = document.getElementById('auth-password');
    var error = document.getElementById('auth-gate-error');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      error.hidden = true;

      verifyPassword(input.value).then(function (valid) {
        if (!valid) {
          error.hidden = false;
          input.value = '';
          input.focus();
          return;
        }

        setAuthenticated();
        onSuccess();
      });
    });

    input.focus();
  }

  window.caseStudiesAuth = {
    isAuthenticated: isAuthenticated,

    requireAuth: function (contentEl, onReady) {
      if (!passwordHash) {
        contentEl.hidden = false;
        if (onReady) onReady();
        return;
      }

      if (isAuthenticated()) {
        contentEl.hidden = false;
        if (onReady) onReady();
        return;
      }

      var main = contentEl.closest('main') || contentEl.parentElement;
      renderGate(main, function () {
        main.innerHTML = '';
        main.appendChild(contentEl);
        contentEl.hidden = false;
        if (onReady) onReady();
      });
    },

    guardProjectSource: function (source) {
      if (source !== 'case-studies' || isAuthenticated() || !passwordHash) return true;
      window.location.replace('case-studies.html');
      return false;
    }
  };
})();
