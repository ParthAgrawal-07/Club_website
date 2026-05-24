const mongoose = require('mongoose');

const kaggleRegistrationSchema = new mongoose.Schema({
  googleId:    { type: String, required: true, unique: true },   // Google sub — one account, one entry
  name:        { type: String, required: true, trim: true },
  email:       { type: String, required: true, unique: true, trim: true, lowercase: true },
  picture:     { type: String, default: '' },                    // Google profile photo URL
  kaggleId:    { type: String, required: true, trim: true },
  registeredAt:{ type: Date, default: Date.now },
});

module.exports = mongoose.model('KaggleRegistration', kaggleRegistrationSchema);
