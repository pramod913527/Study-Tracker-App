
const mongoose = require('mongoose');
const createApp = require('./index');

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/studytracker';

mongoose.connect(MONGODB_URI, { })
  .then(() => {
    // Load models on the connected mongoose instance
  const User = mongoose.model('User', require('../../database/models/user').schema);
  const UserRole = mongoose.model('UserRole', require('../../database/models/userRole').schema);
  const Role = mongoose.model('Role', require('../../database/models/role').schema);
  const Org = mongoose.model('Org', require('../../database/models/org').schema);
  const Invitation = mongoose.model('Invitation', require('../../database/models/invitation').schema);
  const Settings = mongoose.model('Settings', require('../../database/models/settings').schema);

  const Subject = mongoose.model('Subject', require('../../database/models/subject').schema);
  const Timetable = mongoose.model('Timetable', require('../../database/models/timetable').schema);
  const Slot = mongoose.model('Slot', require('../../database/models/slot').schema);
  const Session = mongoose.model('Session', require('../../database/models/session').schema);
  const Proof = mongoose.model('Proof', require('../../database/models/proof').schema);
  const models = { User, UserRole, Role, Org, Invitation, Settings, Subject, Timetable, Slot, Session, Proof };
    const app = createApp({ mongooseConnection: mongoose.connection, models });
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
