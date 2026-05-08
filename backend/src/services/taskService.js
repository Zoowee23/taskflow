const { Op } = require('sequelize');
const { Task, User } = require('../models');
const { HTTP_STATUS, PAGINATION, ROLES } = require('../constants');

/**
 * Build WHERE clause from query filters
 */
const buildWhereClause = (filters, userId, userRole) => {
  const where = {};

  // Non-admins can only see their own tasks
  if (userRole !== ROLES.ADMIN) {
    where.createdBy = userId;
  }

  if (filters.status) where.status = filters.status;
  if (filters.priority) where.priority = filters.priority;

  if (filters.search) {
    where[Op.or] = [
      { title: { [Op.like]: `%${filters.search}%` } },
      { description: { [Op.like]: `%${filters.search}%` } },
    ];
  }

  return where;
};

/**
 * Get paginated list of tasks
 */
const getTasks = async (filters, userId, userRole) => {
  const page = parseInt(filters.page, 10) || PAGINATION.DEFAULT_PAGE;
  const limit = Math.min(parseInt(filters.limit, 10) || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT);
  const offset = (page - 1) * limit;
  const sortBy = filters.sortBy || 'createdAt';
  const order = filters.order || 'DESC';

  const where = buildWhereClause(filters, userId, userRole);

  const { count, rows } = await Task.findAndCountAll({
    where,
    include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }],
    order: [[sortBy, order]],
    limit,
    offset,
  });

  return {
    tasks: rows,
    meta: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
  };
};

/**
 * Get a single task by ID
 */
const getTaskById = async (taskId, userId, userRole) => {
  const task = await Task.findByPk(taskId, {
    include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }],
  });

  if (!task) {
    const err = new Error('Task not found');
    err.statusCode = HTTP_STATUS.NOT_FOUND;
    err.isOperational = true;
    throw err;
  }

  // Non-admins can only access their own tasks
  if (userRole !== ROLES.ADMIN && task.createdBy !== userId) {
    const err = new Error('You do not have permission to access this task');
    err.statusCode = HTTP_STATUS.FORBIDDEN;
    err.isOperational = true;
    throw err;
  }

  return task;
};

/**
 * Create a new task
 */
const createTask = async (taskData, userId) => {
  const task = await Task.create({ ...taskData, createdBy: userId });
  return task;
};

/**
 * Update an existing task
 */
const updateTask = async (taskId, updates, userId, userRole) => {
  const task = await getTaskById(taskId, userId, userRole);
  await task.update(updates);
  return task;
};

/**
 * Delete a task
 */
const deleteTask = async (taskId, userId, userRole) => {
  const task = await getTaskById(taskId, userId, userRole);
  await task.destroy();
};

/**
 * Admin: get task statistics (SQLite-compatible)
 */
const getTaskStats = async () => {
  const { sequelize } = require('../config/database');
  const [results] = await sequelize.query(`
    SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN status = 'todo' THEN 1 ELSE 0 END) AS todo,
      SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed,
      SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) AS high_priority,
      SUM(CASE WHEN priority = 'medium' THEN 1 ELSE 0 END) AS medium_priority,
      SUM(CASE WHEN priority = 'low' THEN 1 ELSE 0 END) AS low_priority
    FROM tasks
  `);
  return results[0];
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask, getTaskStats };
