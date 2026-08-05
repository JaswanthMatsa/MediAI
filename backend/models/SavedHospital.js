const mongoose = require('mongoose');

const SavedHospitalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hospitalId: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    rating: { type: Number, default: 4.5 },
    type: { type: String, enum: ['hospital', 'clinic', 'pharmacy', 'emergency'], default: 'hospital' },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.SavedHospital || mongoose.model('SavedHospital', SavedHospitalSchema);
