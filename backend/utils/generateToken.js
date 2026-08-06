const jwt = require('jsonwebtoken');

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('FATAL: JWT_SECRET environment variable is missing. Set JWT_SECRET in your environment or .env file before starting the server.');
  }
  return secret;
};

const generateToken = (userId, email, name) => {
  const secret = getJwtSecret();
  return jwt.sign({ id: userId, email, name }, secret, { expiresIn: '7d' });
};

module.exports = { generateToken, getJwtSecret };

