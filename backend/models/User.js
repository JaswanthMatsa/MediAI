const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    age: { type: Number, default: null },
    gender: { type: String, enum: ['male', 'female', 'other', 'prefer_not_to_say'], default: 'prefer_not_to_say' },
    medicalHistory: {
      allergies: [{ type: String }],
      chronicConditions: [{ type: String }],
      bloodType: { type: String, default: '' },
      currentMedications: [{ type: String }]
    },
    savedHospitals: [
      {
        hospitalId: { type: String },
        name: { type: String },
        address: { type: String },
        phone: { type: String },
        rating: { type: Number }
      }
    ],
    savedMedicines: [
      {
        name: { type: String },
        brandName: { type: String },
        uses: { type: String }
      }
    ],
    location: {
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
      address: { type: String, default: '' }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
