# Houston Spending Tracker — Phase 1 Audit

Audited branch: `claude/houston-spending-tracker-a7fCp`  
Commit: `5b490f3`  
Date: 2026-04-25

---

## Feature 1: Live Ticker Bar

- **Status:** NOT_STARTED

- **Evidence:**
  - No ticker, marquee, or horizontal-scroll element exists in `index.html` or `login.html`.
  - Searched all `.js`, `.html`, `.css` files for `ticker`, `marquee`, `scroll`, `pin`, `pause`, `anomaly`, `flag`, `donor` — zero matches beyond `scrollIntoView` at `app.js:247` (unrelated smooth-scroll on news tag click).
  - The `<header>` in `index.html:22–35` is the only sticky/pinned element; it contains only branding and user info.

- **Gaps:**
  - No HTML element for the bar (sticky, pinned, sitewide).
  - No CSS for right-to-left animation, pause-on-hover, or pinned state.
  - No data model for ticker items (type, message, link, timestamp).
  - No logic to generate ticker events from contracts, anomaly flags, big payments, or donor-contractor matches.
  - No anomaly detection anywhere in the codebase to feed the ticker.
  - No donor-contractor match dataset or logic.
  - No detail-view pages for ticker items to link to.
  - `login.html` would also need the ticker injected or replicated.

- **Risk flags:**
  - The ticker requires anomaly detection (Feature 3) and vendor profiles (Feature 2) to be meaningful. Building it before those features means either stub data or a second pass.
  - Sitewide injection across multiple HTML files (`index.html`, `login.html`, and future pages) requires either a shared JS component or templating — neither pattern exists yet.

---

## Feature 2: Vendor Profile Pages

- **Status:** NOT_STARTED

- **Evidence:**
  - Only two HTML files exist: `index.html` and `login.html`. No `vendor.html` or `vendors/` directory.
  - Vendor data is a flat string field on transaction objects: `data.js:98` (`vendor: _pick(_VENDORS)`) and `data.js:160` (`vendor: (rec.vendor_name || ...).trim()`).
  - `_VENDORS` at `data.js:52–61` is a plain `string[]` — no IDs, no metadata.
  - Vendor is displayed in the transactions table (`app.js:334–336`, `index.html:134`) and redacted for public role, but there are no links and no per-vendor aggregation.
  - No routing logic anywhere: `window.location` is only used for auth redirects (`auth.js:60`, `auth.js:73`).

- **Gaps:**
  - No stable vendor ID — current mock data assigns vendor names randomly; live CKAN data maps raw strings with no slug/ID.
  - No vendor profile page (`vendor.html` or equivalent).
  - No client-side router to handle `/vendors/[vendor-id]` routes.
  - No per-vendor aggregation: total city revenue, year-over-year change, contract list.
  - No M/WBE status field in the transaction data model (`data.js:92–103`, `data.js:154–165`).
  - No parent company / executive fields.
  - No external link-out logic (Texas SOS, OpenCorporates).
  - Vendor names in the table are not hyperlinks (`app.js:334–336`).

- **Risk flags:**
  - Adding vendor IDs requires a data model change affecting both mock generation (`data.js:75–107`) and CKAN mapping (`data.js:142–165`), and the CSV export header row (`app.js:254`).
  - A client-side router (hash or History API) needs to be chosen and introduced before this feature can exist. The current auth redirect pattern (`window.location.href = 'login.html'`) will conflict with a SPA router if not refactored.
  - M/WBE, parent, and exec data do not exist in the Houston CKAN checkbook dataset; they would require a separate data source or manual enrichment layer.

---

## Feature 3: Anomaly Feed

- **Status:** NOT_STARTED

- **Evidence:**
  - No anomaly-related logic in any file. Grep for `anomal`, `flag`, `threshold`, `change.order`, `sole.source`, `no.bid`, `first.year`, `new.vendor` returned zero results across all source files.
  - `DEPT_KEYWORDS` at `data.js:38–49` performs keyword matching on news articles only — it is not anomaly detection.
  - The transaction data model (`data.js:92–103`) has no `contractId`, `originalAmount`, `awardType`, or `vendorAgeMonths` fields needed by the three starter rules.

- **Gaps:**
  - No anomaly detection engine for any of the three rules:
    - (a) Change orders >25% over original contract — requires contract ID, original amount, and amendment records; none modelled.
    - (b) Sole-source / no-bid awards — requires award type field; not in data model or CKAN mapping.
    - (c) New vendors receiving >$500K in first year — requires vendor first-seen date and per-vendor annual sum; no such computation exists.
  - No dedicated anomaly feed page.
  - No anomaly data structure (item type, severity, rule triggered, linked transaction).
  - No connection between anomaly items and the ticker bar (Feature 1).
  - CKAN checkbook dataset does not expose `award_type` or `contract_amendment` fields as currently mapped (`data.js:142–165`); additional API endpoints or datasets would be required.

- **Risk flags:**
  - All three starter rules require fields that are absent from the current transaction model and are not present in the checkbook CKAN data as mapped. Sourcing this data (Houston procurement contracts dataset, amendment records) is a prerequisite, not just a UI task.
  - Anomaly computation over 300–500 records is feasible client-side, but any rule involving historical comparison (new vendor detection, YoY change) requires aggregating across more data than the current 500-row CKAN limit (`data.js:207`).

---

## Feature 4: Saved Searches + Permalinks

- **Status:** NOT_STARTED

- **Evidence:**
  - Filter state is held entirely in JS variables and DOM values:
    - `sortCol`, `sortDir`, `currentPage` — module-level `let` at `app.js:271–273`.
    - `searchInput`, `deptFilter`, `categoryFilter` — read directly from DOM in `applyFilters()` at `app.js:291–300`.
  - `window.location` is referenced only in `auth.js:60` and `auth.js:73` for auth redirects. No `URLSearchParams`, `history.pushState`, `location.hash`, or `location.search` exists anywhere.
  - No "Copy link" button in `index.html` — the table controls section (`index.html:117–127`) contains only `searchInput`, `deptFilter`, `categoryFilter`, and the hidden `exportBtn`.
  - No permalink generation or URL serialisation function in `app.js` or `data.js`.

- **Gaps:**
  - No URL serialisation: filter state (`q`, `dept`, `cat`, `sort`, `dir`, `page`) is never written to the URL.
  - No URL deserialisation: page load never reads URL params to restore filter state.
  - No "Copy link" button or clipboard API call.
  - No stable URL structure defined for any filtered view.
  - Filter state is lost on reload (`sessionStorage` holds only the auth session, not filter state — `auth.js:38`).

- **Risk flags:**
  - Low implementation risk for the transactions table: `URLSearchParams` + `history.replaceState` can be wired into `applyFilters()` (`app.js:291`) and `renderTable()` (`app.js:315`) without structural changes.
  - The auth gate (`Auth.requireAuth()` at `app.js:2`) redirects to `login.html` before any URL params are read, meaning filter params in the URL will survive a direct paste only if the user is already authenticated in `sessionStorage`. A post-login redirect back to the original URL will be needed.
  - Chart and department breakdown sections have no filter state to serialize, so "every filter view" from the spec applies primarily to the transactions table.

---

## Feature 5: CSV Export

- **Status:** PARTIAL

- **Evidence — what exists:**
  - `exportCSV(txns)` at `app.js:253–265`: complete implementation — builds a CSV string with headers `['Date','Department','Vendor','Category','Description','Amount']`, creates a Blob, triggers a download link.
  - Export button `#exportBtn` at `index.html:125`: present in the transactions table controls, initially `hidden`.
  - Filter-aware export wiring at `app.js:422–425`: button is shown only to `admin`/`analyst` roles and calls `exportCSV(filteredTxns.length ? filteredTxns : ALL_TXNS)` — i.e., exports the current filtered view, not the full dataset.
  - Sort state is also reflected: `filteredTxns` is the output of `sortList(applyFilters())` via `renderTable()` at `app.js:315–318`.

- **Gaps:**
  - Export is gated behind `CAN_EXPORT` (`app.js:422`), which is `true` only for `admin` and `analyst`. The spec does not mention a role restriction — "every data table" implies public access too.
  - Only one table (transactions) has an export button. The spec requires "every data table." Currently unexported views:
    - Department breakdown grid (`index.html:99–102`) — aggregated spend per department.
    - Summary cards / budget vs. actual figures (`index.html:46–71`).
    - Monthly trend data (`MONTHLY_SPENT` / `MONTHLY_BUDGET` arrays at `data.js:34–35`).
  - No filename includes filter context (e.g., department or date range) — filename is always `houston-spending-YYYY-MM-DD.csv` (`app.js:261`).
  - Pagination does not affect export (correct per spec), but this is not documented or tested.

- **Risk flags:**
  - Exposing export to the `public` role conflicts with the existing redaction logic: `exportCSV` at `app.js:255` exports raw `t.vendor`, but public viewers have vendor names redacted in the table (`app.js:334–336`). The export function would need to respect `CAN_SEE_VENDORS` before the role gate is removed.
  - Adding export to additional tables (department grid, trend chart) requires each section to have its own data serialiser; those sections currently render directly to DOM with no retained structured data reference.

---

## Stack summary

| Concern | Detail |
|---|---|
| **Framework** | None — vanilla HTML/CSS/JS, no build framework |
| **Runtime** | Browser-only static files; Chart.js 4.4.0 via CDN (`index.html:8`) |
| **Routing** | None — two separate `.html` files (`index.html`, `login.html`); no SPA router; navigation is `window.location.href` hard redirects only (`auth.js:60,73`) |
| **Styling** | Vanilla CSS — single `styles.css` (~902 lines), CSS custom properties, no preprocessor or utility framework |
| **State management** | Module-level `let` variables in `app.js` (`ALL_TXNS`, `filteredTxns`, `sortCol`, `sortDir`, `currentPage`); session in `sessionStorage` via `auth.js`; no reactive state library |
| **Data — live spending** | Houston Open Finance Portal CKAN API (`openfinance.houstontx.gov/api/3/action/datastore_search`) — checkbook dataset; tried first, falls back to mock on any error (`data.js:167–216`) |
| **Data — live news** | RSS feeds (ABC13, KHOU 11, Click2Houston) via `allorigins.win` CORS proxy; first successful feed wins; falls back to empty array (`data.js:218–272`) |
| **Data — mock** | `generateTransactions(300)` in `data.js:75–107` — random data used when CKAN API is unreachable |
| **Auth** | Client-side only — hardcoded credentials in `auth.js:2–24`, `sessionStorage` session; three roles: `admin`, `analyst`, `public` |
| **Build command** | None — no `package.json`, no bundler, no transpilation |
| **Dev server command** | `python3 -m http.server 8080` or `npx serve . -p 8080` (run from `/home/user/Test`) |
| **Pages** | `index.html` (dashboard), `login.html` (auth) — no other pages |
