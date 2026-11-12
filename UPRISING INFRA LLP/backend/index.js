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

const COLLECTIONS = ['home', 'about', 'services', 'projects', 'clients', 'leadership', 'faqs', 'nav', 'seo', 'settings', 'media', 'logs', 'backups'];

// Same rules as the admin panel's permissions.js
function can(role, module, action = 'view') {
  if (!role) return false;
  if (role === 'Super Admin') return true;
  if (role === 'Admin') return !['users', 'backup'].includes(module);
  const editorModules = ['dashboard', 'home', 'about', 'services', 'projects', 'clients', 'leadership', 'faqs', 'media', 'site'];
  return role === 'Editor' && editorModules.includes(module) && !['delete', 'publish'].includes(action);
}

const moduleFor = (name) => ({ nav: 'site', seo: 'site', settings: 'site', logs: 'dashboard', backups: 'backup' }[name] || name);

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Please log in again.' });
  }
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
  const { rows } = await pool.query('SELECT * FROM users WHERE lower(email) = lower($1)', [email]);
  const user = rows[0];
  const valid = user && user.status === 'active' && (await bcrypt.compare(password, user.password_hash));
  if (!valid) return res.status(401).json({ error: 'Invalid email or password.' });
  const profile = { id: user.id, name: user.name, email: user.email, role: user.role };
  const token = jwt.sign(profile, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, user: profile });
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

app.patch('/api/admin/enquiries/:id', auth, async (req, res) => {
  if (!can(req.user.role, 'enquiries', 'edit')) return res.status(403).json({ error: 'Not allowed.' });
  const { status, notes, follow } = req.body || {};
  const { rowCount } = await pool.query(
    `UPDATE enquiries SET status = COALESCE($1, status), notes = COALESCE($2, notes), follow = COALESCE($3, follow) WHERE id = $4`,
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

// ---------- Public website ----------
const enquiryLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 10 });

app.post('/api/enquiries', enquiryLimiter, async (req, res) => {
  const clean = (v, max) => String(v ?? '').trim().slice(0, max);
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

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Backend running on http://localhost:${port}`));