const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Application = require('./models/Application');

const app = express();

app.use(cors({
  origin: 'https://club-website-eta.vercel.app' 
}));

// Middleware
app.use(express.json()); 

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/neuralnode')
  .then(() => console.log('✅ Connected to MongoDB Database'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ==========================================
// API ROUTES
// ==========================================

// POST Route: Submit a new application
app.post('/api/apply', async (req, res) => {
  try {
    const { name, email, branch, interest, reason } = req.body;

    const newApplication = new Application({
      name,
      email,
      branch,
      interest,
      reason
    });

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

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ==========================================
// REQUIRED FOR VERCEL HOSTING
// ==========================================
module.exports = app;
