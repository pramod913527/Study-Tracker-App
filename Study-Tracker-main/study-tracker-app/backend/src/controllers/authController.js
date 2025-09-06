const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const OTP_EXPIRY_MINUTES = process.env.OTP_EXPIRY_MINUTES || 5;
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refreshsecret';
const REFRESH_TOKENS = new Map(); // In-memory for demo
const User = require('../../../database/models/user');


// POST /auth/signup
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    user = await User.create({ name, email, password: hash });
    // Generate OTP and store for verification
    const otp = ('' + Math.floor(100000 + Math.random() * 900000)).substring(0, 6);
    const expiresAt = Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000;
    otps.set(email, { otp, expiresAt });
    // TODO: Send OTP via email
    res.json({ success: true, message: 'Signup successful, OTP sent', otp });
  } catch (e) {
    res.status(500).json({ error: 'Signup failed' });
  }
};

// POST /auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid password' });
    // Generate OTP and store for verification
    const otp = ('' + Math.floor(100000 + Math.random() * 900000)).substring(0, 6);
    const expiresAt = Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000;
    otps.set(email, { otp, expiresAt });
    // TODO: Send OTP via email
    res.json({ success: true, message: 'OTP sent', otp });
  } catch (e) {
    res.status(500).json({ error: 'Login failed' });
  }
};


// POST /auth/verify-otp
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const record = otps.get(email);
  if (!record || record.otp !== otp || Date.now() > record.expiresAt) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }
  otps.delete(email);
  // Issue tokens
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'User not found' });
  const token = jwt.sign({ userId: user._id, email }, JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ userId: user._id, email }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
  res.json({ token, refreshToken });
};
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refreshsupersecretkey';


const otps = new Map(); // In-memory OTP store (replace with Redis in prod)

exports.requestOtp = (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone required' });
  const otp = ('' + Math.floor(100000 + Math.random() * 900000)).substring(0, 6);
  const expiresAt = Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000;
  otps.set(phone, { otp, expiresAt });
  // TODO: Send OTP via SMS provider
  res.json({ success: true, message: 'OTP sent (stub)', otp }); // Expose OTP for testing
};

exports.verifyOtp = (req, res) => {
  const { phone, otp } = req.body;
  const record = otps.get(phone);
  if (!record || record.otp !== otp || Date.now() > record.expiresAt) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }
  otps.delete(phone);
  // TODO: Lookup/create user, issue tokens
  const userId = crypto.randomBytes(12).toString('hex'); // stub user id
  const token = jwt.sign({ userId, phone }, JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ userId, phone }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  res.json({ token, refreshToken });
};
