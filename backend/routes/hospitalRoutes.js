const express = require('express');
const { getNearbyHospitals, saveHospital, getSavedHospitals, deleteSavedHospital } = require('../controllers/hospitalController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/nearby', optionalAuth, getNearbyHospitals);
router.get('/saved', protect, getSavedHospitals);
router.post('/save', protect, saveHospital);
router.delete('/saved/:hospitalId', protect, deleteSavedHospital);

module.exports = router;
