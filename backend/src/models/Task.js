const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { TASK_STATUS, TASK_PRIORITY } = require('../constants');

const Task = sequelize.define(
  'Task',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: { notEmpty: true, len: [1, 200] },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    priority: {
      type: DataTypes.ENUM(TASK_PRIORITY.LOW, TASK_PRIORITY.MEDIUM, TASK_PRIORITY.HIGH),
      defaultValue: TASK_PRIORITY.MEDIUM,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(TASK_STATUS.TODO, TASK_STATUS.IN_PROGRESS, TASK_STATUS.COMPLETED),
      defaultValue: TASK_STATUS.TODO,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
  },
  {
    tableName: 'tasks',
    timestamps: true,
    indexes: [
      { fields: ['createdBy'] },
      { fields: ['status'] },
      { fields: ['priority'] },
      { fields: ['dueDate'] },
    ],
  }
);

module.exports = Task;
