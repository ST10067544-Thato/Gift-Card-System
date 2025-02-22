const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
  },
  role: {
    type: String,
    enum: ['admin', 'store'],
    default: 'store',
  },
  totpSecret: {  // Store the TOTP secret
    type: String,
    required: false,
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
