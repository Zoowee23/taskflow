const { verifyToken } = require('../utils/jwtHelper');
const { User } = require('../models');
const { sendError } = require('../utils/apiResponse');
const { HTTP_STATUS, ROLES } = require('../constants');

/**
 * Verify JWT and attach user to request
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Access token required');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    // Fetch fresh user from DB to ensure account still exists
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'User no longer exists');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Token has expired');
    }
    if (error.name === 'JsonWebTokenError') {
      return sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Invalid token');
    }
    next(error);
  }
};

/**
 * Restrict access to specific roles
 * @param {...string} roles - Allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendError(
        res,
        HTTP_STATUS.FORBIDDEN,
        'You do not have permission to perform this action'
      );
    }
    next();
  };
};

/**
 * Admin-only shorthand
 */
const adminOnly = authorize(ROLES.ADMIN);

module.exports = { authenticate, authorize, adminOnly };
