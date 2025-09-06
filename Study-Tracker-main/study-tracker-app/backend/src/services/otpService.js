// Simple in-memory OTP store for development/testing
const otps = new Map();
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.sendOtp = async (contact) => {
  const otp = generateOtp();
  otps.set(contact, { otp, expires: Date.now() + OTP_EXPIRY_MS });
  // In production, send via SMS/email here
  return otp;
};

exports.verifyOtp = async (contact, otp) => {
  const entry = otps.get(contact);
  if (!entry) return false;
  if (entry.otp !== otp) return false;
  if (Date.now() > entry.expires) return false;
  otps.delete(contact);
  return true;
};
