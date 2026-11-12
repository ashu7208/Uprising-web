require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const pool = require('./db');

const app = express();
const origins = (process.env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
app.use(cors({ origin: origins }));
app.use(express.json({ limit: '10mb' }));

const COLLECTIONS = ['home', 'about', 'services', 'projects', 'clients', 'leadership', 'faqs', 'nav', 'seo', 'settings', 'media', 'backups'];
const ROLES = ['Super Admin', 'Admin', 'Editor'];

// Same rules as the admin panel's permissions.js
function can(role, module, action = 'view') {
  if (!role) return false;
  if (role === 'Super Admin') return true;
  if (role === 'Admin') return !['users', 'backup'].includes(module);
  const editorModules = ['dashboard', 'home', 'about', 'services', 'projects', 'clients', 'leadership', 'faqs', 'media', 'site'];
  return role === 'Editor' && editorModules.includes(module) && !['delete', 'publish'].includes(action);
}

const moduleFor = (name) => ({ nav: 'navfooter', backups: 'backup' }[name] || name);
const clean = (v, max) => String(v ?? '').trim().slice(0, max);

async function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ error: 'Please log in again.' });
  }
  const { rows } = await pool.query('SELECT id, name, email, role, status FROM users WHERE id = $1', [payload.id]);
  const user = rows[0];
  if (!user || user.status !== 'active') return res.status(401).json({ error: 'Please log in again.' });
  req.user = user;
  next();
}

async function addLog(user, entry) {
  const { rows } = await pool.query("SELECT data FROM content WHERE collection = 'logs'");
  const logs = Array.isArray(rows[0]?.data) ? rows[0].data : [];
  const id = logs.reduce((max, log) => Math.max(max, Number(log.id) || 0), 0) + 1;
  logs.unshift({
    id, user: user.name, action: clean(entry.action, 120), mod: clean(entry.mod, 60),
    rec: clean(entry.rec, 200), detail: clean(entry.detail, 500), at: new Date().toISOString(),
  });
  await pool.query(
    `INSERT INTO content (collection, data, updated_at) VALUES ('logs', $1, now())
     ON CONFLICT (collection) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
    [JSON.stringify(logs.slice(0, 300))]
  );
}

const shapeEnquiry = (r) => ({
  id: r.id, name: r.name, phone: r.phone, email: r.email, service: r.service,
  message: r.message, status: r.status, at: r.created_at, notes: r.notes || [], follow: r.follow || '',
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

// ---------- Login ----------
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });

app.post('/api/auth/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });
  const { rows } = await pool.query('SELECT * FROM users WHERE lower(email) = lower($1)', [String(email)]);
  const user = rows[0];
  const valid = user && user.status === 'active' && (await bcrypt.compare(String(password), user.password_hash));
  if (!valid) return res.status(401).json({ error: 'Wrong email or password, or the account is disabled.' });
  const profile = { id: user.id, name: user.name, email: user.email, role: user.role };
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '8h' });
  await addLog(profile, { action: 'Login', mod: 'Auth' });
  res.json({ token, user: profile });
});

app.post('/api/auth/logout', auth, async (req, res) => {
  await addLog(req.user, { action: 'Logout', mod: 'Auth' });
  res.json({ ok: true });
});

app.post('/api/auth/change-password', auth, async (req, res) => {
  const password = String(req.body?.password ?? '');
  if (password.length < 8 || password.length > 72) {
    return res.status(400).json({ error: 'Password must be 8 to 72 characters.' });
  }
  const hash = await bcrypt.hash(password, 10);
  await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hash, req.user.id]);
  await addLog(req.user, { action: 'Changed password', mod: 'Auth' });
  res.json({ ok: true });
});

// ---------- Admin panel ----------
app.get('/api/admin/state', auth, async (req, res) => {
  const { role } = req.user;
  const state = {};
  const content = await pool.query('SELECT collection, data FROM content');
  content.rows.forEach((row) => { state[row.collection] = row.data; });

  state.users = [];
  state.enquiries = [];
  if (can(role, 'users')) {
    const users = await pool.query('SELECT id, name, email, role, status FROM users ORDER BY id');
    state.users = users.rows;
  }
  if (can(role, 'enquiries')) {
    const enquiries = await pool.query('SELECT * FROM enquiries ORDER BY created_at DESC');
    state.enquiries = enquiries.rows.map(shapeEnquiry);
  }
  res.json(state);
});

app.put('/api/admin/content/:name', auth, async (req, res) => {
  const { name } = req.params;
  if (!COLLECTIONS.includes(name)) return res.status(404).json({ error: 'Unknown collection.' });
  if (!can(req.user.role, moduleFor(name), 'edit')) return res.status(403).json({ error: 'Not allowed.' });
  if (req.body.data === undefined) return res.status(400).json({ error: 'Missing data.' });
  await pool.query(
    `INSERT INTO content (collection, data, updated_at) VALUES ($1, $2, now())
     ON CONFLICT (collection) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
    [name, JSON.stringify(req.body.data)]
  );
  res.json({ ok: true });
});

app.post('/api/admin/logs', auth, async (req, res) => {
  await addLog(req.user, req.body || {});
  res.status(201).json({ ok: true });
});

// ----- Enquiries (admin) -----
app.post('/api/admin/enquiries', auth, async (req, res) => {
  if (!can(req.user.role, 'enquiries', 'edit')) return res.status(403).json({ error: 'Not allowed.' });
  const b = req.body || {};
  const name = clean(b.name, 120);
  if (!name) return res.status(400).json({ error: 'Name is required.' });
  await pool.query(
    'INSERT INTO enquiries (name, phone, email, service, message) VALUES ($1, $2, $3, $4, $5)',
    [name, clean(b.phone, 30), clean(b.email, 160), clean(b.service, 80), clean(b.message, 3000)]
  );
  res.status(201).json({ ok: true });
});

app.patch('/api/admin/enquiries/:id', auth, async (req, res) => {
  if (!can(req.user.role, 'enquiries', 'edit')) return res.status(403).json({ error: 'Not allowed.' });
  const { status, notes, follow } = req.body || {};
  const { rowCount } = await pool.query(
    `UPDATE enquiries SET status = COALESCE($1, status), notes = COALESCE($2::jsonb, notes), follow = COALESCE($3, follow) WHERE id = $4`,
    [status ?? null, notes === undefined ? null : JSON.stringify(notes), follow ?? null, req.params.id]
  );
  if (!rowCount) return res.status(404).json({ error: 'Enquiry not found.' });
  res.json({ ok: true });
});

app.delete('/api/admin/enquiries/:id', auth, async (req, res) => {
  if (!can(req.user.role, 'enquiries', 'delete')) return res.status(403).json({ error: 'Not allowed.' });
  await pool.query('DELETE FROM enquiries WHERE id = $1', [req.params.id]);
  res.json({ ok: true });
});

// ----- Users (Super Admin only) -----
function userFields(body, requirePassword) {
  const name = clean(body.name, 120);
  const email = clean(body.email, 160).toLowerCase();
  const role = String(body.role ?? '');
  const status = clean(body.status || 'active', 20);
  const password = String(body.password ?? '');
  if (!name) return { error: 'Name is required.' };
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: 'A valid email is required.' };
  if (!ROLES.includes(role)) return { error: 'Role must be Super Admin, Admin or Editor.' };
  if ((requirePassword || password) && (password.length < 8 || password.length > 72)) {
    return { error: 'Password must be 8 to 72 characters.' };
  }
  return { name, email, role, status, password };
}

async function wouldLeaveNoSuperAdmin(id, newRole, newStatus) {
  if (newRole === 'Super Admin' && newStatus === 'active') return false;
  const { rows } = await pool.query(
    "SELECT count(*)::int AS n FROM users WHERE role = 'Super Admin' AND status = 'active' AND id <> $1", [id]
  );
  return rows[0].n === 0;
}

app.post('/api/admin/users', auth, async (req, res) => {
  if (!can(req.user.role, 'users', 'edit')) return res.status(403).json({ error: 'Not allowed.' });
  const f = userFields(req.body || {}, true);
  if (f.error) return res.status(400).json({ error: f.error });
  try {
    const hash = await bcrypt.hash(f.password, 10);
    await pool.query(
      'INSERT INTO users (name, email, role, password_hash, status) VALUES ($1, $2, $3, $4, $5)',
      [f.name, f.email, f.role, hash, f.status]
    );
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ error: 'That email is already used.' });
    throw error;
  }
  res.status(201).json({ ok: true });
});

app.put('/api/admin/users/:id', auth, async (req, res) => {
  if (!can(req.user.role, 'users', 'edit')) return res.status(403).json({ error: 'Not allowed.' });
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Bad user id.' });
  const f = userFields(req.body || {}, false);
  if (f.error) return res.status(400).json({ error: f.error });
  if (await wouldLeaveNoSuperAdmin(id, f.role, f.status)) {
    return res.status(400).json({ error: 'There must be at least one active Super Admin.' });
  }
  try {
    const hash = f.password ? await bcrypt.hash(f.password, 10) : null;
    const { rowCount } = await pool.query(
      'UPDATE users SET name = $1, email = $2, role = $3, status = $4, password_hash = COALESCE($5, password_hash) WHERE id = $6',
      [f.name, f.email, f.role, f.status, hash, id]
    );
    if (!rowCount) return res.status(404).json({ error: 'User not found.' });
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ error: 'That email is already used.' });
    throw error;
  }
  res.json({ ok: true });
});

app.delete('/api/admin/users/:id', auth, async (req, res) => {
  if (!can(req.user.role, 'users', 'delete')) return res.status(403).json({ error: 'Not allowed.' });
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Bad user id.' });
  if (id === req.user.id) return res.status(400).json({ error: 'You cannot delete your own account.' });
  if (await wouldLeaveNoSuperAdmin(id, null, null)) {
    return res.status(400).json({ error: 'There must be at least one active Super Admin.' });
  }
  await pool.query('DELETE FROM users WHERE id = $1', [id]);
  res.json({ ok: true });
});

// ---------- Public website ----------
const enquiryLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 10 });

app.post('/api/enquiries', enquiryLimiter, async (req, res) => {
  const name = clean(req.body.name, 120);
  const phone = clean(req.body.phone, 30);
  const email = clean(req.body.email, 160);
  const service = clean(req.body.service, 80);
  const message = clean(req.body.message, 3000);
  if (!name || (!phone && !email) || !message) {
    return res.status(400).json({ error: 'Name, a phone or email, and a message are required.' });
  }
  await pool.query(
    'INSERT INTO enquiries (name, phone, email, service, message) VALUES ($1, $2, $3, $4, $5)',
    [name, phone, email, service, message]
  );
  res.status(201).json({ ok: true });
});

app.get('/api/public/media/:id/file', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) return res.status(400).json({ error: 'Bad media id.' });

  const { rows } = await pool.query("SELECT data FROM content WHERE collection = 'media'");
  const media = Array.isArray(rows[0]?.data) ? rows[0].data.find((item) => Number(item.id) === id) : null;
  const match = typeof media?.src === 'string'
    ? media.src.match(/^data:(image\/(?:jpeg|png|webp|svg\+xml));base64,([A-Za-z0-9+/]+={0,2})$/)
    : null;
  if (!match) return res.status(404).json({ error: 'Media not found.' });

  res.set('Cache-Control', 'public, max-age=300');
  res.type(match[1]).send(Buffer.from(match[2], 'base64'));
});

app.get('/api/public/content', async (req, res) => {
  const { rows } = await pool.query('SELECT collection, data FROM content');
  const c = Object.fromEntries(rows.map((r) => [r.collection, r.data]));
  const published = (list) => (list || []).filter((r) => r.status === 'published');
  const sections = (list) => published(list)
    .filter((s) => s.enabled !== false)
    .map((s) => ({ id: s.id, name: s.name, ...s.live }));

  res.json({
    home: sections(c.home),
    about: sections(c.about),
    services: published(c.services),
    projects: published(c.projects),
    clients: published(c.clients),
    leadership: published(c.leadership),
    faqs: published(c.faqs),
    nav: (c.nav || []).filter((r) => r.status === 'visible'),
    seo: c.seo || [],
    settings: c.settings || {},
  });
});

app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') return res.status(413).json({ error: 'That upload is too large.' });
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Backend running on http://localhost:${port}`));