const jwt = require('jsonwebtoken');

const generateToken = (userId, email, name) => {
  const secret = process.env.JWT_SECRET || 'mediai_super_secret_jwt_key_2026_healthcare_app';
  return jwt.sign({ id: userId, email, name }, secret, { expiresIn: '7d' });
};

module.exports = generateToken;
