const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    userIdString: { type: String, required: false },
    message: { type: String, required: true },
    response: { type: String, required: true },
    symptomsExtracted: [{ type: String }],
    recommendedMedicines: [
      {
        name: { type: String },
        purpose: { type: String },
        warnings: { type: String }
      }
    ],
    recommendedHospitals: [
      {
        name: { type: String },
        address: { type: String },
        phone: { type: String }
      }
    ],
    severity: { type: String, enum: ['mild', 'moderate', 'severe', 'emergency'], default: 'mild' },
    safetyNotice: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Chat || mongoose.model('Chat', ChatSchema);
