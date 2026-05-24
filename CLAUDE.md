# Houston Spending Tracker — CLAUDE.md

## Project overview

Static, no-build, vanilla HTML/CSS/JS web app that displays City of Houston
government spending for fiscal year 2025–2026. Fetches live data from the
Houston Open Finance Portal (CKAN API) with a mock-data fallback. Three
user roles with different data visibility.

**Live demo branch:** `claude/houston-spending-tracker-a7fCp`

---

## Repository layout

```
index.html          Main dashboard (requires auth)
login.html          Login page
auth.js             Client-side auth, sessionStorage, RBAC
data.js             Data layer: CKAN API, news RSS, mock generator
app.js              Rendering, charts, table, filters, CSV export
router.js           Minimal hash-based client-side router (standalone utility)
styles.css          All styles (~900 lines), CSS custom properties
tests/
  router.test.html  Browser-runnable smoke tests for router.js
AUDIT_PHASE1.md     Detailed gap analysis of Phase 1 features
```

No `package.json`, no bundler, no transpilation. Zero npm dependencies.

---

## Running the app

```bash
# Any of these work — serve from the repo root
python3 -m http.server 8080
npx serve . -p 8080
npx http-server . -p 8080
```

Then open `http://localhost:8080/login.html`.

---

## Demo credentials

| Username  | Password        | Role          | Capabilities                                      |
|-----------|-----------------|---------------|---------------------------------------------------|
| `admin`   | `houston@2026`  | Administrator | All data, vendor names, CSV export, admin banner  |
| `analyst` | `analyst@2026`  | Budget Analyst| All data, vendor names, CSV export                |
| `public`  | `public@2026`   | Public Viewer | Charts/summaries; vendor names redacted; 50 rows max |

Credentials are hardcoded in `auth.js:2–24`. **Do not use these in production.**

---

## Architecture

### No framework, no SPA (yet)

The app is two separate HTML pages. Navigation between them uses
`window.location.href` hard redirects in `auth.js:60,73`. `router.js`
exists and is committed but is **not wired into either page** — it was
added in preparation for future vendor profile pages.

### Script load order in `index.html`

```html
<script src="auth.js"></script>   <!-- must be first; defines Auth -->
<script src="data.js"></script>   <!-- defines DEPARTMENTS, CATEGORIES, SpendingAPI, NewsAPI -->
<script src="router.js"></script> <!-- defines Router; not yet used by app.js -->
<script src="app.js"></script>    <!-- runs init() immediately; depends on above globals -->
```

`app.js` runs `init()` at module scope (last line). All global names from
earlier scripts must exist before it loads.

### State management

All mutable app state lives as module-level `let` variables in `app.js`:

| Variable         | Line | Meaning                              |
|------------------|------|--------------------------------------|
| `ALL_TXNS`       | 273  | Full transaction array after API load|
| `filteredTxns`   | 272  | Output of last `sortList(applyFilters())` call |
| `currentPage`    | 271  | Current pagination page (1-indexed)  |
| `sortCol`        | 274  | Active sort column key               |
| `sortDir`        | 275  | `'asc'` or `'desc'`                  |

Auth session is in `sessionStorage` under the key `hou_tracker_session`
(see `auth.js:38`).

### Role-based access control

Three permission flags are evaluated once at startup (`app.js:39–41`):

```js
const CAN_SEE_VENDORS = Auth.can(SESSION, 'view_vendors');
const CAN_EXPORT      = Auth.can(SESSION, 'export_data');
const CAN_ALL_RECORDS = Auth.can(SESSION, 'view_all_records');
```

`public` role has none of these. Vendor cells are replaced with
`<span style="...">Redacted</span>` at `app.js:334`. Row count is
capped at `PUBLIC_ROW_LIMIT = 50` at `app.js:44`.

### Data sources

**Spending (CKAN)**
- Primary: `https://openfinance.houstontx.gov/api/3/action`
- Fallback: `https://data.houstontx.gov/api/3/action`
- Dataset: `checkbook` package → most-recent `datastore_active` resource
- Fetches up to 500 records sorted by `check_date desc`
- Implemented in `SpendingAPI` object in `data.js:167–216`
- Falls back to `generateTransactions(300)` on any error

**News (RSS)**
- Three feeds tried in order: ABC13 Houston, KHOU 11, Click2Houston
- Proxied through `https://api.allorigins.win/get?url=…` (CORS workaround)
- Articles tagged to departments via keyword match in `DEPT_KEYWORDS` (`data.js:38–49`)
- Implemented in `NewsAPI` object in `data.js:218–272`
- Falls back to empty array

**Mock generator**
- `generateTransactions(count)` in `data.js:75–107`
- Used when CKAN is unreachable
- Produces randomised transactions across all 10 departments and 6 categories

### Charts

Chart.js 4.4.0 loaded from CDN (`index.html:8`). Four charts:
- `deptChart` — grouped bar, budget vs. spent per department
- `allocChart` — doughnut, spending by category
- `trendChart` — line, monthly spending vs. budget
- `zipChart` — horizontal bar, top 10 ZIP codes by spend (stored as
  `window._zipChart` and destroyed before re-render — see `app.js:159`)

---

## Key conventions

### Formatting money

Always use `fmtMoney(n)` for compact display ($1.2M) and `fmtMoneyFull(n)`
for full precision in the transactions table (`app.js:47–53`).

### Filter / render cycle

```
applyFilters()        reads DOM filter values → returns filtered array
sortList(txns)        sorts by sortCol/sortDir → returns new array
renderTable(list)     renders pagination slice to #tableBody
renderZipBreakdown(txns)  rebuilds zip chart + table for current view
```

Whenever filters change, the `refresh()` closure at `app.js:424` calls
both `renderTable` and `renderZipBreakdown` so they stay in sync.

### Adding a new filter

1. Add a `<select>` or `<input>` element to `index.html` (inside `.table-controls`)
2. Populate options in `populateFilters()` (`app.js:278–300`)
3. Add the guard to `applyFilters()` (`app.js:291–300`)
4. Wire the `change`/`input` listener in `init()` (`app.js:419–424`)

### Adding a new department

Edit `DEPARTMENTS` array in `data.js:2–13`. The entry needs:
```js
{ id: 'short-id', name: 'Display Name', icon: '🏛️', color: '#hex', budget: 123e6 }
```
Also add keywords to `DEPT_KEYWORDS` at `data.js:38–49`.

### Adding a new spending category

Add to the `CATEGORIES` array (`data.js:15–22`) and `CATEGORY_COLORS`
object (`data.js:24–31`). Update `_DESCRIPTIONS` in the mock generator
(`data.js:66–73`) and the `_mapCategory` regex in `data.js:122–130`.

### CSS custom properties

All design tokens are at the top of `styles.css`. Key variables:
- `--blue`, `--blue-dark` — primary brand colours
- `--gray-1` through `--gray-5` — text hierarchy
- `--card-shadow`, `--radius` — card styling
- `--header-h` — sticky header height (used in scroll offsets)

---

## Testing

Tests live in `tests/router.test.html`. Open it in a browser directly:

```
http://localhost:8080/tests/router.test.html
```

It runs 11 assertions against `router.js` and prints pass/fail inline.
There is no CLI test runner — browser-only.

There are no tests for `auth.js`, `data.js`, or `app.js`. Before adding
features, confirm the router tests still pass.

---

## Phase 1 feature status (as of 2026-04-26)

| Feature                      | Status       | Key gap                                              |
|------------------------------|--------------|------------------------------------------------------|
| Live ticker bar              | NOT_STARTED  | Needs anomaly engine + sitewide injection pattern    |
| Vendor profile pages         | NOT_STARTED  | Needs stable vendor IDs, router integration, new page|
| Anomaly feed                 | NOT_STARTED  | Needs fields not in CKAN checkbook dataset           |
| Saved searches / permalinks  | NOT_STARTED  | Filter state never written to URL                    |
| CSV export                   | PARTIAL      | Works for admin/analyst; not all tables; no role-safe vendor handling for public |

See `AUDIT_PHASE1.md` for full detail and risk flags per feature.

---

## Known constraints / gotchas

- **No build step** — changes to any `.js` or `.css` file are live immediately.
  Do not introduce ES modules (`import`/`export`) without also adding a bundler.

- **Script globals** — `auth.js`, `data.js`, and `router.js` expose their
  APIs as globals (`Auth`, `SpendingAPI`, `NewsAPI`, `Router`, `DEPARTMENTS`,
  etc.). Do not shadow these names in `app.js`.

- **Chart re-render** — Chart.js throws "Canvas already in use" if you call
  `new Chart(canvas, …)` on a canvas that already has an instance. Only
  `zipChart` (which re-renders on filter change) handles this with
  `window._zipChart.destroy()`. Any new re-renderable chart must do the same.

- **CORS proxy** — `NewsAPI` uses `allorigins.win` as a CORS proxy. This is
  fine for a demo but unreliable for production. The proxy URL is
  `data.js:219`.

- **Auth is client-side only** — `auth.js` credentials are in plain JS source
  and `sessionStorage` provides no real security. The comment at `auth.js:1`
  says to replace with a real backend.

- **Public row limit** — `PUBLIC_ROW_LIMIT = 50` at `app.js:44` caps the
  visible rows for the public role but does not cap the data sent over the
  wire. All 300–500 records are fetched and filtered client-side.

- **Router not integrated** — `router.js` is loaded in `index.html:11` but
  `app.js` never calls `Router.registerRoute()` or `Router.start()`. The
  auth redirect pattern (`window.location.href = 'login.html'`) will need
  refactoring before the router can take over navigation.

- **ZIP chart instance** — stored on `window._zipChart` (not a module variable)
  because `renderZipBreakdown` is called from `refresh()` which is a closure
  inside `init()`. This is a quirk, not a pattern to follow elsewhere.
