const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Application = require('./models/Application');
const KaggleRegistration = require('./models/KaggleRegistration');

const app = express();

app.use(cors({
  origin: [
    'https://club-website-eta.vercel.app',
    'http://localhost:5173',
    'http://localhost:8080',
    'http://localhost:3000',
  ],
  credentials: true,
}));

// Middleware
app.use(express.json());

// Database Connection
const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb+srv://parthagrawal2904_db_user:Parth2904@cluster0.lipdzoi.mongodb.net/?appName=Cluster0';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Database'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ==========================================
// API ROUTES
// ==========================================

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// POST Route: Submit a club membership application
app.post('/api/apply', async (req, res) => {
  try {
    const { name, email, branch, interest, reason } = req.body;

    const newApplication = new Application({ name, email, branch, interest, reason });
    await newApplication.save();

    res.status(201).json({ message: 'Application submitted successfully!' });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'This email has already been used to apply.' });
    }
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// ==========================================
// KAGGLE CONTEST REGISTRATION
// ==========================================

// POST /api/kaggle-register  — Register for the Kaggle Contest
app.post('/api/kaggle-register', async (req, res) => {
  try {
    const { name, email, kaggleId } = req.body;

    if (!name || !email || !kaggleId) {
      return res.status(400).json({ error: 'All fields (name, email, kaggleId) are required.' });
    }

    const existing = await KaggleRegistration.findOne({
      $or: [{ email: email.toLowerCase() }, { kaggleId }],
    });

    if (existing) {
      if (existing.email === email.toLowerCase()) {
        return res.status(409).json({ error: 'This email is already registered for the contest.' });
      }
      return res.status(409).json({ error: 'This Kaggle ID is already registered for the contest.' });
    }

    const registration = new KaggleRegistration({ name, email, kaggleId });
    await registration.save();

    res.status(201).json({ message: '🎉 Successfully registered for the Kaggle Contest!' });
  } catch (error) {
    console.error('Kaggle registration error:', error);
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Duplicate entry — email or Kaggle ID already registered.' });
    }
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// GET /api/kaggle-registrations — Fetch all registrations (admin use)
app.get('/api/kaggle-registrations', async (_req, res) => {
  try {
    const registrations = await KaggleRegistration.find().sort({ registeredAt: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch registrations.' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ==========================================
// REQUIRED FOR VERCEL HOSTING
// ==========================================
module.exports = app;
