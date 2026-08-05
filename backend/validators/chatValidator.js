const { body } = require('express-validator');

const chatRules = [
  body('message').trim().notEmpty().withMessage('Symptom query message is required')
];

module.exports = { chatRules };
