const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ── CORS ──
app.use(cors({
  origin: [
    'https://aiclubdau.vercel.app',
    'https://ai-club-website-mu.vercel.app',
    'https://club-website-eta.vercel.app',
    'https://club-website-7aay.vercel.app',
    'http://localhost:5173',
    'http://localhost:8080',
    'http://localhost:3000',
  ],
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));

// ── POSTGRES POOL ──
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

// Normalize protocol prefix for pg client (strip +asyncpg)
const normalizedURL = DATABASE_URL
  .replace('postgresql+asyncpg://', 'postgresql://')
  .replace('postgres+asyncpg://', 'postgresql://');

const pool = new Pool({
  connectionString: normalizedURL,
  ssl: normalizedURL.includes('localhost') ? false : { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// ── CREATE TABLES ON STARTUP ──
// Only create tables that don't already exist — matches real Supabase schema
async function initDB() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id         SERIAL PRIMARY KEY,
        name       VARCHAR(255) NOT NULL,
        email      VARCHAR(255) NOT NULL UNIQUE,
        branch     VARCHAR(255) NOT NULL,
        interest   VARCHAR(255) NOT NULL,
        reason     TEXT         NOT NULL DEFAULT '',
        created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS public.users (
        id         SERIAL PRIMARY KEY,
        google_id  VARCHAR(255) NOT NULL UNIQUE,
        name       VARCHAR(255) NOT NULL,
        email      VARCHAR(255) NOT NULL UNIQUE,
        picture    VARCHAR(500),
        kaggle_id  VARCHAR(255),
        last_login TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
        created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      );
    `);
    console.log('✅ PostgreSQL tables ready');
  } finally {
    client.release();
  }
}

initDB().catch((err) => console.error('❌ DB init error:', err));

// ── ADMIN AUTH MIDDLEWARE ──
function requireAdmin(req, res, next) {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) {
    if (process.env.NODE_ENV === 'production') {
      return res.status(503).json({ error: 'Admin not configured' });
    }
    return next();
  }
  const provided = req.headers['x-admin-key'];
  if (!provided || provided !== adminKey) {
    return res.status(401).json({ error: 'Unauthorized: invalid admin key' });
  }
  next();
}

// ── HELPERS ──
async function getGoogleUserInfo(accessToken) {
  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return null;
  return res.json(); // { sub, email, name, picture }
}

// ── ROUTES ──

// Health check
app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected', engine: 'postgresql' });
  } catch {
    res.status(503).json({ status: 'error', db: 'disconnected' });
  }
});

// POST /api/apply — submit club membership application
app.post('/api/apply', async (req, res) => {
  try {
    const { name, email, branch, interest, reason } = req.body;

    if (!name?.trim() || !email?.trim() || !branch?.trim() || !interest?.trim()) {
      return res.status(400).json({ error: 'name, email, branch and interest are required.' });
    }

    await pool.query(
      `INSERT INTO applications (name, email, branch, interest, reason)
       VALUES ($1, $2, $3, $4, $5)`,
      [name.trim(), email.trim().toLowerCase(), branch.trim(), interest.trim(), (reason || '').trim()]
    );

    res.status(201).json({ message: 'Application submitted successfully!' });
  } catch (error) {
    if (error.code === '23505') {   // unique_violation
      return res.status(400).json({ error: 'This email has already been used to apply.' });
    }
    console.error('Apply error:', error);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// POST /api/kaggle-register — register user for Kaggle contest
// Uses the 'users' table (Google OAuth) + stores kaggle_id
app.post('/api/kaggle-register', async (req, res) => {
  try {
    const { accessToken, googleId, name, email, picture, kaggleId } = req.body;

    if (!accessToken || !googleId || !kaggleId?.trim()) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Verify the access token with Google to prevent spoofing
    const info = await getGoogleUserInfo(accessToken);
    if (!info || info.sub !== googleId) {
      return res.status(401).json({ error: 'Invalid Google session. Please sign in again.' });
    }

    // Check if this Kaggle ID is already taken by another user
    const byKaggle = await pool.query(
      'SELECT id FROM public.users WHERE kaggle_id = $1 AND google_id != $2',
      [kaggleId.trim(), info.sub]
    );
    if (byKaggle.rows.length > 0) {
      return res.status(409).json({ error: 'This Kaggle ID is already registered by another user.' });
    }

    // Upsert user — update kaggle_id and last_login on re-login
    const result = await pool.query(
      `INSERT INTO public.users (google_id, name, email, picture, kaggle_id, last_login, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       ON CONFLICT (google_id)
       DO UPDATE SET
         kaggle_id  = CASE WHEN users.kaggle_id IS NOT NULL AND users.kaggle_id != $5
                           THEN users.kaggle_id  -- don't overwrite if different ID already set
                           ELSE $5
                      END,
         last_login = NOW(),
         picture    = $4
       RETURNING kaggle_id, (xmax = 0) AS is_new`,
      [
        info.sub,
        (info.name || name || '').trim(),
        (info.email || email || '').trim().toLowerCase(),
        info.picture || picture || '',
        kaggleId.trim(),
      ]
    );

    const row = result.rows[0];
    // If DB already had a different Kaggle ID, reject
    if (row.kaggle_id !== kaggleId.trim()) {
      return res.status(409).json({ error: `${info.email} has already registered with a different Kaggle ID.` });
    }

    res.status(201).json({ message: `🎉 Successfully registered! Welcome, ${info.name}!` });
  } catch (error) {
    console.error('Kaggle registration error:', error);
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Already registered.' });
    }
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// GET /api/kaggle-registrations — all registered users with a kaggle_id (admin, protected)
app.get('/api/kaggle-registrations', requireAdmin, async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, google_id, name, email, picture, kaggle_id, created_at as registered_at
       FROM public.users
       WHERE kaggle_id IS NOT NULL AND kaggle_id != ''
       ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Fetch registrations error:', error);
    res.status(500).json({ error: 'Failed to fetch registrations.' });
  }
});

// GET /api/admin/applications — all membership applications (admin, protected)
app.get('/api/admin/applications', requireAdmin, async (_req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM applications ORDER BY created_at DESC LIMIT 500'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Fetch applications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications.' });
  }
});

// ── CATCH-ALL 404 ──
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT} (PostgreSQL)`));
module.exports = app;
