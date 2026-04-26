/* ── Departments ──────────────────────────────────────────── */
const DEPARTMENTS = [
  { id: 'police',   name: 'Houston Police',        icon: '🚓', color: '#1a5fa8', budget: 1050e6 },
  { id: 'fire',     name: 'Houston Fire',           icon: '🚒', color: '#c62828', budget: 580e6  },
  { id: 'public',   name: 'Public Works',           icon: '🏗️', color: '#ef6c00', budget: 640e6  },
  { id: 'parks',    name: 'Parks & Recreation',     icon: '🌳', color: '#2e7d32', budget: 185e6  },
  { id: 'health',   name: 'Health & Human Svcs',    icon: '🏥', color: '#00838f', budget: 220e6  },
  { id: 'housing',  name: 'Housing & Community',    icon: '🏘️', color: '#6a1b9a', budget: 130e6  },
  { id: 'library',  name: 'Houston Public Library', icon: '📚', color: '#1565c0', budget: 58e6   },
  { id: 'admin',    name: 'Administration',         icon: '🏛️', color: '#37474f', budget: 210e6  },
  { id: 'aviation', name: 'Aviation (HAS)',         icon: '✈️', color: '#0277bd', budget: 420e6  },
  { id: 'solid',    name: 'Solid Waste Mgmt',       icon: '♻️', color: '#558b2f', budget: 160e6  },
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
  'Personnel Services':   '#1a5fa8',
  'Contracts & Services': '#ef6c00',
  'Capital Improvements': '#2e7d32',
  'Equipment & Supplies': '#6a1b9a',
  'Debt Service':         '#c62828',
  'Grants & Aid':         '#00838f',
};

const MONTHLY_LABELS = ['Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr'];
const MONTHLY_SPENT  = [268, 312, 291, 340, 358, 375, 290, 320, 344, 361];
const MONTHLY_BUDGET = Array(10).fill(380);

/* ── Department keywords for news tagging ─────────────────── */
const DEPT_KEYWORDS = {
  police:   ['police', 'hpd', 'crime', 'arrest', 'shooting', 'officer', 'law enforcement', 'patrol', 'detective', 'homicide'],
  fire:     ['fire department', 'hfd', 'firefighter', 'blaze', 'arson', 'ems', 'paramedic', 'house fire', 'fire station'],
  public:   ['road', 'bridge', 'drainage', 'flooding', 'flood', 'pothole', 'infrastructure', 'public works', 'construction', 'bayou', 'sewer'],
  parks:    ['park', 'recreation', 'trail', 'greenspace', 'playground', 'pool', 'hike and bike', 'bayou greenways'],
  health:   ['health department', 'public health', 'hospital', 'disease', 'clinic', 'mental health', 'vaccination', 'outbreak'],
  housing:  ['housing', 'homeless', 'affordable housing', 'shelter', 'housing authority', 'rent', 'eviction'],
  library:  ['library', 'houston public library', 'literacy', 'reading program'],
  admin:    ['mayor', 'city council', 'city budget', 'administration', 'city hall', 'council member', 'whitmire', 'ordinance'],
  aviation: ['airport', 'iah', 'hobby airport', 'intercontinental', 'houston airport', 'aviation', 'airline'],
  solid:    ['trash', 'recycling', 'solid waste', 'garbage', 'landfill', 'litter', 'bulk pickup'],
};

/* ── Houston ZIP code reference ───────────────────────────── */
const ZIP_DATA = [
  { zip: '77002', neighborhood: 'Downtown' },
  { zip: '77003', neighborhood: 'East Downtown' },
  { zip: '77004', neighborhood: 'Midtown' },
  { zip: '77006', neighborhood: 'Montrose' },
  { zip: '77007', neighborhood: 'Washington Ave' },
  { zip: '77008', neighborhood: 'Heights' },
  { zip: '77009', neighborhood: 'Near Northside' },
  { zip: '77011', neighborhood: 'East End' },
  { zip: '77018', neighborhood: 'Garden Oaks' },
  { zip: '77019', neighborhood: 'River Oaks' },
  { zip: '77020', neighborhood: 'Fifth Ward' },
  { zip: '77021', neighborhood: 'Sunnyside' },
  { zip: '77025', neighborhood: 'Braeswood' },
  { zip: '77026', neighborhood: 'Trinity/Houston Gardens' },
  { zip: '77030', neighborhood: 'Medical Center' },
  { zip: '77032', neighborhood: 'Greenspoint' },
  { zip: '77036', neighborhood: 'Chinatown' },
  { zip: '77040', neighborhood: 'NW Houston' },
  { zip: '77045', neighborhood: 'Hobby Area' },
  { zip: '77054', neighborhood: 'Kirby' },
  { zip: '77056', neighborhood: 'Galleria' },
  { zip: '77058', neighborhood: 'Clear Lake/NASA' },
  { zip: '77071', neighborhood: 'Sharpstown' },
  { zip: '77077', neighborhood: 'Energy Corridor' },
  { zip: '77079', neighborhood: 'Memorial' },
  { zip: '77084', neighborhood: 'Katy Area' },
  { zip: '77088', neighborhood: 'Acres Homes' },
  { zip: '77091', neighborhood: 'Acres Homes North' },
  { zip: '77095', neighborhood: 'Copperfield' },
  { zip: '77098', neighborhood: 'Neartown' },
];

/* ── Mock data generation ─────────────────────────────────── */
const _VENDORS = [
  'Jacobs Engineering Group', 'Kiewit Infrastructure', 'Turner Construction',
  'Motorola Solutions', 'SAIC Technologies', 'Waste Management Inc.',
  'Republic Services', 'Axon Enterprise', 'Tyler Technologies',
  'HDR Engineering', 'Stantec Consulting', 'AECOM Technical Services',
  'Siemens Industry', 'Johnson Controls', 'Gartner Inc.',
  'Deloitte Consulting', 'IBM Corporation', 'Oracle America',
  'Houston Firefighters Relief', 'Harris County Hospital District',
  'Houston First Corporation', 'Centro de Salud Familiar',
];

const _DESCRIPTIONS = {
  'Personnel Services':   ['Payroll disbursement','Overtime pay','Benefits & insurance','Pension contributions','Temp staffing'],
  'Contracts & Services': ['IT managed services','Janitorial contract','Security services','Legal services','Consulting engagement'],
  'Capital Improvements': ['Road resurfacing','Bridge repair','Facility renovation','Drainage upgrade','Park improvements'],
  'Equipment & Supplies': ['Fleet vehicles','Protective equipment','Office supplies','Software licenses','Lab equipment'],
  'Debt Service':         ['Bond principal payment','Interest payment','Lease obligation','Revenue bond debt'],
  'Grants & Aid':         ['Community development','Public health grant','Housing assistance','Youth program funding'],
};

function _rand(min, max) { return Math.random() * (max - min) + min; }
function _pick(arr)       { return arr[Math.floor(Math.random() * arr.length)]; }

function generateTransactions(count = 300) {
  const txns  = [];
  const start = new Date('2025-07-01');
  const end   = new Date('2026-04-24');
  const range = end - start;

  for (let i = 0; i < count; i++) {
    const dept = _pick(DEPARTMENTS);
    const cat  = _pick(CATEGORIES);
    const date = new Date(start.getTime() + Math.random() * range);

    let amount;
    if (cat === 'Capital Improvements')    amount = _rand(500_000, 12_000_000);
    else if (cat === 'Debt Service')       amount = _rand(1_000_000, 8_000_000);
    else if (cat === 'Personnel Services') amount = _rand(50_000, 3_000_000);
    else                                   amount = _rand(10_000, 2_000_000);

    const zipEntry = _pick(ZIP_DATA);
    txns.push({
      id:           i + 1,
      date,
      dateStr:      date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      department:   dept.name,
      deptId:       dept.id,
      vendor:       _pick(_VENDORS),
      category:     cat,
      description:  _pick(_DESCRIPTIONS[cat]),
      amount:       Math.round(amount),
      zipCode:      zipEntry.zip,
      neighborhood: zipEntry.neighborhood,
    });
  }

  txns.sort((a, b) => b.date - a.date);
  return txns;
}

function computeDeptSpent(txns) {
  const map = {};
  DEPARTMENTS.forEach(d => { map[d.id] = 0; });
  txns.forEach(t => { map[t.deptId] = (map[t.deptId] || 0) + t.amount; });
  return map;
}

function computeZipSpent(txns) {
  const map = {};
  txns.forEach(t => {
    if (!map[t.zipCode]) {
      map[t.zipCode] = { zip: t.zipCode, neighborhood: t.neighborhood, spent: 0, count: 0, deptTotals: {} };
    }
    const entry = map[t.zipCode];
    entry.spent += t.amount;
    entry.count += 1;
    entry.deptTotals[t.department] = (entry.deptTotals[t.department] || 0) + t.amount;
  });
  Object.values(map).forEach(entry => {
    entry.topDept = Object.entries(entry.deptTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
    delete entry.deptTotals;
  });
  return map;
}

/* ── CKAN helpers ─────────────────────────────────────────── */
function _abortSignal(ms) {
  const ctrl = new AbortController();
  setTimeout(() => ctrl.abort(), ms);
  return ctrl.signal;
}

function _mapCategory(raw = '') {
  const r = raw.toLowerCase();
  if (r.match(/personnel|salary|payroll|benefit|wage|overtime/)) return 'Personnel Services';
  if (r.match(/capital|construction|renovation|improvement|infrastructure/)) return 'Capital Improvements';
  if (r.match(/debt|bond|interest|lease payment/)) return 'Debt Service';
  if (r.match(/equipment|supply|supplies|material|vehicle|fleet/)) return 'Equipment & Supplies';
  if (r.match(/grant|aid|assistance|subsidy/)) return 'Grants & Aid';
  return 'Contracts & Services';
}

function _mapDept(raw = '') {
  const r = raw.toLowerCase();
  for (const dept of DEPARTMENTS) {
    const words = dept.name.toLowerCase().split(' ').filter(w => w.length > 3);
    if (words.some(w => r.includes(w))) return dept;
  }
  return DEPARTMENTS.find(d => d.id === 'admin');
}

function _mapCKANRecord(rec, index) {
  const rawAmount = parseFloat(
    rec.amount || rec.total_amount || rec.check_amount || rec.net_amount || rec.disbursement_amount || 0
  );
  const rawDate = rec.check_date || rec.payment_date || rec.transaction_date || rec.date;
  let date = rawDate ? new Date(rawDate) : new Date();
  if (isNaN(date)) date = new Date();

  const deptRaw = rec.dept_name || rec.department_name || rec.department || rec.fund_name || '';
  const dept    = _mapDept(deptRaw);
  const catRaw  = rec.object_name || rec.account_name || rec.category || rec.fund_name || '';

  const rawZip   = (rec.zip_code || rec.zip || rec.postal_code || '').toString().trim().slice(0, 5);
  const zipEntry = ZIP_DATA.find(z => z.zip === rawZip) || _pick(ZIP_DATA);

  return {
    id:           index + 1,
    date,
    dateStr:      date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    department:   dept.name,
    deptId:       dept.id,
    vendor:       (rec.vendor_name || rec.payee_name || rec.vendor || 'Unknown').trim(),
    category:     _mapCategory(catRaw),
    description:  (rec.account_description || rec.description || catRaw || '').trim() || dept.name,
    amount:       Math.abs(rawAmount),
    zipCode:      zipEntry.zip,
    neighborhood: zipEntry.neighborhood,
  };
}

/* ── SpendingAPI ──────────────────────────────────────────── */
const SpendingAPI = {
  _bases: [
    'https://openfinance.houstontx.gov/api/3/action',
    'https://data.houstontx.gov/api/3/action',
  ],

  async _tryBase(base) {
    const pkgResp = await fetch(`${base}/package_show?id=checkbook`, {
      signal: _abortSignal(8000),
    });
    if (!pkgResp.ok) throw new Error(`package_show HTTP ${pkgResp.status}`);

    const pkg = await pkgResp.json();
    if (!pkg.success) throw new Error('CKAN success=false');

    const resources = (pkg.result?.resources || []).filter(r => r.datastore_active);
    if (resources.length === 0) throw new Error('No datastore resources');

    resources.sort((a, b) => new Date(b.created) - new Date(a.created));
    const rid = resources[0].id;

    const dataResp = await fetch(
      `${base}/datastore_search?resource_id=${rid}&limit=500&sort=check_date+desc`,
      { signal: _abortSignal(10000) }
    );
    if (!dataResp.ok) throw new Error(`datastore_search HTTP ${dataResp.status}`);

    const data = await dataResp.json();
    if (!data.success) throw new Error('datastore success=false');
    return data.result?.records || [];
  },

  async load() {
    for (const base of this._bases) {
      try {
        const records = await this._tryBase(base);
        const transactions = records
          .map(_mapCKANRecord)
          .filter(r => r.amount > 0)
          .slice(0, 300);
        if (transactions.length === 0) throw new Error('Empty records');
        return { transactions, source: 'live', label: 'data.houstontx.gov (live)' };
      } catch (err) {
        console.warn(`[SpendingAPI] ${base} failed:`, err.message);
      }
    }
    return { transactions: null, source: 'mock', label: 'Demo data (API unavailable)' };
  },
};

/* ── NewsAPI ──────────────────────────────────────────────── */
const NewsAPI = {
  _proxy: 'https://api.allorigins.win/get?url=',
  _feeds: [
    { name: 'ABC13 Houston', url: 'https://abc13.com/feed/' },
    { name: 'KHOU 11',       url: 'https://www.khou.com/feeds/syndication/rss/news' },
    { name: 'Click2Houston', url: 'https://www.click2houston.com/rss/news.rss' },
  ],

  _tagArticle(article) {
    const text = `${article.title} ${article.description}`.toLowerCase();
    return Object.entries(DEPT_KEYWORDS)
      .filter(([, kws]) => kws.some(kw => text.includes(kw)))
      .map(([id]) => id);
  },

  _parseRSS(xml) {
    const doc = new DOMParser().parseFromString(xml, 'text/xml');
    return [...doc.querySelectorAll('item')].map(item => ({
      title:       item.querySelector('title')?.textContent?.trim() || '',
      link:        item.querySelector('link')?.textContent?.trim() || '#',
      description: (item.querySelector('description')?.textContent || '')
                    .replace(/<[^>]+>/g, '').trim().slice(0, 180),
      pubDate:     item.querySelector('pubDate')?.textContent || '',
      depts:       [],
    }));
  },

  async _fetchFeed(feed) {
    const url  = this._proxy + encodeURIComponent(feed.url);
    const resp = await fetch(url, { signal: _abortSignal(7000) });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const json = await resp.json();
    if (!json.contents) throw new Error('Empty contents');
    return this._parseRSS(json.contents).map(a => ({ ...a, source: feed.name }));
  },

  async load() {
    for (const feed of this._feeds) {
      try {
        const articles = await this._fetchFeed(feed);
        articles.forEach(a => { a.depts = this._tagArticle(a); });
        const tagged = articles.filter(a => a.depts.length > 0);
        return {
          articles: (tagged.length >= 6 ? tagged : articles).slice(0, 20),
          source: 'live',
          feedName: feed.name,
        };
      } catch (err) {
        console.warn(`[NewsAPI] ${feed.name} failed:`, err.message);
      }
    }
    return { articles: [], source: 'unavailable', feedName: null };
  },
};
