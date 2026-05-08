const authService = require('../services/authService');
const { sendSuccess } = require('../utils/apiResponse');
const { HTTP_STATUS } = require('../constants');

/**
 * POST /api/v1/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const result = await authService.register({ name, email, password });
    sendSuccess(res, HTTP_STATUS.CREATED, 'Registration successful', result);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    sendSuccess(res, HTTP_STATUS.OK, 'Login successful', result);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/auth/me
 */
const getMe = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);
    sendSuccess(res, HTTP_STATUS.OK, 'Profile fetched', user);
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe };
