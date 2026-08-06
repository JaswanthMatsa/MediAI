const express = require('express');
const { getReminders, createReminder, toggleReminder, calculateBMI, getHealthInfo } = require('../controllers/healthController');
const { optionalAuth, protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/reminders', protect, getReminders);
router.post('/reminders', protect, createReminder);
router.put('/reminders/:id/toggle', protect, toggleReminder);
router.post('/bmi', calculateBMI);
router.get('/info', getHealthInfo);

module.exports = router;
