// Minimal Mongoose connection test for Atlas
const mongoose = require('mongoose');
require('dotenv').config({ path: '../../.env.dev' });

const uri = process.env.MONGODB_URI;

async function testMongooseConnection() {
  try {
    await mongoose.connect(uri);
    console.log('Mongoose connected successfully!');
    await mongoose.disconnect();
  } catch (err) {
    console.error('Mongoose connection failed:', err.message);
  }
}

testMongooseConnection();
