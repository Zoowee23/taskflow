const { body, query, param } = require('express-validator');
const { TASK_STATUS, TASK_PRIORITY } = require('../constants');

const createTaskValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 1, max: 200 }).withMessage('Title must be 1–200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description must be under 2000 characters'),

  body('priority')
    .optional()
    .isIn(Object.values(TASK_PRIORITY))
    .withMessage(`Priority must be one of: ${Object.values(TASK_PRIORITY).join(', ')}`),

  body('status')
    .optional()
    .isIn(Object.values(TASK_STATUS))
    .withMessage(`Status must be one of: ${Object.values(TASK_STATUS).join(', ')}`),

  body('dueDate')
    .optional()
    .isDate({ format: 'YYYY-MM-DD' }).withMessage('Due date must be a valid date (YYYY-MM-DD)')
    .custom((value) => {
      if (new Date(value) < new Date().setHours(0, 0, 0, 0)) {
        throw new Error('Due date cannot be in the past');
      }
      return true;
    }),
];

const updateTaskValidator = [
  param('id').isInt({ min: 1 }).withMessage('Task ID must be a positive integer'),

  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 }).withMessage('Title must be 1–200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description must be under 2000 characters'),

  body('priority')
    .optional()
    .isIn(Object.values(TASK_PRIORITY))
    .withMessage(`Priority must be one of: ${Object.values(TASK_PRIORITY).join(', ')}`),

  body('status')
    .optional()
    .isIn(Object.values(TASK_STATUS))
    .withMessage(`Status must be one of: ${Object.values(TASK_STATUS).join(', ')}`),

  body('dueDate')
    .optional()
    .isDate({ format: 'YYYY-MM-DD' }).withMessage('Due date must be a valid date (YYYY-MM-DD)'),
];

const listTasksValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1–100'),
  query('status').optional().isIn(Object.values(TASK_STATUS)).withMessage('Invalid status'),
  query('priority').optional().isIn(Object.values(TASK_PRIORITY)).withMessage('Invalid priority'),
  query('search').optional().trim().isLength({ max: 100 }).withMessage('Search too long'),
  query('sortBy').optional().isIn(['createdAt', 'dueDate', 'priority', 'status']).withMessage('Invalid sort field'),
  query('order').optional().isIn(['ASC', 'DESC']).withMessage('Order must be ASC or DESC'),
];

module.exports = { createTaskValidator, updateTaskValidator, listTasksValidator };
