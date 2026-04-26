/* ── Auth gate ────────────────────────────────────────────── */
const SESSION = Auth.requireAuth();
if (!SESSION) throw new Error('Not authenticated');

/* ── Render user info ─────────────────────────────────────── */
(function renderUserInfo() {
  const meta = Auth.roleMeta(SESSION.role);
  document.getElementById('userInfo').innerHTML = `
    <div class="user-avatar">${SESSION.name.charAt(0)}</div>
    <div class="user-details">
      <div class="user-name">${SESSION.name}</div>
      <div class="user-email">${SESSION.email}</div>
    </div>
    <span class="role-badge" style="color:${meta.color};background:${meta.bg};border-color:${meta.color}40">
      ${meta.label}
    </span>
    <button class="logout-btn" id="logoutBtn">Sign Out</button>
  `;
  document.getElementById('logoutBtn').addEventListener('click', () => Auth.logout());
})();

/* ── Access notice ────────────────────────────────────────── */
(function renderAccessNotice() {
  const el = document.getElementById('accessNotice');
  if (SESSION.role === 'admin') {
    el.innerHTML = `<div class="access-notice notice-admin">
      Administrator access — full data visibility, vendor names, and CSV export enabled.
    </div>`;
  } else if (SESSION.role === 'public') {
    el.innerHTML = `<div class="access-notice notice-info">
      Public viewer access — vendor names are redacted. Sign in as an analyst or administrator for full details.
    </div>`;
  }
})();

/* ── Permissions ──────────────────────────────────────────── */
const CAN_SEE_VENDORS = Auth.can(SESSION, 'view_vendors');
const CAN_EXPORT      = Auth.can(SESSION, 'export_data');
const CAN_ALL_RECORDS = Auth.can(SESSION, 'view_all_records');
const PUBLIC_ROW_LIMIT = 50;

/* ── Formatters ───────────────────────────────────────────── */
function fmtMoney(n) {
  if (Math.abs(n) >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
  if (Math.abs(n) >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M';
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtMoneyFull(n) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* ── Summary ──────────────────────────────────────────────── */
function renderSummary(txns) {
  const totalBudget = DEPARTMENTS.reduce((s, d) => s + d.budget, 0);
  const totalSpent  = txns.reduce((s, t) => s + t.amount, 0);
  const remaining   = totalBudget - totalSpent;
  const pct         = (totalSpent / totalBudget * 100).toFixed(1);

  document.getElementById('totalBudget').textContent = fmtMoney(totalBudget);
  document.getElementById('totalSpent').textContent  = fmtMoney(totalSpent);
  document.getElementById('remaining').textContent   = fmtMoney(remaining);
  document.getElementById('percentUsed').textContent = pct + '%';
  document.getElementById('progressFill').style.width = Math.min(pct, 100) + '%';
}

/* ── Data source bar ──────────────────────────────────────── */
function renderDataSourceBar(spendingSource, spendingLabel, newsSource, newsFeedName) {
  const bar = document.getElementById('dataSourceBar');
  const spendingIsLive = spendingSource === 'live';
  const newsIsLive     = newsSource === 'live';

  bar.innerHTML = `
    <div class="data-source-bar">
      <span class="ds-label">Data sources:</span>
      <span class="ds-pill ${spendingIsLive ? 'ds-live' : 'ds-mock'}">
        ${spendingIsLive ? '● Live' : '○ Demo'} Spending — ${spendingLabel}
      </span>
      <span class="ds-pill ${newsIsLive ? 'ds-live' : 'ds-mock'}">
        ${newsIsLive ? '● Live' : '○ Unavailable'} News${newsIsLive ? ` — ${newsFeedName}` : ''}
      </span>
    </div>
  `;
}

/* ── Charts ───────────────────────────────────────────────── */
function renderDeptChart(deptSpent) {
  const labels  = DEPARTMENTS.map(d => d.name);
  const budgets = DEPARTMENTS.map(d => d.budget / 1e6);
  const spent   = DEPARTMENTS.map(d => (deptSpent[d.id] || 0) / 1e6);
  const colors  = DEPARTMENTS.map(d => d.color);

  new Chart(document.getElementById('deptChart'), {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Budget ($M)', data: budgets, backgroundColor: colors.map(c => c + '33'), borderColor: colors, borderWidth: 2, borderRadius: 4 },
        { label: 'Spent ($M)',  data: spent,   backgroundColor: colors.map(c => c + 'cc'), borderColor: colors, borderWidth: 0, borderRadius: 4 },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { font: { size: 11 } } },
        tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: $${ctx.parsed.y.toFixed(1)}M` } },
      },
      scales: {
        x: { ticks: { font: { size: 10 }, maxRotation: 35 }, grid: { display: false } },
        y: { ticks: { callback: v => '$' + v + 'M', font: { size: 10 } }, grid: { color: '#e8ecf1' } },
      },
    },
  });
}

function renderAllocChart(txns) {
  const catTotals = {};
  CATEGORIES.forEach(c => { catTotals[c] = 0; });
  txns.forEach(t => { catTotals[t.category] += t.amount; });

  const total  = Object.values(catTotals).reduce((a, b) => a + b, 0);
  const labels = Object.keys(catTotals);
  const data   = labels.map(l => catTotals[l]);
  const colors = labels.map(l => CATEGORY_COLORS[l]);

  new Chart(document.getElementById('allocChart'), {
    type: 'doughnut',
    data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 2, borderColor: '#fff', hoverOffset: 6 }] },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '68%',
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${(ctx.parsed / total * 100).toFixed(1)}%` } },
      },
    },
  });

  const legend = document.getElementById('allocLegend');
  labels.forEach((l, i) => {
    const pct = (data[i] / total * 100).toFixed(1);
    const item = document.createElement('div');
    item.className = 'legend-item';
    item.innerHTML = `
      <span class="legend-dot" style="background:${colors[i]}"></span>
      <span class="legend-label">${l}</span>
      <span class="legend-pct">${pct}%</span>
    `;
    legend.appendChild(item);
  });
}

function renderTrendChart() {
  new Chart(document.getElementById('trendChart'), {
    type: 'line',
    data: {
      labels: MONTHLY_LABELS,
      datasets: [
        { label: 'Monthly Budget ($M)', data: MONTHLY_BUDGET, borderColor: '#b0bec5', borderDash: [6,3], borderWidth: 2, pointRadius: 0, fill: false, tension: 0 },
        { label: 'Actual Spending ($M)', data: MONTHLY_SPENT, borderColor: '#1a5fa8', backgroundColor: 'rgba(26,95,168,.08)', borderWidth: 3, pointBackgroundColor: '#1a5fa8', pointRadius: 5, fill: true, tension: 0.35 },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { font: { size: 11 } } },
        tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: $${ctx.parsed.y}M` } },
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
        y: { min: 200, ticks: { callback: v => '$' + v + 'M', font: { size: 11 } }, grid: { color: '#e8ecf1' } },
      },
    },
  });
}

/* ── Department cards ─────────────────────────────────────── */
function renderDeptGrid(deptSpent) {
  const container = document.getElementById('deptGrid');
  DEPARTMENTS.forEach(dept => {
    const spent = deptSpent[dept.id] || 0;
    const pct   = Math.min(spent / dept.budget * 100, 100);
    const card  = document.createElement('div');
    card.className = 'dept-card';
    card.innerHTML = `
      <div class="dept-card-header">
        <div class="dept-icon" style="background:${dept.color}22">${dept.icon}</div>
        <div class="dept-name">${dept.name}</div>
      </div>
      <div class="dept-numbers">
        <span class="spent">${fmtMoney(spent)}</span>
        <span>of ${fmtMoney(dept.budget)}</span>
      </div>
      <div class="dept-bar-bg">
        <div class="dept-bar-fill" style="width:${pct}%;background:${dept.color}"></div>
      </div>
      <div style="font-size:.72rem;color:var(--gray-3);margin-top:4px;">${pct.toFixed(1)}% utilized</div>
    `;
    container.appendChild(card);
  });
}

/* ── ZIP code breakdown ───────────────────────────────────── */
function renderZipBreakdown(txns) {
  const zipMap  = computeZipSpent(txns);
  const entries = Object.values(zipMap).sort((a, b) => b.spent - a.spent);

  // Chart — top 10 by spend
  const top10   = entries.slice(0, 10);
  new Chart(document.getElementById('zipChart'), {
    type: 'bar',
    data: {
      labels:   top10.map(e => e.zip + ' · ' + e.neighborhood),
      datasets: [{ label: 'Total Spent ($M)', data: top10.map(e => +(e.spent / 1e6).toFixed(2)), backgroundColor: '#1a5fa8cc', borderColor: '#1a5fa8', borderWidth: 0, borderRadius: 4 }],
    },
    options: {
      indexAxis: 'y',
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ` $${ctx.parsed.x.toFixed(2)}M` } },
      },
      scales: {
        x: { ticks: { callback: v => '$' + v + 'M', font: { size: 10 } }, grid: { color: '#e8ecf1' } },
        y: { ticks: { font: { size: 10 } }, grid: { display: false } },
      },
    },
  });

  // Table — all ZIPs
  const tbody = document.getElementById('zipTableBody');
  tbody.innerHTML = '';
  entries.forEach(e => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${e.zip}</strong></td>
      <td>${e.neighborhood}</td>
      <td style="text-align:center">${e.count}</td>
      <td class="amount">${fmtMoney(e.spent)}</td>
      <td style="font-size:.78rem;color:var(--gray-3)">${e.topDept}</td>
    `;
    tbody.appendChild(tr);
  });
}

/* ── News section ─────────────────────────────────────────── */
function renderNews(articles) {
  const section = document.getElementById('newsSection');
  if (!articles || articles.length === 0) { section.hidden = true; return; }
  section.hidden = false;

  const grid = document.getElementById('newsGrid');
  grid.innerHTML = '';

  articles.forEach(article => {
    const pubDate = article.pubDate
      ? new Date(article.pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : '';

    const deptTags = article.depts.map(deptId => {
      const dept = DEPARTMENTS.find(d => d.id === deptId);
      if (!dept) return '';
      return `<button class="news-dept-tag" data-dept="${dept.name}"
                style="background:${dept.color}18;color:${dept.color};border-color:${dept.color}40">
                ${dept.icon} ${dept.name}
              </button>`;
    }).join('');

    const card = document.createElement('div');
    card.className = 'news-card';
    card.innerHTML = `
      <div class="news-meta">
        <span class="news-source-name">${article.source}</span>
        ${pubDate ? `<span class="news-date">${pubDate}</span>` : ''}
      </div>
      <h3 class="news-title">
        <a href="${article.link}" target="_blank" rel="noopener">${article.title}</a>
      </h3>
      ${article.description ? `<p class="news-excerpt">${article.description}</p>` : ''}
      ${deptTags ? `<div class="news-dept-tags">${deptTags}</div>` : ''}
    `;
    grid.appendChild(card);
  });

  // Dept tag click → filter the transactions table
  grid.querySelectorAll('.news-dept-tag').forEach(btn => {
    btn.addEventListener('click', () => {
      const deptName = btn.dataset.dept;
      const sel = document.getElementById('deptFilter');
      sel.value = deptName;
      sel.dispatchEvent(new Event('change'));
      document.querySelector('.spending-table')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ── CSV export ───────────────────────────────────────────── */
function exportCSV(txns) {
  const headers = ['Date','Department','Vendor','Category','Description','Amount'];
  const rows = txns.map(t => [t.dateStr, t.department, t.vendor, t.category, t.description, t.amount]);
  const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), {
    href: url,
    download: `houston-spending-${new Date().toISOString().slice(0,10)}.csv`,
  });
  a.click();
  URL.revokeObjectURL(url);
}

/* ── Table ────────────────────────────────────────────────── */
const PAGE_SIZE = 15;
let currentPage  = 1;
let filteredTxns = [];
let sortCol      = 'date';
let sortDir      = 'desc';
let ALL_TXNS     = [];

function populateFilters() {
  const deptFilter = document.getElementById('deptFilter');
  const catFilter  = document.getElementById('categoryFilter');
  const zipFilter  = document.getElementById('zipFilter');

  const depts = [...new Set(ALL_TXNS.map(t => t.department))].sort();
  depts.forEach(d => {
    const o = document.createElement('option');
    o.value = d; o.textContent = d;
    deptFilter.appendChild(o);
  });

  CATEGORIES.forEach(c => {
    const o = document.createElement('option');
    o.value = c; o.textContent = c;
    catFilter.appendChild(o);
  });

  const zips = [...new Set(ALL_TXNS.map(t => t.zipCode))].sort();
  zips.forEach(z => {
    const entry = ZIP_DATA.find(d => d.zip === z);
    const o = document.createElement('option');
    o.value = z;
    o.textContent = entry ? `${z} — ${entry.neighborhood}` : z;
    zipFilter.appendChild(o);
  });
}

function applyFilters() {
  const q    = document.getElementById('searchInput').value.toLowerCase();
  const dept = document.getElementById('deptFilter').value;
  const cat  = document.getElementById('categoryFilter').value;
  const zip  = document.getElementById('zipFilter').value;
  return ALL_TXNS.filter(t => {
    if (dept && t.department !== dept)  return false;
    if (cat  && t.category  !== cat)   return false;
    if (zip  && t.zipCode   !== zip)   return false;
    if (q && ![t.department, t.vendor, t.description, t.category, t.dateStr, t.zipCode, t.neighborhood].some(s => s.toLowerCase().includes(q))) return false;
    return true;
  });
}

function sortList(txns) {
  return [...txns].sort((a, b) => {
    let av = a[sortCol], bv = b[sortCol];
    if (sortCol === 'date')   { av = a.date; bv = b.date; }
    if (sortCol === 'amount') { av = a.amount; bv = b.amount; }
    if (typeof av === 'string') { av = av.toLowerCase(); bv = bv.toLowerCase(); }
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ?  1 : -1;
    return 0;
  });
}

function renderTable(list) {
  const sorted  = sortList(list);
  const visible = CAN_ALL_RECORDS ? sorted : sorted.slice(0, PUBLIC_ROW_LIMIT);
  filteredTxns  = visible;

  const total = visible.length;
  const pages = Math.ceil(total / PAGE_SIZE);
  currentPage = Math.min(currentPage, pages || 1);

  const slice = visible.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = '';

  if (slice.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--gray-3)">No transactions match your filters.</td></tr>';
  }

  slice.forEach(t => {
    const color    = CATEGORY_COLORS[t.category] || '#546e7a';
    const vendorTd = CAN_SEE_VENDORS
      ? t.vendor
      : '<span style="color:var(--gray-3);font-style:italic">Redacted</span>';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${t.dateStr}</td>
      <td>${t.department}</td>
      <td>${vendorTd}</td>
      <td><span class="category-pill" style="background:${color}1a;color:${color}">${t.category}</span></td>
      <td>${t.description}</td>
      <td class="amount">${fmtMoneyFull(t.amount)}</td>
      <td><span class="zip-pill">${t.zipCode}</span></td>
    `;
    tbody.appendChild(tr);
  });

  const from = slice.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const to   = (currentPage - 1) * PAGE_SIZE + slice.length;
  const cap  = !CAN_ALL_RECORDS ? ` (limited to ${PUBLIC_ROW_LIMIT} for public access)` : '';
  document.getElementById('rowCount').textContent = `Showing ${from}–${to} of ${total} transactions${cap}`;
  renderPagination(pages);
}

function renderPagination(pages) {
  const pg = document.getElementById('pagination');
  pg.innerHTML = '';
  const btn = (label, page, disabled, active) => {
    const b = document.createElement('button');
    b.className = 'page-btn' + (active ? ' active' : '');
    b.textContent = label;
    b.disabled = disabled;
    b.addEventListener('click', () => { currentPage = page; renderTable(filteredTxns); });
    return b;
  };
  pg.appendChild(btn('‹', currentPage - 1, currentPage === 1, false));
  let start = Math.max(1, currentPage - 2);
  let end   = Math.min(pages, start + 4);
  start = Math.max(1, end - 4);
  for (let p = start; p <= end; p++) pg.appendChild(btn(p, p, false, p === currentPage));
  pg.appendChild(btn('›', currentPage + 1, currentPage === pages || pages === 0, false));
}

function initTableSort() {
  document.querySelectorAll('.spending-table th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const col = th.dataset.col;
      if (sortCol === col) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
      else { sortCol = col; sortDir = 'asc'; }
      document.querySelectorAll('.sort-icon').forEach(i => { i.className = 'sort-icon'; });
      th.querySelector('.sort-icon').className = 'sort-icon ' + sortDir;
      currentPage = 1;
      renderTable(applyFilters());
    });
  });
}

/* ── Bootstrap ────────────────────────────────────────────── */
async function init() {
  // Show loading overlay
  const overlay = document.getElementById('loadingOverlay');

  // Fetch spending data and news in parallel
  const [spendingResult, newsResult] = await Promise.all([
    SpendingAPI.load(),
    NewsAPI.load(),
  ]);

  // Use live or mock transactions
  ALL_TXNS = spendingResult.transactions || generateTransactions(300);

  // Hide loading overlay
  overlay.classList.add('hidden');
  setTimeout(() => overlay.remove(), 400);

  const deptSpent = computeDeptSpent(ALL_TXNS);

  renderSummary(ALL_TXNS);
  renderDataSourceBar(spendingResult.source, spendingResult.label, newsResult.source, newsResult.feedName);
  renderDeptChart(deptSpent);
  renderAllocChart(ALL_TXNS);
  renderTrendChart();
  renderDeptGrid(deptSpent);
  renderZipBreakdown(ALL_TXNS);
  renderNews(newsResult.articles);
  populateFilters();

  if (!CAN_SEE_VENDORS) {
    document.getElementById('vendorHeader').textContent = 'Vendor (redacted)';
  }

  if (CAN_EXPORT) {
    const btn = document.getElementById('exportBtn');
    btn.hidden = false;
    btn.addEventListener('click', () => exportCSV(filteredTxns.length ? filteredTxns : ALL_TXNS));
  }

  const refresh = () => { currentPage = 1; renderTable(applyFilters()); };
  document.getElementById('searchInput').addEventListener('input', refresh);
  document.getElementById('deptFilter').addEventListener('change', refresh);
  document.getElementById('categoryFilter').addEventListener('change', refresh);
  document.getElementById('zipFilter').addEventListener('change', refresh);

  initTableSort();
  renderTable(ALL_TXNS);
}

init();
