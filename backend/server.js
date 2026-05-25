const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Application = require('./models/Application');
const KaggleRegistration = require('./models/KaggleRegistration');

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

// ── DB ──
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB error:', err));

// ── ADMIN AUTH MIDDLEWARE ──
function requireAdmin(req, res, next) {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) {
    // No key set — open only in development
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
app.get('/api/health', (_req, res) => res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }));

app.post('/api/apply', async (req, res) => {
  try {
    const { name, email, branch, interest, reason } = req.body;
    await new Application({ name, email, branch, interest, reason }).save();
    res.status(201).json({ message: 'Application submitted successfully!' });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ error: 'Email already used.' });
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/kaggle-register
// Body: { accessToken, googleId, name, email, picture, kaggleId }
app.post('/api/kaggle-register', async (req, res) => {
  try {
    const { accessToken, googleId, name, email, picture, kaggleId } = req.body;

    if (!accessToken || !googleId || !kaggleId) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Verify the access token with Google to prevent spoofing
    const info = await getGoogleUserInfo(accessToken);
    if (!info || info.sub !== googleId) {
      return res.status(401).json({ error: 'Invalid Google session. Please sign in again.' });
    }

    // One Google account → one registration
    const byGoogle = await KaggleRegistration.findOne({ googleId: info.sub });
    if (byGoogle) {
      return res.status(409).json({ error: `${info.email} has already registered for the contest.` });
    }

    // One Kaggle ID → one registration
    const byKaggle = await KaggleRegistration.findOne({ kaggleId: kaggleId.trim() });
    if (byKaggle) {
      return res.status(409).json({ error: 'This Kaggle ID is already registered.' });
    }

    await new KaggleRegistration({
      googleId: info.sub,
      name: info.name || name,
      email: info.email || email,
      picture: info.picture || picture || '',
      kaggleId: kaggleId.trim(),
    }).save();

    res.status(201).json({ message: `🎉 Successfully registered! Welcome, ${info.name}!` });
  } catch (error) {
    console.error('Kaggle registration error:', error);
    if (error.code === 11000) return res.status(409).json({ error: 'Already registered.' });
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// GET /api/kaggle-registrations — all entries (admin use, protected)
app.get('/api/kaggle-registrations', requireAdmin, async (_req, res) => {
  try {
    const registrations = await KaggleRegistration.find().sort({ registeredAt: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch registrations.' });
  }
});

// ── CATCH-ALL 404 ──
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
module.exports = app;
