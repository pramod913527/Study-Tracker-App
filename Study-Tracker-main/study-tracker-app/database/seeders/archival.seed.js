// Sample archival seed script for Phase DB-20

const mongoose = require('mongoose');
const Archival = require('../models/archival');

async function seed() {
  await mongoose.connect('mongodb://localhost:27017/studytracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  await Archival.deleteMany({});
  await Archival.create({
    collection: 'sessions',
    documentId: new mongoose.Types.ObjectId(),
    data: { example: 'archived session data' },
    archivedAt: new Date(),
    restoreAvailable: true
  });
  console.log('Archival seed complete');
  await mongoose.disconnect();
}

seed().catch(console.error);
