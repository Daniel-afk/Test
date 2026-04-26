/**
 * Minimal hash-based client-side router.
 *
 * Public API
 *   Router.registerRoute(pattern, handler)  – register a route
 *   Router.navigate(path)                   – change the hash and run the handler
 *   Router.getCurrentRoute()                – { path, pattern, params, query }
 *   Router.start()                          – begin listening; resolves current hash
 *   Router.onNotFound(handler)              – fallback when no pattern matches
 *
 * Pattern syntax
 *   Static  : '/dashboard'
 *   Param   : '/vendors/:id'
 *   Mixed   : '/dept/:deptId/vendors/:id'
 *
 * Handler signature
 *   handler({ params, query })
 *   params – object of :name captures (string values)
 *   query  – object parsed from the URL query string
 */
const Router = (() => {
  const _routes = [];
  let _notFoundHandler = () => {};
  let _current = null;

  /* ── helpers ──────────────────────────────────────────────── */

  function _parseQuery(qs) {
    const out = {};
    if (!qs) return out;
    new URLSearchParams(qs).forEach((v, k) => { out[k] = v; });
    return out;
  }

  function _matchPattern(pattern, path) {
    const pp = pattern.split('/').filter(Boolean);
    const rp = path.split('/').filter(Boolean);
    if (pp.length !== rp.length) return null;

    const params = {};
    for (let i = 0; i < pp.length; i++) {
      if (pp[i][0] === ':') {
        params[pp[i].slice(1)] = decodeURIComponent(rp[i]);
      } else if (pp[i] !== rp[i]) {
        return null;
      }
    }
    return params;
  }

  function _resolve() {
    // window.location.hash is e.g. "#/vendors/42?q=foo"
    const raw  = window.location.hash.slice(1) || '/dashboard';
    const sep  = raw.indexOf('?');
    const path = (sep === -1 ? raw : raw.slice(0, sep)) || '/dashboard';
    const query = _parseQuery(sep === -1 ? '' : raw.slice(sep + 1));

    for (const { pattern, handler } of _routes) {
      const params = _matchPattern(pattern, path);
      if (params !== null) {
        _current = { path, pattern, params, query };
        handler({ params, query });
        return;
      }
    }

    _current = { path, pattern: null, params: {}, query };
    _notFoundHandler({ path, params: {}, query });
  }

  /* ── public API ───────────────────────────────────────────── */

  return {
    registerRoute(pattern, handler) {
      _routes.push({ pattern, handler });
    },

    navigate(path) {
      // If hash is already the target, hashchange won't fire — resolve manually.
      if (window.location.hash === '#' + path) {
        _resolve();
      } else {
        window.location.hash = path;
      }
    },

    getCurrentRoute() {
      return _current ? { ..._current } : null;
    },

    onNotFound(handler) {
      _notFoundHandler = handler;
    },

    start() {
      window.addEventListener('hashchange', _resolve);
      _resolve();
    },
  };
})();
