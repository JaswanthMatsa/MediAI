const mongoose = require('mongoose');

const SearchHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    userIdString: { type: String, required: false },
    query: { type: String, required: true },
    type: { type: String, enum: ['medicine', 'hospital', 'symptom'], default: 'symptom' },
    resultCount: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.models.SearchHistory || mongoose.model('SearchHistory', SearchHistorySchema);
