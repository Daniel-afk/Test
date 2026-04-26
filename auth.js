/* ── Demo credential store (replace with real backend in production) ── */
const _USERS = [
  {
    username: 'admin',
    password: 'houston@2026',
    role:     'admin',
    name:     'City Administrator',
    email:    'admin@houstontx.gov',
  },
  {
    username: 'analyst',
    password: 'analyst@2026',
    role:     'analyst',
    name:     'Budget Analyst',
    email:    'analyst@houstontx.gov',
  },
  {
    username: 'public',
    password: 'public@2026',
    role:     'public',
    name:     'Public Viewer',
    email:    'public@houstontx.gov',
  },
];

const ROLE_META = {
  admin:   { label: 'Administrator',  color: '#c62828', bg: '#ffebee' },
  analyst: { label: 'Budget Analyst', color: '#1a5fa8', bg: '#e3f2fd' },
  public:  { label: 'Public Viewer',  color: '#2e7d32', bg: '#e8f5e9' },
};

const PERMS = {
  admin:   ['view_vendors', 'export_data', 'view_all_records', 'view_admin_panel'],
  analyst: ['view_vendors', 'export_data', 'view_all_records'],
  public:  [],
};

const SESSION_KEY = 'hou_tracker_session';

const Auth = {
  login(username, password) {
    const user = _USERS.find(
      u => u.username === username.trim() && u.password === password
    );
    if (!user) return { ok: false, error: 'Invalid username or password.' };

    const session = {
      username: user.username,
      name:     user.name,
      role:     user.role,
      email:    user.email,
      loginAt:  Date.now(),
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return { ok: true, session };
  },

  logout() {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.href = 'login.html';
  },

  getSession() {
    try {
      return JSON.parse(sessionStorage.getItem(SESSION_KEY)) || null;
    } catch {
      return null;
    }
  },

  requireAuth() {
    const s = this.getSession();
    if (!s) { window.location.href = 'login.html'; return null; }
    return s;
  },

  can(session, action) {
    return (PERMS[session.role] || []).includes(action);
  },

  roleMeta(role) {
    return ROLE_META[role] || ROLE_META.public;
  },
};
