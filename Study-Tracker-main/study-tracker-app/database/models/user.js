// Phase DB-01 — Core Users Collection (Mongoose Schema)

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
  unique: true,
  match: [/^\+?\d{10,15}$/, 'Please enter a valid phone number']
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  unique: true,
  match: [/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  tz: {
    type: String,
    default: 'Asia/Kolkata'
  },
  roles: {
    type: [String],
    default: ['student']
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'active'
  },
  meta: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

userSchema.index({ roles: 1 });

module.exports = mongoose.model('User', userSchema);
