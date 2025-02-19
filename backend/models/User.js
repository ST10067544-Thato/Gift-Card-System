const mongoose = require('mongoose');

// Define a User schema
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
    enum: ['admin', 'store'],  // Only admin and store roles
    default: 'store',          // Default to 'store' for new users
  },
}, { timestamps: true });

// Export the User model
module.exports = mongoose.model('User', userSchema);
