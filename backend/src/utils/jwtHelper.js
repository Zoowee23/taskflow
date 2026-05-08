const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT access token
 * @param {object} payload - Data to embed (id, email, role)
 * @returns {string} signed token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    issuer: 'taskflow-pro',
  });
};

/**
 * Verify and decode a JWT token
 * @param {string} token
 * @returns {object} decoded payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET, { issuer: 'taskflow-pro' });
};

module.exports = { generateToken, verifyToken };
