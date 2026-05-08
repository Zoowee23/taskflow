const adminService = require('../services/adminService');
const { sendSuccess } = require('../utils/apiResponse');
const { HTTP_STATUS } = require('../constants');

/**
 * GET /api/v1/admin/users
 */
const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const result = await adminService.getAllUsers(page, limit);
    sendSuccess(res, HTTP_STATUS.OK, 'Users fetched', result.users, result.meta);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/admin/users/:id
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await adminService.getUserById(req.params.id);
    sendSuccess(res, HTTP_STATUS.OK, 'User fetched', user);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/v1/admin/users/:id
 */
const deleteUser = async (req, res, next) => {
  try {
    await adminService.deleteUser(req.params.id, req.user.id);
    sendSuccess(res, HTTP_STATUS.OK, 'User deleted');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/admin/dashboard
 */
const getDashboard = async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats();
    sendSuccess(res, HTTP_STATUS.OK, 'Dashboard stats fetched', stats);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllUsers, getUserById, deleteUser, getDashboard };
