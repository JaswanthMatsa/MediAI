const { searchOpenFDA, FALLBACK_MEDICINES } = require('../services/openFdaService');
const User = require('../models/User');
const SearchHistory = require('../models/SearchHistory');
const { getIsConnected } = require('../config/db');

// @desc Search Medicine Database (OpenFDA API)
// @route GET /api/medicines/search
const searchMedicines = async (req, res, next) => {
  try {
    const query = req.query.q || '';
    const userId = req.user ? req.user.id : null;

    const medicines = await searchOpenFDA(query);

    if (getIsConnected() && query) {
      await SearchHistory.create({
        user: userId,
        query,
        type: 'medicine',
        resultCount: medicines.length
      });
    }

    return res.json({
      success: true,
      query,
      count: medicines.length,
      medicines
    });
  } catch (error) {
    next(error);
  }
};

// @desc Search Medicines by Symptom
// @route GET /api/medicines/symptom/:symptom
const getMedicinesBySymptom = async (req, res, next) => {
  try {
    const symptom = req.params.symptom || 'fever';
    const medicines = await searchOpenFDA(symptom);

    return res.json({
      success: true,
      symptom,
      count: medicines.length,
      medicines
    });
  } catch (error) {
    next(error);
  }
};

// In-memory fallback for saved medicines
const inMemorySavedMedicines = [];

// @desc Save Medicine to Favourites
// @route POST /api/medicines/save
const saveMedicine = async (req, res, next) => {
  try {
    const { name, brandName, uses } = req.body;
    const userId = req.user.id;

    if (getIsConnected()) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      const exists = user.savedMedicines.some(m => m.name === name);
      if (!exists) {
        user.savedMedicines.push({ name, brandName, uses });
        await user.save();
      }
      return res.json({ success: true, message: 'Medicine saved to favorites', savedMedicines: user.savedMedicines });
    } else {
      const existing = inMemorySavedMedicines.find(m => m.userId === userId && m.name === name);
      if (!existing) {
        inMemorySavedMedicines.push({ userId, name, brandName, uses });
      }
      const userList = inMemorySavedMedicines.filter(m => m.userId === userId);
      return res.json({
        success: true,
        message: 'Medicine saved to favorites (In-Memory)',
        savedMedicines: userList
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { searchMedicines, getMedicinesBySymptom, saveMedicine };
