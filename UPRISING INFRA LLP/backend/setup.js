const bcrypt = require('bcryptjs');
const pool = require('./db');

const COLLECTIONS = ['home', 'about', 'services', 'projects', 'clients', 'leadership', 'faqs', 'nav', 'seo', 'settings', 'media', 'logs', 'backups'];

async function main() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TIMESTAMPTZ DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS content (
      collection TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS enquiries (
      id SERIAL PRIMARY KEY,
      name TEXT, phone TEXT, email TEXT, service TEXT, message TEXT,
      status TEXT DEFAULT 'New',
      notes JSONB DEFAULT '[]',
      follow TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT now()
    );
  `);

  const { seed } = await import('./seed-data.mjs');
  const data = seed();

  for (const key of COLLECTIONS) {
    await pool.query(
      'INSERT INTO content (collection, data) VALUES ($1, $2) ON CONFLICT (collection) DO NOTHING',
      [key, JSON.stringify(data[key])]
    );
  }

  for (const u of data.users) {
    const hash = await bcrypt.hash(u.password, 10);
    await pool.query(
      'INSERT INTO users (name, email, role, password_hash, status) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (email) DO NOTHING',
      [u.name, u.email, u.role, hash, u.status]
    );
  }

  console.log('Setup complete.');
  await pool.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});