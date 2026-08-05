const express = require('express');
const { body } = require('express-validator');
const { sendMessage, getHistory, clearHistory } = require('../controllers/chatController');
const { optionalAuth, protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validateMiddleware');

const router = express.Router();

const chatRules = [
  body('message').trim().notEmpty().withMessage('Message is required')
];

router.post('/message', optionalAuth, chatRules, validate, sendMessage);
router.get('/history', optionalAuth, getHistory);
router.delete('/history', protect, clearHistory);

module.exports = router;
