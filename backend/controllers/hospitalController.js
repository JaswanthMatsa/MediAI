const { fetchNearbyHospitalsFromOSM } = require('../services/overpassService');
const SavedHospital = require('../models/SavedHospital');
const asyncHandler = require('../utils/asyncHandler');
const { getIsConnected } = require('../config/db');

// In-memory fallback
const inMemorySavedHospitals = [];

// @desc Fetch Nearby Hospitals/Clinics/Pharmacies via OpenStreetMap
// @route GET /api/hospitals/nearby
const getNearbyHospitals = asyncHandler(async (req, res) => {
  const lat = parseFloat(req.query.lat) || 37.7749;
  const lng = parseFloat(req.query.lng) || -122.4194;
  const radius = parseInt(req.query.radius) || 5000;
  const filterType = req.query.type; // 'hospital' | 'clinic' | 'pharmacy' | 'emergency' | 'all'

  let hospitals = await fetchNearbyHospitalsFromOSM(lat, lng, radius);

  if (filterType && filterType !== 'all') {
    hospitals = hospitals.filter(h => h.type === filterType);
  }

  return res.json({
    success: true,
    userLocation: { latitude: lat, longitude: lng },
    count: hospitals.length,
    hospitals
  });
});

// @desc Save Hospital to User Favourites
// @route POST /api/hospitals/save
const saveHospital = asyncHandler(async (req, res) => {
  const { hospitalId, name, address, phone, rating, type, coordinates } = req.body;
  const userId = req.user.id;

  if (getIsConnected()) {
    const existing = await SavedHospital.findOne({ user: userId, hospitalId });
    if (!existing) {
      await SavedHospital.create({
        user: userId,
        hospitalId,
        name,
        address,
        phone,
        rating,
        type,
        coordinates
      });
    }
    const savedList = await SavedHospital.find({ user: userId });
    return res.json({ success: true, message: 'Hospital saved to favorites', savedHospitals: savedList });
  } else {
    inMemorySavedHospitals.push({ user: userId, hospitalId, name, address, phone, rating, type, coordinates });
    return res.json({
      success: true,
      message: 'Hospital saved to favorites (In-Memory)',
      savedHospitals: inMemorySavedHospitals
    });
  }
});

// @desc Get Saved Favourites
// @route GET /api/hospitals/saved
const getSavedHospitals = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  if (getIsConnected()) {
    const savedList = await SavedHospital.find({ user: userId });
    return res.json({ success: true, count: savedList.length, savedHospitals: savedList });
  } else {
    return res.json({ success: true, count: inMemorySavedHospitals.length, savedHospitals: inMemorySavedHospitals });
  }
});

// @desc Delete Saved Hospital
// @route DELETE /api/hospitals/saved/:hospitalId
const deleteSavedHospital = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const hospitalId = req.params.hospitalId;

  if (getIsConnected()) {
    await SavedHospital.deleteOne({ user: userId, hospitalId });
    const savedList = await SavedHospital.find({ user: userId });
    return res.json({ success: true, message: 'Hospital removed from favorites', savedHospitals: savedList });
  } else {
    const idx = inMemorySavedHospitals.findIndex(h => h.hospitalId === hospitalId);
    if (idx !== -1) inMemorySavedHospitals.splice(idx, 1);
    return res.json({ success: true, message: 'Hospital removed from favorites', savedHospitals: inMemorySavedHospitals });
  }
});

module.exports = { getNearbyHospitals, saveHospital, getSavedHospitals, deleteSavedHospital };
