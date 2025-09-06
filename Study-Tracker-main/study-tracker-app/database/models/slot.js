// Phase DB-07 — Slots (Recurring Rules) (Mongoose Schema)

const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  timetableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Timetable',
    required: true
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  startTime: {
    type: String,
    required: true // Format: HH:MM
  },
  endTime: {
    type: String,
    required: true // Format: HH:MM
  },
  recurrence: {
    type: [String], // e.g., ['Mon', 'Wed', 'Fri'] or RRULE string
    default: []
  },
  proofPolicy: {
    type: String,
    default: ''
  },
  preBufferMin: {
    type: Number,
    default: 0
  },
  graceMin: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

slotSchema.index({ timetableId: 1, startTime: 1 });

module.exports = mongoose.model('Slot', slotSchema);
