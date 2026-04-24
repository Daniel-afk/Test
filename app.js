/* ── Data ─────────────────────────────────────────────────── */

const DEPARTMENTS = [
  { id: 'police',    name: 'Houston Police',       icon: '🚓', color: '#1a5fa8', budget: 1050e6 },
  { id: 'fire',      name: 'Houston Fire',          icon: '🚒', color: '#c62828', budget: 580e6  },
  { id: 'public',    name: 'Public Works',          icon: '🏗️', color: '#ef6c00', budget: 640e6  },
  { id: 'parks',     name: 'Parks & Recreation',    icon: '🌳', color: '#2e7d32', budget: 185e6  },
  { id: 'health',    name: 'Health & Human Svcs',   icon: '🏥', color: '#00838f', budget: 220e6  },
  { id: 'housing',   name: 'Housing & Community',   icon: '🏘️', color: '#6a1b9a', budget: 130e6  },
  { id: 'library',   name: 'Houston Public Library',icon: '📚', color: '#1565c0', budget: 58e6   },
  { id: 'admin',     name: 'Administration',        icon: '🏛️', color: '#37474f', budget: 210e6  },
  { id: 'aviation',  name: 'Aviation (HAS)',        icon: '✈️', color: '#0277bd', budget: 420e6  },
  { id: 'solid',     name: 'Solid Waste Mgmt',      icon: '♻️', color: '#558b2f', budget: 160e6  },
];

const CATEGORIES = [
  'Personnel Services',
  'Contracts & Services',
  'Capital Improvements',
  'Equipment & Supplies',
  'Debt Service',
  'Grants & Aid',
];

const CATEGORY_COLORS = {
  'Personnel Services':    '#1a5fa8',
  'Contracts & Services':  '#ef6c00',
  'Capital Improvements':  '#2e7d32',
  'Equipment & Supplies':  '#6a1b9a',
  'Debt Service':          '#c62828',
  'Grants & Aid':          '#00838f',
};

const VENDORS = [
  'Jacobs Engineering Group', 'Kiewit Infrastructure', 'Turner Construction',
  'Motorola Solutions', 'SAIC Technologies', 'Waste Management Inc.',
  'Republic Services', 'Axon Enterprise', 'Tyler Technologies',
  'HDR Engineering', 'Stantec Consulting', 'AECOM Technical Services',
  'Siemens Industry', 'Johnson Controls', 'Gartner Inc.',
  'Deloitte Consulting', 'IBM Corporation', 'Oracle America',
  'Houston Firefighters Relief', 'Harris County Hospital District',
  'Houston First Corporation', 'Centro de Salud Familiar',
];

const MONTHLY_LABELS = ['Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr'];

const MONTHLY_SPENT = [268, 312, 291, 340, 358, 375, 290, 320, 344, 361];
const MONTHLY_BUDGET = Array(10).fill(380);

/* ── Generate Transactions ────────────────────────────────── */

function rand(min, max) { return Math.random() * (max - min) + min; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function fmtMoney(n) {
  if (Math.abs(n) >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
  if (Math.abs(n) >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M';
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtMoneyFull(n) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const DESCRIPTIONS = {
  'Personnel Services':    ['Payroll disbursement','Overtime pay','Benefits & insurance','Pension contributions','Temp staffing'],
  'Contracts & Services':  ['IT managed services','Janitorial contract','Security services','Legal services','Consulting engagement'],
  'Capital Improvements':  ['Road resurfacing','Bridge repair','Facility renovation','Drainage upgrade','Park improvements'],
  'Equipment & Supplies':  ['Fleet vehicles','Protective equipment','Office supplies','Software licenses','Lab equipment'],
  'Debt Service':          ['Bond principal payment','Interest payment','Lease obligation','Revenue bond debt'],
  'Grants & Aid':          ['Community development','Public health grant','Housing assistance','Youth program funding'],
};

function generateTransactions(count = 300) {
  const txns = [];
  const start = new Date('2025-07-01');
  const end   = new Date('2026-04-24');
  const range = end - start;

  for (let i = 0; i < count; i++) {
    const dept = pick(DEPARTMENTS);
    const cat  = pick(CATEGORIES);
    const date = new Date(start.getTime() + Math.random() * range);
    const descs = DESCRIPTIONS[cat];

    let amount;
    if (cat === 'Capital Improvements') amount = rand(500_000, 12_000_000);
    else if (cat === 'Debt Service')    amount = rand(1_000_000, 8_000_000);
    else if (cat === 'Personnel Services') amount = rand(50_000, 3_000_000);
    else                                   amount = rand(10_000, 2_000_000);

    txns.push({
      id:         i + 1,
      date:       date,
      dateStr:    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      department: dept.name,
      deptId:     dept.id,
      vendor:     pick(VENDORS),
      category:   cat,
      description:pick(descs),
      amount:     Math.round(amount),
    });
  }

  txns.sort((a, b) => b.date - a.date);
  return txns;
}

/* ── Compute Department Spent ─────────────────────────────── */

function computeDeptSpent(txns) {
  const map = {};
  DEPARTMENTS.forEach(d => { map[d.id] = 0; });
  txns.forEach(t => { map[t.deptId] = (map[t.deptId] || 0) + t.amount; });
  return map;
}

/* ── Summary Cards ────────────────────────────────────────── */

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

/* ── Department Bar Chart ─────────────────────────────────── */

function renderDeptChart(deptSpent) {
  const labels = DEPARTMENTS.map(d => d.name);
  const budgets = DEPARTMENTS.map(d => d.budget / 1e6);
  const spent   = DEPARTMENTS.map(d => (deptSpent[d.id] || 0) / 1e6);
  const colors  = DEPARTMENTS.map(d => d.color);

  new Chart(document.getElementById('deptChart'), {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Budget ($M)',
          data: budgets,
          backgroundColor: colors.map(c => c + '33'),
          borderColor: colors,
          borderWidth: 2,
          borderRadius: 4,
        },
        {
          label: 'Spent ($M)',
          data: spent,
          backgroundColor: colors.map(c => c + 'cc'),
          borderColor: colors,
          borderWidth: 0,
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { font: { size: 11 } } },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: $${ctx.parsed.y.toFixed(1)}M`,
          },
        },
      },
      scales: {
        x: { ticks: { font: { size: 10 }, maxRotation: 35 }, grid: { display: false } },
        y: { ticks: { callback: v => '$' + v + 'M', font: { size: 10 } }, grid: { color: '#e8ecf1' } },
      },
    },
  });
}

/* ── Allocation Donut Chart ───────────────────────────────── */

function renderAllocChart(txns) {
  const catTotals = {};
  CATEGORIES.forEach(c => { catTotals[c] = 0; });
  txns.forEach(t => { catTotals[t.category] += t.amount; });

  const total = Object.values(catTotals).reduce((a, b) => a + b, 0);
  const labels = Object.keys(catTotals);
  const data   = labels.map(l => catTotals[l]);
  const colors = labels.map(l => CATEGORY_COLORS[l]);

  new Chart(document.getElementById('allocChart'), {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{ data, backgroundColor: colors, borderWidth: 2, borderColor: '#fff', hoverOffset: 6 }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.label}: ${(ctx.parsed / total * 100).toFixed(1)}%`,
          },
        },
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

/* ── Trend Chart ──────────────────────────────────────────── */

function renderTrendChart() {
  new Chart(document.getElementById('trendChart'), {
    type: 'line',
    data: {
      labels: MONTHLY_LABELS,
      datasets: [
        {
          label: 'Monthly Budget ($M)',
          data: MONTHLY_BUDGET,
          borderColor: '#b0bec5',
          borderDash: [6, 3],
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
          tension: 0,
        },
        {
          label: 'Actual Spending ($M)',
          data: MONTHLY_SPENT,
          borderColor: '#1a5fa8',
          backgroundColor: 'rgba(26,95,168,.08)',
          borderWidth: 3,
          pointBackgroundColor: '#1a5fa8',
          pointRadius: 5,
          fill: true,
          tension: 0.35,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { font: { size: 11 } } },
        tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: $${ctx.parsed.y}M` } },
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
        y: {
          min: 200,
          ticks: { callback: v => '$' + v + 'M', font: { size: 11 } },
          grid: { color: '#e8ecf1' },
        },
      },
    },
  });
}

/* ── Department Cards ─────────────────────────────────────── */

function renderDeptGrid(deptSpent) {
  const container = document.getElementById('deptGrid');
  DEPARTMENTS.forEach(dept => {
    const spent  = deptSpent[dept.id] || 0;
    const pct    = Math.min(spent / dept.budget * 100, 100);
    const card   = document.createElement('div');
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

/* ── Table ────────────────────────────────────────────────── */

const PAGE_SIZE = 15;
let currentPage = 1;
let filteredTxns = [];
let sortCol = 'date';
let sortDir = 'desc';

function populateFilters(txns) {
  const deptFilter = document.getElementById('deptFilter');
  const catFilter  = document.getElementById('categoryFilter');

  const depts = [...new Set(txns.map(t => t.department))].sort();
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
}

function applyFilters(txns) {
  const q    = document.getElementById('searchInput').value.toLowerCase();
  const dept = document.getElementById('deptFilter').value;
  const cat  = document.getElementById('categoryFilter').value;

  return txns.filter(t => {
    if (dept && t.department !== dept) return false;
    if (cat  && t.category  !== cat)  return false;
    if (q && ![t.department, t.vendor, t.description, t.category, t.dateStr]
      .some(s => s.toLowerCase().includes(q))) return false;
    return true;
  });
}

function sortTxns(txns) {
  return [...txns].sort((a, b) => {
    let av = a[sortCol], bv = b[sortCol];
    if (sortCol === 'date')   { av = a.date; bv = b.date; }
    if (sortCol === 'amount') { av = a.amount; bv = b.amount; }
    if (typeof av === 'string') av = av.toLowerCase(), bv = bv.toLowerCase();
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ?  1 : -1;
    return 0;
  });
}

function renderTable(txns) {
  const sorted = sortTxns(txns);
  filteredTxns = sorted;
  const total = sorted.length;
  const pages = Math.ceil(total / PAGE_SIZE);
  currentPage = Math.min(currentPage, pages || 1);

  const slice = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = '';

  if (slice.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:32px;color:var(--gray-3)">No transactions match your filters.</td></tr>';
  }

  slice.forEach(t => {
    const color = CATEGORY_COLORS[t.category] || '#546e7a';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${t.dateStr}</td>
      <td>${t.department}</td>
      <td>${t.vendor}</td>
      <td><span class="category-pill" style="background:${color}1a;color:${color}">${t.category}</span></td>
      <td>${t.description}</td>
      <td class="amount">${fmtMoneyFull(t.amount)}</td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById('rowCount').textContent =
    `Showing ${slice.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0}–${(currentPage - 1) * PAGE_SIZE + slice.length} of ${total} transactions`;

  renderPagination(pages);
}

function renderPagination(pages) {
  const pg = document.getElementById('pagination');
  pg.innerHTML = '';

  const makeBtn = (label, page, disabled, active) => {
    const btn = document.createElement('button');
    btn.className = 'page-btn' + (active ? ' active' : '');
    btn.textContent = label;
    btn.disabled = disabled;
    btn.addEventListener('click', () => { currentPage = page; renderTable(filteredTxns); });
    return btn;
  };

  pg.appendChild(makeBtn('‹', currentPage - 1, currentPage === 1, false));

  let start = Math.max(1, currentPage - 2);
  let end   = Math.min(pages, start + 4);
  start = Math.max(1, end - 4);

  for (let p = start; p <= end; p++) {
    pg.appendChild(makeBtn(p, p, false, p === currentPage));
  }

  pg.appendChild(makeBtn('›', currentPage + 1, currentPage === pages || pages === 0, false));
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
      renderTable(filteredTxns);
    });
  });
}

/* ── Bootstrap ────────────────────────────────────────────── */

(function init() {
  const txns     = generateTransactions(300);
  const deptSpent = computeDeptSpent(txns);

  renderSummary(txns);
  renderDeptChart(deptSpent);
  renderAllocChart(txns);
  renderTrendChart();
  renderDeptGrid(deptSpent);
  populateFilters(txns);

  const refresh = () => {
    currentPage = 1;
    renderTable(applyFilters(txns));
  };

  document.getElementById('searchInput').addEventListener('input', refresh);
  document.getElementById('deptFilter').addEventListener('change', refresh);
  document.getElementById('categoryFilter').addEventListener('change', refresh);

  initTableSort();
  renderTable(txns);
})();
