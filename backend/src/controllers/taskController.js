const taskService = require('../services/taskService');
const { sendSuccess } = require('../utils/apiResponse');
const { HTTP_STATUS } = require('../constants');

/**
 * GET /api/v1/tasks
 */
const getTasks = async (req, res, next) => {
  try {
    const result = await taskService.getTasks(req.query, req.user.id, req.user.role);
    sendSuccess(res, HTTP_STATUS.OK, 'Tasks fetched', result.tasks, result.meta);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/tasks/:id
 */
const getTask = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(
      parseInt(req.params.id, 10),
      req.user.id,
      req.user.role
    );
    sendSuccess(res, HTTP_STATUS.OK, 'Task fetched', task);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/v1/tasks
 */
const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.body, req.user.id);
    sendSuccess(res, HTTP_STATUS.CREATED, 'Task created', task);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/v1/tasks/:id
 */
const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(
      parseInt(req.params.id, 10),
      req.body,
      req.user.id,
      req.user.role
    );
    sendSuccess(res, HTTP_STATUS.OK, 'Task updated', task);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/v1/tasks/:id
 */
const deleteTask = async (req, res, next) => {
  try {
    await taskService.deleteTask(
      parseInt(req.params.id, 10),
      req.user.id,
      req.user.role
    );
    sendSuccess(res, HTTP_STATUS.OK, 'Task deleted');
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/tasks/stats  (admin)
 */
const getTaskStats = async (req, res, next) => {
  try {
    const stats = await taskService.getTaskStats();
    sendSuccess(res, HTTP_STATUS.OK, 'Task stats fetched', stats);
  } catch (err) {
    next(err);
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask, getTaskStats };
