const { User, Task } = require('../models');
const { HTTP_STATUS, PAGINATION } = require('../constants');

/**
 * Get all users (admin only)
 */
const getAllUsers = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const { count, rows } = await User.findAndCountAll({
    attributes: { exclude: ['password'] },
    order: [['createdAt', 'DESC']],
    limit,
    offset,
  });
  return {
    users: rows,
    meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
  };
};

/**
 * Get a single user by ID (admin only)
 */
const getUserById = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] },
    include: [{ model: Task, as: 'tasks' }],
  });
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = HTTP_STATUS.NOT_FOUND;
    err.isOperational = true;
    throw err;
  }
  return user;
};

/**
 * Delete a user (admin only)
 */
const deleteUser = async (userId, requestingAdminId) => {
  if (parseInt(userId, 10) === requestingAdminId) {
    const err = new Error('Admins cannot delete their own account');
    err.statusCode = HTTP_STATUS.BAD_REQUEST;
    err.isOperational = true;
    throw err;
  }
  const user = await getUserById(userId);
  await user.destroy();
};

/**
 * Dashboard summary stats (SQLite-compatible)
 */
const getDashboardStats = async () => {
  const [totalUsers, totalTasks] = await Promise.all([
    User.count(),
    Task.count(),
  ]);

  const { sequelize } = require('../config/database');
  const [taskStats] = await sequelize.query(`
    SELECT
      SUM(CASE WHEN status = 'todo' THEN 1 ELSE 0 END) AS todo,
      SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed,
      SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) AS high,
      SUM(CASE WHEN priority = 'medium' THEN 1 ELSE 0 END) AS medium,
      SUM(CASE WHEN priority = 'low' THEN 1 ELSE 0 END) AS low
    FROM tasks
  `);

  return { totalUsers, totalTasks, taskStats: taskStats[0] };
};

module.exports = { getAllUsers, getUserById, deleteUser, getDashboardStats };
