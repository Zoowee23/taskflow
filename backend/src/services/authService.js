const { User } = require('../models');
const { generateToken } = require('../utils/jwtHelper');
const { HTTP_STATUS } = require('../constants');

/**
 * Register a new user
 */
const register = async ({ name, email, password }) => {
  // Check for existing email
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    const err = new Error('Email is already registered');
    err.statusCode = HTTP_STATUS.CONFLICT;
    err.isOperational = true;
    throw err;
  }

  const user = await User.create({ name, email, password });

  const token = generateToken({ id: user.id, email: user.email, role: user.role });

  return { user: user.toSafeObject(), token };
};

/**
 * Login an existing user
 */
const login = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });

  if (!user || !(await user.comparePassword(password))) {
    const err = new Error('Invalid email or password');
    err.statusCode = HTTP_STATUS.UNAUTHORIZED;
    err.isOperational = true;
    throw err;
  }

  const token = generateToken({ id: user.id, email: user.email, role: user.role });

  return { user: user.toSafeObject(), token };
};

/**
 * Get current authenticated user profile
 */
const getProfile = async (userId) => {
  const user = await User.findByPk(userId, { attributes: { exclude: ['password'] } });
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = HTTP_STATUS.NOT_FOUND;
    err.isOperational = true;
    throw err;
  }
  return user;
};

module.exports = { register, login, getProfile };
