const User = require('./User');
const Task = require('./Task');

// ─── Associations ─────────────────────────────────────────────────────────────
// One User has many Tasks
User.hasMany(Task, { foreignKey: 'createdBy', as: 'tasks', onDelete: 'CASCADE' });
// One Task belongs to one User
Task.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

module.exports = { User, Task };
