const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    userIdString: { type: String, required: false },
    title: { type: String, required: true },
    type: { type: String, enum: ['medicine', 'water', 'appointment', 'general'], default: 'medicine' },
    dosage: { type: String, default: '' },
    time: { type: String, required: true }, // e.g. "08:00 AM"
    frequency: { type: String, default: 'Daily' },
    days: [{ type: String }],
    active: { type: Boolean, default: true },
    completedToday: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Reminder || mongoose.model('Reminder', ReminderSchema);
