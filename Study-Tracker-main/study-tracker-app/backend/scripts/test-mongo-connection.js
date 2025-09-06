// Quick test script to verify direct MongoDB Atlas connection
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '../../.env.dev' });

const uri = process.env.MONGODB_URI;

async function testConnection() {
  const client = new MongoClient(uri, { serverApi: { version: '1', strict: true, deprecationErrors: true } });
  try {
    await client.connect();
    const dbs = await client.db().admin().listDatabases();
    console.log('Successfully connected! Databases:', dbs.databases.map(db => db.name));
  } catch (err) {
    console.error('Connection failed:', err.message);
  } finally {
    await client.close();
  }
}

testConnection();
