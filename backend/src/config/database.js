const { Sequelize } = require('sequelize');
const path = require('path');
const logger = require('../utils/logger');

// SQLite — zero-config, file-based database. Perfect for development & demos.
const dbPath = path.join(__dirname, '../../data/taskflow.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: process.env.NODE_ENV === 'development' ? (msg) => logger.debug(msg) : false,
  define: {
    timestamps: true,
    underscored: false,
  },
});

const connectDB = async () => {
  // Ensure data directory exists
  const fs = require('fs');
  const dataDir = path.dirname(dbPath);
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  await sequelize.authenticate();
  logger.info('SQLite connection established successfully.');
  await sequelize.sync({ alter: true });
  logger.info('Database models synchronized.');
};

module.exports = { sequelize, connectDB };
