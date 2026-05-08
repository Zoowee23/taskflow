const logger = require('../utils/logger');
const { HTTP_STATUS } = require('../constants');

/**
 * Centralized error handling middleware
 * Must be registered LAST in Express middleware chain
 */
const errorHandler = (err, req, res, next) => {
  logger.error(`${err.message} — ${req.method} ${req.originalUrl}`, { stack: err.stack });

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const errors = err.errors.map((e) => ({ field: e.path, message: e.message }));
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  // JWT errors (fallback)
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }

  // Operational errors (thrown intentionally)
  if (err.isOperational) {
    return res.status(err.statusCode || HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: err.message,
    });
  }

  // Unknown / programming errors — don't leak details in production
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_ERROR;
  const message =
    process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message;

  return res.status(statusCode).json({ success: false, message });
};

/**
 * 404 handler — must be registered before errorHandler
 */
const notFound = (req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};

module.exports = { errorHandler, notFound };
