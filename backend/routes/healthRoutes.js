const express = require('express');
const { getReminders, createReminder, toggleReminder, calculateBMI, getHealthInfo } = require('../controllers/healthController');
const { optionalAuth, protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/reminders', optionalAuth, getReminders);
router.post('/reminders', optionalAuth, createReminder);
router.put('/reminders/:id/toggle', optionalAuth, toggleReminder);
router.post('/bmi', calculateBMI);
router.get('/info', getHealthInfo);

module.exports = router;
