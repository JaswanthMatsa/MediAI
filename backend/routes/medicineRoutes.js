const express = require('express');
const { searchMedicines, getMedicinesBySymptom, saveMedicine } = require('../controllers/medicineController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/search', optionalAuth, searchMedicines);
router.get('/symptom/:symptom', optionalAuth, getMedicinesBySymptom);
router.post('/save', protect, saveMedicine);

module.exports = router;
